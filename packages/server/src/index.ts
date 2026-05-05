import { WebSocket, WebSocketServer } from "ws";

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
}

interface Room {
	key: string;
	owner?: Client;
	config?: any;
	servermode?: boolean;
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

//
// ========= 全局状态 ==========
//

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
		const clientCount = new Map<string, number>();

		// init counter
		rooms.forEach((room, key) => clientCount.set(key, 0));

		// count clients per room
		clients.forEach(c => {
			if (c.room && !c.servermode) {
				const key = c.room.key;
				clientCount.set(key, (clientCount.get(key) || 0) + 1);
			}
		});

		// build output list
		rooms.forEach((room, key) => {
			const count = clientCount.get(key) || 0;
			if (room.servermode) {
				roomList.push("server");
			} else if (room.owner && room.config) {
				if (count === 0) {
					util.sendl(room.owner, "reloadroom");
				}
				roomList.push([
					room.owner.nickname,
					room.owner.avatar,
					room.config,
					count,
					room.key,
				]);
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
	create(
		client: Client,
		key: string,
		nickname: string,
		avatar: string,
		config: any,
		mode: string
	) {
		if (client.onlineKey !== key) return;

		client.nickname = util.nickname(nickname);
		client.avatar = avatar;

		const room: Room = { key, owner: client };
		rooms.set(key, room);

		client.room = room;
		delete client.status;

		util.sendl(client, "createroom", key);
		util.updateRooms();
	},

	enter(client: Client, key: string, nickname: string, avatar: string) {
		const room = rooms.get(key);
		if (!room) return util.sendl(client, "enterroomfailed");

		client.nickname = util.nickname(nickname);
		client.avatar = avatar;
		client.room = room;
		delete client.status;

		if (!room.owner) return util.sendl(client, "enterroomfailed");

		if (
			!room.config ||
			(room.config.gameStarted && (!room.config.observe || !room.config.observeReady))
		) {
			return util.sendl(client, "enterroomfailed");
		}

		client.owner = room.owner;
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

	events(client: Client, cfg: any, id: string, type: string) {
		if (bannedKeys.has(id) || typeof id !== "string" || client.onlineKey !== id) {
			bannedIps.add(client.clientIp);
			client.close();
			return;
		}

		let changed = false;
		const now = Date.now();

		if (typeof cfg === "string") {
			// join / leave existing event
			for (let ev of events) {
				if (ev.id === cfg) {
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
		} else if (
			cfg &&
			typeof cfg === "object" &&
			"utc" in cfg &&
			"day" in cfg &&
			"hour" in cfg &&
			"content" in cfg
		) {
			if (events.length >= 20) util.sendl(client, "eventsdenied", "total");
			else if (cfg.utc <= now) util.sendl(client, "eventsdenied", "time");
			else if (util.isBanned(cfg.content)) util.sendl(client, "eventsdenied", "ban");
			else {
				const item: EventItem = {
					...cfg,
					nickname: util.nickname(cfg.nickname),
					avatar: cfg.avatar || "caocao",
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

const wss = new WebSocketServer({ port: 8082 });

wss.on("connection", (ws, req) => {
	const client = ws as Client;
	const ip = req.socket.remoteAddress ?? "";

	// ban check
	if (bannedIps.has(ip)) {
		util.sendl(client, "denied", "banned");
		return setTimeout(() => ws.close(), 500);
	}

	client.wsid = util.newId();
	client.clientIp = ip;
	clients.set(client.wsid, client);

	client.keyCheck = setTimeout(() => {
		util.sendl(client, "denied", "key");
		setTimeout(() => client.close(), 500);
	}, 2000);

	util.sendl(
		client,
		"roomlist",
		util.buildRoomList(),
		util.checkEvents(),
		util.buildClientList(),
		client.wsid
	);

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
	}, 60000);

	//
	// message handler
	//
	client.on("message", msg => {
		const raw = msg.toString();
		if (raw === "heartbeat") {
			client.beat = false;
			return;
		}

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
		// remove rooms owned by this client
		rooms.forEach((room, key) => {
			if (room.owner === client) {
				// notify all clients in this room
				clients.forEach(c => {
					if (c.room === room && c !== client) {
						util.sendl(c, "selfclose");
					}
				});
				rooms.delete(key);
			}
		});

		// notify owner if client was slave
		if (client.owner) util.sendl(client.owner, "onclose", client.wsid);

		clients.delete(client.wsid);

		if (client.room) util.updateRooms();
		else util.updateClients();
	});
});

console.log("Server listening on port 8082");
