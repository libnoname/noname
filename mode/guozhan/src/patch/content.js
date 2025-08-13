import { lib, game as _game, ui, get as _get, ai, _status } from "../../../../noname.js";
import { GameEvent, Dialog, Player as _Player, Control, Button, Character } from "../../../../noname/library/element/index.js";
import { GameGuozhan, broadcast, broadcastAll } from "./game.js";
import { GetGuozhan } from "./get.js";
import { delay } from "../../../../noname/util/index.js";

import { PlayerGuozhan as Player } from "./player.js";

/** @type {GameGuozhan} */
// @ts-expect-error 类型就是这么定的
const game = _game;
/** @type {GetGuozhan} */
// @ts-expect-error 类型就是这么定的
const get = _get;
const html = String.raw;

/**
 * @param {GameEvent} event
 * @param {GameEvent} _trigger
 * @param {Player} _player
 */
export const chooseCharacterContent = async (event, _trigger, _player) => {
	ui.arena.classList.add("choose-character");

	Reflect.set(event, "addSetting", addSetting);
	Reflect.set(event, "removeSetting", removeSetting);

	// 再战的角色选择
	const chosen = lib.config.continue_name || [];
	game.saveConfig("continue_name");
	Reflect.set(event, "chosen", chosen);

	// 获取可选择的角色
	/** @type {string[]} */
	let characterList = [];
	for (const character in lib.character) {
		if (character.indexOf("gz_shibing") == 0) {
			continue;
		}
		if (chosen.includes(character)) {
			continue;
		}
		if (lib.filter.characterDisabled(character)) {
			continue;
		}
		if (get.config("onlyguozhan")) {
			if (!lib.characterGuozhanFilter.some(pack => lib.characterPack[pack][character])) {
				continue;
			}
			if (get.is.jun(character)) {
				continue;
			}
		}
		if (lib.character[character].hasHiddenSkill) {
			continue;
		}
		characterList.push(character);
	}
	Reflect.set(_status, "characterlist", characterList.slice(0));
	Reflect.set(_status, "yeidentity", []);

	// 乱斗模式下对武将的过滤
	if (_status.brawl && _status.brawl.chooseCharacterFilter) {
		characterList = _status.brawl.chooseCharacterFilter(characterList);
	}

	characterList.randomSort();

	// 获取玩家能选择的角色
	/** @type {string[]} */
	let chooseList;
	if (_status.brawl && _status.brawl.chooseCharacter) {
		chooseList = _status.brawl.chooseCharacter(characterList, game.me);
	} else {
		chooseList = game.getCharacterChoice(characterList, parseInt(get.config("choice_num")));
	}

	// 如果托管，则自动选择
	if (_status.auto && event.ai != null) {
		event.ai(game.me, chooseList);
		lib.init.onfree();
	}
	// 如果存在“再战”记录，则使用该记录
	else if (chosen.length) {
		game.me.init(chosen[0], chosen[1], false, void 0);
		lib.init.onfree();
	}
	// 反之，显示选择角色的对话框
	else {
		const result = await createChooseCharacterDialog().forResult();

		// 关闭已打开的额外对话框
		for (const name of ["cheat", "cheat2"]) {
			if (!Reflect.has(ui, name)) {
				continue;
			}

			Reflect.get(ui, name).close();
			Reflect.deleteProperty(ui, name);
		}

		if (result?.buttons) {
			/** @type {string} */
			// @ts-expect-error 祖宗之法就是这么写的
			const name1 = result.buttons[0].link;
			/** @type {string} */
			// @ts-expect-error 祖宗之法就是这么写的
			const name2 = result.buttons[1].link;
			const characterChosen = [name1, name2];

			/** @type {Partial<Result>?} */
			let result2 = null;

			// @ts-expect-error 祖宗之法就是这么写的
			if (get.is.double(name1, true)) {
				// @ts-expect-error 祖宗之法就是这么写的
				if (!get.is.double(name2, true)) {
					result2 = { control: lib.character[name2][1] };
				}
				// 仙人之兮列如麻
				// @ts-expect-error 祖宗之法就是这么写的
				else if (get.is.double(name1, true).removeArray(get.is.double(name2, true)).length == 0 || get.is.double(name2, true).removeArray(get.is.double(name1, true)).length == 0) {
					const next = game.me
						// @ts-expect-error 祖宗之法就是这么写的
						.chooseControl(get.is.double(name2, true).filter(group => get.is.double(name1, true).includes(group)));

					next.set("prompt", "请选择你代表的势力");
					// @ts-expect-error 祖宗之法就是这么写的
					next.set("ai", () => _status.event.controls.randomGet());

					result2 = await next.forResult();
				} else {
					result2 = {
						// @ts-expect-error 祖宗之法就是这么写的
						control: get.is.double(name1, true).find(group => get.is.double(name2, true).includes(group)),
					};
				}
			}
			// @ts-expect-error 祖宗之法就是这么写的
			else if (lib.character[name1][1] == "ye" && get.is.double(name2, true)) {
				const next = game.me
					// @ts-expect-error 祖宗之法就是这么写的
					.chooseControl(get.is.double(name2, true));

				next.set("prompt", "请选择副将代表的势力");
				// @ts-expect-error 祖宗之法就是这么写的
				next.set("ai", () => _status.event.controls.randomGet());

				result2 = await next.forResult();
			}

			if (result2?.control) {
				// @ts-expect-error 祖宗之法就是这么写的
				game.me.trueIdentity = result2.control;
			}
			if (characterChosen) {
				game.me.init(characterChosen[0], characterChosen[1], false, void 0);
				game.addRecentCharacter(characterChosen[0], characterChosen[1]);
			}
			characterList.remove(game.me.name1);
			characterList.remove(game.me.name2);
		}
	}

	Reflect.set(_status, "_startPlayerNames", {
		name: game.me.name,
		name1: game.me.name1,
		name2: game.me.name2,
	});

	for (const player of game.players) {
		if (player != game.me) {
			event.ai?.(player, game.getCharacterChoice(characterList, parseInt(get.config("choice_num"))), characterList);
		}
	}

	for (let i = 0; i < game.players.length; ++i) {
		game.players[i].classList.add("unseen");
		game.players[i].classList.add("unseen2");
		// @ts-expect-error 祖宗之法就是这么写的
		_status.characterlist.remove(game.players[i].name);
		// @ts-expect-error 祖宗之法就是这么写的
		_status.characterlist.remove(game.players[i].name2);
		if (game.players[i] != game.me) {
			// @ts-expect-error 祖宗之法就是这么写的
			game.players[i].node.identity.firstChild.innerHTML = "猜";
			game.players[i].node.identity.dataset.color = "unknown";
			game.players[i].node.identity.classList.add("guessing");
		}
		game.players[i].hiddenSkills = lib.character[game.players[i].name1][3].slice(0);
		var hiddenSkills2 = lib.character[game.players[i].name2][3];
		for (var j = 0; j < hiddenSkills2.length; j++) {
			game.players[i].hiddenSkills.add(hiddenSkills2[j]);
		}
		for (var j = 0; j < game.players[i].hiddenSkills.length; j++) {
			if (!lib.skill[game.players[i].hiddenSkills[j]]) {
				game.players[i].hiddenSkills.splice(j--, 1);
			}
		}
		game.players[i].group = "unknown";
		game.players[i].sex = "unknown";
		game.players[i].name1 = game.players[i].name;
		game.players[i].name = "unknown";
		game.players[i].identity = "unknown";
		game.players[i].node.name.show();
		game.players[i].node.name2.show();
		for (var j = 0; j < game.players[i].hiddenSkills.length; j++) {
			// @ts-expect-error 祖宗之法就是这么写的
			game.players[i].addSkillTrigger(game.players[i].hiddenSkills[j], true);
		}
	}

	delay(500).then(() => {
		ui.arena.classList.remove("choose-character");
	});

	return;

	/**
	 * @param {Dialog} dialog
	 */
	function addSetting(dialog) {
		const seatNode = dialog.add("选择座位");
		if (typeof seatNode === "object" && seatNode instanceof HTMLElement) {
			seatNode.classList.add("add-setting");
		}

		const seats = document.createElement("table");
		seats.classList.add("add-setting");
		seats.style.margin = "0";
		seats.style.width = "100%";
		seats.style.position = "relative";

		for (let i = 1; i <= game.players.length; ++i) {
			const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
			td.innerHTML = html`<span>${get.cnNumber(i, true)}</span>`;
			Reflect.set(td, "link", i - 1);

			seats.appendChild(td);

			td.addEventListener("pointerup", onPointerup);

			/**
			 * @param {PointerEvent} event
			 */
			function onPointerup(event) {
				// 对于输入，必须被识别为“主要输入”，如鼠标左键或单点触控
				// 如果不是主要输入，则忽略
				if (!event.isPrimary) {
					return;
				}

				// 对于鼠标来说，必须是左键点击（对应click）
				if (event.button != 0) {
					return;
				}

				// 如果目前有正在拖拽的元素，就忽略当前点击
				if (_status.dragged) {
					return;
				}
				// 后面不知道，略过
				// @ts-expect-error 祖宗之法就是这么写的
				if (_status.justdragged) {
					return;
				}
				// @ts-expect-error 祖宗之法就是这么写的
				if (_status.cheat_seat) {
					// @ts-expect-error 祖宗之法就是这么写的
					_status.cheat_seat.classList.remove("bluebg");
					// @ts-expect-error 祖宗之法就是这么写的
					if (_status.cheat_seat == this) {
						// @ts-expect-error 祖宗之法就是这么写的
						delete _status.cheat_seat;
						return;
					}
				}
				this.classList.add("bluebg");
				// @ts-expect-error 祖宗之法就是这么写的
				_status.cheat_seat = this;
			}
		}

		dialog.content.appendChild(seats);

		dialog.add(ui.create.div(".placeholder.add-setting"));
		dialog.add(ui.create.div(".placeholder.add-setting"));
		if (get.is.phoneLayout()) {
			dialog.add(ui.create.div(".placeholder.add-setting"));
		}
	}

	function removeSetting() {
		const event = get.event();
		/** @type {Dialog?} */
		const dialog = Reflect.get(event, "dialog");
		if (dialog == null) {
			return;
		}

		dialog.style.height = "";
		Reflect.deleteProperty(dialog, "_scrollset");

		const list = dialog.querySelectorAll(".add-setting");

		for (const node of list) {
			node.remove();
		}

		ui.update();
	}

	function createChooseCharacterDialog() {
		const dialog = ui.create.dialog("选择角色", "hidden", [chooseList, "character"]);

		// 如果是乱斗模式，添加额外的设置
		if (!_status.brawl || !_status.brawl.noAddSetting) {
			if (get.config("change_identity")) {
				addSetting(dialog);
			}
		}

		const next = game.me.chooseButton(dialog, true, 2);

		next.set("onfree", true);
		next.set("filterButton", filterButton);
		next.set("switchToAuto", switchToAuto);

		if (lib.onfree) {
			lib.onfree.push(createCharacterDialog);
		} else {
			createCharacterDialog();
		}

		Reflect.set(ui.create, "cheat2", createCheat2);
		Reflect.set(ui.create, "cheat", createCheat);

		if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
			// @ts-expect-error 祖宗之法就是这么写的
			if (!ui.cheat && get.config("change_choice")) {
				ui.create.cheat();
			}
			// @ts-expect-error 祖宗之法就是这么写的
			if (!ui.cheat2 && get.config("free_choose")) {
				ui.create.cheat2();
			}
		}

		return next;

		/**
		 * @param {Button} button
		 */
		function filterButton(button) {
			if (ui.dialog.buttons.length <= 10) {
				for (var i = 0; i < ui.dialog.buttons.length; i++) {
					if (ui.dialog.buttons[i] != button) {
						if (
							// @ts-expect-error 祖宗之法就是这么写的
							lib.element.player.perfectPair.call(
								{
									// @ts-expect-error 祖宗之法就是这么写的
									name1: button.link,
									// @ts-expect-error 祖宗之法就是这么写的
									name2: ui.dialog.buttons[i].link,
								},
								true
							)
						) {
							button.classList.add("glow2");
						}
					}
				}
			}
			// @ts-expect-error 祖宗之法就是这么写的
			if (lib.character[button.link].hasHiddenSkill) {
				return false;
			}
			var filterChoice = function (name1, name2) {
				// @ts-expect-error 祖宗之法就是这么写的
				if (_status.separatism) {
					return true;
				}
				var group1 = lib.character[name1][1];
				var group2 = lib.character[name2][1];
				// @ts-expect-error 祖宗之法就是这么写的
				var doublex = get.is.double(name1, true);
				if (doublex) {
					// @ts-expect-error 祖宗之法就是这么写的
					var double = get.is.double(name2, true);
					// @ts-expect-error 祖宗之法就是这么写的
					if (double) {
						return doublex.some(group => double.includes(group));
					}
					// @ts-expect-error 祖宗之法就是这么写的
					return doublex.includes(group2);
				} else {
					if (group1 == "ye") {
						return group2 != "ye";
					}
					// @ts-expect-error 祖宗之法就是这么写的
					var double = get.is.double(name2, true);
					// @ts-expect-error 祖宗之法就是这么写的
					if (double) {
						return double.includes(group1);
					}
					return group1 == group2;
				}
			};
			if (!ui.selected.buttons.length) {
				return ui.dialog.buttons.some(but => {
					if (but == button) {
						return false;
					}
					// @ts-expect-error 祖宗之法就是这么写的
					return filterChoice(button.link, but.link);
				});
			}
			// @ts-expect-error 祖宗之法就是这么写的
			return filterChoice(ui.selected.buttons[0].link, button.link);
		}

		function switchToAuto() {
			event.ai?.(game.me, chooseList);
			ui.arena.classList.remove("selecting");
		}
	}

	function createCharacterDialog() {
		const dialogxx = ui.create.characterDialog(
			"heightset",
			function (i) {
				if (i.indexOf("gz_shibing") == 0) {
					return true;
				}
				if (get.config("onlyguozhan")) {
					if (!lib.characterGuozhanFilter.some(pack => lib.characterPack[pack][i])) {
						return true;
					}
					if (get.is.jun(i)) {
						return true;
					}
				}
			},
			get.config("onlyguozhanexpand") ? "expandall" : undefined,
			get.config("onlyguozhan") ? "onlypack:mode_guozhan" : undefined
		);
		Reflect.set(event, "dialogxx", dialogxx);

		const cheat2 = Reflect.get(ui, "cheat2");
		if (cheat2 != null) {
			cheat2.addTempClass("controlpressdownx", 500);
			cheat2.classList.remove("disabled");
		}
	}

	function createCheat2() {
		const cheat2 = ui.create.control("自由选将", onClick);
		Reflect.set(ui, "cheat2", cheat2);

		if (lib.onfree) {
			cheat2.classList.add("disabled");
		}

		/** @this {Control} */
		function onClick() {
			// @ts-expect-error 祖宗之法就是这么写的
			if (this.dialog == _status.event?.dialog) {
				// @ts-expect-error 祖宗之法就是这么写的
				if (game.changeCoin) {
					// @ts-expect-error 祖宗之法就是这么写的
					game.changeCoin(10);
				}
				// @ts-expect-error 祖宗之法就是这么写的
				this.dialog.close();
				// @ts-expect-error 祖宗之法就是这么写的
				_status.event.dialog = this.backup;
				// @ts-expect-error 祖宗之法就是这么写的
				this.backup.open();
				// @ts-expect-error 祖宗之法就是这么写的
				delete this.backup;
				game.uncheck();
				game.check();
				// @ts-expect-error 祖宗之法就是这么写的
				if (ui.cheat) {
					// @ts-expect-error 祖宗之法就是这么写的
					ui.cheat.addTempClass("controlpressdownx", 500);
					// @ts-expect-error 祖宗之法就是这么写的
					ui.cheat.classList.remove("disabled");
				}
			} else {
				// @ts-expect-error 祖宗之法就是这么写的
				if (game.changeCoin) {
					// @ts-expect-error 祖宗之法就是这么写的
					game.changeCoin(-10);
				}
				// @ts-expect-error 祖宗之法就是这么写的
				this.backup = _status.event.dialog;
				// @ts-expect-error 祖宗之法就是这么写的
				_status.event.dialog.close();
				// @ts-expect-error 祖宗之法就是这么写的
				_status.event.dialog = _status.event.parent.dialogxx;
				// @ts-expect-error 祖宗之法就是这么写的
				this.dialog = _status.event.dialog;
				// @ts-expect-error 祖宗之法就是这么写的
				this.dialog.open();
				game.uncheck();
				game.check();
				// @ts-expect-error 祖宗之法就是这么写的
				if (ui.cheat) {
					// @ts-expect-error 祖宗之法就是这么写的
					ui.cheat.classList.add("disabled");
				}
			}
		}
	}

	function createCheat() {
		// @ts-expect-error 祖宗之法就是这么写的
		_status.createControl = ui.cheat2;
		const cheat = ui.create.control("更换", function () {
			// @ts-expect-error 祖宗之法就是这么写的
			if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
				return;
			}
			// @ts-expect-error 祖宗之法就是这么写的
			if (game.changeCoin) {
				// @ts-expect-error 祖宗之法就是这么写的
				game.changeCoin(-3);
			}
			characterList = characterList.concat(chooseList);
			characterList.randomSort();
			// list=event.list.splice(0,parseInt(get.config('choice_num')));
			chooseList = game.getCharacterChoice(characterList, parseInt(get.config("choice_num")));
			var buttons = ui.create.div(".buttons");
			// @ts-expect-error 祖宗之法就是这么写的
			var node = _status.event.dialog.buttons[0].parentNode;
			// @ts-expect-error 祖宗之法就是这么写的
			_status.event.dialog.buttons = ui.create.buttons(chooseList, "character", buttons);
			// @ts-expect-error 祖宗之法就是这么写的
			_status.event.dialog.content.insertBefore(buttons, node);
			buttons.addTempClass("start");
			node.remove();
			game.uncheck();
			game.check();
		});
		Reflect.set(ui, "cheat", cheat);
		// @ts-expect-error 祖宗之法就是这么写的
		delete _status.createControl;
	}
}

