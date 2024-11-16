import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "hearth",
		card: {
			linghunzhihuo: {
				fullskin: true,
				type: "trick",
				cardnature: "fire",
				enable: true,
				filterTarget: true,
				content: function () {
					"step 0";
					target.damage("fire");
					"step 1";
					var hs = player.getCards("h");
					if (hs.length) {
						player.discard(hs.randomGet());
					}
				},
				ai: {
					basic: {
						order: 1.8,
						value: [6, 1],
						useful: [4, 1],
					},
					result: {
						player: function (player, target) {
							if (player == target) return -1;
							if (player.countCards("h") >= player.hp) return -0.1;
							if (player.countCards("h") > 1) return -0.5;
							return 0;
						},
						target: -1,
					},
					tag: {
						damage: 1,
						fireDamage: 1,
						natureDamage: 1,
					},
				},
			},
			jihuocard: {
				fullskin: true,
				type: "trick",
				enable: true,
				toself: true,
				filterTarget: function (card, player, target) {
					return player == target;
				},
				selectTarget: -1,
				modTarget: true,
				content: function () {
					if (_status.currentPhase == target) {
						target.addTempSkill("jihuocard2");
					}
					target.draw();
				},
				ai: {
					order: 10,
					result: {
						target: 1,
					},
				},
			},
			zhaomingdan: {
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: function (card, player, target) {
					return player != target && target.countCards("hej") > 0;
				},
				content: function () {
					"step 0";
					if (target.countCards("hej")) {
						var next = player.discardPlayerCard("hej", target, true);
						next.visible = true;
						next.delay = false;
					} else {
						event.goto(2);
					}
					"step 1";
					if (result.bool) {
						game.delay(0.5);
					}
					"step 2";
					target.draw(false);
					target.$draw();
					game.delay(0.5);
					"step 3";
					player.draw();
				},
				ai: {
					order: 9.5,
					value: 6,
					useful: 3,
					result: {
						target: function (player, target) {
							if (get.attitude(player, target) > 0) {
								var js = target.getCards("j");
								if (js.length) {
									var jj = js[0].viewAs ? { name: js[0].viewAs } : js[0];
									if (jj.name == "zhaomingdan") return 3;
									if (js.length == 1 && get.effect(target, jj, target, player) >= 0) {
										return 0;
									}
									return 3;
								}
							}
							var es = target.getCards("e");
							var nh = target.countCards("h");
							var noe = es.length == 0 || target.hasSkillTag("noe");
							var noe2 = es.length == 1 && es[0].name == "baiyin" && target.hp < target.maxHp;
							var noh = nh == 0 || target.hasSkillTag("noh");
							if (noh && noe) return 0;
							if (noh && noe2) return 0.01;
							if (get.attitude(player, target) <= 0)
								return target.countCards("he") ? -1.5 : 1.5;
							return 0.1;
						},
					},
				},
			},
			shijieshu: {
				fullskin: true,
				enable: true,
				type: "trick",
				filterTarget: function (card, player, target) {
					return !target.isMin();
				},
				content: function () {
					"step 0";
					var cards = [];
					var subtype = null;
					for (var i = 0; i < 2; i++) {
						var card = get.cardPile(function (card) {
							if (get.type(card) == "equip") {
								if (subtype) {
									if (get.subtype(card) == subtype) {
										return false;
									}
								} else {
									subtype = get.subtype(card);
								}
								return true;
							}
							return false;
						});
						if (card) {
							ui.special.appendChild(card);
							cards.push(card);
						}
					}
					switch (cards.length) {
						case 1: {
							target.$gain(cards[0]);
							game.delay();
							break;
						}
						case 2: {
							target.$gain(cards[0]);
							setTimeout(function () {
								target.$gain(cards[1]);
							}, 250);
							game.delay();
							break;
						}
					}
					event.cards = cards;
					"step 1";
					if (event.cards.length) {
						target.equip(event.cards.shift());
						game.delay(0.5);
						if (event.cards.length) {
							event.redo();
						}
					}
					"step 2";
					game.delay(0.5);
					"step 3";
					if (target.countCards("he")) {
						target.chooseToDiscard("he", true);
					}
				},
				ai: {
					order: 9,
					value: 6,
					useful: 2,
					result: {
						target: function (player, target) {
							return Math.max(0, 2 - target.countCards("e"));
						},
					},
					tag: {
						norepeat: 1,
					},
				},
			},
			shandianjian: {
				fullskin: true,
				type: "trick",
				enable: true,
				cardnature: "thunder",
				filterTarget: function (card, player, target) {
					if (player != game.me && player.countCards("h") < 2) return false;
					return target.countCards("h") > 0;
				},
				content: function () {
					"step 0";
					if (target.countCards("h") == 0) {
						event.finish();
						return;
					}
					var rand = Math.random() < 0.5;
					target.chooseCard(true).ai = function (card) {
						if (rand) return Math.random();
						return get.value(card);
					};
					"step 1";
					event.dialog = ui.create.dialog(
						get.translation(target.name) + "展示的手牌",
						result.cards
					);
					event.card2 = result.cards[0];
					event.videoId = lib.status.videoId++;
					game.addVideo("cardDialog", null, [
						get.translation(target.name) + "展示的手牌",
						get.cardsInfo(result.cards),
						event.videoId,
					]);
					game.log(target, "展示了", event.card2);
					player.chooseToDiscard(
						function (card) {
							return get.suit(card) == get.suit(_status.event.parent.card2);
						},
						function (card) {
							if (get.damageEffect(target, player, player, "thunder") > 0) {
								return 6 - get.value(card, _status.event.player);
							}
							return -1;
						}
					).prompt = false;
					game.delay(2);
					"step 2";
					if (result.bool) {
						target.damage("thunder");
					} else {
						target.addTempSkill("huogong2");
					}
					game.addVideo("cardDialog", null, event.videoId);
					event.dialog.close();
				},
				ai: {
					basic: {
						order: 4,
						value: [3, 1],
						useful: 1,
					},
					wuxie: function (target, card, player, current, state) {
						if (get.attitude(current, player) >= 0 && state > 0) return false;
					},
					result: {
						player: function (player) {
							var nh = player.countCards("h");
							if (nh <= player.hp && nh <= 4 && _status.event.name == "chooseToUse") {
								if (
									typeof _status.event.filterCard == "function" &&
									_status.event.filterCard(new lib.element.VCard({ name: "shandianjian" }))
								) {
									return -10;
								}
								if (_status.event.skill) {
									var viewAs = get.info(_status.event.skill).viewAs;
									if (viewAs == "shandianjian") return -10;
									if (viewAs && viewAs.name == "shandianjian") return -10;
								}
							}
							return 0;
						},
						target: function (player, target) {
							if (target.hasSkill("huogong2") || target.countCards("h") == 0) return 0;
							if (player.countCards("h") <= 1) return 0;
							if (target == player) {
								if (
									typeof _status.event.filterCard == "function" &&
									_status.event.filterCard(new lib.element.VCard({ name: "shandianjian" }))
								) {
									return -1.5;
								}
								if (_status.event.skill) {
									var viewAs = get.info(_status.event.skill).viewAs;
									if (viewAs == "shandianjian") return -1.5;
									if (viewAs && viewAs.name == "shandianjian") return -1.5;
								}
								return 0;
							}
							return -1.5;
						},
					},
					tag: {
						damage: 1,
						thunderDamage: 1,
						natureDamage: 1,
						norepeat: 1,
					},
				},
			},
			shihuawuqi: {
				fullskin: true,
				type: "basic",
				enable: true,
				usable: 1,
				filterTarget: function (card, player, target) {
					return player == target;
				},
				selectTarget: -1,
				content: function () {
					player.addTempSkill("shihuawuqi");
					if (!player.countCards("h", "sha")) {
						var card = get.cardPile("sha");
						if (card) {
							player.gain(card, "gain2");
						}
					}
				},
				ai: {
					value: 4,
					useful: 2,
					order: 8,
					result: {
						target: function (player, target) {
							return target.countCards("h", "sha") ? 0 : 1;
						},
					},
				},
			},
			siwangchanrao: {
				enable: true,
				type: "trick",
				filterTarget: function (card, player, target) {
					return player != target && target.countCards("h") > 0;
				},
				selectTarget: 1,
				content: function () {
					"step 0";
					var hs = target.getCards("h");
					if (hs.length) {
						target.discard(hs.randomGet());
					}
					"step 1";
					if (!target.countCards("h")) {
						player.draw();
					}
				},
				ai: {
					order: 9,
					value: 4,
					useful: 1,
					result: {
						target: -1,
						player: function (player, target) {
							if (target.countCards("h") == 1) return 1;
						},
					},
				},
			},
			dunpaigedang: {
				fullskin: true,
				enable: true,
				type: "trick",
				toself: true,
				filterTarget: function (card, player, target) {
					return player == target;
				},
				selectTarget: -1,
				modTarget: true,
				content: function () {
					"step 0";
					target.changeHujia();
					target.draw();
					"step 1";
					if (target.countCards("he")) {
						target.chooseToDiscard("he", true);
					}
				},
				ai: {
					order: 8.5,
					value: 7,
					useful: 3,
					result: {
						target: 1,
					},
				},
			},
			chuansongmen: {
				fullskin: true,
				type: "trick",
				enable: true,
				discard: false,
				toself: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				// usable:3,
				// forceUsable:true,
				content: function () {
					"step 0";
					var gained = get.cards()[0];
					target.gain(gained, "gain2");
					if (
						event.getParent(3).name == "phaseUse" &&
						_status.currentPhase == target &&
						lib.filter.filterCard(gained, target, event.getParent(2))
					) {
						var next = target.chooseToUse();
						next.filterCard = function (card) {
							return card == gained;
						};
						next.prompt = "是否使用" + get.translation(gained) + "？";
						if (cards[0]) {
							ui.special.appendChild(cards[0]);
						} else {
							event.finish();
						}
					} else {
						// if(cards[0]){
						// 	cards[0].discard();
						// }
						event.finish();
					}
					"step 1";
					if (result.bool && !target.hasSkill("chuansongmen3")) {
						if (target.hasSkill("chuansongmen2")) {
							target.addTempSkill("chuansongmen3");
						} else {
							target.addTempSkill("chuansongmen2");
						}
						cards[0].fix();
						target.gain(cards, "gain2");
					} else {
						cards[0].discard();
					}
				},
				ai: {
					order: 9.5,
					value: 7,
					useful: 3,
					result: {
						target: 1,
					},
					tag: {
						norepeat: 1,
					},
				},
			},
			tanshezhiren: {
				fullskin: true,
				type: "trick",
				enable: true,
				// recastable:true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				modTarget: true,
				content: function () {
					"step 0";
					event.current = target;
					event.num = game.countPlayer();
					if (event.num % 2 == 0) {
						event.num--;
					}
					"step 1";
					if (event.num) {
						var enemies = event.current.getEnemies();
						enemies.remove(player);
						for (var i = 0; i < enemies.length; i++) {
							if (!enemies[i].countCards("h")) {
								enemies.splice(i--, 1);
							}
						}
						if (enemies.length) {
							var enemy = enemies.randomGet();
							event.current.line(enemy);
							enemy.discard(enemy.getCards("h").randomGet());
							event.current = enemy;
							event.num--;
							event.redo();
						}
					}
				},
				ai: {
					order: 8.5,
					wuxie: function () {
						return 0;
					},
					result: {
						player: 1,
					},
					tag: {
						multineg: 1,
						multitarget: 1,
					},
				},
			},
			xingjiegoutong: {
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				modTarget: true,
				toself: true,
				filterTarget: function (card, player, target) {
					return player == target;
				},
				content: function () {
					target.gainMaxHp();
					target.recover();
					target.discard(target.getCards("h"));
				},
				ai: {
					basic: {
						useful: [1, 1],
						value: [1, 1],
					},
					order: 1,
					result: {
						target: function (player, target) {
							if (target.countCards("h", "tao")) return 0;
							var nh = target.countCards("h");
							if (nh <= 2) return 1;
							if (target.hp == 1 && target.maxHp > 2) return 1;
							return 0;
						},
					},
					tag: {
						recover: 1,
					},
				},
			},
			shenenshu: {
				fullskin: true,
				enable: true,
				type: "trick",
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				content: function () {
					"step 0";
					var cards = target.getCards("h");
					if (cards.length) {
						target.lose(cards)._triggered = null;
					}
					event.num = 1 + cards.length;
					"step 1";
					var cards = [];
					var list = get.typeCard("basic");
					list.remove("du");
					if (list.length) {
						for (var i = 0; i < event.num; i++) {
							cards.push(game.createCard(list.randomGet()));
						}
						target.directgain(cards);
					}
				},
				ai: {
					order: 1,
					result: {
						target: function (player, target) {
							var hs = target.getCards("h");
							for (var i = 0; i < hs.length; i++) {
								if (get.type(hs[i]) != "basic" && get.useful(hs[i]) >= 6) {
									return 0;
								}
							}
							return 1;
						},
					},
				},
			},
			zhiliaobo: {
				fullskin: true,
				enable: true,
				filterTarget: function (card, player, target) {
					return target.hp < target.maxHp;
				},
				type: "trick",
				content: function () {
					"step 0";
					target.judge(function (card) {
						return get.color(card) == "red" ? 1 : 0;
					});
					"step 1";
					if (result.bool) {
						target.recover();
					} else {
						target.changeHujia();
					}
				},
				ai: {
					order: 4,
					value: [7, 3],
					useful: [6, 3],
					result: {
						target: function (player, target) {
							var eff = get.recoverEffect(target, player, target);
							if (eff <= 0) return 0;
							var num = target.maxHp - target.hp;
							if (num < 1) return 0;
							if (num == 1) return 1;
							if (target.hp == 1) return 2.5;
							return 2;
						},
					},
					tag: {
						recover: 1,
					},
				},
			},
			yuansuhuimie: {
				fullskin: true,
				type: "trick",
				cardnature: "thunder",
				enable: true,
				selectTarget: -1,
				filterTarget: true,
				reverseOrder: true,
				content: function () {
					"step 0";
					target.chooseToDiscard([1, 2], "he").ai = function (card) {
						if (get.damageEffect(target, player, target, "thunder") >= 0) {
							if (target.hasSkillTag("maixie")) {
								if (ui.selected.cards.length) return 0;
							} else {
								return 0;
							}
						}
						if (player.hasSkillTag("notricksource")) return 0;
						if (target.hasSkillTag("notrick")) return 0;
						if (card.name == "tao") return 0;
						if (target.hp == 1 && card.name == "jiu") return 0;
						if (get.type(card) != "basic") {
							return 10 - get.value(card);
						}
						return 8 - get.value(card);
					};
					"step 1";
					if (!result.bool || result.cards.length < 2) {
						if (result.bool) target.damage(2 - result.cards.length, "thunder");
						else target.damage(2, "thunder");
					}
				},
				ai: {
					basic: {
						order: 7,
						useful: [5, 1],
					},
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("nothunder")) return 0;
							if (player.hasUnknown(2)) return 0;
							var nh = target.countCards("he");
							if (target == player) nh--;
							if (nh == 2) return -2.5;
							if (nh == 1) return -3;
							if (nh == 0) return -4;
							return -2;
						},
					},
					tag: {
						damage: 1,
						natureDamage: 1,
						thunderDamage: 1,
						multitarget: 1,
						multineg: 1,
						discard: 2,
						loseCard: 2,
					},
				},
			},
		},
		skill: {
			chuansongmen2: {},
			chuansongmen3: {},
			shihuawuqi: {
				mod: {
					attackFrom: function (from, to, distance) {
						return distance - 1;
					},
				},
			},
			jihuocard2: {
				mod: {
					maxHandcard: function (player, num) {
						return num + 2;
					},
				},
			},
		},
		translate: {
			linghunzhihuo: "灵魂之火",
			linghunzhihuo_info: "对一名角色造成1点火焰伤害，然后随机弃置一张手牌。",
			shenenshu: "神恩术",
			shenenshu_info: "出牌阶段对自己使用，将所有手牌（含此张）替换为基本牌。",
			zhiliaobo: "治疗波",
			zhiliaobo_info:
				"出牌阶段对一名受伤角色使用，目标进行一次判定，若结果为红色，则回复1点体力，否则获得1点护甲。",
			yuansuhuimie: "元素毁灭",
			yuansuhuimie_info: "对所有角色使用，令目标弃置0~2张牌，并受到2-X点雷电伤害，X为其弃置的手牌数。",
			xingjiegoutong: "星界沟通",
			xingjiegoutong_info: "增加1点体力上限并回复1点体力，弃置你的所有手牌。",
			tanshezhiren: "弹射之刃",
			tanshezhiren_info:
				"出牌阶段对自己使用，依次按敌方-友方-敌方-的顺序随机弃置阵营内一名随机角色的一张牌（目标不包含你），共结算X次，X为存活角色数，若X为偶数，改为X-1。",
			chuansongmen: "传送门",
			chuansongmen_info:
				"摸一张牌并展示，若发生在出牌阶段，你可以立即使用摸到的牌，若如此做，你将传送门收回手牌（每阶段最多收回2张传送门）。",
			dunpaigedang: "盾牌格挡",
			dunpaigedang_info: "获得1点护甲值，摸一张牌，然后弃置一张牌。",
			siwangchanrao: "死亡缠绕",
			siwangchanrao_infox: "弃置一名其他角色的一张手牌，若其此时没有手牌，则你摸一张牌。",
			shihuawuqi: "石化武器",
			shihuawuqi_infox: "本回合内攻击范围+1；若你手牌中没有杀，则从牌堆中获得一张杀。",
			shandianjian: "闪电箭",
			shandianjian_info:
				"目标角色展示一张手牌，然后若你能弃掉一张与所展示牌相同花色的手牌，则对该角色造成1点雷电伤害。",
			shijieshu: "视界术",
			shijieshu_info: "目标从牌堆或弃牌堆中随机装备两张类别不同的装备牌，然后弃置一张牌。",
			zhaomingdan: "照明弹",
			zhaomingdan_info: "观看一名其他角色的手牌，并弃置其区域内的一张牌，然后其与你各摸一张牌。",
			jihuocard: "激活",
			jihuocard_info: "摸一张牌，本回合手牌上限+2。",
		},
		list: [
			["heart", 2, "shenenshu"],
			["diamond", 12, "shenenshu"],
			["club", 7, "zhiliaobo"],
			["spade", 1, "zhiliaobo"],
			["spade", 13, "yuansuhuimie"],
			["spade", 13, "xingjiegoutong"],
			["diamond", 2, "tanshezhiren"],
			["diamond", 2, "chuansongmen"],
			["heart", 2, "chuansongmen"],
			["club", 3, "dunpaigedang"],
			["club", 3, "shandianjian", "thunder"],
			["spade", 1, "shandianjian", "thunder"],
			["spade", 7, "shijieshu"],
			["diamond", 5, "zhaomingdan"],
			["heart", 10, "zhaomingdan"],
			["diamond", 2, "jihuocard"],
			["diamond", 1, "linghunzhihuo"],
		],
	};
});
