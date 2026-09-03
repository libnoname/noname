//@ts-nocheck
import { FileSystem, FileSystemError, FileSystemErrorCode } from "@/library/fs";

/**
 * @typedef { import("@/library/fs").FileSystemAdapter } FileSystemAdapter
 * @typedef { import("@/library/fs").FileHandle } FileHandle
 * @typedef { import("@/library/fs").FileInfo } FileInfo
 * @typedef { import("@/library/fs").OpenOptions } OpenOptions
 */

export default async function browserReady({ lib, game }) {
	lib.path = (await import("path-browserify-esm")).default;
	lib.fs = new FileSystem(new BrowserAdapter());

	try {
		await lib.fs.stat("noname.js");
	} catch (e) {
		console.error("文件读写函数初始化失败:", e);
		return;
	}

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
		window.onbeforeunload = null;
		window.close();
	};

	game.open = function (url) {
		window.open(url);
	};

	/**
	 * 检查指定的路径是否是一个文件
	 *
	 * @param {string} fileName - 需要查询的路径
	 * @param {(result: -1 | 0 | 1) => void} [callback] - 回调函数；接受的参数意义如下:
	 *  - `-1`: 路径不存在或无法访问
	 *  - `0`: 路径的内容不是文件
	 *  - `1`: 路径的内容是文件
	 * @param {(err: Error) => void} [onerror] - 接收错误的回调函数
	 * @return {void} - 由于三端的异步需求和历史原因，文件管理必须为回调异步函数
	 */
	game.checkFile = function checkFile(fileName, callback, onerror) {
		lib.fs.stat(fileName).then(
			info => callback?.(info === null ? -1 : info.type === "file" ? 1 : 0),
			error => handleLegacyError(error, onerror)
		);
	};

	/**
	 * 检查指定的路径是否是一个目录
	 *
	 * @param {string} dir - 需要查询的路径
	 * @param {(result: -1 | 0 | 1) => void} [callback] - 回调函数；接受的参数意义如下:
	 *  - `-1`: 路径不存在或无法访问
	 *  - `0`: 路径的内容不是目录
	 *  - `1`: 路径的内容是目录
	 * @param {(err: Error) => void} [onerror] - 接收错误的回调函数
	 * @return {void} - 由于三端的异步需求和历史原因，文件管理必须为回调异步函数
	 */
	game.checkDir = function checkDir(dir, callback, onerror) {
		lib.fs.stat(dir).then(
			info => callback?.(info === null ? -1 : info.type === "directory" ? 1 : 0),
			error => handleLegacyError(error, onerror)
		);
	};

	game.readFile = function readFile(fileName, callback = () => {}, error = () => {}) {
		lib.fs.read(fileName).then(data => callback(data.slice().buffer), error);
	};

	game.readFileAsText = function readFileAsText(fileName, callback = () => {}, error = () => {}) {
		lib.fs.readText(fileName).then(callback, error);
	};

	game.writeFile = function writeFile(data, path, name, callback = () => {}) {
		const filePath = path === "" || path.endsWith("/") ? path + name : `${path}/${name}`;
		lib.fs
			.createDir(path, { recursive: true })
			.then(() => toUint8Array(data, filePath))
			.then(bytes => lib.fs.write(filePath, bytes))
			.then(() => callback(), callback);
	};

	game.removeFile = function removeFile(fileName, callback, error = () => {}) {
		const complete = typeof callback === "function" ? callback : error;
		lib.fs
			.stat(fileName)
			.then(info => {
				if (info === null) {
					throw createFileSystemError(FileSystemErrorCode.NotFound, fileName, "File does not exist");
				}
				if (info.type !== "file") {
					throw createFileSystemError(FileSystemErrorCode.NotFile, fileName, "Path is not a file");
				}
				return lib.fs.remove(fileName);
			})
			.then(() => complete(), reason => complete(reason));
	};

	game.getFileList = function getFileList(dir, callback = () => {}, onerror) {
		lib.fs.list(dir).then(
			entries => {
				const folders = [];
				const files = [];
				for (const entry of entries) {
					(entry.type === "directory" ? folders : files).push(entry.name);
				}
				callback(folders, files);
			},
			error => handleLegacyError(error, onerror)
		);
	};

	game.ensureDirectory = function ensureDirectory(list, callback = () => {}, file = false) {
		let pathArray = typeof list == "string" ? list.split("/") : list;
		if (file) {
			pathArray = pathArray.slice(0, -1);
		}
		lib.fs.createDir(pathArray.join("/"), { recursive: true }).then(callback, console.error);
	};

	game.createDir = function createDir(
		directory,
		successCallback = () => {},
		errorCallback = () => {}
	) {
		lib.fs.createDir(directory, { recursive: true }).then(successCallback, errorCallback);
	};
	game.removeDir = function removeDir(
		directory,
		successCallback = () => {},
		errorCallback = () => {}
	) {
		lib.fs
			.stat(directory)
			.then(info => {
				if (info === null) {
					throw createFileSystemError(FileSystemErrorCode.NotFound, directory, "Directory does not exist");
				}
				if (info.type !== "directory") {
					throw createFileSystemError(FileSystemErrorCode.NotDirectory, directory, "Path is not a directory");
				}
				return lib.fs.remove(directory, { recursive: true });
			})
			.then(successCallback, errorCallback);
	};
}

