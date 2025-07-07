// @ts-nocheck
import { ai, setAI } from "../ai/index.js";
import { get, setGet } from "../get/index.js";
import { lib, Library, setLibrary } from "../library/index.js";
import { game, setGame } from "../game/index.js";
import { _status } from "../status/index.js";
import { setUI, ui } from "../ui/index.js";
import { gnc } from "../gnc/index.js";
import { importMode } from "./import.js";
import { Mutex } from "../util/mutex.js";
import { load } from "../util/config.js";
import { loadCard, loadCardPile, loadCharacter, loadExtension, loadMode, loadPlay } from "./loading.js";

export async function onload() {
	const libOnload = lib.onload;
	delete lib.onload;
	await runCustomContents(libOnload);

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
				ui.css.hp_stylesheet1 = lib.init.sheet(`.hp:not(.text):not(.actcount)[data-condition="high"]>div:not(.lost){background-image:url(${data})}`);
			},
			hp_style2(data) {
				if (ui.css.hp_stylesheet2) {
					ui.css.hp_stylesheet2.remove();
				}
				ui.css.hp_stylesheet2 = lib.init.sheet(`.hp:not(.text):not(.actcount)[data-condition="mid"]>div:not(.lost){background-image:url(${data})}`);
			},
			hp_style3(data) {
				if (ui.css.hp_stylesheet3) {
					ui.css.hp_stylesheet3.remove();
				}
				ui.css.hp_stylesheet3 = lib.init.sheet(`.hp:not(.text):not(.actcount)[data-condition="low"]>div:not(.lost){background-image:url(${data})}`);
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
			ui.css.border_stylesheet.sheet.insertRule(".player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}", 0);
		}),
		tryLoadCustomStyle("control_style", data => {
			if (ui.css.control_stylesheet) {
				ui.css.control_stylesheet.remove();
			}
			ui.css.control_stylesheet = lib.init.sheet(`#window .control,.menubutton:not(.active):not(.highlight):not(.red):not(.blue),#window #system>div>div{background-image:url("${data}")}`);
		}),
		tryLoadCustomStyle("menu_style", data => {
			if (ui.css.menu_stylesheet) {
				ui.css.menu_stylesheet.remove();
			}
			ui.css.menu_stylesheet = lib.init.sheet(`html #window>.dialog.popped,html .menu,html .menubg{background-image:url("${fileLoadedEvent.target.result}");background-size:cover}`);
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
	lib.storage = (await load(lib.config.mode, "data")) || {};

	const libOnload2 = lib.onload2;
	delete lib.onload2;
	await runCustomContents(libOnload2);

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

	// 我不好说，但我尊重水乎的想法
	Object.keys(lib.character)
		.toSorted(lib.sort.capt)
		.forEach(character => {
			lib.mode.connect.config.connect_avatar.item[character] = lib.translate[character];
		});

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

	if (window.isNonameServer) {
		lib.cheat.i();
	} else if (lib.config.dev && (!_status.connectMode || lib.config.debug)) {
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
		var startstr = currentMode.start.toString();
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
			const fileLoadedEvent = await Promise(resolve => {
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
		if (Math.abs(e.touches[0].clientX / game.documentZoom - this.startX) > 10 || Math.abs(e.touches[0].clientY / game.documentZoom - this.startY) > 10) {
			_status.dragged = true;
		}
	});
}

/**
 * @async
 * @param {((function(Mutex): void) | GeneratorFunction)[]} contents
 */
function runCustomContents(contents) {
	if (!Array.isArray(contents)) {
		return;
	}

	const mutex = new Mutex();
	// 将生成器函数转换成genCoroutin
	const tasks = contents
		.filter(fn => typeof fn === "function")
		.map(fn => (gnc.is.generatorFunc(fn) ? gnc.of(fn) : fn))
		.map(fn => fn(mutex));

	return Promise.allSettled(tasks).then(results => {
		results.forEach(result => {
			if (result.status === "rejected") {
				console.error(result.reason);
			}
		});
	});
}

/**
 * 由于不暴露出去，抽象一点
 *
 * 实际上但凡有重载都不会抽象
 *
 * @param {string} id
 * @param {(function(string): void) | Record<string, function(string): void>} keys
 * @param {function(): void} [fallback]
 * @returns {Promise<void>}
 */
async function tryLoadCustomStyle(id, keys, fallback) {
	if (typeof keys == "function") {
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

					await callback?.(fileLoadedEvent.target.result);
				} else {
					fallback?.();
				}
			})
		);
	}
}
