/// <reference types="vite/client" />
import { rootURL, lib, game, get, _status, ui, ai, gnc } from "noname";
import { importCardPack, importCharacterPack, importExtension, importMode } from "./import.js";
export { onload } from "./onload.js";
import { userAgentLowerCase, nonameInitialized, device, leaveCompatibleEnvironment } from "@/util/index.js";
import * as config from "@/util/config.js";
import { initializeSandboxRealms } from "@/util/initRealms.js";
import { setOnError } from "@/util/error.ts";
import security from "@/util/security.js";
import { CacheContext } from "@/library/cache/cacheContext.js";

// 判断是否从file协议切换到http/s协议
function shouldChangeToHttpProtocol() {
	// 如果是http了就不用
	if (location.protocol.startsWith("http")) {
		return false;
	}
	// 首次启动不更新(即还没进行过新手教程)
	if (!config.get("new_tutorial")) {
		return false;
	}
	if (typeof nonameInitialized == "string") {
		// 手机端
		if (window.cordova) {
			// 直接确定包名
			// 因为懒人包作者不一定会改成什么版本
			if (nonameInitialized.endsWith("com.noname.shijian/") && window.noname_shijianInterfaces && typeof window.noname_shijianInterfaces.sendUpdate === "function") {
				// 每个app自定义能升级的渠道，比如判断版本
				return window.noname_shijianInterfaces.getApkVersion() >= 16000;
			}
			// 由理版判断，后续所有app都通过此接口来升级协议
			if (window.NonameAndroidBridge && typeof window.NonameAndroidBridge.sendUpdate === "function") {
				return true;
			}
		}
		// 电脑端
		else if (typeof window.require == "function" && typeof window.process == "object") {
			// 从json判断版本号
			const fs = require("fs");
			const path = require("path");
			if (fs.existsSync(path.join(__dirname, "package.json"))) {
				// @ts-expect-error ignore
				const json = require("./package.json");
				// 诗笺电脑版的判断
				return json && Number(json.installerVersion) >= 1.7;
			}
		}
		// 浏览器端
		else {
			return location.protocol.startsWith("http");
		}
	}
	return false;
}

/**
 * 传递升级完成的信息
 * @returns { string | void } 返回一个网址
 */
function sendUpdate() {
	// 手机端
	if (window.cordova) {
		// 直接确定包名
		if (nonameInitialized && nonameInitialized.includes("com.noname.shijian") && window.noname_shijianInterfaces && typeof window.noname_shijianInterfaces.sendUpdate === "function") {
			// 给诗笺版apk的java层传递升级完成的信息
			// @ts-expect-error ignore
			const url = new URL(window.noname_shijianInterfaces.sendUpdate());
			url.searchParams.set("sendUpdate", "true");
			return url.toString();
		}
		// 由理版判断
		if (window.NonameAndroidBridge && typeof window.NonameAndroidBridge.sendUpdate === "function") {
			// 给由理版apk的java层传递升级完成的信息
			// @ts-expect-error ignore
			const url = new URL(window.NonameAndroidBridge.sendUpdate());
			url.searchParams.set("sendUpdate", "true");
			return url.toString();
		}
	}
	// 电脑端
	else if (typeof window.require == "function" && typeof window.process == "object") {
		// 从json判断版本号
		const fs = require("fs");
		const path = require("path");
		if (fs.existsSync(path.join(__dirname, "package.json"))) {
			// @ts-expect-error ignore
			const json = require("./package.json");
			// 诗笺电脑版的判断
			if (json && Number(json.installerVersion) >= 1.7) {
				fs.writeFileSync(path.join(__dirname, "Home", "saveProtocol.txt"), "");
				// 启动http
				const cp = require("child_process");
				cp.exec(`start /min ${__dirname}\\noname-server.exe -platform=electron`, (err, stdout, stderr) => {});
				return `http://localhost:8089/app.html?sendUpdate=true`;
			}
		}
	}
	// 浏览器端
	else {
		return location.href;
	}
}

