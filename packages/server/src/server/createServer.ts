import type { IncomingMessage } from "node:http";
import { WebSocketServer, type WebSocket } from "ws";

import { createCommandDispatcher } from "../handlers";
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
	const dispatchCommand = createCommandDispatcher({
		state,
		lobbyService,
		roomService,
		eventService,
		normalizeNickname,
		clearKeyCheck(client) {
			clearTimeout(client.keyCheck);
		},
	});

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

			dispatchCommand(client, message.command, ...message.args);
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
