import { describe, expect, test } from "vitest";

import { createFakeClient } from "../test-utils/fake-client";
import { allowAllResourcePolicy } from "./resource-policy";

describe("allowAllResourcePolicy", () => {
	test("allows connections", () => {
		expect(
			allowAllResourcePolicy.checkConnection({
				ip: "127.0.0.1",
				request: { socket: { remoteAddress: "127.0.0.1" } } as any,
				sessionCount: 100,
			}),
		).toEqual({ allowed: true });
	});

	test("allows messages", () => {
		const raw = '["server","key",["abc"]]';

		expect(
			allowAllResourcePolicy.checkMessage({
				client: createFakeClient(),
				raw,
				byteLength: Buffer.byteLength(raw),
			}),
		).toEqual({ allowed: true });
	});
});
