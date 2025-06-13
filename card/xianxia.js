import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "xianxia",
		connect: true,
		card: {
			tiejili: {
				fullskin: true,
				derivation: "ty_shamoke",
				type: "equip",
				subtype: "equip1",
				cardcolor: "spade",
				distance: {
					attackRange(card, player) {
						return player.storage.tiejili_skill || 2;
					},
					attackFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 2,
					},
				},
				skills: ["tiejili_skill"],
				onLose() {
					delete player.storage.tiejili_skill;
					player.unmarkSkill("tiejili_skill");
				},
				destroy: true,
				onEquip() {
					if (!card.storage.tiejili_skill) {
						card.storage.tiejili_skill = 2;
					}
					player.storage.tiejili_skill = card.storage.tiejili_skill;
				},
			},
			lx_huoshaolianying: {
				audio: "huoshaolianying",
				fullskin: true,
				type: "trick",
				cardnature: "fire",
				derivation: "ty_luxun",
				cardimage: "huoshaolianying",
				enable: true,
				filterTarget(card, player, target) {
					return target.countCards("he") > 0;
				},
				async content(event, trigger, player) {
					const target = event.target;
					if (target.countCards("he") == 0) {
						return;
					}
					let result;
					if (target.countCards("he") == 1) {
						result = { bool: true, cards: target.getCards("he") };
					} else {
						result = await player
							.choosePlayerCard(target, true, "he")
							.set("ai", function (button) {
								if (_status.event.getRand() < 0.5) {
									return Math.random();
								}
								return get.value(button.link);
							})
							.forResult();
					}
					if (!result || !result.bool) {
						return;
					}
					await target.showCards(result.cards).setContent(function () {});
					event.dialog = ui.create.dialog(get.translation(target) + "展示的手牌", result.cards);
					event.videoId = lib.status.videoId++;

					game.broadcast("createDialog", event.videoId, get.translation(target) + "展示的手牌", result.cards);
					game.addVideo("cardDialog", null, [get.translation(target) + "展示的手牌", get.cardsInfo(result.cards), event.videoId]);
					game.log(target, "展示了", result.cards);
					game.addCardKnower(result.cards, "everyone");
					await game.delay();
					const result2 = await player
						.chooseToDiscard({ suit: get.suit(result.cards[0]) }, function (card) {
							var evt = _status.event.getParent();
							if (get.damageEffect(evt.target, evt.player, evt.player, "fire") > 0) {
								return 6.2 + Math.min(4, evt.player.hp) - get.value(card, evt.player);
							}
							return -1;
						})
						.set("prompt", false)
						.forResult();
					event.dialog.close();
					game.addVideo("cardDialog", null, event.videoId);
					game.broadcast("closeDialog", event.videoId);
					if (result2.bool) {
						let discards = result.cards.slice(0).filter(card => lib.filter.canBeDiscarded(card, player, target, event));
						if (discards.length) {
							await target.discard(discards);
						}
						await target.damage("fire");
						if (target.isLinked() && event.cards?.someInD()) {
							await player.gain(event.cards.filterInD(), "gain2");
						}
					} else {
						target.addTempSkill("huogong2");
					}
				},
				ai: {
					basic: {
						order: 9.2,
						value: [3, 1],
						useful: 0.6,
					},
					wuxie(target, card, player, viewer, status) {
						if (get.attitude(viewer, player._trueMe || player) > 0) {
							return 0;
						}
						if (status * get.attitude(viewer, target) * get.effect(target, card, player, target) >= 0) {
							return 0;
						}
						if (_status.event.getRand("huogong_wuxie") * 4 > player.countCards("h")) {
							return 0;
						}
					},
					result: {
						player(player) {
							var nh = player.countCards("h");
							if (nh <= player.hp && nh <= 4 && _status.event.name == "chooseToUse") {
								if (typeof _status.event.filterCard == "function" && _status.event.filterCard(new lib.element.VCard({ name: "lx_huoshaolianying" }), player, _status.event)) {
									return -10;
								}
								if (_status.event.skill) {
									var viewAs = get.info(_status.event.skill).viewAs;
									if (viewAs == "lx_huoshaolianying") {
										return -10;
									}
									if (viewAs && viewAs.name == "huogong") {
										return -10;
									}
								}
							}
							return 0;
						},
						target(player, target) {
							if (target.hasSkill("huogong2") || target.countCards("h") == 0) {
								return 0;
							}
							if (player.countCards("h") <= 1) {
								return 0;
							}
							if (_status.event.player == player) {
								if (target.isAllCardsKnown(player)) {
									if (
										!target.countCards("h", card => {
											return player.countCards("h", card2 => {
												return get.suit(card2) == get.suit(card);
											});
										})
									) {
										return 0;
									}
								}
							}
							if (target == player) {
								if (typeof _status.event.filterCard == "function" && _status.event.filterCard(new lib.element.VCard({ name: "lx_huoshaolianying" }), player, _status.event)) {
									return -1.15;
								}
								if (_status.event.skill) {
									var viewAs = get.info(_status.event.skill).viewAs;
									if (viewAs == "lx_huoshaolianying") {
										return -1.15;
									}
									if (viewAs && viewAs.name == "lx_huoshaolianying") {
										return -1.15;
									}
								}
								return 0;
							}
							return -1.15;
						},
					},
					tag: {
						damage: 1,
						fireDamage: 1,
						natureDamage: 1,
						norepeat: 1,
					},
				},
			},
			suibozhuliu: {
				audio: true,
				fullskin: true,
				type: "delay",
				modTarget(card, player, target) {
					return lib.filter.judge(card, player, target);
				},
				enable(card, player) {
					return player.canAddJudge(card);
				},
				filterTarget(card, player, target) {
					return lib.filter.judge(card, player, target) && player == target;
				},
				selectTarget: [-1, -1],
				toself: true,
				judge(card) {
					if (get.suit(card) == "diamond") {
						return -2;
					}
					return 1;
				},
				judge2(result) {
					if (result.bool == false) {
						return true;
					}
					return false;
				},
				effect() {
					"step 0";
					if (result.bool == false && player.countCards("e")) {
						player
							.choosePlayerCard("e", player, true)
							.set("filterButton", button => {
								let player = get.player(),
									filter = card => ["equip3", "equip4", "equip6"].includes(get.subtype(card));
								if (player.countCards("e", card => filter(card))) {
									return filter(button.link);
								}
								return true;
							})
							.set("ai", button => {
								let player = get.player(),
									att = get.attitude(player, player.getNext());
								if (att > 0) {
									return player.getNext().getUseValue(button.link) - player.getUseValue(button.link);
								}
								return 6 - get.value(button.link);
							});
					} else {
						event.goto(2);
					}
					"step 1";
					if (result.cards) {
						let target = player.getNext(),
							card = result.cards[0];
						if (target.canEquip(card)) {
							target.equip(card);
							player.$give(card, target);
						} else {
							player.give(card, target);
						}
					}
					"step 2";
					player.addJudgeNext(event.card);
				},
				cancel() {
					player.addJudgeNext(card);
				},
				ai: {
					basic: {
						order: 1,
						value: 1,
						useful: 1,
					},
					result: {
						target(player, target) {
							var num = game.countPlayer(function (current) {
								for (var j = 0; j < current.skills.length; j++) {
									var rejudge = get.tag(current.skills[j], "rejudge", current);
									if (rejudge != undefined) {
										if (get.attitude(target, current) > 0 && get.attitude(current, target) > 0) {
											return rejudge;
										} else {
											return -rejudge;
										}
									}
								}
							});
							if (num > 0) {
								return num;
							}
							return 1;
						},
					},
				},
			},
			ty_feilongduofeng: {
				fullskin: true,
				cardimage: "feilongduofeng",
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -1 },
				ai: { basic: { equipValue: 2 } },
				skills: ["ty_feilongduofeng_skill"],
				onLose() {
					if (player.storage.counttrigger?.ty_feilongduofeng_skill > 0) {
						delete player.storage.counttrigger.ty_feilongduofeng_skill;
					}
				},
			},
			shangfangbaojian: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -1 },
				ai: {
					basic: {
						equipValue: 2,
					},
				},
				skills: ["shangfangbaojian_skill"],
			},
			qingmingjian: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -2 },
				ai: {
					basic: {
						equipValue: 2,
					},
				},
				skills: ["qingmingjian_skill"],
			},
			mengchong: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip6",
				subtypes: ["equip3", "equip4"],
				nomod: true,
				nopower: true,
				skills: ["mengchong_skill"],
				onLose() {
					delete player.storage.mengchong_skill;
					player.unmarkSkill("mengchong_skill");
				},
				ai: {
					equipValue(card, player) {
						if (player.countCards("e", { subtype: ["equip3", "equip4"] }) > 1) {
							return 1;
						}
						return 7.2;
					},
					basic: {
						equipValue: 7.2,
					},
				},
			},
			yidugongdu: {
				audio: true,
				fullskin: true,
				type: "trick",
				derivation: "drag_huaci",
				enable: true,
				filterTarget(card, player, target) {
					return target.isDamaged();
				},
				async content(event, trigger, player) {
					const target = event.target;
					await player.viewHandcards(target);
					if (player.countCards("h", "du") && target.countCards("h", "du")) {
						let chooseButton;
						if (player == target) {
							chooseButton = ["以毒攻毒：弃置其中一张【毒】", "<div class='text center'>你的手牌</div>", player.getCards("h")];
						} else {
							chooseButton = ["以毒攻毒：弃置其中一张【毒】", "<div class='text center'>你的手牌</div>", player.getCards("h"), `<div class="text center">${get.translation(target.name)}的手牌</div>`, target.getCards("h")];
						}
						const result = await player
							.chooseButton(chooseButton, true)
							.set("filterButton", button => {
								return get.name(button.link) == "du";
							})
							.set("ai", button => {
								const player = get.player(),
									target = get.owner(button.link);
								let eff = get.effect(target, { name: "losehp" }, target, player);
								if (target.hasSkillTag("usedu")) {
									return -2 * eff;
								}
								if (target.hasSkillTag("nodu")) {
									return 0;
								}
								return eff;
							})
							.forResult();
						if (!result.bool) {
							return;
						}
						const owner = get.owner(result.links[0]);
						await owner.discard(result.links, "notBySelf", player);
						await game.asyncDraw([player, target], 2);
					} else {
						await player.damage("nosource");
						await target.damage("nosource");
					}
				},
				ai: {
					basic: {
						order: 9.2,
						value: [3, 1],
						useful: 0.6,
					},
					wuxie(target, card, player, viewer, status) {
						if (get.attitude(viewer, player._trueMe || player) > 0) {
							return 0;
						}
						if (status * get.attitude(viewer, target) * get.effect(target, card, player, target) >= 0) {
							return 0;
						}
					},
					result: {
						target(player, target) {
							const bool = current => current.getKnownCards(player).some(card => get.name(card, current) == "du");
							if (bool(player) && bool(target)) {
								let eff1 = current => (current.hasSkillTag("usedu") ? 5 : current.hasSkillTag("nodu") ? 0 : get.effect(current, { name: "losehp" }, current, player)),
									eff = Math.max(eff1(player), eff1(target));
								return 4 + eff;
							}
							return get.damageEffect(target, target) + get.damageEffect(player, player);
						},
					},
					tag: {
						damage: 1,
						draw: 2,
					},
				},
			},
			dajunyajing: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: true,
				async content(event, trigger, player) {
					const target = event.target;
					const targets = game
						.filterPlayer(current => {
							return current != target;
						})
						.sortBySeat(_status.currentPhase);
					for (const current of targets) {
						if (!target.isIn()) {
							return;
						}
						if (!current.isIn() || !current.countCards("hes") || current.hasSkill("diaohulishan")) {
							continue;
						}
						const next = current.chooseToUse();
						next.set("openskilldialog", `大军压境：是否将一张牌当作【杀】对${get.translation(target)}使用？`);
						next.set("norestore", true);
						next.set("_backupevent", `dajunyajing_backup`);
						next.set("custom", {
							add: {},
							replace: { window() {} },
						});
						next.backup(`dajunyajing_backup`);
						next.set("targetRequired", true);
						next.set("complexSelect", true);
						next.set("filterTarget", function (card, player, target) {
							const { sourcex } = get.event();
							if (target != sourcex && !ui.selected.targets.includes(sourcex)) {
								return false;
							}
							return lib.filter.targetEnabled.apply(this, arguments);
						});
						next.set("sourcex", target);
						next.set("addCount", false);
						await next;
					}
				},
				ai: {
					order: 6,
					value: 12,
					useful: 10,
					tag: {
						damage: 1,
					},
					result: {
						target(player, target) {
							return -1 * (game.countPlayer() - 1);
						},
					},
				},
			},
		},
		skill: {
			tiejili_skill: {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				equipSkill: true,
				intro: {
					content(storage, player) {
						return "此牌攻击范围为" + (storage || 2);
					},
				},
				check(event, player) {
					if (player.hasSkill("gzjili")) {
						return player.hp > 2 && player.hp < 5;
					}
					return player.storage.tiejili_skill < player.hp;
				},
				onremove: true,
				filter(event, player) {
					return player.storage.tiejili_skill != player.hp;
				},
				prompt2(event, player) {
					return "将【铁蒺藜骨朵】本回合的攻击范围改为" + player.hp;
				},
				async content(event, trigger, player) {
					player.storage.tiejili_skill = player.hp;
					player.markSkill(event.name);
					player.when("phaseAfter").then(() => {
						let card = player.getEquip("tiejili");
						if (card) {
							player.storage.tiejili_skill = card.storage.tiejili_skill;
							player.markSkill("tiejili_skill");
						}
					});
				},
			},
			ty_feilongduofeng_skill: {
				equipSkill: true,
				trigger: { player: "useCardToPlayered" },
				audio: true,
				usable: 1,
				logTarget: "target",
				filter(event, player) {
					if (event.card.name != "sha") {
						return false;
					}
					return true;
				},
				async cost(event, trigger, player) {
					let choice = ["选项一"];
					if (trigger.target.countCards("he")) {
						choice.push("选项二");
					}
					choice.push("cancel2");
					const result = await player
						.chooseControl(choice)
						.set("prompt", get.prompt(event.name.slice(0, -5), trigger.target))
						.set("choiceList", ["摸一张牌", "令其弃置一张牌"])
						.set(
							"res",
							(function () {
								if (get.attitude(player, trigger.target) > 0 || trigger.target.hasSkillTag("noh")) {
									return "选项一";
								}
								return choice[choice.length - 2];
							})()
						)
						.set("ai", () => get.event("res"))
						.forResult();
					event.result = {
						bool: result.control != "cancel2",
						targets: [trigger.target],
						cost_data: result.control,
					};
				},
				async content(event, trigger, player) {
					const result = event.cost_data;
					if (result == "选项一") {
						await player.draw();
					} else {
						await trigger.target.chooseToDiscard("弃置一张牌", "he", true);
					}
				},
			},
			shangfangbaojian_skill: {
				equipSkill: true,
				trigger: { global: "useCardToPlayered" },
				audio: true,
				logTarget: "target",
				filter(event, player) {
					if (event.card.name != "sha") {
						return false;
					}
					if (event.player.countCards("h") + player.countCards("h") == 0) {
						return false;
					}
					return event.player.group == player.group && event.player != player;
				},
				async cost(event, trigger, player) {
					let choice = [];
					if (player.countCards("h")) {
						choice.push("交给其一张手牌");
					}
					if (trigger.player.countCards("h")) {
						choice.push("获得其一张手牌");
					}
					choice.push("cancel2");
					const result = await player
						.chooseControl(choice)
						.set("prompt", get.prompt2(event.name.slice(0, -5), trigger.player))
						.set(
							"res",
							(function () {
								if (get.attitude(player, trigger.player) <= 0 && trigger.player.countCards("h")) {
									return "获得其一张手牌";
								}
								if (player.countCards("h") >= trigger.player.countCards("h") || player.hasSkill("tyxibei")) {
									return "交给其一张手牌";
								}
								return "获得其一张手牌";
							})()
						)
						.set("ai", () => get.event("res"))
						.forResult();
					event.result = {
						bool: result.control != "cancel2",
						targets: [trigger.player],
						cost_data: result.control,
					};
				},
				async content(event, trigger, player) {
					const result = event.cost_data;
					if (result == "交给其一张手牌") {
						await player.chooseToGive(event.targets[0], true, 1, "h");
					} else {
						await player.gainPlayerCard(event.targets[0], true, 1, "h");
					}
				},
				group: "shangfangbaojian_skill_discard",
				subSkill: {
					discard: {
						equipSkill: true,
						trigger: {
							player: "loseBefore",
						},
						forced: true,
						filter(event, player) {
							if (event.type != "discard") {
								return false;
							}
							var cards = player.getEquips("shangfangbaojian");
							return event.cards.some(card => cards.includes(card));
						},
						content() {
							trigger.cards.removeArray(player.getEquips("shangfangbaojian"));
						},
					},
				},
			},
			qingmingjian_skill: {
				equipSkill: true,
				trigger: {
					player: "loseAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					if (event.type != "discard" || player != _status.currentPhase) {
						return false;
					}
					return player.getHistory("lose", evt => {
						return evt.type == "discard" && evt?.getl(player)?.cards2?.length > 1;
					}).indexOf(event) == 0;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt2(event.name.slice(0, -5)), lib.filter.notMe)
						.set("ai", target => {
							return get.damageEffect(target, get.player(), get.player());
						})
						.forResult();
				},
				async content(event, trigger, player) {
					await event.targets[0].damage();
				},
			},
			mengchong_skill: {
				trigger: {
					player: "useCardAfter",
				},
				locked: true,
				async cost(event, trigger, player) {
					if (!player.storage.mengchong_skill) {
						player.storage.mengchong_skill = 0;
					}
					let num = player.storage.mengchong_skill;
					const result = await player
						.chooseControl("+1", "-1")
						.set("prompt", `艨艟：请修改与其他角色计算距离（当前：${num > 0 ? "+" : ""}${num}）`)
						.set("ai", () => {
							const player = get.player();
							const num = player.countCards(card => {
								return player.hasUseTarget(card, true, true) && player.hasUseValue(card, true, true);
							});
							return num > 2 ? "-1" : "+1";
						})
						.forResult();
					event.result = {
						bool: true,
						cost_data: result.index,
					};
				},
				async content(event, trigger, player) {
					if (event.cost_data == 1 && player.storage.mengchong_skill > -2) {
						player.storage.mengchong_skill--;
					}
					if (event.cost_data == 0 && player.storage.mengchong_skill < 2) {
						player.storage.mengchong_skill++;
					}
					player.markSkill(event.name);
				},
				intro: {
					content(storage) {
						if (!storage) {
							return "无距离变化";
						}
						return "与其他角色互相计算距离" + (storage > 0 ? "+" : "") + storage;
					},
				},
				equipSkill: true,
				mod: {
					globalFrom(from, to, distance) {
						const num = from.storage.mengchong_skill;
						if (typeof num == "number") {
							return distance + num;
						}
					},
					globalTo(from, to, distance) {
						const num = to.storage.mengchong_skill;
						if (typeof num == "number") {
							return distance + num;
						}
					},
					canBeReplaced(card, player) {
						if (player.getEquips("mengchong").includes(card)) {
							return false;
						}
					},
				},
				group: "mengchong_skill_clear",
				subSkill: {
					clear: {
						equipSkill: true,
						forced: true,
						direct: true,
						trigger: {
							player: "phaseBegin",
						},
						content() {
							player.storage.mengchong_skill = 0;
							player.unmarkSkill("mengchong_skill");
						},
					},
				},
			},
			dajunyajing_backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				viewAs: {
					name: "sha",
				},
				selectCard: 1,
				position: "hes",
				ai1(card) {
					return 7 - get.value(card);
				},
				log: false,
			},
		},
		translate: {
			tiejili: "铁蒺藜骨朵",
			//线下只有一把，线上要做销毁防止污染牌堆
			tiejili_info: "准备阶段，你可以将此牌的攻击范围改为x，直到回合结束或此牌离开你的装备区（x为你的体力值）。当此牌离开你的装备区后，销毁之。",
			tiejili_skill: "铁蒺藜骨朵",
			tiejili_skill_info: "准备阶段，你可以将此牌的攻击范围改为x，直到回合结束或此牌离开你的装备区（x为你的体力值）。",
			lx_huoshaolianying: "火烧连营",
			lx_huoshaolianying_info: "出牌阶段，对一名角色使用。你展示目标角色的一张牌，然后你可以弃置一张与展示的牌花色相同的手牌。若如此做，你弃置其被展示的牌并对其造成一点火焰伤害，然后若其处于横置状态，你获得弃置堆中的此牌。",
			suibozhuliu: "随波逐流",
			suibozhuliu_info: "出牌阶段，对你自己使用，你将此牌置于判定区。判定阶段，你进行判断，若结果为♦️，你将一张装备牌移动至下家的装备区里（若你的装备区里有坐骑牌，则你须选择其中一张坐骑牌），若无法移动则改为下家获得此装备牌。判定结束后，你将判定区里的此牌置于下家的判定区。",
			ty_feilongduofeng: "飞龙夺凤",
			ty_feilongduofeng_info: "每回合限一次，当你使用【杀】指定一个目标后，你可以选择一项：1.摸一张牌；2.令其弃置一张牌。",
			ty_feilongduofeng_skill: "飞龙夺凤",
			ty_feilongduofeng_skill_info: "每回合限一次，当你使用【杀】指定一个目标后，你可以选择一项：1.摸一张牌；2.令其弃置一张牌。",
			shangfangbaojian: "尚方宝剑",
			shangfangbaojian_info: "当装备区里的此牌被弃置时，你防止之。与你势力相同的角色使用【杀】指定目标后，你可以选择一项：1：交给其一张手牌；2：获得其一张手牌。",
			shangfangbaojian_skill: "尚方宝剑",
			shangfangbaojian_skill_info: "与你势力相同的角色使用【杀】指定目标后，你可以选择一项：1：交给其一张手牌；2：获得其一张手牌。",
			qingmingjian: "青冥剑",
			qingmingjian_info: "当你于回合内首次弃置至少两张牌时，你可以对一名其他角色造成一点伤害 。",
			qingmingjian_skill: "青冥剑",
			qingmingjian_skill_info: "当你于回合内首次弃置至少两张牌时，你可以对一名其他角色造成一点伤害 。",
			mengchong: "艨艟",
			mengchong_info: "锁定技，当你使用牌结算结束后，你选择与其他角色互相计算距离+1或-1直到你的下个回合开始（至多+2/-2）。",
			mengchong_skill: "艨艟",
			mengchong_skill_info: "锁定技，当你使用牌结算结束后，你选择与其他角色互相计算距离+1或-1直到你的下个回合开始（至多+2/-2）。",
			yidugongdu: "以毒攻毒",
			yidugongdu_info: "出牌阶段，对一名已受伤的角色使用。你观看其所有手牌，然后若你与其手牌中均有【毒】，弃置其中一张【毒】并与其各摸两张牌，否则你与其依次受到1点无来源伤害。",
			dajunyajing: "大军压境",
			dajunyajing_info: "出牌阶段，对一名角色使用。其以外的所有角色依次选择是否将一张牌当无距离限制的【杀】对其使用。",
		},
		list: [
			["diamond", 6, "suibozhuliu"],
			["diamond", 9, "suibozhuliu"],
			["spade", 2, "ty_feilongduofeng"],
			["heart", 3, "lx_huoshaolianying"],
			["spade", 5, "shangfangbaojian"],
			["spade", 5, "qingmingjian"],
			["club", 5, "mengchong"],
		],
	};
});