/**
 * @param {GameEvent} event
 * @param {GameEvent} _trigger
 * @param {Player} _player
 */
export const chooseCharacterOLContent = async (event, _trigger, _player) => {
	broadcastAll(() => {
		ui.arena.classList.add("choose-character");
		for (const player of game.players) {
			player.classList.add("unseen");
			player.classList.add("unseen2");
		}
	});

	/** @type {Record<string, Character>} */
	const pack = Reflect.get(lib.characterPack, "mode_guozhan");
	const characterList = Object.keys(pack).filter(character => {
		return !character.startsWith("gz_shibing") && !get.is.jun(character) && !lib.config.guozhan_banned?.includes(character);
	});
	Reflect.set(_status, "characterlist", characterList.slice(0));
	Reflect.set(_status, "yeidentity", []);

	const list2 = [];
	let num;
	if (lib.configOL.number * 6 > characterList.length) {
		num = 5;
	} else if (lib.configOL.number * 7 > characterList.length) {
		num = 6;
	} else {
		num = 7;
	}

	characterList.randomSort();
	for (const player of game.players) {
		list2.push([player, ["选择角色", [game.getCharacterChoice(characterList, num), "character"]], 2, true, () => Math.random(), filterButton]);
	}

	const next = game.me.chooseButtonOL(
		list2,
		(player, result) => {
			if (game.online || player == game.me) {
				player.init(result.links[0], result.links[1], false);
			}
		},
		void 0
	);

	next.set("processAI", chooseCharacterCheck);
	next.set("switchToAuto", () => {
		Reflect.set(get.event(), "result", "ai");
	});

	const chooseCharacterResult = await next.forResult();

	let sort = true;
	const chosen = [];
	const chosenCharacter = [];

	for (const i in chooseCharacterResult) {
		if (chooseCharacterResult[i] && chooseCharacterResult[i].links) {
			for (var j = 0; j < chooseCharacterResult[i].links.length; j++) {
				characterList.remove(chooseCharacterResult[i].links[j]);
			}
		}
	}

	for (const i in chooseCharacterResult) {
		if (chooseCharacterResult[i] == "ai" || !chooseCharacterResult[i].links || chooseCharacterResult[i].links.length < 1) {
			if (sort) {
				sort = false;
				characterList.randomSort();
			}
			chooseCharacterResult[i] = [characterList.shift()];
			const group = lib.character[chooseCharacterResult[i][0]][1];
			for (let j = 0; j < characterList.length; j++) {
				if (lib.character[characterList[j]][1] == group) {
					chooseCharacterResult[i].push(characterList[j]);
					characterList.splice(j--, 1);
					break;
				}
			}
		} else {
			chooseCharacterResult[i] = chooseCharacterResult[i].links;
		}
		const name1 = chooseCharacterResult[i][0];
		const name2 = chooseCharacterResult[i][1];
		// @ts-expect-error 祖宗之法就是这么写的
		if (get.is.double(name1, true)) {
			// @ts-expect-error 祖宗之法就是这么写的
			if (!get.is.double(name2, true)) {
				// @ts-expect-error 祖宗之法就是这么写的
				lib.playerOL[i].trueIdentity = lib.character[name2][1];
				// @ts-expect-error 祖宗之法就是这么写的
			} else if (get.is.double(name1, true).removeArray(get.is.double(name2, true)).length == 0 || get.is.double(name2, true).removeArray(get.is.double(name1, true)).length == 0) {
				chosen.push(lib.playerOL[i]);
				chosenCharacter.push([name1, name2]);
			} else {
				// @ts-expect-error 祖宗之法就是这么写的
				lib.playerOL[i].trueIdentity = get.is.double(name1, true).find(group => get.is.double(name2, true).includes(group));
			}
			// @ts-expect-error 祖宗之法就是这么写的
		} else if (lib.character[name1][1] == "ye" && get.is.double(name2, true)) {
			chosen.push(lib.playerOL[i]);
			chosenCharacter.push([name1, name2]);
		}
	}

	let chooseGroupResult = {};
	if (chosen.length) {
		for (let i = 0; i < chosen.length; ++i) {
			const name1 = chosenCharacter[i][0];
			const name2 = chosenCharacter[i][1];
			let str;
			let choice;
			// @ts-expect-error 祖宗之法就是这么写的
			if (get.is.double(name1, true)) {
				str = "请选择你代表的势力";
				// @ts-expect-error 祖宗之法就是这么写的
				choice = get.is.double(name2, true).filter(group => get.is.double(name1, true).includes(group));
			}
			if (lib.character[name1][1] == "ye") {
				str = "请选择你的副将代表的势力";
				// @ts-expect-error 祖宗之法就是这么写的
				choice = get.is.double(name2, true);
			}
			chosen[i] = [chosen[i], [str, [choice.map(i => ["", "", "group_" + i]), "vcard"]], 1, true];
		}

		chooseGroupResult = await game.me
			.chooseButtonOL(
				chosen,
				function (player, result) {
					if (player == game.me) {
						player.trueIdentity = result.links[0][2].slice(6);
					}
				},
				void 0
			)
			.set("switchToAuto", () => {
				// @ts-expect-error 祖宗之法就是这么写的
				_status.event.result = "ai";
			})
			.set("processAI", () => {
				return {
					bool: true,
					// @ts-expect-error 祖宗之法就是这么写的
					links: [_status.event.dialog.buttons.randomGet().link],
				};
			})
			.forResult();
	}

	broadcastAll(
		(result, result2, delay) => {
			for (const current of game.players) {
				const id = current.playerid;
				// @ts-expect-error 祖宗之法就是这么写的
				if (result[id] && !current.name) {
					// @ts-expect-error 祖宗之法就是这么写的
					current.init(result[id][0], result[id][1], false);
				}
				// @ts-expect-error 祖宗之法就是这么写的
				if (result2[id] && result2[id].length) {
					// @ts-expect-error 祖宗之法就是这么写的
					current.trueIdentity = result2[id][0][2].slice(6);
				}
				if (current != game.me) {
					// @ts-expect-error 祖宗之法就是这么写的
					current.node.identity.firstChild.innerHTML = "猜";
					current.node.identity.dataset.color = "unknown";
					current.node.identity.classList.add("guessing");
				}
				current.hiddenSkills = lib.character[current.name1][3].slice(0);
				const hiddenSkills2 = lib.character[current.name2][3];
				for (const skill of hiddenSkills2) {
					current.hiddenSkills.add(skill);
				}
				for (let j = 0; j < current.hiddenSkills.length; j++) {
					if (!lib.skill[current.hiddenSkills[j]]) {
						current.hiddenSkills.splice(j--, 1);
					}
				}
				current.group = "unknown";
				current.sex = "unknown";
				current.name1 = current.name;
				current.name = "unknown";
				current.identity = "unknown";
				current.node.name.show();
				current.node.name2.show();
				for (const skill of current.hiddenSkills) {
					// @ts-expect-error 祖宗之法就是这么写的
					current.addSkillTrigger(skill, true);
				}
			}

			delay(500).then(() => {
				ui.arena.classList.remove("choose-character");
			});
		},
		chooseCharacterResult,
		chooseGroupResult,
		delay
	);

	return;

	function filterButton(button) {
		if (ui.dialog) {
			if (ui.dialog.buttons.length <= 10) {
				for (const btn of ui.dialog.buttons) {
					if (btn !== button) {
						if (
							// @ts-expect-error 祖宗之法就是这么写的
							lib.element.player.perfectPair.call(
								{
									name1: button.link,
									// @ts-expect-error 祖宗之法就是这么写的
									name2: btn.link,
								},
								true
							)
						) {
							button.classList.add("glow2");
						}
					}
				}
			}
		}
		const filterChoice = (name1, name2) => {
			// @ts-expect-error 祖宗之法就是这么写的
			if (_status.separatism) {
				return true;
			}
			const group1 = lib.character[name1][1];
			const group2 = lib.character[name2][1];
			// @ts-expect-error 祖宗之法就是这么写的
			const doublex = get.is.double(name1, true);
			if (doublex) {
				// @ts-expect-error 祖宗之法就是这么写的
				const double = get.is.double(name2, true);
				// @ts-expect-error 祖宗之法就是这么写的
				if (double) {
					return doublex.some(group => double.includes(group));
				}
				// @ts-expect-error 祖宗之法就是这么写的
				return doublex.includes(group2);
			} else {
				if (group1 === "ye") {
					return group2 !== "ye";
				}
				// @ts-expect-error 祖宗之法就是这么写的
				const double = get.is.double(name2, true);
				// @ts-expect-error 祖宗之法就是这么写的
				if (double) {
					return double.includes(group1);
				}
				return group1 === group2;
			}
		};
		if (!ui.selected.buttons.length) {
			return ui.dialog.buttons.some(but => {
				if (but === button) {
					return false;
				}
				// @ts-expect-error 祖宗之法就是这么写的
				return filterChoice(button.link, but.link);
			});
		}
		// @ts-expect-error 祖宗之法就是这么写的
		return filterChoice(ui.selected.buttons[0].link, button.link);
	}

	function chooseCharacterCheck() {
		// @ts-expect-error 祖宗之法就是这么写的
		const buttons = _status.event.dialog.buttons;

		const filterChoice = (name1, name2) => {
			// @ts-expect-error 祖宗之法就是这么写的
			if (_status.separatism) {
				return true;
			}
			const group1 = lib.character[name1][1];
			const group2 = lib.character[name2][1];
			// @ts-expect-error 祖宗之法就是这么写的
			const doublex = get.is.double(name1, true);
			if (doublex) {
				// @ts-expect-error 祖宗之法就是这么写的
				const double = get.is.double(name2, true);
				// @ts-expect-error 祖宗之法就是这么写的
				if (double) {
					return doublex.some(group => double.includes(group));
				}
				// @ts-expect-error 祖宗之法就是这么写的
				return doublex.includes(group2);
			} else {
				if (group1 === "ye") {
					return group2 !== "ye";
				}
				// @ts-expect-error 祖宗之法就是这么写的
				const double = get.is.double(name2, true);
				// @ts-expect-error 祖宗之法就是这么写的
				if (double) {
					return double.includes(group1);
				}
				return group1 === group2;
			}
		};

		for (let i = 0; i < buttons.length - 1; ++i) {
			const button1 = buttons[i];
			for (let j = i + 1; j < buttons.length; ++j) {
				const button2 = buttons[j];

				if (filterChoice(button1.link, button2.link) || filterChoice(button2.link, button1.link)) {
					let mainx = button1.link;
					let vicex = button2.link;

					if (!filterChoice(mainx, vicex) || (filterChoice(vicex, mainx) && get.guozhanReverse(mainx, vicex))) {
						mainx = button2.link;
						vicex = button1.link;
					}
					const list = [mainx, vicex];
					return {
						bool: true,
						links: list,
					};
				}
			}
		}
	}
}