async function toUint8Array(data, path) {
	try {
		if (typeof data === "string") {
			return new TextEncoder().encode(data);
		}
		if (Object.prototype.toString.call(data) === "[object File]") {
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
		throw toFileSystemError(error, path);
	}

	throw createFileSystemError(FileSystemErrorCode.IoError, path, "Unsupported write data type");
}

function handleLegacyError(error, callback) {
	if (typeof callback === "function") {
		callback(error);
	} else {
		console.error(error);
	}
}

/**
 * @implements { FileSystemAdapter }
 */
class BrowserAdapter {
	/**
	 * @param {string} path
	 * @param {OpenOptions} [options]
	 * @returns {Promise<FileHandle>}
	 */
	async open(path, options = {}) {
		assertValidPath(path);

		const append = options.append === true;
		const writable = options.write === true || append;
		const readable = options.read ?? !writable;

		if (!readable && !writable) {
			throw createFileSystemError(FileSystemErrorCode.IoError, path, "open requires read or write access");
		}
		if ((options.create || options.createNew || options.truncate) && !writable) {
			throw createFileSystemError(FileSystemErrorCode.IoError, path, "create, createNew and truncate require write access");
		}

		const info = await this.stat(path);
		if (options.createNew && info !== null) {
			throw createFileSystemError(FileSystemErrorCode.AlreadyExists, path, "Path already exists");
		}
		if (info !== null && info.type !== "file") {
			throw createFileSystemError(FileSystemErrorCode.NotFile, path, "Path is not a file");
		}
		if (info === null) {
			if (!options.create && !options.createNew) {
				throw createFileSystemError(FileSystemErrorCode.NotFound, path, "File does not exist");
			}
			await this.write(path, new Uint8Array());
		} else if (options.truncate) {
			await this.write(path, new Uint8Array());
		}

		return new BrowserFileHandle(this, path, readable, writable, append);
	}

	/**
	 * @param {string} path
	 * @returns {Promise<Uint8Array>}
	 */
	async read(path) {
		assertValidPath(path);
		const data = await requestBackend("/readFile", path, { fileName: path });

		try {
			if (isByteArray(data)) {
				return new Uint8Array(data);
			}
			if (typeof data === "string") {
				if (typeof Uint8Array.fromBase64 === "function") {
					return Uint8Array.fromBase64(data);
				}

				const decoded = atob(data);
				return Uint8Array.from(decoded, character => character.charCodeAt(0));
			}
		} catch (error) {
			throw toFileSystemError(error, path);
		}

		throw createFileSystemError(FileSystemErrorCode.IoError, path, "Invalid readFile response data");
	}

	/**
	 * @param {string} path
	 * @param {Uint8Array} data
	 * @returns {Promise<void>}
	 */
	async write(path, data) {
		assertValidPath(path);
		assertUint8Array(data, path);

		await requestBackend("/writeFile", path, undefined, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ path, data: Array.from(data) }),
		});
	}

	/**
	 * @param {string} path
	 * @returns {Promise<FileInfo | null>}
	 */
	async stat(path) {
		assertValidPath(path);
		const type = await requestBackend("/checkFile", path, { fileName: path });

		if (type === "file" || type === "directory") {
			return { type };
		}
		return null;
	}

	/**
	 * @param {string} path
	 * @returns {Promise<import("@/library/fs").DirEntry[]>}
	 */
	async list(path) {
		assertValidPath(path);
		const data = await requestBackend("/getFileList", path, { dir: path });
		if (!isStringArray(data?.folders) || !isStringArray(data?.files)) {
			throw createFileSystemError(FileSystemErrorCode.IoError, path, "Invalid getFileList response data");
		}

		return [...data.folders.map(name => ({ name, type: "directory" })), ...data.files.map(name => ({ name, type: "file" }))];
	}

	/**
	 * @param {string} path
	 * @param {import("@/library/fs").CreateDirOptions} [options]
	 * @returns {Promise<void>}
	 */
	async createDir(path, options = {}) {
		assertValidPath(path);

		if (!options.recursive) {
			const info = await this.stat(path);
			if (info !== null) {
				throw createFileSystemError(FileSystemErrorCode.AlreadyExists, path, "Path already exists");
			}

			const parentPath = getParentPath(path);
			const parentInfo = await this.stat(parentPath);
			if (parentInfo === null) {
				throw createFileSystemError(FileSystemErrorCode.NotFound, parentPath, "Parent directory does not exist");
			}
			if (parentInfo.type !== "directory") {
				throw createFileSystemError(FileSystemErrorCode.NotDirectory, parentPath, "Parent path is not a directory");
			}
		}

		await requestBackend("/createDir", path, { dir: path });
	}

	/**
	 * @param {string} path
	 * @param {import("@/library/fs").RemoveOptions} [options]
	 * @returns {Promise<void>}
	 */
	async remove(path, options = {}) {
		assertValidPath(path);
		const info = await this.stat(path);
		if (info === null) {
			throw createFileSystemError(FileSystemErrorCode.NotFound, path, "Path does not exist");
		}

		if (info.type === "file") {
			await requestBackend("/removeFile", path, { fileName: path });
			return;
		}

		if (!options.recursive && (await this.list(path)).length > 0) {
			throw createFileSystemError(FileSystemErrorCode.IoError, path, "Directory is not empty");
		}
		await requestBackend("/removeDir", path, { dir: path });
	}
}

