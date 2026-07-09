import { App } from "@capacitor/app";
import { Capacitor, registerPlugin } from "@capacitor/core";

interface SafFsAccessResult {
	granted: boolean;
	rootUri?: string;
}

interface SafFsCheckResult {
	type: "file" | "directory" | "none";
}

interface SafFsReadResult {
	data: string;
}

interface SafFsListResult {
	folders: string[];
	files: string[];
}

interface SafFsPlugin {
	hasAccess(): Promise<SafFsAccessResult>;
	requestAccess(): Promise<SafFsAccessResult>;
	checkFile(options: { fileName: string }): Promise<SafFsCheckResult>;
	checkDir(options: { dir: string }): Promise<SafFsCheckResult>;
	readFile(options: { fileName: string }): Promise<SafFsReadResult>;
	readFileAsText(options: { fileName: string }): Promise<SafFsReadResult>;
	writeFile(options: { path: string; data: string }): Promise<{ success: boolean }>;
	removeFile(options: { fileName: string }): Promise<{ success: boolean }>;
	getFileList(options: { dir: string }): Promise<SafFsListResult>;
	createDir(options: { dir: string }): Promise<{ success: boolean }>;
	removeDir(options: { dir: string }): Promise<{ success: boolean }>;
}

const SafFs = registerPlugin<SafFsPlugin>("SafFs");

function sanitizeExportName(name?: string) {
	return (name || "noname").replace(/\\|\/|:|\?|"|\*|<|>|\|/g, "-");
}

function joinFilePath(path: string, name: string) {
	if (path.endsWith("/") || path == "") return `${path}${name}`;
	return `${path}/${name}`;
}

function base64ToArrayBuffer(base64: string) {
	const binary = atob(base64);
	const buffer = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		buffer[i] = binary.charCodeAt(i);
	}
	return buffer.buffer;
}

function bytesToBase64(bytes: Uint8Array) {
	let binary = "";
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		const chunk = bytes.subarray(i, i + chunkSize);
		binary += String.fromCharCode(...chunk);
	}
	return btoa(binary);
}

async function dataToBase64(data: string | ArrayBuffer | ArrayBufferView | Blob) {
	if (typeof data == "string") {
		return bytesToBase64(new TextEncoder().encode(data));
	}

	if (data instanceof Blob) {
		return bytesToBase64(new Uint8Array(await data.arrayBuffer()));
	}

	if (ArrayBuffer.isView(data)) {
		return bytesToBase64(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
	}

	return bytesToBase64(new Uint8Array(data));
}

function callbackError(callback: Function | undefined, error: unknown) {
	if (typeof callback == "function") {
		callback(error instanceof Error ? error : new Error(String(error)));
	}
}

export default async function preload({ lib, game }) {
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

	const rootCheck = await SafFs.checkFile({ fileName: "noname.js" });
	if (rootCheck.type !== "file") {
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

	game.checkFile = function checkFile(
		fileName: string,
		callback?: (result: -1 | 0 | 1) => void,
		onerror?: (err: Error) => void
	) {
		SafFs.checkFile({ fileName })
			.then(result => {
				switch (result.type) {
					case "file":
						callback?.(1);
						break;
					case "directory":
						callback?.(0);
						break;
					default:
						callback?.(-1);
						break;
				}
			})
			.catch(error => callbackError(onerror, error));
	};

	game.checkDir = function checkDir(
		dir: string,
		callback?: (result: -1 | 0 | 1) => void,
		onerror?: (err: Error) => void
	) {
		SafFs.checkDir({ dir })
			.then(result => {
				switch (result.type) {
					case "file":
						callback?.(0);
						break;
					case "directory":
						callback?.(1);
						break;
					default:
						callback?.(-1);
						break;
				}
			})
			.catch(error => callbackError(onerror, error));
	};

	game.readFile = function readFile(
		fileName: string,
		callback: (data: ArrayBuffer) => void = () => {},
		onerror: (err: Error) => void = () => {}
	) {
		SafFs.readFile({ fileName })
			.then(result => callback(base64ToArrayBuffer(result.data)))
			.catch(error => callbackError(onerror, error));
	};

	game.readFileAsText = function readFileAsText(
		fileName: string,
		callback: (data: string) => void = () => {},
		onerror: (err: Error) => void = () => {}
	) {
		SafFs.readFileAsText({ fileName })
			.then(result => callback(result.data))
			.catch(error => callbackError(onerror, error));
	};

	game.writeFile = function writeFile(
		data: string | ArrayBuffer | ArrayBufferView | Blob,
		path: string,
		name: string,
		callback: (error?: unknown) => void = () => {}
	) {
		game.ensureDirectory(path, async () => {
			try {
				await SafFs.writeFile({
					path: joinFilePath(path, name),
					data: await dataToBase64(data),
				});
				callback();
			} catch (error) {
				callback(error);
			}
		});
	};

	game.removeFile = function removeFile(
		fileName: string,
		callback: (error?: unknown) => void = () => {},
		error: (err: Error) => void = () => {}
	) {
		SafFs.removeFile({ fileName })
			.then(() => callback())
			.catch(err => {
				callback(err);
				callbackError(error, err);
			});
	};

	game.getFileList = function getFileList(
		dir: string,
		callback: (folders: string[], files: string[]) => void = () => {},
		onerror?: (err: Error) => void
	) {
		SafFs.getFileList({ dir })
			.then(result => callback(result.folders, result.files))
			.catch(error => callbackError(onerror, error));
	};

	game.ensureDirectory = function ensureDirectory(
		list: string | string[],
		callback: () => void = () => {},
		file = false
	) {
		let pathArray = typeof list == "string" ? list.split("/") : list;
		if (file) {
			pathArray = pathArray.slice(0, -1);
		}
		game.createDir(pathArray.join("/"), callback, console.error);
	};

	game.createDir = function createDir(
		directory: string,
		successCallback: () => void = () => {},
		errorCallback: (err: Error) => void = () => {}
	) {
		SafFs.createDir({ dir: directory })
			.then(() => successCallback())
			.catch(error => callbackError(errorCallback, error));
	};

	game.removeDir = function removeDir(
		directory: string,
		successCallback: () => void = () => {},
		errorCallback: (err: Error) => void = () => {}
	) {
		SafFs.removeDir({ dir: directory })
			.then(() => successCallback())
			.catch(error => callbackError(errorCallback, error));
	};
}
