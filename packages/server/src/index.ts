import { WebSocket, WebSocketServer } from "ws";

interface ServerConfig {
	port: number;
	heartbeatInterval: number;
	maxMessageSize: number;
	maxClients: number;
	maxRooms: number;
	maxEvents: number;
	rateLimit: {
		burst: number;
		sustained: number;
	};
}

const serverConfig: ServerConfig = {
	port: parseInt(process.env.NONAME_PORT || "8082"),
	heartbeatInterval: parseInt(process.env.NONAME_HEARTBEAT_MS || "60000"),
	maxMessageSize: parseInt(process.env.NONAME_MAX_MSG_SIZE || "65536"),
	maxClients: parseInt(process.env.NONAME_MAX_CLIENTS || "200"),
	maxRooms: parseInt(process.env.NONAME_MAX_ROOMS || "50"),
	maxEvents: parseInt(process.env.NONAME_MAX_EVENTS || "20"),
	rateLimit: {
		burst: parseInt(process.env.NONAME_RATE_BURST || "30"),
		sustained: parseInt(process.env.NONAME_RATE_SUSTAINED || "10"),
	},
};

const log = {
	info(event: string, data?: Record<string, any>) {
		console.log(JSON.stringify({ ts: new Date().toISOString(), level: "info", event, ...data }));
	},
	warn(event: string, data?: Record<string, any>) {
		console.warn(JSON.stringify({ ts: new Date().toISOString(), level: "warn", event, ...data }));
	},
	error(event: string, data?: Record<string, any>) {
		console.error(JSON.stringify({ ts: new Date().toISOString(), level: "error", event, ...data }));
	},
};

interface Client extends WebSocket {
	wsid: string;
	nickname: string;
	avatar: string;
	clientIp: string;
	onlineKey?: string;
	status?: string;
	owner?: Client;
	room?: Room;
	servermode?: boolean;
	beat?: boolean;
	keyCheck?: NodeJS.Timeout;
	heartbeat?: NodeJS.Timeout;
	tokens: number;
	lastRefill: number;
	rateLimitWarnings: number;
}

interface Room {
	key: string;
	owner?: Client;
	config?: any;
	servermode?: boolean;
	members: Set<string>;
	idleSince?: number;
}

interface EventItem {
	id: string;
	creator: string;
	nickname: string;
	avatar: string;
	utc: number;
	day: number;
	hour: number;
	content: string;
	members: string[];
}

interface ServerInstance {
	wss: WebSocketServer;
	clients: Map<string, Client>;
	rooms: Map<string, Room>;
	events: EventItem[];
	bannedKeys: Set<string>;
	bannedIps: Set<string>;
	cleanupTimer: ReturnType<typeof setInterval>;
	close(): Promise<void>;
}

