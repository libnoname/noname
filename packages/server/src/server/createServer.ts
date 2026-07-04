import type { IncomingMessage } from "node:http";
import { WebSocketServer, type WebSocket } from "ws";

import { decodeRawMessage } from "../protocol/codec";
import type { Client, EventItem, Room, ServerInstance, ServerOptions } from "../types";
import { isBannedText } from "../utils/ban";
import { newId } from "../utils/id";
import { sendMessage, sendRaw } from "../utils/send";

export function createServer(options: ServerOptions = {}): ServerInstance {
	const port = options.port ?? 8082;

	const clients = new Map<string, Client>();
	const rooms = new Map<string, Room>();
	const events: EventItem[] = [];

	const bannedKeys = new Set<string>();
	const bannedIps = new Set<string>();
	const bannedKeyWords: string[] = [];

	let wss: WebSocketServer | undefined;

	const clearClientTimers = (client: Client) => {
		clearTimeout(client.keyCheck);
		clearInterval(client.heartbeat);
	};

	const util = {
		nickname(str: any): string {
			return typeof str === "string" ? str.slice(0, 12) : "无名玩家";
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
						sendMessage(room.owner, "reloadroom");
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
				if (!c.room) sendMessage(c, "updaterooms", roomList, clientList);
			});
		},

		updateClients() {
			const list = util.buildClientList();
			clients.forEach(c => {
				if (!c.room) sendMessage(c, "updateclients", list);
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
				if (!c.room) sendMessage(c, "updateevents", events);
			});
		},
	};

	const handlers: Record<string, (client: Client, ...args: any[]) => void> = {
		create(client: Client, key: string, nickname: string, avatar: string, config: any, mode: string) {
			if (client.onlineKey !== key) return;

			client.nickname = util.nickname(nickname);
			client.avatar = avatar;

			const room: Room = { key, owner: client };
			rooms.set(key, room);

			client.room = room;
			delete client.status;

			sendMessage(client, "createroom", key);
			util.updateRooms();
		},

		enter(client: Client, key: string, nickname: string, avatar: string) {
			const room = rooms.get(key);
			if (!room) return sendMessage(client, "enterroomfailed");

			client.nickname = util.nickname(nickname);
			client.avatar = avatar;
			client.room = room;
			delete client.status;

			if (!room.owner) return sendMessage(client, "enterroomfailed");

			if (!room.config || (room.config.gameStarted && (!room.config.observe || !room.config.observeReady))) {
				return sendMessage(client, "enterroomfailed");
			}

			client.owner = room.owner;
			sendMessage(room.owner, "onconnection", client.wsid);
			util.updateRooms();
		},

		changeAvatar(client: Client, nickname: string, avatar: string) {
			client.nickname = util.nickname(nickname);
			client.avatar = avatar;
			util.updateClients();
		},

		key(client: Client, id: any) {
			if (!id || typeof id !== "object") {
				sendMessage(client, "denied", "key");
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
			} else if (cfg && typeof cfg === "object" && "utc" in cfg && "day" in cfg && "hour" in cfg && "content" in cfg) {
				if (events.length >= 20) sendMessage(client, "eventsdenied", "total");
				else if (cfg.utc <= now) sendMessage(client, "eventsdenied", "time");
				else if (isBannedText(cfg.content, bannedKeyWords)) sendMessage(client, "eventsdenied", "ban");
				else {
					const item: EventItem = {
						...cfg,
						nickname: util.nickname(cfg.nickname),
						avatar: cfg.avatar || "caocao",
						creator: id,
						id: newId(),
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
				sendRaw(target, message);
			}
		},

		close(client: Client, id: string) {
			const target = clients.get(id);
			if (target && target.owner === client) target.close();
		},
	};

	const handleConnection = (ws: WebSocket, req: IncomingMessage) => {
		const client = ws as Client;
		const ip = req.socket.remoteAddress ?? "";

		// ban check
		if (bannedIps.has(ip)) {
			sendMessage(client, "denied", "banned");
			return setTimeout(() => ws.close(), 500);
		}

		client.wsid = newId();
		client.clientIp = ip;
		clients.set(client.wsid, client);

		client.keyCheck = setTimeout(() => {
			sendMessage(client, "denied", "key");
			setTimeout(() => client.close(), 500);
		}, 2000);

		sendMessage(client, "roomlist", util.buildRoomList(), util.checkEvents(), util.buildClientList(), client.wsid);

		// heartbeat
		client.heartbeat = setInterval(() => {
			if (client.beat) {
				client.close();
				clearInterval(client.heartbeat);
				return;
			}
			client.beat = true;
			sendRaw(client, "heartbeat");
		}, 60000);

		// message handler
		client.on("message", msg => {
			const raw = msg.toString();
			if (raw === "heartbeat") {
				client.beat = false;
				return;
			}

			// forward from slave to owner
			if (client.owner) {
				sendMessage(client.owner, "onmessage", client.wsid, raw);
				return;
			}

			const message = decodeRawMessage(raw);
			if (!message) {
				sendMessage(client, "denied", "banned");
				return;
			}

			if (message.type === "ignored") return;

			const handler = handlers[message.command];
			if (!handler) return;

			handler(client, ...message.args);
		});

		// disconnect handler
		client.on("close", () => {
			clearClientTimers(client);

			// remove rooms owned by this client
			rooms.forEach((room, key) => {
				if (room.owner === client) {
					// notify all clients in this room
					clients.forEach(c => {
						if (c.room === room && c !== client) {
							sendMessage(c, "selfclose");
						}
					});
					rooms.delete(key);
				}
			});

			// notify owner if client was slave
			if (client.owner) sendMessage(client.owner, "onclose", client.wsid);

			clients.delete(client.wsid);

			if (client.room) util.updateRooms();
			else util.updateClients();
		});
	};

	return {
		start() {
			if (wss) return Promise.resolve();

			return new Promise<void>((resolve, reject) => {
				const server = new WebSocketServer({ port });

				const handleError = (error: Error) => {
					server.off("listening", handleListening);
					server.off("connection", handleConnection);
					wss = undefined;
					reject(error);
				};
				const handleListening = () => {
					server.off("error", handleError);
					resolve();
				};

				server.once("error", handleError);
				server.once("listening", handleListening);
				server.on("connection", handleConnection);
				wss = server;
			});
		},

		stop() {
			if (!wss) return Promise.resolve();

			const server = wss;
			wss = undefined;

			const curClients = [...clients];
			for (const [_, client] of curClients) {
				clearClientTimers(client);
				client.close();
			}

			return new Promise<void>((resolve, reject) => {
				server.close(error => {
					if (error) reject(error);
					else resolve();
				});
			});
		},
	};
}
