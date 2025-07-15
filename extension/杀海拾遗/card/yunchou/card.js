import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const card = {
	caochuanjiejian: {
		fullskin: true,
		type: "trick",
		enable: true,
		filterTarget(card, player, target) {
			return target.countCards("h") > 0 && target !== player;
		},
		content() {
			"step 0";
			if (target.countCards("h", "sha")) {
				var name = get.translation(player.name);
				target
					.chooseControl()
					.set("prompt", get.translation("caochuanjiejian"))
					.set("choiceList", ["将手牌中的所有杀交给" + name + "，并视为对" + name + "使用一张杀", "展示手牌并令" + name + "弃置任意一张"], function () {
						if (get.effect(player, { name: "sha" }, target, target) < 0) {
							return 1;
						}
						if (target.countCards("h", "sha") >= 3) {
							return 1;
						}
						return 0;
					});
			} else {
				event.directfalse = true;
			}
			"step 1";
			if (event.directfalse || result.control === "选项二") {
				if (target.countCards("h")) {
					if (!player.isUnderControl(true)) {
						target.showHandcards();
					} else {
						game.log(target, "展示了", target.getCards("h"));
					}
					player.discardPlayerCard(target, "h", true, "visible");
				}
				event.finish();
			} else {
				var hs = target.getCards("h", "sha");
				player.gain(hs, target);
				target.$give(hs, player);
			}
			"step 2";
			target.useCard({ name: "sha" }, player);
		},
		ai: {
			order: 4,
			value: [5, 1],
			result: {
				target(player, target) {
					if (player.hasShan()) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	geanguanhuo: {
		fullskin: true,
		type: "trick",
		filterTarget(card, player, target) {
			if (target === player) {
				return false;
			}
			return (
				target.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return target.canCompare(current);
				})
			);
			//return ui.selected.targets[0].canCompare(target);
		},
		filterAddedTarget(card, player, target, preTarget) {
			return target !== player && preTarget.canCompare(target);
		},
		enable() {
			return game.countPlayer() > 2;
		},
		recastable() {
			return game.countPlayer() <= 2;
		},
		multicheck(card, player) {
			return (
				game.countPlayer(function (current) {
					return current !== player && current.countCards("h");
				}) > 1
			);
		},
		multitarget: true,
		multiline: true,
		singleCard: true,
		complexSelect: true,
		content() {
			"step 0";
			if (!event.addedTarget || !target.canCompare(event.addedTarget)) {
				event.finish();
				return;
			}
			target.chooseToCompare(event.addedTarget);
			"step 1";
			if (!result.tie) {
				if (result.bool) {
					if (event.addedTarget.countCards("he")) {
						target.line(event.addedTarget);
						target.gainPlayerCard(event.addedTarget, true);
					}
				} else {
					if (target.countCards("he")) {
						event.addedTarget.line(target);
						event.addedTarget.gainPlayerCard(target, true);
					}
				}
				event.finish();
			}
			"step 2";
			target.discardPlayerCard(player);
			target.line(player);
		},
		ai: {
			order: 5,
			value: [7, 1],
			useful: [4, 1],
			result: {
				target: -1,
			},
		},
	},
	shezhanqunru: {
		fullskin: true,
		type: "trick",
		enable: true,
		toself: true,
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		modTarget: true,
		content() {
			"step 0";
			var list = game.filterPlayer(function (current) {
				return current !== target && target.canCompare(current);
			});
			if (!list.length) {
				target.draw(3);
				event.finish();
			} else {
				list.sortBySeat(target);
				event.list = list;
				event.torespond = [];
			}
			"step 1";
			if (event.list.length) {
				event.current = event.list.shift();
				event.current
					.chooseBool("是否响应" + get.translation(target) + "的舌战群儒？", function (event, player) {
						if (get.attitude(player, _status.event.source) >= 0) {
							return false;
						}
						var hs = player.getCards("h");
						var dutag = player.hasSkillTag("nodu");
						for (var i = 0; i < hs.length; i++) {
							var value = get.value(hs[i], player);
							if (hs[i].name === "du" && dutag) {
								continue;
							}
							if (value < 0) {
								return true;
							}
							if (!_status.event.hasTarget) {
								if (hs[i].number >= 8 && value <= 7) {
									return true;
								}
								if (value <= 3) {
									return true;
								}
							} else if (_status.event.hasTarget % 2 === 1) {
								if (hs[i].number >= 11 && value <= 6) {
									return true;
								}
							}
						}
						return false;
					})
					.set("source", target)
					.set("hasTarget", event.torespond.length);
			} else {
				event.goto(3);
			}
			"step 2";
			if (result.bool) {
				event.torespond.push(event.current);
				event.current.line(target, "green");
				event.current.popup("响应");
				game.log(event.current, "响应了舌战群儒");
				game.delayx(0.5);
			}
			event.goto(1);
			"step 3";
			if (event.torespond.length === 0) {
				event.num = 1;
			} else {
				event.num = 0;
				target.chooseToCompare(event.torespond).callback = lib.card.shezhanqunru.callback;
			}
			"step 4";
			if (event.num > 0) {
				target.draw(3);
			}
		},
		callback() {
			if (event.card1.number > event.card2.number) {
				event.parent.parent.num++;
			} else {
				event.parent.parent.num--;
			}
		},
		ai: {
			order: 8.5,
			value: [6, 1],
			useful: [3, 1],
			tag: {
				draw: 3,
			},
			result: {
				target(player, target) {
					var hs = target.getCards("h");
					for (var i = 0; i < hs.length; i++) {
						var value = get.value(hs[i]);
						if (hs[i].number >= 7 && value <= 6) {
							return 1;
						}
						if (value <= 3) {
							return 1;
						}
					}
					return 0;
				},
			},
		},
	},
	suolianjia: {
		fullskin: true,
		type: "equip",
		subtype: "equip2",
		skills: ["suolianjia"],
		onEquip() {
			if (player.isLinked() === false) {
				player.link();
			}
		},
		onLose() {
			if (player.isLinked()) {
				player.link();
			}
		},
		ai: {
			basic: {
				equipValue: 5,
			},
		},
	},
	chenhuodajie: {
		fullskin: true,
		type: "trick",
		filterTarget: true,
		global: "g_chenhuodajie",
		content() {
			if (target.countCards("he")) {
				player.gainPlayerCard("he", target, true);
			}
		},
		ai: {
			order: 1,
			useful: 6,
			value: 6,
			result: {
				target: -1,
			},
			tag: {
				loseCard: 1,
			},
		},
	},
	fudichouxin: {
		audio: "ext:杀海拾遗/audio/card",
		fullskin: true,
		type: "trick",
		enable: true,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		content() {
			"step 0";
			player.chooseToCompare(target).set("preserve", "win").clear = false;
			"step 1";
			if (result.bool) {
				player.gain([result.player, result.target]);
				result.player.clone?.moveDelete(player);
				result.target.clone?.moveDelete(player);
				game.addVideo("gain2", player, get.cardsInfo([result.player, result.target]));
			} else if (!result.cancelled) {
				result.player.clone?.delete();
				result.target.clone?.delete();
				game.addVideo("deletenode", player, get.cardsInfo([result.player, result.target]));
			}
		},
		ai: {
			order: 4,
			value: [4, 1],
			result: {
				target(player) {
					if (player.countCards("h") <= 1) {
						return 0;
					}
					return -1;
				},
				player(player) {
					if (player.countCards("h") <= 1) {
						return 0;
					}
					return 0.5;
				},
			},
			tag: {
				loseCard: 1,
			},
		},
	},
	shuigong: {
		fullskin: true,
		type: "trick",
		enable: true,
		filterTarget(card, player, target) {
			return target.countCards("e");
		},
		selectTarget: -1,
		content() {
			if (target.countCards("e")) {
				target.chooseToDiscard("e", true);
			}
		},
		reverseOrder: true,
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (target.countCards("e")) {
						return -1;
					}
					return 0;
				},
			},
			tag: {
				multitarget: 1,
				multineg: 1,
			},
		},
	},
	toulianghuanzhu: {
		audio: "ext:杀海拾遗/audio/card",
		fullskin: true,
		type: "trick",
		enable: true,
		filterTarget(card, player, target) {
			return target.countCards("h") > 0;
		},
		content() {
			"step 0";
			if (!target.countCards("h")) {
				event.finish();
				return;
			}
			var hs = player.getCards("h");
			if (hs.length) {
				var minval = get.value(hs[0]);
				var colors = [get.color(hs[0])];
				for (var i = 1; i < hs.length; i++) {
					var val = get.value(hs[i], player, "raw");
					if (val < minval) {
						minval = val;
						colors = [get.color(hs[i])];
					} else if (val === minval) {
						colors.add(get.color(hs[i]));
					}
				}
				player.chooseCardButton("偷梁换柱", target.getCards("h")).ai = function (button) {
					var val = get.value(button.link, player, "raw") - minval;
					if (val >= 0) {
						if (colors.includes(get.color(button.link))) {
							val += 3;
						}
					}
					return val;
				};
			} else {
				player.viewHandcards(target);
				event.finish();
			}
			"step 1";
			if (result.bool) {
				event.card = result.links[[0]];
				player.chooseCard("h", true, "用一张手牌替换" + get.translation(event.card)).ai = function (card) {
					return -get.value(card);
				};
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.gain(event.card, target);
				target.gain(result.cards, player);
				player.$giveAuto(result.cards, target);
				target.$giveAuto(event.card, player);
				game.log(player, "与", target, "交换了一张手牌");
				if (get.color(event.card) === get.color(result.cards[0])) {
					player.draw();
				}
				target.addTempSkill("toulianghuanzhu_ai1");
			} else {
				target.addTempSkill("toulianghuanzhu_ai2");
			}
		},
		ai: {
			order: 8,
			tag: {
				loseCard: 1,
				norepeat: 1,
			},
			result: {
				target(player, target) {
					if (player.countCards("h") <= 1) {
						return 0;
					}
					if (target.hasSkill("toulianghuanzhu_ai2")) {
						return 0;
					}
					if (target.hasSkill("toulianghuanzhu_ai1")) {
						return 0.5;
					}
					return -1;
				},
			},
			useful: [4, 1],
			value: [6, 1],
		},
	},
	huoshan: {
		fullskin: true,
		type: "delay",
		cardcolor: "red",
		cardnature: "fire",
		toself: true,
		modTarget(card, player, target) {
			return lib.filter.judge(card, player, target);
		},
		enable(card, player) {
			return player.canAddJudge(card);
		},
		filterTarget(card, player, target) {
			return lib.filter.judge(card, player, target) && player === target;
		},
		selectTarget: [-1, -1],
		judge(card) {
			if (get.suit(card) === "heart" && get.number(card) > 1 && get.number(card) < 10) {
				return -6;
			}
			return 1;
		},
		judge2(result) {
			if (result.bool === false) {
				return true;
			}
			return false;
		},
		effect() {
			if (result.bool === false) {
				player.damage(2, "fire", "nosource");
				var players = game.filterPlayer(function (current) {
					return get.distance(player, current) <= 1 && player !== current;
				});
				players.sort(lib.sort.seat);
				for (var i = 0; i < players.length; i++) {
					players[i].damage(1, "fire", "nosource");
				}
			} else {
				player.addJudgeNext(card);
			}
		},
		cancel() {
			player.addJudgeNext(card);
		},
		ai: {
			basic: {
				useful: 0,
				value: 0,
			},
			order: 1,
			result: {
				target(player, target) {
					return lib.card.shandian.ai.result.target(player, target);
				},
			},
			tag: {
				damage: 0.15,
				natureDamage: 0.15,
				fireDamage: 0.15,
			},
		},
	},
	hongshui: {
		type: "delay",
		toself: true,
		enable(card, player) {
			return player.canAddJudge(card);
		},
		modTarget(card, player, target) {
			return lib.filter.judge(card, player, target);
		},
		filterTarget(card, player, target) {
			return lib.filter.judge(card, player, target) && player === target;
		},
		selectTarget: [-1, -1],
		judge(card) {
			if (get.suit(card) === "club" && get.number(card) > 1 && get.number(card) < 10) {
				return -3;
			}
			return 1;
		},
		judge2(result) {
			if (result.bool === false) {
				return true;
			}
			return false;
		},
		fullskin: true,
		effect() {
			if (result.bool === false) {
				if (player.countCards("he") === 0) {
					player.loseHp();
				} else {
					player.discard(player.getCards("he").randomGets(3));
				}
				var players = get.players();
				for (var i = 0; i < players.length; i++) {
					var dist = get.distance(player, players[i]);
					if (dist <= 2 && player !== players[i]) {
						var cs = players[i].getCards("he");
						if (cs.length === 0) {
							players[i].loseHp();
						} else {
							players[i].discard(cs.randomGets(3 - Math.max(1, dist)));
						}
					}
				}
			} else {
				player.addJudgeNext(card);
			}
		},
		cancel() {
			player.addJudgeNext(card);
		},
		ai: {
			basic: {
				useful: 0,
				value: 0,
			},
			order: 1,
			result: {
				target(player, target) {
					return lib.card.shandian.ai.result.target(player, target);
				},
			},
		},
	},
};

for (let i in card) {
	card[i].image = "ext:杀海拾遗/image/card/" + i + ".png";
}

export default card;
