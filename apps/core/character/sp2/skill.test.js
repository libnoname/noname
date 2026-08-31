import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("starzhongyan AI preserves deck-top positions when exchanging cards", async () => {
	const source = await readFile(new URL("./skill.js", import.meta.url), "utf8");
	const skillStart = source.indexOf('chooseToMove("忠言：交换其中一张牌"');
	const callbackStart = source.indexOf('.set("processAI", ', skillStart) + '.set("processAI", '.length;
	const callbackEnd = source.indexOf("\n\t\t\t\t.forResult();", callbackStart);
	assert.ok(skillStart >= 0 && callbackEnd >= 0, "starzhongyan processAI callback should be present");
	const callback = source.slice(callbackStart, callbackEnd).trim();
	assert.ok(callback.endsWith("})"), "starzhongyan processAI callback should be a function");

	const processAI = Function("get", `return (${callback.slice(0, -1)});`)({
		value: card => card.value,
	});
	const [a, b, c, x, h, y] = [
		{ name: "A", value: 10 },
		{ name: "B", value: 2 },
		{ name: "C", value: 3 },
		{ name: "X", value: 5 },
		{ name: "H", value: 1 },
		{ name: "Y", value: 6 },
	];
	const moved = processAI([
		["牌堆顶", [a, b, c]],
		["你的手牌", [x, h, y]],
	]);

	assert.deepEqual(moved, [
		[h, b, c],
		[x, a, y],
	]);
});
