import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "swd",
		card: {
			hufu: {
				fullskin: true,
				type: "basic",
				global: ["g_hufu_sha", "g_hufu_shan", "g_hufu_jiu"],
				savable: function (card, player, dying) {
					return dying == player;
				},
				ai: {
					value: [7.5, 5, 2],
					useful: [7.5, 5, 2],
				},
			},
			liuxinghuoyu: {
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: true,
				cardcolor: "red",
				cardnature: "fire",
				content: function () {
					"step 0";
					if (target.countCards("he") < 2) {
						event.directfalse = true;
					} else {
						target.chooseToDiscard("he", 2).ai = function (card) {
							if (target.hasSkillTag("nofire")) return 0;
							if (get.damageEffect(target, player, target, "fire") >= 0) return 0;
							if (player.hasSkillTag("notricksource")) return 0;
							if (target.hasSkillTag("notrick")) return 0;
							if (card.name == "tao") return 0;
							if (target.hp == 1 && card.name == "jiu") return 0;
							if (target.hp == 1 && get.type(card) != "basic") {
								return 10 - get.value(card);
							}
							return 8 - get.value(card);
						};
					}
					"step 1";
					if (event.directfalse || !result.bool) {
						target.damage("fire");
					}
				},
				ai: {
					basic: {
						order: 4,
						value: 7,
						useful: 2,
					},
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("nofire")) return 0;
							if (get.damageEffect(target, player, player) < 0 && get.attitude(player, target) > 0) {
								return -2;
							}
							var nh = target.countCards("he");
							if (target == player) nh--;
							switch (nh) {
								case 0:
								case 1:
									return -2;
								case 2:
									return -1.5;
								case 3:
									return -1;
								default:
									return -0.7;
							}
						},
					},
					tag: {
						damage: 1,
						fireDamage: 1,
						natureDamage: 1,
						discard: 1,
						loseCard: 1,
						position: "he",
					},
				},
			},
			dujian: {
				fullskin: true,
				type: "basic",
				enable: true,
				filterTarget: function (card, player, target) {
					return target.countCards("h") > 0;
				},
				content: function () {
					"step 0";
					if (target.countCards("h") == 0 || player.countCards("h") == 0) {
						event.finish();
						return;
					}
					player.chooseCard(true);
					"step 1";
					event.card1 = result.cards[0];
					var rand = Math.random() < 0.5;
					target.chooseCard(true).ai = function (card) {
						if (rand) return Math.random();
						return get.value(card);
					};
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
					} else {
						player.$gain2(event.card1);
						target.$gain2(event.card2);
						target.addTempSkill("dujian2");
					}
					ui.arena.classList.remove("thrownhighlight");
					game.addVideo("thrownhighlight2");
				},
				ai: {
					basic: {
						order: 2,
						value: 3,
						useful: 1,
					},
					result: {
						player: function (player, target) {
							if (player.countCards("h") <= Math.min(5, Math.max(2, player.hp)) && _status.event.name == "chooseToUse") {
								if (typeof _status.event.filterCard == "function" && _status.event.filterCard({ name: "dujian" })) {
									return -10;
								}
								if (_status.event.skill) {
									var viewAs = get.info(_status.event.skill).viewAs;
									if (viewAs == "dujian") return -10;
									if (viewAs && viewAs.name == "dujian") return -10;
								}
							}
							return 0;
						},
						target: function (player, target) {
							if (target.hasSkill("dujian2") || target.countCards("h") == 0) return 0;
							if (player.countCards("h") <= 1) return 0;
							return -1.5;
						},
					},
					tag: {
						loseHp: 1,
					},
				},
			},
			yangpijuan: {
				fullskin: true,
				type: "trick",
				enable: true,
				toself: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				content: function () {
					"step 0";
					var choice;
					if (target.countCards("h", "shan") == 0 || target.countCards("h", "sha") == 0 || target.hp <= 1) {
						choice = "basic";
					} else {
						var e2 = target.getEquip(2);
						var e3 = target.getEquip(3);
						if ((e2 && e3) || ((e2 || e3) && target.needsToDiscard() <= 1) || Math.random() < 0.5) {
							choice = "trick";
						} else {
							choice = "equip";
						}
					}
					target
						.chooseControl("basic", "trick", "equip", function () {
							return choice;
						})
						.set("prompt", "选择一种卡牌类型");
					"step 1";
					var list = get.inpile(result.control, "trick");
					list = list.randomGets(3);
					for (var i = 0; i < list.length; i++) {
						list[i] = [get.translation(result.control), "", list[i]];
					}
					var dialog = ui.create.dialog("选择一张加入你的手牌", [list, "vcard"], "hidden");
					target.chooseButton(dialog, true).ai = function (button) {
						return get.value({ name: button.link[2] });
					};
					"step 2";
					if (result.buttons) {
						target.gain(game.createCard(result.buttons[0].link[2]), "draw");
					}
				},
				selectTarget: -1,
				ai: {
					order: 7,
					value: 7,
					useful: 4,
					result: {
						target: 1,
					},
				},
			},
			shencaojie: {
				fullskin: true,
				type: "trick",
				nodelay: true,
				// recastable:true,
				global: "g_shencaojie",
				content: function () {
					var evt = event.getParent("g_shencaojie")._trigger;
					if (evt) {
						if (evt.player == player) {
							evt.num--;
						} else {
							evt.num++;
						}
					}
				},
				ai: {
					order: 1,
					useful: 5,
					value: 6,
					result: {
						target: function (player, target) {
							if (target == player) {
								if (get.damageEffect(target, player, target) >= 0) return 0;
								return 1;
							} else {
								if (get.attitude(player, target) > 0) return 0;
								if (get.damageEffect(target, player, target) >= 0) return 0;
								return -1;
							}
						},
					},
				},
			},
			yuruyi: {
				type: "equip",
				subtype: "equip5",
				skills: ["yuruyi"],
				fullskin: true,
				ai: {
					basic: {
						equipValue: 6,
					},
				},
			},
			fengyinzhidan: {
				type: "basic",
				enable: true,
				fullskin: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				modTarget: true,
				// usable:1,
				content: function () {
					"step 0";
					event.num = 2;
					var list = [];
					event.list = list;
					for (var i = 0; i < lib.inpile.length; i++) {
						if (lib.filter.filterCard({ name: lib.inpile[i] }, target)) {
							var info = lib.card[lib.inpile[i]];
							if (info.type == "trick" && !info.multitarget && !info.notarget) {
								if (Array.isArray(info.selectTarget)) {
									if (info.selectTarget[0] > 0 && info.selectTarget[1] >= info.selectTarget[0]) {
										list.push(lib.inpile[i]);
									}
								} else if (typeof info.selectTarget == "number") {
									list.push(lib.inpile[i]);
								}
							}
						}
					}
					"step 1";
					var list = event.list;
					while (list.length) {
						var card = { name: list.randomRemove() };
						var info = get.info(card);
						var targets = game.filterPlayer(function (current) {
							return lib.filter.filterTarget(card, target, current);
						});
						if (targets.length) {
							targets.sort(lib.sort.seat);
							if (info.selectTarget == -1) {
								target.useCard(card, targets, "noai");
							} else {
								var num = info.selectTarget;
								if (Array.isArray(num)) {
									if (targets.length < num[0]) continue;
									num = num[0] + Math.floor(Math.random() * (num[1] - num[0] + 1));
								} else {
									if (targets.length < num) continue;
								}
								target.useCard(card, targets.randomGets(num), "noai");
							}
							if (--event.num > 0) {
								event.redo();
							}
							break;
						}
					}
				},
				ai: {
					order: 9,
					value: 8,
					useful: 3,
					result: {
						target: 1,
					},
				},
			},
			yuchanqian: {
				fullskin: true,
				type: "jiqi",
				addinfo: "杀",
				autoViewAs: "sha",
				global: ["g_yuchan_swap", "g_yuchan_equip"],
				ai: {
					value: 6,
					useful: [5, 1],
				},
			},
			yuchankun: {
				fullskin: true,
				type: "jiqi",
				addinfo: "药",
				autoViewAs: "caoyao",
				global: ["g_yuchan_swap", "g_yuchan_equip"],
				ai: {
					value: 6,
					useful: [7, 2],
				},
			},
			yuchanzhen: {
				fullskin: true,
				type: "jiqi",
				autoViewAs: "jiu",
				addinfo: "酒",
				global: ["g_yuchan_swap", "g_yuchan_equip"],
				savable: function (card, player, dying) {
					return dying == player;
				},
				ai: {
					value: 6,
					useful: [4, 1],
				},
			},
			yuchanxun: {
				fullskin: true,
				type: "jiqi",
				autoViewAs: "tao",
				addinfo: "桃",
				global: ["g_yuchan_swap", "g_yuchan_equip"],
				savable: true,
				ai: {
					value: 6,
					useful: [8, 6.5],
				},
			},
			yuchankan: {
				fullskin: true,
				type: "jiqi",
				autoViewAs: "shenmiguo",
				global: ["g_yuchan_swap", "g_yuchan_equip"],
				addinfo: "果",
				ai: {
					order: 1,
					useful: 4,
					value: 6,
					result: {
						player: function () {
							var cardname = _status.event.cardname;
							if (cardname == "tiesuo") return 0;
							if (cardname == "jiu") return 0;
							if (cardname == "tianxianjiu") return 0;
							if (cardname == "toulianghuanzhu") return 0;
							if (cardname == "shijieshu") return 0;
							if (cardname == "xietianzi") return 0;
							if (cardname == "huogong") return 0;
							if (cardname == "shandianjian") return 0;
							return 1;
						},
					},
				},
			},
			yuchanli: {
				fullskin: true,
				type: "jiqi",
				autoViewAs: "tianxianjiu",
				global: ["g_yuchan_swap", "g_yuchan_equip"],
				addinfo: "仙",
				savable: function (card, player, dying) {
					return dying == player;
				},
				ai: {
					value: 6,
					useful: 1,
				},
			},
			yuchangen: {
				fullskin: true,
				type: "jiqi",
				addinfo: "蛋",
				autoViewAs: "fengyinzhidan",
				global: ["g_yuchan_swap", "g_yuchan_equip"],
				ai: {
					value: 6,
					useful: 1,
				},
			},
			yuchandui: {
				fullskin: true,
				type: "jiqi",
				addinfo: "雪",
				autoViewAs: "xuejibingbao",
				global: ["g_yuchan_swap", "g_yuchan_equip"],
				ai: {
					value: 6,
					useful: 4,
				},
			},
			mujiaren: {
				fullskin: true,
				enable: true,
				type: "jiguan",
				usable: 1,
				updateUsable: "phaseUse",
				forceUsable: true,
				wuxieable: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				content: function () {
					"step 0";
					var cards = target.getCards("h", function (card) {
						return get.type(card) != "basic";
					});
					if (cards.length) {
						target.lose(cards)._triggered = null;
					}
					event.num = 1 + cards.length;
					"step 1";
					var cards = [];
					var list = get.typeCard("jiguan");
					for (var i = 0; i < list.length; i++) {
						if (lib.card[list[i]].derivation) {
							list.splice(i--, 1);
						}
					}
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
						target: 1,
					},
				},
			},
			zhiluxiaohu: {
				enable: function (card, player) {
					return lib.filter.filterCard({ name: "sha" }, player);
				},
				fullskin: true,
				type: "jiguan",
				wuxieable: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				selectTarget: -1,
				content: function () {
					"step 0";
					var targets = target.getEnemies();
					if (targets.length) {
						var target2 = targets.randomGet();
						target2.addExpose(0.2);
						target.useCard({ name: "sha" }, target2);
					}
					player.addSkill("zhiluxiaohu");
					"step 1";
					player.removeSkill("zhiluxiaohu");
				},
				ai: {
					value: 6,
					result: {
						target: 1,
					},
					order: function () {
						return get.order({ name: "sha" }) + 0.1;
					},
				},
			},
			xuejibingbao: {
				enable: true,
				fullskin: true,
				type: "basic",
				filterTarget: function (card, player, target) {
					return !target.hasSkill("xuejibingbao");
				},
				content: function () {
					target.storage.xuejibingbao = 2;
					target.addSkill("xuejibingbao");
				},
				ai: {
					order: 2,
					value: 6,
					result: {
						target: function (player, target) {
							var num = 1;
							if (target.hp < 2) num = 0.5;
							return num / Math.sqrt(Math.max(1, target.countCards("h")));
						},
					},
				},
			},
			gouhunluo: {
				enable: true,
				fullskin: true,
				type: "jiguan",
				wuxieable: true,
				filterTarget: function (card, player, target) {
					return !target.hasSkill("gouhunluo");
				},
				content: function () {
					target.storage.gouhunluo = 3;
					target.storage.gouhunluo2 = player;
					target.addSkill("gouhunluo");
				},
				ai: {
					order: 2,
					value: 5,
					result: {
						target: function (player, target) {
							return -1 / Math.max(1, target.hp);
						},
					},
				},
			},
			zhuquezhizhang: {
				type: "jiqi",
				fullskin: true,
				global: "g_zhuquezhizhang",
				ai: {
					value: 8,
					useful: 6.5,
				},
			},
			xuanwuzhihuang: {
				type: "jiqi",
				fullskin: true,
				global: "g_xuanwuzhihuang",
				ai: {
					value: 8,
					useful: 6.5,
				},
			},
			huanglinzhicong: {
				type: "jiqi",
				fullskin: true,
				global: "g_huanglinzhicong",
				ai: {
					value: 8,
					useful: 6.5,
				},
			},
			cangchizhibi: {
				type: "jiqi",
				fullskin: true,
				global: "g_cangchizhibi",
				ai: {
					value: 8,
					useful: 6.5,
				},
			},
			qinglongzhigui: {
				type: "jiqi",
				fullskin: true,
				global: "g_qinglongzhigui",
				ai: {
					value: 8,
					useful: 6.5,
				},
			},
			baishouzhihu: {
				type: "jiqi",
				fullskin: true,
				global: "g_baishouzhihu",
				ai: {
					value: 8,
					useful: 6.5,
				},
			},
			jiguantong: {
				fullskin: true,
				type: "jiguan",
				cardnature: "fire",
				enable: true,
				wuxieable: true,
				selectTarget: -1,
				reverseOrder: true,
				filterTarget: function (card, player, target) {
					return target != player;
				},
				content: function () {
					"step 0";
					if (target.countCards("h")) {
						var next = target.chooseToDiscard("机关火筒：弃置一张手牌或受到1点火焰伤害");
						next.set("ai", function (card) {
							var evt = _status.event.getParent();
							if (get.damageEffect(evt.target, evt.player, evt.target, "fire") >= 0) return 0;
							return 8 - get.useful(card);
						});
					} else {
						target.damage("fire");
						event.parent.preResult = true;
						event.finish();
					}
					"step 1";
					if (result.bool == false) {
						target.damage("fire");
						event.parent.preResult = true;
					}
				},
				contentAfter: function () {
					if (!event.preResult) player.draw();
				},
				ai: {
					wuxie: function (target, card, player, viewer) {
						if (get.attitude(viewer, target) > 0) {
							if (target.countCards("h") > 0 || target.hp > 1) return 0;
						}
					},
					basic: {
						order: 9,
						useful: 1,
					},
					result: {
						target: function (player, target) {
							if (player.hasUnknown(2)) return 0;
							var nh = target.countCards("h");
							if (get.mode() == "identity") {
								if (target.isZhu && nh <= 1 && target.hp <= 1) return -100;
							}
							if (nh == 0) return -1;
							if (nh == 1) return -0.7;
							return -0.5;
						},
					},
					tag: {
						discard: 1,
						loseCard: 1,
						damage: 1,
						natureDamage: 1,
						fireDamage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			donghuangzhong: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				nomod: true,
				nopower: true,
				unique: true,
				skills: ["donghuangzhong"],
				ai: {
					equipValue: 7,
				},
			},
			xuanyuanjian: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				nomod: true,
				nopower: true,
				unique: true,
				skills: ["xuanyuanjian", "xuanyuanjian2", "xuanyuanjian3"],
				enable: function (card, player) {
					return player.hasSkill("xuanyuan") || player.hp > 2;
				},
				distance: { attackFrom: -2 },
				onEquip: function () {
					if (!player.hasSkill("xuanyuan") && player.hp <= 2) {
						player.discard(card);
					} else {
						player.changeHujia();
					}
				},
				ai: {
					equipValue: 9,
				},
			},
			pangufu: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				skills: ["pangufu"],
				nomod: true,
				nopower: true,
				unique: true,
				distance: { attackFrom: -3 },
				ai: {
					equipValue: 8,
				},
			},
			lianyaohu: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				equipDelay: false,
				loseDelay: false,
				nomod: true,
				nopower: true,
				unique: true,
				onEquip: function () {
					player.markSkill("lianyaohu_skill");
				},
				onLose: function () {
					player.unmarkSkill("lianyaohu_skill");
				},
				clearLose: true,
				ai: {
					equipValue: 6,
				},
				skills: ["lianhua", "shouna", "lianyaohu_skill"],
			},
			haotianta: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["haotianta"],
				nomod: true,
				nopower: true,
				unique: true,
				ai: {
					equipValue: 7,
				},
			},
			fuxiqin: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["kongxin"],
				nomod: true,
				nopower: true,
				unique: true,
				ai: {
					equipValue: 6,
				},
			},
			shennongding: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["shennongding"],
				nomod: true,
				nopower: true,
				unique: true,
				ai: {
					equipValue: 6,
				},
			},
			kongdongyin: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["kongdongyin"],
				nomod: true,
				nopower: true,
				unique: true,
				ai: {
					equipValue: function (card, player) {
						if (player.hp == 2) return 7;
						if (player.hp == 1) return 10;
						return 5;
					},
					basic: {
						equipValue: 7,
					},
				},
			},
			kunlunjingc: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["kunlunjingc"],
				nomod: true,
				nopower: true,
				unique: true,
				ai: {
					equipValue: 6,
				},
			},
			nvwashi: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["nvwashi"],
				nomod: true,
				nopower: true,
				unique: true,
				ai: {
					equipValue: 5,
				},
			},
			guisheqi: {
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: true,
				content: function () {
					target.changeHujia();
				},
				ai: {
					basic: {
						order: 5,
						useful: 3,
						value: [6, 2, 1],
					},
					result: {
						target: function (player, target) {
							return 2 / Math.max(1, Math.sqrt(target.hp));
						},
					},
				},
			},
			jiguanfeng: {
				fullskin: true,
				type: "jiguan",
				enable: true,
				wuxieable: true,
				filterTarget: function (card, player, target) {
					return target != player;
				},
				content: function () {
					"step 0";
					var next = target.chooseToRespond({ name: "shan" });
					next.set("respondTo", [player, card]);
					next.autochoose = lib.filter.autoRespondShan;
					"step 1";
					if (result.bool == false) {
						if (!target.hasSkill("fengyin")) {
							target.addTempSkill("fengyin", { player: "phaseBegin" });
						}
						target.damage();
					} else {
						event.finish();
					}
				},
				ai: {
					basic: {
						order: 9,
						useful: 3,
						value: 6.5,
					},
					result: {
						target: -2,
					},
					tag: {
						respond: 1,
						respondShan: 1,
						// damage:1,
					},
				},
			},
			jiguanyuan: {
				fullskin: true,
				type: "jiguan",
				wuxieable: true,
				enable: function (card, player) {
					var hs = player.getCards("he");
					return hs.length > 1 || (hs.length == 1 && hs[0] != card);
				},
				filterTarget: function (card, player, target) {
					return target != player && !target.hasSkill("jiguanyuan");
				},
				content: function () {
					"step 0";
					if (player.countCards("he")) {
						player.chooseCard(true, "he").set("prompt2", "你将" + get.translation(cards) + "和选择牌置于" + get.translation(target) + "的武将牌上，然后摸一张牌；" + get.translation(target) + "于下一结束阶段获得武将牌上的牌");
					} else {
						event.finish();
					}
					"step 1";
					player.$throw(result.cards);
					player.lose(result.cards, ui.special);
					ui.special.appendChild(cards[0]);
					event.togive = [cards[0], result.cards[0]];
					game.delay();
					"step 2";
					// target.gain(event.togive).delay=false;
					target.$gain2(event.togive);
					target.storage.jiguanyuan = event.togive;
					target.addSkill("jiguanyuan");
					game.log(target, "从", player, "获得了", event.togive);
					player.draw();
				},
				ai: {
					basic: {
						order: 2,
						useful: 2,
						value: 7,
					},
					result: {
						target: function (player, target) {
							var players = game.filterPlayer(function (current) {
								return current != player && !current.isTurnedOver() && get.attitude(player, current) >= 3 && get.attitude(current, player) >= 3;
							});
							players.sort(lib.sort.seat);
							if (target == players[0]) return 2;
							return 0.5;
						},
					},
				},
			},
			shenmiguo: {
				fullskin: true,
				type: "basic",
				global: "g_shenmiguo",
				content: function () {
					if (Array.isArray(player.storage.shenmiguo)) {
						player.useCard(player.storage.shenmiguo[0], player.storage.shenmiguo[1]);
					}
				},
				ai: {
					order: 1,
					useful: 6,
					value: 6,
					result: {
						player: function () {
							var cardname = _status.event.cardname;
							if (get.tag({ name: cardname }, "norepeat")) return 0;
							return 1;
						},
					},
				},
			},
			qinglianxindeng: {
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				skills: ["qinglianxindeng"],
				ai: {
					basic: {
						equipValue: 8,
					},
				},
			},
			lingjiandai: {
				fullskin: true,
				enable: true,
				type: "jiguan",
				wuxieable: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				modTarget: true,
				content: function () {
					var list = get.typeCard("hslingjian");
					if (list.length) {
						list = list.randomGets(3);
						for (var i = 0; i < list.length; i++) {
							list[i] = game.createCard(list[i]);
						}
						target.gain(list, "gain2");
					}
				},
				ai: {
					order: 10,
					value: 7,
					useful: 1,
					tag: {
						gain: 1,
					},
					result: {
						target: function (player, target) {
							if (target == player && target.countCards("h", { type: "equip" })) return 2.5;
							return 1;
						},
					},
				},
			},
			jiguanshu: {
				fullskin: true,
				type: "jiguan",
				wuxieable: true,
				modTarget: true,
				enable: function (card, player) {
					var es = player.getCards("e");
					for (var i = 0; i < es.length; i++) {
						if (lib.inpile.includes(es[i].name) && !lib.card[es[i].name].nopower && !lib.card[es[i].name].unique && !es[i].nopower) {
							return true;
						}
					}
					return false;
				},
				filterTarget: function (card, player, target) {
					return target == player;
					// var es=target.getCards('e');
					// for(var i=0;i<es.length;i++){
					// 	if(lib.inpile.includes(es[i].name)) return true;
					// }
					// return false;
				},
				selectTarget: -1,
				content: function () {
					"step 0";
					var es = target.getCards("e");
					var list = get.typeCard("hslingjian");
					var list2 = get.typeCard("jiqi");
					var list3 = [];
					var list4 = [];
					for (var i = 0; i < list2.length; i++) {
						if (list2[i].indexOf("yuchan") == 0) {
							list4.push(list2[i]);
						} else {
							list3.push(list2[i]);
						}
					}
					if (Math.random() < 1 / 3) {
						list2 = list4;
					} else {
						list2 = list3;
					}
					var cards = [];
					var time = 0;
					for (var i = 0; i < es.length; i++) {
						if (!lib.inpile.includes(es[i].name) || lib.card[es[i].name].nopower || lib.card[es[i].name].unique || es[i].nopower) {
							es.splice(i--, 1);
						}
					}
					if (!es.length) {
						event.finish();
						return;
					}
					if (!list.length && !list2.length) {
						event.finish();
						return;
					}
					var num = get.rand(es.length);
					var card;
					target.removeEquipTrigger();
					var delayed = 0;
					for (var i = 0; i < es.length; i++) {
						if (i == num) {
							card = game.createCard(list2.randomGet());
						} else {
							card = game.createCard(list.randomGet());
						}
						if (!card) {
							delayed++;
							continue;
						}
						cards.push(card);
						time += 200;
						setTimeout(
							(function (card, name, last) {
								return function () {
									game.createCard(card).discard();
									card.init([card.suit, card.number, name, card.nature]);
									card.style.transform = "scale(1.1)";
									card.classList.add("glow");
									if (last) game.resume();
									setTimeout(function () {
										card.style.transform = "";
										card.classList.remove("glow");
									}, 500);
								};
							})(es[i], lib.skill.lingjianduanzao.process([card, es[i]]), i == es.length - 1),
							(i - delayed) * 200
						);
					}
					target.$gain2(cards);
					game.pause();
					"step 1";
					target.addEquipTrigger();
				},
				ai: {
					value: 7,
					order: 7.5,
					result: {
						// target:function(player,target){
						// 	var es=target.getCards('e');
						// 	var num=0;
						// 	for(var i=0;i<es.length;i++){
						// 		if(lib.inpile.includes(es[i].name)) num++;
						// 	}
						// 	return num;
						// }
						target: 1,
					},
				},
			},
			jiguanyaoshu: {
				fullskin: true,
				enable: true,
				type: "jiguan",
				range: { global: 1 },
				wuxieable: true,
				filterTarget: function (card, player, target) {
					for (var i = 1; i <= 5; i++) {
						if (!target.getEquip(i)) {
							return !target.hasSkill("jiguanyaoshu_skill") && !target.isMin();
						}
					}
					return false;
				},
				content: function () {
					var types = [];
					for (var i = 1; i <= 5; i++) {
						if (!target.getEquip(i)) {
							types.push("equip" + i);
						}
					}
					var list = get.inpile("equip");
					for (var i = 0; i < list.length; i++) {
						if (!types.includes(lib.card[list[i]].subtype)) {
							list.splice(i--, 1);
						}
					}
					var card = game.createCard(list.randomGet());
					target.$gain2(card);
					target.equip(card);
					target.addSkill("jiguanyaoshu_skill");
					game.delay();
				},
				ai: {
					wuxie: function () {
						return 0;
					},
					order: 10.1,
					value: [5, 1],
					result: {
						target: function (player, target) {
							return 1 / (1 + target.countCards("e"));
						},
					},
				},
			},
			hslingjian_xuanfengzhiren: {
				type: "hslingjian",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: true,
				derivationpack: "swd",
				filterTarget: function (card, player, target) {
					return target.countCards("he") > 0;
				},
				content: function () {
					target.discard(target.getCards("he").randomGet());
				},
				ai: {
					order: 9,
					result: {
						target: -1,
					},
					useful: [2, 0.5],
					value: [2, 0.5],
				},
			},
			hslingjian_zhongxinghujia: {
				type: "hslingjian",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: true,
				derivationpack: "swd",
				filterTarget: function (card, player, target) {
					return !target.isMin();
				},
				content: function () {
					"step 0";
					var list = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						if (lib.card[lib.inpile[i]].subtype == "equip2") {
							list.push(lib.inpile[i]);
						}
					}
					if (list.length) {
						var card = game.createCard(list.randomGet());
						target.$draw(card);
						game.delay();
						target.equip(card);
					}
					"step 1";
					var hs = target.getCards("h");
					if (hs.length) {
						target.discard(hs.randomGet());
					}
				},
				ai: {
					order: 4,
					result: {
						target: function (player, target) {
							if (target.getEquip(2)) {
								if (target.countCards("h") && !target.hasSkillTag("noe")) return -0.6;
								return 0;
							} else {
								var hs = target.getCards("h");
								var num = 0;
								if (target.hasSkillTag("noe")) {
									num = 1;
								}
								if (player == target) {
									if (hs.length == 2) return num;
									if (hs.length == 1) return num + 1;
									if (hs.length <= 4) {
										for (var i = 0; i < hs.length; i++) {
											if (get.value(hs[i]) > 6) return num;
										}
									}
									if (hs.length > 4) return num + 0.5;
								} else {
									if (hs.length) {
										if (hs.length <= 3) return num;
										return num + 0.5;
									}
								}
								return num + 1;
							}
						},
					},
					useful: [2, 0.5],
					value: [2, 0.5],
				},
			},
			hslingjian_xingtigaizao: {
				type: "hslingjian",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: true,
				derivationpack: "swd",
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					target.draw();
					target.addSkill("hslingjian_xingtigaizao");
					if (typeof target.storage.hslingjian_xingtigaizao == "number") {
						target.storage.hslingjian_xingtigaizao++;
					} else {
						target.storage.hslingjian_xingtigaizao = 1;
					}
				},
				ai: {
					order: 9,
					result: {
						target: function (player, target) {
							if (!player.needsToDiscard()) return 1;
							return 0;
						},
					},
					useful: [2, 0.5],
					value: [2, 0.5],
				},
			},
			hslingjian_shijianhuisu: {
				type: "hslingjian",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: true,
				derivationpack: "swd",
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("e") > 0;
				},
				content: function () {
					var es = target.getCards("e");
					target.gain(es);
					target.$gain2(es);
				},
				ai: {
					order: 5,
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("noe") || target.hasSkillTag("reverseEquip")) return target.countCards("e") * 2;
							if (target.getEquip("baiyin") && target.isDamaged()) return 2;
							if (target.getEquip("xuanyuanjian") || target.getEquip("qiankundai")) return 1;
							if (target.hasSkill("jiguanyaoshu_skill")) return 0.5;
							var num = 0;
							var es = target.getCards("e");
							for (var i = 0; i < es.length; i++) {
								var subtype = get.subtype(es[i]);
								if (subtype == "equip1" || subtype == "equip3") {
									num++;
								}
							}
							var mn = target.getEquip("muniu");
							if (mn && mn.cards && mn.cards.length) {
								num += mn.cards.length;
							}
							return -num;
						},
					},
					useful: [2, 0.5],
					value: [2, 0.5],
					tag: {
						loseCard: 1,
					},
				},
			},
			hslingjian_jinjilengdong: {
				type: "hslingjian",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: true,
				derivationpack: "swd",
				filterTarget: function (card, player, target) {
					return !target.isTurnedOver() && target != player;
				},
				content: function () {
					"step 0";
					target.changeHujia(2);
					target.turnOver();
					"step 1";
					if (target.isTurnedOver()) target.addTempSkill("hslingjian_jinjilengdong", { player: "turnOverAfter" });
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							var num = get.threaten(target, player);
							if (target.hasSkillTag("noturn")) return 2 * num;
							if (target.hp > 4) return -1.2 * num;
							else if (target.hp == 4) return -1 * num;
							else if (target.hp == 3) return -0.9 * num;
							else if (target.hp == 2) return -0.5 * num;
							else {
								if (target.maxHp > 2) {
									if (target.hujia) return 0.5 * num;
									return num;
								}
								return 0;
							}
						},
					},
					useful: [2, 0.5],
					value: [2, 0.5],
				},
			},
			hslingjian_shengxiuhaojiao: {
				type: "hslingjian",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: true,
				derivationpack: "swd",
				filterTarget: function (card, player, target) {
					return !target.hasSkill("hslingjian_chaofeng");
				},
				content: function () {
					target.addTempSkill("hslingjian_chaofeng", { player: "phaseBegin" });
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							if (get.distance(player, target, "absolute") <= 1) return 0;
							if (target.countCards("h") <= target.hp) return -0.1;
							return -1;
						},
					},
					useful: [2, 0.5],
					value: [2, 0.5],
				},
			},
			hslingjian_yinmilichang: {
				type: "hslingjian",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: true,
				derivationpack: "swd",
				filterTarget: function (card, player, target) {
					return player != target && !target.hasSkill("qianxing");
				},
				content: function () {
					target.tempHide();
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							if (get.distance(player, target, "absolute") <= 1) return 0;
							if (target.hp == 1) return 2;
							if (target.hp == 2 && target.countCards("h") <= 2) return 1.2;
							return 1;
						},
					},
					useful: [2, 0.5],
					value: [2, 0.5],
				},
			},
			xingjunyan: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["xingjunyan"],
				ai: {
					basic: {
						equipValue: 4,
					},
				},
			},
			qinglonglingzhu: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["qinglonglingzhu"],
				ai: {
					basic: {
						equipValue: 5,
					},
				},
			},
			baihupifeng: {
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				skills: ["baihupifeng"],
				ai: {
					equipValue: function (card, player) {
						if (player.hp <= 2) return 8;
						return 6;
					},
					basic: {
						equipValue: 7,
					},
				},
			},
			fengxueren: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -1 },
				skills: ["fengxueren"],
				ai: {
					basic: {
						equipValue: 5,
					},
				},
			},
			chilongya: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -1 },
				skills: ["chilongya"],
				ai: {
					basic: {
						equipValue: 4,
					},
				},
			},
			daihuofenglun: {
				type: "equip",
				subtype: "equip4",
				fullskin: true,
				cardnature: "fire",
				distance: { globalFrom: -2, globalTo: -1 },
				ai: {
					basic: {
						equipValue: 4,
					},
				},
			},
			xiayuncailing: {
				type: "equip",
				subtype: "equip3",
				fullskin: true,
				distance: { globalFrom: 1, globalTo: 2 },
			},
			shentoumianju: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["shentou"],
				ai: {
					basic: {
						equipValue: 7,
					},
				},
			},
			xianluhui: {
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				reverseOrder: true,
				filterTarget: function (card, player, target) {
					return target.isDamaged();
				},
				content: function () {
					target.changeHujia();
				},
				ai: {
					tag: {
						multitarget: 1,
					},
					basic: {
						order: 7,
						useful: 3,
						value: 3,
					},
					result: {
						target: function (player, target) {
							if (target.hp <= 1) return 1.5;
							if (target.hp == 2) return 1.2;
							return 1;
						},
					},
				},
			},
			xiangyuye: {
				type: "basic",
				enable: true,
				fullskin: true,
				filterTarget: function (card, player, target) {
					return get.distance(player, target, "attack") > 1;
				},
				content: function () {
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
			caoyao: {
				fullskin: true,
				type: "basic",
				range: { global: 1 },
				enable: true,
				filterTarget: function (card, player, target) {
					return target.hp < target.maxHp;
				},
				content: function () {
					target.recover();
				},
				ai: {
					basic: {
						useful: [7, 2],
						value: [7, 2],
					},
					order: 2.2,
					result: {
						target: 2,
					},
					tag: {
						recover: 1,
					},
				},
			},
			tianxianjiu: {
				fullskin: true,
				type: "basic",
				toself: true,
				enable: function (event, player) {
					return !player.hasSkill("tianxianjiu");
				},
				savable: function (card, player, dying) {
					return dying == player;
				},
				usable: 1,
				selectTarget: -1,
				logv: false,
				modTarget: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				content: function () {
					"step 0";
					if (target.isDying()) target.recover();
					else {
						target.addTempSkill("tianxianjiu", ["phaseAfter", "shaAfter"]);
						if (cards && cards.length) {
							card = cards[0];
						}
						if (target == targets[0] && card.clone && (card.clone.parentNode == player.parentNode || card.clone.parentNode == ui.arena)) {
							card.clone.moveDelete(target);
							game.addVideo("gain2", target, get.cardsInfo([card]));
						}
						if (!target.node.jiu && lib.config.jiu_effect) {
							target.node.jiu = ui.create.div(".playerjiu", target.node.avatar);
							target.node.jiu2 = ui.create.div(".playerjiu", target.node.avatar2);
						}
					}
				},
				ai: {
					basic: {
						useful: function (card, i) {
							if (_status.event.player.hp > 1) {
								if (i == 0) return 5;
								return 1;
							}
							if (i == 0) return 7.3;
							return 3;
						},
						value: function (card, player, i) {
							if (player.hp > 1) {
								if (i == 0) return 5;
								return 1;
							}
							if (i == 0) return 7.3;
							return 3;
						},
					},
					order: function () {
						return get.order({ name: "sha" }) + 0.2;
					},
					result: {
						target: function (player, target) {
							if (target && target.isDying()) return 2;
							if (lib.config.mode == "stone" && !player.isMin()) {
								if (player.getActCount() + 1 >= player.actcount) return false;
							}
							var shas = player.getCards("h", "sha");
							if (shas.length > 1 && player.getCardUsable("sha") > 1) {
								return 0;
							}
							var card;
							if (shas.length) {
								for (var i = 0; i < shas.length; i++) {
									if (lib.filter.filterCard(shas[i], target)) {
										card = shas[i];
										break;
									}
								}
							} else if (player.hasSha()) {
								card = { name: "sha" };
							}
							if (card) {
								if (
									game.hasPlayer(function (current) {
										return !current.hujia && get.attitude(target, current) < 0 && target.canUse(card, current, true, true) && get.effect(current, card, target) > 0;
									})
								) {
									return 1;
								}
							}
							return 0;
						},
					},
				},
			},
			huanpodan: {
				fullskin: true,
				type: "basic",
				enable: true,
				logv: false,
				filterTarget: function (card, player, target) {
					return !target.hasSkill("huanpodan_skill");
				},
				content: function () {
					target.addSkill("huanpodan_skill");
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
						value: 8,
						useful: 4,
					},
					order: 2,
					result: {
						target: function (player, target) {
							return 1 / Math.sqrt(1 + target.hp);
						},
					},
				},
			},
			langeguaiyi: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["longfan"],
				ai: {
					basic: {
						equipValue: 7,
					},
				},
			},
			guiyoujie: {
				fullskin: true,
				type: "delay",
				filterTarget: function (card, player, target) {
					return lib.filter.judge(card, player, target) && player != target;
				},
				judge: function (card) {
					if (get.color(card) == "black") return -3;
					return 0;
				},
				effect: function () {
					if (result.bool == false) {
						player.loseHp();
						player.randomDiscard();
					}
				},
				ai: {
					basic: {
						order: 1,
						useful: 1,
						value: 6,
					},
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("noturn")) return 0;
							return -3;
						},
					},
				},
			},
			yufulu: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["touzhi"],
				ai: {
					basic: {
						equipValue: 5,
					},
				},
			},
			xixueguizhihuan: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["xixue"],
				ai: {
					basic: {
						equipValue: 5,
					},
				},
			},
			zhufangshenshi: {
				fullskin: true,
				type: "trick",
				enable: true,
				global: "g_zhufangshenshi",
				filterTarget: function (card, player, target) {
					return target != player;
				},
				content: function () {
					player.storage.zhufangshenshi = target;
					player.addTempSkill("zhufangshenshi");
				},
				ai: {
					tag: {
						norepeat: 1,
					},
					value: 4,
					wuxie: function () {
						return 0;
					},
					useful: [2, 1],
					basic: {
						order: 7,
					},
					result: {
						player: function (player, target) {
							if (get.attitude(player, target) < 0) {
								if (get.distance(player, target) > 1) return 1;
								return 0.6;
							}
							return 0.3;
						},
					},
				},
			},
			jingleishan: {
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				reverseOrder: true,
				cardcolor: "black",
				cardnature: "thunder",
				filterTarget: function (card, player, target) {
					return target != player;
				},
				content: function () {
					"step 0";
					var next = target.chooseToRespond({ name: "sha" });
					next.ai = function (card) {
						if (get.damageEffect(target, player, target, "thunder") >= 0) return 0;
						if (player.hasSkillTag("notricksource")) return 0;
						if (target.hasSkillTag("notrick")) return 0;
						return 11 - get.value(card);
					};
					next.set("respondTo", [player, card]);
					next.autochoose = lib.filter.autoRespondSha;
					"step 1";
					if (result.bool == false) {
						target.damage("thunder");
					}
				},
				ai: {
					wuxie: function (target, card, player, viewer) {
						if (get.attitude(viewer, target) > 0 && target.countCards("h", "sha")) {
							if (!target.countCards("h") || target.hp == 1 || Math.random() < 0.7) return 0;
						}
					},
					basic: {
						order: 9,
						useful: [5, 1],
						value: 5,
					},
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("nothunder")) return 0;
							if (target.hasUnknown(2)) return 0;
							var nh = target.countCards("h");
							if (lib.config.mode == "identity") {
								if (target.isZhu && nh <= 2 && target.hp <= 1) return -100;
							}
							if (nh == 0) return -2;
							if (nh == 1) return -1.7;
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondSha: 1,
						damage: 1,
						natureDamage: 1,
						thunderDamage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			chiyuxi: {
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				reverseOrder: true,
				cardcolor: "red",
				cardnature: "fire",
				filterTarget: function (card, player, target) {
					return target != player;
				},
				content: function () {
					"step 0";
					var next = target.chooseToRespond({ name: "shan" });
					next.ai = function (card) {
						if (get.damageEffect(target, player, target, "fire") >= 0) return 0;
						if (player.hasSkillTag("notricksource")) return 0;
						if (target.hasSkillTag("notrick")) return 0;
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
					wuxie: function (target, card, player, viewer) {
						if (get.attitude(viewer, target) > 0 && target.countCards("h", "shan")) {
							if (!target.countCards("h") || target.hp == 1 || Math.random() < 0.7) return 0;
						}
					},
					basic: {
						order: 9,
						useful: 1,
						value: 5,
					},
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("nofire")) return 0;
							if (player.hasUnknown(2)) return 0;
							var nh = target.countCards("h");
							if (lib.config.mode == "identity") {
								if (target.isZhu && nh <= 2 && target.hp <= 1) return -100;
							}
							if (nh == 0) return -2;
							if (nh == 1) return -1.7;
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: 1,
						natureDamage: 1,
						fireDamage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			guangshatianyi: {
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				skills: ["guangshatianyi"],
				ai: {
					basic: {
						equipValue: 6,
					},
				},
			},
			guilingzhitao: {
				type: "equip",
				fullskin: true,
				subtype: "equip5",
				skills: ["nigong"],
				ai: {
					equipValue: function (card, player) {
						if (!player.storage.nigong) return 5;
						return 5 + player.storage.nigong;
					},
					basic: {
						equipValue: 5,
					},
				},
				equipDelay: false,
				loseDelay: false,
				clearLose: true,
				onLose: function () {
					player.storage.nigong = 0;
					player.unmarkSkill("nigong");
				},
				onEquip: function () {
					player.storage.nigong = 0;
					player.markSkill("nigong");
				},
			},
			qipoguyu: {
				type: "equip",
				subtype: "equip5",
				skills: ["xujin"],
				equipDelay: false,
				loseDelay: false,
				clearLose: true,
				onLose: function () {
					player.storage.xujin = 0;
				},
				onEquip: function () {
					player.storage.xujin = 0;
				},
			},
			sadengjinhuan: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["sadengjinhuan"],
				ai: {
					basic: {
						equipValue: 5.5,
					},
				},
			},
			sifeizhenmian: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["yiluan"],
				ai: {
					basic: {
						equipValue: 6,
					},
				},
			},
			shuchui: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["shuchui"],
				ai: {
					basic: {
						equipValue: 5.5,
					},
				},
			},
			ximohu: {
				type: "equip",
				subtype: "equip5",
				skills: ["ximohu"],
				ai: {
					basic: {
						equipValue: 6,
					},
				},
			},
			guiyanfadao: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -1 },
				ai: {
					basic: {
						equipValue: 3,
					},
				},
				skills: ["guiyanfadao"],
			},
			qiankundai: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				onLose: function () {
					player.draw();
				},
				skills: ["qiankundai"],
				ai: {
					order: 9.5,
					equipValue: function (card, player) {
						if (player.countCards("h", "qiankundai")) return 6;
						return 1;
					},
					basic: {
						equipValue: 5,
					},
				},
			},
		},
		skill: {
			qiankundai: {
				equipSkill: true,
				mod: {
					maxHandcard: function (player, num) {
						return num + 1;
					},
				},
			},
			g_hufu_sha: {
				enable: ["chooseToRespond", "chooseToUse"],
				filter: function (event, player) {
					return player.countCards("h", "hufu") > 0;
				},
				filterCard: { name: "hufu" },
				viewAs: { name: "sha" },
				prompt: "将一张玉符当杀使用或打出",
				check: function (card) {
					return 1;
				},
				ai: {
					order: 1,
					useful: 7.5,
					value: 7.5,
				},
			},
			g_hufu_shan: {
				enable: ["chooseToRespond", "chooseToUse"],
				filter: function (event, player) {
					return player.countCards("h", "hufu") > 0;
				},
				filterCard: { name: "hufu" },
				viewAs: { name: "shan" },
				prompt: "将一张玉符当闪使用或打出",
				check: function () {
					return 1;
				},
				ai: {
					order: 1,
					useful: 7.5,
					value: 7.5,
				},
			},
			g_hufu_jiu: {
				enable: ["chooseToRespond", "chooseToUse"],
				filter: function (event, player) {
					return player.countCards("h", "hufu") > 0;
				},
				filterCard: { name: "hufu" },
				viewAs: { name: "jiu" },
				prompt: "将一张玉符当酒使用",
				check: function () {
					return 1;
				},
			},
			zhiluxiaohu: {
				trigger: { source: "damageAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && event.getParent(3).name == "zhiluxiaohu";
				},
				content: function () {
					player.draw();
				},
			},
			zhufangshenshi: {
				mod: {
					targetInRange: function (card, player, target, now) {
						if (player.storage.zhufangshenshi == target) return true;
					},
				},
				mark: true,
				intro: {
					content: "player",
				},
				onremove: true,
			},
			g_zhufangshenshi: {
				trigger: { player: "useCardAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.card.name == "zhufangshenshi";
				},
				content: function () {
					player.draw();
				},
			},
			huanpodan_skill: {
				mark: true,
				intro: {
					content: "防止一次死亡，改为弃置所有牌，将体力值变为1并摸一张牌",
				},
				trigger: { player: "dieBefore" },
				forced: true,
				content: function () {
					"step 0";
					trigger.cancel();
					player.discard(player.getCards("he"));
					player.removeSkill("huanpodan_skill");
					"step 1";
					player.changeHp(1 - player.hp);
					"step 2";
					player.draw();
				},
			},
			dujian2: {},
			g_yuchan_swap: {
				trigger: { player: "useCardAfter" },
				silent: true,
				priority: -1,
				content: function () {
					var hs = player.getCards("h");
					var list = ["yuchanqian", "yuchankun", "yuchanzhen", "yuchanxun", "yuchangen", "yuchanli", "yuchankan", "yuchandui"];
					for (var i = 0; i < hs.length; i++) {
						if (hs[i].name.indexOf("yuchan") == 0) {
							hs[i].init([hs[i].suit, hs[i].number, list.randomGet(hs[i].name)]);
						}
					}
				},
			},
			g_yuchan_equip: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					var skills = player.getSkills();
					for (var i = 0; i < skills.length; i++) {
						if (skills[i].indexOf("yuchan") == 0 && skills[i].indexOf("_equip") != -1) {
							return player.countCards("h", { type: "basic" }) > 0;
						}
					}
					return false;
				},
				filterCard: { type: "basic" },
				selectCard: [1, Infinity],
				prompt: "弃置任意张基本牌并摸等量的牌",
				check: function (card) {
					return 6 - get.value(card);
				},
				content: function () {
					player.draw(cards.length);
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			yuchanqian_equip1: {},
			yuchanqian_equip2: {},
			yuchanqian_equip3: {},
			yuchanqian_equip4: {},
			yuchanqian_equip5: {},
			yuchankun_equip1: {},
			yuchankun_equip2: {},
			yuchankun_equip3: {},
			yuchankun_equip4: {},
			yuchankun_equip5: {},
			yuchanzhen_equip1: {},
			yuchanzhen_equip2: {},
			yuchanzhen_equip3: {},
			yuchanzhen_equip4: {},
			yuchanzhen_equip5: {},
			yuchanxun_equip1: {},
			yuchanxun_equip2: {},
			yuchanxun_equip3: {},
			yuchanxun_equip4: {},
			yuchanxun_equip5: {},
			yuchankan_equip1: {},
			yuchankan_equip2: {},
			yuchankan_equip3: {},
			yuchankan_equip4: {},
			yuchankan_equip5: {},
			yuchanli_equip1: {},
			yuchanli_equip2: {},
			yuchanli_equip3: {},
			yuchanli_equip4: {},
			yuchanli_equip5: {},
			yuchangen_equip1: {},
			yuchangen_equip2: {},
			yuchangen_equip3: {},
			yuchangen_equip4: {},
			yuchangen_equip5: {},
			yuchandui_equip1: {},
			yuchandui_equip2: {},
			yuchandui_equip3: {},
			yuchandui_equip4: {},
			yuchandui_equip5: {},
			lianyaohu_skill: {
				equipSkill: true,
				mark: true,
				intro: {
					content: function (storage, player) {
						var card = player.getEquip("lianyaohu");
						if (card && card.storage.shouna && card.storage.shouna.length) {
							return "共有" + get.cnNumber(card.storage.shouna.length) + "张牌";
						}
						return "共有零张牌";
					},
					mark: function (dialog, storage, player) {
						var card = player.getEquip("lianyaohu");
						if (card && card.storage.shouna && card.storage.shouna.length) {
							dialog.addAuto(card.storage.shouna);
						} else {
							return "共有零张牌";
						}
					},
					markcount: function (storage, player) {
						var card = player.getEquip("lianyaohu");
						if (card && card.storage.shouna) return card.storage.shouna.length;
						return 0;
					},
				},
			},
			g_shencaojie: {
				trigger: { source: "damageBegin", player: "damageBegin" },
				direct: true,
				filter: function (event, player) {
					if (get.type(event.card) != "trick") return false;
					if (player.hasCard("shencaojie")) return true;
					return false;
				},
				content: function () {
					player.chooseToUse(
						get.prompt("shencaojie", trigger.player).replace(/发动/, "使用"),
						function (card, player) {
							if (card.name != "shencaojie") return false;
							return lib.filter.cardEnabled(card, player, "forceEnable");
						},
						trigger.player,
						-1
					).targetRequired = true;
				},
			},
			g_shenmiguo: {
				trigger: { player: "useCardAfter" },
				direct: true,
				filter: function (event, player) {
					if (event.parent.name == "g_shenmiguo") return false;
					if (_status.currentPhase != player) return false;
					if (event.parent.parent.name != "phaseUse") return false;
					if (!event.targets || !event.card) return false;
					if (event.card.name == "shenmiguo") return false;
					if (event.card.name == "yuchankan") return false;
					if (player.hasSkill("shenmiguo2")) return false;
					if (get.info(event.card).complexTarget) return false;
					if (!lib.filter.cardEnabled(event.card, player, event.parent)) return false;
					var type = get.type(event.card);
					if (type != "basic" && type != "trick") return false;
					var card = game.createCard(event.card.name, event.card.suit, event.card.number, event.card.nature);
					var targets = event._targets || event.targets;
					for (var i = 0; i < targets.length; i++) {
						if (!targets[i].isIn()) return false;
						if (!player.canUse({ name: event.card.name }, targets[i], false, false)) {
							return false;
						}
					}
					if (player.hasCard("shenmiguo")) return true;
					if (player.hasCard("yuchankan")) return true;
					return false;
				},
				content: function () {
					"step 0";
					var card = game.createCard(trigger.card.name, trigger.card.suit, trigger.card.number, trigger.card.nature);
					player.storage.shenmiguo = [card, (trigger._targets || trigger.targets).slice(0)];
					player
						.chooseToUse(
							"是否使用神秘果？",
							function (card, player) {
								if (card.name != "shenmiguo" && card.name != "yuchankan") return false;
								return lib.filter.cardEnabled(card, player, "forceEnable");
							},
							trigger.player,
							-1
						)
						.set("cardname", trigger.card.name).targetRequired = true;
					"step 1";
					if (result.bool) {
						player.addTempSkill("shenmiguo2");
					}
					delete player.storage.shenmiguo;
				},
			},
			shenmiguo2: {},
			yuruyi: {
				equipSkill: true,
				trigger: { player: "drawBegin" },
				silent: true,
				filter: function () {
					return ui.cardPile.childElementCount > 1;
				},
				content: function () {
					var value = get.value(ui.cardPile.firstChild);
					var num = Math.min(20, ui.cardPile.childElementCount);
					var list = [],
						list2 = [],
						list3 = [];
					for (var i = 1; i < num; i++) {
						var val = get.value(ui.cardPile.childNodes[i]);
						if (val > value) {
							list.push(ui.cardPile.childNodes[i]);
							if (val > value + 1 && val >= 7) {
								list2.push(ui.cardPile.childNodes[i]);
							}
							if (val > value + 1 && val >= 8) {
								list3.push(ui.cardPile.childNodes[i]);
							}
						}
					}
					var card;
					if (list3.length) {
						card = list3.randomGet();
					} else if (list2.length) {
						card = list2.randomGet();
					} else if (list.length) {
						card = list.randomGet();
					}
					if (card) {
						ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
					}
				},
			},
			shuchui: {
				equipSkill: true,
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return player.canUse("sha", target);
				},
				filter: function (event, player) {
					return player.countCards("h", "sha") > 0 && lib.filter.cardUsable({ name: "sha" }, player);
				},
				content: function () {
					"step 0";
					player.addSkill("shuchui2");
					player.storage.shuchui2 = false;
					event.num = 0;
					"step 1";
					var card = player.getCards("h", "sha")[0];
					if (card) {
						player.useCard(card, target);
					} else {
						if (player.storage.shuchui2) {
							player.draw();
						}
						player.removeSkill("shuchui2");
						event.finish();
					}
					"step 2";
					if (event.num++ < 2 && target.isAlive()) {
						event.goto(1);
					} else {
						if (player.storage.shuchui2) {
							player.draw();
						}
						player.removeSkill("shuchui2");
					}
				},
				ai: {
					order: function () {
						return get.order({ name: "sha" }) + 0.11;
					},
					result: {
						target: function (player, target) {
							return get.effect(target, { name: "sha" }, player, target);
						},
					},
				},
			},
			shuchui2: {
				charlotte: true,
				trigger: { source: "damageEnd" },
				forced: true,
				popup: false,
				onremove: true,
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && !player.storage.shuchui2;
				},
				content: function () {
					player.storage.shuchui2 = true;
				},
			},
			xuejibingbao: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				mark: true,
				temp: true,
				intro: {
					content: "摸牌阶段摸牌数+1",
				},
				nopop: true,
				content: function () {
					trigger.num++;
					player.storage.xuejibingbao--;
					if (player.storage.xuejibingbao <= 0) {
						player.removeSkill("xuejibingbao");
						delete player.storage.xuejibingbao;
					} else {
						player.updateMarks();
					}
				},
			},
			gouhunluo: {
				mark: true,
				intro: {
					content: function (storage, player) {
						if (storage == 1) {
							"在" + get.translation(player.storage.gouhunluo2) + "的下个准备阶段失去1点体力并弃置所有手牌";
						}
						return "在" + storage + "轮后" + get.translation(player.storage.gouhunluo2) + "的准备阶段失去1点体力并弃置所有手牌";
					},
				},
				nopop: true,
				temp: true,
				trigger: { global: "phaseBegin" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.storage.gouhunluo2 == event.player;
				},
				content: function () {
					"step 0";
					player.storage.gouhunluo--;
					if (player.storage.gouhunluo <= 0) {
						player.logSkill("gouhunluo");
						player.loseHp();
						player.removeSkill("gouhunluo");
						delete player.storage.gouhunluo;
						delete player.storage.gouhunluo2;
					} else {
						player.updateMarks();
						event.finish();
					}
					"step 1";
					var es = player.getCards("h");
					if (es.length) {
						player.discard(es);
					}
				},
				group: "gouhunluo2",
			},
			gouhunluo2: {
				trigger: { global: "dieBegin" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.storage.gouhunluo2 == event.player;
				},
				content: function () {
					player.removeSkill("gouhunluo");
					delete player.storage.gouhunluo;
					delete player.storage.gouhunluo2;
				},
			},
			jiguanyuan: {
				mark: "card",
				intro: {
					content: "cards",
				},
				trigger: { player: "phaseEnd" },
				forced: true,
				temp: true,
				popup: false,
				content: function () {
					player.gain(player.storage.jiguanyuan, "gain2");
					player.removeSkill("jiguanyuan");
					delete player.storage.jiguanyuan;
				},
			},
			g_qinglongzhigui: {
				trigger: { player: "phaseBegin" },
				forced: true,
				filter: function (event, player) {
					return player.countCards("h", "qinglongzhigui") > 0;
				},
				content: function () {
					"step 0";
					player.showCards(get.translation(player) + "发动了【青龙之圭】", player.getCards("h", "qinglongzhigui"));
					player.draw(2);
					"step 1";
					player.chooseToDiscard("he", true);
				},
			},
			g_baishouzhihu: {
				trigger: { player: "discardEnd" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("h", "baishouzhihu") > 0;
				},
				content: function () {
					"step 0";
					player.chooseTarget([1, 1], get.prompt("baishouzhihu"), function (card, player, target) {
						if (player == target) return false;
						return target.countCards("he") > 0;
					}).ai = function (target) {
						return -get.attitude(player, target);
					};
					"step 1";
					if (result.bool) {
						player.showCards(get.translation(player) + "发动了【白兽之琥】", player.getCards("h", "baishouzhihu"));
						player.logSkill("_baishouzhihu", result.targets);
						result.targets[0].randomDiscard();
						// player.discardPlayerCard(result.targets[0],'he',true);
					} else {
						event.finish();
					}
				},
			},
			g_zhuquezhizhang: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return event.source && event.source != player && event.source.isAlive() && player.countCards("h", "zhuquezhizhang") > 0;
				},
				logTarget: "source",
				check: function (event, player) {
					return get.damageEffect(event.source, player, player, "fire") > 0;
				},
				content: function () {
					"step 0";
					player.showCards(get.translation(player) + "发动了【朱雀之璋】", player.getCards("h", "zhuquezhizhang"));
					trigger.source.damage("fire");
					"step 1";
					game.delay();
				},
			},
			g_xuanwuzhihuang: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return player.countCards("h", "xuanwuzhihuang") > 0 && event.num > 0 && player.hp < player.maxHp;
				},
				content: function () {
					player.showCards(get.translation(player) + "发动了【玄武之璜】", player.getCards("h", "xuanwuzhihuang"));
					player.recover(trigger.num);
				},
			},
			g_huanglinzhicong: {
				trigger: { player: "phaseBegin" },
				forced: true,
				filter: function (event, player) {
					return !player.hujia && player.countCards("h", "huanglinzhicong") > 0;
				},
				content: function () {
					player.showCards(get.translation(player) + "发动了【黄麟之琮】", player.getCards("h", "huanglinzhicong"));
					player.changeHujia();
					player.update();
				},
			},
			g_cangchizhibi: {
				trigger: { player: "phaseBegin" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("h", "cangchizhibi") > 0;
				},
				content: function () {
					"step 0";
					player.chooseTarget([1, 3], get.prompt("cangchizhibi")).ai = function (target) {
						var att = get.attitude(player, target);
						if (target.isLinked()) {
							return att;
						}
						return -att;
					};
					"step 1";
					if (result.bool) {
						player.showCards(get.translation(player) + "发动了【苍螭之璧】", player.getCards("h", "cangchizhibi"));
						player.logSkill("_cangchizhibi", result.targets);
						for (var i = 0; i < result.targets.length; i++) {
							result.targets[i].link();
						}
					}
				},
			},
			cangchizhibi_equip1: {
				trigger: { player: "phaseEnd" },
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("cangchizhibi_duanzao")).ai = function (target) {
						var att = get.attitude(player, target);
						if (target.isLinked()) {
							return att;
						}
						return -att;
					};
					"step 1";
					if (result.bool) {
						player.logSkill("cangchizhibi_equip1", result.targets);
						result.targets[0].link();
					}
				},
			},
			cangchizhibi_equip2: {
				inherit: "cangchizhibi_equip1",
			},
			cangchizhibi_equip3: {
				inherit: "cangchizhibi_equip1",
			},
			cangchizhibi_equip4: {
				inherit: "cangchizhibi_equip1",
			},
			cangchizhibi_equip5: {
				inherit: "cangchizhibi_equip1",
			},
			huanglinzhicong_equip1: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("he", { color: "black" }) > 0 && player.hujia == 0;
				},
				content: function () {
					"step 0";
					var next = player.chooseToDiscard("he", { color: "black" }, get.prompt("huanglinzhicong_duanzao"));
					next.ai = function (card) {
						return 8 - get.value(card);
					};
					next.logSkill = "huanglinzhicong_equip1";
					"step 1";
					if (result.bool) {
						player.changeHujia();
					}
				},
			},
			huanglinzhicong_equip2: {
				inherit: "huanglinzhicong_equip1",
			},
			huanglinzhicong_equip3: {
				inherit: "huanglinzhicong_equip1",
			},
			huanglinzhicong_equip4: {
				inherit: "huanglinzhicong_equip1",
			},
			huanglinzhicong_equip5: {
				inherit: "huanglinzhicong_equip1",
			},
			xuanwuzhihuang_equip1: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("he", { color: "red" }) > 0 && player.hp < player.maxHp;
				},
				content: function () {
					"step 0";
					var next = player.chooseToDiscard("he", { color: "red" }, get.prompt("xuanwuzhihuang_duanzao"));
					next.ai = function (card) {
						if (get.recoverEffect(player, player, player) <= 0) return 0;
						return 8 - get.value(card);
					};
					next.logSkill = "xuanwuzhihuang_equip1";
					"step 1";
					if (result.bool) {
						player.recover();
					}
				},
			},
			xuanwuzhihuang_equip2: {
				inherit: "xuanwuzhihuang_equip1",
			},
			xuanwuzhihuang_equip3: {
				inherit: "xuanwuzhihuang_equip1",
			},
			xuanwuzhihuang_equip4: {
				inherit: "xuanwuzhihuang_equip1",
			},
			xuanwuzhihuang_equip5: {
				inherit: "xuanwuzhihuang_equip1",
			},
			zhuquezhizhang_equip1: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("he", { color: "red" }) > 0;
				},
				content: function () {
					"step 0";
					player.chooseCardTarget({
						position: "he",
						filterTarget: function (card, player, target) {
							return player != target && target.hp >= player.hp;
						},
						filterCard: function (card, player) {
							return get.color(card) == "red" && lib.filter.cardDiscardable(card, player);
						},
						ai1: function (card) {
							return 9 - get.value(card);
						},
						ai2: function (target) {
							return get.damageEffect(target, player, player, "fire");
						},
						prompt: get.prompt("zhuquezhizhang_duanzao"),
					});
					"step 1";
					if (result.bool) {
						event.target = result.targets[0];
						player.logSkill("zhuquezhizhang_equip1", event.target, "fire");
						player.discard(result.cards);
					} else {
						event.finish();
					}
					"step 2";
					if (event.target) {
						event.target.damage("fire");
					}
				},
			},
			zhuquezhizhang_equip2: {
				inherit: "zhuquezhizhang_equip1",
			},
			zhuquezhizhang_equip3: {
				inherit: "zhuquezhizhang_equip1",
			},
			zhuquezhizhang_equip4: {
				inherit: "zhuquezhizhang_equip1",
			},
			zhuquezhizhang_equip5: {
				inherit: "zhuquezhizhang_equip1",
			},
			baishouzhihu_equip1: {
				trigger: { player: "phaseEnd" },
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget([1, 1], get.prompt("baishouzhihu_duanzao"), function (card, player, target) {
						if (player == target) return false;
						return target.countCards("he") > 0;
					}).ai = function (target) {
						return -get.attitude(player, target);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("baishouzhihu_equip1", result.targets);
						result.targets[0].randomDiscard();
						// player.discardPlayerCard(result.targets[0],'he',true);
					} else {
						event.finish();
					}
				},
			},
			baishouzhihu_equip2: {
				inherit: "baishouzhihu_equip1",
			},
			baishouzhihu_equip3: {
				inherit: "baishouzhihu_equip1",
			},
			baishouzhihu_equip4: {
				inherit: "baishouzhihu_equip1",
			},
			baishouzhihu_equip5: {
				inherit: "baishouzhihu_equip1",
			},
			qinglongzhigui_equip1: {
				trigger: { player: "phaseEnd" },
				forced: true,
				content: function () {
					player.draw();
				},
			},
			qinglongzhigui_equip2: {
				inherit: "qinglongzhigui_equip1",
			},
			qinglongzhigui_equip3: {
				inherit: "qinglongzhigui_equip1",
			},
			qinglongzhigui_equip4: {
				inherit: "qinglongzhigui_equip1",
			},
			qinglongzhigui_equip5: {
				inherit: "qinglongzhigui_equip1",
			},
			kunlunjingc: {
				equipSkill: true,
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				delay: false,
				content: function () {
					"step 0";
					var cards = get.cards(3);
					event.cards = cards;
					player.chooseCardButton("选择一张牌", cards, true);
					"step 1";
					event.card = result.links[0];
					player.chooseCard("h", true, "用一张手牌替换" + get.translation(event.card));
					"step 2";
					if (result.bool) {
						event.cards[event.cards.indexOf(event.card)] = result.cards[0];
						player.lose(result.cards, ui.special);
						var cardx = ui.create.card();
						cardx.classList.add("infohidden");
						cardx.classList.add("infoflip");
						player.$throw(cardx, 1000, "nobroadcast");
					} else {
						event.finish();
					}
					"step 3";
					player.gain(event.card);
					player.$draw();
					for (var i = event.cards.length - 1; i >= 0; i--) {
						event.cards[i].fix();
						ui.cardPile.insertBefore(event.cards[i], ui.cardPile.firstChild);
					}
					game.delay();
				},
				ai: {
					order: 10,
					result: {
						player: 1,
					},
				},
			},
			lianhua: {
				equipSkill: true,
				enable: "phaseUse",
				filter: function (event, player) {
					var hu = player.getEquip("lianyaohu");
					if (hu && hu.storage.shouna && hu.storage.shouna.length > 1) {
						return true;
					}
					return false;
				},
				usable: 1,
				delay: false,
				content: function () {
					"step 0";
					event.hu = player.getEquip("lianyaohu");
					player.chooseCardButton("弃置两张壶中的牌，然后从牌堆中获得一张类别不同的牌", 2, event.hu.storage.shouna).ai = function () {
						return 1;
					};
					"step 1";
					if (result.bool) {
						var type = [];
						player.$throw(result.links);
						game.log(player, "弃置了", result.links);
						for (var i = 0; i < result.links.length; i++) {
							event.hu.storage.shouna.remove(result.links[i]);
							result.links[i].discard();
							type.add(get.type(result.links[i], "trick"));
						}
						for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
							if (!type.includes(get.type(ui.cardPile.childNodes[i], "trick"))) {
								player.gain(ui.cardPile.childNodes[i], "gain");
								break;
							}
						}
					} else {
						player.getStat("skill").lianhua--;
					}
				},
				ai: {
					order: 11,
					result: {
						player: 1,
					},
				},
			},
			shouna: {
				equipSkill: true,
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				usable: 1,
				filterCard: true,
				check: function (card) {
					return 6 - get.value(card);
				},
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("h") > 0;
				},
				content: function () {
					"step 0";
					var card = target.getCards("h").randomGet();
					var hu = player.getEquip("lianyaohu");
					if (card && hu) {
						if (!hu.storage.shouna) {
							hu.storage.shouna = [];
						}
						target.$give(card, player);
						target.lose(card, ui.special);
						event.card = card;
						event.hu = hu;
					}
					"step 1";
					if (!event.card._selfDestroyed) {
						event.hu.storage.shouna.push(event.card);
						player.updateMarks();
					}
				},
				ai: {
					order: 5,
					result: {
						target: function (player, target) {
							return -1 / Math.sqrt(1 + target.countCards("h"));
						},
					},
				},
			},
			donghuangzhong: {
				equipSkill: true,
				trigger: { player: "phaseEnd" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("h", { color: "red" }) > 0;
				},
				content: function () {
					"step 0";
					player.chooseCardTarget({
						filterTarget: true,
						filterCard: function (card, player, event) {
							if (get.color(card) != "red") return false;
							return lib.filter.cardDiscardable(card, player, event);
						},
						ai1: function (card) {
							return 8 - get.useful(card);
						},
						ai2: function (target) {
							return -get.attitude(player, target);
						},
						prompt: get.prompt("donghuangzhong"),
					});
					"step 1";
					if (result.bool) {
						player.logSkill("donghuangzhong", result.targets);
						player.discard(result.cards);
						event.target = result.targets[0];
					} else {
						event.finish();
					}
					"step 2";
					var target = event.target;
					var list = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						var info = lib.card[lib.inpile[i]];
						if (info.type == "delay" && !info.cancel && !target.hasJudge(lib.inpile[i])) {
							list.push(lib.inpile[i]);
						}
					}
					if (list.length) {
						var card = game.createCard(list.randomGet());
						target.addJudge(card);
						target.$draw(card);
						game.delay();
					}
				},
			},
			xuanyuanjian: {
				equipSkill: true,
				trigger: { player: "changeHp" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return !player.hasSkill("xuanyuan") && player.hp <= 2;
				},
				content: function () {
					var e1 = player.getEquip("xuanyuanjian");
					if (e1) {
						player.discard(e1);
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			xuanyuanjian2: {
				equipSkill: true,
				trigger: { source: "damageBefore" },
				forced: true,
				filter: function (event) {
					return event.notLink();
				},
				content: function () {
					trigger.num++;
					trigger._xuanyuanjian = true;
					if (!trigger.nature) trigger.nature = "thunder";
				},
			},
			xuanyuanjian3: {
				equipSkill: true,
				trigger: { source: "damageAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event._xuanyuanjian && !player.hasSkill("xuanyuan");
				},
				content: function () {
					player.loseHp();
				},
			},
			pangufu: {
				equipSkill: true,
				trigger: { source: "damageEnd" },
				forced: true,
				priority: 55,
				filter: function (event) {
					if (event._notrigger.includes(event.player)) return false;
					return event.player.countCards("he") > 0;
				},
				content: function () {
					trigger.player.chooseToDiscard(true, "he");
				},
			},
			haotianta: {
				equipSkill: true,
				trigger: { global: "judgeBefore" },
				direct: true,
				content: function () {
					"step 0";
					event.cards = get.cards(2);
					player.chooseCardButton(true, event.cards, "昊天塔：选择一张牌作为" + get.translation(trigger.player) + "的" + trigger.judgestr + "判定结果").ai = function (button) {
						if (get.attitude(player, trigger.player) > 0) {
							return 1 + trigger.judge(button.link);
						}
						if (get.attitude(player, trigger.player) < 0) {
							return 1 - trigger.judge(button.link);
						}
						return 0;
					};
					"step 1";
					if (!result.bool) {
						event.finish();
						return;
					}
					player.logSkill("haotianta", trigger.player);
					var card = result.links[0];
					event.cards.remove(card);
					var judgestr = get.translation(trigger.player) + "的" + trigger.judgestr + "判定";
					event.videoId = lib.status.videoId++;
					event.dialog = ui.create.dialog(judgestr);
					event.dialog.classList.add("center");
					event.dialog.videoId = event.videoId;

					game.addVideo("judge1", player, [get.cardInfo(card), judgestr, event.videoId]);
					for (var i = 0; i < event.cards.length; i++) event.cards[i].discard();
					// var node=card.copy('thrown','center',ui.arena).addTempClass('start');
					var node;
					if (game.chess) {
						node = card.copy("thrown", "center", ui.arena).addTempClass("start");
					} else {
						node = player.$throwordered(card.copy(), true);
					}
					node.classList.add("thrownhighlight");
					ui.arena.classList.add("thrownhighlight");
					if (card) {
						trigger.cancel();
						trigger.result = {
							card: card,
							judge: trigger.judge(card),
							node: node,
							number: get.number(card),
							suit: get.suit(card),
							color: get.color(card),
						};
						if (trigger.result.judge > 0) {
							trigger.result.bool = true;
							trigger.player.popup("判定生效");
						}
						if (trigger.result.judge < 0) {
							trigger.result.bool = false;
							trigger.player.popup("判定失效");
						}
						game.log(trigger.player, "的判定结果为", card);
						trigger.direct = true;
						trigger.position.appendChild(card);
						game.delay(2);
					} else {
						event.finish();
					}
					"step 2";
					ui.arena.classList.remove("thrownhighlight");
					event.dialog.close();
					game.addVideo("judge2", null, event.videoId);
					ui.clear();
					var card = trigger.result.card;
					trigger.position.appendChild(card);
					trigger.result.node.delete();
					game.delay();
				},
				ai: {
					tag: {
						rejudge: 1,
					},
				},
			},
			shennongding: {
				equipSkill: true,
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				selectCard: 2,
				check: function (card) {
					if (get.tag(card, "recover") >= 1) return 0;
					return 7 - get.value(card);
				},
				filter: function (event, player) {
					return player.hp < player.maxHp && player.countCards("h") >= 2;
				},
				content: function () {
					player.recover();
				},
				ai: {
					result: {
						player: function (player) {
							return get.recoverEffect(player);
						},
					},
					order: 2.5,
				},
			},
			kongdongyin: {
				equipSkill: true,
				trigger: { player: "dieBefore" },
				forced: true,
				filter: function (event, player) {
					return player.maxHp > 0;
				},
				content: function () {
					trigger.cancel();
					player.hp = 1;
					player.draw();
					player.discard(player.getCards("e", { subtype: "equip5" }));
					game.delay();
				},
			},
			nvwashi: {
				equipSkill: true,
				trigger: { global: "dying" },
				priority: 6,
				filter: function (event, player) {
					return event.player.hp <= 0 && player.hp > 1;
				},
				check: function (event, player) {
					return get.attitude(player, event.player) >= 3 && !event.player.hasSkillTag("nosave");
				},
				logTarget: "player",
				content: function () {
					"step 0";
					trigger.player.recover();
					"step 1";
					player.loseHp();
				},
				ai: {
					threaten: 1.2,
					expose: 0.2,
				},
			},
			kongxin: {
				equipSkill: true,
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return player.canCompare(target);
				},
				filter: function (event, player) {
					return (
						player.countCards("h") &&
						game.hasPlayer(function (current) {
							return player.canCompare(current);
						})
					);
				},
				content: function () {
					"step 0";
					player.chooseToCompare(target);
					"step 1";
					if (result.bool) {
						event.bool = true;
						player.chooseTarget("选择一个目标视为" + get.translation(target) + "对其使用一张杀", function (card, player, target2) {
							return player != target2 && target.canUse("sha", target2);
						}).ai = function (target2) {
							return get.effect(target2, { name: "sha" }, target, player);
						};
					} else {
						target.discardPlayerCard(player);
					}
					"step 2";
					if (event.bool && result.bool) {
						target.useCard({ name: "sha" }, result.targets);
					}
				},
				ai: {
					order: 7,
					result: {
						target: function (player, target) {
							if (player.countCards("h") <= 1) return 0;
							if (get.attitude(player, target) >= 0) return 0;
							if (
								game.hasPlayer(function (current) {
									return player != current && target.canUse("sha", current) && get.effect(current, { name: "sha" }, target, player) > 0;
								})
							) {
								return -1;
							}
							return 0;
						},
					},
				},
			},
			kongxin2: {
				trigger: { player: "dying" },
				priority: 10,
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player == game.me;
				},
				content: function () {
					player.removeSkill("kongxin2");
					game.swapPlayer(player);
					player.storage.kongxin.lockOut = false;
					player.storage.kongxin.out();
					if (player == game.me) game.swapPlayer(player.storage.kongxin);
					if (lib.config.mode == "identity") player.storage.kongxin.setIdentity();
					delete player.storage.kongxin;
				},
			},
			qinglianxindeng: {
				equipSkill: true,
				trigger: { player: "damageBefore" },
				forced: true,
				priority: 15,
				filter: function (event, player) {
					if (
						event.source &&
						event.source.hasSkillTag("unequip", false, {
							name: event.card ? event.card.name : null,
							target: player,
							card: event.card,
						})
					)
						return false;
					return get.type(event.card, "trick") == "trick";
				},
				content: function () {
					trigger.cancel();
				},
				ai: {
					notrick: true,
					effect: {
						target: function (card, player, target, current) {
							if (
								player.hasSkillTag("unequip", false, {
									name: card ? card.name : null,
									target: player,
									card: card,
								})
							)
								return;
							if (get.type(card) == "trick" && get.tag(card, "damage")) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			yiluan: {
				equipSkill: true,
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("h");
				},
				content: function () {
					"step 0";
					target.judge();
					"step 1";
					if (result.suit != "heart") {
						var hs = target.getCards("h");
						while (hs.length) {
							var chosen = hs.randomRemove();
							if (target.hasUseTarget(chosen) && !get.info(chosen).multitarget) {
								var list = game.filterPlayer(function (current) {
									return lib.filter.targetEnabled2(chosen, target, current);
								});
								if (list.length) {
									target.useCard(chosen, list.randomGet());
									event.finish();
									break;
								}
							}
						}
					}
				},
				ai: {
					order: 10,
					result: {
						target: function (player, target) {
							if (!target.countCards("h")) return 0;
							return -1;
						},
					},
				},
			},
			hslingjian_xuanfengzhiren_equip1: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event) {
					if (event._notrigger.includes(event.player)) return false;
					return event.card && event.card.name == "sha" && event.player.countCards("he");
				},
				content: function () {
					trigger.player.discard(trigger.player.getCards("he").randomGet());
				},
			},
			hslingjian_xuanfengzhiren_equip2: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter: function (event) {
					return event.card && event.card.name == "sha" && event.source && event.source.countCards("he");
				},
				content: function () {
					trigger.source.discard(trigger.source.getCards("he").randomGet());
				},
			},
			hslingjian_xuanfengzhiren_equip3: {
				trigger: { player: "loseAfter" },
				forced: true,
				filter: function (event, player) {
					return _status.currentPhase != player && !player.hasSkill("hslingjian_xuanfengzhiren_equip3_dist");
				},
				content: function () {
					player.addTempSkill("hslingjian_xuanfengzhiren_equip3_dist");
				},
			},
			hslingjian_xuanfengzhiren_equip3_dist: {
				mod: {
					globalTo: function (from, to, distance) {
						return distance + 1;
					},
				},
			},
			hslingjian_xuanfengzhiren_equip4: {
				trigger: { player: "loseAfter" },
				forced: true,
				filter: function (event, player) {
					return _status.currentPhase == player && !player.hasSkill("hslingjian_xuanfengzhiren_equip4_dist");
				},
				content: function () {
					player.addTempSkill("hslingjian_xuanfengzhiren_equip4_dist");
				},
			},
			hslingjian_xuanfengzhiren_equip4_dist: {
				mod: {
					globalFrom: function (from, to, distance) {
						return distance - 1;
					},
				},
			},
			hslingjian_xuanfengzhiren_equip5: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				position: "he",
				filter: function (event, player) {
					return player.countCards("he") > 0;
				},
				filterTarget: function (card, player, target) {
					return target.countCards("he") > 0;
				},
				check: function (card) {
					return 5 - get.value(card);
				},
				content: function () {
					target.discard(target.getCards("he").randomGet());
				},
				ai: {
					order: 5,
					result: {
						target: function (player, target) {
							var dh = player.countCards("he") - target.countCards("he");
							if (dh > 0) {
								return -Math.sqrt(dh);
							}
							return 0;
						},
					},
				},
			},
			hslingjian_zhongxinghujia_equip1: {
				trigger: { source: "damageEnd" },
				check: function (event, player) {
					return !player.getEquip(2);
				},
				filter: function (event) {
					return event.card && event.card.name == "sha";
				},
				content: function () {
					var card = game.createCard(get.inpile("equip2").randomGet());
					player.equip(card);
					player.$draw(card);
					game.delay();
				},
			},
			hslingjian_zhongxinghujia_equip2: {
				trigger: { player: "damageEnd" },
				check: function (event, player) {
					return get.attitude(player, event.source) < 0;
				},
				filter: function (event) {
					return event.card && event.card.name == "sha" && event.source && event.source.getEquip(2);
				},
				content: function () {
					player.line(trigger.source, "green");
					trigger.source.discard(trigger.source.getEquip(2));
				},
			},
			hslingjian_zhongxinghujia_equip3: {
				mod: {
					globalTo: function (from, to, distance) {
						if (to.getEquip(2)) return distance + 1;
					},
				},
			},
			hslingjian_zhongxinghujia_equip4: {
				mod: {
					globalFrom: function (from, to, distance) {
						if (from.getEquip(2)) return distance - 1;
					},
				},
			},
			hslingjian_zhongxinghujia_equip5: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				position: "he",
				filterTarget: true,
				selectCard: 2,
				filter: function (event, player) {
					return player.countCards("he") >= 2;
				},
				check: function (card) {
					return 5 - get.value(card);
				},
				content: function () {
					var card = game.createCard(get.inpile("equip2").randomGet());
					target.equip(card);
					target.$draw(card);
					game.delay();
				},
				ai: {
					order: 1,
					result: {
						target: function (player, target) {
							if (target.getEquip(2)) return 0;
							return 1;
						},
					},
				},
			},
			hslingjian_jinjilengdong_equip1: {
				trigger: { source: "damageEnd" },
				check: function (event, player) {
					if (event.player.hasSkillTag("noturn")) return 0;
					if (event.player.isTurnedOver()) {
						return get.attitude(player, event.player) > 0;
					}
					return get.attitude(player, event.player) <= 0;
				},
				filter: function (event) {
					if (event._notrigger.includes(event.player)) return false;
					return event.card && event.card.name == "sha" && event.player && event.player.isAlive();
				},
				logTarget: "player",
				content: function () {
					trigger.player.draw(2);
					trigger.player.turnOver();
				},
			},
			hslingjian_jinjilengdong_equip2: {
				trigger: { player: "damageEnd" },
				check: function (event, player) {
					if (event.player.hasSkillTag("noturn")) return 0;
					if (event.player.isTurnedOver()) {
						return get.attitude(player, event.source) > 0;
					}
					return get.attitude(player, event.source) <= 0;
				},
				filter: function (event) {
					return event.card && event.card.name == "sha" && event.source && event.source.isAlive();
				},
				logTarget: "source",
				content: function () {
					player.line(trigger.source, "green");
					trigger.source.draw(2);
					trigger.source.turnOver();
				},
			},
			hslingjian_jinjilengdong_equip3: {
				mod: {
					globalTo: function (from, to, distance) {
						if (to.isTurnedOver()) return distance + 2;
					},
				},
			},
			hslingjian_jinjilengdong_equip4: {
				mod: {
					globalFrom: function (from, to, distance) {
						if (from.isTurnedOver()) return distance - 2;
					},
				},
			},
			hslingjian_jinjilengdong_equip5: {
				trigger: { player: "phaseAfter" },
				direct: true,
				filter: function (event, player) {
					return !player.isTurnedOver();
				},
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("hslingjian_jinjilengdong_duanzao"), function (card, player, target) {
						return player != target && !target.isTurnedOver();
					}).ai = function (target) {
						if (target.hasSkillTag("noturn")) return 0;
						return Math.max(0, -get.attitude(player, target) - 2);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("hslingjian_jinjilengdong_equip5", result.targets);
						player.turnOver();
						result.targets[0].turnOver();
						game.asyncDraw([player, result.targets[0]], 2);
					}
				},
			},
			hslingjian_yinmilichang_equip1: {
				trigger: { source: "damageEnd" },
				direct: true,
				filter: function (event) {
					return event.card && event.card.name == "sha";
				},
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("hslingjian_yinmilichang_duanzao"), function (card, player, target) {
						return target != player && !target.hasSkill("qianxing");
					}).ai = function (target) {
						var att = get.attitude(player, target);
						if (get.distance(player, target, "absolute") <= 1) return 0;
						if (target.hp == 1) return 2 * att;
						if (target.hp == 2 && target.countCards("h") <= 2) return 1.2 * att;
						return att;
					};
					"step 1";
					if (result.bool) {
						player.logSkill("hslingjian_yinmilichang_equip1", result.targets);
						result.targets[0].tempHide();
					}
				},
			},
			hslingjian_yinmilichang_equip2: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return !player.hasSkill("qianxing");
				},
				content: function () {
					player.addTempSkill("qianxing");
				},
			},
			hslingjian_yinmilichang_equip3: {
				mod: {
					globalTo: function (from, to, distance) {
						if (to.hp == 1) return distance + 1;
					},
				},
			},
			hslingjian_yinmilichang_equip4: {
				mod: {
					globalFrom: function (from, to, distance) {
						if (from.hp == 1) return distance - 1;
					},
				},
			},
			hslingjian_yinmilichang_equip5: {
				mod: {
					targetEnabled: function (card, player, target, now) {
						if (target.countCards("h") == 0) {
							if (card.name == "sha" || card.name == "juedou") return false;
						}
					},
				},
				ai: {
					noh: true,
					skillTagFilter: function (player, tag) {
						if (tag == "noh") {
							if (player.countCards("h") != 1) return false;
						}
					},
				},
			},
			hslingjian_xingtigaizao_equip1: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event) {
					return event.card && event.card.name == "sha";
				},
				content: function () {
					player.draw();
				},
			},
			hslingjian_xingtigaizao_equip2: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter: function (event) {
					return event.card && event.card.name == "sha";
				},
				content: function () {
					player.draw();
				},
			},
			hslingjian_xingtigaizao_equip3: {
				mod: {
					globalTo: function (from, to, distance) {
						return distance + 1;
					},
					globalFrom: function (from, to, distance) {
						return distance + 1;
					},
				},
			},
			hslingjian_xingtigaizao_equip4: {
				mod: {
					globalTo: function (from, to, distance) {
						return distance - 1;
					},
					globalFrom: function (from, to, distance) {
						return distance - 1;
					},
				},
			},
			hslingjian_xingtigaizao_equip5: {
				mod: {
					maxHandcard: function (player, num) {
						return num - 1;
					},
				},
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				content: function () {
					trigger.num++;
				},
			},
			hslingjian_shengxiuhaojiao_equip1: {
				trigger: { player: "shaBegin" },
				forced: true,
				filter: function (event, player) {
					return event.target.hasSkill("hslingjian_chaofeng");
				},
				content: function () {
					trigger.directHit = true;
				},
			},
			hslingjian_shengxiuhaojiao_equip2: {
				mod: {
					targetEnabled: function (card, player, target) {
						if (player.hasSkill("hslingjian_chaofeng")) return false;
					},
				},
			},
			hslingjian_shengxiuhaojiao_equip3: {
				mod: {
					globalTo: function (from, to, distance) {
						if (to.hp < to.countCards("h")) return distance + 1;
					},
				},
			},
			hslingjian_shengxiuhaojiao_equip4: {
				mod: {
					globalFrom: function (from, to, distance) {
						if (from.hp < from.countCards("h")) return distance - 1;
					},
				},
			},
			hslingjian_shengxiuhaojiao_equip5: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				selectCard: 2,
				check: function (card) {
					return 5 - get.value(card);
				},
				position: "he",
				filterTarget: true,
				content: function () {
					if (target.hasSkill("hslingjian_chaofeng")) {
						target.removeSkill("hslingjian_chaofeng");
					} else {
						target.addSkill("hslingjian_chaofeng");
					}
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							if (target.hasSkill("hslingjian_chaofeng")) {
								return -Math.sqrt(target.hp + target.countCards("h"));
							}
							return 0;
						},
					},
				},
			},
			hslingjian_shijianhuisu_equip1: {
				trigger: { player: "equipEnd" },
				forced: true,
				filter: function (event, player) {
					return get.subtype(event.card) == "equip2";
				},
				content: function () {
					player.draw();
				},
			},
			hslingjian_shijianhuisu_equip2: {
				trigger: { player: "equipEnd" },
				forced: true,
				filter: function (event, player) {
					return get.subtype(event.card) == "equip1";
				},
				content: function () {
					player.draw();
				},
			},
			hslingjian_shijianhuisu_equip3: {
				mod: {
					globalTo: function (from, to, distance) {
						if (to.countCards("e") == 1) return distance + 1;
					},
				},
			},
			hslingjian_shijianhuisu_equip4: {
				mod: {
					globalFrom: function (from, to, distance) {
						if (from.countCards("e") == 1) return distance - 1;
					},
				},
			},
			hslingjian_shijianhuisu_equip5: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				selectCard: 1,
				filterTarget: function (card, player, target) {
					return player != target && target.countCards("he") > 0;
				},
				position: "he",
				content: function () {
					var es = target.getCards("e");
					target.gain(es);
					target.$gain2(es);
				},
				check: function (card) {
					return 4 - get.value(card);
				},
				ai: {
					order: 5,
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("noe")) return target.countCards("e") * 2;
							return -target.countCards("e");
						},
					},
				},
			},
			jiguanyaoshu_skill: {
				trigger: { player: "loseEnd" },
				forced: true,
				filter: function (event, player) {
					if (_status.currentPhase == player) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "e") return true;
					}
					return false;
				},
				content: function () {
					var num = 0;
					for (var i = 0; i < trigger.cards.length; i++) {
						if (trigger.cards[i].original == "e") num++;
					}
					var list = get.typeCard("hslingjian");
					if (get.mode() == "stone") {
						list.remove("hslingjian_jinjilengdong");
					}
					if (list.length) {
						list = list.randomGets(num);
						for (var i = 0; i < list.length; i++) {
							list[i] = game.createCard(list[i]);
						}
						player.gain(list, "gain2");
					}
				},
			},
			lingjianduanzao: {
				process: function (cards) {
					var equip;
					for (var i = 0; i < cards.length; i++) {
						if (get.type(cards[i]) == "equip") {
							equip = cards[i];
							cards.splice(i--, 1);
							break;
						}
					}
					var name = equip.name;
					var type = get.type(cards[0]);
					var equipname = equip.name;
					if (type == "hslingjian") {
						name += cards[0].name.slice(10);
					} else {
						name += "_" + cards[0].name;
					}
					if (lib.card[name]) return name;
					lib.card[name] = get.copy(lib.card[equip.name]);
					lib.card[name].cardimage = lib.card[name].cardimage || equip.name;
					lib.card[name].vanish = true;
					lib.card[name].source = [equip.name, cards[0].name];
					if (type == "jiqi") {
						lib.card[name].legend = true;
					} else {
						lib.card[name].epic = true;
					}
					var dvalue = type == "jiqi" ? 3 : 1;
					var getValue = function (value, dvalue) {
						if (dvalue == 1) return Math.min(10, value + dvalue);
						value += dvalue;
						if (value > 10) return 10 + (value - 10) / 10;
						if (value < 9) return 8 + value / 10;
						return value;
					};
					if (typeof lib.card[name].ai.equipValue == "number") {
						lib.card[name].ai.equipValue = getValue(lib.card[name].ai.equipValue, dvalue);
					} else if (typeof lib.card[name].ai.equipValue == "function") {
						lib.card[name].ai.equipValue = function () {
							return getValue(lib.card[equipname].ai.equipValue.apply(this, arguments), dvalue);
						};
					} else if (lib.card[name].ai.basic && typeof lib.card[name].ai.basic.equipValue == "number") {
						lib.card[name].ai.basic.equipValue = getValue(lib.card[name].ai.basic.equipValue, dvalue);
					} else if (lib.card[name].ai.basic && typeof lib.card[name].ai.basic.equipValue == "function") {
						lib.card[name].ai.basic.equipValue = function () {
							return getValue(lib.card[equipname].ai.basic.equipValue.apply(this, arguments), dvalue);
						};
					} else {
						if (dvalue == 3) {
							lib.card[name].ai.equipValue = 7;
						} else {
							lib.card[name].ai.equipValue = dvalue;
						}
					}
					if (Array.isArray(lib.card[name].skills)) {
						lib.card[name].skills = lib.card[name].skills.slice(0);
					} else {
						lib.card[name].skills = [];
					}
					// lib.card[name].filterTarget=function(card,player,target){
					// 	return !target.isMin();
					// };
					// lib.card[name].selectTarget=1;
					// lib.card[name].range={global:1};
					var str = lib.translate[cards[0].name + "_duanzao"];
					var str2 = get.translation(equip.name, "skill");
					lib.translate[name] = str + str2;
					str2 = lib.translate[equip.name + "_info"] || "";
					if (str2[str2.length - 1] == "." || str2[str2.length - 1] == "。") {
						str2 = str2.slice(0, str2.length - 1);
					}
					for (var i = 0; i < cards.length; i++) {
						for (var j = 1; j <= 5; j++) {
							lib.translate[cards[i].name + "_equip" + j] = lib.translate[cards[i].name + "_duanzao"];
						}
						var name2 = cards[i].name + "_" + get.subtype(equip);
						lib.card[name].skills.add(name2);
						str2 += "；" + lib.translate[name2 + "_info"];
					}
					lib.translate[name + "_info"] = str2;
					try {
						game.addVideo("newcard", null, {
							name: name,
							translate: lib.translate[name],
							info: str2,
							card: equip.name,
							legend: type == "jiqi",
							epic: type == "hslingjian",
						});
					} catch (e) {
						console.log(e);
					}
					return name;
				},
			},
			_lingjianduanzao: {
				enable: "phaseUse",
				position: "he",
				discard: false,
				losetrigger: false,
				longprompt: true,
				prompt: function (event) {
					var lingjians = [],
						types = [];
					var hs = event.player.getCards("he");
					for (var i = 0; i < hs.length; i++) {
						switch (get.type(hs[i])) {
							case "equip":
								types.add(get.subtype(hs[i]));
								break;
							case "hslingjian":
								lingjians.add(hs[i].name);
								break;
							case "jiqi":
								if (!lingjians.includes(hs[i].name)) lingjians.unshift(hs[i].name);
								break;
						}
					}
					var str = "";
					for (var i = 0; i < lingjians.length; i++) {
						var color;
						var type = get.type(lingjians[i]);
						if (type == "jiqi") {
							color = "rgba(233, 131, 255,0.2);";
						} else {
							color = "rgba(117,186,255,0.2);";
						}
						str += '<div style="text-align:left;line-height:18px;border-radius:4px;margin-top:7px;margin-bottom:10px;position:relative;width:100%">';
						str += '<div class="shadowed" style="position:absolute;left0;top:0;padding:5px;border-radius:4px;background:' + color + '">' + lib.translate[lingjians[i]] + "</div>";
						for (var j = 0; j < types.length; j++) {
							str += '<div class="shadowed" style="position:relative;left:85px;width:calc(100% - 95px);height:100%;padding:5px;border-radius: 4px;margin-bottom:10px">' + (type != "jiqi" ? lib.translate[types[j]] + "：" : "") + lib.translate[lingjians[i] + "_" + types[j] + "_info"] + "</div>";
							if (type == "jiqi") break;
						}
						str += "</div>";
					}
					return str;
				},
				check: function (card) {
					if (get.type(card) == "jiqi") {
						if (_status.event.player.needsToDiscard()) {
							return 0.5;
						}
						return 0;
					}
					var num = 1 + get.value(card);
					if (get.position(card) == "e") {
						num += 0.1;
					}
					return num;
				},
				filterCard: function (card) {
					var type = get.type(card);
					if (type == "equip") {
						if (!lib.inpile.includes(card.name)) return false;
						if (lib.card[card.name].nopower) return false;
						if (lib.card[card.name].unique) return false;
						if (card.nopower) return false;
					}
					if (ui.selected.cards.length) {
						var type2 = get.type(ui.selected.cards[0]);
						if (type2 == "equip") {
							return type == "hslingjian" || type == "jiqi";
						} else {
							return type == "equip";
						}
					} else {
						return type == "equip" || type == "hslingjian" || type == "jiqi";
					}
				},
				selectCard: 2,
				complexCard: true,
				filter: function (event, player) {
					if (!player.countCards("h", { type: ["hslingjian", "jiqi"] })) return false;
					var es = player.getCards("he", { type: "equip" });
					for (var i = 0; i < es.length; i++) {
						if (lib.inpile.includes(es[i].name) && !lib.card[es[i].name].nopower && !lib.card[es[i].name].unique && !es[i].nopower) {
							return true;
						}
					}
					return false;
				},
				prepare: "throw",
				content: function () {
					"step 0";
					for (var i = 0; i < cards.length; i++) {
						cards[i].discard();
					}
					var name = lib.skill.lingjianduanzao.process(cards);
					var card = game.createCard(name);
					player.chooseTarget(
						function (card, player, target) {
							return !target.isMin() && get.distance(player, target) <= 1;
						},
						"选择一个目标装备" + get.translation(card.name),
						true
					).ai = function (target) {
						return get.effect(target, card, player, player);
					};
					event.card = card;
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						target.equip(event.card)._triggered = null;
						target.$gain2(event.card);
						game.delay();
					} else {
						player.gain(event.card, "gain2");
					}
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			hslingjian_chaofeng: {
				global: "hslingjian_chaofeng_disable",
				nopop: true,
				unique: true,
				gainable: true,
				mark: true,
				intro: {
					content: "锁定技，与你相邻的角色只能选择你为出杀目标",
				},
				subSkill: {
					disable: {
						mod: {
							targetEnabled: function (card, player, target) {
								if (player.hasSkill("hslingjian_chaofeng")) return;
								if (card.name == "sha") {
									if (target.hasSkill("hslingjian_chaofeng")) return;
									if (
										game.hasPlayer(function (current) {
											return current.hasSkill("hslingjian_chaofeng") && get.distance(player, current, "pure") <= 1;
										})
									) {
										return false;
									}
								}
							},
						},
					},
				},
			},
			hslingjian_xingtigaizao: {
				nopop: true,
				mod: {
					maxHandcard: function (player, num) {
						if (typeof player.storage.hslingjian_xingtigaizao == "number") {
							return num - player.storage.hslingjian_xingtigaizao;
						}
					},
				},
				mark: true,
				intro: {
					content: "手牌上限-#",
				},
				trigger: { player: "phaseEnd" },
				silent: true,
				temp: true,
				vanish: true,
				content: function () {
					player.removeSkill("hslingjian_xingtigaizao");
					player.storage.hslingjian_xingtigaizao = 0;
				},
			},
			hslingjian_jinjilengdong: {
				mark: true,
				nopop: true,
				temp: true,
				intro: {
					content: "不能使用卡牌，也不能成为卡牌的目标",
				},
				mod: {
					targetEnabled: function (card, player, target) {
						return false;
					},
					cardEnabled: function (card, player) {
						return false;
					},
				},
			},
			qinglonglingzhu: {
				equipSkill: true,
				trigger: { source: "damageEnd" },
				direct: true,
				filter: function (event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return event.hasNature() && event.player && event.player.isAlive();
				},
				content: function () {
					player.gainPlayerCard(
						get.prompt("qinglonglingzhu", trigger.player),
						trigger.player,
						function (button) {
							if (get.attitude(player, trigger.player) <= 0) {
								return get.buttonValue(button);
							}
							return 0;
						},
						"he"
					).logSkill = ["qinglonglingzhu", trigger.player];
				},
			},
			xingjunyan: {
				equipSkill: true,
				trigger: { source: "damageBegin", player: "damageBegin" },
				forced: true,
				filter: function (event, player) {
					return event.card && event.card.name == "sha";
				},
				content: function () {
					trigger.num++;
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (card.name == "sha") {
								return [1, -2];
							}
						},
					},
				},
			},
			baihupifeng: {
				equipSkill: true,
				trigger: { player: "phaseEnd" },
				frequent: true,
				filter: function (event, player) {
					return player.isMinHp() && player.isDamaged();
				},
				content: function () {
					player.recover();
				},
			},
			fengxueren: {
				equipSkill: true,
				trigger: { player: "shaHit" },
				check: function (event, player) {
					var att = get.attitude(player, event.target);
					if (player.hasSkill("jiu")) return att > 0;
					if (event.target.hp == 1) return att > 0;
					if (event.target.hasSkillTag("maixie")) {
						return att <= 0;
					}
					if (player.hasSkill("tianxianjiu")) return false;
					return att <= 0;
				},
				filter: function (event, player) {
					return !event.target.isTurnedOver();
				},
				logTarget: "target",
				content: function () {
					trigger.unhurt = true;
					trigger.target.turnOver();
					trigger.target.draw();
				},
			},
			chilongya: {
				equipSkill: true,
				trigger: { source: "damageBegin" },
				forced: true,
				filter: function (event) {
					return event.hasNature("fire") && event.notLink();
				},
				content: function () {
					trigger.num++;
				},
			},
			chilongya2: {
				trigger: { source: "damageBegin" },
				filter: function (event, player) {
					return event.card && event.card.name == "sha";
				},
				popup: false,
				forced: true,
				content: function () {
					if (Math.random() < 0.5) {
						trigger.num++;
						trigger.player.addSkill("chilongfengxue");
					}
				},
			},
			chilongfengxue: {
				trigger: { global: "shaAfter" },
				forced: true,
				popup: false,
				content: function () {
					player.draw();
					player.removeSkill("chilongfengxue");
				},
			},
			shentou: {
				equipSkill: true,
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				filter: function (event, player) {
					var nh = player.countCards("h");
					if (nh == 0) return false;
					return game.hasPlayer(function (current) {
						return current != player && current.countCards("h") > nh;
					});
				},
				check: function (card) {
					return 8 - get.value(card);
				},
				filterTarget: function (card, player, target) {
					if (target.countCards("h") == 0) return false;
					if (target == player) return false;
					if (target.countCards("h") <= player.countCards("h")) return false;
					return true;
				},
				content: function () {
					"step 0";
					player.judge(function (card) {
						if (get.suit(card) == "club") return -1;
						return 1;
					});
					"step 1";
					if (result.bool) {
						var card = target.getCards("h").randomGet();
						if (card) {
							player.gain(card, target);
							target.$giveAuto(card, player);
						}
					}
				},
				ai: {
					basic: {
						order: 5,
					},
					result: {
						player: 0.3,
						target: -1,
					},
				},
			},
			old_longfan: {
				enable: "phaseUse",
				usable: 1,
				prompt: "？",
				filterTarget: true,
				content: function () {
					"step 0";
					if (event.isMine()) {
						event.longfan = ui.create.control("零", "零", "零", "零", function () {
							event.longfan.status--;
						});
						event.longfan.status = 4;
						for (var i = 0; i < event.longfan.childNodes.length; i++) {
							event.longfan.childNodes[i].num = 0;
						}
						event.timer = setInterval(function () {
							if (event.longfan.status <= 0) {
								clearInterval(event.timer);
								game.resume();
								event.longfan.close();
								return;
							}
							event.count(0);
							if (event.longfan.status > 1) event.count(1);
							if (event.longfan.status > 2) event.count(2);
							if (event.longfan.status > 3) event.count(3);
						}, 200);
						event.count = function (num) {
							event.longfan.childNodes[num].num = (event.longfan.childNodes[num].num + 1) % 10;
							if (event.longfan.childNodes[num].num == 2) event.longfan.childNodes[num].innerHTML = "二";
							else event.longfan.childNodes[num].innerHTML = get.cnNumber(event.longfan.childNodes[num].num);
						};
						game.pause();
					} else {
						event.finish();
						var x = Math.random();
						if (x < 0.1) target.draw();
						else if (x < 0.2) target.chooseToDiscard(true);
						else if (x < 0.3) target.loseHp();
						else if (x < 0.4) target.recover();
						else if (x < 0.6) {
							if (get.attitude(player, target) > 0) target.draw();
							else target.chooseToDiscard(true);
						} else if (x < 0.8) {
							if (get.attitude(player, target) > 0) target.recover();
							else target.loseHp();
						}
					}
					"step 1";
					var str = "";
					for (var i = 0; i < event.longfan.childNodes.length; i++) {
						str += event.longfan.childNodes[i].num;
					}
					target.popup(str);
					game.delay();
					switch (str) {
						case "0000":
							target.turnOver();
							break;
						case "1111":
							target.chooseToDiscard(2, true);
							break;
						case "2222":
							target.chooseToDiscard("e", true);
							break;
						case "3333":
							target.damage();
							break;
						case "4444":
							target.loseHp();
							break;
						case "5555":
							target.link();
							break;
						case "6666":
							target.draw();
							break;
						case "7777":
							target.recover();
							break;
						case "8888":
							target.discard(target.getCards("j"));
							break;
						case "9999":
							target.draw(2);
							target.chooseToDiscard(2, true);
							break;
						default:
							for (var i = 1; i < 4; i++) {
								if (str[i] == str[0]) return;
							}
							player.chooseToDiscard(true);
							return;
					}
					player.draw();
				},
				ai: {
					basic: {
						order: 10,
					},
					result: {
						target: function () {
							return Math.random() - 0.5;
						},
					},
				},
			},
			longfan: {
				equipSkill: true,
				enable: "phaseUse",
				usable: 1,
				content: function () {
					"step 0";
					player.judge(function (card) {
						switch (get.suit(card)) {
							case "heart":
								return player.maxHp > player.hp ? 2 : 0;
							case "diamond":
								return 1;
							case "club":
								return 1;
							case "spade":
								return 0;
						}
					});
					"step 1";
					switch (result.suit) {
						case "heart":
							player.recover();
							break;
						case "diamond":
							player.draw();
							break;
						case "club": {
							var targets = player.getEnemies();
							for (var i = 0; i < targets.length; i++) {
								if (!targets[i].countCards("he")) {
									targets.splice(i--, 1);
								}
							}
							if (targets.length) {
								var target = targets.randomGet();
								player.line(target);
								target.randomDiscard();
							}
							break;
						}
					}
				},
				ai: {
					order: 10,
					result: {
						player: 1,
					},
				},
			},
			touzhi: {
				equipSkill: true,
				enable: "phaseUse",
				usable: 1,
				filterCard: function (card) {
					return get.subtype(card) == "equip1";
				},
				filter: function (event, player) {
					return player.countCards("he", { subtype: "equip1" }) > 0;
				},
				discard: false,
				prepare: "give",
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					return true;
				},
				content: function () {
					target.damage();
					target.gain(cards, player);
					// game.delay();
				},
				check: function (card) {
					return 10 - get.value(card);
				},
				position: "he",
				ai: {
					basic: {
						order: 8,
					},
					result: {
						target: -1,
					},
				},
			},
			xixue: {
				equipSkill: true,
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && player.hp < player.maxHp;
				},
				content: function () {
					player.recover(trigger.num);
				},
			},
			guangshatianyi: {
				equipSkill: true,
				trigger: { player: "damageBegin" },
				forced: true,
				filter: function (event, player) {
					if (
						event.source &&
						event.source.hasSkillTag("unequip", false, {
							name: event.card ? event.card.name : null,
							target: player,
							card: event.card,
						})
					)
						return false;
					if (Math.random() > 1 / 3) return false;
					return true;
				},
				content: function () {
					trigger.num--;
				},
			},
			nigong: {
				equipSkill: true,
				trigger: { player: "damageAfter" },
				group: ["nigong2", "nigong3"],
				forced: true,
				content: function () {
					player.storage.nigong += trigger.num;
					if (player.storage.nigong > 4) {
						player.storage.nigong = 4;
					}
					player.updateMarks();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage") && !target.hujia) return [1, 0.5];
						},
					},
				},
				intro: {
					content: "已积攒#点伤害",
				},
			},
			nigong2: {
				equipSkill: true,
				enable: "phaseUse",
				filter: function (event, player) {
					return player.storage.nigong > 1;
				},
				filterTarget: function (card, player, target) {
					return player != target;
				},
				prompt: function (event) {
					var str = "弃置所有逆攻标记，";
					if (event.player.storage.nigong % 2 != 0) {
						str += "摸一张牌，";
					}
					str += "并对一名其他角色造成" + get.cnNumber(Math.floor(event.player.storage.nigong / 2)) + "点伤害";
					return str;
				},
				content: function () {
					if (player.storage.nigong % 2 != 0) {
						player.draw();
					}
					target.damage(Math.floor(player.storage.nigong / 2));
					player.storage.nigong = 0;
					player.updateMarks();
				},
				ai: {
					order: 10,
					result: {
						target: function (player, target) {
							var num = get.damageEffect(target, player, target);
							if (player.storage.nigong >= 4 && num > 0) {
								num = 0;
							}
							return num;
						},
					},
				},
			},
			nigong3: {
				equipSkill: true,
				enable: "phaseUse",
				filter: function (event, player) {
					return player.storage.nigong == 1;
				},
				content: function () {
					player.draw();
					player.storage.nigong = 0;
					player.updateMarks();
				},
				ai: {
					order: 10,
					result: {
						player: 1,
					},
				},
			},
			sadengjinhuan: {
				equipSkill: true,
				trigger: { player: "shaMiss" },
				check: function (event, player) {
					return get.attitude(player, event.target) < 0;
				},
				content: function () {
					"step 0";
					player.judge(function (card) {
						return get.color(card) == "red" ? 1 : 0;
					});
					"step 1";
					if (result.bool) {
						trigger.target.chooseToRespond({ name: "shan" }, "萨登荆环：请额外打出一张闪响应杀").autochoose = lib.filter.autoRespondShan;
					} else {
						event.finish();
					}
					"step 2";
					if (!result.bool) {
						trigger.untrigger();
						trigger.trigger("shaHit");
						trigger._result.bool = false;
					}
				},
			},
			ximohu: {
				trigger: { player: "damageBefore" },
				forced: true,
				filter: function (event) {
					return event.hasNature("thunder");
				},
				content: function () {
					trigger.cancel();
					player.recover(trigger.num);
				},
				ai: {
					effect: {
						target(card) {
							if (get.tag(card, "thunderDamage")) return [0, 2];
						},
					},
				},
			},
			guiyanfadao: {
				equipSkill: true,
				trigger: { player: "shaHit" },
				check: function (event, player) {
					var att = get.attitude(player, event.target);
					if (player.hasSkill("jiu")) return att > 0;
					if (event.target.hasSkillTag("maixie_hp") || event.target.hasSkillTag("maixie_defend")) {
						return att <= 0;
					}
					if (player.hasSkill("tianxianjiu")) return false;
					if (event.target.hujia > 0) return att < 0;
					if (event.target.hp == 1) return att > 0;
					return false;
				},
				content: function () {
					trigger.unhurt = true;
					trigger.target.loseHp();
				},
			},
			guiyanfadao2: {
				trigger: { player: "useCardAfter" },
				forced: true,
				popup: false,
				content: function () {
					delete player.storage.zhuque_skill.nature;
				},
			},
			tianxianjiu: {
				trigger: { source: "damageEnd" },
				filter: function (event) {
					return event.card && event.card.name == "sha";
				},
				forced: true,
				temp: true,
				vanish: true,
				onremove: function (player) {
					if (player.node.jiu) {
						player.node.jiu.delete();
						player.node.jiu2.delete();
						delete player.node.jiu;
						delete player.node.jiu2;
					}
				},
				content: function () {
					player.draw(2);
					player.removeSkill("tianxianjiu");
				},
				ai: {
					damageBonus: true,
				},
			},
		},
		cardType: {
			hslingjian: 0.5,
			jiqi: 0.4,
			jiguan: 0.45,
		},
		help: {
			轩辕剑: "<ul><li>零件、祭器牌可用于煅造装备，煅造得到强化装备，并装备给距离1以内的角色<li>" + "煅造装备时失去牌以及装备牌的过程不触发任何技能（如枭姬、祈禳） <li>" + "进行洗牌时强化装备将从弃牌堆中消失，不进入牌堆<li>" + "专属、特殊装备无法被强化",
		},
		translate: {
			qiankundai: "乾坤袋",
			qiankundai_info: "你的手牌上限+1。当你失去该装备时，你摸一张牌。",
			hufu: "玉符",
			hufu_bg: "符",
			g_hufu_sha: "符杀",
			g_hufu_shan: "符闪",
			g_hufu_jiu: "符酒",
			hufu_info: "你可以将一张玉符当作杀、闪或酒使用或打出。",
			liuxinghuoyu: "流星火羽",
			liuxinghuoyu_info: "出牌阶段，对一名角色使用，令目标弃置两张牌，或受到1点火焰伤害。",
			g_yuchan_equip: "玉蝉",
			yuchanqian_duanzao: "玉蝉",
			yuchanqian_equip1_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanqian_equip2_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanqian_equip3_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanqian_equip4_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanqian_equip5_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchankun_duanzao: "玉蝉",
			yuchankun_equip1_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchankun_equip2_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchankun_equip3_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchankun_equip4_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchankun_equip5_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanzhen_duanzao: "玉蝉",
			yuchanzhen_equip1_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanzhen_equip2_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanzhen_equip3_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanzhen_equip4_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanzhen_equip5_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanxun_duanzao: "玉蝉",
			yuchanxun_equip1_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanxun_equip2_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanxun_equip3_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanxun_equip4_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanxun_equip5_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchankan_duanzao: "玉蝉",
			yuchankan_equip1_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchankan_equip2_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchankan_equip3_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchankan_equip4_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchankan_equip5_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanli_duanzao: "玉蝉",
			yuchanli_equip1_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanli_equip2_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanli_equip3_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanli_equip4_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanli_equip5_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchangen_duanzao: "玉蝉",
			yuchangen_equip1_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchangen_equip2_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchangen_equip3_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchangen_equip4_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchangen_equip5_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchandui_duanzao: "玉蝉",
			yuchandui_equip1_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchandui_equip2_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchandui_equip3_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchandui_equip4_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchandui_equip5_info: "出牌阶段限一次，你可以弃置任意张基本牌并摸等量的牌。",
			yuchanqian: "乾玉蝉",
			yuchanqian_info: "在你行动时可当作杀使用；可用于煅造装备；在你使用一张牌后，此牌会随机切换形态。",
			yuchankun: "坤玉蝉",
			yuchankun_info: "在你行动时可当作草药使用；可用于煅造装备；在你使用一张牌后，此牌会随机切换形态。",
			yuchanzhen: "震玉蝉",
			yuchanzhen_info: "在你行动时可当作酒使用；可用于煅造装备；在你使用一张牌后，此牌会随机切换形态。",
			yuchanxun: "巽玉蝉",
			yuchanxun_info: "在你行动时可当作桃使用；可用于煅造装备；在你使用一张牌后，此牌会随机切换形态。",
			yuchankan: "坎玉蝉",
			yuchankan_info: "在你行动时可当作神秘果使用；可用于煅造装备；在你使用一张牌后，此牌会随机切换形态。",
			yuchanli: "离玉蝉",
			yuchanli_info: "在你行动时可当作天仙酒使用；可用于煅造装备；在你使用一张牌后，此牌会随机切换形态。",
			yuchangen: "艮玉蝉",
			yuchangen_info: "在你行动时可当作封印之蛋使用；可用于煅造装备；在你使用一张牌后，此牌会随机切换形态。",
			yuchandui: "兑玉蝉",
			yuchandui_info: "在你行动时可当作雪肌冰鲍使用；可用于煅造装备；在你使用一张牌后，此牌会随机切换形态。",
			yangpijuan: "羊皮卷",
			yangpijuan_info: "出牌阶段对自己使用，选择一种卡牌类别，发现一张该类别的卡牌。",
			shencaojie: "神草结",
			shencaojie_info: "你的锦囊牌即将造成伤害时对目标使用，令此伤害+1；你即将受到锦囊牌伤害时对自己使用，令此伤害-1。",
			yuruyi: "玉如意",
			yuruyi_ab: "如意",
			yuruyi_info: "你有更高的机率摸到好牌。",
			fengyinzhidan: "封印之蛋",
			fengyinzhidan_info: "随机使用两张普通锦囊牌（随机指定目标）。",
			shuchui: "鼠槌",
			shuchui_info: "出牌阶段限一次，你可以指定一名攻击范围内的角色，依次将手牌中的至多3张杀对该角色使用，若杀造成了伤害，你摸一张牌。",
			zhiluxiaohu: "指路小狐",
			zhiluxiaohu_info: "出牌阶段对自己使用，视为对一名随机敌方角色使用一张杀，若此杀造成伤害，你摸一张牌。",
			xuejibingbao: "雪肌冰鲍",
			xuejibingbao_info: "出牌阶段对一名角色使用，该角色摸牌阶段摸牌数+1，持续2个回合。",
			gouhunluo: "勾魂锣",
			gouhunluo_info: "出牌阶段对一名角色使用，在3轮后你的准备阶段令该角色失去1点体力并弃置所有手牌。",
			jiguan: "机关",
			jiqi: "祭器",
			qinglongzhigui: "青龙之圭",
			g_qinglongzhigui: "青龙之圭",
			qinglongzhigui_info: "可用于煅造装备；此牌在你手牌中时，准备阶段，你摸两张牌然后弃置一张牌。",
			qinglongzhigui_duanzao: "云屏",
			qinglongzhigui_equip1_info: "结束阶段，你摸一张牌。",
			qinglongzhigui_equip2_info: "结束阶段，你摸一张牌。",
			qinglongzhigui_equip3_info: "结束阶段，你摸一张牌。",
			qinglongzhigui_equip4_info: "结束阶段，你摸一张牌。",
			qinglongzhigui_equip5_info: "结束阶段，你摸一张牌。",
			baishouzhihu: "白兽之琥",
			g_baishouzhihu: "白兽之琥",
			baishouzhihu_info: "可用于煅造装备；此牌在你手牌中时，每当你弃置卡牌，你可以弃置一名其他角色的一张随机牌。",
			baishouzhihu_duanzao: "风牙",
			baishouzhihu_equip1_info: "结束阶段，你可以弃置一名其他角色的一张随机牌。",
			baishouzhihu_equip2_info: "结束阶段，你可以弃置一名其他角色的一张随机牌。",
			baishouzhihu_equip3_info: "结束阶段，你可以弃置一名其他角色的一张随机牌。",
			baishouzhihu_equip4_info: "结束阶段，你可以弃置一名其他角色的一张随机牌。",
			baishouzhihu_equip5_info: "结束阶段，你可以弃置一名其他角色的一张随机牌。",
			zhuquezhizhang: "朱雀之璋",
			g_zhuquezhizhang: "朱雀之璋",
			zhuquezhizhang_info: "可用于煅造装备；此牌在你手牌中时，每当你受到其他角色造成的伤害，你对伤害来源造成1点火属性伤害。",
			zhuquezhizhang_duanzao: "炽翎",
			zhuquezhizhang_equip1_info: "结束阶段，你可以弃置一张红色牌并对一名体力值不小于你的角色造成1点火属性伤害。",
			zhuquezhizhang_equip2_info: "结束阶段，你可以弃置一张红色牌并对一名体力值不小于你的角色造成1点火属性伤害。",
			zhuquezhizhang_equip3_info: "结束阶段，你可以弃置一张红色牌并对一名体力值不小于你的角色造成1点火属性伤害。",
			zhuquezhizhang_equip4_info: "结束阶段，你可以弃置一张红色牌并对一名体力值不小于你的角色造成1点火属性伤害。",
			zhuquezhizhang_equip5_info: "结束阶段，你可以弃置一张红色牌并对一名体力值不小于你的角色造成1点火属性伤害。",
			xuanwuzhihuang: "玄武之璜",
			g_xuanwuzhihuang: "玄武之璜",
			xuanwuzhihuang_duanzao: "寒晶",
			xuanwuzhihuang_info: "可用于煅造装备；此牌在你手牌中时，每当你造成伤害，你回复等量的体力。",
			xuanwuzhihuang_equip1_info: "结束阶段，你可以弃置一张红色牌并回复1点体力。",
			xuanwuzhihuang_equip2_info: "结束阶段，你可以弃置一张红色牌并回复1点体力。",
			xuanwuzhihuang_equip3_info: "结束阶段，你可以弃置一张红色牌并回复1点体力。",
			xuanwuzhihuang_equip4_info: "结束阶段，你可以弃置一张红色牌并回复1点体力。",
			xuanwuzhihuang_equip5_info: "结束阶段，你可以弃置一张红色牌并回复1点体力。",
			huanglinzhicong: "黄麟之琮",
			g_huanglinzhicong: "黄麟之琮",
			huanglinzhicong_duanzao: "玄甲",
			huanglinzhicong_info: "可用于煅造装备；此牌在你手牌中时，准备阶段，若你没有护甲，你获得1点护甲。",
			huanglinzhicong_equip1_info: "结束阶段，若你没有护甲，你可以弃置一张黑色牌并获得1点护甲。",
			huanglinzhicong_equip2_info: "结束阶段，若你没有护甲，你可以弃置一张黑色牌并获得1点护甲。",
			huanglinzhicong_equip3_info: "结束阶段，若你没有护甲，你可以弃置一张黑色牌并获得1点护甲。",
			huanglinzhicong_equip4_info: "结束阶段，若你没有护甲，你可以弃置一张黑色牌并获得1点护甲。",
			huanglinzhicong_equip5_info: "结束阶段，若你没有护甲，你可以弃置一张黑色牌并获得1点护甲。",
			cangchizhibi: "苍螭之璧",
			g_cangchizhibi: "苍螭之璧",
			cangchizhibi_duanzao: "灵枢",
			cangchizhibi_info: "可用于煅造装备；此牌在你手牌中时，准备阶段，你可以选择至多3名角色横置或重置之。",
			cangchizhibi_equip1_info: "结束阶段，你可以横置或重置一名角色。",
			cangchizhibi_equip2_info: "结束阶段，你可以横置或重置一名角色。",
			cangchizhibi_equip3_info: "结束阶段，你可以横置或重置一名角色。",
			cangchizhibi_equip4_info: "结束阶段，你可以横置或重置一名角色。",
			cangchizhibi_equip5_info: "结束阶段，你可以横置或重置一名角色。",

			guisheqi: "龟蛇旗",
			guisheqi_info: "出牌阶段对一名角色使用，目标获得1点护甲。",
			jiguanfeng: "机关蜂",
			jiguanfeng_info: "出牌阶段对一名其他角色使用，目标需打出一张【闪】，否则非锁定技失效直到下一回合开始，并受到1点伤害。",
			jiguanyuan: "机关鸢",
			jiguanyuan_info: "出牌阶段对一名其他角色使用，你将此牌和一张其它牌置于一名其他角色的武将牌上，然后摸一张牌；该角色于下一结束阶段获得武将牌上的牌。",
			jiguantong: "机关火筒",
			jiguantong_ab: "火筒",
			jiguantong_info: "出牌阶段对所有其他角色使用，目标弃置一张手牌，或受到1点火焰伤害；若没有人选择受到伤害，使用者摸一张牌。",
			jiutiansuanchi: "九天算尺",
			jiutiansuanchi_info: "每当你使用杀造成伤害，你可以弃置一张牌并展示受伤害角色的一张手牌，若此牌与你弃置的牌花色或点数相同，此杀的伤害+2。",
			shenmiguo: "神秘果",
			shenmiguo_info: "出牌阶段内，当你使用一张基本牌或普通锦囊牌后使用，令此牌再结算一次。每阶段限用一次。",
			qinglianxindeng: "青莲心灯",
			qinglianxindeng_info: "你防止锦囊牌造成的伤害。",
			hslingjian_xuanfengzhiren_duanzao: "风刃",
			hslingjian_xuanfengzhiren_duanzao2: "风",
			hslingjian_xuanfengzhiren_equip1_info: "每当你用杀造成一次伤害，受伤害角色随机弃置一张牌。",
			hslingjian_xuanfengzhiren_equip2_info: "每当你受到杀造成的伤害，伤害来源随机弃置一张牌。",
			hslingjian_xuanfengzhiren_equip3_info: "当你于回合外失去牌后，你本回合的防御距离+1。",
			hslingjian_xuanfengzhiren_equip4_info: "当你于回合内失去牌后，你本回合的进攻距离+1。",
			hslingjian_xuanfengzhiren_equip5_info: "出牌阶段限一次，你可以弃置一张牌，然后随机弃置一名其他角色的一张牌。",
			hslingjian_zhongxinghujia_duanzao: "重甲",
			hslingjian_zhongxinghujia_duanzao2: "护",
			hslingjian_zhongxinghujia_equip1_info: "每当你用杀造成一次伤害，你可以随机装备一件防具牌。",
			hslingjian_zhongxinghujia_equip2_info: "每当你受到杀造成的伤害，你可以弃置伤害来源的防具牌。",
			hslingjian_zhongxinghujia_equip3_info: "当你的装备区内有防具牌时，你的防御距离+1。",
			hslingjian_zhongxinghujia_equip4_info: "当你的装备区内有防具牌时，你的进攻距离+1。",
			hslingjian_zhongxinghujia_equip5_info: "出牌阶段限一次，你可以弃置两张牌，然后令一名角色随机装备一件防具。",
			hslingjian_jinjilengdong_duanzao: "冰冻",
			hslingjian_jinjilengdong_duanzao2: "冰",
			hslingjian_jinjilengdong_equip1_info: "每当你用杀造成一次伤害，你可以令目标摸两张牌并翻面。",
			hslingjian_jinjilengdong_equip2_info: "每当你受到杀造成的伤害，你可以令伤害来源摸两张牌并翻面。",
			hslingjian_jinjilengdong_equip3_info: "你的武将牌背面朝上时防御距离+2。",
			hslingjian_jinjilengdong_equip4_info: "你的武将牌背面朝上时进攻距离+2。",
			hslingjian_jinjilengdong_equip5_info: "回合结束后，若你的武将牌正面朝上，你可以与一名武将牌正面朝上的其他角色同时翻面，然后各摸两张牌。",
			hslingjian_yinmilichang_duanzao: "隐力",
			hslingjian_yinmilichang_duanzao2: "隐",
			hslingjian_yinmilichang_equip1_info: "每当你用杀造成一次伤害，你可以令一名其他角色获得潜行直到其下一回合开始。",
			hslingjian_yinmilichang_equip2_info: "每当你受到一次伤害，你本回合内获得潜行。",
			hslingjian_yinmilichang_equip3_info: "当你的体力值为1时，你的防御距离+1。",
			hslingjian_yinmilichang_equip4_info: "当你的体力值为1时，你的进攻距离+1。",
			hslingjian_yinmilichang_equip5_info: "当你没有手牌时，你不能成为杀或决斗的目标。",
			hslingjian_xingtigaizao_duanzao: "移形",
			hslingjian_xingtigaizao_duanzao2: "形",
			hslingjian_xingtigaizao_equip1_info: "每当你用杀造成一次伤害，你摸一张牌。",
			hslingjian_xingtigaizao_equip2_info: "每当你受到杀造成的伤害，你摸一张牌。",
			hslingjian_xingtigaizao_equip3_info: "你的防御距离+1，进攻距离-1。",
			hslingjian_xingtigaizao_equip4_info: "你的防御距离-1，进攻距离+1。",
			hslingjian_xingtigaizao_equip5_info: "你于摸牌阶段额外摸一张牌；你的手牌上限-1。",
			hslingjian_shengxiuhaojiao_duanzao: "号角",
			hslingjian_shengxiuhaojiao_duanzao2: "角",
			hslingjian_shengxiuhaojiao_equip1_info: "有嘲讽的角色不能闪避你的杀。",
			hslingjian_shengxiuhaojiao_equip2_info: "有嘲讽的角色不能对你使用杀。",
			hslingjian_shengxiuhaojiao_equip3_info: "若你的手牌数大于你的体力值，你的防御距离+1。",
			hslingjian_shengxiuhaojiao_equip4_info: "若你的手牌数大于你的体力值，你的进攻距离+1。",
			hslingjian_shengxiuhaojiao_equip5_info: "出牌阶段限一次，你可以弃置两张牌，然后令一名角色获得或解除嘲讽。",
			hslingjian_shijianhuisu_duanzao: "回溯",
			hslingjian_shijianhuisu_duanzao2: "溯",
			hslingjian_shijianhuisu_equip1_info: "当你装备一张防具牌时，你摸一张牌。",
			hslingjian_shijianhuisu_equip2_info: "当你装备一张武器牌时，你摸一张牌。",
			hslingjian_shijianhuisu_equip3_info: "当你的装备区内没有其他牌时，你的防御距离+1。",
			hslingjian_shijianhuisu_equip4_info: "当你的装备区内没有其他牌时，你的进攻距离+1。",
			hslingjian_shijianhuisu_equip5_info: "出牌阶段限一次，你可以弃置一张牌，然后令一名其他角色将其装备区内的牌收回手牌。",
			_lingjianduanzao: "煅造",
			_lingjianduanzao_info: "出牌阶段，你可以将一张装备牌和一张可煅造的牌合成为一件强化装备，并装备给距离1以内的一名角色。",
			jiguanshu: "机关鼠",
			jiguanshu_info: "出牌阶段对自己使用，用随机祭器强化装备区内的一张随机装备，然后用随机零件强化其余的装备。",
			lingjiandai: "零件袋",
			lingjiandai_info: "出牌阶段对自己使用，获得3张随机零件。",
			mujiaren: "木甲人",
			mujiaren_info: "出牌阶段限用一次，将你手牌中的非基本牌（含此张）替换为随机的机关牌。",
			jiguanyaoshu: "机关要术",
			jiguanyaoshu_skill: "巧匠",
			jiguanyaoshu_skill_info: "每当你于回合外失去装备区内的牌，你获得一个随机零件。",
			jiguanyaoshu_info: "出牌阶段对距离1以内的一名角色使用，目标随机装备一件装备牌并获得技能巧匠（每当你于回合外失去装备区内的牌，你获得一个随机零件）。",
			hslingjian: "零件",
			hslingjian_xuanfengzhiren: "旋风之刃",
			hslingjian_xuanfengzhiren_info: "可用于煅造装备；随机弃置一名角色的一张牌。",
			hslingjian_zhongxinghujia: "重型护甲",
			hslingjian_zhongxinghujia_info: "可用于煅造装备；令一名角色装备一件随机防具，然后随机弃置其一张手牌。",
			hslingjian_jinjilengdong: "紧急冷冻",
			hslingjian_jinjilengdong_bg: "冻",
			hslingjian_jinjilengdong_info: "可用于煅造装备；令一名武将牌正面朝上的其他角色获得2点护甲并翻面，该角色不能使用卡牌，也不能成为卡牌的目标直到武将牌翻回正面。",
			hslingjian_yinmilichang: "隐秘力场",
			hslingjian_yinmilichang_info: "可用于煅造装备；令一名其他角色获得技能潜行，直到其下一回合开始。",
			hslingjian_xingtigaizao: "型体改造",
			hslingjian_xingtigaizao_info: "可用于煅造装备；摸一张牌，本回合手牌上限-1。",
			hslingjian_shengxiuhaojiao: "生锈号角",
			hslingjian_shengxiuhaojiao_info: "可用于煅造装备；令一名角色获得技能嘲讽，直到其下一回合开始。",
			hslingjian_shijianhuisu: "时间回溯",
			hslingjian_shijianhuisu_info: "可用于煅造装备；令一名其他角色将其装备牌收回手牌。",
			hslingjian_chaofeng: "嘲讽",
			hslingjian_chaofeng_info: "锁定技，与你相邻的角色只能选择你为出杀目标。",
			qinglonglingzhu: "青龙灵珠",
			qinglonglingzhu_ab: "灵珠",
			qinglonglingzhu_info: "每当你造成一次属性伤害，你可以获得对方的一张牌。",
			xingjunyan: "星君眼",
			xingjunyan_info: "你的杀造成的伤害+1；杀对你造成的伤害+1。",
			guiyanfadao: "鬼眼法刀",
			guiyanfadao_bg: "眼",
			guiyanfadao_info: "每当你使用杀命中目标，你可以防止伤害，改为令目标失去1点体力。",
			tianxianjiu: "天仙酒",
			tianxianjiu_bg: "仙",
			tianxianjiu_info: "出牌阶段对自己使用，你使用的下一张杀造成伤害后可以摸两张牌；濒死阶段，对自己使用，回复1点体力。",
			// xiangyuye:'翔羽叶',
			// xiangyuye_info:'出牌阶段，对一名攻击范围外的角色使用，令其弃置一张黑色手牌或失去1点体力。',
			// huanpodan:'还魄丹',
			// huanpodan_bg:'魄',
			// huanpodan_info:'出牌阶段对一名角色使用，在目标即将死亡时防止其死亡，改为令其弃置所有牌，将体力值回复至1并摸一张牌。',
			// huanpodan_skill:'还魄丹',
			// huanpodan_skill_bg:'丹',
			// huanpodan_skill_info:'防止一次死亡，改为弃置所有牌，将体力值变为1并摸一张牌。',
			ximohu: "吸魔壶",
			ximohu_bg: "魔",
			// ximohu_info:'锁定技，你将即将受到的雷属性伤害转化为你的体力值。',
			sadengjinhuan: "萨登荆环",
			sadengjinhuan_ab: "荆环",
			sadengjinhuan_info: "当你的【杀】被【闪】避后，可以进行一次判定，若结果为红色目标需再打出一张【闪】。",
			sadengjinhuan_bg: "荆",
			qipoguyu: "奇魄古玉",
			xujin: "蓄劲",
			xujin2: "蓄劲",
			// qipoguyu_info:'装备后获得蓄劲技能。',
			xujin_info: "回合开始前，若你的蓄劲标记数小于当前的体力值，你可以跳过此回合，并获得一枚蓄劲标记。锁定技，每当你即将造成伤害，你令此伤害+X，然后弃置一枚蓄劲标记，X为你拥有的蓄劲标记数。",
			guilingzhitao: "归灵指套",
			nigong: "逆攻",
			nigong2: "逆攻",
			nigong3: "逆攻",
			nigong4: "逆攻",
			guilingzhitao_info: "每当你受到1点伤害，你获得一个逆攻标记，标记数不能超过4。出牌阶段，你可以弃置所有逆攻标记并令对一名其他角色造成标记数一半的伤害（若非整数则向下取整并摸一张牌）。",
			nigong_info: "每当你受到1点伤害，你获得一个逆攻标记，标记数不能超过4。出牌阶段，你可以弃置所有逆攻标记并令对一名其他角色造成标记数一半的伤害（若非整数则向下取整并摸一张牌）。",
			baihupifeng: "白狐披风",
			baihupifeng_bg: "狐",
			baihupifeng_info: "结束阶段，若你的体力值是全场最小的之一，你可以回复1点体力。",
			fengxueren: "封雪刃",
			fengxueren_bg: "雪",
			fengxueren_info: "你使用杀击中目标后，若目标武将牌正面朝上，你可以防止伤害，然后令目标摸一张牌并翻面。",
			chilongya: "赤龙牙",
			chilongya_info: "锁定技，你的火属性伤害+1。",
			daihuofenglun: "带火风轮",
			daihuofenglun_ab: "风轮",
			daihuofenglun_bg: "轮",
			daihuofenglun_info: "你的进攻距离+2，你的防御距离-1。",
			xiayuncailing: "霞云彩绫",
			xiayuncailing_ab: "彩绫",
			xiayuncailing_bg: "云",
			xiayuncailing_info: "你的进攻距离-1，你的防御距离+2。",
			shentoumianju: "神偷面具",
			shentoumianju_bg: "偷",
			shentoumianju_info: "出牌阶段，你可以指定一名手牌比你多的角色，弃置一张手牌并进行一次判定，若结果不为梅花，你获得其一张手牌。",
			shentou: "神偷",
			shentou_info: "出牌阶段，你可以进行一次判定，若结果不为梅花，你获得任意一名角色的一张手牌。",
			xianluhui: "仙炉灰",
			xianluhui_info: "令所有已受伤角色获得1点护甲。",
			caoyao: "草药",
			caoyao_info: "出牌阶段，对距离为1以内的角色使用，回复1点体力。",
			langeguaiyi: "蓝格怪衣",
			langeguaiyi_bg: "格",
			langeguaiyi_info: "出牌阶段限一次，你可以进行一次判定，然后按花色执行以下效果。红桃：你回复1点体力；方片：你摸一张牌；梅花：你令一名随机敌方角色随机弃置一张牌；黑桃：无事发生。",
			longfan: "龙帆",
			longfan_info: "出牌阶段限一次，你可以进行一次判定，然后按花色执行以下效果。红桃：你回复1点体力；方片：你摸一张牌；梅花：你令一名随机敌方角色随机弃置一张牌；黑桃：无事发生。",
			// longfan_info:'0000：翻面；1111：弃手牌；2222：弃装备牌；3333：受伤害；4444：失去体力；5555：连环；6666：摸牌；7777：回复体力；8888：弃置判定牌；9999：置衡。',
			guiyoujie: "鬼幽结",
			guiyoujie_bg: "结",
			guiyoujie_info: "出牌阶段，对一名其他角色使用。若判定结果为黑色，其失去1点体力并随机弃置一张牌。",
			yufulu: "御夫录",
			yufulu_info: "出牌阶段，可弃置一张武器牌令一名角色受到1点伤害，然后该角色获得此武器牌。",
			touzhi: "投掷",
			touzhi_info: "出牌阶段，可弃置一张武器牌令一名角色受到1点伤害，然后该角色获得此武器牌。",
			xixueguizhihuan: "吸血鬼指环",
			xixueguizhihuan_ab: "血环",
			xixueguizhihuan_info: "锁定技，每当你使用杀造成1点伤害，你回复1点体力。",
			xixue: "吸血",
			xixue_info: "锁定技，每当你使用杀造成1点伤害，你回复1点体力。",
			zhufangshenshi: "祠符",
			zhufangshenshi_info: "出牌阶段，对一名其他角色使用，本回合内对其使用卡牌无视距离，结算后摸一张牌。",
			jingleishan: "惊雷闪",
			jingleishan_info: "出牌阶段，对所有其他角色使用。每名目标角色需打出一张【杀】，否则受到1点雷电伤害。",
			chiyuxi: "炽羽袭",
			chiyuxi_info: "出牌阶段，对所有其他角色使用。每名目标角色需打出一张【闪】，否则受到1点火焰伤害。",
			guangshatianyi: "光纱天衣",
			guangshatianyi_bg: "纱",
			guangshatianyi_info: "锁定技，每当你即将受到伤害，有三分之一的概率令伤害减一。",
			sifeizhenmian: "四非真面",
			sifeizhenmian_info: "出牌阶段限一次，你可以令一名有手牌的其他角色进行一次判定，若结果为不为红桃且目标有可用的手牌，目标随机使用一张手牌（随机指定目标）。",
			yiluan: "意乱",
			yiluan_info: "出牌阶段限一次，你可以令一名有手牌的其他角色进行一次判定，若结果为不为红桃且目标有可用的手牌，目标随机使用一张手牌（随机指定目标）。",
			donghuangzhong: "东皇钟",
			xuanyuanjian: "轩辕剑",
			xuanyuanjian2: "轩辕剑",
			pangufu: "盘古斧",
			lianyaohu: "炼妖壶",
			lianyaohu_skill: "炼妖壶",
			lianyaohu_skill_bg: "壶",
			haotianta: "昊天塔",
			fuxiqin: "伏羲琴",
			shennongding: "神农鼎",
			kongdongyin: "崆峒印",
			kunlunjingc: "昆仑镜",
			nvwashi: "女娲石",
			donghuangzhong_bg: "钟",
			lianyaohu_bg: "壶",
			haotianta_bg: "塔",
			fuxiqin_bg: "琴",
			shennongding_bg: "鼎",
			kongdongyin_bg: "印",
			kunlunjingc_bg: "镜",
			nvwashi_bg: "石",
			kongxin: "控心",
			lianhua: "炼化",
			// dujian:'毒箭',
			// dujian_info:'出牌阶段，对一名有手牌或装备牌的角色使用，令其展示一张手牌，若与你选择的手牌颜色相同，其失去1点体力。',
			lianhua_info: "出牌阶段限一次，你可以弃置两张炼妖壶中的牌，从牌堆中获得一张与弃置的牌类别均不相同的牌。",
			shouna: "收纳",
			shouna_info: "出牌阶段限一次，你可以弃置一张手牌，并将一名其他角色的一张手牌置入炼妖壶。",
			donghuangzhong_info: "结束阶段，你可以弃置一张红色手牌，并选择一名角色将一张随机单体延时锦囊置入其判定区。",
			xuanyuanjian_info: "装备时获得1点护甲；每当你即将造成一次伤害，你令此伤害加一并变为雷属性，并在伤害结算后失去1点体力。任何时候，若你体力值不超过2，则立即失去轩辕剑。",
			pangufu_info: "锁定技，每当你造成一次伤害，受伤角色须弃置一张牌。",
			haotianta_info: "锁定技，任意一名角色进行判定前，你观看牌堆顶的2张牌，并选择一张作为判定结果，此结果不可被更改，也不能触发技能。",
			shennongding_info: "出牌阶段，你可以弃置两张手牌，然后回复1点体力。每阶段限一次。",
			kongdongyin_info: "令你抵挡一次死亡，将体力回复至1，并摸一张牌，发动后进入弃牌堆。",
			kunlunjingc_info: "出牌阶段限一次，你可以观看牌堆顶的三张牌，然后用一张手牌替换其中的一张。",
			nvwashi_info: "当一名角色濒死时，若你的体力值大于1，你可以失去1点体力并令其回复1点体力。",
			kongxin_info: "出牌阶段限一次，你可以与一名其他角色进行拼点，若你赢，你可以指定另一名角色视为对方对该角色使用一张杀，否则对方可弃置你一张牌。",
			fuxiqin_info: "出牌阶段限一次，你可以与一名其他角色进行拼点，若你赢，你可以指定另一名角色视为对方对该角色使用一张杀，否则对方可弃置你一张牌。",
			lianyaohu_info: "出牌阶段各限一次，你可以选择一项：1.弃置一张手牌，并将一名其他角色的一张手牌置入炼妖壶；2.弃置两张炼妖壶中的牌，从牌堆中获得一张与弃置的牌类别均不相同的牌。",
		},
		list: [
			["heart", 1, "hufu"],
			["spade", 1, "hufu"],
			["club", 1, "qiankundai"],

			["diamond", 3, "liuxinghuoyu", "fire"],
			["heart", 6, "liuxinghuoyu", "fire"],
			["heart", 9, "liuxinghuoyu", "fire"],

			["spade", 1, "baihupifeng"],
			["club", 1, "fengxueren"],
			["diamond", 1, "langeguaiyi"],
			["heart", 1, "daihuofenglun", "fire"],

			["diamond", 2, "xiayuncailing"],
			// ['heart',2,'huanpodan'],

			["club", 3, "caoyao"],
			["diamond", 3, "chilongya", "fire"],
			["spade", 3, "guiyoujie"],

			["club", 4, "caoyao"],
			["spade", 4, "zhufangshenshi"],
			// ['spade',4,'huanpodan'],

			["club", 5, "caoyao"],
			["spade", 5, "xixueguizhihuan"],
			// ['diamond',5,'huanpodan'],

			["club", 6, "shentoumianju"],
			["spade", 6, "yufulu"],

			["diamond", 7, "chiyuxi", "fire"],
			["club", 7, "jingleishan", "thunder"],
			["spade", 7, "guilingzhitao"],

			["spade", 8, "zhufangshenshi"],
			// ['club',8,'xiangyuye','poison'],

			["spade", 9, "yangpijuan"],
			["club", 9, "guiyoujie"],
			// ['diamond',9,'xiangyuye','poison'],

			// ['diamond',9,'tianxianjiu'],
			["heart", 9, "tianxianjiu"],
			["diamond", 2, "tianxianjiu"],

			["spade", 2, "qinglonglingzhu"],
			["spade", 7, "xingjunyan"],

			//['spade',10,'qipoguyu'],
			//['diamond',10,'xiangyuye','poison'],
			["club", 7, "yangpijuan"],

			// ['spade',11,'xiangyuye','poison'],

			["spade", 12, "guiyanfadao", "poison"],

			["spade", 13, "xianluhui"],
			["diamond", 3, "guangshatianyi"],
			["club", 13, "sadengjinhuan"],

			["club", 2, "lingjiandai"],
			// ['spade',3,'lingjiandai'],
			// ['heart',5,'lingjiandai'],
			["diamond", 8, "lingjiandai"],

			["club", 2, "jiguanshu"],
			// ['spade',2,'jiguanshu'],
			// ['heart',2,'jiguanshu'],
			["diamond", 2, "jiguanshu"],

			["club", 3, "jiguanyaoshu"],
			["spade", 3, "jiguanyaoshu"],
			// ['heart',3,'jiguanyaoshu'],
			// ['diamond',3,'jiguanyaoshu'],

			["spade", 4, "sifeizhenmian"],
			["heart", 13, "qinglianxindeng"],
			["club", 3, "jiguanyuan"],
			["diamond", 2, "jiguanyuan"],
			["diamond", 4, "jiguantong"],
			["club", 7, "jiguantong"],
			// ['spade',1,'shenmiguo'],
			["spade", 2, "shenmiguo"],
			["heart", 1, "shenmiguo"],
			["club", 3, "jiguanfeng"],
			["spade", 4, "jiguanfeng"],
			["spade", 9, "guisheqi"],
			["club", 7, "guisheqi"],

			["diamond", 13, "donghuangzhong"],
			["diamond", 13, "fuxiqin"],
			["spade", 13, "kunlunjingc"],
			["spade", 13, "xuanyuanjian"],
			["spade", 13, "pangufu"],
			["club", 13, "lianyaohu"],
			["diamond", 13, "haotianta"],
			["club", 13, "shennongding"],
			["heart", 13, "nvwashi"],
			["heart", 13, "kongdongyin"],

			["heart", 6, "qinglongzhigui"],
			["diamond", 6, "zhuquezhizhang"],
			["spade", 6, "baishouzhihu"],
			["club", 6, "xuanwuzhihuang"],
			["spade", 7, "cangchizhibi"],
			["heart", 5, "huanglinzhicong"],

			["spade", 9, "gouhunluo"],
			["club", 7, "gouhunluo"],

			["spade", 1, "xuejibingbao"],
			["club", 1, "xuejibingbao"],

			["heart", 3, "zhiluxiaohu"],
			["diamond", 4, "zhiluxiaohu"],

			["club", 7, "mujiaren"],
			["heart", 6, "mujiaren"],
			["diamond", 11, "mujiaren"],

			["club", 6, "shuchui"],

			// ['club',1,'fengyinzhidan'],
			// ['diamond',1,'fengyinzhidan'],
			// ['heart',1,'fengyinzhidan'],
			["spade", 1, "fengyinzhidan"],

			["heart", 9, "yuruyi"],

			["club", 4, "shencaojie"],
			["diamond", 4, "shencaojie"],
			["spade", 4, "shencaojie"],

			["spade", 1, "yuchanqian"],
			["club", 2, "yuchankun"],
			["diamond", 3, "yuchanzhen"],
			["heart", 4, "yuchanxun"],
			["spade", 5, "yuchankan"],
			["club", 6, "yuchanli"],
			["diamond", 7, "yuchangen"],
			["heart", 8, "yuchandui"],

			// ['spade',3,'dujian','poison'],
			// ['club',11,'dujian','poison'],
			// ['club',12,'dujian','poison'],
		],
	};
});
