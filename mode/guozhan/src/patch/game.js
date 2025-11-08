import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
import { GameEvent, Dialog, Player } from "../../../../noname/library/element/index.js";
import { Game } from "../../../../noname/game/index.js";
import { showYexingsContent, chooseCharacterContent, chooseCharacterOLContent } from "./content.js";

export class GameGuozhan extends Game {
	/**
	 * 不确定是干啥的，反正恒返回真
	 *
	 * @returns {boolean}
	 */
	canReplaceViewpoint() {
		return true;
	}

	/**
	 * 当野心家未明置主将，且场上只剩副将所属阵容时，野心家可明置主将，并进行”拉拢人心“
	 *
	 * 详情请参阅规则集
	 *
	 * @returns {GameEvent}
	 */
	showYexings() {
		const next = game.createEvent("showYexings", false);

		// 如果已存在展示野心的野心家，则不做处理
		// @ts-expect-error 祖宗之法就是这么写的
		if (_status.showYexings) {
			next.setContent(async () => {
				return;
			});

			return next;
		}

		// @ts-expect-error 祖宗之法就是这么写的
		_status.showYexings = true;
		next.setContent(showYexingsContent);

		return next;
	}

	/**
	 * 获取武将选择
	 *
	 * @author Spmario233
	 * @param {string[]} list - 所有武将的数组
	 * @param {number} num - 选择武将的数量
	 * @returns {string[]} - 最终武将的数组
	 */
	getCharacterChoice(list, num) {
		const choice = list.splice(0, num).sort(function (a, b) {
			return (get.is.double(a) ? 1 : -1) - (get.is.double(b) ? 1 : -1);
		});
		const map = { wei: [], shu: [], wu: [], qun: [], key: [], jin: [], ye: [] };
		for (let i = 0; i < choice.length; ++i) {
			if (get.is.double(choice[i])) {
				// @ts-expect-error 祖宗之法就是这么写的
				var group = get.is.double(choice[i], true);
				// @ts-expect-error 祖宗之法就是这么写的
				for (var ii of group) {
					if (map[ii] && map[ii].length) {
						map[ii].push(choice[i]);
						lib.character[choice[i]][1] = ii;
						group = false;
						break;
					}
				}
				if (group) {
					choice.splice(i--, 1);
				}
			} else {
				// @ts-expect-error 祖宗之法就是这么写的
				var group = lib.character[choice[i]][1];
				if (map[group]) {
					map[group].push(choice[i]);
				}
			}
		}
		if (map.ye.length) {
			for (const i in map) {
				if (i != "ye" && map[i].length) {
					return choice.randomSort();
				}
			}
			choice.remove(map.ye[0]);
			map.ye.remove(map.ye[0]);
			for (var i = 0; i < list.length; i++) {
				if (lib.character[list[i]][1] != "ye") {
					choice.push(list[i]);
					list.splice(i--, 1);
					return choice.randomSort();
				}
			}
		}
		for (const i in map) {
			if (map[i].length < 2) {
				if (map[i].length == 1) {
					choice.remove(map[i][0]);
					list.push(map[i][0]);
				}
				map[i] = false;
			}
		}
		if (choice.length == num - 1) {
			for (let i = 0; i < list.length; ++i) {
				if (map[lib.character[list[i]][1]]) {
					choice.push(list[i]);
					list.splice(i--, 1);
					break;
				}
			}
		} else if (choice.length < num - 1) {
			let group = null;
			for (let i = 0; i < list.length; ++i) {
				if (group) {
					if (lib.character[list[i]][1] == group || lib.character[list[i]][1] == "ye") {
						choice.push(list[i]);
						list.splice(i--, 1);
						if (choice.length >= num) {
							break;
						}
					}
				} else {
					if (!map[lib.character[list[i]][1]] && !get.is.double(list[i])) {
						group = lib.character[list[i]][1];
						if (group == "ye") {
							group = null;
						}
						choice.push(list[i]);
						list.splice(i--, 1);
						if (choice.length >= num) {
							break;
						}
					}
				}
			}
		}
		return choice.randomSort();
	}

	/**
	 * 联机时获取当前玩家的信息
	 *
	 * @returns {Record<string, { identity: string, shown?: number }>} - 玩家信息的对象
	 */
	getState() {
		/** @type {Record<string, { identity: string, shown?: number }>} */
		const state = {};
		for (const playerId in lib.playerOL) {
			var player = lib.playerOL[playerId];
			state[playerId] = {
				identity: player.identity,
				//group:player.group,
				shown: player.ai.shown,
			};
		}
		return state;
	}

