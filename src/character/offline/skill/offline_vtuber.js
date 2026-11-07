import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//天书乱斗虚拟偶像线下化
	//小杀
	vtbguisha: {
		audio: 1,
		trigger: { global: "useCard" },
		direct: true,
		filter(event, player) {
			return event.player !== player && event.card.name === "sha" && player.countCards("he") > 0 && event.player.isPhaseUsing();
		},
		async content(event, trigger, player) {
			let go = false;
			let d1 = false;
			if (get.attitude(player, trigger.player) > 0) {
				for (const target of trigger.targets) {
					const isDirectHit = !target.mayHaveShan(player, "use") || trigger.player.hasSkillTag("directHit_ai", true, { target, card: trigger.card }, true);
					if (!isDirectHit) {
						continue;
					}
					if (
						get.attitude(player, target) >= 0 ||
						trigger.player.hasSkillTag("jueqing", false, target) ||
						target.hasSkillTag("filterDamage", null, {
							player: trigger.player,
							card: trigger.card,
						})
					) {
						continue;
					}
					d1 = true;
					break;
				}
				if (trigger.addCount === false || !trigger.player.isPhaseUsing()) {
					go = false;
				} else if (!trigger.player.hasSkill("paoxiao") && !trigger.player.hasSkill("tanlin3") && !trigger.player.hasSkill("zhaxiang2") && !trigger.player.hasSkill("fengnu") && !trigger.player.getEquip("zhuge")) {
					const nh = trigger.player.countCards("h");
					if (player === trigger.player) {
						go = player.countCards("h", "sha") > 0;
					} else if (nh >= 4) {
						go = true;
					} else if (player.countCards("h", "sha")) {
						if (nh === 3) {
							go = Math.random() < 0.8;
						} else if (nh === 2) {
							go = Math.random() < 0.5;
						}
					} else if (nh >= 3) {
						if (nh === 3) {
							go = Math.random() < 0.5;
						} else if (nh === 2) {
							go = Math.random() < 0.2;
						}
					}
				}
			}
			go = Number(go) * Math.random() + Number(d1) * Math.random() > 0.4;
			//AI停顿
			if (
				go &&
				!event.isMine() &&
				!event.isOnline() &&
				player.hasCard(card => get.value(card) < 6 && lib.filter.cardDiscardable(card, player, event.name), "he")
			) {
				await game.delayx();
			}
			const result = await player
				.chooseToDiscard({
					prompt: get.prompt("vtbguisha"),
					prompt2: `弃置一张牌，令${get.translation(trigger.player)}本次使用的【杀】不计入使用次数，且对${get.translation(trigger.targets)}造成的伤害+1`,
					position: "he",
					ai: card => {
						if (get.event().go) {
							return 6 - get.value(card);
						}
						return 0;
					},
				})
				.set("logSkill", ["vtbguisha", trigger.player])
				.set("go", go)
				.forResult();
			if (!result.bool) {
				return;
			}
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				const stat = trigger.player.getStat().card;
				const name = trigger.card.name;
				if (typeof stat[name] === "number") {
					stat[name]--;
				}
			}
			trigger.player.addTempSkill("vtbguisha_bonus");
			if (!trigger.card.storage) {
				trigger.card.storage = {};
			}
			trigger.card.storage.vtbguisha_targets = trigger.targets;
		},
		ai: {
			expose: 0.2,
		},
		subSkill: {
			bonus: {
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return event.card && event.card.name === "sha" && event.card.storage && event.card.storage.vtbguisha_targets && event.card.storage.vtbguisha_targets.includes(event.player);
				},
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
		},
	},
	vtbshuli: {
		audio: 1,
		trigger: {
			global: "damageSource",
		},
		usable: 2,
		filter(event, player) {
			return event.source && event.source !== player && event.card && event.card.name === "sha" && event.source.isIn();
		},
		logTarget: "source",
		check(event, player) {
			return get.attitude(player, event.source) >= 0 || (get.attitude(player, event.source) >= -4 && get.distance(_status.currentPhase, player, "absolute") > get.distance(_status.currentPhase, event.source, "absolute"));
		},
		async content(event, trigger, player) {
			const drawers = [trigger.source, player].sortBySeat(_status.currentPhase);
			await game.asyncDraw(drawers);
		},
	},
	//小闪
	vtbshanwu: {
		audio: 1,
		trigger: {
			global: "useCardToTarget",
		},
		filter(event, player) {
			return (
				event.card.name === "sha" &&
				event.target !== player &&
				event.isFirstTarget &&
				player.hasCard(card => get.name(card) === "shan" || _status.connectMode)
			);
		},
		direct: true,
		async content(event, trigger, player) {
			let effect = 0;
			for (const target of trigger.targets) {
				let eff = get.effect(target, trigger.card, trigger.player, player);
				if (!target.mayHaveShan(player, "use") || trigger.player.hasSkillTag("directHit_ai", true, { target, card: trigger.card }, true)) {
					eff *= 1.25;
				}
				if (target.hp <= 2) {
					eff *= 1.1;
				}
				effect += eff;
			}
			const result = await player
				.chooseToDiscard({
					prompt: get.prompt("vtbshanwu"),
					prompt2: `弃置一张【闪】，取消此【杀】对${get.translation(trigger.targets)}的目标`,
					filterCard: { name: "shan" },
					ai: card => {
						if (get.event().goon) {
							return 6 - get.value(card);
						}
						return 0;
					},
				})
				.set("logSkill", "vtbshanwu")
				.set("goon", effect < 0)
				.forResult();
			if (!result.bool) {
				return;
			}
			game.log(player, "取消了", trigger.card, "的所有目标");
			trigger.targets.length = 0;
			trigger.getParent().triggeredTargets2.length = 0;
			trigger.untrigger();
		},
		ai: {
			expose: 0.2,
		},
	},
	vtbxianli: {
		audio: 1,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		usable: 2,
		filter(event, player) {
			if (!_status.currentPhase || !_status.currentPhase.isIn() || !_status.currentPhase.countGainableCards(player, "he")) {
				return false;
			}
			const evt = event.getl(player);
			return evt && evt.cards2 && evt.cards2.some(card => get.name(card, false) === "shan");
		},
		check(event, player) {
			return get.effect(_status.currentPhase, { name: "shunshou_copy2" }, player, player) > 0;
		},
		prompt2(event, player) {
			return `获得${get.translation(_status.currentPhase)}的一张牌`;
		},
		logTarget: () => _status.currentPhase,
		async content(event, trigger, player) {
			await player.gainPlayerCard({
				target: _status.currentPhase,
				position: "he",
				forced: true,
			});
		},
		ai: {
			expose: 0.15,
		},
	},
	//小桃
	vtbtaoyan: {
		audio: 1,
		trigger: {
			player: "phaseBegin",
		},
		direct: true,
		async content(event, trigger, player) {
			if (!_status.vtbtaoyan_count) {
				_status.vtbtaoyan_count = 6;
			}
			const result = await player
				.chooseTarget({
					prompt: get.prompt("vtbtaoyan"),
					prompt2: "令一或两名其他角色摸一张牌并从游戏外获得一张【桃】指示物",
					filterTarget: lib.filter.notMe,
					selectTarget: [1, 2],
					ai: target => get.recoverEffect(target, player, player) / 2 + get.attitude(player, target),
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			const targets = result.targets.slice().sortBySeat();
			player.logSkill("vtbtaoyan", targets);
			game.broadcastAll(() => {
				if (!lib.inpile.includes("tao")) {
					lib.inpile.add("tao");
				}
			});
			player.addSkill("vtbtaoyan_remove");
			const nextEvents = [];
			for (const target of targets) {
				nextEvents.push(target.draw());
				if (!_status.vtbtaoyan_count) {
					continue;
				}
				if (!_status.vtbtaoyan_cards) {
					_status.vtbtaoyan_cards = [];
				}
				_status.vtbtaoyan_count--;
				const card = game.createCard("tao");
				_status.vtbtaoyan_cards.push(card.cardid);
				nextEvents.push(target.gain({ cards: [card], animate: "gain2" }));
			}
			for (const nextEvent of nextEvents) {
				await nextEvent;
			}
		},
		ai: {
			expose: 0.3,
			threaten: 3.2,
		},
		subSkill: {
			remove: {
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				forceDie: true,
				filter(event, player) {
					if (typeof _status.vtbtaoyan_count !== "number") {
						return false;
					}
					const cards = event.getd();
					return cards.some(card => _status.vtbtaoyan_cards.includes(card.cardid));
				},
				async content(event, trigger, player) {
					const cards = trigger.getd();
					const remove = [];
					for (const card of cards) {
						if (_status.vtbtaoyan_cards.includes(card.cardid)) {
							_status.vtbtaoyan_cards.remove(card.cardid);
							remove.push(card);
						}
					}
					if (!remove.length) {
						return;
					}
					for (const card of remove) {
						card.remove();
						_status.vtbtaoyan_count++;
					}
					game.log(remove, "被移出了游戏");
				},
			},
		},
	},
	vtbyanli: {
		audio: 1,
		trigger: {
			global: "dying",
		},
		filter(event, player) {
			if (player.hasSkill("vtbyanli_used")) {
				return false;
			}
			if (_status.currentPhase === player) {
				return false;
			}
			return event.player.hp <= 0;
		},
		check(event, player) {
			return get.recoverEffect(event.player, player, player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.addTempSkill("vtbyanli_used", "roundStart");
			const recoverEvent = trigger.player.recover(1 - trigger.player.hp);
			const drawEvent = trigger.player.draw();
			await recoverEvent;
			await drawEvent;
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	//小乐
	vtbleyu: {
		audio: 1,
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player) {
			return player.countCards("he") >= 3;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard({
					prompt: get.prompt2("vtbleyu", trigger.player),
					selectCard: 3,
					position: "he",
					chooseonly: true,
					ai: card => {
						if (ui.selected.cards.length === 2) {
							return 10 - get.value(card);
						}
						if (get.event().effect > 0) {
							return 6 - get.value(card);
						}
						return 0;
					},
				})
				.set("effect", trigger.player.hasJudge("lebu") ? 0 : get.effect(trigger.player, { name: "lebu" }, player, player))
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.discard({ cards: event.cards });
			const judgeResult = await trigger.player
				.judge({
					judge: lib.card.lebu.judge,
					judge2: lib.card.lebu.judge2,
				})
				.forResult();
			if (!judgeResult.bool) {
				trigger.player.skip("phaseUse");
			}
		},
		ai: {
			expose: 0.3,
			threaten: 2.9,
		},
	},
	vtbyuanli: {
		audio: 1,
		trigger: { global: ["phaseUseSkipped", "phaseUseCancelled"] },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("vtbyuanli"),
					filterTarget: lib.filter.notMe,
					ai: target => get.attitude(player, target) + 1,
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await game.asyncDraw([player, target].sortBySeat(_status.currentPhase));
		},
		ai: {
			expose: 0.1,
		},
	},
	vtbmeiniang: {
		audio: 1,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player !== player;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0 && event.player.getUseValue("jiu") >= 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await trigger.player.chooseUseTarget({
				card: { name: "jiu", isCard: true },
				forced: true,
				addCount: false,
			});
		},
	},
	vtbyaoli: {
		audio: 1,
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			return event.card.name === "jiu" && event.player !== player && event.player.isPhaseUsing();
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		async content(event, trigger, player) {
			trigger.player.addTempSkill(`${event.name}_effect`);
			trigger.player.addMark(`${event.name}_effect`, 1, false);
		},
		ai: { expose: 0.15 },
		subSkill: {
			effect: {
				audio: "vtbyaoli",
				charlotte: true,
				trigger: { player: "useCard2" },
				forced: true,
				onremove: true,
				direct: true,
				filter(event, player) {
					return event.card.name === "sha" && player.countMark("vtbyaoli_effect") > 0;
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.filterPlayer());
					const num = player.countMark(event.name);
					player.removeSkill(event.name);
					const targets = game.filterPlayer(current => !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current));
					if (!targets.length) {
						return;
					}
					const result = await player
						.chooseTarget({
							prompt: `媱丽：是否为${get.translation(trigger.card)}额外指定${num > 1 ? "至多" : ""}${get.cnNumber(num)}个目标？`,
							selectTarget: num === 1 ? 1 : [1, num],
							filterTarget: (_card, player, target) => !get.event().sourcex.includes(target) && player.canUse(get.event().card, target),
							ai: target => {
								const { player, card } = get.event();
								return get.effect(target, card, player, player);
							},
						})
						.set("sourcex", trigger.targets)
						.set("card", trigger.card)
						.forResult();
					if (!result.targets?.length) {
						return;
					}
					if (!event.isMine() && !event.isOnline()) {
						await game.delayx();
					}
					player.logSkill(event.name, result.targets);
					trigger.targets.addArray(result.targets);
				},
				marktext: "媱",
				intro: { content: "下一张【杀】不可被响应且可以额外指定&个目标" },
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return arg?.card?.name === "sha";
					},
				},
			},
		},
	},
};

export default skills;
