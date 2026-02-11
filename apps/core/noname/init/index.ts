/// <reference types="vite/client" />
import { rootURL, lib, game, get, _status, ui, ai } from "noname";
import { userAgentLowerCase } from "@/util/index.js";
import * as config from "@/util/config.js";
import { setOnError } from "@/util/error.ts";
import { security, initializeSandboxRealms } from "@/util/sandbox.js";
import { CacheContext } from "@/library/cache/cacheContext.js";
import { importCardPack, importCharacterPack, importExtension, importMode } from "./import.js";
import { loadCard, loadCardPile, loadCharacter, loadExtension, loadMode, loadPlay } from "./loading.js";

// 无名杀，启动！
export async function boot() {
	// 不想看，反正别动
	if (typeof __dirname === "string" && __dirname.length) {
		const dirsplit = __dirname.split("/");
		for (let i = 0; i < dirsplit.length; i++) {
			if (dirsplit[i]) {
				const c = dirsplit[i][0];
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

	setBackground();

	lib.get = get;
	lib.ui = ui;
	lib.ai = ai;
	lib.game = game;
	_status.event = lib.element.GameEvent.initialGameEvent();

	setWindowListener();
	setOnError({ lib, game, get, _status });

	await loadConfig();

	for (const name in get.config("translate")) {
		lib.translate[name] = get.config("translate")[name];
	}

	if (config.get("compatible") ?? true) {
		await import("./compatible.js");
	}

	const sandboxEnabled = !config.get("debug") && !get.is.safari();

	// 初始化沙盒的Realms
	await initializeSandboxRealms(sandboxEnabled);

	// 初始化security
	await security.initSecurity({ lib, game, ui, get, ai, _status });

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

	// 在dom加载完后执行相应的操作
	await new Promise(resolve => {
		if (document.readyState !== "complete") {
			window.onload = resolve;
		} else {
			resolve(void 0);
		}
	});

	const extensionlist = await getExtensionList();
	if (extensionlist.length) {
		_status.extensionLoading = [];
		_status.extensionLoaded = [];
		for (const i of extensionlist) {
			await importExtension(i);
		}
		delete _status.extensionLoading;
	}

	if (Array.isArray(lib.onprepare) && lib.onprepare.length) {
		_status.onprepare = Object.freeze(
			lib.onprepare.map(fn => {
				if (typeof fn !== "function") return;
				return fn();
			})
		);
	}

	const toLoad: Promise<any>[] = [];

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
	const libOnload = lib.onload;
	delete lib.onload;
	libOnload.forEach(fn => fn());

	ui.updated();
	game.documentZoom = game.deviceZoom;
	if (game.documentZoom !== 1) {
		ui.updatez();
	}

	await createBackground();

	if (lib.config.touchscreen) {
		createTouchDraggedFilter();
	}

	// 重构了吗？如构
	let loadingCustomStyle = [
		tryLoadCustomStyle("card_style", data => {
			if (ui.css.card_stylesheet) {
				ui.css.card_stylesheet.remove();
			}
			ui.css.card_stylesheet = lib.init.sheet(`.card:not(*:empty){background-image:url(${data})}`);
		}),
		tryLoadCustomStyle("cardback_style", {
			cardback_style(data) {
				if (ui.css.cardback_stylesheet) {
					ui.css.cardback_stylesheet.remove();
				}
				ui.css.cardback_stylesheet = lib.init.sheet(`.card:empty,.card.infohidden{background-image:url(${data})}`);
			},
			cardback_style2(data) {
				if (ui.css.cardback_stylesheet2) {
					ui.css.cardback_stylesheet2.remove();
				}
				ui.css.cardback_stylesheet2 = lib.init.sheet(`.card.infohidden:not(.infoflip){background-image:url(${data})}`);
			},
		}),
		tryLoadCustomStyle("hp_style", {
			hp_style1(data) {
				if (ui.css.hp_stylesheet1) {
					ui.css.hp_stylesheet1.remove();
				}
				ui.css.hp_stylesheet1 = lib.init.sheet(
					`.hp:not(.text):not(.actcount)[data-condition="high"]>div:not(.lost){background-image:url(${data})}`
				);
			},
			hp_style2(data) {
				if (ui.css.hp_stylesheet2) {
					ui.css.hp_stylesheet2.remove();
				}
				ui.css.hp_stylesheet2 = lib.init.sheet(
					`.hp:not(.text):not(.actcount)[data-condition="mid"]>div:not(.lost){background-image:url(${data})}`
				);
			},
			hp_style3(data) {
				if (ui.css.hp_stylesheet3) {
					ui.css.hp_stylesheet3.remove();
				}
				ui.css.hp_stylesheet3 = lib.init.sheet(
					`.hp:not(.text):not(.actcount)[data-condition="low"]>div:not(.lost){background-image:url(${data})}`
				);
			},
			hp_style4(data) {
				if (ui.css.hp_stylesheet4) {
					ui.css.hp_stylesheet4.remove();
				}
				ui.css.hp_stylesheet4 = lib.init.sheet(`.hp:not(.text):not(.actcount)>.lost{background-image:url(${data})}`);
			},
		}),
		tryLoadCustomStyle(
			"player_style",
			data => {
				if (ui.css.player_stylesheet) {
					ui.css.player_stylesheet.remove();
				}
				ui.css.player_stylesheet = lib.init.sheet(`#window .player{background-image:url("${data}");background-size:100% 100%;}`);
			},
			() => {
				ui.css.player_stylesheet = lib.init.sheet("#window .player{background-image:none;background-size:100% 100%;}");
			}
		),
		tryLoadCustomStyle("border_style", data => {
			if (ui.css.border_stylesheet) {
				ui.css.border_stylesheet.remove();
			}
			ui.css.border_stylesheet = lib.init.sheet();
			ui.css.border_stylesheet.sheet.insertRule(`#window .player>.framebg{display:block;background-image:url("${data}")}`, 0);
			ui.css.border_stylesheet.sheet.insertRule(
				".player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}",
				0
			);
		}),
		tryLoadCustomStyle("control_style", data => {
			if (ui.css.control_stylesheet) {
				ui.css.control_stylesheet.remove();
			}
			ui.css.control_stylesheet = lib.init.sheet(
				`#window .control,.menubutton:not(.active):not(.highlight):not(.red):not(.blue),#window #system>div>div{background-image:url("${data}")}`
			);
		}),
		tryLoadCustomStyle("menu_style", data => {
			if (ui.css.menu_stylesheet) {
				ui.css.menu_stylesheet.remove();
			}
			ui.css.menu_stylesheet = lib.init.sheet(
				`html #window>.dialog.popped,html .menu,html .menubg{background-image:url("${data}");background-size:cover}`
			);
		}),
	];

	lib.onloadSplashes.forEach(splash => {
		lib.configMenu.appearence.config.splash_style.item[splash.id] = splash.name;
	});

	localStorage.removeItem(lib.configprefix + "directstart");
	if (!lib.imported.mode?.[lib.config.mode]) {
		window.inSplash = true;
		clearTimeout(window.resetGameTimeout);

		if (typeof lib.config.splash_style == "undefined") {
			game.saveConfig("splash_style", lib.onloadSplashes[0].id);
		}
		let splash = lib.onloadSplashes.find(item => item.id === lib.config.splash_style);
		if (!splash) {
			splash = lib.onloadSplashes[0];
		}

		let node = ui.create.div("#splash", document.body);

		let { promise, resolve } = Promise.withResolvers();
		await splash.init(node, resolve);

		let result = await promise;

		let splashInRemoing = await splash.dispose(node);
		if (!splashInRemoing) {
			node.remove();
		}
		window.resetGameTimeout = setTimeout(lib.init.reset, 10000);
		delete window.inSplash;
		game.saveConfig("mode", result);
		await importMode(result);
	}
	lib.storage = (await config.load(lib.config.mode, "data")) || {};

	const libOnload2 = lib.onload2;
	delete lib.onload2;
	libOnload2.forEach(fn => fn());

	await Promise.allSettled(loadingCustomStyle);
	delete window.game;

	lib.connectCharacterPack = [];
	lib.connectCardPack = [];

	const currentMode = lib.imported.mode[lib.config.mode];
	loadMode(currentMode);
	// 为了模式扩展，两个东西删不了
	lib.init.start = currentMode.start;
	lib.init.startBefore = currentMode.startBefore;

	if (lib.imported.character != null) {
		Object.values(lib.imported.character).forEach(loadCharacter);
	}

	loadCardPile();

	if (lib.imported.card != null) {
		Object.values(lib.imported.card).forEach(loadCard);
	}

	if (lib.cardPack.mode_derivation) {
		lib.cardPack.mode_derivation = lib.cardPack.mode_derivation.filter(item => {
			if (typeof lib.card[item].derivation == "string" && !lib.character[lib.card[item].derivation]) {
				return false;
			}
			return !(typeof lib.card[item].derivationpack == "string" && !lib.config.cards.includes(lib.card[item].derivationpack));
		});

		if (lib.cardPack.mode_derivation.length === 0) {
			delete lib.cardPack.mode_derivation;
		}
	}

	if (lib.config.mode === "connect") {
		_status.connectMode = true;
	} else {
		if (lib.imported.play != null) {
			Object.values(lib.imported.play).forEach(loadPlay);
		}

		lib.card.list = lib.card.list.filter(cardData => {
			if (!cardData[2]) {
				return false;
			}
			if (cardData[2] === "huosha") {
				cardData[2] = "sha";
				cardData[3] = "fire";
			} else if (cardData[2] === "leisha") {
				cardData[2] = "sha";
				cardData[3] = "thunder";
			} else if (cardData[2] === "icesha") {
				cardData[2] = "sha";
				cardData[3] = "ice";
			} else if (cardData[2] === "cisha") {
				cardData[2] = "sha";
				cardData[3] = "stab";
			} else if (cardData[2] === "kamisha") {
				cardData[2] = "sha";
				cardData[3] = "kami";
			}
			return lib.card[cardData[2]] && !lib.card[cardData[2]].mode?.includes(lib.config.mode);
		});
	}

	if (lib.config.dev && (!_status.connectMode || lib.config.debug)) {
		lib.cheat.i();
	}
	lib.config.sort_card = get.sortCard(lib.config.sort);

	for (let funcName in lib.init) {
		if (funcName.startsWith("setMode_")) {
			delete lib.init[funcName];
		}
	}

	if (Array.isArray(lib.extensions)) {
		await Promise.allSettled(lib.extensions.map(loadExtension));
	}

	if (lib.init.startBefore) {
		lib.init.startBefore();
		delete lib.init.startBefore;
	}

	ui.create.arena();
	game.createEvent("game", false).setContent(lib.init.start);
	if (lib.mode[lib.config.mode] && lib.mode[lib.config.mode].fromextension) {
		const startstr = currentMode.start.toString();
		if (startstr.indexOf("onfree") === -1) {
			setTimeout(lib.init.onfree, 500);
		}
	}
	delete lib.init.start;
	if (Array.isArray(_status.onprepare) && _status.onprepare.length) {
		await Promise.allSettled(_status.onprepare);
		delete _status.onprepare;
	}

	game.loop();
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
	const searchParamsImportExtension = new URLSearchParams(location.search).get("importExtensionName");

	window.resetExtension = () => {
		for (let ext of config.get("extensions")) {
			game.promises.saveConfig(`extension_${ext}_enable`, false);
		}
		localStorage.setItem(lib.configprefix + "disable_extension", String(true));
	};

	const extensions: string[] = config.get("extensions");
	const toLoad: string[] = [];
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
	} else if (searchParamsImportExtension) {
		extensions.push(searchParamsImportExtension);
		toLoad.push(searchParamsImportExtension);
		if (!config.has(`extension_${searchParamsImportExtension}_enable`)) {
			await game.promises.saveConfig(`extension_${searchParamsImportExtension}_enable`, true);
		}
		await game.promises.saveConfig("extensions", extensions);
	}

	return toLoad;
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
		let str = "";
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
		const layout = zhishixian;
		game.saveConfig("zhishixian", zhishixian);
		if (layout == "default") {
			game.linexy = game.zsOriginLineXy;
		} else {
			game.linexy = game["zs" + layout + "LineXy"];
		}
	}
}

async function loadConfig() {
	lib.config = await lib.init.promises.json(lib.assetURL + "game/config.json");
	lib.configOL = {};

	if (!window.indexedDB) {
		throw new Error("您的环境不支持indexedDB，无法保存配置");
	}

	const event = await new Promise<Event>((resolve, reject) => {
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

	let result;
	// 懒人包配置
	const hasConfigTxt = (await game.promises.checkFile("noname.config.txt")) === 1;

	if (hasConfigTxt) {
		try {
			const configStr = await game.promises.readFileAsText("noname.config.txt");

			let data;
			({ config: result = {}, data = {} } = JSON.parse(lib.init.decode(configStr)));
			for (let i in result) {
				game.saveConfig(i, result[i]);
			}
			for (let i in data) {
				game.putDB("data", i, data[i]);
			}
		} catch (e) {
			console.error(e);
			result = {};
		}
		lib.init.background();
		await game.promises.removeFile("noname.config.txt").catch(e => console.error(e));
	} else {
		result = await game.getDB("config");
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

function setWindowListener() {
	window.onkeydown = function (e) {
		if (typeof ui.menuContainer == "undefined" || !ui.menuContainer.classList.contains("hidden")) {
			if (e.key === "F5" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r")) {
				if (e.shiftKey) {
					if (confirm("是否重置游戏？")) {
						const noname_inited = localStorage.getItem("noname_inited");
						const onlineKey = localStorage.getItem(lib.configprefix + "key");
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
			} else if (e.key.toLowerCase() === "s" && (e.ctrlKey || e.metaKey)) {
				if (typeof window.saveNonameInput == "function") {
					window.saveNonameInput();
				}
				e.preventDefault();
				e.stopPropagation();
				return false;
			} else if (e.key.toLowerCase() === "j" && (e.ctrlKey || e.metaKey) && typeof lib.node != "undefined") {
				lib.node.debug();
			}
		} else {
			game.closePopped();
			const dialogs = document.querySelectorAll("#window>.dialog.popped:not(.static)");
			for (let i = 0; i < dialogs.length; i++) {
				// @ts-expect-error ignore
				dialogs[i].delete();
			}
			if (e.key == "Space") {
				const node = ui.window.querySelector("pausedbg");
				if (node) {
					node.click();
				} else {
					ui.click.pause();
				}
			} else if (e.key.toLowerCase() === "a") {
				if (typeof ui.auto != "undefined") {
					ui.auto.click();
				}
			} else if (e.key.toLowerCase() === "w") {
				if (typeof ui.wuxie != "undefined" && ui.wuxie.style.display != "none") {
					ui.wuxie.classList.toggle("glow");
				} else if (typeof ui.tempnowuxie != "undefined") {
					ui.tempnowuxie.classList.toggle("glow");
				}
			} else if (e.key === "F5" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r")) {
				if (e.shiftKey) {
					if (confirm("是否重置游戏？")) {
						const noname_inited = localStorage.getItem("noname_inited");
						const onlineKey = localStorage.getItem(lib.configprefix + "key");
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
			} else if (e.key.toLowerCase() === "s" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			} else if (e.key.toLowerCase() === "j" && (e.ctrlKey || e.metaKey) && typeof lib.node != "undefined") {
				lib.node.debug();
			}
			// else if(e.key=="Escape"){
			// 	if(!ui.arena.classList.contains('paused')) ui.click.config();
			// }
		}
	};

	window.onbeforeunload = function (e) {
		if (config.get("confirm_exit") && !_status.reloading) {
			e.preventDefault();
			e.returnValue = "";
		}
	};
}

async function createBackground() {
	ui.background = ui.create.div(".background");
	ui.background.style.backgroundSize = "cover";
	ui.background.style.backgroundPosition = "50% 50%";

	document.documentElement.style.backgroundImage = "";
	document.documentElement.style.backgroundSize = "";
	document.documentElement.style.backgroundPosition = "";
	document.body.insertBefore(ui.background, document.body.firstChild);
	document.body.onresize = ui.updatexr;

	if (!lib.config.image_background) {
		return;
	}
	if (lib.config.image_background === "default") {
		return;
	}

	let url = `url("${lib.assetURL}image/background/${lib.config.image_background}.jpg")`;

	if (lib.config.image_background.startsWith("custom_")) {
		try {
			const fileToLoad = await game.getDB("image", lib.config.image_background);
			const fileReader = new FileReader();
			const fileLoadedEvent = await new Promise(resolve => {
				fileReader.onload = resolve;
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
			const data = fileLoadedEvent.target.result;
			url = `url("${data}")`;
		} catch (e) {
			console.error(e);
			url = "none";
		}
	}

	ui.background.style.backgroundImage = url;
	if (lib.config.image_background_blur) {
		ui.background.style.filter = "blur(8px)";
		ui.background.style.webkitFilter = "blur(8px)";
		ui.background.style.transform = "scale(1.05)";
	}
}

function createTouchDraggedFilter() {
	document.body.addEventListener("touchstart", function (e) {
		this.startX = e.touches[0].clientX / game.documentZoom;
		this.startY = e.touches[0].clientY / game.documentZoom;
		_status.dragged = false;
	});
	document.body.addEventListener("touchmove", function (e) {
		if (_status.dragged) {
			return;
		}
		if (
			Math.abs(e.touches[0].clientX / game.documentZoom - this.startX) > 10 ||
			Math.abs(e.touches[0].clientY / game.documentZoom - this.startY) > 10
		) {
			_status.dragged = true;
		}
	});
}

/**
 * 由于不暴露出去，抽象一点
 *
 * 实际上但凡有重载都不会抽象
 */
async function tryLoadCustomStyle(
	id: string,
	keys: (data: string) => void | Record<string, (data: string) => void>,
	fallback?: () => void
): Promise<void> {
	if (typeof keys === "function") {
		keys = {
			[id]: keys,
		};
	}

	if (lib.config[id] === "custom") {
		await Promise.allSettled(
			Object.entries(keys).map(async ([key, callback]) => {
				const fileToLoad = await game.getDB("image", key);
				if (fileToLoad) {
					const fileLoadedEvent = await new Promise((resolve, reject) => {
						const fileReader = new FileReader();
						fileReader.onload = resolve;
						fileReader.onerror = reject;
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});

					await callback?.(fileLoadedEvent.target.result as string);
				} else {
					fallback?.();
				}
			})
		);
	}
}
