import type { EventService } from "../services/eventService";
import type { LobbyService } from "../services/lobbyService";
import type { RoomService } from "../services/roomService";
import type { ServerState } from "../state/ServerState";
import type { Client } from "../types";
import { authHandlers } from "./authHandlers";
import { lobbyHandlers } from "./lobbyHandlers";
import { relayHandlers } from "./relayHandlers";
import { roomHandlers } from "./roomHandlers";

export interface HandlerContext {
	state: ServerState;
	lobbyService: LobbyService;
	roomService: RoomService;
	eventService: EventService;
	normalizeNickname(value: any): string;
	clearKeyCheck(client: Client): void;
}

export type CommandHandler = (ctx: HandlerContext, client: Client, ...args: any[]) => void;

export type CommandDispatcher = (client: Client, command: any, ...args: any[]) => void;

const commandHandlers: Record<string, CommandHandler> = {
	...roomHandlers,
	...lobbyHandlers,
	...authHandlers,
	...relayHandlers,
};

export function createCommandDispatcher(ctx: HandlerContext): CommandDispatcher {
	return (client, command, ...args) => {
		const handler = commandHandlers[String(command)];
		if (!handler) return;

		handler(ctx, client, ...args);
	};
}
