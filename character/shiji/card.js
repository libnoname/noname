import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	binglinchengxiax: {
		enable: true,
		type: "trick",
		derivation: "sp_xunchen",
		fullskin: true,
		filterTarget: lib.filter.notMe,
		content() {
			"step 0";
			if (!player.isIn() || !target.isIn()) {
				event.finish();
				return;
			}
			event.showCards = get.cards(4);
			game.cardsGotoOrdering(event.showCards);
			player.showCards(event.showCards);
			"step 1";
			if (player.isIn() && target.isIn() && event.showCards.length) {
				for (var i of event.showCards) {
					if (i.name == "sha" && player.canUse(i, target, false)) {
						player.useCard(i, target, false);
						event.showCards.remove(i);
						event.redo();
						break;
					}
				}
			}
			"step 2";
			if (event.showCards.length) {
				while (event.showCards.length) {
					ui.cardPile.insertBefore(event.showCards.pop().fix(), ui.cardPile.firstChild);
				}
				game.updateRoundNumber();
			}
		},
		ai: {
			basic: {
				useful: 4,
				value: 3,
			},
			order: 4,
			result: {
				target(player, target, card, isLink) {
					if (get.effect(target, { name: "sha" }, player, target) == 0) {
						return 0;
					}
					return -2.5;
				},
			},
			tag: {
				respond: 1,
				respondShan: 1,
				damage: 1,
			},
		},
	},
	tiaojiyanmei: {
		enable: true,
		type: "trick",
		derivation: "feiyi",
		fullskin: true,
		filterTarget(card, player, target) {
			var targets = [];
			if (ui.selected.targets.length) {
				targets.addArray(ui.selected.targets);
			}
			var evt = _status.event.getParent("useCard");
			if (evt && evt.card == card) {
				targets.addArray(evt.targets);
			}
			if (targets.length) {
				var hs = target.countCards("h");
				for (var i of targets) {
					if (i.countCards("h") != hs) {
						return true;
					}
				}
				return false;
			}
			return true;
		},
		recastable: true,
		selectTarget: 2,
		postAi: () => true,
		contentBefore() {
			if (!targets.length) {
				return;
			}
			var map = {};
			event.getParent().customArgs.default.tiaojiyanmei_map = map;
			var average = 0;
			for (var target of targets) {
				var hs = target.countCards("h");
				map[target.playerid] = hs;
				average += hs;
			}
			map.average = average / targets.length;
		},
		content() {
			var map = event.tiaojiyanmei_map,
				num1 = map.average,
				num2 = map[target.playerid];
			if (typeof num2 != "number") {
				num2 = target.countCards("h");
			}
			if (num2 > num1) {
				target.chooseToDiscard("he", true);
			} else if (num2 < num1) {
				target.draw();
			}
		},
		contentAfter() {
			"step 0";
			if (!player.isIn() || targets.length < 2) {
				event.finish();
				return;
			}
			var num = targets[0].countCards("h");
			for (var i = 1; i < targets.length; i++) {
				if (targets[i].countCards("h") != num) {
					event.finish();
					return;
				}
			}
			var cards = [];
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.name == "lose" && evt.type == "discard" && evt.getParent(3).card == card) {
					cards.addArray(evt.cards);
				}
			});
			cards = cards.filterInD("d");
			if (cards.length) {
				event.tiaojiyanmei_cards = cards;
				player.chooseTarget("是否令一名角色获得" + get.translation(cards) + "？").set("ai", function (target) {
					var evt = _status.event.getParent();
					return get.attitude(evt.player, target) * get.value(evt.tiaojiyanmei_cards, target) * (target.hasSkillTag("nogain") ? 0.1 : 1);
				});
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "thunder");
				target.gain(event.tiaojiyanmei_cards, "gain2");
			}
		},
		ai: {
			order: 6.1,
			basic: {
				useful: 4,
				value: 3,
			},
			result: {
				target(player, target, card, isLink) {
					var targets = [];
					if (ui.selected.targets.length) {
						targets.addArray(ui.selected.targets);
					}
					var evt = _status.event.getParent("useCard");
					if (evt && evt.card == card) {
						targets.addArray(evt.targets);
					}
					if (evt && evt.card == card && evt.customArgs && evt.customArgs.tiaojiyanmei_map) {
						var map = evt.customArgs.tiaojiyanmei_map,
							num1 = map.average,
							num2 = map[target.playerid];
						if (typeof num2 != "number") {
							num2 = target.countCards("h");
						}
						if (num2 > num1) {
							if (
								target.countCards("e", function (card) {
									return get.value(card) <= 0;
								})
							) {
								return 1;
							}
							return -1;
						}
						if (num2 < num1) {
							return 1;
						}
						return 0;
					}
					var cards = [card];
					if (card.cards) {
						cards.addArray(card.cards);
					}
					var fh = function (card) {
						return !cards.includes(card);
					};
					if (!targets.length) {
						if (get.attitude(player, target) < 0) {
							if (
								target.countCards("e", function (card) {
									return get.value(card, target) <= 0;
								})
							) {
								return 1;
							}
							if (
								game.hasPlayer(function (current) {
									return current.countCards("h", fh) == target.countCards("h", fh) - 2;
								})
							) {
								return -2;
							}
							if (
								game.hasPlayer(function (current) {
									return current.countCards("h", fh) < target.countCards("h", fh);
								})
							) {
								return -1;
							}
						}
						if (
							target.countCards("e", function (card) {
								return get.value(card, target) <= 0;
							}) &&
							game.hasPlayer(function (current) {
								return current.countCards("h", fh) < target.countCards("h", fh);
							})
						) {
							return 1;
						}
						return 0;
					}
					var average = 0;
					for (var i of targets) {
						average += i.countCards("h", fh);
					}
					if (!targets.includes(target)) {
						var th = target.countCards("h", fh);
						average += th;
						average /= targets.length + 1;
						if (th == average) {
							return 0;
						}
						if (th < average) {
							return th == average - 1 ? 2 : 1;
						}
						if (th > average) {
							if (
								target.countCards("e", function (card) {
									return get.value(card) <= 0;
								})
							) {
								return 1;
							}
							return -0.5;
						}
						return 0;
					}
					average /= targets.length;
					if (th < average) {
						return 1;
					}
					if (th > average) {
						if (
							target.countCards("e", function (card) {
								return get.value(card) <= 0;
							})
						) {
							return 1;
						}
						return -1;
					}
					return 0;
				},
			},
		},
	},
};
export default cards;
