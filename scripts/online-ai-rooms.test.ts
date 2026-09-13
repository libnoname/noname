import assert from "node:assert/strict";
import test from "node:test";
import { Rooms } from "../packages/server/src/platform/rooms.ts";
import { type Account, type Room, RULESET } from "../packages/online-protocol/src/index.ts";
import { type HostSpec, type HostEvent } from "../packages/game-host/src/index.ts";

const owner: Account = { id: "owner", code: "OWNER", nickname: "房主", avatar: "caocao" };
const guest: Account = { id: "guest", code: "GUEST", nickname: "玩家", avatar: "caocao" };
async function fixture(t: any, capacity = 4, modeId = "identity") {
  const saved = new Map<string, Room>(), starts: HostSpec[] = [], stopped: string[] = [], events: any[] = [];
  let callback: (event: HostEvent) => void = () => {}, rejectSave = false;
  const hosts = { count: 0, async start(spec: HostSpec, emit: (event: HostEvent) => void) { starts.push(spec); callback = emit; },
    async stop(id: string) { stopped.push(id); }, async receive() {}, async close() {} };
  const db = { async saveRoom(room: Room) { if (rejectSave) throw new Error("storage failure"); saved.set(room.id, room); },
    async deleteRoom(id: string) { saved.delete(id); }, async saveResult() {} };
  const rooms = new Rooms(db as any, hosts as any, (id, type, payload) => events.push({ id, type, payload }));
  t.after(() => rooms.close());
  const view = await rooms.command(owner, "room.create", { name: "AI test", modeId, preset: modeId === "identity" ? RULESET : "doudizhu-standard-v1", capacity, visibility: "public" }) as Room;
  const command = (type: string, payload = {}, account = owner) => rooms.command(account, type, { roomId: view.id, ...payload });
  return { rooms, saved, starts, stopped, events, command, id: view.id, current: () => rooms.current(owner.id)!,
    failSave: (value: boolean) => { rejectSave = value; }, emit: async (event: HostEvent) => { callback(event); await rooms.read(() => {}); } };
}

test("房主逐席分配、批量补位、移除 AI，真人可加入释放的座位", async t => {
  const f = await fixture(t);
  await f.command("room.ai", { seats: [2], enabled: true });
  const bot = f.current().members.find(m => m.isAI)!;
  assert.equal(bot.seat, 2); assert.equal(bot.ready, true); assert.equal(bot.online, false);
  assert.equal(f.rooms.current(bot.id), null);
  await f.command("room.join", {}, guest);
  assert.equal(f.current().members.find(m => m.id === guest.id)!.seat, 1);
  await f.command("room.ai", { seats: [3], enabled: true });
  await assert.rejects(f.command("room.join", {}, { ...guest, id: "third" }), { code: "ROOM_FULL" });
  await f.command("room.ai", { seats: [2], enabled: false });
  await f.command("room.join", {}, { ...guest, id: "third" });
  assert.equal(f.current().members.find(m => m.id === "third")!.seat, 2);
  const publicRoom = f.rooms.list("outsider", {}).items[0];
  assert.equal(publicRoom.members.filter(m => m.isAI).length, 1);
  assert(publicRoom.members.every(m => m.id === "" && m.nickname === ""));
});

test("非房主不能分配 AI，非法或占用席位整批拒绝，过期请求拒绝", async t => {
  const f = await fixture(t);
  await f.command("room.join", {}, guest);
  await assert.rejects(f.command("room.ai", { seats: [2], enabled: true }, guest), { code: "FORBIDDEN" });
  for (const seats of [[], [-1], [4], [1.5], ["2"], [2, 2], [2, 1]]) {
    await assert.rejects(f.command("room.ai", { seats, enabled: true }), { code: "INVALID_ARGUMENT" });
    assert.equal(f.current().members.length, 2);
  }
  await assert.rejects(f.command("room.ai", { seats: [2], enabled: "true" }), { code: "INVALID_ARGUMENT" });
  await assert.rejects(f.command("room.ai", { seats: [1], enabled: false }), { code: "INVALID_ARGUMENT" });
  await assert.rejects(f.command("room.ai", { seats: [2], enabled: true, revision: 0 }), { code: "STALE_REVISION" });
});

