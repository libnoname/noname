import type { IncomingMessage } from "node:http";
import { WebSocketServer, type WebSocket } from "ws";

import { createCommandDispatcher } from "../handlers";
import { EventService } from "../services/eventService";
import { LobbyService } from "../services/lobbyService";
import { RoomService } from "../services/roomService";
import { ServerState } from "../state/ServerState";
import type { Client, ServerInstance, ServerOptions } from "../types";
import { sendMessage } from "../utils/send";
import { ClientSession } from "./ClientSession";

export class NonameServer implements ServerInstance {
	readonly state = new ServerState();
	readonly lobbyService = new LobbyService(this.state);
	readonly roomService = new RoomService(this.state);
	readonly eventService = new EventService(this.state, value => this.normalizeNickname(value));

	private readonly port: number;
	private readonly sessions = new Set<ClientSession>();
	private readonly dispatchCommand = createCommandDispatcher({
		state: this.state,
		lobbyService: this.lobbyService,
		roomService: this.roomService,
		eventService: this.eventService,
		normalizeNickname: value => this.normalizeNickname(value),
		clearKeyCheck(client) {
			clearTimeout(client.keyCheck);
		},
	});

	private wss: WebSocketServer | undefined;

	constructor(options: ServerOptions = {}) {
		this.port = options.port ?? 8082;
	}

	start(): Promise<void> {
		if (this.wss) return Promise.resolve();

		return new Promise<void>((resolve, reject) => {
			const server = new WebSocketServer({ port: this.port });

			const handleError = (error: Error) => {
				server.off("listening", handleListening);
				server.off("connection", this.handleConnection);
				this.wss = undefined;
				reject(error);
			};
			const handleListening = () => {
				server.off("error", handleError);
				resolve();
			};

			server.once("error", handleError);
			server.once("listening", handleListening);
			server.on("connection", this.handleConnection);
			this.wss = server;
		});
	}

	async stop(): Promise<void> {
		if (!this.wss) return Promise.resolve();

		const server = this.wss;
		this.wss = undefined;
		server.off("connection", this.handleConnection);

		await Promise.all([...this.sessions].map(session => session.close()));

		return new Promise<void>((resolve, reject) => {
			server.close(error => {
				if (error) reject(error);
				else resolve();
			});
		});
	}

	private handleConnection = (ws: WebSocket, req: IncomingMessage) => {
		const ip = req.socket.remoteAddress ?? "";

		if (this.state.isIpBanned(ip)) {
			sendMessage(ws as Client, "denied", "banned");
			setTimeout(() => ws.close(), 500);
			return;
		}

		const session = new ClientSession({
			socket: ws,
			request: req,
			state: this.state,
			lobbyService: this.lobbyService,
			roomService: this.roomService,
			eventService: this.eventService,
			dispatchCommand: this.dispatchCommand,
			onClose: closedSession => {
				this.sessions.delete(closedSession);
			},
		});

		this.sessions.add(session);
		session.start();
	};

	private normalizeNickname(value: any): string {
		return typeof value === "string" ? value.slice(0, 12) : "无名玩家";
	}
}
