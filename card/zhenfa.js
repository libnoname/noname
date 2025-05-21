import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "zhenfa",
		card: {
			pozhenjue: {
				type: "zhenfa",
				recastable: true,
				enable: true,
				notarget: true,
				content() {
					var targets = game.filterPlayer();
					var n = targets.length;
					while (n--) {
						game.swapSeat(targets.randomGet(), targets.randomGet());
					}
				},
				mode: ["guozhan"],
				ai: {
					order: 8,
					result: {
						player: 1,
					},
				},
			},
			changshezhen: {
				type: "zhenfa",
				recastable: true,
				enable(card, player) {
					if (player.inline()) {
						return true;
					}
					if (player.identity == "unknown" || player.identity == "ye") {
						return false;
					}
					return game.hasPlayer(function (current) {
						return current != player && current.isFriendOf(player);
					});
				},
				notarget: true,
				content() {
					if (player.inline()) {
						var targets = game.filterPlayer(function (current) {
							return player.inline(current);
						});
						player.line(targets);
						game.asyncDraw(targets);
					} else if (player.getNext()) {
						var list = game.filterPlayer(function (current) {
							return current != player && current.isFriendOf(player);
						});
						if (list.length) {
							list.sort(function (a, b) {
								return get.distance(player, a, "absolute") - get.distance(player, b, "absolute");
							});
							player.line(list[0]);
							game.swapSeat(list[0], player.getNext(), true, true);
						}
					}
				},
				mode: ["guozhan"],
				ai: {
					order: 6.5,
					result: {
						player: 1,
					},
					tag: {
						draw: 1,
					},
				},
			},
			tianfuzhen: {
				type: "zhenfa",
				recastable: true,
				enable() {
					return game.hasPlayer(function (current) {
						return current.isMajor();
					});
				},
				filterTarget(card, player, target) {
					return target.isMajor() && target.countCards("he") > 0;
				},
				selectTarget: -1,
				content() {
					target.chooseToDiscard("he", true).delay = false;
				},
				mode: ["guozhan"],
				ai: {
					order: 7,
					result: {
						target: -1,
					},
					tag: {
						discard: 1,
					},
				},
			},
			dizaizhen: {
				type: "zhenfa",
				recastable: true,
				enable() {
					return game.hasPlayer(function (current) {
						return current.isNotMajor();
					});
				},
				filterTarget(card, player, target) {
					return target.isNotMajor();
				},
				selectTarget: -1,
				content() {
					target.draw(false);
					target.$draw();
				},
				mode: ["guozhan"],
				ai: {
					order: 7,
					result: {
						target: 1,
					},
					tag: {
						draw: 1,
					},
				},
			},
			fengyangzhen: {
				type: "zhenfa",
				recastable: true,
				enable: true,
				filterTarget(card, player, target) {
					return target.sieged();
				},
				selectTarget: -1,
				content() {
					target.addTempSkill("feiying", { player: "damageAfter" });
					target.popup("feiying");
					game.log(target, "获得了技能", "【飞影】");
				},
				mode: ["guozhan"],
				ai: {
					order: 7,
					result: {
						target: 2,
					},
				},
			},
			yunchuizhen: {
				type: "zhenfa",
				recastable: true,
				enable: true,
				filterTarget(card, player, target) {
					return target.siege();
				},
				selectTarget: -1,
				content() {
					target.addTempSkill("wushuang", { source: "damageAfter" });
					target.popup("wushuang");
					game.log(target, "获得了技能", "【无双】");
				},
				mode: ["guozhan"],
				ai: {
					order: 7,
					result: {
						target: 2,
					},
				},
			},
			qixingzhen: {
				type: "zhenfa",
				recastable: true,
				enable(card, player) {
					return player.siege() || player.sieged();
				},
				filterTarget(card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content() {
					"step 0";
					event.targets = game.filterPlayer(function (current) {
						return current.siege(player);
					});
					"step 1";
					if (event.targets.length) {
						var current = event.targets.shift();
						player.line(current, "green");
						player.discardPlayerCard(current, true);
						event.redo();
					}
					"step 2";
					var card = { name: "sha", isCard: true };
					var list = game.filterPlayer(function (current) {
						return current.siege(player) && player.canUse(card, current);
					});
					if (list.length) {
						player.useCard(card, list, false);
					}
				},
				mode: ["guozhan"],
				ai: {
					order: 7,
					result: {
						target: 1,
					},
				},
			},
			shepanzhen: {
				type: "zhenfa",
				recastable: true,
				enable(card, player) {
					if (player.identity == "unknown" || player.identity == "ye") {
						return false;
					}
					if (get.population(player.identity) <= 1) {
						return false;
					}
					return game.hasPlayer(function (current) {
						return current != player && current.identity == player.identity && !player.inline(current);
					});
				},
				notarget: true,
				content() {
					var targets = game.filterPlayer(function (current) {
						return current.identity == player.identity;
					});
					targets.sortBySeat();
					for (var i = 1; i < targets.length; i++) {
						game.swapSeat(targets[i], targets[i - 1].next, false);
					}
					game.log(get.translation(player.identity) + "势力角色摆成了蛇蟠阵");
				},
				mode: ["guozhan"],
				ai: {
					order: 7,
					result: {
						player: 1,
					},
				},
			},
			longfeizhen: {
				type: "zhenfa",
				recastable: true,
				enable(card, player) {
					return player.next.siege(player);
				},
				filterTarget(card, player, target) {
					if (target.getCards("he").length == 0) {
						return false;
					}
					return target == player.next || target == player.previous;
				},
				selectTarget: -1,
				content() {
					"step 0";
					player.choosePlayerCard(target, "he", true);
					"step 1";
					target.discard(result.buttons[0].link);
					"step 2";
					if (target == targets[targets.length - 1]) {
						player.draw();
					}
				},
				mode: ["guozhan"],
				ai: {
					order: 10,
					result: {
						target: -1,
						player: 1,
					},
				},
			},
			huyizhen: {
				type: "zhenfa",
				recastable: true,
				enable(card, player) {
					return player.siege(player.next) || player.siege(player.previous);
				},
				filterTarget(card, player, target) {
					return player.siege(target);
				},
				selectTarget: -1,
				content() {
					"step 0";
					player.chooseCard("将一张非基本牌当作杀对" + get.translation(target) + "使用", "he", function (card) {
						return get.type(card) != "basic";
					}).ai = function (card) {
						if (get.effect(target, { name: "sha" }, player, player) > 0) {
							return 6 - get.value(card);
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						player.useCard({ name: "sha" }, result.cards, target, false);
					}
					"step 2";
					if (target == player.next) {
						event.player2 = player.next.next;
					} else {
						event.player2 = player.previous.previous;
					}
					event.player2.chooseCard("将一张非基本牌当作杀对" + get.translation(target) + "使用", "he", function (card) {
						return get.type(card) != "basic";
					}).ai = function (card) {
						if (get.effect(target, { name: "sha" }, event.player2, event.player2) > 0) {
							return 6 - get.value(card);
						}
						return 0;
					};
					"step 3";
					if (result.bool) {
						event.player2.useCard({ name: "sha" }, result.cards, target, false);
					}
				},
				mode: ["guozhan"],
				ai: {
					order: 7,
					result: {
						target: -2,
					},
				},
			},
			niaoxiangzhen: {
				type: "zhenfa",
				recastable: true,
				enable: true,
				filterTarget(card, player, target) {
					if (player.identity == target.identity) {
						return false;
					}
					if (target.identity == "unknown" || target.identity == "ye") {
						return false;
					}
					return target.identity == target.next.identity || target.identity == target.previous.identity;
				},
				selectTarget: -1,
				content() {
					"step 0";
					var next = target.chooseToRespond({ name: "shan" });
					next.ai = function (card) {
						if (get.damageEffect(target, player, target) >= 0) {
							return 0;
						}
						return 1;
					};
					next.set("respondTo", [player, card]);
					next.autochoose = lib.filter.autoRespondShan;
					"step 1";
					if (result.bool == false) {
						target.damage();
					}
				},
				ai: {
					basic: {
						order: 9,
						useful: 1,
					},
					result: {
						target: -1.5,
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: 1,
					},
				},
				mode: ["guozhan"],
			},
		},
		skill: {},
		translate: {
			zhenfa: "阵法",
			changshezhen: "长蛇阵",
			pozhenjue: "破阵决",
			tianfuzhen: "天覆阵",
			dizaizhen: "地载阵",
			fengyangzhen: "风扬阵",
			yunchuizhen: "云垂阵",
			qixingzhen: "七星阵",
			shepanzhen: "蛇蟠阵",
			shepanzhen_bg: "列",
			yunchuizhen_bg: "垂",
			longfeizhen: "龙飞阵",
			huyizhen: "虎翼阵",
			niaoxiangzhen: "鸟翔阵",
			niaoxiangzhen_info: "令所有非你阵营的队列的角色依次打出一张【闪】，或者受到1点伤害。",
			qixingzhen_info: "弃置所有围攻你的角色各一张牌，然后视为对所有你围攻的角色使用一张不计入出杀次数的杀。",
			// longfeizhen_info:'弃置围攻你的角色各一张牌，然后摸一张牌。',
			// qixingzhen_info:'令我方所有角色进入围攻状态。',
			// shepanzhen_info:'令我方所有角色进入队列状态。',
			// yunchuizhen_info:'令所有围攻角色获得技能〖无双〗，直到其首次造成伤害。',
			// fengyangzhen_info:'令所有被围攻角色获得技能〖飞影〗，直到其首次受到伤害。',
			dizaizhen_info: "所有小势力角色摸一张牌。",
			changshezhen_info: "若你处于队列中，与你同一队列的所有角色摸一张牌，否则将与你逆时针距离最近的同势力角色移至你下家。",
			// pozhenjue_info:'将所有角色的顺序随机重排。',
			tianfuzhen_info: "所有大势力角色弃置一张牌。",
		},
		list: [
			["diamond", 1, "changshezhen"],
			["club", 1, "changshezhen"],
			// ["spade",1,'changshezhen'],
			// ["heart",1,'changshezhen'],

			["diamond", 2, "tianfuzhen"],
			// ["club",2,'tianfuzhen'],
			["spade", 2, "tianfuzhen"],
			["heart", 2, "tianfuzhen"],

			["diamond", 3, "dizaizhen"],
			// ["club",3,'dizaizhen'],
			["spade", 3, "dizaizhen"],
			["heart", 3, "dizaizhen"],

			// ["diamond",4,'fengyangzhen'],
			// ["club",4,'fengyangzhen'],
			// ["spade",4,'fengyangzhen'],
			// ["heart",4,'fengyangzhen'],

			// ["diamond",5,'zhonghuangzhen'],
			// ["club",5,'zhonghuangzhen'],
			// ["spade",5,'zhonghuangzhen'],
			// ["heart",5,'zhonghuangzhen'],

			// ["diamond",6,'huyizhen'],
			// ["club",6,'huyizhen'],
			// ["spade",6,'huyizhen'],
			// ["heart",6,'huyizhen'],

			["diamond", 7, "qixingzhen"],
			["club", 7, "qixingzhen"],
			["spade", 7, "qixingzhen"],
			// ["heart",7,'qixingzhen'],

			// ["diamond",8,'shepanzhen'],
			// ["club",8,'shepanzhen'],
			// ["spade",8,'shepanzhen'],
			// ["heart",8,'shepanzhen'],

			// ["diamond",9,'longfeizhen'],
			// ["club",9,'longfeizhen'],
			// ["spade",9,'longfeizhen'],
			// ["heart",9,'longfeizhen'],

			["diamond", 11, "niaoxiangzhen"],
			// ["club",11,'niaoxiangzhen'],
			["spade", 11, "niaoxiangzhen"],
			["heart", 11, "niaoxiangzhen"],

			// ["diamond",12,'yunchuizhen'],
			// ["club",12,'yunchuizhen'],
			// ["spade",12,'yunchuizhen'],
			// ["heart",12,'yunchuizhen'],

			// ["diamond",13,'pozhenjue'],
			// ["club",13,'pozhenjue'],
			// ["spade",13,'pozhenjue'],
			//["heart",13,'pozhenjue'],
		],
	};
});
