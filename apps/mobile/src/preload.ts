import { App } from "@capacitor/app";
import { Capacitor, SystemBars } from "@capacitor/core";
import { installMobileFileSystem } from "./fs-bootstrap";
import { SafFs } from "./fs";

function sanitizeExportName(name?: string) {
	return (name || "noname").replace(/\\|\/|:|\?|"|\*|<|>|\|/g, "-");
}

/**
 * 隐藏安卓系统栏（状态栏 + 导航栏）。
 *
 * 安卓 15/16 对 targetSdk 35+ 的应用强制 edge-to-edge：WebView 铺满整个屏幕，
 * 系统栏以浮层形式盖在页面之上，并且会吞掉所在区域的触摸事件。游戏顶部那一带
 * 正好放着 `#system` 系统按钮（选项/整理手牌/收藏）和选项菜单的标签栏
 * （开始/选项/武将/卡牌/扩展/其它），于是按钮的上半截点不动。
 *
 * 旧 Cordova 端默认就是隐藏状态栏的（`show_statusbar_android` 默认 false），
 * Capacitor 端丢了 cordova-plugin-statusbar 后没有等价实现，这里补回来。
 */
async function hideSystemBars() {
	try {
		await SystemBars.hide();
	} catch {
		// 插件不可用（例如非安卓环境）时忽略，不影响游戏启动
	}
}

export default async function preload({ lib, game, fsBootstrap }) {
	lib.path = (await import("path-browserify-esm")).default;

	if (Capacitor.getPlatform() !== "android") {
		throw new Error("移动端 SAF 文件系统仅支持 Android");
	}

	// 尽早隐藏系统栏，避免启动时状态栏先闪一下；
	// 同时在 Activity 恢复时再隐藏一次（例如刚关闭 SAF 目录授权对话框时）。
	await hideSystemBars();
	App.addListener("resume", hideSystemBars).catch(() => {});

	let access = await SafFs.hasAccess();
	if (!access.granted) {
		access = await SafFs.requestAccess();
	}
	if (!access.granted) {
		throw new Error("未授权游戏目录");
	}

	const fileSystem = installMobileFileSystem(fsBootstrap);
	if (!(await fileSystem.isFile("noname.js"))) {
		throw new Error("游戏资源缺失: noname.js");
	}

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
		window.open(url);
	};
}
