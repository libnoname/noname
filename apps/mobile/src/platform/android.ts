import { registerPlugin } from "@capacitor/core";
import { joinFilePath, dataToBase64, base64ToArrayBuffer, toTriState, callbackError, type EntryType, type MinimalFileSystem } from "./general";

interface AccessResult {
	granted: boolean;
	rootUri?: string;
}
interface SafFsPlugin extends MinimalFileSystem {
	readFile(options: { fileName: string }): Promise<{ data: string }>;
	readFileAsText(options: { fileName: string }): Promise<{ data: string }>;
	writeFile(options: { path: string; data: string }): Promise<void>;
	removeFile(options: { fileName: string }): Promise<void>;
	getFileList(options: { dir: string }): Promise<{
		folders: string[];
		files: string[];
	}>;
	createDir(options: { dir: string }): Promise<void>;
	removeDir(options: { dir: string }): Promise<void>;

	hasAccess(): Promise<AccessResult>;
	requestAccess(): Promise<AccessResult>;
}

let fs: SafFsPlugin;

export async function initializeAndroid(): Promise<MinimalFileSystem> {
	fs = registerPlugin<SafFsPlugin>("SafFs");
	let access = await fs.hasAccess();
	if (!access.granted) {
		access = await fs.requestAccess();
	}
	if (!access.granted) {
		throw new Error("未授权游戏目录");
	}
	return fs;
}

export function attachAndroidFileSystem(game: any): void {
	game.checkFile = function checkFile(fileName, callback, onerror) {
		fs
			.statEntry({ entryName: fileName })
			.then(result => callback?.(toTriState(result.type, "file")))
			.catch(error => callbackError(onerror, error));
	};

	game.checkDir = function checkDir(dir, callback, onerror) {
		fs
			.statEntry({ entryName: dir })
			.then(result => callback?.(toTriState(result.type, "directory")))
			.catch(error => callbackError(onerror, error));
	};

	game.readFile = function readFile(fileName, callback = (_: any) => {}, onerror = () => {}) {
		fs
			.readFile({ fileName })
			.then(result => callback(base64ToArrayBuffer(result.data)))
			.catch(error => callbackError(onerror, error));
	};

	game.readFileAsText = function readFileAsText(fileName, callback = (_: any) => {}, onerror = () => {}) {
		fs
			.readFileAsText({ fileName })
			.then(result => callback(result.data))
			.catch(error => callbackError(onerror, error));
	};

	game.writeFile = function writeFile(data, path, name, callback = () => {}) {
		fs
			.createDir({ dir: path })
			.then(async () => {
				await fs.writeFile({
					path: joinFilePath(path, name),
					data: await dataToBase64(data),
				});
			})
			.then(() => callback(), callback);
	};

	game.removeFile = function removeFile(fileName, callback = (_?: any) => {}, onerror = () => {}) {
		fs
			.removeFile({ fileName })
			.then(() => callback())
			.catch(error => {
				callback(error);
				callbackError(onerror, error);
			});
	};

	game.getFileList = function getFileList(dir, callback = (_folders: any, _files: any) => {}, onerror) {
		fs
			.getFileList({ dir })
			.then(result => callback(result.folders, result.files))
			.catch(error => callbackError(onerror, error));
	};

	game.ensureDirectory = function ensureDirectory(list, callback = () => {}, file = false) {
		let pathArray = typeof list == "string" ? list.split("/") : list;
		if (file) {
			pathArray = pathArray.slice(0, -1);
		}
		game.createDir?.(pathArray.join("/"), callback, console.error);
	};

	game.createDir = function createDir(directory, successCallback = () => {}, errorCallback = console.error) {
		fs
			.createDir({ dir: directory })
			.then(() => successCallback())
			.catch(error => callbackError(errorCallback, error));
	};

	game.removeDir = function removeDir(directory, successCallback = () => {}, errorCallback = console.error) {
		fs
			.removeDir({ dir: directory })
			.then(() => successCallback())
			.catch(error => callbackError(errorCallback, error));
	};
}
