import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import groups from "../../apps/core/game/extension-groups.json";
import installed from "../../apps/core/game/organized-extensions.json";
import characterGroups from "../../apps/core/game/character-menu-groups.json";
import { groupExtensionMenus, characterMenuOwner, mergedMenuSections } from "../../apps/core/noname/ui/create/menu/extensionGroups.js";

test("PXLNGU collects reviewed standalone character packs without losing any menu entry", () => {
	const modes = installed.map(pack => `extension_${pack.name}`);
	const original = [...modes];
	const result = groupExtensionMenus(modes);
	const pxlngu = result.find(entry => typeof entry !== "string" && entry.name === "PXLNGU");
	assert.ok(pxlngu && typeof pxlngu !== "string");
	assert.equal(pxlngu.members.length, 35);
	const flattened = result.flatMap(entry => typeof entry === "string" ? [entry] : entry.members);
	assert.deepEqual([...flattened].sort(), [...modes].sort());
	assert.equal(new Set(flattened).size, modes.length);
	assert.deepEqual(modes, original);
	assert.equal(result.length, modes.length - 34);
});

test("major packs and consolidated packages stay independent", () => {
	const untouched = ["名将杀", "活动武将", "风云浮生明辉月", "觉醒突破", "清瑶葭绮", "群雄并起"].map(name => `extension_${name}`);
	assert.deepEqual(groupExtensionMenus(untouched), untouched);
	const result = groupExtensionMenus([...untouched, "extension_笮融", "extension_朱绩"]);
	assert.deepEqual(result.slice(0, untouched.length), untouched);
	assert.deepEqual(result.at(-1), { name: "PXLNGU", members: ["extension_笮融", "extension_朱绩"] });
});

test("partial installs, removed or hidden members are not resurrected", () => {
	assert.deepEqual(groupExtensionMenus([]), []);
	assert.deepEqual(groupExtensionMenus(["coin", "extension_custom"]), ["coin", "extension_custom"]);
	assert.deepEqual(groupExtensionMenus(["extension_界周妃"]), [{ name: "PXLNGU", members: ["extension_界周妃"] }]);
});

test("custom top-level and member sort order are preserved", () => {
	assert.deepEqual(groupExtensionMenus(["coin", "extension_朱绩", "extension_名将杀", "extension_笮融", "extension_界周妃", "extension_指示线"]), [
		"coin",
		{ name: "PXLNGU", members: ["extension_朱绩", "extension_笮融", "extension_界周妃"] },
		"extension_名将杀",
		"extension_指示线",
	]);
});

test("a real extension named PXLNGU is never shadowed by the management group", () => {
	const modes = ["extension_朱绩", "extension_PXLNGU", "extension_笮融"];
	assert.deepEqual(groupExtensionMenus(modes), modes);
});

test("each PXLNGU member exists and removed EpicFX is absent from registration", async () => {
	assert.equal(groups.length, 1);
	assert.equal(groups[0].name, "PXLNGU");
	const members = groups[0].members;
	assert.equal(new Set(members).size, members.length);
	assert.ok(!members.includes("EpicFX"));
	assert.ok(!installed.some(pack => pack.name === "EpicFX"));
	assert.deepEqual(groupExtensionMenus(["extension_EpicFX", "extension_名将杀"]), ["extension_名将杀"]);
	for (const name of members) {
		assert.ok(installed.some(pack => pack.name === name), name);
		const source = await fs.readFile(new URL(`../../apps/core/extension/${name}/extension.js`, import.meta.url), "utf8");
		assert.match(source, /export\s+const\s+type\s*=\s*["']extension["']/);
	}
});

test("startup, post-game rebuild and late arrivals share one character owner map", () => {
	for (let rebuild = 0; rebuild < 3; rebuild++) {
		for (const name of groups[0].members) {
			assert.equal(characterMenuOwner(name), "PXLNGU");
			assert.equal(characterMenuOwner(`mode_extension_${name}`), "PXLNGU");
		}
		assert.equal(characterMenuOwner("wandian"), "群雄并起");
		assert.equal(characterMenuOwner("清瑶葭绮"), "清瑶葭绮");
		assert.equal(characterMenuOwner("standard"), "基础");
	}
});

test("every consolidated pack exposes stable member config sections without importing code", () => {
	assert.equal(mergedMenuSections("清瑶葭绮").length, 4);
	assert.equal(mergedMenuSections("风云浮生明辉月").length, 4);
	assert.equal(mergedMenuSections("觉醒突破").length, 2);
	assert.equal(mergedMenuSections("群雄并起").length, 7);
	assert.equal(mergedMenuSections("手杀武将").length, 8);
	assert.deepEqual(mergedMenuSections("名将杀"), []);
	assert.equal(mergedMenuSections("手杀武将").find(member => member.name === "新武将")?.keys[0], "apk_new");
});

test("advanced group keeps all eleven original IDs and labels without changing gameplay modules", async () => {
	const group = characterGroups.groups[0];
	assert.equal(group.name, "进阶");
	assert.equal(new Set(group.members).size, 11);
	for (const name of group.members) {
		assert.equal(characterMenuOwner(name), "进阶");
		await fs.access(`apps/core/character/${name}`);
	}
	const labels = await fs.readFile("apps/core/game/package.js", "utf8");
	assert.match(labels, /diy: "设计比赛20"/);
	assert.match(labels, /key: "二次元"/);
	assert.equal(characterMenuOwner("key"), undefined);
});

test("retired crossover packs have no load entry or switches; independent packs remain", async () => {
	const base = "apps/core/extension/群雄并起/members/杀海拾遗/main/";
	const source = await fs.readFile(base + "precontent.js", "utf8");
	const config = await fs.readFile(base + "config.js", "utf8");
	for (const id of characterGroups.removed) {
		assert.doesNotMatch(source, new RegExp(`\\b${id}\\b`));
		assert.doesNotMatch(config, new RegExp(`\\b${id}\\b`));
	}
	for (const id of ["yunchou", "wuxing", "zhenfa"]) assert.match(source, new RegExp(`loadPack\\("${id}"`));
});

test("consolidated package credits display PXLNGU", async () => {
	assert.equal(characterGroups.author, "PXLNGU");
	for (const name of ["风云浮生明辉月", "觉醒突破", "清瑶葭绮", "群雄并起"]) {
		const info = JSON.parse(await fs.readFile(`apps/core/extension/${name}/info.json`, "utf8"));
		assert.equal(info.author, "PXLNGU");
	}
	assert.match(await fs.readFile("apps/core/extension/手杀武将/extension.js", "utf8"), /pack\.package\.author = "PXLNGU"/);
});
