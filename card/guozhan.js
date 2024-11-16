import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "guozhan",
		connect: true,
		card: {
			zhaoshu: {
				audio: true,
				mode: ["guozhan"],
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["zhaoshu_skill"],
				content: function () {
					cards = cards.filterInD();
					if (cards.length && target.isAlive()) {
						target.addToExpansion(cards, "gain2").gaintag.add("zhaoshu_skill");
						target.addSkill("zhaoshu_skill");
						game.addGlobalSkill("zhaoshu_global");
					}
				},
				onEquip: function () {
					if (player.isAlive()) {
						player.addToExpansion(card, "giveAuto").gaintag.add("zhaoshu_skill");
						player.markAuto("zhaoshu_skill", [card]);
						player.addSkill("zhaoshu_skill");
						game.addGlobalSkill("zhaoshu_global");
					}
				},
				ai: {
					order: 12,
					value: 3,
					useful: 1,
					result: {
						keepAI: true,
						target: 1,
					},
				},
			},
			gz_haolingtianxia: {
				audio: true,
				mode: ["guozhan"],
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget(card, player, target) {
					return target != player && !target.isMinHp();
				},
				async content(event, trigger, player) {
					const target = event.target, judge = get.mode() == 'guozhan' ? 'identity' : 'group';
					if (!target.isIn()) return;
					const str = get.translation(target);
					const card = new lib.element.VCard({ name: "sha" });
					const targets = game
						.filterPlayer((current) => {
							return current != target;
						})
						.sortBySeat();
					for (const current of targets) {
						if (!target.isIn()) return;
						if (!current || !current.isIn() || current.hasSkill("diaohulishan")) continue;
						let choiceList = [
							"弃置一张牌，视为对" + str + "使用一张【杀】",
							"弃置" + str + "一张牌",
						],
							choices = ["出杀", "弃牌", "cancel2"];
						if (current[judge] == "wei") {
							choiceList[0] = choiceList[0].slice(6);
							choiceList[1] = "获得" + choiceList[1].slice(2);
							choices[1] = "得牌";
						}
						if (
							!current.canUse(card, target, false) ||
							(current[judge] != "wei" && !current.countDiscardableCards(current, "he"))
						) {
							choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
							choices.remove("出杀");
						}
						if (!target.countCards("he")) {
							choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
							choices.remove(current[judge] == "wei" ? "得牌" : "弃牌");
						}
						if (choices.length > 1) {
							const {
								result: { control },
							} = await current
								.chooseControl(choices)
								.set("prompt", "号令天下：请选择其中一项")
								.set("target", target)
								.set("ai", () => {
									const player = get.event("player"),
										target = get.event("target"),
										choices = get.event("controls");
									const guohe = new lib.element.VCard({ name: "guohe_copy2" }),
										shunshou = new lib.element.VCard({ name: "shunshou_copy2" }),
										sha = new lib.element.VCard({ name: "sha" });
									const num = Math.max(
										0,
										choices.includes("弃牌") ? get.effect(target, guohe, player) : 0,
										choices.includes("得牌") ? get.effect(target, shunshou, player) : 0
									);
									if (
										choices.includes("出杀") &&
										get.effect(player, guohe, player) + get.effect(target, sha, player) >
										num
									)
										return "出杀";
									if (choices.includes("得牌") && num > 0) return "得牌";
									if (choices.includes("弃牌") && num > 0) return "弃牌";
									return "cancel2";
								});
							if (control != "cancel2") {
								if (control == "出杀") {
									if (current[judge] != "wei") await current.chooseToDiscard("he", true);
									await current.useCard(card, target, false);
								} else
									await current[
										current[judge] == "wei" ? "gainPlayerCard" : "discardPlayerCard"
									](target, true, "he").set("boolline", true);
							}
						}
					}
				},
				ai: {
					order: 6,
					value: 9,
					useful: 6,
					tag: {
						damage: 1,
						discard: 1,
						loseCard: 1,
					},
					result: {
						target(player, target) {
							return -1.5 * (game.countPlayer() - 1);
						},
					},
				},
			},
			gz_kefuzhongyuan: {
				audio: true,
				mode: ["guozhan"],
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: true,
				selectTarget: [1, Infinity],
				async content(event, trigger, player) {
					const target = event.target, judge = get.mode() == 'guozhan' ? 'identity' : 'group';
					let p1 = "请选择【杀】的目标",
						p2 = "或点击「取消」摸一张牌";
					if (target[judge] == "shu") {
						p1 += "（伤害+1）";
						p2 = "或点击「取消」摸两张牌";
					}
					const next = target.chooseUseTarget("sha", p1, p2, false);
					if (target[judge] == "shu") {
						next.set("oncard", function () {
							_status.event.baseDamage++;
						});
					}
					const result = await next.forResult();
					if (!result.bool) {
						target.draw(target[judge] == "shu" ? 2 : 1);
					}
				},
				ai: {
					wuxie: function (target, card, player, viewer) {
						if (get.mode() == "guozhan") {
							if (!_status._aozhan) {
								if (!player.isMajor()) {
									if (!viewer.isMajor()) return 0;
								}
							}
						}
					},
					order: 4,
					value: 9,
					useful: 6,
					tag: {
						gain: 1,
					},
					result: { target: 1.5 },
				},
			},
			gz_guguoanbang: {
				audio: true,
				mode: ["guozhan"],
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				toself: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				async content(event, trigger, player) {
					const target = event.target, judge = get.mode() == 'guozhan' ? 'identity' : 'group';
					await target.draw(8);
					const result = await target.chooseToDiscard("请弃置至少六张手牌", [6, target.countCards("h")], true, "h").forResult();
					if (target[judge] != "wu" || !result.cards || !result.cards.length) return;
					const give_cards = result.cards.filterInD("d"), give_list = [];
					if (!give_cards.length) return;
					while (game.hasPlayer(function (current) {
						return (current != target && current[judge] == "wu" && !give_list.includes(current));
					})) {
						const result2 = await target.chooseButton(["是否将弃置的牌交给其他吴势力角色？", give_cards], [1, 2]).forResult();
						if (result2.bool) {
							const cards2 = result2.links;
							const result3 = await target.chooseTarget(true, "选择获得" + get.translation(cards2) + "的角色", function (card, player, target) {
								return (target != player && target[judge] == "wu" && !_status.event.targetx.includes(target));
							}).set("targetx", give_list).forResult();
							if (result3.bool && result3.targets && result3.targets.length) {
								const current = result3.targets[0];
								target.line(current, "green");
								const next = current.gain(cards2, "gain2");
								next.giver = target;
								await next;
								give_list.push(current);
								give_cards.removeArray(cards2);
							}
							else break;
						} else break;
					}
				},
				ai: {
					wuxie: function (target, card, player, viewer) {
						if (get.mode() == "guozhan") {
							if (!_status._aozhan) {
								if (!player.isMajor()) {
									if (!viewer.isMajor()) return 0;
								}
							}
						}
					},
					order: 6,
					value: 9,
					useful: 6,
					tag: {
						draw: 8,
						loseCard: 6,
						discard: 6,
					},
					result: {
						target: function (player, target) {
							const judge = get.mode() == 'guozhan' ? 'identity' : 'group';
							if (target[judge] != "wu") return 3;
							return Math.max(
								3,
								Math.min(
									8,
									2 *
									game.countPlayer(function (current) {
										return current[judge] == "wu";
									})
								)
							);
						},
					},
				},
			},
			gz_wenheluanwu: {
				audio: true,
				mode: ["guozhan"],
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: true,
				selectTarget: -1,
				ignoreTarget: function (card, player, target) {
					return target.countCards("h") == 0;
				},
				async content(event, trigger, player) {
					const target = event.target, judge = get.mode() == 'guozhan' ? 'identity' : 'group';
					if (!target.countCards("h") || !player.isIn()) return;
					else target.showHandcards();
					const str = get.translation(target);
					const result = await player.chooseControl().set("prompt", "文和乱武：请选择一项").set("choiceList", [
						"令" + str + "弃置两张类型不同的手牌",
						"弃置" + str + "的一张手牌",
					]).set("ai", () => {
						let target = _status.event.getParent().target,
							hs = target.getCards("h"),
							type = [],
							att = get.attitude(_status.event.player, target);
						if (hs.length < 2) return att > 0 ? 1 : 0;
						hs.forEach((i) => {
							type.add(get.type2(i, target));
						});
						if (target[judge] !== "qun") {
							if (Boolean(att > 0) === Boolean(type.length > 1)) return 1;
							return 0;
						}
						if (type.length < 2 || target.hp < 3) return att > 0 ? 1 : 0;
						if (hs.length === 2) return att > 0 ? 0 : 1;
						return att > 0 ? 1 : 0;
					}).forResult();
					let result2;
					if (result.index == 0) {
						let list = [], hs = target.getCards("h");
						for (let i of hs) {
							if (lib.filter.cardDiscardable(i, target, "gz_wenheluanwu"))
								list.add(get.type2(i, target));
							if (list.length > 1) break;
						}
						if (list.length > 1) {
							result2 = await target.chooseToDiscard("h", true, "请弃置两张类型不同的手牌", 2, function (card, player) {
								if (!ui.selected.cards.length) return true;
								return (get.type2(card, target) != get.type2(ui.selected.cards[0], target));
							}).set("complexCard", true).forResult();
						}
						else if (list.length == 1) result2 = await target.chooseToDiscard("h", true).forResult();
						else return;
					}
					else result2 = await player.discardPlayerCard(target, "h", true, "visible").forResult();
					if (target[judge] == "qun" && target.isIn() && !target.countCards('h') && result2.bool) await target.draw(Math.min(5, target.hp));
				},
				ai: {
					order: 6,
					value: 10,
					useful: 6,
					tag: {
						discard: 1.5,
						loseCard: 1.5,
					},
					result: { target: -1.5 },
				},
			},
			liulongcanjia: {
				audio: true,
				mode: ["guozhan"],
				fullskin: true,
				type: "equip",
				subtype: "equip6",
				subtypes: ["equip3", "equip4"],
				nomod: true,
				nopower: true,
				//unique:true,
				distance: {
					globalFrom: -1,
					globalTo: +1,
				},
				skills: ["liulongcanjia"],
				ai: {
					equipValue: function (card, player) {
						if (player.countCards("e", { subtype: ["equip3", "equip4"] }) > 1) return 1;
						if (player.hasSkill("gzzongyu")) return 9;
						if (
							game.hasPlayer(function (current) {
								return current.hasSkill("gzzongyu") && get.attitude(player, current) <= 0;
							})
						)
							return 1;
						return 7.2;
					},
					basic: {
						equipValue: 7.2,
					},
				},
			},
			minguangkai: {
				audio: true,
				mode: ["guozhan"],
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				skills: ["minguangkai_cancel", "minguangkai_link"],
				ai: {
					basic: {
						equipValue: 6,
					},
				},
			},
			dinglanyemingzhu: {
				audio: true,
				mode: ["guozhan"],
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				nomod: true,
				nopower: true,
				unique: true,
				global: "g_dinglanyemingzhu_ai",
				skills: ["dinglanyemingzhu_skill"],
				ai: {
					equipValue: function (card, player) {
						if (player.hasSkill("jubao")) return 8;
						if (player.hasSkill("gzzhiheng")) return 6;
						if (
							game.hasPlayer(function (current) {
								return current.hasSkill("jubao") && get.attitude(player, current) <= 0;
							})
						) {
							return 0;
						}
						return 7;
					},
					basic: {
						equipValue: 6.5,
					},
				},
			},
			feilongduofeng: {
				audio: true,
				mode: ["guozhan"],
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				nomod: true,
				nopower: true,
				unique: true,
				global: "g_feilongduofeng_ai",
				distance: { attackFrom: -1 },
				skills: ["feilongduofeng", "feilongduofeng3"],
				ai: {
					equipValue: function (card, player) {
						if (player.hasSkill("zhangwu")) return 9;
						if (
							game.hasPlayer(function (current) {
								return current.hasSkill("zhangwu") && get.attitude(player, current) <= 0;
							})
						) {
							return 1;
						}
						return 8;
					},
					basic: {
						equipValue: 7,
					},
				},
			},
			taipingyaoshu: {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				cardcolor: "heart",
				nomod: true,
				nopower: true,
				unique: true,
				global: ["g_taipingyaoshu_ai"],
				skills: ["taipingyaoshu"],
				ai: {
					equipValue: function (card, player) {
						if (player.hasSkill("wendao")) return 9;
						if (
							game.hasPlayer(function (current) {
								return current.hasSkill("wendao") && get.attitude(player, current) <= 0;
							})
						) {
							return 1;
						}
						return 6;
					},
					basic: {
						equipValue: 6,
					},
				},
				filterLose: function (card, player) {
					if (player.hasSkillTag("unequip2")) return false;
					return true;
				},
				loseDelay: false,
				onLose: function () {
					player.addTempSkill("taipingyaoshu_lose");
				},
			},
			yuxi: {
				audio: true,
				mode: ["guozhan"],
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				skills: ["yuxi_skill"],
				ai: {
					equipValue: 9,
				},
			},
			xietianzi: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: function (card, player, event) {
					if (get.mode() == "guozhan" && !player.isMajor()) return false;
					if (player.hasSkill("xietianzi")) return false;
					if (_status.currentPhase != player) return false;
					var evt = event || _status.event;
					if (evt.name != "chooseToUse") evt = evt.getParent("chooseToUse");
					return evt.type == "phase";
				},
				filterTarget: function (card, player, target) {
					return player == target;
				},
				selectTarget: -1,
				content: function () {
					var evt = _status.event.getParent("phaseUse");
					if (evt && evt.name == "phaseUse") {
						evt.skipped = true;
					}
					target.addTempSkill("xietianzi");
				},
				ai: {
					order: 0.5,
					value: 4,
					useful: 2,
					result: {
						target: function (player, target) {
							if (target.countCards("h") >= 2) return 1;
							return 0;
						},
					},
				},
			},
			shuiyanqijunx: {
				audio: "shuiyanqijun",
				fullskin: true,
				type: "trick",
				cardnature: "thunder",
				filterTarget: function (card, player, target) {
					return (
						target != player &&
						(get.mode() != "guozhan" ||
							_status.mode == "yingbian" ||
							_status.mode == "free" ||
							target.countCards("e") > 0)
					);
				},
				enable: true,
				defaultYingbianEffect: "add",
				content: function () {
					"step 0";
					if (event.card.yingbian_all) {
						target.discard(
							target.getCards("e", function (card) {
								return lib.filter.cardDiscardable(card, target, "shuiyanqijunx");
							})
						);
						target.damage("thunder");
						event.finish();
					} else if (
						!target.countCards("e", function (card) {
							return lib.filter.cardDiscardable(card, target, "shuiyanqijunx");
						})
					) {
						var next = target.damage();
						if (!get.is.single()) game.setNature(next, "thunder", true);
						event.finish();
						return;
					} else
						target
							.chooseControl("discard_card", "take_damage", function (event, player) {
								let eff = get.damageEffect(player, event.player, player, "thunder");
								if (eff > 0) return "take_damage";
								if (player.hasSkillTag("noe")) return "discard_card";
								if (!eff) return "take_damage";
								if (
									player.isDamaged() &&
									player.hasCard(
										(card) =>
											get.name(card) == "baiyin" &&
											get.recoverEffect(player, player, _status.event.player) > 0,
										"e"
									)
								)
									return "discard_card";
								if (
									player.hasCard((card) => get.value(card, player) <= 0, "e") &&
									!player.hasCard(
										(card) => get.value(card, player) > Math.max(7, 12 - player.hp),
										"e"
									)
								)
									return "discard_card";
								if (lib.skill.huxinjing.filter({
									player: player,
									card: event.card,
									source: event.player,
									num: 1
								}, player)) return "take_damage";
								if (
									(player.hp > 2 && player.countCards("e") > 2) ||
									(player.hp > 1 && player.countCards("e") > 3)
								)
									return "take_damage";
								return "discard_card";
							})
							.set("prompt", "水淹七军")
							.set(
								"prompt2",
								"请选择一项：⒈弃置装备区里的所有牌；⒉受到" +
									get.translation(player) +
									"造成的1点雷电伤害。"
							);
					"step 1";
					if (result.control == "discard_card") {
						target.discard(
							target.getCards("e", function (card) {
								return lib.filter.cardDiscardable(card, target, "shuiyanqijunx");
							})
						);
					} else {
						var next = target.damage();
						if (!get.is.single()) game.setNature(next, "thunder", true);
					}
					event.finish();
				},
				ai: {
					canLink: function (player, target, card) {
						if (
							!target.isLinked() ||
							player.hasSkill("jueqing") ||
							target.hasSkill("gangzhi") ||
							player.hasSkill("gangzhi")
						)
							return false;
						let es = target.getCards("e"),
							val = 0;
						if (!es.length) return true;
						for (let i of es) {
							if (i.name == "baiyin" && target.isDamaged() && get.recoverEffect(target))
								val += get.value({ name: "tao" }, target);
							else val -= get.value(i, target);
						}
						if (0.15 * val > 2 * get.sgn(get.damageEffect(target, player, target, "thunder")))
							return false;
						return true;
					},
					order: 6,
					value: 4,
					useful: 2,
					tag: {
						damage: 1,
						thunderDamage: 1,
						natureDamage: 1,
						loseCard: 1,
					},
					yingbian: function (card, player, targets, viewer) {
						if (get.attitude(viewer, player) <= 0) return 0;
						var base = 0;
						if (get.cardtag(card, "yingbian_all")) {
							if (
								targets.filter(function (current) {
									return (
										get.damageEffect(current, player, player, "thunder") > 0 &&
										current.countCards("e", function (card) {
											return get.value(card, current) <= 0;
										}) < 2 &&
										current.countCards("e", function (card) {
											return get.value(card, current) > 0;
										}) > 0
									);
								}).length
							)
								base += 6;
						}
						if (get.cardtag(card, "yingbian_add")) {
							if (
								game.hasPlayer(function (current) {
									return (
										!targets.includes(current) &&
										lib.filter.targetEnabled2(card, player, current) &&
										get.effect(current, card, player, player) > 0
									);
								})
							)
								base += 6;
						}
						return 0;
					},
					result: {
						target: function (player, target, card, isLink) {
							let es = target.getCards("e"),
								eff = 2 * get.sgn(get.damageEffect(target, player, target, "thunder"));
							if (isLink || !es.length) return eff;
							let val = 0;
							for (let i of es) {
								if (i.name == "baiyin" && target.isDamaged() && get.recoverEffect(target))
									val += 6;
								else val -= get.value(i, target);
							}
							return Math.max(eff, 0.15 * val);
						},
					},
				},
			},
			lulitongxin: {
				fullskin: true,
				audio: true,
				type: "trick",
				enable: function (card, player) {
					if (get.mode() == "versus") return true;
					return game.hasPlayer(function (current) {
						return current.isMajor();
					});
				},
				mode: ["guozhan", "versus"],
				filterTarget: true,
				recastable: true,
				changeTarget: function (player, targets) {
					var target = targets[0];
					game.filterPlayer(function (current) {
						if (get.mode() == "versus") return current.isFriendOf(target);
						return (
							current.isMajor() == target.isMajor() &&
							current != target &&
							!current.hasSkill("diaohulishan")
						);
					}, targets);
				},
				content: function () {
					if (get.mode() == "versus") {
						if (target.isEnemyOf(player)) target.link(true);
						else if (target.isLinked()) target.draw();
					} else if (target.isLinked()) {
						target.draw();
					} else {
						target.link();
					}
				},
				ai: {
					order: 7.5,
					value: 4,
					useful: 2,
					wuxie: (target, card, player, viewer, status) => {
						if (
							target.hasSkillTag("nodamage") ||
							target.hasSkillTag("nofire") ||
							target.hasSkillTag("nothunder")
						) return 0;
						if (
							get.damageEffect(target, player, viewer, "thunder") >= 0 ||
							get.damageEffect(target, player, viewer, "fire") >= 0
						) return 0;
						if (target.hp + target.hujia > 2 && target.mayHaveShan(viewer, "use")) return 0;
					},
					result: {
						target: function (player, target) {
							if (get.mode() == "versus") {
								if (target.isFriendOf(player)) return target.isLinked() ? 1 : 0;
								return target.isLinked() ? 0 : -1;
							}
							return target.isLinked() ? 1 : -1;
						},
					},
				},
			},
			lianjunshengyan: {
				fullskin: true,
				audio: true,
				type: "trick",
				enable: function (card, player) {
					if (get.mode() == "guozhan") return !player.isUnseen();
					return true;
				},
				mode: ["guozhan", "boss"],
				filterTarget: function (card, player, target) {
					if (get.mode() == "guozhan")
						return target != player && target.identity != "unknown" && !target.isFriendOf(player);
					return true;
				},
				selectTarget: function () {
					return get.mode() == "guozhan" ? 1 : -1;
				},
				changeTarget: function (player, targets) {
					if (get.mode() == "guozhan") {
						var target = targets[0];
						targets.push(player);
						if (target.identity != "ye") {
							game.filterPlayer(function (current) {
								return (
									target != current &&
									target.isFriendOf(current) &&
									!current.hasSkill("diaohulishan")
								);
							}, targets);
						}
					}
				} /*
				contentBefore:function(){
					if(get.mode()=='guozhan'){
						var evt=event.getParent();
						if(evt&&evt.targets&&evt.targets.includes(player)){
							evt.fixedSeat=true;
							evt.targets.sortBySeat();
							evt.targets.remove(player);
							evt.targets.push(player);
						}
					}
				},*/,
				content: function () {
					"step 0";
					if (get.mode() != "guozhan") {
						if (player == target) target.draw(game.filterPlayer().length);
						else target.chooseDrawRecover(true);
						event.finish();
					} else {
						if (target == player) {
							var num = targets.length - 1;
							event.num = num;
							var damaged = target.maxHp - target.hp;
							if (damaged == 0) {
								target.draw(num);
								event.finish();
							} else {
								var list = [];
								for (var i = Math.min(num, damaged); i >= 0; i--) {
									list.push("摸" + (num - i) + "回" + i);
								}
								target.chooseControl(list).set("prompt", "请分配自己的摸牌数和回复量").ai =
									function () {
										return 0;
									};
							}
						} else {
							target.draw();
						}
					}
					"step 1";
					if (target != player) target.link(false);
					else if (typeof result.control == "string") {
						var index = result.control.indexOf("回");
						var draw = parseInt(result.control.slice(1, index));
						var recover = parseInt(result.control.slice(index + 1));
						if (draw) target.draw(draw);
						if (recover) target.recover(recover);
					}
				},
				ai: {
					wuxie: function (target, card, player, viewer) {
						if (get.mode() == "guozhan") {
							if (!_status._aozhan) {
								if (!player.isMajor()) {
									if (!viewer.isMajor()) return 0;
								}
							}
						}
					},
					order: 6,
					value: 4,
					useful: 2,
					result: {
						target: function (player, target) {
							if (player == target) return 2;
							return 1;
						},
					},
				},
			},
			chiling: {
				fullskin: true,
				audio: true,
				type: "trick",
				enable: function () {
					return game.hasPlayer(function (current) {
						return current.isUnseen();
					});
				},
				mode: ["guozhan"],
				//global:['g_chiling1','g_chiling2','g_chiling3'],
				filterTarget: function (card, player, target) {
					return target.isUnseen();
				},
				selectTarget: -1,
				chooseai: function (event, player) {
					if (player.hasSkillTag("mingzhi_yes")) return "选项一";
					if (_status.event.controls.includes("选项三")) {
						if (player.hasSkillTag("mingzhi_no")) return "选项三";
						return Math.random() < 0.5 ? "选项一" : "选项三";
					} else {
						if (_status.event.getParent().nomingzhi) {
							if (_status.event.controls.includes("选项二")) return "选项二";
							return "选项一";
						}
						if (player.hasSkillTag("maixie_hp") || player.hp <= 2) return "选项一";
						return Math.random() < 0.5 ? "选项一" : "选项二";
					}
				},
				content: function () {
					"step 0";
					var choiceList = ["明置一张武将牌，然后摸一张牌", "失去1点体力"];
					event.nomingzhi = target.hasSkillTag("nomingzhi", false, null, true);
					if (event.nomingzhi) {
						choiceList.shift();
					}
					if (target.countCards("he", { type: "equip" })) {
						choiceList.push("弃置一张装备牌");
					}
					target
						.chooseControl(lib.card.chiling.chooseai)
						.set("prompt", "敕令")
						.set("choiceList", choiceList);
					"step 1";
					var index = result.index;
					if (event.nomingzhi) {
						index++;
					}
					if (index == 0) {
						target
							.chooseControl("主将", "副将", function () {
								return Math.floor(Math.random() * 2);
							})
							.set("prompt", "选择要明置的武将牌");
					} else if (index == 1) {
						target.loseHp();
						event.finish();
					} else {
						target.chooseToDiscard("he", { type: "equip" }, true);
						event.finish();
					}
					"step 2";
					if (result.index == 0) {
						target.showCharacter(0);
					} else {
						target.showCharacter(1);
					}
					target.draw();
				},
				destroy: function (card, targetPosition, player, event) {
					if (
						(event.name != "lose" && event.name != "cardsDiscard") ||
						targetPosition != "discardPile"
					)
						return false;
					var evt = event.getParent().relatedEvent;
					if (evt && evt.name == "useCard") return false;
					return true;
				},
				onDestroy: function () {
					var currentPhase = _status.currentPhase;
					if (currentPhase) {
						_status.chiling = true;
						currentPhase.addTempSkill("g_chiling3");
					}
					if (!lib.inpile.includes("zhaoshu")) {
						lib.inpile.push("zhaoshu");
						var card = game.createCard2("zhaoshu", "club", 3);
						game.log(card, "被置于了牌堆底");
						ui.cardPile.appendChild(card);
						game.updateRoundNumber();
					}
				},
				ai: {
					order: 6,
					result: {
						target: -1,
					},
					tag: {
						multitarget: 1,
						multineg: 1,
					},
				},
			},
			diaohulishan: {
				fullskin: true,
				audio: true,
				type: "trick",
				enable: true,
				global: "g_diaohulishan",
				filterTarget: function (card, player, target) {
					return target != player;
				},
				selectTarget: [1, 2],
				content: function () {
					target.addTempSkill("diaohulishan");
				},
				ai: {
					order: function (item, player) {
						if (!player) player = get.player();
						if (
							player.hasCard(function (card) {
								return [
									"gz_haolingtianxia",
									"gz_guguoanbang",
									"gz_kefuzhongyuan",
									"wuzhong",
									"yuanjiao",
									"lianjunshengyan",
									"lulitongxin",
									"yiyi",
								].includes(get.name(card));
							}, "hs")
						)
							return 3.5;
						if (
							player.hasCard(function (card) {
								return get.name(card) == "taoyuan";
							}, "hs")
						)
							return get.order({ name: "taoyuan" }, player) - 1;
						return 9.5;
					},
					value: 4,
					useful: [2, 1],
					wuxie: function () {
						return 0;
					},
					result: {
						player: function (player, target) {
							var att = get.attitude(player, target);
							if (target.hp == 1 && att < 0) return 0;
							if (
								game.hasPlayer(function (current) {
									return get.attitude(player, current) < att;
								})
							) {
								var num = 1;
								if (target == player.next || target == player.previous) {
									num += 0.5;
								}
								return num;
							}
							return 0;
						},
					},
				},
			},
			huxinjing: {
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				cardcolor: "club",
				skills: ["huxinjing"],
				filterTarget: function (card, player, target) {
					if (get.mode() == "guozhan" && player != target) return false;
					return target.canEquip(card, true);
				},
				selectTarget: function () {
					return get.mode() == "guozhan" ? -1 : 1;
				},
				toself: false,
				ai: {
					basic: {
						equipValue: 6,
					},
				},
			},
			huoshaolianying: {
				fullskin: true,
				audio: true,
				type: "trick",
				cardnature: "fire",
				filterTarget: function (card, player, target) {
					if (get.mode() == "guozhan") {
						var next = player.getNext();
						if (!next) return false;
						return target == next || target.inline(next);
					}
					if (player == target) return false;
					if (
						game.hasPlayer(function (current) {
							return current.isLinked() && current != player;
						})
					) {
						if (!target.isLinked()) return false;
						var distance = get.distance(player, target, "absolute");
						return !game.hasPlayer(function (current) {
							if (target != current && current != player && current.isLinked()) {
								var dist = get.distance(player, current, "absolute");
								if (dist < distance) {
									return true;
								}
								if (
									dist == distance &&
									parseInt(current.dataset.position) < parseInt(target.dataset.position)
								) {
									return true;
								}
							}
						});
					} else {
						var dist = get.distance(player, target);
						return !game.hasPlayer(function (current) {
							return current != player && get.distance(player, current) < dist;
						});
					}
				},
				enable: true,
				selectTarget: -1,
				modTarget: true,
				content: function () {
					target.damage("fire");
				},
				ai: {
					order: 5,
					value: 6,
					tag: {
						damage: 1,
						natureDamage: 1,
						fireDamage: 1,
					},
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("nofire") || target.hasSkillTag("nodamage")) return 0;
							if (target.hasSkill("xuying") && target.countCards("h") == 0) return 0;
							if (!target.isLinked()) {
								return get.damageEffect(target, player, target, "fire");
							}
							return game.countPlayer(function (current) {
								if (current.isLinked()) {
									return get.sgn(get.damageEffect(current, player, target, "fire"));
								}
							});
						},
					},
				},
			},
			yuanjiao: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: function (card, player) {
					if (get.mode() == "guozhan" && player.isUnseen()) return false;
					return true;
				},
				filterTarget: function (card, player, target) {
					if (get.mode() != "guozhan") return target.group != player.group;
					if (target.identity == "unknown" || player.identity == "unknown") return false;
					return player.isEnemyOf(target);
				},
				content: function () {
					target.draw(1, "nodelay");
					player.draw(3);
				},
				ai: {
					wuxie: function (target, card, player, viewer) {
						if (get.mode() == "guozhan") {
							if (!_status._aozhan) {
								if (!player.isMajor()) {
									if (!viewer.isMajor()) return 0;
								}
							}
						}
					},
					basic: {
						useful: 4,
						value: 8,
						order: 9,
					},
					result: {
						target: 1,
						player: 3,
					},
				},
			},
			zhibi: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				recastable: true,
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					return target.countCards("h") || target.isUnseen(2);
				},
				content: function () {
					"step 0";
					if (!player.storage.zhibi) {
						player.storage.zhibi = [];
					}
					player.storage.zhibi.add(target);
					var controls = [];
					if (target.countCards("h")) controls.push("手牌");
					if (target.isUnseen(0)) controls.push("主将");
					if (target.isUnseen(1)) controls.push("副将");
					if (controls.length > 1) {
						player.chooseControl(controls).set("ai", function () {
							return 1;
						});
					}
					if (controls.length == 0) event.finish();
					"step 1";
					var content;
					var str = get.translation(target) + "的";
					if (result.control) {
						if (result.control == "手牌") {
							content = [str + "手牌", target.getCards("h")];
							game.log(player, "观看了", target, "的手牌");
						} else if (result.control == "主将") {
							content = [str + "主将", [[target.name1], "character"]];
							game.log(player, "观看了", target, "的主将");
						} else {
							content = [str + "副将", [[target.name2], "character"]];
							game.log(player, "观看了", target, "的副将");
						}
					} else if (target.countCards("h")) {
						content = [str + "手牌", target.getCards("h")];
						game.log(player, "观看了", target, "的手牌");
					} else if (target.isUnseen(0)) {
						content = [str + "主将", [[target.name1], "character"]];
						game.log(player, "观看了", target, "的主将");
					} else {
						content = [str + "副将", [[target.name2], "character"]];
						game.log(player, "观看了", target, "的副将");
					}
					player.chooseControl("ok").set("dialog", content);
				},
				mode: ["guozhan"],
				ai: {
					order: 9.5,
					wuxie: function () {
						return 0;
					},
					result: {
						player: function (player, target) {
							if (player.countCards("h") <= player.hp) return 0;
							if (player.storage.zhibi && player.storage.zhibi.includes(target)) return 0;
							return target.isUnseen() ? 1 : 0;
						},
					},
				},
			},
			yiyi: {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				filterTarget: function (card, player, target) {
					if (get.mode() == "guozhan") {
						return target.isFriendOf(player);
					} else if (get.is.versus()) {
						return player.side == target.side;
					} else {
						return true;
					}
				},
				selectTarget: function () {
					if (get.mode() == "guozhan") return -1;
					return [1, 3];
				},
				content: function () {
					target.draw(2);
					target.chooseToDiscard(2, "he", true).ai = get.disvalue;
				},
				ai: {
					wuxie: function () {
						return 0;
					},
					basic: {
						order: 9,
						useful: 1.5,
						value: 3,
					},
					result: {
						target(player, target) {
							let i,
								add = 0,
								y = 1,
								tars = 0;
							if (!ui.selected.cards) y = 0;
							if (ui.selected.targets) tars = 0.01 * ui.selected.targets.length;
							else tars = 0;
							if (target == player)
								i = player.countCards("h", function (card) {
									if (y > 0 && ui.selected.cards.includes(card)) return false;
									if (!y && get.name(card) === "yiyi") {
										y = -1;
										return false;
									}
									return true;
								});
							else i = target.countCards("he");
							if (target.hasSkillTag("noh")) add++;
							return add + Math.sqrt(i / 3.6 + tars) / 2;
						},
					},
					tag: {
						draw: 2,
						loseCard: 2,
						discard: 2,
						multitarget: true,
						norepeat: 1,
					},
				},
			},
			wuliu: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				global: "g_wuliu_skill",
				distance: { attackFrom: -1 },
				ai: {
					equipValue: function (card, player) {
						if (player.identity == "unknown" || player.identity == "ye") return 2;
						return (
							2 +
							game.countPlayer(function (current) {
								return current.isFriendOf(player);
							}) /
								2
						);
					},
					basic: {
						equipValue: 3,
					},
				},
				skills: ["wuliu_skill"],
				mode: ["guozhan"],
			},
			sanjian: {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -2 },
				ai: {
					basic: {
						equipValue: 4,
					},
				},
				skills: ["sanjian_skill"],
			},
			jingfanma: {
				fullskin: true,
				type: "equip",
				subtype: "equip4",
				distance: { globalFrom: -1 },
			},
		},
		skill: {
			zhaoshu_skill: {
				equipSkill: true,
				charlotte: true,
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					var cards = player.getExpansions("zhaoshu_cards");
					if (cards.length < 4) return false;
					var list = [];
					for (var i of cards) {
						list.add(get.suit(i, false));
						if (list.length >= 4) return true;
					}
					return false;
				},
				delay: false,
				content: function () {
					"step 0";
					var cards = player.getExpansions("zhaoshu_cards");
					player.loseToDiscardpile(cards);
					game.delayx();
					"step 1";
					var list = [
						["spade", 12, "gz_haolingtianxia"],
						["diamond", 1, "gz_kefuzhongyuan"],
						["heart", 1, "gz_guguoanbang"],
						["club", 12, "gz_wenheluanwu"],
					];
					for (var i = 0; i < list.length; i++) {
						if (lib.inpile.includes(list[i][2])) list.splice(i--, 1);
					}
					if (list.length) {
						var card = list.randomGet();
						lib.inpile.add(card[2]);
						player.gain(game.createCard2(card[2], card[0], card[1]), "gain2");
					}
				},
				ai: {
					order: 10,
					result: { player: 1 },
				},
				mark: true,
				marktext: "诏",
				intro: {
					name: "诏书",
					mark: function (dialog, content, player) {
						var content = player.getExpansions("zhaoshu_skill");
						dialog.add(content);
						dialog.addText(
							"<br><li>与你势力相同的角色的出牌阶段限一次，其可以将一张手牌（小势力角色改为至多两张）置于【诏书】上，称为“应”。<br><li>出牌阶段限一次，若你的“应”中包含至少四种花色，则你可以发动“锦囊召唤”，将所有“应”置入弃牌堆，然后随机获得一张未加入游戏的势力锦囊牌。",
							false
						);
						var cards = player.getExpansions("zhaoshu_cards");
						if (cards.length) {
							dialog.addAuto(cards);
						}
					},
					content: "expansion",
					markcount: function (content, player) {
						return player.getExpansions("zhaoshu_cards").length;
					},
				},
				onremove: function (player, skill) {
					var cards = player.getExpansions(skill).concat(player.getExpansions("zhaoshu_cards"));
					if (cards.length) player.loseToDiscardpile(cards);
				},
			},
			zhaoshu_global: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					if (!player.countCards("h")) return false;
					return game.hasPlayer(function (current) {
						return current.hasSkill("zhaoshu_skill") && current.isFriendOf(player);
					});
				},
				filterCard: true,
				selectCard: function () {
					if (_status.event.player.isNotMajor()) return [1, 2];
					return [1, 1];
				},
				position: "h",
				discard: false,
				lose: false,
				delay: false,
				check: function (card) {
					var player = _status.event.player,
						cards = ui.selected.cards.concat(
							game
								.findPlayer(function (current) {
									return current.hasSkill("zhaoshu_skill") && current.isFriendOf(player);
								})
								.getExpansions("zhaoshu_cards")
						),
						suit = get.suit(card, false);
					for (var i of cards) {
						if (get.suit(i) == suit) return 0;
					}
					return 5 + player.needsToDiscard() * 1.5 - get.value(card);
				},
				filterTarget: function (card, player, target) {
					return target.hasSkill("zhaoshu_skill") && target.isFriendOf(player);
				},
				selectTarget: function () {
					if (
						game.countPlayer(function (current) {
							return (
								current.hasSkill("zhaoshu_skill") && current.isFriendOf(_status.event.player)
							);
						}) == 1
					)
						return -1;
					return 1;
				},
				prompt: function () {
					var player = _status.event.player;
					return (
						"将" +
						(player.isNotMajor() ? "至多两" : "一") +
						"张手牌置于" +
						get.translation(
							game.filterPlayer(function (current) {
								return current.hasSkill("zhaoshu_skill") && current.isFriendOf(player);
							})
						) +
						"的【诏书】上"
					);
				},
				content: function () {
					"step 0";
					target.addToExpansion(cards, player, "give").gaintag.add("zhaoshu_cards");
					"step 1";
					target.markSkill("zhaoshu_skill");
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			liulongcanjia: {
				equipSkill: true,
				mod: {
					canBeReplaced: function (card, player) {
						if (player.getVEquips("liulongcanjia").includes(card)) return false;
					},
				},
			},
			minguangkai_cancel: {
				equipSkill: true,
				trigger: { target: "useCardToTarget" },
				forced: true,
				check: function (event, player) {
					return get.effect(event.target, event.card, event.player, player) < 0;
				},
				filter: function (event, player) {
					if (["huoshaolianying", "huogong"].includes(event.card.name)) return true;
					if (event.card.name == "sha") return game.hasNature(event.card, "fire");
					return false;
				},
				content: function () {
					trigger.getParent().targets.remove(player);
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (
								["huoshaolianying", "huogong"].includes(card.name) ||
								(card.name == "sha" && game.hasNature(card, "fire"))
							) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			minguangkai_link: {
				equipSkill: true,
				trigger: { player: "linkBefore" },
				forced: true,
				filter: function (event, player) {
					return player.isNotMajor() && !player.isLinked();
				},
				content: function () {
					trigger.cancel();
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (target.isMinor() && ["tiesuo", "lulitongxin"].includes(card.name)) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			dinglanyemingzhu_skill: {
				equipSkill: true,
				inherit: "zhiheng",
				filter: function (event, player) {
					return !player.hasSkill("gzzhiheng", true);
				},
				selectCard: function () {
					var player = _status.event.player;
					return [1, player.maxHp];
				},
				filterCard: function (card, player) {
					var cards = player.getEquips("dinglanyemingzhu");
					if (cards.length)
						return cards.some((card2) => card2 != card && !ui.selected.cards.includes(card2));
					return true;
				},
				prompt: "出牌阶段限一次，你可以弃置至多X张牌（X为你的体力上限），然后摸等量的牌",
			},
			g_dinglanyemingzhu_ai: {
				ai: {
					effect: {
						player_use(card, player) {
							if (player.hasSkill("jubao")) return;
							if (
								card.name == "dinglanyemingzhu" &&
								game.hasPlayer(function (current) {
									return current.hasSkill("jubao") && get.attitude(player, current) <= 0;
								})
							) {
								return [0, 0, 0, 0];
							}
						},
					},
				},
			},
			g_feilongduofeng_ai: {
				ai: {
					effect: {
						player_use(card, player) {
							if (player.hasSkill("zhangwu")) return;
							if (
								card.name == "feilongduofeng" &&
								game.hasPlayer(function (current) {
									return current.hasSkill("zhangwu") && get.attitude(player, current) <= 0;
								})
							) {
								return [0, 0, 0, 0];
							}
						},
					},
				},
			},
			g_taipingyaoshu_ai: {
				ai: {
					effect: {
						player_use(card, player) {
							if (player.hasSkill("wendao")) return;
							if (
								card.name == "taipingyaoshu" &&
								game.hasPlayer(function (current) {
									return current.hasSkill("wendao") && get.attitude(player, current) <= 0;
								})
							) {
								return [0, 0, 0, 0];
							}
						},
						target_use(card, player, target) {
							if (target._g_taipingyaoshu_temp) return;
							if (
								get.subtype(card) === "equip2" &&
								target.getEquip("taipingyaoshu") &&
								!target.countEmptySlot(2)
							) {
								target._g_taipingyaoshu_temp = true;
								let lose = get.effect(target, { name: "losehp" }, target, target),
									draw = 2 * get.effect(target, { name: "draw" }, target, target);
								delete target._g_taipingyaoshu_temp;
								if (
									lose < 0 &&
									target.hp <= 1 &&
									!target.hasCard((i) => {
										return (
											get.name(i) === "tao" &&
											lib.filter.cardEnabled(i, target, "forceEnable")
										);
									})
								)
									draw = 0;
								return [1, (lose + draw) / get.attitude(target, target)];
							}
						},
					},
				},
			},
			feilongduofeng: {
				equipSkill: true,
				trigger: { player: "useCardToPlayered" },
				logTarget: "target",
				check: function (event, player) {
					return get.attitude(player, event.target) <= 0;
				},
				filter: function (event, player) {
					return event.card.name == "sha" && event.target.countCards("he");
				},
				content: function () {
					trigger.target.chooseToDiscard("he", true);
				},
			},
			feilongduofeng2: {
				equipSkill: true,
				trigger: { source: "dieAfter" },
				filter: function (event, player) {
					if (event.reason && event.reason.card && event.reason.card.name == "sha") {
						return (
							event.player.isDead() && lib.group.includes(player.identity) && player.isMinor()
						);
					}
					return false;
				},
				logTarget: "player",
				content: function () {
					"step 0";
					var list = [];
					for (var i = 0; i < _status.characterlist.length; i++) {
						var info = lib.character[_status.characterlist[i]];
						if (info[4] && info[4].includes("jun")) continue;
						if (info[1] == player.identity) {
							list.push(_status.characterlist[i]);
						}
					}
					event.identity = event.player.identity;
					if (trigger.player == game.me && !_status.auto) {
						event.dialog = ui.create.dialog("是否选择一名角色重新加入游戏？", [
							list,
							"character",
						]);
						event.filterButton = function () {
							return true;
						};
						event.player = game.me;
						event.custom.replace.confirm = function () {
							if (!ui.selected.buttons.length) {
								event.directresult = "refuse";
							} else {
								event.directresult = ui.selected.buttons[0].link;
							}
							event.dialog.close();
							if (ui.confirm) ui.confirm.close();
							delete event.player;
							game.resume();
						};
						event.switchToAuto = function () {
							event.directresult = list.randomGet();
							event.dialog.close();
							if (ui.confirm) ui.confirm.close();
							delete event.player;
						};
						game.check();
						game.pause();
					} else if (trigger.player.isOnline()) {
						trigger.player.send(
							function (player, list) {
								if (_status.auto) {
									_status.event._result = list.randomGet();
								} else {
									var next = game.createEvent("replacePlayer");
									next.source = player;
									next.list = list;
									next.setContent(function () {
										event.dialog = ui.create.dialog("是否选择一名角色重新加入游戏？", [
											event.list,
											"character",
										]);
										event.filterButton = function () {
											return true;
										};
										event.player = event.source;
										event.custom.replace.confirm = function () {
											if (!ui.selected.buttons.length) {
												event.result = "refuse";
											} else {
												event.result = ui.selected.buttons[0].link;
											}
											event.dialog.close();
											if (ui.confirm) ui.confirm.close();
											delete event.player;
											game.resume();
											game.uncheck();
										};
										event.switchToAuto = function () {
											event.result = list.randomGet();
											event.dialog.close();
											if (ui.confirm) ui.confirm.close();
											delete event.player;
											game.uncheck();
										};
										game.check();
										game.pause();
									});
								}
								game.resume();
							},
							trigger.player,
							list
						);
						trigger.player.wait();
						game.pause();
					} else {
						event.directresult = list.randomGet();
					}
					event.list = list;
					"step 1";
					game.uncheck();
					if (!event.directresult) {
						if (event.resultOL) {
							event.directresult = event.resultOL[trigger.player.playerid];
						}
						if (!event.directresult || event.directresult == "ai") {
							event.directresult = event.list.randomGet();
						}
					}
					if (event.directresult == "refuse") {
						game.log(trigger.player, "拒绝重新加入游戏");
						return;
					}
					game.log(trigger.player, "重新加入游戏");
					var name = event.directresult;
					game.log(trigger.player, "将主将替换为", "#b" + name);
					_status.characterlist.remove(name);
					game.broadcastAll(
						function (source, name, identity) {
							source.revive(2, false);
							source.identity = identity;
							source._group = identity;
							source.setIdentity();
							if (source == game.me) {
								ui.arena.classList.remove("selecting");
							}
						},
						trigger.player,
						name,
						event.identity
					);
					trigger.player.draw();
					trigger.player.reinit(trigger.player.name1, name, false);
					trigger.player.removeCharacter(1);
					trigger.getParent("damage").untrigger(false, trigger.player);
					game.addVideo("setIdentity", trigger.player, event.identity);
				},
			},
			feilongduofeng3: {
				equipSkill: true,
				trigger: { source: "dying" },
				filter: function (event, player) {
					var evt = event.getParent("damage");
					return (
						evt &&
						evt.card &&
						evt.card.name == "sha" &&
						event.player.countGainableCards(player, "h") > 0
					);
				},
				//priority:7,
				logTarget: "player",
				prompt2: "获得该角色的一张手牌",
				check: function (event, player) {
					return get.attitude(player, event.player) < 0;
				},
				content: function () {
					player.gainPlayerCard(trigger.player, "h", true);
				},
			},
			taipingyaoshu: {
				equipSkill: true,
				mod: {
					maxHandcard: function (player, num) {
						if (get.mode() == "guozhan") {
							// if (player.hasSkill("hongfa")) {
							// 村规
							if (player.hasSkill("hongfa", null, null, false)) {
								num += player.getExpansions("huangjintianbingfu").length;
							}
							return (
								num +
								game.countPlayer(function (current) {
									return current.isFriendOf(player);
								})
							);
						}
						return num + game.countGroup() - 1;
					},
				},
				trigger: { player: "damageBegin4" },
				filter: function (event, player) {
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
					if (event.nature) return true;
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
									target: target,
									card: card,
								}) ||
								player.hasSkillTag("unequip_ai", false, {
									name: card ? card.name : null,
									target: target,
									card: card,
								})
							)
								return;
							if (get.tag(card, "natureDamage")) return "zeroplayertarget";
							if (card.name == "tiesuo") {
								return 0.01;
							}
						},
					},
				},
				subSkill: {
					lose: {
						audio: "taipingyaoshu",
						forced: true,
						charlotte: true,
						equipSkill: true,
						trigger: {
							player: "loseAfter",
							global: [
								"equipAfter",
								"addJudgeAfter",
								"gainAfter",
								"loseAsyncAfter",
								"addToExpansionAfter",
							],
						},
						filter: (event, player) => {
							return !player.hasSkillTag("unequip2")
						},
						getIndex(event, player){
							const evt = event.getl(player);
							const lostCards = [];
							evt.es.forEach((card) => {
								const VEquip = evt.vcard_map.get(card);
								if(VEquip.name === "taipingyaoshu") lostCards.add(VEquip);
							});
							return lostCards.length;
						},
						async content(event, trigger, player) {
							await player.draw(2);
							if (player.hp > 1) await player.loseHp();
						},
					},
				},
			},
			g_taipingyaoshu: {},
			yuxi_skill: {
				equipSkill: true,
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				filter: function (event, player) {
					return !player.isUnseen() && !event.numFixed;
				},
				content: function () {
					trigger.num++;
				},
				ai: {
					threaten: 1.3,
					forceMajor: true,
				},
				group: "yuxi_skill2",
			},
			yuxi_skill2: {
				equipSkill: true,
				trigger: { player: "phaseUseBegin" },
				forced: true,
				filter: function (event, player) {
					if (player.isUnseen()) return false;
					return game.hasPlayer(function (current) {
						return player.canUse("zhibi", current);
					});
				},
				content: function () {
					player.chooseUseTarget("玉玺：选择知己知彼的目标", { name: "zhibi" });
				},
			},
			xietianzi: {
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				trigger: {
					player: "phaseDiscardAfter",
				},
				content: function () {
					"step 0";
					player.removeSkill("xietianzi");
					player
						.chooseToDiscard("h", "是否弃置一张手牌并获得一个额外回合？")
						.set("ai", function (card) {
							return 10 - get.value(card);
						});
					"step 1";
					if (result.bool) {
						player.insertPhase();
					}
				},
			},
			g_chiling3: {
				mode: ["guozhan"],
				trigger: { player: "phaseEnd" },
				forced: true,
				popup: false,
				filter: function () {
					return _status.chiling == true;
				},
				content: function () {
					"step 0";
					_status.chiling = false;
					var targets = game.filterPlayer(function (target) {
						return target.isUnseen();
					});
					targets.sort(lib.sort.seat);
					event.targets = targets;
					"step 1";
					if (event.targets.length) {
						var target = event.targets.shift();
						event.current = target;
						var choiceList = ["明置一张武将牌，然后摸一张牌", "失去1点体力"];
						if (target.countCards("he", { type: "equip" })) {
							choiceList.push("弃置一张装备牌");
						}
						target
							.chooseControl(lib.card.chiling.chooseai)
							.set("prompt", "敕令")
							.set("choiceList", choiceList);
					} else {
						event.finish();
					}
					"step 2";
					var target = event.current;
					if (result.control == "选项一") {
						target
							.chooseControl("主将", "副将", function () {
								return Math.floor(Math.random() * 2);
							})
							.set("prompt", "选择要明置的武将牌");
					} else if (result.control == "选项二") {
						target.loseHp();
						event.goto(1);
					} else {
						target.chooseToDiscard("he", { type: "equip" }, true);
						event.goto(1);
					}
					"step 3";
					var target = event.current;
					if (result.index == 0) {
						target.showCharacter(0);
					} else {
						target.showCharacter(1);
					}
					target.draw();
					event.goto(1);
				},
			},
			g_diaohulishan: {},
			diaohulishan: {
				charlotte: true,
				group: "undist",
				init: function (player) {
					if (player.isIn()) {
						game.broadcastAll(function (player) {
							player.classList.add("out");
						}, player);
						game.log(player, "移出了游戏");
					}
				},
				onremove: function (player) {
					if (player.isOut()) {
						game.broadcastAll(function (player) {
							player.classList.remove("out");
						}, player);
						game.log(player, "移回了游戏");
					}
				},
			},
			huxinjing: {
				equipSkill: true,
				trigger: { player: "damageBegin4" },
				// forced:true,
				filter: function (event, player) {
					if (event.num < player.hp && (get.mode() == "guozhan" || event.num <= 1)) return false;
					let cards = player.getEquips("huxinjing");
					if (!cards.length) return false;
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
					trigger.cancel();
					var e2 = player.getEquips("huxinjing");
					if (e2.length) {
						player.discard(e2);
					}
					player.removeSkill("huxinjing");
				},
			},
			wuliu_skill: {
				equipSkill: true,
			},
			g_wuliu_skill: {
				equipSkill: true,
				mod: {
					attackRange: function (player, distance) {
						return (
							distance +
							game.countPlayer(function (current) {
								if (current == player || !current.isFriendOf(player)) return false;
								if (current.hasSkill("wuliu_skill")) return true;
							})
						);
					},
				},
			},
			sanjian_skill: {
				equipSkill: true,
				audio: true,
				trigger: { source: "damageSource" },
				direct: true,
				filter: function (event, player) {
					if (event.player.isDead()) return false;
					if (player.countCards("h") == 0) return false;
					if (!event.card) return false;
					if (event.card.name != "sha") return false;
					if (!event.notLink()) return false;
					return game.hasPlayer(function (current) {
						return current != event.player && get.distance(event.player, current) <= 1;
					});
				},
				content: function () {
					"step 0";
					var damaged = trigger.player;
					player
						.chooseCardTarget({
							filterCard: lib.filter.cardDiscardable,
							filterTarget: function (card, player, target) {
								var damaged = _status.event.damaged;
								return get.distance(damaged, target) <= 1 && target != damaged;
							},
							ai1: function (card) {
								return 9 - get.value(card);
							},
							ai2: function (target) {
								var player = _status.event.player;
								return get.damageEffect(target, player, player);
							},
							prompt: get.prompt("sanjian"),
						})
						.set("damaged", damaged);
					"step 1";
					if (result.bool) {
						player.logSkill("sanjian_skill", result.targets);
						player.discard(result.cards);
						result.targets[0].damage();
					}
				},
			},
		},
		translate: {
			liulongcanjia: "六龙骖驾",
			liulongcanjia_info:
				"锁定技。此牌占用1个进攻坐骑和1个防御坐骑槽位，且不可被替换。你计算与其他角色的距离-1，其他角色计算与你的距离+1。",
			minguangkai: "明光铠",
			minguangkai_cancel: "明光铠",
			minguangkai_link: "明光铠",
			minguangkai_info:
				"锁定技。①当你成为【火烧连营】、【火攻】或火【杀】的目标时，取消之。②当你即将横置前，若你是小势力角色，取消之。",
			dinglanyemingzhu: "定澜夜明珠",
			dinglanyemingzhu_bg: "珠",
			dinglanyemingzhu_info:
				"锁定技。若你拥有〖制衡〗，则你取消〖制衡〗的弃置牌数限制，否则你视为拥有〖制衡〗。",
			dinglanyemingzhu_skill: "制衡",
			dinglanyemingzhu_skill_info:
				"出牌阶段限一次。你可以弃置至多X张牌（X为你的体力上限），然后摸等量的牌。",
			feilongduofeng: "飞龙夺凤",
			feilongduofeng2: "飞龙夺凤",
			feilongduofeng3: "飞龙夺凤",
			feilongduofeng_info:
				"①当你使用【杀】指定目标后，你可令目标角色弃置一张牌。②当你因使用【杀】而令其他角色进入濒死状态时，你可以获得其一张手牌。",
			taipingyaoshu: "太平要术",
			taipingyaoshu_info:
				"锁定技。①当你即将受到属性伤害时，取消之。②你的手牌上限+X（X为场上势力数-1）。③当你失去装备区里的【太平要术】时，你摸两张牌，然后若你的体力值大于1，你失去1点体力。",
			taipingyaoshu_info_guozhan:
				"锁定技。①当你即将受到属性伤害时，取消之。②你的手牌上限+X（X为与你势力相同的角色数）。③当你失去装备区里的【太平要术】时，你摸两张牌，然后若你的体力值大于1，你失去1点体力。",
			yuxi_skill: "玉玺",
			yuxi_skill2: "玉玺",
			yuxi: "玉玺",
			yuxi_info:
				"锁定技。若你有明置的武将牌，则：①你的势力视为唯一的大势力。②摸牌阶段开始时，你令额定摸牌数+1。③出牌阶段开始时，你视为使用【知己知彼】。",
			xietianzi: "挟令",
			xietianzi_info:
				"出牌阶段，对自己使用。你结束出牌阶段。本回合的弃牌阶段结束时，你可以弃置一张手牌，获得一个额外的回合。",
			xietianzi_info_guozhan:
				"出牌阶段，对身为大势力角色的自己使用。你结束出牌阶段。本回合的弃牌阶段结束时，你可以弃置一张手牌，获得一个额外的回合。",
			shuiyanqijunx: "水淹七军",
			shuiyanqijunx_info:
				"出牌阶段，对一名其他角色使用。目标角色选择一项：⒈弃置装备区里的所有牌（至少一张）。⒉受到你造成的1点雷电伤害。",
			shuiyanqijunx_info_guozhan:
				"出牌阶段，对一名装备区里有牌的其他角色使用。目标角色选择一项：⒈弃置装备区里的所有牌。⒉受到你造成的1点雷电伤害。",
			lulitongxin: "勠力同心",
			lulitongxin_info:
				"出牌阶段，对所有大势力角色或所有小势力角色使用。若目标角色：未横置，则其横置；已横置，则其摸一张牌。",
			lulitongxin_info_versus:
				"出牌阶段，对所有己方角色或所有敌方角色使用。若目标角色：未横置，则其横置；已横置，则其摸一张牌。",
			lianjunshengyan: "联军盛宴",
			lianjunshengyan_info:
				"出牌阶段，对你和你选择的除你的势力外的一个势力的所有角色使用。若目标角色：为你，你选择摸Y张牌并回复X-Y点体力（X为该势力的角色数，Y∈[0,X]）；不为你，其摸一张牌，然后重置。",
			lianjunshengyan_info_boss:
				"出牌阶段，对场上所有角色使用。你摸X张牌（X为存活角色数），其他角色依次选择回复1点体力或摸一张牌。",
			chiling: "敕令",
			chiling_info:
				"①出牌阶段，对所有没有势力的角色使用。目标角色选择一项：1、明置一张武将牌，然后摸一张牌；2、弃置一张装备牌；3、失去1点体力。②当【敕令】因判定或弃置而置入弃牌堆时，系统将之移出游戏并将【诏书】置于牌堆底，然后系统于当前回合结束后视为对所有没有势力的角色使用【敕令】。",
			diaohulishan: "调虎离山",
			diaohulishan_info: "出牌阶段，对至多两名其他角色使用。目标角色于此回合视为移出游戏。",
			huoshaolianying: "火烧连营",
			huoshaolianying_bg: "烧",
			huoshaolianying_info_guozhan:
				"出牌阶段，对你的下家及其队列中的所有角色使用。你对目标角色造成1点火属性伤害。",
			huoshaolianying_info:
				"出牌阶段，对距离最小的一名横置角色使用（若无横置角色，则改为对距离最小的所有角色使用），你对目标造成1点火属性伤害。",
			yuanjiao: "远交近攻",
			yuanjiao_info: "出牌阶段，对一名与你势力不同的其他角色使用。其摸一张牌，然后你摸三张牌。",
			yuanjiao_info_guozhan:
				"出牌阶段，对一名与你势力不同且已确定势力的其他角色使用。其摸一张牌，然后你摸三张牌。",
			yuanjiao_bg: "交",
			zhibi: "知己知彼",
			zhibi_info:
				"出牌阶段，对一名有手牌或有暗置武将牌的其他角色使用。你选择一项：⒈观看其手牌。⒉观看其的一张暗置武将牌。",
			yiyi: "以逸待劳",
			yiyi_info_guozhan: "出牌阶段，对所有己方角色使用。目标角色摸两张牌，然后弃置两张牌。",
			yiyi_info_combat: "出牌阶段，对所有己方角色使用。目标角色摸两张牌，然后弃置两张牌。",
			yiyi_info: "出牌阶段，对至多三名角色使用。目标角色摸两张牌，然后弃置两张牌。",
			yiyi_bg: "逸",
			wuliu: "吴六剑",
			wuliu_info: "锁定技。与你势力相同的所有其他角色的攻击范围+1。",
			sanjian: "三尖两刃刀",
			sanjian_info:
				"当你因执行【杀】而对A造成伤害后，你可以弃置一张牌并选择一名其他角色B（A至B的距离需为1）。你对B造成1点伤害。",
			wuliu_skill: "吴六剑",
			sanjian_skill: "三尖两刃刀",
			jingfanma_bg: "-马",
			jingfanma: "惊帆",
			jingfanma_info: "锁定技，你计算与其他角色的距离-1。",
			huxinjing_bg: "镜",
			huxinjing: "护心镜",
			huxinjing_info:
				"此牌可对其他角色使用。当你受到伤害时，若伤害值大于1或大于等于你的体力值，则你可以将所有【护心镜】置入弃牌堆，然后防止此伤害。",
			huxinjing_info_guozhan:
				"当你受到伤害时，若伤害值大于等于你的体力值，则你可以将所有【护心镜】置入弃牌堆，然后防止此伤害。",
			gz_haolingtianxia: "号令天下",
			gz_haolingtianxia_info:
				"出牌阶段，对一名体力值不为全场最少的角色使用。所有其他角色依次可以选择一项：①弃置一张牌（魏势力角色无需弃牌），视为对目标角色使用一张【杀】；②弃置目标角色的一张牌（魏势力角色改为获得其一张牌）。",
			gz_kefuzhongyuan: "克复中原",
			gz_kefuzhongyuan_info:
				"出牌阶段，对任意名角色使用。目标角色选择一项：①视为使用一张【杀】（蜀势力角色以此法使用【杀】的伤害值基数+1）；②摸一张牌（蜀势力角色改为摸两张牌）。",
			gz_guguoanbang: "固国安邦",
			gz_guguoanbang_info:
				"出牌阶段，对你自己使用。你摸八张牌，然后弃置至少六张手牌。然后若你的势力为吴，则你可以将你以此法弃置的牌交给其他吴势力角色（每名角色至多获得两张牌）。",
			gz_wenheluanwu: "文和乱武",
			gz_wenheluanwu_info:
				"出牌阶段，对所有角色使用。目标角色展示所有手牌，然后你选择一项：①令其弃置两张类型不同的手牌；②你弃置其一张手牌。然后若其为群势力角色且其没有手牌，则其将手牌摸至当前体力值（至多为5）。",
			zhaoshu: "诏书",
			zhaoshu_skill: "锦囊召唤",
			zhaoshu_global: "诏书",
			zhaoshu_info:
				"<li>出牌阶段，对你自己使用。你将此牌置于目标的武将牌上。<br><li>与你势力相同的角色的出牌阶段限一次，其可以将一张手牌（小势力角色改为至多两张）置于【诏书】上，称为“应”。<br><li>出牌阶段限一次，若你的“应”中包含至少四种花色，则你可以发动“锦囊召唤”：将所有“应”置入弃牌堆，然后随机获得一张未加入游戏的势力锦囊牌。",
		},
		list: [
			["heart", 9, "yuanjiao"],
			["club", 3, "zhibi"],
			["club", 4, "zhibi"],
			["diamond", 4, "yiyi"],
			["heart", 11, "yiyi"],
			["diamond", 6, "wuliu"],
			["diamond", 12, "sanjian"],
			["heart", 3, "jingfanma"],
			["spade", 4, "shunshou"],
			["spade", 12, "guohe"],
			["spade", 11, "wuxie"],
			["spade", 3, "huoshaolianying", "fire"],
			["club", 11, "huoshaolianying", "fire"],
			["heart", 12, "huoshaolianying", "fire"],
			["club", 2, "huxinjing"],
			["heart", 2, "diaohulishan"],
			["diamond", 10, "diaohulishan"],
			["heart", 1, "lianjunshengyan"],
			["club", 3, "chiling"],
			["spade", 12, "lulitongxin"],
			["club", 10, "lulitongxin"],
			["club", 12, "shuiyanqijunx"],
			["heart", 13, "shuiyanqijunx"],
			["spade", 1, "xietianzi"],
			["diamond", 1, "xietianzi"],
			["diamond", 4, "xietianzi"],
			["club", 1, "yuxi"],
		],
	};
});
