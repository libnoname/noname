import { normalizePath, Plugin } from "vite";
import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default function vitePluginJIT(importMap: Record<string, string> = {}): Plugin {
	let root = process.cwd();
	let isBuild = false;
	const resolvedImportMap: Record<string, string> = {};

	return {
		name: "vite-plugin-jit",

		configResolved(config) {
			isBuild = config.command === "build";
			root = config.root;
		},

		async buildStart() {
			if (!isBuild) return;
			for (const key in importMap) {
				try {
					const resolved = require.resolve(importMap[key]);
					resolvedImportMap[key] = normalizePath("/" + path.relative(root, resolved));
				} catch (e) {
					resolvedImportMap[key] = importMap[key];
				}
			}
		},

		closeBundle() {
			const gameJs = path.resolve("dist/game/game.js");
			fs.mkdirSync(path.dirname(gameJs), { recursive: true });
			fs.writeFileSync(
				gameJs,
				`"use strict";
(() => {
	if (location.protocol.startsWith("file")) {
		alert("您使用的浏览器或客户端正在使用不受支持的file协议运行无名杀\\n请检查浏览器或客户端是否需要更新");
		return;
	}

	for (const link of document.head.querySelectorAll("link")) {
		if (link.href.includes("app/color.css")) {
			link.remove();
			break;
		}
	}
	
	if (typeof window.cordovaLoadTimeout != "undefined") {
		clearTimeout(window.cordovaLoadTimeout);
		delete window.cordovaLoadTimeout;
	}


	const im = document.createElement("script");
	im.type = "importmap";
	im.textContent = \`${JSON.stringify({ imports: resolvedImportMap }, null, 2)}\`;
	document.currentScript.after(im);

	const jit = document.createElement("script");
	jit.type = "module";
	jit.textContent = \`(async function () {
		const scope = new URL("./", location.href).toString();
		// if (import.meta.env.DEV) {
		// 	if ("serviceWorker" in navigator) {
		// 		let registrations = await navigator.serviceWorker.getRegistrations();
		// 		await registrations.find(registration => registration?.active?.scriptURL == \\\`\\\${scope}service-worker.js\\\`)?.unregister();
		// 	}
		// 	return;
		// }

		// ⚠️ 下面这段是 packages/jit/src/entry.ts 的内联副本（用于本插件生成的
		// dist/game/game.js；注意该文件目前在仓库内没有任何引用点）。
		// 两处必须保持一致，改动 JIT 逻辑时请一并修改。
		//
		// JIT 依赖 Service Worker 拦截 /extension/** 与 /jit-test.ts，而
		// service-worker/index.ts 只对 localhost / 127.0.0.1 / 10.0.2.2 生效；
		// 其他部署形态下注册 SW 没有作用，却要下载并解析约 4.2 MB 的
		// dist/service-worker.js（内含完整 TypeScript 编译器），失败时还会整页刷新。
		const isJitUsable = (() => {
			if (!("serviceWorker" in navigator)) return false;
			if (location.protocol !== "http:" && location.protocol !== "https:") return false;
			if (!window.isSecureContext) return false;
			const wkWebView = window;
			if (wkWebView.webkit?.messageHandlers?.bridge) return false;
			return ["localhost", "127.0.0.1", "10.0.2.2"].includes(location.hostname);
		})();

		if (!isJitUsable) {
			console.info("[noname] 即时编译（JIT）在当前环境不可用，已跳过 Service Worker。");
			return;
		}

		// 只有确实存在旧 worker 时才需要「先注销再重载」，否则首次访问白白多刷一次
		try {
			const registrations = await navigator.serviceWorker.getRegistrations();
			const staleRegistration = registrations.find(registration => registration?.active?.scriptURL == \\\`\\\${scope}service-worker.js\\\`);
			if (staleRegistration && sessionStorage.getItem("isJITReloaded") !== "true") {
				await staleRegistration.unregister();
				sessionStorage.setItem("isJITReloaded", "true");
				window.location.reload();
				return;
			}
		} catch (e) {
			console.info("[noname] 查询已有 Service Worker 失败，继续尝试注册。", e);
		}

		try {
			await navigator.serviceWorker.register(\\\`\\\${scope}service-worker.js\\\`, {
				type: "module",
				updateViaCache: "all",
				scope,
			});
			// 接收消息
			navigator.serviceWorker.addEventListener("message", e => {
				if (e.data?.type === "reload") {
					window.location.reload();
				}
			});
			// 发送消息
			// navigator.serviceWorker.controller?.postMessage({ action: "reload" });
			// await registration.update().catch(e => console.error("worker update失败", e));
			if (sessionStorage.getItem("canUseTs") !== "true") {
				const path = "/jit-test.ts";
				console.log((await import(/* @vite-ignore */ path)).text);
				sessionStorage.setItem("canUseTs", "true");
			}
		} catch (e) {
			// 注册失败不再整页刷新：那只会让用户反复闪白，问题也不会因此消失。
			sessionStorage.setItem("canUseTs", "false");
			console.info("[noname] Service Worker 注册失败，即时编译不可用：", e);
		}
	})();\`
	document.head.appendChild(jit);

	const script = document.createElement("script");
	script.type = "module";
	script.src = "/noname/entry.js";
	document.head.appendChild(script);
})();`
			);
		},

		transformIndexHtml(html) {
			if (!isBuild) return;
			return {
				html,
				tags: [
					{
						tag: "script",
						attrs: {
							type: "importmap",
						},
						children: JSON.stringify({ imports: resolvedImportMap }, null, 2),
						injectTo: "head-prepend",
					},
				],
			};
		},
	};
}
