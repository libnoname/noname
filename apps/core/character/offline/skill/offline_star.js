import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	xinfu_yanyu: {
		trigger: {
			global: "phaseUseBegin",
		},
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt("xinfu_yanyu"), get.translation("xinfu_yanyu_info"), "he").set("logSkill", "xinfu_yanyu");
			if (player == trigger.player) {
				next.set(
					"goon",
					(function () {
						var map = {
							basic: 0,
							trick: 0.1,
						};
						var hs = trigger.player.getCards("h");
						var sha = false;
						var jiu = false;
						for (var i = 0; i < hs.length; i++) {
							if (trigger.player.hasValueTarget(hs[i])) {
								if (hs[i].name == "sha" && !sha) {
									sha = true;
									map.basic += 2;
								}
								if (hs[i].name == "tao") {
									map.basic += 6;
								}
								if (hs[i].name == "jiu") {
									jiu = true;
									map.basic += 2.5;
								}
								if (get.type(hs[i]) == "trick") {
									map.trick += get.value(hs[i], player, "raw");
								}
							}
						}
						return map;
					})()
				);
				next.set("ai", function (card) {
					var map = _status.event.goon;
					var type = get.type(card, "trick");
					if (!map[type]) {
						return -1;
					}
					return map[type] - get.value(card);
				});
			} else {
				next.set("ai", function (cardx) {
					var map = {
						basic: 0,
						trick: 0,
					};
					var hs = trigger.player.getCards("h");
					var sha = false;
					var jiu = false;
					for (var i = 0; i < hs.length; i++) {
						if (hs[i] != cardx && trigger.player.hasValueTarget(hs[i])) {
							if (hs[i].name == "sha" && !sha) {
								sha = true;
								map.basic += 2;
							}
							if (hs[i].name == "tao") {
								map.basic += 6;
							}
							if (hs[i].name == "jiu") {
								jiu = true;
								map.basic += 3;
							}
							if (get.type(hs[i]) == "trick") {
								map.trick += player.getUseValue(hs[i]);
							}
						}
					}
					var type = get.type(cardx, "trick");
					if (!map[type]) {
						return -get.value(cardx);
					}
					return map[type] - get.value(cardx);
				});
			}
			"step 1";
			if (result.bool) {
				player.storage.xinfu_yanyu = get.type(result.cards[0], "trick");
				player.addTempSkill("xinfu_yanyu2", "phaseUseAfter");
			}
		},
	},
	xinfu_yanyu2: {
		init(player, skill) {
			player.storage[skill] = 0;
		},
		onremove(player, skill) {
			delete player.storage.xinfu_yanyu;
			delete player.storage.xinfu_yanyu2;
		},
		trigger: {
			global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
		},
		direct: true,
		sourceSkill: "xinfu_yanyu",
		filter(event, player) {
			if (player.storage.xinfu_yanyu2 >= 3) {
				return false;
			}
			var type = player.storage.xinfu_yanyu,
				cards = event.getd();
			for (var i = 0; i < cards.length; i++) {
				if (get.type(cards[i], "trick") == type && get.position(cards[i], true) == "d") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			event.logged = false;
			event.cards = [];
			var type = player.storage.xinfu_yanyu;
			var cards = trigger.getd();
			for (var i = 0; i < cards.length; i++) {
				if (get.type(cards[i], "trick") == type && get.position(cards[i], true) == "d") {
					event.cards.push(cards[i]);
				}
			}
			"step 1";
			if (player.storage.xinfu_yanyu2 >= 3) {
				event.finish();
			} else {
				player.chooseCardButton(event.cards, "【燕语】：是否将其中的一张牌交给一名角色？").ai = function (card) {
					if (card.name == "du") {
						return 10;
					}
					return get.value(card);
				};
			}
			"step 2";
			if (result.bool) {
				player.storage.xinfu_yanyu2++;
				if (!event.logged) {
					player.logSkill("xinfu_yanyu");
					player.addExpose(0.25);
					event.logged = true;
				}
				event.togain = result.links[0];
				event.cards.remove(event.togain);
				player
					.chooseTarget(true, "请选择要获得" + get.translation(event.togain) + "的角色")
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						var card = _status.event.card;
						var val = get.value(card);
						if (player.storage.xinfu_yanyu2 < 3 && target == _status.currentPhase && target.hasValueTarget(card, null, true)) {
							att = att * 5;
						} else if (target == player && !player.hasJudge("lebu") && get.type(card) == "trick") {
							att = att * 3;
						}
						if (target.hasSkillTag("nogain")) {
							att /= 10;
						}
						return att * val;
					})
					.set("card", event.togain);
			} else {
				event.finish();
			}
			"step 3";
			var target = result.targets[0];
			player.line(target, "green");
			target.gain(event.togain, "gain2");
			if (event.cards.length) {
				event.goto(1);
			}
		},
	},
	xinfu_xiaode: {
		subSkill: {
			remove: {
				charlotte: true,
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				content() {
					player.removeAdditionalSkill("xinfu_xiaode");
					player.removeSkill("xinfu_xiaode_remove");
				},
			},
		},
		trigger: { global: "dieAfter" },
		direct: true,
		filter(skill, event) {
			return !event.hasSkill("xinfu_xiaode_remove");
		},
		content() {
			"step 0";
			var list = [];
			var listm = [];
			var listv = [];
			if (trigger.player.name1 != undefined) {
				listm = lib.character[trigger.player.name1][3];
			} else {
				listm = lib.character[trigger.player.name][3];
			}
			if (trigger.player.name2 != undefined) {
				listv = lib.character[trigger.player.name2][3];
			}
			listm = listm.concat(listv);
			var func = function (skill) {
				var info = get.info(skill);
				if (info.charlotte || info.zhuSkill || (info.unique && !info.limited) || info.juexingji || info.dutySkill || info.hiddenSkill) {
					return false;
				}
				return true;
			};
			for (var i = 0; i < listm.length; i++) {
				if (func(listm[i])) {
					list.add(listm[i]);
				}
			}
			if (list.length) {
				player
					.chooseControl(list, "cancel2")
					.set("prompt", get.prompt("xinfu_xiaode"))
					.set("prompt2", get.translation("xinfu_xiaode_info"))
					.set("ai", function () {
						return list.randomGet();
					});
			} else {
				event.finish();
			}
			"step 1";
			if (result.control && result.control != "cancel2") {
				player.logSkill("xinfu_xiaode");
				player.popup(result.control, "thunder");
				game.log(player, "获得了技能", "#g【" + get.translation(result.control) + "】");
				player.addAdditionalSkill("xinfu_xiaode", [result.control]);
				player.addSkill("xinfu_xiaode_remove");
			}
		},
	},
	chixin: {
		group: ["chixin1", "chixin2"],
		mod: {
			cardUsableTarget(card, player, target) {
				if (card.name == "sha" && !target.hasSkill("chixin3") && player.inRange(target)) {
					return true;
				}
			},
		},
		trigger: { player: "useCardToPlayered" },
		silent: true,
		firstDo: true,
		locked: false,
		content() {
			trigger.target.addTempSkill("chixin3");
		},
	},
	chixin1: {
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard: { suit: "diamond" },
		position: "hes",
		viewAs: { name: "sha" },
		prompt: "将一张♦牌当杀使用或打出",
		sourceSkill: "chixin",
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			respondSha: true,
		},
	},
	chixin2: {
		enable: ["chooseToUse", "chooseToRespond"],
		filterCard: { suit: "diamond" },
		viewAs: { name: "shan" },
		position: "hes",
		prompt: "将一张♦牌当闪使用或打出",
		sourceSkill: "chixin",
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			respondShan: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondShan") && current < 0) {
						return 0.8;
					}
				},
			},
		},
	},
	chixin3: { charlotte: true },
	suiren: {
		trigger: { player: "phaseZhunbeiBegin" },
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return !player.storage.suiren;
		},
		direct: true,
		limited: true,
		content() {
			"step 0";
			var check = player.hp == 1 || (player.hp == 2 && player.countCards("h") <= 1);
			player
				.chooseTarget(get.prompt2("suiren"))
				.set("ai", function (target) {
					if (!_status.event.check) {
						return 0;
					}
					return get.attitude(_status.event.player, target);
				})
				.set("check", check);
			"step 1";
			if (result.bool) {
				player.storage.suiren = true;
				player.awakenSkill(event.name);
				player.logSkill("suiren", result.targets);
				player.removeSkills("reyicong");
				player.gainMaxHp();
				player.recover();
				result.targets[0].draw(3);
			}
		},
	},
	xinmanjuan: {
		audio: "manjuan",
		forced: true,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			var hs = player.getCards("h");
			return (
				event.type != "xinmanjuan" &&
				event.getg(player).filter(function (card) {
					return hs.includes(card);
				}).length > 0
			);
		},
		content() {
			"step 0";
			var hs = player.getCards("h"),
				cards = trigger.getg(player).filter(function (card) {
					return hs.includes(card);
				});
			event.cards = cards;
			event.rawCards = cards.slice(0);
			player.loseToDiscardpile(cards);
			if (_status.currentPhase != player) {
				event.finish();
			}
			"step 1";
			event.card = event.cards.shift();
			event.togain = [];
			var number = get.number(event.card);
			for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
				var current = ui.discardPile.childNodes[i];
				if (!event.rawCards.includes(current) && get.number(current) == number) {
					event.togain.push(current);
				}
			}
			if (!event.togain.length) {
				event.goto(4);
			}
			"step 2";
			player.chooseButton(["是否获得其中的一张牌？", event.togain]).ai = function (button) {
				return get.value(button.link);
			};
			"step 3";
			if (result.bool) {
				player.gain(result.links[0], "gain2").type = "xinmanjuan";
			}
			"step 4";
			if (event.cards.length) {
				event.goto(1);
			}
		},
		ai: {
			threaten: 4.2,
			nogain: 1,
			skillTagFilter(player) {
				return player != _status.currentPhase;
			},
		},
	},
	manjuan: {
		audio: true,
		trigger: { global: "loseAfter" },
		filter(event, player) {
			if (event.type != "discard") {
				return false;
			}
			if (event.player == player) {
				return false;
			}
			if (!player.countCards("he")) {
				return false;
			}
			for (var i = 0; i < event.cards2.length; i++) {
				if (get.position(event.cards2[i], true) == "d") {
					return true;
				}
			}
			return false;
		},
		direct: true,
		gainable: true,
		content() {
			"step 0";
			if (trigger.delay == false) {
				game.delay();
			}
			"step 1";
			var cards = [];
			var suits = ["club", "spade", "heart", "diamond"];
			for (var i = 0; i < trigger.cards2.length; i++) {
				if (get.position(trigger.cards2[i], true) == "d") {
					cards.push(trigger.cards2[i]);
					suits.remove(get.suit(trigger.cards2[i]));
				}
			}
			if (cards.length) {
				var maxval = 0;
				for (var i = 0; i < cards.length; i++) {
					var tempval = get.value(cards[i]);
					if (tempval > maxval) {
						maxval = tempval;
					}
				}
				maxval += cards.length - 1;
				var next = player.chooseToDiscard("he", { suit: suits });
				next.set("ai", function (card) {
					return _status.event.maxval - get.value(card);
				});
				next.set("maxval", maxval);
				next.set("dialog", [get.prompt(event.name), "hidden", cards]);
				next.logSkill = event.name;
				event.cards = cards;
			}
			"step 2";
			if (result.bool) {
				player.gain(event.cards, "gain2", "log");
			}
		},
		ai: {
			threaten: 1.3,
		},
	},
	zuixiang: {
		skillAnimation: true,
		animationColor: "gray",
		audio: true,
		limited: true,
		trigger: { player: "phaseZhunbeiBegin" },
		content() {
			"step 0";
			player.awakenSkill(event.name);
			event.cards = player.showCards(get.cards(3)).cards;
			player.addToExpansion(event.cards, "gain2").gaintag.add("zuixiang2");
			"step 1";
			if (lib.skill.zuixiang.filterSame(cards)) {
				player.gain(cards, "gain2").type = "xinmanjuan";
			} else {
				trigger._zuixiang = true;
				player.addSkill("zuixiang2");
			}
		},
		filterSame(c) {
			for (var i = 0; i < c.length; i++) {
				for (var j = i + 1; j < c.length; j++) {
					if (get.number(c[i]) == get.number(c[j])) {
						return true;
					}
				}
			}
			return false;
		},
	},
	zuixiang2: {
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		mod: {
			cardEnabled(card, player) {
				var type = get.type2(card);
				var list = player.getExpansions("zuixiang2");
				for (var i of list) {
					if (get.type2(i, false) == type) {
						return false;
					}
				}
			},
			cardRespondable() {
				return lib.skill.zuixiang2.mod.cardEnabled.apply(this, arguments);
			},
			cardSavable() {
				return lib.skill.zuixiang2.mod.cardEnabled.apply(this, arguments);
			},
		},
		trigger: {
			player: "phaseZhunbeiBegin",
			target: "useCardToBefore",
		},
		forced: true,
		charlotte: true,
		sourceSkill: "zuixiang",
		filter(event, player) {
			if (event.name == "phaseZhunbei") {
				return !event._zuixiang;
			}
			var type = get.type2(event.card);
			var list = player.getExpansions("zuixiang2");
			for (var i of list) {
				if (get.type2(i) == type) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			if (event.triggername == "useCardToBefore") {
				trigger.cancel();
				event.finish();
				return;
			}
			var cards = get.cards(3);
			player.addToExpansion("gain2", cards).gaintag.add("zuixiang2");
			"step 1";
			var cards = player.getExpansions("zuixiang2");
			player.showCards(cards);
			if (lib.skill.zuixiang.filterSame(cards)) {
				player.gain(cards, "gain2", "log").type = "xinmanjuan";
				player.removeSkill("zuixiang2");
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					var type = get.type2(card);
					var list = target.getExpansions("zuixiang2");
					for (var i of list) {
						if (get.type2(i) == type) {
							return "zeroplayertarget";
						}
					}
				},
			},
		},
	},
	yanxiao: {
		audio: 2,
		enable: "phaseUse",
		filterCard: { suit: "diamond" },
		filterTarget(card, player, target) {
			return target.canAddJudge({ name: "yanxiao_card" });
		},
		check(card) {
			return 7 - get.value(card);
		},
		position: "he",
		filter(event, player) {
			return player.countCards("he", { suit: "diamond" }) > 0;
		},
		discard: false,
		lose: false,
		delay: false,
		prepare: "give",
		content() {
			"step 0";
			game.addGlobalSkill("yanxiao_global");
			target.addJudge({ name: "yanxiao_card" }, cards);
			"step 1";
			game.delay();
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (
						target.countCards("j", function (card) {
							return (
								get.effect(
									target,
									{
										name: card.viewAs || card.name,
										cards: [card],
									},
									target,
									target
								) < 0
							);
						})
					) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	yanxiao_global: {
		trigger: { player: "phaseJudgeBegin" },
		forced: true,
		filter(event, player) {
			return player.countCards("j") > 0 && player.hasJudge("yanxiao_card");
		},
		content() {
			player.gain(player.getCards("j"), "gain2");
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (get.type(card) == "delay" && target.hasJudge("yanxiao_card")) {
						return [0, 0.1];
					}
				},
			},
		},
	},
	anxian: {
		audio: 2,
		group: ["anxian_source", "anxian_target"],
		subSkill: {
			source: {
				audio: "anxian",
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					return event.card && event.card.name == "sha";
				},
				check(event, player) {
					if (get.damageEffect(event.player, player, player) <= 0) {
						return true;
					}
					return false;
				},
				content() {
					"step 0";
					if (trigger.player.countCards("h")) {
						trigger.player.chooseToDiscard(true);
					}
					"step 1";
					player.draw();
					trigger.cancel();
				},
			},
			target: {
				audio: "anxian",
				trigger: { target: "useCardToTargeted" },
				direct: true,
				filter(event, player) {
					return event.card.name == "sha" && player.countCards("h");
				},
				content() {
					"step 0";
					var next = player.chooseToDiscard(get.prompt2("anxian"));
					next.set("ai", function (card) {
						var player = _status.event.player;
						var trigger = _status.event.getTrigger();
						if (get.attitude(player, trigger.player) > 0) {
							return 9 - get.value(card);
						}
						if (player.countCards("h", { name: "shan" })) {
							return -1;
						}
						return 7 - get.value(card);
					});
					next.logSkill = "anxian";
					"step 1";
					if (result.bool) {
						trigger.player.draw();
						trigger.getParent().excluded.push(player);
					}
				},
			},
		},
	},
	junwei: {
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player.getExpansions("yinling").length >= 3;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("yinling");
			if (cards.length > 3) {
				player.chooseButton(3, [get.prompt("junwei"), "hidden", cards]).set("ai", function (button) {
					return 1;
				});
			} else {
				player
					.chooseBool()
					.set("createDialog", [get.prompt("junwei"), "hidden", cards])
					.set("dialogselectx", true)
					.set("choice", true);
				event.cards = cards.slice(0);
			}
			"step 1";
			if (result.bool) {
				player.logSkill("junwei");
				var cards = event.cards || result.links;
				player.loseToDiscardpile(cards);
				player
					.chooseTarget(true, function (card, player, target) {
						return player != target;
					})
					.set("ai", function (target) {
						return -get.attitude(_status.event.player, target) / Math.sqrt(1 + target.hp);
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool && result.targets && result.targets.length) {
				var target = result.targets[0];
				player.line(result.targets);
				event.target = target;
				var nshan = target.countCards("h", function (card) {
					if (_status.connectMode) {
						return true;
					}
					return card.name == "shan";
				});
				if (nshan == 0) {
					event.directfalse = true;
				} else {
					target
						.chooseCard("交给" + get.translation(player) + "一张【闪】，或失去1点体力", function (card) {
							return card.name == "shan";
						})
						.set("ai", function (card) {
							if (_status.event.nshan > 1) {
								return 1;
							}
							if (_status.event.player.hp >= 3) {
								return 0;
							}
							return 1;
						})
						.set("nshan", nshan);
				}
			} else {
				event.finish();
			}
			"step 3";
			if (!event.directfalse && result.bool) {
				game.delay();
			}
			ui.clear();
			"step 4";
			if (!event.directfalse && result.bool) {
				event.cards = result.cards;
				event.target.$throw(result.cards);
				player
					.chooseTarget("将" + get.translation(event.cards) + "交给一名角色", true, function (card, player, target) {
						return target != _status.event.getParent().target;
					})
					.set("ai", function (target) {
						return get.attitude(_status.event.player, target) / (target.countCards("h", "shan") + 1);
					});
			} else {
				event.target.loseHp();
				delete event.cards;
			}
			"step 5";
			if (event.cards) {
				player.line(result.targets, "green");
				result.targets[0].gain(event.cards, "gain2").giver = player;
				game.log(player, "将", event.cards, "交给", result.targets[0]);
				event.finish();
			} else {
				if (event.target.countCards("e")) {
					player.choosePlayerCard("e", "将" + get.translation(event.target) + "的一张装备牌移出游戏", true, event.target);
				} else {
					event.finish();
				}
			}
			"step 6";
			if (result.bool) {
				var card = result.links[0];
				target.addToExpansion(card, target, "give").gaintag.add("junwei2");
				target.addSkill("junwei2");
			}
		},
		ai: {
			combo: "yinling",
		},
	},
	junwei2: {
		mark: true,
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		charlotte: true,
		sourceSkill: "junwei",
		content() {
			"step 0";
			var cards = player.getExpansions("junwei2").filter(function (card) {
				return player.canEquip(card, true);
			});
			if (cards.length) {
				player.$give(cards[0], player, false);
				game.delay(0.5);
				player.equip(cards[0]);
				event.redo();
			}
			"step 1";
			player.removeSkill("junwei2");
		},
	},
	yinling: {
		enable: "phaseUse",
		filterCard: { color: "black" },
		position: "he",
		marktext: "锦",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		filter(event, player) {
			return player.countCards("he", { color: "black" }) > 0 && player.getExpansions("yinling").length < 4;
		},
		filterTarget(card, player, target) {
			return target.countCards("he") > 0 && target != player;
		},
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			player.choosePlayerCard("hej", target, true);
			"step 1";
			if (result.bool && result.links && result.links.length) {
				player.addToExpansion(result.links, target, "give").gaintag.add("yinling");
			}
		},
		ai: {
			order: 10.1,
			expose: 0.1,
			result: {
				target(player, target) {
					if (target.hasSkill("tuntian")) {
						return 0;
					}
					var es = target.getCards("e");
					var nh = target.countCards("h");
					var noe = es.length == 0 || target.hasSkillTag("noe");
					var noe2 = es.length == 1 && es[0].name == "baiyin" && target.hp < target.maxHp;
					var noh = nh == 0 || target.hasSkillTag("noh");
					if (noh && noe) {
						return 0;
					}
					if (noh && noe2) {
						return 0.01;
					}
					if (get.attitude(player, target) <= 0) {
						return target.countCards("he") ? -1.5 : 1.5;
					}
					var js = target.getCards("j");
					if (js.length) {
						var jj = js[0].viewAs ? { name: js[0].viewAs } : js[0];
						if (jj.name == "guohe") {
							return 3;
						}
						if (js.length == 1 && get.effect(target, jj, target, player) >= 0) {
							return -1.5;
						}
						return 2;
					}
					return -1.5;
				},
			},
		},
	},
	fenyong: {
		audio: 2,
		trigger: { player: "damageEnd" },
		frequent: true,
		filter(event, player) {
			return !player.hasSkill("fenyong_mark");
		},
		async content(event, trigger, player) {
			player.addSkill("fenyong_mark");
		},
		subSkill: {
			mark: {
				audio: "fenyong",
				mark: true,
				intro: {
					content: "防止你受到的所有伤害",
				},
				trigger: { player: "damageBegin3" },
				charlotte: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					trigger.cancel();
				},
				ai: {
					maixie: true,
					maixie_hp: true,
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
			},
		},
	},
	xuehen: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player.hasSkill("fenyong_mark") && event.player.isIn();
		},
		async content(event, trigger, player) {
			player.removeSkill("fenyong_mark");
			const list = [];
			if (trigger.player.countDiscardableCards(player, "he") && player.isDamaged()) {
				list.add("弃牌");
			}
			const card = new lib.element.VCard({ name: "sha", isCard: true }),
				targets = game.filterPlayer(current => {
					return player.canUse(card, current, false);
				});
			if (targets.length) {
				list.add("出杀");
			}
			if (!list.length) {
				return;
			}
			const result =
				list.length > 1
					? await player
							.chooseControl("弃牌", "出杀")
							.set("prompt", `###雪恨###弃置${get.translation(trigger.player)}${get.cnNumber(player.getDamagedHp())}张牌，或对任意一名角色使用一张杀`)
							.set("ai", () => get.event().resultx)
							.set(
								"resultx",
								(() => {
									const getV = current => get.effect(current, card, player, player);
									const target = targets.maxBy(getV),
										eff = getV(target),
										eff2 = get.effect(trigger.player, { name: "guohe_copy2" }, player, player);
									if (eff < 0) {
										return 0;
									}
									if (eff2 < 0) {
										return 1;
									}
									return eff > eff2 ? 1 : 0;
								})()
							)
							.forResult()
					: {
							control: list[0],
						};
			if (!result) {
				return;
			}
			if (result.control == "弃牌") {
				player.line(trigger.player, "green");
				const num = Math.min(player.getDamagedHp(), trigger.player.countDiscardableCards(player, "he"));
				if (num > 0) {
					player.discardPlayerCard(trigger.player, true, "he", num);
				}
			} else {
				await player.chooseUseTarget(card, true, false, "nodistance");
			}
		},
		ai: {
			combo: "fenyong",
		},
	},
	mouduan: {
		audio: 1,
		init2(player) {
			game.broadcastAll(function (player) {
				player._mouduan_mark = player.mark("武", {
					content: "拥有技能【激昂】、【谦逊】",
				});
			}, player);
			player.addAdditionalSkill("mouduan", ["jiang", "qianxun"]);
		},
		derivation: ["jiang", "qianxun", "yingzi", "keji"],
		onremove(player) {
			game.broadcastAll(function (player) {
				if (player._mouduan_mark) {
					player._mouduan_mark.delete();
					delete player._mouduan_mark;
				}
			}, player);
			player.removeAdditionalSkills("mouduan");
		},
		trigger: { player: "loseEnd" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player._mouduan_mark && player._mouduan_mark.name == "武" && player.countCards("h") <= 2;
		},
		content() {
			game.broadcastAll(function (player) {
				if (!player._mouduan_mark) {
					return;
				}
				player._mouduan_mark.name = "文";
				player._mouduan_mark.skill = "文";
				player._mouduan_mark.firstChild.innerHTML = "文";
				player._mouduan_mark.info.content = "拥有技能【英姿】、【克己】";
			}, player);
			player.addAdditionalSkills("mouduan", ["yingzi", "keji"]);
		},
		group: "mouduan2",
	},
	mouduan2: {
		audio: 1,
		trigger: { global: "phaseZhunbeiBegin" },
		sourceSkill: "mouduan",
		//priority:5,
		filter(event, player) {
			return player._mouduan_mark && player._mouduan_mark.name == "文" && player.countCards("h") > 2;
		},
		direct: true,
		content() {
			"step 0";
			player.chooseToDiscard("he", "谋断：是否弃置一张牌将标记变为“武”？").ai = function () {
				return -1;
			};
			"step 1";
			if (result.bool && player.countCards("h") > 2) {
				game.broadcastAll(function (player) {
					if (!player._mouduan_mark) {
						return;
					}
					player._mouduan_mark.name = "武";
					player._mouduan_mark.skill = "武";
					player._mouduan_mark.firstChild.innerHTML = "武";
					player._mouduan_mark.info.content = "拥有技能【激昂】、【谦逊】";
				}, player);
				player.addAdditionalSkills("mouduan", ["jiang", "qianxun"]);
			}
		},
	},
	tanhu: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				target.addTempSkill("tanhu2");
			}
		},
		ai: {
			result: {
				target(player, target) {
					var hs = player.getCards("h");
					if (hs.length < 3) {
						return 0;
					}
					var bool = false;
					for (var i = 0; i < hs.length; i++) {
						if (hs[i].number >= 9 && get.value(hs[i]) < 7) {
							bool = true;
							break;
						}
					}
					if (!bool) {
						return 0;
					}
					return -1;
				},
			},
			order: 9,
		},
		group: "tanhu3",
	},
	tanhu2: {
		mark: true,
		intro: {
			content: "已成为探虎目标",
		},
	},
	tanhu3: {
		mod: {
			globalFrom(from, to) {
				if (to.hasSkill("tanhu2")) {
					return -Infinity;
				}
			},
			wuxieRespondable(card, player, target) {
				if (target && target.hasSkill("tanhu2")) {
					return false;
				}
			},
		},
	},
	jie: {
		audio: 1,
		trigger: { source: "damageBegin1" },
		filter(event) {
			return event.card?.name === "sha" && get.color(event.card) == "red";
		},
		forced: true,
		content() {
			trigger.num++;
		},
	},
	dahe: {
		audio: true,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return game.hasPlayer(current => get.info("dahe").filterTarget(null, player, current));
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player.chooseToCompare(target).set("preserve", "win").forResult();
			if (result?.bool) {
				target.addTempSkill(event.name + "_effect");
				const card = result?.target;
				if (get.itemtype(card) == "card") {
					const result = await player
						.chooseTarget(`将${get.translation(card)}交给一名角色`, (card, player, target) => {
							return target.hp <= player.hp;
						})
						.set("ai", target => {
							const { player, du } = get.event();
							const att = get.attitude(player, target);
							if (du) {
								return -att;
							}
							return att;
						})
						.set("du", card.name == "du")
						.forResult();
					if (result?.bool && result?.targets?.length) {
						player.line(result.targets, "green");
						await result.targets[0].gain(card, "gain2");
					}
				}
			} else if (player.countCards("h")) {
				await player.showHandcards();
				if (player.countDiscardableCards(player, "h")) {
					await player.chooseToDiscard("h", true);
				}
			}
		},
		ai: {
			result: {
				target(player, target) {
					var hs = player.getCards("h");
					if (hs.length < 3) {
						return 0;
					}
					var bool = false;
					for (var i = 0; i < hs.length; i++) {
						if (hs[i].number >= 9 && get.value(hs[i]) < 7) {
							bool = true;
							break;
						}
					}
					if (!bool) {
						return 0;
					}
					if (player.canUse("sha", target) && player.countCards("h", "sha")) {
						return -2;
					}
					return -0.5;
				},
			},
			order: 9,
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				intro: { content: "非红桃闪无效" },
				mod: {
					cardRespondable(card, player) {
						if (card.name == "shan") {
							const suit = get.suit(card);
							if (suit != "heart" && suit != "unsure") {
								return false;
							}
						}
					},
					cardEnabled(card, player) {
						if (card.name == "shan") {
							const suit = get.suit(card);
							if (suit != "heart" && suit != "unsure") {
								return false;
							}
						}
					},
				},
			},
		},
	},
	shichou: {
		initSkill(skill) {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					mod: {
						aiOrder(player, card, num) {
							if (typeof card == "object" && get.tag(card, "recover")) {
								return num / 114514;
							}
						},
					},
					charlotte: true,
					onremove: true,
					mark: true,
					marktext: "誓",
					intro: {
						markcount: () => 0,
						content: storage => `已为${get.translation(storage)}李代桃僵`,
					},
				};
				lib.translate[skill] = "誓仇";
				lib.translate[skill + "_bg"] = "仇";
			}
		},
		audio: true,
		skillAnimation: true,
		animationColor: "orange",
		limited: true,
		trigger: { player: "phaseZhunbeiBegin" },
		zhuSkill: true,
		filter(event, player) {
			if (!player.hasZhuSkill("shichou")) {
				return false;
			}
			if (player.countCards("he") < 2) {
				return false;
			}
			return game.hasPlayer(current => current != player && current.group == "shu");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					selectCard: 2,
					filterTarget(card, player, target) {
						return target.group == "shu" && target != player;
					},
					filterCard: true,
					position: "he",
					ai1(card) {
						return 7 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						if (player.hasUnknown()) {
							return 0;
						}
						if (target.hasSkillTag("nodamage")) {
							return 10;
						}
						const att = get.attitude(player, target);
						if (att <= 0) {
							if (target.hp == 1) {
								return (10 - att) / 2;
							}
							return 10 - att;
						} else {
							if (target.hp == 1) {
								return 0;
							}
							return (10 - att) / 4;
						}
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			player.awakenSkill(event.name);
			await player.give(cards, target);
			player.addSkill(event.name + "_effect");
			const skill = event.name + "_" + player.playerid;
			game.broadcastAll(lib.skill.shichou.initSkill, skill);
			for (const current of game.filterPlayer()) {
				current.removeSkill(skill);
				if (current == target) {
					target.addSkill(skill);
					target.storage[skill] = player;
					target.markSkill(skill);
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: {
					global: ["dying", "die"],
					player: "damageBegin4",
				},
				filter(event, player) {
					const target = game.findPlayer(current => current.storage["shichou_" + player.playerid] == player);
					if (!target) {
						return false;
					}
					if (event.name == "damage") {
						return target.isIn();
					}
					return event.player === target;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const target = game.findPlayer(current => current.storage["shichou_" + player.playerid] == player);
					if (trigger.name == "damage") {
						trigger.cancel();
						await game.delay(0.5);
						await target
							.damage(trigger.source?.isIn() ? trigger.source : "nosource", trigger.nature, trigger.num)
							.set("card", trigger.card)
							.set("cards", trigger.cards);
						await target.draw(trigger.num);
					} else {
						target.removeSkill("shichou_" + player.playerid);
						player.removeSkill(event.name);
					}
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) {
									return [1, -2];
								}
								if (get.attitude(player, target) > 0) {
									return [0, 0];
								}
								const targetx = game.findPlayer(current => current.storage["shichou_" + target.playerid] == target);
								if (!targetx?.isIn()) {
									return;
								}
								const bool = game.hasPlayer(current => current.hasCard(card => current.canSaveCard(card, targetx), "hs") && get.attitude(current, targetx) > 0);
								let num = -1;
								if (targetx.hp >= 4) {
									return [0, num * 2];
								}
								if (targetx.hp == 3) {
									return [0, num * 1.5];
								}
								if (targetx.hp <= 2) {
									return [0, bool ? num : -num];
								}
							}
						},
					},
				},
			},
		},
	},
	zhaolie: {
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return event.num > 0 && !event.numFixed && game.hasPlayer(current => player.inRange(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player.inRange(target);
				})
				.set("ai", target => {
					const player = get.player();
					if (get.attitude(player, target) > 0) {
						return 0;
					}
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			trigger.num--;
			if (trigger.num <= 0) {
				await game.delay();
			}
			player
				.when({ player: "phaseDrawEnd" })
				.filter(evt => trigger == evt)
				.step(async () => {
					let cards = get.cards(3);
					await game.cardsGotoOrdering(cards);
					await player.showCards(cards);
					const cards2 = cards.filter(card => get.type(card) != "basic" || get.name(card) == "tao");
					const num = cards.filter(card => get.type(card) != "basic").length;
					if (cards2.length) {
						cards.removeArray(cards2);
						await game.cardsDiscard(cards2);
					}
					cards = cards.filter(card => get.type(card) == "basic");
					if (!target.isIn()) {
						return;
					}
					let result;
					if (!num) {
						if (!cards.length) {
							return;
						}
						result = await target
							.chooseTarget(
								(card, player, target) => {
									return get.event().list.includes(target);
								},
								`选择一个目标获得${get.translation(cards)}`,
								true
							)
							.set("ai", target => {
								const { player, cardsx } = get.event();
								return get.attitude(player, target) * get.value(cardsx, target);
							})
							.set("list", [player, target])
							.set("cardsx", cards)
							.forResult();
						if (result?.bool && result?.targets?.length) {
							await result.targets[0].gain(cards, "gain2");
						}
					} else {
						let str = `弃置${get.cnNumber(num)}张牌`;
						if (cards.length) {
							str += `并令${get.translation(player)}获得${get.translation(cards)}`;
						}
						str += `，或受到${get.translation(player)}的${num}点伤害`;
						if (cards.length) {
							str += `并获得${get.translation(cards)}`;
						}
						result =
							target.countCards("he") < num
								? { bool: false }
								: await target
										.chooseToDiscard(num, "he", get.prompt("zhaolie"), str)
										.set("ai", card => {
											const { goon } = get.event();
											return goon ? 8 - get.value(card) : 0;
										})
										.set("goon", (get.damageEffect(target, player, target) < 0 && target.getHp() <= 2 * num) || (num >= 2 && !target.countCards("hs", card => target.canSaveCard(card, target)) >= num))
										.forResult();
						if (result?.bool) {
							if (cards.length) {
								await player.gain(cards, "gain2");
							}
						} else {
							if (num) {
								await target.damage(num);
							}
							if (cards.length) {
								if (target.isIn()) {
									await target.gain(cards, "gain2");
								} else {
									await game.cardsDiscard(cards);
								}
							}
						}
					}
				});
		},
	},
	fulu: {
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (event.card.name == "sha" && !game.hasNature(event.card)) {
				return true;
			}
		},
		audio: true,
		check(event, player) {
			var eff = 0;
			for (var i = 0; i < event.targets.length; i++) {
				var target = event.targets[i];
				var eff1 = get.damageEffect(target, player, player);
				var eff2 = get.damageEffect(target, player, player, "thunder");
				eff += eff2;
				eff -= eff1;
			}
			return eff >= 0;
		},
		content() {
			game.setNature(trigger.card, "thunder");
			if (get.itemtype(trigger.card) == "card") {
				var next = game.createEvent("fulu_clear");
				next.card = trigger.card;
				event.next.remove(next);
				trigger.after.push(next);
				next.setContent(function () {
					game.setNature(card, []);
				});
			}
		},
	},
	fuji: {
		trigger: { global: "damageBegin1" },
		filter(event) {
			return event.source && event.source.isIn() && event.hasNature("thunder");
		},
		check(event, player) {
			return get.attitude(player, event.source) > 0 && get.attitude(player, event.player) < 0;
		},
		prompt(event) {
			return get.translation(event.source) + "即将对" + get.translation(event.player) + "造成伤害，" + get.prompt("fuji");
		},
		logTarget: "source",
		content() {
			trigger.source.judge().callback = lib.skill.fuji.callback;
		},
		callback() {
			var evt = event.getParent(2);
			switch (event.judgeResult.color) {
				case "black":
					evt._trigger.num++;
					break;

				case "red":
					evt._trigger.source.gain(card, "gain2");
					break;
				default:
					break;
			}
		},
	},
};

export default skills;
