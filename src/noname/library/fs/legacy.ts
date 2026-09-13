import { FileSystemError, FileSystemErrorCode } from "./errors";
import type { FileSystem } from "./index";

export type LegacyWriteData = string | Blob | ArrayBuffer | ArrayBufferView;

export interface LegacyFileSystemGame {
	checkFile?: (
		fileName: string,
		callback?: (result: -1 | 0 | 1) => void,
		onerror?: (error: Error) => void
	) => void;
	checkDir?: (
		directory: string,
		callback?: (result: -1 | 0 | 1) => void,
		onerror?: (error: Error) => void
	) => void;
	readFile?: (
		fileName: string,
		callback?: (data: ArrayBuffer) => unknown,
		onerror?: (error: Error) => void
	) => void;
	readFileAsText?: (
		fileName: string,
		callback?: (data: string) => unknown,
		onerror?: (error: Error) => void
	) => void;
	writeFile?: (
		data: LegacyWriteData,
		path: string,
		name: string,
		callback?: (error?: unknown) => void
	) => void;
	removeFile?: (
		fileName: string,
		callback?: (error?: unknown) => void,
		onerror?: (error: Error) => void
	) => void;
	getFileList?: (
		directory: string,
		callback?: (folders: string[], files: string[]) => unknown,
		onerror?: (error: Error) => void
	) => void;
	ensureDirectory?: (paths: string | string[], callback?: () => void, file?: boolean) => void;
	createDir?: (directory: string, successCallback?: () => void, errorCallback?: (error: Error) => void) => void;
	removeDir?: (directory: string, successCallback?: () => void, errorCallback?: (error: Error) => void) => void;
}

/**
 * 基于统一文件系统接口安装历史 `game.*` 文件 API。
 *
 * 平台初始化代码只负责提供 FileSystemAdapter；这里不得依赖任何平台适配器的私有能力。
 */
export function installLegacyFileSystemAPI(game: LegacyFileSystemGame, fileSystem: FileSystem) {
	game.checkFile = function checkFile(fileName, callback, onerror) {
		checkPathType(fileSystem, fileName, "file", callback, onerror);
	};

	game.checkDir = function checkDir(dir, callback, onerror) {
		checkPathType(fileSystem, dir, "directory", callback, onerror);
	};

	game.readFile = function readFile(fileName, callback = () => {}, onerror = () => {}) {
		fileSystem.read(fileName).then(data => callback(toExactArrayBuffer(data)), onerror);
	};

	game.readFileAsText = function readFileAsText(fileName, callback = () => {}, onerror = () => {}) {
		fileSystem.readText(fileName).then(callback, onerror);
	};

	game.writeFile = function writeFile(data: LegacyWriteData, path, name, callback = () => {}) {
		const filePath = path === "" || path.endsWith("/") ? path + name : `${path}/${name}`;
		fileSystem
			.createDir(path, { recursive: true })
			.then(() => toUint8Array(data, filePath))
			.then(bytes => fileSystem.write(filePath, bytes))
			.then(() => callback(), callback);
	};

	game.removeFile = function removeFile(fileName, callback, onerror = () => {}) {
		const operation = fileSystem.stat(fileName).then(info => {
			if (info === null) {
				throw createLegacyError(FileSystemErrorCode.NotFound, fileName, "File does not exist");
			}
			if (info.type !== "file") {
				throw createLegacyError(FileSystemErrorCode.NotFile, fileName, "Path is not a file");
			}
			return fileSystem.remove(fileName);
		});

		if (typeof callback === "function") {
			operation.then(() => callback(), callback);
		} else {
			operation.then(undefined, onerror);
		}
	};

	game.getFileList = function getFileList(dir, callback = () => {}, onerror) {
		fileSystem.list(dir).then(
			entries => {
				const folders: string[] = [];
				const files: string[] = [];
				for (const entry of entries) {
					if (entry.type === "directory") {
						folders.push(entry.name);
					} else if (entry.type === "file") {
						files.push(entry.name);
					}
				}
				callback(folders, files);
			},
			error => handleLegacyError(error, onerror)
		);
	};

	game.ensureDirectory = function ensureDirectory(list, callback = () => {}, file = false) {
		let pathArray = typeof list === "string" ? list.split("/") : list;
		if (file) {
			pathArray = pathArray.slice(0, -1);
		}
		fileSystem.createDir(pathArray.join("/"), { recursive: true }).then(callback, console.error);
	};

	game.createDir = function createDir(directory, successCallback = () => {}, errorCallback = () => {}) {
		fileSystem.createDir(directory, { recursive: true }).then(successCallback, errorCallback);
	};

	game.removeDir = function removeDir(directory, successCallback = () => {}, errorCallback = () => {}) {
		fileSystem
			.stat(directory)
			.then(info => {
				if (info === null) {
					throw createLegacyError(FileSystemErrorCode.NotFound, directory, "Directory does not exist");
				}
				if (info.type !== "directory") {
					throw createLegacyError(FileSystemErrorCode.NotDirectory, directory, "Path is not a directory");
				}
				return fileSystem.remove(directory, { recursive: true });
			})
			.then(successCallback, errorCallback);
	};
}

function checkPathType(
	fileSystem: FileSystem,
	path: string,
	expectedType: "file" | "directory",
	callback?: (result: -1 | 0 | 1) => void,
	onerror?: (error: Error) => void
) {
	fileSystem.stat(path).then(
		info => callback?.(info === null ? -1 : info.type === expectedType ? 1 : 0),
		error => handleLegacyError(error, onerror)
	);
}

function toExactArrayBuffer(data: Uint8Array): ArrayBuffer {
	return data.byteOffset === 0 && data.byteLength === data.buffer.byteLength && data.buffer instanceof ArrayBuffer
		? data.buffer
		: new Uint8Array(data).buffer;
}

async function toUint8Array(data: LegacyWriteData, path: string): Promise<Uint8Array> {
	try {
		if (typeof data === "string") {
			return new TextEncoder().encode(data);
		}
		if (isBlob(data)) {
			return new Uint8Array(await data.arrayBuffer());
		}
		if (data instanceof Uint8Array) {
			return data;
		}
		if (data instanceof ArrayBuffer) {
			return new Uint8Array(data);
		}
		if (ArrayBuffer.isView(data)) {
			return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
		}
	} catch (error) {
		throw createLegacyError(FileSystemErrorCode.IoError, path, "Failed to convert write data", error);
	}

	throw createLegacyError(FileSystemErrorCode.IoError, path, "Unsupported write data type");
}

function isBlob(data: unknown): data is Blob {
	const typeTag = Object.prototype.toString.call(data);
	return (
		(typeTag === "[object Blob]" || typeTag === "[object File]") &&
		typeof (data as Blob).arrayBuffer === "function"
	);
}

function handleLegacyError(error: unknown, callback?: (error: Error) => void) {
	if (typeof callback === "function") {
		callback(error as Error);
	}
}

function createLegacyError(code: FileSystemErrorCode, path: string, detail: string, cause?: unknown) {
	return new FileSystemError(code, path, {
		cause: cause instanceof Error ? cause : new Error(detail),
		detail,
	});
}
