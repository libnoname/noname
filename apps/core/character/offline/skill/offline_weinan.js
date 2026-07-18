import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	wn_zhanyi: {
		audio: "zhanyi",
		enable: "phaseUse",
		usable: 1,
		filterCard(card, player) {
			return ["basic", "trick"].includes(get.type2(card)) && lib.filter.cardDiscardable(card, player, "wn_zhanyi");
		},
		lose: false,
		discard: false,
		check(card) {
			const player = get.player();
			return (
				2.5 *
					player.countCards("hs", cardx => {
						if (get.type2(cardx) != get.type2(card) || cardx === card) {
							return false;
						}
						return player.hasValueTarget(cardx);
					}) -
				get.value(card)
			);
		},
		async content(event, trigger, player) {
			await player.loseHp();
			await player.modedDiscard(event.cards);
			player.addTempSkill("wn_zhanyi_effect");
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					if (!event.targets?.length) {
						return false;
					}
					const type = get.type(event.card);
					if (type != "basic" && type != "trick") {
						return false;
					}
					return player.hasHistory("lose", evt => {
						if (evt.type != "discard" || evt.getParent(2).name != "wn_zhanyi") {
							return false;
						}
						return evt.cards.some(card => get.type2(card) == type);
					});
				},
				charlotte: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const num = player.getHistory("lose", evt => {
						if (evt.type != "discard" || evt.getParent(2).name != "wn_zhanyi") {
							return false;
						}
						return evt.cards.some(card => get.type2(card) == get.type(trigger.card));
					}).length;
					if (num > 0) {
						trigger.effectCount += num;
						game.log(player, "令", trigger.card, `额外结算了${num}次`);
					}
				},
			},
		},
		ai: {
			order: 8,
			result: {
				player(player) {
					const info = get.info("wn_zhanyi");
					if (
						player.countCards("h", card => {
							if (!info.filterCard(card, player)) {
								return false;
							}
							return info.check(card) > 0;
						})
					) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	//渭南风云
	//渭南神马超
	wn_qiangshu: {
		trigger: {
			source: "damageBegin1",
		},
		filter(event, player) {
			if (!event.card || !["sha", "juedou"].includes(event.card.name)) {
				return false;
			}
			const num = player.getAttackRange() - 1;
			return num > 0 && player.countCards("he") >= num;
		},
		async cost(event, trigger, player) {
			const num = player.getAttackRange() - 1;
			event.result = await player
				.chooseToDiscard("he", get.prompt2(event.skill), num)
				.set("chooseonly", true)
				.set("ai", card => {
					const trigger = get.event().getTrigger(),
						player = get.player();
					if (get.damageEffect(trigger.player, trigger.source, player) <= 0) {
						return 0;
					}
					return 7 - get.value(card);
				})
				.forResult();
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			trigger.num += event.cards.length;
		},
	},
	wn_yuma: {
		trigger: {
			global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
		},
		usable: 1,
		filter(event, player) {
			if (!event.getd) {
				return false;
			}
			let cards = event.getd();
			return cards.some(card => {
				if (get.position(card) != "d" || get.type(card) != "equip") {
					return false;
				}
				if (card.willBeDestroyed("discardPile", get.owner(card), event)) {
					return false;
				}
				return game.hasPlayer(current => {
					return current.canEquip(card, true);
				});
			});
		},
		async cost(event, trigger, player) {
			const cards = trigger.getd().filter(card => {
				if (get.position(card) != "d" || get.type(card) != "equip") {
					return false;
				}
				if (card.willBeDestroyed("discardPile", get.owner(card), trigger)) {
					return false;
				}
				return true;
			});
			const { bool, targets, links } = await player
				.chooseButtonTarget({
					createDialog: [get.prompt2(event.skill), cards],
					filterTarget(card, player, target) {
						const buttons = ui.selected.buttons;
						if (!buttons.length) {
							return false;
						}
						return target.canEquip(buttons[0].link, true);
					},
					ai1(button) {
						return 20 - get.value(button.link);
					},
					ai2(target) {
						const player = get.player();
						const card = ui.selected.buttons[0]?.link;
						if (!card) {
							return 0;
						}
						if (!target.countCards("h")) {
							return get.value(card, target) * get.attitude(player, target);
						}
						return (get.value(card, target) - 2 * target.countCards("h")) * get.attitude(player, target);
					},
				})
				.forResult();
			event.result = {
				bool: bool,
				targets: targets,
				cards: links,
			};
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards: [card],
			} = event;
			target.$gain2(card);
			await game.delay();
			await target.equip(card);
			const num = target.countCards("h");
			if (num > 0 && target != player) {
				await player.gainPlayerCard(target, true, "h", num);
			}
		},
	},
	//渭南神许褚
	wn_zhuanzhan: {
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			if (event.player == player || !player.hasEnabledSlot()) {
				return false;
			}
			const card = new lib.element.VCard({ name: "juedou", isCard: true });
			return player.canUse(card, event.player);
		},
		async cost(event, trigger, player) {
			let list = [];
			for (let i = 1; i <= 5; i++) {
				const slot = `equip${i}`;
				if (player.hasEnabledSlot(slot)) {
					list.push("equip" + i);
				}
			}
			list.push("cancel2");
			let bool = "cancel2";
			const card = new lib.element.VCard({ name: "juedou", isCard: true });
			if (get.effect(trigger.player, card, player, player) > 0) {
				bool = list.filter(i => i != "cancel2").randomGet();
			}
			const result = await player
				.chooseControl(list)
				.set("prompt", get.prompt2(event.skill))
				.set("ai", () => get.event().bool)
				.set("bool", bool)
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				targets: [trigger.player],
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			const slot = event.cost_data;
			await player.disableEquip([slot]);
			const card = new lib.element.VCard({ name: "juedou", isCard: true });
			if (player.canUse(card, trigger.player)) {
				await player.useCard(card, trigger.player);
			}
		},
	},
	wn_huwei: {
		trigger: {
			player: "phaseDrawBegin2",
		},
		forced: true,
		filter(event, player) {
			let list = Array.from({ length: 13 }).map((_, i) => "equip" + parseFloat(i + 1));
			list = list.filter(i => player.hasDisabledSlot(i));
			return !event.numFixed && list.length;
		},
		async content(event, trigger, player) {
			let list = Array.from({ length: 13 }).map((_, i) => "equip" + parseFloat(i + 1));
			let num = list.reduce((sum, slot) => sum + player.countDisabledSlot(slot), 0);
			trigger.num += num;
		},
	},
	//张郃
	wn_qiaobian: {
		audio: "sbqiaobian",
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return player.countCards("he") && event.player != player;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill, trigger.player), "he")
				.set("ai", card => {
					const player = get.player(),
						event = get.event();
					if (get.attitude(player, event.getTrigger().player) > 0) {
						return 0;
					}
					return 7 - get.value(card);
				})
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			const next = player.addToExpansion(cards, "giveAuto", player);
			next.gaintag.add(event.name);
			await next;
			player.addTempSkill("wn_qiaobian_effect");
			player.markAuto("wn_qiaobian_effect", target);
		},
		onremove(player, skill) {
			let cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		marktext: "巧",
		intro: {
			name: "巧",
			mark(dialog, storage, player) {
				let cards = player.getExpansions("wn_qiaobian");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
			markcount: "expansion",
		},
		subSkill: {
			effect: {
				audio: "wn_qiaobian",
				onremove: true,
				charlotte: true,
				trigger: {
					global: "useCard",
				},
				filter(event, player) {
					if (!player.getExpansions("wn_qiaobian")?.length || event.player != _status.currentPhase) {
						return false;
					}
					return event.player?.isIn() && player.getStorage("wn_qiaobian_effect").includes(event.player);
				},
				async cost(event, trigger, player) {
					const { bool, links } =
						player.getExpansions("wn_qiaobian").length > 1
							? await player
									.chooseCardButton(player.getExpansions("wn_qiaobian"), true, "巧变：展示一张“巧”")
									.set("ai", button => {
										const { cardType: type, player } = get.event(),
											trigger = get.event().getTrigger();
										const bool = get.type2(button.link) == type,
											inphase = trigger.getParent("phaseUse", true)?.player == trigger.player,
											att = get.attitude(player, trigger.player);
										if (att > 0) {
											return bool ? (inphase ? -1 : 1) : 2;
										}
										return bool ? (inphase ? trigger.player.countCards("h") : -1) : 2;
									})
									.set("cardType", get.type2(trigger.card))
									.forResult()
							: {
									bool: true,
									links: player.getExpansions("wn_qiaobian"),
								};
					event.result = {
						bool: bool,
						targets: [trigger.player],
						cost_data: links,
					};
				},
				async content(event, trigger, player) {
					const {
						cost_data: [card],
						targets: [target],
					} = event;
					await player.showCards(card);
					if (get.type2(card) == get.type2(trigger.card)) {
						await target.gain(card, "give", player);
						const evt = trigger.getParent("phaseUse", true);
						if (evt?.player == target) {
							game.log(player, "令", target, "结束了出牌阶段");
							evt.skipped = true;
						}
					} else {
						await player.draw();
						player
							.when({
								global: "phaseJieshuBegin",
							})
							.filter((evt, player) => evt.getParent("phase", true) == trigger.getParent("phase", true) && player.getExpansions("wn_qiaobian").length)
							.step(async (event, trigger, player) => {
								const cards = player.getExpansions("wn_qiaobian");
								await player.gain(cards, "draw");
							});
					}
				},
			},
		},
	},
	//贾诩
	wn_jianshu: {
		audio: "jianshu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h");
		},
		filterTarget(card, player, target) {
			if (ui.selected.targets.length) {
				return ui.selected.targets[0] != target && !ui.selected.targets[0].hasSkillTag("noCompareSource") && target.countCards("h") && !target.hasSkillTag("noCompareTarget");
			}
			return target != player;
		},
		filterCard: true,
		position: "he",
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			if (_status.event.player.hp == 1) {
				return 8 - get.value(card);
			}
			return 6 - get.value(card);
		},
		selectTarget: 2,
		multitarget: true,
		async content(event, trigger, player) {
			const [target1, target2] = event.targets,
				cards = event.cards;
			await player.give(cards, target1, "give");
			if (target1.canCompare(target2)) {
				const result = await target1.chooseToCompare(target2).forResult();
				if (result.tie) {
					await target1.loseHp();
					await target2.loseHp();
				} else {
					const winner = result.bool ? target1 : target2,
						loser = result.bool ? target2 : target1;
					await winner.chooseToDiscard("he", 2, true);
					await loser.loseHp();
				}
			}
		},
		ai: {
			expose: 0.4,
			order: 4,
			result: {
				target(player, target) {
					if (ui.selected.targets.length) {
						return -1;
					}
					return -0.5;
				},
			},
		},
	},
	wn_zhenlve: {
		audio: 2,
		trigger: {
			global: "useCard",
		},
		filter(event, player) {
			return event.card.name == "wuxie" && player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill, trigger.player), "he")
				.set("ai", card => {
					const player = get.player(),
						trigger = get.event().getTrigger();
					if (get.attitude(player, trigger.player) >= 0) {
						return 0;
					}
					return 4 - get.value(card);
				})
				.set("chooseonly", true)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const { cards } = event;
			await player.discard(cards);
			trigger.targets.length = 0;
			trigger.all_excluded = true;
			const cardx = trigger.cards?.filterInD();
			if (cardx?.length) {
				await player.gain(cardx, "gain2");
			}
		},
	},
	//徐晃
	wn_zhuying: {
		audio: 2,
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			return !event.player.getHistory("useCard", evt => evt.targets?.includes(player)).length;
		},
		forced: true,
		marktext: "驻",
		intro: {
			name: "驻",
			content: "mark",
		},
		async content(event, trigger, player) {
			player.addMark(event.name, 1);
		},
		ai: { combo: "wn_chiyuan" },
	},
	wn_chiyuan: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.hasMark("wn_zhuying") && game.hasPlayer(current => current != player);
		},
		filterTarget: lib.filter.notMe,
		selectTarget() {
			const player = get.player();
			return [1, player.countMark("wn_zhuying")];
		},
		async content(event, trigger, player) {
			const target = event.target;
			player.removeMark("wn_zhuying", 1, false);
			target.addMark("wn_zhuying", 1, false);
			game.log(player, "将一个“驻”标记交给了", target);
		},
		ai: {
			combo: "wn_zhuying",
			order: 9,
			result: {
				target(player, target) {
					if (ui.selected.targets?.length || player.countMark("wn_zhuying") <= 1) {
						return 0;
					}
					return Math.max(0, 3 - target.countMark("wn_zhuying"));
				},
			},
		},
		group: "wn_chiyuan_effect",
		subSkill: {
			effect: {
				audio: "wn_chiyuan",
				trigger: {
					global: "damageBegin3",
				},
				filter(event, player) {
					return event.player.hasMark("wn_zhuying");
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseToDiscard("he", get.prompt(event.skill, trigger.player), "弃置一张牌并选择一项：<br>1.防止此伤害并移去一个“驻”；<br>2.对伤害来源造成1点伤害。")
						.set("ai", card => {
							const { eff } = get.event();
							if (eff > 0) {
								return eff * 1.2 - get.value(card);
							}
							return 0;
						})
						.set(
							"eff",
							(() => {
								let source = trigger.source ?? trigger.player,
									eff = -get.damageEffect(trigger.player, source, player, trigger.nature);
								if (trigger.source?.isIn()) {
									eff = Math.max(eff, get.damageEffect(trigger.source, player, player));
								}
								return eff;
							})()
						)
						.set("chooseonly", true)
						.forResult();
					event.result.targets = [trigger.player];
				},
				async content(event, trigger, player) {
					const {
						cards,
						targets: [target],
					} = event;
					await player.discard(cards);
					const result = trigger.source?.isIn()
						? await player
								.chooseButton(
									[
										"驰援：请选择一项",
										[
											[
												["defend", `防止此伤害并移去${get.translation(target)}一个“驻”`],
												["attack", `对${get.translation(trigger.source)}造成1点伤害`],
											],
											"textbutton",
										],
									],
									true
								)
								.set("ai", button => {
									const player = get.player(),
										trigger = get.event().getTrigger();
									if (button.link == "defend") {
										return -get.damageEffect(trigger.player, trigger.source, player, trigger.nature);
									}
									return get.damageEffect(trigger.source, player, player);
								})
								.forResult()
						: {
								bool: true,
								links: ["defend"],
							};
					if (result?.bool && result?.links?.length) {
						if (result.links[0] == "defend") {
							trigger.cancel();
							target.removeMark("wn_zhuying", 1);
						} else if (trigger.source?.isIn()) {
							player.line(trigger.source);
							await trigger.source.damage(player);
						}
					}
				},
			},
		},
	},
	//曹操
	wn_dingluan: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			await player.loseHp();
			const card = new lib.element.VCard({ name: "dajunyajing", isCard: true }),
				target = event.target;
			const result = player.canUse(card, target)
				? await target
						.chooseControl()
						.set("choiceList", [`令${get.translation(player)}视为对你使用一张【大军压境】`, "令你武将牌上的所有技能失效直到你下个回合结束"])
						.set("prompt", "定乱：请选择一项")
						.set("ai", () => {
							const player = get.player(),
								targets = game.countPlayer(current => current != player && get.attitude(player, current) < 0);
							if (targets.length >= player.hp) {
								return 1;
							}
							return Math.random() > 0.7 ? 1 : 0;
						})
						.forResult()
				: {
						index: 1,
					};
			if (result.index == 0) {
				await player.useCard(card, target);
			} else {
				target.addTempSkill("wn_dingluan_blocker", { player: "phaseAfter" });
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (player.hp <= 2) {
						return 0;
					}
					return -4;
				},
			},
		},
		subSkill: {
			blocker: {
				init(player, skill) {
					player.addSkillBlocker(skill);
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
				},
				charlotte: true,
				locked: true,
				skillBlocker(skill, player) {
					let skills = player.getStockSkills(true, true);
					let info = get.info(skill);
					return info && !info.charlotte && !info.persevereSkill && skills.includes(skill);
				},
				mark: true,
				marktext: '<span style="text-decoration: line-through;">乱</span>',
				intro: {
					content(list, player, skill) {
						let storage = player.getSkills(null, false, false).filter(function (i) {
							return lib.skill.wn_dingluan_blocker.skillBlocker(i, player);
						});
						if (storage.length) {
							return "失效技能：" + get.translation(storage);
						}
						return "无失效技能";
					},
				},
			},
		},
	},
	wn_zhuijiang: {
		trigger: {
			global: "die",
		},
		filter(event, player) {
			return player.hasZhuSkill("wn_zhuijiang") && game.hasPlayer(current => current.group == "wei");
		},
		zhuSkill: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill, trigger.player), (card, player, target) => {
					return target.group == "wei";
				})
				.set("ai", () => Math.random())
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			game.broadcastAll(
				(target1, target2) => {
					game.swapSeat(target1, target2);
				},
				target,
				trigger.player
			);
		},
	},
	//韩遂
	wn_jubing: {
		trigger: {
			global: "damageEnd",
		},
		usable: 1,
		filter(event, player) {
			if (!event.player?.isIn()) {
				return false;
			}
			return game.hasPlayer(current => {
				return current.group == "qun" && current.countCards("he") && current.inRange(event.player);
			});
		},
		logTarget: "player",
		prompt2(event, player) {
			const targets = game.filterPlayer(current => {
				return current.group == "qun" && current.countCards("he") && current.inRange(event.player);
			});
			return `弃置${get.translation(targets)}${targets.length > 1 ? "各" : ""}一张牌，视为对其使用等量张【杀】`;
		},
		check(event, player) {
			let eff = 0;
			game.filterPlayer(current => {
				if (current.group != "qun" || !current.countCards("he") || !current.inRange(event.player)) {
					return false;
				}
				eff += get.effect(current, { name: "guohe_copy2" }, player, player);
				const card = new lib.element.VCard({ name: "sha", isCard: true });
				if (player.canUse(card, event.player, false)) {
					eff += get.effect(event.player, card, player, player);
				}
			});
			return eff > 0;
		},
		async content(event, trigger, player) {
			const targets = game
				.filterPlayer(current => {
					return current.group == "qun" && current.countCards("he") && current.inRange(trigger.player);
				})
				.sortBySeat(_status.currentPhase);
			for (let target of targets) {
				player.line(target, "green");
				await player.discardPlayerCard(target, "he", true);
			}
			let num = 0;
			for (let target of targets) {
				num += target
					.getHistory("lose", evt => {
						return evt.type == "discard" && evt.getParent(3) == event && evt?.cards?.length;
					})
					.reduce((sum, evt) => sum + evt.cards.length, 0);
			}
			while (num > 0) {
				num--;
				const card = new lib.element.VCard({ name: "sha", isCard: true });
				if (player.canUse(card, trigger.player, false)) {
					await player.useCard(card, trigger.player);
				} else {
					break;
				}
			}
		},
	},
	wn_xiongju: {
		trigger: {
			global: ["phaseBefore", "changeGroupAfter"],
			player: "enterGame",
		},
		zhuSkill: true,
		filter(event, player) {
			return player.hasZhuSkill("wn_xiongju") && lib.skill.wn_xiongju.logTarget(event, player)?.length;
		},
		logTarget(event, player) {
			if (event.name == "changeGroup") {
				if ([event.originGroup, event.group].includes(player.group)) {
					return [event.player];
				}
				return [];
			}
			return game.filterPlayer(current => {
				return current.group == player.group;
			});
		},
		onremove(player, skill) {
			let skillName = `${skill}_${player.playerid}`;
			for (let target of game.players) {
				if (target?.additionalSkills?.[skillName]?.length) {
					target.removeAdditionalSkill(skillName);
				}
			}
		},
		firstDo: true,
		silent: true,
		async content(event, trigger, player) {
			let skillName = `${event.name}_${player.playerid}`;
			for (let target of event.targets) {
				if (target.group == player.group) {
					target.addAdditionalSkill(skillName, ["mashu"], true);
				} else {
					target.removeAdditionalSkill(skillName);
				}
			}
		},
		derivation: ["mashu"],
	},
	wn_zhongtao: {
		trigger: {
			global: "useCardAfter",
		},
		filter(event, player) {
			if (!event.player.isIn() || get.distance(event.player, player) > 1) {
				return false;
			}
			return (
				event.card.name == "sha" &&
				event.targets?.some(i => {
					const card = new lib.element.VCard({ name: "sha", isCard: true });
					return i.isIn() && player.canUse(card, i, false);
				}) &&
				player.countCards("hes")
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill, trigger.targets),
					filterCard(card, player) {
						const targets = get.event().targetx,
							cardx = new lib.element.VCard({ name: "sha", cards: [card] }, [card]);
						return targets.some(target => player.canUse(cardx, target, false));
					},
					targetx: trigger.targets,
					selectTarget: -1,
					position: "hes",
					filterTarget(card, player, target) {
						const cards = ui.selected.cards,
							targets = get.event().targetx,
							cardx = new lib.element.VCard({ name: "sha", cards: cards }, cards);
						return player.canUse(cardx, target, false) && targets.includes(target);
					},
					ai1(card) {
						const { targetx: targets, player } = get.event(),
							cardx = new lib.element.VCard({ name: "sha", cards: [card] }, [card]);
						let num = 0;
						targets.filter(target => {
							if (!player.canUse(cardx, target, false)) {
								return false;
							}
							num += get.sgn(get.effect(target, cardx, player, player));
						});
						if (num <= 0) {
							return 0;
						}
						return 7 - get.value(card);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards, targets } = event;
			const card = new lib.element.VCard({ name: "sha", cards: cards }, cards);
			await player.useCard(card, cards, targets, false);
		},
	},
	wn_dutan: {
		enable: "phaseUse",
		viewAs: {
			name: "juedou",
			isCard: true,
		},
		usable: 1,
		filterCard: () => false,
		selectCard: -1,
		selectTarget: [1, Infinity],
	},
	wn_qifeng: {
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (!player.getHistory("lose").length) {
				return false;
			}
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			return player.canUse(card, event.player, false);
		},
		check(event, player) {
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			return get.effect(event.player, card, player, player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			const next = player.useCard(card, trigger.player);
			next.oncard = () => {
				let num = get
					.player()
					.getHistory("lose", evt => {
						return evt?.cards2?.length;
					})
					.reduce((sum, evt) => sum + evt.cards2.length, 0);
				get.event().baseDamage = num;
			};
			await next;
		},
	},
};

export default skills;
