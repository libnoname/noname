import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

// Execute the actual Player class; replace only browser/network/event boundaries.
// No Mark method is replaced. Load the real array polyfills, including NaN behavior.
function fixture() {
	const events = [], videos = [], syncs = [];
	const lib = { skill: { camp: { intro: { content: "mark" } } }, translate: {} };
	const game = {
		log() {}, broadcast() {},
		addVideo(...args) { videos.push(args); },
		createEvent(name) { const event = { name, setContent() {} }; events.push(event); return event; },
	};
	const context = vm.createContext({
		game, lib, HTMLDivElement: class {}, CacheContext: { inject() {} }, ui: { updatem() {} },
		get: { event() {}, info(name) { return lib.skill[name]; }, cnNumber: String, itemtype() {} },
	});
	const polyfill = fs.readFileSync(new URL("../apps/core/noname/init/polyfill.ts", import.meta.url), "utf8");
	const arrayHelpers = polyfill.slice(polyfill.indexOf('Object.defineProperty(Array.prototype, "add",'), polyfill.indexOf('Object.defineProperty(Array.prototype, "unique",'));
	vm.runInContext(ts.transpile(arrayHelpers), context);
	const source = fs.readFileSync(new URL("../apps/core/noname/library/element/player.js", import.meta.url), "utf8")
		.replace(/^import .*;\r?\n/gm, "").replace("export class Player", "globalThis.Player = class Player");
	vm.runInContext(source, context);
	let id = 0;
	function player() {
		const p = Object.create(context.Player.prototype);
		Object.assign(p, { storage: {}, marks: {}, name: "same_general", playerid: `player:${++id}` });
		p.syncStorage = name => syncs.push([name, p.countMark(name)]);
		p.updateMarks = () => {};
		p.mark = (name, info) => ({ name, info, style: { transform: "" }, delete() {} });
		return p;
	}
	return { player, events, videos, syncs, lib };
}

test("legacy numeric and shared calls keep totals, defaults, events and storage shape", () => {
	const { player, events, syncs } = fixture(), p = player();
	p.addMark("camp", 2, false);
	p.addMark("camp", 0, false); // Historical zero means one.
	assert.equal(p.storage.camp, 3);
	assert.equal(p.countMark("camp"), 3);
	assert.equal(p.hasMark("camp"), true);
	p.removeMark("camp", 1, false);
	p.setMark("camp", 5, false);
	p.clearMark("camp", false);
	assert.equal(p.countMark("camp"), 0);
	assert.equal(p.hasMark("camp"), false);
	assert.equal(p.marks.camp, undefined);
	assert.deepEqual(events.map(e => [e.name, e.num]), [["addMark", 2], ["addMark", 1], ["removeMark", 1], ["addMark", 3], ["removeMark", 5]]);
	assert.deepEqual(syncs.map(x => x[1]), [2, 3, 2, 5, 0]);
});

test("two explicit Player sources are isolated without changing aggregate numeric storage", () => {
	const { player } = fixture(), a = player(), b = player(), c = player();
	c.addMark("camp", 2, false, { source: a });
	c.addMark("camp", 3, false, { source: b });
	assert.equal(c.storage.camp, 5);
	assert.equal(c.countMark("camp", { source: a }), 2);
	assert.equal(c.countMark("camp", { source: b.playerid }), 3);
	c.removeMark("camp", 99, false, { source: a });
	assert.equal(c.hasMark("camp", { source: a }), false);
	assert.equal(c.countMark("camp", { source: b }), 3);
	assert.equal(c.countMark("camp"), 3);
	c.clearMark("camp", false, { source: b });
	assert.equal(c.countMark("camp"), 0);
});

test("source setMark changes only its own share and source-less setMark still changes total", () => {
	const { player } = fixture(), p = player();
	p.addMark("camp", 2, false, { source: "A" });
	p.addMark("camp", 3, false, { source: "B" });
	p.setMark("camp", 4, false, { source: "A" });
	assert.equal(p.countMark("camp"), 7);
	p.setMark("camp", 1, false, { source: "A" });
	assert.equal(p.countMark("camp", { source: "B" }), 3);
	p.setMark("camp", 6, false);
	assert.equal(p.countMark("camp"), 6);
	assert.equal(p.countMark("camp", { source: null }), 2);
	p.clearMark("camp", false);
	assert.equal(p.countMark("camp", { source: "B" }), 0);
});

