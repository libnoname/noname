import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import policy from "../../apps/core/game/extension-restructure.json";
import groups from "../../apps/core/game/extension-groups.json";
import bundled from "../../apps/core/game/bundled-extensions.json";
import installed from "../../apps/core/game/organized-extensions.json";
import config from "../../apps/core/game/config.json";
import { isRetiredExtension, registerOrganizedExtensions } from "../../apps/core/noname/init/organizedExtensions.js";

const root = path.resolve("apps/core/extension");
const exists = (file: string) => fs.access(file).then(() => true, () => false);

test("restructure leaves exactly 49 active extensions after EpicFX removal", async () => {
	const directories = (await fs.readdir(root, { withFileTypes: true })).filter(entry => entry.isDirectory() && !isRetiredExtension(entry.name)).map(entry => entry.name);
	assert.equal(directories.length, 49);
	for (const name of policy.removed) {
		if (name !== "EpicFX") assert.equal(await exists(path.join(root, name)), false, name);
		assert.ok(isRetiredExtension(name), name);
	}
	for (const [oldName, newName] of Object.entries(policy.renamed)) {
		assert.equal(await exists(path.join(root, oldName)), false, oldName);
		assert.equal(await exists(path.join(root, newName)), true, newName);
		const info = JSON.parse(await fs.readFile(path.join(root, newName, "info.json"), "utf8"));
		assert.equal(info.name, newName);
	}
	assert.deepEqual(config.all.stockextension, []);
});

test("physical merge targets own every former source directory", async () => {
	for (const [target, sources] of Object.entries(policy.merged)) {
		for (const source of sources) {
			const member = target === "手杀武将" ? path.join(root, target, "apk", source) : path.join(root, target, "members", source);
			if (source === target && target === "手杀武将") continue;
			assert.equal(await exists(member), true, `${target} <- ${source}`);
			if (source !== target) assert.equal(await exists(path.join(root, source)), false, source);
		}
	}
});

test("legacy physical merge factories load all member modules", async () => {
	const lib: any = { config: {}, skill: {}, character: {}, card: {}, translate: {}, dynamicTranslate: {}, init: { css() {} }, arenaReady: [] };
	const game: any = { saveConfig() {} };
	for (const target of ["风云浮生明辉月", "觉醒突破", "清瑶葭绮"]) {
		const module = await import(`../../apps/core/extension/${target}/extension.js`);
		const extension = await module.default(lib, game, {}, {}, {}, {});
		assert.equal(extension.name, target);
		assert.ok(extension.package?.character?.character);
	}
});

test("mixed modern and legacy members are supported by the shared composer", async () => {
	const composer = await fs.readFile(path.join(root, "_merge.js"), "utf8");
	assert.match(composer, /typeof module\.default === "function"/);
	for (const source of ["杀海拾遗", "玩点论杀"]) {
		const entry = await fs.readFile(path.join(root, "群雄并起", "members", source, "extension.js"), "utf8");
		assert.match(entry, /export default extensionPackage/);
	}
});

test("registry and PXLNGU group match the physical inventory", async () => {
	assert.equal(groups[0].members.length, 35);
	for (const name of policy.pxlnguAdded) assert.ok(groups[0].members.includes(name), name);
	const directories = (await fs.readdir(root, { withFileTypes: true })).filter(entry => entry.isDirectory() && !isRetiredExtension(entry.name)).map(entry => entry.name);
	assert.deepEqual(new Set(installed.map(row => row.name)), new Set(directories.filter(name => !bundled.includes(name))));
	assert.deepEqual(installed.find(row => row.name === "蔡阳")?.characters, ["CYZi"]);
	assert.deepEqual(installed.find(row => row.name === "超神赵云")?.characters, ["超神赵云"]);
});

test("retained single-character packs and WeChat translations are exact", async () => {
	const caiyang = await fs.readFile(path.join(root, "蔡阳", "extension.js"), "utf8");
	assert.match(caiyang, /CYZi:\s*\[/);
	assert.doesNotMatch(caiyang, /RWtg|lgg|ccx/);
	const zhaoyun = await fs.readFile(path.join(root, "超神赵云", "extension.js"), "utf8");
	assert.equal((zhaoyun.match(/^"超神赵云":\s*\[/gm) || []).length, 1);
	assert.doesNotMatch(zhaoyun, /selectedId|removedCharacters|Eason\.jpg/);
	const wechat = await fs.readFile(path.join(root, "活动武将", "js/precontent/WeChatkill.js"), "utf8");
	for (const [id, name] of [["wechat_luxun", "小程序陆逊"], ["wechat_zuoci", "小程序左慈"], ["wechat_liubei", "小程序刘备"], ["wechat_huanggai", "小程序黄盖"]]) {
		assert.match(wechat, new RegExp(`${id}: [\"']${name}[\"']`));
	}
});

test("old enable switches migrate without resetting current choices", async () => {
	const values = new Map<string, any>(Object.entries({
		extensions: ["美女如云", "渐意新生", "custom"],
		organized_extensions_registered: ["美女如云", "渐意新生"],
		extension_美女如云_enable: true,
		extension_渐意新生_enable: true,
		extension_群雄并起_enable: false,
	}));
	const save = async (key: string, value: any) => { values.set(key, value); };
	await registerOrganizedExtensions({ get: key => values.get(key), has: key => values.has(key) }, save);
	assert.equal(values.get("extension_芙蕖绿波_enable"), true);
	assert.equal(values.get("extension_清瑶葭绮_enable"), true);
	assert.equal(values.get("extension_群雄并起_enable"), false);
	assert.ok((values.get("extensions") as string[]).includes("custom"));
	assert.ok(!(values.get("extensions") as string[]).some(isRetiredExtension));
});
