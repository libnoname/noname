import type { Client, EventItem, Room } from "../types";

export class ServerState {
	readonly clients = new Map<string, Client>();
	readonly rooms = new Map<string, Room>();
	readonly events: EventItem[] = [];

	readonly bannedKeys = new Set<string>();
	readonly bannedIps = new Set<string>();
	readonly bannedKeyWords: string[] = [];

	addClient(client: Client) {
		this.clients.set(client.wsid, client);
	}

	getClient(id: string): Client | undefined {
		return this.clients.get(id);
	}

	deleteClient(id: string) {
		this.clients.delete(id);
	}

	getClients(): IterableIterator<Client> {
		return this.clients.values();
	}

	addRoom(room: Room) {
		this.rooms.set(room.key, room);
	}

	getRoom(key: string): Room | undefined {
		return this.rooms.get(key);
	}

	deleteRoom(key: string) {
		this.rooms.delete(key);
	}

	isIpBanned(ip: string): boolean {
		return this.bannedIps.has(ip);
	}

	isKeyBanned(key: string): boolean {
		return this.bannedKeys.has(key);
	}

	banIp(ip: string) {
		this.bannedIps.add(ip);
	}
}
