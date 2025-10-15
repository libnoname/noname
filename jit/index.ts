/// <reference types="vite/client" />
export {};
(async function () {
	if (import.meta.env.DEV) {
		let scope = new URL("./", location.href).toString();
		let registrations = await navigator.serviceWorker.getRegistrations();
		registrations
			.find(registration => {
				return registration && registration.active && registration.active.scriptURL == `${scope}service-worker.js`;
			})
			?.unregister();
		return;
	}

	// 处理Node环境下的http情况
	if (typeof window.require == "function" && typeof window.process == "object" && typeof window.__dirname == "string") {
		// 在http环境下修改__dirname和require的逻辑
		if (window.__dirname.endsWith("electron.asar\\renderer") || window.__dirname.endsWith("electron.asar/renderer")) {
			const path = require("path");
			if (window.process.platform === "darwin") {
				//@ts-ignore
				window.__dirname = path.join(window.process.resourcesPath, "app");
			} else {
				window.__dirname = path.join(path.resolve(), "resources/app");
			}
			const oldRequire = window.require;
			// @ts-expect-error ignore
			window.require = function (moduleId) {
				try {
					return oldRequire(moduleId);
				} catch {
					return oldRequire(path.join(window.__dirname, moduleId));
				}
			};
			Object.entries(oldRequire).forEach(([key, value]) => {
				window.require[key] = value;
			});
		}
	// 	// 增加导入ts的逻辑
	// 	window.require.extensions[".ts"] = function (module, filename) {
	// 		// @ts-expect-error ignore
	// 		const _compile = module._compile;
	// 		// @ts-expect-error ignore
	// 		module._compile = function (code, fileName) {
	// 			/**
	// 			 *
	// 			 * @type { import("typescript") }
	// 			 */
	// 			// @ts-expect-error ignore
	// 			const ts = require("typescript");
	// 			// 使用ts compiler对ts文件进行编译
	// 			const result = ts.transpile(
	// 				code,
	// 				{
	// 					module: ts.ModuleKind.CommonJS,
	// 					target: ts.ScriptTarget.ES2020,
	// 					inlineSourceMap: true,
	// 					resolveJsonModule: true,
	// 					esModuleInterop: true,
	// 				},
	// 				fileName
	// 			);
	// 			// 使用默认的js编译函数获取返回值
	// 			return _compile.call(this, result, fileName);
	// 		};
	// 		// @ts-expect-error ignore
	// 		module._compile(require("fs").readFileSync(filename, "utf8"), filename);
	// 	};
	}

	const globalText = {
		SERVICE_WORKER_NOT_SUPPORT: [
			"您使用的客户端或浏览器不支持启用serviceWorker",
			"请确保您的客户端或浏览器使用http://localhost或https协议打开《无名杀》并且启用serviceWorker！",
		].join("\n"),
		SERVICE_WORKER_LOAD_FAILED: ["serviceWorker加载失败！", "游戏内容或许会因此加载失败！"].join("\n"),
	};
	if (!("serviceWorker" in navigator)) {
		alert(globalText.SERVICE_WORKER_NOT_SUPPORT);
	} else {
		let scope = new URL("./", location.href).toString();
		let registrations = await navigator.serviceWorker.getRegistrations();
		let findServiceWorker = registrations.find(registration => {
			return registration && registration.active && registration.active.scriptURL == `${scope}service-worker.js`;
		});

		try {
			const registration = await navigator.serviceWorker.register(`${scope}service-worker.js`, {
				type: "module",
				updateViaCache: "all",
				scope,
			});
			// 初次加载worker，需要重新启动一次
			if (!findServiceWorker) {
				window.location.reload();
			}
			// 接收消息
			navigator.serviceWorker.addEventListener("message", e => {
				if (e.data?.type === "reload") {
					window.location.reload();
				}
			});
			// 发送消息
			// navigator.serviceWorker.controller?.postMessage({ action: "reload" });
			registration.update().catch(e => console.error("worker update失败", e));
			if (!sessionStorage.getItem("canUseTs")) {
				const path = "./test/canUse.ts";
				await import(/* @vite-ignore */path);
			}
		} catch (e) {
			console.log("serviceWorker加载失败: ", e);
			alert(globalText.SERVICE_WORKER_LOAD_FAILED);
		}
	}
})();
