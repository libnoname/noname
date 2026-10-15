/// <reference types="vite/client" />
(async function () {
	// 即时编译（JIT）依赖 Service Worker 拦截 /extension/** 与 /jit-test.ts 的请求，
	// 而 service-worker/index.ts 的 fetch 处理器只对 localhost / 127.0.0.1 / 10.0.2.2 生效。
	//
	// 在其他部署形态下（Cloudflare Pages 的正式域名、iOS 的 capacitor:// 等）注册 SW
	// 完全没有作用，但浏览器仍会下载并解析 dist/service-worker.js —— 那里面打包了完整的
	// TypeScript 编译器与 @vue/compiler-sfc，压缩后约 4.2 MB；而且一旦注册/激活失败，
	// 下面的 catch 分支还会触发一次整页刷新。纯属负收益。
	//
	// 因此把门禁提到最前面：环境不可用时直接返回，不注册、不刷新、不弹窗。
	const isJitUsable = (() => {
		if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
			return false;
		}
		// 自定义协议（capacitor://、ionic://、file://）下 Service Worker 无法工作
		if (location.protocol !== "http:" && location.protocol !== "https:") {
			return false;
		}
		// Service Worker 需要安全上下文。注意 http://localhost 与 http://127.0.0.1
		// 本身就算安全上下文，因此本地开发与 Android WebView 仍然可用。
		if (!window.isSecureContext) {
			return false;
		}
		// WKWebView（iOS）不支持 Service Worker。window.webkit 是 WKWebView 私有的
		// 非标准扩展，不在 DOM 类型里，这里就地做一次结构化断言，避免污染全局 Window 接口。
		// 平台识别与 @capacitor/core 的 getPlatformId 保持一致：WKWebView 会注入
		// window.webkit.messageHandlers.bridge。这里不能用 Capacitor.getPlatform()，
		// 因为本脚本被注入到 <head> 最前（head-prepend），执行时 @capacitor/core 尚未加载。
		//
		// 必须在最前面拦截：否则一旦某个 iOS 版本带有 serviceWorker 但注册失败，
		// 就会走到下面的 catch 分支，页面无谓地闪白重载。
		const wkWebView = window as unknown as { webkit?: { messageHandlers?: { bridge?: unknown } } };
		if (wkWebView.webkit?.messageHandlers?.bridge) {
			return false;
		}
		// 与 service-worker/index.ts 的代理范围保持一致
		return ["localhost", "127.0.0.1", "10.0.2.2"].includes(location.hostname);
	})();

	// iOS 的 WKWebView 不支持 service worker，属于平台限制而非用户环境问题；
	// 移动端弹「功能不可用」的提示只会挡住游戏，因此这里整体跳过即时编译。
	// 其他平台（桌面浏览器等）在注册失败时也只记录日志，方便用户升级浏览器后重试。
	if (!isJitUsable) {
		console.info("[noname] 即时编译（JIT）在当前环境不可用，已跳过 Service Worker。");
		return;
	}

	const scope = new URL("./", location.href).toString();

	try {
		// 只有确实存在由本脚本注册过的旧 worker 时才需要「先注销再重载」，
		// 否则首次访问的每一次都会白白多刷一次页面。
		const registrations = await navigator.serviceWorker.getRegistrations();
		const staleRegistration = registrations.find(registration => registration?.active?.scriptURL == `${scope}service-worker.js`);
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
		if (sessionStorage.getItem("canUseTs") !== "true") {
			const path = "/jit-test.ts";
			console.log((await import(/* @vite-ignore */ path)).text);
			sessionStorage.setItem("canUseTs", "true");
		}
	} catch (e) {
		// 注册失败不再整页刷新：那只会让用户反复闪白，问题也不会因此消失。
		if (sessionStorage.getItem("canUseTs") !== "false") {
			sessionStorage.setItem("canUseTs", "false");
		}
		console.info("[noname] Service Worker 注册失败，即时编译不可用：", e);
	}
})();
