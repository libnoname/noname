import assert from "node:assert/strict";
import test from "node:test";
import { createOwnedMarkMethods } from "../apps/core/noname/game/ownedMarks.js";
import { OwnedMarkStore } from "../apps/core/noname/library/element/ownedMarkStore.js";

function fixture({ online = false, video = false, saved = new Map() } = {}) {
	let sequence = 0;
	const packets = [], videos = [], skills = {}, layouts = [];
	const game = { online, players: [], dead: [], save(key, value) { saved.set(key, JSON.parse(JSON.stringify(value))); }, broadcast(fn, payload) { packets.push({ fn, payload: structuredClone(payload) }); }, addVideo(type, player, payload) { videos.push({ type, payload: structuredClone(payload) }); } };
	Object.assign(game, createOwnedMarkMethods({ OwnedMarkStore, getId: () => String(++sequence), isVideo: () => video, getSkill: name => skills[name] || ({ intro: { content: "mark" } }), readSavedState: key => saved.get(key), updateMarkLayout: player => layouts.push(Object.keys(player.marks)) }));
	function player(id, position) {
		const value = { playerid: id, dataset: { position: String(position) }, storage: {}, marks: {}, updateMarks() {}, mark(name, info) { return { name, info, delete() { this.deleted = true; } }; } };
		game.players.push(value);
		return value;
	}
	return { game, player, packets, videos, skills, layouts };
}

test("one ledger transaction projects totals and emits one complete network and replay state", () => {
	const { game, player, packets, videos } = fixture();
	const bearer = player("b", 0), owner = player("o", 1);
	const b = game.getOwnedMarkIdentity(bearer), o = game.getOwnedMarkIdentity(owner);
	game.getOwnedMarkStore().grant({ name: "debt", bearer: b, owner: o, creator: o, beneficiary: o, count: 2 });
	assert.equal(bearer.storage.debt, 2);
	assert.ok(bearer.marks.debt);
	assert.equal(packets.length, 1);
	assert.equal(videos.length, 1);
	assert.equal(videos[0].type, "ownedMarks");
	assert.equal(JSON.parse(packets[0].payload).ledger.buckets[0].effects[0].owner, o);
	game.getOwnedMarkStore().clear({ bearer: b });
	assert.equal(bearer.storage.debt, 0);
	assert.equal(bearer.marks.debt, undefined);
});

test("network import matches explicit player IDs despite changed positions and stays silent", () => {
	const host = fixture();
	const target = host.player("b", 0), owner = host.player("o", 1);
	const id = host.game.getOwnedMarkIdentity(target), ownerId = host.game.getOwnedMarkIdentity(owner);
	host.game.getOwnedMarkStore().grant({ name: "debt", bearer: id, owner: ownerId, creator: ownerId, beneficiary: ownerId, count: 3 });
	const client = fixture({ online: true });
	const localOwner = client.player("o", 0), localTarget = client.player("b", 1);
	assert.equal(client.game.importOwnedMarkState(host.game.exportOwnedMarkState()), true);
	assert.equal(localTarget.storage.debt, 3);
	assert.equal(localOwner.storage.debt, undefined);
	assert.equal(client.game.resolveOwnedMarkPlayer(ownerId), localOwner);
	assert.equal(client.packets.length, 0);
	assert.equal(client.videos.length, 0);
});

test("replay import restores identities by recorded position without original player IDs", () => {
	const host = fixture();
	const target = host.player("original", 2);
	const id = host.game.getOwnedMarkIdentity(target);
	host.game.getOwnedMarkStore().grant({ name: "debt", bearer: id, owner: id, creator: id, beneficiary: id, count: 4 });
	const replay = fixture({ video: true });
	const local = replay.player(undefined, 2);
	assert.equal(replay.game.importOwnedMarkState(host.game.exportOwnedMarkState(), { replay: true }), true);
	assert.equal(replay.game.resolveOwnedMarkPlayer(id), local);
	assert.equal(local.storage.debt, 4);
	assert.equal(replay.videos.length, 0);
});

