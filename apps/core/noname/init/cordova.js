//@ts-nocheck
import { checkVersion } from "../library/update.js";
import { FileSystem, FileSystemError, FileSystemErrorCode, installLegacyFileSystemAPI } from "@/library/fs";

/**
 * @typedef { import("@/library/fs").FileSystemAdapter } FileSystemAdapter
 * @typedef { import("@/library/fs").FileHandle } FileHandle
 * @typedef { import("@/library/fs").OpenOptions } OpenOptions
 */

export default async function cordovaReady({ lib, game, get, _status, ui }) {
	lib.path = (await import("path-browserify-esm")).default;

	// 安卓端根目录的cordova.js
	const script = document.createElement("script");
	script.src = "cordova.js";
	document.body.appendChild(script);
	await new Promise(resolve => {
		document.addEventListener("deviceready", () => resolve(void 0));
	});

	const nonameInitialized = localStorage.getItem("noname_inited");
	if (!nonameInitialized) {
		throw new Error("未找到游戏目录配置: noname_inited");
	}
	const fs = new FileSystem(new CordovaFileSystemAdapter(nonameInitialized));
	lib.fs = fs;
	installLegacyFileSystemAPI(game, fs);

	if (lib.device == "android") {
		// 新客户端导入扩展逻辑
		window.addEventListener(
			"importExtension",
			e => {
				const extensionName = e.detail.extensionName;
				lib.config.extensions.add(extensionName);
				game.saveConfig("extensions", lib.config.extensions);
				game.saveConfig(`extension_${extensionName}_enable`, true);
				if (confirm(`扩展${extensionName}已导入成功，是否重启游戏？`)) {
					game.reload();
				}
			},
			false
		);
		window.addEventListener(
			"importPackage",
			() => {
				if (confirm(`离线包/完整包已导入成功，是否重启游戏？`)) {
					game.reload();
				}
			},
			false
		);
		document.addEventListener("pause", function () {
			if (_status.gameStarted && !_status.event.isMine()) {
				ui.click.pause();
			}
			if (ui.backgroundMusic) {
				ui.backgroundMusic.pause();
			}
		});
		document.addEventListener("resume", () => {
			if (ui.backgroundMusic && !isNaN(ui.backgroundMusic.duration)) {
				ui.backgroundMusic.play();
			}
		});
		document.addEventListener("backbutton", function () {
			if (ui.arena && ui.arena.classList.contains("menupaused")) {
				if (window.saveNonameInput) {
					window.saveNonameInput();
				} else {
					ui.click.configMenu();
				}
			} else if (lib.config?.confirm_exit) {
				navigator.notification.confirm(
					"是否退出游戏？",
					function (index) {
						switch (index) {
							case 2:
								game.reload();
								break;
							case 3:
								navigator.app.exitApp();
								break;
						}
					},
					"确认退出",
					["取消", "重新开始", "退出"]
				);
			} else {
				navigator.app.exitApp();
			}
		});
		if ("cordova" in window && "plugins" in window.cordova && "permissions" in window.cordova.plugins) {
			const permissions = cordova.plugins.permissions;
			const requests = ["WRITE_EXTERNAL_STORAGE", "READ_EXTERNAL_STORAGE"];
			if (typeof device == "object") {
				// 安卓13或以上
				if (checkVersion(device.version, "13") >= 0) {
					requests.length = 0;
					requests.push("READ_MEDIA_IMAGES", "READ_MEDIA_VIDEO", "READ_MEDIA_AUDIO");
				}
			}
			Promise.all(
				requests.map(request => {
					return new Promise((resolve, reject) => {
						permissions.checkPermission(
							permissions[request],
							status => {
								resolve({
									request: request,
									hasPermission: status.hasPermission,
								});
							},
							reject
						);
					});
				})
			)
				.then(shouldRequestPermissions => {
					return shouldRequestPermissions.filter(({ hasPermission }) => !hasPermission).map(({ request }) => permissions[request] || `android.permission.${request}`);
				})
				.then(willRequestPermissions => {
					permissions.requestPermissions(
						willRequestPermissions,
						() => {},
						() => {}
					);
				})
				.catch(console.log);
		}
		// if (typeof window.NonameAndroidBridge == "undefined" || typeof window.NonameAndroidBridge.getPackageName != "function" || typeof window.NonameAndroidBridge.getPackageVersionCode != "function") {
		// 	throw new Error("您的安卓客户端版本过低，请升级至最新版");
		// }
		// const versionCode = window.NonameAndroidBridge.getPackageVersionCode();
		// switch (window.NonameAndroidBridge.getPackageName()) {
		// 	case "com.noname.shijian":
		// 		if (versionCode < 16007) {
		// 			throw new Error("您的安卓诗笺版客户端版本过低，请升级至v1.6.7或以上");
		// 		}
		// 		break;
		// 	case "yuri.nakamura.noname_android":
		// 		if (versionCode < 10904) {
		// 			throw new Error("您的安卓由理版客户端版本过低，请升级至v1.9.4或以上");
		// 		}
		// 		break;
		// 	case "yuri.nakamura.noname":
		// 		if (versionCode < 108004) {
		// 			throw new Error("您的安卓兼容版客户端版本过低，请升级至v1.8.4或以上");
		// 		}
		// 		break;
		// 	case "com.widget.noname.cola":
		// 		if (versionCode < 10320) {
		// 			throw new Error("您的安卓增强版客户端版本过低，请升级至v1.3.2或以上");
		// 		}
		// 		break;
		// 	default:
		// 	// todo: 懒人包提示
		// }
	}
	game.download = function (url, folder, onsuccess, onerror, dev, onprogress) {
		if (!url.startsWith("http")) {
			url = get.url(dev) + url;
		}
		var fileTransfer = new FileTransfer();
		game.ensureDirectory(
			folder,
			function () {
				// folder = nonameInitialized + folder;
				if (onprogress) {
					fileTransfer.onprogress = function (progressEvent) {
						onprogress(progressEvent.loaded, progressEvent.total);
					};
				}
				lib.config.brokenFile.add(nonameInitialized + folder);
				game.saveConfigValue("brokenFile");
				fileTransfer.download(
					encodeURI(url),
					encodeURI(nonameInitialized + folder),
					function () {
						lib.config.brokenFile.remove(nonameInitialized + folder);
						game.saveConfigValue("brokenFile");
						if (onsuccess) {
							onsuccess();
						}
					},
					onerror
				);
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

		let directory;
		if (lib.device == "android") {
			directory = cordova.file.externalDataDirectory;
		} else {
			directory = cordova.file.documentsDirectory;
		}
		window.resolveLocalFileSystemURL(directory, function (entry) {
			entry.getFile(fileNameToSaveAs, { create: true }, function (fileEntry) {
				fileEntry.createWriter(function (fileWriter) {
					fileWriter.onwriteend = function () {
						alert("文件已导出至" + directory + fileNameToSaveAs);
					};
					fileWriter.write(data);
				});
			});
		});
	};

	game.exit = function () {
		if (lib.device === "android") {
			if (navigator.app && navigator.app.exitApp) {
				navigator.app.exitApp();
			}
		}
		//ios
		else {
			game.saveConfig("mode");
			if (_status) {
				if (_status.reloading) {
					return;
				}
				_status.reloading = true;
			}
			if (_status.video && !_status.replayvideo) {
				localStorage.removeItem(lib.configprefix + "playbackmode");
			}
			window.location.reload();
		}
	};

	game.open = function (url) {
		if (cordova.InAppBrowser) {
			cordova.InAppBrowser.open(url, "_system");
		} else {
			ui.create.iframe(url);
		}
	};

	if (ui.updateUpdate) {
		ui.updateUpdate();
	}
	var showbar = function () {
		if (window.StatusBar) {
			if (lib.device == "android") {
				if (lib.config.show_statusbar_android) {
					window.StatusBar.overlaysWebView(false);
					window.StatusBar.backgroundColorByName("black");
					window.StatusBar.show();
				}
			} else if (lib.device == "ios") {
				if (lib.config.show_statusbar_ios != "off" && lib.config.show_statusbar_ios != "auto") {
					if (lib.config.show_statusbar_ios == "default") {
						window.StatusBar.overlaysWebView(false);
					} else {
						window.StatusBar.overlaysWebView(true);
					}
					window.StatusBar.backgroundColorByName("black");
					window.StatusBar.show();
				}
			}
		}
	};
	if (lib.arenaReady) {
		lib.arenaReady.push(showbar);
	} else {
		showbar();
	}
}

/** @implements {FileSystemAdapter} */
class CordovaFileSystemAdapter {
	constructor(root) {
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

		return new CordovaFileHandle(this, path, readable, writable, append);
	}

	async read(path) {
		assertValidPath(path);
		try {
			const entry = await this.resolve(path);
			if (!entry.isFile) {
				throw createFileSystemError(FileSystemErrorCode.NotFile, path, "Path is not a file");
			}
			const file = await new Promise((resolve, reject) => entry.file(resolve, reject));
			const data = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = event => resolve(event.target.result);
				reader.onerror = () => reject(reader.error);
				reader.readAsArrayBuffer(file);
			});
			return new Uint8Array(data);
		} catch (error) {
			throw toFileSystemError(error, path);
		}
	}

	async write(path, data) {
		assertValidPath(path);
		assertUint8Array(data, path);
		try {
			const { parent, name } = splitPath(path);
			if (!name) {
				throw createFileSystemError(FileSystemErrorCode.InvalidPath, path, "File name is empty");
			}
			const directoryEntry = await this.resolve(parent);
			if (!directoryEntry.isDirectory) {
				throw createFileSystemError(FileSystemErrorCode.NotDirectory, parent, "Parent path is not a directory");
			}
			let fileEntry;
			try {
				fileEntry = await new Promise((resolve, reject) =>
					directoryEntry.getFile(name, { create: true }, resolve, reject)
				);
			} catch (error) {
				if (error?.code === 11) {
					throw createFileSystemError(FileSystemErrorCode.NotFile, path, "Path is not a file", error);
				}
				throw error;
			}
			const writer = await new Promise((resolve, reject) => fileEntry.createWriter(resolve, reject));
			await new Promise((resolve, reject) => {
				let writing = false;
				writer.onerror = event => reject(writer.error ?? event);
				writer.onwriteend = () => {
					if (!writing) {
						writing = true;
						writer.seek(0);
						writer.write(new Blob([data]));
						return;
					}
					resolve();
				};
				writer.truncate(0);
			});
		} catch (error) {
			throw toFileSystemError(error, path);
		}
	}

	async stat(path) {
		assertValidPath(path);
		try {
			const entry = await this.resolve(path);
			const metadata = await new Promise((resolve, reject) => entry.getMetadata(resolve, reject));
			return {
				type: entry.isFile ? "file" : entry.isDirectory ? "directory" : "other",
				size: metadata.size,
				modifiedAt: metadata.modificationTime,
			};
		} catch (error) {
			if (error?.code === 1) return null;
			throw toFileSystemError(error, path);
		}
	}

	async list(path) {
		assertValidPath(path);
		try {
			const entry = await this.resolve(path);
			if (!entry.isDirectory) {
				throw createFileSystemError(FileSystemErrorCode.NotDirectory, path, "Path is not a directory");
			}
			const reader = entry.createReader();
			const entries = [];
			while (true) {
				const batch = await new Promise((resolve, reject) => reader.readEntries(resolve, reject));
				if (batch.length === 0) break;
				entries.push(...batch);
			}
			return entries.map(entry => ({
				name: entry.name,
				type: entry.isFile ? "file" : entry.isDirectory ? "directory" : "other",
			}));
		} catch (error) {
			throw toFileSystemError(error, path);
		}
	}

	async createDir(path, options = {}) {
		assertValidPath(path);
		try {
			const segments = path.split("/").filter(segment => segment.length > 0 && segment !== ".");
			if (segments.length === 0) {
				if (options.recursive) return;
				throw createFileSystemError(FileSystemErrorCode.AlreadyExists, path, "Path already exists");
			}

			if (!options.recursive) {
				if ((await this.stat(path)) !== null) {
					throw createFileSystemError(FileSystemErrorCode.AlreadyExists, path, "Path already exists");
				}
				const name = segments.pop();
				const parent = await this.resolve(segments.join("/"));
				if (!parent.isDirectory) {
					throw createFileSystemError(FileSystemErrorCode.NotDirectory, path, "Parent path is not a directory");
				}
				await new Promise((resolve, reject) =>
					parent.getDirectory(name, { create: true, exclusive: true }, resolve, reject)
				);
				return;
			}

			let entry = await this.resolve("");
			for (const segment of segments) {
				try {
					entry = await new Promise((resolve, reject) =>
						entry.getDirectory(segment, { create: true }, resolve, reject)
					);
				} catch (error) {
					if (error?.code === 11) {
						throw createFileSystemError(FileSystemErrorCode.NotDirectory, path, "Path contains a file", error);
					}
					throw error;
				}
			}
		} catch (error) {
			throw toFileSystemError(error, path);
		}
	}

	async remove(path, options = {}) {
		assertValidPath(path);
		try {
			const entry = await this.resolve(path);
			if (entry.isDirectory && options.recursive) {
				await new Promise((resolve, reject) => entry.removeRecursively(resolve, reject));
			} else {
				await new Promise((resolve, reject) => entry.remove(resolve, reject));
			}
		} catch (error) {
			throw toFileSystemError(error, path);
		}
	}

	resolve(path) {
		return new Promise((resolve, reject) =>
			window.resolveLocalFileSystemURL(`${this.root}${path}`, resolve, reject)
		);
	}
}

/** @implements {FileHandle} */
class CordovaFileHandle {
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

function splitPath(path) {
	const separator = path.lastIndexOf("/");
	return separator < 0
		? { parent: "", name: path }
		: { parent: path.slice(0, separator + 1), name: path.slice(separator + 1) };
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
		1: FileSystemErrorCode.NotFound,
		2: FileSystemErrorCode.PermissionDenied,
		4: FileSystemErrorCode.PermissionDenied,
		5: FileSystemErrorCode.InvalidPath,
		6: FileSystemErrorCode.PermissionDenied,
		8: FileSystemErrorCode.InvalidPath,
		12: FileSystemErrorCode.AlreadyExists,
	}[error?.code] ?? FileSystemErrorCode.IoError;
	return new FileSystemError(code, path, {
		cause: error instanceof Error ? error : new Error(`Cordova FileError: ${String(error?.code ?? error)}`),
	});
}
