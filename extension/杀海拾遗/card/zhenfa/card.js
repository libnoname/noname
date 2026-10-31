import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const card = {
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
			if (player.identity === "unknown" || player.identity === "ye") {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current !== player && current.isFriendOf(player);
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
					return current !== player && current.isFriendOf(player);
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
			return target === player;
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
			if (player.identity === "unknown" || player.identity === "ye") {
				return false;
			}
			if (get.population(player.identity) <= 1) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current !== player && current.identity === player.identity && !player.inline(current);
			});
		},
		notarget: true,
		content() {
			var targets = game.filterPlayer(function (current) {
				return current.identity === player.identity;
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
			if (target.getCards("he").length === 0) {
				return false;
			}
			return target === player.next || target === player.previous;
		},
		selectTarget: -1,
		content() {
			"step 0";
			player.choosePlayerCard(target, "he", true);
			"step 1";
			target.discard(result.buttons[0].link);
			"step 2";
			if (target === targets[targets.length - 1]) {
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
				return get.type(card) !== "basic";
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
			if (target === player.next) {
				event.player2 = player.next.next;
			} else {
				event.player2 = player.previous.previous;
			}
			event.player2.chooseCard("将一张非基本牌当作杀对" + get.translation(target) + "使用", "he", function (card) {
				return get.type(card) !== "basic";
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
			if (player.identity === target.identity) {
				return false;
			}
			if (target.identity === "unknown" || target.identity === "ye") {
				return false;
			}
			return target.identity === target.next.identity || target.identity === target.previous.identity;
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
			if (result.bool === false) {
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
};

export default card;
