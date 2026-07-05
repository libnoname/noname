import type { CommandHandler } from "./index";
import { sendRaw } from "../utils/send";

export const relayHandlers: Record<string, CommandHandler> = {
	send(ctx, client, id: string, message: string) {
		const target = ctx.state.getClient(id);
		if (target && target.owner === client) {
			sendRaw(target, message);
		}
	},

	close(ctx, client, id: string) {
		const target = ctx.state.getClient(id);
		if (target && target.owner === client) target.close();
	},
};