test("stale snapshots cannot rewind totals or rewrite role identities", () => {
	const host = fixture();
	const target = host.player("b", 0);
	const id = host.game.getOwnedMarkIdentity(target), store = host.game.getOwnedMarkStore();
	store.grant({ name: "debt", bearer: id, owner: id, creator: id, beneficiary: id, count: 1 });
	const older = host.game.exportOwnedMarkState();
	store.grant({ name: "debt", bearer: id, owner: id, creator: id, beneficiary: id, count: 2 });
	assert.equal(host.game.importOwnedMarkState(older), false);
	assert.equal(target.storage.debt, 3);
});

test("force import clears removed buckets without mark gain or removal events", () => {
	const source = fixture(), destination = fixture();
	const p = source.player("b", 0), q = destination.player("b", 0);
	const id = source.game.getOwnedMarkIdentity(p);
	source.game.getOwnedMarkStore().grant({ name: "debt", bearer: id, owner: id, creator: id, beneficiary: id, count: 5 });
	destination.game.importOwnedMarkState(source.game.exportOwnedMarkState());
	const empty = source.game.exportOwnedMarkState();
	empty.ledger.revision += 1;
	empty.ledger.buckets = [];
	destination.game.importOwnedMarkState(empty, { force: true });
	assert.equal(q.storage.debt, 0);
	assert.equal(q.marks.debt, undefined);
	assert.equal(destination.videos.length, 0);
});

test("reset starts a distinct session and discards identities from the old game", () => {
	const { game, player } = fixture();
	const target = player("b", 0);
	const old = game.getOwnedMarkIdentity(target);
	game.resetOwnedMarks();
	assert.notEqual(game.getOwnedMarkIdentity(target), old);
});

test("JSON save roundtrip restores full provenance and remaining count", () => {
	const a = fixture(), b = fixture();
	const p = a.player("b", 0), q = b.player("b", 0);
	const id = a.game.getOwnedMarkIdentity(p);
	a.game.getOwnedMarkStore().grant({ name: "debt", bearer: id, owner: id, creator: id, beneficiary: id, count: 2, params: { rounds: 3 } });
	const data = JSON.parse(JSON.stringify(a.game.exportOwnedMarkState()));
	b.game.importOwnedMarkState(data, { force: true });
	assert.equal(q.storage.debt, 2);
	assert.deepEqual(b.game.getOwnedMarkStore().list({ bearer: id })[0].params, { rounds: 3 });
});

test("forced session replacement clears projections bound to the previous identity", () => {
	const { game, player } = fixture();
	const target = player("b", 0), id = game.getOwnedMarkIdentity(target);
	game.getOwnedMarkStore().grant({ name: "oldDebt", bearer: id, owner: id, count: 2 });
	const replacement = { ledger: { version: 1, sessionId: "replacement", revision: 1, sequence: 0, buckets: [] }, players: [{ id: "replacement:p:1", playerid: "b", position: "0" }] };
	game.importOwnedMarkState(replacement, { force: true });
	assert.equal(target.storage.oldDebt, 0);
	assert.equal(target.marks.oldDebt, undefined);
	assert.equal(game.resolveOwnedMarkPlayer("replacement:p:1"), target);
});

test("effect hooks observe committed projection and distinguish live changes from restore", () => {
	const host = fixture(), client = fixture(), calls = [];
	const target = host.player("b", 0), restored = client.player("b", 0);
	const id = host.game.getOwnedMarkIdentity(target);
	host.skills.provider = { onOwnedMarkChange(record, previous, context) { calls.push({ count: record?.count ?? 0, previous: previous?.count ?? 0, restoring: context.restoring, total: target.storage.debt }); } };
	client.skills.provider = { onOwnedMarkChange(record, previous, context) { calls.push({ count: record?.count ?? 0, previous: previous?.count ?? 0, restoring: context.restoring, total: restored.storage.debt }); } };
	host.game.getOwnedMarkStore().grant({ name: "debt", bearer: id, owner: id, count: 2, sourceSkill: "provider" });
	client.game.importOwnedMarkState(host.game.exportOwnedMarkState());
	host.game.getOwnedMarkStore().clear({ bearer: id });
	assert.deepEqual(calls, [
		{ count: 2, previous: 0, restoring: false, total: 2 },
		{ count: 2, previous: 0, restoring: true, total: 2 },
		{ count: 0, previous: 2, restoring: false, total: 0 },
	]);
});

