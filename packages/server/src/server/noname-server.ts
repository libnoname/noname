import type { IncomingMessage } from "node:http";
import { WebSocketServer, type WebSocket } from "ws";

import { createCommandDispatcher } from "../handlers";
import { EventService } from "../services/event-service";
import { LobbyService } from "../services/lobby-service";
import { RoomService } from "../services/room-service";
import { ServerState } from "../state/server-state";
import type { Client, ServerInstance, ServerLogger, ServerOptions } from "../types";
import type { LogInput } from "../utils/log";
import { writeLog } from "../utils/log";
import { sendMessage } from "../utils/send";
import { ClientSession } from "./client-session";
import { allowAllResourcePolicy } from "./resource-policy";

export class NonameServer implements ServerInstance {
	readonly state = new ServerState();
	readonly lobbyService = new LobbyService(this.state);
	readonly roomService = new RoomService(this.state);
	readonly eventService = new EventService(this.state, value => this.normalizeNickname(value));

	private readonly port: number;
	private readonly logger: ServerLogger;
	private readonly resourcePolicy = allowAllResourcePolicy;
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
		this.logger = options.logger ?? (() => {});
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
				this.log({
					level: "info",
					event: "server_start",
					port: this.port,
				});
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
				if (error) {
					this.log({
						level: "error",
						event: "server_stop_failure",
						error,
					});
					reject(error);
				} else {
					this.log({
						level: "info",
						event: "server_stop",
						port: this.port,
					});
					resolve();
				}
			});
		});
	}

	private handleConnection = (ws: WebSocket, req: IncomingMessage) => {
		const ip = req.socket.remoteAddress ?? "";

		if (this.state.isIpBanned(ip)) {
			this.log({
				level: "warn",
				event: "connection_denied",
				ip,
				reason: "banned",
			});
			sendMessage(ws as Client, "denied", "banned");
			setTimeout(() => ws.close(), 500);
			return;
		}

		const decision = this.resourcePolicy.checkConnection({
			ip,
			request: req,
			sessionCount: this.sessions.size,
		});
		if (!decision.allowed) {
			this.log({
				level: "warn",
				event: "connection_denied",
				ip,
				reason: decision.reason ?? "policy",
			});
			ws.close();
			return;
		}

		try {
			const session = new ClientSession({
				socket: ws,
				request: req,
				state: this.state,
				lobbyService: this.lobbyService,
				roomService: this.roomService,
				eventService: this.eventService,
				dispatchCommand: this.dispatchCommand,
				resourcePolicy: this.resourcePolicy,
				logger: this.logger,
				onClose: closedSession => {
					this.sessions.delete(closedSession);
				},
			});

			this.sessions.add(session);
			session.start();
		} catch (error) {
			this.log({
				level: "error",
				event: "session_crash",
				ip,
				phase: "start",
				error,
			});
			ws.close();
		}
	};

	private normalizeNickname(value: any): string {
		return typeof value === "string" ? value.slice(0, 12) : "无名玩家";
	}

	private log(event: LogInput) {
		writeLog(this.logger, event);
	}
}