export function tryUpdateProtocol() {
	// 判断是否从file协议切换到http/s协议
	if (shouldChangeToHttpProtocol()) {
		// 保存协议的切换状态
		const saveProtocol = () => {
			const url = sendUpdate();
			if (typeof url == "string") {
				if (typeof window.require == "function" && typeof window.process == "object") {
					// @ts-expect-error ignore
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
		const readConfig = async () => {
			return game.promises
				.readFileAsText("noname.config.txt")
				.then(data => {
					if (navigator.notification) {
						navigator.notification.activityStart("正在导入数据", "请稍候");
					}
					return /** @type {Promise<void>} */ (
						// eslint-disable-next-line no-async-promise-executor
						new Promise(async (resolve, reject) => {
							if (!data) {
								return reject(new Error("没有数据内容"));
							}
							try {
								data = JSON.parse(lib.init.decode(data));
								if (!data || typeof data != "object") {
									throw "err";
								}
								if (lib.db && (!data.config || !data.data)) {
									throw "err";
								}
							} catch (e) {
								console.log(e);
								if (e == "err") {
									reject(new Error("导入文件格式不正确"));
								} else {
									reject(new Error("导入失败： " + e.message));
								}
								return;
							}
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
					alert("数据导入成功, 即将自动重启");
					const url = new URL(location.href);
					if (url.searchParams.get("sendUpdate")) {
						url.searchParams.delete("sendUpdate");
						location.href = url.toString();
					} else {
						location.reload();
					}
				})
				.catch(e => {
					console.log(e);
					if (window.FileError) {
						if (!(e instanceof window.FileError)) {
							alert(typeof e?.message == "string" ? e.message : JSON.stringify(e));
						} else {
							console.error(`noname.config.txt读取失败: ${Object.keys(window.FileError).find(msg => window.FileError[msg] === e.code)}`);
						}
					}
				})
				.finally(() => {
					if (navigator.notification) {
						navigator.notification.activityStop();
					}
				});
		};
		let searchParams = new URLSearchParams(location.search);
		for (let [key, value] of searchParams) {
			// 成功导入后删除noname.config.txt
			if (key === "sendUpdate" && value === "true") {
				return readConfig();
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
		readConfig();
	}
}

// 无名杀，启动！
export async function boot() {
	leaveCompatibleEnvironment();

	if (typeof window.cordovaLoadTimeout != "undefined") {
		clearTimeout(window.cordovaLoadTimeout);
		delete window.cordovaLoadTimeout;
	}

	for (const link of document.head.querySelectorAll("link")) {
		if (link.href.includes("app/color.css")) {
			link.remove();
			break;
		}
	}
	// 不想看，反正别动
	if (typeof __dirname === "string" && __dirname.length) {
		const dirsplit = __dirname.split("/");
		for (let i = 0; i < dirsplit.length; i++) {
			if (dirsplit[i]) {
				var c = dirsplit[i][0];
				lib.configprefix += /[A-Z]|[a-z]/.test(c) ? c : "_";
			}
		}
		lib.configprefix += "_";
	}

	await import("./polyfill.js");
	// 设定游戏加载时间，超过时间未加载就提醒
	const configLoadTime = parseInt(localStorage.getItem(lib.configprefix + "loadtime") || "10000");
	// 现在不暴露到全局变量里了，直接传给onload
	const resetGameTimeout = setTimeout(lib.init.reset, configLoadTime);

	setServerIndex();
	setBackground();

	lib.get = get;
	lib.ui = ui;
	lib.ai = ai;
	lib.game = game;
	_status.event = lib.element.GameEvent.initialGameEvent();

	setWindowListener();
	const promiseErrorHandler = await setOnError({ lib, game, get, _status });

	// 确认手机端平台
	lib.device = device;

	// 在dom加载完后执行相应的操作
	const waitDomLoad = new Promise(resolve => {
		if (document.readyState !== "complete") {
			window.onload = resolve;
		} else {
			resolve(void 0);
		}
	}).then(onWindowReady.bind(window));

	// 清瑤？過於先進以至於無法運行我們的落後本體，故也就不再檢測

	// Electron平台
	if (typeof window.require === "function") {
		const { nodeReady } = await import("./node.js");
		nodeReady();
	} else {
		lib.path = (await import("path-browserify")).default;
		window.onbeforeunload = function () {
			if (config.get("confirm_exit") && !_status.reloading) {
				return "是否离开游戏？";
			} else {
				return null;
			}
		};
		if (import.meta.env.DEV || typeof lib.device == "undefined") {
			const { browserReady } = await import("./browser.js");
			await browserReady();
		} else {
			const { cordovaReady } = await import("./cordova.js");
			await cordovaReady();
		}
	}

	await loadConfig();

	for (const name in get.config("translate")) {
		lib.translate[name] = get.config("translate")[name];
	}
	if (config.get("compatiblemode")) _status.withError = true;
	if (config.get("debug")) {
		await lib.init.promises.js(`${lib.assetURL}game`, "asset");
		if (window.noname_skin_list) {
			lib.skin = window.noname_skin_list;
			delete window.noname_skin_list;
			delete window.noname_asset_list;
		}
	}

	const sandboxEnabled = !config.get("debug") && !get.is.safari();

	// 初始化沙盒的Realms
	await initializeSandboxRealms(sandboxEnabled);

	// 初始化security
	await security.initSecurity({ lib, game, ui, get, ai, _status, gnc });

	CacheContext.setProxy({ lib, game, get });

	const ua = userAgentLowerCase;
	if ("ontouchstart" in document) {
		if (!config.get("totouched")) {
			game.saveConfig("totouched", true);
			if (typeof lib.device != "undefined") {
				game.saveConfig("low_performance", true);
				game.saveConfig("confirm_exit", true);
				game.saveConfig("touchscreen", true);
				game.saveConfig("fold_mode", false);
				if (ua.indexOf("ipad") == -1) {
					game.saveConfig("phonelayout", true);
				} else if (lib.device === "ios") {
					game.saveConfig("show_statusbar_ios", "overlay");
				}
			} else if (confirm("是否切换到触屏模式？（触屏模式可提高触屏设备的响应速度，但无法使用鼠标）")) {
				game.saveConfig("touchscreen", true);
				if (ua.includes("iphone") || ua.includes("android")) {
					game.saveConfig("phonelayout", true);
				}
				game.reload();
			}
		}
	} else if (config.get("touchscreen")) {
		game.saveConfig("touchscreen", false);
	}
	if (!config.get("toscrolled") && ua.includes("macintosh")) {
		game.saveConfig("toscrolled", true);
		game.saveConfig("mousewheel", false);
	}

	let layout = config.get("layout");
	if (layout == "default" || lib.layoutfixed.indexOf(config.get("mode")) !== -1) {
		layout = "mobile";
	}
	if (layout == "phone") {
		layout = "mobile";
		game.saveConfig("layout", "mobile");
		game.saveConfig("phonelayout", true);
	}
	game.layout = layout;

	await loadCss();
	initSheet();

	await lib.init.promises.js("game", "package");
	const pack = window.noname_package;
	delete window.noname_package;
	for (const name in pack.character) {
		if (config.get("all").sgscharacters.includes(name) || config.get("hiddenCharacterPack").indexOf(name) == -1) {
			config.get("all").characters.push(name);
			lib.translate[name + "_character_config"] = pack.character[name];
		}
	}
	for (const name in pack.card) {
		if (config.get("all").sgscards.includes(name) || config.get("hiddenCardPack").indexOf(name) == -1) {
			config.get("all").cards.push(name);
			lib.translate[name + "_card_config"] = pack.card[name];
		}
	}
	for (const name in pack.play) {
		config.get("all").plays.push(name);
		lib.translate[name + "_play_config"] = pack.play[name];
	}
	for (const name in pack.submode) {
		for (const j in pack.submode[name]) {
			lib.translate[name + "|" + j] = pack.submode[name][j];
		}
	}
	for (const name in pack.mode) {
		if (config.get("hiddenModePack").includes(name)) continue;
		config.get("all").mode.push(name);
		lib.translate[name] = pack.mode[name];
		config.get("gameRecord")[name] ??= { data: {} };
	}
	if (config.get("all").mode.length == 0) {
		config.get("all").mode.push("identity");
		lib.translate.identity = "身份";
		config.get("gameRecord").identity ??= { data: {} };
	}
	if (pack.background) {
		const background = lib.configMenu.appearence.config.image_background.item;
		for (const name in pack.background) {
			if (config.get("hiddenBackgroundPack").includes(name)) continue;
			background[name] = pack.background[name];
		}
		for (const name of config.get("customBackgroundPack")) {
			background[name] = name.slice(name.indexOf("_") + 1);
		}
		background.default = "默认";
	}
	if (pack.music) {
		const music = lib.configMenu.audio.config.background_music.item;
		if (typeof lib.device != "undefined" || typeof window.require === "function") {
			music.music_custom = "自定义音乐";
		}
		config.get("all").background_music = ["music_default"];
		for (const name in pack.music) {
			config.get("all").background_music.push(name);
			music[name] = pack.music[name];
		}
		if (config.get("customBackgroundMusic")) {
			for (const name in config.get("customBackgroundMusic")) {
				config.get("all").background_music.push(name);
				music[name] = config.get("customBackgroundMusic")[name];
			}
		}
		music.music_random = "随机播放";
		music.music_off = "关闭";
	}
	if (pack.theme) {
		for (const name in pack.theme) {
			lib.configMenu.appearence.config.theme.item[name] = pack.theme[name];
		}
	}
	if (pack.font) {
		ui.css.fontsheet = lib.init.sheet();
		const appearenceConfig = lib.configMenu.appearence.config,
			fontSheet = ui.css.fontsheet.sheet,
			suitsFont = config.get("suits_font");
		Object.keys(pack.font).forEach(value => {
			const font = pack.font[value];
			appearenceConfig.name_font.item[value] = font;
			appearenceConfig.identity_font.item[value] = font;
			appearenceConfig.cardtext_font.item[value] = font;
			appearenceConfig.global_font.item[value] = font;
			fontSheet.insertRule(`@font-face {font-family: '${value}'; src: local('${font}'), url('${lib.assetURL}font/${value}.woff2');}`, 0);
			if (suitsFont) {
				fontSheet.insertRule(`@font-face {font-family: '${value}'; src: local('${font}'), url('${lib.assetURL}font/suits.woff2');}`, 0);
			}
		});
		if (suitsFont) {
			fontSheet.insertRule(`@font-face {font-family: 'Suits'; src: url('${lib.assetURL}font/suits.woff2');}`, 0);
		}
		fontSheet.insertRule(`@font-face {font-family: 'NonameSuits'; src: url('${lib.assetURL}font/suits.woff2');}`, 0);
		fontSheet.insertRule(`@font-face {font-family: 'MotoyaLMaru'; src: url('${lib.assetURL}font/motoyamaru.woff2');}`, 0);
		appearenceConfig.cardtext_font.item.default = "默认";
		appearenceConfig.global_font.item.default = "默认";
	}

	if (config.get("image_background_random")) {
		if (_status.htmlbg) {
			game.saveConfig("image_background", _status.htmlbg);
		} else {
			const list = Object.keys(lib.configMenu.appearence.config.image_background.item).filter(i => i !== "default");
			game.saveConfig("image_background", list.randomGet(lib.config.image_background));
		}
		lib.init.background();
		delete _status.htmlbg;
	}
	if (config.get("extension_sources")) {
		for (const name in config.get("extension_sources")) {
			lib.configMenu.general.config.extension_source.item[name] = name;
		}
	}

	// 无名杀更新日志
	await lib.init.promises.js("game", "update");
	if (window.noname_update) {
		lib.version = window.noname_update.version;
		// 更全面的更新内容
		if (config.get(`version_description_v${window.noname_update.version}`)) {
			try {
				const description = config.get(`version_description_v${window.noname_update.version}`);
				const html = String.raw;
				// 匹配[xx](url)的格式
				const regex = /\[([^\]]*)\]\(([^)]+)\)/g;
				lib.changeLog.push(
					html`
						<div
							style="
							position:relative;
							width:50px;
							height:50px;
							border-radius:50px;
							background-image:url('${description.author.avatar_url}');
							background-size:cover;
							vertical-align:middle;"
						></div>
						${description.author.login}于${description.published_at}发布
					`.trim(),
					description.body.replaceAll("\n", "<br/>").replace(regex, function (match, text, url) {
						return `<a href="${url}">${text}</a>`;
					})
				);
			} catch (e) {
				console.error(e);
				lib.changeLog.push(...window.noname_update.changeLog);
			}
		}
		// 原更新内容
		else {
			lib.changeLog.push(...window.noname_update.changeLog);
		}
		if (window.noname_update.players) {
			lib.changeLog.push("players://" + JSON.stringify(window.noname_update.players));
		}
		if (window.noname_update.cards) {
			lib.changeLog.push("cards://" + JSON.stringify(window.noname_update.cards));
		}
		delete window.noname_update;
	}

	// 虽然但是，我就暴露个import，应该没啥问题
	window.game = {
		import: game.import.bind(null),
	};

	// if (config.get("layout") == "default") {
	// 	config.set("layout", "mobile");
	// }

	if (!config.get("touchscreen")) {
		document.addEventListener("mousewheel", ui.click.windowmousewheel, { passive: true });
		document.addEventListener("mousemove", ui.click.windowmousemove);
		document.addEventListener("mousedown", ui.click.windowmousedown);
		document.addEventListener("mouseup", ui.click.windowmouseup);
		document.addEventListener("contextmenu", ui.click.right);
	} else {
		document.addEventListener("touchstart", ui.click.touchconfirm);
		document.addEventListener("touchstart", ui.click.windowtouchstart);
		document.addEventListener("touchend", ui.click.windowtouchend);
		document.addEventListener("touchmove", ui.click.windowtouchmove);
	}

	await waitDomLoad;

	const extensionlist = await getExtensionList();
	if (extensionlist.length) {
		_status.extensionLoading = [];
		_status.extensionLoaded = [];

		const extensionsImporting = extensionlist.map(i => importExtension(i));

		const extErrorList = [];
		for (const promise of extensionsImporting) {
			await promise.catch(async error => {
				extErrorList.add(error);
				if (!promiseErrorHandler || !promiseErrorHandler.onHandle) {
					return;
				}
				// @ts-expect-error ignore
				await promiseErrorHandler.onHandle({ promise });
			});
		}
		for (const promise of _status.extensionLoading) {
			await promise.catch(async error => {
				if (extErrorList.includes(error)) {
					return;
				}
				extErrorList.add(error);
				if (!promiseErrorHandler || !promiseErrorHandler.onHandle) {
					return;
				}
				// @ts-expect-error ignore
				await promiseErrorHandler.onHandle({ promise });
			});
		}
		// await Promise.allSettled(_status.extensionLoading);

		if (extErrorList.length) {
			const stacktraces = extErrorList.map(e => (e instanceof Error ? e.stack : String(e))).join("\n\n");
			// game.saveConfig("update_first_log", stacktraces);
			if (confirm(`扩展加载出错！是否重新载入游戏？\n以下扩展出现了错误：\n\n${stacktraces}`)) {
				game.reload();
				clearTimeout(resetGameTimeout);
				return;
			}
		}

		_status.extensionLoaded
			.filter(name => game.hasExtension(name))
			.forEach(name => {
				lib.announce.publish("Noname.Init.Extension.onLoad", name);
				lib.announce.publish(`Noname.Init.Extension.${name}.onLoad`, void 0);
			});
		delete _status.extensionLoading;
	}

	if (Array.isArray(lib.onprepare) && lib.onprepare.length) {
		_status.onprepare = Object.freeze(
			lib.onprepare.map(fn => {
				if (typeof fn !== "function") return;
				return (gnc.is.generatorFunc(fn) ? gnc.of(fn) : fn)();
			})
		);
	}

	const toLoad = [];

	let show_splash;
	switch (config.get("show_splash")) {
		case "off":
			show_splash = false;
			break;
		case "init":
			show_splash = !localStorage.getItem("show_splash_off");
			break;
		case "always":
			show_splash = true;
			break;
	}
	localStorage.removeItem("show_splash_off");

	if (localStorage.getItem(`${lib.configprefix}playback`)) {
		toLoad.push(importMode(config.get("mode")));
	} else if ((localStorage.getItem(`${lib.configprefix}directstart`) || !show_splash) && config.get("all").mode.includes(config.get("mode"))) {
		toLoad.push(importMode(config.get("mode")));
	}

	for (const cardPack of config.get("all").cards) {
		toLoad.push(importCardPack(cardPack));
	}
	for (const characterPack of config.get("all").characters) {
		toLoad.push(importCharacterPack(characterPack));
	}
	toLoad.push(lib.init.promises.js(`${lib.assetURL}character`, "rank"));
	toLoad.push(lib.init.promises.js(`${lib.assetURL}character`, "replace"));
	toLoad.push(lib.init.promises.js(`${lib.assetURL}character`, "perfectPairs"));

	// @deprecated lib.init.jsForExtension
	_status.javaScriptExtensions.forEach(ctx => {
		const toArray = arr => (Array.isArray(arr) ? arr : [arr]);
		const path = toArray(ctx.path);
		const file = toArray(ctx.file);
		const onLoad = toArray(ctx.onLoad);
		const onError = toArray(ctx.onError);
		toLoad.push(
			(async () => {
				for (let i = 0; i <= path.length; i++) {
					await lib.init.promises.js(path[i], file[i]).then(onLoad[i], onError[i]);
				}
			})()
		);
	});

	await Promise.allSettled(toLoad);

	if (_status.importing) {
		let promises = [];
		for (const type in _status.importing) {
			promises.addArray(_status.importing[type]);
		}
		await Promise.allSettled(promises);
		delete _status.importing;
	}

	window.resetGameTimeout = resetGameTimeout;
}

async function getExtensionList() {
	if (localStorage.getItem(lib.configprefix + "disable_extension")) return [];

	const autoImport = (() => {
		if (!config.get("extension_auto_import")) {
			return false;
		} else if (!(typeof game.getFileList == "function" && typeof game.checkFile == "function")) {
			console.warn("没有文件系统操作权限，无法自动导入扩展。");
			return false;
		}
		return true;
	})();

	window.resetExtension = () => {
		for (let ext of config.get("extensions")) {
			game.promises.saveConfig(`extension_${ext}_enable`, false);
		}
		localStorage.setItem(lib.configprefix + "disable_extension", String(true));
	};

	const extensions = config.get("extensions");
	const toLoad = [];
	toLoad.addArray(config.get("plays").filter(i => config.get("all").plays.includes(i)));
	toLoad.addArray(extensions);

	if (autoImport) {
		const extensionPath = new URL("./extension/", rootURL);
		const [extFolders] = await game.promises.getFileList(get.relativePath(extensionPath));

		const unimportedExtensions = extFolders.filter(folder => !extensions.includes(folder) && !config.get("all").plays.includes(folder));

		const promises = unimportedExtensions.map(async ext => {
			const path = new URL(`./${ext}/`, extensionPath);
			const file = new URL("./extension.js", path);
			const tsFile = new URL("./extension.ts", path);

			if ((await game.promises.checkFile(get.relativePath(file))) == 1 || (await game.promises.checkFile(get.relativePath(tsFile))) == 1) {
				extensions.push(ext);
				toLoad.push(ext);
				if (!config.has(`extension_${ext}_enable`)) {
					await game.promises.saveConfig(`extension_${ext}_enable`, false);
				}
			}
		});
		await Promise.allSettled(promises);

		await game.promises.saveConfig("extensions", extensions);
	}

	return toLoad.filter(i => !window.bannedExtensions.includes(i));
}

function initSheet() {
	const player_style = config.get("player_style");
	if (player_style && player_style != "default" && player_style != "custom") {
		let str = "";
		switch (player_style) {
			case "wood":
				str = `url("${lib.assetURL}theme/woodden/wood.jpg")`;
				break;
			case "music":
				str = "linear-gradient(#4b4b4b, #464646)";
				break;
			case "simple":
				str = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))";
				break;
		}
		ui.css.player_stylesheet = lib.init.sheet(
			`#window .player{ 
				background-image:"${str}"
			}`
		);
	}

	const border_style = config.get("border_style");
	if (border_style && border_style != "default" && border_style != "custom" && border_style != "auto") {
		let bstyle = border_style;
		if (bstyle.startsWith("dragon_")) bstyle = bstyle.slice(7);
		ui.css.border_stylesheet = lib.init.sheet(
			`#window .player>.framebg,
			#window #arena.long.mobile:not(.fewplayer) .player[data-position="0"]>.framebg {
				display:block;
				background-image:url("${lib.assetURL + "theme/style/player/" + bstyle + "1.png"}")
			}`,
			`#window #arena.long:not(.fewplayer) .player>.framebg,
			#arena.oldlayout .player>.framebg {
				background-image: url("${lib.assetURL + "theme/style/player/" + bstyle + "3.png"}")
			}`,
			`.player>.count {
				z-index: 3 !important;
				border-radius: 2px !important;
				text-align: center !important;
			}`
		);
	}

	const control_style = config.get("control_style");
	if (control_style && control_style != "default" && control_style != "custom") {
		var str = "";
		switch (control_style) {
			case "wood":
				str = `url("${lib.assetURL}theme/woodden/wood.jpg")`;
				break;
			case "music":
				str = "linear-gradient(#4b4b4b, #464646);color:white;text-shadow:black 0 0 2px";
				break;
			case "simple":
				str = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4));color:white;text-shadow:black 0 0 2px";
				break;
		}
		if (control_style == "wood") {
			ui.css.control_stylesheet = lib.init.sheet(
				`#window .control,
				#window .menubutton,
				#window #system>div>div,
				#window #system>div>.pressdown2 {
					background-image:${str}
				}`
			);
		} else {
			ui.css.control_stylesheet = lib.init.sheet(
				`#window .control,
				.menubutton:not(.active):not(.highlight):not(.red):not(.blue),
				#window #system>div>div { 
					background-image:${str}
				}`
			);
		}
	}

	const menu_style = config.get("menu_style");
	if (menu_style && menu_style != "default" && menu_style != "custom") {
		let str = "";
		switch (menu_style) {
			case "wood":
				str = `url("${lib.assetURL}theme/woodden/wood2.png")`;
				break;
			case "music":
				str = "linear-gradient(#4b4b4b, #464646);color:white;text-shadow:black 0 0 2px";
				break;
			case "simple":
				str = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4));color:white;text-shadow:black 0 0 2px";
				break;
		}
		ui.css.menu_stylesheet = lib.init.sheet(
			`html #window>.dialog.popped,
			html .menu,html .menubg {
				background-image:${str}
			}`
		);
	}

	const zhishixian = config.get("zhishixian");
	game.zsOriginLineXy = game.linexy;
	if (zhishixian && zhishixian != "default") {
		var layout = zhishixian;
		game.saveConfig("zhishixian", zhishixian);
		if (layout == "default") {
			game.linexy = game.zsOriginLineXy;
		} else {
			game.linexy = game["zs" + layout + "LineXy"];
		}
	}
}

