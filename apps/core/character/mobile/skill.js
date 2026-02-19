import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//缘檀石槐
	mblianzhan: {
		audio: 2,
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			return event.card.name == "sha" && typeof get.number(event.card) == "number" && event.targets?.length == 1 && event.targets[0]?.isIn();
		},
		direct: true,
		async content(event, trigger, player) {
			const {
				targets: [target],
				card,
			} = trigger;
			player.addTempSkill(`${event.name}_draw`);
			const result = await player
				.chooseToUse(get.prompt2(event.name, target).replace("更大", `大于${get.number(card)}`))
				.set("num", get.number(card))
				.set("targetx", target)
				.set("filterCard", card => get.number(card) > get.event().num && get.name(card) == "sha")
				.set("filterTarget", (card, player, target) => {
					const { targetx } = get.event();
					if (!ui.selected.targets?.includes(targetx) && target != targetx) {
						return false;
					}
					return lib.filter.targetEnabled.call(this, card, player, target);
				})
				.set("addCount", false)
				.set("logSkill", event.name)
				.forResult();
		},
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (get.event().name == "chooseToUse" && get.name(card) == "sha") {
					const numx = get.number(card) || 13;
					return num + 13 - numx;
				}
			},
		},
		subSkill: {
			draw: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					const evt = event.getParent(2);
					return evt?.name == "mblianzhan" && evt?.player == player;
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
	},
	mbkoulve: {
		audio: 2,
		forced: true,
		trigger: {
			player: "gainBegin",
		},
		filter(event, player) {
			return event.getParent("phaseDraw")?.player != player;
		},
		async content(event, trigger, player) {
			trigger.gaintag.add(event.name);
		},
		mod: {
			ignoredHandcard(card, player) {
				if (card.hasGaintag("mbkoulve")) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (card.hasGaintag("mbkoulve") && name == "phaseDiscard") {
					return false;
				}
			},
			cardname(card, player) {
				const event = get.event();
				if (!["chooseToUse", "chooseToRespond"].includes(event.name)) {
					return;
				}
				if (card.hasGaintag("mbkoulve")) {
					return "sha";
				}
			},
			cardnature(card, player) {
				const event = get.event();
				if (!["chooseToUse", "chooseToRespond"].includes(event.name)) {
					return;
				}
				if (card.hasGaintag("mbkoulve")) {
					return false;
				}
			},
		},
	},
	//缘吕布
	mblvezhen: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return game.hasPlayer(target => target != player);
		},
		logTarget: (event, player) => game.filterPlayer(target => target != player),
		check: () => true,
		async content(event, trigger, player) {
			const { targets } = event;
			await game.doAsyncInOrder(targets, async target => {
				const num = target.countMark("mblvezhen_show") + 1;
				const result = await target
					.chooseCard(
						`掠阵：是否展示${num}张手牌，或者取消令${get.translation(player)}视为对你使用一张无距离次数限制的【杀】`,
						Math.min(target.countCards("h"), num),
						"h"
					)
					.set("sourcex", player)
					.set("num", num)
					.set("cardx", get.autoViewAs({ name: "sha", isCard: true }))
					.set("ai", card => {
						const { sourcex, player, cardx, num } = get.event();
						if (
							!sourcex.canUse(cardx, player, false, false) ||
							!sourcex.hasSkill("mbhengwei") ||
							get.effect(player, cardx, sourcex, player) > 0
						) {
							return 0;
						}
						const att = get.attitude(player, sourcex);
						if (att > 0 || player.countCards("h", card => get.color(card) != "red") >= num) {
							return get.color(card) == "red" ? Math.random() : Math.random() + 1;
						}
						return Math.random() - 0.5;
					})
					.forResult();
				if (result?.bool) {
					target.addMark("mblvezhen_show", 1, false);
					return target.showCards(result.cards);
				} else {
					const card = get.autoViewAs({ name: "sha", isCard: true });
					if (player.canUse(card, target, false, false)) {
						return player.useCard(card, target, false);
					}
				}
			});
		},
	},
	mbhengwei: {
		audio: 2,
		forced: true,
		trigger: {
			source: "damageBegin1",
		},
		filter(event, player) {
			return event.player != player;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			if (!target.countGainableCards(player, "h")) {
				trigger.num++;
			} else {
				const result = await target
					.chooseCard(`横威：是否${get.translation(player)}交给一张手牌， 否则此次伤害+1`, "h")
					.set("ai", card => {
						const trigger = get.event().getTrigger();
						const { player } = get.event();
						if (trigger.num + 1 >= player.getHp()) {
							return 7.5 - get.value(card);
						}
						return 6 - get.value(card);
					})
					.forResult();
				if (result?.bool) {
					const { cards } = result;
					await target.showCards(cards);
					await target.give(cards, player);
				} else {
					trigger.num++;
				}
			}
		},
		group: ["mbhengwei_show"],
		subSkill: {
			show: {
				forced: true,
				trigger: {
					global: ["showCardsAfter"],
				},
				filter(event, player, name, target) {
					return _status.currentPhase == player && target?.isIn();
				},
				getIndex(event, player) {
					if (_status.currentPhase != player) {
						return [];
					}
					return game.filterPlayer(target => target != player && event.getShown(target)?.cards2?.length);
				},
				logTarget(event, player, name, target) {
					return target;
				},
				async content(event, trigger, player) {
					const {
						targets: [target],
					} = event;
					const cards = trigger.getShown(target).cards2;
					target.addTempSkill("mbhengwei_debuff");
					target.markAuto("mbhengwei_debuff", cards.map(i => get.color(i)).unique());
				},
			},
			debuff: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "不能使用$的手牌",
				},
				mod: {
					cardEnabled(card, player, result) {
						if (!card.cards?.length) {
							return;
						}
						const hs = player.getCards("h");
						const colors = player.getStorage("mbhengwei_debuff");
						if (card.cards?.some(i => hs.includes(i) && colors.includes(get.color(i)))) {
							return false;
						}
					},
					cardSavable(card, player, target, result) {
						return get.info("mbhengwei_debuff").mod?.cardEnabled?.call(this, card, player, result);
					},
				},
			},
		},
	},
	//缘高顺
	mbjiren: {
		audio: 2,
		limited: true,
		skillAnimation: true,
		animationColor: "soil",
		enable: "phaseUse",
		manualConfirm: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			game.addGlobalSkill(`${event.name}_global`);
		},
		subSkill: {
			global: {
				mod: {
					playerEnabled(card, player, target) {
						if (get.subtype(card) != "equip1" && player == target) {
							return false;
						}
					},
				},
			},
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	mbjuezhi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.getStorage("mbjuezhi_used").length < 2;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [
					[`nodamage`, `摸两张牌，视为使用一张【决斗】，然后弃置手牌中所有非伤害牌`],
					["damage", "摸两张牌，然后回复1点体力并弃置手牌中所有伤害牌"],
				];
				return ui.create.dialog("决止", [list, "textbutton"], "hidden");
			},
			check(button) {
				return Math.random() + (button.link == "damage" && get.player().isDamaged() ? 1 : 0);
			},
			filter(button) {
				return !get.player().getStorage("mbjuezhi_used").includes(button.link);
			},
			backup(links, player) {
				return {
					audio: "mbjuezhi",
					choice: links[0],
					async content(event, trigger, player) {
						const { choice } = get.info(event.name);
						player.addTempSkill("mbjuezhi_used", "phaseChange");
						player.markAuto("mbjuezhi_used", choice);
						await player.draw(2);
						if (choice == "nodamage") {
							const card = get.autoViewAs({ name: "juedou", isCard: true });
							if (player.hasUseTarget(card, true, false)) {
								await player.chooseUseTarget(card, false);
							}
							await player.modedDiscard(player.getCards("h", card => !get.is.damageCard(card, true)));
						} else if (choice == "damage") {
							await player.recover();
							await player.modedDiscard(player.getCards("h", card => get.is.damageCard(card, true)));
						}
					},
				};
			},
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
		subSkill: {
			backup: {},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//韩玄
	mbweizhan: {
		audio: 2,
		trigger: {
			global: "phaseUseBegin",
		},
		filter(event, player) {
			return event.player != player && get.distance(player, event.player) <= 1;
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0 || event.player.countCards("h") > 6;
		},
		async content(event, trigger, player) {
			await player.draw();
			const target = trigger.player;
			const num = player.countGainableCards(target, "he");
			if (num <= 0) {
				return;
			}
			const result = await player
				.chooseToGive(target, "he", [1, Math.min(3, num)], true)
				.set("ai", card => {
					if (ui.selected.cards.length) {
						return 0;
					}
					return 6 - get.value(card);
				})
				.set("complexCard", true)
				.forResult();
			if (!result?.bool || !result.cards?.length) {
				return;
			}
			const numx = result.cards.length;
			player
				.when({
					global: "phaseEnd",
				})
				.filter(evt => evt == trigger.getParent("phase", true, true))
				.step(async (event, trigger, player) => {
					let damage = 0;
					target.getHistory("sourceDamage", evt => {
						damage += evt.num;
					});
					if (damage >= numx) {
						await player.draw(2);
					} else {
						const num = Math.min(2, target.countGainableCards(player, "he"));
						if (num > 0) {
							await player.gainPlayerCard(target, "he", num, true);
						}
					}
				});
		},
	},
	mbyilv: {
		audio: 4,
		trigger: {
			target: "useCardToPlayered",
		},
		logTarget: "player",
		logAudio: () => 1,
		filter(event, player) {
			return player != event.player && event.card.name == "sha" && event.player.isIn();
		},
		check(event, player) {
			return get.effect(player, event.card, event.player, player) <= 0;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			const result = await player
				.chooseToDuiben(target)
				.set("title", "谋弈")
				.set("namelist", ["长驱直入", "无懈可击", "金蝉脱壳", "弃履狂奔"]) //应对策略不明
				.set("translationList", [
					`以防止${get.translation(player)}令此杀伤害-1`,
					`以防止${get.translation(player)}令你随机弃置一张手牌`,
					`若成功，你令${get.translation(target)}随机弃置一张手牌`,
					`若成功，你令此杀伤害-1`,
				])
				.set("ai", button => {
					return 1 + Math.random();
				})
				.forResult();
			if (result.bool) {
				if (result.player == "db_def1") {
					const cards = target.getDiscardableCards(player, "he");
					if (cards.length) {
						const discards = cards.randomGets(1);
						await target.modedDiscard(discards);
						if (get.type(discards[0]) == "basic") {
							await player.gain(discards, "gain2");
						}
					}
				} else {
					const skill = "mbyilv_effect";
					target.addTempSkill(skill);
					target.markAuto(skill, trigger.card);
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: {
					source: "damageBegin1",
				},
				filter(event, player) {
					return event.card && player.getStorage("mbyilv_effect").includes(event.card);
				},
				direct: true,
				firstDo: true,
				async content(event, trigger, player) {
					game.log(trigger.card, "造成的伤害-1");
					trigger.num--;
				},
			},
			true1: {
				audio: "mbyilv2.mp3",
			},
			true2: {
				audio: "mbyilv3.mp3",
			},
			false: {
				audio: "mbyilv4.mp3",
			},
		},
	},
	//老友记dlc-合肥
	hefeichonglei: {
		audio: 2,
		forced: true,
		trigger: {
			global: ["useCard", "respond"],
		},
		usable: 1,
		filter(event, player) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			if (!event.respondTo || !Array.isArray(event.respondTo)) {
				return false;
			}
			if (player != event.player && player != event.respondTo[0]) {
				return false;
			}
			if (event.player == event.respondTo[0]) {
				return false;
			}
			const target = event.player == player ? event.respondTo[0] : event.player;
			return target.countGainableCards(player, "he");
		},
		logTarget(event, player) {
			if (event.player == player) {
				return event.respondTo[0];
			}
			return event.player;
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			await player.gainPlayerCard(target, "he", true);
		},
		global: "hefeichonglei_wansha",
		subSkill: {
			wansha: {
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard(card, player) {
					const target = get.event()?.getParent("phaseUse", true, true)?.player;
					if (!target || !target.hasSkill("hefeichonglei") || target == player || player.isDying()) {
						return false;
					}
					if (target.hasSkill("hefeiheyuzhangliao") && get.info("friendgongli").isFriendOf(target, "hefei_lidian")) {
						return true;
					}
					return get.name(card) != "sha";
				},
				position: "hs",
				viewAs: {
					name: "shan",
				},
				viewAsFilter(player) {
					const target = get.event()?.getParent("phaseUse", true, true)?.player;
					if (!target || !target.hasSkill("hefeichonglei") || target == player || player.isDying()) {
						return false;
					}
					if (
						player.countCards("hs", card => {
							if (target.hasSkill("hefeiheyuzhangliao") && get.info("friendgongli").isFriendOf(target, "hefei_lidian")) {
								return true;
							}
							return get.name(card) != "sha";
						})
					) {
						return true;
					}
					return false;
				},
				prompt() {
					const target = get.event()?.getParent("phaseUse", true, true)?.player;
					if (!target || !target.hasSkill("hefeichonglei")) {
						return "";
					}
					if (target.hasSkill("hefeiheyuzhangliao") && get.info("friendgongli").isFriendOf(target, "hefei_lidian")) {
						return "将一张手牌当作闪使用或打出";
					}
					return "将一张非【杀】手牌当作闪使用或打出";
				},
				check(card) {
					const val = get.value(card);
					if (_status.event.name == "chooseToRespond") {
						return 1 / Math.max(0.1, val);
					}
					return 5 - val;
				},
				locked: false,
				ai: {
					respondShan: true,
					skillTagFilter(player) {
						const target = get.event()?.getParent("phaseUse", true, true)?.player;
						if (!target || !target.hasSkill("hefeichonglei") || target == player || player.isDying()) {
							return false;
						}
						if (
							!player.countCards("hs", card => {
								if (target.hasSkill("hefeiheyuzhangliao") && get.info("friendgongli").isFriendOf(target, "hefei_lidian")) {
									return true;
								}
								return get.name(card) != "sha";
							})
						) {
							return false;
						}
					},
				},
				mod: {
					cardEnabled(card, player) {
						if (get.name(card) == "shan" || player.isDying()) {
							return;
						}
						const target = get.event()?.getParent("phaseUse", true, true)?.player;
						if (!target || !target.hasSkill("hefeichonglei") || target == player) {
							return;
						}
						const hs = player.getCards("hs", card => {
							if (target.hasSkill("hefeiheyuzhangliao") && get.info("friendgongli").isFriendOf(target, "hefei_lidian")) {
								return true;
							}
							return get.name(card) != "sha";
						});
						if ("cards" in card && Array.isArray(card.cards) && card.cards.containsSome(...hs)) {
							return false;
						}
					},
					cardRespondable(card, player) {
						if (get.name(card) == "shan" || player.isDying()) {
							return;
						}
						const target = get.event()?.getParent("phaseUse", true, true)?.player;
						if (!target || !target.hasSkill("hefeichonglei") || target == player) {
							return;
						}
						const hs = player.getCards("hs", card => {
							if (target.hasSkill("hefeiheyuzhangliao") && get.info("friendgongli").isFriendOf(target, "hefei_lidian")) {
								return true;
							}
							return get.name(card) != "sha";
						});
						if ("cards" in card && Array.isArray(card.cards) && card.cards.containsSome(...hs)) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (get.name(card) == "shan" || player.isDying()) {
							return;
						}
						const target = get.event()?.getParent("phaseUse", true, true)?.player;
						if (!target || !target.hasSkill("hefeichonglei") || target == player) {
							return;
						}
						const hs = player.getCards("hs", card => {
							if (target.hasSkill("hefeiheyuzhangliao") && get.info("friendgongli").isFriendOf(target, "hefei_lidian")) {
								return true;
							}
							return get.name(card) != "sha";
						});
						if ("cards" in card && Array.isArray(card.cards) && card.cards.containsSome(...hs)) {
							return false;
						}
					},
				},
			},
		},
	},
	hefeidangshi: {
		audio: 4,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (!event.targets?.length) {
				return false;
			}
			return get.is.damageCard(event.card);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					const trigger = get.event().getTrigger();
					return trigger.targets?.includes(target);
				})
				.set("ai", target => {
					const player = get.player();
					if (get.attitude(player, target) > 0) {
						return 0;
					}
					if (!target.countCards("he")) {
						return get.damageEffect(target, player, player);
					}
					return 10 / target.countCards("he");
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				name,
			} = event;
			const getNum = (player, target) => {
				let num = target.countMark(`hefeidangshi_count`) + 1;
				if (player.hasSkill("hefeiheyuzhangliao") && get.info("friendgongli").isFriendOf(player, "hefei_yuejin")) {
					num = 3;
				}
				return num;
			};
			const list = [
				["useCard", `对${get.translation(player)}使用一张${get.translation(trigger.card.name)}`],
				["discard", `弃置${get.cnNumber(getNum(player, target))}张牌`],
				["damage", `受到1点伤害`],
			];
			const canChoose = list
				.map(info => info[0])
				.filter(info => {
					switch (info) {
						case "useCard": {
							return (
								target.countCards("hs", card => {
									if (get.name(card) != trigger.card.name) {
										return false;
									}
									return target.canUse(card, player);
								}) > 0
							);
						}
						case "discard": {
							const num = getNum(player, target);
							return target.countDiscardableCards(target, "he") >= num;
						}
						default: {
							return true;
						}
					}
				});
			const result =
				canChoose.length > 1
					? await target
							.chooseButton(["荡势：请选择一项", [list, "textbutton"]], true)
							.set("filterButton", button => {
								return get.event().canChoose?.includes(button.link);
							})
							.set("ai", button => {
								const { player, getNum } = get.event(),
									trigger = get.event().getTrigger();
								if (button.link == "useCard") {
									const cards = player.getCards("hs", card => {
											if (get.name(card) != trigger.card.name) {
												return false;
											}
											return player.canUse(card, trigger.player);
										}),
										check = card => get.effect(trigger.player, card, player, player);
									return check(cards.maxBy(check));
								}
								if (button.link == "discard") {
									return get.effect(player, { name: "guohe_copy2" }, player, player) / getNum;
								}
								return get.damageEffect(player, player, player);
							})
							.set("getNum", getNum(player, target) + 1)
							.set("canChoose", canChoose)
							.forResult()
					: {
							bool: true,
							links: canChoose,
						};
			if (!result?.bool || !result.links?.length) {
				return;
			}
			const type = result.links[0],
				next = { skill: name, type: type, event: event };
			game.log(target, "选择了", `#y${list.find(info => info[0] == type)?.[1]}`);
			player.getHistory("custom").push(next);
			if (
				!player.hasHistory("custom", evt => {
					if (evt.skill != name || evt.type != type) {
						return false;
					}
					return evt.event != event;
				})
			) {
				await player.draw();
			}
			switch (type) {
				case "useCard": {
					await target
						.chooseToUse({
							filterCard(card, player, event) {
								if (get.itemtype(card) != "card" || get.name(card) != get.event().cardx) {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							},
							prompt: `荡势：对${get.translation(player)}使用一张${get.translation(trigger.card.name)}`,
							addCount: false,
							forced: true,
							filterTarget(card, player, target) {
								if (target != get.event().sourcex) {
									return false;
								}
								return lib.filter.filterTarget.apply(this, arguments);
							},
						})
						.set("targetRequired", true)
						.set("complexTarget", true)
						.set("cardx", trigger.card.name)
						.set("sourcex", player);
					return;
				}
				case "discard": {
					const num = Math.min(target.countDiscardableCards(target, "he"), getNum(player, target));
					target.addMark(`${name}_count`, 1, false);
					if (num > 0) {
						await target.chooseToDiscard("he", true, num);
					}
					return;
				}
				default: {
					await target.damage("nosource");
					return;
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "出杀次数+#",
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("hefeidangshi_effect");
						}
					},
				},
			},
		},
	},
	hefeiheyuzhangliao: {
		audio: 2,
		locked: true,
		ai: {
			combo: ["hefeichonglei", "hefeidangshi"],
		},
	},
	hefeiduanjin: {
		audio: 2,
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			if (get.type(event.card) != "basic") {
				return false;
			}
			return game.hasPlayer(current => {
				if (current == player || !current.hasHistory("useCard")) {
					return false;
				}
				return current.countDiscardableCards(player, "he") > 0;
			});
		},
		async cost(event, trigger, player) {
			const targets = game.filterPlayer(current => {
				if (current == player || !current.hasHistory("useCard")) {
					return false;
				}
				return current.countDiscardableCards(player, "he") > 0;
			});
			if (!targets.length) {
				return;
			}
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return get.event().targetx.includes(target);
				})
				.set("targetx", targets)
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.discardPlayerCard(target, "he", true);
		},
	},
	hefeigaigong: {
		audio: 4,
		trigger: {
			source: "damageSource",
			player: "damageEnd",
		},
		filter(event, player) {
			if (event.player == event.source) {
				return false;
			}
			return [event.player, event.source].some(current => {
				if (!current?.isIn()) {
					return false;
				}
				return current.countCards("h") >= 2;
			});
		},
		usable: 1,
		async cost(event, trigger, player) {
			const targets = [trigger.player, trigger.source].filter(current => {
				if (!current?.isIn()) {
					return false;
				}
				return current.countCards("h") >= 2;
			});
			if (!targets?.length) {
				return;
			}
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return get.event().targetx.includes(target);
				})
				.set("targetx", targets)
				.set("ai", target => {
					return Math.max(0.1, get.attitude(get.player(), target));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player.choosePlayerCard(target, 2, true, "h", "展示两张手牌并与牌堆底的牌交换").forResult();
			if (!result?.bool || !result.links?.length) {
				return;
			}
			const cards = result.links;
			await player.showCards(cards, `${get.translation(player)}发动了【概公】`);
			const cards2 = get.bottomCards(2, true);
			const result2 = await player
				.chooseToMove(`概公：交换${player == target ? "你" : get.translation(target)}的手牌与牌堆底的牌`, true)
				.set("list", [
					[`${player == target ? "你" : get.translation(target)}的手牌`, cards],
					["牌堆底", cards2],
				])
				.set("filterMove", function (from, to, moved) {
					if (typeof to == "number") {
						return false;
					}
					return true;
				})
				.set("att", get.attitude(player, target))
				.set("processAI", function (list) {
					const cards = list[0][1].slice(0).sort(function (a, b) {
						return get.value(b) - get.value(a);
					});
					if (get.event().att <= 0) {
						cards.reverse();
					}
					return [cards, cards.splice(2)];
				})
				.forResult();
			if (!result2?.bool || !result2.moved?.length) {
				return;
			}
			const puts = cards.removeArray(result2.moved[0]),
				gains = cards2.removeArray(result2.moved[1]);
			if (puts.length && gains.length) {
				target.$throw(puts.length, 1000);
				await target.lose(puts, ui.special);
				await target.gain(gains, "draw");
				const bottoms = result2.moved[1].slice();
				if (bottoms.length) {
					await game.cardsGotoOrdering(bottoms);
					await game.cardsGotoPile(bottoms);
					game.updateRoundNumber();
				}
			}
			const allCards = [puts, gains].flat(),
				suits = allCards.map(card => get.suit(card)).toUniqued();
			if (suits.length < 3 || allCards.every(card => !player.hasUseTarget(card))) {
				return;
			}
			const result3 = await player
				.chooseButton([
					"概公：是否使用一张牌？",
					[
						allCards.map(card => [
							card,
							(() => {
								return result2.moved[0].includes(card) ? "手牌" : "牌堆底";
							})(),
						]),
						(item, type, position, noclick, node) => {
							node = ui.create.buttonPresets.card(item[0], type, position, noclick);
							game.createButtonCardsetion(item[1], node);
							return node;
						},
					],
				])
				.set("filterButton", button => {
					return get.player().hasUseTarget(button.link);
				})
				.set("ai", button => {
					return get.player().getUseValue(button.link);
				})
				.forResult();
			if (!result3?.bool || !result3?.links?.length) {
				return;
			}
			const card = result3.links[0];
			if (player.hasUseTarget(card)) {
				await player.chooseUseTarget(card, true, false);
			}
		},
	},
	hefeiheyulidian: {
		audio: 2,
		trigger: {
			player: "useCard",
			global: "discardAfter",
		},
		filter(event, player) {
			const name = event.name == "useCard" ? "hefei_zhangliao" : "hefei_yuejin";
			if (!get.info("friendgongli").isFriendOf(player, name)) {
				return false;
			}
			const evt = event.getParent(2);
			if (event.name == "useCard") {
				return evt?.name == "hefeigaigong";
			}
			return evt?.name == "hefeiduanjin" && evt.player == player && event.cards?.someInD("od");
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				trigger.directHit.addArray(game.players);
				return;
			}
			const cards = trigger.cards?.filterInD("od");
			if (cards?.length) {
				await player.gain(cards, "gain2");
			}
		},
		ai: {
			combo: ["hefeiduanjin", "hefeigaigong"],
		},
	},
	hefeixianjian: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			return event.card.name == "sha" && event.targets?.length == 1;
		},
		async cost(event, trigger, player) {
			const target = trigger.target;
			const result = await player
				.chooseButton([
					get.prompt(event.skill, target),
					[
						[
							["draw", `摸一张牌，然后其需弃置${get.cnNumber(Math.max(1, target.countCards("ej")))}张牌`],
							["equip", `此杀结算结束后将对应实体牌置入其一个空置装备栏中，称为“陷坚”牌`],
						],
						"textbutton",
					],
				])
				.set("filterButton", button => {
					if (button.link == "draw") {
						return true;
					}
					const trigger = get.event().getTrigger();
					if (!trigger.cards?.length) {
						return false;
					}
					for (let i = 1; i < 6; i++) {
						if (trigger.target.hasEmptySlot(i)) {
							return true;
						}
					}
					return false;
				})
				.set("ai", button => {
					const trigger = get.event().getTrigger();
					if (get.attitude(get.player(), trigger.target) > 0) {
						return 0;
					}
					if (button.link == "draw") {
						return 2;
					}
					if (trigger.target.countCards("e", card => card.name == "hefei_xianjian")) {
						return 1;
					}
					return 3;
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				event.result = {
					bool: true,
					targets: [target],
					cost_data: result.links[0],
				};
			}
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: link,
			} = event;
			const card = trigger.getParent().card;
			card.storage ??= {};
			card.storage[event.name] ??= link;
			game.broadcastAll(
				(card, storage) => {
					card.storage = storage;
				},
				card,
				card.storage
			);
			if (link == "draw") {
				await player.draw();
				const num = Math.min(target.countDiscardableCards("he"), Math.max(1, target.countCards("ej")));
				if (num > 0) {
					await target.chooseToDiscard(num, "he", true);
				}
			} else {
				player
					.when({
						global: "useCardAfter",
					})
					.filter(evt => evt == trigger.getParent("useCard", true, true))
					.step(async (event, trigger, player) => {
						const cards = trigger.cards.filterInD("od");
						if (!cards?.length) {
							return;
						}
						const list = [];
						for (let i = 1; i < 6; i++) {
							const slot = `equip${i}`;
							if (target.hasEmptySlot(slot)) {
								list.add(slot);
							}
						}
						const result = await player
							.chooseControl(list)
							.set("prompt", `陷坚：将${get.translation(cards)}置入${get.translation(target)}的一个空置装备栏中`)
							.set("ai", () => {
								return get.event().resultx;
							})
							.set("resultx", list.randomGet())
							.forResult();
						if (result.control) {
							const card = get.autoViewAs({ name: `hefei_xianjian` }, cards);
							card.subtypes = [result.control];
							target.$gain2(cards, false);
							await target.equip(card);
						}
					});
			}
		},
	},
	hefeizherui: {
		audio: 4,
		trigger: {
			global: "useCardToPlayered",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			return event.player.countCards("e", card => card.name == "hefei_xianjian");
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.chooseButton(
					[
						`${get.translation(player)}对你发动了【陷坚】，选择一项：`,
						[
							[
								["draw", `其摸一张牌，然后你需弃置${get.cnNumber(Math.max(1, target.countCards("ej")))}张牌`],
								["equip", `此杀结算结束后其将对应实体牌置入你一个空置装备栏中，称为“陷坚”牌`],
							],
							"textbutton",
						],
					],
					true
				)
				.set("filterButton", button => {
					if (button.link == "draw") {
						return true;
					}
					const trigger = get.event().getTrigger();
					if (!trigger.cards?.length) {
						return false;
					}
					for (let i = 1; i < 6; i++) {
						if (trigger.player.hasEmptySlot(i)) {
							return true;
						}
					}
					return false;
				})
				.set("ai", button => {
					if (button.link == "draw") {
						return 2;
					}
					return 1.3 + Math.random();
				})
				.forResult();
			if (!result?.bool || !result.links?.length) {
				return;
			}
			const skill = "hefeixianjian";
			player.logSkill(skill, target);
			const next = game.createEvent(skill);
			next.player = player;
			next._trigger = trigger;
			next.targets = [target];
			next.cost_data = result.links[0];
			next.triggername = event.triggername;
			next.setContent(get.info(skill).content);
			await next;
		},
		group: "hefeizherui_damage",
		subSkill: {
			damage: {
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "equipAfter", "addJudgeAfter", "addToExpansionAfter", "gainAfter"],
				},
				getIndex(event, player) {
					let list = [];
					game.countPlayer(current => {
						const evt = event.getl(current);
						evt.es.forEach(card => {
							const VEquip = evt.vcard_map.get(card);
							if (VEquip?.name === "hefei_xianjian") {
								list.add([current, VEquip]);
							}
						});
						return false;
					});
					return list;
				},
				filter(event, player, name, list) {
					const [target, card] = list;
					if (!card || card.name != "hefei_xianjian") {
						return false;
					}
					return true;
				},
				forced: true,
				locked: false,
				logTarget(_1, _2, _3, list) {
					return list[0];
				},
				async content(event, trigger, player) {
					const target = event.indexedData[0];
					await target.damage(player);
				},
			},
		},
		ai: {
			combo: "hefeixianjian",
		},
	},
	hefeiheyuyuejin: {
		audio: 2,
		trigger: {
			source: "damageSource",
			global: ["loseAfter", "loseAsyncAfter", "equipAfter", "addJudgeAfter", "addToExpansionAfter", "gainAfter"],
		},
		filter(event, player) {
			const name = event.name == "damage" ? "hefei_zhangliao" : "hefei_lidian";
			if (!get.info("friendgongli").isFriendOf(player, name)) {
				return false;
			}
			if (event.name == "damage") {
				return event.card?.storage?.hefeixianjian;
			}
			const evts = game.getGlobalHistory("everything", evt => {
				if (!["lose", "gain", "loseAsync", "equip", "addJudge", "addToExpansion"].includes(evt.name)) {
					return false;
				}
				return true;
			});
			for (const evt of evts) {
				for (const current of game.filterPlayer(() => true)) {
					const evtx = evt.getl(current);
					if (evtx?.vcard_map?.size && Array.from(evtx.vcard_map.values()).some(card => card.name == "hefei_xianjian")) {
						return evt == event;
					}
				}
			}
			return false;
		},
		async cost(event, trigger, player) {
			if (trigger.name !== "damage") {
				event.result = {
					bool: true,
				};
				return;
			}
			const link = trigger.card?.storage?.hefeixianjian,
				target = trigger.player;
			const prompt =
				link !== "draw"
					? `你摸一张牌，其弃置${get.cnNumber(Math.max(1, target.countCards("ej")))}张牌`
					: `此杀结算后将对应实体牌置入其一个空置装备栏`;
			event.result = await player
				.chooseBool(get.prompt(event.skill, target), prompt)
				.set("choice", get.attitude(player, target) <= 0)
				.forResult();
			event.result.targets = [target];
		},
		async content(event, trigger, player) {
			if (trigger.name != "damage") {
				await player.draw();
				return;
			}
			const link = trigger.card?.storage?.hefeixianjian == "draw" ? "equip" : "draw";
			const next = game.createEvent("hefeixianjian_effect", false);
			next.player = player;
			next._trigger = trigger;
			next.targets = [trigger.player];
			next.cost_data = link;
			next.triggername = event.triggername;
			next.setContent(get.info("hefeixianjian").content);
			await next;
		},
		ai: {
			combo: "hefeixianjian",
		},
	},
	//数刘徽 by流年
	mbgeyuan: {
		audio: 2,
		init(player, skill) {
			let index = 0;
			player.setStorage(skill, index, true);
			player.addTip(skill, `${get.translation(skill)} ${get.info(skill).getNumList(index, true)}`);
		},
		onremove(player, skill) {
			player.setStorage(skill, undefined, true);
			player.removeTip(skill);
		},
		mark: true,
		marktext: "◯", //⚪
		intro: {
			markcount(storage) {
				storage = storage || 0;
				return Number(get.info("mbgeyuan").PI[storage]);
			},
			mark(dialog, storage, player, evt, skill) {
				let str = get.info(skill).getNumList(storage);
				dialog.addText(str);
			},
		},
		mod: {
			aiOrder(player, card, order) {
				let number = get.number(card, player),
					index = player.getStorage("mbgeyuan", 0);
				let num = Number(get.info("mbgeyuan").PI[index]);
				if (typeof number !== "number") {
					return;
				}
				if (num == number || (player.hasSkill("mbchongcha") && num == 0 && number > 9)) {
					return order + 10;
				}
			},
			aiUseful(player, card, useful) {
				let number = get.number(card, player),
					index = player.getStorage("mbgeyuan", 0);
				let num = Number(get.info("mbgeyuan").PI[index]);
				if (typeof number !== "number") {
					return;
				}
				if (num == number || (player.hasSkill("mbchongcha") && num == 0 && number > 9)) {
					return useful + 10;
				}
			},
		},
		trigger: { player: "useCard" },
		filter(event, player) {
			let index = player.getStorage("mbgeyuan", 0);
			let num = Number(get.info("mbgeyuan").PI[index]),
				number = get.number(event.card);
			if (num == number) {
				return true;
			}
			if (typeof number == "number" && number > 9) {
				return player.hasSkill("mbchongcha") && num == 0;
			}
			return false;
		},
		prompt2(event, player) {
			let draw = Math.min(3, player.getHistory("useSkill", evt => evt.skill === "mbgeyuan").length + 1);
			return `摸${get.cnNumber(draw)}张牌并调整“割圆”中X的值`;
		},
		frequent: "check",
		check(event, player) {
			return get.effect(player, { name: "draw" }, player, player) > 0;
		},
		async content(event, trigger, player) {
			await player.draw(Math.min(3, player.getHistory("useSkill", evt => evt.skill === event.name).length));
			let index = player.getStorage(event.name, 0);
			index++;
			const { PI, getNumList } = get.info(event.name);
			if (index >= PI.length) {
				index -= PI.length;
			}
			player.setStorage(event.name, index, true);
			player.addTip(event.name, `${get.translation(event.name)} ${getNumList(index, true)}`);
		},
		getNumList(index, isTip) {
			const { PI } = get.info("mbgeyuan");
			index = index || 0;
			function getNexts(index) {
				let result = "",
					cnt = 0;
				while (cnt++ < 3) {
					let index2 = index + cnt - 1;
					if (index2 >= PI.length) {
						index2 - PI.length;
					}
					result += PI[index2];
				}
				return result;
			}
			let first = isTip ? PI[index] : `<span data-nature="fire">${PI[index]}</span>`,
				nextNums = getNexts(index + 1);
			return first + nextNums;
		},
		PI: "1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679",
	},
	mbchongcha: {
		audio: 2,
		mod: {
			ignoredHandcard(card, player) {
				let number = get.number(card, player);
				if (typeof number == "number" && number > 9) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard") {
					let number = get.number(card, player);
					if (typeof number == "number" && number > 9) {
						return false;
					}
				}
			},
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (!player.hasSkill("mbgeyuan", null, false, false)) {
				return false;
			}
			return player.countDiscardableCards(player, "he") > 0;
		},
		position: "he",
		filterCard: lib.filter.cardDiscardable,
		check(card) {
			const player = get.player();
			let index = player.getStorage("mbgeyuan", 0);
			const { getNumList } = get.info("mbgeyuan");
			let next = Number(getNumList(index, true).slice(1, 2));
			if (get.number(card, player) == next) {
				return 0;
			}
			return 10 - get.value(card);
		},
		selectTarget: 0,
		prompt(event) {
			const player = get.player();
			let index = player.getStorage("mbgeyuan", 0);
			const { PI, getNumList } = get.info("mbgeyuan");
			let num = PI[index],
				next = getNumList(index, true).slice(1, 2);
			return `弃一张牌并调整“割圆”中X的值（当前为${num}，调整后为${next}）`;
		},
		async content(event, trigger, player) {
			let index = player.getStorage("mbgeyuan", 0);
			index++;
			const { PI, getNumList } = get.info("mbgeyuan");
			if (index >= PI.length) {
				index -= PI.length;
			}
			player.setStorage("mbgeyuan", index, true);
			player.addTip("mbgeyuan", `${get.translation("mbgeyuan")} ${getNumList(index, true)}`);
		},
		ai: {
			order(item, player) {
				player = player || get.player();
				let index = player.getStorage("mbgeyuan", 0),
					hs = player.getCards("hs", card => player.getUseValue(card));
				if (!hs.length) {
					return 0;
				}
				const { getNumList } = get.info("mbgeyuan");
				const numList = getNumList(index, true);
				let first = Number(numList.slice(0, 1)),
					next = Number(numList.slice(1, 2));
				if (hs.some(card => get.number(card, player) == first)) {
					return 0;
				} else if (!hs.some(card => get.number(card, player) == next)) {
					return 0;
				}
				return 10;
			},
			result: {
				player: 1,
			},
		},
	},
	//乐周瑜
	mbshouyue: {
		audio: 2,
		trigger: {
			player: ["phaseDrawBegin", "changeHpAfter"],
		},
		filter(event, player) {
			return event.name != "changeHp" || event.num < 0;
		},
		async cost(event, trigger, player) {
			const next = player.chooseButtonTarget({
				createDialog: [
					get.prompt(event.skill),
					[
						[
							["draw", `令一名角色摸一张牌，然后其获得${get.poptip("qinyin")}（已有则改为摸一张牌）`],
							["reset", "令一名角色复原武将牌"],
						],
						"textbutton",
					],
				],
				filterTarget: true,
				ai1(button) {
					const player = get.player();
					if (button.link == "draw") {
						return 2;
					}
					if (
						game.hasPlayer(current => {
							return get.attitude(player, current) > 0 && current.isTurnedOver();
						})
					) {
						return 3;
					}
					return 1;
				},
				ai2(target) {
					const player = get.player();
					if (ui.selected.buttons[0]?.link == "draw") {
						let eff = get.effect(target, { name: "draw" }, player, player);
						if (!target.hasSkill("qinyin", null, null, false)) {
							eff *= 1.3;
						}
						return eff;
					}
					if (get.attitude(player, target) <= 0) {
						return 0;
					}
					if (target.isTurnedOver()) {
						return 2;
					}
					if (target.isLinked()) {
						return 1.5;
					}
					return 1;
				},
			});
			next.set(
				"targetprompt2",
				next.targetprompt2.concat([
					target => {
						if (!target.isIn() || ui.selected.buttons[0]?.link !== "draw") {
							return false;
						}
						if (target.hasSkill("qinyin", null, null, false)) {
							return "摸一张牌";
						}
						return "获得【琴音】";
					},
				])
			);
			const result = await next.forResult();
			if (result?.bool && result.links?.length) {
				event.result = {
					bool: true,
					targets: result.targets,
					cost_data: result.links[0],
				};
			}
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: link,
			} = event;
			if (link == "draw") {
				await target.draw();
				if (target.hasSkill("qinyin", null, null, false)) {
					await target.draw();
				} else {
					await target.addSkills("qinyin");
				}
			} else {
				await target.turnOver(false);
				await target.link(false);
			}
		},
		derivation: "qinyin",
	},
	mbdieyin: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return !player.isTurnedOver();
		},
		chooseButton: {
			dialog(event, player) {
				const list = lib.phaseName.map(name => ["", "", `lusu_${name}`]);
				return ui.create.dialog("叠音", [list, "vcard"], "hidden");
			},
			check(button) {
				if (button.link[2].slice(5) == "phaseDraw") {
					return 2;
				}
				return Math.random();
			},
			prompt(links, player) {
				return `翻面并于本阶段结束后执行一个${get.translation(links[0][2])}`;
			},
			backup(links, player) {
				return {
					audio: "mbdieyin",
					phase: links[0][2].slice(5),
					async content(event, trigger, player) {
						const { phase } = get.info(event.name);
						await player.turnOver(true);
						const evt = event.getParent("phase", true, true);
						if (evt?.name == "phase") {
							evt.phaseList.splice(evt.num + 1, 0, `${phase}|mbdieyin`);
						}
					},
				};
			},
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					if (player.hasSkill("mbshouyue")) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: {
			backup: {},
		},
	},
	//御曹植
	mbchongsi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (player.hasSkill("mbchongsi_damage")) {
				return false;
			}
			return game.hasPlayer(current => current != player);
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog(
					"冲司",
					[
						[
							["sha", "使用一张【杀】"],
							["discard", "弃置两张手牌"],
							["damage", "对自己或装备【六龙骖驾】的角色造成1点伤害"],
						],
						"textbutton",
					],
					"hidden"
				);
			},
			filter(button, player) {
				switch (button.link) {
					case "sha": {
						return player.hasUsableCard("sha", "use");
					}
					case "discard": {
						return player.countDiscardableCards(player, "h") > 1;
					}
					default: {
						return true;
					}
				}
			},
			check(button) {
				const player = get.player();
				switch (button.link) {
					case "sha": {
						const card = get.autoViewAs({ name: "sha" }, "unsure");
						return player.getUseValue(card);
					}
					case "discard": {
						return 2 * get.effect(player, { name: "guohe_copy", position: "h" }, player, player);
					}
					default: {
						return 0;
					}
				}
			},
			prompt(links, player) {
				return "执行你选择的项，并选择一名其他角色，令其也选择一项执行";
			},
			backup(links, player) {
				return {
					audio: "mbchongsi",
					filterTarget: lib.filter.notMe,
					ai1: () => 1,
					ai2(target) {
						const player = get.player();
						const targets = game.filterPlayer(current => {
								return current == target || Boolean(current.getEquip("cz_liulongcanjia"));
							}),
							getE = current => get.damageEffect(current, target, target);
						if (get.damageEffect(targets.maxBy(getE), target, player) > 0) {
							return Math.max(0.1, get.attitude(player, target));
						}
						return -get.attitude(player, target);
					},
					choice: links[0],
					async content(event, trigger, player) {
						const {
							targets: [target],
						} = event;
						const { choice: link } = get.info(event.name);
						const func = async (current, link) => {
							let mustDamage;
							if (link == "sha") {
								const result = await current
									.chooseToUse(function (card, player, event) {
										if (get.name(card) != "sha") {
											return false;
										}
										return lib.filter.filterCard.apply(this, arguments);
									}, "冲司：使用一张杀")
									.forResult();
								if (!result?.bool) {
									const result2 = await current
										.chooseToDiscard("h", 2, "冲司：弃置两张手牌，否则你须对你或装备有【六龙骖驾】的角色造成1点伤害")
										.set("ai", card => {
											if (get.event().eff) {
												return 0;
											}
											return 6 - get.value(card);
										})
										.set(
											"eff",
											(() => {
												const targets = game.filterPlayer(currentx => {
														return currentx == current || Boolean(currentx.getEquip("cz_liulongcanjia"));
													}),
													getE = currentx => get.damageEffect(currentx, current, current);
												return getE(targets.maxBy(getE)) >= 0;
											})()
										)
										.forResult();
									if (!result2?.bool) {
										mustDamage = true;
									}
								}
							}
							if (link == "discard") {
								const num = Math.min(2, current.countDiscardableCards(current, "h"));
								if (num > 0) {
									await current.chooseToDiscard("h", true, num);
								}
							}
							if (link == "damage" || mustDamage) {
								current.addTempSkill("mbchongsi_damage", { global: "roundStart" });
								const targets = game.filterPlayer(currentx => {
									return currentx == current || Boolean(currentx.getEquip("cz_liulongcanjia"));
								});
								if (targets.length) {
									const result =
										targets.length > 1
											? await current
													.chooseTarget(
														"冲司：对你或装备有【六龙骖驾】的角色造成1点伤害",
														(card, player, target) => {
															return get.event().targetx.includes(target);
														},
														true
													)
													.set("targetx", targets)
													.set("ai", target => {
														const player = get.player();
														return get.damageEffect(target, player, player);
													})
													.forResult()
											: {
													bool: true,
													targets: targets,
												};
									if (result?.bool && result.targets?.length) {
										current.line(result.targets);
										const target = result.targets[0];
										await target.damage(current);
									}
								}
							}
						};
						await func(player, link);
						const result = await target
							.chooseButton(
								[
									"冲司：选择一项执行",
									[
										[
											["sha", "使用一张【杀】"],
											["discard", "弃置两张手牌"],
											["damage", "对自己或装备【六龙骖驾】的角色造成1点伤害"],
										],
										"textbutton",
									],
								],
								true
							)
							.set("filterButton", button => {
								const player = get.player();
								switch (button.link) {
									case "sha": {
										return player.hasUsableCard("sha", "use");
									}
									case "discard": {
										return player.countDiscardableCards(player, "h") > 1;
									}
									default: {
										return true;
									}
								}
							})
							.set("ai", button => {
								const player = get.player();
								switch (button.link) {
									case "sha": {
										const card = get.autoViewAs({ name: "sha" }, "unsure");
										return player.getUseValue(card);
									}
									case "discard": {
										return 2 * get.effect(player, { name: "guohe_copy", position: "h" }, player, player);
									}
									default: {
										const targets = game.filterPlayer(current => {
												return current == player || Boolean(current.getEquip("cz_liulongcanjia"));
											}),
											getE = current => get.damageEffect(current, player, player);
										return getE(targets.maxBy(getE));
									}
								}
							})
							.forResult();
						if (result?.bool && result.links?.length) {
							await func(target, result.links[0]);
						}
					},
				};
			},
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }, player) + 0.1;
			},
			result: {
				player: 1,
			},
		},
		subSkill: {
			backup: {},
			damage: {
				charlotte: true,
			},
		},
	},
	mbpeidong: {
		audio: 4,
		logAudio(event) {
			if (typeof event == "number") {
				return `mbpeidong${event}.mp3`;
			}
			return 4;
		},
		enable: "chooseToUse",
		filter(event, player) {
			const filterCard = name => {
					const card = new lib.element.VCard({ name: name, isCard: true });
					return event.filterCard(card, player, event);
				},
				filter = card => card.name == "cz_liulongcanjia";
			if (filterCard("sha") && player.canMoveCard(false, true, player, player.getNext(), filter, false)) {
				return true;
			}
			if (
				filterCard("shan") &&
				game.hasPlayer(current => {
					return current != player && current.getGainableCards(player, "ej", filter).length > 0;
				})
			) {
				return true;
			}
			if (
				filterCard("tao") &&
				(() => {
					if (player.countCards("h", filter)) {
						return true;
					}
					return get.cardPile2(filter);
				})()
			) {
				return true;
			}
			if (
				filterCard("jiu") &&
				(() => {
					if ("addedLiulong" in _status) {
						return false;
					}
					return player.canEquip("cz_liulongcanjia", true);
				})()
			) {
				return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				const filterCard = name => {
						const card = new lib.element.VCard({ name: name, isCard: true });
						return event.filterCard(card, player, event);
					},
					filter = card => card.name == "cz_liulongcanjia";
				if (filterCard("sha") && player.canMoveCard(false, true, player, player.getNext(), filter, false)) {
					list.add(["basic", "", "sha"]);
				}
				if (
					filterCard("shan") &&
					game.hasPlayer(current => {
						return current != player && current.getGainableCards(player, "ej", filter).length > 0;
					})
				) {
					list.add(["basic", "", "shan"]);
				}
				if (
					filterCard("tao") &&
					(() => {
						if (player.countCards("h", filter)) {
							return true;
						}
						return get.cardPile2(filter);
					})()
				) {
					list.add(["basic", "", "tao"]);
				}
				if (
					filterCard("jiu") &&
					(() => {
						if ("addedLiulong" in _status) {
							return false;
						}
						return player.canEquip("cz_liulongcanjia", true);
					})()
				) {
					list.add(["basic", "", "jiu"]);
				}
				const dialog = ui.create.dialog("辔东", [list, "vcard"], "hidden");
				dialog.direct = true;
				return dialog;
			},
			check(button) {
				const card = new lib.element.VCard({ name: button.link[2], isCard: true });
				return get.player().getUseValue(card);
			},
			prompt(links, player) {
				const name = links[0][2];
				switch (name) {
					case "sha": {
						return `将【六龙骖驾】从装备区移至下家，视为使用【杀】`;
					}
					case "shan": {
						return `从其他角色场上获得【六龙骖驾】，视为使用【闪】`;
					}
					case "tao": {
						return `将【六龙骖驾】从手牌或牌堆亮出，视为使用【桃】`;
					}
					default: {
						return `将【六龙骖驾】从游戏外置入宝物，视为使用【酒】`;
					}
				}
			},
			backup(links, player) {
				const name = links[0][2];
				return get.copy(get.info(`mbpeidong_${name}`));
			},
		},
		hiddenCard(player, name) {
			const filterCard = card => card == name,
				filter = card => card.name == "cz_liulongcanjia";
			if (filterCard("sha") && player.canMoveCard(false, true, player, player.getNext(), filter, false)) {
				return true;
			}
			if (
				filterCard("shan") &&
				game.hasPlayer(current => {
					return current != player && current.getGainableCards(player, "ej", filter).length > 0;
				})
			) {
				return true;
			}
			if (
				filterCard("tao") &&
				(() => {
					if (player.countCards("h", filter)) {
						return true;
					}
					return get.cardPile2(filter);
				})()
			) {
				return true;
			}
			if (
				filterCard("jiu") &&
				(() => {
					if ("addedLiulong" in _status) {
						return false;
					}
					return player.canEquip("cz_liulongcanjia", true);
				})()
			) {
				return true;
			}
		},
		ai: {
			order: 6,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
			save: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				const filter = card => card.name == "cz_liulongcanjia";
				switch (tag) {
					case "respondSha": {
						return player.canMoveCard(false, true, player, player.getNext(), filter, false);
					}
					case "respondShan": {
						return game.hasPlayer(current => {
							return current != player && current.getGainableCards(player, "ej", filter).length > 0;
						});
					}
					default: {
						if (player.countCards("h", filter) || get.cardPile2(filter)) {
							return true;
						}
						if ("addedLiulong" in _status) {
							return false;
						}
						return player.canEquip("cz_liulongcanjia", true);
					}
				}
			},
		},
		subSkill: {
			backup: {},
			use: {
				async precontent(event, trigger, player) {
					event.result._apply_args = { addSkillCount: false };
					player.popup(event.result.card.name, "metal");
					await game.delayx();
				},
				filterCard: () => false,
				prompt: "请选择【杀】的目标",
				selectCard: -1,
				log: false,
			},
			sha: {
				viewAs: {
					name: "sha",
					isCard: true,
				},
				popname: true,
				filterCard: () => false,
				selectCard: -1,
				log: false,
				async precontent(event, trigger, player) {
					player.logSkill("mbpeidong", null, null, null, [1]);
					const target = player.getNext();
					if (!target?.isIn()) {
						return;
					}
					const cards = player.getCards("e", card => card.name == "cz_liulongcanjia" && target.canEquip(card));
					if (cards.length) {
						const result =
							cards.length > 1
								? await player
										.chooseButton(["将一张【六龙骖驾】移动至下家", cards], true)
										.set("ai", button => {
											return Math.random();
										})
										.forResult()
								: {
										bool: true,
										links: cards,
									};
						if (result?.bool && result.links?.length) {
							const next = game.createEvent("moveCard");
							next.player = player;
							next.targets = [player, target];
							next.card = result.links[0];
							next.setContent(async (event, trigger, playerx) => {
								const {
									card,
									targets: [player, target],
								} = event;
								game.log(player, "的", card, "被移动给了", target);
								if (player.getCards("e").includes(card)) {
									if (!card.cards?.length) {
										target.removeVirtualEquip(card);
									} else {
										player.$give(card.cards, target, false);
									}
									await target.equip(card);
								}
								event.result = {
									bool: true,
									card: card,
									position: "e",
									targets: [player, target],
								};
								await game.delay();
							});
							await next;
						}
					}
				},
			},
			shan: {
				filterTarget(_1, player, target) {
					if (target == player) {
						return false;
					}
					if (!target.countCards("ej", card => card.name == "cz_liulongcanjia")) {
						return false;
					}
					let event = _status.event,
						evt = event;
					if (event._backup) {
						evt = event._backup;
					}
					const card = new lib.element.VCard({ name: "shan", isCard: true });
					return evt.filterCard(card, player, event);
				},
				log: false,
				async content(event, trigger, player) {
					player.logSkill("mbpeidong", null, null, null, [2]);
					const { target } = event;
					const cards = target.getGainableCards(player, "ej", card => card.name == "cz_liulongcanjia");
					if (cards.length) {
						if (cards.length > 1) {
							await player.gainPlayerCard("ej", true, target).set("filterButton", button => button.link.name == "cz_liulongcanjia");
						} else {
							await player.gain(cards, target, "giveAuto", "bySelf");
						}
					}
					const evt = event.getParent(2),
						card = { name: "shan", isCard: true };
					if (!evt) {
						return;
					}
					game.broadcastAll(card => {
						lib.skill.mbpeidong_use.viewAs = card;
						lib.skill.mbpeidong_use.prompt = `选择${get.translation(card)}的目标`;
					}, card);
					evt.set("_backupevent", "mbpeidong_use");
					evt.backup("mbpeidong_use");
					evt.set("openskilldialog", `选择${get.translation(card)}的目标`);
					evt.set("norestore", true);
					evt.set("custom", {
						add: {},
						replace: { window() {} },
					});
					evt.goto(0);
				},
				ai: {
					result: {
						player: 2,
						target: -1,
					},
				},
			},
			tao: {
				filterCard(card, player, target) {
					return card.name == "cz_liulongcanjia";
				},
				selectCard() {
					const player = get.player(),
						cards = player.getCards("h", card => card.name == "cz_liulongcanjia");
					let event = _status.event,
						evt = event;
					if (event._backup) {
						evt = event._backup;
					}
					const tao = new lib.element.VCard({ name: "tao", isCard: true });
					if (evt.filterCard(tao, player, event) && !cards.length) {
						return -1;
					}
					return 1;
				},
				log: false,
				lose: false,
				discard: false,
				check(card) {
					return 1;
				},
				async content(event, trigger, player) {
					player.logSkill("mbpeidong", null, null, null, [3]);
					const filter = card => card.name == "cz_liulongcanjia";
					if (event.cards?.length) {
						await player.lose(event.cards, ui.ordering);
						player.$throw(event.cards, 1000);
						await player.showCards(event.cards, get.translation(player) + "发动了【辔东】", true);
					} else {
						const card = get.cardPile2(filter);
						if (card) {
							await game.cardsGotoOrdering(card);
							await player.showCards([card], get.translation(player) + "发动了【辔东】", true);
						}
					}
					const evt = event.getParent(2),
						card = { name: "tao", isCard: true };
					if (!evt) {
						return;
					}
					game.broadcastAll(card => {
						lib.skill.mbpeidong_use.viewAs = card;
						lib.skill.mbpeidong_use.prompt = `选择${get.translation(card)}的目标`;
					}, card);
					evt.set("_backupevent", "mbpeidong_use");
					evt.backup("mbpeidong_use");
					evt.set("openskilldialog", `选择${get.translation(card)}的目标`);
					evt.set("norestore", true);
					evt.set("custom", {
						add: {},
						replace: { window() {} },
					});
					evt.goto(0);
				},
			},
			jiu: {
				viewAs: {
					name: "jiu",
					isCard: true,
				},
				popname: true,
				filterCard: () => false,
				selectCard: -1,
				log: false,
				manualConfirm: true,
				async precontent(event, trigger, player) {
					player.logSkill("mbpeidong", null, null, null, [4]);
					game.broadcastAll(() => {
						_status.addedLiulong = true;
					});
					const card = game.createCard2("cz_liulongcanjia", "heart", 13);
					if (player.canEquip(card, true)) {
						player.$gain2(card, false);
						await player.equip(card);
					}
				},
			},
		},
	},
	cz_liulongcanjia_skill: {
		equipSkill: true,
		mod: {
			globalFrom(from, to, distance) {
				const num = game.countPlayer(current => current.countCards("ej", card => get.number(card) == 13));
				return distance - num;
			},
			globalTo(from, to, distance) {
				const num = game.countPlayer(current => current.countCards("ej", card => get.number(card) == 13));
				return distance + num;
			},
		},
	},
	//书张芝
	mbshiju: {
		audio: 3,
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			const history = game.getAllGlobalHistory("useCard"),
				index = history.indexOf(event);
			if (index <= 0) {
				return false;
			}
			const evt = history[index - 1];
			return get.type2(evt.card) == get.type2(event.card) || get.suit(evt.card) == get.suit(event.card);
		},
		forced: true,
		logAudio(event) {
			const history = game.getAllGlobalHistory("useCard"),
				index = history.indexOf(event);
			const evt = history[index - 1];
			const bool1 = get.type2(evt.card) == get.type2(event.card),
				bool2 = get.suit(evt.card) == get.suit(event.card),
				bool3 = get.name(evt.card) == get.name(event.card);
			return bool1 && bool2 && bool3 ? "mbshiju3.mp3" : 2;
		},
		async content(event, trigger, player) {
			const history = game.getAllGlobalHistory("useCard"),
				index = history.indexOf(trigger);
			if (index <= 0) {
				return;
			}
			const evt = history[index - 1];
			const bool1 = get.type2(evt.card) == get.type2(trigger.card),
				bool2 = get.suit(evt.card) == get.suit(trigger.card),
				bool3 = get.name(evt.card) == get.name(trigger.card);
			if (bool1) {
				await player.gain(get.cards(1, true), "gain2", false);
			}
			if (bool2) {
				await player.gain(get.bottomCards(1, true), "gain2", false);
			}
			if (bool1 && bool2) {
				player.popup("乘势", "fire");
				if (bool3) {
					if (!player.hasSkill("mbkubai", null, null, false)) {
						await player.addSkills("mbkubai");
					} else if (player.countMark("mbkubai") < 2) {
						game.log(player, "升级了", "#g【枯白】");
						player.addMark("mbkubai", 1, false);
						get.info("mbkubai").init(player, "mbkubai");
					}
				}
			}
		},
		init(player, skill) {
			player.addSkill(`${skill}_record`);
		},
		onremove(player, skill) {
			player.removeSkill(`${skill}_record`);
		},
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object") {
					const evts = game.getAllGlobalHistory("useCard");
					if (evts.length) {
						let evt = evts[evts.length - 1];
						const bool1 = get.type2(evt.card) == get.type2(card),
							bool2 = get.suit(evt.card) == get.suit(card),
							bool3 = get.name(evt.card) == get.name(card);
						if (bool1) {
							num += 10;
						}
						if (bool2) {
							num += 10;
						}
						if (bool1 && bool2 && bool3) {
							num += 30;
						}
					}
					return num;
				}
			},
		},
		derivation: ["mbkubai"],
		subSkill: {
			record: {
				charlotte: true,
				trigger: {
					global: "useCard1",
				},
				async cost(event, trigger, player) {
					get.info(event.skill).init(player, event.skill);
				},
				intro: {
					markcount() {
						const history = game.getAllGlobalHistory("useCard");
						if (history.length) {
							const evt = history.at(-1);
							if (evt) {
								return get.translation(get.suit(evt.card));
							}
						}
						return 0;
					},
					content() {
						const history = game.getAllGlobalHistory("useCard");
						if (history.length) {
							const evt = history.at(-1);
							if (evt) {
								return `
									上一张被使用的牌：${get.translation(evt.card.name)}<br>
									花色：${get.translation(get.suit(evt.card))}<br>
									类型：${get.translation(get.type2(evt.card))}
								`;
							}
						}
						return "无效果";
					},
				},
				init(player, skill) {
					const history = game.getAllGlobalHistory("useCard");
					if (history.length) {
						const evt = history.at(-1);
						if (!evt) {
							return;
						}
						player.addTip(skill, `势举 ${get.translation(evt.card.name)}${get.translation(get.suit(evt.card))}`);
						player.markSkill(skill);
						game.broadcastAll(
							(evt, player) => {
								const mark = player.marks.mbshiju_record;
								if (mark) {
									mark.firstChild.innerHTML = get.translation(get.type2(evt.card));
								}
							},
							evt,
							player
						);
					}
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
			},
		},
	},
	mbkubai: {
		audio: 6,
		trigger: { player: "useCard" },
		filter(event, player) {
			if (player !== _status.currentPhase) {
				return false;
			}
			const key = ["color", "suit", "number"][Math.min(2, player.countMark("mbkubai"))],
				evts = player.getHistory("useCard");
			for (let i = 0; i < evts.length; i++) {
				const evt = evts[i];
				if (evt == event) {
					break;
				}
				if (get[key](evt.card) == get[key](event.card)) {
					return false;
				}
			}
			return true;
		},
		forced: true,
		locked: false,
		logAudio(event, player, name) {
			const num = Math.min(2, player.countMark("mbkubai"));
			const index = num * 2 + 1;
			return [`mbkubai${index}.mp3`, `mbkubai${index + 1}.mp3`];
		},
		async content(event, trigger, player) {
			await player.draw();
		},
		init(player, skill) {
			const level = Math.min(2, player.countMark(skill)),
				key = ["color", "suit", "number"][level];
			let list = player
				.getHistory("useCard")
				.map(evt => get[key](evt.card))
				.toUniqued();
			if (list.length) {
				if (key == "number") {
					list = list.filter(i => typeof i == "number").sort((a, b) => a - b);
				}
				for (const target of game.filterPlayer(current => current != player).sortBySeat()) {
					const name = "mbkubai_guanjued";
					target.addTempSkill(name);
					target.setStorage(name, list, true);
				}
			}
		},
		derivation: ["mbkubai_suit", "mbkubai_number"],
		group: "mbkubai_guanjue",
		subSkill: {
			guanjue: {
				trigger: {
					player: "useCardAfter",
				},
				lastDo: true,
				popup: false,
				forced: true,
				locked: false,
				filter(event, player) {
					return player == _status.currentPhase;
				},
				async content(event, trigger, player) {
					const name = "mbkubai";
					get.info(name).init(player, name);
				},
			},
			guanjued: {
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "白",
				intro: {
					content(_1, player) {
						const list = player.getStorage("mbkubai_guanjued"),
							target = _status.currentPhase;
						if (target.hasSkill("mbkubai")) {
							const level = Math.min(2, target.countMark("mbkubai")),
								key = ["颜色", "花色", "点数"][level];
							return `仅能使用${key}为${get.translation(list)}的牌`;
						}
						return "无效果";
					},
				},
				mod: {
					cardEnabled(card, player) {
						const list = player.getStorage("mbkubai_guanjued"),
							target = _status.currentPhase;
						if (target.hasSkill("mbkubai") && target != player) {
							const level = Math.min(2, target.countMark("mbkubai")),
								key = get[["color", "suit", "number"][level]](card);
							if (key != "unsure" && !list.includes(key)) {
								return false;
							}
						}
					},
					cardSavable(card, player) {
						const list = player.getStorage("mbkubai_guanjued"),
							target = _status.currentPhase;
						if (target.hasSkill("mbkubai") && target != player) {
							const level = Math.min(2, target.countMark("mbkubai")),
								key = get[["color", "suit", "number"][level]](card);
							if (key != "unsure" && !list.includes(key)) {
								return false;
							}
						}
					},
				},
			},
			suit: { nopop: true },
			number: { nopop: true },
		},
	},
	//手杀崔令仪
	mbcaiqiu: {
		audio: 4,
		logAudio(event, player) {
			if (event.name == "useCard") {
				return ["mbcaiqiu3.mp3", "mbcaiqiu4.mp3"];
			}
			return 2;
		},
		trigger: {
			global: ["roundStart", "useCardAfter"],
		},
		filter(event, player) {
			if (event.name == "useCard") {
				return (
					event.player != player &&
					player.getRoundHistory("gain", evt => {
						if (evt.getParent().name != "mbcaiqiu") {
							return false;
						}
						return evt.cards?.length && evt.cards.some(card => card.name == event.card.name);
					}).length > 0
				);
			}
			return game.countPlayer2(() => true, true) > 0;
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			if (trigger?.name == "useCard") {
				await player.loseHp();
				return;
			}
			const cards = get.cards(
				game.countPlayer2(() => true, true),
				true
			);
			const result = await player
				.chooseButton(["裁裘：是否获得其中任意张牌？", cards], [1, Infinity], "allowChooseAll")
				.set("ai", button => {
					const player = get.player();
					//只要贪不死就往死里贪
					if (game.countPlayer(() => true) > player.hp && ["sha", "shan"].includes(button.link.name)) {
						return 0;
					}
					return 1;
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				await player.gain(result.links, "draw");
			}
		},
	},
	mbxishang: {
		audio: 8,
		logAudio(event, player) {
			if (!get.nameList(player).includes("mb_cuilingyi")) {
				return 6;
			}
			const skin = player.skin[player.name2 === "mb_cuilingyi" ? "name2" : "name"];
			if (skin?.indexOf("guidian") !== -1) {
				return 2;
			}
			if (skin?.indexOf("dongjiao") !== -1) {
				return ["mbxishang3.mp3", "mbxishang4.mp3"];
			}
			if (skin?.indexOf("xiuge") !== -1) {
				return ["mbxishang5.mp3", "mbxishang6.mp3"];
			}
			return 6;
		},
		derivation: ["mbweizhuang", "mbweizhuang_guidianx", "mbweizhuang_dongjiaox", "mbweizhuang_xiugex"],
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		filter(event, player) {
			if (!get.nameList(player).includes("mb_cuilingyi")) {
				return false;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		locked: true,
		async cost(event, trigger, player) {
			const list = lib.characterSubstitute["mb_cuilingyi"];
			if (!list.length) {
				return;
			}
			const createButton = (item, type, position, noclick, node) => {
				const [name, info] = item,
					skill = `mbweizhuang_${name.slice(13, -1)}x`;
				let isTemp = false;
				if (!lib.character[name]) {
					isTemp = true;
					lib.character[name] = get.convertedCharacter(["female", "", 0, [], info || []]);
				}
				lib.translate[name] ??= lib.translate[skill];
				node = ui.create.buttonPresets.character(name, type, position, noclick);
				if (isTemp) {
					delete lib.character[name];
				}
				node._link = node.link = [null, null, name];
				node.skinSkill = skill;
				node._customintro = [node => `形象：${lib.translate[node.skinSkill]}`, node => get.skillInfoTranslation(node.skinSkill, null, false)];
				return node;
			};
			const result = await player
				.chooseButton(
					["袭裳：选择你本局的形象", [list.slice(0, 3), createButton], [list.slice(3, 6), createButton], [list.slice(6), createButton]],
					true
				)
				.forResult();
			if (result?.bool && result.links?.length) {
				player.changeSkin(event.skill, result.links[0][2]);
				event.result = {
					bool: true,
				};
			}
		},
		async content(event, trigger, player) {
			player.addSkills("mbweizhuang");
		},
		mark: true,
		marktext: "裳",
		intro: {
			markcount(storage, player) {
				return player.countCards("h", card => card.hasGaintag("faceup_tag"));
			},
			mark(dialog, content, player) {
				const cards = player.getCards("h", card => card.hasGaintag("faceup_tag"));
				if (cards.length) {
					dialog.addAuto(cards);
				} else {
					return "无明置牌";
				}
			},
		},
		group: "mbxishang_show",
		subSkill: {
			show: {
				audio: "mbxishang",
				logAudio() {
					return ["mbxishang7.mp3", "mbxishang8.mp3"];
				},
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					if (event.getParent().name == "draw") {
						return false;
					}
					const cards = event.getg(player);
					return cards?.length && player.getCards("h").containsSome(...cards);
				},
				forced: true,
				async content(event, trigger, player) {
					const gains = trigger.getg(player);
					const cards = player.getCards("h", card => gains.includes(card));
					if (!cards.length) {
						return;
					}
					const next = game.createEvent("faceUpCard");
					next.player = player;
					next.cards = cards;
					next.skill = "mbxishang";
					next.setContent(async (event, trigger, player) => {
						const { cards } = event;
						game.log(player, "明置了", cards);
						game.addCardKnower(
							cards,
							game.filterPlayer(() => true)
						);
						game.broadcastAll(cards => {
							cards.forEach(card => card.addGaintag("faceup_tag"));
						}, cards);
					});
					player.markSkill("mbxishang");
				},
			},
		},
	},
	mbweizhuang: {
		// @ts-ignore audio的类型注释不够全
		audio: ["guidian", "dongjiao", "xiuge"].map(key => `mbweizhuang_${key}`),
		getFaceupCards(player, judge = false) {
			const cards = player.getCards("h", card => card.hasGaintag("faceup_tag"));
			if (player.countCards("e")) {
				cards.addArray(player.getCards("e"));
			}
			if (judge && player.countCards("j")) {
				cards.addArray(player.getCards("j"));
			}
			return cards;
		},
		derivation: ["mbweizhuang_guidianx", "mbweizhuang_dongjiaox", "mbweizhuang_xiugex"],
		group: ["mbweizhuang_guidian", "mbweizhuang_dongjiao", "mbweizhuang_xiuge"],
		subSkill: {
			guidianx: {
				audio: "mbweizhuang_guidian",
			},
			dongjiaox: {
				audio: "mbweizhuang_dongjiao",
			},
			xiugex: {
				audio: "mbweizhuang_xiuge",
			},
			guidian: {
				audio: 4,
				logAudio(event, player) {
					if (event.name == "faceUpCard") {
						return ["mbweizhuang_guidian1.mp3", "mbweizhuang_guidian4.mp3"];
					}
					return ["mbweizhuang_guidian2.mp3", "mbweizhuang_guidian3.mp3"];
				},
				trigger: {
					global: ["faceUpCardAfter", "phaseJieshuBegin"],
					player: "phaseDrawBegin2",
				},
				filter(event, player) {
					if (!get.nameList(player).includes("mb_cuilingyi")) {
						return false;
					}
					const skin = player.skin[player.name2 === "mb_cuilingyi" ? "name2" : "name"];
					if (!skin || skin.indexOf("guidian") === -1) {
						return false;
					}
					if (event.name == "phaseDraw") {
						return !event.numFixed && player.getStorage("mbweizhuang_guidian", [0, 0, 0])[0] !== 0;
					}
					if (event.name == "phaseJieshu") {
						if (!get.info("mbweizhuang").getFaceupCards(event.player).length) {
							return false;
						}
						return true;
					}
					if (player.countMark("mbweizhuang_used") > game.countPlayer2(() => true, true)) {
						return false;
					}
					let num = 0,
						evts = game.getAllGlobalHistory("everything", evt => evt.name == "faceUpCard");
					for (let i = evts.indexOf(event); i >= 0; i--) {
						const evt = evts[i];
						if (evt?.mbweizhuang_count) {
							break;
						}
						if (evt.cards?.length) {
							num += evt.cards.length;
						}
					}
					return num > game.countPlayer2(() => true, true);
				},
				intro: {
					nocount: true,
					content(storage, player, skill) {
						const list = player.getStorage("mbweizhuang_guidian", [0, 0, 0]);
						const getStr = num => {
							if (num >= 0) {
								return `+${num}`;
							}
							return num;
						};
						return `摸牌阶段摸牌数${getStr(list[0])}<br>出杀次数${getStr(list[1])}<br>手牌上限${getStr(list[2])}`;
					},
				},
				onremove: true,
				locked: false,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							const list = player.getStorage("mbweizhuang_guidian", [0, 0, 0]);
							return num + list[1];
						}
					},
					maxHandcard(player, num) {
						const list = player.getStorage("mbweizhuang_guidian", [0, 0, 0]);
						return num + list[2];
					},
				},
				async cost(event, trigger, player) {
					let record = player.getStorage(event.skill, [0, 0, 0]);
					if (trigger.name == "phaseDraw") {
						trigger.num = Math.max(0, trigger.num + record[0]);
						return;
					}
					const list = [2 + record[0], player.getCardUsable("sha", true), player.getHandcardLimit(), player.getHp()];
					const prompt = trigger.name == "phaseJieshu" ? `是否令一项数值-1并发动一次${get.poptip("mbcaiqiu")}？` : `令一项数值+1`;
					const choiceList = [
						["draw", `摸牌阶段摸牌数(${list[0]})`],
						["sha", `出杀次数(${list[1]})`],
						["limit", `手牌上限(${list[2]})`],
						["hp", `体力值(${list[3]})`],
					];
					const next = player
						.chooseButton([
							`褽装：${prompt}`,
							[choiceList.slice(0, 2), "tdnodes"],
							[choiceList.slice(2), "tdnodes"],
							[
								dialog => {
									dialog.buttons.forEach(i => {
										i.style.setProperty("width", "200px", "important");
										i.style.setProperty("text-align", "left", "important");
									});
								},
								"handle",
							],
						])
						.set("numList", list);
					if (trigger.name == "phaseJieshu") {
						next.set("filterButton", button => {
							const { player, numList } = get.event(),
								index = ["draw", "sha", "limit", "hp"].indexOf(button.link);
							return numList[index] > 0;
						});
						next.set("ai", button => {
							const { player, numList } = get.event();
							if (numList[1] > 1 && button.link == "sha") {
								return 3;
							}
							if (numList[2] > 2 && button.link == "limit") {
								return 2;
							}
							if (button.link == "draw") {
								return 1;
							}
							return 0;
						});
					} else {
						next.set("filterButton", button => {
							const { player, numList } = get.event();
							return button.link != "hp" || player.isDamaged();
						});
						next.set("ai", button => {
							const { player, numList } = get.event();
							if (button.link == "hp") {
								return 3;
							}
							if (numList[1] < 3 && button.link == "sha") {
								return 2;
							}
							return Math.random();
						});
						next.set("forced", true);
					}
					const result = await next.forResult();
					if (result?.bool && result.links?.length) {
						event.result = {
							bool: true,
							cost_data: result.links[0],
						};
					}
				},
				async content(event, trigger, player) {
					const choice = event.cost_data,
						index = ["draw", "sha", "limit", "hp"].indexOf(choice),
						list = player.getStorage(event.name, [0, 0, 0]);
					if (trigger.name != "phaseJieshu") {
						trigger.set("mbweizhuang_count", true);
						player.addSkill("mbweizhuang_used");
						player.addMark("mbweizhuang_used", 1, false);
					}
					if (index > 2) {
						if (trigger.name == "phaseJieshu") {
							await player.loseHp();
						} else {
							await player.recover();
						}
					} else {
						if (trigger.name == "phaseJieshu") {
							list[index]--;
						} else {
							list[index]++;
						}
						player.setStorage(event.name, list, true);
					}
					if (trigger.name == "phaseJieshu") {
						await player.useResult({ skill: "mbcaiqiu" }, event);
					}
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
			dongjiao: {
				audio: 6,
				trigger: {
					player: ["useCard", "useCardToPlayered", "useCardAfter"],
				},
				logAudio(event, player, name) {
					if (name == "useCardAfter") {
						return ["mbweizhuang_dongjiao3.mp3", "mbweizhuang_dongjiao6.mp3"];
					}
					if (name == "useCardToPlayered") {
						return ["mbweizhuang_dongjiao4.mp3", "mbweizhuang_dongjiao5.mp3"];
					}
					return 2;
				},
				filter(event, player, name) {
					if (!get.nameList(player).includes("mb_cuilingyi")) {
						return false;
					}
					const skin = player.skin[player.name2 === "mb_cuilingyi" ? "name2" : "name"];
					if (!skin || skin.indexOf("dongjiao") === -1) {
						return false;
					}
					const num = get
						.info("mbweizhuang")
						.getFaceupCards(player)
						?.map(card => get.type2(card))
						?.toUniqued()?.length;
					const type = get.type2(event.card),
						list = player.getStorage("mbweizhuang_block");
					if (list.includes(type)) {
						return false;
					}
					if (name == "useCard") {
						return num >= 1 && type == "basic";
					}
					if (name == "useCardAfter") {
						return (
							num >= 3 &&
							type == "equip" &&
							game.hasPlayer(current => {
								return get.info("mbweizhuang").getFaceupCards(current).length;
							})
						);
					}
					return (
						event.isFirstTarget &&
						num >= 2 &&
						type == "trick" &&
						event.targets?.length &&
						event.targets.some(target => {
							const pos = target == player ? "e" : "he";
							return target.countGainableCards(player, pos);
						})
					);
				},
				async cost(event, trigger, player) {
					switch (event.triggername) {
						case "useCard": {
							event.result = {
								bool: true,
							};
							return;
						}
						case "useCardAfter": {
							const targets = game.filterPlayer(current => {
								return get.info("mbweizhuang").getFaceupCards(current).length;
							});
							if (!targets?.length) {
								return;
							}
							event.result = await player
								.chooseTarget(`###是否发动【褽装】？###令一名有明置牌的角色摸两张牌`, (card, player, target) => {
									return get.event().targetx.includes(target);
								})
								.set("targetx", targets)
								.set("ai", target => {
									const player = get.player();
									return get.effect(target, { name: "draw" }, player, player);
								})
								.forResult();
							return;
						}
						default: {
							const targets = trigger.targets.filter(target => {
								const pos = target == player ? "e" : "he";
								return target.countGainableCards(player, pos);
							});
							if (!targets?.length) {
								return;
							}
							event.result = await player
								.chooseTarget(`###是否发动【褽装】？###获得一名目标角色一张牌`, (card, player, target) => {
									return get.event().targetx.includes(target);
								})
								.set("targetx", targets)
								.set("ai", target => {
									const player = get.player();
									return get.effect(target, { name: "shunshou_copy2" }, player, player);
								})
								.forResult();
							return;
						}
					}
				},
				async content(event, trigger, player) {
					const { targets, triggername: name } = event;
					player.addTempSkill("mbweizhuang_block");
					player.markAuto("mbweizhuang_block", get.type2(trigger.card));
					switch (name) {
						case "useCard": {
							trigger.baseDamage ??= 1;
							trigger.baseDamage++;
							break;
						}
						case "useCardAfter": {
							await game.doAsyncInOrder(targets, async target => await target.draw(2));
							break;
						}
						default: {
							await game.doAsyncInOrder(targets, async target => {
								const pos = target == player ? "e" : "he";
								if (target.countGainableCards(player, pos)) {
									await player.gainPlayerCard(target, pos, true);
								}
							});
						}
					}
				},
			},
			block: {
				charlotte: true,
				onremove: true,
			},
			xiuge: {
				audio: 6,
				logAudio(event) {
					if (typeof event == "number") {
						return `mbweizhuang_xiuge${event}.mp3`;
					}
					return 6;
				},
				enable: "chooseToUse",
				hiddenCard(player, name) {
					if (!get.nameList(player).includes("mb_cuilingyi")) {
						return false;
					}
					const skin = player.skin[player.name2 === "mb_cuilingyi" ? "name2" : "name"];
					if (!skin || skin.indexOf("xiuge") === -1) {
						return false;
					}
					const list = ["sha", "shan", "tao", "jiu"];
					if (!list.includes(name) || player.getStorage("mbweizhuang_blocker").includes(name)) {
						return false;
					}
					const subtype = `equip${list.indexOf(name) + 1}`,
						count = get
							.info("mbweizhuang")
							.getFaceupCards(player)
							?.map(card => get.suit(card))
							?.toUniqued()?.length;
					return (
						player.countCards("he", card => {
							if (get.subtype(card) != subtype) {
								return false;
							}
							return count >= 4 || lib.filter.cardDiscardable(card, player, "mbweizhuang");
						}) > 0
					);
				},
				filter(event, player) {
					if (!get.nameList(player).includes("mb_cuilingyi")) {
						return false;
					}
					const skin = player.skin[player.name2 === "mb_cuilingyi" ? "name2" : "name"];
					if (!skin || skin.indexOf("xiuge") === -1) {
						return false;
					}
					const list = ["sha", "shan", "tao", "jiu"],
						count = get
							.info("mbweizhuang")
							.getFaceupCards(player)
							?.map(card => get.suit(card))
							?.toUniqued()?.length;
					return list.some(name => {
						if (player.getStorage("mbweizhuang_blocker").includes(name)) {
							return false;
						}
						const vcard = new lib.element.VCard({ name: name, isCard: true, storage: { wzxiuge: true } });
						if (!event.filterCard(vcard, player, event)) {
							return false;
						}
						const subtype = `equip${list.indexOf(name) + 1}`;
						return (
							player.countCards("he", card => {
								if (get.subtype(card) != subtype) {
									return false;
								}
								return count >= 4 || lib.filter.cardDiscardable(card, player, "mbweizhuang");
							}) > 0
						);
					});
				},
				viewAs(cards, player) {
					if (cards.length) {
						let name;
						const subtype = get.subtype(cards[0], player);
						if (typeof subtype == "string") {
							name = ["sha", "shan", "tao", "jiu"][subtype.slice(5) - 1];
						}
						if (name) {
							return {
								name: name,
								isCard: true,
								suit: "none",
								number: null,
								storage: {
									wzxiuge: true,
								},
							};
						}
					}
					return null;
				},
				filterCard(card, player, event) {
					event ??= _status.event;
					const filter = event._backup.filterCard;
					const list = ["sha", "shan", "tao", "jiu"],
						count = get
							.info("mbweizhuang")
							.getFaceupCards(player)
							?.map(card => get.suit(card))
							?.toUniqued()?.length;
					if (count < 4 && !lib.filter.cardDiscardable(card, player, "mbweizhuang")) {
						return false;
					}
					for (const name of list) {
						if (player.getStorage("mbweizhuang_blocker").includes(name)) {
							continue;
						}
						const vcard = new lib.element.VCard({ name: name, isCard: true, storage: { wzxiuge: true } });
						if (!filter(vcard, player, event)) {
							continue;
						}
						const subtype = `equip${list.indexOf(name) + 1}`;
						if (subtype == get.subtype(card, player)) {
							return true;
						}
					}
					return false;
				},
				popname: true,
				ignoreMod: true,
				position: "he",
				log: false,
				check(card) {
					const player = get.player();
					if (_status.event.type == "phase") {
						const name = ["sha", "shan", "tao", "jiu"][get.subtype(card, player)?.slice(5) - 1];
						if (name) {
							const vcard = new lib.element.VCard({ name: name, isCard: true, storage: { wzxiuge: true } });
							if (player.getUseValue(vcard) > 0) {
								return 14 - get.value(card);
							}
						}
						return 0;
					}
					return 1;
				},
				prompt(event, player) {
					return get.skillInfoTranslation("mbweizhuang_xiugex", player);
				},
				async precontent(event, trigger, player) {
					const name = event.result.card?.name,
						cards = event.result.cards;
					player.addTempSkill("mbweizhuang_blocker");
					player.markAuto("mbweizhuang_blocker", name);
					//delete event.result.skill;
					event.getParent().addCount = false;
					const count = get
						.info("mbweizhuang")
						.getFaceupCards(player)
						?.map(card => get.suit(card))
						?.toUniqued()?.length;
					if (count >= 4) {
						player.logSkill("mbweizhuang_xiuge", null, null, null, [get.rand(1, 2)]);
						await player.showCards(cards, `${get.translation(player)}发动了【褽装】`);
					} else {
						const index = ["sha", "jiu", "tao", "shan"].indexOf(name) + 3;
						player.logSkill("mbweizhuang_xiuge", null, null, null, [index]);
						await player.modedDiscard(cards);
					}
					event.result.card = new lib.element.VCard({ name: name, isCard: true, storage: { wzxiuge: true } });
					event.result.cards = [];
					player
						.when("useCardAfter")
						.filter(evt => evt.getParent() == event.getParent())
						.step(async (event, trigger, player) => {
							const card = get.cardPile(card => get.suit(card) == get.suit(cards[0]));
							if (card) {
								await player.gain(card, "gain2");
							}
						});
				},
				locked: false,
				mod: {
					cardUsable(card, player) {
						if (card?.storage?.wzxiuge) {
							return Infinity;
						}
					},
				},
				ai: {
					order: 3,
					result: {
						player(player) {
							if (_status.event.dying) {
								return get.attitude(player, _status.event.dying);
							}
							return 1;
						},
					},
				},
			},
			blocker: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//君子六艺
	//礼·卢毓
	mbbingfa: {
		audio: 4,
		logAudio(event) {
			if (typeof event == "number") {
				return `mbbingfa${event}.mp3`;
			}
			return 2;
		},
		trigger: {
			global: "roundStart",
		},
		filter(event, player) {
			return game.hasPlayer(current => !current.isTurnedOver());
		},
		async cost(event, trigger, player) {
			const falvs = lib.poptip.getInfo("bingfa_lvfa").slice(4).split("<br><li>");
			const result = await player
				.chooseButton([`###${get.prompt(event.skill)}###选择两条律法发布`, [falvs.map((value, index) => [index, value]), "textbutton"]], 2)
				.set("ai", button => {
					return Math.random();
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				event.result = {
					bool: true,
					cost_data: result.links.map(index => [index, falvs[index]]),
				};
			}
		},
		async content(event, trigger, player) {
			const { name, cost_data: lvfas } = event,
				targets = game.filterPlayer(current => !current.isTurnedOver()).sortBySeat();
			const map = await game.chooseAnyOL(targets, get.info(name).chooseLvfa, [targets, player, lvfas]).forResult();
			const tickets = [0, 0, 0, 0];
			for (const target of targets) {
				if (target != player && target.hasSkill("mbbingfa_control")) {
					target.removeSkill("mbbingfa_control");
				}
				const result = map.get(target);
				if (result?.bool && result.links?.length) {
					lvfas.forEach(lvfa => {
						const count = result.links.filter(count => count === lvfa[0]).length;
						if (count > 0) {
							game.log(target, "为", `#r${lvfa[1]}`, "投出了", `#y${count}`, "票");
							tickets[lvfa[0]] += count;
						}
					});
				}
			}
			const maxTicket = tickets.maxBy();
			const enact = async lvfa => {
				const [index, prompt] = lvfa;
				if (tickets[index] !== maxTicket) {
					return;
				}
				game.log(`#r${prompt}`, "得票最多");
				player.addTip(`${name}_${index}`, `秉法 ${prompt.slice(0, 4)}`);
				player
					.when({
						global: "roundEnd",
					})
					.step(get.info(name).effect[index]);
			};
			await game.doAsyncInOrder(lvfas, enact, () => 1);
		},
		effect: [
			async (event, trigger, player) => {
				player.removeTip("mbbingfa_0");
				const players = game.filterPlayer(() => true);
				let max = 0,
					targets = [];
				for (const target of players) {
					const num = target
						.getRoundHistory("sourceDamage", evt => evt.num)
						.reduce((sum, evt) => {
							return sum + evt.num;
						}, 0);
					if (num > max) {
						targets = [target];
						max = num;
					}
					if (num === max) {
						targets.add(target);
					}
				}
				const func = async target => {
					await target.damage(2, "nosource");
				};
				if (targets.length) {
					player.logSkill("mbbingfa", targets, null, null, [get.rand(3, 4)]);
					await game.doAsyncInOrder(targets, func);
				}
			},
			async (event, trigger, player) => {
				player.removeTip("mbbingfa_1");
				const players = game.filterPlayer(() => true);
				let max = 0,
					targets = [];
				for (const target of players) {
					const num = target
						.getRoundHistory("gain", evt => evt.cards?.length)
						.reduce((sum, evt) => {
							return sum + evt.cards?.length;
						}, 0);
					if (num > max) {
						targets = [target];
						max = num;
					}
					if (num === max) {
						targets.add(target);
					}
				}
				const func = async target => {
					target.addSkill("mbbingfa_limit");
					target.addMark("mbbingfa_limit", 2, false);
				};
				if (targets.length) {
					player.logSkill("mbbingfa", targets, null, null, [get.rand(3, 4)]);
					await game.doAsyncInOrder(targets, func);
				}
			},
			async (event, trigger, player) => {
				player.removeTip("mbbingfa_2");
				const players = game.filterPlayer(() => true);
				let max = 0,
					targets = [];
				for (const target of players) {
					const num = game.getRoundHistory("changeHp", evt => evt.player == target && evt.num !== 0).length;
					if (num > max) {
						targets = [target];
						max = num;
					}
					if (num === max) {
						targets.add(target);
					}
				}
				const func = async target => {
					await target.loseMaxHp();
				};
				if (targets.length) {
					player.logSkill("mbbingfa", targets, null, null, [get.rand(3, 4)]);
					await game.doAsyncInOrder(targets, func);
				}
			},
			async (event, trigger, player) => {
				player.removeTip("mbbingfa_3");
				const players = game.filterPlayer(() => true);
				let max = 0,
					targets = [];
				for (const target of players) {
					const num = target.countCards("hej");
					if (num > max) {
						targets = [target];
						max = num;
					}
					if (num === max) {
						targets.add(target);
					}
				}
				const func = async target => {
					const targetx = game.filterPlayer(current => current != target);
					if (targetx?.length) {
						const func2 = async current => {
							if (target.countGainableCards(current, "he")) {
								await target.chooseToGive(current, "he", true);
							}
						};
						await game.doAsyncInOrder(targetx, func2);
					}
				};
				if (targets.length) {
					player.logSkill("mbbingfa", targets, null, null, [get.rand(3, 4)]);
					await game.doAsyncInOrder(targets, func);
				}
			},
		],
		chooseLvfa(player, targets, source, lvfas, eventId) {
			const num = game.countPlayer(current => {
				if (!targets.includes(current)) {
					return false;
				}
				if (current == player) {
					if (current.getStorage("mbbingfa_control").length) {
						return false;
					}
					return true;
				}
				return current.getStorage("mbbingfa_control").includes(player);
			});
			if (num > 1) {
				const event = get.event();
				const controls = [
					link => {
						const evt = get.event();
						if (evt.dialog && evt.dialog.buttons) {
							for (let i = 0; i < evt.dialog.buttons.length; i++) {
								const button = evt.dialog.buttons[i];
								button.classList.remove("selectable");
								button.classList.remove("selected");
								const counterNode = button.querySelector(".caption");
								if (counterNode) {
									counterNode.childNodes[0].innerHTML = ``;
								}
							}
							ui.selected.buttons.length = 0;
							game.check();
						}
						return;
					},
				];
				event.controls = [ui.create.control(controls.concat(["清除选择", "stayleft"]))];
			}
			const prompt = num > 0 ? `秉法：为本轮要执行的律法投票（你持有票数：${num}）` : "秉法：你没有投票权";
			const next = player
				.chooseButton([prompt, [lvfas, "textbutton"]])
				.set("ai", button => {
					return Math.random();
				})
				.set("maxNum", num)
				.set("filterButton", button => {
					const { maxNum } = get.event();
					const selected = ui.selected.buttons.slice();
					if (selected.length >= maxNum) {
						return false;
					}
					return true;
				})
				.set("custom", {
					add: {
						confirm(bool) {
							if (bool != true) {
								return;
							}
							const event = get.event().parent;
							if (event.controls) {
								event.controls.forEach(i => i.close());
							}
							if (ui.confirm) {
								ui.confirm.close();
							}
							game.uncheck();
						},
						button() {
							if (ui.selected.buttons.length) {
								return;
							}
							const event = get.event();
							if (event.dialog && event.dialog.buttons) {
								for (let i = 0; i < event.dialog.buttons.length; i++) {
									const button = event.dialog.buttons[i];
									const counterNode = button.querySelector(".caption");
									if (counterNode) {
										counterNode.childNodes[0].innerHTML = ``;
									}
								}
							}
							if (!ui.selected.buttons.length) {
								const evt = event.parent;
								if (evt.controls) {
									evt.controls[0].classList.add("disabled");
								}
							}
						},
					},
					replace: {
						button(button) {
							const event = get.event();
							if (!event.isMine() || !event.filterButton(button)) {
								return;
							}
							if (button.classList.contains("selectable") == false) {
								return;
							}
							button.classList.add("selected");
							ui.selected.buttons.push(button);
							let counterNode = button.querySelector(".caption");
							const count = ui.selected.buttons.filter(i => i == button).length;
							if (counterNode) {
								counterNode = counterNode.childNodes[0];
								counterNode.innerHTML = `×${count}`;
							} else {
								counterNode = ui.create.caption(
									`<span style="font-family:xinwei; text-shadow:#FFF 0 0 4px, #FFF 0 0 4px, rgba(74,29,1,1) 0 0 3px;">×${count}</span>`,
									button
								);
							}
							const evt = event.parent;
							if (evt.controls) {
								evt.controls[0].classList.remove("disabled");
							}
							game.check();
						},
					},
				})
				.set("id", eventId)
				.set("_global_waiting", true);
			if (num > 0) {
				next.set("selectButton", [1, num]);
			}
			return next;
		},
		subSkill: {
			limit: {
				markimage: "image/card/handcard.png",
				intro: {
					markcount(storage) {
						if (typeof storage !== "number" || storage == 0) {
							return null;
						}
						return `-${storage}`;
					},
					content: "手牌上限-#",
				},
				onremove: true,
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("mbbingfa_limit");
					},
				},
			},
			control: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: {
					content: "你的投票权已被交给$",
				},
			},
		},
	},
	mbshuxing: {
		audio: 2,
		trigger: {
			global: "useCardToTarget",
		},
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			if (event.target == player || event.card.name != "sha") {
				return false;
			}
			return !player.getStorage("mbshuxing_used").includes(event.target);
		},
		logTarget: "target",
		check(event, player) {
			const bool = get.effect(event.target, event.card, event.player, player) > 0,
				hasShan = target => {
					if (
						event.player.hasSkillTag("directHit_ai", true, {
							target: target,
							card: event.card,
						})
					) {
						return false;
					}
					if (target.hasKnownCards(player, card => get.name(card) == "shan")) {
						return true;
					}
					return target.countCards("h") >= Math.random() * 7;
				};
			if (!bool) {
				return true;
			}
			return hasShan(event.target);
		},
		async content(event, trigger, player) {
			player.addTempSkill("mbshuxing_used");
			const evt = trigger.getParent(),
				target = trigger.target;
			player.markAuto("mbshuxing_used", target);
			if (evt) {
				evt.excluded.add(target);
			}
			if (!target.countCards("h")) {
				return;
			}
			const { cards } = await target.showHandcards(`${get.translation(player)}发动了【束刑】`).forResult();
			if (cards.every(card => get.name(card) !== "shan")) {
				return;
			}
			const result = await target
				.chooseButton(
					[
						"束刑：选择一项",
						[
							[
								["losehp", "失去1点体力"],
								["give", `交给${get.translation(player)}你手牌中的【闪】和你下次【秉法】的投票权`],
							],
							"textbutton",
						],
					],
					true
				)
				.set("canGive", !target.hasSkill("mbbingfa_control"))
				.set("source", player)
				.set("filterButton", button => {
					const { player, canGive, source } = get.event();
					if (button.link == "losehp") {
						return true;
					}
					return canGive && player != source;
				})
				.set("ai", button => {
					return button.link == "give" ? 2 : 1;
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				if (result.links.includes("losehp")) {
					await target.loseHp();
				}
				if (result.links.includes("give")) {
					const cards = target.getGainableCards(player, "he", card => get.name(card) == "shan");
					if (cards?.length) {
						await target.give(cards, player);
					}
					if (!target.hasSkill("mbbingfa_control")) {
						target.addSkill("mbbingfa_control");
						target.markAuto("mbbingfa_control", player);
					}
				}
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//手杀SP曹操
	mblingfa: {
		audio: 4,
		trigger: { global: "roundStart" },
		filter(event, player) {
			return game.roundNumber < 3 || player.hasSkill("mblingfa", null, false, false);
		},
		prompt2(event, player) {
			switch (game.roundNumber) {
				case 1:
					return "本轮其他角色使用【杀】时，若其有牌，则其需弃置一张牌，否则你对其造成1点伤害";
				case 2:
					return "本轮其他角色使用【桃】结算结束后，若其有牌，则其需交给你一张牌，否则你对其造成1点伤害";
				default: {
					const skills = lib.skill["mblingfa"].derivation.filter(i => !player.hasSkill(i, null, false, false));
					return `失去【${get.translation("mblingfa")}】${skills.length > 0 ? `并获得${skills.map(i => `【${get.translation(i)}】`).join("、")}` : ""}`;
				}
			}
		},
		async content(event, trigger, player) {
			switch (game.roundNumber) {
				case 1:
					player.line(game.filterPlayer(current => current != player).sortBySeat());
					player.addTempSkill(`${event.name}_sha`, "roundStart");
					break;
				case 2:
					player.line(game.filterPlayer(current => current != player).sortBySeat());
					player.addTempSkill(`${event.name}_tao`, "roundStart");
					break;
				default:
					await player.changeSkills(lib.skill[event.name].derivation, [event.name]);
					break;
			}
		},
		derivation: ["twzhian", "new_rejianxiong"],
		subSkill: {
			sha: {
				charlotte: true,
				audio: "mblingfa",
				trigger: { global: "useCard" },
				filter(event, player) {
					return player != event.player && event.card.name == "sha" && event.player.countCards("he") > 0;
				},
				forced: true,
				logTarget: "player",
				content() {
					"step 0";
					game.delayx();
					trigger.player
						.chooseToDiscard("he", "令法：弃置一张牌，或受到来自" + get.translation(player) + "的1点伤害")
						.set("goon", get.damageEffect(trigger.player, player, trigger.player) < 0)
						.set("ai", function (card) {
							if (!_status.event.goon) {
								return 0;
							}
							return 8 - get.value(card);
						});
					"step 1";
					if (!result.bool) {
						trigger.player.damage();
					}
				},
				mark: true,
				marktext: '<span style="text-decoration: line-through;">杀</span>',
				intro: { content: "其他角色使用【杀】时，若其有牌，则其需弃置一张牌，否则你对其造成1点伤害。" },
			},
			tao: {
				charlotte: true,
				audio: "mblingfa",
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					return player != event.player && event.card.name == "tao" && event.player.countCards("he") > 0;
				},
				forced: true,
				logTarget: "player",
				content() {
					"step 0";
					game.delayx();
					trigger.player
						.chooseCard("he", "令法：交给" + get.translation(player) + "一张牌，否则受到来自其的1点伤害")
						.set("goon", get.damageEffect(trigger.player, player, trigger.player) < 0)
						.set("ai", function (card) {
							if (!_status.event.goon) {
								return 0;
							}
							return 8 - get.value(card);
						});
					"step 1";
					if (!result.bool) {
						trigger.player.damage();
					} else {
						trigger.player.give(result.cards, player);
					}
				},
				mark: true,
				marktext: '<span style="text-decoration: line-through;">桃</span>',
				intro: { content: "其他角色使用【桃】结算结束后，若其有牌，则其需交给你一张牌，否则你对其造成1点伤害。" },
			},
		},
	},
	//手杀曹洪
	mbyuanhu: {
		audio: "yuanhu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCard({ type: "equip" }, "eh");
		},
		filterCard: { type: "equip" },
		filterTarget(card, player, target) {
			var card = ui.selected.cards[0];
			return target.canEquip(card);
		},
		discard: false,
		lose: false,
		prepare: "give",
		position: "he",
		check(card) {
			if (get.position(card) == "h") {
				return 9 - get.value(card);
			}
			return 7 - get.value(card);
		},
		logAudio(event, player) {
			const num = Math.min(get.equipNum(event.cards[0]), 3);
			return "yuanhu" + num + ".mp3";
		},
		async content(event, trigger, player) {
			const {
				target,
				cards: [card],
			} = event;
			await target.equip(card);
			switch (get.subtype(card)) {
				case "equip1":
					if (
						game.hasPlayer(function (current) {
							return current != target && get.distance(target, current) == 1 && current.countCards("hej") > 0;
						})
					) {
						const result = await player
							.chooseTarget(
								true,
								"弃置一名距离" + get.translation(target) + "为1的角色区域内的一张牌",
								function (card, player, target) {
									var current = _status.event.current;
									return current != target && get.distance(current, target) == 1 && current.countCards("hej") > 0;
								}
							)
							.set("current", target)
							.set("ai", function (target) {
								var player = _status.event.player;
								return get.effect(target, { name: "guohe_copy" }, player, player);
							})
							.forResult();
						if (result?.bool) {
							const targetx = result.targets[0];
							player.line(targetx);
							await player.discardPlayerCard(targetx, true, "hej");
						}
					}
					break;
				case "equip2":
					await target.draw();
					break;
				case "equip3":
				case "equip4":
				case "equip6":
					await target.recover();
					break;
				case "equip5": {
					const result = await player
						.chooseButton(["获得一种类型的牌", [["basic", "trick"].map(i => ["", "", `caoying_${i}`]), "vcard"]], true)
						.set("ai", () => Math.random())
						.forResult();
					if (result.bool) {
						const type = result.links[0][2].slice(8),
							type2 = ["basic", "trick"].find(i => i != type);
						const card1 = get.cardPile2(card => get.type(card) == type);
						if (card1) {
							await player.gain(card1, "gain2");
						}
						const card2 = get.cardPile2(card => get.type(card) == type2);
						if (card2) {
							await target.gain(card2, "gain2");
						}
					}
					break;
				}
			}
			if (target.hp <= player.hp || target.countCards("h") <= player.countCards("h")) {
				const { bool } = await player.chooseBool("援护：是否摸一张牌？").forResult();
				if (!bool) {
					return;
				}
				await player.draw();
				player.addTempSkill("mbyuanhu_end");
			}
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					if (get.attitude(player, target) == 0) {
						return 0;
					}
					if (!ui.selected.cards.length) {
						return;
					}
					var eff = get.effect(target, ui.selected.cards[0], player, player),
						sub = get.subtype(ui.selected.cards[0], false);
					if (target == player) {
						eff += 4;
					} else {
						var hp = player.hp,
							hs = player.countCards("h", card => card != ui.selected.cards[0]);
						var tp = target.hp,
							ts = target.countCards("h");
						if (sub == "equip2") {
							ts++;
						}
						if (tp < target.maxHp && (sub == "equip3" || sub == "equip4" || sub == "equip5" || sub == "equip6")) {
							tp++;
						}
						if (tp <= hp || ts <= hs) {
							eff += 2;
						}
					}
					if (sub == "equip1") {
						var list = game
							.filterPlayer(function (current) {
								return current != target && get.distance(target, current) == 1 && current.countCards("hej") < 0;
							})
							.map(function (i) {
								return get.effect(i, { name: "guohe_copy" }, player, player);
							})
							.sort((a, b) => b - a);
						if (list.length) {
							eff += list[0];
						}
					}
					return eff;
				},
				target(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					var sub = get.subtype(ui.selected.cards[0], false);
					var eff = get.effect(target, ui.selected.cards[0], player, target);
					if (sub == "equip2") {
						eff += get.effect(target, { name: "draw" }, target, target);
					}
					if (target.isDamaged() && (sub == "equip3" || sub == "equip4" || sub == "equip5" || sub == "equip6")) {
						eff += get.recoverEffect(target, player, player);
					}
					return eff;
				},
			},
		},
		group: "mbyuanhu_init",
		derivation: ["twjuezhu", "feiying"],
		subSkill: {
			init: {
				audio: ["mbyuanhu", 1],
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.addSkills("twjuezhu");
				},
			},
			end: {
				trigger: { player: "phaseJieshuBegin" },
				charlotte: true,
				filter(event, player) {
					return player.hasSkill("mbyuanhu") && player.hasCard({ type: "equip" }, "eh");
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseCardTarget({
							prompt: get.prompt("mbyuanhu"),
							prompt2:
								"将一张装备牌置入一名角色的装备区内。若此牌为：武器牌，你弃置与其距离为1的另一名角色区域的一张牌；防具牌，其摸一张牌；坐骑牌，其回复1点体力；宝物牌，你选择基本牌或普通锦囊牌从牌堆中获得一张，其获得另一类型的一张牌。然后若其体力值或手牌数不大于你，则你可摸一张牌。",
							filterCard: lib.skill.mbyuanhu.filterCard,
							filterTarget: lib.skill.mbyuanhu.filterTarget,
							position: "he",
							ai1: lib.skill.mbyuanhu.check,
							ai2(target) {
								var player = _status.event.player;
								return get.effect(target, "mbyuanhu", player, player);
							},
						})
						.forResult();
					event.result.skill_popup = false;
				},
				async content(event, trigger, player) {
					const { cards, targets } = event;
					const result = {
						cards: cards,
						targets: targets,
						skill: "mbyuanhu",
					};
					await player.useResult(result, event);
				},
			},
		},
	},
	//三娘
	mbshuyong: {
		audio: "meiyong",
		trigger: {
			player: ["useCard", "respond"],
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.countGainableCards(player, "hej") && target != player;
				})
				.set("ai", target => get.effect(target, { name: "shunshou_copy" }, get.player(), get.player()))
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			await player.gainPlayerCard(target, "hej", true);
			if (player.getRoundHistory("gain", evt => evt.getParent(2).name == event.name && evt.getParent(2).targets.includes(target)).length > 1) {
				await target.draw();
			}
		},
	},
	mbxushen: {
		limited: true,
		audio: "xinfu_xushen",
		enable: "phaseUse",
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###许身###" + get.skillInfoTranslation("mbxushen", null, false));
			},
			chooseControl(event, player) {
				const choices = [...[1, 2, 3].map(i => get.cnNumber(i) + "点"), "cancel2"];
				return choices;
			},
			check() {
				const player = get.player();
				const num = game
					.filterPlayer(
						target =>
							get.attitude(target, player) > 0 &&
							target.hasCard(card => {
								return lib.filter.cardSavable(card, player);
							}, "hs")
					)
					.reduce((sum, target) => {
						const cards = target.getCards("hs", card => lib.filter.cardSavable(card, player));
						return sum + cards.reduce((sum2, card) => sum2 + (get.tag(card, "recover") || 0), 0);
					}, 0);
				const minHp = player.getHp() + num;
				return minHp <= 1 ? "cancel2" : Math.min(2, Math.max(0, minHp - 1));
			},
			backup(result, player) {
				return {
					audio: "xinfu_xushen",
					index: result.index,
					skillAnimation: true,
					animationColor: "orange",
					async content(event, trigger, player) {
						const index = get.info(event.name).index;
						player.awakenSkill(event.name.slice(0, -7));
						player.addTempSkill(event.name.slice(0, -7) + "_effect");
						await player.draw(index + 1);
						await player.loseHp(index + 1);
					},
				};
			},
			prompt(result, player) {
				const num = result.index + 1;
				return `摸${get.cnNumber(num)}张牌并失去${num}点体力`;
			},
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					if (player.hasUnknown() || player.getHp() > 3) {
						return 0;
					}
					const num = game
						.filterPlayer(
							target =>
								get.attitude(target, player) > 0 &&
								target.hasCard(card => {
									return lib.filter.cardSavable(card, player);
								}, "hs")
						)
						.reduce((sum, target) => {
							const cards = target.getCards("hs", card => lib.filter.cardSavable(card, player));
							return sum + cards.reduce((sum2, card) => sum2 + (get.tag(card, "recover") || 0), 0);
						}, 0);
					const minHp = player.getHp() + num;
					return num > 0 && minHp > 1 ? 1 : 0;
				},
			},
		},
		derivation: ["new_rewusheng", "redangxian", "rezhiman"],
		subSkill: {
			backup: {},
			effect: {
				charlotte: true,
				forced: true,
				trigger: { player: "dyingAfter" },
				filter(event, player) {
					const evt2 = event.getParent(2);
					if (!(evt2.name === "mbxushen_backup" && evt2.player === player)) {
						return false;
					}
					const skills = lib.skill.mbxushen.derivation;
					return (
						game.getGlobalHistory("changeHp", evt => {
							if (evt.player === player) {
								const evt3 = evt.getParent();
								if (evt3.name === "recover") {
									return (
										evt3.getParent("dying") === event &&
										evt3.source?.isIn() &&
										skills.some(i => !evt3.source.hasSkill(i, null, false, false))
									);
								}
							}
							return false;
						}).length > 0
					);
				},
				async content(event, trigger, player) {
					let skills = lib.skill.mbxushen.derivation.slice();
					let targets = [];
					game.getGlobalHistory("changeHp", evt => {
						if (evt.player === player) {
							const evt3 = evt.getParent();
							if (evt3.name === "recover" && evt3.getParent("dying") === trigger && evt3.source?.isIn()) {
								targets.add(evt3.source);
							}
						}
					});
					targets.sortBySeat();
					while (skills.length) {
						const skill = skills.shift();
						const result = await player
							.chooseTarget()
							.set("createDialog", [`###许身###令一名令你回复过体力的角色获得【${get.translation(skill)}】`, [[skill], "skill"]])
							.set("filterTarget", (card, player, target) => {
								const { targetx } = get.event();
								return targetx.includes(target);
							})
							.set("ai", target => {
								const { gainSkill: skill, player } = get.event();
								_status.event.skillRankPlayer = target;
								const num = get.skillRank(skill, "inout") * Math.sign(Math.sign(get.attitude(player, target)) - 0.5);
								delete _status.event.skillRankPlayer;
								return num;
							})
							.set("targetx", targets)
							.set("gainSkill", skill)
							.forResult();
						if (result?.bool && result.targets?.length) {
							const [target] = result.targets;
							player.line(target);
							if (target.hasSkill(skill, null, false, false)) {
								await target.draw(3);
							} else {
								await target.addSkills(skill);
							}
						}
					}
				},
			},
		},
	},
	mbzhennan: {
		audio: "xinfu_zhennan",
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget || !event.targets.includes(player) || get.type2(event.card) !== "trick") {
				return false;
			}
			return event.targets.length > Math.max(1, event.player.getHp());
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt(event.skill),
					prompt2: "弃置一张牌并对一名角色造成1点伤害",
					filterCard(card, player) {
						return lib.filter.cardDiscardable(card, player, "mbzhennan");
					},
					position: "he",
					filterTarget: true,
					ai1(card) {
						return 5 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						return get.damageEffect(target, player, player);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			await player.modedDiscard(cards);
			await target.damage("nocard");
		},
	},
	mbfangxu: {
		audio: 4,
		onChooseToUse(event) {
			const player = event.player;
			if (!game.online && (player.getStat().skill.mbfangxu || 0) < lib.skill.mbfangxu.usable) {
				event.set(
					"mbfangxu",
					(() => {
						event.mbfangxu ??= {};
						event.mbfangxu[player.playerid] = player.getHistory("gain").reduce((cards, evt) => cards.addArray(evt.cards), []);
						return event.mbfangxu;
					})()
				);
			}
		},
		enable: "chooseToUse",
		filter(event, player) {
			const cards = player.getCards("he", card => event.mbfangxu?.[player.playerid]?.includes(card));
			return ["sha", "shan"].some(name => cards.some(i => event.filterCard(get.autoViewAs({ name: name }, [i]), player, event)));
		},
		usable: 2,
		chooseButton: {
			dialog(event, player) {
				let vcards = [],
					cards = player.getCards("he", card => event.mbfangxu[player.playerid].includes(card));
				for (const name of ["sha", "shan"]) {
					cards.some(i => event.filterCard(get.autoViewAs({ name: name }, [i]), player, event)) && vcards.push(["基本", "", name]);
				}
				const dialog = ui.create.dialog("芳许", [vcards, "vcard"], "hidden");
				dialog.direct = true;
				return dialog;
			},
			ai: () => 1,
			prompt(links) {
				return `###芳许###<div class="text center">将一张本回合获得的牌当作【${get.translation(links[0][2])}】使用</div>`;
			},
			backup(links, player) {
				return {
					filterCard(card, player) {
						return get.event().mbfangxu?.[player.playerid]?.includes(card);
					},
					position: "he",
					check(card) {
						return 7 - get.value(card);
					},
					viewAs: { name: links[0][2] },
					precontent() {
						player.addTempSkill("mbfangxu_effect");
					},
				};
			},
		},
		ai: {
			order(item, player) {
				return get.event().type === "phase" ? get.order({ name: "sha" }, player) + 0.1 : 1;
			},
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				const cards = player.getHistory("gain").reduce((cards, evt) => cards.addArray(evt.cards), []);
				return (
					arg !== "respond" &&
					(player.getStat().skill.mbfangxu || 0) < lib.skill.mbfangxu.usable &&
					cards.containsSome(...player.getCards("he"))
				);
			},
			result: { player: 1 },
		},
		subSkill: {
			backup: {},
			effect: {
				charlotte: true,
				trigger: { player: ["useCard", "useCardAfter"] },
				filter(event, player, name) {
					return event.skill === "mbfangxu_backup" && (name === "useCard" || typeof event.mbfangxu_guess?.[player.playerid] === "number");
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const card = trigger.card,
						target = _status.currentPhase;
					if (event.triggername === "useCard") {
						const str = get.translation(card);
						const result = await player
							.chooseControl()
							.set("choiceList", [
								`若${str}造成伤害，你弃置受伤角色至多两张牌`,
								`若${str}未造成伤害${target?.isIn() ? `，${get.translation(target)}摸两张牌` : ""}`,
							])
							.set("prompt", "芳许：请进行你的选择（不公开）")
							.set("ai", () => {
								const player = get.player(),
									target = _status.currentPhase;
								const trigger = get.event().getTrigger();
								let guess = 1;
								trigger.card.name === "sha" && trigger.targets.some(i => i.mayHaveShan(player, "use")) && guess--;
								guess === 1
									? target?.isIn() && get.effect(target, { name: "draw" }, player, player) < 0 && guess--
									: trigger.targets.some(
											i => i.mayHaveShan(player, "use") && get.effect(target, { name: "guohe_copy2" }, player, player) < 0
										) && guess++;
								return guess;
							})
							.forResult();
						trigger.set(
							"mbfangxu_guess",
							(() => {
								trigger.mbfangxu_guess ??= {};
								trigger.mbfangxu_guess[player.playerid] = result.index;
								return trigger.mbfangxu_guess;
							})()
						);
					} else {
						const guess = trigger.mbfangxu_guess[player.playerid];
						const goon = game.hasPlayer2(i => i.hasHistory("damage", evt => evt.card === card));
						if (goon === Boolean(guess)) {
							return;
						}
						switch (guess) {
							case 0: {
								const targets = game.filterPlayer(i => i.hasHistory("damage", evt => evt.card === card)).sortBySeat();
								if (targets.length) {
									player.line(targets);
									for (const i of targets) {
										await player.discardPlayerCard(i, [1, 2], "he", true);
									}
								}
								break;
							}
							case 1: {
								if (target?.isIn()) {
									player.line(target);
									await target.draw(2);
								}
								break;
							}
						}
					}
				},
			},
		},
	},
	mbzhuguan: {
		audio: 4,
		trigger: { player: ["useCard", "phaseBegin"] },
		filter(event, player) {
			if (event.name === "phase") {
				return player.hasCard(card => card.hasGaintag("mbzhuguan") && lib.filter.cardDiscardable(card, player), "h");
			}
			return get.type(event.card) === "basic" && get.color(event.card) === "red";
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.name === "phase") {
				await player.discard(player.getCards("h", card => card.hasGaintag(event.name) && lib.filter.cardDiscardable(card, player)));
			} else {
				const next = player.draw();
				next.gaintag.add(event.name);
				await next;
			}
		},
		onremove(player, skill) {
			player.removeGaintag(skill);
		},
		mod: {
			ignoredHandcard(card, player) {
				if (card.hasGaintag("mbzhuguan")) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name === "phaseDiscard" && card.hasGaintag("mbzhuguan")) {
					return false;
				}
			},
		},
	},
	mblisuo: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > 0 && game.hasPlayer(target => lib.skill.mblisuo.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h") > 0;
		},
		usable: 1,
		async content(event, trigger, player) {
			const target = event.target;
			const next = player
				.chooseCardOL([player, target], "h", true, "栗索：请展示任意张手牌", [1, Infinity], "allowChooseAll")
				.set("ai", () => -0.5 + Math.random());
			next._args.remove("glow_result");
			const result2 = await next.forResult();
			const [playerCards, targetCards] = result2.map(i => i.cards);
			const videoId = lib.status.videoId++;
			game.broadcastAll(
				(cards, id, player, target) => {
					const dialog = ui.create.dialog(
						`${get.translation(player)}发动了【栗索】</div>`,
						`<div class="text center">${get.translation(player)}</div>`,
						cards[0],
						`<div class="text center">${get.translation(target)}</div>`,
						cards[1]
					);
					dialog.videoId = id;
				},
				[playerCards, targetCards],
				videoId,
				player,
				target
			);
			await game.delay(3);
			game.broadcastAll("closeDialog", videoId);
			game.log(player, "展示了", playerCards);
			game.log(target, "展示了", targetCards);
			let sgn = playerCards.length - targetCards.length;
			if (sgn > 0) {
				target.addTempSkill(event.name + "_zhixi", { player: "phaseUseAfter" });
				target.addMark(event.name + "_zhixi", targetCards.length, false);
			} else if (sgn < 0) {
				sgn = playerCards.length;
				const recastCards = playerCards.filter(i => player.canRecast(i));
				recastCards.length > 0 && (await player.recast(recastCards));
				while (sgn > 0) {
					const result = await player
						.chooseToUse(
							function (card, player, event) {
								return get.name(card) === "sha" && lib.filter.filterCard.apply(this, arguments);
							},
							`栗索（剩余${sgn}张）<div class="text center">你可以对${get.translation(target)}使用无距离和任何次数限制的【杀】</div></div>`
						)
						.set("targetRequired", true)
						.set("complexSelect", true)
						.set("complexTarget", true)
						.set("filterTarget", function (card, player, target) {
							const source = get.event().sourcex;
							return (target === source || ui.selected.targets.includes(source)) && lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("sourcex", target)
						.forResult();
					if (result?.bool) {
						sgn--;
					} else {
						break;
					}
				}
			}
		},
		ai: {
			order: 10,
			result: { target: -1 },
		},
		subSkill: {
			zhixi: {
				charlotte: true,
				onremove: true,
				markimage: "image/character/sunluyu.jpg",
				mark: true,
				intro: {
					markcount: storage => (storage || 0).toString(),
					content: storage => `下个出牌阶段还可使用${storage || 0}张牌`,
				},
				trigger: { player: "useCard0" },
				filter(event, player) {
					return player.isPhaseUsing() && player.countMark("mblisuo_zhixi") > 0;
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					player.removeMark(event.name, 1, false);
				},
				mod: {
					cardUsable(card, player) {
						if (player.isPhaseUsing() && !player.hasMark("mblisuo_zhixi")) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (player.isPhaseUsing() && !player.hasMark("mblisuo_zhixi")) {
							return false;
						}
					},
				},
			},
		},
	},
	//笮融
	mbfutu: {
		audio: 8,
		logAudio: (event, player, name, target, costResult) => {
			if (costResult.cost_data.length > 1) {
				return ["mbfutu5.mp3", "mbfutu6.mp3"];
			}
			return (costResult.cost_data.includes("black") ? [1, 2] : [3, 4]).map(i => `mbfutu${i}.mp3`);
		},
		trigger: {
			global: "phaseEnd",
		},
		filter(event, player) {
			return ["damage", "recover"].some(name => get.info("mbfutu")?.isMax(player, name));
		},
		isMax(player, name) {
			let count = current => {
				let history = _status.globalHistory?.[_status.globalHistory.length - 1]?.everything,
					count = 0;
				if (!history?.length) {
					return count;
				}
				for (let evt of history) {
					if (evt._cancelled || evt.name != name) {
						continue;
					}
					if (evt?.source != current || typeof evt.num != "number") {
						continue;
					}
					count += evt.num;
				}
				return count;
			};
			return count(player) >= 1 && !game.hasPlayer(current => count(current) > count(player));
		},
		marktext: "业",
		intro: {
			name: "业",
			name2: "业",
			content: "expansion",
			markcount: "expansion",
		},
		async cost(event, trigger, player) {
			let list = ["damage", "recover"].filter(name => get.info(event.skill)?.isMax(player, name)),
				map = {
					damage: "black",
					recover: "red",
				};
			list = list.map(i => map[i]);
			event.result = {
				bool: true,
				cost_data: list,
			};
			/*event.result = await player
				.chooseBool(get.prompt(event.skill))
				.set("prompt2", `将牌堆顶首张${list.map(i => get.translation(i)).join("和")}牌置于武将牌上，称为“业”`)
				.forResult();
			event.result.cost_data = list;*/
		},
		async content(event, trigger, player) {
			const colors = event.cost_data,
				cards = [];
			for (let color of colors) {
				const card = get.cardPile2(card => get.color(card) == color);
				if (card) {
					cards.push(card);
				}
			}
			if (cards?.length) {
				const next = player.addToExpansion(cards, "gain2");
				next.gaintag.add(event.name);
				await next;
			}
		},
		group: "mbfutu_defend",
		subSkill: {
			defend: {
				trigger: {
					player: "damageBegin3",
				},
				audio: "mbfutu",
				logAudio: () => [7, 8].map(i => `mbfutu${i}.mp3`),
				filter(event, player) {
					return player.hasExpansions("mbfutu");
				},
				async cost(event, trigger, player) {
					const { bool, links } = await player
						.chooseButton([`###${get.prompt("mbfutu")}###弃置一张业并防止此伤害`, player.getExpansions("mbfutu")])
						.set("eff", get.damageEffect(player, trigger.source, player))
						.set("ai", button => {
							const { player, eff } = get.event();
							if (eff >= 0) {
								return 0;
							}
							return player.getExpansions("mbfutu")?.filter(card => {
								return get.color(card) == get.color(button.link);
							})?.length;
						})
						.forResult();
					event.result = {
						bool: bool,
						cards: links,
					};
				},
				async content(event, trigger, player) {
					await player.loseToDiscardpile(event.cards);
					trigger.cancel();
				},
			},
		},
	},
	mbjingtu: {
		audio: 6,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return player.countExpansions("mbfutu") > 0;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [
					["red", "获得所有黑色“业”，然后对一名角色造成等量伤害"],
					["black", "获得所有红色“业”，然后令一名角色增加等量点体力上限并回复等量体力"],
					["all", "背水！同时执行两项"],
				];
				return ui.create.dialog("净土：选择一项", [list, "textbutton"], "hidden");
			},
			filter(button) {
				const player = get.player(),
					{ link } = button,
					count = color => player.countCards("x", card => card.hasGaintag("mbfutu") && get.color(card) != color);
				if (link != "all") {
					return count(link) > 0;
				}
				return count("red") > 0 && count("red") == count("black");
			},
			check(button) {
				switch (button.link) {
					case "black":
						return 5;
					case "red":
						return 10;
					case "all":
						return 15;
				}
			},
			backup(links, player) {
				return {
					audio: "mbjingtu",
					logAudio: (event, player) => {
						const choice = get.info("mbjingtu_backup")?.choice;
						switch (choice) {
							case "red":
								return ["mbjingtu1.mp3", "mbjingtu2.mp3"];
							case "black":
								return ["mbjingtu3.mp3", "mbjingtu4.mp3"];
							default:
								return ["mbjingtu5.mp3", "mbjingtu6.mp3"];
						}
					},
					choice: links[0],
					skillAnimation: true,
					animationColor: "gray",
					async content(event, trigger, player) {
						player.awakenSkill("mbjingtu");
						const choice = get.info(event.name)?.choice;
						const cards = player.getCards("x", card => card.hasGaintag("mbfutu") && get.color(card) != choice);
						if (!cards?.length) {
							return;
						}
						await player.gain(cards, "gain2");
						player.changeSkin(
							{ characterName: "mb_zerong" },
							`mb_zerong_${choice == "all" ? choice : choice == "red" ? "black" : "red"}`
						);
						const count = color => cards?.filter(card => get.color(card) == color)?.length,
							black = count("black"),
							red = count("red");
						if (choice != "black" && black > 0) {
							const result = await player
								.chooseTarget(`净土：对一名角色造成${black}点伤害`, true)
								.set("ai", target => {
									const player = get.player();
									return get.damageEffect(target, player, player);
								})
								.forResult();
							if (result.bool) {
								const target = result.targets[0];
								player.line(target, "green");
								await target.damage(player, black);
							}
						}
						if (choice != "red" && red > 0) {
							const result = await player
								.chooseTarget(`净土：令一名角色增加${red}点体力上限并恢复${red}点体力`, true)
								.set("ai", target => {
									const player = get.player();
									return get.recoverEffect(target, player, player);
								})
								.forResult();
							if (result.bool) {
								const target = result.targets[0];
								player.line(target, "green");
								await target.gainMaxHp(red);
								await target.recover(player, red);
							}
						}
						await player.changeSkills(["mbfozong"], ["mbfutu"]);
						const colors = cards
							.slice(0)
							.map(i => get.color(i))
							.toUniqued();
						player.markAuto("mbfozong", colors);
					},
				};
			},
			prompt(links, player) {
				const map = {
					red: "获得所有黑色“业”，然后对一名角色造成等量伤害",
					black: "获得所有红色“业”，然后令一名角色增加等量点体力上限并回复等量体力",
					all: "获得所有“业”，然后依次执行：1.对一名角色造成黑色“业”数点伤害；2.令一名角色增加红色“业”数点体力上限并回复等量体力",
				};
				return map[links[0]];
			},
		},
		derivation: "mbfozong",
		ai: {
			combo: "mbfutu",
			order: 3,
			result: {
				player(player) {
					const count = color => player.countCards("x", card => card.hasGaintag("mbfutu") && get.color(card) == color);
					if (count("red") > 1 && count("red") == count("black")) {
						return 1;
					}
					if (player.hp < 2 && count("red") > 1) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: {
			backup: {},
		},
	},
	mbjiebian: {
		audio: 2,
		trigger: {
			global: "phaseUseEnd",
		},
		filter(event, player) {
			if (
				game.hasPlayer2(
					current =>
						current.getHistory("damage", evt => {
							return evt.getParent(event.name) == event;
						}).length > 0,
					true
				)
			) {
				return false;
			}
			return game.hasPlayer(current => {
				if (current != _status.currentPhase && !current.isMinHp()) {
					return false;
				}
				return player.canCompare(current, player.hasExpansions("mbfutu"));
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("filterTarget", (card, player, target) => {
					if (target != _status.currentPhase && !target.isMinHp()) {
						return false;
					}
					return player.canCompare(target, player.hasExpansions("mbfutu"));
				})
				.set("ai", target => {
					const player = get.player(),
						eff1 = get.damageEffect(target, player, player),
						eff2 = get.recoverEffect(target, player, player);
					if (target.countCards("h") > 2) {
						return Math.max(eff1, eff2);
					}
					return eff1;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			player.addTempSkill("mbjiebian_fake");
			const cards = game.createFakeCards(player.getExpansions("mbfutu"));
			player.directgains(cards, null, "mbjiebian");
			const result = await player.chooseToCompare(target).set("mbjiebian", true).set("position", "hs").forResult();
			if (result.tie || result.winner != player) {
				return;
			}
			const winner = result.winner,
				loser = winner == player ? target : player;
			const result2 = await winner
				.chooseButton(
					[
						"劫辩：选择一项",
						[
							[
								["damage", `对${get.translation(loser)}造成1点伤害`],
								["recover", `令${get.translation(loser)}恢复1点体力并摸一张牌，然后获得其至多两张牌`],
							],
							"textbutton",
						],
					],
					true
				)
				.set("ai", button => {
					const { player, loser } = get.event(),
						{ link } = button;
					return get[`${link}Effect`](loser, player, player);
				})
				.set("loser", loser)
				.forResult();
			if (result2?.bool) {
				if (result2?.links[0] == "damage") {
					await loser.damage(winner);
				} else {
					await loser.recover(winner);
					await loser.draw();
					await winner.gainPlayerCard(loser, "he", [1, 2], true);
				}
			}
		},
		subSkill: {
			fake: {
				charlotte: true,
				trigger: {
					global: ["chooseCardOLBegin", "chooseCardOLEnd"],
				},
				filter(event, player) {
					return event.type == "compare" && !event.directresult && event.getParent().mbjiebian;
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					if (event.triggername == "chooseCardOLBegin") {
						//牌的检测也得重写，毕竟都选到s区域去了
						trigger._set.push(["position", "hs"]);
						const originalFilter = trigger.filterCard;
						trigger._set.push([
							"filterCard",
							function (card) {
								if (typeof originalFilter === "function" && !originalFilter(card)) {
									return false;
								}
								if (get.position(card) == "s") {
									return card.hasGaintag("mbjiebian");
								}
								return true;
							},
						]);
					} else {
						const cards = player.getCards("s", card => card.hasGaintag("mbjiebian"));
						if (cards?.length) {
							game.deleteFakeCards(cards);
						}
						if (!trigger.result[trigger.targets.indexOf(player)].skill) {
							const card = trigger.result[trigger.targets.indexOf(player)].cards[0],
								precard = player.getExpansions("mbfutu").find(cardx => cardx.cardid == card._cardid);
							if (precard) {
								trigger.result[trigger.targets.indexOf(player)].cards = [precard];
							}
						}
					}
				},
			},
		},
	},
	mbfozong: {
		audio: 6,
		logAudio: (event, player) => {
			const list = player.getStorage("mbfozong");
			let audios = list.length > 1 ? [5, 6] : list.includes("red") ? [3, 4] : [1, 2];
			return `mbfozong${audios[["recover", "damage"].indexOf(event.name)]}.mp3`;
		},
		forced: true,
		onremove: true,
		trigger: {
			global: ["damageBegin1", "recoverBegin"],
		},
		filter(event, player) {
			const list = player.getStorage("mbfozong");
			let evt = event.getParent("useCard", true),
				card = event.card;
			if (evt?.player != player || !card || evt.card != card) {
				return false;
			}
			return (
				list?.includes(get.color(card, player)) &&
				player.hasHistory("lose", evtx => {
					const evt2 = evtx.relatedEvent || evtx.getParent();
					return evtx.hs?.length && evt2 == evt;
				})
			);
		},
		async content(event, trigger, player) {
			trigger.num++;
		},
		mod: {
			ignoredHandcard(card, player) {
				const list = player.getStorage("mbfozong");
				if (list?.includes(get.color(card, player))) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				const list = player.getStorage("mbfozong");
				if (name == "phaseDiscard" && list?.includes(get.color(card, player))) {
					return false;
				}
			},
		},
		ai: {
			combo: "mbjingtu",
		},
	},
	//手杀孟达
	mbjili: {
		audio: 9,
		logAudio: () => ["mbjili1.mp3", "mbjili2.mp3"],
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player) {
			return player.inRange(event.player) && player.getStorage("mbjili").length < 3;
		},
		async cost(event, trigger, player) {
			const list = [0, 1, 2].filter(num => !player.getStorage("mbjili").includes(num));
			list.add("cancel2");
			const result = await player
				.chooseControl(list)
				.set("prompt", get.prompt2(event.skill, trigger.player))
				.set("ai", () => {
					const player = get.player(),
						target = get.event().getTrigger().player;
					if (get.attitude(player, target) > 0) {
						return "cancel2";
					}
					return [0, 1, 2].filter(num => !player.getStorage("mbjili").includes(num)).randomGet();
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				cost_data: result.control,
				targets: [trigger.player],
			};
		},
		async content(event, trigger, player) {
			const num = event.cost_data;
			player.markAuto(event.name, num);
			player.addTempSkill("mbjili_used", "roundStart");
			if (!trigger.mbjili) {
				trigger.set("mbjili", {});
			}
			//trigger.mbjili[player.playerid] = num;
			player.addTempSkill("mbjili_effect");
			player.setStorage("mbjili_effect", [num, event.targets[0]]);
		},
		subSkill: {
			effect: {
				audio: "mbjili",
				trigger: {
					global: "phaseJieshuBegin",
				},
				charlotte: true,
				onremove: true,
				forced: true,
				locked: false,
				filter(event, player) {
					/*const evt = event.getParent("phase", true);
					return typeof evt?.mbjili?.[player.playerid] == "number";*/
					const storage = player.getStorage("mbjili_effect");
					return typeof storage[0] == "number" && storage[1] == event.player;
				},
				logAudio(event, player) {
					//logAudio客机自己跑没法获取history的
					/*const evt = event.getParent("phase", true),
						num = evt.mbjili[player.playerid],*/
					const storage = player.getStorage("mbjili_effect");
					const target = storage[1],
						num = storage[0],
						count = target.getHistory("useCard", evt => evt?.targets?.includes(player))?.length;
					if (count < num) {
						return ["mbjili7.mp3", "mbjili8.mp3", "mbjili9.mp3"];
					}
					if (count > num) {
						return ["mbjili5.mp3", "mbjili6.mp3"];
					}
					return ["mbjili3.mp3", "mbjili4.mp3"];
				},
				logTarget: "player",
				async content(event, trigger, player) {
					/*const evt = trigger.getParent("phase", true),
						num = evt.mbjili[player.playerid],*/
					const storage = player.getStorage(event.name);
					const target = storage[1],
						num = storage[0],
						count = target.getHistory("useCard", evt => evt?.targets?.includes(player)).length;
					if (count < num) {
						if (num < 4) {
							await player.draw(4 - num);
						}
					} else if (count == num) {
						if (num > 0 && player.countCards("he")) {
							await player.chooseToGive(target, num, true, "he");
						}
					} else {
						const card = { name: "sha", isCard: true };
						if (player.canUse(card, target, false)) {
							const { bool } = await player
								.chooseBool("积戾", `是否对${get.translation(target)}视为使用一张杀？`)
								.set("choice", get.effect(target, card, player, player) > 0)
								.forResult();
							if (bool) {
								await player.useCard(card, target, false);
							}
						}
					}
				},
			},
			used: {
				charlotte: true,
				onremove(player) {
					player.setStorage("mbjili", []);
				},
			},
		},
	},
	mbshishu: {
		audio: 2,
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		filter(event, player) {
			if (event.name != "gain" && event.type != "gain") {
				return false;
			}
			const cards = event.getl(player)?.cards2;
			if (!cards.length) {
				return false;
			}
			return game.hasPlayer(current => {
				if (current == player || current != _status.currentPhase) {
					return false;
				}
				const cardsx = event.getg(current);
				return cardsx.some(card => cards.includes(card));
			});
		},
		logTarget(event, player) {
			const cards = event.getl(player)?.cards2;
			return game.filterPlayer(current => {
				if (current == player || current != _status.currentPhase) {
					return false;
				}
				const cardsx = event.getg(current);
				return cardsx.some(card => cards.includes(card));
			});
		},
		forced: true,
		async content(event, trigger, player) {
			for (const target of event.targets) {
				const cards = trigger.getg(target).filter(card => trigger.getl(player).cards2.includes(card));
				const result = await target
					.chooseToGive(player, "he")
					.set("prompt", "恃术")
					.set("prompt2", `交给${get.translation(player)}一张与${get.translation(cards)}类型均不同的牌，或点取消弃置这些牌`)
					.set(
						"types",
						cards.map(i => get.type2(i, target))
					)
					.set("filterCard", card => {
						const { player, types } = get.event();
						return !types.includes(get.type2(card, player));
					})
					.forResult();
				if (!result.bool) {
					await target.modedDiscard(cards);
				}
			}
		},
	},
	mbjinzu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") && game.hasPlayer(current => current != player);
		},
		filterTarget(card, player, target) {
			return target != player;
		},
		filterCard: true,
		discard: false,
		lose: false,
		delay: 0,
		position: "h",
		async content(event, trigger, player) {
			const card = event.cards[0],
				target = event.target;
			if (!target.countCards("h")) {
				//神秘结算之空城即背水
				player.$throw(card);
				await player.showCards(card, get.translation(player) + "发动了【劲镞】");
				await player.modedDiscard(card);
				const stat = player.getStat().skill;
				if (stat.mbjinzu) {
					delete stat.mbjinzu;
				}
				const skill = "mbjinzu_effect";
				player.storage[skill] ??= new Map();
				player.storage[skill].set(target, !player.storage[skill].has(target) ? 1 : player.storage[skill].get(target) + 1);
				player.addTempSkill(skill);
				player.markSkill(skill);
				return;
			}
			const result =
				target.countCards("h") > 2
					? await target.chooseCard("劲镞：展示两张手牌", 2, "h", true).forResult()
					: {
							bool: true,
							cards: target.getCards("h"),
						};
			if (!result?.bool) {
				return;
			}
			const cards = [card].concat(result.cards);
			player.$throw(card);
			target.$throw(result.cards);
			game.log(player, "展示了", player, "的", card, "和", target, "的", result.cards);
			await player.showCards(cards, get.translation(player) + "发动了【劲镞】").set("log", false);
			const numbers = cards.map(card => get.number(card)).toUniqued(),
				min = Math.min(...numbers),
				max = Math.max(...numbers),
				number = get.number(card);
			if (number == min || number == max) {
				const lose_list = [
					[player, [card]],
					[target, result.cards],
				];
				await game
					.loseAsync({
						lose_list: lose_list,
					})
					.setContent("discardMultiple");
				const stat = player.getStat().skill;
				if (stat.mbjinzu) {
					delete stat.mbjinzu;
				}
			}
			if (result.cards.some(cardx => get.number(cardx) <= number) && result.cards.some(cardx => get.number(cardx) >= number)) {
				const skill = "mbjinzu_effect";
				player.storage[skill] ??= new Map();
				player.storage[skill].set(target, !player.storage[skill].has(target) ? 1 : player.storage[skill].get(target) + 1);
				player.addTempSkill(skill);
				player.markSkill(skill);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				audio: "mbjinzu",
				trigger: { player: "useCard" },
				filter(event, player) {
					return event.card?.name == "sha";
				},
				forced: true,
				async content(event, trigger, player) {
					const targets = Array.from(player.storage[event.name].keys()).sortBySeat();
					trigger.directHit.addArray(targets);
					for (const [target, num] of player.storage[event.name]) {
						const id = target.playerid;
						const map = trigger.customArgs;
						map[id] ??= {};
						if (typeof map[id].extraDamage !== "number") {
							map[id].extraDamage = 0;
						}
						map[id].extraDamage += num;
					}
					player.removeSkill(event.name);
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (tag == "directHit_ai" && (arg?.card?.name !== "sha" || !player.getStorage("mbjinzu_effect", new Map())?.has(arg?.target)))
							return false;
					},
				},
				intro: {
					content(storage, player) {
						if (!storage?.size) {
							return "";
						}
						let str = "下一张杀不可响应的角色和对应伤害增加值";
						for (const [target, num] of storage) {
							str += `<li>${get.translation(target)}：${num}`;
						}
						return str;
					},
				},
				targetprompt2: target => {
					const player = get.player(),
						card = get.card();
					if (card?.name == "sha") {
						if (player.getStorage("mbjinzu_effect", new Map())?.has(target)) {
							return `强命+${player.getStorage("mbjinzu_effect", new Map()).get(target)}`;
						}
					}
				},
				onChooseToUse(event) {
					event.targetprompt2.add(lib.skill.mbjinzu_effect.targetprompt2);
				},
				onChooseTarget(event) {
					event.targetprompt2.add(lib.skill.mbjinzu_effect.targetprompt2);
				},
			},
		},
		ai: {
			order: 9,
			result: {
				target: -1,
			},
		},
	},
	mbanxian: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.type != "discard") {
				return false;
			}
			const evt = event.getl(player);
			if (!evt?.hs?.some(i => get.position(i, true) == "d" && i.name == "sha")) {
				return false;
			}
			const history = player
				.getHistory("lose", evtx => {
					if (evtx.type != "discard") {
						return false;
					}
					return evtx?.hs?.length;
				})
				.map(evtx => (event.name == "lose" ? evtx : evtx.getParent()));
			return history.indexOf(event) == 0;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseButton([get.prompt2(event.skill), trigger.getl(player).hs])
				.set("filterButton", button => {
					return get.event().canGain.includes(button.link);
				})
				.set(
					"canGain",
					trigger.getl(player).hs.filter(card => get.position(card, true) == "d" && card.name == "sha")
				)
				.forResult();
			event.result = {
				bool: result.bool,
				cards: result?.links,
			};
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			await player.gain(cards, "gain2");
			if (player.hasUseTarget(cards[0], false, false)) {
				await player.chooseUseTarget(cards[0], true, false, "nodistance");
			}
		},
		//group: "mbanxian_draw",
		subSkill: {
			draw: {
				trigger: {
					source: "damageSource",
				},
				filter(event, player) {
					return event?.card?.name == "sha" && event.getParent("mbanxian", true);
				},
				popup: false,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.draw(2);
				},
			},
		},
	},
	//手杀关银屏
	mbxuehen: {
		audio: "xueji",
		trigger: {
			source: "damageSource",
			player: "damageEnd",
		},
		filter(event, player, name) {
			if (!player.isDamaged() || !player.countCards("h")) {
				return false;
			}
			if (name == "damageSource") {
				return player.getHistory("sourceDamage", evt => evt.num > 0).indexOf(event) == 0;
			}
			if (name == "damageEnd") {
				return player.getHistory("damage", evt => evt.num > 0).indexOf(event) == 0;
			}
			return false;
		},
		async cost(event, trigger, player) {
			const str = `###${get.prompt(event.skill)}###${lib.dynamicTranslate[event.skill](player)}`;
			event.result = await player
				.chooseCard(str, [1, player.getDamagedHp()])
				.set("ai", card => (card.hasGaintag("mbxuehen_sha") ? 0 : 7 - get.value(card)))
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			await player.showCards(cards, `${get.translation(player)}发动了〖雪恨〗`);
			player.addGaintag(cards, "mbxuehen_sha");
		},
		group: ["mbxuehen_sha"],
		subSkill: {
			rewrite: { nopop: true },
			sha: {
				mod: {
					cardname(card) {
						if (get.itemtype(card) == "card" && card.hasGaintag("mbxuehen_sha")) {
							return "sha";
						}
					},
					cardnature(card) {
						if (get.itemtype(card) == "card" && card.hasGaintag("mbxuehen_sha")) {
							return false;
						}
					},
					cardUsable(card, player, num) {
						if (card?.cards?.some(cardx => cardx.hasGaintag("mbxuehen_sha"))) {
							return Infinity;
						}
					},
				},
				charlotte: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				silent: true,
				trigger: {
					source: "damageSource",
					player: ["useCard1", "useCardAfter"],
				},
				filter(event, player, name) {
					if (event.name == "useCard") {
						if (name == "useCard1" && event.addCount === false) {
							return false;
						}
						if (name == "useCardAfter" && !player.storage.mbxuehen) {
							return false;
						}
						return player.hasHistory("lose", evt => {
							const evtx = evt.relatedEvent || evt.getParent();
							return evtx == event && Object.values(evt.gaintag_map).flat().includes("mbxuehen_sha");
						});
					}
					return (
						event.card &&
						player.hasHistory("lose", evt => {
							const evtx = evt.relatedEvent || evt.getParent();
							return evtx.card == event.card && Object.values(evt.gaintag_map).flat().includes("mbxuehen_sha");
						})
					);
				},
				content() {
					if (trigger.name == "useCard") {
						const name = event.triggername;
						if (name == "useCard1") {
							trigger.addCount = false;
							const stat = player.getStat().card,
								name = trigger.card.name;
							if (typeof stat[name] === "number") {
								stat[name]--;
							}
						}
						if (name == "useCardAfter") {
							player.draw();
						}
					} else {
						player.removeGaintag(event.name);
					}
				},
			},
		},
	},
	mbhuxiao: {
		audio: "huxiao",
		enable: "phaseUse",
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("虎啸：选择一项", "hidden");
				dialog.add([
					[
						["damage", "对一名体力值大于等于你的角色造成1点火焰伤害"],
						["nodistance", "本回合使用牌无距离限制"],
						["both", "背水！弃置一张红色牌，然后依次执行以上所有选项"],
					],
					"textbutton",
				]);
				return dialog;
			},
			filter(button) {
				const player = get.player();
				const { link } = button;
				return link !== "both" || player.countDiscardableCards(player, "h", (card, player) => get.color(card, player) == "red");
			},
			check(button) {
				switch (button.link) {
					case "damage":
						return 10;
					case "nodistance":
						return 5;
					case "both":
						return 15;
				}
			},
			backup(links) {
				return {
					audio: "huxiao",
					choice: links[0],
					async content(event, trigger, player) {
						const choice = lib.skill.mbhuxiao_backup.choice;
						if (choice != "nodistance" && game.hasPlayer(target => target.hp >= player.hp)) {
							const result = await player
								.chooseTarget(`虎啸：对一名体力值大于等于你的角色造成1点火焰伤害`, true, (card, player, target) => {
									return player.hp <= target.hp;
								})
								.set("ai", target => get.damageEffect(target, get.player(), get.player(), "fire"))
								.forResult();
							if (result?.targets) {
								const target = result.targets[0];
								player.line(target, "fire");
								await target.damage("fire");
							}
						}
						if (choice != "damage") {
							player.addTempSkill("mbhuxiao_effect");
						}
						if (choice == "both" && player.countDiscardableCards(player, "h", (card, player) => get.color(card, player) == "red")) {
							await player.chooseToDiscard(`虎啸：请弃置一张红色牌`, true, (card, player) => get.color(card, player) == "red");
						}
					},
				};
			},
			prompt(links) {
				switch (links[0]) {
					case "damage":
						return "对一名体力值大于等于你的角色造成1点火焰伤害";
					case "discard":
						return "本回合使用牌无距离限制";
					case "both":
						return "背水！对一名体力值大于等于你的角色造成1点火焰伤害且本回合使用牌无距离限制，然后弃置一张红色牌";
				}
			},
		},
		ai: {
			order: 9,
			result: { player: 1 },
		},
		subSkill: {
			backup: {},
			effect: {
				charlotte: true,
				mod: { targetInRange: () => true },
				intro: { content: "本回合使用牌无距离限制" },
				mark: true,
			},
		},
	},
	mbwuji: {
		audio: "wuji",
		enable: "phaseUse",
		filter(event, player, name) {
			return player.hasSkill("mbhuxiao");
		},
		skillAnimation: true,
		animationColor: "orange",
		limited: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			if (player.hasSkill("mbxuehen")) {
				player.storage.mbxuehen = true;
				player
					.when({ player: "phaseUseEnd" })
					.filter(evt => event.getParent("phaseUse") == evt)
					.step(async () => {
						const num = player
							.getHistory("gain", evt => {
								return evt.getParent(2)?.name == "mbxuehen_sha" && evt.cards?.length;
							})
							.reduce((sum, evt) => sum + evt.cards.length, 0);
						if (num < 2) {
							delete player.storage.mbxuehen;
						}
					});
			}
		},
		ai: {
			combo: "mbhuxiao",
			order: 10,
			result: { player: 1 },
		},
		derivation: "mbxuehen_rewrite",
	},
	//手杀邢道荣 —— by 刘巴
	mbkuangwu: {
		audio: 4,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return player !== event.player && player.countCards("h") !== event.player.countCards("h");
		},
		logAudio: index => (typeof index === "number" ? "mbkuangwu" + index + ".mp3" : 2),
		async cost(event, trigger, player) {
			const target = trigger.player,
				num = Math.min(5, Math.max(1, target.countCards("h"))),
				hs = player.countCards("h"),
				prompt = get.prompt(event.skill, target);
			const effect = (() => {
				const juedou = new lib.element.VCard({ name: "juedou" });
				const juedouEff = get.effect(target, juedou, player, player);
				const loseEff = get.effect(player, { name: "losehp" }, player, player);
				if (!player.canUse(juedou, target, false)) {
					return loseEff;
				}
				return juedouEff + (juedouEff >= 0 ? 0 : loseEff);
			})();
			if (hs > target.countCards("h") && hs > num) {
				event.result = await player
					.chooseToDiscard(prompt, player.countCards("h") - num, "allowChooseAll")
					.set("effect", effect)
					.set("ai", card => {
						const { player, selectCard, effect } = get.event();
						let cards = player.getDiscardableCards(player, "h");
						const select = selectCard?.[1] ?? 1;
						if (cards.length < select) {
							return 0;
						}
						cards.sort((a, b) => get.value(a) - get.value(b));
						return cards.slice(0, select).reduce((s, c) => s + get.value(c), 0) + effect > 0 && cards.includes(card) ? 1 : 0;
					})
					.set("prompt2", "将手牌数弃至" + get.cnNumber(num) + "张，视为对" + get.translation(target) + "使用【决斗】")
					.set("chooseonly", true)
					.forResult();
			} else {
				let str = `视为对${get.translation(target)}使用【决斗】`;
				if (hs < num) {
					str = `将手牌摸至${get.cnNumber(num)}张，然后${str}`;
				}
				event.result = await player
					.chooseBool(prompt, str)
					.set(
						"choice",
						(() => {
							const count = Math.max(0, num - hs);
							return get.effect(player, { name: "draw" }, player, player) * count + effect >= 0;
						})()
					)
					.forResult();
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			if (event.cards?.length) {
				await player.discard(event.cards);
			} else {
				await player.drawTo(Math.min(5, target.countCards("h")));
			}
			player
				.when({ global: "useCardAfter" }, false)
				.filter((evt, player) => player.getStorage("mbkuangwu").includes(evt.card))
				.assign({ firstDo: true })
				.step(async (event, trigger, player) => {
					player.unmarkAuto("mbkuangwu", [trigger.card]);
					if (target.hasHistory("damage", evtx => trigger === evtx?.getParent(2))) {
						return;
					}
					player.logSkill("mbkuangwu", null, null, null, [get.rand(3, 4)]);
					await player.loseHp();
					player.tempBanSkill("mbkuangwu", "roundStart");
				})
				.finish();
			const juedou = new lib.element.VCard({ name: "juedou", isCard: true });
			if (player.canUse(juedou, target)) {
				await player.useCard(juedou, target).set("oncard", () => {
					const event = get.event(),
						{ card, player } = event;
					player.markAuto("mbkuangwu", [card]);
				});
			}
		},
	},
	//吴珂 —— by 刘巴
	mbzhuguo: {
		audio: 3,
		logAudio: index => (typeof index === "number" ? "mbzhuguo" + index + ".mp3" : 2),
		usable: 1,
		enable: "phaseUse",
		filterTarget: true,
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = Math.min(5, target.maxHp) - target.countCards("h");
			if (num > 0) {
				await target.draw(num);
			} else if (num < 0 && target.countDiscardableCards(target, "h") > 0) {
				await target.chooseToDiscard("h", -num, true, "allowChooseAll");
			}
			const isDraw = target.hasHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent(2) == event);
			if (!isDraw && target.isDamaged()) {
				await target.recover();
			}
			//按描述来说是因此成为，所以必须得是调整前不是最多，而且还必须要有摸牌且最后是最多，共三个条件（官方实际的结算也是这么回事）
			//描述删掉力
			if (target.isMaxHandcard()) {
				const result = await player
					.chooseTarget(
						"助国：选择一名其他角色，令" + get.translation(target) + "选择是否对其使用一张无距离限制的【杀】",
						(card, player, targetx) => ![player, get.event().target].includes(targetx)
					)
					.set("ai", targetz => {
						let player = get.player(),
							target = get.event().target;
						return get.effect(targetz, { name: "sha" }, target, player);
					})
					.set("target", target)
					.forResult();
				if (result.bool) {
					player.logSkill("mbzhuguo", [result.targets[0]], null, null, [3]);
					await target
						.chooseToUse(
							function (card, player, event) {
								return get.name(card, player) === "sha" && lib.filter.filterCard.apply(this, arguments);
							},
							`助国：是否对${get.translation(result.targets[0])}使用【杀】？`
						)
						.set("filterTarget", function (card, player, target) {
							const sourcex = get.event().sourcex;
							if (target != sourcex && !ui.selected.targets.includes(sourcex)) {
								return false;
							}
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("addCount", false)
						.set("sourcex", result.targets[0]);
				}
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					return target.maxHp - target.countCards("h");
				},
			},
		},
	},
	mbanda: {
		audio: 2,
		trigger: { global: "dying" },
		round: 1,
		check: (event, player) => get.attitude(player, event.player) > 0,
		filter: event => event.getParent().name == "damage" && event.getParent().source?.isIn(),
		logTarget: "player",
		async content(event, trigger, player) {
			const source = trigger.getParent().source;
			trigger.player.line(source);
			const result = await source
				.chooseToGive(
					"谙达：交给" + get.translation(trigger.player) + "两张不同颜色牌，否则其回复1点体力",
					(card, source) => {
						const selected = ui.selected.cards;
						if (!selected.length) {
							return true;
						}
						const targetColor = get.color(card, source);
						return !selected.some(selectedCard => get.color(selectedCard, source) === targetColor);
					},
					"he",
					2,
					trigger.player
				)
				.set("complexCard", true)
				.set("ai", card => {
					const player = get.player(),
						source = get.event().source;
					if (["tao", "jiu"].includes(get.name(card, source))) {
						return 0;
					}
					if (get.attitude(player, source) > 0) {
						return 11 - get.value(card);
					}
					return 7 - get.value(card);
				})
				.set("source", source)
				.forResult();
			if (!result.bool) {
				await trigger.player.recover();
			}
		},
	},
	//玄司马昭
	//若为？若为！若为~
	mbxiezheng: {
		audio: "jsrgxiezheng",
		inherit: "jsrgxiezheng",
		initGroup: "wei",
		async cost(event, trigger, player) {
			const mode = get.mode();
			event.result = await player
				.chooseTarget(
					get.prompt2(event.skill),
					(card, player, target) => {
						return target.countCards("h");
					},
					mode === "doudizhu" ? [1, 2] : 1
				)
				.set("ai", target => {
					const player = get.player();
					if (!player.hasValueTarget({ name: "binglinchengxiax", isCard: true, mbxiezheng: true })) {
						return 0;
					}
					let val = 0;
					if (ui.selected.targets.length) {
						val -= get.sgnAttitude(player, target);
					}
					val += get.sgnAttitude(player, target);
					if (target.mayHaveSha(player, null, null, "odds") > 0.5) {
						val *= 2;
					}
					return val;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const mode = get.mode();
			if (mode === "doudizhu") {
				player.tempBanSkill(event.name, "forever", false);
			}
			for (const target of event.targets.sortBySeat()) {
				if (target.countCards("h")) {
					const cards = target.getCards("h").randomGets(1);
					target.$throw(1, 1000);
					game.log(target, "将", "#y一张手牌", "置于了牌堆顶");
					await target.lose(cards, ui.cardPile, "insert");
					game.updateRoundNumber();
				}
			}
			const card = { name: "binglinchengxiax", isCard: true, mbxiezheng: true };
			if (player.hasUseTarget(card)) {
				await player.chooseUseTarget(card, true);
			}
			if (
				!game.hasPlayer2(current => {
					return current.hasHistory("damage", evt => evt.getParent(card.name)?.card?.mbxiezheng);
				}, true)
			) {
				await player.loseHp();
			}
		},
		locked: false,
		mod: {
			playerEnabled(card, player, target) {
				const mode = get.mode();
				if (mode !== "identity" || !card.mbxiezheng || player.storage.mbzhaoxiong || target.group === player.group) {
					return;
				}
				if (game.hasPlayer(current => current.group === player.group && player.canUse(card, current))) {
					return false;
				}
			},
		},
	},
	mbqiantun: {
		audio: "jsrgqiantun",
		logAudio: index => `jsrgqiantun${typeof index == "number" ? index : get.rand(1, 2)}.mp3`,
		inherit: "jsrgqiantun",
		filter(event, player) {
			return player.group === "wei" && game.hasPlayer(target => get.info("mbqiantun").filterTarget(null, player, target));
		},
		groupSkill: "wei",
		async content(event, trigger, player) {
			const target = event.target,
				cards = target.getCards("h").sort((a, b) => get.number(a, target) - get.number(b, target));
			const result = await target
				.chooseCard("展示任意张手牌，只能用这些牌拼点", [1, Infinity], "h", true, "allowChooseAll")
				.set("maxNum", get.number(cards[cards.length - 1], target))
				.set("minNum", get.number(cards[0], target))
				.set("ai", card => {
					const { player, maxNum, minNum } = get.event();
					if (maxNum > 12) {
						return 2;
					}
					if (minNum < 2) {
						if (get.number(card, player) == minNum) {
							return 2;
						}
						return 0;
					}
					if ([minNum, maxNum].some(num => get.number(card, player) == num)) {
						return 1;
					}
					return Math.random() - 0.5;
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			await target.showCards(result.cards);
			target.addGaintag(result.cards, "mbqiantun_tag");
			const next = player.chooseToCompare(target);
			next.set("filterCard", (card, player) => {
				const bool = cardx => cardx.hasGaintag("mbqiantun_tag");
				return !player?.countCards("h", bool) || bool(card);
			});
			if (target.countCards("h") + 1 > result.cards.length * 2) {
				next.set("small", true);
			}
			const result3 = await next.forResult();
			target.removeGaintag("mbqiantun_tag");
			const mode = get.mode();
			if (result3.winner == player) {
				player.logSkill("mbqiantun", [target], null, null, [3]);
				const cards = target.getCards("h", card => result.cards.includes(card));
				if (cards.length) {
					if (mode !== "doudizhu") {
						await target.give(cards, player);
					} else {
						const result2 =
							cards.length > 2
								? await player
										.chooseButton([get.translation(event.name) + "：请选择你要获得的牌", cards], 2, true)
										.set("ai", button => get.value(button.link))
										.forResult()
								: { bool: true, links: cards };
						if (result2?.bool && result2.links?.length) {
							await target.give(result2.links, player);
						}
					}
				}
			} else {
				player.logSkill("mbqiantun", [target], null, null, [4]);
				const cards = target.getCards("h", card => !result.cards.includes(card));
				if (cards.length) {
					if (mode !== "doudizhu") {
						await target.give(cards, player);
					} else {
						const result2 =
							cards.length > 2
								? await player
										.chooseButton(
											[
												get.translation(event.name) + "：请选择你要获得的牌",
												(() => {
													if (player.hasSkillTag("viewHandcard", null, target, true)) {
														return cards;
													}
													return [cards.slice().randomSort(), "blank"];
												})(),
											],
											2,
											true
										)
										.set("ai", button => get.value(button.link))
										.forResult()
								: { bool: true, links: cards };
						if (result2?.bool && result2.links?.length) {
							await target.give(result2.links, player);
						}
					}
				}
			}
			await player.showHandcards(get.translation(player) + "发动了【谦吞】");
		},
	},
	mbzhaoxiong: {
		audio: "jsrgzhaoxiong",
		inherit: "jsrgzhaoxiong",
		filter(event, player) {
			return player.isDamaged();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.changeSkin({ characterName: "mb_simazhao" }, "jin_jsrg_simazhao");
			await player.changeGroup("qun");
			//player.node.name.dataset.nature = get.groupnature("jin");
			await player.addSkills("mbdangyi");
		},
		persevereSkill: true,
		derivation: "mbdangyi",
	},
	mbweisi: {
		audio: "jsrgweisi",
		logAudio: index => `jsrgweisi${typeof index == "number" ? index : get.rand(1, 2)}.mp3`,
		inherit: "jsrgweisi",
		filter(event, player) {
			return player.group === "qun" && game.hasPlayer(target => get.info("mbweisi").filterTarget(null, player, target));
		},
		groupSkill: "qun",
		async content(event, trigger, player) {
			const { target } = event;
			if (target.countCards("h")) {
				const result = await target
					.chooseCard("将任意张手牌移出游戏直到本回合结束", [1, Infinity], "h", "allowChooseAll")
					.set("ai", card => {
						const { numx, player } = get.event();
						if (player.countCards("h", "sha") <= numx) {
							return 9;
						}
						if (get.name(card, player) == "sha") {
							return 0;
						}
						return 5;
					})
					.set("numx", player.countCards("h") / 4)
					.forResult();
				if (result.bool) {
					const next = target.addToExpansion(result.cards, "giveAuto", target);
					next.gaintag.add("mbweisi");
					await next;
					target
						.when({
							global: ["phaseBefore", "phaseAfter"],
						})
						.step(async (event, trigger, player) => {
							const cards = player.getExpansions("mbweisi");
							if (cards.length) {
								player.gain(cards, "draw");
								game.log(player, "收回了" + get.cnNumber(cards.length) + "张“威肆”牌");
							}
						});
				}
			}
			const card = { name: "juedou", isCard: true };
			player
				.when({
					source: "damageSource",
				})
				.filter(evt => evt.getParent(event.name) == event)
				.step(async (event, trigger, player) => {
					const cards = trigger.player.getCards("h");
					if (cards.length) {
						player.logSkill("mbweisi", [trigger.player], null, null, [3]);
						const mode = get.mode();
						if (mode !== "doudizhu") {
							await trigger.player.give(cards, player);
						} else {
							await player.gainPlayerCard(trigger.player, "h", true);
						}
					}
				});
			if (player.canUse(card, target)) {
				await player.useCard(card, target);
			}
		},
	},
	mbdangyi: {
		audio: "jsrgdangyi",
		inherit: "jsrgdangyi",
		filter(event, player) {
			return player.countMark("mbdangyi_used") < player.countMark("mbdangyi");
		},
		usable: 1,
		persevereSkill: true,
	},
	//牢又寄双雄
	//友崔均
	friendshunyi: {
		audio: 2,
		trigger: { player: "useCard" },
		getIndex(event, player) {
			const evt = player.getHistory("lose", evt => (evt.relatedEvent || evt.getParent()) === event)[0];
			return evt?.hs ?? [];
		},
		filter(event, player, name, card) {
			const hs = player.getHistory("lose", evt => (evt.relatedEvent || evt.getParent()) === event)[0].hs;
			const suit = get.suit(card, player),
				number = get.number(card, player);
			if (!["heart"].concat(player.getStorage("friendgongli_cuijun_shunyi")).includes(suit)) {
				return false;
			}
			if (typeof number !== "number" || number <= (player.storage.counttrigger?.friendshunyi ?? 0)) {
				return false;
			}
			//if (!player.hasCard({ suit: suit }, "h")) return false;
			const cards = [...hs, ...player.getCards("h")].unique().filter(i => {
				return i !== card && typeof get.number(i, player) === "number";
			});
			return !cards.length || number <= Math.min(...cards.map(i => get.number(i, player)));
		},
		prompt2(event, player, name, card) {
			return "将所有" + get.translation(get.suit(card, player)) + "的牌扣置于武将牌上直到回合结束，然后摸一张牌";
		},
		check(event, player, name, card) {
			const suit = get.suit(card, player),
				names = player
					.getCards("h", i => get.suit(i, player) === suit)
					.map(i => get.name(i, player))
					.unique();
			let used = [];
			for (const name of names) {
				let cards = player.getCards("h", { name: name });
				cards.sort((a, b) => player.getUseValue(b) - player.getUseValue(a));
				used.addArray(cards.slice(0, player.getCardUsable(name)));
			}
			return get.effect(player, { name: "draw" }, player, player) >= used.reduce((sum, i) => sum + player.getUseValue(i), 0);
		},
		content() {
			player.addTempSkill("friendshunyi_effect");
			const cards = player.getCards("h", { suit: get.suit(event.indexedData) });
			if (cards.length) {
				player.addToExpansion(cards, player, "giveAuto").gaintag.add("friendshunyi_effect");
			}
			player.draw();
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return player.getExpansions("friendshunyi_effect").length > 0;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const cards = player.getExpansions(event.name);
					await player.gain(cards, "draw");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张牌");
					player.removeSkill(event.name);
				},
				intro: {
					markcount: "expansion",
					mark(dialog, storage, player) {
						const cards = player.getExpansions("friendshunyi_effect");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
				},
			},
		},
	},
	friendbiwei: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			const info = get.info("friendbiwei");
			return player.hasCard(card => info.filterCard(card, player), "h") && game.hasPlayer(target => info.filterTarget(null, player, target));
		},
		filterCard(card, player) {
			const number = get.number(card, player);
			if (!lib.filter.cardDiscardable(card, player) || typeof number !== "number") {
				return false;
			}
			const cards = player.getCards("h", i => i !== card && typeof get.number(i, player) === "number");
			return !cards.length || number >= Math.max(...cards.map(i => get.number(i, player)));
		},
		position: "h",
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h");
		},
		usable: 1,
		check: card => 10 - get.value(card),
		async content(event, trigger, player) {
			const {
					cards: [card],
					target,
				} = event,
				number = get.number(card, player);
			const cards = target.getDiscardableCards(target, "h", i => typeof get.number(i) === "number" && get.number(i) >= number);
			if (cards.length) {
				await target.discard(cards);
			} else {
				delete player.getStat("skill")[event.name];
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					return get.effect(target, { name: "guohe_copy", position: "h" }, player, target);
				},
			},
		},
	},
	friendgongli_cuijun: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			if (lib.suit.every(suit => suit === "heart" || player.getStorage("friendgongli_cuijun_shunyi").includes(suit))) {
				return false;
			}
			if (!game.hasPlayer(target => lib.characterSort?.mobile?.mobile_laoyouji?.some(name => get.is.playerNames(target, name)))) {
				return false;
			}
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const num = game.countPlayer(target => lib.characterSort?.mobile?.mobile_laoyouji?.some(name => get.is.playerNames(target, name)));
			const suits = lib.suit
				.filter(suit => !(suit === "heart" || player.getStorage("friendgongli_cuijun_shunyi").includes(suit)))
				.reverse()
				.map(suit => "lukai_" + suit);
			const choices =
				suits.length > num
					? (
							await player
								.chooseButton(["共砺：请选择可令〖顺逸〗触发的额外花色", [suits, "vcard"]], true, [1, num])
								.set("ai", () => 1 + Math.random())
								.forResult()
						).links
					: suits.map(suit => ["", "", suit]);
			if (choices?.length) {
				player.addSkill("friendgongli_cuijun_shunyi");
				player.markAuto(
					"friendgongli_cuijun_shunyi",
					choices.map(i => i[2].slice("lukai_".length))
				);
			}
		},
		subSkill: {
			shunyi: {
				charlotte: true,
				onremove: true,
				intro: { content: "可因$花色触发〖顺逸〗" },
			},
		},
		ai: { combo: "friendshunyu" },
	},
	//友石韬
	friendqinying: {
		audio: 4,
		logAudio: () => 2,
		inherit: "dcctjiuxian",
		selectCard: [1, Infinity],
		allowChooseAll: true,
		position: "he",
		async content(event, trigger, player) {
			await player.recast(event.cards);
			player.addTempSkill("friendqinying_effect");
			const card = new lib.element.VCard({ name: "juedou", isCard: true, storage: { friendqinying: event.cards.length } });
			await player.chooseUseTarget(card, true);
		},
		ai: {
			order(item, player) {
				return 0.9 * get.order({ name: "juedou" }, player);
			},
			tag: {
				respond: 2,
				respondSha: 2,
				damage: 1,
			},
			result: {
				player(player) {
					const card = new lib.element.VCard({ name: "juedou", isCard: true, storage: { friendqinying: true } });
					let target = null,
						maxval = 0;
					for (let i of game.filterPlayer()) {
						if (!player.canUse(card, i)) {
							continue;
						}
						let jdeff = get.effect(i, card, player, player);
						if (jdeff < 0) {
							continue;
						}
						if (jdeff / 5 > maxval) {
							target = i;
							maxval = jdeff / 5;
						}
					}
					if (target) {
						return maxval / 80;
					}
					return 0;
				},
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				global: "friendqinying_global",
			},
			global: {
				charlotte: true,
				enable: "chooseToRespond",
				filter(event, player) {
					if (event.friendqinying || !(Array.isArray(event.respondTo) && (event.respondTo[1]?.storage?.friendqinying ?? 0) > 0)) {
						return false;
					}
					const source = event.respondTo[0],
						types = source.getStorage("friendgongli_shitao_qinying");
					return player.hasCard(card => lib.filter.cardDiscardable(card, player) && !types.includes(get.type2(card)), "hej");
				},
				filterCard: () => false,
				selectCard: [-2, -1],
				prompt() {
					const event = get.event();
					const source = event.respondTo[0],
						types = source.getStorage("friendgongli_shitao_qinying");
					return (
						'<span class="text center">' +
						[
							"此流程还可发动" + event.respondTo[1].storage.friendqinying + "次本效果",
							"弃置区域里的一张" + (types.length > 0 ? "非" + get.translation(types) : "") + "牌，视为打出【杀】",
						]
							.map(str => "※" + str)
							.join("<br>") +
						"</span>"
					);
				},
				log: false,
				viewAs: { name: "sha" },
				async precontent(evt, trigger, player) {
					const event = evt.getParent(),
						types = event.respondTo[0].getStorage("friendgongli_shitao_qinying");
					const { bool } = await player
						.discardPlayerCard(player, "hej", true)
						.set("types", types)
						.set(
							"prompt",
							(() => {
								return (
									'###钦英###<div class="text center">弃置区域里的一张' +
									(types.length > 0 ? "非" + get.translation(types) : "") +
									"牌，视为打出【杀】</div>"
								);
							})()
						)
						.set("logSkill", ["friendqinying", null, null, null, [get.rand(3, 4)]])
						.set("filterButton", button => !get.event().types.includes(get.type2(button.link)))
						.forResult();
					if (bool) {
						event.respondTo[1].storage.friendqinying--;
						game.broadcastAll(
							(card, storage) => {
								card.storage = storage;
							},
							event.respondTo[1],
							event.respondTo[1].storage
						);
					} else {
						event.set("friendqinying", true);
						event.goto(0);
					}
				},
				ai: {
					order(item, player) {
						const card = new lib.element.VCard({ name: "shunshou" });
						return get.effect(player, card, player, player) > 0 ? get.order(card, player) : 0.1;
					},
					respondSha: true,
					skillTagFilter(player, tag, arg) {
						if (arg === "use") {
							return false;
						}
						const event = get.event();
						if (event.friendqinying || !(Array.isArray(event?.respondTo) && (event.respondTo[1]?.storage?.friendqinying ?? 0) > 0)) {
							return false;
						}
						const source = event.respondTo[0],
							types = source.getStorage("friendgongli_shitao_qinying");
						return player.hasCard(card => lib.filter.cardDiscardable(card, player) && !types.includes(get.type2(card)), "hej");
					},
				},
			},
		},
	},
	friendlunxiong: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			const cardx = player.getCards("h", card => typeof get.number(card, player) === "number");
			if (!cardx.length) {
				return false;
			}
			return cardx.some(card => {
				if (!lib.filter.cardDiscardable(card, player)) {
					return false;
				}
				const number = get.number(card, player);
				if (number <= (player.storage?.friendlunxiong ?? 0)) {
					return false;
				}
				const cards = cardx.slice().remove(card);
				return !cards.length || number >= Math.max(...cards.map(i => get.number(i, player)));
			});
		},
		prompt2(event, player) {
			const cardx = player.getCards("h", card => typeof get.number(card, player) === "number");
			const card = cardx.find(card => {
					if (!lib.filter.cardDiscardable(card, player)) {
						return false;
					}
					const number = get.number(card, player);
					if (number <= (player.storage?.friendlunxiong ?? 0)) {
						return false;
					}
					const cards = cardx.slice().remove(card);
					return !cards.length || number >= Math.max(...cards.map(i => get.number(i, player)));
				}),
				number = get.number(card, player);
			return "弃置" + get.translation(card) + "并摸三张牌，本局游戏发动此技能弃置牌的点数须大于" + number;
		},
		check(event, player) {
			const cardx = player.getCards("h", card => typeof get.number(card, player) === "number");
			const card = cardx.find(card => {
				if (!lib.filter.cardDiscardable(card, player)) {
					return false;
				}
				const number = get.number(card, player);
				if (number <= (player.storage?.friendlunxiong ?? 0)) {
					return false;
				}
				const cards = cardx.slice().remove(card);
				return !cards.length || number >= Math.max(...cards.map(i => get.number(i, player)));
			});
			return get.effect(player, { name: "draw" }, player, player) * 3 > get.value(card, player);
		},
		async content(event, trigger, player) {
			const cardx = player.getCards("h", card => typeof get.number(card, player) === "number");
			if (!cardx.length) {
				return;
			}
			const card = cardx.find(card => {
				if (!lib.filter.cardDiscardable(card, player)) {
					return false;
				}
				const number = get.number(card, player);
				if (number <= (player.storage?.friendlunxiong ?? 0)) {
					return false;
				}
				const cards = cardx.slice().remove(card);
				return !cards.length || number >= Math.max(...cards.map(i => get.number(i, player)));
			});
			if (card) {
				const number = get.number(card, player);
				await player.discard(card);
				await player.draw(3);
				player.storage[event.name] = number;
				player.markSkill(event.name);
			}
		},
		intro: { content: "发动〖论雄〗弃置牌的点数须大于#" },
	},
	friendgongli_shitao: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			if (lib.inpile.map(i => get.type2(i)).every(type => player.getStorage("friendgongli_shitao_qinying").includes(type))) {
				return false;
			}
			if (!game.hasPlayer(target => lib.characterSort?.mobile?.mobile_laoyouji?.some(name => get.is.playerNames(target, name)))) {
				return false;
			}
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const num = game.countPlayer(target => lib.characterSort?.mobile?.mobile_laoyouji?.some(name => get.is.playerNames(target, name)));
			const types = lib.inpile
				.map(i => get.type2(i))
				.unique()
				.filter(type => !player.getStorage("friendgongli_shitao_qinying").includes(type));
			const choices =
				types.length > num
					? (
							await player
								.chooseButton(
									["共砺：请选择不可令〖钦英〗弃置的类别", [types.map(type => [type, get.translation(type)]), "tdnodes"]],
									true,
									[1, num]
								)
								.set("ai", () => 1 + Math.random())
								.forResult()
						).links
					: types;
			if (choices?.length) {
				player.addSkill("friendgongli_shitao_qinying");
				player.markAuto("friendgongli_shitao_qinying", choices);
			}
		},
		subSkill: {
			qinying: {
				charlotte: true,
				onremove: true,
				intro: { content: "不可令〖钦英〗弃置$类别的牌" },
			},
		},
		ai: { combo: "friendqinying" },
	},
	//孩子们，我来上班了
	//清河公主
	mbzengou: {
		audio: 3,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			if (player.getStorage("mbfeili_effect").includes(target)) {
				return false;
			}
			return target !== player && target.countCards("h");
		},
		usable: 1,
		async content(event, trigger, player) {
			const target = event.target;
			player.chat(get.translation(target) + "也干了");
			await game.delayx();
			target.chat("孩子我" + (["xizhicai", "xiahoumao"].some(i => get.is.playerNames(target, i)) ? "也干了" : "没干"));
			await game.delayx();
			await player.viewHandcards(target);
			const names = lib.inpile.filter(i => get.type(i) === "basic");
			const allNames = player
				.getCards("h", i => target.hasCard({ name: get.name(i) }, "h"))
				.map(i => get.name(i))
				.unique();
			const goon = get
				.inpileVCardList(info => names.includes(info[2]) && !target.hasCard({ name: info[2] }, "h"))
				.some(info => player.hasUseTarget(new lib.element.VCard({ name: info[2], nature: info[3] }), true, false));
			if (!goon && !allNames.length) {
				return;
			}
			let result;
			if (!goon) {
				result = { index: 1 };
			} else if (!allNames.length) {
				result = { index: 0 };
			} else {
				result = await player
					.chooseControl()
					.set("choiceList", [
						"视为使用两张" +
							names
								.filter(i => !target.hasCard({ name: i }, "h"))
								.map(i => "【" + get.translation(i) + "】")
								.join("、") +
							(names.filter(i => !target.hasCard({ name: i }, "h")).length > 1 ? "中的牌" : "") +
							"（不计入次数且无次数限制）",
						"将你与其手牌中的" +
							allNames.map(i => "【" + get.translation(i) + "】").join("、") +
							"替换为牌堆中等量的【杀】且你的这些牌不计入手牌上限直到你的结束阶段",
					])
					.set("ai", () => {
						const {
							player,
							list: [target, names, allNames],
						} = get.event();
						const list = get
							.inpileVCardList(info => names.includes(info[2]) && !target.hasCard({ name: info[2] }, "h"))
							.filter(info =>
								player.hasUseTarget(new lib.element.VCard({ name: info[2], nature: info[3], isCard: true }), true, false)
							);
						return Math.max(
							...list.map(info => player.getUseValue(new lib.element.VCard({ name: info[2], nature: info[3], isCard: true }), false))
						) >
							(() => {
								let sum = 0;
								sum += target.getCards("h", { name: allNames }).reduce((num, card) => num + get.value(card, target), 0);
								sum -= player.getCards("h", { name: allNames }).reduce((num, card) => num + get.value(card, player), 0);
								return sum;
							})() *
								Math.sign(get.attitude(player, target))
							? 0
							: 1;
					})
					.set("list", [target, names, allNames])
					.forResult();
			}
			if (result.index === 0) {
				const used = [];
				for (let i = 0; i < 2; i++) {
					let list = get
						.inpileVCardList(info => !used.includes(info[2]) && names.includes(info[2]) && !target.hasCard({ name: info[2] }, "h"))
						.filter(info => player.hasUseTarget(new lib.element.VCard({ name: info[2], nature: info[3], isCard: true }), true, false));
					if (!list.length) {
						break;
					}
					const [choice] =
						list.length > 1
							? (
									await player
										.chooseButton([get.translation(event.name) + "：请选择你要视为使用的基本牌", [list, "vcard"]], true)
										.set("ai", button =>
											get
												.player()
												.getUseValue(
													new lib.element.VCard({ name: button.link[2], nature: button.link[3], isCard: true }),
													false,
													false
												)
										)
										.forResult()
								).links
							: list;
					if (choice) {
						used.add(choice[2]);
						await player.chooseUseTarget(new lib.element.VCard({ name: choice[2], nature: choice[3], isCard: true }), true, false);
					}
				}
			} else {
				const cards = [player.getCards("h", { name: allNames }), target.getCards("h", { name: allNames })];
				await game
					.loseAsync({
						lose_list: [
							[player, cards[0]],
							[target, cards[1]],
						],
					})
					.setContent("loseToDiscardpileMultiple");
				let gains = [[], []];
				for (let i = 0; i < cards.length; i++) {
					while (gains[i].length < cards[i].length) {
						const card = get.cardPile2(card => {
							if (gains.flat().includes(card)) {
								return false;
							}
							return card.name === "sha";
						});
						if (card) {
							gains[i].push(card);
						} else {
							break;
						}
					}
				}
				if (gains.flat().length) {
					player.addTempSkill("mbzengou_effect", { player: "phaseJieshuBegin" });
					if (gains[1].length) {
						//target.addTempSkill("mbzengou_effect");
						await game
							.loseAsync({
								gain_list: [
									[player, gains[0]],
									[target, gains[1]],
								],
								animate: "gain2",
								gaintag: ["mbzengou_effect"],
							})
							.setContent("gaincardMultiple");
					} else {
						await player.gain(gains[0], "gain2");
					}
				}
			}
			if (names.length && target.isIn()) {
				const choose =
					names.length > 1
						? (
								await player
									.chooseControl(names)
									.set("ai", () => {
										const { player, target, controls } = get.event();
										if (get.attitude(player, target) < 0) {
											const cards = target.getCards("h", card => get.type(card) === "basic" && target.hasUseTarget(card));
											const names = cards.map(card => get.name(card));
											if (names.includes("sha") && controls.includes("sha")) {
												return "sha";
											}
											if (names.includes("tao") && controls.includes("tao")) {
												return "tao";
											}
										}
										return controls.randomGet();
									})
									.set("target", target)
									.set("prompt", "请选择令" + get.translation(target) + "获得的“诬”标记名称")
									.forResult()
							).control
						: names[0];
				if (choose) {
					player.line(target);
					player.popup(choose);
					target.addSkill("mbzengou_debuff");
					//target.setStorage("mbzengou_debuff", choose, true);
					//target.addTip("mbzengou_debuff", `谮构 ${get.translation(choose)}`);
					target.storage["mbzengou_debuff"][choose] = 1 + (target.storage["mbzengou_debuff"]?.[choose] || 0);
					target.addTip("mbzengou_debuff", `谮构 ${get.translation(Object.keys(target.storage["mbzengou_debuff"]))}`);
					target.markSkill("mbzengou_debuff");
				}
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					return -target.countCards("h") - 0.5;
				},
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("mbzengou_effect")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name === "phaseDiscard" && card.hasGaintag("mbzengou_effect")) {
							return false;
						}
					},
				},
			},
			debuff: {
				charlotte: true,
				init(player, skill) {
					player.storage[skill] = {};
				},
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				mark: true,
				marktext: "诬",
				intro: {
					markcount(storage = {}) {
						return Object.keys(storage).reduce((sum, item) => sum + storage[item], 0);
					},
					content(storage) {
						if (!storage) {
							return "无效果";
						}
						return [
							`你每回合使用的前三张牌结算完毕后，若你拥有此牌名的“诬”标记，则你失去1点体力并移去“诬”标记。`,
							"“诬”标记：<br>" +
								Object.keys(storage)
									.map(item => {
										return get.translation(item) + "：" + storage[item] + "枚";
									})
									.join("<br>"),
						]
							.map(str => "<li>" + str)
							.join("<br>");
						//return `每回合使用第一张牌结算完毕后，若你拥有此牌名的“诬”标记，则你失去1点体力并移去1枚此牌名的“诬”标记。`若此牌牌名为${get.translation(storage)}，;
					},
				},
				audio: "mbzengou",
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					if (player.getHistory("useCard").indexOf(event) > 2) {
						return false;
					}
					//return player.getStorage("mbzengou_debuff") == event.card.name;
					return player.storage["mbzengou_debuff"]?.[event.card.name] ?? 0 > 0;
				},
				forced: true,
				async content(event, trigger, player) {
					await player.loseHp();
					/*player.removeSkill(event.name);*/
					player.storage[event.name][trigger.card.name]--;
					if (get.info(event.name).intro.markcount(player.storage[event.name]) === 0) {
						player.removeSkill(event.name);
						return;
					}
					if (player.storage[event.name][trigger.card.name] === 0) {
						delete player.storage[event.name][trigger.card.name];
					}
					player.syncStorage(event.name);
					player.addTip(event.name, `谮构 ${get.translation(Object.keys(player.storage[event.name]))}`);
				},
				mod: {
					aiOrder(player, card, num) {
						if (player.getHistory("useCard").length > 0 || player.storage["mbzengou_debuff"][card.name] > 0) {
							return;
						}
						const effect = get.effect(player, { name: "losehp" }, player, player);
						if (effect < 0) {
							return num / 1145141919810;
						}
						return num + 10 * Math.sign(effect);
					},
				},
			},
		},
		loseToDiscardpileMultiple() {
			"step 0";
			event.visible = true;
			if (!event.position) {
				event.position = ui.discardPile;
			}
			var cards = [];
			event.cards = cards;
			for (var i = 0; i < event.lose_list.length; i++) {
				var next = event.lose_list[i][0].lose(event.lose_list[i][1], event.position);
				game.log(event.lose_list[i][0], "将", event.lose_list[i][1], "置入了弃牌堆");
				next.animate = false;
				next.delay = false;
				cards.addArray(event.lose_list[i][1]);
				next.getlx = false;
			}
			var evt = event;
			if (evt.animate != false) {
				evt.discardid = lib.status.videoId++;
				game.broadcastAll(
					function (list, id, cards) {
						for (var i of list) {
							for (var j of i[1]) {
								j.classList.remove("glow");
								j.classList.remove("glows");
							}
							i[0].$throw(i[1], null, "nobroadcast");
						}
						var cardnodes = [];
						cardnodes._discardtime = get.time();
						for (var ix of list) {
							var card = ix[1];
							for (var i = 0; i < cards.length; i++) {
								if (cards[i].clone) {
									cardnodes.push(cards[i].clone);
								}
							}
						}
						ui.todiscard[id] = cardnodes;
					},
					event.lose_list,
					evt.discardid,
					cards
				);
				if (lib.config.sync_speed && cards[0] && cards[0].clone) {
					if (evt.delay != false) {
						var waitingForTransition = get.time();
						evt.waitingForTransition = waitingForTransition;
						cards[0].clone.listenTransition(function () {
							if (_status.waitingForTransition == waitingForTransition && _status.paused) {
								game.resume();
							}
							delete evt.waitingForTransition;
						});
					} else if (evt.getParent().discardTransition) {
						delete evt.getParent().discardTransition;
						var waitingForTransition = get.time();
						evt.getParent().waitingForTransition = waitingForTransition;
						cards[0].clone.listenTransition(function () {
							if (_status.waitingForTransition == waitingForTransition && _status.paused) {
								game.resume();
							}
							delete evt.getParent().waitingForTransition;
						});
					}
				}
			}
			"step 1";
			if (event.delay != false) {
				if (event.waitingForTransition) {
					_status.waitingForTransition = event.waitingForTransition;
					game.pause();
				} else {
					game.delayx();
				}
			}
		},
	},
	mbfeili: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			if (!player.hasSkill("mbzengou", null, false, false)) {
				return false;
			}
			const source = event.source;
			return (
				player.countCards("he", card => lib.filter.cardDiscardable(card, player)) >= 2 ||
				(source?.isIn() && source.hasSkill("mbzengou_debuff"))
			);
		},
		async cost(event, trigger, player) {
			const source = trigger.source,
				str = get.translation(source || "");
			const goon1 = player.countCards("he", card => lib.filter.cardDiscardable(card, player)) >= 2;
			const goon2 = source?.isIn() && source.hasSkill("mbzengou_debuff");
			const result = await player
				.chooseControl(
					["弃牌", "移标记", "cancel2"].filter(item => {
						if (item === "cancel2") {
							return true;
						}
						return (item === "弃牌" && goon1) || (item === "移标记" && goon2);
					})
				)
				.set("choiceList", [
					"弃置两张牌并防止此伤害",
					"移去" + str + "的“诬”标记并防止此伤害，然后你摸四张牌，本局游戏你不能再对其发动〖谮构〗",
				])
				.set("ai", () => {
					const { player, controls } = get.event();
					const trigger = get.event().getTrigger();
					if (get.damageEffect(player, trigger.source, player, trigger.nature) * trigger.num >= 0) {
						return "cancel2";
					}
					return controls[0];
				})
				.set("prompt", get.prompt2(event.skill))
				.forResult();
			switch (result.control) {
				case "弃牌":
					event.result = await player.chooseToDiscard("弃置两张牌并防止此伤害", "he", 2, true).set("chooseonly", true).forResult();
					break;
				case "移标记":
					event.result = { bool: true, targets: [source] };
					break;
				default:
					event.result = { bool: false };
					break;
			}
		},
		async content(event, trigger, player) {
			trigger.cancel();
			if (event.cards?.length) {
				await player.discard(event.cards);
			}
			if (event.targets?.length) {
				const [target] = event.targets;
				target.removeSkill("mbzengou_debuff");
				await player.draw(4);
				player.addSkill("mbfeili_effect");
				player.markAuto("mbfeili_effect", [target]);
			}
		},
		ai: { combo: "mbzengou" },
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "和$彻底闹掰，想谮构也没得谮构" },
			},
		},
	},
	//牢又寄 —— 庞统
	friendmanjuan: {
		audio: 2,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			const cards = event.getg?.(player) || [];
			if (cards.length < 2 || !cards.some(i => get.owner(i) === player && ["h", "e"].includes(get.position(i)))) {
				return false;
			}
			return event.getParent().name != "friendmanjuan";
		},
		async cost(event, trigger, player) {
			const cards = trigger.getg(player).filter(i => get.owner(i) === player && ["h", "e"].includes(get.position(i)));
			const { moved } = await player
				.chooseToMove(get.prompt2(event.skill), "allowChooseAll")
				.set("list", [
					["牌堆顶", []],
					[["获得的牌"], cards],
				])
				.set("processAI", list => {
					let listx = list.map(i => i[1]);
					let cards = listx[1].filter(card => {
						if (!get.discardPile(c => get.type2(c) !== get.type2(card))) {
							return false;
						}
						return get.info("zhiheng").check(card) > 0;
					});
					cards = cards.sort((a, b) => get.info("zhiheng").check(b) - get.info("zhiheng").check(a)).slice(0, 5);
					return [cards, listx[0].removeArray(cards)];
				})
				.forResult();
			event.result = {
				bool: Boolean(moved?.[0]?.length),
				cost_data: moved,
			};
		},
		async content(event, trigger, player) {
			const cards = event.cost_data[0];
			await player.lose(cards, ui.cardPile, "insert");
			const list = [];
			for (const i of cards) {
				const card = get.cardPile(c => {
					if (list.includes(c)) {
						return false;
					}
					return get.type2(c) != get.type2(i);
				}, "discardPile");
				if (card) {
					list.add(card);
				}
				if (list.length >= 5) {
					break;
				}
			}
			if (list.length) {
				await player.gain(list, "gain2");
			}
		},
	},
	friendyangming: {
		audio: 2,
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			/*if (!get.discarded().length) {
				return false;
			}*/
			return (
				player
					.getHistory("lose", evt => {
						return evt.getParent("phaseUse") === event;
					})
					.reduce((sum, evt) => sum + (evt.getl?.(player)?.hs?.length ?? 0), 0) >= 2
			);
		},
		frequent: true,
		async content(event, trigger, player) {
			let num = player.hasSkill("friendpangtonggongli") && get.info("friendgongli").isFriendOf(player, "friend_zhugeliang") ? 1 : 0;
			/*num += get
				.discarded()
				.map(c => get.suit(c))
				.unique().length;*/
			num += 4;
			const cards = get.cards(num, true);
			const next = player.addToExpansion(cards, "gain2");
			next.gaintag.add(event.name);
			await next;
			/*const next = game.cardsGotoOrdering(get.cards(num));
			await next;
			let cards = next.cards;
			await player.showCards(cards, get.translation(player) + "发动了【" + get.translation(event.name) + "】");*/
			while (cards.some(card => player.hasUseTarget(card, true, false))) {
				const result2 = await player
					.chooseCardButton(cards, "养名：请选择要使用的牌")
					.set("filterButton", button => {
						const card = button.link;
						return get.player().hasUseTarget(card, true, false);
					})
					.set("ai", button => {
						return get.player().getUseValue(button.link, true, false);
					})
					.forResult();
				if (result2.bool) {
					const card = result2.links[0];
					player.$gain2(card, false);
					await game.delayx();
					const result3 = await player.chooseUseTarget(card, true, false).forResult();
					if (result3.bool) {
						cards.removeArray(cards.filter(cardx => get.suit(cardx) === get.suit(card)));
						continue;
					} else {
						break;
					}
				} else {
					break;
				}
			}
			if (player.hasSkill("friendpangtonggongli") && get.info("friendgongli").isFriendOf(player, "friend_xushu") && cards.length) {
				const result = await player
					.chooseCardButton(cards, "养名：是否获得其中一张牌？")
					.set("ai", button => get.value(button.link))
					.forResult();
				if (result.bool) {
					await player.gain(result.links, "gain2");
				}
			}
			await player.loseToDiscardpile(player.getExpansions(event.name));
		},
		intro: {
			markcount: "expansion",
			content: "expansion",
		},
		//group: "friendyangming_check",
		subSkill: {
			mark: {
				charlotte: true,
				onremove: true,
			},
			check: {
				charlotte: true,
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (!player.isPhaseUsing() || player.countCards("h")) {
						return false;
					}
					const storage = player.getStorage("friendyangming_mark");
					return !storage.includes(event.getParent("phaseUse")) && event.getl(player)?.cards2?.length > 0;
				},
				silent: true,
				async content(event, trigger, player) {
					player.addTempSkill("friendyangming_mark");
					player.markAuto("friendyangming_mark", [trigger.getParent("phaseUse")]);
				},
			},
		},
	},
	friendpangtonggongli: {
		audio: 2,
		locked: true,
		ai: { combo: "friendyangming" },
	},
	//牢又寄 —— 徐庶
	friendxiaxing: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			if (event.name === "phase") {
				return game.phaseNumber === 0;
			}
			return true;
		},
		forced: true,
		locked: true,
		async content(event, trigger, player) {
			const card = game.createCard2("xuanjian", "spade", 9);
			await player.gain([card], "gain2");
			await player.chooseUseTarget(card, true, false);
		},
		group: "friendxiaxing_gain",
		subSkill: {
			gain: {
				audio: "friendxiaxing",
				trigger: { global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"] },
				filter(event, player) {
					if (player.getStorage("friendqihui").length < 2) {
						return false;
					}
					return event.getd()?.some(i => i.name == "xuanjian");
				},
				async cost(event, trigger, player) {
					const storage = player
						.getStorage("friendqihui")
						.sort((a, b) => b.indexOf("c") - a.indexOf("c"))
						.map(i => `caoying_${i}`);
					const gains = trigger.getd().filter(i => i.name == "xuanjian");
					const { links, bool } = await player
						.chooseButton(
							[
								"###" +
									get.prompt("friendxiaxing") +
									'###<div class="text center">移去2枚“启诲”标记，获得' +
									get.translation(gains) +
									"</div>",
								[storage, "vcard"],
							],
							2
						)
						.set("ai", button => {
							const player = get.player(),
								type = button.link[2].slice(8);
							if (player.getVEquip("xuanjian")) {
								return 0;
							}
							return (
								1 +
								Math.random() +
								player.countCards("he", card => {
									return get.type2(card) === type && player.hasValueTarget(card);
								})
							);
						})
						.forResult();
					if (bool && links?.length) {
						event.result = {
							bool: bool,
							cost_data: links.map(i => i[2].slice(8)),
						};
					}
				},
				async content(event, trigger, player) {
					const skillName = "friendqihui";
					const storage = player.storage[skillName];
					player.unmarkAuto(skillName, event.cost_data);
					if (storage.length) {
						player.addTip(skillName, `${get.translation(skillName)} ${storage.map(i => get.translation(i)[0]).join("")}`);
					} else {
						player.removeTip(skillName);
					}
					await player.gain(
						trigger.getd().filter(i => i.name == "xuanjian"),
						"gain2"
					);
				},
			},
		},
	},
	friendqihui: {
		audio: 3,
		trigger: { player: "useCard" },
		filter(event, player) {
			const storage = player.getStorage("friendqihui");
			const type = get.type2(event.card);
			return get.numOf(storage, type) < (player.countMark("friendqihui_limit") || 1);
		},
		forced: true,
		async content(event, trigger, player) {
			const { name: skillName } = event;
			const type = get.type2(trigger.card);
			const storage = player.storage[skillName];
			storage.push(type);
			player.markSkill(skillName);
			player.addTip(skillName, `${get.translation(skillName)} ${storage.map(i => get.translation(i)[0]).join("")}`);
			if (storage.length >= 3) {
				const types = storage.sort((a, b) => b.indexOf("c") - a.indexOf("c")).map(i => `caoying_${i}`);
				const { links } = await player
					.chooseButton(["选择你要移去的“启诲”标记（移去3个标记上限+1）", [types, "vcard"]], [2, 3], true)
					.set("ai", button => {
						const player = get.player(),
							type = button.link[2].slice(8);
						return (
							1 +
							Math.random() +
							player.countCards("he", card => {
								return get.type2(card) === type && player.hasValueTarget(card);
							})
						);
					})
					.forResult();
				if (!links?.length) {
					return;
				}
				player.unmarkAuto(
					skillName,
					links.map(link => link[2].slice(8))
				);
				if (!storage.length) {
					player.removeTip(skillName);
				} else {
					player.addTip(skillName, `${get.translation(skillName)} ${storage.map(i => get.translation(i)[0]).join("")}`);
				}
				const result = await player
					.chooseButton(
						[
							"启诲：请执行一项",
							[
								[
									["recover", "回复1点体力"],
									["draw", "摸两张牌"],
									["use", "使用的下一张牌无任何次数限制"],
									["drawx", "令一名其他角色摸两张牌"],
								],
								"textbutton",
							],
						],
						true
					)
					.set("ai", button => {
						const player = get.player();
						if (button.link === "recover") {
							return get.recoverEffect(player, player, player);
						}
						if (button.link === "draw") {
							return get.effect(player, { name: "draw" }, player, player) * 2;
						}
						if (button.link === "drawx") {
							return Math.max(
								...game
									.filterPlayer(target => target != player)
									.map(target => get.effect(target, { name: "draw" }, player, player) * 2)
							);
						}
						return Math.max(
							...[0].concat(
								player
									.getCards("he", card => {
										return player.hasValueTarget(card, false);
									})
									.map(card => player.getUseValue(card, false))
							)
						);
					})
					.set("filterButton", button => {
						const player = get.player();
						if (button.link == "drawx") {
							return game.hasPlayer(target => target != player);
						}
						return button.link !== "recover" || player.isDamaged();
					})
					.forResult();
				if (result.bool) {
					switch (result.links[0]) {
						case "recover":
							await player.recover();
							break;
						case "draw":
							await player.draw(2);
							break;
						case "drawx": {
							const result = await player
								.chooseTarget(`启诲：令一名其他角色摸两张牌`, true, lib.filter.notMe)
								.set("ai", target => get.effect(target, { name: "draw" }, get.player(), get.player()))
								.forResult();
							const {
								targets: [target],
							} = result;
							if (target) {
								player.line(target);
								await target.draw(2);
							}
							break;
						}
						default:
							player.addSkill(skillName + "_unlimit");
					}
				}
				if (links.length == 3) {
					player.addMark(`${skillName}_limit`, 1, false);
				}
			}
		},
		init(player, skill) {
			if (!player.hasMark(`${skill}_limit`)) {
				player.addMark(`${skill}_limit`, 1, false);
			}
			player.setStorage(skill, [], true);
		},
		onremove(player, skill) {
			delete player.storage[skill];
			player.removeTip(skill);
		},
		intro: {
			content(storage, player, skill) {
				let str = `<li>标记上限：${player.countMark(`${skill}_limit`) || 1}`;
				str += `<br><li>标记：${get.translation(storage)}`;
				return str;
			},
		},
		subSkill: {
			unlimit: {
				charlotte: true,
				mod: { cardUsable: () => Infinity },
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						const stat = player.getStat().card,
							name = trigger.card.name;
						if (typeof stat[name] == "number") {
							stat[name]--;
						}
					}
				},
				mark: true,
				intro: { content: "使用的下一张牌无任何次数限制" },
			},
		},
	},
	friendxushugongli: {
		audio: 2,
		locked: true,
		ai: { combo: "friendxiaxing" },
	},
	xuanjian_skill: {
		equipSkill: true,
		enable: "chooseToUse",
		mod: {
			targetInRange(card, player) {
				const evt = get.event();
				if (
					player.hasSkill("friendxushugongli") &&
					get.info("friendgongli").isFriendOf(player, "friend_pangtong") &&
					evt.skill === "xuanjian_skill"
				) {
					return true;
				}
			},
		},
		viewAs: {
			name: "sha",
		},
		filterCard(card) {
			if (ui.selected.cards.length) {
				return get.suit(card) === get.suit(ui.selected.cards[0]);
			}
			return true;
		},
		prompt() {
			return get.info({ name: "xuanjian" }).cardPrompt(null, get.player());
		},
		selectCard() {
			const player = get.player();
			if (ui.selected.cards.length) {
				if (!player.hasSkill("friendxushugongli") || !get.info("friendgongli").isFriendOf(player, "friend_zhugeliang")) {
					return -1;
				}
			}
			return 1;
		},
		ai: {
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				return arg !== "respond" && player.countCards("hs");
			},
		},
	},
	//牢又寄 —— 诸葛亮
	friendyance: {
		audio: 7,
		trigger: {
			global: "roundStart",
			player: "phaseZhunbeiBegin",
		},
		filter(event, player, name) {
			if (name == "roundStart") {
				return game.roundNumber === 1;
			}
			return true;
		},
		round: 1,
		popup: false,
		logAudio: index => (typeof index === "number" ? "friendyance" + index + ".mp3" : 1),
		async cost(event, trigger, player) {
			const result = await player
				.chooseButton([
					get.prompt2(event.skill),
					[
						[
							["trick", `从牌堆中随机获得一张锦囊牌`],
							["minigame", `执行“卧龙演策”`],
						],
						"textbutton",
					],
				])
				.set("filterButton", button => {
					if (button.link !== "minigame") {
						return true;
					}
					const player = get.player();
					return typeof player.storage.friendyance !== "number" || player.hasMark("friendyance");
				})
				.set("ai", button => (button.link == "minigame" ? 2 : 1))
				.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result,
			};
		},
		async content(event, trigger, player) {
			const {
				cost_data: {
					links: [choice],
				},
			} = event;
			player.logSkill("friendyance", null, null, null, [choice === "trick" ? null : get.rand(2, 3)]);
			if (choice === "trick") {
				const card = get.cardPile2(c => get.type2(c) === "trick");
				if (card) {
					await player.gain(card, "draw");
				} else {
					player.chat("一无所获");
				}
			} else {
				await lib.skill.friendyance.minigame(event, trigger, player);
			}
		},
		marktext: "策",
		intro: { content: "初始可预测#次" },
		async minigame(event, trigger, player) {
			await event.trigger("friendyance_minigameBegin");
			if (typeof player.storage.friendyance !== "number") {
				let bool = player.hasSkill("friendzhugelianggongli") && get.info("friendgongli").isFriendOf(player, "friend_pangtong");
				player.addMark("friendyance", 3 + bool, false);
			}
			const num = player.countMark("friendyance");
			if (!num) {
				return;
			}
			player.addSkill("friendyance_record");
			const storage = player.storage["friendyance_record"];
			const { control } = await player
				.chooseControl("颜色预测", "类型预测")
				.set("prompt", "卧龙演策：请选择预测方式")
				.set("ai", () => get.rand(0, 1))
				.forResult();
			const type = lib.inpile.map(c => get.type2(c)).unique();
			const color = Object.keys(lib.color);
			const list = [];
			if (control === "颜色预测") {
				list.addArray(color);
				storage[2] = "color";
			} else {
				list.addArray(type);
				storage[2] = "type2";
			}
			const dialog = ["卧龙演策：请进行你的预测"];
			for (const i of Array.from({ length: num }, (_, k) => k)) {
				const button = list.map(c => [`${c}_${i}`, get.translation(c)]);
				dialog.push(`<div class="text center">第${get.cnNumber(i + 1, true)}张牌的预测</div>`);
				dialog.push([button, "tdnodes"]);
			}
			const { links } = await player
				.chooseButton(dialog, get.select(num))
				.set("forced", true)
				.set("filterButton", button => {
					return parseInt(button.link.at(-1)) === ui.selected.buttons.length;
				})
				.set("ai", () => 1 + Math.random())
				.forResult();
			if (!links?.length) {
				return;
			}
			for (const i of links) {
				storage[1].push(i.replace(`_${i.at(-1)}`, ""));
			}
			storage[3] = links.length;
			await event.trigger("friendyance_minigame");
		},
		subSkill: {
			record: {
				charlotte: true,
				init(player, skill) {
					player.storage[skill] = [[], [], null, null, null]; //猜对与否、猜测、猜测类别、猜测次数、是否展示
				},
				onremove: true,
				mark: true,
				marktext: "阵",
				intro: {
					name: "卧龙演策",
					markcount: () => 0,
					content([trrList, gussList, type, num, show], player) {
						if (!show && !player.isUnderControl(true)) {
							return "天机可知却不可说...";
						}
						return [
							"剩余猜测：" + get.translation(gussList),
							"猜测进度：" +
								trrList
									.map(i => (i ? "正确" : "错误"))
									.concat(Array.from({ length: num - trrList.length }, () => "未知"))
									.join("、"),
						]
							.map(str => "<li>" + str)
							.join("<br>");
					},
				},
				mod: {
					aiOrder(player, card, num) {
						if (num > 0) {
							const storage = player.getStorage("friendyance_record");
							if (storage[0]?.length === storage[3]) {
								return;
							}
							if (
								player.hasSkill("friendzhugelianggongli") &&
								get.info("friendgongli").isFriendOf(player, "friend_xushu") &&
								storage[0].length === 0
							) {
								return;
							}
							return get[storage[2]](card) === storage[1][storage[0].length] ? num + 1145141919810 : num * 0.00001;
						}
					},
				},
				group: "friendyance_check",
			},
			check: {
				charlotte: true,
				trigger: {
					global: "useCard",
					player: "friendyance_minigameBegin",
				},
				filter(event, player) {
					const storage = player.getStorage("friendyance_record");
					return event.name !== "useCard" || storage[0].length < storage[3];
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const storage = player.getStorage("friendyance_record");
					const num = trigger.name === "useCard" && storage[4] ? 1 : 0;
					if (trigger.name === "useCard") {
						const i = storage[1][storage[0].length];
						if (
							get[storage[2]](trigger.card) === i ||
							(player.hasSkill("friendzhugelianggongli") &&
								get.info("friendgongli").isFriendOf(player, "friend_xushu") &&
								storage[0].length === 0)
						) {
							player.popup("预测正确", "wood");
							game.log(player, "预测", "#y正确");
							storage[0].push(true);
							if (storage[0].filter(b => b === true).length <= 5) {
								await player.draw("nodelay");
							}
						} else {
							player.popup("预测错误", "fire");
							game.log(player, "预测", "#r错误");
							storage[0].push(false);
						}
					}
					if (trigger.name !== "useCard" || storage[0].length === storage[3]) {
						const trueArr = storage[0].filter(b => b === true);
						if (trueArr.length === 0) {
							player.logSkill("friendyance", null, null, null, [4]);
							await player.loseHp(1 + num);
							player.removeMark("friendyance", 1 + num, false);
						}
						if (trueArr.length * 2 < storage[3]) {
							if (trueArr.length !== 0) {
								player.logSkill("friendyance", null, null, null, [5]);
							}
							if (player.hasCard(card => lib.filter.cardDiscardable(card, player), "he")) {
								await player.chooseToDiscard(1 + num, "he", true);
							}
						} else {
							player.logSkill("friendyance", null, null, null, [trueArr.length === storage[3] ? 7 : 6]);
							const choice = storage[2] == "color" ? Object.keys(lib.color) : lib.inpile.map(name => get.type2(name)).unique();
							const control =
								choice.length > 1
									? (
											await player
												.chooseControl(choice)
												.set("ai", () => {
													return get.event().controls.remove("none").randomGet();
												})
												.set("prompt", `请选择获得牌的条件`)
												.forResult()
										).control
									: choice[0];
							let gains = [];
							while (gains.length < 1 + num) {
								const card = get.cardPile2(card => {
									if (gains.includes(card)) {
										return false;
									}
									return get[storage[2]](card) === control;
								});
								if (card) {
									gains.push(card);
								} else {
									break;
								}
							}
							if (gains.length) {
								await player.gain(gains, "draw");
							} else {
								player.chat("一无所获");
							}
							if (trueArr.length === storage[3]) {
								await player.draw(2 + num);
								if (player.countMark("friendyance") < 7) {
									player.addMark("friendyance", Math.min(7 - player.countMark("friendyance"), 1 + num), false);
								}
								if (storage[4] && storage[3] >= 3) {
									player.restoreSkill("friendfangqiu");
								}
							}
						}
						player.removeSkill("friendyance_record");
					}
				},
			},
		},
	},
	friendfangqiu: {
		audio: 3,
		limited: true,
		trigger: { player: "friendyance_minigame" },
		check(event, player) {
			return event.player === player;
		},
		skillAnimation: true,
		animationColor: "metal",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const storage = player.getStorage("friendyance_record");
			storage[4] = true;
			player.popup(storage[1]);
			game.log(player, "的预测为", "#g" + get.translation(storage[1]));
		},
		ai: { combo: "friendyance" },
	},
	friendzhugelianggongli: {
		audio: 2,
		locked: true,
		ai: { combo: "friendyance" },
	},
	//共励
	friendgongli: {
		audio: 2,
		isFriendOf(player, name) {
			return player.getFriends(true).some(target => {
				if (target.identityShown === false) {
					return false;
				}
				return get.is.playerNames(target, name);
			});
		},
	},
	//手杀薛综
	mbfunan: {
		audio: "funan",
		trigger: {
			global: ["respond", "useCard"],
		},
		filter(event, player) {
			if (!event.respondTo) {
				return false;
			}
			if (event.player == player) {
				return false;
			}
			if (player != event.respondTo[0]) {
				return false;
			}
			return event.cards.filterInD("od").length > 0;
		},
		check(event, player) {
			return event.cards.filterInD("od").reduce((acc, card) => {
				return acc + get.value(card);
			}, 0);
		},
		frequent: true,
		logTarget: "player",
		async content(event, trigger, player) {
			if (player.storage.mbfunan_rewrite) {
				const cards = trigger.cards.filterInD("od");
				const next = player.gain(cards, "log", "gain2");
				next.gaintag.add("mbfunan");
			} else {
				const cards = trigger.cards.filterInD("od");
				await player.gain(cards, "log", "gain2");
			}
		},
		group: "mbfunan_check",
		subSkill: {
			rewrite: {
				charlotte: true,
				init: (player, skill) => (player.storage[skill] = true),
			},
			check: {
				silent: true,
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					if (
						!player.hasHistory("lose", function (evt) {
							const evtx = evt.relatedEvent || evt.getParent();
							if (evtx != event) {
								return false;
							}
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("mbfunan")) {
									return true;
								}
							}
							return false;
						})
					) {
						return false;
					}
					return !game.hasPlayer2(function (current) {
						return (
							current != player &&
							(current.hasHistory("useCard", function (evt) {
								if (!evt.respondTo) {
									return true;
								}
								return evt.respondTo && evt.respondTo[1] == event.card;
							}) ||
								current.hasHistory("respond", function (evt) {
									if (!evt.respondTo) {
										return true;
									}
									return evt.respondTo && evt.respondTo[1] == event.card;
								}))
						);
					});
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
	},
	mbjiexun: {
		audio: "jiexun",
		trigger: {
			player: "phaseJieshuBegin",
		},
		async cost(event, trigger, player) {
			const suits = {};
			game.countPlayer(current => {
				for (const card of current.getCards("ej")) {
					if (typeof suits[get.suit(card)] != "number") {
						suits[get.suit(card)] = 0;
					}
					suits[get.suit(card)]++;
				}
			});
			const choices = lib.suit.slice();
			const str = lib.suit
				.map(suit => {
					return get.translation(suit) + "：" + get.cnNumber(suits[suit] || 0) + "张";
				})
				.join("；");
			const result = await player
				.chooseControl(choices, "cancel2")
				.set("prompt", `${get.prompt(event.skill)}（本次弃置${get.cnNumber(player.countMark("mbjiexun_used") + 1)}张）`)
				.set("prompt2", `${get.skillInfoTranslation(event.skill, player, false)}<br>${str}`)
				.set("ai", () => {
					const player = get.player(),
						map = get.event().map;
					for (const suit in map) {
						map[suit] = Math.abs(map[suit]);
					}
					const bool = game.hasPlayer(current => get.attitude(player, current) > 0 && player != current);
					const list = lib.suit.slice().sort((a, b) => (bool ? 1 : -1) * ((map[b] || 0) - (map[a] || 0)));
					if ((bool && map[list[0]] > 0) || !bool) {
						return list[0];
					}
					return "cancel2";
				})
				.set("map", suits)
				.forResult();
			if (result.control != "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.control,
				};
			}
		},
		async content(event, trigger, player) {
			const { cost_data } = event;
			let num1 = 0;
			player.addSkill("mbjiexun_used");
			player.addMark("mbjiexun_used", 1, false);
			game.filterPlayer().forEach(p => {
				num1 += p.countCards("ej", function (card) {
					return get.suit(card) == cost_data;
				});
			});
			const num2 = player.countMark("mbjiexun_used");
			const { targets } = await player
				.chooseTarget(`诫训：令一名其他角色摸${num1}张牌然后弃置${num2}张牌`, lib.filter.notMe, true)
				.set("ai", function (target) {
					const player = get.player(),
						att = get.attitude(player, target);
					return get.event().eff * get.sgn(att) + att / 114514;
				})
				.set("eff", num1 >= num2 && num1 > 0 ? 1 : -1)
				.forResult();
			if (targets?.length) {
				const [target] = targets;
				player.line(target);
				await target.draw(num1);
				await target.chooseToDiscard("he", true, num2);
				if (target.countCards("h") === 0) {
					player.addSkill("mbfunan_rewrite");
				}
			}
		},
		subSkill: {
			used: {
				init(player, skill) {
					player.storage[skill] = 0;
				},
			},
		},
	},
	// SP甘夫人
	mbzhijie: {
		audio: 2,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player.countCards("h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.choosePlayerCard(trigger.player, "h", get.prompt2(event.name.slice(0, -5)))
				.set("ai", button => {
					//小透不算透---by @xizifu
					const { player, target } = get.event(),
						att = get.attitude(player, target),
						type = get.type2(button.link);
					if (att === 0) {
						return 0;
					}
					const cards = target.getCards("hs", card => get.type2(card) === type && target.hasValueTarget(card));
					return (cards.length > 0) ^ (att < 0)
						? (() => {
								if (att < 0) {
									return 1 + Math.random();
								}
								return Math.max(...cards.map(card => target.getUseValue(card)));
							})()
						: -1;
				})
				.forResult();
		},
		round: 1,
		logTarget: "player",
		async content(event, trigger, player) {
			const { cards, name } = event,
				{ player: target } = trigger;
			await player.showCards(cards, get.translation(player) + "对" + get.translation(target) + "发动了【智诫】");
			target.addTempSkill(name + "_effect", "phaseUseAfter");
			target.markAuto(name + "_effect", [[player, get.type2(cards[0])]]);
		},
		subSkill: {
			effect: {
				mod: {
					aiOrder(player, card, num) {
						if (num > 0) {
							return num + 1.5 * (player.getStorage("mbzhijie_effect").some(list => list[1] == get.type2(card)) ? 1 : -1);
						}
					},
				},
				charlotte: true,
				onremove: true,
				intro: {
					content(storage, player) {
						const infos = [];
						for (let i = 0; i < storage.length; i++) {
							const list = storage[i];
							infos.add(
								`本阶段使用${get.translation(list[1])}牌后摸一张牌并弃置本回合使用此牌类型牌的次数-1张牌；本阶段结束时，若因此获得的牌数大于因此弃置的牌数，则与${get.translation(list[0])}各摸一张牌`
							);
						}
						return infos.join("<br>");
					},
				},
				audio: "mbzhijie",
				trigger: { player: ["useCardAfter", "phaseUseEnd"] },
				filter(event, player) {
					const skillName = "mbzhijie_effect",
						storage = player.getStorage(skillName);
					if (event.name == "useCard") {
						return storage.some(list => list[1] == get.type2(event.card));
					}
					const num1 = player
							.getHistory("gain", evt => evt.getParent(2).name == skillName && evt.getParent(event.name) == event)
							.reduce((sum, evt) => sum + evt.cards.length, 0),
						num2 = player
							.getHistory("lose", evt => evt.getParent(3).name == skillName && evt.getParent(event.name) == event)
							.reduce((sum, evt) => sum + evt.cards2.length, 0);
					return num1 > num2 && storage.some(list => list[0].isIn());
				},
				forced: true,
				async content(event, trigger, player) {
					const { name, card } = trigger;
					if (name == "useCard") {
						await player.draw();
						const num = player.getHistory(name, evt => get.type2(evt.card) == get.type2(card)).length - 1;
						if (player.countCards("he") && num) {
							await player.chooseToDiscard("he", true, num);
						}
					} else {
						const targets = player
							.getStorage(event.name)
							.map(list => list[0])
							.filter(i => i.isIn())
							.sortBySeat();
						await game.asyncDraw([player].concat(targets));
					}
				},
			},
		},
	},
	mbshushen: {
		audio: 2,
		trigger: {
			player: ["gainAfter", "recoverBegin"],
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			const name = event.name != "recover" ? "gain" : "recover";
			if (player.getStorage("mbshushen_used").includes(name)) {
				return false;
			}
			if (event.name == "recover") {
				return game.hasPlayer(current => player != current);
			}
			return event.getg(player).length >= 2 && game.hasPlayer(current => player != current && current.isDamaged());
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt(event.name.slice(0, -5)),
					`令一名其他角色${trigger.name == "recover" ? `摸两张牌` : `回复1点体力`}`,
					(card, player, target) => {
						if (player == target) {
							return false;
						}
						return get.event().getTrigger().name == "recover" || target.isDamaged();
					}
				)
				.set("ai", target => {
					const player = get.player();
					if (get.event().getTrigger().name == "recover") {
						return get.effect(target, { name: "draw" }, player, player) * 2;
					}
					return get.recoverEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const name = trigger.name != "recover" ? "gain" : "recover";
			player.addTempSkill(event.name + "_used");
			player.markAuto(event.name + "_used", [name]);
			const target = event.targets[0];
			if (trigger.name != "recover") {
				await target.recover();
			} else {
				await target.draw(2);
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//SP甄宓
	mbbojian: {
		audio: 2,
		init(player) {
			player.addSkill("mbbojian_record");
		},
		trigger: {
			player: "phaseUseEnd",
		},
		filter(event, player) {
			const record = _status.mbbojian;
			if (!record || !record[player.playerid]) {
				return false;
			}
			const history = player.getHistory("useCard", evt => evt.getParent("phaseUse", true));
			const num1 = history.length,
				num2 = history.map(evt => get.suit(evt.card)).toUniqued().length,
				cards = history.reduce((list, evt) => list.addArray(evt.cards.filterInD("d")), []);
			return (num1 != record[player.playerid][0] && num2 != record[player.playerid][1]) || cards.length;
		},
		forced: true,
		async content(event, trigger, player) {
			const record = _status.mbbojian;
			const history = player.getHistory("useCard", evt => evt.getParent("phaseUse", true));
			const num1 = history.length,
				num2 = history.map(evt => get.suit(evt.card)).toUniqued().length,
				cards = history.reduce((list, evt) => list.addArray(evt.cards.filterInD("d")), []);
			if (num1 != record[player.playerid][0] && num2 != record[player.playerid][1]) {
				await player.draw();
			} else {
				const links =
					cards.length == 1
						? cards
						: (
								await player
									.chooseButton(["博鉴：请选择要分配的牌", cards], true)
									.set("ai", button => {
										return get.value(button.link);
									})
									.forResult()
							).links;
				const togive = links[0];
				const result = await player
					.chooseTarget("选择获得" + get.translation(togive) + "的角色", true)
					.set("ai", target => {
						const player = get.player();
						return get.attitude(player, target);
					})
					.forResult();
				if (result.bool) {
					await result.targets[0].gain(togive, "gain2");
				}
			}
		},
		subSkill: {
			record: {
				trigger: {
					player: "phaseUseAfter",
				},
				firstDo: true,
				charlotte: true,
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const history = player.getHistory("useCard", evt => evt.getParent("phaseUse", true));
					const num1 = history.length,
						num2 = history.map(evt => get.suit(evt.card)).toUniqued().length;
					if (!_status.mbbojian) {
						_status.mbbojian = {};
					}
					_status.mbbojian[player.playerid] = [num1, num2];
					player.markSkill(event.name);
				},
				intro: {
					markcount: () => 0,
					content(storage, player) {
						const record = _status.mbbojian;
						if (!record || !record[player.playerid]) {
							return "无信息";
						}
						return "上个出牌阶段使用牌情况：①牌数：" + record[player.playerid][0] + "；②花色数：" + record[player.playerid][1];
					},
				},
			},
		},
	},
	mbjiwei: {
		audio: 4,
		getNum(event, player) {
			let num = 0;
			if (game.countPlayer2(current => current.hasHistory("lose")) >= 1) {
				num++;
			}
			if (game.countPlayer2(current => current.hasHistory("damage")) >= 1) {
				switch (get.mode()) {
					case "doudizhu": {
						num += 2;
						break;
					}
					case "identity":
						break;
					default: {
						num++;
						break;
					}
				}
			}
			if (event.name == "phase") {
				return num;
			}
			if (get.mode() == "identity") {
				return Math.max(game.countPlayer(), player.getHp());
			}
			if (game.hasPlayer2(current => !current.isAlive())) {
				return 114514;
			}
			return 5;
		},
		trigger: {
			player: "phaseZhunbeiBegin",
			global: "phaseEnd",
		},
		filter(event, player) {
			const num = get.info("mbjiwei").getNum(event, player);
			if (event.name == "phaseZhunbei") {
				return player.countCards("h") >= num && game.hasPlayer(current => current != player);
			}
			return event.player != player && num > 0;
		},
		logAudio(event, player) {
			if (event.name == "phaseZhunbei") {
				return ["mbjiwei3.mp3", "mbjiwei4.mp3"];
			}
			return ["mbjiwei1.mp3", "mbjiwei2.mp3"];
		},
		forced: true,
		async content(event, trigger, player) {
			const num = get.info(event.name).getNum(trigger, player);
			if (trigger.name == "phase") {
				await player.draw(num);
			} else {
				const cards = player.getCards("h"),
					map = {};
				for (let color of ["red", "black", "none"]) {
					if (typeof map[color] != "number") {
						map[color] = 0;
					}
					map[color] += cards.filter(card => get.color(card) == color).length;
				}
				const list = [];
				for (var i in map) {
					if (map[i] > 0) {
						list.push([`${i}2`, map[i]]);
					}
				}
				list.sort((a, b) => b[1] - a[1]);
				let colors = list.filter(i => i[1] == list[0][1]).map(i => i[0]);
				const control =
					colors.length == 1 ? colors[0] : (await player.chooseControl(colors).set("prompt", "济危：请选择一个颜色").forResult()).control;
				let togive = player.getCards("h").filter(card => get.color(card) == control.slice(0, -1));
				if (_status.connectMode) {
					game.broadcastAll(() => (_status.noclearcountdown = true));
				}
				let given_map = [];
				while (
					togive.length &&
					game.hasPlayer(current => current != player) &&
					player.hasCard(card => !card.hasGaintag("olsujian_given"), "h")
				) {
					const result = await player
						.chooseCardTarget({
							forced: true,
							filterCard(card, player) {
								return get.event().togive.includes(card) && !card.hasGaintag("olsujian_given");
							},
							selectCard: [1, Infinity],
							position: "h",
							filterTarget: lib.filter.notMe,
							prompt: "济危：请选择要分配的卡牌和目标",
							ai1(card) {
								return !ui.selected.cards.length && card.name == "du" ? 1 : 0;
							},
							ai2(target) {
								const player = get.event().player;
								const card = ui.selected.cards[0];
								if (card) {
									return get.value(card, target) * get.attitude(player, target);
								}
								return 0;
							},
							togive: togive,
							allowChooseAll: true,
						})
						.forResult();
					if (result?.cards?.length && result.targets?.length) {
						const {
							cards,
							targets: [target],
						} = result;
						togive.removeArray(cards);
						if (given_map.some(i => i[0] == target)) {
							given_map[given_map.indexOf(given_map.find(i => i[0] == target))][1].addArray(cards);
						} else {
							given_map.push([target, cards]);
						}
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
				if (given_map.length) {
					await game
						.loseAsync({
							gain_list: given_map,
							player: player,
							cards: given_map.slice().flatMap(list => list[1]),
							giver: player,
							animate: "giveAuto",
						})
						.setContent("gaincardMultiple");
				}
			}
		},
	},
	//张奋
	mbquchong: {
		audio: 4,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			if (
				!game.hasPlayer(target => {
					return target.hasCard(card => card.name.startsWith("dagongche_"), "e");
				})
			) {
				const num = player.getAllHistory("custom", evt => evt.name == "mbquchong").length;
				const list = /*get.mode() == "identity" ? [0, 5, 10, 10] : */ [0, 2, 5, 5];
				return num < 4 && player.countMark("mbquchong") >= list[num];
			}
			return player.canMoveCard(
				null,
				true,
				game.filterPlayer(target => {
					return target.hasCard(card => card.name.startsWith("dagongche_"), "e");
				}),
				(card, player) => {
					return card.name.startsWith("dagongche_");
				},
				"canReplace"
			);
		},
		mod: {
			aiValue(player, card, num) {
				if (!player.countCards(cardx => cardx.name.startsWith("dagongche_"), "e")) {
					return num;
				}
				if (card.name.startsWith("dagongche_")) {
					return num;
				}
				if (get.type(card) == "equip" && num > 0) {
					return 0.3;
				}
			},
		},
		locked: false,
		direct: true,
		logAudio: index => (typeof index === "number" ? "mbquchong" + index + ".mp3" : 4),
		async content(event, trigger, player) {
			if (
				game.hasPlayer(target => {
					return target.hasCard(card => card.name.startsWith("dagongche_"), "e");
				})
			) {
				await player
					.moveCard(
						get.prompt("mbquchong"),
						"移动场上的一张【大攻车】",
						(card, player) => {
							return card.name.startsWith("dagongche_");
						},
						game.filterPlayer(target => {
							return target.hasCard(card => card.name.startsWith("dagongche_"), "e");
						}),
						"canReplace"
					)
					.set("nojudge", true)
					.set("logSkill", ["mbquchong", null, null, null, [4]]);
			} else {
				const numbers = Array.from({ length: 13 }).map((_, i) => get.strNumber(i + 1));
				const list = /*get.mode() == "identity" ? [0, 5, 10, 10] : */ [0, 2, 5, 5];
				const costMark = list[player.getAllHistory("custom", evt => evt.name == "mbquchong").length];
				const result = await player
					.chooseButton(
						[
							"###" +
								get.prompt("mbquchong") +
								'###<div class="text center">消耗' +
								parseFloat(costMark) +
								"点铸造值，制造任意花色和点数的【大攻车·攻】或【大攻车·守】</div>",
							[["dagongche_attack", "dagongche_defend"].map(i => [i, get.translation(i)]), "tdnodes"],
							[
								lib.suit
									.slice()
									.reverse()
									.map(i => [i, get.translation(i)]),
								"tdnodes",
							],
							[numbers, "tdnodes"],
						],
						3
					)
					.set("filterButton", button => {
						return !ui.selected.buttons.some(but => {
							return [["dagongche_attack", "dagongche_defend"], lib.suit, get.event().numbers].some(
								list => list.includes(but.link) && list.includes(button.link)
							);
						});
					})
					.set("numbers", numbers)
					.set("ai", () => 1 + Math.random())
					.forResult(); //插眼，PZ157
				if (result.bool) {
					const equips = result.links.sort((a, b) => {
						return lib.suit.includes(a) + (numbers.includes(a) ? 2 : 0) - (lib.suit.includes(b) + (numbers.includes(b) ? 2 : 0));
					});
					const card = game.createCard(equips[0], equips[1], get.numString(equips[2]));
					if (!card.storage) {
						card.storage = {};
					}
					if (typeof card.storage.mbquchong != "number") {
						card.storage.mbquchong = card.name == "dagongche_attack" ? 2 : 3;
					}
					lib.skill.mbquchong.broadcast(card);
					const resultx = await player
						.chooseTarget("令一名角色获得" + get.translation(card) + "并使用之", true)
						.set("ai", target => {
							const player = get.event().player,
								att = get.attitude(player, target);
							if (!target.canEquip(get.event().card)) {
								return att;
							}
							return att * (2.5 - target.countCards("e"));
						})
						.set("card", card)
						.forResult();
					if (resultx.bool) {
						const target = resultx.targets[0];
						player.logSkill("mbquchong", target, null, null, [card.name == "dagongche_attack" ? 3 : 2]);
						if (costMark > 0) {
							player.removeMark("mbquchong", costMark);
						}
						player.getHistory("custom").push({ name: "mbquchong" });
						await target.gain(card, "gain2");
						if (get.position(card) == "h" && get.owner(card) == target && target.hasUseTarget(card)) {
							await target.chooseUseTarget(card, "nopopup", false, true);
						}
					}
				}
			}
		},
		broadcast(card) {
			game.broadcast(
				(card, storage) => {
					card.storage = storage;
				},
				card,
				card.storage
			);
		},
		marktext: "铸",
		intro: {
			name: "铸造点",
			content: "当前拥有#铸造点",
		},
		group: ["mbquchong_recast", "mbquchong_remove"],
		derivation: ["dagongche_attack", "dagongche_defend"],
		subSkill: {
			recast: {
				audio: "mbquchong1.mp3",
				inherit: "drlt_huairou",
			},
			remove: {
				audio: "mbquchong1.mp3",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return get.discardPile(i => get.type(i, false) == "equip");
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const cards = Array.from(ui.discardPile.childNodes).filter(i => get.type(i, false) == "equip");
					await game.cardsGotoSpecial(cards);
					await player.showCards(cards, get.translation(player) + "发动了【渠冲】");
					game.log(cards, "被移出了游戏");
					player.addMark("mbquchong", cards.length);
				},
			},
			effect: {
				equipSkill: true,
				trigger: {
					player: ["loseBefore", "mbquchongOnRemove", "equipBefore", "equipAfter"],
				},
				filter(event, player, name) {
					if (name == "mbquchongOnRemove") {
						return player.hasCard(card => card.name.startsWith("dagongche_") && card.storage?.mbquchong <= 0, "e");
					}
					if (event.name == "equip") {
						if (name == "equipBefore") {
							return true;
						}
						if (!event.card.name.startsWith("dagongche_")) {
							return false;
						}
						return player.hasCard(card => {
							return !event.cards.includes(card) && lib.filter.cardDiscardable(card, player);
						}, "e");
					}
					if (event.getParent(2).name == "disableEquip") {
						return false;
					}
					if (event.getParent(3).name == "mbquchong" || event.getParent(3).name == "mbquchong_recast") {
						return false;
					}
					return player.hasCard(card => {
						if (!event.cards.includes(card)) {
							return false;
						}
						return card.name.startsWith("dagongche_") && card.storage?.mbquchong > 0;
					}, "e");
				},
				forced: true,
				async content(event, trigger, player) {
					if (event.triggername == "mbquchongOnRemove") {
						const cards = player.getCards("e", card => card.name.startsWith("dagongche_") && card.storage?.mbquchong <= 0);
						await player.lose(cards, ui.special);
						for (const card of cards) {
							card.fix();
							card.remove();
							card.destroyed = true;
						}
						game.log(cards, "被移出了游戏");
					} else if (trigger.name == "equip") {
						if (event.triggername == "equipBefore") {
							trigger.cancel();
						} else {
							await player.discard(
								player.getCards("e", card => {
									return !trigger.cards.includes(card) && lib.filter.cardDiscardable(card, player);
								})
							);
						}
					} else {
						const cards = player.getCards("e", card => {
							if (!trigger.cards.includes(card)) {
								return false;
							}
							return card.name.startsWith("dagongche_") && card.storage?.mbquchong > 0;
						});
						trigger.cards.removeArray(cards);
						for (const card of cards) {
							card.storage.mbquchong--;
							game.log(card, "减少了", "#y1点", "#g耐久值");
							lib.skill.mbquchong.broadcast(card);
						}
						await event.trigger("mbquchongOnRemove");
					}
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (!target.hasCard(card => card.name.startsWith("dagongche_"), "e")) {
								return;
							}
							if (player == target && get.type(card) == "equip") {
								return 0;
							}
						},
					},
				},
			},
		},
	},
	dagongche_attack_skill: {
		equipSkill: true,
		trigger: { source: "damageBegin3" },
		filter(event, player) {
			if (
				!player.hasCard(card => {
					return card.name == "dagongche_attack" && card.storage?.mbquchong > 0;
				}, "e")
			) {
				return false;
			}
			return game.roundNumber > 0;
		},
		logTarget: "player",
		prompt2(event, player) {
			return "令对" + get.translation(event.player) + "造成的伤害+" + parseFloat(Math.min(3, game.roundNumber));
		},
		check(event, player) {
			return get.damageEffect(event.player, player, player) > 0;
		},
		async content(event, trigger, player) {
			trigger.num += Math.min(3, game.roundNumber);
			const cards = player.getCards("e", card => {
				return card.name == "dagongche_attack" && card.storage?.mbquchong > 0;
			});
			for (const card of cards) {
				card.storage.mbquchong--;
				game.log(card, "减少了", "#y1点", "#g耐久值");
				lib.skill.mbquchong.broadcast(card);
			}
			await event.trigger("mbquchongOnRemove");
		},
	},
	dagongche_defend_skill: {
		equipSkill: true,
		trigger: { player: "damageBegin3" },
		filter(event, player) {
			if (
				!player.hasCard(card => {
					return card.name == "dagongche_defend" && card.storage?.mbquchong > 0;
				}, "e")
			) {
				return false;
			}
			return game.roundNumber > 0;
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const cards = player.getCards("e", card => {
				return card.name == "dagongche_defend" && card.storage?.mbquchong > 0;
			});
			for (const card of cards) {
				const num = Math.min(trigger.num, card.storage.mbquchong);
				trigger.num -= num;
				card.storage.mbquchong -= num;
				game.log(card, "减少了", "#y" + num + "点", "#g耐久值");
				lib.skill.mbquchong.broadcast(card);
				if (trigger.num <= 0) {
					break;
				}
			}
			await event.trigger("mbquchongOnRemove");
		},
	},
	mbxunjie: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			if (!event.source || event.source.getHp() <= player.getHp()) {
				return false;
			}
			return !game.hasPlayer(target => {
				return target.hasCard(card => card.name.startsWith("dagongche_"), "e");
			});
		},
		forced: true,
		logTarget: "source",
		async content(event, trigger, player) {
			const result = await player
				.judge(card => {
					return get.color(card) == "red" ? 2 : -2;
				})
				.set("judge2", result => Boolean(result.bool))
				.forResult();
			if (result.color == "red") {
				trigger.num--;
			}
		},
		ai: {
			combo: "mbquchong",
			effect: {
				target(card, player, target) {
					if (
						player.getHp() <= target.getHp() ||
						game.hasPlayer(current => {
							return current.hasCard(card => card.name.startsWith("dagongche_"), "e");
						})
					) {
						return;
					}
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					const num = get.tag(card, "damage");
					if (num) {
						if (num > 1) {
							return 0.55;
						}
						return 0.05;
					}
				},
			},
		},
	},
	//贾充
	mbbeini: {
		audio: "beini",
		inherit: "beini",
		filterTarget(card, player, target) {
			return target.hp >= player.hp && player != target;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const str = get.translation(target);
			const { index } = await player
				.chooseControl()
				.set("choiceList", [
					`摸两张牌，然后令${str}视为对自己使用【杀】或获得自己场上一张牌`,
					`令${str}摸两张牌，然后视为对其使用【杀】或获得其场上一张牌`,
				])
				.set("ai", () => {
					const evt = _status.event.getParent(),
						player = evt.player,
						target = evt.target;
					const card = { name: "sha", isCard: true },
						att = get.attitude(player, target) > 0;
					if (!target.canUse(card, player, false) || get.effect(player, card, target, player) >= 0) {
						return 0;
					}
					if (att && (!player.canUse(card, target, false) || get.effect(target, card, player, player) >= 0)) {
						return 1;
					}
					if (target.hasSkill("nogain") && player.canUse(card, target, false) && get.effect(target, card, player, player) > 0) {
						return 1;
					}
					if (player.hasShan()) {
						return 0;
					}
					if (att && target.hasShan()) {
						return 1;
					}
					return 0;
				})
				.forResult();
			const list = [player, target];
			if (index == 1) {
				list.reverse();
			}
			await list[0].draw(2);
			const sha = get.autoViewAs({ name: "sha", isCard: true });
			const choices = [];
			const choiceList = [`视为对${get.translation(list[0])}使用一张【杀】`, `弃置${get.translation(list[0])}场上一张牌`];
			if (list[1].canUse("sha", list[0], false)) {
				choices.push("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			}
			if (list[0].countGainableCards(list[1], "ej")) {
				choices.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			if (!choices.length) {
				return;
			}
			const control =
				choices.length == 1
					? choices[0]
					: (
							await list[1]
								.chooseControl(choices)
								.set("choiceList", choiceList)
								.set("prompt", "悖逆：请选择一项")
								.set("ai", () => {
									const player = get.player(),
										target = get.event().target;
									const eff2 = get.effect(target, { name: "sha" }, player, player),
										eff1 = get.effect(target, { name: "guohe_copy2" }, player, player);
									return eff1 > eff2 ? "选项一" : "选项二";
								})
								.set("target", list[0])
								.forResult()
						).control;
			if (control == "选项一") {
				await list[1].useCard(sha, list[0], false, "noai");
			} else {
				await list[1].gainPlayerCard(list[0], "ej", true);
			}
		},
	},
	mbdingfa: {
		audio: "dingfa",
		trigger: {
			player: "phaseDiscardAfter",
		},
		filter(event, player) {
			let num = 0;
			player.getHistory("lose", evt => {
				num += evt.cards2.length;
			});
			return num >= 3 && (player.isDamaged() || game.hasPlayer(current => current.countDiscardableCards(player, "he")));
		},
		async cost(event, trigger, player) {
			const choices = [];
			const choiceList = ["回复1点体力", "弃置一名角色至多两张牌"];
			if (player.isDamaged()) {
				choices.push("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			}
			if (game.hasPlayer(current => current.countDiscardableCards(player, "he"))) {
				choices.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			const { control } = await player
				.chooseControl(choices, "cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt(event.name.slice(0, -5)))
				.set("ai", () => {
					const player = get.player();
					const choices = get.event().controls.slice().remove("cancel2");
					const eff = get.recoverEffect(player, player, player);
					if (!game.hasPlayer(current => get.effect(current, { name: "guohe_copy2" }, player, player) > eff)) {
						choices.remove("选项二");
					} else if (choices.includes("选项二")) {
						return "选项二";
					}
					if (eff <= 0) {
						choices.remove("选项一");
					}
					if (!choices.length) {
						return "cancel2";
					}
					return choices.randomGet();
				})
				.forResult();
			event.result = {
				bool: control != "cancel2",
				cost_data: control,
			};
		},
		async content(event, trigger, player) {
			if (event.cost_data == "选项一") {
				await player.recover();
			} else {
				const { targets } = await player
					.chooseTarget(
						"选择一名角色弃置其至多两张牌",
						(card, player, target) => {
							return target.countDiscardableCards(player, "he");
						},
						true
					)
					.set("ai", target => {
						const player = get.player();
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					})
					.forResult();
				if (!targets || !targets.length) {
					return;
				}
				const target = targets[0];
				await player.discardPlayerCard(target, "he", true, [1, 2]);
			}
		},
	},
	//司马伷
	mbbifeng: {
		audio: 3,
		trigger: {
			target: "useCardToTarget",
			global: "useCardAfter",
		},
		filter(event, player, name) {
			if (name == "useCardAfter") {
				return player.getStorage("mbbifeng").includes(event.card);
			}
			if (event.targets && event.targets.length > 4) {
				return false;
			}
			return ["trick", "basic"].includes(get.type(event.card));
		},
		logAudio: index => (typeof index === "number" ? "mbbifeng" + index + ".mp3" : 3),
		async cost(event, trigger, player) {
			if (event.triggername == "useCardAfter") {
				event.result = { bool: true };
			} else {
				event.result = await player
					.chooseBool(get.prompt2(event.skill))
					.set("ai", () => get.event().bool)
					.set(
						"bool",
						(function () {
							let cancel = get.effect(player, trigger.card, trigger.player, player),
								name = trigger.card.name;
							if (get.effect(player, { name: "losehp" }, player, player) - cancel > 0) {
								return true;
							}
							if (2 * get.effect(player, { name: "draw" }, player, player) - cancel <= 0) {
								return false;
							}
							let targets = trigger.targets.filter(current => {
								return player !== current && get.effect(current, trigger.card, trigger.player, current) < 0;
							});
							if (name === "sha") {
								return targets.some(target => {
									return target.mayHaveShan(player, "use");
								});
							}
							if (name === "juedou" || name === "nanman") {
								return targets.some(target => {
									return target.mayHaveSha(player, "respond");
								});
							}
							/*if (name === "jiedao") return targets.some(target => {
						return target.mayHaveSha(player, "use");
					});*/
							if (name === "wanjian") {
								return targets.some(target => {
									return target.mayHaveShan(player, "respond");
								});
							}
							if (name === "qizhengxiangsheng") {
								return targets.some(target => {
									return target.mayHaveSha(player, "respond") || target.mayHaveShan(player, "respond");
								});
							}
							return false;
						})()
					)
					.forResult();
			}
		},
		popup: false,
		async content(event, trigger, player) {
			if (event.triggername == "useCardAfter") {
				player.unmarkAuto("mbbifeng", trigger.card);
				if (
					game.hasPlayer(current => {
						if (current == player) {
							return false;
						}
						let respondEvts = [];
						respondEvts.addArray(current.getHistory("useCard")).addArray(current.getHistory("respond"));
						respondEvts = respondEvts.filter(i => i.respondTo).map(evt => evt.respondTo);
						return respondEvts.some(list => {
							return list[1] == trigger.card;
						});
					})
				) {
					player.logSkill("mbbifeng", null, null, null, [3]);
					await player.draw(2);
				} else {
					player.logSkill("mbbifeng", null, null, null, [2]);
					await player.loseHp();
				}
			} else {
				player.logSkill("mbbifeng", null, null, null, [1]);
				trigger.getParent().excluded.add(player);
				player.markAuto("mbbifeng", trigger.card);
			}
		},
	},
	mbsuwang: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (player.getHistory("damage").length > 1 - ["identity", "doudizhu"].includes(get.mode())) {
				return false;
			}
			return event.player.hasHistory("useCard", evt => evt.targets && evt.targets.includes(player));
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.addToExpansion(get.cards(1), "draw").gaintag.add("mbsuwang");
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: "mbsuwang_draw",
		subSkill: {
			draw: {
				audio: "mbsuwang",
				trigger: { player: "phaseDrawBegin1" },
				filter(event, player) {
					return !event.numFixed && player.getExpansions("mbsuwang").length;
				},
				async cost(event, trigger, player) {
					const cards = player.getExpansions("mbsuwang");
					event.result = await player
						.chooseBool(get.prompt("mbsuwang"), "放弃摸牌并获得" + get.translation(cards))
						.set("choice", trigger.num <= cards.length)
						.forResult();
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions("mbsuwang");
					trigger.changeToZero();
					await player.gain(cards, "gain2");
					if (cards.length >= 0) {
						const result = await player
							.chooseTarget("是否令一名其他角色摸两张牌?", lib.filter.notMe)
							.set("ai", function (target) {
								return get.effect(target, { name: "draw" }, _status.event.player, _status.event.player);
							})
							.forResult();
						if (result.bool) {
							player.line(result.targets[0], "green");
							await result.targets[0].draw(2);
						}
					}
				},
			},
		},
	},
	//文钦
	mbbeiming: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.name.slice(0, -5)), "令至多两名角色获得武器牌", [1, 2])
				.set("ai", target => {
					return get.attitude(get.player(), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			for (const target of targets) {
				const suits = [];
				for (const card of target.getCards("h")) {
					suits.add(get.suit(card));
				}
				const equip = get.cardPile2(card => {
					if (get.subtype(card) != "equip1") {
						return false;
					}
					const info = get.info(card, false);
					if (!info) {
						return false;
					}
					if (!info.distance || typeof info.distance.attackFrom != "number") {
						return suits.length == 1;
					}
					return 1 - info.distance.attackFrom == suits.length;
				});
				if (equip) {
					await target.gain(equip, "gain2");
				}
			}
		},
	},
	mbchoumang: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		usable: 1,
		filter(event, player) {
			return event.card.name == "sha" && event.targets.length == 1;
		},
		async cost(event, trigger, player) {
			const list = ["选项一", "选项二"],
				target = event.triggername == "useCardToPlayered" ? trigger.target : trigger.player;
			if (player.getEquip(1) || target.getEquip(1)) {
				list.push("背水！");
			}
			list.push("cancel2");
			const result = await player
				.chooseControl(list)
				.set("choiceList", [
					"令此【杀】伤害+1",
					"若此【杀】被【闪】抵消，你可以获得与你距离为1以内的一名其他角色区域里的一张牌",
					"背水！弃置你与其装备区的武器牌并执行所有选项",
				])
				.set("prompt", get.prompt(event.skill))
				.set(
					"resultx",
					(function () {
						let eff = 0;
						for (const targetx of trigger.targets) {
							eff += get.effect(targetx, trigger.card, trigger.player, player);
						}
						const bool = game.hasPlayer(
							current =>
								player != current &&
								get.distance(player, current) <= 1 &&
								get.effect(current, { name: "shunshou_copy2" }, player, player) > 0
						);
						if (list.includes("背水！") && eff > 0 && bool) {
							return "背水！";
						}
						if (bool) {
							return "选项二";
						}
						if (eff > 0) {
							return "选项一";
						}
						return "cancel2";
					})()
				)
				.set("ai", function () {
					return _status.event.resultx;
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				targets: [target],
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			const result = event.cost_data,
				target = event.targets[0];
			if (result == "背水！") {
				const list = [];
				if (player.getEquips(1).length) {
					list.push([player, player.getEquips(1)]);
				}
				if (target.getEquips(1).length) {
					list.push([target, target.getEquips(1)]);
				}
				await game
					.loseAsync({
						lose_list: list,
						discarder: player,
					})
					.setContent("discardMultiple");
			}
			if (result != "选项二") {
				trigger.getParent().baseDamage++;
				await game.delay();
			}
			if (result != "选项一") {
				player.addTempSkill("mbchoumang_effect");
				player.markAuto("mbchoumang_effect", trigger.card);
			}
		},
		subSkill: {
			effect: {
				audio: "mbchoumang",
				trigger: {
					global: "shaMiss",
				},
				filter(event, player) {
					if (!player.getStorage("mbchoumang_effect").includes(event.card)) {
						return false;
					}
					return game.hasPlayer(current => player != current && get.distance(player, current) <= 1 && current.countCards("hej"));
				},
				charlotte: true,
				onremove: true,
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget("仇铓：是否获得与你距离为1以内的一名其他角色区域里的一张牌？", function (card, player, target) {
							return player != target && get.distance(player, target) <= 1 && target.countCards("hej");
						})
						.set("ai", function (target) {
							const player = _status.event.player;
							return get.effect(target, { name: "shunshou_copy2" }, player, player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					await player.gainPlayerCard(target, "hej", true);
					player.unmarkAuto("mbchoumang_effect", [trigger.card]);
					if (!player.getStorage("mbchoumang_effect").length) {
						player.removeSkill("mbchoumang_effect");
					}
				},
			},
		},
	},
	//张布
	mbchengxiong: {
		audio: 2,
		trigger: { player: "useCardToTargeted" },
		filter(event, player) {
			if (get.type2(event.card) !== "trick" || !event.isFirstTarget || event.targets.includes(player)) {
				return false;
			}
			const num = lib.skill.mbchengxiong.phaseUsed(event, player);
			return game.hasPlayer(current => current !== player && current.countCards("he") >= num);
		},
		phaseUsed(event, player) {
			let phase = null;
			for (let i of lib.phaseName) {
				if (event.getParent(i, true)) {
					phase = i;
					break;
				}
			}
			if (!phase) {
				return 0;
			}
			return player.getHistory("useCard", evt => evt.getParent(phase) == event.getParent(phase)).length;
		},
		async cost(event, trigger, player) {
			const num = lib.skill.mbchengxiong.phaseUsed(trigger, player);
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					const num = get.event().num;
					return target !== player && target.countCards("he") >= num;
				})
				.set("num", num)
				.set("color", get.color(trigger.card))
				.set("ai", function (target) {
					let player = get.player(),
						eff = get.effect(target, { name: "guohe_copy2" }, player, player);
					const color = get.event().color;
					if (target.getCards("e").some(card => get.color(card) == color)) {
						eff += get.damageEffect(target, player, player) / 2;
					}
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.discardPlayerCard("he", target, true)
				.set("ai", function (button) {
					let val = get.buttonValue(button);
					if (get.attitude(_status.event.player, get.owner(button.link)) > 0) {
						val *= -1;
					}
					if (get.position(button.link) == "e" && get.color(button.link) == get.event().color) {
						return (val *= 2);
					}
					return val;
				})
				.set("color", get.color(trigger.card))
				.forResult();
			if (result?.bool && get.color(result.links[0]) == get.color(trigger.card)) {
				await target.damage();
			}
		},
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (get.type2(card) == "trick") {
					return num + 10;
				}
			},
		},
	},
	mbwangzhuang: {
		audio: 2,
		trigger: { global: "damageEnd" },
		filter(event, player) {
			if (event.card) {
				return false;
			}
			return [event.source, event.player].includes(player);
		},
		logTarget(event, player) {
			return _status.currentPhase || player;
		},
		async content(event, trigger, player) {
			await player.draw();
			if (_status.currentPhase) {
				_status.currentPhase.addTempSkill("fengyin");
			}
		},
	},
	//王经
	mbzujin: {
		audio: 3,
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countCards("hse", card => get.type(card) == "basic")) {
				return false;
			}
			if (player.isDamaged()) {
				if (event.filterCard(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && !player.getStorage("mbzujin").includes("shan")) {
					return true;
				}
				if (event.filterCard(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && !player.getStorage("mbzujin").includes("wuxie")) {
					return true;
				}
			}
			if (!player.isDamaged() || !player.isMinHp()) {
				if (event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event) && !player.getStorage("mbzujin").includes("sha")) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				if (player.isDamaged()) {
					if (
						event.filterCard(get.autoViewAs({ name: "shan" }, "unsure"), player, event) &&
						!player.getStorage("mbzujin").includes("shan")
					) {
						list.push(["基本", "", "shan"]);
					}
					if (
						event.filterCard(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) &&
						!player.getStorage("mbzujin").includes("wuxie")
					) {
						list.push(["锦囊", "", "wuxie"]);
					}
				}
				if (!player.isDamaged() || (!player.isMinHp() && !player.getStorage("mbzujin").includes("sha"))) {
					if (event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event)) {
						list.push(["基本", "", "sha"]);
					}
				}
				return ui.create.dialog("阻进", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				var player = _status.event.player;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "mbzujin",
					filterCard: card => get.type(card) == "basic",
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					logAudio(event, player) {
						return "mbzujin" + (["sha", "shan", "wuxie"].indexOf(event.card.name) + 1) + ".mp3";
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						if (!player.storage.mbzujin) {
							player.storage.mbzujin = [];
							player.when({ global: "phaseEnd" }).step(async () => {
								delete player.storage.mbzujin;
							});
						}
						player.markAuto("mbzujin", [event.result.card.name]);
					},
				};
			},
			prompt(links, player) {
				return "将一张基本牌当做" + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			if (!player.countCards("she", card => get.type(card) == "basic")) {
				return false;
			}
			if (player.getStorage("mbzujin").includes(name)) {
				return false;
			}
			if (["shan", "wuxie"].includes(name)) {
				return player.isDamaged();
			}
			if (name == "sha") {
				return !player.isDamaged() || !player.isMinHp();
			}
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				if (!player.countCards("hse", card => get.type(card) == "basic")) {
					return false;
				}
				if (tag == "respondSha") {
					return (!player.isDamaged() || !player.isMinHp()) && !player.getStorage("mbzujin").includes("sha");
				}
				return player.isDamaged() && !player.getStorage("mbzujin").includes("shan");
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
		subSkill: { backup: {} },
	},
	mbjiejian: {
		audio: 3,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return player.countCards("h");
		},
		async cost(event, trigger, player) {
			if (_status.connectMode) {
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			}
			const give_map = {};
			let used = [];
			do {
				const result = await player
					.chooseCardTarget({
						filterCard(card) {
							return get.itemtype(card) == "card" && !card.hasGaintag("mbjiejian_tag");
						},
						filterTarget: lib.filter.notMe,
						selectCard: [1, Infinity],
						prompt: used.length ? "是否继续分配手牌？" : get.prompt(event.skill),
						prompt2: "将任意张手牌交给一名其他角色",
						allowChooseAll: true,
						ai1(card) {
							if (!ui.selected.cards.length) {
								return 8 - get.value(card);
							}
							return 0;
						},
						ai2(target) {
							let player = _status.event.player,
								card = ui.selected.cards[0];
							let val = get.value(card),
								att = get.attitude(player, target);
							if (val <= 4) {
								if (get.event().used.includes(target)) {
									return 0;
								}
								return 1 / target.getUseValue(card);
							}
							return att * (target.getUseValue(card) + 4);
						},
					})
					.set("used", used)
					.forResult();
				if (result?.bool && result.targets?.length) {
					const id = result.targets[0].playerid,
						map = give_map;
					if (!map[id]) {
						map[id] = [];
					}
					map[id].addArray(result.cards);
					player.addGaintag(result.cards, "mbjiejian_tag");
					used.addArray(result.targets);
				}
				break;
			} while (player.countCards("h"));
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			const list = [],
				targets = [];
			for (const i in give_map) {
				const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) {
					player.addExpose(0.2);
				}
				targets.push(source);
				list.push([source, give_map[i]]);
			}
			event.result = {
				bool: list.length > 0,
				targets: targets,
				cost_data: list,
			};
		},
		logAudio: () => 1,
		async content(event, trigger, player) {
			const list = event.cost_data;
			await game
				.loseAsync({
					gain_list: list,
					player: player,
					cards: list.map(i => i[1]).flat(),
					giver: player,
					animate: "giveAuto",
				})
				.setContent("gaincardMultiple");
			for (let target of event.targets) {
				let num = target.hp - target.countMark("mbjiejian_mark");
				target.addMark("mbjiejian_mark", num, false);
			}
		},
		group: ["mbjiejian_liuli", "mbjiejian_remove"],
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			liuli: {
				audio: "mbjiejian2.mp3",
				trigger: {
					global: "useCardToTarget",
				},
				filter(event, player) {
					if (event.player == player || get.type(event.card) == "equip") {
						return false;
					}
					if (!event.targets || event.targets.length != 1) {
						return false;
					}
					if (!event.targets[0].hasMark("mbjiejian_mark")) {
						return false;
					}
					return !player.getStorage("mbjiejian_used").includes(event.target);
				},
				prompt2: "将此牌转移给自己",
				check(event, player) {
					let eff1 = get.effect(player, event.card, event.player, player),
						eff2 = get.effect(event.targets[0], event.card, event.player, player);
					if (eff2 > 0) {
						eff2 *= 1.7;
					}
					return eff1 >= eff2;
				},
				logTarget: "target",
				async content(event, trigger, player) {
					player.addTempSkill("mbjiejian_used");
					player.markAuto("mbjiejian_used", event.targets);
					const evt = trigger.getParent();
					evt.triggeredTargets2.removeArray(event.targets);
					evt.targets.removeArray(event.targets);
					if (lib.filter.targetEnabled2(trigger.card, trigger.player, player)) {
						evt.targets.push(player);
					}
					await player.draw();
				},
			},
			remove: {
				audio: "mbjiejian3.mp3",
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				filter(event, player) {
					return event.player.hasMark("mbjiejian_mark");
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const target = event.targets[0],
						num = target.countMark("mbjiejian_mark");
					target.removeMark("mbjiejian_mark", num, false);
					if (target.hp >= num) {
						await player.draw(2);
					}
				},
			},
			mark: {
				intro: {
					content: "获得“节谏”时的体力值：$",
				},
			},
		},
	},
	//新司马孚
	mbpanxiang: {
		audio: 4,
		trigger: { global: "damageBegin3" },
		async cost(event, trigger, player) {
			const { player: target, source, card } = trigger;
			const [SUB, ADD] = ["减伤", "加伤"];
			const list = ["减伤", "加伤"].filter(text => text !== (player.storage[event.skill] || {})[target.playerid]);
			list.push("cancel2");
			let prompt = `${get.translation(target)}即将受到${source ? "来自" + get.translation(source) : "无来源"}的${trigger.num}点伤害，你可以选择一项：`;
			const choiceTexts = [
				`⒈令此伤害-1${source && source.isIn() ? "，" + get.translation(source) + "摸两张牌" : ""}；`,
				`⒉令此伤害+1，${get.translation(target)}摸三张牌。`,
			];
			if (!list.includes(SUB)) {
				choiceTexts[0] = `<span style="text-decoration: line-through;">${choiceTexts[0]}（上次选过）</span>`;
			}
			if (!list.includes(ADD)) {
				choiceTexts[1] = `<span style="text-decoration: line-through;">${choiceTexts[1]}（上次选过）</span>`;
			}
			choiceTexts.forEach(text => (prompt += text));
			const result = await player
				.chooseControl(list)
				.set("prompt", get.prompt(event.skill, target))
				.set("prompt2", prompt)
				.set("ai", () => {
					return get.event().choice;
				})
				.set(
					"choice",
					(() => {
						const damageEff = get.damageEffect(target, source, player);
						const att = get.attitude(player, target),
							attSource = get.attitude(player, source);
						const canFilterDamage = target.hasSkillTag("filterDamage", null, {
							player: source,
							card,
						});
						if (list.includes(ADD)) {
							if (damageEff > 0) {
								if (!canFilterDamage && target.getHp() <= trigger.num + 1) {
									return ADD;
								}
							} else {
								if (att > 0 && (damageEff === 0 || canFilterDamage)) {
									return ADD;
								}
								if (
									target.getHp() +
										target.countCards("hs", card => {
											return target.canSaveCard(card, target);
										}) >
										trigger.num + 1 &&
									!list.includes(SUB)
								) {
									return ADD;
								}
							}
						}
						if (list.includes(SUB)) {
							if (att > 0 && attSource >= 0) {
								return SUB;
							}
							if (canFilterDamage && att > 0) {
								return "cancel2";
							}
							if (damageEff > 0) {
								if (target.getHp() > trigger.num && attSource > 0 && source.countCards("h") + source.getHp() <= 4) {
									return SUB;
								}
							} else {
								if (att > 0) {
									if (trigger.num >= target.getHp()) {
										return SUB;
									}
									if (
										source &&
										!source.countCards("hs", card => {
											return source.canUse(card, target, true) && get.effect(target, card, source, player) > 0;
										})
									) {
										return Math.random() < 0.7 ? ADD : "cancel2";
									}
								} else {
									if (attSource >= 0) {
										return SUB;
									}
									if (target.hasSkillTag("maixie") && trigger.num === 1 && damageEff < -20) {
										return SUB;
									}
								}
							}
						}
						return "cancel2";
					})()
				)
				.forResult();
			if (result.control !== "cancel2") {
				event.result = {
					bool: true,
					cost_data: {
						control: result.control,
					},
				};
			}
		},
		logTarget: "player",
		onremove: true,
		logAudio(event, player, name, indexedData, evt) {
			const { control } = evt.cost_data;
			return control == "减伤" ? ["mbpanxiang1.mp3", "mbpanxiang2.mp3"] : ["mbpanxiang3.mp3", "mbpanxiang4.mp3"];
		},
		async content(event, trigger, player) {
			const { control } = event.cost_data;
			const { player: target, source } = trigger;
			if (!player.storage.mbpanxiang) {
				player.storage.mbpanxiang = {};
			}
			player.storage.mbpanxiang[target.playerid] = control;
			player.markAuto("mbpanxiang_mark", [trigger.player]);
			if (control === "减伤") {
				trigger.num--;
				game.log(player, "令此伤害", "#y-1");
				if (source && source.isIn()) {
					await source.draw(2);
				}
			} else {
				trigger.num++;
				game.log(player, "令此伤害", "#y+1");
				await target.draw(3);
			}
		},
		subSkill: {
			mark: {
				mark: true,
				marktext: "襄",
				charlotte: true,
				intro: {
					content: "已对$发动过〖蹒襄〗",
				},
			},
		},
	},
	mbchenjie: {
		audio: 2,
		trigger: { global: "dieAfter" },
		filter(event, player) {
			return (
				player.hasSkill("mbpanxiang", null, false, false) &&
				player.hasAllHistory("useSkill", evt => {
					return evt.skill === "mbpanxiang" && evt.targets.includes(event.player);
				})
			);
		},
		forced: true,
		async content(event, trigger, player) {
			const cards = player.getCards("hej", card => lib.filter.cardDiscardable(card, player, "mbchenjie"));
			if (cards.length) {
				await player.discard(cards);
			}
			await player.draw(4);
		},
		ai: {
			combo: "mbpanxiang",
		},
	},
	//李昭焦伯
	mbzuoyou: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		zhuanhuanji: true,
		filterTarget: true,
		prompt() {
			return get.info("mbzuoyou").intro.content(get.player().storage["mbzuoyou"]);
		},
		async content(event, trigger, player) {
			const storage = player.storage.mbzuoyou,
				target = event.target;
			if (event.name === "mbzuoyou") {
				player.changeZhuanhuanji("mbzuoyou");
			}
			if (!storage) {
				await target.draw(3);
				await target.chooseToDiscard(2, true, "h");
			} else {
				await target.changeHujia(1, null, true);
			}
		},
		mark: true,
		marktext: "☯",
		intro: {
			content(storage) {
				const goon = get.mode() !== "versus" || _status.mode !== "two";
				if (!storage) {
					return "转换技。出牌阶段限一次，你可以令一名角色摸三张牌，然后其弃置两张手牌。";
				}
				return "转换技。出牌阶段限一次，你可以令一名角色获得1点护甲。";
			},
		},
		ai: {
			order(item, player) {
				if (
					player.storage.mbzuoyou &&
					game.hasPlayer(current => {
						return current !== player && get.effect(current, "mbzuoyou", player, player) > 0;
					})
				) {
					return get.order({ name: "zengbin" }) + 0.1;
				}
				return 2;
			},
			result: {
				target(player, target) {
					let eff = 0;
					if (player.storage.mbzuoyou) {
						eff = target.hujia < 5 ? 1 : 0;
					} else {
						eff = 1;
					}
					if (target === player && player.hasSkill("mbshishou")) {
						eff /= 10;
					}
					return eff;
				},
			},
		},
	},
	mbshishou: {
		audio: 2,
		trigger: { player: "useSkillAfter" },
		filter(event, player) {
			return event.skill === "mbzuoyou" && !event.targets.includes(player);
		},
		forced: true,
		async content(event, trigger, player) {
			await lib.skill.mbzuoyou.content(
				{
					target: player,
				},
				{},
				player
			);
		},
		ai: {
			combo: "mbzuoyou",
		},
	},
	//成济
	mbkuangli: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(current => current !== player);
		},
		forced: true,
		group: ["mbkuangli_target", "mbkuangli_remove"],
		async content(event, trigger, player) {
			let targets = game.filterPlayer(current => current !== player).randomSort();
			targets = targets.slice(0, Math.ceil(Math.random() * targets.length));
			targets.sortBySeat();
			player.line(targets, "thunder");
			targets.forEach(current => {
				current.addSkill("mbkuangli_mark");
			});
			await game.delayx();
		},
		subSkill: {
			target: {
				audio: "mbkuangli",
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return event.target.hasSkill("mbkuangli_mark") && [player, event.target].some(current => current.countCards("he"));
				},
				forced: true,
				logTarget: "target",
				/*
				get usable() {
					return get.mode() == "doudizhu" ? 1 : 2;
				},
				*/
				usable: 2,
				async content(event, trigger, player) {
					const target = trigger.target,
						list = [];
					const playerCards = player.getCards("he", card => {
						return lib.filter.cardDiscardable(card, player, "mbkuangli");
					});
					if (playerCards.length > 0) {
						list.push([player, playerCards.randomGets(1)]);
					}
					const targetCards = target.getCards("he", card => {
						return lib.filter.cardDiscardable(card, target, "mbkuangli");
					});
					if (targetCards.length > 0) {
						list.push([target, targetCards.randomGets(1)]);
					}
					await game
						.loseAsync({
							lose_list: list,
							discarder: player,
						})
						.setContent("discardMultiple");
					await game.delayx();
					await player.draw(2);
					await game.delayx();
				},
				ai: {
					effect: {
						player_use(card, player, target, current) {
							if (!target) {
								return;
							}
							const counttrigger = player.storage.counttrigger;
							if (counttrigger && counttrigger.mbkuangli_target && counttrigger.mbkuangli_target >= lib.skill.mbkuangli_target.usable) {
								return;
							}
							if (target.hasSkill("mbkuangli_mark")) {
								if (get.attitude(player, target) > 0) {
									return 0.75;
								}
								return 1.25;
							}
						},
					},
				},
			},
			remove: {
				audio: "mbkuangli",
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					return game.hasPlayer(current => current.hasSkill("mbkuangli_mark"));
				},
				forced: true,
				async content(event, trigger, player) {
					game.countPlayer(current => {
						if (current.hasSkill("mbkuangli_mark")) {
							player.line(current);
							current.removeSkill("mbkuangli_mark");
						}
					});
				},
			},
			mark: {
				mark: true,
				marktext: "戾",
				charlotte: true,
				intro: {
					name: "狂戾",
					name2: "狂戾",
					content: "已拥有“狂戾”标记",
				},
			},
		},
	},
	mbxiongsi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") >= 3;
		},
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		filterCard: true,
		selectCard: [-1, -2],
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const targets = game.filterPlayer(current => current !== player).sortBySeat();
			for (const target of targets) {
				player.line(target, "thunder");
				await target.loseHp();
			}
		},
		ai: {
			order(item, player) {
				if (get.effect(player, "mbxiongsi", player) <= 0) {
					return 1;
				}
				if (
					player.countCards("h") > 3 &&
					player.countCards("h", card => {
						return player.hasValueTarget(card);
					}) > 0
				) {
					return 0.1;
				}
				return 8;
			},
			result: {
				player(player) {
					let eff = 0;
					game.countPlayer(current => {
						let effx = get.effect(current, { name: "losehp" }, player, player);
						if (get.attitude(player, current) < -6 && current.getHp() <= 1) {
							effx *= 1.3;
						}
						eff += effx;
					});
					eff *= player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 2 ? 1.5 : 0.35;
					eff -= player
						.getCards("h")
						.map(card => {
							if (lib.filter.cardDiscardable(card, player, "mbxiongsi")) {
								return get.value(card);
							}
							return 0;
						})
						.reduce((p, c) => p + c, 0);
					if (eff > 0) {
						return 2;
					}
					return -1;
				},
			},
		},
	},
	//SP母兵脸
	mbcuizhen: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return (
				(event.name != "phase" || game.phaseNumber == 0) &&
				game.hasPlayer(current => {
					return current !== player && current.hasEnabledSlot(1);
				})
			);
		},
		async cost(event, trigger, player) {
			const num = 3;
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "废除至多" + get.cnNumber(num) + "名其他角色的武器栏", [1, num], (card, player, target) => {
					return target !== player && target.hasEnabledSlot(1);
				})
				.set("ai", target => {
					const player = get.event().player;
					return (1 - get.attitude(player, target)) * Math.sqrt(get.distance(player, target));
				})
				.forResult();
		},
		group: ["mbcuizhen_inphase", "mbcuizhen_draw"],
		async content(event, trigger, player) {
			const targets = event.targets.slice().sortBySeat();
			for (const target of targets) {
				if (target.identityShown) {
					if (get.mode() != "identity" || player.identity != "nei") {
						player.addExpose(0.3);
					}
				}
				await target.disableEquip(1);
			}
			await game.delay();
		},
		subSkill: {
			inphase: {
				audio: "mbcuizhen",
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					if (!player.isPhaseUsing()) {
						return false;
					}
					if (!get.is.damageCard(event.card)) {
						return false;
					}
					const target = event.target;
					return target !== player && target.countCards("h") >= target.getHp() && target.hasEnabledSlot(1);
				},
				prompt2: "废除其的武器栏",
				logTarget: "target",
				check(event, player) {
					return get.attitude(player, event.target) <= 0;
				},
				async content(event, trigger, player) {
					await trigger.target.disableEquip(1);
					await game.delayx();
				},
			},
			draw: {
				audio: "mbcuizhen",
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				locked: false,
				filter(event, player) {
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num += Math.min(
						3,
						game.countPlayer(current => {
							return current.countDisabledSlot(1);
						}) + 1
					);
				},
			},
		},
	},
	mbkuili: {
		audio: 2,
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			return event.source && event.source.isIn() && event.source.hasDisabledSlot(1);
		},
		forced: true,
		async content(event, trigger, player) {
			const source = trigger.source;
			player.line(source, "green");
			await source.enableEquip(1, player);
		},
		ai: {
			neg: true,
			effect: {
				target(card, player, target) {
					if (player && player.isIn() && get.tag(card, "damage") && player.hasDisabledSlot(1)) {
						return [1, 0, 1, 1.5];
					}
				},
			},
		},
	},
	//曹髦  史?! 我求你别改了
	mbqianlong: {
		audio: 6,
		persevereSkill: true,
		trigger: {
			player: ["mbqianlong_beginAfter", "mbqianlong_addAfter", "mbweitongAfter"],
		},
		filter(event, player) {
			let skills = [];
			let current = player.additionalSkills?.mbqianlong?.length ?? 0;
			let target =
				player.countMark("mbqianlong") == lib.skill.mbqianlong.maxMarkCount
					? lib.skill.mbqianlong.derivation.length
					: Math.floor(player.countMark("mbqianlong") / 25);
			return target > current;
		},
		forced: true,
		popup: false,
		locked: false,
		beginMarkCount: 20,
		maxMarkCount: 99,
		derivation: ["mbcmqingzheng", "mbcmjiushi", "mbcmfangzhu", "mbjuejin"],
		addMark(player, num) {
			num = Math.min(num, lib.skill.mbqianlong.maxMarkCount - player.countMark("mbqianlong"));
			player.addMark("mbqianlong", num);
		},
		group: ["mbqianlong_begin", "mbqianlong_add", "mbqianlong_die"],
		async content(event, trigger, player) {
			const derivation = lib.skill.mbqianlong.derivation,
				skills =
					player.countMark("mbqianlong") == lib.skill.mbqianlong.maxMarkCount
						? derivation
						: derivation.slice(0, Math.floor(player.countMark("mbqianlong") / 25));
			player.addAdditionalSkill("mbqianlong", skills);
		},
		marktext: "道",
		intro: {
			name: "道心(潜龙)",
			name2: "道心",
			content: "当前道心数为#",
		},
		subSkill: {
			begin: {
				audio: "mbqianlong",
				persevereSkill: true,
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const num = game.hasPlayer(current => {
						return current !== player && current.group === "wei" && player.hasZhuSkill("mbweitong", current);
					})
						? 60
						: lib.skill.mbqianlong.beginMarkCount;
					lib.skill.mbqianlong.addMark(player, num);
				},
			},
			add: {
				audio: "mbqianlong",
				persevereSkill: true,
				trigger: {
					player: ["gainAfter", "damageEnd"],
					source: "damageSource",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					if (player.countMark("mbqianlong") >= lib.skill.mbqianlong.maxMarkCount) {
						return false;
					}
					if (event.name === "damage") {
						return event.num > 0;
					}
					return event.getg(player).length > 0;
				},
				getIndex(event, player, triggername) {
					if (event.name === "damage") {
						return event.num;
					}
					return 1;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					let toAdd = 5 * (1 + (trigger.name === "damage") + (event.triggername === "damageSource"));
					lib.skill.mbqianlong.addMark(player, toAdd);
				},
			},
			die: {
				trigger: {
					player: "dieBefore",
				},
				charlotte: true,
				firstDo: true,
				forced: true,
				popup: false,
				forceDie: true,
				async content(event, trigger, player) {
					player.changeSkin({ characterName: "mb_caomao" }, "mb_caomao_dead");
				},
			},
		},
	},
	mbweitong: {
		audio: 1,
		persevereSkill: true,
		zhuSkill: true,
		trigger: {
			player: "mbqianlong_beginBegin",
		},
		forced: true,
		locked: false,
		content() {},
		ai: {
			combo: "mbqianlong",
		},
	},
	old_mbcmqingzheng: {
		audio: "mbcmqingzheng",
		persevereSkill: true,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		direct: true,
		content() {
			"step 0";
			var num = 1;
			var prompt = "###" + get.prompt("sbqingzheng") + "###弃置" + get.cnNumber(num) + "种花色的所有牌";
			var next = player.chooseButton([prompt, [lib.suit.map(i => ["", "", "lukai_" + i]), "vcard"]], [num, num + 1]);
			next.set("filterButton", button => {
				var player = _status.event.player;
				if (ui.selected.buttons.length >= get.event().num) {
					return false;
				}
				var cards = player.getCards("h", { suit: button.link[2].slice(6) });
				return cards.length > 0 && cards.filter(card => lib.filter.cardDiscardable(card, player, "sbqingzheng")).length == cards.length;
			});
			next.set("num", num);
			next.set("ai", button => {
				var player = _status.event.player;
				return (
					15 -
					player
						.getCards("h", { suit: button.link[2].slice(6) })
						.map(i => get.value(i))
						.reduce((p, c) => p + c, 0)
				);
			});
			next.set("custom", {
				replace: {
					button(button) {
						if (!_status.event.isMine()) {
							return;
						}
						if (button.classList.contains("selectable") == false) {
							return;
						}
						var cards = _status.event.player.getCards("h", {
							suit: button.link[2].slice(6),
						});
						if (cards.length) {
							var chosen = cards.filter(i => ui.selected.cards.includes(i)).length == cards.length;
							if (chosen) {
								ui.selected.cards.removeArray(cards);
								cards.forEach(card => {
									card.classList.remove("selected");
									card.updateTransform(false);
								});
							} else {
								ui.selected.cards.addArray(cards);
								cards.forEach(card => {
									card.classList.add("selected");
									card.updateTransform(true);
								});
							}
						}
						if (button.classList.contains("selected")) {
							ui.selected.buttons.remove(button);
							button.classList.remove("selected");
							if (_status.multitarget || _status.event.complexSelect) {
								game.uncheck();
								game.check();
							}
						} else {
							button.classList.add("selected");
							ui.selected.buttons.add(button);
						}
						var custom = _status.event.custom;
						if (custom && custom.add && custom.add.button) {
							custom.add.button();
						}
						game.check();
					},
				},
				add: next.custom.add,
			});
			"step 1";
			if (result.bool) {
				var cards = result.cards;
				if (!cards.length) {
					var suits = result.links.map(i => i[2].slice(6));
					cards = player.getCards("h", card => suits.includes(get.suit(card, player)));
				}
				event.cards = cards;
				if (!cards.length) {
					event.finish();
				} else {
					player
						.chooseTarget("清正：观看一名其他角色的手牌并弃置其中一种花色的所有牌", (card, player, target) => {
							return target != player && target.countCards("h");
						})
						.set("ai", target => {
							var player = _status.event.player,
								att = get.attitude(player, target);
							if (att >= 0) {
								return 0;
							}
							return 1 - att / 2 + Math.sqrt(target.countCards("h"));
						});
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("mbcmqingzheng", target);
				player.discard(cards);
				var list = lib.suit
					.slice()
					.reverse()
					.concat("none")
					.filter(i => target.hasCard({ suit: i }, "h"));
				event.videoId = lib.status.videoId++;
				function createDialog(target, id) {
					var dialog = ui.create.dialog("清正：弃置" + get.translation(target) + "一种花色的所有牌");
					dialog.addNewRow(
						{ item: get.translation("heart"), retio: 1 },
						{ item: target.getCards("h", { suit: "heart" }), ratio: 3 },
						{ item: get.translation("diamond"), retio: 1 },
						{ item: target.getCards("h", { suit: "diamond" }), ratio: 3 }
					);
					dialog.addNewRow(
						{ item: get.translation("spade"), retio: 1 },
						{ item: target.getCards("h", { suit: "spade" }), ratio: 3 },
						{ item: get.translation("club"), retio: 1 },
						{ item: target.getCards("h", { suit: "club" }), ratio: 3 }
					);
					if (target.hasCard({ suit: "none" }, "h")) {
						dialog.classList.add("fullheight");
						dialog.addNewRow({ item: get.translation("none"), retio: 1 }, { item: target.getCards("h", { suit: "none" }), ratio: 8 });
					}
					dialog.css({ height: "60%" });
					dialog.videoId = id;
				}
				if (event.isMine()) {
					createDialog(target, event.videoId);
				} else if (player.isOnline2()) {
					player.send(createDialog, target, event.videoId);
				}
				if (list.length) {
					player
						.chooseControl(list)
						.set("dialog", get.idDialog(event.videoId))
						.set("ai", () => {
							return _status.event.control;
						})
						.set(
							"control",
							(() => {
								var getv = cards => cards.map(i => get.value(i)).reduce((p, c) => p + c, 0);
								return list.sort((a, b) => {
									return getv(target.getCards("h", { suit: b })) - getv(target.getCards("h", { suit: a }));
								})[0];
							})()
						);
				}
			} else {
				event.finish();
			}
			"step 3";
			game.broadcastAll("closeDialog", event.videoId);
			var cards2 = target.getCards("h", { suit: result.control });
			event.cards2 = cards2;
			target.modedDiscard(cards2, player);
			"step 4";
			if (event.cards2.length < cards.length) {
				target.damage();
			}
		},
	},
	mbcmqingzheng: {
		audio: 2,
		persevereSkill: true,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h") > 0 && game.hasPlayer(current => player != current && current.countCards("h") > 0);
		},
		/**
		 * player选择target的一种花色的牌
		 * @param {Player} player
		 * @param {Player} target
		 */
		chooseOneSuitCard(player, target, force = false, limit, str = "请选择一个花色的牌", ai = { bool: false }) {
			const { promise, resolve } = Promise.withResolvers();
			const event = _status.event;
			event.selectedCards = [];
			event.selectedButtons = [];
			//对手牌按花色分类
			let suitCards = Object.groupBy(target.getCards("h"), c => get.suit(c, target));
			suitCards.heart ??= [];
			suitCards.diamond ??= [];
			suitCards.spade ??= [];
			suitCards.club ??= [];
			let dialog = (event.dialog = ui.create.dialog());
			dialog.classList.add("fullheight");
			event.control_ok = ui.create.control("ok", link => {
				_status.imchoosing = false;
				event.dialog.close();
				event.control_ok?.close();
				event.control_cancel?.close();
				event._result = {
					bool: true,
					cards: event.selectedCards,
				};
				resolve(event._result);
				game.resume();
			});
			event.control_ok.classList.add("disabled");
			//如果是非强制的，才创建取消按钮
			if (!force) {
				event.control_cancel = ui.create.control("cancel", link => {
					_status.imchoosing = false;
					event.dialog.close();
					event.control_ok?.close();
					event.control_cancel?.close();
					event._result = {
						bool: false,
					};
					resolve(event._result);
					game.resume();
				});
			}
			event.switchToAuto = function () {
				_status.imchoosing = false;
				event.dialog?.close();
				event.control_ok?.close();
				event.control_cancel?.close();
				event._result = ai();
				resolve(event._result);
				game.resume();
			};
			dialog.addNewRow(str);
			let keys = Object.keys(suitCards).sort((a, b) => {
				let arr = ["spade", "heart", "club", "diamond", "none"];
				return arr.indexOf(a) - arr.indexOf(b);
			});
			//添加框
			while (keys.length) {
				let key1 = keys.shift();
				let cards1 = suitCards[key1];
				let key2 = keys.shift();
				let cards2 = suitCards[key2];
				//点击容器的回调
				/**@type {Row_Item_Option['clickItemContainer']} */
				const clickItemContainer = function (container, item, allContainer) {
					if (!item?.length || item.some(card => !lib.filter.cardDiscardable(card, player, event.name))) {
						return;
					}
					if (event.selectedButtons.includes(container)) {
						container.classList.remove("selected");
						event.selectedButtons.remove(container);
						event.selectedCards.removeArray(item);
					} else {
						if (event.selectedButtons.length >= limit) {
							let precontainer = event.selectedButtons[0];
							precontainer.classList.remove("selected");
							event.selectedButtons.remove(precontainer);
							let suit = get.suit(event.selectedCards[0], target),
								cards = target.getCards("h", { suit: suit });
							event.selectedCards.removeArray(cards);
						}
						container.classList.add("selected");
						event.selectedButtons.add(container);
						event.selectedCards.addArray(item);
					}
					event.control_ok.classList[event.selectedButtons.length === limit ? "remove" : "add"]("disabled");
				};
				//给框加封条，显示xxx牌多少张
				function createCustom(suit, count) {
					return function (itemContainer) {
						function formatStr(str) {
							return str.replace(/(?:♥︎|♦︎)/g, '<span style="color: red; ">$&</span>');
						}
						let div = ui.create.div(itemContainer);
						if (count) {
							div.innerHTML = formatStr(`${get.translation(suit)}牌${count}张`);
						} else {
							div.innerHTML = formatStr(`没有${get.translation(suit)}牌`);
						}
						div.css({
							position: "absolute",
							width: "100%",
							bottom: "1%",
							height: "35%",
							background: "#352929bf",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							fontSize: "1.2em",
							zIndex: "2",
						});
					};
				}
				//框的样式，不要太宽，高度最小也要100px，防止空框没有高度
				/**@type {Row_Item_Option['itemContainerCss']} */
				let itemContainerCss = {
					border: "solid #c6b3b3 2px",
					minHeight: "100px",
				};
				if (key2) {
					dialog.addNewRow(
						{
							item: cards1,
							ItemNoclick: true, //卡牌不需要被点击
							clickItemContainer,
							custom: createCustom(key1, cards1.length), //添加封条
							itemContainerCss,
						},
						{
							item: cards2,
							ItemNoclick: true, //卡牌不需要被点击
							clickItemContainer,
							custom: createCustom(key2, cards2.length),
							itemContainerCss,
						}
					);
				} else {
					dialog.addNewRow({
						item: cards1,
						ItemNoclick: true, //卡牌不需要被点击
						clickItemContainer,
						custom: createCustom(key1, cards1.length),
						itemContainerCss,
					});
				}
			}
			game.pause();
			dialog.open();
			_status.imchoosing = true;
			return promise;
		},
		async cost(event, trigger, player) {
			const list = get.addNewRowList(player.getCards("h"), "suit", player);
			let limit = event.skill === "sbqingzheng" ? 3 - player.countMark("sbjianxiong") : 1;
			const result = await player
				.chooseButtonTarget({
					createDialog: [
						[
							[[`${get.prompt(event.skill)}<div class="text center">${get.translation(event.skill, "info")}</div>`], "addNewRow"],
							[
								dialog => {
									dialog.classList.add("fullheight");
									// 不添加scroll1和scroll2的类名
									dialog.forcebutton = false;
									dialog._scrollset = false;
								},
								"handle",
							],
							list.map(item => [Array.isArray(item) ? item : [item], "addNewRow"]),
						],
					],
					filterButton(button) {
						const player = get.player();
						if (
							!button.links.length ||
							button.links.some(card => !lib.filter.cardDiscardable(card, player, get.event().getParent().skill))
						) {
							return false;
						}
						return true;
					},
					selectButton: limit,
					limit,
					filterTarget(card, player, target) {
						return target != player && target.countCards("h");
					},
					ai1(button) {
						const player = get.player();
						if (
							!game.hasPlayer(
								current => player != current && current.countDiscardableCards(player, "h") > 0 && get.attitude(player, current) < 0
							)
						) {
							return 0;
						}
						let values = button.links.map(i => get.value(i)).reduce((p, c) => p + c, 0) / button.links.length;
						if (button.links.length > 4 || values > 6) {
							return 0;
						}
						return (13 - button.links.length) / values;
					},
					ai2(target) {
						const player = get.player(),
							att = get.attitude(player, target);
						if (att >= 0) {
							return 0;
						}
						return 1 - att / 2 + Math.sqrt(target.countCards("h"));
					},
				})
				.forResult();
			event.result = {
				bool: result?.bool,
				cost_data: result?.links,
				targets: result?.targets,
			};
			if (event.result.bool && result?.links?.length) {
				event.result.cards = player.getCards("h").filter(card => result.links.includes(get.suit(card, player)));
			}
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards: cards1,
			} = event;
			await player.discard(cards1);
			if (
				!target.countCards("h") ||
				lib.suits
					.slice()
					.filter(suit => target.hasCard((card, playerx) => get.suit(card, playerx) === suit, "h"))
					.every(suit =>
						target.hasCard((card, playerx) => get.suit(card, playerx) === suit && !lib.filter.cardDiscardable(card, player), "h")
					)
			) {
				if (target.countCards("h")) {
					const content = [`###清正###<div class="text center">${get.translation(target)}的手牌</div>`, target.getCards("h")];
					await player.chooseControl("ok").set("dialog", content);
				}
				return;
			}
			const list = get.addNewRowList(target.getCards("h"), "suit", target);
			let result = await player
				.chooseButton(
					[
						[
							[[`清正：弃置${get.translation(target)}一种花色的所有牌`], "addNewRow"],
							[
								dialog => {
									dialog.classList.add("fullheight");
									dialog.forcebutton = false;
									dialog._scrollset = false;
								},
								"handle",
							],
							list.map(item => [Array.isArray(item) ? item : [item], "addNewRow"]),
						],
					],
					true
				)
				.set("filterButton", button => {
					const player = get.player();
					if (!button.links.length || button.links.some(card => !lib.filter.cardDiscardable(card, player, get.event().getParent().name))) {
						return false;
					}
					return true;
				})
				.set("ai", button => {
					const player = get.player();
					return button.links.length;
				})
				.forResult();
			if (!result?.links?.length) {
				return;
			}
			let cards2 = target.getCards("h", card => result.links.includes(get.suit(card, target)));
			if (cards2.length) {
				cards2 = (await target.modedDiscard(cards2, player).forResult()).cards;
			}
			if (cards1.length > cards2.length) {
				await target.damage(player);
			}
			if (event.name !== "sbqingzheng" || player.countMark("sbjianxiong") >= 2) {
				return;
			}
			if (["sbjianxiong", "jdjianxiong"].some(skill => player.hasSkill(skill, null, null, false))) {
				result = await player
					.chooseBool("是否获得1枚“治世”？")
					.set("choice", Math.random() >= 0.5)
					.forResult();
				if (result?.bool) {
					player.addMark("sbjianxiong", 1);
				}
			}
		},
	},
	mbcmjiushi: {
		audio: 2,
		inherit: "rejiushi",
		persevereSkill: true,
		group: ["mbcmjiushi_use", "mbcmjiushi_turnback", "mbcmjiushi_gain"],
		subSkill: {
			use: {
				hiddenCard(player, name) {
					if (name == "jiu") {
						return !player.isTurnedOver();
					}
					return false;
				},
				audio: "mbcmjiushi",
				enable: "chooseToUse",
				filter(event, player) {
					if (player.classList.contains("turnedover")) {
						return false;
					}
					return event.filterCard({ name: "jiu", isCard: true }, player, event);
				},
				async content(event, trigger, player) {
					if (_status.event.getParent(2).type == "dying") {
						event.dying = player;
						event.type = "dying";
					}
					await player.turnOver();
					await player.useCard({ name: "jiu", isCard: true }, player);
				},
				ai: {
					save: true,
					skillTagFilter(player, tag, arg) {
						return !player.isTurnedOver() && _status.event?.dying == player;
					},
					order: 5,
					result: {
						player(player) {
							if (_status.event.parent.name == "phaseUse") {
								if (player.countCards("h", "jiu") > 0) {
									return 0;
								}
								if (player.getEquip("zhuge") && player.countCards("h", "sha") > 1) {
									return 0;
								}
								if (!player.countCards("h", "sha")) {
									return 0;
								}
								var targets = [];
								var target;
								var players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (get.attitude(player, players[i]) < 0) {
										if (player.canUse("sha", players[i], true, true)) {
											targets.push(players[i]);
										}
									}
								}
								if (targets.length) {
									target = targets[0];
								} else {
									return 0;
								}
								var num = get.effect(target, { name: "sha" }, player, player);
								for (var i = 1; i < targets.length; i++) {
									var num2 = get.effect(targets[i], { name: "sha" }, player, player);
									if (num2 > num) {
										target = targets[i];
										num = num2;
									}
								}
								if (num <= 0) {
									return 0;
								}
								var e2 = target.getEquip(2);
								if (e2) {
									if (e2.name == "tengjia") {
										if (!player.countCards("h", { name: "sha", nature: "fire" }) && !player.getEquip("zhuque")) {
											return 0;
										}
									}
									if (e2.name == "renwang") {
										if (!player.countCards("h", { name: "sha", color: "red" })) {
											return 0;
										}
									}
									if (e2.name == "baiyin") {
										return 0;
									}
								}
								if (player.getEquip("guanshi") && player.countCards("he") > 2) {
									return 1;
								}
								return target.countCards("h") > 3 ? 0 : 1;
							}
							if (player == _status.event.dying || player.isTurnedOver()) {
								return 3;
							}
						},
					},
					effect: {
						target(card, player, target) {
							if (target.isTurnedOver()) {
								if (get.tag(card, "damage")) {
									if (player.hasSkillTag("jueqing", false, target)) {
										return [1, -2];
									}
									if (target.hp == 1) {
										return;
									}
									return [1, target.countCards("h") / 2];
								}
							}
						},
					},
				},
			},
			turnback: {
				audio: "mbcmjiushi",
				persevereSkill: true,
				trigger: { player: "damageEnd" },
				check(event, player) {
					return player.isTurnedOver();
				},
				filter(event, player) {
					if (
						player.hasHistory("useCard", evt => {
							if (evt.card.name != "jiu" || evt.getParent().name != "mbcmjiushi_use") {
								return false;
							}
							return evt.getParent("damage", true) == event;
						})
					) {
						return false;
					}
					return player.isTurnedOver();
				},
				prompt(event, player) {
					return "是否发动【酒诗】，将武将牌翻面？";
				},
				content() {
					player.turnOver();
				},
			},
			gain: {
				audio: "mbcmjiushi",
				persevereSkill: true,
				trigger: { player: "turnOverAfter" },
				frequent: true,
				prompt: "是否发动【酒诗】，获得牌堆中的一张锦囊牌？",
				content() {
					var card = get.cardPile2(function (card) {
						return get.type2(card) == "trick";
					});
					if (card) {
						player.gain(card, "draw");
					}
				},
			},
		},
	},
	mbcmfangzhu: {
		audio: 2,
		persevereSkill: true,
		inherit: "sbfangzhu",
		filter(event, player) {
			const target = player.storage.mbcmfangzhu;
			return game.hasPlayer(current => current !== player && (target ? target != current : true));
		},
		usable: 1,
		chooseButton: {
			dialog() {
				const dialog = ui.create.dialog("放逐：令一名其他角色...", "hidden");
				dialog.add([
					[
						[1, "不能使用手牌中的非锦囊牌直到其回合结束"],
						[2, "非Charlotte技能失效直到其回合结束"],
					],
					"textbutton",
				]);
				return dialog;
			},
			check(button) {
				const player = get.player();
				if (button.link === 2) {
					if (
						game.hasPlayer(target => {
							if (target.hasSkill("mbcmfangzhu_ban") || target.hasSkill("fengyin") || target.hasSkill("baiban")) {
								return false;
							}
							return (
								get.attitude(player, target) < 0 &&
								["name", "name1", "name2"]
									.map((sum, name) => {
										if (target[name] && (name != "name1" || target.name != target.name1)) {
											if (get.character(target[name])) {
												return get.rank(target[name], true);
											}
										}
										return 0;
									})
									.reduce((p, c) => {
										return p + c;
									}, 0) > 5
							);
						})
					) {
						return 6;
					}
				}
				return button.link === 1 ? 1 : 0;
			},
			backup(links, player) {
				return {
					num: links[0],
					audio: "mbcmfangzhu",
					filterCard: () => false,
					selectCard: -1,
					filterTarget(card, player, target) {
						if (target == player) {
							return false;
						}
						const num = lib.skill.mbcmfangzhu_backup.num,
							storage = target.getStorage("mbcmfangzhu_ban"),
							targetx = player.storage.mbcmfangzhu;
						if (target == targetx) {
							return false;
						}
						return num != 1 || !storage.length;
					},
					async content(event, trigger, player) {
						const target = event.target;
						const num = lib.skill.mbcmfangzhu_backup.num;
						player.storage.mbcmfangzhu = target;
						let evt = event.getParent("phaseUse", true);
						if (evt) {
							evt.fangzhuUsed = true;
						}
						player
							.when("phaseUseEnd")
							.filter(evtx => !evtx.fangzhuUsed)
							.step(async () => {
								player.storage.mbcmfangzhu = player;
							});
						switch (num) {
							case 1:
								target.addTempSkill("mbcmfangzhu_ban", { player: "phaseEnd" });
								target.markAuto("mbcmfangzhu_ban", ["trick"]);
								lib.skill.mbcmfangzhu_ban.init(target, "mbcmfangzhu_ban");
								break;
							case 2:
								target.addTempSkill("mbcmfangzhu_baiban", { player: "phaseEnd" });
								break;
						}
					},
					ai: {
						result: {
							target(player, target) {
								switch (lib.skill.mbcmfangzhu_backup.num) {
									case 1:
										return -target.countCards("h", card => get.type(card) != "trick") - 1;
									case 2:
										return -target.getSkills(null, null, false).reduce((sum, skill) => {
											return sum + Math.max(get.skillRank(skill, "out"), get.skillRank(skill, "in"));
										}, 0);
								}
							},
						},
					},
				};
			},
			prompt(links, player) {
				const str = "###放逐###";
				switch (links[0]) {
					case 1:
						return str + "令一名其他角色不能使用手牌中的非锦囊牌直到其回合结束";
					case 2:
						return str + "令一名其他角色的非Charlotte技能失效直到其回合结束";
				}
			},
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return game.hasPlayer(current => get.attitude(player, current) < 0) ? 1 : 0;
				},
			},
		},
		subSkill: {
			backup: {},
			baiban: {
				init(player, skill) {
					player.addSkillBlocker(skill);
					player.addTip(skill, "放逐 技能失效");
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
					player.removeTip(skill);
				},
				inherit: "baiban",
				marktext: "逐",
			},
			ban: {
				init(player, skill) {
					let storage = player.getStorage(skill);
					if (storage.length) {
						player.addTip(skill, "放逐 限" + (storage.length === 1 ? get.translation(storage[0])[0] : "手牌"));
					}
				},
				onremove(player, skill) {
					player.removeTip(skill);
					delete player.storage[skill];
				},
				charlotte: true,
				mark: true,
				marktext: "禁",
				intro: {
					markcount: () => 0,
					content(storage) {
						if (storage.length > 1) {
							return "不能使用手牌";
						}
						return "不能使用手牌中的非" + get.translation(storage[0]) + "牌";
					},
				},
				mod: {
					cardEnabled(card, player) {
						const storage = player.getStorage("mbcmfangzhu_ban");
						const hs = player.getCards("h"),
							cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						if (cards.containsSome(...hs) && !storage.includes(get.type2(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						const storage = player.getStorage("mbcmfangzhu_ban");
						const hs = player.getCards("h"),
							cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						if (cards.containsSome(...hs) && !storage.includes(get.type2(card))) {
							return false;
						}
					},
				},
			},
		},
	},
	mbjuejin: {
		audio: 2,
		persevereSkill: true,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filterCard: () => false,
		selectCard: [-1, -2],
		filterTarget: true,
		selectTarget: -1,
		multiline: true,
		async contentBefore(event, trigger, player) {
			game.broadcastAll(() => {
				_status.tempMusic = "effect_caomaoBJM";
				game.playBackgroundMusic();
			});
			player.changeSkin({ characterName: "mb_caomao" }, "mb_caomao_shadow");
			player.awakenSkill(event.skill);
		},
		async content(event, trigger, player) {
			const target = event.target;
			const delt = target.getHp(true) - 1,
				num = Math.abs(delt);
			if (delt != 0) {
				if (delt > 0) {
					const next = target.changeHp(-delt);
					next._triggered = null;
					await next;
				} else {
					await target.recover(num);
				}
			}
			if (delt > 0) {
				await target.changeHujia(num + (player == target ? 2 : 0), null, true);
			} else if (player == target) {
				await target.changeHujia(2, null, true);
			}
		},
		async contentAfter(event, trigger, player) {
			game.addGlobalSkill("mbjuejin_xiangsicunwei");
			player.$fullscreenpop("向死存魏！", "thunder");
			const cards = ["cardPile", "discardPile"].map(pos => Array.from(ui[pos].childNodes)).flat();
			const filter = card => ["shan", "tao", "jiu"].includes(card.name);
			const cardx = cards.filter(filter);
			if (cardx.length) {
				await game.cardsGotoSpecial(cardx);
				game.log(cardx, "被移出了游戏");
			}
			for (const target of game.filterPlayer()) {
				const sishis = target.getCards("hej", filter);
				if (sishis.length) {
					target.$throw(sishis);
					game.log(sishis, "被移出了游戏");
					await target.lose(sishis, ui.special);
				}
			}
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					let eff = 1;
					game.countPlayer(current => {
						const att = get.attitude(player, current),
							num = Math.abs(current.getHp(true) - 1);
						const delt = Math.max(0, num + current.hujia - 5);
						eff -= att * delt;
					});
					return eff > 0 ? 1 : 0;
				},
			},
		},
		subSkill: {
			xiangsicunwei: {
				trigger: {
					global: ["loseAfter", "equipAfter", "loseAsyncAfter", "cardsDiscardAfter"],
				},
				forced: true,
				silent: true,
				firstDo: true,
				filter(event, player) {
					const nameList = ["shan", "tao", "jiu"];
					return event.getd().some(card => {
						return nameList.includes(get.name(card, false)) && get.position(card, true) === "d";
					});
				},
				async content(event, trigger, player) {
					const nameList = ["shan", "tao", "jiu"];
					const cards = trigger.getd().filter(card => {
						return nameList.includes(get.name(card, false)) && get.position(card, true) === "d";
					});
					await game.cardsGotoSpecial(cards);
					game.log(cards, "被移出了游戏");
				},
			},
		},
	},
	//杨奉
	mbxuetu: {
		audio: 4,
		enable: "phaseUse",
		usable(skill, player) {
			if (player.countMark("mbxuetu_status") !== 1) {
				return 1;
			}
			return 2;
		},
		filter(event, player) {
			if (player.countMark("mbxuetu_status") == 2 && !game.hasPlayer(current => current != player)) {
				return false;
			}
			if (!game.hasPlayer(current => current.isDamaged())) {
				if (player.countMark("mbxuetu_status") == 1 && player.getStorage("mbxuetu_used").includes(1)) {
					return false;
				}
				if (player.countMark("mbxuetu_status") == 0 && !player.storage.mbxuetu) {
					return false;
				}
			}
			return true;
		},
		zhuanhuanji2(skill, player) {
			return !player || player.countMark("mbxuetu_status") !== 1;
		},
		position: "he",
		onremove: ["mbxuetu", "mbxuetu_status"],
		derivation: ["mbxuetu_achieve", "mbxuetu_fail"],
		chooseButton: {
			dialog() {
				const dialog = ui.create.dialog("###血途###请选择要执行的项");
				dialog.direct = true;
				return dialog;
			},
			chooseControl(event, player) {
				let list = ["令一名角色回复1点体力", "令一名角色摸两张牌"];
				if (player.countMark("mbxuetu_status") !== 1) {
					list[player.storage.mbxuetu ? "shift" : "pop"]();
				} else {
					list = list.filter((choice, index) => {
						if (index == 0 && !game.hasPlayer(current => current.isDamaged())) {
							return false;
						}
						if (player.countMark("mbxuetu_status") == 2 && current == player) {
							return false;
						}
						return !player.getStorage("mbxuetu_used").includes(index);
					});
				}
				list.push("cancel2");
				return list;
			},
			check() {
				return get.event().controls[0];
			},
			backup(result, player) {
				return {
					audio: "mbxuetu",
					logAudio(event, player) {
						return player.countMark("mbxuetu_status") == 2 ? ["mbxuetu3.mp3", "mbxuetu4.mp3"] : ["mbxuetu1.mp3", "mbxuetu2.mp3"];
					},
					choice: result.control.includes("回复") ? 0 : 1,
					filterCard: () => false,
					selectCard: -1,
					filterTarget(card, player, target) {
						const { choice } = get.info("mbxuetu_backup");
						if (player.countMark("mbxuetu_status") !== 2 && choice == 0) {
							return target.isDamaged();
						}
						if (player.countMark("mbxuetu_status") == 2) {
							return target != player;
						}
						return true;
					},
					async content(event, trigger, player) {
						const { choice } = get.info("mbxuetu_backup");
						const target = event.targets[0];
						const status = player.countMark("mbxuetu_status");
						player.changeZhuanhuanji("mbxuetu");
						if (status < 2) {
							player.addTempSkill("mbxuetu_used", "phaseUseAfter");
							player.markAuto("mbxuetu_used", [choice]);
							if (!choice) {
								await target.recover();
							} else {
								await target.draw(2);
							}
						} else {
							if (!choice) {
								await player.recover();
								await target.chooseToDiscard(2, true, "he");
							} else {
								await player.draw();
								await target.damage();
							}
						}
					},
					ai: {
						result: {
							target(player, target) {
								const { choice } = get.info("mbxuetu_backup");
								const status = player.countMark("mbxuetu_status");
								if (status > 1) {
									if (player.storage.mbxuetu) {
										return get.damageEffect(target, player, target) / 10;
									}
									return -2;
								}
								if (choice === 1) {
									return 2;
								}
								const eff = get.recoverEffect(target, player, player);
								return eff > 0 ? 2 : eff < 0 ? -get.sgnAttitude(player, target) : 0;
							},
							player(player, target) {
								const status = player.countMark("mbxuetu_status");
								if (status > 1) {
									if (player.storage.mbxuetu) {
										return 1;
									}
									return get.recoverEffect(player, player) / 6;
								}
								return 0;
							},
						},
					},
				};
			},
			prompt(result, player) {
				const { choice } = get.info("mbxuetu_backup");
				const status = player.countMark("mbxuetu_status");
				let str = "";
				if (status < 2) {
					str += "令一名角色" + (choice ? "摸两张牌" : "回复1点体力");
				} else {
					str += choice ? "摸一张牌，然后对一名其他角色造成1点伤害" : "回复1点体力，然后令一名其他角色弃置两张牌";
				}
				return `###血途###<div class="text center">${str}</div>`;
			},
		},
		mark: true,
		marktext: "☯",
		intro: {
			content: (storage, player) => {
				if (!player.countMark("mbxuetu_status")) {
					if (storage) {
						return "转换技。出牌阶段限一次，你可以令一名角色摸两张牌。";
					}
					return "转换技。出牌阶段限一次，你可以令一名角色回复1点体力。";
				} else {
					if (storage) {
						return "转换技。出牌阶段限一次，你可以摸一张牌，然后对一名其他角色造成1点伤害。";
					}
					return "转换技。出牌阶段限一次，你可以回复1点体力，然后令一名其他角色弃置两张牌。";
				}
			},
		},
		ai: {
			order(item, player) {
				const status = player.countMark("mbxuetu_status");
				if (status > 1) {
					return Math.max(get.order({ name: "guohe" }), get.order({ name: "chuqibuyi" }));
				}
				if (status === 1 || player.storage.mbxuetu) {
					return 9;
				}
				return 2;
			},
			result: { player: 1 },
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			backup: {},
		},
	},
	mbweiming: {
		audio: 3,
		dutySkill: true,
		locked: true,
		group: ["mbweiming_achieve", "mbweiming_fail", "mbweiming_effect"],
		intro: { content: "已记录$" },
		subSkill: {
			effect: {
				audio: "mbweiming1.mp3",
				trigger: {
					player: "phaseUseBegin",
				},
				filter(event, player) {
					return game.hasPlayer(current => {
						return !player.getStorage("mbweiming").includes(current) && current != player;
					});
				},
				locked: true,
				async cost(event, trigger, player) {
					const targets = game.filterPlayer(current => !player.getStorage("mbweiming").includes(current) && current != player);
					if (targets.length == 1) {
						event.result = { bool: true, targets: targets };
					} else {
						event.result = await player
							.chooseTarget(
								"威命：记录一名未记录过的其他角色",
								"当你杀死没有被记录过的角色后，则〖威命〗使命成功；如果在你杀死这些角色中的一名之前，有被记录过的角色死亡，则你〖威命〗使命失败。",
								true
							)
							.set("filterTarget", (card, player, target) => {
								return !player.getStorage("mbweiming").includes(target) && target != player;
							})
							.set("ai", target => {
								if (target === player) {
									return 1;
								}
								return (
									1 +
									(Math.sqrt(Math.abs(get.attitude(player, target))) * Math.abs(get.threaten(target))) /
										Math.sqrt(target.getHp() + 1) /
										Math.sqrt(target.countCards("hes") + 1)
								);
							})
							.forResult();
					}
				},
				async content(event, trigger, player) {
					const targets = event.targets;
					if (targets?.length) {
						player.markAuto("mbweiming", targets[0]);
					}
				},
			},
			achieve: {
				audio: "mbweiming2.mp3",
				trigger: {
					source: "dieAfter",
				},
				filter(event, player) {
					return !player.getStorage("mbweiming").includes(event.player);
				},
				dutySkill: true,
				forced: true,
				skillAnimation: true,
				animationColor: "fire",
				async content(event, trigger, player) {
					game.log(player, "成功完成使命");
					player.awakenSkill("mbweiming");
					player.storage.mbxuetu_status = 1;
					player.unmarkSkill("mbxuetu");
					await game.delayx();
				},
			},
			fail: {
				audio: "mbweiming3.mp3",
				trigger: {
					global: "dieAfter",
				},
				filter(event, player) {
					return player.getStorage("mbweiming").includes(event.player);
				},
				dutySkill: true,
				forced: true,
				async content(event, trigger, player) {
					game.log(player, "使命失败");
					player.awakenSkill("mbweiming");
					player.storage.mbxuetu_status = 2;
					if (player.getStat("skill").mbxuetu) {
						delete player.getStat("skill").mbxuetu;
					}
					await game.delayx();
				},
			},
		},
		ai: {
			combo: "mbxuetu",
		},
	},
	//霍骏
	sidai: {
		audio: ["twsidai1.mp3", "sidai.mp3"],
		enable: "phaseUse",
		usable: 1,
		locked: false,
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		filter(event, player) {
			var cards = player.getCards("h", { type: "basic" });
			if (!cards.length) {
				return false;
			}
			for (var i of cards) {
				if (!game.checkMod(i, player, "unchanged", "cardEnabled2", player)) {
					return false;
				}
			}
			return event.filterCard(get.autoViewAs({ name: "sha", storage: { sidai: true } }, cards), player, event);
		},
		viewAs: { name: "sha", storage: { sidai: true } },
		filterCard: { type: "basic" },
		selectCard: -1,
		check: () => 1,
		onuse(result, player) {
			player.awakenSkill("sidai");
			player.addTempSkill("sidai_tao");
			player.addTempSkill("sidai_shan");
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }, player) + 0.1;
			},
			result: {
				target(player, target) {
					var cards = ui.selected.cards.slice(0);
					var names = [];
					for (var i of cards) {
						names.add(i.name);
					}
					if (names.length < player.hp) {
						return 0;
					}
					if (player.hasUnknown() && (player.identity != "fan" || !target.isZhu)) {
						return 0;
					}
					if (get.attitude(player, target) >= 0) {
						return -20;
					}
					return lib.card.sha.ai.result.target.apply(this, arguments);
				},
			},
		},
		subSkill: {
			tao: {
				trigger: { source: "damageSource" },
				filter(event, player) {
					if (!event.card || !event.card.storage || !event.card.storage.sidai || !event.player.isIn()) {
						return false;
					}
					for (var i of event.cards) {
						if (i.name == "tao") {
							return true;
						}
					}
					return false;
				},
				forced: true,
				popup: false,
				content() {
					trigger.player.loseMaxHp();
				},
			},
			shan: {
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					if (!event.card || !event.card.storage || !event.card.storage.sidai || !event.target.isIn()) {
						return false;
					}
					for (var i of event.cards) {
						if (i.name == "shan") {
							return true;
						}
					}
					return false;
				},
				forced: true,
				popup: false,
				content() {
					"step 0";
					trigger.target
						.chooseToDiscard("h", { type: "basic" }, "弃置一张基本牌，否则不能响应" + get.translation(trigger.card))
						.set("ai", function (card) {
							var player = _status.event.player;
							if (
								player.hasCard("hs", function (cardx) {
									return cardx != card && get.name(cardx, player) == "shan";
								})
							) {
								return 12 - get.value(card);
							}
							return 0;
						});
					"step 1";
					if (!result.bool) {
						trigger.directHit.add(trigger.target);
					}
				},
			},
		},
	},
	jieyu: {
		audio: ["twjieyu1.mp3", "jieyu.mp3"],
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			for (let i = 0; i < ui.discardPile.childElementCount; i++) {
				if (get.type(ui.discardPile.childNodes[i], false) == "basic") {
					return true;
				}
			}
			return false;
		},
		prompt2(event, player) {
			const num = lib.skill.jieyu.getNum(player);
			return "获得弃牌堆中" + get.cnNumber(num) + "张" + (num > 1 ? "牌名各不相同的" : "") + "基本牌";
		},
		async content(event, trigger, player) {
			const num = lib.skill.jieyu.getNum(player, event);
			let gains = [],
				names = [];
			for (let i = 0; i < ui.discardPile.childElementCount; i++) {
				let card = ui.discardPile.childNodes[i];
				if (get.type(card, null, false) == "basic" && !names.includes(card.name)) {
					gains.push(card);
					names.push(card.name);
				}
			}
			if (gains.length) {
				player.gain(gains.randomGets(Math.min(gains.length, num)), "gain2");
			}
		},
		getNum(player, event) {
			//let num = get.mode() == "identity" ? 3 : 4;
			let num = 3;
			const history = game.getAllGlobalHistory("everything");
			for (let i = history.length - 1; i >= 0; i--) {
				const evt = history[i];
				if (evt.name == "jieyu" && evt.player == player) {
					if (!event || evt != event) {
						break;
					}
				}
				if (evt.name == "useCard" && evt.player != player && evt.targets && evt.targets.includes(player) && get.tag(evt.card, "damage")) {
					num--;
					if (num == 1) {
						break;
					}
				}
			}
			return num;
		},
	},
	//木鹿大王
	shoufa: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player, name) {
			if (name == "damageSource" && player.getHistory("sourceDamage").indexOf(event) != 0) {
				return false;
			}
			return game.hasPlayer(target => {
				const num = get.mode() == "doudizhu" ? 1 : 2;
				if (name == "damageEnd" && get.distance(target, player) < num) {
					return false;
				}
				if (name == "damageSource" && get.distance(player, target) > num) {
					return false;
				}
				const zhoufa = player.storage.zhoulin_zhoufa;
				if (!zhoufa) {
					return true;
				}
				if (zhoufa == "豹" || zhoufa == "兔") {
					return true;
				}
				if (zhoufa == "鹰") {
					return target.countCards("he");
				}
				return target.countDiscardableCards(player, "e");
			});
		},
		direct: true,
		async content(event, trigger, player) {
			const zhoufa = player.storage.zhoulin_zhoufa;
			const str = zhoufa
				? ["令其受到1点无来源伤害", "你随机获得其一张牌", "你随机弃置其装备区的一张牌", "令其摸一张牌"][
						["豹", "鹰", "熊", "兔"].indexOf(zhoufa)
					]
				: "令其随机执行一个效果";
			const nodoudizhu = (event.triggername === "damageEnd" ? "与你距离不小于" : "距离不大于") + (1 + (get.mode() !== "doudizhu")) + "的";
			const { bool, targets } = await player
				.chooseTarget(get.prompt("shoufa"), "选择一名" + nodoudizhu + "角色，" + str, (card, player, target) => {
					const name = _status.event.triggername;
					const num = get.mode() == "doudizhu" ? 1 : 2;
					if (name == "damageEnd" && get.distance(target, player) < num) {
						return false;
					}
					if (name == "damageSource" && get.distance(player, target) > num) {
						return false;
					}
					const zhoufa = player.storage.zhoulin_zhoufa;
					if (!zhoufa) {
						return true;
					}
					if (zhoufa == "豹" || zhoufa == "兔") {
						return true;
					}
					if (zhoufa == "鹰") {
						return target.countCards("he");
					}
					return target.countDiscardableCards(player, "e");
				})
				.set("ai", target => {
					const player = _status.event.player;
					const zhoufa = player.storage.zhoulin_zhoufa;
					if (!zhoufa) {
						return -get.attitude(player, target);
					}
					switch (zhoufa) {
						case "豹": {
							return get.damageEffect(target, player, player);
						}
						case "鹰": {
							return get.effect(target, { name: "guohe_copy2" }, player, player);
						}
						case "熊": {
							let att = get.attitude(player, target),
								eff = 0;
							target.getCards("e", card => {
								var val = get.value(card, target);
								eff = Math.max(eff, -val * att);
							});
							return eff;
						}
						case "兔": {
							return get.effect(target, { name: "draw" }, player, player);
						}
					}
				})
				.set("triggername", event.triggername)
				.forResult();
			if (!bool) {
				return;
			}
			const target = targets[0];
			player.logSkill("shoufa", target);
			const shoufa = zhoufa ? zhoufa : ["豹", "鹰", "熊", "兔"].randomGet();
			game.log(target, "执行", "#g" + shoufa, "效果");
			switch (shoufa) {
				case "豹":
					target.damage("nosource");
					break;
				case "鹰":
					player.gain(target.getGainableCards(player, "he").randomGet(), target, "giveAuto");
					break;
				case "熊":
					target.randomDiscard("e", player);
					break;
				case "兔":
					target.draw();
					break;
			}
		},
	},
	yuxiang: {
		mod: {
			globalFrom(from, to, distance) {
				if (from.hujia > 0) {
					return distance - 1;
				}
			},
			globalTo(from, to, distance) {
				if (to.hujia > 0) {
					return distance + 1;
				}
			},
		},
		audio: true,
		trigger: { player: "damageBegin2" },
		filter(event, player) {
			return player.hujia > 0 && event.hasNature("fire");
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num++;
		},
		ai: {
			combo: "zhoulin",
		},
	},
	zhoulin: {
		audio: 2,
		limited: true,
		enable: "phaseUse",
		skillAnimation: true,
		animationColor: "fire",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.changeHujia(2, null, true);
			const { control } = await player
				.chooseControl("豹", "鹰", "熊", "兔")
				.set("ai", () => "豹")
				.set("prompt", "选择一个固定效果")
				.forResult();
			if (control) {
				player.popup(control);
				game.log(player, "选择了", "#g" + control, "效果");
				player.addTempSkill("zhoulin_zhoufa", { player: "phaseBegin" });
				player.storage.zhoulin_zhoufa = control;
				player.markSkill("zhoulin_zhoufa");
				game.broadcastAll(
					function (player, zhoufa) {
						if (player.marks.zhoulin_zhoufa) {
							player.marks.zhoulin_zhoufa.firstChild.innerHTML = zhoufa;
						}
					},
					player,
					control
				);
			}
		},
		ai: {
			order: 12,
			result: { player: 1 },
		},
		subSkill: {
			zhoufa: {
				charlotte: true,
				onremove: true,
				intro: { content: "已选择$效果" },
			},
		},
	},
	//陈珪
	guimou: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "phaseEnd", "phaseZhunbeiBegin"],
		},
		filter(event, player, name) {
			if (event.name == "phaseZhunbei" || name == "phaseEnd") {
				return true;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		direct: true,
		locked: true,
		async content(event, trigger, player) {
			if (trigger.name != "phaseZhunbei") {
				player.logSkill("guimou");
				var result,
					choiceList = ["惩罚期间使用牌最少的角色", "惩罚期间弃置牌最少的角色", "惩罚期间得到牌最少的角色"];
				if (trigger.name != "phase" || game.phaseNumber == 0) {
					result = { index: get.rand(0, 2) };
				} else {
					result = await player
						.chooseControl()
						.set("choiceList", choiceList)
						.set("ai", () => get.rand(0, 2))
						.forResult();
				}
				var str = choiceList[result.index];
				game.log(player, "选择", "#g" + str);
				player.addSkill("guimou_" + result.index);
				return;
			}
			var targets = [];
			for (var i = 0; i <= 2; i++) {
				var skill = "guimou_" + i;
				if (player.hasSkill(skill)) {
					var storage = player.storage[skill],
						nums = storage[0].slice();
					var targetx = nums.sort((a, b) => storage[1][storage[0].indexOf(a)] - storage[1][storage[0].indexOf(b)]);
					targetx = targetx.filter(target => storage[1][storage[0].indexOf(target)] == storage[1][storage[0].indexOf(targetx[0])]);
					targets.addArray(targetx);
					player.removeSkill(skill);
				}
			}
			targets = targets.filter(target => target != player && target.countCards("h"));
			if (targets.length) {
				var result = await player
					.chooseTarget(
						"请选择【诡谋】的目标",
						"观看一名可选择的角色的手牌并选择其中一张牌，然后你可以此牌交给另一名其他角色或弃置此牌",
						(card, player, target) => {
							return _status.event.targets.includes(target) && target.countCards("h");
						},
						true
					)
					.set("ai", target => {
						return Math.sqrt(Math.min(3, target.countCards("h"))) * get.effect(target, { name: "guohe_copy2" }, player, player);
					})
					.set("targets", targets)
					.forResult();
				if (result.bool) {
					var target = result.targets[0];
					player.logSkill("guimou", target);
					player.addExpose(0.3);
					var result2 = await player
						.choosePlayerCard(target, "h", "visible", true)
						.set("ai", button => {
							return get.value(button.link);
						})
						.set("prompt", "诡谋：请选择" + get.translation(target) + "的一张手牌")
						.set("prompt2", '<div class="text center">将选择的牌交给另一名其他角色或弃置此牌</div>')
						.forResult();
					if (result2.bool) {
						var cards = result2.links.slice(),
							result3;
						if (!game.hasPlayer(targetx => targetx != player && targetx != target)) {
							result3 = { bool: false };
						} else {
							result3 = await player
								.chooseTarget("是否令另一名其他角色获得" + get.translation(cards) + "？", (card, player, target) => {
									return target != player && target != _status.event.target;
								})
								.set("ai", target => get.attitude(_status.event.player, target))
								.set("target", target)
								.forResult();
						}
						if (result3.bool) {
							var targetx = result3.targets[0];
							player.line(targetx);
							targetx.gain(cards, target, "give");
						} else {
							target.modedDiscard(cards, player);
						}
					}
				}
			}
		},
		subSkill: {
			0: {
				charlotte: true,
				onremove: true,
				init(player, skill) {
					if (!player.storage[skill]) {
						player.storage[skill] = [[], []];
						var targets = game.filterPlayer(i => i !== player).sortBySeat(player);
						targets.forEach(target => {
							player.storage[skill][0].push(target);
							player.storage[skill][1].push(0);
						});
					}
				},
				mark: true,
				intro: {
					markcount: storage => 0,
					content(storage, player) {
						var str = "当前使用牌数排行榜";
						var lose = storage[1].slice().sort((a, b) => a - b)[0];
						storage[0].forEach(target => {
							str += "<br><li>";
							var score = storage[1][storage[0].indexOf(target)];
							if (score == lose) {
								str += "<span class='texiaotext' style='color:#FF0000'>";
							}
							str += " " + get.translation(target) + " ";
							str += score + "张";
							if (score == lose) {
								str += "</span>";
							}
						});
						return str;
					},
				},
				trigger: { global: "useCard1" },
				forced: true,
				popup: false,
				content() {
					var storage = player.storage["guimou_0"];
					if (!storage[0].includes(trigger.player)) {
						storage[0].push(trigger.player);
						storage[1].push(0);
					}
					storage[1][storage[0].indexOf(trigger.player)]++;
				},
			},
			1: {
				charlotte: true,
				onremove: true,
				init(player, skill) {
					if (!player.storage[skill]) {
						player.storage[skill] = [[], []];
						var targets = game.filterPlayer(i => i !== player).sortBySeat(player);
						targets.forEach(target => {
							player.storage[skill][0].push(target);
							player.storage[skill][1].push(0);
						});
					}
				},
				mark: true,
				intro: {
					markcount: storage => 0,
					content(storage, player) {
						var str = "当前弃置牌数排行榜";
						var lose = storage[1].slice().sort((a, b) => a - b)[0];
						storage[0].forEach(target => {
							str += "<br><li>";
							var score = storage[1][storage[0].indexOf(target)];
							if (score == lose) {
								str += "<span class='texiaotext' style='color:#FF0000'>";
							}
							str += " " + get.translation(target) + " ";
							str += score + "张";
							if (score == lose) {
								str += "</span>";
							}
						});
						return str;
					},
				},
				trigger: { global: ["loseAfter", "loseAsyncAfter"] },
				filter(event, player) {
					return event.type == "discard" && game.hasPlayer(target => event.getl(target).cards2.length);
				},
				forced: true,
				popup: false,
				content() {
					var storage = player.storage["guimou_1"];
					var targets = game.filterPlayer(target => trigger.getl(target).cards2.length);
					targets.forEach(target => {
						if (!storage[0].includes(target)) {
							storage[0].push(target);
							storage[1].push(0);
						}
						storage[1][storage[0].indexOf(target)] += trigger.getl(target).cards2.length;
					});
				},
			},
			2: {
				charlotte: true,
				onremove: true,
				init(player, skill) {
					if (!player.storage[skill]) {
						player.storage[skill] = [[], []];
						var targets = game.filterPlayer(i => i !== player).sortBySeat(player);
						targets.forEach(target => {
							player.storage[skill][0].push(target);
							player.storage[skill][1].push(0);
						});
					}
				},
				mark: true,
				intro: {
					markcount: storage => 0,
					content(storage, player) {
						var str = "当前得到牌数排行榜";
						var lose = storage[1].slice().sort((a, b) => a - b)[0];
						storage[0].forEach(target => {
							str += "<br><li>";
							var score = storage[1][storage[0].indexOf(target)];
							if (score == lose) {
								str += "<span class='texiaotext' style='color:#FF0000'>";
							}
							str += " " + get.translation(target) + " ";
							str += score + "张";
							if (score == lose) {
								str += "</span>";
							}
						});
						return str;
					},
				},
				trigger: { global: ["gainAfter", "loseAsyncAfter"] },
				forced: true,
				popup: false,
				content() {
					var storage = player.storage["guimou_2"];
					var targets = game.filterPlayer(target => trigger.getg(target).length);
					targets.forEach(target => {
						if (!storage[0].includes(target)) {
							storage[0].push(target);
							storage[1].push(0);
						}
						storage[1][storage[0].indexOf(target)] += trigger.getg(target).length;
					});
				},
			},
		},
	},
	zhouxian: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.player != player && get.tag(event.card, "damage");
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			var target = trigger.player;
			var cards = get.cards(3);
			await game.cardsDiscard(cards);
			player.showCards(cards, get.translation(player) + "发动了【州贤】");
			var result = await target
				.chooseToDiscard("he", "州贤：弃置一张其中有的类别的牌，或令此牌对" + get.translation(player) + "无效", (card, player) => {
					return _status.event.cards.some(cardx => get.type2(cardx) == get.type2(card));
				})
				.set("cards", cards)
				.set("ai", card => {
					if (!_status.event.goon) {
						return 0;
					}
					return 7.5 - get.value(card);
				})
				.set("goon", get.effect(player, trigger.card, target, target) > 0)
				.forResult();
			if (!result || !result.bool) {
				trigger.getParent().excluded.add(player);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && get.attitude(player, target) < 0 && target != player) {
						if (_status.event.name == "zhouxian") {
							return;
						}
						if (get.attitude(player, target) > 0 && current < 0) {
							return "zeroplayertarget";
						}
						var bs = player.getDiscardableCards(player, "he");
						bs.remove(card);
						if (card.cards) {
							bs.removeArray(card.cards);
						} else {
							bs.removeArray(ui.selected.cards);
						}
						var cardx = Array.from(ui.cardPile.childNodes).slice(0, 3);
						bs = bs.filter(i => cardx.some(j => get.type2(j) == get.type2(i)));
						if (!bs.length) {
							return "zerotarget";
						}
						if (bs.length <= 2) {
							if (bs.some(bsi => get.value(bsi) < 7)) {
								return [1, 0, 1, -0.5];
							}
							return [1, 0, 0.3, 0];
						}
						return [1, 0, 1, -0.5];
					}
				},
			},
		},
	},
	//胡班
	mbyilie: {
		audio: 3,
		trigger: { global: "phaseBefore", player: "enterGame" },
		filter(event, player) {
			return !player.storage.mbyilie2 && (event.name != "phase" || game.phaseNumber == 0);
		},
		forced: true,
		async content(event, trigger, player) {
			const { targets } = await player
				.chooseTarget(get.prompt2("mbyilie"), lib.filter.notMe, true)
				.set("ai", function (target) {
					let player = _status.event.player;
					return Math.max(1 + get.attitude(player, target) * get.threaten(target), Math.random());
				})
				.set("animate", false)
				.forResult();
			if (targets) {
				const target = targets[0];
				player.line(target, "green");
				player.storage.mbyilie2 = target;
				player.addSkill("mbyilie2");

				const func = (player, target) => {
					target.markSkillCharacter("mbyilie2", player, "义烈", `${get.translation(player)}决定追随于你`, true);
				};
				if (event.isMine()) {
					func(player, target);
				} else if (player.isOnline2()) {
					player.send(func, player, target);
				}
			}
		},
		marktext: "烈",
		intro: {
			name2: "烈",
			content: "mark",
		},
		group: "mbyilie3",
	},
	mbyilie2: {
		charlotte: true,
		audio: "mbyilie",
		trigger: { global: ["damageBegin4", "damageSource"] },
		sourceSkill: "mbyilie",
		filter(event, player, name) {
			var target = player.storage.mbyilie2;
			if (name == "damageSource") {
				return event.source == target && event.player != player && player.isDamaged();
			}
			return event.player == target && !player.countMark("mbyilie");
		},
		forced: true,
		logTarget(event, player) {
			return player.storage.mbyilie2;
		},
		content() {
			if (event.triggername == "damageSource") {
				player.recover();
			} else {
				event.targets[0].markSkillCharacter("mbyilie2", player, "义烈", `${get.translation(player)}决定追随于你`);
				player.addMark("mbyilie", trigger.num);
				trigger.cancel();
			}
		},
	},
	mbyilie3: {
		audio: "mbyilie",
		trigger: { player: "phaseEnd" },
		sourceSkill: "mbyilie",
		filter(event, player) {
			return player.hasMark("mbyilie");
		},
		forced: true,
		content() {
			"step 0";
			player.draw();
			"step 1";
			var num = player.countMark("mbyilie");
			if (num) {
				player.loseHp(num);
				player.removeMark("mbyilie", num);
			}
		},
	},
	//向朗
	naxue: {
		audio: 2,
		trigger: { player: "phaseUseBefore" },
		check(event, player) {
			var cards = player.getCards("h", card => player.hasValueTarget(card));
			if (!cards.length) {
				return true;
			}
			if (!(player.hp >= 2 && player.countCards("h") <= player.hp + 1)) {
				return false;
			}
			return game.hasPlayer(function (target) {
				if (target.hasJudge("lebu") || target == player) {
					return false;
				}
				if (get.attitude(player, target) > 4) {
					return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1) > 0;
				}
				return false;
			});
		},
		async content(event, trigger, player) {
			trigger.cancel();
			var num = player.countDiscardableCards(player, "he");
			if (num) {
				var result = await player
					.chooseToDiscard("纳学：是否弃置任意张牌并摸等量的牌？", "he", [1, num], "allowChooseAll")
					.set("ai", lib.skill.zhiheng.check)
					.forResult();
				if (result.bool) {
					await player.draw(result.cards.length);
				}
			}
			if (player.countCards("h")) {
				var result2 = await player
					.chooseCardTarget({
						prompt: "是否交给至多两名其他角色各一张手牌？",
						prompt2: "先按顺序选中所有要给出的牌，然后再按顺序选择等量的目标角色。",
						selectCard: [1, 2],
						filterCard: true,
						filterTarget: lib.filter.notMe,
						selectTarget() {
							return ui.selected.cards.length;
						},
						filterOk: () => {
							return ui.selected.cards.length == ui.selected.targets.length;
						},
						position: "h",
						allowChooseAll: true,
						ai1(card) {
							if (card.name == "du") {
								return 10;
							} else if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
								return 0;
							}
							var player = _status.event.player;
							if (
								ui.selected.cards.length > 4 ||
								!game.hasPlayer(function (current) {
									return get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
								})
							) {
								return 0;
							}
							return 1 / Math.max(0.1, get.value(card));
						},
						ai2(target) {
							var player = _status.event.player,
								att = get.attitude(player, target);
							if (ui.selected.cards[0].name == "du") {
								return -att;
							}
							if (target.hasSkillTag("nogain")) {
								att /= 6;
							}
							return att;
						},
					})
					.forResult();
				if (result2.bool) {
					const list = [];
					for (let i = 0; i < result2.targets.length; i++) {
						list.push([result2.targets[i], result2.cards[i]]);
						player.line(result2.targets[i]);
					}
					game.loseAsync({
						gain_list: list,
						player: player,
						cards: result2.cards,
						giver: player,
						animate: "giveAuto",
					}).setContent("gaincardMultiple");
				}
			}
		},
	},
	yijie: {
		audio: 2,
		trigger: { player: "die" },
		filter(event, player) {
			return game.hasPlayer(target => target != player);
		},
		forced: true,
		forceDie: true,
		skillAnimation: true,
		animationColor: "orange",
		logTarget(event, player) {
			return game.filterPlayer(target => target != player);
		},
		content() {
			"step 0";
			var targets = game.filterPlayer(target => target != player);
			var sum = targets.reduce((num, target) => (num += target.hp), 0);
			sum = Math.max(1, Math.floor(sum / targets.length));
			event.num = sum;
			event.targets = targets;
			"step 1";
			var target = targets.shift();
			var delta = target.hp - num;
			if (delta != 0) {
				target[delta > 0 ? "loseHp" : "recover"](Math.abs(delta));
			}
			if (targets.length) {
				event.redo();
			}
		},
	},
	//阎象
	kujian: {
		audio: "twkujian",
		inherit: "twkujian",
		selectCard: [1, 2],
		logAudio: () => "twkujian1.mp3",
		async content(event, trigger, player) {
			const { cards, target } = event;
			player.addSkill("kujian_discard");
			const next = player.give(cards, target);
			next.gaintag.add("twkujianx");
			await next;
		},
		subSkill: {
			discard: {
				trigger: {
					global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				getIndex(event, player) {
					let list = [],
						players = game.filterPlayer().sortBySeat();
					for (const current of players) {
						let bool = ["useCard", "respond"].includes(event.getParent().name);
						if (current == player) {
							continue;
						}
						const evt = event.getl(current);
						if (!evt || !evt.hs || !evt.hs.length) {
							continue;
						}
						if (event.name == "lose") {
							for (const i in event.gaintag_map) {
								if (event.gaintag_map[i].includes("twkujianx")) {
									list.push([current, bool]);
								}
							}
							continue;
						}
						current.getHistory("lose", evt => {
							if (event != evt.getParent()) {
								return false;
							}
							for (const i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("twkujianx")) {
									list.push([current, bool]);
								}
							}
						});
					}
					return list;
				},
				charlotte: true,
				logTarget(event, player, name, data) {
					return data[0];
				},
				logAudio(event, player, name, data) {
					let type = data[1];
					if (type) {
						return "twkujian2.mp3";
					}
					return "twkujian3.mp3";
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					const type = event.indexedData[1];
					if (type) {
						await game.asyncDraw([player, target], 2);
					} else {
						if (player.countCards("h")) {
							await player.chooseToDiscard(1, true, "h");
						}
						if (target.countCards("h")) {
							await target.chooseToDiscard(1, true, "h");
						}
					}
				},
			},
		},
	},
	ruilian: {
		audio: "twruilian",
		trigger: { global: "roundStart" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					let player = _status.event.player,
						att = get.attitude(player, target),
						eff = att / (player == target ? 2 : 1) + 1;
					if (att >= 0) {
						if (target.hasSkill("yongsi")) {
							return eff * 5;
						}
						if (target.hasSkill("zhiheng") || target.hasSkill("rezhiheng")) {
							return eff * 4;
						}
						if (target.hasSkill("rekurou")) {
							return eff * 3;
						}
						if (target.hasSkill("xinlianji") || target.hasSkill("dclianji")) {
							return eff * 2;
						}
						if (target.needsToDiscard()) {
							return eff * 1.5;
						}
						return eff;
					}
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.addSkill("ruilian_target");
			player.markAuto("ruilian_target", [target]);
		},
		subSkill: {
			target: {
				onremove: true,
				intro: { content: "已选择$" },
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return player.getStorage("ruilian_target").includes(event.player);
				},
				direct: true,
				charlotte: true,
				async content(event, trigger, player) {
					const target = trigger.player;
					let cards = [];
					player.removeSkill("ruilian_target");
					target.getHistory("lose", evt => {
						if (evt.type == "discard") {
							cards.addArray(evt.cards2);
						}
					});
					if (!cards.length) {
						return;
					}
					let list = [];
					for (let type of ["basic", "trick", "equip"]) {
						for (let card of cards) {
							if (get.type2(card) == type) {
								list.push(type);
								break;
							}
						}
					}
					list.push("cancel2");
					const result = await player
						.chooseControl(list)
						.set("prompt", "睿敛：是否与" + get.translation(target) + "各获得一种类型的牌？")
						.set("ai", function () {
							let player = _status.event.player,
								list = _status.event.controls;
							if (player.hp <= 3 && !player.countCards("h", { name: ["shan", "tao"] }) && list.includes("basic")) {
								return "basic";
							}
							if (player.countCards("he", { type: "equip" }) < 2 && list.includes("equip")) {
								return "equip";
							}
							if (list.includes("trick")) {
								return "trick";
							}
							return list.remove("cancel2").randomGet();
						})
						.forResult();
					if (result.control != "cancel2") {
						player.logSkill("ruilian_target", target);
						let type = result.control;
						list = [target, player].sortBySeat(_status.currentPhase);
						cards = [];
						for (let current of list) {
							let card = get.discardPile(function (card) {
								return get.type2(card) == type && !cards.includes(card);
							});
							if (card) {
								cards.push(card);
								await current.gain(card, "gain2");
							}
						}
					}
				},
			},
		},
	},
	//手杀差异化孙鲁育
	mbmumu: {
		audio: "mumu",
		inherit: "new_mumu",
		filter(event, player) {
			return game.hasPlayer(current => {
				return current.countCards("e") > 0;
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("mbmumu"), "弃置场上的一张装备牌，或者获得场上的一张防具牌。", function (card, player, target) {
					return target.countCards("e") > 0;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target);
					if (target.getEquip(2) && player.hasEmptySlot(2)) {
						return -2 * att;
					}
					return -att;
				});
			"step 1";
			if (result.bool && result.targets && result.targets.length) {
				event.target = result.targets[0];
				player.logSkill("mbmumu", event.target);
				player.line(event.target, "green");
				var e = event.target.getEquips(2);
				event.e = e;
				if (e.length > 0) {
					player.chooseControl("弃置一张装备牌", "获得一张防具牌").set("ai", function () {
						if (_status.event.player.getEquips(2).length > 0) {
							return "弃置一张装备牌";
						}
						return "获得一张防具牌";
					});
				} else {
					event.choice = "弃置一张装备牌";
				}
			} else {
				event.finish();
			}
			"step 2";
			var choice = event.choice || result.control;
			if (choice == "弃置一张装备牌") {
				player.discardPlayerCard(event.target, "e", true);
			} else {
				if (event.e) {
					player.gain(event.e, event.target, "give", "bySelf");
					player.addTempSkill("new_mumu_notsha");
				}
			}
		},
	},
	mbmeibu: {
		inherit: "new_meibu",
		derivation: ["mbzhixi"],
		content() {
			"step 0";
			var check = lib.skill.new_meibu.checkx(trigger, player);
			player
				.chooseToDiscard(get.prompt2("mbmeibu", trigger.player), "he")
				.set("ai", function (card) {
					if (_status.event.check) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set("check", check)
				.set("logSkill", ["mbmeibu", trigger.player]);
			"step 1";
			if (result.bool) {
				var target = trigger.player;
				var card = result.cards[0];
				player.line(target, "green");
				target.addTempSkills("mbzhixi", "phaseUseAfter");
				if (card.name != "sha" && !(get.type(card, "trick") == "trick" && get.color(card) == "black")) {
					target.addTempSkill("new_meibu_range", "phaseUseAfter");
					target.markAuto("new_meibu_range", player);
				}
				target.markSkillCharacter(
					"mbmeibu",
					player,
					"魅步",
					"锁定技。出牌阶段，若你于此阶段使用过的牌数不小于X，你不能使用牌（X为你的体力值）；当你使用锦囊牌时，你结束此阶段。"
				);
			}
		},
	},
	mbzhixi: {
		mod: {
			cardEnabled(card, player) {
				if (player.countMark("mbzhixi") >= player.hp) {
					return false;
				}
			},
			cardUsable(card, player) {
				if (player.countMark("mbzhixi") >= player.hp) {
					return false;
				}
			},
			cardSavable(card, player) {
				if (player.countMark("mbzhixi") >= player.hp) {
					return false;
				}
			},
		},
		trigger: {
			player: "useCard1",
		},
		forced: true,
		popup: false,
		firstDo: true,
		init(player, skill) {
			player.storage[skill] = 0;
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.player == player) {
				player.getHistory("useCard", function (evtx) {
					if (evtx.getParent("phaseUse") == evt) {
						player.storage[skill]++;
					}
				});
			}
		},
		onremove(player) {
			player.unmarkSkill("mbmeibu");
			delete player.storage.mbzhixi;
		},
		content() {
			player.addMark("mbzhixi", 1, false);
			player.addTempSkill("mbzhixi_clear", "phaseChange");
			if (get.type2(trigger.card) == "trick") {
				var evt = trigger.getParent("phaseUse");
				if (evt && evt.player == player) {
					evt.skipped = true;
					game.log(player, "结束了出牌阶段");
				}
			}
		},
		subSkill: {
			clear: {
				charlotte: true,
				onremove(player) {
					player.clearMark("mbzhixi", false);
				},
			},
		},
		ai: {
			presha: true,
			pretao: true,
			neg: true,
			nokeep: true,
		},
	},
	//庞统
	xinlianhuan: {
		audio: 2,
		audioname: ["ol_pangtong"],
		inherit: "lianhuan",
		group: "xinlianhuan_add",
		subSkill: {
			add: {
				audio: "xinlianhuan",
				audioname: ["ol_pangtong"],
				trigger: { player: "useCard2" },
				filter(event, player) {
					if (event.card.name != "tiesuo") {
						return false;
					}
					var info = get.info(event.card);
					if (info.allowMultiple == false) {
						return false;
					}
					if (event.targets && !info.multitarget) {
						if (
							game.hasPlayer(current => {
								return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current);
							})
						) {
							return true;
						}
					}
					return false;
				},
				charlotte: true,
				forced: true,
				popup: false,
				content() {
					"step 0";
					player
						.chooseTarget(
							get.prompt("xinlianhuan"),
							"为" + get.translation(trigger.card) + "额外指定一个目标",
							(card, player, target) => {
								return !_status.event.sourcex.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
							}
						)
						.set("sourcex", trigger.targets)
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.effect(target, _status.event.card, player, player);
						})
						.set("card", trigger.card);
					"step 1";
					if (result.bool) {
						if (!event.isMine() && !event.isOnline()) {
							game.delayex();
						}
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						var targets = result.targets;
						player.logSkill("xinlianhuan_add", targets);
						trigger.targets.addArray(targets);
						game.log(targets, "也成为了", trigger.card, "的目标");
					}
				},
			},
		},
	},
	//吴班
	xinjintao: {
		audio: "jintao",
		inherit: "jintao",
		content() {
			var evt = trigger.getParent("phaseUse");
			var index = player
				.getHistory("useCard", function (evtx) {
					return evtx.card.name == "sha" && evtx.getParent("phaseUse") == evt;
				})
				.indexOf(trigger);
			if (index == 0) {
				game.log(trigger.card, "不可被响应");
				trigger.directHit.addArray(game.players);
			} else {
				game.log(trigger.card, "伤害+1");
				if (typeof trigger.baseDamage != "number") {
					trigger.baseDamage = 1;
				}
				trigger.baseDamage++;
			}
		},
	},
	//鲍信
	mutao: {
		audio: "twmutao",
		inherit: "twmutao",
		filterTarget(card, player, target) {
			return target.countCards("h");
		},
		async content(event, trigger, player) {
			const source = event.target;
			const cards = source.getCards("h", { name: "sha" });
			if (!cards.length) {
				game.log("但", source, "没有", "#y杀", "！");
				return;
			}
			const next = source.addToExpansion(cards, source, "give");
			next.gaintag.add("mutao");
			await next;
			let togive = source;
			while (source.getExpansions("mutao").length) {
				togive = togive.getNext();
				await source.give(source.getExpansions("mutao").randomGet(), togive);
			}
			source.line(togive);
			let num = togive.countCards("h", { name: "sha" });
			if (num) {
				await togive.damage(Math.min(2, num), source);
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
	},
	yimou: {
		audio: ["twyimou1.mp3", "yimou.mp3"],
		filter(event, player) {
			return event.player.isIn() && get.distance(event.player, player) <= 1;
		},
		inherit: "twyimou",
		content() {
			"step 0";
			if (trigger.player != player) {
				player.addExpose(0.3);
			}
			var target = get.translation(trigger.player);
			var choiceList = ["令" + target + "获得牌堆里的一张【杀】", "令" + target + "将一张手牌交给另一名角色，然后" + target + "摸一张牌"];
			var list = ["选项一"];
			if (trigger.player.countCards("h") && game.hasPlayer(t => t !== trigger.player)) {
				list.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			player
				.chooseControl(list)
				.set("prompt", "毅谋：请选择一项")
				.set("choiceList", choiceList)
				.set("ai", function () {
					var evt = _status.event.getTrigger(),
						list = _status.event.list;
					var player = _status.event.player;
					var target = evt.player;
					if (target.countCards("h") && list.includes("选项二")) {
						return "选项二";
					}
					return "选项一";
				})
				.set("list", list);
			"step 1";
			event.choice = result.control;
			"step 2";
			if (event.choice != "选项二") {
				var card = get.cardPile2(function (card) {
					return card.name == "sha";
				});
				if (card) {
					trigger.player.gain(card, "gain2");
				} else {
					game.log("但牌堆里已经没有", "#y杀", "了！");
				}
				if (event.choice == "选项一") {
					event.finish();
				}
			}
			"step 3";
			if (event.choice != "选项一") {
				if (trigger.player.countCards("h") && game.hasPlayer(t => t !== trigger.player)) {
					trigger.player.chooseCardTarget({
						prompt: "毅谋：将一张手牌交给另一名其他角色",
						filterCard: true,
						forced: true,
						filterTarget: lib.filter.notMe,
						ai1(card) {
							return 1 / Math.max(0.1, get.value(card));
						},
						ai2(target) {
							var player = _status.event.player,
								att = get.attitude(player, target);
							if (target.hasSkillTag("nogain")) {
								att /= 9;
							}
							return 4 + att;
						},
					});
				} else {
					event.finish();
				}
			}
			"step 4";
			if (!result?.bool || !result.cards?.length || !result.targets?.length) {
				return;
			}
			var target = result.targets[0];
			trigger.player.line(target);
			trigger.player.give(result.cards, target);
			trigger.player.draw();
		},
	},
	//蒋济
	jilun: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.hasSkill("twjichou", null, false, false);
		},
		async cost(event, trigger, player) {
			const num = Math.min(Math.max(1, player.getStorage("twjichou").length), 3);
			const list = get
				.inpileVCardList(info => {
					return info[0] == "basic" && !player.getStorage(event.skill).includes(info[2]);
				})
				.addArray(
					player
						.getStorage("twjichou")
						.filter(name => !player.getStorage(event.skill).includes(name))
						.map(name => ["锦囊", "", name])
				);
			const result = await player
				.chooseButton([
					`###${get.prompt(event.skill)}###摸${get.cnNumber(num)}张牌或者视为使用一张牌`,
					[[[num, `摸${get.cnNumber(num)}张牌`]], "tdnodes"],
					[list, "vcard"],
				])
				.set("filterButton", button => {
					const { player, numx } = get.event();
					const { link } = button;
					if (!Array.isArray(link)) {
						return true;
					}
					return (
						player.hasUseTarget({ name: link[2], nature: link[3] }) &&
						(get.type(link[2]) == "basic" ||
							game.countPlayer(current => {
								return player.canUse({ name: link[2], nature: link[3] }, current);
							}) <= numx)
					);
				})
				.set("ai", button => {
					const { player, numx } = get.event();
					const { link } = button;
					const val = numx > 2 ? Math.min(1.5, 1 + (numx - 2) * 0.1) : 1;
					if (Array.isArray(link)) {
						if (player.getUseValue({ name: link[2], nature: link[3] }) > 4 * val) {
							return 1;
						}
					}
					if (typeof link == "number") {
						return 1;
					}
					return 0;
				})
				.set("numx", num)
				.forResult();
			event.result = {
				bool: result?.bool,
				cost_data: result?.links,
			};
		},
		async content(event, trigger, player) {
			const { cost_data: links } = event;
			if (typeof links[0] == "number") {
				await player.draw(links[0]);
			} else {
				const card = get.autoViewAs({ name: links[0][2], nature: links[0][3], isCard: true });
				player.markAuto(event.name, [card.name]);
				await player.chooseUseTarget(card, true);
			}
		},
		marktext: "论",
		intro: { content: "已记录牌名：$" },
		onremove: true,
		ai: { combo: "twjichou" },
	},
	//李遗
	jiaohua: {
		onremove: true,
		audio: "twjiaohua",
		enable: "phaseUse",
		usable: 2,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###教化###选择一种牌的类型，令一名角色从牌堆获得此类型的一张牌");
			},
			chooseControl(event, player) {
				var list = ["basic", "trick", "equip"].filter(type => !player.getStorage("jiaohua").includes(type));
				list.push("cancel2");
				return list;
			},
			check(event, player) {
				var list = ["trick", "equip", "basic"].filter(type => !player.getStorage("jiaohua").includes(type));
				return list[0];
			},
			backup(result, player) {
				return {
					type: result.control,
					audio: "twjiaohua",
					filterCard: () => false,
					selectCard: -1,
					filterTarget: true,
					content() {
						"step 0";
						var type = lib.skill.jiaohua_backup.type;
						var card = get.cardPile2(card => get.type2(card) == type);
						if (card) {
							target.gain(card, "gain2");
						} else {
							game.log("但牌堆里已经没有", "#y" + get.translation(type) + "牌", "了！");
						}
						"step 1";
						player.markAuto("jiaohua", [lib.skill.jiaohua_backup.type]);
						"step 2";
						if (!["basic", "trick", "equip"].some(type => !player.getStorage("jiaohua").includes(type))) {
							player.popup("教化");
							player.unmarkAuto("jiaohua", player.getStorage("jiaohua"));
							game.log(player, "清空了", "#g【教化】", "记录");
						}
					},
					ai: {
						result: { target: 1 },
					},
				};
			},
			prompt(result, player) {
				return "令一名角色从牌堆中获得一张" + get.translation(result.control) + "牌";
			},
		},
		ai: {
			order: 7,
			result: { player: 1 },
		},
		intro: { content: "已记录$牌" },
	},
	//来敏
	laishou: {
		audio: 3,
		trigger: { player: ["damageBegin4", "phaseZhunbeiBegin"] },
		filter(event, player) {
			var num = 9;
			if (event.name == "damage") {
				return event.num >= player.getHp() && player.maxHp < num;
			}
			return player.maxHp >= num;
		},
		forced: true,
		logAudio(event, player) {
			if (event.name == "damage") {
				return 2;
			}
			return "laishou3.mp3";
		},
		async content(event, trigger, player) {
			if (trigger.name == "damage") {
				await player.gainMaxHp(trigger.num);
				trigger.cancel();
			} else {
				await player.die();
			}
		},
	},
	luanqun: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h");
		},
		usable: 1,
		contentBefore() {
			player.line(game.filterPlayer(current => current.countCards("h")));
		},
		async content(event, trigger, player) {
			const targets = game.filterPlayer(current => current.countCards("h")).sortBySeat();
			const next = player
				.chooseCardOL(targets, "乱群：请选择要展示的牌", true)
				.set("ai", function (card) {
					return -get.value(card);
				})
				.set("source", player);
			next.aiCard = function (target) {
				var hs = target.getCards("h");
				return { bool: true, cards: [hs.randomGet()] };
			};
			next._args.remove("glow_result");
			const result = await next.forResult();
			const cards = result.map(i => i.cards[0]);
			await player
				.showCards(cards, get.translation(player) + "发动了【乱群】")
				.set("customButton", button => {
					const target = get.owner(button.link);
					if (target) {
						button.node.gaintag.innerHTML = target.getName();
					}
				})
				.set("delay_time", 4)
				.set("showers", targets);
			const card = cards[targets.indexOf(player)];
			const cardx = cards.filter(cardy => cardy != card && get.color(cardy, targets[cards.indexOf(cardy)]) == get.color(card, player));
			if (cardx.length) {
				const num = get.mode() == "identity" ? 4 : 2;
				const result = await player
					.chooseButton(["乱群：是否获得其中至多" + get.cnNumber(num) + "张牌", cardx])
					.set("forceAuto", true)
					.set("ai", function (button) {
						var cards = _status.event.list[0];
						var targets = _status.event.list[1];
						var player = _status.event.player;
						if (get.attitude(player, targets[cards.indexOf(button.link)]) > 0) {
							return 0;
						}
						return get.value(button.link, player);
					})
					.set("selectButton", [1, num])
					.set("list", [cards, targets])
					.forResult();
				if (result?.links?.length) {
					await player.gain(result.links, "give");
				}
			}
			const targetsx = targets.filter(target => get.color(cards[targets.indexOf(target)], target) != get.color(card, player));
			if (targetsx.length) {
				player.line(targetsx);
				targetsx.forEach(target => {
					target.addTempSkill("luanqun_effect", { player: "phaseUseAfter" });
					target.markAuto("luanqun_effect", [player]);
					target.addTempSkill("luanqun_directHit", { player: "phaseEnd" });
					target.markAuto("luanqun_directHit", [player]);
				});
			}
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					if (player.hasSkill("laishou")) {
						return 1;
					}
					return player.hp >= 2 ? 1 : 0;
				},
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					playerEnabled(card, player, target) {
						if (!player.isPhaseUsing()) {
							return;
						}
						if (card.name == "sha" && !player.getStorage("luanqun_effect").includes(target)) {
							return false;
						}
					},
				},
				trigger: { player: "useCard1" },
				filter(event, player) {
					return player.isPhaseUsing() && event.card.name == "sha";
				},
				firstDo: true,
				forced: true,
				content() {
					player.removeSkill("luanqun_effect");
				},
			},
			directHit: {
				charlotte: true,
				onremove: true,
				intro: { content: "出牌阶段第一张【杀】只能指定$为目标，且其不可响应你回合内使用的【杀】" },
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return (
						player === _status.currentPhase &&
						event.card.name == "sha" &&
						player.getStorage("luanqun_directHit").some(tar => {
							return event.targets.includes(tar);
						})
					);
				},
				forced: true,
				logTarget(event, player) {
					return player.getStorage("luanqun_directHit");
				},
				content() {
					trigger.directHit.addArray(player.getStorage("luanqun_directHit"));
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (tag === "directHit_ai") {
							return player.getStorage("luanqun_directHit").includes(arg.target);
						}
					},
				},
			},
		},
	},
	//郭照
	yichong: {
		initSkill(skill) {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					charlotte: true,
					onremove: true,
					mark: true,
					marktext: "雀",
					intro: {
						markcount(storage) {
							return (storage || 0).toString();
						},
						content(storage) {
							return "已被掠夺" + (storage || 0) + "张牌";
						},
					},
				};
				lib.translate[skill] = "易宠";
				lib.translate[skill + "_bg"] = "雀";
			}
		},
		getLimit: 1,
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("yichong"), "选择一名其他角色并选择一个花色，获得其此花色的所有牌并令其获得“雀”标记", lib.filter.notMe)
				.set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target);
					if (att > 0) {
						return 0;
					}
					var getNum = function (player) {
						var list = [];
						for (var i of lib.suit) {
							list.push(player.countCards("he", { suit: i }) + 3);
						}
						return list.sort((a, b) => b - a)[0];
					};
					return getNum(target) + target.countCards("h") / 10;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("yichong", target);
				event.target = target;
				player
					.chooseControl(lib.suit.slice(0).reverse())
					.set("prompt", "请声明一个花色")
					.set("ai", function () {
						var target = _status.event.target,
							cards = target.getCards("he");
						var suits = lib.suit.slice(0);
						suits.sort(function (a, b) {
							var num = function (suit) {
								return cards.filter(function (card) {
									return get.suit(card) == suit;
								}).length;
							};
							return num(b) - num(a);
						});
						return suits[0];
					})
					.set("target", target);
			} else {
				event.finish();
			}
			"step 2";
			var suit = result.control;
			event.suit = suit;
			player.chat(get.translation(suit + 2));
			game.log(player, "选择了", "#y" + get.translation(suit + 2));
			if (target.countCards("e", { suit: suit })) {
				player.gain(target.getCards("e", { suit: suit }), target, "giveAuto");
			}
			"step 3";
			var suit = event.suit;
			if (target.countCards("h", { suit: suit })) {
				player.chooseButton(["选择获得其中一张牌", target.getCards("h", { suit: suit })], true).set("ai", button => get.value(button.link));
			} else {
				event.goto(5);
			}
			"step 4";
			if (result.bool) {
				var card = result.links[0];
				if (lib.filter.canBeGained(card, player, target)) {
					player.gain(card, target, "giveAuto", "bySelf");
				} else {
					game.log("但", card, "不能被", player, "获得！");
				}
			}
			"step 5";
			var suit = event.suit;
			player.storage.yichong = suit;
			player.markSkill("yichong");
			var skill = "yichong_" + player.playerid;
			game.broadcastAll(lib.skill.yichong.initSkill, skill);
			game.broadcastAll(
				function (player, suit) {
					if (player.marks.yichong) {
						player.marks.yichong.firstChild.innerHTML = get.translation(suit);
					}
				},
				player,
				suit
			);
			game.countPlayer(function (current) {
				current.removeSkill("yichong_" + player.playerid);
				if (current == target) {
					target.addSkill("yichong_" + player.playerid);
				}
			});
			player.addTempSkill("yichong_clear", { player: "phaseBegin" });
		},
		onremove: true,
		intro: { content: "拥有“雀”标记的角色得到$牌后，你获得之" },
		group: "yichong_gain",
		subSkill: {
			gain: {
				audio: "yichong",
				trigger: { global: ["gainAfter", "loseAsyncAfter"] },
				filter(event, player) {
					if (!player.storage.yichong) {
						return false;
					}
					return game.hasPlayer(function (current) {
						if (!event.getg(current).length || !current.hasSkill("yichong_" + player.playerid)) {
							return false;
						}
						if (current.countMark("yichong_" + player.playerid) >= lib.skill.yichong.getLimit) {
							return false;
						}
						return event
							.getg(current)
							.some(card => get.suit(card, current) == player.storage.yichong && lib.filter.canBeGained(card, current, player));
					});
				},
				forced: true,
				content() {
					var target = game.findPlayer(function (current) {
						if (!trigger.getg(current).length || !current.hasSkill("yichong_" + player.playerid)) {
							return false;
						}
						if (current.countMark("yichong_" + player.playerid) >= lib.skill.yichong.getLimit) {
							return false;
						}
						return trigger
							.getg(current)
							.some(card => get.suit(card, current) == player.storage.yichong && lib.filter.canBeGained(card, current, player));
					});
					var cards = trigger
						.getg(target)
						.filter(card => get.suit(card, target) == player.storage.yichong && lib.filter.canBeGained(card, target, player));
					var num = lib.skill.yichong.getLimit - target.countMark("yichong_" + player.playerid);
					cards = cards.randomGets(num);
					player.gain(cards, target, "giveAuto");
					target.addMark("yichong_" + player.playerid, cards.length, false);
				},
			},
			clear: {
				charlotte: true,
				onremove(player) {
					game.countPlayer(function (current) {
						current.removeSkill("yichong_" + player.playerid);
					});
				},
			},
		},
	},
	wufei: {
		audio: 2,
		trigger: { player: ["useCardToPlayered", "damageEnd"] },
		filter(event, player) {
			var target = game.findPlayer(current => current.hasSkill("yichong_" + player.playerid));
			if (!target) {
				return false;
			}
			if (event.name == "damage") {
				return target.hp > 3;
			}
			return event.isFirstTarget && (event.card.name == "sha" || (get.type(event.card) == "trick" && get.tag(event.card, "damage")));
		},
		direct: true,
		content() {
			"step 0";
			var target = game.findPlayer(current => current.hasSkill("yichong_" + player.playerid));
			event.target = target;
			if (trigger.name == "damage") {
				player
					.chooseBool(get.prompt("wufei", target), "令" + get.translation(target) + "受到1点无来源伤害")
					.set("choice", get.damageEffect(target, player, player) > 0);
			} else {
				player.logSkill("wufei", target);
				player.addTempSkill("wufei_effect");
				player.markAuto("wufei_effect", [trigger.card]);
				game.log(target, "成为了", trigger.card, "的伤害来源");
				event.finish();
			}
			"step 1";
			if (result.bool) {
				player.logSkill("wufei", target);
				target.damage("nosource");
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { source: "damageBefore" },
				filter(event, player) {
					if (!event.card) {
						return false;
					}
					return player.getStorage("wufei_effect").includes(event.card);
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					var target = game.findPlayer(current => current.hasSkill("yichong_" + player.playerid));
					if (!target) {
						delete trigger.source;
					} else {
						trigger.source = target;
					}
				},
			},
		},
		ai: {
			combo: "yichong",
		},
	},
	//张嶷
	xinwurong: {
		audio: 3,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		logAudio: index => (typeof index === "number" ? "xinwurong" + index + ".mp3" : 1),
		content() {
			"step 0";
			player
				.chooseToDuiben(target)
				.set("title", "谋弈")
				.set("namelist", ["反抗", "归顺", "镇压", "安抚"])
				.set("translationList", [
					`对方选择镇压：${get.translation(player)}对你造成1点伤害，然后其摸一张牌<br>对方选择安抚：${get.translation(player)}受到1点伤害，然后其摸两张牌`,
					`对方选择镇压：${get.translation(player)}获得你一张牌，然后其交给你两张牌<br>对方选择安抚：你须交给${get.translation(player)}两张牌（若你牌数不足两张，则改为其令你跳过你下个摸牌阶段）`,
					`对方选择反抗：你对${get.translation(target)}造成1点伤害，然后你摸一张牌<br>对方选择归顺：你获得${get.translation(target)}一张牌，然后你交给其两张牌`,
					`对方选择反抗：你受到1点伤害，然后你摸两张牌<br>对方选择归顺：${get.translation(target)}须交给你两张牌（若其牌数不足两张，则改为令其跳过其下个摸牌阶段）`,
				])
				.set("ai", button => 1 + Math.random());
			"step 1";
			if (result.bool) {
				player.logSkill("xinwurong", target, null, null, [result.player == "db_def1" ? 3 : 2]);
				if (result.player == "db_def1") {
					target.damage();
					player.draw();
					event.finish();
				} else {
					var cards = target.getCards("he");
					if (cards.length < 2) {
						target.skip("phaseDraw");
						target.addTempSkill("xinwurong_skip", { player: "phaseDrawSkipped" });
						event.finish();
					} else if (cards.length == 2) {
						event._result = { bool: true, cards: cards };
					} else {
						target.chooseCard("怃戎：交给" + get.translation(player) + "两张牌", 2, true, "he");
					}
				}
			} else {
				if (result.player == "db_def1") {
					player.gainPlayerCard(target, "he", true);
					event.goto(3);
				} else {
					player.damage();
					player.draw(2);
					event.finish();
				}
			}
			"step 2";
			if (result.bool) {
				player.gain(result.cards, target, "giveAuto");
			}
			event.finish();
			"step 3";
			var cards = player.getCards("he");
			if (!cards.length) {
				event.finish();
			} else if (cards.length <= 2) {
				event._result = { bool: true, cards: cards };
			} else {
				player.chooseCard("怃戎：交给" + get.translation(target) + "两张牌", 2, true, "he");
			}
			"step 4";
			if (result.bool) {
				target.gain(result.cards, player, "giveAuto");
			}
		},
		ai: {
			order: 7,
			result: {
				player: 1,
				target: -1,
			},
		},
		subSkill: {
			skip: {
				charlotte: true,
				mark: true,
				intro: { content: "跳过下个摸牌阶段" },
			},
		},
	},
	//孙亮
	xinkuizhu: {
		audio: "nzry_kuizhu",
		trigger: { player: "phaseDiscardAfter" },
		filter(event, player) {
			return player.getHistory("lose", function (evt) {
				return evt.type == "discard" && evt.getParent("phaseDiscard") == event;
			}).length;
		},
		direct: true,
		content() {
			"step 0";
			var cards = [];
			player.getHistory("lose", function (evt) {
				if (evt.type == "discard" && evt.getParent("phaseDiscard") == trigger) {
					cards.addArray(evt.cards2);
				}
			});
			event.num = cards.length;
			event.str1 = "令至多" + event.num + "名角色摸一张牌";
			event.str2 = "对任意名体力值之和为" + event.num + "的角色造成1点伤害";
			player
				.chooseControl("cancel2")
				.set("ai", function () {
					if (
						game.countPlayer(function (current) {
							return get.attitude(player, current) < 0 && current.hp == event.num;
						}) > 0 &&
						event.num <= 3
					) {
						return 1;
					}
					return 0;
				})
				.set("choiceList", [event.str1, event.str2])
				.set("prompt", "是否发动【溃诛】？");
			"step 1";
			if (result.control == "cancel2") {
				event.finish();
			}
			event.control = [event.str1, event.str2][result.index];
			"step 2";
			var str = "请选择〖溃诛〗的目标";
			if (event.bool == false) {
				str = "<br>所选目标体力之和不足" + event.num + "，请重选";
			}
			if (event.control == event.str2) {
				player
					.chooseTarget(str, function (card, player, target) {
						var targets = ui.selected.targets;
						var num = 0;
						for (var i = 0; i < targets.length; i++) {
							num += targets[i].hp;
						}
						return num + target.hp <= _status.event.num;
					})
					.set("ai", function (target) {
						if (ui.selected.targets[0] != undefined) {
							return -1;
						}
						return get.attitude(player, target) < 0;
					})
					.set("promptbar", "none")
					.set("num", event.num)
					.set("selectTarget", function () {
						var targets = ui.selected.targets;
						var num = 0;
						for (var i = 0; i < targets.length; i++) {
							num += targets[i].hp;
						}
						if (num == _status.event.num) {
							return ui.selected.targets.length;
						}
						return ui.selected.targets.length + 1;
					});
			} else {
				player
					.chooseTarget("请选择〖溃诛〗的目标", "令至多" + get.cnNumber(event.num) + "名角色各摸一张牌", [1, event.num])
					.set("ai", function (target) {
						return get.attitude(_status.event.player, target);
					});
			}
			"step 3";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				if (event.control == event.str1) {
					player.logSkill("xinkuizhu", targets);
					game.asyncDraw(targets);
				} else {
					var num = 0;
					for (var i = 0; i < targets.length; i++) {
						num += targets[i].hp;
					}
					if (num < event.num) {
						event.bool = false;
						event.goto(2);
					} else {
						player.logSkill("xinkuizhu", targets);
						for (var i of targets) {
							i.damage();
						}
						if (targets.length >= 2) {
							player.loseHp();
						}
					}
				}
			}
		},
	},
	xinzhizheng: {
		audio: "nzry_zhizheng",
		mod: {
			playerEnabled(card, player, target) {
				var info = get.info(card);
				if (
					target != player &&
					(!info || !info.singleCard || !ui.selected.targets.length) &&
					player.isPhaseUsing() &&
					!target.inRange(player)
				) {
					return false;
				}
			},
		},
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return (
				player.getHistory("useCard", function (evt) {
					return evt.getParent("phaseUse") == event;
				}).length <
					game.countPlayer(function (current) {
						return current != player && !current.inRange(player);
					}) &&
				game.hasPlayer(function (target) {
					return target != player && !target.inRange(player) && target.countDiscardableCards(player, "he");
				})
			);
		},
		forced: true,
		content() {
			"step 0";
			player
				.chooseTarget("请选择〖掣政〗的目标", "弃置一名攻击范围内不包含你的角色的一张牌", true, function (card, player, target) {
					return target != player && !target.inRange(player) && target.countDiscardableCards(player, "he");
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				});
			"step 1";
			if (result.bool) {
				player.line(result.targets);
				player.discardPlayerCard(result.targets[0], "he", true);
			}
		},
	},
	xinlijun: {
		audio: "nzry_lijun1",
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			if (_status.currentPhase != event.player || event.player.group != "wu") {
				return false;
			}
			if (!player.hasZhuSkill("xinlijun", event.player) || player == event.player) {
				return false;
			}
			return event.cards.filterInD().length;
		},
		zhuSkill: true,
		direct: true,
		content() {
			"step 0";
			trigger.player
				.chooseBool(get.prompt("xinlijun"), "将" + get.translation(trigger.cards) + "交给" + get.translation(player))
				.set("choice", get.attitude(trigger.player, player) > 0);
			"step 1";
			if (result.bool) {
				player.logSkill("xinlijun", trigger.player);
				player.gain(trigger.cards.filterInD(), "gain2");
				player
					.chooseBool()
					.set("prompt", "是否令" + get.translation(trigger.player) + "摸一张牌？")
					.set("choice", get.attitude(player, trigger.player) > 0);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				trigger.player.draw();
			}
		},
	},
	//十常侍
	mbdanggu: {
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		derivation: [
			"mbdanggu_faq",
			"mbdanggu_faq2",
			"scstaoluan",
			"scschiyan",
			"scszimou",
			"scspicai",
			"scsyaozhuo",
			"scsxiaolu",
			"scskuiji",
			"scschihe",
			"scsniqu",
			"scsmiaoyu",
		],
		forced: true,
		unique: true,
		onremove(player) {
			delete player.storage.mbdanggu;
			delete player.storage.mbdanggu_current;
			if (lib.skill.mbdanggu.isSingleShichangshi(player)) {
				game.broadcastAll(function (player) {
					player.name1 = player.name;
					player.skin.name = player.name;
					player.smoothAvatar(false);
					player.node.avatar.setBackground(player.name, "character");
					player.node.name.innerHTML = get.slimName(player.name);
					delete player.name2;
					delete player.skin.name2;
					player.classList.remove("fullskin2");
					player.node.avatar2.classList.add("hidden");
					player.node.name2.innerHTML = "";
					if (player == game.me && ui.fakeme) {
						ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
					}
				}, player);
			}
		},
		changshi: [
			["scs_zhangrang", "scstaoluan"],
			["scs_zhaozhong", "scschiyan"],
			["scs_sunzhang", "scszimou"],
			["scs_bilan", "scspicai"],
			["scs_xiayun", "scsyaozhuo"],
			["scs_hankui", "scsxiaolu"],
			["scs_lisong", "scskuiji"],
			["scs_duangui", "scschihe"],
			["scs_guosheng", "scsniqu"],
			["scs_gaowang", "scsmiaoyu"],
		],
		conflictMap(player) {
			if (!_status.changshiMap) {
				_status.changshiMap = {
					scs_zhangrang: [],
					scs_zhaozhong: [],
					scs_sunzhang: [],
					scs_bilan: ["scs_hankui"],
					scs_xiayun: [],
					scs_hankui: ["scs_bilan"],
					scs_lisong: [],
					scs_duangui: ["scs_guosheng"],
					scs_guosheng: ["scs_duangui"],
					scs_gaowang: [],
				};
				if (!get.isLuckyStar(player)) {
					var list = lib.skill.mbdanggu.changshi.map(i => i[0]);
					for (var i of list) {
						var select = list.filter(scs => scs != i && !_status.changshiMap[i].includes(i));
						_status.changshiMap[i].addArray(select.randomGets(get.rand(0, select.length)));
					}
				}
			}
			return _status.changshiMap;
		},
		async content(event, trigger, player) {
			const list = lib.skill.mbdanggu.changshi.map(i => i[0]);
			player.markAuto("mbdanggu", list);
			game.broadcastAll(
				function (player, list) {
					const cards = [];
					for (let i = 0; i < list.length; i++) {
						const cardname = "huashen_card_" + list[i];
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
			const next = game.createEvent("mbdanggu_clique");
			next.player = player;
			next.setContent(lib.skill.mbdanggu.contentx);
			await next;
		},
		async contentx(event, trigger, player) {
			let list = player.getStorage("mbdanggu").slice();
			const first = list.randomRemove();
			const others = list.randomGets(4);
			let result;
			if (others.length == 1) {
				result = { bool: true, links: others };
			} else {
				const map = {
						scs_bilan: "scs_hankui",
						scs_hankui: "scs_bilan",
						scs_duangui: "scs_guosheng",
						scs_guosheng: "scs_duangui",
					},
					map2 = lib.skill.mbdanggu.conflictMap(player);
				const conflictList = others.filter(changshi => {
					if (map[first] && others.some(changshi2 => map[first] == changshi2)) {
						return map[first] == changshi;
					} else {
						return map2[first].includes(changshi);
					}
				});
				list = others.slice();
				if (conflictList.length) {
					const conflict = conflictList.randomGet();
					list.remove(conflict);
					game.broadcastAll(
						function (changshi, player) {
							if (lib.config.background_speak) {
								if (player.isUnderControl(true)) {
									game.playAudio("skill", changshi + "_enter");
								}
							}
						},
						conflict,
						player
					);
				}
				result = await player
					.chooseButton(
						["党锢：请选择结党对象", [[first], "character"], '<div class="text center">可选常侍</div>', [others, "character"]],
						true
					)
					.set("filterButton", button => {
						return _status.event.canChoose.includes(button.link);
					})
					.set("canChoose", list)
					.set("ai", button => Math.random() * 10)
					.forResult();
			}
			if (result?.bool) {
				const chosen = result.links[0];
				const skills = [];
				list = lib.skill.mbdanggu.changshi;
				const changshis = [first, chosen];
				player.unmarkAuto("mbdanggu", changshis);
				player.storage.mbdanggu_current = changshis;
				for (const changshi of changshis) {
					for (const cs of list) {
						if (changshi == cs[0]) {
							skills.push(cs[1]);
						}
					}
				}
				if (lib.skill.mbdanggu.isSingleShichangshi(player)) {
					game.broadcastAll(
						function (player, first, chosen) {
							player.name1 = first;
							player.node.avatar.setBackground(first, "character");
							player.node.name.innerHTML = get.slimName(first);
							player.name2 = chosen;
							player.skin.name = first;
							player.skin.name2 = chosen;
							player.classList.add("fullskin2");
							player.node.avatar2.classList.remove("hidden");
							player.node.avatar2.setBackground(chosen, "character");
							player.node.name2.innerHTML = get.slimName(chosen);
							if (player == game.me && ui.fakeme) {
								ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
							}
						},
						player,
						first,
						chosen
					);
				}
				game.log(player, "选择了常侍", "#y" + get.translation(changshis));
				if (skills.length) {
					player.addAdditionalSkill("mbdanggu", skills);
					let str = "";
					for (const i of skills) {
						str += "【" + get.translation(i) + "】、";
						player.popup(i);
					}
					str = str.slice(0, -1);
					game.log(player, "获得了技能", "#g" + str);
				}
			}
		},
		isSingleShichangshi(player) {
			var map = lib.skill.mbdanggu.conflictMap(player);
			return (
				player.name == "shichangshi" &&
				((map[player.name1] && map[player.name2]) ||
					(map[player.name1] && !player.name2) ||
					(!player.name1 && !player.name2) ||
					(player.name == player.name1 && !player.name2))
			);
		},
		mod: {
			aiValue(player, card, num) {
				if (["shan", "tao", "wuxie", "caochuan"].includes(card.name)) {
					return num / 10;
				}
			},
			aiUseful() {
				return lib.skill.mbdanggu.mod.aiValue.apply(this, arguments);
			},
		},
		ai: {
			combo: "mbmowang",
			nokeep: true,
		},
		intro: {
			mark(dialog, storage, player) {
				dialog.addText("剩余常侍");
				dialog.addSmall([storage, "character"]);
				if (player.storage.mbdanggu_current && player.isIn()) {
					dialog.addText("当前常侍");
					dialog.addSmall([player.storage.mbdanggu_current, "character"]);
				}
			},
		},
	},
	mbmowang: {
		trigger: {
			player: ["dieBefore", "rest", "dieAfter"],
		},
		filter(event, player, name) {
			if (name == "rest") {
				return true;
			}
			if (name == "dieAfter") {
				return event.reserveOut;
			}
			return event.getParent().name != "giveup" && player.maxHp > 0;
		},
		derivation: "mbmowang_faq",
		forced: true,
		forceDie: true,
		forceOut: true,
		direct: true,
		priority: 15,
		group: ["mbmowang_die", "mbmowang_return"],
		async content(event, trigger, player) {
			if (event.triggername == "rest") {
				game.broadcastAll(
					function (player, list) {
						//player.classList.add("out");
						if (list.includes(player.name1) || player.name1 == "shichangshi") {
							player.smoothAvatar(false);
							player.skin.name = player.name1 + "_dead";
							player.node.avatar.setBackground(player.name1 + "_dead", "character");
						}
						if (list.includes(player.name2) || player.name2 == "shichangshi") {
							player.smoothAvatar(true);
							player.skin.name2 = player.name2 + "_dead";
							player.node.avatar2.setBackground(player.name2 + "_dead", "character");
						}
					},
					player,
					lib.skill.mbdanggu.changshi.map(i => i[0])
				);
			} else if (event.triggername == "dieAfter") {
				if (player.getStorage("mbdanggu").length) {
					game.broadcastAll(function () {
						if (lib.config.background_speak) {
							game.playAudio("die", "shichangshiRest");
						}
					});
					await player.rest({ type: "round", count: 1 }); //, audio: "shichangshiRest"
				}
			} else {
				if (player.isRest()) {
					trigger.cancel();
				} else {
					if (player.getStorage("mbdanggu").length) {
						player.logSkill("mbmowang");
						//煞笔十常侍
						trigger.excludeMark.add("mbdanggu");
						trigger.noDieAudio = true;
						//trigger.includeOut = true;
						trigger.reserveOut = true;
					} else {
						game.broadcastAll(function (player) {
							player.name1 = player.name;
							player.skin.name = player.name + "_dead";
							player.smoothAvatar(false);
							player.node.avatar.setBackground(player.name + "_dead", "character");
							player.node.name.innerHTML = get.slimName(player.name);
							delete player.name2;
							delete player.skin.name2;
							player.classList.remove("fullskin2");
							player.node.avatar2.classList.add("hidden");
							player.node.name2.innerHTML = "";
							if (player == game.me && ui.fakeme) {
								ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
							}
						}, player);
					}
				}
			}
		},
		ai: {
			combo: "mbdanggu",
			neg: true,
		},
		subSkill: {
			die: {
				audio: "mbmowang",
				trigger: { player: "phaseAfter" },
				forced: true,
				//forceDie: true,
				async content(event, trigger, player) {
					if (lib.skill.mbdanggu.isSingleShichangshi(player)) {
						if (!player.getStorage("mbdanggu").length) {
							game.broadcastAll(function (player) {
								player.name1 = player.name;
								player.skin.name = player.name + "_dead";
								player.smoothAvatar(false);
								player.node.avatar.setBackground(player.name + "_dead", "character");
								player.node.name.innerHTML = get.slimName(player.name);
								delete player.name2;
								delete player.skin.name2;
								player.classList.remove("fullskin2");
								player.node.avatar2.classList.add("hidden");
								player.node.name2.innerHTML = "";
								if (player == game.me && ui.fakeme) {
									ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
								}
							}, player);
						}
					}
					if (!player.getStorage("mbdanggu").length) {
						await game.delay();
					}
					await player.die();
				},
			},
			return: {
				trigger: { player: "restEnd" },
				forced: true,
				charlotte: true,
				silent: true,
				forceDie: true,
				forceOut: true,
				filter(event, player) {
					return event.player == player && player.hasSkill("mbdanggu", null, null, false);
				},
				async content(event, trigger, player) {
					game.broadcastAll(function (player) {
						if (player.name1 == "shichangshi") {
							player.smoothAvatar(false);
							player.node.avatar.setBackground(player.name1, "character");
							if (!lib.skill.mbdanggu.isSingleShichangshi(player)) {
								player.skin.name = player.name1;
							}
						}
						if (player.name2 == "shichangshi") {
							player.smoothAvatar(true);
							player.node.avatar2.setBackground(player.name2, "character");
							if (!lib.skill.mbdanggu.isSingleShichangshi(player)) {
								player.skin.name2 = player.name2;
							}
						}
					}, player);
					delete player.storage.mbdanggu_current;
					if (lib.skill.mbdanggu.isSingleShichangshi(player)) {
						game.broadcastAll(function (player) {
							player.name1 = player.name;
							player.skin.name = player.name;
							player.smoothAvatar(false);
							player.node.avatar.setBackground(player.name, "character");
							player.node.name.innerHTML = get.slimName(player.name);
							delete player.name2;
							delete player.skin.name2;
							player.classList.remove("fullskin2");
							player.node.avatar2.classList.add("hidden");
							player.node.name2.innerHTML = "";
							if (player == game.me && ui.fakeme) {
								ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
							}
						}, player);
					}
					const next = game.createEvent("mbdanggu_clique");
					next.player = player;
					next.setContent(lib.skill.mbdanggu.contentx);
					await next;
					await player.draw();
				},
			},
		},
	},
	//张让
	scstaoluan: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("hes") > 0;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						list.push(["基本", "", "sha"]);
						for (var j of lib.inpile_nature) {
							list.push(["基本", "", "sha", j]);
						}
					} else if (get.type(name) == "trick") {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) == "basic") {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("滔乱", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				if (player.countCards("hs", button.link[2]) > 0) {
					return 0;
				}
				if (button.link[2] == "wugu") {
					return;
				}
				var effect = player.getUseValue(button.link[2]);
				if (effect > 0) {
					return effect;
				}
				return 0;
			},
			backup(links, player) {
				return {
					filterCard: true,
					audio: "scstaoluan",
					selectCard: 1,
					popname: true,
					check(card) {
						return 6 - get.value(card);
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
				};
			},
			prompt(links, player) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 4,
			result: {
				player: 1,
			},
			threaten: 1.9,
		},
		subSkill: { backup: {} },
	},
	//赵忠
	scschiyan: {
		audio: 1,
		trigger: { player: "useCardToPlayered" },
		direct: true,
		filter(event, player) {
			return event.card.name == "sha" && event.target.hp > 0 && event.target.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.choosePlayerCard(trigger.target, "he", get.prompt("scschiyan", trigger.target));
			next.set("ai", function (button) {
				if (!_status.event.goon) {
					return 0;
				}
				var val = get.value(button.link);
				if (button.link == _status.event.target.getEquip(2)) {
					return 2 * (val + 3);
				}
				return val;
			});
			next.set("goon", get.attitude(player, trigger.target) <= 0);
			next.set("forceAuto", true);
			"step 1";
			if (result.bool) {
				var target = trigger.target;
				player.logSkill("scschiyan", target);
				target.addSkill("scschiyan_get");
				target.addToExpansion("giveAuto", result.cards, target).gaintag.add("scschiyan_get");
			}
		},
		ai: {
			unequip_ai: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (get.attitude(player, arg.target) > 0) {
					return false;
				}
				if (tag == "directHit_ai") {
					return arg.target.hp >= Math.max(1, arg.target.countCards("h") - 1);
				}
				if (arg && arg.name == "sha" && arg.target.getEquip(2)) {
					return true;
				}
				return false;
			},
		},
		group: "scschiyan_damage",
		subSkill: {
			get: {
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return player.getExpansions("scschiyan_get").length > 0;
				},
				content() {
					"step 0";
					var cards = player.getExpansions("scschiyan_get");
					player.gain(cards, "draw");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张“鸱咽”牌");
					"step 1";
					player.removeSkill("scschiyan_get");
				},
				intro: {
					markcount: "expansion",
					mark(dialog, storage, player) {
						var cards = player.getExpansions("scschiyan_get");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
				},
			},
			damage: {
				audio: "scschiyan",
				trigger: { source: "damageBegin1" },
				forced: true,
				locked: false,
				logTarget: "player",
				filter(event, player) {
					var target = event.player;
					return (
						event.getParent().name == "sha" &&
						player.countCards("h") >= target.countCards("h") &&
						player.countCards("e") >= target.countCards("e")
					);
				},
				content() {
					trigger.num++;
				},
			},
		},
	},
	//孙璋
	scszimou: {
		audio: 1,
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			var evt = event.getParent("phaseUse");
			if (!evt || evt.player != player) {
				return false;
			}
			var num = player.getHistory("useCard", evtx => evtx.getParent("phaseUse") == evt).length;
			return num == 2 || num == 4 || num == 6;
		},
		content() {
			var evt = trigger.getParent("phaseUse");
			var num = player.getHistory("useCard", evtx => evtx.getParent("phaseUse") == evt).length;
			var cards = [];
			if (num == 2) {
				var card = get.cardPile2(card => {
					return ["jiu", "xionghuangjiu"].includes(card.name);
				});
				if (card) {
					cards.push(card);
				}
			} else if (num == 4) {
				var card = get.cardPile2(card => {
					return card.name == "sha";
				});
				if (card) {
					cards.push(card);
				}
			} else if (num == 6) {
				var card = get.cardPile2(card => {
					return card.name == "juedou";
				});
				if (card) {
					cards.push(card);
				}
			}
			if (cards.length) {
				player.gain(cards, "gain2");
			}
		},
	},
	//毕岚
	scspicai: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		frequent: true,
		content() {
			"step 0";
			event.cards = [];
			event.suits = [];
			"step 1";
			player
				.judge(function (result) {
					var evt = _status.event.getParent("scspicai");
					if (evt && evt.suits && evt.suits.includes(get.suit(result))) {
						return 0;
					}
					return 1;
				})
				.set("callback", lib.skill.scspicai.callback).judge2 = function (result) {
				return result.bool ? true : false;
			};
			"step 2";
			var cards = cards.filterInD();
			if (cards.length) {
				player.chooseTarget("将" + get.translation(cards) + "交给一名角色", true).set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target) / Math.sqrt(1 + target.countCards("h"));
					if (target.hasSkillTag("nogain")) {
						att /= 10;
					}
					return att;
				});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "green");
				target.gain(cards, "gain2").giver = player;
			} else {
				event.finish();
			}
		},
		callback() {
			"step 0";
			var evt = event.getParent(2);
			event.getParent().orderingCards.remove(event.judgeResult.card);
			evt.cards.push(event.judgeResult.card);
			if (event.getParent().result.bool) {
				evt.suits.push(event.getParent().result.suit);
				player.chooseBool("是否继续发动【庀材】？").set("frequentSkill", "scspicai");
			} else {
				event._result = { bool: false };
			}
			"step 1";
			if (result.bool) {
				event.getParent(2).redo();
			}
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	//夏恽
	scsyaozhuo: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return player.canCompare(current);
			});
		},
		filterTarget(card, player, current) {
			return player.canCompare(current);
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				target.skip("phaseDraw");
				target.addTempSkill("scsyaozhuo_skip", { player: "phaseDrawSkipped" });
			} else {
				player.chooseToDiscard(2, true, "he");
			}
		},
		subSkill: {
			skip: {
				mark: true,
				intro: { content: "跳过下一个摸牌阶段" },
			},
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.skipList.includes("phaseDraw") || target.hasSkill("pingkou")) {
						return 0;
					}
					var hs = player.getCards("h").sort(function (a, b) {
						return b.number - a.number;
					});
					var ts = target.getCards("h").sort(function (a, b) {
						return b.number - a.number;
					});
					if (!hs.length || !ts.length) {
						return 0;
					}
					if (hs[0].number > ts[0].number - 2 && hs[0].number > 5) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	//韩悝
	scsxiaolu: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			player.draw(2);
			"step 1";
			var num = player.countCards("h");
			if (!num) {
				event.finish();
			} else if (num < 2) {
				event._result = { index: 1 };
			} else {
				player
					.chooseControl()
					.set("choiceList", ["将两张手牌交给一名其他角色", "弃置两张手牌"])
					.set("ai", function () {
						if (
							game.hasPlayer(function (current) {
								return current != player && get.attitude(player, current) > 0;
							})
						) {
							return 0;
						}
						return 1;
					});
			}
			"step 2";
			if (result.index == 0) {
				player.chooseCardTarget({
					position: "h",
					filterCard: true,
					selectCard: 2,
					filterTarget(card, player, target) {
						return player != target;
					},
					ai1(card) {
						return get.unuseful(card);
					},
					ai2(target) {
						var att = get.attitude(_status.event.player, target);
						if (target.hasSkillTag("nogain")) {
							att /= 10;
						}
						if (target.hasJudge("lebu")) {
							att /= 5;
						}
						return att;
					},
					prompt: "选择两张手牌，交给一名其他角色",
					forced: true,
				});
			} else {
				player.chooseToDiscard(2, true, "h");
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.give(result.cards, target);
			}
		},
		ai: {
			order: 9,
			result: { player: 2 },
		},
	},
	//栗嵩
	scskuiji: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		content() {
			"step 0";
			event.list1 = [];
			event.list2 = [];
			if (player.countCards("h") > 0) {
				var chooseButton = player.chooseButton(4, [
					"你的手牌",
					player.getCards("h"),
					get.translation(target.name) + "的手牌",
					target.getCards("h"),
				]);
			} else {
				var chooseButton = player.chooseButton(4, [get.translation(target.name) + "的手牌", target.getCards("h")]);
			}
			chooseButton.set("target", target);
			chooseButton.set("ai", function (button) {
				var player = _status.event.player;
				var target = _status.event.target;
				var ps = [];
				var ts = [];
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					var card = ui.selected.buttons[i].link;
					if (target.getCards("h").includes(card)) {
						ts.push(card);
					} else {
						ps.push(card);
					}
				}
				var card = button.link;
				var owner = get.owner(card);
				var val = get.value(card) || 1;
				if (owner == target) {
					return 2 * val;
				}
				return 7 - val;
			});
			chooseButton.set("filterButton", function (button) {
				if (get.owner(button.link) && !lib.filter.canBeDiscarded(button.link, get.owner(button.link), get.player())) {
					return false;
				}
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					if (get.suit(button.link) == get.suit(ui.selected.buttons[i].link)) {
						return false;
					}
				}
				return true;
			});
			"step 1";
			if (result.bool) {
				var list = result.links;
				for (var i = 0; i < list.length; i++) {
					if (get.owner(list[i]) == player) {
						event.list1.push(list[i]);
					} else {
						event.list2.push(list[i]);
					}
				}
				if (event.list1.length && event.list2.length) {
					game.loseAsync({
						lose_list: [
							[player, event.list1],
							[target, event.list2],
						],
						discarder: player,
					}).setContent("discardMultiple");
				} else if (event.list2.length) {
					target.discard(event.list2);
				} else {
					player.discard(event.list1);
				}
			}
		},
		ai: {
			order: 6,
			result: {
				target: -1,
			},
		},
	},
	//段珪
	scschihe: {
		audio: 1,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.targets.length == 1 && event.card.name == "sha";
		},
		prompt2(event, player) {
			var str = "亮出牌堆顶的两张牌并增加伤害；且";
			str += "令" + get.translation(event.target) + "不能使用";
			str += "这两张牌所包含的花色";
			str += "的牌响应" + get.translation(event.card);
			return str;
		},
		logTarget: "target",
		locked: false,
		check(event, player) {
			var target = event.target;
			if (get.attitude(player, target) > 0) {
				return false;
			}
			return true;
		},
		content() {
			var num = 2;
			var evt = trigger.getParent();
			var suit = get.suit(trigger.card);
			var suits = [];
			if (num > 0) {
				if (typeof evt.baseDamage != "number") {
					evt.baseDamage = 1;
				}
				var cards = get.cards(num);
				player.showCards(cards.slice(0), get.translation(player) + "发动了【叱吓】");
				while (cards.length > 0) {
					var card = cards.pop();
					var suitx = get.suit(card, false);
					suits.add(suitx);
					if (suit == suitx) {
						evt.baseDamage++;
					}
				}
				game.updateRoundNumber();
			}
			evt._scschihe_player = player;
			var target = trigger.target;
			target.addTempSkill("scschihe_block");
			if (!target.storage.scschihe_block) {
				target.storage.scschihe_block = [];
			}
			target.storage.scschihe_block.push([evt.card, suits]);
			lib.skill.scschihe.updateBlocker(target);
		},
		updateBlocker(player) {
			var list = [],
				storage = player.storage.scschihe_block;
			if (storage && storage.length) {
				for (var i of storage) {
					list.addArray(i[1]);
				}
			}
			player.storage.scschihe_blocker = list;
		},
		ai: {
			threaten: 2.5,
		},
		subSkill: {
			block: {
				mod: {
					cardEnabled(card, player) {
						if (!player.storage.scschihe_blocker) {
							return;
						}
						var suit = get.suit(card);
						if (suit == "none" || suit == "unsure") {
							return;
						}
						var evt = _status.event;
						if (evt.name != "chooseToUse") {
							evt = evt.getParent("chooseToUse");
						}
						if (!evt || !evt.respondTo || evt.respondTo[1].name != "sha") {
							return;
						}
						if (player.storage.scschihe_blocker.includes(suit)) {
							return false;
						}
					},
				},
				trigger: {
					player: ["damageBefore", "damageCancelled", "damageZero"],
					target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
					global: ["useCardEnd"],
				},
				forced: true,
				firstDo: true,
				charlotte: true,
				popup: false,
				onremove(player) {
					delete player.storage.scschihe_block;
					delete player.storage.scschihe_blocker;
				},
				filter(event, player) {
					const evt = event.getParent("useCard", true, true);
					if (evt && evt.effectedCount < evt.effectCount) {
						return false;
					}
					if (!event.card || !player.storage.scschihe_block) {
						return false;
					}
					for (var i of player.storage.scschihe_block) {
						if (i[0] == event.card) {
							return true;
						}
					}
					return false;
				},
				content() {
					var storage = player.storage.scschihe_block;
					for (var i = 0; i < storage.length; i++) {
						if (storage[i][0] == trigger.card) {
							storage.splice(i--, 1);
						}
					}
					if (!storage.length) {
						player.removeSkill("scschihe_block");
					} else {
						lib.skill.scschihe.updateBlocker(target);
					}
				},
			},
		},
	},
	//郭胜
	scsniqu: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		selectTarget: 1,
		content() {
			target.damage("fire");
		},
		ai: {
			expose: 0.2,
			order: 5,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target, "fire") / 10;
				},
			},
		},
	},
	//高望
	scsanruo: {
		audio: 1,
		enable: ["chooseToUse", "chooseToRespond"],
		prompt: "将一张♥牌当做桃，♦牌当做火杀，♣牌当做闪，♠牌当做无懈可击使用或打出",
		viewAs(cards, player) {
			var name = false;
			var nature = null;
			switch (get.suit(cards[0], player)) {
				case "club":
					name = "shan";
					break;
				case "diamond":
					name = "sha";
					nature = "fire";
					break;
				case "spade":
					name = "wuxie";
					break;
				case "heart":
					name = "tao";
					break;
			}
			if (name) {
				return { name: name, nature: nature };
			}
			return null;
		},
		check(card) {
			var player = _status.event.player;
			if (_status.event.type == "phase") {
				var max = 0;
				var name2;
				var list = ["sha", "tao"];
				var map = { sha: "diamond", tao: "heart" };
				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					if (
						player.countCards("hes", function (card) {
							return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
						}) > 0 &&
						player.getUseValue({ name: name, nature: name == "sha" ? "fire" : null }) > 0
					) {
						var temp = get.order({ name: name, nature: name == "sha" ? "fire" : null });
						if (temp > max) {
							max = temp;
							name2 = map[name];
						}
					}
				}
				if (name2 == get.suit(card, player)) {
					return name2 == "diamond" ? 5 - get.value(card) : 20 - get.value(card);
				}
				return 0;
			}
			return 1;
		},
		position: "hes",
		filterCard(card, player, event) {
			event = event || _status.event;
			var filter = event._backup.filterCard;
			var name = get.suit(card, player);
			if (name == "club" && filter({ name: "shan", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "diamond" && filter({ name: "sha", cards: [card], nature: "fire" }, player, event)) {
				return true;
			}
			if (name == "spade" && filter({ name: "wuxie", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "heart" && filter({ name: "tao", cards: [card] }, player, event)) {
				return true;
			}
			return false;
		},
		filter(event, player) {
			var filter = event.filterCard;
			if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hes", { suit: "diamond" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hes", { suit: "club" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hes", { suit: "heart" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hes", { suit: "spade" })) {
				return true;
			}
			return false;
		},
		precontent() {
			"step 0";
			player.addTempSkill("scsanruo_effect");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				var name;
				switch (tag) {
					case "respondSha":
						name = "diamond";
						break;
					case "respondShan":
						name = "club";
						break;
					case "save":
						name = "heart";
						break;
				}
				if (!player.countCards("hes", { suit: name })) {
					return false;
				}
			},
			order(item, player) {
				if (player && _status.event.type == "phase") {
					var max = 0;
					var list = ["sha", "tao"];
					var map = { sha: "diamond", tao: "heart" };
					for (var i = 0; i < list.length; i++) {
						var name = list[i];
						if (
							player.countCards("hes", function (card) {
								return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
							}) > 0 &&
							player.getUseValue({
								name: name,
								nature: name == "sha" ? "fire" : null,
							}) > 0
						) {
							var temp = get.order({
								name: name,
								nature: name == "sha" ? "fire" : null,
							});
							if (temp > max) {
								max = temp;
							}
						}
					}
					max /= 1.1;
					return max;
				}
				return 2;
			},
		},
		hiddenCard(player, name) {
			if (name == "wuxie" && _status.connectMode && player.countCards("hes") > 0) {
				return true;
			}
			if (name == "wuxie") {
				return player.countCards("hes", { suit: "spade" }) > 0;
			}
			if (name == "tao") {
				return player.countCards("hes", { suit: "heart" }) > 0;
			}
		},
		subSkill: {
			effect: {
				audio: "scsanruo",
				trigger: {
					player: ["useCard", "respond"],
				},
				filter(event, player) {
					return event.skill == "scsanruo";
				},
				direct: true,
				forced: true,
				charlotte: true,
				content() {
					"step 0";
					var name = trigger.card.name;
					var next = game.createEvent("scsanruo_" + name);
					next.player = player;
					next.setContent(lib.skill.scsanruo_effect[name == "shan" ? "sha" : name] || function () {});
				},
				sha() {
					"step 0";
					var trigger = event.getParent().getTrigger();
					if (trigger.name == "useCard") {
						var target = lib.skill.chongzhen.logTarget(trigger, player);
					} else {
						var target = trigger.source;
					}
					event.target = target;
					if (!target || !target.countGainableCards(player, "he")) {
						event._result = { bool: false };
					} else {
						player
							.chooseBool(get.prompt("scsanruo_effect", target), "获得该角色的一张牌")
							.set("ai", () => {
								return _status.event.goon;
							})
							.set("goon", get.attitude(player, target) < 1);
					}
					"step 1";
					if (result.bool) {
						player.logSkill("scsanruo_effect", target);
						player.gainPlayerCard(target, "he", true);
					}
				},
				tao() {
					"step 0";
					player
						.chooseTarget(get.prompt("scsanruo"), "获得一名其他角色的一张牌", (card, player, target) => {
							return target.countGainableCards(player, "he") && target != player;
						})
						.set("ai", target => {
							return 1 - get.attitude(_status.event.player, target);
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("scsanruo_effect", target);
						player.gainPlayerCard(target, "he", true);
					}
				},
				wuxie() {
					"step 0";
					var trigger = event.getParent().getTrigger();
					if (!trigger.respondTo) {
						event.finish();
						return;
					}
					var target = trigger.respondTo[0];
					event.target = target;
					if (!target || !target.countGainableCards(player, player == target ? "e" : "he")) {
						event._result = { bool: false };
					} else {
						player
							.chooseBool(get.prompt("scsanruo_effect", target), "获得该角色的一张牌")
							.set("ai", () => {
								return _status.event.goon;
							})
							.set("goon", get.attitude(player, target) < 1);
					}
					"step 1";
					if (result.bool) {
						player.logSkill("scsanruo_effect", target);
						player.gainPlayerCard(target, player == target ? "e" : "he", true);
					}
				},
			},
		},
	},
	scsmiaoyu: {
		audio: "scsanruo",
		enable: ["chooseToUse", "chooseToRespond"],
		prompt: "将至多两张♦牌当作火【杀】，♥牌当作【桃】，♣牌当作【闪】，♠牌当作【无懈可击】使用或打出",
		viewAs(cards, player) {
			var name = false;
			var nature = null;
			switch (get.suit(cards[0], player)) {
				case "club":
					name = "shan";
					break;
				case "diamond":
					name = "sha";
					nature = "fire";
					break;
				case "spade":
					name = "wuxie";
					break;
				case "heart":
					name = "tao";
					break;
			}
			//返回判断结果
			if (name) {
				return { name: name, nature: nature };
			}
			return null;
		},
		check(card) {
			if (ui.selected.cards.length) {
				return 0;
			}
			var player = _status.event.player;
			if (_status.event.type == "phase") {
				var max = 0;
				var name2;
				var list = ["sha", "tao"];
				var map = { sha: "diamond", tao: "heart" };
				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					if (
						player.countCards("hes", function (card) {
							return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
						}) > 0 &&
						player.getUseValue({ name: name, nature: name == "sha" ? "fire" : null }) > 0
					) {
						var temp = get.order({ name: name, nature: name == "sha" ? "fire" : null });
						if (temp > max) {
							max = temp;
							name2 = map[name];
						}
					}
				}
				if (name2 == get.suit(card, player)) {
					return name2 == "diamond" ? 5 - get.value(card) : 20 - get.value(card);
				}
				return 0;
			}
			return 1;
		},
		selectCard: [1, 2],
		complexCard: true,
		position: "hes",
		filterCard(card, player, event) {
			if (ui.selected.cards.length) {
				return get.suit(card, player) == get.suit(ui.selected.cards[0], player);
			}
			event = event || _status.event;
			var filter = event._backup.filterCard;
			var name = get.suit(card, player);
			if (name == "club" && filter({ name: "shan", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "diamond" && filter({ name: "sha", cards: [card], nature: "fire" }, player, event)) {
				return true;
			}
			if (name == "spade" && filter({ name: "wuxie", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "heart" && filter({ name: "tao", cards: [card] }, player, event)) {
				return true;
			}
			return false;
		},
		filter(event, player) {
			var filter = event.filterCard;
			if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hes", { suit: "diamond" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hes", { suit: "club" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hes", { suit: "heart" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hes", { suit: "spade" })) {
				return true;
			}
			return false;
		},
		precontent() {
			player.addTempSkill("scsmiaoyu_num");
			player.addTempSkill("scsmiaoyu_discard");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				var name;
				switch (tag) {
					case "respondSha":
						name = "diamond";
						break;
					case "respondShan":
						name = "club";
						break;
					case "save":
						name = "heart";
						break;
				}
				if (!player.countCards("hes", { suit: name })) {
					return false;
				}
			},
			order(item, player) {
				if (player && _status.event.type == "phase") {
					var max = 0;
					var list = ["sha", "tao"];
					var map = { sha: "diamond", tao: "heart" };
					for (var i = 0; i < list.length; i++) {
						var name = list[i];
						if (
							player.countCards("hes", function (card) {
								return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
							}) > 0 &&
							player.getUseValue({
								name: name,
								nature: name == "sha" ? "fire" : null,
							}) > 0
						) {
							var temp = get.order({
								name: name,
								nature: name == "sha" ? "fire" : null,
							});
							if (temp > max) {
								max = temp;
							}
						}
					}
					max /= 1.1;
					return max;
				}
				return 2;
			},
		},
		hiddenCard(player, name) {
			if (name == "wuxie" && _status.connectMode && player.countCards("hs") > 0) {
				return true;
			}
			if (name == "wuxie") {
				return player.countCards("hes", { suit: "spade" }) > 0;
			}
			if (name == "tao") {
				return player.countCards("hes", { suit: "heart" }) > 0;
			}
		},
		subSkill: {
			num: {
				charlotte: true,
				trigger: { player: "useCard" },
				filter(event) {
					return ["sha", "tao"].includes(event.card.name) && event.skill == "scsmiaoyu" && event.cards && event.cards.length == 2;
				},
				forced: true,
				popup: false,
				content() {
					trigger.baseDamage++;
				},
			},
			discard: {
				charlotte: true,
				trigger: { player: ["useCardAfter", "respondAfter"] },
				autodelay(event) {
					return event.name == "respond" ? 0.5 : false;
				},
				filter(event, player) {
					return (
						["shan", "wuxie"].includes(event.card.name) &&
						event.skill == "scsmiaoyu" &&
						event.cards &&
						event.cards.length == 2 &&
						_status.currentPhase &&
						_status.currentPhase != player &&
						_status.currentPhase.countDiscardableCards(player, "he")
					);
				},
				forced: true,
				popup: false,
				content() {
					player.line(_status.currentPhase, "green");
					player.discardPlayerCard(_status.currentPhase, "he", true);
				},
			},
		},
	},
	//牵招
	mbshihe: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				target.addTempSkill("mbshihe_prevent", { player: "phaseAfter" });
				target.markAuto("mbshihe_prevent", [player]);
			} else {
				var cards = player.getCards("he", card => {
					return lib.filter.cardDiscardable(card, player, "mbshihe");
				});
				if (cards.length > 0) {
					player.discard(cards.randomGet());
				}
			}
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					if ((get.realAttitude || get.attitude)(target, player) >= 0 || get.damageEffect(player, target, player) >= 0) {
						return 0;
					}
					var card = player.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					})[0];
					return get.number(card) >= 10 || (get.number(card) >= 7 && target.countCards("h") <= 2) ? 1 : -1;
				},
			},
		},
		subSkill: {
			prevent: {
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					if (get.mode() == "identity") {
						return player.getStorage("mbshihe_prevent").includes(event.player);
					}
					return player.getStorage("mbshihe_prevent").some(target => event.player.isFriendOf(target));
				},
				onremove: true,
				forced: true,
				charlotte: true,
				content() {
					trigger.cancel();
				},
				mark: true,
				marktext: "吓",
				intro: {
					content(storage, player) {
						var targets = storage.filter(i => i.isIn());
						return (
							"被" +
							get.translation(targets) +
							"吓到了，对他" +
							(targets.length > 1 ? "们" : "") +
							(get.mode() != "identity" ? "和他的友方角色" : "") +
							"打不出伤害"
						);
					},
				},
				ai: {
					effect: {
						player(card, player, target, current) {
							if (get.tag(card, "damage")) {
								var bool = false;
								if (get.mode() == "identity" && player.getStorage("mbshihe_prevent").includes(target)) {
									bool = true;
								}
								if (get.mode() != "identity" && player.getStorage("mbshihe_prevent").some(targetx => target.isFriendOf(targetx))) {
									bool = true;
								}
								if (bool) {
									return "zeroplayertarget";
								}
							}
						},
					},
				},
			},
		},
	},
	mbzhenfu: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.hasHistory("lose", evt => {
				return evt.type == "discard";
			});
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("mbzhenfu"), "令一名其他角色获得1点护甲", (card, player, target) => {
					return target != player && target.hujia < 5;
				})
				.set("ai", target => {
					return Math.max(0, get.threaten(target)) * get.attitude(_status.event.player, target);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("mbzhenfu", target);
				target.changeHujia(1, null, true);
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	// 界曹休
	xinqingxi: {
		audio: 2,
		usable: 1,
		trigger: { source: "damageBegin1" },
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		filter(event, player) {
			return event.player != player;
		},
		content() {
			"step 0";
			var num = Math.max(1, 4 - get.distance(player, trigger.player));
			if (trigger.player.countCards("h") < num) {
				event._result = { bool: false };
			} else {
				trigger.player
					.chooseToDiscard(num, "弃置" + get.cnNumber(num) + "张手牌，或令" + get.translation(player) + "对你造成的此伤害+1")
					.set("ai", function (card) {
						var player = _status.event.player;
						if (player.hp == 1) {
							if (get.type(card) == "basic") {
								return 8 - get.value(card);
							} else {
								return 10 - get.value(card);
							}
						} else {
							if (num > 2) {
								return 0;
							}
							return 8 - get.value(card);
						}
					});
			}
			"step 1";
			if (!result.bool) {
				trigger.num++;
			}
		},
	},
	// 界朱桓
	xinpingkou: {
		audio: 2,
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.getHistory("skipped").length > 0;
		},
		content() {
			"step 0";
			player
				.chooseTarget([1, player.getHistory("skipped").length], get.prompt2("xinpingkou"), function (card, player, target) {
					return target != player;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.damageEffect(target, player, player);
				});
			"step 1";
			if (result.bool) {
				player.logSkill("xinpingkou", result.targets);
				event.targets = result.targets.slice(0).sortBySeat();
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets && event.targets.length) {
				event.targets.shift().damage();
				event.redo();
			}
			"step 3";
			var card = get.cardPile2(card => get.type(card, null, false) == "equip");
			if (card) {
				player.gain(card, "gain2");
			}
		},
		ai: {
			effect: {
				target(card) {
					if (card.name == "lebu" || card.name == "bingliang") {
						return 0.5;
					}
				},
			},
			combo: "fenli",
		},
	},
	// 彭羕
	spdaming: {
		audio: 3,
		trigger: { global: "phaseBefore", player: "enterGame" },
		global: "spdaming_give",
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		change(player, num) {
			if (!player.storage.spdaming) {
				player.storage.spdaming = 0;
			}
			if (!num) {
				return;
			}
			player.storage.spdaming += num;
			player.markSkill("spdaming");
			game.log(player, (num > 0 ? "获得了" : "减少了") + get.cnNumber(Math.abs(num)) + "点“达命”值");
		},
		forced: true,
		locked: false,
		logAudio: () => 2,
		content() {
			lib.skill.spdaming.change(player, 3);
		},
		intro: {
			name: "达命值",
			markcount(storage, player) {
				return (storage || 0).toString();
			},
			content: "当前有#点“达命”值",
		},
		subSkill: {
			used: { charlotte: true },
			give: {
				audio: ["spdaming", 2],
				enable: "phaseUse",
				forceaudio: true,
				nopop: true,
				filter(event, player) {
					if (!player.countCards("he")) {
						return false;
					}
					return game.hasPlayer(current => {
						return current != player && current.hasSkill("spdaming") && !current.hasSkill("spdaming_used");
					});
				},
				selectCard: 1,
				filterCard: true,
				filterTarget(card, player, target) {
					return target.hasSkill("spdaming") && !target.hasSkill("spdaming_used");
				},
				selectTarget() {
					const player = get.player();
					const targets = game.filterPlayer(current => {
						return current != player && current.hasSkill("spdaming") && !current.hasSkill("spdaming_used");
					});
					return targets.length > 1 ? 1 : -1;
				},
				complexSelect: true,
				prompt() {
					const player = get.player();
					const targets = game.filterPlayer(current => {
						return current != player && current.hasSkill("spdaming") && !current.hasSkill("spdaming_used");
					});
					return "将一张牌交给" + get.translation(targets) + (targets.length > 1 ? "中的一人" : "");
				},
				position: "he",
				discard: false,
				lose: false,
				delay: false,
				check(card) {
					const player = get.player();
					if (
						game.hasPlayer(current => {
							return lib.skill.spdaming_give.filterTarget(null, player, current) && get.attitude(player, current) > 0;
						})
					) {
						return 6 + Math.random() - get.value(card) / 15;
					}
					return 0;
				},
				async content(event, trigger, player) {
					const { cards, target } = event;
					await player.give(cards, target);
					target.addTempSkill("spdaming_used", "phaseUseAfter");
					if (!game.hasPlayer(current => current != player && current != target && get.owner(cards[0]) == target)) {
						await target.give(cards, player);
						return;
					}
					const type = get.type(cards[0], "trick", target);
					const str = get.translation(type),
						user = get.translation(player);
					const result = await target
						.chooseTarget(
							"达命：选择另一名其他角色",
							`若该角色有${str}牌，其将一张该类型的牌交给${user}，你获得1点“达命”值；否则你将${get.translation(cards)}交给${user}`,
							(card, player, target) => {
								return target != player && target != get.event().getParent().player;
							},
							true
						)
						.set("ai", target => 1 - get.attitude(get.player(), target))
						.forResult();
					if (!result?.bool || !result?.targets?.length) {
						return;
					}
					const [targetx] = result.targets;
					target.line(targetx);
					if (targetx.countCards("he", { type: type })) {
						await targetx
							.chooseToGive(player, `交给${get.translation(player)}一张${get.translation(type)}牌`, "he", true, card => {
								return get.type(card) == get.event().cardtype;
							})
							.set("ai", card => 10 - get.value(card))
							.set("cardtype", type);
						targetx.line(player);
						lib.skill.spdaming.change(target, 1);
						await game.delayx();
					} else if (get.owner(cards[0]) == target) {
						await target.give(cards, player);
						game.broadcastAll(() => {
							if (lib.config.background_speak) {
								game.playAudio("skill", "spdaming3");
							}
						});
					}
				},
				ai: {
					expose: 0.2,
					order: 10,
					result: { target: 1 },
				},
			},
		},
	},
	spxiaoni: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		locked: false,
		filter(event, player) {
			return (
				player.hasMark("spdaming") &&
				player.countCards("hes") &&
				get.inpileVCardList(info => (info[0] == "trick" && get.tag({ name: info[2] }, "damage")) || info[2] == "sha")
			);
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => (info[0] == "trick" && get.tag({ name: info[2] }, "damage")) || info[2] == "sha");
				return ui.create.dialog("嚣逆", [list, "vcard"]);
			},
			filter(button, player) {
				return lib.filter.filterCard({ name: button.link[2] }, player, get.event().getParent());
			},
			check(button) {
				const player = get.player();
				if (player.countCards("hs", button.link[2]) > 0) {
					return 0;
				}
				const effect = player.getUseValue({ name: button.link[2], nature: button.link[3] });
				if (effect > 0) {
					return effect;
				}
				return 0;
			},
			backup(links, player) {
				return {
					filterCard: true,
					audio: "spxiaoni",
					selectCard: 1,
					popname: true,
					check(card) {
						return 6 - get.value(card);
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
					onuse(result, player) {
						lib.skill.spdaming.change(player, -result.targets.length);
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
			},
		},
		mod: {
			maxHandcardBase(player, num) {
				return Math.min(Math.max(0, player.countMark("spdaming")), player.hp);
			},
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					const numx = Math.max(player.countMark("spdaming"), player.hp) - num;
					return num + numx;
				}
			},
		},
		ai: {
			order: 4,
			result: { player: 1 },
			threaten: 1.4,
			combo: "spdaming",
		},
		subSkill: { backup: {} },
	},
	// 灭霸
	zhujian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countCards("e") > 0;
		},
		selectTarget: [2, Infinity],
		multiline: true,
		multitarget: true,
		filter(event, player) {
			return game.countPlayer(current => current.countCards("e") > 0) >= 2;
		},
		content() {
			game.asyncDraw(targets);
		},
		ai: {
			order: 8,
			result: { target: 1 },
		},
	},
	duansuo: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.isLinked();
		},
		selectTarget: [1, Infinity],
		multiline: true,
		multitarget: true,
		filter(event, player) {
			return game.countPlayer(current => current.isLinked());
		},
		content() {
			"step 0";
			event.targets = targets.sortBySeat();
			for (var i of event.targets) {
				i.link(false);
			}
			"step 1";
			for (var i of targets) {
				i.damage("fire");
			}
		},
		ai: {
			order: 2,
			result: { target: -1 },
		},
	},
	// 界朱治
	sbanguo: {
		audio: 3,
		trigger: { global: "phaseBefore", player: "enterGame" },
		group: ["sbanguo_move", "sbanguo_damage", "sbanguo_dying"],
		logAudio: () => 2,
		filter(event, player) {
			return game.hasPlayer(current => current != player) && (event.name != "phase" || game.phaseNumber == 0);
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseTarget("安国：令一名其他角色获得“安国”标记", lib.filter.notMe, true).forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.addMark("sbanguo_mark", 1, false);
			target.addAdditionalSkill("sbanguo_" + player.playerid, "sbanguo_mark");
			target.addMark("sbanguo_marked", 1, false);
		},
		subSkill: {
			mark: {
				onremove: true,
				marktext: "安",
				charlotte: true,
				intro: {
					name: "安国",
					name2: "安国",
					content: "已拥有“安国”标记",
				},
				mod: {
					maxHandcardBase(player, num) {
						return player.maxHp;
					},
				},
			},
			move: {
				audio: ["sbanguo1.mp3", "sbanguo2.mp3"],
				trigger: { player: "phaseUseBegin" },
				filter(event, player) {
					return (
						game.hasPlayer(current => current.hasSkill("sbanguo_mark")) &&
						game.hasPlayer(current => !current.hasMark("sbanguo_marked") && current != player)
					);
				},
				async cost(event, trigger, player) {
					const targets = game.filterPlayer(current => current.hasSkill("sbanguo_mark"));
					const prompt2 =
						targets.length == 1
							? "将" + get.translation(targets[0]) + "的“安国”交给一名未获得过“安国”的其他角色"
							: "选择一名有“安国”的角色，将该标记交给一名未获得过“安国”的其他角色";
					event.result = await player
						.chooseTarget(get.prompt("sbanguo"), prompt2, targets.length == 1 ? 1 : 2, (card, player, target) => {
							if (ui.selected.targets.length == 0 && _status.event.targets.length > 1) {
								return target.hasSkill("sbanguo_mark");
							}
							return !target.hasMark("sbanguo_marked") && target != player;
						})
						.set("ai", target => {
							var player = _status.event.player;
							if (ui.selected.targets.length == 0 && _status.event.targets.length > 1) {
								return -get.attitude(player, target);
							}
							return get.attitude(player, _status.event.targets[0]) < get.attitude(player, target);
						})
						.set("targets", targets)
						.set("line", false)
						.forResult();
				},
				async content(event, trigger, player) {
					const { targets } = event;
					let target1, target2;
					if (targets.length == 1) {
						target1 = game.filterPlayer(current => current.hasSkill("sbanguo_mark"))[0];
						target2 = targets[0];
					} else {
						target1 = targets[0];
						target2 = targets[1];
					}
					player.line2([target1, target2], "green");
					const map = target1.additionalSkills;
					for (const key in map) {
						if (key.indexOf("sbanguo_") != 0) {
							continue;
						}
						const id = parseInt(key.slice(8));
						target1.removeAdditionalSkill("sbanguo_" + id);
						target2.addMark("sbanguo_mark", 1, false);
						target2.addAdditionalSkill("sbanguo_" + id, "sbanguo_mark");
						target2.addMark("sbanguo_marked", 1, false);
					}
				},
			},
			damage: {
				audio: ["sbanguo1.mp3", "sbanguo2.mp3"],
				forced: true,
				locked: false,
				trigger: { player: "damageBegin4" },
				filter(event, player) {
					if (!game.hasPlayer(current => current.hasSkill("sbanguo_mark"))) {
						return false;
					}
					if (event.source && event.source.isIn() && event.source.hasSkill("sbanguo_mark")) {
						return false;
					}
					return event.num >= player.hp;
				},
				async content(event, trigger, player) {
					trigger.cancel();
				},
				ai: {
					nofire: true,
					nothunder: true,
					nodamage: true,
					effect: {
						target(card, player, target, current) {
							if (!game.hasPlayer(current => current.hasSkill("sbanguo_mark"))) {
								return;
							}
							if (player.hasSkill("sbanguo_mark")) {
								return;
							}
							if (get.tag(card, "damage")) {
								if (target.hp <= 1) {
									return [0, 0];
								}
								return 0.5;
							}
						},
					},
				},
			},
			dying: {
				audio: "sbanguo3.mp3",
				forced: true,
				locked: false,
				trigger: { global: "dying" },
				filter(event, player) {
					var skills = event.player.additionalSkills["sbanguo_" + player.playerid];
					return skills && skills.length;
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const target = trigger.player;
					target.removeAdditionalSkill("sbanguo_" + player.playerid);
					await target.recoverTo(1);
					const hp = player.hp - 1,
						maxhp = player.maxHp - 1;
					let result;
					if (hp > 0 && maxhp > 0) {
						result = await player
							.chooseControl()
							.set("prompt", "安国：请选择一项")
							.set("choiceList", [
								"失去" + hp + "点体力，令" + get.translation(target) + "获得1点护甲",
								"减" + maxhp + "点体力上限，令" + get.translation(target) + "获得1点护甲",
							])
							.set("ai", () => "选项一")
							.forResult();
					} else if (hp > 0) {
						result = { control: "选项一" };
					} else if (maxhp > 0) {
						result = { control: "选项二" };
					} else {
						return;
					}
					if (result?.control == "选项一") {
						var num = player.hp - 1;
						if (num > 0) {
							await player.loseHp(num);
						}
					} else if (result?.control == "选项二") {
						var num = player.maxHp - 1;
						if (num > 0) {
							await player.loseMaxHp(num);
						}
					}
					await target.changeHujia(1, null, true);
				},
			},
		},
	},
	// 界吴懿
	sbbenxi: {
		audio: 3,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countDiscardableCards(player, "he") > 0;
		},
		logAudio: () => 1,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill), [1, Infinity], "he", "allowChooseAll")
				.set("ai", card => {
					var player = _status.event.player;
					if (ui.selected.cards.length < _status.event.num) {
						return 100 - (get.useful(card, player) + player.getUseValue(card) / 3);
					}
					return 0;
				})
				.set(
					"num",
					(function () {
						var count = 0;
						var list = [],
							list2 = [];
						var targets = game.filterPlayer(current => get.distance(player, current) >= 1);
						var cards = player.getCards("hs", card => {
							return (
								player.hasUseTarget(card, false) &&
								["basic", "trick"].includes(get.type(card, false, player)) &&
								get.info(card).allowMultiple != false
							);
						});
						var cards2 = player
							.getCards("he")
							.filter(i => lib.filter.cardDiscardable(i, player, "sbbenxi"))
							.sort((a, b) => {
								return get.useful(a, player) + player.getUseValue(a) / 3 - (get.useful(b, player) + player.getUseValue(b) / 3);
							});
						for (var i = 0; i < cards2.length; i++) {
							count = 0;
							list = [];
							for (var card of cards) {
								var num = i + 1;
								if (cards2.slice(0, num).includes(card)) {
									continue;
								}
								if (get.tag(card, "damage") && i > 0) {
									count += get.effect(player, { name: "draw" }, player);
								}
								var targets2 = targets.filter(current => {
									return (
										player.canUse(card, current, false) &&
										get.distance(player, current) <= num &&
										get.effect(current, card, player, player) > 0
									);
								});
								targets2 = targets2.map(target => get.effect(target, card, player, player)).sort((a, b) => b - a);
								targets2.slice(0, num).forEach(eff => (count += eff));
								list.push(count - 1.2 * get.value(cards2[i]));
							}
							var val = list.sort((a, b) => b - a)[0];
							if (!isNaN(val)) {
								list2.push([val, i]);
							}
						}
						list2 = list2.filter(i => i[0] > 0);
						if (!list2.length) {
							return 0;
						}
						return list2.sort((a, b) => b[0] - a[0])[0][1];
					})()
				)
				.forResult();
		},
		async content(event, trigger, player) {
			const num = event.cards.length;
			player.addTempSkill("sbbenxi_effect", "phaseUseAfter");
			player.addTempSkill("sbbenxi_effect2", "phaseUseAfter");
			player.addMark("sbbenxi_effect2", num, false);
		},
		subSkill: {
			effect: {
				audio: "sbbenxi2.mp3",
				trigger: { player: "useCard2" },
				forced: true,
				charlotte: true,
				direct: true,
				onremove: true,
				filter(event, player) {
					var type = get.type(event.card, null, false);
					return type == "basic" || type == "trick";
				},
				content() {
					"step 0";
					var num = player.countMark("sbbenxi_effect2");
					player.removeSkill("sbbenxi_effect");
					player.addTempSkill("sbbenxi_effect3", "phaseUseAfter");
					player.markAuto("sbbenxi_effect3", [trigger.card]);
					var filter = function (event, player) {
						var card = event.card,
							info = get.info(card);
						if (info.allowMultiple == false) {
							return false;
						}
						if (event.targets && !info.multitarget) {
							if (
								game.hasPlayer(function (current) {
									return (
										!event.targets.includes(current) &&
										lib.filter.targetEnabled2(card, player, current) &&
										get.distance(player, current) == 1
									);
								})
							) {
								return true;
							}
						}
						return false;
					};
					if (!filter(trigger, player)) {
						event.finish();
					} else {
						var prompt = "为" + get.translation(trigger.card) + "增加至多" + get.cnNumber(num) + "个距离为1的目标？";
						trigger.player
							.chooseTarget(get.prompt("sbbenxi_effect"), prompt, [1, num], function (card, player, target) {
								var player = _status.event.player;
								return (
									!_status.event.targets.includes(target) &&
									lib.filter.targetEnabled2(_status.event.card, player, target) &&
									get.distance(player, target) == 1
								);
							})
							.set("ai", function (target) {
								var trigger = _status.event.getTrigger();
								var player = _status.event.player;
								return get.effect(target, trigger.card, player, player);
							})
							.set("card", trigger.card)
							.set("targets", trigger.targets);
					}
					"step 1";
					if (result.bool) {
						if (!event.isMine() && !event.isOnline()) {
							game.delayx();
						}
					} else {
						event.finish();
					}
					"step 2";
					player.logSkill("sbbenxi_effect", result.targets);
					game.log(result.targets, "也成为了", trigger.card, "的目标");
					trigger.targets.addArray(result.targets);
				},
				ai: {
					effect: {
						target_use(card, player, target) {
							if (player.canUse(card, target) && get.distance(player, target) != 1) {
								return 1.2;
							}
						},
					},
				},
			},
			effect2: {
				audio: "sbbenxi3.mp3",
				trigger: {
					global: "useCardAfter",
				},
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return (
						player.getStorage("sbbenxi_effect3").includes(event.card) &&
						game.hasPlayer2(current => {
							return current.hasHistory("damage", evt => {
								return event.card == evt.card;
							});
						})
					);
				},
				content() {
					player.draw(5);
				},
				mod: {
					aiOrder(player, card, num) {
						var evt = _status.event.getParent("phaseUse");
						if (!evt || evt.player != player) {
							return;
						}
						if (
							player.hasHistory("useCard", evtx => {
								return evtx.getParent("phaseUse") == evt && ["basic", "trick"].includes(get.type(evtx.card));
							})
						) {
							return;
						}
						if (get.tag(card, "damage") || get.type(card) == "equip") {
							return num + 10;
						}
					},
					globalFrom(from, to, distance) {
						return distance - from.countMark("sbbenxi_effect2");
					},
				},
				marktext: "奔",
				intro: {
					content(storage, player) {
						var str = "于此阶段至其他角色的距离-" + storage;
						if (player.hasSkill("sbbenxi_effect")) {
							str += "；使用下一张基本牌或普通锦囊牌选择目标后，可以增加" + get.cnNumber(storage) + "个目标";
						}
						return str;
					},
				},
			},
			effect3: {
				forced: true,
				charlotte: true,
				popup: false,
				onremove: true,
			},
		},
	},
	// 杨阜
	jiebing: {
		audio: 2,
		trigger: {
			player: "damageEnd",
		},
		direct: true,
		forced: true,
		filter(event, player) {
			return game.hasPlayer(current => {
				return current != event.source && current != player && current.countGainableCards(player, "he");
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget("借兵：选择一名其他角色", get.skillInfoTranslation("jiebing", null, false), true, (card, player, target) => {
					return player != target && target != _status.event.getTrigger().source && target.countGainableCards(player, "he");
				})
				.set("ai", target => get.effect(target, { name: "shunshou_copy2" }, player, player) /** (target.countCards('he')>1?1.5:1)*/);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("jiebing", target);
				if (target.ai.shown > 0) {
					player.addExpose(0.15);
				}
				var cards = target.getGainableCards(player, "he").randomGets(1);
				event.cards = cards;
				player.gain(target, cards, "give", "bySelf");
				player.showCards(cards, "借兵");
			} else {
				event.finish();
			}
			"step 2";
			for (var card of cards) {
				if (get.type(card) == "equip" && player.hasUseTarget(card) && get.owner(card) == player) {
					player.chooseUseTarget(card, true);
				}
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (player != target && !player.getFriends().length) {
							return;
						}
						if (
							game.hasPlayer(current => {
								return current != player && get.attitude(player, current) > 0 && current.countGainableCards(target, "he") > 0;
							})
						) {
							return [1, 1];
						}
					}
				},
			},
		},
	},
	hannan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return !player.hasSkillTag("noCompareSource");
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (!result.tie) {
				var players = [player, target];
				if (result.bool) {
					players.reverse();
				}
				players[1].line(players[0], "thunder");
				players[0].damage(players[1], 1);
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					var hs = player.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					});
					var ts = target.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					});
					if (!hs.length || !ts.length) {
						return 0;
					}
					if (get.number(hs[0]) > get.number(ts[0]) || get.number(hs[0]) - ts.length >= 9 + Math.min(2, player.hp / 2)) {
						return get.sgnAttitude(player, target) * get.damageEffect(target, player, player);
					}
					return 0;
				},
			},
		},
	},
	// 曹嵩
	yijin: {
		audio: 3,
		trigger: { player: "phaseUseBegin" },
		locked: true,
		logAudio(_1, _2, _3, _4, result) {
			return "yijin" + (["yijin_jinmi", "yijin_guxiong", "yijin_yongbi"].includes(result.cost_data) ? 2 : 1) + ".mp3";
		},
		group: ["yijin_upstart", "yijin_die"],
		filter(event, player) {
			if (!game.hasPlayer(current => current != player && !lib.skill.yijin.getKane(current).length)) {
				return false;
			}
			return lib.skill.yijin.getKane(player).length;
		},
		getKane(player) {
			var list = lib.skill.yijin.derivation;
			return list.filter(mark => player.hasMark(mark));
		},
		derivation: ["yijin_wushi", "yijin_jinmi", "yijin_guxiong", "yijin_tongshen", "yijin_yongbi", "yijin_houren"],
		getValue(player, mark, target) {
			let dis = Math.sqrt(get.distance(player, target, "absolute"));
			if (target.isTurnedOver()) {
				dis++;
			}
			let draw = get.effect(target, { name: "draw" }, target, target);
			switch (mark.slice(6)) {
				case "wushi":
					if (target.hasJudge("bingliang")) {
						return 12 / (1 + target.getCardUsable("sha", true));
					}
					return (5 * draw) / dis + 12 / (1 + target.getCardUsable("sha", true));
				case "jinmi":
					if (target.hasJudge("lebu") && !target.hasCard({ name: "wuxie" }, "hs")) {
						return (draw * target.needsToDiscard(2.2)) / dis;
					}
					return get.effect(target, { name: "lebu" }, player, target) + (draw * target.needsToDiscard(2.2)) / dis;
				case "guxiong":
					if (target.hasJudge("lebu")) {
						return (-draw * target.needsToDiscard(3)) / dis;
					}
					return (get.effect(target, { name: "losehp" }, target, target) * 2) / dis - (draw * target.needsToDiscard(3)) / dis;
				case "tongshen":
					if (target.isMin()) {
						return 0;
					}
					var eff = -get.damageEffect(target, player, target);
					if (eff <= 0) {
						return 0;
					}
					if (target.hp < 2) {
						return eff * dis * 2;
					}
					if (target.hp < 3 && target.countCards("he") < 3) {
						return eff * dis * 1.5;
					}
					if (target.hp > 3) {
						return (eff * dis) / target.hp;
					}
					return eff * dis;
				case "yongbi":
					if (target.hasJudge("bingliang") && !target.hasCard({ name: "wuxie" }, "hs")) {
						return 0;
					}
					return (get.effect(target, { name: "bingliang" }, player, target) * 2) / dis;
				case "houren":
					return (Math.min(5, 2 + target.getDamagedHp()) * get.recoverEffect(target, player, target)) / dis;
			}
		},
		async cost(event, trigger, player) {
			const { targets } = await player
				.chooseTarget("亿金：令一名其他角色获得1枚“金”", true, (card, player, target) => {
					return player != target && !lib.skill.yijin.getKane(target).length;
				})
				.set("ai", target => {
					let player = _status.event.player,
						att = get.attitude(player, target),
						kane = lib.skill.yijin.getKane(player);
					if (Math.abs(att) > 1) {
						att = Math.sign(att) * Math.sqrt(Math.abs(att));
					}
					return Math.max.apply(
						Math.max,
						kane.map(i => {
							return att * lib.skill.yijin.getValue(player, i, target);
						})
					);
				})
				.forResult();
			if (!targets.length) {
				event.result = { bool: false };
				return;
			}
			const target = targets[0];
			event.target = target;
			const kane = lib.skill.yijin.getKane(player);
			const { control } = await player
				.chooseControl(kane)
				.set(
					"choiceList",
					kane.map(i => {
						return (
							'<div class="skill">【' +
							get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) +
							"】</div>" +
							"<div>" +
							get.skillInfoTranslation(i, player, false) +
							"</div>"
						);
					})
				)
				.set("displayIndex", false)
				.set("prompt", "选择令" + get.translation(target) + "获得的“金”")
				.set("ai", () => {
					let controls = _status.event.controls,
						player = _status.event.player,
						target = _status.event.getParent().target,
						att = get.attitude(player, target);
					if (Math.abs(att) > 1) {
						att = Math.sign(att) * Math.sqrt(Math.abs(att));
					}
					let list = controls.map(i => {
						return [i, att * lib.skill.yijin.getValue(player, i, target)];
					});
					list.sort((a, b) => b[1] - a[1]);
					if (list.length) {
						return list[0][0];
					}
					return controls.randomGet();
				})
				.forResult();
			event.result = {
				bool: true,
				targets,
				cost_data: control,
			};
		},
		async content(event, trigger, player) {
			const kane = event.cost_data;
			const target = event.targets[0];
			player.removeMark(kane, 1);
			player.popup(kane, "metal");
			player.addSkill("yijin_clear");
			target.addMark(kane, 1);
			target.addAdditionalSkill("yijin_" + player.playerid, kane);
			game.delayx();
		},
		subSkill: {
			mark: {
				mark: true,
				marktext: "金",
				intro: {
					name: "亿金",
					name2: "亿金",
					markcount(storage, player) {
						return lib.skill.yijin.getKane(player).length;
					},
					content(storage, player) {
						return "剩余金：" + get.translation(lib.skill.yijin.getKane(player));
					},
				},
			},
			upstart: {
				audio: "yijin1.mp3",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				content() {
					var kane = lib.skill.yijin.derivation;
					for (var mark of kane) {
						player.addMark(mark, 1, false);
						player.unmarkSkill(mark);
					}
					player.addSkill("yijin_mark");
				},
			},
			die: {
				audio: "yijin3.mp3",
				trigger: { player: "phaseBegin" },
				forced: true,
				check: () => false,
				filter(event, player) {
					return !lib.skill.yijin.getKane(player).length;
				},
				content() {
					player.die();
				},
			},
			clear: {
				trigger: {
					global: "phaseAfter",
					player: "die",
				},
				charlotte: true,
				forced: true,
				popup: false,
				forceDie: true,
				filter(event, player) {
					if (event.name == "die") {
						return true;
					}
					return lib.skill.yijin.getKane(event.player).length && event.player.additionalSkills["yijin_" + player.playerid];
				},
				content() {
					"step 0";
					if (trigger.name == "die") {
						game.countPlayer(current => {
							var skills = current.additionalSkills["yijin_" + player.playerid];
							if (skills && skills.length) {
								current.removeAdditionalSkill("yijin_" + player.playerid);
								for (var i of skills) {
									trigger.player.removeSkill(i);
								}
							}
						});
						event.finish();
						return;
					} else {
						const skills = trigger.player.additionalSkills["yijin_" + player.playerid];
						for (const mark of skills) {
							trigger.player.removeMark(mark, 1);
						}
					}
					"step 1";
					trigger.player.removeAdditionalSkill("yijin_" + player.playerid);
				},
			},
			wushi: {
				charlotte: true,
				forced: true,
				trigger: { player: "phaseDrawBegin2" },
				content() {
					trigger.num += 4;
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + 1;
						}
					},
				},
				nopop: true,
				marktext: "金",
				intro: {
					name: "金(膴仕)",
					name2: "金(膴仕)",
					content: "摸牌阶段多摸四张牌；使用【杀】的次数上限+1",
				},
			},
			jinmi: {
				charlotte: true,
				forced: true,
				trigger: { player: "phaseBegin" },
				content() {
					player.skip("phaseUse");
					player.skip("phaseDiscard");
				},
				nopop: true,
				marktext: "金",
				intro: {
					name: "金(金迷)",
					name2: "金(金迷)",
					content: "回合开始时，跳过下一个出牌阶段和弃牌阶段",
				},
			},
			guxiong: {
				charlotte: true,
				forced: true,
				trigger: { player: "phaseUseBegin" },
				content() {
					player.loseHp();
				},
				ai: {
					neg: true,
					nokeep: true,
				},
				mod: {
					maxHandcard(player, num) {
						return num - 3;
					},
				},
				nopop: true,
				marktext: "金",
				intro: {
					name: "金(贾凶)",
					name2: "金(贾凶)",
					content: "出牌阶段开始时，失去1点体力；手牌上限-3",
				},
			},
			tongshen: {
				charlotte: true,
				forced: true,
				trigger: { player: "damageBegin4" },
				filter(event) {
					return !event.hasNature("thunder");
				},
				content() {
					trigger.cancel();
				},
				ai: {
					nofire: true,
					nodamage: true,
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "damage") && !get.tag(card, "thunderDamage")) {
								return [0, 0];
							}
						},
					},
				},
				nopop: true,
				marktext: "金",
				intro: {
					name: "金(通神)",
					name2: "金(通神)",
					content: "当你受到非雷电伤害时，防止之",
				},
			},
			yongbi: {
				charlotte: true,
				forced: true,
				trigger: { player: "phaseZhunbeiBegin" },
				content() {
					player.skip("phaseDraw");
				},
				ai: {
					neg: true,
					nokeep: true,
				},
				nopop: true,
				marktext: "金",
				intro: {
					name: "金(拥蔽)",
					name2: "金(拥蔽)",
					content: "准备阶段，跳过下一个摸牌阶段",
				},
			},
			houren: {
				charlotte: true,
				forced: true,
				trigger: { player: "phaseEnd" },
				content() {
					player.recover(3);
				},
				nopop: true,
				marktext: "金",
				intro: {
					name: "金(厚任)",
					name2: "金(厚任)",
					content: "回合结束时，回复3点体力",
				},
			},
		},
	},
	guanzong: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.countPlayer(current => current != player) >= 2;
		},
		filterTarget: lib.filter.notMe,
		selectTarget: 2,
		multitarget: true,
		targetprompt: ["伤害来源", "受伤角色"],
		content() {
			targets[1].damage(targets[0], "unreal");
		},
		ai: {
			result: {
				target(player, target) {
					if (game.countPlayer(i => i != player) < 2) {
						return 0;
					}
					var list = game
						.filterPlayer(current => current != player)
						.map(current => {
							var _hp = current.hp,
								_maxhp = current.maxHp;
							current.hp = 10;
							current.maxHp = 10;
							var att = -get.sgnAttitude(player, current);
							var val = get.damageEffect(current, player, current) * att;
							current.getSkills(null, false, false).forEach(skill => {
								var info = get.info(skill);
								if (info && info.ai && (info.ai.maixie || info.ai.maixie_hp || info.ai.maixie_defend)) {
									val = Math[val > 0 ? "max" : "min"](val > 0 ? 0.1 : -0.1, val + 2 * att);
								}
							});
							var eff = 100 / val + 15;
							current.hp = _hp;
							current.maxHp = _maxhp;
							return [current, eff];
						})
						.sort((a, b) => b[1] - a[1])[0];
					if (list[1] < 0) {
						return 0;
					}
					var targetx = list[0],
						sign = get.sgnAttitude(player, target);
					if (ui.selected.targets.length) {
						return target == targetx ? sign : 0;
					}
					return (
						sign *
						(game
							.filterPlayer(current => {
								return current != player && current != targetx;
							})
							.map(current => {
								var _hp = targetx.hp,
									_maxhp = targetx.maxHp;
								targetx.hp = 10;
								targetx.maxHp = 10;
								var eff = -get.damageEffect(targetx, current, current);
								targetx.hp = _hp;
								targetx.maxHp = _maxhp;
								return [current, eff];
							})
							.sort((a, b) => b[1] - a[1])[0][0] == target
							? 10
							: 1)
					);
				},
			},
			order: 9.5,
			expose: 0.2,
		},
	},
	//马日磾
	chengye: {
		audio: 3,
		liujing_filter: [
			function (card) {
				return get.type(card, null, false) == "trick" && get.tag(card, "damage", null, false) > 0;
			},
			card => get.type(card, null, false) == "basic",
			card => get.name(card, false) == "wuxie",
			card => get.name(card, false) == "wuzhong",
			card => get.name(card, false) == "lebu",
			card => get.type(card, null, false) == "equip",
		],
		getLiujing(player, index) {
			var filter = lib.skill.chengye.liujing_filter[index],
				expansion = player.getExpansions("chengye");
			for (var i of expansion) {
				if (filter(i)) {
					return i;
				}
			}
			return false;
		},
		trigger: {
			global: ["useCardAfter", "loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
		},
		forced: true,
		filter(event, player) {
			if (player == event.player) {
				return false;
			}
			if (event.name == "useCard") {
				if (!event.card.isCard) {
					return false;
				}
				var cards = event.cards.filterInD();
				if (!cards.length) {
					return false;
				}
			} else if (event.name != "cardsDiscard") {
				var cards = event.getd(null, "cards2").filter(function (card) {
					if (get.position(card, true) != "d") {
						return false;
					}
					var type = get.type(card, null, false);
					return type == "delay" || type == "equip";
				});
				cards.removeArray(event.getd(player, "cards2"));
				if (!cards.length) {
					return false;
				}
			} else {
				var evtx = event.getParent();
				if (evtx.name != "orderingDiscard") {
					return false;
				}
				var evt2 = evtx.relatedEvent || evtx.getParent();
				if (evt2.name != "phaseJudge" || evt2.player == player) {
					return;
				}
				var cards = event.cards.filter(function (card) {
					if (get.position(card, true) != "d") {
						return false;
					}
					var type = get.type(card, null, false);
					return type == "delay";
				});
				if (!cards.length) {
					return false;
				}
			}
			for (var i = 0; i < 6; i++) {
				if (lib.skill.chengye.getLiujing(player, i)) {
					continue;
				}
				for (var j of cards) {
					if (lib.skill.chengye.liujing_filter[i](j)) {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			var cards,
				cards2 = [];
			if (trigger.name == "useCard") {
				cards = trigger.cards.filterInD();
			} else if (trigger.name != "cardsDiscard") {
				cards = trigger.getd().filter(function (card) {
					if (card.original == "j" || get.position(card, true) != "d") {
						return false;
					}
					var type = get.type(card, null, false);
					return type == "delay" || type == "equip";
				});
				cards.removeArray(trigger.getd(player));
			} else {
				cards = trigger.cards.filter(function (card) {
					if (get.position(card, true) != "d") {
						return false;
					}
					var type = get.type(card, null, false);
					return type == "delay";
				});
			}
			for (var i = 0; i < 6; i++) {
				if (lib.skill.chengye.getLiujing(player, i)) {
					continue;
				}
				for (var j of cards) {
					if (lib.skill.chengye.liujing_filter[i](j)) {
						cards.remove(j);
						cards2.push(j);
						break;
					}
				}
				if (!cards.length) {
					break;
				}
			}
			player.addToExpansion(cards2, "gain2").gaintag.add("chengye");
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		mark: true,
		marktext: "经",
		intro: {
			name: "六经",
			markcount: "expansion",
			content: "expansion",
			mark(dialog, storage, player) {
				let list1 = [],
					list2 = [];
				var list = ["《诗经》", "《尚书》", "《仪礼》", "《易经》", "《乐经》", "《春秋》"];
				var desc = ["伤害类锦囊牌", "基本牌", "无懈可击", "无中生有", "乐不思蜀", "装备牌"];
				const addNewRow = lib.element.dialog.addNewRow.bind(dialog);
				dialog.css({ width: "60%" });
				for (var i = 0; i < 6; i++) {
					var card = lib.skill.chengye.getLiujing(player, i);
					(i <= 2 ? list1 : list2).addArray([
						{ item: list[i] + '<div class="text center">' + desc[i] + "</div>", ratio: 6 },
						{ item: card ? [card] : [], ratio: 6 },
					]);
				}
				addNewRow(...list1);
				addNewRow(...list2);
			},
		},
		group: "chengye_gain",
		subSkill: {
			gain: {
				audio: "chengye",
				trigger: { player: "phaseUseBegin" },
				filter(event, player) {
					return player.getExpansions("chengye").length >= 6;
				},
				forced: true,
				content() {
					player.gain(player.getExpansions("chengye"), "gain2");
				},
			},
		},
	},
	buxu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			var num = (player.getStat("skill").buxu || 0) + 1;
			return player.countCards("he") >= num && player.getExpansions("chengye").length < 6;
		},
		chooseButton: {
			chooseControl(event, player) {
				var list = ["诗经", "尚书", "仪礼", "易经", "乐经", "春秋"];
				var choices = [];
				for (var i = 0; i < 6; i++) {
					if (!lib.skill.chengye.getLiujing(player, i)) {
						choices.push(list[i]);
					}
				}
				choices.push("cancel2");
				return choices;
			},
			check(event, player) {
				var list = [4, 3, 5, 0, 2, 1];
				for (var i of list) {
					if (!lib.skill.chengye.getLiujing(player, i)) {
						return ["诗经", "尚书", "仪礼", "易经", "乐经", "春秋"][i];
					}
				}
				return "cancel2";
			},
			dialog(event, player) {
				var num = (player.getStat("skill").buxu || 0) + 1;
				return ui.create.dialog("###补续###弃置" + get.cnNumber(num) + "张牌并补充一张“六经”");
			},
			prompt(links, player) {
				var num = (player.getStat("skill").buxu || 0) + 1;
				return "弃置" + get.cnNumber(num) + "张牌并补充一张《" + links.control + "》";
			},
			backup(links, player) {
				return {
					audio: "buxu",
					index: ["诗经", "尚书", "仪礼", "易经", "乐经", "春秋"].indexOf(links.control),
					filterCard: true,
					position: "he",
					selectCard: (player.getStat("skill").buxu || 0) + 1,
					ai1(card) {
						var player = _status.event.player;
						if (
							player.needsToDiscard(0, (i, player) => {
								return !ui.selected.cards.includes(i) && !player.canIgnoreHandcard(i);
							})
						) {
							return 10 / Math.max(0.1, get.value(card));
						}
						return 5 - (player.getStat("skill").buxu || 0) - get.value(card);
					},
					ai2: () => 1,
					content() {
						var filter = lib.skill.chengye.liujing_filter[lib.skill.buxu_backup.index];
						var card = get.cardPile2(filter);
						if (card) {
							player.addToExpansion(card, "gain2").gaintag.add("chengye");
						}
					},
					ai: { result: { player: 1 } },
				};
			},
		},
		ai: {
			combo: "chengye",
			order: 0.2,
			result: { player: 1 },
		},
	},
	//阮慧
	mingcha: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		forced: true,
		locked: false,
		filter: event => !event.numFixed,
		content() {
			"step 0";
			var cards = game.cardsGotoOrdering(get.cards(3)).cards,
				cards2 = cards.slice(0);
			event.cards = cards.filter(function (i) {
				return get.number(i) < 9;
			});
			// while(cards2.length>0){
			// 	var card=cards2.pop();
			// 	card.fix();
			// 	ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
			// }
			// game.updateRoundNumber();
			player.showCards(cards, get.translation(player) + "发动了【明察】");
			if (!event.cards.length) {
				event.finish();
			}
			"step 1";
			player.chooseBool("是否放弃摸牌并获得" + get.translation(cards)).set("goon", trigger.num - cards.length <= 1);
			"step 2";
			if (result.bool) {
				trigger.changeToZero();
				player.gain(cards, "gain2");
			} else {
				event.finish();
			}
			"step 3";
			player
				.chooseTarget("是否随机获得其他角色的一张牌？", function (card, player, target) {
					return target != player && target.countCards("he") > 0;
				})
				.set("ai", function (target) {
					return 3 - get.attitude(player, target);
				});
			"step 4";
			if (result.bool) {
				var target = result.targets[0],
					cards = target.getGainableCards(player, "he");
				player.line(target, "green");
				if (cards.length) {
					player.gain(cards.randomGet(), target, "giveAuto", "bySelf");
				}
			}
		},
	},
	jingzhong: {
		audio: 2,
		trigger: { player: "phaseDiscardAfter" },
		filter(event, player) {
			var num = 0;
			player.getHistory("lose", function (evt) {
				if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
					for (var i of evt.cards2) {
						if (get.color(i, player) == "black") {
							num++;
						}
					}
				}
			});
			return num > 1;
		},
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("jingzhong"), "获得一名其他角色下回合出牌阶段内使用的牌", lib.filter.notMe).set("ai", function (target) {
				return Math.sqrt(target.countCards("h")) * get.threaten(target);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("jingzhong", target);
				player.addSkill("jingzhong_effect");
				player.markAuto("jingzhong_effect", [target]);
				game.delayx();
			}
		},
		subSkill: {
			effect: {
				audio: "jingzhong",
				trigger: { global: "useCardAfter" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					if (!player.getStorage("jingzhong_effect").includes(event.player) || !event.cards.filterInD().length) {
						return false;
					}
					var evt = event.getParent("phaseUse");
					if (!evt || evt.player != event.player) {
						return false;
					}
					return (
						player.getHistory("useSkill", function (evtx) {
							return evtx.skill == "jingzhong_effect" && evtx.event.getParent("phaseUse") == evt;
						}).length < 3
					);
				},
				logTarget: "player",
				content() {
					player.gain(trigger.cards.filterInD(), "gain2");
				},
				mark: true,
				intro: { content: "已指定$为目标" },
				group: "jingzhong_remove",
			},
			remove: {
				trigger: { global: "phaseAfter" },
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return player.getStorage("jingzhong_effect").includes(event.player);
				},
				content() {
					var storage = player.getStorage("jingzhong_effect");
					storage.remove(trigger.player);
					if (!storage.length) {
						player.removeSkill("jingzhong_effect");
					}
				},
			},
		},
	},
	//全琮
	sbyaoming: {
		audio: 2,
		chargeSkill: 4,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCharge() > 0;
		},
		filterTarget: true,
		prompt() {
			var num = _status.event.player.storage.sbyaoming_status;
			var list = ["弃置一名手牌数不小于你的角色的一张牌", "；或令一名手牌数不大于你的角色摸一张牌"];
			if (typeof num == "number") {
				list[num] += "（上次选择）";
			}
			return list[0] + list[1];
		},
		content() {
			"step 0";
			player.removeCharge();
			var num = target.countCards("h"),
				num2 = player.countCards("h");
			if (num == num2 && target.countCards("he") > 0) {
				var choice = get.attitude(player, target) > 0 ? 1 : 0;
				var str = get.translation(target),
					choiceList = ["弃置" + str + "的一张牌", "令" + str + "摸一张牌"];
				if (typeof player.storage.sbyaoming_status == "number") {
					choiceList[player.storage.sbyaoming_status] += "（上次选择）";
				}
				var next = player.chooseControl().set("choiceList", choiceList);
				next.set("ai_choice", choice);
				next.set("ai", () => _status.event.ai_choice);
			} else {
				event._result = { index: num > num2 ? 0 : 1 };
			}
			"step 1";
			if (result.index == 0) {
				player.discardPlayerCard(target, true, "he");
			} else {
				target.draw();
			}
			if (typeof player.storage.sbyaoming_status == "number" && result.index != player.storage.sbyaoming_status) {
				player.addCharge();
				delete player.storage.sbyaoming_status;
			} else {
				player.storage.sbyaoming_status = result.index;
			}
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					var att = get.attitude(player, target),
						eff = [0, 0];
					var hs = player.countCards("h"),
						ht = target.countCards("h");
					if (hs >= ht) {
						eff[0] = get.effect(target, { name: "draw" }, player, player);
						if (player.storage.sbyaoming_status == 0) {
							eff[0] *= 1.2;
						}
					}
					if (hs <= ht) {
						eff[1] = get.effect(target, { name: "guohe_copy2" }, player, player);
						if (player.storage.sbyaoming_status == 1) {
							eff[1] *= 1.2;
						}
					}
					return Math.max.apply(Math, eff);
				},
			},
		},
		group: ["sbyaoming_damage", "sbyaoming_init"],
		subSkill: {
			damage: {
				trigger: { player: "damageEnd" },
				direct: true,
				content() {
					"step 0";
					if (player.countCharge(true)) {
						player.logSkill("sbyaoming_damage");
						player.addCharge(trigger.num);
						game.delayx();
					}
					"step 1";
					player.chooseTarget(get.prompt("sbyaoming"), lib.skill.sbyaoming.prompt()).set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, "sbyaoming", player, player);
					});
					"step 2";
					if (result.bool) {
						player.useSkill("sbyaoming", result.targets);
					}
				},
			},
			init: {
				audio: "sbyaoming",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return (event.name != "phase" || game.phaseNumber == 0) && player.countCharge(true);
				},
				content() {
					player.addCharge(2);
				},
			},
		},
	},
	//手杀界荀彧
	rejieming: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.num > 0;
		},
		getIndex: event => event.num,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const att = get.attitude(get.player(), target);
					if (att > 2) {
						if (target.maxHp - target.countCards("h") > 2) {
							return 2 * att;
						}
						return att;
					}
					return att / 3;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			player.line(target, "thunder");
			await target.draw(2);
			if (target.countCards("h") < target.maxHp) {
				await player.draw();
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && target.hp > 1) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						var max = 0;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (get.attitude(target, players[i]) > 0) {
								max = Math.max(Math.min(5, players[i].hp) - players[i].countCards("h"), max);
							}
						}
						switch (max) {
							case 0:
								return 2;
							case 1:
								return 1.5;
							case 2:
								return [1, 2];
							default:
								return [0, max];
						}
					}
					if ((card.name == "tao" || card.name == "caoyao") && target.hp > 1 && target.countCards("h") <= target.hp) {
						return [0, 0];
					}
				},
			},
		},
	},
	//沮授
	xinjianying: {
		audio: 2,
		subfrequent: ["draw"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (!player.countCards("he")) {
				return false;
			}
			for (var i of lib.inpile) {
				if (i != "du" && get.type(i, null, false) == "basic") {
					if (event.filterCard({ name: i }, player, event)) {
						return true;
					}
					if (i == "sha") {
						for (var j of lib.inpile_nature) {
							if (event.filterCard({ name: i, nature: j }, player, event)) {
								return true;
							}
						}
					}
				}
			}
			return false;
		},
		onChooseToUse(event) {
			if (event.type == "phase" && !game.online) {
				var last = event.player.getLastUsed();
				if (last && last.getParent("phaseUse") == event.getParent()) {
					var suit = get.suit(last.card, false);
					if (suit != "none") {
						event.set("xinjianying_suit", suit);
					}
				}
			}
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				var suit = event.xinjianying_suit || "",
					str = get.translation(suit);
				for (var i of lib.inpile) {
					if (i != "du" && get.type(i, null, false) == "basic") {
						if (event.filterCard({ name: i }, player, event)) {
							list.push(["基本", str, i]);
						}
						if (i == "sha") {
							for (var j of lib.inpile_nature) {
								if (event.filterCard({ name: i, nature: j }, player, event)) {
									list.push(["基本", str, i, j]);
								}
							}
						}
					}
				}
				return ui.create.dialog("渐营", [list, "vcard"]);
			},
			check(button) {
				if (button.link[2] == "jiu") {
					return 0;
				}
				return _status.event.player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				var next = {
					audio: "xinjianying",
					filterCard: true,
					popname: true,
					position: "he",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					ai1(card) {
						return 7 - _status.event.player.getUseValue(card, null, true);
					},
				};
				if (_status.event.xinjianying_suit) {
					next.viewAs.suit = _status.event.xinjianying_suit;
				}
				return next;
			},
			prompt(links) {
				return (
					"将一张牌当做" +
					(get.translation(links[0][3]) || "") +
					get.translation(links[0][2]) +
					(_status.event.xinjianying_suit ? "(" + get.translation(_status.event.xinjianying_suit) + ")" : "") +
					"使用"
				);
			},
		},
		ai: {
			order(item, player) {
				if (_status.event.xinjianying_suit) {
					return 16;
				}
				return 3;
			},
			result: { player: 7 },
		},
		group: ["xinjianying_draw", "jianying_mark"],
		init(player) {
			if (player.isPhaseUsing()) {
				var evt = _status.event.getParent("phaseUse");
				var history = player.getHistory("useCard", function (evt2) {
					return evt2.getParent("phaseUse") == evt;
				});
				if (history.length) {
					var trigger = history[history.length - 1];
					player.storage.jianying_mark = trigger.card;
					player.markSkill("jianying_mark");
					game.broadcastAll(
						function (player, suit) {
							if (player.marks.jianying_mark) {
								player.marks.jianying_mark.firstChild.innerHTML = get.translation(suit);
							}
						},
						player,
						get.suit(trigger.card, player)
					);
					player.when("phaseUseAfter").step(async () => {
						player.unmarkSkill("jianying_mark");
						delete player.storage.jianying_mark;
					});
				}
			}
		},
		onremove(player) {
			player.unmarkSkill("jianying_mark");
			delete player.storage.jianying_mark;
		},
		subSkill: {
			draw: { inherit: "jianying", audio: "xinjianying" },
		},
	},
	//步练师
	reanxu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				game.countPlayer() > 2 &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("he");
				})
			);
		},
		selectTarget: 2,
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			if (!ui.selected.targets.length) {
				return target.countCards("he") > 0;
			}
			return target != ui.selected.targets[0] && ui.selected.targets[0].countGainableCards(target, "he") > 0;
		},
		multitarget: true,
		targetprompt: ["被拿牌", "得到牌"],
		content() {
			"step 0";
			targets[1].gainPlayerCard(targets[0], "he", true);
			"step 1";
			if (
				targets[0].getHistory("lose", function (evt) {
					return evt.getParent(3) == event && !evt.es.length;
				}).length
			) {
				player.draw();
			}
			"step 2";
			if (targets[0].isIn() && targets[1].isIn() && targets[0].countCards("h") != targets[1].countCards("h")) {
				event.target = targets[targets[0].countCards("h") > targets[1].countCards("h") ? 1 : 0];
				player.chooseBool("是否令" + get.translation(event.target) + "摸一张牌？").set("ai", function () {
					var evt = _status.event.getParent();
					return get.attitude(evt.player, evt.target) > 0;
				});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				target.draw();
			}
		},
		ai: {
			expose: 0.2,
			threaten: 2,
			order: 9,
			result: {
				player(player, target) {
					if (ui.selected.targets.length) {
						return 0.01;
					}
					return target.countCards("e") ? 0 : 0.5;
				},
				target(player, target) {
					if (ui.selected.targets.length) {
						player = target;
						target = ui.selected.targets[0];
						if (get.attitude(player, target) > 1) {
							return 0;
						}
						return target.countCards("h") - player.countCards("h") > (target.countCards("e") ? 2 : 1) ? 2 : 1;
					} else {
						if (get.attitude(player, target) <= 0) {
							return target.countCards("he", function (card) {
								return card.name == "tengjia" || get.value(card) > 0;
							}) > 0
								? -1.5
								: 1.5;
						}
						return target.countCards("he", function (card) {
							return card.name != "tengjia" && get.value(card) <= 0;
						}) > 0
							? 1.5
							: -1.5;
					}
				},
			},
		},
	},
	//蒋干
	spdaoshu: {
		audio: 3,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			var goon = event.player != player && (get.mode() == "identity" || get.mode() == "guozhan" || event.player.isEnemyOf(player));
			return goon && event.player.countCards("h") > 0 && event.player.hasUseTarget({ name: "jiu", isCard: true }, null, true);
		},
		round: 1,
		logTarget: "player",
		check(event, player) {
			var target = event.player;
			var att = get.attitude(player, target);
			if (att > 0) {
				return false;
			}
			if (att == 0) {
				return !player.inRangeOf(target);
			}
			return true;
		},
		logAudio: () => 1,
		content() {
			"step 0";
			event.target = trigger.player;
			event.target.chooseUseTarget("jiu", true);
			"step 1";
			if (!target.countCards("h")) {
				event.finish();
				return;
			}
			var list = [];
			for (var i of lib.inpile) {
				if (get.type(i) == "basic") {
					list.push(i);
				}
			}
			if (!list.length) {
				event.finish();
				return;
			}
			target
				.chooseControl(list)
				.set("prompt", "请声明一种基本牌")
				.set("ai", () => _status.event.rand)
				.set("rand", get.rand(0, list.length - 1));
			"step 2";
			event.cardname = result.control;
			target.chat("我声明" + get.translation(event.cardname));
			game.log(target, "声明的牌名为", "#y" + get.translation(event.cardname));
			game.delayx();
			player
				.chooseControl("有！", "没有！")
				.set("prompt", "你觉得" + get.translation(target) + "的手牌区里有" + get.translation(event.cardname) + "吗？")
				.set("ai", function () {
					return _status.event.choice;
				})
				.set(
					"choice",
					(function () {
						var rand =
							{
								sha: 0.273,
								shan: 0.149,
								tao: 0.074,
								jiu: 0.031,
							}[event.cardname] || 0.1;
						return 1 - Math.pow(1 - rand, target.countCards("h")) > 0.5 ? "有！" : "没有！";
					})()
				);
			"step 3";
			player.chat(result.control);
			game.log(player, "认为", "#y" + result.control);
			game.delayx();
			"step 4";
			var bool1 = result.index == 0;
			var bool2 = target.hasCard(function (card) {
				return get.name(card, target) == event.cardname;
			}, "h");
			if (bool1 == bool2) {
				player.popup("判断正确", "wood");
				game.broadcastAll(function () {
					if (lib.config.background_speak) {
						game.playAudio("skill", "spdaoshu2");
					}
				});
				player.gainPlayerCard(target, "h", 2, true);
				//var cards=target.getCards('h',function(card){
				//	return lib.filter.canBeGained(card,player,target);
				//}).randomGets(5);
				//if(cards.length>0) player.gain(cards,target,'giveAuto','bySelf');
			} else {
				player.popup("判断错误", "fire");
				game.broadcastAll(function () {
					if (lib.config.background_speak) {
						game.playAudio("skill", "spdaoshu3");
					}
				});
				//player.addTempSkill('spdaoshu_respond');
			}
		},
		ai: { expose: 0.3 },
		subSkill: {
			respond: {
				trigger: { global: "useCard1" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.player == _status.currentPhase;
				},
				content() {
					trigger.directHit.add(player);
				},
			},
		},
	},
	mbdaoshu: {
		audio: 3,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.mbdaoshu.filterTarget(event, player, target));
		},
		filterTarget(card, player, target) {
			if (!["guozhan", "identity"].includes(get.mode()) && target.isFriendOf(player)) {
				return false;
			}
			return target != player && target.countCards("h") >= 2;
		},
		usable: 1,
		logAudio: () => 1,
		async content(event, trigger, player) {
			var target = event.target;
			var targets = [player],
				names = lib.inpile.randomGets(3);
			if (!names.length) {
				return;
			}
			var map = {};
			names.forEach(name => (map[get.translation(name)] = name));
			if (get.mode() != "identity" && get.mode() != "guozhan") {
				targets.addArray(player.getFriends());
			}
			targets.remove(target);
			targets.sortBySeat();
			var result = await target
				.chooseButton(["盗书：请选择伪装的牌和牌名", target.getCards("h"), [Object.keys(map), "tdnodes"]], 2, true)
				.set("filterButton", button => {
					var map = _status.event.map;
					if (!ui.selected.buttons.length) {
						return true;
					}
					if (typeof button.link == typeof ui.selected.buttons[0].link) {
						return false;
					}
					if (typeof button.link == "string") {
						return get.name(ui.selected.buttons[0].link, false) != map[button.link];
					}
					return map[ui.selected.buttons[0].link] != get.name(button.link, false);
				})
				.set("ai", button => {
					var map = _status.event.map;
					if (!ui.selected.buttons.length) {
						if (typeof button.link == "object") {
							if (
								Object.values(map).some(name =>
									lib.card.list.some(
										card =>
											card[0] == get.suit(button.link, false) && card[1] == get.number(button.link, false) && card[2] == name
									)
								)
							) {
								return 5;
							}
							return 3.5 + Math.random();
						}
						return 0;
					}
					if (typeof button.link == "string") {
						var cardx = ui.selected.buttons[0].link;
						if (
							lib.card.list.some(
								card => card[0] == get.suit(cardx, false) && card[1] == get.number(cardx, false) && card[2] == map[button.link]
							)
						) {
							return 2 + Math.random();
						}
						return 1;
					}
					return 0;
				})
				.set("map", map)
				.forResult();
			if (result.bool) {
				var guessWinner = [];
				if (typeof result.links[0] == "string") {
					result.links.reverse();
				}
				var OriginCard = result.links[0],
					ChangeName = map[result.links[1]],
					cards = target.getCards("h").slice();
				var card = game.createCard(ChangeName, get.suit(OriginCard, false), get.number(OriginCard, false));
				cards[cards.indexOf(OriginCard)] = card;
				var list = targets.map(target2 => [target2, ["请猜测" + get.translation(target) + "伪装的手牌", cards], true]);
				var result2 = await player
					.chooseButtonOL(list)
					.set("switchToAuto", () => (_status.event.result = "ai"))
					.set("processAI", () => {
						var cards = _status.event.getParent().cards ?? _status.event.dialog.buttons.map(button => button.link);
						var card = cards.find(
							card =>
								lib.card.list.some(cardx => cardx[2] == card.name) &&
								!lib.card.list.some(
									cardx => cardx[2] == card.name && cardx[0] == get.suit(card, false) && cardx[0] == get.number(card, false)
								)
						);
						return {
							bool: true,
							links: [card ? card : cards.randomGet()],
						};
					})
					.set("cards", cards)
					.forResult();
				for (var i in result2) {
					if (result2[i].links?.[0] == card) {
						guessWinner.push((_status.connectMode ? lib.playerOL : game.playerMap)[i]);
					}
				}
				targets.forEach(target2 => {
					if (guessWinner.includes(target2)) {
						target2.popup("判断正确", "wood");
						game.log(target2, "猜测", "#g正确");
						game.broadcastAll(() => {
							if (lib.config.background_speak) {
								game.playAudio("skill", "mbdaoshu2");
							}
						});
						target2.line(target);
						target.damage(1, target2);
					} else {
						target2.popup("判断错误", "fire");
						game.log(target2, "猜测", "#y错误");
						game.broadcastAll(() => {
							if (lib.config.background_speak) {
								game.playAudio("skill", "mbdaoshu3");
							}
						});
						if (target2.countDiscardableCards(target, "h") >= 2) {
							target2.discard(target2.getDiscardableCards(target, "h").randomGets(2));
						} else {
							target2.loseHp();
						}
					}
				});
			}
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					return -1 / target.countCards("h");
				},
			},
		},
	},
	spdaizui: {
		audio: 2,
		trigger: { player: "damageBegin2" },
		limited: true,
		logTarget: "source",
		filter(event, player) {
			return event.num >= player.hp && event.source && event.source.isIn() && event.cards && event.cards.filterInD().length > 0;
		},
		prompt2(event) {
			return (
				"防止即将受到的" +
				get.cnNumber(event.num) +
				"点伤害，并令" +
				get.translation(event.source) +
				"将" +
				get.translation(event.cards.filterInD()) +
				"置于武将牌上且回合结束时收回"
			);
		},
		skillAnimation: true,
		animationColor: "thunder",
		content() {
			player.awakenSkill(event.name);
			trigger.source.addSkill("spdaizui2");
			trigger.source.addToExpansion(trigger.cards.filterInD(), "gain2").gaintag.add("spdaizui2");
			trigger.cancel();
		},
	},
	spdaizui2: {
		trigger: { global: "phaseEnd" },
		forced: true,
		charlotte: true,
		sourceSkill: "spdaizui",
		filter(event, player) {
			return player.getExpansions("spdaizui2").length > 0;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("spdaizui2");
			player.gain(cards, "gain2");
			"step 1";
			player.removeSkill("spdaizui2");
		},
		marktext: "释",
		intro: {
			markcount: "expansion",
			content: "expansion",
		},
	},
	//裴秀
	xingtu: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			player.addTip("xingtu", `行图 ${get.translation(get.number(event.card, player))}`);
			const evt = lib.skill.dcjianying.getLastUsed(player, event);
			if (!evt?.card) {
				return false;
			}
			const num1 = get.number(event.card),
				num2 = get.number(evt.card);
			return typeof num1 == "number" && typeof num2 == "number" && num2 != 0 && num2 % num1 == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.draw();
		},
		mod: {
			cardUsable(card, player) {
				if (typeof card == "object") {
					let num1 = get.number(card);
					if (num1 != "unsure" && typeof num1 != "number") {
						return;
					}
					if ([card].concat(card.cards || []).some(cardx => get.itemtype(cardx) === "card" && cardx.hasGaintag("xingtu1"))) {
						return Infinity;
					}
					let num2 = player.storage.xingtu_mark;
					if (typeof num2 == "number" && num1 % num2 == 0) {
						return Infinity;
					}
				}
			},
			aiOrder(player, card, num) {
				if (typeof card == "object") {
					let num1 = get.number(card);
					if (num1 != "unsure" && typeof num1 != "number") {
						return;
					}
					if (!card.cards) {
						return;
					}
					for (var i of card.cards) {
						if (i.hasGaintag("xingtu1")) {
							return num + 5;
						}
					}
					let num2 = player.storage.xingtu_mark;
					if (typeof num2 == "number" && num1 % num2 == 0) {
						return num + 5;
					}
				}
			},
		},
		init(player) {
			player.addSkill("xingtu_mark");
			const history = player.getAllHistory("useCard");
			if (history.length) {
				const trigger = history[history.length - 1],
					num = get.number(trigger.card);
				player.storage.xingtu_mark = num;
				player[typeof num != "number" ? "unmarkSkill" : "markSkill"]("xingtu_mark");
			}
		},
		onremove(player) {
			player.removeSkill("xingtu_mark");
			player.removeGaintag("xingtu1");
			player.removeGaintag("xingtu2");
			player.removeTip("xingtu");
			delete player.storage.xingtu_mark;
		},
		subSkill: {
			mark: {
				charlotte: true,
				trigger: {
					player: ["useCard1", "gainAfter"],
					global: "loseAsyncAfter",
				},
				filter(event, player, name) {
					return name == "useCard1" || (event.getg?.(player)?.length && player.countCards("h"));
				},
				direct: true,
				firstDo: true,
				async content(event, trigger, player) {
					player.removeGaintag("xingtu1");
					player.removeGaintag("xingtu2");
					if (event.triggername == "useCard1") {
						const num = get.number(trigger.card, player);
						player.storage.xingtu_mark = num;
						player[typeof num != "number" ? "unmarkSkill" : "markSkill"]("xingtu_mark");
						if (typeof num != "number") {
							return;
						}
					}
					const cards1 = [],
						cards2 = [],
						num = player.storage.xingtu_mark;
					player.getCards("h").forEach(card => {
						const numx = get.number(card, player);
						if (typeof numx == "number") {
							if (numx % num == 0) {
								cards1.push(card);
							}
							if (num % numx == 0 && typeof num == "number" && num != 0) {
								cards2.push(card);
							}
						}
					});
					if (cards1.length) {
						player.addGaintag(cards1, "xingtu1");
					}
					if (cards2.length) {
						player.addGaintag(cards2, "xingtu2");
					}
				},
				intro: { content: "上一张牌的点数：#" },
			},
		},
	},
	juezhi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he") > 1;
		},
		filterCard: true,
		position: "he",
		selectCard: [2, Infinity],
		check(card) {
			if (ui.selected.cards.length > 1) {
				return 0;
			}
			var player = _status.event.player;
			if (player.hasSkill("xingtu") && player.storage.xingtu) {
				var cards = player.getCards("he");
				var num = player.storage.xingtu,
					stop = false;
				for (var i = 0; i <= cards.length; i++) {
					if (i != cards.length) {
						var num1 = get.number(cards[i], player);
						if (typeof num1 != "number") {
							continue;
						}
						for (var j = 0; j < cards.length; j++) {
							if (i == j) {
								continue;
							}
							var num2 = get.number(cards[j], player);
							if (typeof num2 != "number") {
								continue;
							}
							var sum = num1 + num2;
							if (sum % num == 0 || num % sum == 0) {
								stop = true;
								break;
							}
						}
						if (stop) {
							break;
						}
					}
				}
				if (i != cards.length) {
					var cardx = [cards[i], cards[j]];
					if (cardx.includes(card)) {
						return 10 - get.value(card);
					}
				}
			}
			return 5 - get.value(card);
		},
		allowChooseAll: true,
		content() {
			var num = 0;
			for (var i of cards) {
				num += get.number(i, player);
			}
			num = num % 13;
			if (num == 0) {
				num = 13;
			}
			var card = get.cardPile2(function (card) {
				return get.number(card, false) == num;
			});
			if (card) {
				player.gain(card, "gain2");
			}
		},
		ai: {
			order: 1,
			result: { player: 1 },
		},
	},
	reganlu: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		selectTarget: 2,
		delay: 0,
		filterTarget(card, player, target) {
			if (target.isMin()) {
				return false;
			}
			if (ui.selected.targets.length == 0) {
				return true;
			}
			if (ui.selected.targets[0].countCards("e") == 0 && target.countCards("e") == 0) {
				return false;
			}
			return (
				target == player ||
				ui.selected.targets[0] == player ||
				Math.abs(ui.selected.targets[0].countCards("e") - target.countCards("e")) <= player.maxHp - player.hp
			);
		},
		multitarget: true,
		multiline: true,
		content() {
			targets[0].swapEquip(targets[1]);
		},
		ai: {
			order: 10,
			threaten(player, target) {
				return 0.8 * Math.max(1 + target.maxHp - target.hp);
			},
			result: {
				target(player, target) {
					var list1 = [];
					var list2 = [];
					var num = player.maxHp - player.hp;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (get.attitude(player, players[i]) > 0) {
							list1.push(players[i]);
						} else if (get.attitude(player, players[i]) < 0) {
							list2.push(players[i]);
						}
					}
					list1.sort(function (a, b) {
						return a.countCards("e") - b.countCards("e");
					});
					list2.sort(function (a, b) {
						return b.countCards("e") - a.countCards("e");
					});
					var delta;
					for (var i = 0; i < list1.length; i++) {
						for (var j = 0; j < list2.length; j++) {
							delta = list2[j].countCards("e") - list1[i].countCards("e");
							if (delta <= 0) {
								continue;
							}
							if (delta <= num || list1[i] == player || list2[j] == player) {
								if (target == list1[i] || target == list2[j]) {
									return get.attitude(player, target);
								}
								return 0;
							}
						}
					}
					return 0;
				},
			},
		},
	},
	//孙休
	mobilexingxue: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return (player.storage.mobileyanzhu ? player.maxHp : player.hp) > 0;
		},
		async cost(event, trigger, player) {
			const num = player.storage.mobileyanzhu ? player.maxHp : player.hp;
			event.result = await player
				.chooseTarget([1, num], get.prompt2(event.skill))
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					if (target.countCards("he")) {
						return att;
					}
					return att / 10;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			await game.doAsyncInOrder(targets, async target => {
				await target.draw();
				if (target.countCards("he")) {
					let result;
					if (!player.storage.mobileyanzhu || targets.length == 1) {
						result = await target.chooseCard("选择一张牌置于牌堆顶", "he", true).forResult();
					} else {
						result = await target
							.chooseCardTarget({
								prompt: "将一张牌置于牌堆顶，或交给其他目标角色",
								filterCard: true,
								position: "he",
								filterTarget(card, player, target) {
									return target != player && get.event().targets.includes(target);
								},
								targets: targets,
								forced: true,
								selectTarget: [0, 1],
								ai1: card => 6 - get.value(card),
								ai2: target => get.attitude(_status.event.player, target),
							})
							.forResult();
					}
					if (result.bool && result.cards?.length) {
						const { cards, targets } = result;
						if (targets?.length) {
							await target.give(cards, targets[0]);
						} else {
							target.$throw(cards.length, 1000);
							game.log(target, `将${get.cnNumber(cards.length)}张牌置于牌堆顶`);
							await target.lose(cards, ui.cardPile, "insert");
						}
					}
				}
			});
		},
		derivation: "mobilexingxuex",
	},
	mobileyanzhu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countCards("he") > 0 && target != player;
		},
		async content(event, trigger, player) {
			const { target } = event;
			let result;
			if (target.countCards("e")) {
				result = await target
					.chooseBool("是否将装备区内的所有牌交给" + get.translation(player) + "？", "若选择“取消”，则其将获得你区域里的一张牌")
					.set("ai", function () {
						if (_status.event.effect > 0) {
							return false;
						}
						if (_status.event.player.countCards("e") >= 3) {
							return false;
						}
						return true;
					})
					.set("effect", get.effect(target, { name: "shunshou" }, player, target))
					.forResult();
			} else {
				result = { bool: false };
			}
			if (result.bool) {
				const es = target.getCards("e");
				await target.give(es, player, "give");
				await player.removeSkills("mobileyanzhu");
				player.storage.mobileyanzhu = true;
				player.popup("兴学");
				game.log(player, "修改了技能", "#g【兴学】");
			} else {
				await player.gainPlayerCard(target, true, "he");
			}
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					var ne = target.countCards("e"),
						nj = target.countCards("j");
					if (nj) {
						return 2.5;
					}
					if (!ne) {
						return -2;
					}
					if (ne >= 2) {
						return -ne;
					}
					return 0;
				},
			},
		},
	},
	//毛玠
	bingqing: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			const evt = event.getParent("phaseUse");
			if (!evt || !evt.player || evt.player != player) {
				return false;
			}
			const suit = get.suit(event.card);
			if (!lib.suit.includes(suit)) {
				return false;
			}
			if (
				player
					.getHistory("useCard", evtx => {
						return evtx.getParent("phaseUse") == evt && get.suit(evtx.card) == suit;
					})
					.indexOf(event) != 0
			) {
				return false;
			}
			return Array.from({ length: 3 })
				.map((_, i) => i + 2)
				.includes(
					player
						.getHistory(
							"useCard",
							evtx => {
								return evtx.getParent("phaseUse") == evt && lib.suit.includes(get.suit(evtx.card));
							},
							event
						)
						.reduce((list, evtx) => list.add(get.suit(evtx.card)), []).length
				);
		},
		async cost(event, trigger, player) {
			const evt = trigger.getParent("phaseUse");
			const num = player
				.getHistory(
					"useCard",
					evtx => {
						return evtx.getParent("phaseUse") == evt && lib.suit.includes(get.suit(evtx.card));
					},
					trigger
				)
				.reduce((list, evtx) => list.add(get.suit(evtx.card)), []).length;
			let prompt, filterTarget, ai;
			switch (num) {
				case 2:
					prompt = "令一名角色摸两张牌";
					filterTarget = function (card, player, target) {
						return true;
					};
					ai = function (target) {
						var player = _status.event.player;
						var att = get.attitude(player, target);
						if (target.hasSkill("nogain")) {
							att /= 10;
						}
						return att / Math.sqrt(Math.min(5, 1 + target.countCards("h")));
					};
					break;
				case 3:
					prompt = "弃置一名角色区域内的一张牌";
					filterTarget = function (card, player, target) {
						return target.hasCard(function (card) {
							return lib.filter.canBeDiscarded(card, player, target);
						}, "hej");
					};
					ai = function (target) {
						var player = _status.event.player;
						return get.effect(target, { name: "guohe" }, player, player);
					};
					break;
				case 4:
					prompt = "对一名其他角色造成1点伤害";
					filterTarget = function (card, player, target) {
						return target != player;
					};
					ai = function (target) {
						var player = _status.event.player;
						return get.damageEffect(target, player, player);
					};
					break;
				default:
					event.result = { bool: false };
					return;
			}
			let result = await player.chooseTarget(get.prompt(event.skill), prompt, filterTarget).set("ai", ai).forResult();
			result.cost_data = num;
			event.result = result;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			switch (event.cost_data) {
				case 2:
					await target.draw(2);
					break;
				case 3:
					await player.discardPlayerCard(target, true, "hej");
					break;
				case 4:
					await target.damage();
					break;
			}
		},
	},
	yingfeng: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("yingfeng"), "令一名角色获得“奉”标记", function (card, player, target) {
					return !target.hasSkill("yingfeng_mark");
				})
				.set("ai", function (target) {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					var eff = 0.1;
					var preTarget = game.findPlayer(function (current) {
						return current != target && current.hasSkill("yingfeng_mark");
					});
					if (preTarget) {
						if (get.attitude(player, preTarget) < 0) {
							eff += 4;
						} else if (preTarget.hasValueTarget({ name: "sha" }, false) && !preTarget.hasValueTarget({ name: "sha" })) {
							eff -= 3;
						}
					}
					if (target.hasValueTarget({ name: "sha" }, false) && !target.hasValueTarget({ name: "sha" })) {
						eff += 3;
					}
					if (player == target) {
						att *= 1.2;
					}
					return 0.01 + att * eff;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("yingfeng", target);
				target.addAdditionalSkill("yingfeng_" + player.playerid, "yingfeng_mark");
				game.countPlayer(function (current) {
					if (current != target && current.hasSkill("yingfeng_mark")) {
						current.removeSkill("yingfeng_mark");
						current.removeAdditionalSkill("yingfeng_" + player.playerid);
					}
				});
			}
		},
		subSkill: {
			mark: {
				charlotte: true,
				mark: true,
				marktext: "奉",
				mod: {
					targetInRange: () => true,
				},
				intro: { content: "使用牌无距离限制" },
			},
		},
	},
	//虞翻
	rezongxuan: {
		inherit: "zongxuan",
		group: "rezongxuan_place",
	},
	rezongxuan_place: {
		audio: "rezongxuan",
		enable: "phaseUse",
		usable: 1,
		sourceSkill: "rezongxuan",
		content() {
			"step 0";
			player.draw();
			"step 1";
			player.chooseCard("he", true, "将一张牌置于牌堆顶");
			"step 2";
			if (result && result.cards) {
				event.card = result.cards[0];
				player.lose(result.cards, ui.cardPile, "insert");
				game.log(player, "将", get.position(event.card) == "h" ? "一张牌" : event.card, "置于牌堆顶");
				game.broadcastAll(function (player) {
					var cardx = ui.create.card();
					cardx.classList.add("infohidden");
					cardx.classList.add("infoflip");
					player.$throw(cardx, 1000, "nobroadcast");
				}, player);
			} else {
				event.finish();
			}
		},
		ai: {
			order: 1,
			result: { player: 1 },
		},
	},
	//孙寒华
	chongxu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			player.chooseToPlayBeatmap(lib.skill.chongxu.beatmaps.randomGet());
			"step 1";
			var score = Math.floor(Math.min(5, result.accuracy / 17));
			event.score = score;
			game.log(player, "的演奏评级为", "#y" + result.rank[0], "，获得积分点数", "#y" + score, "分");
			if (score < 3) {
				if (score >= 2) {
					player.draw();
				}
				event.finish();
				return;
			}
			var list = [];
			if (player.countMark("miaojian") < 2 && player.hasSkill("miaojian")) {
				list.push("修改【妙剑】");
			}
			if (player.countMark("shhlianhua") < 2 && player.hasSkill("shhlianhua")) {
				list.push("修改【莲华】");
			}
			if (list.length) {
				list.push("全部摸牌");
				player
					.chooseControl(list)
					.set("prompt", "冲虚：修改技能" + (score == 5 ? "并摸一张牌" : "") + "；或摸" + Math.floor(score / 2) + "张牌");
			} else {
				event._result = { control: "全部摸牌" };
			}
			"step 2";
			var score = event.score;
			if (result.control != "全部摸牌") {
				score -= 3;
				var skill = result.control == "修改【妙剑】" ? "miaojian" : "shhlianhua";
				player.addMark(skill, 1, false);
				game.log(player, "修改了技能", "#g【" + get.translation(skill) + "】");
			}
			if (score > 1) {
				player.draw(Math.floor(score / 2));
			}
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
		beatmaps: [
			{
				//歌曲名称
				name: "鳥の詩",
				//歌曲文件名（默认在audio/effect文件夹下 若要重定向到扩展 请写为'ext:扩展名称/文件名'的格式）
				filename: "tori_no_uta",
				//每个音符的开始时间点（毫秒，相对未偏移的开始播放时间）
				timeleap: [1047, 3012, 4978, 5469, 5961, 6452, 6698, 7435, 8909, 10875, 12840],
				//开始播放时间的偏移量（毫秒）
				current: -110,
				//判定栏高度（相对整个对话框高度比例）
				judgebar_height: 0.16,
				//Good/Great/Prefect的位置判定范围（百分比，相对于整个对话框。以滑条的底部作为判定基准）
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				//滑条每相对于整个对话框下落1%所需的时间（毫秒）
				speed: 25,
			},
			{
				name: "竹取飛翔　～ Lunatic Princess",
				filename: "taketori_hishou",
				timeleap: [
					1021, 1490, 1959, 2896, 3834, 4537, 4771, 5709, 6646, 7585, 8039, 8494, 9403, 10291, 11180, 11832, 12049, 12920, 13345, 13771,
					14196,
				],
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(rgba(250, 170, 190, 1), rgba(240, 160, 180, 1))",
				judgebar_color: "linear-gradient(rgba(240, 120, 243, 1), rgba(245, 106, 230, 1))",
			},
			{
				name: "ignotus",
				filename: "ignotus",
				//Number of tracks
				//轨道数量
				number_of_tracks: 4,
				//Customize the track to generate for every note (0 is the first track)
				//自定义每个音符生成的轨道（0是第一个轨道）
				mapping: [0, 2, 3, 1, 1, 0, 3, 0, 0, 3, 0, 0, 2, 1, 2],
				//Convert from beats (0 is the first beat) to timeleap
				//将节拍（0是第一拍）转换为开始时间点
				timeleap: game.generateBeatmapTimeleap(170, [0, 4, 8, 12, 14, 16, 16.5, 23.5, 24, 31, 32, 40, 45, 46, 47]),
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(rgba(240, 250, 240, 1), rgba(230, 240, 230, 1))",
				judgebar_color: "linear-gradient(rgba(161, 59, 150, 1), rgba(58, 43, 74, 1))",
			},
			{
				name: "Super Mario 3D World Theme",
				filename: "sm3dw_overworld",
				//Random (Randomly choose tracks to generate notes each play)
				//随机（每次演奏时音符会随机选择轨道生成）
				mapping: "random",
				timeleap: [
					0, 1071, 1518, 2054, 4018, 4286, 5357, 6429, 7500, 8571, 9643, 10714, 11786, 12321, 12589, 12857, 13929, 15000, 16071, 17143,
					18214, 18482, 18750, 19018, 19286, 20357,
				],
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(rgba(120, 130, 240, 1), rgba(100, 100, 230, 1))",
				judgebar_color: "linear-gradient(rgba(230, 40, 30, 1), rgba(220, 30, 10, 1))",
			},
			{
				name: "只因你太美",
				filename: "chicken_you_are_so_beautiful",
				number_of_tracks: 7,
				mapping: [3, 6, 4, 5, 6, 2, 3, 2, 1, 2, 0, 4, 3, 6, 5, 4, 3, 6, 3, 2, 3, 1, 0, 1, 2, 3, 4, 5, 6],
				timeleap: game.generateBeatmapTimeleap(
					107,
					[
						2, 3.5, 4.5, 5.5, 6.5, 8.5, 10, 11.5, 12.5, 13.5, 14.5, 15.5, 18, 19.5, 20.5, 21.5, 22.5, 24.5, 26, 27.5, 28.5, 29.5, 30.5,
						31, 31.5, 32, 32.5, 33, 33.5,
					]
				),
				//Hitsound file name (By default in the audio/effect folder. To redirect to the extension, please write in the format of 'ext:extension_name')
				//打击音文件名（默认在audio/effect文件夹下 若要重定向到扩展 请写为'ext:扩展名称'的格式）
				hitsound: "chickun.wav",
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(#99f, #66c)",
				judgebar_color: "linear-gradient(#ccf, #99c)",
			},
			{
				name: "Croatian Rhapsody",
				filename: "croatian_rhapsody",
				mapping: [4, 1, 2, 1, 0, 0, 4, 5, 1, 3, 2, 1, 0, 0],
				timeleap: game.generateBeatmapTimeleap(96, [4, 6, 8, 9, 10, 11, 12, 13.5, 14, 15.5, 16, 17, 18, 19]),
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(#fff, #ccc)",
				judgebar_color: "linear-gradient(#fff, #ccc)",
			},
			{
				name: "罗刹海市",
				filename: "rakshasa_sea_city",
				number_of_tracks: 7,
				mapping: "random",
				timeleap: game.generateBeatmapTimeleap(150, [0, 2, 4, 6, 7, 9, 11, 13, 14, 16, 18, 20, 21, 23, 25, 27]),
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(#333, #000)",
				judgebar_color: "linear-gradient(#c66, #933)",
			},
			{
				name: "Pigstep (Stereo Mix)",
				filename: "pigstep",
				number_of_tracks: 16,
				timeleap: game.generateBeatmapTimeleap(
					170,
					[
						3, 4, 6, 6.5, 7.5, 11, 12, 14, 14.5, 15.5, 19, 20, 22, 22.5, 23.5, 27, 28, 30, 30.5, 31.5, 35, 36, 38, 38.5, 39.5, 43, 44, 46,
						46.5, 47.5, 51, 52, 54, 54.5, 55.5, 59, 60, 62, 62.5,
					]
				),
				current: -110,
				judgebar_height: 0.16,
				range1: [84, 110],
				range2: [90, 104],
				range3: [94, 100],
				speed: 25,
				node_color: "linear-gradient(#066, #033)",
				judgebar_color: "linear-gradient(#633, #300)",
			},
		],
		derivation: "chongxu_faq",
	},
	miaojian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var level = player.countMark("miaojian");
			if (event.filterCard({ name: "sha", nature: "stab" }, player, event)) {
				if (level == 2) {
					return true;
				}
				if (
					level == 1 &&
					player.hasCard(function (card) {
						return get.type2(card) == "basic";
					}, "hs")
				) {
					return true;
				}
				if (
					level == 0 &&
					player.hasCard(function (card) {
						return get.name(card) == "sha";
					}, "hs")
				) {
					return true;
				}
			}
			if (event.filterCard({ name: "wuzhong" }, player, event)) {
				if (level == 2) {
					return true;
				}
				if (
					level == 1 &&
					player.hasCard(function (card) {
						return get.type2(card) != "basic";
					}, "hes")
				) {
					return true;
				}
				if (
					level == 0 &&
					player.hasCard(function (card) {
						return get.type2(card) == "trick";
					}, "hs")
				) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog() {
				return ui.create.dialog("妙剑", [
					[
						["基本", "", "sha", "stab"],
						["锦囊", "", "wuzhong"],
					],
					"vcard",
				]);
			},
			filter(button, player) {
				var event = _status.event.getParent(),
					level = player.countMark("miaojian");
				if (button.link[2] == "sha") {
					if (!event.filterCard({ name: "sha", nature: "stab" }, player, event)) {
						return false;
					}
					if (level == 2) {
						return true;
					}
					if (level == 1) {
						return player.hasCard(function (card) {
							return get.type2(card) == "basic";
						}, "hs");
					}
					return (
						level == 0 &&
						player.hasCard(function (card) {
							return get.name(card) == "sha";
						}, "hs")
					);
				}
				if (button.link[2] == "wuzhong") {
					if (!event.filterCard({ name: "wuzhong" }, player, event)) {
						return false;
					}
					if (level == 2) {
						return true;
					}
					if (level == 1) {
						return player.hasCard(function (card) {
							return get.type2(card) != "basic";
						}, "hes");
					}
					return (
						level == 0 &&
						player.hasCard(function (card) {
							return get.type2(card) == "trick";
						}, "hs")
					);
				}
			},
			check(button) {
				var card = { name: button.link[2], nature: button.link[3] },
					player = _status.event.player;
				return get.value(card, player) * get.sgn(player.getUseValue(card));
			},
			backup(links, player) {
				var index = links[0][2] == "sha" ? 0 : 1,
					level = player.countMark("miaojian");
				var next = {
					audio: "miaojian",
					filterCard: [
						[
							function (card) {
								return get.name(card) == "sha";
							},
							function (card) {
								return get.type(card) == "basic";
							},
							() => false,
						],
						[
							function (card) {
								return get.type2(card) == "trick";
							},
							function (card) {
								return get.type(card) != "basic";
							},
							() => false,
						],
					][index][level],
					position: "hes",
					check(card) {
						if (card) {
							return 6.5 - get.value(card);
						}
						return 1;
					},
					viewAs: [
						{
							name: "sha",
							nature: "stab",
						},
						{
							name: "wuzhong",
						},
					][index],
				};
				if (level == 2) {
					next.selectCard = -1;
					next.viewAs.isCard = true;
				}
				return next;
			},
			prompt(links, player) {
				var index = links[0][2] == "sha" ? 0 : 1,
					level = player.countMark("miaojian");
				return [
					["将一张【杀】当做刺【杀】使用", "将一张基本牌当做刺【杀】使用", "请选择刺【杀】的目标"],
					["将一张锦囊牌当做【无中生有】使用", "将一张非基本牌当做【无中生有】使用", "请选择【无中生有】的目标"],
				][index][level];
			},
		},
		onremove: true,
		derivation: ["miaojian1", "miaojian2"],
		subSkill: { backup: { audio: "miaojian" } },
		ai: {
			order: 7,
			result: { player: 1 },
		},
	},
	shhlianhua: {
		audio: 2,
		derivation: ["shhlianhua1", "shhlianhua2"],
		trigger: { target: "useCardToTargeted" },
		forced: true,
		locked: false,
		filter: event => event.card.name == "sha",
		content() {
			"step 0";
			player.draw();
			var level = player.countMark("shhlianhua");
			if (!level) {
				event.finish();
			} else if (level == 2) {
				event.goto(2);
			} else {
				player
					.judge(function (result) {
						return get.suit(result) == "spade" ? 1 : -1;
					})
					.set("judge2", result => result.bool);
			}
			"step 1";
			if (result.bool) {
				trigger.excluded.add(player);
			}
			event.finish();
			"step 2";
			var eff = get.effect(player, trigger.card, trigger.player, trigger.player);
			trigger.player
				.chooseToDiscard("he", "弃置一张牌，或令" + get.translation(trigger.card) + "对" + get.translation(player) + "无效")
				.set("ai", function (card) {
					if (_status.event.eff > 0) {
						return 10 - get.value(card);
					}
					return 0;
				})
				.set("eff", eff);
			"step 3";
			if (result.bool == false) {
				trigger.getParent().excluded.add(player);
			}
		},
		ai: {
			effect: {
				target_use(card, player, target, current) {
					if (card.name == "sha" && current < 0) {
						return 0.7;
					}
				},
			},
		},
	},
	//阎圃
	huantu: {
		audio: 2,
		trigger: { global: "phaseDrawBefore" },
		round: 1,
		filter(event, player) {
			return player.countCards("he") > 0 && player.inRange(event.player);
		},
		checkx(event, player) {
			const target = event.player;
			return (
				get.attitude(player, target) > 0 &&
				(target.hasSkill("pingkou") ||
					target.skipList.includes("phaseUse") ||
					(target.isDamaged() && target.hp <= 2) ||
					target.needsToDiscard())
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt(event.skill, trigger.player), "交给其一张牌并令其暂时跳过摸牌阶段", "he")
				.set("ai", function (card) {
					if (!_status.event.checkx) {
						return 0;
					}
					return 1 + Math.random();
				})
				.set("checkx", lib.skill.huantu.checkx(trigger, player))
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0],
				{ cards } = event;
			await player.give(cards, target);
			trigger.cancel();
			player.addTempSkill(event.name + "_effect");
		},
		subSkill: {
			effect: {
				audio: "huantu",
				trigger: { global: "phaseJieshuBegin" },
				forced: true,
				charlotte: true,
				logTarget: "player",
				filter(event, player) {
					return event.player.isIn();
				},
				async content(event, trigger, player) {
					const target = trigger.player,
						str = get.translation(target);
					const result = await player
						.chooseControl()
						.set("choiceList", ["令" + str + "回复1点体力并摸两张牌", "摸三张牌，然后交给" + str + "两张手牌"])
						.set("choice", target.isDamaged() ? 0 : 1)
						.forResult();
					if (result?.index == 0) {
						await target.recover();
						await target.draw(2);
					} else if (result?.index == 1) {
						await player.draw(3);
						if (player.countCards("h") && target.isIn()) {
							await player.chooseToGive(target, 2, true, "h");
						}
					}
				},
			},
		},
	},
	bihuo: {
		audio: 2,
		trigger: { global: "dyingAfter" },
		logTarget: "player",
		limited: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			player.awakenSkill(event.name);
			await target.draw(3);
			target.addTempSkill("bihuo_effect", "roundStart");
			target.addMark("bihuo_effect", game.countPlayer(), false);
		},
		subSkill: {
			effect: {
				onremove: true,
				charlotte: true,
				mod: {
					globalTo(from, to, distance) {
						return distance + to.countMark("bihuo_effect");
					},
				},
				intro: { content: "其他角色至你的距离+#" },
			},
		},
	},
	//马元义
	jibing: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			return (
				player.getExpansions("jibing").length > 0 &&
				(event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event) ||
					event.filterCard(get.autoViewAs({ name: "shan" }, "unsure"), player, event))
			);
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("集兵", "hidden");
				if (
					event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event) &&
					event.filterCard(get.autoViewAs({ name: "shan" }, "unsure"), player, event)
				) {
					dialog._chooseButton = 2;
					var list = ["sha", "shan"];
					dialog.add([
						list.map(i => {
							return [i, get.translation(i)];
						}),
						"tdnodes",
					]);
				} else {
					dialog._cardName = event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event) ? "sha" : "shan";
				}
				dialog.add(player.getExpansions("jibing"));
				return dialog;
			},
			filter(button) {
				var evt = _status.event,
					player = _status.event.player;
				if (evt.dialog) {
					if (!evt.dialog._chooseButton) {
						var evt2 = _status.event.getParent();
						return evt2.filterCard(get.autoViewAs({ name: evt.dialog._cardName }, [button.link]), player, evt2);
					}
					if (ui.selected.buttons.length) {
						var str = ui.selected.buttons[0].link;
						if (typeof str != "string" || typeof button.link == "string") {
							return false;
						}
						var evt2 = _status.event.getParent();
						return evt2.filterCard(get.autoViewAs({ name: str }, [button.link]), player, evt2);
					}
					return typeof button.link == "string";
				}
				return false;
			},
			select() {
				return _status.event.dialog ? _status.event.dialog._chooseButton || 1 : 1;
			},
			backup(links, player) {
				var card, name;
				if (links.length == 2) {
					name = links[0];
					card = links[1];
				} else {
					card = links[0];
					var event = _status.event;
					name = event.filterCard(get.autoViewAs({ name: "sha" }, [card]), player, event) ? "sha" : "shan";
				}
				return {
					audio: "jibing",
					filterCard(card) {
						return card == lib.skill.jibing_backup.card;
					},
					selectCard: -1,
					position: "x",
					viewAs: { name: name },
					card: card,
				};
			},
			prompt(links, player) {
				return "请选择【杀】的目标";
			},
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				return player.getExpansions("jibing").length > 0;
			},
			order(item, player) {
				if (player.hasSkill("binghuo")) {
					return 6;
				}
				return 1;
			},
			result: {
				player: 1,
			},
		},
		group: "jibing_place",
		subSkill: {
			place: {
				audio: "jibing",
				trigger: { player: "phaseDrawBegin1" },
				prompt2: "摸牌阶段开始时，若你的“兵”数小于势力数，则你可以改为将牌堆顶的两张牌置于你的武将牌上，称为“兵”。",
				filter(event, player) {
					return !event.numFixed && player.getExpansions("jibing").length < game.countGroup();
				},
				content() {
					trigger.changeToZero();
					var cards = get.cards(2);
					player.addToExpansion(cards, "gain2").gaintag.add("jibing");
				},
			},
			backup: { audio: "jibing" },
		},
		intro: { content: "expansion", markcount: "expansion" },
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
	},
	wangjing: {
		audio: 2,
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			if (event.skill != "jibing_backup") {
				return false;
			}
			var target = lib.skill.wangjing.logTarget(event, player);
			return target && target.isMaxHp();
		},
		logTarget(event, player) {
			if (event.name == "respond") {
				return event.source;
			}
			if (event.card.name == "sha") {
				return event.targets[0];
			}
			return event.respondTo[0];
		},
		forced: true,
		content() {
			player.draw();
		},
		ai: {
			combo: "jibing",
			mingzhi: false,
			effect: {
				target(card, player, target, current) {
					if (
						(get.tag(card, "respondShan") || get.tag(card, "respondSha")) &&
						target.getExpansions("jibing").length > 0 &&
						player.isMaxHp()
					) {
						if (get.attitude(target, player) <= 0) {
							return [0, 0, 1, 0.3];
						}
					}
				},
			},
		},
	},
	moucuan: {
		audio: 2,
		derivation: "binghuo",
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "metal",
		filter(event, player) {
			return player.getExpansions("jibing").length >= game.countGroup();
		},
		content() {
			player.awakenSkill(event.name);
			player.loseMaxHp();
			player.addSkills("binghuo");
		},
		ai: { combo: "jibing" },
	},
	binghuo: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return (
				player.hasHistory("useCard", function (evt) {
					return evt.skill == "jibing_backup";
				}) ||
				player.hasHistory("respond", function (evt) {
					return evt.skill == "jibing_backup";
				})
			);
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("binghuo")).set("ai", function (target) {
				var player = _status.event.player;
				return get.damageEffect(target, player, player);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("binghuo", target);
				target.judge(function (card) {
					if (get.color(card) == "black") {
						return -2;
					}
					return 0.1;
				}).judge2 = function (result) {
					return result.bool === false ? true : false;
				};
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool == false) {
				target.damage("thunder");
			}
		},
		ai: { combo: "jibing", expose: 0.2 },
	},
	//傅佥
	jueyong: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		forced: true,
		filter(event, player) {
			return (
				event.card.name != "jiu" &&
				event.card.name != "tao" &&
				event.targets.length == 1 &&
				event.card.isCard &&
				event.cards.length == 1 &&
				event.getParent(2).name != "jueyong_timeout" &&
				get.position(event.cards[0], true) == "o" &&
				event.card.name == event.cards[0].name &&
				(!player.storage.jueyong || player.storage.jueyong[0].length < player.getHp())
			);
		},
		content() {
			trigger.targets.remove(player);
			trigger.getParent().triggeredTargets2.remove(player);
			trigger.untrigger();
			var card = trigger.cards[0];
			player.addToExpansion(card, "gain2").gaintag.add("jueyong");
			if (!player.storage.jueyong) {
				player.storage.jueyong = [[], []];
			}
			player.storage.jueyong[0].push(card);
			player.storage.jueyong[1].push(trigger.player);
			game.delayx();
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
			delete player.storage[skill];
		},
		intro: {
			markcount(storage) {
				if (!storage) {
					return 0;
				}
				return storage[0].length;
			},
			mark(dialog, storage, player) {
				if (!storage) {
					return;
				}
				dialog.addAuto(storage[0]);
				dialog.addText(get.translation(storage[1]));
			},
			onunmark(storage, player) {
				player.storage.jueyong = [[], []];
			},
		},
		ai: {
			reverseEquip: true,
			effect: {
				target_use(card, player, target, current) {
					if (get.type(card) == "equip" && !get.tag(card, "gifts") && target.storage.jueyong && target.storage.jueyong[1].length) {
						var result1 = get.equipResult(player, target, card),
							subtype = get.subtype(card);
						for (var i of target.storage.jueyong[0]) {
							if (get.subtype(i, false) == subtype && get.equipResult(target, target, i) >= result1) {
								return "zerotarget";
							}
						}
					}
				},
			},
		},
		group: "jueyong_timeout",
		subSkill: {
			timeout: {
				audio: "jueyong",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				filter(event, player) {
					return player.storage.jueyong && player.storage.jueyong[0].length > 0; //=Math.max(1,player.getDamagedHp());
				},
				content() {
					var list = player.storage.jueyong,
						card = list[0].shift(),
						source = list[1].shift();
					if (player.getExpansions("jueyong").includes(card)) {
						if (source && source.isIn() && source.canUse(card, player, false)) {
							source.useCard(card, player, false);
						} else {
							player.loseToDiscardpile(card);
						}
					}
					if (list[0].length) {
						event.redo();
					}
				},
			},
		},
	},
	poxiang: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter: (event, player) => player.countCards("he") > 0,
		filterCard: true,
		filterTarget: lib.filter.notMe,
		position: "he",
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			var player = _status.event.player;
			if (
				!player.storage.jueyong ||
				!player.storage.jueyong[0].length ||
				(player.hp <= 1 &&
					!player.storage.jueyong[0].some(function (card) {
						return get.tag(card, "damage") > 0;
					})) ||
				!player.storage.jueyong[0].some(function (card) {
					return get.effect(player, card, player.storage.jueyong[1][player.storage.jueyong[0].indexOf(card)], player) < 0;
				})
			) {
				return -1;
			}
			return 20 - get.value(card);
		},
		content() {
			"step 0";
			player.give(cards, target);
			player.draw(3).gaintag = ["poxiang"];
			player.addTempSkill("poxiang_mark");
			"step 1";
			var cards = player.getExpansions("jueyong");
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
			player.unmarkSkill("jueyong");
			player.loseHp();
			"step 2";
			//player.skip('phaseDiscard');
			game.delayx();
		},
		ai: {
			order: 12,
			result: {
				player: 4,
				target: 1,
			},
		},
		subSkill: {
			mark: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("poxiang");
				},
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("poxiang")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("poxiang")) {
							return false;
						}
					},
				},
			},
		},
	},
	//曹真
	disordersidi: { audio: 2 },
	discretesidi: {
		audio: "disordersidi",
		trigger: { player: "useCardAfter" },
		direct: true,
		filter(event, player) {
			return (
				get.type(event.card, null, false) != "delay" &&
				game.hasPlayer(function (current) {
					return player != current && (!player.storage.discretesidi || !player.storage.discretesidi.includes(current));
				})
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(
					get.prompt("discretesidi"),
					"选择两名角色a,b建立二元序偶<a,b>，或仅选择一名角色，建立二元序偶<a,a>",
					[1, 2],
					function (card, player, target) {
						if (ui.selected.targets.length) {
							return true;
						}
						return target != player && (!player.storage.discretesidi || !player.storage.discretesidi.includes(target));
					}
				)
				.set("complexTarget", true)
				.set("complexSelect", true)
				.set("targetprompt", ["第一元素", "第二元素"])
				.set("ai", function (target) {
					var player = _status.event.player;
					if (!ui.selected.targets.length) {
						if (target.getEnemies().length == 1) {
							return 2 + Math.random();
						}
						return 1 + Math.random();
					}
					var targetx = ui.selected.targets[0];
					if (targetx.getEnemies().includes(target) && targetx.inRange(target)) {
						return Math.random() - 0.5;
					}
					return 0;
				}).animate = false;
			"step 1";
			if (result.bool && result.targets.length) {
				var targets = result.targets;
				player.logSkill("discretesidi", targets[0]);
				if (targets.length == 1) {
					targets.push(targets[0]);
				}
				if (!player.storage.discretesidi) {
					player.storage.discretesidi = [];
				}
				if (!player.storage.discretesidi2) {
					player.storage.discretesidi2 = [];
				}
				player.storage.discretesidi.push(targets[0]);
				player.storage.discretesidi2.push(targets[1]);
				player.markSkill("discretesidi");
				game.delayx();
			}
		},
		intro: {
			content(storage, player) {
				if ((player == game.me || player.isUnderControl()) && !game.observe) {
					var str = "R={ ";
					for (var i = 0; i < storage.length; i++) {
						str += "&lt;" + get.translation(storage[i]) + ", " + get.translation(player.storage.discretesidi2[i]) + "&gt;";
						if (i < storage.length - 1) {
							str += ", ";
						}
					}
					str += " }";
					return str;
				}
				return "已指定" + get.translation(storage) + "为目标";
			},
		},
		onremove(player) {
			delete player.storage.discretesidi;
			delete player.storage.discretesidi2;
		},
		group: ["discretesidi_clear", "discretesidi_exec"],
		subSkill: {
			clear: {
				trigger: { global: ["useCardToPlayered", "die"] },
				forced: true,
				popup: false,
				locked: false,
				filter(event, player) {
					if (!player.storage.discretesidi || !player.storage.discretesidi.includes(event.player)) {
						return false;
					}
					if (event.name == "die") {
						return true;
					}
					if (get.type(event.card, null, false) != "delay") {
						var index = player.storage.discretesidi.indexOf(event.player);
						return index != -1 && (player.storage.discretesidi2[index] != event.target || event.targets.length != 1);
					}
					return false;
				},
				content() {
					player.storage.discretesidi2.splice(player.storage.discretesidi.indexOf(trigger.player), 1);
					player.unmarkAuto("discretesidi", [trigger.player]);
				},
			},
			exec: {
				audio: "disordersidi",
				trigger: { global: "useCardToPlayered" },
				forced: true,
				locked: false,
				filter(event, player) {
					if (get.type(event.card, null, false) == "delay" || !player.storage.discretesidi || event.targets.length != 1) {
						return false;
					}
					var index = player.storage.discretesidi.indexOf(event.player);
					return index != -1 && player.storage.discretesidi2[index] == event.target;
				},
				logTarget: "player",
				content() {
					"step 0";
					player.storage.discretesidi2.splice(player.storage.discretesidi.indexOf(trigger.player), 1);
					player.unmarkAuto("discretesidi", [trigger.player]);
					if (trigger.target == player) {
						player.draw();
						event.finish();
						return;
					}
					var target = trigger.player;
					event.target = target;
					player
						.chooseControl("cancel2")
						.set("choiceList", [
							"取消" + get.translation(trigger.card) + "的所有目标并对" + get.translation(target) + "造成1点伤害",
							"摸两张牌",
						])
						.set("ai", function () {
							var player = _status.event.player,
								evt = _status.event.getTrigger();
							if (get.damageEffect(evt.player, player, player) > 0 && get.effect(evt.target, evt.card, evt.player, player) < 0) {
								return 0;
							}
							return 1;
						});
					"step 1";
					if (result.index == 0) {
						trigger.cancel();
						trigger.targets.length = 0;
						trigger.getParent().triggeredTargets1.length = 0;
						if (!_status.dying.length) {
							target.damage();
						}
					} else if (result.index == 1) {
						player.draw(2);
					}
				},
			},
		},
	},
	//数学家
	mbsidi: {
		audio: "disordersidi",
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return (
				get.type(event.card, false) != "delay" &&
				game.hasPlayer(function (current) {
					return player != current && (!player.storage.mbsidi || !player.storage.mbsidi.includes(current));
				})
			);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("mbsidi"), "选择一名角色，为其选择一名“司敌”目标角色", function (card, player, target) {
					return target != player && (!player.storage.mbsidi || !player.storage.mbsidi.includes(target));
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					if (target.getEnemies().length == 1) {
						return 2 + Math.random();
					}
					return 1 + Math.random();
				}).animate = false;
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player
					.chooseTarget("为" + get.translation(target) + "选择一名“司敌”目标角色")
					.set("ai", function (target) {
						var player = _status.event.player;
						var targetx = _status.event.target;
						if (targetx.getEnemies().includes(target) && targetx.inRange(target)) {
							return Math.random() + 1.5;
						}
						return targetx == target ? 1 : -1;
					})
					.set("target", target).animate = false;
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				result.targets.unshift();
				player.logSkill("mbsidi", target);
				if (!player.storage.mbsidi) {
					player.storage.mbsidi = [];
				}
				if (!player.storage.mbsidi2) {
					player.storage.mbsidi2 = [];
				}
				player.storage.mbsidi.push(target);
				player.storage.mbsidi2.push(result.targets[0]);
				player.markSkill("mbsidi");
				game.delayx();
			}
		},
		intro: {
			content(storage, player) {
				if ((player == game.me || player.isUnderControl()) && !game.observe) {
					var storage2 = player.storage.mbsidi2,
						str = "";
					for (var i = 0; i < storage.length; i++) {
						str += get.translation(storage[i]) + "=>" + get.translation(storage2[i]);
						if (i < storage.length - 1) {
							str += "<br>";
						}
					}
					return str;
				}
				return "已指定" + get.translation(storage) + "为目标";
			},
		},
		onremove(player) {
			delete player.storage.mbsidi;
			delete player.storage.mbsidi2;
		},
		group: ["mbsidi_clear", "mbsidi_exec"],
		subSkill: {
			clear: {
				trigger: { global: ["useCardToPlayered", "die"] },
				filter(event, player) {
					if (!player.storage.mbsidi || !player.storage.mbsidi.includes(event.player)) {
						return false;
					}
					if (event.name == "die") {
						return true;
					}
					if (get.type(event.card, false) != "delay") {
						var index = player.storage.mbsidi.indexOf(event.player);
						return index != -1 && (player.storage.mbsidi2[index] != event.target || event.targets.length != 1);
					}
					return false;
				},
				forced: true,
				locked: false,
				popup: false,
				content() {
					player.storage.mbsidi2.splice(player.storage.mbsidi.indexOf(trigger.player), 1);
					player.unmarkAuto("mbsidi", [trigger.player]);
				},
			},
			exec: {
				audio: "disordersidi",
				trigger: { global: "useCardToPlayered" },
				filter(event, player) {
					if (get.type(event.card, false) == "delay" || !player.storage.mbsidi || event.targets.length != 1) {
						return false;
					}
					var index = player.storage.mbsidi.indexOf(event.player);
					return index != -1 && player.storage.mbsidi2[index] == event.target;
				},
				logTarget: "player",
				forced: true,
				locked: false,
				content() {
					"step 0";
					player.storage.mbsidi2.splice(player.storage.mbsidi.indexOf(trigger.player), 1);
					player.unmarkAuto("mbsidi", [trigger.player]);
					if (trigger.target == player) {
						player.draw();
						event.finish();
						return;
					}
					var target = trigger.player;
					event.target = target;
					player
						.chooseControl("cancel2")
						.set("choiceList", [
							"取消" +
								get.translation(trigger.card) +
								"的所有目标" +
								(_status.dying.length ? "" : "，然后对" + get.translation(target) + "造成1点伤害"),
							"摸两张牌",
						])
						.set("ai", function () {
							var player = _status.event.player,
								evt = _status.event.getTrigger();
							if (get.damageEffect(evt.player, player, player) > 0 && get.effect(evt.target, evt.card, evt.player, player) < 0) {
								return 0;
							}
							return 1;
						});
					"step 1";
					if (result.index == 0) {
						trigger.cancel();
						trigger.targets.length = 0;
						trigger.getParent().triggeredTargets1.length = 0;
						if (!_status.dying.length) {
							target.damage();
						}
					} else if (result.index == 1) {
						player.draw(2);
					}
				},
			},
		},
	},
	//孙鲁班
	xinzenhui: {
		audio: 2,
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			if (event.targets.length != 1) {
				return false;
			}
			var card = event.card;
			if (card.name != "sha" && (get.type(card, null, false) != "trick" || get.color(card, false) != "black")) {
				return false;
			}
			if (!player.isPhaseUsing() || player.hasSkill("xinzenhui2")) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return (
					current != player &&
					current != event.target &&
					lib.filter.targetEnabled2(card, player, current) &&
					lib.filter.targetInRange(card, player, current)
				);
			});
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("xinzenhui"), function (card, player, target) {
					if (player == target) {
						return false;
					}
					var evt = _status.event.getTrigger();
					return (
						!evt.targets.includes(target) &&
						lib.filter.targetEnabled2(evt.card, player, target) &&
						lib.filter.targetInRange(evt.card, player, target)
					);
				})
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return Math.max(
						target.countGainableCards(player, "he") ? get.effect(target, { name: "shunshou_copy2" }, player, player) : 0,
						get.effect(target, trigger.card, player, player)
					);
				});
			"step 1";
			if (result.bool) {
				player.addTempSkill("xinzenhui2", "phaseUseAfter");
				var target = result.targets[0],
					str = get.translation(target);
				event.target = target;
				player.logSkill("xinzenhui", target);
				if (!target.countGainableCards(player, "he")) {
					event._result = { index: 0 };
				} else {
					player
						.chooseControl()
						.set("choiceList", [
							"令" + str + "也成为" + get.translation(trigger.card) + "的目标",
							"获得" + str + "的一张牌，然后其成为" + get.translation(trigger.card) + "的使用者",
						])
						.set("ai", function () {
							var trigger = _status.event.getTrigger();
							var player = _status.event.player,
								target = _status.event.getParent().target;
							return (target.countGainableCards(player, "he") ? get.effect(target, { name: "shunshou_copy2" }, player, player) : 0) >
								get.effect(target, trigger.card, player, player)
								? 1
								: 0;
						});
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.index == 1) {
				trigger.untrigger();
				trigger.getParent().player = event.target;
				game.log(event.target, "成为了", trigger.card, "的使用者");
				player.gainPlayerCard(target, true, "he");
			} else {
				game.log(event.target, "成为了", trigger.card, "的额外目标");
				trigger.getParent().targets.push(event.target);
			}
		},
	},
	xinzenhui2: {},
	xinjiaojin: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return player.countCards("he", { type: "equip" }) && event.source && event.source.hasSex("male");
		},
		direct: true,
		content() {
			"step 0";
			var next = player.chooseToDiscard("he", "骄矜：是否弃置一张装备牌防止伤害？", function (card, player) {
				return get.type(card) == "equip";
			});
			next.set("ai", function (card) {
				var player = _status.event.player;
				if (player.hp == 1 || _status.event.getTrigger().num > 1) {
					return 9 - get.value(card);
				}
				if (player.hp == 2) {
					return 8 - get.value(card);
				}
				return 7 - get.value(card);
			});
			next.logSkill = "xinjiaojin";
			"step 1";
			if (result.bool) {
				game.delay(0.5);
				trigger.cancel();
			}
		},
	},
	//谯周
	zhiming: {
		audio: 2,
		trigger: { player: ["phaseZhunbeiBegin", "phaseDiscardEnd"] },
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
			if (player.countCards("he") > 0) {
				const next = player.chooseCard("he", "知命：是否将一张牌置于牌堆顶？");
				if (trigger.name == "phaseZhunbei") {
					next.set("ai", function (card) {
						var player = _status.event.player,
							js = player.getCards("j");
						if (js.length) {
							var judge = get.judge(js[0]);
							if (judge && judge(card) >= 0) {
								return 20 - get.value(card);
							}
						}
						return 0;
					});
				} else {
					next.set("ai", function (card) {
						var player = _status.event.player,
							js = player.next.getCards("j");
						if (js.length) {
							var judge = get.judge(js[0]);
							if (judge && (judge(card) + 0.01) * get.attitude(player, player.next) > 0) {
								return 20 - get.value(card);
							}
						}
						return 0;
					});
				}
				const result = await next.forResult();
				if (result.bool && result.cards?.length) {
					player.$throw(get.position(result.cards[0]) == "e" ? result.cards[0] : 1, 1000);
					game.log(player, "将", get.position(result.cards[0]) == "e" ? result.cards[0] : "#y一张手牌", "置于了牌堆顶");
					await player.lose(result.cards, ui.cardPile, "insert");
					await game.delayx();
				}
			}
		},
		ai: { guanxing: true },
	},
	xingbu: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		prompt2: "亮出牌堆顶的三张牌，并可以根据其中红色牌的数量，令一名其他角色获得一种效果",
		async content(event, trigger, player) {
			const cards = get.cards(3, true);
			await player.showCards(cards, get.translation(player) + "发动了【星卜】", true).set("clearArena", false);
			let num = cards.filter(i => get.color(i, false) == "red").length;
			const result = await player
				.chooseTarget("是否选择一名其他角色获得星卜效果（" + get.cnNumber(num) + "张）？", lib.filter.notMe)
				.set("ai", function (target) {
					var player = _status.event.player,
						num = _status.event.getParent().num;
					var att = get.attitude(player, target);
					if (num < 3) {
						att *= -1;
					}
					if (num == 2 && target.hasJudge("lebu")) {
						att *= -1.4;
					}
					return att;
				})
				.forResult();
			if (num == 0) {
				num = 1;
			}
			game.broadcastAll(ui.clear);
			if (result.bool && result.targets?.length) {
				const skill = "xingbu_effect" + num,
					target = result.targets[0];
				player.line(target, "green");
				game.log(player, "选择了", target);
				target.addTempSkill(skill, { player: "phaseEnd" });
				target.addMark(skill, 1, false);
				await game.delayx();
			}
		},
		subSkill: {
			effect1: {
				charlotte: true,
				onremove: true,
				intro: { content: "准备阶段开始时弃置#张手牌" },
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				filter(event, player) {
					return player.countCards("h") > 0;
				},
				async content(event, trigger, player) {
					await player.chooseToDiscard("h", true, player.countMark("xingbu_effect1"));
				},
			},
			effect2: {
				charlotte: true,
				onremove: true,
				intro: { content: "使用【杀】的次数上限-#，跳过弃牌阶段" },
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num - player.countMark("xingbu_effect2");
						}
					},
				},
				trigger: { player: "phaseDiscardBegin" },
				forced: true,
				async content(event, trigger, player) {
					trigger.cancel();
				},
			},
			effect3: {
				charlotte: true,
				onremove: true,
				intro: { content: "摸牌阶段多摸2*#张牌，使用【杀】的次数上限+#。" },
				trigger: { player: ["phaseDrawBegin2"] },
				forced: true,
				filter(event, player) {
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					if (trigger.name == "phaseDraw") {
						trigger.num += player.countMark("xingbu_effect3") * 2;
					}
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("xingbu_effect3");
						}
					},
				},
			},
		},
	},
	//顾雍
	xinshenxing: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return player.hp;
		},
		filter(event, player) {
			return player.countCards("he") > 1;
		},
		selectCard: 2,
		position: "he",
		check(card) {
			if (!ui.selected.cards.length || get.color(card) != get.color(ui.selected.cards[0])) {
				return 6.5 - get.value(card);
			}
			return 6.5 - get.value(card) - get.value(ui.selected.cards[0]);
		},
		filterCard: true,
		content() {
			player.draw(get.color(cards) == "none" ? 2 : 1);
		},
		ai: {
			order: 1,
			result: { player: 1 },
		},
	},
	xinbingyi: {
		audio: "bingyi",
		audioname: ["xin_guyong"],
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterx(event, player) {
			const cards = player.getCards("h");
			if (cards.length == 1) {
				return true;
			}
			const colors = cards.map(card => get.color(card, player)).unique();
			const types = cards.map(card => get.type2(card, player)).unique();
			return colors?.length == 1 || types?.length == 1;
		},
		prompt2(event, player) {
			if (lib.skill.xinbingyi.filterx(event, player)) {
				return `展示所有手牌，并选择至多${get.cnNumber(player.countCards("h"))}名角色各摸一张牌`;
			}
			return "展示所有手牌，然后无事发生！！";
		},
		async content(event, trigger, player) {
			await player.showHandcards(get.translation(player) + "发动了〖秉壹〗");
			if (lib.skill.xinbingyi.filterx(trigger, player)) {
				const result = await player
					.chooseTarget(`秉壹：选择至多${get.cnNumber(player.countCards("h"))}名角色各摸一张牌`, [1, player.countCards("h")])
					.set("ai", function (target) {
						return get.attitude(get.player(), target);
					})
					.forResult();
				if (result.bool) {
					const targets = result.targets.sortBySeat();
					player.line(targets, "green");
					await game.asyncDraw(targets);
				}
			}
		},
		ai: {
			expose: 0.1,
		},
	},
	//钟会
	requanji: {
		audio: 2,
		trigger: { player: ["damageEnd", "phaseUseEnd"] },
		frequent: true,
		locked: false,
		filter(event, player) {
			if (event.name == "phaseUse") {
				return player.countCards("h") > player.hp;
			}
			return event.num > 0;
		},
		getIndex(event, player) {
			return event.num || 1;
		},
		async content(event, trigger, player) {
			await player.draw();
			if (!player.countCards("h")) {
				return;
			}
			const result = await player.chooseCard("将一张手牌置于武将牌上作为“权”", true).forResult();
			if (result?.bool && result?.cards?.length) {
				const next = player.addToExpansion(result.cards, player, "give");
				next.gaintag.add("quanji");
				await next;
			}
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.getExpansions("quanji").length;
			},
			aiOrder(player, card, num) {
				if (num <= 0 || typeof card !== "object" || !player.isPhaseUsing()) {
					return num;
				}
				if (player.countCards("h") > player.hp + 1) {
					return num;
				}
				if (!player.hasSkill("zili") || player.hasSkill("paiyi")) {
					return num;
				}
				if (player.getExpansions("quanji").length < 3) {
					if (get.type(card) == "equip" && !["equip2", "equip3"].includes(get.subtype(card))) {
						return 0;
					}
					let eff = 6 + player.hp;
					if (!get.tag(card, "gain") && !get.tag(card, "draw")) {
						eff += 3;
					}
					if (player.getUseValue(card) < eff) {
						return 0;
					}
				}
			},
		},
		onremove(player, skill) {
			const cards = player.getExpansions("quanji");
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			notemp: true,
			threaten: 0.8,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						if (target.hp >= 4) {
							return [0.5, get.tag(card, "damage") * 2];
						}
						if (!target.hasSkill("paiyi") && target.hp > 1) {
							return [0.5, get.tag(card, "damage") * 1.5];
						}
						if (target.hp == 3) {
							return [0.5, get.tag(card, "damage") * 1.5];
						}
						if (target.hp == 2) {
							return [1, get.tag(card, "damage") * 0.5];
						}
					}
				},
			},
		},
	},
	//蔡夫人
	xinqieting: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return (
				player != event.player &&
				event.player.getHistory("sourceDamage", function (evt) {
					return evt.player != event.player;
				}).length == 0
			);
		},
		content() {
			"step 0";
			var list = ["摸一张牌"],
				target = trigger.player,
				str = get.translation(target);
			event.target = target;
			event.addIndex = 0;
			if (target.countCards("h") > 0) {
				list.push("观看" + str + "的两张手牌并获得其中一张");
			} else {
				event.addIndex++;
			}
			if (
				target.countCards("e", function (card) {
					return player.canEquip(card);
				}) > 0
			) {
				list.push("将" + str + "装备区内的一张牌移动至自己的装备区");
			}
			player
				.chooseControl("cancel2")
				.set("choiceList", list)
				.set("prompt", get.prompt("xinqieting", target))
				.set("ai", function () {
					var evt = _status.event.getParent();
					if (get.attitude(evt.player, evt.target) > 0) {
						return 0;
					}
					var val = evt.target.hasSkillTag("noe") ? 6 : 0;
					if (
						evt.target.countCards("e", function (card) {
							return (
								evt.player.canEquip(card) &&
								get.value(card, evt.target) > val &&
								get.effect(evt.player, card, evt.player, evt.player) > 0
							);
						}) > 0
					) {
						return 2 - evt.addIndex;
					}
					if (evt.target.countCards("h") > 0) {
						return 1;
					}
					return 0;
				});
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("xinqieting", target);
				if (result.index == 0) {
					player.draw();
					event.finish();
				} else if (result.index + event.addIndex == 1) {
					player.choosePlayerCard(target, "h", 2, true);
					player.addExpose(0.2);
					event.goto(3);
				} else {
					player.addExpose(0.1);
					player
						.choosePlayerCard(target, "e", true)
						.set("filterButton", function (button) {
							return _status.event.player.canEquip(button.link);
						})
						.set("ai", function (button) {
							var player = _status.event.player;
							return get.effect(player, button.link, player, player);
						});
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var card = result.cards[0];
				target.$give(card, player, false);
				game.delay(0.5);
				player.equip(card);
			}
			event.finish();
			"step 3";
			if (result.bool) {
				player.chooseButton(["选择获得一张牌", result.cards], true);
			} else {
				event.finish();
			}
			"step 4";
			if (result.bool) {
				var card = result.links[0];
				if (lib.filter.canBeGained(card, player, target)) {
					player.gain(card, target, "giveAuto", "bySelf");
				} else {
					game.log("但", card, "不能被", player, "获得！");
				}
			}
		},
	},
	mobilezhongyong: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (event.card.name != "sha" || !event.isPhaseUsing(player)) {
				return false;
			}
			const list = get.info("mobilezhongyong").getResponds(event);
			if (list.length) {
				return list.some(evt => evt.cards.someInD("od"));
			}
			return event.cards.someInD();
		},
		getResponds(event) {
			const list = [];
			for (const target of event.targets) {
				list.addArray(
					target.getHistory("useCard", evt => {
						return evt.card.name == "shan" && evt.respondTo?.[1] == event.card;
					})
				);
			}
			return list;
		},
		async cost(event, trigger, player) {
			const list = get.info(event.skill).getResponds(trigger);
			if (list.length) {
				const shans = list.map(evt => evt.cards.filterInD("od")).flat();
				const shas = trigger.cards.filterInD();
				const others = game.filterPlayer(current => current != player && !trigger.targets.includes(current));
				const result = await player
					.chooseButtonTarget({
						createDialog: [
							get.prompt(event.skill),
							[
								[
									[
										"gain",
										(() => {
											let str = `获得${get.translation(shans)}`;
											if (shas.length && others.length) {
												str += `，然后可以令另一名其他角色获得${get.translation(shas)}`;
											}
											return str;
										})(),
									],
									[
										"give",
										`令另一名其他角色获得${get.translation(shans)}，然后你于本回合内使用【杀】的次数上限+1且下一张【杀】的伤害值基数+1`,
									],
								],
								"tdnodes",
							],
						],
						filterButton(button) {
							if (button.link == "give") {
								return get.event().others.length;
							}
							return true;
						},
						filterTarget(card, player, target) {
							return get.event().others.includes(target);
						},
						selectTarget() {
							if (ui.selected.buttons.length) {
								const link = ui.selected.buttons[0].link;
								if (link == "give") {
									return 1;
								}
								return 0;
							}
							return 0;
						},
						filterOk() {
							if (ui.selected.buttons.length) {
								const link = ui.selected.buttons[0].link;
								if (link == "give") {
									return ui.selected.targets.length == 1;
								}
								return true;
							}
							return false;
						},
						ai1(button) {
							const { player, shans, others } = get.event();
							const { link } = button;
							if (
								link == "give" &&
								others.some(current => get.attitude(player, current) > 0) &&
								player.countCards("hs", card => {
									return get.name(card) == "sha" && player.hasValueTarget(card);
								}) > player.getCardUsable({ name: "sha" })
							) {
								return 10;
							}
							if (link == "gain" && get.value(shans, player) > 0) {
								return 9;
							}
							return 0;
						},
						ai2(target) {
							if (ui.selected.buttons[0].link != "give") {
								return 1;
							}
							const player = get.player(),
								att = get.attitude(player, target);
							if (att <= 0) {
								return att;
							}
							if (target.hasSkillTag("nogain")) {
								return att / 10;
							}
							if (!target.hasSha()) {
								return 2 * att;
							}
							return att;
						},
						shans,
						others,
					})
					.forResult();
				event.result = {
					bool: result?.bool,
					targets: result?.targets,
					cost_data: result?.links,
				};
			} else {
				const cards = trigger.cards.filterInD();
				event.result = await player
					.chooseBool(get.prompt(event.skill), `获得${get.translation(cards)}`)
					.set("choice", get.value(cards, player) > 0)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const list = get.info(event.name).getResponds(trigger);
			if (list.length) {
				const {
					targets,
					cost_data: [choice],
				} = event;
				const shans = list.map(evt => evt.cards.filterInD("od")).flat();
				if (choice == "gain") {
					player.addTempSkill(event.name + "_buff");
					const next = player.gain(shans, "gain2");
					next.gaintag.add(event.name + "_buff");
					await next;
					const shas = trigger.cards.filterInD();
					const others = game.filterPlayer(current => current != player && !trigger.targets.includes(current));
					if (shas.length && others.length) {
						const result = await player
							.chooseTarget(`是否令一名其他角色获得${get.translation(shas)}？`, (card, player, target) => {
								return get.event().others.includes(target);
							})
							.set("ai", target => {
								const player = get.player(),
									att = get.attitude(player, target);
								if (att <= 0) {
									return att;
								}
								if (target.hasSkillTag("nogain")) {
									return att / 10;
								}
								if (!target.hasSha()) {
									return 2 * att;
								}
								return att;
							})
							.set("others", others)
							.forResult();
						if (result?.targets?.length) {
							const [target] = result.targets;
							player.line(target, "green");
							await target.gain(shas, "gain2");
						}
					}
				} else if (choice == "give") {
					const [target] = targets;
					await target.gain(shans, "gain2");
					const effect = event.name + "_effect";
					player.storage[effect] ??= [0, 0];
					player.storage[effect][0] += 1;
					player.storage[effect][1] += 1;
					player.addTempSkill(effect);
					player.markSkill(effect);
				}
			} else {
				const cards = trigger.cards.filterInD();
				if (cards.length) {
					player.addTempSkill(event.name + "_buff");
					const next = player.gain(cards, "gain2");
					next.gaintag.add(event.name + "_buff");
					await next;
				}
			}
		},
		subSkill: {
			buff: {
				mod: {
					cardEnabled2(card, player) {
						if (get.itemtype(card) == "card" && card.hasGaintag("mobilezhongyong_buff")) {
							return false;
						}
					},
				},
				charlotte: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
			},
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha" && typeof player.storage.mobilezhongyong_effect?.[0] == "number") {
							return num + player.storage.mobilezhongyong_effect?.[0];
						}
					},
				},
				trigger: { player: "useCard1" },
				filter(event, player) {
					return event.card.name == "sha";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const skillName = event.name;
					if (typeof player.storage[skillName]?.[1] == "number") {
						trigger.baseDamage += player.storage[skillName][1];
					}
					player.storage[skillName] = [player.storage[skillName]?.[0] ?? 0, 0];
					player.markSkill(skillName);
				},
				intro: {
					markcount: () => 0,
					content(storage, player) {
						let str = "";
						if (typeof storage[0] == "number" && storage[0] > 0) {
							str += `<li>本回合使用【杀】的次数上限+${storage[0]}`;
						}
						if (typeof storage[1] == "number" && storage[1] > 0) {
							str += `<br><li>下一张【杀】的伤害基数+${storage[1]}`;
						}
						return str;
					},
				},
			},
		},
	},
	rejieyue: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt2("rejieyue"),
				filterCard: true,
				position: "he",
				filterTarget: lib.filter.notMe,
				ai1(card) {
					var player = _status.event.player;
					if (get.name(card) == "du") {
						return 20;
					}
					if (get.position(card) == "e" && get.value(card) <= 0) {
						return 14;
					}
					if (
						get.position(card) == "h" &&
						game.hasPlayer(function (current) {
							return (
								current != player &&
								get.attitude(player, current) > 0 &&
								current.getUseValue(card) > player.getUseValue(card) &&
								current.getUseValue(card) > player.getUseValue(card)
							);
						})
					) {
						return 12;
					}
					if (
						game.hasPlayer(function (current) {
							return current != player && get.attitude(player, current) > 0;
						})
					) {
						if (card.name == "wuxie") {
							return 11;
						}
						if (card.name == "shan" && player.countCards("h", "shan") > 1) {
							return 9;
						}
					}
					return 6 / Math.max(1, get.value(card));
				},
				ai2(target) {
					var player = _status.event.player;
					var card = ui.selected.cards[0];
					var att = get.attitude(player, target);
					if (card.name == "du") {
						return -6 * att;
					}
					if (att > 0) {
						if (get.position(card) == "h" && target.getUseValue(card) > player.getUseValue(card)) {
							return 4 * att;
						}
						if (get.value(card, target) > get.value(card, player)) {
							return 2 * att;
						}
						return 1.2 * att;
					}
					return (-att * Math.min(4, target.countCards("he"))) / 4;
				},
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("rejieyue", target);
				player.give(result.cards, target);
			} else {
				event.finish();
			}
			"step 2";
			var num = 0;
			if (target.countCards("h")) {
				num++;
			}
			if (target.countCards("e")) {
				num++;
			}
			if (num > 0) {
				var next = target.chooseCard(
					"he",
					num,
					"选择保留每个区域的各一张牌，然后弃置其余的牌。或点取消，令" + get.translation(player) + "摸三张牌",
					function (card) {
						for (var i = 0; i < ui.selected.cards.length; i++) {
							if (get.position(ui.selected.cards[i]) == get.position(card)) {
								return false;
							}
						}
						return true;
					}
				);
				next.set("complexCard", true);
				next.set("goon", get.attitude(target, player) >= 0);
				next.set("maxNum", num);
				next.set("ai", function (card) {
					if (_status.event.goon) {
						return -1;
					}
					var num = _status.event.maxNum;
					if (ui.selected.cards.length >= num - 1) {
						var cards = player.getCards("he", function (cardx) {
							return cardx != card && !ui.selected.cards.includes(cardx);
						});
						var val = 0;
						for (var cardx of cards) {
							val += get.value(cardx);
						}
						if (val >= 14) {
							return 0;
						}
					}
					return get.value(card);
				});
			} else {
				event._result = { bool: false };
			}
			"step 3";
			if (!result.bool) {
				player.draw(3);
			} else {
				var cards = target.getCards("he");
				cards.removeArray(result.cards);
				if (cards.length) {
					target.discard(cards);
				}
			}
		},
		ai: {
			threaten: 1.3,
			expose: 0.2,
		},
	},
	tiansuan: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return !player.storage.tiansuan2;
		},
		content() {
			"step 0";
			player
				.chooseControl("上上签", "上签", "中签", "下签", "下下签", "cancel2")
				.set("prompt", "天算：是否增加其中一个命运签的权重？")
				.set("ai", function () {
					return Math.random() < 0.5 ? 0 : 4;
				});
			"step 1";
			let list = [0, 1, 1, 2, 2, 2, 3, 3, 4];
			if (result.control != "cancel2") {
				list.push(result.index);
			}
			let num = list.randomGet();
			event.num = num;
			let str = get.translation(player) + "抽取的命运签为：" + lib.skill["tiansuan2_" + num].name;
			game.log(player, "抽取出了", "#g" + lib.skill["tiansuan2_" + num].name);
			event.dialog = ui.create.dialog(str);
			event.videoId = lib.status.videoId++;
			game.broadcast("createDialog", event.videoId, str);
			game.pause();
			setTimeout(function () {
				game.resume();
			}, 1500);
			"step 2";
			event.dialog.close();
			game.broadcast("closeDialog", event.videoId);
			player.chooseTarget(true, "令一名角色获得“" + lib.skill["tiansuan2_" + num].name + "”").set("ai", lib.skill["tiansuan2_" + num].aiCheck);
			"step 3";
			if (result.bool) {
				let target = result.targets[0];
				player.line(target, "green");
				game.log(player, "令", target, "获得了命运签");
				player.storage.tiansuan2 = target;
				player.storage.tiansuan3 = "tiansuan2_" + num;
				player.addTempSkill("tiansuan2", { player: "phaseBegin" });
				target.addSkill("tiansuan2_" + num);
				let pos = "e";
				if (target != player) {
					pos += "h";
				}
				if (num == 0) {
					pos += "j";
				}
				if (num < 2 && target.countGainableCards(player, pos) > 0) {
					let next = player.gainPlayerCard(target, pos, true);
					if (num == 0) {
						next.visible = true;
					}
				} else {
					game.delayx();
				}
			}
		},
		derivation: "tiansuan_faq",
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
	},
	tiansuan2: {
		charlotte: true,
		onremove(player, skill) {
			if (player.storage.tiansuan2) {
				player.storage.tiansuan2.removeSkill(player.storage.tiansuan3);
			}
			delete player.storage.tiansuan2;
			delete player.storage.tiansuan3;
		},
	},
	tiansuan2_0: {
		name: "上上签",
		trigger: { player: "damageBegin4" },
		forced: true,
		charlotte: true,
		sourceSkill: "tiansuan",
		content() {
			trigger.cancel();
		},
		mark: true,
		intro: {
			content: "当你受到伤害时，防止此伤害。",
		},
		aiCheck(target) {
			if (target.hasSkill("tiansuan2_0")) {
				return 0;
			}
			var player = _status.event.player;
			var att = get.attitude(player, target);
			if (
				target.countCards("e", function (card) {
					return get.value(card, target) <= 0;
				})
			) {
				att *= 2;
			}
			return att / Math.sqrt(Math.max(1, target.hp));
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && !player.hasSkillTag("jueqing", false, target)) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	tiansuan2_1: {
		name: "上签",
		trigger: { player: "damageBegin4" },
		forced: true,
		charlotte: true,
		sourceSkill: "tiansuan",
		filter(event, player) {
			return event.num > 1;
		},
		content() {
			trigger.num = 1;
		},
		group: "tiansuan2_damage",
		mark: true,
		intro: {
			content: "当你受到伤害时，你令伤害值改为1；当你受到1点伤害后，你摸一张牌。",
		},
		aiCheck(target) {
			if (target.hasSkill("tiansuan2_1")) {
				return 0;
			}
			var player = _status.event.player;
			var att = get.attitude(player, target);
			if (
				target.countCards("e", function (card) {
					return get.value(card, target) <= 0;
				})
			) {
				att *= 2;
			}
			if (target.hp == 1) {
				return att / 2;
			}
			return att / Math.sqrt(Math.max(1, target.hp));
		},
		ai: {
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.player) {
					if (arg.player.hasSkillTag("jueqing", false, player)) {
						return false;
					}
				}
			},
			effect: {
				target(card, player, target, current) {
					if (target && target.hp > 1 && get.tag(card, "damage") && !player.hasSkillTag("jueqing", false, target)) {
						return 0.8;
					}
				},
			},
		},
	},
	tiansuan2_damage: {
		trigger: { player: "damageEnd" },
		charlotte: true,
		sourceSkill: "tiansuan",
		content() {
			player.draw(trigger.num);
		},
	},
	tiansuan2_2: {
		name: "中签",
		trigger: { player: "damageBegin4" },
		forced: true,
		charlotte: true,
		sourceSkill: "tiansuan",
		filter(event, player) {
			return event.num > 1;
		},
		content() {
			trigger.num = 1;
		},
		mark: true,
		intro: {
			content: "当你受到伤害时，你令伤害属性改为火属性并将伤害值改为1。",
		},
		aiCheck(target) {
			if (target.hasSkill("tiansuan2_2")) {
				return 0;
			}
			let player = _status.event.player,
				original = get.damageEffect(target, player, player);
			target.addSkill("tiansuan2_ai");
			let fire = get.damageEffect(target, player, player, "fire");
			target.removeSkill("tiansuan2_ai");
			return (fire - original) * get.attitude(player, target);
		},
		group: ["tiansuan2_fire", "tiansuan2_ai"],
	},
	tiansuan2_ai: {
		ai: {
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.player) {
					if (arg.player.hasSkillTag("jueqing", false, player)) {
						return false;
					}
				}
			},
		},
	},
	tiansuan2_fire: {
		trigger: { player: "damageBefore" },
		forced: true,
		charlotte: true,
		sourceSkill: "tiansuan",
		filter(event, player) {
			return !event.hasNature("fire");
		},
		content() {
			game.setNature(trigger, "fire");
		},
	},
	tiansuan2_3: {
		name: "下签",
		trigger: { player: "damageBegin3" },
		forced: true,
		charlotte: true,
		sourceSkill: "tiansuan",
		content() {
			trigger.num++;
		},
		mark: true,
		intro: {
			content: "当你受到伤害时，你令此伤害+1。",
		},
		aiCheck(target) {
			if (target.hasSkill("tiansuan2_3")) {
				return 0;
			}
			var player = _status.event.player;
			var att = get.attitude(player, target);
			return -att / Math.sqrt(Math.max(1, target.hp));
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && !player.hasSkillTag("jueqing", false, target) && current < 0) {
						return 1.3;
					}
				},
			},
		},
	},
	tiansuan2_4: {
		name: "下下签",
		trigger: { player: "damageBegin3" },
		forced: true,
		charlotte: true,
		sourceSkill: "tiansuan",
		content() {
			trigger.num++;
		},
		mod: {
			cardEnabled(card, player) {
				if (card.name == "tao" || card.name == "jiu") {
					return false;
				}
			},
			cardSavable(card, player) {
				if (card.name == "tao" || card.name == "jiu") {
					return false;
				}
			},
		},
		mark: true,
		intro: {
			content: "当你受到伤害时，你令此伤害+1。你不能使用【酒】或【桃】。",
		},
		aiCheck(target) {
			if (target.hasSkill("tiansuan2_4")) {
				return 0;
			}
			var player = _status.event.player;
			var att = get.attitude(player, target);
			return -att / Math.sqrt(Math.max(1, target.hp));
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && !player.hasSkillTag("jueqing", false, target) && current < 0) {
						return 1.3;
					}
				},
			},
		},
	},
	relieren: {
		audio: 2,
		audioname: ["boss_lvbu3"],
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && player.canCompare(event.target);
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		//priority:5,
		content() {
			"step 0";
			player.chooseToCompare(trigger.target).clear = false;
			"step 1";
			if (result.bool) {
				if (trigger.target.countGainableCards(player, "he")) {
					player.gainPlayerCard(trigger.target, true, "he");
				}
				ui.clear();
			} else {
				var card1 = result.player;
				var card2 = result.target;
				if (get.position(card1) == "d") {
					trigger.target.gain(card1, "gain2");
				}
				if (get.position(card2) == "d") {
					player.gain(card2, "gain2");
				}
			}
		},
	},
	retiaoxin: {
		audio: "tiaoxin",
		audioname: ["sp_jiangwei", "xiahouba", "re_jiangwei"],
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("he");
		},
		content() {
			"step 0";
			target
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					"挑衅：对" + get.translation(player) + "使用一张杀，或令其弃置你的一张牌"
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
			"step 1";
			if (result.bool == false && target.countCards("he") > 0) {
				player.discardPlayerCard(target, "he", true);
			} else {
				event.finish();
			}
		},
		ai: {
			order: 4,
			expose: 0.2,
			result: {
				target: -1,
				player(player, target) {
					if (!target.canUse("sha", player)) {
						return 0;
					}
					if (target.countCards("h") == 0) {
						return 0;
					}
					if (target.countCards("h") == 1) {
						return -0.1;
					}
					if (player.hp <= 2) {
						return -2;
					}
					if (player.countCards("h", "shan") == 0) {
						return -1;
					}
					return -0.5;
				},
			},
			threaten: 1.1,
		},
	},
	//南华老仙
	yufeng: {
		inherit: "yufeng_old",
		content() {
			"step 0";
			if (_status.connectMode) {
				event.time = lib.configOL.choose_timeout;
			}
			event.videoId = lib.status.videoId++;
			var maxScore = Math.max(2, 1 + player.countMark("yufeng"));
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				game.pause();
				game.countChoose();
				setTimeout(function () {
					_status.imchoosing = false;
					var max = Math.max(2, 1 + player.countMark("yufeng"));
					var score = Math.random() < 0.5 ? max : get.rand(1, max);
					event._result = {
						bool: true,
						score: score,
						win: score >= max,
					};
					if (event.dialog) {
						event.dialog.close();
					}
					if (event.control) {
						event.control.close();
					}
					game.resume();
				}, 5000);
			};
			var createDialog = function (player, id) {
				if (_status.connectMode) {
					lib.configOL.choose_timeout = "30";
				}
				if (player == game.me) {
					return;
				}
				var str = get.translation(player) + "正在表演《御风飞行》...<br>";
				ui.create.dialog(str).videoId = id;
			};
			var chooseButton = function (maxScore) {
				lib.skill.yufeng.$playFlappyBird(maxScore);
			};
			//event.switchToAuto=switchToAuto;
			game.broadcastAll(createDialog, player, event.videoId);
			if (event.isMine()) {
				chooseButton(maxScore);
			} else if (event.isOnline()) {
				event.player.send(chooseButton, maxScore);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			game.broadcastAll(
				function (id, time) {
					if (_status.connectMode) {
						lib.configOL.choose_timeout = time;
					}
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
					}
				},
				event.videoId,
				event.time
			);
			var result = event.result || result;
			player.popup(get.cnNumber(result.score) + "分", result.win ? "wood" : "fire");
			game.log(player, "御风飞行", result.win ? "#g成功" : "#y失败");
			game.log(player, "获得了", "#g" + result.score + "分");
			var max = player.countMark("yufeng");
			if (!result.win) {
				if (result.score) {
					player.draw(result.score);
				}
				if (max) {
					player.removeMark("yufeng", max, false);
				}
				event.finish();
			} else {
				if (max < 2) {
					player.addMark("yufeng", 1, false);
				}
				event.score = result.score;
				player
					.chooseTarget("请选择【御风】的目标", [1, result.score], function (card, player, target) {
						return target != player && !target.hasSkill("yufeng2");
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						var att = -get.attitude(player, target),
							attx = att * 2;
						if (att <= 0 || target.hasSkill("xinfu_pdgyingshi")) {
							return 0;
						}
						if (target.hasJudge("lebu")) {
							attx -= att;
						}
						if (target.hasJudge("bingliang")) {
							attx -= att;
						}
						return attx / Math.max(2.25, Math.sqrt(target.countCards("h") + 1));
					});
			}
			"step 2";
			if (result.bool) {
				result.targets.sortBySeat();
				player.line(result.targets, "green");
				game.log(result.targets, "获得了", "#y“御风”", "效果");
				for (var i of result.targets) {
					i.addSkill("yufeng2");
				}
				if (event.score > result.targets.length) {
					player.draw(event.score - result.targets.length);
				}
			} else {
				player.draw(event.score);
			}
		},
		$playFlappyBird(maxScore, title) {
			//Forked from: https://github.com/aaarafat/JS-Flappy-Bird

			const event = _status.event;
			const dialog = ui.create.dialog("forcebutton", "hidden");
			dialog.textPrompt = dialog.add('<div class="text center">准备好了吗？</div>');
			dialog.classList.add("fixed");
			dialog.classList.add("scroll1");
			dialog.classList.add("scroll2");
			dialog.classList.add("fullwidth");
			dialog.classList.add("fullheight");
			dialog.classList.add("noupdate");
			const updateText = function (str) {
				dialog.textPrompt.innerHTML = '<div class="text center">' + str + "</div>";
			};

			const canvas = document.createElement("canvas");
			dialog.appendChild(canvas);
			canvas.style.position = "absolute";
			canvas.style.width = "276px";
			canvas.style.height = "414px";
			canvas.style.left = "calc(50% - 141px)";
			canvas.style.top = "calc(50% - 200px)";
			canvas.width = 276;
			canvas.height = 414;
			canvas.style.border = "3px solid";

			const RAD = Math.PI / 180;
			const ctx = canvas.getContext("2d");
			let frames = 0;
			let dx = 0.1;
			let previousDOMHighResTimeStamp = performance.now();
			let deltaTime = 0;
			const state = {
				curr: 0,
				getReady: 0,
				Play: 1,
				gameOver: 2,
				gameSuccess: 3,
			};
			const SFX = {
				start: new Audio(),
				flap: new Audio(),
				score: new Audio(),
				hit: new Audio(),
				die: new Audio(),
				played: false,
			};
			const gnd = {
				sprite: new Image(),
				x: 0,
				y: 0,
				draw() {
					this.y = parseFloat(canvas.height - this.sprite.height);
					ctx.drawImage(this.sprite, this.x, this.y);
				},
				update() {
					if (state.curr == state.gameOver || state.curr == state.gameSuccess) {
						return;
					}
					this.x -= dx * deltaTime;
					const halfWidth = this.sprite.width / 4;
					if (this.x <= -halfWidth) {
						this.x += halfWidth;
					}
				},
			};
			const bg = {
				sprite: new Image(),
				x: 0,
				y: 0,
				draw() {
					let y = parseFloat(canvas.height - this.sprite.height);
					ctx.drawImage(this.sprite, this.x, y);
				},
			};
			const pipe = {
				top: { sprite: new Image() },
				bot: { sprite: new Image() },
				gap: 127,
				moved: true,
				pipes: [],
				numberOfPipes: 1,
				timeElapsed: 0,
				draw() {
					for (let i = 0; i < this.pipes.length; i++) {
						let p = this.pipes[i];
						ctx.drawImage(this.top.sprite, p.x, p.y);
						ctx.drawImage(this.bot.sprite, p.x, p.y + parseFloat(this.top.sprite.height) + this.gap);
					}
				},
				update() {
					if (state.curr != state.Play) {
						return;
					}
					this.timeElapsed += deltaTime;
					if (this.timeElapsed >= 1600) {
						this.timeElapsed -= 1600;
						this.pipes.push({
							x: parseFloat(canvas.width),
							y: -210 * Math.min(Math.random() * 0.8 + 1.2, 1.8),
						});
					}
					this.pipes.forEach(pipe => {
						pipe.x -= dx * deltaTime;
					});
					if (this.pipes.length && this.pipes[0].x < -this.top.sprite.width) {
						this.pipes.shift();
						this.moved = true;
					}
				},
			};
			const bird = {
				animations: [{ sprite: new Image() }, { sprite: new Image() }, { sprite: new Image() }, { sprite: new Image() }],
				rotatation: 0,
				x: 50,
				y: 100,
				speed: 0,
				gravity: 0.0004,
				thrust: 0.18,
				frame: 0,
				timeElapsed: 0,
				totalTimeElapsed: 0,
				draw() {
					let h = this.animations[this.frame].sprite.height;
					let w = this.animations[this.frame].sprite.width;
					ctx.save();
					ctx.translate(this.x, this.y);
					ctx.rotate(this.rotatation * RAD);
					ctx.drawImage(this.animations[this.frame].sprite, -w / 2, -h / 2);
					ctx.restore();
				},
				update() {
					this.totalTimeElapsed += deltaTime;
					let r = parseFloat(this.animations[0].sprite.width) / 2;
					switch (state.curr) {
						case state.getReady:
						case state.gameSuccess:
							this.rotatation = 0;
							this.timeElapsed += deltaTime;
							if (this.timeElapsed >= 200) {
								this.timeElapsed -= 200;
								this.y += Math.sin((this.totalTimeElapsed / 10) * RAD);
								this.frame++;
							}
							break;
						case state.Play:
							this.timeElapsed += deltaTime;
							if (this.timeElapsed >= 100) {
								this.timeElapsed -= 100;
								this.frame++;
							}
							this.y += this.speed * deltaTime;
							this.setRotation();
							this.speed += this.gravity * deltaTime;
							if (UI.score.curr >= maxScore) {
								state.curr = state.gameSuccess;
								this.timeElapsed = 0;
								updateText(`${title || "御风飞行"}表演成功！`);
								setTimeout(switchToAuto, 2000);
							} else if (this.y + r >= gnd.y || this.collisioned()) {
								state.curr = state.gameOver;
								this.timeElapsed = 0;
								updateText(`${title || "御风飞行"}表演失败……`);
								setTimeout(switchToAuto, 2000);
							}
							break;
						case state.gameOver:
							this.frame = 1;
							if (this.y + r < gnd.y) {
								this.y += this.speed * deltaTime;
								this.setRotation();
								this.speed += this.gravity * deltaTime;
							} else {
								this.speed = 0;
								this.y = gnd.y - r;
								this.rotatation = 90;
								if (!SFX.played) {
									Promise.resolve(SFX.die.play()).catch(() => void 0);
									SFX.played = true;
								}
							}
							break;
					}
					const animationsLength = this.animations.length;
					if (this.frame >= animationsLength) {
						this.frame -= animationsLength;
					}
				},
				flap() {
					if (this.y <= 0) {
						return;
					}
					const flap = SFX.flap;
					flap.currentTime = 0;
					if (flap.paused) {
						Promise.resolve(flap.play()).catch(() => void 0);
					}
					this.speed = -this.thrust;
				},
				setRotation() {
					if (this.speed <= 0) {
						this.rotatation = Math.max(-25, (-25 * this.speed) / (-1 * this.thrust));
					} else if (this.speed > 0) {
						this.rotatation = Math.min(90, (90 * this.speed) / (this.thrust * 2));
					}
				},
				collisioned() {
					if (!pipe.pipes.length) {
						return;
					}
					let bird = this.animations[0].sprite;
					let x = pipe.pipes[0].x;
					let y = pipe.pipes[0].y;
					let r = bird.height / 4 + bird.width / 4;
					let roof = y + parseFloat(pipe.top.sprite.height);
					let floor = roof + pipe.gap;
					let w = parseFloat(pipe.top.sprite.width);
					if (this.x + r >= x) {
						if (this.x + r < x + w) {
							if (this.y - r <= roof || this.y + r >= floor) {
								Promise.resolve(SFX.hit.play()).catch(() => void 0);
								return true;
							}
						} else if (pipe.moved) {
							updateText(`当前分数：${++UI.score.curr}`);
							const score = SFX.score;
							score.currentTime = 0;
							if (score.paused) {
								Promise.resolve(score.play()).catch(() => void 0);
							}
							pipe.moved = false;
						}
					}
				},
			};
			const UI = {
				getReady: { sprite: new Image() },
				gameOver: { sprite: new Image() },
				gameClear: { sprite: new Image() },
				tap: [{ sprite: new Image() }, { sprite: new Image() }],
				score: {
					curr: 0,
					best: 0,
				},
				x: 0,
				y: 0,
				tx: 0,
				ty: 0,
				frame: 0,
				timeElapsed: 0,
				draw() {
					switch (state.curr) {
						case state.getReady:
							this.y = parseFloat(canvas.height - this.getReady.sprite.height) / 2;
							this.x = parseFloat(canvas.width - this.getReady.sprite.width) / 2;
							this.tx = parseFloat(canvas.width - this.tap[0].sprite.width) / 2;
							this.ty = this.y + this.getReady.sprite.height - this.tap[0].sprite.height;
							ctx.drawImage(this.getReady.sprite, this.x, this.y);
							ctx.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
							break;
						case state.gameOver:
						case state.gameSuccess:
							this.y = parseFloat(canvas.height - this.gameOver.sprite.height) / 2;
							this.x = parseFloat(canvas.width - this.gameOver.sprite.width) / 2;
							this.tx = parseFloat(canvas.width - this.tap[0].sprite.width) / 2;
							this.ty = this.y + this.gameOver.sprite.height - this.tap[0].sprite.height;
							ctx.drawImage((state.curr == state.gameOver ? this.gameOver : this.gameClear).sprite, this.x, this.y);
					}
				},
				update() {
					if (state.curr == state.Play) {
						return;
					}
					this.timeElapsed += deltaTime;
					if (this.timeElapsed >= 200) {
						this.timeElapsed -= 200;
						this.frame++;
					}
					const tapLength = this.tap.length;
					if (this.frame >= tapLength) {
						this.frame -= tapLength;
					}
				},
			};
			gnd.sprite.src = lib.assetURL + "image/flappybird/ground.png";
			bg.sprite.src = lib.assetURL + "image/flappybird/BG.png";
			pipe.top.sprite.src = lib.assetURL + "image/flappybird/toppipe.png";
			pipe.bot.sprite.src = lib.assetURL + "image/flappybird/botpipe.png";
			UI.gameOver.sprite.src = lib.assetURL + "image/flappybird/gameover.png";
			UI.gameClear.sprite.src = lib.assetURL + "image/flappybird/gameclear.png";
			UI.getReady.sprite.src = lib.assetURL + "image/flappybird/getready.png";
			UI.tap[0].sprite.src = lib.assetURL + "image/flappybird/tap/t0.png";
			UI.tap[1].sprite.src = lib.assetURL + "image/flappybird/tap/t1.png";
			bird.animations[0].sprite.src = lib.assetURL + "image/flappybird/bird/b0.png";
			bird.animations[1].sprite.src = lib.assetURL + "image/flappybird/bird/b1.png";
			bird.animations[2].sprite.src = lib.assetURL + "image/flappybird/bird/b2.png";
			bird.animations[3].sprite.src = lib.assetURL + "image/flappybird/bird/b0.png";

			SFX.start.src = lib.assetURL + "audio/effect/flappybird_start.wav";
			SFX.flap.src = lib.assetURL + "audio/effect/flappybird_flap.wav";
			SFX.score.src = lib.assetURL + "audio/effect/flappybird_score.wav";
			SFX.hit.src = lib.assetURL + "audio/effect/flappybird_hit.wav";
			SFX.die.src = lib.assetURL + "audio/effect/flappybird_die.wav";

			const gameLoop = domHighResTimeStamp => {
				if (frames < 0) {
					return;
				}
				deltaTime = domHighResTimeStamp - previousDOMHighResTimeStamp;
				previousDOMHighResTimeStamp = domHighResTimeStamp;
				update();
				draw();
				frames++;
				window.requestAnimationFrame(gameLoop);
			};

			const update = function () {
				bird.update();
				gnd.update();
				pipe.update();
				UI.update();
			};

			const draw = function () {
				ctx.fillStyle = "#30c0df";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				bg.draw();
				pipe.draw();

				bird.draw();
				gnd.draw();
				UI.draw();
			};

			const click = function () {
				switch (state.curr) {
					case state.getReady:
						state.curr = state.Play;
						bird.timeElapsed = 0;
						Promise.resolve(SFX.start.play()).catch(() => void 0);
						updateText(`当前分数：${UI.score.curr}`);
						break;
					case state.Play:
						bird.flap();
				}
			};
			const switchToAuto = function () {
				event._result = {
					bool: true,
					score: UI.score.curr,
					win: UI.score.curr >= maxScore,
				};
				dialog.close();
				game.resume();
				_status.imchoosing = false;
				frames = -1;
				document.removeEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", click);
			};

			dialog.open();
			game.pause();
			game.countChoose();

			document.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", click);
			window.requestAnimationFrame(gameLoop);
		},
	},
	yufeng_old: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			if (_status.connectMode) {
				event.time = lib.configOL.choose_timeout;
			}
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				game.pause();
				game.countChoose();
				setTimeout(function () {
					_status.imchoosing = false;
					var max = Math.max(2, 1 + game.me.countMark("yufeng"));
					var score = Math.random() < 0.5 ? max : get.rand(1, max);
					event._result = {
						bool: true,
						score: score,
						win: score >= max,
					};
					if (event.dialog) {
						event.dialog.close();
					}
					if (event.control) {
						event.control.close();
					}
					game.resume();
				}, 5000);
			};
			var createDialog = function (player, id) {
				if (_status.connectMode) {
					lib.configOL.choose_timeout = "30";
				}
				if (player == game.me) {
					return;
				}
				var str = get.translation(player) + "正在表演《御风飞行》...<br>";
				ui.create.dialog(str).videoId = id;
			};
			var chooseButton = function () {
				var roundmenu = false;
				if (ui.roundmenu && ui.roundmenu.display != "none") {
					roundmenu = true;
					ui.roundmenu.style.display = "none";
				}
				var event = _status.event;
				event.settleed = false;
				event.score = 0;
				event.dialog = ui.create.dialog("forcebutton", "hidden");
				event.dialog.textPrompt = event.dialog.add('<div class="text center">准备好了吗？准备好了的话就点击屏幕开始吧！</div>');
				var max = Math.max(2, 1 + game.me.countMark("yufeng"));
				event.dialog.textPrompt.style["z-index"] = 10;
				event.switchToAuto = function () {
					event._result = {
						bool: true,
						score: event.score,
						win: event.score >= max,
					};
					event.dialog.close();
					game.resume();
					_status.imchoosing = false;
					if (roundmenu) {
						ui.roundmenu.style.display = "";
					}
				};
				event.dialog.classList.add("fixed");
				event.dialog.classList.add("scroll1");
				event.dialog.classList.add("scroll2");
				event.dialog.classList.add("fullwidth");
				event.dialog.classList.add("fullheight");
				event.dialog.classList.add("noupdate");
				event.dialog.style.overflow = "hidden";
				event.dialog.open();

				var height = event.dialog.offsetHeight;
				var width = event.dialog.offsetWidth;
				var top = 50;
				var speed = 0;
				var start = false;

				var bird = ui.create.div("");
				bird.style["background-image"] = "linear-gradient(rgba(240, 235, 3, 1), rgba(230, 225, 5, 1))";
				bird.style["border-radius"] = "3px";
				var pipes = [];
				bird.style.position = "absolute";
				bird.style.height = "40px";
				bird.style.width = "40px";
				bird.style.left = Math.ceil(width / 3) + "px";
				bird.style.top = (top / 100) * height + "px";
				bird.updatePosition = function () {
					bird.style.transform = "translateY(" + ((top / 100) * height - bird.offsetTop) + "px)";
				};
				event.dialog.appendChild(bird);
				var isDead = function () {
					if (top > 100 || top < 0) {
						return true;
					}
					var btop = top;
					var bleft = 100 / 3;
					var bdown = btop + 5;
					var bright = bleft + 5;
					for (var i of pipes) {
						var left2 = i.left;
						var right2 = left2 + 10;
						var bottom2 = i.height1;
						var top2 = i.height2;

						if (left2 > bright || right2 < bleft) {
							continue;
						}
						if (btop < bottom2) {
							return true;
						}
						if (bdown > top2) {
							return true;
						}
						return false;
					}
					return false;
				};

				var fly = function () {
					if (!start) {
						start = true;
						event.dialog.textPrompt.innerHTML = '<div class="text center">当前分数：' + event.score + "</div>";
						speed = -4;
						event.fly = setInterval(function () {
							top += speed;
							if (top < 0) {
								top = 0;
							}
							bird.updatePosition();
							for (var i of pipes) {
								i.left -= 0.5;
								i.updateLeft();
							}
							speed += 0.5;
							if (speed > 2.5) {
								speed = 2.5;
							}

							if (isDead() == true) {
								event.settle();
							}
						}, 35);
						var addPipe = function () {
							var num = get.rand(5, 55);

							var pipe1 = ui.create.div("");
							pipe1.style["background-image"] = "linear-gradient(rgba(57, 133, 4, 1), rgba(60, 135, 6, 1))";
							pipe1.style["border-radius"] = "3px";
							pipe1.style.position = "absolute";
							pipe1.height1 = num;
							pipe1.height2 = num + 50;
							pipe1.left = 110;
							pipe1.num = 1;
							pipe1.style.height = Math.ceil((height * num) / 100) + "px";
							pipe1.style.width = width / 10 + "px";
							pipe1.style.left = (pipe1.left * width) / 100 + "px";
							pipe1.style.top = "0px";

							var pipe2 = ui.create.div("");
							pipe2.style["background-image"] = "linear-gradient(rgba(57, 133, 4, 1), rgba(60, 135, 6, 1))";
							pipe2.style["border-radius"] = "3px";
							pipe1.pipe2 = pipe2;
							pipe2.style.position = "absolute";
							pipe2.style.height = Math.ceil(((100 - pipe1.height2) * height) / 100) + "px";
							pipe2.style.width = width / 10 + "px";
							pipe2.style.left = (pipe1.left * width) / 100 + "px";
							pipe2.style.top = Math.ceil((pipe1.height2 * height) / 100) + "px";
							pipes.add(pipe1);
							event.dialog.appendChild(pipe1);
							event.dialog.appendChild(pipe2);
							pipe1.updateLeft = function () {
								this.style.transform = "translateX(" + ((this.left / 100) * width - this.offsetLeft) + "px)";
								this.pipe2.style.transform = "translateX(" + ((this.left / 100) * width - this.pipe2.offsetLeft) + "px)";
								if (this.left < 25 && !this.score) {
									this.score = true;
									event.score++;
									event.dialog.textPrompt.innerHTML = '<div class="text center">当前分数：' + event.score + "</div>";
									if (event.score >= max) {
										event.settle();
									}
								}
								if (this.left < -15) {
									this.remove();
									this.pipe2.remove();
									pipes.remove(this);
								}
							};
						};
						event.addPipe = setInterval(addPipe, 2500);
					} else if (speed > 0) {
						speed = -4;
					}
				};
				document.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", fly);

				event.settle = function () {
					clearInterval(event.fly);
					clearInterval(event.addPipe);
					document.removeEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", fly);
					setTimeout(function () {
						event.switchToAuto();
					}, 1000);
				};

				game.pause();
				game.countChoose();
			};
			//event.switchToAuto=switchToAuto;
			game.broadcastAll(createDialog, player, event.videoId);
			if (event.isMine()) {
				chooseButton();
			} else if (event.isOnline()) {
				event.player.send(chooseButton);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			game.broadcastAll(
				function (id, time) {
					if (_status.connectMode) {
						lib.configOL.choose_timeout = time;
					}
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
					}
				},
				event.videoId,
				event.time
			);
			var result = event.result || result;
			player.popup(get.cnNumber(result.score) + "分", result.win ? "wood" : "fire");
			game.log(player, "御风飞行", result.win ? "#g成功" : "#y失败");
			game.log(player, "获得了", "#g" + result.score + "分");
			var max = player.countMark("yufeng");
			if (!result.win) {
				if (result.score) {
					player.draw(result.score);
				}
				if (max) {
					player.removeMark("yufeng", max, false);
				}
				event.finish();
			} else {
				if (max < 2) {
					player.addMark("yufeng", 1, false);
				}
				event.score = result.score;
				player
					.chooseTarget("请选择【御风】的目标", [1, result.score], function (card, player, target) {
						return target != player && !target.hasSkill("yufeng2");
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						var att = -get.attitude(player, target),
							attx = att * 2;
						if (att <= 0 || target.hasSkill("xinfu_pdgyingshi")) {
							return 0;
						}
						if (target.hasJudge("lebu")) {
							attx -= att;
						}
						if (target.hasJudge("bingliang")) {
							attx -= att;
						}
						return attx / Math.max(2.25, Math.sqrt(target.countCards("h") + 1));
					});
			}
			"step 2";
			if (result.bool) {
				result.targets.sortBySeat();
				player.line(result.targets, "green");
				game.log(result.targets, "获得了", "#y“御风”", "效果");
				for (var i of result.targets) {
					i.addSkill("yufeng2");
				}
				if (event.score > result.targets.length) {
					player.draw(event.score - result.targets.length);
				}
			} else {
				player.draw(event.score);
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
			threaten: 3.2,
		},
	},
	yufeng2: {
		trigger: { player: "phaseZhunbeiBegin" },
		audio: false,
		forced: true,
		charlotte: true,
		sourceSkill: "yufeng",
		content() {
			"step 0";
			player.removeSkill("yufeng2");
			player.judge();
			"step 1";
			switch (result.color) {
				case "red":
					player.skip("phaseDraw");
					break;

				case "black":
					player.skip("phaseUse");
					player.skip("phaseDiscard");
					break;

				default:
					break;
			}
		},
		mark: true,
		intro: {
			content: "准备阶段时进行判定，结果为红则跳过摸牌阶段，为黑则跳过出牌阶段和弃牌阶段",
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
	},
	tianshu: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return (
				player.countCards("he") &&
				!game.hasPlayer(function (current) {
					return current.countCards("ej", "taipingyaoshu");
				})
			);
		},
		direct: true,
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt2("tianshu"),
				filterCard: true,
				position: "he",
				ai1(card) {
					return 5 - get.value(card);
				},
				ai2(target) {
					var player = _status.event.player;
					if (get.attitude(player, target) > 0 && !target.hasEmptySlot(2)) {
						return 0;
					}
					return get.attitude(player, target);
				},
			});
			"step 1";
			if (!result.bool) {
				event.finish();
				return;
			}
			var target = result.targets[0];
			event.target = target;
			player.logSkill("tianshu", target);
			player.discard(result.cards);
			if (!lib.inpile.includes("taipingyaoshu")) {
				lib.inpile.push("taipingyaoshu");
				event.card = game.createCard2("taipingyaoshu", "heart", 3);
			} else {
				event.card = get.cardPile(function (card) {
					return card.name == "taipingyaoshu";
				});
			}
			if (!event.card) {
				event.finish();
			} else {
				target.gain(event.card, "gain2");
			}
			"step 2";
			if (target.getCards("h").includes(card) && get.name(card, target) == "taipingyaoshu") {
				target.chooseUseTarget(card, "nopopup", true);
			}
		},
	},
	//界伏寿
	xinzhuikong: {
		audio: 2,
		trigger: { global: "phaseZhunbeiBegin" },
		check(event, player) {
			if (get.attitude(player, event.player) < -2) {
				var cards = player.getCards("h");
				if (cards.length > player.hp) {
					return true;
				}
				for (var i = 0; i < cards.length; i++) {
					var useful = get.useful(cards[i]);
					if (useful < 5) {
						return true;
					}
					if (cards[i].number > 7 && useful < 7) {
						return true;
					}
				}
			}
			return false;
		},
		logTarget: "player",
		filter(event, player) {
			return !player.hasSkill("xinzhuikong2") && player.hp <= event.player.hp && player.canCompare(event.player);
		},
		content() {
			"step 0";
			player.addTempSkill("xinzhuikong2", "roundStart");
			player
				.chooseToCompare(trigger.player)
				.set("small", player.hp > 1 && get.effect(player, { name: "sha" }, trigger.player, player) > 0 && Math.random() < 0.9);
			"step 1";
			if (result.bool) {
				trigger.player.addTempSkill("zishou2");
				event.finish();
			} else if (result.target && get.position(result.target) == "d") {
				player.gain(result.target, "gain2", "log");
			}
			"step 2";
			var card = { name: "sha", isCard: true };
			if (trigger.player.canUse(card, player, false)) {
				trigger.player.useCard(card, player, false);
			}
		},
	},
	xinzhuikong2: { charlotte: true },
	xinqiuyuan: {
		inherit: "qiuyuan",
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const { card } = trigger;
			const result = await target
				.chooseToGive(
					(card, player) => {
						const name = get.name(card, player);
						return name != "sha" && get.type(name) == "basic";
					},
					`交给${get.translation(player)}一张不为【杀】的基本牌，或成为${get.translation(card)}的额外目标`,
					player
				)
				.set("ai", card => {
					const { player, target } = get.event();
					return get.attitude(player, target) >= 0 ? 1 : -1;
				})
				.forResult();
			if (!result?.bool) {
				trigger.getParent().targets.push(target);
				trigger.getParent().triggeredTargets2.push(target);
				game.log(target, "成为了", card, "的额外目标");
			}
		},
	},
	//界潘璋马忠
	xinduodao: {
		audio: 2,
		trigger: { player: "damageEnd" },
		logTarget: "source",
		filter(event, player) {
			var source = event.source;
			if (!source) {
				return false;
			}
			var cards = source.getEquips(1);
			return cards.some(card => lib.filter.canBeGained(card, player, source));
		},
		prompt2(event, player) {
			var source = event.source;
			var cards = source.getEquips(1).filter(card => lib.filter.canBeGained(card, player, source));
			return "获得其装备区中的" + get.translation(cards);
		},
		check(event, player) {
			let es = event.source.getEquips(1).filter(card => {
				return lib.filter.canBeGained(card, player, event.source);
			});
			if (get.attitude(player, event.source) > 0) {
				return (
					es.reduce((acc, card) => {
						return acc + get.value(card, event.source);
					}, 0) < 0 || event.source.hasSkillTag("noe")
				);
			}
			return es.reduce((acc, card) => {
				return acc + get.value(card, player);
			}, 0);
		},
		content() {
			var source = trigger.source;
			var cards = source.getEquips(1).filter(card => lib.filter.canBeGained(card, player, source));
			player.gain(cards, source, "give", "bySelf");
		},
	},
	xinanjian: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		forced: true,
		logTarget: "target",
		filter(event, player) {
			return event.card.name == "sha" && !player.inRangeOf(event.target);
		},
		content() {
			"step 0";
			var card = get.translation(trigger.card);
			var target = get.translation(trigger.target);
			player
				.chooseControl()
				.set("prompt", "暗箭：请选择一项")
				.set("choiceList", ["令" + target + "不能响应" + card, "令" + card + "对" + target + "的伤害值基数+1"])
				.set("ai", function () {
					var target = _status.event.getTrigger().target;
					var player = _status.event.player;
					var num = target.mayHaveShan(player, "use") ? 0 : 1;
					if (get.attitude(player, target) > 0) {
						num = 1 - num;
					}
					return num;
				});
			"step 1";
			if (result.index == 0) {
				game.log(player, "令", trigger.card, "不能被", trigger.target, "响应");
				trigger.directHit.push(trigger.target);
			} else {
				game.log(player, "令", trigger.card, "对", trigger.target, "的伤害+1");
				var id = trigger.target.playerid;
				var map = trigger.customArgs;
				if (!map[id]) {
					map[id] = {};
				}
				if (!map[id].extraDamage) {
					map[id].extraDamage = 0;
				}
				map[id].extraDamage++;
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (
					!arg ||
					!arg.card ||
					!arg.target ||
					arg.card.name != "sha" ||
					arg.target.inRange(player) ||
					get.attitude(player, arg.target) > 0
				) {
					return false;
				}
			},
		},
	},
	//界郭笨
	mobilejingce: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter(event, player) {
			var num = 0;
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.name != "cardsDiscard") {
					return;
				}
				var evtx = evt.getParent();
				if (evtx.name != "orderingDiscard") {
					return false;
				}
				var evt2 = evtx.relatedEvent || evtx.getParent();
				if (evt2 && (evt2.name == "useCard" || evt2.name == "respond")) {
					num += evt.cards.length;
				}
			});
			return num >= player.hp;
		},
		content() {
			player.draw(2);
		},
		group: "mobilejingce_count",
		intro: {
			content(num, player) {
				if (num == 0) {
					return "一张都没有？就这？";
				}
				if (num < player.hp) {
					return "才" + get.cnNumber(num) + "张？就这？";
				}
				return "卧槽，牛逼啊，居然" + get.cnNumber(num) + "张了！";
			},
		},
	},
	mobilejingce_count: {
		trigger: {
			global: ["cardsDiscardEnd", "phaseBefore"],
			player: "phaseAfter",
		},
		silent: true,
		firstDo: true,
		sourceSkill: "mobilejingce",
		filter(evt, player) {
			if (evt.name == "phase") {
				return true;
			}
			if (player != _status.currentPhase) {
				return false;
			}
			var evtx = evt.getParent();
			if (evtx.name != "orderingDiscard") {
				return false;
			}
			var evt2 = evtx.relatedEvent || evtx.getParent();
			return evt2 && (evt2.name == "useCard" || evt2.name == "respond");
		},
		content() {
			if (trigger.name == "phase") {
				player.unmarkSkill("mobilejingce");
			} else {
				var num = 0;
				game.getGlobalHistory("cardMove", function (evt) {
					if (evt.name != "cardsDiscard") {
						return;
					}
					var evtx = evt.getParent();
					if (evtx.name != "orderingDiscard") {
						return false;
					}
					var evt2 = evtx.relatedEvent || evtx.getParent();
					if (evt2 && (evt2.name == "useCard" || evt2.name == "respond")) {
						num += evt.cards.length;
					}
				});
				player.storage.mobilejingce = num;
				player.markSkill("mobilejingce");
			}
		},
	},
	//公孙康
	juliao: {
		mod: {
			globalTo(from, to, distance) {
				return distance + game.countGroup() - 1;
			},
		},
	},
	taomie: {
		audio: 3,
		group: ["taomie1", "taomie2", "taomie3"],
		trigger: { source: "damageBegin1" },
		forced: true,
		locked: false,
		direct: true,
		filter(event, player) {
			return event.player.hasMark("taomie");
		},
		content() {
			"step 0";
			player.logSkill(Math.random() < 0.5 ? "taomie2" : "taomie3", trigger.player);
			var target = get.translation(trigger.player);
			player
				.chooseControl()
				.set("prompt", "讨灭：请选择一项")
				.set("choiceList", [
					"令即将对" + target + "造成的伤害+1",
					"获得" + target + "的一张牌，并可将其交给另一名其他角色",
					"依次执行以上所有选项，并移去" + target + "的“讨灭”标记",
				])
				.set("ai", function () {
					var evt = _status.event.getTrigger();
					var player = _status.event.player;
					var target = evt.player;
					var bool1 = !target.hasSkillTag("filterDamage", null, {
						player: player,
						card: evt.card,
					});
					var bool2 = get.effect(target, { name: "shunshou" }, player, player) > 0;
					if (bool1 && bool2 && target.hp <= evt.num + 1) {
						return 2;
					}
					if (bool1) {
						return 0;
					}
					return 1;
				});
			"step 1";
			if (result.index == 2) {
				trigger.taomie_player = trigger.player;
				trigger.player.addTempSkill("taomie4");
			}
			if (result.index != 1) {
				trigger.num++;
			}
			if (result.index != 0 && trigger.player.countGainableCards(player, "hej") > 0) {
				player.gainPlayerCard(trigger.player, "hej", true);
			} else {
				event.finish();
			}
			"step 2";
			var card = result.cards[0];
			if (
				card &&
				player.getCards("h").includes(card) &&
				game.hasPlayer(function (current) {
					return current != player && current != trigger.player;
				})
			) {
				event.card = card;
				player
					.chooseTarget("是否将" + get.translation(card) + "交给一名其他角色？", function (card, player, target) {
						return target != player && target != _status.event.getTrigger().player;
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						var card = _status.event.getParent().card;
						if (
							target.hasSkillTag("nogain") ||
							!player.needsToDiscard() ||
							(get.tag(card, "damage") &&
								player.hasValueTarget(card, null, false) &&
								get.effect(_status.event.getTrigger().player, card, null, false) > 0)
						) {
							return 0;
						}
						return get.attitude(player, target) / (1 + target.countCards("h"));
					});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				player.give(card, target);
			}
		},
		mod: {
			inRangeOf(from, to) {
				if (from.hasMark("taomie")) {
					return true;
				}
			},
			inRange(from, to) {
				if (to.hasMark("taomie")) {
					return true;
				}
			},
		},
		intro: {
			content: "mark",
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (target && get.tag(card, "damage") && target.hasMark("taomie")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return;
						}
						if (get.attitude(player, target) > 0) {
							return 0.7;
						}
						return 1.2;
					}
				},
			},
		},
	},
	taomie1: {
		audio: true,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		sourceSkill: "taomie",
		logTarget(trigger, player) {
			if (player == trigger.player) {
				return trigger.source;
			}
			return trigger.player;
		},
		filter(event, player) {
			var target = lib.skill.taomie1.logTarget(event, player);
			return target && target.isIn() && !target.hasMark("taomie");
		},
		check(event, player) {
			var target = lib.skill.taomie1.logTarget(event, player);
			if (get.attitude(player, target) > 0) {
				return false;
			}
			var target0 = game.findPlayer(function (current) {
				return current.hasMark("taomie");
			});
			if (!target0) {
				return true;
			}
			var eff1 = 0,
				eff2 = 0;
			player.countCards("h", function (card) {
				if (!get.tag(card, "damage")) {
					return false;
				}
				if (player.hasValueTarget(card, null, true) > 0) {
					if (player.canUse(card, target, null, true)) {
						var eff = get.effect(target, card, player, player);
						if (eff > 0) {
							eff1 += eff;
						}
					}
					if (player.canUse(card, target0, null, true)) {
						var eff = get.effect(target0, card, player, player);
						if (eff > 0) {
							eff2 += eff;
						}
					}
				}
			});
			return eff1 > eff2;
		},
		prompt2(event, player) {
			var target = lib.skill.taomie1.logTarget(event, player);
			var str = "令" + get.translation(target) + "获得“讨灭”标记";
			if (
				game.hasPlayer(function (current) {
					return current.hasMark("taomie");
				})
			) {
				str += "，并移去场上已有的“讨灭”标记";
			}
			return str;
		},
		content() {
			game.countPlayer(function (current) {
				var num = current.countMark("taomie");
				if (num) {
					current.removeMark("taomie");
				}
			});
			lib.skill.taomie1.logTarget(trigger, player).addMark("taomie", 1);
		},
	},
	taomie2: { audio: true },
	taomie3: { audio: true },
	taomie4: {
		trigger: {
			global: ["damageAfter", "damageCancelled", "damageZero"],
			player: "dieBegin",
		},
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "taomie",
		filter(event, player) {
			return player.hasMark("taomie") && (event.name == "die" || event.taomie_player == player);
		},
		content() {
			player.removeMark("taomie", player.countMark("taomie"));
			player.removeSkill("taomie2");
		},
	},
	//铁骑飞
	liyong: {
		audio: "retishen",
		trigger: { player: "shaMiss" },
		forced: true,
		filter(event, player) {
			return player.isPhaseUsing();
		},
		content() {
			trigger.getParent().liyong = true;
			player.addTempSkill("liyong2", "phaseUseEnd");
		},
	},
	liyong2: {
		audio: "retishen",
		mark: true,
		intro: {
			content: "铁骑！强命！加伤！然后掉血嘞…",
		},
		trigger: { player: "useCardToPlayered" },
		forced: true,
		sourceSkill: "liyong",
		filter(event, player) {
			if (!event.card || event.card.name != "sha") {
				return false;
			}
			var evt = event.getParent();
			if (evt.liyong) {
				return false;
			}
			var history = player.getHistory("useCard", function (evt) {
				return evt.card.name == "sha";
			});
			var evt2 = history[history.indexOf(evt) - 1];
			return evt2 && evt2.liyong;
		},
		logTarget: "target",
		content() {
			var target = trigger.target;
			target.addTempSkill("fengyin");
			trigger.directHit.add(target);
			var id = target.playerid;
			var map = trigger.customArgs;
			if (!map[id]) {
				map[id] = {};
			}
			if (!map[id].extraDamage) {
				map[id].extraDamage = 0;
			}
			map[id].extraDamage++;
			trigger.getParent().liyong2 = true;
		},
		group: ["liyong3", "liyong4"],
	},
	liyong3: {
		trigger: { source: "damageSource" },
		forced: true,
		popup: false,
		sourceSkill: "liyong",
		filter(event, player) {
			return event.card && event.card.name == "sha" && event.player.isIn() && event.getParent(2).liyong2 == true;
		},
		content() {
			player.loseHp();
		},
	},
	liyong4: {
		trigger: { player: "useCardAfter" },
		forced: true,
		silent: true,
		sourceSkill: "liyong",
		filter(evt, player) {
			if (!evt.card || evt.card.name != "sha") {
				return false;
			}
			if (evt.liyong) {
				return false;
			}
			var history = player.getHistory("useCard", function (evt) {
				return evt.card.name == "sha";
			});
			var evt2 = history[history.indexOf(evt) - 1];
			return evt2 && evt2.liyong;
		},
		content() {
			player.removeSkill("liyong2");
		},
	},
	//韩遂
	xinniluan: {
		audio: "niluan",
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return (
				player != event.player &&
				event.player.isIn() &&
				event.player.getHistory("useCard", function (evt) {
					if (evt.targets && evt.targets.length) {
						var targets = evt.targets.slice(0);
						while (targets.includes(event.player)) {
							targets.remove(event.player);
						}
						return targets.length > 0;
					}
					return false;
				}).length > 0 &&
				(_status.connectMode || player.hasSha())
			);
		},
		clearTime: true,
		content() {
			"step 0";
			player.chooseToUse({
				logSkill: "xinniluan",
				preTarget: trigger.player,
				prompt: "是否发动【逆乱】，对" + get.translation(trigger.player) + "使用一张【杀】？",
				filterCard(card, player) {
					return get.name(card) == "sha" && lib.filter.filterCard.apply(this, arguments);
				},
				filterTarget(card, player, target) {
					return target == _status.event.preTarget && lib.filter.targetEnabled.apply(this, arguments);
				},
				addCount: false,
			});
			"step 1";
			if (
				result.bool &&
				player.getHistory("sourceDamage", function (evt) {
					return evt.getParent(4) == event;
				}).length &&
				trigger.player.countDiscardableCards(player, "he") > 0
			) {
				player.discardPlayerCard(trigger.player, true, "he").boolline = true;
			}
		},
	},
	xiaoxi_hansui: {
		audio: 2,
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			return get.color(card) == "black";
		},
		position: "hse",
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			if (!player.countCards("hse", { color: "black" })) {
				return false;
			}
		},
		prompt: "将一张黑色牌当杀使用或打出",
		check(card) {
			return 4.5 - get.value(card);
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("hes", { color: "black" })) {
					return false;
				}
			},
			respondSha: true,
		},
	},
	//胡车儿
	daoji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				player.countCards("he", function (card) {
					return get.type(card) != "basic";
				}) &&
				game.hasPlayer(function (target) {
					return target != player && target.countGainableCards(player, "e") > 0;
				})
			);
		},
		filterCard(card) {
			return get.type(card) != "basic";
		},
		position: "he",
		filterTarget(card, player, target) {
			return target != player && target.countGainableCards(player, "e") > 0;
		},
		check(card) {
			var player = _status.event.player;
			if (
				game.hasPlayer(function (current) {
					return (
						current != player && get.attitude(player, current) < 0 && get.damageEffect(current, player, player) > 0 && current.getEquip(1)
					);
				})
			) {
				return 8 - get.value(card);
			}
			return 5 - get.value(card);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player
				.gainPlayerCard(target, "e", true)
				.set("ai", function (button) {
					const card = button.link;
					const player = _status.event.player;
					if (get.subtype(card) == "equip1" && get.damageEffect(_status.event.target, player, player) > 0) {
						return 6 + get.value(card);
					}
					return get.value(card);
				})
				.forResult();
			if (!result?.bool || !result.cards?.length) {
				return;
			}
			const card = result.cards[0];
			if (player.getCards("h").includes(card) && get.type(card) == "equip") {
				await player.chooseUseTarget(card, true, "nopopup");
			}
			if (get.subtype(card, false) == "equip1") {
				await target.damage();
			}
		},
		ai: {
			order: 6,
			result: {
				target(player, current) {
					if (get.damageEffect(current, player, player) > 0 && current.getEquip(1)) {
						return -1.5;
					}
					return -1;
				},
			},
		},
	},
	//司马师夫妇
	//垃圾
	baiyi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		selectTarget: 2,
		limited: true,
		skillAnimation: false,
		//animationColor:'thunder',
		filter(event, player) {
			return player.isDamaged() && game.players.length > 2;
		},
		multitarget: true,
		multiline: true,
		seatRelated: "changeSeat",
		contentBefore() {
			player.$fullscreenpop("败移", "thunder");
		},
		content() {
			player.awakenSkill(event.name);
			game.broadcastAll(
				function (target1, target2) {
					game.swapSeat(target1, target2);
				},
				targets[0],
				targets[1]
			);
		},
		ai: {
			order() {
				return get.order({ name: "tao" }) + 1;
			},
			result: {
				target(player, target) {
					if (player.hasUnknown() && target != player.next && target != player.previous) {
						return 0;
					}
					var distance = Math.pow(get.distance(player, target, "absolute"), 2);
					if (!ui.selected.targets.length) {
						return distance;
					}
					var distance2 = Math.pow(get.distance(player, ui.selected.targets[0], "absolute"), 2);
					return Math.min(0, distance - distance2);
				},
			},
		},
	},
	jinglve: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (player.hasSkill("jinglve2")) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("h") > 0;
			});
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.markAuto("jinglve4", [target]);
			player.chooseButton(["选择一张牌作为「死士」", target.getCards("h")], true).set("ai", function (button) {
				var target = _status.event.getParent().target;
				var card = button.link;
				var val = target.getUseValue(card);
				if (val > 0) {
					return val;
				}
				return get.value(card);
			});
			"step 1";
			if (result.bool) {
				player.storage.jinglve2 = target;
				player.storage.jinglve3 = result.links[0];
				player.addSkill("jinglve2");
			}
		},
		ai: {
			order: 12,
			result: {
				target: -1,
			},
		},
	},
	jinglve2: {
		mark: true,
		intro: {
			name: "死士",
			mark(dialog, content, player) {
				dialog.addText("记录目标");
				dialog.add([content]);
				if (player == game.me || player.isUnderControl()) {
					dialog.addText("死士牌");
					dialog.add([player.storage.jinglve3]);
				}
			},
		},
		sourceSkill: "jinglve",
		onremove(player) {
			delete player.storage.jinglve2;
			delete player.storage.jinglve3;
		},
		trigger: { global: ["dieEnd", "loseEnd", "gainEnd"] },
		silent: true,
		lastDo: true,
		charlotte: true,
		filter(event, player) {
			if (event.name != "gain" && event.player != player.storage.jinglve2) {
				return false;
			}
			return (
				event.name == "die" ||
				(event.cards.includes(player.storage.jinglve3) &&
					(event.name == "gain" || (event.position != ui.ordering && event.position != ui.discardPile)))
			);
		},
		content() {
			player.removeSkill("jinglve2");
		},
		group: "jinglve3",
	},
	jinglve3: {
		audio: "jinglve",
		trigger: {
			global: ["loseAfter", "useCard", "phaseAfter", "cardsDiscardAfter", "loseAsyncAfter"],
		},
		sourceSkill: "jinglve",
		filter(event, player) {
			if (event.player && event.player != player.storage.jinglve2) {
				return false;
			}
			var card = player.storage.jinglve3;
			if (event.name == "phase") {
				return event.player.getCards("hej").includes(card);
			}
			if (event.name == "useCard") {
				return event.cards.includes(card);
			}
			return get.position(card, true) == "d" && event.getd().includes(card);
		},
		forced: true,
		charlotte: true,
		logTarget: "player",
		content() {
			if (trigger.name == "useCard") {
				trigger.all_excluded = true;
				trigger.targets.length = 0;
			} else {
				if (trigger.name == "phase") {
					player.gain(player.storage.jinglve3, trigger.player, "giveAuto", "bySelf");
				} else if (get.position(player.storage.jinglve3, true) == "d") {
					player.gain(player.storage.jinglve3, "gain2");
				}
			}
			player.removeSkill("jinglve2");
		},
	},
	shanli: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.storage.baiyi && player.getStorage("jinglve4").length > 1;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.loseMaxHp();
			player.chooseTarget(true, "选择【擅立】的目标").set("ai", function (target) {
				var att = get.attitude(_status.event.player, target);
				if (target == game.me || (target.isUnderControl() && target.isOnline())) {
					return 2 * att;
				}
				return att;
			});
			"step 1";
			var target = result.targets[0];
			event.target = target;
			player.line(target, "green");
			game.log(player, "拥立", target);
			var list = [];
			if (!_status.characterlist) {
				if (_status.connectMode) {
					var list = get.charactersOL();
				} else {
					var list = [];
					for (var i in lib.character) {
						if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) {
							continue;
						}
						list.push(i);
					}
				}
				game.countPlayer2(function (current) {
					list.remove(current.name);
					list.remove(current.name1);
					list.remove(current.name2);
					if (current.storage.rehuashen && current.storage.rehuashen.character) {
						list.removeArray(current.storage.rehuashen.character);
					}
				});
				_status.characterlist = list;
			}
			_status.characterlist.randomSort();
			var chara = [];
			var skills = [];
			for (var i of _status.characterlist) {
				if (i == "key_yuri") {
					continue;
				}
				var character = lib.character[i];
				if (character && character[3]) {
					for (var j of character[3]) {
						if (skills.includes(j) || j == "yuri_wangxi" || target.hasSkill(j)) {
							continue;
						}
						var info = get.info(j);
						if (info && info.zhuSkill) {
							skills.add(j);
							chara.add(i);
							continue;
						}
					}
				}
				if (skills.length >= 3) {
					break;
				}
			}
			if (!skills.length) {
				event.finish();
				return;
			}
			event.chara = chara;
			event.skills = skills;
			player.chooseControl(skills).set("dialog", ["选择令" + get.translation(target) + "获得一个技能", [chara, "character"]]);
			"step 2";
			target.addSkills(result.control);
			target.setAvatarQueue(target.name1 || target.name, [event.chara[event.skills.indexOf(result.control)]]);
		},
		ai: {
			combo: "baiyi",
		},
	},
	hongyi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		//filter:function(event,player){
		//	return player.countCards('he')>=Math.min(2,game.dead.length);
		//},
		//selectCard:function(){
		//	return Math.min(2,game.dead.length);
		//},
		//filterCard:true,
		filterTarget: lib.filter.notMe,
		check(card) {
			var num = Math.min(2, game.dead.length);
			if (!num) {
				return 1;
			}
			if (num == 1) {
				return 7 - get.value(card);
			}
			return 5 - get.value(card);
		},
		position: "he",
		content() {
			const skill = event.name + "_effect";
			player.addTempSkill(skill, { player: "phaseBeginStart" });
			player.markAuto(skill, target);
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.hasJudge("lebu")) {
						return -0.5;
					}
					return -1 - target.countCards("h");
				},
			},
		},
		subSkill: {
			effect: {
				audio: "hongyi",
				trigger: { global: "damageBegin1" },
				charlotte: true,
				forced: true,
				logTarget: "source",
				filter(event, player) {
					return player.getStorage("hongyi_effect").includes(event.source);
				},
				async content(event, trigger, player) {
					const result = await trigger.source.judge().forResult();
					if (result.color == "black") {
						trigger.num--;
					} else {
						await trigger.player.draw();
					}
				},
				onremove: true,
				intro: {
					content: "已选中$为技能目标",
				},
			},
		},
	},
	requanfeng: {
		audio: "quanfeng",
		enable: "chooseToUse",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		prompt2: "（限定技）失去技能【劝封】，并获得该角色武将牌上的所有技能，然后加1点体力上限并回复1点体力",
		logTarget: "player",
		trigger: { global: "die" },
		check: (event, player) => {
			if (
				event.player
					.getStockSkills("仲村由理", "天下第一")
					.filter(skill => {
						let info = get.info(skill);
						return info && !info.hiddenSkill && !info.zhuSkill && !info.charlotte;
					})
					.some(i => {
						let info = get.info(i);
						if (info && info.ai) {
							return info.ai.neg || info.ai.halfneg;
						}
					})
			) {
				return false;
			}
			return true;
		},
		filter(event, player) {
			if (event.name == "die") {
				return (
					player.hasSkill("hongyi") &&
					event.player.getStockSkills("仲村由理", "天下第一").filter(function (skill) {
						var info = get.info(skill);
						return info && !info.hiddenSkill && !info.zhuSkill && !info.charlotte;
					}).length > 0
				);
			}
			return event.type == "dying" && player == event.dying;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			if (trigger?.name == "die") {
				await player.removeSkills("hongyi");
				const skills = trigger.player.getStockSkills("仲村由理", "天下第一").filter(function (skill) {
					const info = get.info(skill);
					return info && !info.hiddenSkill && !info.zhuSkill && !info.charlotte;
				});
				if (skills.length) {
					await player.addSkills(skills);
					game.broadcastAll(function (list) {
						game.expandSkills(list);
						for (const i of list) {
							const info = lib.skill[i];
							if (!info) {
								continue;
							}
							if (!info.audioname2) {
								info.audioname2 = {};
							}
							info.audioname2.yanghuiyu = "quanfeng";
						}
					}, skills);
				}
				await player.gainMaxHp();
				await player.recover();
			} else {
				await player.gainMaxHp(2);
				await player.recover(4);
			}
		},
		ai: {
			save: true,
			skillTagFilter(player, tag, arg) {
				return player == arg;
			},
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	quanfeng: {
		audio: 2,
		trigger: { global: "die" },
		filter(event, player) {
			return (
				event.player.getStockSkills("仲村由理", "天下第一").filter(function (skill) {
					var info = get.info(skill);
					return info && !info.juexingji && !info.hiddenSkill && !info.zhuSkill && !info.charlotte && !info.limited && !info.dutySkill;
				}).length > 0
			);
		},
		logTarget: "player",
		skillAnimation: true,
		limited: true,
		forced: true,
		animationColor: "thunder",
		content() {
			"step 0";
			player.awakenSkill(event.name);
			var list = trigger.player.getStockSkills("仲村由理", "天下第一").filter(function (skill) {
				var info = get.info(skill);
				return info && !info.juexingji && !info.hiddenSkill && !info.zhuSkill && !info.charlotte && !info.limited && !info.dutySkill;
			});
			if (list.length == 1) {
				event._result = { control: list[0] };
			} else {
				player
					.chooseControl(list)
					.set("prompt", "选择获得" + get.translation(trigger.player) + "的一个技能")
					.set("forceDie", true)
					.set("ai", function () {
						return list.randomGet();
					});
			}
			"step 1";
			player.addSkills(result.control);
			game.broadcastAll(function (skill) {
				var list = [skill];
				game.expandSkills(list);
				for (var i of list) {
					var info = lib.skill[i];
					if (!info) {
						continue;
					}
					if (!info.audioname2) {
						info.audioname2 = {};
					}
					info.audioname2.yanghuiyu = "quanfeng";
				}
			}, result.control);
			player.gainMaxHp();
			player.recover();
		},
	},
	//手杀界朱然
	//设计师你改技能有瘾🐴
	mobiledanshou: {
		trigger: { global: "phaseJieshuBegin" },
		audio: 2,
		direct: true,
		filter(event, player) {
			if (player == event.player) {
				return false;
			}
			var num = event.player.getHistory("useCard", function (evt) {
				return evt.targets.includes(player);
			}).length;
			return num == 0 || (event.player.isIn() && num <= player.countCards("he"));
		},
		content() {
			"step 0";
			var num = trigger.player.getHistory("useCard", function (evt) {
				return evt.targets.includes(player);
			}).length;
			event.num = num;
			if (num == 0) {
				if (player.hasSkill("mobiledanshou")) {
					event._result = { bool: true };
				} else {
					player.chooseBool("是否发动【胆守】摸一张牌？", lib.translate.mobiledanshou_info);
				}
			} else {
				event.goto(2);
			}
			"step 1";
			if (result.bool) {
				player.logSkill("mobiledanshou");
				player.draw();
			}
			event.finish();
			"step 2";
			player
				.chooseToDiscard(num, get.prompt("mobiledanshou", trigger.player), "弃置" + get.translation(num) + "张牌并对其造成1点伤害", "he")
				.set("ai", function (card) {
					if (!_status.event.goon) {
						return 0;
					}
					var num = _status.event.getParent().num;
					if (num == 1) {
						return 8 - get.value(card);
					}
					if (num == 2) {
						return 6.5 - get.value(card);
					}
					return 5 - get.value(card);
				})
				.set("goon", get.damageEffect(trigger.player, player, player) > 0).logSkill = ["mobiledanshou", trigger.player];
			"step 3";
			if (result.bool) {
				player.addExpose(0.2);
				trigger.player.damage();
			}
		},
	},
	//丁原
	//程序员和设计师至少有一个脑子有坑
	beizhu: {
		audio: 3,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (target) {
				return lib.skill.beizhu.filterTarget(null, player, target);
			});
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		logAudio: () => 2,
		content() {
			"step 0";
			player.addTempSkill("beizhu_draw");
			player.viewHandcards(target);
			"step 1";
			var cards = target.getCards("h", "sha");
			if (cards.length) {
				event.cards = cards;
				event.goto(5);
			} else {
				player.discardPlayerCard("he", target, "visible", true);
			}
			"step 2";
			player.chooseBool("是否令" + get.translation(target) + "获得一张【杀】？").set("choice", get.attitude(player, target) > 0);
			"step 3";
			if (result.bool) {
				var card = get.cardPile2(function (card) {
					return card.name == "sha";
				});
				if (card) {
					target.gain(card, "gain2");
				}
			} else {
				event.finish();
			}
			"step 4";
			game.updateRoundNumber();
			event.finish();
			"step 5";
			var hs = target.getCards("h");
			cards = cards.filter(function (card) {
				return (
					hs.includes(card) &&
					get.name(card, target) == "sha" &&
					target.canUse(
						{
							name: "sha",
							isCard: true,
							cards: [card],
						},
						player,
						false
					)
				);
			});
			if (cards.length) {
				var card = cards.randomRemove(1)[0];
				target.useCard(player, false, card).card.beizhu = true;
				event.redo();
			}
		},
		ai: {
			order: 7,
			threaten: 1.14 + 5.14,
			result: {
				player(player, target) {
					var eff = get.effect(target, { name: "guohe_copy2" }, player, player);
					var cards = target.getCards("h", { name: "sha" });
					if (!cards.length) {
						return eff;
					}
					return eff / (cards.length + 3);
				},
			},
		},
	},
	beizhu_draw: {
		charlotte: true,
		audio: "beizhu3.mp3",
		trigger: { player: "damageEnd" },
		sourceSkill: "beizhu",
		filter(event, player) {
			return event.card?.beizhu;
		},
		forced: true,
		content() {
			player.draw(trigger.num);
		},
	},
	//新简雍
	xinqiaoshui: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				player.addTempSkill("xinqiaoshui_target", "phaseUseEnd");
			} else {
				player.addTempSkill("qiaoshui2", "phaseUseEnd");
			}
		},
		subSkill: {
			target: {
				audio: "xinqiaoshui",
				inherit: "qiaoshui3",
				sourceSkill: "xinqiaoshui",
			},
		},
		ai: {
			order(item, player) {
				if (
					player.countCards("h", function (card) {
						return player.hasValueTarget(card);
					})
				) {
					return 10;
				}
				return 1;
			},
			result: {
				target(player, target) {
					if (
						player.countCards("h", function (card) {
							return player.hasValueTarget(card);
						})
					) {
						if (player.hasSkill("xinqiaoshui_target")) {
							return 0;
						}
						var nd = !player.needsToDiscard();
						if (
							player.hasCard(function (card) {
								if (get.position(card) != "h") {
									return false;
								}
								var val = get.value(card);
								if (nd && val < 0) {
									return true;
								}
								if (val <= 5) {
									return card.number >= 12;
								}
								if (val <= 6) {
									return card.number >= 13;
								}
								return false;
							})
						) {
							return -1;
						}
						return 0;
					}
					return -1;
				},
			},
		},
	},
	xinjyzongshi: {
		audio: 2,
		trigger: {
			global: ["chooseToCompareAfter", "compareMultipleAfter"],
		},
		filter(event, player) {
			if (event.preserve) {
				return false;
			}
			if (event.compareMultiple) {
				return false;
			}
			if (event.compareMeanwhile) {
				const index = [...event.targets, event.player].indexOf(player);
				return index >= 0;
			}
			return [event.player, event.target].some(current => current == player);
		},
		frequent: true,
		async content(event, trigger, player) {
			let str = '<div class="text center">牌堆顶';
			const cards = get.cards(1, true);
			if (trigger.name == "chooseToCompare" && trigger.compareMeanwhile) {
				const result = trigger.result;
				const list = [[result.num1[0], result.player]];
				list.addArray(
					result.num2.map(function (card, i) {
						return [card, result.targets[i]];
					})
				);
				list.sort(function (a, b) {
					return a[0] - b[0];
				});
				if (list[0][0] < list[1][0] && get.position(list[0][1], true) == "o") {
					str += "/拼点牌";
					cards.push(list[0][1]);
				}
			} else {
				if (player == trigger.player) {
					if (trigger.num1 > trigger.num2 && get.position(trigger.card2, true) == "o") {
						str += "/拼点牌";
						cards.push(trigger.card2);
					} else if (trigger.num1 < trigger.num2 && get.position(trigger.card1, true) == "o") {
						str += "/拼点牌";
						cards.push(trigger.card1);
					}
				} else {
					if (trigger.num1 < trigger.num2 && get.position(trigger.card1, true) == "o") {
						str += "/拼点牌";
						cards.push(trigger.card1);
					} else if (trigger.num1 > trigger.num2 && get.position(trigger.card2, true) == "o") {
						str += "/拼点牌";
						cards.push(trigger.card2);
					}
				}
			}
			str += "</div>";
			const result = await player.chooseButton(["纵适：选择要获得的牌", str, cards]).set("ai", get.buttonValue).forResult();
			if (result.bool) {
				const draw = result.links[0] == cards[0];
				game.log(player, "获得了", draw ? "牌堆顶的一张牌" : result.links);
				await player.gain(result.links, draw ? "draw" : "gain2").set("log", false);
				/*if (!draw) {
					cards[0].fix();
					ui.cardPile.insertBefore(cards[0], ui.cardPile.firstChild);
					game.updateRoundNumber();
				}*/
			}
		},
	},
	//通渠张恭
	rezhenxing: {
		audio: "xinfu_zhenxing",
		trigger: {
			player: ["damageEnd", "phaseJieshuBegin"],
		},
		frequent: true,
		async content(event, trigger, player) {
			const cards = get.cards(3, true);
			const result = await player
				.chooseButton(["【镇行】：请选择要获得的牌", cards])
				.set("filterButton", function (button) {
					var cards = _status.event.cards;
					for (var i = 0; i < cards.length; i++) {
						if (button.link != cards[i] && get.suit(cards[i]) == get.suit(button.link)) {
							return false;
						}
					}
					return true;
				})
				.set("ai", function (button) {
					return get.value(button.link);
				})
				.set("cards", cards)
				.forResult();
			if (result.bool && result.links?.length) {
				await player.gain(result.links, "gain2");
			}
		},
	},
	//芙蓉，手杀界廖化，手杀界曹彰
	rejiangchi: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		direct: true,
		logAudio: index => (typeof index === "number" ? "rejiangchi" + index + ".mp3" : 2),
		content() {
			"step 0";
			var list = ["弃牌", "摸牌", "取消"];
			if (!player.countCards("he")) {
				list.remove("弃牌");
			}
			player
				.chooseControl(list, function () {
					var player = _status.event.player;
					if (list.includes("弃牌")) {
						if (player.countCards("h") > 3 && player.countCards("h", "sha") > 1) {
							return "弃牌";
						}
						if (player.countCards("h", "sha") > 2) {
							return "弃牌";
						}
					}
					if (!player.countCards("h", "sha")) {
						return "摸牌";
					}
					return "cancel2";
				})
				.set("prompt", get.prompt2("rejiangchi"));
			"step 1";
			player.logSkill("rejiangchi", null, null, null, [result.control == "弃牌" ? 2 : 1]);
			if (result.control == "弃牌") {
				player.chooseToDiscard(true, "he");
				player.addTempSkill("jiangchi2", "phaseUseEnd");
			} else if (result.control == "摸牌") {
				player.draw();
				player.addTempSkill("rejiangchi3", "phaseUseEnd");
			}
		},
	},
	rejiangchi3: {
		mod: {
			cardEnabled(card) {
				if (card.name == "sha") {
					return false;
				}
			},
		},
	},
	refuli: {
		skillAnimation: true,
		animationColor: "soil",
		audio: 2,
		limited: true,
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type != "dying") {
				return false;
			}
			if (player != event.dying) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = game.countGroup();
			await player.recoverTo(num);
			if (player.isMaxHp(true)) {
				await player.turnOver();
			}
		},
		ai: {
			save: true,
			skillTagFilter(player, arg, target) {
				return player == target;
			},
			result: { player: 10 },
			threaten(player, target) {
				if (!target.storage.refuli) {
					return 0.9;
				}
			},
		},
	},
	redangxian: {
		trigger: { player: "phaseBegin" },
		forced: true,
		audio: "dangxian",
		audioname: ["xin_liaohua"],
		audioname2: { guansuo: "dangxian_guansuo" },
		async content(event, trigger, player) {
			const card = get.discardPile(card => card.name == "sha");
			if (card) {
				await player.gain(card, "gain2");
			}
			game.updateRoundNumber();
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
		},
	},
	xuewei: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("xuewei"), lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player;
				if (player == get.zhu(player) && player.hp <= 2) {
					return 0;
				}
				return get.attitude(player, target) - 4;
			}).animate = false;
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("xuewei");
				player.addTempSkill("xuewei2", { player: "phaseBegin" });
				player.storage.xuewei2 = target;
			}
		},
		ai: {
			threaten: 1.05,
		},
	},
	xuewei2: {
		audio: "xuewei",
		forced: true,
		onremove: true,
		trigger: { global: "damageBegin4" },
		charlotte: true,
		sourceSkill: "xuewei",
		filter(event, player) {
			return event.player == player.storage.xuewei2;
		},
		logTarget: "player",
		content() {
			player.removeSkill("xuewei2");
			trigger.cancel();
			player.damage(trigger.num, trigger.source || "nosource");
			if (trigger.source && trigger.source.isIn()) {
				trigger.source.damage(trigger.num, trigger.nature, player);
			}
		},
	},
	liechi: {
		trigger: { player: "dying" },
		forced: true,
		filter(event, player) {
			return event.getParent().name == "damage" && event.source && event.source.countCards("he");
		},
		audio: 2,
		content() {
			trigger.source.chooseToDiscard("he", true);
		},
	},
	rejiuchi: {
		group: ["jiuchi"],
		audioname: ["re_dongzhuo"],
		trigger: { source: "damage" },
		forced: true,
		popup: false,
		locked: false,
		audio: "jiuchi",
		filter(event, player) {
			return event.card && event.card.name == "sha" && event.getParent(2).jiu == true && !player.isTempBanned("benghuai");
		},
		content() {
			player.logSkill("rejiuchi");
			player.tempBanSkill("benghuai");
		},
	},
	//苏飞，新贾逵
	tongqu: {
		audio: 2,
		trigger: {
			global: ["phaseBefore", "dying", "phaseDrawBegin2"],
			player: ["enterGame", "phaseZhunbeiBegin"],
		},
		direct: true,
		filter(event, player) {
			if (event.name == "phaseDraw") {
				return event.player.hasMark("tongqu");
			}
			if (event.name == "dying") {
				return event.player.hasMark("tongqu");
			}
			if (event.name == "phaseZhunbei") {
				return game.hasPlayer(function (current) {
					return !current.hasMark("tongqu");
				});
			}
			return !player.hasMark("tongqu") && (event.name != "phase" || game.phaseNumber == 0);
		},
		content() {
			"step 0";
			if (trigger.name == "phaseDraw") {
				player.logSkill("tongqu", trigger.player);
				trigger.player.draw("nodelay");
				trigger.player.addTempSkill("tongqu2", "phaseDrawAfter");
				event.finish();
			} else if (trigger.name == "dying") {
				player.logSkill("tongqu", trigger.player);
				trigger.player.removeMark("tongqu", 1);
				event.finish();
			} else if (trigger.name == "phaseZhunbei") {
				player
					.chooseTarget(get.prompt2("tongqu"), function (card, player, target) {
						return !target.hasMark("tongqu");
					})
					.set("ai", function (target) {
						if (_status.event.player.hp < 3) {
							return 0;
						}
						return get.attitude(_status.event.player, target);
					});
			} else {
				player.logSkill("tongqu");
				player.addMark("tongqu", 1);
				event.finish();
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.loseHp();
				player.logSkill("tongqu", target);
				target.addMark("tongqu", 1);
			}
		},
		marktext: "渠",
		intro: { content: "mark", name2: "渠" },
	},
	tongqu2: {
		trigger: { player: "phaseDrawEnd" },
		forced: true,
		silent: true,
		sourceSkill: "tongqu",
		filter(event, player) {
			var bool = game.hasPlayer(function (current) {
				return current != player && current.hasMark("tongqu");
			});
			return (
				player.countCards("he", function (card) {
					if (bool) {
						return true;
					}
					return lib.filter.cardDiscardable(card, player);
				}) > 0
			);
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				forced: true,
				position: "he",
				filterCard: true,
				filterTarget(card, player, target) {
					return player != target && target.hasMark("tongqu");
				},
				selectTarget() {
					if (ui.selected.cards.length && !lib.filter.cardDiscardable(ui.selected.cards[0], _status.event.player)) {
						return [1, 1];
					}
					return [0, 1];
				},
				prompt: "弃置一张牌，或将一张牌交给一名有“渠”的其他角色",
				ai1(card) {
					var player = _status.event.player;
					if (get.name(card) == "du") {
						return 20;
					}
					if (get.position(card) == "e" && get.value(card) <= 0) {
						return 14;
					}
					if (
						get.position(card) == "h" &&
						game.hasPlayer(function (current) {
							return (
								current != player &&
								current.hasMark("tongqu") &&
								get.attitude(player, current) > 0 &&
								current.getUseValue(card) > player.getUseValue(card) &&
								current.getUseValue(card) > player.getUseValue(card)
							);
						})
					) {
						return 12;
					}
					if (
						game.hasPlayer(function (current) {
							return current != player && current.hasMark("tongqu") && get.attitude(player, current) > 0;
						})
					) {
						if (card.name == "wuxie") {
							return 11;
						}
						if (card.name == "shan" && player.countCards("h", "shan") > 1) {
							return 9;
						}
					}
					return 6 / Math.max(1, get.value(card));
				},
				ai2(target) {
					var player = _status.event.player;
					var card = ui.selected.cards[0];
					var att = get.attitude(player, target);
					if (card.name == "du") {
						return -6 * att;
					}
					if (att > 0) {
						if (get.position(card) == "h" && target.getUseValue(card) > player.getUseValue(card)) {
							return 4 * att;
						}
						if (target.hasUseTarget(card)) {
							return 2 * att;
						}
						return 1.2 * att;
					}
					return 0;
				},
			});
			"step 1";
			if (result.bool) {
				if (result.targets.length) {
					event.target = result.targets[0];
					player.give(result.cards, event.target);
					event.card = result.cards[0];
				} else {
					player.discard(result.cards);
					event.finish();
				}
			}
			"step 2";
			if (target.getCards("h").includes(card) && get.type(card) == "equip") {
				target.chooseUseTarget(card, true);
			}
		},
	},
	xinwanlan: {
		audio: "wanlan",
		trigger: { global: "damageBegin4" },
		filter(event, player) {
			return event.player.hp <= event.num && player.countCards("e") >= 1;
		},
		logTarget: "player",
		check(event, player) {
			if (get.attitude(player, event.player) < 4) {
				return false;
			}
			if (player.countCards("hs", card => player.canSaveCard(card, event.player)) >= 1 + event.num - event.player.hp) {
				return false;
			}
			if (event.player == player || event.player == get.zhu(player)) {
				return true;
			}
			return !player.hasUnknown();
		},
		content() {
			player.discard(player.getCards("e"));
			trigger.cancel();
		},
	},
	zhengjian: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		locked: true,
		direct: true,
		content() {
			"step 0";
			player.chooseTarget("请选择【诤荐】的目标", lib.translate.zhengjian_info).set("ai", function (target) {
				if (target.hasSkill("zhengjian_mark")) {
					return 0;
				}
				if (player == target) {
					return 0.5;
				}
				return get.attitude(_status.event.player, target) * (1 + target.countCards("h"));
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("zhengjian", target);
				target.addSkill("zhengjian_mark");
			}
		},
		group: "zhengjian_draw",
		ai: {
			notemp: true,
		},
	},
	zhengjian_draw: {
		audio: "zhengjian",
		trigger: { player: "phaseBegin" },
		forced: true,
		sourceSkill: "zhengjian",
		filter(event) {
			return game.hasPlayer(function (current) {
				return current.hasSkill("zhengjian_mark");
			});
		},
		logTarget(event) {
			return game.filterPlayer(function (current) {
				return current.hasSkill("zhengjian_mark");
			});
		},
		content() {
			"step 0";
			var list = game.filterPlayer(function (current) {
				return current.countMark("zhengjian_mark") > 0;
			});
			if (list.length > 1) {
				event.delay = true;
				game.asyncDraw(list, function (target) {
					return Math.min(5, target.maxHp, target.countMark("zhengjian_mark"));
				});
			} else if (list.length == 1) {
				list[0].draw(Math.min(5, list[0].maxHp, list[0].countMark("zhengjian_mark")));
			}
			"step 1";
			game.countPlayer(function (current) {
				current.removeSkill("zhengjian_mark");
			});
			if (event.delay) {
				game.delayx();
			}
		},
	},
	zhengjian_mark: {
		trigger: { player: ["useCard1", "respond"] },
		silent: true,
		firstDo: true,
		onremove: true,
		charlotte: true,
		sourceSkill: "zhengjian",
		content() {
			player.addMark("zhengjian_mark", 1, false);
		},
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = 0;
			}
		},
		mark: true,
		intro: {
			content: "已使用/打出过#张牌",
		},
	},
	gaoyuan: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		direct: true,
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			if (player.countCards("he") == 0) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return (
					current != event.player &&
					current != player &&
					current.hasSkill("zhengjian_mark") &&
					lib.filter.targetEnabled(event.card, event.player, current)
				);
			});
		},
		content() {
			"step 0";
			var next = player.chooseCardTarget({
				position: "he",
				filterCard: lib.filter.cardDiscardable,
				filterTarget(card, player, target) {
					var trigger = _status.event;
					if (target != player && target != trigger.source) {
						if (target.hasSkill("zhengjian_mark") && lib.filter.targetEnabled(trigger.card, trigger.source, target)) {
							return true;
						}
					}
					return false;
				},
				ai1(card) {
					return get.unuseful(card) + 9;
				},
				ai2(target) {
					if (_status.event.player.countCards("h", "shan")) {
						return -get.attitude(_status.event.player, target);
					}
					if (get.attitude(_status.event.player, target) < 5) {
						return 6 - get.attitude(_status.event.player, target);
					}
					if (_status.event.player.hp == 1 && player.countCards("h", "shan") == 0) {
						return 10 - get.attitude(_status.event.player, target);
					}
					if (_status.event.player.hp == 2 && player.countCards("h", "shan") == 0) {
						return 8 - get.attitude(_status.event.player, target);
					}
					return -1;
				},
				prompt: get.prompt("gaoyuan"),
				prompt2: "弃置一张牌，将此【杀】转移给一名有“诤”的角色",
				source: trigger.player,
				card: trigger.card,
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill(event.name, target);
				player.discard(result.cards);
				var evt = trigger.getParent();
				evt.triggeredTargets2.remove(player);
				evt.targets.remove(player);
				evt.targets.push(target);
			}
		},
		ai: {
			combo: "zhengjian",
		},
	},
	//一 将 成 名
	zhilve: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		async content(event, trigger, player) {
			const result = !player.canMoveCard()
				? { index: 1 }
				: await player
						.chooseControl()
						.set("choiceList", [
							"移动场上的一张牌，若你以此法移动了：装备区的牌，你失去1点体力；判定区的牌，本回合你手牌上限-1",
							"本回合的摸牌阶段多摸一张牌且第一张杀无距离次数限制",
						])
						.set("ai", () => {
							if (get.player().canMoveCard(true)) return 0;
							return 1;
						})
						.forResult();
			if (result?.index === 0) {
				const result = await player
					.moveCard(true, "请移动场上的一张牌，若你以此法移动了：装备区的牌，你失去1点体力；判定区的牌，本回合你手牌上限-1")
					.forResult();
				if (result?.position === "e") {
					await player.loseHp();
				} else if (result?.position === "j") {
					player.addTempSkill(event.name + "_dis");
				}
			} else if (result?.index === 1) {
				player.addTempSkill(event.name + "_yingzi");
				if (!player.hasHistory("useCard", evt => evt.card.name == "sha")) {
					player.addTempSkill(event.name + "_xiandeng");
				}
			}
		},
		subSkill: {
			dis: {
				charlotte: true,
				mark: true,
				markimage: "image/card/handcard.png",
				intro: { content: "本回合手牌上限-1" },
				mod: {
					maxHandcard(player, num) {
						return num - 1;
					},
				},
			},
			yingzi: {
				charlotte: true,
				mark: true,
				intro: { content: "本回合摸牌阶段多摸一张牌" },
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				popup: false,
				filter(event, player) {
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
			xiandeng: {
				charlotte: true,
				mark: true,
				intro: { content: "本回合使用的第一张【杀】无距离限制且不计入次数限制" },
				mod: {
					targetInRange(card, player) {
						if (card.name == "sha") {
							return true;
						}
					},
				},
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return event.card.name == "sha";
				},
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						const stat = player.getStat().card,
							name = trigger.card.name;
						if (typeof stat[name] === "number") {
							stat[name]--;
						}
					}
				},
			},
		},
	},
	xhzhiyan: {
		enable: "phaseUse",
		audio: 2,
		filter(event, player) {
			return player.countCards("h") != player.maxHp;
		},
		filterCard: true,
		selectCard() {
			var player = _status.event.player;
			var num = Math.max(0, player.countCards("h") - player.maxHp);
			return [num, num];
		},
		check(card) {
			var player = _status.event.player;
			if (
				player.getUseValue(card) <= 0 &&
				game.hasPlayer(function (current) {
					return current != player && get.value(card, current) * get.attitude(player, current) > 0;
				})
			) {
				return 1;
			}
			return 0;
		},
		content() {
			"step 0";
			if (!cards.length) {
				player.draw(player.maxHp - player.countCards("h"));
				player.addTempSkill("zishou2");
				event.finish();
			} else {
				cards = cards.filterInD("d");
				if (cards.length) {
					player.chooseButton(["是否将其中的一张牌交给一名其他角色？", cards]).set("", function (button) {
						var player = _status.event.player;
						if (
							game.hasPlayer(function (current) {
								return current != player && get.value(button.link, current) * get.attitude(player, current) > 0;
							})
						) {
							return Math.abs(get.value(button.link));
						}
						return 0;
					});
				} else {
					event.finish();
				}
			}
			"step 1";
			if (result.bool && game.hasPlayer(current => current != player)) {
				event.card = result.links[0];
				player.chooseTarget(true, lib.filter.notMe, "选择一名其他角色获得" + get.translation(event.card)).set("ai", function (target) {
					return get.value(_status.event.getParent().card, target) * get.attitude(_status.event.player, target);
				});
			} else {
				event.finish();
			}
			"step 2";
			var target = result.targets[0];
			player.line(target, "green");
			target.gain(card, "gain2", "log");
		},
		ai: {
			order(obj, player) {
				if (player.countCards("h") > player.maxHp) {
					return 10;
				}
				return 0.5;
			},
			result: {
				player: 1,
			},
		},
	},
	//水 果 忍 者
	zhengjing_guanju: { audio: true },
	zhengjing: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return !player.hasSkill("zhengjing3");
		},
		content() {
			"step 0";
			//game.trySkillAudio('zhengjing_guanju',player);
			if (_status.connectMode) {
				event.time = lib.configOL.choose_timeout;
			}
			var cards = [];
			var names = [];
			while (true) {
				var card = get.cardPile(function (carde) {
					return carde.name != "du" && !names.includes(carde.name);
				});
				if (card) {
					cards.push(card);
					names.push(card.name);
					if (get.mode() == "doudizhu") {
						if (cards.length == 1 && !get.isLuckyStar(player) && Math.random() < 0.33) {
							break;
						}
						if (cards.length == 2 && !get.isLuckyStar(player) && Math.random() < 0.5) {
							break;
						}
						if (cards.length >= 3) {
							break;
						}
					} else {
						if (cards.length == 3 && !get.isLuckyStar(player) && Math.random() < 0.33) {
							break;
						}
						if (cards.length == 4 && !get.isLuckyStar(player) && Math.random() < 0.5) {
							break;
						}
						if (cards.length >= 5) {
							break;
						}
					}
				} else {
					break;
				}
			}
			event.cards = cards;
			if (!cards.length) {
				event.finish();
				return;
			}
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				names.remove("du");
				game.pause();
				game.countChoose();
				setTimeout(function () {
					_status.imchoosing = false;
					event._result = {
						bool: true,
						links: names.slice(0),
					};
					if (event.dialog) {
						event.dialog.close();
					}
					if (event.control) {
						event.control.close();
					}
					game.resume();
				}, 5000);
			};
			var createDialog = function (player, id) {
				if (_status.connectMode) {
					lib.configOL.choose_timeout = "30";
				}
				if (player == game.me) {
					return;
				}
				var str = get.translation(player) + "正在整理经书...<br>";
				ui.create.dialog(str).videoId = id;
			};
			var chooseButton = function (list) {
				var roundmenu = false;
				if (ui.roundmenu && ui.roundmenu.display != "none") {
					roundmenu = true;
					ui.roundmenu.style.display = "none";
				}
				var event = _status.event;
				event.settleed = false;
				event.finishedx = [];
				event.map = {};
				var names = list.slice(0);
				event.zhengjing_nodes = [];
				names.push("du");
				names.randomSort();
				var names2 = names.slice(0);
				for (var i = 0; i < 2; i++) {
					names2.randomSort();
					names = names.concat(names2);
				}

				event.zhengjing = names;
				for (var i of list) {
					event.map[i] = 0;
				}
				event.dialog = ui.create.dialog("forcebutton", "hidden");
				event.dialog.textPrompt = event.dialog.add('<div class="text center">及时点击卡牌，但不要点到毒了！</div>');
				var str = '<div class="text center">';
				for (var i of list) {
					str += get.translation(i) + ":" + Math.min(2, event.map[i]) + "/2 ";
				}
				str += "</div>";
				event.dialog.textPrompt2 = event.dialog.add(str);
				event.switchToAuto = function () {
					event._result = {
						bool: true,
						links: event.finishedx.slice(0),
					};
					event.dialog.close();
					game.resume();
					_status.imchoosing = false;
					if (roundmenu) {
						ui.roundmenu.style.display = "";
					}
				};
				event.dialog.classList.add("fixed");
				event.dialog.classList.add("scroll1");
				event.dialog.classList.add("scroll2");
				event.dialog.classList.add("fullwidth");
				event.dialog.classList.add("fullheight");
				event.dialog.classList.add("noupdate");
				event.dialog.open();
				event.settle = function (du) {
					if (event.settleed) {
						return;
					}
					event.settleed = true;
					event.dialog.textPrompt2.innerHTML = "";
					if (du) {
						if (lib.config.background_speak) {
							game.playAudio("skill", "zhengjing_boom");
						}
						event.dialog.textPrompt.innerHTML = '<div class="text center">叫你别点毒你非得点 这下翻车了吧</div>';
					} else {
						if (lib.config.background_speak) {
							game.playAudio("skill", "zhengjing_finish");
						}
						event.dialog.textPrompt.innerHTML =
							'<div class="text center">整理经典结束！共整理出' + get.cnNumber(event.finishedx.length) + "份经典</div>";
					}
					while (event.zhengjing_nodes.length) {
						event.zhengjing_nodes.shift().delete();
					}
					setTimeout(function () {
						event.switchToAuto();
					}, 1000);
				};

				var click = function () {
					var name = this.name;
					if (name == "du") {
						event.zhengjing.length = 0;
						event.settle(true);
					} else {
						if (lib.config.background_speak) {
							game.playAudio("skill", "zhengjing_click");
						}
						event.map[name]++;
						if (event.map[name] > 1) {
							event.finishedx.add(name);
						}
						if (event.finishedx.length < list.length) {
							var str = '<div class="text center">';
							for (var i of list) {
								str += get.translation(i) + ":" + Math.min(2, event.map[i]) + "/2 ";
							}
							str += "</div>";
							event.dialog.textPrompt2.innerHTML = str;
						} else {
							event.zhengjing.length = 0;
							event.settle();
						}
					}
					event.zhengjing_nodes.remove(this);
					this.style.transition = "all 0.5s";
					this.style.transform = "scale(1.2)";
					this.delete();
				};
				var addNode = function () {
					if (event.zhengjing.length) {
						var card = ui.create.card(ui.special, "noclick", true);
						card.init(["", "", event.zhengjing.shift()]);
						card.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", click);
						event.zhengjing_nodes.push(card);
						card.style.position = "absolute";
						var rand1 = Math.round(Math.random() * 100);
						var rand2 = Math.round(Math.random() * 100);
						var rand3 = Math.round(Math.random() * 40) - 20;
						card.style.left = "calc(" + rand1 + "% - " + rand1 + "px)";
						card.style.top = "calc(" + rand2 + "% - " + rand2 + "px)";
						card.style.transform = "scale(0.8) rotate(" + rand3 + "deg)";
						card.style.opacity = 0;
						event.dialog.appendChild(card);
						ui.refresh(card);
						card.style.opacity = 1;
						card.style.transform = "scale(1) rotate(" + rand3 + "deg)";
					}
					if (event.zhengjing_nodes.length > (event.zhengjing.length > 0 ? 2 : 0)) {
						event.zhengjing_nodes.shift().delete();
					}
					if (event.zhengjing.length || event.zhengjing_nodes.length) {
						setTimeout(function () {
							addNode();
						}, 800);
					} else {
						event.settle();
					}
				};

				game.pause();
				game.countChoose();
				addNode();
			};
			//event.switchToAuto=switchToAuto;
			game.broadcastAll(createDialog, player, event.videoId);
			if (event.isMine()) {
				chooseButton(names);
			} else if (event.isOnline()) {
				event.player.send(chooseButton, names);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			game.broadcastAll(
				function (id, time) {
					if (_status.connectMode) {
						lib.configOL.choose_timeout = time;
					}
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
					}
				},
				event.videoId,
				event.time
			);
			var result = event.result || result;
			for (var i = 0; i < cards.length; i++) {
				//if(cards.length==1) break;
				if (!result.links.includes(cards[i].name)) {
					cards.splice(i--, 1);
				}
			}
			if (cards.length) {
				player.showCards(cards, get.translation(player) + "整理出了以下经典");
				game.cardsGotoOrdering(cards);
			} else {
				game.log(player, "并没有整理出经典");
				player.popup("杯具");
				event.finish();
			}
			"step 2";
			game.updateRoundNumber();
			player.chooseTarget(true, "将整理出的经典置于一名角色的武将牌上").set("ai", function (target) {
				if (target.hasSkill("xinfu_pdgyingshi")) {
					return 0;
				}
				let player = _status.event.player,
					cards = _status.event.getParent().cards,
					att = get.attitude(player, target),
					js = target.getCards("j", i => {
						let name = i.viewAs || i.name,
							info = lib.card[name];
						if (!info || !info.judge) {
							return false;
						}
						return true;
					}),
					eff = -1.5 * get.effect(target, { name: "draw" }, player, player);
				if (js.length) {
					eff += js.reduce((acc, i) => {
						let name = i.viewAs || i.name;
						return acc - 0.7 * get.effect(target, get.autoViewAs({ name }, [i]), target, player);
					}, 0);
				}
				return eff;
			});
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "thunder");
			}
			"step 4";
			if (cards.length == 1) {
				event._result = { bool: true, moved: [cards, []] };
				return;
			}
			var next = player.chooseToMove("整经：请分配整理出的经典", true);
			next.set("list", [["置于" + get.translation(target) + "的武将牌上", cards], ["自己获得"]]);
			next.set("filterMove", function (from, to, moved) {
				if (moved[0].length == 1 && to == 1 && from.link == moved[0][0]) {
					return false;
				}
				return true;
			});
			next.set("filterOk", function (moved) {
				return moved[0].length > 0;
			});
			next.set("processAI", function (list) {
				var cards = list[0][1].slice(0).sort(function (a, b) {
					return get.value(a) - get.value(b);
				});
				return [cards.splice(0, 1), cards];
			});
			"step 5";
			if (result.bool) {
				var cards = result.moved[0],
					gains = result.moved[1];
				target.addSkill("zhengjing2");
				target.addToExpansion(cards, "gain2").gaintag.add("zhengjing2");
				if (gains.length) {
					player.gain(gains, "gain2");
				}
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
			threaten: 3.2,
		},
	},
	//恁就是仲村由理？
	zhengjing2: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		charlotte: true,
		intro: { content: "expansion", markcount: "expansion" },
		sourceSkill: "zhengjing",
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		content() {
			"step 0";
			player.gain(player.getExpansions("zhengjing2"), "gain2");
			player.skip("phaseJudge");
			player.skip("phaseDraw");
			"step 1";
			player.removeSkill("zhengjing2");
		},
	},
	zhengjing3: {},
	//邓芝
	jimeng: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countGainableCards(player, "he") > 0;
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("jimeng"), function (card, player, target) {
					return target != player && target.countGainableCards(player, "he") > 0;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					if (player.hp > 1 && get.attitude(player, target) < 2) {
						return 0;
					}
					return get.effect(target, { name: "shunshou" }, player, player);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("jimeng", target);
				player.gainPlayerCard(target, "he", true);
			} else {
				event.finish();
			}
			"step 2";
			var hs = player.getCards("he");
			if (player.hp > 0 && hs.length) {
				if (hs.length <= player.hp) {
					event._result = { bool: true, cards: hs };
				} else {
					player.chooseCard(player.hp, true, "交给" + get.translation(target) + get.cnNumber(player.hp) + "张牌", "he", true);
				}
			} else {
				event.finish();
			}
			"step 3";
			player.give(result.cards, target);
		},
	},
	shuaiyan: {
		audio: 2,
		trigger: { player: "phaseDiscardBegin" },
		filter(event, player) {
			return player.countCards("h") > 1;
		},
		check(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("he") && lib.skill.shuaiyan.check2(current, player);
			});
		},
		check2(target, player) {
			if (get.itemtype(player) != "player") {
				player = _status.event.player;
			}
			return -get.attitude(player, target) / target.countCards("he");
		},
		content() {
			"step 0";
			player.showHandcards(get.translation(player) + "发动了【率言】");
			"step 1";
			var filter = function (card, player, target) {
				return player != target && target.countCards("he") > 0;
			};
			if (
				game.hasPlayer(function (current) {
					return filter("我约等于白板", player, current);
				})
			) {
				player.chooseTarget(true, filter, "选择一名其他角色，令其交给你一张牌").set("ai", lib.skill.shuaiyan.check2);
			} else {
				event.finish();
			}
			"step 2";
			var target = result.targets[0];
			event.target = target;
			player.line(target, "green");
			target.chooseCard("he", true, "交给" + get.translation(player) + "一张牌");
			"step 3";
			target.give(result.cards, player);
		},
	},
	relihuo: {
		audio: 2,
		group: ["relihuo_baigei", "relihuo_damage"],
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (event.card.name == "sha" && !game.hasNature(event.card)) {
				return true;
			}
		},
		check(event, player) {
			return false;
		},
		content() {
			game.setNature(trigger.card, "fire");
			trigger.relihuo = true;
		},
	},
	relihuo_damage: {
		trigger: { source: "damageBegin1" },
		forced: true,
		audio: "relihuo",
		sourceSkill: "relihuo",
		filter(event, player) {
			return event.getParent(2).relihuo == true && event.player.isLinked();
		},
		content() {
			trigger.num++;
		},
	},
	relihuo_baigei: {
		trigger: { player: "useCardAfter" },
		forced: true,
		audio: "relihuo",
		sourceSkill: "relihuo",
		filter(event, player) {
			if (event.card.name != "sha" || !game.hasNature(event.card, "fire")) {
				return false;
			}
			var num = 0;
			player.getHistory("sourceDamage", function (evt) {
				if (evt.card == event.card) {
					num += evt.num;
				}
			});
			return num > 1;
		},
		content() {
			var num = 0;
			player.getHistory("sourceDamage", function (evt) {
				if (evt.card == trigger.card) {
					num += evt.num;
				}
			});
			player.loseHp(Math.floor(num / 2));
		},
	},
	gongsun: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 1;
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt2("gongsun"),
				selectCard: 2,
				filterCard: lib.filter.cardDiscardable,
				filterTarget: lib.filter.notMe,
				position: "he",
				ai1(card) {
					var friend = 0,
						enemy = 0,
						player = _status.event.player;
					var num = game.countPlayer(function (target) {
						var att = get.attitude(player, target);
						if (att < 0) {
							enemy++;
						}
						if (target != player && att > 0) {
							friend++;
						}
						return true;
					});
					if (num > friend + enemy + 2) {
						return 0;
					}
					if (friend < enemy) {
						return 0;
					}
					if (card.name == "sha") {
						return 10 - enemy;
					}
					return 10 - enemy - get.value(card);
				},
				ai2(target) {
					return -get.attitude(_status.event.player, target) * (1 + target.countCards("h"));
				},
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("gongsun", target);
				player.discard(result.cards);
				player.addTempSkill("gongsun_shadow", { player: ["phaseBegin", "die"] });
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (get.type(name) == "trick") {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) == "basic") {
						list.push(["基本", "", name]);
					}
				}
				player.chooseButton(["请选择一个牌名", [list, "vcard"], true]).set("ai", function (button) {
					return button.link[2] == "sha" ? 1 : 0;
				});
			} else {
				event.finish();
			}
			"step 2";
			player.storage.gongsun_shadow.push([target, result.links[0][2]]);
			player.popup(result.links[0][2], "soil");
			game.log(player, "选择了", "" + get.translation(result.links[0][2]));
			player.markSkill("gongsun_shadow");
		},
	},
	gongsun_shadow: {
		global: "gongsun_shadow2",
		sourceSkill: "gongsun",
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = [];
			}
		},
		marktext: "损",
		onremove: true,
		intro: {
			content(shadow) {
				var str = "";
				for (var i = 0; i < shadow.length; i++) {
					if (i > 0) {
						str += "<br>";
					}
					str += get.translation(shadow[i][0]);
					str += "：";
					str += get.translation(shadow[i][1]);
				}
				return str;
			},
		},
		mod: {
			cardEnabled(card, player) {
				var list = player.storage.gongsun_shadow;
				for (var i = 0; i < list.length; i++) {
					if (list[i][1] == card.name) {
						return false;
					}
				}
			},
			cardRespondable(card, player) {
				var list = player.storage.gongsun_shadow;
				for (var i = 0; i < list.length; i++) {
					if (list[i][1] == card.name) {
						return false;
					}
				}
			},
			cardSavable(card, player) {
				var list = player.storage.gongsun_shadow;
				for (var i = 0; i < list.length; i++) {
					if (list[i][1] == card.name) {
						return false;
					}
				}
			},
			cardDiscardable(card, player) {
				var list = player.storage.gongsun_shadow;
				for (var i = 0; i < list.length; i++) {
					if (list[i][1] == card.name) {
						return false;
					}
				}
			},
		},
	},
	gongsun_shadow2: {
		mod: {
			cardEnabled(card, player) {
				if (
					game.hasPlayer(function (current) {
						var list = current.storage.gongsun_shadow;
						if (!list) {
							return false;
						}
						for (var i = 0; i < list.length; i++) {
							if (list[i][0] == player && list[i][1] == card.name) {
								return true;
							}
						}
						return false;
					})
				) {
					return false;
				}
			},
			cardSavable(card, player) {
				if (
					game.hasPlayer(function (current) {
						var list = current.storage.gongsun_shadow;
						if (!list) {
							return false;
						}
						for (var i = 0; i < list.length; i++) {
							if (list[i][0] == player && list[i][1] == card.name) {
								return true;
							}
						}
						return false;
					})
				) {
					return false;
				}
			},
			cardRespondable(card, player) {
				if (
					game.hasPlayer(function (current) {
						var list = current.storage.gongsun_shadow;
						if (!list) {
							return false;
						}
						for (var i = 0; i < list.length; i++) {
							if (list[i][0] == player && list[i][1] == card.name) {
								return true;
							}
						}
						return false;
					})
				) {
					return false;
				}
			},
			cardDiscardable(card, player) {
				if (
					game.hasPlayer(function (current) {
						var list = current.storage.gongsun_shadow;
						if (!list) {
							return false;
						}
						for (var i = 0; i < list.length; i++) {
							if (list[i][0] == player && list[i][1] == card.name) {
								return true;
							}
						}
						return false;
					})
				) {
					return false;
				}
			},
		},
	},
	duoduan: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		usable: 1,
		filter(event, player) {
			return event.card.name == "sha" && player.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard("he", get.prompt2(event.skill), lib.filter.cardRecastable)
				.set("ai", function (card) {
					if (_status.event.goon) {
						return 8 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					(function () {
						if (get.attitude(trigger.player, player) > 0) {
							return true;
						}
						if (!trigger.player.countCards("he")) {
							return true;
						}
						if (!player.hasShan()) {
							return true;
						}
						return event.getRand() < 0.5;
					})()
				)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.recast(event.cards);
			const bool =
				trigger.player.countCards("he", card => {
					return lib.filter.cardDiscardable(card, trigger.player, "duoduan");
				}) > 0;
			const result = bool
				? await player
						.chooseControl()
						.set("choiceList", [
							`令其摸两张牌，然后令${get.translation(trigger.card)}对你无效`,
							`令其弃置一张牌，然后你不可响应${get.translation(trigger.card)}`,
						])
						.set("prompt", `度断：令${get.translation(trigger.player)}执行一项`)
						.set("ai", function () {
							let player = _status.event.player;
							let source = _status.event.getTrigger().player;
							if (get.attitude(player, source) > 0) {
								return 0;
							}
							if (!player.hasShan() && player.hp >= 2) {
								return 1;
							}
							return 0;
						})
						.forResult()
				: {
						index: 0,
					};
			if (result.index == 0) {
				await trigger.player.draw(2);
				trigger.excluded.add(player);
			} else {
				const result2 = await trigger.player
					.chooseToDiscard("弃置一张牌令" + get.translation(player) + "不能闪避此【杀】", "he", true)
					.forResult();
				if (result2?.bool) {
					trigger.directHit.add(player);
				}
			}
		},
	},
	chengzhao: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			var num = 0;
			player.getHistory("gain", function (evt) {
				num += evt.cards.length;
			});
			if (num < 2) {
				return false;
			}
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return player != current && player.canCompare(current);
				})
			);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("chengzhao"), function (card, player, target) {
					return player.canCompare(target);
				})
				.set("ai", function (target) {
					return -get.attitude(_status.event.player, target) / target.countCards("h");
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("chengzhao", target);
				player.chooseToCompare(target);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var card = { name: "sha", isCard: true };
				if (player.canUse(card, target, false)) {
					player.useCard(card, target, false).card.chengzhao = true;
				}
			}
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (!arg || !arg.card || arg.card.chengzhao != true) {
					return false;
				}
			},
		},
	},
	rezhengrong: {
		trigger: { player: "useCardAfter" },
		audio: "drlt_zhenrong",
		filter(event, player) {
			if (!event.targets) {
				return false;
			}
			if (!event.isPhaseUsing(player)) {
				return false;
			}
			var bool = false;
			for (var i = 0; i < event.targets.length; i++) {
				if (event.targets[i] != player) {
					bool = true;
					break;
				}
			}
			if (!bool) {
				return false;
			}
			return (
				player
					.getAllHistory("useCard", function (evt) {
						if (!evt.isPhaseUsing(player)) {
							return false;
						}
						for (var i = 0; i < evt.targets.length; i++) {
							if (evt.targets[i] != player) {
								return true;
							}
						}
						return false;
					})
					.indexOf(event) %
					2 ==
					1 && game.hasPlayer(target => target != player && target.countCards("he") > 0)
			);
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt(event.skill),
					true,
					"将一名其他角色的随机一张牌置于你的武将牌上，称为「荣」",
					function (card, player, target) {
						return target != player && target.countCards("he") > 0;
					}
				)
				.set("ai", function (target) {
					return (1 - get.attitude(_status.event.player, target)) / target.countCards("he");
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const card = target.getCards("he").randomGet();
			player.addToExpansion(card, target, "give").gaintag.add("rezhengrong");
		},
		marktext: "荣",
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
	},
	rehongju: {
		trigger: { player: "phaseZhunbeiBegin" },
		audio: "drlt_hongju",
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		derivation: "reqingce",
		filter(event, player) {
			return player.getExpansions("rezhengrong").length >= 3 && game.dead.length > 0;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.draw(player.getExpansions("rezhengrong").length);
			"step 1";
			if (player.countCards("h") == 0) {
				event.goto(3);
			} else {
				var dialog = [
					"请选择要交换的手牌和「荣」，或点「取消」",
					'<div class="text center">「征荣」牌</div>',
					player.getExpansions("rezhengrong"),
					'<div class="text center">手牌区</div>',
					player.getCards("h"),
				];
				var next = player.chooseButton(dialog);
				next.set("filterButton", function (button) {
					var ss = _status.event.player.getExpansions("rezhengrong");
					var hs = _status.event.player.getCards("h");
					var sn = 0;
					var hn = 0;
					var ub = ui.selected.buttons;
					for (var i = 0; i < ub.length; i++) {
						if (ss.includes(ub[i].link)) {
							sn++;
						} else {
							hn++;
						}
					}
					return !((sn >= hs.length && ss.includes(button.link)) || (hn >= ss.length && hs.includes(button.link)));
				});
				next.set("selectButton", function () {
					if (ui.selected.buttons.length == 0) {
						return 2;
					}
					var ss = _status.event.player.getExpansions("rezhengrong");
					var hs = _status.event.player.getCards("h");
					var sn = 0;
					var hn = 0;
					var ub = ui.selected.buttons;
					for (var i = 0; i < ub.length; i++) {
						if (ss.includes(ub[i].link)) {
							sn++;
						} else {
							hn++;
						}
					}
					if (sn != hn) {
						return 2 * Math.max(sn, hn);
					} else {
						if (sn == ss.length || hn == hs.length || sn == hs.length || hn == ss.length) {
							return ub.length;
						}
						return [ub.length, ub.length + 1];
					}
				});
				next.set("ai", function () {
					return -1;
				});
			}
			"step 2";
			if (result.bool) {
				var gains = [];
				var pushs = [];
				var expansions = player.getExpansions("rezhengrong");
				for (var i = 0; i < result.links.length; i++) {
					var card = result.links[i];
					if (expansions.includes(card)) {
						gains.push(card);
					} else {
						pushs.push(card);
					}
				}
				player.addToExpansion(pushs, player, "give").gaintag.add("rezhengrong");
				player.gain(gains, "gain2");
			}
			"step 3";
			player.addSkills("reqingce");
			player.loseMaxHp();
		},
		ai: { combo: "rezhengrong" },
	},
	reqingce: {
		enable: "phaseUse",
		audio: "drlt_qingce",
		filter(event, player) {
			return player.getExpansions("rezhengrong").length > 0;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("请选择要移去的「荣」", player.getExpansions("rezhengrong"), "hidden");
			},
			backup(links, player) {
				return {
					card: links[0],
					filterCard() {
						return false;
					},
					selectCard: -1,
					filterTarget(card, player, target) {
						return target.countDiscardableCards(player, "ej") > 0;
					},
					delay: false,
					audio: "drlt_qingce",
					content: lib.skill.reqingce.contentx,
					ai: {
						result: {
							target(player, target) {
								var att = get.attitude(player, target);
								if (
									att > 0 &&
									(target.countCards("j") > 0 ||
										target.countCards("e", function (card) {
											return get.value(card, target) < 0;
										}))
								) {
									return 2;
								}
								if (att < 0 && target.countCards("e") > 0 && !target.hasSkillTag("noe")) {
									return -1;
								}
								return 0;
							},
						},
					},
				};
			},
			prompt(links, player) {
				return "弃置一名角色装备区或判定区内的一张牌";
			},
		},
		contentx() {
			"step 0";
			var card = lib.skill.reqingce_backup.card;
			player.loseToDiscardpile(card);
			"step 1";
			if (target.countDiscardableCards(player, "ej") > 0) {
				player.discardPlayerCard("ej", true, target);
			}
		},
		ai: {
			combo: "rezhengrong",
			order: 8,
			result: {
				player(player) {
					if (
						game.hasPlayer(function (current) {
							var att = get.attitude(player, current);
							if ((att > 0 && current.countCards("j") > 0) || (att < 0 && current.countCards("e") > 0)) {
								return true;
							}
							return false;
						})
					) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	fengji: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		forced: true,
		filter(event, player) {
			return typeof player.storage.fengji == "number" && player.countCards("h") >= player.storage.fengji;
		},
		content() {
			player.draw(3);
			player.addTempSkill("fengji3");
		},
		group: "fengji2",
		intro: {
			content: "上回合结束时的手牌数：#",
		},
	},
	fengji2: {
		trigger: { player: "phaseEnd" },
		silent: true,
		sourceSkill: "fengji",
		content() {
			player.storage.fengji = player.countCards("h");
			if (player.hasSkill("fengji")) {
				player.markSkill("fengji");
			}
		},
	},
	fengji3: {
		mod: {
			maxHandcardBase(player, num) {
				return player.maxHp;
			},
		},
	},
	zhouxuan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		//filterCard: true,
		//position: "he",
		filterTarget(card, player, target) {
			if (!["identity", "doudizhu"].includes(get.mode()) && target.isFriendOf(player)) {
				return false;
			}
			return target != player;
		},
		/*check(card) {
			return 6 - get.value(card);
		},*/
		content() {
			"step 0";
			player.addSkill("zhouxuan2");
			target.addTempSkill("zhouxuan_ai", { player: "phaseUseAfter" });
			player.storage.zhouxuan2 = {};
			player.storage.zhouxuan2.player = target;
			var list = [];
			var basic = [];
			for (var i = 0; i < lib.inpile.length; i++) {
				var name = lib.inpile[i];
				var type = get.type(name, "trick");
				if (type == "basic") {
					list.push(name);
					basic.push(name);
				} else {
					list.add(type);
				}
			}
			event.basic = basic;
			player
				.chooseControl(list)
				.set("prompt", "请选择一种基本牌的名称或非基本牌的类别")
				.set("ai", function () {
					var player = _status.event.player;
					var target = player.storage.zhouxuan2.player;
					var cards = target.getCards("h", function (card) {
						return target.hasUseTarget(card);
					});
					var map = {};
					for (var i = 0; i < cards.length; i++) {
						var type = get.type(cards[i], "trick");
						map[type == "basic" ? get.name(cards[i]) : type] = true;
					}
					if (map.equip) {
						return "equip";
					}
					if (map.trick) {
						return "trick";
					}
					if (map.sha) {
						return "sha";
					}
					if (map.tao) {
						return "tao";
					}
					return 0;
				});
			"step 1";
			player.storage.zhouxuan2.card = result.control;
			if (event.basic.includes(result.control)) {
				player.storage.zhouxuan2.isbasic = true;
			}
			player.markSkill("zhouxuan2");
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (get.attitude(player, target) > 0) {
						return (
							Math.max(1, target.hp) *
							target.countCards("h", function (card) {
								return target.getUseValue(card) > 0;
							})
						);
					}
					return 0;
				},
			},
		},
	},
	zhouxuan_ai: {
		mod: {
			aiOrder(player, card, num) {
				if (
					game.hasPlayer(function (current) {
						return (
							current.storage.zhouxuan2 &&
							current.storage.zhouxuan2.player == player &&
							get.attitude(player, current) > 0 &&
							(current.storage.zhouxuan2.isbasic ? card.name : get.type(card, "trick")) == current.storage.zhouxuan2.card
						);
					})
				) {
					return num + 10;
				}
			},
		},
	},
	zhouxuan2: {
		intro: {
			mark(player, storage) {
				return (
					get.translation(storage.player) +
					"使用或打出下一张牌时，若此牌为" +
					get.translation(storage.card) +
					(storage.isbasic ? "" : "牌") +
					"，你观看牌堆顶的三张牌并分配给任意角色"
				);
			},
		},
		audio: "zhouxuan",
		forced: true,
		charlotte: true,
		trigger: { global: ["useCard", "respond"] },
		sourceSkill: "zhouxuan",
		filter(event, player) {
			if (event.zhouxuanable) {
				return true;
			}
			if (player.storage.zhouxuan2) {
				var map = player.storage.zhouxuan2;
				if (map.player != event.player) {
					return false;
				}
				delete player.storage.zhouxuan2;
				player.unmarkSkill("zhouxuan2");
				if (map.card != (map.isbasic ? event.card.name : get.type(event.card, "trick"))) {
					return false;
				}
				event.zhouxuanable = true;
				return true;
			}
			return false;
		},
		logTarget: "player",
		content() {
			"step 0";
			event.cards = game.cardsGotoOrdering(get.cards(3)).cards;
			if (_status.connectMode) {
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			}
			event.given_map = {};
			"step 1";
			if (event.cards.length > 1) {
				player.chooseCardButton("周旋：请选择要分配的牌", true, event.cards, [1, event.cards.length]).set("ai", function (button) {
					if (ui.selected.buttons.length == 0) {
						return 1;
					}
					return 0;
				});
			} else if (event.cards.length == 1) {
				event._result = { links: event.cards.slice(0), bool: true };
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				event.cards.removeArray(result.links);
				event.togive = result.links.slice(0);
				player
					.chooseTarget("选择一名角色获得" + get.translation(result.links), true)
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (_status.event.enemy) {
							return -att;
						} else if (att > 0) {
							return att / (1 + target.countCards("h"));
						} else {
							return att / 100;
						}
					})
					.set("enemy", get.value(event.togive[0], player, "raw") < 0);
			}
			"step 3";
			if (result.targets.length) {
				var id = result.targets[0].playerid,
					map = event.given_map;
				if (!map[id]) {
					map[id] = [];
				}
				map[id].addArray(event.togive);
			}
			if (cards.length > 0) {
				event.goto(1);
			}
			"step 4";
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			var list = [];
			for (var i in event.given_map) {
				var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				list.push([source, event.given_map[i]]);
			}
			game.loseAsync({
				gain_list: list,
				giver: player,
				animate: "draw",
			}).setContent("gaincardMultiple");
		},
	},
	reshanxi: {
		audio: "shanxi",
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return (
				player.hp > 0 &&
				player.countCards("h", function (card) {
					if (_status.connectMode) {
						return true;
					}
					return get.color(card) == "red" && get.type(card) == "basic";
				}) > 0
			);
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				filterCard(card) {
					return get.color(card) == "red" && get.type(card) == "basic" && lib.filter.cardDiscardable.apply(this, arguments);
				},
				filterTarget(card, player, target) {
					return player != target && target.countCards("he") > 0;
				},
				prompt: get.prompt("reshanxi"),
				prompt2: "弃置一张红色基本牌并选择一名其他角色，将其的至多X张牌置于其武将牌上直到回合结束。（X为你的体力值）",
				ai1() {
					return -1;
				},
			});
			"step 1";
			if (result.bool) {
				event.target = result.targets[0];
				player.logSkill("reshanxi", event.target);
				player.discard(result.cards);
			} else {
				event.finish();
			}
			"step 2";
			var max = Math.min(player.hp, target.countCards("he"));
			if (max > 0 && target.isIn()) {
				player
					.choosePlayerCard("he", target, true, [1, max])
					.set("forceAuto", true)
					.set("prompt", "将" + get.translation(target) + "的至多" + get.cnNumber(max) + "张牌置于其武将牌上");
			} else {
				event.finish();
			}
			"step 3";
			target.addSkill("reshanxi2");
			target.addToExpansion(result.cards, "giveAuto", target).gaintag.add("reshanxi2");
		},
	},
	reshanxi2: {
		trigger: { global: "phaseEnd" },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "reshanxi",
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		content() {
			"step 0";
			var cards = player.getExpansions("reshanxi2");
			if (cards.length) {
				player.gain(cards, "draw");
			}
			"step 1";
			player.removeSkill("reshanxi2");
		},
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				var cards = player.getExpansions("reshanxi2");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
		},
	},
	reqizhou: {
		trigger: { player: ["equipEnd", "loseEnd"] },
		forced: true,
		popup: false,
		derivation: ["reyingzi", "qixi", "rexuanfeng"],
		filter(event, player) {
			if (player.equiping) {
				return false;
			}
			var suits = [];
			var es = player.getCards("e");
			for (var i = 0; i < es.length; i++) {
				suits.add(get.suit(es[i]));
			}
			if (suits.length > 3) {
				suits.length = 3;
			}
			if (player.additionalSkills.reqizhou) {
				return player.additionalSkills.reqizhou.length != suits.length;
			} else {
				return suits.length > 0;
			}
		},
		content() {
			lib.skill.reqizhou.init(player, "reqizhou");
		},
		init(player, skill) {
			var suits = [];
			var es = player.getCards("e");
			for (var i = 0; i < es.length; i++) {
				suits.add(get.suit(es[i]));
			}
			if (suits.length > 3) {
				suits.length = 3;
			}
			player.removeAdditionalSkill(skill);
			switch (suits.length) {
				case 1:
					player.addAdditionalSkill(skill, ["reyingzi"]);
					break;
				case 2:
					player.addAdditionalSkill(skill, ["reyingzi", "qixi"]);
					break;
				case 3:
					player.addAdditionalSkill(skill, ["reyingzi", "qixi", "rexuanfeng"]);
					break;
			}
		},
		ai: {
			threaten: 1.2,
		},
	},
	zhaohan: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.phaseNumber < 8;
		},
		check(event, player) {
			return player.phaseNumber < 3;
		},
		logAudio(event, player) {
			const num = player.phaseNumber < 5 ? 1 : 2;
			return `zhaohan${num}.mp3`;
		},
		async content(event, trigger, player) {
			if (player.phaseNumber < 5) {
				await player.gainMaxHp();
				await player.recover();
			} else {
				await player.loseMaxHp();
			}
		},
	},
	rangjie: {
		audio: 2,
		trigger: { player: "damageEnd" },
		getIndex(event) {
			return event.num;
		},
		async cost(event, trigger, player) {
			let choiceList = ["获得一张指定类型的牌"];
			if (player.canMoveCard()) {
				choiceList.push("移动场上的一张牌");
			}
			const result = await player
				.chooseControl("cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt(event.skill))
				.set("ai", function () {
					var player = _status.event.player;
					if (player.canMoveCard(true)) {
						return 1;
					}
					return 0;
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				cost_data: result.index,
			};
		},
		async content(event, trigger, player) {
			if (event.cost_data) {
				player.moveCard(true);
			} else {
				const result = await player
					.chooseControl("basic", "trick", "equip")
					.set("prompt", "选择获得一种类型的牌")
					.set("ai", function () {
						var player = _status.event.player;
						if (player.hp <= 3 && !player.countCards("h", { name: ["shan", "tao"] })) {
							return "basic";
						}
						if (player.countCards("he", { type: "equip" }) < 2) {
							return "equip";
						}
						return "trick";
					})
					.forResult();
				const card = get.cardPile(function (card) {
					return get.type(card, "trick") == result.control;
				});
				if (card) {
					await player.gain(card, "gain2", "log");
				}
			}
			await player.draw();
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						var num = 1;
						if (get.attitude(player, target) > 0) {
							if (player.needsToDiscard()) {
								num = 0.7;
							} else {
								num = 0.5;
							}
						}
						if (target.hp >= 4) {
							return [1, num * 2];
						}
						if (target.hp == 3) {
							return [1, num * 1.5];
						}
						if (target.hp == 2) {
							return [1, num * 0.5];
						}
					}
				},
			},
		},
	},
	yizheng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => get.info("yizheng").filterTarget(null, player, current));
		},
		filterTarget(card, player, current) {
			return current.hp <= player.hp && player.canCompare(current);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player.chooseToCompare(target).forResult();
			if (result?.bool) {
				target.skip("phaseDraw");
				target.addTempSkill(event.name + "_mark", { player: "phaseDrawSkipped" });
			} else {
				await player.loseMaxHp();
			}
		},
		ai: {
			order: 1,
			result: {
				player: (player, target) => {
					let hs = player.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					});
					if (!hs.length) {
						return 0;
					}
					let a = get.number(hs[0]),
						b = 4;
					if (player.getDamagedHp()) {
						b = 2;
					}
					return -b * (1 - Math.pow((a - 1) / 13, target.countCards("h")));
				},
				target: (player, target) => {
					if (target.skipList.includes("phaseDraw") || target.hasSkill("pingkou") || target.hasSkill("xinpingkou")) {
						return 0;
					}
					let hs = player.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					});
					if (!hs.length) {
						return 0;
					}
					return -Math.pow((get.number(hs[0]) - 1) / 13, target.countCards("h")) * 2;
				},
			},
		},
		subSkill: {
			mark: {
				charlotte: true,
				mark: true,
				intro: { content: "跳过下回合的摸牌阶段" },
			},
		},
	},
	rw_zhuge_skill: {
		equipSkill: true,
		audio: true,
		firstDo: true,
		trigger: { player: "useCard1" },
		forced: true,
		filter(event, player) {
			return !event.audioed && event.card.name == "sha" && player.countUsed("sha", true) > 1 && event.getParent().type == "phase";
		},
		content() {
			trigger.audioed = true;
		},
		mod: {
			cardUsable(card, player, num) {
				var cards = player.getEquips("rewrite_zhuge");
				if (card.name == "sha") {
					if (
						!cards.length ||
						player.hasSkill("rw_zhuge_skill", null, false) ||
						cards.some(card => card != _status.rw_zhuge_temp && !ui.selected.cards.includes(card))
					) {
						if (get.is.versus() || get.is.changban()) {
							return num + 3;
						}
						return Infinity;
					}
				}
			},
			cardEnabled2(card, player) {
				if (!_status.event.addCount_extra || player.hasSkill("rw_zhuge_skill", null, false)) {
					return;
				}
				var cards = player.getEquips("rewrite_zhuge");
				if (card && cards.includes(card)) {
					try {
						var cardz = get.card();
					} catch (e) {
						return;
					}
					if (!cardz || cardz.name != "sha") {
						return;
					}
					_status.rw_zhuge_temp = card;
					var bool = lib.filter.cardUsable(get.autoViewAs({ name: "sha" }, ui.selected.cards.concat([card])), player);
					delete _status.rw_zhuge_temp;
					if (!bool) {
						return false;
					}
				}
			},
		},
	},
	xinqingjian: {
		audio: "qingjian",
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		usable: 1,
		filter(event, player) {
			return event.getg(player).length && event.getParent("phaseDraw").player != player && player.countCards("h") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.name.slice(0, -5)), "h", [1, player.countCards("h")], "allowChooseAll")
				.set("ai", card => {
					if (!game.hasPlayer(target => player != target && get.attitude(player, target) > 0)) {
						return 0;
					}
					return 4 - get.value(card);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.addSkill("xinqingjian2");
			const next = player.addToExpansion(event.cards, "giveAuto", player);
			next.gaintag.add("xinqingjian2");
			await next;
		},
	},
	xinqingjian2: {
		audio: "xinqingjian",
		charlotte: true,
		trigger: { global: "phaseEnd" },
		forced: true,
		sourceSkill: "xinqingjian",
		filter(event, player) {
			return player.getExpansions("xinqingjian2").length > 0;
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		async content(event, trigger, player) {
			if (_status.connectMode) {
				game.broadcastAll(() => {
					_status.noclearcountdown = true;
				});
			}
			const given_map = {};
			event.given_map = given_map;
			const expansions = player.getExpansions("xinqingjian2");
			const goon = expansions.length > 1;
			let result;
			while (true) {
				if (expansions.length > 1) {
					result = await player
						.chooseCardButton("清俭：请选择要分配的牌", true, expansions, [1, expansions.length])
						.set("ai", button => {
							if (ui.selected.buttons.length) {
								return 0;
							}
							return get.value(button.link, get.player());
						})
						.forResult();
				} else if (expansions.length === 1) {
					result = { bool: true, links: expansions.slice(0) };
				} else {
					return;
				}
				if (!result.bool) {
					return;
				}
				const toGive = result.links;
				result = await player
					.chooseTarget(`选择一名其他角色获得${get.translation(toGive)}`, expansions.length === 1, lib.filter.notMe)
					.set("ai", target => {
						const att = get.attitude(get.player(), target);
						if (get.event().toEnemy) {
							return Math.max(0.01, 100 - att);
						} else if (att > 0) {
							return Math.max(
								0.1,
								att / Math.sqrt(1 + target.countCards("h") + (get.event().getParent().given_map[target.playerid] || 0))
							);
						} else {
							return Math.max(0.01, (100 + att) / 200);
						}
					})
					.set("toEnemy", get.value(toGive[0], player, "raw") < 0)
					.forResult();
				if (result.bool) {
					expansions.removeArray(toGive);
					if (result.targets.length) {
						const id = result.targets[0].playerid;
						if (!given_map[id]) {
							given_map[id] = [];
						}
						given_map[id].addArray(toGive);
					}
					if (!expansions.length) {
						break;
					}
				}
			}
			if (_status.connectMode) {
				game.broadcastAll(() => {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			const gain_list = [];
			for (const i in given_map) {
				const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				gain_list.push([source, given_map[i]]);
				game.log(source, "获得了", given_map[i]);
			}
			await game
				.loseAsync({
					gain_list,
					giver: player,
					animate: "gain2",
				})
				.setContent("gaincardMultiple");
			if (goon) {
				await player.draw();
			}
			player.removeSkill("xinqingjian2");
		},
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				var cards = player.getExpansions("xinqingjian2");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
		},
	},
	zhongzuo: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player.getHistory("damage").length > 0 || player.getHistory("sourceDamage").length > 0;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("zhongzuo"), "令一名角色摸两张牌。若其已受伤，则你摸一张牌。").set("ai", function (target) {
				if (target.hasSkillTag("nogain")) {
					return target.isDamaged() ? 0 : 1;
				}
				let att = get.attitude(_status.event.player, target);
				if (att <= 0) {
					return 0;
				}
				if (target.isDamaged()) {
					return 1 + att / 5;
				}
				return att / 5;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("zhongzuo", target);
				target.draw(2);
				if (target.isDamaged()) {
					player.draw();
				}
			}
		},
	},
	wanlan: {
		audio: 2,
		trigger: { global: "dying" },
		check(event, player) {
			if (get.attitude(player, event.player) < 4) {
				return false;
			}
			if (player.countCards("hs", card => player.canSaveCard(card, event.player)) >= 1 - event.player.hp) {
				return false;
			}
			if (event.player == player || event.player == get.zhu(player)) {
				return true;
			}
			if (_status.currentPhase && get.damageEffect(_status.currentPhase, player, player) < 0) {
				return false;
			}
			if (get.recoverEffect(event.player, player, player) <= 0) {
				return false;
			}
			return !player.hasUnknown();
		},
		limited: true,
		filter(event, player) {
			return event.player.hp <= 0;
		},
		skillAnimation: true,
		animationColor: "thunder",
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const hs = player.getCards("h");
			if (hs.length) {
				await player.modedDiscard(hs);
			}
			await trigger.player.recoverTo(1);
			if (_status.currentPhase?.isIn()) {
				player
					.when({ global: "dyingAfter" })
					.filter(evt => evt === trigger)
					.step(async () => await _status.currentPhase?.damage());
			}
		},
	},
	rezhiyi: {
		audio: "zhiyi",
		trigger: { global: "phaseJieshuBegin" },
		forced: true,
		filter(event, player) {
			return (
				player.getHistory("useCard", function (card) {
					return get.type(card.card) == "basic";
				}).length > 0 ||
				player.getHistory("respond", function (card) {
					return get.type(card.card) == "basic";
				}).length > 0
			);
		},
		content() {
			"step 0";
			var list = [];
			player.getHistory("useCard", function (evt) {
				if (get.type(evt.card) != "basic") {
					return;
				}
				var name = evt.card.name;
				if (name == "sha") {
					var nature = evt.card.nature;
					switch (nature) {
						case "fire":
							name = "huosha";
							break;
						case "thunder":
							name = "leisha";
							break;
						case "kami":
							name = "kamisha";
							break;
						case "ice":
							name = "icesha";
							break;
						case "stab":
							name = "cisha";
							break;
					}
				}
				list.add(name);
			});
			player.getHistory("respond", function (evt) {
				if (get.type(evt.card) != "basic") {
					return;
				}
				var name = evt.card.name;
				if (name == "sha") {
					var nature = evt.card.nature;
					switch (nature) {
						case "fire":
							name = "huosha";
							break;
						case "thunder":
							name = "leisha";
							break;
						case "kami":
							name = "kamisha";
							break;
						case "ice":
							name = "icesha";
							break;
						case "stab":
							name = "cisha";
							break;
					}
				}
				list.add(name);
			});
			player.chooseButton(
				[
					"执义：选择要使用的牌，或点取消摸一张牌",
					[
						list.map(function (name) {
							return ["基本", "", name];
						}),
						"vcard",
					],
				],
				function (button) {
					return _status.event.player.getUseValue({
						name: button.link[2],
						nature: button.link[3],
					});
				},
				function (button) {
					return _status.event.player.hasUseTarget({
						name: button.link[2],
						nature: button.link[3],
					});
				}
			);
			"step 1";
			if (!result.bool) {
				player.draw();
			} else {
				player.chooseUseTarget({ name: result.links[0][2], isCard: true, nature: result.links[0][3] }, true);
			}
		},
	},
	zhiyi: {
		audio: 2,
		trigger: { player: ["useCard", "respond"] },
		forced: true,
		filter(event, player) {
			if (get.type(event.card) != "basic") {
				return false;
			}
			var history = player
				.getHistory("useCard", function (evt) {
					return get.type(evt.card) == "basic";
				})
				.concat(
					player.getHistory("respond", function (evt) {
						return get.type(evt.card) == "basic";
					})
				);
			return history.length == 1 && history[0] == event;
		},
		content() {
			"step 0";
			var info = get.info(trigger.card);
			if (!info || !info.enable) {
				event._result = { index: 0 };
			} else {
				var evt = trigger;
				if (evt.respondTo && evt.getParent("useCard").name == "useCard") {
					evt = evt.getParent("useCard");
				}
				event.evt = evt;
				player
					.chooseControl()
					.set("prompt", "执义：请选择一项")
					.set("choiceList", [
						"摸一张牌",
						"于" +
							get.translation(evt.card) +
							"的使用结算结束之后视为使用一张" +
							get.translation({
								name: trigger.card.name,
								nature: trigger.card.nature,
								isCard: true,
							}),
					])
					.set("ai", function () {
						return _status.event.choice;
					})
					.set(
						"choice",
						(function () {
							var card = {
								name: trigger.card.name,
								nature: trigger.card.nature,
								isCard: true,
							};
							if (card.name == "sha") {
								if (player.getUseValue(card) > 0) {
									return 1;
								}
							} else if (card.name == "tao") {
								var hp = player.maxHp - player.hp;
								if (trigger.targets.includes(player)) {
									hp--;
								}
								return hp > 0 ? 1 : 0;
							}
							return 0;
						})()
					);
			}
			"step 1";
			if (result.index == 0) {
				player.draw();
			} else {
				var next = player.chooseUseTarget({ name: trigger.card.name, nature: trigger.card.nature, isCard: true }, false, true);
				_status.event.next.remove(next);
				event.evt.after.push(next);
				next.logSkill = "zhiyi";
			}
		},
	},
	//表演测试
	qiaosi_map: {
		charlotte: true,
		nopop: true,
	},
	qiaosi: {
		audio: 2,
		derivation: "qiaosi_map",
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				game.pause();
				game.countChoose();
				setTimeout(function () {
					_status.imchoosing = false;
					event._result = {
						bool: true,
						links: ["qiaosi_c1", "qiaosi_c6"].concat(["qiaosi_c2", "qiaosi_c3", "qiaosi_c4", "qiaosi_c5"].randomGets(1)),
					};
					if (event.dialog) {
						event.dialog.close();
					}
					if (event.controls) {
						for (var i of event.controls) {
							i.close();
						}
					}
					game.resume();
				}, 5000);
			};
			var createDialog = function (player, id) {
				if (player == game.me) {
					return;
				}
				var str = get.translation(player) + "正在表演...<br>";
				for (var i = 1; i < 7; i++) {
					str += get.translation("qiaosi_c" + i);
					if (i % 3 != 0) {
						str += "　　";
					}
					if (i == 3) {
						str += "<br>";
					}
				}
				ui.create.dialog(str, "forcebutton").videoId = id;
			};
			var chooseButton = function (player) {
				var event = _status.event;
				player = player || event.player;
				event.status = {
					qiaosi_c1: 0,
					qiaosi_c2: 0,
					qiaosi_c3: 0,
					qiaosi_c4: 0,
					qiaosi_c5: 0,
					qiaosi_c6: 0,
				};
				event.map = {
					qiaosi_c1: [40, 60],
					qiaosi_c2: [80, 120],
					qiaosi_c3: [90, 110],
					qiaosi_c4: [90, 110],
					qiaosi_c5: [80, 120],
					qiaosi_c6: [40, 60],
				};
				event.finishedx = [];
				event.str =
					'请开始你的表演<br><img src="' +
					lib.assetURL +
					'image/card/qiaosi_card1.png" width="60" height="60">qiaosi_c1% <img src="' +
					lib.assetURL +
					'image/card/qiaosi_card2.png" width="60" height="60">qiaosi_c2% <img src="' +
					lib.assetURL +
					'image/card/qiaosi_card3.png" width="60" height="60">qiaosi_c3%<br><img src="' +
					lib.assetURL +
					'image/card/qiaosi_card4.png" width="60" height="60">qiaosi_c4%<img src="' +
					lib.assetURL +
					'image/card/qiaosi_card5.png" width="60" height="60">qiaosi_c5% <img src="' +
					lib.assetURL +
					'image/card/qiaosi_card6.png" width="60" height="60">qiaosi_c6%';
				event.dialog = ui.create.dialog(event.str, "forcebutton", "hidden");
				event.dialog.addText(
					"<li>点击下方的按钮，可以增加按钮对应的角色的「表演完成度」。对于不同的角色，点击时增加的完成度不同，最终获得的牌也不同。一次表演最多只能完成3名角色的进度。",
					false
				);
				event.dialog.open();
				for (var i in event.status) {
					event.dialog.content.childNodes[0].innerHTML = event.dialog.content.childNodes[0].innerHTML.replace(i, event.status[i]);
				}
				for (var i = 0; i < event.dialog.buttons.length; i++) {
					event.dialog.buttons[i].classList.add("pointerdiv");
				}
				((event.switchToAuto = function () {
					event._result = {
						bool: true,
						links: event.finishedx.slice(0),
					};
					event.dialog.close();
					for (var i of event.controls) {
						i.close();
					}
					game.resume();
					_status.imchoosing = false;
				}),
					(event.controls = []));
				for (var i = 1; i <= 6; i++) {
					event.controls.push(
						ui.create.control("qiaosi_c" + i, function (link) {
							var event = _status.event;
							if (event.finishedx.includes(link)) {
								return;
							}
							event.status[link] += get.rand.apply(get, event.map[link]);
							if (event.status[link] >= 100) {
								event.status[link] = 100;
								var str = event.str.slice(0);
								for (var i in event.status) {
									str = str.replace(i, event.status[i]);
								}
								event.dialog.content.childNodes[0].innerHTML = str;
								event.finishedx.push(link);
								if (event.finishedx.length >= 3) {
									event._result = {
										bool: true,
										links: event.finishedx.slice(0),
									};
									event.dialog.close();
									for (var i of event.controls) {
										i.close();
									}
									game.resume();
									_status.imchoosing = false;
								}
							} else {
								var str = event.str.slice(0);
								for (var i in event.status) {
									str = str.replace(i, event.status[i]);
								}
								event.dialog.content.childNodes[0].innerHTML = str;
							}
						})
					);
				}
				for (var i = 0; i < event.dialog.buttons.length; i++) {
					event.dialog.buttons[i].classList.add("selectable");
				}
				game.pause();
				game.countChoose();
			};
			//event.switchToAuto=switchToAuto;
			game.broadcastAll(createDialog, player, event.videoId);
			if (event.isMine()) {
				chooseButton();
			} else if (event.isOnline()) {
				event.player.send(chooseButton, event.player);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			game.broadcastAll("closeDialog", event.videoId);
			var map = event.result || result;
			//game.print(map);
			if (!map || !map.bool || !map.links) {
				game.log(player, "表演失败");
				event.finish();
				return;
			}
			var list = map.links;
			if (!list.length) {
				game.log(player, "表演失败");
				event.finish();
				return;
			}
			var cards = [];
			var list2 = [];
			if (list.includes("qiaosi_c1")) {
				list2.push("trick");
				list2.push("trick");
			}
			if (list.includes("qiaosi_c2")) {
				if (list.includes("qiaosi_c1")) {
					list2.push(["sha", "jiu"]);
				} else {
					list2.push(Math.random() < 0.66 ? "equip" : ["sha", "jiu"]);
				}
			}
			if (list.includes("qiaosi_c3")) {
				list2.push([Math.random() < 0.66 ? "sha" : "jiu"]);
			}
			if (list.includes("qiaosi_c4")) {
				list2.push([Math.random() < 0.66 ? "shan" : "tao"]);
			}
			if (list.includes("qiaosi_c5")) {
				if (list.includes("qiaosi_c6")) {
					list2.push(["shan", "tao"]);
				} else {
					list2.push(Math.random() < 0.66 ? "trick" : ["shan", "tao"]);
				}
			}
			if (list.includes("qiaosi_c6")) {
				list2.push("equip");
				list2.push("equip");
			}
			while (list2.length) {
				var filter = list2.shift();
				var card = get.cardPile(function (x) {
					if (cards.includes(x)) {
						return false;
					}
					if (typeof filter == "string" && get.type(x, "trick") == filter) {
						return true;
					}
					if (typeof filter == "object" && filter.includes(x.name)) {
						return true;
					}
				});
				if (card) {
					cards.push(card);
				} else {
					var card = get.cardPile(function (x) {
						return !cards.includes(x);
					});
					if (card) {
						cards.push(card);
					}
				}
			}
			if (cards.length) {
				event.cards = cards;
				event.num = cards.length;
				player.showCards(cards);
			} else {
				event.finish();
			}
			"step 2";
			player.gain(event.cards, "gain2");
			"step 3";
			if (!player.countCards("he")) {
				event.finish();
			} else {
				player
					.chooseControl()
					.set("choiceList", ["将" + get.cnNumber(event.num) + "张牌交给一名其他角色", "弃置" + get.cnNumber(event.num) + "张牌"])
					.set("ai", function () {
						if (
							game.hasPlayer(function (current) {
								return current != player && get.attitude(player, current) > 2;
							})
						) {
							return 0;
						}
						return 1;
					});
			}
			"step 4";
			if (result.index == 0) {
				player.chooseCardTarget({
					position: "he",
					filterCard: true,
					selectCard: Math.min(event.num, player.countCards("he")),
					filterTarget(card, player, target) {
						return player != target;
					},
					ai1(card) {
						return 1;
					},
					ai2(target) {
						var att = get.attitude(_status.event.player, target);
						if (target.hasSkillTag("nogain")) {
							att /= 10;
						}
						if (target.hasJudge("lebu")) {
							att /= 5;
						}
						return att;
					},
					prompt: "选择" + get.cnNumber(event.num) + "张牌，交给一名其他角色。",
					forced: true,
				});
			} else {
				player.chooseToDiscard(event.num, true, "he");
				event.finish();
			}
			"step 5";
			if (result.bool) {
				var target = result.targets[0];
				player.give(result.cards, target);
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
			threaten: 3.2,
		},
	},
	refuhai: {
		audio: "xinfu_fuhai",
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			event.current = player.next;
			event.upper = [];
			event.lower = [];
			event.acted = [];
			event.num = 0;
			event.stopped = false;
			"step 1";
			event.acted.push(event.current);
			event.current.chooseControl("潮起", "潮落").set("prompt", "潮鸣起乎？潮鸣落乎？").ai = function () {
				return Math.random() < 0.5 ? 0 : 1;
			};
			"step 2";
			if (!event.chosen) {
				event.chosen = result.control;
			}
			if (event.chosen != result.control) {
				event.stopped = true;
			}
			if (!event.stopped) {
				event.num++;
			}
			if (result.control == "潮起") {
				event.upper.push(event.current);
			} else {
				event.lower.push(event.current);
			}
			event.current = event.current.next;
			if (event.current != player && !event.acted.includes(event.current)) {
				event.goto(1);
			}
			"step 3";
			for (var i = 0; i < event.acted.length; i++) {
				var bool = event.upper.includes(event.acted[i]);
				game.log(event.acted[i], "选择了", bool ? "#g潮起" : "#y潮落");
				event.acted[i].popup(bool ? "潮起" : "潮落", bool ? "wood" : "orange");
			}
			game.delay(1);
			"step 4";
			if (num > 1) {
				player.draw(num);
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
	},
	rebiaozhao: {
		audio: "biaozhao",
		// intro: {
		// 	content: "expansion",
		// 	markcount: "expansion",
		// },
		trigger: {
			player: "phaseJieshuBegin",
		},
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0 && !player.getExpansions("rebiaozhao").length;
		},
		content() {
			"step 0";
			player.chooseCard("he", get.prompt("rebiaozhao"), "将一张牌置于武将牌上作为“表”").ai = function (card) {
				return 6 - get.value(card);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("rebiaozhao");
				player.addToExpansion(player, result.cards).gaintag.add("rebiaozhao");
			}
		},
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				var content = player.getExpansions("rebiaozhao");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addAuto(content);
					} else {
						return "共有" + get.cnNumber(content.length) + "张表";
					}
				}
			},
			content(content, player) {
				var content = player.getExpansions("rebiaozhao");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						return get.translation(content);
					}
					return "共有" + get.cnNumber(content.length) + "张表";
				}
			},
		},
		ai: {
			notemp: true,
		},
		group: ["rebiaozhao2", "rebiaozhao3"],
	},
	rebiaozhao2: {
		trigger: {
			global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
		},
		forced: true,
		audio: "biaozhao",
		sourceSkill: "rebiaozhao",
		filter(event, player) {
			var cards = player.getExpansions("rebiaozhao"),
				cards2 = event.getd();
			if (!cards.length || !cards2.length) {
				return false;
			}
			var num = get.number(cards[0]);
			var cards = event.getd();
			for (var card of cards) {
				if (get.number(card) == num) {
					return true;
				}
			}
			return false;
		},
		content() {
			player.loseToDiscardpile(player.getExpansions("rebiaozhao"));
			player.loseHp();
		},
	},
	rebiaozhao3: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		forced: true,
		charlotte: true,
		audio: "biaozhao",
		sourceSkill: "rebiaozhao",
		filter(event, player) {
			return player.getExpansions("rebiaozhao").length > 0;
		},
		content() {
			"step 0";
			player.loseToDiscardpile(player.getExpansions("rebiaozhao"));
			"step 1";
			player.chooseTarget("令一名角色摸三张牌并回复1点体力", true).ai = function (target) {
				var num = 2;
				if (target.isDamaged()) {
					num++;
				}
				return num * get.attitude(_status.event.player, target);
			};
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.draw(3);
				target.recover();
			}
		},
	},
	reqianxin: {
		audio: "xinfu_qianxin",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard() {
			return [1, Math.min(2, game.players.length - 1)];
		},
		check(card) {
			return 6 - get.value(card);
		},
		discard: false,
		lose: false,
		delay: false,
		content() {
			var targets = game
				.filterPlayer(function (current) {
					return current != player;
				})
				.randomGets(cards.length);
			var map = [];
			for (var i = 0; i < targets.length; i++) {
				var target = targets[i];
				target.addSkill("reqianxin2");
				target.storage.reqianxin2.push([cards[i], player]);
				map.push([target, cards[i]]);
			}
			game.loseAsync({
				gain_list: map,
				player: player,
				cards: cards,
				giver: player,
				animate: "giveAuto",
			}).setContent("gaincardMultiple");
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	reqianxin2: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "reqianxin",
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = [];
			}
		},
		onremove: true,
		filter(event, player) {
			var list = player.storage.reqianxin2;
			if (Array.isArray(list)) {
				var hs = player.getCards("h");
				for (var i = 0; i < list.length; i++) {
					if (hs.includes(list[i][0]) && list[i][1].isIn()) {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			"step 0";
			var current = player.storage.reqianxin2.shift();
			event.source = current[1];
			if (!event.source.isIn() || !player.getCards("h").includes(current[0])) {
				event.goto(3);
			}
			"step 1";
			source.logSkill("reqianxin", player);
			player
				.chooseControl()
				.set("choiceList", ["令" + get.translation(source) + "摸两张牌", "令自己本回合的手牌上限-2"])
				.set("prompt", get.translation(source) + "发动了【遣信】，请选择一项")
				.set("source", source)
				.set("ai", function () {
					var player = _status.event.player;
					if (get.attitude(player, _status.event.source) > 0) {
						return 0;
					}
					if (player.maxHp - player.countCards("h") > 1) {
						return 1;
					}
					return Math.random() > 0.5 ? 0 : 1;
				});
			"step 2";
			if (result.index == 0) {
				source.draw(2);
			} else {
				player.addTempSkill("reqianxin3");
				player.addMark("reqianxin3", 2, false);
			}
			"step 3";
			if (player.storage.reqianxin2.length) {
				event.goto(0);
			} else {
				player.removeSkill("reqianxin2");
			}
		},
	},
	reqianxin3: {
		onremove: true,
		mod: {
			maxHandcard(player, num) {
				return num - player.countMark("reqianxin3");
			},
		},
	},
	renshi: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		forced: true,
		filter(event, player) {
			return player.isDamaged() && event.card && event.card.name == "sha";
		},
		content() {
			"step 0";
			trigger.cancel();
			if (trigger.cards) {
				var cards = trigger.cards.filterInD();
				if (cards.length) {
					player.gain(cards, "gain2", "log");
				}
			}
			"step 1";
			player.loseMaxHp();
		},
		ai: {
			halfneg: true,
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.card && arg.card.name == "sha") {
					return true;
				}
				return false;
			},
		},
	},
	wuyuan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", "sha") > 0;
		},
		filterCard: { name: "sha" },
		filterTarget: lib.filter.notMe,
		check(card) {
			var player = _status.event.player;
			if (
				get.color(card) == "red" &&
				game.hasPlayer(function (current) {
					return current != player && current.isDamaged() && get.attitude(player, current) > 2;
				})
			) {
				return 2;
			}
			if (get.natureList(card).length) {
				return 1.5;
			}
			return 1;
		},
		discard: false,
		lose: false,
		delay: false,
		content() {
			"step 0";
			player.give(cards, target, "give");
			player.recover();
			"step 1";
			var num = 1;
			if (get.natureList(cards[0]).length) {
				num++;
			}
			target.draw(num);
			if (get.color(cards[0]) == "red") {
				target.recover();
			}
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (player.isDamaged()) {
						return 1;
					}
					return 0;
				},
				target(player, target) {
					if (ui.selected.cards.length) {
						var num = 1;
						if (get.natureList(ui.selected.cards[0]).length) {
							num++;
						}
						if (target.hasSkillTag("nogain")) {
							num = 0;
						}
						if (get.color(ui.selected.cards[0]) == "red") {
							return num + 2;
						} else {
							return num + 1;
						}
					}
					return 1;
				},
			},
		},
	},
	huaizi: {
		mod: {
			maxHandcardBase(player, num) {
				return player.maxHp;
			},
		},
		//audio:2,
		//trigger:{player:'phaseDiscardBegin'},
		forced: true,
		firstDo: true,
		filter(event, player) {
			return player.isDamaged() && player.countCards("h") > player.hp;
		},
		content() {},
	},
	rexushen: {
		derivation: ["new_rewusheng", "redangxian"],
		audio: "xinfu_xushen",
		limited: true,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.hasSex("male");
			});
		},
		skillAnimation: true,
		animationColor: "fire",
		content() {
			player.addSkill("rexushen2");
			player.awakenSkill(event.name);
			player.loseHp(
				game.countPlayer(function (current) {
					return current.hasSex("male");
				})
			);
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					if (
						player.hp !=
						game.countPlayer(function (current) {
							return current.hasSex("male");
						})
					) {
						return 0;
					}
					return game.hasPlayer(function (current) {
						return get.attitude(player, current) > 4 && current.countCards("h", "tao");
					})
						? 1
						: 0;
				},
			},
		},
	},
	rexushen2: {
		charlotte: true,
		subSkill: {
			count: {
				trigger: {
					player: "recoverBegin",
				},
				forced: true,
				silent: true,
				popup: false,
				filter(event, player) {
					if (!event.source) {
						return false;
					}
					if (!player.isDying()) {
						return false;
					}
					var evt = event.getParent("dying").getParent(2);
					return evt.name == "rexushen" && evt.player == player;
				},
				content() {
					trigger.rexushen = true;
				},
				sub: true,
			},
		},
		group: ["rexushen2_count"],
		trigger: {
			player: "recoverAfter",
		},
		sourceSkill: "rexushen",
		filter(event, player) {
			if (player.isDying()) {
				return false;
			}
			return event.rexushen == true;
		},
		direct: true,
		silent: true,
		popup: false,
		content() {
			"step 0";
			player.removeSkill("rexushen2");
			player.chooseBool("是否令" + get.translation(trigger.source) + "获得技能〖武圣〗和〖当先〗").ai = function () {
				return get.attitude(player, trigger.source) > 0;
			};
			"step 1";
			if (result.bool) {
				player.line(trigger.source, "fire");
				trigger.source.addSkills(["new_rewusheng", "redangxian"]);
			}
		},
	},
	rezhennan: {
		audio: "xinfu_zhennan",
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.player != player && event.targets && event.targets.length && event.targets.length > event.player.hp;
		},
		direct: true,
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt("rezhennan", trigger.player), "弃置一张牌并对其造成1点伤害", "he");
			next.set("logSkill", ["rezhennan", trigger.player]);
			next.set("ai", function (card) {
				var player = _status.event.player;
				var target = _status.event.getTrigger().player;
				if (get.damageEffect(target, player, player) > 0) {
					return 7 - get.value(card);
				}
				return -1;
			});
			"step 1";
			if (result.bool) {
				trigger.player.damage();
			}
		},
	},
	meiyong: {
		inherit: "xinfu_wuniang",
		audio: "xinfu_wuniang",
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("meiyong"), "获得一名其他角色区域内的一张牌，然后其摸一张牌。", function (card, player, target) {
					if (player == target) {
						return false;
					}
					return target.countGainableCards(player, "hej") > 0;
				})
				.set("ai", function (target) {
					return 10 - get.attitude(_status.event.player, target);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("meiyong", target);
				player.gainPlayerCard(target, "hej", true);
			} else {
				event.finish();
			}
			"step 2";
			target.draw();
		},
	},
	relianji: {
		audio: "wylianji",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.players.length > 1;
		},
		filterTarget: lib.filter.notMe,
		targetprompt: ["打人", "被打"],
		selectTarget: 2,
		multitarget: true,
		content() {
			"step 0";
			game.delay(0.5);
			if (!targets[0].hasEquipableSlot(1)) {
				event.goto(2);
			}
			"step 1";
			let target = targets[0];
			let equip1 = get.cardPile2(card => card.name == "qinggang");
			if (!equip1 || Math.random() > 0.5) {
				equip1 = get.cardPile2(function (card) {
					return get.subtype(card) == "equip1" && target.canUse(card, target);
				}, "random");
			}
			if (equip1) {
				if (equip1.name == "qinggang" && !lib.inpile.includes("qibaodao")) {
					game.broadcastAll(function (card) {
						card.init([card.suit, card.number, "qibaodao"]);
					}, equip1);
				}
				target.$draw(equip1);
				target.chooseUseTarget(equip1, "noanimate", "nopopup", true);
			}
			"step 2";
			game.updateRoundNumber();
			var list = ["nanman", "wanjian", "huogong", "juedou", "sha"];
			var list2 = game.players.slice(0);
			for (var i = 0; i < list.length; i++) {
				if (!targets[0].canUse(list[i], targets[1], false)) {
					list.splice(i--, 1);
				}
			}
			if (!list.length) {
				return;
			}
			var name = list.randomGet();
			if (name == "nanman" || name == "wanjian") {
				for (var i = 0; i < list2.length; i++) {
					if (!targets[0].canUse(name, list2[i], false)) {
						list2.splice(i--, 1);
					}
				}
			} else {
				list2 = targets[1];
			}
			targets[0].useCard({ name: name, isCard: true }, list2, "noai");
			game.delay(0.5);
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (ui.selected.targets.length == 0) {
						return 1;
					} else {
						return -1;
					}
				},
			},
			expose: 0.4,
			threaten: 3,
		},
		group: "relianji_count",
		subSkill: {
			count: {
				sub: true,
				forced: true,
				popup: false,
				silent: true,
				trigger: { global: "damageEnd" },
				filter(event, player) {
					var evt = event.getParent(3);
					return evt && evt.name == "relianji" && evt.player == player;
				},
				content() {
					if (!player.storage.relianji) {
						player.storage.relianji = 0;
					}
					player.storage.relianji++;
					event.trigger("remoucheng_awaken");
				},
			},
		},
	},
	remoucheng: {
		derivation: "jingong",
		trigger: {
			player: "remoucheng_awaken",
		},
		forced: true,
		filter(event, player) {
			return player.storage.relianji && player.storage.relianji > 2;
		},
		audio: "moucheng",
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		content() {
			player.awakenSkill(event.name);
			player.changeSkills(["jingong"], ["relianji"]);
			player.gainMaxHp();
			player.recover();
		},
		ai: {
			combo: "relianji",
		},
	},
	shouye: {
		audio: 2,
		group: "shouye_after",
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			return event.player != player && event.targets.length == 1;
		},
		check(event, player) {
			if (event.player == game.me || event.player.isOnline()) {
				return get.attitude(player, event.player) < 0;
			}
			return get.effect(player, event.card, event.player, player) < 0;
		},
		usable: 1,
		logTarget: "player",
		content() {
			"step 0";
			player.line(trigger.player, "green");
			player.chooseToDuiben(trigger.player);
			"step 1";
			if (result.bool) {
				trigger.targets.remove(player);
				trigger.getParent().triggeredTargets2.remove(player);
				trigger.getParent().shouyeer = player;
			}
		},
		subSkill: {
			after: {
				sub: true,
				trigger: { global: "useCardAfter" },
				forced: true,
				silent: true,
				popup: false,
				filter(event, player) {
					if (event.shouyeer != player) {
						return false;
					}
					if (event.cards) {
						for (var i = 0; i < event.cards.length; i++) {
							if (event.cards[i].isInPile()) {
								return true;
							}
						}
					}
					return false;
				},
				content() {
					var list = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (trigger.cards[i].isInPile()) {
							list.push(trigger.cards[i]);
						}
					}
					player.gain(list, "gain2", "log");
				},
			},
		},
	},
	liezhi: {
		audio: 2,
		group: "liezhi_damage",
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("liezhi"), "弃置至多两名其他角色区域内的各一张牌", [1, 2], function (card, player, target) {
				return target != player && target.countDiscardableCards(player, "hej") > 0;
			}).ai = function (target) {
				var player = _status.event.player;
				return get.effect(target, { name: "guohe" }, player, player);
			};
			"step 1";
			if (result.bool) {
				result.targets.sortBySeat();
				event.targets = result.targets;
				player.line(result.targets, "green");
				player.logSkill("liezhi", result.targets);
			} else {
				event.finish();
			}
			"step 2";
			event.current = targets.shift();
			player.discardPlayerCard(event.current, "hej", true);
			if (targets.length) {
				event.redo();
			}
		},
		subSkill: {
			damage: {
				trigger: { player: "damage" },
				forced: true,
				silent: true,
				popup: false,
				content() {
					player.tempBanSkill("liezhi", { player: "phaseAfter" });
				},
			},
		},
	},
	xinzhanyi: {
		audio: "zhanyi",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		check(card) {
			var player = _status.event.player;
			if (player.hp < 3) {
				return 0;
			}
			var type = get.type(card, "trick");
			if (type == "trick") {
				return 6 - get.value(card);
			} else if (type == "equip") {
				if (
					player.hasSha() &&
					game.hasPlayer(function (current) {
						return (
							player.canUse("sha", current) &&
							get.attitude(player, current) < 0 &&
							get.effect(current, { name: "sha" }, player, player) > 0
						);
					})
				) {
					return 6 - get.value(card);
				}
			}
			return 0;
		},
		content() {
			player.loseHp();
			switch (get.type(cards[0], "trick", cards[0].original == "h" ? player : false)) {
				case "basic":
					player.addTempSkill("xinzhanyi_basic");
					player.addMark("xinzhanyi_basic1", 1, false);
					break;
				case "equip":
					player.addTempSkill("xinzhanyi_equip");
					break;
				case "trick":
					player.addTempSkill("xinzhanyi_trick");
					player.draw(3);
					break;
			}
		},
		ai: {
			order: 9.1,
			result: {
				player: 1,
			},
		},
	},
	xinzhanyi_basic1: {
		trigger: { player: "useCard" },
		sourceSkill: "xinzhanyi",
		filter(event, player) {
			return get.type(event.card, null, false) == "basic" && player.hasMark("xinzhanyi_basic1");
		},
		forced: true,
		silent: true,
		popup: false,
		content() {
			if (!trigger.baseDamage) {
				trigger.baseDamage = 1;
			}
			var num = player.countMark("xinzhanyi_basic1");
			trigger.baseDamage += num;
			player.removeMark("xinzhanyi_basic1", num, false);
			game.log(trigger.card, "的伤害值/回复值", "#y+" + num);
		},
	},
	xinzhanyi_basic: {
		group: ["xinzhanyi_basic1"],
		sourceSkill: "xinzhanyi",
		onremove(p, s) {
			delete p.storage[s + 1];
		},
		hiddenCard(player, name) {
			return get.type(name) == "basic" && player.countCards("h", { type: "basic" }) > 0;
		},
		enable: "chooseToUse",
		filter(event, player) {
			if (
				!player.hasCard(function (card) {
					return get.type(card) == "basic";
				}, "hs")
			) {
				return false;
			}
			for (var name of lib.inpile) {
				if (get.type(name) != "basic") {
					continue;
				}
				if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of lib.inpile) {
					if (get.type(name) != "basic") {
						continue;
					}
					if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["基本", "", name]);
					}
					if (name != "sha") {
						continue;
					}
					for (var j of lib.inpile_nature) {
						if (event.filterCard({ name: name, nature: j }, player, event)) {
							list.push(["基本", "", "sha", j]);
						}
					}
				}
				return ui.create.dialog("战意", [list, "vcard"], "hidden");
			},
			check(button) {
				var player = _status.event.player;
				var card = { name: button.link[2], nature: button.link[3] };
				if (
					game.hasPlayer(function (current) {
						return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
					})
				) {
					switch (button.link[2]) {
						case "tao":
							return 5;
						case "jiu": {
							if (player.countCards("hs", { type: "basic" }) >= 2) {
								return 3;
							}
							return 0;
						}
						case "sha":
							if (button.link[3] == "fire") {
								return 2.95;
							} else if (button.link[3] == "thunder" || button.link[3] == "ice") {
								return 2.92;
							} else {
								return 2.9;
							}
					}
				}
				return 0;
			},
			backup(links, player) {
				return {
					audio: "zhanyi",
					filterCard(card, player, target) {
						return get.type(card) == "basic";
					},
					check(card, player, target) {
						return 9 - get.value(card);
					},
					viewAs: { name: links[0][2], nature: links[0][3] },
					position: "hs",
					popname: true,
				};
			},
			prompt(links, player) {
				return "将一张基本牌当做" + get.translation(links[0][3] || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order() {
				var player = _status.event.player;
				var event = _status.event;
				if (
					event.filterCard({ name: "jiu" }, player, event) &&
					get.effect(player, { name: "jiu" }) > 0 &&
					player.countCards("hs", { type: "basic" }) >= 2
				) {
					return 3.3;
				}
				return 3.1;
			},
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (
					player.hasCard(function (card) {
						return get.type(card) == "basic";
					}, "hs")
				) {
					if (tag == "respondSha") {
						if (arg === "respond") {
							return false;
						}
					}
				} else {
					return false;
				}
			},
			result: {
				player: 1,
			},
		},
	},
	xinzhanyi_equip: {
		audio: "zhanyi",
		trigger: { player: "useCardToPlayered" },
		forced: true,
		sourceSkill: "xinzhanyi",
		filter(event, player) {
			return event.card.name == "sha" && event.target.countCards("he") > 0 && event.targets.length == 1;
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		content() {
			"step 0";
			trigger.target.chooseToDiscard("he", true, 2);
			"step 1";
			if (result.bool && result.cards && result.cards.length) {
				const cards = result.cards.filterInD("d");
				if (cards.length == 1) {
					event._result = { bool: true, links: result.cards.slice(0) };
				} else if (cards.length > 1) {
					player.chooseButton(["选择获得其中的一张牌", result.cards.slice(0)], true).set("ai", function (button) {
						return get.value(button.link);
					});
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.links) {
				player.gain(result.links, "gain2");
			}
		},
	},
	xinzhanyi_trick: {
		mod: {
			wuxieRespondable() {
				return false;
			},
		},
	},
	xinfu_daigong: {
		usable: 1,
		audio: 2,
		trigger: {
			player: "damageBegin4",
		},
		filter(event, player) {
			return event.source != undefined && player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.showHandcards();
			"step 1";
			var cards = player.getCards("h");
			var suits = [];
			for (var i = 0; i < cards.length; i++) {
				suits.add(get.suit(cards[i]));
			}
			trigger.source
				.chooseCard("he", "交给" + get.translation(player) + "一张满足条件的牌，否则防止此伤害。", function (card) {
					return !_status.event.suits.includes(get.suit(card));
				})
				.set("suits", suits).ai = function (card) {
				var player = _status.event.player;
				var target = _status.event.getParent("xinfu_daigong").player;
				if (get.damageEffect(target, player, player) > 0) {
					return 6.5 - get.value(card);
				}
				return 0;
			};
			"step 2";
			if (result.bool) {
				trigger.source.give(result.cards, player, true);
			} else {
				trigger.cancel();
			}
		},
	},
	xinfu_zhaoxin: {
		group: ["zhaoxin_give"],
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		filter(event, player) {
			return player.countCards("he") > 0 && player.getExpansions("xinfu_zhaoxin").length < 3;
		},
		filterCard: true,
		selectCard() {
			var player = _status.event.player;
			return [1, 3 - player.getExpansions("xinfu_zhaoxin").length];
		},
		position: "he",
		discard: false,
		lose: false,
		delay: false,
		allowChooseAll: true,
		content() {
			player.addToExpansion(player, "give", cards).gaintag.add("xinfu_zhaoxin");
			player.draw(cards.length);
		},
		check(card) {
			return 6 - get.value(card);
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	zhaoxin_give: {
		trigger: {
			global: "phaseDrawAfter",
		},
		filter(event, player) {
			if (!player.getExpansions("xinfu_zhaoxin").length) {
				return false;
			}
			return player == event.player || player.inRange(event.player);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseCardButton(get.prompt("xinfu_zhaoxin", trigger.player), player.getExpansions("xinfu_zhaoxin"), function (button) {
					return true;
				})
				.set("ai", function (button) {
					return 1 + Math.random();
				});
			"step 1";
			if (result.bool) {
				event.card = result.links[0];
				player.logSkill("xinfu_zhaoxin", target);
				player.line(trigger.player, "thunder");
				player.showCards(event.card);
			} else {
				event.finish();
			}
			"step 2";
			trigger.player.chooseBool("是否获得" + get.translation(event.card) + "?").ai = function () {
				return get.attitude(trigger.player, player) > 0;
			};
			"step 3";
			if (result.bool) {
				trigger.player.gain(event.card, "give", player, "bySelf");
				player.chooseBool("是否对" + get.translation(trigger.player) + "造成1点伤害？").ai = function () {
					return get.damageEffect(trigger.player, player, player) > 0;
				};
			} else {
				trigger.player.chat("拒绝");
				event.finish();
			}
			"step 4";
			if (result.bool) {
				trigger.player.damage("nocard");
			}
		},
	},
	xinfu_qianchong: {
		audio: 1,
		init(player, skill) {
			const es = player.getCards("e");
			if (es.length) {
				if (es.every(card => get.color(card) == "red")) {
					player.addAdditionalSkill(skill, "mingzhe");
				} else if (es.every(card => get.color(card) == "black")) {
					player.addAdditionalSkill(skill, "weimu");
				} else {
					player.removeAdditionalSkill(skill);
				}
			} else {
				player.removeAdditionalSkill(skill);
			}
		},
		onremove(player, skill) {
			player.removeAdditionalSkill(skill);
		},
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			if (["basic", "trick", "equip"].every(type => player.getStorage("xinfu_qianchong_effect").includes(type))) {
				return false;
			}
			const es = player.getCards("e");
			if (!es.length) {
				return true;
			}
			const col = get.color(es[0]);
			for (let i = 0; i < es.length; i++) {
				if (get.color(es[i]) != col) {
					return true;
				}
			}
			return false;
		},
		locked: true,
		async cost(event, trigger, player) {
			const list = ["basic", "trick", "equip", "cancel2"];
			list.removeArray(player.getStorage("xinfu_qianchong_effect"));
			const result = await player
				.chooseControl(list)
				.set("ai", () => {
					const player = get.player();
					const choices = get.event().controls.slice().remove("cancel2");
					return choices.includes("basic") ? "basic" : choices.includes("trick") ? "trick" : choices.randomGet();
				})
				.set("prompt", get.prompt(event.skill))
				.set("prompt2", "你可以选择一种类别的牌，然后你本回合内使用该类别的牌时没有次数和距离限制。")
				.forResult();
			event.result = {
				bool: result?.control != "cancel2",
				cost_data: result?.control,
			};
		},
		async content(event, trigger, player) {
			const { cost_data: type } = event;
			player.addTempSkill(event.name + "_effect");
			player.markAuto(event.name + "_effect", [type]);
			const str = get.translation(type) + "牌";
			game.log(player, "声明了", "#y" + str);
			player.popup(str, "thunder");
		},
		derivation: ["weimu", "mingzhe"],
		group: "xinfu_qianchong_change",
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "本回合内使用$牌没有次数和距离限制" },
				mod: {
					cardUsable(card, player) {
						const type = get.type2(card);
						if (player.getStorage("xinfu_qianchong_effect").includes(type)) {
							return Infinity;
						}
					},
					targetInRange(card, player) {
						const type = get.type2(card);
						if (player.getStorage("xinfu_qianchong_effect").includes(type)) {
							return true;
						}
					},
				},
			},
			change: {
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (event.name == "equip" && event.player == player) {
						return true;
					}
					return event.getl?.(player)?.es?.length;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const skill = "xinfu_qianchong";
					get.info(skill).init(player, skill);
				},
			},
		},
	},
	qc_weimu: { audio: true },
	qc_mingzhe: { audio: true },
	xinfu_shangjian: {
		audio: 2,
		getNum(player) {
			let num = 0;
			player.getHistory("lose", evt => {
				const evt2 = evt.relatedEvent || evt.getParent();
				if (evt2.name == "useCard" && evt2.player == player && get.type(evt2.card, null, false) == "equip") {
					return;
				}
				if (evt.cards2?.length) {
					num += evt.cards2.length;
				}
			});
			return num;
		},
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			const num = get.info("xinfu_shangjian").getNum(player);
			return num > 0 && num <= player.hp;
		},
		forced: true,
		async content(event, trigger, player) {
			const num = get.info(event.name).getNum(player);
			if (num > 0) {
				await player.draw(num);
			}
		},
	},
	rw_bagua_skill: {
		inherit: "bagua_skill",
		audio: true,
		content() {
			"step 0";
			player.judge("rewrite_bagua", function (card) {
				return get.suit(card) != "spade" ? 1.5 : -0.5;
			}).judge2 = function (result) {
				return result.bool;
			};
			"step 1";
			if (result.judge > 0) {
				trigger.untrigger();
				trigger.set("responded", true);
				trigger.result = { bool: true, card: { name: "shan" } };
			}
		},
	},
	rw_baiyin_skill: {
		inherit: "baiyin_skill",
		audio: true,
		subSkill: {
			lose: {
				audio: "rw_baiyin_skill",
				forced: true,
				charlotte: true,
				equipSkill: true,
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter: (event, player) => {
					return !player.hasSkillTag("unequip2");
				},
				getIndex(event, player) {
					const evt = event.getl(player);
					const lostCards = [];
					evt.es.forEach(card => {
						const VEquip = evt.vcard_map.get(card);
						if (VEquip.name === "rewrite_baiyin") {
							lostCards.add(VEquip);
						}
					});
					return lostCards.length;
				},
				async content(event, trigger, player) {
					await player.recover();
					await player.draw(2);
				},
			},
		},
	},
	rw_lanyinjia: {
		inherit: "lanyinjia",
		audio: "lanyinjia",
	},
	rw_minguangkai_cancel: {
		inherit: "minguangkai_cancel",
	},
	rw_minguangkai_link: {
		inherit: "minguangkai_link",
		trigger: {
			player: "linkBefore",
		},
		forced: true,
		filter(event, player) {
			return !player.isLinked();
		},
	},
	rw_renwang_skill: {
		inherit: "renwang_skill",
		audio: true,
		filter(event, player) {
			if (player.hasSkillTag("unequip2")) {
				return false;
			}
			if (
				event.player.hasSkillTag("unequip", false, {
					name: event.card ? event.card.name : null,
					target: player,
					card: event.card,
				})
			) {
				return false;
			}
			return event.card.name == "sha" && (get.suit(event.card) == "heart" || get.color(event.card) == "black");
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (typeof card !== "object" || target.hasSkillTag("unequip2")) {
						return;
					}
					if (
						player.hasSkillTag("unequip", false, {
							name: card ? card.name : null,
							target: player,
							card: card,
						}) ||
						player.hasSkillTag("unequip_ai", false, {
							name: card ? card.name : null,
							target: player,
							card: card,
						})
					) {
						return;
					}
					if (card.name == "sha" && ["spade", "club", "heart"].includes(get.suit(card))) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	rw_tengjia1: {
		inherit: "tengjia1",
		audio: true,
	},
	rw_tengjia2: {
		inherit: "tengjia2",
		audio: true,
	},
	rw_tengjia3: {
		audio: "rw_tengjia1",
		inherit: "rw_minguangkai_link",
	},
	rw_tengjia4: {
		inherit: "tengjia3",
		audio: "rw_tengjia1",
	},
	xinfu_pingcai: {
		subSkill: { backup: {} },
		wolong_card() {
			"step 0";
			var ingame = game.hasPlayer(function (current) {
				const translate = get.translation(current);
				return ["诸葛亮", "卧龙", "孔明", "诸葛孔明"].some(name => translate.includes(name));
			})
				? true
				: false;
			var prompt = "请选择";
			prompt += ingame ? "至多两名" : "一名";
			prompt += "角色，对其造成1点火焰伤害";
			var range = ingame ? [1, 2] : [1, 1];
			player.chooseTarget(prompt, range).set("ai", function (target) {
				var player = _status.event.player;
				return get.damageEffect(target, player, player, "fire");
			});
			"step 1";
			if (result.bool && result.targets.length) {
				player.line(result.targets, "fire");
				result.targets.sortBySeat();
				for (var i = 0; i < result.targets.length; i++) {
					result.targets[i].damage("fire");
				}
			}
		},
		fengchu_card() {
			"step 0";
			var ingame = game.hasPlayer(function (current) {
				const translate = get.translation(current);
				return ["庞统", "庞士元", "凤雏"].some(name => translate.includes(name));
			})
				? true
				: false;
			var prompt = "请选择";
			prompt += ingame ? "至多四名" : "至多三名";
			prompt += "要横置的角色";
			var range = ingame ? [1, 4] : [1, 3];
			player
				.chooseTarget(prompt, range, (card, player, target) => {
					return !target.isLinked();
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, { name: "tiesuo" }, player, player);
				});
			"step 1";
			if (result.bool && result.targets.length) {
				player.line(result.targets, "green");
				result.targets.sortBySeat();
				for (var i = 0; i < result.targets.length; i++) {
					result.targets[i].link();
				}
			}
		},
		xuanjian_card() {
			"step 0";
			event.ingame = game.hasPlayer(function (current) {
				const translate = get.translation(current);
				return ["徐庶", "徐元直", "单福"].some(name => translate.includes(name));
			})
				? true
				: false;
			var prompt = "请选择一名角色，令其回复1点体力并摸一张牌";
			prompt += event.ingame ? "，然后你摸一张牌。" : "。";
			player.chooseTarget(prompt).set("ai", function (target) {
				var player = _status.event.player;
				return get.attitude(player, target) * (target.isDamaged() ? 2 : 1);
			});
			"step 1";
			if (result.bool && result.targets.length) {
				var target = result.targets[0];
				player.line(target, "thunder");
				target.draw();
				target.recover();
				if (event.ingame) {
					player.draw();
				}
			}
		},
		shuijing_card() {
			"step 0";
			event.ingame = game.hasPlayer(function (current) {
				const translate = get.translation(current);
				return ["司马徽"].some(name => translate.includes(name));
			})
				? true
				: false;
			var prompt = "将一名角色装备区中的";
			prompt += event.ingame ? "一张牌" : "防具牌";
			prompt += "移动到另一名角色的装备区中";
			var next = player.chooseTarget(2, function (card, player, target) {
				if (ui.selected.targets.length) {
					if (!_status.event.ingame) {
						var cards = ui.selected.targets[0].getEquips(2);
						return cards.some(card => target.canEquip(card));
					}
					var from = ui.selected.targets[0];
					if (target.isMin()) {
						return false;
					}
					var es = from.getCards("e");
					for (var i = 0; i < es.length; i++) {
						if (target.canEquip(es[i])) {
							return true;
						}
					}
					return false;
				} else {
					if (!event.ingame) {
						if (target.getEquips(2).length) {
							return true;
						}
						return false;
					}
					return target.countCards("e") > 0;
				}
			});
			next.set("ingame", event.ingame);
			next.set("ai", function (target) {
				var player = _status.event.player;
				var att = get.attitude(player, target);
				if (ui.selected.targets.length == 0) {
					if (att < 0) {
						if (
							game.hasPlayer(function (current) {
								if (get.attitude(player, current) > 0) {
									var es = target.getCards("e");
									for (var i = 0; i < es.length; i++) {
										if (current.canEquip(es[i])) {
											return true;
										}
									}
									return false;
								}
							})
						) {
							return -att;
						}
					}
					return 0;
				}
				if (att > 0) {
					var es = ui.selected.targets[0].getCards("e");
					var i;
					for (i = 0; i < es.length; i++) {
						if (target.canEquip(es[i])) {
							break;
						}
					}
					if (i == es.length) {
						return 0;
					}
				}
				return -att * get.attitude(player, ui.selected.targets[0]);
			});
			next.set("multitarget", true);
			next.set("targetprompt", ["被移走", "移动目标"]);
			next.set("prompt", prompt);
			"step 1";
			if (result.bool) {
				player.line2(result.targets, "green");
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 2";
			game.delay();
			"step 3";
			if (targets.length == 2) {
				if (!event.ingame) {
					var cards = targets[0].getEquips(2);
					if (cards.length == 1) {
						event._result = {
							bool: true,
							links: cards,
						};
					} else {
						player
							.choosePlayerCard(
								"e",
								true,
								function (button) {
									return get.equipValue(button.link);
								},
								targets[0]
							)
							.set("targets0", targets[0])
							.set("targets1", targets[1])
							.set("filterButton", function (button) {
								if (!get.subtypes(button.link, false).includes("equip2")) {
									return false;
								}
								var targets1 = _status.event.targets1;
								return targets1.canEquip(button.link);
							});
					}
				} else {
					player
						.choosePlayerCard(
							"e",
							true,
							function (button) {
								return get.equipValue(button.link);
							},
							targets[0]
						)
						.set("targets0", targets[0])
						.set("targets1", targets[1])
						.set("filterButton", function (button) {
							var targets1 = _status.event.targets1;
							return targets1.canEquip(button.link);
						});
				}
			} else {
				event.finish();
			}
			"step 4";
			if (result.bool && result.links.length) {
				var link = result.links[0];
				if (get.position(link) == "e") {
					event.targets[1].equip(link);
				} else if (link.viewAs) {
					event.targets[1].addJudge({ name: link.viewAs }, [link]);
				} else {
					event.targets[1].addJudge(link);
				}
				event.targets[0].$give(link, event.targets[1], false);
				game.delay();
			}
		},
		audio: 5,
		enable: "phaseUse",
		usable: 1,
		prompt: "点击确定来选择要擦拭的宝物",
		chooseButton: {
			dialog() {
				var list = ["wolong", "fengchu", "xuanjian", "shuijing"];
				for (var i = 0; i < list.length; i++) {
					list[i] = ["", "", list[i] + "_card"];
				}
				return ui.create.dialog("评才", [list, "vcard"]);
			},
			check(button) {
				var name = button.link[2];
				var player = _status.event.player;
				if (name == "xuanjian_card") {
					if (
						game.hasPlayer(function (current) {
							return current.isDamaged() && current.hp < 3 && get.attitude(player, current) > 1;
						})
					) {
						return 1 + Math.random();
					} else {
						return 1;
					}
				} else if (name == "wolong_card") {
					if (
						game.hasPlayer(function (current) {
							return get.damageEffect(current, player, player, "fire") > 0;
						})
					) {
						return 1.2 + Math.random();
					} else {
						return 0.5;
					}
				} else {
					return 0.6;
				}
			},
			backup(links, player) {
				return {
					audio: "xinfu_pingcai1.mp3",
					filterCard: () => false,
					selectCard: -1,
					takara: links[0][2],
					content: lib.skill.xinfu_pingcai.contentx,
				};
			},
		},
		contentx() {
			"step 0";
			event.pingcai_delayed = true;
			var name = lib.skill.xinfu_pingcai_backup.takara;
			event.cardname = name;
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				game.pause();
				game.countChoose();
				event.timeout = setTimeout(function () {
					_status.imchoosing = false;
					event._result = {
						bool: true,
					};
					game.resume();
				}, 9000);
			};
			var createDialog = function (player, id, name) {
				if (player == game.me) {
					return;
				}
				var dialog = ui.create.dialog("forcebutton", "hidden");
				var str = get.translation(player) + "正在擦拭宝物上的灰尘…";
				var canSkip = !_status.connectMode;
				if (canSkip) {
					str += "<br>（点击宝物可以跳过等待AI操作）";
				}
				dialog.textPrompt = dialog.add('<div class="text center">' + str + "</div>");
				dialog.classList.add("fixed");
				dialog.classList.add("scroll1");
				dialog.classList.add("scroll2");
				dialog.classList.add("fullwidth");
				dialog.classList.add("fullheight");
				dialog.classList.add("noupdate");
				dialog.videoId = id;

				var canvas2 = document.createElement("canvas");
				dialog.canvas_viewer = canvas2;
				dialog.appendChild(canvas2);
				canvas2.classList.add("grayscale");
				canvas2.style.position = "absolute";
				canvas2.style.width = "249px";
				canvas2.style.height = "249px";
				canvas2.style["border-radius"] = "6px";
				canvas2.style.left = "calc(50% - 125px)";
				canvas2.style.top = "calc(50% - 125px)";
				canvas2.width = 249;
				canvas2.height = 249;
				canvas2.style.border = "3px solid";

				var ctx2 = canvas2.getContext("2d");
				var img = new Image();
				img.src = lib.assetURL + "image/card/" + name + ".png";
				img.onload = function () {
					ctx2.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas2.width, canvas2.height);
				};
				if (canSkip) {
					var skip = function () {
						if (event.pingcai_delayed) {
							delete event.pingcai_delayed;
							clearTimeout(event.timeout);
							event._result = {
								bool: true,
							};
							game.resume();
							canvas2.removeEventListener(lib.config.touchscreen ? "touchend" : "click", skip);
						}
					};
					canvas2.addEventListener(lib.config.touchscreen ? "touchend" : "click", skip);
				}
				dialog.open();
			};
			var chooseButton = function (id, name) {
				var event = _status.event;
				_status.xinfu_pingcai_finished = false;

				var dialog = ui.create.dialog("forcebutton", "hidden");
				dialog.textPrompt = dialog.add('<div class="text center">擦拭掉宝物上的灰尘吧！</div>');
				event.switchToAuto = function () {
					event._result = {
						bool: _status.xinfu_pingcai_finished,
					};
					game.resume();
					_status.imchoosing = false;
					_status.xinfu_pingcai_finished = true;
				};
				dialog.classList.add("fixed");
				dialog.classList.add("scroll1");
				dialog.classList.add("scroll2");
				dialog.classList.add("fullwidth");
				dialog.classList.add("fullheight");
				dialog.classList.add("noupdate");
				dialog.videoId = id;

				var canvas = document.createElement("canvas");
				var canvas2 = document.createElement("canvas");

				dialog.appendChild(canvas2);
				dialog.appendChild(canvas);

				canvas.style.position = "absolute";
				canvas.style.width = "249px";
				canvas.style.height = "249px";
				canvas.style["border-radius"] = "6px";
				canvas.style.left = "calc(50% - 125px)";
				canvas.style.top = "calc(50% - 125px)";
				canvas.width = 249;
				canvas.height = 249;
				canvas.style.border = "3px solid";

				canvas2.style.position = "absolute";
				canvas2.style.width = "249px";
				canvas2.style.height = "249px";
				canvas2.style["border-radius"] = "6px";
				canvas2.style.left = "calc(50% - 125px)";
				canvas2.style.top = "calc(50% - 125px)";
				canvas2.width = 249;
				canvas2.height = 249;
				canvas2.style.border = "3px solid";

				var ctx = canvas.getContext("2d");
				var ctx2 = canvas2.getContext("2d");

				var img = new Image();
				img.src = lib.assetURL + "image/card/" + name + ".png";
				img.onload = function () {
					ctx2.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas2.width, canvas2.height);
				};

				ctx.fillStyle = "lightgray";
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				canvas.onmousedown = function (ev) {
					//if(_status.xinfu_pingcai_finished) return;
					canvas.onmousemove = function (e) {
						if (_status.xinfu_pingcai_finished) {
							return;
						}
						ctx.beginPath();
						ctx.clearRect(e.offsetX - 16, e.offsetY - 16, 32, 32);
						var data = ctx.getImageData(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8).data;
						var sum = 0;
						for (var i = 3; i < data.length; i += 4) {
							if (data[i] == 0) {
								sum++;
							}
						}
						if (sum >= canvas.width * canvas.height * 0.6) {
							//ctx.clearRect(0,0,canvas.width,canvas.height);
							if (!_status.xinfu_pingcai_finished) {
								_status.xinfu_pingcai_finished = true;
								event.switchToAuto();
							}
						}
					};
				};
				canvas.ontouchstart = function (ev) {
					//if(_status.xinfu_pingcai_finished) return;
					canvas.ontouchmove = function (e) {
						if (_status.xinfu_pingcai_finished) {
							return;
						}
						ctx.beginPath();
						var rect = canvas.getBoundingClientRect();
						var X = ((e.touches[0].clientX - rect.left) / rect.width) * canvas.width;
						var Y = ((e.touches[0].clientY - rect.top) / rect.height) * canvas.height;
						ctx.clearRect(X - 16, Y - 16, 32, 32);
						var data = ctx.getImageData(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8).data;
						var sum = 0;
						for (var i = 3; i < data.length; i += 4) {
							if (data[i] == 0) {
								sum++;
							}
						}
						if (sum >= canvas.width * canvas.height * 0.6) {
							if (!_status.xinfu_pingcai_finished) {
								_status.xinfu_pingcai_finished = true;
								event.switchToAuto();
							}
						}
					};
				};
				canvas.onmouseup = function (ev) {
					canvas.onmousemove = null;
				};
				canvas.ontouchend = function (ev) {
					canvas.ontouchmove = null;
				};

				dialog.open();

				game.pause();
				game.countChoose();
			};
			//event.switchToAuto=switchToAuto;
			game.broadcastAll(createDialog, player, event.videoId, name);
			if (event.isMine()) {
				chooseButton(event.videoId, name);
			} else if (event.isOnline()) {
				event.player.send(chooseButton, event.videoId, name);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			var result = event.result || result;
			if (!result) {
				result = { bool: false };
			}
			event._result = result;
			game.broadcastAll(
				function (id, result, player) {
					_status.xinfu_pingcai_finished = true;
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.textPrompt.innerHTML =
							'<div class="text center">' + (get.translation(player) + "擦拭宝物" + (result.bool ? "成功！" : "失败…")) + "</div>";
						if (result.bool && dialog.canvas_viewer) {
							dialog.canvas_viewer.classList.remove("grayscale");
						}
					}
					if (!_status.connectMode) {
						delete event.pingcai_delayed;
					}
				},
				event.videoId,
				result,
				player
			);
			game.delay(2.5);
			"step 2";
			game.broadcastAll("closeDialog", event.videoId);
			if (result.bool) {
				player.logSkill("pcaudio_" + event.cardname);
				event.insert(lib.skill.xinfu_pingcai[event.cardname], {
					player: player,
				});
			}
		},
		ai: {
			order: 7,
			fireAttack: true,
			threaten: 1.7,
			result: {
				player: 1,
			},
		},
	},
	xinfu_pdgyingshi: {
		mod: {
			targetEnabled(card, player, target) {
				if (get.type(card) == "delay") {
					return false;
				}
			},
		},
		trigger: {
			player: ["phaseZhunbeiBefore", "phaseJieshuBefore"],
		},
		forced: true,
		group: "xinfu_pdgyingshi2",
		content() {
			trigger.cancel();
			game.log(player, "跳过了", event.triggername == "phaseZhunbeiBefore" ? "准备阶段" : "结束阶段");
		},
	},
	xinfu_pdgyingshi2: {
		popup: false,
		trigger: {
			player: "phaseJudgeBefore",
		},
		forced: true,
		sourceSkill: "xinfu_pdgyingshi",
		content() {
			trigger.cancel();
			game.log(player, "跳过了判定阶段");
		},
	},
	pcaudio_wolong_card: {
		audio: "xinfu_pingcai2.mp3",
	},
	pcaudio_fengchu_card: {
		audio: "xinfu_pingcai3.mp3",
	},
	pcaudio_shuijing_card: {
		audio: "xinfu_pingcai4.mp3",
	},
	pcaudio_xuanjian_card: {
		audio: "xinfu_pingcai5.mp3",
	},
	yizan_use: {
		audio: "yizan_respond_shan",
		intro: {
			content: "已发动过#次",
		},
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (get.type(name) != "basic") {
				return false;
			}
			if (!player.storage.yizan && player.countCards("hes") < 2) {
				return false;
			}
			return player.hasCard(function (card) {
				return get.type(card) == "basic";
			}, "hs");
		},
		filter(event, player) {
			if (!player.storage.yizan && player.countCards("hes") < 2) {
				return false;
			}
			if (
				!player.hasCard(function (card) {
					return get.type(card) == "basic";
				}, "hs")
			) {
				return false;
			}
			for (var name of lib.inpile) {
				if (get.type(name) != "basic") {
					continue;
				}
				if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
					return true;
				}
				if (name == "sha") {
					for (var nature of lib.inpile_nature) {
						if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of lib.inpile) {
					if (get.type(name) != "basic") {
						continue;
					}
					if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["基本", "", name]);
					}
					if (name == "sha") {
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
								list.push(["基本", "", "sha", nature]);
							}
						}
					}
				}
				return ui.create.dialog("翊赞", [list, "vcard"], "hidden");
			},
			check(button) {
				var player = _status.event.player;
				var card = { name: button.link[2], nature: button.link[3] };
				if (
					_status.event.getParent().type != "phase" ||
					game.hasPlayer(function (current) {
						return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
					})
				) {
					switch (button.link[2]) {
						case "tao":
						case "shan":
							return 5;
						case "jiu": {
							if (player.storage.yizan && player.countCards("hs", { type: "basic" }) > 2) {
								return 3;
							}
							return 0;
						}
						case "sha":
							if (button.link[3] == "fire") {
								return 2.95;
							} else if (button.link[3] == "thunder" || button.link[3] == "ice") {
								return 2.92;
							} else {
								return 2.9;
							}
					}
				}
				return 0;
			},
			backup(links, player) {
				return {
					audio: "yizan_respond_shan",
					filterCard(card, player, target) {
						if (player.storage.yizan) {
							return get.type(card) == "basic";
						} else if (ui.selected.cards.length) {
							if (get.type(ui.selected.cards[0]) == "basic") {
								return true;
							}
							return get.type(card) == "basic";
						}
						return true;
					},
					complexCard: true,
					selectCard() {
						var player = _status.event.player;
						if (player.storage.yizan) {
							return 1;
						}
						return 2;
					},
					check(card, player, target) {
						if (!ui.selected.cards.length && get.type(card) == "basic") {
							return 6;
						} else {
							return 6 - get.value(card);
						}
					},
					viewAs: { name: links[0][2], nature: links[0][3] },
					position: "hes",
					popname: true,
					precontent() {
						player.addMark("yizan_use", 1, false);
					},
				};
			},
			prompt(links, player) {
				var str = player.storage.yizan ? "一张基本牌" : "两张牌(其中至少应有一张基本牌)";
				return "将" + str + "当做" + get.translation(links[0][3] || "") + get.translation(links[0][2]) + "使用或打出";
			},
		},
		ai: {
			order() {
				var player = _status.event.player;
				var event = _status.event;
				if (
					event.filterCard({ name: "jiu" }, player, event) &&
					get.effect(player, { name: "jiu" }) > 0 &&
					player.storage.yizan &&
					player.countCards("hs", { type: "basic" }) > 2
				) {
					return 3.3;
				}
				return 3.1;
			},
			skillTagFilter(player, tag, arg) {
				if (tag == "fireAttack") {
					return true;
				}
				if (!player.storage.yizan && player.countCards("hes") < 2) {
					return false;
				}
				if (
					!player.hasCard(function (card) {
						return get.type(card) == "basic";
					}, "hes")
				) {
					return false;
				}
			},
			result: {
				player: 1,
			},
			respondSha: true,
			respondShan: true,
			fireAttack: true,
		},
	},
	yizan_respond_shan: {
		audio: 2,
	},
	xinfu_longyuan: {
		audio: 2,
		forced: true,
		juexingji: true,
		trigger: { player: "phaseZhunbeiBegin" },
		skillAnimation: true,
		animationColor: "orange",
		filter(event, player) {
			return player.countMark("yizan_use") >= 3;
		},
		content() {
			player.awakenSkill(event.name);
			player.storage.yizan = true;
		},
		derivation: "yizan_rewrite",
		ai: { combo: "yizan_use" },
	},
	xinfu_jingxie: {
		audio: 2,
		video(player, info) {
			var l2 = player.getCards(info[0] ? "e" : "h"),
				l1 = info[1];
			for (var j = 0; j < l2.length; j++) {
				if (l2[j].suit == l1[0] && l2[j].number == l1[1] && l2[j].name == l1[2]) {
					l2[j].init([l2[j].suit, l2[j].number, "rewrite_" + l2[j].name]);
					break;
				}
			}
		},
		position: "he",
		enable: "phaseUse",
		filter(event, player) {
			var he = player.getCards("he");
			for (var i = 0; i < he.length; i++) {
				if (["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].includes(he[i].name)) {
					return true;
				}
			}
			return false;
		},
		filterCard(card) {
			return ["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].includes(card.name);
		},
		discard: false,
		lose: false,
		delay: false,
		check() {
			return 1;
		},
		content() {
			"step 0";
			player.showCards(cards);
			"step 1";
			var card = cards[0];
			var bool = get.position(card) == "e";
			if (bool) {
				player.removeEquipTrigger(card.card || card);
			}
			game.addVideo("skill", player, ["xinfu_jingxie", [bool, get.cardInfo(card)]]);
			game.broadcastAll(
				function (card, bool, player) {
					card.init([card.suit, card.number, "rewrite_" + card.name]);
					let vcard = card[card.cardSymbol];
					if (bool && vcard && player.vcardsMap?.equips) {
						const cardx = get.autoViewAs(card, void 0, false);
						player.vcardsMap.equips[player.vcardsMap.equips.indexOf(vcard)] = cardx;
						card[card.cardSymbol] = cardx;
					}
				},
				card,
				bool,
				player
			);
			if (bool) {
				player.addEquipTrigger(card.card || card);
			}
		},
		ai: {
			basic: {
				order: 10,
			},
			result: {
				player: 1,
			},
		},
		group: ["xinfu_jingxie_recast"],
		subSkill: {
			recast: {
				audio: "xinfu_jingxie",
				enable: "chooseToUse",
				filterCard: (card, player) => get.subtype(card) == "equip2" && player.canRecast(card),
				filter: (event, player) => {
					if (event.type != "dying") {
						return false;
					}
					if (player != event.dying) {
						return false;
					}
					return player.hasCard(card => lib.skill.xinfu_jingxie.subSkill.recast.filterCard(card, player), "he");
				},
				position: "he",
				discard: false,
				lose: false,
				delay: false,
				prompt: "重铸一张防具牌，然后将体力回复至1点。",
				content() {
					"step 0";
					player.recast(cards);
					"step 1";
					var num = 1 - player.hp;
					if (num) {
						player.recover(num);
					}
				},
				ai: {
					order: 0.5,
					skillTagFilter(player, arg, target) {
						if (player != target) {
							return false;
						}
						return player.hasCard(
							card => (_status.connectMode && get.position(card) == "h") || (get.subtype(card) == "equip2" && player.canRecast(card)),
							"he"
						);
					},
					save: true,
					result: {
						player(player) {
							return 10;
						},
					},
				},
			},
		},
	},
	zhaohuo: {
		audio: 2,
		audioname: ["re_taoqian"],
		trigger: { global: "dying" },
		forced: true,
		//priority:12,
		filter(event, player) {
			return event.player != player && player.maxHp > 1;
		},
		content() {
			"step 0";
			event.num = player.maxHp - 1;
			player.loseMaxHp(event.num, true);
			"step 1";
			player.draw(event.num);
		},
		ai: {
			neg: true,
		},
	},
	yixiang: {
		audio: 2,
		audioname: ["re_taoqian"],
		trigger: { target: "useCardToTargeted" },
		frequent: true,
		filter(event, player) {
			if (event.player.hp <= player.hp) {
				return false;
			}
			//if(event.targets.length>1) return false;
			var hs = player.getCards("h");
			var names = ["sha", "shan", "tao", "jiu", "du"];
			for (var i = 0; i < hs.length; i++) {
				names.remove(hs[i].name);
			}
			if (!names.length) {
				return false;
			}
			for (var i = 0; i < ui.cardPile.childElementCount; i++) {
				if (names.includes(ui.cardPile.childNodes[i].name)) {
					return true;
				}
			}
			return false;
		},
		usable: 1,
		content() {
			var hs = player.getCards("h");
			var list = [];
			var names = ["sha", "shan", "tao", "jiu", "du"];
			for (var i = 0; i < hs.length; i++) {
				names.remove(hs[i].name);
			}
			for (var i = 0; i < ui.cardPile.childElementCount; i++) {
				if (names.includes(ui.cardPile.childNodes[i].name)) {
					list.push(ui.cardPile.childNodes[i]);
				}
			}
			if (list.length) {
				player.gain(list.randomGet(), "draw");
			}
		},
	},
	yirang: {
		audio: 2,
		audioname: ["re_taoqian"],
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			if (
				!player.countCards("he", function (card) {
					return get.type(card) != "basic";
				})
			) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current.maxHp > player.maxHp;
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("yirang"), function (card, player, target) {
					return target.maxHp > player.maxHp;
				})
				.set("ai", function (target) {
					return (get.attitude(_status.event.player, target) - 2) * target.maxHp;
				});
			"step 1";
			if (result.bool) {
				var cards = player.getCards("he", function (card) {
					return get.type(card) != "basic";
				});
				var target = result.targets[0];
				var types = [];
				for (var i = 0; i < cards.length; i++) {
					types.add(get.type(cards[i], "trick"));
				}
				player.logSkill("yirang", target);
				player.give(cards, target);
				player.gainMaxHp(target.maxHp - player.maxHp, true);
				player.recover(types.length);
				game.delay();
			}
		},
	},
	kuangcai: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return !event.player.isMad();
		},
		content() {
			game.broadcastAll(function (player) {
				if (!player.forceCountChoose) {
					player.forceCountChoose = {};
				}
				player.forceCountChoose.phaseUse = 5;
			}, player);
			player.addSkill("kuangcai_use");
			player.addSkill("kuangcai_cancel");
			//ui.auto.hide();
		},
		subSkill: {
			use: {
				mod: {
					cardUsable(card) {
						if (get.info(card) && get.info(card).forceUsable) {
							return;
						}
						return Infinity;
					},
					targetInRange() {
						return true;
					},
					aiOrder(player, card, num) {
						var name = get.name(card);
						if (name == "tao") {
							return num + 7 + Math.pow(player.getDamagedHp(), 2);
						}
						if (name == "sha") {
							return num + 6;
						}
						if (get.subtype(card) == "equip2") {
							return num + get.value(card) / 3;
						}
					},
				},
				trigger: { player: "useCard" },
				forced: true,
				charlotte: true,
				silent: true,
				popup: false,
				filter(event, player) {
					if (!player.forceCountChoose || !player.forceCountChoose.phaseUse) {
						return false;
					}
					return true;
				},
				content() {
					player.draw();
					if (player.forceCountChoose.phaseUse == 1) {
						var evt = event.getParent("phaseUse");
						if (evt) {
							evt.skipped = true;
						}
					} else {
						game.broadcastAll(function (player) {
							player.forceCountChoose.phaseUse--;
						}, player);
					}
				},
			},
			cancel: {
				trigger: { player: "phaseUseEnd" },
				firstDo: true,
				silent: true,
				charlotte: true,
				content() {
					game.broadcastAll(function (player) {
						delete player.forceCountChoose;
					}, player);
					//ui.auto.show();
					player.removeSkill("kuangcai_use");
					player.removeSkill("kuangcai_cancel");
				},
			},
		},
		ai: {
			threaten: 4.5,
		},
	},
	shejian: {
		audio: 2,
		trigger: { player: "phaseDiscardEnd" },
		direct: true,
		filter(event, player) {
			var cards = [];
			player.getHistory("lose", function (evt) {
				if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
					cards.addArray(evt.cards2);
				}
			});
			if (cards) {
				if (cards.length < 2) {
					return false;
				}
				var suits = [];
				for (var i = 0; i < cards.length; i++) {
					var suit = get.suit(cards[i]);
					if (suits.includes(suit)) {
						return false;
					} else {
						suits.push(suit);
					}
				}
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("shejian"), "弃置一名其他角色的一张牌", function (card, player, target) {
				if (player == target) {
					return false;
				}
				return target.countDiscardableCards(player, "he") > 0;
			}).ai = function (target) {
				return -get.attitude(player, target);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("shejian", result.targets);
				player.discardPlayerCard(result.targets[0], "he", true);
			} else {
				event.finish();
			}
		},
	},
	shixin: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		filter(event) {
			return event.hasNature("fire");
		},
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			nofire: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "fireDamage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	fenyin: {
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object" && player == _status.currentPhase) {
					var evt = player.getLastUsed();
					if (evt && evt.card && get.color(evt.card) != "none" && get.color(card) != "none" && get.color(evt.card) != get.color(card)) {
						return num + 10;
					}
				}
			},
		},
		audio: 2,
		trigger: { player: "useCard" },
		frequent: true,
		//usable:3,
		filter(event, player) {
			if (_status.currentPhase != player) {
				return false;
			}
			var color2 = get.color(event.card);
			player.addTip("fenyin", "奋音 " + get.translation(color2), true);
			var evt = player.getLastUsed(1);
			if (!evt) {
				return false;
			}
			var color1 = get.color(evt.card);
			return color1 && color2 && color1 != "none" && color2 != "none" && color1 != color2;
		},
		content() {
			player.draw("nodelay");
		},
		ai: {
			threaten: 3,
		},
	},
	dujin: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		frequent: true,
		preHidden: true,
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			trigger.num += 1 + Math.ceil(player.countCards("e") / 2);
		},
	},
	yingjian: {
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		audio: "qingyi",
		content() {
			player.chooseUseTarget("###是否发动【影箭】？###视为使用一张没有距离限制的【杀】", { name: "sha" }, false, "nodistance").logSkill =
				"yingjian";
		},
		ai: {
			threaten(player, target) {
				return 1.6;
			},
		},
	},
	tunchu: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		frequent: true,
		preHidden: true,
		locked: false,
		filter(event, player) {
			if (event.numFixed || player.getExpansions("tunchu").length) {
				return false;
			}
			return true;
		},
		content() {
			trigger.num += 2;
			player.addTempSkill("tunchu_choose", "phaseDrawAfter");
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		mod: {
			cardEnabled(card, player) {
				if (player.getExpansions("tunchu").length && card.name == "sha") {
					return false;
				}
			},
		},
		subSkill: {
			choose: {
				trigger: { player: "phaseDrawEnd" },
				forced: true,
				popup: false,
				charlotte: true,
				content() {
					"step 0";
					player.removeSkill("tunchu_choose");
					var nh = player.countCards("h");
					if (nh) {
						player.chooseCard("h", [1, nh], "将任意张手牌置于你的武将牌上", "allowChooseAll").set("ai", function (card) {
							var player = _status.event.player;
							var count = game.countPlayer(function (current) {
								return get.attitude(player, current) > 2 && current.hp - current.countCards("h") > 1;
							});
							if (ui.selected.cards.length >= count) {
								return -get.value(card);
							}
							return 5 - get.value(card);
						});
					} else {
						event.finish();
					}
					"step 1";
					if (result.bool) {
						player.addToExpansion(result.cards, player, "giveAuto").gaintag.add("tunchu");
					}
				},
			},
		},
	},
	shuliang: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player.getExpansions("tunchu").length > 0 && event.player.countCards("h") < event.player.hp && event.player.isIn();
		},
		content() {
			"step 0";
			var goon = get.attitude(player, trigger.player) > 0;
			player
				.chooseCardButton(get.prompt("shuliang", trigger.player), player.getExpansions("tunchu"))
				.set("ai", function () {
					if (_status.event.goon) {
						return 1;
					}
					return 0;
				})
				.set("goon", goon);
			"step 1";
			if (result.bool) {
				player.logSkill("shuliang", trigger.player);
				player.loseToDiscardpile(result.links);
				trigger.player.draw(2);
			}
		},
		ai: { combo: "tunchu" },
	},
	choulve: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("he");
			});
		},
		async cost(event, trigger, player) {
			let str = "令一名其他角色交给你一张牌";
			const history = player.getAllHistory("damage", function (evt) {
				return evt.card && evt.card.name && lib.card[evt.card.name];
			});
			if (history.length) {
				event.cardname = history[history.length - 1].card.name;
			}
			if (event.cardname) {
				str += "。若其如此做，视为你使用【" + get.translation(event.cardname) + "】";
			}
			let goon = true;
			if (event.cardname) {
				goon = game.hasPlayer(function (current) {
					return player.canUse(event.cardname, current) && get.effect(current, { name: event.cardname }, player, player) > 0;
				});
			}
			const result = await player
				.chooseTarget(get.prompt(event.skill), str, function (card, player, target) {
					return target != player && target.countCards("he");
				})
				.set("ai", function (target) {
					const event = get.event();
					if (!event.goon) {
						return 0;
					}
					var player = event.player;
					if (get.attitude(player, target) >= 0 && get.attitude(target, player) >= 0) {
						return Math.sqrt(target.countCards("he"));
					}
					return 0;
				})
				.set("goon", goon)
				.forResult();
			if (result.bool) {
				result.cost_data = { cardname: event.cardname };
				event.result = result;
			}
		},
		content() {
			"step 0";
			event.cardname = event.cost_data.cardname;
			var target = targets[0];
			target
				.chooseCard(
					"he",
					"是否交给" + get.translation(player) + "一张牌？",
					event.cardname ? "若如此做，视为" + get.translation(player) + "使用【" + get.translation(event.cardname) + "】" : null
				)
				.set("ai", function (card) {
					if (_status.event.goon) {
						return 7 - get.value(card);
					}
					return 0;
				})
				.set("goon", get.attitude(target, player) > 1);
			event.target = target;
			"step 1";
			if (result.bool) {
				event.target.give(result.cards, player);
				if (event.cardname) {
					player.chooseUseTarget(event.cardname, true, false);
				}
			}
		},
	},
	polu: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			if (!lib.inpile.includes("ly_piliche")) {
				return true;
			}
			return get.cardPile(card => card.name == "ly_piliche");
		},
		content() {
			var card;
			if (!lib.inpile.includes("ly_piliche")) {
				card = game.createCard2("ly_piliche", "diamond", 1);
				lib.inpile.push("ly_piliche");
			} else {
				card = get.cardPile(card => card.name == "ly_piliche");
			}
			player.chooseUseTarget(card, true, "nopopup");
		},
		group: "polu_damage",
		subSkill: {
			damage: {
				audio: "polu",
				trigger: { player: "damageEnd" },
				forced: true,
				filter(event, player) {
					return !player.getEquips("ly_piliche").length && event.num > 0;
				},
				getIndex: event => event.num,
				async content(event, trigger, player) {
					await player.draw();
					const card = get.cardPile2(card => get.subtype(card, false) == "equip1" && player.canUse(card, player));
					if (card) {
						await player.chooseUseTarget(card, true, "nopopup");
					}
				},
			},
		},
	},
	ly_piliche: {
		equipSkill: true,
		trigger: { source: "damageSource" },
		check(event, player) {
			return get.attitude(player, event.player) * get.value(event.player.getDiscardableCards(player, "e"), event.player) <= 0;
		},
		filter(event, player) {
			return player != event.player && event.player.countDiscardableCards(player, "e") > 0;
		},
		logTarget: "player",
		content() {
			player.discardPlayerCard(trigger.player, "e", true, trigger.player.countCards("e"));
		},
	},
};

export default skills;
