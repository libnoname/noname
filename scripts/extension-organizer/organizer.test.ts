import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createWriteStream, renameSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import vm from "node:vm";
import { pipeline } from "node:stream/promises";
import yazl from "yazl";
import { analyze, removeCharacters } from "./analyze.js";
import { Archive, hashFile, safePath, within } from "./archive.js";
import { organize } from "./index.js";

function source(name: string, ids: string[], content = "", extraSkill = "") {
	const characters = Object.fromEntries(ids.map(id => [id, ["male", "wei", 4, ["shared"]]]));
	return `game.import("extension",function(lib,game,ui,get,ai,_status){return {
 name:${JSON.stringify(name)},content:function(){${content}},precontent:function(){},
 package:{character:{character:${JSON.stringify(characters)},translate:${JSON.stringify(Object.fromEntries(ids.map(id => [id, id])))},characterSort:{pack:{group:${JSON.stringify(ids)}}}},
 skill:{skill:{shared:{audio:2,content:function(){return 1;}}${extraSkill}},translate:{shared:"共享技能"}},card:{card:{},list:[]}},files:{character:[]}
 };});`;
}
async function zip(file: string, files: Record<string, string | Buffer>) {
	const z = new yazl.ZipFile();
	const done = pipeline(z.outputStream, createWriteStream(file));
	for (const [name, data] of Object.entries(files)) z.addBuffer(Buffer.from(data), name, { compress: false });
	z.end();
	await done;
}
async function fixture(t: import("node:test").TestContext) {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), "noname-organizer-test-"));
	t.after(async () => {
		assert.ok(within(os.tmpdir(), root));
		await fs.rm(root, { recursive: true, force: true });
	});
	const input = path.join(root, "input"),
		output = path.join(root, "output");
	await fs.mkdir(input);
	return { root, input, output };
}
async function manifest(output: string) {
	return JSON.parse(await fs.readFile(path.join(output, "manifest.json"), "utf8"));
}

