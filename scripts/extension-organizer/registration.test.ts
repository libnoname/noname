import test from "node:test";
import assert from "node:assert/strict";
import installed from "../../apps/core/game/organized-extensions.json";
import validation from "../../apps/core/game/organized-extension-status.json";
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

test("fresh browser registers all installed packs, disables incomplete packs", async () => {
	const f = fixture({ extensions: ["existing"] });
	await registerOrganizedExtensions(f.config, f.save);
	assert.deepEqual(f.values.get("extensions"), ["existing", ...installed.map(p => p.name)]);
	const disabled = new Set(validation.disabled.map(p => p.name));
	for (const p of installed) assert.equal(f.values.get(`extension_${p.name}_enable`), !disabled.has(p.name));
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

test("safety migration disables incomplete packs already enabled in existing saves", async () => {
	const f = fixture({ extensions: installed.map(p => p.name), organized_extensions_registered: installed.map(p => p.name) });
	for (const p of installed) f.values.set(`extension_${p.name}_enable`, true);
	await registerOrganizedExtensions(f.config, f.save);
	for (const p of validation.disabled) assert.equal(f.values.get(`extension_${p.name}_enable`), false);
	assert.equal(f.values.get("organized_extensions_validation"), validation.version);
});

test("new registration preserves previous disabled choice and does not duplicate existing name", async () => {
	const name = installed[0].name;
	const f = fixture({ extensions: [name], [`extension_${name}_enable`]: false });
	await registerOrganizedExtensions(f.config, f.save);
	assert.equal(f.values.get(`extension_${name}_enable`), false);
	assert.equal((f.values.get("extensions") as string[]).filter(n => n === name).length, 1);
});