async function loadConfig() {
	const path = "/game/config.js";
	await import(/*@vite-ignore*/ path);
	lib.config = window.config;
	lib.configOL = {};
	delete window.config;

	let result;
	if (localStorage.getItem(`${lib.configprefix}nodb`)) {
		window.nodb = true;
	}
	if (window.indexedDB && !window.nodb) {
		const event = await new Promise((resolve, reject) => {
			const idbOpenDBRequest = window.indexedDB.open(`${lib.configprefix}data`, 4);
			idbOpenDBRequest.onerror = reject;
			idbOpenDBRequest.onsuccess = resolve;
			idbOpenDBRequest.onupgradeneeded = idbVersionChangeEvent => {
				// @ts-expect-error MaybeHave
				const idbDatabase = idbVersionChangeEvent.target.result;
				if (!idbDatabase.objectStoreNames.contains("video")) {
					idbDatabase.createObjectStore("video", { keyPath: "time" });
				}
				if (!idbDatabase.objectStoreNames.contains("image")) {
					idbDatabase.createObjectStore("image");
				}
				if (!idbDatabase.objectStoreNames.contains("audio")) {
					idbDatabase.createObjectStore("audio");
				}
				if (!idbDatabase.objectStoreNames.contains("config")) {
					idbDatabase.createObjectStore("config");
				}
				if (!idbDatabase.objectStoreNames.contains("data")) {
					idbDatabase.createObjectStore("data");
				}
			};
		});
		lib.db = event.target.result;

		const object = await game.getDB("config");

		if (!object.storageImported) {
			try {
				const item = localStorage.getItem(`${lib.configprefix}config`);
				if (!item) {
					throw new Error();
				}
				result = JSON.parse(item);
				if (!result || typeof result != "object") {
					throw new Error();
				}
			} catch (err) {
				result = {};
			}
			Object.keys(result).forEach(key => game.saveConfig(key, result[key]));
			Object.keys(lib.mode).forEach(key => {
				try {
					const item = localStorage.getItem(`${lib.configprefix}${key}`);
					if (!item) {
						throw new Error();
					}
					result = JSON.parse(item);
					if (!result || typeof result != "object" || get.is.empty(result)) {
						throw new Error();
					}
				} catch (err) {
					result = false;
				}
				localStorage.removeItem(`${lib.configprefix}${key}`);
				if (result) {
					game.putDB("data", key, result);
				}
			});
			game.saveConfig("storageImported", true);
			lib.init.background();
			localStorage.removeItem(`${lib.configprefix}config`);
		} else {
			result = object;
		}
	} else {
		try {
			const item = localStorage.getItem(lib.configprefix + "config");
			if (!item) {
				throw new Error();
			}
			result = JSON.parse(item);
			if (!result || typeof result != "object") {
				throw new Error();
			}
		} catch (err) {
			result = {};
			localStorage.setItem(lib.configprefix + "config", JSON.stringify({}));
		}
	}

	// 读取模式
	if (result.mode) {
		config.set("mode", result.mode);
	}
	config.get("mode_config")[config.get("mode")] ??= {};

	// 复制共有模式设置
	for (const name in config.get("mode_config").global) {
		config.get("mode_config")[config.get("mode")][name] ??= config.get("mode_config").global[name];
	}

	if (config.get("characters")) {
		config.set("defaultcharacters", config.get("characters").slice());
	}
	if (config.get("cards")) {
		config.set("defaultcards", config.get("cards").slice());
	}

	for (const name in result) {
		if (name.includes("_mode_config")) {
			const thismode = name.slice(name.indexOf("_mode_config") + 13);
			config.get("mode_config")[thismode] ??= {};
			config.get("mode_config")[thismode][name.slice(0, name.indexOf("_mode_config"))] = result[name];
		} else {
			config.set(name, result[name]);
		}
	}

	config.get("all").characters = [];
	config.get("all").cards = [];
	config.get("all").plays = [];
	config.get("all").mode = [];

	config.set("duration", 500);

	if (window.isNonameServer) config.set("mode", "connect");
	if (!config.get("gameRecord")) config.set("gameRecord", {});

	return result;
}

