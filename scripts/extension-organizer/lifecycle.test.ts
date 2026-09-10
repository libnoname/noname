import test from "node:test";
import assert from "node:assert/strict";
import { createMergedExtension, normalizeCharacterMetadata } from "../../apps/core/extension/_merge.js";
import qingyao from "../../apps/core/extension/清瑶葭绮/extension.js";
import { recoveryNames, restoreExtensions, showExtensionRecovery } from "../../apps/core/noname/init/extensionRecovery.js";
import { copyCardAttributes } from "../../apps/core/extension/清瑶葭绮/members/假装无敌/CharacterCard.js";

test("a failed import, precontent or content cannot hide healthy merged characters", async () => {
	const calls: string[] = [];
	const lib: any = { config: {}, character: {}, skill: {}, translate: {} };
	const names = ["badImport", "badPre", "badContent", "healthy"];
	const extension = await createMergedExtension("test", names, [lib, {}], import.meta.url, async name => {
		if (name === "badImport") throw Error("import failed");
		return { default: () => ({
			package: { character: { character: { [name]: ["male", "wei", 4, []] } } },
			async precontent(options) {
				assert.equal(options.enable, true);
				if (name === "badPre") throw Error("init failed");
				await Promise.resolve();
				calls.push(name + " initialized");
			},
			content() {
				assert.notEqual(name, "badPre");
				if (name === "badContent") throw Error("content failed");
				assert.ok(calls.includes(name + " initialized"));
			},
		}) };
	});
	await extension.precontent();
	await assert.rejects(extension.content({}, extension.package), AggregateError);
	assert.deepEqual(Object.keys(extension.package.character.character), ["healthy"]);
});

test("real Qingyao lifecycle registers its 56 character resources without APK globals or UI patches", async () => {
	const group: any = []; group.add = name => { if (!group.includes(name)) group.push(name); };
	const lib: any = { config: {}, group, groupnature: {}, characterPack: {}, characterSort: {}, characterTitle: {}, characterFilter: {}, characterIntro: {}, skill: {}, character: {}, card: {}, translate: {}, dynamicTranslate: {}, init: { css() {} }, arenaReady: [] };
	const game: any = { saveConfig() {}, addGlobalSkill() {}, playAudio() {} };
	const previous = globalThis.window;
	globalThis.window = {} as any;
	try {
		const extension = await qingyao(lib, game, {}, {}, {}, {});
		await extension.precontent();
		await extension.content({}, extension.package);
		assert.equal(Object.keys(lib.characterPack.假装无敌Pack).length, 56);
		assert.ok(extension.package.character.character.qy_qyqingyaoxuying);
		assert.ok(extension.package.character.character.qy_qyjiaqi);
		assert.equal(Object.keys(extension.package.character.character).length, 74);
		for (const key of Object.keys(extension.package.character)) {
			assert.ok(key in lib || key === "name", `loadCharacter destination exists: ${key}`);
		}
		assert.equal(lib.qyUtils, undefined);
		assert.equal(game.documentZoom, undefined);
		assert.equal(lib.config.dev, undefined);
		assert.equal(lib.characterFilter.xxy_yinhui(), false);
		lib.skill.xxy_guima = {}; lib.skill.xxy_shenpan = {};
		assert.equal(lib.characterFilter.xxy_yinhui(), true);
	} finally { globalThis.window = previous; }
});

test("emergency recovery preserves manual disables, unknown packages and non-extension saves", async () => {
	assert.deepEqual(recoveryNames(["名将杀", "清瑶葭绮", "removed", 123]), ["名将杀", "清瑶葭绮"]);
	assert.deepEqual(recoveryNames([]), []);
	assert.ok(!recoveryNames(null).includes("戏志才"));
	const values = new Map<string, any>(Object.entries({ extensions: ["custom", "名将杀"], extension_英雄杀_enable: false, gameRecord: { wins: 12 } }));
	await restoreExtensions(["名将杀"], { get: key => values.get(key) }, async (key, value) => { values.set(key, value); });
	assert.equal(values.get("extension_名将杀_enable"), true);
	assert.equal(values.get("extension_英雄杀_enable"), false);
	assert.deepEqual(values.get("gameRecord"), { wins: 12 });
	assert.deepEqual(values.get("extensions"), ["custom", "名将杀"]);
});

test("card data adapter never copies card identity or mutates source storage", () => {
	const card = { cardid: "original", node: {}, name: "sha", storage: { value: 1 }, click() {} };
	const copy = copyCardAttributes(card, { copy: structuredClone });
	assert.equal(copy.cardid, undefined);
	assert.equal(copy.node, undefined);
	assert.equal(copy.click, undefined);
	assert.equal(copy.name, "sha");
	copy.storage.value = 2;
	assert.equal(card.storage.value, 1);
});

test("legacy prefix dictionaries migrate to engine translations without replacing existing labels", () => {
	const pack: any = { character: { characterPrefix: { one: "阴", two: "old" }, translate: { two_prefix: "existing" } } };
	normalizeCharacterMetadata(pack);
	assert.equal(pack.character.characterPrefix, undefined);
	assert.deepEqual(pack.character.translate, { one_prefix: "阴", two_prefix: "existing" });
});

test("safe-mode recovery panel works before extension registration and awaits persistence", async () => {
	const originals = { document: globalThis.document, localStorage: globalThis.localStorage, location: globalThis.location };
	const store = new Map([['test_disable_extension', 'true'], ['test_extension_emergency_enabled', '["名将杀"]']]);
	const nodes: any[] = [];
	const values = new Map<string, any>([['extensions', ['名将杀']], ['extension_名将杀_enable', false]]);
	const config = { get: key => values.get(key) };
	let reloaded = false;
	try {
		globalThis.localStorage = { getItem: key => store.get(key), removeItem: key => store.delete(key) } as any;
		globalThis.document = {
			getElementById: () => undefined,
			createElement(tag) { const node = { tag, style: {}, append() {} }; nodes.push(node); return node; },
			body: { append() {} },
		} as any;
		globalThis.location = { reload() { assert.equal(values.get('extension_名将杀_enable'), true); reloaded = true; } } as any;
		showExtensionRecovery({ configprefix: 'test_' }, config, async (key, value) => { await Promise.resolve(); values.set(key, value); });
		assert.equal(values.get('extension_名将杀_enable'), false, 'display never auto-enables anything');
		await nodes.find(node => node.tag === 'button').onclick();
		assert.equal(reloaded, true);
		assert.equal(store.has('test_disable_extension'), false);
		assert.equal(store.has('test_extension_emergency_enabled'), false);
	} finally {
		for (const [key, value] of Object.entries(originals)) {
			if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
		}
	}
});
