//@ts-nocheck
import { FileSystem, FileSystemError, FileSystemErrorCode, installLegacyFileSystemAPI } from "@/library/fs";

/**
 * @typedef { import("@/library/fs").FileSystemAdapter } FileSystemAdapter
 * @typedef { import("@/library/fs").FileHandle } FileHandle
 * @typedef { import("@/library/fs").OpenOptions } OpenOptions
 */

export default function nodeReady({ lib, game, get, _status, ui }) {
	// 处理Node环境下的http情况
	if (typeof window.process == "object" && typeof window.__dirname == "string") {
		// 在http环境下修改__dirname和require的逻辑
		if (window.__dirname.endsWith("electron.asar\\renderer") || window.__dirname.endsWith("electron.asar/renderer")) {
			const path = require("path");
			if (window.process.platform === "darwin") {
				//@ts-ignore
				window.__dirname = path.join(window.process.resourcesPath, "app");
			} else {
				window.__dirname = path.join(path.resolve(), "resources/app");
			}
			const oldRequire = window.require;
			// @ts-expect-error ignore
			window.require = function (moduleId) {
				try {
					return oldRequire(moduleId);
				} catch {
					return oldRequire(path.join(window.__dirname, moduleId));
				}
			};
			Object.entries(oldRequire).forEach(([key, value]) => {
				window.require[key] = value;
			});
		}
		// 	// 增加导入ts的逻辑
		// 	window.require.extensions[".ts"] = function (module, filename) {
		// 		// @ts-expect-error ignore
		// 		const _compile = module._compile;
		// 		// @ts-expect-error ignore
		// 		module._compile = function (code, fileName) {
		// 			/**
		// 			 *
		// 			 * @type { import("typescript") }
		// 			 */
		// 			// @ts-expect-error ignore
		// 			const ts = require("typescript");
		// 			// 使用ts compiler对ts文件进行编译
		// 			const result = ts.transpile(
		// 				code,
		// 				{
		// 					module: ts.ModuleKind.CommonJS,
		// 					target: ts.ScriptTarget.ES2020,
		// 					inlineSourceMap: true,
		// 					resolveJsonModule: true,
		// 					esModuleInterop: true,
		// 				},
		// 				fileName
		// 			);
		// 			// 使用默认的js编译函数获取返回值
		// 			return _compile.call(this, result, fileName);
		// 		};
		// 		// @ts-expect-error ignore
		// 		module._compile(require("fs").readFileSync(filename, "utf8"), filename);
		// 	};
	}
	const versions = window.process.versions;
	// @ts-expect-error ignore
	const electronVersion = parseFloat(versions.electron);
	lib.node = {
		fs: require("fs"),
		path: require("path"),
		debug() {
			let remote;
			if (electronVersion >= 14) {
				// @ts-expect-error ignore
				remote = require("@electron/remote");
			} else {
				// @ts-expect-error ignore
				remote = require("electron").remote;
			}
			remote.getCurrentWindow().toggleDevTools();
		},
	};
	lib.path = lib.node.path;
	const fs = new FileSystem(new NodeFileSystemAdapter(lib.node.fs, lib.node.path, __dirname));
	lib.fs = fs;
	installLegacyFileSystemAPI(game, fs);

	game.download = function (url, folder, onsuccess, onerror, dev, onprogress) {
		if (!url.startsWith("http")) {
			url = get.url(dev) + url;
		}
		game.ensureDirectory(
			folder,
			function () {
				try {
					var file = lib.node.fs.createWriteStream(__dirname + "/" + folder);
				} catch (e) {
					onerror();
				}
				lib.config.brokenFile.add(folder);
				game.saveConfigValue("brokenFile");
				if (!lib.node.http) {
					lib.node.http = require("http");
				}
				if (!lib.node.https) {
					lib.node.https = require("https");
				}
				var opts = require("url").parse(encodeURI(url));
				opts.headers = { "User-Agent": "AppleWebkit" };
				(url.startsWith("https") ? lib.node.https : lib.node.http).get(opts, function (response) {
					var stream = response.pipe(file);
					stream.on("finish", function () {
						lib.config.brokenFile.remove(folder);
						game.saveConfigValue("brokenFile");
						if (onsuccess) {
							onsuccess();
						}
					});
					stream.on("error", onerror);
					if (onprogress) {
						var streamInterval = setInterval(function () {
							if (stream.closed) {
								clearInterval(streamInterval);
							} else {
								onprogress(stream.bytesWritten);
							}
						}, 200);
					}
				});
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
		var versions = window.process.versions;
		var electronVersion = parseFloat(versions.electron);
		var remote;
		if (electronVersion >= 14) {
			remote = require("@electron/remote");
		} else {
			remote = require("electron").remote;
		}
		var thisWindow = remote.getCurrentWindow();
		thisWindow.destroy();
		window.process.exit();
	};

	game.open = function (url) {
		window.open(url);
	};
	
	if (ui.updateUpdate) {
		ui.updateUpdate();
	}
}

/** @implements {FileSystemAdapter} */
class NodeFileSystemAdapter {
	constructor(nodeFs, path, root) {
		this.nodeFs = nodeFs;
		this.path = path;
		this.root = root;
	}

	/** @param {string} path @param {OpenOptions} [options] @returns {Promise<FileHandle>} */
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

		return new NodeFileHandle(this, path, readable, writable, append);
	}

	async read(path) {
		assertValidPath(path);
		try {
			const data = await this.nodeFs.promises.readFile(this.resolve(path));
			return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
		} catch (error) {
			throw toFileSystemError(error, path);
		}
	}

	async write(path, data) {
		assertValidPath(path);
		assertUint8Array(data, path);
		try {
			await this.nodeFs.promises.writeFile(this.resolve(path), data);
		} catch (error) {
			throw toFileSystemError(error, path);
		}
	}

	async stat(path) {
		assertValidPath(path);
		try {
			const stat = await this.nodeFs.promises.stat(this.resolve(path));
			return {
				type: stat.isFile() ? "file" : stat.isDirectory() ? "directory" : "other",
				size: stat.size,
				createdAt: stat.birthtime,
				modifiedAt: stat.mtime,
				accessedAt: stat.atime,
			};
		} catch (error) {
			if (error?.code === "ENOENT") return null;
			throw toFileSystemError(error, path);
		}
	}

	async list(path) {
		assertValidPath(path);
		try {
			const entries = await this.nodeFs.promises.readdir(this.resolve(path), { withFileTypes: true });
			return entries.map(entry => ({
				name: entry.name,
				type: entry.isFile() ? "file" : entry.isDirectory() ? "directory" : "other",
			}));
		} catch (error) {
			throw toFileSystemError(error, path);
		}
	}

	async createDir(path, options = {}) {
		assertValidPath(path);
		try {
			await this.nodeFs.promises.mkdir(this.resolve(path), { recursive: options.recursive === true });
		} catch (error) {
			throw toFileSystemError(error, path);
		}
	}

	async remove(path, options = {}) {
		assertValidPath(path);
		try {
			const info = await this.stat(path);
			if (info === null) {
				throw createFileSystemError(FileSystemErrorCode.NotFound, path, "Path does not exist");
			}
			if (info.type === "directory") {
				if (options.recursive) {
					await this.nodeFs.promises.rm(this.resolve(path), { recursive: true });
				} else {
					await this.nodeFs.promises.rmdir(this.resolve(path));
				}
			} else {
				await this.nodeFs.promises.unlink(this.resolve(path));
			}
		} catch (error) {
			throw toFileSystemError(error, path);
		}
	}

	resolve(path) {
		return this.path.join(this.root, path);
	}
}

/** @implements {FileHandle} */
class NodeFileHandle {
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
		if (!this.append) return this.adapter.write(this.path, data);

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
		const resized = new Uint8Array(size);
		resized.set(current.subarray(0, size));
		await this.adapter.write(this.path, resized);
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

function assertValidPath(path) {
	if (typeof path !== "string" || path.includes("\0")) {
		throw createFileSystemError(FileSystemErrorCode.InvalidPath, String(path), "Path must be a string without null bytes");
	}
}

function assertUint8Array(data, path) {
	if (!(data instanceof Uint8Array)) {
		throw createFileSystemError(FileSystemErrorCode.IoError, path, "write data must be a Uint8Array");
	}
}

function createFileSystemError(code, path, message, cause) {
	return new FileSystemError(code, path, { cause: cause ?? new Error(message), detail: message });
}

function toFileSystemError(error, path) {
	if (error instanceof FileSystemError) return error;

	const code = {
		ENOENT: FileSystemErrorCode.NotFound,
		EEXIST: FileSystemErrorCode.AlreadyExists,
		ENOTDIR: FileSystemErrorCode.NotDirectory,
		EISDIR: FileSystemErrorCode.NotFile,
		EACCES: FileSystemErrorCode.PermissionDenied,
		EPERM: FileSystemErrorCode.PermissionDenied,
		EROFS: FileSystemErrorCode.PermissionDenied,
		EINVAL: FileSystemErrorCode.InvalidPath,
		ENAMETOOLONG: FileSystemErrorCode.InvalidPath,
	}[error?.code] ?? FileSystemErrorCode.IoError;
	return new FileSystemError(code, path, {
		cause: error instanceof Error ? error : new Error(String(error)),
	});
}
