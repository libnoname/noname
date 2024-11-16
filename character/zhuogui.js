import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("character", function () {
	return {
		name: "zhuogui",
		character: {
			nianshou: ["male", "shu", 4, ["nianrui", "qixiang"]],
			mamian: ["male", "qun", 4, ["lianyu", "guiji"]],
			niutou: ["male", "shu", 4, ["manjia", "xiaoshou"]],
			baiwuchang: ["male", "qun", 3, ["qiangzheng", "moukui"]],
			heiwuchang: ["male", "qun", 3, ["suoling", "xixing"]],
		},
		skill: {
			qixiang: {
				group: ["qixiang1", "qixiang2"],
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (card.name == "lebu" || card.name == "bingliang") return 0.8;
						},
					},
				},
			},
			qixiang1: {
				trigger: { player: "judge" },
				forced: true,
				filter: function (event, player) {
					if (event.card) {
						if (event.card.viewAs) {
							return event.card.viewAs == "lebu";
						} else {
							return event.card.name == "lebu";
						}
					}
				},
				content: function () {
					player.addTempSkill("qixiang3", "phaseJudgeAfter");
				},
			},
			qixiang2: {
				trigger: { player: "judge" },
				forced: true,
				filter: function (event, player) {
					if (event.card) {
						if (event.card.viewAs) {
							return event.card.viewAs == "bingliang";
						} else {
							return event.card.name == "bingliang";
						}
					}
				},
				content: function () {
					player.addTempSkill("qixiang4", "phaseJudgeAfter");
				},
			},
			qixiang3: {
				mod: {
					suit: function (card, suit) {
						if (suit == "diamond") return "heart";
					},
				},
			},
			qixiang4: {
				mod: {
					suit: function (card, suit) {
						if (suit == "spade") return "club";
					},
				},
			},
			nianrui: {
				trigger: { player: ["phaseBegin", "phaseEnd"] },
				content: function () {
					"step 0";
					player.judge(function (card) {
						return get.color(card) == "red" ? 1 : 0;
					});
					"step 1";
					if (result.bool) {
						player.draw();
					}
				},
			},
			lianyu: {
				enable: "phaseUse",
				usable: 1,
				filterCard: { color: "red" },
				check: function (card) {
					return 6 - get.value(card);
				},
				filterTarget: true,
				selectTarget: -1,
				line: "fire",
				content: function () {
					target.damage("fire");
				},
				ai: {
					result: {
						player: function (card, player, target) {
							var eff = 0;
							for (var i = 0; i < game.players.length; i++) {
								if (!game.players[i].isOut()) {
									eff += get.damageEffect(game.players[i], player, player, "fire");
								}
							}
							return eff;
						},
					},
					expose: 0.1,
				},
			},
			manjia: {
				group: ["manjia1", "manjia2"],
			},
			manjia1: {
				trigger: { target: "useCardToBefore" },
				forced: true,
				priority: 6,
				filter: function (event, player) {
					if (player.getEquip(2)) return false;
					return lib.skill.tengjia1.filter(event, player);
				},
				content: function () {
					trigger.cancel();
				},
				ai: {
					effect: {
						target_use(card, player, target, current) {
							if (target.getEquip(2)) return;
							return lib.skill.tengjia1.ai.effect.target.apply(this, arguments);
						},
					},
				},
			},
			manjia2: {
				trigger: { player: "damageBegin" },
				filter: function (event, player) {
					if (player.getEquip(2)) return false;
					if (event.hasNature("fire")) return true;
				},
				forced: true,
				check: function () {
					return false;
				},
				content: function () {
					trigger.num++;
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (target.getEquip(2)) return;
							return lib.skill.tengjia2.ai.effect.target.apply(this, arguments);
						},
					},
				},
			},
			xiaoshou: {
				trigger: { player: "phaseEnd" },
				filter: function (event, player) {
					var players = game.players.slice(0);
					players.sort(function (a, b) {
						return b.hp - a.hp;
					});
					return players[0].hp > players[1].hp && players[0] != player;
				},
				check: function (event, player) {
					var players = game.players.slice(0);
					players.sort(function (a, b) {
						return b.hp - a.hp;
					});
					return get.damageEffect(players[0], player, player, "fire") > 0;
				},
				prompt: function () {
					var players = game.players.slice(0);
					players.sort(function (a, b) {
						return b.hp - a.hp;
					});
					return "枭首：是否对" + get.translation(players[0]) + "造成1点火焰伤害？";
				},
				content: function () {
					var players = game.players.slice(0);
					players.sort(function (a, b) {
						return b.hp - a.hp;
					});
					if (players[0].hp > players[1].hp && players[0] != player) {
						players[0].damage("fire");
						player.line(players[0], "fire");
					}
				},
				ai: {
					expose: 0.2,
				},
			},
			guiji: {
				trigger: { player: "phaseJudgeBegin" },
				forced: true,
				content: function () {
					player.discard(player.getCards("j").randomGet());
				},
				filter: function (event, player) {
					return player.countCards("j") > 0;
				},
				ai: {
					effect: {
						target_use: function (card, player, target, current) {
							if (get.type(card) == "delay" && target.countCards("j") == 0) return 0.1;
						},
					},
				},
			},
			qiangzheng: {
				audio: 2,
				trigger: { player: "phaseEnd" },
				direct: true,
				forced: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != player && game.players[i].countCards("h")) return true;
					}
					return false;
				},
				content: function () {
					"step 0";
					player.chooseTarget("获得一名角色的一张手牌", true, function (card, player, target) {
						return player != target && target.countCards("h") > 0;
					}).ai = function (target) {
						return -get.attitude(player, target);
					};
					"step 1";
					if (result.targets && result.targets.length) {
						player.logSkill("qiangzheng", result.targets);
						player.gain(result.targets[0].getCards("h").randomGet(), result.targets[0]);
						result.targets[0].$give(1, player);
						game.delay();
					}
				},
				ai: {
					threaten: 1.7,
				},
			},
			suoling: {
				trigger: { player: "phaseEnd" },
				forced: true,
				filter: function (event, player) {
					if (player.isLinked()) return true;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != player && !game.players[i].isLinked()) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					event.targets = game.players.slice(0);
					event.targets.remove(player);
					event.targets.sort(lib.sort.seat);
					if (player.isLinked()) player.link();
					"step 1";
					if (event.targets.length) {
						var target = event.targets.shift();
						if (!target.isLinked()) {
							target.link();
						}
						event.redo();
					}
				},
			},
			xixing: {
				enable: "phaseUse",
				usable: 1,
				filterCard: function (card) {
					var type = get.type(card);
					for (var i = 0; i < ui.selected.cards.length; i++) {
						if (get.type(ui.selected.cards[i]) == type) return false;
					}
					return true;
				},
				complexCard: true,
				selectCard: 3,
				position: "he",
				filterTarget: function (card, player, target) {
					return player != target;
				},
				check: function (card) {
					if (_status.event.player.hp == _status.event.player.maxHp) {
						return 5 - get.value(card);
					}
					return 10 - get.value(card);
				},
				content: function () {
					"step 0";
					target.damage();
					"step 1";
					player.recover();
				},
				ai: {
					order: 9.5,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player);
						},
					},
					expose: 0.2,
				},
			},
		},
		translate: {
			nianshou: "年兽",
			nianrui: "年瑞",
			qixiang: "祺祥",
			qixiang1: "祺祥",
			qixiang2: "祺祥",
			nianrui_info: "准备阶段和结束阶段，你可以进行一次判定，若结果为红色则摸一张牌。",
			qixiang_info: "乐不思蜀判定时，你的方块判定牌视为红桃；兵粮寸断判定时，你的黑桃判定牌视为草花。",

			mamian: "马面",
			lianyu: "炼狱",
			lianyu_info: "出牌阶段限一次，你可以弃置一张红色手牌令场上所有角色受到1点火焰伤害。",

			niutou: "牛头",
			manjia: "蛮甲",
			manjia1: "蛮甲",
			manjia2: "蛮甲",
			manjia_info: "锁定技，若你的装备区内没有防具牌，则你视为装备了【藤甲】。",
			xiaoshou: "枭首",
			xiaoshou_info: "结束阶段，若场上体力值最多的角色只有一个，你可以对其造成1点火焰伤害。",
			guiji: "诡计",
			guiji_info: "锁定技，准备阶段结束时，若你的判定区内有牌，你随机弃置其中一张牌。",

			baiwuchang: "白无常",
			qiangzheng: "强征",
			qiangzheng_info: "锁定技，结束阶段，你获得一名其他角色的一张手牌。",
			zuijiu: "醉酒",
			zuijiu_info: "锁定技，你的黑【杀】造成的伤害+1，造成伤害后须弃置一张手牌。",

			heiwuchang: "黑无常",
			suoling: "索令",
			suoling_info: "锁定技，结束阶段，你解除横置状态，除你之外的所有角色进入横置状态。",
			xixing: "吸星",
			xixing_info:
				"出牌阶段限一次，你可以弃置三张不同类别的牌，对一名其他角色造成1点伤害，然后回复1点体力。",
		},
	};
});
