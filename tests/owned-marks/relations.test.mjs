// Actual skill literals + production Player methods/store; no browser/event queue simulation.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fixture as playerFixture } from "./player-fixture.mjs";

function skill(file, name, dependencies) {
	const source = readFileSync(new URL(`../../apps/core/character/${file}/skill.js`, import.meta.url), "utf8");
	const start = source.indexOf(`\t${name}: {`) + name.length + 3;
	assert.ok(start > name.length + 3);
	const end = source.indexOf("\n\t},", start) + 3;
	return Function("lib", "game", "get", "ui", "_status", `return (${source.slice(start, end)})`)(dependencies.lib, dependencies.game, dependencies.get, {}, {});
}

function fixture() {
	const { game, lib, ledger: store, player: corePlayer } = playerFixture();
	Object.assign(game, {
		dead: [],
		filterPlayer(fn) { return this.players.filter(fn); },
		countPlayer(fn) { return this.players.filter(fn).length; },
		countPlayer2(fn) { return [...this.players, ...this.dead].filter(fn).length; },
		loseAsync() { return { setContent: async () => {} }; },
		broadcastAll(fn, ...args) { fn(...args); }, log() {},
	});
	Object.assign(lib, { suit: ["spade", "heart", "club", "diamond"], filter: { notMe: () => true } });
	const get = { suit: card => card.suit, type2: card => typeof card === "string" ? (card === "sha" ? "basic" : "trick") : card.type ?? "basic", type: name => name === "sha" ? "basic" : "trick", cardPile2: () => null, translation: value => typeof value === "string" ? value : value?.playerid, info: name => lib.skill[name] };
	function player(id, hp = 4) {
		const p = corePlayer(id);
		Object.assign(p, {
			playerid: id, hp, storage: {}, skills: [], hand: [], drawn: 0, marks: {}, chat() {},
			isIn: () => !game.dead.includes(p), getSkills() { return [...this.skills]; },
			hasSkill(name) { return this.skills.includes(name); }, addSkill(name) { if (!this.skills.includes(name)) this.skills.push(name); },
			removeSkill(name) { this.skills = this.skills.filter(s => s !== name); delete this.storage[name]; },
			addTempSkill(name) { this.addSkill(name); }, markSkill() {}, popup() {}, awakenSkill() {}, showCards: async () => {},
			getStorage(name) { return this.storage[name] ?? []; }, setStorage(name, value) { this.storage[name] = value; },
			markAuto(name, values) { const list = this.storage[name] ??= []; for (const value of [].concat(values)) if (!list.includes(value)) list.push(value); },
			getCards: () => [], canEquip: () => false, draw: async function (n = 1) { this.drawn += n; },
			chooseControl() { return { set() { return this; }, forResult: async () => ({ control: "heart" }) }; },
		});
		return p;
	}
	const dependencies = { game, lib, get };
	const jiejian = skill("mobile", "mbjiejian", dependencies), yanyu = skill("newjiang", "yj_yanyu", dependencies), yichong = skill("mobile", "yichong", dependencies);
	Object.assign(lib.skill, { mbjiejian: jiejian, yj_yanyu: yanyu, yichong });
	// The original skill uses the engine's nonstandard Array.add utility.
	if (!Array.prototype.add) Object.defineProperty(Array.prototype, "add", { configurable: true, value(value) { if (!this.includes(value)) this.push(value); return this; } });
	return { game, lib, get, store, player, jiejian, yanyu, yichong };
}

test("节谏 retains each giver's hp threshold and each giver consumes only its relation", async () => {
	const { player, game, jiejian } = fixture();
	const a = player("A"), b = player("B", 4), c = player("C");
	await jiejian.content({ cost_data: [[b, []]], targets: [b] }, {}, a);
	b.hp = 2;
	await jiejian.content({ cost_data: [[b, []]], targets: [b] }, {}, c);
	assert.deepEqual(b.getOwnedMarks("mbjiejian_mark").map(r => [game.resolveOwnedMarkPlayer(r.owner).playerid, r.params.hpAtGrant]), [["A", 4], ["C", 2]]);
	b.hp = 3;
	await jiejian.subSkill.remove.content({}, { player: b }, a);
	await jiejian.subSkill.remove.content({}, { player: b }, c);
	assert.equal(a.drawn, 0); assert.equal(c.drawn, 2);
	assert.equal(b.countOwnedMark("mbjiejian_mark"), 0);
});

test("节谏 repeated gifts from the same source refresh one threshold rather than inflate totals", async () => {
	const { player, jiejian } = fixture(); const a = player("A"), b = player("B", 4);
	await jiejian.content({ cost_data: [[b, []]], targets: [b] }, {}, a);
	b.hp = 2; await jiejian.content({ cost_data: [[b, []]], targets: [b] }, {}, a);
	assert.equal(b.countOwnedMark("mbjiejian_mark", a), 1);
	assert.equal(b.getOwnedMarks("mbjiejian_mark", a)[0].params.hpAtGrant, 2);
});