/** @implements {FileHandle} */
class BrowserFileHandle {
	constructor(adapter, path, readable, writable, append) {
		this.adapter = adapter;
		this.path = path;
		this.readable = readable;
		this.writable = writable;
		this.append = append;
		this.closed = false;
	}

	async readAll() {
		this.assertOpen();
		if (!this.readable) {
			throw createFileSystemError(FileSystemErrorCode.IoError, this.path, "File is not open for reading");
		}
		return this.adapter.read(this.path);
	}

	async write(data) {
		this.assertWritable();
		assertUint8Array(data, this.path);

		if (!this.append) {
			await this.adapter.write(this.path, data);
			return;
		}

		const current = await this.adapter.read(this.path);
		const combined = new Uint8Array(current.length + data.length);
		combined.set(current);
		combined.set(data, current.length);
		await this.adapter.write(this.path, combined);
	}

	async stat() {
		this.assertOpen();
		const info = await this.adapter.stat(this.path);
		if (info === null) {
			throw createFileSystemError(FileSystemErrorCode.NotFound, this.path, "File does not exist");
		}
		return info;
	}

	async truncate(size = 0) {
		this.assertWritable();
		if (!Number.isSafeInteger(size) || size < 0) {
			throw createFileSystemError(FileSystemErrorCode.InvalidPath, this.path, "truncate size must be a non-negative safe integer");
		}

		const current = await this.adapter.read(this.path);
		if (current.length === size) return;

		try {
			const resized = new Uint8Array(size);
			resized.set(current.subarray(0, size));
			await this.adapter.write(this.path, resized);
		} catch (error) {
			throw toFileSystemError(error, this.path);
		}
	}

