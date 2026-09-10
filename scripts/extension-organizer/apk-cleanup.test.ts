import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import policy from "../../apps/core/game/apk-extension-cleanup.json";
import installed from "../../apps/core/game/organized-extensions.json";
import { sources, composeApk, appendPackage } from "../../apps/core/extension/手杀武将/apk.js";
import { registerOrganizedExtensions, isRetiredApkExtension } from "../../apps/core/noname/init/organizedExtensions.js";

async function factory(relative: string, args: any[]) {
  const code = (await fs.readFile(`apps/core/extension/手杀武将/${relative}`, "utf8"))
    .replace(/^import[^\n]*\n/gm, "").replace(/export const type[^\n]*\n/, "")
    .replace("export default function", "globalThis.factory = function");
  const context = vm.createContext({ args, console });
  new vm.Script(`${code}\nglobalThis.output = factory(...args);`).runInContext(context, { timeout: 3000 });
  return context.output;
}

test("cleanup scope covers exactly the quoted 33 entries; preserves PXLNGU and originals", () => {
  const all = [...policy.merged.map(s => s.name), ...policy.removed, ...policy.retained];
  assert.equal(all.length, 33);
  assert.equal(new Set(all).size, 33);
  for (const name of [...policy.removed, ...policy.merged.map(s => s.name)]) {
    assert.ok(isRetiredApkExtension(name));
    assert.ok(!installed.some(r => r.name === name));
  }
  for (const name of ["名将杀", "活动武将", "手杀武将", "朱绩", "笮融"]) assert.ok(!isRetiredApkExtension(name));
  assert.deepEqual(sources.slice(0, policy.merged.length).map(s => [s.name, s.key, !!s.blocked]), policy.merged.map(s => [s.name, s.key, !!s.blocked]));
  assert.deepEqual(sources.at(-1), { name: "手杀补全", key: "merged_completion" });
});

test("migration removes only retired names and preserves original enable choices and private settings", async () => {
  const state = new Map<string, any>(Object.entries({
    extensions: ["名将杀", "手杀武将", "新武将", "十周年UI", "custom"],
    organized_extensions_registered: installed.map(r => r.name).concat("新武将", "十周年UI"),
    extension_名将杀_enable: true, extension_手杀武将_enable: false,
    extension_新武将_enable: true, extension_新武将_getHongli: false,
    characters: ["standard", "mjsha", "新武将"], cards: ["standard", "mode_extension_8月武将补充"], plays: ["coin"],
  }));
  const writes: string[] = [];
  const config = { get: (k: string) => state.get(k), has: (k: string) => state.has(k) };
  const save = async (k: string, v: any) => { writes.push(k); state.set(k, v); };
  await registerOrganizedExtensions(config, save);
  assert.equal(state.get("extension_名将杀_enable"), true);
  assert.equal(state.get("extension_手杀武将_enable"), false);
  assert.equal(state.get("extension_手杀武将_apk_new"), true);
  assert.equal(state.get("extension_新武将_getHongli"), false);
  assert.deepEqual(state.get("characters"), ["standard", "mjsha"]);
  assert.deepEqual(state.get("cards"), ["standard"]);
  assert.deepEqual(state.get("plays"), []);
  assert.ok(state.get("extensions").includes("custom"));
  assert.ok(!state.get("extensions").some(isRetiredApkExtension));
  writes.length = 0;
  await registerOrganizedExtensions(config, save);
  assert.deepEqual(writes, []);
});

test("real six character sources compose without executing global core patches or blocked source", async () => {
  const marker = { preserved: true };
  const lib: any = { config: { extension_新武将_getHongli: false }, filter: { notMe() {} }, skill: { cadaozhuan: marker }, translate: {}, dynamicTranslate: {}, character: { hy_cuifu: marker }, init: { css() {} } };
  const originalPrime = () => true;
  const game: any = { isPrime: originalPrime };
  const args = [lib, game, {}, {}, {}, {}];
  const base = await factory("base.js", args);
  const originalCharacters = Object.entries(base.package.character.character);
  const loaded: string[] = [];
  const combined = await composeApk(base, args, async (name: string) => {
    loaded.push(name);
    return { default: () => factory(`apk/${name}/extension.js`, args) };
  });
  await combined.precontent({});
  await combined.content({}, combined.package);
  assert.equal(loaded.length, 6);
  assert.ok(!loaded.includes("势魏延"));
  assert.equal(lib.skill.cadaozhuan, marker);
  assert.equal(game.isPrime, originalPrime);
  assert.equal(lib.config.extension_新武将_getHongli, false);
  for (const [id, info] of originalCharacters) assert.equal(combined.package.character.character[id], info);
  assert.equal(Object.keys(combined.package.character.character).length, 68); // 12 original + 55 APK + 2 completion - 1 existing ID
  assert.ok(!("hy_cuifu" in combined.package.character.character));
  assert.equal(combined.package.character.characterPrefix, undefined);
  assert.ok(combined.package.character.translate.yin_mdtx_jiangwei_prefix);
  assert.equal(combined.package.character.characterFilter.wei_machao(), false);
  lib.skill.weijizhan = {};
  assert.equal(combined.package.character.characterFilter.wei_machao(), true);
  assert.ok(combined.package.character.character.zgt_zhugetu[4].includes("ext:手杀武将/apk/诸葛兔/image/character/zgt_zhugetu.jpg"));
  for (const character of Object.values(combined.package.character.character) as any[]) {
    for (const tag of character[4] || []) {
      if (tag.startsWith("ext:手杀武将/apk/")) await fs.access(`apps/core/extension/${tag.slice(4)}`);
    }
  }
  assert.ok(!("fixdaozhuan" in combined.config));
});

test("duplicate character, skill, card, and translation definitions never replace originals", () => {
  const old = { original: true };
  const target: any = { character: { character: { same: old }, translate: { same: "original" } }, card: { card: { same: old } }, skill: { skill: { same: old } } };
  const incoming: any = { character: { character: { same: ["male", "wei", 4, []] }, translate: { same: "new" } }, card: { card: { same: {} } }, skill: { skill: { same: { audio: 2 } } } };
  appendPackage(target, incoming, "test", "group", {});
  assert.equal(target.character.character.same, old);
  assert.equal(target.card.card.same, old);
  assert.equal(target.skill.skill.same, old);
  assert.equal(target.character.translate.same, "original");
});

test("disabled members are not imported; guarded mixed packs are harmless without their UI", async () => {
  const lib: any = { config: Object.fromEntries(sources.map(s => [`extension_手杀武将_${s.key}`, false])) };
  const base: any = { package: { character: { character: {}, translate: {} } } };
  await composeApk(base, [lib, {}], () => { throw new Error("Disabled source executed"); });
  for (const name of policy.guarded) {
    const module = await import(`../../apps/core/extension/${name}/extension.js`);
    const pack = await module.default(lib, {});
    assert.equal(pack.name, name);
    assert.equal(Object.keys(pack.package.character.character).length, 0);
    assert.ok(pack.config.compatibility);
  }
});
