import assert from "node:assert/strict";
import test from "node:test";
import { transformEventContext } from "../packages/jit/src/event-context-transform.ts";
import { executionContext, eventContextAwaiter } from "../apps/core/noname/library/element/GameEvent/ExecutionContext.js";

test("generator continuations isolate two interleaved skill owners and nested execution", async () => {
	const a = { player: { playerid: "A" }, skill: "same" }, b = { player: { playerid: "B" }, skill: "same" };
	const log = [];
	let releaseA, releaseB;
	const gateA = new Promise(r => releaseA = r), gateB = new Promise(r => releaseB = r);
	function work(gate) {
		return eventContextAwaiter(this, [], undefined, function* () {
			log.push(executionContext.current.player.playerid);
			yield gate;
			log.push(executionContext.current.player.playerid);
			executionContext.run({ player: { playerid: "nested" } }, () => log.push(executionContext.current.player.playerid));
			log.push(executionContext.current.player.playerid);
		});
	}
	const first = executionContext.run(a, () => work(gateA));
	const second = executionContext.run(b, () => work(gateB));
	assert.equal(executionContext.current, undefined, "no owner remains active while waiting");
	releaseB(); await second; releaseA(); await first;
	assert.deepEqual(log, ["A", "B", "B", "nested", "B", "A", "nested", "A"]);
	assert.equal(executionContext.current, undefined);
});

test("only dispatched holder metadata creates ownership, ordinary event.player does not", () => {
	const a = { playerid: "A" }, c = { playerid: "C" };
	const arbitrary = { player: c };
	assert.equal(executionContext.forEvent(arbitrary), undefined);
	const root = { player: c };
	executionContext.setSkill(root, a, "same");
	const child = { player: c, parent: root };
	assert.equal(executionContext.forEvent(child).player, a);
	executionContext.setSkill(child, c, "nested");
	assert.equal(executionContext.forEvent(child).player, c);
	assert.equal(executionContext.forEvent(root).player, a);
});

test("rejected await restores the matching owner in catch and finally then cleans up", async () => {
	const log = [], frame = { player: { playerid: "A" } };
	await assert.rejects(executionContext.run(frame, () => eventContextAwaiter(null, [], undefined, function* () {
		try { yield Promise.reject(new Error("failure")); }
		catch (error) { log.push(executionContext.current.player.playerid); throw error; }
		finally { log.push(executionContext.current.player.playerid); }
	})), /failure/);
	assert.deepEqual(log, ["A", "A"]);
	assert.equal(executionContext.current, undefined);
});

test("the production transform preserves closures, native async dispatch and post-await source", async () => {
	const code = transformEventContext(`
		const lexical = 17;
		return { async content(event) {
			event.before = executionContext.current?.player.playerid;
			await event.gate;
			event.after = executionContext.current?.player.playerid;
			event.lexical = lexical;
		} };
	`, "fixture.js").replace(/^import .*;\n/, "");
	// The compiler receives a module, not a Function body.
	const moduleCode = code.replace("return {", "const skills = {").replace(/;?\s*$/, "\nreturn skills;");
	const skills = new Function("__nonameEventAwaiter", "executionContext", moduleCode)(eventContextAwaiter, executionContext);
	assert.equal(skills.content.constructor.name, "AsyncFunction");
	let release;
	const event = { gate: new Promise(r => release = r) };
	const done = executionContext.run({ player: { playerid: "A" } }, () => skills.content(event));
	assert.equal(executionContext.current, undefined);
	release(); await done;
	assert.deepEqual([event.before, event.after, event.lexical], ["A", "A", 17]);
});
