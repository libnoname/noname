import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCardConfig['skill'] } */
const skill = {
	gw_aerdeyin: {
		trigger: { global: "roundStart" },
		silent: true,
		mark: true,
		intro: {
			content: "新的一轮开始时，若武将牌正面朝上，则在当前回合结束后进行一个额外回合，否则将武将牌翻回正面",
		},
		content() {
			if (player.isTurnedOver()) {
				player.turnOver();
				player.removeSkill("gw_aerdeyin");
				player.logSkill("gw_aerdeyin");
			} else {
				player.insertPhase();
			}
		},
		group: "gw_aerdeyin_phase",
		subSkill: {
			phase: {
				trigger: { player: "phaseBefore" },
				silent: true,
				filter(event, player) {
					return event.skill === "gw_aerdeyin";
				},
				content() {
					player.removeSkill("gw_aerdeyin");
					player.logSkill("gw_aerdeyin");
				},
			},
		},
	},
	gw_kunenfayin: {
		mark: true,
		nopop: true,
		intro: {
			content: "防止所有非属性伤害（剩余个#角色的回合）",
		},
		init(player) {
			player.storage.gw_kunenfayin = Math.min(5, game.countPlayer());
		},
		trigger: { player: "damageBefore" },
		filter(event) {
			return !event.nature;
		},
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			nodamage: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && !get.tag(card, "natureDamage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
		subSkill: {
			count: {
				trigger: { global: "phaseEnd" },
				silent: true,
				content() {
					player.storage.gw_kunenfayin--;
					if (player.storage.gw_kunenfayin > 0) {
						player.updateMarks();
					} else {
						player.removeSkill("gw_kunenfayin");
					}
				},
			},
		},
		group: "gw_kunenfayin_count",
		onremove: true,
	},
	gw_baobaoshu: {
		mark: true,
		nopop: true,
		intro: {
			content: "每使用一张基本牌或锦囊牌，需弃置一张牌",
		},
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			if (player.countCards("he") === 0) {
				return false;
			}
			var type = get.type(event.card, "trick");
			return type === "basic" || type === "trick";
		},
		content() {
			if (!event.isMine()) {
				game.delay(0.5);
			}
			player.chooseToDiscard(true, "he");
		},
		ai: {
			weather: true,
			effect: {
				player_use(card, player) {
					return [
						1,
						player.needsToDiscard(0, (i, p) => {
							if (p.canIgnoreHandcard(i)) {
								return false;
							}
							if (i === card || (card.cards && card.cards.includes(i))) {
								return false;
							}
							return true;
						})
							? -0.4
							: -1,
					];
				},
			},
		},
	},
	gw_nuhaifengbao: {
		mark: true,
		intro: {
			content: "结束阶段随机弃置一张牌（剩余#回合）",
		},
		init(player) {
			player.storage.gw_nuhaifengbao = 2;
		},
		trigger: { player: "phaseEnd" },
		forced: true,
		nopop: true,
		content() {
			player.randomDiscard();
			player.storage.gw_nuhaifengbao--;
			if (player.storage.gw_nuhaifengbao > 0) {
				player.updateMarks();
			} else {
				player.removeSkill("gw_nuhaifengbao");
			}
		},
		onremove: true,
		ai: {
			neg: true,
			weather: true,
		},
	},
	gw_youer: {
		trigger: { global: "phaseEnd", player: "dieBegin" },
		forced: true,
		audio: false,
		mark: true,
		intro: {
			content: "cards",
		},
		content() {
			if (player.storage.gw_youer) {
				if (trigger.name === "phase") {
					player.gain(player.storage.gw_youer);
				} else {
					player.$throw(player.storage.gw_youer, 1000);
					for (var i = 0; i < player.storage.gw_youer.length; i++) {
						player.storage.gw_youer[i].discard();
					}
					game.log(player, "弃置了", player.storage.gw_youer);
				}
			}
			delete player.storage.gw_youer;
			player.removeSkill("gw_youer");
		},
	},
	gw_qinpendayu: {
		mark: true,
		nopop: true,
		intro: {
			content: "手牌上限-1直到下一个弃牌阶段结束",
		},
		mod: {
			maxHandcard(player, num) {
				return num - 1;
			},
		},
		ai: {
			weather: true,
		},
		group: "gw_qinpendayu_clear",
		subSkill: {
			clear: {
				trigger: { player: "phaseDiscardAfter" },
				silent: true,
				content() {
					player.removeSkill("gw_qinpendayu");
				},
			},
		},
	},
	gw_birinongwu: {
		mark: true,
		nopop: true,
		intro: {
			content: "不能使用杀直到下一个出牌阶段结束",
		},
		mod: {
			cardEnabled(card) {
				if (card.name === "sha") {
					return false;
				}
			},
		},
		ai: {
			weather: true,
		},
		group: "gw_birinongwu_clear",
		subSkill: {
			clear: {
				trigger: { player: "phaseUseAfter" },
				silent: true,
				content() {
					player.removeSkill("gw_birinongwu");
				},
			},
		},
	},
	gw_ciguhanshuang: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		mark: true,
		nopop: true,
		intro: {
			content: "下个摸牌阶段摸牌数-1",
		},
		filter(event) {
			return event.num > 0;
		},
		content() {
			trigger.num--;
			player.removeSkill("gw_ciguhanshuang");
		},
		ai: {
			weather: true,
		},
	},
	gw_dieyi: {
		init(player) {
			player.storage.gw_dieyi = 1;
		},
		onremove: true,
		trigger: { global: "phaseEnd" },
		forced: true,
		mark: true,
		nopop: true,
		process(player) {
			if (player.hasSkill("gw_dieyi")) {
				player.storage.gw_dieyi++;
			} else {
				player.addSkill("gw_dieyi");
			}
			player.syncStorage("gw_dieyi");
			player.updateMarks();
		},
		intro: {
			content: "在当前回合的结束阶段，你随机弃置#张牌",
		},
		content() {
			player.randomDiscard(player.storage.gw_dieyi);
			player.removeSkill("gw_dieyi");
		},
	},
	gw_leizhoushu: {
		mark: true,
		intro: {
			content(storage, player) {
				if (storage >= 2) {
					return "锁定技，准备阶段，你令手牌数为全场最多的所有其他角色各随机弃置一张手牌，若目标不包含敌方角色，将一名随机敌方角色追加为额外目标（重复" + storage + "次）";
				} else {
					return "锁定技，准备阶段，你令手牌数为全场最多的所有其他角色各随机弃置一张手牌，若目标不包含敌方角色，将一名随机敌方角色追加为额外目标";
				}
			},
		},
		nopop: true,
		trigger: { player: "phaseBegin" },
		forced: true,
		filter(event, player) {
			var list = game.filterPlayer();
			for (var i = 0; i < list.length; i++) {
				if (list[i] !== player && list[i].isMaxHandcard()) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			if (typeof player.storage.gw_leizhoushu === "number") {
				event.num = player.storage.gw_leizhoushu;
			} else {
				event.num = 1;
			}
			"step 1";
			if (event.num) {
				var max = 0;
				var maxp = null;
				var list = game
					.filterPlayer(function (current) {
						return current.isMaxHandcard();
					})
					.sortBySeat();
				var enemies = player.getEnemies();
				for (var i = 0; i < enemies.length; i++) {
					if (list.includes(enemies[i])) {
						break;
					}
				}
				if (i === enemies.length) {
					list.push(enemies.randomGet());
				}
				list.remove(player);
				if (!list.length) {
					event.finish();
					return;
				}
				player.line(list, "green");
				for (var i = 0; i < list.length; i++) {
					list[i].randomDiscard("h", false);
				}
			} else {
				event.finish();
			}
			"step 2";
			event.num--;
			event.goto(1);
			game.delay();
		},
	},
	_gainspell: {
		trigger: { player: "drawBegin" },
		silent: true,
		priority: -11,
		filter(event, player) {
			if (_status.connectMode) {
				return false;
			}
			if (player.isMin()) {
				return false;
			}
			if (game.fixedPile) {
				return false;
			}
			return event.num > 0 && event.parent.name === "phaseDraw";
		},
		content() {
			if (!player.storage.spell_gain || Math.max.apply(null, player.storage.spell_gain) < 0) {
				var tmp = player.storage.spell_gain2;
				player.storage.spell_gain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].randomGets(3);
				player.storage.spell_gain2 = Math.floor((15 - Math.max.apply(null, player.storage.spell_gain)) / 2);
				if (tmp) {
					for (var i = 0; i < 3; i++) {
						player.storage.spell_gain[i] += tmp;
					}
				}
			}
			for (var i = 0; i < 3; i++) {
				if (player.storage.spell_gain[i] === 0) {
					var list;
					if (i === 0) {
						list = get.libCard(function (info) {
							return info.subtype === "spell_gold";
						});
						if (get.mode() === "stone") {
							list.remove("gw_aerdeyin");
							list.remove("gw_niuquzhijing");
						}
					} else {
						list = get.libCard(function (info) {
							return info.subtype === "spell_silver";
						});
						if (get.mode() === "stone") {
							list.remove("gw_butianshu");
						}
					}
					if (list && list.length) {
						ui.cardPile.insertBefore(game.createCard(list.randomGet()), ui.cardPile.firstChild);
					}
				}
				player.storage.spell_gain[i]--;
			}
		},
	},
};

export default skill;
