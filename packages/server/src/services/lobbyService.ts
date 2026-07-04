import { ServerState } from "../state/ServerState";
import { sendMessage } from "../utils/send";

export class LobbyService {
	constructor(private readonly state: ServerState) {}

	buildRoomList(): any[] {
		const roomList: any[] = [];
		const clientCount = new Map<string, number>();

		// init counter
		this.state.rooms.forEach((room, key) => clientCount.set(key, 0));

		// count clients per room
		this.state.clients.forEach(c => {
			if (c.room && !c.servermode) {
				const key = c.room.key;
				clientCount.set(key, (clientCount.get(key) || 0) + 1);
			}
		});

		// build output list
		this.state.rooms.forEach((room, key) => {
			const count = clientCount.get(key) || 0;
			if (room.servermode) {
				roomList.push("server");
			} else if (room.owner && room.config) {
				if (count === 0) {
					sendMessage(room.owner, "reloadroom");
				}
				roomList.push([room.owner.nickname, room.owner.avatar, room.config, count, room.key]);
			}
		});

		return roomList;
	}

	buildClientList(): any[] {
		const out: any[] = [];
		this.state.clients.forEach(c => {
			out.push([c.nickname, c.avatar, !c.room, c.status, c.wsid, c.onlineKey]);
		});
		return out;
	}

	updateRooms() {
		const roomList = this.buildRoomList();
		const clientList = this.buildClientList();
		this.state.clients.forEach(c => {
			if (!c.room) sendMessage(c, "updaterooms", roomList, clientList);
		});
	}

	updateClients() {
		const list = this.buildClientList();
		this.state.clients.forEach(c => {
			if (!c.room) sendMessage(c, "updateclients", list);
		});
	}
}