	async close() {
		this.closed = true;
	}

	assertOpen() {
		if (this.closed) {
			throw createFileSystemError(FileSystemErrorCode.IoError, this.path, "File handle is closed");
		}
	}

	assertWritable() {
		this.assertOpen();
		if (!this.writable) {
			throw createFileSystemError(FileSystemErrorCode.IoError, this.path, "File is not open for writing");
		}
	}
}

async function requestBackend(route, path, query, init) {
	const queryString = query ? `?${new URLSearchParams(query)}` : "";
	let response;

	try {
		response = await fetch(`${route}${queryString}`, init);
	} catch (error) {
		throw toFileSystemError(error, path);
	}

	let result;
	try {
		result = await response.json();
	} catch (error) {
		throw createFileSystemError(FileSystemErrorCode.IoError, path, "Backend returned invalid JSON", error);
	}

	if (!result || typeof result !== "object" || typeof result.success !== "boolean") {
		throw createFileSystemError(FileSystemErrorCode.IoError, path, "Backend returned an invalid response");
	}
	if (!response.ok || !result.success) {
		const message = result.errorMsg || `Backend request failed with HTTP ${response.status}`;
		throw toFileSystemError(new Error(String(message)), path);
	}

	return result.data;
}

function assertValidPath(path) {
	if (typeof path !== "string" || path.includes("\0")) {
		throw createFileSystemError(FileSystemErrorCode.InvalidPath, String(path), "Path must be a string without null bytes");
	}
}

function getParentPath(path) {
	const normalized = path.replace(/[\\/]+$/, "");
	const separatorIndex = Math.max(normalized.lastIndexOf("/"), normalized.lastIndexOf("\\"));
	return separatorIndex < 0 ? "." : normalized.slice(0, separatorIndex) || ".";
}

function isStringArray(value) {
	return Array.isArray(value) && value.every(item => typeof item === "string");
}

function isByteArray(value) {
	return Array.isArray(value) && value.every(item => Number.isInteger(item) && item >= 0 && item <= 255);
}

function assertUint8Array(data, path) {
	if (!(data instanceof Uint8Array)) {
		throw createFileSystemError(FileSystemErrorCode.IoError, path, "write data must be a Uint8Array");
	}
}

function createFileSystemError(code, path, message, cause) {
	return new FileSystemError(code, path, {
		cause: cause ?? new Error(message),
	});
}

function toFileSystemError(error, path) {
	if (error instanceof FileSystemError) return error;

	const message = error instanceof Error ? error.message : String(error);
	let code = FileSystemErrorCode.IoError;
	if (/\bENOENT\b|not found|不存在/i.test(message)) {
		code = FileSystemErrorCode.NotFound;
	} else if (/\bEEXIST\b|already exists|已存在/i.test(message)) {
		code = FileSystemErrorCode.AlreadyExists;
	} else if (/\bENOTDIR\b|not a directory|不是文件夹|不是目录/i.test(message)) {
		code = FileSystemErrorCode.NotDirectory;
	} else if (/\bEISDIR\b|not a file|不是文件/i.test(message)) {
		code = FileSystemErrorCode.NotFile;
	} else if (/\b(?:EACCES|EPERM|EROFS)\b|permission denied|无权限|拒绝访问/i.test(message)) {
		code = FileSystemErrorCode.PermissionDenied;
	} else if (/\b(?:EINVAL|ENAMETOOLONG)\b|invalid path|只能访问/i.test(message)) {
		code = FileSystemErrorCode.InvalidPath;
	}

	return new FileSystemError(code, path, {
		cause: error instanceof Error ? error : new Error(message),
	});
}
