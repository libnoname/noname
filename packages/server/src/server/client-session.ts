import type { IncomingMessage } from "node:http";
import { WebSocket, type RawData } from "ws";

import type { CommandDispatcher } from "../handlers";
import { decodeRawMessage } from "../protocol/codec";
import type { EventService } from "../services/event-service";
import type { LobbyService } from "../services/lobby-service";
import type { RoomService } from "../services/room-service";
import type { ServerState } from "../state/server-state";
import type { Client, ServerLogger } from "../types";
import { newId } from "../utils/id";
import type { LogInput } from "../utils/log";
import { writeLog } from "../utils/log";
import { sendMessage, sendRaw } from "../utils/send";
import type { ResourcePolicy } from "./resource-policy";

export interface ClientSessionOptions {
	socket: WebSocket;
	request: IncomingMessage;
	state: ServerState;
	lobbyService: LobbyService;
	roomService: RoomService;
	eventService: EventService;
	dispatchCommand: CommandDispatcher;
	resourcePolicy: ResourcePolicy;
	logger: ServerLogger;
	onClose(session: ClientSession): void;
}

export type ClientCloseReason = "server" | "client" | "key_timeout" | "heartbeat_timeout" | "policy" | "crash";
export type ClientCrashPhase = "start" | "message" | "cleanup";

export class ClientSession {
	readonly client: Client;

	private closed = false;
	private closeReason: ClientCloseReason = "client";
	private readonly closedPromise: Promise<void>;
	private resolveClosed!: () => void;

	constructor(private readonly options: ClientSessionOptions) {
		this.client = options.socket as Client;
		this.client.wsid = newId();
		this.client.clientIp = options.request.socket.remoteAddress ?? "";
		this.closedPromise = new Promise(resolve => {
			this.resolveClosed = resolve;
		});
	}

	start() {
		this.client.on("message", this.handleMessage);
		this.client.on("close", this.handleClose);

		this.guard("start", () => {
			this.options.state.addClient(this.client);
			this.log({
				level: "info",
				event: "session_connect",
				wsid: this.client.wsid,
				ip: this.client.clientIp,
			});

			this.client.keyCheck = setTimeout(() => {
				sendMessage(this.client, "denied", "key");
				setTimeout(() => this.close("key_timeout"), 500);
			}, 2000);

			sendMessage(this.client, "roomlist", this.options.lobbyService.buildRoomList(), this.options.eventService.checkEvents(), this.options.lobbyService.buildClientList(), this.client.wsid);

			this.client.heartbeat = setInterval(() => {
				if (this.client.beat) {
					this.close("heartbeat_timeout");
					clearInterval(this.client.heartbeat);
					return;
				}
				this.client.beat = true;
				sendRaw(this.client, "heartbeat");
			}, 60000);
		});
	}

	close(reason: ClientCloseReason = "server"): Promise<void> {
		if (this.closed) return this.closedPromise;

		this.closeReason = reason;
		if (this.client.readyState === WebSocket.CLOSED) {
			this.handleClose();
			return this.closedPromise;
		}

		this.client.close();
		return this.closedPromise;
	}

	crash(error: unknown, phase: ClientCrashPhase) {
		this.log({
			level: "error",
			event: "session_crash",
			wsid: this.client.wsid,
			ip: this.client.clientIp,
			phase,
			error,
		});
		this.close("crash");
	}

	dispose() {
		clearTimeout(this.client.keyCheck);
		clearInterval(this.client.heartbeat);
		this.client.off("message", this.handleMessage);
		this.client.off("close", this.handleClose);
	}

	private handleMessage = (msg: RawData) =>
		this.guard("message", () => {
			const raw = msg.toString();
			if (raw === "heartbeat") {
				this.client.beat = false;
				return;
			}

			const decision = this.options.resourcePolicy.checkMessage({
				client: this.client,
				raw,
				byteLength: Buffer.byteLength(raw),
			});
			if (!decision.allowed) {
				this.log({
					level: "warn",
					event: "message_denied",
					wsid: this.client.wsid,
					ip: this.client.clientIp,
					reason: decision.reason ?? "policy",
				});
				this.close("policy");
				return;
			}

			if (this.client.owner) {
				sendMessage(this.client.owner, "onmessage", this.client.wsid, raw);
				return;
			}

			const message = decodeRawMessage(raw);
			if (!message) {
				sendMessage(this.client, "denied", "banned");
				return;
			}

			if (message.type === "ignored") return;

			this.options.dispatchCommand(this.client, message.command, ...message.args);
		});

	private handleClose = () => {
		if (this.closed) return;
		this.closed = true;

		this.dispose();

		const wasInRoom = Boolean(this.client.room);
		let roomsChanged = false;

		try {
			roomsChanged = this.options.roomService.closeOwnedRooms(this.client);
		} catch (error) {
			this.logCleanupFailure(error);
		}

		try {
			if (this.client.owner) sendMessage(this.client.owner, "onclose", this.client.wsid);
		} catch (error) {
			this.logCleanupFailure(error);
		}

		this.options.state.deleteClient(this.client.wsid);

		try {
			if (roomsChanged || wasInRoom) this.options.lobbyService.updateRooms();
			else this.options.lobbyService.updateClients();
		} catch (error) {
			this.logCleanupFailure(error);
		}

		this.options.onClose(this);
		this.log({
			level: "info",
			event: "session_close",
			wsid: this.client.wsid,
			ip: this.client.clientIp,
			reason: this.closeReason,
		});
		this.resolveClosed();
	};

	private guard(phase: ClientCrashPhase, fn: () => void) {
		try {
			fn();
		} catch (error) {
			this.crash(error, phase);
		}
	}

	private logCleanupFailure(error: unknown) {
		this.log({
			level: "error",
			event: "cleanup_failure",
			wsid: this.client.wsid,
			ip: this.client.clientIp,
			phase: "cleanup",
			error,
		});
	}

	private log(event: LogInput) {
		writeLog(this.options.logger, event);
	}
}
