import { randomUUID, randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { GameHost, type HostEvent } from "@noname/game-host";
import { OnlineError, ONLINE_BUILD, modePreset, normalizeCharacterPool, type Account, type Room, type ChatMessage, text } from "@noname/online-protocol";
import { Database, hashPassword, verifyPassword } from "./database";
type InternalRoom = { view: Room; passwordHash?: string; chat: ChatMessage[]; startupTimer?: NodeJS.Timeout; touchedAt?: number };
const maxInstances = () => Math.max(1, Math.min(4, Number(process.env.MAX_GAME_INSTANCES) || 2));
const maxRooms = () => Math.max(1, Math.min(10, Number(process.env.MAX_ROOMS) || 10));
const resumeGrace = () => Math.max(30000, Math.min(900000, Number(process.env.RESUME_GRACE_MS) || 120000));
const maintenance = () => process.env.ONLINE_MAINTENANCE === "1" || !!process.env.MAINTENANCE_FILE && existsSync(process.env.MAINTENANCE_FILE);
export class Rooms {
  readonly rooms = new Map<string, InternalRoom>();
  private active = new Map<string, string>();
  private queue: Promise<unknown> = Promise.resolve();
  private generations = new Map<string, number>();
  // Explicit page navigation has a bounded lease; ordinary disconnects do not.
  private navigation = new Map<string, { roomId: string; expiresAt: number }>();
  constructor(private db: Database, readonly hosts: GameHost, private publish: (accountId: string | null, type: string, payload: unknown) => void,
    private isConnected?: (accountId: string) => boolean) {}
  async restore() {
    // Called before accepting connections, under the database's single-process
    // lease. Every room from the previous process has lost all connections.
    // Match results live separately and are not removed.
    await this.db.clearRooms();
  }
  status() {
    const states: Record<string, number> = {};
    for (const room of this.rooms.values()) states[room.view.state] = (states[room.view.state] || 0) + 1;
    return { total: this.rooms.size, activeSeats: this.active.size, states };
  }
  async adminClose(roomId: string, message = "房间已由管理员关闭") {
    return this.serial(async () => {
      const room = this.rooms.get(roomId);
      if (!room || room.view.state === "closed") throw new OnlineError("ROOM_CLOSED", "房间不存在或已关闭");
      const instanceId = room.view.instanceId;
      if (instanceId) await this.hosts.stop(instanceId);
      room.view.state = "closed"; delete room.view.instanceId; delete room.view.instanceReady;
      await this.save(room);
      for (const member of room.view.members) {
        if (this.active.get(member.id) !== roomId) continue;
        this.navigation.delete(member.id);
        this.active.delete(member.id);
        this.publish(member.id, instanceId ? "game.failed" : "room.left", { roomId, instanceId, message });
      }
      this.rooms.delete(roomId);
      return {};
    });
  }
  serial<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.queue.then(async () => {
      // The first release is one process. Serialize mutations and roll back memory
      // if persistence rejects, so an unsuccessful join cannot occupy a seat.
      const before = new Map([...this.rooms].map(([id, room]) => [id, { room, view: structuredClone(room.view), chat: room.chat.slice(), touchedAt: room.touchedAt }]));
      const activeBefore = new Map(this.active);
      const generationsBefore = new Map(this.generations);
      const navigationBefore = new Map(this.navigation);
      try { return await operation(); }
      catch (error) {
        this.rooms.clear();
        for (const [id, state] of before) { state.room.view = state.view; state.room.chat = state.chat; state.room.touchedAt = state.touchedAt; this.rooms.set(id, state.room); }
        this.active = activeBefore; this.generations = generationsBefore; this.navigation = navigationBefore;
        throw error;
      }
    });
    this.queue = result.catch(() => {}); return result;
  }
  private require(id: string, accountId: string) {
    const room = this.rooms.get(id);
    if (!room || room.view.state === "closed") throw new OnlineError("ROOM_CLOSED", "房间已关闭");
    if (this.active.get(accountId) !== id || !room.view.members.some(member => member.id === accountId && !member.abandoned)) throw new OnlineError("FORBIDDEN", "你不在此房间");
    return room;
  }
  private owner(room: InternalRoom, id: string) {
    if (room.view.ownerId !== id) throw new OnlineError("FORBIDDEN", "仅房主可以操作");
  }
  private transferOwner(room: InternalRoom) {
    const members = room.view.members.filter(member => !member.abandoned && this.active.get(member.id) === room.view.id);
    room.view.ownerId = members.find(member => this.memberConnected(room, member))?.id || members[0]?.id || "";
  }
  private memberConnected(room: InternalRoom, member: Room["members"][number]) {
    return !member.abandoned && this.active.get(member.id) === room.view.id
      && (this.isConnected ? this.isConnected(member.id) : member.online);
  }
  private async closeIfEmpty(room: InternalRoom) {
    if (room.view.members.some(member => this.memberConnected(room, member))) return false;
    if (room.view.members.some(member => {
      const navigation = this.navigation.get(member.id);
      return !member.abandoned && this.active.get(member.id) === room.view.id
        && navigation?.roomId === room.view.id && navigation.expiresAt > Date.now();
    })) return false;
    const { id, instanceId } = room.view;
    // Invalidate host callbacks before shutting the browser down, so a late
    // started/finished callback cannot save this room again.
    room.view.state = "closed";
    delete room.view.instanceId; delete room.view.instanceReady;
    await this.db.deleteRoom(id);
    clearTimeout(room.startupTimer); room.startupTimer = undefined;
    for (const member of room.view.members) {
      delete member.resumeUntil;
      if (this.active.get(member.id) !== id) continue;
      this.navigation.delete(member.id);
      this.active.delete(member.id);
      this.generations.set(member.id, (this.generations.get(member.id) || 0) + 1);
      this.publish(member.id, "room.left", { roomId: id });
    }
    this.rooms.delete(id);
    this.publish(null, "rooms.changed", {});
    if (instanceId) await this.hosts.stop(instanceId).catch(error => {
      // The room has already been deleted from storage; do not roll it back
      // into the lobby if releasing an already-dead host reports an error.
      console.error("Empty room host cleanup failed", { roomId: id, instanceId, message: String(error?.message || error).slice(0, 300) });
    });
    return true;
  }
  private waiting(room: InternalRoom) {
    if (room.view.state !== "waiting") throw new OnlineError("ALREADY_IN_GAME", "当前房间不能修改");
  }
  private async save(room: InternalRoom) {
    room.view.revision++;
    await this.db.saveRoom(structuredClone(room.view), room.passwordHash);
    room.touchedAt = Date.now();
    for (const member of room.view.members) if (this.active.get(member.id) === room.view.id) this.publish(member.id, "room.updated", room.view);
    this.publish(null, "rooms.changed", {});
  }
  list(accountId: string, query: Record<string, unknown>) {
    const mode = String(query.modeId || "identity"), keyword = String(query.q || "").trim().toLowerCase();
    const page = Math.max(1, Math.min(1000, Number(query.page) || 1));
    const list = [...this.rooms.values()].map(room => room.view).filter(room => room.state !== "closed" && room.modeId === mode
      && (room.visibility === "public" || this.active.get(accountId) === room.id)
      && (!keyword || room.name.toLowerCase().includes(keyword) || room.code.toLowerCase() === keyword)
      && (!query.state || query.state === "all" || room.state === query.state)
      && (!query.capacity || room.capacity === Number(query.capacity)))
      .sort((a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id));
    const items = list.slice((page - 1) * 12, page * 12).map(room => {
      const authorized = this.active.get(accountId) === room.id;
      const result: Room = authorized ? { ...room, members: room.members.map(member => ({ ...member })) } : {
        id: room.id, code: room.code, name: room.name, ownerId: "", modeId: room.modeId, preset: room.preset,
        capacity: room.capacity, visibility: room.visibility, locked: room.locked, state: room.state,
        revision: room.revision, createdAt: room.createdAt, characterPool: room.characterPool,
        // Search results only need seat occupancy. Account identifiers,
        // player codes, presence and the worker instance stay private.
        members: room.members.map(member => ({ id: "", code: "", nickname: "", avatar: "", ready: false, online: false, seat: member.seat, isAI: member.isAI })),
      };
      return result;
    });
    return { items, total: list.length, page };
  }
  current(accountId: string) { const id = this.active.get(accountId); return id ? this.rooms.get(id)?.view : null; }
  read<T>(snapshot: () => T): Promise<T> { return this.queue.then(snapshot); }
  async command(account: Account, type: string, payload: Record<string, any>, isCurrent = () => true) {
    return this.serial(async () => {
      if (!isCurrent()) throw new OnlineError("AUTH_EXPIRED", "此连接已失效");
      if (maintenance() && ["room.create", "room.join", "room.start", "room.rematch"].includes(type)) throw new OnlineError("MAINTENANCE", "服务器正在维护，暂不接受新的对局");
      if (type === "room.create") {
        if (this.active.has(account.id)) throw new OnlineError("ALREADY_IN_GAME", "请先离开当前房间");
        if (this.rooms.size >= maxRooms()) throw new OnlineError("SERVICE_BUSY", "服务器房间数量已达上限，请稍后再试");
        const mode = modePreset(payload.modeId);
        if (!mode || payload.preset !== mode.preset || !(mode.players as readonly number[]).includes(payload.capacity)) throw new OnlineError("INVALID_ARGUMENT", "不支持此玩法或人数规则");
        if (!["public", "invite"].includes(payload.visibility)) throw new OnlineError("INVALID_ARGUMENT", "无效房间类型");
        const password = payload.password ? text(payload.password, 4, 64) : undefined;
        const room: InternalRoom = { view: {
          id: randomUUID(), code: randomBytes(6).toString("hex").toUpperCase(), name: text(payload.name, 1, 32), ownerId: account.id,
          modeId: mode.id, preset: mode.preset, capacity: payload.capacity, visibility: payload.visibility, locked: !!password,
          characterPool: normalizeCharacterPool(payload.characterPool),
          state: "waiting", revision: 0, members: [{ ...account, ready: false, online: true, seat: 0 }], createdAt: Date.now(),
        }, passwordHash: password ? await hashPassword(password) : undefined, chat: [] };
        await this.save(room); this.rooms.set(room.view.id, room); this.active.set(account.id, room.view.id);
        return room.view;
      }
      if (type === "room.join") {
        const code = payload.code ? text(payload.code, 1, 32).toUpperCase() : undefined;
        const room = code ? [...this.rooms.values()].find(item => item.view.code === code) : this.rooms.get(String(payload.roomId));
        if (!room || (room.view.visibility === "invite" && room.view.code !== code)) throw new OnlineError("ROOM_CLOSED", "房间不存在或邀请码无效");
        if (room.view.members.some(member => member.id === account.id) && this.active.get(account.id) === room.view.id) return room.view;
        if (this.active.has(account.id)) throw new OnlineError("ALREADY_IN_GAME", "请先离开当前房间");
        this.waiting(room);
        if (room.view.members.length >= room.view.capacity) throw new OnlineError("ROOM_FULL", "房间已满");
        if (room.passwordHash && !(await verifyPassword(String(payload.password || ""), room.passwordHash))) throw new OnlineError("FORBIDDEN", "房间密码不正确");
        let seat = 0; while (room.view.members.some(member => member.seat === seat)) seat++;
        room.view.members.push({ ...account, ready: false, online: true, seat });
        this.active.set(account.id, room.view.id); await this.save(room); return room.view;
      }
      const room = this.require(String(payload.roomId), account.id), view = room.view;
      if (!["room.leave", "room.navigate"].includes(type) && payload.revision !== undefined && payload.revision !== view.revision) throw new OnlineError("STALE_REVISION", "房间状态已更新，请重试");
      if (type === "room.navigate") {
        if (payload.target !== "game" && payload.target !== "lobby") throw new OnlineError("INVALID_ARGUMENT", "无效页面切换");
        if (payload.target === "game" && (!view.instanceReady || !["starting", "in_game"].includes(view.state) || payload.instanceId !== view.instanceId)) {
          throw new OnlineError("RESUME_EXPIRED", "对局分配已失效，请返回房间重新准备");
        }
        const expiresAt = Date.now() + 120000;
        this.navigation.set(account.id, { roomId: view.id, expiresAt });
        return { expiresAt };
      }
      if (type === "room.leave" || type === "room.kick") {
        const target = type === "room.kick" ? text(payload.accountId, 1, 100) : account.id;
        if (type === "room.kick") { this.owner(room, account.id); this.waiting(room); if (target === account.id) throw new OnlineError("INVALID_ARGUMENT", "请使用离房操作"); }
        const member = view.members.find(item => item.id === target);
        if (!member) throw new OnlineError("FORBIDDEN", "席位不存在");
        this.navigation.delete(target);
        const wasStarting = view.state === "starting", startingInstanceId = wasStarting ? view.instanceId : undefined;
        if (wasStarting) {
          // The allocated host expects the original seats to initialise. A
          // departure cancels that allocation instead of stranding its peers.
          view.state = "waiting";
          delete view.instanceId; delete view.instanceReady;
          view.members.forEach(item => { item.ready = !!item.isAI; delete item.resumeUntil; });
        }
        if (view.state === "in_game") {
          member.online = false; member.abandoned = true; delete member.resumeUntil;
          // The worker may already have crashed. Leaving the room still needs
          // to release the seat and let the remaining players continue/finish.
          await this.hosts.receive(view.instanceId!, { accountId: target, type: "disconnect" }).catch(() => {});
        } else view.members = view.members.filter(item => item.id !== target);
        if (this.active.get(target) === view.id) this.active.delete(target);
        this.generations.set(target, (this.generations.get(target) || 0) + 1);
        if (view.ownerId === target) this.transferOwner(room);
        if (!await this.closeIfEmpty(room)) await this.save(room);
        this.publish(target, "room.left", {});
        if (wasStarting) {
          clearTimeout(room.startupTimer); room.startupTimer = undefined;
          if (startingInstanceId) {
            await this.hosts.stop(startingInstanceId).catch(error => {
              console.error("Cancelled room host cleanup failed", { roomId: view.id, instanceId: startingInstanceId, message: String(error?.message || error).slice(0, 300) });
            });
            for (const item of view.members) if (this.active.get(item.id) === view.id) {
              this.publish(item.id, "game.failed", { instanceId: startingInstanceId, message: "有玩家退出，已取消本次对局分配。可返回房间重新准备。" });
            }
          }
        }
        return null;
      }
      if (type === "room.ai") {
        this.waiting(room); this.owner(room, account.id);
        const { seats, enabled } = payload;
        if (typeof enabled !== "boolean" || !Array.isArray(seats) || !seats.length || seats.length > view.capacity
          || new Set(seats).size !== seats.length || seats.some(seat => !Number.isInteger(seat) || seat < 0 || seat >= view.capacity)) {
          throw new OnlineError("INVALID_ARGUMENT", "请选择有效的 AI 席位");
        }
        for (const seat of seats) {
          const member = view.members.find(member => member.seat === seat);
          if (enabled ? !!member : !member?.isAI) throw new OnlineError("INVALID_ARGUMENT", enabled ? "只能在空位添加 AI" : "只能移除 AI 席位");
        }
        if (enabled) {
          for (const seat of seats) view.members.push({ id: `ai:${randomUUID()}`, code: "", nickname: `AI ${seat + 1}号`, avatar: "caocao", seat, isAI: true, ready: true, online: false });
        } else view.members = view.members.filter(member => !seats.includes(member.seat));
      } else if (type === "room.ready") {
        this.waiting(room);
        if (typeof payload.ready !== "boolean") throw new OnlineError("INVALID_ARGUMENT", "无效准备状态");
        view.members.find(item => item.id === account.id)!.ready = payload.ready;
      } else if (type === "room.update") {
        this.waiting(room); this.owner(room, account.id);
        if (payload.name === undefined && payload.characterPool === undefined) throw new OnlineError("INVALID_ARGUMENT", "请提供要修改的房间规则");
        if (payload.name !== undefined) view.name = text(payload.name, 1, 32);
        if (payload.characterPool !== undefined) view.characterPool = normalizeCharacterPool(payload.characterPool);
        view.members.forEach(member => member.ready = !!member.isAI);
      } else if (type === "room.rematch") {
        this.owner(room, account.id);
        if (view.state !== "finished") throw new OnlineError("INVALID_ARGUMENT", "对局尚未结束");
        view.members = view.members.filter(member => member.isAI || this.active.get(member.id) === view.id);
        view.state = "waiting"; delete view.instanceId; delete view.instanceReady;
        view.members.forEach(member => { member.ready = !!member.isAI; delete member.abandoned; delete member.resumeUntil; });
      } else if (type === "room.start") {
        this.waiting(room); this.owner(room, account.id);
        if (view.members.length !== view.capacity || !view.members.every(member => member.isAI || member.ready && member.online)) throw new OnlineError("NOT_READY", "请等待真人玩家准备，并由房主为剩余空位添加 AI 或等待玩家加入");
        if (this.hosts.count >= maxInstances()) throw new OnlineError("SERVICE_BUSY", "服务器对局已满，请稍后再试");
        view.characterPool = normalizeCharacterPool(view.characterPool);
        view.state = "starting"; view.instanceId = randomUUID(); view.instanceReady = false;
        await this.save(room);
        const instanceId = view.instanceId;
        room.startupTimer = setTimeout(() => { void this.recoverHostFailure(room, instanceId); }, 120000);
        void this.hosts.start({ instanceId, roomId: view.id, modeId: view.modeId, characterPool: structuredClone(view.characterPool), build: process.env.ONLINE_BUILD_ID || ONLINE_BUILD, members: [...view.members].sort((a, b) => a.seat - b.seat) }, event => this.hostEvent(room, instanceId, event))
          .catch(() => this.recoverHostFailure(room, instanceId));
        return view;
      } else if (type === "room.chat") {
        const message: ChatMessage = { id: randomUUID(), accountId: account.id, nickname: account.nickname, text: text(payload.text, 1, 300), at: Date.now() };
        room.chat.push(message); if (room.chat.length > 100) room.chat.shift();
        for (const member of view.members) if (this.active.get(member.id) === view.id) this.publish(member.id, "room.chat", message);
        return message;
      } else throw new OnlineError("UNKNOWN_COMMAND", "未开放此操作");
      await this.save(room); return view;
    });
  }
  private hostEvent(room: InternalRoom, instanceId: string, event: HostEvent) {
    if (room.view.instanceId !== instanceId) return;
    if (event.type === "ready") {
      void this.serial(async () => {
        if (room.view.instanceId !== instanceId || room.view.state !== "starting") return;
        room.view.instanceReady = true;
        await this.save(room);
        for (const member of room.view.members) if (this.active.get(member.id) === room.view.id) this.publish(member.id, "game.assigned", { roomId: room.view.id, instanceId, modeId: room.view.modeId });
      }).catch(() => this.recoverHostFailure(room, instanceId));
    } else if (event.type === "started") {
      void this.serial(async () => {
        if (room.view.instanceId !== instanceId || room.view.state !== "starting") return;
        room.view.state = "in_game";
        await this.save(room);
        clearTimeout(room.startupTimer); room.startupTimer = undefined;
      }).catch(() => this.recoverHostFailure(room, instanceId));
    } else if (event.type === "resumed") {
      if (event.accountId) this.publish(event.accountId, "game.resumed", { instanceId });
    } else if (event.type === "resumeFailed") {
      if (event.accountId) this.publish(event.accountId, "game.resumeFailed", { instanceId });
    } else if (event.type === "choiceClosed") {
      if (event.accountId && this.active.get(event.accountId) === room.view.id) this.publish(event.accountId, "game.choiceClosed", { instanceId, token: event.token });
    } else if (event.type === "engine" || event.type === "choice") {
      if (event.accountId && room.view.members.some(member => member.id === event.accountId && this.active.get(member.id) === room.view.id)) this.publish(event.accountId, "game." + event.type, { instanceId, raw: event.raw, token: event.token, deadline: event.deadline });
    } else if (event.type === "finished") {
      void this.serial(async () => {
        if (room.view.instanceId !== instanceId || room.view.state === "finished") return;
        await this.db.saveResult(instanceId, room.view.id, event.results);
        room.view.state = "finished"; delete room.view.instanceId; delete room.view.instanceReady;
        room.view.members.forEach(member => { member.ready = !!member.isAI; delete member.resumeUntil; });
        await this.save(room);
        clearTimeout(room.startupTimer); room.startupTimer = undefined;
        for (const member of room.view.members) if (this.active.get(member.id) === room.view.id) this.publish(member.id, "game.finished", { roomId: room.view.id, instanceId, results: event.results });
        await this.hosts.stop(instanceId);
      }).catch(() => this.recoverHostFailure(room, instanceId));
    } else if (event.type === "failed") void this.recoverHostFailure(room, instanceId, event.code, event.resources);
  }
  private async recoverHostFailure(room: InternalRoom, instanceId: string, code?: string, resources?: string[]) {
    try { await this.hostFailed(room, instanceId, code, resources); }
    catch (error: any) {
      console.error("Online game host failure cleanup failed", { roomId: room.view.id, instanceId, message: String(error?.message || error).slice(0, 300) });
      if (room.view.instanceId === instanceId) {
        clearTimeout(room.startupTimer);
        room.startupTimer = setTimeout(() => { void this.recoverHostFailure(room, instanceId, code, resources); }, 5000);
      }
    }
  }
  private hostFailed(room: InternalRoom, instanceId: string, code?: string, resources?: string[]) {
    return this.serial(async () => {
      if (room.view.instanceId !== instanceId || room.view.state === "finished") return;
      const startupTimer = room.startupTimer;
      await this.hosts.stop(instanceId);
      room.view.state = room.view.state === "starting" ? "waiting" : "finished";
      delete room.view.instanceId; delete room.view.instanceReady;
      room.view.members.forEach(member => { member.ready = !!member.isAI; delete member.resumeUntil; });
      await this.save(room);
      clearTimeout(startupTimer); room.startupTimer = undefined;
      const missing = Array.isArray(resources) ? resources.filter(id => typeof id === "string" && /^(character|card):[a-zA-Z0-9_]{1,100}$/.test(id)).slice(0, 35).join("、") : "";
      const message = code === "CHARACTER_POOL_TOO_SMALL" ? "可选武将不足：扣除禁将、模式限制并合并同名版本后，需至少每席 3 名候选。请增加武将包或减少禁将。"
        : code === "CHARACTER_PACK_UNAVAILABLE" ? `联机资源未加载${missing ? "：" + missing : ""}。请重新构建并更新服务端与客户端的完整联机资源。`
        : code === "CHARACTER_POOL_VALIDATION_FAILED" ? "武将池规则校验异常，已取消开局；具体异常已记录到服务端日志。"
        : code === "INVALID_CHARACTER_BAN" ? "禁将不属于当前武将池，请重新配置房间武将规则。"
        : "托管实例未能继续运行，已释放对局资源。请返回房间重试。";
      for (const member of room.view.members) if (this.active.get(member.id) === room.view.id) this.publish(member.id, "game.failed", { instanceId, message });
    });
  }
  async gameCommand(accountId: string, type: string, payload: Record<string, any>, isCurrent = () => true) {
    return this.serial(async () => {
    if (!isCurrent()) throw new OnlineError("AUTH_EXPIRED", "此连接已失效");
    const room = this.require(String(payload.roomId), accountId);
    if (!room.view.instanceId || room.view.instanceId !== payload.instanceId) throw new OnlineError("RESUME_EXPIRED", "对局已结束或分配已失效");
    if (this.active.get(accountId) !== room.view.id) throw new OnlineError("FORBIDDEN", "你已离开此对局");
    const member = room.view.members.find(member => member.id === accountId)!;
    if (member.abandoned || member.resumeUntil && member.resumeUntil < Date.now()) throw new OnlineError("RESUME_EXPIRED", "席位保留时间已过");
    if (!["attach", "resume", "inited", "reinited", "result", "auto"].includes(type)) throw new OnlineError("FORBIDDEN", "无效游戏操作");
    if (!["starting", "in_game"].includes(room.view.state)) throw new OnlineError("RESUME_EXPIRED", "对局不可用");
    if (type === "attach" || type === "resume") {
      if (!room.view.instanceReady) throw new OnlineError("ROOM_STARTING", "托管实例正在准备，请稍后重试");
      const generation = (this.generations.get(accountId) || 0) + 1; this.generations.set(accountId, generation);
      await this.hosts.receive(room.view.instanceId, { accountId, type: room.view.state === "in_game" ? "resume" : "attach", payload: { ...payload, generation } });
      return { generation };
    }
    if (payload.generation !== this.generations.get(accountId)) throw new OnlineError("STALE_GENERATION", "此连接的席位控制权已失效");
    await this.hosts.receive(room.view.instanceId, { accountId, type, payload });
    if (type === "inited" || type === "reinited") {
      delete member.resumeUntil;
      member.online = true;
      await this.save(room);
    }
    return {};
    });
  }
  async presence(accountId: string, online: boolean) {
    return this.serial(async () => {
      const view = this.current(accountId); if (!view) return;
      const room = this.rooms.get(view.id)!; const member = view.members.find(item => item.id === accountId)!;
      const navigating = (this.navigation.get(accountId)?.expiresAt || 0) > Date.now();
      if (online) this.navigation.delete(accountId);
      member.online = online;
      if (!online && await this.closeIfEmpty(room)) return;
      if (!online) {
        member.ready = false;
        if (view.instanceId && ["starting", "in_game"].includes(view.state)) {
          member.resumeUntil = Math.max(member.resumeUntil || Date.now() + resumeGrace(), this.navigation.get(accountId)?.expiresAt || 0);
          this.generations.set(accountId, (this.generations.get(accountId) || 0) + 1);
          await this.hosts.receive(view.instanceId, { accountId, type: "disconnect" }).catch(() => {});
        }
      }
      if ((!online && !navigating && view.ownerId === accountId) || !view.members.some(item => item.id === view.ownerId && !item.abandoned && this.active.get(item.id) === view.id)) this.transferOwner(room);
      await this.save(room);
    });
  }
  async cleanup() {
    await this.serial(async () => {
      for (const [accountId, navigation] of this.navigation) {
        if (navigation.expiresAt <= Date.now() || this.active.get(accountId) !== navigation.roomId) this.navigation.delete(accountId);
      }
      for (const [id, room] of this.rooms) {
        // Also catches missed disconnect cleanup (for example a failed save).
        if (await this.closeIfEmpty(room)) continue;
        for (const member of room.view.members) {
          if (member.resumeUntil && member.resumeUntil < Date.now() && !member.abandoned) {
            member.abandoned = true; member.online = false; delete member.resumeUntil;
            const wasActive = this.active.get(member.id) === id;
            if (wasActive) this.active.delete(member.id);
            if (room.view.ownerId === member.id) this.transferOwner(room);
            if (wasActive) this.generations.set(member.id, (this.generations.get(member.id) || 0) + 1);
            if (room.view.instanceId) await this.hosts.receive(room.view.instanceId, { accountId: member.id, type: "disconnect" }).catch(() => {});
            if (wasActive) this.publish(member.id, "game.resumeExpired", { roomId: id });
            await this.save(room);
          }
        }
        await this.closeIfEmpty(room);
      }
    });
  }
  async createMatched(accounts: Account[], modeId: string, capacity: number) {
    const mode = modePreset(modeId);
    if (!mode || !(mode.players as readonly number[]).includes(capacity) || accounts.length !== capacity) throw new OnlineError("INVALID_ARGUMENT", "匹配规则无效");
    const view = await this.serial(async () => {
      if (accounts.some(account => this.active.has(account.id))) throw new OnlineError("ALREADY_IN_GAME", "匹配玩家已进入其他房间");
      const room: InternalRoom = { view: { id: randomUUID(), code: randomBytes(6).toString("hex").toUpperCase(), name: mode.name + " · 匹配对局", ownerId: accounts[0].id,
        modeId, preset: mode.preset, capacity, visibility: "invite", locked: false, state: "waiting", revision: 0, createdAt: Date.now(),
        characterPool: normalizeCharacterPool(undefined),
        members: accounts.map((account, seat) => ({ ...account, seat, ready: true, online: true })) }, chat: [] };
      await this.save(room);
      this.rooms.set(room.view.id, room); for (const account of accounts) this.active.set(account.id, room.view.id);
      return room.view;
    });
    try { return await this.command(accounts[0], "room.start", { roomId: view.id }); }
    catch (error) {
      await this.serial(async () => {
        // Everyone may have disconnected while the start command was queued.
        const room = this.rooms.get(view.id); if (!room) return;
        room.view.state = "closed"; await this.db.deleteRoom(view.id);
        for (const account of accounts) if (this.active.get(account.id) === view.id) {
          this.active.delete(account.id); this.publish(account.id, "room.left", {});
        }
        this.rooms.delete(view.id);
        this.publish(null, "rooms.changed", {});
      });
      throw error;
    }
  }
  async joinInvited(account: Account, senderId: string, roomId: string, password: unknown) {
    const room = this.rooms.get(roomId);
    if (!room || !room.view.members.some(member => member.id === senderId)) throw new OnlineError("INVITE_EXPIRED", "邀请者已离开房间");
    return this.command(account, "room.join", { code: room.view.code, password });
  }
  async close() {
    for (const room of this.rooms.values()) clearTimeout(room.startupTimer);
    await this.queue;
    await this.hosts.close();
  }
}
