import { lib, game, ui, get, ai, _status } from "../../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skill = {
	yxs_fanji: {
		trigger: {
			player: "damageEnd",
		},
		direct: true,
		clearTime: true,
		priority: 12,
		filter(event, player) {
			if (!player.countCards("h", { name: "sha" })) {
				return false;
			}
			return event.card && (event.card.name === "sha" || event.card.name === "juedou");
		},
		content() {
			player.addTempSkill("yxs_fanji2", "shaAfter");
			player.chooseToUse({ name: "sha" }, trigger.source, "反击：是否对" + get.translation(trigger.source) + "使用一张杀？").logSkill = "yxs_fanji";
		},
	},
	yxs_fanji2: {
		trigger: {
			player: "shaBegin",
		},
		direct: true,
		filter(event, player) {
			return event.card && event.card.name === "sha" && get.color(event.card) === "red";
		},
		content() {
			trigger.directHit = true;
		},
	},
	yxs_menshen3: {
		trigger: {
			player: ["phaseBegin", "dieBegin"],
		},
		silent: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.hasSkill("yxs_menshen2");
			});
		},
		content() {
			for (var i = 0; i < game.players.length; i++) {
				if (game.players[i].hasSkill("yxs_menshen2")) {
					game.players[i].removeSkill("yxs_menshen2");
				}
			}
		},
	},
	yxs_menshen: {
		trigger: {
			player: "phaseEnd",
		},
		priority: 15,
		group: "yxs_menshen3",
		onremove: true,
		filter(event, player) {
			return game.players.length > 1;
		},
		content() {
			"step 0";
			player
				.chooseTarget("选择【门神】的目标", lib.translate.yxs_menshen_info, true, function (card, player, target) {
					return target !== player;
				})
				.set("ai", function (target) {
					return get.attitude(player, target);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				game.log(target, "成为了", "【门神】", "的目标");
				target.storage.yxs_menshen2 = player;
				target.addSkill("yxs_menshen2");
			} else {
				event.finish();
			}
		},
		ai: {
			expose: 0.5,
		},
	},
	yxs_menshen2: {
		mark: "character",
		intro: {
			content: "当你成为【杀】或【决斗】的目标后，改为$成为目标",
		},
		nopop: true,
		priority: 15,
		trigger: {
			target: ["shaBegin", "juedouBegin"],
		},
		forced: true,
		popup: false,
		filter(event, player) {
			return player.isAlive();
		},
		content() {
			var target = player.storage.yxs_menshen2;
			trigger.player.line(target, "green");
			trigger.targets.remove(player);
			trigger.targets.push(target);
			trigger.target = target;
		},
	},
	guimian: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.card && event.card.name === "sha" && _status.currentPhase === player;
		},
		content() {
			player.getStat().card.sha--;
		},
	},
	lyuxue: {
		trigger: { source: "damageEnd" },
		forced: true,
		logTarget: "player",
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.player.isIn() && !event.player.hasSkill("lyuxue2");
		},
		content() {
			trigger.player.addSkill("lyuxue2");
		},
		subSkill: {
			clear: {
				trigger: { player: ["phaseBegin", "dieBegin"] },
				forced: true,
				filter(event, player) {
					var num = game.countPlayer(function (current) {
						return current.hasSkill("lyuxue2");
					});
					if (!num) {
						return false;
					}
					if (event.name === "die") {
						return true;
					}
					return num >= Math.floor(game.countPlayer() / 2);
				},
				content() {
					"step 0";
					var list = game.filterPlayer(function (current) {
						return current.hasSkill("lyuxue2");
					});
					list.sortBySeat();
					event.list = list;
					player.line(list, "green");
					"step 1";
					if (event.list.length) {
						event.list.shift().removeSkill("lyuxue2");
						event.redo();
					}
				},
			},
		},
		group: "lyuxue_clear",
	},
	lyuxue2: {
		mark: true,
		intro: {
			content: "已获得浴血标记",
		},
		onremove(player) {
			player.loseHp();
		},
	},
	yaoji: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source && event.source.isIn() && event.source !== player && !event.source.hasJudge("lebu");
		},
		check(event, player) {
			return get.attitude(player, event.source) <= 0;
		},
		logTarget: "source",
		content() {
			var card = game.createCard("lebu");
			trigger.source.addJudge(card);
			trigger.source.$draw(card);
			game.delay();
		},
		ai: {
			maixie_defend: true,
		},
	},
	liebo: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return Math.abs(target.countCards("h") - player.countCards("h")) <= 1;
		},
		content() {
			player.swapHandcards(target);
		},
		ai: {
			order() {
				var player = _status.event.player;
				if (
					player.hasCard(function (card) {
						return get.value(card) >= 8;
					})
				) {
					return 0;
				}
				var nh = player.countCards("h");
				if (
					game.hasPlayer(function (current) {
						return get.attitude(player, current) <= 0 && current.countCards("h") === nh + 1;
					})
				) {
					return 9;
				}
				return 1;
			},
			result: {
				player(player, target) {
					var att = get.attitude(player, target);
					if (att > 0) {
						return 0;
					}
					if (
						player.hasCard(function (card) {
							return get.value(card) >= 8;
						})
					) {
						return 0;
					}
					var n1 = target.countCards("h"),
						n2 = player.countCards("h");
					var num = 0;
					if (n1 - n2 === 1) {
						num = 1;
					}
					if (player.countCards("h", "du")) {
						if (n1 === n2) {
							num = 0.5;
						} else {
							num = 0.1;
						}
					}
					if (att === 0) {
						num /= 2;
					}
					return num;
				},
			},
		},
	},
	zhuxin: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h");
		},
		filter(event, player) {
			return player.countCards("h");
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				target.damage();
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target);
				},
			},
		},
	},
	wlianhuan: {
		trigger: { source: "damageBegin" },
		filter(event, player) {
			return event.card && event.card.name === "sha" && player.countCards("e");
		},
		direct: true,
		content() {
			"step 0";
			var next = player.chooseToDiscard("e", get.prompt("wlianhuan", trigger.player), "弃置一张装备区内的牌使伤害+1");
			next.ai = function (card) {
				if (get.attitude(player, trigger.player) < 0) {
					return 7 - get.value(card);
				}
				return 0;
			};
			next.logSkill = ["wlianhuan", trigger.player];
			"step 1";
			if (result.bool) {
				trigger.num++;
			}
		},
	},
	huli: {
		enable: "phaseUse",
		filterCard: { suit: "heart" },
		filterTarget(card, player, target) {
			return get.distance(player, target) <= 1 && lib.filter.cardEnabled({ name: "tao" }, target, target);
		},
		check(card) {
			return 8 - get.value(card);
		},
		discard: false,
		lose: false,
		filter(event, player) {
			if (player.countCards("h", { suit: "heart" })) {
				return true;
			}
			return false;
		},
		prepare: "throw",
		content() {
			player.useCard({ name: "tao" }, cards, targets[0]).animate = false;
		},
		ai: {
			order: 9.5,
			result: {
				target(player, target) {
					return get.recoverEffect(target, player, target);
				},
			},
			threaten: 1.6,
		},
	},
	yixin: {
		limited: true,
		skillAnimation: true,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he") > 2;
		},
		filterTarget(card, player, target) {
			return target.isDamaged();
		},
		filterCard: true,
		position: "he",
		selectCard: 2,
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			player.awakenSkill(event.name);
			var num = Math.min(4, target.maxHp - target.hp);
			target.recover(num);
			if (num < 4) {
				target.draw(4 - num);
			}
		},
		ai: {
			order: 9.6,
			result: {
				target(player, target) {
					if (target.hp === 1 && target.maxHp >= 3) {
						return get.recoverEffect(target, player, target);
					}
					return 0;
				},
			},
		},
	},
	xianqu: {
		mod: {
			targetEnabled(card) {
				if (card.name === "sha" && card.number < 8) {
					return false;
				}
			},
		},
	},
	zbudao: {
		trigger: { player: "phaseDrawBegin" },
		content() {
			trigger.num++;
			player.addTempSkill("zbudao2", "phaseDrawAfter");
		},
		ai: {
			threaten: 1.3,
		},
	},
	zbudao2: {
		trigger: { player: "phaseDrawEnd" },
		forced: true,
		popup: false,
		filter(event) {
			return event.cards && event.cards.length;
		},
		content() {
			"step 0";
			event.cards = trigger.cards.slice(0);
			player.chooseCardTarget({
				filterCard(card) {
					return _status.event.getParent().cards.includes(card);
				},
				selectCard: 1,
				filterTarget(card, player, target) {
					return player !== target;
				},
				ai1(card) {
					if (ui.selected.cards.length > 0) {
						return -1;
					}
					if (card.name === "du") {
						return 20;
					}
					return _status.event.player.countCards("h") - _status.event.player.hp;
				},
				ai2(target) {
					var att = get.attitude(_status.event.player, target);
					if (ui.selected.cards.length && ui.selected.cards[0].name === "du") {
						return 1 - att;
					}
					return att - 4;
				},
				prompt: "将得到的一张牌交给一名其他角色，或点取消",
			});
			"step 1";
			if (result.bool) {
				player.line(result.targets, "green");
				result.targets[0].gain(result.cards, player);
				player.$give(result.cards.length, result.targets[0]);
				game.delay(0.7);
			}
		},
	},
	taiji: {
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			return event.card.name === "shan" && player.hasSha();
		},
		direct: true,
		clearTime: true,
		content() {
			player.chooseToUse({ name: "sha" }, "太极：是否使用一张杀？").logSkill = "taiji";
		},
	},
	fengliu: {
		trigger: { player: "phaseDrawBegin" },
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.sex === "female";
			});
		},
		forced: true,
		content() {
			var num = game.countPlayer(function (current) {
				return current.sex === "female";
			});
			if (num > 2) {
				num = 2;
			}
			trigger.num += num;
		},
		ai: {
			threaten() {
				var num = game.countPlayer(function (current) {
					return current.sex === "female";
				});
				switch (num) {
					case 0:
						return 1;
					case 1:
						return 1.3;
					default:
						return 2;
				}
			},
		},
	},
	luobi: {
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			return player.isDamaged();
		},
		content() {
			"step 0";
			player.draw(player.maxHp - player.hp);
			"step 1";
			event.cards = result;
			"step 2";
			player.chooseCardTarget({
				filterCard(card) {
					return _status.event.getParent().cards.includes(card);
				},
				selectCard: [1, event.cards.length],
				filterTarget(card, player, target) {
					return player !== target;
				},
				ai1(card) {
					if (ui.selected.cards.length > 0) {
						return -1;
					}
					if (card.name === "du") {
						return 20;
					}
					return _status.event.player.countCards("h") - _status.event.player.hp;
				},
				ai2(target) {
					var att = get.attitude(_status.event.player, target);
					if (ui.selected.cards.length && ui.selected.cards[0].name === "du") {
						return 1 - att;
					}
					return att - 4;
				},
				prompt: "请选择要送人的卡牌",
			});
			"step 3";
			if (result.bool) {
				player.line(result.targets, "green");
				result.targets[0].gain(result.cards, player);
				player.$give(result.cards.length, result.targets[0]);
				for (var i = 0; i < result.cards.length; i++) {
					event.cards.remove(result.cards[i]);
				}
				if (event.cards.length) {
					event.goto(2);
				}
			}
		},
	},
	yaoyi: {
		trigger: { player: "damageEnd" },
		direct: true,
		filter(event, player) {
			if (event.num > 0) {
				return game.hasPlayer(function (current) {
					return current.group !== "qun" && current !== player;
				});
			}
			return false;
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("yaoyi"), [1, 2], function (card, player, target) {
					return target.countCards("h") && target.group !== "qun" && target !== player;
				})
				.set("ai", function (target) {
					return 0.5 - get.attitude(_status.event.player, target);
				});
			"step 1";
			if (result.bool) {
				player.logSkill("yaoyi", result.targets);
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets && event.targets.length) {
				event.target = event.targets.shift();
				event.target.chooseCard("交给" + get.translation(player) + "一张手牌", true).ai = function (card) {
					return -get.value(card);
				};
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool && result.cards && result.cards.length) {
				event.target.$give(1, player);
				player.gain(result.cards, event.target);
			}
			event.goto(2);
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			expose: 0.2,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i].group !== "qun" && get.attitude(player, players[i]) <= 0 && players[i] !== player) {
								if (target.hp >= 4) {
									return [1, get.tag(card, "damage") * 2];
								}
								if (target.hp === 3) {
									return [1, get.tag(card, "damage") * 1.5];
								}
								if (target.hp === 2) {
									return [1, get.tag(card, "damage") * 0.5];
								}
							}
						}
					}
				},
			},
		},
	},
	shiqin: {
		trigger: { global: "dying" },
		priority: 9,
		filter(event, player) {
			return event.player !== player && event.player.hp <= 0 && event.player.group === "qun";
		},
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		forced: true,
		logTarget: "player",
		content() {
			"step 0";
			game.delayx();
			trigger.player.die();
			"step 1";
			if (!trigger.player.isAlive()) {
				trigger.cancel(true);
			}
		},
	},
	zyhufu: {
		trigger: { player: "phaseDrawBegin" },
		filter(event, player) {
			return !player.getEquip(2);
		},
		forced: true,
		content() {
			trigger.num++;
		},
		ai: {
			threaten: 1.3,
		},
		mod: {
			maxHandcard(player, num) {
				if (player.getEquip(2)) {
					return num + 5;
				}
			},
		},
	},
	hanbei: {
		trigger: { player: "shaBegin" },
		forced: true,
		filter(event, player) {
			if (player.getEquip(3) || player.getEquip(4)) {
				return true;
			}
			return false;
		},
		content() {
			trigger.directHit = true;
		},
	},
	sheshu: {
		trigger: { player: "shaBegin" },
		forced: true,
		filter(event, player) {
			return event.target.hp >= 3;
		},
		content() {
			trigger.directHit = true;
		},
		mod: {
			targetInRange(card) {
				if (card.name === "sha") {
					return true;
				}
			},
		},
	},
	lguiyin: {
		unique: true,
		forceunique: true,
		enable: "phaseUse",
		filter(event, player) {
			return !player.hasSkill("tongyu_guiyin") && !player.getStat("damage") && [player.name1, player.name2].includes("yxs_luobinhan");
		},
		derivation: ["lzhangyi", "jimin", "tongyu"],
		content() {
			player.draw();
			player.setAvatar("yxs_luobinhan", "yxs_handingdun");
			player.removeSkill("lguiyin");
			player.removeSkill("sheshu");
			player.removeSkill("xiadao");
			player.addSkill("jimin");
			player.addSkill("lzhangyi");
			player.addSkill("tongyu");
			player.addTempSkill("tongyu_guiyin");
		},
		ai: {
			order() {
				if (_status.event.player.hp === 1) {
					return 9;
				}
				return 0.5;
			},
			result: {
				player(player) {
					if (player.hp < player.maxHp) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	tongyu: {
		unique: true,
		forceunique: true,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he") > 0 && !player.hasSkill("tongyu_guiyin") && [player.name1, player.name2].includes("yxs_luobinhan");
		},
		filterCard: true,
		position: "he",
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			player.setAvatar("yxs_luobinhan", "yxs_luobinhan");
			player.addSkill("lguiyin");
			player.addSkill("sheshu");
			player.addSkill("xiadao");
			player.removeSkill("jimin");
			player.removeSkill("lzhangyi");
			player.removeSkill("tongyu");
			player.addTempSkill("tongyu_guiyin");
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (player.hasFriend()) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	tongyu_guiyin: {},
	zhijie: {
		enable: "phaseUse",
		usable: 1,
		viewAsFilter(player) {
			return player.countCards("h", { suit: "heart" }) > 0;
		},
		viewAs: { name: "wuzhong" },
		filterCard: { suit: "heart" },
		check(card) {
			return 8 - get.value(card);
		},
	},
	yxsdili: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		content() {
			trigger.num += Math.min(2, Math.ceil((player.maxHp - player.hp) / 2));
		},
		ai: {
			threaten(player, target) {
				var num = Math.min(2, Math.ceil((player.maxHp - player.hp) / 2));
				if (num === 2) {
					return 2;
				}
				if (num === 1) {
					return 1;
				}
				return 0.5;
			},
			maixie: true,
			effect: {
				target(card, player, target) {
					if (target.maxHp <= 3) {
						return;
					}
					if (get.tag(card, "damage")) {
						if (target.hp === target.maxHp) {
							return [0, 1];
						}
					}
					if (get.tag(card, "recover") && player.hp >= player.maxHp - 1) {
						return [0, 0];
					}
				},
			},
		},
	},
	kuangchan: {
		locked: true,
		ai: {
			neg: true,
		},
		init(player) {
			if (player.isZhu) {
				player.maxHp--;
				player.update();
			}
		},
	},
	chujia: {
		enable: "phaseUse",
		filterCard(card) {
			if (ui.selected.cards.length) {
				return get.color(card) === get.color(ui.selected.cards[0]);
			}
			return true;
		},
		complexCard: true,
		usable: 1,
		selectCard: 2,
		check(card) {
			return 6 - get.value(card);
		},
		filterTarget(card, player, target) {
			return target.hp < target.maxHp;
		},
		content() {
			if (target.maxHp > target.hp) {
				target.draw(target.maxHp - target.hp);
			}
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					var num = target.maxHp - target.hp;
					if (num > 2) {
						return num;
					}
					return 0;
				},
			},
		},
	},
	baihe: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		filterTarget: true,
		content() {
			"step 0";
			if (target.isLinked()) {
				target.link();
			} else {
				target.link();
				target.draw();
				event.finish();
			}
			"step 1";
			if (target.countCards("h")) {
				target.chooseToDiscard("h", true);
			}
		},
		check(card) {
			return 8 - get.value(card);
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (!player.hasSkill("xiushen")) {
						return 0;
					}
					if (target.isLinked()) {
						return 0;
					}
					if (
						game.hasPlayer(function (current) {
							return current.isLinked();
						})
					) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	yinyang: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: 2,
		filterTarget: true,
		selectTarget: 3,
		content() {
			target.link();
		},
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					if (target.isLinked()) {
						return 1;
					}
					return -1;
				},
			},
		},
	},
	xiushen: {
		trigger: { player: "phaseUseEnd" },
		forced: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.isLinked();
			});
		},
		content() {
			player.draw(2);
		},
		ai: {
			threaten: 1.6,
		},
	},
	jiean: {
		trigger: { source: "damageEnd" },
		frequent: true,
		filter(event) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.player.isAlive() && event.parent.name === "yanyi" && event.player.hp < event.player.maxHp;
		},
		content() {
			"step 0";
			player.draw(trigger.player.maxHp - trigger.player.hp);
			"step 1";
			event.cards = result;
			"step 2";
			player.chooseCardTarget({
				filterCard(card) {
					return _status.event.parent.cards.includes(card);
				},
				selectCard: [1, event.cards.length],
				filterTarget(card, player, target) {
					return player !== target;
				},
				ai1(card) {
					if (ui.selected.cards.length > 0) {
						return -1;
					}
					return _status.event.player.countCards("h") - _status.event.player.hp;
				},
				ai2(target) {
					return get.attitude(_status.event.player, target) - 4;
				},
				prompt: "请选择要送人的卡牌",
			});
			"step 3";
			if (result.bool) {
				result.targets[0].gain(result.cards, player);
				player.$give(result.cards.length, result.targets[0]);
				for (var i = 0; i < result.cards.length; i++) {
					event.cards.remove(result.cards[i]);
				}
				if (event.cards.length) {
					event.goto(2);
				}
			}
		},
	},
	yanyi: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { color: "black" },
		position: "he",
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.chooseControl("heart2", "diamond2", "club2", "spade2").ai = function (event) {
				switch (Math.floor(Math.random() * 5)) {
					case 0:
						return "heart2";
					case 1:
					case 4:
						return "diamond2";
					case 2:
						return "club2";
					case 3:
						return "spade2";
				}
			};
			"step 1";
			game.log(player, "选择了" + get.translation(result.control));
			event.choice = result.control.slice(0, result.control.length - 1);
			target.popup(result.control);
			target.showHandcards();
			"step 2";
			if (target.countCards("h", { suit: event.choice })) {
				target.damage();
			}
		},
		ai: {
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target);
				},
			},
		},
	},
	batu: {
		trigger: { player: "phaseEnd" },
		frequent: true,
		filter(event, player) {
			return player.countCards("h") < game.countGroup();
		},
		content() {
			player.draw(game.countGroup() - player.countCards("h"));
		},
		ai: {
			threaten: 1.3,
		},
	},
	wumu: {
		mod: {
			targetInRange(card, player) {
				if (card.name === "sha" && get.color(card) === "black") {
					return true;
				}
			},
			cardUsable(card) {
				if (card.name === "sha" && get.color(card) === "red") {
					return Infinity;
				}
			},
		},
		trigger: { player: "useCard" },
		filter(event, player) {
			return event.card.name === "sha" && get.color(event.card) === "red";
		},
		forced: true,
		content() {
			if (player.stat[player.stat.length - 1].card.sha > 0) {
				player.stat[player.stat.length - 1].card.sha--;
			}
		},
	},
	ysheshen: {
		trigger: { player: "damageEnd" },
		frequent: true,
		filter(event) {
			return event.num > 0;
		},
		getIndex(event, player, triggername) {
			return event.num;
		},
		async content(event, trigger, player) {
			const { cards } = await game.cardsGotoOrdering(get.cards(2));
			if (_status.connectMode) {
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			}
			event.given_map = {};
			if (!cards.length) {
				return;
			}
			// event.goto -> do while
			do {
				const {
					result: { bool, links },
				} =
					cards.length === 1
						? { result: { links: cards.slice(0), bool: true } }
						: await player.chooseCardButton("遗计：请选择要分配的牌", true, cards, [1, cards.length]).set("ai", () => {
								if (ui.selected.buttons.length === 0) {
									return 1;
								}
								return 0;
						  });
				if (!bool) {
					return;
				}
				cards.removeArray(links);
				event.togive = links.slice(0);
				const {
					result: { targets },
				} = await player
					.chooseTarget("选择一名角色获得" + get.translation(links), true)
					.set("ai", target => {
						const att = get.attitude(_status.event.player, target);
						if (_status.event.enemy) {
							return -att;
						} else if (att > 0) {
							return att / (1 + target.countCards("h"));
						} else {
							return att / 100;
						}
					})
					.set("enemy", get.value(event.togive[0], player, "raw") < 0);
				if (targets.length) {
					const id = targets[0].playerid,
						map = event.given_map;
					if (!map[id]) {
						map[id] = [];
					}
					map[id].addArray(event.togive);
				}
			} while (cards.length > 0);
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			const list = [];
			for (const i in event.given_map) {
				const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) {
					player.addExpose(0.2);
				}
				list.push([source, event.given_map[i]]);
			}
			game.loseAsync({
				gain_list: list,
				giver: player,
				animate: "draw",
			}).setContent("gaincardMultiple");
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						let num = 1;
						if (get.attitude(player, target) > 0) {
							if (player.needsToDiscard()) {
								num = 0.7;
							} else {
								num = 0.5;
							}
						}
						if (target.hp >= 4) {
							return [1, num * 2];
						}
						if (target.hp === 3) {
							return [1, num * 1.5];
						}
						if (target.hp === 2) {
							return [1, num * 0.5];
						}
					}
				},
			},
		},
	},
	yxschangnian: {
		forbid: ["boss"],
		trigger: { player: "dieBegin" },
		direct: true,
		unique: true,
		derivation: "yxschangnian2",
		content() {
			"step 0";
			player.chooseTarget(get.prompt("yxschangnian"), function (card, player, target) {
				return player !== target;
			}).ai = function (target) {
				return get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				var cards = player.getCards("hej");
				var target = result.targets[0];
				player.$give(cards, target);
				target.gain(cards);
				target.addSkill("yxschangnian2");
				player.logSkill("yxschangnian", target);
				target.marks.yxschangnian = target.markCharacter(player, {
					name: "长念",
					content: '<div class="skill">【追思】</div><div>锁定技，结束阶段，你摸一张牌</div>',
				});
				game.addVideo("markCharacter", target, {
					name: "长念",
					content: '<div class="skill">【追思】</div><div>锁定技，结束阶段，你摸一张牌</div>',
					id: "yxschangnian",
					target: player.dataset.position,
				});
			}
		},
		ai: {
			threaten: 0.8,
		},
	},
	yxschangnian2: {
		trigger: { player: "phaseEnd" },
		forced: true,
		nopop: true,
		content() {
			player.draw();
		},
	},
	yxsciqiu: {
		trigger: { source: "damageBegin1" },
		forced: true,
		filter(event) {
			return event.card && event.card.name === "sha" && event.player.isHealthy();
		},
		content() {
			trigger.num++;
			if (trigger.num >= trigger.player.hp) {
				trigger.player.addTempSkill("yxsciqiu_dying");
				player.removeSkill("yxsciqiu");
			}
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (card.name === "sha" && target.isHealthy() && get.attitude(player, target) > 0) {
						return [1, -2];
					}
				},
			},
		},
		subSkill: {
			dying: {
				trigger: { player: "dyingBegin" },
				forced: true,
				silent: true,
				popup: false,
				firstDo: true,
				content() {
					player.die();
				},
			},
		},
	},
	sanbanfu: {
		trigger: { player: "shaBegin" },
		filter(event, player) {
			if (player.storage.sanbanfu || player.storage.sanbanfu2) {
				return false;
			}
			return !event.directHit;
		},
		check(event, player) {
			if (get.attitude(player, event.target) >= 0) {
				return false;
			}
			if (
				event.target.hasSkillTag(
					"freeShan",
					false,
					{
						player: player,
						card: event.card,
						type: "respond",
					},
					true
				)
			) {
				return false;
			}
			if (event.target.hasSkillTag("respondShan") && event.target.countCards("h") >= 3) {
				return false;
			}
			return true;
		},
		logTarget: "target",
		content() {
			"step 0";
			var next = trigger.target.chooseToRespond({ name: "shan" });
			next.autochoose = lib.filter.autoRespondShan;
			next.ai = function (card) {
				return get.unuseful2(card);
			};
			player.storage.sanbanfu = false;
			player.storage.sanbanfu2 = false;
			"step 1";
			if (result.bool === false) {
				trigger.untrigger();
				trigger.directHit = true;
				player.storage.sanbanfu2 = true;
			} else {
				player.storage.sanbanfu = true;
			}
		},
		group: ["sanbanfu2", "sanbanfu3"],
	},
	sanbanfu2: {
		trigger: { player: "shaAfter" },
		silent: true,
		content() {
			if (player.storage.sanbanfu) {
				player.damage(trigger.target);
			}
			delete player.storage.sanbanfu;
			delete player.storage.sanbanfu2;
		},
	},
	sanbanfu3: {
		trigger: { source: "damageBegin" },
		silent: true,
		filter(event, player) {
			return event.card && event.card.name === "sha" && player.storage.sanbanfu2;
		},
		content() {
			trigger.num++;
		},
	},
	bingsheng: {
		enable: "phaseUse",
		usable: 1,
		filterCard(card) {
			if (ui.selected.cards.length) {
				return get.suit(card) !== get.suit(ui.selected.cards[0]);
			}
			return true;
		},
		complexCard: true,
		selectCard: 2,
		check(card) {
			return 8 - get.value(card);
		},
		filterTarget(card, player, target) {
			if (target.hp === Infinity) {
				return false;
			}
			if (target.hp > player.hp) {
				return true;
			}
			if (target.hp < player.hp && target.hp < target.maxHp) {
				return true;
			}
			return false;
		},
		content() {
			var num = target.hp - player.hp;
			if (num > 2) {
				num = 2;
			}
			if (num < -2) {
				num = -2;
			}
			if (num > 0) {
				target.damage(num);
			} else if (num < 0 && target.hp < target.maxHp) {
				target.recover(-num);
			}
		},
		ai: {
			order: 8.5,
			result: {
				target(player, target) {
					var num;
					if (player.hp > target.maxHp) {
						num = player.hp - target.maxHp;
					} else {
						num = player.hp - target.hp;
					}
					if (target.hp === 1 && num) {
						return num + 1;
					}
					return num;
				},
			},
		},
	},
	taolue: {
		mod: {
			maxHandcard(player, num) {
				return num + 1;
			},
		},
	},
	shentan: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		filterTarget(card, player, target) {
			return target.countCards("h") > 0 && get.distance(player, target) <= 2;
		},
		check(card) {
			return 7 - get.value(card);
		},
		position: "he",
		content() {
			"step 0";
			var hs = target.getCards("h");
			if (hs.length) {
				event.card = hs.randomGet();
				player.gain(event.card, target);
				target.$giveAuto(event.card, player);
			} else {
				event.finish();
			}
			"step 1";
			var source = target;
			player.chooseTarget("选择一个目标送出" + get.translation(event.card), function (card, player, target) {
				return target !== player;
			}).ai = function (target) {
				var att = get.attitude(player, target);
				if (att > 3 && player.countCards("h") > target.countCards("h")) {
					return att;
				}
				return 0;
			};
			"step 2";
			if (result.bool) {
				result.targets[0].gain(card, player);
				player.$give(1, result.targets[0]);
				player.line(result.targets, "green");
				game.delay();
			}
		},
		ai: {
			order: 9,
			result: {
				target: -1,
				player(player, target) {
					if (get.attitude(player, target) > 0) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	hanqiang: {
		mod: {
			attackFrom(from, to, distance) {
				if (!from.getEquip(1)) {
					return distance - 1;
				}
			},
		},
	},
	biaoqi: {
		trigger: { player: "shaBegin" },
		forced: true,
		content() {
			var range = player.getAttackRange();
			if (range > trigger.target.hp) {
				trigger.directHit = true;
			} else if (range < trigger.target.hp) {
				player.draw();
			}
		},
	},
	wluoyan: {
		trigger: { player: "damageBefore" },
		forced: true,
		content() {
			trigger.cancel();
			player.loseHp();
		},
		ai: {
			noDirectDamage: true,
		},
	},
	heqin: {
		limited: true,
		skillAnimation: true,
		enable: "phaseUse",
		filter(event, player) {
			return !player.storage.heqin;
		},
		filterTarget(card, player, target) {
			return target.sex === "male" && target !== player;
		},
		content() {
			player.awakenSkill(event.name);
			player.addSkill("heqin2");
			target.addSkill("heqin2");

			target.marks.heqin = target.markCharacter(player, {
				name: "和亲",
				content: "摸牌阶段摸牌数+1",
			});
			game.addVideo("markCharacter", target, {
				name: "放权",
				content: "摸牌阶段摸牌数+1",
				id: "heqin",
				target: player.dataset.position,
			});

			player.storage.heqin = target;
			target.storage.heqin = player;

			player.marks.heqin = player.markCharacter(target, {
				name: "和亲",
				content: "摸牌阶段摸牌数+1",
			});
			game.addVideo("markCharacter", player, {
				name: "放权",
				content: "摸牌阶段摸牌数+1",
				id: "heqin",
				target: target.dataset.position,
			});
		},
		ai: {
			order: 1,
			result: {
				target: 1,
			},
		},
	},
	heqin2: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		content() {
			trigger.num++;
		},
		group: "heqin3",
	},
	heqin3: {
		trigger: { player: "dieBegin" },
		forced: true,
		popup: false,
		content() {
			player.removeSkill("heqin2");
			player.unmarkSkill("heqin");
			if (player.storage.heqin) {
				player.storage.heqin.removeSkill("heqin2");
				player.storage.heqin.unmarkSkill("heqin");
			}
		},
	},
	chajue: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			return _status.currentPhase !== player;
		},
		content() {
			player.addTempSkill("chajue2", { player: "phaseBegin" });
		},
	},
	chajue2: {
		trigger: { target: "useCardToBefore" },
		forced: true,
		priority: 15,
		mark: true,
		intro: {
			content: "杀或普通锦囊牌对你无效",
		},
		filter(event, player) {
			return get.type(event.card) === "trick" || event.card.name === "sha";
		},
		content() {
			game.log(player, "发动了察觉，", trigger.card, "对", trigger.target, "失效");
			trigger.cancel();
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.type(card) === "trick" || card.name === "sha") {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	tiewan: {
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			return get.type(event.card.viewAs || event.card.name) === "delay" && event.player !== player;
		},
		direct: true,
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt("tiewan"),
				filterCard: { color: "red" },
				position: "he",
				filterTarget(card, player, target) {
					return player.canUse({ name: "lebu" }, target);
				},
				ai1(card) {
					return 7 - get.value(card);
				},
				ai2(target) {
					return get.effect(target, { name: "lebu" }, player, player);
				},
			});
			"step 1";
			if (result.bool) {
				player.logSkill("tiewan");
				player.useCard({ name: "lebu" }, result.cards, result.targets);
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	qianglue: {
		trigger: { player: "shaMiss" },
		priority: -1,
		filter(event) {
			return event.target.countCards("he") > 0;
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		content() {
			"step 0";
			player.judge(function (card) {
				return get.color(card) === "black" ? 1 : -1;
			});
			"step 1";
			if (result.bool) {
				player.gainPlayerCard("he", trigger.target);
			}
		},
	},
	jimin: {
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard: true,
		viewAs: { name: "shan" },
		viewAsFilter(player) {
			if (!player.countCards("h")) {
				return false;
			}
			if (player.countCards("e")) {
				return false;
			}
		},
		prompt: "将一张手牌当闪使用或打出",
		check() {
			return 1;
		},
		ai: {
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countCards("h")) {
					return false;
				}
				if (player.countCards("e")) {
					return false;
				}
			},
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondShan") && current < 0 && !target.countCards("e")) {
						return 0.6;
					}
				},
			},
		},
	},
	xiadao: {
		trigger: { source: "damageEnd" },
		direct: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			if (event.player.isDead()) {
				return false;
			}
			var nh = event.player.countCards("h");
			if (nh === 0) {
				return false;
			}
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (players[i] !== player && players[i] !== event.player && players[i].countCards("h") <= nh) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var nh = trigger.player.countCards("h");
			var att = get.attitude(player, trigger.player);
			player.chooseTarget(get.prompt("xiadao"), function (card, player, target) {
				return target !== player && target !== trigger.player && target.countCards("h") <= nh;
			}).ai = function (target) {
				if (att > 0) {
					return 0;
				}
				return get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("xiadao");
				player.line2([trigger.player, result.targets[0]], "green");
				event.target = result.targets[0];
				game.delay();
			} else {
				event.finish();
			}
			"step 0";
			if (event.target) {
				var card = trigger.player.getCards("h").randomGet();
				event.target.gain(card, trigger.player);
				trigger.player.$giveAuto(card, event.target);
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.4,
		},
	},
	lzhangyi: {
		trigger: { player: "discardAfter" },
		filter(event, player) {
			for (var i = 0; i < event.cards.length; i++) {
				if (get.position(event.cards[i]) === "d") {
					return true;
				}
			}
			return false;
		},
		direct: true,
		popup: false,
		content() {
			"step 0";
			if (trigger.delay === false) {
				game.delay();
			}
			"step 1";
			var du = 1;
			if (trigger.cards.length === 1 && trigger.cards[0].name === "du") {
				du = -1;
			} else {
				for (var i = 0; i < trigger.cards.length; i++) {
					if (trigger.cards[i].name === "du") {
						du = -1;
						break;
					}
				}
				if (du === -1 && trigger.cards.length > 2) {
					du = 0;
				}
			}
			player
				.chooseTarget(get.prompt("lzhangyi"), function (card, player, target) {
					return player !== target;
				})
				.set("du", du).ai = function (target) {
				var att = get.attitude(_status.event.player, target);
				return att * _status.event.du;
			};
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("lzhangyi", target);
				var cards = [];
				for (var i = 0; i < trigger.cards.length; i++) {
					if (get.position(trigger.cards[i]) === "d") {
						cards.push(trigger.cards[i]);
					}
				}
				target.gain(cards);
				target.$gain2(cards);
				if (target === game.me) {
					game.delayx();
				}
			}
		},
		ai: {
			threaten: 0.9,
			expose: 0.1,
		},
	},
	yizhuang: {
		trigger: { player: "phaseBegin" },
		group: "yizhuang2",
		direct: true,
		content() {
			"step 0";
			if (player.countCards("he")) {
				player.chooseCardTarget({
					prompt: get.prompt("yizhuang"),
					filterCard: lib.filter.cardDiscardable,
					position: "he",
					filterTarget(card, player, target) {
						if (target === player) {
							return false;
						}
						if (target.sex !== "male") {
							return false;
						}
						var name = target.name.indexOf("unknown") === 0 ? target.name2 : target.name;
						if (name === player.storage.yizhuang) {
							return false;
						}
						var info = lib.character[name];
						if (info) {
							var skills = info[3];
							for (var j = 0; j < skills.length; j++) {
								if (lib.translate[skills[j] + "_info"] && lib.skill[skills[j]] && !lib.skill[skills[j]].unique && !player.hasSkill(skills[j])) {
									return true;
								}
							}
						}
						return false;
					},
					ai1(card) {
						if (player.additionalSkills.yizhuang && player.additionalSkills.yizhuang.length > 0) {
							return 0;
						}
						return 7 - get.value(card);
					},
					ai2(target) {
						if (target.isMin()) {
							return 0;
						}
						return 6 - target.maxHp;
					},
				});
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				player.unmark(player.storage.yizhuang + "_charactermark");
				player.discard(result.cards);
				player.logSkill("yizhuang", result.targets);
				var name = result.targets[0].name;
				if (name.indexOf("unknown") === 0) {
					name = result.targets[0].name2;
				}
				var list = [];
				var skills = lib.character[name][3];
				for (var j = 0; j < skills.length; j++) {
					if (lib.translate[skills[j] + "_info"] && lib.skill[skills[j]] && !lib.skill[skills[j]].unique && !player.hasSkill(skills[j])) {
						list.push(skills[j]);
					}
				}
				player.addAdditionalSkill("yizhuang", list);
				player.markCharacter(name, null, true, true);
				game.addVideo("markCharacter", player, {
					name: "幻形",
					content: "",
					id: "yizhuang",
					target: name,
				});
				player.storage.yizhuang = name;
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	yizhuang2: {
		trigger: { player: "damageAfter" },
		priority: -15,
		forced: true,
		filter(event, player) {
			return player.additionalSkills.yizhuang && player.additionalSkills.yizhuang.length > 0;
		},
		content() {
			player.unmark(player.storage.yizhuang + "_charactermark");
			player.removeAdditionalSkill("yizhuang");
			delete player.storage.yizhuang;
			player.checkMarks();
		},
	},
	kongju: {
		mod: {
			maxHandcard(player, num) {
				if (player.hp < player.maxHp) {
					return num + player.maxHp - player.hp;
				}
			},
			targetEnabled(card, player, target, now) {
				if (target.countCards("h") < target.maxHp) {
					if (card.name === "shunshou" || card.name === "guohe") {
						return false;
					}
				} else if (target.countCards("h") > target.maxHp) {
					if (card.name === "lebu") {
						return false;
					}
				}
			},
		},
	},
	tuqiang: {
		trigger: { player: ["respond", "useCard"] },
		filter(event, player) {
			return event.card && event.card.name === "shan";
		},
		frequent: true,
		content() {
			player.draw();
		},
		ai: {
			mingzhi: false,
			effect: {
				player_use(card, player, target) {
					if (get.tag(card, "respondShan")) {
						return 0.8;
					}
				},
			},
		},
	},
	xumou: {
		trigger: { player: "phaseJieshuBegin" },
		check(event, player) {
			return event.player.hp + player.countCards("h") < 4;
		},
		async content(event, trigger, player) {
			await player.draw(3);
			await player.turnOver();
		},
	},
	zhensha: {
		trigger: { global: "dying" },
		priority: 9,
		filter(event, player) {
			return event.player.hp <= 0 && (player.countCards("h", "jiu") > 0 || player.countCards("h", { color: "black" }) >= 2) && player !== event.player;
		},
		direct: true,
		content() {
			"step 0";
			var goon = get.attitude(player, trigger.player) < 0;
			var next = player.chooseToDiscard("鸠杀：是否弃置一张酒或两张黑色手牌令" + get.translation(trigger.player) + "立即死亡？");
			next.ai = function (card) {
				if (ui.selected.cards.length) {
					if (ui.selected.cards[0].name === "jiu") {
						return 0;
					}
				}
				if (goon) {
					if (card.name === "jiu") {
						return 2;
					}
					return 1;
				}
				return 0;
			};
			next.filterCard = function (card) {
				if (ui.selected.cards.length) {
					return get.color(card) === "black";
				}
				return get.color(card) === "black" || card.name === "jiu";
			};
			(next.complexCard = true), (next.logSkill = ["zhensha", trigger.player]);
			next.selectCard = function () {
				if (ui.selected.cards.length) {
					if (ui.selected.cards[0].name === "jiu") {
						return [1, 1];
					}
				}
				return [2, 2];
			};
			"step 1";
			if (result.bool) {
				trigger.player.die();
			} else {
				event.finish();
			}
			"step 2";
			if (!trigger.player.isAlive()) {
				trigger.cancel(true);
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	ducai: {
		enable: "phaseUse",
		usable: 1,
		unique: true,
		forceunique: true,
		check(card) {
			if (_status.event.player.countCards("h") >= 3) {
				return 5 - get.value(card);
			}
			return 0;
		},
		position: "he",
		filterCard: true,
		content() {
			player.storage.ducai2 = cards[0];
			player.addTempSkill("ducai2", { player: "phaseBegin" });
		},
		ai: {
			order: 8,
			result: {
				player: 1,
			},
		},
		global: "ducai3",
	},
	ducai2: {
		mark: "card",
		intro: {
			content: "card",
		},
	},
	ducai3: {
		mod: {
			cardEnabled(card, player) {
				if (player.hasSkill("ducai2")) {
					return;
				}
				var suit,
					players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i].hasSkill("ducai2")) {
						suit = get.suit(players[i].storage.ducai2);
					}
				}
				if (suit && get.suit(card) === suit) {
					return false;
				}
			},
			cardUsable(card, player) {
				if (player.hasSkill("ducai2")) {
					return;
				}
				var suit,
					players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i].hasSkill("ducai2")) {
						suit = get.suit(players[i].storage.ducai2);
					}
				}
				if (suit && get.suit(card) === suit) {
					return false;
				}
			},
			cardRespondable(card, player) {
				if (player.hasSkill("ducai2")) {
					return;
				}
				var suit,
					players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i].hasSkill("ducai2")) {
						suit = get.suit(players[i].storage.ducai2);
					}
				}
				if (suit && get.suit(card) === suit) {
					return false;
				}
			},
			cardSavable(card, player) {
				if (player.hasSkill("ducai2")) {
					return;
				}
				var suit,
					players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i].hasSkill("ducai2")) {
						suit = get.suit(players[i].storage.ducai2);
					}
				}
				if (suit && get.suit(card) === suit) {
					return false;
				}
			},
		},
	},
	tongling: {
		init(player) {
			player.storage.tongling = 0;
		},
		intro: {
			content: "mark",
		},
		forced: true,
		trigger: { global: "damageAfter" },
		filter(event, player) {
			return event.source && event.source.isFriendsOf(player) && player.storage.tongling < 3;
		},
		content() {
			player.storage.tongling++;
			player.syncStorage("tongling");
			player.markSkill("tongling");
		},
		ai: {
			combo: "fanpu",
		},
	},
	fanpu: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.storage.tongling >= 3;
		},
		filterTarget(card, player, target) {
			return player.canUse("sha", target);
		},
		selectTarget: [1, 3],
		multitarget: true,
		multiline: true,
		content() {
			player.storage.tongling -= 3;
			player.unmarkSkill("tongling");
			player.syncStorage("tongling");
			player.useCard({ name: "sha" }, targets, false);
		},
		ai: {
			combo: "tongling",
			order: 2,
		},
	},
	fenghuo: {
		enable: "chooseToUse",
		filter(event, player) {
			return player.countCards("e") > 0;
		},
		filterCard: true,
		position: "e",
		viewAs: { name: "nanman" },
		prompt: "将一张装备区内的牌当南蛮入侵使用",
		check(card) {
			var player = _status.currentPhase;
			if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
				return 11 - get.equipValue(card);
			}
			if (player.countCards("h") < player.hp) {
				return 6 - get.value(card);
			}
			return 2 - get.equipValue(card);
		},
		ai: {
			order: 9,
			threaten: 1.1,
		},
	},
	nichang: {
		trigger: { player: "phaseDrawBefore" },
		check(event, player) {
			if (player.skipList.includes("phaseUse")) {
				return true;
			}
			var suits = ["spade", "heart", "diamond", "club"];
			var cards = player.getCards("h");
			for (var i = 0; i < cards.length; i++) {
				suits.remove(get.suit(cards[i]));
			}
			return suits.length >= 2;
		},
		content() {
			trigger.cancel();
			player.addSkill("nichang2");
		},
	},
	nichang2: {
		trigger: { player: "phaseEnd" },
		forced: true,
		content() {
			"step 0";
			if (player.countCards("h")) {
				player.showHandcards();
			}
			player.removeSkill("nichang2");
			"step 1";
			var suits = ["spade", "heart", "diamond", "club"];
			var cards = player.getCards("h");
			for (var i = 0; i < cards.length; i++) {
				suits.remove(get.suit(cards[i]));
			}
			player.draw(suits.length);
		},
	},
	fengyan: {
		trigger: { global: "cardsDiscardAfter" },
		frequent: true,
		filter(event, player) {
			var evt = event.getParent().relatedEvent;
			if (!evt || evt.name !== "judge") {
				return;
			}
			if (evt.player.sex !== "male") {
				return false;
			}
			if (get.position(event.cards[0], true) !== "d") {
				return false;
			}
			return get.color(event.cards[0]) === "red";
		},
		content() {
			player.gain(trigger.cards, "gain2");
		},
	},
	fengyi: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		filterTarget: true,
		check(card) {
			return 8 - get.value(card);
		},
		content() {
			target.draw(2);
		},
		ai: {
			result: {
				target: 2,
			},
			order: 1,
			threaten: 1.5,
		},
	},
	wange: {
		trigger: { player: "phaseDrawBegin" },
		check(event, player) {
			return game.hasPlayer(function (current) {
				return get.attitude(player, current) < 0 && current.countCards("h");
			});
		},
		content() {
			trigger.num--;
			player.addSkill("wange2");
		},
		ai: {
			threaten: 1.8,
		},
	},
	wange2: {
		trigger: { player: "phaseEnd" },
		direct: true,
		content() {
			"step 0";
			var num = Math.max(1, player.maxHp - player.hp);
			player.chooseTarget("婉歌：获得至多" + get.cnNumber(num) + "名角色的一张手牌", [1, num], function (card, player, target) {
				return target.countCards("h") && target !== player;
			}).ai = function (target) {
				return -get.attitude(player, target);
			};
			player.removeSkill("wange2");
			"step 1";
			if (result.bool) {
				event.targets = result.targets;
				player.logSkill("wange", result.targets);
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets.length) {
				player.gainMultiple(event.targets);
			} else {
				event.finish();
			}
			"step 3";
			game.delay();
		},
	},
	seyou: {
		limited: true,
		skillAnimation: true,
		enable: "phaseUse",
		filterTarget: true,
		content() {
			"step 0";
			player.awakenSkill(event.name);
			event.targets = game.filterPlayer();
			event.targets.remove(player);
			event.targets.remove(target);
			for (var i = 0; i < event.targets.length; i++) {
				if (event.targets[i].sex !== "male") {
					event.targets.splice(i--, 1);
				}
			}
			"step 1";
			if (event.targets.length) {
				event.current = event.targets.shift();
				if (event.current.countCards("he") && target.isAlive()) {
					event.current.chooseToUse({ name: "sha" }, target, -1);
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool === false) {
				player.gainPlayerCard(event.current, true, "he");
			}
			event.goto(1);
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					var players = game.filterPlayer();
					if (player.hp > 1) {
						if (game.phaseNumber < game.players.length) {
							return 0;
						}
						for (var i = 0; i < players.length; i++) {
							if (players[i].ai.shown === 0) {
								return 0;
							}
							if (players[i].sex === "unknown") {
								return 0;
							}
						}
					}
					var effect = 0;
					for (var i = 0; i < players.length; i++) {
						if (players[i].sex === "male" && players[i] !== target && players[i] !== player && players[i].countCards("he")) {
							effect += get.effect(target, { name: "sha" }, players[i], target);
						}
					}
					return effect;
				},
			},
		},
	},
	sheshi: {
		trigger: { player: "damageEnd" },
		direct: true,
		content() {
			"step 0";
			if (event.isMine()) {
				event.dialog = ui.create.dialog(get.prompt("sheshi"));
			}
			if (ui.cardPile.childNodes.length < 4) {
				var discardcards = get.cards(4);
				for (var i = 0; i < discardcards.length; i++) {
					discardcards[i].discard();
				}
			}
			player.chooseControl("heart2", "diamond2", "club2", "spade2", "cancel").ai = function (event) {
				if (Math.random() < 0.5) {
					return "club2";
				}
				if (Math.random() < 0.5) {
					return "spade2";
				}
				if (Math.random < 2 / 3) {
					return "diamond2";
				}
				return "heart2";
			};
			"step 1";
			if (event.dialog) {
				event.dialog.close();
			}
			if (result.control && result.control.indexOf("2") !== -1) {
				player.logSkill("sheshi");
				game.log(player, "指定的花色为" + get.translation(result.control));
				var suit = result.control.slice(0, result.control.length - 1);
				var cards = [];
				for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
					var card = ui.cardPile.childNodes[i];
					cards.push(card);
					if (get.suit(card) === suit || i >= 3) {
						break;
					}
				}
				event.cards = cards;
				event.suit = suit;
				player.showCards(cards);
			} else {
				event.finish();
			}
			"step 2";
			if (event.cards && event.cards.length) {
				if (get.suit(event.cards[event.cards.length - 1]) === event.suit) {
					event.cards.pop().discard();
				}
				if (event.cards.length) {
					player.gain(event.cards, "draw2");
				}
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						if (target.hp >= 4) {
							return [1, 2];
						}
						if (target.hp === 3) {
							return [1, 1.5];
						}
						if (target.hp === 2) {
							return [1, 0.5];
						}
					}
				},
			},
		},
	},
	bolehuiyan: {
		trigger: { global: "shaBegin" },
		direct: true,
		priority: 11,
		filter(event, player) {
			if (player.hasSkill("bolehuiyan4")) {
				return false;
			}
			if (event.target.isUnderControl()) {
				return false;
			}
			return event.player !== player && event.target !== player && event.target.countCards("h") > 0;
		},
		group: ["bolehuiyan2", "bolehuiyan3"],
		content() {
			"step 0";
			if (event.isMine()) {
				event.dialog = ui.create.dialog("慧眼：预言" + get.translation(trigger.player) + "对" + get.translation(trigger.target) + "的杀能否命中");
			}
			player.chooseControl("能命中", "不能命中", "cancel").ai = function (event) {
				if (trigger.player.hasSkill("wushuang")) {
					return 0;
				}
				if (trigger.player.hasSkill("liegong")) {
					return 0;
				}
				if (trigger.player.hasSkill("tieji")) {
					return 0;
				}
				if (trigger.player.hasSkill("juji")) {
					return 0;
				}
				if (trigger.player.hasSkill("retieji")) {
					return 0;
				}
				if (trigger.player.hasSkill("roulin") && trigger.target.sex === "female") {
					return 0;
				}
				if (trigger.player.hasSkill("nvquan") && trigger.target.sex === "male") {
					return 0;
				}
				if (trigger.target.hasSkill("yijue2")) {
					return 0;
				}
				if (trigger.target.hasSkill("shanguang2")) {
					return 0;
				}

				var equip = trigger.target.getEquip(2);
				if (equip && (equip.name === "bagua" || equip.name === "rewrite_bagua")) {
					return 1;
				}
				return trigger.target.countCards("h") < 2 ? 0 : 1;
			};
			"step 1";
			if (event.dialog) {
				event.dialog.close();
			}
			if (result.control !== "cancel") {
				player.addTempSkill("bolehuiyan4");
				player.logSkill(["bolehuiyan", result.control], trigger.target);
				game.log(player, "预言" + result.control);
				player.storage.bolehuiyan = result.control;
				game.delay();
			}
		},
		ai: {
			threaten: 1.3,
		},
	},
	bolehuiyan2: {
		trigger: { global: "shaEnd" },
		forced: true,
		popup: false,
		filter(event, player) {
			return player.storage.bolehuiyan ? true : false;
		},
		content() {
			if (player.storage.bolehuiyan === "不能命中") {
				player.popup("预言成功");
				player.draw();
			} else {
				player.popup("预言失败");
				player.chooseToDiscard("预言失败，请弃置一张牌", "he", true);
			}
			delete player.storage.bolehuiyan;
		},
	},
	bolehuiyan3: {
		trigger: { global: "shaDamage" },
		forced: true,
		popup: false,
		filter(event, player) {
			return player.storage.bolehuiyan ? true : false;
		},
		content() {
			if (player.storage.bolehuiyan === "能命中") {
				player.popup("预言成功");
				player.draw();
			} else {
				player.popup("预言失败");
				player.chooseToDiscard("预言失败，请弃置一张牌", "he", true);
			}
			delete player.storage.bolehuiyan;
		},
	},
	bolehuiyan4: {},
	oldbolehuiyan: {
		trigger: { global: "judgeBegin" },
		direct: true,
		priority: 11,
		filter(event, player) {
			return event.player !== player;
		},
		content() {
			"step 0";
			if (event.isMine()) {
				event.dialog = ui.create.dialog("慧眼：预言" + get.translation(trigger.player) + "的" + trigger.judgestr + "判定");
			}
			player.chooseControl("heart2", "diamond2", "club2", "spade2", "cancel").ai = function (event) {
				switch (Math.floor(Math.random() * 4)) {
					case 0:
						return "heart2";
					case 1:
						return "diamond2";
					case 2:
						return "club2";
					case 3:
						return "spade2";
				}
			};
			"step 1";
			if (event.dialog) {
				event.dialog.close();
			}
			if (result.control !== "cancel") {
				game.log(player, "预言判定结果为" + get.translation(result.control));
				player.storage.bolehuiyan = result.control.slice(0, result.control.length - 1);
				player.popup(result.control);
				game.delay();
			}
		},
		group: "bolehuiyan2",
	},
	oldbolehuiyan2: {
		trigger: { global: "judgeEnd" },
		forced: true,
		popup: false,
		content() {
			if (player.storage.bolehuiyan === trigger.result.suit) {
				game.log(player, "预言成功");
				player.popup("洗具");
				player.draw(2);
			} else if (get.color({ suit: player.storage.bolehuiyan }) === trigger.result.color) {
				player.popup("洗具");
				player.draw();
			}
			delete player.storage.bolehuiyan;
		},
	},
	xiangma: {
		trigger: {
			player: ["changeHp"],
		},
		audio: 2,
		audioname: ["re_gongsunzan"],
		forced: true,
		filter(event, player) {
			return get.sgn(player.hp - 2.5) !== get.sgn(player.hp - 2.5 - event.num);
		},
		content() {},
		mod: {
			globalFrom(from, to, current) {
				if (from.hp > 2) {
					return current - 1;
				}
			},
			globalTo(from, to, current) {
				if (to.hp <= 2) {
					return current + 1;
				}
			},
		},
		ai: {
			threaten: 0.8,
		},
	},
	yxsweiyi: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source && event.source.countCards("he");
		},
		check(event, player) {
			return get.attitude(player, event.source) < 0;
		},
		content() {
			trigger.source.chooseToDiscard(2, "he", true);
		},
		logTarget: "source",
		ai: {
			maixie_defend: true,
			expose: 0.3,
			result: {
				target(card, player, target) {
					if (player.countCards("he") > 1 && get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1];
						}
						if (get.attitude(target, player) < 0) {
							return [1, 0, 0, -1.5];
						}
					}
				},
			},
		},
	},
	qiandu: {
		enable: "phaseUse",
		usable: 1,
		seatRelated: "changeSeat",
		filterTarget(card, player, target) {
			return player !== target && player.next !== target;
		},
		filterCard: { color: "black" },
		check(card) {
			return 4 - get.value(card);
		},
		content() {
			game.swapSeat(player, target);
		},
		ai: {
			order: 5,
			result: {
				player(player, target) {
					var att = get.attitude(player, target);
					if (target === player.previous && att > 0) {
						return att;
					}
					if (target === player.next && att < 0) {
						return -att;
					}
					var att2 = get.attitude(player, player.next);
					if (target === player.next.next && att < 0 && att2 < 0) {
						return -att - att2;
					}
					return 0;
				},
			},
		},
	},
	nvquan: {
		locked: false,
		group: ["nvquan1", "nvquan2", "nvquan3"],
	},
	nvquan1: {
		trigger: { player: "shaBegin" },
		forced: true,
		filter(event) {
			return event.target.sex === "male";
		},
		priority: -1,
		content() {
			if (typeof trigger.shanRequired === "number") {
				trigger.shanRequired++;
			} else {
				trigger.shanRequired = 2;
			}
		},
	},
	nvquan2: {
		trigger: { player: "juedou", target: "juedou" },
		forced: true,
		filter(event, player) {
			return event.turn !== player && event.turn.sex === "male";
		},
		priority: -1,
		content() {
			"step 0";
			var next = trigger.turn.chooseToRespond({ name: "sha" }, "请打出一张杀响应决斗");
			next.set("prompt2", "（共需打出两张杀）");
			next.autochoose = lib.filter.autoRespondSha;
			next.ai = function (card) {
				if (get.attitude(trigger.turn, player) < 0 && trigger.turn.countCards("h", "sha") > 1) {
					return get.unuseful2(card);
				}
				return -1;
			};
			"step 1";
			if (result.bool === false) {
				trigger.directHit = true;
			}
		},
		ai: {
			result: {
				target(card, player, target) {
					if (card.name === "juedou" && target.countCards("h") > 0) {
						return [1, 0, 0, -1];
					}
				},
			},
		},
	},
	nvquan3: {
		mod: {
			targetEnabled(card, player, target) {
				if (card.name === "juedou" && player.sex === "male") {
					return false;
				}
			},
		},
	},
	feigong: {
		trigger: { global: "useCard" },
		priority: 15,
		filter(event, player) {
			return event.card.name === "sha" && event.player !== player && player.countCards("h", "sha") > 0 && event.targets.includes(player) === false;
		},
		direct: true,
		content() {
			"step 0";
			var effect = 0;
			for (var i = 0; i < trigger.targets.length; i++) {
				effect += get.effect(trigger.targets[i], trigger.card, trigger.player, player);
			}
			var str = "弃置一张杀令" + get.translation(trigger.player);
			if (trigger.targets && trigger.targets.length) {
				str += "对" + get.translation(trigger.targets);
			}
			str += "的" + get.translation(trigger.card) + "失效";
			var next = player.chooseToDiscard("h", { name: "sha" }, get.prompt("feigong"));
			next.prompt2 = str;
			next.ai = function (card) {
				if (effect < 0) {
					return 9 - get.value(card);
				}
				return -1;
			};
			next.autodelay = true;
			next.logSkill = ["feigong", trigger.player];
			"step 1";
			if (result.bool) {
				trigger.cancel();
			}
		},
		ai: {
			threaten: 1.2,
			expose: 0.2,
		},
	},
	jianai: {
		trigger: { player: "recoverEnd" },
		check(event, player) {
			if (event.parent.name === "taoyuan" && event.parent.player === player) {
				return false;
			}
			var num = 0;
			var eff,
				players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (players[i] !== player) {
					eff = 0;
					if (players[i].hp < players[i].maxHp) {
						eff++;
					}
					if (players[i].hp === 1 && players[i].maxHp > 2) {
						eff += 0.5;
					}
				}
				if (get.attitude(player, players[i]) > 0) {
					num += eff;
				} else if (get.attitude(player, players[i]) < 0) {
					num -= eff;
				}
			}
			return num > 0;
		},
		content() {
			"step 0";
			event.targets = game.filterPlayer();
			event.targets.remove(player);
			"step 1";
			if (event.targets.length) {
				event.targets.shift().recover();
				event.redo();
			}
		},
		ai: {
			expose: 0.1,
		},
	},
	jieyong: {
		trigger: { player: "useCardAfter" },
		direct: true,
		filter(event, player) {
			if (event.cards.filterInD().length === 0) {
				return false;
			}
			if (player.hasSkill("jieyong2")) {
				return false;
			}
			return player.countCards("he", { color: "black" }) > 0;
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard("he", "是否弃置一张黑色牌并收回" + get.translation(trigger.cards.filterInD()) + "？", { color: "black" });
			next.ai = function (card) {
				return get.value(trigger.card) - get.value(card);
			};
			next.logSkill = "jieyong";
			"step 1";
			if (result.bool) {
				player.gain(trigger.cards.filterInD(), "gain2", "log");
				player.addTempSkill("jieyong2", ["phaseAfter", "phaseBegin"]);
			}
		},
		ai: {
			threaten: 1.3,
		},
	},
	jieyong2: {
		filterCard: { suit: "heart" },
		popname: true,
	},
	jieyong3: {
		trigger: { player: "useCardBefore" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.skill === "jieyong2";
		},
		content() {
			player.popup(trigger.card.name);
			player.getStat("skill").jieyong++;
		},
	},
	jieyong4: {},
	jieyong5: {},
	jieyong6: {},
	zhulu: {
		trigger: { global: "useCardAfter" },
		direct: true,
		filter(event, player) {
			return _status.currentPhase !== player && event.player !== player && get.type(event.card) === "trick" && event.cards.filterInD().length > 0 && !player.hasSkill("zhulu2") && player.countCards("he", { suit: get.suit(event.card) }) > 0;
		},
		content() {
			"step 0";
			var val = get.value(trigger.card);
			var suit = get.suit(trigger.card);
			var next = player.chooseToDiscard("he", "逐鹿：是否弃置一张" + get.translation(suit) + "牌并获得" + get.translation(trigger.cards.filterInD()) + "？", { suit: suit });
			next.ai = function (card) {
				return val - get.value(card);
			};
			next.logSkill = "zhulu";
			"step 1";
			if (result.bool) {
				player.gain(trigger.cards.filterInD(), "log", "gain2");
				player.addTempSkill("zhulu2");
			}
		},
		ai: {
			threaten: 1.2,
		},
	},
	zhulu2: {},
	xieling: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: 2,
		check(card) {
			return 7 - get.value(card);
		},
		multitarget: true,
		targetprompt: ["被移走", "移动目标"],
		filterTarget(card, player, target) {
			if (ui.selected.targets.length) {
				var from = ui.selected.targets[0];
				var judges = from.getCards("j");
				for (var i = 0; i < judges.length; i++) {
					if (!target.hasJudge(judges[i].viewAs || judges[i].name)) {
						return true;
					}
				}
				if (target.isMin()) {
					return false;
				}
				if ((from.getEquip(1) && !target.getEquip(1)) || (from.getEquip(2) && !target.getEquip(2)) || (from.getEquip(3) && !target.getEquip(3)) || (from.getEquip(4) && !target.getEquip(4)) || (from.getEquip(5) && !target.getEquip(5))) {
					return true;
				}
				return false;
			} else {
				return target.countCards("ej") > 0;
			}
		},
		selectTarget: 2,
		content() {
			"step 0";
			if (targets.length === 2) {
				player.choosePlayerCard(
					"ej",
					function (button) {
						if (get.attitude(player, targets[0]) > get.attitude(player, targets[1])) {
							return get.position(button.link) === "j" ? 10 : 0;
						} else {
							if (get.position(button.link) === "j") {
								return -10;
							}
							return get.equipValue(button.link);
						}
					},
					targets[0]
				);
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				if (get.position(result.buttons[0].link) === "e") {
					event.targets[1].equip(result.buttons[0].link);
				} else if (result.buttons[0].link.viewAs) {
					event.targets[1].addJudge({ name: result.buttons[0].link.viewAs }, [result.buttons[0].link]);
				} else {
					event.targets[1].addJudge(result.buttons[0].link);
				}
				event.targets[0].$give(result.buttons[0].link, event.targets[1]);
				game.delay();
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (ui.selected.targets.length === 0) {
						if (target.countCards("j") && get.attitude(player, target) > 0) {
							return 1;
						}
						if (get.attitude(player, target) < 0) {
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (get.attitude(player, players[i]) > 0) {
									if ((target.getEquip(1) && !players[i].getEquip(1)) || (target.getEquip(2) && !players[i].getEquip(2)) || (target.getEquip(3) && !players[i].getEquip(3)) || (target.getEquip(4) && !players[i].getEquip(4)) || (target.getEquip(5) && !players[i].getEquip(5))) {
										return -1;
									}
								}
							}
						}
						return 0;
					} else {
						return get.attitude(player, ui.selected.targets[0]) > 0 ? -1 : 1;
					}
				},
			},
			expose: 0.2,
			threaten: 1.5,
		},
	},
	qiangyun: {
		trigger: { player: "loseEnd" },
		frequent: true,
		filter(event, player) {
			if (player.countCards("h")) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original === "h") {
					return true;
				}
			}
			return false;
		},
		content() {
			player.draw(2);
		},
		ai: {
			noh: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "noh") {
					return player.countCards("h") === 1;
				}
			},
			effect: {
				player_use(card, player, target) {
					if (player.countCards("h") === 1) {
						return [1, 0.8];
					}
				},
				target(card, player, target) {
					if (get.tag(card, "loseCard") && target.countCards("h") === 1) {
						return 0.5;
					}
				},
			},
		},
	},
	cike: {
		trigger: { player: "shaBegin" },
		check(event, player) {
			return get.attitude(player, event.target) <= 0;
		},
		logTarget: "target",
		content() {
			"step 0";
			player.judge();
			"step 1";
			switch (result.color) {
				case "red":
					trigger.directHit = true;
					break;

				case "black":
					player.discardPlayerCard(trigger.target);
					break;

				default:
					break;
			}
		},
		ai: {
			threaten: 1.2,
		},
	},
	miaobix: {
		filterCard: true,
		selectCard: 1,
		popname: true,
	},
	miaobi: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target !== player && target.countCards("he") > 0;
		},
		content() {
			"step 0";
			player.discardPlayerCard(target, true);
			"step 1";
			if (result.bool) {
				var type = get.type(result.cards[0]);
				if (type !== "basic" && type !== "trick") {
					player.chooseToDiscard("he", true);
					event.finish();
				} else {
					event.card = result.cards[0];
				}
			} else {
				event.finish();
			}
			"step 2";
			var card = event.card;
			card = { name: card.name, nature: card.nature, suit: card.suit, number: card.number };
			if (lib.filter.cardEnabled(card)) {
				if (
					game.hasPlayer(function (current) {
						return player.canUse(card, current);
					})
				) {
					lib.skill.miaobix.viewAs = card;
					var next = player.chooseToUse();
					next.logSkill = "miaobi";
					next.set("openskilldialog", "妙笔：将一张手牌当" + get.translation(card) + "使用");
					next.set("norestore", true);
					next.set("_backupevent", "miaobix");
					next.set("custom", {
						add: {},
						replace: { window() {} },
					});
					next.backup("miaobix");
				}
			}
		},
		ai: {
			order: 9,
			result: {
				target: -1,
			},
		},
	},
	zhexian: {
		trigger: { player: "loseEnd" },
		usable: 1,
		filter(event, player) {
			return _status.currentPhase !== player;
		},
		frequent: true,
		content() {
			player.draw();
		},
	},
	guifu: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player !== target && target.countCards("e");
		},
		async content(event, trigger, player) {
			const { target } = event;
			await player.discardPlayerCard(target, "e", true);
			await game.asyncDraw([player, target].sortBySeat());
		},
		ai: {
			order: 8,
			threaten: 1.5,
			result: {
				target: -1,
				player: 0.5,
			},
		},
	},
	lshengong: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.hasCard(card => !get.info(card)?.unique, "e");
		},
		check(card) {
			return 6 - get.value(card);
		},
		filterCard(card) {
			var info = lib.card[card.name];
			if (!info) {
				return false;
			}
			return !info.image && !info.fullimage;
		},
		discard: false,
		lose: false,
		async content(event, trigger, player) {
			const { target, cards } = event;
			let result;
			const next = player.choosePlayerCard(target, "e", true);
			next.ai = get.buttonValue;
			next.filterButton = button => {
				return !get.info(button.link)?.unique;
			};
			result = await next.forResult();
			if (!result?.bool || !result?.links?.length) {
				return;
			}
			const card = get.autoViewAs({ name: result.links[0].name }, cards);
			result = await player
				.chooseTarget(`神工：选择一个角色装备${get.translation(card)}（${get.translation(cards)}）`, (card, player, target) => {
					return target.canEquip(get.event("cardx"), true);
				})
				.set("ai", target => {
					const { player, cardx } = get.event();
					return get.equipValue(cardx, target) * get.attitude(player, target);
				})
				.set("cardx", card)
				.forResult();
			if (result?.targets?.length) {
				const [toequip] = result.targets;
				player.$give(card, result.targets[0]);
				await game.delay();
				await toequip.equip(card);
			}
		},
		ai: {
			order: 9,
			threaten: 1.5,
			result: {
				player(player) {
					if (player.countCards("e") < 3) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
};

export default skill;