test("AST removes exact IDs and metadata, preserves shared skills and standalone registration", () => {
	const a = analyze(source("B", ["hero", "other", "hero "]), ["extension.js"]);
	const edited = removeCharacters(a, ["hero"]);
	let pack: any;
	// Execute only this test's own synthetic fixture, never downloaded extensions.
	vm.runInNewContext(edited, {
		game: {
			import: (_type: string, factory: Function) => {
				pack = factory({}, {}, {}, {}, {}, {});
			},
		},
	});
	assert.deepEqual(Object.keys(pack.package.character.character), ["other", "hero "]);
	assert.deepEqual(Array.from(pack.package.character.characterSort.pack.group), ["other", "hero "]);
	assert.ok(pack.package.skill.skill.shared);
	assert.equal(pack.package.character.translate.hero, undefined);
});
test("unsafe dynamic registration and dangling references are rejected", () => {
	assert.throws(() => analyze(source("A", ["a"], 'lib.character.x=["male","wei",4,[]];'), ["extension.js"]), /动态/);
	assert.throws(() => analyze(source("A", ["a"], 'game.import("character",function(){return {}});'), ["extension.js"]), /注册/);
	assert.throws(() => analyze(source("A", ["a"]), ["extension.js", "extra.js"]), /其他脚本/);
	const a = analyze(source("A", ["a", "b"], 'game.log("a");'), ["extension.js"]);
	assert.throws(() => removeCharacters(a, ["a"]), /引用/);
	assert.throws(() => analyze('eval("sideEffect()");', ["extension.js"]));
});
test("read-only unary checks do not count as writes, actual increments still do", () => {
	assert.equal(analyze(source("A", ["a"], 'if (!lib.character["somebody"]) return;'), ["extension.js"]).name, "A");
	assert.equal(analyze(source("A", ["a"], 'if (!lib.skill["shared"]) return;'), ["extension.js"]).name, "A");
	assert.throws(() => analyze(source("A", ["a"], '++lib.character["somebody"];'), ["extension.js"]), /动态注册/);
	assert.throws(() => analyze(source("A", ["a"], 'lib.skill["shared"]--;'), ["extension.js"]), /动态注册/);
});
test("legacy catalog metadata and direct objects are supported, executable catalog code is rejected", () => {
	const code = source("A", ["a"]);
	const metadata = 'extension["A"]={intro:"说明",files:["extension.js"]};';
	assert.equal(analyze(code, ["extension.js", "package.js"], undefined, { "package.js": metadata }).name, "A");
	assert.throws(() => analyze(code, ["extension.js", "package.js"], undefined, { "package.js": metadata + 'eval("bad");' }), /静态/);
	const direct = code.replace("function(lib,game,ui,get,ai,_status){return ", "").replace("};});", "});");
	assert.deepEqual(analyze(direct, ["extension.js"]).characters, ["a"]);
});
test("explicit external/missing assets, subskill collisions, and missing ESM type are rejected", () => {
	assert.throws(() => analyze(source("A", ["a"], 'game.log("ext:Other/a.jpg");'), ["extension.js"]), /其他扩展/);
	assert.throws(() => analyze(source("A", ["a"], 'game.log("ext:A/missing.jpg");'), ["extension.js"]), /缺失/);
	const collision = source("A", ["a"], "", ",shared_sub:{content:function(){return 2;}}").replace("audio:2,content:", "subSkill:{sub:{content:function(){return 3;}}},audio:2,content:");
	assert.throws(() => analyze(collision, ["extension.js"]), /子技能 ID 冲突/);
	assert.throws(() => analyze('export default {name:"A"}', ["extension.js"]), /type/);
});
test("path protections include Windows reserved names and traversal", () => {
	for (const name of ["../x", "/root", "C:/x", "dir/../x", "foo:bar", "a/CON.txt", "x. ", "x\0y"]) assert.throws(() => safePath(name));
	assert.equal(safePath("中文\\图片.jpg"), "中文/图片.jpg");
});
test("incremental ownership, deletion promotion, rename, and independent outputs", async t => {
	const { input, output } = await fixture(t);
	const license = Buffer.from([0xd6, 0xd0]); // GBK bytes must survive wrapper normalization unchanged.
	await zip(path.join(input, "A.zip"), { "wrapper/extension.js": source("A", ["hero"]), LICENSE: license });
	await zip(path.join(input, "B.zip"), { "extension.js": source("B", ["hero", "other"]), "other.jpg": "image" });
	const first = await organize({ input, output });
	assert.equal(first.outputs, 2);
	assert.equal(first.built, 2);
	let m = await manifest(output);
	assert.deepEqual(m.products.find((p: any) => p.name === "B").characters, ["other"]);
	const aZip = await Archive.open(path.join(output, "packages", m.products[0].file));
	assert.ok(aZip.entries.has("_organizer_source/LICENSE"));
	assert.deepEqual(await aZip.read("_organizer_source/LICENSE"), license);
	aZip.close();
	const hashes = m.products.map((p: any) => p.hash);
	const second = await organize({ input, output });
	assert.equal(second.hashed, 0);
	assert.equal(second.analyzed, 0);
	assert.equal(second.built, 0);
	assert.equal(second.reused, 2);
	assert.deepEqual(
		(await manifest(output)).products.map((p: any) => p.hash),
		hashes
	);
	// Alphabetically earlier new files still come after first-seen sources.
	await zip(path.join(input, "0-new.zip"), { "extension.js": source("C", ["hero", "new"]) });
	await organize({ input, output });
	m = await manifest(output);
	assert.deepEqual(m.products.find((p: any) => p.name === "C").characters, ["new"]);
	await fs.unlink(path.join(input, "A.zip"));
	const deleted = await organize({ input, output });
	assert.deepEqual(deleted.removedSources, ["A.zip"]);
	assert.equal(deleted.built, 1);
	m = await manifest(output);
	assert.deepEqual(m.products.find((p: any) => p.name === "B").characters, ["hero", "other"]);
	assert.equal(Object.hasOwn(m.sources, "A.zip"), false);
	assert.equal((await fs.readdir(path.join(output, "packages"))).length, 2);
	await fs.rename(path.join(input, "B.zip"), path.join(input, "Z.zip"));
	const renamed = await organize({ input, output });
	assert.equal(renamed.built, 0);
	assert.deepEqual((await manifest(output)).products.find((p: any) => p.name === "B").characters, ["hero", "other"]);
});
test("duplicate archives retain provenance when one copy is deleted", async t => {
	const { input, output } = await fixture(t);
	await zip(path.join(input, "A.zip"), { "extension.js": source("A", ["a"]) });
	await fs.copyFile(path.join(input, "A.zip"), path.join(input, "B.zip"));
	assert.equal((await organize({ input, output })).outputs, 1);
	await fs.unlink(path.join(input, "A.zip"));
	const result = await organize({ input, output });
	assert.equal(result.outputs, 1);
	assert.equal(result.built, 0);
	assert.deepEqual(Object.keys((await manifest(output)).sources), ["B.zip"]);
});
test("nested ZIP and sibling packages normalize to separate root-entry ZIPs", async t => {
	const { root, input, output } = await fixture(t);
	const child = path.join(root, "child.zip");
	await zip(child, { "one/extension.js": source("one", ["a"]), "two/extension.js": source("two", ["b"]) });
	await zip(path.join(input, "nested.zip"), { "内层.zip": await fs.readFile(child) });
	const result = await organize({ input, output });
	assert.equal(result.outputs, 2);
	const repeat = await organize({ input, output });
	assert.equal(repeat.built, 0);
	assert.equal(repeat.analyzed, 0);
	const cached = (await fs.readdir(path.join(output, ".cache"))).find(n => n.endsWith(".zip"))!;
	await fs.writeFile(path.join(output, ".cache", cached), "corrupt nested cache");
	const repaired = await organize({ input, output, verify: true });
	assert.equal(repaired.outputs, 2);
	assert.equal(repaired.reused, 2);
});
test("entrypoints never suppress nested ZIP discovery, including rejected overlapping roots", async t => {
	const { root, input, output } = await fixture(t);
	const child = path.join(root, "child.zip");
	await zip(child, { "extension.js": source("child", ["a", "c"]) });
	await zip(path.join(input, "mixed.zip"), { "extension.js": source("outer", ["a"]), "archive.zip": await fs.readFile(child) });
	const result = await organize({ input, output });
	assert.equal(result.outputs, 2);
	assert.ok(result.rows.some(r => r.source.includes("archive.zip > 根目录") && r.status === "成功"));
	const products = (await manifest(output)).products;
	assert.deepEqual(products.find((p: any) => p.name === "outer").characters, ["a"]);
	assert.deepEqual(products.find((p: any) => p.name === "child").characters, ["c"]);
	await zip(path.join(input, "overlapping.zip"), { "extension.js": source("overlap", ["x"]), "sub/extension.js": source("sub", ["y"]), "archive.zip": await fs.readFile(child) });
	const next = await organize({ input, output });
	const rows = next.rows.filter(r => r.source.startsWith("overlapping.zip > "));
	assert.equal(rows.length, 3);
	assert.equal(rows.filter(r => r.reason?.includes("嵌套")).length, 2);
	assert.ok(rows.some(r => r.source.includes("archive.zip > 根目录") && r.status === "重复原包"));
});
test("name and divergent skill conflicts are reported without consuming character ownership", async t => {
	const { input, output } = await fixture(t);
	await zip(path.join(input, "A.zip"), { "extension.js": source("same", ["a"]) });
	await zip(path.join(input, "B.zip"), { "extension.js": source("same", ["b"]) });
	await zip(path.join(input, "C.zip"), { "extension.js": source("C", ["b"]).replace("return 1;", "return 2;") });
	await zip(path.join(input, "D.zip"), { "extension.js": source("D", ["b"]) });
	const result = await organize({ input, output });
	assert.equal(result.outputs, 2);
	assert.ok(result.rows.some(r => r.reason?.includes("内部名称冲突")));
	assert.ok(result.rows.some(r => r.reason?.includes("技能 ID 冲突")));
	assert.deepEqual((await manifest(output)).products[1].characters, ["b"]);
});
test("dry-run leaves output untouched and verify detects same-metadata changes", async t => {
	const { input, output } = await fixture(t);
	const inputZip = path.join(input, "A.zip");
	await zip(inputZip, { "extension.js": source("A", ["a"]) });
	const dry = await organize({ input, output, dryRun: true });
	assert.equal(dry.outputs, 1);
	assert.equal(await fs.stat(output).catch(() => null), null);
	await organize({ input, output });
	let m = await manifest(output);
	const product = path.join(output, "packages", m.products[0].file);
	await fs.writeFile(product, "corrupt output");
	const repaired = await organize({ input, output, verify: true });
	assert.equal(repaired.built, 1);
	m = await manifest(output);
	assert.equal(await hashFile(product), m.products[0].hash);
	// A same-length content change with a restored mtime defeats quick metadata
	// checks; verify must still find it. Match the recorded precision explicitly.
	const originalTime = (await fs.stat(inputZip)).mtime;
	await zip(inputZip, { "extension.js": source("A", ["z"]) });
	await fs.utimes(inputZip, originalTime, originalTime);
	const changedStat = await fs.stat(inputZip);
	assert.equal(changedStat.size, m.sources["A.zip"].size);
	m.sources["A.zip"].mtimeMs = changedStat.mtimeMs;
	await fs.writeFile(path.join(output, "manifest.json"), JSON.stringify(m));
	const modified = await organize({ input, output, verify: true });
	assert.equal(modified.built, 1);
	assert.deepEqual((await manifest(output)).products[0].characters, ["z"]);
});
test("CRC corruption and case collisions are rejected", async t => {
	const { root } = await fixture(t);
	const bad = path.join(root, "bad.zip");
	await zip(bad, { "extension.js": source("A", ["a"]) });
	const bytes = await fs.readFile(bad);
	const start = 30 + bytes.readUInt16LE(26) + bytes.readUInt16LE(28);
	bytes[start + 5] ^= 1;
	await fs.writeFile(bad, bytes);
	const a = await Archive.open(bad);
	try {
		await assert.rejects(a.read("extension.js"), /CRC/);
	} finally {
		a.close();
	}
	const collision = path.join(root, "collision.zip");
	await zip(collision, { "A.jpg": "1", "a.jpg": "2" });
	await assert.rejects(Archive.open(collision), /冲突/);
});
test("interrupted publication cleans only journal-owned obsolete files", async t => {
	const { input, output } = await fixture(t);
	await zip(path.join(input, "A.zip"), { "extension.js": source("A", ["a"]) });
	await organize({ input, output });
	const orphan = "f".repeat(64) + ".zip";
	await fs.writeFile(path.join(output, "packages", orphan), "interrupted");
	await fs.writeFile(path.join(output, "packages", "personal.txt"), "keep");
	await fs.writeFile(path.join(output, "journal.json"), JSON.stringify({ transaction: "uncommitted", created: [orphan], retired: [] }));
	const result = await organize({ input, output });
	assert.equal(result.reused, 1);
	assert.equal(await fs.stat(path.join(output, "packages", orphan)).catch(() => null), null);
	assert.equal(await fs.readFile(path.join(output, "packages", "personal.txt"), "utf8"), "keep");
});
test("source changes during build abort publication and the next run recovers", async t => {
	const { input, output } = await fixture(t);
	await zip(path.join(input, "A.zip"), { "extension.js": source("A", ["a"]) });
	await organize({ input, output });
	const before = await hashFile(path.join(output, "manifest.json"));
	await zip(path.join(input, "B.zip"), { "extension.js": source("B", ["b"]) });
	let changed = false;
	await assert.rejects(
		organize({
			input,
			output,
			log(message) {
				if (!changed && message.startsWith("已生成")) {
					renameSync(path.join(input, "B.zip"), path.join(input, "C.zip"));
					changed = true;
				}
			},
		}),
		/源目录发生增删/
	);
	assert.equal(await hashFile(path.join(output, "manifest.json")), before);
	assert.equal((await organize({ input, output })).outputs, 2);
	assert.equal((await fs.readdir(path.join(output, "packages"))).length, 2);
});
test("an active lock is not stolen", async t => {
	const { input, output } = await fixture(t);
	await fs.mkdir(output);
	await fs.writeFile(path.join(output, ".lock"), JSON.stringify({ pid: process.pid }));
	await assert.rejects(organize({ input, output }), /已有整理进程/);
	assert.ok(await fs.stat(path.join(output, ".lock")));
});
