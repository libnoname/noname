import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//江山如故·衰
	//张举
	jsrgqiluan: {
		usable: 2,
		enable: "chooseToUse",
		hiddenCard(player, name) {
			return (name === "sha" || name === "shan") && (player.getStat("skill").jsrgqiluan || 0) < 2 && player.countCards("he") > 0;
		},
		filter(event, player) {
			return (event.filterCard({ name: "sha", isCard: true }, player, event) || event.filterCard({ name: "shan", isCard: true }, player, event)) && player.hasCard(card => lib.filter.cardDiscardable(card, player, "jsrgqiluan"));
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = [];
				if (event.filterCard({ name: "sha", isCard: true }, player, event)) {
					vcards.push("sha");
				}
				if (event.filterCard({ name: "shan", isCard: true }, player, event)) {
					vcards.push("shan");
				}
				return ui.create.dialog("起乱", [vcards, "vcard"], "hidden");
			},
			backup(links, player) {
				return {
					viewAs: { name: links[0][2], isCard: true },
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					log: false,
					async precontent(event, trigger, player) {
						const stat = player.getStat("skill");
						if (!stat.jsrgqiluan) {
							stat.jsrgqiluan = 0;
						}
						stat.jsrgqiluan++;
						const evt = event.getParent();
						player.logSkill("jsrgqiluan");
						const { cards, targets } = await player
							.chooseCardTarget({
								prompt: "弃置任意张牌并选择等量角色",
								position: "he",
								filterCard: card => lib.filter.cardDiscardable(card, get.player(), "jsrgqiluan"),
								filterTarget: lib.filter.notMe,
								selectCard: [1, Infinity],
								selectTarget: [1, Infinity],
								filterOk() {
									return ui.selected.cards.length === ui.selected.targets.length;
								},
								forced: true,
							})
							.forResult();
						player.line(targets);
						targets.sortBySeat();
						const cardsNum = cards.length;
						await player.discard(cards);
						let hasSomeoneUsed = false;
						for (const target of targets) {
							const cardName = event.result.card.name;
							const chooseToRespondEvent = target.chooseToRespond("是否替" + get.translation(player) + "打出一张" + get.translation(cardName) + "？", { name: cardName });
							chooseToRespondEvent.set("ai", () => {
								const event = _status.event;
								return get.attitude(event.player, event.source) - 2;
							});
							chooseToRespondEvent.set("source", player);
							chooseToRespondEvent.set("skillwarn", "替" + get.translation(player) + "打出一张" + get.translation(cardName));
							chooseToRespondEvent.noOrdering = true;
							chooseToRespondEvent.autochoose = cardName === "sha" ? lib.filter.autoRespondSha : lib.filter.autoRespondShan;
							const { bool, card, cards } = await chooseToRespondEvent.forResult();
							if (bool) {
								hasSomeoneUsed = true;
								event.result.card = card;
								event.result.cards = cards;
								event.result._apply_args = { throw: false };
								target.addExpose(0.2);
								await player.draw(cardsNum);
								break;
							}
						}
						if (!hasSomeoneUsed) {
							evt.goto(0);
						}
					},
				};
			},
			prompt(links, player) {
				return `请选择【${get.translation(links[0][2])}】的目标`;
			},
		},
		//技能收益太低，不写AI了
	},
	jsrgxiangjia: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.getEquips(1).length > 0;
		},
		viewAs: {
			name: "jiedao",
			isCard: true,
		},
		filterCard: () => false,
		selectCard: -1,
		onuse(result, player) {
			player.addTempSkill("jsrgxiangjia_effect");
		},
		//技能收益太低，先不写AI了
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					const card = get.autoViewAs({ name: "jiedao", isCard: true });
					return (
						event.skill === "jsrgxiangjia" &&
						event.targets.some(current => {
							return current.isIn() && current.canUse(card, player);
						})
					);
				},
				popup: false,
				async content(event, trigger, player) {
					const card = get.autoViewAs({ name: "jiedao", isCard: true });
					for (const target of trigger.targets) {
						if (target.isIn() && target.canUse(card, player)) {
							const result = await target
								.chooseTarget(`是否对${get.translation(player)}使用【借刀杀人】？`, `操作提示：直接选择${get.translation(player)}使用【杀】的目标角色`, (card, player, target) => {
									const source = get.event("source");
									return lib.card.jiedao.filterAddedTarget(card, player, target, source);
								})
								.set("source", player)
								.set("ai", target => {
									const player = get.player(),
										card = get.autoViewAs({ name: "jiedao", isCard: true });
									const source = get.event("source");
									let eff = get.effect(source, card, player, player);
									_status.event.preTarget = source;
									eff += get.effect(target, card, player, player);
									delete _status.event.preTarget;
									return eff;
								})
								.forResult();
							if (result.bool) {
								await target.useCard(get.autoViewAs({ name: "jiedao", isCard: true }), [player, result.targets[0]]);
							}
						}
					}
				},
			},
		},
	},
	//陈蕃
	jsrggangfen: {
		trigger: { global: "useCardToPlayer" },
		filter(event, player) {
			if (event.card.name !== "sha") {
				return false;
			}
			if (event.player === player || event.player.countCards("h") <= player.countCards("h")) {
				return false;
			}
			return !event.targets.includes(player) && lib.filter.targetEnabled(event.card, event.player, player);
		},
		logTarget: "player",
		prompt2(event, player) {
			return `你可以成为该角色使用的${get.translation(event.card)}的额外目标，并令所有其他角色也选择是否成为此牌的目标。然后该角色展示所有手牌，若其中的黑色牌数量小于此牌目标数，则此牌无效。`;
		},
		check(event, player) {
			if (
				event.targets.reduce((p, c) => {
					return p + get.effect(c, event.card, event.player, player);
				}, 0) >= 0
			) {
				return false;
			}
			//绝对保守策略：队友数大于来源牌数才发动技能
			return game.countPlayer(current => event.targets.includes(current) || get.attitude(current, player) > 0) > event.player.countCards("h");
		},
		async content(event, trigger, player) {
			trigger.targets.add(player);
			const source = trigger.player;
			const targets = game
				.filterPlayer(current => {
					return current !== player && current !== source && !trigger.targets.includes(current) && lib.filter.targetEnabled(trigger.card, source, current);
				})
				.sortBySeat();
			for (const target of targets) {
				const bool = await target
					.chooseBool(`是否也成为${get.translation(trigger.card)}的目标？`, `若最终目标数大于${get.translation(source)}手牌中的黑色牌数，则此牌无效。`)
					.set("ai", () => get.event("choice"))
					.set(
						"choice",
						(() => {
							if (get.attitude(target, player) < 0) {
								return false;
							}
							return game.countPlayer(current => trigger.targets.includes(current) || get.attitude(current, player) > 0) > trigger.player.countCards("h");
						})()
					)
					.forResult("bool");
				if (bool) {
					target.addExpose(0.15);
					target.chat("我也上！");
					target.line(source);
					trigger.targets.add(target);
					game.log(target, "也成为了", trigger.card, "的目标");
					await game.delayx();
				}
			}
			await source.showHandcards();
			const blackNum = source.countCards("h", card => get.color(card, source) === "black");
			if (blackNum < trigger.targets.length) {
				trigger.getParent().all_excluded = true;
				trigger.targets.length = 0;
				trigger.untrigger();
			}
		},
		ai: {
			expose: 0.2,
			threaten: 4.5,
		},
	},
	jsrgdangren: {
		zhuanhuanji: true,
		enable: "chooseToUse",
		filter(event, player) {
			if (player.storage.jsrgdangren) {
				return false;
			} // || event.name != "chooseToUse"
			const card = get.autoViewAs({ name: "tao", isCard: true });
			return event.filterCard(card, player, event) && event.filterTarget(card, player, player);
		},
		viewAs: { name: "tao", isCard: true },
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		filterCard() {
			return false;
		},
		selectCard: -1,
		check() {
			const player = get.player();
			if (player.isDying()) {
				return true;
			}
			return (
				game.countPlayer(current => {
					return current.hp <= 2 && get.attitude(player, current) > 0;
				}) >
				game.countPlayer(current => {
					return current.hp <= 2 && get.attitude(player, current) <= 0;
				})
			);
		},
		log: false,
		prompt: "视为对自己使用【桃】",
		async precontent(event, trigger, player) {
			player.logSkill("jsrgdangren");
			player.changeZhuanhuanji("jsrgdangren");
		},
		hiddenCard(player, name) {
			return name === "tao";
		},
		mark: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "当你可以对其他角色使用【桃】时，你须视为使用之。";
				}
				return "当你需要对自己使用【桃】时，你可以视为使用之";
			},
		},
		ai: {
			//仅能对自己使用桃
			save: true,
			skillTagFilter(player, arg, target) {
				return (player == target) != player.storage.jsrgdangren;
			},
		},
		group: "jsrgdangren_save",
		subSkill: {
			save: {
				trigger: { player: "chooseToUseBegin" },
				filter(event, player) {
					if (event.responded || !player.storage.jsrgdangren) {
						return false;
					}
					const card = get.autoViewAs({ name: "tao", isCard: true });
					if (!event.filterCard(card, player, event)) {
						return false;
					}
					const backup = _status.event;
					_status.event = event;
					const hasTarget = game.hasPlayer(current => {
						return current !== player && event.filterTarget(card, player, current);
					});
					_status.event = backup;
					return hasTarget;
				},
				async cost(event, trigger, player) {
					const card = get.autoViewAs({ name: "tao", isCard: true });
					const backup = _status.event;
					_status.event = trigger;
					const targets = game.filterPlayer(current => {
						return current !== player && trigger.filterTarget(card, player, current);
					});
					_status.event = backup;
					if (targets.length === 1) {
						event.result = { bool: true, targets };
					} else {
						event.result = await player
							.chooseTarget(true, "当仁：请选择【桃】的目标", (card, player, target) => {
								return get.event("targets").includes(target);
							})
							.set("targets", targets)
							.forResult();
					}
				},
				async content(event, trigger, player) {
					trigger.result = {
						bool: true,
						card: { name: "tao", isCard: true },
						targets: event.targets,
					};
					trigger.untrigger();
					trigger.set("responded", true);
					player.changeZhuanhuanji("jsrgdangren");
				},
			},
		},
	},
	//卢植
	jsrgruzong: {
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			const target = lib.skill.jsrgruzong.getTarget(player);
			if (!target) {
				return false;
			}
			const hs = player.countCards("h");
			if (target !== player) {
				return target.countCards("h") > hs;
			}
			return game.hasPlayer(current => current !== player && current.countCards("h") < hs);
		},
		getTarget(player) {
			const targets = [];
			player.checkHistory("useCard", evt => targets.addArray(evt.targets));
			return targets.length === 1 ? targets[0] : null;
		},
		frequent: true,
		async cost(event, trigger, player) {
			const target = lib.skill.jsrgruzong.getTarget(player);
			if (target !== player) {
				const bool = await player.chooseBool(get.prompt(event.skill, target), "将手牌数摸至与该角色相同").set("frequentSkill", event.skill);
				if (bool) {
					event.result = {
						bool,
						targets: [target],
						cost_data: "drawToOthers",
					};
				}
			} else {
				event.result = await player
					.chooseTarget(
						get.prompt(event.skill),
						"令任意名角色将手牌数摸至与你相同",
						(card, player, target) => {
							return target.countCards("h") < player.countCards("h");
						},
						[1, Infinity]
					)
					.set("ai", target => {
						const player = get.player();
						return (get.attitude(player, target) * Math.sqrt(player.countCards("h") - target.countCards("h"))) / (target.hasSkillTag("nogain") ? 1 : 10);
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (event.cost_data === "drawToOthers") {
				const num = Math.min(5, event.targets[0].countCards("h") - player.countCards("h"));
				if (num > 0) {
					await player.draw(num);
				}
			} else {
				const num = player.countCards("h");
				await game.asyncDraw(event.targets.sortBySeat(), target => {
					return Math.min(5, num - target.countCards("h"));
				});
			}
		},
	},
	jsrgdaoren: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		position: "h",
		discard: false,
		lose: false,
		delay: false,
		filterTarget: lib.filter.notMe,
		check(card) {
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			const target = event.target;
			await player.give(event.cards, target);
			const targets = game
				.filterPlayer(current => {
					return player.inRange(current) && target.inRange(current);
				})
				.sortBySeat();
			for (const current of targets) {
				player.line(current);
				await current.damage("nocard");
				await game.delayx();
			}
		},
		ai: {
			order: 2,
			result: {
				player(player, target) {
					const targets = game.filterPlayer(current => {
						return player.inRange(current) && target.inRange(current);
					});
					if (targets.length === 0) {
						return false;
					}
					return targets.reduce((p, c) => {
						let eff = get.damageEffect(c, player, player);
						if (eff < 0 && c.hp <= 2) {
							const att = get.attitude(player, c);
							if (att > 0) {
								eff *= Math.sqrt(att);
							}
						}
						return p + eff;
					}, 0);
				},
			},
		},
	},
	//刘表
	jsrgyansha: {
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "你可以选择任意名角色，视为对这些角色使用【五谷丰登】，然后未被选择的角色依次可以将一张装备牌当作【杀】对目标角色使用。", [1, Infinity], (card, player, target) => {
					return player.canUse({ name: "wugu", isCard: true }, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.slice(0).sortBySeat();
			await player.useCard({ name: "wugu", isCard: true }, targets);
			const players = game.filterPlayer(current => !targets.includes(current)).sortBySeat();
			for (const current of players) {
				const aliveTargets = targets.filter(current => current.isIn());
				if (!aliveTargets.length) {
					break;
				}
				// if (
				// 	current.isIn() &&
				// 	(current.countCards("e") > 0 ||
				// 		current.hasCard(card => {
				// 			if (_status.connectMode) {
				// 				return true;
				// 			}
				// 			return get.type(card) === "trick";
				// 		}, "hs"))
				// ) {
				// }
				const result = await current
					.chooseCardTarget({
						prompt: `是否将一张装备牌当作【杀】对${get.translation(targets)}${targets.length > 1 ? "中的一名角色" : ""}使用？`,
						position: "hes",
						filterCard(card) {
							return get.type(card) === "equip";
						},
						filterTarget(card, player, target) {
							if (!get.event("targets").includes(target)) {
								return false;
							}
							card = get.autoViewAs({ name: "sha" }, ui.selected.cards);
							return player.canUse(card, target, false);
						},
						ai1(card) {
							return 7 - get.value(card);
						},
						ai2(target) {
							const player = get.player(),
								card = get.autoViewAs({ name: "sha" }, ui.selected.cards);
							return get.effect(target, card, player, player);
						},
						targets: aliveTargets,
					})
					.forResult();
				if (result.bool) {
					await current.useCard(get.autoViewAs({ name: "sha" }, result.cards), result.cards, result.targets);
				}
			}
		},
	},
	jsrgqingping: {
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter(event, player) {
			const targets = game.filterPlayer(current => player.inRange(current)),
				hs = player.countCards("h");
			return targets.length > 0 && targets.every(current => current.countCards("h") <= hs);
		},
		async content(event, trigger, player) {
			await player.draw(game.countPlayer(current => player.inRange(current)));
		},
	},
	//张奂
	jsrgzhushou: {
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (!player.getHistory("lose").length) {
				return false;
			}
			const card = lib.skill.jsrgzhushou.getMaxCard();
			if (!card) {
				return false;
			}
			return game.hasPlayer(current => {
				return current.hasHistory("lose", evt => {
					return evt.cards2 && evt.cards2.includes(card);
				});
			});
		},
		async cost(event, trigger, player) {
			const card = lib.skill.jsrgzhushou.getMaxCard();
			const targets = game.filterPlayer(current => {
				return current.hasHistory("lose", evt => {
					return evt.cards2 && evt.cards2.includes(card);
				});
			});
			const result = await player
				.chooseTarget(get.prompt(event.skill), `选择一名本回合内失去过${get.translation(card)}的角色，对其造成1点伤害。`, (card, player, target) => {
					return get.event("targets").includes(target);
				})
				.set("targets", targets)
				.set("ai", target => {
					const player = get.player();
					return get.damageEffect(target, player, player);
				})
				.forResult();
			if (result.bool) {
				event.result = {
					bool: true,
					targets: result.targets,
					cards: [card],
				};
			}
		},
		async content(event, trigger, player) {
			await player.showCards(event.cards, `${get.translation(player)}发动了【诛首】`);
			await event.targets[0].damage("nocard");
		},
		getMaxCard() {
			let cardsLost = [];
			game.getGlobalHistory("cardMove", evt => {
				if (evt.name === "cardsDiscard" || (evt.name === "lose" && evt.position === ui.discardPile)) {
					cardsLost.addArray(evt.cards);
				}
			});
			cardsLost = cardsLost.filterInD("d");
			let max = 0;
			return cardsLost.reduce((maxCard, card) => {
				const num = get.number(card, false);
				if (num > max) {
					max = num;
					return card;
				} else if (num === max) {
					return void 0;
				}
				return maxCard;
			}, void 0);
		},
	},
	jsrgyangge: {
		global: "jsrgyangge_mizhao",
		derivation: "mizhao",
		subSkill: {
			used: {
				mark: true,
				marktext: "戈",
				intro: {
					content: "本轮已被发动过〖密诏〗",
				},
				charlotte: true,
				onremove: ["jsrgyangge"],
			},
			mizhao: {
				//直接继承mizhao
				inherit: "mizhao",
				usable: void 0,
				filter(event, player) {
					return player.countCards("h") > 0 && player.isMinHp() && game.hasPlayer(current => lib.skill.jsrgyangge_mizhao.filterTarget(void 0, player, current));
				},
				filterTarget(card, player, target) {
					if (player === target) {
						return false;
					}
					return target.hasSkill("jsrgyangge") && !target.hasMark("jsrgyangge");
				},
				contentBefore() {
					targets[0].addTempSkill("jsrgyangge_used", "roundStart");
					targets[0].addMark("jsrgyangge");
				},
				prompt() {
					const player = get.player();
					const targets = game.filterPlayer(current => lib.skill.jsrgyangge_mizhao.filterTarget(void 0, player, current));
					return `对${get.translation(targets)}${targets.length > 1 ? "中的一人" : ""}发动【密诏】`;
				},
			},
		},
	},
	//董卓
	jsrgguanshi: {
		enable: "phaseUse",
		usable: 1,
		viewAs: { name: "huogong" },
		viewAsFilter(player) {
			return player.hasCard(card => get.name(card) === "sha", "hs");
		},
		filterCard(card) {
			return get.name(card) === "sha";
		},
		selectTarget: [1, Infinity],
		onuse(result, player) {
			player.addTempSkill("jsrgguanshi_effect");
		},
		position: "hs",
		selectTargetAi(card) {
			let cache = _status.event.getTempCache("jsrgguanshi", "targets");
			if (Array.isArray(cache)) {
				return cache.length;
			}
			let player = _status.event.player,
				targets = [],
				shas = player.mayHaveSha(
					player,
					"respond",
					player.getCards("h", i => {
						return card === i;
					})
				);
			game.countPlayer(tar => {
				if (player === tar) {
					return;
				}
				let eff = get.effect(tar, get.autoViewAs({ name: "juedou" }, [card]), player, player);
				if (eff <= 0) {
					return;
				}
				if (get.attitude(player, tar) > 0) {
					targets.push([tar, eff, 0]);
				} else {
					targets.push([tar, eff, tar.mayHaveSha(player, "respond", null, "count")]);
				}
			});
			targets.sort((a, b) => {
				if (!a[2]) {
					return -1;
				}
				if (!b[2]) {
					return 1;
				}
				return b[1] / b[2] - a[1] / a[2];
			});
			for (let i = 0; i < targets.length; i++) {
				if (targets[i][2] > shas) {
					targets = targets.slice(0, i);
					break;
				} else {
					shas -= targets[i][2];
				}
			}
			_status.event.putTempCache("jsrgguanshi", "targets", targets);
			return targets.length;
		},
		check(card) {
			let num = lib.skill.jsrgguanshi.selectTargetAi(card);
			if (!num) {
				return -1;
			}
			if (num === 1) {
				return 4 - get.value(card);
			}
			return num + 5 - get.value(card);
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					let tars = _status.event.getTempCache("jsrgguanshi", "targets");
					if (!tars) {
						return lib.card.juedou.ai.result.player(player, target);
					}
					return 0;
				},
				target(player, target) {
					let tars = _status.event.getTempCache("jsrgguanshi", "targets");
					if (!tars) {
						return lib.card.juedou.ai.result.target(player, target);
					}
					for (let tar of tars) {
						if (tar[0] === target) {
							return tar[1] / get.attitude(player, target);
						}
					}
					return 0;
				},
			},
		},
		subSkill: {
			effect: {
				trigger: { player: ["useCardToBefore", "useCardToAfter", "useCardToExcluded", "useCardToOmitted", "useCardToCancelled", "eventNeutralized"] },
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				priority: 100,
				filter(event, player, name) {
					if (event.type !== "card" || event.skill !== "jsrgguanshi") {
						return false;
					}
					const isUnhurted = event.card.storage?.jsrgguanshi;
					if (name === "useCardToBefore") {
						return isUnhurted;
					}
					return (
						!isUnhurted &&
						event.target &&
						!player.hasHistory("sourceDamage", evt => {
							return evt.card === event.card && evt.getParent() === event;
						})
					);
				},
				async content(event, trigger, player) {
					if (event.triggername === "useCardToBefore") {
						trigger.setContent(lib.card.juedou.content);
					} else {
						const card = trigger.card;
						if (!card.storage) {
							card.storage = {};
						}
						card.storage.jsrgguanshi = true;
					}
				},
			},
		},
	},
	jsrgcangxiong: {
		trigger: {
			player: "loseAfter",
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player, triggername) {
			if (event.type === "discard") {
				return event.getl(player).cards2 || [];
			} else if (event.name === "gain") {
				if (event.player === player) {
					return;
				}
				const cardsGained = event.getg(event.player),
					cardsLost = event.getl(player).cards2;
				return cardsLost.filter(card => cardsGained.includes(card));
			} else if (event.name === "loseAsync" && event.type === "gain") {
				const cardsLost = event.getl(player).cards2;
				if (!cardsLost.length) {
					return [];
				}
				const cardsGained = [];
				game.countPlayer2(
					current => {
						if (current !== player) {
							cardsGained.addArray(event.getg(current));
						}
					},
					null,
					true
				);
				return cardsLost.filter(card => cardsGained.includes(card));
			}
			return [];
		},
		filter(event, player, name, card) {
			if (player.isDisabledJudge()) {
				return false;
			}
			if (event.type === "discard") {
				return get.position(card, true) === "d";
			} else {
				const owner = game.findPlayer2(
					current => {
						return current !== player && event.getg(current).includes(card);
					},
					null,
					true
				);
				return owner.getCards("h").includes(card);
			}
		},
		prompt2(event, player, name, card) {
			return `将${get.translation(card)}作为蓄谋牌置入判定区${player.isPhaseUsing() ? "，然后摸一张牌。" : ""}`;
		},
		async content(event, trigger, player) {
			const card = event.indexedData;
			if (get.position(card) === "d") {
				player.$gain2(card, false);
				game.log(player, "使用", card, "进行了明目张胆的蓄谋");
			} else {
				get.owner(card).$giveAuto(card, player, false);
			}
			await game.delayx();
			await player.addJudge({ name: "xumou_jsrg" }, [card]);
			if (player.isPhaseUsing()) {
				await player.draw();
			}
		},
	},
	jsrgjiebing: {
		derivation: "jsrgbaowei",
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		seatRelated: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			const target = lib.skill.jsrgjiebing.getZhugong(player);
			return (
				target &&
				player.countCards("j", card => {
					return (card.viewAs || card.name) == "xumou_jsrg";
				}) > target.getHp()
			);
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp(2);
			await player.recover(2);
			await player.addSkills("jsrgbaowei");
		},
		ai: {
			combo: "jsrgcangxiong",
		},
		getZhugong(player) {
			const mode = get.mode();
			if (mode === "identity") {
				if (_status.mode === "purple") {
					return game.findPlayer2(current => {
						return current.isZhu2() && current.identity.slice(0, 1) === player.identity.slice(0, 1);
					});
				}
				return game.findPlayer2(current => current.isZhu2());
			} else {
				return game.findPlayer2(current => current.getSeatNum() === 1);
			}
		},
	},
	jsrgbaowei: {
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		filter(event, player) {
			return game.hasPlayer(current => {
				return current !== player && (current.getHistory("useCard").length > 0 || current.getHistory("respond").length > 0);
			});
		},
		async content(event, trigger, player) {
			const targets = game.filterPlayer(current => {
				return current !== player && (current.getHistory("useCard").length > 0 || current.getHistory("respond").length > 0);
			});
			if (targets.length > 2) {
				await player.loseHp(2);
			} else {
				let target;
				if (targets.length === 1) {
					[target] = targets;
				} else {
					[target] = await player
						.chooseTarget(true, "暴威：对一名目标角色造成2点伤害", (card, player, target) => {
							return get.event("targets").includes(target);
						})
						.set("targets", targets)
						.set("ai", target => {
							const player = get.player();
							return get.damageEffect(target, player, player) * (1.1 - get.sgn(get.attitude(player, target)));
						})
						.forResult("targets");
				}
				player.line(target, "green");
				target.damage(2);
			}
		},
		ai: {
			//这里应该写一个强命AI，但是比较麻烦，可能还要写全局AI技能，先摆了
		},
	},
	//阳球
	jsrgsaojian: {
		audio: 3,
		enable: "phaseUse",
		usable: 1,
		logAudio: index => (typeof index === "number" ? "jsrgsaojian" + index + ".mp3" : 2),
		filter(event, player) {
			return game.hasPlayer(current => current != player && current.countCards("h") > 0);
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const target = event.target;
			if (target.countCards("h") > 0) {
				const [card] = await player
					.choosePlayerCard(target, true, "h", "visible")
					.set("ai", button => {
						//开摆，直接随机选，不考虑有的没的
						return get.event().getRand(button.link.cardid);
					})
					.forResult("cards");
				const videoId = lib.status.videoId++;
				game.addVideo("showCards", player, [`${get.translation(player)}对${get.translation(target)}发动了【扫奸】`, get.cardsInfo([card])]);
				game.broadcastAll(
					(card, id, player, target) => {
						if (target === game.me) {
							return;
						}
						const dialog = ui.create.dialog(`${get.translation(player)}对${get.translation(target)}发动了【扫奸】`, [card]);
						dialog.forcebutton = true;
						dialog.videoId = id;
					},
					card,
					videoId,
					player,
					target
				);
				await game.delay(3);
				game.broadcastAll("closeDialog", videoId);
				for (let i = 0; i < 5; i++) {
					const discarded = await target
						.chooseToDiscard("h", true)
						.set("ai", card => {
							//开摆，直接随机弃牌，不考虑有的没的
							return get.event().getRand(card.cardid);
						})
						.forResult("cards");
					if (!discarded || !discarded.length || discarded[0] === card) {
						break;
					}
				}
				if (target.countCards("h") > player.countCards("h")) {
					player.logSkill("jsrgsaojian", null, null, null, [3]);
					player.loseHp();
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					//对面牌比自己少，就放心大胆弃牌
					if (target.countCards("h") <= player.countCards("h") - 1) {
						return -3;
					}
					//残血别浪
					if (player.hp === 1 && get.effect(player, { name: "losehp" }, player, player) < 0) {
						return 0;
					}
					//血多无所谓
					return -1;
				},
			},
			tag: {
				loseCard: 1,
				discard: 1,
			},
		},
	},
	mbsaojian: {
		audio: "jsrgsaojian",
		inherit: "jsrgsaojian",
		logAudio: index => (typeof index === "number" ? "jsrgsaojian" + index + ".mp3" : "jsrgsaojian" + get.rand(1, 2) + ".mp3"),
		async content(event, trigger, player) {
			//获取目标角色，主审查官阳球和其余审查官
			const target = event.target,
				targets = [player].concat(
					(() => {
						return get.mode() === "identity" ? [] : player.getFriends();
					})()
				);
			//生成dialog
			const videoId = (event.videoId = lib.status.videoId++),
				eventId = get.id();
			game.broadcastAll(
				(id, player, target, targets, event) => {
					/*if (!targets.includes(game.me)) {
						return;
					}*/
					const dialog = ui.create.dialog("扫奸：" + (game.me === player ? "请选择" : "为" + get.translation(player) + "推荐") + "其中一张牌");
					dialog.videoId = id;
					dialog.add('<div class="text center">' + get.translation(target) + "的手牌</div>");
					dialog.add(target.getCards("h"));
				},
				videoId,
				player,
				target,
				targets,
				event
			);
			//获取人类和AI，AI推荐在前，人类推荐和选牌在中，AI选牌在后
			let humans = targets.filter(current => current === game.me || current.isOnline());
			let locals = targets.slice(),
				card;
			locals.removeArray(humans);
			const send = (current, eventId, videoId, player) => {
				lib.skill.mbsaojian.chooseCard(current, eventId, videoId, player);
				game.resume();
			};
			let time = 10000;
			if (lib.configOL && lib.configOL.choose_timeout) {
				time = parseInt(lib.configOL.choose_timeout) * 1000;
			}
			targets.forEach(current => current.showTimer(time));
			event._global_waiting = true;
			//AI推荐在前
			if (locals.some(current => current !== player)) {
				for (const current of locals) {
					if (current === player) {
						continue;
					}
					const result = await lib.skill.mbsaojian.chooseCard(current, eventId, videoId, player).forResult();
					if (result?.bool && result.links?.length) {
						game.broadcastAll(
							(player, videoId, card) => {
								const dialog = get.idDialog(videoId);
								if (!dialog) {
									return;
								}
								const link = Array.from(dialog.content.childNodes[2].childNodes).find(but => but.link === card);
								const choice = Array.from(dialog.content.childNodes[2].childNodes).find(but => but._mbsaojian_choose?.includes(player));
								if (choice) {
									choice._mbsaojian_choose.remove(player);
									choice.querySelector(".info").innerHTML = choice._mbsaojian_choose.map(i => get.translation(i) + "推荐").join("<br>");
									if (!choice._mbsaojian_choose.length) {
										delete choice._mbsaojian_choose;
										choice.classList.remove("glow2");
									}
								}
								if (choice !== link) {
									if (!link._mbsaojian_choose) {
										link._mbsaojian_choose = [];
									}
									link._mbsaojian_choose.add(player);
									link.querySelector(".info").innerHTML = link._mbsaojian_choose.map(i => get.translation(i) + "推荐").join("<br>");
									if (!link.classList.contains("glow2")) {
										link.classList.add("glow2");
									}
								}
							},
							current,
							videoId,
							result.links[0]
						);
					}
				}
			}
			//人类推荐和选牌在中
			if (humans.length) {
				const solve = function (resolve, reject) {
					return function (result, current) {
						if (result?.bool && result.links?.length) {
							if (current === player) {
								card = result.links[0];
							} else {
								game.broadcastAll(
									(player, videoId, card) => {
										const dialog = get.idDialog(videoId);
										if (!dialog) {
											return;
										}
										const link = Array.from(dialog.content.childNodes[2].childNodes).find(but => but.link === card);
										const choice = Array.from(dialog.content.childNodes[2].childNodes).find(but => but._mbsaojian_choose?.includes(player));
										if (choice) {
											choice._mbsaojian_choose.remove(player);
											choice.querySelector(".info").innerHTML = choice._mbsaojian_choose.map(i => get.translation(i) + "推荐").join("<br>");
											if (!choice._mbsaojian_choose.length) {
												delete choice._mbsaojian_choose;
												choice.classList.remove("glow2");
											}
										}
										if (choice !== link) {
											if (!link._mbsaojian_choose) {
												link._mbsaojian_choose = [];
											}
											link._mbsaojian_choose.add(player);
											link.querySelector(".info").innerHTML = link._mbsaojian_choose.map(i => get.translation(i) + "推荐").join("<br>");
											if (!link.classList.contains("glow2")) {
												link.classList.add("glow2");
											}
										}
									},
									current,
									videoId,
									result.links[0]
								);
							}
							resolve();
						} else {
							reject();
						}
					};
				};
				await Promise.any(
					humans.map(current => {
						return new Promise((resolve, reject) => {
							if (current.isOnline()) {
								current.send(send, current, eventId, videoId, player);
								current.wait(solve(resolve, reject));
							} else {
								const next = lib.skill.mbsaojian.chooseCard(current, eventId, videoId, player);
								const solver = solve(resolve, reject);
								if (_status.connectMode) {
									game.me.wait(solver);
								}
								return next.forResult().then(result => {
									if (_status.connectMode) {
										game.me.unwait(result, current);
									} else {
										solver(result, current);
									}
								});
							}
						});
					})
				).catch(() => {});
				game.broadcastAll("cancel", eventId);
			}
			//AI选牌在后
			if (locals.includes(player)) {
				const result = await lib.skill.mbsaojian.chooseCard(player, eventId, videoId, player).forResult();
				if (result?.bool && result.links?.length) {
					card = result.links[0];
				}
			}
			//关闭框，结算
			game.broadcastAll("closeDialog", videoId);
			delete event._global_waiting;
			for (const current of targets) {
				current.hideTimer();
			}
			//结算后续
			for (let i = 0; i < 5; i++) {
				const { result } = await target.chooseToDiscard("h", true).set("ai", card => {
					//开摆，直接随机弃牌，不考虑有的没的
					return 1 + Math.random();
				});
				if (!result?.cards?.length || result.cards[0] === card) {
					break;
				}
			}
			if (target.countCards("h") > player.countCards("h")) {
				player.logSkill("mbsaojian", null, null, null, [3]);
				await player.loseHp();
			}
		},
		chooseCard(player, eventId, videoId, source) {
			const dialog = get.idDialog(videoId),
				forced = player === source;
			return player
				.chooseButton([1, 2])
				.set("dialog", dialog)
				.set("ai", button => {
					if (!get.event().forced) {
						return 1 + Math.random();
					}
					return 1 + Math.random() + button._mbsaojian_choose?.length;
				})
				.set("forced", forced)
				.set("filterButton", () => !ui.selected.buttons.length)
				.set("id", eventId)
				.set("_global_waiting", true);
		},
	},
	//张角
	jsrgxiangru: {
		trigger: { global: "damageBegin2" },
		filter(event, player) {
			if (event.player.hp + event.player.hujia > event.num) {
				return false;
			}
			const source = event.source;
			if (!source || !source.isIn()) {
				return false;
			}
			if (player !== event.player) {
				return event.player.isDamaged() && player !== source && player.countCards("he") > 1;
			}
			return game.hasPlayer(current => {
				return current !== source && current !== player && current.isDamaged() && current.countCards("he") >= 1;
			});
		},
		async cost(event, trigger, player) {
			const target = trigger.player,
				source = trigger.source;
			const targets = (
				target === player
					? game.filterPlayer(current => {
							return current !== source && current !== player && current.isDamaged() && current.countCards("he") >= 1;
					  })
					: [player]
			).filter(current => current !== source && current !== target && current.countCards("he") >= 1);
			targets.sortBySeat();
			let cards = null,
				giver = null;
			const eventId = get.id(),
				send = (target, source, current, eventId, eventNum) => {
					lib.skill.jsrgxiangru.chooseTarget(target, source, current, eventId, eventNum);
					game.resume();
				},
				humans = targets.filter(current => current === game.me || current.isOnline()),
				locals = targets.slice(0);
			locals.removeArray(humans);
			//让读条不消失并显示读条
			event._global_waiting = true;
			let time = 10000;
			if (lib.configOL && lib.configOL.choose_timeout) {
				time = parseInt(lib.configOL.choose_timeout) * 1000;
			}
			targets.forEach(current => current.showTimer(time));
			//先处理人类玩家
			if (humans.length > 0) {
				const solve = function (resolve, reject) {
					return function (result, player) {
						if (result && result.bool && !cards) {
							resolve();
							giver = player;
							cards = result.cards;
						} else {
							reject();
						}
					};
				};
				await Promise.any(
					humans.map(current => {
						return new Promise((resolve, reject) => {
							if (current.isOnline()) {
								current.send(send, target, source, current, eventId, trigger.num);
								current.wait(solve(resolve, reject));
							} else {
								const next = lib.skill.jsrgxiangru.chooseTarget(target, source, current, eventId, trigger.num);
								const solver = solve(resolve, reject);
								if (_status.connectMode) {
									game.me.wait(solver);
								}
								return next.forResult().then(result => {
									if (_status.connectMode && !cards) {
										game.me.unwait(result, current);
									} else {
										solver(result, current);
									}
								});
							}
						});
					})
				).catch(() => {});
				game.broadcastAll("cancel", eventId);
			}
			//再处理单机的他人控制玩家/AI玩家
			if (!cards && locals.length > 0) {
				for (let current of locals) {
					if (cards) {
						continue;
					}
					const result = await lib.skill.jsrgxiangru.chooseTarget(target, source, current).forResult();
					if (result.bool) {
						giver = current;
						cards = result.cards;
					}
				}
			}
			//清除读条
			delete event._global_waiting;
			for (var i of targets) {
				i.hideTimer();
			}
			//处理结果
			if (cards) {
				event.result = {
					bool: true,
					targets: [player === target ? giver : target],
					cost_data: { cards, giver },
				};
				game.broadcastAll(result => console.log(result), event.result);
			}
		},
		async content(event, trigger, player) {
			const { giver, cards } = event.cost_data;
			await giver.give(cards, trigger.source);
			trigger.cancel();
		},
		chooseTarget(target, source, current, eventId, eventNum) {
			const goon = (() => {
				//资敌的代价太大，因此不到万不得已不给牌
				if (get.attitude(current, target) < 4) {
					return false;
				}
				if (current.countCards("hs", card => current.canSaveCard(card, target)) >= 1 - (target.hp + target.hujia - eventNum)) {
					return false;
				}
				if (target == get.zhu(current) || get.attitude(current, source) > 0) {
					return "长崎素世一般的恳求";
				}
				return "给点废牌算了";
			})();
			const next = current.chooseCard("he", 2);
			next.set("prompt", `是否对${get.translation(target)}发动【相濡】？`);
			next.set("prompt2", `选择交给${get.translation(source)}两张牌，然后防止${get.translation(target)}即将受到的致命伤害。`);
			next.set("id", eventId);
			next.set("_global_waiting", true);
			next.set("ai", card => {
				if (goon) {
					if (goon.includes("长崎素世")) {
						return 20 - get.value(card);
					}
					return 5 - get.value(card);
				}
				return 0;
			});
			return next;
		},
	},
	jsrgwudao: {
		derivation: "jsrgjinglei",
		trigger: { global: "dying" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return player.countCards("h") === 0;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp();
			await player.recover();
			await player.addSkills("jsrgjinglei");
		},
	},
	jsrgjinglei: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(current => !current.isMinHandcard() && current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "选择一名其他角色，令任意名手牌数之和小于其的角色各对其造成1点雷属性伤害", (card, player, target) => !target.isMinHandcard() && target != player)
				.set("ai", target => {
					//AI写的比较简单：不打队友，根据手牌数平方根酌情打牌多的
					const player = get.player();
					if (get.attitude(player, target) >= 0) {
						return false;
					}
					return get.damageEffect(target, player, player, "thunder") * Math.sqrt(target.countCards("h"));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			const maxmium = target.countCards("h");
			const next = player.chooseTarget(true, `选择任意名手牌数之和小于${maxmium}的角色`, [1, Infinity]);
			next.set("promptbar", "none");
			next.set("maxmium", maxmium);
			next.set("complexTarget", true);
			next.set("filterTarget", (card, player, target) => {
				const selected = ui.selected.targets,
					maxmium = get.event("maxmium");
				return (
					selected.reduce((p, c) => {
						return p + c.countCards("h");
					}, target.countCards("h")) < maxmium
				);
			});
			next.set("ai", target => {
				//谁手牌少就选谁，没啥要考虑的
				return 1 / (1 + target.countCards("h"));
			});
			const sources = await next.forResult("targets");
			sources.sortBySeat();
			player.line(sources, "thunder");
			for (let source of sources) {
				if (!source.isIn() || !target.isIn()) {
					continue;
				}
				target.damage(source, "thunder");
			}
		},
	},
	//宋皇后
	jsrgzhongzen: {
		trigger: { player: "phaseDiscardBegin" },
		forced: true,
		filter(event, player) {
			const hs = player.countCards("h");
			return game.hasPlayer(current => {
				if (current === player) {
					return false;
				}
				const hs2 = current.countCards("h");
				return hs2 > 0 && hs2 < hs;
			});
		},
		logTarget(event, player) {
			const hs = player.countCards("h");
			return game.filterPlayer(current => {
				if (current === player) {
					return false;
				}
				const hs2 = current.countCards("h");
				return hs2 > 0 && hs2 < hs;
			});
		},
		async content(event, trigger, player) {
			const targets = event.targets.slice(0);
			targets.forEach(async target => {
				if (player.isIn() && target.countCards("h") > 0) {
					//暂时没有写给牌AI
					await target.chooseToGive(player, "h", true);
				}
			});
		},
		group: "jsrgzhongzen_discard",
		subSkill: {
			discard: {
				trigger: { player: "phaseDiscardEnd" },
				forced: true,
				filter(event, player) {
					if (player.countCards("he") === 0) {
						return false;
					}
					const cards = [];
					player.getHistory("lose", evt => {
						if (evt.type === "discard" && evt.getParent("phaseDiscard") === event) {
							cards.addArray(evt.cards);
						}
					});
					return (
						cards.length > player.hp &&
						cards.reduce((num, card) => {
							if (num <= player.hp && get.suit(card, false) === "spade") {
								num++;
							}
							return num;
						}, 0) > player.hp
					);
				},
				async content(event, trigger, player) {
					await player.chooseToDiscard(true, "he", player.countCards("he"));
				},
			},
		},
	},
	jsrgxuchong: {
		trigger: { target: "useCardToTargeted" },
		async cost(event, trigger, player) {
			const current = _status.currentPhase;
			const choices = ["摸一张牌"];
			if (current) {
				choices.push(`令${get.translation(current)}本回合的手牌上限+2`);
			}
			//暂时不写AI，默认摸牌，先爽再说
			const control = await player.chooseControl("cancel2").set("choiceList", choices).forResult("control");
			if (control !== "cancel2") {
				event.result = {
					bool: true,
					targets: control === "选项二" ? [current] : [],
				};
			}
		},
		async content(event, trigger, player) {
			if (event.targets && event.targets.length) {
				const [target] = event.targets;
				target.addTempSkill("jsrgxuchong_effect");
				target.addMark("jsrgxuchong_effect", 2, false);
			} else {
				await player.draw();
			}
			await player.gain(lib.card.ying.getYing(1), "gain2");
		},
		subSkill: {
			effect: {
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("jsrgxuchong_effect");
					},
				},
				onremove: true,
				charlotte: true,
				intro: {
					content: "手牌上限+#",
				},
			},
		},
	},
	//曹节王甫
	jsrgzonghai: {
		trigger: { global: "dying" },
		logTarget: "player",
		round: 1,
		filter(event, player) {
			return event.player !== player && event.player.hp <= 0;
		},
		check(event, player) {
			//理论上是小完杀+卖血
			//我没意见
			return get.attitude(player, event.player) < 0;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			const targets = await target
				.chooseTarget([1, 2], true, "请选择至多两名角色", `${get.translation(player)}对你发动了【纵害】。你可以选择至多两名角色，只有他（们）可以使用牌拯救你，且当此次濒死结算结束后，他（们均）会受到来自${get.translation(player)}的1点伤害。`)
				.set("ai", target => {
					//自救还要挨一刀，最好的反制方法就是跟对面爆了
					const evt = get.event(),
						player = evt.player,
						source = evt.getParent().player;
					return get.damageEffect(target, source, player);
				})
				.set("forceDie", true)
				.forResult("targets");
			target.line(targets);
			game.log(target, "选择了", targets);
			targets.sortBySeat(_status.currentPhase || player);
			const allPlayers = game.filterPlayer().sortBySeat();
			if (!trigger._jsrgzonghai_id) {
				trigger._jsrgzonghai_id = get.id();
			}
			const id = trigger._jsrgzonghai_id;
			allPlayers.forEach(target => {
				if (!targets.includes(target)) {
					target.addTempSkill("jsrgzonghai_blocker");
					target.markAuto("jsrgzonghai_blocker", [id]);
				}
			});
			target.addSkill("jsrgzonghai_damage");
			if (!target.storage.jsrgzonghai_damage) {
				target.storage.jsrgzonghai_damage = [];
			}
			target.storage.jsrgzonghai_damage.push({
				id: id,
				targets: targets,
				source: player,
			});
		},
		subSkill: {
			blocker: {
				charlotte: true,
				onremove: true,
				mod: {
					cardSavable: (card, player) => {
						if (player.getStorage("jsrgzonghai_blocker").includes(get.event().getParent()._jsrgzonghai_id)) {
							return false;
						}
					},
					cardEnabled: (card, player) => {
						if (player.getStorage("jsrgzonghai_blocker").includes(get.event().getParent()._jsrgzonghai_id)) {
							return false;
						}
					},
				},
			},
			damage: {
				trigger: {
					player: "dyingAfter",
				},
				filter(event, player) {
					let storage = player.getStorage("jsrgzonghai_damage");
					for (let i of storage) {
						if (i.id == event._jsrgzonghai_id) {
							return true;
						}
					}
					return false;
				},
				silent: true,
				forceDie: true,
				charlotte: true,
				async content(event, trigger, player) {
					let storage;
					for (let i = 0; i < player.storage.jsrgzonghai_damage.length; i++) {
						if (player.storage.jsrgzonghai_damage[i].id == trigger._jsrgzonghai_id) {
							storage = player.storage.jsrgzonghai_damage[i];
							player.storage.jsrgzonghai_damage.splice(i, 1);
							break;
						}
					}
					if (!storage) {
						return;
					}
					game.countPlayer(target => {
						target.unmarkAuto("jsrgzonghai_blocker", [storage.id]);
						if (!target.getStorage("jsrgzonghai_blocker").length) {
							target.removeSkill("jsrgzonghai_blocker");
						}
					});
					if (storage.source.isIn()) {
						while (storage.targets.length) {
							let target = storage.targets.shift();
							if (target.isIn()) {
								await target.damage(storage.source);
							}
						}
					}
					if (!player.storage.jsrgzonghai_damage.length) {
						player.removeSkill("jsrgzonghai_damage");
					}
				},
			},
		},
	},
	jsrgjueyin: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.getHistory("damage")[0] === event;
		},
		async content(event, trigger, player) {
			await player.draw(3);
			const targets = game.filterPlayer().sortBySeat();
			targets.forEach(current => {
				current.addTempSkill("jsrgjueyin_damage");
				current.addMark("jsrgjueyin_damage", 1, false);
			});
		},
		subSkill: {
			damage: {
				onremove: true,
				charlotte: true,
				trigger: { player: "damageBegin1" },
				forced: true,
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
				intro: {
					content: "本回合受到的伤害+#",
				},
			},
		},
	},
	//梦袁绍
	jsrgzhimeng: {
		trigger: { player: "phaseZhunbeiBegin" },
		logTarget() {
			return game.filterPlayer(current => current.countCards("h") > 0).sortBySeat();
		},
		prompt: "是否发动【执盟】？",
		async content(event, trigger, player) {
			const { cards } = await game.cardsGotoOrdering(get.cards(game.countPlayer()));
			await player.showCards(cards, `${get.translation(player)}发动了【执盟】`);
			const targets = game.filterPlayer(current => current.countCards("h") > 0).sortBySeat();
			//选牌
			const showCardEvent = player.chooseCardOL(targets, `${get.translation(player)}发动了【执盟】，请展示一张手牌`, true);
			showCardEvent.set("ai", card => {
				if (get.event("_suits").includes(get.suit(card))) {
					return 1 + Math.random();
				}
				return (1 - get.value(card)) * Math.random();
			});
			showCardEvent.set(
				"_suits",
				cards.map(card => get.suit(card, false))
			);
			showCardEvent.set("source", player);
			showCardEvent.set("aiCard", target => {
				const hs = target.getCards("h");
				return { bool: true, cards: [hs.randomGet()] };
			});
			showCardEvent._args.remove("glow_result");
			const result = await showCardEvent.forResult();
			//选完了 展示牌
			const videoId = lib.status.videoId++;
			const cardsToShown = [];
			for (let i = 0; i < targets.length; i++) {
				cardsToShown.push(result[i].cards[0]);
				game.log(targets[i], "展示了", result[i].cards[0]);
			}
			game.broadcastAll(
				(targets, cards, id, player) => {
					const dialog = ui.create.dialog(get.translation(player) + "发动了【执盟】", cards);
					dialog.videoId = id;
					const getName = function (target) {
						if (target._tempTranslate) {
							return target._tempTranslate;
						}
						var name = target.name;
						if (lib.translate[name + "_ab"]) {
							return lib.translate[name + "_ab"];
						}
						return get.translation(name);
					};
					for (let i = 0; i < targets.length; i++) {
						dialog.buttons[i].querySelector(".info").innerHTML = getName(targets[i]) + get.translation(get.suit(cards[i], targets[i]));
					}
				},
				targets,
				cardsToShown,
				videoId,
				player
			);
			await game.delay(4);
			game.broadcastAll("closeDialog", videoId);
			//展示完了 开始拿牌
			const suitsMap = {};
			for (let i = 0; i < targets.length; i++) {
				const target = targets[i],
					card = cardsToShown[i],
					suit = get.suit(card, target);
				if (!(suit in suitsMap)) {
					suitsMap[suit] = target;
				} else {
					suitsMap[suit] = null;
				}
			}
			const gain_list = [];
			for (const data of Object.entries(suitsMap)) {
				const [suit, target] = data;
				if (target) {
					const cardsToGain = cards.filter(card => get.suit(card, false) === suit);
					if (cardsToGain.length) {
						gain_list.push([target, cardsToGain]);
					}
				}
			}
			if (gain_list.length) {
				await game
					.loseAsync({
						gain_list,
						animate: "gain2",
					})
					.setContent("gaincardMultiple");
			}
		},
	},
	jsrgtianyu: {
		trigger: { global: ["loseAsyncAfter", "cardsDiscardAfter"] },
		// frequent: true,
		getIndex(event) {
			return lib.skill.jsrgtianyu.getCards(event);
		},
		filter(event, player, triggername, card) {
			return get.position(card, true) === "d";
		},
		frequent(event, player, triggername, card) {
			return get.value(card, player) > 0;
		},
		getCards(event) {
			const cards = event.getd().filter(card => {
				return get.type(card, null, false) === "equip" || get.tag(card, "damage", null, false) > 0;
			});
			if (!cards.length) {
				return [];
			}
			game.checkGlobalHistory("cardMove", evt => {
				if (evt.name === "lose") {
					cards.removeArray(evt.cards);
				}
			});
			return cards;
		},
		prompt2(event, player, triggername, card) {
			return `获得即将进入弃牌堆的${get.translation(card)}`;
		},
		async content(event, trigger, player) {
			const cards = event.indexedData;
			await player.gain(cards, "gain2");
		},
	},
	jsrgzhuni: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			let targets = event.targets.slice(0),
				results = [],
				forceTargets = [];
			//XXX自选选择目标
			if (player.hasSkill("jsrghezhi")) {
				forceTargets = targets.filter(current => current !== player && current.group === "qun");
				targets.removeArray(forceTargets);
			}
			//让读条不消失
			event._global_waiting = true;
			const send = (player, source) => {
				lib.skill.jsrgzhuni.chooseTarget(player, source);
				game.resume();
			};
			const solve = (result, chooser) => {
				let target;
				if (!result || !result.targets || result === "ai") {
					target = game.filterPlayer(current => current !== player).randomGet();
				} else {
					target = result.targets[0];
				}
				results.push([chooser, target]);
				if (chooser === player) {
					forceTargets.forEach(current => results.push([current, target]));
				}
			};
			let time = 10000;
			if (lib.configOL && lib.configOL.choose_timeout) {
				time = parseInt(lib.configOL.choose_timeout) * 1000;
			}
			targets.forEach(current => current.showTimer(time));
			//分别处理人类玩家和其他玩家
			const humans = targets.filter(current => current === game.me || current.isOnline()),
				locals = targets.slice(0);
			locals.removeArray(humans);
			//Promise，爽！清瑶你有种抄过去
			if (humans.length) {
				await Promise.all(
					humans.map((current, index) => {
						return new Promise((resolve, reject) => {
							if (current.isOnline()) {
								current.send(send, current, player);
								current.wait((result, player) => {
									solve(result, player);
									resolve();
								});
							} else if (current == game.me) {
								const next = lib.skill.jsrgzhuni.chooseTarget(current, player);
								const solver = (result, player) => {
									solve(result, player);
									resolve();
								};
								if (_status.connectMode) {
									game.me.wait(solver);
								}
								return next.forResult().then(result => {
									if (_status.connectMode) {
										game.me.unwait(result, current);
									} else {
										solver(result, current);
									}
								});
							}
						});
					})
				);
			}
			if (locals.length) {
				for (let current of locals) {
					const next = lib.skill.jsrgzhuni.chooseTarget(current, player);
					const result = await next.forResult();
					solve(result, current);
				}
			}
			//清除读条
			delete event._global_waiting;
			for (var i of targets) {
				i.hideTimer();
			}
			//统计票数
			const ticketsMap = new Map();
			results.forEach(data => {
				const [source, current] = data;
				source.line(current);
				game.log(source, forceTargets.includes(source) ? "自愿选择" : "选择了", current, "作为讨伐目标");
				ticketsMap.set(current, (ticketsMap.get(current) || 0) + 1);
			});
			let maxTicket = 0;
			const target = ticketsMap.entries().reduce((target, data) => {
				const [current, ticket] = data;
				if (ticket > maxTicket) {
					maxTicket = ticket;
					return current;
				} else if (ticket === maxTicket) {
					return false;
				} else {
					return target;
				}
			}, false);
			//上Buff
			if (target) {
				game.log(target, "成为了", "#g【诛逆】", "的讨伐目标");
				player.addTempSkill("jsrgzhuni_effect");
				player.markAuto("jsrgzhuni_effect", [target]);
			}
			event.getParent().maxTicket = maxTicket;
		},
		ai: {
			order: 10,
			result: { player: 1 },
			threaten: 1.8,
		},
		chooseTarget(player, source) {
			const next = player.chooseTarget(`${get.translation(source)}发动了【诛逆】，请选择一名讨伐目标`, (card, player, target) => target !== source, true);
			next.set("ai", target => -get.attitude(get.player(), target));
			next.set("animate", false);
			next.set("_global_waiting", true);
			return next;
		},
		subSkill: {
			effect: {
				onremove: true,
				mod: {
					targetInRange(card, player, target) {
						if (player.getStorage("jsrgzhuni_effect").includes(target)) {
							return true;
						}
					},
					cardUsableTarget(card, player, target) {
						if (player.getStorage("jsrgzhuni_effect").includes(target)) {
							return true;
						}
					},
				},
				charlotte: true,
				intro: {
					content: "对$使用牌无距离和次数限制",
				},
			},
		},
	},
	jsrghezhi: {
		zhuSkill: true,
		locked: true,
	},
	//江山如故·合
	//蓄谋临时禁用
	xumou_jsrg_temp: {
		charlotte: true,
		onremove: true,
		mod: {
			cardEnabled(card, player) {
				if (!card.storage || !card.storage.xumou_jsrg) {
					return;
				}
				if (player.getStorage("xumou_jsrg_temp").includes(get.name(card, false))) {
					return false;
				}
			},
		},
	},
	//404诸葛亮
	jsrgwentian: {
		trigger: { player: ["phaseZhunbeiBegin", "phaseJudgeBegin", "phaseDrawBegin", "phaseUseBegin", "phaseDiscardBegin", "phaseJieshuBegin"] },
		usable: 1,
		prompt2: "观看牌堆顶的五张牌，将其中一张交给其他角色，并将其余牌置于牌堆顶或牌堆底",
		group: "jsrgwentian_viewas",
		async content(event, trigger, player) {
			const cards = get.cards(5);
			game.cardsGotoOrdering(cards);
			const { result } = await player.chooseButton(["问天：将一张牌交给一名其他角色", cards], true);
			if (result.bool) {
				const { result: result2 } = await player.chooseTarget(`将${get.translation(result.links)}交给一名其他角色`, lib.filter.notMe, true).set("ai", target => {
					return get.attitude(get.player(), target);
				});
				if (result2.bool) {
					cards.removeArray(result.links);
					const target = result2.targets[0];
					player.line(target, "green");
					await target.gain(result.links, "gain2").set("giver", player);
				}
			}
			const next = player.chooseToMove();
			next.set("list", [["牌堆顶", cards.filterInD()], ["牌堆底"]]);
			next.set("prompt", "问天：点击或拖动将牌移动到牌堆顶或牌堆底");
			next.processAI = list => {
				const cards = list[0][1],
					player = _status.event.player;
				const top = [];
				const judges = player.getCards("j");
				let stopped = false;
				if (!player.hasWuxie()) {
					for (let i = 0; i < judges.length; i++) {
						const judge = get.judge(judges[i]);
						cards.sort((a, b) => judge(b) - judge(a));
						if (judge(cards[0]) < 0) {
							stopped = true;
							break;
						} else {
							top.unshift(cards.shift());
						}
					}
				}
				let bottom;
				if (!stopped) {
					cards.sort((a, b) => get.value(b, player) - get.value(a, player));
					while (cards.length) {
						if (get.value(cards[0], player) <= 5) {
							break;
						}
						top.unshift(cards.shift());
					}
				}
				bottom = cards;
				return [top, bottom];
			};
			const {
				result: { moved },
			} = await next;
			const top = moved[0];
			const bottom = moved[1];
			top.reverse();
			game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event, card) => {
				if (event.top_cards.includes(card)) {
					return ui.cardPile.firstChild;
				}
				return null;
			});
			player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
			game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
			await game.delayx();
		},
		subSkill: {
			viewas: {
				audio: "jsrgwentian",
				enable: "chooseToUse",
				filter(event, player) {
					for (const name of ["wuxie", "huogong"]) {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
							return true;
						}
					}
					return false;
				},
				hiddenCard(player, name) {
					if (player.isTempBanned("jsrgwentian")) {
						return false;
					}
					return name == "wuxie";
				},
				viewAs(cards, player) {
					const event = get.event(),
						filter = event._backup.filterCard;
					for (const name of ["wuxie", "huogong"]) {
						if (filter(get.autoViewAs({ name }, "unsure"), player, event)) {
							return { name };
						}
					}
					return null;
				},
				filterCard: () => false,
				selectCard: -1,
				prompt() {
					const player = get.player();
					const event = get.event(),
						filter = event._backup.filterCard;
					let str = "将牌堆顶的牌当【";
					for (const name of ["wuxie", "huogong"]) {
						if (filter({ name }, player, event)) {
							str += get.translation(name);
							break;
						}
					}
					str += "】使用";
					return str;
				},
				log: false,
				precontent() {
					player.logSkill("jsrgwentian");
					const cards = get.cards();
					event.result.cards = cards;
					game.cardsGotoOrdering(cards);
					const color = event.result.card.name == "wuxie" ? "black" : "red";
					if (get.color(cards, false) != color) {
						player.tempBanSkill("jsrgwentian", "roundStart");
					}
				},
			},
		},
	},
	jsrgchushi: {
		available(mode) {
			return mode == "identity" || (mode == "versus" && (_status.mode == "four" || _status.mode == "guandu"));
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			const zhu = get.zhu(player);
			if (!zhu || !zhu.isZhu2() || !zhu.isIn() || !zhu.countCards("h")) {
				return false;
			}
			return !player.isZhu2() && player.countCards("h");
		},
		async content(event, trigger, player) {
			const next = player
				.chooseToDebate(
					game.filterPlayer(current => {
						return (current == player || current.isZhu2()) && current.countCards("h");
					})
				)
				.set("callback", async event => {
					const result = event.debateResult;
					if (result.bool && result.opinion) {
						const { opinion, targets } = result;
						if (!["red", "black"].includes(opinion)) {
							return;
						}
						targets.sortBySeat();
						if (opinion == "red") {
							do {
								for (const current of targets) {
									await current.draw();
								}
							} while (
								targets
									.map(current => {
										return current.countCards("h");
									})
									.reduce((p, c) => {
										return p + c;
									}, 0) < 7
							);
						} else {
							player.addMark("jsrgchushi_add", 1, false);
							player.addTempSkill("jsrgchushi_add", "roundStart");
						}
					}
				});
			if (get.attitude(get.zhu(player), player) > 0) {
				//听话的主公应该忠臣给啥你亮啥
				next.set("ai", card => {
					const target = get.zhu(player),
						history = target.getHistory("gain", evt => evt.getParent("jsrgwentian", true)?.player == player);
					if (history.length && get.color(card) == get.color(history[0].cards[0])) {
						return 2 + Math.random();
					}
					return Math.random();
				});
			}
			await next;
		},
		ai: {
			order(item, player) {
				if (!player) {
					player = get.player();
				}
				const target = get.zhu(player);
				if (!target) {
					return 0.1;
				}
				if (get.attitude(player, target) <= 0) {
					return 0.1;
				}
				const history = target.getHistory("gain", evt => evt.getParent("jsrgwentian", true)?.player == player);
				if (!history.length) {
					return 5;
				}
				if (get.color(history[0].cards[0]) == "red") {
					return 1;
				}
				return 11;
			},
			result: {
				player(player) {
					const target = get.zhu(player);
					if (!target) {
						return 0;
					}
					return get.attitude(player, target);
				},
			},
		},
		subSkill: {
			add: {
				audio: "jsrgchushi",
				trigger: { source: "damageBegin1" },
				filter(event) {
					return event.hasNature("linked");
				},
				forced: true,
				charlotte: true,
				onremove: true,
				async content(_, trigger, player) {
					trigger.num += player.countMark("jsrgchushi_add");
				},
				ai: {
					damageBonus: true,
					skillTagFilter(player, tag, arg) {
						if (tag === "damageBonus") {
							return arg && arg.card && game.hasNature(arg.card, "linked");
						}
					},
				},
				intro: {
					content: "造成的属性伤害+#",
				},
			},
		},
	},
	jsrgyinlve: {
		trigger: {
			global: "damageBegin4",
		},
		filter(event, player) {
			return event.player.isIn() && ["fire", "thunder"].some(n => !player.getStorage("jsrgyinlve_used").includes(n) && event.hasNature(n));
		},
		check(event, player) {
			if (get.damageEffect(event.player, event.source, player, get.natureList(event.nature)) < -5) {
				return true;
			}
			return false;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.cancel();
			const natures = ["fire", "thunder"];
			let index;
			if (natures.every(n => !player.getStorage("jsrgyinlve_used").includes(n) && trigger.hasNature(n))) {
				const { result } = await player.chooseControl(["摸牌阶段", "弃牌阶段"]).set("prompt", "请选择要新回合内仅有的阶段");
				index = result.index;
			} else {
				index = [0, 1].find(i => !player.getStorage("jsrgyinlve_used").includes(natures[i]) && trigger.hasNature(natures[i]));
			}
			player.addTempSkill("jsrgyinlve_used", "roundStart");
			player.markAuto("jsrgyinlve_used", natures[index]);
			player.insertPhase().set("phaseList", [["phaseDraw", "phaseDiscard"][index]]);
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//姜维
	jsrgjinfa: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "h",
		discard: false,
		lose: false,
		delay: false,
		check() {
			return 1 + Math.random();
		},
		async content(event, trigger, player) {
			await player.showCards(event.cards);
			player
				.chooseToDebate(
					game.filterPlayer(current => {
						return current.maxHp <= player.maxHp;
					})
				)
				.set("callback", async event => {
					const result = event.debateResult;
					if (result.bool && result.opinion) {
						const { cards: fixedCards } = event.getParent("jsrgjinfa");
						const color = get.color(fixedCards);
						const { opinion, targets } = result;
						if (opinion == color) {
							const { result } = await player
								.chooseTarget("是否令至多两名参与议事的角色将手牌摸至体力上限？", [1, 2], (card, player, target) => {
									return get.event("targets").includes(target);
								})
								.set("targets", targets)
								.set("ai", target => {
									const player = get.player();
									const att = get.attitude(player, target);
									if (att <= 0) {
										return -1;
									}
									return att * Math.sqrt(Math.max(0.1, target.maxHp - target.countCards("h")));
								});
							if (result.bool) {
								const targets = result.targets;
								targets.sortBySeat();
								player.line(targets, "green");
								for (const current of targets) {
									if (current.countCards("h") < current.maxHp) {
										await current.drawTo(current.maxHp);
									}
								}
							}
						} else {
							await player.gain(lib.card.ying.getYing(2), "gain2");
						}
					}
					if (result.opinions.some(idea => idea != "others" && result[idea].length == 1 && result[idea][0][0] == player)) {
						const list = lib.group.slice();
						list.remove(player.group);
						list.push("cancel2");
						const {
							result: { control },
						} = await player
							.chooseControl(list)
							.set("prompt", "是否变更势力？")
							.set("ai", () => {
								if (!get.event("change")) {
									return "cancel2";
								}
								const controls = get.event("controls");
								const groups = ["wei", "shu"].filter(g => controls.includes(g));
								if (groups.length) {
									return groups.randomGet();
								}
								return controls.randomGet();
							})
							.set("change", ["wei", "shu"].includes(player.group) ? Math.random() < 0.5 : true);
						if (control != "cancel2") {
							player.popup(control + "2", get.groupnature(control, "raw"));
							player.changeGroup(control);
						}
					}
				});
		},
		ai: {
			order(item, player) {
				if (player.countCards("h") == 1) {
					return 10;
				}
				return 1;
			},
			result: {
				player: 1,
			},
		},
	},
	jsrgfumou: {
		trigger: { global: "chooseToDebateAfter" },
		groupSkill: "wei",
		forced: true,
		locked: false,
		filter(event, player) {
			if (player.group != "wei") {
				return false;
			}
			if (!event.targets.includes(player)) {
				return false;
			}
			if (event.red.some(i => i[0] == player)) {
				return event.black.length;
			}
			if (event.black.some(i => i[0] == player)) {
				return event.red.length;
			}
			return false;
		},
		async content(event, trigger, player) {
			const targets = [];
			if (trigger.red.some(i => i[0] == player)) {
				targets.addArray(trigger.black.map(i => i[0]));
			}
			if (trigger.black.some(i => i[0] == player)) {
				targets.addArray(trigger.red.map(i => i[0]));
			}
			player.line(targets, "thunder");
			targets.forEach(target => {
				target.addTempSkill("jsrgfumou_forbid");
				target.markAuto(
					"jsrgfumou_forbid",
					["red", "black"].filter(color => {
						return trigger[color].some(i => i[0] == target);
					})
				);
			});
			game.broadcastAll(targets => {
				lib.skill.jsrgfumou_backup.targets = targets;
			}, targets);
			const next = player.chooseToUse();
			next.set("openskilldialog", `是否将一张【影】当【出其不意】对一名与你意见不同的角色使用？`);
			next.set("norestore", true);
			next.set("_backupevent", "jsrgfumou_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("jsrgfumou_backup");
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card" && get.name(card) == "ying";
				},
				viewAs: { name: "chuqibuyi" },
				selectCard: 1,
				position: "hs",
				log: false,
				filterTarget(card, player, target) {
					const targets = lib.skill.jsrgfumou_backup.targets;
					if (!targets.includes(target) || ui.selected.targets.containsSome(targets)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				},
				ai1(card) {
					return 6 - get.value(card);
				},
			},
			forbid: {
				charlotte: true,
				onremove: true,
				mod: {
					cardEnabled(card, player) {
						const color = get.color(card);
						if (color != "unsure" && player.getStorage("jsrgfumou_forbid").includes(color)) {
							return false;
						}
					},
					cardRespondable(card, player) {
						const color = get.color(card);
						if (color != "unsure" && player.getStorage("jsrgfumou_forbid").includes(color)) {
							return false;
						}
					},
					cardSavable(card, player) {
						const color = get.color(card);
						if (color != "unsure" && player.getStorage("jsrgfumou_forbid").includes(color)) {
							return false;
						}
					},
				},
				mark: true,
				intro: {
					content: "本回合不能使用或打出$牌",
				},
			},
		},
	},
	jsrgxuanfeng: {
		enable: "chooseToUse",
		filterCard: { name: "ying" },
		position: "hs",
		groupSkill: "shu",
		locked: false,
		viewAs: {
			name: "sha",
			nature: "stab",
			storage: { jsrgxuanfeng: true },
		},
		viewAsFilter(player) {
			if (player.group != "shu") {
				return false;
			}
			if (!player.countCards("hs", "ying")) {
				return false;
			}
		},
		prompt: "将一张【影】当无距离和次数限制的刺【杀】使用",
		check(card) {
			const val = get.value(card);
			return 5 - val;
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.storage && card.storage.jsrgxuanfeng) {
					return true;
				}
			},
			cardUsable(card) {
				if (card.storage && card.storage.jsrgxuanfeng) {
					return Infinity;
				}
			},
		},
		ai: {
			order: 2,
			combo: "jsrgjinfa",
		},
	},
	//陆逊
	jsrgyoujin: {
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(current => {
				return player.canCompare(current);
			});
		},
		direct: true,
		async content(event, trigger, player) {
			const { result } = await player
				.chooseTarget(get.prompt2("jsrgyoujin"), (card, player, target) => {
					return player.canCompare(target);
				})
				.set("ai", target => {
					if (!get.event("goon")) {
						return 0;
					}
					return -get.attitude(get.player(), target);
				})
				.set("goon", player.countCards("hs", ["shan", "caochuan"]) || player.getHp() >= 3);
			if (!result.bool) {
				return;
			}
			const { targets } = result,
				target = targets[0];
			player.logSkill("jsrgyoujin", target);
			const { result: result2 } = await player.chooseToCompare(target).set("small", true);
			player.addTempSkill("jsrgyoujin_forbid");
			player.markAuto("jsrgyoujin_forbid", [result2.num1]);
			target.addTempSkill("jsrgyoujin_forbid");
			target.markAuto("jsrgyoujin_forbid", [result2.num2]);
			if (!result2.tie) {
				const targets = [target, player];
				if (result2.bool) {
					targets.reverse();
				}
				const sha = new lib.element.VCard({ name: "sha" });
				if (targets[0].canUse(sha, targets[1], false)) {
					targets[0].useCard(sha, targets[1], false);
				}
			}
		},
		subSkill: {
			forbid: {
				charlotte: true,
				onremove: true,
				mod: {
					cardEnabled2(card, player) {
						if (get.itemtype(card) == "card" && player.getStorage("jsrgyoujin_forbid").some(num => num > get.number(card))) {
							return false;
						}
					},
				},
				mark: true,
				intro: {
					content: "本回合不能使用或打出点数小于$的手牌",
				},
			},
		},
	},
	jsrgdailao: {
		enable: "phaseUse",
		filter(event, player) {
			return !player.hasCard(card => {
				return player.hasUseTarget(card, true, true);
			});
		},
		async content(event, trigger, player) {
			await player.showHandcards();
			await player.draw(2);
			const evt = event.getParent("phase", true);
			if (evt) {
				game.log(player, "结束了回合");
				evt.num = evt.phaseList.length;
				evt.goto(11);
			}
			const evtx = event.getParent("phaseUse", true);
			if (evtx) {
				evtx.skipped = true;
			}
		},
		ai: {
			order: 0.0001,
			result: { player: 1 },
		},
	},
	jsrgzhubei: {
		trigger: { source: "damageBegin1" },
		forced: true,
		init(player) {
			player.addSkill("jsrgzhubei_record");
		},
		filter(event, player) {
			return event.player.hasHistory("damage", evt => {
				return evt.source == player;
			});
		},
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.num++;
		},
		subSkill: {
			record: {
				trigger: {
					global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				charlotte: true,
				silent: true,
				filter(event, player) {
					return game.hasPlayer(current => {
						if (current.countCards("h")) {
							return false;
						}
						const evt = event.getl(current);
						return evt && evt.hs && evt.hs.length;
					});
				},
				async content(event, trigger, player) {
					game.countPlayer(current => {
						if (current.countCards("h")) {
							return false;
						}
						const evt = trigger.getl(current);
						if (evt && evt.hs && evt.hs.length) {
							current.addTempSkill("jsrgzhubei_lost");
						}
					});
				},
			},
			lost: { charlotte: true },
		},
		mod: {
			cardUsableTarget(card, player, target) {
				if (target.hasSkill("jsrgzhubei_lost")) {
					return true;
				}
			},
		},
	},
	//赵云
	jsrglonglin: {
		audio: 2,
		trigger: {
			global: "useCardToPlayered",
		},
		usable: 1,
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			if (event.card.name != "sha") {
				return false;
			}
			return event.isFirstTarget && event.player.isPhaseUsing();
		},
		direct: true,
		async content(event, trigger, player) {
			const juedou = new lib.element.VCard({ name: "juedou", storage: { jsrglonglin: true } });
			const { result } = await player
				.chooseToDiscard(get.prompt2("jsrglonglin"), "he")
				.set("ai", card => {
					if (get.event("goon")) {
						return 5 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					(trigger.player.canUse(juedou, player) ? Math.max(0, get.effect(player, juedou, trigger.player, trigger.player)) : 0) +
						trigger.targets
							.map(target => {
								return get.effect(target, trigger.card, trigger.player, player);
							})
							.reduce((p, c) => {
								return p + c;
							}, 0) <
						-4
				)
				.set("logSkill", ["jsrglonglin", trigger.player]);
			if (result.bool) {
				trigger.excluded.addArray(trigger.targets);
				await game.delayx();
				if (trigger.player.canUse(juedou, player)) {
					const { result } = await trigger.player.chooseBool(`是否视为对${get.translation(player)}使用一张【决斗】？`).set("choice", get.effect(player, juedou, trigger.player, trigger.player) >= 0);
					if (result.bool) {
						player.addTempSkill("jsrglonglin_source");
						trigger.player.useCard(juedou, player);
					}
				}
			}
		},
		subSkill: {
			source: {
				trigger: { source: "damageSource" },
				charlotte: true,
				forced: true,
				popup: false,
				filter(event, player) {
					return event.card && event.card.storage && event.card.storage.jsrglonglin;
				},
				async content(event, trigger, player) {
					player.line(trigger.player);
					trigger.player.addTempSkill("jsrglonglin_forbid", "phaseUseAfter");
				},
			},
			forbid: {
				mod: {
					cardEnabled(card, player) {
						if (!card.cards) {
							return;
						}
						if (card.cards.some(cardx => get.position(cardx) == "h")) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (!card.cards) {
							return;
						}
						if (card.cards.some(cardx => get.position(cardx) == "h")) {
							return false;
						}
					},
				},
				charlotte: true,
				mark: true,
				intro: {
					content: "不能使用手牌",
				},
			},
		},
	},
	jsrgzhendan: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (event.type == "wuxie") {
				return false;
			}
			if (
				!_status.connectMode &&
				!player.countCards("hs", card => {
					return get.type2(card) != "basic";
				})
			) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (info[0] != "basic") {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
				});
				return ui.create.dialog("镇胆", [vcards, "vcard"]);
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
			},
			backup(links, player) {
				return {
					audio: "jsrgzhendan",
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3] },
					filterCard(card, player) {
						return get.type2(card) != "basic";
					},
					selectCard: 1,
					position: "hs",
				};
			},
			prompt(links, player) {
				return "将一张非基本手牌当" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用或打出";
			},
		},
		hiddenCard(player, name) {
			return get.type(name) == "basic" && player.countCards("hs") > 0;
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				return player.countCards("hs") > 0;
			},
			order: 0.5,
			result: {
				player(player) {
					if (get.event().dying) {
						return get.attitude(player, get.event().dying);
					}
					return 1;
				},
			},
		},
		group: "jsrgzhendan_damage",
		subSkill: {
			backup: {},
			damage: {
				audio: "jsrgzhendan",
				trigger: {
					player: "damageEnd",
					global: "roundEnd",
				},
				filter(event, player) {
					if (event.name === "damage" && !player.isTempBanned("olzhendan")) {
						return true;
					}
					const history = _status.globalHistory;
					if (event.name !== "damage" || !history[history.length - 1].isRound) {
						for (let i = history.length - (event.name === "damage" ? 2 : 1); i >= 0; i--) {
							if (
								game.hasPlayer2(current => {
									const actionHistory = current.actionHistory[i];
									return actionHistory.isMe && !actionHistory.isSkipped;
								})
							) {
								return true;
							}
							if (history[i].isRound) {
								break;
							}
						}
					}
					return false;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const history = _status.globalHistory;
					let num = 0;
					if (trigger.name !== "damage" || !history[history.length - 1].isRound) {
						for (let i = history.length - (trigger.name === "damage" ? 2 : 1); i >= 0; i--) {
							game.hasPlayer2(current => {
								const actionHistory = current.actionHistory[i];
								return actionHistory.isMe && !actionHistory.isSkipped;
							}) && num++;
							if (num === 5 || history[i].isRound) {
								break;
							}
						}
					}
					num > 0 && (await player.draw(num));
					trigger.name === "damage" && player.tempBanSkill("jsrgzhendan", "roundStart");
				},
			},
		},
	},
	//司马懿
	jsrgyingshi: {
		trigger: { player: "turnOverAfter" },
		async content(event, trigger, player) {
			const number = game.dead.length > 2 ? 5 : 3;
			const cards = get.bottomCards(number);
			game.cardsGotoOrdering(cards);
			const next = player.chooseToMove();
			next.set("list", [["牌堆顶"], ["牌堆底", cards.reverse()]]);
			next.set("prompt", "鹰眎：点击或拖动将牌移动到牌堆顶或牌堆底");
			next.processAI = list => {
				const cards = list[1][1],
					player = _status.event.player;
				const top = [];
				const judges = player.getCards("j");
				let stopped = false;
				if (!player.hasWuxie()) {
					for (let i = 0; i < judges.length; i++) {
						const judge = get.judge(judges[i]);
						cards.sort((a, b) => judge(b) - judge(a));
						if (judge(cards[0]) < 0) {
							stopped = true;
							break;
						} else {
							top.unshift(cards.shift());
						}
					}
				}
				let bottom;
				if (!stopped) {
					cards.sort((a, b) => get.value(b, player) - get.value(a, player));
					while (cards.length) {
						if (get.value(cards[0], player) <= 5) {
							break;
						}
						top.unshift(cards.shift());
					}
				}
				bottom = cards;
				return [top, bottom];
			};
			const {
				result: { moved },
			} = await next;
			const top = moved[0];
			const bottom = moved[1];
			top.reverse();
			game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event, card) => {
				if (event.top_cards.includes(card)) {
					return ui.cardPile.firstChild;
				}
				return null;
			});
			player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
			game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
			await game.delayx();
		},
		ai: {
			combo: "jsrgtuigu",
		},
	},
	jsrgtuigu: {
		trigger: { player: "phaseBegin" },
		prompt2(event, player) {
			const num = Math.floor(game.countPlayer() / 2);
			return `你翻面，令你本回合的手牌上限+${num}，摸${get.cnNumber(num)}张牌，视为使用一张【解甲归田】（目标角色不能使用这些牌直到其下回合结束）。`;
		},
		group: ["jsrgtuigu_insert", "jsrgtuigu_recover"],
		async content(event, trigger, player) {
			await player.turnOver();
			const num = Math.floor(game.countPlayer() / 2);
			player.addTempSkill("jsrgtuigu_handcard");
			player.addMark("jsrgtuigu_handcard", num, false);
			await player.draw(num);
			const jiejia = new lib.element.VCard({ name: "jiejia", storage: { jsrgtuigu: true } });
			if (player.hasUseTarget(jiejia)) {
				player.addTempSkill("jsrgtuigu_block");
				await player.chooseUseTarget(jiejia, true);
			}
		},
		subSkill: {
			insert: {
				audio: "jsrgtuigu",
				trigger: { global: "roundEnd" },
				filter(event, player) {
					const curLen = player.actionHistory.length;
					for (let i = curLen - 1; i >= 0; i--) {
						const history = player.actionHistory[i];
						if (history.isMe && !history.isSkipped) {
							return false;
						}
						if (history.isRound) {
							break;
						}
					}
					return true;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.insertPhase();
				},
			},
			recover: {
				audio: "jsrgtuigu",
				trigger: {
					player: "loseAfter",
					global: ["gainAfter", "equipAfter", "addJudgeAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (player.isHealthy()) {
						return false;
					}
					const evt = event.getl(player);
					return evt && evt.es && evt.es.length > 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.recover();
				},
			},
			handcard: {
				markimage: "image/card/handcard.png",
				intro: {
					content(storage, player) {
						return "手牌上限+" + storage;
					},
				},
				onremove: true,
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("jsrgtuigu_handcard");
					},
				},
			},
			block: {
				trigger: { global: "gainAfter" },
				filter(event, player) {
					if (event.getParent().name != "jiejia") {
						return false;
					}
					const card = event.getParent(2).card;
					if (card && card.storage && card.storage.jsrgtuigu) {
						return true;
					}
					return false;
				},
				charlotte: true,
				forced: true,
				silent: true,
				content() {
					trigger.player.addGaintag(trigger.cards, "jsrgtuigu");
					trigger.player.addTempSkill("jsrgtuigu_blocked", { player: "phaseAfter" });
				},
			},
			blocked: {
				mod: {
					cardEnabled2(card) {
						if (get.itemtype(card) == "card" && card.hasGaintag("jsrgtuigu")) {
							return false;
						}
					},
				},
				charlotte: true,
				forced: true,
				popup: false,
				onremove(player) {
					player.removeGaintag("jsrgtuigu");
				},
			},
		},
	},
	//郭循
	jsrgeqian: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget || event.targets.length != 1 || event.target == player) {
				return false;
			}
			if (event.card.name == "sha") {
				return true;
			}
			return event.getParent(3).name == "xumou_jsrg";
		},
		prompt2(event, player) {
			return `令${get.translation(event.card)}不计入次数限制，且你获得${get.translation(event.target)}一张牌，然后其可以令你本回合至其的距离+2`;
		},
		group: "jsrgeqian_prepare",
		logTarget: "target",
		async content(event, trigger, player) {
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				var stat = player.getStat().card,
					name = trigger.card.name;
				if (typeof stat[name] == "number") {
					stat[name]--;
				}
			}
			await player.gainPlayerCard(trigger.target, "he", true);
			const { result } = await trigger.target.chooseBool(`是否令${get.translation(player)}至你的距离于本回合内+2？`).set("ai", () => true);
			if (result?.bool) {
				player.addTempSkill("jsrgeqian_distance");
				if (!player.storage.jsrgeqian_distance) {
					player.storage.jsrgeqian_distance = {};
				}
				const id = trigger.target.playerid;
				if (typeof player.storage.jsrgeqian_distance[id] != "number") {
					player.storage.jsrgeqian_distance[id] = 0;
				}
				player.storage.jsrgeqian_distance[id] += 2;
				player.markSkill("jsrgeqian_distance");
			}
		},
		subSkill: {
			prepare: {
				audio: "jsrgeqian",
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return player.countCards("h") && !player.isDisabledJudge();
				},
				direct: true,
				async content(event, trigger, player) {
					while (player.countCards("h") && !player.isDisabledJudge()) {
						const { result } = await player.chooseCard(get.prompt("jsrgeqian"), "你可以蓄谋任意次").set("ai", card => {
							const player = get.player();
							if (player.hasValueTarget(card)) {
								return player.getUseValue(card);
							}
							return 0;
						});
						if (result?.bool && result?.cards?.length) {
							await player.addJudge({ name: "xumou_jsrg" }, result.cards);
						} else {
							break;
						}
					}
				},
			},
			distance: {
				onremove: true,
				charlotte: true,
				mod: {
					globalFrom(player, target, distance) {
						if (!player.storage.jsrgeqian_distance) {
							return;
						}
						const dis = player.storage.jsrgeqian_distance[target.playerid];
						if (typeof dis == "number") {
							return distance + dis;
						}
					},
				},
				intro: {
					content(storage, player) {
						if (!storage) {
							return;
						}
						const map = _status.connectMode ? lib.playerOL : game.playerMap;
						let str = `你本回合：`;
						for (const id in storage) {
							str += "<li>至" + get.translation(map[id]) + "的距离+" + storage[id];
						}
						return str;
					},
				},
			},
		},
	},
	jsrgfusha: {
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		filter(event, player) {
			return (
				game.countPlayer(current => {
					return player.inRange(current);
				}) == 1
			);
		},
		filterTarget(card, player, target) {
			return player.inRange(target);
		},
		selectTarget: -1,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			event.target.damage(Math.min(game.countPlayer2(), player.getAttackRange()));
		},
		ai: {
			order: 1,
			result: {
				target: -2,
			},
		},
	},
	//大小虎
	jsrgdaimou: {
		trigger: {
			global: "useCardToPlayer",
		},
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			const list = player.getStorage("jsrgdaimou_used");
			if (event.target != player) {
				return !list.includes("other") && !player.isDisabledJudge();
			}
			return (
				!list.includes("me") &&
				player.hasCard(card => {
					return (card.viewAs || card.name) == "xumou_jsrg" && lib.filter.cardDiscardable(card, player, "jsrgdaimou");
				}, "j")
			);
		},
		async cost(event, trigger, player) {
			if (trigger.target == player) {
				event.result = { bool: true };
			} else {
				event.result = await player
					.chooseBool(get.prompt(event.skill), "你可以用牌堆顶的牌蓄谋")
					.set("ai", () => true)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			player.addTempSkill("jsrgdaimou_used");
			player.markAuto("jsrgdaimou_used", trigger.target == player ? "me" : "other");
			if (trigger.target == player) {
				const {
					result: { bool, links },
				} = await player
					.chooseButton(
						[
							"殆谋：请弃置区域里的一张蓄谋牌",
							player.getCards("j", card => {
								return (card.viewAs || card.name) == "xumou_jsrg";
							}),
						],
						true
					)
					.set("filterButton", button => {
						return lib.filter.cardDiscardable(button.link, get.player(), "jsrgdaimou");
					})
					.set("ai", button => {
						const player = get.player();
						return 1 / Math.max(0.01, player.getUseValue(button.link));
					});
				if (bool) {
					await player.discard(links);
				}
			} else {
				await player.addJudge({ name: "xumou_jsrg" }, get.cards());
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	jsrgfangjie: {
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		async content(event, trigger, player) {
			if (
				!player.hasCard(card => {
					return (card.viewAs || card.name) == "xumou_jsrg";
				}, "j")
			) {
				player.logSkill("jsrgfangjie");
				await player.recover();
				await player.draw();
			} else {
				const {
					result: { bool, links },
				} = await player
					.chooseButton(
						[
							"是否弃置区域里的任意张蓄谋牌并失去〖芳洁〗？",
							player.getCards("j", card => {
								return (card.viewAs || card.name) == "xumou_jsrg";
							}),
						],
						[1, Infinity]
					)
					.set("filterButton", button => {
						return lib.filter.cardDiscardable(button.link, get.player(), "jsrgdaimou");
					})
					.set("ai", () => 0);
				if (bool) {
					player.logSkill("jsrgfangjie");
					await player.discard(links);
					player.removeSkills("jsrgfangjie");
				}
			}
		},
	},
	//曹芳
	jsrgzhaotu: {
		enable: "chooseToUse",
		viewAs: { name: "lebu" },
		position: "hes",
		round: 1,
		viewAsFilter(player) {
			return player.countCards("hes");
		},
		filterCard(card, player) {
			return get.color(card) == "red" && get.type2(card) != "trick";
		},
		onuse(result, player) {
			player.tempBanSkill("jsrgzhaotu", null, false);
			const next = result.targets[0].insertPhase();
			next.skill = "jsrgzhaotu";
			result.targets[0]
				.when({
					player: "phaseBegin",
				})
				.filter(evt => evt.skill == "jsrgzhaotu")
				.step(async (event, trigger, player) => {
					player.addTempSkill("jsrgzhaotu_handcard");
					player.addMark("jsrgzhaotu_handcard", 2, false);
				});
		},
		subSkill: {
			handcard: {
				intro: {
					content(storage, player) {
						return "手牌上限-" + storage;
					},
				},
				charlotte: true,
				onremove: true,
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("jsrgzhaotu_handcard");
					},
				},
			},
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					let dis = 0.5 - 0.75 * target.needsToDiscard(2, null, true);
					if (dis > 0) {
						return dis;
					}
					if (player.hasSkill("jsrgjingju") && player.hasZhuSkill("jsrgweizhui") && get.attitude(player, target) > 0) {
						return game.countPlayer(current => {
							if (current === player || current === target || current.group !== "wei") {
								return false;
							}
							return player.hasZhuSkill("jsrgweizhui", current) && get.attitude(player, current) > 0;
						});
					}
					return dis;
				},
			},
		},
	},
	jsrgjingju: {
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type == "wuxie" || event.jsrgjingju) {
				return false;
			}
			if (
				!player.canMoveCard(
					null,
					false,
					game.filterPlayer(i => i != player),
					player,
					card => {
						if (card.cards) {
							return get.position(card.cards[0]) == "j";
						}
						return get.position(card) == "j";
					}
				)
			) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (info[0] != "basic") {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
				});
				return ui.create.dialog("惊惧", [vcards, "vcard"], "hidden");
			},
			check(button) {
				let player = _status.event.player;
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return (
					get.player().getUseValue({ name: button.link[2], nature: button.link[3] }) +
					game.countPlayer(current => {
						if (current === player || current.group !== "wei") {
							return false;
						}
						return player.hasZhuSkill("jsrgweizhui", current) && get.attitude(player, current) > 0;
					})
				);
			},
			backup(links, player) {
				return {
					filterCard: () => false,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
					},
					log: false,
					selectCard: -1,
					precontent() {
						"step 0";
						player
							.moveCard(
								`惊惧：将其他角色判定区里的牌移动至你的判定区`,
								game.filterPlayer(i => i != player),
								player,
								card => {
									if (card.cards) {
										return get.position(card.cards[0]) == "j";
									}
									return get.position(card) == "j";
								}
							)
							.set("logSkill", "jsrgjingju");
						"step 1";
						if (!result.bool) {
							event.getParent().jsrgjingju = true;
							event.getParent().goto(0);
							delete event.getParent().openskilldialog;
							event.finish();
						}
						"step 2";
						game.delayx();
					},
				};
			},
			prompt(links, player) {
				return "选择" + get.translation(links[0][3] || "") + "【" + get.translation(links[0][2]) + "】的目标";
			},
		},
		ai: {
			order() {
				const player = get.player(),
					event = _status.event;
				if (
					player.canMoveCard(null, false, game.filterPlayer(), player, card => {
						return get.position(card) == "j";
					})
				) {
					if (event.type == "dying") {
						if (event.filterCard({ name: "tao" }, player, event)) {
							return 0.5;
						}
					} else {
						if (event.filterCard({ name: "tao" }, player, event) || event.filterCard({ name: "shan" }, player, event)) {
							return 4;
						}
						if (event.filterCard({ name: "sha" }, player, event)) {
							return 2.9;
						}
					}
				}
				return 0;
			},
			save: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				return player.canMoveCard(null, false, game.filterPlayer(), player, card => {
					return get.position(card) == "j";
				});
			},
			result: {
				player(player) {
					if (get.event().type == "dying") {
						return get.attitude(player, get.event().dying);
					}
					return 1;
				},
			},
		},
	},
	jsrgweizhui: {
		trigger: { global: "phaseJieshuBegin" },
		zhuSkill: true,
		direct: true,
		filter(event, player) {
			return player != event.player && event.player.group == "wei" && event.player.isIn() && player.hasZhuSkill("jsrgweizhui", event.player);
		},
		async content(event, trigger, player) {
			const {
				result: { bool, cards },
			} = await trigger.player
				.chooseCard(`是否响应${get.translation(player)}的主公技【危坠】？`, "将一张黑色手牌当【过河拆桥】对其使用", (card, player) => {
					if (get.color(card) != "black") {
						return false;
					}
					return player.canUse(get.autoViewAs({ name: "guohe" }, [card]), get.event("target"));
				})
				.set("target", player)
				.set("ai", card => {
					if (get.effect(get.event("target"), get.autoViewAs({ name: "guohe" }, [card]), player) <= 0) {
						return 0;
					}
					return 7 - get.value(card);
				});
			if (bool) {
				trigger.player.logSkill("jsrgweizhui", player);
				trigger.player.useCard(get.autoViewAs({ name: "guohe" }, cards), cards, player);
			}
		},
	},
	//孙峻
	jsrgyaoyan: {
		trigger: { player: "phaseZhunbeiBegin" },
		prompt: "是否发动【邀宴】？",
		logTarget: () => game.filterPlayer(),
		async content(event, trigger, player) {
			const targets = game.filterPlayer();
			const toDebateList = [];
			while (targets.length) {
				const current = targets.shift();
				const {
					result: { bool },
				} = await current.chooseBool(`是否响应${get.translation(player)}的【邀宴】，于回合结束参与议事？`).set("ai", () => Math.random() < 0.5);
				if (bool) {
					toDebateList.add(current);
					current.popup("同意", "wood");
					game.log(current, "#g同意", "参加", player, "的议事");
				} else {
					current.popup("拒绝", "fire");
					game.log(current, "#r拒绝", "参加", player, "的议事");
				}
			}
			if (toDebateList.length) {
				player.addTempSkill("jsrgyaoyan_hold");
				player.markAuto("jsrgyaoyan_hold", toDebateList);
			}
		},
		subSkill: {
			hold: {
				trigger: { player: "phaseEnd" },
				charlotte: true,
				forced: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					return player.getStorage("jsrgyaoyan_hold").some(i => i.isIn());
				},
				async content(event, trigger, player) {
					player.chooseToDebate(player.getStorage("jsrgyaoyan_hold").filter(i => i.isIn())).set("callback", async event => {
						const { bool, opinion, targets } = event.debateResult;
						if (bool && opinion && ["red", "black"].includes(opinion)) {
							if (opinion == "red") {
								const notDebated = game.filterPlayer().removeArray(targets);
								if (notDebated.length) {
									const { result } = await player
										.chooseTarget("获得任意名未议事的角色的各一张手牌", [1, Infinity], true, (card, player, target) => {
											return get.event("targets").includes(target) && target.countGainableCards(player, "h");
										})
										.set("targets", notDebated)
										.set("ai", target => {
											const player = get.player();
											const att = get.attitude(player, target);
											return -att;
										});
									if (result.bool) {
										const targets = result.targets;
										targets.sortBySeat();
										player.line(targets, "green");
										for (const current of targets) {
											await player.gainPlayerCard(current, "h", true);
										}
									}
								}
							} else {
								const {
									result: { bool, targets: targets2 },
								} = await player
									.chooseTarget("是否对一名议事的角色造成2点伤害？", (card, player, target) => {
										return get.event("targets").includes(target);
									})
									.set("targets", targets)
									.set("ai", target => {
										const player = get.player();
										const eff = get.damageEffect(target, player, player);
										return eff;
									});
								if (bool) {
									player.line(targets2[0]);
									targets2[0].damage(2);
								}
							}
						}
					});
				},
			},
		},
	},
	jsrgbazheng: {
		trigger: { global: "debateShowOpinion" },
		filter(event, player) {
			if (!event.targets.includes(player)) {
				return false;
			}
			const damagedPlayers = player
				.getHistory("sourceDamage")
				.map(evt => evt.player)
				.toUniqued();
			let dissent;
			const colors = ["red", "black"];
			for (const color of colors) {
				if (event[color].some(i => i[0] == player)) {
					dissent = colors.find(i => i != color);
					break;
				}
			}
			return event[dissent].some(i => damagedPlayers.includes(i[0]));
		},
		forced: true,
		locked: false,
		direct: true,
		async content(event, trigger, player) {
			let myOpinion, dissent;
			const colors = ["red", "black"];
			for (const color of colors) {
				if (trigger[color].some(i => i[0] == player)) {
					myOpinion = color;
					dissent = colors.find(i => i != color);
					break;
				}
			}
			const damagedPlayers = player
				.getHistory("sourceDamage")
				.map(evt => evt.player)
				.toUniqued();
			let dissident = [];
			for (let i = 0; i < trigger[dissent].length; i++) {
				const pair = trigger[dissent][i];
				if (damagedPlayers.includes(pair[0])) {
					dissident.push(pair[0]);
					trigger[myOpinion].push(pair);
					trigger[dissent].splice(i--, 1);
				}
			}
			player.logSkill("jsrgbazheng", dissident);
		},
		ai: {
			combo: "jsrgyaoyan",
		},
	},
	//刘永
	jsrgdanxin: {
		enable: "chooseToUse",
		viewAs: {
			name: "tuixinzhifu",
			storage: { jsrgdanxin: true },
		},
		filterCard: true,
		check(card) {
			var val = get.value(card);
			if (get.suit(card) == "heart") {
				return 1 / Math.max(0.1, val);
			}
			return 6 - val;
		},
		position: "hes",
		precontent() {
			player.addTempSkill("jsrgdanxin_effect");
		},
		ai: {
			order(item, player) {
				if (game.hasPlayer(current => player != current && player.canUse({ name: "tuixinzhifu" }, current) && get.effect(current, "jsrgdanxin", player, player) > 0)) {
					return 10;
				}
				return 5;
			},
			result: {
				target(player, target) {
					if (player.isDamaged() || (get.attitude(player, target) > 0 && target.isDamaged())) {
						const bool =
							(player.hasSkillTag("viewHandcard", null, target, true) && target.hasCard({ suit: "heart" }, "h")) ||
							target.hasCard(card => {
								if (["e", "j"].includes(get.position(card))) {
									return get.suit(card) == "heart";
								}
								return get.suit(card) == "heart" && card.isKnownBy(player);
							}, "hej");
						return 1 + get.recoverEffect(player, player, player) + get.recoverEffect(target, player, player) + bool ? 2 : 0;
					}
					return lib.card.tuixinzhifu.ai.result.target(player, target);
				},
			},
		},
		subSkill: {
			effect: {
				trigger: {
					player: ["gainPlayerCardBefore", "chooseToGiveBefore"],
					global: "gainAfter",
				},
				filter(event, player, name) {
					const level = name != "gainAfter" ? 1 : 2;
					return event.getParent(level).card?.storage?.jsrgdanxin;
				},
				forced: true,
				popup: false,
				charlotte: true,
				async content(event, trigger, player) {
					if (event.triggername == "gainAfter") {
						const { targets } = trigger.getParent(2);
						await player.showCards(trigger.cards);
						if (trigger.cards.some(card => get.suit(card) == "heart")) {
							const owners = trigger.cards
								.filter(card => get.suit(card) == "heart")
								.map(card => get.owner(card))
								.toUniqued();
							for (const owner of owners) {
								if (owner && owner.isIn()) {
									await owner.recover();
								}
							}
						}
						if (trigger.player == player) {
							return;
						}
						player.addTempSkill("jsrgdanxin_distance");
						if (!player.storage.jsrgdanxin_distance) {
							player.storage.jsrgdanxin_distance = {};
						}
						const id = targets[0].playerid;
						if (typeof player.storage.jsrgdanxin_distance[id] != "number") {
							player.storage.jsrgdanxin_distance[id] = 0;
						}
						player.storage.jsrgdanxin_distance[id]++;
						player.markSkill("jsrgdanxin_distance");
					} else if (event.triggername == "gainPlayerCardBefore") {
						trigger.ai = button => {
							const { player, target } = get.event();
							const { link: card } = button;
							if (get.recoverEffect(player, player, player) > 0 && get.suit(card) == "heart") {
								return 10;
							}
							if (get.attitude(player, target) > 0) {
								if (get.position(card) == "j") {
									const cardj = card.viewAs ? { name: card.viewAs } : card;
									return get.effect(target, cardj, target, player) < 0 ? 11 : 0;
								} else if (get.position(card) == "e") {
									return get.value(card, target) <= 0 ? 5 : 0;
								} else {
									return 6 - get.value(card);
								}
							}
							return get.value(card);
						};
					} else {
						trigger.ai = card => {
							const { player, target } = get.event();
							if (get.recoverEffect(target, player, player) > 0 && get.suit(card) == "heart") {
								return 10;
							}
							if (get.attitude(player, target) > 0) {
								return get.value(card);
							}
							return 6 - get.value(card);
						};
					}
				},
			},
			distance: {
				onremove: true,
				charlotte: true,
				mod: {
					globalFrom(player, target, distance) {
						if (!player.storage.jsrgdanxin_distance) {
							return;
						}
						const dis = player.storage.jsrgdanxin_distance[target.playerid];
						if (typeof dis == "number") {
							return distance + dis;
						}
					},
				},
				intro: {
					content(storage, player) {
						if (!storage) {
							return;
						}
						const map = _status.connectMode ? lib.playerOL : game.playerMap;
						let str = `你本回合：`;
						for (const id in storage) {
							str += "<li>至" + get.translation(map[id]) + "的距离+" + storage[id];
						}
						return str;
					},
				},
			},
		},
	},
	jsrgfengxiang: {
		audio: "fengxiang",
		trigger: { player: "damageEnd" },
		forced: true,
		direct: true,
		filter(event, player) {
			return game.hasPlayer(current => {
				return current.countCards("e");
			});
		},
		async content(event, trigger, player) {
			const {
				result: { bool, targets },
			} = await player
				.chooseTarget(
					"封乡：与一名其他角色交换装备区里的所有牌",
					(card, player, target) => {
						return target.countCards("e") + player.countCards("e") > 0 && player != target;
					},
					true
				)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					let delta = get.value(target.getCards("e"), player) - get.value(player.getCards("e"), player);
					if (att > 0) {
						if (delta < 0) {
							delta += att / 3;
						}
					} else {
						if (delta < 0) {
							delta -= att / 3;
						}
					}
					return delta;
				});
			if (bool) {
				player.logSkill("jsrgfengxiang", targets[0]);
				const num = player.countCards("e");
				await player.swapEquip(targets[0]);
				const delta = num - player.countCards("e");
				if (delta > 0) {
					player.draw(delta);
				}
			}
		},
	},
	jsrgfuhai: {
		audio: "xinfu_fuhai",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => {
				return current.countCards("h") && current != player;
			});
		},
		filterTarget(card, player, target) {
			return target.countCards("h") && target != player;
		},
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			const next = player
				.chooseCardOL(targets, "请展示一张手牌", true)
				.set("ai", card => {
					return -get.value(card);
				})
				.set("aiCard", target => {
					const hs = target.getCards("h");
					return { bool: true, cards: [hs.randomGet()] };
				});
			next._args.remove("glow_result");
			const { result } = await next;
			const cards = [];
			const videoId = lib.status.videoId++;
			for (let i = 0; i < targets.length; i++) {
				cards.push(result[i].cards[0]);
				game.log(targets[i], "展示了", result[i].cards[0]);
			}
			game.broadcastAll(
				(targets, cards, id, player) => {
					var dialog = ui.create.dialog(get.translation(player) + "发动了【浮海】", cards);
					dialog.videoId = id;
					const getName = target => {
						if (target._tempTranslate) {
							return target._tempTranslate;
						}
						var name = target.name;
						if (lib.translate[name + "_ab"]) {
							return lib.translate[name + "_ab"];
						}
						return get.translation(name);
					};
					for (let i = 0; i < targets.length; i++) {
						dialog.buttons[i].querySelector(".info").innerHTML = getName(targets[i]) + "|" + get.strNumber(cards[i].number);
					}
				},
				targets,
				cards,
				videoId,
				player
			);
			await game.delay(4);
			game.broadcastAll("closeDialog", videoId);
			let clock = -1,
				anticlock = -1;
			for (let j = 0; j < 2; j++) {
				let increase = -Infinity,
					decrease = Infinity,
					count = 0;
				for (let i = 0; i < targets.length; i++) {
					const number = get.number(cards[i], false);
					let flag = false;
					if (number > increase) {
						increase = number;
						flag = true;
					} else {
						increase = Infinity;
					}
					if (number < decrease) {
						decrease = number;
						flag = true;
					} else {
						decrease = -Infinity;
					}
					if (flag) {
						count++;
					} else {
						break;
					}
				}
				targets.reverse();
				cards.reverse();
				if (j == 0) {
					anticlock = Math.max(1, count);
				} else {
					clock = Math.max(1, count);
				}
			}
			const {
				result: { index },
			} = await player
				.chooseControl(`↖顺时针(${clock})`, `逆时针(${anticlock})↗`)
				.set("prompt", "请选择一个方向，摸对应数量的牌")
				.set("ai", () => get.event("choice"))
				.set("choice", clock > anticlock ? 0 : 1);
			player.draw(index == 0 ? clock : anticlock);
		},
		ai: {
			order: 8,
			result: { player: 1 },
		},
	},
	//张嫙
	jsrgtongli: {
		audio: "tongli",
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget) {
				return false;
			}
			const type = get.type(event.card);
			if (type != "basic" && type != "trick") {
				return false;
			}
			const hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			const evt = event.getParent("phaseUse");
			if (!evt || evt.player != player) {
				return false;
			}
			const num1 = player.getHistory("useCard", evtx => {
				return evtx.getParent("phaseUse") == evt;
			}).length;
			if (hs.length < num1) {
				return false;
			}
			const list = [];
			for (const i of hs) {
				list.add(get.suit(i, player));
			}
			return list.length == num1;
		},
		prompt2(event, player) {
			let str = "展示所有手牌，额外结算一次";
			if (event.card.name == "sha" && game.hasNature(event.card)) {
				str += get.translation(event.card.nature);
			}
			return str + "【" + get.translation(event.card.name) + "】";
		},
		check(event, player) {
			return !get.tag(event.card, "norepeat");
		},
		async content(event, trigger, player) {
			await player.showHandcards();
			trigger.getParent().effectCount++;
		},
	},
	jsrgshezang: {
		audio: "shezang",
		round: 1,
		trigger: { global: "dying" },
		frequent: true,
		filter(event, player) {
			return event.player == player || player == _status.currentPhase;
		},
		async content(event, trigger, player) {
			const cards = get.cards(4);
			game.cardsGotoOrdering(cards);
			const videoId = lib.status.videoId++;
			game.broadcastAll(
				(player, id, cards) => {
					let str = "奢葬";
					if (player == game.me && !_status.auto) {
						str += "：获得任意张花色各不相同的牌";
					}
					const dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				videoId,
				cards
			);
			const time = get.utc();
			game.addVideo("showCards", player, ["奢葬", get.cardsInfo(event.cards)]);
			game.addVideo("delay", null, 2);
			const list = [];
			for (const i of cards) {
				list.add(get.suit(i, false));
			}
			const next = player.chooseButton([1, list.length]);
			next.set("dialog", event.videoId);
			next.set("filterButton", function (button) {
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					if (get.suit(ui.selected.buttons[i].link) == get.suit(button.link)) {
						return false;
					}
				}
				return true;
			});
			next.set("ai", function (button) {
				return get.value(button.link, _status.event.player);
			});
			const { result } = await next;
			if (result.bool && result.links) {
				const time2 = 1000 - (get.utc() - time);
				if (time2 > 0) {
					await game.delay(0, time2);
				}
				game.broadcastAll("closeDialog", videoId);
				player.gain(result.links, "gain2");
			}
		},
	},
	jsrgchiying: {
		audio: "dcchiying",
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		async content(event, trigger, player) {
			const target = event.target;
			const targets = game.filterPlayer(current => target.inRange(current) && current != player).sortBySeat(player);
			if (!targets.length) {
				return;
			}
			while (targets.length) {
				const current = targets.shift();
				if (current.countCards("he")) {
					await current.chooseToDiscard("驰应：请弃置一张牌", "he", true);
				}
			}
			let cards = [];
			game.getGlobalHistory("cardMove", evt => {
				if (evt.getParent(3) == event) {
					cards.addArray(evt.cards.filter(card => get.type(card) == "basic"));
				}
			});
			if (cards.length <= target.getHp()) {
				cards = cards.filterInD("d");
				if (cards.length) {
					target.gain(cards, "gain2");
				}
			}
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					const targets = game.filterPlayer(current => target.inRange(current) && current != player);
					let eff = 0;
					for (const targetx of targets) {
						let effx = get.effect(targetx, { name: "guohe_copy2" }, targetx, player);
						eff += effx;
					}
					return eff;
				},
				target(player, target) {
					return (
						(game.countPlayer(current => {
							return current !== player && target.inRange(current) && current.countCards("h");
						}) /
							2) *
						get.effect(target, { name: "draw" }, target, target)
					);
				},
			},
		},
	},
	//郭照
	jsrgpianchong: {
		audio: "pianchong",
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return player.getHistory("lose").length;
		},
		frequent: true,
		async content(event, trigger, player) {
			const { result } = await player.judge();
			let num = 0;
			game.getGlobalHistory("cardMove", evt => {
				if (evt.name != "cardsDiscard") {
					if (evt.name != "lose" || evt.position != ui.discardPile) {
						return false;
					}
				}
				num += evt.cards.filter(i => get.color(i, false) == result.color).length;
			});
			if (num > 0) {
				player.draw(num);
			}
		},
	},
	jsrgzunwei: {
		audio: "zunwei",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			const storage = player.getStorage("jsrgzunwei");
			return (
				storage.length < 3 &&
				game.hasPlayer(current => {
					return (player.isDamaged() && current.getHp() > player.getHp() && !storage.includes(2)) || (current.countCards("h") > player.countCards("h") && !storage.includes(0)) || (current.countCards("e") > player.countCards("e") && !storage.includes(1));
				})
			);
		},
		chooseButton: {
			dialog(event, player) {
				const list = ["选择手牌数大于你的一名角色", "选择装备数大于你的一名角色", "选择体力值大于你的一名角色"];
				const choiceList = ui.create.dialog("尊位：请选择一项", "forcebutton", "hidden");
				choiceList.add([
					list.map((item, i) => {
						if (player.getStorage("jsrgzunwei").includes(i)) {
							item = `<span style="text-decoration: line-through;">${item}</span>`;
						}
						return [i, item];
					}),
					"textbutton",
				]);
				return choiceList;
			},
			filter(button) {
				const player = get.player();
				if (player.getStorage("jsrgzunwei").includes(button.link)) {
					return false;
				}
				if (button.link == 2) {
					if (!player.isDamaged()) {
						return false;
					}
					return game.hasPlayer(current => {
						return current.getHp() > player.getHp();
					});
				}
				if (button.link == 0) {
					return game.hasPlayer(current => {
						return current.countCards("h") > player.countCards("h");
					});
				}
				if (button.link == 1) {
					return game.hasPlayer(current => {
						return current.countCards("e") > player.countCards("e");
					});
				}
			},
			backup(links) {
				const next = get.copy(lib.skill.jsrgzunwei.backups[links[0]]);
				next.audio = "zunwei";
				next.filterCard = function () {
					return false;
				};
				next.selectCard = -1;
				return next;
			},
			check(button) {
				const player = get.player();
				switch (button.link) {
					case 2: {
						const target = game.findPlayer(function (current) {
							return current.isMaxHp();
						});
						return (Math.min(target.hp, player.maxHp) - player.hp) * 2;
					}
					case 0: {
						const target = game.findPlayer(function (current) {
							return current.isMaxHandcard();
						});
						return Math.min(5, target.countCards("h") - player.countCards("h")) * 0.8;
					}
					case 1: {
						const target = game.findPlayer(function (current) {
							return current.isMaxEquip();
						});
						return (target.countCards("e") - player.countCards("e")) * 1.4;
					}
				}
			},
			prompt(links) {
				return ["选择一名手牌数大于你的其他角色，将手牌数摸至与其相同（至多摸五张）", "选择一名装备区内牌数大于你的其他角色，将其装备区里的牌移至你的装备区，直到你装备数不小于其", "选择一名体力值大于你的其他角色，将体力值回复至与其相同"][links[0]];
			},
		},
		backups: [
			{
				filterTarget(card, player, target) {
					return target.countCards("h") > player.countCards("h");
				},
				async content(event, trigger, player) {
					player.draw(Math.min(5, event.target.countCards("h") - player.countCards("h")));
					if (!player.storage.jsrgzunwei) {
						player.storage.jsrgzunwei = [];
					}
					player.storage.jsrgzunwei.add(0);
				},
				ai: {
					order: 10,
					result: {
						player(player, target) {
							return Math.min(5, target.countCards("h") - player.countCards("h"));
						},
					},
				},
			},
			{
				filterTarget(card, player, target) {
					return target.countCards("e") > player.countCards("e");
				},
				async content(event, trigger, player) {
					if (!player.storage.jsrgzunwei) {
						player.storage.jsrgzunwei = [];
					}
					player.storage.jsrgzunwei.add(1);
					const target = event.target;
					do {
						if (
							!target.countCards("e", card => {
								return player.canEquip(card);
							})
						) {
							break;
						}
						const {
							result: { bool, links },
						} = await player
							.chooseButton([`尊位：将${get.translation(target)}的一张装备牌移至你的区域内`, target.getCards("e")], true)
							.set("filterButton", button => {
								return get.player().canEquip(button.link);
							})
							.set("ai", get.buttonValue);
						if (bool) {
							target.$give(links[0], player, false);
							await player.equip(links[0]);
						}
					} while (player.countCards("e") < target.countCards("e"));
				},
				ai: {
					order: 10,
					result: {
						player(player, target) {
							return target.countCards("e") - player.countCards("e");
						},
					},
				},
			},
			{
				filterTarget(card, player, target) {
					if (player.isHealthy()) {
						return false;
					}
					return target.hp > player.hp;
				},
				async content(event, trigger, player) {
					player.recover(event.target.hp - player.hp);
					if (!player.storage.jsrgzunwei) {
						player.storage.jsrgzunwei = [];
					}
					player.storage.jsrgzunwei.add(2);
				},
				ai: {
					order: 10,
					result: {
						player(player, target) {
							return Math.min(target.hp, player.maxHp) - player.hp;
						},
					},
				},
			},
		],
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
		subSkill: {
			backup: {},
		},
	},
	//江山如故·转
	//404郭嘉
	jsrgqingzi: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				return current.hasCard(card => {
					return lib.filter.canBeDiscarded(card, player, current);
				}, "e");
			});
		},
		derivation: "xinshensu",
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("jsrgqingzi"), "弃置任意名其他角色装备区里的一张牌，然后令这些角色获得〖神速〗直到你的下回合开始", [1, Infinity], (card, player, target) => {
					return (
						target != player &&
						target.hasCard(card => {
							return lib.filter.canBeDiscarded(card, player, target);
						}, "e")
					);
				})
				.set("ai", target => {
					var player = _status.event.player;
					return target.hasCard(card => {
						return (lib.filter.canBeDiscarded(card, player, target) && get.value(card, target) > 3) || (target.hp == 1 && get.value(card, target) > 0);
					});
				});
			"step 1";
			if (result.bool) {
				var targets = result.targets.slice();
				targets.sortBySeat();
				event.targets = targets;
				event.num = 0;
				player.logSkill("jsrgqingzi", targets);
				player.addSkill("jsrgqingzi_clear");
			} else {
				event.finish();
			}
			"step 2";
			var target = targets[num];
			if (
				target.hasCard(card => {
					return lib.filter.canBeDiscarded(card, player, target);
				}, "e")
			) {
				player.discardPlayerCard(target, "e", true);
				target.addAdditionalSkills("jsrgqingzi_" + player.playerid, "xinshensu");
				player.markAuto("jsrgqingzi_clear", [target]);
			}
			event.num++;
			if (event.num < targets.length) {
				event.redo();
			}
		},
		subSkill: {
			clear: {
				audio: "jsrgqingzi",
				charlotte: true,
				trigger: {
					global: "die",
					player: "phaseBegin",
				},
				forced: true,
				popup: false,
				forceDie: true,
				onremove: true,
				filter(event, player) {
					if (event.name == "die") {
						return player == event.player || player.getStorage("jsrgqingzi_clear").includes(event.player);
					}
					return player.getStorage("jsrgqingzi_clear").length > 0;
				},
				content() {
					"step 0";
					var targets = player.getStorage("jsrgqingzi_clear");
					if (trigger.name == "die" && player == trigger.player) {
						for (var target of targets) {
							target.removeAdditionalSkill(`jsrgqingzi_${player.playerid}`);
						}
						player.removeSkill("jsrgqingzi_clear");
						event.finish();
						return;
					}
					if (trigger.name == "phase") {
						event.targets = targets.slice(0).sortBySeat();
					} else {
						event.targets = [trigger.player];
					}
					"step 1";
					var target = targets.shift();
					var storage = player.getStorage("jsrgqingzi_clear");
					if (storage.includes(target)) {
						storage.remove(target);
						target.removeAdditionalSkill(`jsrgqingzi_${player.playerid}`);
					}
					if (targets.length > 0) {
						event.redo();
					} else if (!storage.length) {
						player.removeSkill("jsrgqingzi_clear");
					}
				},
			},
		},
	},
	jsrgdingce: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (!event.source || !event.source.isIn()) {
				return false;
			}
			return player.hasCard(card => {
				return lib.filter.cardDiscardable(card, player, "jsrgdingce");
			});
		},
		direct: true,
		content() {
			"step 0";
			var target = trigger.source;
			event.target = target;
			player
				.chooseToDiscard(get.prompt("jsrgdingce", target), "弃置你与其的各一张手牌。若这两张牌颜色相同，你视为使用一张【洞烛先机】。")
				.set("ai", card => {
					if (_status.event.goon) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					get.attitude(player, target) < 0 ||
						player
							.getCards("h")
							.concat(target.getCards("h"))
							.filter(card => {
								return get.value(card) < 5.5;
							}).length >= 2
				)
				.set("logSkill", ["jsrgdingce", target]);
			"step 1";
			if (result.bool) {
				event.card = result.cards[0];
				if (target.countDiscardableCards(player, "h")) {
					var next = player.discardPlayerCard(target, "h", true);
					if (target == player) {
						next.set("ai", button => {
							var card = button.link;
							return (get.color(card, false) == _status.event.color ? 7.5 : 5) - get.value(card);
						}).set("color", get.color(event.card, false));
					}
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var card = result.cards[0];
				if (get.color(event.card, false) == get.color(card, false)) {
					game.delayex();
					player.chooseUseTarget("dongzhuxianji", true);
				}
			}
		},
	},
	jsrgzhenfeng: {
		enable: "phaseUse",
		locked: false,
		filter(event, player) {
			if (!event.jsrgzhenfeng) {
				return false;
			}
			return event.jsrgzhenfeng.some(info =>
				event.filterCard(
					{
						name: info[2],
						nature: info[3],
						storage: { jsrgzhenfeng: true },
						isCard: true,
					},
					player,
					event
				)
			);
		},
		onChooseToUse(event) {
			if (!event.jsrgzhenfeng && !game.online) {
				var str = "";
				game.countPlayer(current => {
					current.getSkills(null, false, false).forEach(skill => {
						var info = get.info(skill);
						if (!info || info.charlotte) {
							return;
						}
						var translation = get.skillInfoTranslation(skill, current);
						str += translation;
					});
				});
				event.set("jsrgzhenfeng", lib.skill.jsrgzhenfeng.getInclusion(str, null, event.player));
			}
		},
		getInclusion(str, checkCard, player) {
			let list = [];
			const names = Object.keys(lib.card);
			for (const name of names) {
				let type = get.type(name);
				if (!["basic", "trick"].includes(type)) {
					continue;
				}
				if (player && player.getStorage("jsrgzhenfeng_used").includes(type)) {
					continue;
				}
				const reg = `【${get.translation(name)}】`;
				if (name == "sha") {
					if (str.includes(reg)) {
						if (checkCard && checkCard.name == name) {
							return true;
						}
						list.push([type, "", name]);
					}
					for (let nature of lib.inpile_nature) {
						const reg1 = `【${get.translation(nature) + get.translation(name)}】`,
							reg2 = `${get.translation(nature)}【${get.translation(name)}】`;
						if (str.includes(reg1) || str.includes(reg2)) {
							if (checkCard && checkCard.name == name && checkCard.nature == nature) {
								return true;
							}
							list.push([type, "", name, nature]);
						}
					}
				} else {
					if (!str.includes(reg)) {
						continue;
					}
					if (checkCard && checkCard.name == name) {
						return true;
					}
					list.push([type, "", name]);
				}
			}
			if (checkCard) {
				return false;
			}
			return list;
		},
		chooseButton: {
			dialog(event, player) {
				var list = event.jsrgzhenfeng.filter(info => {
					return event.filterCard(
						{
							name: info[2],
							nature: info[3],
							storage: { jsrgzhenfeng: true },
							isCard: true,
						},
						player,
						event
					);
				});
				return ui.create.dialog("针锋", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard(
					{
						name: button.link[2],
						nature: button.link[3],
						storage: { jsrgzhenfeng: true },
						isCard: true,
					},
					player,
					_status.event.getParent()
				);
			},
			check(button) {
				var player = _status.event.player;
				var card = {
					name: button.link[2],
					nature: button.link[3],
					storage: { jsrgzhenfeng: true },
					isCard: true,
				};
				var eff = player.getUseValue(card);
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) {
					eff /= 5;
				}
				var info = get.info(card);
				if (info.toself) {
					var str = player
						.getSkills(null, false, false)
						.map(skill => {
							var info = get.info(skill);
							if (!info || info.charlotte) {
								return;
							}
							return get.skillInfoTranslation(skill, player);
						})
						.join("\n");
					if (lib.skill.jsrgzhenfeng.getInclusion(str, card)) {
						eff += get.damageEffect(player, player, player);
					}
				}
				return eff;
			},
			backup(links, player) {
				return {
					audio: "jsrgzhenfeng",
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						storage: { jsrgzhenfeng: true },
						isCard: true,
					},
					log: false,
					precontent() {
						player.logSkill("jsrgzhenfeng");
						event.getParent().addCount = false;
						player.addTempSkill("jsrgzhenfeng_used", "phaseUseAfter");
						player.markAuto("jsrgzhenfeng_used", [get.type(event.result.card)]);
					},
				};
			},
			prompt(links, player) {
				return "视为使用一张" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
			},
		},
		mod: {
			cardUsable(card) {
				if (card.storage?.jsrgzhenfeng) {
					return Infinity;
				}
			},
			targetInRange(card) {
				if (card.storage?.jsrgzhenfeng) {
					return true;
				}
			},
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
		group: "jsrgzhenfeng_effect",
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			effect: {
				audio: "jsrgzhenfeng",
				trigger: { global: "useCardToBegin" },
				charlotte: true,
				forced: true,
				onremove: true,
				filter(event, player) {
					if (!event.card.storage?.jsrgzhenfeng) {
						return false;
					}
					var str = event.target
						.getSkills(null, false, false)
						.map(skill => {
							var info = get.info(skill);
							if (!info || info.charlotte) {
								return;
							}
							return get.skillInfoTranslation(skill, event.target);
						})
						.join("\n");
					return lib.skill.jsrgzhenfeng.getInclusion(str, event.card);
				},
				logTarget: "target",
				content() {
					trigger.target.damage();
				},
			},
		},
	},
	//张飞
	jsrgbaohe: {
		trigger: { global: "phaseUseEnd" },
		filter(event, player) {
			return (
				player.countCards("he") >= 2 &&
				game.hasPlayer(current => {
					return current.inRange(event.player) && player.canUse("sha", current, false);
				})
			);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt2("jsrgbaohe"), 2, "he")
				.set("ai", card => {
					var val = _status.event.val;
					if (val > 20) {
						return 6 - get.value(card);
					}
					if (val > 0) {
						return 4 - get.value(card);
					}
					return 0;
				})
				.set(
					"val",
					game
						.filterPlayer(current => {
							return current.inRange(trigger.player) && player.canUse("sha", current, false);
						})
						.map(i => get.effect(i, { name: "sha" }, player, player))
						.reduce((p, c) => {
							return p + c;
						}, 0)
				)
				.set("logSkill", "jsrgbaohe");
			"step 1";
			if (result.bool) {
				var targets = game.filterPlayer(current => {
					return current.inRange(trigger.player) && player.canUse("sha", current, false);
				});
				if (targets.length) {
					game.delayex();
					player.useCard({ name: "sha", isCard: true, storage: { jsrgbaohe: true } }, targets, false);
					player.addTempSkill("jsrgbaohe_add");
				}
			}
		},
		subSkill: {
			add: {
				audio: "jsrgbaohe",
				trigger: {
					global: "useCard",
				},
				charlotte: true,
				forced: true,
				filter(event, player) {
					let evt = event.getParent(3),
						respondTo = event.respondTo;
					if (evt.name != "useCard" || !Array.isArray(respondTo) || !respondTo[1].storage || !respondTo[1].storage.jsrgbaohe) {
						return false;
					}
					return evt.targets.length > evt.num + 1;
				},
				logTarget(event) {
					let evt = event.getParent(3);
					return evt.targets.slice(evt.num + 1);
				},
				content() {
					"step 0";
					var evt = trigger.getParent(3);
					var targets = evt.targets.slice(evt.num + 1);
					var map = evt.customArgs;
					for (var target of targets) {
						var id = target.playerid;
						if (!map[id]) {
							map[id] = {};
						}
						if (typeof map[id].extraDamage != "number") {
							map[id].extraDamage = 0;
						}
						map[id].extraDamage++;
					}
					game.delayx();
				},
			},
		},
	},
	jsrgxushi: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		filterTarget: lib.filter.notMe,
		selectCard: [1, Infinity],
		selectTarget: [1, Infinity],
		position: "he",
		filterOk() {
			return ui.selected.cards.length == ui.selected.targets.length;
		},
		check(card) {
			var player = get.player();
			if (
				ui.selected.cards.length >=
				game.countPlayer(current => {
					return current != player && get.attitude(player, current) > 0;
				})
			) {
				return 0;
			}
			return 5 - get.value(card);
		},
		prompt: "按顺序选择卡牌和角色，并将卡牌交给对应顺序的角色。然后你获得两倍数量的【影】。",
		complexSelect: true,
		multitarget: true,
		multiline: true,
		discard: false,
		lose: false,
		delay: false,
		contentBefore() {
			event.getParent()._jsrgxushi_targets = targets.slice();
		},
		content() {
			"step 0";
			var targets = event.getParent()._jsrgxushi_targets;
			var list = [];
			for (var i = 0; i < targets.length; i++) {
				var target = targets[i];
				var card = cards[i];
				list.push([target, card]);
				player.line(target);
			}
			game.loseAsync({
				gain_list: list,
				player: player,
				cards: cards,
				giver: player,
				animate: "giveAuto",
			}).setContent("gaincardMultiple");
			"step 1";
			player.gain(lib.card.ying.getYing(2 * cards.length), "gain2");
		},
		ai: {
			order: 2.5,
			result: {
				target(player, target) {
					var card = ui.selected.cards[ui.selected.targets.length];
					if (!card) {
						return 0;
					}
					if (get.value(card) < 0) {
						return -1;
					}
					if (get.value(card) < 1.5 && player.hasSkill("jsrgbaohe")) {
						return (get.sgnAttitude(player, target) + 0.01) / 5;
					}
					return Math.sqrt(5 - Math.min(4, target.countCards("h")));
				},
			},
		},
	},
	jsrgzhuiming: {
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			return event.isFirstTarget && event.targets.length == 1 && event.target.isIn();
		},
		direct: true,
		*content(event, map) {
			var player = map.player,
				trigger = map.trigger,
				target = trigger.target;
			var colors = Object.keys(lib.color).remove("none");
			var result = yield player
				.chooseControl(colors, "cancel2")
				.set("prompt", get.prompt("jsrgzhuiming"))
				.set("prompt2", `声明一种颜色并令${get.translation(trigger.target)}弃置任意张牌`)
				.set("ai", () => {
					var player = get.player(),
						target = get.event("target"),
						att = get.attitude(player, target) > 0 ? 1 : -1,
						colors = get.event("controls"),
						known = target.getCards("e");
					if (att > 0) {
						return "cancel2";
					}
					known.addArray(target.getKnownCards(player));
					if (colors.includes("red") && !known.some(i => get.color(i) != "red")) {
						return "red";
					}
					known = 2 * known.filter(i => get.color(i) == colors[0]).length - known.length;
					if (Math.abs(known) > 1) {
						if (known > 1) {
							return colors[0];
						}
						return colors[1];
					}
					var list = get
						.event("controls")
						.map(i => [
							i,
							target
								.getCards("he")
								.map(get.value)
								.reduce((p, c) => p + c, 0),
						])
						.sort((a, b) => {
							return att * (a[1] - b[1]);
						});
					return list[0][0];
				})
				.set("target", target);
			var color = result.control;
			if (color == "cancel2") {
				event.finish();
				return;
			}
			player.logSkill("jsrgzhuiming", target);
			player.popup(color, color == "red" ? "fire" : "thunder");
			game.log(player, "声明了", color);
			var prompt = `追命：${get.translation(player)}声明了${get.translation(color)}`,
				prompt2 = `请弃置任意张牌，然后其展示你一张牌，若此牌颜色为${get.translation(color)}，此【杀】不计入次数限制、不可被响应且伤害+1`;
			yield target
				.chooseToDiscard(prompt, prompt2, [1, Infinity], "he", true)
				.set("ai", card => {
					var color = get.event("color"),
						player = get.player();
					if (get.position(card) == "e" && get.color(card) == color) {
						return 2;
					}
					if (player.getHp() <= 2 && get.color(card) == color) {
						return Math.random() < 0.5;
					}
					return 0;
				})
				.set("color", color);
			if (target.countCards("he")) {
				result = yield player
					.choosePlayerCard(target, "he", true)
					.set("ai", button => {
						var color = get.event("color"),
							att = get.event("att");
						if (get.position(button.link) == "e" && get.color(button.link) == color) {
							return 100 * att;
						}
						return 1 + Math.random();
					})
					.set("color", color)
					.set("att", get.attitude(player, target) > 0 ? 1 : -1);
			} else {
				event.finish();
				return;
			}
			var card = result.cards[0];
			player.showCards(card, `${get.translation(target)}因【追命】被展示`);
			if (get.color(card) == color) {
				trigger.directHit.addArray(game.players);
				var evt = trigger.getParent();
				if (evt.addCount !== false) {
					evt.addCount = false;
					player.getStat().card.sha--;
				}
				var map = trigger.getParent().customArgs;
				var id = target.playerid;
				if (!map[id]) {
					map[id] = {};
				}
				if (typeof map[id].extraDamage != "number") {
					map[id].extraDamage = 0;
				}
				map[id].extraDamage++;
				game.log(trigger.card, "不计入次数限制、不可被响应、伤害+1");
			}
		},
	},
	//娄圭
	jsrgshacheng: {
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			return event.targets.some(i => i.isIn() && i.hasHistory("lose", evt => evt.cards2.length)) && player.getExpansions("jsrgshacheng").length;
		},
		group: "jsrgshacheng_build",
		async cost(event, trigger, player) {
			const cards = player.getExpansions("jsrgshacheng");
			const targets = trigger.targets.filter(i => i.isIn() && i.hasHistory("lose", evt => evt.cards2.length));
			const result = await player
				.chooseButtonTarget({
					createDialog: [`###${get.prompt(event.skill)}###移去一张“城”，令一名目标角色摸X张牌（X为该角色本回合失去过的牌数且至多为5）`, cards],
					targets: targets,
					filterButton: true,
					filterTarget(card, player, target) {
						return get.event().targets.includes(target);
					},
					ai2(target) {
						return target == get.event("targetx") ? 1 : 0;
					},
					targetx: (() => {
						let info = [];
						targets.filter(target => {
							let att = get.attitude(player, target);
							if (att <= 0) {
								return false;
							}
							if (Math.abs(att) > 1) {
								att = Math.sign(att) * Math.sqrt(Math.abs(att));
							}
							info.push([
								target,
								att *
									target
										.getHistory("lose")
										.map(evt => evt.cards2.length)
										.reduce((p, c) => p + c, 0),
							]);
							return false;
						});
						if (!info.length) {
							return null;
						}
						info = info.sort((a, b) => {
							return b[1] - a[1];
						})[0];
						if (info[1] <= 0) {
							return null;
						}
						return info[0];
					})(),
				})
				.forResult();
			if (result?.links?.length && result.targets?.length) {
				event.result = {
					bool: true,
					targets: result.targets,
					cost_data: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			const cards = event.cost_data,
				[target] = event.targets;
			await player.loseToDiscardpile(cards);
			await target.draw(
				Math.min(
					5,
					target
						.getHistory("lose")
						.map(evt => evt.cards2.length)
						.reduce((p, c) => p + c, 0)
				)
			);
		},
		marktext: "城",
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
		subSkill: {
			build: {
				audio: "jsrgshacheng",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				content() {
					var cards = get.cards(2);
					player.addToExpansion(cards, "gain2").gaintag.add("jsrgshacheng");
				},
			},
		},
	},
	jsrgninghan: {
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.hasNature("ice") && event.cards?.someInD();
		},
		forced: true,
		async content(event, trigger, player) {
			const cards = trigger.cards.filterInD();
			const next = player.addToExpansion(cards, "gain2");
			next.gaintag.add("jsrgshacheng");
			await next;
		},
		global: "jsrgninghan_frozen",
		subSkill: {
			frozen: {
				mod: {
					cardnature(card, player) {
						if (!game.hasPlayer(current => current.hasSkill("jsrgninghan"))) {
							return;
						}
						if (card.name === "sha" && get.suit(card) === "club") {
							return "ice";
						}
					},
					aiOrder(player, card, num) {
						if (!game.hasPlayer(current => current.hasSkill("jsrgninghan"))) {
							return;
						}
						if (num && card.name === "sha" && game.hasNature(card, "ice")) {
							return (
								num +
								0.15 *
									Math.sign(
										game.countPlayer(current => {
											if (!current.hasSkill("jsrgninghan")) {
												return 0;
											}
											return Math.sign(get.attitude(player, current));
										})
									)
							);
						}
					},
				},
			},
		},
		ai: {
			combo: "jsrgshacheng",
		},
	},
	//张任
	jsrgfuni: {
		trigger: { global: "roundStart" },
		group: ["jsrgfuni_unlimit", "jsrgfuni_zero"],
		forced: true,
		direct: true,
		*content(event, map) {
			var player = map.player,
				trigger = map.trigger;
			var count = Math.ceil(game.countPlayer() / 2);
			var result = yield player.chooseTarget(`伏匿：请选择至多${get.cnNumber(count)}名角色`, `令这些角色获得共计${get.cnNumber(count)}张【影】`, true, [1, count]).set("ai", target => {
				return get.attitude(get.player(), target) + get.event().getRand(target.playerid);
			});
			if (result.bool) {
				var targets = result.targets.slice().sortBySeat(_status.currentPhase);
				player.logSkill("jsrgfuni", targets);
			} else {
				event.finish();
			}
			yield null;
			var num = count / targets.length;
			if (num == 1 || num == count) {
				result = {
					bool: true,
					links: targets.map(current => {
						return `${num}|${current.playerid}`;
					}),
				};
			} else {
				var dialog = ["伏匿：选择每名角色要获得的【影】数"];
				var len = count - targets.length + 1;
				for (var target of targets) {
					dialog.addArray([
						`<div class="text center">${get.translation(target)}</div>`,
						[
							Array.from({ length: len }).map((_, i) => {
								return [`${i + 1}|${target.playerid}`, get.cnNumber(i + 1, true)];
							}),
							"tdnodes",
						],
					]);
				}
				result = yield player
					.chooseButton(dialog, true)
					.set("filterButton", button => {
						var total = 0,
							info = button.link.split("|");
						var numFix = 0;
						for (var buttonx of ui.selected.buttons) {
							var infox = buttonx.link.split("|");
							var num = parseInt(infox[0]);
							total += num;
							if (infox[1] == info[1]) {
								numFix = num;
							}
						}
						return total + parseInt(info[0]) - numFix <= get.event("count");
					})
					.set("count", count)
					.set("filterOk", () => {
						var total = 0;
						for (var buttonx of ui.selected.buttons) {
							total += parseInt(buttonx.link.split("|")[0]);
						}
						return total == get.event("count");
					})
					.set("selectButton", () => {
						return [get.event("len"), Math.max(get.event("len"), ui.selected.buttons.length) + 1];
					})
					.set("len", targets.length)
					.set("custom", {
						add: {},
						replace: {
							button(button) {
								if (!_status.event.isMine()) {
									return;
								}
								if (button.classList.contains("selectable") == false) {
									return;
								}
								if (button.classList.contains("selected")) {
									ui.selected.buttons.remove(button);
									button.classList.remove("selected");
									if (_status.multitarget || _status.event.complexSelect) {
										game.uncheck();
										game.check();
									}
								} else {
									var current = button.parentNode.querySelector(".selected");
									if (current) {
										ui.selected.buttons.remove(current);
										current.classList.remove("selected");
									}
									button.classList.add("selected");
									ui.selected.buttons.add(button);
								}
								game.check();
							},
						},
					})
					.set("processAI", () => {
						return get.event("aiResult");
					})
					.set(
						"aiResult",
						(() => {
							var result = targets.map(i => {
								return [i == player ? 2 : 1, i.playerid];
							});
							var rest = count - targets.length - 1;
							while (rest--) {
								result[Math.floor(Math.random() * result.length)][0]++;
							}
							return {
								bool: true,
								links: result.map(i => `${i[0]}|${i[1]}`),
							};
						})()
					);
			}
			if (result.bool) {
				var links = result.links;
				var list = [];
				for (var link of links) {
					var info = link.split("|");
					var id = info[1];
					var target = (_status.connectMode ? lib.playerOL : game.playerMap)[id];
					player.line(target);
					var yings = lib.card.ying.getYing(parseInt(info[0]));
					list.push([target, yings]);
					game.log(target, "获得了", yings);
				}
				game.loseAsync({
					gain_list: list,
					animate: "gain2",
				}).setContent("gaincardMultiple");
			}
		},
		subSkill: {
			zero: {
				priority: Infinity,
				mod: {
					attackRange: () => 0,
				},
			},
			unlimit: {
				audio: "jsrgfuni",
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"],
				},
				filter(event, player) {
					return event.getd().some(i => get.name(i, false) == "ying");
				},
				forced: true,
				content() {
					player.addTempSkill("jsrgfuni_buff");
				},
			},
			buff: {
				charlotte: true,
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				content() {
					trigger.directHit.addArray(game.players);
					game.log(trigger.card, "不可被响应");
				},
				mark: true,
				intro: {
					content: "使用牌无距离限制且不能被响应",
				},
				mod: {
					targetInRange: () => true,
				},
			},
		},
		ai: {
			expose: 0.15,
			halfneg: true,
		},
	},
	jsrgchuanxin: {
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return (
				player.countCards("hes") &&
				game.hasPlayer(current =>
					player.canUse(
						{
							name: "sha",
							storage: { jsrgchuanxin: true },
						},
						current
					)
				)
			);
		},
		direct: true,
		clearTime: true,
		content() {
			var next = player.chooseToUse();
			next.set("openskilldialog", `###${get.prompt("jsrgchuanxin")}###将一张牌当【杀】使用，且当一名角色受到此【杀】伤害时，此伤害+X（X为其本回合回复过的体力值）。`);
			next.set("norestore", true);
			next.set("_backupevent", "jsrgchuanxin_backup");
			next.set("addCount", false);
			next.set("logSkill", "jsrgchuanxin");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("jsrgchuanxin_backup");
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				viewAs: {
					name: "sha",
					storage: { jsrgchuanxin: true },
				},
				selectCard: 1,
				position: "hes",
				ai1(card) {
					var player = get.player();
					var maxVal = 5.5;
					if (get.name(card, false) == "ying" && player.hasSkill("jsrgchuanxin")) {
						maxVal -= 3;
					}
					return maxVal - get.value(card);
				},
				log: false,
				precontent() {
					player.addTempSkill("jsrgchuanxin_add");
				},
			},
			add: {
				trigger: { global: "damageBegin3" },
				filter(event, player) {
					if (!event.card || !event.card.storage || !event.card.storage.jsrgchuanxin) {
						return false;
					}
					if (event.getParent().type != "card") {
						return false;
					}
					return game.hasGlobalHistory("changeHp", evt => {
						return evt.getParent().name == "recover" && evt.player == event.player;
					});
				},
				forced: true,
				charlotte: true,
				content() {
					var num = game
						.getGlobalHistory("changeHp", evt => {
							return evt.getParent().name == "recover" && evt.player == trigger.player;
						})
						.map(evt => evt.num)
						.reduce((p, c) => p + c, 0);
					trigger.num += num;
					game.log(trigger.card, "的伤害+" + num);
				},
			},
		},
	},
	//黄忠
	jsrgcuifeng: {
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		locked: false,
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of lib.inpile) {
					var info = lib.card[name];
					if (!info || info.notarget || (info.selectTarget && info.selectTarget != 1) || !get.tag({ name: name }, "damage")) {
						continue;
					}
					if (name == "sha") {
						list.push(["基本", "", "sha"]);
						for (var nature of lib.inpile_nature) {
							list.push(["基本", "", name, nature]);
						}
					} else if (get.type(name) == "trick") {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) == "basic") {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("摧锋", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard(
					{
						name: button.link[2],
						nature: button.link[3],
						isCard: true,
						storage: { jsrgcuifeng: true },
					},
					player,
					_status.event.getParent()
				);
			},
			check(button) {
				var player = _status.event.player;
				var effect = player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
					storage: { jsrgcuifeng: true },
				});
				if (effect > 0) {
					return effect;
				}
				return 0;
			},
			backup(links, player) {
				return {
					audio: "jsrgcuifeng",
					selectCard: -1,
					filterCard: () => false,
					popname: true,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
						storage: { jsrgcuifeng: true },
					},
					log: false,
					precontent() {
						player.logSkill("jsrgcuifeng");
						player.awakenSkill("jsrgcuifeng");
						if (!player.storage.jsrgcuifeng_check) {
							player
								.when("phaseEnd")
								.then(() => {
									var num = 0;
									player.checkHistory("sourceDamage", evt => {
										if (evt.card?.storage?.jsrgcuifeng) {
											num += evt.num;
										}
									});
									if (num == 0 || num > 1) {
										player.restoreSkill("jsrgcuifeng");
										game.log(player, "重置了", "#g【摧锋】");
									}
									delete player.storage.jsrgcuifeng_check;
								})
								.translation("摧锋");
						}
						player.setStorage("jsrgcuifeng_check", true);
					},
				};
			},
			prompt(links, player) {
				return "请选择" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "的目标";
			},
		},
		mod: {
			targetInRange: card => {
				if (card.storage?.jsrgcuifeng) {
					return true;
				}
			},
		},
		ai: {
			order: 1.9,
			result: { player: 1 },
		},
	},
	jsrgdengnan: {
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of lib.inpile) {
					var info = lib.card[name];
					if (!info || info.type != "trick" || info.notarget || get.tag({ name: name }, "damage")) {
						continue;
					}
					list.push(["锦囊", "", name]);
				}
				return ui.create.dialog("登难", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2], isCard: true }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				return player.getUseValue(button.link[2]);
			},
			backup(links, player) {
				return {
					audio: "jsrgdengnan",
					selectCard: -1,
					filterCard: () => false,
					popname: true,
					viewAs: {
						name: links[0][2],
						isCard: true,
						storage: { jsrgdengnan: true },
					},
					log: false,
					precontent() {
						player.logSkill("jsrgdengnan");
						player.awakenSkill("jsrgdengnan");
						if (!player.storage.jsrgdengnan_check) {
							player
								.when("phaseEnd")
								.then(() => {
									var targets = [];
									player.checkHistory("useCard", evt => {
										if (evt.card.storage?.jsrgdengnan && evt.targets?.length) {
											targets.addArray(evt.targets);
										}
									});
									if (
										targets.every(current => {
											return current.hasHistory("damage");
										})
									) {
										player.restoreSkill("jsrgdengnan");
										game.log(player, "重置了", "#g【登难】");
									}
									delete player.storage.jsrgdengnan_check;
								})
								.translation("登难");
						}
						player.setStorage("jsrgdengnan_check", true);
					},
				};
			},
			prompt(links, player) {
				return "请选择" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "的目标";
			},
		},
		ai: {
			order: 2,
			result: { player: 1 },
		},
	},
	//夏侯荣
	jsrgfenjian: {
		enable: "chooseToUse",
		locked: false,
		filter(event, player) {
			return ["juedou", "tao"].some(name => {
				return (
					!player.getStorage("jsrgfenjian_used").includes(name) &&
					event.filterCard(
						{
							name: name,
							isCard: true,
							storage: { jsrgfenjian: true },
						},
						player,
						event
					)
				);
			});
		},
		hiddenCard(player, name) {
			if (["juedou", "tao"].some(i => i == name && !player.getStorage("jsrgfenjian_used").includes(name))) {
				return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("奋剑", [["juedou", "tao"].filter(name => !player.getStorage("jsrgfenjian_used").includes(name)), "vcard"]);
				dialog.direct = true;
				return dialog;
			},
			filter(button, player) {
				var evt = _status.event.getParent();
				return evt.filterCard(
					{
						name: button.link[2],
						isCard: true,
						storage: { jsrgfenjian: true },
					},
					player,
					evt
				);
			},
			check(button) {
				if (button.link[2] === "tao") {
					let dying = _status.event.getParent(2).dying;
					if (dying) {
						return get.effect(
							dying,
							{
								name: "tao",
								isCard: true,
								storage: { jsrgfenjian: true },
							},
							_status.event.player
						);
					}
				}
				return _status.event.player.getUseValue({
					name: button.link[2],
					isCard: true,
					storage: { jsrgfenjian: true },
				});
			},
			backup(links) {
				return {
					audio: "jsrgfenjian",
					viewAs: {
						name: links[0][2],
						isCard: true,
						storage: { jsrgfenjian: true },
					},
					filterCard: () => false,
					selectCard: -1,
					log: false,
					precontent() {
						player.logSkill("jsrgfenjian");
						player.addTempSkill("jsrgfenjian_effect");
						player.addMark("jsrgfenjian_effect", 1, false);
						player.addTempSkill("jsrgfenjian_used");
						player.markAuto("jsrgfenjian_used", [event.result.card.name]);
					},
				};
			},
			prompt(links) {
				return "奋剑：令你本回合受到的伤害+1，视为使用" + get.translation(links[0][2]);
			},
		},
		mod: {
			targetEnabled(card, player, target) {
				if (player == target && card.storage?.jsrgfenjian) {
					return false;
				}
			},
		},
		ai: {
			order(item, player) {
				return Math.max(get.order({ name: "juedou" }), get.order({ name: "tao" })) + 0.2;
			},
			result: {
				player: player => {
					if (_status.event.dying) {
						return 2 * get.sgnAttitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			effect: {
				audio: "jsrgfenjian",
				charlotte: true,
				trigger: { player: "damageBegin3" },
				forced: true,
				onremove: true,
				content() {
					trigger.num += player.countMark("jsrgfenjian_effect");
				},
				intro: { content: "本回合受到的伤害+#" },
			},
		},
	},
	//孙尚香
	jsrgguiji: {
		enable: "phaseUse",
		filter(event, player) {
			if (player.hasSkill("jsrgguiji_used")) {
				return false;
			}
			return game.hasPlayer(current => lib.skill.jsrgguiji.filterTarget("keiki", player, current));
		},
		filterTarget(card, player, target) {
			return target.countCards("h") < player.countCards("h") && target.hasSex("male");
		},
		content() {
			"step 0";
			player.swapHandcards(target);
			player.addSkill("jsrgguiji_swapback");
			player.markAuto("jsrgguiji_swapback", target);
			player.addTempSkill("jsrgguiji_used");
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					var val = player
						.getCards("h")
						.map(i => get.value(i))
						.reduce((p, c) => p + c, 0);
					var val2 = target
						.getCards("h")
						.map(i => get.value(i))
						.reduce((p, c) => p + c, 0);
					return val - val2;
				},
			},
		},
		subSkill: {
			used: { charlotte: true },
			swapback: {
				audio: "jsrgguiji",
				trigger: {
					global: ["phaseUseEnd", "dieAfter"],
				},
				filter(event, player) {
					return player.getStorage("jsrgguiji_swapback").includes(event.player);
				},
				charlotte: true,
				direct: true,
				check(event, player) {
					return (
						player
							.getCards("h")
							.map(i => get.value(i))
							.reduce((p, c) => p + c, 0) <
						event.player
							.getCards("h")
							.map(i => get.value(i))
							.reduce((p, c) => p + c, 0) +
							4 * Math.random()
					);
				},
				content() {
					"step 0";
					player.unmarkAuto("jsrgguiji_swapback", [trigger.player]);
					if (trigger.name == "phaseUse") {
						player
							.chooseBool(get.prompt("jsrgguiji_swapback", trigger.player), "与其交换手牌。")
							.set("ai", () => {
								return get.event("bool");
							})
							.set("bool", lib.skill.jsrgguiji_swapback.check(trigger, player) > 0);
					} else {
						event.finish();
					}
					"step 1";
					if (result.bool) {
						player.logSkill("jsrgguiji_swapback", trigger.player);
						player.swapHandcards(trigger.player);
					}
				},
				intro: {
					content: "$的下个出牌阶段结束时，你可以与其交换手牌",
				},
			},
		},
	},
	jsrgjiaohao: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return [1, 2, 3, 4, 5].some(i => player.countEmptySlot(i));
		},
		forced: true,
		locked: false,
		global: "jsrgjiaohao_g",
		content() {
			"step 0";
			var count = Math.ceil([1, 2, 3, 4, 5].map(i => player.countEmptySlot(i)).reduce((p, c) => p + c, 0) / 2);
			player.gain(lib.card.ying.getYing(count), "gain2");
		},
		subSkill: {
			g: {
				audio: "jsrgjiaohao",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return game.hasPlayer(current => {
						if (current == player || !current.hasSkill("jsrgjiaohao")) {
							return false;
						}
						return player.hasCard(card => {
							return get.type(card) == "equip" && current.canEquip(card);
						});
					});
				},
				filterTarget(card, player, target) {
					if (target.isMin()) {
						return false;
					}
					return target != player && target.hasSkill("jsrgjiaohao") && target.canEquip(card);
				},
				selectTarget() {
					var num = game.countPlayer(current => {
						return current.hasSkill("jsrgjiaohao");
					});
					return num > 1 ? 1 : -1;
				},
				filterCard(card) {
					return get.type(card) == "equip";
				},
				check(card) {
					var player = get.player();
					if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
						return 11 - get.equipValue(card);
					}
					return 6 - get.value(card);
				},
				prompt() {
					var list = game.filterPlayer(current => {
						return current.hasSkill("jsrgjiaohao");
					});
					return `将一张装备牌置于${get.translation(list)}${list.length > 1 ? "中的一人" : ""}的装备区`;
				},
				discard: false,
				lose: false,
				prepare(cards, player, targets) {
					player.$give(cards, targets[0], false);
				},
				content() {
					target.equip(cards[0]);
				},
				ai: {
					order: 10,
					result: {
						target(player, target) {
							var card = ui.selected.cards[0];
							if (card) {
								return get.effect(target, card, target, target);
							}
							return 0;
						},
					},
				},
			},
		},
	},
	//庞统
	jsrgmanjuan: {
		trigger: {
			player: "loseEnd",
			global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
		},
		filter(event, player) {
			return (player.countCards("h") == 0) ^ player.hasSkill("jsrgmanjuan_in");
		},
		forced: true,
		locked: false,
		firstDo: true,
		silent: true,
		content() {
			"step 0";
			if (!player.countCards("h")) {
				var cards = [];
				game.checkGlobalHistory("cardMove", evt => {
					if ((evt.name == "lose" && evt.position == ui.discardPile) || evt.name == "cardsDiscard") {
						cards.addArray(evt.cards.filterInD("d"));
					}
				});
				var cardsx = cards.map(card => {
					var cardx = ui.create.card();
					cardx.init(get.cardInfo(card));
					cardx._cardid = card.cardid;
					return cardx;
				});
				player.directgains(cardsx, null, "jsrgmanjuan");
				player.addSkill("jsrgmanjuan_in");
			} else {
				player.removeSkill("jsrgmanjuan_in");
			}
		},
		onremove(player) {
			player.removeSkill("jsrgmanjuan_in");
		},
		subSkill: {
			in: {
				audio: "jsrgmanjuan",
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
				},
				forced: true,
				locked: false,
				silent: true,
				filter(event, player) {
					var cards = event.getd();
					return cards.length;
				},
				onremove(player) {
					var cards2 = player.getCards("s", card => {
						return card.hasGaintag("jsrgmanjuan");
					});
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) {
									ui.updatehl();
								}
							},
							cards2,
							player
						);
					}
					cards2.forEach(i => i.delete());
					if (player == game.me) {
						ui.updatehl();
					}
				},
				group: ["jsrgmanjuan_use", "jsrgmanjuan_lose"],
				content() {
					var cards = [];
					var idList = player.getCards("s", card => card.hasGaintag("jsrgmanjuan")).map(i => i._cardid);
					game.checkGlobalHistory("cardMove", evt => {
						if ((evt.name == "lose" && evt.position == ui.discardPile) || evt.name == "cardsDiscard") {
							cards.addArray(evt.cards.filter(i => get.position(i, true) == "d" && !idList.includes(i.cardid)));
						}
					});
					var cards2 = cards.map(card => {
						var cardx = ui.create.card();
						cardx.init(get.cardInfo(card));
						cardx._cardid = card.cardid;
						return cardx;
					});
					player.directgains(cards2, null, "jsrgmanjuan");
				},
				mod: {
					cardEnabled2(card, player) {
						if (get.itemtype(card) == "card" && card.hasGaintag("jsrgmanjuan") && player.getStorage("jsrgmanjuan_used").includes(get.number(card, false))) {
							return false;
						}
					},
				},
			},
			use: {
				trigger: {
					player: ["useCardBefore", "respondBefore"],
				},
				charlotte: true,
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					var cards = player.getCards("s", card => card.hasGaintag("jsrgmanjuan") && card._cardid);
					return (
						event.cards &&
						event.cards.some(card => {
							return cards.includes(card);
						})
					);
				},
				content() {
					var idList = player.getCards("s", card => card.hasGaintag("jsrgmanjuan")).map(i => i._cardid);
					var cards = [];
					game.checkGlobalHistory("cardMove", evt => {
						if ((evt.name == "lose" && evt.position == ui.discardPile) || evt.name == "cardsDiscard") {
							cards.addArray(evt.cards.filter(i => idList.includes(i.cardid)));
						}
					});
					var cards2 = [];
					for (var card of trigger.cards) {
						var cardx = cards.find(cardx => cardx.cardid == card._cardid);
						if (cardx) {
							cards2.push(cardx);
						} else {
							cards2.push(card);
						}
					}
					var cards3 = trigger.cards.slice().filter(card => card.hasGaintag("jsrgmanjuan"));
					trigger.cards = cards2;
					trigger.card.cards = cards2;
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) {
									ui.updatehl();
								}
							},
							cards3,
							player
						);
					}
					cards3.forEach(i => i.delete());
					if (player == game.me) {
						ui.updatehl();
					}
					player.addTempSkill("jsrgmanjuan_used");
					player.markAuto(
						"jsrgmanjuan_used",
						cards3.map(card => get.number(card, false))
					);
				},
			},
			lose: {
				trigger: {
					global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd", "cardsGotoOrderingBegin", "phaseAfter"],
				},
				charlotte: true,
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if (event.name == "phase") {
						return true;
					}
					var idList = player.getCards("s", card => card.hasGaintag("jsrgmanjuan")).map(i => i._cardid);
					return (
						event.cards &&
						event.cards.some(card => {
							return idList.includes(card.cardid);
						})
					);
				},
				content() {
					var cards2;
					if (trigger.name == "phase") {
						cards2 = player.getCards("s", card => {
							return card.hasGaintag("jsrgmanjuan");
						});
					} else {
						var idList = [];
						game.checkGlobalHistory("cardMove", evt => {
							if ((evt.name == "lose" && evt.position == ui.discardPile) || evt.name == "cardsDiscard") {
								idList.addArray(evt.cards.filter(i => get.position(i, true) == "d").map(i => i.cardid));
							}
						});
						cards2 = player.getCards("s", card => {
							return card.hasGaintag("jsrgmanjuan") && !idList.includes(card._cardid);
						});
					}
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) {
									ui.updatehl();
								}
							},
							cards2,
							player
						);
					}
					cards2.forEach(i => i.delete());
					if (player == game.me) {
						ui.updatehl();
					}
				},
			},
			used: {
				onremove: true,
				charlotte: true,
			},
		},
	},
	jsrgyangming: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => {
				return player.canCompare(current);
			});
		},
		filterTarget(card, player, current) {
			return player.canCompare(current);
		},
		content() {
			"step 0";
			target.addTempSkill("jsrgyangming_lose", "phaseUseAfter");
			"step 1";
			player.chooseToCompare(target).set(
				"small",
				get.attitude(player, target) > 0 &&
					(player.countCards("h", card => {
						return get.value(card) < 6;
					}) <= 1 ||
						target.countCards("h", card => {
							return get.value(card) < 6;
						}) <= 1)
			);
			"step 2";
			if (result.winner != target) {
				if (!player.canCompare(target)) {
					event._result = { bool: false };
				} else {
					player
						.chooseBool("是否与其重复此拼点流程？")
						.set("ai", () => get.event("bool"))
						.set("bool", get.effect(target, "jsrgyangming", player, player) > 0);
				}
				game.broadcastAll(target => {
					target.storage.jsrgyangming_lose++;
				}, target);
			} else {
				if (target.storage.jsrgyangming_lose) {
					target.draw(target.storage.jsrgyangming_lose);
				}
				player.recover();
				event.finish();
			}
			"step 3";
			if (result.bool) {
				event.goto(1);
			}
		},
		ai: {
			order: 1,
			expose: 0.15,
			result: {
				target(player, target) {
					var maxnum = 0;
					var cards2 = target.getCards("h");
					for (var i = 0; i < cards2.length; i++) {
						if (get.number(cards2[i]) > maxnum) {
							maxnum = get.number(cards2[i]);
						}
					}
					if (maxnum > 10) {
						maxnum = 10;
					}
					if (maxnum < 5 && cards2.length > 1) {
						maxnum = 5;
					}
					var cards = player.getCards("h");
					for (var i = 0; i < cards.length; i++) {
						if (get.number(cards[i]) < maxnum) {
							return 1;
						}
					}
					return 0;
				},
			},
		},
		subSkill: {
			lose: {
				init(player, skill) {
					player.storage[skill] = 0;
				},
				onremove: true,
				charlotte: true,
			},
		},
	},
	//韩遂
	jsrgniluan: {
		audio: "niluan",
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			var damaged = game.filterPlayer(current => {
				return current.hasAllHistory("sourceDamage", evt => evt.player == player);
			});
			var undamaged = game.filterPlayer().removeArray(damaged);
			player.chooseCardTarget({
				prompt: get.prompt("jsrgniluan"),
				prompt2: `${undamaged.length ? "选择一张牌弃置并选择一名未对你造成过伤害的角色，你对其造成1点伤害" : ""}${undamaged.length && damaged.length ? "；<br>或" : ""}${damaged.length ? "仅选择一名对你造成过伤害的角色，你令其摸两张牌" : ""}。`,
				damaged: damaged,
				aiTarget: (() => {
					if (
						undamaged.includes(player) &&
						!undamaged.some(i => {
							if (i === player) {
								return false;
							}
							let att = get.attitude(player, i);
							if (att > 0) {
								return true;
							}
							return att < 0 && i.getHp(true) + i.hujia < 2;
						}) &&
						(player.hp > 2 || get.damageEffect(player, player, player) >= 0)
					) {
						return player;
					}
					var info = game
						.filterPlayer()
						.map(current => {
							let damage = undamaged.includes(current),
								card = { name: damage ? "damage" : "draw" };
							return [current, get.effect(current, card, player, player) * (damage ? 0.7 : 2)];
						})
						.sort((a, b) => b[1] - a[1])[0];
					if (info[1] > 0) {
						return info[0];
					}
					return null;
				})(),
				filterCard: lib.filter.cardDiscardable,
				selectCard() {
					if (get.event("damaged").length == 0) {
						return 1;
					}
					if (get.event("damaged").length == game.countPlayer()) {
						return 0;
					}
					return [0, 1];
				},
				position: "he",
				filterTarget(card, player, target) {
					var damaged = get.event("damaged");
					return damaged.includes(target) ^ (ui.selected.cards.length > 0);
				},
				complexSelect: true,
				selectTarget: 1,
				ai1(card) {
					if (get.event("damaged").includes(get.event("aiTarget"))) {
						return 0;
					}
					return 6 - get.value(card);
				},
				ai2(target) {
					return target == get.event("aiTarget") ? 10 : 0;
				},
			});
			"step 1";
			if (result.bool) {
				var cards = result.cards,
					target = result.targets[0];
				player.logSkill("jsrgniluan", target);
				if (cards && cards.length) {
					player.discard(cards);
					game.delayex();
					target.damage();
				} else {
					target.draw(2);
				}
			}
		},
	},
	jsrghuchou: {
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			const history = _status.globalHistory;
			for (let i = history.length - 1; i >= 0; i--) {
				let evts = history[i]["useCard"];
				for (let j = evts.length - 1; j >= 0; j--) {
					var evt = evts[j];
					let card = evt.card,
						targets = evt.targets;
					if (!get.tag(card, "damage") || !targets.includes(player)) {
						continue;
					}
					return event.player == evt.player;
				}
			}
			return false;
		},
		forced: true,
		content() {
			trigger.num++;
		},
		init(player) {
			player.addSkill("jsrghuchou_tip");
		},
		onremove(player) {
			player.removeSkill("jsrghuchou_tip");
		},
		subSkill: {
			tip: {
				trigger: {
					target: "useCardToTarget",
				},
				charlotte: true,
				init(player, skill) {
					const history = _status.globalHistory || [];
					round: for (let i = history.length - 1; i >= 0; i--) {
						let evts = history[i]["useCard"];
						for (let j = evts.length - 1; j >= 0; j--) {
							var evt = evts[j];
							let card = evt.card,
								targets = evt.targets;
							if (!get.tag(card, "damage") || !targets.includes(player)) {
								continue;
							}
							player.addTip(skill, `互雠 ${get.translation(evt.player)}`);
							break round;
						}
					}
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				filter(event, player) {
					if (get.tag(event.card, "damage")) {
						lib.skill.jsrghuchou_tip.init(player, "jsrghuchou_tip");
					}
					return false;
				},
				async content(event, trigger, player) {},
			},
		},
		ai: {
			damageBonus: true,
			skillTagFilter: (player, tag, arg) => {
				if (tag === "damageBonus" && arg && arg.target) {
					const history = _status.globalHistory;
					for (let i = history.length - 1; i >= 0; i--) {
						let evts = history[i]["useCard"];
						for (let j = evts.length - 1; j >= 0; j--) {
							var evt = evts[j];
							let card = evt.card,
								targets = evt.targets;
							if (!get.tag(card, "damage") || !targets.includes(player)) {
								continue;
							}
							return arg.target === evt.player;
						}
					}
					return false;
				}
			},
			effect: {
				player: (card, player, target) => {
					if (
						get.tag(card, "damage") &&
						target &&
						lib.skill.jsrghuchou.ai.skillTagFilter(player, "damageBonus", {
							card: card,
							target: target,
						}) &&
						!target.hasSkillTag("filterDamage", null, {
							player: player,
							card: card,
						})
					) {
						return [1, 0, 2, 0];
					}
				},
			},
		},
	},
	jsrgjiemeng: {
		zhuSkill: true,
		locked: true,
		init: () => {
			game.addGlobalSkill("jsrgjiemeng_effect");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("jsrgjiemeng", null, null, false), true)) {
				game.removeGlobalSkill("jsrgjiemeng_effect");
			}
		},
		subSkill: {
			effect: {
				mod: {
					globalFrom(from, to, distance) {
						if (from.group != "qun") {
							return;
						}
						if (to.hasZhuSkill("jsrgjiemeng")) {
							return;
						}
						return distance - game.countPlayer(current => current.group == "qun");
					},
				},
				trigger: { player: "dieAfter" },
				filter: () => {
					return !game.hasPlayer(i => i.hasSkill("jsrgjiemeng", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				content: () => {
					game.removeGlobalSkill("jsrgjiemeng_effect");
				},
			},
		},
	},
	//张楚
	jsrghuozhong: {
		audio: "dcjizhong",
		global: "jsrghuozhong_g",
		subSkill: {
			g: {
				audio: "dcjizhong",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					if (player.hasJudge("bingliang")) {
						return false;
					}
					if (!game.hasPlayer(current => current.hasSkill("jsrghuozhong"))) {
						return false;
					}
					return player.countCards("hes", card => get.color(card) == "black" && get.type2(card) != "trick") > 0;
				},
				position: "hes",
				prompt() {
					var list = game.filterPlayer(target => {
						return target.hasSkill("jsrghuozhong");
					});
					return `将一张黑色非锦囊牌当【兵粮寸断】置于自己的判定区，然后令${get.translation(list)}${list.length > 1 ? "中的一人" : ""}摸两张牌。`;
				},
				filterCard(card, player, event) {
					return get.color(card) == "black" && get.type2(card) != "trick" && player.canAddJudge({ name: "bingliang", cards: [card] });
				},
				selectTarget() {
					const targets = game.filterPlayer(target => {
						return target.hasSkill("jsrghuozhong");
					});
					if (targets.length > 1) {
						return 1;
					}
					return -1;
				},
				filterTarget(card, player, target) {
					return target.hasSkill("jsrghuozhong");
				},
				check(card) {
					return 6 - get.value(card);
				},
				discard: false,
				lose: false,
				prepare: "throw",
				async content(event, trigger, player) {
					await player.addJudge({ name: "bingliang" }, event.cards);
					await event.target.draw(2);
				},
				ai: {
					result: {
						player(player) {
							if (game.hasPlayer(current => get.attitude(player, current) > 2 && current.hasSkill("jsrghuozhong"))) {
								return 1;
							}
							return 0;
						},
					},
					order: 9,
				},
			},
		},
	},
	jsrgrihui: {
		audio: "dcrihui",
		locked: false,
		trigger: { source: "damageSource" },
		filter(event, player) {
			return (
				event.getParent().type == "card" &&
				event.card &&
				event.card.name == "sha" &&
				game.hasPlayer(current => {
					return current != player && current.countCards("j");
				})
			);
		},
		prompt: "是否发动【日彗】？",
		prompt2(event, player) {
			var list = game.filterPlayer(current => {
				return current != player && current.countCards("j");
			});
			return `令${get.translation(list)}${list.length > 1 ? "各" : ""}摸一张牌。`;
		},
		logTarget(event, player) {
			return game.filterPlayer(current => {
				return current != player && current.countCards("j");
			});
		},
		group: "jsrgrihui_sha",
		content() {
			game.asyncDraw(lib.skill.jsrgrihui.logTarget(trigger, player));
		},
		mod: {
			cardUsableTarget(card, player, target) {
				if (card.name == "sha" && !player.getStorage("jsrgrihui_targeted").includes(target)) {
					return true;
				}
			},
		},
		subSkill: {
			sha: {
				trigger: { player: "useCardToPlayered" },
				forced: true,
				silent: true,
				firstDo: true,
				content() {
					player.addTempSkill("jsrgrihui_targeted");
					player.markAuto("jsrgrihui_targeted", trigger.target);
				},
			},
			targeted: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//夏侯恩
	jsrghujian: {
		audio: "twfujian",
		trigger: {
			global: "phaseEnd",
		},
		filter(event, player) {
			if (!Array.from(ui.discardPile.childNodes).some(i => i.name == "chixueqingfeng")) {
				return false;
			}
			return game.hasGlobalHistory("everything", evt => ["useCard", "respond"].includes(evt.name) && evt.player.isIn());
		},
		popup: false,
		forced: true,
		locked: false,
		group: "jsrghujian_begin",
		content() {
			"step 0";
			var cards = Array.from(ui.discardPile.childNodes).filter(i => i.name == "chixueqingfeng");
			if (cards.length) {
				event.cards = cards;
				var history = _status.globalHistory,
					target = null;
				for (var i = history.length - 1; i >= 0 && !target; i--) {
					var evts = history[i]["everything"];
					for (var j = evts.length - 1; j >= 0; j--) {
						var evt = evts[j];
						if (!["useCard", "respond"].includes(evt.name)) {
							continue;
						}
						target = evt.player;
						break;
					}
				}
				if (target && target.isIn()) {
					event.target = target;
					target.chooseBool(`是否响应${get.translation(player)}的【护剑】？`, "获得弃牌堆里的【赤血青锋】。");
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				player.logSkill("jsrghujian");
				player.line(target);
				target.gain(cards, "gain2");
			}
		},
		subSkill: {
			begin: {
				audio: "twfujian",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				content() {
					player.gain(game.createCard2("chixueqingfeng", "spade", 6), "gain2");
				},
			},
		},
	},
	jsrgshili: {
		audio: "twjianwei",
		enable: "phaseUse",
		usable: 1,
		viewAs: {
			name: "juedou",
		},
		filterCard: { type: "equip" },
		position: "hs",
		viewAsFilter(player) {
			return player.hasCard({ type: "equip" }, "hs");
		},
		check(card) {
			return (get.name(card, false) == "chixueqingfeng" ? 20 : 12) - _status.event.player.getUseValue(card);
		},
		ai: {
			order: 0.001,
		},
	},
	//范疆张达
	jsrgfushan: {
		trigger: { player: "phaseUseBegin" },
		forced: true,
		locked: false,
		filter(event, player) {
			return game.hasPlayer(i => i != player);
		},
		*content(event, map) {
			var player = map.player,
				trigger = map.trigger,
				targets = game.filterPlayer(i => i != player);
			var shas = player.mayHaveSha(target, "use", null, "count") - player.getCardUsable("sha", true);
			for (var target of targets) {
				var att = get.attitude(target, player);
				var result = yield target
					.chooseCard("he", `负山：是否交给${get.translation(player)}一张牌？`, `若如此做，其此阶段使用【杀】的次数上限+1`)
					.set("att", att)
					.set("ai", card => {
						if (!get.event("goon")) {
							return -get.value(card);
						}
						var isSha = get.name(card, get.event("target")) == "sha";
						if (get.event("att") < 0) {
							return (isSha ? 0 : 5) - get.value(card);
						}
						return (isSha ? 10 : 0) - get.value(card);
					})
					.set("goon", (att > 0 && shas >= 0) || (att < 0 && target.hp > player.getCardUsable("sha", true) && shas < -1 / Math.max(1, player.hp)))
					.set("target", player);
				if (result.bool) {
					target.give(result.cards, player);
					target.line(player);
					player.addTempSkill("jsrgfushan_sha", "phaseAfter");
					player.addMark("jsrgfushan_sha", 1, false);
					player.markAuto("jsrgfushan_given", target);
				}
			}
			player
				.when("phaseUseAfter")
				.filter(evt => evt == trigger)
				.then(() => {
					player.logSkill("jsrgfushan");
					if (
						player.getCardUsable("sha", true) >
							player.getHistory("useCard", evt => {
								return evt.getParent("phaseUse") == trigger && evt.card.name == "sha" && evt.addCount !== false;
							}).length &&
						player.storage.jsrgfushan_given &&
						player.storage.jsrgfushan_given.every(i => i.isIn())
					) {
						player.loseHp(2);
					} else {
						player.drawTo(player.maxHp);
					}
					delete player.storage.jsrgfushan_given;
				});
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				marktext: "负",
				intro: { content: "使用【杀】的次数上限+#" },
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("jsrgfushan_sha");
						}
					},
				},
			},
		},
	},
	//江山如故·承
	//404孙策
	jsrgduxing: {
		enable: "phaseUse",
		viewAs: {
			name: "juedou",
			storage: { jsrgduxing: true },
			isCard: true,
		},
		viewAsFilter(player) {
			if (player.hasSkill("jsrgduxing_used")) {
				return false;
			}
		},
		filterCard: () => false,
		selectCard: -1,
		selectTarget: [1, Infinity],
		log: false,
		precontent() {
			player.logSkill("jsrgduxing");
			var targets = event.result.targets;
			for (var target of targets) {
				target.addTempSkill("jsrgduxing_allsha");
			}
			player.addTempSkill("jsrgduxing_restore");
			player.addTempSkill("jsrgduxing_used", "phaseUseAfter");
		},
		ai: {
			order: 5,
			result: {
				player(player, target) {
					var eff = Math.sign(get.effect(target, { name: "juedou" }, player, player));
					if (
						player.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: target,
								card: { name: "juedou" },
							},
							true
						) ||
						ui.selected.targets.concat(target).reduce((p, c) => {
							return p + c.countCards("h");
						}, 0) < player.countCards("h", "sha")
					) {
						return 0;
					}
					return -114514;
				},
				target: -1.5,
			},
		},
		subSkill: {
			allsha: {
				charlotte: true,
				mod: {
					cardname(card, player, name) {
						return "sha";
					},
				},
			},
			used: { charlotte: true },
			restore: {
				charlotte: true,
				trigger: { global: "useCardAfter" },
				forced: true,
				popup: false,
				forceDie: true,
				forceOut: true,
				filter(event, player) {
					return event.card.name == "juedou" && event.card.storage?.jsrgduxing;
				},
				content() {
					game.countPlayer(current => {
						current.removeSkill("jsrgduxing_allsha");
					}, true);
				},
			},
		},
	},
	jsrgzhiheng: {
		trigger: {
			source: "damageBegin1",
		},
		forced: true,
		filter(event, player) {
			if (event.getParent().type != "card") {
				return false;
			}
			var respondEvts = [];
			respondEvts.addArray(event.player.getHistory("useCard")).addArray(event.player.getHistory("respond"));
			respondEvts = respondEvts.filter(i => i.respondTo).map(evt => evt.respondTo);
			return respondEvts.some(list => {
				return list[0] == player;
			});
		},
		content() {
			trigger.num++;
		},
	},
	jsrgzhasi: {
		trigger: {
			player: "damageBegin4",
		},
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		filter(event, player) {
			return event.num >= player.getHp();
		},
		content() {
			player.awakenSkill(event.name);
			trigger.cancel();
			player.changeSkills(["rezhiheng"], ["jsrgzhiheng"]);
			player.addSkill("jsrgzhasi_undist");
		},
		derivation: "rezhiheng",
		subSkill: {
			undist: {
				group: "undist",
				trigger: {
					player: ["useCardAfter", "damageEnd"],
				},
				filter(event, player) {
					if (event.name == "useCard") {
						return event.targets.some(target => {
							return target != player;
						});
					}
					return true;
				},
				forced: true,
				popup: false,
				charlotte: true,
				content() {
					player.removeSkill("jsrgzhasi_undist");
				},
				mark: true,
				intro: {
					content: "诈死中，不计入距离和座次的计算",
				},
			},
		},
	},
	jsrgbashi: {
		trigger: { player: "chooseToRespondBefore" },
		zhuSkill: true,
		filter(event, player) {
			if (event.responded) {
				return false;
			}
			if (player.storage.jsrgbashiing) {
				return false;
			}
			if (!player.hasZhuSkill("jsrgbashi")) {
				return false;
			}
			if (!event.filterCard({ name: "sha" }, player, event) && !event.filterCard({ name: "shan" }, player, event)) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.group == "wu";
			});
		},
		check(event, player) {
			if (get.damageEffect(player, event.player, player) >= 0) {
				return false;
			}
			return true;
		},
		content() {
			"step 0";
			event.targets = game.filterPlayer();
			"step 1";
			var target = event.targets.shift();
			event.target = target;
			if (!target) {
				event.finish();
			} else if (!target.isIn() || target == player) {
				event.redo();
			} else if (target.group == "wu") {
				if ((target == game.me && !_status.auto) || get.attitude(target, player) > 2 || target.isOnline()) {
					player.storage.jsrgbashiing = true;
					var list = ["sha", "shan"].filter(name => trigger.filterCard({ name: name }, player, trigger));
					var names = list.map(i => "【" + get.translation(i) + "】").join("或");
					var next = target.chooseToRespond("是否替" + get.translation(player) + "打出一张" + names + "？", { name: list });
					next.set("ai", function () {
						var event = _status.event;
						return get.attitude(event.player, event.source) - 2;
					});
					next.set("skillwarn", "替" + get.translation(player) + "打出一张" + names);
					next.autochoose = function () {
						if (!lib.filter.autoRespondSha.apply(this, arguments)) {
							return false;
						}
						return lib.filter.autoRespondShan.apply(this, arguments);
					};
					next.set("source", player);
				}
			}
			"step 2";
			delete player.storage.jsrgbashiing;
			if (result.bool) {
				event.finish();
				var name = result.card.name;
				trigger.result = { bool: true, card: { name: name, isCard: true } };
				trigger.responded = true;
				trigger.animate = false;
				if (typeof target.ai.shown == "number" && target.ai.shown < 0.95) {
					target.ai.shown += 0.3;
					if (target.ai.shown > 0.95) {
						target.ai.shown = 0.95;
					}
				}
			} else {
				event.goto(1);
			}
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "use") {
					return false;
				}
				if (player.storage.jsrgbashiing) {
					return false;
				}
				if (!player.hasZhuSkill("jsrgbashi")) {
					return false;
				}
				return game.hasPlayer(function (current) {
					return current != player && current.group == "wu";
				});
			},
		},
	},
	//许攸
	jsrglipan: {
		forbid: ["guozhan"],
		trigger: {
			player: "phaseEnd",
		},
		async cost(event, trigger, player) {
			let list = lib.group.slice();
			list.remove(player.group);
			let getV = function (group) {
				let val = 1;
				if (group == "wei" || group == "qun") {
					val++;
				}
				game.countPlayer(current => {
					if (current.group != group) {
						return false;
					}
					let att = get.attitude(player, current);
					if (att > 0) {
						val++;
					} else if (att == 0) {
						val += 0.5;
					} else {
						val--;
					}
				});
				return val;
			};
			let maxGroup = list.slice().sort((a, b) => {
				return getV(b) - getV(a);
			})[0];
			list.push("cancel2");
			const { result } = await player
				.chooseControl(list)
				.set("prompt", get.prompt(event.skill))
				.set("prompt2", "变更为另一个势力")
				.set("ai", () => {
					return _status.event.choice;
				})
				.set("choice", maxGroup);
			event.result = {
				bool: result.control != "cancel2",
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			const group = event.cost_data;
			player.popup(group + "2", get.groupnature(group, "raw"));
			await player.changeGroup(group);
			let num = game.countPlayer(current => {
				return current.group == group && current != player;
			});
			if (num > 0) {
				player.draw(num);
			}
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
			player.addTempSkill("jsrglipan_backfire");
		},
		subSkill: {
			backfire: {
				trigger: {
					player: "phaseUseEnd",
				},
				charlotte: true,
				forced: true,
				popup: false,
				filter(event, player) {
					return event._extraPhaseReason == "jsrglipan";
				},
				content() {
					"step 0";
					var targets = game.filterPlayer(current => {
						return current.group == player.group;
					});
					targets.sortBySeat();
					event.targets = targets;
					"step 1";
					var target = targets.shift();
					event.target = target;
					if (target && target.isIn() && target.canUse({ name: "juedou" }, player)) {
						target.chooseCardTarget({
							position: "hes",
							prompt: "是否将一张牌当【决斗】对" + get.translation(player) + "使用？",
							filterCard(card, player) {
								return player.canUse(get.autoViewAs({ name: "juedou" }, [card]), _status.event.getParent().player);
							},
							filterTarget(card, player, target) {
								var source = _status.event.getParent().player;
								if (target != source && !ui.selected.targets.includes(source)) {
									return false;
								}
								card = get.autoViewAs({ name: "juedou" }, [card]);
								return lib.filter.filterTarget.apply(this, arguments);
							},
							selectTarget() {
								var card = get.card(),
									player = get.player();
								if (!card) {
									return;
								}
								card = get.autoViewAs({ name: "juedou" }, [card]);
								var range = [1, 1];
								game.checkMod(card, player, range, "selectTarget", player);
								return range;
							},
							ai1(card) {
								var player = _status.event.player,
									target = _status.event.getParent().player;
								var eff = get.effect(target, get.autoViewAs({ name: "juedou" }, [card]), player, player);
								if (eff <= 0) {
									return 0;
								}
								return (player.hp == 1 ? 10 : 6) - get.value(card);
							},
							ai2(target) {
								if (target == _status.event.getParent().player) {
									return 100;
								}
								return get.effect(target, { name: "juedou" }, _status.event.player);
							},
						});
					}
					"step 2";
					if (result.bool) {
						var cards = result.cards;
						var cardx = get.autoViewAs({ name: "juedou" }, cards);
						var targets = result.targets.filter(targetx => {
							return target.canUse(cardx, targetx);
						});
						if (targets.length) {
							target.useCard(cardx, cards, targets);
						}
					}
					if (targets.length) {
						event.goto(1);
					}
				},
			},
		},
	},
	jsrgqingxi: {
		enable: "phaseUse",
		filter(event, player) {
			if (player.group != "qun") {
				return false;
			}
			return game.hasPlayer(current => lib.skill.jsrgqingxi.filterTarget("", player, current));
		},
		groupSkill: "qun",
		filterTarget(card, player, target) {
			if (target.countCards("h") >= player.countCards("h")) {
				return false;
			}
			return !player.getStorage("jsrgqingxi_used").includes(target);
		},
		content() {
			"step 0";
			player.addTempSkill("jsrgqingxi_used", "phaseUseAfter");
			player.markAuto("jsrgqingxi_used", [target]);
			var num = player.countCards("h") - target.countCards("h");
			if (num > 0) {
				player.chooseToDiscard(num, true, "轻袭：弃置" + get.cnNumber(num) + "张手牌");
			}
			"step 1";
			var card = {
				name: "sha",
				nature: "stab",
				isCard: true,
			};
			if (player.canUse(card, target, false)) {
				player.useCard(card, target, false);
			}
		},
		ai: {
			order: 8,
			result: {
				target: (player, target) => {
					let num = player.countCards("h") - target.countCards("h"),
						eff = get.effect(target, { name: "sha", nature: "stab" }, player, target),
						val = 0,
						ph = _status.event.getTempCache("jsrgqingxi_result", "ph");
					if (!ph) {
						ph = player.getCards("h").sort((a, b) => {
							return get.value(a) - get.value(b);
						});
						_status.event.putTempCache("jsrgqingxi_result", "ph", ph);
					}
					ph.slice(0, num).forEach(i => {
						val += get.value(i, player);
					});
					eff = Math.sign(eff) * Math.sqrt(Math.abs(eff));
					if (val > 2 * Math.abs(eff)) {
						return 0;
					}
					return eff / num;
				},
			},
		},
		subSkill: {
			used: {
				onremove: true,
				charlotte: true,
			},
		},
	},
	jsrgjinmie: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (player.group != "wei") {
				return false;
			}
			return game.hasPlayer(current => current.countCards("h") > player.countCards("h"));
		},
		groupSkill: "wei",
		filterTarget(card, player, target) {
			return target.countCards("h") > player.countCards("h");
		},
		content() {
			"step 0";
			var card = {
				name: "sha",
				nature: "fire",
				storage: { jsrgjinmie: target },
				isCard: true,
			};
			if (player.canUse(card, target, false)) {
				player.useCard(card, target, false);
				player.addTempSkill("jsrgjinmie_effect");
			}
		},
		ai: {
			order: 0.5,
			result: {
				target(player, target) {
					var eff = get.effect(target, { name: "sha", nature: "fire" }, player, target) / 30;
					if (!target.mayHaveShan(player, "use")) {
						eff *= 2;
					}
					var del = target.countCards("h") - player.countCards("h") + 1.5;
					eff *= Math.sqrt(del);
					return eff;
				},
			},
		},
		subSkill: {
			effect: {
				trigger: {
					source: "damageSource",
				},
				filter(event, player) {
					return event.card && event.card.storage && event.card.storage.jsrgjinmie && event.card.storage.jsrgjinmie.isIn();
				},
				forced: true,
				popup: false,
				charlotte: true,
				content() {
					"step 0";
					var target = trigger.card.storage.jsrgjinmie;
					var del = target.countCards("h") - player.countCards("h");
					if (del > 0) {
						player.line(target);
						player.discardPlayerCard(target, "h", true, del);
					}
					// else if(del<0){
					// 	player.line(target);
					// 	target.draw(-del);
					// }
				},
			},
		},
	},
	//吕布
	jsrgwuchang: {
		forbid: ["guozhan"],
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		forced: true,
		filter(event, player) {
			var cards = event.getg(player);
			if (!cards.length) {
				return false;
			}
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				return event.getl(current).cards2.length;
			});
		},
		group: "jsrgwuchang_add",
		content() {
			"step 0";
			var targets = game.filterPlayer(current => {
				if (current == player) {
					return false;
				}
				return trigger.getl(current).cards2.length;
			});
			var target = targets[0];
			player.changeGroup(target.group);
			player.popup(target.group + "2", get.groupnature(target.group, "raw"));
		},
		subSkill: {
			add: {
				trigger: {
					source: "damageBegin1",
				},
				filter(event, player) {
					if (!event.card || !["sha", "juedou"].includes(event.card.name) || event.getParent().type != "card") {
						return false;
					}
					return event.player.group == player.group;
				},
				forced: true,
				content() {
					"step 0";
					trigger.num++;
					var group = "qun";
					player.changeGroup(group);
					player.popup(group + "2", get.groupnature(group, "raw"));
				},
			},
		},
	},
	jsrgqingjiao: {
		enable: "phaseUse",
		filter(event, player) {
			if (player.group != "qun") {
				return false;
			}
			if (!player.countCards("hes")) {
				return false;
			}
			const list = player.getStorage("jsrgqingjiao_used");
			return (
				(!list.includes("tuixinzhifu") &&
					game.hasPlayer(current => {
						return current.countCards("h") > player.countCards("h");
					})) ||
				(!list.includes("chenghuodajie") &&
					game.hasPlayer(current => {
						return current.countCards("h") < player.countCards("h");
					}))
			);
		},
		groupSkill: "qun",
		position: "hes",
		filterCard: true,
		selectCard: 1,
		discard: false,
		lose: false,
		delay: false,
		filterTarget(card, player, target) {
			var mod = game.checkMod(ui.selected.cards[0], player, "unchanged", "cardEnabled2", player);
			if (!mod) {
				return false;
			}
			var del = target.countCards("h") - player.countCards("h");
			if (del == 0) {
				return false;
			}
			var name = del > 0 ? "tuixinzhifu" : "chenghuodajie";
			if (player.getStorage("jsrgqingjiao_used").includes(name)) {
				return false;
			}
			return player.canUse({ name: name, cards: ui.selected.cards }, target);
		},
		content() {
			var del = target.countCards("h") - player.countCards("h");
			var name = del > 0 ? "tuixinzhifu" : "chenghuodajie";
			player.useCard({ name: name }, target, cards);
			player.addTempSkill("jsrgqingjiao_used", "phaseUseAfter");
			player.markAuto("jsrgqingjiao_used", name);
		},
		ai: {
			order: 7,
			result: {
				player(player, target) {
					var name = target.countCards("h") > player.countCards("h") ? "tuixinzhifu" : "chenghuodajie";
					var list = [];
					if (ui.selected.cards.length) {
						list.addArray(ui.selected.cards);
					}
					var card = get.autoViewAs({ name: name }, list);
					return get.effect(target, card, player, player);
				},
			},
		},
		subSkill: {
			used: {
				onremove: true,
				charlotte: true,
			},
		},
	},
	jsrgchengxu: {
		trigger: { player: "useCard" },
		forced: true,
		locked: false,
		filter(event, player) {
			if (player.group != "shu") {
				return false;
			}
			return game.hasPlayer(current => {
				return current != player && current.group == player.group;
			});
		},
		groupSkill: "shu",
		content() {
			trigger.directHit.addArray(
				game.filterPlayer(current => {
					return current != player && current.group == player.group;
				})
			);
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return player.group == "shu" && player.group == arg.target.group;
			},
		},
	},
	//张郃
	jsrgqiongtu: {
		enable: "chooseToUse",
		groupSkill: "qun",
		viewAs: {
			name: "wuxie",
			suit: "none",
			number: null,
			isCard: true,
		},
		filter(event, player) {
			if (!player.countCards("he", card => _status.connectMode || get.type(card) != "basic")) {
				return false;
			}
			return player.group == "qun" && !player.hasSkill("jsrgqiongtu_check");
		},
		viewAsFilter(player) {
			if (!player.countCards("he", card => _status.connectMode || get.type(card) != "basic")) {
				return false;
			}
			return player.group == "qun" && !player.hasSkill("jsrgqiongtu_check");
		},
		filterCard(card) {
			return get.type(card) != "basic";
		},
		position: "he",
		popname: true,
		ignoreMod: true,
		log: false,
		precontent() {
			player.logSkill("jsrgqiongtu");
			var card = event.result.cards[0];
			event.card = card;
			event.result.card = {
				name: event.result.card.name,
				storage: { jsrgqiongtu: true },
				isCard: true,
			};
			event.result.cards = [];
			player.addToExpansion(card, player, "give").gaintag.add("jsrgqiongtu");
			player.addTempSkill("jsrgqiongtu_check");
		},
		marktext: "途",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
			delete player.storage[skill];
		},
		subSkill: {
			check: {
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					return event.card.name == "wuxie" && event.card.storage?.jsrgqiongtu;
				},
				forced: true,
				popup: false,
				charlotte: true,
				content() {
					"step 0";
					game.delayx();
					var evt = trigger.getParent(4);
					if (evt.name == "phaseJudge") {
						state = evt.cancelled;
					} else {
						state = evt._neutralized;
					}
					if (state) {
						player.draw();
					} else {
						player.changeGroup("wei");
						var cards = player.getExpansions("jsrgqiongtu");
						if (cards.length) {
							player.gain(cards, "gain2");
						}
					}
				},
			},
		},
	},
	jsrgxianzhu: {
		enable: "chooseToUse",
		filter(event, player) {
			return (
				player.group == "wei" &&
				player.hasCard(card => {
					return _status.connectMode || get.type(card) == "trick";
				}, "hs")
			);
		},
		groupSkill: "wei",
		locked: false,
		viewAs: {
			name: "sha",
			storage: { jsrgxianzhu: true },
		},
		position: "hs",
		filterCard(card) {
			return get.type(card) == "trick";
		},
		check(card) {
			var player = _status.event.player;
			var cardx = {
				name: "sha",
				storage: { jsrgxianzhu: true },
				cards: [card],
			};
			if (
				game.hasPlayer(current => {
					return player.canUse(cardx, current) && get.effect(current, card, player, player) > 0 && get.effect(current, cardx, player, player) > 0;
				})
			) {
				return 15 - get.value(card);
			}
			return 0;
		},
		onuse(links, player) {
			player.addTempSkill("jsrgxianzhu_after");
		},
		mod: {
			cardUsable(card) {
				if (card.storage && card.storage.jsrgxianzhu) {
					return Infinity;
				}
			},
		},
		subSkill: {
			after: {
				trigger: {
					global: "damageSource",
				},
				filter(event, player) {
					var targets = event.getParent(2).targets;
					if (!targets || targets.length != 1) {
						return false;
					}
					if (!event.card || !event.card.storage || !event.card.storage.jsrgxianzhu) {
						return false;
					}
					var target = event.player,
						card = event.cards[0];
					if (!target.isIn()) {
						return false;
					}
					if (get.type(card) != "trick") {
						return false;
					}
					if (!player.canUse(card, target, false)) {
						return false;
					}
					return true;
				},
				forced: true,
				charlotte: true,
				group: "jsrgxianzhu_inf",
				content() {
					var card = {
						name: trigger.cards[0].name,
						isCard: true,
					};
					player.useCard(card, trigger.player, false);
					game.delayx();
				},
			},
			inf: {
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if (event.card.storage && event.card.storage.jsrgxianzhu && event.addCount !== false) {
						return true;
					}
					return false;
				},
				content() {
					trigger.addCount = false;
					var stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
				},
			},
		},
	},
	//邹氏
	jsrgguyin: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		check(event, player) {
			return player.isTurnedOver() || game.countPlayer2(current => current.hasSex("male")) >= 2;
		},
		content() {
			"step 0";
			player.turnOver();
			"step 1";
			var targets = game.filterPlayer(current => current != player && current.hasSex("male"));
			event.targets = targets;
			player.line(targets);
			game.delayx();
			"step 2";
			var target = targets.shift();
			event.target = target;
			target
				.chooseBool("是否响应" + get.translation(player) + "的【孤吟】？", "你可以翻面。")
				.set("ai", () => {
					return _status.event.bool;
				})
				.set(
					"bool",
					(function () {
						return target.isTurnedOver() || (get.attitude(target, player) > 0 && (game.countPlayer2(current => current.hasSex("male")) >= 3 || (target.getHp() <= 1 && player.hasSkill("jsrgzhangdeng"))));
					})()
				);
			"step 3";
			if (result.bool) {
				target.turnOver();
			}
			if (targets.length) {
				event.goto(2);
			}
			"step 4";
			var targets = game.filterPlayer(current => {
				return current == player || current.isTurnedOver();
			});
			event.targets = targets;
			event.num = 0;
			event.index = 0;
			"step 5";
			var target = targets[event.index];
			if (target.isIn()) {
				target.draw();
				event.num++;
			}
			event.index++;
			if (event.index >= targets.length) {
				event.index = 0;
			}
			"step 6";
			if (event.num >= game.countPlayer2(current => current.hasSex("male"))) {
				event.finish();
			} else {
				event.goto(5);
			}
		},
	},
	jsrgzhangdeng: {
		trigger: {
			global: "logSkill",
		},
		filter(event, player) {
			return (
				event.player
					.getHistory("useSkill", evt => {
						return evt.skill == "jsrgzhangdeng_jiu";
					})
					.map(evt => evt.event)
					.indexOf(event.log_event) == 1
			);
		},
		global: "jsrgzhangdeng_jiu",
		forced: true,
		locked: false,
		content() {
			player.turnOver(false);
		},
		ai: { combo: "jsrgguyin" },
		subSkill: {
			jiu: {
				audio: "jsrgzhangdeng",
				enable: "chooseToUse",
				filter(event, player) {
					return (
						player.isTurnedOver() &&
						game.hasPlayer(current => {
							return current.hasSkill("jsrgzhangdeng") && current.isTurnedOver();
						})
					);
				},
				viewAs: { name: "jiu", isCard: true },
				viewAsFilter(player) {
					return (
						player.isTurnedOver() &&
						game.hasPlayer(current => {
							return current.hasSkill("jsrgzhangdeng") && current.isTurnedOver();
						})
					);
				},
				filterCard: () => false,
				log: false,
				selectCard: -1,
				precontent() {
					player.logSkill("jsrgzhangdeng_jiu");
					var targets = game.filterPlayer(current => {
						return current.hasSkill("jsrgzhangdeng") && current.isTurnedOver();
					});
					player.line(targets[0]);
				},
			},
		},
	},
	//关羽
	jsrgguanjue: {
		trigger: {
			player: ["useCard", "respond"],
		},
		filter(event, player) {
			return lib.suit.includes(get.suit(event.card));
		},
		forced: true,
		content() {
			"step 0";
			var targets = game.filterPlayer(current => current != player);
			var suit = get.suit(trigger.card);
			for (var target of targets) {
				target.addTempSkill("jsrgguanjue_ban");
				target.markAuto("jsrgguanjue_ban", [suit]);
			}
		},
		subSkill: {
			ban: {
				onremove: true,
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("jsrgguanjue_ban").includes(get.suit(card))) {
							return false;
						}
					},
					cardRespondable(card, player) {
						if (player.getStorage("jsrgguanjue_ban").includes(get.suit(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (player.getStorage("jsrgguanjue_ban").includes(get.suit(card))) {
							return false;
						}
					},
				},
				mark: true,
				marktext: "绝",
				intro: {
					content: "本回合内不能使用或打出$的牌",
				},
			},
		},
	},
	jsrgnianen: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countCards("hes")) {
				return false;
			}
			for (var name of lib.inpile) {
				if (get.type2(name) != "basic") {
					continue;
				}
				var card = { name: name };
				if (event.filterCard(get.autoViewAs(card, "unsure"), player, event)) {
					return true;
				}
				if (name == "sha") {
					for (var nature of lib.inpile_nature) {
						card.nature = nature;
						if (event.filterCard(get.autoViewAs(card, "unsure"), player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		derivation: "mashu",
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of lib.inpile) {
					if (name == "sha") {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
							list.push(["基本", "", "sha"]);
						}
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
								list.push(["基本", "", "sha", nature]);
							}
						}
					} else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["基本", "", name]);
					}
				}
				var dialog = ui.create.dialog("念恩", [list, "vcard"]);
				dialog.direct = true;
				return dialog;
			},
			filter(button, player) {
				return _status.event.getParent().filterCard(get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure"), player, _status.event.getParent());
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				var player = _status.event.player;
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) {
					return 0;
				}
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "jsrgnianen",
					filterCard: true,
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
					log: false,
					precontent() {
						player.logSkill("jsrgnianen");
						var card = event.result.card;
						if (get.color(card, player) != "red" || get.name(card) != "sha" || get.natureList(card).length) {
							player.tempBanSkill("jsrgnianen");
							player.addTempSkill("jsrgnianen_blocker");
							player.addAdditionalSkill("jsrgnianen_blocker", "mashu");
						}
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			var type = get.type2(name);
			return type == "basic" && player.countCards("hes") > 0 && !player.isTempBanned("jsrgnianen");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countCards("hes") || player.isTempBanned("jsrgnianen")) {
					return false;
				}
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
		subSkill: {
			blocker: {
				charlotte: true,
				mark: true,
				marktext: "恩",
				intro: { content: "视为拥有〖马术〗" },
			},
		},
	},
	//生鱼片
	jsrglunshi: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return game.hasPlayer(current => {
				return current.inRangeOf(target);
			});
		},
		content() {
			"step 0";
			var num = game.countPlayer(current => {
				return current.inRangeOf(target);
			});
			var len = target.countCards("h");
			num = Math.max(0, Math.min(len + num, 5) - len);
			if (num > 0) {
				target.draw(num);
			}
			"step 1";
			var num = game.countPlayer(current => {
				return current.inRange(target);
			});
			if (num > 0) {
				target.chooseToDiscard(num, "he", true, get.translation(player) + "对你发动了【论势】", "请弃置" + get.cnNumber(num) + "张牌");
			}
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					var num1 = game.countPlayer(current => {
							return current.inRangeOf(target);
						}),
						num2 = game.countPlayer(current => {
							return current.inRange(target);
						});
					var len = target.countCards("h");
					num1 = Math.max(0, Math.min(len + num1, 5) - len);
					return (num1 - num2 + 1) / 2;
				},
			},
		},
	},
	jsrgguitu: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		direct: true,
		filter(event, player) {
			return (
				game.countPlayer(current => {
					return current.getEquips(1).length;
				}) >= 2
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(
					get.prompt2("jsrgguitu"),
					(card, player, target) => {
						return target.getEquips(1).length;
					},
					[1, 2]
				)
				.set("filterOk", () => {
					var num = 0;
					for (var target of ui.selected.targets) {
						num += target.getEquips(1).length;
					}
					return num >= 2;
				})
				.set("ai", target => {
					var sign = -1;
					var val = 0;
					if (ui.selected.targets.length) {
						sign = 1;
						var targetx = ui.selected.targets[0];
						var cards = targetx.getEquips(1);
						var list = cards.map(card => {
							return [card, get.value(card, targetx)];
						});
						list.sort((a, b) => {
							return b[1] - a[1];
						});
						val = get.attitude(_status.event.player, targetx) * list[0][1];
					}
					var cards = target.getEquips(1);
					var list = cards.map(card => {
						return [card, get.value(card, target)];
					});
					list.sort((a, b) => {
						return b[1] - a[1];
					});
					return get.attitude(_status.event.player, target) * list[0][1] * sign - val;
				});
			"step 1";
			if (result.bool) {
				var targets = result.targets.slice();
				targets.sortBySeat();
				event.targets = targets;
				player.logSkill("jsrgguitu", targets);
				event.rangeList = targets.map(target => {
					return target.getAttackRange();
				});
				var weapons = [];
				for (var target of targets) {
					weapons.addArray(target.getEquips(1));
				}
				if (weapons.length > 2) {
					var list = ["诡图：选择要交换的武器牌"];
					for (var target of targets) {
						list.addArray(['<div class="text center">' + get.translation(target) + "的武器牌</div>", target.getEquips(1)]);
					}
					player
						.chooseButton(list, true, 2)
						.set("filterButton", button => {
							var count = _status.event.count;
							if (count == 1) {
								return true;
							}
							for (var i = 0; i < ui.selected.buttons.length; i++) {
								if (get.owner(button.link) == get.owner(ui.selected.buttons[i].link)) {
									return false;
								}
							}
							return true;
						})
						.set("count", targets.length)
						.set("ai", button => {
							var player = _status.event.player;
							var card = button.link;
							var owner = get.owner(card);
							var att = get.attitude(player, owner);
							var val = -get.value(card) * att;
							return val;
						});
				} else {
					event._result = { bool: true, links: weapons };
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var links = result.links;
				var list = [];
				for (var target of targets) {
					var weapons = target.getEquips(1);
					weapons = weapons.filter(i => links.includes(i));
					if (weapons.length) {
						list.push([target, weapons]);
					}
				}
				if (list.length == 2) {
					event.players = list.map(i => i[0]);
					event.cards = list.map(i => i[1]);
				} else {
					event.players = [list[0][0], list[0][0]];
					event.cards = list[0][1];
				}
				game.loseAsync({
					player: event.players[0],
					target: event.players[1],
					cards1: event.cards[0],
					cards2: event.cards[1],
				}).setContent("swapHandcardsx");
			} else {
				event.finish();
			}
			"step 3";
			for (var i = 0; i < event.cards[1].length; i++) {
				if (get.position(event.cards[1][i], true) == "o") {
					event.players[0].equip(event.cards[1][i]);
				}
			}
			for (var i = 0; i < event.cards[0].length; i++) {
				if (get.position(event.cards[0][i], true) == "o") {
					event.players[1].equip(event.cards[0][i]);
				}
			}
			"step 4";
			var rangeList = targets.map(target => {
				return target.getAttackRange();
			});
			for (var i = 0; i < targets.length; i++) {
				if (rangeList[i] < event.rangeList[i]) {
					targets[i].recover();
				}
			}
		},
	},
	//甄宓
	jsrgjixiang: {
		trigger: {
			global: ["chooseToUseBegin", "chooseToRespondBegin"],
		},
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			if (player == event.player) {
				return false;
			}
			if (!player.countCards("he")) {
				return false;
			}
			return get.inpileVCardList(info => {
				const name = info[2],
					nature = info[3];
				if (info[0] != "basic") {
					return false;
				}
				const card = { name: name, isCard: true };
				if (player.getStorage("jsrgjixiang_record").includes(name)) {
					return false;
				}
				return event.filterCard(card, event.player, event);
			}).length;
		},
		global: "jsrgjixiang_save",
		async cost(event, trigger, player) {
			const list = get.inpileVCardList(info => {
				const name = info[2],
					nature = info[3];
				if (info[0] != "basic") {
					return false;
				}
				const card = { name: name };
				if (player.getStorage("jsrgjixiang_record").includes(name)) {
					return false;
				}
				return trigger.filterCard(card, trigger.player, trigger);
			});
			if (!list.length) {
				return;
			}
			const evt = trigger.getParent();
			const listx = list.map(i => i[2]).toUniqued();
			let names = "";
			for (let i = 0; i < listx.length; i++) {
				names += "【" + get.translation(listx[i]) + "】";
				names += i < listx.length - 2 ? "、" : "或";
			}
			names = names.slice(0, names.length - 1);
			const reason = trigger.name == "chooseToUse" ? "使用" : "打出";
			const used = player.getStorage("jsrgjixiang_record").filter(name => listx.includes(name));
			let str = get.translation(trigger.player) + (evt.card ? "因" + get.translation(evt.card) : "") + "需要" + reason + "一张" + names + "，是否弃置一张牌视为其" + reason + "之" + (used.length ? "（你不能以此法令其" + reason + get.translation(used) + "）" : "") + "？若如此做，你摸一张牌并令〖称贤〗此阶段可发动次数上限+1。";
			event.str = str;
			let result;
			if (list.length == 1) {
				result = { bool: true, links: list };
			} else {
				event.asked = true;
				result = await player
					.chooseButton(["###" + get.prompt(event.skill, trigger.player) + '###<div class="text center">' + str + "</div>", [list, "vcard"]])
					.set("ai", () => Math.random() + 1)
					.forResult();
			}
			if (!result.bool) {
				return;
			}
			event.list = list;
			const name = result.links[0][2],
				nature = result.links[0][3];
			const card = { name: name, nature: nature, isCard: true },
				prompt = event.asked ? "济乡：是否弃置一张牌" + (trigger.filterTarget ? "并选择目标角色" : "") + "？" : get.prompt("jsrgjixiang", trigger.player);
			str = event.asked ? "若如此做，视为" + get.translation(trigger.player) + reason + get.translation(card) + "，然后你摸一张牌并令〖称贤〗此阶段可发动次数上限+1。" : event.str;
			const next = player.chooseCardTarget({
				prompt: prompt,
				prompt2: str,
				filterCard: lib.filter.cardDiscardable,
				position: "he",
				goon: get.attitude(player, trigger.player) > 1 && (evt.card ? get.effect(trigger.player, evt.card, evt.player, player) < 0 : get.effect(trigger.player, { name: event.list[0][2] }, trigger.player, player) > 0),
				ai1(card) {
					if (_status.event.goon) {
						return 6 - get.value(card);
					}
					return 0;
				},
				_get_card: card,
			});
			var keys = ["filterTarget", "selectTarget", "ai2"];
			for (var key of keys) {
				delete next[key];
			}
			for (var i in trigger) {
				if (!(i in next)) {
					next[i] = trigger[i];
				}
			}
			next.filterTargetx = trigger.filterTarget || (() => false);
			next.filterTarget = function (card, player, target) {
				var filter = this.filterTargetx;
				if (typeof filter != "function") {
					filter = () => filter;
				}
				card = _status.event._get_card;
				player = _status.event.getTrigger().player;
				return this.filterTargetx.apply(this, arguments);
			};
			if (typeof next.selectTarget != "number" && typeof next.selectTarget != "function" && get.itemtype(next.selectTarget) != "select") {
				next.selectTarget = -1;
			}
			const { result: result2 } = await next;
			event.result = {
				bool: result2.bool,
				cards: result2.cards,
				targets: result2.targets,
				cost_data: card,
			};
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const card = event.cost_data,
				cardx = event.cards[0];
			const targets = event.targets || [];
			event.targets = targets;
			player.addTempSkill("jsrgjixiang_record");
			player.markAuto("jsrgjixiang_record", [card.name]);
			await player.discard(cardx);
			trigger.untrigger();
			trigger.set("responded", true);
			const result = {
				bool: true,
				card: card,
			};
			if (targets.length) {
				result.targets = targets;
			}
			trigger.result = result;
			await player.draw();
			let phaseName;
			for (const name of lib.phaseName) {
				const evt = trigger.getParent(name);
				if (!evt || evt.name != name) {
					continue;
				}
				phaseName = name;
				break;
			}
			if (phaseName) {
				player.addTempSkill("jsrgjixiang_add", phaseName + "After");
				player.addMark("jsrgjixiang_add", 1, false);
			}
		},
		subSkill: {
			record: {
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "乡",
				intro: {
					content: "已触发过牌名：$",
				},
			},
			add: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: {
					markcount: (storage, player) => storage || 0,
					content: (storage, player) => "〖称贤〗可发动次数+" + (storage || 0),
				},
			},
			save: {
				charlotte: true,
				ai: {
					save: true,
					skillTagFilter(player, arg, target) {
						return _status.currentPhase && _status.currentPhase != player && _status.currentPhase.hasSkill("jsrgjixiang") && _status.currentPhase.countCards("he");
					},
				},
			},
		},
	},
	jsrgchengxian: {
		getVCards(event, player) {
			return get.inpileVCardList(info => {
				if (info[0] != "trick") {
					return false;
				}
				const name = info[2],
					nature = info[3],
					infox = get.info({ name: name });
				if (!infox || infox.notarget || !infox.selectTarget) {
					return false;
				}
				if (player.getStorage("jsrgchengxian").includes(name)) {
					return false;
				}
				if (
					!player.hasCard(card => {
						const num = game.countPlayer(current => {
							return player.canUse(card, current);
						});
						if (!num) {
							return false;
						}
						const cardx = { name: name, nature: nature };
						cardx.cards = [card];
						const num2 = game.countPlayer(current => {
							return player.canUse(cardx, current);
						});
						return num == num2;
					}, "hs")
				) {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: name, nature: nature }, "unsure"), player, event);
			});
		},
		enable: "phaseUse",
		usable(skill, player) {
			return 2 + player.countMark("jsrgjixiang_add");
		},
		filter(event, player) {
			if (!player.countCards("hs")) {
				return false;
			}
			return get.info("jsrgchengxian").getVCards(event, player).length;
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.info("jsrgchengxian").getVCards(event, player);
				return ui.create.dialog("称贤", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				const player = _status.event.player;
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan"].includes(button.link[2])) {
					return 0;
				}
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "jsrgchengxian",
					filterCard(card, player) {
						const num = game.countPlayer(current => {
							return player.canUse(card, current);
						});
						if (!num) {
							return false;
						}
						const cardx = get.copy(lib.skill.jsrgchengxian_backup.viewAs);
						cardx.cards = [card];
						const num2 = game.countPlayer(current => {
							return player.canUse(cardx, current);
						});
						return num == num2;
					},
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					position: "hs",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.logSkill("jsrgchengxian");
						if (!player.storage.jsrgchengxian) {
							player.when({ global: "phaseAfter" }).then(() => {
								player.unmarkSkill("jsrgchengxian");
							});
						}
						player.markAuto("jsrgchengxian", event.result.card.name);
					},
				};
			},
			prompt(links, player) {
				return "将一张合法目标数与" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "相同的手牌当此牌使用";
			},
		},
		//理解错了，下面这个不用了
		getNumber(card, player) {
			var rangex = null;
			var info = get.info(card);
			if (!info) {
				return null;
			}
			if (info.notarget) {
				return null;
			}
			if (info.selectTarget != undefined) {
				var select = get.select(info.selectTarget);
				if (select[0] < 0) {
					if (!info.toself) {
						var count = game.countPlayer(current => {
							return lib.filter.targetEnabled(card, player, current);
						});
					} else {
						count = 1;
					}
					rangex = [count, count];
				} else {
					rangex = select;
				}
			}
			return rangex;
		},
		marktext: "贤",
		intro: {
			content: "本回合已因〖称贤〗使用过$",
			onunmark: true,
		},
		ai: {
			order: 6,
			result: {
				player: 1,
			},
		},
	},
	//张辽
	jsrgzhengbing: {
		enable: "phaseUse",
		usable: 3,
		filter(event, player) {
			return player.group == "qun";
		},
		filterCard: lib.filter.cardRecastable,
		check(card) {
			var player = _status.event.player,
				val = 5 + ["shan", "tao"].includes(get.name(card)) * 1.5;
			if (player.needsToDiscard() > 2 && get.name(card) == "sha" && player.countCards("hs", "sha") > 1) {
				val += 0.5;
			}
			return val - get.value(card);
		},
		position: "he",
		groupSkill: "qun",
		lose: false,
		discard: false,
		delay: false,
		content() {
			"step 0";
			player.recast(cards);
			switch (get.name(cards[0])) {
				case "sha":
					player.addTempSkill("jsrgzhengbing_sha");
					player.addMark("jsrgzhengbing_sha", 2, false);
					break;
				case "shan":
					player.draw();
					break;
				case "tao":
					player.changeGroup("wei");
			}
		},
		ai: {
			order: 7,
			result: { player: 1 },
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("jsrgzhengbing_sha");
					},
				},
				intro: {
					content: "手牌上限+#",
				},
			},
		},
	},
	jsrgtuwei: {
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return (
				player.group == "wei" &&
				game.hasPlayer(current => {
					return player.inRange(current) && current.countGainableCards(player, "he") > 0;
				})
			);
		},
		groupSkill: "wei",
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(
					get.prompt("jsrgtuwei"),
					"获得攻击范围内任意名角色的各一张牌。然后回合结束时这些角色中未受过伤害的角色依次获得你的一张牌。",
					(card, player, target) => {
						return player.inRange(target) && target.countGainableCards(player, "he") > 0;
					},
					[1, Infinity]
				)
				.set("ai", target => {
					var player = _status.event.player;
					return get.effect(target, { name: "shunshou_copy2" }, player, player);
				});
			"step 1";
			if (result.bool) {
				var targets = result.targets.slice();
				targets.sortBySeat();
				player.logSkill("jsrgtuwei", targets);
				player.gainMultiple(result.targets, "he");
				player.addTempSkill("jsrgtuwei_backfire");
				player.markAuto("jsrgtuwei_backfire", targets);
			}
		},
		subSkill: {
			backfire: {
				audio: "jsrgtuwei",
				trigger: {
					player: "phaseEnd",
				},
				charlotte: true,
				onremove: true,
				forced: true,
				filter(event, player) {
					return player.getStorage("jsrgtuwei_backfire").some(target => {
						return !target.getHistory("damage").length && target.isIn();
					});
				},
				content() {
					"step 0";
					var targets = player.getStorage("jsrgtuwei_backfire").filter(target => {
						return !target.getHistory("damage").length && target.isIn();
					});
					event.targets = targets.sortBySeat();
					"step 1";
					var target = targets.shift();
					if (target.isIn() && player.countGainableCards(target, "he")) {
						target.line(player);
						target.gainPlayerCard(player, true, "he");
					}
					if (player.countCards("he") && targets.length) {
						event.redo();
					}
				},
				ai: {
					effect: {
						player(card, player, target) {
							if (player != target && get.tag(card, "damage") && target && player.getStorage("jsrgtuwei_backfire").includes(target) && !target.getHistory("damage").length) {
								return [1, 1, 1, 0];
							}
						},
					},
				},
			},
		},
	},
	//许贡
	jsrgbiaozhao: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.countPlayer(current => current != player) >= 2;
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("jsrgbiaozhao"), lib.filter.notMe, 2)
				.set("ai", target => {
					var player = _status.event.player;
					var att = get.attitude(player, target);
					if (!ui.selected.targets.length) {
						return att * (Math.sqrt(target.countCards("hs")) + 0.1);
					}
					return -att / Math.sqrt(target.countCards("hs") + 0.1);
				})
				.set("targetprompt", ["用牌无限制", "打你变疼"]);
			"step 1";
			if (result.bool) {
				var targets = result.targets;
				player.logSkill("jsrgbiaozhao", targets);
				player.addTempSkill("jsrgbiaozhao_syujin", { player: ["phaseBegin", "die"] });
				if (!player.storage.jsrgbiaozhao_syujin) {
					player.storage.jsrgbiaozhao_syujin = [];
				}
				player.storage.jsrgbiaozhao_syujin.push(targets);
				targets[0].addSkill("jsrgbiaozhao_A");
				targets[0].markAuto("jsrgbiaozhao_A", [targets[1]]);
				targets[1].addSkill("jsrgbiaozhao_B");
				targets[1].addMark("jsrgbiaozhao_B" + player.playerid, 1, false);
				targets[1].markAuto("jsrgbiaozhao_B", [player]);
			}
		},
		subSkill: {
			syujin: {
				charlotte: true,
				onremove(player, skill) {
					var list = player.storage.jsrgbiaozhao_syujin;
					for (var targets of list) {
						targets[0].unmarkAuto("jsrgbiaozhao_A", [targets[1]]);
						targets[1].unmarkAuto("jsrgbiaozhao_B", [player]);
						delete targets[1].storage["jsrgbiaozhao_B" + player.playerid];
						if (!targets[0].getStorage("jsrgbiaozhao_A")) {
							targets[0].removeSkill("jsrgbiaozhao_A");
						}
						if (!targets[1].getStorage("jsrgbiaozhao_B")) {
							targets[1].removeSkill("jsrgbiaozhao_B");
						}
					}
					delete player.storage.jsrgbiaozhao_syujin;
				},
			},
			A: {
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "表",
				intro: {
					content: "对$使用牌无次数和距离限制",
				},
				mod: {
					targetInRange(card, player, target) {
						if (player.getStorage("jsrgbiaozhao_A").includes(target)) {
							return true;
						}
					},
					cardUsableTarget(card, player, target) {
						if (player.getStorage("jsrgbiaozhao_A").includes(target)) {
							return true;
						}
					},
				},
			},
			B: {
				trigger: {
					source: "damageBegin1",
				},
				charlotte: true,
				forced: true,
				onremove(player, skill) {
					for (var i in player.storage) {
						if (i.indexOf("jsrgbiaozhao_B") == 0) {
							delete player.storage[i];
						}
					}
				},
				filter(event, player) {
					return event.card && player.getStorage("jsrgbiaozhao_B").includes(event.player);
				},
				content() {
					trigger.num += player.countMark("jsrgbiaozhao_B" + trigger.player.playerid) || 1;
				},
				mark: true,
				marktext: "召",
				intro: {
					content(storage, player) {
						var str = "";
						for (var target of storage) {
							str += "对" + get.translation(target) + "使用牌造成的伤害+" + player.countMark("jsrgbiaozhao_B" + target.playerid);
						}
						return str;
					},
				},
			},
		},
	},
	jsrgyechou: {
		trigger: { player: "die" },
		forceDie: true,
		direct: true,
		skillAnimation: true,
		animationColor: "wood",
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("jsrgyechou"), lib.filter.notMe).set("ai", target => {
				var player = _status.event.player;
				return -get.attitude(player, target);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("jsrgyechou", target);
				target.addSkill("jsrgyechou_effect");
				target.addMark("jsrgyechou_effect", 1, false);
			}
		},
		subSkill: {
			effect: {
				trigger: {
					player: "damageBegin3",
				},
				filter(event, player) {
					return event.num >= player.getHp();
				},
				forced: true,
				charlotte: true,
				onremove: true,
				content() {
					trigger.num *= 2 * player.countMark("jsrgyechou_effect");
				},
				mark: true,
				marktext: "仇",
				intro: {
					content: "当你受到伤害值不小于体力值的伤害时，此伤害翻&倍",
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) {
									return [1, -2];
								}
								if (target.hp == 1) {
									return 2;
								}
							}
						},
					},
				},
			},
		},
	},
	//淳于琼
	jsrgcangchu: {
		audio: "recangchu",
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			return player.getHistory("gain").length;
		},
		direct: true,
		content() {
			"step 0";
			var num = 0;
			player.getHistory("gain", evt => {
				num += evt.cards.length;
			});
			event.num = num;
			player.chooseTarget(get.prompt("jsrgcangchu"), "令至多" + get.cnNumber(num) + "名角色各摸" + get.cnNumber(num > game.countPlayer() ? 2 : 1) + "张牌", [1, num]).set("ai", target => {
				var player = _status.event.player;
				return get.attitude(player, target) / Math.sqrt(target.countCards("hs") + 1);
			});
			"step 1";
			if (result.bool) {
				var targets = result.targets.slice();
				targets.sortBySeat();
				player.logSkill("jsrgcangchu", targets);
				game.asyncDraw(targets, num > game.countPlayer() ? 2 : 1);
				game.delayex();
			}
		},
	},
	jsrgshishou: {
		audio: "reshishou",
		trigger: {
			player: "useCard",
		},
		forced: true,
		filter(event, player) {
			return event.card.name == "jiu";
		},
		group: "jsrgshishou_burn",
		content() {
			"step 0";
			player.draw(3);
			player.addTempSkill("jsrgshishou_nouse");
		},
		mod: {
			aiOrder(player, card, num) {
				if (card.name == "jiu") {
					return 0.01;
				}
			},
		},
		ai: {
			halfneg: true,
			effect: {
				player_use(card, player, target) {
					if (card.name == "jiu") {
						return [1, 1];
					}
				},
			},
		},
		subSkill: {
			nouse: {
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						return false;
					},
					cardUsable(card, player) {
						return false;
					},
					cardSavable(card, player) {
						return false;
					},
				},
				mark: true,
				marktext: "失",
				intro: {
					content: "喝醉了，不能再使用牌",
				},
			},
			burn: {
				audio: "reshishou",
				trigger: {
					player: "damageEnd",
				},
				forced: true,
				filter(event, player) {
					return event.hasNature("fire");
				},
				content() {
					player.tempBanSkill("jsrgcangchu", { player: "phaseEnd" });
					player.addTempSkill("jsrgshishou_blocker", { player: "phaseEnd" });
				},
			},
			blocker: {
				charlotte: true,
				mark: true,
				marktext: "守",
				intro: {
					content: "〖仓储〗失效直到下回合结束",
				},
			},
		},
	},
	//江山如故·起
	sbyingmen: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content() {
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			var characters = _status.characterlist.randomRemove(4);
			lib.skill.sbyingmen.addVisitors(characters, player);
			game.delayx();
		},
		ai: {
			combo: "sbpingjian",
		},
		group: "sbyingmen_reload",
		subSkill: {
			reload: {
				trigger: { player: "phaseBegin" },
				forced: true,
				locked: false,
				filter(event, player) {
					return player.getStorage("sbyingmen").length < 4;
				},
				content() {
					if (!_status.characterlist) {
						game.initCharacterList();
					}
					var characters = _status.characterlist.randomRemove(4 - player.getStorage("sbyingmen").length);
					lib.skill.sbyingmen.addVisitors(characters, player);
					game.delayx();
				},
			},
		},
		getSkills(characters, player) {
			var skills = [];
			for (var name of characters) {
				if (Array.isArray(get.character(name).skills)) {
					for (var skill of get.character(name).skills) {
						var list = get.skillCategoriesOf(skill, player);
						list.remove("锁定技");
						if (list.length > 0) {
							continue;
						}
						var info = get.info(skill);
						if (info && (!info.unique || info.gainable)) {
							// lib.skill.rehuashen.createAudio(name,skill,'jsrg_xushao');
							skills.add(skill);
						}
					}
				}
			}
			return skills;
		},
		addVisitors(characters, player) {
			player.addSkillBlocker("sbyingmen");
			game.log(player, "将", "#y" + get.translation(characters), "加入了", "#g“访客”");
			game.broadcastAll(
				function (player, characters) {
					player.tempname.addArray(characters);
					player.$draw(
						characters.map(function (name) {
							var cardname = "huashen_card_" + name;
							lib.card[cardname] = {
								fullimage: true,
								image: "character:" + name,
							};
							lib.translate[cardname] = get.rawName2(name);
							return game.createCard(cardname, " ", " ");
						}),
						"nobroadcast"
					);
				},
				player,
				characters
			);
			player.markAuto("sbyingmen", characters);
			var storage = player.getStorage("sbyingmen");
			var skills = lib.skill.sbyingmen.getSkills(storage, player);
			player.addInvisibleSkill(skills);
		},
		removeVisitors(characters, player) {
			var skills = lib.skill.sbyingmen.getSkills(characters, player);
			var characters2 = player.getStorage("sbyingmen").slice(0);
			characters2.removeArray(characters);
			skills.removeArray(lib.skill.sbyingmen.getSkills(characters2, player));
			game.broadcastAll((player, characters) => player.tempname.removeArray(characters), player, characters);
			player.unmarkAuto("sbyingmen", characters);
			_status.characterlist.addArray(characters);
			player.removeInvisibleSkill(skills);
		},
		onremove(player, skill) {
			lib.skill.sbyingmen.removeVisitors(player.getStorage("sbyingmen"), player);
			player.removeSkillBlocker("sbyingmen");
		},
		skillBlocker(skill, player) {
			if (!player.invisibleSkills.includes(skill) || skill == "sbpingjian" || skill == "sbpingjian") {
				return false;
			}
			return !player.hasSkill("sbpingjian");
		},
		marktext: "客",
		intro: {
			name: "访客",
			mark(dialog, storage, player) {
				if (!storage || !storage.length) {
					return "当前没有“访客”";
				}
				dialog.addSmall([storage, "character"]);
				var skills = lib.skill.sbyingmen.getSkills(storage, player);
				if (skills.length) {
					dialog.addText("<li>当前可用技能：" + get.translation(skills), false);
				}
			},
		},
	},
	sbpingjian: {
		trigger: { player: ["useSkill", "logSkillBegin"] },
		forced: true,
		locked: false,
		filter(event, player) {
			var skill = get.sourceSkillFor(event);
			return player.invisibleSkills.includes(skill) && lib.skill.sbyingmen.getSkills(player.getStorage("sbyingmen"), player).includes(skill);
		},
		content() {
			"step 0";
			var visitors = player.getStorage("sbyingmen").slice(0);
			var drawers = visitors.filter(function (name) {
				return get.character(name).skills?.includes(get.sourceSkillFor(trigger));
			});
			event.drawers = drawers;
			if (visitors.length == 1) {
				event._result = { bool: true, links: visitors };
			} else {
				var dialog = ["评鉴：请选择移去一张“访客”"];
				if (drawers.length) {
					dialog.push('<div class="text center">如果移去' + get.translation(drawers) + "，则你摸一张牌</div>");
				}
				dialog.push([visitors, "character"]);
				player.chooseButton(dialog, true);
			}
			"step 1";
			if (result.bool) {
				lib.skill.sbyingmen.removeVisitors(result.links, player);
				game.log(player, "移去了", "#y" + get.translation(result.links[0]));
				if (event.drawers.includes(result.links[0])) {
					player.addTempSkill("sbpingjian_draw");
					player.storage.sbpingjian_draw.push(trigger.skill);
				}
			}
		},
		group: "sbpingjian_trigger",
		subSkill: {
			draw: {
				charlotte: true,
				init(player, skill) {
					if (!player.storage[skill]) {
						player.storage[skill] = [];
					}
				},
				onremove: true,
				trigger: { player: ["useSkillAfter", "logSkill"] },
				forced: true,
				popup: false,
				filter(event, player) {
					return player.getStorage("sbpingjian_draw").includes(event.skill);
				},
				content() {
					player.storage.sbpingjian_draw.remove(trigger.skill);
					player.draw();
					if (!player.storage.sbpingjian_draw.length) {
						player.removeSkill("sbpingjian_draw");
					}
				},
			},
			trigger: {
				trigger: { player: "triggerInvisible" },
				forced: true,
				forceDie: true,
				popup: false,
				charlotte: true,
				priority: 10,
				filter(event, player) {
					if (event.revealed) {
						return false;
					}
					var info = get.info(event.skill);
					if (info.charlotte) {
						return false;
					}
					var skills = lib.skill.sbyingmen.getSkills(player.getStorage("sbyingmen"), player);
					game.expandSkills(skills);
					return skills.includes(event.skill);
				},
				content() {
					"step 0";
					if (get.info(trigger.skill).silent) {
						event.finish();
					} else {
						var info = get.info(trigger.skill);
						var event = trigger,
							trigger = event._trigger;
						var str;
						var check = info.check;
						if (info.prompt) {
							str = info.prompt;
						} else {
							if (typeof info.logTarget == "string") {
								str = get.prompt(event.skill, trigger[info.logTarget], player);
							} else if (typeof info.logTarget == "function") {
								var logTarget = info.logTarget(trigger, player, trigger.triggername, trigger.indexedData);
								if (get.itemtype(logTarget)?.indexOf("player") == 0) {
									str = get.prompt(event.skill, logTarget, player);
								}
							} else {
								str = get.prompt(event.skill, null, player);
							}
						}
						if (typeof str == "function") {
							str = str(trigger, player, trigger.triggername, trigger.indexedData);
						}
						var next = player.chooseBool("评鉴：" + str);
						next.set("yes", !info.check || info.check(trigger, player, trigger.triggername, trigger.indexedData));
						next.set("hsskill", event.skill);
						next.set("forceDie", true);
						next.set("ai", function () {
							return _status.event.yes;
						});
						if (typeof info.prompt2 == "function") {
							next.set("prompt2", info.prompt2(trigger, player, trigger.triggername, trigger.indexedData));
						} else if (typeof info.prompt2 == "string") {
							next.set("prompt2", info.prompt2);
						} else if (info.prompt2 != false) {
							if (lib.dynamicTranslate[event.skill]) {
								next.set("prompt2", lib.dynamicTranslate[event.skill](player, event.skill));
							} else if (lib.translate[event.skill + "_info"]) {
								next.set("prompt2", lib.translate[event.skill + "_info"]);
							}
						}
						if (trigger.skillwarn) {
							if (next.prompt2) {
								next.set("prompt2", '<span class="thundertext">' + trigger.skillwarn + "。</span>" + next.prompt2);
							} else {
								next.set("prompt2", trigger.skillwarn);
							}
						}
					}
					"step 1";
					if (result.bool) {
						if (!get.info(trigger.skill).cost) {
							trigger.revealed = true;
						}
					} else {
						trigger.untrigger();
						trigger.cancelled = true;
					}
				},
			},
		},
		ai: {
			combo: "sbyingmen",
		},
	},
	jsrgchaozheng: {
		audio: 4,
		trigger: { player: "phaseZhunbeiBegin" },
		logTarget(event, player) {
			return game.filterPlayer(i => i != player);
		},
		prompt: "是否发动【朝争】？",
		logAudio: index => (typeof index === "number" ? "jsrgchaozheng" + index + ".mp3" : 2),
		async content(event, trigger, player) {
			await player.chooseToDebate(game.filterPlayer(current => current != player)).set("callback", async event => {
				const { debateResult: result } = event;
				const { bool, opinion, targets, opinions } = result;
				if (bool && opinion) {
					if (opinion && ["red", "black"].includes(opinion)) {
						player.logSkill("jsrgchaozheng", targets, null, null, [opinion == "red" ? 3 : 4]);
						for (const target of result.red.map(i => i[0]).sortBySeat()) {
							await target[opinion == "red" ? "recover" : "loseHp"]();
						}
					}
				}
				if (
					opinions.some(idea =>
						targets.every(target =>
							result[idea]
								.slice()
								.map(i => i[0])
								.includes(target)
						)
					)
				) {
					await player.draw(targets.length);
				}
			});
		},
	},
	jsrgshenchong: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		filterTarget: lib.filter.notMe,
		derivation: ["jsrgfeiyang", "jsrgbahu"],
		skillAnimation: true,
		animationColor: "soil",
		async content(event, trigger, player) {
			const { target, name: skillName } = event;
			player.awakenSkill(skillName);
			await target.addSkills(["jsrgfeiyang", "jsrgbahu"]);
			player.addSkill(skillName + "_die");
			player.markAuto(skillName + "_die", [target]);
		},
		ai: {
			order: 1,
			result: { target: 1 },
		},
		subSkill: {
			die: {
				audio: "jsrgshenchong",
				trigger: { player: "die" },
				charlotte: true,
				forced: true,
				forceDie: true,
				filter(event, player) {
					return player.getStorage("jsrgshenchong_die").length;
				},
				content() {
					const targets = player.getStorage("jsrgshenchong_die");
					player.line(targets);
					targets.sortBySeat().forEach(current => {
						current.clearSkills();
						current.chooseToDiscard(current.countCards("h"), "h", true);
					});
				},
			},
		},
	},
	jsrgfeiyang: {
		trigger: { player: "phaseJudgeBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("j") && player.countCards("h") > 1;
		},
		content() {
			"step 0";
			player
				.chooseToDiscard("h", 2, get.prompt("jsrgfeiyang"), "弃置两张手牌并弃置判定区里的一张牌")
				.set("logSkill", "jsrgfeiyang")
				.set("ai", function (card) {
					if (_status.event.goon) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					(() => {
						if (player.hasSkillTag("rejudge") && player.countCards("j") < 2) {
							return false;
						}
						return player.hasCard(function (card) {
							if (get.tag(card, "damage") && get.damageEffect(player, player, _status.event.player, get.natureList(card)) >= 0) {
								return false;
							}
							return (
								get.effect(
									player,
									{
										name: card.viewAs || card.name,
										cards: [card],
									},
									player,
									player
								) < 0
							);
						}, "j");
					})()
				);
			"step 1";
			if (result.bool) {
				player.discardPlayerCard(player, "j", true);
			}
		},
	},
	jsrgbahu: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		content() {
			player.draw();
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + 1;
				}
			},
		},
	},
	jsrgjulian: {
		audio: 4,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.hasZhuSkill("jsrgjulian") && lib.skill.jsrgjulian.logTarget(null, player).length;
		},
		prompt: "是否发动【聚敛】？",
		prompt2: "你可以获得其他所有群势力角色的各一张牌",
		logAudio: () => ["jsrgjulian3.mp3", "jsrgjulian4.mp3"],
		logTarget(event, player) {
			return game
				.filterPlayer(current => {
					return current.group == "qun" && current.countGainableCards(player, "he") > 0 && current != player;
				})
				.sortBySeat();
		},
		async content(event, trigger, player) {
			for (const target of event.targets) {
				await player.gainPlayerCard(target, "he", true);
			}
		},
		group: "jsrgjulian_draw",
		zhuSkill: true,
		subSkill: {
			draw: {
				audio: ["jsrgjulian1.mp3", "jsrgjulian2.mp3"],
				trigger: { global: "gainAfter" },
				filter(event, player) {
					const { player: source } = event;
					if (source == player || source.group != "qun" || source.countMark("jsrgjulian_count") > 1) {
						return false;
					}
					var evt = event.getParent("phaseDraw");
					return (!evt || evt.player != source) && event.getParent().name == "draw" && event.getParent(2).name != "jsrgjulian_draw" && player.hasZhuSkill("jsrgjulian", event.player);
				},
				popup: false,
				async cost(event, trigger, player) {
					event.result = await trigger.player.chooseBool(`是否响应${get.translation(player)}的【聚敛】摸一张牌？`).forResult();
				},
				async content(event, trigger, player) {
					const { player: source } = trigger;
					source.logSkill(event.name, player);
					source.addTempSkill("jsrgjulian_count");
					source.addMark("jsrgjulian_count", 1, false);
					await source.draw();
				},
			},
			count: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//何进
	jsrgzhaobing: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			const hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			return hs.every(card => lib.filter.cardDiscardable(card, player, "jsrgzhaobing"));
		},
		async cost(event, trigger, player) {
			const cards = player.getCards("h");
			const num = cards.length;
			event.result = await player
				.chooseTarget(get.prompt(event.skill), `弃置所有手牌，令至多${get.cnNumber(num)}名其他角色依次选择一项：1.正面向上交给你一张【杀】；2.失去1点体力`, [1, num], lib.filter.notMe)
				.set("ai", target => {
					const { player, goon } = get.event();
					if (!goon) {
						return 0;
					}
					return 2 - get.attitude(player, target);
				})
				.set(
					"goon",
					num / 2 <
						game.countPlayer(current => {
							return 2 - get.attitude(player, current) > 0;
						})
				)
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			if (player.countCards("h")) {
				await player.discard(player.getCards("h"));
			}
			for (const target of targets.sortBySeat()) {
				if (!target.isIn()) {
					continue;
				}
				const bool = await target
					.chooseToGive(player, `诏兵：交给${get.translation(player)}一张【杀】，或失去1点体力`, card => get.name(card) == "sha")
					.set("ai", card => {
						if (get.event().goon) {
							return 0;
						}
						return 6 - get.value(card);
					})
					.set("goon", get.effect(target, { name: "losehp" }, target, target) >= 0)
					.forResultBool();
				if (!bool) {
					await target.loseHp();
				}
			}
		},
		ai: { expose: 0.2 },
	},
	jsrgzhuhuan: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			const hs = player.getCards("h", "sha");
			if (!hs.length) {
				return false;
			}
			return hs.every(card => lib.filter.cardDiscardable(card, player, "jsrgzhuhuan"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const hs = player.getCards("h", "sha");
			if (player.countCards("h")) {
				await player.showHandcards();
			}
			const num = hs.length;
			if (!num) {
				return;
			}
			await player.discard(hs);
			const result =
				target.countCards("he") < num
					? { bool: false }
					: await target
							.chooseToDiscard(`${get.translation(player)}对你发动了【诛宦】`, `弃置${get.cnNumber(num)}张牌并受到1点伤害；或点击“取消”令其回复1点体力且其摸${get.cnNumber(num)}张牌`, num, "he")
							.set("ai", card => {
								if (get.event().goon) {
									return 0;
								}
								return 5.5 - get.value(card);
							})
							.set("goon", target.hp <= 2 || get.attitude(target, player) >= 0 || player.isHealthy())
							.forResult();
			if (result?.bool) {
				await target.damage();
			} else {
				await player.draw(num);
				await player.recover();
			}
		},
		ai: { expose: 0.2 },
	},
	jsrgyanhuo: {
		inherit: "spyanhuo",
		audio: 2,
		forced: true,
	},
	//孙坚
	jsrgpingtao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event;
			const att = get.attitude(target, player);
			const bool = await target
				.chooseToGive(player, `${get.translation(player)}对你发动了【平讨】`, "交给其一张牌并令其此回合使用【杀】的次数上限+1；或点击“取消”令其视为对你使用一张【杀】", "he")
				.set("ai", card => {
					const { give, att } = get.event();
					if (give) {
						if (card.name == "sha" || card.name == "tao" || card.name == "jiu") {
							return 0;
						}
						return 8 - get.value(card);
					}
					if (att < 0 && card.name == "sha") {
						return -1;
					}
					return 4 - get.value(card);
				})
				.set("give", (att >= 0 || (target.hp == 1 && target.countCards("hs", "shan") <= 1)) && get.effect(target, { name: "sha" }, player, target) < 0)
				.set("att", att)
				.forResultBool();
			if (bool) {
				player.addTempSkill(event.name + "_sha");
				player.addMark(event.name + "_sha", 1, false);
			} else if (player.canUse({ name: "sha", isCard: true }, target, false)) {
				await player.useCard({ name: "sha", isCard: true }, target, false);
			}
		},
		ai: {
			expose: 0.15,
			order: 5,
			result: { target: -1 },
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				marktext: "讨",
				intro: { content: "本回合使用【杀】的次数上限+#" },
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("jsrgpingtao_sha");
						}
					},
				},
			},
		},
	},
	jsrgjuelie: {
		audio: 4,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return player.countCards("he") && event.card.name == "sha";
		},
		logTarget: "target",
		logAudio: () => ["jsrgjuelie3.mp3", "jsrgjuelie4.mp3"],
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt(event.skill, trigger.target), "当你使用【杀】指定一名角色为目标后，你可以弃置任意张牌，然后弃置其等量的牌", [1, Infinity], "he")
				.set("ai", card => {
					if (ui.selected.cards.length >= _status.event.max) {
						return 0;
					}
					if (_status.event.goon) {
						return 4.5 - get.value(card);
					}
					return 0;
				})
				.set("max", trigger.target.countDiscardableCards(player, "he"))
				.set("goon", get.attitude(player, trigger.target) < 0)
				.forResult();
		},
		async content(event, trigger, player) {
			const num = event.cards.length;
			if (trigger.target.countDiscardableCards(player, "he")) {
				await player.discardPlayerCard("平讨：弃置" + get.translation(trigger.target) + get.cnNumber(num) + "张牌", num, "he", trigger.target, true);
			}

			/*
			else event.finish();
			'step 2'
			if(player.isMinHandcard()||player.isMinHp()){
				var id=trigger.target.playerid;
				var map=trigger.getParent().customArgs;
				if(!map[id]) map[id]={};
				if(typeof map[id].extraDamage!='number'){
					map[id].extraDamage=0;
				}
				map[id].extraDamage++;
			}
			*/
		},
		ai: {
			unequip_ai: true,
			skillTagFilter(player, tag, arg) {
				if (!arg || !arg.name || arg.name != "sha") {
					return false;
				}
				if (!arg.target) {
					return false;
				}
				var card = arg.target.getEquip(2);
				return (
					card &&
					get.value(card) > 0 &&
					player.hasCard(cardx => {
						return lib.filter.cardDiscardable(cardx, player, "jsrgjuelie_discard") && get.value(cardx) < 5;
					})
				);
			},
		},
		group: "jsrgjuelie_pojun",
		subSkill: {
			pojun: {
				audio: ["jsrgjuelie1.mp3", "jsrgjuelie2.mp3"],
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					if (!player.isMinHandcard() && !player.isMinHp()) {
						return false;
					}
					return event.getParent().name == "sha";
				},
				forced: true,
				locked: false,
				logTarget: "player",
				content() {
					trigger.num++;
				},
			},
		},
	},
	//皇甫嵩
	jsrgguanhuo: {
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return (
				event.card.storage &&
				event.card.storage.jsrgguanhuo &&
				!game.hasPlayer2(current => {
					return current.hasHistory("damage", evt => evt.card == event.card);
				})
			);
		},
		forced: true,
		locked: false,
		group: "jsrgguanhuo_viewas",
		content() {
			"step 0";
			var count = player.getHistory("useSkill", evt => {
				return evt.skill == "jsrgguanhuo_viewas" && evt.event.getParent("phaseUse") === trigger.getParent("phaseUse");
			}).length;
			if (count == 1) {
				player.addTempSkill("jsrgguanhuo_ex", "phaseUseAfter");
				player.addMark("jsrgguanhuo_ex", 1, false);
				trigger.targets.forEach(i => i.removeSkill("huogong2"));
			} else {
				player.removeSkills("jsrgguanhuo");
			}
		},
		ai: {
			effect: {
				player(card, player) {
					if (
						_status.event.getParent().skill == "jsrgguanhuo_viewas" &&
						player.getHistory("useSkill", evt => {
							return evt.skill == "jsrgguanhuo_viewas" && evt.event.getParent("phaseUse") === _status.event.getParent("phaseUse");
						}).length == 1
					) {
						return "zeroplayertarget";
					}
					if (
						_status.event.type == "phase" &&
						_status.event.skill == "jsrgguanhuo_viewas" &&
						player.getHistory("useSkill", evt => {
							return evt.skill == "jsrgguanhuo_viewas" && evt.event.getParent("phaseUse") === _status.event.getParent("phaseUse");
						}).length > 1 &&
						player.countCards("h") <= 3
					) {
						return [0, 0];
					}
				},
			},
		},
		subSkill: {
			viewas: {
				audio: "jsrgguanhuo",
				enable: "phaseUse",
				viewAs: {
					name: "huogong",
					isCard: true,
					storage: {
						jsrgguanhuo: true,
					},
				},
				filterCard: () => false,
				selectCard: -1,
				prompt: "视为使用一张【火攻】",
				ai: {
					order(item, player) {
						return get.order({ name: "huogong" }) + 0.01;
					},
				},
			},
			ex: {
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					return event.card && event.card.name == "huogong" && event.getParent().type == "card";
				},
				forced: true,
				charlotte: true,
				onremove: true,
				intro: { content: "当你造成渠道为【火攻】的伤害时，此伤害+#" },
				content() {
					trigger.num += player.countMark("jsrgguanhuo_ex");
				},
			},
		},
	},
	jsrgjuxia: {
		trigger: { target: "useCardToTargeted" },
		usable: 1,
		countSkill(player) {
			return player.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				if (!info || info.charlotte) {
					return false;
				}
				return true;
			}).length;
		},
		filter(event, player) {
			return event.player != player && lib.skill.jsrgjuxia.countSkill(event.player) > lib.skill.jsrgjuxia.countSkill(player);
		},
		async cost(event, trigger, player) {
			const goon = get.effect(player, trigger.card, trigger.player, trigger.player) < 2 * get.effect(player, { name: "draw" }, player, trigger.player);
			if (goon && !event.isMine() && !event.isOnline()) {
				await game.delayx();
			}
			event.result = await trigger.player
				.chooseBool(`是否对${get.translation(player)}发动【居下】？`, `令${get.translation(trigger.card)}对其无效，然后其摸两张牌`)
				.set("ai", () => {
					return _status.event.goon;
				})
				.set("goon", goon)
				.forResult();
		},
		popup: false,
		async content(event, trigger, player) {
			trigger.player.logSkill(event.name, player);
			trigger.excluded.add(player);
			await player.draw(2);
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (lib.skill.jsrgjuxia.countSkill(target) >= lib.skill.jsrgjuxia.countSkill(player)) {
						return;
					}
					if (card && (card.cards || card.isCard) && get.attitude(target, player) > 0 && (!target.storage.counttrigger || !target.storage.counttrigger.jsrgjuxia)) {
						return [0, 0.5, 0, 0.5];
					}
				},
			},
		},
	},
	//许劭
	jsrgyingmen: {
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "phaseBegin"],
		},
		forced: true,
		filter(event, player, name) {
			if (player.getStorage("jsrgyingmen").length >= 4) {
				return false;
			}
			if (name == "phaseBefore") {
				return game.phaseNumber == 0;
			}
			return event.name != "phase" || event.player == player;
		},
		update(player) {
			var id = player.playerid;
			var characters = player.getStorage("jsrgyingmen");
			var skillName = "jsrgpingjian_" + id;
			var skillsx = [],
				skillsx2 = [];
			var map = {};
			var skillsy = lib.skill[skillName] ? lib.skill[skillName].group : [];
			for (var name of characters) {
				var skills = lib.character[name][3].slice();
				skills = skills.filter(skill => {
					var list = get.skillCategoriesOf(skill, player);
					list.removeArray(["锁定技", "Charlotte"]);
					if (list.length) {
						return false;
					}
					var info = get.info(skill);
					return info && (!info.unique || info.gainable);
				});
				game.expandSkills(skills);
				for (var i = 0; i < skills.length; i++) {
					var skill = skills[i];
					var info = get.info(skill);
					if (info.silent || info.charlotte) {
						continue;
					}
					if (!info.forced && !info.frequent && (!info.mod || (info.charlotte && info.mod))) {
						continue;
					}
					var infox = get.copy(info);
					var newname = skill + "_" + id;
					map[newname] = infox;
					if (info.audio) {
						infox.audio = typeof info.audio != "number" ? info.audio : skill;
					}
					// if(infox.group) delete infox.group;
					if (infox.frequent) {
						delete infox.frequent;
					}
					if (infox.forceDie) {
						delete infox.forceDie;
					}
					var popup = infox.popup;
					if (infox.forced && infox.direct) {
						delete infox.direct;
						infox.popup = false;
					}
					if (infox.forced && !infox.prompt2) {
						var skillx = skill;
						while (true) {
							var prompt2 = lib.translate[skillx + "_info"];
							if (prompt2 && prompt2.length) {
								infox.prompt2 = prompt2;
								break;
							}
							var ind = skillx.lastIndexOf("_");
							if (ind == -1) {
								break;
							}
							skillx = skillx.slice(0, ind);
						}
					}
					if (popup != false && !infox.silent) {
						infox.forced = false;
					}
					if (!infox.charlotte && infox.mod) {
						delete infox.mod;
					}
					skillsx2.add(skill);
					skills[i] = newname;
				}
				if (skills.length) {
					skillsx.addArray(skills);
				}
			}
			var skillsRemoving = skillsy.removeArray(skillsx);
			player.removeSkill(skillsRemoving);
			game.broadcastAll(
				function (name, skillsx, skillsx2, id, map) {
					for (var i in map) {
						lib.skill[i] = map[i];
					}
					lib.skill[name] = {
						unique: true,
						group: skillsx,
					};
					lib.translate[name] = "评鉴";
					for (var i of skillsx2) {
						lib.translate[i + "_" + id] = lib.translate[i];
						lib.translate[i + "_" + id + "_info"] = lib.translate[i + "_info"];
					}
				},
				skillName,
				skillsx,
				skillsx2,
				id,
				map
			);
			player.addSkill(skillName);
			player.addSkill("jsrgpingjian_blocker");
			player.addSkillTrigger(skillName);
		},
		bannedList: ["zishu", "weishu", "xinfu_zhanji", "kyouko_rongzhu"],
		content() {
			"step 0";
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			var num = player.getStorage("jsrgyingmen").length;
			var list = [];
			_status.characterlist.randomSort();
			for (var i = 0; i < _status.characterlist.length; i++) {
				var name = _status.characterlist[i];
				var skills = lib.character[name][3].slice();
				if (
					skills.some(skill => {
						return lib.skill.jsrgyingmen.bannedList.includes(skill);
					})
				) {
					continue;
				}
				list.push(name);
				_status.characterlist.remove(name);
				if (list.length >= 4 - num) {
					break;
				}
			}
			if (list.length) {
				player.markAuto("jsrgyingmen", list);
				if (player.hasSkill("jsrgpingjian", null, false, false)) {
					lib.skill.jsrgyingmen.update(player);
				}
				game.log(player, "将", "#g" + get.translation(list), "置为", "#y访客");
				game.broadcastAll(
					function (player, list) {
						var cards = [];
						for (var i = 0; i < list.length; i++) {
							var cardname = "huashen_card_" + list[i];
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
			}
		},
		ai: {
			combo: "jsrgpingjian",
		},
		marktext: "客",
		intro: {
			name: "访客(盈门/评鉴)",
			mark(dialog, storage, player) {
				dialog.addText("剩余“访客”");
				if (storage) {
					dialog.addSmall([storage, "character"]);
				} else {
					dialog.addText("无");
				}
			},
		},
	},
	jsrgpingjian: {
		trigger: { player: ["logSkill", "useSkillAfter"] },
		forced: true,
		locked: false,
		onremove(player) {
			player.removeSkill("jsrgpingjian_" + player.playerid);
		},
		filter(event, player) {
			var skill = event.skill,
				name = event.event ? event.event.name : "";
			var visitors = player.getStorage("jsrgyingmen");
			for (var visitor of visitors) {
				var skills = lib.character[visitor][3].slice();
				game.expandSkills(skills);
				var info = get.info(skill);
				if (info && (info.charlotte || info.silent)) {
					continue;
				}
				if (
					skills.some(skillx => {
						return skill.indexOf(skillx) == 0 || name.indexOf(skillx + "_" + player.playerid) == 0;
					})
				) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var current;
			var skill = trigger.skill,
				name = trigger.event ? trigger.event.name : "";
			var visitors = player.getStorage("jsrgyingmen");
			for (var visitor of visitors) {
				var skills = lib.character[visitor][3].slice();
				game.expandSkills(skills);
				var info = get.info(skill);
				if (info && info.charlotte) {
					continue;
				}
				if (
					skills.some(skillx => {
						return skill.indexOf(skillx) == 0 || name.indexOf(skillx + "_" + player.playerid) == 0;
					})
				) {
					current = visitor;
					break;
				}
			}
			event.current = current;
			player
				.chooseButton(['###评鉴：移去一名访客###<div class="text center">若移去的访客为' + get.translation(current) + "，则你摸一张牌</div>", [player.getStorage("jsrgyingmen"), "character"]], true)
				.set("ai", button => {
					if (button.link == _status.event.toremove) {
						return 1;
					}
					return Math.random();
				})
				.set(
					"toremove",
					(function () {
						var list = player.getStorage("jsrgyingmen");
						var rand = Math.random();
						if (rand < 0.33) {
							return list[0];
						}
						if (rand < 0.66) {
							return current;
						}
						return list.randomGet();
					})()
				);
			"step 1";
			if (result.bool) {
				var visitor = result.links[0];
				game.log(player, "从", "#y访客", "中移去了", "#g" + get.translation(visitor));
				player.popup(visitor);
				player.unmarkAuto("jsrgyingmen", [visitor]);
				_status.characterlist.add(visitor);
				if (visitor == event.current) {
					player.draw();
				}
				lib.skill.jsrgyingmen.update(player);
			}
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
					if (skill != "jsrgpingjian_" + player.playerid) {
						return false;
					}
					if (player._jsrgpingjian_blockerChecking) {
						return;
					}
					player._jsrgpingjian_blockerChecking = true;
					var own = player.hasSkill("jsrgpingjian");
					delete player._jsrgpingjian_blockerChecking;
					return !own;
				},
			},
		},
	},
	//董白
	jsrgshichong: {
		zhuanhuanji: true,
		trigger: { player: "useCardToPlayered" },
		direct: true,
		filter(event, player) {
			return event.target != player && event.targets.length == 1 && event.target.isIn() && event.target.countCards("h");
		},
		mark: true,
		marktext: "☯",
		intro: {
			content(storage, player) {
				var str = "转换技。当你使用牌指定其他角色为唯一目标后，";
				if (storage) {
					return str + "目标角色可以交给你一张手牌。";
				}
				return str + "你可以获得目标角色一张手牌。";
			},
		},
		content() {
			"step 0";
			if (!player.storage.jsrgshichong) {
				player
					.chooseBool(get.prompt("jsrgshichong", trigger.target), "你可以获得该角色的一张手牌")
					.set("ai", () => {
						return _status.event.bool;
					})
					.set("bool", get.attitude(player, trigger.target) <= 0);
			} else {
				trigger.target
					.chooseCard("是否发动" + get.translation(player) + "的【恃宠】？", "你可以选择一张手牌，并交给该角色")
					.set("ai", card => {
						if (_status.event.goon) {
							return 5 - get.value(card);
						}
						return 0 - get.value(card);
					})
					.set("goon", get.attitude(trigger.target, player) > 2);
			}
			"step 1";
			if (result.bool) {
				if (!player.storage.jsrgshichong) {
					player.logSkill("jsrgshichong", trigger.target);
					player.gainPlayerCard(trigger.target, "h", true);
				} else {
					trigger.target.logSkill("jsrgshichong", player);
					trigger.target.give(result.cards, player);
				}
				player.changeZhuanhuanji("jsrgshichong");
			}
		},
	},
	jsrglianzhu: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { color: "black" },
		position: "h",
		filterTarget: lib.filter.notMe,
		lose: false,
		discard: false,
		delay: false,
		content() {
			"step 0";
			player.showCards(cards, get.translation(player) + "发动了【连诛】");
			"step 1";
			player.give(cards, target, true);
			"step 2";
			event.targets = game
				.filterPlayer(current => {
					return current.group == target.group && current != player;
				})
				.sortBySeat();
			game.delayx();
			"step 3";
			var target = targets.shift();
			if (player.canUse("guohe", target)) {
				player.useCard({ name: "guohe", isCard: true }, target);
			}
			if (targets.length) {
				event.redo();
			}
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					var targets = game.filterPlayer(current => {
						return current.group == target.group && current != player;
					});
					var eff = targets.reduce((p, c) => {
						return p + get.effect(c, { name: "guohe" }, player, player);
					}, 0);
					if (ui.selected.cards.length) {
						eff += get.value(ui.selected.cards[0], target);
					}
					return eff;
				},
			},
		},
	},
	//桥玄
	jsrgjuezhi: {
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			if (_status.currentPhase != player || player.hasSkill("jsrgjuezhi_used", null, null, false)) {
				return false;
			}
			return event.card && event.getParent().type == "card" && lib.skill.jsrgjuezhi.getNum(event.player, player) > 0;
		},
		forced: true,
		locked: false,
		getNum(target, player) {
			return target.countCards("e", card => {
				var subtype = get.subtypes(card);
				for (var i of subtype) {
					if (player.hasDisabledSlot(i)) {
						return true;
					}
				}
				return false;
			});
		},
		group: "jsrgjuezhi_disable",
		content() {
			player.addTempSkill("jsrgjuezhi_used", ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseDrawAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"]);
			trigger.num += lib.skill.jsrgjuezhi.getNum(trigger.player, player);
		},
		subSkill: {
			disable: {
				audio: "jsrgjuezhi",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				direct: true,
				filter(event, player) {
					var evt = event.getl(player);
					return evt && evt.es && evt.es.length > 0;
				},
				content() {
					"step 0";
					event.cards = trigger.getl(player).es;
					"step 1";
					var card = cards.shift(),
						subtypes = get.subtypes(card).filter(slot => player.hasEnabledSlot(slot));
					event.subtypes = subtypes;
					if (subtypes.length > 0) {
						player.chooseBool(get.prompt("jsrgjuezhi_disable"), "废除你的" + get.translation(subtypes) + "栏").set("ai", () => 1);
					} else {
						event._result = { bool: false };
					}
					"step 2";
					if (result.bool) {
						player.logSkill("jsrgjuezhi_disable");
						player.disableEquip(event.subtypes);
					}
					if (cards.length > 0) {
						event.goto(1);
					}
				},
			},
			used: { charlotte: true },
		},
	},
	jsrgjizhao: {
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player(),
						att = get.attitude(player, target);
					if (target.countCards("ej", card => get.effect(target, card, target, player) <= 0)) {
						return 4 + att;
					}
					if (target.countCards("ej") && !target.countCards("h")) {
						return 6 - att;
					}
					return target.countCards("h") * get.sgn(att);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const result = await target
				.chooseToUse({
					filterCard(card, player, event) {
						if (get.itemtype(card) != "card" || (get.position(card) != "h" && get.position(card) != "s")) {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					prompt: "急召：使用一张手牌，否则" + get.translation(player) + "可以移动你区域里的一张牌",
					addCount: false,
					goon: !target.countCards("ej", card => get.effect(target, card, target, player)) && get.attitude(target, player) > 0,
					ai1(card) {
						if (_status.event.goon) {
							return get.order(card);
						}
						return 0;
					},
				})
				.forResult();
			if (result.bool) {
				return;
			}
			const result2 = await player
				.chooseTarget(`急召：是否移动${get.translation(target)}的一张牌？`, (cardx, player, target) => {
					const { from } = get.event();
					if (from == target) {
						return false;
					}
					if (from.countCards("h")) {
						return true;
					}
					if (from.countCards("e", card => target.canEquip(card))) {
						return true;
					}
					return from.countCards("j", card => target.canAddJudge(card));
				})
				.set("from", target)
				.set("ai", target => {
					const { player, from } = get.event(),
						att = get.attitude(player, target),
						att2 = get.attitude(player, from),
						getE = card => get.effect(target, card, player, player) - get.effect(from, card, player, player),
						getEffect = card => {
							const pos = get.position(card);
							switch (pos) {
								case "h": {
									return att2 > 0 ? 0 : get.sgn(att);
								}
								case "e": {
									return target.canEquip(card) ? getE(card) : 0;
								}
								case "j": {
									return target.canAddJudge(card) ? getE(card) : 0;
								}
							}
							return 0;
						};
					const card = from.getCards("hej").maxBy(getEffect);
					return card ? getEffect(card) : 0;
				})
				.set("targetprompt", "移动目标")
				.forResult();
			if (!result2.bool || !result2.targets?.length) {
				return;
			}
			const targetx = result2.targets[0];
			await game.delay();
			const result3 = await player
				.choosePlayerCard("hej", true, target, button => {
					const { player, from, to } = get.event(),
						card = button.link,
						eff1 = get.effect(from, card, from, player),
						eff2 = get.effect(to, card, to, player);
					if (get.position(card) != "h") {
						return eff2 - eff1;
					}
					return 2 + get.value(card) * get.sgnAttitude(player, to);
				})
				.set("from", target)
				.set("to", targetx)
				.set("filterButton", function (button) {
					const { player, from, to } = get.event(),
						card = button.link;
					if (get.position(card) == "h") {
						return true;
					} else if (get.position(card) == "j") {
						return to.canAddJudge(card);
					} else {
						return to.canEquip(card);
					}
				})
				.forResult();
			if (result3.bool && result3.links.length) {
				const link = result3.links[0];
				if (get.position(link) == "h") {
					await targetx.gain(link, target, "giveAuto");
				} else {
					target.$give(link, targetx, false);
					if (get.position(link) == "e") {
						await targetx.equip(link);
					} else if (link.viewAs) {
						await targetx.addJudge({ name: link.viewAs }, [link]);
					} else {
						await targetx.addJudge(link);
					}
				}
				game.log(target, "的", get.position(link) == "h" ? "一张手牌" : link, "被移动给了", targetx);
				await game.delay();
			}
		},
		ai: {
			effect: {
				target_use(card, player, target, current) {
					if (get.type(card) == "delay" && current < 0) {
						if (target.countCards("j")) {
							return;
						}
						return "zerotarget";
					}
				},
			},
		},
	},
	//杨彪
	jsrgzhaohan: {
		audio: "zhaohan",
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		//locked:false,
		filter(event, player) {
			if (game.shuffleNumber == 0) {
				return player.isDamaged();
			}
			return true;
		},
		content() {
			player[game.shuffleNumber > 0 ? "loseHp" : "recover"]();
		},
	},
	jsrgrangjie: {
		audio: "rangjie",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.canMoveCard() && event.num > 0;
		},
		check(event, player) {
			return player.canMoveCard(true);
		},
		getIndex: event => event.num,
		async content(event, trigger, player) {
			if (!player.canMoveCard()) {
				return;
			}
			const result = await player.moveCard(true).forResult();
			if (!result?.card) {
				return;
			}
			const suit = get.suit(result.card, false);
			const cards = Array.from(ui.discardPile.childNodes);
			const gains = [];
			const history = game.getGlobalHistory("cardMove", evt => {
				if (evt.name == "lose") {
					return evt.position == ui.discardPile;
				}
				return evt.name == "cardsDiscard";
			});
			for (let i = history.length - 1; i >= 0; i--) {
				let evt = history[i];
				let cards2 = evt.cards.filter(card => {
					return cards.includes(card) && get.suit(card, false) == suit;
				});
				if (cards2.length) {
					gains.addArray(cards2);
					cards.removeArray(cards2);
				}
				if (!cards.length) {
					break;
				}
			}
			if (gains.length) {
				const result = await player
					.chooseButton(["让节：是否获得一张" + get.translation(suit) + "牌？", gains])
					.set("ai", get.buttonValue)
					.forResult();
				if (result?.bool && result?.links?.length) {
					await player.gain(result.links, "gain2");
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
						if (target._jsrgrangjie_aiChecking) {
							return;
						}
						target._jsrgrangjie_aiChecking = true;
						var moveCard = target.canMoveCard(true);
						delete target._jsrgrangjie_aiChecking;
						if (!moveCard || !target.hasFriend()) {
							return;
						}
						var num = 1;
						if (get.attitude(player, target) > 0) {
							if (player.needsToDiscard()) {
								num = 0.5;
							} else {
								num = 0.3;
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
	jsrgyizheng: {
		audio: "yizheng",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countCards("h") > player.countCards("h") && player.canCompare(current);
			});
		},
		filterTarget(card, player, current) {
			return current.countCards("h") > player.countCards("h") && player.canCompare(current);
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				target.skip("phaseDraw");
				target.addTempSkill("yizheng2", { player: "phaseDrawSkipped" });
				event.finish();
			} else {
				target
					.chooseControl("1", "2", "cancel")
					.set("prompt", "是否对" + get.translation(player) + "造成至多2点伤害？")
					.set("ai", () => {
						return _status.event.choice;
					})
					.set("choice", get.damageEffect(player, target, target) > 0 ? (get.attitude(target, player) > 0 ? 0 : 1) : "cancel2");
			}
			"step 2";
			if (result.control != "cancel2") {
				var num = result.index + 1;
				target.line(player);
				player.damage(target, num);
			}
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
					if (hs[0].number > ts[0].number) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	//孔融
	jsrglirang: {
		audio: "splirang",
		trigger: { global: "phaseDrawBegin" },
		filter(event, player) {
			return event.player != player && player.countCards("he") > 1;
		},
		async cost(event, trigger, player) {
			const { player: target } = trigger;
			event.result = await player
				.chooseCard(get.prompt(event.name.slice(0, -5), target), "你可以选择两张牌，将这些牌交给该角色。若如此做，你获得其本回合弃牌阶段弃置的所有牌。", 2, "he")
				.set("ai", card => {
					const { player, target, give } = get.event();
					if (!give) {
						return 0;
					}
					return target.getUseValue(card) - player.getUseValue(card) + 0.5;
				})
				.set("give", get.attitude(player, target) > 0)
				.set("target", target)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const { player: target } = trigger,
				{ cards, name } = event;
			player.tempBanSkill(name, "roundStart");
			await player.give(cards, target);
			player.addTempSkill("jsrglirang_record", "roundStart");
			player.addTempSkill("jsrglirang_given");
			player.markAuto("jsrglirang_record", [target]);
		},
		subSkill: {
			record: {
				charlotte: true,
				onremove: true,
				intro: { content: "本轮〖礼让〗目标：$" },
			},
			given: {
				audio: "splirang",
				getCards(event, player) {
					const cards = [];
					event.player.getHistory("lose", evt => {
						if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
							cards.addArray(evt.cards2.filterInD("d"));
						}
					});
					return cards;
				},
				trigger: { global: "phaseDiscardEnd" },
				filter(event, player) {
					return get.info("jsrglirang_given").getCards(event, player).length;
				},
				charlotte: true,
				prompt2(event, player) {
					const cards = get.info("jsrglirang_given").getCards(event, player);
					return "获得" + get.translation(cards);
				},
				content() {
					player.gain(get.info(event.name).getCards(trigger, player), "gain2");
				},
			},
		},
	},
	jsrgzhengyi: {
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			const list = player.getStorage("jsrglirang_record");
			if (!list.length) {
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
					.indexOf(event) == 0 && list.some(i => i.isIn())
			);
		},
		direct: true,
		async content(event, trigger, player) {
			const targets = player.getStorage("jsrglirang_record").filter(i => i.isIn());
			let target2;
			while (targets.length) {
				const target = targets.shift();
				const bool = await target
					.chooseBool("是否对" + get.translation(player) + "发动【争义】？", "将此" + (trigger.source ? "来源为" + get.translation(trigger.source) : "无来源") + "的" + trigger.num + "点伤害转移给你")
					.set("ai", () => {
						return _status.event.bool;
					})
					.set("bool", get.damageEffect(player, trigger.source, target) > get.damageEffect(target, trigger.source, target))
					.forResultBool();
				if (bool) {
					target2 = target;
					break;
				}
			}
			if (!target2?.isIn()) {
				return;
			}
			target2.logSkill("jsrgzhengyi", player);
			trigger.cancel();
			await target2.damage(trigger.source, trigger.nature, trigger.num).set("card", trigger.card).set("cards", trigger.cards);
		},
		ai: { combo: "jsrglirang" },
	},
	//朱儁
	jsrgfendi: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.targets.length == 1 && event.card.name == "sha" && event.targets[0].countCards("h") > 0;
		},
		usable: 1,
		logTarget: "target",
		async cost(event, trigger, player) {
			const { target } = trigger;
			event.result = await player
				.choosePlayerCard(target, "h", [1, Infinity], `分敌：展示${get.translation(target)}的任意张手牌`)
				.set("ai", button => {
					if (_status.event.all) {
						return 1;
					}
					if (ui.selected.buttons.length) {
						return 0;
					}
					return Math.random();
				})
				.set("all", !target.mayHaveShan(player, "use") && Math.random() < 0.75)
				.set("forceAuto", true)
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event,
				{ target } = trigger;
			await target.showCards(cards, get.translation(player) + "对" + get.translation(target) + "发动了【分敌】");
			target.addTempSkill("jsrgfendi_tag");
			target.addGaintag(cards, "jsrgfendi_tag");
			target.markAuto("jsrgfendi_tag", [trigger.getParent()]);
			player.addTempSkill("jsrgfendi_gain");
			if (!trigger.card.storage) {
				trigger.card.storage = {};
			}
			trigger.card.storage.jsrgfendi = cards.slice();
			player.storage.jsrgfendi_gain = target;
		},
		subSkill: {
			tag: {
				charlotte: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
					delete player.storage[skill];
				},
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					return player.getStorage("jsrgfendi_tag").includes(event);
				},
				forced: true,
				popup: false,
				content() {
					player.unmarkAuto(event.name, [trigger]);
					if (!player.getStorage(event.name).length) {
						player.removeSkill(event.name);
					}
				},
				mod: {
					cardEnabled(card, player) {
						if (card.cards?.some(i => !i.hasGaintag("jsrgfendi_tag"))) {
							return false;
						} else if (get.itemtype(card) == "card") {
							if (!card.hasGaintag("jsrgfendi_tag")) {
								return false;
							}
						}
					},
					cardRespondable(card, player) {
						return lib.skill.jsrgfendi_tag.mod.cardEnabled.apply(this, arguments);
					},
					cardSavable(card, player) {
						return lib.skill.jsrgfendi_tag.mod.cardEnabled.apply(this, arguments);
					},
				},
			},
			gain: {
				charlotte: true,
				onremove: true,
				trigger: { global: "damageSource" },
				filter(event, player) {
					if (!event.card?.storage) {
						return false;
					}
					const cards = event.card.storage.jsrgfendi;
					const target = player.storage.jsrgfendi_gain;
					if (!cards || !target?.isIn()) {
						return false;
					}
					const cardsx = target.getCards("h");
					cardsx.addArray(Array.from(ui.discardPile));
					return cards.some(i => cardsx.includes(i));
				},
				forced: true,
				popup: false,
				logTarget: (event, player) => player.storage.jsrgfendi_gain,
				content() {
					const target = player.storage.jsrgfendi_gain;
					const cardsx = target.getCards("h");
					cardsx.addArray(Array.from(ui.discardPile));
					const cards = trigger.card.storage.jsrgfendi.filter(i => cardsx.includes(i));
					player.gain(cards, "give");
				},
			},
		},
	},
	jsrgjuxiang: {
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			var evt = event.getParent("phaseDraw");
			if (evt && evt.name == "phaseDraw") {
				return false;
			}
			var hs = player.getCards("h");
			var cards = event.getg(player).filter(i => hs.includes(i));
			if (!cards.length) {
				return false;
			}
			for (var card of cards) {
				if (!lib.filter.cardDiscardable(card, player, "jsrgjuxiang")) {
					return false;
				}
			}
			return true;
		},
		check(event, player) {
			var target = _status.currentPhase;
			if (!target || get.attitude(player, target) <= 0) {
				return false;
			}
			var evt = event.getParent("phaseDiscard"),
				evt2 = event.getParent("phaseJieshu");
			if ((evt && evt.name == "phaseDiscard") || (evt2 && evt.name == "phaseJieshu")) {
				return false;
			}
			if (target.getCardUsable({ name: "sha" }) >= target.countCards("hs", "sha")) {
				return false;
			}
			if (!target.hasValueTarget({ name: "sha" })) {
				return false;
			}
			var hs = player.getCards("h");
			var cards = event.getg(player).filter(i => hs.includes(i));
			var val = 0;
			for (var i of cards) {
				val += get.value(i);
			}
			if (val < 10) {
				return true;
			}
			return false;
		},
		prompt2(event, player) {
			var hs = player.getCards("h");
			var cards = event.getg(player).filter(i => hs.includes(i));
			var target = _status.currentPhase;
			var str = "弃置" + get.translation(cards);
			if (target && target.isIn()) {
				var list = [];
				for (var card of cards) {
					list.add(get.suit(card, player));
				}
				var num = list.length;
				str += "，然后令" + get.translation(target) + "于此回合额定的出牌阶段内使用【杀】的次数上限+" + num;
			}
			return str;
		},
		content() {
			"step 0";
			var hs = player.getCards("h");
			var cards = trigger.getg(player).filter(i => hs.includes(i));
			var list = [];
			for (var card of cards) {
				list.add(get.suit(card, player));
			}
			event.num = list.length;
			player.discard(cards);
			"step 1";
			var target = _status.currentPhase;
			if (target && target.isIn()) {
				target.addTempSkill("jsrgjuxiang_sha");
				target.addMark("jsrgjuxiang_sha", num, false);
				var evt = trigger.getParent("phaseUse");
				if (evt && evt.name == "phaseUse" && !evt.skill) {
					evt.player.addTempSkill("jsrgjuxiang_buff", "phaseUseAfter");
					evt.player.addMark("jsrgjuxiang_buff", num, false);
				}
			}
		},
		subSkill: {
			sha: {
				trigger: { global: "phaseUseBegin" },
				filter(event, player) {
					return !event.skill;
				},
				silent: true,
				charlotte: true,
				forced: true,
				onremove: true,
				content() {
					trigger.player.addTempSkill("jsrgjuxiang_buff", "phaseUseAfter");
					trigger.player.addMark("jsrgjuxiang_buff", player.countMark("jsrgjuxiang_sha"), false);
				},
			},
			buff: {
				charlotte: true,
				intro: { content: "使用【杀】的次数上限+#" },
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("jsrgjuxiang_buff");
						}
					},
				},
			},
		},
	},
	//刘备
	jsrgjishan: {
		audio: 4,
		trigger: {
			source: "damageSource",
			global: "damageBegin4",
		},
		filter(event, player, name) {
			if (player.getStorage("jsrgjishan_used").includes(name)) {
				return false;
			}
			if (name == "damageBegin4") {
				return player.hp > 0;
			}
			return game.hasPlayer(current => current.isMinHp() && player.getStorage("jsrgjishan").includes(current));
		},
		async cost(event, trigger, player) {
			const { triggername, skill } = event,
				{ player: target } = trigger;
			if (triggername == "damageBegin4") {
				const bool = await player.chooseBool(get.prompt(skill, target), "失去1点体力并防止此伤害，然后你与其各摸一张牌").set("choice", get.info(skill).check(trigger, player)).forResultBool();
				event.result = {
					bool: bool,
					targets: [target],
				};
			} else {
				event.result = await player
					.chooseTarget(get.prompt(skill), "令一名体力值最小且你对其发动过〖积善①〗的角色回复1点体力", (card, player, target) => {
						return target.isMinHp() && player.getStorage("jsrgjishan").includes(target);
					})
					.set("ai", target => {
						const player = get.player();
						return get.recoverEffect(target, player, player);
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const {
				triggername,
				name,
				targets: [target],
			} = event;
			player.addTempSkill(name + "_used");
			player.markAuto(name + "_used", [triggername]);
			if (triggername == "damageBegin4") {
				player.markAuto(name, [target]);
				trigger.cancel();
				await player.loseHp();
				await game.asyncDraw([player, target].sortBySeat(_status.currentPhase));
			} else {
				await target.recover();
			}
		},
		onremove: true,
		check(event, player) {
			return get.damageEffect(event.player, event.source, _status.event.player, event.nature) * event.num < get.effect(player, { name: "losehp" }, player, _status.event.player) + get.effect(player, { name: "draw" }, player, _status.event.player) + get.effect(event.player, { name: "draw" }, player, _status.event.player) / 2;
		},
		logAudio(event, player, name) {
			if (name == "damageBegin4") {
				return ["jsrgjishan1.mp3", "jsrgjishan2.mp3"];
			}
			return ["jsrgjishan3.mp3", "jsrgjishan4.mp3"];
		},
		intro: { content: "已帮助$抵挡过伤害" },
		ai: { expose: 0.2 },
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	jsrgzhenqiao: {
		audio: 2,
		trigger: { player: "useCardToTargeted" },
		forced: true,
		filter(event, player) {
			return event.isFirstTarget && event.card.name == "sha" && player.hasEmptySlot(1);
		},
		content() {
			// trigger.getParent().targets=trigger.getParent().targets.concat(trigger.targets);
			// trigger.getParent().triggeredTargets4=trigger.getParent().triggeredTargets4.concat(trigger.targets);
			trigger.getParent().effectCount++;
		},
		mod: {
			attackRange(player, num) {
				return num + 1;
			},
			aiOrder: (player, card, num) => {
				if (num > 0 && get.itemtype(card) === "card" && get.subtype(card) === "equip1" && !player.getEquip(1)) {
					if (
						card.name !== "zhuge" ||
						player.getCardUsable("sha") ||
						!player.needsToDiscard() ||
						player.countCards("hs", i => {
							return get.name(i) === "sha" && lib.filter.cardEnabled(i, player);
						}) < 2
					) {
						return 0;
					}
				}
			},
			aiValue: (player, card, num) => {
				if (num > 0 && get.itemtype(card) === "card" && card.name !== "zhuge" && get.subtype(card) === "equip1" && !player.getEquip(1)) {
					return 0.01 * num;
				}
			},
			aiUseful() {
				return lib.skill.jsrgzhenqiao.mod.aiValue.apply(this, arguments);
			},
		},
	},
	//王允
	jsrgshelun: {
		audio: 4,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => player.inRange(current));
		},
		filterTarget(card, player, target) {
			return player.inRange(target);
		},
		logAudio: index => (typeof index === "number" ? "jsrgshelun" + index + ".mp3" : 2),
		content() {
			var num = player.countCards("h");
			var targets = game.filterPlayer(current => {
				return current.countCards("h") <= num && current != target;
			});
			player
				.chooseToDebate(targets)
				.set("callback", function () {
					var result = event.debateResult;
					if (result.bool && result.opinion) {
						var opinion = result.opinion;
						var target = event.getParent(2).target;
						if (opinion && ["red", "black"].includes(opinion)) {
							player.logSkill("jsrgshelun", target, null, null, [opinion == "red" ? 3 : 4]);
							if (opinion == "red") {
								player.discardPlayerCard(target, "he", true);
							} else {
								target.damage();
							}
						}
					}
				})
				.set("ai", card => {
					var player = _status.event.player;
					var color = player == _status.event.source || get.damageEffect(_status.event.getParent(2).target, player, player) > 0 ? "black" : "red";
					var val = 5 - get.value(card);
					if (get.color(card) == color) {
						val += 10;
					}
					return val;
				})
				.set("aiCard", target => {
					var color = target == _status.event.source || get.damageEffect(_status.event.getParent(2).target, target, target) > 0 ? "black" : "red";
					var hs = target.getCards("h", { color: color });
					if (!hs.length) {
						hs = target.getCards("h");
					}
					return { bool: true, cards: [hs.randomGet()] };
				})
				.set("target", target);
		},
		ai: {
			order: 8,
			expose: 0.2,
			result: { target: -1 },
		},
	},
	jsrgfayi: {
		audio: 2,
		trigger: { global: "chooseToDebateAfter" },
		filter(event, player) {
			if (!event.targets.includes(player)) {
				return false;
			}
			if (event.red.map(i => i[0]).includes(player)) {
				return event.black.length;
			}
			if (event.black.map(i => i[0]).includes(player)) {
				return event.red.length;
			}
			return false;
		},
		direct: true,
		content() {
			"step 0";
			var targets = [];
			if (trigger.red.map(i => i[0]).includes(player)) {
				targets = trigger.black;
			}
			if (trigger.black.map(i => i[0]).includes(player)) {
				targets = trigger.red;
			}
			player
				.chooseTarget(get.prompt("jsrgfayi"), "对一名与你意见不同的角色造成1点伤害", (card, player, target) => {
					return _status.event.targets.includes(target);
				})
				.set(
					"targets",
					targets.map(i => i[0])
				)
				.set("ai", target => {
					var player = _status.event.player;
					return get.damageEffect(target, player, player);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("jsrgfayi", target);
				target.damage();
			}
		},
		ai: {
			combo: "jsrgshelun",
		},
	},
	jsrgtushe: {
		audio: "xinfu_tushe",
		mod: {
			aiOrder(player, card, num) {
				if (get.tag(card, "multitarget")) {
					if (player.countCards("h", { type: "basic" })) {
						return num / 10;
					}
					return num * 10;
				}
				if (get.type(card) === "basic") {
					return num + 10;
				}
			},
			aiValue(player, card, num) {
				if (card.name === "zhangba") {
					return 114514;
				}
				if (["shan", "tao", "jiu"].includes(card.name)) {
					if (player.getEquip("zhangba") && player.countCards("hs") > 1) {
						return 0.01;
					}
					return num / 2;
				}
				if (get.tag(card, "multitarget")) {
					return num + game.players.length;
				}
			},
			aiUseful(player, card, num) {
				if (card.name === "zhangba") {
					return 114514;
				}
				if (get.name(card, player) === "shan") {
					if (
						player.countCards("hs", i => {
							if (card === i || (card.cards && card.cards.includes(i))) {
								return false;
							}
							return get.name(i, player) === "shan";
						})
					) {
						return -1;
					}
					return num / Math.pow(Math.max(1, player.hp), 2);
				}
			},
		},
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			if (get.type(event.card) == "equip") {
				return false;
			}
			if (event.getParent().triggeredTargets3.length > 1) {
				return false;
			}
			return event.targets.length > 0;
		},
		check(event, player) {
			return !player.countCards("h", { type: "basic" });
		},
		locked: false,
		frequent: true,
		content() {
			"step 0";
			player.showHandcards();
			"step 1";
			if (player.countCards("h", { type: "basic" })) {
				event.finish();
			} else {
				player.chooseBool("图射：是否摸" + get.cnNumber(trigger.targets.length) + "张牌？").set("ai", () => 1);
			}
			"step 2";
			if (result.bool) {
				player.draw(trigger.targets.length);
			}
		},
		ai: {
			presha: true,
			pretao: true,
			threaten: 1.8,
			effect: {
				player_use(card, player, target) {
					if (
						typeof card === "object" &&
						card.name !== "shan" &&
						get.type(card) !== "equip" &&
						!player.countCards("h", i => {
							if (card === i || (card.cards && card.cards.includes(i))) {
								return false;
							}
							return get.type(i) === "basic";
						})
					) {
						let targets = [],
							evt = _status.event.getParent("useCard");
						targets.addArray(ui.selected.targets);
						if (evt && evt.card == card) {
							targets.addArray(evt.targets);
						}
						if (targets.length) {
							return [1, targets.length];
						}
						if (get.tag(card, "multitarget")) {
							return [1, game.players.length - 1];
						}
						return [1, 1];
					}
				},
			},
		},
	},
	jsrgtongjue: {
		enable: "phaseUse",
		usable: 1,
		zhuSkill: true,
		filter(event, player) {
			return player.hasZhuSkill("jsrgtongjue") && game.hasPlayer(current => current != player && current.group == "qun");
		},
		filterCard: true,
		selectCard: [1, Infinity],
		filterTarget(card, player, target) {
			return target != player && target.group == "qun";
		},
		selectTarget: [1, Infinity],
		filterOk() {
			return ui.selected.cards.length == ui.selected.targets.length;
		},
		check(card) {
			var player = _status.event.player;
			if (
				player.hasCard(card => {
					return player.hasValueTarget(card);
				}, "hs")
			) {
				return 3 - player.getUseValue(card);
			}
			return 3 - get.value(card);
		},
		multiline: true,
		multitarget: true,
		delay: false,
		discard: false,
		lose: false,
		content() {
			"step 0";
			var list = [];
			for (var i = 0; i < targets.length; i++) {
				var target = targets[i];
				var card = cards[i];
				list.push([target, card]);
			}
			game.loseAsync({
				gain_list: list,
				player: player,
				cards: cards,
				giver: player,
				animate: "giveAuto",
			}).setContent("gaincardMultiple");
			"step 1";
			player.addTempSkill("jsrgtongjue_blocker");
			player.markAuto("jsrgtongjue_blocker", targets);
		},
		ai: {
			order: 5,
			result: {
				target: 1,
			},
		},
		subSkill: {
			blocker: {
				charlotte: true,
				onremove: true,
				mod: {
					playerEnabled(card, player, target) {
						if (player.getStorage("jsrgtongjue_blocker").includes(target)) {
							return false;
						}
					},
				},
				mark: true,
				intro: { content: "$已经立牧自居，不可接近" },
			},
		},
	},
	//404曹操
	jsrgzhenglve: {
		audio: 4,
		trigger: { global: "phaseEnd" },
		isFirst(player) {
			let bool = function (target) {
				if (game.hasPlayer(current => current.getSeatNum() > 0)) {
					return target.getSeatNum() == 1;
				}
				return target == _status.roundStart;
			};
			return game
				.filterPlayer(target => {
					switch (get.mode()) {
						case "identity":
							return target.isZhu;
						case "guozhan":
							return get.is.jun(target);
						case "versus": {
							if (["three", "four", "guandu"].includes(_status.mode)) {
								return target.identity == "zhu";
							}
							return bool(target);
						}
						case "doudizhu":
						case "boss":
							return target.identity == "zhu";
						default:
							return bool(target);
					}
				})
				.includes(player);
		},
		filter(event, player) {
			return get.info("jsrgzhenglve").isFirst(event.player);
		},
		locked: false,
		group: "jsrgzhenglve_damage",
		prompt2(event, player) {
			const num = Math.min(
				event.player.hasHistory("sourceDamage") ? 1 : 2,
				game.countPlayer(current => !current.hasMark("jsrgzhenglve_mark"))
			);
			let str = "你可以摸一张牌";
			if (num) {
				str += `并令${get.cnNumber(num)}名角色获得“猎”标记`;
			}
			return str;
		},
		logAudio: () => 2,
		async content(event, trigger, player) {
			await player.draw();
			const damaged = trigger.player.hasHistory("sourceDamage");
			const num = damaged ? 1 : 2;
			const targets = game.filterPlayer(current => !current.hasMark("jsrgzhenglve_mark"));
			if (!targets.length) {
				return;
			}
			const result =
				targets.length <= num
					? { bool: true, targets: targets }
					: await player
							.chooseTarget("令" + (num > 1 ? "至多" : "") + get.cnNumber(num) + "名角色获得“猎”标记", true, [1, num], (card, player, target) => {
								return !target.hasMark("jsrgzhenglve_mark");
							})
							.set("ai", target => {
								const att = get.attitude(get.player(), target);
								return 100 - att;
							})
							.forResult();
			if (result.bool) {
				const { targets } = result;
				player.line(targets);
				targets.forEach(target => target.addMark("jsrgzhenglve_mark", 1));
			}
		},
		mod: {
			cardUsableTarget(card, player, target) {
				if (target.hasMark("jsrgzhenglve_mark")) {
					return true;
				}
			},
			targetInRange(card, player, target) {
				if (target.hasMark("jsrgzhenglve_mark")) {
					return true;
				}
			},
		},
		subSkill: {
			damage: {
				audio: ["jsrgzhenglve3.mp3", "jsrgzhenglve4.mp3"],
				trigger: { source: "damageSource" },
				usable: 1,
				filter(event, player) {
					return event.player.hasMark("jsrgzhenglve_mark");
				},
				prompt2(event, player) {
					var cards = event.cards || [];
					return "摸一张牌" + (cards.filterInD().length ? "并获得" + get.translation(event.cards.filterInD()) : "");
				},
				async content(event, trigger, player) {
					await player.draw();
					if (trigger.cards?.someInD()) {
						await player.gain(trigger.cards.filterInD(), "gain2");
					}
				},
			},
			mark: {
				marktext: "猎",
				intro: {
					name: "猎(政略)",
					name2: "猎",
					markcount: () => 0,
					content: "已拥有“猎”标记",
				},
			},
		},
	},
	jsrghuilie: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "thunder",
		derivation: ["jsrgpingrong", "feiying"],
		filter(event, player) {
			return game.countPlayer(current => current.hasMark("jsrgzhenglve_mark")) > 2;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.loseMaxHp();
			"step 1";
			player.addSkills(["jsrgpingrong", "feiying"]);
		},
		ai: {
			combo: "jsrgzhenglve",
		},
	},
	jsrgpingrong: {
		audio: 3,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return !player.hasSkill("jsrgpingrong_used") && game.hasPlayer(current => current.hasMark("jsrgzhenglve_mark"));
		},
		logAudio: () => 2,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "移去一名角色的“猎”，然后你执行一个额外回合。若你在此额外回合内未造成伤害，则你失去1点体力。", (card, player, target) => {
					return target.hasMark("jsrgzhenglve_mark");
				})
				.set("ai", target => {
					return get.attitude(_status.event.player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.addTempSkill("jsrgpingrong_used", "roundStart");
			target.removeMark("jsrgzhenglve_mark", target.countMark("jsrgzhenglve_mark"));
			player.insertPhase();
			player.addSkill("jsrgpingrong_check");
		},
		subSkill: {
			used: { charlotte: true },
			check: {
				charlotte: true,
				audio: "jsrgpingrong3.mp3",
				trigger: { player: "phaseAfter" },
				filter(event, player) {
					return event.skill == "jsrgpingrong" && !player.getHistory("sourceDamage").length;
				},
				forced: true,
				content() {
					player.loseHp();
				},
			},
		},
		ai: {
			combo: "jsrgzhenglve",
		},
	},
	//南华老仙
	jsrgshoushu: {
		forced: true,
		trigger: {
			//player:'enterGame',
			//global:'phaseBefore',
			global: "roundStart",
		},
		filter(event, player) {
			if (
				game.hasPlayer(function (current) {
					return current.countCards("hej", "taipingyaoshu");
				})
			) {
				return false;
			}
			return true;
			//return event.name!='phase'||game.phaseNumber==0;
		},
		direct: true,
		group: "jsrgshoushu_destroy",
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("jsrgshoushu"), "将【太平要术】置入一名角色的装备区", (card, player, target) => {
					var card = { name: "taipingyaoshu" };
					return target.canEquip(card, true);
				})
				.set("ai", target => {
					return target.getUseValue({ name: "taipingyaoshu" }) * get.attitude(_status.event.player, target);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("jsrgshoushu", target);
				if (!lib.inpile.includes("taipingyaoshu")) {
					lib.inpile.push("taipingyaoshu");
				}
				event.card = game.createCard2("taipingyaoshu", "heart", 3);
			} else {
				event.finish();
			}
			"step 2";
			if (card) {
				target.equip(card);
			}
		},
		subSkill: {
			destroy: {
				audio: "jsrgshoushu",
				trigger: {
					global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
				},
				forced: true,
				filter(event, player) {
					return game.hasPlayer(current => {
						var evt = event.getl(current);
						if (evt && evt.es) {
							return evt.es.some(i => i.name == "taipingyaoshu");
						}
						return false;
					});
				},
				content() {
					var cards = [];
					game.countPlayer(current => {
						var evt = trigger.getl(current);
						if (evt && evt.es) {
							return cards.addArray(evt.es.filter(i => i.name == "taipingyaoshu"));
						}
					});
					game.cardsGotoSpecial(cards);
					game.log(cards, "被销毁了");
				},
			},
		},
	},
	jsrgxundao: {
		trigger: { player: "judge" },
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("he"));
		},
		direct: true,
		content() {
			"step 0";
			var prompt2 = get.translation(player) + "（你）的" + (trigger.judgestr || "") + "判定为" + get.translation(player.judging[0]) + "，" + "是否令至多两名角色依次弃置一张牌，然后选择其中一张作为新判定牌？";
			player
				.chooseTarget(get.prompt("jsrgxundao"), prompt2, [1, 2], (card, player, target) => {
					return target.countCards("he");
				})
				.set("ai", target => {
					var player = _status.event.player;
					if (!_status.event.todiscard) {
						return 0;
					}
					if (_status.event.todiscard != "all") {
						if (target == _status.event.todiscard) {
							return 100;
						}
					}
					return get.effect(target, { name: "guohe_copy2" }, player, player) / 2;
				})
				.set(
					"todiscard",
					(function () {
						if (trigger.judgestr == "闪电" && get.damageEffect(player, null, player, "thunder") >= 0) {
							return "all";
						}
						var friends = game.filterPlayer(i => get.attitude(i, player) > 0);
						for (var friend of friends) {
							var cardsx = friend.getCards("he", card => trigger.judge(card) > 0);
							cardsx.sort((a, b) => {
								return get.value(a) - get.value(b);
							});
							if (cardsx.length) {
								var card = cardsx[0];
								if (trigger.judge(player.judging[0]) >= 0) {
									if (get.value(card) > 4) {
										return false;
									}
								}
								return get.owner(card);
							}
						}
						return "all";
					})()
				);
			"step 1";
			if (result.bool) {
				var targets = result.targets;
				targets.sortBySeat(_status.currentPhase);
				event.targets = targets;
				player.logSkill("jsrgxundao", targets);
				event.cards = [];
			} else {
				event.finish();
			}
			"step 2";
			var target = targets.shift();
			target.chooseToDiscard("寻道：请弃置一张牌" + (target == player ? "" : "，可能被作为新判定牌"), "he", true).set("ai", card => {
				var trigger = _status.event.getTrigger();
				var player = _status.event.player;
				var judging = _status.event.judging;
				var result = trigger.judge(card) - trigger.judge(judging);
				var attitude = get.attitude(player, trigger.player);
				if (attitude == 0 || result == 0) {
					return 0.1;
				}
				if (attitude > 0) {
					return result + 0.01;
				} else {
					return 0.01 - result;
				}
			});
			"step 3";
			if (result.bool) {
				event.cards.addArray(result.cards);
			}
			if (targets.length) {
				event.goto(2);
			}
			"step 4";
			var cards = event.cards.filterInD("d");
			if (cards.length) {
				player.chooseButton(["寻道：选择一张作为新判定牌", cards], true).set("ai", button => {
					return trigger.judge(button.link);
				});
			} else {
				event.finish();
			}
			"step 5";
			if (result.bool) {
				var card = result.links[0];
				event.card = card;
				game.cardsGotoOrdering(card).relatedEvent = trigger;
			} else {
				event.finish();
			}
			"step 6";
			if (player.judging[0].clone) {
				game.broadcastAll(
					function (card, card2, player) {
						if (card.clone) {
							card.clone.classList.remove("thrownhighlight");
						}
						var node = player.$throwordered(card2.copy(), true);
						node.classList.add("thrownhighlight");
						ui.arena.classList.add("thrownhighlight");
					},
					player.judging[0],
					card,
					player
				);
				game.addVideo("deletenode", player, get.cardsInfo([player.judging[0].clone]));
			}
			game.cardsDiscard(player.judging[0]);
			player.judging[0] = card;
			trigger.orderingCards.add(card);
			game.log(player, "的判定牌改为", card);
			game.delay(2);
		},
		ai: {
			rejudge: true,
			tag: {
				rejudge: 1,
			},
		},
	},
	jsrglinghua: {
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
		},
		prompt2(event, player) {
			var zhunbei = event.name == "phaseZhunbei";
			return "进行目标为你" + (zhunbei ? "" : "且效果反转") + "的【闪电】判定。若你未因此受到伤害，你可以" + (zhunbei ? "令一名角色回复1点体力" : "对一名角色造成1点雷电伤害");
		},
		check(event, player) {
			var e2 = player.getEquip(2);
			if (e2 && e2.name == "taipingyaoshu") {
				return true;
			}
			if (
				event.name == "phaseZhunbei" &&
				game.hasPlayer(current => {
					return get.recoverEffect(current, player, player) >= 0;
				})
			) {
				return true;
			}
			if (
				event.name == "phaseJieshu" &&
				game.hasPlayer(current => {
					return get.damageEffect(current, player, player, "thunder") >= 0;
				}) &&
				player.hasSkillTag("rejudge") &&
				player.hasCard(card => {
					return lib.card.shandian.judge(card) < 0;
				}, "he")
			) {
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			var next = (event.executeDelayCardEffect = player.executeDelayCardEffect("shandian"));
			if (event.triggername != "phaseJieshuBegin") {
				return;
			}
			next.judge = card => -lib.card.shandian.judge(card) - 4;
			next.judge2 = result => !lib.card.shandian.judge2(result);
			"step 1";
			var executeDelayCardEffect = event.executeDelayCardEffect;
			if (!player.hasHistory("damage", evt => evt.getParent(2) == executeDelayCardEffect)) {
				if (trigger.name == "phaseZhunbei") {
					player.chooseTarget("灵化：是否令一名角色回复1点体力？").set("ai", target => {
						var player = _status.event.player;
						return get.recoverEffect(target, player, player);
					});
				} else {
					player.chooseTarget("灵化：是否对一名角色造成1点雷电伤害？").set("ai", target => {
						var player = _status.event.player;
						return get.damageEffect(target, player, player, "thunder");
					});
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				if (trigger.name == "phaseZhunbei") {
					target.recover();
				} else {
					target.damage("thunder");
				}
			}
		},
		ai: {
			threaten: 2.8,
		},
	},
	//江山如故·兴
	//贾南风
	jsrgshanzheng: {
		audio: 4,
		logAudio: index => (typeof index === "number" ? "jsrgshanzheng" + index + ".mp3" : 2),
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		filterTarget(card, player, target) {
			return player != target;
		},
		selectTarget: [1, Infinity],
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			await player.chooseToDebate(event.targets.concat([player])).set("callback", lib.skill.jsrgshanzheng.callback);
		},
		async callback(event, trigger, player) {
			const result = event.debateResult;
			if (result.bool && result.opinion) {
				if (result.opinion == "red") {
					const prompt = "是否对一名未参与议事的角色造成1点伤害？";
					const resultx = await player
						.chooseTarget(prompt, function (card, player, target) {
							const bool1 = current => !get.event("targets1").includes(current);
							return bool1(target);
						})
						.set("complexTarget", true)
						.set("targets1", result.targets)
						.set("ai", target => {
							return get.damageEffect(target, get.player()) >= 0;
						})
						.forResult();
					if (resultx.bool) {
						player.logSkill("jsrgshanzheng", resultx.targets, null, null, [3]);
						player.line(resultx.targets.sortBySeat(), "green");
						for (let target of resultx.targets.sortBySeat()) {
							await target.damage();
						}
					}
				} else if (result.opinion == "black") {
					let cards = [],
						targets = [];
					for (let color of result.opinions) {
						if (result[color]?.length) {
							cards.addArray(result[color].map(i => i[1]));
							targets.addArray(result[color].map(i => i[0]));
						}
					}
					targets.remove(player);
					player.logSkill("jsrgshanzheng", targets, null, null, [4]);
					if (cards.length) {
						await player.gain(cards, "giveAuto");
					}
				}
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					return 0.5 - Math.random();
				},
			},
		},
	},
	jsrgxiongbao: {
		audio: 2,
		trigger: {
			global: "chooseToDebateBegin",
		},
		filter(event, player) {
			if (!event.list.includes(player)) {
				return false;
			}
			if (event.fixedResult?.some(key => key[0] == player)) {
				return false;
			}
			return player.countCards("h") > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseCard(get.prompt(event.skill), 2, "本次议事你展示两张手牌").forResult();
		},
		async content(event, trigger, player) {
			if (!trigger.fixedResult) {
				trigger.fixedResult = [];
			}
			trigger.fixedResult.push([player, event.cards[0]]);
			trigger.fixedResult.push([player, event.cards[1]]);
			for (let i of trigger.list) {
				if (i == player || !i.countCards("h")) {
					continue;
				}
				trigger.fixedResult.push([i, i.getCards("h").randomGet()]);
			}
		},
	},
	jsrgliedu: {
		audio: 2,
		forced: true,
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && (current.hasSex("female") || current.countCards("h") > player.countCards("h"));
			});
		},
		async content(event, trigger, player) {
			trigger.directHit.addArray(
				game.filterPlayer(function (current) {
					return current != player && (current.hasSex("female") || current.countCards("h") > player.countCards("h"));
				})
			);
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return arg.target.hasSex("female") || arg.target.countCards("h") > player.countCards("h");
			},
		},
	},
	//文鸯
	jsrgfuzhen: {
		audio: 4,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => player.canUse({ name: "sha", nature: "thunder", isCard: true }, current, false));
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseTarget(get.prompt(event.skill), "视为对至多三名其他角色使用一张雷【杀】（选择的第一名目标为秘密目标）")
				.set("filterTarget", function (card, player, target) {
					return player.canUse({ name: "sha", nature: "thunder", isCard: true }, target, false);
				})
				.set("selectTarget", [1, 3])
				.set("complexTarget", true)
				.set("ai", target => {
					const player = get.player();
					if (player.hp <= 1) {
						return 0;
					}
					let eff = get.effect(target, { name: "sha", nature: "thunder", isCard: true }, player, player);
					if (!ui.selected.targets.length && !target.mayHaveShan(player, "use")) {
						eff *= 2;
					}
					return eff;
				})
				.set("targetprompt", ["秘密目标", "出杀目标"])
				.forResult();
			if (result.bool) {
				event.result = {
					bool: true,
					cost_data: result.targets[0],
					targets: result.targets.sortBySeat(),
				};
			} else {
				event.result = { bool: false };
			}
		},
		logAudio: index => (typeof index == "number" ? "jsrgfuzhen" + index + ".mp3" : 2),
		async content(event, trigger, player) {
			const targets = event.targets,
				silentTarget = event.cost_data;
			await player.loseHp();
			const card = get.autoViewAs({ name: "sha", nature: "thunder", isCard: true });
			player
				.when("useCardAfter")
				.filter(evt => evt.getParent() == event)
				.then(() => {
					player.logSkill("jsrgfuzhen", null, null, null, [get.rand(3, 4)]);
					const sum = player
						.getHistory("sourceDamage", evt => evt.card && evt.card == trigger.card)
						.reduce((num, evt) => {
							return num + evt.num;
						}, 0);
					if (sum) {
						player.draw(sum);
					}
				})
				.then(() => {
					player.line(silentTarget, "green");
					game.log(player, "选择的秘密目标是", silentTarget);
					game.delay();
				})
				.then(() => {
					if (silentTarget && !silentTarget.getHistory("damage", evt => evt.card == trigger.card).length) {
						const cardx = get.autoViewAs({ name: "sha", nature: "thunder", isCard: true });
						const targetx = targets.filter(target => target.isIn() && player.canUse(cardx, target, false));
						if (targetx.length) {
							player.useCard(cardx, targets);
						}
					}
				})
				.vars({
					silentTarget: silentTarget,
					targets: targets,
				});
			await player.useCard(card, targets).set("forceDie", true);
		},
	},
	//诞神
	jsrgbeizhi: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0 && game.hasPlayer(current => lib.skill.jsrgbeizhi.filterTarget(null, player, current));
		},
		async content(event, trigger, player) {
			const result = await player.chooseToCompare(event.target).forResult();
			if (result.winner) {
				const winner = result.winner,
					target = winner == player ? event.target : player,
					card = { name: "juedou", isCard: true };
				if (!winner.canUse(card, target)) {
					return;
				}
				let targets = game.filterPlayer(current => winner.canUse(card, current));
				if (targets.length > 3) {
					const result2 = await winner
						.chooseTarget("悖志：选择使用【决斗】的目标", true, 3)
						.set("filterTarget", (card, player, target) => {
							if (!ui.selected.targets.length) {
								return target == get.event("targetx");
							}
							return get.event("useTargets").includes(target);
						})
						.set("complexTarget", true)
						.set("targetx", target)
						.set("useTargets", targets)
						.set("ai", target => {
							const player = get.player();
							return get.effect(target, { name: "juedou", isCard: true }, player, player);
						})
						.forResult();
					targets = result2.targets;
				}
				winner.addTempSkill("jsrgbeizhi_effect");
				await winner.useCard(card, targets);
				winner.removeSkill("jsrgbeizhi_effect");
			}
		},
		subSkill: {
			effect: {
				trigger: {
					global: "damageSource",
				},
				forced: true,
				direct: true,
				charlotte: true,
				filter(event, player) {
					if (!event.source || !event.source.isIn()) {
						return false;
					}
					if (!event.player.isIn() || !event.player.countGainableCards(event.source, "he")) {
						return false;
					}
					return event.card?.name == "juedou" && event.getParent("jsrgbeizhi", true);
				},
				async content(event, trigger, player) {
					await trigger.source.gainPlayerCard(trigger.player, "he", true);
				},
			},
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
	jsrgshenji: {
		trigger: { global: "useCardToTargeted" },
		filter(event, player) {
			if (!event.targets || event.targets.length <= 1) {
				return false;
			}
			if (event.targets.length != event.getParent().triggeredTargets4.length) {
				return false;
			}
			return event.targets.includes(player);
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			const evt = trigger.getParent();
			evt.targets = [...evt.targets.remove(player), player];
			evt.triggeredTargets4 = [...evt.triggeredTargets4.remove(player), player];
		},
	},
	//王濬
	jsrgchengliu: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("e") < player.countCards("e"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.countCards("e") < player.countCards("e");
				})
				.set("ai", target => {
					return get.damageEffect(target, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			let target = event.targets[0],
				targets = [];
			while (target.isIn()) {
				await target.damage();
				targets.add(target);
				const result = await player
					.chooseToDiscard(`是否弃置装备区里的一张牌？`, "e")
					.set("ai", card => {
						if (get.event("goon")) {
							return 10 - get.value(card);
						}
						return 0;
					})
					.set(
						"goon",
						(function () {
							return game.hasPlayer(current => {
								if (targets.includes(current)) {
									return false;
								}
								return current.countCards("e") + 1 < player.countCards("e") && get.damageEffect(current, player, player) > 0;
							});
						})()
					)
					.forResult();
				if (result.bool) {
					if (!game.hasPlayer(current => current.countCards("e") < player.countCards("e"))) {
						break;
					}
					const result2 = await player
						.chooseTarget("###是否继续发动〖乘流〗？###对装备区牌数小于你的一名角色造成1点伤害", (card, player, target) => {
							if (get.event("targets").includes(target)) {
								return false;
							}
							return target.countCards("e") < player.countCards("e");
						})
						.set("targets", targets)
						.set("ai", target => {
							return get.damageEffect(target, get.player(), get.player());
						})
						.forResult();
					if (result2.bool) {
						await player.logSkill(event.name, result2.targets);
						target = result2.targets[0];
					} else {
						break;
					}
				} else {
					break;
				}
			}
		},
	},
	jsrgjianlou: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
		},
		filter(event, player) {
			if (!player.countCards("he")) {
				return false;
			}
			if (!event.getd || !event.getl) {
				return false;
			}
			let cards = event.getd();
			return cards.some(card => {
				if (get.position(card) != "d") {
					return false;
				}
				if (get.type(card) != "equip") {
					return false;
				}
				if (!player.canEquip(card, true)) {
					return false;
				}
				return game.hasPlayer(current => {
					let evt = event.getl(current);
					if (!(evt?.es?.includes(card) || evt?.js?.includes(card))) {
						return false;
					}
					if (card.willBeDestroyed("discardPile", current, event)) {
						return false;
					}
					return true;
				});
			});
		},
		usable: 1,
		async cost(event, trigger, player) {
			const cards = trigger.getd().filter(card => {
				if (get.type(card) != "equip") {
					return false;
				}
				if (!player.canEquip(card, true)) {
					return false;
				}
				return game.hasPlayer(current => {
					let evt = trigger.getl(current);
					if (evt?.es?.includes(card)) {
						return true;
					}
					if (evt?.js?.includes(card)) {
						return true;
					}
					return false;
				});
			});
			const result = await player
				.chooseButton([get.prompt2(event.skill), cards])
				.set("ai", button => {
					const player = get.player();
					return get.equipValue(button.link, player);
				})
				.forResult();
			event.result = {
				bool: result.bool,
				cards: result?.links,
			};
		},
		async content(event, trigger, player) {
			const card = event.cards[0];
			const result = await player
				.chooseToDiscard(`舰楼：弃置一张牌并获得${get.translation(card)}`, "he", true)
				.set("ai", card => {
					const cardx = get.event("cardx");
					if (get.position(card) == "e" && get.subtype(card) == get.subtype(cardx)) {
						return 15 - get.value(card);
					}
					return get.equipValue(card) - get.value(card);
				})
				.set("cardx", card)
				.forResult();
			player.gain(card, "gain2");
			if (!player.countCards("e", cardx => get.subtype(cardx) == get.subtype(card)) && player.canEquip(card)) {
				await game.delayx();
				player.$give(card, player, false);
				await player.equip(card);
			}
		},
	},
	//李密
	jsrgciyin: {
		audio: 3,
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countCards("hes") || player.hasSkill("jsrgciyin_used")) {
				return false;
			}
			if (!event.ciyin_suits || player.countCards("hes") < Math.max(4 - event.ciyin_suits.length, 1)) {
				return false;
			}
			for (var i of lib.inpile) {
				var type = get.type(i);
				if (type == "basic" && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					return true;
				}
			}
			return false;
		},
		onChooseToUse(event) {
			if (game.online) {
				return;
			}
			let suits = [];
			game.getGlobalHistory("cardMove", function (evt) {
				if (suits.length >= 3) {
					return;
				}
				if (evt.name == "lose") {
					if (evt.position == ui.discardPile) {
						for (var i of evt.cards) {
							suits.add(get.suit(i, false));
						}
					}
				} else {
					if (evt.name == "cardsDiscard") {
						for (var i of evt.cards) {
							suits.add(get.suit(i, false));
						}
					}
				}
			});
			event.set("ciyin_suits", suits);
		},
		onChooseToRespond(event) {
			if (game.online) {
				return;
			}
			let suits = [];
			game.getGlobalHistory("cardMove", function (evt) {
				if (suits.length >= 3) {
					return;
				}
				if (evt.name == "lose") {
					if (evt.position == ui.discardPile) {
						for (var i of evt.cards) {
							suits.add(get.suit(i, false));
						}
					}
				} else {
					if (evt.name == "cardsDiscard") {
						for (var i of evt.cards) {
							suits.add(get.suit(i, false));
						}
					}
				}
			});
			event.set("ciyin_suits", suits);
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
							list.push(["基本", "", "sha"]);
						}
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
								list.push(["基本", "", "sha", nature]);
							}
						}
					} else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("辞应", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				var player = _status.event.player;
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) {
					return 0;
				}
				return (
					player.getUseValue({
						name: button.link[2],
						nature: button.link[3],
					}) - 3
				);
			},
			backup(links, player) {
				return {
					filterCard: true,
					selectCard() {
						const num = Math.max(4 - _status.event.ciyin_suits.length, 1);
						return [num, Infinity];
					},
					audio: ["jsrgciyin1.mp3", "jsrgciyin2.mp3"],
					ai1(card) {
						const suits = _status.event.ciyin_suits;
						if (!suits.includes(get.suit(card))) {
							return 15 - get.value(card);
						}
						return 4 - get.value(card);
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.addTempSkill("jsrgciyin_used");
					},
				};
			},
			prompt(links, player) {
				const num = Math.max(4 - _status.event.ciyin_suits.length, 1);
				return "将至少" + get.cnNumber(num) + "张牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用或打出";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			var type = get.type(name);
			return type == "basic" && player.countCards("seh") > 0 && !player.hasSkill("jsrgciyin_used");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countCards("hes") || player.hasSkill("jsrgciyin_used")) {
					return false;
				}
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
		group: "jsrgciyin_draw",
		subSkill: {
			draw: {
				audio: "jsrgciyin3.mp3",
				trigger: { global: ["cardsDiscardAfter"] },
				forced: true,
				filter(event, player) {
					const evt = event.getParent();
					if (evt.name != "orderingDiscard") {
						return false;
					}
					const evtx = evt.relatedEvent || evt.getParent();
					if (evtx.skill != "jsrgciyin_backup" || evtx.player != player) {
						return false;
					}
					let suits = [];
					game.getGlobalHistory("cardMove", function (evt) {
						if (suits.length >= 4) {
							return;
						}
						if (evt.name == "lose") {
							if (evt.position == ui.discardPile) {
								for (var i of evt.cards) {
									suits.add(get.suit(i, false));
								}
							}
						} else {
							if (evt.name == "cardsDiscard") {
								for (var i of evt.cards) {
									suits.add(get.suit(i, false));
								}
							}
						}
					});
					return suits.length >= 4 && player.countCards("h") < player.maxHp;
				},
				content() {
					player.drawTo(player.maxHp);
				},
			},
			backup: {},
			used: {
				charlotte: true,
			},
		},
	},
	jsrgchendu: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"],
		},
		locked: true,
		filter(event, player, name) {
			if (name == "cardsDiscardAfter") {
				const evt = event.getParent();
				if (evt.name != "orderingDiscard") {
					return false;
				}
				const evtx = evt.relatedEvent || evt.getParent();
				if (!["useCard", "respond"].includes(evtx.name) || evtx.player != player) {
					return false;
				}
				return event.cards.filterInD("d").length > player.hp;
			}
			if (event.type != "discard" || event.getlx === false) {
				return false;
			}
			let evt = event.getl(player);
			if (!evt || !evt.cards2 || !evt.cards2.length) {
				return false;
			}
			return evt.cards2.length > player.hp;
		},
		async cost(event, trigger, player) {
			const cards = event.triggername == "cardsDiscardAfter" ? trigger.cards.filterInD("d") : trigger.getl(player).cards2;
			let map = {},
				targetx = [];
			if (_status.connectMode) {
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			}
			do {
				const {
					result: { bool, links },
				} =
					cards.length == 1
						? { result: { links: cards.slice(0), bool: true } }
						: await player.chooseCardButton("陈笃：请选择要分配的牌", true, cards, [1, cards.length]).set("ai", button => {
								if (ui.selected.buttons.length == 0) {
									return 20 - get.value(button.link);
								}
								return 0;
						  });
				if (!bool) {
					return;
				}
				cards.removeArray(links);
				const togive = links.slice(0);
				const {
					result: { targets },
				} = await player
					.chooseTarget("选择一名角色获得" + get.translation(links), true)
					.set("filterTarget", (card, player, target) => {
						if (player != _status.currentPhase && !get.event("gived")) {
							if (target != _status.currentPhase) {
								return false;
							}
						}
						return target != player;
					})
					.set("gived", targetx.length > 0)
					.set("ai", target => {
						const att = get.attitude(_status.event.player, target);
						if (_status.event.enemy) {
							return -att;
						} else if (att > 0) {
							return att / (1 + target.countCards("h"));
						} else {
							return att / 100;
						}
					})
					.set("enemy", get.value(togive[0], player, "raw") < 0);
				if (targets.length) {
					targetx.addArray(targets);
					const playerid = targets[0].playerid;
					if (!map[playerid]) {
						map[playerid] = [];
					}
					map[playerid].addArray(togive);
				}
			} while (cards.length > 0);
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			const list = [];
			for (const i in map) {
				const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				list.push([source, map[i]]);
			}
			event.result = {
				bool: true,
				targets: targetx,
				cost_data: list,
			};
		},
		async content(event, trigger, player) {
			const list = event.cost_data;
			await game
				.loseAsync({
					gain_list: list,
					player: player,
					cards: list.map(i => i[1]).flat(),
					giver: player,
					animate: "gain2",
				})
				.setContent("gaincardMultiple");
		},
	},
	//司马昭
	jsrgqiantun: {
		audio: 4,
		logAudio: index => (typeof index === "number" ? "jsrgqiantun" + index + ".mp3" : 2),
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target) && target.countCards("h") && target != player;
		},
		async content(event, trigger, player) {
			const target = event.target,
				cards = target.getCards("h").sort((a, b) => get.number(a, target) - get.number(b, target));
			const result = await target
				.chooseCard("展示任意张手牌，只能用这些牌拼点", [1, Infinity], "h", true)
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
			target.addGaintag(result.cards, "jsrgqiantun_tag");
			const next = player.chooseToCompare(target);
			next.set("filterCard", (card, player) => {
				const bool = cardx => cardx.hasGaintag("jsrgqiantun_tag");
				return !player?.countCards("h", bool) || bool(card);
			});
			if (target.countCards("h") + 1 > result.cards.length * 2) {
				next.set("small", true);
			}
			const result3 = await next.forResult();
			target.removeGaintag("jsrgqiantun_tag");
			if (result3.winner == player) {
				player.logSkill("jsrgqiantun", [target], null, null, [3]);
				const cards = target.getCards("h", card => result.cards.includes(card));
				if (cards.length) {
					await target.give(cards, player);
				}
			} else {
				player.logSkill("jsrgqiantun", [target], null, null, [4]);
				const cards = target.getCards("h", card => !result.cards.includes(card));
				if (cards.length) {
					await target.give(cards, player);
				}
			}
			await player.showHandcards(get.translation(player) + "发动了【谦吞】");
		},
		ai: {
			order: 8,
			result: {
				target: -1,
			},
		},
	},
	jsrgxiezheng: {
		audio: 2,
		audioname: ["jin_jsrg_simazhao"],
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("h"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, 3], function (card, player, target) {
					return target.countCards("h");
				})
				.set(
					"goon",
					(function () {
						return (
							player.hasValueTarget({ name: "binglinchengxiax" }) &&
							(player.hp > 2 ||
								!player.hasAllHistory("useSkill", evt => {
									return evt.skill == "jsrgxiezheng";
								}))
						);
					})()
				)
				.set("ai", target => {
					const { player, goon } = get.event();
					if (!goon) {
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
			for (const target of event.targets.sortBySeat()) {
				if (!target.countCards("h")) {
					continue;
				}
				const result = await target
					.chooseCard("h", true, "将一张手牌置于牌堆顶")
					.set("targetx", player)
					.set("ai", card => {
						const { player, targetx } = get.event();
						let att = 0;
						if (player && targetx) {
							att = get.sgnAttitude(player, targetx);
						}
						let val = 7 - get.value(card);
						if (card.name == "sha") {
							val += att * 4;
						}
						return val;
					})
					.forResult();
				if (result?.bool && result?.cards?.length) {
					target.$throw(1, 1000);
					game.log(target, "将", "#y一张手牌", "置于了牌堆顶");
					await target.lose(result.cards, ui.cardPile, "insert");
					game.updateRoundNumber();
				}
			}
			const card = { name: "binglinchengxiax", isCard: true, xiezheng: true };
			if (player.hasUseTarget(card)) {
				await player.chooseUseTarget(card, true);
			}
			if (
				!game.hasPlayer2(current => {
					return current.getHistory("damage", evt => evt.getParent(card.name)?.card?.xiezheng).length;
				})
			) {
				await player.loseHp();
			}
		},
	},
	jsrgzhaoxiong: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.isDamaged() && player.hasAllHistory("useSkill", evt => evt.skill == "jsrgxiezheng");
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.changeSkin({ characterName: "jsrg_simazhao" }, "jin_jsrg_simazhao");
			await player.changeGroup("jin");
			await player.changeSkills(["jsrgweisi", "jsrgdangyi"], ["jsrgqiantun"]);
		},
		derivation: ["jsrgweisi", "jsrgdangyi"],
		ai: {
			combo: "jsrgxiezheng",
		},
	},
	jsrgweisi: {
		audio: 3,
		enable: "phaseUse",
		logAudio: index => (typeof index === "number" ? "jsrgweisi" + index + ".mp3" : 2),
		usable: 1,
		filterTarget(card, player, target) {
			return target != player;
		},
		async content(event, trigger, player) {
			const { target } = event;
			if (target.countCards("h")) {
				const result = await target
					.chooseCard("将任意张手牌移出游戏直到本回合结束", [1, Infinity], "h")
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
					next.gaintag.add("jsrgweisi");
					await next;
					target
						.when({
							global: ["phaseBefore", "phaseAfter"],
						})
						.then(() => {
							const cards = player.getExpansions("jsrgweisi");
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
				.then(() => {
					const cards = trigger.player.getCards("h");
					if (cards.length) {
						trigger.player.give(cards, player);
						player.logSkill("jsrgweisi", [trigger.player], null, null, [3]);
					}
				});
			if (player.canUse(card, target)) {
				await player.useCard(card, target);
			}
		},
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				var cards = player.getExpansions("jsrgweisi");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
		},
		ai: {
			order: 9,
			result: { target: -1 },
		},
	},
	jsrgdangyi: {
		init(player, skill) {
			player.setMark(skill, skill === "mbdangyi" ? 2 : player.getDamagedHp() + 1, false);
			game.broadcastAll(function (player) {
				if (
					(() => {
						for (const sheet of document.styleSheets) {
							try {
								const rules = sheet.cssRules || sheet.rules;
								for (const rule of rules) {
									if (rule.selectorText === ".player .playerjiu_dangyi") {
										return false;
									}
								}
							} catch (e) {
								continue;
							}
						}
						return true;
					})()
				) {
					lib.init.sheet(".player .playerjiu_dangyi { animation: game_start 0.5s; -webkit-animation: game_start 0.5s; position: absolute; width: 100%; height: 100%; left: 0; top: 0; z-index: 4; pointer-events: none; background: linear-gradient( to top, rgba(255, 0, 0, 0.3) 0%, rgba(255, 0, 0, 0.3) 60%, rgba(255, 0, 0, 0) 80%, rgba(255, 0, 0, 0) 100% );}");
				}
				if (!player.node.jiu_dangyi) {
					player.node.jiu_dangyi = ui.create.div(".playerjiu_dangyi", player.node.avatar);
					player.node.jiu_dangyi2 = ui.create.div(".playerjiu_dangyi", player.node.avatar2);
				}
			}, player);
		},
		zhuSkill: true,
		trigger: { source: "damageBegin1" },
		check(event, player) {
			return (
				get.attitude(player, event.player) < 0 &&
				!event.player.hasSkillTag("filterDamage", null, {
					player: player,
					card: event.card,
				})
			);
		},
		logTarget: "player",
		filter(event, player) {
			return player.countMark("jsrgdangyi_used") < player.countMark("jsrgdangyi");
		},
		async content(event, trigger, player) {
			player.addSkill(event.name + "_used");
			player.addMark(event.name + "_used", 1, false);
			trigger.num++;
			game.broadcastAll(
				function (player, name) {
					if (player.countMark(name + "_used") >= player.countMark(name) && player.node.jiu_dangyi) {
						player.node.jiu_dangyi.delete();
						player.node.jiu_dangyi2.delete();
						delete player.node.jiu_dangyi;
						delete player.node.jiu_dangyi2;
					}
				},
				player,
				event.name
			);
		},
		audio: 2,
		mark: true,
		intro: {
			markcount(storage = 0, player, skill) {
				const used = `${skill}_used`;
				return `${storage - player.countMark(used)}/${storage}`;
			},
			content(storage = 0, player, skill) {
				return `剩余可发动次数为${storage - player.countMark(`${skill}_used`)}`;
			},
		},
		onremove(player, skill) {
			delete player.storage[skill];
			game.broadcastAll(function (player) {
				if (player.node.jiu_dangyi) {
					player.node.jiu_dangyi.delete();
					player.node.jiu_dangyi2.delete();
					delete player.node.jiu_dangyi;
					delete player.node.jiu_dangyi2;
				}
			}, player);
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	jsrgzuozhan: {
		audio: 4,
		logAudio: () => 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseTarget([1, 2], lib.filter.notMe, get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player();
					let val = target.hp;
					if (get.attitude(player, target) > 0) {
						val *= 2;
					}
					return val;
				})
				.forResult();
			if (!result?.targets) {
				result.targets = [];
			}
			event.result = {
				bool: true,
				targets: [player, ...result.targets],
			};
		},
		async content(event, trigger, player) {
			player.markAuto("jsrgzuozhan", event.targets);
			event.targets.sort((a, b) => b.hp - a.hp);
			player.addMark("jsrgzuozhan_range", Math.min(event.targets[0].hp, 5));
			player.markSkill("jsrgzuozhan");
		},
		mod: {
			attackFrom(from, to, distance) {
				return distance - from.countMark("jsrgzuozhan_range");
			},
		},
		intro: {
			markcount(storage, player) {
				let num = 0;
				num += player.countMark("jsrgzuozhan_range");
				num -= player.countMark("jsrglangan_range");
				if (num == 0) {
					return null;
				}
				return num;
			},
			mark(dialog, storage, player) {
				if (storage) {
					dialog.addSmall([storage.map(key => key.name), "character"]);
				}
				let num = 0;
				num += player.countMark("jsrgzuozhan_range");
				num -= player.countMark("jsrglangan_range");
				if (num != 0) {
					dialog.addText(`攻击范围${num > 0 ? "+" : ""}${num}`);
				}
			},
		},
		group: "jsrgzuozhan_gain",
		subSkill: {
			gain: {
				audio: ["jsrgzuozhan3.mp3", "jsrgzuozhan4.mp3"],
				trigger: {
					global: "dieAfter",
				},
				filter(event, player) {
					if (!player.isIn() && event.player != player) {
						return false;
					}
					if (!player.getStorage("jsrgzuozhan").includes(event.player)) {
						return false;
					}
					return game.hasPlayer(current => current.isIn() && player.getStorage("jsrgzuozhan").includes(current));
				},
				forceDie: true,
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget("坐瞻：令一名“坐瞻”角色获得" + player.countMark("jsrgzuozhan_range") + "张不同牌名的基本牌", true)
						.set("filterTarget", (card, player, target) => {
							return target.isIn() && player.getStorage("jsrgzuozhan").includes(target);
						})
						.set("ai", target => {
							return get.attitude(get.player(), target);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					let cards = [],
						num = player.countMark("jsrgzuozhan_range");
					while (cards.length < num) {
						const card = get.discardPile(card => {
							if (get.type(card) != "basic") {
								return false;
							}
							if (!cards.length) {
								return true;
							}
							return cards.every(cardx => cardx.name != card.name);
						});
						if (card) {
							cards.add(card);
						} else {
							break;
						}
					}
					if (cards.length) {
						await event.targets[0].gain(cards, "gain2");
					}
				},
			},
		},
	},
	jsrgcuibing: {
		audio: 5,
		trigger: {
			player: "phaseUseEnd",
		},
		forced: true,
		logAudio(event, player) {
			const num = Math.min(
					5,
					game.countPlayer(current => player.inRange(current))
				),
				numx = player.countCards("h");
			if (num > numx) {
				return 2;
			}
			if (num == numx) {
				return ["jsrgcuibing5.mp3"];
			}
			return ["jsrgcuibing3.mp3", "jsrgcuibing4.mp3"];
		},
		async content(event, trigger, player) {
			const num = Math.min(
					5,
					game.countPlayer(current => player.inRange(current))
				),
				numx = player.countCards("h");
			if (numx > num) {
				await player.chooseToDiscard("h", numx - num, true);
				let discard = numx - num,
					i = 0;
				while (game.hasPlayer(current => current.countCards("ej")) && i < discard) {
					const result = await player
						.chooseTarget("是否弃置场上的牌？", (card, player, target) => {
							return target.countCards("ej");
						})
						.set("ai", target => {
							let att = get.attitude(get.player(), target);
							if (att > 0 && target.countCards("j")) {
								return 1;
							}
							if (att < 0 && target.countCards("e")) {
								return 2;
							}
							return 0;
						})
						.forResult();
					if (result.bool) {
						const result2 = await player.discardPlayerCard(result.targets[0], "ej", [1, discard - i]).forResult();
						if (result2?.bool && result2?.links?.length) {
							i += result2.links.length;
						} else {
							break;
						}
					} else {
						break;
					}
				}
			} else {
				await player.drawTo(num);
				player.addTempSkill("jsrgcuibing_keji");
			}
		},
		subSkill: {
			keji: {
				trigger: { player: "phaseDiscardBefore" },
				direct: true,
				charlotte: true,
				async content(event, trigger, player) {
					trigger.cancel();
				},
			},
		},
	},
	jsrglangan: {
		audio: 2,
		trigger: { global: "dieAfter" },
		forced: true,
		async content(event, trigger, player) {
			await player.recover();
			await player.draw(2);
			if (player.countMark("jsrglangan_range") < 3) {
				player.addMark("jsrglangan_range", 1, false);
			}
			player.markSkill("jsrgzuozhan");
		},
		ai: {
			threaten: 1.5,
		},
	},
	//邓艾
	jsrgpiqi: {
		enable: "phaseUse",
		viewAs: {
			name: "shunshou",
			isCard: true,
			storage: {
				jsrgpiqi: true,
			},
		},
		filterCard: () => false,
		selectCard: -1,
		filter(event, player) {
			const card = { name: "shunshou", isCard: true, storage: { jsrgpiqi: true } };
			return (
				player.countMark("jsrgpiqi_used") < 2 &&
				game.hasPlayer(current => {
					return lib.skill.jsrgpiqi.filterTarget(card, player, current);
				})
			);
		},
		filterTarget(card, player, target) {
			if (player.getStorage("jsrgpiqi_targets").includes(target)) {
				return false;
			}
			return lib.filter.targetEnabled2(card, player, target);
		},
		precontent() {
			player.addTempSkill("jsrgpiqi_used", "phaseUseAfter");
			player.addMark("jsrgpiqi_used", 1, false);
			player.addTempSkill("jsrgpiqi_targets", "phaseUseAfter");
			let targets = event.result.targets;
			player.markAuto("jsrgpiqi_targets", targets);
			for (let target of game.players) {
				if (targets.some(current => get.distance(target, current) <= 1)) {
					target.addTempSkill("jsrgpiqi_kanpo");
				}
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			targets: {
				charlotte: true,
				onremove: true,
			},
			kanpo: {
				enable: "chooseToUse",
				filterCard(card) {
					return get.name(card) == "shan";
				},
				viewAsFilter(player) {
					return player.countCards("hes", "shan") > 0;
				},
				viewAs: { name: "wuxie" },
				position: "hes",
				prompt: "将一张闪当无懈可击使用",
				check(card) {
					const tri = _status.event.getTrigger();
					if (tri && tri.card && tri.card.name == "chiling") {
						return -1;
					}
					return 8 - get.value(card);
				},
			},
		},
	},
	jsrgzhoulin: {
		trigger: {
			player: ["phaseBegin", "phaseAfter"],
			source: "damageBegin1",
		},
		filter(event, player, name) {
			if (event.name == "damage") {
				return event.card?.name == "sha" && player.getStorage("jsrgzhoulin").includes(event.player);
			}
			if (name == "phaseAfter") {
				return player.getStorage("jsrgzhoulin").length;
			}
			return game.hasPlayer(current => !player.inRange(current) && current != player);
		},
		direct: true,
		async content(event, trigger, player) {
			if (event.triggername == "phaseBegin") {
				player.markAuto(
					event.name,
					game.filterPlayer(current => !player.inRange(current) && current != player)
				);
			} else if (trigger.name == "phase") {
				player.unmarkAuto(event.name, player.getStorage(event.name));
			} else {
				player.logSkill(event.name, trigger.player);
				trigger.num++;
			}
		},
		intro: {
			content: "本回合对$使用杀造成伤害+1",
		},
	},
	//司马亮
	jsrgsheju: {
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (
				[event.player, event.target].some(target => {
					return !target?.isIn() || !target.countCards("h");
				})
			) {
				return false;
			}
			return event.card.name === "sha" && event.targets.length === 1;
		},
		forced: true,
		logTarget(event, player) {
			return event.player === player ? event.target : event.player;
		},
		content() {
			player.chooseToDebate([player, event.targets[0]]).set("callback", async event => {
				const result = event.debateResult;
				if (result?.bool) {
					if (result.opinion === "black") {
						for (const i of result.targets) {
							await i.loseMaxHp();
						}
					} else if (result.black.length) {
						const targets = result.black.map(i => i[0]);
						if (targets.length == 1) {
							await targets[0].draw(2);
						} else {
							await game.asyncDraw(targets, 2);
							await game.delayx();
						}
					}
				}
			});
		},
	},
	jsrgzuwang: {
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		filter(event, player) {
			return player.countCards("h") < player.maxHp;
		},
		forced: true,
		content() {
			player.drawTo(player.maxHp);
		},
	},
	//秃发树机能
	jsrgqinrao: {
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return (
				event.player !== player &&
				player.hasCard(card => {
					return player.canUse(get.autoViewAs({ name: "juedou" }, [card]), event.player, false);
				}, "hes")
			);
		},
		direct: true,
		clearTime: true,
		content() {
			const target = trigger.player;
			const next = player.chooseToUse();
			next.set("openskilldialog", get.prompt2("jsrgqinrao", target));
			next.set("norestore", true);
			next.set("_backupevent", "jsrgqinrao_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("jsrgqinrao_backup");
			next.set("targetRequired", true);
			next.set("complexTarget", true);
			next.set("complexSelect", true);
			next.set("filterTarget", function (card, player, target) {
				if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
					return false;
				}
				return lib.filter.targetEnabled.apply(this, arguments);
			});
			next.set("sourcex", target);
			next.set("addCount", false);
			next.logSkill = "jsrgqinrao";
		},
		subSkill: {
			backup: {
				viewAs: {
					name: "juedou",
					storage: { jsrgqinrao: true },
				},
				filterCard(card) {
					return get.itemtype(card) === "card";
				},
				position: "hes",
				check(card) {
					return 5 - get.value(card);
				},
				log: false,
				precontent() {
					player.addTempSkill("jsrgqinrao_effect");
				},
			},
			effect: {
				charlotte: true,
				trigger: { global: "chooseToRespondBegin" },
				filter(event, player) {
					if (event.player === player || event.getParent().name !== "juedou") {
						return false;
					}
					const evt = event.getParent(2);
					return evt?.name === "useCard" && evt.player === player && evt.card.storage?.jsrgqinrao;
				},
				forced: true,
				popup: false,
				content() {
					const target = trigger.player;
					if (
						target.hasCard(card => {
							return get.name(card) === "sha" && trigger.filterCard(card, target, trigger) && lib.filter.cardRespondable(card, target, trigger);
						}, "h")
					) {
						trigger.set("forced", true);
					} else {
						target.showHandcards();
					}
				},
			},
		},
	},
	jsrgfuran: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source?.isIn() && !event.source.inRange(player);
		},
		frequent: true,
		logTarget: "source",
		content() {
			player.addTempSkill("jsrgfuran_recover");
			player.addMark("jsrgfuran_recover", 1, false);
		},
		subSkill: {
			recover: {
				charlotte: true,
				onremove: true,
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					await player.recover(player.countMark(event.name));
					player.removeSkill(event.name);
				},
				intro: { content: "本回合结束时回复#点体力" },
			},
		},
	},
	//陆抗
	jsrgzhuwei: {
		enable: "phaseUse",
		filter(event, player) {
			return player.canMoveCard(null, true);
		},
		usable: 1,
		async content(event, trigger, player) {
			let map = {},
				map2 = {};
			game.filterPlayer(target => (map[target.playerid] = game.countPlayer(current => target.inRange(current))));
			await player.moveCard(true).set("nojudge", true);
			game.filterPlayer(target => (map2[target.playerid] = game.countPlayer(current => target.inRange(current))));
			const targets = game.filterPlayer(target => {
				if (typeof map[target.playerid] !== "number" || typeof map2[target.playerid] !== "number") {
					return false;
				}
				return map[target.playerid] > 0 && map2[target.playerid] === 0;
			});
			if (targets.length) {
				const result = await player
					.chooseTarget("是否令一名攻击范围内变为没有角色的角色失去2点体力？", (card, player, target) => {
						return get.event().targets.includes(target);
					})
					.set("targets", targets)
					.set("ai", target => {
						const player = get.player();
						return get.effect(target, { name: "losehp" }, player, player);
					})
					.forResult();
				if (result.bool) {
					const target = result.targets[0];
					player.line(target);
					await target.loseHp(2);
				}
			}
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					return player.canMoveCard(true, true) ? 1 : 0;
				},
			},
		},
	},
	jsrgkuangjian: {
		enable: "chooseToUse",
		filter(event, player) {
			return get
				.inpileVCardList(info => {
					return get.type(info[2]) == "basic";
				})
				.some(card => {
					return player.hasCard(cardx => {
						if (get.type(cardx) !== "equip") {
							return false;
						}
						return event.filterCard({ name: card[2], nature: card[3], storage: { jsrgkuangjian: true }, cards: [cardx] }, player, event);
					}, "hes");
				});
		},
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => {
						return get.type(info[2]) == "basic";
					})
					.filter(card => {
						return player.hasCard(cardx => {
							if (get.type(cardx) !== "equip") {
								return false;
							}
							return event.filterCard({ name: card[2], nature: card[3], storage: { jsrgkuangjian: true }, cards: [cardx] }, player, event);
						}, "hes");
					});
				return ui.create.dialog("匡谏", [list, "vcard"]);
			},
			filter(button, player) {
				const evt = get.event().getParent();
				return evt.filterCard({ name: button.link[2], nature: button.link[3], storage: { jsrgkuangjian: true } }, player, evt);
			},
			check(button) {
				if (get.event().type != "phase") {
					return 1;
				}
				return player.getUseValue({ name: button.link[2], nature: button.link[3], storage: { jsrgkuangjian: true } });
			},
			backup(links, player) {
				return {
					audio: "jsrgkuangjian",
					filterCard: { type: "equip" },
					popname: true,
					check(card) {
						return 6 - get.value(card);
					},
					position: "hes",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						storage: { jsrgkuangjian: true },
					},
					precontent() {
						player.addTempSkill("jsrgkuangjian_effect");
					},
				};
			},
			prompt(links, player) {
				return "###匡谏###将一张装备牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
			},
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.storage?.jsrgkuangjian) {
					return Infinity;
				}
			},
			playerEnabled(card, player, target) {
				if (target === player && card.storage?.jsrgkuangjian) {
					return false;
				}
			},
		},
		locked: false,
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			return (
				get.type(name) == "basic" &&
				player.hasCard(card => {
					if (get.position(card) === "h" && _status.connectMode) {
						return true;
					}
					return get.type(card) === "equip";
				}, "hes")
			);
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") {
					return false;
				}
				if (
					!player.hasCard(card => {
						if (get.position(card) === "h" && _status.connectMode) {
							return true;
						}
						return get.type(card) === "equip";
					}, "hes")
				) {
					return false;
				}
			},
			order(item, player = _status.event.player) {
				if (player && get.event().type == "phase") {
					let max = 0,
						names = get.inpileVCardList(info => {
							return get.type(info[2]) == "basic";
						});
					names = names.map(namex => {
						return { name: namex[2], nature: namex[3], storage: { jsrgkuangjian: true } };
					});
					names.forEach(card => {
						if (player.getUseValue(card) > 0) {
							let temp = get.order(card);
							if (temp > max) {
								max = temp;
							}
						}
					});
					if (max > 0) {
						max *= 0.9;
					}
					return max;
				}
				return 0.5;
			},
			result: {
				player(player) {
					if (get.event().dying) {
						return get.attitude(player, get.event().dying);
					}
					return 1;
				},
			},
		},
		subSkill: {
			backup: {},
			effect: {
				charlotte: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					if (event.skill !== "jsrgkuangjian_backup" || !event.cards?.filterInD("od").some(card => get.type(card) === "equip")) {
						return false;
					}
					const cards = event.cards.filterInD("od").filter(card => get.type(card) === "equip");
					return event.targets?.some(target => target.isIn() && cards.some(card => target.hasUseTarget(card)));
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					let targets = trigger.targets.slice();
					while (trigger.cards.filterInD("od").some(card => get.type(card) === "equip")) {
						const target = targets.shift();
						if (!target.isIn()) {
							continue;
						}
						while (trigger.cards.filterInD("od").some(card => get.type(card) === "equip" && target.hasUseTarget(card))) {
							const result = await target
								.chooseButton(
									[
										"选择使用其中一张装备牌",
										trigger.cards.filterInD("od").filter(card => {
											return get.type(card) === "equip" && target.hasUseTarget(card);
										}),
									],
									true
								)
								.forResult();
							if (result?.bool && result.links?.length) {
								await target.chooseUseTarget(result.links[0], true);
							} else {
								break;
							}
						}
					}
				},
			},
		},
	},
	//马隆
	jsrgfennan: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return player.countVCards("e");
		},
		filter(event, player) {
			return game.hasPlayer(target => {
				return event.jsrgfennan?.includes(target) || target.countCards("h");
			});
		},
		onChooseToUse(event) {
			if (!game.online && !event.jsrgfennan) {
				let list = game.filterPlayer(target => {
					return event.player.canMoveCard(null, null, target, card => {
						return !game.getGlobalHistory("everything", evt => {
							if (evt.name !== "equip" && evt.name !== "addJudge") {
								return false;
							}
							if (evt.card !== card) {
								return false;
							}
							const name = evt.getParent().name;
							return name === "moveCard" || get.plainText(get.skillInfoTranslation(name, event.player)).includes("移动");
						}).length;
					});
				});
				event.set("jsrgfennan", list);
			}
		},
		filterTarget(card, player, target) {
			const event = _status.event;
			return event.jsrgfennan?.includes(target) || target.countCards("h");
		},
		async content(event, trigger, player) {
			const target = event.target,
				evt = event.getParent(2);
			const num = player.countVCards("e");
			let result,
				str = get.translation(player);
			if (!evt.jsrgfennan?.includes(target)) {
				result = { index: 1 };
			} else if (!target.countCards("h")) {
				result = { index: 0 };
			} else {
				result = await target
					.chooseControl()
					.set("choiceList", ["令" + str + "翻面，然后其移动你场上的一张本回合未被移动过的牌", "令" + str + "观看你的手牌并重铸其中至多" + get.cnNumber(num) + "张牌"])
					.set("ai", () => {
						const player = get.player(),
							source = get.event().getParent().player;
						if (get.attitude(player, source) > 0) {
							return source.isTurnedOver() ? 0 : 1;
						}
						return Math.random() > player.countVCards("e") / player.countEnabledSlot() ? 0 : 1;
					})
					.forResult();
			}
			if (result.index == 0) {
				await player.turnOver();
				await player.moveCard(
					target,
					card => {
						return !game.getGlobalHistory("everything", evt => {
							if (evt.name !== "equip" && evt.name !== "addJudge") {
								return false;
							}
							if (evt.card !== card) {
								return false;
							}
							const name = evt.getParent().name;
							return name === "moveCard" || get.plainText(get.skillInfoTranslation(name, player)).includes("移动");
						}).length;
					},
					true
				);
			} else {
				const result = await player
					.choosePlayerCard(target, "h", "visible", [1, num], "是否重铸其至多" + get.cnNumber(num) + "张牌？")
					.set("filterButton", button => {
						const player = get.event().getParent().target;
						return lib.filter.cardRecastable(button.link, player);
					})
					.set("ai", button => {
						const player = get.player(),
							target = get.event().getParent().target;
						return get.sgn(get.sgn(get.attitude(player, target)) - 0.5) * lib.skill.zhiheng.check(button.link);
					})
					.forResult();
				if (result?.bool && result.cards?.length) {
					await target.recast(result.cards);
				}
			}
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					return Math.random() * 2 - 1; //插眼，PZ157
				},
			},
		},
	},
	jsrgxunji: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			const targets = player
				.getHistory("useCard", evt => evt.targets?.some(i => i !== player))
				.slice()
				.map(evt => evt.targets.filter(i => i !== player))
				.flat()
				.unique();
			if (
				!player.hasHistory("sourceDamage", evtx => {
					const evt = evtx.getParent("useCard");
					if (!evt || evt.name !== "useCard" || !get.tag(evt.card, "damage")) {
						return false;
					}
					return evt.cards?.someInD("d");
				})
			) {
				return false;
			}
			return targets.length && targets.every(target => player.hasHistory("sourceDamage", evt => evt.player === target));
		},
		prompt2(event, player) {
			const cards = player
				.getHistory("sourceDamage", evtx => {
					const evt = evtx.getParent("useCard");
					if (!evt || evt.name !== "useCard" || !get.tag(evt.card, "damage")) {
						return false;
					}
					return evt.cards?.someInD("d");
				})
				.reduce((sum, evtx) => {
					return sum.addArray(evtx.getParent("useCard").cards.filterInD("d"));
				}, []);
			return "将" + get.translation(cards) + "分配给任意名角色各一张";
		},
		async content(event, trigger, player) {
			let cards = player
					.getHistory("sourceDamage", evtx => {
						const evt = evtx.getParent("useCard");
						if (!evt || evt.name !== "useCard" || !get.tag(evt.card, "damage")) {
							return false;
						}
						return evt.cards?.someInD("d");
					})
					.reduce((sum, evtx) => {
						return sum.addArray(evtx.getParent("useCard").cards.filterInD("d"));
					}, []),
				map = {};
			player.$gain2(cards, false);
			await game.delayx();
			if (_status.connectMode) {
				game.broadcastAll(() => (_status.noclearcountdown = true));
			}
			while (cards.length && game.hasPlayer(target => !map[target.playerid])) {
				let resultx;
				if (cards.length === 1) {
					resultx = { bool: true, links: cards };
				} else {
					resultx = await player
						.chooseCardButton("勋济：请选择要分配的牌", cards, Object.keys(map).length === 0)
						.set("ai", button => {
							const player = get.player(),
								map = get.event().map;
							let targets = game.filterPlayer(target => !map[target.playerid]);
							return targets.some(target => get.value(button.link, "raw") * get.value(button.link, target) * get.attitude(player, target) > 0) ? 1 : 0;
						})
						.set("map", map)
						.forResult();
				}
				const card = resultx?.links?.[0] || cards[0];
				cards.remove(card);
				const result = await player
					.chooseTarget(
						"选择获得" + get.translation(card) + "的角色",
						(card, player, target) => {
							return !get.event().map[target.playerid];
						},
						true
					)
					.set("map", map)
					.set("ai", target => {
						const player = get.player();
						return get.attitude(player, target) * get.event().value;
					})
					.set("value", get.value(card, player, "raw"))
					.set("ainmate", false)
					.forResult();
				if (result?.bool && result.targets?.length) {
					const target = result.targets[0];
					map[target.playerid] = [target, card];
				}
			}
			if (_status.connectMode) {
				game.broadcastAll(() => {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			if (Object.keys(map).length) {
				await game
					.loseAsync({
						gain_list: Object.values(map),
						giver: player,
						animate: "gain2",
					})
					.setContent("gaincardMultiple");
			}
		},
	},
};

export default skills;