/**
 * @param {GameEvent} event
 * @param {GameEvent} _trigger
 * @param {Player} player
 */
export const showYexingsContent = async (event, _trigger, player) => {
	/** @type {Player[]} */
	// @ts-expect-error 祖宗之法就是这么做的
	const yexingPlayers = game
		// @ts-expect-error 祖宗之法就是这么做的
		.filterPlayer(current => lib.character[current.name1][1] == "ye" && !current._showYexing)
		// @ts-expect-error 祖宗之法就是这么写的
		.sortBySeat(_status.currentPhase);

	/** @type {Player[]} */
	let showYexingPlayers = [];
	for (const target of yexingPlayers) {
		const next = target.chooseBool("是否【暴露野心】，展示主将并继续战斗？", "若选择“否”，则视为本局游戏失败");

		next.set("ai", showCheck);

		if (await next.forResultBool()) {
			showYexingPlayers.push(target);
			target.$fullscreenpop("暴露野心", "thunder");
			game.log(target, "暴露了野心");
			await target.showCharacter(0);
			await game.delay(2);

			broadcastAll(
				/**
				 * @param {Player} player
				 */
				player => {
					// @ts-expect-error 祖宗之法就是这么做的
					player._showYexing = true;
				},
				target
			);
		}

		/**
		 * 是否暴露野心的AI
		 *
		 * @param {GameEvent} _event
		 * @param {Player} _player
		 */
		function showCheck(_event, _player) {
			// TODO: 未来再想AI该怎么写
			return Math.random() < 0.5;
		}
	}

	// 如果没有人暴露野心，那么游戏结束
	if (showYexingPlayers.length === 0) {
		const winner = game.findPlayer(current => lib.character[current.name1][1] != "ye");

		if (winner) {
			broadcastAll(id => {
				// @ts-expect-error 祖宗之法就是这么写的
				game.winner_id = id;
			}, winner.playerid);
			game.checkResult();
		}

		// @ts-expect-error 祖宗之法就是这么写的
		delete _status.showYexings;
		return;
	}

	let yexingGroupList = ["夏", "商", "周", "秦", "汉", "隋", "唐", "宋", "辽", "金", "元", "明"];
	for (const target of showYexingPlayers) {
		// 基本不可能发生
		if (yexingGroupList.length === 0) {
			yexingGroupList = ["夏", "商", "周", "秦", "汉", "隋", "唐", "宋", "辽", "金", "元", "明"];
		}

		const next = target.chooseControl(yexingGroupList);

		next.set("prompt", "请选择自己所属的野心家势力的标识");
		next.set("ai", () => (yexingGroupList ? yexingGroupList.randomGet() : 0));

		/** @type {string} */
		let text;

		const control = await next.forResultControl();
		if (control) {
			text = control;
			yexingGroupList.remove(control);
		} else {
			text = yexingGroupList.randomRemove() ?? "野";
		}

		lib.group.push(text);
		lib.translate[`${text}2`] = text;
		lib.groupnature[text] = "kami";

		broadcastAll(
			/**
			 * @param {Player} player
			 * @param {string} text
			 */
			(player, text) => {
				player.identity = text;
				player.setIdentity(text, "kami");
			},
			target,
			text
		);

		target.changeGroup(text);
		target.removeMark("yexinjia_mark", 1);

		/** @type {Player[]} */
		// @ts-expect-error 祖宗之法就是这么做的
		const maybeFriends = game.players.filter(current => current.identity != "ye" && current !== target && !get.is.jun(current) && !yexingPlayers.includes(current) && !current.getStorage("yexinjia_friend").length);
		if (maybeFriends.length === 0) {
			continue;
		}

		/** @type {Player[]} */
		const refused = [];
		for (const other of maybeFriends) {
			target.line(other, "green");

			const next = other.chooseBool(`是否响应${get.translation(target)}发起的【拉拢人心】？`, `将势力改为${text}`);

			next.set("source", target);
			next.set("ai", check);

			if (await next.forResultBool()) {
				other.chat("加入");
				//event.targets4.push(target);
				broadcastAll(
					/**
					 * @param {Player} player
					 * @param {string} text
					 */
					(player, text) => {
						player.identity = text;
						player.setIdentity(text, "kami");
					},
					other,
					text
				);
				other.changeGroup(text);
			} else {
				other.chat("拒绝");
				refused.push(other);
			}

			/**
			 * @param {GameEvent} _event
			 * @param {Player} _player
			 * @returns {boolean}
			 */
			function check(_event, _player) {
				const player = get.player();
				const source = get.event("source");
				const friendsCount = target.getFriends(true, false).length;

				if (game.players.length <= 2 * friendsCount) {
					return false;
				}
				// @ts-expect-error 祖宗之法就是这么写的
				if (source.getFriends(true).length + friendsCount > game.players.length / 2) {
					return true;
				}

				if (player.isDamaged() || player.countCards("h") < 4) {
					return false;
				}

				return true;
			}
		}

		for (const other of refused) {
			await other.drawTo(4, []);
			await other.recover();
		}
	}

	// @ts-expect-error 祖宗之法就是这么写的
	delete _status.showYexings;

	// 如果此时因为机缘巧合，所有玩家均属于一个阵营，则直接获胜
	for (const target of showYexingPlayers) {
		if (game.hasPlayer(current => !current.isFriendOf(target))) {
			continue;
		}

		broadcastAll(id => {
			// @ts-expect-error 祖宗之法就是这么写的
			game.winner_id = id;
		}, target.playerid);
		game.checkResult();
		break;
	}
}

