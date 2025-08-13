import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCharacterConfig['skill'] } */
const skill = {
	qingshu: {
		ai: {
			threaten: 1.4,
		},
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			for (var i = 0; i < player.storage.qingshu.length; i++) {
				if (ui.land && ui.land.name === player.storage.qingshu[i]) {
					continue;
				}
				return true;
			}
			return false;
		},
		init(player) {
			player.storage.qingshu = [];
			player.storage.qingshu_all = [];
		},
		content() {
			"step 0";
			player
				.chooseVCardButton(player.storage.qingshu.slice(0), get.prompt("qingshu"))
				.set("ai", function (button) {
					var skill = button.link[2] + "_skill";
					if (lib.skill[skill].ai && lib.skill[skill].ai.mapValue) {
						return Math.abs(lib.skill[skill].ai.mapValue);
					}
					return 0;
				})
				.set("filterButton", function (button) {
					if (ui.land && ui.land.name === button.link[2]) {
						return false;
					}
					return true;
				});
			"step 1";
			if (result.bool) {
				var skill = result.links[0][2];
				event.mapSkill = skill;
				var value = 0;
				if (lib.skill[skill] && lib.skill[skill].ai && lib.skill[skill].ai.mapValue) {
					value = lib.skill[skill].ai.mapValue;
				}
				player
					.chooseTarget(function (card, player, target) {
						return !target.hasSkill(skill + "_skill");
					}, "选择一个目标获得技能" + get.translation(skill))
					.set("ai", function (target) {
						var result = get.sgnAttitude(player, target) * value;
						var num = target.storage.qingshu_gained || 0;
						return result / (num + 1);
					})
					.set("prompt2", lib.translate[skill + "_skill_info"]);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				var skill = event.mapSkill + "_skill";
				player.logSkill("qingshu", target);
				target.addSkill(skill);
				target.popup(skill);
				game.log(target, "获得了技能", "【" + get.translation(skill) + "】");
				if (!target.storage.qingshu_gained) {
					target.storage.qingshu_gained = 0;
				}
				target.storage.qingshu_gained++;
				player.storage.qingshu.remove(event.mapSkill);
			}
		},
		subSkill: {
			count: {
				trigger: { player: "useCard" },
				silent: true,
				filter(event, player) {
					return get.type(event.card) === "land" && !player.storage.qingshu_all.includes(event.card.name);
				},
				content() {
					player.storage.qingshu.push(trigger.card.name);
					player.storage.qingshu_all.push(trigger.card.name);
				},
			},
		},
		group: "qingshu_count",
	},
	yunyou: {
		enable: "phaseUse",
		round: 2,
		init(player) {
			player.storage.yunyou = [];
		},
		filter(event, player) {
			return !player.hasSkill("land_used") && get.inpile("land").length > player.storage.yunyou.length;
		},
		delay: 0,
		content() {
			var list = get.inpile("land");
			for (var i = 0; i < player.storage.yunyou.length; i++) {
				list.remove(player.storage.yunyou[i]);
			}
			player.discoverCard(list, "use");
		},
		ai: {
			order: 6,
			threaten: 1.2,
			result: {
				player: 1,
			},
		},
		group: "yunyou_count",
		subSkill: {
			count: {
				trigger: { player: "useCard" },
				silent: true,
				filter(event, player) {
					return get.type(event.card) === "land";
				},
				content() {
					player.storage.yunyou.add(trigger.card.name);
				},
			},
		},
	},
	xuanzhen: {
		trigger: { global: "useCard1" },
		round: 1,
		filter(event, player) {
			if (event.targets.length !== 1) {
				return false;
			}
			if (event.player === player) {
				return false;
			}
			if (player !== event.targets[0]) {
				return false;
			}
			for (var i = 0; i < lib.inpile.length; i++) {
				var info = lib.card[lib.inpile[i]];
				if (info.multitarget) {
					continue;
				}
				if (lib.filter.targetEnabled2({ name: lib.inpile[i] }, event.player, player)) {
					return true;
				}
			}
			return false;
		},
		check(event, player) {
			return get.effect(player, event.card, event.player, player) < 0;
		},
		prompt2(event, player) {
			return "发现一张牌代替" + get.translation(event.player) + "对你使用的" + get.translation(event.card);
		},
		autodelay: true,
		content() {
			"step 0";
			var list = [],
				list1 = [],
				list2 = [];
			for (var i = 0; i < lib.inpile.length; i++) {
				var info = lib.card[lib.inpile[i]];
				if (info.multitarget) {
					continue;
				}
				if (lib.filter.targetEnabled2({ name: lib.inpile[i] }, trigger.player, trigger.targets[0])) {
					var cardinfo = [trigger.card.suit || "", trigger.card.number || "", lib.inpile[i]];
					list1.push(cardinfo);
					if (info.type !== "equip") {
						list2.push(cardinfo);
					}
				}
			}
			var equipped = false;
			for (var i = 0; i < 3; i++) {
				if (equipped && list2.length) {
					list.push(list2.randomRemove());
				} else {
					equipped = true;
					list.push(list1.randomRemove());
				}
			}
			player.chooseButton(true, ["玄阵", [list, "vcard"]]).ai = function (button) {
				var card = {
					suit: trigger.card.suit,
					number: trigger.card.number,
					name: button.link[2],
				};
				return get.effect(trigger.targets[0], card, trigger.player, player);
			};
			"step 1";
			if (result.bool) {
				var card = game.createCard({
					suit: trigger.card.suit || lib.suit.randomGet(),
					number: trigger.card.number || Math.ceil(Math.random() * 13),
					name: result.links[0][2],
				});
				event.card = card;
				game.log(player, "将", trigger.card, "变为", card);
				trigger.card = get.autoViewAs(card);
				trigger.cards = [card];
				game.cardsGotoOrdering(card).relatedEvent = trigger;
			} else {
				event.finish();
			}
			"step 2";
			player.$throw(event.card, null, null, true);
			if (player === trigger.player) {
				player.line(trigger.targets[0], "green");
			} else {
				player.line(trigger.player, "green");
			}
			game.delayx(0.5);
		},
		ai: {
			threaten(player, target) {
				if (game.roundNumber - target.storage.xuanzhen_roundcount < 1) {
					return 2.2;
				}
				return 0.6;
			},
		},
	},
	xuanci: {
		locked: false,
		mod: {
			targetInRange(card) {
				if (card.name === "feibiao") {
					return true;
				}
			},
		},
		enable: "phaseUse",
		usable: 1,
		viewAs: { name: "feibiao" },
		filterCard: { suit: "club" },
		position: "he",
		filter(event, player) {
			return player.countCards("he", { suit: "club" }) > 0;
		},
		check(card) {
			return 7 - get.value(card);
		},
		group: "xuanci_sha",
		subSkill: {
			sha: {
				trigger: { player: "useCardToAfter" },
				forced: true,
				filter(event, player) {
					if (event.card.name === "feibiao") {
						return event.target.isIn() && player.canUse("sha", event.target, false);
					}
					return false;
				},
				logTarget: "target",
				autodelay: 0.5,
				content() {
					player.useCard(trigger.target, { name: "sha" }, false).line = false;
				},
			},
		},
	},
	xianju: {
		trigger: { global: "roundStart" },
		forced: true,
		init(player) {
			if (game.roundNumber % 2 === 1) {
				player.addTempSkill("qianxing", "roundStart");
			}
		},
		filter(event, player) {
			return game.roundNumber % 2 === 1;
		},
		content() {
			if (game.roundNumber % 2 === 1) {
				player.addTempSkill("qianxing", "roundStart");
			} else {
				var list = get.typeCard("jiguan");
				for (var i = 0; i < list.length; i++) {
					if (lib.card[list[i]].derivation) {
						list.splice(i--, 1);
					}
				}
				if (list.length) {
					player.gain(game.createCard(list.randomGet()), "draw");
				}
			}
		},
		subSkill: {
			gain: {
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return game.roundNumber % 2 === 0;
				},
				content() {
					var list = get.typeCard("jiguan");
					for (var i = 0; i < list.length; i++) {
						if (lib.card[list[i]].derivation) {
							list.splice(i--, 1);
						}
					}
					if (list.length) {
						player.gain(game.createCard(list.randomGet()), "draw");
					}
				},
			},
		},
	},
	humeng: {
		init(player) {
			player.storage.humeng = [];
		},
		locked: true,
		group: ["humeng_count", "humeng_call", "humeng_dying"],
		unique: true,
		juexingji: true,
		threaten(player, target) {
			if (target.hasSkill("humeng_sub")) {
				return 1.6;
			}
			return 1;
		},
		subSkill: {
			call: {
				trigger: { player: "humeng_yanjia" },
				forced: true,
				skillAnimation: true,
				animationColor: "water",
				content() {
					player.addSkill("humeng_sub");
				},
			},
			sub: {
				init(player) {
					player.markSkillCharacter("humeng_sub", "gjqt_yanjiaxieyi", "偃甲谢衣", "当你进入濒死状态时激活此替身");
				},
			},
			dying: {
				unique: true,
				skillAnimation: true,
				animationColor: "water",
				trigger: { player: "dying" },
				priority: 10,
				forced: true,
				juexingji: true,
				content() {
					"step 0";
					player.discard(player.getCards("hej"));
					if (player.hasSkill("humeng_sub")) {
						event.yanjia = true;
						player.removeSkill("humeng_sub");
					}
					"step 1";
					player.link(false);
					"step 2";
					player.turnOver(false);
					"step 3";
					player.draw(4);
					player.reinit(get.character(player.name2, 3).includes("humeng") ? player.name2 : player.name1, "gjqt_chuqi");
					player.hp = player.maxHp;
					"step 4";
					if (event.yanjia) {
						var tag = player.addSubPlayer({
							name: "gjqt_yanjiaxieyi",
							skills: ["xianju"],
							hs: get.cards(2),
							hp: 2,
							maxHp: 2,
						});
						player.callSubPlayer(tag);
					}
				},
			},
			count: {
				trigger: { player: "useCardAfter" },
				silent: true,
				filter(event, player) {
					if (player.storage.humeng_yanjia) {
						return false;
					}
					return event.card.name.indexOf("yanjiadan_") === 0;
				},
				content() {
					player.storage.humeng.add(trigger.card.name.slice(10));
					if (player.storage.humeng.length === 4 && !player.hasSkill("humeng_sub")) {
						event.trigger("humeng_yanjia");
					}
				},
			},
		},
	},
	xunjian: {
		trigger: { player: ["useCard", "respond"] },
		forced: true,
		filter(event, player) {
			if (!player.storage.lingyan) {
				return false;
			}
			if (event.getRand() > player.storage.lingyan.length / 13) {
				return false;
			}
			return get.cardPile2(event.card.name) ? true : false;
		},
		content() {
			var card = get.cardPile2(trigger.card.name);
			if (card) {
				player.gain(card, "gain2");
			}
		},
	},
	lingyan: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var nums = [];
			for (var i = 0; i < player.storage.lingyan.length; i++) {
				nums.add(player.storage.lingyan[i].number);
			}
			return player.hasCard(function (card) {
				return !nums.includes(card.number);
			}, "h");
		},
		init(player) {
			player.storage.lingyan = [];
		},
		intro: {
			mark(dialog, storage, player) {
				if (Array.isArray(player.storage.humeng) && player.storage.humeng.length) {
					dialog.addText("武将牌");
					dialog.addSmall(storage);
					dialog.addText("偃甲蛋");
					var cards = [];
					for (var i = 0; i < player.storage.humeng.length; i++) {
						var suit = player.storage.humeng[i];
						cards.push(game.createCard("yanjiadan_" + suit, suit, ""));
					}
					dialog.addSmall(cards);
				} else {
					dialog.addAuto(storage);
				}
			},
		},
		filterCard(card, player) {
			var nums = [];
			for (var i = 0; i < player.storage.lingyan.length; i++) {
				nums.add(player.storage.lingyan[i].number);
			}
			return !nums.includes(card);
		},
		check(card) {
			return 8 - get.value(card);
		},
		discard: false,
		prepare(cards, player) {
			player.$give(cards, player, false);
		},
		content() {
			player.storage.lingyan.add(cards[0]);
			player.syncStorage("lingyan");
			player.markSkill("lingyan");
			player.updateMarks();
			var name = "yanjiadan_" + get.suit(cards[0]);
			if (lib.card[name]) {
				player.gain(game.createCard(name), "gain2");
			}
		},
		ai: {
			threaten: 1.4,
			order: 4,
			result: {
				player: 1,
			},
		},
	},
	woxue: {
		trigger: { player: ["useCardAfter", "respondAfter"] },
		filter(event, player) {
			if (!_status.currentPhase || _status.currentPhase === player) {
				return false;
			}
			return !_status.currentPhase.hasSkill("gw_ciguhanshuang");
		},
		check(event, player) {
			return get.attitude(player, _status.currentPhase) < 0;
		},
		logTarget() {
			return _status.currentPhase;
		},
		content() {
			player.useCard({ name: "gw_baishuang" }, _status.currentPhase).animate = false;
		},
		ai: {
			threaten: 0.9,
		},
	},
	yange: {
		trigger: { player: "phaseBeginStart" },
		direct: true,
		init(player) {
			if (player.storage.yange > 0) {
				player.markSkill("yange");
			}
		},
		filter(event, player) {
			return player.storage.yange > 0;
		},
		content() {
			"step 0";
			player
				.chooseTarget(function (card, player, target) {
					return player !== target;
				}, get.prompt2("yange"))
				.set("pskill", trigger.skill)
				.set("ai", function (target) {
					if (_status.event.pskill) {
						return 0;
					}
					var player = _status.event.player;
					var nh = player.countCards("h");
					var nh2 = target.countCards("h");
					var num = nh2 - nh;
					if (player.hp === 1) {
						return num;
					}
					if (get.threaten(target) >= 1.5) {
						if (num < 2) {
							return 0;
						}
					} else {
						if (num < 3) {
							return 0;
						}
					}
					return num + Math.sqrt(get.threaten(target));
				});
			"step 1";
			if (result.bool) {
				player.storage.yange--;
				if (player.storage.yange <= 0) {
					player.unmarkSkill("yange");
				} else {
					player.updateMarks();
				}
				var target = result.targets[0];
				player.logSkill("yange", target);
				var clone = function (pos) {
					var cloned = [];
					var cards = target.getCards(pos);
					for (var i = 0; i < cards.length; i++) {
						cloned.push(game.createCard(cards[i]));
					}
					return cloned;
				};
				var tag = player.addSubPlayer({
					name: target.name,
					skills: target.getStockSkills().concat("yange_exit"),
					hs: clone("h"),
					es: clone("e"),
					hp: target.hp,
					maxHp: target.maxHp,
					intro: "回合结束后切换回主武将",
				});
				player.callSubPlayer(tag);
			}
		},
		intro: {
			content: "mark",
		},
		group: "yange_init",
		subSkill: {
			init: {
				trigger: { global: "gameStart", player: "enterGame" },
				forced: true,
				popup: false,
				content() {
					player.storage.yange = game.countPlayer(function (current) {
						return current.isEnemiesOf(player);
					});
					player.markSkill("yange");
				},
			},
			exit: {
				trigger: { player: "phaseAfter" },
				silent: true,
				content() {
					player.exitSubPlayer(true);
					if (lib.filter.filterTrigger(trigger, player, "phaseAfter", "lianjing")) {
						game.createTrigger("phaseAfter", "lianjing", player, trigger);
					}
				},
			},
		},
		ai: {
			threaten: 1.5,
		},
	},
	lianjing: {
		unique: true,
		trigger: { player: "phaseAfter" },
		direct: true,
		round: 2,
		filter(event, player) {
			if (event.skill) {
				return false;
			}
			return true;
		},
		content() {
			"step 0";
			player
				.chooseTarget([1, 2], get.prompt2("lianjing"), function (card, player, target) {
					return player !== target;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target);
					var nh = target.countCards("h");
					if (att < 0) {
						for (var i = 0; i < ui.selected.targets.length; i++) {
							if (get.attitude(player, ui.selected.targets[i]) < 0) {
								return 0;
							}
						}
						if (target.hp === 1) {
							if (nh === 0) {
								return 2;
							}
							if (nh === 1) {
								return 1;
							}
						}
					} else if (att > 0) {
						if (target.isTurnedOver()) {
							return 2.5;
						}
						if (target.hp === 1) {
							if (nh === 0) {
								return 2;
							}
							if (nh === 1) {
								return 0.9;
							}
							if (ui.selected.targets.length) {
								return 0.3;
							}
						} else if (target.hp === 2) {
							if (nh === 0) {
								return 1.5;
							}
							if (nh === 1) {
								return 0.5;
							}
							if (ui.selected.targets.length) {
								return 0.2;
							}
						} else if (target.hp === 3) {
							if (nh === 0) {
								return 0.4;
							}
							if (nh === 1) {
								return 0.35;
							}
							if (ui.selected.targets.length) {
								return 0.1;
							}
						}
						if (!target.needsToDiscard(2)) {
							return 0.2;
						}
						if (ui.selected.targets.length || !player.needsToDiscard(2)) {
							return 0.05;
						}
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				player.logSkill("lianjing", result.targets);
				player.insertEvent("lianjing", lib.skill.lianjing.content_phase);
				player.storage.lianjing_targets = result.targets.slice(0);
				game.delay();
			}
		},
		content_phase() {
			"step 0";
			event.forceDie = true;
			event.list = [player].concat(player.storage.lianjing_targets);
			event.exlist = [];
			event.list.sortBySeat();
			delete player.storage.lianjing_targets;
			for (var i = 0; i < game.players.length; i++) {
				if (!event.list.includes(game.players[i])) {
					game.players[i].out("lianjing");
					event.exlist.push(game.players[i]);
				}
			}
			"step 1";
			if (event.list.length) {
				event.list.shift().phase("lianjing");
				event.redo();
			}
			"step 2";
			for (var i = 0; i < event.exlist.length; i++) {
				event.exlist[i].in("lianjing");
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	cihong: {
		round: 3,
		trigger: { player: "phaseEnd" },
		direct: true,
		content() {
			"step 0";
			var goon = false;
			if (
				player.countCards("he", function (card) {
					return get.value(card) < 8 && get.color(card) === "red";
				})
			) {
				goon = true;
			} else if (
				game.hasPlayer(function (current) {
					return current.hp === 1 && player.canUse("sha", current, false) && get.attitude(player, current) < 0 && get.effect(current, { name: "sha" }, player, player) > 0;
				})
			) {
				if (player.hp > 1 || !player.isTurnedOver()) {
					goon = true;
				}
			}
			player
				.chooseTarget(get.prompt("cihong"), function (card, playe, target) {
					return player.canUse("sha", target, false);
				})
				.set("ai", function (target) {
					if (!_status.event.goon) {
						return false;
					}
					var player = _status.event.player;
					if (get.attitude(player, target) >= 0) {
						return false;
					}
					if (target.hp > 3) {
						return false;
					}
					return get.effect(target, { name: "sha" }, player, player);
				})
				.set("goon", goon);
			"step 1";
			if (result.bool) {
				event.target = result.targets[0];
				player.logSkill("cihong", event.target);
			} else {
				event.finish();
			}
			"step 2";
			if (event.target.isAlive() && player.countCards("he", { color: "red" })) {
				player.chooseToDiscard("he", { color: "red" }, "是否弃置一张红色牌视为对" + get.translation(event.target) + "使用一张杀？").set("ai", function (card) {
					return 8 - get.value(card);
				});
			} else {
				event.goto(4);
			}
			"step 3";
			if (result.bool) {
				player.useCard({ name: "sha" }, event.target);
			}
			"step 4";
			if (event.target.isAlive()) {
				player.chooseBool("是否失去1点体力并视为对" + get.translation(event.target) + "使用一张杀？").set("choice", player.hp > event.target.hp && player.hp > 1 && event.target.hp > 0);
			} else {
				event.finish();
			}
			"step 5";
			if (result.bool) {
				player.loseHp();
				player.useCard({ name: "sha" }, event.target);
			}
			"step 6";
			if (event.target.isAlive() && !player.isTurnedOver()) {
				player.chooseBool("是将武将牌翻至背面并视为对" + get.translation(event.target) + "使用一张杀？").set("choice", event.target.hp === 1);
			} else {
				event.finish();
			}
			"step 7";
			if (result.bool) {
				player.turnOver(true);
				player.useCard({ name: "sha" }, event.target);
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	zhenying: {
		trigger: { player: ["useCard", "respond"] },
		forced: true,
		filter(event, player) {
			if (!event.card.isCard) {
				return false;
			}
			if (event.cards[0] && event.cards[0].zhenying_link) {
				return false;
			}
			if (get.color(event.card) !== "black") {
				return false;
			}
			if (["delay", "equip"].includes(get.type(event.card))) {
				return false;
			}
			return true;
		},
		content() {
			var fake = game.createCard(trigger.card);
			fake.zhenying_link = true;
			player.gain(fake, "draw")._triggered = null;
			fake.classList.add("glow");
			fake._destroy = "zhenying";
			fake._modUseful = function () {
				return 0.1;
			};
			fake._modValue = function () {
				return 0.1;
			};
		},
		group: ["zhenying_discard", "zhenying_lose"],
		subSkill: {
			discard: {
				trigger: { player: ["useCardAfter", "respondAfter"] },
				forced: true,
				filter(event, player) {
					if (get.is.converted(event)) {
						return false;
					}
					if (!player.countCards("he")) {
						return false;
					}
					if (event.cards[0] && event.cards[0].zhenying_link) {
						return true;
					}
					return false;
				},
				popup: false,
				content() {
					player.chooseToDiscard("he", true);
				},
			},
			lose: {
				trigger: { global: "phaseAfter" },
				silent: true,
				content() {
					var hs = player.getCards("h", function (card) {
						return card.zhenying_link ? true : false;
					});
					if (hs.length) {
						player.lose(hs)._triggered = null;
					}
				},
			},
		},
	},
	lingnu: {
		trigger: { source: "damageEnd" },
		forced: true,
		init(player) {
			player.storage.lingnu = {};
		},
		ai: {
			threaten: 1.3,
		},
		filter(event, player) {
			var num = 0;
			for (var i in player.storage.lingnu) {
				num++;
				if (num >= 3) {
					return false;
				}
			}
			return event.num > 0;
		},
		content() {
			var check = function (list) {
				for (var i = 0; i < list.length; i++) {
					var info = lib.skill[list[i]];
					if (!info) {
						continue;
					}
					if (info.shaRelated) {
						return true;
					}
					if (info.shaRelated === false) {
						return false;
					}
					if (get.skillInfoTranslation(list[i], player).includes("【杀】")) {
						return true;
					}
				}
				return false;
			};
			var list = get.gainableSkills(function (info, skill) {
				if (player.storage.lingnu[list]) {
					return false;
				}
				var list = [skill];
				game.expandSkills(list);
				return check(list);
			}, player);
			var num = 0;
			for (var i in player.storage.lingnu) {
				num++;
			}
			for (var i = 0; i < trigger.num; i++) {
				if (num >= 3) {
					break;
				}
				if (list.length) {
					var skill = list.randomGet();
					player.addAdditionalSkill("lingnu", skill, true);
					player.storage.lingnu[skill] = 3;
					player.popup(skill);
					game.log(player, "获得了技能", "【" + get.translation(skill) + "】");
					player.markSkill("lingnu");
					num++;
				}
			}
		},
		intro: {
			content(storage) {
				var str = '<ul style="padding-top:0;margin-top:0">';
				for (var i in storage) {
					str += "<li>" + get.translation(i) + "：剩余" + storage[i] + "回合";
				}
				str += "</ul>";
				return str;
			},
			markcount(storage) {
				var num = 0;
				for (var i in storage) {
					num++;
				}
				return num;
			},
		},
		group: "lingnu_remove",
		subSkill: {
			remove: {
				trigger: { player: "phaseAfter" },
				silent: true,
				content() {
					var clear = true;
					for (var i in player.storage.lingnu) {
						player.storage.lingnu[i]--;
						if (player.storage.lingnu[i] <= 0) {
							delete player.storage.lingnu[i];
							player.removeAdditionalSkill("lingnu", i);
						} else {
							clear = false;
						}
					}
					if (clear) {
						player.unmarkSkill("lingnu");
					} else {
						player.updateMarks();
					}
				},
			},
		},
	},
	zuiji: {
		enable: "phaseUse",
		filterCard: true,
		position: "he",
		viewAs: { name: "jiu" },
		viewAsFilter(player) {
			if (!player.countCards("he")) {
				return false;
			}
		},
		prompt: "将一张手牌或装备牌当酒使用",
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			threaten: 1.2,
		},
	},
	manwu: {
		trigger: { global: "phaseEnd" },
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		filter(event, player) {
			return event.player.isMinHandcard();
		},
		logTarget: "player",
		content() {
			trigger.player.draw();
		},
		ai: {
			expose: 0.1,
		},
	},
	xfanghua: {
		trigger: { target: "useCardToBegin" },
		priority: -1,
		filter(event, player) {
			return get.color(event.card) === "red" && player.isDamaged();
		},
		frequent: true,
		content() {
			player.recover();
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.color(card) === "red" && target.isDamaged()) {
						return [1, 1];
					}
				},
			},
		},
	},
	duhun: {
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type !== "dying") {
				return false;
			}
			if (player !== event.dying) {
				return false;
			}
			if (player.maxHp <= 1) {
				return false;
			}
			if (player.countCards("h") === 0) {
				return false;
			}
			return true;
		},
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h") > 0 && target.hp > 0 && target.hp <= player.maxHp;
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (!result.bool) {
				player.die();
				event.finish();
			} else {
				event.num = target.hp - player.hp;
				player.loseMaxHp();
			}
			"step 2";
			player.changeHp(event.num);
			"step 3";
			event.target.changeHp(-event.num);
			"step 4";
			if (event.target.hp <= 0) {
				event.target.dying({ source: player });
			}
		},
		ai: {
			order: 1,
			skillTagFilter(player) {
				if (player.maxHp <= 1) {
					return false;
				}
				if (player.hp > 0) {
					return false;
				}
				if (player.countCards("h") === 0) {
					return false;
				}
			},
			save: true,
			result: {
				target: -1,
				player: 1,
			},
			threaten: 2,
		},
	},
	yunyin: {
		trigger: { player: "phaseEnd" },
		direct: true,
		subSkill: {
			count: {
				trigger: { player: "useCard" },
				silent: true,
				filter(event, player) {
					return _status.currentPhase === player;
				},
				content() {
					if (!player.storage.yunyin) {
						player.storage.yunyin = [];
					}
					var suit = get.suit(trigger.card);
					if (suit) {
						player.storage.yunyin.add(suit);
					}
				},
			},
			set: {
				trigger: { player: "phaseAfter" },
				silent: true,
				content() {
					delete player.storage.yunyin;
				},
			},
		},
		filter(event, player) {
			if (!player.storage.yunyin) {
				return true;
			}
			var hs = player.getCards("h");
			for (var i = 0; i < hs.length; i++) {
				if (!player.storage.yunyin.includes(get.suit(hs[i]))) {
					return true;
				}
			}
			return false;
		},
		group: ["yunyin_count", "yunyin_set"],
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt("yunyin"), function (card) {
					if (!player.storage.yunyin) {
						return true;
					}
					return !player.storage.yunyin.includes(get.suit(card));
				})
				.set("logSkill", "yunyin").ai = function (card) {
				return 9 - get.value(card);
			};
			"step 1";
			if (!result.bool) {
				event.finish();
				return;
			}
			var list = [];
			for (var i = 0; i < lib.inpile.length; i++) {
				var name = lib.inpile[i];
				var type = get.type(name);
				if (type === "trick" || type === "basic") {
					if (lib.filter.cardEnabled({ name: name }, player)) {
						list.push([get.translation(type), "", name]);
					}
				}
			}
			var dialog = ui.create.dialog("云音", [list, "vcard"]);
			var taoyuan = 0,
				nanman = 0;
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				var eff1 = get.effect(players[i], { name: "taoyuan" }, player, player);
				var eff2 = get.effect(players[i], { name: "nanman" }, player, player);
				if (eff1 > 0) {
					taoyuan++;
				} else if (eff1 < 0) {
					taoyuan--;
				}
				if (eff2 > 0) {
					nanman++;
				} else if (eff2 < 0) {
					nanman--;
				}
			}
			player.chooseButton(dialog).ai = function (button) {
				var name = button.link[2];
				if (Math.max(taoyuan, nanman) > 1) {
					if (taoyuan > nanman) {
						return name === "taoyuan" ? 1 : 0;
					}
					return name === "nanman" ? 1 : 0;
				}
				if (player.countCards("h") < player.hp && player.hp >= 2) {
					return name === "wuzhong" ? 1 : 0;
				}
				if (player.hp < player.maxHp && player.hp < 3) {
					return name === "tao" ? 1 : 0;
				}
				return name === "zengbin" ? 1 : 0;
			};
			"step 2";
			if (result.bool) {
				player.chooseUseTarget(true, result.links[0][2]);
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	shishui: {
		trigger: { player: "useCardToBegin" },
		filter(event, player) {
			return event.target && get.color(event.card) === "red";
		},
		forced: true,
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		content() {
			"step 0";
			if (get.info(trigger.card).multitarget) {
				event.list = trigger.targets.slice(0);
			} else {
				trigger.target.loseHp();
				event.finish();
			}
			"step 1";
			if (event.list.length) {
				event.list.shift().loseHp();
				event.redo();
			}
		},
		ai: {
			halfneg: true,
			effect: {
				player(card, player, target, current) {
					if (get.color(card) === "red") {
						return [1, 0, 1, -2];
					}
				},
			},
		},
	},
	chizhen: {
		trigger: { player: "phaseUseBegin" },
		frequent: true,
		content() {
			"step 0";
			event.num = Math.max(1, player.maxHp - player.hp);
			player.draw(event.num);
			"step 1";
			player.chooseToDiscard("he", event.num, true);
			"step 2";
			var useCard = false;
			if (result.bool && result.cards) {
				for (var i = 0; i < result.cards.length; i++) {
					if (result.cards[i].name === "sha") {
						useCard = true;
						break;
					}
				}
			}
			if (useCard) {
				player
					.chooseTarget("是否视为使用一张决斗？", function (card, player, target) {
						return lib.filter.targetEnabled({ name: "juedou" }, player, target);
					})
					.set("ai", function (target) {
						return get.effect(target, { name: "juedou" }, _status.event.player);
					});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				player.useCard({ name: "juedou" }, result.targets);
			}
		},
		ai: {
			threaten(player, target) {
				return Math.sqrt(Math.max(1, target.maxHp - target.hp));
			},
		},
	},
	dangping: {
		trigger: { source: "damageAfter" },
		direct: true,
		filter(event, player) {
			return event.parent.name !== "dangping" && !player.hasSkill("dangping2") && player.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.chooseCardTarget({
				position: "he",
				filterTarget(card, player, target) {
					return player !== target && trigger.player !== target && get.distance(trigger.player, target) <= 1;
				},
				filterCard: lib.filter.cardDiscardable,
				ai1(card) {
					return get.unuseful(card) + 9;
				},
				ai2(target) {
					return get.damageEffect(target, player, player);
				},
				prompt: get.prompt("dangping"),
			});
			"step 1";
			if (result.bool) {
				player.discard(result.cards);
				player.logSkill("dangping", result.targets);
				player.addTempSkill("dangping2");
			}
			"step 2";
			if (result.bool) {
				result.targets[0].damage();
			}
		},
	},
	dangping2: {},
	xiuhua: {
		trigger: { global: ["loseEnd", "discardAfter"] },
		filter(event, player) {
			if (event.player === player) {
				return false;
			}
			if (event.name === "lose" && event.parent.name !== "equip") {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (get.type(event.cards[i]) === "equip" && get.position(event.cards[i]) === "d") {
					return true;
				}
			}
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
				if (get.type(trigger.cards[i]) === "equip" && get.position(trigger.cards[i]) === "d") {
					cards.push(trigger.cards[i]);
				}
			}
			if (cards.length) {
				player.gain(cards, "gain2", "log");
			}
		},
	},
	liuying: {
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (!player.storage.liuying) {
				player.storage.liuying = [];
			}
			return (
				event.card &&
				event.card.name === "sha" &&
				game.hasPlayer(function (current) {
					return !player.storage.liuying.includes(current) && player.canUse("sha", current, false);
				})
			);
		},
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("liuying"), function (card, player, target) {
				return !player.storage.liuying.includes(target) && player.canUse("sha", target, false);
			}).ai = function (target) {
				return get.effect(target, { name: "sha" }, player, player);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("liuying", result.targets);
				event.target = result.targets[0];
				var cards = get.cards();
				player.showCards(cards, get.translation(player) + "对" + get.translation(result.targets) + "发动了【流影】");
				event.bool = get.color(cards[0]) === "black";
			} else {
				event.finish();
			}
			"step 2";
			if (event.bool) {
				player.useCard({ name: "sha" }, event.target, false).animate = false;
			}
		},
		group: ["liuying_count1", "liuying_count2"],
		subSkill: {
			count1: {
				trigger: { player: "shaAfter" },
				silent: true,
				content() {
					if (!player.storage.liuying) {
						player.storage.liuying = [];
					}
					player.storage.liuying.add(trigger.target);
				},
			},
			count2: {
				trigger: { player: "phaseAfter" },
				silent: true,
				content() {
					delete player.storage.liuying;
				},
			},
		},
	},
	yanjia: {
		enable: "phaseUse",
		filter(event, player) {
			var he = player.getCards("he");
			var num = 0;
			for (var i = 0; i < he.length; i++) {
				var info = lib.card[he[i].name];
				if (info.type === "equip" && !info.nomod && !info.unique && lib.inpile.includes(he[i].name)) {
					num++;
					if (num >= 2) {
						return true;
					}
				}
			}
		},
		filterCard(card) {
			if (ui.selected.cards.length && card.name === ui.selected.cards[0].name) {
				return false;
			}
			var info = get.info(card);
			return info.type === "equip" && !info.nomod && !info.unique && lib.inpile.includes(card.name);
		},
		selectCard: 2,
		position: "he",
		check(card) {
			return get.value(card);
		},
		content() {
			var name = cards[0].name + "_" + cards[1].name;
			var info1 = get.info(cards[0]),
				info2 = get.info(cards[1]);
			if (!lib.card[name]) {
				var info = {
					enable: true,
					type: "equip",
					subtype: get.subtype(cards[0]),
					vanish: true,
					cardimage: info1.cardimage || cards[0].name,
					filterTarget(card, player, target) {
						return target === player;
					},
					selectTarget: -1,
					modTarget: true,
					content: lib.element.content.equipCard,
					legend: true,
					source: [cards[0].name, cards[1].name],
					onEquip: [],
					onLose: [],
					skills: [],
					distance: {},
					ai: {
						order: 8.9,
						equipValue: 10,
						useful: 2.5,
						value(card, player) {
							var value = 0;
							var info = get.info(card);
							var current = player.getEquip(info.subtype);
							if (current && card !== current) {
								value = get.value(current, player);
							}
							var equipValue = info.ai.equipValue || info.ai.basic.equipValue;
							if (typeof equipValue === "function") {
								return equipValue(card, player) - value;
							}
							return equipValue - value;
						},
						result: {
							target(player, target) {
								return get.equipResult(player, target, name);
							},
						},
					},
				};
				for (var i in info1.distance) {
					info.distance[i] = info1.distance[i];
				}
				for (var i in info2.distance) {
					if (typeof info.distance[i] === "number") {
						info.distance[i] += info2.distance[i];
					} else {
						info.distance[i] = info2.distance[i];
					}
				}
				if (info1.skills) {
					info.skills = info.skills.concat(info1.skills);
				}
				if (info2.skills) {
					info.skills = info.skills.concat(info2.skills);
				}
				if (info1.onEquip) {
					if (Array.isArray(info1.onEquip)) {
						info.onEquip = info.onEquip.concat(info1.onEquip);
					} else {
						info.onEquip.push(info1.onEquip);
					}
				}
				if (info2.onEquip) {
					if (Array.isArray(info2.onEquip)) {
						info.onEquip = info.onEquip.concat(info2.onEquip);
					} else {
						info.onEquip.push(info2.onEquip);
					}
				}
				if (info1.onLose) {
					if (Array.isArray(info1.onLose)) {
						info.onLose = info.onLose.concat(info1.onLose);
					} else {
						info.onLose.push(info1.onLose);
					}
				}
				if (info2.onLose) {
					if (Array.isArray(info2.onLose)) {
						info.onLose = info.onLose.concat(info2.onLose);
					} else {
						info.onLose.push(info2.onLose);
					}
				}
				if (info.onEquip.length === 0) {
					delete info.onEquip;
				}
				if (info.onLose.length === 0) {
					delete info.onLose;
				}
				lib.card[name] = info;
				lib.translate[name] = get.translation(cards[0].name, "skill") + get.translation(cards[1].name, "skill");
				var str = lib.translate[cards[0].name + "_info"];
				if (str[str.length - 1] === "." || str[str.length - 1] === "。") {
					str = str.slice(0, str.length - 1);
				}
				lib.translate[name + "_info"] = str + "；" + lib.translate[cards[1].name + "_info"];
				try {
					game.addVideo("newcard", null, {
						name: name,
						translate: lib.translate[name],
						info: lib.translate[name + "_info"],
						card: cards[0].name,
						legend: true,
					});
				} catch (e) {
					console.log(e);
				}
			}
			player.gain(game.createCard({ name: name, suit: cards[0].suit, number: cards[0].number }), "gain2");
		},
		ai: {
			order: 9.5,
			result: {
				player: 1,
			},
		},
	},
	meiying: {
		globalSilent: true,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return (
				event.player !== player &&
				event.player.isAlive() &&
				player.countCards("he", { color: "red" }) > 0 &&
				event.player.getHistory("useCard", evt => {
					return evt.targets && evt.targets.some(i => i !== event.player);
				}).length === 0
			);
		},
		direct: true,
		content() {
			"step 0";
			var next = player.chooseToDiscard("he", "魅影：是否弃置一张红色牌视为对" + get.translation(trigger.player) + "使用一张杀？");
			next.logSkill = ["meiying", trigger.player];
			var eff = get.effect(trigger.player, { name: "sha" }, player, player);
			next.ai = function (card) {
				if (eff > 0) {
					return 7 - get.value(card);
				}
				return 0;
			};
			"step 1";
			if (result.bool) {
				player.useCard({ name: "sha" }, trigger.player).animate = false;
			}
		},
		ai: {
			expose: 0.1,
		},
	},
	jianwu: {
		trigger: { player: "shaBegin" },
		forced: true,
		filter(event, player) {
			return get.distance(event.target, player, "attack") > 1;
		},
		content() {
			trigger.directHit = true;
		},
	},
	zuizhan: {
		trigger: { player: "useCard" },
		popup: false,
		filter(event, player) {
			if (event.card.name !== "sha") {
				return false;
			}
			return game.hasPlayer(function (current) {
				return event.targets.includes(current) === false && current !== player && lib.filter.targetEnabled(event.card, player, current);
			});
		},
		content() {
			var list = game.filterPlayer(function (current) {
				return trigger.targets.includes(current) === false && current !== player && lib.filter.targetEnabled(trigger.card, player, current);
			});
			if (list.length) {
				event.target = list.randomGet();
				player.line(event.target, "green");
				game.log(event.target, "被追加为额外目标");
				trigger.targets.push(event.target);
				player.draw();
			}
		},
	},
	xidie: {
		trigger: { player: "phaseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("h") > player.hp;
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt("xidie"), [1, Math.min(3, player.countCards("h") - player.hp)]);
			next.ai = function (card) {
				return 6 - get.value(card);
			};
			next.logSkill = "xidie";
			"step 1";
			if (result.bool) {
				player.storage.xidie = result.cards.length;
			}
		},
		group: "xidie2",
	},
	xidie2: {
		trigger: { player: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return player.storage.xidie > 0;
		},
		content() {
			player.draw(player.storage.xidie);
			player.storage.xidie = 0;
		},
	},
	meihu: {
		trigger: { player: "damageEnd" },
		check(event, player) {
			return get.attitude(player, event.source) < 4;
		},
		filter(event, player) {
			return event.source && event.source !== player && event.source.countCards("h") > 0;
		},
		logTarget: "source",
		content() {
			"step 0";
			trigger.source.chooseCard("交给" + get.translation(player) + "一张手牌", true).ai = function (card) {
				return -get.value(card);
			};
			"step 1";
			if (result.bool) {
				player.gain(result.cards[0], trigger.source);
				trigger.source.$give(1, player);
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1.5];
						}
						return [1, 0, 0, -0.5];
					}
				},
			},
		},
	},
	xlqianhuan: {
		trigger: { player: "phaseAfter" },
		check(event, player) {
			return player.hp === 1 || player.isTurnedOver();
		},
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		locked: false,
		content() {
			"step 0";
			player.recover();
			"step 1";
			player.turnOver();
		},
		mod: {
			targetEnabled(card, player, target) {
				if (target.isTurnedOver()) {
					return false;
				}
			},
			cardEnabled(card, player) {
				if (player.isTurnedOver()) {
					return false;
				}
			},
		},
	},
	fumo: {
		trigger: { player: "damageAfter" },
		filter(event, player) {
			return (event.source && event.source.isAlive() && player.countCards("h", { color: "red" }) > 1) || player.countCards("h", { color: "black" }) > 1;
		},
		direct: true,
		content() {
			"step 0";
			var next = player
				.chooseToDiscard(get.prompt("fumo", trigger.source), 2, function (card) {
					if (get.damageEffect(trigger.source, player, player, "thunder") <= 0) {
						return 0;
					}
					if (ui.selected.cards.length) {
						return get.color(card) === get.color(ui.selected.cards[0]);
					}
					return player.countCards("h", { color: get.color(card) }) > 1;
				})
				.set("complexCard", true);
			next.ai = function (card) {
				if (get.damageEffect(trigger.source, player, player, "thunder") > 0) {
					return 8 - get.value(card);
				}
				return 0;
			};
			next.logSkill = ["fumo", trigger.source, "thunder"];
			"step 1";
			if (result.bool) {
				trigger.source.damage("thunder");
			}
		},
		ai: {
			maixie_defend: true,
			threaten: 0.8,
		},
	},
	fanyin: {
		trigger: { player: "phaseEnd" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("fanyin"), function (card, player, target) {
				if (target.isLinked()) {
					return true;
				}
				if (target.isTurnedOver()) {
					return true;
				}
				if (target.countCards("j")) {
					return true;
				}
				if (target.isMinHp() && target.isDamaged()) {
					return true;
				}
				return false;
			}).ai = function (target) {
				var num = 0;
				var att = get.attitude(player, target);
				if (att > 0) {
					if (target.isMinHp()) {
						num += 5;
					}
					if (target.isTurnedOver()) {
						num += 5;
					}
					if (target.countCards("j")) {
						num += 2;
					}
					if (target.isLinked()) {
						num++;
					}
					if (num > 0) {
						return num + att;
					}
				}
				return num;
			};
			"step 1";
			if (result.bool) {
				event.target = result.targets[0];
				player.logSkill("fanyin", event.target);
			} else {
				event.finish();
			}
			"step 2";
			if (event.target.isLinked()) {
				event.target.link();
			}
			"step 3";
			if (event.target.isTurnedOver()) {
				event.target.turnOver();
			}
			"step 4";
			var cards = event.target.getCards("j");
			if (cards.length) {
				event.target.discard(cards);
			}
			"step 5";
			if (event.target.isMinHp()) {
				event.target.recover();
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.3,
		},
	},
	mingkong: {
		trigger: { player: "damageBegin" },
		forced: true,
		filter(event, player) {
			return player.countCards("h") === 0 && event.num >= 1;
		},
		content() {
			if (trigger.num >= 1) {
				trigger.num--;
			}
			if (trigger.source) {
				trigger.source.storage.mingkong = true;
				trigger.source.addTempSkill("mingkong2");
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") && target.countCards("h") === 0) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return;
						}
						return 0.1;
					}
				},
			},
		},
	},
	mingkong2: {
		trigger: { source: ["damageEnd", "damageZero"] },
		forced: true,
		popup: false,
		audio: false,
		vanish: true,
		filter(event, player) {
			return player.storage.mingkong ? true : false;
		},
		content() {
			player.draw();
			player.storage.mingkong = false;
			player.removeSkill("mingkong2");
		},
	},
	gjqtwuxie: {
		mod: {
			targetEnabled(card, player, target) {
				if (get.type(card) === "delay" && player !== target) {
					return false;
				}
			},
		},
	},
	yuehua: {
		trigger: { player: ["useCardAfter", "respondAfter", "discardAfter"] },
		frequent: true,
		filter(event, player) {
			if (player === _status.currentPhase) {
				return false;
			}
			if (event.cards) {
				for (var i = 0; i < event.cards.length; i++) {
					if (get.color(event.cards[i]) === "red" && event.cards[i].original !== "j") {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			player.draw();
		},
		ai: {
			threaten: 0.7,
		},
	},
	qinglan: {
		trigger: { global: "damageBefore" },
		filter(event, player) {
			return Boolean(event.nature) && player.countCards("he") > 0;
		},
		direct: true,
		priority: -5,
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt("qinglan", trigger.player), "he");
			next.logSkill = ["qinglan", trigger.player];
			next.ai = function (card) {
				if (trigger.num > 1 || !trigger.source) {
					if (get.attitude(player, trigger.player) > 0) {
						return 9 - get.value(card);
					}
					return -1;
				} else if (get.attitude(player, trigger.player) > 0) {
					if (trigger.player.hp === 1) {
						return 8 - get.value(card);
					}
					if (trigger.source.hp === trigger.source.maxHp) {
						return 6 - get.value(card);
					}
				} else if (get.attitude(player, trigger.source) > 0 && trigger.source.hp < trigger.source.maxHp && trigger.num <= 1 && trigger.player.hp > 1) {
					if (get.color(card) === "red") {
						return 5 - get.value(card);
					}
				}
				return -1;
			};
			"step 1";
			if (result.bool) {
				trigger.cancel();
				if (trigger.source) {
					trigger.source.recover();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (trigger.source) {
				trigger.source.draw();
			}
		},
		ai: {
			expose: 0.1,
		},
	},
	fanshi: {
		trigger: { player: "phaseDiscardAfter" },
		forced: true,
		filter(event, player) {
			return player.getStat("damage") > 0;
		},
		check(event, player) {
			return player.hp === player.maxHp;
		},
		content() {
			"step 0";
			player.loseHp();
			"step 1";
			player.draw();
		},
	},
	xuelu: {
		unique: true,
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.maxHp > player.hp && player.countCards("he", { color: "red" }) > 0;
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				position: "he",
				filterTarget(card, player, target) {
					return player !== target;
				},
				filterCard(card, player) {
					return get.color(card) === "red" && lib.filter.cardDiscardable(card, player);
				},
				ai1(card) {
					return 9 - get.value(card);
				},
				ai2(target) {
					return get.damageEffect(target, player, player, "fire");
				},
				prompt: get.prompt("xuelu"),
			});
			"step 1";
			if (result.bool) {
				event.target = result.targets[0];
				player.logSkill("xuelu", event.target, "fire");
				event.num = Math.min(2, Math.ceil((player.maxHp - player.hp) / 2));
				player.discard(result.cards);
			} else {
				event.finish();
			}
			"step 2";
			if (event.target) {
				event.target.damage(event.num, "fire");
			}
		},
		ai: {
			maixie: true,
			expose: 0.2,
			threaten(player, target) {
				if (target.hp === 1) {
					return 3;
				}
				if (target.hp === 2) {
					return 1.5;
				}
				return 0.5;
			},
			effect: {
				target(card, player, target) {
					if (!target.hasFriend()) {
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
	shahun: {
		enable: "chooseToUse",
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		derivation: "juejing",
		filter(event, player) {
			return !player.storage.shahun && player.hp <= 0;
		},
		content() {
			"step 0";
			var cards = player.getCards("hej");
			player.discard(cards);
			"step 1";
			if (player.isLinked()) {
				player.link();
			}
			"step 2";
			if (player.isTurnedOver()) {
				player.turnOver();
			}
			"step 3";
			player.draw(3);
			"step 4";
			player.recover(1 - player.hp);
			player.removeSkill("fanshi");
			player.addSkill("juejing");
			player.storage.shahun = 2;
			player.markSkill("shahun");
			game.addVideo("storage", player, ["shahun", player.storage.shahun]);
		},
		group: "shahun2",
		intro: {
			content: "turn",
		},
		ai: {
			save: true,
			skillTagFilter(player) {
				if (player.storage.shahun) {
					return false;
				}
				if (player.hp > 0) {
					return false;
				}
			},
			result: {
				player: 3,
			},
		},
	},
	shahun2: {
		trigger: { player: "phaseAfter" },
		forced: true,
		filter(event, player) {
			return player.storage.shahun ? true : false;
		},
		content() {
			if (player.storage.shahun > 1) {
				player.storage.shahun--;
				game.addVideo("storage", player, ["shahun", player.storage.shahun]);
			} else {
				player.die();
			}
		},
	},
	xuanning: {
		group: ["xuanning1", "xuanning2"],
		intro: {
			content: "mark",
		},
		ai: {
			threaten: 0.9,
		},
	},
	xuanning1: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", { type: "basic" }) > 0 && player.storage.xuanning !== 3;
		},
		filterCard(card) {
			return get.type(card) === "basic";
		},
		check(card) {
			return 7 - get.useful(card);
		},
		content() {
			player.storage.xuanning = 3;
			player.markSkill("xuanning");
			game.addVideo("storage", player, ["xuanning", player.storage.xuanning]);
		},
		ai: {
			result: {
				player(player) {
					var num = player.countCards("h");
					if (num > player.hp + 1) {
						return 1;
					}
					if (player.storage.xuanning >= 2) {
						return 0;
					}
					if (num > player.hp) {
						return 1;
					}
					if (player.storage.xuanning >= 1) {
						return 0;
					}
					return 1;
				},
			},
			order: 5,
		},
	},
	xuanning2: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			if (player.storage.xuanning) {
				return event.source && event.source.countCards("he") > 0;
			}
			return false;
		},
		logTarget: "source",
		content() {
			var he = trigger.source.getCards("he");
			if (he.length) {
				trigger.source.discard(he.randomGet());
			}
			player.storage.xuanning--;
			if (!player.storage.xuanning) {
				player.unmarkSkill("xuanning");
			}
			game.addVideo("storage", player, ["xuanning", player.storage.xuanning]);
		},
		ai: {
			maixie_defend: true,
		},
	},
	liuguang: {
		trigger: { player: "phaseBegin" },
		direct: true,
		filter(event, player) {
			if (player.storage.xuanning) {
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			player.chooseTarget(
				function (card, player, target) {
					return player !== target;
				},
				get.prompt("liuguang"),
				[1, 3]
			).ai = function (target) {
				return get.damageEffect(target, player, player);
			};
			"step 1";
			if (result.bool) {
				player.storage.xuanning--;
				if (!player.storage.xuanning) {
					player.unmarkSkill("xuanning");
				}
				event.targets = result.targets.slice(0);
				event.targets.sort(lib.sort.seat);
				player.logSkill("liuguang", result.targets);
				game.addVideo("storage", player, ["xuanning", player.storage.xuanning]);
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets.length) {
				var target = event.targets.shift();
				var next = target.chooseToDiscard("流光：弃置一张牌或受到1点伤害", "he");
				next.ai = function (card) {
					if (get.damageEffect(_status.event.player, player, _status.event.player) >= 0) {
						return -1;
					}
					if (_status.event.player.hp === 1) {
						return 9 - get.value(card);
					}
					return 8 - get.value(card);
				};
				next.autochoose = function () {
					return this.player.countCards("he") === 0;
				};
				event.current = target;
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool && result.cards && result.cards.length) {
				event.goto(2);
			} else {
				event.current.damage();
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.3,
		},
	},
	yangming: {
		enable: "phaseUse",
		filter(event, player) {
			if (player.storage.yangming2 > 0) {
				return false;
			}
			return player.countCards("h", { color: "red" }) > 0;
		},
		filterCard(card) {
			return get.color(card) === "red";
		},
		content() {
			player.storage.yangming2 = 2;
			player.addSkill("yangming2");
			game.addVideo("storage", player, ["yangming2", player.storage.yangming2]);
		},
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			result: {
				player(player) {
					if (player.countCards("h") <= player.hp && player.hp === player.maxHp) {
						return 0;
					}
					return 1;
				},
			},
			order: 6,
			threaten: 1.3,
		},
	},
	yangming2: {
		trigger: { player: "phaseUseEnd" },
		direct: true,
		mark: true,
		content() {
			"step 0";
			player.storage.yangming2--;
			game.addVideo("storage", player, ["yangming2", player.storage.yangming2]);
			if (player.storage.yangming2 > 0) {
				event.finish();
			} else {
				player.removeSkill("yangming2");
				var num = game.countPlayer(function (current) {
					return get.distance(player, current) <= 1 && current.isDamaged();
				});
				if (num === 0) {
					event.finish();
				} else {
					player.chooseTarget(
						function (card, player, target) {
							return get.distance(player, target) <= 1 && target.hp < target.maxHp;
						},
						"请选择目标回复体力",
						[1, num]
					);
				}
			}
			"step 1";
			if (result.bool) {
				player.logSkill("yangming", result.targets);
				for (var i = 0; i < result.targets.length; i++) {
					result.targets[i].recover();
				}
			}
		},
		intro: {
			content: "turn",
		},
	},
	zhaolu: {
		unique: true,
		mark: true,
		check() {
			return false;
		},
		init(player) {
			player.storage.zhaolu = Math.min(5, game.players.length);
			game.addVideo("storage", player, ["zhaolu", player.storage.zhaolu]);
		},
		trigger: { player: ["phaseEnd", "damageEnd"], global: "dieAfter" },
		forced: true,
		content() {
			var num = 2;
			if (typeof trigger.num === "number") {
				num = 2 * trigger.num;
			}
			if (trigger.name === "phase") {
				num = 1;
			}
			if (trigger.name === "die") {
				num = 2;
			}
			player.storage.zhaolu -= num;
			if (player.storage.zhaolu <= 0) {
				player.loseMaxHp(true);
				player.storage.zhaolu = Math.min(5, game.players.length);
			}
			game.addVideo("storage", player, ["zhaolu", player.storage.zhaolu]);
		},
		intro: {
			content: "turn",
		},
		ai: {
			neg: true,
			mingzhi: false,
			threaten: 0.8,
		},
	},
	jiehuo: {
		unique: true,
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		enable: "phaseUse",
		line: "fire",
		filterTarget(card, player, target) {
			return player !== target;
		},
		content() {
			"step 0";
			target.damage(2, "fire");
			player.awakenSkill(event.name);
			"step 1";
			player.die();
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (player.hp > 1) {
						return false;
					}
					if (target.hp > 2) {
						return false;
					}
					if (get.attitude(player, target) >= 0) {
						return false;
					}
					return get.damageEffect(target, player, player, "fire");
				},
			},
		},
	},
	jiehuo2: {
		trigger: { player: "phaseUseEnd" },
		forced: true,
		popup: false,
		content() {
			player.die();
		},
	},
	yuling: {
		unique: true,
		locked: true,
		group: ["yuling1", "yuling2", "yuling3", "yuling4", "yuling5", "yuling6"],
		intro: {
			content: "time",
		},
		ai: {
			noh: true,
			threaten: 0.8,
			effect: {
				target(card, player, target) {
					if (card.name === "bingliang") {
						return [0, 0];
					}
					if (card.name === "lebu") {
						return 1.5;
					}
					if (card.name === "guohe") {
						if (!target.countCards("e")) {
							return 0;
						}
						return 0.5;
					}
					if (card.name === "liuxinghuoyu") {
						return 0;
					}
				},
			},
		},
	},
	yuling1: {
		trigger: { player: ["phaseDrawBefore", "phaseDiscardBefore"] },
		priority: 10,
		forced: true,
		popup: false,
		check() {
			return false;
		},
		content() {
			trigger.cancel();
		},
	},
	yuling2: {
		trigger: { player: ["loseEnd", "drawEnd"], global: "gameDrawAfter" },
		check(event, player) {
			return player.countCards("h") < 2;
		},
		priority: 10,
		forced: true,
		filter(event, player) {
			return player.countCards("h") < 5;
		},
		content() {
			player.draw(5 - player.countCards("h"));
		},
	},
	yuling3: {
		trigger: { player: "gainEnd" },
		priority: 10,
		forced: true,
		filter(event, player) {
			return player.countCards("h") > 5;
		},
		check(event, player) {
			return player.countCards("h") < 2;
		},
		content() {
			player.chooseToDiscard(true, player.countCards("h") - 5);
		},
	},
	yuling4: {
		mod: {
			cardEnabled(card, player) {
				if (_status.currentPhase !== player) {
					return;
				}
				var num = 2;
				if (player.countUsed() >= player.maxHp + num) {
					return false;
				}
			},
		},
	},
	yuling5: {
		trigger: { player: ["useCardAfter", "phaseBegin"] },
		silent: true,
		content() {
			player.storage.yuling = player.maxHp + 2 - player.countUsed();
		},
	},
	yuling6: {
		trigger: { player: "phaseAfter" },
		silent: true,
		content() {
			delete player.storage.yuling;
		},
	},
};

export default skill;
