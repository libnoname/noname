import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//曼巴
	//关羽
	sxrmhanguo: {
		audio: 2,
		trigger: {
			global: "roundStart",
		},
		filter(event, player) {
			const targets = get.info("sxrmhanguo").getSelected(player);
			return game.hasPlayer(current => !targets.includes(current));
		},
		async cost(event, trigger, player) {
			const targets = get.info(event.skill).getSelected(player);
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player && !get.event().usedTarget.includes(target);
				})
				.set("usedTarget", targets)
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				skill = "sxrmhanguo_hujia";
			target.markAuto(skill, player);
			target.getStorage(skill).forEach(current => {
				target.addTip(`${skill}_${current.playerid}`, `撼国 ${get.translation(current)}`);
			});
			target.addTempSkill(skill, "roundEnd");
			const cards = target.getCards("he");
			if (!cards.length) {
				return;
			}
			const next = target.addToExpansion(cards, "giveAuto", target);
			next.gaintag.add(skill);
			await next;
		},
		getSelected(player) {
			const historys = game.getRoundHistory(
				"everything",
				evt => {
					return evt.player == player && evt.name == "sxrmhanguo";
				},
				1
			);
			if (!historys.length) {
				return [];
			}
			return historys.map(evt => evt.targets || []).flat();
		},
		init(player, skill) {
			player.addSkill("sxrmhanguo_effect");
		},
		derivation: "hujia",
		subSkill: {
			effect: {
				charlotte: true,
				audio: "sxrmhanguo",
				trigger: {
					source: "damageSource",
				},
				filter(event, player) {
					if (event.card?.name != "sha" || !event.player?.isIn()) {
						return false;
					}
					return event.player.getStorage("sxrmhanguo_hujia")?.includes(player);
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await trigger.player.die({ source: player });
				},
				ai: {
					jueqing: true,
					skillTagFilter(player, tag, arg) {
						return arg?.getStorage("sxrmhanguo_hujia")?.includes(player);
					},
				},
			},
			hujia: {
				inherit: "hujia",
				charlotte: true,
				sourceSkill: "hujia",
				name: "护驾",
				nopop: true,
				audio: "hujia",
				filter(event, player) {
					if (event.responded) {
						return false;
					}
					if (player.storage.hujiaing) {
						return false;
					}
					if (!event.filterCard(get.autoViewAs({ name: "shan", isCard: true }), player, event)) {
						return false;
					}
					return game.hasPlayer(current => current != player);
				},
				async content(event, trigger, player) {
					const start = _status.currentPhase == player ? _status.currentPhase.getNext() : _status.currentPhase || player;
					while (true) {
						let bool;
						if (!event.current) {
							event.current = start;
						} else if (event.current == start) {
							return;
						}
						if (event.current == player) {
							event.current = event.current.getNext();
							continue;
						}
						if ((event.current == game.me && !_status.auto) || get.attitude(event.current, player) > 2 || event.current.isOnline()) {
							player.storage.hujiaing = true;
							const next = event.current.chooseToRespond("是否替" + get.translation(player) + "打出一张闪？", { name: "shan" });
							next.set("ai", () => {
								const event = _status.event;
								return get.attitude(event.player, event.source) - 2;
							});
							next.set("skillwarn", "替" + get.translation(player) + "打出一张闪");
							next.autochoose = lib.filter.autoRespondShan;
							next.set("source", player);
							bool = (await next.forResult()).bool;
						}
						player.storage.hujiaing = false;
						if (bool) {
							trigger.result = { bool: true, card: { name: "shan", isCard: true } };
							trigger.responded = true;
							trigger.animate = false;
							if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
								event.current.ai.shown += 0.3;
								if (event.current.ai.shown > 0.95) {
									event.current.ai.shown = 0.95;
								}
							}
							const targets = player.getStorage(event.name).filter(current => current.countGainableCards(event.current, "he"));
							if (!targets.length) {
								return;
							}
							const result =
								targets.length > 1
									? await event.current
											.chooseTarget(`撼国：获得${get.translation(targets)}中的一名角色一张牌`, true, (card, player, target) => {
												return get.event().selectTargets.includes(target);
											})
											.set("selectTargets", targets)
											.set("ai", target => {
												const player = get.player();
												return get.effect(target, { name: "shunshou_copy2" }, player, player);
											})
											.forResult()
									: {
											bool: true,
											targets: targets,
										};
							if (result?.bool) {
								const target = result.targets[0];
								await event.current.gainPlayerCard(target, "he", true);
							}
							return;
						} else {
							event.current = event.current.getNext();
						}
					}
				},
				ai: {
					respondShan: true,
					skillTagFilter(player) {
						if (player.storage.hujiaing) {
							return false;
						}
						return game.hasPlayer(current => current != player);
					},
				},
				marktext: "标",
				intro: {
					name: "撼国",
					markcount: "expansion",
					mark(dialog, storage, player) {
						const cards = player.getExpansions("sxrmhanguo_hujia");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
				},
				onremove(player, skill) {
					const targets = player.getStorage(skill);
					if (targets.length) {
						targets.forEach(current => {
							player.removeTip(`${skill}_${current.playerid}`);
						});
					}
					const cards = player.getExpansions(skill);
					if (cards.length) {
						if (_status.event.name == "die") {
							player.loseToDiscardpile(cards);
						} else {
							player.gain(cards, "draw");
							game.log(player, "收回了" + get.cnNumber(cards.length) + "张“撼国”牌");
						}
					}
					player.setStorage(skill, null);
				},
			},
		},
	},
	sxrmweiwo: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		async cost(event, trigger, player) {
			const result = await player
				.chooseButtonTarget({
					createDialog: [get.prompt2(event.skill), [["rende", "qingnang", "longyin"], "skill"]],
					selectButton: [1, 3],
					filterTarget: lib.filter.notMe,
					selectTarget() {
						return ui.selected?.buttons?.length;
					},
					complexSelect: true,
					complexTarget: true,
					targetprompt(target) {
						const index = ui.selected.targets?.indexOf(target);
						if (index >= 0) {
							return get.translation(ui.selected.buttons[index]);
						}
						return "";
					},
					ai1: () => Math.random(),
					ai2(target) {
						return Math.max(0.1, get.attitude(get.player(), target));
					},
				})
				.forResult();
			if (result.bool) {
				event.result = {
					bool: true,
					targets: result.targets,
					cost_data: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { targets, cost_data: skills } = event;
			for (let i = 0; i < targets.length; i++) {
				const skill = `${event.name}_${skills[i]}`;
				targets[i].markAuto(skill, player);
				await targets[i].addSkills(skill);
				get.info(skill).init(targets[i], skill);
			}
			await player.addSkills("old_wushen");
		},
		derivation: ["rende", "qingnang", "longyin", "old_wushen"],
		subSkill: {
			rende: {
				inherit: "rende",
				sourceSkill: "rende",
				duplicatePrefix(player, skill) {
					const targets = player.getStorage(skill);
					if (targets.length == 1) {
						return `${get.translation(targets)}·`;
					}
					return "魔";
				},
				name: "仁德",
				audio: "rende",
				init(player, skill) {
					player.getStorage(skill).forEach(current => {
						player.addTip(`${skill}_${current.playerid}`, `${get.translation(skill)} ${get.translation(current)}`);
					});
				},
				onremove(player, skill) {
					player.getStorage(skill).forEach(current => {
						player.removeTip(`${skill}_${current.playerid}`);
					});
					player.setStorage(skill, null);
				},
				filterTarget(card, player, target) {
					if (!player.getStorage("sxrmweiwo_rende").length) {
						return player != target;
					}
					return player != target && player.getStorage("sxrmweiwo_rende").includes(target);
				},
				check(card) {
					if (ui.selected.cards.length > 1) {
						return 0;
					}
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						return 0;
					}
					if (!ui.selected.cards.length && card.name == "du") {
						return 20;
					}
					const player = get.owner(card);
					let num = 0;
					const evt2 = _status.event.getParent();
					player.getHistory("lose", evt => {
						if (evt.getParent().skill == "sxrmweiwo_rende" && evt.getParent(3) == evt2) {
							num += evt.cards.length;
						}
					});
					if (player.hp == player.maxHp || num > 1 || player.countCards("h") <= 1) {
						if (ui.selected.cards.length) {
							return -1;
						}
						const players = game.filterPlayer();
						for (let i = 0; i < players.length; i++) {
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
				async content(event, trigger, player) {
					const evt2 = event.getParent(3);
					let num = 0;
					player.getHistory("lose", evt => {
						if (evt.getParent(2).name == "sxrmweiwo_rende" && evt.getParent(5) == evt2) {
							num += evt.cards.length;
						}
					});
					await player.give(event.cards, event.target);
					if (num < 2 && num + event.cards.length > 1) {
						await player.recover();
					}
				},
				ai: {
					order(skill, player) {
						if (player.hp < player.maxHp && player.storage.rende < 2 && player.countCards("h") > 1) {
							return 10;
						}
						return 1;
					},
					result: {
						target(player, target) {
							if (target.hasSkillTag("nogain")) {
								return 0;
							}
							if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
								return target.hasSkillTag("nodu") ? 0 : -10;
							}
							if (target.hasJudge("lebu")) {
								return 0;
							}
							const nh = target.countCards("h");
							const np = player.countCards("h");
							if (player.hp == player.maxHp || player.storage.rende < 0 || player.countCards("h") <= 1) {
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
									const players = game.filterPlayer();
									for (let i = 0; i < players.length; i++) {
										if (players[i] != player && get.attitude(player, players[i]) > 0) {
											return 0;
										}
									}
								}
							}
						},
					},
					threaten: 0.8,
				},
			},
			qingnang: {
				inherit: "qingnang",
				sourceSkill: "qingnang",
				duplicatePrefix(player, skill) {
					const targets = player.getStorage(skill);
					if (targets.length == 1) {
						return `${get.translation(targets)}·`;
					}
					return "魔";
				},
				name: "青囊",
				audio: "qingnang",
				init(player, skill) {
					player.getStorage(skill).forEach(current => {
						player.addTip(`${skill}_${current.playerid}`, `${get.translation(skill)} ${get.translation(current)}`);
					});
				},
				onremove(player, skill) {
					player.getStorage(skill).forEach(current => {
						player.removeTip(`${skill}_${current.playerid}`);
					});
					player.setStorage(skill, null);
				},
				filterTarget(card, player, target) {
					if (target.hp >= target.maxHp) {
						return false;
					}
					if (!player.getStorage("sxrmweiwo_qingnang").length) {
						return true;
					}
					return player.getStorage("sxrmweiwo_qingnang").includes(target);
				},
			},
			longyin: {
				inherit: "longyin",
				sourceSkill: "longyin",
				duplicatePrefix(player, skill) {
					const targets = player.getStorage(skill);
					if (targets.length == 1) {
						return `${get.translation(targets)}·`;
					}
					return "魔";
				},
				name: "龙吟",
				audio: "longyin",
				init(player, skill) {
					player.getStorage(skill).forEach(current => {
						player.addTip(`${skill}_${current.playerid}`, `${get.translation(skill)} ${get.translation(current)}`);
					});
				},
				onremove(player, skill) {
					player.getStorage(skill).forEach(current => {
						player.removeTip(`${skill}_${current.playerid}`);
					});
					player.setStorage(skill, null);
				},
				filter(event, player) {
					if (player.getStorage("sxrmweiwo_longyin").length && !player.getStorage("sxrmweiwo_longyin").includes(event.player)) {
						return false;
					}
					return event.card.name == "sha" && player.countCards("he") > 0 && event.player.isPhaseUsing();
				},
			},
		},
	},
	old_wushen: {
		mod: {
			cardname(card, player, name) {
				if (get.suit(card) == "heart") {
					return "sha";
				}
			},
			cardnature(card, player) {
				if (get.suit(card) == "heart") {
					return false;
				}
			},
			targetInRange(card) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === "heart" || suit === "unsure") {
						return true;
					}
				}
			},
		},
		audio: "wushen",
		trigger: {
			player: "useCard",
		},
		forced: true,
		filter(event, player) {
			return !event.audioed && event.card.name == "sha" && get.suit(event.card) == "heart";
		},
		async content(event, trigger, player) {
			trigger.audioed = true;
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondSha") && current < 0) {
						return 0.6;
					}
				},
			},
		},
	},
	//关银屏
	sxrmyinmou: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "loseAsyncAfter", "equipAfter", "addJudgeAfter", "addToExpansionAfter", "gainAfter"],
		},
		filter(event, player) {
			const evts = game.getGlobalHistory("everything", evt => {
				return evt?.sxrmConnectCardsMap?.has?.(player);
			});
			return evts.indexOf(event) == 0;
		},
		forced: true,
		locked: false,
		logTarget(event, player) {
			const map = event.sxrmConnectCardsMap;
			return Array.from(map.keys()).sortBySeat();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			const func = async target => {
				await target.draw(Math.min(5, targets.length));
			};
			await game.doAsyncInOrder(targets, func);
		},
		global: "sxrmyinmou_global",
		subSkill: {
			global: {
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					if (!player.hasSex("male") || !player.countCards("h", card => !get.is.connectedCard(card))) {
						return false;
					}
					return game.hasPlayer(current => {
						return current.hasSkill("sxrmyinmou") && current.countCards("h", card => !get.is.connectedCard(card));
					});
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt("sxrmyinmou"), "连接你与一名拥有〖姻谋〗的角色各一张未连接的手牌", (card, player, target) => {
							return target.hasSkill("sxrmyinmou") && target.countCards("h", card => !get.is.connectedCard(card));
						})
						.set("ai", target => {
							return get.attitude(get.player(), target) / (1 + target.countConnectedCards());
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0],
						connects = new Map();
					for (const current of [target, player].sortBySeat().toUniqued()) {
						const cards = current.getCards("h", card => !get.is.connectedCard(card));
						if (!current.isIn() || !cards.length) {
							continue;
						}
						const result =
							cards.length == 1
								? { bool: true, links: cards }
								: await player
										.choosePlayerCard(current, "h", true)
										.set("filterButton", button => {
											return !get.is.connectedCard(button.link);
										})
										.forResult();
						if (result?.bool) {
							connects.set(current, result.links);
						}
					}
					for (const [current, cards] of connects) {
						await current.connectCards(cards);
					}
				},
			},
		},
	},
	sxrmquchi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		async content(event, trigger, player) {
			const { target } = event;
			const cards = target.getConnectedCards();
			let num = cards.length ? 2 : 1;
			if (cards.length) {
				await target.resetConnectedCards(cards);
			}
			const next = target.damage("fire");
			next.num = num;
			await next;
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target, "fire");
				},
			},
		},
	},
	//于禁
	sxrmsuwu: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
			global: "useCard",
		},
		filter(event, player) {
			if (event.name == "useCard") {
				if (
					[player, event.player].some(current => {
						return !current.hasConnectedCards();
					})
				) {
					return false;
				}
				const evts = event.player.getHistory("useCard", evt => get.tag(evt.card, "damage"));
				return evts.indexOf(event) == 0;
			}
			return game.hasPlayer(current => current.countCards("h"));
		},
		async cost(event, trigger, player) {
			if (trigger.name == "useCard") {
				event.result = {
					bool: true,
					targets: [trigger.player],
				};
			} else {
				event.result = await player
					.chooseTarget(get.prompt(event.skill), "连接至多四名角色各一张手牌", [1, 4], (card, player, target) => {
						return target.countCards("h");
					})
					.set("ai", target => {
						const player = get.player();
						const att = get.sgnAttitude(player, target);
						if (!ui.selected.targets.length) {
							if (player == target && ((player.isDamaged() && player.hasValueTarget({ name: "tao" })) || player == _status.currentPhase)) {
								return 12;
							}
							if (att > 0 && target == _status.currentPhase?.getNext()) {
								return 10;
							}
							return -att / (1 + target.countConnectedCards());
						}
						return -att / (1 + target.countConnectedCards());
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				trigger.directHit.addArray(game.players);
				trigger.player
					.when("useCardAfter")
					.filter(evt => evt == trigger)
					.step(async (event, trigger, player) => {
						await player.draw(2);
					});
			} else {
				const targets = event.targets,
					connects = new Map();
				for (const current of targets.sortBySeat()) {
					const cards = current.getCards("h");
					if (!current.isIn() || !cards.length) {
						continue;
					}
					const result =
						cards.length == 1
							? { bool: true, links: cards }
							: await player
									.choosePlayerCard(current, "h", true)
									.set("ai", button => {
										const { player, target } = get.event();
										const { link } = button;
										const att = get.attitude(player, target);
										let val = get.value(link, target);
										if (att > 0) {
											if (player == target && player == _status.currentPhase) {
												const num = target.countConnectedCards();
												if (num > 0) {
													if (get.is.connectedCard(link)) {
														val += 3;
													}
													return val;
												} else if (!get.is.connectedCard(link) && !get.tag(link, "damage")) {
													return 6.5 - val;
												}
												return 6 - val;
											}
											if (get.is.connectedCard(link)) {
												val += 3;
											}
											return val;
										}
										if (!get.is.connectedCard(link)) {
											val += 3;
										}
										return val;
									})
									.forResult();
					if (result?.links?.length) {
						connects.set(current, result.links);
					}
				}
				for (const [current, cards] of connects) {
					await current.connectCards(cards);
				}
			}
		},
	},
	sxrmrenwang: {
		audio: 2,
		enable: "chooseToUse",
		viewAsFilter(player) {
			return player.hasConnectedCards();
		},
		filterCard(card) {
			return get.is.connectedCard(card);
		},
		position: "h",
		viewAs: { name: "tao" },
		prompt: "将一张连接牌当桃使用",
		check(card) {
			return 15 - get.value(card);
		},
		ai: {
			save: true,
			order(item, player) {
				const num = game.filterPlayer(current => player != current).reduce((sum, current) => sum + current.countConnectedCards() * -get.sgnAttitude(player, current), 0);
				if (num > 0) {
					return 10;
				}
				return get.order({ name: "tao" }) + 0.1;
			},
		},
	},
	//糜芳
	sxrmhuoe: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			const card = new lib.element.VCard({ name: "huogong", isCard: true });
			return game.hasPlayer(current => current != player && player.canUse(card, current));
		},
		async cost(event, trigger, player) {
			const card = new lib.element.VCard({ name: "huogong", isCard: true });
			event.result = await player
				.chooseTarget(
					get.prompt2(event.skill),
					(card, player, target) => {
						const { huogong } = get.event();
						return target != player && player.canUse(huogong, target);
					},
					[1, 4]
				)
				.set("huogong", card)
				.set("ai", target => {
					const { huogong, player } = get.event();
					return get.effect(target, huogong, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const card = new lib.element.VCard({ name: "huogong", isCard: true, storage: { huoe: true } }),
				targets = event.targets;
			player.addTempSkill("sxrmhuoe_effect");
			const next = player.useCard(card, targets);
			await next;
			player.removeSkill("sxrmhuoe_effect");
			const cards = game
				.getGlobalHistory("everything", evt => {
					return evt.name == "showCards" && evt.getParent(evtx => evtx == next, true);
				})
				.reduce((arr, evt) => arr.concat(evt.cards ?? []), []);
			if (!cards.length) {
				return;
			}
			let num = 0;
			while (cards.length) {
				const card = cards.shift();
				num += get.number(card);
				const result = await player
					.chooseTarget(`火厄：分配${get.translation(card)}给一名角色`, true)
					.set("ai", target => {
						const { cardx, player } = get.event();
						return get.value(cardx, target) * get.attitude(player, target);
					})
					.set("cardx", card)
					.forResult();
				if (result?.bool) {
					const target = result.targets[0],
						owner = get.owner(card);
					if (!owner) {
						await target.gain(card, "gain2");
					} else if (target != owner) {
						await owner.give(card, target, true);
					}
				}
			}
			if (num < 13) {
				await player.loseHp();
			}
		},
		subSkill: {
			effect: {
				trigger: {
					player: "chooseToDiscardBegin",
				},
				charlotte: true,
				filter(event, player) {
					const evt = event.getParent();
					return evt.name == "huogong" && evt.card?.storage?.huoe;
				},
				async cost(event, trigger, player) {
					if (
						player.countCards(trigger.position, card => {
							if (!lib.filter.cardDiscardable(card, player, trigger)) {
								return false;
							}
							return trigger.filterCard(card, player);
						})
					) {
						trigger.forced = true;
						const evt = trigger.getParent(2);
						evt.targets.splice(evt.num + 1);
					} else if (player.countCards("h")) {
						const evt = trigger.getParent();
						const next = evt.target.viewHandcards(player);
						event.next.remove(next);
						trigger.next.push(next);
					}
				},
			},
		},
	},
	sxrmtanduo: {
		audio: 2,
		trigger: { player: "phaseChange" },
		forced: true,
		filter(event, player) {
			if (!event.phaseList[event.num].startsWith("phaseDiscard")) {
				return false;
			}
			return player.needsToDiscard();
		},
		async content(event, trigger, player) {
			trigger.phaseList[trigger.num] = `phaseDraw|${event.name}`;
			await game.delayx();
		},
	},
	//寇封
	sxrmhuaibing: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.countPlayer(current => current.countCards("h")) >= 2;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), 2, (card, player, target) => {
					return target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					let eff = get.effect(target, { name: "shunshou_copy2" }, player, player),
						count = player.countCards("h", { color: "red" }) - 2;
					if (ui.selected.targets.length) {
						const first = ui.selected.targets[0];
						if (first.hp != target.hp) {
							const current = first.hp > target.hp ? target : first;
							return eff + get.effect(current, { name: "wuzhong" }, current, player) * count;
						}
					}
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const gains = event.targets.filter(current => current != player && current.countCards("h"));
			if (gains.length) {
				await player.gainMultiple(gains, "h");
			}
			await player.showHandcards(`${get.translation(player)}发动了【怀兵】`);
			const num = event.targets.reduce((sum, current) => sum + current.getHp(), 0) / 2,
				current = event.targets.find(current => current.getHp() < num);
			if (!current) {
				return;
			}
			const red = player.countCards("h", { color: "red" });
			for (const key of ["Draw", "Use", "Discard"]) {
				current.addTempSkill(`${event.name}_${key}`, { player: `phase${key}After` });
				current.setStorage(`${event.name}_${key}`, red);
				current.markSkill(`${event.name}_${key}`);
			}
		},
		subSkill: {
			Draw: {
				charlotte: true,
				marktext: "摸",
				intro: {
					content: "下个摸牌阶段摸牌数改为#",
				},
				onremove: true,
				trigger: {
					player: "phaseDrawBegin2",
				},
				filter(event, player) {
					const storage = player.getStorage("sxrmhuaibing_Draw", 0);
					return !event.numFixed && typeof storage == "number";
				},
				firstDo: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					trigger.num = player.getStorage(event.name, 0);
					trigger.numFixed = true;
				},
			},
			Use: {
				charlotte: true,
				marktext: "杀",
				intro: {
					content: "下个出牌阶段出【杀】次数改为#",
				},
				onremove: true,
				trigger: {
					player: "phaseUseBegin",
				},
				filter(event, player) {
					const storage = player.getStorage("sxrmhuaibing_Use", 0);
					return typeof storage == "number";
				},
				firstDo: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player
						.when("phaseUseAfter")
						.step(async () => {})
						.assign({
							mod: {
								cardUsable(card, player, num) {
									const storage = player.getStorage("sxrmhuaibing_Use", 0);
									if (typeof storage != "number" || card.name != "sha") {
										return;
									}
									return storage;
								},
							},
						});
				},
			},
			Discard: {
				charlotte: true,
				marktext: "弃",
				intro: {
					content: "下个弃牌阶段手牌上限改为#",
				},
				onremove: true,
				trigger: {
					player: "phaseDiscardBegin",
				},
				filter(event, player) {
					const storage = player.getStorage("sxrmhuaibing_Discard", 0);
					return typeof storage == "number";
				},
				firstDo: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player
						.when("phaseDiscardAfter")
						.step(async () => {})
						.assign({
							mod: {
								maxHandcardFinal(player, num) {
									const storage = player.getStorage("sxrmhuaibing_Discard", 0);
									if (typeof storage != "number") {
										return;
									}
									return storage;
								},
							},
						});
				},
			},
		},
	},
	//陆逊
	sxrmchanyu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			if (target.getHp() > 0) {
				await target.draw(target.getHp());
			}
			[player, target].forEach(current => {
				const num = Math.min(...current.getCards("h").map(card => get.number(card, current)));
				current.addGaintag(
					current.getCards("h", card => get.number(card, current) <= num),
					"sxrmchanyu_tag"
				);
			});
			const next = player.chooseToCompare(target);
			next.set("filterCard", (card, player) => {
				const bool = cardx => cardx.hasGaintag("sxrmchanyu_tag");
				return !player?.countCards("h", bool) || bool(card);
			});
			const result = await next.forResult();
			const func = async current => {
				current.removeGaintag("sxrmchanyu_tag");
				await current.showHandcards();
			};
			await game.doAsyncInOrder([player, target], func);
			if (result?.winner) {
				const winner = result.winner,
					loser = [player, target].find(current => current != winner);
				const dialog = ui.create.dialog("谄谀：是否交换其中一种颜色或类别的所有手牌？", "你的手牌", winner.getCards("h"), `${get.translation(loser)}的手牌`, loser.getCards("h"));
				const result2 = await winner
					.chooseControl("red", "black", "basic", "equip", "trick", "cancel2")
					.set("dialog", dialog)
					.set("ai", () => get.event().resultx)
					.set(
						"resultx",
						(() => {
							const getFilter = (card, key) => {
								if (["red", "black"].includes(key)) {
									return get.color(card) == key;
								}
								return get.type2(card) == key;
							};
							const getV = key => {
								if (key === "cancel2") {
									return 0;
								}
								const cards1 = winner.getCards("h", card => getFilter(card, key)),
									cards2 = loser.getCards("h", card => getFilter(card, key));
								let sum1 = cards1.reduce((sum, card) => {
									sum += get.value(card, winner);
									return sum;
								}, 0);
								let sum2 = cards2.reduce((sum, card) => {
									sum += get.value(card, loser);
									return sum;
								}, 0);
								if (get.attitude(winner, loser) > 0) {
									return Math.abs(sum1 - sum2);
								}
								return sum2 - sum1;
							};
							return ["red", "black", "basic", "equip", "trick", "cancel2"].maxBy(getV);
						})()
					)
					.forResult();
				if (result2?.control != "cancel2") {
					const control = result2.control,
						getC = current => {
							return current.getCards("h", card => {
								if (["red", "black"].includes(control)) {
									return get.color(card) == control;
								}
								return get.type2(card) == control;
							});
						};
					await winner.swapHandcards(loser, getC(winner), getC(loser));
				}
			}
		},
		ai: {
			order: 9,
			result: {
				player: -1,
				target(player, target) {
					return target.getHp() - 1;
				},
			},
		},
	},
	sxrmcongfeng: {
		audio: 2,
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				const bool = player.getStorage(skill, false);
				return `转换技，你使用牌或成为牌的目标后，你可以${bool ? "弃置使用者两张牌" : "与使用者各摸一张牌"}`;
			},
		},
		trigger: {
			player: "useCard",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (!event.player?.isIn()) {
				return false;
			}
			const bool = player.getStorage("sxrmcongfeng", false);
			return !bool || event.player.countDiscardableCards(player, "he");
		},
		logTarget: "player",
		check(event, player) {
			const bool = player.getStorage("sxrmcongfeng", false),
				getV = (current, name) => get.effect(current, { name: name }, player, player);
			if (bool) {
				return getV(event.player, "guohe_copy2") > 0;
			}
			return getV(event.player, "draw") + getV(player, "draw") > 0;
		},
		async content(event, trigger, player) {
			const bool = player.getStorage(event.name, false);
			player.changeZhuanhuanji(event.name);
			if (bool) {
				const num = Math.min(2, trigger.player.countDiscardableCards(player, "he"));
				if (num > 0) {
					await player.discardPlayerCard(trigger.player, "he", num, true);
				}
			} else {
				await game.asyncDraw([player, trigger.player]);
			}
		},
	},
	//吕蒙
	sxrmkongzhi: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
			global: "useCard",
		},
		filter(event, player, name) {
			if (name == "useCard") {
				return player.isDamaged() && get.type(event.card) == "trick" && event.targets?.includes(player);
			}
			return event.card?.name == "sha" && event.targets?.length === 1 && event.target.countGainableCards(player, "he");
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername == "useCard") {
				trigger.excluded.add(player);
				await game.delayx();
			} else {
				await player.gainPlayerCard(trigger.target, "he", [1, 3], true);
			}
		},
		mod: {
			cardname(card, player) {
				if (player.isDamaged() && lib.card[card.name].type == "basic") {
					return "shan";
				}
			},
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (!target.isDamaged()) {
						return;
					}
					if (get.type(card) == "trick") {
						return "zeroplayertarget";
					}
					if (get.name(card) == "sha") {
						return 0.3;
					}
				},
			},
		},
	},
	sxrmbizha: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		async content(event, trigger, player) {
			await player.draw();
			const targets = game.filterPlayer(current => player.canCompare(current));
			if (!targets.length) {
				return;
			}
			const result =
				targets.length > 1
					? await player
							.chooseTarget("鄙诈：与一名角色拼点", true, (card, player, target) => player.canCompare(target))
							.set("ai", target => {
								return -get.attitude(get.player(), target);
							})
							.forResult()
					: {
							bool: true,
							targets: targets,
						};
			if (result?.bool) {
				const target = result.targets[0];
				const result2 = await player.chooseToCompare(target).forResult();
				if (result2?.winner != target) {
					await target.loseHp(2);
					let num = 0;
					while (num < 2 && target?.isIn() && target.countCards("h")) {
						const result3 = await player
							.chooseButton([`鄙诈：是否使用其中一张点数小于${result2.num2}的牌？（${num}/2）`, target.getCards("h")])
							.set("filterButton", button => {
								const { player, maxNum } = get.event(),
									card = button.link;
								if (get.number(card) >= maxNum) {
									return false;
								}
								return player.hasUseTarget(card);
							})
							.set("maxNum", result2.num2)
							.set("ai", button => {
								const { player } = get.event();
								return player.getUseValue(button.link);
							})
							.forResult();
						if (result3?.bool) {
							await player.chooseUseTarget(result3.links[0], true);
						} else {
							break;
						}
						num++;
					}
				}
				if (result2?.winner != player) {
					await player.loseMaxHp();
				}
			}
		},
	},
	//庞德
	sxrmnuozhan: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => get.damageEffect(target, get.player(), get.player()))
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			while (target?.isIn()) {
				await player.draw();
				const names = get.inpileVCardList(info => {
					if (info[0] == "delay") {
						return false;
					}
					const card = new lib.element.VCard({ name: info[2], nature: info[3], isCard: true });
					return get.tag(card, "damage");
				});
				if (!names.length) {
					return;
				}
				const result = await target
					.chooseButton(["声明一种伤害类牌", [names, "vcard"]], true)
					.set("ai", button => {
						const { player, kuangtu } = get.event(),
							card = new lib.element.VCard({ name: button.link[2], nature: button.link[3], isCard: true });
						let eff = Math.max(get.effect(player, card, kuangtu, kuangtu), get.effect(kuangtu, card, player, kuangtu));
						return eff;
					})
					.set("kuangtu", player)
					.forResult();
				if (!result?.bool) {
					return;
				}
				const card = new lib.element.VCard({ name: result.links[0][2], nature: result.links[0][3], isCard: true });
				const targets = [player, target].filter(current => current.canUse(card, current == player ? target : player, false));
				if (!targets?.length) {
					return;
				}
				const result2 =
					targets.length > 1
						? await player
								.chooseTarget(
									`选择${get.translation(card)}的使用者`,
									(card, player, target) => {
										return get.event().canUse.includes(target);
									},
									true
								)
								.set("canUse", targets)
								.set("targetx", target)
								.set("willUse", card)
								.set("ai", target => {
									const { player, targetx, willUse } = get.event();
									if (target == player) {
										return get.effect(targetx, willUse, target, player);
									}
									return get.effect(player, willUse, target, player);
								})
								.forResult()
						: {
								bool: true,
								targets: targets,
							};
				if (!result2?.bool) {
					return;
				}
				const user = result2.targets[0],
					targetx = [player, target].remove(user)[0];
				const next = user.useCard(card, targetx);
				next.baseDamage ??= 1;
				next.baseDamage++;
				await next;
				if (
					next.targets?.length &&
					next.targets.some(current => {
						return current.hasHistory("damage", evt => evt.card == next.card);
					})
				) {
					break;
				}
				await user.loseHp();
				if (!player?.isIn() || !target?.isIn()) {
					return;
				}
				const { bool } = await player
					.chooseBool(`是否继续对${get.translation(target)}搦战？`)
					.set("choice", player.hp > 1)
					.forResult();
				if (!bool) {
					break;
				}
			}
		},
	},
	//颜良文丑
	sxrmhaibian: {
		audio: 2,
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player) {
			const historys = player.actionHistory;
			if (historys.length <= 1) {
				return false;
			}
			const { useCard, lose } = historys[historys.length - 2];
			return useCard.some(evt =>
				lose.some(evtx => {
					const evtxx = evtx.relatedEvent || evtx.getParent();
					return evtx.hs.length > 0 && evtxx == evt;
				})
			);
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const historys = _status.globalHistory;
			if (historys.length <= 1) {
				return;
			}
			const { useCard } = historys[historys.length - 2];
			let black, red;
			for (let i = useCard.length - 1; i >= 0; i--) {
				const evt = useCard[i],
					color = get.color(evt.card);
				if (color === "black" && !black) {
					black = evt.player;
				}
				if (color === "red" && !red) {
					red = evt.player;
				}
				if (black && red) {
					break;
				}
			}
			for (const current of [black, red]) {
				if (current?.isIn()) {
					const card = new lib.element.VCard({ name: "juedou", isCard: true });
					if (current.hasUseTarget(card)) {
						await current.chooseUseTarget(card, "是否使用【决斗】？");
					}
				}
			}
		},
	},
	sxrmqiewang: {
		audio: 2,
		trigger: {
			global: "damageEnd",
		},
		filter(event, player) {
			return event.player?.isIn() && get.distance(player, event.player) <= 1;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.draw();
			player
				.when({
					global: ["phaseAfter", "phaseBeforeStart"],
				})
				.step(async () => {})
				.assign({
					mod: {
						cardname(card, player) {
							if (get.position(card) == "h") {
								return "wuxie";
							}
						},
					},
				});
		},
	},
	//疑包
	//曹操 -by.柴油鹿鹿
	sxrmkuxin: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return game.hasPlayer(current => {
				return current !== player && current.countCards("h") > 0;
			});
		},
		check(event, player) {
			if (player.isTurnedOver()) {
				return true;
			}
			if (
				game.countPlayer(current => {
					if (current === player) {
						return 0;
					}
					if (get.attitude(player, current) > 0) {
						return current.countCards("h") >= 4;
					}
					return current.countCards("h");
				}) <
				4 / (1 + player.getHp())
			) {
				// 红桃牌很难获得
				return false;
			}
			return true; //跟你爆了 TODO: 一个考虑大局的枯心ai
			/*return (
				game.countPlayer(current => {
					if (current === player) {
						return 0;
					}
					const att = get.attitude(player, current);
					if (att > 0) {
						return -1;
					}
					if (att < 0) {
						return 1;
					}
					return 0.5;
				}) >=
				6 / (1 + player.getHp())
			);*/
		},
		logTarget(event, player) {
			return game.filterPlayer(current => current !== player).sortBySeat(_status.currentPhase);
		},
		async content(event, trigger, player) {
			const { targets } = event,
				list = [];
			for (const target of targets) {
				if (!target.countCards("h")) {
					continue;
				}
				const result = await target
					.chooseCard("枯心：展示任意张手牌", "h", [1, Infinity], true, "allowChooseAll")
					.set("targetx", player)
					.set("ai", card => {
						const { player, targetx } = get.event();
						let att = get.attitude(player, targetx);
						let val = get.value(card);
						if (get.suit(card, false) === "heart") {
							// 优先处理特殊逻辑
							return att * 10086 - val;
						}
						if (att < 0) {
							// 不情愿亮
							val = -val;
						} else if (att > 0) {
							// 队友有增益的可以给
							val = get.value(card, targetx) - val;
						}
						return val;
					})
					.forResult();
				if (!result?.cards?.length) {
					continue;
				}
				list.push([result.cards, target]);
				await target.showCards(result.cards);
				await game.delay();
			}
			let result,
				gains = [];
			if (list.length) {
				result = await player
					.chooseButtonTarget({
						createDialog: [
							"枯心：请选择一项执行",
							[
								list.flatMap(([cards, target]) => {
									return cards.map(card => [card, target]);
								}),
								(item, type, position, noclick, node) => {
									node = ui.create.buttonPresets.card(item[0], type, position, noclick);
									game.createButtonCardsetion(item[1].getName(true), node);
									return node;
								},
							],
							[
								["获得所有角色的展示牌", "获得一名角色的未展示牌"].map((item, i) => {
									return [i, item];
								}),
								"tdnodes",
							],
							[
								dialog => {
									dialog.css({ top: get.is.phoneLayout() ? "20%" : "25%" });
									dialog.buttons
										.filter(button => typeof button.link == "number")
										.forEach(button => {
											button.style.setProperty("width", "200px", "important");
											button.style.setProperty("text-align", "left", "important");
										});
								},
								"handle",
							],
						],
						forced: true,
						filterTarget: lib.filter.notMe,
						selectTarget() {
							if (ui.selected.buttons.length) {
								const { link } = ui.selected.buttons[0];
								if (link == 1) {
									return 1;
								}
								return 0;
							}
							return 0;
						},
						filterOk() {
							if (ui.selected.buttons.length) {
								const { link } = ui.selected.buttons[0];
								if (link == 1) {
									return ui.selected.targets.length == 1;
								}
								return link == 0;
							}
							return false;
						},
						list,
						ai1(button) {
							const player = get.player();
							const cards =
								get
									.event("list")
									?.map(i => i[0])
									.flat() || [];
							const { num } = get.event().getTrigger();
							const { link } = button;
							if (typeof link !== "number") {
								return 0;
							}
							if (link == 1) {
								if (player.isTurnedOver() && cards.some(card => get.suit(card, false) === "heart")) {
									return 2;
								}
								if (cards.length <= num * 2 && game.hasPlayer(current => current != player && current.countCards("h", cardx => !cards?.includes(cardx)) > cards.length && get.attitude(player, current) < 0)) {
									return 2;
								}
							}
							if (link == 0 && cards.some(card => get.suit(card, false) === "heart")) {
								return 1;
							}
							return 1;
						},
						ai2(target) {
							if (ui.selected.buttons[0].link == 0) {
								return 1;
							}
							const player = get.player();
							const cards = get
								.event("list")
								?.map(i => i[0])
								.flat();
							return -get.attitude(player, target) * target.countCards("h", cardx => !cards?.includes(cardx));
						},
					})
					.forResult();
				if (!result?.links?.length) return;
				const [link] = result.links;
				if (link == 0) {
					game.log(player, "选择了", "#g【枯心】", "的", "#y选项一");
					gains = list.flatMap(([cards, target]) => {
						return cards.filter(card => lib.filter.canBeGained(card, target, player));
					});
				} else if (link == 1 && result?.targets?.length) {
					game.log(player, "选择了", "#g【枯心】", "的", "#y选项二");
					const [target] = result.targets;
					player.line(target);
					gains = target.getCards("h", card => !list.flatMap(i => i[0]).includes(card) && lib.filter.canBeGained(card, target, player));
				}
			} else if (game.hasPlayer(target => target != player)) {
				const targets = game.filterPlayer(target => target != player);
				result =
					targets.length == 1
						? { bool: true, targets }
						: await player
								.chooseTarget("枯心：选择一名其他角色获得其未展示的手牌", true, lib.filter.notMe)
								.set("ai", target => {
									const player = get.player();
									return -get.attitude(player, target) * target.countCards("h");
								})
								.forResult();
				if (result?.targets?.length) {
					game.log(player, "选择了", "#g【枯心】", "的", "#y选项二");
					const [target] = result.targets;
					player.line(target);
					gains = target.getCards("h", card => lib.filter.canBeGained(card, target, player));
				}
			}
			if (gains.length) {
				await player.gain(gains, "gain2");
				await player.showCards(gains);
			}
			if (!gains.some(card => get.suit(card, false) === "heart")) {
				if (gains.length) {
					await player.discard(gains);
				}
				await player.turnOver();
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			threaten(player, target) {
				if (target.getHp() == 1) {
					return 2.5;
				}
				return 0.5;
			},
			effect: {
				target(card, player, target) {
					if (
						!target._dekuxin_eff &&
						get.tag(card, "damage") &&
						target.getHp() >
							(player.hasSkillTag("damageBonus", true, {
								card: card,
								target: target,
							})
								? 2
								: 1)
					) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						target._dekuxin_eff = true;
						let gain = game.countPlayer(current => {
							if (target == current) {
								return 0;
							}
							if (get.attitude(target, current) > 0) {
								return 0;
							}
							if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "sxrmkuxin"), "h")) {
								return 0.9;
							}
							return 0;
						});
						if (target.isTurnedOver()) {
							gain += 2.3;
						} else {
							gain -= 2.3;
						}
						delete target._dekuxin_eff;
						return [1, Math.max(0, gain)];
					}
				},
			},
		},
	},
	sxrmsigu: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target.judge().forResult();
			if (!result.number) {
				return;
			}
			const name = get.info(event.name).pasts[result.number - 1],
				skill = get.info(event.name).derivation[result.number - 1];
			const mark = `desigu_${player.playerid}`;
			if (name) {
				await target.addAdditionalSkills(mark, [skill], true);
				//写个标记吧
				target.addTip(mark, `似故 ${get.translation(skill)}`);
				//再加个动画
				target.setAvatar(target.name, name);
			} else {
				player.chat("孩子你是谁？");
			}
			await target.damage();
			await target.damage();
			if (name) {
				target.removeAdditionalSkills(mark);
				target.removeTip(mark);
				target.setAvatar(target.name, target.name);
			}
		},
		//不太会写ai，随便写了点简单的情况
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if ((target.hasSkillTag("maixie") || target.hasSkillTag("maixie_hp")) && get.attitude(player, target) < 0) {
						return 0;
					}
					if (get.attitude(player, target) < 0 && target.getHp() + target.hujia <= 1) {
						return -1;
					}
					if ((target.hasSkillTag("maixie") || target.hasSkillTag("maixie_hp")) && get.attitude(player, target) > 0 && target.getHp() + target.hujia >= 3) {
						return 2;
					}
					if (get.attitude(player, target) > 0 && target.getHp() + target.hujia >= 4) {
						return 1;
					}
					if (get.attitude(player, target) == 0 && target.getHp() + target.hujia >= 2) {
						return 1;
					}
					return 0;
				},
			},
			tag: {
				damage: 1,
			},
		},
		pasts: ["chengong", "re_xiahoudun", "re_simayi", "re_guojia", "ol_xunyu", "sb_caopi", "shenpei", "re_caochong", "re_xunyou", "yangxiu", "chengyu", "xizhicai", "shen_guanyu"],
		derivation: ["zhichi", "reganglie", "refankui", "new_reyiji", "oljieming", "fangzhu", "shibei", "rechengxiang", "zhiyu", "jilei", "benyu", "chouce", "new_wuhun"],
	},
	//刘备
	sxrmchengbian: {
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
		},
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player.canCompare(target);
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "juedou" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const next = player.chooseToCompare(target).set("isDelay", true);
			await next;
			await game.delay();
			const card = new lib.element.VCard({ name: "juedou", isCard: true });
			if (player.canUse(card, target)) {
				const next2 = player.useCard(card, target);
				player
					.when({
						player: "useCardAfter",
					})
					.filter(evt => evt === next2)
					.step(async (event, trigger, player) => {
						player.removeSkill("sxrmchengbian_sha");
						target.removeSkill("sxrmchengbian_sha");
						const result = await game.createEvent("chooseToCompare", false).set("player", player).set("parentEvent", next).setContent("chooseToCompareEffect").forResult();
						if (result?.winner) {
							await result.winner.drawTo(result.winner.maxHp);
						}
					});
				player.addTempSkill("sxrmchengbian_sha");
				target.addTempSkill("sxrmchengbian_sha");
				await next2;
				player.removeSkill("sxrmchengbian_sha");
				target.removeSkill("sxrmchengbian_sha");
			}
		},
		subSkill: {
			sha: {
				audio: "sxrmchengbian",
				enable: "chooseToRespond",
				filterCard: true,
				selectCard() {
					const player = get.player(),
						num = Math.ceil(player.countCards("h") / 2);
					return [num, Infinity];
				},
				position: "h",
				viewAs: { name: "sha" },
				viewAsFilter(player) {
					if (!player.countCards("h")) {
						return false;
					}
				},
				prompt: "将至少半数手牌当杀打出",
				allowChooseAll: true,
				check(card) {
					const player = get.player(),
						num = Math.ceil(player.countCards("h") / 2),
						val = get.value(card);
					if (ui.selected.cards.length >= num) {
						return 0;
					}
					return 1 / Math.max(0.1, val);
				},
				ai: {
					skillTagFilter(player) {
						if (!player.countCards("h")) {
							return false;
						}
					},
					respondSha: true,
				},
			},
		},
	},
	//蒋干
	sxrmzongheng: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.countPlayer(current => current.countCards("h") && current != player) > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), 2, (card, player, target) => {
					return target.countCards("h") && target != player;
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			const result = await player
				.chooseButton(["纵横：展示并获得其中一张", `###${get.translation(targets[0])}的手牌###`, targets[0].getCards("h"), `###${get.translation(targets[1])}的手牌###`, targets[1].getCards("h")], true)
				.set("targets", targets)
				.set("ai", button => {
					const { player, targets } = get.event(),
						owner = get.owner(button.link),
						other = targets.find(i => i != owner);
					let eff1 = get.value(button.link),
						eff2 = other ? get.effect(other, { name: "guohe_copy2" }, player, player) : 0;
					if (other) {
						eff2 *= Math.min(
							3,
							other.countCards("h", card => {
								return ["suit", "type2", "number"].some(key => {
									return get[key](card, other) == get[key](button.link, owner);
								});
							})
						);
					}
					return eff1 + eff2;
				})
				.forResult();
			const card = result.links[0],
				owner = get.owner(card),
				other = targets.find(i => i != owner),
				suit = get.suit(card, owner),
				num = get.number(card, owner),
				type = get.type2(card, owner);
			await owner.give(card, player);
			if (other) {
				if (
					!other.countCards("h", cardx => {
						return get.suit(cardx) == suit || get.number(cardx) == num || get.type2(cardx) == type;
					})
				) {
					return;
				}
				const result = await player
					.chooseToMove_new("纵横：弃置符合要求的牌各一张", true)
					.set("list", [
						[get.translation(other) + "的手牌", other.getCards("h")],
						[[`花色为${get.translation(suit)}`], [`点数为${get.translation(num)}`], [`类型为${get.translation(type)}`]],
					])
					.set("filterOk", moved => {
						let list = [null, "suit", "number", "type2"];
						for (let i = 1; i < 4; i++) {
							let key = list[i];
							if (moved[i].some(card => get[key](card) != get.event()[key]) || moved[i].length > 1) {
								return false;
							}
						}
						return moved[1].length + moved[2].length + moved[3].length;
					})
					.set("filterMove", (from, to, moved) => {
						let list = [null, "suit", "number", "type2"];
						if (typeof to == "number") {
							if (to != 0) {
								return moved[to].length < 1 && get[list[to]](from.link) == get.event()[list[to]];
							}
							return true;
						}
						let num1 = [0, 1, 2, 3].find(i => moved[i].includes(from.link)),
							num2 = [0, 1, 2, 3].find(i => moved[i].includes(to.link));
						if (num1 != 0 && get[list[num1]](to.link) != get.event()[list[num1]]) {
							return false;
						}
						if (num2 != 0 && get[list[num2]](from.link) != get.event()[list[num2]]) {
							return false;
						}
						return true;
					})
					.set("processAI", list => {
						let cards = [],
							cardx = list[0][1].slice().sort((a, b) => get.value(b) - get.value(a)),
							discards = [[], [], []],
							keys = ["suit", "number", "type2"];
						for (let i = 0; i < keys.length; i++) {
							let key = keys[i];
							let card = cardx.find(j => !cards.includes(j) && get[key](j) == get.event()[key]);
							if (card) {
								cards.add(card);
								discards[i].add(card);
							}
						}
						return [cardx.removeArray(cards), ...discards];
					})
					.set("suit", suit)
					.set("number", num)
					.set("type2", type)
					.forResult();
				if (result.bool) {
					const cards = result.moved.slice(1).flat();
					await other.discard(cards).set("discarder", player);
				}
			}
		},
	},
	sxrmduibian: {
		trigger: {
			player: "damageBegin4",
		},
		filter(event, player) {
			if (!event.source || event.source == player) {
				return false;
			}
			if (!player.canCompare(event.source)) {
				return false;
			}
			return (
				game
					.getGlobalHistory(
						"everything",
						evt => {
							return evt.name == "damage" && evt.player == player;
						},
						event
					)
					.indexOf(event) == 0
			);
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const next = await player.chooseToCompare(target).set("isDelay", true);
			trigger.cancel();
			let bool = get.damageEffect(player, target, target) + get.effect(target, { name: "guohe_copy2" }, player, target) > 0;
			bool = Math.random() > 0.4 ? bool : false;
			const result = await target
				.chooseBool(`对辩：是否令${get.translation(player)}弃置你一张牌，然后揭示拼点结果？`)
				.set("choice", bool)
				.forResult();
			if (result.bool) {
				await player.discardPlayerCard(target, "he", true);
				const result2 = await game.createEvent("chooseToCompare", false).set("player", player).set("parentEvent", next).setContent("chooseToCompareEffect").forResult();
				if (result2?.winner == target) {
					await player.loseHp();
				}
			} else {
				await game.delayx();
			}
		},
	},
	//华佗
	sxrmmiehai: {
		enable: "chooseToUse",
		filterCard: true,
		selectCard: 2,
		position: "hes",
		viewAs: {
			name: "sha",
			nature: "stab",
			storage: {
				miehai: true,
			},
		},
		complexCard: true,
		filter(event, player) {
			return player.countCards("hes") >= 2;
		},
		audio: true,
		prompt: "将两张牌当刺【杀】使用或打出",
		async precontent(event, trigger, player) {
			player
				.when("useCardAfter")
				.filter(evt => evt.getParent() == event.getParent())
				.step(async (event, trigger, player) => {
					const targets = game.filterPlayer(current => {
						return current.getHistory("lose", evt => {
							const cards = evt.cards2;
							if (!evt.getParent(evt => evt == trigger, true, true) || !cards.some(card => get.suit(card) == "spade")) {
								return false;
							}
							return evt.visible;
						}).length;
					});
					if (!targets?.length) {
						return;
					}
					for (let target of targets) {
						if (target.isDamaged()) {
							await target.draw(2);
							await target.recover();
						}
					}
				});
		},
		check(card) {
			let player = _status.event.player;
			let val = get.value(card);
			if (get.suit(card) == "spade" && player.isDamaged()) {
				val *= 0.6;
			}
			return Math.max(5, 8 - 0.7 * player.hp) - val;
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }) + 0.1;
			},
		},
		locked: false,
		mod: {
			targetInRange(card) {
				if (card?.storage?.miehai) {
					return true;
				}
			},
			cardUsable(card, player, num) {
				if (card?.storage?.miehai) {
					return Infinity;
				}
			},
		},
	},
	sxrmqingjun: {
		trigger: {
			global: "roundEnd",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					let eff = 5 * get.sgnAttitude(player, target);
					let targets = game.filterPlayer(current => {
						return current == player || current.inRange(target);
					});
					for (let targetx of targets) {
						eff += get.effect(targetx, { name: "wuzhong" }, targetx, player);
						eff += get.effect(target, { name: "sha" }, targetx, player);
					}
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				targets = game.filterPlayer(current => {
					return current == player || current.inRange(target);
				});
			for (let targetx of targets) {
				await targetx.draw(2);
				let skillName = `${event.name}_${player.playerid}`;
				targetx.addAdditionalSkill(skillName, ["sxrmshefu_effect"], true);
				targetx
					.when({
						global: "phaseEnd",
					})
					.filter(evt => evt.skill == event.name)
					.vars({
						skillName,
					})
					.step(async (event, trigger, player) => {
						player.removeAdditionalSkill(skillName);
						let cards = player.getExpansions("sxrmshefu_effect");
						if (cards.length) {
							await player.loseToDiscardpile(cards);
						}
					});
				if (targetx.countCards("he")) {
					const result = await targetx
						.chooseCard(get.prompt2("sxrmshefu"), "he", true)
						.set("ai", card => {
							let val = get.value(card);
							if (get.type(card) == "basic") {
								val *= 0.5;
							}
							if (get.color(card) == "black") {
								val *= 0.8;
							}
							return 6 - val;
						})
						.forResult();
					if (result.bool) {
						await targetx.useSkill("sxrmshefu", result.cards);
					}
				}
			}
			target
				.when({
					player: "phaseEnd",
				})
				.assign({
					lastDo: true,
				})
				.filter(evt => evt.skill == event.name)
				.step(async (event, trigger, player) => {
					for (let targetx of targets) {
						if (!targetx.getHistory("damage").length) {
							const card = new lib.element.VCard({ name: "sha", isCard: true });
							if (targetx.canUse(card, player, false)) {
								await targetx.useCard(card, player, false);
							}
						}
					}
				});
			target.insertPhase(event.name);
		},
		derivation: "sxrmshefu",
	},
	sxrmshefu: {
		audio: "shefu",
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			return player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), "he")
				.set("ai", card => {
					let val = get.value(card);
					if (get.type(card) == "basic") {
						val *= 0.5;
					}
					if (get.color(card) == "black") {
						val *= 0.8;
					}
					return 6 - val;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const next = player.addToExpansion(event.cards, player, "giveAuto");
			next.gaintag.add("sxrmshefu_effect");
			await next;
		},
		onremove(player) {
			let cards = player.getExpansions("sxrmshefu_effect");
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: "sxrmshefu_effect",
		subSkill: {
			effect: {
				trigger: {
					global: ["useCard"],
				},
				filter(event, player) {
					if (_status.currentPhase == player || event.player == player || event.all_excluded) {
						return false;
					}
					return (
						player.getExpansions("sxrmshefu_effect").some(card => {
							return get.color(card) == get.color(event.card) && get.type2(card) == get.type2(event.card);
						}) &&
						event.player.getHistory("lose", function (evt) {
							return (evt.relatedEvent || evt.getParent()) == event && evt.hs && evt.hs.length == event.cards.length;
						}).length
					);
				},
				async cost(event, trigger, player) {
					let effect = 0;
					if (trigger.card.name == "wuxie" || trigger.card.name == "shan") {
						if (get.attitude(player, trigger.player) < -1) {
							effect = -1;
						}
					} else if (trigger.targets?.length) {
						for (let i = 0; i < trigger.targets.length; i++) {
							effect += get.effect(trigger.targets[i], trigger.card, trigger.player, player);
						}
					}
					let str = "设伏：是否令" + get.translation(trigger.player);
					if (trigger.targets && trigger.targets.length) {
						str += "对" + get.translation(trigger.targets);
					}
					str += "使用的" + get.translation(trigger.card) + "失效？";
					const result = await player
						.chooseButton([str, player.getExpansions("sxrmshefu_effect")])
						.set("filterButton", button => {
							const { used } = get.event();
							return get.color(button.link) == get.color(used) && get.type2(button.link) == get.type2(used);
						})
						.set("ai", button => {
							const { choice } = get.event();
							if (choice) {
								return Math.random();
							}
							return 0;
						})
						.set("used", trigger.card)
						.set("choice", effect < 0)
						.forResult();
					event.result = {
						bool: result.bool,
						targets: [trigger.player],
						cards: result.bool ? result.links : [],
					};
				},
				async content(event, trigger, player) {
					await player.loseToDiscardpile(event.cards);
					trigger.targets.length = 0;
					trigger.all_excluded = true;
				},
				ai: {
					threaten: 1.8,
					expose: 0.3,
				},
				intro: {
					mark(dialog, storage, player) {
						var cards = player.getExpansions("sxrmshefu_effect");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
					markcount: "expansion",
				},
			},
		},
	},
	//伏寿
	sxrmmitu: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current.isDamaged());
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, 3], (card, player, target) => {
					return target.isDamaged();
				})
				.set("ai", target => {
					return get.attitude(get.player(), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			event.targets.sortBySeat();
			for (const target of event.targets) {
				const next = target.draw();
				next.gaintag.add("sxrmmitu");
				const result = await next.forResult();
				if (result?.length) {
					await target.showCards(result, "密图");
					event[target.playerid] = result[0];
				}
				target.addTempSkill("sxrmmitu_ai", "phaseChange");
			}
			for (const target of event.targets) {
				if (!game.hasPlayer(current => target.canCompare(current))) {
					continue;
				}
				const result = await player
					.chooseTarget(
						`为${get.translation(target)}指定拼点目标`,
						(card, player, target) => {
							return get.event().comparer.canCompare(target);
						},
						true
					)
					.set("comparer", target)
					.set("ai", target => {
						const { player, comparer } = get.event();
						return get.effect(target, { name: "sha" }, comparer, player);
					})
					.forResult();
				if (result.bool) {
					const targetx = result.targets[0],
						card = target.getCards("h").find(card => card.hasGaintag("sxrmmitu"));
					let bool = get.attitude(target, player) >= 0 ? get.effect(targetx, { name: "sha" }, target, target) > 0 : false;
					if (card && get.number(card) < 7 && get.attitude(target, player) > 0) {
						bool = false;
					}
					const result2 = await target
						.chooseBool(`是否与${get.translation(targetx)}进行拼点？`, "赢的角色视为对没赢的角色使用一张【杀】")
						.set("choice", bool)
						.forResult();
					if (result2.bool) {
						const result3 = await target.chooseToCompare(targetx).forResult();
						if (result3.winner) {
							const loser = [target, targetx].find(i => i != result3.winner),
								sha = new lib.element.VCard({ name: "sha", isCard: true });
							if (loser && result3.winner.canUse(sha, loser, false)) {
								await result3.winner.useCard(sha, loser, false);
							}
						}
					}
				}
			}
		},
		group: "sxrmmitu_benghuai",
		subSkill: {
			ai: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("sxrmmitu");
				},
				mod: {
					aiValue: (player, card, num) => {
						let evt = _status.event.getParent("sxrmmitu", true);
						if (!evt || !evt.player || get.attitude(player, evt.player) <= 0) {
							return;
						}
						if (num > 0 && get.itemtype(card) === "card" && card.hasGaintag("sxrmmitu")) {
							return -114514;
						}
					},
				},
			},
			benghuai: {
				trigger: {
					global: "compare",
				},
				getIndex(event, player) {
					const evt = event.getParent("sxrmmitu", true);
					if (!evt) {
						return [];
					}
					return [event.player, event.target].filter(current => {
						if (!evt.targets.includes(current)) {
							return false;
						}
						const card = event[event.player == current ? "card1" : "card2"],
							showed = evt[current.playerid];
						return showed && get.itemtype(showed) == "card" && showed != card;
					});
				},
				logTarget(event, player, name, index) {
					return index;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.loseMaxHp();
				},
			},
		},
	},
	sxrmqianliu: {
		trigger: {
			global: "useCardToTargeted",
		},
		filter(event, player) {
			return get.distance(player, event.target) <= 1 && event.card?.name == "sha";
		},
		frequent: true,
		logTarget: "target",
		async content(event, trigger, player) {
			const cards = get.bottomCards(4);
			await game.cardsGotoOrdering(cards);
			if (cards.map(i => get.suit(i)).toUniqued().length > 3) {
				const result = await player
					.chooseBool(`是否展示并获得${get.translation(cards)}？`)
					.set("frequentSkill", event.name)
					.forResult();
				if (result.bool) {
					await player.showCards(cards);
					await player.gain(cards, "gain2");
					return;
				}
			}
			const result = await player
				.chooseToMove()
				.set("list", [["牌堆顶"], ["牌堆底", cards]])
				.set("prompt", "点击或拖动将牌移动到牌堆顶或牌堆底")
				.set("processAI", list => {
					let cards = list[1][1],
						player = _status.event.player,
						target = _status.currentPhase || player,
						name = _status.event.getTrigger()?.name,
						countWuxie = current => {
							let num = current.getKnownCards(player, card => {
								return get.name(card, current) === "wuxie";
							});
							if (num && current !== player) {
								return num;
							}
							let skills = current.getSkills("invisible").concat(lib.skill.global);
							game.expandSkills(skills);
							for (let i = 0; i < skills.length; i++) {
								let ifo = get.info(skills[i]);
								if (!ifo) {
									continue;
								}
								if (ifo.viewAs && typeof ifo.viewAs != "function" && ifo.viewAs.name == "wuxie") {
									if (!ifo.viewAsFilter || ifo.viewAsFilter(current)) {
										num++;
										break;
									}
								} else {
									let hiddenCard = ifo.hiddenCard;
									if (typeof hiddenCard == "function" && hiddenCard(current, "wuxie")) {
										num++;
										break;
									}
								}
							}
							return num;
						},
						top = [];
					switch (name) {
						case "phaseJieshu": {
							target = target.next;
							cards.sort((a, b) => {
								return get.value(b, target) - get.value(a, target);
							});
							while (cards.length) {
								if (get.value(cards[0], target) > 6) {
									top.push(cards.shift());
								} else {
									break;
								}
							}
							return [top, cards];
						}
						case "phaseZhunbei": {
							let att = get.sgn(get.attitude(player, target)),
								judges = target.getCards("j"),
								needs = 0,
								wuxie = countWuxie(target);
							for (let i = Math.min(cards.length, judges.length) - 1; i >= 0; i--) {
								let j = judges[i],
									cardj = j.viewAs ? { name: j.viewAs, cards: j.cards || [j] } : j;
								if (wuxie > 0 && get.effect(target, j, target, target) < 0) {
									wuxie--;
									continue;
								}
								let judge = get.judge(j);
								cards.sort((a, b) => {
									return (judge(b) - judge(a)) * att;
								});
								if (judge(cards[0]) * att < 0) {
									needs++;
									continue;
								} else {
									top.unshift(cards.shift());
								}
							}
							if (needs > 0 && needs >= judges.length) {
								return [top, cards];
							}
							cards.sort((a, b) => {
								return (get.value(b, target) - get.value(a, target)) * att;
							});
							while (needs--) {
								top.unshift(cards.shift());
							}
							while (cards.length) {
								if (get.value(cards[0], target) > 6 == att > 0) {
									top.push(cards.shift());
								} else {
									break;
								}
							}
							return [top, cards];
						}
						default:
							cards.sort((a, b) => {
								return get.value(b, target) - get.value(a, target);
							});
							while (cards.length) {
								if (get.value(cards[0], target) > 6) {
									top.push(cards.shift());
								} else {
									break;
								}
							}
							return [top, cards];
					}
				})
				.forResult();
			let top = result.moved[0],
				bottom = result.moved[1];
			top.reverse();
			for (let i = 0; i < top.length; i++) {
				ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
			}
			for (let i = 0; i < bottom.length; i++) {
				ui.cardPile.appendChild(bottom[i]);
			}
			game.addCardKnower(top, player);
			game.addCardKnower(bottom, player);
			player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
			game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
			game.updateRoundNumber();
			await game.delayx();
		},
	},
	//荀彧
	sxrmhuice: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		async content(event, trigger, player) {
			const result1 = await player.chooseToCompare(event.target).forResult();
			if (game.hasPlayer(current => current != event.target && player.canCompare(current))) {
				const result = await player
					.chooseTarget("迴策：与另一名角色进行拼点", true, (card, player, target) => {
						return get.event().first != target && player.canCompare(target);
					})
					.set("first", event.target)
					.set("ai", target => {
						return get.damageEffect(target, get.player());
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				const result2 = await player.chooseToCompare(result.targets[0]).forResult();
				if (result1 && result2) {
					if (result1.winner) {
						for (const target of [player, result.targets[0]]) {
							if (target != result2.winner) {
								result1.winner.line(target, "green");
								await target.damage(result1.winner);
							}
						}
					}
					if (result2.winner) {
						for (const target of [player, event.target]) {
							if (target != result1.winner) {
								result2.winner.line(target, "green");
								await target.damage(result2.winner);
							}
						}
					}
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target: -1,
				player(player, target) {
					const targets = game.filterPlayer(current => {
						return player.canCompare(current) && get.damageEffect(current, current, player) > 0;
					});
					return targets.length > 1 ? 1 : -2;
				},
			},
		},
	},
	sxrmyihe: {
		trigger: {
			global: "damageBegin1",
		},
		filter(event, player) {
			if (player != _status.currentPhase || !event.source) {
				return false;
			}
			let bool1 = get.sgn(event.source.hp - event.source.countCards("h")),
				bool2 = get.sgn(event.player.hp - event.player.countCards("h"));
			return !player.getStorage("sxrmyihe_used").includes(bool1 == bool2);
		},
		forced: true,
		logTarget: "player",
		check(event, player) {
			let bool1 = get.sgn(event.source.hp - event.source.countCards("h")),
				bool2 = get.sgn(event.player.hp - event.player.countCards("h"));
			if (get.attitude(player, event.player) > 0) {
				return bool1 == bool2 && get.attitude(player, event.source) >= 0;
			}
			return bool1 != bool2;
		},
		prompt2(event, player) {
			let bool1 = get.sgn(event.source.hp - event.source.countCards("h")),
				bool2 = get.sgn(event.player.hp - event.player.countCards("h"));
			if (bool1 == bool2) {
				return `令其和${get.translation(event.source)}依次摸两张牌`;
			}
			return "令此伤害+1";
		},
		async content(event, trigger, player) {
			let bool1 = get.sgn(trigger.source.hp - trigger.source.countCards("h")),
				bool2 = get.sgn(trigger.player.hp - trigger.player.countCards("h"));
			player.addTempSkill("sxrmyihe_used");
			player.markAuto("sxrmyihe_used", bool1 == bool2);
			if (bool1 == bool2) {
				await trigger.player.draw(2);
				await trigger.source.draw(2);
			} else {
				trigger.num++;
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	sxrmjizhi: {
		trigger: {
			player: "dying",
		},
		filter(event, player) {
			if (
				game
					.getGlobalHistory(
						"everything",
						evt => {
							return evt.name == "dying" && evt.player == player;
						},
						event
					)
					.indexOf(event) != 0
			) {
				return false;
			}
			return player.hp <= 0;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.recover();
		},
		mod: {
			targetEnabled(card, player, target) {
				if (card.name == "tao" && target != player) {
					return false;
				}
			},
		},
	},
	//曹丕
	sxrmzhengsi: {
		enable: "phaseUse",
		filterTarget(card, player, target) {
			if (ui.selected.targets.length > 1 && !ui.selected.targets.includes(player)) {
				if (target != player) {
					return false;
				}
			}
			return target.countCards("h");
		},
		selectTarget: 3,
		complexSelect: true,
		targetprompt: ["首先展示", "随后展示"],
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const target = event.targets[0],
				targets = event.targets.slice(0).remove(target);
			const result = await target
				.chooseCard("争嗣：展示一张手牌", true, "h")
				.set("ai", card => {
					return 10 - Math.abs(7 - get.number(card));
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			let cards = result.cards.slice(0, 1);
			await target.showCards(result.cards);
			const next = player.chooseCardOL(targets, "h", true, "争嗣：展示一张手牌");
			next._args.remove("glow_result");
			const result2 = await next.forResult();
			if (!result2) {
				return;
			}
			await targets[0].showCards(result2[0].cards);
			await targets[1].showCards(result2[1].cards);
			await game.delayx();
			cards.addArray(result2[0].cards).addArray(result2[1].cards);
			const targetx = [target, ...targets];
			game.log(cards, targetx);
			let max = cards.map(i => get.number(i)).maxBy(i => i),
				min = cards.map(i => get.number(i)).minBy(i => i);
			for (let i = 0; i < cards.length; i++) {
				if (get.number(cards[i]) == max) {
					await targetx[i].chooseToDiscard(2, true, "h");
				}
			}
			for (let i = 0; i < cards.length; i++) {
				if (get.number(cards[i]) == min) {
					await targetx[i].loseHp();
				}
			}
		},
		ai: {
			order: 3,
			result: {
				target(player, target) {
					if (target == player) {
						return 0.1;
					}
					return -2;
				},
				player(player, target) {
					if (player.hp > 2 && player.countCards("h") > 2) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	sxrmchengming: {
		trigger: {
			player: "phaseUseEnd",
		},
		getIndex(event, player) {
			let targets = [],
				bool = false;
			game.filterPlayer(current => {
				current.checkHistory("useSkill", evt => {
					if (evt.skill != "sxrmzhengsi" || evt?.event?.getParent("phaseUse") != event) {
						return false;
					}
					if (current == player) {
						bool = true;
					}
					targets.addArray(evt.targets || []);
				});
			});
			let result = [];
			if (bool && player.countCards("h") == targets.map(i => i.countCards("h")).maxBy(i => i)) {
				result.push("recover");
			}
			if (bool && player.hp == targets.map(i => i.hp).maxBy(i => i)) {
				result.push(targets.filter(i => i != player));
			}
			return result;
		},
		filter(event, player, name, data) {
			if (data == "recover") {
				return player.isDamaged();
			}
			return data.some(i => i != player && i.countGainableCards(player, "he"));
		},
		logTarget(event, player, name, data) {
			if (data == "recover") {
				return player;
			}
			return data;
		},
		prompt2(event, player, name, data) {
			if (data == "recover") {
				return "回复2点体力";
			}
			return `获得这些角色各一张牌`;
		},
		async content(event, trigger, player) {
			const data = event.indexedData;
			if (data == "recover") {
				await player.recover(2);
			} else {
				await player.gainMultiple(event.targets, "he");
			}
		},
		ai: {
			combo: "sxrmzhengsi",
		},
	},
	//王垕
	sxrmjugu: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("he"));
		},
		async cost(event, trigger, player) {
			const lose_list = [],
				selected = [];
			let forced = false;
			do {
				const result = await player
					.chooseTarget(forced ? "聚谷：是否继续选择牌？" : get.prompt2(event.skill))
					.set("filterTarget", (card, player, target) => {
						const { selected, lose_list: list } = get.event(),
							num = list.map(i => i[0]).indexOf(target);
						if (num != -1) {
							target.prompt(`已选择 ${list[num][1].length}张`);
						}
						return target.countCards("he", card => !selected.includes(card));
					})
					.set("lose_list", lose_list)
					.set("selected", selected)
					.set("ai", target => {
						const { player, selected } = get.event();
						if (selected.length >= 3) {
							return 0;
						}
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					})
					.forResult();
				if (!result.bool) {
					break;
				}
				forced = true;
				const target = result.targets[0],
					num = lose_list.map(i => i[0]).indexOf(target);
				const result2 = await player
					.choosePlayerCard(target, "he", [1, 5 - selected.length], true, "选择要明置于牌堆顶的牌")
					.set("filterButton", button => {
						return !get.event().selected.includes(button.link);
					})
					.set("selected", selected)
					.set("ai", button => {
						const { player, selected } = get.event();
						if (selected.length + ui.selected.buttons.length >= 3) {
							return 0;
						}
						return get.buttonValue(button);
					})
					.forResult();
				if (!result2.bool) {
					break;
				}
				const cards = result2.links;
				if (num != -1) {
					lose_list[num][1].addArray(cards);
				} else {
					lose_list.add([target, cards]);
				}
				selected.addArray(cards);
			} while (selected.length < 5);
			event.result = {
				bool: forced,
				targets: lose_list.map(i => i[0]),
				cards: selected,
				cost_data: lose_list,
			};
		},
		async content(event, trigger, player) {
			let cards = event.cards;
			while (cards.length) {
				const card = cards.shift(),
					owner = get.owner(card);
				owner.$throw(card, 1000);
				game.log(player, "将", owner, "的", card, "置于了牌堆顶");
				await owner.lose([card], ui.cardPile, "insert", "visible");
				if (!trigger.getParent().jugu) {
					trigger.getParent().jugu = [];
				}
				trigger.getParent().jugu.push([owner, card]);
			}
			game.addGlobalSkill("sxrmjugu_log");
		},
		group: "sxrmjugu_return",
		subSkill: {
			return: {
				trigger: {
					player: "phaseEnd",
				},
				filter(event, player) {
					return event?.jugu?.length;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					for (let i of trigger.jugu) {
						let card = get.cardPile2(card => card == i[1]);
						if (card) {
							await i[0].gain(card, "gain2");
						}
					}
					const targets = trigger.jugu
						.map(i => i[0])
						.filter(i => i.isIn())
						.toUniqued();
					if (targets.length) {
						await game.asyncDraw(targets);
					}
				},
			},
			log: {
				charlotte: true,
				direct: true,
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					if (!event.getg || !event.getg(player).length || event.getParent("sxrmjugu_return", true)) {
						return false;
					}
					let evt = event.getParent("phase", true);
					return evt?.jugu?.map(i => i[1]).some(i => event.getg(player).includes(i));
				},
				async content(event, trigger, player) {
					let evt = trigger.getParent("phase", true),
						cards = trigger.getg(player),
						log = [];
					for (let i = evt.jugu.length - 1; i >= 0; i--) {
						if (cards.includes(evt.jugu[i][1])) {
							log.add(evt.jugu[i][1]);
							//evt.jugu.splice(i, 1);
						}
					}
					if (!trigger.visible) {
						game.log(player, "获得的牌中有明置牌", log);
					}
				},
			},
		},
	},
};

export default skills;
