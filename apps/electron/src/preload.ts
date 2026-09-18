// @ts-nocheck

function checkVersion(ver1, ver2) {
	const parse = value => {
		const version = String(value).replace(/^v/, "");
		return version.split(/[.-]/).filter(Boolean).map(Number);
	};

	const version1 = parse(ver1);
	const version2 = parse(ver2);
	const length = Math.max(version1.length, version2.length);
	for (let i = 0; i < length; i++) {
		const item1 = version1[i] ?? 0;
		const item2 = version2[i] ?? 0;
		if (Number.isNaN(item1) || Number.isNaN(item2)) {
			throw new Error("Non-numeric part found in the version numbers");
		}
		if (item1 > item2) return 1;
		if (item1 < item2) return -1;
	}
	return 0;
}

export default async function preload({ lib, game, get, _status, ui, ai }) {
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
		const filePath = `${dirname}/${fileName}`;

		// 如果路径不存在，则无需再尝试获取信息
		if (!lib.node.fs.existsSync(filePath)) {
			callback?.(-1);
			return;
		}

		lib.node.fs.stat(filePath, (err, stat) => {
			if (err) {
				// 如果是无法访问的情况，则按照函数需求返回 -1
				if (err.code === "EACCES") {
					callback?.(-1);
				} else {
					onerror?.(err);
				}
				return;
			}

			callback?.(stat.isFile() ? 1 : 0);
		});
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
		const dirPath = `${dirname}/${dir}`;

		// 如果路径不存在，则无需再尝试获取信息
		if (!lib.node.fs.existsSync(dirPath)) {
			callback?.(-1);
			return;
		}

		lib.node.fs.stat(dirPath, (err, stat) => {
			if (err) {
				if (err.code === "EACCES") {
					callback?.(-1);
				} else {
					onerror?.(err);
				}
				return;
			}

			callback?.(stat.isDirectory() ? 1 : 0);
		});
	};

	game.readFile = function (filename, callback, onerror) {
		lib.node.fs.readFile(`${dirname}/${filename}`, function (err, data) {
			if (err) {
				onerror?.(err);
			} else {
				callback?.(data);
			}
		});
	};
	game.readFileAsText = function (filename, callback, onerror) {
		lib.node.fs.readFile(`${dirname}/${filename}`, "utf-8", function (err, data) {
			if (err) {
				onerror?.(err);
			} else {
				callback?.(data);
			}
		});
	};
	game.writeFile = function (data, path, name, callback) {
		game.ensureDirectory(path, function () {
			if (Object.prototype.toString.call(data) === "[object File]") {
				const fileReader = new FileReader();
				fileReader.onload = function (e) {
					game.writeFile(e.target.result, path, name, callback);
				};
				fileReader.readAsArrayBuffer(data, "UTF-8");
			} else {
				lib.node.fs.writeFile(
					`${dirname}/${path}/${name}`,
					typeof data === "string" ? data : new Uint8Array(data),
					null,
					callback
				);
			}
		});
	};
	game.removeFile = function (filename, callback) {
		lib.node.fs.unlink(`${dirname}/${filename}`, callback || function () {});
	};
	game.getFileList = (dir, success, failure) => {
		const files = [];
		const folders = [];
		dir = `${dirname}/${dir}`;
		if (typeof failure === "undefined") {
			failure = err => {
				throw err;
			};
		} else if (failure == null) {
			failure = () => {};
		}
		try {
			lib.node.fs.readdir(dir, (err, filelist) => {
				if (err) {
					failure(err);
					return;
				}
				for (let i = 0; i < filelist.length; i++) {
					if (filelist[i][0] !== "." && filelist[i][0] !== "_") {
						if (lib.node.fs.statSync(`${dir}/${filelist[i]}`).isDirectory()) {
							folders.push(filelist[i]);
						} else {
							files.push(filelist[i]);
						}
					}
				}
				success(folders, files);
			});
		} catch (e) {
			failure(e);
		}
	};
	game.ensureDirectory = (list, callback, file) => {
		const directoryList = typeof list === "string" ? [list] : list.slice().reverse();
		const number = file ? 1 : 0;
		const access = (path, directory, createDirectory) => {
			if (directory.length <= number) {
				createDirectory();
				return;
			}
			path += `/${directory.pop()}`;
			const fullPath = `${dirname}${path}`;
			return new Promise((resolve, reject) =>
				lib.node.fs.access(fullPath, errnoException => {
					if (errnoException) {
						reject();
					} else {
						resolve();
					}
				})
			)
				.catch(
					() =>
						new Promise((resolve, reject) =>
							lib.node.fs.mkdir(fullPath, errnoException => {
								if (errnoException) {
									reject(errnoException);
								} else {
									resolve();
								}
							})
						)
				)
				.then(() => access(path, directory, createDirectory), console.log);
		};
		new Promise(resolve => {
			const createDirectory = () => {
				if (directoryList.length) {
					access("", directoryList.pop().split("/").reverse(), createDirectory);
				} else {
					if (typeof callback === "function") {
						callback();
					}
					resolve();
				}
			};
			createDirectory();
		});
	};
	game.createDir = (directory, successCallback, errorCallback) => {
		const target = lib.node.path.join(dirname, directory);
		if (lib.node.fs.existsSync(target)) {
			// 路径存在且是文件才会报错
			if (!lib.node.fs.lstatSync(target).isDirectory()) {
				if (typeof errorCallback === "function") {
					errorCallback(new Error(`${target}文件已存在`));
				} else if (typeof successCallback === "function") {
					successCallback();
				}
			} else if (typeof successCallback === "function") {
				successCallback();
			}
		} else if (checkVersion(nodeProcess.versions.node, "10.12.0") > -1) {
			lib.node.fs.mkdir(target, { recursive: true }, e => {
				if (e) {
					if (typeof errorCallback === "function") {
						errorCallback(e);
					} else {
						throw e;
					}
				} else if (typeof successCallback === "function") {
					successCallback();
				}
			});
		} else {
			const paths = directory.split("/").reverse();
			let path = dirname;
			const redo = () => {
				path = lib.node.path.join(path, paths.pop());
				const exists = lib.node.fs.existsSync(path);
				const callback = e => {
					if (e) {
						if (typeof errorCallback !== "function") {
							throw e;
						}
						errorCallback(e);
						return;
					}
					if (paths.length) {
						return redo();
					}
					if (typeof successCallback === "function") {
						successCallback();
					}
				};
				if (!exists) {
					lib.node.fs.mkdir(path, callback);
				} else {
					callback();
				}
			};
			redo();
		}
	};
	game.removeDir = (directory, successCallback, errorCallback) => {
		const target = lib.node.path.join(dirname, directory);
		if (!lib.node.fs.existsSync(target)) {
			if (typeof errorCallback === "function") {
				errorCallback(new Error(`${target}不存在`));
			}
		} else if (!lib.node.fs.lstatSync(target).isDirectory()) {
			if (typeof errorCallback === "function") {
				errorCallback(new Error(`${target}不是文件夹`));
			}
		} else if (checkVersion(nodeProcess.versions.node, "12.10.0") > -1) {
			lib.node.fs.rmdir(target, { recursive: true }, e => {
				if (e) {
					if (typeof errorCallback === "function") {
						errorCallback(e);
					} else {
						throw e;
					}
				} else if (typeof successCallback === "function") {
					successCallback();
				}
			});
		} else {
			const deleteFolderRecursive = path => {
				if (!lib.node.fs.existsSync(path)) {
					return;
				}
				lib.node.fs.readdirSync(path).forEach(file => {
					const currentPath = `${path}/${file}`;
					if (lib.node.fs.lstatSync(currentPath).isDirectory()) {
						deleteFolderRecursive(currentPath);
					} else {
						lib.node.fs.unlinkSync(currentPath);
					}
				});
				lib.node.fs.rmdirSync(path);
				if (path === target && typeof successCallback === "function") {
					successCallback();
				}
			};
			try {
				deleteFolderRecursive(target);
			} catch (e) {
				if (typeof errorCallback === "function") {
					errorCallback(e);
				} else {
					throw e;
				}
			}
		}
	};
	if (ui.updateUpdate) {
		ui.updateUpdate();
	}
}
