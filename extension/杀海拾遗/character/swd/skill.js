import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCharacterConfig['skill'] } */
const skill = {
	cyqiaoxie: {
		trigger: { player: "loseEnd" },
		frequent: true,
		filter(event, player) {
			if (event.type === "use") {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (get.type(event.cards[i]) === "equip") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			event.num = 0;
			for (var i = 0; i < trigger.cards.length; i++) {
				if (get.type(trigger.cards[i]) === "equip") {
					event.num++;
				}
			}
			"step 1";
			var list = get.inpile("jiguan", function (name) {
				return player.hasUseTarget(name);
			});
			if (list.length) {
				var prompt = get.prompt("cyqiaoxie");
				if (event.num > 1) {
					prompt = "###" + prompt + "###（剩余" + get.cnNumber(event.num) + "次）";
				}
				player.chooseVCardButton(list.randomGets(3), prompt);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.chooseUseTarget(true, game.createCard(result.links[0][2]));
			}
			event.num--;
			if (event.num > 0) {
				event.goto(1);
			}
		},
		ai: {
			noe: true,
			reverseEquip: true,
			effect: {
				target(card, player, target, current) {
					if (get.type(card) === "equip") {
						return [1, 3];
					}
				},
			},
		},
	},
	cyxianjiang: {
		trigger: { player: "useCardToBegin" },
		init(player) {
			player.storage.cyxianjiang = [];
		},
		filter(event, player) {
			if (event.target !== player && event.targets && event.targets.length === 1) {
				if (player.storage.cyxianjiang.includes(event.target)) {
					return false;
				}
				return event.target.countCards("e", function (card) {
					return !player.countCards("he", card.name);
				});
			}
			return false;
		},
		direct: true,
		content() {
			"step 0";
			player
				.choosePlayerCard(trigger.target, "e", get.prompt("cyxianjiang"))
				.set("ai", get.buttonValue)
				.set("filterButton", function (button) {
					return !player.countCards("he", button.link.name);
				});
			"step 1";
			if (result.bool) {
				player.logSkill("cyxianjiang");
				var card = result.links[0];
				player.equip(game.createCard(card), true);
				player.storage.cyxianjiang.add(trigger.target);
			}
		},
		group: "cyxianjiang_clear",
		subSkill: {
			clear: {
				trigger: { global: "phaseAfter" },
				silent: true,
				content() {
					player.storage.cyxianjiang.length = 0;
				},
			},
		},
	},
	gxianyin: {
		enable: "phaseUse",
		usable: 1,
		delay: 0,
		filter(event, player) {
			return player.countCards("h");
		},
		content() {
			"step 0";
			var max = 0;
			var choice = "club";
			var map = {
				club: 0,
				heart: 0,
				diamond: 0,
				spade: 0,
			};
			for (var i in map) {
				var hs = player.getCards("h", { suit: i });
				for (var j = 0; j < hs.length; j++) {
					var val = get.value(hs[j], player, "raw");
					if (val > 7) {
						map[i] = 0;
						break;
					} else if (val <= 5) {
						map[i]++;
						if (val <= 4) {
							map[i] += 0.5;
						}
						if (val < 0) {
							map[i] += 2;
						}
					}
				}
				if (map[i] > max) {
					choice = i;
					max = map[i];
				}
			}
			var controls = ["heart2", "spade2", "diamond2", "club2"];
			for (var i = 0; i < controls.length; i++) {
				if (!player.countCards("h", { suit: controls[i].slice(0, controls[i].length - 1) })) {
					controls.splice(i--, 1);
				}
			}
			if (!controls.includes(choice)) {
				choice = controls.randomGet();
			}
			player
				.chooseControl(controls, function () {
					return choice;
				})
				.set("prompt", "移去一种花色的手牌");
			"step 1";
			var hs = player.getCards("h", {
				suit: result.control.slice(0, result.control.length - 1),
			});
			if (hs.length) {
				player.lose(hs, ui.discardPile)._triggered = null;
				player.$throw(hs);
				game.log(player, "移去了", hs);
			} else {
				event.finish();
				return;
			}
			var controls = ["heart2", "spade2", "diamond2", "club2"];
			controls.remove(result.control);
			var rand = Math.random();
			var list = controls.slice(0);
			if (player.hasShan("all")) {
				list.remove("diamond2");
			}
			player
				.chooseControl(controls, function () {
					if (!player.hasShan("all") && controls.includes("diamond2")) {
						return "diamond2";
					}
					if (rand < 0.5) {
						return list[0];
					}
					if (rand < 0.8) {
						return list[1];
					}
					if (list.length >= 3) {
						return controls[2];
					} else {
						return controls[0];
					}
				})
				.set("prompt", "选择一个花色从牌堆中获得" + hs.length + "张该花色的牌");
			event.num = hs.length;
			"step 2";
			if (result.control) {
				var suit = result.control.slice(0, result.control.length - 1);
				var cards = [];
				for (var i = 0; i < event.num; i++) {
					var card = get.cardPile(function (card) {
						return get.suit(card) === suit;
					});
					if (card) {
						ui.special.appendChild(card);
						cards.push(card);
					} else {
						break;
					}
				}
				if (cards.length) {
					player.directgain(cards);
					player.$draw(cards.length);
					game.delay();
					game.log(player, "获得了" + get.cnNumber(cards.length) + "张", "#y" + get.translation(suit + "2") + "牌");
				}
			}
		},
		ai: {
			order: 7,
			result: {
				player(player) {
					var list = ["club", "heart", "diamond", "spade"];
					for (var i = 0; i < list.length; i++) {
						var hs = player.getCards("h", { suit: list[i] });
						var bool = false;
						for (var j = 0; j < hs.length; j++) {
							var val = get.value(hs[j], player);
							if (val > 7) {
								bool = false;
								break;
							} else if (val <= 4) {
								bool = true;
							}
						}
						if (bool) {
							return 1;
						}
					}
					return 0;
				},
			},
		},
	},
	yeying: {
		enable: "phaseUse",
		usable: 1,
		viewAs: { name: "qiankunbiao" },
		viewAsFilter(player) {
			return player.countCards("he", { color: "black" });
		},
		filterCard: { color: "black" },
		position: "he",
		check(card) {
			return 7 - get.value(card);
		},
		ai: {
			threaten: 1.5,
		},
	},
	juxi: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.storage.juxi >= game.countPlayer();
		},
		filterTarget: true,
		init(player) {
			player.storage.juxi = 0;
		},
		init2(player) {
			if (get.mode() === "guozhan") {
				player.logSkill("juxi");
			}
		},
		intro: {
			content: "mark",
		},
		content() {
			"step 0";
			player.storage.juxi -= game.countPlayer();
			player.syncStorage("juxi");
			if (player.storage.juxi <= 0) {
				player.unmarkSkill("juxi");
			} else {
				player.updateMarks();
			}
			if (target.isDamaged()) {
				player
					.chooseControl(function () {
						if (get.attitude(player, target) > 0) {
							return 1;
						}
						return 0;
					})
					.set("choiceList", ["对" + get.translation(target) + "造成1点伤害", "令" + get.translation(target) + "回复1点体力"]);
			} else {
				target.damage();
				event.finish();
			}
			"step 1";
			if (result.control === "选项一") {
				target.damage();
			} else {
				target.recover();
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (get.attitude(player, target) > 0) {
						if (target.isDamaged()) {
							return get.recoverEffect(target, player, target);
						}
						return 0;
					} else {
						return get.damageEffect(target, player, target);
					}
				},
			},
		},
		group: "juxi_count",
		subSkill: {
			count: {
				trigger: { global: "discardAfter" },
				forced: true,
				popup: false,
				filter(event, player) {
					return _status.currentPhase !== event.player;
				},
				content() {
					player.storage.juxi++;
					player.syncStorage("juxi");
					player.markSkill("juxi");
					player.updateMarks();
				},
			},
		},
	},
	jiefen: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countCards("h") > player.countCards("h");
		},
		filter(event, player) {
			return !player.isMaxHandcard();
		},
		content() {
			"step 0";
			target.chooseCard("h", true, "交给" + get.translation(player) + "一张牌");
			"step 1";
			if (result.bool) {
				player.gain(result.cards, target);
				target.$giveAuto(result.cards, player);
			} else {
				event.finish();
			}
			"step 2";
			var nh = player.countCards("h");
			if (
				game.hasPlayer(function (current) {
					return current.countCards("h") < nh;
				})
			) {
				player.chooseCardTarget({
					forced: true,
					filterTarget(card, player, target) {
						return target.countCards("h") < nh;
					},
					filterCard: true,
					ai1(card) {
						return 9 - get.value(card);
					},
					ai2(target) {
						return get.attitude(player, target) / Math.sqrt(target.countCards("h") + 1);
					},
					prompt: "交给一名手牌数少于你的角色一张牌",
				});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool && result.targets && result.targets.length) {
				result.targets[0].gain(result.cards, player);
				player.$giveAuto(result.cards, result.targets[0]);
				player.line(result.targets, "green");
			}
		},
		ai: {
			order: 7,
			result: {
				target: -1,
			},
		},
	},
	datong: {
		trigger: { global: "phaseEnd" },
		frequent: true,
		filter(event, player) {
			var max = player.countCards("h");
			var min = max;
			game.countPlayer(function (current) {
				var nh = current.countCards("h");
				if (nh > max) {
					max = nh;
				}
				if (nh < min) {
					min = nh;
				}
			});
			return max - min <= 1;
		},
		content() {
			player.draw(2);
		},
	},
	huodan: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { color: "red" },
		filter(event, player) {
			return player.countCards("he", { color: "red" }) > 0;
		},
		filterTarget: true,
		selectTarget: [1, 2],
		position: "he",
		check(card) {
			return 7 - get.value(card);
		},
		contentBefore() {
			player.loseHp();
		},
		content() {
			if (targets.length === 1) {
				target.damage("fire", 2);
			} else {
				target.damage("fire");
			}
		},
		line: "fire",
		ai: {
			order: 15,
			expose: 0.2,
			threaten: 1.5,
			result: {
				target(player, target) {
					if (player.hp < 2) {
						return 0;
					}
					if (get.attitude(player, target) >= 0) {
						return 0;
					}
					if (target.hp > player.hp) {
						return 0;
					}
					var eff = get.damageEffect(target, player, target, "fire");
					if (eff < 0) {
						if (ui.selected.targets.length && target.hp > 1 && ui.selected.targets[0].hp > 1) {
							return 0;
						}
						if (target.nodying) {
							return eff / 10;
						}
						return eff / Math.sqrt(target.hp);
					}
					return 0;
				},
			},
		},
	},
	sxianjing: {
		enable: "phaseUse",
		filter(event, player) {
			var suits = [];
			for (var i = 0; i < player.storage.sxianjing.length; i++) {
				suits.add(get.suit(player.storage.sxianjing[i]));
			}
			return player.hasCard(function (card) {
				return !suits.includes(get.suit(card));
			});
		},
		init(player) {
			player.storage.sxianjing = [];
		},
		filterCard(card, player) {
			var suits = [];
			for (var i = 0; i < player.storage.sxianjing.length; i++) {
				suits.add(get.suit(player.storage.sxianjing[i]));
			}
			return !suits.includes(get.suit(card));
		},
		check(card) {
			return 7 - get.value(card);
		},
		discard: false,
		prepare(cards, player) {
			player.$give(1, player, false);
		},
		content() {
			player.storage.sxianjing.add(cards[0]);
			player.syncStorage("sxianjing");
			player.markSkill("sxianjing");
			player.updateMarks();
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
			threaten(player, target) {
				if (target.storage.sxianjing && target.storage.sxianjing.length) {
					return Math.sqrt(1.6 / (target.storage.sxianjing.length + 1));
				} else {
					return 1.6;
				}
			},
		},
		intro: {
			mark(dialog, content, player) {
				if (player.isUnderControl(true)) {
					dialog.add(player.storage.sxianjing);
				} else {
					return "已有" + get.cnNumber(player.storage.sxianjing.length) + "张“陷阱”牌";
				}
			},
			content(content, player) {
				if (player.isUnderControl(true)) {
					return get.translation(player.storage.sxianjing);
				}
				return "已有" + get.cnNumber(player.storage.sxianjing.length) + "张“陷阱”牌";
			},
		},
		group: ["sxianjing_gain", "sxianjing_damage"],
		subSkill: {
			gain: {
				trigger: { target: "useCardToBegin" },
				forced: true,
				filter(event, player) {
					if (event.player === player || !event.player.countCards("he")) {
						return false;
					}
					var suit = get.suit(event.card);
					for (var i = 0; i < player.storage.sxianjing.length; i++) {
						if (get.suit(player.storage.sxianjing[i]) === suit) {
							return true;
						}
					}
					return false;
				},
				content() {
					"step 0";
					var suit = get.suit(trigger.card);
					var card = null;
					for (var i = 0; i < player.storage.sxianjing.length; i++) {
						if (get.suit(player.storage.sxianjing[i]) === suit) {
							card = player.storage.sxianjing[i];
							break;
						}
					}
					if (card) {
						player.showCards(card, get.translation(player) + "发动了【陷阱】");
						player.storage.sxianjing.remove(card);
						card.discard();
						player.syncStorage("sxianjing");
						if (player.storage.sxianjing.length) {
							player.updateMarks();
						} else {
							player.unmarkSkill("sxianjing");
						}
					}
					"step 1";
					player.randomGain(trigger.player, true);
				},
			},
			damage: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter(event, player) {
					return player.storage.sxianjing.length > 0;
				},
				content() {
					var card = player.storage.sxianjing.randomGet();
					player.storage.sxianjing.remove(card);
					player.gain(card, "draw");
					player.syncStorage("sxianjing");
					if (player.storage.sxianjing.length) {
						player.updateMarks();
					} else {
						player.unmarkSkill("sxianjing");
					}
				},
			},
		},
	},
	zhanxing: {
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filterCard: true,
		selectCard: [1, Infinity],
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		check(card) {
			switch (ui.selected.cards.length) {
				case 0:
					return 8 - get.value(card);
				case 1:
					return 6 - get.value(card);
				case 2:
					return 3 - get.value(card);
			}
			return 0;
		},
		content() {
			"step 0";
			var list = get.cards(cards.length);
			event.list = list;
			player.showCards(list);
			"step 1";
			var suits = [];
			event.suits = suits;
			for (var i = 0; i < event.list.length; i++) {
				suits.add(get.suit(event.list[i]));
				event.list[i].discard();
			}
			"step 2";
			if (event.suits.includes("diamond")) {
				player.draw(2);
			}
			"step 3";
			if (event.suits.includes("heart")) {
				if (player.isDamaged()) {
					player.recover();
				} else {
					player.changeHujia();
				}
			}
			"step 4";
			if (event.suits.includes("club")) {
				var enemies = player.getEnemies();
				for (var i = 0; i < enemies.length; i++) {
					enemies[i].randomDiscard();
					enemies[i].addExpose(0.1);
					player.line(enemies[i], "green");
				}
			}
			"step 5";
			if (event.suits.includes("spade")) {
				player.chooseTarget("令一名角色受到1点无来源的雷属性伤害").ai = function (target) {
					return get.damageEffect(target, target, player, "thunder");
				};
			} else {
				event.finish();
			}
			"step 6";
			if (result.bool) {
				player.line(result.targets[0], "thunder");
				result.targets[0].damage("thunder", "nosource", "nocard");
			}
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
			threaten: 1.5,
		},
	},
	kbolan: {
		trigger: { player: "drawBegin" },
		frequent: true,
		priority: 5,
		content() {
			trigger.num++;
			trigger.id = trigger.id || get.id();
			player.storage.kbolan2 = trigger.id;
			player.addTempSkill("kbolan2");
		},
	},
	kbolan2: {
		trigger: { player: "drawEnd" },
		filter(event, player) {
			return player.storage.kbolan2 === event.id;
		},
		silent: true,
		onremove: true,
		content() {
			"step 0";
			player.removeSkill("kbolan2");
			if (player.countCards("h")) {
				player.chooseCard("h", true, "将一张手牌置于牌堆顶").ai = function (card) {
					return -get.value(card);
				};
			} else {
				event.finish();
			}
			"step 1";
			if (result && result.cards) {
				event.card = result.cards[0];
				player.lose(result.cards, ui.special);
				var cardx = ui.create.card();
				cardx.classList.add("infohidden");
				cardx.classList.add("infoflip");
				player.$throw(cardx, 1000, "nobroadcast");
			}
			"step 2";
			if (event.player === game.me) {
				game.delay(0.5);
			}
			"step 3";
			if (event.card) {
				event.card.fix();
				ui.cardPile.insertBefore(event.card, ui.cardPile.firstChild);
			}
		},
	},
	hujing: {
		trigger: { player: "phaseBegin" },
		forced: true,
		filter(event, player) {
			return get.discardPile("lianyaohu") ? true : false;
		},
		content() {
			var card = get.discardPile("lianyaohu");
			if (card) {
				player.equip(card);
				player.$gain2(card);
				game.delayx();
			}
		},
		mod: {
			maxHandcard(player, num) {
				if (player.getEquip("lianyaohu")) {
					return num + 2;
				}
			},
		},
	},
	gaizao: {
		trigger: { player: "useCardToBegin" },
		filter(event, player) {
			if (player !== event.target && player.countCards("e") === 5) {
				return false;
			}
			return lib.skill.gaizao.filterx(event.card, player) && event.target === player;
		},
		direct: true,
		filterx(card, player) {
			if (!lib.inpile.includes(card.name)) {
				return false;
			}
			var info = get.info(card);
			if (info.type !== "equip") {
				return false;
			}
			if (info.nomod) {
				return false;
			}
			if (info.unique) {
				return false;
			}
			if (!info.subtype) {
				return false;
			}
			if (!player.getEquip(info.subtype)) {
				return false;
			}
			return true;
		},
		content() {
			"step 0";
			var list = ["equip1", "equip2", "equip3", "equip4", "equip5"];
			for (var i = 0; i < list.length; i++) {
				if (player.getEquip(list[i])) {
					list.splice(i--, 1);
				}
			}
			list.push("cancel2");
			player.chooseControl(list, function () {
				return list.randomGet();
			}).prompt = "改造：是否改变" + get.translation(trigger.card.name) + "的装备类型？";
			"step 1";
			if (result.control && result.control !== "cancel2") {
				player.logSkill("gaizao");
				var name = trigger.card.name + "_gaizao_" + result.control;
				if (!lib.card[name]) {
					lib.card[name] = get.copy(get.info(trigger.card));
					lib.card[name].subtype = result.control;
					lib.card[name].epic = true;
					lib.card[name].cardimage = trigger.card.name;
					lib.card[name].source = [trigger.card.name];
					lib.translate[name] = lib.translate[trigger.card.name];
					lib.translate[name + "_info"] = lib.translate[trigger.card.name + "_info"];
				}
				trigger.card.name = name;
				trigger.cards[0].init([trigger.card.suit, trigger.card.number, name, trigger.card.nature]);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (target === player && lib.skill.gaizao.filterx(card, target) && target.countCards("e") < 5) {
						return [1, 3];
					}
				},
			},
		},
	},
	lingshi: {
		mod: {
			attackFrom(from, to, distance) {
				return distance - from.countCards("e") * 2;
			},
			cardUsable(card, player, num) {
				if (card.name === "sha" && player.getEquip(5)) {
					return num + 1;
				}
			},
		},
		group: ["lingshi_hit", "lingshi_draw"],
		subSkill: {
			hit: {
				trigger: { player: "shaBegin" },
				filter(event, player) {
					return player.getEquip(1) || player.getEquip(2);
				},
				forced: true,
				content() {
					trigger.directHit = true;
				},
			},
			draw: {
				trigger: { player: "phaseDrawBegin" },
				filter(event, player) {
					return player.getEquip(3) || player.getEquip(4);
				},
				forced: true,
				content() {
					trigger.num++;
				},
			},
		},
	},
	tiebi: {
		trigger: { global: "shaBegin" },
		filter(event, player) {
			return player.countCards("h", { color: "black" }) && !event.target.hujia && get.distance(player, event.target) <= 1;
		},
		direct: true,
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt("tiebi", trigger.target), {
				color: "black",
			});
			var goon = get.attitude(player, trigger.target) > 2 && get.damageEffect(trigger.target, trigger.player, player) < 0;
			next.ai = function (card) {
				if (goon) {
					if (trigger.target.hp === 1) {
						return 10 - get.value(card);
					}
					return 7 - get.value(card);
				}
				return 0;
			};
			next.logSkill = ["tiebi", trigger.target];
			"step 1";
			if (result.bool) {
				trigger.target.changeHujia();
			}
		},
		ai: {
			threaten: 1.1,
		},
	},
	shenyan: {
		trigger: { source: "damageBegin" },
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		filter(event, player) {
			return !player.storage.shenyan && event.hasNature("fire");
		},
		intro: {
			content: "limited",
		},
		mark: true,
		logTarget: "player",
		init(player) {
			player.storage.shenyan = false;
		},
		check(event, player) {
			if (get.attitude(player, event.player) >= 0) {
				return 0;
			}
			if (player.hasUnknown()) {
				return 0;
			}
			var num = 0,
				players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (players[i] !== player && players[i] !== event.player && get.distance(event.player, players[i]) <= 1) {
					var eff = get.damageEffect(players[i], player, player, "fire");
					if (eff > 0) {
						num++;
					} else if (eff < 0) {
						num--;
					}
				}
			}
			return num > 0;
		},
		content() {
			trigger.num++;
			player.addSkill("shenyan2");
			player.storage.shenyan = true;
			player.awakenSkill(event.name);
			player.storage.shenyan2 = [];
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (players[i] !== player && players[i] !== trigger.player && get.distance(trigger.player, players[i]) <= 1) {
					player.storage.shenyan2.push(players[i]);
				}
			}
			player.storage.shenyan2.sort(lib.sort.seat);
		},
	},
	shenyan2: {
		trigger: { global: "damageAfter" },
		forced: true,
		popup: false,
		content() {
			"step 0";
			if (player.storage.shenyan2 && player.storage.shenyan2.length) {
				var target = player.storage.shenyan2.shift();
				player.line(target, "fire");
				target.damage("fire");
				event.redo();
			}
			"step 1";
			delete player.storage.shenyan2;
			player.removeSkill("shenyan2");
		},
	},
	senluo: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.isMinHandcard();
		},
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h") > 0;
		},
		content() {
			"step 0";
			target.chooseToDiscard(2, "h", true).delay = false;
			"step 1";
			target.draw();
		},
		selectTarget: -1,
		ai: {
			order: 9,
			result: {
				target: -1,
			},
		},
	},
	xuanying: {
		subSkill: {
			sha: {
				enable: "chooseToUse",
				viewAs: {
					name: "sha",
					isCard: true,
				},
				viewAsFilter(player) {
					if (player.isLinked()) {
						return false;
					}
				},
				precontent() {
					player.link();
				},
				filterCard() {
					return false;
				},
				selectCard: -1,
				prompt: "横置武将牌，视为使用一张无视距离的杀",
				ai: {
					order() {
						return 3.15;
					},
					skillTagFilter(player, tag, arg) {
						if (arg === "respond") {
							return false;
						}
						if (player.isLinked()) {
							return false;
						}
					},
					respondSha: true,
				},
				mod: {
					targetInRange(card) {
						if (_status.event.skill === "xuanying_sha") {
							return true;
						}
					},
				},
			},
			shan: {
				trigger: { player: ["chooseToRespondBegin", "chooseToUseBegin"] },
				filter(event, player) {
					if (!player.isLinked()) {
						return false;
					}
					if (event.responded) {
						return false;
					}
					if (!event.filterCard({ name: "shan" }, player, event)) {
						return false;
					}
					return true;
				},
				check(event, player) {
					if (get.damageEffect(player, event.player, player) >= 0) {
						return false;
					}
					return true;
				},
				content() {
					"step 0";
					player.link();
					"step 1";
					trigger.untrigger();
					trigger.responded = true;
					trigger.result = { bool: true, card: { name: "shan" } };
				},
				ai: {
					respondShan: true,
					target(card, player, target, current) {
						if (!player.isLinked() && current < 0) {
							return 1.5;
						}
						if (!target.hasFriend()) {
							return;
						}
						if (get.tag(card, "loseCard") && _status.currentPhase !== target && target.countCards("he")) {
							return [0.5, Math.max(2, target.countCards("h"))];
						}
						if (get.tag(card, "respondSha") || get.tag(card, "respondShan")) {
							if (get.attitude(player, target) > 0 && card.name === "juedou") {
								return;
							}
							return [0.5, target.countCards("h", "sha") + target.countCards("h", "shan")];
						}
					},
				},
			},
			damage: {
				trigger: { player: "damageEnd" },
				filter(event, player) {
					return event.source && event.source.isAlive() && player.isLinked() && lib.filter.targetEnabled({ name: "sha" }, player, event.source);
				},
				check(event, player) {
					return get.effect(event.source, { name: "sha" }, player, player) > 0;
				},
				logTarget: "source",
				content() {
					"step 0";
					player.link();
					"step 1";
					player.useCard({ name: "sha" }, trigger.source);
				},
			},
			use: {
				trigger: { player: "loseEnd" },
				direct: true,
				filter(event, player) {
					return _status.currentPhase !== player && player.isLinked() && event.cards && event.cards.length;
				},
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt("xuanying"), function (card, player, target) {
							return lib.filter.targetEnabled({ name: "sha" }, player, target);
						})
						.set("ai", function (target) {
							return get.effect(target, { name: "sha" }, _status.event.player);
						})
						.set("autodelay", 0.5);
					"step 1";
					if (result.bool) {
						player.logSkill("xuanying");
						player.link();
						player.useCard({ name: "sha" }, result.targets, false);
					}
				},
			},
		},
		group: ["xuanying_sha", "xuanying_use"],
		ai: {
			threaten(player, target) {
				if (target.isLinked()) {
					return 0.7;
				}
				return 1.4;
			},
		},
	},
	hwendao: {
		trigger: { player: ["useCardAfter", "respondAfter"] },
		check(event, player) {
			return get.attitude(player, _status.currentPhase) <= 0;
		},
		logTarget() {
			return _status.currentPhase;
		},
		filter(event, player) {
			if (player === _status.currentPhase) {
				return false;
			}
			if (!_status.currentPhase?.countCards("he")) {
				return false;
			}
			return event.cards && event.cards.length === 1;
		},
		content() {
			"step 0";
			var suit = get.suit(trigger.cards[0]);
			var goon = get.attitude(_status.currentPhase, player) <= 0;
			_status.currentPhase.chooseToDiscard("弃置一张" + get.translation(suit + "2") + "牌，或令" + get.translation(player) + "获得你的一张牌", { suit: suit }).ai = function (card) {
				if (goon) {
					return 8 - get.value(card);
				}
				return 0;
			};
			"step 1";
			if (!result.bool) {
				player.gainPlayerCard(_status.currentPhase, "he", true);
			}
		},
		ai: {
			threaten: 0.7,
		},
	},
	lingfeng: {
		trigger: { player: "phaseEnd" },
		frequent: true,
		filter(event, player) {
			return player.countUsed() >= Math.min(3, player.hp);
		},
		content() {
			"step 0";
			player
				.chooseTarget("凌锋", function (card, player, target) {
					return player !== target && get.distance(player, target, "attack") <= 1;
				})
				.set("prompt2", "造成1点伤害，或取消并获得1点护甲").ai = function (target) {
				if (player.hp === 1) {
					return 0;
				}
				if (player.hp === 2 && target.hp >= 3) {
					return 0;
				}
				return get.damageEffect(target, player, player);
			};
			"step 1";
			if (result.bool) {
				player.line(result.targets[0]);
				result.targets[0].damage();
			} else {
				player.changeHujia();
			}
		},
		ai: {
			order: -10,
			result: {
				target: 2,
			},
			threaten: 1.5,
		},
	},
	hxunzhi: {
		unique: true,
		enable: "phaseUse",
		limited: true,
		derivation: ["wusheng", "paoxiao"],
		filter(event, player) {
			return !player.storage.hxunzhi;
		},
		init(player) {
			player.storage.hxunzhi = false;
		},
		mark: true,
		intro: {
			content: "limited",
		},
		skillAnimation: true,
		animationColor: "fire",
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.storage.hxunzhi = true;
			var targets = game.filterPlayer(function (current) {
				return player.canUse("wanjian", current);
			});
			targets.sort(lib.sort.seat);
			player.useCard({ name: "wanjian" }, targets);
			"step 1";
			player.addSkill("wusheng");
			player.addSkill("paoxiao");
			player.addSkill("hxunzhi2");
		},
		ai: {
			order: 2,
			result: {
				player(player) {
					if (get.mode() === "identity") {
						if (player.identity === "zhu") {
							return 0;
						}
						if (player.identity === "nei") {
							return 0;
						}
					} else if (get.mode() === "guozhan") {
						if (player.identity === "ye") {
							return 0;
						}
						if (player.isUnseen()) {
							return 0;
						}
					}
					if (player.hp === 1) {
						return 1;
					}
					if (player.hasUnknown()) {
						return 0;
					}
					if (!player.hasFriend()) {
						return 0;
					}
					var enemies = player.getEnemies();
					if (enemies.length + 1 === game.players.length) {
						return 0;
					}
					var num = player.hasCard(function (card) {
						return card.name === "sha" || get.color(card) === "red";
					});
					if (num < 2) {
						return 0;
					}
					for (var i = 0; i < enemies.length; i++) {
						if (player.canUse("sha", enemies[i]) && get.effect(enemies[i], { name: "sha" }, player, player) > 0 && !enemies[i].getEquip(2) && num > enemies[i].hp && enemies[i].hp <= 2) {
							return 1;
						}
					}
					return 0;
				},
			},
		},
	},
	hxunzhi2: {
		trigger: { player: "phaseUseEnd" },
		forced: true,
		popup: false,
		content() {
			player.removeSkill("xunzhi2");
			player.die();
		},
	},
	lmazui: {
		audio: "mazui",
		enable: "phaseUse",
		usable: 1,
		filterCard: { color: "black" },
		filterTarget(card, player, target) {
			return !target.hasSkill("lmazui2");
		},
		check(card) {
			return 6 - get.value(card);
		},
		discard: false,
		prepare: "give",
		content() {
			target.storage.lmazui2 = cards[0];
			target.addSkill("lmazui2");
			game.addVideo("storage", target, ["lmazui2", get.cardInfo(target.storage.lmazui2), "card"]);
		},
		ai: {
			expose: 0.2,
			result: {
				target(player, target) {
					return -target.hp;
				},
			},
			order: 4,
			threaten: 1.2,
		},
	},
	lmazui2: {
		trigger: { source: "damageBegin" },
		forced: true,
		mark: "card",
		filter(event) {
			return event.num > 0;
		},
		content() {
			trigger.num--;
			player.addSkill("lmazui3");
			player.removeSkill("lmazui2");
		},
		intro: {
			content: "card",
		},
	},
	lmazui3: {
		trigger: { source: ["damageEnd", "damageZero"] },
		forced: true,
		popup: false,
		content() {
			player.gain(player.storage.lmazui2, "gain2", "log");
			player.removeSkill("lmazui3");
			delete player.storage.lmazui2;
		},
	},
	hyunshen: {
		trigger: { player: ["respond", "useCard"] },
		filter(event, player) {
			return event.card.name === "shan";
		},
		frequent: true,
		init(player) {
			player.storage.hyunshen = 0;
		},
		content() {
			player.storage.hyunshen++;
			player.markSkill("hyunshen");
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (get.tag(card, "respondShan")) {
						var shans = target.countCards("h", "shan");
						var hs = target.countCards("h");
						if (shans > 1) {
							return [1, 1];
						}
						if (shans && hs > 2) {
							return [1, 1];
						}
						if (shans) {
							return [1, 0.5];
						}
						if (hs > 2) {
							return [1, 0.3];
						}
						if (hs > 1) {
							return [1, 0.2];
						}
						return [1.2, 0];
					}
				},
			},
			threaten: 0.8,
		},
		intro: {
			content: "mark",
		},
		group: "hyunshen2",
	},
	hyunshen2: {
		trigger: { player: "phaseBegin" },
		forced: true,
		filter(event, player) {
			return player.storage.hyunshen > 0;
		},
		content() {
			player.draw(player.storage.hyunshen);
			player.storage.hyunshen = 0;
			player.unmarkSkill("hyunshen");
		},
		mod: {
			globalTo(from, to, distance) {
				if (typeof to.storage.hyunshen === "number") {
					return distance + to.storage.hyunshen;
				}
			},
		},
	},
	hlingbo: {
		audio: ["qingguo", 2],
		trigger: { player: ["respond", "useCard"] },
		filter(event, player) {
			return event.card.name === "shan";
		},
		frequent: true,
		content() {
			player.draw(2);
		},
		ai: {
			mingzhi: false,
			useShan: true,
			effect: {
				target_use(card, player, target) {
					if (get.tag(card, "respondShan")) {
						var shans = target.countCards("h", "shan");
						var hs = target.countCards("h");
						if (shans > 1) {
							return [0, 1];
						}
						if (shans && hs > 2) {
							return [0, 1];
						}
						if (shans) {
							return [0, 0];
						}
						if (hs > 2) {
							return [0, 0];
						}
						if (hs > 1) {
							return [1, 0.5];
						}
						return [1.5, 0];
					}
				},
			},
			threaten: 0.8,
		},
	},
	gtiandao: {
		trigger: { global: "judge" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			player.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("gtiandao"), "he").ai = function (card) {
				var trigger = _status.event.parent._trigger;
				var player = _status.event.player;
				var result = trigger.judge(card) - trigger.judge(trigger.player.judging[0]);
				var attitude = get.attitude(player, trigger.player);
				if (attitude === 0 || result === 0) {
					return 0;
				}
				if (attitude > 0) {
					return result;
				} else {
					return -result;
				}
			};
			"step 1";
			if (result.bool) {
				player.respond(result.cards, "highlight");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.logSkill("gtiandao");
				player.$gain2(trigger.player.judging[0]);
				player.gain(trigger.player.judging[0]);
				trigger.player.judging[0] = result.cards[0];
				trigger.position.appendChild(result.cards[0]);
				game.log(trigger.player, "的判定牌改为", result.cards[0]);
			}
			"step 3";
			game.delay(2);
		},
		ai: {
			tag: {
				rejudge: 1,
			},
			threaten: 1.5,
		},
	},
	jinlin: {
		enable: "phaseUse",
		unique: true,
		mark: true,
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		init(player) {
			player.storage.jinlin = false;
		},
		filter(event, player) {
			if (player.storage.jinlin) {
				return false;
			}
			return true;
		},
		filterTarget: true,
		selectTarget: [1, Infinity],
		contentBefore() {
			player.awakenSkill(event.skill);
			player.storage.jinlin = true;
		},
		content() {
			target.changeHujia(3);
			target.addSkill("jinlin2");
			target.storage.jinlin2 = 3;
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (player.hp === 1) {
						return 1;
					}
					var num = 0;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (get.attitude(player, players[i]) > 2) {
							if (players[i].hp === 1) {
								return 1;
							}
							if (players[i].hp === 2) {
								if (players[i].countCards("h") === 0) {
									return 1;
								}
								num++;
							}
						}
					}
					if (player.hasUnknown()) {
						return 0;
					}
					if (num > 1) {
						return 1;
					}
					return 0;
				},
			},
		},
		intro: {
			content: "limited",
		},
	},
	jinlin2: {
		trigger: { player: "phaseBegin" },
		silent: true,
		content() {
			if (player.hujia > 0) {
				player.changeHujia(-1);
			}
			player.storage.jinlin2--;
			if (player.hujia === 0 || player.storage.jinlin2 === 0) {
				player.removeSkill("jinlin2");
				delete player.storage.jinlin2;
			}
		},
		ai: {
			threaten: 0.8,
		},
	},
	lingyue: {
		trigger: { player: "shaBegin" },
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		logTarget: "target",
		filter(event, player) {
			return event.target.countCards("he") > 0;
		},
		content() {
			trigger.target.chooseToDiscard("he", true);
		},
	},
	fengze: {
		enable: "phaseUse",
		filterCard: { color: "black" },
		selectCard: 1,
		position: "he",
		usable: 1,
		viewAs: { name: "taoyuan" },
		filter(event, player) {
			return player.countCards("he", { color: "black" }) > 0;
		},
		prompt: "将一张黑色牌当作桃园结义使用",
		check(card) {
			return 7 - get.useful(card);
		},
		ai: {
			threaten: 1.5,
		},
	},
	huanxia: {
		enable: "chooseToUse",
		filterCard(card) {
			return get.color(card) === "red";
		},
		position: "he",
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			if (!player.countCards("he", { color: "red" })) {
				return false;
			}
		},
		prompt: "将一张红色牌当杀使用",
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.1;
			},
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") {
					return false;
				}
				if (!player.countCards("he", { color: "red" })) {
					return false;
				}
			},
		},
		group: ["huanxia_expire", "huanxia_draw", "huanxia_gain"],
		subSkill: {
			expire: {
				trigger: { source: "damageAfter" },
				forced: true,
				popup: false,
				filter(event) {
					return event.parent.skill === "huanxia";
				},
				content() {
					player.storage.huanxia = true;
				},
			},
			draw: {
				trigger: { player: "shaAfter" },
				forced: true,
				popup: false,
				content() {
					if (trigger.parent.skill === "huanxia") {
						var card = trigger.cards[0];
						if (get.itemtype(card) === "card" && get.position(card) === "d" && !player.storage.huanxia) {
							ui.special.appendChild(card);
							if (!player.storage.huanxia_draw) {
								player.storage.huanxia_draw = [];
							}
							player.storage.huanxia_draw.push(card);
						}
					}
					delete player.storage.huanxia;
				},
			},
			gain: {
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return player.storage.huanxia_draw;
				},
				content() {
					player.gain(player.storage.huanxia_draw, "gain2");
					delete player.storage.huanxia_draw;
				},
			},
		},
	},
	huajing: {
		trigger: { source: "damageEnd" },
		filter(event, player) {
			return event.card && get.type(event.card, "trick") === "trick";
		},
		frequent: true,
		content() {
			player.recover();
			player.draw();
		},
	},
	pingxu: {
		mod: {
			globalFrom(from, to, current) {
				if (!from.getEquip(1)) {
					return current - 1;
				}
			},
			globalTo(from, to, current) {
				if (!to.getEquip(2)) {
					return current + 1;
				}
			},
		},
	},
	jufu: {
		trigger: { source: "damageBegin" },
		filter(event, player) {
			if (event.card && event.card.name === "sha" && player.getEquip(1)) {
				return true;
			}
			return false;
		},
		forced: true,
		content() {
			trigger.num++;
		},
	},
	bingfeng: {
		limited: true,
		skillAnimation: "epic",
		animationColor: "water",
		unique: true,
		enable: "phaseUse",
		filter(event, player) {
			return !player.storage.bingfeng;
		},
		init(player) {
			player.storage.bingfeng = false;
		},
		filterTarget(card, player, target) {
			return player !== target && !target.isTurnedOver();
		},
		mark: true,
		multitarget: true,
		multiline: true,
		selectTarget: [1, 3],
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.removeSkill("xuanzhou");
			player.loseMaxHp();
			player.storage.bingfeng = true;
			event.num = 0;
			player.turnOver();
			player.addSkill("bingfeng2");
			"step 1";
			if (num < targets.length) {
				var target = targets[num];
				if (!target.isTurnedOver()) {
					target.turnOver();
				}
				target.addSkill("bingfeng2");
				event.num++;
				event.redo();
			}
		},
		intro: {
			content: "limited",
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.hasSkillTag("noturn")) {
						return 0;
					}
					if (game.phaseNumber < game.players.length) {
						return 0;
					}
					if (game.phaseNumber < game.players.length * 2 && player.hp === player.maxHp) {
						return 0;
					}
					if (player.hasUnknown()) {
						return 0;
					}
					switch (lib.config.mode) {
						case "identity": {
							switch (player.identity) {
								case "zhu": {
									if (get.situation() >= 0) {
										return 0;
									}
									if (get.population("fan") < 3) {
										return 0;
									}
									return -1;
								}
								case "zhong": {
									if (get.population("fan") < 3) {
										return 0;
									}
									return -1;
								}
								case "nei":
									return 0;
								case "fan": {
									if (get.population("fan") === 0) {
										return 0;
									}
									if (get.population("zhong") < 2) {
										return 0;
									}
									return -1;
								}
							}
							break;
						}
						case "guozhan": {
							if (player.identity === "unknown") {
								return 0;
							}
							return get.population(player.identity) >= 3 ? -1 : 0;
						}
						default: {
							return -1;
						}
					}
				},
			},
		},
	},
	bingfeng2: {
		mark: true,
		marktext: "封",
		intro: {
			content: "不能使用或打出手牌",
		},
		mod: {
			cardEnabled2(card) {
				if (get.position(card) === "h") {
					return false;
				}
			},
		},
		trigger: { player: "turnOverAfter" },
		forced: true,
		filter(event, player) {
			return !player.isTurnedOver();
		},
		content() {
			player.removeSkill("bingfeng2");
		},
	},
	yudun: {
		mod: {
			cardEnabled(card, player) {
				if (get.type(card, "trick") === "trick") {
					return false;
				}
			},
			cardRespondable(card, player) {
				if (get.type(card, "trick") === "trick") {
					return false;
				}
			},
			cardSavable(card, player) {
				if (get.type(card, "trick") === "trick") {
					return false;
				}
			},
		},
		enable: "chooseToUse",
		filterCard(card) {
			return get.type(card, "trick") === "trick";
		},
		selectCard: 2,
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			if (player.countCards("h", { type: ["trick", "delay"] }) < 2) {
				return false;
			}
		},
		check() {
			return 1;
		},
		ai: {
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") {
					return false;
				}
				if (player.countCards("h", { type: ["trick", "delay"] }) < 2) {
					return false;
				}
			},
			respondSha: true,
			order() {
				return get.order({ name: "sha" }) + 0.1;
			},
			useful: -1,
			value: -1,
		},
		group: "yudun_count",
		subSkill: {
			count: {
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.skill === "yudun" && _status.currentPhase === player;
				},
				content() {
					player.getStat().card.sha--;
				},
			},
		},
	},
	guozao: {
		trigger: { global: "damageEnd" },
		forced: true,
		logv: false,
		check(event, player) {
			return game.hasPlayer(function (current) {
				return get.attitude(player, current) > 2 && current.countCards("h") === 1;
			});
		},
		filter(event, player) {
			if (event.source === player) {
				return false;
			}
			if (get.distance(player, event.player) > 1) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current.countCards("h");
			});
		},
		content() {
			"step 0";
			var cards = [];
			if (ui.cardPile.childNodes.length < 3) {
				var discardcards = get.cards(3);
				for (var i = 0; i < discardcards.length; i++) {
					discardcards[i].discard();
				}
			}
			for (var i = 0; i < 3; i++) {
				cards.push(ui.cardPile.childNodes[i]);
			}
			event.cards = cards;
			var dialog = ui.create.dialog("聒噪：选择一个目标将手牌替换", cards, "hidden");
			dialog.classList.add("noselect");
			var dist = 2;
			player.chooseTarget(true, dialog, function (card, player, target) {
				return target.countCards("h") > 0 && get.distance(player, target) <= dist;
			}).ai = function (target) {
				var att = get.attitude(player, target);
				var hs = target.getCards("h");
				var num = hs.length;
				if (num <= 1) {
					return att * 2;
				}
				if (num === 2) {
					for (var i = 0; i < cards.length; i++) {
						if (get.value(cards[i], target, "raw") > 6) {
							return att;
						}
					}
					if (target === player) {
						for (var i = 0; i < 2; i++) {
							if (get.value(cards[i], target, "raw") > 6) {
								return -1;
							}
						}
					}
					return att / 2;
				}
				if (num === 3) {
					if (target === player) {
						var num2 = 0;
						for (var i = 0; i < 3; i++) {
							num2 += get.value(cards[i], player, "raw");
							num2 -= get.value(hs[i], player, "raw");
						}
						if (num2 > 0) {
							return 0.5;
						}
						if (num2 < 0) {
							return -0.5;
						}
					}
					return 0;
				}
				return -att / 2;
			};
			"step 1";
			if (result.bool && result.targets[0]) {
				var target = result.targets[0];
				player.line(target, "green");
				var cards = target.getCards("h");
				target.lose(cards)._triggered = null;
				game.log(target, "弃置了", cards, "，并获得三张牌");
				target.$throw(cards);
				target.gain(event.cards, "draw")._triggered = null;
			} else {
				event.finish();
			}
		},
		ai: {
			expose: 0.1,
		},
	},
	heihuo: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > 0 && player.countCards("he", { type: "equip" }) > 0 && !player.hasSkill("heihuo2");
		},
		filterCard(card) {
			return get.type(card) === "equip";
		},
		position: "he",
		check(card) {
			var player = _status.currentPhase;
			var nh = player.countCards("h");
			var pos = get.position(card);
			if (nh < 2) {
				return 0;
			}
			if (nh > 4) {
				return 0;
			}
			if (nh === 4 && pos === "e") {
				return 0;
			}
			if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
				return 11 - get.equipValue(card) + (pos === "e" ? 0.4 : 0);
			}
			return 5.5 - get.value(card) + (pos === "e" ? 0.4 : 0);
		},
		content() {
			"step 0";
			player.draw(player.countCards("h"));
			"step 1";
			if (player.countCards("h") >= 8) {
				player.damage(3, "fire");
				player.addTempSkill("heihuo2");
			}
		},
		ai: {
			order: 10,
			threaten: 1.4,
			result: {
				player: 1,
			},
		},
	},
	heihuo2: {},
	yaotong: {
		group: ["yaotong1", "yaotong2", "yaotong3"],
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				if (player.countCards("h") % 2 === 0) {
					return false;
				}
			},
		},
		threaten: 1.3,
	},
	yaotong1: {
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard: true,
		viewAs: { name: "sha" },
		filter(event, player) {
			var num = player.countCards("h");
			if (num === 0) {
				return false;
			}
			return num % 2 === 1;
		},
		prompt: "将一张手牌当作杀使用或打出",
		check(card) {
			return 6 - get.value(card);
		},
	},
	yaotong2: {
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard: true,
		viewAs: { name: "shan" },
		filter(event, player) {
			var num = player.countCards("h");
			if (num === 0) {
				return false;
			}
			return num % 2 === 1;
		},
		prompt: "将一张手牌当作闪使用或打出",
		check(card) {
			return 6 - get.value(card);
		},
	},
	yaotong3: {
		enable: "chooseToUse",
		filterCard: true,
		viewAs: { name: "wuxie" },
		filter(event, player) {
			var num = player.countCards("h");
			if (num === 0) {
				return false;
			}
			return num % 2 === 0;
		},
		viewAsFilter(player) {
			var num = player.countCards("h");
			if (num === 0) {
				return false;
			}
			return num % 2 === 0;
		},
		prompt: "将一张手牌当作无懈可击使用",
		check(card) {
			return 7 - get.value(card);
		},
	},
	yaotong4: {
		enable: "chooseToUse",
		filterCard: true,
		viewAs: { name: "tao" },
		filter(event, player) {
			var num = player.countCards("h");
			if (num === 0) {
				return false;
			}
			return num % 2 === 0;
		},
		viewAsFilter(player) {
			var num = player.countCards("h");
			if (num === 0) {
				return false;
			}
			return num % 2 === 0;
		},
		prompt: "将一张手牌当作桃使用",
		check(card) {
			return 9 - get.value(card);
		},
	},
	pojian: {
		trigger: { player: "loseEnd" },
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
			for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
				if (get.type(ui.cardPile.childNodes[i]) === "equip") {
					player.equip(ui.cardPile.childNodes[i]);
					player.$gain2(ui.cardPile.childNodes[i]);
					game.delay();
					event.finish();
					return;
				}
			}
			for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
				if (get.type(ui.discardPile.childNodes[i]) === "equip") {
					player.equip(ui.discardPile.childNodes[i]);
					player.$gain2(ui.discardPile.childNodes[i]);
					game.delay();
					event.finish();
					return;
				}
			}
		},
	},
	huajin: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterCard: true,
		position: "he",
		content() {
			player.addSkill("huajin2");
		},
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					if (player.countCards("h", "juedou")) {
						return 1;
					}
					if (player.countCards("h", "sha") === 0) {
						return 0;
					}
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (player.canUse("sha", players[i]) && get.effect(players[i], { name: "sha" }, player, player) > 0) {
							return 1;
						}
					}
					return 0;
				},
			},
		},
	},
	huajin2: {
		trigger: { source: "damageBegin" },
		forced: true,
		content() {
			trigger.num++;
		},
		group: "huajin3",
	},
	huajin3: {
		trigger: { player: "phaseBegin" },
		forced: true,
		popup: false,
		content() {
			player.removeSkill("huajin2");
		},
	},
	yuchen: {
		trigger: { player: ["useCard", "respondAfter"] },
		direct: true,
		filter(event, player) {
			if (player === _status.currentPhase) {
				return false;
			}
			if (event.cards) {
				for (var i = 0; i < event.cards.length; i++) {
					if (get.color(event.cards[i]) === "black") {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("yuchen"), function (card, player, target) {
					return player !== target && target.countCards("he") > 0;
				})
				.set("autodelay", trigger.name === "respond" ? 0.5 : 1).ai = function (target) {
				return -get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("yuchen", result.targets);
				player.discardPlayerCard(result.targets[0], true);
			}
		},
		ai: {
			threaten: 0.7,
		},
	},
	bingjian: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he", { color: "black", name: "sha" }) > 0;
		},
		filterCard(card) {
			return card.name === "sha" && get.color(card) === "black";
		},
		filterTarget(card, player, target) {
			return player !== target && target.countCards("h") > 0;
		},
		line: "thunder",
		content() {
			"step 0";
			target.showHandcards();
			"step 1";
			var cards = target.getCards("h", "shan");
			if (cards.length) {
				target.discard(cards);
			} else {
				target.damage("thunder");
			}
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target, "thunder");
				},
			},
			expose: 0.2,
		},
	},
	rumeng: {
		trigger: { global: "phaseUseBefore" },
		direct: true,
		filter(event, player) {
			return event.player !== player && player.countCards("he", { type: "basic" }) < player.countCards("he");
		},
		content() {
			"step 0";
			var yep = get.attitude(player, trigger.player) < 0 && trigger.player.countCards("h") > 2;
			var next = player.chooseToDiscard(
				function (card) {
					return get.type(card) !== "basic";
				},
				get.prompt("rumeng", trigger.player),
				"he"
			);
			next.logSkill = ["rumeng", trigger.player];
			next.ai = function (card) {
				if (yep) {
					return 6 - get.value(card);
				}
				return 0;
			};
			"step 1";
			if (result.bool) {
				trigger.player.chooseToDiscard({ type: "basic" }, "入梦：弃置一张基本牌或跳过出牌及弃牌阶段").ai = function (card) {
					return 5 - get.value(card);
				};
			} else {
				event.finish();
			}
			"step 2";
			if (!result.bool) {
				trigger.cancel();
				trigger.player.skip("phaseDiscard");
			}
		},
		ai: {
			expose: 0.1,
		},
	},
	lianda: {
		trigger: { player: "shaAfter" },
		direct: true,
		filter(event, player) {
			return event.target.isAlive() && player.countCards("he") > 0 && !player.hasSkill("lianda2");
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard("he", get.prompt("lianda"));
			next.ai = function (card) {
				if (get.effect(trigger.target, { name: "sha" }, player, player) > 0) {
					return 7 - get.value(card);
				}
				return 0;
			};
			next.logSkill = "lianda";
			"step 1";
			if (result.bool) {
				player.addTempSkill("lianda2");
				player.useCard({ name: "sha" }, trigger.target);
			}
		},
	},
	lianda2: {},
	huiqi: {
		trigger: { player: "damageEnd" },
		direct: true,
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("huiqi"), function (card, player, target) {
				return player !== target;
			}).ai = function (target) {
				var att = get.attitude(player, target);
				if (player.hp <= 0) {
					if (player === target) {
						return 1;
					}
					if (att > 3) {
						return att + Math.max(0, 5 - target.countCards("h"));
					}
					return att / 4;
				}
				if (att > 3) {
					return att + Math.max(0, 5 - target.countCards("h"));
				}
				return att;
			};
			"step 1";
			if (result.bool) {
				player.logSkill("huiqi", result.targets);
				result.targets[0].draw(player.maxHp - player.hp);
			}
		},
		ai: {
			expose: 0.2,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						return [1, 0.5];
					}
				},
			},
		},
	},
	xianghui: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { color: "red" },
		filter(event, player) {
			if (!player.countCards("h", { color: "red" })) {
				return false;
			}
			var players = game.filterPlayer();
			var min = players[0].hp;
			for (var i = 0; i < players.length; i++) {
				min = Math.min(min, players[i].hp);
			}
			for (var i = 0; i < players.length; i++) {
				if (players[i].hp === min && players[i].isDamaged()) {
					return true;
				}
			}
			return false;
		},
		prompt() {
			var players = game.filterPlayer();
			var targets = [];
			var min = players[0].hp;
			for (var i = 0; i < players.length; i++) {
				min = Math.min(min, players[i].hp);
			}
			for (var i = 0; i < players.length; i++) {
				if (players[i].hp === min && players[i].hp < players[i].maxHp) {
					targets.push(players[i]);
				}
			}
			return "令" + get.translation(targets) + "回复1点体力";
		},
		check(card) {
			return 8 - get.value(card);
		},
		filterTarget(card, player, target) {
			return target.isDamaged() && target.isMinHp();
		},
		selectTarget: -1,
		content() {
			target.recover();
		},
		ai: {
			expose: 0.1,
			order: 9,
			threaten: 1.4,
			result: {
				player(player, target) {
					var players = game.filterPlayer();
					var num = 0;
					var min = players[0].hp;
					for (var i = 0; i < players.length; i++) {
						min = Math.min(min, players[i].hp);
					}
					for (var i = 0; i < players.length; i++) {
						if (players[i].hp === min && players[i].hp < players[i].maxHp) {
							num += get.recoverEffect(players[i], player, player);
						}
					}
					return num;
				},
			},
		},
	},
	fzhenwei: {
		trigger: { global: "respondEnd" },
		filter(event, player) {
			if (_status.currentPhase !== player) {
				return false;
			}
			if (event.player === player) {
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
		direct: true,
		content() {
			"step 0";
			var cards = trigger.cards.slice(0);
			for (var i = 0; i < cards.length; i++) {
				if (get.position(cards[i]) !== "d") {
					cards.splice(i--, 1);
				}
			}
			event.cards = cards;
			player
				.chooseTarget(get.prompt("fzhenwei"), function (card, player, target) {
					return target !== trigger.player;
				})
				.set("autodelay", 0.5).ai = function (target) {
				var att = get.attitude(player, target);
				if (att <= 0) {
					return 0;
				}
				if (att > 3) {
					return 100 - target.countCards("h");
				}
				return att;
			};
			"step 1";
			if (result.bool) {
				player.logSkill("fzhenwei", result.targets);
				result.targets[0].gain(event.cards, "gain2", "log");
			}
		},
		ai: {
			expose: 0.1,
			threaten: 1.6,
		},
	},
	shangxi: {
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			if (player.countCards("he") === 0) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current !== player && get.distance(player, current, "attack") <= 1 && player.hp <= current.hp;
			});
		},
		content() {
			"step 0";
			var next = player.chooseCardTarget({
				position: "he",
				filterTarget(card, player, target) {
					return get.distance(player, target, "attack") <= 1 && player !== target && player.hp <= target.hp;
				},
				filterCard: lib.filter.cardDiscardable,
				ai1(card) {
					return 9 - get.value(card);
				},
				ai2(target) {
					return get.damageEffect(target, player, player);
				},
				prompt: get.prompt("shangxi"),
			});
			"step 1";
			if (result.bool) {
				player.discard(result.cards);
				player.logSkill("shangxi", result.targets);
				result.targets[0].damage();
			}
		},
		ai: {
			expose: 0.3,
		},
	},
	fuyan: {
		trigger: { player: "damageEnd" },
		direct: true,
		filter(event) {
			return event.num > 0;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("fuyan"), function (card, player, target) {
				return !target.hujia;
			}).ai = function (target) {
				if (get.attitude(player, target) <= 0) {
					return 0;
				}
				var eff = -get.damageEffect(target, target, player) + (player === target ? 2 : 0);
				if (target.hp === 1) {
					eff += 2;
				}
				return Math.min(1, eff);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("fuyan", result.targets);
				var target = result.targets[0];
				target.changeHujia();
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						return 0.7;
					}
				},
			},
			expose: 0.2,
		},
	},
	fuyan2: {
		trigger: { player: "damageBegin" },
		filter(event, player) {
			return event.num > 0;
		},
		forced: true,
		mark: "card",
		content() {
			trigger.num--;
			player.removeSkill("fuyan2");
			player.storage.fuyan2.discard();
			delete player.storage.fuyan2;
		},
		intro: {
			content: "card",
		},
	},
	guaili: {
		trigger: { source: "damageBegin" },
		filter(event) {
			return event.card && event.card.name === "sha" && event.parent.name !== "_lianhuan" && event.parent.name !== "_lianhuan2";
		},
		forced: true,
		content() {
			trigger.num++;
			player.addSkill("guaili2");
		},
	},
	guaili2: {
		trigger: { source: "damageEnd" },
		forced: true,
		popup: false,
		content() {
			player.removeSkill("guaili2");
			player.chooseToDiscard(2, true);
		},
	},
	xingzhui: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		filterTarget(card, player, target) {
			return player !== target && target.countCards("he") > 0;
		},
		check(card) {
			if (get.type(card) === "equip") {
				var distance = get.info(card).distance;
				if (distance) {
					if (distance.attackFrom < 0 || distance.globalFrom < 0) {
						return 10;
					}
				}
			}
			return 7 - get.value(card);
		},
		content() {
			"step 0";
			event.type = get.type(cards[0], "trick");
			var dme = get.damageEffect(target, player, target);
			target.chooseToDiscard(
				"he",
				function (card) {
					return get.type(card, "trick") === event.type;
				},
				"弃置一张牌" + get.translation(event.type) + "牌，或受到1点伤害"
			).ai = function (card) {
				if (dme < 0) {
					return 8 - get.value(card);
				}
				return 0;
			};
			"step 1";
			if (!result.bool) {
				target.damage();
			}
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					return get.damageEffect(target, player);
				},
			},
			threaten: 2,
			expose: 0.2,
		},
	},
	lingxian: {
		trigger: { player: ["respond", "useCard"] },
		direct: true,
		filter(event, player) {
			if (player === _status.currentPhase) {
				return false;
			}
			if (get.itemtype(event.cards) !== "cards") {
				return false;
			}
			return game.hasPlayer(function (current) {
				return get.distance(player, current, "attack") > 1 && player !== current;
			});
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("lingxian"), function (card, player, target) {
				return get.distance(player, target, "attack") > 1 && player !== target;
			}).ai = function (target) {
				var att = get.attitude(player, target);
				if (att <= -0.5) {
					return 0;
				}
				if (att <= 3) {
					return att + 0.5;
				}
				return att + Math.min(0.5, 5 - target.countCards("h"));
			};
			"step 1";
			if (result.bool) {
				game.asyncDraw([player, result.targets[0]]);
				player.logSkill("lingxian", result.targets);
			}
		},
		ai: {
			mingzhi: false,
			effect: {
				target_use(card, player, target) {
					if (player === _status.currentPhase) {
						return;
					}
					if (
						!game.hasPlayer(function (current) {
							return get.distance(player, current, "attack") > 1 && player !== current && get.attitude(player, current) >= 0;
						})
					) {
						return;
					}
					if (get.type(card) === "equip" && player === target) {
						var distance = get.info(card).distance;
						if (distance) {
							if (distance.attackFrom < 0 || distance.globalFrom < 0) {
								return 0;
							}
						}
					} else {
						if (!target.hasFriend()) {
							return;
						}
						var hs = target.countCards("h");
						if (get.tag(card, "respondShan")) {
							var shans = target.countCards("h", "shan");
							if (shans > 1) {
								return [0, 1];
							}
							if (shans && hs > 2) {
								return [0, 1];
							}
							if (shans) {
								return [0, 0];
							}
							if (hs > 2) {
								return [0, 0];
							}
							if (hs > 1) {
								return [1, 0.5];
							}
							return [1.5, 0];
						}
						if (get.tag(card, "respondSha")) {
							var shas = target.countCards("h", "sha");
							if (shas > 1) {
								return [0, 1];
							}
							if (shas && hs > 2) {
								return [0, 1];
							}
							if (shas) {
								return [0, 0];
							}
							if (hs > 2) {
								return [0, 0];
							}
							if (hs > 1) {
								return [1, 0.5];
							}
							return [1.5, 0];
						}
					}
				},
			},
			threaten: 0.8,
			expose: 0.1,
		},
	},
	shouyin: {
		limited: true,
		skillAnimation: "epic",
		animationColor: "water",
		unique: true,
		enable: "chooseToUse",
		init(player) {
			player.storage.shouyin = false;
		},
		mark: true,
		filter(event, player) {
			if (event.type !== "dying") {
				return false;
			}
			if (player.storage.shouyin) {
				return false;
			}
			if (player.isTurnedOver()) {
				return false;
			}
			return true;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.storage.shouyin = true;
			player.turnOver();
			"step 1";
			event.targets = game.filterPlayer();
			event.targets.sort(lib.sort.seat);
			"step 2";
			if (event.targets.length) {
				var target = event.targets.shift();
				if (target.hp < target.maxHp) {
					var num = target.maxHp - target.hp;
					target.recover(num);
					player.line(target, "green");
				}
				event.redo();
			}
		},
		ai: {
			skillTagFilter(player) {
				if (player.storage.shouyin) {
					return false;
				}
			},
			expose: 0.3,
			save: true,
			result: {
				player(player) {
					if (_status.event.dying !== player && get.attitude(player, _status.event.dying) <= 0) {
						return 0;
					}
					var num = 0;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						var del = players[i].maxHp - players[i].hp;
						del /= Math.pow(1 + players[i].hp, 0.2);
						num += get.sgnAttitude(player, players[i]) * del;
					}
					return num;
				},
			},
		},
		intro: {
			content: "limited",
		},
	},
	sliufeng: {
		mod: {
			targetInRange(card, player, target) {
				if (card.name === "sha" && player.hp >= target.hp) {
					return true;
				}
			},
		},
	},
	linyun: {
		enable: "chooseToUse",
		filterCard: true,
		selectCard: 2,
		position: "he",
		viewAs: { name: "sha" },
		prompt: "将两张牌当杀使用",
		check(card) {
			if (_status.event.player.countCards("h") < 4) {
				return 6 - get.useful(card);
			}
			return 7 - get.useful(card);
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.1;
			},
		},
		group: ["linyun2"],
	},
	linyun2: {
		trigger: { player: "shaBegin" },
		filter(event) {
			return event.skill === "linyun";
		},
		forced: true,
		popup: false,
		content() {
			"step 0";
			var next = trigger.target.chooseToRespond({ name: "shan" });
			next.autochoose = lib.filter.autoRespondShan;
			next.ai = function (card) {
				if (trigger.target.countCards("h", "shan") > 1) {
					return get.unuseful2(card);
				}
				return -1;
			};
			"step 1";
			if (result.bool === false) {
				trigger.untrigger();
				trigger.directHit = true;
			}
		},
		ai: {
			threaten: 1.3,
		},
	},
	linyun3: {
		trigger: { source: "damageAfter" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.parent.skill === "linyun" && !player.hasSkill("linyun4");
		},
		content() {
			player.draw();
			player.addTempSkill("linyun4", "shaAfter");
		},
	},
	linyun4: {},
	hutian: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("h") > 0 && !player.storage.hutian;
		},
		content() {
			"step 0";
			var next = player.chooseCardTarget({
				filterTarget(card, player, target) {
					return target.maxHp >= ui.selected.cards.length;
				},
				filterCard: true,
				selectCard: [1, player.countCards("he")],
				ai1(card) {
					var useful = get.useful(card);
					if (card.name === "du") {
						useful = -5;
					}
					if (ui.selected.cards.length === 0 && player.hp === 1) {
						return 11 - useful;
					}
					if (ui.selected.cards.length > 1) {
						return 0;
					}
					return 7 - useful;
				},
				ai2(target) {
					if (target.hp > ui.selected.cards.length) {
						return 0;
					}
					return get.attitude(player, target);
				},
				position: "he",
				prompt: get.prompt("hutian"),
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.$give(result.cards, target);
				player.lose(result.cards, ui.special);
				player.storage.hutian = target;
				player.logSkill("hutian", result.targets);
				player.addTempSkill("hutian4");
				target.addSkill("hutian2");
				target.storage.hutian2 = result.cards;
				game.addVideo("storage", target, ["hutian2", get.cardsInfo(result.cards), "cards"]);
			} else {
				event.finish();
			}
			"step 2";
			var target = event.target;
			if (target.storage.hutian2 && target.hp < target.storage.hutian2.length) {
				target.recover(target.storage.hutian2.length - target.hp);
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.5,
		},
		group: "hutian3",
	},
	hutian2: {
		trigger: { player: ["damageBegin", "loseHpBegin"] },
		forced: true,
		priority: -55,
		mark: true,
		filter(event, player) {
			return player.hp - event.num < player.storage.hutian2.length;
		},
		content() {
			trigger.num = player.hp - player.storage.hutian2.length;
		},
		intro: {
			content: "cards",
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
						if (target.hp <= target.storage.hutian2.length) {
							return 0;
						}
					}
				},
			},
		},
	},
	hutian3: {
		trigger: { player: ["phaseEnd", "dieBegin"] },
		forced: true,
		filter(event, player) {
			if (player.hasSkill("hutian4")) {
				return false;
			}
			return player.storage.hutian ? true : false;
		},
		priority: -1,
		content() {
			var target = player.storage.hutian;
			target.gain(target.storage.hutian2, "gain2");
			delete target.storage.hutian2;
			delete player.storage.hutian;
			target.removeSkill("hutian2");
		},
	},
	hutian4: {},
	chengjian: {
		trigger: { global: "damageEnd" },
		check(event, player) {
			return get.attitude(player, event.source) > 0;
		},
		filter(event, player) {
			return event.source && event.card && event.card.name === "sha" && event.source !== player;
		},
		logTarget: "source",
		content() {
			trigger.source.draw();
		},
		ai: {
			expose: 0.1,
			threaten: 1.2,
		},
	},
	huanxing: {
		trigger: { player: "phaseBegin" },
		group: "huanxing2",
		direct: true,
		content() {
			"step 0";
			if (player.countCards("he")) {
				player.chooseCardTarget({
					prompt: get.prompt("huanxing"),
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
						if (name === player.storage.huanxing) {
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
						if (player.additionalSkills.huanxing && player.additionalSkills.huanxing.length > 0) {
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
				player.unmark(player.storage.huanxing + "_charactermark");
				player.discard(result.cards);
				player.logSkill("huanxing", result.targets);
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
				player.addAdditionalSkill("huanxing", list);
				player.markCharacter(name, null, true, true);
				game.addVideo("markCharacter", player, {
					name: "幻形",
					content: "",
					id: "huanxing",
					target: name,
				});
				player.storage.huanxing = name;
			}
		},
		ai: {
			threaten: 1.5,
		},
	},
	huanxing2: {
		trigger: { player: "damageAfter" },
		priority: -15,
		forced: true,
		filter(event, player) {
			return player.additionalSkills.huanxing && player.additionalSkills.huanxing.length > 0;
		},
		content() {
			player.unmark(player.storage.huanxing + "_charactermark");
			player.removeAdditionalSkill("huanxing");
			delete player.storage.huanxing;
			player.checkMarks();
		},
	},
	guiying: {
		enable: "chooseToUse",
		filterCard: { color: "black" },
		position: "he",
		viewAs: { name: "toulianghuanzhu" },
		prompt: "将一张黑色牌当作偷梁换柱使用",
		check(card) {
			if (_status.event.player.countCards("h") > _status.event.player.hp) {
				return 5 - get.value(card);
			}
			return 0;
		},
	},
	suiyan: {
		trigger: { source: "damageEnd" },
		direct: true,
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.player.countCards("e");
		},
		content() {
			"step 0";
			var att = get.attitude(player, trigger.player);
			var next = player.chooseToDiscard("he", get.prompt("suiyan"));
			next.ai = function (card) {
				if (att < 0) {
					return 7 - get.value(card);
				}
				return -1;
			};
			next.logSkill = ["suiyan", trigger.player];
			"step 1";
			if (result.bool) {
				trigger.player.discard(trigger.player.getCards("e"));
			}
		},
		ai: {
			expose: 0.3,
		},
	},
	ningxian: {
		trigger: { player: "damageEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("he", { color: "black" }) > 0;
		},
		content() {
			"step 0";
			var enemy = game.countPlayer(function (current) {
				return current !== player && get.damageEffect(current, player, player) > 0;
			});
			var next = player.chooseCardTarget({
				position: "he",
				filterTarget(card, player, target) {
					return player !== target;
				},
				selectCard: [1, player.countCards("he", { color: "black" })],
				selectTarget() {
					if (ui.selected.targets.length > ui.selected.cards.length) {
						game.uncheck("target");
					}
					return ui.selected.cards.length;
				},
				filterCard(card, player) {
					return get.color(card) === "black" && lib.filter.cardDiscardable(card, player);
				},
				ai1(card) {
					if (ui.selected.cards.length >= enemy) {
						return 0;
					}
					return 9 - get.value(card);
				},
				ai2(target) {
					return get.damageEffect(target, player, player);
				},
				prompt: get.prompt("ningxian"),
			});
			"step 1";
			if (result.bool) {
				player.discard(result.cards);
				player.logSkill("ningxian", result.targets);
				event.targets = result.targets;
				event.targets.sort(lib.sort.seat);
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets.length) {
				event.targets.shift().damage();
				event.redo();
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -0.5];
						}
						if (!target.hasFriend()) {
							if (get.mode() === "guozhan") {
								if (!player.hasFriend()) {
									return;
								}
							} else {
								return;
							}
						}
						if (target.countCards("h") > 2 || target.countCards("e", { color: "black" })) {
							return [1, 0, 0, -1];
						}
						return [1, -0.5];
					}
				},
			},
		},
	},
	xuanyuan: {
		trigger: { player: "phaseEnd" },
		unique: true,
		forceunique: true,
		direct: true,
		filter(event, player) {
			if (!player.countCards("he", { suit: "spade" })) {
				return false;
			}
			for (var i = 0; i < ui.discardPile.childElementCount; i++) {
				if (ui.discardPile.childNodes[i].name === "xuanyuanjian") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			player.chooseToDiscard("he", { suit: "spade" }, get.prompt2("xuanyuan")).set("ai", function (card) {
				return 8 - get.value(card);
			});
			"step 1";
			var card;
			for (var i = 0; i < ui.discardPile.childElementCount; i++) {
				if (ui.discardPile.childNodes[i].name === "xuanyuanjian") {
					card = ui.discardPile.childNodes[i];
					break;
				}
			}
			if (card) {
				player.equip(card, true);
			}
		},
		global: "xuanyuan_ai",
	},
	xuanyuan_ai: {
		ai: {
			effect: {
				player(card, player) {
					if (player.hasSkill("xuanyuan")) {
						return;
					}
					if (
						card.name === "xuanyuanjian" &&
						game.hasPlayer(function (current) {
							return current.hasSkill("xuanyuan") && get.attitude(player, current) <= 0;
						})
					) {
						return [0, 0, 0, 0];
					}
				},
			},
		},
	},
	jilve: {
		enable: "phaseUse",
		usable: 3,
		onChooseToUse(event) {
			var cards = [];
			var num = 3;
			if (ui.cardPile.childNodes.length < num) {
				var discardcards = get.cards(num);
				for (var i = 0; i < discardcards.length; i++) {
					discardcards[i].discard();
				}
			}
			for (var i = 0; i < num; i++) {
				cards.push(ui.cardPile.childNodes[i]);
			}
			event.set("jilvecards", cards);
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("极略：选择一张基本牌或锦囊牌使用", event.jilvecards);
			},
			filter(button, player) {
				var evt = _status.event.getParent();
				if (evt && evt.filterCard) {
					var type = get.type(button.link, "trick");
					return (type !== "equip") & evt.filterCard(button.link, player, evt);
				}
				return false;
			},
			check(button) {
				if (button.link.name === "du") {
					return 0;
				}
				return 1;
			},
			backup(links, player) {
				return {
					filterCard() {
						return false;
					},
					selectCard: -1,
					viewAs: links[0],
				};
			},
			prompt(links, player) {
				return "选择" + get.translation(links) + "的目标";
			},
		},
		ai: {
			order: 12,
			result: {
				player: 1,
			},
			threaten: 1.7,
		},
	},
	jilve6: {
		trigger: { player: "useCardBefore" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.skill === "jilve2";
		},
		content() {
			player.getStat("skill").jilve++;
		},
	},
	jilve2: {
		filterCard() {
			return false;
		},
		selectCard: -1,
	},
	jilve3: {},
	jilve4: {
		trigger: { player: "useCard" },
		forced: true,
		popup: false,
		filter(event) {
			return event.skill === "jilve2";
		},
		content() {
			player.storage.jilve++;
		},
	},
	jilve5: {
		trigger: { player: "phaseUseBegin" },
		forced: true,
		popup: false,
		content() {
			player.storage.jilve = 0;
		},
	},
	pozhou: {
		unique: true,
		trigger: { player: "damageEnd" },
		forced: true,
		init(player) {
			player.storage.pozhou = 0;
		},
		content() {
			if (typeof trigger.num === "number") {
				player.storage.pozhou += trigger.num;
			}
			if (player.storage.pozhou) {
				player.markSkill("pozhou");
			}
			game.addVideo("storage", player, ["pozhou", player.storage.pozhou]);
		},
		intro: {
			content: "mark",
		},
		group: "pozhou2",
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1.5];
						}
						if (player.hp >= 4) {
							return [1, 1.5];
						}
						if (target.hp === 3) {
							return [1, 1];
						}
						if (target.hp === 2) {
							return [1, 0.5];
						}
					}
				},
			},
		},
	},
	pozhou2: {
		enable: "phaseUse",
		filter(event, player) {
			return player.storage.pozhou > 0;
		},
		filterTarget(card, player, target) {
			return target !== player && !target.hasSkill("fengyin");
		},
		selectTarget() {
			return [1, _status.event.player.storage.pozhou];
		},
		prompt: "出牌阶段，你可以指定任意名其他角色并弃置等量的破咒标记，令目标的非锁定技失效直到其下一回合结束",
		content() {
			player.storage.pozhou--;
			if (!player.storage.pozhou) {
				player.unmarkSkill("pozhou");
			} else {
				player.updateMarks();
			}
			target.addTempSkill("fengyin", { player: "phaseAfter" });
		},
		ai: {
			order: 11,
			result: {
				target(player, target) {
					var skills = target.getSkills();
					for (var i = 0; i < skills.length; i++) {
						if (!get.is.locked(skills[i])) {
							if (target.hasSkillTag("maixie")) {
								return -2;
							}
							return -get.threaten(target);
						}
					}
					return 0;
				},
			},
		},
	},
	duanyue: {
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filterCard: { type: "equip" },
		check(card) {
			var player = _status.currentPhase;
			if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
				return 12 - get.equipValue(card);
			}
			return 8 - get.equipValue(card);
		},
		filter(event, player) {
			return player.countCards("he", { type: "equip" });
		},
		filterTarget(card, player, target) {
			return player !== target;
		},
		content() {
			target.damage();
		},
		ai: {
			order: 9.5,
			expose: 0.2,
			result: {
				player(player, target) {
					return get.damageEffect(target, player, player);
				},
			},
		},
	},
	tuzhen: {
		trigger: { source: "damageAfter" },
		filter(event, player) {
			return (
				event.player.isIn() &&
				event.player !== player &&
				event.player.hasCard(function (card) {
					return get.type(card) !== "basic";
				})
			);
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		content() {
			var hs = trigger.player.getCards("h", function (card) {
				return get.type(card) !== "basic";
			});
			trigger.player.discard(hs);
		},
	},
	mojian: {
		trigger: { player: "shaBegin" },
		check(event, player) {
			if (get.attitude(player, event.target) > 0) {
				return true;
			}
			return player.hp < player.maxHp;
		},
		logTarget: "target",
		content() {
			"step 0";
			trigger.target.draw();
			"step 1";
			player.recover();
		},
	},
	swdliuhong: {
		trigger: { player: ["useCard"] },
		frequent: true,
		filter(event) {
			return event.card && event.card.name === "sha";
		},
		content() {
			player.draw();
		},
	},
	poyue: {
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
		group: "poyue2",
	},
	poyue2: {
		trigger: { player: "shaBegin" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.card && get.color(event.card) === "red";
		},
		content() {
			trigger.directHit = true;
		},
	},
	jianji: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", { type: "equip" }) > 0 && lib.filter.cardEnabled({ name: "sha" }, player);
		},
		usable: 1,
		filterCard: { type: "equip" },
		position: "he",
		check(card) {
			var player = _status.currentPhase;
			if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
				return 11 - get.equipValue(card);
			}
			return 6 - get.equipValue(card);
		},
		discard: false,
		prepare: "throw",
		delay: false,
		filterTarget(card, player, target) {
			return lib.filter.targetEnabled({ name: "sha" }, player, target);
		},
		content() {
			"step 0";
			player.addAdditionalSkill("jianji", "unequip");
			player.draw();
			player.useCard({ name: "sha" }, cards, targets, false).animate = false;
			player.line(targets, "fire");
			"step 1";
			player.removeAdditionalSkill("jianji");
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.1;
			},
			result: {
				target(player, target) {
					player.addAdditionalSkill("jianji_ai", "unequip");
					var eff = get.effect(target, { name: "sha" }, player, target);
					player.removeAdditionalSkill("jianji_ai");
					return eff;
				},
			},
			effect: {
				player_use(card, player) {
					if (_status.currentPhase !== player) {
						return;
					}
					if (get.type(card) === "equip" && player.countCards("e", { subtype: get.subtype(card) }) && lib.filter.filterCard({ name: "sha" }, player)) {
						return 0;
					}
				},
			},
			threaten: 1.3,
		},
	},
	huangyu: {
		enable: "phaseUse",
		filter(event, player) {
			return !player.getStat("skill").huangyu && player.countCards("he", { color: "red" }) > 1;
		},
		filterCard: { color: "red" },
		selectCard: 2,
		position: "he",
		viewAs: { name: "chiyuxi", nature: "fire" },
		check(card) {
			var player = _status.event.player;
			if (player.hasSkill("jianji") && get.type(card) === "equip" && lib.filter.filterCard({ name: "sha" }, player)) {
				return 0;
			}
			return 6 - get.value(card);
		},
		ai: {
			order: 8,
			expose: 0.2,
			threaten: 1.2,
		},
	},
	gongshen: {
		trigger: { global: "useCard" },
		priority: 15,
		filter(event, player) {
			var type = get.type(event.card, "trick");
			if (type !== "basic" && type !== "trick") {
				return false;
			}
			return event.player !== player && player.countCards("he", { type: "equip" }) > 0 && event.targets && event.targets.length > 0;
		},
		direct: true,
		content() {
			"step 0";
			var effect = 0;
			for (var i = 0; i < trigger.targets.length; i++) {
				effect += get.effect(trigger.targets[i], trigger.card, trigger.player, player);
			}
			var str = "弃置一张装备牌令" + get.translation(trigger.player);
			if (trigger.targets && trigger.targets.length) {
				str += "对" + get.translation(trigger.targets);
			}
			str += "的" + get.translation(trigger.card) + "失效";
			var next = player.chooseToDiscard("he", { type: "equip" }, get.prompt("gongshen"));
			next.prompt2 = str;
			next.logSkill = ["gongshen", trigger.player];
			next.autodelay = true;
			next.ai = function (card) {
				if (effect < 0) {
					var val = 9 - get.value(card);
					var nme = trigger.card.name;
					if (get.value(trigger.card) >= 7 && get.type(trigger.card) === "trick") {
						return val;
					}
					if (nme === "tao") {
						return val;
					}
					if (nme === "wuzhong") {
						return val;
					}
					if (nme === "zengbin") {
						return val;
					}
					if (nme === "wangmeizhike") {
						return val;
					}
					if (nme === "shunshou" && player === trigger.targets[0]) {
						return val;
					}
					if (nme === "guohe" && player === trigger.targets[0]) {
						return val;
					}
					if (nme === "liuxinghuoyu") {
						return val;
					}
					if (nme === "nanman") {
						return val;
					}
					if (nme === "wanjian") {
						return val;
					}
					if (nme === "jingleishan") {
						return val;
					}
					if (nme === "chiyuxi") {
						return val;
					}
					if (nme === "juedou" && (player === trigger.targets[0] || trigger.targets[0].hp === 1)) {
						return val;
					}
					if (nme === "chenhuodajie") {
						return val;
					}
					if (nme === "lebu" && trigger.targets[0].countCards("h") > trigger.targets[0].hp) {
						return val;
					}
					if (nme === "sha" && trigger.targets[0].hp === 1 && !trigger.targets[0].hasShan()) {
						return val;
					}
					if (nme === "jiedao" && trigger.targets[0] === player) {
						return val;
					}
					if (nme === "yihuajiemu" && trigger.targets[0] === player) {
						return val;
					}
					if (nme === "shuigong" && trigger.targets.includes(player)) {
						return val;
					}
					return 0;
				}
				return -1;
			};
			"step 1";
			if (result.bool) {
				trigger.cancel();
			}
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (player !== target) {
						return;
					}
					if (get.type(card) === "equip" && !player.needsToDiscard()) {
						return [0, 0, 0, 0];
					}
				},
			},
			threaten: 2,
			expose: 0.3,
		},
	},
	duishi: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > 0 && !player.hasSkill("duishi2");
		},
		filterTarget(card, player, target) {
			return player !== target && target.countCards("h") > 0 && !target.hasSkill("duishi3");
		},
		filterCard: true,
		check(card) {
			return 8 - get.value(card);
		},
		content() {
			"step 0";
			var suit = get.suit(cards[0]);
			target.chooseToDiscard({ suit: suit }, "h", "对诗：弃置一张" + get.translation(suit) + "牌，或令" + get.translation(player) + "获得你一张牌").ai = function (card) {
				if (get.attitude(target, player) > 0) {
					return 0;
				}
				return 9 - get.value(card);
			};
			"step 1";
			if (result.bool) {
				target.addTempSkill("duishi3");
			} else {
				player.gainPlayerCard(target, "he", true);
				player.addTempSkill("duishi2");
			}
		},
		ai: {
			order: 9,
			threaten: 1.5,
			result: {
				target: -2,
				player: 0.5,
			},
			expose: 0.2,
		},
	},
	duishi2: {},
	duishi3: {},
	lianwu: {
		mod: {
			selectTarget(card, player, range) {
				if (card.name === "sha" && range[1] !== -1) {
					range[1]++;
				}
			},
		},
		trigger: { player: "shaBegin" },
		forced: true,
		filter(event, player) {
			return event.card && get.color(event.card) === "red";
		},
		content() {
			trigger.directHit = true;
		},
	},
	mingfu: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he", { suit: "club" }) > 0;
		},
		position: "he",
		filterCard: { suit: "club" },
		discard: false,
		prepare: "throw",
		filterTarget(card, player, target) {
			return lib.filter.targetEnabled({ name: "guiyoujie" }, player, target);
		},
		check(card) {
			if (card.name === "du") {
				return 20;
			}
			return Math.max(7 - get.value(card), 7 - get.useful(card));
		},
		content() {
			target.addJudge("guiyoujie", cards);
		},
		ai: {
			result: {
				target(player, target) {
					return get.effect(target, { name: "guiyoujie" }, player, target);
				},
			},
			order: 8,
		},
	},
	mufeng: {
		trigger: { player: "phaseEnd" },
		frequent: true,
		filter(event, player) {
			return player.hasSkill("mufeng_used");
		},
		content() {
			player.discoverCard();
		},
		subSkill: {
			used: {},
			count: {
				trigger: { player: "useCard" },
				silent: true,
				filter(event, player) {
					return _status.currentPhase === player && get.type(event.card) === "basic";
				},
				content() {
					player.addTempSkill("mufeng_used");
				},
			},
		},
		group: "mufeng_count",
	},
	jiying: {
		mod: {
			targetInRange(card) {
				if (card.name === "sha") {
					return true;
				}
			},
		},
	},
	minjing: {
		trigger: { player: "damageBegin" },
		forced: true,
		filter(event, player) {
			if (player.getEquip(2)) {
				return false;
			}
			return lib.skill.guangshatianyi.filter(event, player);
		},
		content() {
			trigger.num--;
		},
		ai: {
			threaten: 0.8,
		},
	},
	touxi: {
		trigger: { global: "phaseEnd" },
		check(event, player) {
			return get.damageEffect(event.player, player, player, "thunder") > 0;
		},
		filter(event, player) {
			return event.player !== player && !player.hasSkill("touxi2") && event.player.isAlive();
		},
		logTarget: "player",
		content() {
			"step 0";
			player.judge(function (card) {
				if (get.color(card) === "black") {
					return 1;
				}
				return -1;
			});
			"step 1";
			if (result.bool) {
				trigger.player.damage("thunder");
				player.addSkill("touxi2");
				event.finish();
			} else {
				if (player.countCards("he")) {
					var att = get.attitude(trigger.player, player);
					trigger.player.discardPlayerCard(player, "he", function (button) {
						if (att > 0) {
							return 0;
						}
						return get.buttonValue(button);
					});
				}
			}
		},
		ai: {
			expose: 0.3,
			threaten: 1.2,
		},
	},
	touxi2: {
		trigger: { player: "phaseBegin" },
		forced: true,
		popup: false,
		content() {
			player.removeSkill("touxi2");
		},
	},
	nlianji: {
		audio: "lianji",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			if (player === target) {
				return false;
			}
			if (!ui.selected.targets.length) {
				return target.countCards("h") > 0;
			}
			return ui.selected.targets[0].canCompare(target);
		},
		selectTarget: 2,
		multitarget: true,
		multiline: true,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		prepare: "throw",
		discard: false,
		filterCard: true,
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			if (targets[0].canCompare(targets[1])) {
				targets[0].chooseToCompare(targets[1]);
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				targets[0].gain(cards, "log");
				targets[0].$gain2(cards);
				targets[1].damage(targets[0]);
			} else if (!result.tie) {
				targets[1].gain(cards, "log");
				targets[1].$gain2(cards);
				targets[0].damage(targets[1]);
			}
		},
		ai: {
			expose: 0.3,
			threaten: 2,
			order: 9,
			result: {
				target: -1,
			},
		},
	},
	lianji2: {
		group: ["lianji3", "lianji4"],
	},
	lianji3: {
		trigger: { player: "shaHit" },
		forced: true,
		popup: false,
		content() {
			player.storage.lianji2 = true;
		},
	},
	lianji4: {
		trigger: { player: "shaAfter" },
		forced: true,
		popup: false,
		content() {
			if (!player.storage.lianji2) {
				player.damage("thunder", player.storage.lianji);
			}
			delete player.storage.lianji;
			delete player.storage.lianji2;
			player.removeSkill("lianji2");
		},
	},
	miedao: {
		locked: true,
		group: ["miedao1", "miedao2"],
		ai: {
			threaten: 1.4,
		},
	},
	miedao1: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		content() {
			trigger.num += player.maxHp - player.hp;
		},
	},
	miedao2: {
		trigger: { player: "phaseDiscardBegin" },
		forced: true,
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		content() {
			player.chooseToDiscard(player.maxHp - player.hp, "he", true);
		},
	},
	aojian: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		filterTarget(card, player, target) {
			return player !== target && get.distance(player, target, "attack") <= 1;
		},
		selectTarget() {
			return ui.selected.cards.length;
		},
		selectCard() {
			var player = _status.currentPhase;
			return [1, Math.min(game.players.length - 1, player.maxHp - player.hp)];
		},
		filterCard: true,
		check(card) {
			if (ui.selected.cards.length === 0) {
				return 8 - get.value(card);
			}
			return 5 - get.value(card);
		},
		content() {
			"step 0";
			target.damage();
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target);
				},
			},
			threaten(player, target) {
				if (target.hp === 1) {
					return 2;
				}
				if (target.hp === 2) {
					return 1.5;
				}
				return 0.5;
			},
			maixie: true,
			effect: {
				target(card, player, target) {
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
	moyan: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hp < player.maxHp && player.countCards("h", { color: "red" }) > 0;
		},
		filterTarget(card, player, target) {
			return player !== target;
		},
		selectTarget() {
			return ui.selected.cards.length;
		},
		selectCard() {
			var player = _status.currentPhase;
			return [1, Math.min(game.players.length - 1, player.maxHp - player.hp)];
		},
		filterCard(card) {
			return get.color(card) === "red";
		},
		check(card) {
			if (ui.selected.cards.length === 0) {
				return 8 - get.value(card);
			}
			return 6 - get.value(card);
		},
		line: "fire",
		content() {
			"step 0";
			target.damage("fire");
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target, "fire");
				},
			},
			threaten(player, target) {
				if (target.hp === 1) {
					return 2;
				}
				if (target.hp === 2) {
					return 1.5;
				}
				return 0.5;
			},
			maixie: true,
			effect: {
				target(card, player, target) {
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
	wangchen: {
		trigger: { player: "phaseDiscardEnd" },
		direct: true,
		filter(event, player) {
			if (event.cards) {
				for (var i = 0; i < event.cards.length; i++) {
					if (get.type(event.cards[i]) === "basic") {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("wangchen"), function (card, player, target) {
				return target !== player;
			}).ai = function (target) {
				if (target.hasSkillTag("noturn")) {
					return 0;
				}
				return get.attitude(player, target) * (target.isTurnedOver() ? 1 : -1);
			};
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("wangchen", target);
				target.turnOver();
			}
		},
		ai: {
			expose: 0.5,
			threaten: 2,
		},
	},
	wangchen2: {
		trigger: { player: "phaseBefore" },
		forced: true,
		popup: false,
		filter(event, player) {
			var prev = player.previous;
			if (prev.storage.wangchen === prev) {
				return true;
			}
		},
		content() {
			player.previous.out();
		},
	},
	wangchen3: {
		trigger: { player: "dieBegin" },
		forced: true,
		popup: false,
		filter(event, player) {
			return player.storage.wangchen && player.storage.wangchen.isOut();
		},
		content() {
			player.storage.wangchen.out();
		},
	},
	yihua: {
		trigger: { target: "useCardToBefore" },
		popup: false,
		direct: true,
		filter(event, player) {
			if (event.addedTargets) {
				return false;
			}
			return event.targets.length === 1 && event.player !== player && player.countCards("h") >= 2;
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt("yihua", trigger.player), 2);
			next.ai = function (card) {
				if (get.effect(player, trigger.card) < 0) {
					if (card.name === "liuxinghuoyu") {
						return 7 - get.value(card);
					}
					return 5 - get.value(card);
				}
				return 0;
			};
			next.prompt2 = "反弹" + get.translation(trigger.player) + "的" + get.translation(trigger.card);
			next.logSkill = ["yihua", trigger.player];
			"step 1";
			if (result.bool) {
				trigger.target = trigger.player;
				trigger.player = player;
				trigger.untrigger();
				trigger.trigger("useCardToBefore");
			}
		},
		ai: {
			threaten(player, target) {
				if (target.countCards("h") <= 2) {
					return 2;
				}
				return 2 / (target.countCards("h") - 1);
			},
		},
	},
	youyin: {
		trigger: { global: "discardAfter" },
		filter(event, player) {
			if (event.player === player) {
				return false;
			}
			if (player.countCards("h") >= 5) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (get.type(event.cards[i]) !== "basic") {
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
			player.draw();
		},
	},
	anlianying: {
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
			effect: {
				target(card) {
					if (card.name === "guohe" || card.name === "liuxinghuoyu") {
						return 0.5;
					}
				},
			},
			noh: true,
			freeSha: true,
			freeShan: true,
			skillTagFilter(player) {
				return player.countCards("h") === 1;
			},
		},
	},
	zhanlu: {
		enable: "phaseUse",
		filterCard(card) {
			var suit = get.suit(card);
			return suit === "spade";
		},
		position: "he",
		usable: 1,
		filter(event, player) {
			return player.countCards("he", { suit: "spade" }) > 0;
		},
		check(card) {
			return 10 - get.value(card);
		},
		filterTarget(card, player, target) {
			if (target.hp >= target.maxHp) {
				return false;
			}
			return true;
		},
		selectTarget: [1, 3],
		content() {
			target.recover();
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (player === target && player.countCards("h") > player.hp) {
						return 20;
					}
					return get.recoverEffect(target, player, target);
				},
			},
			threaten: 2,
		},
	},
	huopu: {
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filterCard(card) {
			return get.suit(card) === "heart";
		},
		viewAs: { name: "liuxinghuoyu" },
		viewAsFilter(player) {
			if (!player.countCards("he", { suit: "heart" })) {
				return false;
			}
		},
		prompt: "将一张红桃手牌当作流星火羽使用",
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			threaten: 1.4,
			order: 9,
		},
	},
	rexue: {
		trigger: { global: "phaseBegin" },
		direct: true,
		filter(event, player) {
			return lib.filter.targetEnabled({ name: "sha" }, player, event.player) && player.hasSha(null, true);
		},
		clearTime: true,
		content() {
			var next = player.chooseToUse({ name: "sha" }, "热血：是否对" + get.translation(trigger.player) + "使用一张杀", trigger.player, -1);
			next.logSkill = "rexue";
			next.oncard = function () {
				player.draw();
			};
		},
	},
	shengshou: {
		enable: "phaseUse",
		filterCard(card) {
			return get.color(card) === "black";
		},
		viewAs: { name: "caoyao" },
		prompt: "将一张黑色手牌当作草药使用",
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			threaten: 1.6,
		},
	},
	huanjian: {
		enable: "phaseUse",
		filterCard(card) {
			return get.color(card) === "black";
		},
		viewAs: { name: "bingpotong" },
		position: "he",
		filter(event, player) {
			return player.countCards("h", { color: "black" }) > 0;
		},
		viewAsFilter(player) {
			if (!player.countCards("he", { color: "black" })) {
				return false;
			}
		},
		prompt: "将一张黑色牌当作冰魄针使用",
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			threaten: 1.1,
		},
	},
	moyu: {
		trigger: { source: "dieAfter" },
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		frequent: true,
		content() {
			player.recover(player.maxHp - player.hp);
		},
		threaten: 1.2,
	},
	susheng: {
		trigger: { global: "dieBefore" },
		direct: true,
		filter(event, player) {
			if (player.hasSkill("susheng2")) {
				return false;
			}
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			var att = get.attitude(player, trigger.player);
			var nh = player.countCards("h");
			var next;
			next = player.chooseToDiscard(get.prompt("susheng", trigger.player));
			next.logSkill = ["susheng", trigger.player];
			next.ai = function (card) {
				if (att > 3 || (att > 1 && nh > 2)) {
					return get.unuseful2(card);
				}
				return 0;
			};
			"step 1";
			if (result.bool) {
				trigger.cancel();
				trigger.player.hp = 1;
				if (trigger.player.maxHp < 1) {
					trigger.player.maxHp = 1;
				}
				trigger.player.update();
				player.addTempSkill("susheng2");
			}
		},
		ai: {
			threaten: 2,
		},
	},
	susheng2: {},
	kunlunjing: {
		unique: true,
		group: ["kunlunjing1", "kunlunjing2"],
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
	},
	kunlunjing1: {
		trigger: { player: "phaseBegin" },
		priority: 10,
		filter(event, player) {
			if (!player.storage.kunlunjing) {
				return false;
			}
			return player.hp < player.storage.kunlunjing2;
		},
		onremove: ["kunlunjing", "kunlunjing2"],
		check(event, player) {
			var storage = player.storage.kunlunjing;
			var num = 0;
			for (var i = 0; i < storage.length; i++) {
				if (game.players.includes(storage[i].player)) {
					var att = get.attitude(player, storage[i].player);
					var num2 = storage[i].value - storage[i].player.countCards("he") + storage[i].player.countCards("j");
					if (att > 0) {
						num += num2;
					} else if (att < 0) {
						num -= num2;
					}
				}
			}
			return num > Math.min(2, game.players.length / 2);
		},
		content() {
			"step 0";
			game.delay(0.5);
			"step 1";
			game.animate.window(1);
			"step 2";
			var storage = event.player.storage.kunlunjing;
			for (var i = 0; i < storage.length; i++) {
				var player = storage[i].player;
				if (player.isAlive()) {
					var cards = player.getCards("hej");
					for (var j = 0; j < cards.length; j++) {
						cards[j].discard();
					}
					player.removeEquipTrigger();
				}
			}
			"step 3";
			var storage = event.player.storage.kunlunjing;
			var player;
			var i, j;
			for (i = 0; i < storage.length; i++) {
				player = storage[i].player;
				if (player.isAlive()) {
					for (j = 0; j < storage[i].handcards1.length; j++) {
						if (storage[i].handcards1[j].parentNode === ui.discardPile || storage[i].handcards1[j].parentNode === ui.cardPile) {
							player.node.handcards1.appendChild(storage[i].handcards1[j]);
						} else {
							player.node.handcards1.appendChild(game.createCard(storage[i].handcards1[j]));
						}
					}
					for (j = 0; j < storage[i].handcards2.length; j++) {
						if (storage[i].handcards2[j].parentNode === ui.discardPile || storage[i].handcards2[j].parentNode === ui.cardPile) {
							player.node.handcards2.appendChild(storage[i].handcards2[j]);
						} else {
							player.node.handcards2.appendChild(game.createCard(storage[i].handcards2[j]));
						}
					}
					for (j = 0; j < storage[i].equips.length; j++) {
						if (storage[i].equips[j].parentNode === ui.discardPile || storage[i].equips[j].parentNode === ui.cardPile) {
							storage[i].equips[j].style.transform = "";
							player.$equip(storage[i].equips[j]);
						} else {
							player.$equip(game.createCard(storage[i].equips[j]));
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
							player.node.judges.appendChild(storage[i].judges[j]);
						}
					}
					player.update();
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
			game.addVideo("skill", event.player, ["kunlunjing", data]);
			game.animate.window(2);
			ui.updatehl();
		},
	},
	kunlunjing2: {
		trigger: { player: "phaseAfter" },
		silent: true,
		content() {
			var handcards1, handcards2, judges, equips, viewAs, i, j;
			player.storage.kunlunjing = [];
			player.storage.kunlunjing2 = player.hp;
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

				player.storage.kunlunjing.push({
					player: game.players[i],
					handcards1: handcards1,
					handcards2: handcards2,
					judges: judges,
					equips: equips,
					viewAs: viewAs,
					value: handcards1.length + handcards2.length + equips.length - judges.length,
				});
			}
		},
	},
	oldliaoyuan: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			return player !== target;
		},
		filterCard(card, player) {
			if (ui.selected.cards.length) {
				return get.suit(card) === get.suit(ui.selected.cards[0]);
			}
			var cards = player.getCards("h");
			for (var i = 0; i < cards.length; i++) {
				if (card !== cards[i]) {
					if (get.suit(card) === get.suit(cards[i])) {
						return true;
					}
				}
			}
			return false;
		},
		prepare: "throw",
		selectCard: [2, 2],
		check(card) {
			return 6 - get.useful(card);
		},
		prompt: "弃置两张相同花色的手牌，选择一名角色弃置其一张牌，并视为对其使用一张火杀",
		content() {
			"step 0";
			if (target.countCards("he")) {
				player.discardPlayerCard(target, "he");
			}
			"step 1";
			player.useCard({ name: "sha", nature: "fire" }, target, false, "oldliaoyuan").animate = false;
		},
		ai: {
			order: 3,
			result: {
				target(player, target) {
					return get.effect(target, { name: "sha", nature: "fire" }, player, target) - 1;
				},
			},
			expose: 0.2,
		},
	},
	oldliaoyuan2: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			return player !== target;
		},
		filterCard(card, player) {
			if (ui.selected.cards.length) {
				return get.suit(card) === get.suit(ui.selected.cards[0]);
			}
			var cards = player.getCards("h");
			for (var i = 0; i < cards.length; i++) {
				if (card !== cards[i]) {
					if (get.suit(card) === get.suit(cards[i])) {
						return true;
					}
				}
			}
			return false;
		},
		delay: false,
		discard: false,
		selectCard: [2, 2],
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			"step 0";
			player.useCard({ name: "sha" }, [cards[0]], target, false, "liaoyuan");
			"step 1";
			player.useCard({ name: "sha" }, [cards[1]], target, false, "liaoyuan");
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					return get.effect(target, { name: "sha" }, player, target) * 2;
				},
			},
			expose: 0.2,
		},
	},
	shehun: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			return player !== target && target.countCards("he") > 0;
		},
		filterCard(card) {
			var suit = get.suit(card);
			for (var i = 0; i < ui.selected.cards.length; i++) {
				if (get.suit(ui.selected.cards[i]) === suit) {
					return false;
				}
			}
			return true;
		},
		complexCard: true,
		selectCard: [1, 4],
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			"step 0";
			var suits = [];
			event.suits = suits;
			for (var i = 0; i < cards.length; i++) {
				suits.push(get.suit(cards[i]));
			}
			var hs = target.getCards("he");
			var hss = {
				club: [],
				diamond: [],
				spade: [],
				heart: [],
			};
			var choice = [];
			for (var i = 0; i < hs.length; i++) {
				var suity = get.suit(hs[i]);
				if (hss[suity]) {
					hss[suity].push(hs[i]);
				}
			}
			for (var i in hss) {
				if (!suits.includes(i)) {
					choice = choice.concat(hss[i]);
					delete hss[i];
				}
			}
			if (choice.length < cards.length) {
				choice.length = 0;
			}
			target.chooseToDiscard(cards.length, true, "he").ai = function (card) {
				var num = choice.includes(card) ? 20 : 0;
				return num - get.value(card);
			};
			"step 1";
			var damage = false;
			for (var i = 0; i < result.cards.length; i++) {
				if (event.suits.includes(get.suit(result.cards[i]))) {
					damage = true;
					break;
				}
			}
			if (damage) {
				target.damage();
			}
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					var eff = get.damageEffect(target, player);
					var num = target.countCards("he");
					var length = ui.selected.cards.length;
					if (num === length) {
						return -2 + eff;
					}
					if (num > length) {
						return -1.5 + eff;
					}
					return -1 + eff;
				},
			},
			expose: 0.2,
		},
	},
	liaoyuan: {
		trigger: { player: "shaBegin" },
		direct: true,
		filter(event, player) {
			if (get.itemtype(event.cards) !== "cards") {
				return false;
			}
			return player.countCards("he", { suit: get.suit(event.cards) }) > 0;
		},
		content() {
			"step 0";
			player.storage.liaoyuan = 0;
			event.num = 0;
			event.cards = [];
			"step 1";
			var suit = get.suit(trigger.cards);
			event.suit = suit;
			player.chooseCard("he", get.prompt("liaoyuan"), function (card, player) {
				return get.suit(card) === suit && lib.filter.cardDiscardable(card, player);
			}).ai = function (card) {
				if (get.attitude(player, trigger.target) >= 0) {
					return 0;
				}
				if (get.effect(trigger.target, { name: "sha" }, player, player) > 0) {
					return 7 - get.value(card);
				}
				return 0;
			};
			"step 2";
			if (result.bool) {
				if (event.num === 0) {
					player.logSkill("liaoyuan");
				}
				player.discard(result.cards);
				event.num++;
				if (player.countCards("he", { suit: event.suit }) > 1) {
					event.goto(1);
				}
			}
			"step 3";
			if (event.num) {
				var next = trigger.target.chooseToRespond({ name: "shan" }, "请打出一张闪响应燎原");
				next.ai = get.unuseful2;
				if (event.num > 1) {
					next.set("prompt2", "共需额外打出" + event.num + "张闪");
				}
			} else {
				event.finish();
			}
			"step 4";
			if (result.bool) {
				event.num--;
				event.goto(3);
			} else {
				trigger.untrigger();
				trigger.directHit = true;
				player.storage.liaoyuan = event.num;
			}
		},
		group: ["liaoyuan2", "liaoyuan3"],
	},
	liaoyuan2: {
		trigger: { source: "damageBegin" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.card && event.card.name === "sha" && player.storage.liaoyuan > 0 && event.parent.name !== "_lianhuan" && event.parent.name !== "_lianhuan2";
		},
		content() {
			trigger.num += player.storage.liaoyuan;
			player.storage.liaoyuan = 0;
		},
	},
	liaoyuan3: {
		trigger: { player: "shaEnd" },
		silent: true,
		content() {
			player.storage.liaoyuan = 0;
		},
	},
	dunxing: {
		direct: true,
		filter(event, player) {
			if (event.player === player) {
				return false;
			}
			return player.countCards("he") > 0;
		},
		trigger: { target: "useCardToBefore" },
		content() {
			"step 0";
			var next = player.chooseToDiscard("he", get.prompt(event.name));
			next.logSkill = event.name;
			next.ai = function (card) {
				if (get.tag(trigger.card, "multitarget") && !get.tag(card, "multineg")) {
					return 0;
				}
				if (get.value(trigger.card, trigger.player, "raw") < 5) {
					return 0;
				}
				if (get.tag(trigger.card, "respondSha") && player.hasSha("all")) {
					return 0;
				}
				if (get.tag(trigger.card, "respondShan") && player.hasShan("all")) {
					return 0;
				}
				if (get.effect(player, trigger.card, trigger.player, player) < 0) {
					return 7 - get.value(card);
				}
				return 0;
			};
			next.prompt2 = "弃置一张牌并进行一次判定，若结果不为红桃则" + get.translation(trigger.card) + "失效";
			"step 1";
			if (result.bool) {
				player.judge(function (card) {
					return get.suit(card) === "heart" ? -1 : 1;
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result.suit !== "heart") {
				trigger.cancel();
			}
		},
	},
	duanxing: {
		trigger: { player: "equipEnd" },
		direct: true,
		filter(event) {
			return lib.inpile.includes(event.card.name);
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("duanxing"), function (card, player, target) {
				return lib.filter.targetEnabled({ name: "sha" }, player, target);
			}).ai = function (target) {
				return get.effect(target, { name: "sha" }, player);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("duanxing");
				player.useCard({ name: "sha" }, result.targets, false);
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	meihuo: {
		trigger: { player: ["loseEnd"] },
		direct: true,
		filter(event, player) {
			if (player.equiping) {
				return false;
			}
			if (player.countCards("e")) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original === "e") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			player.chooseTarget([1, 1], get.prompt("meihuo"), function (card, player, target) {
				if (player === target) {
					return false;
				}
				return target.countCards("he") > 0;
			}).ai = function (target) {
				var att = get.attitude(player, target);
				if (att <= 0) {
					return 1 - att + (target.countCards("e") ? 2 : 0);
				}
				return 0;
			};
			"step 1";
			if (result.bool) {
				event.target = result.targets[0];
				player.logSkill("meihuo", event.target);
				player.choosePlayerCard(event.target, "he", true).ai = function (button) {
					var card = button.link;
					if (get.position(card) === "e") {
						return get.equipValue(card);
					}
					return 5;
				};
			}
			"step 2";
			if (result.bool) {
				if (get.position(result.buttons[0].link) === "e") {
					player.equip(result.buttons[0].link);
				} else {
					player.gain(result.buttons[0].link, event.target);
				}
				event.target.$giveAuto(result.buttons[0].link, player);
			}
		},
	},
	yishan: {
		group: "yishan2",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			var content = player.storage.yishan;
			for (var i = 0; i < content.length; i++) {
				if (get.owner(content[i]) !== player && get.position(content[i]) !== "s") {
					return true;
				}
			}
			return false;
		},
		init(player) {
			player.storage.yishan = [];
			game.addVideo("storage", player, ["yishan", get.cardsInfo(player.storage.yishan), "cards"]);
		},
		mark: true,
		content() {
			for (var i = 0; i < player.storage.yishan.length; i++) {
				if (get.owner(player.storage.yishan[i]) === player || get.position(player.storage.yishan[i]) === "s") {
					player.storage.yishan.splice(i, 1);
					i--;
				}
			}
			var cards = player.storage.yishan.splice(0, 2);
			player.gain(cards, "log");
			player.$gain2(cards);
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
						if (target.storage.yishan.length === 0) {
							return 1.5;
						}
						if (target.storage.yishan[0] === "tao" || target.storage.yishan[1] === "tao") {
							return [0, 2];
						}
						return [1, 1];
					}
				},
			},
		},
		intro: {
			nocount: true,
			onunmark(content, player) {
				player.storage.yishan.length = 0;
			},
			mark(dialog, content, player) {
				dialog.add('<div class="text center">最近失去的牌</div>');
				var cards = [];
				for (var i = 0; i < content.length; i++) {
					if (get.owner(content[i]) !== player && get.position(content[i]) !== "s") {
						cards.push(content[i]);
						if (cards.length >= 4) {
							break;
						}
					}
				}
				if (cards.length) {
					dialog.add(cards);
				} else {
					dialog.add("（无）");
				}
			},
			content(content, player) {
				var str = "最近失去的牌：";
				var cards = [];
				for (var i = 0; i < content.length; i++) {
					if (get.owner(content[i]) !== player && get.position(content[i]) !== "s") {
						cards.push(content[i]);
						if (cards.length >= 4) {
							break;
						}
					}
				}
				if (cards.length) {
					str += get.translation(cards);
				} else {
					str += "无";
				}
				return str;
			},
		},
	},
	yishan2: {
		trigger: { player: "loseEnd" },
		silent: true,
		content() {
			for (var i = 0; i < trigger.cards.length; i++) {
				player.storage.yishan.unshift(trigger.cards[i]);
			}
			game.addVideo("storage", player, ["yishan", get.cardsInfo(player.storage.yishan), "cards"]);
		},
	},
	guanhu: {
		trigger: { source: "damageEnd" },
		direct: true,
		filter(event) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && event.card.name === "sha" && event.player.countCards("he");
		},
		content() {
			var num = 1;
			if (trigger.player.countCards("e") && trigger.player.countCards("h")) {
				num = 2;
			}
			var next = player.discardPlayerCard(trigger.player, [1, num], get.prompt("guanhu", trigger.player));
			next.logSkill = ["guanhu", trigger.player];
			next.filterButton = function (button) {
				if (ui.selected.buttons.length) {
					return get.position(button.link) !== get.position(ui.selected.buttons[0].link);
				}
				return true;
			};
		},
		ai: {
			expose: 0.2,
		},
	},
	poxing: {
		trigger: { source: "damageBegin" },
		filter(trigger, player) {
			return trigger.player.hp > player.hp;
		},
		forced: true,
		content() {
			trigger.num++;
		},
	},
	huanhun: {
		trigger: { global: "dying" },
		priority: 6,
		filter(event, player) {
			if (event.player.hp > 0) {
				return false;
			}
			return player.countCards("he") > 0;
		},
		direct: true,
		content() {
			"step 0";
			var next = player.chooseToDiscard("he", get.prompt2("huanhun", trigger.player));
			next.logSkill = ["huanhun", trigger.player];
			next.ai = function (card) {
				if (card.name === "tao") {
					return 0;
				}
				if (get.attitude(player, trigger.player) > 0) {
					return 8 - get.value(card);
				}
				return 0;
			};
			"step 1";
			if (result.bool) {
				event.card = result.cards[0];
				trigger.player.judge(function (card) {
					return get.color(card) === "red" ? 1 : 0;
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				trigger.player.recover();
			} else if (event.card.isInPile()) {
				trigger.player.gain(event.card, "gain2");
			}
		},
		ai: {
			threaten: 1.6,
			expose: 0.2,
		},
	},
	yinyue: {
		trigger: { global: "recoverAfter" },
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		content() {
			"step 0";
			if (trigger.player !== player && trigger.player.countCards("h") >= player.countCards("h")) {
				game.asyncDraw([trigger.player, player]);
			} else {
				trigger.player.draw();
				event.finish();
			}
			"step 1";
			game.delay();
		},
		ai: {
			expose: 0.2,
		},
	},
	daofa: {
		trigger: { global: "damageAfter" },
		check(event, player) {
			return event.source && get.attitude(player, event.source) < 0;
		},
		filter(event, player) {
			return event.source && event.source !== player && event.source.countCards("he");
		},
		logTarget: "source",
		content() {
			trigger.source.chooseToDiscard("he", true);
		},
		ai: {
			expose: 0.2,
			threaten: 1.5,
		},
	},
	daixing: {
		group: ["daixing2", "daixing3"],
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt2("daixing"), "he", [1, player.countCards("he")]);
			next.logSkill = "daixing";
			next.ai = function (card) {
				if (ui.selected.cards.length >= 2) {
					return 0;
				}
				if (ui.selected.cards.length === 1) {
					if (player.countCards("h") > player.hp) {
						return 3 - get.value(card);
					}
					return 0;
				}
				return 6 - get.value(card);
			};
			"step 1";
			if (result.bool) {
				player.changeHujia(result.cards.length);
				player.storage.daixing = result.cards.length;
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return;
						}
						if (target.storage.daixing > 1) {
							return 0.1;
						}
						if (target.storage.daixing === 1) {
							return 0.5;
						}
					}
					return 1.5;
				},
			},
		},
		intro: {
			content: "mark",
		},
	},
	daixing2: {
		trigger: { player: "phaseBegin" },
		silent: true,
		content() {
			if (player.storage.daixing) {
				player.changeHujia(-player.storage.daixing);
				player.storage.daixing = 0;
			}
		},
	},
	daixing3: {
		trigger: { player: ["damageEnd", "damageZero"] },
		silent: true,
		filter(event, player) {
			return player.storage.daixing > 0 && event.hujia > 0;
		},
		content() {
			player.storage.daixing -= trigger.hujia;
			if (player.storage.daixing < 0) {
				player.storage.daixing = 0;
			}
		},
	},
	swd_wuxie: {
		mod: {
			targetEnabled(card, player, target) {
				if (get.type(card) === "delay" && player !== target) {
					return false;
				}
			},
		},
	},
	lqingcheng: {
		trigger: { player: "phaseEnd" },
		frequent: true,
		content() {
			"step 0";
			if (event.cards === undefined) {
				event.cards = [];
			}
			player.judge(function (card) {
				if (get.color(card) === "red") {
					return 1.5;
				}
				return -1.5;
			}, ui.special);
			"step 1";
			if (result.judge > 0) {
				event.cards.push(result.card);
				if (event.cards.length === 3) {
					player.gain(event.cards);
					if (event.cards.length) {
						player.$draw(event.cards);
					}
					event.finish();
				} else if (lib.config.autoskilllist.includes("lqingcheng")) {
					player.chooseBool("是否再次发动【倾城】？");
				} else {
					event._result = { bool: true };
				}
			} else {
				player.gain(event.cards);
				if (event.cards.length) {
					player.$draw(event.cards);
				}
				event.finish();
			}
			"step 2";
			if (result.bool) {
				event.goto(0);
			} else {
				player.gain(event.cards);
				if (event.cards.length) {
					player.$draw(event.cards);
				}
			}
		},
		ai: {
			threaten: 1.4,
		},
	},
	lingxin: {
		trigger: { player: "phaseEnd" },
		frequent: true,
		content() {
			"step 0";
			event.cards = get.cards(3);
			player.showCards(event.cards);
			"step 1";
			for (var i = 0; i < cards.length; i++) {
				if (get.suit(event.cards[i]) !== "heart") {
					cards[i].discard();
					event.cards.splice(i--, 1);
				}
			}
			if (event.cards.length === 0) {
				event.finish();
			} else {
				game.delay(0, 1000);
				player.$gain2(event.cards);
			}
			"step 2";
			player.gain(event.cards, "log");
		},
		ai: {
			result: {
				target: 2,
			},
		},
	},
	lingwu: {
		trigger: { player: "phaseAfter" },
		frequent: true,
		filter(event, player) {
			return player.countUsed() >= player.hp && event.skill !== "lingwu";
		},
		content() {
			player.insertPhase();
		},
		ai: {
			order: -10,
			result: {
				target: 2,
			},
			threaten: 1.5,
		},
	},
	shengong: {
		trigger: { player: ["chooseToRespondBegin"] },
		filter(event, player) {
			if (event.responded) {
				return false;
			}
			if (!player.countCards("he")) {
				return false;
			}
			if (event.filterCard({ name: "shan" })) {
				if (
					game.hasPlayer(function (current) {
						return current !== player && current.getEquip(2);
					})
				) {
					return true;
				}
			}
			if (event.filterCard({ name: "sha" })) {
				if (
					game.hasPlayer(function (current) {
						return current !== player && current.getEquip(1);
					})
				) {
					return true;
				}
			}
			return false;
		},
		direct: true,
		content() {
			"step 0";
			var list = [];
			var players = game.filterPlayer();
			if (trigger.filterCard({ name: "shan" })) {
				for (var i = 0; i < players.length; i++) {
					if (players[i] !== player && players[i].getEquip(2)) {
						list.push(players[i].getEquip(2));
					}
				}
			}
			if (trigger.filterCard({ name: "sha" })) {
				for (var i = 0; i < players.length; i++) {
					if (players[i] !== player && players[i].getEquip(1)) {
						list.push(players[i].getEquip(1));
					}
				}
			}
			var dialog = ui.create.dialog(get.prompt("shengong"), list);
			for (var i = 0; i < dialog.buttons.length; i++) {
				dialog.buttons[i].querySelector(".info").innerHTML = get.translation(get.owner(dialog.buttons[i].link));
			}
			player.chooseButton(dialog, function (button) {
				var player = get.owner(button.link);
				if (get.subtype(button.link) === "equip2" && !player.hasShan("all")) {
					return 11 - get.attitude(_status.event.player, player);
				}
				if (get.subtype(button.link) === "equip1" && !player.hasSha()) {
					return 11 - get.attitude(_status.event.player, player);
				}
				return 5 - get.attitude(_status.event.player, player);
			});
			"step 1";
			if (result.bool) {
				trigger.untrigger();
				trigger.responded = true;
				trigger.result = { bool: true, card: {} };
				if (get.subtype(result.buttons[0].link) === "equip1") {
					trigger.result.card.name = "sha";
				} else {
					trigger.result.card.name = "shan";
				}
				var target = get.owner(result.buttons[0].link);
				target.discard(result.buttons[0].link);
				target.draw();
				if (player.countCards("he")) {
					player.chooseToDiscard(true, "he");
				}
				player.logSkill("shengong", target);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					var he = target.countCards("he");
					if (!he) {
						return 1.5;
					}
					if (he <= 1) {
						return;
					}
					if (get.tag(card, "respondShan")) {
						if (
							game.hasPlayer(function (current) {
								return current !== target && current.getEquip(2) && get.attitude(target, current) <= 0;
							})
						) {
							return 0.6 / he;
						}
					}
					if (get.tag(card, "respondSha")) {
						if (
							game.hasPlayer(function (current) {
								return current !== target && current.getEquip(2) && get.attitude(target, current) <= 0;
							})
						) {
							return 0.6 / he;
						}
					}
				},
			},
		},
	},
	huajian: {
		trigger: { player: "phaseUseEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.chooseCardTarget({
				position: "he",
				filterTarget(card, player, target) {
					return lib.filter.targetEnabled({ name: "sha" }, player, target);
				},
				filterCard: true,
				ai1(card) {
					return get.unuseful(card) + 9;
				},
				ai2(target) {
					return get.effect(target, { name: "sha" }, player);
				},
				prompt: get.prompt("huajian"),
			});
			"step 1";
			if (result.bool) {
				player.logSkill("huajian");
				player.useCard({ name: "sha" }, result.cards, result.targets, false);
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	polang: {
		trigger: { source: "damageEnd" },
		filter(event, player) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.player.countCards("e");
		},
		direct: true,
		logTarget: "player",
		content() {
			player.discardPlayerCard(trigger.player, "e", get.prompt("polang", trigger.player)).logSkill = "polang";
		},
		ai: {
			expose: 0.3,
		},
	},
	jikong: {
		trigger: { player: ["loseEnd", "phaseBegin"] },
		direct: true,
		usable: 1,
		filter(event, player) {
			if (event.name === "phase") {
				return true;
			}
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
			"step 0";
			player.chooseTarget(get.prompt("jikong"), function (card, player, target) {
				return lib.filter.targetEnabled({ name: "sha", nature: "thunder" }, player, target);
			}).ai = function (target) {
				return get.effect(target, { name: "sha", nature: "thunder" }, player);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("jikong");
				player.useCard({ name: "sha", nature: "thunder" }, result.targets, false);
			} else {
				player.storage.counttrigger.jikong--;
			}
		},
		ai: {
			threaten(player, target) {
				if (target.countCards("h")) {
					return 0.8;
				}
				return 2;
			},
		},
	},
	xielei: {
		trigger: { player: ["useCard", "respondAfter"] },
		direct: true,
		filter(event) {
			return game.countPlayer() > 2 && event.card && event.card.name === "sha";
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt("xielei"),
				filterCard: lib.filter.cardDiscardable,
				position: "he",
				filterTarget(card, player, target) {
					if (player === target) {
						return false;
					}
					if (trigger.name === "respond") {
						return trigger.source !== target;
					} else {
						return !trigger.targets.includes(target);
					}
				},
				ai1(card) {
					return 8 - get.value(card);
				},
				ai2(target) {
					return get.damageEffect(target, player, player, "thunder");
				},
			});
			"step 1";
			if (result.bool && !event.isMine()) {
				game.delayx();
			}
			"step 2";
			if (result.bool) {
				player.logSkill("xielei", result.targets, "thunder");
				player.discard(result.cards);
				result.targets[0].damage("thunder");
			}
		},
		ai: {
			expose: 0.3,
			threaten: 1.6,
		},
	},
	pozhen: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (!event.source) {
				return false;
			}
			return event.source.countCards("h") !== player.countCards("h");
		},
		direct: true,
		content() {
			"step 0";
			var num = player.countCards("h") - trigger.source.countCards("h");
			event.num = num;
			if (num > 0) {
				var next = player.chooseToDiscard(num, get.prompt("pozhen", trigger.source), "弃置" + num + "张手牌，并对" + get.translation(trigger.source) + "造成1点伤害");
				next.logSkill = ["pozhen", trigger.source];
				next.ai = function (card) {
					if (get.damageEffect(trigger.source, player, player) > 0 && num <= 2) {
						return 6 - get.value(card);
					}
					return -1;
				};
			} else if (num < 0) {
				player.chooseBool(get.prompt("pozhen", trigger.source), "弃置" + get.translation(trigger.source) + -num + "张手牌").ai = function () {
					return get.attitude(player, trigger.source) < 0;
				};
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				if (event.num > 0) {
					trigger.source.damage();
				} else {
					player.logSkill("pozhen", trigger.source);
					var cards = trigger.source.getCards("h");
					cards.sort(lib.sort.random);
					trigger.source.discard(cards.slice(0, -event.num));
				}
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1];
						}
						var num = player.countCards("h") - target.countCards("h");
						if (num > 0) {
							return [1, 0, 0, -num / 2];
						}
						if (num < 0) {
							return [1, 0, 0, -0.5];
						}
					}
				},
			},
		},
	},
	tanlin_defence: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.countCards("h") && event.source && event.source.countCards("h");
		},
		direct: true,
		content() {
			"step 0";
			player.chooseToDiscard([1, trigger.source.countCards("h")], "弃置任意张手牌并令伤害来源弃置等量手牌").ai = function (card) {
				if (ui.selected.cards.length >= trigger.source.countCards("h")) {
					return -1;
				}
				if (ui.selected.cards.length === 0) {
					return 8 - get.value(card);
				}
				return 4 - get.value(card);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("tanlin");
				trigger.source.randomDiscard("h", result.cards.length);
			} else {
				event.finish();
			}
			"step 2";
			player.draw();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") && target.countCards("h") && target.hp > 1 && player !== target) {
						return [1, 0.2, 0, -0.2];
					}
				},
			},
		},
	},
	tanlin: {
		enable: "phaseUse",
		usable: 1,
		group: "tanlin4",
		filterTarget(card, player, target) {
			return player !== target && target.countCards("h");
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.chooseToCompare(target).set("preserve", "win");
			"step 1";
			if (result.bool) {
				if (target.hasSkill("tanlin2") === false) {
					target.addSkill("tanlin2");
					player.addSkill("tanlin3");
					player.gain([result.player, result.target]);
					player.$gain2([result.player, result.target]);
				}
			} else {
				player.damage(target);
			}
		},
		ai: {
			result: {
				target(player, target) {
					var cards = player.getCards("h");
					var num = target.countCards("h");
					if (num > cards.length + 3 && player.hp > 1) {
						return -2;
					}
					if (num > cards.length + 1 && player.hp > 1) {
						return -1;
					}
					if (num === cards.length - 1 && player.hp > 1) {
						return -1;
					}
					for (var i = 0; i < cards.length; i++) {
						if (cards[i].number > 9) {
							return num === 1 ? -1 : -0.5;
						}
					}
					return 0;
				},
			},
			order: 9,
		},
	},
	tanlin2: {
		trigger: { global: "phaseAfter" },
		forced: true,
		content() {
			player.removeSkill("tanlin2");
		},
	},
	tanlin3: {
		trigger: { global: "phaseAfter" },
		forced: true,
		popup: false,
		content() {
			player.removeSkill("tanlin3");
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name === "sha") {
					return num + 1;
				}
			},
		},
	},
	tanlin4: {
		mod: {
			targetInRange(card, player, target, now) {
				if (target.hasSkill("tanlin2")) {
					return true;
				}
			},
		},
	},
	yunchou: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player !== target && target.countCards("h");
		},
		filterCard: true,
		content() {
			"step 0";
			var card = target.getCards("h").randomGet();
			if (!card) {
				event.finish();
				return;
			}
			target.discard(card);
			if (get.color(card) === get.color(cards[0])) {
				event.bool = true;
			}
			"step 1";
			if (event.bool) {
				player.draw();
			} else if (player.countCards("he")) {
				target.draw();
			}
		},
		check(card) {
			return 7 - get.value(card);
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (target.hasSkillTag("noh")) {
						return 0;
					}
					return -1;
				},
			},
			threaten: 1.3,
		},
	},
	jqimou: {
		trigger: { player: "damageEnd" },
		frequent: true,
		filter(event, player) {
			return _status.currentPhase !== player;
		},
		content() {
			"step 0";
			player.draw();
			"step 1";
			player.chooseToUse("是否使用一张牌？");
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") && _status.currentPhase !== target) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1.5];
						}
						return [1, 0.5];
					}
				},
			},
		},
	},
	lexue: {
		group: ["lexue1", "lexue2"],
	},
	lexue1: {
		trigger: { player: "phaseBegin" },
		forced: true,
		popup: false,
		content() {
			player.removeSkill(player.storage.lexue);
			switch (Math.floor(Math.random() * 4)) {
				case 0:
					if (lib.skill.zhiheng) {
						player.addSkill("zhiheng");
						player.storage.lexue = "zhiheng";
						player.popup("zhiheng");
					}
					break;
				case 1:
					if (lib.skill.jizhi) {
						player.addSkill("jizhi");
						player.storage.lexue = "jizhi";
						player.popup("jizhi");
					}
					break;
				case 2:
					if (lib.skill.dimeng) {
						player.addSkill("dimeng");
						player.storage.lexue = "dimeng";
						player.popup("dimeng");
					}
					break;
				case 3:
					if (lib.skill.quhu) {
						player.addSkill("quhu");
						player.storage.lexue = "quhu";
						player.popup("quhu");
					}
					break;
			}
		},
	},
	lexue2: {
		trigger: { player: "phaseEnd" },
		forced: true,
		popup: false,
		content() {
			player.removeSkill(player.storage.lexue);
			switch (Math.floor(Math.random() * 4)) {
				case 0:
					if (lib.skill.yiji) {
						player.addSkill("yiji");
						player.storage.lexue = "yiji";
						player.popup("yiji");
					}
					break;
				case 1:
					if (lib.skill.jijiu) {
						player.addSkill("jijiu");
						player.storage.lexue = "jijiu";
						player.popup("jijiu");
					}
					break;
				case 2:
					if (lib.skill.guidao) {
						player.addSkill("guidao");
						player.storage.lexue = "guidao";
						player.popup("guidao");
					}
					break;
				case 3:
					if (lib.skill.fankui) {
						player.addSkill("fankui");
						player.storage.lexue = "fankui";
						player.popup("fankui");
					}
					break;
			}
		},
	},
	swdtianshu2: {
		enable: "phaseUse",
		filter(event, player) {
			return !player.hasSkill("swdtianshu3") && player.storage.swdtianshu && player.storage.swdtianshu.length > 0;
		},
		intro: {
			nocount: true,
		},
		delay: 0,
		content() {
			"step 0";
			var list = player.storage.swdtianshu;
			if (player.additionalSkills.swdtianshu) {
				player.removeSkill(player.additionalSkills.swdtianshu);
			}
			event.skillai = function (list) {
				return get.max(list, get.skillRank, "item");
			};
			if (event.isMine()) {
				var dialog = ui.create.dialog("forcebutton");
				dialog.add("选择获得一项技能");
				_status.event.list = list;
				var clickItem = function () {
					_status.event._result = this.link;
					game.resume();
				};
				for (var i = 0; i < list.length; i++) {
					if (lib.translate[list[i] + "_info"]) {
						var translation = get.translation(list[i]);
						if (translation[0] === "新" && translation.length === 3) {
							translation = translation.slice(1, 3);
						} else {
							translation = translation.slice(0, 2);
						}
						var item = dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + translation + "】</div><div>" + lib.translate[list[i] + "_info"] + "</div></div>");
						item.firstChild.addEventListener("click", clickItem);
						item.firstChild.link = list[i];
					}
				}
				dialog.add(ui.create.div(".placeholder"));
				event.dialog = dialog;
				event.switchToAuto = function () {
					event._result = event.skillai(list);
					game.resume();
				};
				game.pause();
				_status.imchoosing = true;
			} else {
				event._result = event.skillai(list);
			}
			"step 1";
			_status.imchoosing = false;
			if (event.dialog) {
				event.dialog.close();
			}
			var link = result;
			player.addSkill(link);
			player.skills.remove(link);
			player.additionalSkills.swdtianshu = link;
			player.popup(link);
			var target = player.storage.swdtianshu2[player.storage.swdtianshu.indexOf(link)];
			player.markSkillCharacter("swdtianshu2", target, get.translation(link), lib.translate[link + "_info"]);
			player.checkMarks();
			player.addSkill("swdtianshu3");
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return 1;
				},
			},
		},
	},
	swdtianshu3: {
		trigger: { global: ["useCardAfter", "useSkillAfter", "phaseAfter"] },
		silent: true,
		filter(event) {
			return event.skill !== "swdtianshu2";
		},
		content() {
			player.removeSkill("swdtianshu3");
		},
	},
	swdtianshu: {
		unique: true,
		enable: "phaseUse",
		filterCard(card) {
			return get.type(card, "trick") === "trick";
		},
		filter(event, player) {
			return player.countCards("h", { type: ["trick", "delay"] }) > 0;
		},
		filterTarget(card, player, target) {
			var names = [];
			if (target.name && !target.isUnseen(0)) {
				names.add(target.name);
			}
			if (target.name1 && !target.isUnseen(0)) {
				names.add(target.name1);
			}
			if (target.name2 && !target.isUnseen(1)) {
				names.add(target.name2);
			}
			var pss = player.getSkills();
			for (var i = 0; i < names.length; i++) {
				var info = lib.character[names[i]];
				if (info) {
					var skills = info[3];
					for (var j = 0; j < skills.length; j++) {
						if (lib.translate[skills[j] + "_info"] && lib.skill[skills[j]] && !lib.skill[skills[j]].unique && !pss.includes(skills[j])) {
							return true;
						}
					}
				}
				return false;
			}
		},
		group: "swdtianshu_remove",
		createDialog(player, target, onlylist) {
			var names = [];
			var list = [];
			if (target.name && !target.isUnseen(0)) {
				names.add(target.name);
			}
			if (target.name1 && !target.isUnseen(0)) {
				names.add(target.name1);
			}
			if (target.name2 && !target.isUnseen(1)) {
				names.add(target.name2);
			}
			var pss = player.getSkills();
			for (var i = 0; i < names.length; i++) {
				var info = lib.character[names[i]];
				if (info) {
					var skills = info[3];
					for (var j = 0; j < skills.length; j++) {
						if (lib.translate[skills[j] + "_info"] && lib.skill[skills[j]] && !lib.skill[skills[j]].unique && !pss.includes(skills[j])) {
							list.push(skills[j]);
						}
					}
				}
			}
			if (onlylist) {
				return list;
			}
			var dialog = ui.create.dialog("forcebutton");
			dialog.add("选择获得一项技能");
			_status.event.list = list;
			var clickItem = function () {
				_status.event._result = this.link;
				game.resume();
			};
			for (i = 0; i < list.length; i++) {
				if (lib.translate[list[i] + "_info"]) {
					var translation = get.translation(list[i]);
					if (translation[0] === "新" && translation.length === 3) {
						translation = translation.slice(1, 3);
					} else {
						translation = translation.slice(0, 2);
					}
					var item = dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + translation + "】</div><div>" + lib.translate[list[i] + "_info"] + "</div></div>");
					item.firstChild.addEventListener("click", clickItem);
					item.firstChild.link = list[i];
				}
			}
			dialog.add(ui.create.div(".placeholder"));
			return dialog;
		},
		check(card) {
			return 5 - get.value(card);
		},
		content() {
			"step 0";
			event.skillai = function (list) {
				return get.max(list, get.skillRank, "item");
			};
			if (event.isMine()) {
				event.dialog = lib.skill.swdtianshu.createDialog(player, target);
				event.switchToAuto = function () {
					event._result = event.skillai(event.list);
					game.resume();
				};
				_status.imchoosing = true;
				game.pause();
			} else {
				event._result = event.skillai(lib.skill.swdtianshu.createDialog(player, target, true));
			}
			"step 1";
			_status.imchoosing = false;
			if (event.dialog) {
				event.dialog.close();
			}
			var link = result;
			player.addAdditionalSkill("swdtianshu", link);
			player.popup(link);
			player.markSkillCharacter("swdtianshu", target, get.translation(link), lib.translate[link + "_info"]);
			player.storage.swdtianshu = target;
			player.checkMarks();
			game.log(player, "获得了技能", "【" + get.translation(link) + "】");
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (player.countCards("h") > player.hp) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	swdtianshu_remove: {
		trigger: { global: "dieAfter" },
		silent: true,
		filter(event, player) {
			return event.player === player.storage.swdtianshu;
		},
		content() {
			player.unmarkSkill("swdtianshu");
			player.removeAdditionalSkill("swdtianshu");
			delete player.storage.swdtianshu;
		},
	},
	luomei: {
		trigger: { player: ["useCard", "respond"] },
		frequent: true,
		filter(event, player) {
			if (!event.cards) {
				return false;
			}
			if (event.cards.length !== 1) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (get.suit(event.cards[i]) === "club") {
					return true;
				}
			}
			return false;
		},
		content() {
			var num = 0;
			for (var i = 0; i < trigger.cards.length; i++) {
				if (get.suit(trigger.cards[i]) === "club") {
					num++;
				}
			}
			player.draw(num);
		},
	},
	xingdian: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			"step 0";
			event.list = game
				.filterPlayer(function (current) {
					return current.isEnemyOf(player) && current.countCards("he");
				})
				.randomGets(2)
				.sortBySeat();
			"step 1";
			if (event.list.length) {
				var target = event.list.shift();
				player.line(target, "green");
				if (event.list.length) {
					target.randomDiscard("he", false);
				} else {
					target.randomDiscard("he");
				}
				event.redo();
			}
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (
						game.countPlayer(function (current) {
							return current.isEnemyOf(player) && current.countCards("he");
						}) >= 2
					) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	yulin: {
		trigger: { player: "damageBefore" },
		priority: -10,
		filter(event, player) {
			return player.countCards("he", { type: "equip" });
		},
		direct: true,
		content() {
			"step 0";
			var next = player.chooseToDiscard("he", "是否弃置一张装备牌抵消伤害？", function (card, player) {
				return get.type(card) === "equip";
			});
			next.logSkill = "yulin";
			next.ai = function (card) {
				if (player.hp === 1 || trigger.num > 1) {
					return 9 - get.value(card);
				}
				if (player.hp === 2) {
					return 8 - get.value(card);
				}
				return 7 - get.value(card);
			};
			"step 1";
			if (result.bool) {
				game.delay();
				trigger.cancel();
			}
		},
	},
	funiao: {
		enable: "phaseUse",
		usable: 1,
		prepare: "give2",
		filterTarget(card, player, target) {
			if (player === target) {
				return false;
			}
			return true;
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		check(card) {
			if (card.name === "du") {
				return 20;
			}
			return 7 - get.value(card);
		},
		discard: false,
		content() {
			"step 0";
			target.gain(cards, player).delay = false;
			player.draw();
			"step 1";
			if (target.countCards("h")) {
				player.viewHandcards(target);
			}
		},
		ai: {
			result: {
				target(player, target) {
					if (ui.selected.cards.length && ui.selected.cards[0].name === "du") {
						return -1;
					}
					return 1;
				},
			},
			order: 2,
		},
	},
	xuehuang: {
		enable: "phaseUse",
		init(player) {
			player.storage.xuehuang = false;
		},
		intro: {
			content: "limited",
		},
		mark: true,
		unique: true,
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		line: "fire",
		filter(event, player) {
			return !player.storage.xuehuang && player.countCards("h", { color: "red" }) > 0 && player.countCards("h", { color: "black" }) === 0;
		},
		content() {
			"step 0";
			player.storage.xuehuang = true;
			player.awakenSkill(event.name);
			player.showHandcards();
			var cards = player.getCards("h");
			player.discard(cards);
			event.num = cards.length;
			"step 1";
			if (event.num) {
				var targets = player.getEnemies().randomGets(2);
				if (!targets.length) {
					event.finish();
					return;
				}
				player.useCard({ name: "sha", nature: "fire" }, targets);
				event.num--;
				event.redo();
			}
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (player.countCards("h", { color: "red" }) < 2) {
						return 0;
					}
					if (
						player.hasCard(function (card) {
							return get.color(card) === "red" && get.value(card) > 8;
						})
					) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	zhuyu: {
		trigger: { global: "damageBegin" },
		filter(event, player) {
			if (!event.player.isLinked()) {
				return false;
			}
			if (!event.notLink()) {
				return false;
			}
			if (player.countCards("he", { color: "red" })) {
				return true;
			}
			return false;
		},
		direct: true,
		content() {
			"step 0";
			var next = player.chooseToDiscard("朱羽：是否弃置一张红色牌使" + get.translation(trigger.player) + "受到的伤害+1？", "he", function (card) {
				return get.color(card) === "red";
			});
			next.logSkill = ["zhuyu", trigger.player, "fire"];
			var num = game.countPlayer(function (current) {
				if (current.isLinked()) {
					if (trigger.hasNature()) {
						return get.sgn(get.damageEffect(current, player, player, "fire"));
					} else {
						if (current === trigger.player) {
							return get.sgn(get.damageEffect(current, player, player, "fire"));
						} else {
							return 2 * get.sgn(get.damageEffect(current, player, player, "fire"));
						}
					}
				}
			});
			next.ai = function (card) {
				if (trigger.player.hasSkillTag("nofire")) {
					return 0;
				}
				if (num > 0) {
					return 9 - get.value(card);
				}
				return 0;
			};
			"step 1";
			if (result.bool) {
				trigger.num++;
				game.setNature(trigger, "fire");
			}
		},
	},
	ningshuang: {
		trigger: { target: "useCardToBegin" },
		filter(event, player) {
			if (get.color(event.card) !== "black") {
				return false;
			}
			if (!event.player) {
				return false;
			}
			if (event.player === player) {
				return false;
			}
			if (event.player.isLinked() && event.player.isTurnedOver()) {
				return false;
			}
			if (player.countCards("he", { color: "black" })) {
				return true;
			}
			return false;
		},
		direct: true,
		content() {
			"step 0";
			var next = player.chooseToDiscard("凝霜：是否弃置一张黑色牌使" + get.translation(trigger.player) + "横置或翻面？", "he", function (card) {
				return get.color(card) === "black";
			});
			next.logSkill = ["ningshuang", trigger.player];
			next.ai = function (card) {
				if (trigger.player.hasSkillTag("noturn") && trigger.player.isLinked()) {
					return 0;
				}
				if (get.attitude(player, trigger.player) < 0) {
					return 9 - get.value(card);
				}
				return 0;
			};
			"step 1";
			if (result.bool) {
				if (trigger.player.isTurnedOver()) {
					trigger.player.loseHp();
				}
				if (trigger.player.isLinked()) {
					trigger.player.turnOver();
				} else {
					trigger.player.link();
					player.draw();
				}
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.color(card) === "black" && get.attitude(target, player) < 0 && target.countCards("h") > 0) {
						return [1, 0.1, 0, -target.countCards("h") / 4];
					}
				},
			},
		},
	},
	xielv: {
		trigger: { player: "phaseDiscardEnd" },
		filter(event, player) {
			var cards = player.getCards("h");
			if (cards.length < 2) {
				return false;
			}
			var color = get.color(cards[0]);
			for (var i = 1; i < cards.length; i++) {
				if (get.color(cards[i]) !== color) {
					return false;
				}
			}
			if (player.isDamaged()) {
				return true;
			}
			return game.hasPlayer(function (current) {
				return current.countCards("j");
			});
		},
		check(event, player) {
			if (player.isDamaged()) {
				return true;
			}
			return (
				game.countPlayer(function (current) {
					if (current.countCards("j")) {
						return get.sgn(get.attitude(player, current));
					}
				}) > 0
			);
		},
		content() {
			"step 0";
			player.showHandcards();
			"step 1";
			player.recover();
			event.targets = game.filterPlayer(function (current) {
				return current.countCards("j");
			});
			event.targets.sortBySeat();
			"step 2";
			if (event.targets.length) {
				var current = event.targets.shift();
				var js = current.getCards("j");
				if (js.length) {
					current.discard(js);
					player.line(current, "green");
				}
				event.redo();
			}
		},
		ai: {
			expose: 0.1,
		},
	},
	xiaomoyu: {
		trigger: { source: "damageEnd" },
		priority: 1,
		forced: true,
		filter(event, player) {
			return !player.hasSkill("xiaomoyu2");
		},
		content() {
			"step 0";
			player.addTempSkill("xiaomoyu2");
			if (player.hp < player.maxHp) {
				player.recover();
				event.finish();
			} else {
				player.draw();
				event.finish();
			}
			"step 1";
			if (result.control === "draw_card") {
				player.draw();
			} else {
				player.recover();
			}
		},
		ai: {
			effect: {
				player(card, player, target, current) {
					if (get.tag(card, "damage") && !player.hasSkill("xiaomoyu2")) {
						if (player.isDamaged()) {
							return [1, 1.6];
						}
						return [1, 0.8];
					}
				},
			},
		},
	},
	xiaomoyu2: {},
	tianhuo: {
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return target.countCards("j") > 0;
		},
		usable: 1,
		selectTarget: -1,
		filter() {
			return game.hasPlayer(function (current) {
				return current.countCards("j");
			});
		},
		line: "fire",
		content() {
			"step 0";
			event.num = target.countCards("j");
			target.discard(target.getCards("j"));
			"step 1";
			target.damage(event.num, "fire", "nosource");
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					var eff = get.damageEffect(target, player, target, "fire");
					if (eff >= 0) {
						return eff + 1;
					}
					var judges = target.getCards("j");
					if (!judges.length) {
						return 0;
					}
					if (target.hp === 1 || judges.length > 1) {
						return -judges.length;
					}
					var name = judges[0].viewAs || judges[0].name;
					if (name === "shandian" || name === "huoshan" || name === "hongshui") {
						return -judges.length;
					}
					return 0;
				},
			},
		},
	},
	huanyin: {
		trigger: { target: "useCardToBefore" },
		forced: true,
		priority: 5.9,
		filter(event, player) {
			return event.player !== player;
		},
		content() {
			"step 0";
			var effect = get.effect(player, trigger.card, trigger.player, player);
			player.judge(function (card) {
				switch (get.suit(card)) {
					case "spade":
						return -effect;
					case "heart":
						return 1;
					default:
						return 0;
				}
			});
			"step 1";
			switch (result.suit) {
				case "spade": {
					trigger.cancel();
					break;
				}
				case "heart": {
					player.draw();
					break;
				}
			}
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					return 0.7;
				},
			},
			threaten: 0.8,
		},
	},
	xuanzhou: {
		enable: "phaseUse",
		usable: 1,
		discard: false,
		filter(event, player) {
			return player.countCards("he", { type: "trick" }) > 0;
		},
		prepare: "throw",
		position: "he",
		filterCard: { type: "trick" },
		filterTarget(card, player, target) {
			return player !== target;
		},
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			"step 0";
			var list = [];
			for (var i in lib.card) {
				if (lib.card[i].mode && lib.card[i].mode.includes(lib.config.mode) === false) {
					continue;
				}
				if (lib.card[i].type === "delay") {
					list.push([cards[0].suit, cards[0].number, i]);
				}
			}
			var dialog = ui.create.dialog("玄咒", [list, "vcard"]);
			var bing = target.countCards("h") <= 1;
			player.chooseButton(dialog, true, function (button) {
				if (get.effect(target, { name: button.link[2] }, player, player) > 0) {
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
			}).filterButton = function (button) {
				return !target.hasJudge(button.link[2]);
			};
			"step 1";
			target.addJudge(result.links[0][2], cards);
		},
		ai: {
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
			order: 9.5,
		},
	},
	tianlun: {
		unique: true,
		trigger: { global: "judge" },
		direct: true,
		filter(event) {
			if (event.card) {
				return true;
			}
			return game.hasPlayer(function (current) {
				return current.countCards("j");
			});
		},
		content() {
			"step 0";
			var list = [];
			if (trigger.card) {
				list.push(trigger.card);
			}
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				list = list.concat(players[i].getCards("j"));
			}
			var dialog = ui.create.dialog(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("tianlun"), list, "hidden");
			player.chooseButton(dialog, function (button) {
				var card = button.link;
				var trigger = _status.event.parent._trigger;
				var player = _status.event.player;
				var result = trigger.judge(card) - trigger.judge(trigger.player.judging[0]);
				var attitude = get.attitude(player, trigger.player);
				return result * attitude;
			});
			"step 1";
			if (result.bool) {
				event.card = result.buttons[0].link;
				if (get.owner(event.card)) {
					get.owner(event.card).discard(event.card);
				} else {
					trigger.player.$throw(event.card, 1000);
				}
				if (event.card.clone) {
					event.card.clone.classList.add("thrownhighlight");
					game.addVideo("highlightnode", player, get.cardInfo(event.card));
				}
			}
			"step 2";
			if (event.card) {
				player.logSkill("tianlun", trigger.player);
				trigger.player.judging[0].discard();
				trigger.player.judging[0] = event.card;
				trigger.position.appendChild(event.card);
				game.log(trigger.player, "的判定牌改为", event.card);
				event.card.expired = true;
				game.delay(2);
			}
		},
		ai: {
			tag: {
				rejudge: 0.6,
			},
		},
	},
	lanzhi: {
		trigger: { player: "useCard" },
		filter(event, player) {
			if (get.suit(event.card) === "club") {
				return game.hasPlayer(function (current) {
					return current.hp <= player.hp && current.isDamaged();
				});
			}
			return false;
		},
		prompt(event, player) {
			var list = game.filterPlayer(function (current) {
				return current.hp <= player.hp && current.isDamaged();
			});
			return get.prompt("lanzhi", list);
		},
		check(event, player) {
			var list = game.filterPlayer(function (current) {
				return current.hp <= player.hp && current.isDamaged();
			});
			var num = 0;
			for (var i = 0; i < list.length; i++) {
				var eff = get.recoverEffect(list[i], player, player);
				if (eff > 0) {
					num++;
				} else {
					num--;
				}
			}
			return num > 0;
		},
		content() {
			"step 0";
			var list = game.filterPlayer(function (current) {
				return current.hp <= player.hp && current.isDamaged();
			});
			player.line(list, "green");
			list.sort(lib.sort.seat);
			event.list = list;
			"step 1";
			if (event.list.length) {
				event.list.shift().recover();
				event.redo();
			}
		},
		ai: {
			expose: 0.3,
			threaten: 1.5,
		},
	},
	duanyi: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", "sha") > 1;
		},
		filterCard: { name: "sha" },
		selectCard: 2,
		filterTarget(card, player, target) {
			return player !== target;
		},
		check(card) {
			return 10 - get.value(card);
		},
		content() {
			"step 0";
			target.damage();
			"step 1";
			var he = target.getCards("he");
			target.discard(he.randomGets(target.maxHp - target.hp));
		},
		ai: {
			expose: 0.3,
			result: {
				target(player, target) {
					return get.damageEffect(target, player) - (target.maxHp - target.hp) / 2;
				},
			},
			order: 5,
		},
	},
	guxing: {
		group: ["guxing1", "guxing3"],
	},
	guxing1: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var min = Math.max(1, player.maxHp - player.hp);
			return player.countCards("h") <= min && player.countCards("h") > 0 && lib.filter.filterCard({ name: "sha" }, player);
		},
		filterCard: true,
		selectCard: -1,
		discard: false,
		prepare: "throw",
		filterTarget(card, player, target) {
			return lib.filter.targetEnabled({ name: "sha" }, player, target);
		},
		content() {
			"step 0";
			delete player.storage.guxing;
			targets.sort(lib.sort.seat);
			player.useCard({ name: "sha" }, cards, targets, "guxing").animate = false;
			"step 1";
			if (player.storage.guxing) {
				player.draw(player.storage.guxing);
				delete player.storage.guxing;
			}
		},
		multitarget: true,
		multiline: true,
		selectTarget: [1, 3],
		ai: {
			order() {
				if (_status.event.player.countCards("h") === 1) {
					return 10;
				}
				return get.order({ name: "sha" }) + 0.1;
			},
			result: {
				target(player, target) {
					return get.effect(target, { name: "sha" }, player, target);
				},
			},
			threaten(player, target) {
				if (target.hp < target.maxHp - 1) {
					return 1.5;
				}
			},
			pretao: true,
		},
	},
	guxing3: {
		trigger: { source: "damageAfter" },
		forced: true,
		popup: false,
		filter(event) {
			return event.parent.skill === "guxing";
		},
		content() {
			if (!player.storage.guxing) {
				player.storage.guxing = 1;
			} else {
				player.storage.guxing++;
			}
		},
	},
	miles_xueyi: {
		trigger: { player: "damageBefore" },
		forced: true,
		priority: 10,
		content() {
			trigger.cancel();
			player.loseHp();
		},
	},
	jifeng: {
		mod: {
			selectTarget(card, player, range) {
				if (range[0] !== 1 || range[1] !== 1) {
					return;
				}
				var range2 = get.select(get.info(card).selectTarget);
				if (range2[0] !== 1 && range2[1] !== 1) {
					return;
				}
				if (card.name === "sha" || get.type(card) === "trick") {
					range[1] = Infinity;
				}
			},
		},
		trigger: { player: "useCardToBefore" },
		priority: 6,
		forced: true,
		popup: false,
		filter(event, player) {
			if (event.targets.length <= 1) {
				return false;
			}
			if (event.card.name === "sha") {
				return true;
			} else if (get.type(event.card) === "trick") {
				var range = get.select(get.info(event.card).selectTarget);
				if (range[0] === 1 && range[1] === 1) {
					return true;
				}
			}
			return false;
		},
		content() {
			if (Math.random() > (1.3 + trigger.targets.length / 5) / trigger.targets.length) {
				trigger.target.popup("失误");
				trigger.cancel();
			}
		},
	},
	swd_xiuluo: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.countCards("j") > 0;
		},
		direct: true,
		content() {
			var next = player.discardPlayerCard(player, 2, "hj", "是否一张手牌来弃置一张花色相同的判定牌？");
			next.filterButton = function (button) {
				var card = button.link;
				if (!lib.filter.cardDiscardable(card, player)) {
					return false;
				}
				if (ui.selected.buttons.length === 0) {
					return true;
				}
				if (get.position(ui.selected.buttons[0].link) === "h") {
					if (get.position(card) !== "j") {
						return false;
					}
				}
				if (get.position(ui.selected.buttons[0].link) === "j") {
					if (get.position(card) !== "h") {
						return false;
					}
				}
				return get.suit(card) === get.suit(ui.selected.buttons[0].link);
			};
			next.ai = function (button) {
				var card = button.link;
				if (get.position(card) === "h") {
					return 11 - get.value(card);
				}
				if (card.name === "lebu") {
					return 5;
				}
				if (card.name === "bingliang") {
					return 4;
				}
				if (card.name === "guiyoujie") {
					return 3;
				}
				return 2;
			};
			next.logSkill = "swd_xiuluo";
		},
	},
	mohua2: {
		unique: true,
		trigger: { player: "dying" },
		priority: 10,
		forced: true,
		derivation: ["moyan", "miedao", "jifeng", "swd_xiuluo"],
		content() {
			"step 0";
			player.removeSkill("miles_xueyi");
			player.removeSkill("aojian");
			player.removeSkill("mohua2");
			player.addSkill("moyan");
			player.addSkill("miedao");
			player.addSkill("jifeng");
			player.addSkill("swd_xiuluo");

			lib.character.swd_satan = {
				sex: "",
				group: "qun",
				hp: 4,
				skills: ["moyan", "miedao", "jifeng", "swd_xiuluo"],
				trashBin: ["temp"],
			};
			if (player.name === "swd_miles") {
				player.name = "swd_satan";
			}
			if (player.name1 === "swd_miles") {
				player.name1 = "swd_satan";
			}
			if (player.name2 === "swd_miles") {
				player.name2 = "swd_satan";
				player.node.avatar2.setBackground("swd_satan", "character");
			} else {
				player.node.avatar.setBackground("swd_satan", "character");
			}
			"step 1";
			player.recover(2);
			"step 2";
			player.draw(2);
		},
	},
	duijue: {
		enable: "phaseUse",
		mark: true,
		unique: true,
		limited: true,
		forceunique: true,
		skillAnimation: true,
		filter(event, player) {
			if (event.skill) {
				return false;
			}
			return !player.storage.duijue;
		},
		filterTarget(card, player, target) {
			if (target.hp <= 1) {
				return false;
			}
			return player !== target;
		},
		content() {
			player.storage.duijue = true;
			player.awakenSkill(event.name);
			var evt = _status.event;
			for (var i = 0; i < 10; i++) {
				if (evt && evt.getParent) {
					evt = evt.getParent();
				}
				if (evt.name === "phaseUse") {
					evt.skipped = true;
					break;
				}
			}
			player.storage.duijue3 = target;
			player.addSkill("duijue3");
		},
		duijueLoop() {
			"step 0";
			targets[0].phase("duijue");
			"step 1";
			ui.duijueLoop.round--;
			ui.duijueLoop.innerHTML = get.cnNumber(ui.duijueLoop.round) + "回合";
			if (targets[0].isDead() || targets[1].isDead() || ui.duijueLoop.round === 0) {
				event.goto(3);
			} else {
				targets[1].phase("duijue");
			}
			"step 2";
			ui.duijueLoop.round--;
			ui.duijueLoop.innerHTML = get.cnNumber(ui.duijueLoop.round) + "回合";
			if (targets[0].isDead() || targets[1].isDead() || ui.duijueLoop.round === 0) {
				event.goto(3);
			} else {
				event.goto(0);
			}
			"step 3";
			for (var i = 0; i < event.backup.length; i++) {
				event.backup[i].in("duijue");
			}
			if (ui.duijueLoop) {
				ui.duijueLoop.remove();
				delete ui.duijueLoop;
			}
		},
		init(player) {
			player.storage.duijue = false;
		},
		intro: {
			content: "limited",
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.hp === 1 && player.hp >= 3) {
						return -1;
					}
					if (target.hp < player.hp && target.countCards("h") <= player.countCards("h")) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	duijue3: {
		trigger: { player: "phaseAfter" },
		forced: true,
		popup: false,
		priority: -50,
		content() {
			var target = player.storage.duijue3;
			delete player.storage.duijue3;
			player.removeSkill("duijue3");
			if (!target.isAlive()) {
				event.finish();
				return;
			}
			var next = player.insertEvent("duijueLoop", lib.skill.duijue.duijueLoop, {
				targets: [target, player],
				num: 0,
				backup: [],
				source: player,
			});
			next.forceDie = true;
			for (var i = 0; i < game.players.length; i++) {
				if (game.players[i] !== player && game.players[i] !== target) {
					game.players[i].out("duijue");
					next.backup.push(game.players[i]);
				}
			}
			if (!ui.duijueLoop) {
				ui.duijueLoop = ui.create.system("六回合", null, true);
				lib.setPopped(
					ui.duijueLoop,
					function () {
						var uiintro = ui.create.dialog("hidden");
						uiintro.add("对决");
						uiintro.addText(get.cnNumber(ui.duijueLoop.round) + "回合后结束");
						uiintro.add(ui.create.div(".placeholder.slim"));
						return uiintro;
					},
					180
				);
				ui.duijueLoop.round = 6;
			}
		},
	},
	duijue2: {
		mod: {
			cardEnabled() {
				return false;
			},
			cardSavable() {
				return false;
			},
			targetEnabled() {
				return false;
			},
		},
		init(player) {
			player.classList.add("transparent");
		},
		onremove(player) {
			player.classList.remove("transparent");
		},
		intro: {
			content: "不计入距离的计算且不能使用牌且不是牌的合法目标",
		},
		group: "undist",
		trigger: { global: "dieAfter" },
		forced: true,
		popup: false,
		content() {
			player.removeSkill("duijue2");
		},
	},
	yueren: {
		trigger: { player: "shaBegin" },
		filter(event, player) {
			return !player.hasSkill("yueren2");
		},
		check(event, player) {
			return get.attitude(player, event.target) <= 0;
		},
		logTarget: "target",
		content() {
			"step 0";
			player.judge(function () {
				return 0;
			});
			player.addTempSkill("yueren2");
			"step 1";
			if (get.color(result.card) === "black") {
				if (trigger.target.countCards("he")) {
					player.discardPlayerCard(true, trigger.target, "he");
				}
			} else if (trigger.cards && trigger.cards.length) {
				player.gain(trigger.cards);
				player.$gain2(trigger.cards);
				game.log(player, "收回了", trigger.cards);
			}
		},
	},
	yueren2: {},
	busi: {
		trigger: { player: "dying" },
		priority: 7,
		unique: true,
		forced: true,
		filter(event, player) {
			return player.hp <= 0;
		},
		content() {
			"step 0";
			player.judge(function (card) {
				return get.suit(card) === "spade" ? -1 : 1;
			});
			"step 1";
			if (result.bool) {
				player.recover(1 - player.hp);
				player.turnOver(true);
			}
		},
		ai: {
			threaten: 0.8,
		},
	},
	xuying: {
		unique: true,
		trigger: { player: "damageBefore" },
		forced: true,
		content() {
			trigger.cancel();
			if (player.countCards("h")) {
				player.loseHp();
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") && target.countCards("h") === 0) {
						return 0;
					}
				},
			},
		},
	},
	yinguo: {
		unique: true,
		trigger: { global: "damageBefore" },
		priority: 6,
		direct: true,
		filter(event, player) {
			if (event.player === player || event.source === player) {
				return false;
			}
			if (!event.source) {
				return false;
			}
			if (player.countCards("he") === 0) {
				return false;
			}
			if (player.hasSkill("yinguo2")) {
				return false;
			}
			return true;
		},
		content() {
			"step 0";
			var go = get.attitude(player, trigger.player) > 0 && get.attitude(player, trigger.source) < 0 && get.damageEffect(trigger.player, trigger.source, player) < get.damageEffect(trigger.source, trigger.player, player);
			var next = player.chooseToDiscard("是否将伤害来源（" + get.translation(trigger.source) + "）和目标（" + get.translation(trigger.player) + "）对调？", "he");
			next.ai = function (card) {
				if (go) {
					return 10 - get.value(card);
				}
				return 0;
			};
			next.logSkill = "yinguo";
			"step 1";
			if (result.bool) {
				var target = trigger.player;
				trigger.player = trigger.source;
				trigger.source = target;
				trigger.trigger("damageBefore");
				player.addTempSkill("yinguo2", ["damageAfter", "damageCancelled"]);
			}
		},
		ai: {
			threaten: 10,
			expose: 0.5,
		},
		global: "yinguo3",
	},
	yinguo2: {},
	yinguo3: {
		ai: {
			effect: {
				target(card, player, target) {
					if (!get.tag(card, "damage")) {
						return;
					}
					if (target.hasSkill("yinguo")) {
						return;
					}
					var source = game.findPlayer(function (current) {
						return current.hasSkill("yinguo");
					});
					if (source && source.countCards("he")) {
						if (get.attitude(source, player) < 0 && get.attitude(source, target) > 0) {
							return [0, 0, 0, -1];
						}
					}
				},
			},
		},
	},
	guiyan: {
		unique: true,
		enable: "phaseUse",
		usable: 1,
		intro: {
			content: "濒死时回复1点体力并失去鬼眼",
		},
		mark: true,
		filterTarget(card, player, target) {
			return player !== target && target.countCards("h");
		},
		content() {
			"step 0";
			player.chooseCardButton(target, target.getCards("h")).set("ai", function (button) {
				return get.value(button.link);
			}).filterButton = function (button) {
				return get.suit(button.link) === "club";
			};
			"step 1";
			if (result.bool) {
				player.gain(result.links[0], target);
				target.$giveAuto(result.links[0], player);
			}
		},
		ai: {
			order: 11,
			result: {
				target: -1,
				player: 1,
			},
			threaten: 1.3,
		},
		group: ["guiyan2"],
	},
	guiyan2: {
		trigger: { player: "dying" },
		priority: 6,
		forced: true,
		content() {
			player.recover();
			player.removeSkill("guiyan");
			player.removeSkill("guiyan2");
		},
	},
	xianyin: {
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countCards("j") && current !== player;
			});
		},
		content() {
			"step 0";
			event.targets = game.filterPlayer(function (current) {
				return current.countCards("j") && current !== player;
			});
			event.targets.sort(lib.sort.seat);
			"step 1";
			if (event.targets.length) {
				event.target = event.targets.shift();
				event.target.discard(event.target.getCards("j"));
				player.line(event.target, "green");
			} else {
				event.finish();
			}
			"step 2";
			if (event.target.countCards("h")) {
				event.target.chooseCard("选择一张手牌交给" + get.translation(player), true).ai = function (card) {
					return -get.value(card);
				};
			} else {
				event.goto(1);
			}
			"step 3";
			if (result.bool) {
				player.gain(result.cards[0], target);
				target.$give(1, player);
			}
			event.goto(1);
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					var num = 0,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] !== player && players[i].countCards("j")) {
							if (get.attitude(player, players[i]) >= 0 && get.attitude(players[i], player) >= 0) {
								num++;
							} else {
								num--;
							}
						}
					}
					return num;
				},
			},
		},
	},
	mailun: {
		unique: true,
		trigger: { player: "phaseBegin" },
		direct: true,
		intro: {
			content(storage) {
				if (!storage) {
					return "无";
				}
				return lib.skill.mailun.effects[storage - 1];
			},
		},
		effects: ["减少1点体力并增加1点体力上限", "增加1点体力并减少1点体力上限", "令你即将造成和即将受到的首次伤害-1", "令你即将造成和即将受到的首次伤害+1", "少摸一张牌并令手牌上限+1", "多摸一张牌并令手牌上限-1", "进攻距离+1，防御距离-1", "进攻距离-1，防御距离+1"],
		content() {
			"step 0";
			player.removeSkill("mailun31");
			player.removeSkill("mailun32");
			player.removeSkill("mailun41");
			player.removeSkill("mailun42");
			player.removeSkill("mailun5");
			player.removeSkill("mailun6");
			player.removeSkill("mailun7");
			player.removeSkill("mailun8");
			if (event.isMine()) {
				ui.auto.hide();
				event.dialog = ui.create.dialog("脉轮：选择一个效果", "forcebutton");
				var effects = lib.skill.mailun.effects;
				var clickItem = function () {
					event.choice = this.link;
					game.resume();
				};
				for (var i = 0; i < 8; i++) {
					if (i === 0 && player.maxHp === 6) {
						continue;
					}
					var item = event.dialog.add('<div class="popup pointerdiv" style="width:70%;display:inline-block"><div class="skill">【' + get.cnNumber(i + 1, true) + "】</div><div>" + effects[i] + "</div></div>");
					item.addEventListener("click", clickItem);
					item.link = i + 1;
				}
				event.control = ui.create.control("取消", function () {
					event.choice = 0;
					game.resume();
				});
				event.dialog.add(ui.create.div(".placeholder"));
				event.dialog.add(ui.create.div(".placeholder"));
				event.dialog.add(ui.create.div(".placeholder"));
				game.pause();
			} else {
				var ctrl;
				if (player.hp <= 1) {
					if (player.maxHp > 3) {
						ctrl = 2;
					} else {
						ctrl = 3;
					}
				} else if (player.hp === 2) {
					if (player.maxHp > 4) {
						ctrl = 2;
					} else if (player.countCards("h") === 0) {
						ctrl = 6;
					} else {
						ctrl = 3;
					}
				} else if (player.countCards("h") < player.hp) {
					ctrl = 6;
				} else if (player.countCards("h") > player.hp + 1) {
					ctrl = 5;
				}
				event.choice = ctrl;
			}
			"step 1";
			ui.auto.show();
			player.storage.mailun = event.choice;
			game.addVideo("storage", player, ["mailun", player.storage.mailun]);
			if (event.choice) {
				player.logSkill("mailun");
				player.markSkill("mailun");
				switch (event.choice) {
					case 1: {
						player.loseHp();
						player.gainMaxHp();
						break;
					}
					case 2: {
						player.recover();
						player.loseMaxHp();
						break;
					}
					case 3: {
						player.addSkill("mailun31");
						player.addSkill("mailun32");
						break;
					}
					case 4: {
						player.addSkill("mailun41");
						player.addSkill("mailun42");
						break;
					}
					case 5: {
						player.addSkill("mailun5");
						break;
					}
					case 6: {
						player.addSkill("mailun6");
						break;
					}
					case 7: {
						player.addSkill("mailun7");
						break;
					}
					case 8: {
						player.addSkill("mailun8");
						break;
					}
				}
			} else {
				player.unmarkSkill("mailun");
			}
			if (event.dialog) {
				event.dialog.close();
			}
			if (event.control) {
				event.control.close();
			}
		},
	},
	mailun31: {
		trigger: { source: "damageBegin" },
		forced: true,
		content() {
			trigger.num--;
			player.removeSkill("mailun31");
		},
	},
	mailun32: {
		trigger: { player: "damageBegin" },
		forced: true,
		content() {
			trigger.num--;
			player.removeSkill("mailun32");
		},
	},
	mailun41: {
		trigger: { source: "damageBegin" },
		forced: true,
		content() {
			trigger.num++;
			player.removeSkill("mailun41");
		},
	},
	mailun42: {
		trigger: { player: "damageBegin" },
		forced: true,
		content() {
			trigger.num++;
			player.removeSkill("mailun42");
		},
	},
	mailun5: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		popup: false,
		content() {
			trigger.num--;
		},
		mod: {
			maxHandcard(player, num) {
				return num + 1;
			},
		},
	},
	mailun6: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		popup: false,
		content() {
			trigger.num++;
		},
		mod: {
			maxHandcard(player, num) {
				return num - 1;
			},
		},
	},
	mailun7: {
		mod: {
			globalFrom(from, to, distance) {
				return distance - 1;
			},
			globalTo(from, to, distance) {
				return distance - 1;
			},
		},
	},
	mailun8: {
		mod: {
			globalFrom(from, to, distance) {
				return distance + 1;
			},
			globalTo(from, to, distance) {
				return distance + 1;
			},
		},
	},
	fengming: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he", { type: "equip" }) > 0;
		},
		filterCard: { type: "equip" },
		position: "he",
		filterTarget: true,
		content() {
			"step 0";
			target.recover();
			"step 1";
			target.draw();
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (target.hp < target.maxHp) {
						return get.recoverEffect(target);
					}
				},
			},
		},
	},
	wanjun: {
		enable: "chooseToUse",
		filter(event, player) {
			return player.countCards("he", { type: "equip" }) > 0;
		},
		filterCard(card) {
			return get.type(card) === "equip";
		},
		position: "he",
		viewAs: { name: "nanman" },
		prompt: "将一张装备牌当南蛮入侵使用",
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
	huanling: {
		trigger: { player: "phaseEnd" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("huanling"), function (card, player, target) {
				return player !== target;
			}).ai = function (target) {
				if (target.hasSkillTag("noturn")) {
					return 0;
				}
				var att = get.attitude(player, target);
				if (target.isTurnedOver()) {
					if (att > 0) {
						return att + 5;
					}
					return -1;
				}
				if (player.isTurnedOver()) {
					return 5 - att;
				}
				if (att <= -3) {
					return -att;
				}
				return 0;
			};
			"step 1";
			if (result.bool) {
				player.logSkill("huanling", result.targets);
				player.turnOver();
				result.targets[0].turnOver();
			}
		},
		group: "huanling2",
		ai: {
			effect: {
				target(card, player, target, current) {
					if (target.isTurnedOver()) {
						if (get.tag(card, "damage")) {
							return "zeroplayertarget";
						}
					}
				},
			},
			expose: 0.2,
		},
	},
	huanling2: {
		trigger: { player: "damageBefore" },
		filter(event, player) {
			return player.isTurnedOver();
		},
		forced: true,
		content() {
			trigger.cancel();
		},
	},
	ljifeng: {
		mod: {
			selectTarget(card, player, range) {
				if (card.name === "sha" && range[1] !== -1) {
					range[1] += player.maxHp - player.hp;
				}
			},
			attackFrom(from, to, distance) {
				return distance + from.hp - from.maxHp;
			},
		},
	},
	lxianglong: {
		trigger: { target: "shaMiss" },
		priority: 5,
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(function (card, player, target) {
				return player.canUse("sha", target);
			}, get.prompt("lxianglong")).ai = function (target) {
				return get.effect(target, { name: "sha" }, player, player);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("lxianglong", result.targets);
				player.useCard({ name: "sha" }, trigger.cards, result.targets).animate = false;
				game.delay();
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name === "sha" && target.countCards("h")) {
						return 0.7;
					}
				},
			},
		},
	},
	zhenjiu: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { color: "red" },
		filterTarget(card, player, target) {
			return !target.hasSkill("zhenjiu2");
		},
		check(card) {
			return 8 - get.value(card);
		},
		discard: false,
		prepare: "give",
		content() {
			target.storage.zhenjiu2 = cards[0];
			game.addVideo("storage", target, ["zhenjiu2", get.cardInfo(target.storage.zhenjiu2), "card"]);
			target.addSkill("zhenjiu2");
		},
		ai: {
			result: {
				target(player, target) {
					if (target.hp < target.maxHp) {
						return target === player ? 1 : 1.5;
					}
					if (player.countCards("h") > player.hp) {
						return 0.5;
					}
					return 0;
				},
			},
			order: 9,
			threaten: 1.7,
		},
	},
	zhenjiu2: {
		trigger: { player: "phaseBegin" },
		forced: true,
		mark: "card",
		content() {
			player.recover();
			player.gain(player.storage.zhenjiu2, "gain2", "log");
			player.removeSkill("zhenjiu2");
			delete player.storage.zhenjiu2;
		},
		intro: {
			content: "card",
		},
	},
	shoulie: {
		trigger: { player: "shaBegin" },
		direct: true,
		content() {
			"step 0";
			var dis =
				trigger.target.countCards("h", "shan") ||
				trigger.target.hasSkillTag(
					"freeShan",
					false,
					{
						player: player,
						card: trigger.card,
						type: "use",
					},
					true
				) ||
				trigger.target.countCards("h") > 2;
			var next = player.chooseToDiscard(get.prompt("shoulie", trigger.target));
			next.ai = function (card) {
				if (dis) {
					return 7 - get.value(card);
				}
				return 0;
			};
			next.logSkill = "shoulie";
			"step 1";
			if (result.bool) {
				trigger.directHit = true;
			}
		},
	},
	hudun: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event, player) {
			return !player.hujia && event.player !== player;
		},
		content() {
			player.changeHujia();
			player.update();
		},
	},
	toudan: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he", { suit: "spade" });
		},
		filterTarget(card, player, target) {
			return player !== target;
		},
		filterCard: { suit: "spade" },
		check(card) {
			return 10 - get.value(card);
		},
		position: "he",
		line: "fire",
		content() {
			"step 0";
			target.damage("fire");
			event.targets = game.filterPlayer(function (current) {
				return get.distance(target, current) <= 1;
			});
			event.targets.sortBySeat(event.target);
			event.targets.unshift(player);
			"step 1";
			if (event.targets.length) {
				var current = event.targets.shift();
				if (current.countCards("he")) {
					current.chooseToDiscard("he", true);
				}
				event.redo();
			}
		},
		ai: {
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target, "fire");
				},
			},
			order: 10,
			threaten: 1.5,
		},
	},
	shending: {
		equipSkill: true,
		enable: "phaseUse",
		filter(event, player) {
			return !player.getEquip(5);
		},
		locked: true,
		usable: 1,
		content() {
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
			order: 11,
			result: {
				player: 1,
			},
			effect: {
				target_use(card, player, target) {
					if (player !== target) {
						return;
					}
					if (get.subtype(card) === "equip5") {
						if (get.equipValue(card) <= 7) {
							return 0;
						}
					}
				},
			},
			threaten: 1.2,
		},
	},
	poxiao: {
		mod: {
			attackFrom(from, to, distance) {
				if (!from.getEquip(1)) {
					return distance - 1;
				}
			},
			selectTarget(card, player, range) {
				if (!player.getEquip(1) && card.name === "sha") {
					range[1]++;
				}
			},
		},
		enable: "chooseToUse",
		filterCard: { type: "equip" },
		filter(event, player) {
			return player.countCards("he", { type: "equip" });
		},
		position: "he",
		viewAs: { name: "sha" },
		prompt: "将一张装备牌当杀使用或打出",
		check(card) {
			if (get.subtype(card) === "equip1") {
				return 10 - get.value(card);
			}
			return 7 - get.equipValue(card);
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.1;
			},
			effect: {
				target_use(card, player) {
					if (get.subtype(card) === "equip1") {
						var num = 0,
							players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (get.attitude(player, players[i]) < 0) {
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
	},
};

export default skill;
