//@ts-nocheck

// —— 纯静态部署支持 ——
// 无名杀在浏览器端原本依赖 @noname/fs 文件服务器(/checkFile /readFile 等 HTTP 接口)读写磁盘。
// 但纯静态托管(GitHub Pages / 各类 CDN 等)没有这个后端。此时:
//  - 读游戏自带素材 → 直接 fetch 真实 URL(文件本就在那个地址,比 base64 塞 JSON 更快且可被缓存)
//  - 写文件 / 用户内容 / 列目录 → 用 IndexedDB 模拟一个可写的虚拟文件系统
// 是否走静态模式由启动时探测文件服务器决定(见 browserReady)。

const FS_DB_NAME = "noname_fs";
const FS_STORE = "files";
/** @type {Promise<IDBDatabase> | null} */
let fsDBPromise = null;

function fsDB() {
	if (!fsDBPromise) {
		fsDBPromise = new Promise((resolve, reject) => {
			const req = indexedDB.open(FS_DB_NAME, 1);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains(FS_STORE)) db.createObjectStore(FS_STORE);
			};
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
		});
	}
	return fsDBPromise;
}

// 统一去掉前导斜杠,保证 IndexedDB key 一致(文件服务器传入的路径本就不带前导斜杠)
const fsNorm = p => String(p).replace(/^\/+/, "");

// 带超时的 fetch。【关键】纯静态模式下探测文件用的 HEAD 请求**不会进 Service Worker**
// (pwa-sw.js 只接管 GET:`if (req.method !== "GET") return;`),因此 SW 的超时兜底对它无效,
// 断网时只能等 iOS 网络栈自己的默认超时(约 60s)→ boot 的 await 空转一分钟 → 30s 看门狗先弹
// "游戏似乎未正常载入,是否重置"→ 白屏。故这类绕过 SW 的请求必须在源头自带超时。
function fetchWithTimeout(input, init, ms = 2000) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), ms);
	return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function fsGet(path) {
	const db = await fsDB();
	return new Promise((resolve, reject) => {
		const r = db.transaction(FS_STORE).objectStore(FS_STORE).get(fsNorm(path));
		r.onsuccess = () => resolve(r.result);
		r.onerror = () => reject(r.error);
	});
}

