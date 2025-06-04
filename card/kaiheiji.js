import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "kaiheiji",
		connect: true,
		card: {
			//新杀的劝酒
			khquanjiux: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: true,
				reverseOrder: true,
				multitarget: true,
				multiline: true,
				wuxieable: false,
				async content(event, trigger, player) {
					const { targets } = event;
					for (const target of targets) {
						const cards = target.getCards("h").randomGets(get.rand(1, target.countCards("h")));
						if (!cards.length) {
							continue;
						}
						target.addGaintag(cards, "khquanjiux_tag");
						cards.forEach(card => {
							game.broadcastAll(card => {
								if (!card.storage?.origin_info) {
									card.storage.origin_info = [card.suit, card.number, card.name, card.nature];
								}
								card.init([card.suit, card.number, "jiu"]);
								//改回原来的牌名
								card.destroyed = (card, position, player, event) => {
									if (card.storage?.origin_info) {
										card.init(card.storage.origin_info);
										delete card.storage.origin_info;
									}
									return false;
								};
							}, card);
						});
					}
					let count = 0;
					while (true) {
						const target = targets[count];
						count++;
						if (count >= targets.length) {
							count = 0;
						}
						if (!target?.isAlive()) {
							continue;
						}
						const { result } = await target
							.chooseToUse("劝酒：使用一张【酒】否则受到每名其他角色造成的一点伤害", function (card) {
								if (get.name(card) != "jiu") {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							})
							.set("ai1", () => 114514)
							.set("ai2", function () {
								return get.effect_use.apply(this, arguments) - get.event("effect") + 114514;
							})
							.set("targetRequired", true)
							.set(
								"effect",
								game.filterPlayer(current => current != target).reduce((eff, current) => eff + get.damageEffect(target, current, target), 0)
							)
							.set("addCount", false);
						if (!result?.bool) {
							const damage = game.filterPlayer(current => current != target).sortBySeat();
							if (damage.length) {
								while (damage.length) {
									const current = damage.shift();
									current.line(target, "yellow");
									await target.damage(current);
								}
							}
							break;
						}
					}
				},
				ai: {
					order: 1,
					useful: 7.5,
					value: 7.5,
					result: {
						target: -1,
					},
					tag: {
						damage: 0.2,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			//你死我活 —— by 点点
			nisiwohuo: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: lib.filter.notMe,
				reverseOrder: true,
				multitarget: true,
				multiline: true,
				wuxieable: false,
				global: "nisiwohuo_end",
				async content(event, trigger, player) {
					player.$skill(get.translation(event.name), null, get.groupnature(player.group, "raw"));
					const { targets } = event;
					game.broadcastAll(event => {
						if (!_status.nisiwohuo) {
							_status.nisiwohuo = [];
						}
						_status.nisiwohuo.push(event);
					}, event);
					let count = 0;
					const goon = function () {
						if (!_status.nisiwohuo?.includes(event)) {
							return false;
						}
						return true;
					};
					while (goon()) {
						const target = targets[count];
						count++;
						if (count >= targets.length) {
							count = 0;
						}
						if (!target.isAlive()) {
							continue;
						}
						const { result } = await target
							.chooseToUse(
								"你死我活：对距离为1的角色使用一张【杀】或失去1点体力",
								function (card) {
									if (get.name(card) != "sha") {
										return false;
									}
									return lib.filter.filterCard.apply(this, arguments);
								},
								function (card, player, target) {
									if (player == target) {
										return false;
									}
									const dist = get.distance(player, target);
									if (dist > 1) {
										if (
											game.hasPlayer(function (current) {
												return current != player && get.distance(player, current) < dist;
											})
										) {
											return false;
										}
									}
									return lib.filter.filterTarget.apply(this, arguments);
								}
							)
							.set("ai2", function () {
								return get.effect_use.apply(this, arguments) - get.event("effect");
							})
							.set("effect", get.effect(target, { name: "losehp" }, target, target))
							.set("addCount", false);
						if (!goon()) {
							break;
						}
						if (!result?.bool) {
							await target.loseHp();
							await game.delayx();
							if (!goon()) {
								break;
							}
						}
					}
				},
				ai: {
					order: 1,
					useful: 9.5,
					value: 10,
					result: {
						target: -1,
					},
					tag: {
						//damage: 0.5,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			//无天无界照搬无中ai
			wutian: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				toself: true,
				filterTarget(card, player, target) {
					return target == player;
				},
				modTarget: true,
				async content(event, trigger, player) {
					const next = get.info("olzhouxi").content(event, trigger, event.target);
					if (next) {
						await next;
					}
				},
				//用的无中的ai改的
				ai: {
					wuxie(target, card, player, viewer) {
						if (get.attitude(viewer, player._trueMe || player) > 0) {
							return 0;
						}
					},
					basic: {
						order: 7,
						useful: 4.5,
						value: 9.5,
					},
					result: {
						target: 2,
					},
				},
			},
			//兄弟齐心ai修改自推心置腹
			qixin: {
				audio: true,
				fullskin: true,
				enable: true,
				type: "trick",
				filterTarget: lib.filter.notMe,
				modTarget: lib.filter.notMe,
				async content(event, trigger, player) {
					const target = event.target,
						cards1 = player.getCards("h"),
						cards2 = target.getCards("h");
					if (!cards1.length && !cards2.length) {
						return;
					}
					await game
						.loseAsync({
							lose_list: [
								[player, cards1],
								[target, cards2],
							],
						})
						.setContent("chooseToCompareLose");
					const result = await target
						.chooseToMove("兄弟同心：请分配" + get.translation(player) + "和你的手牌", true)
						.set("list", [
							[get.translation(player) + "获得的牌", cards1],
							["你获得的牌", cards2],
						])
						.set("processAI", function (list) {
							const player = get.player(),
								target = get.event().getParent().player,
								att = get.attitude(player, target),
								cards1 = get.event().cards1,
								cardx1 = cards1.filter(card => card.name == "du"),
								cardy1 = cards1.removeArray(cardx1),
								cards2 = get.event().cards2,
								cardx2 = cards2.filter(card => card.name == "du"),
								cardy2 = cards2.removeArray(cardx2);
							switch (get.sgn(att)) {
								case 1: {
									//这里的ai写得很糙
									const cards = cards1.concat(cards2);
									const cardsx = cards.filter(card => 8 - get.value(card, target));
									return [cardsx, cards.removeArray(cardsx)];
								}
								case 0:
								case -1:
									return [cardx1.concat(cardx2), cardy1.concat(cardy2)];
							}
						})
						.set("cards1", cards1)
						.set("cards2", cards2)
						.forResult();
					if (result?.bool && result?.moved?.length) {
						if (result.moved[0]?.length) {
							await player.gain(result.moved[0], "draw");
						}
						if (result.moved[1]?.length) {
							await target.gain(result.moved[1], "draw");
						}
						const num = player.countCards("h") - target.countCards("h");
						if (num > 0) {
							await target.draw();
						} else if (num < 0) {
							await player.draw();
						}
					}
				},
				ai: {
					order: 5,
					tag: {
						loseCard: 1,
						gain: 1,
					},
					wuxie(target, card, player, viewer) {
						if (get.attitude(player, target) > 0 && get.attitude(viewer, player) > 0) {
							return 0;
						}
					},
					result: {
						target(player, target) {
							if (get.attitude(player, target) <= 0) {
								return 0;
							}
							return 1 + target.countCards("h");
						},
					},
				},
			},
			//两肋插刀照搬增兵减灶ai
			chadao: {
				audio: true,
				fullskin: true,
				enable: true,
				type: "trick",
				filterTarget: lib.filter.notMe,
				modTarget: true,
				content() {
					const cards = [];
					while (cards.length < 2) {
						const card = get.cardPile(card => get.tag(card, "damage") > 0.5 && !cards.includes(card));
						if (card) {
							cards.add(card);
						} else {
							break;
						}
					}
					if (cards.length) {
						target.gain(cards, "gain2");
					}
				},
				//增兵减灶的ai
				ai: {
					order: 7,
					useful: 4,
					value: 9,
					tag: {
						draw: 2,
					},
					result: {
						target(player, target) {
							if (target.hasJudge("lebu")) {
								return 0;
							}
							return Math.max(1, 2 - target.countCards("h") / 10);
						},
					},
				},
			},
			//劝酒ai不完善
			khquanjiu: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: true,
				reverseOrder: true,
				async content(event, trigger, player) {
					const target = event.target;
					const result = await target
						.chooseToUse("劝酒：使用一张【酒】或点数为9的牌，否则失去1点体力", function (card) {
							if (get.name(card) != "jiu" && get.number(card) != "unsure" && get.number(card) != 9) {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						})
						.set("ai2", function () {
							return get.effect_use.apply(this, arguments) - _status.event.effect;
						})
						.set("targetRequired", true)
						.set("effect", get.effect(target, { name: "losehp" }, target, target))
						.set("addCount", false)
						.forResult();
					if (!result.bool) {
						await target.loseHp();
					}
				},
				ai: {
					wuxie(target, card, player, viewer, status) {
						let att = get.attitude(viewer, target),
							eff = get.effect(target, card, player, target);
						if (Math.abs(att) < 1 || status * eff * att >= 0) {
							return 0;
						}
						return 1;
					},
					basic: {
						order: 7.2,
						useful: [5, 1],
						value: 5,
					},
					result: {
						player(player, target) {
							let res = 0,
								att = get.sgnAttitude(player, target);
							res -= att * (0.8 * target.countCards("hs") + 0.6 * target.countCards("e") + 3.6);
							return res;
						},
						target(player, target) {
							return -1;
						},
					},
					tag: {
						respond: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			//落井下石改自趁火打劫的ai
			luojing: {
				global: "luojing_skill",
				audio: true,
				fullskin: true,
				type: "trick",
				ai: {
					order: 1,
					useful: 6,
					value: 9,
					result: {
						target: -1,
					},
				},
				filterTarget(card, player, target) {
					return player != target && target.isDying();
				},
				content() {
					player.$skill(get.translation("luojing"), null, get.groupnature(player.group, "raw"));
					const evt = event.getParent("dying");
					if (evt.player == target) {
						evt.set("skipTao", true);
						evt.untrigger();
						game.log(target, "跳过了濒死结算");
					}
					player
						.when({ global: "dieAfter" })
						.filter(evtx => evtx.player == target)
						.then(() => {
							player.draw();
						});
				},
			},
			//红运当头用的树上开花的ai
			hongyun: {
				enable: true,
				fullskin: true,
				type: "trick",
				toself: true,
				filterTarget(card, player, target) {
					return target != player && target.countCards("h");
				},
				changeTarget(player, targets) {
					targets.push(player);
				},
				modTarget: true,
				async content(event, trigger, player) {
					const target = event.target;
					const result = await target
						.chooseToDiscard(`红运当头：是否弃置至多两张牌然后获得等量红桃牌`, [1, 2], "he")
						.set("ai", card => 6 - get.value(card))
						.forResult();
					if (result?.bool && result.cards) {
						const cards = [];
						while (cards.length < result.cards.length) {
							const card = get.cardPile(card => get.suit(card) == "heart" && !cards.includes(card));
							if (card) {
								cards.add(card);
							} else {
								break;
							}
						}
						if (cards.length) {
							await target.gain(cards, "gain2", "log");
						} else {
							target.chat("无事发生");
						}
					}
				},
				//修改树上开花的ai
				ai: {
					wuxie() {
						return 0;
					},
					basic: {
						useful: 3,
						value: 3,
						order: 5,
					},
					result: {
						target(player, target, card) {
							var cards = ui.selected.cards.concat(card.cards || []);
							var num = player.countCards("he", function (card) {
								if (cards.includes(card)) {
									return false;
								}
								return 6 > get.value(card);
							});
							if (!num) {
								return 0;
							}
							if (num < 2) {
								return 0.5;
							}
							return 1.2;
						},
					},
					tag: {
						loseCard: 1,
						discard: 1,
						//norepeat: 1,
					},
				},
			},
			//生死与共改自趁火打劫的ai
			shengsi: {
				global: "shengsi_skill",
				fullskin: true,
				type: "trick",
				filterTarget(card, player, target) {
					return player != target && target.isDying();
				},
				content() {
					player.addSkill("shengsi_debuff");
					player.markAuto("shengsi_debuff", target);
					target.recover(2);
				},
				ai: {
					order: 1,
					useful: 6,
					value: 6,
					result: { target: 1 },
					tag: { recover: 2 },
				},
			},
			//雷公ai不完善
			leigong: {
				global: ["leigong_skill"],
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: true,
				reverseOrder: true,
				async content(event, trigger, player) {
					const target = event.target,
						cardname = "shandian";
					const VCard = ui.create.card();
					VCard._destroy = true;
					VCard.expired = true;
					const info = lib.card[cardname];
					VCard.init(["", "", cardname, info && info.cardnature]);
					target.$phaseJudge(VCard);
					target.popup(cardname, "thunder");
					const result = await target.judge(VCard).forResult();
					ui.clear();
					VCard.delete();
					if (result.bool == false) {
						await target.damage(3, "thunder", "nosource");
					}
				},
				ai: {
					wuxie(target, card, player, viewer, status) {
						let att = get.attitude(viewer, target),
							eff = get.effect(target, card, player, target);
						if (Math.abs(att) < 1 || status * eff * att >= 0) {
							return 0;
						}
						return 1;
					},
					basic: {
						order: 4,
						useful: [5, 1],
						value: 4,
					},
					result: {
						target(player, target) {
							return -1;
						},
					},
					tag: {
						damage: 0.16,
						thunderDamage: 0.16,
						natureDamage: 0.16,
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			//有难同当照搬铁索ai
			younan: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget(card, player, target) {
					return !target.isLinked();
				},
				reverseOrder: true,
				content() {
					if (!target.isLinked()) {
						target.link(true);
					}
				},
				//照搬铁索的ai
				ai: {
					wuxie: (target, card, player, viewer, status) => {
						if (status * get.attitude(viewer, player._trueMe || player) > 0 || target.hasSkillTag("noLink") || target.hasSkillTag("nodamage") || target.hasSkillTag("nofire") || target.hasSkillTag("nothunder")) {
							return 0;
						}
						if (get.damageEffect(target, player, viewer, "thunder") >= 0 || get.damageEffect(target, player, viewer, "fire") >= 0) {
							return 0;
						}
						if (target.hp + target.hujia > 2 && target.mayHaveShan(viewer, "use")) {
							return 0;
						}
					},
					basic: {
						order: 7.3,
						useful: 1.2,
						value: 4,
					},
					result: {
						target: (player, target) => {
							if (target.hasSkillTag("link") || target.hasSkillTag("noLink")) {
								return 0;
							}
							let curs = game.filterPlayer(current => {
								if (current.hasSkillTag("noLink") || current.hasSkillTag("nodamage")) {
									return false;
								}
								return !current.hasSkillTag("nofire") || !current.hasSkillTag("nothunder");
							});
							if (curs.length < 2) {
								return 0;
							}
							let f = target.hasSkillTag("nofire"),
								t = target.hasSkillTag("nothunder"),
								res = 0.9;
							if ((f && t) || target.hasSkillTag("nodamage")) {
								return 0;
							}
							if (f || t) {
								res = 0.45;
							}
							if (!f && target.getEquip("tengjia")) {
								res *= 2;
							}
							if (!target.isLinked()) {
								res = -res;
							}
							if (ui.selected.targets.length) {
								return res;
							}
							let fs = 0,
								es = 0,
								att = get.attitude(player, target),
								linkf = false,
								alink = true;
							curs.forEach(i => {
								let atti = get.attitude(player, i);
								if (atti > 0) {
									fs++;
									if (i.isLinked()) {
										linkf = true;
									}
								} else if (atti < 0) {
									es++;
									if (!i.isLinked()) {
										alink = false;
									}
								}
							});
							if (es < 2 && !alink) {
								if (att <= 0 || (att > 0 && linkf && fs < 2)) {
									return 0;
								}
							}
							return res;
						},
					},
					tag: {
						multitarget: 1,
						multineg: 1,
						norepeat: 1,
					},
				},
			},
		},
		skill: {
			nisiwohuo_end: {
				trigger: { global: "die" },
				firstDo: true,
				silent: true,
				content() {
					game.broadcastAll(() => {
						if (_status.nisiwohuo?.length) {
							delete _status.nisiwohuo;
						}
					});
				},
			},
			luojing_skill: {
				trigger: { global: "dying" },
				firstDo: true,
				silent: true,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					if (!lib.filter.targetEnabled({ name: "luojing" }, player, event.player)) {
						return false;
					}
					if (event.player.hp > 0) {
						return false;
					}
					return player.hasUsableCard("luojing");
				},
				content() {
					player
						.chooseToUse(
							get.prompt("luojing", trigger.player).replace(/发动/, "使用"),
							function (card, player) {
								if (get.name(card) != "luojing") {
									return false;
								}
								return lib.filter.cardEnabled(card, player, "forceEnable");
							},
							-1
						)
						.set("sourcex", trigger.player)
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex) {
								return false;
							}
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("targetRequired", true);
				},
			},
			shengsi_skill: {
				trigger: { global: "dying" },
				silent: true,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					if (!lib.filter.targetEnabled({ name: "shengsi" }, player, event.player)) {
						return false;
					}
					if (event.player.hp > 0) {
						return false;
					}
					return player.hasUsableCard("shengsi");
				},
				content() {
					player
						.chooseToUse(
							get.prompt("shengsi", trigger.player).replace(/发动/, "使用"),
							function (card, player) {
								if (get.name(card) != "shengsi") {
									return false;
								}
								return lib.filter.cardEnabled(card, player, "forceEnable");
							},
							-1
						)
						.set("sourcex", trigger.player)
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex) {
								return false;
							}
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("targetRequired", true);
				},
			},
			shengsi_debuff: {
				charlotte: true,
				forced: true,
				popup: false,
				intro: {
					content: "你与$生死与共",
				},
				marktext: "生",
				mark: true,
				trigger: { global: "dieAfter" },
				filter(event, player) {
					return player.getStorage("shengsi_debuff").includes(event.player);
				},
				content() {
					player.$skill(get.translation("shengsi"), null, get.groupnature(player.group, "raw"));
					player.unmarkAuto(event.name, trigger.player);
					player.die();
				},
			},
			leigong_skill: {
				silent: true,
				firstDo: true,
				trigger: { player: "useCardEnd" },
				filter(event, player) {
					return event.card.name == "leigong";
				},
				content() {
					const num = game.countPlayer2(target => target.hasHistory("damage", evt => evt.getParent(2) == trigger && evt.notLink()));
					if (num > 0) {
						player.draw(num);
					}
				},
			},
		},
		translate: {
			khquanjiux: "劝酒",
			khquanjiux_tag: "劝酒",
			khquanjiux_bg: "劝",
			khquanjiux_info: "出牌阶段，对所有角色使用，所有角色手牌随机变成【酒】，然后依次使用一张【酒】，重复此效果直到有角色不使用，该角色受到每名其他角色造成的一点伤害。此牌不能被【无懈可击】响应。",
			nisiwohuo: "你死我活",
			nisiwohuo_end: "你死我活",
			nisiwohuo_bg: "死",
			nisiwohuo_info: "出牌阶段，对其他所有角色使用，令目标依次对距离最近的角色使用一张【杀】，否则失去1点体力，重复效果直至有人死亡。此牌不能被【无懈可击】响应。",
			wutian: "无天无界",
			wutian_bg: "界",
			wutian_info: "出牌阶段，对自己使用，从三个可造成伤害的技能中选择一个获得至你的下回合开始。",
			qixin: "兄弟齐心",
			qixin_bg: "齐",
			qixin_info: "出牌阶段，对一名其他角色使用，令其重新分配你们的手牌，然后你们中手牌较少的角色摸一张牌。",
			chadao: "两肋插刀",
			chadao_bg: "插",
			chadao_info: "出牌阶段，对一名其他角色使用，令其获得两张伤害牌。",
			khquanjiu: "劝酒",
			khquanjiu_bg: "劝",
			khquanjiu_info: "出牌阶段，对所有角色使用，令目标使用一张【酒】或点数为9的牌，不使用牌的角色失去1点体力。",
			luojing: "落井下石",
			luojing_bg: "落",
			luojing_skill: "落井下石",
			luojing_info: "一名其他角色进入濒死状态时，对其使用，结束其濒死结算，其死亡后你摸一张牌。",
			hongyun: "红运当头",
			hongyun_bg: "红",
			hongyun_info: "出牌阶段，对你和一名有手牌的其他角色使用，令你与其各弃置至多两张牌，从牌堆或弃牌堆中获得等量红桃牌。",
			shengsi: "生死与共",
			shengsi_bg: "生",
			shengsi_skill: "生死与共",
			shengsi_debuff: "生死与共",
			shengsi_info: "其他角色濒死时，对其使用，令其回复2点体力，其死亡后你立即死亡。",
			younan: "有难同当",
			younan_bg: "难",
			younan_info: "出牌阶段，对所有未处于连环状态的角色使用，令目标进入连环状态。",
			leigong: "雷公助我",
			leigong_skill: "雷公助我",
			leigong_bg: "雷",
			leigong_info: "出牌阶段，对所有角色使用，令目标依次进行一次【闪电】判定，然后每有一名角色因此受到非传导伤害，你摸一张牌。",
		},
		list: [
			["spade", 13, "khquanjiux"],
			["diamond", 13, "khquanjiux"],
			["heart", 13, "khquanjiux"],
			["club", 13, "khquanjiux"],

			["spade", 13, "nisiwohuo"],
			["diamond", 13, "nisiwohuo"],
			["heart", 13, "nisiwohuo"],
			["club", 13, "nisiwohuo"],

			["heart", 13, "wutian"],
			["club", 13, "wutian"],

			["diamond", 11, "qixin"],
			["heart", 11, "qixin"],

			["spade", 10, "chadao"],
			["diamond", 10, "chadao"],
			["heart", 10, "chadao"],
			["club", 10, "chadao"],

			["diamond", 12, "khquanjiu"],
			["heart", 12, "khquanjiu"],

			["heart", 5, "hongyun"],
			["spade", 5, "hongyun"],
			["club", 5, "hongyun"],

			["heart", 7, "luojing"],
			["club", 7, "luojing"],

			["diamond", 4, "shengsi"],
			["heart", 4, "shengsi"],

			["diamond", 8, "leigong"],
			["heart", 8, "leigong"],
			["spade", 8, "leigong"],

			["spade", 6, "younan"],
			["diamond", 6, "younan"],
			["heart", 6, "younan"],
			["club", 6, "younan"],
		],
	};
});
