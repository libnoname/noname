import { describe, expect, test } from "vitest";

import { decodeRawMessage, encodeMessage } from "./codec";

describe("protocol codec", () => {
	test("encodes protocol arguments as JSON array", () => {
		expect(encodeMessage("server", "key", ["abc"])).toBe('["server","key",["abc"]]');
	});

	test("decodes server messages", () => {
		expect(decodeRawMessage('["server","create","room-key",1]')).toEqual({
			type: "server",
			command: "create",
			args: ["room-key", 1],
		});
	});

	test("ignores non-server array messages", () => {
		expect(decodeRawMessage('["client","hello"]')).toEqual({ type: "ignored" });
	});

	test("rejects invalid JSON and non-array messages", () => {
		expect(decodeRawMessage("{")).toBeNull();
		expect(decodeRawMessage('{"type":"server"}')).toBeNull();
	});
});
