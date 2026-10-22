import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { collectAssetEntries } from "../scripts/asset-manifest.ts";

test("收集资源时递归、排序并跳过约定目录", (t) => {
	const root = mkdtempSync(join(tmpdir(), "noname-assets-"));
	t.after(() => rmSync(root, { recursive: true, force: true }));

	mkdirSync(join(root, "character"), { recursive: true });
	mkdirSync(join(root, "node_modules", "ignored"), { recursive: true });
	writeFileSync(join(root, "character", "z.png"), "");
	writeFileSync(join(root, "character", "a.png"), "");
	writeFileSync(join(root, "index.js"), "");
	writeFileSync(join(root, "preload.js"), "");
	writeFileSync(join(root, "asset-manifest.json"), "[]");
	writeFileSync(join(root, "node_modules", "ignored", "x.js"), "");

	assert.deepEqual(collectAssetEntries(root), ["character/a.png", "character/z.png", "index.js"]);
});
