import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//桌游志贴纸
	spyinzhi: {
		trigger: { player: "damageEnd" },
		frequent: true,
		filter(event, player) {
			return event.num > 0;
		},
		getIndex: event => event.num,
		async content(event, trigger, player) {
			let cards = get.cards(2);
			await game.cardsGotoOrdering(cards);
			await player.showCards(cards);
			const { source } = trigger;
			let count = cards.filter(card => get.suit(card) == "spade").length;
			while (count-- && source?.isIn() && game.hasPlayer(current => current != source && source.countGainableCards(current, "h"))) {
				const result = await player
					.chooseTarget(`令一名角色获得${get.translation(source)}的一张手牌`, (card, player, target) => {
						const source = get.event().source;
						return target != source && source.countGainableCards(target, "h");
					})
					.set("source", source)
					.set("ai", target => {
						const { player, source } = get.event();
						return get.effect(target, { name: "shunshou_copy", position: "h" }, source, player);
					})
					.forResult();
				if (result?.targets?.length) {
					const [target] = result.targets;
					player.line([source, target], "green");
					if (source.countGainableCards(target, "h")) {
						await target.gainPlayerCard(source, "h", true);
					}
				}
			}
			cards = cards.filter(card => get.suit(card) != "spade");
			if (cards.length) {
				await player.gain(cards, "gain2", "log");
			}
		},
	},
	spmingjian: {
		trigger: { global: "phaseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.chooseCard(get.prompt2("spmingjian", trigger.player), "he");
			next.set("ai", function (card) {
				var target = _status.event.getTrigger().player;
				var player = _status.event.player;
				if (get.attitude(player, target) > 0 && target.countCards("j") > 0) {
					return 5 - get.value(card);
				}
				return -1;
			});
			next.set("filterCard", function (card, player) {
				if (get.position(card) == "e") {
					return lib.filter.cardDiscardable.apply(this, arguments);
				}
				return true;
			});
			//next.set('logSkill',['spmingjian',trigger.player]);
			"step 1";
			if (result.bool) {
				player.logSkill("spmingjian", trigger.player);
				var card = result.cards[0];
				event.card = card;
				if (get.position(card) == "e") {
					event._result = { index: 0 };
				} else if (!lib.filter.cardDiscardable(card, player, event)) {
					event._result = { index: 1 };
				} else {
					var name = get.translation(trigger.player);
					player
						.chooseControl()
						.set("choiceList", ["令" + name + "跳过本回合的判定阶段", "令" + name + "于本回合的判定中不触发「判定结果生效前」的时机"])
						.set("ai", function () {
							return 0;
						});
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.index == 0) {
				player.discard(card);
				trigger.player.skip("phaseJudge");
			} else {
				trigger.player.addToExpansion(card, player, "giveAuto").gaintag.add("spmingjian_charlotte");
				trigger.player.addSkill("spmingjian_charlotte");
			}
		},
		ai: {
			expose: 0.25,
		},
	},
	spmingjian_charlotte: {
		trigger: { player: ["judgeBefore", "phaseAfter"] },
		forced: true,
		firstDo: true,
		silent: true,
		popup: false,
		charlotte: true,
		sourceSkill: "spmingjian",
		content() {
			if (trigger.name == "phase") {
				player.removeSkill(event.name);
			} else {
				trigger.noJudgeTrigger = true;
			}
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		marktext: "鉴",
		intro: {
			name: "明鉴",
			content: "expansion",
			markcount: "expansion",
		},
	},
	spshude: {
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter(event, player) {
			return player.countCards("h") < player.maxHp;
		},
		content() {
			player.drawTo(player.maxHp);
		},
	},
	spfuluan: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.inRange(target);
		},
		selectCard: 3,
		position: "he",
		check(card) {
			return 5 - get.value(card);
		},
		complexCard: true,
		filterCard(card, player) {
			if (!ui.selected.cards.length) {
				return player.countCards("he", { suit: get.suit(card) }) > 2;
			}
			return get.suit(card) == get.suit(ui.selected.cards[0]);
		},
		content() {
			target.turnOver();
			player.addTempSkill("spfuluan2");
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.isTurnedOver()) {
						return 2;
					}
					return -1;
				},
			},
		},
	},
	spfuluan2: {
		mod: {
			cardEnabled(card) {
				if (card.name == "sha") {
					return false;
				}
			},
		},
	},
	spzhaoxin: {
		trigger: { player: "phaseDrawEnd" },
		check(event, player) {
			return player.getUseValue({ name: "sha", isCard: true }) > 0;
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.showHandcards();
			"step 1";
			player.chooseUseTarget("sha", false);
		},
	},
	splanggu: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return get.itemtype(event.source) == "player";
		},
		logTarget: "source",
		content() {
			"step 0";
			player.judge();
			"step 1";
			if (trigger.source.countCards("h") > 0) {
				var next = player.discardPlayerCard(trigger.source, "h", [1, Infinity], "allowChooseAll");
				next.set("suit", result.suit);
				next.set("filterButton", function (button) {
					return get.suit(button.link) == _status.event.suit;
				});
				next.set("visible", true);
			}
		},
		group: "splanggu_rewrite",
	},
	splanggu_rewrite: {
		trigger: { player: "judge" },
		sourceSkill: "splanggu",
		filter(event, player) {
			return player.countCards("hs") > 0 && event.getParent().name == "splanggu";
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseCard("狼顾的判定结果为" + get.translation(trigger.player.judging[0]) + "，是否打出一张手牌进行代替？", "hs", function (card) {
					var player = _status.event.player;
					var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") {
						return mod2;
					}
					var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") {
						return mod;
					}
					return true;
				})
				.set("ai", function (card) {
					return -1;
				});
			"step 1";
			if (result.bool) {
				player.respond(result.cards, "highlight", "splanggu", "noOrdering");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				if (trigger.player.judging[0].clone) {
					trigger.player.judging[0].clone.classList.remove("thrownhighlight");
					game.broadcast(function (card) {
						if (card.clone) {
							card.clone.classList.remove("thrownhighlight");
						}
					}, trigger.player.judging[0]);
					game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
				}
				game.cardsDiscard(trigger.player.judging[0]);
				trigger.player.judging[0] = result.cards[0];
				trigger.orderingCards.addArray(result.cards);
				game.log(trigger.player, "的判定牌改为", result.cards[0]);
				game.delay(2);
			}
		},
	},
	sphantong: {
		trigger: {
			player: "loseEnd",
		},
		frequent: true,
		filter(event, player) {
			return event.type == "discard" && event.getParent(3).name == "phaseDiscard" && event.cards.filterInD("d").length > 0;
		},
		content() {
			if (!player.storage.sphantong) {
				player.storage.sphantong = [];
			}
			var cards = trigger.cards.filterInD("d");
			player.storage.sphantong.addArray(cards);
			player.$gain2(cards);
			game.log(player, "将", cards, "置于武将牌上");
			player.markSkill("sphantong");
		},
		group: ["sphantong_gain"],
		derivation: ["hujia", "jijiang", "jiuyuan", "xueyi"],
		marktext: "诏",
		intro: {
			content: "cards",
			onunmark: "throw",
		},
	},
	sphantong_gain: {
		trigger: { global: "phaseBegin" },
		direct: true,
		sourceSkill: "sphantong",
		filter(event, player) {
			return player.storage.sphantong && player.storage.sphantong.length > 0;
		},
		content() {
			"step 0";
			player.chooseButton([get.prompt("sphantong"), player.storage.sphantong], function (button) {
				var player = _status.event.player;
				if (_status.currentPhase == player) {
					//血裔
					if (
						(player.hasJudge("lebu") || player.skipList.includes("phaseUse")) &&
						game.hasPlayer(function (current) {
							return current != player && current.group == "qun";
						})
					) {
						return 1;
					}
					//激将
					if (
						!player.hasJudge("lebu") &&
						!player.skipList.includes("phaseUse") &&
						game.hasPlayer(function (current) {
							return current != player && current.group == "shu" && current.hasSha() && get.attitude(player, current) > 0 && get.attitude(current, player) > 0;
						}) &&
						game.hasPlayer(function (target) {
							return player.canUse({ name: "sha" }, target) && get.effect(target, { name: "sha" }, player, player) > 0;
						})
					) {
						return 1;
					}
				}
				//护驾
				else if (
					!player.hasShan("all") &&
					game.hasPlayer(function (current) {
						return current != player && current.group == "wei" && current.mayHaveShan(player, "respond") && get.attitude(player, current) > 0 && get.attitude(current, player) > 0;
					})
				) {
					return 1;
				}
				return -1;
			});
			"step 1";
			if (result.bool) {
				player.logSkill("sphantong");
				var card = result.links[0];
				player.$throw(card);
				game.log(player, "将", card, "置入了弃牌堆");
				player.storage.sphantong.remove(card);
				player[player.storage.sphantong.length > 0 ? "markSkill" : "unmarkSkill"]("sphantong");
				game.cardsDiscard(card);
				var list = ["hujia", "jijiang", "jiuyuan", "xueyi"];
				for (var i = 0; i < list.length; i++) {
					if (player.hasSkill(list[i])) {
						list.splice(i--, 1);
					}
				}
				if (list.length) {
					player
						.chooseControl(list)
						.set("prompt", "选择获得以下技能中的一个")
						.set("ai", function () {
							var player = _status.event.player;
							if (_status.currentPhase == player) {
								//血裔
								if (
									(player.hasJudge("lebu") || player.skipList.includes("phaseUse")) &&
									game.hasPlayer(function (current) {
										return current != player && current.group == "qun";
									})
								) {
									return "xueyi";
								}
								//激将
								if (
									!player.hasJudge("lebu") &&
									!player.skipList.includes("phaseUse") &&
									game.hasPlayer(function (current) {
										return current != player && current.group == "shu" && current.hasSha() && get.attitude(player, current) > 0 && get.attitude(current, player) > 0;
									}) &&
									game.hasPlayer(function (target) {
										return player.canUse({ name: "sha" }, target) && get.effect(target, { name: "sha" }, player, player) > 0;
									})
								) {
									return "jijiang";
								}
							}
							//护驾
							else if (
								!player.hasShan("all") &&
								game.hasPlayer(function (current) {
									return current != player && current.group == "wei" && current.mayHaveShan(player, "respond") && get.attitude(player, current) > 0 && get.attitude(current, player) > 0;
								})
							) {
								return "hujia";
							}
						});
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			var skill = result.control;
			player.addTempSkills(skill);
			// player.popup(skill,'wood');
			// game.log(player,'获得了技能','#g【'+get.translation(skill)+'】');
		},
	},
	sphuangen: {
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget) {
				return false;
			}
			if (get.type(event.card) != "trick") {
				return false;
			}
			if (get.info(event.card).multitarget) {
				return false;
			}
			if (event.targets.length < 2) {
				return false;
			}
			return player.hp > 0;
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("sphuangen"), [1, Math.min(player.hp, trigger.targets.length)], function (card, player, target) {
					return _status.event.targets.includes(target);
				})
				.set("ai", function (target) {
					return -get.effect(target, trigger.card, trigger.player, _status.event.player);
				})
				.set("targets", trigger.targets);
			"step 1";
			if (result.bool) {
				player.logSkill("sphuangen", result.targets);
				trigger.excluded.addArray(result.targets);
				player.draw();
			}
		},
		ai: { threaten: 3.5 },
		global: "sphuangen_ai",
		subSkill: {
			ai: {
				ai: {
					effect: {
						player_use(card, player) {
							if (
								typeof card != "object" ||
								!game.hasPlayer(target => {
									return target.hasSkill("sphuangen") && (get.attitude(player, target) < 0 || get.attitude(target, player) < 0);
								}) ||
								game.countPlayer(target => {
									return player.canUse(card, target);
								}) < 2
							) {
								return;
							}
							if (get.info(card)?.type != "trick") {
								return;
							}
							const select = get.info(card).selectTarget;
							let range;
							if (select == undefined) {
								range = [1, 1];
							} else if (typeof select == "number") {
								range = [select, select];
							} else if (get.itemtype(select) == "select") {
								range = select;
							} else if (typeof select == "function") {
								range = select(card, player);
								if (typeof range == "number") {
									range = [range, range];
								}
							}
							game.checkMod(card, player, range, "selectTarget", player);
							if (range[1] == -1 || (range[1] > 1 && ui.selected.targets && ui.selected.targets.length)) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	spyicong: {
		trigger: { player: "phaseDiscardEnd" },
		direct: true,
		locked: false,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			player.chooseCard("he", [1, player.countCards("he")], get.prompt2("spyicong"), "allowChooseAll").set("ai", function (card) {
				if (card.name == "du") {
					return 10;
				}
				if (ui.selected.cards.length) {
					return -1;
				}
				return 4 - get.value(card);
			});
			"step 1";
			if (result.bool) {
				player.logSkill("spyicong");
				player.addToExpansion(result.cards, player, "give").gaintag.add("spyicong");
			}
		},
		mod: {
			globalTo(from, to, num) {
				return num + to.getExpansions("spyicong").length;
			},
		},
		marktext: "扈",
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			name: "义从",
			content(storage, player) {
				return "共有" + get.cnNumber(player.getExpansions("spyicong").length) + "张“扈”";
			},
			markcount: "expansion",
		},
	},
	sptuji: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player.getExpansions("spyicong").length > 0;
		},
		content() {
			var cards = player.getExpansions("spyicong");
			var num = cards.length;
			player.addMark("sptuji2", num, false);
			player.addTempSkill("sptuji2");
			player.loseToDiscardpile(cards);
			if (num <= 1) {
				player.draw();
			}
		},
		ai: {
			combo: "spyicong",
		},
	},
	sptuji2: {
		onremove: true,
		charlotte: true,
		mod: {
			globalFrom(from, to, num) {
				return num - from.countMark("sptuji2");
			},
		},
		marktext: "突",
		intro: {
			name: "突骑",
			content: "至其他角色的距离-#",
		},
	},
};

export default skills;
