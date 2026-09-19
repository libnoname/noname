import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//风云际会曹操
	psjuebing: {
		enable: "chooseToUse",
		filter(event, player) {
			return player.hasCard(card => get.name(card) != "sha", "hs");
		},
		viewAs: { name: "sha", storage: { psjuebing: true } },
		filterCard(card, player) {
			return get.name(card) != "sha";
		},
		position: "hs",
		prompt: "将一张非【杀】手牌当做【杀】使用",
		check(card) {
			if (get.player().hasUseTarget(card)) {
				return 1;
			}
			return 6 - get.value(card);
		},
		async precontent(event, trigger, player) {
			player.addTempSkill("psjuebing_effect");
		},
		subSkill: {
			effect: {
				getList(event, target) {
					const list = event.cards.filterInD();
					const respondEvts = target.getHistory("useCard").filter(i => i.respondTo?.[1] === event.card);
					if (respondEvts.length) {
						list.addArray(respondEvts.flatMap(evt => evt.cards.filterInD("d")));
					}
					return list;
				},
				charlotte: true,
				trigger: {
					player: ["useCardAfter", "useCardToPlayered"],
					source: "damageSource",
				},
				filter(event, player, name) {
					if (!event.card?.storage?.psjuebing) {
						return false;
					}
					if (["damageSource", "useCardToPlayered"].includes(name)) {
						return true;
					}
					if (!event.targets?.length || event.targets.length != 1) {
						return false;
					}
					const [target] = event.targets;
					const list = get.info("psjuebing_effect").getList(event, target);
					return list.some(card => [player, target].some(current => current.hasUseTarget(card)));
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					if (event.triggername == "damageSource") {
						const evt = trigger.getParent(2);
						if (evt.addCount !== false) {
							evt.addCount = false;
							const stat = player.getStat().card,
								name = trigger.card.name;
							if (typeof stat[name] == "number") {
								stat[name]--;
							}
							game.log(trigger.card, "不计入次数限制");
						}
					} else if (event.triggername == "useCardAfter") {
						const [target] = trigger.targets;
						let list = get.info(event.name).getList(trigger, target);
						for (const current of [player, target].sortBySeat()) {
							if (!current.isIn() || !list.length) {
								continue;
							}
							const result = await current
								.chooseButton(["谲兵：你可以使用其中一张牌", list])
								.set("filterButton", button => {
									const player = get.player();
									return player.hasUseTarget(button.link);
								})
								.set("ai", button => {
									const player = get.player();
									return player.getUseValue(button.link);
								})
								.forResult();
							if (result?.links?.length) {
								list.removeArray(result.links);
								await current.chooseUseTarget(result.links[0], true, false);
							}
						}
					} else {
						const { target } = trigger;
						target.addTempSkill("psjuebing_block");
						target.markAuto("psjuebing_block", [trigger.card]);
					}
				},
			},
			block: {
				charlotte: true,
				onremove: true,
				mod: {
					cardEnabled(card, player) {
						if (!player.storage.psjuebing_block) {
							return;
						}
						const storage = player.getStorage("psjuebing_block");
						let evt = get.event();
						if (evt.name != "chooseToUse") {
							evt = evt.getParent("chooseToUse");
						}
						if (!evt?.respondTo || !storage.some(i => i.cardid == evt.respondTo[1].cardid)) {
							return;
						}
						if (
							get.number(card) !== "unsure" &&
							(!card.cards?.length ||
								card.cards?.length != 1 ||
								card.cards?.some(cardx => {
									if (get.itemtype(cardx) != "card") {
										return false;
									}
									return get.name(cardx) == "shan" || !["h", "s"].includes(get.position(cardx));
								}))
						) {
							return false;
						}
					},
				},
				trigger: {
					player: ["damageBefore", "damageCancelled", "damageZero"],
					target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
					global: ["useCardEnd"],
				},
				filter(event, player) {
					const evt = event.getParent("useCard", true, true);
					if (evt && evt.effectedCount < evt.effectCount) {
						return false;
					}
					if (!event.card || !player.storage.psjuebing_block) {
						return false;
					}
					return player.getStorage("psjuebing_block").includes(event.card);
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					player.unmarkAuto(event.name, [trigger.card]);
					if (!player.getStorage(event.name).length) {
						player.removeSkill(event.name);
					}
				},
				group: "psjuebing_shan",
			},
			shan: {
				charlotte: true,
				enable: "chooseToUse",
				filter(event, player) {
					if (!player.hasCard(card => get.name(card) != "shan", "hs")) {
						return false;
					}
					return event.respondTo && player.getStorage("psjuebing_block").some(i => i.cardid == event.respondTo[1].cardid);
				},
				viewAs: { name: "shan" },
				filterCard(card, player) {
					return get.name(card) != "shan";
				},
				position: "hs",
				prompt: "将一张非【闪】手牌当做【闪】使用",
				check(card) {
					if (get.player().hasUseTarget(card)) {
						return 1;
					}
					return 6 - get.value(card);
				},
			},
		},
	},
	psfengxie: {
		enable: "phaseUse",
		filter(card, player) {
			return game.hasPlayer(current => player != current);
		},
		filterTarget: lib.filter.notMe,
		limited: true,
		skillAnimation: true,
		animationColor: "gray",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { target } = event;
			for (const current of game.filterPlayer(current => target != current).sortBySeat()) {
				const cards = current.getCards("e");
				if (!current.isIn() || !cards.length) {
					continue;
				}
				player.line(current);
				const result =
					cards.length == 1
						? { bool: true, links: cards }
						: await player
								.choosePlayerCard(current, "e", true, `选择${get.translation(current)}装备区的一张牌，如果${get.translation(target)}可以装备，则其装备之，否则你获得之`)
								.set("ai", button => {
									const player = get.player();
									const { target } = get.event().getParent();
									const { link } = button;
									const att = get.attitude(player, target);
									let eff = get.effect(target, link, player, player);
									if (eff < 0) {
										if (att > 0) {
											return 0;
										} else {
											eff += 4;
										}
									}
									if (att > 0 && target.canEquip(link)) {
										eff += 4;
									}
									return eff;
								})
								.forResult();
				if (result?.bool && result?.links?.length) {
					const [card] = result.links;
					if (target.canEquip(card)) {
						const owner = get.owner(card);
						if (owner) {
							owner.$give(card, target, false);
						}
						await game.delay(0.5);
						await target.equip(card);
					} else {
						await player.gain(card, "gain2");
					}
				}
			}
			const targets = game.filterPlayer(current => current.identity == "mingzhong" && ["dongcha", "sheshen"].some(skill => current.hasSkill(skill)));
			if (targets.length) {
				for (const target of targets.sortBySeat()) {
					if (!target.isIn()) {
						continue;
					}
					const skills = ["dongcha", "sheshen"].filter(skill => target.hasSkill(skill));
					await target.removeSkills(skills);
					await player.addSkills(skills);
				}
			}
		},
		derivation: ["dongcha", "sheshen"],
		ai: {
			order(item, player) {
				const list = game.filterPlayer(current => current != player);
				const friends = list.filter(current => get.attitude(player, current) > 0);
				const enemies = list.filter(current => get.attitude(player, current) < 0);
				if (
					friends.some(current => {
						const num = enemies.filter(current2 => current2 != current && current2.hasCard(card => current.canEquip(card) || get.value(card, player) > 2, "e")).length;
						return num > 1;
					})
				) {
					return 10;
				}
				if (
					enemies.some(current => {
						const num = enemies.filter(current2 => current2 != current && current2.hasCard(card => !current.canEquip(card) || get.value(card, player) > 2, "e")).length;
						return num > 1;
					})
				) {
					return 10;
				}
				return 0;
			},
			result: {
				target(player, target) {
					const enemies = game.filterPlayer(current => current != player && get.attitude(player, current) < 0);
					const att = get.attitude(player, target);
					if (att > 0) {
						const num = enemies.filter(current => current != target && current.hasCard(card => target.canEquip(card) || get.value(card, player) > 2, "e")).length;
						return num;
					} else if (att < 0) {
						const num = enemies.filter(current => current != target && current.hasCard(card => !target.canEquip(card), "e")).length;
						return -num;
					} else {
						return 0;
					}
				},
			},
		},
	},
	//风云际会刘备
	pshuji: {
		trigger: { global: "roundStart" },
		filter(event, player) {
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				return !player.inRange(current) && !current.inRange(player);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					if (target == player) {
						return false;
					}
					return !player.inRange(target) && !target.inRange(player);
				})
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target) * (1 + target.countCards("h"));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			if (target.countCards("h")) {
				const result = target.countCards("h") == 1 ? { bool: true, cards: target.getCards("h") } : await target.chooseCard(true, "h", `选择一张手牌赠予${get.translation(player)}`).forResult();
				if (result?.bool && result?.cards?.length) {
					await target.gift(result.cards, player);
				}
			}
			const effect = `${event.name}_effect`;
			player.addTempSkill(effect, "roundStart");
			target.addTempSkill(effect, "roundStart");
			player.markAuto(effect, [target]);
			target.markAuto(effect, [player]);
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return player.countDiscardableCards(player, "h") > 1 && game.hasPlayer(current => player.inRange(current) && player.getStorage("pshuji_effect").includes(current));
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					for (const target of game.filterPlayer(current => player.inRange(current) && player.getStorage(event.name).includes(current)).sortBySeat()) {
						if (!target.isIn() || player.countDiscardableCards(player, "h") < 2) {
							continue;
						}
						await player.chooseToDiscard("h", 2, true);
						await target.damage();
					}
				},
				intro: { content: "已和$陷入猜忌之中" },
			},
		},
	},
	pshoufa: {
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			return player.countCards("h") < event.player.maxHp && player.getSeatNum() > event.player.getSeatNum();
		},
		usable: 1,
		async content(event, trigger, player) {
			await player.drawTo(trigger.player.maxHp);
		},
	},
	//风云际会孙权
	pszhanlun: {
		trigger: { player: "yingbian" },
		filter(event, player) {
			return event.card.name == "sha" && lib.yingbian.condition.complex.has("zhuzhan");
		},
		forced: true,
		async content(event, trigger, player) {
			const next = lib.yingbian.condition.complex.get("zhuzhan")(trigger);
			await next;
			const { zhuzhanresult2, result } = next;
			if (result?.bool) {
				if (trigger.addCount !== false) {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
					game.log(trigger.card, "不计入次数限制");
				}
				player.addTempSkill(event.name + "_effect");
				player.markAuto(event.name + "_effect", [[trigger.card, zhuzhanresult2.cards[0]]]);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return player.getStorage("pszhanlun_effect").some(([card, cards]) => card == event.card && ["red", "black"].includes(get.color(cards)));
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const card = player.getStorage(event.name).filter(list => list[0] == trigger.card)[0][1];
					if (get.color(card) == "black") {
						player.addTempSkill("pszhanlun_damage");
						player.addMark("pszhanlun_damage", 1, false);
						game.log(player, "本回合下一张【杀】造成的伤害", "#g+1");
					} else {
						const targets = game.filterPlayer(current => current.hasHistory("lose", evt => evt.getParent(2).name == "yingbianZhuzhan"));
						player.tempBanSkill("pszhanlun");
						await game.asyncDraw([player].addArray(targets).sortBySeat(), 2);
					}
				},
			},
			damage: {
				charlotte: true,
				onremove: true,
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					return event.card?.name === "sha";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				intro: { content: "本回合下一张【杀】造成的伤害+#" },
			},
		},
	},
	psjueyi: {
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.hasCard(lib.filter.cardRecastable, "he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard("he", get.prompt2(event.skill), [1, 2], lib.filter.cardRecastable)
				.set("ai", card => {
					const { player, list } = get.event();
					if (!list.length) {
						return 6 - get.value(card);
					}
					const max = list.filter(i => i[1] == list[0][1]).map(i => i[0]);
					let val = 6;
					if (!ui.selected.cards.length) {
						if (get.suit(card) == max && player.needsToDiscard()) {
							val += 4;
						}
						if (
							player.hasSkill("pszhanlun") &&
							player.hasValueTarget({ name: "sha" }) &&
							get.name(card) != "sha" &&
							game.hasPlayer(current => {
								return current != player && get.attitude(player, current) > 0 && current.hasCard(cardx => get.suit(cardx) !== get.suit(card) && get.type(cardx) == "basic", "h");
							})
						) {
							val += 6;
						}
						return val - get.value(card);
					}
					if (get.suit(card) !== get.suit(ui.selected.cards[0])) {
						val += 2;
					}
					return val - get.value(card);
				})
				.set(
					"list",
					(() => {
						const cards = player.getCards("h"),
							map = {};
						if (!cards.length) {
							return [];
						}
						for (const card of cards) {
							const type = get.suit(card);
							if (typeof map[type] != "number") {
								map[type] = 0;
							}
							map[type]++;
						}
						const list = [];
						for (let i in map) {
							if (map[i] > 0) {
								list.push([i, map[i]]);
							}
						}
						list.sort((a, b) => b[1] - a[1]);
						return list;
					})()
				)
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event;
			await player.recast(cards);
			const suits = cards.map(card => get.suit(card)).toUniqued();
			for (const target of game.filterPlayer()) {
				target.addTempSkill(event.name + "_effect");
				target.markAuto(event.name + "_effect", suits);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					cardDiscardable(card, player) {
						if (player.getStorage("psjueyi_effect").includes(get.suit(card))) {
							return false;
						}
					},
				},
				intro: { content: "本回合内不能弃置$的牌直到有角色进入濒死状态" },
				trigger: { global: "dying" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
				},
			},
		},
	},
};

export default skills;
