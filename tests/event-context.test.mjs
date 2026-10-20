import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { compile as compileJIT } from "../packages/jit/src/service-worker/ts-compiler.ts";
import { transformEventContext } from "../packages/jit/src/event-context-transform.ts";
import { executionContext, eventContextAwaiter } from "../apps/core/noname/library/element/GameEvent/ExecutionContext.js";

test("generator continuations isolate two interleaved skill owners and nested execution", async () => {
	const a = { player: { playerid: "A" }, skill: "same" },
		b = { player: { playerid: "B" }, skill: "same" };
	const log = [];
	let releaseA, releaseB;
	const gateA = new Promise(r => (releaseA = r)),
		gateB = new Promise(r => (releaseB = r));
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
	releaseB();
	await second;
	releaseA();
	await first;
	assert.deepEqual(log, ["A", "B", "B", "nested", "B", "A", "nested", "A"]);
	assert.equal(executionContext.current, undefined);
});

test("only dispatched holder metadata creates ownership, ordinary event.player does not", () => {
	const a = { playerid: "A" },
		c = { playerid: "C" };
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
	const log = [],
		frame = { player: { playerid: "A" } };
	await assert.rejects(
		executionContext.run(frame, () =>
			eventContextAwaiter(null, [], undefined, function* () {
				try {
					yield Promise.reject(new Error("failure"));
				} catch (error) {
					log.push(executionContext.current.player.playerid);
					throw error;
				} finally {
					log.push(executionContext.current.player.playerid);
				}
			})
		),
		/failure/
	);
	assert.deepEqual(log, ["A", "A"]);
	assert.equal(executionContext.current, undefined);
});

test("the production transform preserves closures, native async dispatch and post-await source", async () => {
	const code = transformEventContext(
		`
		const lexical = 17;
		return { async content(event) {
			event.before = executionContext.current?.player.playerid;
			await event.gate;
			event.after = executionContext.current?.player.playerid;
			event.lexical = lexical;
		} };
	`,
		"fixture.js"
	).replace(/^import .*;\n/, "");
	// The compiler receives a module, not a Function body.
	const moduleCode = code.replace("return {", "const skills = {").replace(/;?\s*$/, "\nreturn skills;");
	const skills = new Function("__nonameEventAwaiter", "executionContext", moduleCode)(eventContextAwaiter, executionContext);
	assert.equal(skills.content.constructor.name, "AsyncFunction");
	let release;
	const event = { gate: new Promise(r => (release = r)) };
	const done = executionContext.run({ player: { playerid: "A" } }, () => skills.content(event));
	assert.equal(executionContext.current, undefined);
	release();
	await done;
	assert.deepEqual([event.before, event.after, event.lexical], ["A", "A", 17]);
});

test("native Promise callbacks capture their registration frame without leaving it active", async () => {
	const frame = { player: { playerid: "A" } },
		waiting = executionContext.run(frame, () => Promise.resolve().then(() => executionContext.current?.player.playerid));
	assert.equal(executionContext.current, undefined);
	assert.equal(await waiting, "A");
});

test("timer callbacks restore their registration frame and remove it before returning", async () => {
	const frame = { player: { playerid: "A" } };
	const waiting = new Promise(resolve => executionContext.run(frame, () => setTimeout(() => resolve(executionContext.current?.player.playerid), 0)));
	assert.equal(executionContext.current, undefined);
	assert.equal(await waiting, "A");
	assert.equal(executionContext.current, undefined);
});

test("JIT keeps a worker without game imports executable without loading DOM engine modules", async () => {
	const source = "self.onmessage = async () => { await Promise.resolve(); self.sent = 42; };";
	const compiled = await compileJIT(source, "worker.ts");
	const realm = vm.createContext({ self: {} });
	new vm.Script(compiled).runInContext(realm);
	await realm.self.onmessage();
	assert.equal(realm.self.sent, 42);
});

test("the actual JIT compiler preserves a game extension's lexical state and await frame", async () => {
	const source = 'import { game } from "noname"; const lexical = 4; export async function content(context) { await Promise.resolve(); return [lexical, context.current?.player.playerid]; }';
	const compiled = (await compileJIT(source, "extension.ts")).replace(/^import .*;\r?\n/gm, "").replace("export async function content", "async function content");
	const content = new Function("__nonameEventAwaiter", compiled + "\nreturn content;")(eventContextAwaiter);
	const result = await executionContext.run({ player: { playerid: "A" } }, () => content(executionContext));
	assert.deepEqual(result, [4, "A"]);
});

test("async-only lowering keeps legacy Step rest syntax and handles optional catch", async () => {
	const source = `const skills = {
  content(event) { const {unused, ...rest} = event.payload; return rest.kept; },
  async modern() { try { await Promise.reject(1); } catch { return 7; } }
 };`;
	const code = transformEventContext(source, "mixed.js").replace(/^import .*;\r?\n/, "");
	const skills = new Function("__nonameEventAwaiter", code + "\nreturn skills;")(eventContextAwaiter);
	assert.equal(
		new Function(
			"event",
			skills.content
				.toString()
				.replace(/^content\(event\)\s*\{/, "")
				.replace(/\}\s*$/, "")
		)({ payload: { unused: 0, kept: 3 } }),
		3
	);
	assert.equal(await skills.modern(), 7);
	assert.equal(skills.modern.constructor.name, "AsyncFunction");
});

test("a user's __awaiter call is not mistaken for a compiler helper", async () => {
	const source = `function __awaiter() { return 9; } export async function content() { await Promise.resolve(); return __awaiter(); }`;
	const code = transformEventContext(source, "helper.js")
		.replace(/^import .*;\r?\n/, "")
		.replace("export async function", "async function");
	const content = new Function("__nonameEventAwaiter", code + "\nreturn content;")(eventContextAwaiter);
	assert.equal(await content(), 9);
});

test("sandbox realm modules never receive a game import in a blank iframe", () => {
	const source = "export async function initialize() { await Promise.resolve(); }";
	assert.equal(transformEventContext(source, "apps/core/noname/util/sandbox/initRealms.js"), source);
	assert.equal(transformEventContext(source, "C:\\repo\\apps\\core\\noname\\util\\sandbox\\sandbox.js"), source);
});
