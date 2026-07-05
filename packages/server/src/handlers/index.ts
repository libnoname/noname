import type { EventService } from "../services/event-service";
import type { LobbyService } from "../services/lobby-service";
import type { RoomService } from "../services/room-service";
import type { ServerState } from "../state/server-state";
import type { Client } from "../types";
import { authHandlers } from "./auth-handlers";
import { lobbyHandlers } from "./lobby-handlers";
import { relayHandlers } from "./relay-handlers";
import { roomHandlers } from "./room-handlers";

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
