// Client 广播序列化的行为测试。
//
// client.js 依赖 "noname" 与 "@/util/sandbox.js"，无法在 node 里直接 import。
// 这里用 esbuild 以 alias 把这两个模块替换成桩，打包出真实的 Client 类，
// 再验证：
//   1. buildPayload 与 send 的序列化结果完全一致（不能改变线上报文格式）；
//   2. 函数首个参数会被替换成 "exec"（原有约定）；
//   3. 多客户端广播时同一份 payload 只序列化一次，且各客户端收到的字符串完全相同。
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { after, test } from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "noname-client-"));
const outFile = path.join(workDir, "client.bundle.mjs");

const stubNoname = path.join(workDir, "stub-noname.mjs");
fs.writeFileSync(
	stubNoname,
	`const counters = { stringified: 0, stringify: 0 };
const lib = { element: {}, node: { clients: [] } };
const ui = {};
const game = { online: false };
const _status = {};
const get = {
	id: () => "generated-id",
	// 忠实还原 get.stringifiedResult 的关键行为：
	// 函数走 get.funcInfoOL（变成可序列化的描述串），对象变成 JSON 字符串。
	stringifiedResult(value) {
		counters.stringified++;
		if (typeof value === "function") {
			return "_func:" + (value.name || "anonymous");
		}
		if (typeof value === "object" && value !== null) {
			return JSON.stringify(value);
		}
		return value;
	}
};
// esbuild 会把这份桩内联进 bundle，于是 bundle 里是**另一份模块实例**：
// 测试如果单独 import 这个文件，拿到的是另一个 counters 对象，计数永远是 0。
// 因此把桩的状态挂到全局，测试从全局读取 bundle 实际使用的那一份。
globalThis.__clientStub = { counters, lib, ui, game, _status, get };
export { counters, lib, ui, game, _status, get };
`
);

const stubSandbox = path.join(workDir, "stub-sandbox.mjs");
fs.writeFileSync(stubSandbox, `export const security = { createSandbox: () => undefined };\n`);

const esbuildPkg = path.join(repoRoot, "node_modules/.pnpm/esbuild@0.27.3/node_modules/esbuild");
const { buildSync } = await import(pathToFileURL(path.join(esbuildPkg, "lib/main.js")).href);
buildSync({
	entryPoints: [path.join(repoRoot, "apps/core/noname/library/element/client.js")],
	outfile: outFile,
	format: "esm",
	platform: "neutral",
	target: "es2022",
	bundle: true,
	logLevel: "silent",
	alias: {
		noname: stubNoname,
		"@/util/sandbox.js": stubSandbox,
	},
});

after(() => fs.rmSync(workDir, { recursive: true, force: true }));

const mod = await import(pathToFileURL(outFile).href);
const { Client } = mod;
// 从全局读取 bundle 内联的那份桩状态（见桩里的注释）
const { counters, lib } = globalThis.__clientStub;

/** 造一个只记录收到的报文的假 ws */
function makeFakeWs() {
	return {
		wsid: `ws-${Math.random().toString(36).slice(2)}`,
		sent: [],
		send(payload) {
			this.sent.push(payload);
		},
		close() {},
	};
}

test("buildPayload 与 send 的报文格式一致", () => {
	const ws = makeFakeWs();
	const client = new Client(ws, true);

	client.send("message", { a: 1 });
	const viaSend = ws.sent.at(-1);

	ws.sent.length = 0;
	client.sendSerialized(Client.buildPayload(["message", { a: 1 }]));
	const viaBuild = ws.sent.at(-1);

	assert.equal(viaBuild, viaSend, "两条路径必须产生完全相同的字符串");
	assert.deepEqual(JSON.parse(viaBuild), ["message", '{"a":1}']);
});

test("首个参数是函数时替换为 exec（保持原有约定）", () => {
	const ws = makeFakeWs();
	const client = new Client(ws, true);
	client.send(function foo() {}, { b: 2 });
	const parsed = JSON.parse(ws.sent.at(-1));
	// 原本的约定：函数占 args[0] 时前面插入 "exec"，函数自身经 stringifiedResult
	// 变成可序列化的描述串，参数对象变成 JSON 字符串。
	assert.equal(parsed[0], "exec");
	assert.equal(parsed[1], "_func:foo");
	assert.equal(parsed[2], '{"b":2}');
});

test("多客户端广播：同一份 payload 只序列化一次，且各客户端收到的字符串相同", () => {
	counters.stringified = 0;

	const clients = [makeFakeWs(), makeFakeWs(), makeFakeWs()].map(ws => {
		const c = new Client(ws, true);
		c.inited = true;
		return { c, ws };
	});
	lib.node.clients = clients.map(x => x.c);

	// 复刻 game.broadcast 的多客户端分支
	const func = "message";
	const args = [{ x: 1 }, { y: 2 }];
	const payload = Client.buildPayload([func, ...args]);
	for (const { c } of clients) {
		c.sendSerialized(payload);
	}

	for (const { ws } of clients) {
		assert.equal(ws.sent.length, 1);
		assert.equal(ws.sent[0], payload, "所有客户端必须收到同一个字符串");
	}
	// 3 个客户端、2 个参数：只应发生 2 次 stringifiedResult，而不是 6 次
	assert.equal(counters.stringified, 2, `期望只序列化一次参数集，实际 ${counters.stringified} 次`);

	// 对照：旧的逐客户端 send() 会做 3 倍工作
	counters.stringified = 0;
	for (const { c } of clients) {
		c.send(func, ...args);
	}
	assert.equal(counters.stringified, 6, "对照组的逐客户端序列化应为 6 次");
});

test("单客户端时 send 路径与广播 payload 等价", () => {
	const ws = makeFakeWs();
	const client = new Client(ws, true);
	client.send("message", { z: 9 });
	const direct = ws.sent.at(-1);
	client.sendSerialized(Client.buildPayload(["message", { z: 9 }]));
	assert.equal(ws.sent.at(-1), direct);
});