/**
 * @param {GameEvent} event
 * @param {GameEvent} _trigger
 * @param {Player} player
 */
export const hideCharacter = async (event, _trigger, player) => {
	const { num } = event;

	// @ts-expect-error 类型就是这么写的
	game.addVideo("hideCharacter", player, num);

	const log = Reflect.get(event, "log");
	let skills;
	switch (num) {
		case 0:
			if (log !== false) {
				game.log(player, "暗置了主将" + get.translation(player.name1));
			}
			skills = lib.character[player.name1][3];
			player.name = player.name2;
			player.sex = lib.character[player.name2][0];
			player.classList.add("unseen");
			break;
		case 1:
			if (log !== false) {
				game.log(player, "暗置了副将" + get.translation(player.name2));
			}
			skills = lib.character[player.name2][3];
			player.classList.add("unseen2");
			break;
		// 为skills赋值，避免报错
		default:
			skills = [];
			break;
	}

	broadcast(
		(player, name, sex, num, skills) => {
			player.name = name;
			player.sex = sex;
			switch (num) {
				case 0:
					player.classList.add("unseen");
					break;
				case 1:
					player.classList.add("unseen2");
					break;
			}
			for (var i = 0; i < skills.length; i++) {
				if (!player.skills.includes(skills[i])) {
					continue;
				}
				player.hiddenSkills.add(skills[i]);
				player.skills.remove(skills[i]);
			}
		},
		player,
		player.name,
		player.sex,
		num,
		skills
	);

	for (let i = 0; i < skills.length; ++i) {
		if (!player.skills.includes(skills[i])) {
			continue;
		}

		player.hiddenSkills.add(skills[i]);

		const info = get.info(skills[i]);
		if (info.ondisable && info.onremove) {
			// @ts-expect-error 祖宗之法就是这么写的
			info.onremove(player);
		}

		player.skills.remove(skills[i]);
	}

	player.checkConflict();
}

