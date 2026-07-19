import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//官盗S系列关羽
	pszhonghun: {
		audio: "zhongyi",
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			return get.color(event.card) == "red";
		},
		frequent: true,
		content() {
			"step 0";
			var card = game.cardsGotoOrdering(get.cards()).cards[0];
			event.card = card;
			game.updateRoundNumber();
			player.showCards(card, get.translation(player) + "发动了【忠魂】");
			"step 1";
			if (get.color(card) == "red") {
				player.gain(card, "gain2");
			}
		},
	},
	//官盗S系列郭嘉·一版
	psqizuo: {
		trigger: { global: ["damageBegin1", "damageBegin3"] },
		filter(event, player, name) {
			return (name == "damageBegin1" && event.source && event.source.isIn() && player.inRange(event.source)) || (name == "damageBegin3" && event.player && event.player.isIn() && player.inRange(event.player));
		},
		direct: true,
		content() {
			"step 0";
			var name = event.triggername;
			var source = get.translation(trigger.source),
				target = get.translation(trigger.player),
				num = trigger.num;
			var targetx = trigger[name == "damageBegin1" ? "source" : "player"];
			var str = name == "damageBegin1" ? source + "即将对" + target + "造成" + num + "点伤害" : target + "即将受到" + source + "造成的" + num + "点伤害";
			player
				.chooseToDiscard(get.prompt("psqizuo", targetx), str + "，是否弃置一张牌并判定，若结果颜色与此牌相同，你可以令此伤害+1或-1？", "he")
				.set("ai", card => {
					if (_status.event.goon) {
						return 5.25 - get.value(card) + (get.color(card) == get.color(_status.pileTop) ? 0.75 : 0);
					}
					return 0;
				})
				.set(
					"goon",
					(function () {
						var eff = get.damageEffect(trigger.player, trigger.source, player);
						if (
							eff > 5 &&
							!trigger.player.hasSkillTag("filterDamage", null, {
								player: player,
								card: trigger.card,
							})
						) {
							return true;
						}
						if (eff < -5) {
							return true;
						}
						return false;
					})()
				)
				.set("logSkill", ["psqizuo", targetx]);
			"step 1";
			if (result.bool) {
				event.color = get.color(result.cards[0], player);
				player.judge(function (card) {
					if (get.color(card) == _status.event.getParent("psqizuo").color) {
						return 1;
					}
					return 0;
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player
					.chooseControl("+1", "-1", "cancel2")
					.set("prompt", "是否令此伤害+1或-1？")
					.set("ai", () => {
						if (_status.event.eff < 0) {
							return 1;
						}
						return 0;
					})
					.set("eff", get.damageEffect(trigger.player, trigger.source, player));
			} else {
				event.finish();
			}
			"step 3";
			if (result.index == 0) {
				trigger.num++;
				player.popup(" +1 ", "fire");
				game.log(player, "令此伤害+1");
			}
			if (result.index == 1) {
				trigger.num--;
				player.popup(" -1 ", "water");
				game.log(player, "令此伤害-1");
			}
		},
		ai: {
			threaten: 0.8,
		},
	},
	//官盗S系列郭嘉·二版
	psquanmou: {
		trigger: {
			global: "useCardAfter",
		},
		direct: true,
		filter(event, player) {
			return get.type2(event.card) == "trick" && event.player != player && event.targets && event.targets.includes(player) && event.cards.filterInD("odj").length && player.countCards("h");
		},
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt("psquanmou"), "弃置一张" + get.translation(get.color(trigger.card)) + "手牌，获得" + get.translation(trigger.cards), "h", (card, player) => {
					return get.color(card) == _status.event.color;
				})
				.set("ai", card => {
					return _status.event.value - get.value(card);
				})
				.set("logSkill", "psquanmou")
				.set("value", get.value(trigger.cards, player))
				.set("color", get.color(trigger.card));
			"step 1";
			if (result.bool) {
				var cards = trigger.cards.filterInD("odj");
				if (cards.filterInD("od").length) {
					player.gain(cards.filterInD("od"), "gain2");
				}
				if (cards.filterInD("j").length) {
					player.gain(cards.filterInD("j"), get.owner(cards.filterInD("j")[0]), "give");
				}
			}
		},
	},
	//官盗S赵云·一版
	pshuiqiang: {
		trigger: { player: ["shaMiss", "eventNeutralized"] },
		direct: true,
		clearTime: true,
		filter(event, player) {
			if (!event.card || event.card.name != "sha") {
				return false;
			}
			return event.target.isIn() && player.canUse("sha", event.target, false) && (player.hasSha() || (_status.connectMode && player.countCards("h")));
		},
		content() {
			"step 0";
			player
				.chooseToUse(
					get.prompt2("pshuiqiang", trigger.target),
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					trigger.target,
					-1
				)
				.set("addCount", false).logSkill = "pshuiqiang";
		},
	},
	pshuntu: {
		trigger: { source: "damageSource" },
		usable: 1,
		filter(event, player) {
			return event.card && event.card.name == "sha" && event.getParent(2).player == player && event.notLink() && player.isPhaseUsing();
		},
		direct: true,
		clearTime: true,
		content() {
			"step 0";
			player
				.chooseToUse(
					get.prompt2("pshuntu", trigger.player),
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					trigger.player,
					-1
				)
				.set("addCount", false).logSkill = "pshuntu";
			"step 1";
			if (!result.bool) {
				player.storage.counttrigger.pshuntu--;
			}
		},
	},
	//官盗S赵云·二版
	psqijin: {
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			"step 0";
			trigger.changeToZero();
			event.cards = get.cards(7);
			game.cardsGotoOrdering(event.cards);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					var str = "七进";
					if (player == game.me && !_status.auto) {
						str += "：获得一种颜色的所有牌";
					}
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			event.time = get.utc();
			game.addVideo("showCards", player, ["七进", get.cardsInfo(event.cards)]);
			game.addVideo("delay", null, 2);
			"step 1";
			var list = [];
			for (var i of cards) {
				list.add(get.color(i, false));
			}
			list.sort();
			var next = player.chooseControl(list);
			next.set("ai", function () {
				return _status.event.choice;
			}).set(
				"choice",
				(function () {
					if (list.length == 0) {
						return list[0];
					}
					var color = list[0];
					var cards1 = cards.filter(i => get.color(i) == color),
						cards2 = cards.filter(i => get.color(i) == list[1]);
					if (get.value(cards1) * cards1.length > get.value(cards2) * cards2.length) {
						return list[0];
					}
					return list[1];
				})()
			);
			"step 2";
			event.color = result.control;
			var time = 1000 - (get.utc() - event.time);
			if (time > 0) {
				game.delay(0, time);
			}
			"step 3";
			game.broadcastAll("closeDialog", event.videoId);
			player.gain(
				cards.filter(i => get.color(i, false) == event.color),
				"gain2"
			);
		},
		ai: {
			threaten: 1.5,
		},
	},
	psqichu: {
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (player != _status.currentPhase && !player.hasSkill("psqichu_used") && get.type(name) == "basic" && lib.inpile.includes(name)) {
				return true;
			}
		},
		filter(event, player) {
			if (event.responded || player == _status.currentPhase || player.hasSkill("psqichu_used")) {
				return false;
			}
			for (var i of lib.inpile) {
				if (get.type(i) == "basic" && event.filterCard({ name: i }, player, event)) {
					return true;
				}
			}
			return false;
		},
		delay: false,
		content() {
			"step 0";
			player.addTempSkill("psqichu_used");
			var evt = event.getParent(2);
			var cards = get.cards(2, true);
			var aozhan = player.hasSkill("aozhan");
			player
				.chooseButton(["七出：选择要" + (evt.name == "chooseToUse" ? "使用" : "打出") + "的牌", cards])
				.set("filterButton", function (button) {
					return _status.event.cards.includes(button.link);
				})
				.set(
					"cards",
					cards.filter(function (card) {
						if (get.type(card) != "basic") {
							return false;
						}
						if (aozhan && card.name == "tao") {
							return (
								evt.filterCard(
									{
										name: "sha",
										isCard: true,
										cards: [card],
									},
									evt.player,
									evt
								) ||
								evt.filterCard(
									{
										name: "shan",
										isCard: true,
										cards: [card],
									},
									evt.player,
									evt
								)
							);
						}
						return evt.filterCard(card, evt.player, evt);
					})
				)
				.set("ai", function (button) {
					var evt = _status.event.getParent(3);
					if (evt && evt.ai) {
						var tmp = _status.event;
						_status.event = evt;
						var result = (evt.ai || event.ai1)(button.link, _status.event.player, evt);
						_status.event = tmp;
						return result;
					}
					return 1;
				});
			"step 1";
			var evt = event.getParent(2);
			if (result.bool && result.links && result.links.length) {
				var name = result.links[0].name,
					aozhan = player.hasSkill("aozhan") && name == "tao";
				if (aozhan) {
					name = evt.filterCard(
						{
							name: "sha",
							isCard: true,
							cards: [card],
						},
						evt.player,
						evt
					)
						? "sha"
						: "shan";
				}
				if (evt.name == "chooseToUse") {
					game.broadcastAll(
						function (result, name) {
							lib.skill.psqichu_backup.viewAs = {
								name: name,
								cards: [result],
								isCard: true,
							};
							lib.skill.psqichu_backup.prompt = "选择" + get.translation(result) + "的目标";
						},
						result.links[0],
						name
					);
					evt.set("_backupevent", "psqichu_backup");
					evt.backup("psqichu_backup");
				} else {
					delete evt.result.used;
					delete evt.result.skill;
					evt.result.card = get.autoViewAs(result.links[0]);
					if (aozhan) {
						evt.result.card.name = name;
					}
					evt.result.cards = [result.links[0]];
					evt.redo();
					return;
				}
			}
			evt.goto(0);
		},
		ai: {
			effect: {
				target(card, player, target, effect) {
					if (target.hasSkill("psqichu_used")) {
						return;
					}
					if (get.tag(card, "respondShan")) {
						return 0.7;
					}
					if (get.tag(card, "respondSha")) {
						return 0.7;
					}
				},
			},
			order: 11,
			respondShan: true,
			respondSha: true,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		subSkill: {
			backup: {
				precontent() {
					var name = event.result.card.name;
					event.result.cards = event.result.card.cards;
					event.result.card = get.autoViewAs(event.result.cards[0]);
					event.result.card.name = name;
					event.result._apply_args = { addSkillCount: false };
				},
				filterCard: () => false,
				selectCard: -1,
				log: false,
			},
			used: { charlotte: true },
		},
	},
	pslongxin: {
		trigger: { player: "phaseJudgeBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("j") && player.countCards("h");
		},
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt2("pslongxin"), { type: "equip" }, "he")
				.set("logSkill", "pslongxin")
				.set("ai", card => {
					if (_status.event.goon) {
						return 15 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					player.hasCard(card => {
						var cardj = card.viewAs ? { name: card.viewAs } : card;
						return get.effect(player, cardj, player, player) < 0;
					}, "j")
				);
			"step 1";
			if (result.bool) {
				player.discardPlayerCard(player, "j", true);
			}
		},
	},
	//官盗S周瑜·一版
	psoldshiyin: {
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		frequent: true,
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			return event.getg(player).filter(i => get.owner(i) == player).length > 0;
		},
		content() {
			"step 0";
			player.showCards(
				trigger.getg(player).filter(i => get.owner(i) == player),
				get.translation(player) + "发动了【识音】"
			);
			"step 1";
			var suits = [],
				cards = trigger.getg(player).filter(i => get.owner(i) == player);
			for (var card of cards) {
				suits.add(get.suit(card, player));
			}
			player.addTempSkill("psoldshiyin_effect");
			if (!player.storage.psoldshiyin_effect) {
				player.storage.psoldshiyin_effect = 0;
			}
			player.storage.psoldshiyin_effect = Math.max(player.storage.psoldshiyin_effect, suits.length);
			if (suits.length >= 2) {
				player.addMark("psoldshiyin_damage", 1, false);
			}
		},
		subSkill: {
			effect: {
				trigger: { player: "useCard" },
				charlotte: true,
				forced: true,
				onremove: ["psoldshiyin_effect", "psoldshiyin_damage"],
				content() {
					var num = player.countMark("psoldshiyin_effect");
					if (num >= 1) {
						trigger.directHit.addArray(game.players);
					}
					if (num >= 2 && get.tag(trigger.card, "damage")) {
						trigger.baseDamage += player.countMark("psoldshiyin_damage");
					}
					if (num >= 3) {
						player.draw();
					}
					player.removeSkill("psoldshiyin_effect");
				},
				mod: {
					aiOrder(player, card, num) {
						var numx = player.countMark("psoldshiyin_effect");
						if (numx >= 2 && get.tag(card, "damage")) {
							return num + 10;
						}
					},
				},
			},
		},
	},
	//官盗S周瑜·二版
	psshiyin: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		direct: true,
		group: "psshiyin_change",
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content() {
			"step 0";
			player.chooseCard(get.prompt("psshiyin"), "将一张手牌置于武将牌上，称为“杂音”牌").set("ai", card => 20 - get.value(card));
			"step 1";
			if (result.bool) {
				player.logSkill("psshiyin");
				player.addToExpansion(result.cards, player, "give").gaintag.add("psshiyin");
			}
		},
		marktext: "音",
		intro: {
			name: "杂音",
			name2: "杂音",
			content: "expansion",
			markcount: "expansion",
		},
		subSkill: {
			change: {
				trigger: { player: "phaseUseBegin" },
				direct: true,
				filter(event, player) {
					return player.getExpansions("psshiyin").length && player.countCards("h");
				},
				content() {
					"step 0";
					var card = player.getExpansions("psshiyin")[0];
					player
						.chooseCard(get.prompt("psshiyin"), "用一张手牌替换“杂音”牌（" + get.translation(card) + "）")
						.set("ai", card => {
							if (_status.event.suit && get.suit(card) == _status.event.suit) {
								return 8 - get.value(card);
							}
							return 0;
						})
						.set(
							"suit",
							(function () {
								var suits = lib.suit
									.slice()
									.map(i => [i, (get.suit(card) == i ? 1 : 0) + player.countCards("h", { suit: i })])
									.filter(i => i[1] > 0);
								suits.sort((a, b) => a[1] - b[1]);
								if (suits.length > 0) {
									return suits[0][0];
								}
								return null;
							})()
						);
					"step 1";
					if (result.bool) {
						player.logSkill("psshiyin");
						player.addToExpansion(result.cards[0], "give", player).gaintag.add("psshiyin");
						var card = player.getExpansions("psshiyin")[0];
						if (card) {
							player.gain(card, "gain2");
						}
					}
				},
			},
		},
		ai: {
			combo: "psliaozou",
		},
	},
	psquwu: {
		forced: true,
		trigger: { target: "useCardToBefore" },
		filter(event, player) {
			return player.getExpansions("psshiyin").length && get.suit(player.getExpansions("psshiyin")[0]) == get.suit(event.card);
		},
		content() {
			trigger.cancel();
		},
		ai: {
			threaten: 1.1,
			combo: "psshiyin",
			effect: {
				target(card, player, target, current) {
					var list = target.getExpansions("psshiyin");
					for (var cardx of list) {
						if (get.suit(cardx) == get.suit(card)) {
							return "zeroplayertarget";
						}
					}
				},
			},
		},
		mod: {
			cardEnabled2(card, player) {
				var list = player.getExpansions("psshiyin");
				for (var cardx of list) {
					if (get.suit(cardx) == get.suit(card)) {
						return false;
					}
				}
			},
			cardRespondable(card, player) {
				var list = player.getExpansions("psshiyin");
				for (var cardx of list) {
					if (get.suit(cardx) == get.suit(card)) {
						return false;
					}
				}
			},
			cardSavable(card, player) {
				var list = player.getExpansions("psshiyin");
				for (var cardx of list) {
					if (get.suit(cardx) == get.suit(card)) {
						return false;
					}
				}
			},
		},
	},
	psliaozou: {
		enable: "phaseUse",
		locked: false,
		filter(event, player) {
			return !player.hasSkill("psliaozou_blocker", null, null, false) && player.getExpansions("psshiyin").length > 0;
		},
		content() {
			"step 0";
			player.showHandcards(get.translation(player) + "发动了【聊奏】");
			"step 1";
			var cards = player.getExpansions("psshiyin"),
				bool = true;
			for (var card of cards) {
				var suit = get.suit(card);
				if (player.hasCard(cardx => get.suit(cardx) == suit)) {
					bool = false;
					break;
				}
			}
			if (bool) {
				player.draw();
			} else {
				player.addTempSkill("psliaozou_blocker", {
					player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
				});
			}
		},
		subSkill: {
			blocker: { charlotte: true },
		},
		mod: {
			aiValue(player, card, num) {
				var suit = get.suit(card);
				if (player.isPhaseUsing() && player.getExpansions("psshiyin").some(i => get.suit(i) == suit)) {
					return num / 5;
				}
			},
			aiUseful() {
				return lib.skill.psliaozou.mod.aiValue.apply(this, arguments);
			},
		},
		ai: {
			combo: "psshiyin",
			order: 9.9,
			result: {
				player(player) {
					var cards = player.getExpansions("psshiyin"),
						bool = true;
					for (var card of cards) {
						var suit = get.suit(card);
						if (player.hasCard(cardx => get.suit(cardx) == suit)) {
							return 0;
						}
					}
					return 1;
				},
			},
		},
	},
	//官盗S武将传晋司马
	psquanyi: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		group: "psquanyi_tianbian",
		content() {
			"step 0";
			player.chooseToCompare(target, function (card) {
				if (typeof card == "string" && lib.skill[card]) {
					var ais =
						lib.skill[card].check ||
						function () {
							return 0;
						};
					return ais();
				}
				var player = get.owner(card);
				var getn = function (card) {
					if (player.hasSkill("tianbian") && get.suit(card) == "heart") {
						return 13;
					}
					return get.number(card);
				};
				var event = _status.event.getParent();
				var to = player == event.player ? event.target : event.player;
				var addi = get.value(card) >= 8 && get.type(card) != "equip" ? -6 : 0;
				if (card.name == "du") {
					addi -= 5;
				}
				if (get.color(card) == "black") {
					addi -= 6;
				}
				if (player == event.player) {
					if (event.small) {
						return -getn(card) - get.value(card) / 2 + addi;
					}
					return getn(card) - get.value(card) / 2 + addi;
				} else {
					if (get.attitude(player, to) <= 0 == Boolean(event.small)) {
						return -getn(card) - get.value(card) / 2 + addi;
					}
					return getn(card) - get.value(card) / 2 + addi;
				}
			});
			"step 1";
			if (result.tie) {
				event.finish();
			} else {
				var targets = [player, target];
				if (!result.bool) {
					targets.reverse();
				}
				var suits = [result.player, result.target].map(i => get.suit(i, false));
				event.targets = targets;
				event.suits = suits;
			}
			"step 2";
			if (event.suits.includes("heart")) {
				if (targets[1].countGainableCards("hej", targets[0]) > 0) {
					targets[0].gainPlayerCard(targets[1], "hej", true);
				}
			}
			"step 3";
			if (event.suits.includes("diamond")) {
				targets[1].damage(targets[0]);
			}
			"step 4";
			if (event.suits.includes("spade")) {
				targets[0].loseHp();
			}
			"step 5";
			if (event.suits.includes("club")) {
				if (targets[0].countDiscardableCards(targets[0], "he")) {
					targets[0].chooseToDiscard(2, true, "he");
				}
			}
		},
		ai: {
			order: 6,
			result: {
				target: -1,
			},
		},
		subSkill: {
			tianbian: {
				audio: "psquanyi",
				enable: "chooseCard",
				check(event) {
					var player = _status.event.player;
					if (player.hasSkill("smyyingshi")) {
						var card = ui.cardPile.childNodes[0];
						if ((get.color(card) == "black" && get.number(card) <= 4) || (get.color(card) == "red" && get.number(card) >= 11)) {
							return 20;
						}
					}
					return !player.hasCard(function (card) {
						var val = get.value(card);
						return val < 0 || (get.color(card) == "black" && val <= 4) || (get.color(card) == "red" && get.number(card) >= 11);
					}, "h")
						? 20
						: 0;
				},
				filter(event) {
					return event.type == "compare" && !event.directresult;
				},
				onCompare(player) {
					return game.cardsGotoOrdering(get.cards()).cards;
				},
			},
		},
	},
	//官盗S曹植
	psliushang: {
		trigger: { player: "phaseDrawBegin1" },
		forced: true,
		filter(event, player) {
			return !event.numFixed;
		},
		group: "psliushang_give",
		content() {
			"step 0";
			trigger.changeToZero();
			player.draw(1 + Math.max(3, game.countPlayer()));
			event.targets = game.filterPlayer(i => i != player);
			"step 1";
			var current = targets.shift();
			if (!player.countCards("h")) {
				event.finish();
			} else {
				player.chooseCardTarget({
					prompt: "流殇：将一张牌置于" + get.translation(current) + "武将牌上",
					current: current,
					filterCard: true,
					forced: true,
					filterTarget(card, player, target) {
						return target == _status.event.current;
					},
					selectTarget: -1,
					ai1(card) {
						var current = _status.event.current;
						return get.value(card, current) * get.attitude(_status.event.player, current);
					},
					ai2: () => 1,
				});
			}
			"step 2";
			if (result.bool) {
				result.targets[0].addToExpansion(result.cards, player, "give").gaintag.add("psliushang");
			}
			if (targets.length) {
				event.goto(1);
			}
		},
		marktext: "殇",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		subSkill: {
			give: {
				trigger: { global: "phaseZhunbeiBegin" },
				filter(event, player) {
					return event.player != player && event.player.getExpansions("psliushang").length;
				},
				forced: true,
				logTarget: "player",
				content() {
					"step 0";
					var cards = trigger.player.getExpansions("psliushang"),
						name = get.translation(cards);
					event.cards = cards;
					trigger.player
						.chooseControl()
						.set("choiceList", ["获得" + name + "，且于本回合防止对" + get.translation(player) + "的伤害", "将" + name + "置入弃牌堆"])
						.set("ai", () => {
							return _status.event.choice;
						})
						.set(
							"choice",
							(function () {
								if (get.damageEffect(player, trigger.player, trigger.player) <= 0) {
									return 0;
								}
								if (get.value(cards, trigger.player) < 0) {
									return 1;
								}
								if (
									trigger.player.hasCard(card => {
										return get.tag(card, "damage") && trigger.player.canUse(card, player) && get.effect(player, card, trigger.player, trigger.player) > 0;
									}, "hs")
								) {
									return 1;
								}
								return 0;
							})()
						);
					"step 1";
					if (result.index == 0) {
						trigger.player.gain(cards, "gain2");
						trigger.player.addTempSkill("psliushang_prevent");
						trigger.player.markAuto("psliushang_prevent", [player]);
					} else {
						trigger.player.loseToDiscardpile(cards);
					}
					"step 2";
					game.delayx();
				},
			},
			prevent: {
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					return player.getStorage("psliushang_prevent").includes(event.player);
				},
				forced: true,
				onremove: true,
				charlotte: true,
				logTarget: "player",
				content() {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (player.getStorage("psliushang_prevent").includes(target) && get.tag(card, "damage")) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	psqibu: {
		trigger: { player: "dying" },
		filter(event, player) {
			return player.hp <= 0;
		},
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		content() {
			"step 0";
			player.awakenSkill(event.name);
			var cards = game.cardsGotoOrdering(get.cards(7)).cards;
			game.updateRoundNumber();
			event.cards = cards;
			player.showCards(cards, get.translation(player) + "发动了【流殇】");
			"step 1";
			var num = cards.filter(i => get.suit(i) == "heart").length;
			var gains = cards.filter(i => get.suit(i) == "club");
			if (num > 0) {
				player.recover(num);
			}
			if (gains.length) {
				player.gain(gains, "gain2");
			}
		},
	},
	//官盗S曹丕
	psjianwei: {
		trigger: { player: "phaseBegin" },
		skillAnimation: true,
		animationColor: "water",
		limited: true,
		direct: true,
		filter(event, player) {
			return player.hp >= 1;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("psjianwei"), lib.filter.notMe).set("ai", target => {
				var player = _status.event.player;
				if (player.hp == 1 && !player.canSave(player)) {
					return 0;
				}
				var sgn = get.sgnAttitude(player, target);
				var valMine = [0, 0],
					valHis = [0, 0];
				player.getCards("hej", card => {
					if (get.position(card) == "j") {
						valMine[0] += get.effect(player, card, player);
						valMine[1] += get.effect(target, card, player);
					} else {
						valMine[0] += get.value(card, player);
						valMine[1] += get.value(card, target) * sgn;
					}
				});
				target.getCards("hej", card => {
					if (get.position(card) == "j") {
						valHis[0] += get.effect(player, card, player);
						valHis[1] += get.effect(target, card, player);
					} else {
						valHis[0] += get.value(card, player);
						valHis[1] += get.value(card, target) * sgn;
					}
				});
				return valMine[1] - valMine[0] + valHis[0] - valHis[1] >= 60;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("psjianwei", target);
				player.awakenSkill(event.name);
				player.loseHp();
			} else {
				event.finish();
			}
			"step 2";
			if (player.isIn() && target.isIn()) {
				var next = game.createEvent("psjianwei_swap");
				next.player = player;
				next.target = target;
				next.set("cards1", player.getCards("hej"));
				next.set("cards2", target.getCards("hej"));
				next.setContent(lib.skill.psjianwei.swapRegioncards);
			}
		},
		swapRegioncards() {
			"step 0";
			player.$giveAuto(event.cards1, target);
			target.$giveAuto(event.cards2, player);
			"step 1";
			event.h1 = event.cards1.filter(i => get.position(i) == "h");
			event.e1 = event.cards1.filter(i => get.position(i) == "e");
			event.j1 = event.cards1.filter(i => get.position(i) == "j");
			event.h2 = event.cards2.filter(i => get.position(i) == "h");
			event.e2 = event.cards2.filter(i => get.position(i) == "e");
			event.j2 = event.cards2.filter(i => get.position(i) == "j");
			game.loseAsync({
				lose_list: [
					[player, event.cards1],
					[target, event.cards2],
				],
			}).setContent("chooseToCompareLose");
			"step 2";
			var todis = [];
			for (var i = 0; i < event.j1.length; i++) {
				if (target.isDisabledJudge() || target.hasJudge(event.j1[i].viewAs || event.j1[i].name)) {
					todis.push(event.j1[i]);
				}
			}
			for (var i = 0; i < event.j2.length; i++) {
				if (player.isDisabledJudge() || player.hasJudge(event.j2[i].viewAs || event.j2[i].name)) {
					todis.push(event.j2[i]);
				}
			}
			if (todis.length) {
				game.cardsDiscard(todis);
			}
			"step 3";
			game.loseAsync({
				gain_list: [
					[player, event.h2.filter(i => get.position(i, true) == "o")],
					[target, event.h1.filter(i => get.position(i, true) == "o")],
				],
			}).setContent("gaincardMultiple");
			for (var i = 0; i < event.e2.length; i++) {
				if (get.position(event.e2[i], true) == "o") {
					player.equip(event.e2[i]);
				}
			}
			for (var i = 0; i < event.e1.length; i++) {
				if (get.position(event.e1[i], true) == "o") {
					target.equip(event.e1[i]);
				}
			}
			for (var i = 0; i < event.j2.length; i++) {
				if (get.position(event.j2[i], true) == "o") {
					player.addJudge(event.j2[i]);
				}
			}
			for (var i = 0; i < event.j1.length; i++) {
				if (get.position(event.j1[i], true) == "o") {
					target.addJudge(event.j1[i]);
				}
			}
			"step 4";
			game.delayx();
		},
	},
	//官盗S司马懿
	pszhonghu: {
		trigger: { global: "dieAfter" },
		global: "pszhonghu_skip",
		filter(event, player) {
			return player != _status.currentPhase;
		},
		content() {
			"step 0";
			const evt = trigger.getParent("phaseUse");
			if (evt && evt.name == "phaseUse") {
				evt.skipped = true;
			}
			const evtx = trigger.getParent("phase");
			if (evtx) {
				game.log(evtx.player, "结束了回合");
				evtx.num = evtx.phaseList.length;
				evtx.goto(11);
			}
			_status._pszhonghu = player;
		},
		subSkill: {
			skip: {
				trigger: { player: "phaseBeforeStart" },
				forced: true,
				priority: Infinity,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if ((_status._pszhonghu && !_status._pszhonghu.isIn()) || event.player == _status._pszhonghu) {
						delete _status._pszhonghu;
					}
					return _status._pszhonghu && event.player != _status._pszhonghu;
				},
				content() {
					trigger.cancel(null, null, "notrigger");
				},
			},
		},
	},
	//官盗S虎啸龙吟司马懿&诸葛亮
	pshuxiao: {
		trigger: { player: "phaseBegin" },
		frequent: true,
		content() {
			"step 0";
			player.judge(function (card) {
				if (get.type(card) == "basic" || get.type(card) == "trick") {
					return 3;
				}
				return -1;
			});
			"step 1";
			if (result.bool) {
				player.addTempSkill("pshuxiao_use");
				player.storage.pshuxiao_use = {
					card: { name: result.name, nature: result.card.nature },
					number: result.number,
					suit: result.suit,
				};
			}
		},
		subSkill: {
			use: {
				charlotte: true,
				onremove: true,
				enable: "chooseToUse",
				popname: true,
				position: "hs",
				hiddenCard(player, name) {
					return player.storage.pshuxiao_use.card.name == name;
				},
				filter(event, player) {
					if (!player.storage.pshuxiao_use) {
						return false;
					}
					if (!player.countCards("h")) {
						return false;
					}
					return event.filterCard(player.storage.pshuxiao_use.card, player, event);
				},
				viewAs(cards, player) {
					return player.storage.pshuxiao_use.card;
				},
				filterCard(card, player) {
					return get.number(card) == player.storage.pshuxiao_use.number || get.suit(card) == player.storage.pshuxiao_use.suit;
				},
				prompt(event) {
					var player = _status.event.player;
					return "将一张" + get.translation(player.storage.pshuxiao_use.suit) + "牌或点数为" + get.strNumber(player.storage.pshuxiao_use.number) + "的牌当作" + get.translation(player.storage.pshuxiao_use.card) + "使用";
				},
			},
		},
	},
	psguanxing: {
		audio: "guanxing",
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		preHidden: true,
		async content(event, trigger, player) {
			const result = await player.chooseToGuanxing(5).set("prompt", "观星：点击或拖动将牌移动到牌堆顶或牌堆底").forResult();
			if (!result.bool || !result.moved[0].length) {
				player.addTempSkill("guanxing_fail");
			}
		},
		ai: {
			threaten: 1.2,
			guanxing: true,
		},
	},
	pslongyin: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countCards("hse") || player.hasSkill("pslongyin_used")) {
				return false;
			}
			for (var i of lib.inpile) {
				var type = get.type(i);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard({ name: name }, player, event)) {
							list.push(["基本", "", "sha"]);
						}
						for (var j of lib.inpile_nature) {
							if (event.filterCard({ name: name, nature: j }, player, event)) {
								list.push(["基本", "", "sha", j]);
							}
						}
					} else if (get.type(name) == "trick" && event.filterCard({ name: name }, player, event)) {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) == "basic" && event.filterCard({ name: name }, player, event)) {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("虎啸", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				var player = _status.event.player;
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) {
					return 0;
				}
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					filterCard(card, player) {
						var num = 0;
						for (var i = 0; i < ui.selected.cards.length; i++) {
							num += get.number(ui.selected.cards[i]);
						}
						return get.number(card) + num <= 13;
					},
					selectCard: [1, Infinity],
					filterOk() {
						var num = 0;
						for (var i = 0; i < ui.selected.cards.length; i++) {
							num += get.number(ui.selected.cards[i]);
						}
						return num == 13;
					},
					audio: "pslongyin",
					popname: true,
					complexCard: true,
					check(card) {
						var num = 0;
						for (var i = 0; i < ui.selected.cards.length; i++) {
							num += get.number(ui.selected.cards[i]);
						}
						if (num + get.number(card) == 13) {
							return 5.5 - get.value(card);
						}
						if (ui.selected.cards.length == 0) {
							var cards = _status.event.player.getCards("h");
							for (var i = 0; i < cards.length; i++) {
								for (var j = i + 1; j < cards.length; j++) {
									if (get.number(cards[i]) + get.number(cards[j]) == 13) {
										if (cards[i] == card || cards[j] == card) {
											return 6 - get.value(card);
										}
									}
								}
							}
						}
						return 0;
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.addTempSkill("pslongyin_used");
					},
				};
			},
			prompt(links, player) {
				return "将任意张点数和为13牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			var type = get.type(name);
			return (type == "basic" || type == "trick") && player.countCards("she") > 0 && !player.hasSkill("pslongyin_used");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countCards("hse") || player.hasSkill("pslongyin_used")) {
					return false;
				}
			},
			order: 1,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		subSkill: {
			used: { charlotte: true },
		},
	},
	//官盗S武将传诸葛亮
	pszhiji: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			if (!ui.selected.targets.length) {
				return true;
			}
			return target.group != ui.selected.targets[0].group;
		},
		selectTarget: 2,
		complexTarget: true,
		multitarget: true,
		multiline: true,
		filterCard: true,
		selectCard: 2,
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			targets.sortBySeat();
			if (targets[0].canUse("sha", targets[1], false)) {
				targets[0].useCard({ name: "sha", isCard: true }, targets[1], false, "noai");
			}
			"step 1";
			if (targets[1].canUse("sha", targets[0], false)) {
				targets[1].useCard({ name: "sha", isCard: true }, targets[0], false, "noai");
			}
		},
		ai: {
			order: 2.5,
			result: {
				player: 1,
				target(player, target) {
					if (ui.selected.targets.length) {
						var targetx = ui.selected.targets[0];
						if (get.effect(targetx, { name: "sha" }, target, player) + get.effect(target, { name: "sha" }, targetx, player) < 0) {
							return 0;
						}
						return -1;
					}
					return -1;
				},
			},
		},
	},
	psjiefeng: {
		enable: "phaseUse",
		filterCard: true,
		selectCard: 2,
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			var cards = game.cardsGotoOrdering(get.cards(5)).cards;
			event.cards = cards;
			player.showCards(cards, get.translation(player) + "发动了【借风】");
			"step 1";
			if (cards.filter(i => get.color(i) == "red").length >= 2) {
				player.chooseUseTarget("wanjian", true);
			}
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (player.getUseValue({ name: "wanjian" }) < 0) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	//官盗S马超
	psweihou: {
		trigger: { player: "judgeBegin" },
		filter(event, player) {
			return !event.directresult;
		},
		content() {
			"step 0";
			var cards = get.cards(2, true);
			event.cards = cards;
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					var str;
					if (player == game.me && !_status.auto) {
						str = "威侯：选择一张作为本次判定结果";
					} else {
						str = get.translation(player) + "发动了【威侯】";
					}
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			game.addVideo("showCards", player, ["威侯", get.cardsInfo(event.cards)]);
			if (!event.isMine() && !event.isOnline()) {
				game.delayx();
			}
			"step 1";
			player
				.chooseButton(["威侯：选择一张作为本次判定结果", cards], true)
				.set("ai", button => {
					return _status.event.getTrigger().judge(button.link);
				})
				.set("dialog", event.videoId);
			"step 2";
			game.broadcastAll("closeDialog", event.videoId);
			if (result.bool) {
				trigger.directresult = result.links[0];
				game.cardsDiscard(cards.removeArray(result.links).filter(i => get.position(i) == "c"));
			}
			"step 3";
			game.updateRoundNumber();
		},
	},
	//官盗S1066★贾诩
	psqupo: {
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return player.countCards("he") && game.countPlayer() > 2;
		},
		async cost(event, trigger, player) {
			const cards = player.getCards("he");
			const { player: current } = trigger;
			const targets = game.filterPlayer(currentx => {
				if (currentx == current || current == player) {
					return false;
				}
				return !current.canUse("sha", currentx) || (get.effect(currentx, { name: "sha" }, current, player) > 0 && get.attitude(player, currentx) > -3);
			});
			const targets2 = game.filterPlayer(currentx => {
				if (currentx == current || current == player) {
					return false;
				}
				return current.hasCard(card => current.canUse(card, currentx) && get.effect(currentx, card, current, player) > 0 && get.color(card) == "red" && get.tag(card, "damage") && get.type(card) != "delay", "hs");
			});
			event.result = await player
				.chooseCardTarget({
					filterCard: true,
					position: "he",
					prompt: get.prompt2(event.skill),
					current: current,
					targets1: targets,
					targets2: targets2,
					filterTarget(card, player, target) {
						return player != target && target != get.event().current;
					},
					ai1(card) {
						const { player, current, targets1, targets2 } = get.event();
						const color = get.color(card);
						if (!targets2.length) {
							if (get.effect(current, { name: "losehp" }, player, player) < 0) {
								return 0;
							}
							if (color != "black" || !targets1.length) {
								return 0;
							}
							return 5.5 - get.value(card);
						}
						targets2.sort((a, b) => get.threaten(b, current) - get.threaten(a, current));
						if (!targets1.length) {
							if (color != "red") {
								return 0;
							}
							if (get.attitude(player, current) <= 0) {
								return 0;
							}
							return 5.5 - get.value(card);
						}
						const target = targets2[0];
						const color1 = get.effect(current, { name: "losehp" }, player, player) > Math.max(0, get.effect(target, { name: "losehp" }, player, player)) ? "black" : "red";
						if (color !== color1) {
							return 0;
						}
						return 6 - get.value(card);
					},
					ai2(target) {
						if (!ui.selected.cards.length) {
							return 0;
						}
						const { player, current, targets1, targets2 } = get.event();
						const color = get.color(ui.selected.cards[0]);
						if (!["red", "black"].includes(color)) {
							return 0;
						}
						if (color == "black") {
							if (!targets1.includes(target)) {
								return 0;
							}
							return get.attitude(player, target) + 0.1;
						}
						if (!targets2.includes(target)) {
							return 0;
						}
						return get.effect(target, { name: "losehp" }, player, player);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			await player.give(cards, target);
			const color = get.color(cards[0]);
			const skill = event.name + "_" + color;
			if (color == "black") {
				trigger.player.addTempSkill(skill);
				trigger.player.markAuto(skill, [target]);
			} else if (color == "red") {
				target.addTempSkill(skill);
				target.addMark(skill, 1, false);
			}
		},
		subSkill: {
			black: {
				trigger: { player: "useCardToPlayer" },
				charlotte: true,
				onremove: true,
				forced: true,
				popup: false,
				filter(event, player) {
					if (event.card.name != "sha") {
						return false;
					}
					return !player.getStorage("psqupo_black").includes(event.target);
				},
				content() {
					player.loseHp();
				},
				intro: { content: "本回合使用【杀】指定不为$的目标时失去1点体力" },
			},
			red: {
				trigger: { player: "damageBegin3" },
				charlotte: true,
				onremove: true,
				forced: true,
				popup: false,
				content() {
					player.loseHp(player.countMark(event.name));
					player.removeSkill(event.name);
				},
				intro: { content: "本回合下一次受到伤害时失去#点体力" },
			},
		},
	},
	psbaoquan: {
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return player.countCards("h", { type: ["trick", "delay"] }) || _status.connectMode;
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt2("psbaoquan"), { type: ["trick", "delay"] })
				.set("logSkill", "psbaoquan")
				.set("ai", card => {
					if (_status.event.goon) {
						return 7 - get.value(card);
					}
					return 0;
				})
				.set("goon", get.damageEffect(player, trigger.source, player) < -5);
			"step 1";
			if (result.bool) {
				trigger.cancel();
			}
		},
	},
	//官盗S吕布
	pssheji: {
		enable: "phaseUse",
		filterCard: true,
		selectCard: -1,
		position: "h",
		locked: false,
		filter(event, player) {
			if (player.hasSkill("pssheji_used")) {
				return false;
			}
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (var card of hs) {
				var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
				if (mod2 === false) {
					return false;
				}
			}
			return event.filterCard(get.autoViewAs({ name: "sha" }, hs));
		},
		viewAs: {
			name: "sha",
			storage: { pssheji: true },
		},
		onuse(links, player) {
			player.addTempSkill("pssheji_used", "phaseUseAfter");
		},
		ai: {
			order: 1,
			threaten: 1.1,
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.storage && card.storage.pssheji) {
					return true;
				}
			},
		},
		subSkill: {
			used: {
				audio: "pssheji",
				trigger: { source: "damageSource" },
				charlotte: true,
				forced: true,
				popup: false,
				logTarget: "player",
				filter(event, player) {
					return (
						event.card.storage &&
						event.card.storage.pssheji &&
						event.player.hasCard(card => {
							if (!lib.filter.canBeGained(card, player, event.player)) {
								return false;
							}
							return ["equip1", "equip3", "equip4", "equip6"].includes(get.subtype(card));
						}, "e")
					);
				},
				content() {
					var cards = trigger.player.getCards("e", card => {
						if (!lib.filter.canBeGained(card, player, trigger.player)) {
							return false;
						}
						return ["equip1", "equip3", "equip4", "equip6"].includes(get.subtype(card));
					});
					if (cards.length) {
						player.gain(cards, "giveAuto", trigger.player);
					}
				},
			},
		},
	},
	//龙羽飞
	longyi: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (event.type == "wuxie") {
				return false;
			}
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (var i of hs) {
				if (game.checkMod(i, player, "unchanged", "cardEnabled2", player) === false) {
					return false;
				}
			}
			for (var i of lib.inpile) {
				if (i != "du" && get.type(i) == "basic" && event.filterCard({ name: i, cards: hs }, player, event)) {
					return true;
				}
				if (i == "sha") {
					var list = ["fire", "thunder", "ice"];
					for (var j of list) {
						if (event.filterCard({ name: i, nature: j, cards: hs }, player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var vcards = [],
					hs = player.getCards("h");
				for (var i of lib.inpile) {
					if (i != "du" && get.type(i) == "basic" && event.filterCard({ name: i, cards: hs }, player, event)) {
						vcards.push(["基本", "", i]);
					}
					if (i == "sha") {
						for (var j of lib.inpile_nature) {
							if (event.filterCard({ name: i, nature: j, cards: hs }, player, event)) {
								vcards.push(["基本", "", i, j]);
							}
						}
					}
				}
				return ui.create.dialog("龙裔", [vcards, "vcard"]);
			},
			check(button, player) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				return _status.event.player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "longyi",
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3] },
					filterCard: true,
					selectCard: -1,
					position: "h",
				};
			},
			prompt(links, player) {
				return "将所有手牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用或打出";
			},
		},
		hiddenCard(player, name) {
			return name != "du" && get.type(name) == "basic" && player.countCards("h") > 0;
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				return player.countCards("h") > 0;
			},
			order: 0.5,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					if (_status.event.type == "respondShan") {
						return 1;
					}
					var val = 0,
						hs = player.getCards("h"),
						max = 0;
					for (var i of hs) {
						val += get.value(i, player);
						if (get.type(i, null, player) == "trick") {
							max += 5;
						}
					}
					if (player.hasSkill("zhenjue")) {
						max += 7;
					}
					return val <= max ? 1 : 0;
				},
			},
		},
		group: "longyi_effect",
		subSkill: {
			effect: {
				trigger: { player: ["useCard", "respond"] },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					if (event.skill != "longyi_backup") {
						return false;
					}
					for (var i of event.cards) {
						var type = get.type2(i, player);
						if (type == "equip" || type == "trick") {
							return true;
						}
					}
					return false;
				},
				content() {
					var map = {};
					for (var i of trigger.cards) {
						map[get.type2(i, player)] = true;
					}
					if (map.trick) {
						player.draw();
					}
					if (map.equip && trigger.directHit) {
						trigger.directHit.addArray(game.players);
					}
				},
			},
			backup: {},
		},
	},
	zhenjue: {
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h") == 0;
		},
		logTarget: "player",
		content() {
			"step 0";
			trigger.player
				.chooseToDiscard("he", "弃置一张牌，或令" + get.translation(player) + "摸一张牌")
				.set("ai", function (card) {
					if (_status.event.goon) {
						return 7 - get.value(card);
					}
					return -get.value(card);
				})
				.set("goon", get.attitude(trigger.player, player) < 0);
			"step 1";
			if (!result.bool) {
				player.draw();
			}
		},
	},
	//群刘备
	jsprende: {
		audio: "rerende",
		enable: "phaseUse",
		filterCard: true,
		selectCard: [1, Infinity],
		allowChooseAll: true,
		discard: false,
		lose: false,
		delay: false,
		filterTarget(card, player, target) {
			return player != target;
		},
		onremove: true,
		check(card) {
			if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
				return 0;
			}
			if (!ui.selected.cards.length && card.name == "du") {
				return 20;
			}
			var player = get.owner(card);
			if (ui.selected.cards.length >= Math.max(2, player.countCards("h") - player.hp)) {
				return 0;
			}
			if (player.hp == player.maxHp || player.storage.jsprende < 0 || player.countCards("h") <= 1) {
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i].hasSkill("haoshi") && !players[i].isTurnedOver() && !players[i].hasJudge("lebu") && get.attitude(player, players[i]) >= 3 && get.attitude(players[i], player) >= 3) {
						return 11 - get.value(card);
					}
				}
				if (player.countCards("h") > player.hp) {
					return 10 - get.value(card);
				}
				if (player.countCards("h") > 2) {
					return 6 - get.value(card);
				}
				return -1;
			}
			return 10 - get.value(card);
		},
		content() {
			"step 0";
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name == "phaseUse" && !evt.jsprende) {
				var next = game.createEvent("jsprende_clear");
				_status.event.next.remove(next);
				evt.after.push(next);
				evt.jsprende = true;
				next.player = player;
				next.setContent(function () {
					delete player.storage.jsprende;
				});
			}
			player.give(cards, target);
			if (typeof player.storage.jsprende != "number") {
				player.storage.jsprende = 0;
			}
			if (player.storage.jsprende >= 0) {
				player.storage.jsprende += cards.length;
				if (player.storage.jsprende >= 2) {
					var list = [];
					if (
						lib.filter.cardUsable({ name: "sha", isCard: true }, player, event.getParent("chooseToUse")) &&
						game.hasPlayer(function (current) {
							return player.canUse("sha", current);
						})
					) {
						list.push(["基本", "", "sha"]);
					}
					for (var i of lib.inpile_nature) {
						if (
							lib.filter.cardUsable({ name: "sha", nature: i, isCard: true }, player, event.getParent("chooseToUse")) &&
							game.hasPlayer(function (current) {
								return player.canUse({ name: "sha", nature: i, isCard: true }, current);
							})
						) {
							list.push(["基本", "", "sha", i]);
						}
					}
					if (
						lib.filter.cardUsable({ name: "tao", isCard: true }, player, event.getParent("chooseToUse")) &&
						game.hasPlayer(function (current) {
							return player.canUse("tao", current);
						})
					) {
						list.push(["基本", "", "tao"]);
					}
					if (
						lib.filter.cardUsable({ name: "jiu", isCard: true }, player, event.getParent("chooseToUse")) &&
						game.hasPlayer(function (current) {
							return player.canUse("jiu", current);
						})
					) {
						list.push(["基本", "", "jiu"]);
					}
					if (list.length) {
						player.chooseButton(["是否视为使用一张基本牌？", [list, "vcard"]]).set("ai", function (button) {
							var player = _status.event.player;
							var card = {
								name: button.link[2],
								nature: button.link[3],
								isCard: true,
							};
							if (card.name == "tao") {
								if (player.hp == 1 || (player.hp == 2 && !player.hasShan("all")) || player.needsToDiscard()) {
									return 5;
								}
								return 1;
							}
							if (card.name == "sha") {
								if (
									game.hasPlayer(function (current) {
										return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
									})
								) {
									if (card.nature == "fire") {
										return 2.95;
									}
									if (card.nature == "thunder" || card.nature == "ice") {
										return 2.92;
									}
									return 2.9;
								}
								return 0;
							}
							if (card.name == "jiu") {
								return 0.5;
							}
							return 0;
						});
					} else {
						event.finish();
					}
					player.storage.jsprende = -1;
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 1";
			if (result && result.bool && result.links[0]) {
				var card = { name: result.links[0][2], nature: result.links[0][3], isCard: true };
				player.chooseUseTarget(card, true);
			}
		},
		ai: {
			fireAttack: true,
			order(skill, player) {
				if (player.hp < player.maxHp && player.storage.jsprende < 2 && player.countCards("h") > 1) {
					return 10;
				}
				return 4;
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						if (target.hasSkillTag("nodu")) {
							return 0;
						}
						return -10;
					}
					if (target.hasJudge("lebu")) {
						return 0;
					}
					var nh = target.countCards("h");
					var np = player.countCards("h");
					if (player.hp == player.maxHp || player.storage.jsprende < 0 || player.countCards("h") <= 1) {
						if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) {
							return 0;
						}
					}
					return Math.max(1, 5 - nh);
				},
			},
			effect: {
				target_use(card, player, target) {
					if (player == target && get.type(card) == "equip") {
						if (player.countCards("e", { subtype: get.subtype(card) })) {
							if (
								game.hasPlayer(function (current) {
									return current != player && get.attitude(player, current) > 0;
								})
							) {
								return 0;
							}
						}
					}
				},
			},
			threaten: 0.8,
		},
	},
	//S贾诩
	nsyice: {
		trigger: {
			player: "loseAfter",
			global: ["cardsDiscardAfter", "loseAsyncAfter"],
		},
		filter(event, player) {
			if (event.name != "cardsDiscard") {
				if (event.type != "discard") {
					return false;
				}
				var evt = event.getl(player);
				return evt.cards2 && evt.cards2.filterInD("d").length > 0;
			} else {
				var evt = event.getParent();
				if (evt.name != "orderingDiscard" || !evt.relatedEvent || evt.relatedEvent.player != player || !["useCard", "respond"].includes(evt.relatedEvent.name)) {
					return false;
				}
				return event.cards.filterInD("d").length > 0;
			}
		},
		forced: true,
		content() {
			"step 0";
			var evt = trigger.getParent().relatedEvent;
			if ((trigger.name == "discard" && !trigger.delay) || (evt && evt.name == "respond")) {
				game.delayx();
			}
			"step 1";
			var cards;
			if (trigger.getl) {
				cards = trigger.getl(player).cards2.filterInD("d");
			} else {
				cards = trigger.cards.filterInD("d");
			}
			if (cards.length == 1) {
				event._result = { bool: true, links: cards };
			} else {
				var dialog = ["遗策：选择要放置的卡牌", '<div class="text center">（从左到右为从旧到新，后选择的后置入）</div>', cards];
				var cards2 = player.getExpansions("nsyice");
				cards2.reverse();
				if (cards2.length) {
					dialog.push('<div class="text center">原有“策”</div>');
					dialog.push(cards2);
				}
				player
					.chooseButton(dialog, true, cards.length)
					.set("filterButton", function (button) {
						return _status.event.cards.includes(button.link);
					})
					.set("cards", cards);
			}
			"step 2";
			player.addToExpansion(result.links, "gain2").gaintag.add("nsyice");
			"step 3";
			var storage = player.getExpansions("nsyice");
			var bool = false;
			for (var i = 0; i < storage.length; i++) {
				for (var j = storage.length - 1; j > i; j--) {
					if (get.number(storage[i]) == get.number(storage[j])) {
						bool = true;
						break;
					}
				}
				if (bool) {
					break;
				}
			}
			if (bool) {
				event.cards = storage.splice(i, j - i + 1);
			} else {
				event.finish();
			}
			"step 4";
			var cardsx = [];
			cardsx.push(cards.shift());
			cardsx.push(cards.pop());
			if (cards.length) {
				player.gain(cards, "gain2");
			}
			event.cards = cardsx;
			"step 5";
			player.chooseButton(["将一张牌置于牌堆顶，将另一张牌置于牌堆底", cards], true);
			"step 6";
			player.lose(event.cards, ui.cardPile).set("topper", result.links[0]).insert_index = function (event, card) {
				if (card == event.topper) {
					return ui.cardPile.firstChild;
				}
				return null;
			};
			if (_status.dying.length) {
				event.finish();
			}
			"step 7";
			player.chooseTarget("对一名角色造成1点伤害", true).set("ai", function (target) {
				var player = _status.event.player;
				return get.damageEffect(target, player, player);
			});
			"step 8";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				target.damage("nocard");
			}
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		marktext: "策",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
	},
};

export default skills;
