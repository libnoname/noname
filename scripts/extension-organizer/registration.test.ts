import test from "node:test";
import assert from "node:assert/strict";
import installed from "../../apps/core/game/organized-extensions.json";
import validation from "../../apps/core/game/organized-extension-status.json";
import bundled from "../../apps/core/game/bundled-extensions.json";
import fs from "node:fs/promises";
import { registerOrganizedExtensions } from "../../apps/core/noname/init/organizedExtensions.js";

function fixture(initial: Record<string, unknown> = {}) {
	const values = new Map(Object.entries(initial));
	const writes: string[] = [];
	return {
		values,
		writes,
		config: { get: (key: string) => values.get(key), has: (key: string) => values.has(key) },
		save: async (key: string, value: unknown) => {
			values.set(key, value);
			writes.push(key);
		},
	};
}

test("removing crossover packs preserves advanced pack IDs and unrelated saved switches", async () => {
	const f = fixture({
		characters: ["gwent", "hearth", "offline", "diy", "key", "yunchou"],
		cards: ["standard", "mtg", "gujian", "yunchou"],
		extension_杀海拾遗_gwent: true, extension_群雄并起_member_3_mtg: true,
		extension_杀海拾遗_yunchou: true, extension_名将杀_enable: false,
	});
	await registerOrganizedExtensions(f.config, f.save);
	assert.deepEqual(f.values.get("characters"), ["offline", "diy", "key", "yunchou"]);
	assert.deepEqual(f.values.get("cards"), ["standard", "yunchou"]);
	assert.equal(f.values.get("extension_杀海拾遗_gwent"), false);
	assert.equal(f.values.get("extension_群雄并起_member_3_mtg"), false);
	assert.equal(f.values.get("extension_杀海拾遗_yunchou"), true);
	assert.equal(f.values.get("extension_名将杀_enable"), false);
	f.writes.length = 0;
	await registerOrganizedExtensions(f.config, f.save);
	assert.deepEqual(f.writes, []);
});

test("fresh browser registers all installed packs, disables incomplete packs", async () => {
	const f = fixture({ extensions: ["existing"] });
	await registerOrganizedExtensions(f.config, f.save);
	assert.deepEqual(f.values.get("extensions"), ["existing", ...bundled, ...installed.map(p => p.name)]);
	for (const name of bundled) assert.equal(f.values.get(`extension_${name}_enable`), false);
	const disabled = new Set(validation.disabled.map(p => p.name));
	for (const p of installed) assert.equal(f.values.get(`extension_${p.name}_enable`), !disabled.has(p.name) && !("defaultEnabled" in p && p.defaultEnabled === false));
	assert.equal(new Set(installed.map(p => p.name)).size, installed.length);
	for (const p of validation.disabled) assert.ok(installed.some(i => i.name === p.name));
});

test("repeated startup preserves user switches and removed registrations without writes", async () => {
	const f = fixture();
	await registerOrganizedExtensions(f.config, f.save);
	const name = installed.find(p => !validation.disabled.some(d => d.name === p.name))!.name;
	f.values.set(`extension_${name}_enable`, false);
	f.values.set(`extension_${validation.disabled[0].name}_enable`, true);
	f.values.set(
		"extensions",
		(f.values.get("extensions") as string[]).filter(n => n !== name)
	);
	f.writes.length = 0;
	await registerOrganizedExtensions(f.config, f.save);
	assert.equal(f.values.get(`extension_${name}_enable`), false);
	assert.equal(f.values.get(`extension_${validation.disabled[0].name}_enable`), true);
	assert.equal((f.values.get("extensions") as string[]).includes(name), false);
	assert.deepEqual(f.writes, []);
});

test("validation version changes never reset existing extension switches", async () => {
	for (const version of [undefined, 2, 3, validation.version + 1]) {
		const names = [...bundled, ...installed.map(p => p.name)];
		const f = fixture({ extensions: names, organized_extensions_registered: names, organized_extensions_validation: version });
		for (const [i, name] of names.entries()) f.values.set(`extension_${name}_enable`, i % 2 === 0);
		await registerOrganizedExtensions(f.config, f.save);
		for (const [i, name] of names.entries()) assert.equal(f.values.get(`extension_${name}_enable`), i % 2 === 0);
		assert.ok(!f.writes.some(key => key.endsWith("_enable")));
		assert.equal(f.values.get("organized_extensions_validation"), validation.version);
	}
});

test("new registration preserves previous disabled choice and does not duplicate existing name", async () => {
	const name = installed[0].name;
	const f = fixture({ extensions: [name], [`extension_${name}_enable`]: false });
	await registerOrganizedExtensions(f.config, f.save);
	assert.equal(f.values.get(`extension_${name}_enable`), false);
	assert.equal((f.values.get("extensions") as string[]).filter(n => n === name).length, 1);
});

test("APK upgrade restores omitted original registrations while preserving settings and order", async () => {
	const previous = ["custom", "活动武将", installed[0].name];
	const f = fixture({
		extensions: previous,
		organized_extensions_registered: installed.map(p => p.name),
		organized_extensions_validation: 2,
		extension_名将杀_enable: true,
		extension_活动武将_enable: false,
		extension_名将杀_customOption: "preserved",
		characters: ["standard", "mjsha"],
	});
	await registerOrganizedExtensions(f.config, f.save);
	const extensions = f.values.get("extensions") as string[];
	assert.deepEqual(extensions.slice(0, previous.length), previous);
	for (const name of bundled) assert.equal(extensions.filter(n => n === name).length, 1);
	assert.equal(f.values.get("extension_名将杀_enable"), true);
	assert.equal(f.values.get("extension_活动武将_enable"), false);
	assert.equal(f.values.get("extension_名将杀_customOption"), "preserved");
	assert.deepEqual(f.values.get("characters"), ["standard", "mjsha"]);
	assert.ok(!f.writes.includes("extension_名将杀_enable"));
	assert.ok(!f.writes.includes("extension_活动武将_enable"));
	f.writes.length = 0;
	await registerOrganizedExtensions(f.config, f.save);
	assert.deepEqual(f.writes, []);
});

test("incremental registration preserves enabled choices even for newly safety-listed packs", async () => {
	const f = fixture({ extensions: ["名将杀"] });
	for (const p of validation.disabled) f.values.set(`extension_${p.name}_enable`, true);
	await registerOrganizedExtensions(f.config, f.save);
	for (const p of validation.disabled) assert.equal(f.values.get(`extension_${p.name}_enable`), true);
});

test("original extension manifest includes 名将杀 and 活动武将 and resolves real ESM entries", async () => {
	assert.ok(bundled.includes("名将杀"));
	assert.ok(bundled.includes("活动武将"));
	const names = [...bundled, ...installed.map(p => p.name)];
	assert.equal(new Set(names).size, names.length);
	for (const name of bundled) {
		const root = new URL(`../../apps/core/extension/${name}/`, import.meta.url);
		const info = JSON.parse(await fs.readFile(new URL("info.json", root), "utf8"));
		assert.equal(info.name, name);
		const source = await fs.readFile(new URL("extension.js", root), "utf8");
		assert.match(source, /export\s+(?:let|const|var)\s+type\s*=\s*["']extension["']/);
		assert.match(source, /export\s+default\b/);
	}
});
