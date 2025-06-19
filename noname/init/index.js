import { ai } from "../ai/index.js";
import { get } from "../get/index.js";
import { lib } from "../library/index.js";
import { game } from "../game/index.js";
import { _status } from "../status/index.js";
import { ui } from "../ui/index.js";
import { gnc } from "../gnc/index.js";
import { userAgentLowerCase, nonameInitialized, AsyncFunction, device, leaveCompatibleEnvironment } from "../util/index.js";
import * as config from "../util/config.js";
import { promiseErrorHandlerMap } from "../util/browser.js";
import { importCardPack, importCharacterPack, importExtension, importMode } from "./import.js";
import { initializeSandboxRealms } from "../util/initRealms.js";
import { ErrorManager } from "../util/error.js";
import { rootURL } from "../../noname.js";

// 判断是否从file协议切换到http/s协议
export function canUseHttpProtocol() {
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
			// @ts-expect-error ignore
			if (nonameInitialized.endsWith("com.noname.shijian/") && window.noname_shijianInterfaces && typeof window.noname_shijianInterfaces.sendUpdate === "function") {
				// 每个app自定义能升级的渠道，比如判断版本
				// @ts-expect-error ignore
				return window.noname_shijianInterfaces.getApkVersion() >= 16000;
			}
			// 由理版判断，后续所有app都通过此接口来升级协议
			// @ts-expect-error ignore
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
export function sendUpdate() {
	// 手机端
	if (window.cordova) {
		// 直接确定包名
		// @ts-expect-error ignore
		if (nonameInitialized && nonameInitialized.includes("com.noname.shijian") && window.noname_shijianInterfaces && typeof window.noname_shijianInterfaces.sendUpdate === "function") {
			// 给诗笺版apk的java层传递升级完成的信息
			// @ts-expect-error ignore
			const url = new URL(window.noname_shijianInterfaces.sendUpdate());
			url.searchParams.set("sendUpdate", "true");
			return url.toString();
		}
		// 由理版判断
		// @ts-expect-error ignore
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

// 无名杀，启动！
export async function boot() {
	leaveCompatibleEnvironment();
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

	// 加载polyfill内容
	await import("./polyfill.js");

	// 设定游戏加载时间，超过时间未加载就提醒
	const configLoadTime = localStorage.getItem(lib.configprefix + "loadtime");
	// 现在不暴露到全局变量里了，直接传给onload
	const resetGameTimeout = setTimeout(lib.init.reset, configLoadTime ? parseInt(configLoadTime) : 10000);

	if (typeof window.cordovaLoadTimeout != "undefined") {
		clearTimeout(window.cordovaLoadTimeout);
		delete window.cordovaLoadTimeout;
	}

	// @ts-expect-error 类型系统未来可期
	for (const link of document.head.querySelectorAll("link")) {
		if (link.href.includes("app/color.css")) {
			link.remove();
			break;
		}
	}

	setServerIndex();
	setBackground();

	Reflect.set(lib, "get", get);
	Reflect.set(lib, "ui", ui);
	Reflect.set(lib, "ai", ai);
	Reflect.set(lib, "game", game);
	_status.event = lib.element.GameEvent.initialGameEvent();

	setWindowListener();
	const promiseErrorHandler = await setOnError();

	// 确认手机端平台
	Reflect.set(lib, "device", device);

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
		Reflect.set(lib, "path", (await import("../library/path.js")).default);
		if (typeof lib.device != "undefined") {
			const script = document.createElement("script");
			script.src = "cordova.js";
			document.body.appendChild(script);
			await new Promise(resolve => {
				document.addEventListener("deviceready", async () => {
					const { cordovaReady } = await import("./cordova.js");
					await cordovaReady();
					resolve(void 0);
				});
			});
		} else {
			//为其他自定义平台提供文件读写函数赋值的一种方式。
			//但这种方式只允许修改game的文件读写函数。
			if (typeof window.initReadWriteFunction == "function") {
				const g = {};
				const ReadWriteFunctionName = ["download", "checkFile", "checkDir", "readFile", "readFileAsText", "writeFile", "removeFile", "getFileList", "ensureDirectory", "createDir", "removeDir"];
				ReadWriteFunctionName.forEach(prop => {
					Object.defineProperty(g, prop, {
						configurable: true,
						get() {
							return undefined;
						},
						set(newValue) {
							if (typeof newValue == "function") {
								delete g[prop];
								g[prop] = game[prop] = newValue;
							}
						},
					});
				});
				// @ts-expect-error ignore
				await window.initReadWriteFunction(g).catch(e => {
					console.error("文件读写函数初始化失败:", e);
				});
				delete window.initReadWriteFunction; // 后续用不到了喵
			}
			window.onbeforeunload = function () {
				if (config.get("confirm_exit") && !_status.reloading) {
					return "是否离开游戏？";
				} else {
					return null;
				}
			};
		}
	}

	const loadCssPromise = loadCss();
	const loadConfigPromise = loadConfig();
	await loadCssPromise;
	const config2 = await loadConfigPromise;

	// 读取模式
	if (config2.mode) {
		config.set("mode", config2.mode);
	}
	if (config.get("mode_config")[config.get("mode")] === undefined) {
		config.get("mode_config")[config.get("mode")] = {};
	}

	// 复制共有模式设置
	for (const name in config.get("mode_config").global) {
		if (config.get("mode_config")[config.get("mode")][name] === undefined) {
			config.get("mode_config")[config.get("mode")][name] = config.get("mode_config").global[name];
		}
	}

	if (config.get("characters")) {
		config.set("defaultcharacters", config.get("characters").slice(0));
	}
	if (config.get("cards")) {
		config.set("defaultcards", config.get("cards").slice(0));
	}

	for (const name in config2) {
		if (name.includes("_mode_config")) {
			var thismode = name.substr(name.indexOf("_mode_config") + 13);
			if (!config.get("mode_config")[thismode]) {
				config.get("mode_config")[thismode] = {};
			}
			config.get("mode_config")[thismode][name.substr(0, name.indexOf("_mode_config"))] = config2[name];
		} else {
			config.set(name, config2[name]);
		}
	}

	for (const name in get.config("translate")) {
		lib.translate[name] = get.config("translate")[name];
	}

	config.get("all").characters = [];
	config.get("all").cards = [];
	config.get("all").plays = [];
	config.get("all").mode = [];

	if (config.get("compatiblemode")) {
		_status.withError = true;
	}
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
	const securityModule = await import("../util/security.js");
	const security = securityModule.default;
	await security.initSecurity({
		lib,
		game,
		ui,
		get,
		ai,
		_status,
		gnc,
	});

	if (Reflect.get(window, "isNonameServer")) {
		config.set("mode", "connect");
	}

	var pack = Reflect.get(window, "noname_package");
	Reflect.deleteProperty(window, "noname_package");
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
		for (var j in pack.submode[name]) {
			lib.translate[name + "|" + j] = pack.submode[name][j];
		}
	}

	if (!config.get("gameRecord")) {
		config.set("gameRecord", {});
	}
	for (const name in pack.mode) {
		if (config.get("hiddenModePack").indexOf(name) == -1) {
			config.get("all").mode.push(name);
			lib.translate[name] = pack.mode[name];
			if (!config.get("gameRecord")[name]) {
				config.get("gameRecord")[name] = { data: {} };
			}
		}
	}
	if (config.get("all").mode.length == 0) {
		config.get("all").mode.push("identity");
		lib.translate.identity = "身份";
		if (!config.get("gameRecord").identity) {
			config.get("gameRecord").identity = { data: {} };
		}
	}
	if (pack.background) {
		for (const name in pack.background) {
			if (config.get("hiddenBackgroundPack").includes(name)) {
				continue;
			}
			lib.configMenu.appearence.config.image_background.item[name] = pack.background[name];
		}
		for (let i = 0; i < config.get("customBackgroundPack").length; i++) {
			var link = config.get("customBackgroundPack")[i];
			lib.configMenu.appearence.config.image_background.item[link] = link.slice(link.indexOf("_") + 1);
		}
		lib.configMenu.appearence.config.image_background.item.default = "默认";
	}
	if (pack.music) {
		if (typeof lib.device != "undefined" || typeof window.require === "function") {
			lib.configMenu.audio.config.background_music.item.music_custom = "自定义音乐";
		}
		config.get("all").background_music = ["music_default"];
		for (const name in pack.music) {
			config.get("all").background_music.push(name);
			lib.configMenu.audio.config.background_music.item[name] = pack.music[name];
		}
		if (config.get("customBackgroundMusic")) {
			for (const name in config.get("customBackgroundMusic")) {
				config.get("all").background_music.push(name);
				lib.configMenu.audio.config.background_music.item[name] = config.get("customBackgroundMusic")[name];
			}
		}
		lib.configMenu.audio.config.background_music.item.music_random = "随机播放";
		lib.configMenu.audio.config.background_music.item.music_off = "关闭";
	}
	if (pack.theme) {
		for (const name in pack.theme) {
			lib.configMenu.appearence.config.theme.item[name] = pack.theme[name];
		}
	}
	if (config.get("extension_sources")) {
		for (const name in config.get("extension_sources")) {
			lib.configMenu.general.config.extension_source.item[name] = name;
		}
	}

	if (pack.font) {
		Reflect.get(ui, "css").fontsheet = lib.init.sheet();
		const appearenceConfig = lib.configMenu.appearence.config,
			fontSheet = Reflect.get(ui, "css").fontsheet.sheet,
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
				} else if (Reflect.get(lib, "device") === "ios") {
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

	let show_splash = config.get("show_splash");
	if (show_splash == "off") {
		show_splash = false;
	} else if (show_splash == "init") {
		if (localStorage.getItem("show_splash_off")) {
			show_splash = false;
		}
	}
	localStorage.removeItem("show_splash_off");
	const extensionlist = [];
	if (!localStorage.getItem(lib.configprefix + "disable_extension")) {
		if (config.has("extensions") && config.get("extensions").length) {
			Reflect.set(window, "resetExtension", () => {
				for (var i = 0; i < config.get("extensions").length; i++) {
					game.saveConfig("extension_" + config.get("extensions")[i] + "_enable", false);
				}
				// @ts-expect-error ignore
				localStorage.setItem(lib.configprefix + "disable_extension", true);
			});
		}
		for (var name = 0; name < config.get("plays").length; name++) {
			if (config.get("all").plays.includes(config.get("plays")[name])) {
				extensionlist.push(config.get("plays")[name]);
			}
		}

		for (var name = 0; name < config.get("extensions").length; name++) {
			if (Reflect.get(window, "bannedExtensions").includes(config.get("extensions")[name])) {
				continue;
			}
			var extcontent = localStorage.getItem(lib.configprefix + "extension_" + config.get("extensions")[name]);
			if (extcontent) {
				//var backup_onload=lib.init.onload;
				_status.evaluatingExtension = true;
				try {
					security.eval(extcontent); // 喵？
				} catch (e) {
					console.log(e);
				}
				//lib.init.onload=backup_onload;
				_status.evaluatingExtension = false;
			} else {
				extensionlist.push(config.get("extensions")[name]);
			}
		}
	}

	// 自动导入扩展
	// 其实个人觉得直接加到这里会有问题，但至少现在能跑
	const importExtensionPromise = autoImportExtensions(extensionlist);

	let layout = config.get("layout");
	if (layout == "default" || lib.layoutfixed.indexOf(config.get("mode")) !== -1) {
		layout = "mobile";
	}
	if (layout == "phone") {
		layout = "mobile";
		game.saveConfig("layout", "mobile");
		game.saveConfig("phonelayout", true);
	}
	Reflect.set(game, "layout", layout);

	if (config.get("image_background_random")) {
		if (_status.htmlbg) {
			game.saveConfig("image_background", _status.htmlbg);
		} else {
			const list = [];
			for (const name in lib.configMenu.appearence.config.image_background.item) {
				if (name == "default") {
					continue;
				}
				list.push(name);
			}
			// @ts-expect-error ignore
			game.saveConfig("image_background", list.randomGet(lib.config.image_background));
		}
		lib.init.background();
	}
	delete _status.htmlbg;

	// 无名杀更新日志
	if (window.noname_update) {
		Reflect.set(lib, "version", window.noname_update.version);
		// 更全面的更新内容
		if (config.get(`version_description_v${window.noname_update.version}`)) {
			try {
				const description = config.get(`version_description_v${window.noname_update.version}`);
				const html = String.raw;
				// 匹配[xx](url)的格式
				const regex = /\[([^\]]*)\]\(([^)]+)\)/g;
				lib.changeLog.push(
					html`
						<div style="position: relative;width:50px;height:50px;border-radius:50px;background-image:url('${description.author.avatar_url}');background-size:cover;vertical-align:middle;"></div>
						${description.author.login}于${description.published_at}发布
					`.trim(),
					description.body.replaceAll("\n", "<br/>").replace(regex, function (match, p1, p2) {
						// p1 是链接文本，p2 是链接地址
						return `<a href="${p2}">${p1}</a>`;
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
	Reflect.set(window, "game", {
		import: game.import.bind(null),
	});

	if (config.get("layout") == "default") {
		config.set("layout", "mobile");
	}

	const stylesName = ["layout", "theme", "card_style", "cardback_style", "hp_style"];
	const stylesLoading = [lib.init.promises.css(lib.assetURL + "layout/" + layout, "layout", void 0, true), lib.init.promises.css(lib.assetURL + "theme/" + config.get("theme"), "style", void 0, true), lib.init.promises.css(lib.assetURL + "theme/style/card", config.get("card_style"), void 0, true), lib.init.promises.css(lib.assetURL + "theme/style/cardback", config.get("cardback_style"), void 0, true), lib.init.promises.css(lib.assetURL + "theme/style/hp", config.get("hp_style"), void 0, true)];

	if (get.is.phoneLayout()) {
		stylesName.push("phone");
		stylesLoading.push(lib.init.promises.css(lib.assetURL + "layout/default", "phone"));
	} else {
		Reflect.get(ui, "css").phone = lib.init.css();
	}
	ui.css._others = lib.init.css(lib.assetURL + "layout/" + "others", "dialog");
	ui.css._skill = lib.init.css(lib.assetURL + "layout/" + "others", "skill");
	initSheet(Reflect.get(lib, "config"));

	config.set("duration", 500);

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

	const stylesLoaded = await Promise.all(stylesLoading);
	const stylesLength = Math.min(stylesName.length, stylesLoaded.length);
	for (let i = 0; i < stylesLength; ++i) {
		Reflect.get(ui, "css")[stylesName[i]] = stylesLoaded[i];
	}

	await importExtensionPromise;
	if (extensionlist.length) {
		_status.extensionLoading = [];
		_status.extensionLoaded = [];

		const bannedExtensions = Reflect.get(window, "bannedExtensions");

		const extensionsLoading = [];
		for (const name of extensionlist) {
			if (bannedExtensions.includes(name)) {
				continue;
			}
			extensionsLoading.push(importExtension(name));
		}

		const extErrorList = [];
		for (const promise of extensionsLoading) {
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

		const isFirstStartAfterUpdate = lib.version && lib.version != lib.config.version;

		if (isFirstStartAfterUpdate && extErrorList.length) {
			const stacktraces = extErrorList.map(e => (e instanceof Error ? e.stack : String(e))).join("\n\n");
			// game.saveConfig("update_first_log", stacktraces);
			if (confirm(`扩展加载出错！是否重新载入游戏？\n本次更新可能导致了扩展出现了错误：\n\n${stacktraces}`)) {
				game.reload();
				clearTimeout(resetGameTimeout);
				return;
			}
		}

		_status.extensionLoaded
			.filter(name => game.hasExtension(name))
			.forEach(name => {
				lib.announce.publish("Noname.Init.Extension.onLoad", name);
				// @ts-expect-error ignore
				lib.announce.publish(`Noname.Init.Extension.${name}.onLoad`, void 0);
			});
		delete _status.extensionLoading;
	}

	const isArray = Array.isArray;
	if (isArray(lib.onprepare) && lib.onprepare.length) {
		_status.onprepare = Object.freeze(
			lib.onprepare.map(fn => {
				if (typeof fn !== "function") {
					return;
				}
				return (gnc.is.generatorFunc(fn) ? gnc.of(fn) : fn)();
			})
		);
	}

	const toLoad = [];

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

	if (_status.javaScriptExtensions) {
		const loadJavaScriptExtension = async (javaScriptExtension, pathArray, fileArray, onLoadArray, onErrorArray, index) => {
			if (!pathArray && !fileArray && !onLoadArray && !onErrorArray) {
				try {
					await lib.init.promises.js(javaScriptExtension.path, javaScriptExtension.file);
					if (typeof javaScriptExtension.onload == "function") {
						javaScriptExtension.onload();
					}
				} catch {
					if (typeof javaScriptExtension.onerror == "function") {
						javaScriptExtension.onerror();
					}
				}
				return;
			}
			if (typeof index != "number") {
				index = 0;
			}
			if (pathArray && index >= javaScriptExtension.path.length) {
				return;
			}
			if (fileArray && index >= javaScriptExtension.file.length) {
				return;
			}
			if (onLoadArray && index >= javaScriptExtension.onload.length) {
				return;
			}
			if (onErrorArray && index >= javaScriptExtension.onerror.length) {
				return;
			}
			const path = pathArray ? javaScriptExtension.path[index] : javaScriptExtension.path;
			const file = fileArray ? javaScriptExtension.file[index] : javaScriptExtension.file;
			const onLoad = onLoadArray ? javaScriptExtension.onload[index] : javaScriptExtension.onload;
			const onError = onErrorArray ? javaScriptExtension.onerror[index] : javaScriptExtension.onerror;
			try {
				await lib.init.promises.js(path, file);
				if (typeof onLoad == "function") {
					onLoad();
				}
			} catch {
				if (typeof onError == "function") {
					onError();
				}
			}
			await loadJavaScriptExtension(javaScriptExtension, pathArray, fileArray, onLoadArray, onErrorArray, index + 1);
		};
		_status.javaScriptExtensions.forEach(javaScriptExtension => {
			const pathArray = isArray(javaScriptExtension.path);
			const fileArray = isArray(javaScriptExtension.file);
			const onLoadArray = isArray(javaScriptExtension.onLoad);
			const onErrorArray = isArray(javaScriptExtension.onError);
			toLoad.push(loadJavaScriptExtension(javaScriptExtension, pathArray, fileArray, onLoadArray, onErrorArray));
		});
	}

	await Promise.allSettled(toLoad);

	if (_status.importing) {
		/**
		 * @type {Promise[]}
		 */
		let promises = lib.creation.array;
		for (const type in _status.importing) {
			// @ts-expect-error ignore
			promises.addArray(_status.importing[type]);
		}
		await Promise.allSettled(promises);
		delete _status.importing;
	}

	Reflect.set(window, "resetGameTimeout", resetGameTimeout);
}

export { onload } from "./onload.js";

async function autoImportExtensions(extensionlist) {
	const configValue = config.get("extension_auto_import");
	const fsAccess = typeof game.getFileList == "function" && typeof game.checkFile == "function";

	if (!configValue || !fsAccess) {
		return;
	}

	const includedPlays = config.get("all").plays;
	const savedExtensions = config.get("extensions");
	const extensionPath = new URL("./extension/", rootURL);
	const [extFolders] = await game.promises.getFileList(get.relativePath(extensionPath));
	let changed = false;

	const unimportedExtensions = extFolders.filter(folder => !includedPlays.includes(folder) && !savedExtensions.includes(folder));

	const promises = unimportedExtensions.map(async ext => {
		const path = new URL(`./${ext}/`, extensionPath);
		const file = new URL("./extension.js", path);
		const tsFile = new URL("./extension.ts", path);

		if ((await game.promises.checkFile(get.relativePath(file))) == 1 || (await game.promises.checkFile(get.relativePath(tsFile))) == 1) {
			extensionlist.push(ext);
			savedExtensions.push(ext);
			changed = true;
			if (!config.has(`extension_${ext}_enable`)) {
				await game.promises.saveConfig(`extension_${ext}_enable`, false);
			}
		}
	});
	await Promise.allSettled(promises);

	if (changed) {
		await game.promises.saveConfig("extensions", savedExtensions);
	}
}

function initSheet(libConfig) {
	if (libConfig.player_style && libConfig.player_style != "default" && libConfig.player_style != "custom") {
		var str = "";
		switch (libConfig.player_style) {
			case "wood":
				str = 'url("' + lib.assetURL + 'theme/woodden/wood.jpg")';
				break;
			case "music":
				str = "linear-gradient(#4b4b4b, #464646)";
				break;
			case "simple":
				str = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))";
				break;
		}
		Reflect.get(ui, "css").player_stylesheet = lib.init.sheet("#window .player{background-image:" + str + "}");
	}
	if (libConfig.border_style && libConfig.border_style != "default" && libConfig.border_style != "custom" && libConfig.border_style != "auto") {
		Reflect.get(ui, "css").border_stylesheet = lib.init.sheet();
		var bstyle = libConfig.border_style;
		if (bstyle.startsWith("dragon_")) {
			bstyle = bstyle.slice(7);
		}
		Reflect.get(ui, "css").border_stylesheet.sheet.insertRule('#window .player>.framebg,#window #arena.long.mobile:not(.fewplayer) .player[data-position="0"]>.framebg{display:block;background-image:url("' + lib.assetURL + "theme/style/player/" + bstyle + '1.png")}', 0);
		Reflect.get(ui, "css").border_stylesheet.sheet.insertRule('#window #arena.long:not(.fewplayer) .player>.framebg, #arena.oldlayout .player>.framebg{background-image:url("' + lib.assetURL + "theme/style/player/" + bstyle + '3.png")}', 0);
		Reflect.get(ui, "css").border_stylesheet.sheet.insertRule(".player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}", 0);
	}
	game.zsOriginLineXy = game.linexy;
	if (libConfig.zhishixian && libConfig.zhishixian != "default") {
		var layout = libConfig.zhishixian;
		game.saveConfig("zhishixian", layout);
		if (layout == "default") {
			game.linexy = game.zsOriginLineXy;
		} else {
			game.linexy = game["zs" + layout + "LineXy"];
		}
	}
	if (libConfig.control_style && libConfig.control_style != "default" && libConfig.control_style != "custom") {
		var str = "";
		switch (libConfig.control_style) {
			case "wood":
				str = 'url("' + lib.assetURL + 'theme/woodden/wood.jpg")';
				break;
			case "music":
				str = "linear-gradient(#4b4b4b, #464646);color:white;text-shadow:black 0 0 2px";
				break;
			case "simple":
				str = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4));color:white;text-shadow:black 0 0 2px";
				break;
		}
		if (libConfig.control_style == "wood") {
			Reflect.get(ui, "css").control_stylesheet = lib.init.sheet("#window .control,#window .menubutton,#window #system>div>div,#window #system>div>.pressdown2{background-image:" + str + "}");
		} else {
			Reflect.get(ui, "css").control_stylesheet = lib.init.sheet("#window .control,.menubutton:not(.active):not(.highlight):not(.red):not(.blue),#window #system>div>div{background-image:" + str + "}");
		}
	}
	if (libConfig.menu_style && libConfig.menu_style != "default" && libConfig.menu_style != "custom") {
		var str = "";
		switch (libConfig.menu_style) {
			case "wood":
				str = 'url("' + lib.assetURL + 'theme/woodden/wood2.png")';
				break;
			case "music":
				str = "linear-gradient(#4b4b4b, #464646);color:white;text-shadow:black 0 0 2px";
				break;
			case "simple":
				str = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4));color:white;text-shadow:black 0 0 2px";
				break;
		}
		Reflect.get(ui, "css").menu_stylesheet = lib.init.sheet("html #window>.dialog.popped,html .menu,html .menubg{background-image:" + str + "}");
	}
}

async function loadConfig() {
	Reflect.set(lib, "config", Reflect.get(window, "config"));
	Reflect.set(lib, "configOL", {});
	Reflect.deleteProperty(window, "config");

	let result;
	if (localStorage.getItem(`${lib.configprefix}nodb`)) {
		Reflect.set(window, "nodb", true);
	}
	if (window.indexedDB && !Reflect.get(window, "nodb")) {
		const event = await new Promise((resolve, reject) => {
			const idbOpenDBRequest = window.indexedDB.open(`${lib.configprefix}data`, 4);
			idbOpenDBRequest.onerror = reject;
			idbOpenDBRequest.onsuccess = resolve;
			idbOpenDBRequest.onupgradeneeded = idbVersionChangeEvent => {
				// @ts-expect-error MaybeHave
				const idbDatabase = idbVersionChangeEvent.target.result;
				if (!idbDatabase.objectStoreNames.contains("video")) {
					idbDatabase.createObjectStore("video", {
						keyPath: "time",
					});
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
		Reflect.set(lib, "db", event.target.result);

		const object = await game.getDB("config");

		if (!object.storageImported) {
			try {
				const item = localStorage.getItem(`${lib.configprefix}config`);
				if (!item) {
					throw "err";
				}
				result = JSON.parse(item);
				if (!result || typeof result != "object") {
					throw "err";
				}
			} catch (err) {
				result = {};
			}
			Object.keys(result).forEach(key => game.saveConfig(key, result[key]));
			Object.keys(lib.mode).forEach(key => {
				try {
					const item = localStorage.getItem(`${lib.configprefix}${key}`);
					if (!item) {
						throw "err";
					}
					result = JSON.parse(item);
					if (!result || typeof result != "object" || get.is.empty(result)) {
						throw "err";
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
				throw "err";
			}
			result = JSON.parse(item);
			if (!result || typeof result != "object") {
				throw "err";
			}
		} catch (err) {
			result = {};
			localStorage.setItem(lib.configprefix + "config", JSON.stringify({}));
		}
	}

	return result;
}

async function loadCss() {
	Reflect.set(ui, "css", {
		menu: await lib.init.promises.css(lib.assetURL + "layout/default", "menu"),
		newmenu: await lib.init.promises.css(lib.assetURL + "layout/default", "newmenu"),
		default: await lib.init.promises.css(lib.assetURL + "layout/default", "layout"),
	});
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
					throw "err";
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
		}
	}
}

function setServerIndex() {
	const index = window.location.href.indexOf("index.html?server=");
	if (index !== -1) {
		Reflect.set(window, "isNonameServer", window.location.href.slice(index + 18));
		Reflect.set(window, "nodb", true);
	} else {
		const savedIndex = localStorage.getItem(lib.configprefix + "asserver");
		if (savedIndex) {
			Reflect.set(window, "isNonameServer", savedIndex);
			Reflect.set(window, "isNonameServerIp", lib.hallURL);
		}
	}
}

async function setOnError() {
	const [core] = get.coreInfo();

	const promiseErrorHandler = new (core in promiseErrorHandlerMap ? promiseErrorHandlerMap[core] : promiseErrorHandlerMap.other)();

	if (promiseErrorHandler.onLoad) {
		await promiseErrorHandler.onLoad();
	}

	window.onunhandledrejection = async event => {
		if (promiseErrorHandler.onHandle) {
			await promiseErrorHandler.onHandle(event);
		}
	};

	window.onerror = function (msg, src, line, column, err) {
		if (promiseErrorHandler.onErrorPrepare) {
			promiseErrorHandler.onErrorPrepare();
		}
		const winPath = window.__dirname ? "file:///" + (__dirname.replace(new RegExp("\\\\", "g"), "/") + "/") : "";
		let str = `错误文件: ${typeof src == "string" ? decodeURI(src).replace(lib.assetURL, "").replace(winPath, "") : "未知文件"}`;
		str += `\n错误信息: ${msg}`;
		const tip = lib.getErrorTip(msg);
		if (tip) {
			str += `\n错误提示: ${tip}`;
		}
		str += `\n行号: ${line}`;
		str += `\n列号: ${column}`;
		const version = typeof lib.version != "undefined" ? lib.version : "";
		const reg = /[^\d.]/;
		const match = version.match(reg) != null;
		str += "\n" + `${match ? "游戏" : "无名杀"}版本: ${version || "未知版本"}`;
		if (match) {
			str += "\n⚠️您使用的游戏代码不是源于libnoname/noname无名杀官方仓库，请自行寻找您所使用的游戏版本开发者反馈！";
		}
		if (_status && _status.event) {
			let evt = _status.event;
			str += `\nevent.name: ${evt.name}\nevent.step: ${evt.step}`;
			// @ts-expect-error ignore
			if (evt.parent) {
				str += `\nevent.parent.name: ${evt.parent.name}\nevent.parent.step: ${evt.parent.step}`;
			}
			// @ts-expect-error ignore
			if (evt.parent && evt.parent.parent) {
				str += `\nevent.parent.parent.name: ${evt.parent.parent.name}\nevent.parent.parent.step: ${evt.parent.parent.step}`;
			}
			if (evt.player || evt.target || evt.source || evt.skill || evt.card) {
				str += "\n-------------";
			}
			if (evt.player) {
				if (lib.translate[evt.player.name]) {
					str += `\nplayer: ${lib.translate[evt.player.name]}[${evt.player.name}]`;
				} else {
					str += "\nplayer: " + evt.player.name;
				}
				let distance = get.distance(_status.roundStart, evt.player, "absolute");
				if (distance != Infinity) {
					str += `\n座位号: ${distance + 1}`;
				}
			}
			if (evt.target) {
				if (lib.translate[evt.target.name]) {
					str += `\ntarget: ${lib.translate[evt.target.name]}[${evt.target.name}]`;
				} else {
					str += "\ntarget: " + evt.target.name;
				}
			}
			if (evt.source) {
				if (lib.translate[evt.source.name]) {
					str += `\nsource: ${lib.translate[evt.source.name]}[${evt.source.name}]`;
				} else {
					str += "\nsource: " + evt.source.name;
				}
			}
			if (evt.skill) {
				if (lib.translate[evt.skill]) {
					str += `\nskill: ${lib.translate[evt.skill]}[${evt.skill}]`;
				} else {
					str += "\nskill: " + evt.skill;
				}
			}
			if (evt.card) {
				if (lib.translate[evt.card.name]) {
					str += `\ncard: ${lib.translate[evt.card.name]}[${evt.card.name}]`;
				} else {
					str += "\ncard: " + evt.card.name;
				}
			}
		}
		str += "\n-------------";
		const errorReporter = ErrorManager.getErrorReporter(err);
		if (errorReporter) {
			game.print(errorReporter.report(str + "\n代码出现错误"));
		} else {
			if (typeof line == "number" && (typeof Reflect.get(game, "readFile") == "function" || location.origin != "file://")) {
				/**
				 * @param { string[] } lines 代码分割行数
				 * @param { number } lines 代码报错行数
				 */
				const createShowCode = function (lines, line) {
					let showCode = "";
					if (lines.length >= 10) {
						if (line > 4) {
							for (let i = line - 5; i < line + 6 && i < lines.length; i++) {
								showCode += `${i + 1}| ${line == i + 1 ? "⚠️" : ""}${lines[i]}\n`;
							}
						} else {
							for (let i = 0; i < line + 6 && i < lines.length; i++) {
								showCode += `${i + 1}| ${line == i + 1 ? "⚠️" : ""}${lines[i]}\n`;
							}
						}
					} else {
						showCode = lines.map((_line, i) => `${i + 1}| ${line == i + 1 ? "⚠️" : ""}${_line}\n`).toString();
					}
					return showCode;
				};
				// 解析step content的错误
				if (
					err &&
					err.stack &&
					["at GameEvent.eval (eval at packStep", "at StepParser.eval (eval at packStep"].some(str => {
						let stackSplit1 = err.stack.split("\n")[1];
						if (stackSplit1) {
							return stackSplit1.trim().startsWith(str);
						}
						return false;
					})
				) {
					// @ts-expect-error ignore
					const codes = _status.event.content.originals[_status.event.step];
					if (typeof codes == "function") {
						const regex = /<anonymous>:(\d+):\d+/;
						const match = err.stack.split("\n")[1].match(regex);
						if (match) {
							const lines = codes.toString().split("\n");
							str += "\n" + createShowCode(lines, Number(match[1]));
							str += "\n-------------";
						}
					}
				}
				// 协议名须和html一致(网页端防跨域)，且文件是js
				else if (typeof src == "string" && src.startsWith(location.protocol) && src.endsWith(".js")) {
					//获取代码
					const codes = lib.init.reqSync("local:" + decodeURI(src).replace(lib.assetURL, "").replace(winPath, ""));
					if (codes) {
						const lines = codes.split("\n");
						str += "\n" + createShowCode(lines, line);
						str += "\n-------------";
					}
				}
			}
			if (err && err.stack) {
				str += "\n" + decodeURI(err.stack).replace(new RegExp(lib.assetURL, "g"), "").replace(new RegExp(winPath, "g"), "");
			}
			alert(str);
			game.print(str);
		}
		Reflect.set(window, "ea", Array.from(arguments));
		Reflect.set(window, "em", msg);
		Reflect.set(window, "el", line);
		Reflect.set(window, "ec", column);
		Reflect.set(window, "eo", err);
		if (promiseErrorHandler.onErrorFinish) {
			promiseErrorHandler.onErrorFinish();
		}
	};

	return promiseErrorHandler;
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