async function loadCss() {
	ui.css = {};
	const stylesLoading = {
		menu: lib.init.promises.css(lib.assetURL + "layout/default", "menu"),
		newmenu: lib.init.promises.css(lib.assetURL + "layout/default", "newmenu"),
		default: lib.init.promises.css(lib.assetURL + "layout/default", "layout"),
		layout: lib.init.promises.css(lib.assetURL + "layout/" + game.layout, "layout", void 0, true),
		theme: lib.init.promises.css(lib.assetURL + "theme/" + config.get("theme"), "style", void 0, true),
		card_style: lib.init.promises.css(lib.assetURL + "theme/style/card", config.get("card_style"), void 0, true),
		cardback_style: lib.init.promises.css(lib.assetURL + "theme/style/cardback", config.get("cardback_style"), void 0, true),
		hp_style: lib.init.promises.css(lib.assetURL + "theme/style/hp", config.get("hp_style"), void 0, true),
		phone: get.is.phoneLayout() ? lib.init.promises.css(lib.assetURL + "layout/default", "phone", void 0, true) : lib.init.css(),
		_others: lib.init.promises.css(lib.assetURL + "layout/" + "others", "dialog", void 0, true),
		_skill: lib.init.promises.css(lib.assetURL + "layout/" + "others", "skill", void 0, true),
	};
	await Promise.allSettled(Object.keys(stylesLoading).map(async i => (ui.css[i] = await stylesLoading[i])));
}

