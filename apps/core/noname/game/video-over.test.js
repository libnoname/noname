import assert from "node:assert/strict";
import test from "node:test";

import { unpackVideoOverContent } from "./video-over.js";

test("uses recorded handcard poptips without replay player state", () => {
	const handcardPoptips = [
		["poptip-1", "当前角色", [["heart", 7, "sha"]]],
		["poptip-2", "替补角色", []],
	];

	assert.deepEqual(
		unpackVideoOverContent({
			html: "<table></table>",
			handcardPoptips,
		}),
		{
			html: "<table></table>",
			handcardPoptips,
		}
	);
});

test("keeps legacy string-only replay content compatible", () => {
	assert.deepEqual(unpackVideoOverContent("<table></table>"), {
		html: "<table></table>",
		handcardPoptips: null,
	});
});
