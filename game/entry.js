import { game, get, lib, boot, onload } from "../noname.js";
import { canUseHttpProtocol, sendUpdate } from "../noname/init/index.js";

let [core, version] = get.coreInfo();

/**
 * @type {Promise<unknown>}
 */
let waitUpdate = Promise.resolve();
if (core === "chrome" && !isNaN(version) && version < 85) {
	/*
	const tip = "检测到您的浏览器内核版本小于85，请及时升级浏览器或手机webview内核！";
	console.warn(tip);
	game.print(tip);
	const redirect_tip = `您使用的浏览器或无名杀客户端内核版本过低，将在未来的版本被废弃！\n目前使用的浏览器UA信息为：\n${userAgent}\n点击“确认”以前往GitHub下载最新版无名杀客户端（可能需要科学上网）。`;
	if (confirm(redirect_tip)) {
		window.open("https://github.com/libccy/noname/releases/tag/chromium77-client");
	}
	*/
	waitUpdate = game.tryUpdateClient(/** UpdateReason.UNDERSUPPORT **/ 4);
}

waitUpdate
	.then(boot)
	.then(() => {
		// 判断是否从file协议切换到http/s协议
		if (canUseHttpProtocol()) {
			// 保存协议的切换状态
			const saveProtocol = () => {
				const url = sendUpdate();
				if (typeof url == "string") {
					if (typeof window.require == "function" && typeof window.process == "object") {
						// @ts-ignore
						const remote = require("@electron/remote");
						const thisWindow = remote.getCurrentWindow();
						thisWindow.loadURL(url);
					} else {
						location.href = url;
					}
				}
			};
			/*
		升级方法:
			1. 游戏启动后导出数据，然后以http/s协议重启
			2. 以http/s协议导入数据
			3. 保存http/s协议的状态，以后不再以file协议启动
		*/
			// 导出数据到根目录的noname.config.txt
			if (navigator.notification) {
				navigator.notification.activityStart("正在进行升级", "请稍候");
			}
			let data;
			let export_data = function (data) {
				if (navigator.notification) {
					navigator.notification.activityStop();
				}
				game.promises
					.writeFile(lib.init.encode(JSON.stringify(data)), "./", "noname.config.txt")
					.then(saveProtocol)
					.catch(e => {
						console.error("升级失败:", e);
					});
			};
			// @ts-ignore
			if (!lib.db) {
				data = {};
				for (let i in localStorage) {
					if (i.startsWith(lib.configprefix)) {
						data[i] = localStorage[i];
					}
				}
				export_data(data);
			} else {
				game.getDB("config", null, function (data1) {
					game.getDB("data", null, function (data2) {
						export_data({
							config: data1,
							data: data2,
						});
					});
				});
			}
		} else {
			let searchParams = new URLSearchParams(location.search);
			for (let [key, value] of searchParams) {
				// 成功导入后删除noname.config.txt
				if (key === "sendUpdate" && value === "true") {
					if (navigator.notification) {
						navigator.notification.activityStart("正在导入旧版数据", "请稍候");
					}
					return game.promises
						.readFileAsText("noname.config.txt")
						.then(data => {
							return /** @type {Promise<void>} */ (
								// eslint-disable-next-line no-async-promise-executor
								new Promise(async (resolve, reject) => {
									if (!data) return reject("!data");
									try {
										data = JSON.parse(lib.init.decode(data));
										if (!data || typeof data != "object") {
											throw "err";
										}
										// @ts-ignore
										if (lib.db && (!data.config || !data.data)) {
											throw "err";
										}
									} catch (e) {
										console.log(e);
										if (e == "err") {
											alert("导入文件格式不正确");
											reject("导入文件格式不正确");
										} else {
											alert("导入失败： " + e.message);
											reject("导入失败： " + e.message);
										}
										return;
									}
									if (navigator.notification) {
										navigator.notification.activityStop();
									}
									alert("升级前的配置导入成功, 即将自动重启");
									// @ts-ignore
									if (!lib.db) {
										const noname_inited = localStorage.getItem("noname_inited");
										const onlineKey = localStorage.getItem(lib.configprefix + "key");
										localStorage.clear();
										if (noname_inited) {
											localStorage.setItem("noname_inited", noname_inited);
										}
										if (onlineKey) {
											localStorage.setItem(lib.configprefix + "key", onlineKey);
										}
										for (let i in data) {
											localStorage.setItem(i, data[i]);
										}
									} else {
										for (let i in data.config) {
											await game.putDB("config", i, data.config[i]);
											lib.config[i] = data.config[i];
										}
										for (let i in data.data) {
											await game.putDB("data", i, data.data[i]);
										}
									}
									lib.init.background();
									resolve();
								})
							);
						})
						.then(() => {
							return game.promises.removeFile("noname.config.txt");
						})
						.then(() => {
							const url = new URL(location.href);
							url.searchParams.delete("sendUpdate");
							location.href = url.toString();
						})
						.catch(e => {
							if (navigator.notification) {
								navigator.notification.activityStop();
							}
						});
				}
				// 新客户端导入扩展
				else if (key === "importExtensionName") {
					lib.config.extensions.add(value);

					let waitings = [];

					waitings.push(game.promises.saveConfig("extensions", lib.config.extensions));
					waitings.push(game.promises.saveConfig(`extension_${value}_enable`, true));
					alert(`扩展${value}已导入成功，点击确定重启游戏`);

					return Promise.allSettled(waitings).then(() => {
						const url = new URL(location.href);
						url.searchParams.delete("importExtensionName");
						location.href = url.toString();
					});
				}
			}
		}
	})
	.then(onload);
