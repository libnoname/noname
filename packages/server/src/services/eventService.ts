import type { Client, EventItem } from "../types";
import { ServerState } from "../state/ServerState";
import { isBannedText } from "../utils/ban";
import { newId } from "../utils/id";
import { sendMessage } from "../utils/send";

export class EventService {
	constructor(
		private readonly state: ServerState,
		private readonly nickname: (value: any) => string,
	) {}

	checkEvents() {
		const now = Date.now();
		for (let i = 0; i < this.state.events.length; i++) {
			if (this.state.events[i].utc <= now) {
				this.state.events.splice(i--, 1);
			}
		}
		return this.state.events;
	}

	updateEvents() {
		this.checkEvents();
		this.state.clients.forEach(c => {
			if (!c.room) sendMessage(c, "updateevents", this.state.events);
		});
	}

	handleEvents(client: Client, cfg: any, id: string, type: string) {
		if (this.state.isKeyBanned(id) || typeof id !== "string" || client.onlineKey !== id) {
			this.state.banIp(client.clientIp);
			client.close();
			return;
		}

		let changed = false;
		const now = Date.now();

		if (typeof cfg === "string") {
			// join / leave existing event
			for (let ev of this.state.events) {
				if (ev.id === cfg) {
					if (type === "join" && !ev.members.includes(id)) {
						ev.members.push(id);
						changed = true;
					}
					if (type === "leave") {
						const idx = ev.members.indexOf(id);
						if (idx !== -1) {
							ev.members.splice(idx, 1);
							if (ev.members.length === 0) {
								const index = this.state.events.indexOf(ev);
								this.state.events.splice(index, 1);
							}
							changed = true;
						}
					}
				}
			}
		} else if (cfg && typeof cfg === "object" && "utc" in cfg && "day" in cfg && "hour" in cfg && "content" in cfg) {
			if (this.state.events.length >= 20) sendMessage(client, "eventsdenied", "total");
			else if (cfg.utc <= now) sendMessage(client, "eventsdenied", "time");
			else if (isBannedText(cfg.content, this.state.bannedKeyWords)) sendMessage(client, "eventsdenied", "ban");
			else {
				const item: EventItem = {
					...cfg,
					nickname: this.nickname(cfg.nickname),
					avatar: cfg.avatar || "caocao",
					creator: id,
					id: newId(),
					members: [id],
				};
				this.state.events.unshift(item);
				changed = true;
			}
		}

		if (changed) this.updateEvents();
	}
}
