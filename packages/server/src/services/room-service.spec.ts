import { describe, expect, test } from "vitest";

import { ServerState } from "../state/server-state";
import { createFakeClient, sentMessages } from "../test-utils/fake-client";
import { RoomService } from "./room-service";

describe("RoomService", () => {
	test("creates, enters, and configures rooms", () => {
		const state = new ServerState();
		const service = new RoomService(state);
		const owner = createFakeClient({ onlineKey: "room-key" });
		const member = createFakeClient();

		const room = service.createRoom(owner, "room-key");
		service.enterRoom(member, room);

		expect(state.getRoom("room-key")).toBe(room);
		expect(owner.room).toBe(room);
		expect(member.room).toBe(room);
		expect(owner.status).toBeUndefined();
		expect(member.status).toBeUndefined();

		expect(service.configureRoom(owner, { gameStarted: false })).toBe(true);
		expect(room.config).toEqual({ gameStarted: false });
		expect(service.configureRoom(member, { gameStarted: true })).toBe(false);
	});

	test("closes owned rooms and clears member references", () => {
		const state = new ServerState();
		const service = new RoomService(state);
		const owner = createFakeClient({ wsid: "owner", nickname: "owner" });
		const member = createFakeClient({ wsid: "member", nickname: "member" });

		state.addClient(owner);
		state.addClient(member);
		const room = service.createRoom(owner, "room-key");
		service.enterRoom(member, room);
		service.notifyRoomOwner(member, room);

		expect(member.owner).toBe(owner);

		expect(service.closeOwnedRooms(owner)).toBe(true);
		expect(state.getRoom("room-key")).toBeUndefined();
		expect(owner.room).toBeUndefined();
		expect(member.room).toBeUndefined();
		expect(member.owner).toBeUndefined();
		expect(sentMessages(member)).toContainEqual(["selfclose"]);
	});
});