test("节谏 anonymous legacy totals cannot reward an unrelated owner", () => {
	const { player, jiejian } = fixture(); const a = player("A"), b = player("B");
	b.addMark("mbjiejian_mark", 4);
	assert.equal(jiejian.subSkill.remove.filter({ player: b }, a), false);
});

test("节谏 commits consumption before draw can reenter the same trigger", async () => {
	const { player, jiejian } = fixture(); const a = player("A"), b = player("B");
	await jiejian.content({ cost_data: [[b, []]], targets: [b] }, {}, a);
	assert.equal(b.countOwnedMark("mbjiejian_mark", a), 1);
	a.draw = async function (n) { this.drawn += n; assert.equal(jiejian.subSkill.remove.filter({ player: b }, a), false); };
	await jiejian.subSkill.remove.content({}, { player: b }, a);
	assert.equal(a.drawn, 2);
});

test("焰狱 converts the suit union but rewards only the source that configured the used suit", async () => {
	const { player, game, yanyu } = fixture(); const a = player("A"), b = player("B"), c = player("C"), d = player("D");
	await yanyu.content({ name: "yj_yanyu", cards: [{ suit: "heart" }, { suit: "diamond" }], targets: [d] }, {}, a);
	await yanyu.content({ name: "yj_yanyu", cards: [{ suit: "club" }, { suit: "spade" }], targets: [d] }, {}, c);
	const trigger = { player: b, cards: [{ suit: "club" }], card: { name: "sha" } };
	assert.equal(yanyu.subSkill.use.filter(trigger, a), false);
	assert.equal(yanyu.subSkill.use.filter(trigger, c), true);
	assert.equal(yanyu.subSkill.fire.mod.cardname({ suit: "heart" }, b, "sha"), "sha");
	assert.equal(yanyu.subSkill.fire.mod.cardname({ suit: "club" }, b, "sha"), "sha");
	assert.deepEqual(b.getOwnedMarks("yj_yanyu_effect").map(r => [game.resolveOwnedMarkPlayer(r.owner).playerid, r.params.suits]), [["A", ["heart", "diamond"]], ["C", ["club", "spade"]]]);
});

test("焰狱 permanent conversions survive owner death/skill loss while absent owner cannot draw", async () => {
	const { player, game, store, yanyu } = fixture(); const a = player("A"), b = player("B"), d = player("D");
	await yanyu.content({ name: "yj_yanyu", cards: [{ suit: "heart" }, { suit: "diamond" }], targets: [d] }, {}, a);
	store.lifecycle(game.getOwnedMarkIdentity(a), "removeSkill", "yj_yanyu"); store.lifecycle(game.getOwnedMarkIdentity(a), "death");
	game.players = game.players.filter(p => p !== a); game.dead.push(a);
	assert.equal(b.countOwnedMark("yj_yanyu_effect", a), 1);
	assert.equal(yanyu.subSkill.fire.mod.cardname({ suit: "heart" }, b, "sha"), "sha");
	assert.equal(yanyu.subSkill.use.filter({ player: b, cards: [{ suit: "heart" }], card: { name: "sha" } }, a), false);
});

test("焰狱 anonymous old suit arrays retain conversion without guessing reward ownership", () => {
	const { player, yanyu } = fixture(); const a = player("A"), b = player("B");
	b.storage.yj_yanyu_fire = ["heart"];
	b.storage.yj_yanyu_source = [a];
	assert.equal(yanyu.subSkill.fire.mod.cardname({ suit: "heart" }, b, "wuzhong"), "huogong");
	assert.equal(yanyu.subSkill.use.filter({ player: b, cards: [{ suit: "heart" }], card: { name: "huogong" } }, a), false);
	assert.equal(b.countOwnedMark("yj_yanyu_effect"), 0);
});

test("易宠 activation clears the entire dynamic 雀 family including dead/out players without removing helpers", async () => {
	const { player, lib, game, yichong } = fixture();
	const a = player("A"), b = player("B"), c = player("C"), d = player("D"), dead = player("dead");
	for (const id of ["yichong_A", "yichong_C"]) yichong.initSkill(id);
	b.addSkill("yichong_A"); dead.addSkill("yichong_A"); b.addSkill("yichong_gain"); b.addSkill("unrelated");
	lib.skill.yichong_gain = yichong.subSkill.gain;
	game.players = game.players.filter(p => p !== dead); game.dead.push(dead);
	await yichong.content({ targets: [d] }, {}, c);
	assert.equal(b.hasSkill("yichong_A"), false); assert.equal(dead.hasSkill("yichong_A"), false);
	assert.equal(d.hasSkill("yichong_C"), true); assert.equal(b.hasSkill("yichong_gain"), true); assert.equal(b.hasSkill("unrelated"), true);
});
