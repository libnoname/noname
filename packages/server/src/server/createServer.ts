import type { IncomingMessage } from "node:http";
import { WebSocketServer, type WebSocket } from "ws";

import { decodeRawMessage } from "../protocol/codec";
import { EventService } from "../services/eventService";
import { LobbyService } from "../services/lobbyService";
import { RoomService } from "../services/roomService";
import { ServerState } from "../state/ServerState";
import type { Client, ServerInstance, ServerOptions } from "../types";
import { newId } from "../utils/id";
import { sendMessage, sendRaw } from "../utils/send";

export function createServer(options: ServerOptions = {}): ServerInstance {
	const port = options.port ?? 8082;

	const state = new ServerState();
	const lobbyService = new LobbyService(state);
	const roomService = new RoomService(state);

	let wss: WebSocketServer | undefined;

	const clearClientTimers = (client: Client) => {
		clearTimeout(client.keyCheck);
		clearInterval(client.heartbeat);
	};

	const normalizeNickname = (str: any): string => {
		return typeof str === "string" ? str.slice(0, 12) : "无名玩家";
	};
	const eventService = new EventService(state, normalizeNickname);

	const handlers: Record<string, (client: Client, ...args: any[]) => void> = {
		create(client: Client, key: string, nickname: string, avatar: string, config: any, mode: string) {
			if (client.onlineKey !== key) return;

			client.nickname = normalizeNickname(nickname);
			client.avatar = avatar;

			roomService.createRoom(client, key);
			sendMessage(client, "createroom", key);
			lobbyService.updateRooms();
		},

		enter(client: Client, key: string, nickname: string, avatar: string) {
			const room = state.getRoom(key);
			if (!room) return sendMessage(client, "enterroomfailed");

			client.nickname = normalizeNickname(nickname);
			client.avatar = avatar;
			roomService.enterRoom(client, room);

			if (!room.owner) return sendMessage(client, "enterroomfailed");

			if (!room.config || (room.config.gameStarted && (!room.config.observe || !room.config.observeReady))) {
				return sendMessage(client, "enterroomfailed");
			}

			roomService.notifyRoomOwner(client, room);
			lobbyService.updateRooms();
		},

		changeAvatar(client: Client, nickname: string, avatar: string) {
			client.nickname = normalizeNickname(nickname);
			client.avatar = avatar;
			lobbyService.updateClients();
		},

		key(client: Client, id: any) {
			if (!id || typeof id !== "object") {
				sendMessage(client, "denied", "key");
				return client.close();
			}
			if (state.isKeyBanned(id[0])) {
				state.banIp(client.clientIp);
				return client.close();
			}
			client.onlineKey = id[0];
			clearTimeout(client.keyCheck);
		},

		events(client: Client, cfg: any, id: string, type: string) {
			eventService.handleEvents(client, cfg, id, type);
		},

		config(client: Client, config: any) {
			if (!roomService.configureRoom(client, config)) return;
			lobbyService.updateRooms();
		},

		status(client: Client, str: any) {
			if (typeof str === "string") client.status = str;
			else delete client.status;
			lobbyService.updateClients();
		},

		send(client: Client, id: string, message: string) {
			const target = state.getClient(id);
			if (target && target.owner === client) {
				sendRaw(target, message);
			}
		},

		close(client: Client, id: string) {
			const target = state.getClient(id);
			if (target && target.owner === client) target.close();
		},
	};

	const handleConnection = (ws: WebSocket, req: IncomingMessage) => {
		const client = ws as Client;
		const ip = req.socket.remoteAddress ?? "";

		// ban check
		if (state.isIpBanned(ip)) {
			sendMessage(client, "denied", "banned");
			return setTimeout(() => ws.close(), 500);
		}

		client.wsid = newId();
		client.clientIp = ip;
		state.addClient(client);

		client.keyCheck = setTimeout(() => {
			sendMessage(client, "denied", "key");
			setTimeout(() => client.close(), 500);
		}, 2000);

		sendMessage(client, "roomlist", lobbyService.buildRoomList(), eventService.checkEvents(), lobbyService.buildClientList(), client.wsid);

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

			roomService.closeOwnedRooms(client);

			// notify owner if client was slave
			if (client.owner) sendMessage(client.owner, "onclose", client.wsid);

			state.deleteClient(client.wsid);

			if (client.room) lobbyService.updateRooms();
			else lobbyService.updateClients();
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

			const curClients = [...state.getClients()];
			for (const client of curClients) {
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
