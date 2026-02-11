import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCharacterConfig['skill'] } */
const skill = {
	lingquan: {
		trigger: { player: "phaseEnd" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "water",
		unique: true,
		filter(event, player) {
			return game.roundNumber >= 3 && player.getHistory("useCard").length > player.hp;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.draw(3);
			player.addSkill("shuiyun");
			"step 1";
			if (lib.filter.filterTrigger(trigger, player, "phaseEnd", "shuiyun")) {
				game.createTrigger("phaseEnd", "shuiyun", player, trigger);
			}
		},
	},
	shenwu: {
		trigger: { global: "phaseEnd" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "water",
		unique: true,
		filter(event, player) {
			return player.storage.shuiyun_count >= 3;
		},
		content() {
			player.awakenSkill(event.name);
			player.gainMaxHp();
			player.recover();
			player.addSkill("huimeng");
		},
	},
	qiongguang: {
		trigger: { player: "phaseDiscardEnd" },
		filter(event, player) {
			return event.cards && event.cards.length > 1;
		},
		content() {
			"step 0";
			event.targets = player.getEnemies().sortBySeat();
			"step 1";
			if (event.targets.length) {
				player.line(event.targets.shift().getDebuff(false).addExpose(0.1), "green");
				event.redo();
			}
			"step 2";
			game.delay();
		},
		ai: {
			threaten: 2,
			expose: 0.2,
			effect: {
				player_use(card, player) {
					if (_status.currentPhase !== player) {
						return;
					}
					if (_status.event.name !== "chooseToUse" || _status.event.player !== player) {
						return;
					}
					var num = player.needsToDiscard();
					if (num > 2 || num === 1) {
						return;
					}
					if (get.type(card) === "basic" && num !== 2) {
						return;
					}
					if (get.tag(card, "gain")) {
						return;
					}
					if (get.value(card, player, "raw") >= 7) {
						return;
					}
					if (player.hp <= 2) {
						return;
					}
					if (!player.hasSkill("jilue") || player.storage.renjie === 0) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	txianqu: {
		trigger: { source: "damageBefore" },
		logTarget: "player",
		filter(event, player) {
			if (player.hasSkill("txianqu2")) {
				return false;
			}
			var evt = event.getParent("phaseUse");
			if (evt && evt.player === player) {
				return true;
			}
			return false;
		},
		check(event, player) {
			var target = event.player;
			if (get.attitude(player, target) >= 0 || get.damageEffect(target, player, player) <= 0) {
				return true;
			}
			if (target.hp > player.hp && player.isDamaged()) {
				return true;
			}
			return false;
		},
		content() {
			trigger.cancel();
			player.draw(2);
			player.recover();
			player.addTempSkill("txianqu2");
		},
		ai: {
			jueqing: true,
			skillTagFilter(player, tag, arg) {
				if (!arg) {
					return false;
				}
				if (player.hasSkill("txianqu2")) {
					return false;
				}
				if (get.attitude(player, arg) > 0) {
					return false;
				}
				var evt = _status.event.getParent("phaseUse");
				if (evt && evt.player === player) {
					return true;
				}
				return false;
			},
			effect: {
				player(card, player, target) {
					if (get.tag(card, "damage") && get.attitude(player, target) > 0) {
						if (player.hp === player.maxHp || get.recoverEffect(player, player, player) <= 0) {
							return "zeroplayertarget";
						}
						return [0, 0, 0, 0.5];
					}
				},
			},
		},
	},
	txianqu2: {},
	xunying: {
		trigger: { player: "shaAfter" },
		direct: true,
		filter(event, player) {
			return player.canUse("sha", event.target) && player.hasSha() && event.target.isIn();
		},
		content() {
			"step 0";
			if (player.hasSkill("jiu")) {
				player.removeSkill("jiu");
				event.jiu = true;
			}
			player.chooseToUse(get.prompt("xunying"), { name: "sha" }, trigger.target, -1).logSkill = "xunying";
			"step 1";
			if (!result.bool && event.jiu) {
				player.addSkill("jiu");
			}
		},
	},
	liefeng: {
		trigger: { player: "useCard" },
		forced: true,
		popup: false,
		filter(event, player) {
			return _status.currentPhase === player && [2, 3, 4].includes(player.countUsed());
		},
		content() {
			var skill;
			switch (player.countUsed()) {
				case 2:
					skill = "yanzhan";
					break;
				case 3:
					skill = "tianjian";
					break;
				case 4:
					skill = "xjyufeng";
					break;
			}
			if (skill && !player.hasSkill(skill)) {
				player.addTempSkill(skill);
				player.popup(skill);
				game.log(player, "获得了", "【" + get.translation(skill) + "】");
				if (skill === "xjyufeng") {
					var nh = player.countCards("h");
					if (nh < 2) {
						player.draw(2 - nh);
						player.addSkill("counttrigger");
						if (!player.storage.counttrigger) {
							player.storage.counttrigger = {};
						}
						player.storage.counttrigger.xjyufeng = 1;
					}
				}
			}
		},
		ai: {
			effect: {
				player_use(card, player) {
					if (_status.currentPhase !== player) {
						return;
					}
					if (get.type(card) === "basic") {
						return;
					}
					if (get.tag(card, "gain")) {
						return;
					}
					if (get.value(card, player, "raw") >= 7) {
						return;
					}
					if (player.hp <= 2) {
						return;
					}
					if (player.needsToDiscard()) {
						return;
					}
					if (player.countUsed() >= 2) {
						return;
					}
					return "zeroplayertarget";
				},
			},
		},
	},
	yuexing: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target !== player;
		},
		content() {
			player.storage.yuexing2 = target;
			player.addTempSkill("yuexing2", "phaseUseAfter");
			target.storage.yuexing2 = player;
			target.addTempSkill("yuexing2", "phaseUseAfter");
		},
		ai: {
			order() {
				var player = _status.event.player;
				if (player.hasSkill("minsha")) {
					return 6.5;
				}
				return 2;
			},
			result: {
				target(player, target) {
					if (player.hasSkill("minsha") && player.countCards("he") >= 3 && target.hp > 1 && get.damageEffect(target, player, player, "thunder") > 0) {
						var num1 = game.countPlayer(function (current) {
							if (get.distance(target, current) <= 1 && current !== player && current !== target) {
								return -get.sgn(get.attitude(player, current));
							}
						});
						var num2 = game.countPlayer(function (current) {
							if (get.distance(player, current) <= 1 && current !== player && current !== target) {
								return -get.sgn(get.attitude(player, current));
							}
						});
						if (num2 >= num1) {
							return 0;
						}
						return 2 * (num2 - num1);
					}
					return -_status.event.getRand();
				},
			},
		},
	},
	yuexing2: {
		mark: "character",
		intro: {
			content: "到其他角色的距离基数与$交换",
		},
		onremove: true,
		mod: {
			globalFrom(from, to, distance) {
				if (from.storage.yuexing2) {
					var dist1 = get.distance(from, to, "pure");
					var dist2 = get.distance(from.storage.yuexing2, to, "pure");
					return distance - dist1 + dist2;
				}
			},
		},
	},
	minsha: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: 2,
		position: "he",
		filter(event, player) {
			return player.countCards("he") >= 2;
		},
		filterTarget(card, player, target) {
			return target !== player && target.hp > 1;
		},
		line: "thunder",
		check(card) {
			return 8 - get.value(card);
		},
		content() {
			"step 0";
			target.damage("thunder");
			"step 1";
			event.targets = game
				.filterPlayer(function (current) {
					return get.distance(target, current) <= 1 && current !== target && current !== player;
				})
				.sortBySeat(target);
			"step 2";
			if (event.targets.length) {
				event.targets.shift().randomDiscard(false);
				event.redo();
			}
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					if (get.damageEffect(target, player, player, "thunder") > 0) {
						if (target === player.storage.yuexing2) {
							return 10;
						}
						var num =
							1 +
							game.countPlayer(function (current) {
								if (get.distance(target, current) <= 1 && current !== player && current !== target) {
									return -get.sgn(get.attitude(player, current));
								}
							});
						if (target.hp === 1) {
							num += 2;
						}
						if (target.hp < player.hp) {
							num += 0.5;
						}
						if (player.needsToDiscard()) {
							num += 0.1;
						}
						return num;
					}
				},
			},
		},
	},
	lingdi: {
		enable: "phaseUse",
		filter(event, player) {
			var num = 1 + (player.getStat().skill.lingdi || 0);
			if (
				game.hasPlayer(function (current) {
					return current !== player && Math.max(1, get.distance(player, current)) === num;
				})
			) {
				var hs = player.getCards("h");
				var suits = player.storage.lingdi || [];
				for (var i = 0; i < hs.length; i++) {
					if (!suits.includes(get.suit(hs[i]))) {
						return true;
					}
				}
			}
			return false;
		},
		filterTarget(card, player, target) {
			return target !== player && Math.max(1, get.distance(player, target)) === 1 + (player.getStat().skill.lingdi || 0);
		},
		filterCard(card, player) {
			return !(player.storage.lingdi || []).includes(get.suit(card));
		},
		check(card) {
			return 8 - get.value(card);
		},
		content() {
			game.asyncDraw([player, target]);
			if (!player.storage.lingdi) {
				player.storage.lingdi = [];
			}
			player.storage.lingdi.add(get.suit(cards[0]));
		},
		ai: {
			threaten: 1.2,
			order: 7,
			result: {
				target: 1,
			},
		},
		group: "lingdi_clear",
		subSkill: {
			clear: {
				trigger: { player: "phaseAfter" },
				silent: true,
				content() {
					delete player.storage.lingdi;
				},
			},
		},
	},
	xiaoyue: {
		trigger: { global: "roundStart" },
		forced: true,
		filter(event, player) {
			return player.countCards("h", "sha");
		},
		content() {
			var card = player.getCards("h", "sha").randomGet();
			var target = player.getEnemies().randomGet();
			if (card && target) {
				target.addExpose(0.1);
				player.useCard(card, target, false);
				player.changeHujia();
			}
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (_status.currentPhase !== player) {
						return;
					}
					if (card.name === "sha" && get.itemtype(card) === "card" && !player.needsToDiscard() && target.hp > 1 && player.countCards("h", "sha") === 1) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	xiaoyue2: {
		mod: {
			cardRespondable(card, player) {
				if (_status.event.getParent(4).name === "xiaoyue" && get.suit(card) !== "heart") {
					return false;
				}
			},
		},
	},
	huanlei: {
		trigger: { player: "damageEnd" },
		check(event, player) {
			return get.damageEffect(event.source, player, player, "thunder") > 0;
		},
		filter(event, player) {
			return event.source && event.source.isIn() && event.source.hp > player.hp;
		},
		logTarget: "source",
		content() {
			"step 0";
			trigger.source.damage("thunder");
			"step 1";
			trigger.source.draw();
		},
	},
	anwugu: {
		trigger: { source: "damageEnd" },
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.player !== player && event.player.isIn() && !event.player.hasSkill("anwugu2");
		},
		logTarget: "player",
		content() {
			trigger.player.addSkill("anwugu2");
		},
	},
	anwugu2: {
		mod: {
			cardEnabled(card, player) {
				if (_status.currentPhase !== player) {
					return;
				}
				if (player.countUsed() >= player.storage.anwugu2) {
					return false;
				}
			},
			maxHandcard(player, num) {
				return num - 1;
			},
		},
		mark: true,
		intro: {
			content: "手牌上限-1，每回合最多使用$张牌（剩余$回合）",
		},
		init(player) {
			player.storage.anwugu2 = 3;
		},
		trigger: { player: "phaseAfter" },
		silent: true,
		onremove: true,
		content() {
			player.storage.anwugu2--;
			if (player.storage.anwugu2 <= 0) {
				player.removeSkill("anwugu2");
			} else {
				player.updateMarks();
			}
		},
	},
	xtanxi: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		check(card) {
			var enemies = _status.event.player.getEnemies();
			var num1 = 0,
				num2 = 0;
			for (var i = 0; i < enemies.length; i++) {
				if (enemies[i].countCards("h", "sha")) {
					num1++;
				}
				if (enemies[i].countCards("h", "shan")) {
					num2++;
				}
				if (enemies[i].countCards("h") >= 3) {
					num1 += 0.5;
					num2 += 0.5;
				}
			}
			var rand = _status.event.getRand();
			if (num1 >= 1 && num2 >= 1) {
				if (card.name === "shan") {
					return (rand += 0.4);
				}
				if (card.name === "sha") {
					return rand;
				}
			} else if (num1 >= 1) {
				if (card.name === "sha") {
					return rand;
				}
			} else if (num2 >= 1) {
				if (card.name === "shan") {
					return rand;
				}
			}
			return 0;
		},
		content() {
			player.addExpose(0.1);
			var targets = player.getEnemies();
			for (var i = 0; i < targets.length; i++) {
				if (!targets[i].countCards("h", cards[0].name)) {
					targets.splice(i--, 1);
				}
			}
			if (targets.length) {
				var target = targets.randomGet();
				player.line(target, "green");
				target.addExpose(0.1);
				player.gainPlayerCard(target, "h", "visible");
			}
		},
		ai: {
			order: 4,
			result: {
				player: 1,
			},
		},
	},
	linghuo: {
		round: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return event.player.getStat("damage") && event.player !== player;
		},
		check(event, player) {
			return get.damageEffect(event.player, player, player, "fire") > 0;
		},
		logTarget: "player",
		line: "fire",
		ai: {
			expose: 0.2,
			threaten: 1.3,
		},
		content() {
			trigger.player.damage("fire");
		},
	},
	guijin: {
		round: 3,
		enable: "phaseUse",
		delay: 0,
		content() {
			"step 0";
			event.cards = get.cards(4);
			"step 1";
			if (event.cards.length) {
				var more = false,
					remain = false,
					nomore = false;
				if (event.cards.length >= 3) {
					for (var i = 0; i < event.cards.length; i++) {
						var value = get.value(event.cards[i], player, "raw");
						if (value >= 8) {
							more = true;
						}
						if (event.cards.length >= 4 && value < 6) {
							if (remain === false) {
								remain = value;
							} else {
								remain = Math.min(remain, value);
							}
						}
					}
				}
				if (remain === false) {
					remain = 0;
				}
				if (
					!more &&
					!game.hasPlayer(function (current) {
						return get.attitude(player, current) < 0 && !current.skipList.includes("phaseDraw");
					})
				) {
					var num = 0;
					for (var i = 0; i < event.cards.length; i++) {
						num += Math.max(0, get.value(event.cards[i], player, "raw"));
					}
					if (num >= 12) {
						more = true;
					} else {
						nomore = true;
					}
				}
				player.chooseCardButton("归烬", event.cards, [1, event.cards.length]).ai = function (button) {
					if (nomore) {
						return 0;
					}
					if (more) {
						return get.value(button.link, player, "raw") - remain;
					} else {
						if (ui.selected.buttons.length) {
							return 0;
						}
						return 8 - get.value(button.link, player, "raw");
					}
				};
			} else {
				event.goto(4);
			}
			"step 2";
			if (result.bool) {
				for (var i = 0; i < result.links.length; i++) {
					event.cards.remove(result.links[i]);
				}
				event.togive = result.links.slice(0);
				player.chooseTarget("将" + get.translation(result.links) + "交给一名角色", true).ai = function (target) {
					var att = get.attitude(player, target) / Math.sqrt(target.countCards("h") + 1);
					if (result.links.length > 1) {
						if (target === player && target.needsToDiscard(result.links) > 1) {
							return att / 5;
						}
						return att;
					} else {
						if (target.skipList.includes("phaseDraw")) {
							return att / 5;
						}
						return -att;
					}
				};
			} else {
				event.goto(4);
			}
			"step 3";
			if (result.targets.length) {
				result.targets[0].gain(event.togive, "draw");
				result.targets[0].skip("phaseDraw");
				result.targets[0].addTempSkill("guijin2", { player: "phaseBegin" });
				game.log(result.targets[0], "获得了" + get.cnNumber(event.togive.length) + "张", "#g“归烬”牌");
				player.line(result.targets[0], "green");
				event.goto(1);
			}
			"step 4";
			while (event.cards.length) {
				ui.cardPile.insertBefore(event.cards.pop(), ui.cardPile.firstChild);
			}
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					if (game.roundNumber === 1 && player.hasUnknown()) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	guijin2: {
		mark: true,
		intro: {
			content: "跳过下一个摸牌阶段",
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name === "bingliang" || card.name === "caomu") {
						return [0, 0];
					}
				},
			},
		},
	},
	chengxin: {
		round: 4,
		enable: "chooseToUse",
		filter(event, player) {
			return event.type === "dying";
		},
		filterTarget(card, player, target) {
			return target === _status.event.dying;
		},
		selectTarget: -1,
		content() {
			target.recover(1 - target.hp);
			target.addTempSkill("chengxin2", { player: "phaseAfter" });
		},
		ai: {
			order: 6,
			threaten: 1.4,
			skillTagFilter(player) {
				if (4 - (game.roundNumber - player.storage.chengxin_roundcount) > 0) {
					return false;
				}
				if (!_status.event.dying) {
					return false;
				}
			},
			save: true,
			result: {
				target: 3,
			},
		},
	},
	chengxin2: {
		trigger: { player: "damageBefore" },
		mark: true,
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			nofire: true,
			nothunder: true,
			nodamage: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
		intro: {
			content: "防止一切伤害",
		},
	},
	tianwu: {
		trigger: { player: "useCardToBegin" },
		filter(event, player) {
			return event.targets && event.targets.length === 1 && player.getEnemies().includes(event.target);
		},
		frequent: true,
		content() {
			trigger.target.getDebuff();
			player.addTempSkill("tianwu2");
		},
	},
	tianwu2: {},
	shiying: {
		trigger: { global: "dieBefore" },
		limited: true,
		skillAnimation: "epic",
		animationColor: "water",
		unique: true,
		init(player) {
			player.storage.shiying = false;
		},
		mark: true,
		intro: {
			content: "limited",
		},
		check(event, player) {
			return get.attitude(player, event.player) >= 3;
		},
		filter(event, player) {
			return !player.storage.shiying && event.player !== player;
		},
		logTarget: "player",
		content() {
			"step 0";
			trigger.cancel();
			player.awakenSkill(event.name);
			player.storage.shiying = true;

			player.maxHp = 3;
			player.hp = 3;
			trigger.player.maxHp = 3;
			trigger.player.hp = 3;

			player.clearSkills();
			trigger.player.clearSkills();
			"step 1";
			var hs = player.getCards("hej");
			player.$throw(hs);
			player.lose(player.getCards("hej"))._triggered = null;
			"step 2";
			var hs = trigger.player.getCards("hej");
			trigger.player.$throw(hs);
			trigger.player.lose(trigger.player.getCards("hej"))._triggered = null;
			"step 3";
			game.asyncDraw([player, trigger.player], 3);
		},
		ai: {
			threaten: 1.5,
		},
	},
	liguang: {
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			if (!player.canMoveCard()) {
				return false;
			}
			if (
				!game.hasPlayer(function (current) {
					return current.countCards("ej");
				})
			) {
				return false;
			}
			return player.countCards("h") > 0;
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt("liguang"), "弃置一张手牌并移动场上的一张牌", lib.filter.cardDiscardable)
				.set("ai", function (card) {
					if (!_status.event.check) {
						return 0;
					}
					return 7 - get.useful(card);
				})
				.set("check", player.canMoveCard(true))
				.set("logSkill", "liguang");
			"step 1";
			if (result.bool) {
				player.moveCard(true);
			} else {
				event.finish();
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.3,
		},
	},
	xiepan: {
		trigger: { player: "loseEnd" },
		direct: true,
		filter(event, player) {
			if (player.countCards("h", { type: "basic" })) {
				return false;
			}
			if (!player.countCards("h")) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original === "h" && get.type(event.cards[i]) === "basic") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			player.chooseToDiscard("h", get.prompt("xiepan")).set("prompt2", "弃置一张手牌并获一件随机装备").set("logSkill", "xiepan").ai = function (card) {
				return 8 - get.value(card);
			};
			"step 1";
			if (result.bool) {
				player.gain(game.createCard(get.inpile("equip").randomGet()), "draw");
			}
		},
	},
	yujia: {
		trigger: { player: "useCardAfter" },
		frequent: true,
		filter(event) {
			return get.type(event.card) === "equip" && lib.inpile.includes(event.card.name);
		},
		init(player) {
			player.storage.yujia = 0;
		},
		content() {
			"step 0";
			if (!player.storage.yujia) {
				player.storage.yujia = [];
			}
			var list = [];
			for (var i in lib.card) {
				if (lib.card[i].type === "jiguan") {
					list.push(i);
				}
			}
			if (list.length) {
				if (player.storage.yujia > 1) {
					list = list.randomGets(player.storage.yujia);
					for (var i = 0; i < list.length; i++) {
						list[i] = ["机关", "", list[i]];
					}
					player.chooseButton(true, ["御甲：选择一张机关牌获得之", [list, "vcard"]]).ai = function (button) {
						if (player.hasSkill("jiguanyaoshu_skill") && button.link[2] === "jiguanyaoshu") {
							return 0;
						}
						return get.value({ name: button.link[2] });
					};
				} else {
					var name = list.randomGet();
					player.gain(game.createCard(name), "draw");
					event.finish();
				}
			}
			"step 1";
			if (result.bool && result.links && result.links.length) {
				var list = [];
				for (var i = 0; i < result.links.length; i++) {
					list.push(game.createCard(result.links[i][2]));
				}
				player.gain(list, "draw");
			}
		},
		group: "yujia_count",
		subSkill: {
			count: {
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return get.type(event.card) === "jiguan";
				},
				silent: true,
				content() {
					player.storage.yujia++;
				},
			},
		},
		ai: {
			reverseEquip: true,
			threaten: 1.5,
			effect: {
				target_use(card, player, target, current) {
					if (get.type(card) === "equip") {
						return [1, 3];
					}
				},
			},
		},
	},
	yanshi: {
		trigger: { player: "phaseAfter" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		init(player) {
			player.storage.yanshi = 0;
		},
		filter(event, player) {
			return player.storage.yanshi === 4;
		},
		intro: {
			content: "累计#个回合使用过机关牌",
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.gainMaxHp();
			"step 1";
			player.recover();
			var list = [];
			for (var i = 1; i <= 5; i++) {
				if (!player.getEquip(i)) {
					var name = get.inpile("equip" + i).randomGet();
					if (name) {
						var card = game.createCard(name);
						list.push(card);
						player.equip(card);
					}
				}
			}
			if (list.length) {
				player.$draw(list);
			}
		},
		group: "yanshi_count",
		subSkill: {
			count: {
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return get.type(event.card) === "jiguan" && !player.hasSkill("yanshi2");
				},
				silent: true,
				content() {
					player.storage.yanshi++;
					if (player.hasSkill("yanshi")) {
						player.markSkill("yanshi");
						player.updateMarks();
					}
					player.addTempSkill("yanshi2");
				},
			},
		},
	},
	yanshi2: {},
	tanhua: {
		trigger: { player: "recoverBefore" },
		forced: true,
		filter(event, player) {
			return player.hp > 0 && event.num > 0;
		},
		content() {
			trigger.cancel();
			player.draw(2 * trigger.num);
		},
		group: "tanhua_remove",
		subSkill: {
			remove: {
				trigger: { player: "dying" },
				priority: 10,
				forced: true,
				content() {
					player.recover();
					player.removeSkill("tanhua");
				},
			},
		},
	},
	xjyingfeng: {
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (event.card.name !== "sha") {
				return false;
			}
			if (event.parent.name === "xjyingfeng") {
				return false;
			}
			var enemies = player.getEnemies();
			return game.hasPlayer(function (current) {
				return enemies.includes(current) && !event.targets.includes(current) && player.canUse("sha", current, false);
			});
		},
		forced: true,
		content() {
			var enemies = player.getEnemies();
			enemies.remove(trigger.targets);
			if (enemies.length) {
				player.useCard({ name: "sha" }, enemies.randomGet().addExpose(0.2));
			}
		},
	},
	ywuhun: {
		trigger: { player: "phaseBefore" },
		forced: true,
		filter(event) {
			return event.parent.name !== "ywuhun";
		},
		intro: {
			content: "回合结束后，场上及牌堆中的牌将恢复到回合前的状态",
		},
		video(player, data) {
			for (var i in data) {
				var current = game.playerMap[i];
				current.node.handcards1.innerHTML = "";
				current.node.handcards2.innerHTML = "";
				current.node.equips.innerHTML = "";
				current.node.judges.innerHTML = "";
				current.directgain(get.infoCards(data[i].h));
				var es = get.infoCards(data[i].e);
				for (var j = 0; j < es.length; j++) {
					current.$equip(es[j]);
				}
				var js = get.infoCards(data[i].j);
				for (var j = 0; j < js.length; j++) {
					current.node.judges.appendChild(js[j]);
				}
			}
		},
		content() {
			"step 0";
			var handcards1, handcards2, judges, equips, viewAs, i, j;
			event.data = [];
			event.cardPile = [];

			for (i = 0; i < game.players.length; i++) {
				viewAs = [];
				handcards1 = [];
				handcards2 = [];
				judges = [];
				equips = [];

				for (j = 0; j < game.players[i].node.handcards1.childNodes.length; j++) {
					handcards1.push(game.players[i].node.handcards1.childNodes[j]);
				}

				for (j = 0; j < game.players[i].node.handcards2.childNodes.length; j++) {
					handcards2.push(game.players[i].node.handcards2.childNodes[j]);
				}

				for (j = 0; j < game.players[i].node.judges.childNodes.length; j++) {
					viewAs.push(game.players[i].node.judges.childNodes[j].viewAs);
					judges.push(game.players[i].node.judges.childNodes[j]);
				}

				for (j = 0; j < game.players[i].node.equips.childNodes.length; j++) {
					equips.push(game.players[i].node.equips.childNodes[j]);
				}

				event.data.push({
					player: game.players[i],
					handcards1: handcards1,
					handcards2: handcards2,
					judges: judges,
					equips: equips,
					viewAs: viewAs,
					value: handcards1.length + handcards2.length + equips.length - judges.length,
				});
			}
			for (var i = 0; i < ui.cardPile.childElementCount; i++) {
				event.cardPile.push(ui.cardPile.childNodes[i]);
			}
			"step 1";
			player.markSkill("ywuhun");
			player.addSkill("ywuhun_end");
			player.phase("ywuhun");
			"step 2";
			player.removeSkill("ywuhun_end");
			game.delay(0.5);
			"step 3";
			game.animate.window(1);
			"step 4";
			player.unmarkSkill("ywuhun");
			var storage = event.data;
			for (var i = 0; i < storage.length; i++) {
				var current = storage[i].player;
				if (current.isAlive()) {
					current.removeEquipTrigger();
					var cards = current.getCards("hej");
					for (var j = 0; j < cards.length; j++) {
						cards[j].discard();
					}
				}
			}
			"step 5";
			var storage = event.data;
			var current;
			var i, j;
			for (i = 0; i < storage.length; i++) {
				current = storage[i].player;
				if (current.isAlive()) {
					for (j = 0; j < storage[i].handcards1.length; j++) {
						if (storage[i].handcards1[j].parentNode === ui.discardPile || storage[i].handcards1[j].parentNode === ui.cardPile) {
							current.node.handcards1.appendChild(storage[i].handcards1[j]);
						} else {
							current.node.handcards1.appendChild(game.createCard(storage[i].handcards1[j]));
						}
					}
					for (j = 0; j < storage[i].handcards2.length; j++) {
						if (storage[i].handcards2[j].parentNode === ui.discardPile || storage[i].handcards2[j].parentNode === ui.cardPile) {
							current.node.handcards2.appendChild(storage[i].handcards2[j]);
						} else {
							current.node.handcards2.appendChild(game.createCard(storage[i].handcards2[j]));
						}
					}
					for (j = 0; j < storage[i].equips.length; j++) {
						if (storage[i].equips[j].parentNode === ui.discardPile || storage[i].equips[j].parentNode === ui.cardPile) {
							storage[i].equips[j].style.transform = "";
							current.$equip(storage[i].equips[j]);
						} else {
							current.$equip(game.createCard(storage[i].equips[j]));
						}
					}
					for (j = 0; j < storage[i].judges.length; j++) {
						if (storage[i].judges[j].parentNode === ui.discardPile || storage[i].judges[j].parentNode === ui.cardPile) {
							storage[i].judges[j].style.transform = "";
							storage[i].judges[j].viewAs = storage[i].viewAs[j];
							if (storage[i].judges[j].viewAs && storage[i].judges[j].viewAs !== storage[i].judges[j].name && storage[i].judges[j].classList.contains("fullskin")) {
								storage[i].judges[j].classList.add("fakejudge");
								storage[i].judges[j].node.background.innerHTML = lib.translate[storage[i].judges[j].viewAs + "_bg"] || get.translation(storage[i].judges[j].viewAs)[0];
							}
							current.node.judges.appendChild(storage[i].judges[j]);
						}
					}
					current.update();
				}
			}
			var data = {};
			for (var i = 0; i < game.players.length; i++) {
				data[game.players[i].dataset.position] = {
					h: get.cardsInfo(game.players[i].getCards("h")),
					e: get.cardsInfo(game.players[i].getCards("e")),
					j: get.cardsInfo(game.players[i].getCards("j")),
				};
			}
			game.addVideo("skill", event.player, ["ywuhun", data]);
			game.animate.window(2);
			while (ui.cardPile.childElementCount) {
				ui.cardPile.firstChild.discard();
			}
			for (var i = 0; i < event.cardPile.length; i++) {
				if (event.cardPile[i].parentNode === ui.discardPile) {
					ui.cardPile.appendChild(event.cardPile[i]);
				} else {
					ui.cardPile.appendChild(game.createCard(event.cardPile[i]));
				}
			}
			ui.updatehl();
		},
		subSkill: {
			end: {
				trigger: { source: "damageEnd" },
				priority: 9,
				silent: true,
				content() {
					var evt = _status.event.getParent("ywuhun");
					if (evt) {
						_status.event = evt;
						game.resetSkills();
					}
				},
				ai: {
					jueqing: true,
				},
			},
		},
	},
	fenglue: {
		trigger: { player: "phaseUseBefore" },
		direct: true,
		filter(event, player) {
			var hs = player.getCards("h");
			return game.hasPlayer(function (current) {
				if (current !== player) {
					for (var i = 0; i < hs.length; i++) {
						if (get.info(hs[i]).multitarget) {
							continue;
						}
						if (lib.filter.targetEnabled2(hs[i], player, current)) {
							return true;
						}
					}
				}
			});
		},
		content() {
			"step 0";
			var hs = player.getCards("h");
			player.chooseTarget(get.prompt("fenglue"), function (card, player, target) {
				if (player === target) {
					return false;
				}
				for (var i = 0; i < hs.length; i++) {
					if (get.info(hs[i]).multitarget) {
						continue;
					}
					if (lib.filter.targetEnabled2(hs[i], player, target)) {
						return true;
					}
				}
				return false;
			}).ai = function (target) {
				var use = [],
					eff = 0,
					damaged = false;
				for (var i = 0; i < hs.length; i++) {
					if (get.info(hs[i]).multitarget) {
						continue;
					}
					var hef;
					if (get.tag(hs[i], "damage") && damaged) {
						hef = -1;
					} else {
						hef = get.effect(target, hs[i], player, player);
					}
					if (lib.filter.targetEnabled2(hs[i], player, target) && hef > 0) {
						use.push(hs[i]);
						if (get.attitude(player, target) > 0) {
							hef /= 1.5;
							if (get.tag(hs[i], "damage")) {
								damaged = true;
							}
						}
						eff += hef;
					}
				}
				if (
					!player.needsToDiscard(0, (i, player) => {
						return !use.includes(i) && !player.canIgnoreHandcard(i);
					})
				) {
					return eff;
				}
				return 0;
			};
			"step 1";
			if (result.bool) {
				event.target = result.targets[0];
				var num = 0;
				player.chooseCard([1, Infinity], "按顺序选择对" + get.translation(result.targets) + "使用的牌", function (card) {
					return lib.filter.targetEnabled2(card, player, event.target);
				}).ai = function (card) {
					if (get.effect(event.target, card, player, player) > 0) {
						if (get.attitude(player, event.target) > 0 && get.tag(card, "damage")) {
							for (var i = 0; i < ui.selected.cards.length; i++) {
								if (get.tag(ui.selected.cards[i], "damage")) {
									return 0;
								}
							}
						}
						return get.order(card);
					}
					return 0;
				};
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.logSkill("fenglue", event.target);
				player.addSkill("fenglue_draw");
				player.storage.fenglue_draw_num = 0;
				player.storage.fenglue_draw = event.target;
				trigger.cancel();
				event.cards = result.cards.slice(0);
				player.lose(event.cards, ui.special);
			} else {
				event.finish();
			}
			"step 3";
			if (event.cards.length) {
				if (event.target.isIn()) {
					player.useCard(event.cards.shift(), event.target);
				} else {
					event.cards.shift().discard();
				}
				event.redo();
			}
			"step 4";
			if (player.storage.fenglue_draw_num) {
				player.draw(player.storage.fenglue_draw_num);
			}
			player.removeSkill("fenglue_draw");
			delete player.storage.fenglue_draw;
			delete player.storage.fenglue_draw_num;
		},
		subSkill: {
			draw: {
				trigger: { global: "damageEnd" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.player === player.storage.fenglue_draw;
				},
				content() {
					player.storage.fenglue_draw_num++;
				},
			},
		},
		ai: {
			threaten: 1.3,
		},
	},
	xjzongyu: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { color: "black" },
		filter(event, player) {
			return player.countCards("he", { color: "black" });
		},
		check(card) {
			return 8 - get.value(card);
		},
		content() {
			var list = player.getEnemies();
			if (list.length) {
				player.useCard({ name: "feibiao" }, list.randomGets(2));
			}
		},
		ai: {
			threaten: 1.5,
			order: 6,
			result: {
				player: 1,
			},
		},
	},
	fanling: {
		trigger: { global: "loseHpAfter" },
		forced: true,
		usable: 1,
		filter(event, player) {
			return event.player !== player && player.isDamaged();
		},
		content() {
			player.recover();
		},
		ai: {
			threaten: 1.5,
		},
	},
	dujiang: {
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filterCard: { color: "black" },
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			var list = player.getEnemies();
			if (list.length) {
				var target = list.randomGet();
				player.line(target, "green");
				target.gain(game.createCard("du"), "gain2");
			}
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
			threaten: 1.5,
		},
	},
	sheying: {
		trigger: { source: "damageAfter" },
		filter(event, player) {
			return get.itemtype(event.cards) === "cards" && get.position(event.cards[0]) === "d";
		},
		usable: 1,
		prompt2(event) {
			return "进行一次判定，若结果为黑色，你获得" + get.translation(event.cards);
		},
		content() {
			"step 0";
			player.judge(function (card) {
				return get.color(card) === "black" ? 1 : -1;
			});
			"step 1";
			if (result.color === "black") {
				player.gain(trigger.cards);
				player.$gain2(trigger.cards);
			}
		},
	},
	huahu: {
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		filterTarget(card, player, target) {
			return target !== player;
		},
		selectTarget: [1, Infinity],
		contentBefore() {
			player.awakenSkill(event.name);
			player.storage.huahu = true;
			player.loseMaxHp(true);
			player.clearSkills();
		},
		content() {
			target.recover();
			target.changeHujia();
			target.draw(false);
			target.$draw();
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (player.hasUnknown()) {
						return 0;
					}
					var num = 0;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (get.attitude(player, players[i]) > 2 && get.recoverEffect(players[i], player, player) > 0) {
							if (players[i].hp === 1) {
								if (player.hp < player.maxHp) {
									return 1;
								} else {
									num += 2;
								}
							} else if (players[i].hp <= 2) {
								num++;
							}
						}
					}
					if (num >= 3) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	binxin: {
		trigger: { global: "phaseEnd" },
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		filter(event, player) {
			return event.player.hp === 1;
		},
		logTarget: "player",
		content() {
			trigger.player.changeHujia();
		},
		ai: {
			expose: 0.1,
		},
	},
	qixia: {
		trigger: { player: ["useCardAfter", "respondAfter"] },
		silent: true,
		init(player) {
			player.storage.qixia = [];
		},
		intro: {
			content(storage) {
				if (!storage.length) {
					return "未使用或打出过有花色的牌";
				} else {
					var str = "已使用过" + get.translation(storage[0] + "2");
					for (var i = 1; i < storage.length; i++) {
						str += "、" + get.translation(storage[i] + "2");
					}
					str += "牌";
					return str;
				}
			},
		},
		content() {
			var suit = get.suit(trigger.card);
			if (suit) {
				player.storage.qixia.add(suit);
				player.syncStorage("qixia");
				player.markSkill("qixia");
			}
		},
		group: "qixia_phase",
		subSkill: {
			phase: {
				trigger: { global: "phaseAfter" },
				priority: -50,
				forced: true,
				filter(event, player) {
					return player.storage.qixia.length >= 4;
				},
				content() {
					player.insertPhase();
					player.storage.qixia.length = 0;
					player.syncStorage("qixia");
					player.unmarkSkill("qixia");
				},
			},
		},
	},
	qixia2: {},
	jianzhen: {
		trigger: { player: "shaAfter" },
		forced: true,
		filter(event, player) {
			return (
				event.target.isIn() &&
				game.hasPlayer(function (current) {
					return current.canUse("sha", event.target, false) && current !== player;
				})
			);
		},
		content() {
			"step 0";
			event.targets = game.filterPlayer(function (current) {
				return current.canUse("sha", trigger.target, false) && current !== player;
			});
			event.targets.sortBySeat(trigger.player);
			"step 1";
			if (event.targets.length) {
				event.current = event.targets.shift();
				if (event.current.hasSha()) {
					event.current.chooseToUse({ name: "sha" }, "是否对" + get.translation(trigger.target) + "使用一张杀？", trigger.target, -1);
				} else {
					event.redo();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (!result.bool) {
				event.goto(1);
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.4,
		},
	},
	husha: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			if (player.storage.husha === 1) {
				return game.hasPlayer(function (current) {
					return player.canUse("sha", current, false);
				});
			} else {
				return player.storage.husha > 0;
			}
		},
		content() {
			"step 0";
			var list = [];
			if (
				game.hasPlayer(function (current) {
					return player.canUse("sha", current, false);
				})
			) {
				list.push("移去1枚虎煞标记，视为使用一张【杀】");
			}
			if (player.storage.husha > 1) {
				list.push("移去2枚虎煞标记，视为使用一张【南蛮入侵】");
				if (player.storage.husha > 2 && lib.card.yuansuhuimie) {
					list.push("移去3枚虎煞标记，视为对除你之外的角色使用一张【元素毁灭】");
				}
			}
			player
				.chooseControl("cancel2", function () {
					if (player.storage.husha > 2 && _status.event.controls.includes("选项三")) {
						var num1 = game.countPlayer(function (current) {
							if (current !== player && player.canUse("yuansuhuimie", current)) {
								return get.sgn(get.effect(current, { name: "yuansuhuimie" }, player, player));
							}
						});
						var num2 = game.countPlayer(function (current) {
							if (current !== player && player.canUse("yuansuhuimie", current)) {
								return get.effect(current, { name: "yuansuhuimie" }, player, player);
							}
						});
						if (num1 > 0 && num2 > 0) {
							return "选项三";
						}
					}
					if (player.storage.husha > 1) {
						var num = game.countPlayer(function (current) {
							if (current !== player && player.canUse("nanman", current)) {
								return get.sgn(get.effect(current, { name: "nanman" }, player, player));
							}
						});
						if (num > 0) {
							return "选项二";
						}
					}
					if (
						game.hasPlayer(function (current) {
							return player.canUse("sha", current, false) && get.effect(current, { name: "sha" }, player, player) > 0;
						})
					) {
						return "选项一";
					}
					return "cancel2";
				})
				.set("prompt", get.prompt("husha"))
				.set("choiceList", list);
			"step 1";
			if (result.control !== "cancel2") {
				player.logSkill("husha");
				if (result.control === "选项一") {
					event.sha = true;
					player.storage.husha--;
					player.chooseTarget("选择出杀的目标", true, function (card, player, target) {
						return player.canUse("sha", target, false);
					}).ai = function (target) {
						return get.effect(target, { name: "sha" }, player, player);
					};
				} else if (result.control === "选项二") {
					var list = game.filterPlayer(function (current) {
						return player.canUse("nanman", current);
					});
					player.storage.husha -= 2;
					list.sortBySeat();
					player.useCard({ name: "nanman" }, list);
				} else {
					var list = game.filterPlayer(function (current) {
						return player.canUse("yuansuhuimie", current);
					});
					player.storage.husha -= 3;
					list.remove(player);
					list.sortBySeat();
					player.useCard({ name: "yuansuhuimie" }, list);
				}
				if (!player.storage.husha) {
					player.unmarkSkill("husha");
				} else {
					player.syncStorage("husha");
					player.updateMarks();
				}
			}
			"step 2";
			if (event.sha && result.targets && result.targets.length) {
				player.useCard({ name: "sha" }, result.targets[0]);
			}
		},
		init(player) {
			player.storage.husha = 0;
		},
		intro: {
			content: "mark",
		},
		group: "husha_count",
		subSkill: {
			count: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter(event, player) {
					if (player.storage.husha < 3) {
						var evt = event.getParent("phaseUse");
						return evt && evt.player === player;
					}
					return false;
				},
				content() {
					player.storage.husha += trigger.num;
					if (player.storage.husha > 3) {
						player.storage.husha = 3;
					}
					player.markSkill("husha");
					player.syncStorage("husha");
					player.updateMarks();
				},
			},
		},
	},
	fenshi: {
		skillAnimation: true,
		animationColor: "fire",
		trigger: { player: "dyingAfter" },
		forced: true,
		juexingji: true,
		derivation: "longhuo",
		content() {
			player.awakenSkill(event.name);
			player.changeHujia(2);
			player.draw(2);
			player.addSkill("longhuo");
		},
	},
	longhuo: {
		unique: true,
		trigger: { player: "phaseEnd" },
		check(event, player) {
			if (player.hp === 1 && player.hujia === 0) {
				return false;
			}
			var num = game.countPlayer(function (current) {
				var eff = get.sgn(get.damageEffect(current, player, player, "fire"));
				if (current.hp === 1 && current.hujia === 0) {
					eff *= 1.5;
				}
				return eff;
			});
			return num > 0;
		},
		content() {
			"step 0";
			event.targets = get.players(lib.sort.seat);
			"step 1";
			if (event.targets.length) {
				var current = event.targets.shift();
				if (current.isIn()) {
					player.line(current, "fire");
					current.damage("fire");
					event.redo();
				}
			}
		},
	},
	yanzhan: {
		enable: "phaseUse",
		viewAs: { name: "sha", nature: "fire" },
		usable: 1,
		position: "he",
		viewAsFilter(player) {
			if (!player.countCards("he", { color: "red" })) {
				return false;
			}
		},
		filterCard: { color: "red" },
		check(card) {
			if (get.suit(card) === "heart") {
				return 7 - get.value(card);
			}
			return 5 - get.value(card);
		},
		onuse(result) {
			if (result.targets) {
				for (var i = 0; i < result.targets.length; i++) {
					result.targets[i].addTempSkill("yanzhan3");
				}
			}
		},
		group: "yanzhan2",
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.15;
			},
		},
	},
	yanzhan2: {
		trigger: { source: "damageEnd" },
		forced: true,
		popup: false,
		filter(event) {
			return event.parent.skill === "yanzhan";
		},
		content() {
			player.addTempSkill("yanzhan4");
		},
	},
	yanzhan3: {
		mod: {
			cardRespondable(card, player) {
				if (_status.event.parent.skill === "yanzhan" && get.suit(card) !== get.suit(_status.event.parent.cards[0])) {
					return false;
				}
			},
		},
	},
	yanzhan4: {
		mod: {
			cardUsable(card, player, num) {
				if (card.name === "sha") {
					return num + 1;
				}
			},
		},
	},
	xjyufeng: {
		trigger: { player: "loseEnd" },
		forced: true,
		usable: 2,
		filter(event, player) {
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original === "h") {
					return player.countCards("h") < 2;
				}
			}
			return false;
		},
		content() {
			player.draw(2 - player.countCards("h"));
		},
		ai: {
			noh: true,
			skillTagFilter(player, tag) {
				var nh = player.countCards("h");
				if (tag === "noh" && (nh > 2 || nh === 0)) {
					return false;
				}
			},
		},
	},
	feixia: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { color: "red" },
		position: "he",
		filter(event, player) {
			return player.countCards("he", { color: "red" }) > 0;
		},
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			var targets = player.getEnemies();
			if (targets.length) {
				var target = targets.randomGet();
				target.addExpose(0.2);
				player.useCard({ name: "sha" }, target, false);
			}
		},
		ai: {
			order: 2.9,
			result: {
				player: 1,
			},
		},
	},
	lueying: {
		trigger: { player: "shaBegin" },
		filter(event, player) {
			if (event.target.countCards("he") > 0) {
				return game.hasPlayer(function (current) {
					return current !== player && current !== event.target && current.countCards("he");
				});
			}
			return false;
		},
		logTarget: "target",
		usable: 1,
		content() {
			"step 0";
			var card = trigger.target.getCards("he").randomGet();
			player.gain(card, trigger.target);
			if (get.position(card) === "e") {
				trigger.target.$give(card, player);
			} else {
				trigger.target.$giveAuto(card, player);
			}
			"step 1";
			if (
				game.hasPlayer(function (current) {
					return current !== player && current !== trigger.target && current.countCards("he");
				})
			) {
				trigger.target.chooseTarget(
					function (card, player, target) {
						return target !== player && target !== _status.event.parent.player && target.countCards("he") > 0;
					},
					"选择一名角色并令" + get.translation(player) + "弃置其一张牌"
				).ai = function (target) {
					return -get.attitude(_status.event.player, target);
				};
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				trigger.target.line(result.targets[0], "green");
				player.discardPlayerCard(result.targets[0], true, "he");
			}
		},
		ai: {
			threaten: 1.5,
			expose: 0.2,
		},
	},
	tianjian: {
		enable: "phaseUse",
		viewAs: { name: "wanjian" },
		filterCard: { name: "sha" },
		filter(event, player) {
			return player.countCards("h", "sha") > 0;
		},
		usable: 1,
		group: "tianjian_discard",
		subSkill: {
			discard: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter(event) {
					if (event._notrigger.includes(event.player)) {
						return false;
					}
					return event.parent.skill === "tianjian" && event.player.countCards("he");
				},
				popup: false,
				content() {
					trigger.player.discard(trigger.player.getCards("he").randomGet());
				},
			},
		},
	},
	feng: {
		unique: true,
		init(player) {
			player.storage.feng = 0;
		},
		mark: true,
		intro: {
			content: "已累计摸#次牌",
		},
		trigger: { player: "drawBegin" },
		forced: true,
		popup: false,
		priority: 5,
		content() {
			if (player.storage.feng < 2) {
				player.storage.feng++;
			} else {
				trigger.num++;
				player.storage.feng = 0;
				player.logSkill("feng");
			}
			player.updateMarks();
		},
	},
	ya: {
		unique: true,
		init(player) {
			player.storage.ya = 0;
		},
		mark: true,
		intro: {
			content: "已累计受到#次伤害",
		},
		trigger: { player: "damageBegin" },
		filter(event, player) {
			if (player.storage.ya === 2) {
				return event.num > 0;
			}
			return true;
		},
		forced: true,
		popup: false,
		content() {
			if (player.storage.ya < 2) {
				player.storage.ya++;
			} else if (trigger.num > 0) {
				trigger.num--;
				player.storage.ya = 0;
				player.logSkill("ya");
			}
			player.updateMarks();
		},
	},
	song: {
		unique: true,
		init(player) {
			player.storage.song = 0;
		},
		mark: true,
		intro: {
			content: "已累计造成#次伤害",
		},
		trigger: { source: "damageBegin" },
		forced: true,
		popup: false,
		content() {
			if (player.storage.song < 2) {
				player.storage.song++;
			} else {
				trigger.num++;
				player.storage.song = 0;
				player.logSkill("song");
			}
			player.updateMarks();
		},
	},
	longxiang: {
		trigger: { player: "shaBegin" },
		filter(event, player) {
			return event.target.countCards("h") > player.countCards("h");
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		logTarget: "target",
		content() {
			var hs = trigger.target.getCards("h");
			trigger.target.discard(hs.randomGets(hs.length - player.countCards("h")));
		},
	},
	huxi: {
		enable: "chooseToUse",
		viewAs: { name: "sha", isCard: true },
		precontent() {
			"step 0";
			player.loseHp();
			"step 1";
			player.changeHujia();
		},
		filterCard() {
			return false;
		},
		selectCard: -1,
		prompt: "失去1点体力并获得1点护甲，视为使用一张杀",
		ai: {
			order() {
				var player = _status.event.player;
				if (player.hp <= 2) {
					return 0;
				}
				return 2;
			},
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") {
					return false;
				}
			},
			respondSha: true,
		},
	},
	xuanmo: {
		enable: "phaseUse",
		usable: 1,
		filterCard(card) {
			var type = get.type(card, "trick");
			return type === "basic" || type === "equip" || type === "trick";
		},
		check(card) {
			return 8 - get.value(card);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		discard: false,
		prepare: "throw",
		content() {
			game.log(player, "将", cards, "置于牌堆顶");
			ui.cardPile.insertBefore(cards[0], ui.cardPile.firstChild);
			var list = get.inpile(get.type(cards[0], "trick"), "trick").randomGets(2);
			for (var i = 0; i < list.length; i++) {
				list[i] = game.createCard(list[i]);
			}
			player.gain(list, "draw");
		},
		ai: {
			threaten: 1.5,
			order: 5,
			result: {
				player: 1,
			},
		},
	},
	danqing: {
		trigger: { player: "phaseEnd" },
		init(player) {
			player.storage.danqing = [];
		},
		mark: true,
		direct: true,
		intro: {
			content(storage) {
				if (!storage.length) {
					return "未使用或打出过有花色的牌";
				} else {
					var str = "已使用过" + get.translation(storage[0] + "2");
					for (var i = 1; i < storage.length; i++) {
						str += "、" + get.translation(storage[i] + "2");
					}
					str += "牌";
					return str;
				}
			},
		},
		filter(event, player) {
			return player.storage.danqing.length === 4;
		},
		ai: {
			threaten: 1.2,
		},
		content() {
			"step 0";
			player.storage.danqing.length = 0;
			player.updateMarks();
			player.chooseTarget(get.prompt("danqing"), [1, 4]).ai = function (target) {
				return get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("danqing", result.targets);
				for (var i = 0; i < result.targets.length; i++) {
					result.targets[i].getBuff(false);
				}
			} else {
				event.finish();
			}
			"step 2";
			game.delay();
		},
		group: "danqing_count",
	},
	danqing_count: {
		trigger: { player: "useCard" },
		silent: true,
		content() {
			var suit = get.suit(trigger.card);
			if (suit) {
				player.storage.danqing.add(suit);
				player.updateMarks();
			}
		},
	},
	sheling: {
		trigger: { global: ["useCardAfter", "respondAfter", "discardAfter"] },
		filter(event, player) {
			if (player !== _status.currentPhase || player === event.player) {
				return false;
			}
			if (event.cards) {
				for (var i = 0; i < event.cards.length; i++) {
					if (get.position(event.cards[i]) === "d") {
						return true;
					}
				}
			}
			return false;
		},
		frequent: "check",
		check(event) {
			for (var i = 0; i < event.cards.length; i++) {
				if (get.position(event.cards[i]) === "d" && event.cards[i].name === "du") {
					return false;
				}
			}
			return true;
		},
		usable: 3,
		content() {
			var cards = [];
			for (var i = 0; i < trigger.cards.length; i++) {
				if (get.position(trigger.cards[i]) === "d") {
					cards.push(trigger.cards[i]);
				}
			}
			player.gain(cards, "gain2");
		},
	},
	zhaoyao: {
		trigger: { global: "phaseDrawBegin" },
		filter(event, player) {
			return event.player !== player && event.player.countCards("h") > 0 && player.countCards("h") > 0;
		},
		check(event, player) {
			if (player.isUnseen()) {
				return false;
			}
			if (get.attitude(player, event.player) >= 0) {
				return false;
			}
			var hs = player.getCards("h");
			if (hs.length < event.player.countCards("h")) {
				return false;
			}
			for (var i = 0; i < hs.length; i++) {
				var val = get.value(hs[0]);
				if (hs[i].number >= 10 && val <= 6) {
					return true;
				}
				if (hs[i].number >= 8 && val <= 3) {
					return true;
				}
			}
			return false;
		},
		logTarget: "player",
		content() {
			"step 0";
			player.chooseToCompare(trigger.player);
			"step 1";
			if (result.bool) {
				player.draw(2);
			} else {
				event.finish();
			}
			"step 2";
			player.chooseCard("将两张牌置于牌堆顶（先选择的在上）", 2, "he", true);
			"step 3";
			if (result.bool) {
				player.lose(result.cards, ui.special);
				event.cards = result.cards;
			} else {
				event.finish();
			}
			"step 4";
			game.delay();
			var nodes = [];
			for (var i = 0; i < event.cards.length; i++) {
				var cardx = ui.create.card();
				cardx.classList.add("infohidden");
				cardx.classList.add("infoflip");
				nodes.push(cardx);
			}
			player.$throw(nodes, 700, "nobroadcast");
			game.log(player, "将" + get.cnNumber(event.cards.length) + "张牌置于牌堆顶");
			"step 5";
			for (var i = event.cards.length - 1; i >= 0; i--) {
				ui.cardPile.insertBefore(event.cards[i], ui.cardPile.firstChild);
			}
		},
		ai: {
			mingzhi: false,
			expose: 0.2,
		},
	},
	zhangmu: {
		trigger: { player: ["chooseToRespondBegin", "chooseToUseBegin"] },
		filter(event, player) {
			if (event.responded) {
				return false;
			}
			if (!event.filterCard({ name: "shan" }, player, event)) {
				return false;
			}
			return player.countCards("h", "shan") > 0;
		},
		direct: true,
		usable: 1,
		content() {
			"step 0";
			var goon = get.damageEffect(player, trigger.player, player) <= 0;
			player.chooseCard(get.prompt("zhangmu"), { name: "shan" }).ai = function () {
				return goon ? 1 : 0;
			};
			"step 1";
			if (result.bool) {
				player.logSkill("zhangmu");
				player.showCards(result.cards);
				trigger.untrigger();
				trigger.responded = true;
				trigger.result = { bool: true, card: { name: "shan" } };
				player.addSkill("zhangmu_ai");
			} else {
				player.storage.counttrigger.zhangmu--;
			}
		},
		ai: {
			respondShan: true,
			effect: {
				target(card, player, target, effect) {
					if (get.tag(card, "respondShan") && effect < 0) {
						if (target.hasSkill("zhangmu_ai")) {
							return 0;
						}
						if (target.countCards("h") >= 2) {
							return 0.5;
						}
					}
				},
			},
		},
	},
	zhangmu_ai: {
		trigger: { player: "loseAfter" },
		silent: true,
		filter(event, player) {
			return player.countCards("h", "shan") === 0;
		},
		content() {
			player.removeSkill("zhangmu_ai");
		},
	},
	leiyu: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			if (!player.countCards("h", { color: "black" })) {
				return false;
			}
			if (player.storage.leiyu) {
				for (var i = 0; i < player.storage.leiyu.length; i++) {
					if (player.storage.leiyu[i].isAlive()) {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			"step 0";
			for (var i = 0; i < player.storage.leiyu.length; i++) {
				if (player.storage.leiyu[i].isDead()) {
					player.storage.leiyu.splice(i--, 1);
				}
			}
			var num = 0;
			var num2 = 0;
			for (var i = 0; i < player.storage.leiyu.length; i++) {
				if (!player.storage.leiyu[i].isIn()) {
					continue;
				}
				var eff = get.effect(player.storage.leiyu[i], { name: "jingleishan", nature: "thunder" }, player, player);
				num += eff;
				if (eff > 0) {
					num2++;
				} else if (eff < 0) {
					num2--;
				}
			}
			var next = player.chooseToDiscard(get.prompt("leiyu", player.storage.leiyu), {
				color: "black",
			});
			next.ai = function (card) {
				if (num > 0 && num2 >= 2) {
					return 7 - get.value(card);
				}
				return 0;
			};
			next.logSkill = ["leiyu", player.storage.leiyu];
			"step 1";
			if (result.bool) {
				player.storage.leiyu.sort(lib.sort.seat);
				player.useCard({ name: "jingleishan", nature: "thunder" }, player.storage.leiyu).animate = false;
			}
		},
		group: ["leiyu2", "leiyu4"],
		ai: {
			threaten: 1.3,
		},
	},
	leiyu2: {
		trigger: { player: "phaseUseBegin" },
		silent: true,
		content() {
			player.storage.leiyu = [];
		},
	},
	leiyu3: {
		trigger: { source: "dieAfter" },
		forced: true,
		popup: false,
		filter(event, player) {
			return player.storage.leiyu2 ? true : false;
		},
		content() {
			player.recover();
			delete player.storage.leiyu2;
		},
	},
	leiyu4: {
		trigger: { player: "useCardToBegin" },
		silent: true,
		filter(event, player) {
			return _status.currentPhase === player && Array.isArray(player.storage.leiyu) && event.target && event.target !== player;
		},
		content() {
			player.storage.leiyu.add(trigger.target);
		},
	},
	feizhua: {
		trigger: { player: "useCard" },
		filter(event, player) {
			if (event.card.name !== "sha") {
				return false;
			}
			if (event.targets.length !== 1) {
				return false;
			}
			var target = event.targets[0];
			var players = game.filterPlayer(function (current) {
				return get.distance(target, current, "pure") === 1;
			});
			for (var i = 0; i < players.length; i++) {
				if (player !== players[i] && target !== players[i] && player.canUse("sha", players[i], false)) {
					return true;
				}
			}
			return false;
		},
		prompt(event, player) {
			var targets = [];
			var target = event.targets[0];
			var players = game.filterPlayer(function (current) {
				return get.distance(target, current, "pure") === 1;
			});
			for (var i = 0; i < players.length; i++) {
				if (player !== players[i] && target !== players[i] && player.canUse("sha", players[i], false)) {
					targets.push(players[i]);
				}
			}
			return get.prompt("feizhua", targets);
		},
		check(event, player) {
			var target = event.targets[0];
			var num = 0;
			var players = game.filterPlayer(function (current) {
				return get.distance(target, current, "pure") === 1;
			});
			for (var i = 0; i < players.length; i++) {
				if (player !== players[i] && target !== players[i] && player.canUse("sha", players[i], false)) {
					num += get.effect(players[i], { name: "sha" }, player, player);
				}
			}
			return num > 0;
		},
		content() {
			"step 0";
			var target = trigger.targets[0];
			var players = game.filterPlayer(function (current) {
				return get.distance(target, current, "pure") === 1;
			});
			for (var i = 0; i < players.length; i++) {
				if (player !== players[i] && target !== players[i] && player.canUse("sha", players[i], false)) {
					trigger.targets.push(players[i]);
					player.line(players[i], "green");
				}
			}
		},
	},
	lingxue: {
		trigger: { player: "recoverEnd" },
		forced: true,
		content() {
			player.changeHujia();
		},
	},
	diesha: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.player.isAlive() && event.card && event.card.name === "sha";
		},
		content() {
			trigger.player.loseHp();
			player.recover();
		},
		ai: {
			threaten: 1.5,
		},
	},
	guijiang: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target !== player && !target.hasSkill("guijiang2");
		},
		filterCard: { color: "black" },
		filter(event, player) {
			return player.countCards("h", { color: "black" });
		},
		check(card) {
			return 5 - get.value(card);
		},
		content() {
			target.addSkill("guijiang2");
			target.storage.guijiang2 = player;
		},
		ai: {
			order: 4,
			threaten: 1.2,
			expose: 0.2,
			result: {
				target(player, target) {
					if (target.hp === 1) {
						return -1;
					}
					if (target.hp === 2) {
						return -0.5;
					}
					return 0;
				},
			},
		},
	},
	guijiang2: {
		mark: true,
		intro: {
			content: "不能成为回复牌的目标",
		},
		trigger: { global: ["dieBegin", "phaseBegin"] },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.player === player.storage.guijiang2;
		},
		content() {
			player.removeSkill("guijiang2");
		},
		mod: {
			targetEnabled(card) {
				if (get.tag(card, "recover")) {
					return false;
				}
			},
		},
		global: "guijiang3",
	},
	guijiang3: {
		mod: {
			cardSavable(card, player) {
				if (_status.event.dying && _status.event.dying.hasSkill("guijiang2")) {
					return false;
				}
			},
		},
	},
	fenxing: {
		trigger: { player: "phaseBegin" },
		forced: true,
		unique: true,
		forceunique: true,
		filter(event, player) {
			return Math.random() < 0.5 && [player.name1, player.name2].includes("pal_longkui");
		},
		derivation: ["diesha", "guijiang"],
		content() {
			if (player.storage.fenxing) {
				player.storage.fenxing = false;
				player.removeSkill("guijiang");
				player.removeSkill("diesha");
				player.addSkill("diewu");
				player.addSkill("lingyu");
				player.setAvatar("pal_longkui", "pal_longkui");
			} else {
				player.storage.fenxing = true;
				player.removeSkill("diewu");
				player.removeSkill("lingyu");
				player.addSkill("guijiang");
				player.addSkill("diesha");
				player.setAvatar("pal_longkui", "pal_longkuigui");
			}
		},
	},
	diewu: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h", "sha") > 0;
		},
		filterCard: { name: "sha" },
		filterTarget(card, player, target) {
			return target !== player;
		},
		prepare: "give",
		discard: false,
		content() {
			target.gain(cards, player);
			if (!player.hasSkill("diewu2")) {
				player.draw();
				player.addTempSkill("diewu2");
			}
		},
		ai: {
			order: 2,
			expose: 0.2,
			result: {
				target(player, target) {
					if (!player.hasSkill("diewu2")) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	diewu2: {},
	lingyu: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current !== player && current.isDamaged();
			});
		},
		content() {
			"step 0";
			player.chooseTarget("灵愈：令一名其他角色回复1点体力", function (card, player, target) {
				return target !== player && target.hp < target.maxHp;
			}).ai = function (target) {
				return get.recoverEffect(target, player, player);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("lingyu", result.targets[0]);
				result.targets[0].recover();
			}
		},
		ai: {
			threaten: 1.5,
			expose: 0.2,
		},
	},
	duxinshu: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h");
		},
		content() {
			"step 0";
			if (player.countCards("h")) {
				player.chooseCardButton("读心", target.getCards("h")).ai = function (button) {
					return get.value(button.link) - 5;
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
			}
		},
		ai: {
			threaten: 1.3,
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
			order: 10,
			expose: 0.2,
		},
	},
	feixu: {
		trigger: { global: ["useCard", "respond"] },
		filter(event, player) {
			return event.card && event.card.name === "shan";
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		content() {
			trigger.player.draw();
		},
		ai: {
			mingzhi: false,
			threaten: 2,
			expose: 0.2,
		},
	},
	xuanyan: {
		locked: true,
		group: ["xuanyan2", "xuanyan3"],
	},
	xuanyan2: {
		trigger: { source: "damageBegin" },
		forced: true,
		filter(event) {
			return event.hasNature("fire") && event.notLink();
		},
		content() {
			trigger.num++;
		},
	},
	xuanyan3: {
		trigger: { source: "damageEnd" },
		forced: true,
		popup: false,
		filter(event) {
			return event.hasNature("fire");
		},
		content() {
			player.loseHp();
		},
	},
	ningbin: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event) {
			return event.hasNature("thunder");
		},
		content() {
			player.recover();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "thunderDamage")) {
						if (target.hp <= 1 || !target.hasSkill("xfenxin")) {
							return [0, 0];
						}
						return [0, 1.5];
					}
				},
			},
		},
	},
	xfenxin: {
		trigger: { player: "changeHp" },
		forced: true,
		filter(event) {
			return event.num !== 0;
		},
		content() {
			player.draw(Math.abs(trigger.num));
		},
		ai: {
			effect: {
				target(card) {
					if (get.tag(card, "thunderDamage")) {
						return;
					}
					if (get.tag(card, "damage") || get.tag(card, "recover")) {
						return [1, 0.2];
					}
				},
			},
		},
		group: "xfenxin2",
	},
	xfenxin2: {
		trigger: { source: "dieAfter" },
		forced: true,
		content() {
			player.gainMaxHp();
			player.recover();
		},
	},
	luanjian: {
		enable: "phaseUse",
		filterCard: { name: "sha" },
		selectCard: 2,
		check(card) {
			var num = 0;
			var player = _status.event.player;
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (lib.filter.targetEnabled({ name: "sha" }, player, players[i]) && get.effect(players[i], { name: "sha" }, player) > 0) {
					num++;
					if (num > 1) {
						return 8 - get.value(card);
					}
				}
			}
			return 0;
		},
		viewAs: { name: "sha" },
		selectTarget: [1, Infinity],
		filterTarget(card, player, target) {
			return lib.filter.targetEnabled({ name: "sha" }, player, target);
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.1;
			},
			effect: {
				player_use(card, player) {
					if (_status.currentPhase !== player) {
						return;
					}
					if (card.name === "sha" && player.countCards("h", "sha") < 2 && !player.needsToDiscard()) {
						var num = 0;
						var player = _status.event.player;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (lib.filter.targetEnabled({ name: "sha" }, player, players[i]) && get.attitude(player, players[i]) < 0) {
								num++;
								if (num > 1) {
									return "zeroplayertarget";
								}
							}
						}
					}
				},
			},
		},
		group: "luanjian2",
	},
	luanjian2: {
		trigger: { source: "damageBegin" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.card && event.card.name === "sha" && event.parent.skill === "luanjian";
		},
		content() {
			if (Math.random() < 0.5) {
				trigger.num++;
			}
		},
	},
	ctianfu: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h", "shan") > 0;
		},
		usable: 1,
		filterCard: { name: "shan" },
		discard: false,
		prepare: "give",
		filterTarget(card, player, target) {
			return target !== player && !target.hasSkill("ctianfu2");
		},
		check(card) {
			if (_status.event.player.hp >= 3) {
				return 8 - get.value(card);
			}
			return 7 - get.value(card);
		},
		content() {
			target.storage.ctianfu2 = cards[0];
			target.storage.ctianfu3 = player;
			game.addVideo("storage", target, ["ctianfu2", get.cardInfo(cards[0]), "card"]);
			target.addSkill("ctianfu2");
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					var att = get.attitude(player, target);
					if (att >= 0) {
						return 0;
					}
					return get.damageEffect(target, player, target, "thunder");
				},
			},
			expose: 0.2,
		},
	},
	ctianfu2: {
		trigger: { source: "damageAfter" },
		forced: true,
		mark: "card",
		filter(event, player) {
			return player.storage.ctianfu2 && player.storage.ctianfu3;
		},
		content() {
			"step 0";
			if (player.storage.ctianfu3 && player.storage.ctianfu3.isAlive()) {
				player.damage(player.storage.ctianfu3);
				player.storage.ctianfu3.line(player, "thunder");
			} else {
				player.damage("nosource");
			}
			"step 1";
			var he = player.getCards("he");
			if (he.length) {
				player.discard(he.randomGet());
			}
			"step 2";
			player.$throw(player.storage.ctianfu2);
			player.storage.ctianfu2.discard();
			delete player.storage.ctianfu2;
			delete player.storage.ctianfu3;
			player.removeSkill("ctianfu2");
		},
		group: "ctianfu3",
		intro: {
			content: "card",
		},
	},
	ctianfu3: {
		trigger: { player: "dieBegin" },
		forced: true,
		popup: false,
		content() {
			player.storage.ctianfu2.discard();
			delete player.storage.ctianfu2;
			delete player.storage.ctianfu3;
			player.removeSkill("ctianfu2");
		},
	},
	shuiyun: {
		trigger: { player: "phaseEnd" },
		direct: true,
		init(player) {
			player.storage.shuiyun = [];
			player.storage.shuiyun_count = 0;
		},
		filter(event, player) {
			if (player.storage.shuiyun.length >= 3) {
				return false;
			}
			var types = [];
			for (var i = 0; i < player.storage.shuiyun.length; i++) {
				types.add(get.type(player.storage.shuiyun[i], "trick"));
			}
			var cards = player.getCards("h");
			for (var i = 0; i < cards.length; i++) {
				if (!types.includes(get.type(cards[i], "trick"))) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var types = [];
			var num = player.countCards("h");
			for (var i = 0; i < player.storage.shuiyun.length; i++) {
				types.add(get.type(player.storage.shuiyun[i], "trick"));
			}
			player.chooseCard(get.prompt2("shuiyun"), function (card) {
				return !types.includes(get.type(card, "trick"));
			}).ai = function (card) {
				return 11 - get.value(card);
			};
			"step 1";
			if (result.bool) {
				player.$throw(result.cards);
				var clone = result.cards[0].clone;
				setTimeout(function () {
					clone.moveDelete(player);
					game.addVideo("gain2", player, get.cardsInfo([clone]));
				}, 500);
				player.logSkill("shuiyun");
				player.storage.shuiyun.push(result.cards[0]);
				player.lose(result.cards, ui.special);
				player.markSkill("shuiyun");
				game.addVideo("storage", player, ["shuiyun", get.cardsInfo(player.storage.shuiyun), "cards"]);
			}
		},
		intro: {
			content: "cards",
			onunmark(storage, player) {
				if (storage && storage.length) {
					for (var i = 0; i < storage.length; i++) {
						storage[i].discard();
					}
					player.$throw(storage);
					delete player.storage.shuiyun;
				}
			},
		},
		ai: {
			effect: {
				player_use(card, player) {
					if (_status.currentPhase !== player) {
						return;
					}
					if (card.name === "wuzhong" || card.name === "yiyi" || card.name === "yuanjiao" || card.name === "shunshou") {
						return;
					}
					if (!player.needsToDiscard()) {
						var types = [];
						for (var i = 0; i < player.storage.shuiyun.length; i++) {
							types.add(get.type(player.storage.shuiyun[i], "trick"));
						}
						if (!types.includes(get.type(card, "trick"))) {
							return "zeroplayertarget";
						}
					}
				},
			},
			threaten: 2.2,
		},
		group: ["shuiyun5"],
	},
	shuiyun5: {
		enable: "chooseToUse",
		filter(event, player) {
			return event.type === "dying" && event.dying && event.dying.hp <= 0 && player.storage.shuiyun.length > 0;
		},
		filterTarget(card, player, target) {
			return target === _status.event.dying;
		},
		delay: 0,
		selectTarget: -1,
		content() {
			"step 0";
			player.chooseCardButton(get.translation("shuiyun"), player.storage.shuiyun, true);
			"step 1";
			if (result.bool) {
				player.storage.shuiyun.remove(result.links[0]);
				if (!player.storage.shuiyun.length) {
					player.unmarkSkill("shuiyun");
				}
				player.$throw(result.links);
				result.links[0].discard();
				target.recover();
				if (typeof player.storage.shuiyun_count === "number") {
					player.storage.shuiyun_count++;
				}
				player.syncStorage("shuiyun");
			} else {
				event.finish();
			}
		},
		ai: {
			order: 6,
			skillTagFilter(player) {
				return player.storage.shuiyun.length > 0;
			},
			save: true,
			result: {
				target: 3,
			},
			threaten: 1.6,
		},
	},
	wangyou: {
		trigger: { global: "phaseEnd" },
		unique: true,
		gainable: true,
		direct: true,
		filter(event, player) {
			if (!player.countCards("he")) {
				return false;
			}
			if (player === event.player) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current.hasSkill("wangyou3");
			});
		},
		content() {
			"step 0";
			var targets = [];
			var num = 0;
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (players[i].hasSkill("wangyou3")) {
					var att = get.attitude(player, players[i]);
					if (att > 0) {
						num++;
					} else if (att < 0) {
						num--;
					}
					targets.push(players[i]);
				}
			}
			event.targets = targets;
			var next = player.chooseToDiscard(get.prompt("wangyou", targets), "he");
			next.logSkill = ["wangyou", event.targets];
			next.ai = function (card) {
				if (num <= 0) {
					return 0;
				}
				switch (num) {
					case 1:
						return 5 - get.value(card);
					case 2:
						return 7 - get.value(card);
					default:
						return 8 - get.value(card);
				}
			};
			"step 1";
			if (result.bool) {
				event.targets.sort(lib.sort.seat);
				game.asyncDraw(event.targets);
			} else {
				event.finish();
			}
		},
		ai: {
			expose: 0.1,
			threaten: 1.2,
		},
		group: "wangyou2",
	},
	wangyou2: {
		trigger: { global: "damageEnd" },
		silent: true,
		filter(event) {
			return event.player.isAlive();
		},
		content() {
			trigger.player.addTempSkill("wangyou3");
		},
	},
	wangyou3: {},
	changnian: {
		forbid: ["boss"],
		trigger: { player: "dieBegin" },
		direct: true,
		unique: true,
		derivation: "changnian2",
		content() {
			"step 0";
			player.chooseTarget(get.prompt("changnian"), function (card, player, target) {
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
				target.addSkill("changnian2");
				player.logSkill("changnian", target);
				target.marks.changnian = target.markCharacter(player, {
					name: "长念",
					content: '<div class="skill">【追思】</div><div>锁定技，结束阶段，你摸一张牌</div>',
				});
				game.addVideo("markCharacter", target, {
					name: "长念",
					content: '<div class="skill">【追思】</div><div>锁定技，结束阶段，你摸一张牌</div>',
					id: "changnian",
					target: player.dataset.position,
				});
			}
		},
		ai: {
			threaten: 0.8,
		},
	},
	changnian2: {
		trigger: { player: "phaseEnd" },
		forced: true,
		nopop: true,
		content() {
			player.draw();
		},
	},
	sajin: {
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return target.hp < target.maxHp;
		},
		selectTarget: [1, Infinity],
		filterCard: true,
		usable: 1,
		check(card) {
			var player = _status.currentPhase;
			if (player.countCards("h") > player.hp) {
				return 7 - get.value(card);
			}
			return 4 - get.value(card);
		},
		content() {
			"step 0";
			var color = get.color(cards[0]);
			target.judge(function (card) {
				return get.color(card) === color ? 1 : 0;
			});
			"step 1";
			if (result.bool) {
				target.recover();
			}
		},
		ai: {
			order: 3,
			result: {
				target(player, target) {
					return get.recoverEffect(target);
				},
			},
			threaten: 1.5,
		},
	},
	jtjubao: {
		trigger: { global: "discardAfter" },
		filter(event, player) {
			if (player.hasSkill("jtjubao2")) {
				return false;
			}
			if (event.player === player) {
				return false;
			}
			if (_status.currentPhase === player) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (get.type(event.cards[i]) !== "basic" && get.position(event.cards[i]) === "d") {
					return true;
				}
			}
			return false;
		},
		frequent: true,
		content() {
			"step 0";
			if (trigger.delay === false) {
				game.delay();
			}
			"step 1";
			var cards = [];
			for (var i = 0; i < trigger.cards.length; i++) {
				if (get.type(trigger.cards[i]) !== "basic" && get.position(trigger.cards[i]) === "d") {
					cards.push(trigger.cards[i]);
				}
			}
			if (cards.length) {
				var card = cards.randomGet();
				player.gain(card, "log");
				player.$gain2(card);
				player.addTempSkill("jtjubao2");
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	jtjubao2: {},
	duci: {
		trigger: { player: "loseEnd" },
		direct: true,
		filter(event, player) {
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original === "e") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("duci"), function (card, player, target) {
				return player !== target && get.distance(player, target) <= 1;
			}).ai = function (target) {
				return get.damageEffect(target, player, player);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("duci", result.targets);
				result.targets[0].damage();
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.5,
			effect: {
				target(card, player, target, current) {
					if (get.type(card) === "equip") {
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (player !== players[i] && get.distance(player, players[i]) <= 1 && get.damageEffect(players[i], player, player) > 0) {
								return [1, 3];
							}
						}
					}
				},
			},
		},
	},
	xshuangren: {
		trigger: { player: ["loseEnd"] },
		filter(event, player) {
			if (!player.equiping) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original === "e" && get.subtype(event.cards[i]) === "equip1") {
					return true;
				}
			}
			return false;
		},
		content() {
			var card;
			for (var i = 0; i < trigger.cards.length; i++) {
				if (trigger.cards[i].original === "e" && get.subtype(trigger.cards[i]) === "equip1") {
					card = trigger.cards[i];
				}
			}
			if (card) {
				if (player.storage.xshuangren) {
					player.unmark(player.storage.xshuangren, "xshuangren");
					player.discard(player.storage.xshuangren);
					game.addVideo("unmarkId", player, [get.cardInfo(player.storage.xshuangren), "xshuangren"]);
				}
				if (card.clone) {
					card.clone.moveDelete(player);
					game.addVideo("gain2", player, get.cardsInfo([card.clone]));
					player.mark(card, "xshuangren");
					game.addVideo("markId", player, [get.cardInfo(card), "xshuangren"]);
				}
				ui.special.appendChild(card);
				player.storage.xshuangren = card;
				var info = get.info(card);
				if (info.skills) {
					player.addAdditionalSkill("xshuangren", info.skills);
				} else {
					player.removeAdditionalSkill("xshuangren");
				}
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.subtype(card) === "equip1") {
						return [1, 3];
					}
				},
			},
		},
		intro: {
			content: "card",
		},
		group: "xshuangren2",
	},
	xshuangren2: {
		trigger: { player: "dieBegin" },
		silent: true,
		filter(event, player) {
			return player.storage.xshuangren ? true : false;
		},
		content() {
			if (player.storage.xshuangren) {
				player.storage.xshuangren.discard();
				player.$throw(player.storage.xshuangren);
			}
		},
	},
	guiyuan: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { name: "sha" },
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		content() {
			player.recover();
			player.draw();
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
	},
	qijian: {
		trigger: { player: "phaseDiscardEnd" },
		direct: true,
		filter(event, player) {
			return event.cards && event.cards.length > 0;
		},
		content() {
			"step 0";
			player.chooseTarget([1, trigger.cards.length], get.prompt("qijian"), function (card, player, target) {
				return player.canUse({ name: "sha" }, target, false);
			}).ai = function (target) {
				return get.effect(target, { name: "sha" }, player);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("qijian");
				player.useCard({ name: "sha" }, result.targets);
			}
		},
	},
	shenmu: {
		trigger: { global: "dying" },
		priority: 6,
		filter(event, player) {
			return event.player.hp <= 0 && player.countCards("h", { color: "red" });
		},
		check(event, player) {
			if (get.attitude(player, event.player) <= 0) {
				return false;
			}
			var cards = player.getCards("h", { color: "red" });
			for (var i = 0; i < cards.length; i++) {
				if (cards[i].name === "tao") {
					return false;
				}
				if (get.value(cards[i]) > 7 && cards.length > 2) {
					return false;
				}
			}
		},
		content() {
			"step 0";
			player.showHandcards();
			"step 1";
			var cards = player.getCards("h", { color: "red" });
			event.num = cards.length;
			player.discard(cards);
			"step 2";
			trigger.player.recover();
			trigger.player.draw(event.num);
		},
		ai: {
			threaten: 1.6,
			expose: 0.2,
		},
	},
	qianfang: {
		trigger: { player: "phaseBegin" },
		direct: true,
		filter(event, player) {
			return player.storage.xuanning && player.countCards("he") + player.storage.xuanning >= 3;
		},
		content() {
			"step 0";
			var ainum = 0;
			var num = 3 - player.storage.xuanning;
			var players = game.filterPlayer();
			event.targets = [];
			for (var i = 0; i < players.length; i++) {
				if (players[i] !== player && !players[i].isOut() && lib.filter.targetEnabled({ name: "wanjian" }, player, players[i])) {
					ainum += get.effect(players[i], { name: "wanjian" });
					event.targets.push(players[i]);
				}
			}
			if (num) {
				var next = player.chooseToDiscard(num, get.prompt2("qianfang"), "he");
				next.ai = function (card) {
					if (ainum >= 0) {
						switch (num) {
							case 1:
								return 8 - get.value(card);
							case 2:
								return 6 - get.value(card);
							case 3:
								return 4 - get.value(card);
						}
					}
					return -1;
				};
				next.logSkill = "qianfang";
				event.logged = true;
			} else {
				player.chooseBool(get.prompt2("qianfang")).ai = function () {
					return ainum >= 0;
				};
			}
			"step 1";
			if (result.bool) {
				player.storage.xuanning = 0;
				player.unmarkSkill("xuanning");
				if (!event.logged) {
					player.logSkill("qianfang");
				}
				player.useCard({ name: "wanjian" }, "qianfang", event.targets);
			} else {
				event.finish();
			}
		},
		ai: {
			expose: 0.1,
			threaten: 1.5,
		},
		group: "qianfang_draw",
		subSkill: {
			draw: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter(event, player) {
					if (event._notrigger.includes(event.player)) {
						return false;
					}
					if (!event.player.isEnemiesOf(player)) {
						return false;
					}
					return event.parent.skill === "qianfang";
				},
				popup: false,
				content() {
					player.draw();
				},
			},
		},
	},
	qianfang2: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		popup: false,
		content() {
			trigger.num++;
		},
	},
	poyun: {
		trigger: { source: "damageEnd" },
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return player.storage.xuanning > 0 && event.player.countCards("he") > 0;
		},
		direct: true,
		content() {
			"step 0";
			player.discardPlayerCard(trigger.player, "he", get.prompt("poyun", trigger.player), [1, 2]).logSkill = ["poyun", trigger.player];
			"step 1";
			if (result.bool) {
				player.storage.xuanning--;
				if (!player.storage.xuanning) {
					player.unmarkSkill("xuanning");
				}
				player.syncStorage("xuanning");
			}
		},
		ai: {
			threaten: 1.3,
		},
	},
	poyun2: {
		trigger: { source: "damageEnd" },
		forced: true,
		popup: false,
		filter(event, player) {
			return player.storage.poyun ? true : false;
		},
		content() {
			player.draw();
			player.storage.poyun = false;
			player.removeSkill("poyun2");
		},
	},
	poyun3: {},
	zhuyue: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h", { type: "basic" }) < player.countCards("he");
		},
		init(player) {
			player.storage.zhuyue = [];
		},
		filterCard(card) {
			return get.type(card) !== "basic";
		},
		selectTarget: [1, 2],
		filterTarget(card, player, target) {
			return player !== target && target.countCards("he") > 0;
		},
		usable: 1,
		locked: false,
		check(card) {
			return 7 - get.value(card);
		},
		multitarget: true,
		multiline: true,
		content() {
			"step 0";
			targets.sort(lib.sort.seat);
			var target = targets[0];
			var cs = target.getCards("he");
			if (cs.length) {
				target.discard(cs.randomGet());
			}
			player.storage.zhuyue.add(target);
			if (targets.length < 2) {
				event.finish();
			}
			"step 1";
			var target = targets[1];
			var cs = target.getCards("he");
			if (cs.length) {
				target.discard(cs.randomGet());
			}
			player.storage.zhuyue.add(target);
		},
		ai: {
			result: {
				target(player, target) {
					if (!target.countCards("he")) {
						return -0.2;
					}
					return -1;
				},
			},
			order: 10,
			threaten: 1.2,
			exoise: 0.2,
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.name === "sha" && player.storage.zhuyue && player.storage.zhuyue.includes(target)) {
					return true;
				}
			},
			selectTarget(card, player, range) {
				if (card.name === "sha" && player.storage.zhuyue && player.storage.zhuyue.length) {
					range[1] = -1;
					range[0] = -1;
				}
			},
			playerEnabled(card, player, target) {
				if (card.name === "sha" && player.storage.zhuyue && player.storage.zhuyue.length && !player.storage.zhuyue.includes(target)) {
					return false;
				}
			},
		},
		intro: {
			content: "players",
		},
		group: "zhuyue2",
	},
	zhuyue2: {
		trigger: { player: "phaseUseEnd" },
		silent: true,
		content() {
			player.storage.zhuyue.length = 0;
		},
	},
	longxi: {
		trigger: { player: ["chooseToRespondBegin", "chooseToUseBegin"] },
		forced: true,
		popup: false,
		max: 2,
		filter(event, player) {
			return _status.currentPhase !== player;
		},
		priority: 101,
		content() {
			var cards = [];
			var max = Math.min(ui.cardPile.childNodes.length, lib.skill.longxi.max);
			for (var i = 0; i < max; i++) {
				var card = ui.cardPile.childNodes[i];
				if (trigger.filterCard(card, player, trigger)) {
					cards.push(card);
				}
			}
			if (cards.length) {
				player.gain(cards, "draw");
				player.logSkill("longxi");
				game.log(player, "获得了" + get.cnNumber(cards.length) + "张牌");
			}
		},
		ai: {
			respondSha: true,
			respondShan: true,
			effect: {
				target(card, player, target, effect) {
					if (get.tag(card, "respondShan")) {
						return 0.7;
					}
					if (get.tag(card, "respondSha")) {
						return 0.7;
					}
				},
			},
		},
		hiddenCard(player, name) {
			if (_status.currentPhase === player) {
				return false;
			}
			var max = Math.min(ui.cardPile.childNodes.length, lib.skill.longxi.max);
			for (var i = 0; i < max; i++) {
				var card = ui.cardPile.childNodes[i];
				if (card.name === name) {
					return true;
				}
			}
			return false;
		},
	},
	guanri: {
		unique: true,
		enable: "phaseUse",
		filter(event, player) {
			return !player.storage.guanri && player.countCards("h", { color: "red" }) >= 2;
		},
		check(card) {
			return 8 - get.value(card);
		},
		filterCard(card) {
			return get.color(card) === "red";
		},
		selectCard: 2,
		filterTarget(card, player, target) {
			return player !== target && target.hp >= player.hp;
		},
		intro: {
			content: "limited",
		},
		line: "fire",
		content() {
			"step 0";
			player.storage.guanri = true;
			player.loseHp();
			"step 1";
			target.damage(2, "fire");
			"step 2";
			if (target.isAlive()) {
				target.discard(target.getCards("e"));
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					var eff = get.damageEffect(target, player, target, "fire");
					if (player.hp > 2) {
						return eff;
					}
					if (player.hp === 2 && target.hp === 2) {
						return eff;
					}
					return 0;
				},
			},
			expose: 0.5,
		},
	},
	tianxian: {
		mod: {
			targetInRange(card, player, target, now) {
				if (card.name === "sha") {
					return true;
				}
			},
			selectTarget(card, player, range) {
				if (card.name === "sha" && range[1] !== -1) {
					range[1] = Infinity;
				}
			},
		},
		priority: 5.5,
		trigger: { player: "useCardToBefore" },
		filter(event) {
			return event.card.name === "sha";
		},
		forced: true,
		check() {
			return false;
		},
		content() {
			"step 0";
			trigger.target.judge(function (card) {
				return get.color(card) === "black" ? 1 : 0;
			});
			"step 1";
			if (result.bool) {
				trigger.cancel();
			}
		},
	},
	runxin: {
		trigger: { player: ["useCard", "respondEnd"] },
		direct: true,
		filter(event) {
			if (get.suit(event.card) === "heart") {
				return game.hasPlayer(function (current) {
					return current.isDamaged();
				});
			}
			return false;
		},
		content() {
			"step 0";
			var noneed = trigger.card.name === "tao" && trigger.targets[0] === player && player.hp === player.maxHp - 1;
			player
				.chooseTarget(get.prompt("runxin"), function (card, player, target) {
					return target.hp < target.maxHp;
				})
				.set("autodelay", true).ai = function (target) {
				var num = get.attitude(player, target);
				if (num > 0) {
					if (noneed && player === target) {
						num = 0.5;
					} else if (target.hp === 1) {
						num += 3;
					} else if (target.hp === 2) {
						num += 1;
					}
				}
				return num;
			};
			"step 1";
			if (result.bool) {
				player.logSkill("runxin", result.targets);
				result.targets[0].recover();
			}
		},
		ai: {
			expose: 0.3,
			threaten: 1.5,
		},
	},
	xjzhimeng: {
		trigger: { player: "phaseEnd" },
		direct: true,
		locked: true,
		unique: true,
		gainable: true,
		group: "xjzhimeng3",
		content() {
			"step 0";
			player.chooseTarget(get.prompt("xjzhimeng"), function (card, player, target) {
				return player !== target;
			}).ai = function (target) {
				var num = get.attitude(player, target);
				if (num > 0) {
					if (player === target) {
						num++;
					}
					if (target.hp === 1) {
						num += 3;
					}
					if (target.hp === 2) {
						num += 1;
					}
				}
				return num;
			};
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				var card = get.cards()[0];
				target.$draw(card);
				target.storage.xjzhimeng2 = card;
				game.addVideo("storage", target, ["xjzhimeng2", get.cardInfo(card), "card"]);
				target.addSkill("xjzhimeng2");
				player.logSkill("xjzhimeng", target);
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	xjzhimeng2: {
		intro: {
			content: "card",
			onunmark(storage, player) {
				delete player.storage.xjzhimeng2;
			},
		},
		mark: "card",
		trigger: { target: "useCardToBegin" },
		frequent: true,
		filter(event, player) {
			return player.storage.xjzhimeng2 && get.type(event.card, "trick") === get.type(player.storage.xjzhimeng2, "trick");
		},
		content() {
			player.draw();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (target.storage.xjzhimeng2 && get.type(card, "trick") === get.type(target.storage.xjzhimeng2, "trick")) {
						return [1, 0.5];
					}
				},
			},
		},
	},
	xjzhimeng3: {
		trigger: { player: ["phaseBegin", "dieBegin"] },
		silent: true,
		content() {
			"step 0";
			event.players = game.filterPlayer();
			event.num = 0;
			"step 1";
			if (event.num < event.players.length) {
				var player = event.players[event.num];
				if (player.storage.xjzhimeng2) {
					if (trigger.name === "die" && player === trigger.player) {
						player.storage.xjzhimeng2.discard();
					} else {
						game.log(player, "发动织梦，获得了", player.storage.xjzhimeng2);
						player.gain(player.storage.xjzhimeng2, "gain2");
						player.popup("xjzhimeng");
					}
					player.removeSkill("xjzhimeng2");
				}
				event.num++;
				event.redo();
			}
		},
	},
	tannang: {
		enable: "chooseToUse",
		usable: 1,
		locked: false,
		filterCard(card) {
			return get.suit(card) === "club";
		},
		filter(event, player) {
			return player.countCards("h", { suit: "club" });
		},
		viewAs: { name: "shunshou" },
		viewAsFilter(player) {
			if (!player.countCards("h", { suit: "club" })) {
				return false;
			}
		},
		prompt: "将一张装备牌当顺手牵羊使用",
		check(card) {
			var player = _status.currentPhase;
			if (player.countCards("h", { subtype: get.subtype(card) }) > 1) {
				return 11 - get.equipValue(card);
			}
			if (player.countCards("h") < player.hp) {
				return 6 - get.value(card);
			}
			return 2 - get.equipValue(card);
		},
		mod: {
			targetInRange(card, player, target, now) {
				if (card.name === "shunshou") {
					return true;
				}
			},
		},
		ai: {
			order: 9.5,
			threaten: 1.5,
		},
	},
	tuoqiao: {
		enable: "chooseToUse",
		filterCard: { color: "black" },
		position: "he",
		viewAs: { name: "shihuifen" },
		viewAsFilter(player) {
			return player.countCards("he", { color: "black" }) > 0;
		},
		ai: {
			shihuifen: true,
			skillTagFilter(player) {
				return player.countCards("he", { color: "black" }) > 0;
			},
		},
	},
	huimeng: {
		trigger: { player: "recoverAfter" },
		frequent: true,
		content() {
			player.draw(2);
		},
		ai: {
			threaten: 0.8,
		},
	},
	tianshe: {
		group: ["tianshe2"],
		trigger: { player: "damageBefore" },
		filter(event) {
			if (event.hasNature()) {
				return true;
			}
			return false;
		},
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			nofire: true,
			nothunder: true,
			effect: {
				target(card, player, target, current) {
					if (card.name === "tiesuo") {
						return [0, 0];
					}
					if (get.tag(card, "fireDamage")) {
						return [0, 0, 0, 0];
					}
					if (get.tag(card, "thunderDamage")) {
						return [0, 0, 0, 0];
					}
				},
			},
		},
	},
	tianshe2: {
		trigger: { source: "damageAfter" },
		filter(event, player) {
			if (event.hasNature() && player.hp < player.maxHp) {
				return true;
			}
		},
		forced: true,
		content() {
			player.recover();
		},
	},
};

export default skill;