test("effect hooks can consume a committed effect without publishing its stale revision", () => {
	const host = fixture();
	const target = host.player("b", 0), id = host.game.getOwnedMarkIdentity(target);
	host.skills.provider = { onOwnedMarkChange(record) { if (record) host.game.getOwnedMarkStore().clear({ effectId: record.id }); } };
	host.game.getOwnedMarkStore().grant({ name: "debt", bearer: id, owner: id, count: 1, sourceSkill: "provider" });
	assert.equal(target.storage.debt, 0);
	assert.equal(host.packets.length, 1);
	assert.equal(JSON.parse(host.packets[0].payload).ledger.revision, 2);
	assert.equal(host.game.getOwnedMarkStore().list().length, 0);
});

test("permanently removed players remain resolvable until the session resets", () => {
	const { game, player } = fixture();
	const target = player("b", 0), id = game.getOwnedMarkIdentity(target);
	game.players.length = 0;
	assert.equal(game.resolveOwnedMarkPlayer(id), target);
	game.resetOwnedMarks();
	assert.equal(game.resolveOwnedMarkPlayer(id), undefined);
});

test("mode persistence restores by saved position after offline player IDs regenerate", () => {
	const saved = new Map(), first = fixture({ saved });
	const p = first.player("old-id", 0), id = first.game.getOwnedMarkIdentity(p);
	first.game.getOwnedMarkStore().grant({ name: "debt", bearer: id, owner: id, count: 2 });
	first.game.saveOwnedMarkState("slot");
	const second = fixture({ saved }), q = second.player("new-id", 0);
	assert.equal(second.game.loadOwnedMarkState("slot"), true);
	assert.equal(q.storage.debt, 2);
	assert.equal(second.game.getOwnedMarkStore().list()[0].owner, id);
	assert.equal(second.packets.length, 0);
});

test("invalid identity metadata rejects before mutating an existing ledger", () => {
	const { game, player } = fixture();
	const target = player("b", 0), id = game.getOwnedMarkIdentity(target);
	game.getOwnedMarkStore().grant({ name: "debt", bearer: id, owner: id, count: 1 });
	const invalid = game.exportOwnedMarkState();
	invalid.ledger.revision = 2;
	invalid.players[0].id = "";
	assert.throws(() => game.importOwnedMarkState(invalid), TypeError);
	assert.equal(game.getOwnedMarkStore().snapshot().revision, 1);
	assert.equal(target.storage.debt, 1);
});

test("a client's empty lazy session yields to its first authoritative snapshot", () => {
	const host = fixture(), client = fixture({ online: true });
	const p = host.player("b", 0), q = client.player("b", 0), id = host.game.getOwnedMarkIdentity(p);
	client.game.getOwnedMarkIdentity(q);
	client.game.resetOwnedMarks();
	client.game.getOwnedMarkIdentity(q);
	host.game.getOwnedMarkStore().grant({ name: "debt", bearer: id, owner: id, count: 2 });
	assert.equal(client.game.importOwnedMarkState(host.game.exportOwnedMarkState()), true);
	assert.equal(q.storage.debt, 2);
});

test("an empty authoritative snapshot binds identities once and rejects a duplicate", () => {
	const host = fixture(), client = fixture({ online: true });
	const p = host.player("b", 0), q = client.player("b", 0);
	const id = host.game.getOwnedMarkIdentity(p), state = host.game.exportOwnedMarkState();
	assert.equal(client.game.importOwnedMarkState(state), true);
	assert.equal(client.game.resolveOwnedMarkPlayer(id), q);
	assert.equal(client.game.importOwnedMarkState(state), false);
});

