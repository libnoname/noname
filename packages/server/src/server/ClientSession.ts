import type { IncomingMessage } from "node:http";
import type { RawData, WebSocket } from "ws";

import type { CommandDispatcher } from "../handlers";
import { decodeRawMessage } from "../protocol/codec";
import type { EventService } from "../services/eventService";
import type { LobbyService } from "../services/lobbyService";
import type { RoomService } from "../services/roomService";
import type { ServerState } from "../state/ServerState";
import type { Client } from "../types";
import { newId } from "../utils/id";
import { sendMessage, sendRaw } from "../utils/send";

export interface ClientSessionOptions {
	socket: WebSocket;
	request: IncomingMessage;
	state: ServerState;
	lobbyService: LobbyService;
	roomService: RoomService;
	eventService: EventService;
	dispatchCommand: CommandDispatcher;
	onClose(session: ClientSession): void;
}

export class ClientSession {
	readonly client: Client;

	private closed = false;
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
		this.options.state.addClient(this.client);

		this.client.keyCheck = setTimeout(() => {
			sendMessage(this.client, "denied", "key");
			setTimeout(() => this.client.close(), 500);
		}, 2000);

		sendMessage(this.client, "roomlist", this.options.lobbyService.buildRoomList(), this.options.eventService.checkEvents(), this.options.lobbyService.buildClientList(), this.client.wsid);

		this.client.heartbeat = setInterval(() => {
			if (this.client.beat) {
				this.client.close();
				clearInterval(this.client.heartbeat);
				return;
			}
			this.client.beat = true;
			sendRaw(this.client, "heartbeat");
		}, 60000);

		this.client.on("message", this.handleMessage);
		this.client.on("close", this.handleClose);
	}

	close(): Promise<void> {
		if (this.closed) return this.closedPromise;

		this.client.close();
		return this.closedPromise;
	}

	dispose() {
		clearTimeout(this.client.keyCheck);
		clearInterval(this.client.heartbeat);
		this.client.off("message", this.handleMessage);
		this.client.off("close", this.handleClose);
	}

	private handleMessage = (msg: RawData) => {
		const raw = msg.toString();
		if (raw === "heartbeat") {
			this.client.beat = false;
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
	};

	private handleClose = () => {
		if (this.closed) return;
		this.closed = true;

		this.dispose();

		this.options.roomService.closeOwnedRooms(this.client);

		if (this.client.owner) sendMessage(this.client.owner, "onclose", this.client.wsid);

		this.options.state.deleteClient(this.client.wsid);

		if (this.client.room) this.options.lobbyService.updateRooms();
		else this.options.lobbyService.updateClients();

		this.options.onClose(this);
		this.resolveClosed();
	};
}
