import type { Client } from "../types";

export interface FakeClient extends Client {
	sent: string[];
	closed: boolean;
}

let nextClientId = 0;

export function createFakeClient(overrides: Partial<Client> = {}): FakeClient {
	const client = {
		wsid: `client-${++nextClientId}`,
		nickname: "无名玩家",
		avatar: "caocao",
		clientIp: "127.0.0.1",
		sent: [] as string[],
		closed: false,
		send(message: string) {
			client.sent.push(message);
		},
		close() {
			client.closed = true;
		},
		...overrides,
	};

	return client as unknown as FakeClient;
}

export function sentMessages(client: FakeClient): any[][] {
	return client.sent.map(message => JSON.parse(message));
}
