//@ts-nocheck
import { get } from "../get/index.js";
import { lib } from "../library/index.js";
import { game } from "../game/index.js";
import { _status } from "../status/index.js";
import { ui } from "../ui/index.js";
import { nonameInitialized } from "../util/index.js";
import { checkVersion } from "../library/update.js";

export async function cordovaReady() {
	// 安卓端根目录的cordova.js
	const script = document.createElement("script");
	script.src = "cordova.js";
	document.body.appendChild(script);
	await new Promise(resolve => {
		document.addEventListener("deviceready", () => resolve(void 0));
	});

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
			if (!_status.paused2 && typeof _status.event.isMine == "function" && !_status.event.isMine()) {
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
			} else if (lib.config.confirm_exit) {
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
					permissions.requestPermissions(willRequestPermissions, lib.other.ignore, lib.other.ignore);
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
	game.checkFile = function (fileName, callback, onerror) {
		let path = lib.path.join(nonameInitialized, fileName);

		window.resolveLocalFileSystemURL(
			path,
			entry => {
				callback?.(entry.isFile ? 1 : 0);
			},
			error => {
				if ([FileError.NOT_FOUND_ERR, FileError.NOT_READABLE_ERR].includes(error.code)) {
					callback?.(-1);
				} else {
					onerror?.(new Error(`Code: ${error.code}`));
				}
			}
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
	game.checkDir = function (dir, callback, onerror) {
		let path = lib.path.join(nonameInitialized, dir);

		window.resolveLocalFileSystemURL(
			path,
			entry => {
				callback?.(entry.isDirectory ? 1 : 0);
			},
			error => {
				if ([FileError.NOT_FOUND_ERR, FileError.NOT_READABLE_ERR].includes(error.code)) {
					callback?.(-1);
				} else {
					onerror?.(new Error(`Code: ${error.code}`));
				}
			}
		);
	};

	game.readFile = function (filename, callback, onerror) {
		window.resolveLocalFileSystemURL(
			nonameInitialized,
			function (entry) {
				entry.getFile(
					filename,
					{},
					function (fileEntry) {
						fileEntry.file(function (fileToLoad) {
							var fileReader = new FileReader();
							fileReader.onload = function (e) {
								callback(e.target.result);
							};
							fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");
						}, onerror);
					},
					onerror
				);
			},
			onerror
		);
	};
	game.readFileAsText = function (filename, callback, onerror) {
		window.resolveLocalFileSystemURL(
			nonameInitialized,
			function (entry) {
				entry.getFile(
					filename,
					{},
					function (fileEntry) {
						fileEntry.file(function (fileToLoad) {
							var fileReader = new FileReader();
							fileReader.onload = function (e) {
								callback(e.target.result);
							};
							fileReader.readAsText(fileToLoad, "UTF-8");
						}, onerror);
					},
					onerror
				);
			},
			onerror
		);
	};
	game.writeFile = function (data, path, name, callback) {
		game.ensureDirectory(path, function () {
			if (Object.prototype.toString.call(data) == "[object File]") {
				var fileReader = new FileReader();
				fileReader.onload = function (e) {
					game.writeFile(e.target.result, path, name, callback);
				};
				fileReader.readAsArrayBuffer(data, "UTF-8");
			} else {
				window.resolveLocalFileSystemURL(
					nonameInitialized + path,
					function (entry) {
						entry.getFile(
							name,
							{ create: true },
							function (fileEntry) {
								fileEntry.createWriter(function (fileWriter) {
									fileWriter.onwriteend = callback;
									fileWriter.write(data);
								}, callback);
							},
							callback
						);
					},
					callback
				);
			}
		});
	};
	game.removeFile = function (dir, callback) {
		window.resolveLocalFileSystemURL(
			nonameInitialized,
			function (entry) {
				entry.getFile(
					dir,
					{},
					function (fileEntry) {
						fileEntry.remove();
						if (callback) {
							callback();
						}
					},
					callback || function () {}
				);
			},
			callback || function () {}
		);
	};
	game.getFileList = (dir, success, failure) => {
		var files = [],
			folders = [];
		window.resolveLocalFileSystemURL(
			nonameInitialized + dir,
			entry => {
				var dirReader = entry.createReader();
				var entries = [];
				var readEntries = () => {
					dirReader.readEntries(results => {
						if (!results.length) {
							entries.sort();
							for (var i = 0; i < entries.length; i++) {
								if (entries[i].isDirectory) {
									folders.push(entries[i].name);
								} else {
									files.push(entries[i].name);
								}
							}
							success(folders, files);
						} else {
							entries = entries.concat(Array.from(results));
							readEntries();
						}
					}, failure);
				};
				readEntries();
			},
			failure
		);
	};
	game.ensureDirectory = (list, callback, file) => {
		const directoryList = typeof list == "string" ? [list] : list.slice().reverse(),
			num = file ? 1 : 0,
			access = (entry, directory, createDirectory) => {
				if (directory.length <= num) {
					createDirectory();
					return;
				}
				const str = directory.pop();
				return new Promise((resolve, reject) =>
					entry.getDirectory(
						str,
						{
							create: false,
						},
						resolve,
						reject
					)
				)
					.catch(
						() =>
							new Promise(resolve =>
								entry.getDirectory(
									str,
									{
										create: true,
									},
									resolve
								)
							)
					)
					.then(directoryEntry => access(directoryEntry, directory, createDirectory));
			};
		return new Promise((resolve, reject) =>
			window.resolveLocalFileSystemURL(
				nonameInitialized,
				rootEntry => {
					const createDirectory = () => {
						if (directoryList.length) {
							access(rootEntry, directoryList.pop().split("/").reverse(), createDirectory);
						}
						if (typeof callback == "function") {
							callback();
						}
						resolve();
					};
					createDirectory();
				},
				reject
			)
		);
	};
	game.createDir = (directory, successCallback, errorCallback) => {
		const paths = directory.split("/").reverse();
		new Promise((resolve, reject) => window.resolveLocalFileSystemURL(nonameInitialized, resolve, reject)).then(
			directoryEntry => {
				const redo = entry =>
					new Promise((resolve, reject) =>
						entry.getDirectory(
							paths.pop(),
							{
								create: true,
							},
							resolve,
							reject
						)
					).then(resolvedDirectoryEntry => {
						if (paths.length) {
							return redo(resolvedDirectoryEntry);
						}
						if (typeof successCallback == "function") {
							successCallback();
						}
					});
				return redo(directoryEntry);
			},
			reason => {
				if (typeof errorCallback != "function") {
					return Promise.reject(reason);
				}
				errorCallback(reason);
			}
		);
	};
	game.removeDir = (directory, successCallback, errorCallback) => {
		window.resolveLocalFileSystemURL(
			`${nonameInitialized}${directory}`,
			directoryEntry => {
				directoryEntry.removeRecursively(() => {
					if (typeof successCallback == "function") {
						successCallback();
					}
				});
			},
			e => {
				if (typeof errorCallback == "function") {
					errorCallback(e);
				} else {
					throw e;
				}
			}
		);
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
