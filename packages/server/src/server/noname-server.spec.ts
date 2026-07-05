import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, test } from "vitest";
import { WebSocket } from "ws";

import type { ServerLogEvent } from "../types";
import { NonameServer } from "./noname-server";

const openSockets = new Set<WebSocket>();
let activeServer: NonameServer | undefined;

afterEach(async () => {
	for (const socket of [...openSockets]) {
		if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
			socket.close();
		}
	}
	openSockets.clear();

	if (activeServer) {
		await activeServer.stop();
		activeServer = undefined;
	}
});

describe("NonameServer", () => {
	test("sends roomlist to new clients and clears state on stop", async () => {
		const server = await startServer();
		const socket = await connect(server);

		expect(server.state.clients.size).toBe(1);

		socket.close();
		await waitForClose(socket);
		await server.stop();
		activeServer = undefined;

		expect(server.state.clients.size).toBe(0);
	});

	test("contains handler crashes to one session", async () => {
		const logs: ServerLogEvent[] = [];
		const server = await startServer(logs);
		const brokenSocket = await connect(server);

		(server.state as any).isKeyBanned = () => {
			throw new Error("boom");
		};

		brokenSocket.send(JSON.stringify(["server", "key", ["x"]]));
		await waitForClose(brokenSocket);

		expect(logs).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					event: "session_crash",
					phase: "message",
				}),
			]),
		);

		(server.state as any).isKeyBanned = () => false;
		const healthySocket = await connect(server);

		expect(healthySocket.readyState).toBe(WebSocket.OPEN);
	});
});

async function startServer(logs: ServerLogEvent[] = []): Promise<NonameServer> {
	const server = new NonameServer({
		port: 0,
		logger(event) {
			logs.push(event);
		},
	});
	activeServer = server;
	await server.start();
	return server;
}

async function connect(server: NonameServer): Promise<WebSocket> {
	const address = ((server as any).wss.address() as AddressInfo).port;
	const socket = new WebSocket(`ws://127.0.0.1:${address}`);
	openSockets.add(socket);

	const firstMessage = await waitForMessage(socket, message => message[0] === "roomlist", "roomlist");
	expect(firstMessage[0]).toBe("roomlist");

	return socket;
}

function waitForMessage(socket: WebSocket, predicate: (message: any[]) => boolean, label: string): Promise<any[]> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			socket.off("message", onMessage);
			reject(new Error(`Timed out waiting for ${label}`));
		}, 2000);

		const onMessage = (data: Buffer) => {
			const message = JSON.parse(data.toString());
			if (!predicate(message)) return;

			clearTimeout(timer);
			socket.off("message", onMessage);
			resolve(message);
		};

		socket.on("message", onMessage);
		socket.once("error", error => {
			clearTimeout(timer);
			socket.off("message", onMessage);
			reject(error);
		});
	});
}

function waitForClose(socket: WebSocket): Promise<void> {
	if (socket.readyState === WebSocket.CLOSED) return Promise.resolve();

	return new Promise(resolve => {
		socket.once("close", () => resolve());
	});
}