async function fsPut(path, value) {
	const db = await fsDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(FS_STORE, "readwrite");
		tx.objectStore(FS_STORE).put(value, fsNorm(path));
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

async function fsDelete(path) {
	const db = await fsDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(FS_STORE, "readwrite");
		tx.objectStore(FS_STORE).delete(fsNorm(path));
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

async function fsKeys() {
	const db = await fsDB();
	return new Promise((resolve, reject) => {
		const r = db.transaction(FS_STORE).objectStore(FS_STORE).getAllKeys();
		r.onsuccess = () => resolve(r.result || []);
		r.onerror = () => reject(r.error);
	});
}

export default async function browserReady({ lib, game }) {
	lib.path = (await import("path-browserify-esm")).default;

	// 探测文件服务器是否可用:成功 → dev 环境(走 HTTP 接口);失败 → 纯静态部署(走 URL + IndexedDB)。
	// 加 2 秒超时:断网/纯静态部署时,若 SW 未及时接管该请求,避免 fetch 干等网络超时(几十秒)导致启动白屏。
	let hasFileServer = false;
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 2000);
		const result = await fetch(`/checkFile?fileName=noname.js`, { signal: controller.signal }).then(response => response.json());
		clearTimeout(timer);
		hasFileServer = !!result?.success;
	} catch (e) {
		hasFileServer = false;
	}
	if (!hasFileServer) {
		console.log("[noname] 未检测到文件服务器,启用纯静态模式(fetch URL + IndexedDB)");
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
		if (!hasFileServer) {
			// 纯静态:先查 IndexedDB(用户写入的),再用 HEAD 请求探测游戏自带文件。
			// HEAD 绕过 SW,必须自带超时(见 fetchWithTimeout 注释),否则断网时空转 60s 卡死 boot。
			(async () => {
				if ((await fsGet(fileName)) !== undefined) return 1;
				try {
					const resp = await fetchWithTimeout(fileName, { method: "HEAD" });
					return resp.ok ? 1 : -1;
				} catch (e) {
					return -1;
				}
			})().then(callback, onerror);
			return;
		}
		fetch(`/checkFile?fileName=${fileName}`)
			.then(response => response.json())
			.then(result => {
				if (result) {
					if (result.success) {
						switch (result.data) {
							case "file":
								callback?.(1);
								return;
							case "directory":
								callback?.(0);
								return;
							default:
								callback?.(-1);
								return;
						}
					}
				}

				onerror?.(result?.errorMsg);
			})
			.catch(onerror);
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
		if (!hasFileServer) {
			// 纯静态:IndexedDB 里若有以该目录为前缀的 key,视为目录存在;否则未知(-1)
			(async () => {
				const prefix = fsNorm(dir).replace(/\/*$/, "/");
				const keys = await fsKeys();
				return keys.some(k => String(k).startsWith(prefix)) ? 1 : -1;
			})().then(callback, onerror);
			return;
		}
		fetch(`/checkDir?dir=${dir}`)
			.then(response => response.json())
			.then(result => {
				if (result) {
					if (result.success) {
						switch (result.data) {
							case "file":
								callback?.(0);
								return;
							case "directory":
								callback?.(1);
								return;
							default:
								callback?.(-1);
								return;
						}
					}
				}

				onerror?.(result?.errorMsg);
			})
			.catch(onerror);
	};

	game.readFile = function readFile(fileName, callback = () => {}, error = () => {}) {
		if (!hasFileServer) {
			// 纯静态:先查 IndexedDB(用户写入),否则直接 fetch 真实 URL 取二进制
			(async () => {
				const stored = await fsGet(fileName);
				if (stored !== undefined) {
					if (stored instanceof ArrayBuffer) return stored;
					if (stored instanceof Blob) return await stored.arrayBuffer();
					if (typeof stored === "string") return new TextEncoder().encode(stored).buffer;
					return new Uint8Array(stored).buffer;
				}
				const resp = await fetch(fileName);
				if (!resp.ok) throw new Error(`readFile 失败: ${fileName} (${resp.status})`);
				return await resp.arrayBuffer();
			})().then(callback, error);
			return;
		}
		fetch(`/readFile?fileName=${fileName}`)
			.then(response => response.json())
			.then(result => {
				if (result?.success) {
					const data = result.data;

					/** @type {Uint8Array} */
					let buffer;
					if (typeof data == "string") {
						buffer = Uint8Array.fromBase64(data);
					} else if (Array.isArray(data)) {
						buffer = new Uint8Array(data);
					}

					callback(buffer.buffer);
				} else {
					error(result?.errorMsg);
				}
			})
			.catch(error);
	};

	game.readFileAsText = function readFileAsText(fileName, callback = () => {}, error = () => {}) {
		if (!hasFileServer) {
			(async () => {
				const stored = await fsGet(fileName);
				if (stored !== undefined) {
					if (typeof stored === "string") return stored;
					if (stored instanceof Blob) return await stored.text();
					if (stored instanceof ArrayBuffer) return new TextDecoder().decode(stored);
					return new TextDecoder().decode(new Uint8Array(stored));
				}
				const resp = await fetch(fileName);
				if (!resp.ok) throw new Error(`readFileAsText 失败: ${fileName} (${resp.status})`);
				return await resp.text();
			})().then(callback, error);
			return;
		}
		fetch(`/readFileAsText?fileName=${fileName}`)
			.then(response => response.json())
			.then(result => {
				if (result?.success) {
					callback(result.data);
				} else {
					error(result?.errorMsg);
				}
			})
			.catch(error);
	};

	game.writeFile = function writeFile(data, path, name, callback = () => {}) {
		game.ensureDirectory(path, () => {
			if (Object.prototype.toString.call(data) == "[object File]") {
				const fileReader = new FileReader();
				fileReader.onload = event => {
					game.writeFile(event.target.result, path, name, callback);
				};
				fileReader.readAsArrayBuffer(data, "UTF-8");
			} else {
				let filePath = path;
				if (path.endsWith("/")) {
					filePath += name;
				} else if (path == "") {
					filePath += name;
				} else {
					filePath += "/" + name;
				}

				if (!hasFileServer) {
					// 纯静态:写入 IndexedDB 虚拟文件系统
					fsPut(filePath, data).then(
						() => callback(),
						e => callback(String(e))
					);
					return;
				}

				fetch(`/writeFile`, {
					method: "post",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						data:
							typeof data == "string"
								? data
								: Array.prototype.slice.call(new Uint8Array(data)),
						path: filePath,
					}),
				})
					.then(response => response.json())
					.then(result => {
						if (result?.success) {
							callback();
						} else {
							callback(result?.errorMsg);
						}
					});
			}
		});
	};

	game.removeFile = function removeFile(fileName, callback = () => {}, error = () => {}) {
		if (!hasFileServer) {
			fsDelete(fileName).then(() => callback(), error);
			return;
		}
		fetch(`/removeFile?fileName=${fileName}`)
			.then(response => response.json())
			.then(result => {
				callback(result.errorMsg);
			})
			.catch(error);
	};

	game.getFileList = function getFileList(dir, callback = () => {}, onerror) {
		if (!hasFileServer) {
			// 纯静态:静态服务器无法列目录,只能枚举 IndexedDB 里该目录下用户写入的内容。
			// 游戏自带目录(如 extension/)无法枚举 → 自动导入扩展等功能降级,不影响核心玩法。
			(async () => {
				const prefix = fsNorm(dir).replace(/\/*$/, "/");
				const keys = (await fsKeys()).map(String).filter(k => k.startsWith(prefix));
				const folders = new Set();
				const files = new Set();
				for (const k of keys) {
					const rest = k.slice(prefix.length);
					const slash = rest.indexOf("/");
					if (slash === -1) files.add(rest);
					else folders.add(rest.slice(0, slash));
				}
				return [[...folders], [...files]];
			})().then(([folders, files]) => callback(folders, files), onerror);
			return;
		}
		fetch(`/getFileList?dir=${dir}`)
			.then(response => response.json())
			.then(result => {
				if (!result) {
					throw new Error("Cannot get available resource.");
				}

				if (result.success) {
					callback(result.data.folders, result.data.files);
				} else if (onerror) {
					onerror(new Error(result.errorMsg));
				}
			});
	};

	game.ensureDirectory = function ensureDirectory(list, callback = () => {}, file = false) {
		let pathArray = typeof list == "string" ? list.split("/") : list;
		if (file) {
			pathArray = pathArray.slice(0, -1);
		}
		game.createDir(pathArray.join("/"), callback, console.error);
	};

	game.createDir = function createDir(
		directory,
		successCallback = () => {},
		errorCallback = () => {}
	) {
		if (!hasFileServer) {
			// 纯静态:IndexedDB 里目录是隐式的(由文件 key 前缀体现),无需显式创建
			successCallback();
			return;
		}
		fetch(`/createDir?dir=${directory}`)
			.then(response => response.json())
			.then(result => {
				if (result?.success) {
					successCallback();
				} else {
					errorCallback(new Error("创建文件夹失败"));
				}
			})
			.catch(errorCallback);
	};
	game.removeDir = function removeDir(
		directory,
		successCallback = () => {},
		errorCallback = () => {}
	) {
		if (!hasFileServer) {
			// 纯静态:删除 IndexedDB 里该目录前缀下的所有文件
			(async () => {
				const prefix = fsNorm(directory).replace(/\/*$/, "/");
				const keys = (await fsKeys()).map(String).filter(k => k.startsWith(prefix));
				await Promise.all(keys.map(k => fsDelete(k)));
			})().then(successCallback, errorCallback);
			return;
		}
		fetch(`/removeDir?dir=${directory}`)
			.then(response => response.json())
			.then(result => {
				if (result?.success) {
					successCallback();
				} else {
					errorCallback(new Error("创建文件夹失败"));
				}
			})
			.catch(errorCallback);
	};
}