/**
 * `window.onload`触发时执行的函数
 *
 * 目前无任何内容，预防以后出现需要的情况
 *
 * @deprecated
 * @return {Promise<void>}
 */
async function onWindowReady() {}

function setBackground() {
	let htmlbg = localStorage.getItem(lib.configprefix + "background");
	if (htmlbg) {
		if (htmlbg[0] == "[") {
			try {
				htmlbg = JSON.parse(htmlbg);
				if (!htmlbg) {
					throw new Error();
				}
				htmlbg = htmlbg[get.rand(htmlbg.length)];
				if (htmlbg.startsWith("custom_")) {
					throw new Error();
				}
				_status.htmlbg = htmlbg;
			} catch (e) {
				htmlbg = null;
			}
		}
		if (htmlbg) {
			document.documentElement.style.backgroundImage = 'url("' + lib.assetURL + "image/background/" + htmlbg + '.jpg")';
			document.documentElement.style.backgroundSize = "cover";
			document.documentElement.style.backgroundPosition = "50% 50%";
			// 由于html没设高度或最小高度导致了图片重复问题
			// 这是在layout.css加载完成之前才会有的问题
			document.documentElement.style.height = "100%";
		}
	}
}

function setServerIndex() {
	const index = window.location.href.indexOf("index.html?server=");
	if (index !== -1) {
		window.isNonameServer = window.location.href.slice(index + 18);
		window.nodb = true;
	} else {
		const savedIndex = localStorage.getItem(lib.configprefix + "asserver");
		if (savedIndex) {
			window.isNonameServer = savedIndex;
			window.isNonameServerIp = lib.hallURL;
		}
	}
}

