import type { CommandHandler } from "./index";

export const lobbyHandlers: Record<string, CommandHandler> = {
	changeAvatar(ctx, client, nickname: string, avatar: string) {
		client.nickname = ctx.normalizeNickname(nickname);
		client.avatar = avatar;
		ctx.lobbyService.updateClients();
	},

	events(ctx, client, cfg: any, id: string, type: string) {
		ctx.eventService.handleEvents(client, cfg, id, type);
	},

	status(ctx, client, str: any) {
		if (typeof str === "string") client.status = str;
		else delete client.status;
		ctx.lobbyService.updateClients();
	},
};
