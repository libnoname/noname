import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "gwent",
		card: {
			gw_dieyi: {
				fullskin: true,
			},
			gw_dieyi_equip1: {
				fullskin: true,
				vanish: true,
				hidden: true,
				cardimage: "gw_dieyi",
				type: "equip",
				subtype: "equip1",
				//TODO: 维护所有水乎武将的onLose事件
				onLose: function () {
					lib.skill.gw_dieyi.process(player);
				},
				loseDelay: false,
				skills: [],
				ai: {
					equipValue: 0,
				},
			},
			gw_dieyi_equip2: {
				fullskin: true,
				vanish: true,
				hidden: true,
				cardimage: "gw_dieyi",
				type: "equip",
				subtype: "equip2",
				onLose: function () {
					lib.skill.gw_dieyi.process(player);
				},
				loseDelay: false,
				skills: [],
				ai: {
					equipValue: 0,
				},
			},
			gw_dieyi_equip3: {
				fullskin: true,
				vanish: true,
				hidden: true,
				cardimage: "gw_dieyi",
				type: "equip",
				subtype: "equip3",
				onLose: function () {
					lib.skill.gw_dieyi.process(player);
				},
				loseDelay: false,
				skills: [],
				ai: {
					equipValue: 0,
				},
			},
			gw_dieyi_equip4: {
				fullskin: true,
				vanish: true,
				hidden: true,
				cardimage: "gw_dieyi",
				type: "equip",
				subtype: "equip4",
				onLose: function () {
					lib.skill.gw_dieyi.process(player);
				},
				loseDelay: false,
				skills: [],
				ai: {
					equipValue: 0,
				},
			},
			gw_dieyi_equip5: {
				fullskin: true,
				vanish: true,
				hidden: true,
				cardimage: "gw_dieyi",
				type: "equip",
				subtype: "equip5",
				onLose: function () {
					lib.skill.gw_dieyi.process(player);
				},
				loseDelay: false,
				skills: [],
				ai: {
					equipValue: 0,
				},
			},
			gw_dieyi_judge: {
				fullskin: true,
				vanish: true,
				hidden: true,
				cardimage: "gw_dieyi",
				enable: true,
				type: "delay",
				filterTarget: true,
				effect: function () {
					lib.skill.gw_dieyi.process(player);
				},
			},
			gw_hudiewu: {
				fullborder: "gold",
				type: "spell",
				subtype: "spell_gold",
				vanish: true,
				enable: function (card, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.countCards("ej");
					});
				},
				notarget: true,
				contentBefore: function () {
					player.$skill("蝴蝶舞", "legend", "metal");
					game.delay(2);
				},
				content: function () {
					"step 0";
					event.targets = game
						.filterPlayer(function (current) {
							return current.countCards("ej");
						})
						.sortBySeat();
					event.targets.remove(player);
					"step 1";
					if (event.targets.length) {
						var target = event.targets.shift();
						var ej = target.getCards("ej");
						player.line(target);
						target.removeEquipTrigger();
						for (var i = 0; i < ej.length; i++) {
							game.createCard(ej[i]).discard();
							ej[i].init([
								ej[i].suit,
								ej[i].number,
								"gw_dieyi_" + (get.subtype(ej[i]) || "judge"),
							]);
						}
						event.redo();
					}
				},
				contentAfter: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
				},
				ai: {
					value: 6,
					useful: [6, 1],
					result: {
						player: function (player) {
							return game.countPlayer(function (current) {
								if (current == player) return;
								return (
									-(current.countCards("e") - current.countCards("j") / 3) *
									get.sgn(get.attitude(player, current))
								);
							});
						},
					},
					order: 0.7,
				},
			},
			gw_yigeniyin: {
				fullborder: "gold",
				type: "spell",
				subtype: "spell_gold",
				vanish: true,
				enable: true,
				notarget: true,
				contentBefore: function () {
					player.$skill("伊格尼印", "legend", "metal");
					game.delay(2);
				},
				content: function () {
					"step 0";
					var enemies = player.getEnemies();
					var target = get.max(enemies, "hp", "list").randomGet();
					if (target) {
						player.line(target, "fire");
						target.damage("fire");
						game.delay();
					}
					"step 1";
					event.targets = game
						.filterPlayer(function (current) {
							return current.isMaxHp();
						})
						.sortBySeat();
					player.line(event.targets, "fire");
					"step 2";
					if (event.targets.length) {
						var target = event.targets.shift();
						player.line(target, "fire");
						target.damage("fire");
						event.redo();
					}
				},
				contentAfter: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
				},
				ai: {
					value: 8,
					useful: [6, 1],
					result: {
						player: function (player) {
							var enemies = player.getEnemies();
							var players = game.filterPlayer();
							var func = function (current) {
								if (current) return current.hp;
								return 0;
							};
							var max1 = get.max(enemies, func);
							for (var i = 0; i < players.length; i++) {
								if (players[i].hp == max1) {
									players.splice(i, 1);
									break;
								}
							}
							var max2 = get.max(players, func);
							if (max1 - 1 > max2) {
								return get.damageEffect(
									get.max(enemies, func, "item"),
									player,
									player,
									"fire"
								);
							} else {
								var num;
								if (max1 > max2) {
									num = get.sgn(
										get.damageEffect(
											get.max(enemies, func, "item"),
											player,
											player,
											"fire"
										)
									);
								} else if (max1 == max2) {
									num = 0;
								} else {
									num = 1;
								}
								return (
									num +
									game.countPlayer(function (current) {
										if (current.hp >= max2) {
											return get.sgn(get.damageEffect(current, player, player, "fire"));
										}
									})
								);
							}
						},
					},
					order: 0.7,
				},
			},
			gw_leizhoushu: {
				fullborder: "gold",
				type: "spell",
				subtype: "spell_gold",
				vanish: true,
				enable: true,
				notarget: true,
				contentBefore: function () {
					player.$skill("雷咒术", "legend", "metal");
					game.delay(2);
				},
				content: function () {
					if (player.hasSkill("gw_leizhoushu")) {
						if (typeof player.storage.gw_leizhoushu != "number") {
							player.storage.gw_leizhoushu = 2;
						} else {
							player.storage.gw_leizhoushu++;
						}
						player.syncStorage("gw_leizhoushu");
						player.updateMarks();
					} else {
						player.addSkill("gw_leizhoushu");
					}
				},
				contentAfter: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
				},
				ai: {
					value: 8,
					useful: [6, 1],
					result: {
						player: function (player) {
							return (
								1 +
								game.countPlayer(function (current) {
									if (current != player && current.isMaxHandcard()) {
										return -get.sgn(get.attitude(player, current));
									}
								})
							);
						},
					},
					order: 0.5,
				},
			},
			gw_aerdeyin: {
				fullborder: "gold",
				type: "spell",
				subtype: "spell_gold",
				vanish: true,
				enable: function (card, player) {
					var enemies = player.getEnemies();
					return enemies.length > 0;
				},
				notarget: true,
				contentBefore: function () {
					player.$skill("阿尔德印", "legend", "metal");
					game.delay(2);
				},
				content: function () {
					"step 0";
					var enemies = player.getEnemies();
					event.list = [enemies.randomGet()];
					"step 1";
					if (event.list.length) {
						var target = event.list.shift();
						event.target = target;
						player.line(target, "green");
						target.damage();
					} else {
						delete event.target;
					}
					"step 2";
					if (event.target) {
						if (!event.target.isTurnedOver()) {
							event.target.turnOver();
							event.target.addSkill("gw_aerdeyin");
						}
						event.goto(1);
					}
					"step 3";
					game.delay();
				},
				contentAfter: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
				},
				ai: {
					value: 8,
					useful: [6, 1],
					result: {
						player: function (player) {
							return game.countPlayer(function (current) {
								if (get.distance(player, current, "pure") == 1) {
									var att = get.sgn(get.attitude(player, current));
									if (current == player.next) {
										return -att * 1.5;
									}
									return -att;
								}
							});
						},
					},
					order: 0.5,
				},
			},
			gw_ansha: {
				fullborder: "gold",
				type: "spell",
				subtype: "spell_gold",
				vanish: true,
				enable: function (card, player) {
					var enemies = player.getEnemies();
					return game.hasPlayer(function (current) {
						return current.hp == 1 && enemies.includes(current);
					});
				},
				notarget: true,
				contentBefore: function () {
					player.$skill("暗杀", "legend", "metal");
					game.delay(2);
				},
				content: function () {
					var enemies = player.getEnemies();
					var list = game.filterPlayer(function (current) {
						return current.hp == 1 && enemies.includes(current);
					});
					if (list.length) {
						var target = list.randomGet();
						player.line(target);
						target.die();
					}
				},
				contentAfter: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
				},
				ai: {
					value: 8,
					useful: [6, 1],
					result: {
						player: 1,
					},
					order: 0.6,
				},
			},
			gw_xinsheng: {
				fullborder: "gold",
				type: "spell",
				subtype: "spell_gold",
				vanish: true,
				enable: function (card, player) {
					return game.hasPlayer(function (current) {
						return !current.isUnseen();
					});
				},
				notarget: true,
				contentBefore: function () {
					player.$skill("新生", "legend", "metal");
					game.delay(2);
				},
				content: function () {
					"step 0";
					var target = get.max(
						game
							.filterPlayer(function (current) {
								return !current.isUnseen();
							}, "list")
							.randomSort(),
						function (current) {
							var att = get.attitude(player, current);
							if (att < 0 && current.isDamaged() && current.hp <= 3) {
								return -10;
							}
							var rank = get.rank(current, true);
							if (current.maxHp >= 3) {
								if (current.hp <= 1) {
									if (att > 0) return att * 3 + 2;
									return att * 3;
								} else if (current.hp == 2) {
									if (att > 0) {
										att *= 1.5;
									} else {
										att /= 1.5;
									}
								}
							}
							if (rank >= 7) {
								if (att > 0) {
									return att / 10;
								}
								return -att / 5;
							} else if (rank <= 4) {
								if (att < 0) {
									return -att / 10;
								}
								return att;
							}
							return Math.abs(att / 2);
						},
						"item"
					);
					event.aitarget = target;
					var list = [];
					for (var i in lib.character) {
						if (!lib.filter.characterDisabled(i) && !lib.filter.characterDisabled2(i)) {
							list.push(i);
						}
					}
					var players = game.players.concat(game.dead);
					for (var i = 0; i < players.length; i++) {
						list.remove(players[i].name);
						list.remove(players[i].name1);
						list.remove(players[i].name2);
					}
					var dialog = ui.create.dialog("选择一张武将牌", "hidden");
					dialog.add([list.randomGets(12), "character"]);
					player.chooseButton(dialog, true).ai = function (button) {
						if (get.attitude(player, event.aitarget) > 0) {
							return get.rank(button.link, true);
						} else {
							return -get.rank(button.link, true);
						}
					};
					"step 1";
					event.nametarget = result.links[0];
					player.chooseTarget(
						true,
						"使用" + get.translation(event.nametarget) + "替换一名角色的武将牌",
						function (card, player, target) {
							return !target.isUnseen() && !target.isMin();
						}
					).ai = function (target) {
						if (target == event.aitarget) {
							return 1;
						} else {
							return 0;
						}
					};
					"step 2";
					var target = result.targets[0];
					var hp = target.hp;
					target.reinit(target.name, event.nametarget);
					target.hp = Math.min(hp + 1, target.maxHp);
					target.update();
					player.line(target, "green");
					"step 3";
					game.triggerEnter(target);
				},
				contentAfter: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
				},
				ai: {
					value: 8,
					useful: [6, 1],
					result: {
						player: 1,
					},
					order: 0.5,
				},
			},
			gw_niuquzhijing: {
				fullborder: "gold",
				type: "spell",
				subtype: "spell_gold",
				vanish: true,
				enable: function (card, player) {
					return game.hasPlayer(function (current) {
						return current.hp != player.hp;
					});
				},
				notarget: true,
				contentBefore: function () {
					var list1 = game.filterPlayer(function (current) {
						return current.isMaxHp();
					});
					var list2 = game.filterPlayer(function (current) {
						return current.isMinHp();
					});
					player.line(list1);
					for (var i = 0; i < list1.length; i++) {
						list1[i].addTempClass("target");
					}
					setTimeout(function () {
						var list11 = list1.slice(0);
						var list22 = list2.slice(0);
						while (list22.length > list11.length) {
							list11.push(list1.randomGet());
						}
						while (list22.length < list11.length) {
							list22.push(list2.randomGet());
						}
						list11.sortBySeat();
						list22.sortBySeat();
						while (list11.length) {
							list11.shift().line(list22.shift(), "green");
						}
					}, 500);
					player.$skill("纽曲之镜", "legend", "metal");
					game.delay(2);
				},
				content: function () {
					var max = null,
						min = null;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMaxHp()) {
							max = game.players[i].hp;
							break;
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isMinHp()) {
							min = game.players[i].hp;
							break;
						}
					}
					var targets = game.filterPlayer();
					if (max != min && max != null && min != null) {
						for (var i = 0; i < targets.length; i++) {
							if (targets[i].hp == max) {
								targets[i].hp--;
								targets[i].maxHp--;
								targets[i].$damagepop(-1);
							} else if (targets[i].hp == min) {
								targets[i].hp++;
								targets[i].maxHp++;
								targets[i].$damagepop(1, "wood");
							}
							targets[i].update();
						}
					}
				},
				contentAfter: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
				},
				ai: {
					value: 8,
					useful: [6, 1],
					result: {
						player: function (player, target) {
							return game.countPlayer(function (current) {
								if (current.isMaxHp()) {
									return -get.sgn(get.attitude(player, current));
								}
								if (current.isMinHp()) {
									return get.sgn(get.attitude(player, current));
								}
							});
						},
					},
					order: 3.5,
				},
			},
			gw_zhongmozhizhan: {
				fullborder: "gold",
				type: "spell",
				subtype: "spell_gold",
				vanish: true,
				enable: true,
				notarget: true,
				contentBefore: function () {
					player.line(game.filterPlayer());
					player.$skill("终末之战", "legend", "metal");
					game.delay(2);
				},
				content: function () {
					"step 0";
					event.num = 0;
					event.targets = game.filterPlayer().sortBySeat();
					"step 1";
					if (event.num < targets.length) {
						ui.clear();
						var target = targets[event.num];
						var cards = target.getCards("hej");
						target.lose(cards)._triggered = null;
						target.$throw(cards);
						event.num++;
						event.redo();
						game.delay(0.7);
					}
					"step 2";
					ui.clear();
				},
				contentAfter: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
				},
				ai: {
					value: 8,
					useful: [6, 1],
					result: {
						player: function (player, target) {
							if (player.hasUnknown()) return 0;
							return -game.countPlayer(function (current) {
								return current.countCards("he") * get.sgn(get.attitude(player, current));
							});
						},
					},
					order: 0.5,
				},
			},
			gw_ganhan: {
				fullborder: "gold",
				type: "spell",
				subtype: "spell_gold",
				vanish: true,
				enable: true,
				notarget: true,
				contentBefore: function () {
					player.line(game.filterPlayer());
					player.$skill("干旱", "legend", "metal");
					game.delay(2);
				},
				content: function () {
					"step 0";
					event.num = 0;
					event.targets = game.filterPlayer().sortBySeat();
					"step 1";
					if (event.num < targets.length) {
						ui.clear();
						var target = targets[event.num];
						target.loseMaxHp(true);
						event.num++;
						event.redo();
					}
					"step 2";
					ui.clear();
				},
				contentAfter: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
				},
				ai: {
					value: 7,
					useful: [5, 1],
					result: {
						player: function (player, target) {
							if (player.hasUnknown()) return 0;
							return game.countPlayer(function (current) {
								var att = -get.sgn(get.attitude(player, current));
								if (current.isHealthy()) {
									switch (current.hp) {
										case 1:
											return att * 3;
										case 2:
											return att * 2;
										case 3:
											return att * 1.5;
										case 4:
											return att;
										default:
											return att * 0.5;
									}
								} else if (current.maxHp - current.hp == 1) {
									switch (current.hp) {
										case 1:
											return att * 0.5;
										case 2:
											return att * 0.3;
										case 3:
											return att * 0.2;
										default:
											return att * 0.15;
									}
								} else {
									return att * 0.1;
								}
							});
						},
					},
					order: 0.5,
				},
			},
			gw_huangjiashenpan: {
				fullborder: "gold",
				type: "spell",
				subtype: "spell_gold",
				vanish: true,
				enable: true,
				notarget: true,
				contentBefore: function () {
					player.$skill("皇家审判", "legend", "metal");
					game.delay(2);
				},
				content: function () {
					"step 0";
					var list = get.libCard(function (info) {
						return info.subtype == "spell_gold";
					});
					list.remove("gw_huangjiashenpan");
					if (list.length) {
						player.chooseVCardButton(list, true, "notype").ai = function () {
							return Math.random();
						};
					}
					"step 1";
					if (result.bool) {
						player.gain(game.createCard(result.links[0][2]), "draw");
					}
				},
				contentAfter: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
				},
				ai: {
					value: 8,
					useful: [6, 1],
					result: {
						player: 1,
					},
					order: 0.1,
				},
			},
			gw_tunshi: {
				fullborder: "gold",
				type: "spell",
				subtype: "spell_gold",
				vanish: true,
				enable: function (event, player) {
					if (player.maxHp == 1) return false;
					var list = player.getEnemies();
					for (var i = 0; i < list.length; i++) {
						if (list[i].isMin()) continue;
						if (list[i].getStockSkills().length) return true;
					}
				},
				notarget: true,
				contentBefore: function () {
					player.$skill("吞噬", "legend", "metal");
					game.delay(2);
				},
				content: function () {
					var list = player.getEnemies();
					for (var i = 0; i < list.length; i++) {
						if (list[i].isMin() || !list[i].getStockSkills().length) {
							list.splice(i--, 1);
						}
					}
					if (list.length) {
						var target = list.randomGet();
						target.addExpose(0.1);
						player.line(target);
						var skill = target.getStockSkills().randomGet();
						target.popup(skill);
						player.addSkill(skill);
						target.removeSkill(skill);
						player.loseHp();
						player.loseMaxHp(true);
						target.gainMaxHp(true);
						target.recover();
					}
				},
				contentAfter: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
				},
				ai: {
					value: 8,
					useful: [6, 1],
					result: {
						player: function (player) {
							if (player.hp <= 2) return 0;
							return 1;
						},
					},
					order: 0.4,
				},
			},
			gw_chongci: {
				fullborder: "gold",
				type: "spell",
				subtype: "spell_gold",
				vanish: true,
				enable: true,
				notarget: true,
				contentBefore: function () {
					player.$skill("冲刺", "legend", "metal");
					game.delay(2);
				},
				content: function () {
					"step 0";
					event.hs = player.getCards("h");
					event.es = player.getCards("e");
					player.discard(event.hs.concat(event.es));
					"step 1";
					var hs2 = [];
					for (var i = 0; i < event.hs.length; i++) {
						var type = get.type(event.hs[i], "trick");
						var cardname = event.hs[i].name;
						var list = game.findCards(function (name) {
							if (cardname == name) return;
							if (get.type({ name: name }, "trick") == type) {
								return true;
							}
						});
						if (!list.length) {
							list = [cardname];
						}
						hs2.push(game.createCard(list.randomGet()));
					}
					var list = get.libCard(function (info) {
						return info.type == "spell" && info.subtype != "spell_gold";
					});
					if (list.length) {
						hs2.push(game.createCard(list.randomGet()));
					}
					if (hs2.length) {
						player.gain(hs2, "draw");
					}
					"step 2";
					var es2 = [];
					for (var i = 0; i < event.es.length; i++) {
						var subtype = get.subtype(event.es[i]);
						var cardname = event.es[i].name;
						var list = game.findCards(function (name) {
							if (cardname == name) return;
							if (get.subtype({ name: name }) == subtype) {
								return true;
							}
						});
						if (!list.length) {
							list = [cardname];
						}
						es2.push(game.createCard(list.randomGet()));
					}
					if (es2.length) {
						game.delay();
						player.$draw(es2);
						for (var i = 0; i < es2.length; i++) {
							player.equip(es2[i]);
						}
					}
					"step 3";
					player.tempHide();
				},
				contentAfter: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
				},
				ai: {
					value: 8,
					useful: [6, 1],
					result: {
						player: 1,
					},
					order: 0.2,
				},
			},
			gw_youer: {
				fullborder: "silver",
				type: "spell",
				subtype: "spell_silver",
				vanish: true,
				enable: true,
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("h") > 0;
				},
				content: function () {
					"step 0";
					var cards = target.getCards("h");
					target.lose(cards, ui.special);
					target.storage.gw_youer = cards;
					target.addSkill("gw_youer");
					"step 1";
					player.draw();
				},
				ai: {
					basic: {
						order: 10,
						value: 7,
						useful: [3, 1],
					},
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("noh")) return 3;
							var num = -Math.sqrt(target.countCards("h"));
							if (player.hasSha() && player.canUse("sha", target)) {
								num -= 2;
							}
							return num;
						},
					},
				},
			},
			gw_tongdi: {
				fullborder: "silver",
				type: "spell",
				subtype: "spell_silver",
				vanish: true,
				enable: true,
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("h");
				},
				content: function () {
					"step 0";
					player.gainPlayerCard(target, "h", true, "visible").set("ai", function (button) {
						return get.value(button.link);
					});
					"step 1";
					target.gain(game.createCard("sha"), "gain2");
				},
				ai: {
					basic: {
						order: 8,
						value: 9.5,
						useful: [5, 1],
					},
					result: {
						target: function (player, target) {
							if (target.getEquip(4)) return -2;
							return -1;
						},
					},
				},
			},
			gw_fuyuan: {
				fullborder: "silver",
				type: "spell",
				subtype: "spell_silver",
				vanish: true,
				savable: true,
				selectTarget: -1,
				content: function () {
					target.recover();
					target.draw();
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
			gw_zhuoshao: {
				fullborder: "silver",
				type: "spell",
				subtype: "spell_silver",
				vanish: true,
				enable: true,
				filterTarget: function (card, player, target) {
					return target.isMaxHp();
				},
				cardnature: "fire",
				selectTarget: [1, Infinity],
				content: function () {
					target.damage("fire");
				},
				ai: {
					basic: {
						order: 8.5,
						value: 7.5,
						useful: [4, 1],
					},
					result: {
						target: -1,
					},
					tag: {
						damage: 1,
						fireDamage: 1,
						natureDamage: 1,
					},
				},
			},
			gw_butianshu: {
				fullborder: "silver",
				type: "spell",
				subtype: "spell_silver",
				vanish: true,
				enable: true,
				filterTarget: true,
				// contentBefore:function(){
				// 	player.$skill('卜天术','legend','water');
				// 	game.delay(2);
				// },
				content: function () {
					"step 0";
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].mode && lib.card[i].mode.includes(lib.config.mode) == false) continue;
						if (lib.card[i].vanish) continue;
						if (lib.card[i].type == "delay") list.push([cards[0].suit, cards[0].number, i]);
					}
					var dialog = ui.create.dialog("卜天术", [list, "vcard"]);
					var bing = target.countCards("h") <= 1;
					player.chooseButton(dialog, true, function (button) {
						if (get.effect(target, { name: button.link[2] }, player, player) > 0) {
							if (button.link[2] == "bingliang") {
								if (bing) return 2;
								return 0.7;
							}
							if (button.link[2] == "lebu") {
								return 1;
							}
							if (button.link[2] == "guiyoujie") {
								return 0.5;
							}
							if (button.link[2] == "caomu") {
								return 0.3;
							}
							return 0.2;
						}
						return 0;
					}).filterButton = function (button) {
						return !target.hasJudge(button.link[2]);
					};
					"step 1";
					var card = game.createCard(result.links[0][2]);
					event.judgecard = card;
					target.$draw(card);
					game.delay(0.7);
					"step 2";
					target.addJudge(event.judgecard);
				},
				ai: {
					value: 8,
					useful: [5, 1],
					result: {
						player: function (player, target) {
							var eff = 0;
							for (var i in lib.card) {
								if (lib.card[i].type == "delay") {
									var current = get.effect(target, { name: i }, player, player);
									if (current > eff) {
										eff = current;
									}
								}
							}
							return eff;
						},
					},
					order: 6,
				},
			},
			gw_shizizhaohuan: {
				fullborder: "silver",
				type: "spell",
				subtype: "spell_silver",
				vanish: true,
				enable: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				// contentBefore:function(){
				// 	player.$skill('十字召唤','legend','water');
				// 	game.delay(2);
				// },
				content: function () {
					var list = [];
					list.push(get.cardPile2("juedou"));
					list.push(get.cardPile2("huogong"));
					list.push(get.cardPile2("nanman"));
					list.push(get.cardPile2("huoshaolianying"));
					for (var i = 0; i < list.length; i++) {
						if (!list[i]) list.splice(i--, 1);
					}
					list = [list.randomGet()];
					var sha = get.cardPile2("sha");
					if (sha) {
						if (list.length) {
							list.push(sha);
						} else {
							sha.remove();
							list.push(sha);
							var sha2 = get.cardPile2("sha");
							if (sha2) {
								list.push(sha2);
							}
						}
					}
					if (list.length) {
						target.gain(list, "gain2", "log");
					}
				},
				ai: {
					value: 8,
					useful: [6, 1],
					result: {
						player: 1,
					},
					order: 6,
				},
			},
			gw_zuihouyuanwang: {
				fullborder: "silver",
				type: "spell",
				subtype: "spell_silver",
				vanish: true,
				enable: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				// contentBefore:function(){
				// 	player.$skill('最后愿望','legend','water');
				// 	game.delay(2);
				// },
				content: function () {
					"step 0";
					event.num = game.countPlayer();
					player.draw(event.num);
					"step 1";
					player.chooseToDiscard(true, event.num, "he");
				},
				ai: {
					value: 6,
					useful: [4, 1],
					result: {
						player: function (player) {
							var num = player.countCards("he");
							if (num <= 1) return 0;
							if (num <= 3 && !player.needsToDiscard()) return 0;
							return 1;
						},
					},
					order: 7,
				},
			},
			gw_zirankuizeng: {
				fullborder: "silver",
				type: "spell",
				subtype: "spell_silver",
				vanish: true,
				enable: true,
				notarget: true,
				// contentBefore:function(){
				// 	player.$skill('自然馈赠','legend','water');
				// 	game.delay(2);
				// },
				content: function () {
					"step 0";
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].subtype == "spell_bronze")
							list.push([cards[0].suit, cards[0].number, i]);
					}
					var dialog = ui.create.dialog("自然馈赠", [list, "vcard"]);
					var rand = get.rand();
					var aozu = game.hasPlayer(function (current) {
						return (
							player.canUse("gw_aozuzhilei", current) &&
							current.hp <= 3 &&
							get.effect(current, { name: "gw_aozuzhilei" }, player, player) > 0
						);
					});
					var aozu2 = game.hasPlayer(function (current) {
						return (
							player.canUse("gw_aozuzhilei", current) &&
							current.hp <= 2 &&
							get.effect(current, { name: "gw_aozuzhilei" }, player, player) > 0
						);
					});
					var aozu3 = game.hasPlayer(function (current) {
						return (
							player.canUse("gw_aozuzhilei", current) &&
							get.effect(current, { name: "gw_aozuzhilei" }, player, player) > 0
						);
					});
					var baoxue = game.hasPlayer(function (current) {
						return (
							player.canUse("gw_baoxueyaoshui", current) &&
							get.attitude(player, current) < 0 &&
							[2, 3].includes(current.countCards("h")) &&
							!current.hasSkillTag("noh")
						);
					});
					var baoxue2 = game.hasPlayer(function (current) {
						return (
							player.canUse("gw_baoxueyaoshui", current) &&
							get.attitude(player, current) < 0 &&
							[2].includes(current.countCards("h")) &&
							!current.hasSkillTag("noh")
						);
					});
					var baoxue3 = game.hasPlayer(function (current) {
						return (
							player.canUse("gw_baoxueyaoshui", current) &&
							get.attitude(player, current) < 0 &&
							current.countCards("h") >= 2 &&
							!current.hasSkillTag("noh")
						);
					});
					var nongwu = game.hasPlayer(function (current) {
						return (
							get.attitude(player, current) < 0 &&
							(get.attitude(player, current.getNext()) < 0 ||
								get.attitude(player, current.getPrevious()) < 0)
						);
					});
					var nongwu2 = game.hasPlayer(function (current) {
						return (
							get.attitude(player, current) < 0 &&
							get.attitude(player, current.getNext()) < 0 &&
							get.attitude(player, current.getPrevious()) < 0
						);
					});
					var yanzi = game.hasPlayer(function (current) {
						return get.attitude(player, current) > 0 && current.isMinHandcard();
					});
					player.chooseButton(dialog, true, function (button) {
						var name = button.link[2];
						switch (name) {
							case "gw_ciguhanshuang":
								if (nongwu2) return 3;
								if (nongwu) return 1;
								return 0;
							case "gw_baoxueyaoshui":
								if (baoxue2) return 2;
								if (baoxue) return 1.5;
								if (baoxue3) return 0.5;
								return 0;
							case "gw_aozuzhilei":
								if (aozu2) return 2.5;
								if (aozu) return 1.2;
								if (aozu3) return 0.2;
								return 0;
							case "gw_yanziyaoshui":
								if (yanzi) return 2;
								return 0.6;
						}
						if (
							game.hasPlayer(function (current) {
								return (
									player.canUse(name, current) &&
									get.effect(current, { name: name }, player, player) > 0
								);
							})
						) {
							return Math.random();
						}
						return 0;
					}).filterButton = function (button) {
						var name = button.link[2];
						if (!lib.card[name].notarget) {
							return game.hasPlayer(function (current) {
								return player.canUse(name, current);
							});
						}
						return true;
					};
					"step 1";
					player.chooseUseTarget(
						true,
						game.createCard(result.links[0][2], get.suit(card), get.number(card))
					);
				},
				ai: {
					value: 7,
					useful: [4, 1],
					result: {
						player: function (player) {
							return 1;
						},
					},
					order: 7,
				},
			},
			gw_nuhaifengbao: {
				fullborder: "silver",
				type: "spell",
				subtype: "spell_silver",
				enable: true,
				filterTarget: function (card, player, target) {
					return !target.hasSkill("gw_nuhaifengbao");
				},
				content: function () {
					target.addSkill("gw_nuhaifengbao");
				},
				ai: {
					value: [7, 1],
					useful: [4, 1],
					result: {
						target: function (player, target) {
							return -2 / Math.sqrt(1 + target.hp);
						},
					},
					order: 1.2,
				},
			},
			gw_baishuang: {
				fullborder: "silver",
				type: "spell",
				subtype: "spell_silver",
				enable: true,
				filterTarget: function (card, player, target) {
					return !target.hasSkill("gw_ciguhanshuang");
				},
				selectTarget: [1, 3],
				content: function () {
					target.addSkill("gw_ciguhanshuang");
				},
				ai: {
					value: [7.5, 1],
					useful: [5, 1],
					result: {
						target: -1,
					},
					order: 1.2,
				},
			},
			gw_baobaoshu: {
				fullborder: "silver",
				type: "spell",
				subtype: "spell_silver",
				enable: true,
				filterTarget: function (card, player, target) {
					return !target.hasSkill("gw_baobaoshu");
				},
				selectTarget: [1, 2],
				content: function () {
					target.addTempSkill("gw_baobaoshu", { player: "phaseAfter" });
				},
				ai: {
					value: [7.5, 1],
					useful: [5, 1],
					result: {
						target: function (player, target) {
							return -Math.sqrt(target.countCards("h")) - 0.5;
						},
					},
					order: 1.2,
				},
			},
			gw_guaiwuchaoxue: {
				fullborder: "silver",
				type: "spell",
				subtype: "spell_silver",
				enable: true,
				usable: 1,
				updateUsable: "phaseUse",
				forceUsable: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					var list = get.gainableSkills(function (info, skill) {
						return info.ai && info.ai.maixie_hp && !player.hasSkill(skill);
					});
					list.remove("guixin");
					if (list.length) {
						var skill = list.randomGet();
						player.popup(skill);
						player.addTempSkill(skill, { player: "phaseBegin" });
						var enemies = player.getEnemies();
						if (enemies.length) {
							var source = enemies.randomGet();
							source.line(player);
							source.addExpose(0.1);
							player.damage(source);
							player.recover();
						}
					}
				},
				ai: {
					value: [8, 1],
					useful: [3, 1],
					result: {
						target: function (player, target) {
							if (target.hp <= 1 || target.hujia) return 0;
							return 1;
						},
					},
					order: 1,
				},
			},
			gw_qinpendayu: {
				fullborder: "bronze",
				type: "spell",
				subtype: "spell_bronze",
				enable: true,
				filterTarget: function (card, player, target) {
					return !target.hasSkill("gw_qinpendayu");
				},
				changeTarget: function (player, targets) {
					game.filterPlayer(function (current) {
						return get.distance(targets[0], current, "pure") == 1;
					}, targets);
				},
				content: function () {
					target.addSkill("gw_qinpendayu");
				},
				ai: {
					value: [5, 1],
					useful: [3, 1],
					result: {
						target: function (player, current) {
							if (current.hasSkill("gw_qinpendayu")) return 0;
							return Math.max(-1, -0.1 - 0.3 * current.needsToDiscard(2));
						},
					},
					order: 1.2,
				},
			},
			gw_birinongwu: {
				fullborder: "bronze",
				type: "spell",
				subtype: "spell_bronze",
				enable: true,
				filterTarget: function (card, player, target) {
					return !target.hasSkill("gw_birinongwu");
				},
				changeTarget: function (player, targets) {
					game.filterPlayer(function (current) {
						return get.distance(targets[0], current, "pure") == 1;
					}, targets);
				},
				content: function () {
					target.addSkill("gw_birinongwu");
				},
				ai: {
					value: [5, 1],
					useful: [3, 1],
					result: {
						player: function (player, current) {
							if (current.hasSkill("gw_birinongwu")) return 0;
							return -1;
						},
					},
					order: 1.2,
				},
			},
			gw_ciguhanshuang: {
				fullborder: "bronze",
				type: "spell",
				subtype: "spell_bronze",
				enable: true,
				filterTarget: function (card, player, target) {
					return !target.hasSkill("gw_ciguhanshuang");
				},
				changeTarget: function (player, targets) {
					game.filterPlayer(function (current) {
						return get.distance(targets[0], current, "pure") == 1;
					}, targets);
				},
				content: function () {
					target.addSkill("gw_ciguhanshuang");
				},
				ai: {
					value: [5, 1],
					useful: [3, 1],
					result: {
						target: function (player, target) {
							if (target.hasSkill("gw_ciguhanshuang")) return 0;
							return -1;
						},
					},
					order: 1.2,
				},
			},
			gw_baoxueyaoshui: {
				fullborder: "bronze",
				type: "spell",
				subtype: "spell_bronze",
				enable: true,
				filterTarget: true,
				content: function () {
					"step 0";
					target.chooseToDiscard("h", 2, true).delay = false;
					"step 1";
					target.draw();
				},
				ai: {
					value: 6,
					useful: [3, 1],
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("noh")) return 0.1;
							switch (target.countCards("h")) {
								case 0:
									return 0.5;
								case 1:
									return 0;
								case 2:
									return -1.5;
								default:
									return -1;
							}
						},
					},
					order: 8,
					tag: {
						loseCard: 1,
						discard: 1,
					},
				},
			},
			gw_zhihuanjun: {
				fullborder: "bronze",
				type: "spell",
				subtype: "spell_bronze",
				enable: true,
				filterTarget: function (card, player, target) {
					return target.isDamaged();
				},
				content: function () {
					"step 0";
					target.loseMaxHp(true);
					"step 1";
					if (target.isDamaged() && target.countCards("h") < target.maxHp) {
						event.goto(0);
					}
				},
				ai: {
					value: [4, 1],
					useful: [3, 1],
					result: {
						target: function (player, target) {
							if (target.maxHp - target.hp == 1) {
								return -1 / target.maxHp;
							} else {
								return -1 / target.maxHp / 3;
							}
						},
					},
					order: 2,
				},
			},
			gw_zumoshoukao: {
				fullborder: "bronze",
				type: "spell",
				subtype: "spell_bronze",
				enable: true,
				filterTarget: function (card, player, target) {
					return target.hujia || !target.hasSkill("fengyin");
				},
				content: function () {
					target.addTempSkill("fengyin", { player: "phaseAfter" });
					// if(target.hujia){
					// 	target.changeHujia(-1);
					// }
				},
				ai: {
					value: [4.5, 1],
					useful: [4, 1],
					result: {
						target: function (player, target) {
							var threaten = get.threaten(target, player, true);
							if (target.hasSkill("fengyin")) {
								return 0;
							}
							if (target.hasSkillTag("maixie_hp")) {
								threaten *= 1.5;
							}
							return -threaten;
						},
					},
					order: 9.5,
				},
			},
			gw_aozuzhilei: {
				fullborder: "bronze",
				type: "spell",
				subtype: "spell_bronze",
				enable: true,
				cardnature: "thunder",
				filterTarget: function (card, player, target) {
					return target.hp >= player.hp;
				},
				content: function () {
					"step 0";
					target.damage("thunder");
					"step 1";
					if (target.isIn()) {
						target.draw();
					}
				},
				ai: {
					basic: {
						order: 1.8,
						value: [5, 1],
						useful: [4, 1],
					},
					result: {
						target: -1,
					},
					tag: {
						damage: 1,
						thunderDamage: 1,
						natureDamage: 1,
					},
				},
			},
			gw_poxiao: {
				fullborder: "bronze",
				type: "spell",
				subtype: "spell_bronze",
				enable: true,
				notarget: true,
				content: function () {
					"step 0";
					var choice = 1;
					if (
						game.countPlayer(function (current) {
							if (current.countCards("j") || current.hasSkillTag("weather")) {
								if (get.attitude(player, current) > 0) {
									choice = 0;
								}
								return true;
							}
						})
					) {
						player
							.chooseControl(function () {
								return choice;
							})
							.set("choiceList", [
								"解除任意名角色的天气效果并移除其判定区内的牌",
								"随机获得一张铜卡法术（破晓除外）并展示之",
							]);
					} else {
						event.directfalse = true;
					}
					"step 1";
					if (!event.directfalse && result.index == 0) {
						player.chooseTarget(
							true,
							[1, Infinity],
							"解除任意名角色的天气效果并移除其判定区内的牌",
							function (card, player, target) {
								return target.countCards("j") || target.hasSkillTag("weather");
							}
						).ai = function (target) {
							return get.attitude(player, target);
						};
					} else {
						var list = get.libCard(function (info, name) {
							return name != "gw_poxiao" && info.subtype == "spell_bronze";
						});
						if (list.length) {
							player.gain(game.createCard(list.randomGet()), "gain2");
						} else {
							player.draw();
						}
						event.finish();
					}
					"step 2";
					event.list = result.targets.slice(0).sortBySeat();
					"step 3";
					if (event.list.length) {
						var target = event.list.shift();
						player.line(target, "green");
						var cards = target.getCards("j");
						if (cards.length) {
							target.discard(cards);
						}
						if (target.hasSkillTag("weather")) {
							var skills = target.getSkills();
							for (var i = 0; i < skills.length; i++) {
								var info = get.info(skills[i]);
								if (info && info.ai && info.ai.weather) {
									target.removeSkill(skills[i]);
									game.log(
										target,
										"解除了",
										"【" + get.translation(skills[i]) + "】",
										"的效果"
									);
								}
							}
						}
						event.redo();
					}
				},
				ai: {
					order: 4,
					value: [5, 1],
					useful: [4, 1],
					result: {
						player: 1,
					},
				},
			},
			gw_kunenfayin: {
				fullborder: "bronze",
				type: "spell",
				subtype: "spell_bronze",
				enable: true,
				filterTarget: function (card, player, target) {
					return !target.hasSkill("gw_kunenfayin");
				},
				content: function () {
					target.addSkill("gw_kunenfayin");
				},
				ai: {
					basic: {
						order: 2,
						value: [5, 1],
						useful: [4, 1],
					},
					result: {
						target: function (player, target) {
							if (target == player) return get.threaten(target, player) / 1.5;
							return get.threaten(target, player);
						},
					},
				},
			},
			gw_yanziyaoshui: {
				fullborder: "bronze",
				type: "spell",
				subtype: "spell_bronze",
				enable: true,
				filterTarget: true,
				content: function () {
					if (target.isMinHandcard()) {
						target.draw(2);
					} else {
						target.draw();
					}
				},
				ai: {
					basic: {
						order: 6,
						value: [6, 1],
						useful: [4, 1],
					},
					result: {
						target: function (player, target) {
							if (target.isMinHandcard()) return 2;
							return 1;
						},
					},
				},
			},
			gw_wenyi: {
				fullborder: "bronze",
				type: "spell",
				subtype: "spell_bronze",
				enable: true,
				filterTarget: function (card, player, target) {
					return target.isMinHp();
				},
				selectTarget: -1,
				content: function () {
					if (target.countCards("h")) {
						target.randomDiscard("h");
					} else {
						target.loseHp();
					}
				},
				ai: {
					basic: {
						order: 6,
						value: [6, 1],
						useful: [4, 1],
					},
					result: {
						target: function (player, target) {
							if (target.countCards("h")) return -1;
							return -2;
						},
					},
					tag: {
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			gw_shanbengshu: {
				fullborder: "bronze",
				type: "spell",
				subtype: "spell_bronze",
				enable: function (event, player) {
					var list = player.getEnemies();
					for (var i = 0; i < list.length; i++) {
						if (list[i].countCards("e")) {
							return true;
						}
					}
					return false;
				},
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content: function () {
					var list = target.getEnemies();
					var equips = [];
					for (var i = 0; i < list.length; i++) {
						equips.addArray(list[i].getCards("e"));
					}
					equips = equips.randomGets(2);
					if (equips.length == 2) {
						var target1 = get.owner(equips[0]);
						var target2 = get.owner(equips[1]);
						if (target1 == target2) {
							target1.discard(equips);
							player.line(target1);
						} else {
							target1.discard(equips[0]).delay = false;
							target2.discard(equips[1]);
							player.line(target1);
							player.line(target2);
						}
					} else if (equips.length) {
						var target1 = get.owner(equips[0]);
						target1.discard(equips[0]);
						player.line(target1);
					}
				},
				ai: {
					basic: {
						order: 9,
						value: [6, 1],
						useful: [4, 1],
					},
					result: {
						target: 1,
					},
					tag: {
						multitarget: 1,
						multineg: 1,
					},
				},
			},
		},
		skill: {
			gw_aerdeyin: {
				trigger: { global: "roundStart" },
				silent: true,
				mark: true,
				intro: {
					content:
						"新的一轮开始时，若武将牌正面朝上，则在当前回合结束后进行一个额外回合，否则将武将牌翻回正面",
				},
				content: function () {
					if (player.isTurnedOver()) {
						player.turnOver();
						player.removeSkill("gw_aerdeyin");
						player.logSkill("gw_aerdeyin");
					} else {
						player.insertPhase();
					}
				},
				group: "gw_aerdeyin_phase",
				subSkill: {
					phase: {
						trigger: { player: "phaseBefore" },
						silent: true,
						filter: function (event, player) {
							return event.skill == "gw_aerdeyin";
						},
						content: function () {
							player.removeSkill("gw_aerdeyin");
							player.logSkill("gw_aerdeyin");
						},
					},
				},
			},
			gw_kunenfayin: {
				mark: true,
				nopop: true,
				intro: {
					content: "防止所有非属性伤害（剩余个#角色的回合）",
				},
				init: function (player) {
					player.storage.gw_kunenfayin = Math.min(5, game.countPlayer());
				},
				trigger: { player: "damageBefore" },
				filter: function (event) {
					return !event.nature;
				},
				forced: true,
				content: function () {
					trigger.cancel();
				},
				ai: {
					nodamage: true,
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, "damage") && !get.tag(card, "natureDamage")) return "zeroplayertarget";
						},
					},
				},
				subSkill: {
					count: {
						trigger: { global: "phaseEnd" },
						silent: true,
						content: function () {
							player.storage.gw_kunenfayin--;
							if (player.storage.gw_kunenfayin > 0) {
								player.updateMarks();
							} else {
								player.removeSkill("gw_kunenfayin");
							}
						},
					},
				},
				group: "gw_kunenfayin_count",
				onremove: true,
			},
			gw_baobaoshu: {
				mark: true,
				nopop: true,
				intro: {
					content: "每使用一张基本牌或锦囊牌，需弃置一张牌",
				},
				trigger: { player: "useCard" },
				forced: true,
				filter: function (event, player) {
					if (player.countCards("he") == 0) return false;
					var type = get.type(event.card, "trick");
					return type == "basic" || type == "trick";
				},
				content: function () {
					if (!event.isMine()) game.delay(0.5);
					player.chooseToDiscard(true, "he");
				},
				ai: {
					weather: true,
					effect: {
						player_use(card, player) {
							return [1, (player.needsToDiscard(0, (i, p) => {
								if (p.canIgnoreHandcard(i)) return false;
								if (i === card || card.cards && card.cards.includes(i)) return false;
								return true;
							}) ? -0.4 : -1)];
						},
					},
				},
			},
			gw_nuhaifengbao: {
				mark: true,
				intro: {
					content: "结束阶段随机弃置一张牌（剩余#回合）",
				},
				init: function (player) {
					player.storage.gw_nuhaifengbao = 2;
				},
				trigger: { player: "phaseEnd" },
				forced: true,
				nopop: true,
				content: function () {
					player.randomDiscard();
					player.storage.gw_nuhaifengbao--;
					if (player.storage.gw_nuhaifengbao > 0) {
						player.updateMarks();
					} else {
						player.removeSkill("gw_nuhaifengbao");
					}
				},
				onremove: true,
				ai: {
					neg: true,
					weather: true,
				},
			},
			gw_youer: {
				trigger: { global: "phaseEnd", player: "dieBegin" },
				forced: true,
				audio: false,
				mark: true,
				intro: {
					content: "cards",
				},
				content: function () {
					if (player.storage.gw_youer) {
						if (trigger.name == "phase") {
							player.gain(player.storage.gw_youer);
						} else {
							player.$throw(player.storage.gw_youer, 1000);
							for (var i = 0; i < player.storage.gw_youer.length; i++) {
								player.storage.gw_youer[i].discard();
							}
							game.log(player, "弃置了", player.storage.gw_youer);
						}
					}
					delete player.storage.gw_youer;
					player.removeSkill("gw_youer");
				},
			},
			gw_qinpendayu: {
				mark: true,
				nopop: true,
				intro: {
					content: "手牌上限-1直到下一个弃牌阶段结束",
				},
				mod: {
					maxHandcard: function (player, num) {
						return num - 1;
					},
				},
				ai: {
					weather: true,
				},
				group: "gw_qinpendayu_clear",
				subSkill: {
					clear: {
						trigger: { player: "phaseDiscardAfter" },
						silent: true,
						content: function () {
							player.removeSkill("gw_qinpendayu");
						},
					},
				},
			},
			gw_birinongwu: {
				mark: true,
				nopop: true,
				intro: {
					content: "不能使用杀直到下一个出牌阶段结束",
				},
				mod: {
					cardEnabled: function (card) {
						if (card.name == "sha") return false;
					},
				},
				ai: {
					weather: true,
				},
				group: "gw_birinongwu_clear",
				subSkill: {
					clear: {
						trigger: { player: "phaseUseAfter" },
						silent: true,
						content: function () {
							player.removeSkill("gw_birinongwu");
						},
					},
				},
			},
			gw_ciguhanshuang: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				mark: true,
				nopop: true,
				intro: {
					content: "下个摸牌阶段摸牌数-1",
				},
				filter: function (event) {
					return event.num > 0;
				},
				content: function () {
					trigger.num--;
					player.removeSkill("gw_ciguhanshuang");
				},
				ai: {
					weather: true,
				},
			},
			gw_dieyi: {
				init: function (player) {
					player.storage.gw_dieyi = 1;
				},
				onremove: true,
				trigger: { global: "phaseEnd" },
				forced: true,
				mark: true,
				nopop: true,
				process: function (player) {
					if (player.hasSkill("gw_dieyi")) {
						player.storage.gw_dieyi++;
					} else {
						player.addSkill("gw_dieyi");
					}
					player.syncStorage("gw_dieyi");
					player.updateMarks();
				},
				intro: {
					content: "在当前回合的结束阶段，你随机弃置#张牌",
				},
				content: function () {
					player.randomDiscard(player.storage.gw_dieyi);
					player.removeSkill("gw_dieyi");
				},
			},
			gw_leizhoushu: {
				mark: true,
				intro: {
					content: function (storage, player) {
						if (storage >= 2) {
							return (
								"锁定技，准备阶段，你令手牌数为全场最多的所有其他角色各随机弃置一张手牌，若目标不包含敌方角色，将一名随机敌方角色追加为额外目标（重复" +
								storage +
								"次）"
							);
						} else {
							return "锁定技，准备阶段，你令手牌数为全场最多的所有其他角色各随机弃置一张手牌，若目标不包含敌方角色，将一名随机敌方角色追加为额外目标";
						}
					},
				},
				nopop: true,
				trigger: { player: "phaseBegin" },
				forced: true,
				filter: function (event, player) {
					var list = game.filterPlayer();
					for (var i = 0; i < list.length; i++) {
						if (list[i] != player && list[i].isMaxHandcard()) return true;
					}
					return false;
				},
				content: function () {
					"step 0";
					if (typeof player.storage.gw_leizhoushu == "number") {
						event.num = player.storage.gw_leizhoushu;
					} else {
						event.num = 1;
					}
					"step 1";
					if (event.num) {
						var max = 0;
						var maxp = null;
						var list = game
							.filterPlayer(function (current) {
								return current.isMaxHandcard();
							})
							.sortBySeat();
						var enemies = player.getEnemies();
						for (var i = 0; i < enemies.length; i++) {
							if (list.includes(enemies[i])) {
								break;
							}
						}
						if (i == enemies.length) {
							list.push(enemies.randomGet());
						}
						list.remove(player);
						if (!list.length) {
							event.finish();
							return;
						}
						player.line(list, "green");
						for (var i = 0; i < list.length; i++) {
							list[i].randomDiscard("h", false);
						}
					} else {
						event.finish();
					}
					"step 2";
					event.num--;
					event.goto(1);
					game.delay();
				},
			},
			_gainspell: {
				trigger: { player: "drawBegin" },
				silent: true,
				priority: -11,
				filter: function (event, player) {
					if (_status.connectMode) return false;
					if (!lib.config.cards.includes("gwent")) return false;
					if (player.isMin()) return false;
					if (game.fixedPile) return false;
					return event.num > 0 && event.parent.name == "phaseDraw";
				},
				content: function () {
					if (!player.storage.spell_gain || Math.max.apply(null, player.storage.spell_gain) < 0) {
						var tmp = player.storage.spell_gain2;
						player.storage.spell_gain = [
							0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
						].randomGets(3);
						player.storage.spell_gain2 = Math.floor(
							(15 - Math.max.apply(null, player.storage.spell_gain)) / 2
						);
						if (tmp) {
							for (var i = 0; i < 3; i++) {
								player.storage.spell_gain[i] += tmp;
							}
						}
					}
					for (var i = 0; i < 3; i++) {
						if (player.storage.spell_gain[i] == 0) {
							var list;
							if (i == 0) {
								list = get.libCard(function (info) {
									return info.subtype == "spell_gold";
								});
								if (get.mode() == "stone") {
									list.remove("gw_aerdeyin");
									list.remove("gw_niuquzhijing");
								}
							} else {
								list = get.libCard(function (info) {
									return info.subtype == "spell_silver";
								});
								if (get.mode() == "stone") {
									list.remove("gw_butianshu");
								}
							}
							if (list && list.length) {
								ui.cardPile.insertBefore(
									game.createCard(list.randomGet()),
									ui.cardPile.firstChild
								);
							}
						}
						player.storage.spell_gain[i]--;
					}
				},
			},
		},
		help: {
			昆特牌:
				"<ul><li>法术为分金、银、铜三类，金卡和银卡不出现在牌堆中<li>" +
				"摸牌阶段有一定概率摸到银卡，在16个摸牌阶段中至少会摸到2张银卡<li>" +
				"摸牌阶段有一定概率摸到金卡，在16个摸牌阶段中至少会摸到1张金卡<li>" +
				"金卡无视调虎离山、潜行等免疫目标的效果<li>" +
				"进行洗牌时金卡、银卡将从弃牌堆中消失，不进入牌堆",
		},
		translate: {
			spell: "法术",
			spell_gold: "金卡法术",
			spell_silver: "银卡法术",
			spell_bronze: "铜卡法术",

			gw_youlanzhimeng: "幽蓝之梦",
			gw_guaiwuchaoxue: "怪物巢穴",
			gw_guaiwuchaoxue_info:
				"出牌阶段限用一次，随机获得一个卖血技能直到下一回合开始；令一名随机敌方角色对你造成1点伤害，然后你回复1点体力。",
			gw_baobaoshu: "雹暴术",
			gw_baobaoshu_info:
				"天气牌，出牌阶段对至多两名角色使用，目标每使用一张基本牌或锦囊牌，需弃置一张牌，直到下一回合结束。",
			gw_baishuang: "白霜",
			gw_baishuang_info: "天气牌，出牌阶段对至多三名角色使用，目标下个摸牌阶段摸牌数-1。",
			gw_nuhaifengbao: "怒海风暴",
			gw_nuhaifengbao_bg: "海",
			gw_nuhaifengbao_info: "天气牌，出牌阶段对一名角色使用，目标在结束阶段随机弃置一张牌，持续2回合。",
			gw_ganhan: "干旱",
			gw_ganhan_info: "所有角色减少1点体力上限（不触发技能），然后结束出牌阶段。",
			gw_huangjiashenpan: "皇家审判",
			gw_huangjiashenpan_info: "获得任意一张金卡法术（皇家审判除外），然后结束出牌阶段。",
			gw_chongci: "冲刺",
			gw_chongci_info:
				"弃置所有牌并随机获得一张非金法术牌，每弃置一张手牌，便随机获得一张类别相同的牌；每弃置一张装备区内的牌，随机装备一件类别相同的装备；获得潜行直到下一回合开始，然后结束出牌阶段。",
			gw_tunshi: "吞噬",
			gw_tunshi_info:
				"随机移除一名敌方角色的一个随机技能，你获得此技能并减少1点体力和体力上限，被移除技能的角色增加1点体力和体力上限，然后结束出牌阶段。",
			gw_dieyi: "蝶翼",
			gw_dieyi_equip1: "蝶翼·器",
			gw_dieyi_equip2: "蝶翼·衣",
			gw_dieyi_equip3: "蝶翼·攻",
			gw_dieyi_equip4: "蝶翼·防",
			gw_dieyi_equip5: "蝶翼·宝",
			gw_dieyi_judge: "蝶翼·判",
			gw_dieyi_equip1_info:
				"在你从装备区中失去此牌后，你获得一枚“蝶翼”标记；在任意角色的结束阶段，你移去所有“蝶翼”标记，并随机弃置等量的牌。",
			gw_dieyi_equip2_info:
				"在你从装备区中失去此牌后，你获得一枚“蝶翼”标记；在任意角色的结束阶段，你移去所有“蝶翼”标记，并随机弃置等量的牌。",
			gw_dieyi_equip3_info:
				"在你从装备区中失去此牌后，你获得一枚“蝶翼”标记；在任意角色的结束阶段，你移去所有“蝶翼”标记，并随机弃置等量的牌。",
			gw_dieyi_equip4_info:
				"在你从装备区中失去此牌后，你获得一枚“蝶翼”标记；在任意角色的结束阶段，你移去所有“蝶翼”标记，并随机弃置等量的牌。",
			gw_dieyi_equip5_info:
				"在你从装备区中失去此牌后，你获得一枚“蝶翼”标记；在任意角色的结束阶段，你移去所有“蝶翼”标记，并随机弃置等量的牌。",
			gw_dieyi_judge_info:
				"你在判定阶段移去此牌，并获得一枚“蝶翼”标记；在任意角色的结束阶段，你移去所有“蝶翼”标记，并随机弃置等量的牌。",
			gw_hudiewu: "蝴蝶舞",
			gw_hudiewu_info:
				"将其他角色在场上的所有牌替换为蝶翼（每当你失去一张蝶翼，你获得一枚“蝶翼”标记；在任意角色的结束阶段，你移去所有“蝶翼”标记，并随机弃置等量的牌），然后结束出牌阶段。",
			gw_yigeniyin: "伊格尼印",
			gw_yigeniyin_info:
				"对敌方角色中体力值最高的一名随机角色造成1点火焰伤害，然后对场上体力值最高的所有角色各造成1点火焰伤害，然后结束出牌阶段。",
			gw_leizhoushu: "雷咒术",
			gw_leizhoushu_info:
				"获得技能雷咒术（在每个准备阶段令全场牌数最多的所有其他角色各随机弃置一张牌，若目标不包含敌方角色，将一名随机敌方角色追加为额外目标，结算X次，X为本局获得此技能的次数），然后结束出牌阶段。",
			gw_aerdeyin: "阿尔德印",
			gw_aerdeyin_bg: "印",
			gw_aerdeyin_info:
				"对一名随机敌方角色造成1点伤害，若目标武将牌正面朝上，则将其翻面；新的一轮开始时，若目标武将牌正面朝上，则在当前回合结束后进行一个额外回合，否则将武将牌翻回正面。",
			gw_xinsheng: "新生",
			gw_xinsheng_info:
				"选择一名角色，随机观看12张武将牌，选择一张替代其武将牌，并令其增加1点体力，然后结束出牌阶段。",
			gw_zhongmozhizhan: "终末之战",
			gw_zhongmozhizhan_info: "将所有角色区域内的所有牌置入弃牌堆（不触发技能），然后结束出牌阶段。",
			gw_butianshu: "卜天术",
			gw_butianshu_info: "出牌阶段对任意角色使用，将任意一张延时锦囊牌置入其判定区。",
			gw_zhihuanjun: "致幻菌",
			gw_zhihuanjun_info:
				"出牌阶段对一名已受伤角色使用，令其减少1点体力上限；若该角色仍处于受伤状态且手牌数小于体力上限，则重复此结算。",
			gw_niuquzhijing: "纽曲之镜",
			gw_niuquzhijing_info:
				"令全场体力最多的角色减少1点体力和体力上限，体力最少的角色增加1点体力和体力上限（不触发技能），然后结束出牌阶段。",
			gw_ansha: "暗杀",
			gw_ansha_info: "令一名体力为1的随机敌方角立即死亡，然后结束出牌阶段。",
			gw_shizizhaohuan: "十字召唤",
			gw_shizizhaohuan_info: "从牌堆中获得一张杀以及决斗、火攻、火烧连营、南蛮入侵四张牌中的随机一张。",
			gw_zuihouyuanwang: "最后愿望",
			gw_zuihouyuanwang_info: "摸X张牌并弃置X张牌，X为存活角色数。",
			gw_zirankuizeng: "自然馈赠",
			gw_zirankuizeng_info: "选择任意一张铜卡法术使用。",
			gw_poxiao: "破晓",
			gw_poxiao_info:
				"选择一项：解除任意名角色的天气效果并移除其判定区内的牌，或随机获得一张铜卡法术（破晓除外）并展示之。",
			gw_zumoshoukao: "阻魔手铐",
			gw_zumoshoukao_info: "令一名角色非锁定技失效直到下一回合结束。",
			gw_aozuzhilei: "奥祖之雷",
			gw_aozuzhilei_info: "对一名体力值不小于你的角色造成1点雷属性伤害，然后该角色摸一张牌。",
			gw_zhuoshao: "灼烧",
			gw_zhuoshao_info: "对任意名体力值为全场最高的角色使用，造成1点火属性伤害。",
			gw_fuyuan: "复原",
			gw_fuyuan_info: "对一名濒死状态角色使用，目标回复1点体力并摸一张牌。",
			gw_youer: "诱饵",
			gw_youer_bg: "饵",
			gw_youer_info:
				"将一名其他角色的所有手牌移出游戏，然后摸一张牌，当前回合结束后该角色将以此法失去的牌收回手牌。",
			gw_tongdi: "通敌",
			gw_tongdi_info: "观看一名其他角色的手牌并获得其中一张，然后令目标获得一张杀。",
			gw_baoxueyaoshui: "暴雪药水",
			gw_baoxueyaoshui_info: "令一名角色弃置两张手牌并摸一张牌。",
			gw_birinongwu: "蔽日浓雾",
			gw_birinongwu_bg: "雾",
			gw_birinongwu_info:
				"天气牌，出牌阶段对一名角色及其相邻角色使用，目标不能使用杀直到下一个出牌阶段结束。",
			gw_qinpendayu: "倾盆大雨",
			gw_qinpendayu_bg: "雨",
			gw_qinpendayu_info:
				"天气牌，出牌阶段对一名角色及其相邻角色使用，目标手牌上限-1直到下一个弃牌阶段结束。",
			gw_ciguhanshuang: "刺骨寒霜",
			gw_ciguhanshuang_bg: "霜",
			gw_ciguhanshuang_info: "天气牌，出牌阶段对一名角色及其相邻角色使用，目标下个摸牌阶段摸牌数-1。",
			gw_wenyi: "瘟疫",
			gw_wenyi_info: "令所有体力值为全场最少的角色随机弃置一张手牌；若没有手牌，改为失去1点体力。",
			gw_yanziyaoshui: "燕子药水",
			gw_yanziyaoshui_info: "令一名角色摸一张牌，若其手牌数为全场最少或之一，改为摸两张。",
			gw_shanbengshu: "山崩术",
			gw_shanbengshu_info: "出牌阶段对自己使用，随机弃置两件敌方角色场上的装备。",
			gw_kunenfayin: "昆恩法印",
			gw_kunenfayin_info:
				"出牌阶段对一名角色使用，目标防止所有非属性伤害，持续X个角色的回合（X为存活角色数且最多为5）。",
		},
		cardType: {
			spell: 0.5,
			spell_bronze: 0.2,
			spell_silver: 0.3,
			spell_gold: 0.4,
		},
		list: [
			["club", 3, "gw_zhihuanjun"],
			["spade", 2, "gw_zhihuanjun"],

			["heart", 7, "gw_poxiao"],
			["diamond", 4, "gw_poxiao"],

			["spade", 9, "gw_aozuzhilei", "thunder"],
			["club", 7, "gw_aozuzhilei", "thunder"],

			["club", 1, "gw_zumoshoukao"],
			["spade", 1, "gw_zumoshoukao"],

			["diamond", 5, "gw_qinpendayu"],
			["club", 7, "gw_qinpendayu"],

			["spade", 9, "gw_birinongwu"],
			["heart", 13, "gw_birinongwu"],

			["diamond", 11, "gw_ciguhanshuang"],
			["club", 7, "gw_ciguhanshuang"],

			["heart", 4, "gw_baoxueyaoshui"],
			["spade", 8, "gw_baoxueyaoshui"],

			["spade", 8, "gw_shanbengshu"],
			["spade", 2, "gw_kunenfayin"],
			["club", 3, "gw_wenyi"],
			["heart", 8, "gw_yanziyaoshui"],
		],
	};
});
