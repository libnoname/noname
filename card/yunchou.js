import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "yunchou",
		card: {
			diaobingqianjiang: {
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return player == target || target.countCards("h");
				},
				contentBefore: function () {
					"step 0";
					game.delay();
					player.draw();
					"step 1";
					if (get.is.versus()) {
						player
							.chooseControl("顺时针", "逆时针", function (event, player) {
								if (player.next.side == player.side) return "逆时针";
								return "顺时针";
							})
							.set("prompt", "选择" + get.translation(card) + "的结算方向");
					} else {
						event.goto(3);
					}
					"step 2";
					if (result && result.control == "顺时针") {
						var evt = event.getParent();
						evt.fixedSeat = true;
						evt.targets.sortBySeat();
						evt.targets.reverse();
						if (evt.targets[evt.targets.length - 1] == player) {
							evt.targets.unshift(evt.targets.pop());
						}
					}
					"step 3";
					ui.clear();
					var cards = get.cards(Math.ceil(game.countPlayer() / 2));
					var dialog = ui.create.dialog("调兵遣将", cards, true);
					_status.dieClose.push(dialog);
					dialog.videoId = lib.status.videoId++;
					game.addVideo("cardDialog", null, ["调兵遣将", get.cardsInfo(cards), dialog.videoId]);
					event.getParent().preResult = dialog.videoId;
				},
				content: function () {
					"step 0";
					for (var i = 0; i < ui.dialogs.length; i++) {
						if (ui.dialogs[i].videoId == event.preResult) {
							event.dialog = ui.dialogs[i];
							break;
						}
					}
					if (!event.dialog || !target.countCards("h")) {
						event.finish();
						return;
					}
					var minValue = 20;
					var hs = target.getCards("h");
					for (var i = 0; i < hs.length; i++) {
						minValue = Math.min(minValue, get.value(hs[i], target));
					}
					if (target.isUnderControl(true)) {
						event.dialog.setCaption("选择一张牌并用一张手牌替换之");
					}
					var next = target.chooseButton(function (button) {
						return get.value(button.link, _status.event.player) - minValue;
					});
					next.set("dialog", event.preResult);
					next.set("closeDialog", false);
					next.set("dialogdisplay", true);
					"step 1";
					event.dialog.setCaption("调兵遣将");
					if (result.bool) {
						event.button = result.buttons[0];
						target.chooseCard("用一张牌牌替换" + get.translation(result.links), true).ai =
							function (card) {
								return -get.value(card);
							};
					} else {
						target.popup("不换");
						event.finish();
					}
					"step 2";
					if (result.bool) {
						target.lose(result.cards, ui.special);
						target.$throw(result.cards);
						game.log(target, "用", result.cards, "替换了", event.button.link);
						target.gain(event.button.link);
						target.$gain2(event.button.link);
						event.dialog.buttons.remove(event.button);
						event.dialog.buttons.push(
							ui.create.button(result.cards[0], "card", event.button.parentNode)
						);
						event.button.remove();
					}
					"step 3";
					game.delay(2);
				},
				contentAfter: function () {
					"step 0";
					event.dialog = get.idDialog(event.preResult);
					if (!event.dialog) {
						event.finish();
						return;
					}
					var nextSeat = _status.currentPhase.next;
					var att = get.attitude(player, nextSeat);
					if (player.isUnderControl(true) && !_status.auto) {
						event.dialog.setCaption("将任意张牌以任意顺序置于牌堆顶（先选择的在上）");
					}
					var next = player.chooseButton([1, event.dialog.buttons.length], event.dialog);
					next.ai = function (button) {
						if (att > 0) {
							return get.value(button.link, nextSeat) - 5;
						} else {
							return 5 - get.value(button.link, nextSeat);
						}
					};
					next.set("closeDialog", false);
					next.set("dialogdisplay", true);
					"step 1";
					if (result && result.bool && result.links && result.links.length) {
						for (var i = 0; i < result.buttons.length; i++) {
							event.dialog.buttons.remove(result.buttons[i]);
						}
						var cards = result.links.slice(0);
						while (cards.length) {
							ui.cardPile.insertBefore(cards.pop(), ui.cardPile.firstChild);
						}
						game.log(player, "将" + get.cnNumber(result.links.length) + "张牌置于牌堆顶");
					}
					for (var i = 0; i < event.dialog.buttons.length; i++) {
						event.dialog.buttons[i].link.discard();
					}
					"step 2";
					var dialog = event.dialog;
					dialog.close();
					_status.dieClose.remove(dialog);
					game.addVideo("cardDialog", null, event.preResult);
				},
				ai: {
					wuxie: function () {
						return 0;
					},
					basic: {
						order: 2,
						useful: [3, 1],
						value: [5, 1],
					},
					result: {
						player: (player, target) => {
							return 1 / game.countPlayer();
						},
						target: function (player, target) {
							if (target.countCards("h") == 0) return 0;
							return (
								(Math.sqrt(target.countCards("h")) -
									get.distance(player, target, "absolute") / game.countPlayer() / 3) /
								2
							);
						},
					},
					tag: {
						loseCard: 1,
						multitarget: 1,
					},
				},
			},
			caochuanjiejian: {
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: function (card, player, target) {
					return target.countCards("h") > 0 && target != player;
				},
				content: function () {
					"step 0";
					if (target.countCards("h", "sha")) {
						var name = get.translation(player.name);
						target
							.chooseControl()
							.set("prompt", get.translation("caochuanjiejian"))
							.set(
								"choiceList",
								[
									"将手牌中的所有杀交给" + name + "，并视为对" + name + "使用一张杀",
									"展示手牌并令" + name + "弃置任意一张",
								],
								function () {
									if (get.effect(player, { name: "sha" }, target, target) < 0) return 1;
									if (target.countCards("h", "sha") >= 3) return 1;
									return 0;
								}
							);
					} else {
						event.directfalse = true;
					}
					"step 1";
					if (event.directfalse || result.control == "选项二") {
						if (target.countCards("h")) {
							if (!player.isUnderControl(true)) {
								target.showHandcards();
							} else {
								game.log(target, "展示了", target.getCards("h"));
							}
							player.discardPlayerCard(target, "h", true, "visible");
						}
						event.finish();
					} else {
						var hs = target.getCards("h", "sha");
						player.gain(hs, target);
						target.$give(hs, player);
					}
					"step 2";
					target.useCard({ name: "sha" }, player);
				},
				ai: {
					order: 4,
					value: [5, 1],
					result: {
						target: function (player, target) {
							if (player.hasShan()) return -1;
							return 0;
						},
					},
				},
			},
			// xiaolicangdao:{
			// 	fullskin:true,
			// 	type:'trick',
			// 	enable:true,
			// 	filterTarget:function(card,player,target){
			// 		return target!=player;
			// 	},
			// 	multitarget:true,
			// 	content:function(){
			// 		'step 0'
			// 		if(cards&&cards.length){
			// 			target.gain(cards,player);
			// 			target.$gain2(cards);
			// 			if(cards.length==1){
			// 				event.card1=cards[0];
			// 			}
			// 		}
			// 		'step 1'
			// 		event.card2=target.getCards('h').randomGet();
			// 		if(event.card2){
			// 			target.discard(event.card2);
			// 		}
			// 		else{
			// 			event.finish();
			// 		}
			// 		'step 2'
			// 		if(event.card1&&event.card1.name==event.card2.name){
			// 			target.damage();
			// 		}
			// 	},
			// 	ai:{
			// 		order:6,
			// 		value:[3,1],
			// 		result:{
			// 			target:function(player,target){
			// 				return -2/Math.sqrt(1+target.countCards('h'));
			// 			},
			// 		},
			// 		tag:{
			// 			damage:1,
			// 			discard:1,
			// 			loseCard:1,
			// 		}
			// 	}
			// },
			geanguanhuo: {
				fullskin: true,
				type: "trick",
				filterTarget: function (card, player, target) {
					if (target == player) return false;
					return (
						target.countCards("h") > 0 &&
						game.hasPlayer(function (current) {
							return target.canCompare(current);
						})
					);
					//return ui.selected.targets[0].canCompare(target);
				},
				filterAddedTarget: function (card, player, target, preTarget) {
					return target != player && preTarget.canCompare(target);
				},
				enable: function () {
					return game.countPlayer() > 2;
				},
				recastable: function () {
					return game.countPlayer() <= 2;
				},
				multicheck: function (card, player) {
					return (
						game.countPlayer(function (current) {
							return current != player && current.countCards("h");
						}) > 1
					);
				},
				multitarget: true,
				multiline: true,
				singleCard: true,
				complexSelect: true,
				content: function () {
					"step 0";
					if (!event.addedTarget || !target.canCompare(event.addedTarget)) {
						event.finish();
						return;
					}
					target.chooseToCompare(event.addedTarget);
					"step 1";
					if (!result.tie) {
						if (result.bool) {
							if (event.addedTarget.countCards("he")) {
								target.line(event.addedTarget);
								target.gainPlayerCard(event.addedTarget, true);
							}
						} else {
							if (target.countCards("he")) {
								event.addedTarget.line(target);
								event.addedTarget.gainPlayerCard(target, true);
							}
						}
						event.finish();
					}
					"step 2";
					target.discardPlayerCard(player);
					target.line(player);
				},
				ai: {
					order: 5,
					value: [7, 1],
					useful: [4, 1],
					result: {
						target: -1,
					},
				},
			},
			shezhanqunru: {
				fullskin: true,
				type: "trick",
				enable: true,
				toself: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				modTarget: true,
				content: function () {
					"step 0";
					var list = game.filterPlayer(function (current) {
						return current != target && target.canCompare(current);
					});
					if (!list.length) {
						target.draw(3);
						event.finish();
					} else {
						list.sortBySeat(target);
						event.list = list;
						event.torespond = [];
					}
					"step 1";
					if (event.list.length) {
						event.current = event.list.shift();
						event.current
							.chooseBool(
								"是否响应" + get.translation(target) + "的舌战群儒？",
								function (event, player) {
									if (get.attitude(player, _status.event.source) >= 0) return false;
									var hs = player.getCards("h");
									var dutag = player.hasSkillTag("nodu");
									for (var i = 0; i < hs.length; i++) {
										var value = get.value(hs[i], player);
										if (hs[i].name == "du" && dutag) continue;
										if (value < 0) return true;
										if (!_status.event.hasTarget) {
											if (hs[i].number >= 8 && value <= 7) return true;
											if (value <= 3) return true;
										} else if (_status.event.hasTarget % 2 == 1) {
											if (hs[i].number >= 11 && value <= 6) return true;
										}
									}
									return false;
								}
							)
							.set("source", target)
							.set("hasTarget", event.torespond.length);
					} else {
						event.goto(3);
					}
					"step 2";
					if (result.bool) {
						event.torespond.push(event.current);
						event.current.line(target, "green");
						event.current.popup("响应");
						game.log(event.current, "响应了舌战群儒");
						game.delayx(0.5);
					}
					event.goto(1);
					"step 3";
					if (event.torespond.length == 0) {
						event.num = 1;
					} else {
						event.num = 0;
						target.chooseToCompare(event.torespond).callback = lib.card.shezhanqunru.callback;
					}
					"step 4";
					if (event.num > 0) {
						target.draw(3);
					}
				},
				callback: function () {
					if (event.card1.number > event.card2.number) {
						event.parent.parent.num++;
					} else {
						event.parent.parent.num--;
					}
				},
				ai: {
					order: 8.5,
					value: [6, 1],
					useful: [3, 1],
					tag: {
						draw: 3,
					},
					result: {
						target: function (player, target) {
							var hs = target.getCards("h");
							for (var i = 0; i < hs.length; i++) {
								var value = get.value(hs[i]);
								if (hs[i].number >= 7 && value <= 6) return 1;
								if (value <= 3) return 1;
							}
							return 0;
						},
					},
				},
			},
			youdishenru: {
				fullskin: true,
				type: "trick",
				notarget: true,
				wuxieable: true,
				global: "g_youdishenru",
				content: function () {
					"step 0";
					var info = event.getParent(2).youdiinfo || event.getParent(3).youdiinfo;
					if (!info) {
						event.finish();
						return;
					}
					info.evt.cancel();
					event.source = info.source;
					event.source.storage.youdishenru = player;
					event.source.addSkill("youdishenru");
					"step 1";
					var next = event.source
						.chooseToUse(
							{ name: "sha" },
							player,
							-1,
							"对" + get.translation(player) + "使用一张杀，或受到1点伤害"
						)
						.set("addCount", false);
					next.ai2 = function () {
						return 1;
					};
					"step 2";
					if (result.bool) {
						if (event.source.storage.youdishenru) {
							event.goto(1);
						} else {
							event.source.removeSkill("youdishenru");
						}
					} else {
						event.source.damage(player);
						event.source.removeSkill("youdishenru");
					}
				},
				ai: {
					value: [5, 1],
					useful: [5, 1],
					order: 1,
					wuxie: function (target, card, player, current, state) {
						return -state * get.attitude(player, current);
					},
					result: {
						player: function (player) {
							if (
								_status.event.parent.youdiinfo &&
								get.attitude(player, _status.event.parent.youdiinfo.source) <= 0
							) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			wangmeizhike: {
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: true,
				content() {
					"step 0";
					if (target.isMinHp() && target.isDamaged()) {
						target.recover();
						event.rec = true;
					}
					"step 1";
					if (target.isMinHandcard()) target.draw(event.rec ? 1 : 2);
				},
				ai: {
					order() {
						let player = _status.event.player,
							nan = player.hasCard((card) => {
								return get.name(card) === "nanman";
							}, "hs"),
							wan = player.hasCard((card) => {
								return get.name(card) === "wanjian";
							}, "hs"),
							aoe = 0,
							max = 0;
						game.countPlayer((current) => {
							if (get.attitude(player, current) <= 0) return false;
							let hp = current.isMinHp(),
								hc = current.isMinHandcard();
							if ((nan || wan) && (hp || hc)) aoe = 1;
							if (hp && hc && max !== 1) max = current === player ? 1 : -1;
						});
						if (aoe) {
							if (nan) aoe = Math.max(aoe, get.order("nanman"));
							if (wan) aoe = Math.max(aoe, get.order("wanjian"));
							return aoe + 0.2;
						}
						if (max) return 5.8;
						if (player.isDamaged() && player.isMinHp() && player.countCards("hs", "tao"))
							return get.order("tao") + 0.2;
						return 0.5;
					},
					value: 7,
					result: {
						target(player, target) {
							let num = 0,
								current = player.next,
								mei = 1,
								draw = target.hasSkillTag("nogain") ? 0.1 : 1;
							if (!ui.selected.cards) mei = 0;
							let mine = player.countCards("h", (card) => {
								if (mei > 0 && ui.selected.cards.includes(card)) return false;
								if (!mei && get.name(card) === "phd_wmzk") {
									mei = -1;
									return false;
								}
								return true;
							});
							if (player.hasSkillTag("noh") && player.countCards("h")) mine++;
							let min = mine;
							while (current !== player) {
								if (current.countCards("h") < min) min = current.countCards("h");
								current = current.next;
							}
							if (target.isMinHp() && target.isDamaged() && get.recoverEffect(target) > 0) {
								if (target.hp === 1) num += 3;
								else num += 2;
							}
							if (player === target) {
								if (mine <= min) num += (num ? 2 : 1) * draw;
							} else if (target.countCards("h") <= min) num += (num ? 2 : 1) * draw;
							return num;
						},
					},
					tag: {
						draw: 1.2,
						recover: 0.5,
					},
				},
			},
			suolianjia: {
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				skills: ["suolianjia"],
				onEquip: function () {
					if (player.isLinked() == false) player.link();
				},
				onLose: function () {
					if (player.isLinked()) player.link();
				},
				ai: {
					basic: {
						equipValue: 5,
					},
				},
			},
			chenhuodajie: {
				fullskin: true,
				type: "trick",
				filterTarget: true,
				global: "g_chenhuodajie",
				content: function () {
					if (target.countCards("he")) {
						player.gainPlayerCard("he", target, true);
					}
				},
				ai: {
					order: 1,
					useful: 6,
					value: 6,
					result: {
						target: -1,
					},
					tag: {
						loseCard: 1,
					},
				},
			},
			fudichouxin: {
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: function (card, player, target) {
					return player.canCompare(target);
				},
				content: function () {
					"step 0";
					player.chooseToCompare(target).set("preserve", "win").clear = false;
					"step 1";
					if (result.bool) {
						player.gain([result.player, result.target]);
						result.player.clone.moveDelete(player);
						result.target.clone.moveDelete(player);
						game.addVideo("gain2", player, get.cardsInfo([result.player, result.target]));
					} else if (!result.cancelled) {
						result.player.clone.delete();
						result.target.clone.delete();
						game.addVideo("deletenode", player, get.cardsInfo([result.player, result.target]));
					}
				},
				ai: {
					order: 4,
					value: [4, 1],
					result: {
						target: function (player) {
							if (player.countCards("h") <= 1) return 0;
							return -1;
						},
						player: function (player) {
							if (player.countCards("h") <= 1) return 0;
							return 0.5;
						},
					},
					tag: {
						loseCard: 1,
					},
				},
			},
			shuiyanqijun: {
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: function (card, player, target) {
					return target.countCards("e");
				},
				selectTarget: -1,
				content: function () {
					if (target.countCards("e")) target.chooseToDiscard("e", true);
				},
				reverseOrder: true,
				ai: {
					order: 9,
					result: {
						target: function (player, target) {
							if (target.countCards("e")) return -1;
							return 0;
						},
					},
					tag: {
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			toulianghuanzhu: {
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: function (card, player, target) {
					return target.countCards("h") > 0;
				},
				content: function () {
					"step 0";
					if (!target.countCards("h")) {
						event.finish();
						return;
					}
					var hs = player.getCards("h");
					if (hs.length) {
						var minval = get.value(hs[0]);
						var colors = [get.color(hs[0])];
						for (var i = 1; i < hs.length; i++) {
							var val = get.value(hs[i], player, "raw");
							if (val < minval) {
								minval = val;
								colors = [get.color(hs[i])];
							} else if (val == minval) {
								colors.add(get.color(hs[i]));
							}
						}
						player.chooseCardButton("偷梁换柱", target.getCards("h")).ai = function (button) {
							var val = get.value(button.link, player, "raw") - minval;
							if (val >= 0) {
								if (colors.includes(get.color(button.link))) {
									val += 3;
								}
							}
							return val;
						};
					} else {
						player.viewHandcards(target);
						event.finish();
					}
					"step 1";
					if (result.bool) {
						event.card = result.links[[0]];
						player.chooseCard("h", true, "用一张手牌替换" + get.translation(event.card)).ai =
							function (card) {
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
						if (get.color(event.card) == get.color(result.cards[0])) {
							player.draw();
						}
						target.addTempSkill("toulianghuanzhu_ai1");
					} else {
						target.addTempSkill("toulianghuanzhu_ai2");
					}
				},
				ai: {
					order: 8,
					tag: {
						loseCard: 1,
						norepeat: 1,
					},
					result: {
						target: function (player, target) {
							if (player.countCards("h") <= 1) return 0;
							if (target.hasSkill("toulianghuanzhu_ai2")) return 0;
							if (target.hasSkill("toulianghuanzhu_ai1")) return 0.5;
							return -1;
						},
					},
					useful: [4, 1],
					value: [6, 1],
				},
			},
			huoshan: {
				fullskin: true,
				type: "delay",
				cardcolor: "red",
				cardnature: "fire",
				toself: true,
				modTarget: function (card, player, target) {
					return lib.filter.judge(card, player, target);
				},
				enable: function (card, player) {
					return player.canAddJudge(card);
				},
				filterTarget: function (card, player, target) {
					return lib.filter.judge(card, player, target) && player == target;
				},
				selectTarget: [-1, -1],
				judge: function (card) {
					if (get.suit(card) == "heart" && get.number(card) > 1 && get.number(card) < 10) return -6;
					return 1;
				},
				judge2: function (result) {
					if (result.bool == false) return true;
					return false;
				},
				effect: function () {
					if (result.bool == false) {
						player.damage(2, "fire", "nosource");
						var players = game.filterPlayer(function (current) {
							return get.distance(player, current) <= 1 && player != current;
						});
						players.sort(lib.sort.seat);
						for (var i = 0; i < players.length; i++) {
							players[i].damage(1, "fire", "nosource");
						}
					} else {
						player.addJudgeNext(card);
					}
				},
				cancel: function () {
					player.addJudgeNext(card);
				},
				ai: {
					basic: {
						useful: 0,
						value: 0,
					},
					order: 1,
					result: {
						target: function (player, target) {
							return lib.card.shandian.ai.result.target(player, target);
						},
					},
					tag: {
						damage: 0.15,
						natureDamage: 0.15,
						fireDamage: 0.15,
					},
				},
			},
			hongshui: {
				type: "delay",
				toself: true,
				enable: function (card, player) {
					return player.canAddJudge(card);
				},
				modTarget: function (card, player, target) {
					return lib.filter.judge(card, player, target);
				},
				filterTarget: function (card, player, target) {
					return lib.filter.judge(card, player, target) && player == target;
				},
				selectTarget: [-1, -1],
				judge: function (card) {
					if (get.suit(card) == "club" && get.number(card) > 1 && get.number(card) < 10) return -3;
					return 1;
				},
				judge2: function (result) {
					if (result.bool == false) return true;
					return false;
				},
				fullskin: true,
				effect: function () {
					if (result.bool == false) {
						if (player.countCards("he") == 0) player.loseHp();
						else {
							player.discard(player.getCards("he").randomGets(3));
						}
						var players = get.players();
						for (var i = 0; i < players.length; i++) {
							var dist = get.distance(player, players[i]);
							if (dist <= 2 && player != players[i]) {
								var cs = players[i].getCards("he");
								if (cs.length == 0) players[i].loseHp();
								else {
									players[i].discard(cs.randomGets(3 - Math.max(1, dist)));
								}
							}
						}
					} else {
						player.addJudgeNext(card);
					}
				},
				cancel: function () {
					player.addJudgeNext(card);
				},
				ai: {
					basic: {
						useful: 0,
						value: 0,
					},
					order: 1,
					result: {
						target: function (player, target) {
							return lib.card.shandian.ai.result.target(player, target);
						},
					},
				},
			},
		},
		skill: {
			toulianghuanzhu_ai1: {},
			toulianghuanzhu_ai2: {},
			suolianjia: {
				equipSkill: true,
				trigger: { player: "damageBefore" },
				filter: function (event, player) {
					if (
						event.source &&
						event.source.hasSkillTag("unequip", false, {
							name: event.card ? event.card.name : null,
							target: player,
							card: event.card,
						})
					)
						return;
					if (event.hasNature()) return true;
				},
				forced: true,
				content: function () {
					trigger.cancel();
				},
				ai: {
					nofire: true,
					nothunder: true,
					effect: {
						target: function (card, player, target, current) {
							if (target.hasSkillTag("unequip2")) return;
							if (
								player.hasSkillTag("unequip", false, {
									name: card ? card.name : null,
									target: player,
									card: card,
								}) ||
								player.hasSkillTag("unequip_ai", false, {
									name: card ? card.name : null,
									target: target,
									card: card,
								})
							)
								return;
							if (card.name == "tiesuo" || get.tag(card, "natureDamage")) return "zeroplayertarget";
						},
					},
				},
			},
			toulianghuanzhu2: {},
			youdishenru: {
				trigger: { source: "damageEnd" },
				silent: true,
				onremove: true,
				filter: function (event, player) {
					return (
						event.card && event.card.name == "sha" && event.player == player.storage.youdishenru
					);
				},
				content: function () {
					delete player.storage.youdishenru;
				},
			},
			g_youdishenru: {
				trigger: { target: "shaBefore" },
				direct: true,
				filter: function (event, player) {
					return (
						!event.getParent().directHit.includes(player) && player.hasUsableCard("youdishenru")
					);
				},
				content: function () {
					event.youdiinfo = {
						source: trigger.player,
						evt: trigger,
					};
					player
						.chooseToUse(function (card, player) {
							if (get.name(card) != "youdishenru") return false;
							return lib.filter.cardEnabled(card, player, "forceEnable");
						}, "是否使用诱敌深入？")
						.set("source", trigger.player);
				},
			},
			g_chenhuodajie: {
				trigger: { global: "damageEnd" },
				direct: true,
				filter: function (event, player) {
					if (event.player == player) return false;
					if (!event.player.countCards("he")) return false;
					if (!lib.filter.targetEnabled({ name: "chenhuodajie" }, player, event.player))
						return false;
					if (event._notrigger.includes(event.player)) return false;
					return player.hasUsableCard("chenhuodajie");
				},
				content: function () {
					player.chooseToUse(
						get.prompt("chenhuodajie", trigger.player).replace(/发动/, "使用"),
						function (card, player) {
							if (card.name != "chenhuodajie") return false;
							return lib.filter.cardEnabled(card, player, "forceEnable");
						},
						trigger.player,
						-1
					).targetRequired = true;
				},
			},
		},
		translate: {
			diaobingqianjiang: "调兵遣将",
			diaobingqianjiang_info:
				"出牌阶段，对你及其他有手牌的角色使用。你摸一张牌，然后亮出牌堆顶的X张牌（X为存活角色数的一半，向上取整），目标可以用一张手牌替换其中的一张牌。结算后，你可以将剩余的牌中的任意张以任意顺序置于牌堆顶。",
			caochuanjiejian: "草船借箭",
			caochuanjiejian_info:
				"出牌阶段对一名有手牌的其他角色使用，目标选择一项：将手牌中的所有杀（至少1张）交给你，并视为对你使用一张杀；或展示手牌并令你弃置任意张。",
			// xiaolicangdao:'笑里藏刀',
			// xiaolicangdao_info:'出牌阶段，对一名其他角色使用。你将此【笑里藏刀】交给目标，然后弃置其一张手牌，若这两张牌牌名相同，你对其造成1点伤害。',
			shezhanqunru: "舌战群儒",
			shezhanqunru_info:
				"出牌阶段，对你使用。你请求所有有手牌的其他角色响应，然后同时与响应的角色拼点。若有角色响应且结果中你赢的次数更多，或若没有角色响应，你摸三张牌。",
			youdishenru: "诱敌深入",
			youdishenru_info:
				"当以你为目标的【杀】生效前，对此【杀】使用。抵消此【杀】，然后此【杀】的使用者需对你使用【杀】（在此【杀】结算结束之后，若此【杀】未对你造成伤害，其重复此流程），否则受到你造成的1点伤害。",
			suolianjia: "锁链甲",
			suolianjia_info: "锁定技，你防止即将受到的属性伤害，当装备时进入连环状态，当卸下时解除连环状态。",
			suolianjia_bg: "链",
			geanguanhuo: "隔岸观火",
			geanguanhuo_info:
				"出牌阶段对一名其他角色使用，令目标与一名你指定的另一名角色拼点，赢的角色获得对方的一张牌；若点数相同，目标可弃置你一张牌（存活角色不超过2时可重铸）。",
			toulianghuanzhu: "偷梁换柱",
			toulianghuanzhu_info:
				"出牌阶段对一名其他角色使用，你观看其手牌，然后可以用一张手牌替牌其中的一张；若两张牌颜色相同，你摸一张牌。",
			toulianghuanzhu_bg: "柱",
			fudichouxin: "釜底抽薪",
			fudichouxin_info: "与一名角色进行拼点，若成功则获得双方拼点牌。",
			shuiyanqijun: "水攻",
			shuiyanqijun_info: "令所有有装备的角色各弃置一张装备牌。",
			wangmeizhike: "望梅止渴",
			wangmeizhike_info:
				"出牌阶段对一名角色使用，若没有角色体力比目标少，目标回复1点体力；若没有角色手牌比目标少，目标摸两张牌（若因此牌回复了体力则改为摸一张）。",
			chenhuodajie: "趁火打劫",
			chenhuodajie_info: "任意一名其他角色受到伤害时对其使用，获得其一张牌。",
			huoshan: "火山",
			huoshan_info:
				"出牌阶段，对自己使用。若判定结果为红桃2~9，则目标角色受到2点火焰伤害，距离目标1以内的其他角色受到1点火焰伤害。若判定结果不为红桃2~9，将之移动到下家的判定区里。",
			hongshui: "洪水",
			hongshui_info:
				"出牌阶段，对自己使用。若判定结果为梅花2~9，该角色随机弃置三张牌，距离该角色为X的角色随机弃置3-X张牌，若没有牌则失去1点体力。若判定结果不为梅花2~9，将之移动到下家的判定区里。",
		},
		list: [
			["heart", 6, "huoshan", "fire"],
			["club", 7, "hongshui"],
			["diamond", 3, "guohe"],

			["diamond", 4, "fudichouxin"],
			["club", 6, "fudichouxin"],
			["spade", 1, "fudichouxin"],
			["club", 7, "shuiyanqijun"],
			["club", 8, "shuiyanqijun"],
			["club", 8, "guohe"],
			["spade", 9, "shuiyanqijun"],
			["heart", 9, "toulianghuanzhu"],
			["club", 10, "toulianghuanzhu"],
			["spade", 13, "guohe"],
			["heart", 6, "wangmeizhike"],
			["club", 1, "wangmeizhike"],
			["diamond", 6, "chenhuodajie"],
			["diamond", 9, "chenhuodajie"],
			["club", 3, "chenhuodajie"],

			["club", 13, "suolianjia"],

			["club", 3, "caochuanjiejian"],
			["spade", 7, "caochuanjiejian"],
			// ['spade',5,'xiaolicangdao'],
			// ['diamond',11,'xiaolicangdao'],
			["heart", 1, "geanguanhuo"],
			["spade", 6, "geanguanhuo"],
			["heart", 4, "shezhanqunru"],
			["club", 8, "shezhanqunru"],
			["diamond", 1, "diaobingqianjiang"],
			["spade", 2, "diaobingqianjiang"],
			["heart", 12, "youdishenru"],
			["club", 2, "youdishenru"],
			["spade", 9, "youdishenru"],
		],
	};
});
