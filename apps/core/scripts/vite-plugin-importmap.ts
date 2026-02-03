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

		const globalText = {
			SERVICE_WORKER_NOT_SUPPORT: ["无法启用即时编译功能", "您使用的客户端或浏览器不支持启用serviceWorker"].join("\\\\n"),
			SERVICE_WORKER_LOAD_FAILED: ["无法启用即时编译功能", "serviceWorker加载失败"].join("\\\\n"),
		};

		if (!("serviceWorker" in navigator)) {
			alert(globalText.SERVICE_WORKER_NOT_SUPPORT);
			return;
		}

		// 初次加载worker，需要重新启动一次
		if (sessionStorage.getItem("isJITReloaded") !== "true") {
			let registrations = await navigator.serviceWorker.getRegistrations();
			await registrations.find(registration => registration?.active?.scriptURL == \\\`\\\${scope}service-worker.js\\\`)?.unregister();
			sessionStorage.setItem("isJITReloaded", "true");
			window.location.reload();
			return;
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
			if (sessionStorage.getItem("canUseTs") === "false") {
				console.log("serviceWorker加载失败: ", e);
				alert(globalText.SERVICE_WORKER_LOAD_FAILED);
			} else {
				sessionStorage.setItem("canUseTs", "false");
				window.location.reload();
			}
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
