import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const card = {
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
		onLose() {
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
		onLose() {
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
		onLose() {
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
		onLose() {
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
		onLose() {
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
		effect() {
			lib.skill.gw_dieyi.process(player);
		},
	},
	gw_hudiewu: {
		fullborder: "gold",
		type: "spell",
		subtype: "spell_gold",
		vanish: true,
		enable(card, player) {
			return game.hasPlayer(function (current) {
				return current !== player && current.countCards("ej");
			});
		},
		notarget: true,
		contentBefore() {
			player.$skill("蝴蝶舞", "legend", "metal");
			game.delay(2);
		},
		content() {
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
					ej[i].init([ej[i].suit, ej[i].number, "gw_dieyi_" + (get.subtype(ej[i]) || "judge")]);
				}
				event.redo();
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 6,
			useful: [6, 1],
			result: {
				player(player) {
					return game.countPlayer(function (current) {
						if (current === player) {
							return;
						}
						return -(current.countCards("e") - current.countCards("j") / 3) * get.sgn(get.attitude(player, current));
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
		contentBefore() {
			player.$skill("伊格尼印", "legend", "metal");
			game.delay(2);
		},
		content() {
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
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 8,
			useful: [6, 1],
			result: {
				player(player) {
					var enemies = player.getEnemies();
					var players = game.filterPlayer();
					var func = function (current) {
						if (current) {
							return current.hp;
						}
						return 0;
					};
					var max1 = get.max(enemies, func);
					for (var i = 0; i < players.length; i++) {
						if (players[i].hp === max1) {
							players.splice(i, 1);
							break;
						}
					}
					var max2 = get.max(players, func);
					if (max1 - 1 > max2) {
						return get.damageEffect(get.max(enemies, func, "item"), player, player, "fire");
					} else {
						var num;
						if (max1 > max2) {
							num = get.sgn(get.damageEffect(get.max(enemies, func, "item"), player, player, "fire"));
						} else if (max1 === max2) {
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
		contentBefore() {
			player.$skill("雷咒术", "legend", "metal");
			game.delay(2);
		},
		content() {
			if (player.hasSkill("gw_leizhoushu")) {
				if (typeof player.storage.gw_leizhoushu !== "number") {
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
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 8,
			useful: [6, 1],
			result: {
				player(player) {
					return (
						1 +
						game.countPlayer(function (current) {
							if (current !== player && current.isMaxHandcard()) {
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
		enable(card, player) {
			var enemies = player.getEnemies();
			return enemies.length > 0;
		},
		notarget: true,
		contentBefore() {
			player.$skill("阿尔德印", "legend", "metal");
			game.delay(2);
		},
		content() {
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
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 8,
			useful: [6, 1],
			result: {
				player(player) {
					return game.countPlayer(function (current) {
						if (get.distance(player, current, "pure") === 1) {
							var att = get.sgn(get.attitude(player, current));
							if (current === player.next) {
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
		enable(card, player) {
			var enemies = player.getEnemies();
			return game.hasPlayer(function (current) {
				return current.hp === 1 && enemies.includes(current);
			});
		},
		notarget: true,
		contentBefore() {
			player.$skill("暗杀", "legend", "metal");
			game.delay(2);
		},
		content() {
			var enemies = player.getEnemies();
			var list = game.filterPlayer(function (current) {
				return current.hp === 1 && enemies.includes(current);
			});
			if (list.length) {
				var target = list.randomGet();
				player.line(target);
				target.die();
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
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
		enable(card, player) {
			return game.hasPlayer(function (current) {
				return !current.isUnseen();
			});
		},
		notarget: true,
		contentBefore() {
			player.$skill("新生", "legend", "metal");
			game.delay(2);
		},
		content() {
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
							if (att > 0) {
								return att * 3 + 2;
							}
							return att * 3;
						} else if (current.hp === 2) {
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
			player.chooseTarget(true, "使用" + get.translation(event.nametarget) + "替换一名角色的武将牌", function (card, player, target) {
				return !target.isUnseen() && !target.isMin();
			}).ai = function (target) {
				if (target === event.aitarget) {
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
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
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
		enable(card, player) {
			return game.hasPlayer(function (current) {
				return current.hp !== player.hp;
			});
		},
		notarget: true,
		contentBefore() {
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
		content() {
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
			if (max !== min && max !== null && min !== null) {
				for (var i = 0; i < targets.length; i++) {
					if (targets[i].hp === max) {
						targets[i].hp--;
						targets[i].maxHp--;
						targets[i].$damagepop(-1);
					} else if (targets[i].hp === min) {
						targets[i].hp++;
						targets[i].maxHp++;
						targets[i].$damagepop(1, "wood");
					}
					targets[i].update();
				}
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 8,
			useful: [6, 1],
			result: {
				player(player, target) {
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
		contentBefore() {
			player.line(game.filterPlayer());
			player.$skill("终末之战", "legend", "metal");
			game.delay(2);
		},
		content() {
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
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 8,
			useful: [6, 1],
			result: {
				player(player, target) {
					if (player.hasUnknown()) {
						return 0;
					}
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
		contentBefore() {
			player.line(game.filterPlayer());
			player.$skill("干旱", "legend", "metal");
			game.delay(2);
		},
		content() {
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
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 7,
			useful: [5, 1],
			result: {
				player(player, target) {
					if (player.hasUnknown()) {
						return 0;
					}
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
						} else if (current.maxHp - current.hp === 1) {
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
		contentBefore() {
			player.$skill("皇家审判", "legend", "metal");
			game.delay(2);
		},
		content() {
			"step 0";
			var list = get.libCard(function (info) {
				return info.subtype === "spell_gold";
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
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
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
		enable(event, player) {
			if (player.maxHp === 1) {
				return false;
			}
			var list = player.getEnemies();
			for (var i = 0; i < list.length; i++) {
				if (list[i].isMin()) {
					continue;
				}
				if (list[i].getStockSkills().length) {
					return true;
				}
			}
		},
		notarget: true,
		contentBefore() {
			player.$skill("吞噬", "legend", "metal");
			game.delay(2);
		},
		content() {
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
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 8,
			useful: [6, 1],
			result: {
				player(player) {
					if (player.hp <= 2) {
						return 0;
					}
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
		contentBefore() {
			player.$skill("冲刺", "legend", "metal");
			game.delay(2);
		},
		content() {
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
					if (cardname === name) {
						return;
					}
					if (get.type({ name: name }, "trick") === type) {
						return true;
					}
				});
				if (!list.length) {
					list = [cardname];
				}
				hs2.push(game.createCard(list.randomGet()));
			}
			var list = get.libCard(function (info) {
				return info.type === "spell" && info.subtype !== "spell_gold";
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
					if (cardname === name) {
						return;
					}
					if (get.subtype({ name: name }) === subtype) {
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
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
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
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h") > 0;
		},
		content() {
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
				target(player, target) {
					if (target.hasSkillTag("noh")) {
						return 3;
					}
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
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h");
		},
		content() {
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
				target(player, target) {
					if (target.getEquip(4)) {
						return -2;
					}
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
		content() {
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
		filterTarget(card, player, target) {
			return target.isMaxHp();
		},
		cardnature: "fire",
		selectTarget: [1, Infinity],
		content() {
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
		async content(event, trigger, player) {
			var list = [];
			for (var i in lib.card) {
				if (!lib.card[i].content) {
					continue;
				}
				if (lib.card[i].mode && lib.card[i].mode.includes(lib.config.mode) === false) {
					continue;
				}
				if (lib.card[i].vanish) {
					continue;
				}
				if (lib.card[i].type === "delay") {
					list.push([event.card.suit, event.card.number, i]);
				}
			}
			if (list.length) {
				var dialog = ui.create.dialog("卜天术", [list, "vcard"]);
				var bing = event.target.countCards("h") <= 1;
				const { result } = await player
					.chooseButton(dialog, true, function (button) {
						if (get.effect(event.target, { name: button.link[2] }, player, player) > 0) {
							if (button.link[2] === "bingliang") {
								if (bing) {
									return 2;
								}
								return 0.7;
							}
							if (button.link[2] === "lebu") {
								return 1;
							}
							if (button.link[2] === "guiyoujie") {
								return 0.5;
							}
							if (button.link[2] === "caomu") {
								return 0.3;
							}
							return 0.2;
						}
						return 0;
					})
					.set("filterButton", function (button) {
						return !event.target.hasJudge(button.link[2]);
					});
				if (result.links && result.links[0]) {
					var card = game.createCard(result.links[0][2]);
					event.judgecard = card;
					event.target.$draw(card);
					event.target.addJudge(event.judgecard);
				}
			}
		},
		ai: {
			value: 8,
			useful: [5, 1],
			result: {
				player(player, target) {
					var eff = 0;
					for (var i in lib.card) {
						if (lib.card[i].type === "delay") {
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
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		// contentBefore:function(){
		// 	player.$skill('十字召唤','legend','water');
		// 	game.delay(2);
		// },
		content() {
			var list = [];
			list.push(get.cardPile2("juedou"));
			list.push(get.cardPile2("huogong"));
			list.push(get.cardPile2("nanman"));
			list.push(get.cardPile2("huoshaolianying"));
			for (var i = 0; i < list.length; i++) {
				if (!list[i]) {
					list.splice(i--, 1);
				}
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
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		// contentBefore:function(){
		// 	player.$skill('最后愿望','legend','water');
		// 	game.delay(2);
		// },
		content() {
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
				player(player) {
					var num = player.countCards("he");
					if (num <= 1) {
						return 0;
					}
					if (num <= 3 && !player.needsToDiscard()) {
						return 0;
					}
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
		async content(event, trigger, player) {
			var list = [];
			for (var i in lib.card) {
				if (lib.card[i].subtype === "spell_bronze") {
					list.push([event.card.suit, event.card.number, i]);
				} //QQQ
			}
			var dialog = ui.create.dialog("自然馈赠", [list, "vcard"]);
			var aozu = game.hasPlayer(function (current) {
				return player.canUse("gw_aozuzhilei", current, true, true) && current.hp <= 3 && get.effect(current, { name: "gw_aozuzhilei" }, player, player) > 0;
			});
			var aozu2 = game.hasPlayer(function (current) {
				return player.canUse("gw_aozuzhilei", current, true, true) && current.hp <= 2 && get.effect(current, { name: "gw_aozuzhilei" }, player, player) > 0;
			});
			var aozu3 = game.hasPlayer(function (current) {
				return player.canUse("gw_aozuzhilei", current, true, true) && get.effect(current, { name: "gw_aozuzhilei" }, player, player) > 0;
			});
			var baoxue = game.hasPlayer(function (current) {
				return player.canUse("gw_baoxueyaoshui", current, true, true) && get.attitude(player, current) < 0 && [2, 3].includes(current.countCards("h")) && !current.hasSkillTag("noh");
			});
			var baoxue2 = game.hasPlayer(function (current) {
				return player.canUse("gw_baoxueyaoshui", current, true, true) && get.attitude(player, current) < 0 && [2].includes(current.countCards("h")) && !current.hasSkillTag("noh");
			});
			var baoxue3 = game.hasPlayer(function (current) {
				return player.canUse("gw_baoxueyaoshui", current, true, true) && get.attitude(player, current) < 0 && current.countCards("h") >= 2 && !current.hasSkillTag("noh");
			});
			var nongwu = game.hasPlayer(function (current) {
				return get.attitude(player, current) < 0 && (!current.getNext() || get.attitude(player, current.getNext()) < 0) && (!current.getPrevious() || get.attitude(player, current.getPrevious()) < 0);
			});
			var nongwu2 = game.hasPlayer(function (current) {
				return get.attitude(player, current) < 0 && (!current.getNext() || get.attitude(player, current.getNext()) < 0) && (!current.getPrevious() || get.attitude(player, current.getPrevious()) < 0);
			});
			var yanzi = game.hasPlayer(function (current) {
				return get.attitude(player, current) > 0 && current.isMinHandcard();
			});
			const {
				result: { links },
			} = await player
				.chooseButton(dialog, true, function (button) {
					var player = _status.event.player; //QQQ
					var name = button.link[2];
					switch (name) {
						case "gw_ciguhanshuang":
							if (nongwu2) {
								return 3;
							}
							if (nongwu) {
								return 1;
							}
							return 0;
						case "gw_baoxueyaoshui":
							if (baoxue2) {
								return 2;
							}
							if (baoxue) {
								return 1.5;
							}
							if (baoxue3) {
								return 0.5;
							}
							return 0;
						case "gw_aozuzhilei":
							if (aozu2) {
								return 2.5;
							}
							if (aozu) {
								return 1.2;
							}
							if (aozu3) {
								return 0.2;
							}
							return 0;
						case "gw_yanziyaoshui":
							if (yanzi) {
								return 2;
							}
							return 0.6;
					}
					if (
						game.hasPlayer(function (current) {
							return player.canUse(name, current, true, true) && get.effect(current, { name: name }, player, player) > 0;
						})
					) {
						return Math.random();
					}
					return 0;
				})
				.set("filterButton", function (button) {
					var name = button.link[2];
					if (!lib.card[name].notarget) {
						return game.hasPlayer(function (current) {
							return player.canUse(name, current, true, true);
						});
					}
					return true;
				});
			if (links && links[0]) {
				player.chooseUseTarget(true, game.createCard(links[0][2], event.card.suit, event.card.number));
			}
		},
		ai: {
			value: 7,
			useful: [4, 1],
			result: {
				player(player) {
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
		filterTarget(card, player, target) {
			return !target.hasSkill("gw_nuhaifengbao");
		},
		content() {
			target.addSkill("gw_nuhaifengbao");
		},
		ai: {
			value: [7, 1],
			useful: [4, 1],
			result: {
				target(player, target) {
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
		filterTarget(card, player, target) {
			return !target.hasSkill("gw_ciguhanshuang");
		},
		selectTarget: [1, 3],
		content() {
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
		filterTarget(card, player, target) {
			return !target.hasSkill("gw_baobaoshu");
		},
		selectTarget: [1, 2],
		content() {
			target.addTempSkill("gw_baobaoshu", { player: "phaseAfter" });
		},
		ai: {
			value: [7.5, 1],
			useful: [5, 1],
			result: {
				target(player, target) {
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
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		content() {
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
				target(player, target) {
					if (target.hp <= 1 || target.hujia) {
						return 0;
					}
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
		filterTarget(card, player, target) {
			return !target.hasSkill("gw_qinpendayu");
		},
		changeTarget(player, targets) {
			game.filterPlayer(function (current) {
				return get.distance(targets[0], current, "pure") === 1;
			}, targets);
		},
		content() {
			target.addSkill("gw_qinpendayu");
		},
		ai: {
			value: [5, 1],
			useful: [3, 1],
			result: {
				target(player, current) {
					if (current.hasSkill("gw_qinpendayu")) {
						return 0;
					}
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
		filterTarget(card, player, target) {
			return !target.hasSkill("gw_birinongwu");
		},
		changeTarget(player, targets) {
			game.filterPlayer(function (current) {
				return get.distance(targets[0], current, "pure") === 1;
			}, targets);
		},
		content() {
			target.addSkill("gw_birinongwu");
		},
		ai: {
			value: [5, 1],
			useful: [3, 1],
			result: {
				player(player, current) {
					if (current.hasSkill("gw_birinongwu")) {
						return 0;
					}
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
		filterTarget(card, player, target) {
			return !target.hasSkill("gw_ciguhanshuang");
		},
		changeTarget(player, targets) {
			game.filterPlayer(function (current) {
				return get.distance(targets[0], current, "pure") === 1;
			}, targets);
		},
		content() {
			target.addSkill("gw_ciguhanshuang");
		},
		ai: {
			value: [5, 1],
			useful: [3, 1],
			result: {
				target(player, target) {
					if (target.hasSkill("gw_ciguhanshuang")) {
						return 0;
					}
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
		content() {
			"step 0";
			target.chooseToDiscard("h", 2, true).delay = false;
			"step 1";
			target.draw();
		},
		ai: {
			value: 6,
			useful: [3, 1],
			result: {
				target(player, target) {
					if (target.hasSkillTag("noh")) {
						return 0.1;
					}
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
		filterTarget(card, player, target) {
			return target.isDamaged();
		},
		content() {
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
				target(player, target) {
					if (target.maxHp - target.hp === 1) {
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
		filterTarget(card, player, target) {
			return target.hujia || !target.hasSkill("fengyin");
		},
		content() {
			target.addTempSkill("fengyin", { player: "phaseAfter" });
			// if(target.hujia){
			// 	target.changeHujia(-1);
			// }
		},
		ai: {
			value: [4.5, 1],
			useful: [4, 1],
			result: {
				target(player, target) {
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
		filterTarget(card, player, target) {
			return target.hp >= player.hp;
		},
		content() {
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
		content() {
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
					.set("choiceList", ["解除任意名角色的天气效果并移除其判定区内的牌", "随机获得一张铜卡法术（破晓除外）并展示之"]);
			} else {
				event.directfalse = true;
			}
			"step 1";
			if (!event.directfalse && result.index === 0) {
				player.chooseTarget(true, [1, Infinity], "解除任意名角色的天气效果并移除其判定区内的牌", function (card, player, target) {
					return target.countCards("j") || target.hasSkillTag("weather");
				}).ai = function (target) {
					return get.attitude(player, target);
				};
			} else {
				var list = get.libCard(function (info, name) {
					return name !== "gw_poxiao" && info.subtype === "spell_bronze";
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
							game.log(target, "解除了", "【" + get.translation(skills[i]) + "】", "的效果");
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
		filterTarget(card, player, target) {
			return !target.hasSkill("gw_kunenfayin");
		},
		content() {
			target.addSkill("gw_kunenfayin");
		},
		ai: {
			basic: {
				order: 2,
				value: [5, 1],
				useful: [4, 1],
			},
			result: {
				target(player, target) {
					if (target === player) {
						return get.threaten(target, player) / 1.5;
					}
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
		content() {
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
				target(player, target) {
					if (target.isMinHandcard()) {
						return 2;
					}
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
		filterTarget(card, player, target) {
			return target.isMinHp();
		},
		selectTarget: -1,
		content() {
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
				target(player, target) {
					if (target.countCards("h")) {
						return -1;
					}
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
		enable(event, player) {
			var list = player.getEnemies();
			for (var i = 0; i < list.length; i++) {
				if (list[i].countCards("e")) {
					return true;
				}
			}
			return false;
		},
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		content() {
			var list = target.getEnemies();
			var equips = [];
			for (var i = 0; i < list.length; i++) {
				equips.addArray(list[i].getCards("e"));
			}
			equips = equips.randomGets(2);
			if (equips.length === 2) {
				var target1 = get.owner(equips[0]);
				var target2 = get.owner(equips[1]);
				if (target1 === target2) {
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
};

for (let i in card) {
	if (!card[i].cardimage) {
		if (card[i].fullskin) {
			card[i].image = "ext:杀海拾遗/image/card/" + i + ".png";
		} else {
			card[i].image = "ext:杀海拾遗/image/card/" + i + ".jpg";
		}
	}
}

export default card;
