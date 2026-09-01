/// <reference types="vite/client" />
(async function () {
	// JIT TypeScript 编译仅在本地开发时有效(SW fetch handler 只拦截 localhost)。
	// 部署到线上后注册 JIT SW 反而会抢占 pwa-sw.js 的 scope、触发多次 reload、
	// 导致离线缓存失效白屏。故：非本地环境直接跳过。
	const LOCAL_HOSTS = ["localhost", "127.0.0.1", "10.0.2.2"];
	if (!LOCAL_HOSTS.includes(location.hostname)) return;

	const scope = new URL("./", location.href).toString();
	// if (import.meta.env.DEV) {
	// 	if ("serviceWorker" in navigator) {
	// 		let registrations = await navigator.serviceWorker.getRegistrations();
	// 		await registrations.find(registration => registration?.active?.scriptURL == `${scope}service-worker.js`)?.unregister();
	// 	}
	// 	return;
	// }

	const globalText = {
		SERVICE_WORKER_NOT_SUPPORT: ["无法启用即时编译功能", "您使用的客户端或浏览器不支持启用serviceWorker"].join("\n"),
		SERVICE_WORKER_LOAD_FAILED: ["无法启用即时编译功能", "serviceWorker加载失败"].join("\n"),
	};

	if (!("serviceWorker" in navigator)) {
		alert(globalText.SERVICE_WORKER_NOT_SUPPORT);
		return;
	}

	// 初次加载worker，需要重新启动一次
	if (sessionStorage.getItem("isJITReloaded") !== "true") {
		let registrations = await navigator.serviceWorker.getRegistrations();
		await registrations.find(registration => registration?.active?.scriptURL == `${scope}service-worker.js`)?.unregister();
		sessionStorage.setItem("isJITReloaded", "true");
		window.location.reload();
		return;
	}

	try {
		await navigator.serviceWorker.register(`${scope}service-worker.js`, {
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
			// alert(globalText.SERVICE_WORKER_LOAD_FAILED);
		} else {
			sessionStorage.setItem("canUseTs", "false");
			window.location.reload();
		}
	}
})();