function startServer(configOverride?: Partial<ServerConfig>): ServerInstance {
	const cfg = { ...serverConfig, ...configOverride };
	if (configOverride?.rateLimit) {
		cfg.rateLimit = { ...serverConfig.rateLimit, ...configOverride.rateLimit };
	}

	const clients = new Map<string, Client>();
	const rooms = new Map<string, Room>();
	const events: EventItem[] = [];

	const bannedKeys = new Set<string>();
	const bannedIps = new Set<string>();
	const bannedKeyWords: string[] = [];

	const util = {
		nickname(str: any): string {
			return typeof str === "string" ? str.slice(0, 12) : "无名玩家";
		},

		isBanned(str: string): boolean {
			return bannedKeyWords.some(k => str.includes(k));
		},

		sendl(client: Client, ...args: any[]) {
			try {
				client.send(JSON.stringify(args));
			} catch {
				client.close();
			}
		},

		newId(): string {
			return Math.floor(1e9 + Math.random() * 9e9).toString();
		},

		buildRoomList(): any[] {
			const roomList: any[] = [];
			rooms.forEach((room, key) => {
				const count = room.members.size;
				if (room.servermode) {
					roomList.push("server");
				} else if (room.owner && room.config) {
					if (count === 0) {
						util.sendl(room.owner, "reloadroom");
					}
					roomList.push([room.owner.nickname, room.owner.avatar, room.config, count, room.key]);
				}
			});
			return roomList;
		},

		buildClientList(): any[] {
			const out: any[] = [];
			clients.forEach(c => {
				out.push([c.nickname, c.avatar, !c.room, c.status, c.wsid, c.onlineKey]);
			});
			return out;
		},

		updateRooms() {
			const roomList = util.buildRoomList();
			const clientList = util.buildClientList();
			clients.forEach(c => {
				if (!c.room) util.sendl(c, "updaterooms", roomList, clientList);
			});
		},

		updateClients() {
			const list = util.buildClientList();
			clients.forEach(c => {
				if (!c.room) util.sendl(c, "updateclients", list);
			});
		},

		checkEvents() {
			const now = Date.now();
			for (let i = 0; i < events.length; i++) {
				if (events[i].utc <= now) {
					events.splice(i--, 1);
				}
			}
			return events;
		},

		updateEvents() {
			util.checkEvents();
			clients.forEach(c => {
				if (!c.room) util.sendl(c, "updateevents", events);
			});
		},
	};

	const handlers = {
		create(client: Client, key: string, nickname: string, avatar: string, config: any, mode: string) {
			if (client.onlineKey !== key) return;
			if (rooms.size >= cfg.maxRooms) {
				util.sendl(client, "denied", "max_rooms");
				return;
			}

			client.nickname = util.nickname(nickname);
			client.avatar = avatar;

			const room: Room = { key, owner: client, members: new Set([client.wsid]) };
			rooms.set(key, room);

			client.room = room;
			delete client.status;

			log.info("room_create", { key, wsid: client.wsid });
			util.sendl(client, "createroom", key);
			util.updateRooms();
		},

		enter(client: Client, key: string, nickname: string, avatar: string) {
			const room = rooms.get(key);
			if (!room) return util.sendl(client, "enterroomfailed");

			// 容量检查（兼容 player_number 和 number 两种字段名）
			const maxPlayers = room.config?.player_number || room.config?.number || 8;
			if (room.members.size >= maxPlayers) {
				return util.sendl(client, "enterroomfailed");
			}

			client.nickname = util.nickname(nickname);
			client.avatar = avatar;
			client.room = room;
			delete client.status;

			if (!room.owner) return util.sendl(client, "enterroomfailed");

			if (!room.config || (room.config.gameStarted && (!room.config.observe || !room.config.observeReady))) {
				return util.sendl(client, "enterroomfailed");
			}

			room.members.add(client.wsid);
			client.owner = room.owner;
			log.info("room_enter", { key, wsid: client.wsid });
			util.sendl(room.owner, "onconnection", client.wsid);
			util.updateRooms();
		},

		changeAvatar(client: Client, nickname: string, avatar: string) {
			client.nickname = util.nickname(nickname);
			client.avatar = avatar;
			util.updateClients();
		},

		key(client: Client, id: any) {
			if (!id || typeof id !== "object") {
				util.sendl(client, "denied", "key");
				return client.close();
			}
			if (bannedKeys.has(id[0])) {
				bannedIps.add(client.clientIp);
				return client.close();
			}
			client.onlineKey = id[0];
			clearTimeout(client.keyCheck);
		},

		events(client: Client, cfg_param: any, id: string, type: string) {
			if (bannedKeys.has(id) || typeof id !== "string" || client.onlineKey !== id) {
				bannedIps.add(client.clientIp);
				client.close();
				return;
			}

			let changed = false;
			const now = Date.now();

			if (typeof cfg_param === "string") {
				// join / leave existing event
				for (let ev of events) {
					if (ev.id === cfg_param) {
						if (type === "join" && !ev.members.includes(id)) {
							ev.members.push(id);
							changed = true;
						}
						if (type === "leave") {
							const idx = ev.members.indexOf(id);
							if (idx !== -1) {
								ev.members.splice(idx, 1);
								if (ev.members.length === 0) {
									const index = events.indexOf(ev);
									events.splice(index, 1);
								}
								changed = true;
							}
						}
					}
				}
			} else if (cfg_param && typeof cfg_param === "object" && "utc" in cfg_param && "day" in cfg_param && "hour" in cfg_param && "content" in cfg_param) {
				if (events.length >= cfg.maxEvents) util.sendl(client, "eventsdenied", "total");
				else if (cfg_param.utc <= now) util.sendl(client, "eventsdenied", "time");
				else if (util.isBanned(cfg_param.content)) util.sendl(client, "eventsdenied", "ban");
				else {
					const item: EventItem = {
						...cfg_param,
						nickname: util.nickname(cfg_param.nickname),
						avatar: cfg_param.avatar || "caocao",
						creator: id,
						id: util.newId(),
						members: [id],
					};
					events.unshift(item);
					changed = true;
				}
			}

			if (changed) util.updateEvents();
		},

		config(client: Client, config: any) {
			const room = client.room;
			if (!room || room.owner !== client) return;

			if (room.servermode) {
				room.servermode = false;
			}
			room.config = config;
			util.updateRooms();
		},

		status(client: Client, str: any) {
			if (typeof str === "string") client.status = str;
			else delete client.status;
			util.updateClients();
		},

		send(client: Client, id: string, message: string) {
			if (typeof message !== "string") return;
			if (message.length > cfg.maxMessageSize) {
				log.warn("relay_message_too_large", { from: client.wsid, to: id, size: message.length });
				return;
			}

			const target = clients.get(id);
			if (target && target.owner === client) {
				try {
					target.send(message);
				} catch {
					target.close();
				}
			}
		},

		close(client: Client, id: string) {
			const target = clients.get(id);
			if (target && target.owner === client) target.close();
		},
	};

	const wss = new WebSocketServer({ port: cfg.port });

	wss.on("connection", (ws, req) => {
		const client = ws as Client;
		const ip = req.socket.remoteAddress ?? "";

		// 总连接数限制（client 尚未初始化，不能用 util.sendl）
		if (clients.size >= cfg.maxClients) {
			try {
				ws.send(JSON.stringify(["denied", "server_full"]));
			} catch {}
			setTimeout(() => ws.close(), 500);
			log.warn("max_clients_reached", { current: clients.size });
			return;
		}

		// ban check
		if (bannedIps.has(ip)) {
			util.sendl(client, "denied", "banned");
			log.warn("banned_ip_rejected", { ip });
			return setTimeout(() => ws.close(), 500);
		}

		client.wsid = util.newId();
		client.clientIp = ip;
		clients.set(client.wsid, client);

		// 速率限制初始化
		client.tokens = cfg.rateLimit.burst;
		client.lastRefill = Date.now();
		client.rateLimitWarnings = 0;

		log.info("client_connect", { wsid: client.wsid, ip });

		client.keyCheck = setTimeout(() => {
			util.sendl(client, "denied", "key");
			log.warn("key_denied", { wsid: client.wsid });
			setTimeout(() => client.close(), 500);
		}, 2000);

		util.sendl(client, "roomlist", util.buildRoomList(), util.checkEvents(), util.buildClientList(), client.wsid);

		// heartbeat
		client.heartbeat = setInterval(() => {
			if (client.beat) {
				client.close();
				clearInterval(client.heartbeat);
				return;
			}
			client.beat = true;
			try {
				client.send("heartbeat");
			} catch {
				client.close();
			}
		}, cfg.heartbeatInterval);

		//
		// message handler
		//
		client.on("message", msg => {
			const raw = msg.toString();

			// 消息大小限制
			if (raw.length > cfg.maxMessageSize) {
				log.warn("message_too_large", { wsid: client.wsid, size: raw.length });
				util.sendl(client, "denied", "message_too_large");
				return;
			}

			// 心跳不消耗令牌
			if (raw === "heartbeat") {
				client.beat = false;
				return;
			}

			// 令牌桶速率限制
			const now = Date.now();
			const elapsed = (now - client.lastRefill) / 1000;
			client.tokens = Math.min(cfg.rateLimit.burst, client.tokens + elapsed * cfg.rateLimit.sustained);
			client.lastRefill = now;

			if (client.tokens < 1) {
				client.rateLimitWarnings++;
				log.warn("rate_limited", { wsid: client.wsid, warnings: client.rateLimitWarnings });
				if (client.rateLimitWarnings >= 3) {
					util.sendl(client, "denied", "rate_limit");
					client.close();
				}
				return;
			}
			client.tokens--;

			// forward from slave to owner
			if (client.owner) {
				util.sendl(client.owner, "onmessage", client.wsid, raw);
				return;
			}

			let arr: any[];
			try {
				arr = JSON.parse(raw);
				if (!Array.isArray(arr)) throw new Error();
			} catch {
				util.sendl(client, "denied", "banned");
				return;
			}

			if (arr.shift() !== "server") return;

			const type = arr.shift();
			const handler = (handlers as any)[type];
			if (!handler) return;

			handler(client, ...arr);
		});

		//
		// disconnect handler
		//
		client.on("close", () => {
			log.info("client_disconnect", { wsid: client.wsid });
			clearInterval(client.heartbeat);

			// 从房间成员中移除
			if (client.room) {
				client.room.members.delete(client.wsid);
			}

			// remove rooms owned by this client
			rooms.forEach((room, key) => {
				if (room.owner === client) {
					// notify all clients in this room + 清理引用
					clients.forEach(c => {
						if (c.room === room && c !== client) {
							util.sendl(c, "selfclose");
							delete c.room;
							delete c.owner;
						}
					});
					rooms.delete(key);
					log.info("room_destroy", { key, reason: "owner_disconnect" });
				}
			});

			// notify owner if client was slave
			if (client.owner) util.sendl(client.owner, "onclose", client.wsid);

			clients.delete(client.wsid);

			if (client.room) util.updateRooms();
			else util.updateClients();
		});
	});

	// 周期性清理（每5分钟）
	const cleanupTimer = setInterval(
		() => {
			// 清理过期事件
			util.checkEvents();

			// 清理空闲房间
			const now = Date.now();
			rooms.forEach((room, key) => {
				if (!room.owner) {
					rooms.delete(key);
					log.info("room_cleanup_orphan", { key });
					return;
				}
				const nonOwnerCount = room.members.size - 1;
				if (nonOwnerCount <= 0) {
					room.idleSince ??= now;
					if (now - room.idleSince > 30 * 60 * 1000) {
						util.sendl(room.owner, "roomexpired");
						rooms.delete(key);
						if (room.owner) {
							delete room.owner.room;
						}
						log.info("room_cleanup_idle", { key });
					}
				} else {
					delete room.idleSince;
				}
			});

			log.info("periodic_cleanup", { rooms: rooms.size, clients: clients.size, events: events.length });
		},
		5 * 60 * 1000
	);

	log.info("server_start", { port: cfg.port });

	return {
		wss,
		clients,
		rooms,
		events,
		bannedKeys,
		bannedIps,
		cleanupTimer,
		close() {
			return new Promise<void>(resolve => {
				clearInterval(cleanupTimer);
				// 清理所有客户端的定时器
				clients.forEach(c => {
					clearInterval(c.heartbeat);
					clearTimeout(c.keyCheck);
				});
				wss.close(() => resolve());
			});
		},
	};
}

export { startServer, ServerConfig, ServerInstance };

// 直接运行时自动启动
const isDirectRun = !process.env.VITEST;
if (isDirectRun) {
	startServer();
}