	/**
	 * 联机时更新玩家信息
	 *
	 * @param {Record<string, { identity: string, shown?: number }>} state - 玩家信息的对象
	 */
	updateState(state) {
		for (const playerId in state) {
			const player = lib.playerOL[playerId];
			if (player) {
				player.identity = state[playerId].identity;
				//player.group=state[i].group;
				player.ai.shown = state[playerId].shown;
			}
		}
	}

	/**
	 * 联机时获取当前房间的信息
	 *
	 * @param {Dialog} uiintro
	 */
	getRoomInfo(uiintro) {
		var num, last;
		if (lib.configOL.initshow_draw == "off") {
			num = "关闭";
		} else {
			num = { mark: "标记", draw: "摸牌" }[lib.configOL.initshow_draw];
		}
		uiintro.add('<div class="text chat">群雄割据：' + (lib.configOL.separatism ? "开启" : "关闭"));
		uiintro.add('<div class="text chat">首亮奖励：' + num);
		uiintro.add('<div class="text chat">珠联璧合：' + (lib.configOL.zhulian ? "开启" : "关闭"));
		uiintro.add('<div class="text chat">出牌时限：' + lib.configOL.choose_timeout + "秒");
		uiintro.add('<div class="text chat">国战牌堆：' + (lib.configOL.guozhanpile ? "开启" : "关闭"));
		uiintro.add('<div class="text chat">鏖战模式：' + (lib.configOL.aozhan ? "开启" : "关闭"));
		last = uiintro.add('<div class="text chat">观看下家副将：' + (lib.configOL.viewnext ? "开启" : "关闭"));

		// @ts-expect-error 祖宗之法就是这么写的
		last.style.paddingBottom = "8px";
	}

	/**
	 * 为当前对局增加战绩记录
	 *
	 * @param {Boolean} bool - 当前对局是否胜利
	 */
	async addRecord(bool) {
		if (typeof bool !== "boolean") {
			return;
		}

		const data = lib.config.gameRecord.guozhan.data;

		const identity = game.me.identity;
		if (!data[identity]) {
			data[identity] = [0, 0];
		}

		if (bool) {
			++data[identity][0];
		} else {
			++data[identity][1];
		}

		/// 构建战绩记录字符串
		let group = [...lib.group, "ye"];
		// 过滤神和外服势力，以及没有战绩的势力
		group = group.filter(group => group !== "shen" && group !== "western" && data[group]);
		// 将战绩记录转换为字符串
		const strs = group.map(id => {
			const name = get.translation(`${id}2`);
			const [win, lose] = data[id];

			return `${name}: ${win}胜 ${lose}负`;
		});
		const str = strs.join("<br />");

		lib.config.gameRecord.guozhan.str = `${str}<br />`;

		await game.promises.saveConfig("gameRecord", lib.config.gameRecord);
	}

	/**
	 * 获取某名玩家可能的势力列表
	 *
	 * @param {Player} player - 玩家
	 * @returns {Record<string, string>} - 势力及其对应的名称
	 */
	getIdentityList(player) {
		// @ts-expect-error 祖宗之法就是这么写的
		if (!player.isUnseen()) {
			return;
		}
		// @ts-expect-error 祖宗之法就是这么写的
		if (player === game.me) {
			return;
		}

		let list = {
			wei: "魏",
			shu: "蜀",
			wu: "吴",
			qun: "群",
			jin: "晋",
			ye: "野",
			unknown: "猜",
		};
		const maxPlayer = (_status.separatism ? Math.max(get.population() / 2 - 1, 1) : get.population() / 2);
		for ( let group of ["wei", "shu", "wu", "qun", "jin"]) {
			if (group == _status.bannedGroup?.slice(6) || get.population(group) >= maxPlayer && !game.hasPlayer(current => {
				return get.is.jun(current) && current.identity == group;
			})) {
				// @ts-expect-error 祖宗之法就是这么写的
				delete list[group];
			}
		}
		return list;
	}

	/**
	 * @param {string[]} list
	 */
	getIdentityList2(list) {
		for (var i in list) {
			switch (i) {
				case "unknown":
					list[i] = "未知";
					break;
				case "ye":
					list[i] = "野心家";
					break;
				case "qun":
					list[i] += "雄";
					break;
				case "key":
					list[i] = "Key";
					break;
				case "jin":
					list[i] += "朝";
					break;
				default:
					list[i] += "国";
			}
		}
	}

