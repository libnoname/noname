import { userAgentLowerCase, compatibleEnvironment, androidNewStandardApp, device } from "@/util/index.js";
import { get } from "@/get/compatible.js";

export class GameCompatible {
	/**
	 * `game/game.js`中退出客户端用到的代码
	 *
	 * @author Spmario233
	 */
	exit() {
		const ios = userAgentLowerCase.includes("iphone") || userAgentLowerCase.includes("ipad") || userAgentLowerCase.includes("macintosh");
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
		 * @param {typeof import("../library/update.js")} param1
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
					let tips = ["您使用的无名杀客户端已达到最新，但目前的浏览器内核版本过低，未来可能将无法使用！", "目前使用的浏览器UA信息为: ", userAgentLowerCase, "新版本的客户端在机器存在Chrome的情况下会直接使用Chrome的内核", "请前往下载最新版的Chrome，以获取最佳的体验！", "稍后游戏将继续正常运行，但我们不保证不会出现任何报错"].join("\n");

					let packageName = window.NonameAndroidBridge.getPackageName();
					if (!(packageName.includes("shijian") || packageName.includes("yuri"))) {
						tips = ["您使用的无名杀客户端已达到最新，但目前的浏览器内核版本过低，未来可能将无法使用！", "目前使用的浏览器UA信息为: ", userAgentLowerCase, "检测到你现在使用的是第三方客户端，请联系客户端制作者寻求帮助！", "稍后游戏将继续正常运行，但我们不保证不会出现任何报错"].join("\n");
					}

					alert(tips);
				}
				// 使用旧版安卓客户端，提示更新，在版本号为77时识别为兼容版
				// 此时将先考虑能不能加载更新代码
				else if (device == "android") {
					let tips = ["你使用的无名杀客户端版本号未达到最新无名杀需要的要求，未来可能将无法正常运行无名杀！", "目前使用的浏览器UA信息为: ", userAgentLowerCase, "如果你使用的是第三方客户端，请联系客户端制作者更新或寻求解决方法！", "点击“确认”将开始下载最新版客户端（如果你使用的是第三方客户端，请不要点击“确认”）", "稍后游戏将继续正常运行，但我们不保证不会出现任何报错"].join("\n");
					let fallbacks = ["你使用的无名杀客户端版本号未达到最新无名杀需要的要求，已无法正常运行无名杀！", "目前使用的浏览器UA信息为: ", userAgentLowerCase, "如果你使用的是第三方客户端，请联系客户端制作者更新或寻求解决方法！", "点击“确认”以前往GitHub下载最新版无名杀客户端（可能需要科学上网）"].join("\n");

					/**
					 * @param {typeof import("../library/update.js")} module
					 * @returns {Promise<void>}
					 */
					function callback(module) {
						// 此时已经加载了update.js，可以尝试更新
						if (confirm(tips)) {
							let url = "https://ghproxy.cc/https://github.com/libnoname/noname/releases/download/chromium85-client/Noname-yuri-v1.9.3.apk";

							if (coreVersion == 77) {
								let compatibleTips = ["检测到你现在的版本号为上版本兼容版的版本号，由于当前版本无法确认是否为兼容版，特此在此再次询问", "请问你是否需要下载最新的兼容版？", "（目前由理版可直接使用已安装的Chrome内核，但如果无法安装最新的Chrome，依然需要兼容版）"].join("\n");
								if (confirm(compatibleTips)) {
									url = "https://ghproxy.cc/https://github.com/libnoname/noname/releases/download/chromium85-client/Noname-yuri-compatible-v1.8.4.apk";
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
					let tips = ["你使用的无名杀客户端版本号未达到最新无名杀需要的要求，未来可能将无法正常运行无名杀！", "目前使用的浏览器UA信息为: ", userAgentLowerCase, "如果你使用的是第三方客户端，请联系客户端制作者更新或寻求解决方法！", "点击“确认”以前往GitHub下载最新版无名杀客户端（可能需要科学上网）", "稍后游戏将继续正常运行，但我们不保证不会出现任何报错"].join("\n");
					fallback(tips);
				}
				// 使用chrome的，直接提示更新（不是现在还有人用Chrome 85以下的版本吗）
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

export let game = new GameCompatible();

/**
 * @enum {number}
 * @constant
 */
export const UpdateReason = {
	DEBUG: 1,
	FALLBACK: 2,
	UNDERSUPPORT: 4,
};
