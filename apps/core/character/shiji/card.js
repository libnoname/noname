import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	qizhengxiangsheng: {
		enable: true,
		type: "trick",
		fullskin: true,
		derivation: "shen_xunyu",
		filterTarget: lib.filter.notMe,
		content() {
			"step 0";
			if (!event.qizheng_name) {
				if (player.isIn()) {
					player
						.chooseControl("奇兵", "正兵")
						.set("prompt", "请选择" + get.translation(target) + "的标记")
						.set(
							"choice",
							(function () {
								var e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
								var e2 = 0;
								if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
									e2 = -1;
								}
								var es = target.getGainableCards(player, "e");
								if (es.length) {
									e2 = Math.min(
										e2,
										(function () {
											var max = 0;
											for (var i of es) {
												max = Math.max(max, get.value(i, target));
											}
											return -max / 4;
										})()
									);
								}
								if (Math.abs(e1 - e2) <= 0.3) {
									return Math.random() < 0.5 ? "奇兵" : "正兵";
								}
								if (e1 < e2) {
									return "奇兵";
								}
								return "正兵";
							})()
						)
						.set("ai", function () {
							return _status.event.choice;
						});
				} else {
					event.finish();
				}
			}
			"step 1";
			if (!event.qizheng_name && result && result.control) {
				event.qizheng_name = result.control;
			}
			if (event.directHit) {
				event._result = { bool: false };
			} else {
				target
					.chooseToRespond("请打出一张杀或闪响应奇正相生", function (card, player) {
						var name = get.name(card);
						return name == "sha" || name == "shan";
					})
					.set("ai", function (card) {
						if (_status.event.choice == "all") {
							var rand = get.rand("qizhengxiangsheng");
							if (rand > 0.5) {
								return 0;
							}
							return 1 + Math.random();
						}
						if (get.name(card) == _status.event.choice) {
							return get.order(card);
						}
						return 0;
					})
					.set("respondTo", [player, card])
					.set(
						"choice",
						(function () {
							if (target.hasSkillTag("useShan")) {
								return "shan";
							}
							if (typeof event.qizheng_aibuff == "boolean") {
								var shas = target.getCards("h", "sha"),
									shans = target.getCards("h", "shan");
								if (event.qizheng_aibuff) {
									if (shas.length >= Math.max(1, shans.length)) {
										return "shan";
									}
									if (shans.length > shas.length) {
										return "sha";
									}
									return false;
								}
								if (!shas.length || !shans.length) {
									return false;
								}
							}
							var e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
							var e2 = 0;
							if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
								e2 = -1;
							}
							var es = target.getGainableCards(player, "e");
							if (es.length) {
								e2 = Math.min(
									e2,
									(function () {
										var max = 0;
										for (var i of es) {
											max = Math.max(max, get.value(i, target));
										}
										return -max / 4;
									})()
								);
							}
							if (e1 - e2 >= 0.3) {
								return "shan";
							}
							if (e2 - e1 >= 0.3) {
								return "sha";
							}
							return "all";
						})()
					);
			}
			"step 2";
			var name = result.bool ? result.card.name : null,
				require = event.qizheng_name;
			if (require == "奇兵" && name != "sha") {
				target.damage();
			} else if (require == "正兵" && name != "shan" && target.countGainableCards(player, "he") > 0) {
				player.gainPlayerCard(target, true, "he");
			}
		},
		ai: {
			order: 5,
			tag: {
				damage: 0.6,
				gain: 0.5,
				loseCard: 1,
				respondShan: 1,
				respondSha: 1,
			},
			result: {
				target(player, target) {
					var e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
					var e2 = 0;
					if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
						e2 = -1;
					}
					var es = target.getGainableCards(player, "e");
					if (es.length) {
						e2 = Math.min(
							e2,
							(function () {
								var max = 0;
								for (var i of es) {
									max = Math.max(max, get.value(i, target));
								}
								return -max / 4;
							})()
						);
					}
					if (
						game.hasPlayer(function (current) {
							return current.hasSkill("tianzuo") && get.attitude(current, player) <= 0;
						})
					) {
						return Math.max(e1, e2);
					}
					return Math.min(e1, e2);
				},
			},
		},
	},
	binglinchengxiax: {
		enable: true,
		type: "trick",
		derivation: "sp_xunchen",
		fullskin: true,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event;
			if (!player.isIn() || !target.isIn()) {
				event.finish();
				return;
			}
			event.showCards = get.cards(4, true);
			await game.cardsGotoOrdering(event.showCards);
			await player.showCards(event.showCards, `${get.translation(player)}使用了【${get.translation(event.card)}】`, true).set("clearArena", false);
			if (player.isIn() && target.isIn() && event.showCards.length) {
				for (const card of event.showCards.slice()) {
					if (get.name(card) == "sha" && player.canUse(card, target, false)) {
						event.showCards.remove(card);
						await player.useCard(card, target, false);
					}
				}
			}
			game.broadcastAll(ui.clear);
			if (event.showCards.length) {
				await game.cardsGotoPile(event.showCards.reverse(), "insert");
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