test("unqualified consumption uses unknown share first, then explicit shares in insertion order", () => {
	const { player } = fixture(), p = player();
	p.addMark("camp", 2, false, { source: "A" });
	p.addMark("camp", 3, false, { source: "B" });
	p.addMark("camp", 1, false);
	p.removeMark("camp", 2, false);
	assert.equal(p.countMark("camp", { source: null }), 0);
	assert.equal(p.countMark("camp", { source: "A" }), 1);
	assert.equal(p.countMark("camp", { source: "B" }), 3);
	assert.equal(p.countMark("camp"), 4);
});

test("legacy arrays keep unique items, reference identity and clearMark no-op", () => {
	const { player } = fixture(), p = player(), card = {};
	p.markAuto("camp", card);
	p.markAuto("camp", card);
	const array = p.storage.camp;
	assert.equal(p.countMark("camp"), 1);
	p.clearMark("camp", false);
	assert.equal(p.countMark("camp"), 1);
	p.unmarkAuto("camp", card);
	assert.equal(p.storage.camp, array);
	assert.equal(p.countMark("camp"), 0);
});

test("array source membership preserves overlapping items until their last source is removed", () => {
	const { player } = fixture(), p = player(), item = {};
	p.markAuto("camp", item, { source: "A" });
	p.markAuto("camp", item, { source: "B" });
	assert.equal(p.countMark("camp"), 1);
	assert.equal(p.countMark("camp", { source: "A" }), 1);
	assert.equal(p.countMark("camp", { source: "B" }), 1);
	p.unmarkAuto("camp", item, { source: "A" });
	assert.equal(p.countMark("camp"), 1);
	assert.equal(p.hasMark("camp", { source: "A" }), false);
	p.clearMark("camp", false, { source: "B" });
	assert.equal(p.countMark("camp"), 0);
});

test("source-less array removal deletes all memberships, source-less add preserves unknown membership", () => {
	const { player } = fixture(), p = player();
	p.markAuto("camp", "card", { source: "A" });
	p.markAuto("camp", "card");
	p.clearMark("camp", false, { source: "A" });
	assert.equal(p.countMark("camp", { source: null }), 1);
	p.markAuto("camp", "card", { source: "B" });
	p.unmarkAuto("camp", "card");
	assert.equal(p.countMark("camp", { source: "B" }), 0);
	assert.equal(p.countMark("camp"), 0);
});

test("external storage replacement invalidates unsupported provenance instead of guessing", () => {
	const { player } = fixture(), p = player();
	p.addMark("camp", 2, false, { source: "A" });
	p.storage.camp = 9;
	assert.equal(p.countMark("camp", { source: "A" }), 0);
	assert.equal(p.countMark("camp", { source: null }), 9);
	p.markAuto("array", "x", { source: "A" });
	p.storage.array.push("y");
	assert.equal(p.countMark("array", { source: "A" }), 0);
	assert.equal(p.countMark("array", { source: null }), 2);
});

test("invalid explicit identity and numeric quantities fail before state or visible effects change", () => {
	const { player, events } = fixture(), p = player();
	for (const source of [{ name: "xurong" }, "", 1]) {
		assert.throws(() => p.addMark("camp", 1, false, { source }), { name: "TypeError" });
	}
	for (const num of [-1, Infinity, NaN]) {
		assert.throws(() => p.addMark("camp", num, false, { source: "A" }), { name: "RangeError" });
	}
	assert.equal(p.countMark("camp"), 0);
	assert.equal(events.length, 0);
});

test("unmarkSkill preserves display-only semantics but reconciles custom storage deletion", () => {
	const { player, lib } = fixture(), p = player();
	p.addMark("camp", 2, false, { source: "A" });
	p.unmarkSkill("camp");
	assert.equal(p.countMark("camp", { source: "A" }), 2);
	p.markSkill("camp");
	lib.skill.camp.intro.onunmark = true;
	p.unmarkSkill("camp");
	assert.equal(p.countMark("camp", { source: "A" }), 0);
	p.addMark("camp", 1, false);
	assert.equal(p.countMark("camp", { source: null }), 1);
});

