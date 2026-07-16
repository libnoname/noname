import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	// 曹操
	jylijun: {
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.player.isIn() && event.player.group == "wei";
		},
		check(event, player) {
			return get.effect(event.player, { name: "draw" }, player, player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await trigger.player.draw();
		},
	},
	jytongbei: {
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			return event.player.group != "wei";
		},
		async cost(event, trigger, player) {
			const { player: target } = trigger;
			if (!target.countCards("he")) {
				event.result = await player
					.chooseBool(get.prompt2(event.skill, target))
					.set("choice", get.attitude(player, target) < 0)
					.forResult();
			} else {
				const result = await player
					.chooseControl(lib.inpile.map(name => get.type2(name)).unique(), "cancel2")
					.set("prompt", get.prompt(event.skill, target))
					.set("ai", () => {
						let { player, targetx, controls } = get.event();
						const att = get.attitude(player, targetx);
						if (att > 0) {
							return "cancel2";
						}
						if (player.hasSkillTag("viewHandcard", null, target, true)) {
							return controls.filter(type => !targetx.countCards("he", { type: type })).randomGet();
						}
						const types = targetx
							.getCards("he", card => card.isKnownBy(player))
							.map(name => get.type2(name))
							.unique();
						if (types.length < controls.length) {
							return controls.removeArray(types).randomGet();
						}
						return controls.randomGet();
					})
					.set("targetx", target)
					.forResult();
				event.result = {
					bool: result?.control != "cancel2",
					cost_data: result?.control,
				};
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const { player: target } = trigger;
			const { cost_data } = event;
			if (cost_data) {
				player.popup(cost_data);
				game.log(player, "声明", "#g" + get.translation(cost_data) + "牌");
			}
			let result;
			if (!cost_data || !target.countCards("he", { type: cost_data })) {
				result = { bool: false };
			} else {
				result = await target
					.chooseToGive(player, "he", { type: cost_data }, `交给${get.translation(player)}一张${get.translation(cost_data)}牌，否则此伤害+1`)
					.set("ai", card => {
						const { player, target } = get.event();
						const att = get.attitude(player, target);
						const eff = get.damageEffect(player, target, player);
						if (eff > 0) {
							return 0;
						}
						return 7 - get.value(card);
					})
					.forResult();
			}
			if (!result?.bool) {
				trigger.num++;
			}
		},
	},
	// 曹仁
	jybeirong: {
		enable: "phaseUse",
		usable: 1,
		filterCard: lib.filter.cardRecastable,
		selectCard: [1, Infinity],
		check(card) {
			return 6.5 - get.value(card);
		},
		discard: false,
		lose: false,
		delay: false,
		allowChooseAll: true,
		async content(event, trigger, player) {
			const { cards } = event,
				num = cards.map(card => get.suit(card)).toUniqued().length;
			await player.recast(cards);
			if (num >= player.getHp()) {
				await player.link();
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
	},
	jyyujun: {
		trigger: { global: "damageBegin4" },
		filter(event, player) {
			return event.player.isLinked() && event.hasNature();
		},
		check(event, player) {
			return get.damageEffect(event.player, event.source, player, event.nature) * event.num < get.effect(player, { name: "losehp" }, player, player) + get.effect(player, { name: "draw" }, player, player) * 3;
		},
		async content(event, trigger, player) {
			await player.turnOver();
			await player.loseHp();
			await player.draw(3);
			trigger.cancel();
		},
	},
	// 诸葛亮
	jyqibian: {
		trigger: { global: ["roundStart", "roundEnd"] },
		filter(event, player, name) {
			return name === "roundStart" || player.getExpansions("jyqibian").length;
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername === "roundEnd") {
				const cards = player.getExpansions(event.name);
				if (cards.length) {
					await player.loseToDiscardpile(cards);
				}
			} else {
				const next = player.addToExpansion(get.cards(7), "gain2");
				next.gaintag.add(event.name);
				await next;
			}
		},
		marktext: "才",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		ai: { combo: "jycailve" },
	},
	jycailve: {
		hiddenCard(player, name) {
			return lib.inpile.includes(name) && player.getExpansions("jyqibian").some(card => get.name(card) == name);
		},
		enable: "chooseToUse",
		onChooseToUse(event) {
			if (!game.online && !event.jycailve_cards) {
				event.set("jycailve_cards", event.player.getExpansions("jyqibian"));
			}
		},
		filter(event, player) {
			if (!Array.isArray(event.jycailve_cards) || event.responded || event.jycailve) {
				return false;
			}
			return player.getExpansions("jyqibian").some(card => event.filterCard(card, player, event));
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("才辩", player.getExpansions("jyqibian"), "hidden");
			},
			filter(button, player) {
				const evt = get.event().getParent();
				return evt.filterCard(button.link, player, evt);
			},
			check(button) {
				const { link } = button,
					player = get.player();
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return player.getUseValue(link);
			},
			backup(links, player) {
				return {
					// filterCard: () => false,
					filterCard(card) {
						return card === lib.skill.jycailve_backup.card;
					},
					selectCard: -1,
					viewAs: links[0],
					card: links[0],
					position: "x",
					async precontent(event, trigger, player) {
						player.addTempSkill("jycailve_effect");
					},
				};
			},
			prompt(links, player) {
				return "才辩：是否使用" + get.translation(links[0]) + "？";
			},
		},
		ai: {
			combo: "jyqibian",
			order: 8,
			effect: {
				target(card, player, target, effect) {
					if (get.tag(card, "respondShan")) {
						return 0.7;
					}
					if (get.tag(card, "respondSha")) {
						return 0.7;
					}
				},
			},
			respondShan: true,
			respondSha: true,
			result: {
				player(player) {
					return get.event().dying ? get.attitude(player, get.event().dying) : 1;
				},
			},
		},
		subSkill: {
			backup: {},
			effect: {
				charlotte: true,
				trigger: { global: "useCardToBegin" },
				filter(event, player) {
					const { target } = event;
					if (!target?.isIn()) {
						return false;
					}
					return event.skill === "jycailve_backup" && player.countDiscardableCards(target, "he");
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const { target } = trigger;
					if (player.countDiscardableCards(target, "he")) {
						await target.discardPlayerCard(player, "he");
					}
				},
			},
		},
	},
	// 庞统
	jylianhuan: {
		enable: "phaseUse",
		usable: 1,
		viewAs: { name: "tiesuo", isCard: true },
		filterCard: () => false,
		selectCard: -1,
		log: false,
		precontent() {
			player.logSkill("jylianhuan");
			player.loseHp();
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (player.getHp() < 2) {
						return 0;
					}
					const att = get.attitude(player, target);
					if (player.hasSkill("jyyuhuo")) {
						return !target.isLinked() && att > 0 && player != target ? 1 : -1;
					}
					return lib.card.tiesuo.ai.result.target(player, target);
				},
			},
		},
	},
	jysuozhou: {
		trigger: { player: "useCard", target: "useCardToTarget" },
		filter(event, player) {
			return get.suit(event.card) == "club" && game.hasPlayer(current => current.isLinked());
		},
		usable: 1,
		logTarget: () => game.filterPlayer(current => current.isLinked()).sortBySeat(),
		check(event, player) {
			return (
				get
					.info("jysuozhou")
					.logTarget()
					.reduce((sum, current) => sum + get.effect(current, { name: "draw" }, player, player), 0) > 0
			);
		},
		async content(event, trigger, player) {
			await game.asyncDraw(event.targets);
		},
	},
	jyyuhuo: {
		trigger: { global: "damageBegin4" },
		filter(event, player) {
			return event.player != player && event.player.isLinked();
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.hasNature()) {
				trigger.num++;
			} else {
				trigger.num--;
			}
		},
	},
	// 鲁肃
	jydimeng: {
		getList(event) {
			const list = [event.player];
			if (event.targets?.length) {
				list.addArray(event.targets);
			} else {
				list.add(event.target);
			}
			return list.sortBySeat();
		},
		trigger: { global: "compareCardShowBefore" },
		filter(event, player) {
			return get.info("jydimeng").getList(event).length > 1;
		},
		async cost(event, trigger, player) {
			const list = get.info(event.skill).getList(trigger);
			event.result = await player
				.chooseTarget(2, get.prompt2(event.skill), (card, player, target) => {
					return get.event().list.includes(target);
				})
				.set("ai", target => {
					const player = get.player();
					const evt = get.event().getTrigger();
					const { player: source, small, lose_list } = evt;
					const att1 = get.attitude(player, source);
					const att2 = get.attitude(player, target);
					const [card] = lose_list.find(i => i[0] === target)[1];
					if (!ui.selected.targets.length) {
						if (target == source) {
							if ((player == source && get.number(evt.card1) <= 7 && !small) || att1 <= 0 || (small && get.number(evt.card1) > 6)) {
								return 10;
							}
						}
						if (att2 > 0 && ((get.number(card) <= 7 && !small) || (small && get.number(card) > 6))) {
							return 10;
						}
					}
					return -att2 * (small ? 14 - get.number(card) : get.number(card));
				})
				.set("list", list)
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			if (trigger.targets?.length) {
				const { cardlist, lose_list } = trigger;
				const [card1] = lose_list.find(i => i[0] === targets[0])[1];
				const [card2] = lose_list.find(i => i[0] === targets[1])[1];
				const index1 = cardlist.indexOf(card1);
				const index2 = cardlist.indexOf(card2);
				if (index1 >= 0 && index2 >= 0) {
					[cardlist[index1], cardlist[index2]] = [cardlist[index2], cardlist[index1]];
				} else {
					trigger.card1 = index1 < 0 ? card2 : card1;
					cardlist[index1 < 0 ? index2 : index1] = index1 < 0 ? card1 : card2;
				}
			} else {
				const list = [trigger.card1, trigger.card2];
				trigger.card1 = list[1];
				trigger.card2 = list[0];
			}
		},
	},
	jyzhouji: {
		enable: "phaseUse",
		usable(skill, player) {
			return player.getHp();
		},
		filter(event, player) {
			return game.hasPlayer(target => get.info("jyzhouji").filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player
				.chooseToCompare(target)
				.set("small", get.attitude(player, target) > 0)
				.forResult();
			if (target === result?.winner) {
				await target.draw(2);
			}
		},
		ai: {
			order: 10,
			expose: 0.2,
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
	},
	// 张昭
	jyboyan: {
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			return game.hasPlayer(target => get.info("jyboyan").filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player.chooseToCompare(target).forResult();
			const list = [player, target];
			if (result?.winner) {
				list.remove(result.winner);
			}
			for (const loser of list) {
				loser.addTempSkill(event.name + "_effect");
				await loser.draw(2);
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
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						if ([card].concat(card.cards || []).some(cardx => get.itemtype(cardx) === "card" && get.position(cardx) == "h")) {
							return false;
						}
					},
					cardSavable(card, player) {
						if ([card].concat(card.cards || []).some(cardx => get.itemtype(cardx) === "card" && get.position(cardx) == "h")) {
							return false;
						}
					},
				},
				mark: true,
				intro: { content: "本回合不能使用手牌" },
			},
		},
	},
	jymushi: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			const targets = get.info("jymushi").logTarget(event, player);
			return targets.length && targets.every(current => current.countCards("h") >= current.getHp());
		},
		async cost(event, trigger, player) {
			const targets = get.info(event.skill).logTarget(trigger, player);
			const choices = [];
			const choiceList = [`获得${get.translation(targets)}${targets.length > 1 ? "各" : ""}一张牌`, `令${get.translation(targets)}将手牌数调整至其体力值`];
			if (targets.some(current => current.countGainableCards(player, "he"))) {
				choices.push("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			}
			if (targets.some(current => current.countCards("h") != current.getHp())) {
				choices.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			const result = await player
				.chooseControl(choices, "cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt(event.skill))
				.set("ai", () => {
					const { player, targets, controls } = get.event();
					const eff1 = targets.reduce((sum, current) => sum + get.effect(current, { name: "shunshou_copy2" }, player, player), 0);
					const eff2 = targets.reduce((sum, current) => sum + 2 * get.effect(current, { name: "guohe_copy", position: "h" }, player, player) * (current.countCards("h") - current.getHp()), 0);
					if (eff1 <= 0 && eff2 <= 0) {
						return "cancel2";
					}
					if (controls.includes("选项一") && eff1 > 0 && eff1 >= eff2) {
						return "选项一";
					}
					if (controls.includes("选项二") && eff2 > 0) {
						return "选项二";
					}
					return "cancel2";
				})
				.set("targets", targets)
				.forResult();
			event.result = {
				bool: result?.control != "cancel2",
				cost_data: result?.control,
			};
		},
		logTarget(event, player) {
			return game.filterPlayer(current => current != player).sortBySeat();
		},
		async content(event, trigger, player) {
			const { cost_data, targets } = event;
			for (const target of targets) {
				if (!target.isIn()) {
					continue;
				}
				if (cost_data == "选项一" && target.countDiscardableCards(player, "he")) {
					await player.gainPlayerCard(target, "he", true);
				} else if (cost_data == "选项二" && target.countCards("h") != target.getHp()) {
					const num = target.getHp() - target.countCards("h");
					if (num > 0) {
						await target.draw(num);
					} else if (target.countDiscardableCards(target, "h")) {
						await target.chooseToDiscard(target.countCards("h") - target.getHp(), true, "allowChooseAll");
					}
				}
			}
		},
	},
	// 周瑜
	jysashuang: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return get.discarded().someInD("d");
		},
		async cost(event, trigger, player) {
			const cards = get.discarded().filterInD("d");
			const result = await player
				.chooseButton([`飒爽：获得其中每种颜色的牌的各一张`, cards], cards.map(card => get.color(card)).toUniqued().length)
				.set("filterButton", button => {
					const { link } = button;
					return !ui.selected.buttons.reduce((list, card) => list.add(get.color(card.link)), []).includes(get.color(link));
				})
				.set("ai", button => {
					return get.value(button.link);
				})
				.forResult();
			event.result = {
				bool: result?.bool,
				cost_data: result?.links,
			};
		},
		async content(event, trigger, player) {
			await player.gain(event.cost_data, "gain2");
		},
	},
	jyhuoce: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				player.hasCard(card => {
					return lib.filter.cardDiscardable(card, player, "jyhuoce");
				}, "he") && game.hasPlayer(current => get.info("jyhuoce").filterTarget(null, player, current))
			);
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("he");
		},
		async content(event, trigger, player) {
			const { target } = event;
			const list = [player, target].sortBySeat();
			if (list.some(current => !current.hasCard(card => lib.filter.cardDiscardable(card, current, "jyhuoce"), "he"))) {
				return;
			}
			const result = await player
				.chooseCardOL(list, "he", true, "火策：选择弃置一张牌", (card, player) => {
					return lib.filter.cardDiscardable(card, player, "jyhuoce");
				})
				.set("ai", get.unuseful)
				.forResult();
			if (!result) {
				return;
			}
			const lose_list = [],
				cards = [];
			for (let i = 0; i < result.length; i++) {
				const current = list[i],
					card = result[i].cards[0];
				lose_list.push([current, result[i].cards]);
				cards.push(card);
			}
			if (lose_list.length) {
				await game
					.loseAsync({
						lose_list,
					})
					.setContent("discardMultiple");
			}
			if (cards.map(card => get.color(card)).toUniqued().length == 1) {
				const result = await player
					.chooseTarget(true, `选择一名角色对其造成1点火焰伤害`)
					.set("ai", target => {
						const player = get.player();
						return get.damageEffect(target, player, player, "fire");
					})
					.forResult();
				if (result?.bool && result?.targets?.length) {
					await result.targets[0].damage("fire", player);
				}
			}
		},
		ai: {
			threaten: 1.2,
			order: 9.1,
			result: {
				target(player, target) {
					if (target.hasCard(card => lib.filter.cardDiscardable(card, player, "jyhuoce"), "he")) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	// 黄盖
	jyliezhou: {
		trigger: { source: ["damageBegin1", "damageSource"] },
		filter(event, player, name) {
			return name == "damageBegin1" || (event.checkJyliezhou && event.num > 0);
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername == "damageBegin1") {
				game.setNature(trigger, "fire");
			} else {
				await player.draw(trigger.num);
			}
		},
	},
	jyzhaxiang: {
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			await player.loseMaxHp();
			player.addTempSkill(event.name + "_effect");
		},
		ai: {
			order: 8,
			result: {
				player(player) {
					if (!player.hasCard(card => get.tag(card, "damage") && get.type(card) != "delay" && player.hasValueTarget(card), "hs") || player.hasSkill("jyzhaxiang_effect") || player.maxHp <= 3) {
						return 0;
					}
					return player.isHealthy() ? 0 : 1;
				},
			},
			halfneg: true,
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.filterPlayer());
				},
				ai: {
					threaten: 1.5,
					directHit_ai: true,
				},
			},
		},
	},
};

export default skills;
