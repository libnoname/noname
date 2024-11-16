import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "zhulu",
		connect: true,
		card: {
			zhulu_card: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				cardcolor: "red",
				selectTarget: -1,
				filterTarget: true,
				contentBefore: function () {
					"step 0";
					if (get.is.versus()) {
						player
							.chooseControl("顺时针", "逆时针", function (event, player) {
								if (player.next.side == player.side) return "逆时针";
								return "顺时针";
							})
							.set("prompt", "选择" + get.translation(card) + "的结算方向");
					} else {
						event.goto(2);
					}
					"step 1";
					if (result && result.control == "顺时针") {
						var evt = event.getParent();
						evt.fixedSeat = true;
						evt.targets.sortBySeat();
						evt.targets.reverse();
						if (evt.targets[evt.targets.length - 1] == player) {
							evt.targets.unshift(evt.targets.pop());
						}
					}
					"step 2";
					ui.clear();
					var num;
					if (event.targets) {
						num = event.targets.length;
					} else {
						num = game.countPlayer();
					}
					var cards = [];
					for (var i = 0; i < num; i++) {
						var cardx = get.cardPile(function (card) {
							return get.type(card) == "equip" && !cards.includes(card);
						});
						if (cardx) cards.push(cardx);
					}
					if (!cards.length) {
						event.finish();
						event.getParent().excluded.addArray(game.players);
						return;
					}
					game.cardsGotoOrdering(cards).relatedEvent = event.getParent();
					var dialog = ui.create.dialog("逐鹿天下", cards, true);
					_status.dieClose.push(dialog);
					dialog.videoId = lib.status.videoId++;
					game.addVideo("cardDialog", null, ["逐鹿天下", get.cardsInfo(cards), dialog.videoId]);
					event.getParent().preResult = dialog.videoId;
					game.broadcast(
						function (cards, id) {
							var dialog = ui.create.dialog("逐鹿天下", cards, true);
							_status.dieClose.push(dialog);
							dialog.videoId = id;
						},
						cards,
						dialog.videoId
					);
					game.log(event.card, "亮出了", cards);
				},
				content: function () {
					"step 0";
					for (var i = 0; i < ui.dialogs.length; i++) {
						if (ui.dialogs[i].videoId == event.preResult) {
							event.dialog = ui.dialogs[i];
							break;
						}
					}
					if (!event.dialog) {
						event.finish();
						return;
					}
					var equips = [];
					for (var i = 0; i < event.dialog.buttons.length; i++) {
						var card = event.dialog.buttons[i].link;
						if (target.canEquip(card, true)) equips.push(card);
					}
					if (equips.length > 1) {
						var next = target.chooseButton(true, function (button) {
							var player = _status.event.player;
							return get.effect(player, button.link, player, player);
						});
						next.set("equips", equips);
						next.set("filterButton", function (button) {
							return _status.event.equips.includes(button.link);
						});
						next.set("dialog", event.preResult);
						next.set("closeDialog", false);
						next.set("dialogdisplay", true);
					} else if (equips.length) {
						event.directButton = equips[0];
					} else event.finish();
					"step 1";
					var dialog = event.dialog;
					var card;
					if (event.directButton) {
						card = event.directButton;
					} else {
						card = result.links[0];
					}
					var button;
					for (var i = 0; i < dialog.buttons.length; i++) {
						if (dialog.buttons[i].link == card) {
							button = dialog.buttons[i];
							button.querySelector(".info").innerHTML = (function (target) {
								if (target._tempTranslate) return target._tempTranslate;
								var name = target.name;
								if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
								return get.translation(name);
							})(target);
							dialog.buttons.remove(button);
							break;
						}
					}
					var capt = get.translation(target) + "选择了" + get.translation(button.link);
					if (card) {
						target.equip(card);
						target.$gain2(card);
						game.broadcast(
							function (card, id, name, capt) {
								var dialog = get.idDialog(id);
								if (dialog) {
									dialog.content.firstChild.innerHTML = capt;
									for (var i = 0; i < dialog.buttons.length; i++) {
										if (dialog.buttons[i].link == card) {
											dialog.buttons[i].querySelector(".info").innerHTML = name;
											dialog.buttons.splice(i--, 1);
											break;
										}
									}
								}
							},
							card,
							dialog.videoId,
							(function (target) {
								if (target._tempTranslate) return target._tempTranslate;
								var name = target.name;
								if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
								return get.translation(name);
							})(target),
							capt
						);
					}
					dialog.content.firstChild.innerHTML = capt;
					game.addVideo("dialogCapt", null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
					game.log(target, "选择了", button.link);
					game.delay();
				},
				contentAfter: function () {
					for (var i = 0; i < ui.dialogs.length; i++) {
						if (ui.dialogs[i].videoId == event.preResult) {
							var dialog = ui.dialogs[i];
							dialog.close();
							_status.dieClose.remove(dialog);
							break;
						}
					}
					game.broadcast(function (id) {
						var dialog = get.idDialog(id);
						if (dialog) {
							dialog.close();
							_status.dieClose.remove(dialog);
						}
					}, event.preResult);
					game.addVideo("cardDialog", null, event.preResult);
				},
				ai: {
					wuxie: function () {
						if (Math.random() < 0.5) return 0;
					},
					basic: {
						order: 3,
						useful: 1,
					},
					result: {
						target: function (player, target) {
							if (get.is.versus()) {
								if (target == player) return 1.5;
								return 1;
							}
							if (player.hasUnknown(2)) {
								return 0;
							}
							return (1 - get.distance(player, target, "absolute") / game.countPlayer()) *
								get.attitude(player, target) >
								0
								? 0.4
								: 0.7;
						},
					},
					tag: {
						draw: 1,
						multitarget: 1,
					},
				},
			},
			kaihua: {
				enable: true,
				fullskin: true,
				type: "trick",
				selectTarget: -1,
				toself: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				content: function () {
					"step 0";
					if (!target.countCards("he")) {
						event.finish();
						return;
					}
					target.chooseToDiscard(true, "he", [1, 2]).set("ai", function (card) {
						if (!ui.selected.cards.length && get.type(card) == "equip")
							return 8 - get.value(card);
						return 6 - get.value(card);
					});
					"step 1";
					if (result.bool && result.cards) {
						var bool = 0;
						for (var i = 0; i < result.cards.length; i++) {
							if (get.type(result.cards[i]) == "equip") {
								bool = 1;
								break;
							}
						}
						target.draw(result.cards.length + bool);
					}
				},
				ai: {
					wuxie: function () {
						return 0;
					},
					basic: {
						useful: 3,
						value: 3,
						order: 5,
					},
					result: {
						target: function (player, target, card) {
							var cards = ui.selected.cards.concat(card.cards || []);
							var num = player.countCards("he", function (card) {
								if (cards.includes(card)) return false;
								if (get.type(card) == "equip") return 8 > get.value(card);
								return 6 > get.value(card);
							});
							if (!num) return 0;
							if (
								player.countCards("he", function (card) {
									if (cards.includes(card)) return false;
									if (get.type(card) == "equip") return 4 > get.value(card);
									return false;
								})
							)
								return 1.6;
							if (num < 2) return 0.5;
							return 1.2;
						},
					},
					tag: {
						loseCard: 1,
						discard: 1,
						norepeat: 1,
					},
				},
			},
			jiejia: {
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: function (card, player, target) {
					return target.countCards("e") > 0;
				},
				content: function () {
					var es = target.getCards("e");
					if (es.length) target.gain(es, "gain2", "log");
				},
				ai: {
					order: 10,
					tag: {
						gain: 1,
						//loseCard:1,
					},
					basic: {
						useful: 0.5,
						value: 0.5,
					},
					result: {
						target: function (player, target) {
							var e5 = target.getEquip("muniu");
							if (e5 && e5.name == "muniu" && e5.cards && e5.cards.length > 1) return -1;
							if (
								target.countCards("e", function (card) {
									return get.value(card, target) <= 0;
								}) ||
								target.hasSkillTag("noe")
							)
								return 1;
							return 0;
						},
					},
				},
			},
			caochuan: {
				fullskin: true,
				type: "trick",
				wuxieable: true,
				global: ["caochuan_skill"],
				notarget: true,
				content: function () {
					var evt2 = event.getParent(3)._trigger;
					evt2.neutralize();
					var evt = evt2.getParent();
					var next = game.createEvent("caochuan_gain");
					_status.event.next.remove(next);
					evt.after.unshift(next);
					next.player = player;
					next.setContent(function () {
						var cards = event.getParent().cards.filterInD();
						if (cards.length) player.gain(cards, "gain2", "log");
					});
				},
				ai: {
					basic: {
						useful: [6, 4],
						value: [6, 4],
					},
					result: { player: 1 },
				},
			},
			numa: {
				fullskin: true,
				type: "equip",
				subtype: "equip4",
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					return target.canEquip(card, true);
				},
				selectTarget: 1,
				toself: false,
				loseThrow: true,
				customSwap: function () {
					return true;
				},
				ai: {
					order: 9,
					value: function (card, player) {
						if (player.getEquips(4).includes(card)) return 0;
						return 4;
					},
					equipValue: function (card, player) {
						if (player.getCards("e").includes(card)) return 0;
						return -get.value(player.getCards("e"));
					},
					basic: {
						equipValue: 5,
					},
					result: {
						keepAI: true,
						target: function (player, target) {
							var cards = target.getCards("e");
							if (cards.length == 1 && cards[0].name == "nvzhuang") return 0;
							var val = get.value(cards, target);
							if (val > 0) return -val;
							return 0;
						},
					},
				},
			},
			yajiaoqiang: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -2 },
				skills: ["yajiaoqiang_skill"],
				ai: {
					equipValue: function (card, player) {
						var skills = [
							"longdan",
							"kanpo",
							"rekanpo",
							"qingguo",
							"reqingguo",
							"ollongdan",
							"refanghun",
						];
						for (var i = 0; i < skills.length; i++) {
							if (player.hasSkill(skills[i])) return 5;
						}
						if (
							player.countCards("h", function (card) {
								return get.color(card) == "black" && ["wuxie", "caochuan"].includes(card);
							})
						)
							return 5;
						return 2;
					},
					basic: {
						equipValue: 5,
					},
				},
			},
			wufengjian: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					return target.canEquip(card, true);
				},
				selectTarget: 1,
				toself: false,
				skills: ["wufengjian_skill"],
				ai: {
					order: 9,
					equipValue: function (card, player) {
						if (get.position(card) == "e") return -2;
						return 2;
					},
					value: function (card, player) {
						if (player.getEquips(1).includes(card)) {
							if (player.hasSkillTag("noh")) return 0;
							return -3.5;
						}
						return 1.5;
					},
					basic: {
						equipValue: 5,
					},
					result: {
						keepAI: true,
						target: function (player, target) {
							var val = 2;
							var val2 = 0;
							var card = target.getEquip(1);
							if (card) {
								val2 = get.value(card, target);
								if (val2 < 0) return 0;
							}
							return -val - val2;
						},
					},
				},
			},
			zheji: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					return target.canEquip(card, true);
				},
				selectTarget: 1,
				toself: false,
				distance: { attackFrom: 1 },
				ai: {
					order: 9,
					equipValue: function (card, player) {
						if (get.position(card) == "e") return -2;
						return 2;
					},
					value: function (card, player) {
						if (player.getEquips(1).includes(card)) return -3.5;
						return 3;
					},
					basic: {
						equipValue: 5,
					},
					result: {
						keepAI: true,
						target: function (player, target) {
							var val = 2.5;
							var val2 = 0;
							var card = target.getEquip(1);
							if (card) {
								val2 = get.value(card, target);
								if (val2 < 0) return 0;
							}
							return -val - val2;
						},
					},
				},
			},
			yinfengjia: {
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					return target.canEquip(card, true);
				},
				selectTarget: 1,
				toself: false,
				skills: ["yinfengjia_skill"],
				ai: {
					order: 9,
					equipValue: function (card, player) {
						if (get.position(card) == "e") return -7;
						return 1;
					},
					value: function (card, player) {
						if (player.getEquips(2).includes(card)) return -9;
						return 2.5;
					},
					basic: {
						equipValue: 5,
					},
					result: {
						keepAI: true,
						target: function (player, target) {
							var val = 2;
							var val2 = 0;
							var card = target.getEquip(2);
							if (card) {
								val2 = get.value(card, target);
								if (val2 < 0) return 0;
							}
							return -val - val2;
						},
					},
				},
			},
			nvzhuang: {
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					return target.canEquip(card, true);
				},
				selectTarget: 1,
				toself: false,
				loseDelay: false,
				onEquip: function () {
					if (
						player.sex == "male" &&
						player.countCards("he", function (cardx) {
							return card.cards && !card.cards.includes(cardx);
						})
					)
						player
							.chooseToDiscard(
								true,
								function (card) {
									return !_status.event.card?.cards.includes(card);
								},
								"he"
							)
							.set("card", card);
				},
				onLose: function () {
					if (player.sex != "male") return;
					var next = game.createEvent("nvzhuang_lose");
					event.next.remove(next);
					var evt = event.getParent();
					if (evt.getlx === false) evt = evt.getParent();
					evt.after.push(next);
					next.player = player;
					next.setContent(function () {
						if (player.countCards("he")) {
							player.popup("nvzhuang");
							player.chooseToDiscard(true, "he");
						}
					});
				},
				ai: {
					order: 9.5,
					equipValue: function (card, player) {
						if (player.getEquips(2).includes(card)) {
							if (player.sex != "male") return 0;
							var num = player.countCards("he", function (cardx) {
								return cardx != card;
							});
							if (num == 0) return 0;
							return 4 / num;
						}
						return 1;
					},
					value: function () {
						return lib.card.nvzhuang.ai.equipValue.apply(this, arguments);
					},
					basic: {
						equipValue: 5,
					},
					result: {
						keepAI: true,
						target: function (player, target) {
							var card = target.getEquip(2);
							if (target.sex == "male") {
								var val = 0;
								var val2 = 0;
								if (card) {
									val2 = get.value(card, target);
									if (val2 < 0) return 0;
								}
								var num = target.countCards("he", function (cardx) {
									return cardx != card;
								});
								if (num > 0) val += 4 / num;
								return -val;
							}
							if (card) {
								var val2 = get.value(card, target);
								if (val2 > 0) return -val2 / 4;
							}
							return 0;
						},
					},
				},
			},
			yexingyi: {
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				skills: ["yexingyi_skill"],
				ai: {
					equipValue: 4,
					basic: {
						equipValue: 4,
					},
				},
			},
			jinhe: {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					return target.canEquip(card, true);
				},
				selectTarget: 1,
				toself: false,
				skills: ["jinhe_skill"],
				global: ["jinhe_lose"],
				loseDelay: false,
				onEquip: function () {
					"step 0";
					player.markSkill("jinhe_skill");
					if (event.getParent(2).name != "jinhe") event.finish();
					else {
						event.target = player;
						event.player = event.getParent(2).player;
					}
					"step 1";
					var id = card.cardid;
					event.cardid = id;
					if (!_status.jinhe) _status.jinhe = {};
					if (_status.jinhe[id]) {
						game.cardsDiscard(_status.jinhe[id].card);
						delete _status.jinhe[id];
					}
					var cards2 = get.cards(2);
					event.cards2 = cards2;
					player.chooseButton(["选择一张牌作为「礼」", cards2], true);
					"step 2";
					var id = event.cardid;
					_status.jinhe[id] = {
						player: player,
						card: result.links[0],
					};
					game.broadcast(function (jinhe) {
						_status.jinhe = jinhe;
					}, _status.jinhe);
					game.cardsGotoSpecial(result.links[0]);
					event.cards2.remove(result.links[0]);
					event.cards2[0].fix();
					ui.cardPile.insertBefore(event.cards2[0], ui.cardPile.firstChild);
					game.updateRoundNumber();
					target.markSkill("jinhe_skill");
				},
				onLose: function () {
					player.unmarkSkill("jinhe_skill");
					var id = card.cardid;
					if (
						event.getParent(2) &&
						event.getParent(2).name != "swapEquip" &&
						get.position(card?.cards?.[0]) != "d" &&
						event.parent.type != "equip" &&
						_status.jinhe &&
						_status.jinhe[id]
					) {
						var card2 = _status.jinhe[id].card;
						player.$throw(card2, 1000);
						game.log(card, "掉落了", card2);
						game.cardsDiscard(card2);
						delete _status.jinhe[id];
					}
				},
				ai: {
					order: 9.5,
					equipValue: function (card, player) {
						if (!player.getEquips(5).includes(card)) return 5;
						if (
							_status.jinhe &&
							_status.jinhe[card.cardid] &&
							_status.event.name != "gainPlayerCard"
						)
							return 3 * player.countCards("h");
						return 0;
					},
					value: function () {
						return lib.card.jinhe.ai.equipValue.apply(this, arguments);
					},
					basic: {
						equipValue: 5,
					},
					result: {
						keepAI: true,
						target: function (player, target, cardx) {
							if (_status.jinhe && _status.jinhe[cardx.cardid])
								return -0.5 - 2 * target.countCards("h");
							var card = target.getEquip(5);
							if (!card) return 0;
							return -get.value(card, target);
						},
						target_use: function (player, target) {
							return -0.5 - 2 * target.countCards("h");
						},
					},
				},
			},
		},
		skill: {
			jinhe_lose: {
				trigger: {
					player: ["loseAfter", "equipAfter"],
					global: "loseAsyncAfter",
				},
				equipSkill: true,
				forced: true,
				filter: function (event, player) {
					if (event.getl === false) return false;
					if (
						!event.getd(player).length ||
						!_status.jinhe ||
						(event.getParent(2).name == "jinhe_skill" && event.getParent(2).player == player)
					)
						return false;
					var evt = event.getl(player);
					if (!evt) return false;
					for (var i = 0; i < evt.es.length; i++) {
						if (evt.es[i].name == "jinhe" && _status.jinhe[evt.es[i].cardid]) return true;
					}
					return false;
				},
				content: function () {
					"step 0";
					var es = trigger.getl(player).es;
					for (var i = 0; i < es.length; i++) {
						if (es[i].name == "jinhe" && _status.jinhe[es[i].cardid]) {
							var card = _status.jinhe[es[i].cardid].card;
							game.cardsDiscard(card);
							player.$throw(card);
							game.log(card, "进入了弃牌堆");
							delete _status.jinhe[es[i].cardid];
						}
					}
					game.broadcastAll(function (jinhe) {
						_status.jinhe = jinhe;
					}, _status.jinhe);
					"step 1";
					var hs = player.getCards("h");
					if (hs.length) player.discard(hs);
					"step 2";
					game.broadcastAll(ui.clear);
				},
			},
			jinhe_skill: {
				equipSkill: true,
				intro: {
					mark: function (dialog, storage, player) {
						var card = player.getEquip("jinhe");
						if (card && _status.jinhe && _status.jinhe[card.cardid]) {
							if (
								_status.jinhe[card.cardid].player == game.me ||
								_status.jinhe[card.cardid].player.isUnderControl()
							)
								dialog.addAuto([_status.jinhe[card.cardid].card]);
							else return "共有一张「礼」";
						} else return "没有牌";
					},
				},
				mark: true,
				marktext: "礼",
				enable: "phaseUse",
				filter: function (event, player) {
					if (!_status.jinhe) return false;
					var card = player.getEquip("jinhe");
					return card && card.name == "jinhe" && _status.jinhe[card.cardid] != undefined;
				},
				prepare: function (cards, player) {
					var card = player.getEquip("jinhe");
					if (card && card.name == "jinhe" && _status.jinhe[card.cardid]) {
						var tothrow = _status.jinhe[card.cardid].card;
						player.$throw(tothrow);
						game.log(player, "将", tothrow, "置入了弃牌堆");
					}
				},
				content: function () {
					"step 0";
					var card = player.getEquip("jinhe");
					if (card && card.name == "jinhe" && _status.jinhe[card.cardid]) {
						game.cardsDiscard(_status.jinhe[card.cardid].card);
						event.suit = get.suit(_status.jinhe[card.cardid].card);
						delete _status.jinhe[card.cardid];
						game.broadcastAll(function (jinhe) {
							_status.jinhe = jinhe;
						}, _status.jinhe);
					} else event.finish();
					"step 1";
					var cards = player.getCards("he", function (card) {
						if (get.position(card) == "h") return get.suit(card) == event.suit;
						return get.position(card) == "e" && card.name == "jinhe";
					});
					if (cards.length) player.discard(cards);
					"step 2";
					game.broadcastAll(ui.clear);
				},
				ai: {
					order: 1,
					result: {
						player: function (player) {
							var suit = get.suit(_status.jinhe[player.getEquip("jinhe").cardid].card);
							var hs = player.getCards("h", function (card) {
								return get.suit(card) == suit;
							});
							if (!hs.length || get.value(hs) < 5) return 1;
							return -1;
						},
					},
				},
			},
			yexingyi_skill: {
				equipSkill: true,
				mod: {
					targetEnabled: function (card, player, target) {
						if (
							get.color(card) == "black" &&
							get.type(card, "trick") == "trick" &&
							!target.hasSkillTag("unequip2") &&
							!player.hasSkillTag("unequip", false, {
								name: card ? card.name : null,
								target: target,
								card: card,
							})
						) {
							const cards = player.getEquips("yexingyi");
							if (
								player.hasSkill("yexingyi_skill", null, false) ||
								!card.cards ||
								!cards.some(
									(cardx) => card.cards.includes(cardx) || ui.selected.cards.includes(cardx)
								)
							)
								return false;
						}
					},
				},
			},
			yinfengjia_skill: {
				trigger: { player: "damageBegin3" },
				forced: true,
				equipSkill: true,
				filter: function (event, player) {
					if (get.type(event.card, "trick") != "trick") return false;
					if (player.hasSkillTag("unequip2")) return false;
					if (
						event.source &&
						event.source.hasSkillTag("unequip", false, {
							name: event.card ? event.card.name : null,
							target: player,
							card: event.card,
						})
					)
						return false;
					return true;
				},
				content: function () {
					trigger.num++;
				},
			},
			wufengjian_skill: {
				equipSkill: true,
				trigger: { player: "useCard" },
				forced: true,
				filter: function (event, player) {
					if (event.card.name != "sha") return false;
					var cards = player.getEquips("wufengjian");
					return player.hasCard(function (card) {
						return !cards.includes(card);
					}, "he");
				},
				content: function () {
					if (player != game.me && !player.isUnderControl() && !player.isOnline()) game.delayx();
					player
						.chooseToDiscard(true, "he", function (card) {
							return !_status.event.cards.includes(card);
						})
						.set("cards", player.getEquips("wufengjian"));
				},
			},
			yajiaoqiang_skill: {
				equipSkill: true,
				trigger: { player: "useCardAfter" },
				filter: function (event, player) {
					if (_status.currentPhase == player || get.color(event.card) != "black" || event.cards.filterInD().length == 0) return false;
					return (
						player
							.getHistory("useCard", function (evt) {
								return get.color(evt.card) == "black";
							})
							.indexOf(event) == 0
					);
				},
				prompt2: function (event, player) {
					return "获得" + get.translation(event.cards.filterInD());
				},
				content: function () {
					player.gain(trigger.cards.filterInD(), "gain2", "log");
				},
			},
			caochuan_skill: {
				trigger: { target: "useCardToBegin" },
				forced: true,
				priority: 6,
				filter: function (event, player) {
					if (
						event.directHit ||
						!get.tag(event.card, "damage") ||
						!["basic", "trick"].includes(get.type(event.card))
					)
						return false;
					return player.hasUsableCard("caochuan");
				},
				content: function () {
					var next = player.chooseToUse();
					next.set(
						"prompt",
						"是否使用【草船借箭】响应" +
							get.translation(trigger.player) +
							"使用的" +
							get.translation(trigger.card) +
							"？"
					);
					next.set("filterCard", function (card, player) {
						if (get.name(card) != "caochuan") return false;
						return lib.filter.cardEnabled(card, player, "forceEnable");
					});
					next.set("respondTo", [trigger.player, trigger.card]);
					next.set("goon", -get.effect(player, trigger.card, trigger.player, player));
					next.set("ai1", function (card) {
						return _status.event.goon;
					});
				},
			},
		},
		translate: {
			jinhe: "锦盒",
			jinhe_info:
				"此牌的使用目标为其他角色。当你使用【锦盒】时，你将原有的与此牌对应的「礼」置入弃牌堆（若有），然后观看牌堆顶的两张牌并将其中一张置于游戏外与此牌对应，称之为「礼」。<br>出牌阶段，你可以将与此牌对应的「礼」置入弃牌堆，然后弃置【锦盒】以及所有与「礼」花色相同的手牌。当此牌因其他原因进入弃牌堆后，你将与此牌对应的「礼」置入弃牌堆并弃置所有手牌。",
			jinhe_skill: "锦盒",
			jinhe_lose: "锦盒",
			yexingyi: "夜行衣",
			yexingyi_info: "锁定技，你不是黑色锦囊牌的合法目标。",
			nvzhuang: "女装",
			nvzhuang_info:
				"此牌的使用目标为其他角色。锁定技，当此牌进入或离开你的装备区时，若你的性别为男性，你弃置一张不为此牌的牌。",
			yinfengjia: "引蜂甲",
			yinfengjia_info: "此牌的使用目标为其他角色。锁定技，当你受到锦囊牌造成的伤害时，此伤害+1。",
			yinfengjia_skill: "引蜂甲",
			zheji: "折戟",
			zheji_info: "此牌的使用目标为其他角色。这是一把坏掉的武器……",
			wufengjian: "无锋剑",
			wufengjian_info:
				"此牌的使用目标为其他角色。锁定技，当你使用【杀】时，你弃置一张不为装备区内【无锋剑】的牌。",
			wufengjian_skill: "无锋剑",
			yajiaoqiang_skill: "涯角枪",
			yajiaoqiang: "涯角枪",
			yajiaoqiang_info:
				"当你于一名其他角色的回合内第一次使用的黑色牌结算完成后，你可以获得此牌对应的所有实体牌。",
			numa: "驽马",
			numa_info:
				"此牌的使用目标为其他角色。锁定技，当此牌进入你的装备区时，你弃置装备区内的所有其他牌。",
			caochuan: "草船借箭",
			caochuan_info:
				"当带有「伤害」标签的基本牌或普通锦囊牌对你生效前，对此牌使用。抵消此牌对你产生的效果。当此牌结算完成后，你获得此牌对应的所有实体牌。",
			jiejia: "解甲归田",
			jiejia_info: "出牌阶段，对一名装备区内有牌的角色使用。该角色获得其装备区内的所有牌。",
			kaihua: "树上开花",
			kaihua_info:
				"出牌阶段，对包含你自己在内的一名角色使用。目标角色弃置一至两张牌，然后摸等量的牌。若其以此法弃置了装备牌，则多摸一张牌。",
			zhulu_card: "逐鹿天下",
			zhulu_card_info:
				"出牌阶段，对所有角色使用。你从牌堆和弃牌堆亮出等同于目标角色数的装备牌，每名目标角色将其中一张牌置于自己的装备区。",
		},
		list: [
			["diamond", 3, "jiejia"],
			["diamond", 4, "shan"],
			["diamond", 5, "yajiaoqiang"],
			["diamond", 6, "sha"],
			["diamond", 8, "shan"],
			["diamond", 9, "kaihua"],
			["diamond", 10, "yinfengjia"],
			["diamond", 11, "sha"],

			["club", 3, "jiejia"],
			["club", 4, "sha", "thunder"],
			["club", 5, "zheji"],
			["club", 6, "jiu"],
			["club", 8, "jiu"],
			["club", 9, "zhulu_card"],
			["club", 10, "jinhe"],
			["club", 11, "sha"],

			["heart", 3, "sha", "fire"],
			["heart", 4, "shan"],
			["heart", 5, "numa"],
			["heart", 6, "tao"],
			["heart", 8, "shan"],
			["heart", 9, "kaihua"],
			["heart", 10, "nvzhuang"],
			["heart", 11, "kaihua"],

			["spade", 3, "caochuan"],
			["spade", 4, "sha", "thunder"],
			["spade", 5, "wufengjian"],
			["spade", 6, "caochuan"],
			["spade", 8, "sha"],
			["spade", 9, "sha"],
			["spade", 10, "yexingyi"],
			["spade", 11, "sha"],
		],
	};
});
