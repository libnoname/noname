import { App } from "@capacitor/app";
import { Capacitor, SystemBars } from "@capacitor/core";

import { sanitizeExportName, type MinimalFileSystem } from "./platform/general";
import { initializeAndroid, attachAndroidFileSystem } from "./platform/android";
import { initializeIos, attachIosFileSystem } from "./platform/ios";

export default async function preload({ lib, game }) {
	lib.path = (await import("path-browserify-esm")).default;

	await hideSystemBars();
	App.addListener("resume", hideSystemBars).catch(() => {});

	const platform = Capacitor.getPlatform();
	const { fs } = await resolveFileSystem(platform);
	const rootCheck = await fs.statEntry({ entryName: "noname.js" });
	if (rootCheck.type !== "file") {
		throw new Error("游戏资源缺失: noname.js");
	}
	attachFileSystemAPI(game, platform);

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
		// iOS 不允许程序内退出应用，Capacitor 的 iOS 实现会以 "not implemented" 拒绝，
		// 直接调用会变成未处理的 Promise 拒绝并弹出错误框；这里退化为返回主菜单。
		if (platform === "ios") {
			game.reload();
			return;
		}
		App.exitApp().catch(error => {
			console.warn("退出应用失败", error);
		});
	};

	game.open = function (url: string) {
		if (platform === "ios") {
			window.location.href = url;
			return;
		}
		window.open(url);
	};
}

async function hideSystemBars() {
	try {
		await SystemBars.hide();
	} catch {}
}

function resolveFileSystem(platform: string) {
	switch (platform) {
		case "android":
			return initializeAndroid();

		case "ios":
			return initializeIos();

		default:
			throw new Error(`暂不支持的平台: ${platform}`);
	}
}

function attachFileSystemAPI(game: any, platform: string) {
	switch (platform) {
		case "android":
			attachAndroidFileSystem(game);
			break;
		
		case "ios":
			attachIosFileSystem(game);
			break;
	}
}
