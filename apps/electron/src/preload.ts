// @ts-nocheck

import { installElectronFileSystem } from "./fs-bootstrap";

export default async function preload({ lib, game, get, _status, ui, ai, fsBootstrap }) {
	let nodeRequire = window.require;
	if (typeof nodeRequire !== "function") {
		throw new Error("Electron preload requires window.require");
	}

	const nodeProcess = window.process;
	const nodePath = nodeRequire("path");
	const nodeFs = nodeRequire("fs");
	let dirname = typeof window.__dirname === "string" ? window.__dirname : nodePath.resolve();

	// 处理 Node 环境下的 http 情况
	if (typeof nodeProcess === "object" && dirname) {
		// 在 http 环境下修改 __dirname 和 require 的逻辑
		if (dirname.endsWith("electron.asar\\renderer") || dirname.endsWith("electron.asar/renderer")) {
			if (nodeProcess.platform === "darwin") {
				dirname = nodePath.join(nodeProcess.resourcesPath, "app");
			} else {
				dirname = nodePath.join(nodePath.resolve(), "resources/app");
			}
			window.__dirname = dirname;

			const oldRequire = nodeRequire;
			nodeRequire = function (moduleId) {
				try {
					return oldRequire(moduleId);
				} catch {
					return oldRequire(nodePath.join(dirname, moduleId));
				}
			};
			Object.entries(oldRequire).forEach(([key, value]) => {
				nodeRequire[key] = value;
			});
			window.require = nodeRequire;
		}
	}

	const versions = nodeProcess.versions;
	const electronVersion = parseFloat(versions.electron);
	lib.node = {
		fs: nodeFs,
		path: nodePath,
		debug() {
			let remote;
			if (electronVersion >= 14) {
				remote = nodeRequire("@electron/remote");
			} else {
				remote = nodeRequire("electron").remote;
			}
			remote.getCurrentWindow().toggleDevTools();
		},
	};
	lib.path = lib.node.path;

	installElectronFileSystem(dirname, fsBootstrap, nodeRequire);

	game.download = function (url, folder, onsuccess, onerror, dev, onprogress) {
		if (!url.startsWith("http")) {
			url = get.url(dev) + url;
		}
		game.ensureDirectory(
			folder,
			function () {
				let file;
				try {
					file = lib.node.fs.createWriteStream(`${dirname}/${folder}`);
				} catch (e) {
					onerror?.(e);
					return;
				}
				lib.config.brokenFile.add(folder);
				game.saveConfigValue("brokenFile");
				if (!lib.node.http) {
					lib.node.http = nodeRequire("http");
				}
				if (!lib.node.https) {
					lib.node.https = nodeRequire("https");
				}
				const opts = nodeRequire("url").parse(encodeURI(url));
				opts.headers = { "User-Agent": "AppleWebkit" };
				const request = (url.startsWith("https") ? lib.node.https : lib.node.http).get(opts, response => {
					const stream = response.pipe(file);
					stream.on("finish", function () {
						lib.config.brokenFile.remove(folder);
						game.saveConfigValue("brokenFile");
						if (onsuccess) {
							onsuccess();
						}
					});
					stream.on("error", onerror || (() => {}));
					if (onprogress) {
						const streamInterval = setInterval(function () {
							if (stream.closed) {
								clearInterval(streamInterval);
							} else {
								onprogress(stream.bytesWritten);
							}
						}, 200);
					}
				});
				request.on("error", onerror || (() => {}));
			},
			true
		);
	};

	game.export = function (data, name) {
		if (typeof data === "string") {
			data = new Blob([data], { type: "text/plain" });
		}
		let fileNameToSaveAs = name || "noname";
		fileNameToSaveAs = fileNameToSaveAs.replace(/\\|\/|:|\?|"|\*|<|>|\|/g, "-");

		const downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		downloadLink.href = window.URL.createObjectURL(data);
		downloadLink.click();
	};

	game.exit = function () {
		const versions = nodeProcess.versions;
		const electronVersion = parseFloat(versions.electron);
		let remote;
		if (electronVersion >= 14) {
			remote = nodeRequire("@electron/remote");
		} else {
			remote = nodeRequire("electron").remote;
		}
		const thisWindow = remote.getCurrentWindow();
		thisWindow.destroy();
		nodeProcess.exit();
	};

	game.open = function (url) {
		window.open(url);
	};

	if (ui.updateUpdate) {
		ui.updateUpdate();
	}
}
