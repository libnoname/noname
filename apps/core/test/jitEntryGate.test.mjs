// 即时编译（JIT）入口的能力门禁行为测试。
//
// packages/jit/src/entry.ts 是一个在浏览器里执行的 IIFE，依赖 window / location /
// navigator / sessionStorage。这里用 esbuild 把 TS 转成 ESM，再在 node 里用桩对象
// 模拟各种部署形态，断言：
//   1. 不可用环境（正式域名、非安全上下文、自定义协议、WKWebView）不注册 SW；
//   2. 可用环境（localhost）仍然注册；
//   3. 首次访问（没有旧 worker）不再整页刷新；
//   4. 存在旧 worker 时才先注销并刷新一次；
//   5. 注册失败不刷新页面。
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { after, test } from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const entryTs = path.join(repoRoot, "packages/jit/src/entry.ts");
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "noname-jit-"));
const entryJs = path.join(workDir, "entry.mjs");

// 用 esbuild 单独转译这一个文件（不打包，保留 IIFE 结构）
const esbuildPkg = path.join(repoRoot, "node_modules/.pnpm/esbuild@0.27.3/node_modules/esbuild");
const { buildSync } = await import(pathToFileURL(path.join(esbuildPkg, "lib/main.js")).href);
buildSync({
	entryPoints: [entryTs],
	outfile: entryJs,
	format: "esm",
	platform: "browser",
	target: "es2022",
	bundle: false,
	logLevel: "silent",
});

after(() => fs.rmSync(workDir, { recursive: true, force: true }));

/** 构造一套浏览器桩环境，返回可观测记录 */
function makeEnv({ hostname, protocol = "https:", isSecureContext = true, hasServiceWorker = true, hasWKWebView = false, registrations = [], registerFails = false } = {}) {
	const calls = { register: 0, unregister: 0, reload: 0, consoleInfo: [], consoleLog: [] };

	const registration = { active: { scriptURL: `${protocol}//${hostname}/service-worker.js` } };

	const navigatorStub = hasServiceWorker
		? {
				serviceWorker: {
					getRegistrations: async () => registrations,
					register: async () => {
						calls.register++;
						if (registerFails) throw new Error("register failed");
						return registration;
					},
					addEventListener: () => {},
				},
			}
		: {};

	// reload 走一个可替换的钩子：entry.ts 里用的是 window.location.reload()，
	// 因此 window.location 与 globalThis.location 必须指向同一个对象。
	const reloadHook = { fn: () => {} };
	const locationStub = {
		href: `${protocol}//${hostname}/index.html`,
		hostname,
		protocol,
		reload: () => reloadHook.fn(),
	};

	// 注意：node 24 的 globalThis.navigator 是只读 getter，必须用 defineProperty 覆盖
	const define = (key, value) => Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });

	define("window", {
		isSecureContext,
		location: locationStub,
		...(hasWKWebView ? { webkit: { messageHandlers: { bridge: {} } } } : {}),
	});
	define("location", locationStub);
	define("navigator", navigatorStub);
	define("sessionStorage", {
		store: new Map(),
		getItem(k) {
			return this.store.has(k) ? this.store.get(k) : null;
		},
		setItem(k, v) {
			this.store.set(k, String(v));
		},
	});
	const origConsole = { info: console.info, log: console.log };
	console.info = (...a) => calls.consoleInfo.push(a.join(" "));
	console.log = (...a) => calls.consoleLog.push(a.join(" "));

	return {
		calls,
		registration,
		reloadHook,
		restore() {
			console.info = origConsole.info;
			console.log = origConsole.log;
			delete globalThis.window;
			delete globalThis.location;
			delete globalThis.navigator;
			delete globalThis.sessionStorage;
		},
	};
}

/** 载入被测模块（带 query 规避 ESM 缓存），等待 IIFE 内的 await 完成 */
async function runEntry(env, { reloadTracker } = {}) {
	if (reloadTracker) {
		env.reloadHook.fn = () => {
			reloadTracker.n++;
		};
	}
	await import(`${pathToFileURL(entryJs).href}?t=${Math.random()}`);
	// IIFE 里有 await，给它几个微任务/宏任务周期
	await new Promise(resolve => setTimeout(resolve, 20));
	env.restore();
}

