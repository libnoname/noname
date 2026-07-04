import type { Client, Room } from "../types";
import { ServerState } from "../state/ServerState";
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

	closeOwnedRooms(client: Client) {
		this.state.rooms.forEach((room, key) => {
			if (room.owner === client) {
				// notify all clients in this room
				this.state.clients.forEach(c => {
					if (c.room === room && c !== client) {
						sendMessage(c, "selfclose");
					}
				});
				this.state.deleteRoom(key);
			}
		});
	}
}
