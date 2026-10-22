import assert from "node:assert/strict";
import { test } from "node:test";

import { buildManifestIndex, getManifestPathType } from "../src/ios/manifest-index.ts";

test("按目录建立索引：根目录、嵌套目录、文件", () => {
	const index = buildManifestIndex(["a/b.txt", "a/c/d.js", "e.txt"]);

	assert.deepEqual([...index.files].sort(), ["a/b.txt", "a/c/d.js", "e.txt"]);
	assert.deepEqual(index.directories.get(""), { folders: ["a"], files: ["e.txt"] });
	assert.deepEqual(index.directories.get("a"), { folders: ["c"], files: ["b.txt"] });
	assert.deepEqual(index.directories.get("a/c"), { folders: [], files: ["d.js"] });
});

test("忽略空条目、非字符串与重复条目", () => {
	const index = buildManifestIndex(["", "a.txt", "a.txt", null, 42, "b/c.txt"]);

	assert.deepEqual([...index.files].sort(), ["a.txt", "b/c.txt"]);
	assert.deepEqual(index.directories.get(""), { folders: ["b"], files: ["a.txt"] });
	assert.deepEqual(index.directories.get("b"), { folders: [], files: ["c.txt"] });
});

test("反斜杠与 . 段归一化", () => {
	const index = buildManifestIndex(["a\\b\\c.txt", "./a/./d.txt"]);

	assert.deepEqual([...index.files].sort(), ["a/b/c.txt", "a/d.txt"]);
	assert.deepEqual(index.directories.get("a/b"), { folders: [], files: ["c.txt"] });
	assert.deepEqual(index.directories.get("a"), { folders: ["b"], files: ["d.txt"] });
});

test("目录子项按名称排序", () => {
	const index = buildManifestIndex(["d/z.txt", "d/a.txt", "d/m/y.txt", "d/b/x.txt"]);

	assert.deepEqual(index.directories.get("d"), { folders: ["b", "m"], files: ["a.txt", "z.txt"] });
});

test("未知目录返回 undefined（由调用方退化为空列表）", () => {
	const index = buildManifestIndex(["a.txt"]);
	assert.equal(index.directories.get("missing"), undefined);
});

test("一次判定文件、目录与未知路径", () => {
	const index = buildManifestIndex(["a/b.txt"]);

	assert.equal(getManifestPathType(index, "a/b.txt"), "file");
	assert.equal(getManifestPathType(index, "a"), "directory");
	assert.equal(getManifestPathType(index, "a/missing.txt"), "unknown");
});