	/**
	 * 获取当前对局对应录像的名称
	 *
	 * @returns {[name: string, situation: string]}
	 */
	getVideoName() {
		var str = get.translation(game.me.name1) + "/" + get.translation(game.me.name2);
		// @ts-expect-error 祖宗之法就是这么写的
		var str2 = _status.separatism
			? get.modetrans({
					mode: lib.config.mode,
					separatism: true,
				})
			: get.cnNumber(parseInt(get.config("player_number"))) + "人" + get.translation(lib.config.mode);
		if (game.me.identity == "ye") {
			str2 += " - 野心家";
		}
		return [str, str2];
	}

	/**
	 * 显示所有玩家的身份
	 *
	 * @param {boolean} started
	 */
	showIdentity(started) {
		if (game.phaseNumber == 0 && !started) {
			return;
		}
		for (var i = 0; i < game.players.length; i++) {
			game.players[i].showCharacter(2, false);
		}
	}

	/**
	 * > ?
	 */
	tryResult() {
		var map = {},
			sides = [],
			pmap = _status.connectMode ? lib.playerOL : game.playerMap,
			hiddens = [];
		for (var i of game.players) {
			if (i.identity == "unknown") {
				hiddens.push(i);
				continue;
			}
			var added = false;
			for (var j of sides) {
				// @ts-expect-error 祖宗之法就是这么写的
				if (i.isFriendOf(pmap[j])) {
					added = true;
					map[j].push(i);
					break;
				}
			}
			if (!added) {
				map[i.playerid] = [i];
				sides.push(i.playerid);
			}
		}
		if (!sides.length) {
			return;
		} else if (sides.length > 1) {
			if (!hiddens.length && sides.length == 2) {
				if (
					map[sides[0]].length == 1 &&
					!map[sides[1]].filter(function (i) {
						return i.identity != "ye" && i.isUnseen(0);
					}).length
				) {
					map[sides[0]][0].showGiveup();
				}
				if (
					map[sides[1]].length == 1 &&
					!map[sides[0]].filter(function (i) {
						return i.identity != "ye" && i.isUnseen(0);
					}).length
				) {
					map[sides[1]][0].showGiveup();
				}
			}
		} else {
			var isYe = function (player) {
				return player.identity != "ye" && lib.character[player.name1][1] == "ye";
			};
			if (!hiddens.length) {
				if (map[sides[0]].length > 1) {
					// @ts-expect-error 祖宗之法就是这么写的
					for (var i of map[sides[0]]) {
						if (isYe(i)) {
							// @ts-expect-error 祖宗之法就是这么写的
							game.showYexings();
							return;
						}
					}
				}
				broadcastAll(function (id) {
					// @ts-expect-error 祖宗之法就是这么写的
					game.winner_id = id;
				}, sides[0]);
				// @ts-expect-error 祖宗之法就是这么写的
				game.checkResult();
			} else {
				var identity = map[sides[0]][0].identity;
				if (identity == "ye") {
					return;
				}
				// @ts-expect-error 祖宗之法就是这么写的
				for (var i of map[sides[0]]) {
					if (isYe(i)) {
						return;
					}
				}
				for (var ind = 0; ind < hiddens.length; ind++) {
					var current = hiddens[ind];
					// @ts-expect-error 祖宗之法就是这么写的
					if (isYe(current) || current.getGuozhanGroup(2) != identity || !current.wontYe(null, ind + 1)) {
						return;
					}
				}
				broadcastAll(function (id) {
					// @ts-expect-error 祖宗之法就是这么写的
					game.winner_id = id;
				}, sides[0]);
				// @ts-expect-error 祖宗之法就是这么写的
				game.checkResult();
			}
		}
	}

	/**
	 * 检查游戏结果
	 */
	checkResult() {
		// @ts-expect-error 祖宗之法就是这么写的
		_status.overing = true;
		// @ts-expect-error 祖宗之法就是这么写的
		var me = game.me._trueMe || game.me;
		for (var i = 0; i < game.players.length; i++) {
			game.players[i].showCharacter(2);
		}
		// @ts-expect-error 祖宗之法就是这么写的
		var winner = (_status.connectMode ? lib.playerOL : game.playerMap)[game.winner_id];
		game.over(winner && winner.isFriendOf(me) ? true : false);
		// @ts-expect-error 祖宗之法就是这么写的
		game.showIdentity();
	}

	/**
	 * > ?
	 * @param {Player} player
	 * @returns {boolean}
	 */
	checkOnlineResult(player) {
		// @ts-expect-error 祖宗之法就是这么写的
		var winner = lib.playerOL[game.winner_id];
		return winner && winner.isFriendOf(game.me);
	}

