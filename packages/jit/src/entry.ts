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

	// iOS 的 WKWebView 不支持 service worker，属于平台限制而非用户环境问题。
	// 移动端弹「功能不可用」的提示只会挡住游戏，因此整体跳过即时编译功能；
	// 其他平台（桌面浏览器等）保持原有行为，方便用户升级浏览器后重试。
	//
	// 平台识别与 @capacitor/core 的 getPlatformId 保持一致：
	// WKWebView 会注入 window.webkit.messageHandlers.bridge，据此判断为 iOS。
	// 这里不能用 Capacitor.getPlatform()，因为本脚本被注入到 <head> 最前
	// （head-prepend），执行时 @capacitor/core 尚未加载。
	//
	// 必须在最前面拦截：否则一旦某个 iOS 版本带有 serviceWorker 但注册失败，
	// 会走到下面的 catch 分支触发 window.location.reload()，页面无谓地闪白重载。
	//
	// `window.webkit` 是 WKWebView 私有的非标准扩展，不在 TS 的 DOM 类型里，
	// 因此这里就地做一次结构化断言，避免为一个平台判断去污染全局 Window 接口。
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
