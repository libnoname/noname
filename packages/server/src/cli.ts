#!/usr/bin/env node

import { createServer } from "./server/createServer";
import type { ServerLogEvent, ServerLogger } from "./types";

function readPort(): number {
	const portArgIndex = process.argv.findIndex(arg => arg === "--port" || arg === "-p");
	const rawPort = portArgIndex === -1 ? process.env.PORT : process.argv[portArgIndex + 1];
	const port = Number(rawPort ?? 8082);

	if (!Number.isInteger(port) || port < 0 || port > 65535) {
		throw new Error(`Invalid port: ${rawPort}`);
	}

	return port;
}

const port = readPort();
const logger: ServerLogger = event => {
	const output = JSON.stringify(normalizeLogEvent(event));
	if (event.level === "error") console.error(output);
	else if (event.level === "warn") console.warn(output);
	else console.log(output);
};
const server = createServer({ port, logger });

const stop = async () => {
	await server.stop();
	process.exit(0);
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

server.start().catch(error => {
	console.error(error);
	process.exit(1);
});

function normalizeLogEvent(event: ServerLogEvent): ServerLogEvent {
	if (!(event.error instanceof Error)) return event;

	return {
		...event,
		error: {
			name: event.error.name,
			message: event.error.message,
			stack: event.error.stack,
		},
	};
}
