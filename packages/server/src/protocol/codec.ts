export interface IgnoredMessage {
	type: "ignored";
}

export interface ServerMessage {
	type: "server";
	command: any;
	args: any[];
}

export type ParsedMessage = IgnoredMessage | ServerMessage;

export function encodeMessage(...args: any[]): string {
	return JSON.stringify(args);
}

export function decodeRawMessage(raw: string): ParsedMessage | null {
	let message: any;
	try {
		message = JSON.parse(raw);
		if (!Array.isArray(message)) return null;
	} catch {
		return null;
	}

	if (message.shift() !== "server") return { type: "ignored" };

	return {
		type: "server",
		command: message.shift(),
		args: message,
	};
}
