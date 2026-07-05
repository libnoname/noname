import type { CommandHandler } from "./index";
import { sendMessage } from "../utils/send";

export const roomHandlers: Record<string, CommandHandler> = {
	create(ctx, client, key: string, nickname: string, avatar: string, config: any, mode: string) {
		if (client.onlineKey !== key) return;

		client.nickname = ctx.normalizeNickname(nickname);
		client.avatar = avatar;

		ctx.roomService.createRoom(client, key);
		sendMessage(client, "createroom", key);
		ctx.lobbyService.updateRooms();
	},

	enter(ctx, client, key: string, nickname: string, avatar: string) {
		const room = ctx.state.getRoom(key);
		if (!room) return sendMessage(client, "enterroomfailed");

		client.nickname = ctx.normalizeNickname(nickname);
		client.avatar = avatar;
		ctx.roomService.enterRoom(client, room);

		if (!room.owner) return sendMessage(client, "enterroomfailed");

		if (!room.config || (room.config.gameStarted && (!room.config.observe || !room.config.observeReady))) {
			return sendMessage(client, "enterroomfailed");
		}

		ctx.roomService.notifyRoomOwner(client, room);
		ctx.lobbyService.updateRooms();
	},

	config(ctx, client, config: any) {
		if (!ctx.roomService.configureRoom(client, config)) return;
		ctx.lobbyService.updateRooms();
	},
};
