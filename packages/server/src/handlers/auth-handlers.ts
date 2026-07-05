import type { CommandHandler } from "./index";
import { sendMessage } from "../utils/send";

export const authHandlers: Record<string, CommandHandler> = {
	key(ctx, client, id: any) {
		if (!id || typeof id !== "object") {
			sendMessage(client, "denied", "key");
			return client.close();
		}
		if (ctx.state.isKeyBanned(id[0])) {
			ctx.state.banIp(client.clientIp);
			return client.close();
		}
		client.onlineKey = id[0];
		ctx.clearKeyCheck(client);
	},
};
