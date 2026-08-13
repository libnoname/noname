import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//龙起襄樊
	//龙庞德
	dragtaiguan: {
		audio: "juesi",
		enable: "phaseUse",
		usable(skill, player) {
			return Math.max(1, player.getDamagedHp());
		},
		filterCard: true,
		filterTarget(card, player, target) {
			return player.inRange(target) && target.countDiscardableCards(target, "he");
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target.chooseToDiscard("he", true).forResult();
			if (result.cards[0].name != "sha" && player.getHp() <= target.getHp()) {
				await player.chooseUseTarget("juedou", true, [target]);
			}
		},
	},
	//关羽
	//界界关羽
	dragchaojue: {
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		/*filter(event, player) {
			if (!game.hasPlayer(target => target != player)) return false;
			return player.countCards("h", card => _status.connectMode || lib.filter.cardDiscardable(card, player));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill), "h")
				.set("ai", card => {
					const player = get.event().player;
					if (!game.hasPlayer(target => get.attitude(player, target) < 0)) return 0;
					if (get.suit(card, player) == "diamond") return 8 - get.value(card);
					return 7.5 - get.value(card);
				})
				.set("logSkill", event.skill)
				.forResult();
		},
		popup: false,*/
		async content(event, trigger, player) {
			await player.draw();
			if (!player.countCards("h")) {
				return;
			}
			const result = await player
				.chooseCard("超绝：展示一张手牌", "h", true)
				.set("ai", card => {
					const player = get.event().player;
					if (get.suit(card, player) == "diamond") {
						return 3;
					}
					return 1;
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			await player.showCards(result.cards, `${get.translation(player)}发动了【超绝】`);
			const targets = game.filterPlayer(target => target != player).sortBySeat();
			if (targets.length) {
				const suits = result.cards
					.reduce((list, card) => list.add(get.suit(card, player)), [])
					.sort((a, b) => {
						return lib.suit.indexOf(b) - lib.suit.indexOf(a);
					});
				player.line(targets);
				for (const i of targets) {
					i.addTempSkill("dragchaojue_buff");
					i.markAuto("dragchaojue_buff", suits);
				}
				for (const target of targets) {
					const { bool } = await target
						.chooseToGive(
							player,
							(card, player) => {
								return get.event().suits.includes(get.suit(card));
							},
							"h",
							"give"
						)
						.set("suits", suits)
						.set("ai", card => {
							const player = get.event().player,
								target = get.event().getParent().player;
							const att = get.attitude(player, target);
							if (att > 0) {
								return 7.5 - get.value(card);
							}
							if (att > -1) {
								return 0;
							}
							if (
								att < 0 &&
								get.attitude(target, player) < 0 &&
								player.getSkills(null, false, false).some(skill => {
									if (get.is.locked(skill, player)) {
										return false;
									}
									const info = get.info(skill);
									return info && info.ai && (info.ai.maixie || info.ai.maixie_hp || info.ai.maixie_defend);
								}) &&
								player.getHp() <= 2
							) {
								return 7.5 - get.value(card);
							}
							return 0;
						})
						.set("prompt", "超绝：交给" + get.translation(player) + "一张" + get.translation(suits) + "手牌，或本回合非锁定技失效")
						.forResult();
					if (!bool) {
						target.addTempSkill("fengyin");
					}
				}
			}
		},
		subSkill: {
			buff: {
				onremove: true,
				charlotte: true,
				mod: {
					cardEnabled2(card, player) {
						if (player.getStorage("dragchaojue_buff").includes(get.suit(card))) {
							return false;
						}
					},
				},
				marktext: "绝",
				intro: { content: "本回合内不能使用或打出$牌" },
			},
		},
	},
	dragjunshen: {
		mod: {
			targetInRange(card, player) {
				if (get.suit(card) == "diamond" && card.name == "sha") {
					return true;
				}
			},
		},
		locked: false,
		enable: ["chooseToUse", "chooseToRespond"],
		filterCard(card, player) {
			return get.color(card) == "red";
		},
		viewAsFilter(player) {
			return player.countCards("hes", { color: "red" });
		},
		position: "hes",
		viewAs: { name: "sha" },
		prompt: "将一张红色牌当作【杀】使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
		ai: {
			order(item, player) {
				if (!player || !_status.event.type || _status.event.type != "phase") {
					return 0.1;
				}
				return get.order({ name: "sha" }, player) + 0.3;
			},
			respondSha: true,
			skillTagFilter(player) {
				if (!player.countCards("hes", { color: "red" })) {
					return false;
				}
			},
		},
		group: ["dragjunshen_add", "dragjunshen_damage"],
		subSkill: {
			add: {
				trigger: { player: "useCard2" },
				filter(event, player) {
					if (event.card.name != "sha" || get.suit(event.card) != "heart") {
						return false;
					}
					return game.hasPlayer(target => {
						return target != player && !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
					});
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt(event.skill), "为" + get.translation(trigger.card) + "额外指定一个目标", (card, player, target) => {
							const evt = get.event().getTrigger();
							return target != player && !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target) && lib.filter.targetInRange(evt.card, player, target);
						})
						.set("ai", target => get.effect(target, _status.event.getTrigger().card, _status.event.player))
						.forResult();
				},
				content() {
					trigger.targets.addArray(event.targets);
				},
			},
			damage: {
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					const evt = event.getParent(2);
					return evt.name == "useCard" && evt.skill == "dragjunshen";
				},
				logTarget: "player",
				prompt2(event, player) {
					let prompt = "弃置其一张手牌，或令此伤害+1";
					if (!event.player.countDiscardableCards(event.player, "e")) {
						return prompt;
					}
					return `令${get.translation(event.player)}弃置装备区所有牌，然后你选择等量次：${prompt}`;
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					await target.discard(target.getDiscardableCards(target, "e"));
					const num = Math.max(
						1,
						target
							.getHistory("lose", evt => {
								return evt.type == "discard" && evt.getParent(2) == event;
							})
							.reduce((sum, evt) => (sum += evt.getl(target)?.cards2?.length), 0)
					);
					let count = 0;
					while (count < num) {
						count++;
						let result;
						if (!target.countDiscardableCards(player, "h")) {
							result = { index: 1 };
						} else {
							result = await player
								.chooseControl()
								.set("choiceList", [`弃置${get.translation(target)}一张手牌`, "令此伤害+1"])
								.set("ai", () => {
									const player = get.event().player,
										trigger = get.event().getTrigger();
									const eff1 = get.effect(trigger.player, { name: "guohe_copy2" }, player, player),
										eff2 = get.damageEffect(trigger.player, player, player);
									if (eff1 > eff2) {
										return 0;
									}
									return 1;
								})
								.forResult();
						}
						if (result.index == 0) {
							await player.discardPlayerCard(target, "h", true);
						} else {
							trigger.num++;
						}
					}
				},
			},
		},
	},
	//龙曹仁
	draglizhong: {
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			let choiceList = ["将任意张装备牌至于任意名角色的装备区", "令你或任意名装备区里有牌的角色摸一张牌"],
				choices = ["置入装备", "团体摸牌", "cancel2"];
			if (
				!player.countCards("he", card => {
					if (get.type(card) != "equip") {
						return false;
					}
					return game.hasPlayer(target => {
						return target.canEquip(card);
					});
				})
			) {
				choices.shift();
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			}
			const { control } = await player
				.chooseControl(choices)
				.set("prompt", "###" + get.prompt(event.skill) + "###选择首先执行的一项")
				.set("choiceList", choiceList)
				.set("ai", () => {
					return get.event().controls[0];
				})
				.forResult();
			event.result = { bool: control != "cancel2", cost_data: control };
		},
		async content(event, trigger, player) {
			let choices = ["置入装备", "团体摸牌"],
				used = false;
			if (event.cost_data == "团体摸牌") {
				choices.reverse();
			}
			choices.push(event.cost_data);
			for (let i = 1; i <= 3; i++) {
				if (i == 3 && used) {
					break;
				}
				switch (choices[i - 1]) {
					case "置入装备": {
						while (
							player.hasCard(card => {
								if (get.type(card) != "equip") {
									return false;
								}
								return game.hasPlayer(target => {
									return target.canEquip(card);
								});
							}, "he")
						) {
							const { bool, cards, targets } = await player
								.chooseCardTarget({
									prompt: "厉战：将一张装备牌置于一名角色的装备区",
									filterCard(card) {
										return get.type(card) == "equip";
									},
									position: "he",
									filterTarget(card, player, target) {
										return target.canEquip(card);
									},
									ai1(card) {
										return 6 - get.value(card);
									},
									ai2(target) {
										const player = get.event().player;
										const att = get.attitude(player, target);
										if (att <= 0 || target.countCards("e")) {
											return 0;
										}
										return att * (target == player ? 1 : 3);
									},
								})
								.forResult();
							if (bool) {
								if (i == 1 && !used) {
									used = true;
								}
								const card = cards[0],
									target = targets[0];
								player.line(target);
								if (target != player) {
									player.$give(card, target, false);
								}
								await game.delay(0.5);
								await target.equip(card);
							} else {
								break;
							}
						}
						break;
					}
					case "团体摸牌": {
						const result = await player
							.chooseTarget(
								"厉战：令你或任意名装备区有牌的角色摸一张牌",
								(card, player, target) => {
									if (target != player && !target.countCards("e")) {
										return false;
									}
									if (ui.selected.targets.length) {
										const choose = ui.selected.targets[0];
										if (choose == player && !player.countCards("e")) {
											return false;
										}
									}
									return true;
								},
								[1, Infinity]
							)
							.set("multitarget", true)
							.set("complexTarget", true)
							.set("ai", target => {
								const player = get.event().player;
								if (!player.countCards("e")) {
									if (
										game.countPlayer(choose => {
											return choose.countCards("e") && get.attitude(player, choose) > 0;
										}) > 1 &&
										target == player
									) {
										return 0;
									}
								}
								return get.attitude(player, target);
							})
							.forResult();
						if (result.bool) {
							if (i == 1 && !used) {
								used = true;
							}
							const targets = result.targets.sortBySeat();
							player.line(targets);
							choices.addArray(targets);
							for (let j = 0; j < targets.length; j++) {
								await targets[j].draw("nodelay");
							}
							await game.delayx();
						}
						break;
					}
				}
			}
			choices = choices.slice(3);
			if (choices.length) {
				choices.sortBySeat();
				player.line(choices);
				for (const target of choices) {
					target.addTempSkill("draglizhong_effect", "roundStart");
				}
				await game.delayx();
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + 2;
					},
				},
				enable: "chooseToUse",
				filterCard: true,
				position: "e",
				viewAs: { name: "wuxie" },
				filter(event, player) {
					return player.countCards("e") > 0;
				},
				viewAsFilter(player) {
					return player.countCards("e") > 0;
				},
				prompt: "将一张装备区的牌当作【无懈可击】使用",
				check(card) {
					return 8 - get.equipValue(card);
				},
				mark: true,
				marktext: "守",
				intro: { content: "手牌上限+2，可将装备区的牌当作【无懈可击】使用" },
			},
		},
	},
	//撅碎（难视
	dragjuesui: {
		trigger: { global: "dying" },
		filter(event, player) {
			return !player.getStorage("dragjuesui").includes(event.player) && event.player.hasEnabledSlot();
		},
		check(event, player) {
			const target = event.player;
			if (get.attitude(player, target) <= 0) {
				return false;
			}
			return player.countCards("hs", card => player.canSaveCard(card, target)) + target.countCards("hs", card => target.canSaveCard(card, target)) < 1 - target.hp;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			player.markAuto("dragjuesui", [target]);
			const { bool } = await target.chooseBool("是否将体力值回复至1点并废除装备栏？").forResult();
			if (bool) {
				await target.recoverTo(1);
				let disables = [];
				for (let i = 1; i <= 5; i++) {
					for (let j = 0; j < target.countEnabledSlot(i); j++) {
						disables.push(i);
					}
				}
				if (disables.length) {
					await target.disableEquip(disables);
				}
				target.addSkill("dragjuesui_wusheng");
			} else {
				target.chat("拒绝！");
			}
		},
		init(player) {
			if (player.getStorage("dragjuesui").length) {
				player.markSkill("dragjuesui");
			}
		},
		intro: { content: "已对$发动过此技能" },
		subSkill: {
			wusheng: {
				charlotte: true,
				mark: true,
				marktext: "碎",
				intro: { content: "殊死一搏！可将黑色非基本牌当作无次数限制的【杀】使用" },
				mod: {
					cardUsable(card, player, num) {
						if (card.storage && card.storage.dragjuesui) {
							return Infinity;
						}
					},
				},
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard(card, player) {
					return get.color(card) == "black" && get.type(card) != "basic";
				},
				position: "hse",
				viewAs: { name: "sha", storage: { dragjuesui: true } },
				viewAsFilter(player) {
					if (
						!player.countCards("hes", card => {
							return get.color(card) == "black" && get.type(card) != "basic";
						})
					) {
						return false;
					}
				},
				prompt: "将一张黑色非基本牌当作无次数限制的【杀】使用或打出",
				check(card) {
					return 7 - get.value(card);
				},
				ai: {
					order(item, player) {
						if (!player || !_status.event.type || _status.event.type != "phase") {
							return 0.1;
						}
						return get.order({ name: "sha" }, player) * 0.99;
					},
					respondSha: true,
					skillTagFilter(player) {
						if (
							!player.countCards("hes", card => {
								return get.color(card) == "black" && get.type(card) != "basic";
							})
						) {
							return false;
						}
					},
				},
			},
		},
	},
	//吕常×SP淳于琼√
	dragjuwu: {
		trigger: { target: "shaBefore" },
		filter(event, player) {
			return !game.hasNature(event.card) && game.countPlayer(target => event.player.inRange(target)) >= 3;
		},
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (card.name == "sha" && !game.hasNature(card) && game.countPlayer(targetx => player.inRange(targetx)) >= 3) {
						return "zerotarget";
					}
				},
			},
		},
	},
	dragshouxiang: {
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			if (!game.hasPlayer(target => target.inRange(player))) {
				return false;
			}
			return !event.numFixed;
		},
		frequent: true,
		async content(event, trigger, player) {
			const num = Math.min(
				3,
				game.countPlayer(target => target.inRange(player))
			);
			trigger.num += num;
			const result = await player
				.chooseTarget(`守襄：选择至多${num}名角色`, true, [1, num])
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target);
				})
				.forResult();
			if (result.bool) {
				player.line(result.targets, "green");
				for (const target of result.targets.sortBySeat(_status.currentPhase)) {
					player
						.when({
							player: "phaseDrawEnd",
						})
						.filter(evt => evt == trigger)
						.step(async (event, trigger, player) => {
							const bool1 = player.countCards("h") && player != target,
								bool2 = player.countCards("hes", card => {
									if (get.name(card, player) != "sha") {
										return false;
									}
									const tao = get.autoViewAs({ name: "tao" }, [card]);
									if (!lib.filter.cardEnabled(tao, player, "forceEnable")) {
										return false;
									}
									return lib.filter.targetEnabled2(tao, player, target);
								});
							let result = bool1 ? (bool2 ? 2 : 0) : bool2 ? 1 : -1;
							if (result == -1) {
								return;
							}
							if (result == 2) {
								const result2 = await player
									.chooseControl()
									.set("choiceList", [`交给${get.translation(target)}一张牌`, `将一张【杀】当作【桃】对${get.translation(target)}使用`])
									.set("eff", get.effect(target, { name: "tao" }, player, player))
									.set("ai", () => {
										if (get.event().eff > 0) {
											return 1;
										}
										return 0;
									})
									.forResult();
								result = result2.index;
							}
							if (result == 1) {
								const result2 = await player
									.chooseCard({
										prompt: `将一张【杀】当作【桃】对${get.translation(target)}使用`,
										position: "hes",
										filterCard(card) {
											if (get.name(card, get.player()) != "sha") {
												return false;
											}
											const tao = get.autoViewAs({ name: "tao" }, [card]),
												target = get.event().target;
											if (!lib.filter.cardEnabled(tao, player, "forceEnable")) {
												return false;
											}
											return lib.filter.targetEnabled2(tao, player, target);
										},
										forced: true,
										ai(card) {
											return 7 - get.value(card);
										},
										target: target,
									})
									.forResult();
								if (result2.bool) {
									await player.useCard(get.autoViewAs({ name: "tao" }, result2.cards), result2.cards, [target]);
								}
							} else {
								await player.chooseToGive("h", true, target);
							}
						});
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "phaseDiscardBegin" },
				filter(event, player) {
					return game.hasPlayer(target => target.inRange(player));
				},
				forced: true,
				async content(event, trigger, player) {
					const num = Math.min(
						5,
						game.countPlayer(target => target.inRange(player))
					);
					if (num) {
						if (_status.connectMode) {
							game.broadcastAll(() => (_status.noclearcountdown = true));
						}
						let list = [];
						while (
							num - list.length > 0 &&
							player.hasCard(card => {
								return !list.some(list => list[1] == card);
							}, "h") &&
							game.hasPlayer(target => {
								return target != player && !list.some(list => list[0] == target);
							})
						) {
							const { bool, targets, cards } = await player
								.chooseCardTarget({
									prompt: "守襄：你可以交给任意名角色各一张手牌",
									prompt2: "（还可分配" + (num - list.length) + "张）",
									position: "h",
									animate: false,
									filterCard(card, player) {
										return !get.event().list.some(list => list[1] == card);
									},
									filterTarget(card, player, target) {
										return target != player && !get.event().list.some(list => list[0] == target);
									},
									ai1(card) {
										if (card.name == "shan") {
											return 1;
										}
										return Math.random();
									},
									ai2(target) {
										return get.attitude(get.event().player, target);
									},
								})
								.set("list", list)
								.forResult();
							if (bool) {
								list.push([targets[0], cards[0]]);
								player.addGaintag(cards, "olsujian_given");
							} else {
								break;
							}
						}
						if (_status.connectMode) {
							game.broadcastAll(() => {
								delete _status.noclearcountdown;
								game.stopCountChoose();
							});
						}
						if (list.length) {
							await game
								.loseAsync({
									gain_list: list,
									player: player,
									cards: list.slice().flatMap(list => list[1]),
									giver: player,
									animate: "giveAuto",
								})
								.setContent("gaincardMultiple");
						}
					}
				},
			},
		},
	},
};

export default skills;
