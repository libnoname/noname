import assert from "node:assert/strict";
import { test } from "node:test";

import { probeBundledResource } from "../src/ios/resource-probe.ts";

const response = (status, contentType = "application/octet-stream") =>
	new Response("", {
		status,
		headers: contentType ? { "content-type": contentType } : {},
	});

test("custom scheme 请求失败时视为资源不存在", async (t) => {
	const originalFetch = globalThis.fetch;
	t.after(() => {
		globalThis.fetch = originalFetch;
	});

	globalThis.fetch = async () => {
		throw undefined;
	};

	assert.equal(await probeBundledResource("capacitor://localhost/missing.txt", true), false);
});

test("404 视为不存在，5xx 继续报错", async (t) => {
	const originalFetch = globalThis.fetch;
	t.after(() => {
		globalThis.fetch = originalFetch;
	});

	globalThis.fetch = async () => response(404);
	assert.equal(await probeBundledResource("capacitor://localhost/missing.js", true), false);

	globalThis.fetch = async () => response(503);
	await assert.rejects(probeBundledResource("capacitor://localhost/broken.js", true), /HTTP|内置资源探测失败/);
});

test("无扩展名的 HTML 响应视为目录，普通资源响应视为文件", async (t) => {
	const originalFetch = globalThis.fetch;
	t.after(() => {
		globalThis.fetch = originalFetch;
	});

	globalThis.fetch = async () => response(200, "text/html; charset=utf-8");
	assert.equal(await probeBundledResource("capacitor://localhost/image", false), false);
	assert.equal(await probeBundledResource("capacitor://localhost/preload.js", true), true);
});