/**
 * @param {GameEvent} event
 * @param {GameEvent} _trigger
 * @param {Player} player
 */
export const chooseJunlingFor = async (event, _trigger, player) => {
	const { num, target } = event;
	let prompt = Reflect.get(event, "prompt", event);

	let junlingNames = ["junling1", "junling2", "junling3", "junling4", "junling5", "junling6"];
	junlingNames = junlingNames.randomGets(event.num).sort();

	const junlings = junlingNames.map(name => ["军令", "", name]);

	if (target != undefined && !prompt) {
		// @ts-expect-error 类型就是这么写的
		const selfPrompt = target == player ? "（你）" : "";
		prompt = `选择一张军令牌，令${get.translation(target)}${selfPrompt}选择是否执行`;
	}

	const chooseResult = await player
		.chooseButton([prompt, [junlings, "vcard"]], true)
		.set("ai", button => {
			// @ts-expect-error 祖宗之法就是这么写的
			return get.junlingEffect(get.player(), button.link[2], get.event()?.getParent()?.target, [], get.player());
		})
		.forResultLinks();

	const result = {
		junling: chooseResult[0][2],
		unchosenJunling: junlingNames.filter(i => i != chooseResult[0][2]),
		/** @type {Player[]} */
		targets: [],
	};

	if (result.junling == "junling1") {
		/** @type {Player[]} */
		// @ts-expect-error 祖宗之法就是这么做的
		const targets = await player
			.chooseTarget("选择一名角色，做为若该军令被执行，受到伤害的角色", true)
			.set("ai", other => get.damageEffect(other, target, player))
			.forResultTargets();

		if (targets.length > 0) {
			player.line(targets, "green");
			result.targets = targets;
		}
	}

	Reflect.set(event, "result", result);
}

