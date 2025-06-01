import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "gujian",
		card: {
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
								if (target == player && num > 1) {
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
							if (player == target && !player.hasShan()) {
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
							if (player == target && target.isMinHp()) {
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
							if (target == player) {
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
					if (target == targets[0] && cards.length) {
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
							return player == target ? 2 : 1;
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
							if (target == player) {
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
							if (target == player) {
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
					return target == player;
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
							if (target.hp == 1) {
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
							if (target == player) {
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
				content() {
					target.storage.yunvyuanshen_skill = game.createCard("yunvyuanshen");
					target.addSkill("yunvyuanshen_skill");
					if (cards && cards.length) {
						card = cards[0];
					}
					if (target == targets[0] && card.clone && (card.clone.parentNode == player.parentNode || card.clone.parentNode == ui.arena)) {
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
					if (target.countCards("h") == 0 || player.countCards("h") == 0) {
						event.finish();
						return;
					}
					player
						.chooseCard("请展示一张手牌", true)
						.set("ai", function () {
							var num = 0;
							var rand = _status.event.rand;
							if (get.color(card) == "red") {
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
							if (get.color(card) == "red") {
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
					if (get.color(event.card2) == get.color(event.card1)) {
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
							if (player.countCards("h") <= Math.min(5, Math.max(2, player.hp)) && _status.event.name == "chooseToUse") {
								if (typeof _status.event.filterCard == "function" && _status.event.filterCard(new lib.element.VCard({ name: "bingpotong" }))) {
									return -10;
								}
								if (_status.event.skill) {
									var viewAs = get.info(_status.event.skill).viewAs;
									if (viewAs == "bingpotong") {
										return -10;
									}
									if (viewAs && viewAs.name == "bingpotong") {
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
					return target != player;
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
					return target != player && target.countGainableCards(player, "e");
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
					if (event.card && get.position(event.card) == "s") {
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
					return target != player && target.countCards("he") > 0;
				},
				changeTarget(player, targets) {
					game.filterPlayer(function (current) {
						return get.distance(targets[0], current, "pure") == 1 && current.countCards("he");
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
					return target != player;
				},
				changeTarget(player, targets) {
					game.filterPlayer(function (current) {
						return get.distance(targets[0], current, "pure") == 1;
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
					if (result.bool == false) {
						target.damage("fire");
					}
				},
				ai: {
					wuxie(target, card, player, viewer) {
						if (get.attitude(viewer, target) > 0 && target.countCards("h", "shan")) {
							if (!target.countCards("h") || target.hp == 1 || Math.random() < 0.7) {
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
							if (lib.config.mode == "identity") {
								if (target.isZhu && nh <= 2 && target.hp <= 1) {
									return -100;
								}
							}
							if (nh == 0) {
								return -2;
							}
							if (nh == 1) {
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
			// longxugou:{
			//     type:'jiguan',
			// 	enable:true,
			// 	fullskin:true,
			// },
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
							if (get.attitude(player, target) == 0) {
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
							if (target == player) {
								if (!target.hasShan("all")) {
									return 2;
								}
								var num = target.needsToDiscard(2);
								if (num == 0) {
									return 1.5;
								}
								if (num == 1) {
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
		},
		skill: {
			ziyangdan: {
				trigger: { player: "phaseBegin" },
				silent: true,
				init(player) {
					player.storage.ziyangdan = 3;
				},
				onremove: true,
				content() {
					if (player.hujia > 0) {
						player.changeHujia(-1);
					}
					player.storage.ziyangdan--;
					if (player.hujia == 0 || player.storage.ziyangdan == 0) {
						player.removeSkill("ziyangdan");
					}
				},
				ai: {
					threaten: 0.8,
				},
			},
			luyugeng: {
				mark: "card",
				enable: "phaseUse",
				usable: 1,
				nopop: true,
				filterCard: { type: "basic" },
				filter(event, player) {
					return player.countCards("h", { type: "basic" });
				},
				intro: {
					content(storage, player) {
						return "出牌阶段限一次，你可以弃置一张基本牌并发现一张牌，持续三回合（剩余" + player.storage.luyugeng_markcount + "回合）";
					},
				},
				content() {
					player.discoverCard();
				},
				group: "luyugeng_count",
				subSkill: {
					count: {
						trigger: { player: "phaseAfter" },
						forced: true,
						popup: false,
						content() {
							player.storage.luyugeng_markcount--;
							if (player.storage.luyugeng_markcount == 0) {
								delete player.storage.luyugeng;
								delete player.storage.luyugeng_markcount;
								player.removeSkill("luyugeng");
							} else {
								player.updateMarks();
							}
						},
					},
				},
			},
			xiajiao: {
				mark: "card",
				trigger: { player: ["phaseUseBefore", "phaseEnd"] },
				forced: true,
				popup: false,
				nopop: true,
				filter(event, player) {
					return !player.hasSkill("xiajiao3");
				},
				intro: {
					content(storage, player) {
						return "你在摸牌阶段额外摸一张牌，然后弃置一张牌（剩余" + player.storage.xiajiao_markcount + "回合）";
					},
				},
				content() {
					player.storage.xiajiao_markcount--;
					if (player.storage.xiajiao_markcount == 0) {
						delete player.storage.xiajiao;
						delete player.storage.xiajiao_markcount;
						player.removeSkill("xiajiao");
					} else {
						player.updateMarks();
					}
					player.addTempSkill("xiajiao3");
				},
				group: "xiajiao_draw",
				subSkill: {
					draw: {
						trigger: { player: "phaseDrawBegin" },
						forced: true,
						content() {
							trigger.num++;
							player.addTempSkill("xiajiao2");
						},
					},
				},
			},
			xiajiao2: {
				trigger: { player: "phaseDrawAfter" },
				silent: true,
				content() {
					player.chooseToDiscard("he", true);
				},
			},
			xiajiao3: {},
			mizhilianou: {
				mark: "card",
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				nopop: true,
				intro: {
					content(storage, player) {
						return "你可以将一张红桃牌当作桃使用（剩余" + player.storage.mizhilianou_markcount + "回合）";
					},
				},
				content() {
					player.storage.mizhilianou_markcount--;
					if (player.storage.mizhilianou_markcount == 0) {
						delete player.storage.mizhilianou;
						delete player.storage.mizhilianou_markcount;
						player.removeSkill("mizhilianou");
					} else {
						player.updateMarks();
					}
				},
				group: "mizhilianou_use",
				subSkill: {
					use: {
						enable: "chooseToUse",
						filterCard: { suit: "heart" },
						position: "he",
						viewAs: { name: "tao" },
						viewAsFilter(player) {
							return player.countCards("he", { suit: "heart" }) > 0;
						},
						prompt: "将一张红桃牌当桃使用",
						check(card) {
							return 10 - get.value(card);
						},
						ai: {
							skillTagFilter(player) {
								return player.countCards("he", { suit: "heart" }) > 0;
							},
							save: true,
							respondTao: true,
						},
					},
				},
			},
			chunbing: {
				mark: "card",
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				nopop: true,
				intro: {
					content(storage, player) {
						return "你的手牌上限+1（剩余" + player.storage.chunbing_markcount + "回合）";
					},
				},
				mod: {
					maxHandcard(player, num) {
						return num + 1;
					},
				},
				content() {
					player.storage.chunbing_markcount--;
					if (player.storage.chunbing_markcount == 0) {
						delete player.storage.chunbing;
						delete player.storage.chunbing_markcount;
						player.removeSkill("chunbing");
					} else {
						player.updateMarks();
					}
				},
			},
			gudonggeng: {
				mark: "card",
				trigger: { player: "phaseBegin" },
				forced: true,
				popup: false,
				nopop: true,
				intro: {
					content(storage, player) {
						return "当你下一次受到杀造成的伤害时，令伤害-1（剩余" + player.storage.gudonggeng_markcount + "回合）";
					},
				},
				content() {
					player.storage.gudonggeng_markcount--;
					if (player.storage.gudonggeng_markcount == 0) {
						delete player.storage.gudonggeng;
						delete player.storage.gudonggeng_markcount;
						player.removeSkill("gudonggeng");
					} else {
						player.updateMarks();
					}
				},
				group: "gudonggeng_damage",
				subSkill: {
					damage: {
						trigger: { player: "damageBegin" },
						filter(event, player) {
							return event.card && event.card.name == "sha" && event.num > 0;
						},
						forced: true,
						content() {
							trigger.num--;
							delete player.storage.gudonggeng;
							delete player.storage.gudonggeng_markcount;
							player.removeSkill("gudonggeng");
						},
					},
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (card.name == "sha" && get.attitude(player, target) < 0) {
								return 0.5;
							}
						},
					},
				},
			},
			qingtuan: {
				mark: "card",
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				nopop: true,
				intro: {
					content(storage, player) {
						return "你在回合内使用首张杀时摸一张牌（剩余" + player.storage.qingtuan_markcount + "回合）";
					},
				},
				content() {
					player.storage.qingtuan_markcount--;
					if (player.storage.qingtuan_markcount == 0) {
						delete player.storage.qingtuan;
						delete player.storage.qingtuan_markcount;
						player.removeSkill("qingtuan");
					} else {
						player.updateMarks();
					}
				},
				group: "qingtuan_draw",
				subSkill: {
					draw: {
						trigger: { player: "useCard" },
						filter(event, player) {
							return event.card.name == "sha" && _status.currentPhase == player;
						},
						usable: 1,
						forced: true,
						content() {
							player.draw();
						},
					},
				},
			},
			liyutang: {
				mark: "card",
				trigger: { player: "phaseEnd" },
				forced: true,
				popup: false,
				nopop: true,
				intro: {
					content(storage, player) {
						return "结束阶段，若你的体力值为全场最少或之一，你获得1点护甲（剩余" + player.storage.liyutang_markcount + "回合）";
					},
				},
				content() {
					if (player.isMinHp()) {
						player.logSkill("liyutang");
						player.changeHujia();
					}
					player.storage.liyutang_markcount--;
					if (player.storage.liyutang_markcount == 0) {
						delete player.storage.liyutang;
						delete player.storage.liyutang_markcount;
						player.removeSkill("liyutang");
					} else {
						player.updateMarks();
					}
				},
			},
			yougeng: {
				mark: "card",
				trigger: { player: "phaseBegin" },
				forced: true,
				popup: false,
				nopop: true,
				intro: {
					content(storage, player) {
						return "准备阶段，若你的体力值为全场最少或之一，你回复1点体力（剩余" + player.storage.yougeng_markcount + "回合）";
					},
				},
				content() {
					if (player.isDamaged() && player.isMinHp()) {
						player.logSkill("yougeng");
						player.recover();
					}
					player.storage.yougeng_markcount--;
					if (player.storage.yougeng_markcount == 0) {
						delete player.storage.yougeng;
						delete player.storage.yougeng_markcount;
						player.removeSkill("yougeng");
					} else {
						player.updateMarks();
					}
				},
			},
			molicha: {
				mark: "card",
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				nopop: true,
				intro: {
					content(storage, player) {
						return "你不能成为其他角色的黑色牌的目标（剩余" + player.storage.molicha_markcount + "回合）";
					},
				},
				mod: {
					targetEnabled(card, player, target) {
						if (player != target && get.color(card) == "black") {
							return false;
						}
					},
				},
				content() {
					player.storage.molicha_markcount--;
					if (player.storage.molicha_markcount == 0) {
						delete player.storage.molicha;
						delete player.storage.molicha_markcount;
						player.removeSkill("molicha");
						player.logSkill("molicha");
					} else {
						player.updateMarks();
					}
				},
			},
			yuanbaorou: {
				mark: "card",
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				nopop: true,
				intro: {
					content(storage, player) {
						return "你在出牌阶段可以额外使用一张杀（剩余" + player.storage.yuanbaorou_markcount + "回合）";
					},
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + 1;
						}
					},
				},
				content() {
					player.storage.yuanbaorou_markcount--;
					if (player.storage.yuanbaorou_markcount == 0) {
						delete player.storage.yuanbaorou;
						delete player.storage.yuanbaorou_markcount;
						player.removeSkill("yuanbaorou");
					} else {
						player.updateMarks();
					}
				},
			},
			tanhuadong: {
				mark: "card",
				trigger: { player: "phaseEnd" },
				forced: true,
				popup: false,
				nopop: true,
				intro: {
					content(storage, player) {
						return "出牌阶段结束时，你摸一张牌（剩余" + player.storage.tanhuadong_markcount + "回合）";
					},
				},
				content() {
					player.storage.tanhuadong_markcount--;
					if (player.storage.tanhuadong_markcount == 0) {
						delete player.storage.tanhuadong;
						delete player.storage.tanhuadong_markcount;
						player.removeSkill("tanhuadong");
					} else {
						player.updateMarks();
					}
				},
				group: "tanhuadong_draw",
				subSkill: {
					draw: {
						trigger: { player: "phaseUseEnd" },
						forced: true,
						content() {
							player.draw();
						},
					},
				},
			},
			mapodoufu: {
				mark: "card",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				popup: false,
				nopop: true,
				forceLoad: true,
				intro: {
					content(storage, player) {
						return "结束阶段，你随机弃置一名随机敌人的一张随机牌（剩余" + player.storage.mapodoufu_markcount + "回合）";
					},
				},
				content() {
					var list = player.getEnemies();
					for (var i = 0; i < list.length; i++) {
						if (!list[i].countCards("he")) {
							list.splice(i--, 1);
						}
					}
					var target = list.randomGet();
					if (target) {
						player.logSkill("mapodoufu", target);
						target.discard(target.getCards("he").randomGet());
						target.addExpose(0.2);
					}
					player.storage.mapodoufu_markcount--;
					if (player.storage.mapodoufu_markcount == 0) {
						delete player.storage.mapodoufu;
						delete player.storage.mapodoufu_markcount;
						player.removeSkill("mapodoufu");
					} else {
						player.updateMarks();
					}
				},
			},
			yunvyuanshen_skill: {
				mark: "card",
				intro: {
					content: "下一进入濒死状态时回复1点体力",
				},
				trigger: { player: "dying" },
				forced: true,
				priority: 6.1,
				onremove: true,
				filter(event, player) {
					return player.hp <= 0;
				},
				content() {
					player.recover();
					player.removeSkill("yunvyuanshen_skill");
				},
			},
			heilonglinpian: {
				mark: true,
				marktext: "鳞",
				intro: {
					content: "防御距离+1",
				},
				mod: {
					globalTo(from, to, distance) {
						return distance + 1;
					},
				},
			},
			mutoumianju_skill: {
				equipSkill: true,
				enable: "chooseToUse",
				filterCard: true,
				usable: 1,
				viewAs: { name: "sha" },
				viewAsFilter(player) {
					if (!player.countCards("h")) {
						return false;
					}
				},
				prompt: "将一张手牌当杀使用",
				check(card) {
					return 5 - get.value(card);
				},
				ai: {
					respondSha: true,
					order() {
						return get.order({ name: "sha" }) + 0.1;
					},
					skillTagFilter(player, tag, arg) {
						if (arg != "use") {
							return false;
						}
						if (!player.countCards("h")) {
							return false;
						}
					},
				},
			},
			gjyuheng_skill: {
				equipSkill: true,
				enable: "phaseUse",
				usable: 1,
				filterCard: { suit: "spade" },
				check(card) {
					return 8 - get.value(card);
				},
				filter(event, player) {
					if (!player.countCards("h", { suit: "spade" })) {
						return false;
					}
					var enemies = player.getEnemies();
					for (var i = 0; i < enemies.length; i++) {
						if (enemies[i].countCards("h", { suit: "spade" })) {
							return true;
						}
					}
					return false;
				},
				content() {
					var enemies = player.getEnemies();
					var list = [];
					for (var i = 0; i < enemies.length; i++) {
						var hs = enemies[i].getCards("h", { suit: "spade" });
						if (hs.length) {
							list.push([enemies[i], hs]);
						}
					}
					if (list.length) {
						var current = list.randomGet();
						player.line(current[0]);
						current[0].give(current[1].randomGet(), player, true);
					}
					"step 1";
					var card = player.getEquip("gjyuheng");
					if (card) {
						if (typeof card.storage.gjyuheng != "number") {
							card.storage.gjyuheng = 1;
						} else {
							card.storage.gjyuheng++;
						}
						if (card.storage.gjyuheng >= 3) {
							card.init([card.suit, card.number, "gjyuheng_plus", card.nature]);
							player.addTempSkill("gjyuheng_plus_temp");
						}
					}
				},
				ai: {
					order: 9,
					result: {
						player: 1,
					},
				},
			},
			gjyuheng_plus_temp: {},
			gjyuheng_plus_skill: {
				equipSkill: true,
				enable: "phaseUse",
				usable: 1,
				filterCard: { color: "black" },
				check(card) {
					return 8 - get.value(card);
				},
				filter(event, player) {
					// if(player.hasSkill('gjyuheng_plus_temp')) return false;
					if (!player.countCards("h", { color: "black" })) {
						return false;
					}
					var enemies = player.getEnemies();
					for (var i = 0; i < enemies.length; i++) {
						if (enemies[i].countCards("h", { suit: "spade" })) {
							return true;
						}
					}
					return false;
				},
				content() {
					var enemies = player.getEnemies();
					var list = [];
					for (var i = 0; i < enemies.length; i++) {
						var hs = enemies[i].getCards("h", { suit: "spade" });
						if (hs.length) {
							list.push([enemies[i], hs]);
						}
					}
					if (list.length) {
						var current = list.randomGet();
						player.line(current[0]);
						current[0].give(current[1].randomGet(), player, true);
					}
					"step 1";
					var card = player.getEquip("gjyuheng_plus");
					if (card) {
						if (typeof card.storage.gjyuheng != "number") {
							card.storage.gjyuheng = 1;
						} else {
							card.storage.gjyuheng++;
						}
						if (card.storage.gjyuheng >= 7) {
							card.init([card.suit, card.number, "gjyuheng_pro", card.nature]);
						}
					}
				},
				ai: {
					order: 9,
					result: {
						player: 1,
					},
				},
			},
			gjyuheng_pro_skill: {
				equipSkill: true,
				enable: "phaseUse",
				filterCard: { color: "black" },
				check(card) {
					return 8 - get.value(card);
				},
				filter(event, player) {
					if (!player.countCards("h", { color: "black" })) {
						return false;
					}
					var enemies = player.getEnemies();
					for (var i = 0; i < enemies.length; i++) {
						if (enemies[i].countCards("h", { suit: "spade" })) {
							return true;
						}
					}
					return false;
				},
				content() {
					var enemies = player.getEnemies();
					var list = [];
					for (var i = 0; i < enemies.length; i++) {
						var hs = enemies[i].getCards("h", { suit: "spade" });
						if (hs.length) {
							list.push([enemies[i], hs]);
						}
					}
					if (list.length) {
						var current = list.randomGet();
						player.line(current[0]);
						current[0].give(current[1].randomGet(), player, true);
					}
					"step 1";
					var card = player.getEquip("gjyuheng");
					if (card) {
						if (typeof card.storage.gjyuheng != "number") {
							card.storage.gjyuheng = 1;
						} else {
							card.storage.gjyuheng++;
						}
						if (card.storage.gjyuheng >= 3) {
							card.init([card.suit, card.number, "gjyuheng_plus", card.nature]);
							player.addTempSkill("gjyuheng_plus_temp");
						}
					}
				},
				ai: {
					order: 9,
					result: {
						player: 1,
					},
				},
			},
			shihuifen: {
				mark: true,
				intro: {
					content: "使用卡牌无法指定其他角色为目标",
				},
				mod: {
					playerEnabled(card, player, target) {
						if (player != target) {
							return false;
						}
					},
				},
			},
			g_shihuifen: {
				trigger: { global: "phaseUseBegin" },
				direct: true,
				filter(event, player) {
					if (event.player.hasSkill("shihuifen")) {
						return false;
					}
					if (event.player == player) {
						return false;
					}
					if (!lib.filter.targetEnabled({ name: "shihuifen" }, player, event.player)) {
						return false;
					}
					return player.hasCard("shihuifen") || player.hasSkillTag("shihuifen");
				},
				content() {
					player.chooseToUse(
						get.prompt("shihuifen", trigger.player).replace(/发动/, "使用"),
						function (card, player) {
							if (card.name != "shihuifen") {
								return false;
							}
							return lib.filter.cardEnabled(card, player, "forceEnable");
						},
						trigger.player,
						-1
					).targetRequired = true;
				},
			},
			g_jinlianzhu: {
				trigger: { global: "damageBefore" },
				direct: true,
				filter(event, player) {
					if (!lib.filter.targetEnabled({ name: "jinlianzhu" }, player, event.player)) {
						return false;
					}
					return player.hasCard("jinlianzhu");
				},
				content() {
					player.chooseToUse(
						get.prompt("jinlianzhu", trigger.player).replace(/发动/, "使用"),
						function (card, player) {
							if (card.name != "jinlianzhu") {
								return false;
							}
							return lib.filter.cardEnabled(card, player, "forceEnable");
						},
						trigger.player,
						-1
					).targetRequired = true;
				},
			},
		},
		cardType: {
			food: 0.3,
		},
		translate: {
			jinlianzhu: "金莲珠",
			jinlianzhu_info: "对一名即将受到伤害的角色使用，防止此伤害，并令伤害来源摸一张牌。",
			shihuifen: "石灰粉",
			shihuifen_info: "在一名其他角色的出牌阶段开始时对其使用，目标需打出一张【闪】，否则此阶段使用卡牌无法指定其他角色为目标。",
			liufengsan: "流风散",
			liufengsan_info: "出牌阶段对一名角色使用，目标获得两张闪。",
			liutouge: "六骰格",
			liutouge_info: "出牌阶段对一名角色使用，若目标是敌人，对目标施加一个随机的负面效果；否则对目标施加一个随机的正面效果。",
			longxugou: "龙须钩",
			longxugou_info: "出牌阶段对一名装备区内有牌的其他角色使用，获得其装备区内的一张牌并装备之。",
			mianlijinzhen: "棉里针",
			mianlijinzhen_info: "出牌阶段对一名体力值不小于你的角色使用，目标摸一张牌然后失去1点体力。",
			shenhuofeiya: "神火飞鸦",
			shenhuofeiya_info: "出牌阶段对一名其他角色和其相邻角色使用，目标需打出一张【闪】，否则受到1点火属性伤害。",
			qiankunbiao: "乾坤镖",
			qiankunbiao_info: "随机弃置一名其他角色和其相邻角色的一张牌。",

			bingpotong: "天女散花",
			bingpotong_ab: "散花",
			bingpotong_info: "出牌阶段对至多3名角色使用，你与每个目标依次同时展示一张手牌，若颜色相同，你弃置展示的手牌，目标失去1点体力并终止结算。",
			feibiao: "飞镖",
			feibiao_info: "出牌阶段，对一名距离1以外的角色使用，令其弃置一张黑色手牌或失去1点体力。",

			dinvxuanshuang: "帝女玄霜",
			dinvxuanshuang_info: "对一名濒死状态的角色使用，目标回复1点体力，然后可以弃置任意张牌并摸等量的牌。",
			yunvyuanshen: "玉女元参",
			yunvyuanshen_skill: "玉女元参",
			yunvyuanshen_info: "出牌阶段对一名角色使用，目标在下一次进入濒死状态时回复1点体力。",
			ziyangdan: "紫阳丹",
			ziyangdan_info: "出牌阶段对一名角色使用，目标获得3点护甲，此后每个准备阶段失去1点护甲，直到首次失去所有护甲或累计以此法失去3点护甲。",
			gjyuheng: "玉衡",
			gjyuheng_plus: "玉衡",
			gjyuheng_pro: "玉衡",
			gjyuheng_skill: "玉衡",
			gjyuheng_plus_skill: "玉衡",
			gjyuheng_pro_skill: "玉衡",
			gjyuheng_info: "出牌阶段限一次，若敌方角色有黑桃手牌，你可以弃置一张黑桃手牌，然后获得一名随机敌方角色的一张随机黑桃手牌（此牌在本局游戏中第三次和第七次发动效果后，分别自动获得一次强化）。",
			gjyuheng_plus_info: "由普通玉衡强化得到，将玉衡技能描述中的“弃置一张黑桃手牌”改为“弃置一张黑色手牌”。",
			gjyuheng_pro_info: "由普通玉衡二次强化得到，将玉横技能描述中的“弃置一张黑桃手牌”改为“弃置一张黑色手牌”，并去掉使用次数限制。",
			gjyuheng_skill_info: "出牌阶段限一次，若敌方角色有黑桃手牌，你可以弃置一张黑桃手牌，然后获得一名随机敌方角色的一张随机黑桃手牌。",
			gjyuheng_plus_skill_info: "出牌阶段限一次，若敌方角色有黑桃手牌，你可以弃置一张黑色手牌，然后获得一名随机敌方角色的一张随机黑桃手牌。",
			gjyuheng_pro_skill_info: "出牌阶段，若敌方角色有黑桃手牌，你可以弃置一张黑色手牌，然后获得一名随机敌方角色的一张随机黑桃手牌。",
			shujinsan: "舒筋散",
			shujinsan_info: "出牌阶段对任意角色使用，目标可弃置任意张牌，并摸等量的牌。",
			mutoumianju: "木头面具",
			mutoumianju_info: "出牌阶段限一次，你可以将一张手牌当作杀使用。",
			mutoumianju_skill: "木杀",
			mutoumianju_skill_info: "出牌阶段限一次，你可以将一张手牌当作杀使用。",
			heilonglinpian: "黑龙鳞片",
			heilonglinpian_info: "出牌阶段对自己使用，获得1点护甲，直到下一回合开始，你的防御距离+1。",
			shatang: "沙棠",
			shatang_info: "出牌阶段对一名角色使用，对目标造成1点火焰伤害，然后目标获得1点护甲。",

			food: "食物",
			chunbing: "春饼",
			chunbing_info: "你的手牌上限+1，持续五回合。",
			gudonggeng: "骨董羹",
			gudonggeng_info: "当你下一次受到杀造成的伤害时，令伤害-1，持续三回合。",
			yougeng: "酉羹",
			yougeng_info: "准备阶段，若你的体力值为全场最少或之一，你回复1点体力，持续两回合。",
			liyutang: "鲤鱼汤",
			liyutang_info: "结束阶段，若你的体力值为全场最少或之一，你获得1点护甲，持续两回合。",
			mizhilianou: "蜜汁藕",
			mizhilianou_info: "你可以将一张红桃牌当作桃使用，持续四回合。",
			xiajiao: "虾饺",
			xiajiao_info: "你在摸牌阶段额外摸一张牌，然后弃置一张牌，持续三回合。",
			tanhuadong: "昙花冻",
			tanhuadong_info: "出牌阶段结束时，你摸一张牌，持续三回合。",
			qingtuan: "青团",
			qingtuan_info: "你在回合内使用首张杀时摸一张牌，持续两回合。",
			luyugeng: "鲈鱼羹",
			luyugeng_info: "出牌阶段限一次，你可以弃置一张基本牌并发现一张牌，持续三回合。",
			yuanbaorou: "元宝肉",
			yuanbaorou_info: "你在出牌阶段可以额外使用一张杀，持续四回合。",
			molicha: "茉莉茶",
			molicha_info: "你不能成为其他角色的黑色牌的目标，持续四回合。",
			mapodoufu: "麻婆豆腐",
			mapodoufu_info: "结束阶段，你弃置一名随机敌人的一张随机牌，持续两回合。",
		},
		list: [
			["spade", 2, "tanhuadong"],
			["club", 1, "molicha"],
			["club", 3, "chunbing"],
			["heart", 12, "yougeng"],
			["heart", 8, "gudonggeng"],
			["heart", 1, "liyutang"],
			["diamond", 4, "mizhilianou"],
			["diamond", 6, "xiajiao"],
			["spade", 3, "qingtuan"],
			["club", 11, "luyugeng"],
			["heart", 4, "mapodoufu"],
			["spade", 8, "yuanbaorou"],

			["spade", 7, "gjyuheng"],
			["club", 4, "mutoumianju"],
			["spade", 2, "heilonglinpian"],
			["spade", 1, "mianlijinzhen"],
			["heart", 13, "yunvyuanshen"],

			["club", 8, "feibiao", "poison"],
			["diamond", 9, "feibiao", "poison"],

			["spade", 3, "bingpotong", "poison"],
			["club", 12, "bingpotong", "poison"],

			["club", 5, "shihuifen"],
			["club", 1, "shihuifen"],
			["spade", 13, "shihuifen"],

			["diamond", 6, "shujinsan"],
			["spade", 2, "shujinsan"],

			["diamond", 6, "ziyangdan"],
			["heart", 1, "ziyangdan"],

			// ['diamond',7,'dinvxuanshuang'],
			["heart", 9, "dinvxuanshuang"],

			["spade", 9, "qiankunbiao"],
			["club", 13, "qiankunbiao"],

			["diamond", 9, "shenhuofeiya"],
			["spade", 7, "longxugou"],

			["heart", 9, "jinlianzhu"],
			["spade", 7, "jinlianzhu"],

			["heart", 6, "liutouge"],
			["club", 6, "liutouge"],

			["club", 6, "liufengsan"],
			["club", 3, "liufengsan"],

			["heart", 13, "shatang", "fire"],
		],
	};
});