function setWindowListener() {
	window.onkeydown = function (e) {
		if (typeof ui.menuContainer == "undefined" || !ui.menuContainer.classList.contains("hidden")) {
			if (e.keyCode == 116 || ((e.ctrlKey || e.metaKey) && e.keyCode == 82)) {
				if (e.shiftKey) {
					if (confirm("是否重置游戏？")) {
						var noname_inited = localStorage.getItem("noname_inited");
						var onlineKey = localStorage.getItem(lib.configprefix + "key");
						localStorage.clear();
						if (noname_inited) {
							localStorage.setItem("noname_inited", noname_inited);
						}
						if (onlineKey) {
							localStorage.setItem(lib.configprefix + "key", onlineKey);
						}
						if (indexedDB) {
							indexedDB.deleteDatabase(lib.configprefix + "data");
						}
						game.reload();
						return;
					}
				} else {
					game.reload();
				}
			} else if (e.keyCode == 83 && (e.ctrlKey || e.metaKey)) {
				if (typeof window.saveNonameInput == "function") {
					window.saveNonameInput();
				}
				e.preventDefault();
				e.stopPropagation();
				return false;
			} else if (e.keyCode == 74 && (e.ctrlKey || e.metaKey) && typeof lib.node != "undefined") {
				lib.node.debug();
			}
		} else {
			game.closePopped();
			var dialogs = document.querySelectorAll("#window>.dialog.popped:not(.static)");
			for (var i = 0; i < dialogs.length; i++) {
				// @ts-expect-error ignore
				dialogs[i].delete();
			}
			if (e.keyCode == 32) {
				var node = ui.window.querySelector("pausedbg");
				if (node) {
					node.click();
				} else {
					ui.click.pause();
				}
			} else if (e.keyCode == 65) {
				if (typeof ui.auto != "undefined") {
					ui.auto.click();
				}
			} else if (e.keyCode == 87) {
				if (typeof ui.wuxie != "undefined" && ui.wuxie.style.display != "none") {
					ui.wuxie.classList.toggle("glow");
				} else if (typeof ui.tempnowuxie != "undefined") {
					ui.tempnowuxie.classList.toggle("glow");
				}
			} else if (e.keyCode == 116 || ((e.ctrlKey || e.metaKey) && e.keyCode == 82)) {
				if (e.shiftKey) {
					if (confirm("是否重置游戏？")) {
						var noname_inited = localStorage.getItem("noname_inited");
						var onlineKey = localStorage.getItem(lib.configprefix + "key");
						localStorage.clear();
						if (noname_inited) {
							localStorage.setItem("noname_inited", noname_inited);
						}
						if (onlineKey) {
							localStorage.setItem(lib.configprefix + "key", onlineKey);
						}
						if (indexedDB) {
							indexedDB.deleteDatabase(lib.configprefix + "data");
						}
						game.reload();
						return;
					}
				} else {
					game.reload();
				}
			} else if (e.keyCode == 83 && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			} else if (e.keyCode == 74 && (e.ctrlKey || e.metaKey) && typeof lib.node != "undefined") {
				lib.node.debug();
			}
			// else if(e.keyCode==27){
			// 	if(!ui.arena.classList.contains('paused')) ui.click.config();
			// }
		}
	};
}
