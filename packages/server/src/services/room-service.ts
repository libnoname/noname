import type { Client, Room } from "../types";
import { ServerState } from "../state/server-state";
import { sendMessage } from "../utils/send";

export class RoomService {
	constructor(private readonly state: ServerState) {}

	createRoom(client: Client, key: string): Room {
		const room: Room = { key, owner: client };
		this.state.addRoom(room);
		client.room = room;
		delete client.status;
		return room;
	}

	enterRoom(client: Client, room: Room) {
		client.room = room;
		delete client.status;
	}

	notifyRoomOwner(client: Client, room: Room) {
		if (room.owner) {
			client.owner = room.owner;
			sendMessage(room.owner, "onconnection", client.wsid);
		}
	}

	configureRoom(client: Client, config: any): boolean {
		const room = client.room;
		if (!room || room.owner !== client) return false;

		if (room.servermode) {
			room.servermode = false;
		}
		room.config = config;
		return true;
	}

	closeRoom(room: Room, _reason: string): boolean {
		let closed = false;

		this.state.rooms.forEach((currentRoom, key) => {
			if (currentRoom !== room) return;

			this.state.clients.forEach(client => {
				if (client.room !== room) return;

				if (client !== room.owner) {
					sendMessage(client, "selfclose");
				}
				if (client.owner === room.owner) {
					delete client.owner;
				}
				delete client.room;
			});

			this.state.deleteRoom(key);
			closed = true;
		});

		return closed;
	}

	closeOwnedRooms(client: Client): boolean {
		let closed = false;

		for (const room of [...this.state.rooms.values()]) {
			if (room.owner === client) {
				closed = this.closeRoom(room, "owner_closed") || closed;
			}
		}

		return closed;
	}
}