/**
 * @param {GameEvent} event
 * @param {GameEvent} _trigger
 * @param {Player} player
 */
export const chooseJunlingControl = async (event, _trigger, player) => {
	const dialog = [];
	// @ts-expect-error 类型就是这么写的
	const str1 = event.source == player ? "（你）" : "";
	const str2 = event.targets ? `（被指定的角色为${get.translation(event.targets)}）` : "";

	const prompt = Reflect.get(event, "prompt");
	if (prompt) {
		dialog.add(prompt);
	}
	dialog.add(`${get.translation(event.source)}${str1}选择的军令${str2}为`);
	dialog.add([[Reflect.get(event, "junling")], "vcard"]);

	let controls = [];

	const choiceList = Reflect.get(event, "choiceList");
	if (choiceList) {
		for (let i = 0; i < choiceList.length; i++) {
			dialog.add('<div class="popup text" style="width:calc(100% - 10px);display:inline-block">选项' + get.cnNumber(i + 1, true) + "：" + choiceList[i] + "</div>");
			controls.push("选项" + get.cnNumber(i + 1, true));
		}
	} else if (Reflect.has(event, "controls")) {
		controls = Reflect.get(event, "controls");
	} else {
		controls = ["执行该军令", "不执行该军令"];
	}

	if (!event.ai) {
		event.ai = () => {
			return Math.floor(controls.length * Math.random());
		};
	}

	const result = await player.chooseControl(controls).set("dialog", dialog).set("ai", event.ai).forResult();
	const result2 = {
		index: result.index,
		control: result.control,
	};
	Reflect.set(event, "result", result2);
}

