import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//战役篇田丰
	gzsuishi: {
		audio: "suishi",
		preHidden: ["gzsuishi2"],
		trigger: { global: "dying" },
		forced: true,
		logAudio: () => 1,
		filter(event, player) {
			return event.player != player && event.parent.name == "damage" && event.parent.source && event.parent.source.group == player.group;
		},
		content() {
			player.draw();
		},
		ai: {
			halfneg: true,
		},
		group: "gzsuishi2",
	},
	gzsuishi2: {
		audio: "suishi",
		trigger: { global: "dieAfter" },
		forced: true,
		sourceSkill: "gzsuishi",
		logAudio: () => 2,
		filter(event, player) {
			return event.player.group == player.group;
		},
		content() {
			player.loseHp();
		},
	},
	//战役篇孔融
	zymingshi: {
		audio: "mingshi",
		forced: true,
		trigger: { target: "useCardToBefore" },
		priority: 15,
		filter(event, player) {
			if (!player.hasEmptySlot(2)) {
				return false;
			}
			if (event.card.name != "sha") {
				return false;
			}
			return game.hasNature(event.card);
		},
		content() {
			trigger.cancel();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name === "sha" && game.hasNature(card) && target.hasEmptySlot(2)) {
						return "zeroplayertarget";
					}
					if (get.subtype(card) == "equip2" && target.isEmpty(2)) {
						return [0.6, -0.8];
					}
				},
			},
		},
	},
	//战役篇蒋钦
	zyshangyi: {
		audio: "shangyi",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target;
		},
		content() {
			"step 0";
			target.viewHandcards(player);
			"step 1";
			if (!target.countCards("h")) {
				event.finish();
			} else {
				player.chooseCardButton(target, target.getCards("h"));
			}
			"step 2";
			if (result.bool) {
				target.discard(result.links[0]);
			}
		},
		ai: {
			order: 11,
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
			threaten: 1.1,
		},
	},
	//战役篇国战将转身份
	//钟会
	zyquanji: {
		audio: "gzquanji",
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		frequent: true,
		filter(event, player, name) {
			if (name == "damageEnd") {
				return true;
			}
			const evt = event.getParent();
			if (evt.player != player) {
				return false;
			}
			return evt.card && evt.type == "card" && evt.targets.length == 1;
		},
		async content(event, trigger, player) {
			await player.draw();
			const hs = player.getCards("he");
			if (!hs.length) {
				return;
			}
			const result = hs.length == 1 ? { bool: true, cards: hs } : await player.chooseCard("he", true, "选择一张牌作为“权”").forResult();
			if (result?.bool && result?.cards?.length) {
				const next = player.addToExpansion(result.cards, player, "give");
				next.gaintag.add(event.name);
				await next;
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		locked: false,
		mod: {
			maxHandcard(player, num) {
				return num + player.getExpansions("zyquanji").length;
			},
		},
		ai: { notemp: true },
	},
	zypaiyi: {
		audio: "gzpaiyi",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.getExpansions("zyquanji").length > 0;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("排异", player.getExpansions("zyquanji"), "hidden");
			},
			backup(links, player) {
				return {
					audio: "gzpaiyi",
					filterTarget: true,
					filterCard() {
						return false;
					},
					selectCard: -1,
					card: links[0],
					delay: false,
					content: lib.skill.zypaiyi.contentx,
					ai: {
						order: 10,
						result: {
							target(player, target) {
								if (target != player) {
									return 0;
								}
								if (player.getExpansions("zyquanji").length <= 1 || (player.needsToDiscard() && !player.getEquip("zhuge") && !player.hasSkill("new_paoxiao"))) {
									return 0;
								}
								return 1;
							},
						},
					},
				};
			},
			prompt() {
				return "请选择【排异】的目标";
			},
		},
		contentx() {
			"step 0";
			var card = lib.skill.zypaiyi_backup.card;
			player.loseToDiscardpile(card);
			"step 1";
			var num = player.getExpansions("zyquanji").length;
			if (num > 0) {
				target.draw(Math.min(7, num));
			}
			"step 2";
			if (target.countCards("h") > player.countCards("h")) {
				target.damage();
			}
		},
		ai: {
			order(item, player) {
				var num = player.getExpansions("zyquanji").length;
				if (num == 1) {
					return 8;
				}
				return 1;
			},
			result: {
				player: 1,
			},
			combo: "zyquanji",
		},
	},
	//孙綝
	zyshilu: {
		init() {
			if (!_status.characterlist) {
				game.initCharacterList();
			}
		},
		audio: 2,
		preHidden: true,
		trigger: { global: "dieAfter" },
		prompt2(event, player) {
			return "将其的所有武将牌" + (player == event.source ? "及武将牌库里的一张随机武将牌" : "") + "置于武将牌上作为“戮”";
		},
		logTarget: "player",
		content() {
			var list = [],
				target = trigger.player;
			if (target.name1 && !target.isUnseen(0) && target.name1.indexOf("gz_shibing") != 0 && _status.characterlist.includes(target.name1)) {
				list.push(target.name1);
			}
			if (target.name2 && !target.isUnseen(1) && target.name2.indexOf("gz_shibing") != 0 && _status.characterlist.includes(target.name1)) {
				list.push(target.name2);
			}
			_status.characterlist.removeArray(list);
			if (player == trigger.source) {
				list.addArray(_status.characterlist.randomRemove(1));
			}
			if (list.length) {
				player.markAuto("zyshilu", list);
				game.log(player, "将", "#g" + get.translation(list), "置于武将牌上作为", "#y“戮”");
				game.broadcastAll(
					function (player, list) {
						var cards = [];
						for (var i = 0; i < list.length; i++) {
							var cardname = "huashen_card_" + list[i];
							lib.card[cardname] = {
								fullimage: true,
								image: "character:" + list[i],
							};
							lib.translate[cardname] = get.rawName2(list[i]);
							cards.push(game.createCard(cardname, "", ""));
						}
						player.$draw(cards, "nobroadcast");
					},
					player,
					list
				);
			}
		},
		marktext: "戮",
		intro: {
			content: "character",
			onunmark(storage, player) {
				if (storage && storage.length) {
					_status.characterlist.addArray(storage);
					storage.length = 0;
				}
			},
			mark(dialog, storage, player) {
				if (storage && storage.length) {
					dialog.addSmall([storage, "character"]);
				} else {
					return "没有“戮”";
				}
			},
			// content:function(storage,player){
			// 	return '共有'+get.cnNumber(storage.length)+'张“戮”';
			// },
		},
		group: "zyshilu_zhiheng",
		subSkill: {
			zhiheng: {
				audio: "zyshilu",
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return player.getStorage("zyshilu").length > 0 && player.countCards("he") > 0;
				},
				direct: true,
				content() {
					"step 0";
					var num = Math.min(player.getStorage("zyshilu").length, player.countCards("he"));
					player.chooseToDiscard("he", get.prompt("zyshilu"), "弃置至多" + get.cnNumber(num) + "张牌并摸等量的牌", [1, num], "allowChooseAll").logSkill = "zyshilu_zhiheng";
					"step 1";
					if (result.bool && result.cards && result.cards.length) {
						player.draw(result.cards.length);
					}
				},
			},
		},
	},
	zyxiongnve: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.getStorage("zyshilu").length > 0;
		},
		content() {
			"step 0";
			player
				.chooseButton([get.prompt("zyxiongnve"), [player.storage.zyshilu, "character"]])
				.set("ai", function (button) {
					if (!_status.event.goon) {
						return 0;
					}
					return 1;
				})
				.set(
					"goon",
					player.countCards("hs", function (card) {
						return get.tag(card, "damage") && player.hasValueTarget(card);
					}) > 1
				);
			"step 1";
			if (result.bool) {
				player.logSkill("zyxiongnve");
				lib.skill.zyxiongnve.throwCharacter(player, result.links);
				game.delayx();
				player
					.chooseControl()
					.set("prompt", "选择获得一项效果")
					.set("choiceList", ["本回合造成的伤害+1", "本回合造成伤害时，获得其一张牌", "本回合使用牌没有次数限制"])
					.set("ai", function () {
						var player = _status.event.player;
						if (
							player.countCards("hs", function (card) {
								return get.name(card) == "sha" && player.hasValueTarget(card);
							}) > player.getCardUsable("sha")
						) {
							return 0;
						}
						return get.rand(1, 2);
					});
			} else {
				event.finish();
			}
			"step 2";
			var skill = "zyxiongnve_effect" + result.index;
			player.addTempSkill(skill);
			game.log(player, "本回合", "#g" + lib.skill[skill].promptx);
		},
		group: "zyxiongnve_end",
		throwCharacter(player, list) {
			player.unmarkAuto("zyshilu", list);
			_status.characterlist.addArray(list);
			game.log(player, "从", "#y“戮”", "中移去了", "#g" + get.translation(list));
			game.broadcastAll(
				function (player, list) {
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						var cardname = "huashen_card_" + list[i];
						lib.card[cardname] = {
							fullimage: true,
							image: "character:" + list[i],
						};
						lib.translate[cardname] = get.rawName2(list[i]);
						cards.push(game.createCard(cardname, "", ""));
					}
					player.$throw(cards, 1000, "nobroadcast");
				},
				player,
				list
			);
		},
		subSkill: {
			effect0: {
				promptx: "造成的伤害+1",
				charlotte: true,
				onremove: true,
				audio: "zyxiongnve",
				intro: {
					content: "当你造成伤害时，此伤害+1",
				},
				trigger: { source: "damageBegin1" },
				forced: true,
				logTarget: "player",
				content() {
					trigger.num++;
				},
			},
			effect1: {
				promptx: "造成伤害后，获得其一张牌",
				charlotte: true,
				onremove: true,
				audio: "zyxiongnve",
				intro: {
					content: "对其他角色造成伤害时，获得其一张牌",
				},
				trigger: { source: "damageBegin1" },
				forced: true,
				filter(event, player) {
					return player != event.player && event.player.countGainableCards(player, "he") > 0;
				},
				logTarget: "player",
				content() {
					player.gainPlayerCard(trigger.player, true, "he");
				},
			},
			effect2: {
				promptx: "使用牌没有次数限制",
				charlotte: true,
				onremove: true,
				intro: {
					content: "使用牌没有次数限制",
				},
				mod: {
					cardUsable: () => Infinity,
				},
			},
			effect3: {
				charlotte: true,
				audio: "zyxiongnve",
				mark: true,
				intro: {
					content: "受到的伤害-1",
				},
				trigger: { player: "damageBegin4" },
				forced: true,
				filter(event, player) {
					return event.source != player && event.source && event.source.isIn();
				},
				content() {
					trigger.num--;
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (player.hasSkillTag("jueqing", false, target)) {
								return;
							}
							var num = get.tag(card, "damage");
							if (num) {
								if (num > 1) {
									return 0.5;
								}
								return 0;
							}
						},
					},
				},
			},
			end: {
				trigger: { player: "phaseUseEnd" },
				direct: true,
				filter(event, player) {
					return player.getStorage("zyshilu").length > 1;
				},
				content() {
					"step 0";
					player.chooseButton(["凶虐：是否移去两张“戮”获得减伤？", [player.storage.zyshilu, "character"]], 2).set("ai", function (button) {
						var player = _status.event.player;
						if (game.countPlayer() * 1.5 + player.storage.zyshilu.length / 2 > 8) {
							return 1;
						}
						if (player.hp <= 2) {
							return 1;
						}
						return 0;
					});
					"step 1";
					if (result.bool) {
						player.logSkill("zyxiongnve");
						lib.skill.zyxiongnve.throwCharacter(player, result.links);
						player.addTempSkill("zyxiongnve_effect3", { player: "phaseBegin" });
						game.delayx();
					}
				},
			},
		},
		ai: {
			combo: "zyshilu",
		},
	},
	//孟达
	qiuan: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return event.cards && event.cards.filterInD().length > 0 && !player.getExpansions("qiuan").length;
		},
		check(event, player) {
			if (get.damageEffect(player, event.source || player, player, event.nature) >= 0) {
				return false;
			}
			return true;
		},
		preHidden: true,
		content() {
			var cards = trigger.cards.filterInD();
			player.addToExpansion("gain2", cards).gaintag.add("qiuan");
			trigger.cancel();
		},
		ai: {
			combo: "liangfan",
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		marktext: "函",
	},
	liangfan: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.getExpansions("qiuan").length > 0;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("qiuan");
			player.gain(cards, "gain2").gaintag.add("liangfan");
			player.addTempSkill("liangfan2");
			"step 1";
			player.loseHp();
		},
		ai: {
			combo: "qiuan",
		},
	},
	liangfan2: {
		audio: "liangfan",
		mark: true,
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("liangfan")) {
					return num + 0.1;
				}
			},
		},
		intro: { content: "使用“量反”牌造成伤害后，可获得目标角色的一张牌" },
		trigger: { source: "damageEnd" },
		logTarget: "player",
		charlotte: true,
		sourceSkill: "liangfan",
		onremove(player) {
			player.removeGaintag("liangfan");
		},
		prompt: event => "量反：是否获得" + get.translation(event.player) + "的一张牌？",
		filter(event, player) {
			var evt = event.getParent(2);
			if (evt.name != "useCard" || evt.card != event.card) {
				return false;
			}
			if (!event.player.countGainableCards(player, "he")) {
				return false;
			}
			return (
				player.getHistory("lose", function (evt2) {
					if (evt2.getParent() != evt) {
						return false;
					}
					for (var i in evt2.gaintag_map) {
						if (evt2.gaintag_map[i].includes("liangfan")) {
							return true;
						}
					}
					return false;
				}).length > 0
			);
		},
		marktext: "反",
		content() {
			player.gainPlayerCard(trigger.player, true, "he");
		},
	},
	//文钦
	gzjinfa: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				player.countCards("he") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("he") > 0;
				})
			);
		},
		filterCard: true,
		position: "he",
		filterTarget(card, player, target) {
			return target != player && target.countCards("he") > 0;
		},
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			target
				.chooseCard("he", "交给" + get.translation(player) + "一张装备牌，或令其获得你的一张牌", { type: "equip" })
				.set("ai", function (card) {
					if (_status.event.goon && get.suit(card) == "spade") {
						return 8 - get.value(card);
					}
					return 5 - get.value(card);
				})
				.set("goon", target.canUse("sha", player, false) && get.effect(player, { name: "sha" }, target, target) > 0);
			"step 1";
			if (!result.bool) {
				player.gainPlayerCard(target, "he", true);
				event.finish();
			} else {
				target.give(result.cards, player);
			}
			"step 2";
			if (result.bool && result.cards && result.cards.length && target.isIn() && player.isIn() && get.suit(result.cards[0], target) == "spade" && target.canUse("sha", player, false)) {
				target.useCard({ name: "sha", isCard: true }, false, player);
			}
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					if (
						target.countCards("e", function (card) {
							return get.suit(card) == "spade" && get.value(card) < 8;
						}) &&
						target.canUse("sha", player, false)
					) {
						return get.effect(player, { name: "sha" }, target, player);
					}
					return 0;
				},
				target(player, target) {
					var es = target.getCards("e").sort(function (a, b) {
						return get.value(b, target) - get.value(a, target);
					});
					if (es.length) {
						return -Math.min(2, get.value(es[0]));
					}
					return -2;
				},
			},
		},
	},
	//战役篇改王允
	zylianji: {
		audio: "wylianji",
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return player.hasHistory("useCard", evt => evt.getParent("phaseUse") == event);
		},
		direct: true,
		async content(event, trigger, player) {
			let logged = false;
			const num = player
				.getHistory("useCard", evt => evt.getParent("phaseUse") == trigger)
				.map(evt => get.type2(evt.card))
				.unique().length;
			if (num > 0) {
				const result = await player
					.chooseTarget(get.prompt("zylianji"), "令一名角色摸一张牌")
					.set("ai", target => {
						var player = get.player();
						if (target == player && player.needsToDiscard(1)) {
							return 1;
						}
						return get.effect(target, { name: "draw" }, player, player);
					})
					.forResult();
				if (result?.targets?.length) {
					const target = result.targets[0];
					if (!logged) {
						logged = true;
						player.logSkill("zylianji", target);
					}
					await result.targets[0].draw();
				}
			}
			if (num > 1 && player.isDamaged()) {
				const result = await player.chooseBool(get.prompt("zylianji"), "回复1点体力").forResult();
				if (result?.bool) {
					if (!logged) {
						logged = true;
						player.logSkill("zylianji");
					}
					await player.recover();
				}
			}
			if (num > 2) {
				let list;
				const evt = trigger.getParent("phase", true);
				if (evt) {
					list = evt.phaseList.slice(evt.num + 1);
				}
				if (!list.length) {
					return;
				}
				const result = await player
					.chooseTarget(get.prompt("zylianji"), `跳过本回合的剩余阶段，然后令一名其他角色执行一个只有${get.translation(list)}的回合`, lib.filter.notMe)
					.set("ai", target => {
						var att = get.attitude(_status.event.player, target),
							num = target.needsToDiscard(),
							numx = player.needsToDiscard();
						if (att < 0 && num > 0) {
							return (-att * Math.sqrt(num)) / 3 + numx;
						}
						var skills = target.getSkills();
						var val = 0;
						for (var skill of skills) {
							var info = get.info(skill);
							if (info.trigger && info.trigger.player && (info.trigger.player.indexOf("phaseJieshu") == 0 || (Array.isArray(info.trigger.player) && info.trigger.player.some(i => i.indexOf("phaseJieshu") == 0)))) {
								var threaten = info.ai && info.ai.threaten ? info.ai.threaten : 1;
								if (info.ai && info.ai.neg) {
									val -= 3 * threaten;
								} else if (info.ai && info.ai.halfneg) {
									val -= 1.5 * threaten;
								} else {
									val += threaten;
								}
							}
						}
						return (att * val) / 2 + numx;
					})
					.forResult();
				if (result?.targets?.length) {
					const target = result.targets[0];
					if (!logged) {
						logged = true;
						player.logSkill("zylianji", target);
					} else {
						player.line(target);
					}
					list = list.map(name => name.split("|")[0]);
					list.forEach(name => player.skip(name));
					game.log(player, "跳过了", list);
					target.insertPhase().set("phaseList", list)._noTurnOver = true;
				}
			}
		},
	},
	zymoucheng: {
		audio: "moucheng",
		enable: "phaseUse",
		usable: 1,
		viewAs: { name: "jiedao" },
		filterCard: { color: "black" },
		position: "he",
		check(card) {
			return 4.5 - get.value(card);
		},
	},
	//曹安民
	nskuishe: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("he") > 0;
		},
		content() {
			"step 0";
			player.choosePlayerCard(target, "he", true).set("ai", get.buttonValue);
			"step 1";
			if (result.bool) {
				var card = result.cards[0];
				event.card = card;
				player
					.chooseTarget("将" + get.translation(target) + "的" + (get.position(card) == "h" && !player.hasSkillTag("viewHandcard", null, target, true) ? "手牌" : get.translation(card)) + "交给一名角色", true, function (target) {
						return target != _status.event.getParent().target;
					})
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (_status.event.du) {
							if (target.hasSkillTag("nodu")) {
								return 0;
							}
							return -att;
						}
						if (target.hasSkillTag("nogain")) {
							return 0.1;
						}
						if (att > 0) {
							return att + Math.max(0, 5 - target.countCards("h"));
						}
						return att;
					})
					.set("du", event.card.name == "du");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target2 = result.targets[0];
				target.line(target2, "green");
				target2.gain(target, card, "giveAuto").giver = player;
			} else {
				event.finish();
			}
			"step 3";
			target
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					"是否对" + get.translation(player) + "使用一张杀？"
				)
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("sourcex", player);
		},
		ai: {
			order: 6,
			expose: 0.2,
			result: {
				target: -1.5,
				player(player, target) {
					if (!target.canUse("sha", player)) {
						return 0;
					}
					if (target.countCards("h") == 1) {
						return 0.1;
					}
					if (player.hasShan()) {
						return -0.5;
					}
					if (player.hp <= 1) {
						return -2;
					}
					if (player.hp <= 2) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
};

export default skills;
