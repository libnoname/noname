import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	xicai: {
		preHidden: true,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return get.itemtype(event.cards) === "cards" && get.position(event.cards[0], true) === "o";
		},
		async content(event, trigger, player) {
			await player.gain(trigger.cards, "gain2");
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1];
					}
					if (get.tag(card, "damage")) {
						return [1, 0.55];
					}
				},
			},
		},
	},
	diyjianxiong: {
		mode: ["identity", "guozhan"],
		trigger: { global: "dieBefore" },
		filter(event, player) {
			if (_status.currentPhase !== player) {
				return false;
			}
			if (get.mode() === "identity") {
				return event.player !== game.zhu;
			}
			return get.mode() === "guozhan" && event.player.isFriendOf(player);
		},
		forced: true,
		async content() {
			game.broadcastAll(
				function (target, group) {
					if (get.mode() === "identity") {
						target.identity = group;
						target.showIdentity();
					} else {
						target.trueIdentity = lib.group
							.slice(0)
							.filter(i => group !== i)
							.randomGet();
					}
				},
				trigger.player,
				get.mode() === "identity" ? "fan" : player.getGuozhanGroup()
			);
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (!get.tag(card, "damage") || player === target || target.hp > 1 || target === game.zhu) {
						return;
					}
					if (get.mode() === "identity") {
						if (target.identity === "fan") {
							return;
						}
						let res = 3;
						/*const pid = player.identity;
						const tid = target.identity;
						if (pid === "zhu" && tid === "zhong") res += player.countCards("h");
						else if (pid.indexOf("Zhu") === 1 && pid[0] === tid[0] && tid.indexOf("Zhong") === 1) {
							res += player.countCards("h");
						}*/
						return [1, (get.attitude(player, target) > 0 ? 0.7 : 1) * res];
					} else if (get.mode() === "guozhan") {
						if (target.isFriendOf(player)) {
							return [1, 0.7 * player.countCards("h")];
						}
					}
				},
				player(card, player, target) {
					if (!get.tag(card, "damage") || player === target || target.hp > 1 || target === game.zhu) {
						return;
					}
					if (get.mode() === "identity") {
						if (target.identity === "fan") {
							return;
						}
						let res = 3;
						/*const pid = player.identity;
						const tid = target.identity;
						if (pid === "zhu" && tid === "zhong") res += player.countCards("h");
						else if (pid.indexOf("Zhu") === 1 && pid[0] === tid[0] && tid.indexOf("Zhong") === 1) {
							res += player.countCards("h");
						}*/
						return [1, (get.attitude(player, target) > 0 ? 0.7 : 1) * res];
					} else if (get.mode() === "guozhan") {
						if (target.isFriendOf(player)) {
							return [1, 0.7 * player.countCards("h")];
						}
					}
				},
			},
		},
	},
	diykuanggu: {
		trigger: { source: "damageEnd" },
		filter(event, player) {
			if (player.isHealthy()) {
				return get.distance(trigger.player, player, "attack") > 1;
			}
			return true;
		},
		getIndex(event, player, triggername) {
			return event.num;
		},
		forced: true,
		async content(event, trigger, player) {
			if (get.distance(trigger.player, player, "attack") > 1) {
				await player.draw();
			} else {
				await player.recover();
			}
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (!target || !get.tag(card, "damage")) {
						return;
					}
					if (get.distance(target, player, "attack") > 1) {
						return [1, 0.6];
					}
					if (player.isDamaged()) {
						return [1, 1.5];
					}
				},
			},
		},
	},
	xiongzi: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		content() {
			trigger.num += 1 + Math.floor(player.countCards("e") / 2);
		},
	},
	yaliang: {
		audio: "wangxi",
		trigger: { player: "damageEnd", source: "damageSource" },
		getIndex: event => event.num,
		filter(event) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.num && event.source?.isIn() && event.player?.isIn() && event.source !== event.player;
		},
		check(event, player) {
			if (player.isPhaseUsing()) {
				return true;
			}
			if (event.player === player) {
				return get.attitude(player, event.source) > -3;
			}
			return get.attitude(player, event.player) > -3;
		},
		logTarget(event, player) {
			if (event.player === player) {
				return event.source;
			}
			return event.player;
		},
		preHidden: true,
		async content(event, trigger, player) {
			await game.asyncDraw([trigger.player, trigger.source].sortBySeat());
		},
		ai: {
			maixie: true,
			maixie_hp: true,
		},
	},
	diy_jiaoxia: {
		trigger: { target: "useCardToBegin" },
		filter(event, player) {
			return event.card && get.color(event.card) === "red";
		},
		frequent: true,
		content() {
			player.draw();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.color(card) === "red") {
						return [1, 1];
					}
				},
			},
		},
	},
	yiesheng: {
		enable: "phaseUse",
		filterCard: { color: "black" },
		filter(event, player) {
			return player.countCards("h", { color: "black" }) > 0;
		},
		selectCard: [1, Infinity],
		prompt: "弃置任意张黑色手牌并摸等量的牌",
		check(card) {
			return 5 - get.value(card);
		},
		content() {
			player.draw(cards.length);
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	guihan: {
		enable: "chooseToUse",
		skillAnimation: "epic",
		limited: true,
		filter(event, player) {
			if (event.type !== "dying") {
				return false;
			}
			if (player !== event.dying) {
				return false;
			}
			return true;
		},
		filterTarget(card, player, target) {
			return target.hasSex("male") && player !== target;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.recover();
			"step 1";
			player.draw(2);
			"step 2";
			target.recover();
			"step 3";
			target.draw(2);
		},
		ai: {
			order: 3,
			skillTagFilter(player) {
				if (player.storage.guihan) {
					return false;
				}
				if (player.hp > 0) {
					return false;
				}
			},
			save: true,
			result: {
				player: 4,
				target(player, target) {
					if (target.hp === target.maxHp) {
						return 2;
					}
					return 4;
				},
			},
			threaten(player, target) {
				if (!target.storage.guihan) {
					return 0.8;
				}
			},
		},
	},
	luweiyan: {
		enable: "phaseUse",
		usable: 1,
		filterCard(card) {
			return get.type(card) !== "basic";
		},
		position: "hse",
		filter(event, player) {
			return player.hasCard(function (card) {
				return get.type(card) !== "basic";
			}, "hes");
		},
		viewAs: { name: "shuigong" },
		prompt: "将一张非基本牌当【水攻】使用",
		check(card) {
			return 8 - get.value(card);
		},
		group: "luweiyan2",
	},
	luweiyan2: {
		trigger: { player: "useCardAfter" },
		direct: true,
		sourceSkill: "luweiyan",
		filter(event, player) {
			if (event.skill !== "luweiyan") {
				return false;
			}
			for (var i = 0; i < event.targets.length; i++) {
				if (player.canUse("sha", event.targets[i], false)) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			player
				.chooseTarget("是否视为使用一张杀？", function (card, player, target) {
					return _status.event.targets.includes(target) && player.canUse("sha", target, false);
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, { name: "sha" }, player, player);
				})
				.set("targets", trigger.targets);
			"step 1";
			if (result.bool) {
				player.useCard({ name: "sha" }, result.targets, false);
			}
		},
	},
	jieyan: {
		enable: "phaseUse",
		filter(event, player) {
			return player.hasCard(card => get.color(card) === "red", "h");
		},
		filterCard(card, player) {
			return get.color(card) === "red";
		},
		filterTarget: true,
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			for (const target of targets) {
				await target.damage("fire", "nocard");
			}
		},
	},
	honglian: {
		trigger: { player: "damageEnd" },
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		filter(event, player) {
			return event.source && event.source !== player && event.source.countCards("he", { color: "red" }) > 0;
		},
		content() {
			trigger.source.discard(trigger.source.getCards("he", { color: "red" }));
		},
		ai: {
			expose: 0.1,
			result: {
				threaten: 0.8,
				target(card, player, target) {
					if (get.tag(card, "damage") && get.attitude(target, player) < 0) {
						return [1, 0, 0, -player.countCards("he", { color: "red" })];
					}
				},
			},
		},
	},
	diyguhuo: {
		trigger: { player: "phaseBegin" },
		forced: true,
		filter(event, player) {
			return player.countCards("hej") > 0;
		},
		content() {
			"step 0";
			player.draw(2);
			"step 1";
			var next = player.discardPlayerCard(player, "hej", 2, true);
			next.ai = function (button) {
				if (get.position(button.link) === "j") {
					return 10;
				}
				return -get.value(button.link);
			};
			next.filterButton = function (button) {
				return lib.filter.cardDiscardable(button.link, player);
			};
		},
		ai: {
			effect: {
				target_use(card) {
					if (get.type(card) === "delay") {
						return [0, 0.5];
					}
				},
			},
		},
	},
	diychanyuan: {
		trigger: { player: "dieBegin" },
		forced: true,
		filter(event) {
			return event.source !== undefined;
		},
		content() {
			trigger.source.loseMaxHp(true);
		},
		ai: {
			threaten(player, target) {
				if (target.hp === 1) {
					return 0.2;
				}
			},
			result: {
				target(card, player, target, current) {
					if (target.hp <= 1 && get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -5];
						}
						return [1, 0, 0, -2];
					}
				},
			},
		},
	},
	zonghuo: {
		trigger: { source: "damageBefore" },
		direct: true,
		priority: 10,
		filter(event) {
			return event.nature !== "fire";
		},
		content() {
			"step 0";
			player.chooseToDiscard(get.prompt("zonghuo")).ai = function (card) {
				var att = get.attitude(player, trigger.player);
				if (trigger.player.hasSkillTag("nofire")) {
					if (att > 0) {
						return 8 - get.value(card);
					}
					return -1;
				}
				if (att < 0) {
					return 7 - get.value(card);
				}
				return -1;
			};
			"step 1";
			if (result.bool) {
				player.logSkill("zonghuo", trigger.player, "fire");
				trigger.nature = "fire";
			}
		},
	},
	shaoying: {
		trigger: { source: "damageAfter" },
		direct: true,
		filter(event) {
			return event.nature === "fire";
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("shaoying"), function (card, player, target) {
				return get.distance(trigger.player, target) <= 1 && trigger.player !== target;
			}).ai = function (target) {
				return get.damageEffect(target, player, player, "fire");
			};
			"step 1";
			if (result.bool) {
				var card = get.cards()[0];
				card.discard();
				player.showCards(card);
				event.bool = get.color(card) === "red";
				event.target = result.targets[0];
				player.logSkill("shaoying", event.target, false);
				trigger.player.line(event.target, "fire");
			} else {
				event.finish();
			}
			"step 2";
			if (event.bool) {
				event.target.damage("fire");
			}
		},
	},
	xinfu_qiaosi: {
		audio: "qiaosi",
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			if (get.isLuckyStar(player)) {
				event.num = 6;
				player.throwDice(6);
			} else {
				player.throwDice();
			}
			"step 1";
			event.cards = get.cards(event.num);
			player.showCards(event.cards);
			"step 2";
			player.gain(event.cards, "gain2");
			player
				.chooseControl()
				.set("choiceList", ["将" + get.cnNumber(event.num) + "张牌交给一名其他角色", "弃置" + get.cnNumber(event.num) + "张牌"])
				.set("ai", function () {
					if (
						game.hasPlayer(function (current) {
							return current !== player && get.attitude(player, current) > 2;
						})
					) {
						return 0;
					}
					return 1;
				});
			"step 3";
			if (result.index === 0) {
				player.chooseCardTarget({
					position: "he",
					filterCard: true,
					selectCard: event.num,
					filterTarget(card, player, target) {
						return player !== target;
					},
					ai1(card) {
						return 1;
					},
					ai2(target) {
						var att = get.attitude(_status.event.player, target);
						return att;
					},
					prompt: "请选择要送人的卡牌",
					forced: true,
				});
			} else {
				player.chooseToDiscard(event.num, true, "he");
				event.finish();
			}
			"step 4";
			if (result.bool) {
				var target = result.targets[0];
				player.give(result.cards, target);
			}
		},
		ai: {
			order: 7.5,
			result: {
				player: 1,
			},
		},
	},
};

export default skills;