test("source removal event reports the consumed amount and callback sees committed shares", () => {
	const { player, events, lib } = fixture(), p = player();
	p.addMark("camp", 2, false, { source: "A" });
	let during;
	lib.skill.camp.intro.onunmark = () => { during = p.countMark("camp", { source: "A" }); };
	p.removeMark("camp", 10, false, { source: "A" });
	assert.equal(during, 0);
	assert.equal(events.at(-1).num, 2);
	assert.equal(p.countMark("camp"), 0);
});

test("bearers and mark names remain independent even with identical general names", () => {
	const { player } = fixture(), a = player(), b = player();
	a.addMark("camp", 2, false, { source: a });
	a.addMark("other", 3, false, { source: b });
	b.addMark("camp", 4, false, { source: b });
	a.clearMark("camp", false, { source: b });
	assert.equal(a.countMark("camp"), 2);
	assert.equal(a.countMark("other", { source: b }), 3);
	assert.equal(b.countMark("camp"), 4);
});

test("explicit unknown arrays and legacy numeric-to-array conversion keep array semantics", () => {
	const { player } = fixture(), p = player();
	p.markAuto("camp", "x", { source: null });
	assert.equal(p.countMark("camp", { source: null }), 1);
	p.addMark("other", 2, false, { source: "A" });
	p.markAuto("other", "y");
	assert.equal(p.countMark("other", { source: "A" }), 0);
	assert.equal(p.countMark("other", { source: null }), 1);
});

test("unknown-only clear and missing-source removal never erase known sources or emit phantom events", () => {
	const { player, events } = fixture(), p = player();
	p.addMark("camp", 2, false);
	p.addMark("camp", 3, false, { source: "A" });
	p.clearMark("camp", false, { source: null });
	assert.equal(p.countMark("camp"), 3);
	const before = events.length;
	p.removeMark("camp", 10, false, { source: "absent" });
	assert.equal(events.length, before);
	assert.equal(p.countMark("camp", { source: "A" }), 3);
});

test("finite source additions cannot overflow aggregate storage", () => {
	const { player, events } = fixture(), p = player();
	p.addMark("camp", Number.MAX_VALUE, false, { source: "A" });
	assert.throws(() => p.addMark("camp", Number.MAX_VALUE, false, { source: "B" }), { name: "RangeError" });
	assert.equal(p.countMark("camp"), Number.MAX_VALUE);
	assert.equal(p.countMark("camp", { source: "B" }), 0);
	assert.equal(events.length, 1);
});

test("legacy signed numeric operations cannot underflow zero", () => {
	const { player } = fixture(), p = player();
	p.addMark("camp", 2, false, { source: "A" });
	p.addMark("camp", -10, false);
	assert.equal(p.countMark("camp"), 0);
	assert.equal(p.countMark("camp", { source: "A" }), 0);
	p.removeMark("camp", 10, false);
	assert.equal(p.countMark("camp"), 0);
});

test("display-only markSkill keeps custom intro and card arguments without inventing a source", () => {
	const { player } = fixture(), p = player(), intro = { content: () => "custom" };
	p.storage.camp = 3;
	p.markSkill("camp", intro);
	assert.equal(p.marks.camp.info, intro);
	assert.equal(p.storage.camp, 3);
	assert.equal(p.countMark("camp", { source: "A" }), 0);
	assert.equal(p.countMark("camp", { source: null }), 3);
});

test("array lists deduplicate per source and legacy refresh does not discard another membership", () => {
	const { player } = fixture(), p = player();
	p.markAuto("camp", ["x", "x", "y"], { source: "A" });
	p.markAuto("camp", ["x", "z"], { source: "B" });
	assert.equal(p.countMark("camp"), 3);
	assert.equal(p.countMark("camp", { source: "A" }), 2);
	p.markAuto("camp");
	p.unmarkAuto("camp", ["x", "y"], { source: "A" });
	assert.equal(p.countMark("camp"), 2);
	assert.equal(p.countMark("camp", { source: "B" }), 2);
});

test("storage deletion and type replacement never resurrect old source shares", () => {
	const { player } = fixture(), p = player();
	p.addMark("camp", 2, false, { source: "A" });
	delete p.storage.camp;
	p.markAuto("camp");
	p.addMark("camp", 1, false, { source: "B" });
	assert.equal(p.countMark("camp", { source: "A" }), 0);
	assert.equal(p.countMark("camp", { source: "B" }), 1);
	p.storage.camp = ["item"];
	assert.equal(p.countMark("camp", { source: "B" }), 0);
	assert.equal(p.countMark("camp", { source: null }), 1);
});

