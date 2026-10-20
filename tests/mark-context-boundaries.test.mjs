import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { executionContext } from "../apps/core/noname/library/element/GameEvent/ExecutionContext.js";

// These assertions intentionally still fail. Normal runs report TODO, and
// MARK_STRICT_CONTEXT=1 makes the unsupported boundaries return a failing exit.
// Do not change them to assert "unknown" and then claim complete async support.
const limitation = reason => ({ todo: process.env.MARK_STRICT_CONTEXT === "1" ? false : reason });

test("runtime-generated native async continuation still needs compilation or explicit source", limitation("Native await bypasses Promise.then; runtime generation did not pass the module compiler"), async () => {
	const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
	const content = new AsyncFunction("context", "await Promise.resolve(); return context.current?.player.playerid;");
	const actual = await executionContext.run({ player: { playerid: "A" } }, () => content(executionContext));
	assert.equal(actual, "A");
});

test("callbacks registered on a separate uninstrumented realm still lose their source", limitation("A foreign realm has different Promise intrinsics; no owner is guessed for it"), async () => {
	const callback = vm.runInNewContext("(context) => Promise.resolve().then(() => context.current?.player.playerid)");
	const actual = await executionContext.run({ player: { playerid: "A" } }, () => callback(executionContext));
	assert.equal(actual, "A");
});
