import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//虎牢神关羽
	pewushen: {
		audio: "wushen",
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
			cardUsable(card) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === "heart" || suit === "unsure") {
						return Infinity;
					}
				}
			},
		},
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && get.suit(event.card) == "heart";
		},
		async content(event, trigger, player) {
			trigger.directHit.addArray(game.players);
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				if (player.stat[player.stat.length - 1].card.sha > 0) {
					player.stat[player.stat.length - 1].card.sha--;
				}
			}
		},
		group: ["pewushen_gain"],
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondSha") && current < 0) {
						return 0.6;
					}
				},
			},
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return arg.card.name == "sha" && get.suit(arg.card) == "heart";
			},
		},
		subSkill: {
			gain: {
				audio: "wushen",
				trigger: {
					global: ["loseAfter", "loseAsyncAfter"],
				},
				filter(event, player) {
					return get.info("pewushen_gain").getCards(event, player)?.length > 0;
				},
				getCards(event, player) {
					const cards = [];
					if (event.type != "discard") {
						return cards;
					}
					game.filterPlayer2(target => target != player, void 0, true).forEach(target => {
						const cardsx = event.getd(target, "cards2").filter(card => get.suit(card) == "heart" && get.position(card) == "d");
						if (cardsx.length) {
							cards.addArray(cardsx);
						}
					});
					return cards;
				},
				prompt2(event, player) {
					return `获得${get.translation(get.info("pewushen_gain").getCards(event, player))}`;
				},
				check: () => true,
				async content(event, trigger, player) {
					const cards = get.info(event.name).getCards(trigger, player);
					await player.gain({ cards, animate: "gain2" });
				},
			},
		},
	},
	//虎牢神诸葛亮
	pekuangfeng: {
		audio: "kuangfeng",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.getExpansions("qixing").length;
		},
		async cost(event, trigger, player) {
			const {
				bool,
				targets,
				links: cost_data,
			} = await player
				.chooseButtonTarget({
					createDialog: [get.prompt2(event.skill), player.getExpansions("qixing")],
					selectButton: [1, game.countPlayer()],
					filterTarget: true,
					selectTarget() {
						return ui.selected.buttons.length;
					},
					complexSelect: true,
					ai1(button) {
						if (
							game.hasPlayer(target => {
								return get.attitude(get.player(), target) < 0;
							})
						) {
							return 1;
						}
						return 0;
					},
					ai2(target) {
						return -get.attitude(get.player(), target);
					},
				})
				.forResult();
			event.result = {
				bool: bool,
				targets: targets?.sortBySeat(),
				cost_data: cost_data,
			};
		},
		async content(event, trigger, player) {
			const { targets, cost_data: cards } = event;
			targets.forEach(target => {
				target.addAdditionalSkill(`${event.name}_${player.playerid}`, event.name + "_mark");
				target.markAuto(event.name + "_mark", [player]);
			});
			player.addTempSkill(event.name + "_effect", { player: "phaseBeginStart" });
			await player.loseToDiscardpile(cards);
			await game.doAsyncInOrder(game.filterPlayer(), async target => {
				const card = get.autoViewAs({ name: "sha", nature: "fire", isCard: true });
				if (target.hasUseTarget(card, false, false)) {
					await target.chooseUseTarget({ card, addCount: false, nodistance: true, forced: true });
				}
			});
		},
		subSkill: {
			mark: {
				charlotte: true,
				intro: {
					content(storage) {
						return `共有${storage.length}枚标记`;
					},
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "fireDamage") && current < 0) {
								return 1.5;
							}
						},
					},
				},
			},
			effect: {
				audio: "pekuangfeng",
				trigger: { global: "damageBegin3" },
				filter(event, player) {
					return event.hasNature("fire") && event.player.getStorage("pekuangfeng_mark").includes(player);
				},
				charlotte: true,
				forced: true,
				logTarget: "player",
				async content(event, trigger, player) {
					trigger.num++;
				},
				onremove(player) {
					game.countPlayer2(current => {
						if (current.getStorage("pekuangfeng_mark").includes(player)) {
							current.unmarkAuto("pekuangfeng_mark", player);
							current.removeAdditionalSkill(`pekuangfeng_${player.playerid}`);
						}
					}, true);
				},
			},
		},
		ai: {
			combo: "qixing",
		},
	},
	petianlin: {
		audio: "dawu",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.getExpansions("qixing").length;
		},
		async cost(event, trigger, player) {
			const {
				bool,
				targets,
				links: cost_data,
			} = await player
				.chooseButtonTarget({
					createDialog: [get.prompt2(event.skill), player.getExpansions("qixing")],
					selectButton: [1, game.countPlayer()],
					filterTarget: true,
					selectTarget() {
						return ui.selected.buttons.length;
					},
					complexSelect: true,
					ai1(button) {
						const { player, allUse } = get.event();
						const targets = game.filterPlayer(target => {
							if (target.isMin() || target.hasSkill("biantian2") || target.hasSkill("petianlin_mark")) {
								return false;
							}
							let att = get.attitude(player, target);
							if (att >= 4) {
								if (target.hp > 2 && (target.isHealthy() || target.hasSkillTag("maixie"))) {
									return false;
								}
								if (allUse || target.hp == 1) {
									return true;
								}
								if (target.hp == 2 && target.countCards("he") <= 2) {
									return true;
								}
							}
							return false;
						});
						if (ui.selected.buttons.length < targets.length) {
							return 1;
						}
						return 0;
					},
					ai2(target) {
						const { player, allUse } = get.event();
						if (target.isMin() || target.hasSkill("biantian2") || target.hasSkill("petianlin_mark")) {
							return 0;
						}
						let att = get.attitude(player, target);
						if (att >= 4) {
							if (target.hp > 2 && (target.isHealthy() || target.hasSkillTag("maixie"))) {
								return 0;
							}
							if (allUse || target.hp == 1) {
								return att;
							}
							if (target.hp == 2 && target.countCards("he") <= 2) {
								return att * 0.7;
							}
							return 0;
						}
						return -1;
					},
				})
				.set("allUse", player.getExpansions("qixing").length >= game.countPlayer(current => get.attitude(player, current) > 4) * 2)
				.forResult();
			event.result = {
				bool: bool,
				targets: targets?.sortBySeat(),
				cost_data: cost_data,
			};
		},
		async content(event, trigger, player) {
			const { targets, cost_data: cards } = event;
			targets.forEach(target => {
				target.addAdditionalSkill(`${event.name}_${player.playerid}`, event.name + "_mark");
				target.markAuto(event.name + "_mark", [player]);
			});
			player.addTempSkill(event.name + "_effect", { player: "phaseBeginStart" });
			await player.loseToDiscardpile(cards);
		},
		ai: {
			combo: "qixing",
		},
		subSkill: {
			effect: {
				audio: "dawu",
				trigger: { global: "damageBegin4" },
				filter(event, player) {
					return !event.hasNature("thunder") && event.player.getStorage("petianlin_mark").includes(player);
				},
				forced: true,
				charlotte: true,
				logTarget: "player",
				async content(event, trigger, player) {
					trigger.cancel();
					await player.draw({ num: player.countExpansions("qixing") });
				},
				onremove(player) {
					game.countPlayer2(current => {
						if (current.getStorage("petianlin_mark").includes(player)) {
							current.unmarkAuto("petianlin_mark", [player]);
							current.removeAdditionalSkill(`petianlin_${player.playerid}`);
						}
					}, true);
				},
			},
			mark: {
				charlotte: true,
				ai: {
					nofire: true,
					nodamage: true,
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "damage") && !get.tag(card, "thunderDamage")) {
								return "zeroplayertarget";
							}
						},
					},
				},
				intro: {
					content(storage) {
						return `共有${storage.length}枚标记`;
					},
				},
			},
		},
	},
	//虎牢神吕蒙
	peshelie: {
		audio: "shelie",
		trigger: {
			player: "phaseDrawBegin1",
			source: "damageBegin2",
		},
		filter(event, player) {
			if (event.name == "phaseDraw") {
				return !event.numFixed;
			}
			return true;
		},
		async content(event, trigger, player) {
			if (trigger.name == "phaseDraw") {
				trigger.changeToZero();
			}
			const cards = get.cards(5, true);
			await player.showCards(cards, `${get.translation(player)}发动了【${get.translation(event.name)}】`, true).set("clearArena", false);
			const list = cards.map(card => get.suit(card)).unique();
			const result = await player
				.chooseCardButton(`涉猎：获取花色各不相同的牌`, cards, list.length, true)
				.set("filterButton", function (button) {
					for (let i = 0; i < ui.selected.buttons.length; i++) {
						if (get.suit(ui.selected.buttons[i].link) == get.suit(button.link)) {
							return false;
						}
					}
					return true;
				})
				.set("ai", function (button) {
					return get.value(button.link, _status.event.player);
				})
				.forResult();
			game.broadcastAll(ui.clear);
			if (result?.links?.length) {
				await player.gain(result.links, "gain2");
			}
		},
		ai: {
			threaten: 1.2,
		},
	},
	pegongxin: {
		audio: "gongxin",
		enable: "phaseUse",
		usable(skill, player) {
			if (get.event().name == "chooseToUse" && get.event().type == "phase") {
				return 1;
			}
			return Infinity;
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			if (event.name == "damage") {
				return event.source?.isIn() && event.source.countCards("h") > 0;
			}
			return true;
		},
		logTarget: "source",
		check(event, player) {
			return get.attitude(player, event.source) < 0;
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const cards = target.getCards("h");
			const result = await player
				.chooseToMove_new("攻心")
				.set("list", [
					[get.translation(target) + "的手牌", cards],
					[["弃置"], ["置于牌堆顶"]],
				])
				.set("filterOk", moved => {
					return (
						moved[1]
							.slice()
							.concat(moved[2])
							.filter(card => get.suit(card) == "heart").length == 1
					);
				})
				.set("filterMove", (from, to, moved) => {
					if (moved[0].includes(from.link) && moved[1].length + moved[2].length >= 1 && [1, 2].includes(to)) {
						return false;
					}
					return get.suit(from) == "heart";
				})
				.set("processAI", list => {
					let card = list[0][1]
						.slice()
						.filter(card => {
							return get.suit(card) == "heart";
						})
						.sort((a, b) => {
							return get.value(b) - get.value(a);
						})[0];
					if (!card) {
						return false;
					}
					return [list[0][1].slice().remove(card), [card], []];
				})
				.forResult();
			if (result.bool) {
				if (result.moved[1].length) {
					await target.discard(result.moved[1]);
				} else {
					await player.showCards(result.moved[2], get.translation(player) + "对" + get.translation(target) + "发动了【攻心】");
					await target.lose(result.moved[2], ui.cardPile, "visible", "insert");
				}
			}
		},
		ai: {
			threaten: 1.5,
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
			order: 10,
			expose: 0.4,
		},
	},
	//虎牢神周瑜
	peqinyin: {
		audio: "qinyin",
		trigger: {
			player: "phaseDiscardEnd",
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl({
					prompt: get.prompt2(event.skill),
					controls: ["失去体力", "回复体力", "cancel2"],
					choice: (() => {
						let recover = 0;
						let lose = 0;
						const players = game.filterPlayer();
						for (const current of players) {
							if (current.hp < current.maxHp) {
								if (get.attitude(player, current) > 0) {
									if (current.hp < 2) {
										lose--;
										recover += 0.5;
									}
									lose--;
									recover++;
								} else if (get.attitude(player, current) < 0) {
									if (current.hp < 2) {
										lose++;
										recover -= 0.5;
									}
									lose++;
									recover--;
								}
							} else {
								if (get.attitude(player, current) > 0) {
									lose--;
								} else if (get.attitude(player, current) < 0) {
									lose++;
								}
							}
						}
						if (lose > recover && lose > 0) {
							return 0;
						}
						if (lose < recover && recover > 0) {
							return 1;
						}
						return 2;
					})(),
				})
				.forResult();
			if (result.control != "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.index,
				};
			}
		},
		async content(event, trigger, player) {
			const { cost_data: index } = event;
			await game.doAsyncInOrder(game.filterPlayer(), async target => {
				if (index == 0) {
					return target.loseHp();
				} else {
					return target.recover();
				}
			});
		},
		ai: {
			expose: 0.1,
			threaten: 2,
		},
	},
	peyeyan: {
		audio: "yeyan",
		limited: true,
		enable: "phaseUse",
		async precontent(event, trigger, player) {
			const name = event.name.slice(4);
			const evt = event.getParent();
			const num = 3 - player.countMark("peyeyan_count");
			evt.set("_backupevent", `${name}_backup`);
			evt.set("openskilldialog", `###${get.translation(name)}###你可将至多${num}点火焰伤害分配给至多三名角色，若有角色因此技能死亡，你重置此技能。`);
			evt.backup(`${name}_backup`);
			evt.set("norestore", true);
			evt.set("custom", {
				add: {
					confirm(bool) {
						const event = get.event();
						if (bool === false) {
							//取消之后restore什么的，照搬ui.click.cancel的逻辑
							if (event.skillDialog && get.objtype(event.skillDialog) == "div") {
								event.skillDialog.close();
							}
							if (typeof event.dialog == "string" && event.isMine()) {
								event.dialog = ui.create.dialog(event.dialog);
							}
							if (_status.event.type == "phase" && ui.confirm) {
								ui.confirm.classList.add("removing");
							}
							// ui.control.addTempClass('nozoom',100);
							event.restore();
							var cards = event.player.getCards("hej");
							for (var i = 0; i < cards.length; i++) {
								cards[i].recheck("useSkill");
							}
							//关闭回合结束按钮，不然会多出来
							if (event.endButton) {
								event.endButton.close();
								delete event.endButton;
							}
							game.uncheck();
							//要复原custom，孩子们
							event.custom = {
								add: {},
								replace: {},
							};
							event.set("peyeyan_exclude", true);
							event.goto(0);
						}
					},
				},
				replace: {
					target(target, e) {
						const event = get.event();
						if (!event.isMine() || !event.filterTarget(void 0, event.player, target)) {
							return;
						}
						if (target.classList.contains("selectable") == false) {
							return;
						}
						target.unprompt();
						target.classList.add("selected");
						ui.selected.targets.push(target);
						const count = get.numOf(ui.selected.targets, target);
						target.prompt(`伤害×${count}`);
						game.check();
					},
				},
			});
			evt.goto(0);
		},
		ai: {
			order(item, player) {
				if (get.event().peyeyan_exclude) {
					return 0;
				}
				return game.hasPlayer(target => {
					const eff = get.damageEffect(target, player, player, "fire");
					return eff > 0 && 3 - player.countMark("peyeyan_count") >= target.getHp();
				})
					? 10
					: 1;
			},
			result: {
				player: 1,
			},
		},
		subSkill: {
			backup: {
				audio: "peyeyan",
				line: "fire",
				forceDie: true,
				animationColor: "metal",
				skillAnimation: "legend",
				filterTarget(card, player, target) {
					const { targets } = ui.selected;
					if (targets?.length >= 3 - get.player().countMark("peyeyan_count")) {
						return false;
					}
					return true;
				},
				complexSelect: true,
				selectTarget() {
					const num = 3 - get.player().countMark("peyeyan_count");
					return [1, num + 1];
				},
				ai1: () => 1,
				ai2(target) {
					const eff = get.damageEffect(target, get.player(), get.player(), "fire");
					if (get.numOf(ui.selected.targets, target) >= target.getHp()) {
						return eff;
					}
					return eff + 2 + 1 / target.getHp();
				},
				multitarget: true,
				multiline: true,
				async content(event, trigger, player) {
					const name = event.name.slice(0, -7);
					player.awakenSkill(name);
					const { targets } = event;
					const realTargets = targets.toUniqued();
					await game.doAsyncInOrder(realTargets, async target => {
						return target.damage({ num: get.numOf(targets, target), nature: "fire" });
					});
					if (
						game.hasGlobalHistory("everything", evt => {
							if (evt.name != "die") {
								return false;
							}
							const evtx = evt.reason;
							return evtx?.name == "damage" && (evtx.getParent() == event || (!evtx.lianhuanable && evtx.getTrigger()?.getParent() == event));
						})
					) {
						player.refreshSkill(name);
						player.addMark(name + "_count", 1, false);
					}
				},
			},
			count: {
				intro: {
					markcount: storage => -storage,
					content: "可分配伤害-#",
				},
			},
		},
	},
	//虎牢神吕布
	peshenwei: {
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.getHp() > 0;
		},
		async cost(event, trigger, player) {
			const len = Math.min(4, player.getHp());
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					selectTarget: [1, len],
					filterTarget(card, player, target) {
						return target.countDiscardableCards(target, "he") > 0;
					},
					ai(target) {
						const player = get.player();
						if (player.hp <= ui.selected.targets?.length) {
							return 0;
						}
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			await player.loseHp(targets.length);
			await game.doAsyncInOrder(targets, async target => {
				const result = await target
					.chooseToDiscard({
						position: "he",
						selectCard: 2,
						forced: true,
					})
					.forResult();
				const { cards } = result;
				if (!cards.some(card => get.name(card) == "shan")) {
					await player.turnOver();
					await player.gainPlayerCard({ target, position: "h", forced: true });
				}
			});
		},
	},
	pexiuluo: {
		forced: true,
		mod: {
			cardname(card, player) {
				if (["tao", "jiu"].includes(card.name)) {
					return "sha";
				}
			},
			cardnature(card, player) {
				if (card.name == "tao") {
					return "fire";
				}
				if (card.name == "jiu") {
					return "thunder";
				}
			},
			cardUsable(card, player) {
				if (get.is.ordinaryCard(card) && ["tao", "jiu"].includes(card.cards[0].name) && get.name(card) == "sha") {
					return Infinity;
				}
			},
		},
		trigger: {
			player: ["damageBegin3", "useCard1"],
			source: "damageBegin1",
		},
		filter(event, player) {
			if (event.name == "useCard") {
				return get.name(event.card) == "sha" && event.modSkill.cardname == "pexiuluo" && event.addCount != false;
			}
			return true;
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				trigger.addCount = false;
				const stat = player.getStat().card,
					name = trigger.card.name;
				if (typeof stat[name] == "number") {
					stat[name]--;
				}
				game.log(trigger.card, "不计入次数");
			} else {
				trigger.num++;
			}
		},
	},
	peduomo: {
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		trigger: {
			player: "dying",
		},
		check: () => true,
		derivation: ["pedaojue"],
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			if (player.countCards("h") > 0) {
				await player.recoverTo(player.countCards("h"));
			}
			await player.addSkills(get.info(event.name).derivation);
		},
	},
	pedaojue: {
		trigger: {
			player: "useCardToPlayer",
		},
		filter(event, player) {
			return get.name(event.card) == "sha" && event.targets.length == 1 && get.info("pedaojue").getSkills(player).length > 0 && get.info("pedaojue").getSkills(event.target).length > 0;
		},
		getSkills(player) {
			return player.getStockSkills(true, true).filter(i => !get.info(i).charlotte && player.hasSkill(i, null, false, false));
		},
		async cost(event, trigger, player) {
			const { target } = trigger;
			const list1 = get.info(event.skill).getSkills(player);
			const list2 = get.info(event.skill).getSkills(target);
			const result = await player
				.chooseButton({
					createDialog: [get.prompt2(event.skill, target), `<div class="text center">你的技能</div>`, [list1.map(i => [i, player.name]), "skill"], `<div class="text center">${get.translation(target)}的技能</div>`, [list2.map(i => [i, target.name]), "skill"]],
					selectButton: 2,
					filterButton(button) {
						if (!ui.selected.buttons?.length) {
							return get.event().list1.includes(button.link);
						}
						return get.event().list2.includes(button.link);
					},
					ai(button) {
						return Math.random() - 0.5;
					},
				})
				.set("list1", list1)
				.set("list2", list2)
				.forResult();
			if (result.bool && result.links?.length) {
				event.result = {
					bool: true,
					cost_data: result.links,
				};
			}
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: list,
			} = event;
			const map = player.getStorage(event.name + "clear", {});
			map[target.playerid] ??= [[], []];
			map[target.playerid][0].push(list[0]);
			map[target.playerid][1].push(list[1]);
			player.addTempSkill(event.name + "_clear");
			player.setStorage(event.name + "_clear", map, true);
			await player.changeSkills([list[1]], [list[0]]).set("forceDie", true).set("includeOut", true);
			await target.changeSkills([list[0]], [list[1]]).set("forceDie", true).set("includeOut", true);
		},
		subSkill: {
			clear: {
				charlotte: true,
				intro: {
					content(map, player) {
						if (!map) {
							return "无";
						}
						let str = "";
						for (const id in map) {
							const list = map[id];
							const target = (_status.connectMode ? lib.playerOL : game.playerMap)[id];
							str += `<li>${get.translation(target)}：${get.translation(list[0])}|${get.translation(list[1])}<br>`;
						}
						return str;
					},
				},
				onremove(player, skill) {
					const map = player.getStorage(skill, {});
					if (Object.keys(map)?.length) {
						for (const id in map) {
							const list = map[id];
							const target = (_status.connectMode ? lib.playerOL : game.playerMap)[id];
							player
								.changeSkills(list[0], list[1])
								.set("forceDie", true)
								.set("includeOut", true)
								.set("$handle", (player, addSkill, removeSkill) => {
									player.addSkillLog(addSkill);
									game.broadcastAll(player => {
										player.skills.sort((a, b) => {
											const getNum = function (skill, player) {
												const skills = player.getStockSkills(true, true);
												return skills.includes(skill) ? skills.indexOf(skill) : skills.length;
											};
											return getNum(a, player) - getNum(b, player);
										});
									}, player);
									player.update();
									player.removeSkillLog(removeSkill);
								});
							target
								.changeSkills(list[1], list[0])
								.set("forceDie", true)
								.set("includeOut", true)
								.set("$handle", (player, addSkill, removeSkill) => {
									player.addSkillLog(addSkill);
									game.broadcastAll(player => {
										player.skills.sort((a, b) => {
											const getNum = function (skill, player) {
												const skills = player.getStockSkills(true, true);
												return skills.includes(skill) ? skills.indexOf(skill) : skills.length;
											};
											return getNum(a, player) - getNum(b, player);
										});
									}, player);
									player.update();
									player.removeSkillLog(removeSkill);
								});
						}
						delete player.storage[skill];
					}
				},
			},
		},
	},
};

export default skills;