	chooseCharacter() {
		const next = game.createEvent("chooseCharacter");

		next.set("showConfig", true);
		next.set("addPlayer", true);
		next.set("ai", check);
		next.setContent(chooseCharacterContent);

		return next;

		/**
		 * @param {Player} player
		 * @param {string[]} list
		 * @param {string[]} [back]
		 * @returns
		 */
		function check(player, list, back) {
			if (_status.brawl && _status.brawl.chooseCharacterAi) {
				if (_status.brawl.chooseCharacterAi(player, list, back) !== false) {
					return;
				}
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
					return doublex.includes(group2) || lib.selectGroup.includes(group2);
				} else {
					if (group1 == "ye" || lib.selectGroup.includes(group1)) {
						return group2 != "ye";
					}
					// @ts-expect-error 祖宗之法就是这么写的
					var double = get.is.double(name2, true);
					// @ts-expect-error 祖宗之法就是这么写的
					if (double) {
						return double.includes(group1);
					}
					return group1 == group2 || lib.selectGroup.includes(group2);
				}
			};
			for (var i = 0; i < list.length - 1; i++) {
				for (var j = i + 1; j < list.length; j++) {
					if (filterChoice(list[i], list[j]) || filterChoice(list[j], list[i])) {
						var mainx = list[i];
						var vicex = list[j];
						// @ts-expect-error 祖宗之法就是这么写的
						if (!filterChoice(mainx, vicex) || (filterChoice(vicex, mainx) && get.guozhanReverse(mainx, vicex))) {
							mainx = list[j];
							vicex = list[i];
						}
						player.init(mainx, vicex, false);
						const selectGroup = ["ye", ...lib.selectGroup];
						// @ts-expect-error 祖宗之法就是这么写的
						if (get.is.double(mainx, true)) {
							// @ts-expect-error 祖宗之法就是这么写的
							if (selectGroup.includes(lib.character[vicex][1])) {
								// @ts-expect-error 祖宗之法就是这么写的
								player.trueIdentity = get.is.double(mainx, true).randomGet();
							} else if (!get.is.double(vicex, true)) {
								player.trueIdentity = lib.character[vicex][1];
							}
							// @ts-expect-error 祖宗之法就是这么写的
							else if (get.is.double(mainx, true).removeArray(get.is.double(vicex, true)).length == 0 || get.is.double(vicex, true).removeArray(get.is.double(mainx, true)).length == 0) {
								// @ts-expect-error 祖宗之法就是这么写的
								player.trueIdentity = get.is
									// @ts-expect-error 祖宗之法就是这么写的
									.double(vicex, true)
									// @ts-expect-error 祖宗之法就是这么写的
									.filter(group => get.is.double(mainx, true).includes(group))
									.randomGet();
							}
							// @ts-expect-error 祖宗之法就是这么写的
							else {
								player.trueIdentity = get.is.double(mainx, true).find(group => get.is.double(vicex, true).includes(group));
							}
							// @ts-expect-error 祖宗之法就是这么写的
						} else if (selectGroup.includes(lib.character[mainx][1]) && get.is.double(vicex, true)) {
							player.trueIdentity = get.is.double(vicex, true).randomGet();
						}
						if (back) {
							list.remove(player.name1);
							list.remove(player.name2);
							for (var i = 0; i < list.length; i++) {
								back.push(list[i]);
							}
						}
						return;
					}
				}
			}
		}
	}

	chooseCharacterOL() {
		var next = game.createEvent("chooseCharacter");
		next.setContent(chooseCharacterOLContent);
		return next;
	}

	/**
	 * 类型兼容版本
	 *
	 * @param {string} type
	 * @param {Player?} player
	 * @param {any} [content]
	 * @returns
	 */
	// @ts-expect-error 祖宗之法就是这么写的
	addVideo(type, player, content) {
		// @ts-expect-error 祖宗之法就是这么写的
		return super.addVideo(type, player, content);
	}
}

/**
 * `Game#broadcast`的类型兼容版本
 *
 * 未来或许会移动到别的地方，但目前先直接放国战里
 *
 * @template {(...args: any[]) => unknown} T
 * @param {T} func
 * @param {Parameters<T>} args
 */
export function broadcast(func, ...args) {
	// @ts-expect-error 类型就是这么写的
	return game.broadcast(func, ...args);
}

/**
 * `Game#broadcastAll`的类型兼容版本
 *
 * 未来或许会移动到别的地方，但目前先直接放国战里
 *
 * @template {(...args: any[]) => unknown} T
 * @param {T} func
 * @param {Parameters<T>} args
 */
export function broadcastAll(func, ...args) {
	// @ts-expect-error 类型就是这么写的
	return game.broadcastAll(func, ...args);
}