test("source state is per bearer and does not add keys to serialized storage", () => {
	const { player } = fixture(), p = player();
	p.addMark("camp", 1, false, { source: "__proto__" });
	p.addMark("camp", 2, false, { source: "A" });
	assert.equal(p.countMark("camp", { source: "A" }), 2);
	assert.equal(p.countMark("camp", { source: "__proto__" }), 1);
	assert.deepEqual(JSON.parse(JSON.stringify(p.storage)), { camp: 3 });
	assert.equal(Object.keys(p).includes("_markSources"), false);
});

test("source addition rejects a quantity lost to floating point rounding", () => {
	const { player } = fixture(), p = player();
	p.addMark("camp", Number.MAX_VALUE, false, { source: "A" });
	assert.throws(() => p.addMark("camp", 1, false, { source: "B" }), { name: "RangeError" });
	assert.equal(p.countMark("camp", { source: "B" }), 0);
	assert.equal(p.countMark("camp"), Number.MAX_VALUE);
});

test("fractional source arithmetic never leaves a positive aggregate after all shares were consumed", () => {
	const { player } = fixture(), p = player();
	p.addMark("camp", 0.2, false, { source: "A" });
	p.addMark("camp", 0.1, false, { source: "B" });
	p.clearMark("camp", false, { source: "A" });
	p.clearMark("camp", false, { source: "B" });
	assert.equal(p.countMark("camp"), 0);
	assert.equal(p.hasMark("camp"), false);
});

test("source consumption rejects rounded-away or amplified aggregate changes atomically", () => {
	const { player, events } = fixture(), p = player(), q = player();
	p.addMark("camp", Number.MAX_VALUE, false, { source: "A" });
	const before = events.length;
	assert.throws(() => p.removeMark("camp", 1, false, { source: "A" }), { name: "RangeError" });
	assert.equal(p.countMark("camp", { source: "A" }), Number.MAX_VALUE);
	assert.equal(events.length, before);
	q.addMark("camp", 2 ** 53, false, { source: "A" });
	q.addMark("camp", 2, false, { source: "B" });
	assert.throws(() => q.removeMark("camp", 1, false, { source: "B" }), { name: "RangeError" });
	assert.equal(q.countMark("camp", { source: "B" }), 2);
	assert.equal(q.countMark("camp"), 2 ** 53 + 2);
});

test("source NaN removal uses exact membership and cannot consume another source's string", () => {
	const { player } = fixture(), p = player();
	p.markAuto("camp", "foo", { source: "A" });
	p.markAuto("camp", NaN, { source: "B" });
	p.unmarkAuto("camp", NaN, { source: "B" });
	assert.equal(p.storage.camp.length, 1);
	assert.equal(p.storage.camp[0], "foo");
	assert.equal(p.countMark("camp", { source: "A" }), 1);
	assert.equal(p.countMark("camp", { source: "B" }), 0);
});

test("legacy array removal retains real polyfill behavior while provenance follows actual remaining members", () => {
	const { player } = fixture(), p = player();
	p.markAuto("camp", "foo", { source: "A" });
	p.markAuto("camp", NaN, { source: "B" });
	p.unmarkAuto("camp", NaN);
	// Existing polyfill coerces foo to NaN and removes it. Do not change that legacy path here.
	assert.equal(p.storage.camp.length, 1);
	assert.equal(Number.isNaN(p.storage.camp[0]), true);
	assert.equal(p.countMark("camp", { source: "A" }), 0);
	assert.equal(p.countMark("camp", { source: "B" }), 1);
});

test("preexisting duplicate array entries retain their unknown multiplicity beside sourced memberships", () => {
	const { player } = fixture(), p = player();
	p.markAuto("camp", "x");
	p.storage.camp.push("x");
	p.markAuto("camp", "x", { source: "A" });
	p.unmarkAuto("camp", "x", { source: null });
	assert.equal(p.countMark("camp"), 1);
	assert.equal(p.countMark("camp", { source: null }), 1);
	assert.equal(p.countMark("camp", { source: "A" }), 1);
	p.clearMark("camp", false, { source: null });
	assert.equal(p.countMark("camp"), 1);
	p.clearMark("camp", false, { source: "A" });
	assert.equal(p.countMark("camp"), 0);
});