test("AI 分配存储失败会回滚，不能留下幽灵席位", async t => {
  const f = await fixture(t);
  f.failSave(true);
  await assert.rejects(f.command("room.ai", { seats: [1, 2, 3], enabled: true }), /storage failure/);
  assert.equal(f.current().members.length, 1);
  f.failSave(false);
  await f.command("room.ai", { seats: [1, 2, 3], enabled: true });
  assert.equal(f.saved.get(f.id)!.members.length, 4);
});

for (const [modeId, capacity] of [["identity", 2], ["identity", 4], ["identity", 6], ["identity", 8], ["doudizhu", 3]] as const) {
  test(`${modeId} ${capacity}席：单真人 + AI 开局、结算并保留 AI 再来一局`, async t => {
    const f = await fixture(t, capacity, modeId);
    await f.command("room.ai", { seats: Array.from({ length: capacity - 1 }, (_, i) => i + 1), enabled: true });
    await assert.rejects(f.command("room.start"), { code: "NOT_READY" });
    await f.command("room.ready", { ready: true });
    await f.command("room.update", { name: "新房名" });
    assert.equal(f.current().members[0].ready, false);
    assert(f.current().members.filter(m => m.isAI).every(m => m.ready));
    await f.command("room.ready", { ready: true });
    await f.command("room.start");
    assert.equal(f.starts[0].members.filter(m => m.isAI).length, capacity - 1);
    assert.deepEqual((f.starts[0].members as Room["members"]).map(m => m.seat), Array.from({ length: capacity }, (_, i) => i));
    await assert.rejects(f.command("room.ai", { seats: [1], enabled: false }), { code: "ALREADY_IN_GAME" });
    await f.emit({ type: "ready" }); await f.emit({ type: "started" });
    assert.equal(f.current().state, "in_game");
    await assert.rejects(f.command("room.ai", { seats: [1], enabled: false }), { code: "ALREADY_IN_GAME" });
    await f.emit({ type: "finished", results: [{ accountId: owner.id, won: true }] });
    await f.command("room.rematch");
    assert.equal(f.current().state, "waiting");
    assert.equal(f.current().members.length, capacity);
    assert(f.current().members.filter(m => m.isAI).every(m => m.ready));
    await f.command("room.ready", { ready: true }); await f.command("room.start");
    assert.equal(f.starts.length, 2);
  });
}

test("托管启动失败后 AI 仍自动准备，可再次开局", async t => {
  const f = await fixture(t, 2);
  await f.command("room.ai", { seats: [1], enabled: true });
  await f.command("room.ready", { ready: true }); await f.command("room.start");
  await f.emit({ type: "failed" });
  assert.equal(f.current().state, "waiting");
  assert.equal(f.current().members.find(m => m.isAI)!.ready, true);
  await f.command("room.ready", { ready: true }); await f.command("room.start");
  assert.equal(f.starts.length, 2);
});

test("房主退出只转移给真人，最后一个真人退出后关闭有 AI 的房间", async t => {
  const f = await fixture(t);
  await f.command("room.ai", { seats: [1, 2], enabled: true });
  await f.command("room.join", {}, guest);
  await f.command("room.leave");
  assert.equal(f.rooms.current(guest.id)!.ownerId, guest.id);
  await f.command("room.ai", { seats: [0], enabled: true }, guest);
  await f.command("room.ready", { ready: true }, guest); await f.command("room.start", {}, guest);
  await f.command("room.leave", {}, guest);
  assert.equal(f.rooms.rooms.size, 0); assert.equal(f.saved.size, 0); assert(f.stopped.length > 0);
});

test("AI 不会保住房间或获得客户端控制权", async t => {
  const f = await fixture(t, 2);
  await f.command("room.ai", { seats: [1], enabled: true });
  const bot = f.current().members.find(m => m.isAI)!;
  await assert.rejects(f.command("room.ready", { ready: true }, bot), { code: "FORBIDDEN" });
  await f.rooms.presence(owner.id, false);
  assert.equal(f.rooms.rooms.size, 0);
});
