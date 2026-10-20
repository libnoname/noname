/**
 * 把平台原生的文件系统实现映射为游戏所需的 `game.*` 老 API。
 *
 * 游戏核心早已把「路径操作」抽象成 `apps/core/noname/library/fs` 下的 `FileSystemAdapter`，
 * 但移动端走的是历史上的 `preload.js` 约定：平台初始化脚本需要直接在 `game` 对象上
 * 挂载 `checkFile` / `readFile` / `writeFile` 等一系列回调风格的函数。
 *
 * 本文件把「回调风格」与「Promise 风格」的转换集中在一处实现，
 * 各平台（Android / iOS）只需要提供 `NativeFileSystem`，不必重复这段映射逻辑。
 */

import {
	type NativeFileSystem,
	base64ToArrayBuffer,
	callbackError,
	joinFilePath,
	writeDataToBase64,
} from "./types.js";

/** 游戏侧可被挂载文件 API 的最小对象形状 */
export interface FileApiTarget {
	export?: (data: string | Blob, name?: string) => void;
	exit?: () => void;
	open?: (url: string) => void;

	checkFile?: (fileName: string, callback?: (result: -1 | 0 | 1) => void, onerror?: (err: Error) => void) => void;
	checkDir?: (dir: string, callback?: (result: -1 | 0 | 1) => void, onerror?: (err: Error) => void) => void;
	readFile?: (fileName: string, callback?: (data: ArrayBuffer) => void, onerror?: (err: Error) => void) => void;
	readFileAsText?: (fileName: string, callback?: (data: string) => void, onerror?: (err: Error) => void) => void;
	writeFile?: (
		data: string | ArrayBuffer | ArrayBufferView | Blob,
		path: string,
		name: string,
		callback?: (error?: unknown) => void
	) => void;
	removeFile?: (fileName: string, callback?: (error?: unknown) => void, onerror?: (err: Error) => void) => void;
	getFileList?: (dir: string, callback?: (folders: string[], files: string[]) => void, onerror?: (err: Error) => void) => void;
	ensureDirectory?: (list: string | string[], callback?: () => void, file?: boolean) => void;
	createDir?: (directory: string, successCallback?: () => void, errorCallback?: (error: Error) => void) => void;
	removeDir?: (directory: string, successCallback?: () => void, errorCallback?: (error: Error) => void) => void;
}

/** 回调中的三态返回值，与历史实现保持一致 */
const ENTRY_FILE = 1;
const ENTRY_DIRECTORY = 0;
const ENTRY_NONE = -1;

/**
 * 在 `game` 对象上安装文件系统 API。
 *
 * @param game 游戏核心对象
 * @param native 平台原生文件系统实现
 */
export function attachFileSystemAPI(game: FileApiTarget, native: NativeFileSystem): void {
	game.checkFile = function checkFile(fileName, callback, onerror) {
		native
			.checkFile({ fileName })
			.then(result => callback?.(toTriState(result.type, "file")))
			.catch(error => callbackError(onerror, error));
	};

	game.checkDir = function checkDir(dir, callback, onerror) {
		native
			.checkDir({ dir })
			.then(result => callback?.(toTriState(result.type, "directory")))
			.catch(error => callbackError(onerror, error));
	};

	game.readFile = function readFile(fileName, callback = () => {}, onerror = () => {}) {
		native
			.readFile({ fileName })
			.then(result => callback(base64ToArrayBuffer(result.data)))
			.catch(error => callbackError(onerror, error));
	};

	game.readFileAsText = function readFileAsText(fileName, callback = () => {}, onerror = () => {}) {
		native
			.readFileAsText({ fileName })
			.then(result => callback(result.data))
			.catch(error => callbackError(onerror, error));
	};

	game.writeFile = function writeFile(data, path, name, callback = () => {}) {
		// 先确保父目录存在，再写入；两步都失败时统一回调同一个错误
		game.ensureDirectory?.(path, async () => {
			try {
				await native.writeFile({
					path: joinFilePath(path, name),
					data: await writeDataToBase64(data),
				});
				callback();
			} catch (error) {
				callback(error);
			}
		});
	};

	game.removeFile = function removeFile(fileName, callback = () => {}, onerror = () => {}) {
		native
			.removeFile({ fileName })
			.then(() => callback())
			.catch(error => {
				callback(error);
				callbackError(onerror, error);
			});
	};

	game.getFileList = function getFileList(dir, callback = () => {}, onerror) {
		native
			.getFileList({ dir })
			.then(result => callback(result.folders, result.files))
			.catch(error => callbackError(onerror, error));
	};

	game.ensureDirectory = function ensureDirectory(list, callback = () => {}, file = false) {
		let pathArray = typeof list == "string" ? list.split("/") : list;
		if (file) {
			// 传入的是文件路径时，去掉最后一段文件名
			pathArray = pathArray.slice(0, -1);
		}
		game.createDir?.(pathArray.join("/"), callback, console.error);
	};

	game.createDir = function createDir(directory, successCallback = () => {}, errorCallback = console.error) {
		native
			.createDir({ dir: directory })
			.then(() => successCallback())
			.catch(error => callbackError(errorCallback, error));
	};

	game.removeDir = function removeDir(directory, successCallback = () => {}, errorCallback = console.error) {
		native
			.removeDir({ dir: directory })
			.then(() => successCallback())
			.catch(error => callbackError(errorCallback, error));
	};
}

/** 把原生返回的路径类型转换成回调需要的三态值 */
function toTriState(type: "file" | "directory" | "none", expected: "file" | "directory"): -1 | 0 | 1 {
	if (type === "none") {
		return ENTRY_NONE;
	}
	return type === expected ? ENTRY_FILE : ENTRY_DIRECTORY;
}

export { ENTRY_NONE, ENTRY_DIRECTORY, ENTRY_FILE };
