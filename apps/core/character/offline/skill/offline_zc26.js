import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//26版线下
	zc26_haoshi: {
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed;
		},
		check(event, player) {
			let maxList = game.filterPlayer().map(current => {
					let num = current.countCards("h");
					if (current == player) {
						num += event.num + 2;
					}
					return num;
				}),
				minList = game.filterPlayer(current => current.isMinHandcard());
			let max = Math.max(...maxList);
			if (maxList.filter(i => i == max).length > 1) {
				max = null;
			}
			if (!max) {
				return true;
			}
			if (minList.some(min => get.attitude(player, min) > 0)) {
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			trigger.num += 2;
			player
				.when({ player: "phaseDrawEnd" })
				.filter(evt => evt == trigger)
				.step(async function (event, trigger, player) {
					const max = game.findPlayer(current => current.isMaxHandcard(true)),
						minList = game.filterPlayer(current => current.isMinHandcard());
					if (!max) {
						return;
					}
					let targets;
					if (minList.length == 1) {
						targets = minList;
					} else {
						targets = (
							await player
								.chooseTarget(true, `好施：选择一名手牌最少的角色获得${get.translation(max)}的一半手牌（向下取整）`)
								.set("filterTarget", (_, player, target) => target.isMinHandcard())
								.set("ai", target => get.attitude(get.player(), target) * (target.getDamagedHp() + 1))
								.forResult()
						).targets;
					}
					if (targets?.length) {
						const min = targets[0];
						if (max.countGainableCards(min, "h") && Math.floor(max.countCards("h") / 2)) {
							await max.chooseToGive(true, min, Math.floor(max.countCards("h") / 2));
						}
					}
				});
		},
	},
	zc26_dimeng: {
		usable: 1,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				const num = current.countCards("h");
				return game.hasPlayer(current2 => {
					if (current2 == current || current2 == player) {
						return false;
					}
					return Math.abs(num - current2.countCards("h")) < 3;
				});
			});
		},
		selectTarget: 2,
		complexTarget: true,
		filterTarget(_, player, target) {
			if (target == player) {
				return false;
			}
			if (!ui.selected.targets.length) {
				return true;
			}
			return Math.abs(ui.selected.targets[0].countCards("h") - target.countCards("h")) < 3;
		},
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const targets = event.targets.slice().sortBySeat(_status.currentPhase);
			while (targets.length) {
				let num = 3;
				const target = targets.shift();
				while (num > 0) {
					num--;
					if (!target.isIn()) {
						break;
					}
					const result = await target
						.chooseToUse()
						.set("filterCard", (card, player, event) => {
							if (get.position(card) != "h") {
								return false;
							}
							return lib.filter.filterCard.apply(this, [card, player, event]);
						})
						.forResult();
					if (!result?.bool) {
						break;
					}
				}
			}
			if (event.targets.every(target => target.isIn())) {
				await event.targets[0].swapHandcards(event.targets[1]);
			}
		},
		ai: {
			order: 10,
			threaten: 3,
			expose: 0.9,
			result: {
				target(player, target) {
					//只考虑队内流通牌
					if (get.attitude(player, target) < 0) {
						return 0;
					}
					return (target.countCards("h") + 1) * get.sgnAttitude(player, target);
				},
			},
		},
	},
	zc26_qiaobian: {
		trigger: { global: "roundStart" },
		filter(event, player) {
			const lastTarget = get.info("zc26_qiaobian").getLastTarget(player);
			return game.hasPlayer(current => current != lastTarget);
		},
		async cost(event, trigger, player) {
			const lastTarget = get.info("zc26_qiaobian").getLastTarget(player);
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (_, player, target) => target != get.event().lastTarget)
				.set("ai", target => get.attitude(get.player(), target) * target.countCards("h"))
				.set("lastTarget", lastTarget)
				.forResult();
		},
		async content(event, trigger, player) {
			await game.asyncDraw([player, ...event.targets].sortBySeat());
			player.setStorage("zc26_qiaobian_effect", event.targets[0], true);
			player.addTempSkill("zc26_qiaobian_effect", { global: "roundEnd" });
		},
		getLastTarget(player) {
			const historys = player.getRoundHistory("useSkill", evt => evt.skill == "zc26_qiaobian", 1);
			if (!historys.length) {
				return null;
			}
			return historys[0]?.targets?.[0];
		},
		subSkill: {
			effect: {
				charlotte: true,
				init(player, skill) {
					const target = player.getStorage(skill);
					if (target) {
						player.markSkillCharacter(skill, target, "巧变", `本轮指定${get.translation(target)}为目标`);
					}
				},
				onremove: true,
				trigger: { global: ["phaseJudgeBefore", "phaseDrawBefore", "phaseUseBefore", "phaseDiscardBefore"] },
				filter(event, player) {
					if (!player.countDiscardableCards(player, "he")) {
						return false;
					}
					return player.getStorage("zc26_qiaobian_effect") == event.player;
				},
				async cost(event, trigger, player) {
					let check,
						str = `弃置一张手牌并跳过其${get.translation(trigger.name)}`;
					if (trigger.name == "phaseDraw") {
						str += "，然后其可以获得至多两名角色各一张手牌";
					}
					if (trigger.name == "phaseUse") {
						str += "，然后其可以移动场上的一张牌";
					}
					switch (trigger.name) {
						case "phaseJudge":
							check = trigger.player.countCards("j");
							break;
						case "phaseDraw": {
							let num = 0,
								num2 = 0;
							const players = game.filterPlayer(current => current != trigger.player);
							for (const current of players) {
								let hs = current.countGainableCards(trigger.player, "h");
								if (current == player) {
									hs--;
								}
								if (hs) {
									const att = get.attitude(trigger.player, current);
									if (att <= 0) {
										num++;
									}
									if (att < 0) {
										num2++;
									}
								}
							}
							if (trigger.num < 2) {
								check = true;
							}
							check = num >= 2 && num2 > 0;
							break;
						}
						case "phaseUse":
							if (!trigger.player.canMoveCard(true)) {
								check = false;
							} else {
								check = game.hasPlayer(function (current) {
									return get.attitude(trigger.player, current) > 0 && current.countCards("j");
								});
								if (!check) {
									if (trigger.player.countCards("h") > trigger.player.hp + 1) {
										check = false;
									} else if (trigger.player.mayHaveSha() && trigger.player.getUseValue("sha") > 0) {
										check = false;
									} else {
										check = true;
									}
								}
							}
							break;
						case "phaseDiscard":
							check = trigger.player.needsToDiscard();
							break;
					}
					event.result = await player
						.chooseToDiscard(get.prompt(event.skill, trigger.player), str)
						.set("ai", card => {
							if (!_status.event.check) {
								return -1;
							}
							return 7 - get.value(card);
						})
						.set("check", check)
						.set("chooseonly", true)
						.forResult();
				},
				async content(event, trigger, player) {
					await player.discard(event.cards);
					trigger.cancel();
					game.log(trigger.player, "跳过了", `#y${get.translation(trigger.name)}`);
					if (trigger.name == "phaseUse") {
						if (trigger.player.canMoveCard()) {
							await trigger.player.moveCard();
						}
					} else if (trigger.name == "phaseDraw") {
						const result = await trigger.player
							.chooseTarget([1, 2], "获得至多两名角色各一张手牌", function (card, player, target) {
								return target != player && target.countGainableCards(player, "h");
							})
							.set("ai", target => get.effect(target, { name: "shunshou_copy2" }, get.player(), get.player()))
							.forResult();
						if (!result?.bool || !result.targets?.length) {
							return;
						}
						result.targets.sortBySeat();
						trigger.player.line(result.targets, "green");
						await trigger.player.gainMultiple(result.targets);
						await game.delay();
					}
				},
				ai: {
					threaten: 3,
				},
			},
		},
	},
	//SP徐氏 by柴油鹿鹿
	zc26_longchen: {
		audio: "wengua",
		enable: "phaseUse",
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const list = [
					["damage", "对一名角色造成1点雷电伤害"],
					["draw", "令一名角色摸一张牌并回复1点体力"],
				];
				return ui.create.dialog("龙谶", [list, "textbutton"], "hidden");
			},
			check(button) {
				const player = get.player();
				const getE = current => {
					if (button.link == "damage") {
						return get.damageEffect(current, player, player);
					}
					return get.effect(current, { name: "draw" }, player, player) + get.recoverEffect(current, player, player);
				};
				return getE(game.filterPlayer(() => true).maxBy(getE));
			},
			backup(links, player) {
				return {
					audio: "zc26_longchen",
					control: links[0],
					async content(event, trigger, player) {
						const { control } = get.info(event.name),
							{ throwShengbei } = get.info("zc26_longchen");
						let num = await throwShengbei(player);
						if (typeof num != "number") {
							return;
						}
						let count = 1;
						if (num == 1) {
							count++;
						} else {
							player.addMark("zc26_longchen", Math.max(1, 2 - num));
						}
						while (count > 0) {
							count--;
							const result2 = await player
								.chooseTarget(control == "damage" ? "对一名角色造成1点雷电伤害" : "令一名角色摸一张牌并回复1点体力", true)
								.set("control", control)
								.set("ai", target => {
									const { player, control } = get.event();
									if (control == "draw") {
										return get.effect(target, { name: "draw" }, player, player) + get.recoverEffect(target, player, player);
									}
									return get.damageEffect(target, player, player, "thunder");
								})
								.forResult();
							if (!result2?.bool) {
								continue;
							}
							const target = result2.targets[0];
							player.line(target, control == "draw" ? "wood" : "thunder");
							if (control == "draw") {
								await target.draw();
								await target.recover(1);
							} else {
								await target.damage("thunder");
							}
						}
					},
				};
			},
			prompt() {
				return "点击确定投掷龙鳞贝询问神明";
			},
		},
		async throwShengbei(player) {
			game.log(player, "掷出了圣杯向神明请示");
			let num1 = get.rand(0, 1),
				num2 = get.rand(0, 1),
				list = ["yang", "yin"];
			game.broadcastAll(() => {
				ui.arena.classList.add("thrownhighlight");
			});
			game.addVideo("thrownhighlight1");
			const shengBei1 = game.createCard(`shengbei_left_${list[num1]}`, "", ""),
				shengBei2 = game.createCard(`shengbei_right_${list[num2]}`, "", "");
			let cardsetions = {};
			if (lib.config.card_animation_info) {
				cardsetions[player.playerid] = get.cardsetion(player);
			}
			const throwc = function (node) {
				node.style.setProperty("transform-origin", "center", "important");
				if (lib.config.cardback_style != "default") {
					node.style.transitionProperty = "none";
					ui.refresh(node);
					node.classList.add("infohidden");
					ui.refresh(node);
					node.style.transitionProperty = "";
				} else {
					node.classList.add("infohidden");
				}
				if (cardsetions) {
					const next = ui.create.div(".cardsetion", cardsetions[player.playerid] || "", node);
					next.style.setProperty("display", "block", "important");
					if (node.node) {
						if (node.node.cardsetion) {
							node.node.cardsetion.remove();
							delete node.node.cardsetion;
						}
						node.node.cardsetion = next;
					}
				}
				node.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
				const onEnd01 = function () {
					node.style.transition = "all ease-in 0.3s";
					node.style.transform = "perspective(600px) rotateY(270deg) translateX(0px)";
					const onEnd = function () {
						node.classList.remove("infohidden");
						node.style.transition = "all 0s";
						ui.refresh(node);
						node.style.transform = "perspective(600px) rotateY(-90deg) translateX(0px)";
						ui.refresh(node);
						node.style.transition = "";
						ui.refresh(node);
						node.style.transform = "";
					};
					node.listenTransition(onEnd);
				};
				onEnd01();
			};
			game.broadcastAll(
				function (player, throwc, card1, card2, cardsetions) {
					const node1 = player.$throwxy2(card1, "calc(50% - 114px)", "calc(50% - 52px)", "perspective(600px) rotateY(90deg) translateX(0px)", true);
					throwc(node1);
					const node2 = player.$throwxy2(card2, "50%", "calc(50% - 52px)", "perspective(600px) rotateY(90deg) translateX(0px)", true);
					throwc(node2);
				},
				player,
				throwc,
				shengBei1,
				shengBei2,
				cardsetions
			);
			game.addVideo("compare", player, [get.cardInfo(shengBei1), player.dataset.position, get.cardInfo(shengBei2)]);
			//等待一会儿
			await game.delay(0, 1500);
			const num = num1 + num2;
			const result = ["阴杯", "圣杯", "笑杯"][num];
			const map = {
					阴杯: ["thunder", "thundertext"],
					笑杯: ["soil", "firetext"],
					圣杯: ["metal", "yellowtext"],
				},
				str = `${get.translation(player)}的掷杯结果为：<span class=${map[result][1]}>${result}</span>`;
			player.popup(result, map[result][0]);
			game.log("神明给", player, `的答复是<span class=${map[result][1]}>${result}</span>`);
			game.broadcastAll(str => {
				const dialog = ui.create.dialog(str);
				dialog.classList.add("center");
				setTimeout(() => {
					dialog.close();
				}, 1000);
			}, str);
			await game.delay(2);
			game.broadcastAll(() => {
				ui.arena.classList.remove("thrownhighlight");
			});
			game.addVideo("thrownhighlight2");
			game.broadcastAll(() => {
				ui.clear();
			});
			return num;
		},
		marktext: "怒",
		intro: {
			name: "龙怒(龙谶)",
			name2: "龙怒",
			content: "mark",
		},
		subSkill: {
			backup: {},
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	zc26_tianqi: {
		audio: 2,
		trigger: {
			player: ["phaseZhunbeiBegin", "dying"],
		},
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "ice",
		filter(event, player, name) {
			return name == "dying" || player.countMark("zc26_longchen") >= 3;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.changeSkin({ characterName: "zc26_sp_xushi" }, "zc26_sp_xushi_shadow");
			await player.loseMaxHp();
			await player.recoverTo(player.maxHp);
			await player.addSkills("zc26_shouxin");
			const func = async target => {
				if (target.hasSex("male")) {
					player.line(target, "thunder");
					await target.damage("thunder");
				}
			};
			await game.doAsyncInOrder(
				game.filterPlayer(() => true),
				func
			);
		},
		derivation: "zc26_shouxin",
	},
	zc26_shouxin: {
		audio: 2,
		trigger: {
			target: "useCardToTarget",
			source: "damageSource",
		},
		filter(event, player) {
			if (event.name == "damage") {
				return event.hasNature();
			}
			return event.player != player && player.hasMark("zc26_longchen");
		},
		async cost(event, trigger, player) {
			if (trigger.name == "damage") {
				event.result = {
					bool: true,
				};
				return;
			}
			event.result = await player
				.chooseBool(get.prompt(event.skill), `移去1枚“龙怒”并令${get.translation(trigger.card)}对你无效`)
				.set("choice", get.effect(player, trigger.card, trigger.player, player) < 0)
				.forResult();
		},
		async content(event, trigger, player) {
			if (trigger.name == "damage") {
				await player.draw();
			} else {
				player.removeMark("zc26_longchen", 1);
				trigger.getParent().excluded.add(player);
			}
		},
	},
	//26珍藏太史慈
	zc26_tianyi: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: (card, player, target) => player.canCompare(target),
		filter(event, player) {
			return game.hasPlayer(curr => player.canCompare(curr));
		},
		async content(event, trigger, player) {
			const result = await player.chooseToCompare(event.targets[0]).forResult();
			if (result.bool) {
				player.addTempSkill("zc26_tianyi_effect");
			} else {
				player.addTempSkill("zc26_tianyi_diseffect");
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				marktext: "天义",
				intro: {
					name: "天义",
					content: "本回合使用【杀】次数上限+1、目标上限+1、无距离限制",
				},
				mod: {
					cardUsable(card, player, num) {
						if (get.name(card) == "sha") {
							return num + 1;
						}
					},
					targetInRange(card, player, bool) {
						if (get.name(card) == "sha") {
							return true;
						}
					},
					selectTarget(card, player, range) {
						if (get.name(card) == "sha") {
							range[1]++;
						}
					},
				},
			},
			diseffect: {
				trigger: { player: "useCard" },
				charlotte: true,
				forced: true,
				mark: true,
				marktext: "天义",
				intro: {
					name: "天义",
					content: "本回合使用下一张牌时取消之并令唯一目标摸两张牌",
				},
				async content(event, trigger, player) {
					trigger.cancel();
					player.removeSkill(event.name);
					if (trigger.targets.length == 1) {
						await trigger.targets[0].draw(2);
					}
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							return [0, 0, 0, 2];
						},
					},
				},
			},
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					if (player.countCards("h") > 1) {
						return -get.attitude(player, target);
					}
					return 0;
				},
			},
		},
	},
	zc26_dangmo: {
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			const evts = player.getHistory("useCard");
			if (evts.length < 2) {
				return false;
			}
			const targets = get.info("zc26_dangmo").logTarget(event, player);
			return targets?.length;
		},
		logTarget(event, player) {
			const evts = player.getHistory("useCard");
			if (evts.length < 2) {
				return [];
			}
			const index = evts.indexOf(event),
				nows = event?.targets,
				olds = evts[index - 1]?.targets;
			if (!olds?.length || !nows?.length || (olds.containsAll(...nows) && nows.containsAll(...olds))) {
				return [];
			}
			return olds.filter(current => current?.isIn() && nows.includes(current));
		},
		check(event, player) {
			const targets = get.info("zc26_dangmo").logTarget(event, player);
			return (
				targets.reduce((total, target) => {
					return total + get.damageEffect(target, player, player);
				}, 0) > 0
			);
		},
		async content(event, trigger, player) {
			await game.doAsyncInOrder(event.targets, async target => await target.damage());
		},
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				const num1 = get.info(card).selectTarget ?? 0,
					num2 = game.countPlayer();
				if (typeof num1 == "number") {
					return Math.abs(num1 - num2);
				} else if (typeof num1 == "function") {
					return Math.abs(num1(card, player) - nmu2);
				} else {
					return Math.abs(num1[1] - num2);
				}
			},
		},
		ai: {
			effct: {
				target(card, player, target) {
					if (!player.getHistory("useCard", evt => evt.targets.length > 0).length && player.hasSkill("zc26_tianyi_effct") && ui.selected.targets.length > 0) {
						return 0;
					}
					return [1, 0];
				},
			},
		},
	},
	//26珍藏贾诩
	zc26_wansha: {
		trigger: { player: "phaseBegin" },
		forced: true,
		async content(event, trigger, player) {
			const targets = game.filterPlayer(curr => curr != player);
			targets.forEach(target => target.addTempSkill("zc26_wansha_effect"));
		},
		group: "zc26_wansha_draw",
		subSkill: {
			draw: {
				audio: "zc26_wansha",
				trigger: { global: "useCard" },
				filter(event, player) {
					return event.modSkill?.cardname == "zc26_wansha_effect";
				},
				logTarget: "player",
				forced: true,
				async content(event, trigger, player) {
					await player.draw(2);
				},
			},
			effect: {
				mark: true,
				marktext: "完杀",
				intro: {
					name: "完杀",
					content: "本回合红色基本牌均视为杀",
				},
				charlotte: true,
				mod: {
					cardname(card, player, name) {
						if (get.color(card) == "red" && lib.card[card.name].type == "basic") {
							return "sha";
						}
					},
				},
			},
		},
	},
	zc26_weimu: {
		trigger: {
			target: "useCardToTarget",
			player: "addJudgeBefore",
		},
		forced: true,
		priority: 15,
		preHidden: true,
		check(event, player) {
			return event.name == "addJudge" || (event.card.name != "chiling" && get.effect(event.target, event.card, event.player, player) < 0);
		},
		filter(event, player) {
			if (event.name == "addJudge") {
				return get.color(event.card) == "black";
			}
			return get.type(event.card, null, false) == "trick" && get.color(event.card) == "black";
		},
		async content(event, trigger, player) {
			if (trigger.name == "addJudge") {
				trigger.cancel(undefined, undefined, undefined);
				const owner = get.owner(trigger.card);
				if (owner?.getCards("hej").includes(trigger.card)) {
					await owner.lose(trigger.card, ui.discardPile);
				} else {
					await game.cardsDiscard(trigger.card);
				}
				game.log(trigger.card, "进入了弃牌堆");
			} else {
				// @ts-expect-error 类型系统未来可期
				trigger.getParent()?.targets.remove(player);
			}
		},
		group: ["zc26_weimu_effect"],
		subSkill: {
			effect: {
				enable: "chooseToUse",
				viewAs: {
					name: "jiedao",
				},
				filterCard(card) {
					return get.color(card) == "black" && get.type(card) != "trick" && get.type(card) != "delay";
				},
				position: "hes",
				check(card) {
					return 4.5 - get.value(card);
				},
			},
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.type(card, "trick") == "trick" && get.color(card) == "black") {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
};

export default skills;
