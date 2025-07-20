"use strict";

(async function () {
	// 预设定常量
	/**
	 * 最低要求的Safari版本
	 *
	 * @type {[majorVersion: number, minorVersion: number, patchVersion: number]}
	 */
	const minSafariVersion = [16, 4, 0];

	// 获取基础变量
	/**
	 * @type {import("../noname-compatible.js")}
	 */
	const {
		game,
		get,
		util: { nonameInitialized, assetURL, userAgentLowerCase, compatibleEnvironment },
		UpdateReason,
	} = await import("../noname-compatible.js").catch(importFallback);

	// 使用到的文本
	const globalText = {
		GPL_ALERT: ["①无名杀是一款基于GPLv3协议的开源软件！", "你可以在遵守GPLv3协议的基础上任意使用，修改并转发《无名杀》，以及所有基于《无名杀》开发的拓展。", "点击“确定”即代表您认可并接受GPLv3协议↓️", "https://www.gnu.org/licenses/gpl-3.0.html", "②无名杀官方发布地址仅有GitHub仓库！", "其他所有的所谓“无名杀”社群（包括但不限于绝大多数“官方”QQ群、QQ频道等）均为玩家自发组织，与无名杀官方无关！"].join("\n"),
		LOAD_ENTRY_FAILED: ["您使用的浏览器或《无名杀》客户端加载内容失败！", "请检查是否缺少游戏文件！隔版本更新请下载完整包而不是离线包！", "目前使用的浏览器UA信息为: ", userAgentLowerCase, "若您使用的客户端为自带内核的旧版“兼容版”，请及时更新客户端版本！", "若您使用的客户端为手机端的非兼容版《无名杀》，请尝试更新手机的WebView内核，或者更换为1.8.2版本及以上的兼容版！", "若您是直接使用浏览器加载index.html进行游戏，请改为运行文件夹内的“noname-server.exe”（或使用VSCode等工具启动Live Server），以动态服务器的方式启动《无名杀》！", "若您使用的是苹果端，请至少将Safari升级至16.4.0！"].join("\n"),
		REDIRECT_TIP: ["您使用的浏览器或无名杀客户端的版本或内核版本过低，已经无法正常运行无名杀！", "目前使用的浏览器UA信息为: ", userAgentLowerCase, "如果你使用的是浏览器，请更新你的浏览器内核！", "如果你使用的是无名杀客户端，点击“确认”以前往GitHub下载最新版无名杀客户端（可能需要科学上网）。", "（第三方客户端请联系第三方客户端的发布者）"].join("\n"),
		SAFARI_VERSION_NOT_SUPPORT: ["您使用的Safari浏览器无法支持当前无名杀所需的功能，请至少升级至16.4.0！", "当前浏览器的UA为: ", userAgentLowerCase, "稍后您的无名杀将自动退出（可能的话）"].join("\n"),
		SERVICE_WORKER_NOT_SUPPORT: ["您使用的客户端或浏览器不支持启用serviceWorker", "请确保您的客户端或浏览器使用http://localhost或https协议打开《无名杀》并且启用serviceWorker！"].join("\n"),
		SERVICE_WORKER_LOAD_FAILED: ["serviceWorker加载失败！", "游戏内容或许会因此加载失败！"].join("\n"),
	};

	// 不支持file协议
	if (location.protocol.startsWith("file")) {
		return alert(globalText.REDIRECT_TIP);
	}

	// 必须启用serviceWorker
	if (!("serviceWorker" in navigator)) {
		return alert(globalText.SERVICE_WORKER_NOT_SUPPORT);
	}

	// 检查 window 对象中是否存在 "__core-js_shared__" 属性
	if (!("__core-js_shared__" in window)) {
		// 如果不存在，则执行以下操作
		await new Promise(resolve => {
			// 创建一个新的 <script> 元素
			const coreJSBundle = document.createElement("script");
			// 为 script 元素设置 onerror 和 onload 事件处理程序
			// 当出错或加载完成时，调用 resolve 函数以解决 Promise
			coreJSBundle.onerror = coreJSBundle.onload = resolve;
			// 设置 script 元素的 src 属性，指向 core-js-bundle.js 文件
			coreJSBundle.src = `${assetURL}game/core-js-bundle.js`;
			// 将 script 元素添加到 document.head 中
			document.head.appendChild(coreJSBundle);
		});
	}

	// 检查是否已经显示过GPL许可协议警告
	if (!localStorage.getItem("gplv3_noname_alerted")) {
		// 判断游戏是否已经初始化过
		const gameIntialized = nonameInitialized && nonameInitialized.length > 0;

		// 如果满足以下条件之一，则显示GPL许可协议警告:
		// 1. 已经初始化过
		// 2. 用户确认显示GPL许可协议警告
		if (gameIntialized || confirm(globalText.GPL_ALERT)) {
			// 记录已显示过GPL许可协议警告
			localStorage.setItem("gplv3_noname_alerted", String(true));
		} else {
			// 如果用户拒绝显示GPL许可协议警告，则退出程序
			game.exit();
		}
	}

	window["bannedExtensions"] = [
		"\u4fa0\u4e49",
		"\u5168\u6559\u7a0b",
		"在线更新", //游戏内在线更新方式修改了，不再依赖于在线更新扩展了
	];

	// 检查是否是Safari浏览器
	// 通过检查用户代理字符串是否包含 "safari" 且不包含 "chrome"，可以初步判断是不是Safari
	if (userAgentLowerCase.includes("safari") && !userAgentLowerCase.includes("chrome")) {
		// 如果是 Safari 浏览器,则进行以下操作
		// 获取 Safari 版本信息
		let [coreName, ...safariVersion] = get.coreInfo();
		// 检查 Safari 的内核名称是否为 "safari"，以及版本号是否低于要求的最小版本号
		// 如果无法判定是Safari，则证明这个浏览器内核很玄乎，我们表示对未知的、不符合标准的内核无能为力，只能等出问题了再适配
		if (coreName === "safari" && !get.checkVersion(minSafariVersion, safariVersion)) {
			// 如果版本号低于要求的最小版本号,则执行以下操作
			// 显示警告消息
			alert(globalText.SAFARI_VERSION_NOT_SUPPORT);
			// 退出程序
			game.exit();
			return;
		}
	}
	// Safari由于系统原因，管不了，先默哀几秒

	// 处理Node环境下的http情况
	if (typeof window.require == "function" && typeof window.process == "object" && typeof window.__dirname == "string") {
		// 在http环境下修改__dirname和require的逻辑
		if (window.__dirname.endsWith("electron.asar\\renderer") || window.__dirname.endsWith("electron.asar/renderer")) {
			const path = require("path");
			if (window.process.platform === "darwin") {
				window.__dirname = path.join(window.process.resourcesPath, "app");
			} else {
				window.__dirname = path.join(path.resolve(), "resources/app");
			}
			const oldData = Object.entries(window.require);
			// @ts-expect-error ignore
			window.require = function (moduleId) {
				try {
					return module.require(moduleId);
				} catch {
					return module.require(path.join(window.__dirname, moduleId));
				}
			};
			oldData.forEach(([key, value]) => {
				window.require[key] = value;
			});
		}
		// 增加导入ts的逻辑
		window.require.extensions[".ts"] = function (module, filename) {
			// @ts-expect-error ignore
			const _compile = module._compile;
			// @ts-expect-error ignore
			module._compile = function (code, fileName) {
				/**
				 *
				 * @type { import("typescript") }
				 */
				// @ts-expect-error ignore
				const ts = require("./game/typescript.js");
				// 使用ts compiler对ts文件进行编译
				const result = ts.transpile(
					code,
					{
						module: ts.ModuleKind.CommonJS,
						target: ts.ScriptTarget.ES2020,
						inlineSourceMap: true,
						resolveJsonModule: true,
						esModuleInterop: true,
					},
					fileName
				);
				// 使用默认的js编译函数获取返回值
				return _compile.call(this, result, fileName);
			};
			// @ts-expect-error ignore
			module._compile(require("fs").readFileSync(filename, "utf8"), filename);
		};
	}

	// 使serviceWorker加载完成后，再加载entry.js
	if ("serviceWorker" in navigator) {
		let scope = new URL("./", location.href).toString();
		let registrations = await navigator.serviceWorker.getRegistrations();
		let findServiceWorker = registrations.find(registration => {
			return registration && registration.active && registration.active.scriptURL == `${scope}service-worker.js`;
		});

		try {
			const registration_1 = await navigator.serviceWorker.register(`${scope}service-worker.js`, {
				type: "module",
				updateViaCache: "all",
				scope,
			});
			// 初次加载worker，需要重新启动一次
			if (!findServiceWorker) {
				location.reload();
			}
			// 接收消息
			navigator.serviceWorker.addEventListener("message", e => {
				if (e.data?.type === "reload") {
					window.location.reload();
				}
			});
			// 发送消息
			// navigator.serviceWorker.controller.postMessage({ action: "reload" });
			registration_1.update().catch(e => console.error("worker update失败", e));
			if (!sessionStorage.getItem("canUseTs")) {
				await import("./canUse.ts")
					.then(({ text }) => console.log(text))
					.catch(() => {
						sessionStorage.setItem("canUseTs", "1");
						location.reload();
					});
			}
		} catch (e_1) {
			console.log("serviceWorker加载失败: ", e_1);
			return alert(globalText.SERVICE_WORKER_LOAD_FAILED);
		}
	}

	// 创建一个新的 <script> 元素
	const script = document.createElement("script");
	// 设置该 <script> 元素为模块脚本
	script.type = "module";
	// 设置 <script> 元素的 src 属性,指向 entry.js 文件
	script.src = `${assetURL}game/entry.js`;
	// 设置该脚本为异步加载
	script.async = true;
	// 为 <script> 元素设置 onerror 事件处理程序
	script.onerror = event => {
		// 在控制台输出错误信息
		console.error(event);
		// 获取加载失败的提示信息
		const message = globalText.LOAD_ENTRY_FAILED;
		// 在控制台输出提示信息
		console.error(message);
		// 显示提示信息
		alert(message);
	};
	// 将 <script> 元素添加到 document.head 中
	document.head.appendChild(script);

	// 创建一个新的 <script> 元素,用于回退
	let fallback = document.createElement("script");
	// 设置该 <script> 元素为旧式脚本
	fallback.noModule = true;
	// 设置 <script> 元素的 src 属性,指向 fallback.js 文件
	fallback.src = `${assetURL}game/fallback.js`;
	// 为 <script> 元素设置 onload 事件处理程序
	fallback.onload = () => game.tryUpdateClient(UpdateReason.FALLBACK);
	// 将 <script> 元素添加到 document.head 中
	document.head.appendChild(fallback);

	/**
	 *
	 * @return {import("../noname-compatible.js")}
	 */
	function importFallback() {
		class GameCompatible {
			/**
			 * `game/game.js`中退出客户端用到的代码
			 *
			 * @author Spmario233
			 */
			exit() {
				const ios = userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("macintosh");
				//electron
				if (typeof window.process == "object" && typeof window.require == "function") {
					const versions = window.process.versions;
					// @ts-expect-error ignore
					const electronVersion = parseFloat(versions.electron);
					let remote;
					if (electronVersion >= 14) {
						// @ts-expect-error ignore
						remote = require("@electron/remote");
					} else {
						// @ts-expect-error ignore
						remote = require("electron").remote;
					}
					const thisWindow = remote.getCurrentWindow();
					thisWindow.destroy();
					window.process.exit();
				}
				//android-cordova环境
				//ios-cordova环境或ios浏览器环境
				//非ios的网页版
				else if (!ios) {
					window.close();
				}
			}

			/**
			 * @async
			 * @param {UpdateReason} type
			 * @param {string} [text]
			 * @returns {Promise<unknown>}
			 */
			tryUpdateClient(type, text = "") {
				if (!compatibleEnvironment && type != UpdateReason.DEBUG) {
					return Promise.resolve();
				}

				/**
				 * @param {*} url
				 * @param {typeof import("../noname/library/update.js")} param1
				 * @returns {Promise<File>}
				 */
				function update(url, { request, createProgress }) {
					let fileName = undefined;
					let progress = createProgress("正在下载最新客户端");

					// @ts-expect-error ignore
					return (
						request(url, (receivedBytes, total, filename) => {
							if (typeof filename == "string") {
								progress.setFileName(filename);
								fileName = filename;
							}
							let received = 0,
								max = 0;
							if (total) {
								max = +(total / (1024 * 1024)).toFixed(1);
							} else {
								max = 1000;
							}
							received = +(receivedBytes / (1024 * 1024)).toFixed(1);
							if (received > max) {
								max = received;
							}
							progress.setProgressMax(max);
							progress.setProgressValue(received);
						})
							.then(result => (progress.remove(), result))
							// @ts-expect-error ignore
							.then(blob => ((blob.name = fileName), blob))
					);
				}

				/**
				 *
				 * @param {File} blob
				 */
				function open(blob) {
					let link = URL.createObjectURL(blob);
					let a = document.createElement("a");
					a.href = link;
					a.download = blob.name;
					a.addEventListener("click", () => {
						setTimeout(() => URL.revokeObjectURL(link), 100);
					});
					a.click();
				}

				/**
				 * @param {string} text
				 */
				function fallback(text) {
					// 显示一个确认对话框，询问是否要重定向到 GitHub 页面
					if (confirm(text)) {
						// 如果确认,则打开新的浏览器窗口,跳转到指定的 GitHub 页面
						window.open("https://github.com/libnoname/noname/releases/tag/chromium85-client");
					}
				}

				switch (type) {
					case UpdateReason.DEBUG: {
						// 测试环境
						let url = "https://ghproxy.cc/https://github.com/libnoname/noname/releases/download/chromium85-client/Noname-linux-x64.zip";
						return import("../library/update.js").then(module => update(url, module)).then(open);
					}
					case UpdateReason.FALLBACK: {
						// 不支持module的平台
						// 虽然以无名杀直接用了`import`来看，已经不存在这类情况
						// 但还是引导一下去github，防止存在玄学情况
						// 毕竟这种情况下，浏览器自行更新，而客户端也提供不了`noname/library/update.js`的环境

						fallback(text);

						return Promise.resolve();
					}
					case UpdateReason.UNDERSUPPORT: {
						// 可以加载`entry.js`，但版本号低，因为非chrome浏览器不会尝试更新客户端，故只需要考虑chrome的情况
						// 此时需要检测是浏览器还是客户端，客户端的话是chrome版本问题还是webview问题等等
						// 总之如果是webview版本过低的话，此时`noname/library/update.js`的内容可能可以加载出来
						// 故先判断，再尝试下载
						let [_coreName, coreVersion] = get.coreInfo();
						let needToWait = Promise.resolve();

						// 使用新版本的客户端，但版本号不到需要的程度，查看是否是由理版或诗笺版，提示更新chrome
						if (androidNewStandardApp) {
							let tips = ["您使用的无名杀客户端已达到最新，但目前的浏览器内核版本过低，未来可能将无法使用！", "目前使用的浏览器UA信息为: ", userAgent, "新版本的客户端在机器存在Chrome的情况下会直接使用Chrome的内核", "请前往下载最新版的Chrome，以获取最佳的体验！", "稍后游戏将继续正常运行，但我们不保证不会出现任何报错"].join("\n");

							let packageName = window.NonameAndroidBridge.getPackageName();
							if (!(packageName.includes("shijian") || packageName.includes("yuri"))) {
								tips = ["您使用的无名杀客户端已达到最新，但目前的浏览器内核版本过低，未来可能将无法使用！", "目前使用的浏览器UA信息为: ", userAgent, "检测到你现在使用的是第三方客户端，请联系客户端制作者寻求帮助！", "稍后游戏将继续正常运行，但我们不保证不会出现任何报错"].join("\n");
							}

							alert(tips);
						}
						// 使用旧版安卓客户端，提示更新，在版本号为77时识别为兼容版
						// 此时将先考虑能不能加载更新代码
						else if (device == "android") {
							let tips = ["你使用的无名杀客户端版本号未达到最新无名杀需要的要求，未来可能将无法正常运行无名杀！", "目前使用的浏览器UA信息为: ", userAgent, "如果你使用的是第三方客户端，请联系客户端制作者更新或寻求解决方法！", "点击“确认”将开始下载最新版客户端（如果你使用的是第三方客户端，请不要点击“确认”）", "稍后游戏将继续正常运行，但我们不保证不会出现任何报错"].join("\n");
							let fallbacks = ["你使用的无名杀客户端版本号未达到最新无名杀需要的要求，已无法正常运行无名杀！", "目前使用的浏览器UA信息为: ", userAgent, "如果你使用的是第三方客户端，请联系客户端制作者更新或寻求解决方法！", "点击“确认”以前往GitHub下载最新版无名杀客户端（可能需要科学上网）"].join("\n");

							/**
							 * @param {typeof import("../library/update.js")} module
							 * @returns {Promise<void>}
							 */
							function callback(module) {
								// 此时已经加载了update.js，可以尝试更新
								if (confirm(tips)) {
									let url = "https://ghproxy.cc/https://github.com/libnoname/noname/releases/download/chromium85-client/Noname-yuri-v1.9.2.apk";

									if (coreVersion == 77) {
										let compatibleTips = ["检测到你现在的版本号为上版本兼容版的版本号，由于当前版本无法确认是否为兼容版，特此在此再次询问", "请问你是否需要下载最新的兼容版？", "（目前由理版可直接使用已安装的Chrome内核，但如果无法安装最新的Chrome，依然需要兼容版）"].join("\n");
										if (confirm(compatibleTips)) {
											url = "https://ghproxy.cc/https://github.com/libnoname/noname/releases/download/chromium85-client/Noname-yuri-compatible-v1.8.3.apk";
										}
									}

									return update(url, module).then(open);
								}

								return Promise.resolve();
							}

							needToWait = import("../library/update.js").then(callback, () => fallback(fallbacks));
						}
						// 使用电脑端客户端，直接转到github
						else if (typeof window.require == "function") {
							let tips = ["你使用的无名杀客户端版本号未达到最新无名杀需要的要求，未来可能将无法正常运行无名杀！", "目前使用的浏览器UA信息为: ", userAgent, "如果你使用的是第三方客户端，请联系客户端制作者更新或寻求解决方法！", "点击“确认”以前往GitHub下载最新版无名杀客户端（可能需要科学上网）", "稍后游戏将继续正常运行，但我们不保证不会出现任何报错"].join("\n");
							fallback(tips);
						}
						// 使用chrome的，直接提示更新
						else {
							let tips = ["你使用的浏览器内核已无法达到无名杀的最低要求，未来可能将无法使用！", "请更新你的Google Chrome/Chromium内核！", "稍后游戏将继续正常运行，但我们不保证不会出现任何报错"].join("\n");
							alert(tips);
						}

						return needToWait;
					}
					default: {
						return Promise.reject();
					}
				}
			}
		}

		class GetCompatible {
			// require是需求的版本号，current是浏览器环境本身的版本号
			/**
			 *
			 * @param {[majorVersion: number, minorVersion: number, patchVersion: number]} require
			 * @param {[majorVersion: number, minorVersion: number, patchVersion: number]} current
			 * @returns
			 */
			checkVersion(require, current) {
				// 防止不存在的意外，提前截断当前版本号的长度
				if (current.length > require.length) {
					current.length = require.length;
				}

				// 考虑到玄学的NaN情况，记录是否存在NaN
				let flag = false;
				// 从主版本号遍历到修订版本号，只考虑当前版本号的长度
				for (let i = 0; i < current.length; ++i) {
					// 当前环境版本号当前位若是NaN，则记录后直接到下一位
					if (isNaN(current[i])) {
						flag = true;
						continue;
					}
					// 如果此时flag为true且current[i]不为NaN，版本号则不合法，直接否
					if (flag) {
						return false;
					}
					// 上位版本号未达到要求，直接否决
					if (require[i] > current[i]) {
						return false;
					}
					// 上位版本号已超过要求，直接可行
					if (current[i] > require[i]) {
						return true;
					}
				}
				return true;
			}

			/**
			 * 获取当前内核版本信息
			 *
			 * 目前仅考虑`chrome`, `firefox`和`safari`三种浏览器的信息，其余均归于其他范畴
			 *
			 * > 其他后续或许会增加，但`IE`永无可能
			 *
			 * @returns {["firefox" | "chrome" | "safari" | "other", number, number, number]}
			 */
			coreInfo() {
				// 如果存在process并且存在process.versions，则默认为node环境
				if (typeof window.process != "undefined" && typeof window.process.versions == "object") {
					// 如果存在versions.chrome，默认为electron的versions.chrome
					if (window.process.versions.chrome) {
						return parseVersion("chrome", window.process.versions.chrome);
					}
				}

				// Chrome/Chromium下的实验性特性，具体可参见
				// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
				// @ts-expect-error ignore
				if (typeof navigator.userAgentData != "undefined") {
					// @ts-expect-error ignore
					const userAgentData = navigator.userAgentData;
					if (userAgentData.brands && userAgentData.brands.length) {
						const brand = userAgentData.brands.find(({ brand }) => {
							let str = brand.toLowerCase();
							// 当前支持的浏览器中只有chrome支持userAgentData，故只判断chrome的情况
							return str.includes("chrome") || str.includes("chromium");
						});

						// 如果能通过userAgentData找到对应的浏览器信息，则直接返回
						// 反之则继续通过正则表达式匹配userAgent
						if (brand) {
							return ["chrome", parseInt(brand.version), 0, 0];
						}
					}
				}

				// 目前仅考虑Firefox, Chrome和Safari三种浏览器
				// 其余浏览器均归于other
				const regex = /(firefox|chrome|safari)\/(\d+(?:\.\d+)+)/;
				let result = userAgentLowerCase.match(regex);
				if (result == null) {
					return ["other", NaN, NaN, NaN];
				}

				// 非Safari情况可直接返回结果
				if (result[1] !== "safari") {
					// @ts-expect-error Type must be right
					return parseVersion(result[1], result[2]);
				}

				// 以下是所有Safari平台的判断方法
				// macOS以及以桌面显示的移动端则直接判断
				if (/macintosh/.test(userAgentLowerCase)) {
					result = userAgentLowerCase.match(/version\/(\d+(?:\.\d+)+).*safari/);
					if (result == null) {
						return ["other", NaN, NaN, NaN];
					}
				}
				// 不然则通过OS后面的版本号来获取内容
				else {
					let safariRegex = /(?:iphone|ipad); cpu (?:iphone )?os (\d+(?:_\d+)+)/;
					result = userAgentLowerCase.match(safariRegex);
					if (result == null) {
						return ["other", NaN, NaN, NaN];
					}
				}
				// result = userAgent.match(/version\/(\d+(?:\.\d+)+).*safari/)
				return parseVersion("safari", result[1]);

				/**
				 * 通用解析版本号方法
				 *
				 * @param {"firefox" | "chrome" | "safari" | "other"} coreName
				 * @param {string} versions
				 * @returns {["firefox" | "chrome" | "safari" | "other", number, number, number]}
				 */
				function parseVersion(coreName, versions) {
					const [major, minor, patch] = versions.split(".");
					const majorVersion = parseInt(major);

					// 如果major解析为NaN，则整体解析为NaN（此时不考虑minor和patch）
					if (Number.isNaN(majorVersion)) {
						return [coreName, NaN, NaN, NaN];
					}

					// 反之则将不为NaN的minor和patch解析为0
					return [coreName, majorVersion, parseInt(minor) || 0, parseInt(patch) || 0];
				}
			}
		}

		const UpdateReason = {
			DEBUG: 1,
			FALLBACK: 2,
			UNDERSUPPORT: 4,
		};

		const nonameInitialized = localStorage.getItem("noname_inited");
		const assetURL = "";
		const userAgent = navigator.userAgent;
		const userAgentLowerCase = userAgent.toLowerCase();

		return {
			// @ts-expect-error TypeMust
			game: new GameCompatible(),
			get: new GetCompatible(),
			util: {
				// @ts-expect-error TypeMust
				nonameInitialized,
				assetURL,
				userAgent,
				userAgentLowerCase,
				compatibleEnvironment: true,
			},
			UpdateReason,
		};
	}
})();
