import type { Client } from "../types";
import { encodeMessage } from "../protocol/codec";

export function sendMessage(client: Client, ...args: any[]) {
	sendRaw(client, encodeMessage(...args));
}

export function sendRaw(client: Client, message: string) {
	try {
		client.send(message);
	} catch {
		client.close();
	}
}
