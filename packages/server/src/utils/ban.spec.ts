import { describe, expect, test } from "vitest";

import { isBannedText } from "./ban";

describe("isBannedText", () => {
	test("matches banned keywords inside text", () => {
		expect(isBannedText("hello forbidden world", ["forbidden"])).toBe(true);
	});

	test("allows text with no banned keyword", () => {
		expect(isBannedText("hello world", ["forbidden", "blocked"])).toBe(false);
	});
});
