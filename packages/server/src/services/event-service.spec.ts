import { describe, expect, test, vi } from "vitest";

import { ServerState } from "../state/server-state";
import { createFakeClient, sentMessages } from "../test-utils/fake-client";
import { EventService } from "./event-service";

describe("EventService", () => {
	test("removes expired events", () => {
		const state = new ServerState();
		const service = new EventService(state, value => String(value));

		state.events.push(
			{ id: "expired", creator: "a", nickname: "a", avatar: "caocao", utc: Date.now() - 1, day: 1, hour: 1, content: "old", members: ["a"] },
			{ id: "future", creator: "b", nickname: "b", avatar: "caocao", utc: Date.now() + 1000, day: 1, hour: 1, content: "new", members: ["b"] },
		);

		expect(service.checkEvents().map(event => event.id)).toEqual(["future"]);
	});

	test("bans invalid event identities", () => {
		const state = new ServerState();
		const service = new EventService(state, value => String(value));
		const client = createFakeClient({ clientIp: "10.0.0.1", onlineKey: "expected" });

		service.handleEvents(client, { utc: Date.now() + 1000, day: 1, hour: 1, content: "event" }, "other", "create");

		expect(state.isIpBanned("10.0.0.1")).toBe(true);
		expect(client.closed).toBe(true);
	});

	test("creates, joins, and leaves events", () => {
		vi.spyOn(Date, "now").mockReturnValue(1000);

		const state = new ServerState();
		const service = new EventService(state, value => (typeof value === "string" ? value.slice(0, 4) : "anon"));
		const creator = createFakeClient({ onlineKey: "creator-key" });
		const member = createFakeClient({ onlineKey: "member-key" });
		state.addClient(creator);
		state.addClient(member);

		service.handleEvents(
			creator,
			{ utc: 2000, day: 1, hour: 2, content: "hello", nickname: "creator-name", avatar: "" },
			"creator-key",
			"create",
		);

		expect(state.events).toHaveLength(1);
		const event = state.events[0];
		expect(event.creator).toBe("creator-key");
		expect(event.nickname).toBe("crea");
		expect(event.avatar).toBe("caocao");
		expect(event.members).toEqual(["creator-key"]);
		expect(sentMessages(creator).some(message => message[0] === "updateevents")).toBe(true);

		service.handleEvents(member, event.id, "member-key", "join");
		expect(event.members).toEqual(["creator-key", "member-key"]);

		service.handleEvents(creator, event.id, "creator-key", "leave");
		expect(event.members).toEqual(["member-key"]);

		service.handleEvents(member, event.id, "member-key", "leave");
		expect(state.events).toHaveLength(0);
	});
});
