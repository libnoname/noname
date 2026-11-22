/// <reference types="vite/client" />
(async function () {
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
	
	// ios端目前不支持jit功能，直接关闭
	const wkWebView = window as unknown as {
		webkit?: { messageHandlers?: { bridge?: unknown } };
	};
	if (wkWebView.webkit?.messageHandlers?.bridge) {
		return;
	}

	if (!("serviceWorker" in navigator)) {
		alert(globalText.SERVICE_WORKER_NOT_SUPPORT);
		return;
	}

	// 接收消息：worker 首次安装或更新后激活时，会发 reload 让页面重载一次，改由新 worker 接管。
	// 必须在 register 之前监听，否则可能错过这条消息。
	navigator.serviceWorker.addEventListener("message", e => {
		if (e.data?.type === "reload") {
			window.location.reload();
		}
	});

	// 以前每次启动都先注销旧 worker 再重载整页，每次打开游戏都会白白多加载一遍（约 0.8 秒）。
	// 现在直接注册：worker 没变时页面一开始就由它控制，无需重载；
	// worker 首次安装或脚本有更新时，新 worker 在 activate 里 claim 并发 reload，只重载这一次。
	// updateViaCache: "none" 保证每次都检查 service-worker.js 是否有更新，不被 HTTP 缓存挡住。
	try {
		await navigator.serviceWorker.register(`${scope}service-worker.js`, {
			type: "module",
			updateViaCache: "none",
			scope,
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
