import type { ServerLogger } from "../types";

export type LogInput = {
	level: Parameters<ServerLogger>[0]["level"];
	event: string;
	[key: string]: unknown;
};

export function writeLog(logger: ServerLogger, event: LogInput) {
	logger({
		...event,
		at: Date.now(),
	});
}
