import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const card = {
	luyugeng: {
		fullskin: true,
		type: "food",
		enable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("luyugeng");
		},
		//range:{global:1},
		content() {
			target.$gain2(cards);
			target.storage.luyugeng = card;
			target.storage.luyugeng_markcount = 3;
			target.addSkill("luyugeng");
		},
		ai: {
			order: 2,
			value: 4,
			result: {
				target: 1,
			},
		},
	},
	jinlianzhu: {
		type: "trick",
		fullskin: true,
		filterTarget: true,
		global: "g_jinlianzhu",
		content() {
			var evt = event.getParent(3)._trigger;
			evt.cancel();
			if (evt.source) {
				evt.source.draw();
			}
		},
		ai: {
			order: 1,
			value: [5, 1],
			useful: [6, 1],
			result: {
				target(player, target) {
					var evt = _status.event.getTrigger();
					var eff = get.damageEffect(target, evt.source, target, evt.nature);
					if (eff > 0) {
						return -1;
					}
					if (eff < 0) {
						return 2;
					}
					return 0;
				},
			},
		},
	},
	chunbing: {
		fullskin: true,
		type: "food",
		enable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("chunbing");
		},
		//range:{global:1},
		content() {
			target.$gain2(cards);
			target.storage.chunbing = card;
			target.storage.chunbing_markcount = 5;
			target.addSkill("chunbing");
		},
		ai: {
			order: 2,
			value: 4,
			result: {
				target(player, target) {
					var num = target.needsToDiscard();
					if (num) {
						if (target === player && num > 1) {
							return num;
						}
						return Math.sqrt(num);
					}
					return 0;
				},
			},
		},
	},
	gudonggeng: {
		fullskin: true,
		type: "food",
		enable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("gudonggeng");
		},
		//range:{global:1},
		content() {
			target.$gain2(cards);
			target.storage.gudonggeng = card;
			target.storage.gudonggeng_markcount = 3;
			target.addSkill("gudonggeng");
		},
		ai: {
			order: 2,
			value: 4,
			result: {
				target(player, target) {
					if (player === target && !player.hasShan()) {
						return 2;
					}
					return 1 / Math.max(1, target.hp);
				},
			},
		},
	},
	liyutang: {
		fullskin: true,
		type: "food",
		enable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("liyutang");
		},
		//range:{global:1},
		content() {
			target.$gain2(cards);
			target.storage.liyutang = card;
			target.storage.liyutang_markcount = 2;
			target.addSkill("liyutang");
		},
		ai: {
			order: 2,
			value: 4,
			result: {
				target(player, target) {
					if (player === target && target.isMinHp()) {
						return 2;
					}
					if (target.isMinHp()) {
						return 1.5;
					}
					return 1 / Math.max(1, target.hp);
				},
			},
		},
	},
	mizhilianou: {
		fullskin: true,
		type: "food",
		enable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("mizhilianou");
		},
		//range:{global:1},
		content() {
			target.$gain2(cards);
			target.storage.mizhilianou = card;
			target.storage.mizhilianou_markcount = 4;
			target.addSkill("mizhilianou");
		},
		ai: {
			order: 2,
			value: 4,
			result: {
				target(player, target) {
					if (target === player) {
						if (target.countCards("he", { suit: "heart" })) {
							if (target.isDamaged()) {
								return 1.5;
							}
						} else {
							return 0.2;
						}
					} else if (target.isDamaged()) {
						return 1;
					}
					return 0.5;
				},
			},
		},
	},
	xiajiao: {
		fullskin: true,
		type: "food",
		enable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("xiajiao");
		},
		//range:{global:1},
		content() {
			target.$gain2(cards);
			target.storage.xiajiao = card;
			target.storage.xiajiao_markcount = 3;
			target.addSkill("xiajiao");
			target.addTempSkill("xiajiao3");
		},
		ai: {
			order: 2,
			value: 5,
			result: {
				target: 1,
			},
		},
	},
	tanhuadong: {
		fullskin: true,
		type: "food",
		enable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("tanhuadong");
		},
		//range:{global:1},
		content() {
			target.$gain2(cards);
			target.storage.tanhuadong = card;
			target.storage.tanhuadong_markcount = 3;
			target.addSkill("tanhuadong");
		},
		ai: {
			order: 2,
			value: 5,
			result: {
				target: 1,
			},
		},
	},
	mapodoufu: {
		fullskin: true,
		type: "food",
		enable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("mapodoufu");
		},
		//range:{global:1},
		content() {
			if (target === targets[0] && cards.length) {
				target.$gain2(cards);
			}
			target.storage.mapodoufu = card;
			target.storage.mapodoufu_markcount = 2;
			target.addSkill("mapodoufu");
		},
		ai: {
			order: 1,
			value: 5,
			result: {
				target(player, target) {
					return player === target ? 2 : 1;
				},
			},
		},
	},
	qingtuan: {
		fullskin: true,
		type: "food",
		enable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("qingtuan");
		},
		//range:{global:1},
		content() {
			target.$gain2(cards);
			target.storage.qingtuan = card;
			target.storage.qingtuan_markcount = 2;
			target.addSkill("qingtuan");
		},
		ai: {
			order: 4,
			value: 4,
			result: {
				target(player, target) {
					if (target === player) {
						if (target.hasSha()) {
							return 2;
						}
					} else {
						var nh = target.countCards("h");
						if (nh >= 3) {
							return 1;
						}
						if (target.hasSha()) {
							return 1;
						}
						if (nh && Math.random() < 0.5) {
							return 1;
						}
					}
					return player.needsToDiscard() ? 0.2 : 0;
				},
			},
		},
	},
	yougeng: {
		fullskin: true,
		type: "food",
		enable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("yougeng");
		},
		//range:{global:1},
		content() {
			target.$gain2(cards);
			target.storage.yougeng = card;
			target.storage.yougeng_markcount = 2;
			target.addSkill("yougeng");
		},
		ai: {
			order: 2,
			value: 4,
			result: {
				target(player, target) {
					if (target.isHealthy()) {
						return player.needsToDiscard() ? 0.1 : 0;
					}
					if (target.isMinHp()) {
						return 1.5;
					}
					return 1 / Math.max(1, target.hp);
				},
			},
		},
	},
	molicha: {
		fullskin: true,
		type: "food",
		enable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("molicha");
		},
		//range:{global:1},
		content() {
			target.$gain2(cards);
			target.storage.molicha = card;
			target.storage.molicha_markcount = 4;
			target.addSkill("molicha");
		},
		ai: {
			order: 2,
			value: 4,
			result: {
				target: 1,
			},
		},
	},
	yuanbaorou: {
		fullskin: true,
		type: "food",
		enable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("yuanbaorou");
		},
		//range:{global:1},
		content() {
			target.$gain2(cards);
			target.storage.yuanbaorou = card;
			target.storage.yuanbaorou_markcount = 4;
			target.addSkill("yuanbaorou");
		},
		ai: {
			order: 2,
			value: 4,
			result: {
				target(player, target) {
					if (target === player) {
						if (target.hasSha()) {
							return 2;
						}
					} else {
						var nh = target.countCards("h");
						if (nh >= 3) {
							return 1;
						}
						if (target.hasSha()) {
							return 1;
						}
						if (nh && Math.random() < 0.5) {
							return 1;
						}
					}
					return player.needsToDiscard() ? 0.2 : 0;
				},
			},
		},
	},
	heilonglinpian: {
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
			target.changeHujia();
			target.addTempSkill("heilonglinpian", { player: "phaseBegin" });
		},
		ai: {
			value: [6, 1],
			useful: 1,
			order: 2,
			result: {
				target: 1,
			},
		},
	},
	mutoumianju: {
		fullskin: true,
		type: "equip",
		subtype: "equip2",
		skills: ["mutoumianju_skill"],
		ai: { equipValue: 4 },
		onLose() {
			if (player.getStat().skill.mutoumianju_skill) {
				delete player.getStat().skill.mutoumianju_skill;
			}
		},
	},
	yuheng: { fullskin: true },
	gjyuheng: {
		fullskin: true,
		cardimage: "yuheng",
		type: "equip",
		subtype: "equip5",
		nopower: true,
		nomod: true,
		unique: true,
		skills: ["gjyuheng_skill"],
		ai: { equipValue: 6 },
		onLose() {
			if (player.getStat().skill.gjyuheng_skill) {
				delete player.getStat().skill.gjyuheng_skill;
			}
		},
	},
	gjyuheng_plus: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		nopower: true,
		unique: true,
		nomod: true,
		epic: true,
		cardimage: "yuheng",
		skills: ["gjyuheng_plus_skill"],
		ai: { equipValue: 7 },
		onLose() {
			if (player.getStat().skill.gjyuheng_plus_skill) {
				delete player.getStat().skill.gjyuheng_plus_skill;
			}
		},
	},
	gjyuheng_pro: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		nopower: true,
		unique: true,
		nomod: true,
		legend: true,
		cardimage: "yuheng",
		skills: ["gjyuheng_pro_skill"],
		ai: {
			equipValue: 8,
		},
	},
	shatang: {
		fullskin: true,
		type: "trick",
		enable: true,
		filterTarget: true,
		cardcolor: "red",
		cardnature: "fire",
		content() {
			"step 0";
			target.damage("fire");
			"step 1";
			target.changeHujia();
		},
		ai: {
			value: [4, 1],
			useful: 2,
			order: 2,
			result: {
				target(player, target) {
					if (target.hasSkillTag("nofire")) {
						return 1.5;
					}
					if (target.hasSkillTag("maixie_hp")) {
						return 0;
					}
					if (target.hp === 1) {
						return -1;
					}
					return -1 / Math.sqrt(target.hp + 1);
				},
			},
			tag: {
				damage: 1,
				fireDamage: 1,
				natureDamage: 1,
			},
		},
	},
	shujinsan: {
		fullskin: true,
		type: "trick",
		enable: true,
		filterTarget(card, player, target) {
			return target.countCards("he") > 0;
		},
		content() {
			"step 0";
			target.chooseToDiscard("he", [1, target.countCards("he")], "弃置任意张牌并摸等量的牌").ai = function (card) {
				return 6 - get.value(card);
			};
			"step 1";
			if (result.bool) {
				target.draw(result.cards.length);
			}
		},
		ai: {
			order: 1.5,
			value: [4, 1],
			tag: {
				norepeat: 1,
			},
			result: {
				target(player, target) {
					if (target === player) {
						var cards = player.getCards("he");
						var num = -1;
						for (var i = 0; i < cards.length; i++) {
							if (get.value(cards[i]) < 6) {
								num++;
							}
						}
						if (player.needsToDiscard() && num < 1) {
							num = 1;
						}
						return Math.max(0, num);
					} else {
						if (!player.needsToDiscard() && target.countCards("he") <= 3) {
							return 0;
						}
						return target.countCards("he") / 2;
					}
				},
			},
		},
	},
	dinvxuanshuang: {
		fullskin: true,
		type: "basic",
		savable: true,
		selectTarget: -1,
		content() {
			"step 0";
			target.recover();
			"step 1";
			if (target.isIn()) {
				target.chooseToDiscard([1, Infinity], "he", "弃置任意张牌并摸等量的牌");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				target.draw(result.cards.length);
			}
		},
		ai: {
			basic: {
				order: 6,
				useful: 10,
				value: [8, 6.5, 5, 4],
			},
			result: {
				target: 2,
			},
			tag: {
				recover: 1,
				save: 1,
			},
		},
	},
	ziyangdan: {
		fullskin: true,
		type: "basic",
		enable: true,
		filterTarget: true,
		content() {
			target.changeHujia(3);
			if (target.hasSkill("ziyangdan")) {
				target.storage.ziyangdan += 3;
			} else {
				target.addSkill("ziyangdan");
			}
		},
		ai: {
			order: 1.6,
			value: [7, 1],
			useful: 3,
			tag: {
				norepeat: 1,
			},
			result: {
				target(player, target) {
					if (target.hp > 2) {
						if (player.needsToDiscard()) {
							return 1 / target.hp;
						}
						return 0;
					}
					if (target.hp > 0) {
						return 2 / target.hp;
					}
					return 0;
				},
			},
		},
	},
	yunvyuanshen: {
		fullskin: true,
		type: "basic",
		enable: true,
		logv: false,
		filterTarget(card, player, target) {
			return !target.hasSkill("yunvyuanshen_skill");
		},
		async content(event, trigger, player) {
			let card = event.card,
				cards = event.cards;
			target.storage.yunvyuanshen_skill = game.createCard("yunvyuanshen");
			target.addSkill("yunvyuanshen_skill");
			if (cards && cards.length) {
				card = cards[0];
			}
			if (target === targets[0] && card.clone && (card.clone.parentNode === player.parentNode || card.clone.parentNode === ui.arena)) {
				card.clone.moveDelete(target);
				game.addVideo("gain2", target, get.cardsInfo([card]));
			}
		},
		ai: {
			basic: {
				// value: 9,
				useful: 4,
				value: 7,
			},
			order: 2,
			result: {
				target(player, target) {
					return 1 / Math.sqrt(1 + target.hp);
				},
			},
		},
	},
	bingpotong: {
		fullskin: true,
		type: "jiguan",
		enable: true,
		wuxieable: true,
		filterTarget(card, player, target) {
			return target.countCards("h") > 0;
		},
		selectTarget: [1, 3],
		content() {
			"step 0";
			if (target.countCards("h") === 0 || player.countCards("h") === 0) {
				event.finish();
				return;
			}
			player
				.chooseCard("请展示一张手牌", true)
				.set("ai", function () {
					var num = 0;
					var rand = _status.event.rand;
					if (get.color(card) === "red") {
						if (rand) {
							num -= 6;
						}
					} else {
						if (!rand) {
							num -= 6;
						}
					}
					var value = get.value(card);
					if (value >= 8) {
						return -100;
					}
					return num - value;
				})
				.set("rand", Math.random() < 0.5).prompt2 = "若与" + get.translation(target) + "展示的牌相同，你弃置展示的牌，" + get.translation(target) + "失去1点体力";
			"step 1";
			event.card1 = result.cards[0];
			target
				.chooseCard("请展示一张手牌", true)
				.set("ai", function (card) {
					var num = 0;
					var rand = _status.event.rand;
					if (get.color(card) === "red") {
						if (rand) {
							num -= 6;
						}
					} else {
						if (!rand) {
							num -= 6;
						}
					}
					var value = get.value(card);
					if (value >= 8) {
						return -100;
					}
					return num - value;
				})
				.set("rand", Math.random() < 0.5).prompt2 = "若与" + get.translation(player) + "展示的牌相同，" + get.translation(player) + "弃置展示的牌，你失去1点体力";
			"step 2";
			event.card2 = result.cards[0];
			ui.arena.classList.add("thrownhighlight");
			game.addVideo("thrownhighlight1");
			player.$compare(event.card1, target, event.card2);
			game.delay(4);
			"step 3";
			game.log(player, "展示了", event.card1);
			game.log(target, "展示了", event.card2);
			if (get.color(event.card2) === get.color(event.card1)) {
				player.discard(event.card1).animate = false;
				target.$gain2(event.card2);
				var clone = event.card1.clone;
				if (clone) {
					clone.style.transition = "all 0.5s";
					clone.style.transform = "scale(1.2)";
					clone.delete();
					game.addVideo("deletenode", player, get.cardsInfo([clone]));
				}
				target.loseHp();
				event.finish();
				event.parent.cancelled = true;
			} else {
				player.$gain2(event.card1);
				target.$gain2(event.card2);
				game.delay();
			}
			ui.arena.classList.remove("thrownhighlight");
			game.addVideo("thrownhighlight2");
		},
		ai: {
			basic: {
				order: 2,
				value: [5, 1],
				useful: 1,
			},
			result: {
				player(player, target) {
					if (player.countCards("h") <= Math.min(5, Math.max(2, player.hp)) && _status.event.name === "chooseToUse") {
						if (typeof _status.event.filterCard === "function" && _status.event.filterCard(new lib.element.VCard({ name: "bingpotong" }))) {
							return -10;
						}
						if (_status.event.skill) {
							var viewAs = get.info(_status.event.skill).viewAs;
							if (viewAs === "bingpotong") {
								return -10;
							}
							if (viewAs && viewAs.name === "bingpotong") {
								return -10;
							}
						}
					}
					return 0;
				},
				target(player, target) {
					if (player.countCards("h") <= 1) {
						return 0;
					}
					return -1.5;
				},
			},
			tag: {
				loseHp: 1,
			},
		},
	},
	feibiao: {
		type: "jiguan",
		enable: true,
		fullskin: true,
		wuxieable: true,
		outrange: { globalFrom: 2 },
		filterTarget(card, player, target) {
			return target !== player;
		},
		content() {
			"step 0";
			if (!target.countCards("h", { color: "black" })) {
				target.loseHp();
				event.finish();
			} else {
				target.chooseToDiscard({ color: "black" }, "弃置一张黑色手牌或受失去1点体力").ai = function (card) {
					return 8 - get.value(card);
				};
			}
			"step 1";
			if (!result.bool) {
				target.loseHp();
			}
		},
		ai: {
			basic: {
				order: 9,
				value: 3,
				useful: 1,
			},
			result: {
				target: -2,
			},
			tag: {
				discard: 1,
				loseHp: 1,
			},
		},
	},
	longxugou: {
		type: "jiguan",
		enable: true,
		fullskin: true,
		wuxieable: true,
		filterTarget(card, player, target) {
			return target !== player && target.countGainableCards(player, "e");
		},
		content() {
			"step 0";
			var es = target.getGainableCards(player, "e");
			if (es.length) {
				player
					.choosePlayerCard("e", target, true)
					.set("es", es)
					.set("filterButton", function (button) {
						return _status.event.es.includes(button.link);
					});
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				target.$give(result.links[0], player);
				target.lose(result.links[0], ui.special);
				event.card = result.links[0];
				game.delay();
			} else {
				event.finish();
			}
			"step 2";
			if (event.card && get.position(event.card) === "s") {
				player.equip(event.card);
			}
		},
		ai: {
			basic: {
				order: 9,
				value: 6,
				useful: 4,
			},
			result: {
				target: -1,
			},
			tag: {
				loseCard: 1,
				gain: 1,
			},
		},
	},
	qiankunbiao: {
		type: "jiguan",
		enable: true,
		fullskin: true,
		wuxieable: true,
		filterTarget(card, player, target) {
			return target !== player && target.countCards("he") > 0;
		},
		changeTarget(player, targets) {
			game.filterPlayer(function (current) {
				return get.distance(targets[0], current, "pure") === 1 && current.countCards("he");
			}, targets);
		},
		content() {
			var he = target.getCards("he");
			if (he.length) {
				target.discard(he.randomGet()).delay = false;
			}
		},
		contentAfter() {
			game.delay(0.5);
		},
		ai: {
			order: 7,
			tag: {
				loseCard: 1,
				discard: 1,
			},
			wuxie() {
				return 0;
			},
			result: {
				target: -1,
			},
		},
	},
	shenhuofeiya: {
		type: "jiguan",
		enable: true,
		fullskin: true,
		wuxieable: true,
		filterTarget(card, player, target) {
			return target !== player;
		},
		changeTarget(player, targets) {
			game.filterPlayer(function (current) {
				return get.distance(targets[0], current, "pure") === 1;
			}, targets);
		},
		cardcolor: "red",
		cardnature: "fire",
		content() {
			"step 0";
			var next = target.chooseToRespond({ name: "shan" });
			next.ai = function (card) {
				if (get.damageEffect(target, player, target, "fire") >= 0) {
					return 0;
				}
				if (player.hasSkillTag("notricksource")) {
					return 0;
				}
				if (target.hasSkillTag("notrick")) {
					return 0;
				}
				if (target.hasSkillTag("noShan")) {
					return -1;
				}
				return 11 - get.value(card);
			};
			next.set("respondTo", [player, card]);
			next.autochoose = lib.filter.autoRespondShan;
			"step 1";
			if (result.bool === false) {
				target.damage("fire");
			}
		},
		ai: {
			wuxie(target, card, player, viewer) {
				if (get.attitude(viewer, target) > 0 && target.countCards("h", "shan")) {
					if (!target.countCards("h") || target.hp === 1 || Math.random() < 0.7) {
						return 0;
					}
				}
				if (get.attitude(viewer, target) <= 0) {
					return 0;
				}
			},
			order: 7,
			tag: {
				respond: 1,
				respondShan: 1,
				damage: 1,
				natureDamage: 1,
				fireDamage: 1,
				multitarget: 1,
				multineg: 1,
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nofire")) {
						return 0;
					}
					if (player.hasUnknown(2)) {
						return 0;
					}
					var nh = target.countCards("h");
					if (lib.config.mode === "identity") {
						if (target.isZhu && nh <= 2 && target.hp <= 1) {
							return -100;
						}
					}
					if (nh === 0) {
						return -2;
					}
					if (nh === 1) {
						return -1.7;
					}
					return -1.5;
				},
			},
		},
	},
	mianlijinzhen: {
		type: "jiguan",
		enable: true,
		fullskin: true,
		filterTarget(card, player, target) {
			return target.hp >= player.hp;
		},
		content() {
			"step 0";
			target.draw();
			"step 1";
			target.loseHp();
		},
		ai: {
			order: 2,
			value: [5, 1],
			useful: [4, 1],
			result: {
				target: -1.5,
			},
			tag: {
				// damage:1
			},
		},
	},
	liutouge: {
		type: "jiguan",
		enable: true,
		fullskin: true,
		filterTarget: true,
		wuxieable: true,
		content() {
			if (player.getEnemies().includes(target)) {
				target.getDebuff();
			} else {
				target.getBuff();
			}
		},
		ai: {
			order: 4,
			value: 5,
			result: {
				player(player, target) {
					if (get.attitude(player, target) === 0) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	liufengsan: {
		type: "trick",
		enable: true,
		fullskin: true,
		filterTarget: true,
		content() {
			var list = [];
			for (var i = 0; i < 2; i++) {
				list.push(game.createCard("shan"));
			}
			target.gain(list, "gain2");
		},
		ai: {
			order: 4.5,
			value: [5, 1],
			tag: {
				gain: 1,
				norepeat: 1,
			},
			result: {
				target(player, target) {
					if (target === player) {
						if (!target.hasShan("all")) {
							return 2;
						}
						var num = target.needsToDiscard(2);
						if (num === 0) {
							return 1.5;
						}
						if (num === 1) {
							return 1;
						}
						return 0.5;
					} else {
						switch (target.countCards("h")) {
							case 0:
								return 2;
							case 1:
								return 1.5;
							case 2:
								return 1;
							default:
								return 0.5;
						}
					}
				},
			},
		},
	},
	shihuifen: {
		type: "trick",
		fullskin: true,
		filterTarget: true,
		global: "g_shihuifen",
		content() {
			"step 0";
			if (!_status.currentPhase?.isIn()) {
				return;
			}
			var next = _status.currentPhase.chooseToRespond({ name: "shan" });
			next.set("respondTo", [player, card]);
			next.set("prompt2", "否则本回合无法对其他角色使用卡牌");
			"step 1";
			if (!result.bool) {
				_status.currentPhase.addTempSkill("shihuifen", "phaseUseAfter");
			}
		},
		ai: {
			order: 1,
			value: [5, 1],
			useful: [5, 1],
			tag: {
				respond: 1,
				respondShan: 1,
			},
			result: {
				target(player, target) {
					if (target.countCards("h") >= 3 || target.needsToDiscard()) {
						return -1.5;
					}
					return 0;
				},
			},
		},
	},
};

for (let i in card) {
	if (!card[i].cardimage) {
		card[i].image = "ext:杀海拾遗/image/card/" + i + ".png";
	}
}

export default card;