test("正式域名（Cloudflare Pages）：不注册 Service Worker", async () => {
	const env = makeEnv({ hostname: "nngame.de5.net" });
	const reload = { n: 0 };
	await runEntry(env, { reloadTracker: reload });
	assert.equal(env.calls.register, 0, "非 localhost 不应注册 SW");
	assert.equal(reload.n, 0, "不应触发刷新");
	assert.ok(
		env.calls.consoleInfo.some(m => m.includes("不可用")),
		"应打印一条说明"
	);
});

test("非安全上下文（http 局域网地址）：不注册", async () => {
	const env = makeEnv({ hostname: "192.168.1.5", protocol: "http:", isSecureContext: false });
	const reload = { n: 0 };
	await runEntry(env, { reloadTracker: reload });
	assert.equal(env.calls.register, 0);
	assert.equal(reload.n, 0);
});

test("自定义协议（capacitor://）：不注册", async () => {
	const env = makeEnv({ hostname: "localhost", protocol: "capacitor:" });
	const reload = { n: 0 };
	await runEntry(env, { reloadTracker: reload });
	assert.equal(env.calls.register, 0, "capacitor:// 下 SW 无法工作");
	assert.equal(reload.n, 0);
});

test("WKWebView（iOS）：不注册", async () => {
	const env = makeEnv({ hostname: "localhost", protocol: "https:", hasWKWebView: true });
	const reload = { n: 0 };
	await runEntry(env, { reloadTracker: reload });
	assert.equal(env.calls.register, 0, "WKWebView 不支持 Service Worker");
	assert.equal(reload.n, 0);
});

test("不支持 serviceWorker 的浏览器：不注册也不弹窗", async () => {
	const env = makeEnv({ hostname: "localhost", hasServiceWorker: false });
	const reload = { n: 0 };
	await runEntry(env, { reloadTracker: reload });
	assert.equal(env.calls.register, 0);
	assert.equal(reload.n, 0);
});

test("localhost + 安全上下文：注册 Service Worker", async () => {
	const env = makeEnv({ hostname: "localhost", protocol: "https:", isSecureContext: true });
	const reload = { n: 0 };
	await runEntry(env, { reloadTracker: reload });
	assert.equal(env.calls.register, 1, "localhost 应注册 SW");
});

test("http://localhost 也算安全上下文：仍注册（本地开发）", async () => {
	const env = makeEnv({ hostname: "localhost", protocol: "http:", isSecureContext: true });
	const reload = { n: 0 };
	await runEntry(env, { reloadTracker: reload });
	assert.equal(env.calls.register, 1);
});

test("首次访问（无旧 worker）：不刷新页面", async () => {
	const env = makeEnv({ hostname: "localhost", registrations: [] });
	const reload = { n: 0 };
	await runEntry(env, { reloadTracker: reload });
	assert.equal(reload.n, 0, "没有旧 worker 时不应整页刷新");
	assert.equal(env.calls.register, 1);
});

test("存在旧 worker：注销并刷新一次", async () => {
	const proto = makeEnv({ hostname: "localhost" });
	const scriptURL = `${proto.registration.active.scriptURL}`;
	proto.restore();
	const env = makeEnv({ hostname: "localhost", registrations: [{ active: { scriptURL }, unregister: async () => {} }] });
	const reload = { n: 0 };
	await runEntry(env, { reloadTracker: reload });
	assert.equal(reload.n, 1, "存在旧 worker 应先注销再刷新一次");
	assert.equal(env.calls.register, 0, "刷新后本次不再继续注册");
});

test("注册失败：记录失败但不刷新页面", async () => {
	const env = makeEnv({ hostname: "localhost", registerFails: true });
	const reload = { n: 0 };
	await runEntry(env, { reloadTracker: reload });
	assert.equal(env.calls.register, 1);
	assert.equal(reload.n, 0, "注册失败不应整页刷新");
});