/**
 * @param {GameEvent & { junling: string }} event
 * @param {GameEvent} _trigger
 * @param {Player} player
 */
export const carryOutJunling = async (event, _trigger, player) => {
	const { source, targets } = event;

	switch (event.junling) {
		case "junling1": {
			if (targets[0].isAlive()) {
				player.line(targets, "green");
				await targets[0].damage(player);
			}
			break;
		}
		case "junling2":
			await player.draw();

			// @ts-expect-error 类型就是这么写的
			if (source == player) {
				break;
			}

			for (let i = 0; i < 2 && player.countCards("he") > 0; i++) {
				const { result } = await player.chooseCard("交给" + get.translation(source) + "第" + get.cnNumber(i + 1) + "张牌（共两张）", "he", true);
				if (result.cards?.length) {
					await player.give(result.cards, source);
				}
			}

			break;
		case "junling3":
			await player.loseHp();
			break;
		case "junling4":
			player.addTempSkill("junling4_eff");
			player.addTempSkill("fengyin_vice");
			player.addTempSkill("fengyin_main");
			break;
		case "junling5":
			await player.turnOver();
			player.addTempSkill("junling5_eff");
			break;
		case "junling6": {
			let position = "";
			let num0 = 0;
			if (player.countCards("h")) {
				position += "h";
				num0++;
			}
			if (player.countCards("e")) {
				position += "e";
				num0++;
			}
			const { result } = await player
				.chooseCard(
					"选择一张手牌和一张装备区内牌（若有），然后弃置其余的牌",
					position,
					num0,
					card => {
						if (ui.selected.cards.length) {
							return get.position(card) != get.position(ui.selected.cards[0]);
						}
						return true;
					},
					true
				)
				.set("complexCard", true)
				.set("ai", function (card) {
					return get.value(card);
				});

			if (!result.bool || !result.cards?.length) {
				return;
			}

			const cards = player.getCards("he");
			for (const card of result.cards) {
				cards.remove(card);
			}
			player.discard(cards);
		}
	}
}

/**
 * @param {GameEvent} _event
 * @param {GameEvent} _trigger
 * @param {Player} player
 */
export const doubleDraw = async (_event, _trigger, player) => {
	if (!player.hasMark("yinyang_mark")) {
		player.addMark("yinyang_mark", 1);
	}
}

/**
 * @param {GameEvent & { hidden: boolean }} event
 * @param {GameEvent} _trigger
 * @param {Player} player
 */
