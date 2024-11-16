// @ts-nocheck
import { ai } from "../ai/index.js";
import { get } from "../get/index.js";
import { lib } from "../library/index.js";
import { game } from "../game/index.js";
import { _status } from "../status/index.js";
import { ui } from "../ui/index.js";
import { gnc } from "../gnc/index.js";
import { importMode } from "./import.js";
import { Mutex } from "../util/mutex.js";
import { load } from "../util/config.js";

export async function onload() {
	const libOnload = lib.onload;
	delete lib.onload;
	await runCustomContents(libOnload);

	ui.updated();
	game.documentZoom = game.deviceZoom;
	if (game.documentZoom !== 1) ui.updatez();

	await createBackground();

	if (lib.config.touchscreen) createTouchDraggedFilter();

	// 重构了吗？如构
	let loadingCustomStyle = [
		tryLoadCustomStyle("card_style", data => {
			if (ui.css.card_stylesheet) ui.css.card_stylesheet.remove();
			ui.css.card_stylesheet = lib.init.sheet(`.card:not(*:empty){background-image:url(${data})}`);
		}),
		tryLoadCustomStyle("cardback_style", {
			cardback_style(data) {
				if (ui.css.cardback_stylesheet) ui.css.cardback_stylesheet.remove();
				ui.css.cardback_stylesheet = lib.init.sheet(`.card:empty,.card.infohidden{background-image:url(${data})}`);
			},
			cardback_style2(data) {
				if (ui.css.cardback_stylesheet2) ui.css.cardback_stylesheet2.remove();
				ui.css.cardback_stylesheet2 = lib.init.sheet(`.card.infohidden:not(.infoflip){background-image:url(${data})}`);
			},
		}),
		tryLoadCustomStyle("hp_style", {
			hp_style1(data) {
				if (ui.css.hp_stylesheet1) ui.css.hp_stylesheet1.remove();
				ui.css.hp_stylesheet1 = lib.init.sheet(`.hp:not(.text):not(.actcount)[data-condition="high"]>div:not(.lost){background-image:url(${data})}`);
			},
			hp_style2(data) {
				if (ui.css.hp_stylesheet2) ui.css.hp_stylesheet2.remove();
				ui.css.hp_stylesheet2 = lib.init.sheet(`.hp:not(.text):not(.actcount)[data-condition="mid"]>div:not(.lost){background-image:url(${data})}`);
			},
			hp_style3(data) {
				if (ui.css.hp_stylesheet3) ui.css.hp_stylesheet3.remove();
				ui.css.hp_stylesheet3 = lib.init.sheet(`.hp:not(.text):not(.actcount)[data-condition="low"]>div:not(.lost){background-image:url(${data})}`);
			},
			hp_style4(data) {
				if (ui.css.hp_stylesheet4) ui.css.hp_stylesheet4.remove();
				ui.css.hp_stylesheet4 = lib.init.sheet(`.hp:not(.text):not(.actcount)>.lost{background-image:url(${data})}`);
			},
		}),
		tryLoadCustomStyle(
			"player_style",
			data => {
				if (ui.css.player_stylesheet) ui.css.player_stylesheet.remove();
				ui.css.player_stylesheet = lib.init.sheet(`#window .player{background-image:url("${data}");background-size:100% 100%;}`);
			},
			() => {
				ui.css.player_stylesheet = lib.init.sheet("#window .player{background-image:none;background-size:100% 100%;}");
			}
		),
		tryLoadCustomStyle("border_style", data => {
			if (ui.css.border_stylesheet) ui.css.border_stylesheet.remove();
			ui.css.border_stylesheet = lib.init.sheet();
			ui.css.border_stylesheet.sheet.insertRule(`#window .player>.framebg{display:block;background-image:url("${data}")}`, 0);
			ui.css.border_stylesheet.sheet.insertRule(".player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}", 0);
		}),
		tryLoadCustomStyle("control_style", data => {
			if (ui.css.control_stylesheet) ui.css.control_stylesheet.remove();
			ui.css.control_stylesheet = lib.init.sheet(`#window .control,.menubutton:not(.active):not(.highlight):not(.red):not(.blue),#window #system>div>div{background-image:url("${data}")}`);
		}),
		tryLoadCustomStyle("menu_style", data => {
			if (ui.css.menu_stylesheet) ui.css.menu_stylesheet.remove();
			ui.css.menu_stylesheet = lib.init.sheet(`html #window>.dialog.popped,html .menu,html .menubg{background-image:url("${fileLoadedEvent.target.result}");background-size:cover}`);
		}),
	];

	lib.onloadSplashes.forEach(splash => {
		lib.configMenu.appearence.config.splash_style.item[splash.id] = splash.name;
	});

	// 改不动，暂时不改了
	const proceed2 = async () => {
		let mode = lib.imported.mode;
		var card = lib.imported.card;
		var character = lib.imported.character;
		var play = lib.imported.play;
		delete window.game;
		var i, j, k;
		for (i in mode[lib.config.mode].element) {
			if (!lib.element[i]) lib.element[i] = [];
			for (j in mode[lib.config.mode].element[i]) {
				if (j == "init") {
					if (!lib.element[i].inits) lib.element[i].inits = [];
					lib.element[i].inits.push(mode[lib.config.mode].element[i][j]);
				} else {
					lib.element[i][j] = mode[lib.config.mode].element[i][j];
				}
			}
		}
		for (i in mode[lib.config.mode].ai) {
			if (typeof mode[lib.config.mode].ai[i] == "object") {
				if (ai[i] == undefined) ai[i] = {};
				for (j in mode[lib.config.mode].ai[i]) {
					ai[i][j] = mode[lib.config.mode].ai[i][j];
				}
			} else {
				ai[i] = mode[lib.config.mode].ai[i];
			}
		}
		for (i in mode[lib.config.mode].ui) {
			if (typeof mode[lib.config.mode].ui[i] == "object") {
				if (ui[i] == undefined) ui[i] = {};
				for (j in mode[lib.config.mode].ui[i]) {
					ui[i][j] = mode[lib.config.mode].ui[i][j];
				}
			} else {
				ui[i] = mode[lib.config.mode].ui[i];
			}
		}
		for (i in mode[lib.config.mode].game) {
			game[i] = mode[lib.config.mode].game[i];
		}
		for (i in mode[lib.config.mode].get) {
			get[i] = mode[lib.config.mode].get[i];
		}
		lib.init.start = mode[lib.config.mode].start;
		lib.init.startBefore = mode[lib.config.mode].startBefore;
		if (game.onwash) {
			lib.onwash.push(game.onwash);
			delete game.onwash;
		}
		if (game.onover) {
			lib.onover.push(game.onover);
			delete game.onover;
		}
		lib.config.banned = lib.config[lib.config.mode + "_banned"] || [];
		lib.config.bannedcards = lib.config[lib.config.mode + "_bannedcards"] || [];

		lib.rank = window.noname_character_rank;
		delete window.noname_character_rank;
		for (i in mode[lib.config.mode]) {
			if (i == "element") continue;
			if (i == "game") continue;
			if (i == "ai") continue;
			if (i == "ui") continue;
			if (i == "get") continue;
			if (i == "config") continue;
			if (i == "onreinit") continue;
			if (i == "start") continue;
			if (i == "startBefore") continue;
			if (lib[i] == undefined) lib[i] = Array.isArray(mode[lib.config.mode][i]) ? [] : {};
			for (j in mode[lib.config.mode][i]) {
				lib[i][j] = mode[lib.config.mode][i][j];
			}
		}
		if (typeof mode[lib.config.mode].init == "function") {
			mode[lib.config.mode].init();
		}

		var connectCharacterPack = [];
		var connectCardPack = [];
		for (i in character) {
			if (character[i].character) {
				const characterPack = lib.characterPack[i];
				if (characterPack) Object.assign(characterPack, character[i].character);
				else lib.characterPack[i] = character[i].character;
			}
			for (j in character[i]) {
				if (j == "mode" || j == "forbid") continue;
				if (j == "connect") {
					connectCharacterPack.push(i);
					continue;
				}
				if (j == "character" && !lib.config.characters.includes(i) && lib.config.mode != "connect") {
					if (lib.config.mode == "chess" && get.config("chess_mode") == "leader" && get.config("chess_leader_allcharacter")) {
						for (k in character[i][j]) {
							lib.hiddenCharacters.push(k);
						}
					} else if (lib.config.mode != "boss" || i != "boss") {
						continue;
					}
				}
				if (Array.isArray(lib[j]) && Array.isArray(character[i][j])) {
					lib[j].addArray(character[i][j]);
					continue;
				}
				for (k in character[i][j]) {
					if (j == "character") {
						if (lib.config.forbidai_user && lib.config.forbidai_user.includes(k)) {
							lib.config.forbidai.add(k);
						}
						if (Array.isArray(character[i][j][k])) {
							if (!character[i][j][k][4]) {
								character[i][j][k][4] = [];
							}
							if (character[i][j][k][4].includes("boss") || character[i][j][k][4].includes("hiddenboss")) {
								lib.config.forbidai.add(k);
							}
							for (var l = 0; l < character[i][j][k][3].length; l++) {
								lib.skilllist.add(character[i][j][k][3][l]);
							}
						} else {
							if (character[i][j][k].isBoss || character[i][j][k].isHiddenBoss) {
								lib.config.forbidai.add(k);
							}
							if (character[i][j][k].skills) {
								for (var l = 0; l < character[i][j][k].skills.length; l++) {
									lib.skilllist.add(character[i][j][k].skills[l]);
								}
							}
						}
					}
					if (j == "skill" && k[0] == "_" && (lib.config.mode != "connect" ? !lib.config.characters.includes(i) : !character[i].connect)) {
						continue;
					}
					if (j == "translate" && k == i) {
						lib[j][k + "_character_config"] = character[i][j][k];
					} else {
						if (lib[j][k] == undefined) {
							if (j == "skill" && !character[i][j][k].forceLoad && lib.config.mode == "connect" && !character[i].connect) {
								lib[j][k] = {
									nopop: character[i][j][k].nopop,
									derivation: character[i][j][k].derivation,
								};
							} else if (j === "character") {
								lib.character[k] = character[i][j][k];
							} else {
								Object.defineProperty(lib[j], k, Object.getOwnPropertyDescriptor(character[i][j], k));
							}
							if (j == "card" && lib[j][k].derivation) {
								if (!lib.cardPack.mode_derivation) {
									lib.cardPack.mode_derivation = [k];
								} else {
									lib.cardPack.mode_derivation.push(k);
								}
							}
						} else if (Array.isArray(lib[j][k]) && Array.isArray(character[i][j][k])) {
							lib[j][k].addArray(character[i][j][k]);
						} else {
							console.log(`duplicated ${j} in character ${i}:\n${k}:\nlib.${j}.${k}`, lib[j][k], `\ncharacter.${i}.${j}.${k}`, character[i][j][k]);
						}
					}
				}
			}
		}
		var connect_avatar_list = [];
		for (var i in lib.character) {
			connect_avatar_list.push(i);
		}
		connect_avatar_list.sort(lib.sort.capt);
		for (var i = 0; i < connect_avatar_list.length; i++) {
			var ia = connect_avatar_list[i];
			lib.mode.connect.config.connect_avatar.item[ia] = lib.translate[ia];
		}
		if (lib.config.mode != "connect") {
			var pilecfg = lib.config.customcardpile[get.config("cardpilename") || "当前牌堆"];
			if (pilecfg) {
				lib.config.bannedpile = get.copy(pilecfg[0] || {});
				lib.config.addedpile = get.copy(pilecfg[1] || {});
			} else {
				lib.config.bannedpile = {};
				lib.config.addedpile = {};
			}
		} else {
			lib.cardPackList = {};
		}
		for (i in card) {
			const cardPack = lib.cardPack[i] ? lib.cardPack[i] : (lib.cardPack[i] = []);
			if (card[i].card) {
				for (var j in card[i].card) {
					if (!card[i].card[j].hidden && card[i].translate[j + "_info"]) {
						cardPack.push(j);
					}
				}
			}
			for (j in card[i]) {
				if (j == "mode" || j == "forbid") continue;
				if (j == "connect") {
					connectCardPack.push(i);
					continue;
				}
				if (j == "list") {
					if (lib.config.mode == "connect") {
						const cardPackList = lib.cardPackList[i];
						if (cardPackList) cardPackList.addArray(card[i][j]);
						else lib.cardPackList[i] = card[i][j];
					} else {
						if (lib.config.cards.includes(i)) {
							var pile;
							if (typeof card[i][j] == "function") {
								pile = card[i][j]();
							} else {
								pile = card[i][j];
							}
							const cardPile = lib.cardPile[i];
							if (cardPile) cardPile.addArray(pile);
							else lib.cardPile[i] = pile.slice(0);
							if (lib.config.bannedpile[i]) {
								for (var k = 0; k < lib.config.bannedpile[i].length; k++) {
									pile[lib.config.bannedpile[i][k]] = null;
								}
							}
							for (var k = 0; k < pile.length; k++) {
								if (!pile[k]) {
									pile.splice(k--, 1);
								}
							}
							if (lib.config.addedpile[i]) {
								for (var k = 0; k < lib.config.addedpile[i].length; k++) {
									pile.push(lib.config.addedpile[i][k]);
								}
							}
							lib.card.list.addArray(pile);
						}
					}
				} else {
					for (k in card[i][j]) {
						if (j == "skill" && k[0] == "_" && !card[i][j][k].forceLoad && (lib.config.mode != "connect" ? !lib.config.cards.includes(i) : !card[i].connect)) {
							continue;
						}
						if (j == "translate" && k == i) {
							lib[j][k + "_card_config"] = card[i][j][k];
						} else {
							if (lib[j][k] == undefined) {
								if (j == "skill" && !card[i][j][k].forceLoad && lib.config.mode == "connect" && !card[i].connect) {
									lib[j][k] = {
										nopop: card[i][j][k].nopop,
										derivation: card[i][j][k].derivation,
									};
								} else {
									Object.defineProperty(lib[j], k, Object.getOwnPropertyDescriptor(card[i][j], k));
								}
							} else {
								console.log(`duplicated ${j} in card ${i}:\n${k}:\nlib.${j}.${k}`, lib[j][k], `\ncard.${i}.${j}.${k}`, card[i][j][k]);
							}
							if (j == "card" && lib[j][k].derivation) {
								if (!lib.cardPack.mode_derivation) {
									lib.cardPack.mode_derivation = [k];
								} else {
									lib.cardPack.mode_derivation.push(k);
								}
							}
						}
					}
				}
			}
		}
		if (lib.cardPack.mode_derivation) {
			for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
				if (typeof lib.card[lib.cardPack.mode_derivation[i]].derivation == "string" && !lib.character[lib.card[lib.cardPack.mode_derivation[i]].derivation]) {
					lib.cardPack.mode_derivation.splice(i--, 1);
				} else if (typeof lib.card[lib.cardPack.mode_derivation[i]].derivationpack == "string" && !lib.config.cards.includes(lib.card[lib.cardPack.mode_derivation[i]].derivationpack)) {
					lib.cardPack.mode_derivation.splice(i--, 1);
				}
			}
			if (lib.cardPack.mode_derivation.length == 0) {
				delete lib.cardPack.mode_derivation;
			}
		}
		if (lib.config.mode != "connect") {
			for (i in play) {
				if (lib.config.hiddenPlayPack.includes(i)) continue;
				if (play[i].forbid && play[i].forbid.includes(lib.config.mode)) continue;
				if (play[i].mode && play[i].mode.includes(lib.config.mode) == false) continue;
				for (j in play[i].element) {
					if (!lib.element[j]) lib.element[j] = [];
					for (k in play[i].element[j]) {
						if (k == "init") {
							if (!lib.element[j].inits) lib.element[j].inits = [];
							lib.element[j].inits.push(play[i].element[j][k]);
						} else {
							lib.element[j][k] = play[i].element[j][k];
						}
					}
				}
				for (j in play[i].ui) {
					if (typeof play[i].ui[j] == "object") {
						if (ui[j] == undefined) ui[j] = {};
						for (k in play[i].ui[j]) {
							ui[j][k] = play[i].ui[j][k];
						}
					} else {
						ui[j] = play[i].ui[j];
					}
				}
				for (j in play[i].game) {
					game[j] = play[i].game[j];
				}
				for (j in play[i].get) {
					get[j] = play[i].get[j];
				}
				for (j in play[i]) {
					if (j == "mode" || j == "forbid" || j == "init" || j == "element" || j == "game" || j == "get" || j == "ui" || j == "arenaReady") continue;
					for (k in play[i][j]) {
						if (j == "translate" && k == i) {
							// lib[j][k+'_play_config']=play[i][j][k];
						} else {
							if (lib[j][k] != undefined) {
								console.log(`duplicated ${j} in play ${i}:\n${k}:\nlib.${j}.${k}`, lib[j][k], `\nplay.${i}.${j}.${k}`, play[i][j][k]);
							}
							lib[j][k] = play[i][j][k];
						}
					}
				}
				if (typeof play[i].init == "function") play[i].init();
				if (typeof play[i].arenaReady == "function") lib.arenaReady.push(play[i].arenaReady);
			}
		}

		lib.connectCharacterPack = [];
		lib.connectCardPack = [];
		for (var i = 0; i < lib.config.all.characters.length; i++) {
			var packname = lib.config.all.characters[i];
			if (connectCharacterPack.includes(packname)) {
				lib.connectCharacterPack.push(packname);
			}
		}
		for (var i = 0; i < lib.config.all.cards.length; i++) {
			var packname = lib.config.all.cards[i];
			if (connectCardPack.includes(packname)) {
				lib.connectCardPack.push(packname);
			}
		}
		if (lib.config.mode != "connect") {
			for (i = 0; i < lib.card.list.length; i++) {
				if (lib.card.list[i][2] == "huosha") {
					lib.card.list[i] = lib.card.list[i].slice(0);
					lib.card.list[i][2] = "sha";
					lib.card.list[i][3] = "fire";
				} else if (lib.card.list[i][2] == "leisha") {
					lib.card.list[i] = lib.card.list[i].slice(0);
					lib.card.list[i][2] = "sha";
					lib.card.list[i][3] = "thunder";
				}
				if (!lib.card[lib.card.list[i][2]]) {
					lib.card.list.splice(i, 1);
					i--;
				} else if (lib.card[lib.card.list[i][2]].mode && lib.card[lib.card.list[i][2]].mode.includes(lib.config.mode) == false) {
					lib.card.list.splice(i, 1);
					i--;
				}
			}
		}

		if (lib.config.mode == "connect") {
			_status.connectMode = true;
		}
		if (window.isNonameServer) {
			lib.cheat.i();
		} else if (lib.config.dev && (!_status.connectMode || lib.config.debug)) {
			lib.cheat.i();
		}
		lib.config.sort_card = get.sortCard(lib.config.sort);
		delete lib.imported.character;
		delete lib.imported.card;
		delete lib.imported.mode;
		delete lib.imported.play;
		for (var i in lib.init) {
			if (i.startsWith("setMode_")) {
				delete lib.init[i];
			}
		}
		if (!_status.connectMode) {
			for (var i = 0; i < lib.extensions.length; i++) {
				try {
					_status.extension = lib.extensions[i][0];
					_status.evaluatingExtension = lib.extensions[i][3];
					if (typeof lib.extensions[i][1] == "function")
						try {
							await (gnc.is.coroutine(lib.extensions[i][1]) ? gnc.of(lib.extensions[i][1]) : lib.extensions[i][1]).call(lib.extensions[i], lib.extensions[i][2], lib.extensions[i][4]);
						} catch (e) {
							console.log(`加载《${lib.extensions[i][0]}》扩展的content时出现错误。`, e);
							if (!lib.config.extension_alert) alert(`加载《${lib.extensions[i][0]}》扩展的content时出现错误。\n该错误本身可能并不影响扩展运行。您可以在“设置→通用→无视扩展报错”中关闭此弹窗。\n${decodeURI(e.stack)}`);
						}
					if (lib.extensions[i][4]) {
						if (lib.extensions[i][4].character) {
							for (var j in lib.extensions[i][4].character.character) {
								game.addCharacterPack(get.copy(lib.extensions[i][4].character));
								break;
							}
						}
						if (lib.extensions[i][4].card) {
							for (var j in lib.extensions[i][4].card.card) {
								game.addCardPack(get.copy(lib.extensions[i][4].card));
								break;
							}
						}
						if (lib.extensions[i][4].skill) {
							for (var j in lib.extensions[i][4].skill.skill) {
								game.addSkill(j, lib.extensions[i][4].skill.skill[j], lib.extensions[i][4].skill.translate[j], lib.extensions[i][4].skill.translate[j + "_info"], lib.extensions[i][4].skill.translate[j + "_append"], lib.extensions[i][4].skill.translate[j + "_ab"]);
							}
						}
					}
					delete _status.extension;
					delete _status.evaluatingExtension;
				} catch (e) {
					console.log(e);
				}
			}
		}
		delete lib.extensions;

		if (lib.init.startBefore) {
			lib.init.startBefore();
			delete lib.init.startBefore;
		}
		ui.create.arena();
		game.createEvent("game", false).setContent(lib.init.start);
		if (lib.mode[lib.config.mode] && lib.mode[lib.config.mode].fromextension) {
			var startstr = mode[lib.config.mode].start.toString();
			if (startstr.indexOf("onfree") == -1) {
				setTimeout(lib.init.onfree, 500);
			}
		}
		delete lib.init.start;
		if (Array.isArray(_status.onprepare) && _status.onprepare.length) {
			await Promise.allSettled(_status.onprepare);
			delete _status.onprepare;
		}
		game.loop();
	};

	localStorage.removeItem(lib.configprefix + "directstart");
	if (!lib.imported.mode?.[lib.config.mode]) {
		window.inSplash = true;
		clearTimeout(window.resetGameTimeout);

		if (typeof lib.config.splash_style == "undefined") game.saveConfig("splash_style", lib.onloadSplashes[0].id);
		let splash = lib.onloadSplashes.find(item => item.id === lib.config.splash_style);
		if (!splash) splash = lib.onloadSplashes[0];

		let node = ui.create.div("#splash", document.body);

		let { promise, resolve } = Promise.withResolvers();
		await splash.init(node, resolve);

		let result = await promise;

		let splashInRemoing = await splash.dispose(node);
		if (!splashInRemoing) node.remove();
		window.resetGameTimeout = setTimeout(lib.init.reset, 10000);
		delete window.inSplash;
		game.saveConfig("mode", result);
		await importMode(result);
	}
	lib.storage = (await load(lib.config.mode, "data")) || {};

	/*
	if (!lib.db) {
		try {
			lib.storage = JSON.parse(localStorage.getItem(lib.configprefix + lib.config.mode));
			if (typeof lib.storage != "object" || lib.storage == null) jumpToCatchBlock();
		} catch (err) {
			lib.storage = {};
			localStorage.setItem(lib.configprefix + lib.config.mode, "{}");
		}
	} else {
		let storage = await game.getDB("data", lib.config.mode);
		lib.storage = storage || {};
	}
	 */

	const libOnload2 = lib.onload2;
	delete lib.onload2;
	await runCustomContents(libOnload2);

	await Promise.allSettled(loadingCustomStyle);
	await proceed2();
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

	if (!lib.config.image_background) return;
	if (lib.config.image_background === "default") return;

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
		if (_status.dragged) return;
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
	if (!Array.isArray(contents)) return;

	const mutex = new Mutex();

	const tasks = contents
		.filter(fn => typeof fn === "function")
		.map(fn => (gnc.is.generatorFunc(fn) ? gnc.of(fn) : fn)) // 将生成器函数转换成genCoroutin
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