test("refresh rebuilds projection and relation hooks after ordinary skill state replacement", () => {
	const { game, player, skills, packets, videos } = fixture();
	const target = player("b", 0), id = game.getOwnedMarkIdentity(target);
	const restored = [];
	skills.provider = { onOwnedMarkChange(record, _before, context) { if (record) restored.push(context.restoring); } };
	game.getOwnedMarkStore().grant({ name: "debt", bearer: id, owner: id, count: 3, sourceSkill: "provider" });
	target.storage = {};
	target.marks = {};
	game.refreshOwnedMarks();
	assert.equal(target.storage.debt, 3);
	assert.ok(target.marks.debt);
	assert.deepEqual(restored, [false, true]);
	assert.equal(packets.length, 1);
	assert.equal(videos.length, 1);
});

test("missing bearer identity binding rejects atomically instead of committing invisible totals", () => {
	const host = fixture(), client = fixture();
	const p = host.player("b", 0), id = host.game.getOwnedMarkIdentity(p);
	host.game.getOwnedMarkStore().grant({ name: "debt", bearer: id, owner: id, count: 2 });
	client.player("unrelated", 0);
	assert.throws(() => client.game.importOwnedMarkState(host.game.exportOwnedMarkState()), /identity|player|binding/i);
	assert.equal(client.game.getOwnedMarkStore().list().length, 0);
});

test("retained removed owners export detached identities and never bind a reused replay position", () => {
	const host = fixture(), replay = fixture({ video: true });
	const bearer = host.player("b", 0), owner = host.player("o", 1);
	const b = host.game.getOwnedMarkIdentity(bearer), o = host.game.getOwnedMarkIdentity(owner);
	host.game.getOwnedMarkStore().grant({ name: "debt", bearer: b, owner: o, count: 2 });
	host.game.players.splice(1, 1);
	const state = host.game.exportOwnedMarkState();
	assert.deepEqual(state.players.find(identity => identity.id === o), { id: o, playerid: "o", position: null, detached: true });
	const restored = replay.player(undefined, 0), reused = replay.player(undefined, 1);
	replay.game.importOwnedMarkState(state, { replay: true });
	assert.equal(restored.storage.debt, 2);
	assert.equal(reused._ownedMarkIdentity, undefined);
	assert.equal(replay.game.resolveOwnedMarkPlayer(o), undefined);
});

test("unknown explicit owner strings survive JSON persistence as detached provenance", () => {
	const host = fixture(), restored = fixture();
	const p = host.player("b", 0), id = host.game.getOwnedMarkIdentity(p);
	host.game.getOwnedMarkStore().grant({ name: "debt", bearer: id, owner: "external-source", count: 1 });
	const state = JSON.parse(JSON.stringify(host.game.exportOwnedMarkState()));
	assert.equal(state.players.find(identity => identity.id === "external-source")?.detached, true);
	const q = restored.player("b", 0);
	restored.game.importOwnedMarkState(state);
	assert.equal(q.storage.debt, 1);
	assert.equal(restored.game.getOwnedMarkStore().list()[0].owner, "external-source");
});

test("an obsolete packet referencing an already removed player is ignored before rebinding", () => {
	const { game, player } = fixture();
	const bearer = player("b", 0), owner = player("o", 1);
	const b = game.getOwnedMarkIdentity(bearer), o = game.getOwnedMarkIdentity(owner);
	game.getOwnedMarkStore().grant({ name: "debt", bearer: b, owner: o, count: 1 });
	const obsolete = game.exportOwnedMarkState();
	game.getOwnedMarkStore().clear({ bearer: b });
	game.players.splice(1, 1);
	assert.equal(game.importOwnedMarkState(obsolete), false);
	assert.equal(bearer.storage.debt, 0);
});

test("removing one displayed mark reflows the remaining mark layout", () => {
	const { game, player, layouts } = fixture();
	const target = player("b", 0), id = game.getOwnedMarkIdentity(target);
	game.getOwnedMarkStore().grant({ name: "first", bearer: id, owner: id, count: 1 });
	game.getOwnedMarkStore().grant({ name: "second", bearer: id, owner: id, count: 1 });
	game.getOwnedMarkStore().clear({ bearer: id, name: "first" });
	assert.deepEqual(layouts.at(-1), ["second"]);
});
