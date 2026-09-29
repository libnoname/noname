import { App } from "@capacitor/app";
import { Capacitor, registerPlugin, SystemBars } from "@capacitor/core";

import { installAssetDownloader } from "./asset-download.js";
import { createIosFileSystem } from "./fs/ios.js";
import { attachFileSystemAPI } from "./fs/legacy-api.js";
import {
	base64ToArrayBuffer,
	callbackError,
	joinFilePath,
	sanitizeExportName,
	writeDataToBase64,
	type NativeAccessResult,
	type NativeFileSystem,
} from "./fs/types.js";

/**
 * Android 端通过 SAF（Storage Access Framework）访问游戏目录，
 * 原生实现见 `apps/mobile/android/.../SafFsPlugin.kt`。
 *
 * 插件方法在平台分支里被当作 `NativeFileSystem` 使用，
 * 这样 Android / iOS 两套实现可以共用下面的 `game.*` API 安装逻辑。
 */
interface SafFsPlugin extends NativeFileSystem {
	hasAccess(): Promise<NativeAccessResult>;
	requestAccess(): Promise<NativeAccessResult>;
}

const SafFs = registerPlugin<SafFsPlugin>("SafFs");

/** 取得当前平台的文件系统实现；不支持的平台直接抛错，避免出现「能启动但存不了档」的中间态 */
async function resolveFileSystem(platform: string): Promise<NativeFileSystem> {
	switch (platform) {
		case "android": {
			// Android 走 SAF：需要用户先授权一个可写目录（游戏资源 + 存档都在其中）
			let access = await SafFs.hasAccess();
			if (!access.granted) {
				access = await SafFs.requestAccess();
			}
			if (!access.granted) {
				throw new Error("未授权游戏目录");
			}
			return SafFs;
		}

		case "ios":
			// iOS 是沙盒机制，没有「让用户选目录」的概念，无需授权流程；
			// 内置资源与 Documents 可写目录由实现层自行处理，详见 `fs/ios.ts`。
			return createIosFileSystem();

		default:
			throw new Error(`暂不支持的平台: ${platform}`);
	}
}

/**
 * 隐藏系统栏（状态栏 + 导航栏）。
 *
 * 说明（Android）：Android 15/16 对 targetSdk 35+ 的应用强制 edge-to-edge：WebView 铺满整个屏幕，
 * 系统栏以浮层形式盖在页面之上，并且会吞掉所在区域的触摸事件。游戏顶部那一带
 * 正好放着 `#system` 系统按钮（选项/整理手牌/收藏）和选项菜单的标签栏
 * （开始/选项/武将/卡牌/扩展/其它），于是按钮的上半截点不动。
 *
 * 旧 Cordova 端默认就是隐藏状态栏的（`show_statusbar_android` 默认 false），
 * Capacitor 端丢了 cordova-plugin-statusbar 后没有等价实现，这里补回来。
 *
 * 说明（iOS）：`SystemBars` 在 iOS 上同样生效，隐藏后 WebView 铺满整屏，
 * 与 Android 行为保持一致，也顺带解决「顶部标签栏被系统栏遮挡/吃掉触摸」的问题。
 */
async function hideSystemBars() {
	try {
		await SystemBars.hide();
	} catch {
		// 插件不可用（例如桌面浏览器调试）时忽略，不影响游戏启动
	}
}

export default async function preload({ lib, game, ui }) {
	lib.path = (await import("path-browserify-esm")).default;

	const platform = Capacitor.getPlatform();
	const fs = await resolveFileSystem(platform);

	// 尽早隐藏系统栏，避免启动时状态栏先闪一下；
	// 同时在应用恢复时再隐藏一次（例如刚关闭 SAF 目录授权对话框时）。
	await hideSystemBars();
	App.addListener("resume", hideSystemBars).catch(() => {});

	// 校验核心脚本可读，尽早暴露「资源没同步进来」这类构建问题
	const rootCheck = await fs.checkFile({ fileName: "noname.js" });
	if (rootCheck.type !== "file") {
		throw new Error("游戏资源缺失: noname.js");
	}

	// 各平台通用的文件读写 API（checkFile / readFile / writeFile / getFileList ...）
	attachFileSystemAPI(game, fs);

	// iOS 侧载包为控制体积未内置武将原画与语音（见 ios-build.yml 的 slim_assets），
	// 这里在「菜单 → 其它 → 更新」里补一个下载入口，把资源从上游仓库拉进可写目录。
	// 必须在 attachFileSystemAPI 之后安装，因为它依赖 game.writeFile。
	// 注意：安装时机早于 boot()，而菜单是在 boot() 阶段才构建的，因此包裹一定会被用到。
	installAssetDownloader({ lib, game, ui });

	// 以下三项依赖具体运行容器，不适合同步进文件系统适配层

	game.export = function (data: string | Blob, name?: string) {
		const fileName = sanitizeExportName(name);
		const blob = typeof data === "string" ? new Blob([data], { type: "text/plain" }) : data;

		game.writeFile(blob, "export", fileName, (error?: unknown) => {
			if (error) {
				alert(`文件导出失败: ${error instanceof Error ? error.message : String(error)}`);
			} else {
				alert(`文件已导出至游戏目录/export/${fileName}`);
			}
		});
	};

	game.exit = function () {
		App.exitApp();
	};

	game.open = function (url: string) {
		// Capacitor 的 WebView 不接管 window.open 的「新窗口」语义，
		// 在 iOS 上表现为静默失败，因此改为同窗口导航后由系统决定是否外跳。
		if (platform === "ios") {
			window.location.href = url;
			return;
		}
		window.open(url);
	};
}