export const changeViceOnline = async (event, _trigger, player) => {
	await player.showCharacter(2);
	const group = lib.character[player.name1].group;
	const characterlist = Reflect.get(_status, "characterlist");
	characterlist?.randomSort();
	let name;
	for (let i = 0; i < characterlist.length; i++) {
		let goon = false;
		const group2 = lib.character[characterlist[i]].group;
		if (game.hasPlayer2(current => get.nameList(current).includes(characterlist[i]))) {
			continue;
		}
		if (group == "ye") {
			if (group2 != "ye") {
				goon = true;
			}
		} else {
			if (group == group2) {
				goon = true;
			} else {
				const double = get.is.double(characterlist[i], ["true"]);
				if (double && (typeof double == "boolean" || double.includes(group))) {
					goon = true;
				}
			}
		}
		if (goon) {
			name = characterlist[i];
			break;
		}
	}
	if (!name) {
		return;
	}
	characterlist.remove(name);

	let change = false;
	if (player.hasViceCharacter()) {
		change = true;
		characterlist.add(player.name2);
	}

	if (change) {
		event.trigger("removeCharacterBefore");
	}

	if (event.hidden) {
		game.log(player, "替换了副将", "#g" + get.translation(player.name2));
	} else {
		game.log(player, "将副将从", "#g" + get.translation(player.name2), "变更为", "#g" + get.translation(name));
	}
	// @ts-expect-error 类型就是这么写的
	player.viceChanged = true;
	await player.reinitCharacter(player.name2, name, false);
	if (event.hidden) {
		if (!player.isUnseen(1)) {
			await player.hideCharacter(1, false);
		}
	}
}

export const changeVice = [
	async (event, _trigger, player) => {
		player.showCharacter(2);
		if (!event.num) {
			event.num = 3;
		}
		var group = player.identity;
		if (!lib.group.includes(group)) {
			group = lib.character[player.name1][1];
		}
		// @ts-expect-error 类型就是这么写的
		_status.characterlist.randomSort();
		event.tochange = [];
		// @ts-expect-error 类型就是这么写的
		for (var i = 0; i < _status.characterlist.length; i++) {
			// @ts-expect-error 类型就是这么写的
			if (_status.characterlist[i].indexOf("gz_jun_") == 0) {
				continue;
			}
			// @ts-expect-error 类型就是这么写的
			if (game.hasPlayer2(current => get.nameList(current).includes(_status.characterlist[i]))) {
				continue;
			}
			var goon = false,
				// @ts-expect-error 类型就是这么写的
				group2 = lib.character[_status.characterlist[i]][1];
			if (group == "ye") {
				if (group2 != "ye") {
					goon = true;
				}
			} else {
				if (group == group2) {
					goon = true;
				} else {
					// @ts-expect-error 类型就是这么写的
					var double = get.is.double(_status.characterlist[i], true);
					// @ts-expect-error 类型就是这么写的
					if (double && double.includes(group)) {
						goon = true;
					}
				}
			}
			if (goon) {
				// @ts-expect-error 类型就是这么写的
				event.tochange.push(_status.characterlist[i]);
				if (event.tochange.length == event.num) {
					break;
				}
			}
		}
		if (!event.tochange.length) {
			event.finish();
		} else {
			if (event.tochange.length == 1) {
				event._result = {
					bool: true,
					links: event.tochange,
				};
			} else {
				player.chooseButton(true, ["选择要变更的武将牌", [event.tochange, "character"]]).ai = function (button) {
					// @ts-expect-error 类型就是这么写的
					return get.guozhanRank(button.link);
				};
			}
		}
	},
	async (event, _trigger, player, result) => {
		var name = result.links[0];
		// @ts-expect-error 类型就是这么写的
		_status.characterlist.remove(name);
		if (player.hasViceCharacter()) {
			event.change = true;
			// @ts-expect-error 类型就是这么写的
			_status.characterlist.add(player.name2);
		}
		event.toRemove = player.name2;
		event.toChange = name;
		if (event.change) {
			event.trigger("removeCharacterBefore");
		}
	},
	async (event, _trigger, player) => {
		var name = event.toChange;
		if (event.hidden) {
			game.log(player, "替换了副将", "#g" + get.translation(player.name2));
		} else {
			game.log(player, "将副将从", "#g" + get.translation(player.name2), "变更为", "#g" + get.translation(name));
		}
		player.viceChanged = true;
		player.reinitCharacter(player.name2, name, false);
		if (event.hidden) {
			if (!player.isUnseen(1)) {
				player.hideCharacter(1, false);
			}
		}
	},
];

/**
 * @param {GameEvent} event
 * @param {GameEvent} _trigger
 * @param {Player} player
 */
export const mayChangeVice = async (event, _trigger, player) => {
	const result = await player
		.chooseBool("是否变更副将？")
		.set("ai", function () {
			const player = get.player();
			// @ts-expect-error 祖宗之法就是这么写的
			return get.guozhanRank(player.name2, player) <= 3;
		})
		.forResult();
	if (result.bool) {
		// @ts-expect-error 祖宗之法就是这么做的
		if (!event.repeat) {
			// @ts-expect-error 祖宗之法就是这么做的
			if (!_status.changedSkills[player.playerid]) {
				_status.changedSkills[player.playerid] = [];
			}
			// @ts-expect-error 祖宗之法就是这么做的
			_status.changedSkills[player.playerid].add(event.skill);
		}
		// @ts-expect-error 祖宗之法就是这么做的
		await player.changeVice(event.hidden);
	}
}

/**
 *
 * @param {GameEvent} _event
 * @param {GameEvent} _trigger
 * @param {Player} player
 */
export const zhulian = async (_event, _trigger, player) => {
	player.popup("珠联璧合");
	if (!player.hasMark("zhulianbihe_mark")) {
		player.addMark("zhulianbihe_mark", 1);
	}
}

export default {
	hideCharacter,
	chooseJunlingFor,
	chooseJunlingControl,
	carryOutJunling,
	doubleDraw,
	changeViceOnline,
	changeVice,
	mayChangeVice,
	zhulian,
};
