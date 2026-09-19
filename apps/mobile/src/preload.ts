import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { installMobileFileSystem } from "./fs-bootstrap";
import { SafFs } from "./fs";

function sanitizeExportName(name?: string) {
	return (name || "noname").replace(/\\|\/|:|\?|"|\*|<|>|\|/g, "-");
}

export default async function preload({ lib, game, fsBootstrap }) {
	lib.path = (await import("path-browserify-esm")).default;

	if (Capacitor.getPlatform() !== "android") {
		throw new Error("移动端 SAF 文件系统仅支持 Android");
	}

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
