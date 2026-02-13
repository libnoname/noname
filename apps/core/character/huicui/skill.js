import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//魏讽
	dchuozhong: {
		audio: 2,
		enable: "phaseUse",
		/*usable(skill, player) {
			return player.hasSkill(`${skill}_twice`) ? 2 : 1;
		},*/
		usable: 2,
		filterCard: true,
		position: "h",
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			return player.inRange(target);
		},
		selectTarget: [1, Infinity],
		multiline: true,
		multitarget: true,
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const {
				cards: [card],
				targets,
			} = event;
			const type = get.type2(card);
			await player.showCards(card, `${get.translation(player)}发动了〖${get.translation(event.name)}〗`);
			await game.doAsyncInOrder(targets, async target => {
				if (!game.hasPlayer(target => target.countCards("he") > 0)) {
					return;
				}
				const result = await target
					.chooseCardTarget({
						prompt: "惑众：交给或获得一名其他角色一张牌（不选择卡牌即视为进行获得牌操作）",
						filterCard: true,
						position: "he",
						selectCard: [0, 1],
						complexSelect: true,
						filterTarget(card, player, target) {
							return target != player && (!ui.selected.cards?.length ? target.countCards("he") > 0 : true);
						},
						forced: true,
						type: type,
						sourcex: player,
						ai1(card) {
							if (get.player().countCards("he") < 3) {
								return 0;
							}
							if (get.type2(card) == get.event().type) {
								return 6.5 - get.value(card);
							}
							return 5 - get.value(card);
						},
						ai2(target) {
							const player = get.player();
							let att = get.attitude(player, target);
							if (ui.selected.cards?.length) {
								if (att < 0 && target == get.event().sourcex) {
									return 0;
								}
								if (target.hasSkillTag("nogain")) {
									att /= 9;
								}
								return 4 - att;
							}
							return -att;
						},
					})
					.forResult();
				if (result?.targets?.length) {
					const { cards, targets } = result;
					target.line(targets);
					if (!cards?.length) {
						return target.gainPlayerCard(targets[0], "he", true);
					} else {
						return target.give(cards, targets[0]);
					}
				}
			});
			const targetsx = game.filterPlayer(target => target != player && target.isMaxHandcard(void 0, target => target != player));
			await game.doAsyncInOrder(targetsx, async target => {
				await target.showHandcards();
				const hs = target.getCards("h", card => get.type2(card) == type);
				if (hs.length) {
					//const bool = target.isMinHandcard(void 0, target => target != player);
					target.$throw(hs.length, 1000);
					game.log(target, "将", `#y${get.cnNumber(hs.length)}张牌`, "置于牌堆顶");
					await target.lose(hs, ui.cardPile, "insert");
					/*if (!bool && target.isMinHandcard(void 0, target => target != player)) {
						player.addTempSkill(`${event.name}_twice`);
					}*/
				}
			});
		},
		/*subSkill: {
			twice: {
				charlotte: true,
			},
		},*/
	},
	dczhuguo: {
		audio: 2,
		forced: true,
		trigger: {
			global: ["loseAfter", "loseAsyncAfter", "cardsGotoPileAfter"],
		},
		usable: 3,
		filter(event, player, name, target) {
			if (event.name == "cardsGotoPile") {
				return true;
			}
			if (event.name == "lose") {
				if (event.position == ui.cardPile && event.getlx !== false && event.cards2.length) {
					return true;
				}
			}
			return game.hasPlayer(target => {
				return target.hasHistory("lose", evt => evt.getParent() == event && evt.position == ui.cardPile && evt.cards2?.length);
			});
		},
		async content(event, trigger, player) {
			await player.draw(2, "bottom");
		},
	},
	//张世平
	dcbinji: {
		audio: 2,
		trigger: {
			global: "roundStart",
		},
		filter(event, player) {
			return true;
		},
		check: () => true,
		async content(event, trigger, player) {
			await player.draw(3);
			if (!player.countCards("h")) {
				return;
			}
			const result = await player
				.chooseCardTarget({
					prompt: `镔济：交给至多三名其他角色各一张牌`,
					filterTarget: lib.filter.notMe,
					selectTarget: [1, 3],
					filterCard: true,
					selectCard: [1, 3],
					position: "he",
					complexSelect: true,
					targetprompt() {
						const links = ui.selected.cards;
						return ["获得", get.translation(links[ui.selected.targets.length - 1])].join("<br>");
					},
					filterOk() {
						return ui.selected.cards.length == ui.selected.targets.length;
					},
					ai1(card) {
						if (
							ui.selected.cards?.length >=
							game.filterPlayer(target => target != get.player() && get.attitude(get.player(), target) > 0).length
						) {
							return 0;
						}
						return 1 / Math.max(0.1, get.value(card));
					},
					ai2(target) {
						const player = get.player();
						let att = get.attitude(player, target);
						if (target.hasSkillTag("nogain")) {
							att /= 9;
						}
						return 4 + att;
					},
				})
				.forResult();
			if (result?.bool) {
				const { cards, targets } = result;
				player.addSkill(`${event.name}_gain`);
				await game
					.loseAsync({
						gain_list: targets.map((target, i) => [target, cards[i]]),
						giver: player,
						player: player,
						cards: cards,
						gaintag: [event.name],
						animate: "giveAuto",
					})
					.setContent("gaincardMultiple");
			}
		},
		subSkill: {
			gain: {
				audio: "dcbinji",
				charlotte: true,
				forced: true,
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "addToExpansionAfter", "equipAfter", "addJudgeAfter", "gainAfter"],
				},
				getIndex(event, player) {
					return game
						.filterPlayer(target => {
							const evt = event.getl?.(target);
							return evt?.hs?.length > 0 && Object.values(evt.gaintag_map).flat().includes("dcbinji");
						})
						.sortBySeat();
				},
				filter(event, player, name, target) {
					return true;
				},
				logTarget(event, player, name, target) {
					return target;
				},
				async content(event, trigger, player) {
					const {
						targets: [target],
					} = event;
					const card = get.cardPile(card => get.subtype(card) == "equip1", void 0, "random");
					if (card) {
						await target.gain(card, "gain2");
					} else {
						target.chat("匹夫之勇，愚蠢之至！");
					}
					await player.draw(2);
				},
			},
		},
	},
	dczangmao: {
		audio: 2,
		enable: "phaseUse",
		usable: 3,
		map: {
			discard: [
				"弃置任意张方块牌，然后从牌堆或弃牌堆随机获得等量张坐骑牌",
				() => get.player().countDiscardableCards(get.player(), "he", { suit: "diamond" }),
			],
			give: ["交给一名其他角色一张方块牌，然后获得其装备区一张坐骑牌", () => get.player().countCards("he", { suit: "diamond" })],
			equip: [
				"将一张坐骑牌置入一名其他角色装备区， 然后随机获得其两张手牌",
				() => get.player().countCards("he", card => ["equip3", "equip4", "equip3_4"].includes(get.subtype(card))),
			],
		},
		chooseButton: {
			dialog(event, player) {
				const map = get.info("dczangmao").map;
				const keys = Object.keys(map);
				return ui.create.dialog("驵贸：请选择一项", [keys.map(key => [key, map[key][0]]), "textbutton"], "hidden");
			},
			filter(button) {
				const map = get.info("dczangmao").map;
				return map[button.link][1]();
			},
			check(button) {
				return Math.random();
			},
			backup(links, player) {
				return {
					audio: "dczangmao",
					position: "he",
					...(links[0] == "discard" ? {} : { lose: false, discard: false, delay: false }),
					check(card) {
						return 6 - get.value(card);
					},
					...{
						discard: {
							filterCard(card, player) {
								return get.suit(card) == "diamond" && lib.filter.cardDiscardable(card, player, "dczangmao");
							},
							selectCard: [1, Infinity],
							async content(event, trigger, player) {
								const { cards } = event;
								const gain = [];
								while (gain.length < cards.length) {
									const card = get.cardPile(
										card => ["equip3", "equip4", "equip3_4"].includes(get.subtype(card)) && !gain.includes(card),
										void 0,
										"random"
									);
									if (card) {
										gain.push(card);
									} else {
										break;
									}
								}
								if (gain.length) {
									await player.gain(gain, "gain2");
								} else {
									player.chat("塞翁失马，焉知非福");
								}
							},
						},
						give: {
							filterCard: { suit: "diamond" },
							filterTarget: lib.filter.notMe,
							async content(event, trigger, player) {
								const { cards, target } = event;
								await player.give(cards, target);
								if (target.countGainableCards(player, "e", card => ["equip3", "equip4", "equip3_4"].includes(get.subtype(card)))) {
									await player
										.gainPlayerCard(target, "e", true)
										.set("filterButton", button => ["equip3", "equip4", "equip3_4"].includes(get.subtype(button.link)));
								} else {
									player.chat("其真无马邪？");
								}
							},
							ai: {
								result: {
									target: 1,
								},
							},
						},
						equip: {
							filterCard(card, player) {
								return ["equip3", "equip4", "equip3_4"].includes(get.subtype(card));
							},
							filterTarget(card, player, target) {
								return target != player && target.canEquip(ui.selected.cards[0], true);
							},
							async content(event, trigger, player) {
								const { cards, target } = event;
								player.$giveAuto(cards, target, false);
								await target.equip(cards[0]);
								const cardsx = target.getGainableCards(player, "h").randomGets(2);
								if (cardsx?.length) {
									await player.gain(cardsx, target, "giveAuto");
								} else {
									player.chat("其真不知马也！");
								}
							},
							ai: {
								result: {
									target: -1,
								},
							},
						},
					}[links[0]],
				};
			},
			prompt(links, player) {
				return `驵贸：${get.info("dczangmao").map[links[0]][0]}`;
			},
		},
		subSkill: {
			backup: {},
		},
		ai: {
			order: 6,
			result: {
				player: 1,
			},
		},
	},
	//马邈
	dczhangguan: {
		audio: 2,
		trigger: {
			global: "phaseBegin",
		},
		async cost(event, trigger, player) {
			const num = player.countCards("h") - player.hp;
			if (num > 0) {
				event.result = await player
					.chooseToDiscard(get.prompt2(event.skill), "h", num)
					.set("ai", card => {
						if (get.event().eff) {
							return 10 - get.value(card);
						}
						return 0;
					})
					.set(
						"eff",
						(() => {
							const target = _status.currentPhase;
							if (!target?.countGainableCards(player, "he")) {
								return false;
							}
							const eff = get.effect(target, { name: "shunshou_copy2" }, player, player);
							if (eff < 0 || get.attitude(player, target) > 0) {
								return false;
							}
							const bonos = player.hasSkill("dccongfeng") ? 3 : 6;
							return eff > Math.sqrt(num) * bonos;
						})()
					)
					.set("chooseonly", true)
					.forResult();
			} else {
				event.result = await player
					.chooseBool(get.prompt2(event.skill))
					//.set("choice", player.isDamaged() || num < -1 || get.attitude(player, trigger.player) > 0)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const count = player.countCards("h");
			if (count < player.hp) {
				await player.drawTo(player.hp);
			}
			if (event.cards?.length) {
				await player.modedDiscard(event.cards);
			}
			const num = player.countCards("h") - count;
			if (num == 0) {
				await player.recover();
			}
			if (num < 0) {
				const target = _status.currentPhase;
				if (target?.isIn() && target.countGainableCards(player, "he")) {
					await player.gainPlayerCard(target, "he", true);
				}
			}
			//player.addTempSkill("dczhangguan_effect");
		},
		subSkill: {
			effect: {
				trigger: {
					global: "useCard",
				},
				charlotte: true,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					const evts = game.getGlobalHistory("useCard", evt => evt.player != player);
					return evts?.length > 0 && get.color(event.card) == get.color(evts[0].card);
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					trigger.directHit.add(player);
				},
			},
		},
	},
	dccongfeng: {
		audio: 2,
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player) {
			if (!event.getl || !event.getg) {
				return [];
			}
			const list = [],
				gains = event.getg(player),
				loses = event.getl(player).cards2;
			game.filterPlayer(current => {
				const gains2 = event.getg(current),
					loses2 = event.getl(current).cards2;
				if (current == player) {
					return false;
				}
				if (gains2.length && loses.length && gains2.containsSome(...loses)) {
					list.add([current, player]);
				}
				if (gains.length && loses2.length && loses2.containsSome(...gains)) {
					list.add([player, current]);
				}
				return true;
			});
			return list;
		},
		filter(event, player, name, list) {
			if (event.getParent().name == "dccongfeng") {
				return false;
			}
			const [gain, lose] = list;
			return lose.countGainableCards(gain, "he");
		},
		async cost(event, trigger, player) {
			const [gain, lose] = event.indexedData;
			event.result = await gain
				.chooseBool(get.prompt(event.skill, lose, gain), "随机获得其一张牌")
				.set("choice", get.effect(lose, { name: "shunshou_copy2" }, gain, gain) > 0)
				.forResult();
		},
		logTarget(event, player, name, list) {
			return list.find(current => current != player);
		},
		async content(event, trigger, player) {
			const [gain, lose] = event.indexedData;
			const cards = lose.getGainableCards(gain, "he");
			if (cards?.length) {
				await gain.gain(cards.randomGets(1), "giveAuto");
			}
		},
	},
	//吉吉国王
	dczouyi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		selectTargetAI(event, player) {
			let cache = _status.event.getTempCache("dczouyi", "results");
			if (Array.isArray(cache)) {
				return cache;
			}
			let allPlayers = game.filterPlayer(current => current != player),
				startNums = allPlayers.map(current => current.countCards("h")),
				num = player.countCards("h");
			let draw = 0,
				discard = 0,
				all = 0;
			allPlayers.forEach((current, index) => {
				let countA = 1,
					countB = 1;
				for (let i = 0; i < startNums.length; i++) {
					let numx = startNums[i];
					if (((i != index || current.countCards("e")) && numx == num + 2) || (i == index && num + 3 == numx)) {
						countA++;
					}
					if ((i != index && numx == num - 1) || (i == index && num - 3 == numx)) {
						countB++;
					}
				}
				allPlayers.forEach((current2, index2) => {
					let nums = startNums.slice(0),
						numx = num + 1,
						countC = 1;
					nums[index] -= 1;
					nums[index2] += 2;
					nums.forEach(value => {
						if (value == numx) {
							countC++;
						}
					});
					if (countC > all) {
						all = countC;
					}
				});
				if (countA > draw) {
					draw = countA;
				}
				if (countB > discard) {
					discard = countB;
				}
			});
			event.putTempCache("dczouyi", "results", [draw, discard, all]);
			return [draw, discard, all];
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog(`###诹议###${get.translation("dczouyi_info")}`, [
					[
						["draw", "你摸两张牌并可弃置一名其他角色一张牌"],
						["discard", "你弃置一张牌并可令一名其他角色摸两张牌"],
					],
					"textbutton",
				]);
			},
			filter(button, player) {
				if (button.link == "discard") {
					return player.countDiscardableCards(player, "he");
				}
				return true;
			},
			check(button) {
				const player = get.player(),
					results = get.info("dczouyi").selectTargetAI(get.event(), player);
				if (results.minBy(i => i) == results[["draw", "discard"].indexOf(button.link)]) {
					return 0;
				}
				return 1;
			},
			select: [1, 2],
			backup(links, player) {
				return {
					audio: "dczouyi",
					links: links,
					async content(event, trigger, player) {
						const { links } = get.info(event.name);
						if (links.includes("draw")) {
							await player.draw(2);
							if (game.hasPlayer(target => target.countDiscardableCards(player, "he") && target != player)) {
								const result = await player
									.chooseTarget(`诹议：弃置一名其他角色一张牌`, (card, player, target) => {
										return target.countDiscardableCards(player, "he") && target != player;
									})
									.set("ai", target => {
										const { player, readyToDiscard: bool } = get.event(),
											num = player.countCards("h") - (bool ? 1 : 0),
											numx = target.countCards("h");
										let eff = get.effect(target, { name: "guohe_copy2" }, player, player);
										if ((numx == num && target.countCards("e")) || numx == num + 1) {
											eff *= 3;
										}
										return eff;
									})
									.set("readyToDiscard", links.includes("discard"))
									.forResult();
								if (result?.targets?.length) {
									const target = result.targets[0];
									player.line(target, "yellow");
									await player.discardPlayerCard(target, "he", true);
								}
							}
						}
						if (links.includes("discard")) {
							await player.chooseToDiscard("he", true);
							const result = await player
								.chooseTarget(`诹议：令一名其他角色摸两张牌`, lib.filter.notMe)
								.set("ai", target => {
									const player = get.player(),
										num = player.countCards("h"),
										numx = target.countCards("h") + 2;
									let eff = get.effect(target, { name: "wuzhong" }, player, player);
									if (num == numx) {
										eff *= 3;
									}
									return eff;
								})
								.forResult();
							if (result?.targets?.length) {
								const target = result.targets[0];
								player.line(target, "green");
								await target.draw(2);
							}
						}
						const num = game.countPlayer(target => target.countCards("h") == player.countCards("h"));
						if (num <= 0) {
							return;
						}
						player.addMark("dcyanxi", num, false);
						if (player.isDamaged()) {
							await player.recover(num);
						}
					},
				};
			},
			prompt(links, player) {
				const map = {
					draw: "你摸两张牌并可弃置一名其他角色一张牌",
					discard: "你弃置一张牌并可令一名其他角色摸两张牌",
				};
				return `###诹议：是否执行下列选项？###${links.map(type => map[type]).join("<br>")}`;
			},
		},
		ai: {
			order(item, player) {
				if (!player) {
					return 1;
				}
				let results = lib.skill.dczouyi.selectTargetAI(get.event(), player);
				return results.maxBy(i => i) * 3;
			},
			result: {
				player: 1,
			},
		},
		subSkill: {
			backup: {},
		},
	},
	dcyanxi: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			const card = get.autoViewAs({ name: "sha", isCard: true, storage: { dcyanxi: true } });
			return event.player != player && player.countMark("dcyanxi") > 0 && player.canUse(card, event.player, false, false);
		},
		logTarget: "player",
		check(event, player) {
			const card = get.autoViewAs({ name: "sha", isCard: true, storage: { dcyanxi: true } });
			return get.effect(event.player, card, player, player) > 0;
		},
		async content(event, trigger, player) {
			const target = trigger.player,
				card = get.autoViewAs({ name: "sha", isCard: true, storage: { dcyanxi: true } });
			let isFirst = true;
			player.addTempSkill("dcyanxi_jueqing");
			while (player.countMark(event.name) > 0 && player.canUse(card, target, false, false) && target.isIn()) {
				if (isFirst) {
					isFirst = false;
				} else {
					player.logSkill(event.name, target);
				}
				player.removeMark(event.name, 1, false);
				await player.useCard(card, target, false);
			}
			player.removeSkill("dcyanxi_jueqing");
		},
		intro: {
			content: "还可以发动#次",
		},
		ai: {
			combo: "dczouyi",
		},
		subSkill: {
			jueqing: {
				trigger: {
					source: "damageBefore",
				},
				charlotte: true,
				filter(event, player) {
					return event.card?.storage?.dcyanxi;
				},
				direct: true,
				async content(event, trigger, player) {
					trigger.cancel();
					trigger.player.loseHp(trigger.num);
				},
				ai: {
					jueqing: true,
				},
			},
		},
	},
	//新杀诸葛均
	dcgengdu: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		frequent: true,
		async content(event, trigger, player) {
			const cards = get.cards(4);
			await game.cardsGotoOrdering(cards);
			await player.showCards(cards, `${get.translation(player)}发动了【耕读】`);
			const list = ["red", "black"];
			const result = await player
				.chooseControl(list)
				.set("prompt", "耕读：选择一种颜色的牌获得")
				.set(
					"choiceList",
					list.map(i => {
						const colors = cards.filter(card => get.color(card) == i);
						return `${get.translation(i)}：${colors.length ? get.translation(colors) : "空气"}`;
					})
				)
				.set("ai", () => {
					return get.event().results;
				})
				.set(
					"results",
					(() => {
						let count = color => cards.filter(card => get.color(card) == color);
						let results = list.sort((a, b) => count(b) - count(a));
						return results[0];
					})()
				)
				.forResult();
			const color = result.control,
				gains = cards.filter(card => get.color(card) == color);
			if (gains?.length) {
				await player.gain(gains, "gain2");
			}
			if (["red", "black"].includes(color)) {
				player.addTempSkill(`dcgengdu_${color}`, "phaseChange");
				player.setStorage(`dcgengdu_${color}`, cards.length - gains.length, true);
			}
		},
		subSkill: {
			red: {
				enable: "chooseToUse",
				charlotte: true,
				filter(event, player) {
					const list = event.dcgengduList;
					return list.length && player.countCards("hes", { color: "red" });
				},
				usable(skill, player) {
					return player.getStorage(skill, 0);
				},
				onChooseToUse(event) {
					if (game.online || event.dcgengduList) {
						return;
					}
					const player = event.player;
					let list = lib.inpile.filter(i => {
						if (get.type(i) != "trick") {
							return false;
						}
						if (event && !event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
							return false;
						}
						return true;
					});
					game.checkGlobalHistory("useCard", evt => {
						if (list.includes(evt.card.name)) {
							list.remove(evt.card.name);
						}
					});
					event.set("dcgengduList", list);
				},
				chooseButton: {
					dialog(event, player) {
						const list = event.dcgengduList;
						return ui.create.dialog("耕读", [list, "vcard"]);
					},
					check(button) {
						if (get.event().getParent().type != "phase") {
							return 1;
						}
						return get.player().getUseValue({ name: button.link[2] });
					},
					prompt(links, player) {
						return "将一张红色牌当作" + "【" + get.translation(links[0][2]) + "】使用";
					},
					backup(links, player) {
						return {
							audio: "dcgengdu",
							filterCard(card, player) {
								return get.color(card) === "red";
							},
							popname: true,
							check(card) {
								return 6 - get.value(card);
							},
							position: "hes",
							viewAs: { name: links[0][2] },
						};
					},
				},
				hiddenCard(player, name) {
					const skill = "dcgengdu_red";
					const count = player.stat[player.stat.length - 1].skill[skill] || 0;
					if (count >= get.info(skill).usable(skill, player)) {
						return false;
					}
					return player.hasCard(card => {
						if (_status.connectMode && get.position(card) === "h") {
							return true;
						}
						return get.color(card) === "red";
					}, "hes");
				},
				ai: {
					fireAttack: true,
					skillTagFilter(player) {
						if (!player.countCards("hse", { color: "red" })) {
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
				intro: {
					content: "本阶段限$次，你可以将一张红色牌当作本回合未被使用过的普通锦囊牌使用",
				},
				onremove: true,
			},
			black: {
				audio: "dcgengdu",
				trigger: {
					player: "useCardAfter",
				},
				usable(skill, player) {
					return player.getStorage(skill, 0);
				},
				filter(event, player) {
					if (!player.getStorage("dcgengdu_black", 0)) {
						return false;
					}
					return get.color(event.card) == "black";
				},
				forced: true,
				locked: false,
				charlotte: true,
				async content(event, trigger, player) {
					const next = player.draw(2);
					next.gaintag.add("dcgengdu");
					await next;
					player.addTempSkill("dcgengdu_mark");
				},
				intro: {
					content: "本阶段限$次，你使用黑色牌后摸两张牌，这些牌本回合无法使用或打出且不计入手牌上限",
				},
				onremove: true,
			},
			mark: {
				charlotte: true,
				locked: true,
				onremove(player) {
					player.removeGaintag("dcgengdu");
				},
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("dcgengdu")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("dcgengdu")) {
							return false;
						}
					},
					cardEnabled(card, player) {
						if (card.cards?.some(i => i.hasGaintag("dcgengdu"))) {
							return false;
						}
					},
					cardRespondable(card, player) {
						if (card.cards?.some(i => i.hasGaintag("dcgengdu"))) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (card.cards?.some(i => i.hasGaintag("dcgengdu"))) {
							return false;
						}
					},
				},
			},
			red_backup: {},
		},
	},
	dcgumai: {
		audio: 2,
		trigger: {
			player: "damageBegin3",
			source: "damageBegin1",
		},
		round: 1,
		filter(event, player) {
			return player.countCards("h");
		},
		async content(event, trigger, player) {
			const suit = get.suit(player.getCards("h")[0], player),
				bool = player.getCards("h").every(i => get.suit(i, player) == suit);
			await player.showHandcards(`${get.translation(player)}发动了【孤脉】`);
			if (event.triggername == "damageBegin1") {
				trigger.num++;
				player.popup(" +1 ", "fire");
				game.log(player, "令此伤害+1");
			} else {
				trigger.num--;
				player.popup(" -1 ", "water");
				game.log(player, "令此伤害-1");
			}
			if (bool) {
				const result2 = await player
					.chooseToDiscard("h", "是否弃置一张手牌并重置【孤脉】？")
					.set("ai", card => {
						const { player, eff } = get.event();
						if (eff) {
							return 7 - get.value(card);
						}
						return 0;
					})
					.set("eff", player.countCards("hs", card => player.hasValueTarget(card) && get.tag(card, "damage")) > 0)
					.forResult();
				if (result2.bool) {
					delete player.storage[event.name + "_roundcount"];
					player.unmarkSkill(event.name + "_roundcount");
				}
			}
		},
	},
	//新杀向宠 —— by 星の语
	dcguying: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			const num = player.storage.dcguying_double ? 2 : 1;
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, num])
				.set("ai", target => get.attitude(get.player(), target) / target.hp)
				.forResult();
		},
		async content(event, trigger, player) {
			player.storage.dcguying_double ??= true;
			const targets = event.targets,
				skill = "dcguying_effect";
			player.addTempSkill(skill, { player: "phaseJieshuBegin" });
			player.markAuto(skill, targets);
			targets.forEach(target => target.markAuto(event.name, player));
		},
		intro: {
			content: `下一次受到伤害后，依次摸体力上限张牌（最多摸5张），然后将超出体力上限的牌数交给<span class=thundertext>$</span>`,
		},
		subSkill: {
			effect: {
				audio: "dcguying",
				charlotte: true,
				forced: true,
				onremove(player, skill) {
					player.storage[skill].forEach(target => target.unmarkAuto("dcguying", player));
					delete player.storage[skill];
				},
				trigger: { global: "damageEnd" },
				filter(event, player) {
					return event.num > 0 && player.getStorage("dcguying_effect").includes(event.player);
				},
				logTarget: "player",
				async content(event, trigger, player) {
					if (player.storage.dcguying_double) {
						delete player.storage.dcguying_double;
					}
					const target = trigger.player;
					player.unmarkAuto(event.name, target);
					target.unmarkAuto("dcguying", player);
					await target.draw(Math.min(5, target.maxHp));
					const num = target.countCards("h") - target.maxHp;
					if (num > 0 && target != player) {
						await target
							.chooseToGive(`固营：将${num}张手牌交给${get.translation(player)}`, player, num, true)
							.set("ai", card => {
								return (get.event().goon > 0 ? 8 : 6) - get.value(card);
							})
							.set("goon", get.attitude(target, player));
					}
				},
			},
		},
	},
	dcmuzhen: {
		audio: 2,
		enable: "phaseUse",
		onChooseToUse(event) {
			if (game.online) {
				return;
			}
			const count =
				event.player.getHistory("useSkill", evt => evt.skill == "dcmuzhen" && evt.event.getParent("phaseUse") === event.getParent()).length +
				1;
			event.set("dcmuzhen_count", count);
		},
		filter(event, player) {
			const types = player
					.getCards("he")
					.map(card => get.type2(card))
					.unique(),
				count = event.dcmuzhen_count;
			return (
				types.length > 0 &&
				types.some(
					type =>
						!player.getStorage("dcmuzhen_used").includes(type) &&
						player.countCards("he", card => get.type2(card, player) == type) >= count
				)
			);
		},
		filterTarget: lib.filter.notMe,
		filterCard(card, player) {
			const selected = ui.selected.cards,
				type = get.type2(card, player),
				bool = !player.getStorage("dcmuzhen_used").includes(type);
			if (!selected.length) {
				return bool;
			}
			return get.type2(selected[0], player) == type && bool;
		},
		selectCard() {
			const count = get.event().dcmuzhen_count;
			return count;
		},
		position: "he",
		complexCard: true,
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const cards = event.cards,
				num = cards.length,
				type = get.type2(cards[0], player),
				target = event.targets[0],
				str = get.translation(target);
			player.addTempSkill(event.name + "_used", ["phaseChange", "phaseAfter"]);
			player.markAuto(event.name + "_used", type);
			await player.give(cards, target);
			const list = [`令${str}弃置等量其他类型的牌`, `获得${str}场上等量的牌`, `令${str}展示牌堆顶等量的牌，并获得其中类型相同的牌`],
				controls = [1, 2, 3].map(num => "选项" + (num == 2 ? "二" : get.cnNumber(num)));
			if (!target.countGainableCards(player, "ej")) {
				list[1] = `<span style="opacity:0.5; ">${list[1]}</span>`;
				controls.remove(controls[1]);
			}
			const result = await player
				.chooseControl(controls)
				.set("choiceList", list)
				.set("prompt", `睦阵：令${str}执行一项`)
				.set("ai", () => {})
				.forResult();
			if (!result?.control) {
				return;
			}
			if (result.control == "选项一") {
				const resultx = await target
					.chooseToDiscard(`睦阵：请弃置${num}张类型不为${get.translation(type)}的牌`, "he", num, true, card =>
						get.event().cardsx?.includes(card)
					)
					.set(
						"cardsx",
						target.getCards("he", card => get.type2(card, target) != type)
					)
					.forResult();
				if (resultx?.cards?.length < num) {
					await target.showHandcards();
				}
			} else if (result.control == "选项二") {
				await player.gainPlayerCard(target, "ej", num, true);
			} else if (result.control == "选项三") {
				const cardsx = get.cards(num, true);
				await target.showCards(cardsx);
				const gain = cardsx.filter(card => get.type(card, false) === type);
				if (gain.length) {
					await target.gain(gain, "gain2");
				}
			}
		},
		subSkill: {
			used: {
				onremove: true,
				charlotte: true,
				intro: {
					content: "已交出过<span class=thundertext>$</span>",
				},
			},
		},
	},
	//新杀夏侯玄
	dcboxuan: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (!event.targets?.length || !event.cards?.length) {
				return false;
			}
			if (!event.targets?.some(target => target != player) && !player.storage.dcboxuan) {
				return false;
			}
			return player.hasHistory("lose", evt => {
				const evtx = evt.relatedEvent || evt.getParent();
				if (evtx != event) {
					return false;
				}
				return evt.getl(player)?.hs?.length;
			});
		},
		frequent: true,
		check: () => true,
		async content(event, trigger, player) {
			const cards = get.bottomCards(3, true);
			await player
				.showCards(cards, `${get.translation(player)}发动了【博玄】`)
				.set("log", (cards, player) => [player, "展示了牌堆底的", cards]);
			const list = ["cardNameLength", "suit", "type2"].map(attri => cards.some(card => get[attri](trigger.card) == get[attri](card)));
			if (list[0]) {
				await player.draw();
			}
			if (
				list[1] &&
				game.hasPlayer(target => {
					return target.countDiscardableCards(player, "he") && target != player;
				})
			) {
				const result = await player
					.chooseTarget(`博玄：你可弃置一名其他角色一张牌`, (card, player, target) => {
						return target.countDiscardableCards(player, "he") && target != player;
					})
					.set("ai", target => get.effect(target, { name: "guohe_copy2" }, get.player(), get.player()))
					.forResult();
				if (result?.targets) {
					player.line(result.targets);
					await player.discardPlayerCard(result.targets[0], "he", true);
				}
			}
			if (list[2] && cards.some(card => player.hasUseTarget(card, true, true))) {
				const result = await player
					.chooseCardButton(`博玄：你可以使用一张展示牌`, cards)
					.set("filterButton", button => get.player().hasUseTarget(button.link, true, true))
					.set("ai", button => get.player().getUseValue(button.link))
					.forResult();
				if (result?.links) {
					const card = result.links[0];
					if (player.hasUseTarget(card, true, true)) {
						await player.chooseUseTarget(card);
					}
				}
			}
			/*if (player.storage.dcboxuan) {
				const put = trigger.cards.filterInD("od");
				if (!put.length) return;
				const result = await player
					.chooseBool()
					.set("createDialog", [`博玄：是否将这些牌置于牌堆底`, put])
					.set("ai", () => Math.random() > 0.5)
					.forResult();
				if (result?.bool) {
					game.log(player, "将", put, "置于牌堆底");
					await game.cardsGotoPile(put);
				}
			}*/
		},
	},
	dcboxuan_rewrite: {
		//空技能，博玄修改后
	},
	dcyizheng: {
		audio: 2,
		trigger: { player: ["phaseBegin"] }, //, "phaseEnd"
		filter(event, player) {
			return (
				player.countCards("h") &&
				game.hasPlayer(target => {
					return target != player && target.countCards("h");
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, player.maxHp], (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					if (player.hp == 1) {
						return 0;
					}
					return -get.attitude(get.player(), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = [player].concat(event.targets).sortBySeat();
			//先选牌
			let showEvent = player
				.chooseCardOL(targets, "议政：请选择要展示的牌", true)
				.set("ai", function (card) {
					return -get.value(card);
				})
				.set("source", player);
			showEvent.aiCard = function (target) {
				const hs = target.getCards("h");
				return { bool: true, cards: [hs.randomGet()] };
			};
			showEvent._args.remove("glow_result");
			const result = await showEvent.forResult();
			const cards = [];
			for (var i = 0; i < targets.length; i++) {
				cards.push(result[i].cards[0]);
			}
			await player
				.showCards(cards, `${get.translation(player)} 发动了【${get.translation(event.name)}】`, false)
				.set("showers", targets)
				.set("customButton", button => {
					const target = get.owner(button.link);
					if (target) {
						button.node.gaintag.innerHTML = target.getName();
					}
				})
				.set("delay_time", targets.length * 1.5);
			if (cards.map(card => get.type2(card)).unique().length == 1) {
				player.popup("洗具");
				const result = await player
					.chooseTarget(true)
					.set("createDialog", [`议政：令一名角色获得这些牌`, cards])
					.set("ai", target => get.attitude(get.player(), target))
					.forResult();
				if (result?.targets) {
					const target = result.targets[0];
					player.line(target);
					let gainEvent = target.gain(cards);
					gainEvent.set(
						"givers",
						targets.filter(i => i != target)
					);
					gainEvent.set("animate", function (event) {
						const player = event.player,
							cards = event.cards,
							givers = event.givers;
						for (let i = 0; i < givers.length; i++) {
							givers[i].$give(cards[i], player);
						}
						return 500;
					});
					await gainEvent;
				}
			} else {
				player.popup("杯具");
				await game
					.loseAsync({
						lose_list: targets.map((target, index) => {
							return [target, [cards[index]]];
						}),
						discarder: player,
					})
					.setContent("discardMultiple");
			}
		},
	},
	dcguilin: {
		audio: 2,
		derivation: ["dcboxuan_rewrite"],
		limited: true,
		unique: true,
		skillAnimation: true,
		animationColor: "thunder",
		enable: "phaseUse",
		trigger: { player: "dying" },
		filter(event, player) {
			if (event.name == "dying") {
				return player.isDying();
			}
			return true;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = player.getDamagedHp();
			await player.recover(num);
			//await player.draw(num);
			await player.removeSkills("dcyizheng");
			if (player.hasSkill("dcboxuan", null, null, false)) {
				player.storage.dcboxuan = true;
			}
			game.log(player, `修改了〖博玄〗`);
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
	},
	//侯成
	dcxianniang: {
		audio: 2,
		trigger: {
			player: ["loseAfter", "damageEnd"],
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (player.getStorage("dcxianniang_used").includes(event.name === "damage" ? "damage" : "lose")) {
				return false;
			}
			if (!game.hasPlayer(current => player !== current && player.countCards("h") <= current.countCards("h") && current.countCards("he") > 0)) {
				return false;
			}
			if (event.name === "damage") {
				return true;
			}
			if (event.type !== "discard" || (event.discarder || event.getParent(2).player) === player) {
				return false;
			}
			return (event.getl?.(player)?.cards2 ?? []).length > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player !== target && player.countCards("h") <= target.countCards("h") && target.countCards("he") > 0;
				})
				.set("ai", target => {
					let att = get.attitude(get.player(), target) * -1;
					if (target.getHp() < target.countCards("h")) {
						return att * 2;
					}
					return att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.addTempSkill(event.name + "_used", "roundStart");
			player.markAuto(event.name + "_used", trigger.name == "damage" ? "damage" : "lose");
			const {
				targets: [target],
			} = event;
			const tag = event.name + "_tag";
			const position = target != player ? "he" : "h";
			if (!target.countGainableCards(player, position)) {
				return;
			}
			const next = player.gainPlayerCard(target, [1, 2], position, true);
			next.gaintag.add(tag);
			const { links } = await next.forResult();
			if (!links?.length) {
				return;
			}
			player.addSkill(tag);
			const num = links.length;
			const targetsx = game.filterPlayer(current => current != player && current != target);
			if (player.countCards("h") && targetsx.length) {
				const { bool, cards, targets } = await player
					.chooseCardTarget({
						prompt: "献酿：你可将至多" + get.cnNumber(num) + "张牌交给另一名其他角色",
						filterCard: true,
						position: "he",
						selectCard: [1, num],
						filterTarget: (card, player, target) => get.event().targetsx.includes(target),
						ai1(card) {
							if (card.name == "du") {
								return 10;
							}
							const player = get.player();
							if (
								!game.hasPlayer(current => {
									return get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
								})
							) {
								return 0;
							}
							return 1 / Math.max(0.1, get.value(card));
						},
						ai2(target) {
							let player = get.player(),
								att = get.attitude(player, target);
							if (ui.selected.cards[0].name == "du") {
								return -att;
							}
							if (target.hasSkillTag("nogain")) {
								att /= 6;
							}
							return att;
						},
						targetsx: targetsx,
					})
					.forResult();
				if (bool) {
					player.line(targets[0]);
					targets[0].addSkill(tag);
					const next = targets[0].gain(cards, player, "giveAuto");
					next.gaintag.add(tag);
					await next;
				}
			}
			if (player.getRoundHistory("gain", evt => evt.getParent(2).name == event.name).reduce((num, evt) => num + evt.cards.length, 0) > 2) {
				await player.loseHp();
			}
		},
		subSkill: {
			tag: {
				charlotte: true,
				mod: {
					cardname(card) {
						const evt = get.event();
						if (evt.name !== "chooseToUse") {
							return;
						}
						if (get.type(card, null, false) == "basic" && card.hasGaintag("dcxianniang_tag")) {
							return "jiu";
						}
					},
					cardnature(card) {
						const evt = get.event();
						if (evt.name !== "chooseToUse") {
							return;
						}
						if (get.type(card, null, false) == "basic" && card.hasGaintag("dcxianniang_tag")) {
							return false;
						}
					},
				},
				ai: {
					save: true,
					skillTagFilter(player, tag, arg) {
						if (
							!player.countCards("h", card => {
								return get.type(card, null, false) == "basic" && card.hasGaintag("dcxianniang_tag");
							})
						) {
							return false;
						}
					},
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//张翼
	dcmurui: {
		//direct打赢复活赛力
		audio: 2,
		trigger: {
			global: ["roundStart", "phaseAfter"],
			player: "phaseBegin",
		},
		filter(event, player, name) {
			if (player.getStorage("dcmurui_filter").includes(name)) {
				return false;
			}
			return (
				(name === "phaseAfter" && game.getGlobalHistory("everything", evt => evt.name == "die").length) ||
				["phaseBegin", "roundStart"].includes(name)
			);
		},
		direct: true,
		clearTime: true,
		async content(event, trigger, player) {
			let name = event.triggername;
			player
				.when({ player: ["useCardAfter", "dcmurui"] }, false)
				.filter((evt, player, namex) => {
					return (
						namex === "dcmurui" ||
						(player.getStorage("dcmurui").includes(evt.card) &&
							["sourceDamage", "damage"].some(type =>
								game.hasPlayer2(current => current.hasHistory(type, evtx => evt.card === evtx.card))
							))
					);
				})
				.assign({ firstDo: true })
				.step(async (event, trigger, player) => {
					if (event.triggername === "dcmurui") {
						return;
					}
					await player.draw(2);
					player.markAuto("dcmurui_filter", name);
					player.markSkill("dcaoren");
				})
				.finish();
			const result = await player
				.chooseToUse("使用一张牌，若造成伤害则不能再于此时用牌")
				.set("oncard", () => {
					const event = get.event(),
						{ card, player } = event;
					player.markAuto("dcmurui", [card]);
				})
				.set("addCount", false)
				.set("logSkill", event.name)
				.forResult();
			await event.trigger("dcmurui");
		},
	},
	dcaoren: {
		audio: 2,
		intro: {
			markcount: (_, player) => player.getStorage("dcmurui_filter").length - player.countMark("dcaoren_used"),
			content: (_, player) => "当前剩余发动次数：" + (player.getStorage("dcmurui_filter").length - player.countMark("dcaoren_used")),
		},
		trigger: {
			player: "useCardAfter",
		},
		filter: (event, player) =>
			player.countMark("dcaoren_used") < player.getStorage("dcmurui_filter").length &&
			get.type(event.card) === "basic" &&
			event.cards.filterInD().length,
		async content(event, trigger, player) {
			await player.gain(trigger.cards.filterInD(), "gain2");
			player.addMark("dcaoren_used", 1, false);
			player.addTempSkill("dcaoren_used", "roundStart");
		},
		ai: {
			combo: "dcmurui",
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//庞宏
	dcpingzhi: {
		audio: 2,
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		usable: 1,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return target.countCards("h");
		},
		intro: {
			content(storage) {
				return (
					"转换技，出牌阶段限一次，你可观看一名角色的手牌并展示其中一张牌，" +
					(storage ? "然后其使用此牌，若此牌造成伤害" : "你弃置此牌，然后其视为对你使用一张【火攻】，若其未因此造成伤害") +
					"则此技能视为未发动过。"
				);
			},
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.changeZhuanhuanji(event.name);
			const result = await player
				.choosePlayerCard(target, true, `请选择${get.translation(target)}一张手牌展示`, "visible", "h")
				.set("ai", button => {
					const { player, target } = get.event(),
						{ link } = button;
					const att = get.attitude(player, target),
						storage = player.storage.dcpingzhi,
						huogong = get.autoViewAs({ name: "huogong", isCard: true });
					if (att > 0) {
						return storage ? 6 - get.value(link) : player.getUseValue(link);
					}
					return storage
						? get.value(link) + get.effect(player, huogong, target, player) < 0 &&
							!player.hasCard(card => get.suit(card) == get.suit(link))
							? 2
							: 0
						: -target.getUseValue(link);
				})
				.forResult();
			if (!result?.cards?.length) {
				return;
			}
			const { cards } = result;
			player.addTempSkill(event.name + "_check", "phaseUseAfter");
			await player.showCards(cards, `${get.translation(player)}对${get.translation(target)}发动了【评骘】`);
			if (player.storage[event.name]) {
				await target.modedDiscard(cards, player);
				const huogong = get.autoViewAs({ name: "huogong", isCard: true });
				if (target.canUse(huogong, player, false)) {
					await target.useCard(huogong, player, false);
				} else if (player.getStat("skill")[event.name]) {
					delete player.getStat("skill")[event.name];
					game.log(player, "重置了", "#g【评骘】");
				}
			} else if (target.hasUseTarget(cards[0])) {
				await target.chooseUseTarget(cards[0], true, false);
			}
		},
		ai: {
			order(item, player) {
				const storage = player.storage.dcpingzhi;
				if (!storage) {
					return game.hasPlayer(
						current =>
							get.effect(current, { name: "guohe_copy2" }, player, player) + get.effect(player, { name: "huogong" }, current, player) >
							0
					)
						? 10
						: 1;
				}
				return game.hasPlayer(
					current =>
						get.effect(current, { name: "guohe_copy2" }, player, player) > 0 ||
						(current.hasCard(card => current.hasValueTarget(card) > 0, "h") && get.attitude(player, current) > 0)
				)
					? 10
					: 1;
			},
			result: {
				target(player, target) {
					const storage = player.storage.dcpingzhi;
					if (!storage) {
						return !player.countCards("h") ||
							get.effect(target, { name: "guohe_copy2" }, player, player) + get.effect(player, { name: "huogong" }, target, player) > 0
							? -1
							: 0;
					}
					return get.attitude(player, target) > 0 && target.hasCard(card => target.hasValueTarget(card) > 0, "h")
						? 1
						: get.effect(target, { name: "guohe_copy2" }, player, player);
				},
			},
		},
		subSkill: {
			check: {
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					if (!player.getStat().skill.dcpingzhi) {
						return false;
					}
					if (player.storage.dcpingzhi) {
						return (
							event.getParent().name == "dcpingzhi" &&
							!game.hasPlayer2(current => current.hasHistory("damage", evtx => evtx.card === event.card))
						);
					} else {
						return (
							event.getParent(2).name == "dcpingzhi" &&
							game.hasPlayer2(current => current.hasHistory("damage", evtx => evtx.card === event.card))
						);
					}
				},
				charlotte: true,
				silent: true,
				async content(event, trigger, player) {
					delete player.getStat("skill").dcpingzhi;
					game.log(player, "重置了", "#g【评骘】");
				},
			},
		},
	},
	dcgangjian: {
		audio: 2,
		trigger: {
			global: "phaseAfter",
		},
		forced: true,
		filter(event, player) {
			if (player.getHistory("damage").length) {
				return false;
			}
			let num = 0;
			game.getGlobalHistory("everything", evt => {
				return evt.name == "showCards" && evt.cards.length;
			}).forEach(evt => {
				num += evt.cards.length;
			});
			return num > 0;
		},
		async content(event, trigger, player) {
			let num = 0;
			game.getGlobalHistory("everything", evt => {
				return evt.name == "showCards" && evt.cards.length;
			}).forEach(evt => {
				num += evt.cards.length;
			});
			await player.draw(Math.min(num, 5));
		},
	},
	//乐周瑜
	dcguyin: {
		audio: 2,
		trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "gameDrawBegin"] },
		filter(event, player) {
			if (event.name == "gameDraw") {
				return true;
			} else if (event.name.indexOf("lose") === 0) {
				if (event.type != "discard" || event.getlx === false || event.position !== ui.discardPile) {
					return false;
				}
			} else {
				const evtx = event.getParent();
				if (evtx.name !== "orderingDiscard") {
					return false;
				}
				const evt2 = evtx.relatedEvent || evtx.getParent();
				if (evt2.name != "useCard") {
					return false;
				}
			}
			const list = game
				.filterPlayer2(current => player != current)
				.reduce((listx, i) => {
					if (i._start_cards) {
						listx.addArray(i._start_cards);
					}
					return listx;
				}, []);
			return game.hasPlayer(current => {
				const cards = event.name == "cardsDiscard" ? event.cards.filterInD("d") : event.getl(current)?.cards2 || [];
				return cards.some(card => list.includes(card));
			});
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.name == "gameDraw") {
				const me = player;
				const numx = trigger.num;
				trigger.num = function (player) {
					return player == me ? 0 : 1 + (typeof numx == "function" ? numx(player) : numx);
				};
			} else {
				await player.draw();
			}
		},
	},
	dcpinglu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (player.hasCard(card => card.hasGaintag("dcpinglu_mark"), "h")) {
				return false;
			}
			return game.hasPlayer(current => get.info("dcpinglu").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return player.inRange(target) && target.countGainableCards(player, "h");
		},
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const gains = [];
			for (const target of event.targets.sortBySeat()) {
				const cards = target.getCards("h", card => lib.filter.canBeGained(card, target, player));
				if (cards.length) {
					gains.push(cards.randomGet());
				}
			}
			if (!gains.length) {
				return;
			}
			player.addTempSkill(event.name + "_mark", "phaseUseAfter");
			const next = player.gain(gains, "giveAuto");
			next.gaintag.add(event.name + "_mark");
			await next;
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
		subSkill: {
			mark: {
				mod: {
					aiOrder(player, card, num) {
						if (
							get.itemtype(card) == "card" &&
							card.hasGaintag("dcpinglu_mark") &&
							game.hasPlayer(current => {
								return player.inRange(current) && current.countGainableCards(player, "h") && get.attitude(player, current) < 0;
							})
						) {
							return num + 0.1;
						}
					},
				},
				charlotte: true,
				onremove: (player, skill) => player.removeGaintag(skill),
			},
		},
	},
	//乐貂蝉
	dctanban: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		locked: false,
		content() {
			const cards = player.getCards("h");
			player.addGaintag(cards, "dctanban");
		},
		mod: {
			ignoredHandcard(card) {
				if (card.hasGaintag("dctanban")) {
					return true;
				}
			},
			cardDiscardable(card, _, name) {
				if (name == "phaseDiscard" && card.hasGaintag("dctanban")) {
					return false;
				}
			},
		},
		group: "dctanban_change",
		subSkill: {
			change: {
				audio: "dctanban",
				trigger: { player: "phaseDrawEnd" },
				filter(event, player) {
					return player.countCards("h");
				},
				prompt2: () => "交换手牌中的“檀板”牌",
				check(event, player) {
					return player.countCards("h", card => !card.hasGaintag("dctanban")) * 2 < player.countCards("h");
				},
				content() {
					const cards = player.getCards("h", card => !card.hasGaintag("dctanban"));
					player.removeGaintag("dctanban");
					player.addGaintag(cards, "dctanban");
				},
			},
		},
	},
	dcdiou: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (!player.hasCard(card => _status.connectMode || !card.hasGaintag("dctanban"), "h")) {
				return false;
			}
			return player.hasHistory("lose", evt => {
				const evtx = evt.relatedEvent || evt.getParent();
				if (evtx != event) {
					return false;
				}
				return Object.keys(evt.gaintag_map).some(i => evt.gaintag_map[i].includes("dctanban"));
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), (card, player) => {
					return !card.hasGaintag("dctanban");
				})
				.set("ai", card => {
					const player = get.player();
					const shown = game
						.getGlobalHistory("everything", evt => {
							return evt.name === "showCards";
						})
						.reduce((list, evt) => list.addArray(evt.cards), []);
					const cardx = {
						name: get.name(card, player),
						nature: get.nature(card, player),
						isCard: true,
					};
					return player.getUseValue(cardx) + (shown.includes(card) && get.event().getTrigger().card.name !== cardx.name)
						? 0
						: get.effect(player, { name: "draw" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const next = player.showCards(event.cards, get.translation(player) + "发动了【低讴】");
			await next;
			const cardx = {
				name: get.name(event.cards[0], player),
				nature: get.nature(event.cards[0], player),
				isCard: true,
			};
			if (get.type(cardx) !== "equip" && get.type(cardx) !== "delay" && player.hasUseTarget(cardx)) {
				await player.chooseUseTarget(cardx, true, false);
			}
			if (
				!game.getGlobalHistory(
					"everything",
					evt => {
						return evt.name === "showCards" && evt !== next && evt.cards.includes(event.cards[0]);
					},
					next
				).length ||
				trigger.card.name === cardx.name
			) {
				await player.draw(2);
			}
		},
		ai: {
			combo: "dctanban",
		},
	},
	//黄舞蝶
	dcshuangrui: {
		onChooseTarget(event, player) {
			event.targetprompt2.add(target => {
				if (event.getParent().skill !== "dcshuangrui" || !target.classList.contains("selectable")) {
					return;
				}
				if (player.inRange(target)) {
					return "加伤";
				} else {
					return "不可响应";
				}
			});
		},
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(current => {
				return current != player && player.canUse({ name: "sha", isCard: true }, current, false);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					return target != player && player.canUse({ name: "sha", isCard: true }, target, false);
				})
				.set("ai", target => {
					const player = get.player(),
						card = { name: "sha", isCard: true };
					return get.effect(target, card, player, player);
				})
				.set("_get_card", { name: "sha", isCard: true })
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let directHit = [],
				baseDamage = 1;
			if (player.inRange(target)) {
				baseDamage++;
				await player.addTempSkills("dcshaxue");
			} else {
				directHit.addArray(game.players);
				await player.addTempSkills("dcshouxing");
			}
			await player.useCard({ name: "sha", isCard: true }, target, false).set("directHit", directHit).set("baseDamage", baseDamage);
		},
		ai: {
			skillTagFilter(player, tag, arg) {
				if (!_status.event.getParent("dcshuangrui_cost", true, true)) {
					return false;
				}
				return !player.inRange(arg.target);
			},
			directHit_ai: true,
		},
		derivation: ["dcshouxing", "dcshaxue"],
	},
	dcfuxie: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => current != player && current.countCards("he"));
		},
		chooseButton: {
			dialog(event, player) {
				const skills = player.getSkills(null, false, false).filter(skill => {
					let info = get.info(skill);
					if (!info || info.charlotte || get.skillInfoTranslation(skill, player).length == 0) {
						return false;
					}
					return true;
				});
				const dialog = ui.create.dialog("伏械：弃置一张武器牌或失去1个技能");
				dialog.direct = true;
				dialog.add([
					[["discardEquip1", "弃置武器牌"]],
					(item, type, position, noclick, node) => {
						node = ui.create.buttonPresets.tdnodes(item, type, position, noclick);
						node.link = ["discard", "equip1"];
						return node;
					},
				]);
				dialog.add([skills, "skill"]);
				return dialog;
			},
			filter(button, player) {
				if (Array.isArray(button.link)) {
					return player.countDiscardableCards(player, "he", card => get.subtype(card) == button.link[1]);
				}
				return true;
			},
			check(button) {
				const player = get.player();
				if (Array.isArray(button.link)) {
					if (player.countDiscardableCards(player, "he", card => get.subtype(card) == button.link[1] && get.value(card) < 10)) {
						return 3;
					}
					return 1;
				}
				if (["dcshouxing", "dcshaxue"].includes(button.link)) {
					return 4;
				}
				return 2;
			},
			backup(result, player) {
				return {
					audio: "dcfuxie",
					choice: result[0],
					filterCard(card) {
						const { choice } = get.info("dcfuxie_backup");
						if (Array.isArray(choice)) {
							return get.subtype(card) == "equip1" && lib.filter.cardDiscardable(card, player, "dcfuxie");
						}
						return false;
					},
					position: "he",
					selectCard() {
						const { choice } = get.info("dcfuxie_backup");
						if (Array.isArray(choice)) {
							return 1;
						}
						return -1;
					},
					filterTarget(card, player, target) {
						return target != player && target.countCards("he");
					},
					async content(event, trigger, player) {
						const { choice } = get.info("dcfuxie_backup");
						if (Array.isArray(choice)) {
							await player.modedDiscard(event.cards);
						} else {
							await player.removeSkills(choice);
						}
						const target = event.target;
						await target.chooseToDiscard(2, true, "he");
					},
					ai1(card) {
						return 10 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					},
				};
			},
			prompt(result, player) {
				let prompt = Array.isArray(result[0]) ? "弃置一张武器牌" : `失去【${get.translation(result[0])}】`;
				return `${prompt}，令一名角色弃置两张牌`;
			},
		},
		subSkill: {
			backup: {},
		},
		ai: {
			order: 3,
			result: {
				player(player, target) {
					if (["dcshouxing", "dcshaxue"].some(skill => player.hasSkill(skill))) {
						return 1;
					}
					if (player.countCards("he", card => get.subtype(card) == "equip1")) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	dcshouxing: {
		audio: 2,
		enable: "chooseToUse",
		filterCard: true,
		selectCard: [1, Infinity],
		position: "hse",
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			if (!player.countCards("hse")) {
				return false;
			}
		},
		filterTarget(card, player, target) {
			const cards = ui.selected.cards;
			if (!cards || !cards.length) {
				return false;
			}
			if (player.inRange(target)) {
				return false;
			}
			if (get.distance(player, target) != cards.length) {
				return false;
			}
			return lib.filter.targetEnabled(card, player, target);
		},
		complexSelect: true,
		prompt: "将X张牌当杀对一名攻击范围外的角色使用（X为你计算与其的距离）",
		check(card) {
			return 4.5 - get.value(card);
		},
		async precontent(event) {
			event.getParent().addCount = false;
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("hes")) {
					return false;
				}
			},
			respondSha: true,
		},
	},
	dcshaxue: {
		audio: 2,
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			return event.player != player;
		},
		check(event, player) {
			return get.distance(player, event.player) <= 2;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.draw(2);
			const num = get.distance(player, trigger.player);
			if (num > 0 && trigger.player.isIn()) {
				await player.chooseToDiscard(num, "he", true);
			}
		},
	},
	//马腾
	dcxiongyi: {
		skillAnimation: true,
		animationColor: "gray",
		unique: true,
		enable: "phaseUse",
		audio: "xiongyi",
		limited: true,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await game.asyncDraw([event.target, player], 3);
			if (
				game
					.getAllGlobalHistory("everything", evt => {
						return evt.name == event.name && evt.player == player;
					})
					.indexOf(event) == 0 &&
				player.isMinHp(true)
			) {
				if (player.isDamaged()) {
					await player.recover();
				}
			}
			player.addAdditionalSkill(event.name, "dcxiongyi_restore");
		},
		ai: {
			order: 1,
			result: {
				target: 1,
			},
		},
		subSkill: {
			restore: {
				trigger: {
					player: "dyingAfter",
				},
				charlotte: true,
				direct: true,
				filter(event, player) {
					return player.isIn();
				},
				async content(event, trigger, player) {
					game.log(player, "重置了", "#g【雄异】");
					player.restoreSkill("dcxiongyi");
					player.addAdditionalSkill("dcxiongyi", []);
				},
			},
		},
	},
	//群祝融
	dcremanhou: {
		audio: "dcmanhou",
		enable: "phaseUse",
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###蛮后###摸至多四张牌并执行等量项");
			},
			chooseControl(event, player) {
				var list = Array.from({
					length: 4,
				}).map((_, i) => get.cnNumber(i + 1) + "张");
				list.push("cancel2");
				return list;
			},
			check(event, player) {
				if (
					get.effect(player, { name: "losehp" }, player, player) > 4 ||
					player.countCards("hs", card => player.canSaveCard(card, player)) > 0 ||
					player.hp > 2
				) {
					return "四张";
				}
				return "两张";
			},
			backup(result, player) {
				return {
					num: result.control,
					audio: "dcmanhou",
					filterCard: () => false,
					selectCard: -1,
					async content(event, trigger, player) {
						var num =
							Array.from({
								length: 4,
							})
								.map((_, i) => get.cnNumber(i + 1) + "张")
								.indexOf(lib.skill.dcremanhou_backup.num) + 1;
						await player.draw(num);
						if (num >= 1) {
							await player.removeSkills("dcretanluan");
						}
						if (num >= 2 && player.countCards("h")) {
							await player.chooseToDiscard("h", true);
						}
						if (num >= 3) {
							//await player.loseHp();
							if (game.hasPlayer(target => target.countDiscardableCards(player, "ej"))) {
								const [target] =
									(
										await player
											.chooseTarget(
												"弃置场上的一张牌",
												(card, player, target) => {
													return target.countDiscardableCards(player, "ej");
												},
												true
											)
											.set("ai", target => {
												const player = get.player();
												return get.effect(target, { name: "guohe_copy", position: "ej" }, player, player);
											})
											.forResult()
									).targets ?? [];
								if (target) {
									player.line(target);
									await player.discardPlayerCard(target, "ej", true);
								}
							}
						}
						if (num >= 4) {
							await player.loseHp();
							/*if (player.countCards("h")) {
								await player.chooseToDiscard("he", true);
							}*/
							await player.addSkills("dcretanluan");
						}
					},
				};
			},
		},
		ai: {
			order: 8,
			result: { player: 1 },
		},
		subSkill: { backup: {} },
		derivation: "dcretanluan",
	},
	dcretanluan: {
		init(player, skill) {
			if (typeof player.getStat("skill")?.[skill] === "number") {
				delete player.getStat("skill")[skill];
			}
		},
		onChooseToUse(event) {
			if (!game.online && !event.dcretanluan) {
				event.set(
					"dcretanluan",
					game.filterPlayer2().reduce((list, target) => {
						return list.addArray(
							target
								.getHistory("lose", evt => {
									return evt.type === "discard";
								})
								.map(evt => evt.cards.filterInD("d"))
								.flat()
								.unique()
						);
					}, [])
				);
			}
		},
		audio: "dctanluan",
		enable: "phaseUse",
		filter(event, player) {
			return event.dcretanluan?.some(card => player.hasUseTarget(card));
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog('###探乱###<div class="text center">' + lib.translate.dcretanluan_info + "</div>");
				dialog.add(event.dcretanluan);
				return dialog;
			},
			filter(button, player) {
				return player.hasUseTarget(button.link);
			},
			check(button) {
				const card = button.link;
				return get.player().getUseValue(card) * (get.tag(card, "damage") >= 1 ? 3 : 1);
			},
			prompt(links) {
				return (
					'###探乱###<div class="text center">使用' +
					get.translation(links) +
					"，若此牌被【无懈可击】抵消或你因此对其他角色造成伤害，则重置〖蛮后〗</div>"
				);
			},
			backup(links, player) {
				return {
					audio: "dctanluan",
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					viewAs: links[0],
					card: links[0],
					precontent() {
						player.addTempSkill("dcretanluan_effect");
						const card = get.info("dcretanluan_backup").card;
						event.result.cards = [card];
						event.result.card = get.autoViewAs(card, [card]);
						event.result.card.dcretanluan = true;
					},
				};
			},
		},
		subSkill: {
			backup: {},
			effect: {
				charlotte: true,
				audio: "dctanluan",
				trigger: {
					source: "damageSource",
					player: "eventNeutralized",
				},
				filter(event, player) {
					if (typeof player.getStat("skill")["dcremanhou"] !== "number") {
						return false;
					}
					if (event.name == "damage") {
						return event.card?.dcretanluan === true && event.player != player;
					}
					if (event.type != "card" && event.name != "_wuxie") {
						return false;
					}
					return event.card?.dcretanluan === true; // && !player.getStorage("dcremanhou_record").includes(event.player)
				},
				forced: true,
				content() {
					delete player.getStat("skill")["dcremanhou"];
					player.popup("dcremanhou");
					game.log(player, "重置了技能", "【" + get.translation("dcremanhou") + "】");
					/*player.addTempSkill("dcremanhou_record");
					player.markAuto("dcremanhou_record", [trigger.player]);*/
				},
			},
			record: {
				charlotte: true,
				onremove: true,
				intro: { content: "【探乱】已记录角色：$" },
			},
		},
	},
	dcmanhou: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###蛮后###摸至多四张牌并执行等量项");
			},
			chooseControl(event, player) {
				var list = Array.from({
					length: 4,
				}).map((_, i) => get.cnNumber(i + 1) + "张");
				list.push("cancel2");
				return list;
			},
			check(event, player) {
				if (
					get.effect(player, { name: "losehp" }, player, player) > 4 ||
					player.countCards("hs", card => player.canSaveCard(card, player)) > 0 ||
					player.hp > 2
				) {
					return "四张";
				}
				return "两张";
			},
			backup(result, player) {
				return {
					num: result.control,
					audio: "dcmanhou",
					filterCard: () => false,
					selectCard: -1,
					async content(event, trigger, player) {
						var num =
							Array.from({
								length: 4,
							})
								.map((_, i) => get.cnNumber(i + 1) + "张")
								.indexOf(lib.skill.dcmanhou_backup.num) + 1;
						await player.draw(num);
						if (num >= 1) {
							await player.removeSkills("dctanluan");
						}
						if (num >= 2 && player.countCards("h")) {
							await player.chooseToDiscard("h", true);
						}
						if (num >= 3) {
							await player.loseHp();
						}
						if (num >= 4) {
							if (player.countCards("he")) {
								await player.chooseToDiscard("he", true);
							}
							await player.addSkills("dctanluan");
						}
					},
				};
			},
		},
		ai: {
			order: 8,
			result: { player: 1 },
		},
		subSkill: { backup: {} },
	},
	dctanluan: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.isFirstTarget;
		},
		locked: true,
		async cost(event, trigger, player) {
			const num = trigger.targets.length,
				num1 = game.filterPlayer(current => !trigger.targets.includes(current)).length;
			if (num >= num1 && trigger.targets.some(current => current.countDiscardableCards(player, "ej"))) {
				event.result = await player
					.chooseTarget(get.prompt(event.skill), (card, player, target) => {
						const evt = _status.event.getTrigger();
						return evt.targets.includes(target) && target.countDiscardableCards(player, "ej");
					})
					.set("ai", target => {
						const player = get.player();
						const att = get.attitude(player, target);
						if (
							att > 0 &&
							(target.countCards("j") > 0 ||
								target.countCards("e", card => {
									return get.value(card, target) < 0;
								}))
						) {
							return 2;
						}
						if (att < 0 && target.countCards("e") > 0 && !target.hasSkillTag("noe")) {
							return -1;
						}
						return 0;
					})
					.forResult();
			} else {
				event.result = {
					bool: true,
				};
			}
		},
		async content(event, trigger, player) {
			if (event.targets && event.targets.length) {
				await player.discardPlayerCard(event.targets[0], "ej", `弃置${get.translation(event.targets[0])}场上的一张牌`, true);
			} else {
				player.addTempSkill("dctanluan_add");
			}
		},
		subSkill: {
			add: {
				audio: "dctanluan",
				trigger: {
					player: "useCard2",
				},
				async cost(event, trigger, player) {
					player.removeSkill("dctanluan_add");
					var goon = false;
					var info = get.info(trigger.card);
					if (!["basic", "trick"].includes(get.type(trigger.card))) {
						return;
					}
					if (trigger.targets && !info.multitarget) {
						if (
							game.hasPlayer(function (current) {
								return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current);
							})
						) {
							goon = true;
						}
					}
					if (!goon) {
						return;
					}
					event.result = await player
						.chooseTarget("是否发动【探乱】？", `为${get.translation(trigger.card)}添加一个目标`, (card, player, target) => {
							const evt = _status.event.getTrigger();
							return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target);
						})
						.set("ai", target => {
							return get.effect(target, _status.event.getTrigger().card, get.player());
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const targets = event.targets;
					player.line(targets, "green");
					trigger.targets.addArray(targets);
				},
			},
		},
	},
	//乐诸葛果
	dcxidi: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		content() {
			const cards = player.getCards("h");
			player.addGaintag(cards, "dcxidi_tag");
		},
		mod: {
			ignoredHandcard(card) {
				if (card.hasGaintag("dcxidi_tag")) {
					return true;
				}
			},
			cardDiscardable(card, _, name) {
				if (name == "phaseDiscard" && card.hasGaintag("dcxidi_tag")) {
					return false;
				}
			},
		},
		group: "dcxidi_guanxing",
		subSkill: {
			guanxing: {
				audio: "dcxidi",
				trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
				forced: true,
				locked: false,
				preHidden: true,
				async content(event, trigger, player) {
					const num = Math.max(
						1,
						player.countCards("h", card => card.hasGaintag("dcxidi_tag"))
					);
					const result = player.chooseToGuanxing(num).set("prompt", "羲笛：点击或拖动将牌移动到牌堆顶或牌堆底").forResult();
					if (!result.bool || !result.moved[0].length) {
						player.addTempSkill("guanxing_fail");
					}
				},
				ai: {
					guanxing: true,
					skillTagFilter(player, tag, arg) {
						if (tag === "guanxing") {
							return true;
						}
					},
				},
			},
		},
	},
	dcchengyan: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (event.card.name != "sha" && get.type(event.card) != "trick") {
				return false;
			}
			if (!event.isFirstTarget) {
				return false;
			}
			return event.target != player;
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = trigger.target;
			const cards = (await player.draw().forResult()).cards;
			if (get.itemtype(cards) != "cards") {
				return;
			}
			await player.showCards(cards, get.translation(player) + "发动了【乘烟】");
			const card = cards[0];
			if (card.name == "sha" || (get.type(card, false) == "trick" && get.info(card, false).filterTarget)) {
				player.addTempSkill("dcchengyan_effect");
				player.markAuto("dcchengyan_effect", [[trigger.card, card, target]]);
			} else {
				await player.draw().set("gaintag", ["dcxidi_tag"]);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { player: "useCardToBegin" },
				filter(event, player) {
					const storage = player.getStorage("dcchengyan_effect");
					return storage.some(list => list[0] == event.card && list[2] == event.target);
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					const list = player.getStorage("dcchengyan_effect").find(list => list[0] == trigger.card && list[2] == trigger.target);
					trigger.setContent(lib.card[list[1].name].content);
				},
			},
		},
	},
	//乐邹氏
	dcyunzheng: {
		audio: 2,
		init() {
			game.addGlobalSkill("dcyunzheng_global");
		},
		onremove() {
			if (!game.hasPlayer(i => i.hasSkill("dcyunzheng", null, null, false), true)) {
				game.removeGlobalSkill("dcyunzheng_global");
			}
		},
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		content() {
			const cards = player.getCards("h");
			player.addGaintag(cards, "eternal_dcyunzheng_tag");
		},
		mod: {
			ignoredHandcard(card) {
				if (card.hasGaintag("eternal_dcyunzheng_tag")) {
					return true;
				}
			},
			cardDiscardable(card, _, name) {
				if (name == "phaseDiscard" && card.hasGaintag("eternal_dcyunzheng_tag")) {
					return false;
				}
			},
		},
		group: "dcyunzheng_fengyin",
		subSkill: {
			fengyin: {
				audio: "dcyunzheng",
				trigger: {
					global: ["phaseBefore", "loseAfter", "loseAsyncAfter", "gainAfter", "equipAfter", "addJudgeAfter", "addToExpansionAfter"],
					player: ["dchuoxin_update", "enterGame"],
				},
				filter(event, player) {
					if (
						["lose", "loseAsync", "equip", "addJudge", "addToExpansion"].includes(event.name) &&
						!game.hasPlayer(target => {
							const evt = event.getl(target);
							return evt && (evt.hs || []).length;
						})
					) {
						return false;
					}
					return game.hasPlayer(target => {
						if (player === target) {
							return false;
						}
						return target.hasCard(card => card.hasGaintag("eternal_dcyunzheng_tag"), "h") == !target.hasSkill("dcyunzheng_block");
					});
				},
				logTarget(event, player) {
					return game
						.filterPlayer(target => {
							if (player === target) {
								return false;
							}
							return target.hasCard(card => card.hasGaintag("eternal_dcyunzheng_tag"), "h") == !target.hasSkill("dcyunzheng_block");
						})
						.sortBySeat();
				},
				forced: true,
				content() {
					const targets = game
						.filterPlayer(target => {
							if (player === target) {
								return false;
							}
							return target.hasCard(card => card.hasGaintag("eternal_dcyunzheng_tag"), "h") == !target.hasSkill("dcyunzheng_block");
						})
						.sortBySeat();
					for (const target of targets) {
						target[target.hasSkill("dcyunzheng_block") ? "removeSkill" : "addSkill"]("dcyunzheng_block");
					}
				},
			},
			global: {
				mod: {
					aiValue(player, card, num) {
						if (num <= 0 || get.itemtype(card) !== "card" || !card.hasGaintag("eternal_dcyunzheng_tag")) {
							return;
						}
						if (player.hasSkill("dcyunzheng")) {
							return num * 1.2;
						}
						return num / 10;
					},
					aiUseful(player, card, num) {
						if (num <= 0 || get.itemtype(card) !== "card" || !card.hasGaintag("eternal_dcyunzheng_tag")) {
							return;
						}
						if (player.hasSkill("dcyunzheng")) {
							return num * 1.2;
						}
						return num / 10;
					},
					aiOrder(player, card, num) {
						if (num <= 0 || get.itemtype(card) !== "card" || !card.hasGaintag("eternal_dcyunzheng_tag")) {
							return;
						}
						if (player.hasSkill("dcyunzheng")) {
							return num * 0.8;
						}
						return num * 10;
					},
				},
				trigger: {
					player: "dieAfter",
				},
				filter(event, player) {
					return !game.hasPlayer(cur => cur.hasSkill("dcyunzheng", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				content() {
					game.removeGlobalSkill("dcyunzheng_gloabl");
					game.countPlayer(cur => cur.removeSkill("dcyunzheng_block"));
				},
			},
			block: {
				inherit: "fengyin",
			},
		},
	},
	dchuoxin: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			return (
				get.type(event.card) !== "equip" &&
				game.hasPlayer(current => {
					return player !== current && current.countCards("h");
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player !== target && target.countCards("h");
				})
				.set("ai", target => {
					let att = get.attitude(get.player(), target);
					if (att > 0) {
						return 0;
					}
					if (!target.hasSkill("dcyunzheng_block")) {
						att *=
							target.getSkills(null, false, false).filter(i => {
								return lib.skill.dcyunzheng_block.skillBlocker(i, target);
							}).length + 1;
					}
					return 1 - att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player.choosePlayerCard("h", target, true, "惑心：展示" + get.translation(target) + "的一张手牌").forResult();
			if (result.bool) {
				let cards = result.cards.slice();
				await player.showCards(cards, get.translation(player) + "发动了【惑心】");
				const cardx = cards.filter(card => card.hasGaintag("eternal_dcyunzheng_tag") || get.suit(card) == get.suit(trigger.card));
				if (cardx.length) {
					cards.removeArray(cardx);
					const result2 = await player
						.chooseBool("惑心：是否获得" + get.translation(cardx) + "？")
						.set("choice", get.value(cardx, player) > 7)
						.forResult();
					if (result2.bool) {
						const next = player.gain(cardx, target, "give");
						if (cardx[0].hasGaintag("eternal_dcyunzheng_tag")) {
							next.gaintag.add("eternal_dcyunzheng_tag");
						}
						await next;
						await event.trigger("dchuoxin_update");
					}
				}
				if (cards.some(card => !card.hasGaintag("eternal_dcyunzheng_tag"))) {
					target.addGaintag(
						cards.filter(card => !card.hasGaintag("eternal_dcyunzheng_tag")),
						"eternal_dcyunzheng_tag"
					);
					await event.trigger("dchuoxin_update");
				}
			}
		},
	},
	//乐祢衡
	dcjigu: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const cards = player.getCards("h");
			player.addGaintag(cards, "dcjigu");
		},
		mod: {
			ignoredHandcard(card) {
				if (card.hasGaintag("dcjigu")) {
					return true;
				}
			},
			cardDiscardable(card, _, name) {
				if (name == "phaseDiscard" && card.hasGaintag("dcjigu")) {
					return false;
				}
			},
		},
		group: "dcjigu_temp",
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			temp: {
				audio: "dcjigu",
				trigger: {
					player: "damageEnd",
					source: "damageSource",
				},
				filter(event, player) {
					return player.countCards("e") == player.countCards("h", card => card.hasGaintag("dcjigu"));
				},
				forced: true,
				prompt2(event, player) {
					return (
						"摸" +
						get.cnNumber(
							Array.from({ length: 5 })
								.map((_, i) => i + 1)
								.reduce((sum, i) => sum + player.countEmptySlot(i), 0)
						) +
						"张牌"
					);
				},
				async content(event, trigger, player) {
					player.addTempSkill("dcjigu_used", { global: "roundStart" });
					player.addMark("dcjigu_used");
					await player.draw(
						Array.from({ length: 5 })
							.map((_, i) => i + 1)
							.reduce((sum, i) => sum + player.countEmptySlot(i), 0)
					);
					let num1 = player.countMark("dcjigu_used");
					let num2 = game.countPlayer2(current => {
						return current.actionHistory.some(i => i.isMe && !i.isSkipped);
					});
					if (num1 >= num2) {
						player.tempBanSkill(event.name, "roundStart");
					}
				},
			},
		},
	},
	dcsirui: {
		audio: 2,
		mod: {
			targetInRange(card) {
				if (card.storage && card.storage.dcsirui) {
					return true;
				}
			},
			cardUsable(card, player, num) {
				if (card.storage && card.storage.dcsirui) {
					return Infinity;
				}
			},
		},
		enable: "phaseUse",
		filter(event, player) {
			if (!player.countCards("hes")) {
				return false;
			}
			return get
				.inpileVCardList(info => {
					const name = info[2];
					if (get.type(name) != "basic" && get.type(name) != "trick") {
						return false;
					}
					return true;
				})
				.some(card =>
					player.hasCard(
						cardx =>
							get.cardNameLength(cardx) == get.cardNameLength(card[2]) &&
							player.hasUseTarget(
								get.autoViewAs({ name: card[2], nature: card[3], storage: { dcsirui: true } }, [cardx]),
								false,
								false
							),
						"hes"
					)
				);
		},
		usable: 1,
		locked: false,
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => {
						const name = info[2];
						if (get.type(name) != "basic" && get.type(name) != "trick") {
							return false;
						}
						return true;
					})
					.filter(card =>
						player.hasCard(
							cardx =>
								get.cardNameLength(cardx) == get.cardNameLength(card[2]) &&
								player.hasUseTarget(
									get.autoViewAs({ name: card[2], nature: card[3], storage: { dcsirui: true } }, [cardx]),
									false,
									false
								),
							"hes"
						)
					);
				return ui.create.dialog("思锐", [list, "vcard"]);
			},
			check(button) {
				return get.event().player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
					storage: { dcsirui: true },
				});
			},
			backup(links, player) {
				return {
					audio: "dcsirui",
					filterCard(card, player) {
						return get.cardNameLength(card) == get.cardNameLength(lib.skill.dcsirui_backup.viewAs.name);
					},
					popname: true,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						storage: { dcsirui: true },
					},
					check(card) {
						return 7 - get.value(card);
					},
					position: "hes",
					precontent() {
						event.getParent().addCount = false;
					},
				};
			},
			prompt(links, player) {
				return (
					"将一张字数为" +
					get.cardNameLength(links[0][2]) +
					"的牌当作" +
					get.translation(links[0][3] || "") +
					"【" +
					get.translation(links[0][2]) +
					"】使用"
				);
			},
		},
		ai: {
			order(item, player) {
				let list = get
					.inpileVCardList(info => {
						const name = info[2];
						if (get.type(name) != "basic" && get.type(name) != "trick") {
							return false;
						}
						return true;
					})
					.filter(card =>
						player.hasCard(
							cardx =>
								get.cardNameLength(cardx) == get.cardNameLength(card[2]) &&
								player.hasUseTarget(get.autoViewAs({ name: card[2], nature: card[3] }, [cardx]), false, false),
							"hes"
						)
					)
					.map(card => {
						return { name: card[2], nature: card[3] };
					})
					.filter(card => player.getUseValue(card, true, true) > 0);
				if (!list.length) {
					return 0;
				}
				list.sort((a, b) => (player.getUseValue(b, true, true) || 0) - (player.getUseValue(a, true, true) || 0));
				return get.order(list[0], player) * 0.99;
			},
			result: { player: 1 },
		},
		subSkill: {
			backup: { audio: "dcsirui" },
		},
	},
	//李丰
	dctunchu: {
		audio: 2,
		trigger: { global: "gameDrawBegin" },
		forced: true,
		content() {
			const me = player,
				numx = trigger.num;
			const sum = game.players.slice().concat(game.dead).length * 4;
			trigger.num = function (player) {
				return player == me ? sum : typeof numx == "function" ? numx(player) : numx;
			};
		},
		/* trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			const sum = game.players.slice().concat(game.dead).length * 4;
			return player.countCards("h") < sum && (event.name != "phase" || game.phaseNumber == 0);
		},
		forced: true,
		content() {
			player.drawTo(game.players.slice().concat(game.dead).length * 4);
		}, */
		mod: {
			cardDiscardable(card, player) {
				if (get.position(card) == "h") {
					return false;
				}
			},
			canBeDiscarded(card, player) {
				if (get.position(card) == "h") {
					return false;
				}
			},
			aiOrder(player, card, num) {
				if (num > 0 && get.name(card, player) == "huogong") {
					return 0;
				}
			},
			aiValue(player, card, num) {
				if (num > 0 && get.name(card, player) == "huogong") {
					return 0.01;
				}
			},
			aiUseful(player, card, num) {
				if (num > 0 && get.name(card, player) == "huogong") {
					return 0;
				}
			},
		},
		group: "dctunchu_limit",
		subSkill: {
			limit: {
				audio: "dctunchu",
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return player.countCards("h") > player.getHp();
				},
				forced: true,
				content() {
					player.addTempSkill("dctunchu_debuff");
					player.addMark("dctunchu_debuff", 3, false);
				},
			},
			debuff: {
				mark: true,
				intro: {
					markcount(storage) {
						return (storage || 0).toString();
					},
					content(storage) {
						return "还可使用" + (storage || 0).toString() + "张牌";
					},
				},
				charlotte: true,
				onremove: true,
				trigger: { player: "useCard0" },
				filter(event, player) {
					return player.hasMark("dctunchu_debuff");
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player.removeMark("dctunchu_debuff", 1, false);
				},
				mod: {
					cardEnabled(card, player) {
						if (player.hasMark("dctunchu_debuff")) {
							return;
						}
						if (get.itemtype(card) == "card" && get.position(card) == "h") {
							return false;
						}
						if (card.cards && (card.cards || []).some(i => get.position(i) == "h")) {
							return false;
						}
					},
					cardSavable() {
						return lib.skill.dctunchu.subSkill.debuff.mod.cardEnabled.apply(this, arguments);
					},
				},
			},
		},
	},
	dcshuliang: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return player.countCards("he") && game.hasPlayer(target => !target.countCards("h"));
		},
		async cost(event, trigger, player) {
			const num = Math.min(
				player.countCards("he"),
				game.countPlayer(target => !target.countCards("h"))
			);
			let list = [];
			while (num - list.length > 0) {
				const { bool, targets, cards } = await player
					.chooseCardTarget({
						prompt: list.length ? "是否继续发动【输粮】？" : get.prompt(event.skill),
						prompt2: lib.translate.dcshuliang_info,
						position: "he",
						animate: false,
						filterCard(card, player) {
							return !get.event().list.some(list => list[1] == card);
						},
						filterTarget(card, player, target) {
							return !target.countCards("h") && !get.event().list.some(list => list[0] == target);
						},
						ai1(card) {
							if (card.name == "du") {
								return 200;
							}
							let info = get.info(card);
							if (info && info.toself) {
								return 10;
							}
							return get.unuseful(card);
						},
						ai2(target) {
							const player = get.event().player,
								att = get.attitude(player, target);
							if (
								player.hasCard(card => {
									return card.name == "du" && !get.event().list.some(list => list[1] == card);
								}, "h") &&
								!target.countCards("h") &&
								!get.event().list.some(list => list[0] == target) &&
								!target.hasSkillTag("nodu")
							) {
								return -200 * att;
							}
							return att;
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
			event.result = {
				bool: Boolean(list.length),
				targets: list.slice().map(list => list[0]),
				cards: list.slice().flatMap(list => list[1]),
				cost_data: list,
			};
		},
		async content(event, trigger, player) {
			const list = event.cost_data;
			await game
				.loseAsync({
					gain_list: list,
					player: player,
					cards: event.cards,
					giver: player,
					animate: "giveAuto",
				})
				.setContent("gaincardMultiple");
			for (let i = 0; i < list.length; i++) {
				const target = event.targets[i],
					card = event.cards[i];
				if (get.owner(card) == target && get.position(card) == "h" && target.canUse(card, target)) {
					await target.chooseUseTarget(card);
				}
			}
		},
	},
	//吴普
	dcduanti: {
		audio: 2,
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		forced: true,
		filter(event, player) {
			return event._copdcduanti;
		},
		onremove: ["dcduanti", "dcduanti_counter"],
		group: "dcduanti_counter",
		async content(event, trigger, player) {
			await player.recover();
			if (player.countMark("dcduanti") >= 5) {
				return;
			}
			player.addMark("dcduanti", 1, false);
			await player.gainMaxHp();
		},
		subSkill: {
			counter: {
				trigger: {
					player: ["useCard1", "respond"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					if (!player.countMark("dcduanti_counter")) {
						const num = game.getAllGlobalHistory("everything", evt => {
							return evt.player === player && ["useCard", "respond"].includes(evt.name) && evt !== trigger;
						}).length;
						if (num) {
							player.addMark("dcduanti_counter", num, false);
						}
					}
					player.addMark("dcduanti_counter", 1, false);
					if (player.countMark("dcduanti_counter") % 5 === 0) {
						trigger._copdcduanti = true;
					}
					player.markSkill("dcduanti");
				},
			},
		},
		intro: {
			markcount(storage, player) {
				return player.countMark("dcduanti_counter");
			},
			content(storage, player) {
				return `<li>已使用过${get.cnNumber(player.countMark("dcduanti_counter"))}张牌<br><li>已以此法增加${player.countMark("dcduanti")}点体力上限`;
			},
		},
	},
	dcshicao: {
		audio: 2,
		enable: "phaseUse",
		onremove: ["dcshicao_aiRecord"],
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog(
					"###识草###选择一种类型与要摸牌的来源",
					[["caoying_basic", "caoying_trick", "caoying_equip"], "vcard"],
					[["牌堆顶", "牌堆底"], "tdnodes"]
				);
			},
			check(button) {
				const player = get.player();
				const bottom = player.storage.dcshicao_bottom,
					aiStorage = player.getStorage("dcshicao_aiRecord");
				if (
					bottom &&
					aiStorage.length > 0 &&
					ui.cardPile.lastChild &&
					get.name(ui.cardPile.lastChild, false) === get.name(aiStorage.lastItem, false)
				) {
					if (button.link === "牌堆底" || button.link[2].slice(8) === get.type2(aiStorage.lastItem, false)) {
						return 20;
					}
				}
				if (button.link === "牌堆顶" || button.link[2].slice(8) === "basic") {
					return 10;
				}
				return 5 + Math.random();
			},
			filter(button, player) {
				if (!ui.selected.buttons.length) {
					return true;
				}
				return ui.selected.buttons[0].parentNode != button.parentNode;
			},
			select: 2,
			backup(links, player) {
				if (links[0].includes("牌堆")) {
					links.reverse();
				}
				return {
					audio: "dcshicao",
					type: links[0][2].slice(8),
					pos: links[1],
					filterCard: () => false,
					selectCard: -1,
					async content(event, trigger, player) {
						let { type, pos } = lib.skill.dcshicao_backup;
						game.log(player, "声明了", `#y${get.translation(type)}牌`);
						const next = player.draw();
						const bottom = pos === "牌堆底";
						if (bottom) {
							next.set("bottom", true);
							if (player.getStorage("dcshicao_aiRecord").length > 0) {
								player.storage.dcshicao_aiRecord.pop();
							}
						}
						const drawnCards = (await next.forResult()).cards;
						if (get.type2(drawnCards[0], player) === type) {
							return;
						}
						let cards;
						if (!bottom) {
							cards = get.bottomCards(2);
							cards.reverse();
						} else {
							cards = get.cards(2);
						}
						await game.cardsGotoOrdering(cards);
						await player.viewCards(`${bottom ? "牌堆顶" : "牌堆底"}的两张牌(靠左的在牌堆更靠上)`, cards);
						player.storage.dcshicao_record = cards.slice();
						player.storage.dcshicao_aiRecord = cards.slice();
						player.storage.dcshicao_bottom = !bottom;
						const skill = "dcshicao";
						player.localMarkSkill(skill, player, event);
						if (bottom) {
							cards.reverse();
						}
						await game.cardsGotoPile(cards, bottom ? "insert" : null);
						player.tempBanSkill(skill);
					},
					ai: {
						result: { player: 1 },
					},
				};
			},
			prompt(links, player) {
				return `点击“确定”，从${links[1]}摸一张牌`;
			},
		},
		intro: {
			mark(dialog, content, player) {
				var cards = player.getStorage("dcshicao_record");
				if (cards && cards.length) {
					if (player.isUnderControl(true)) {
						dialog.addText(`上一次观看的${player.storage.dcshicao_bottom ? "牌堆底" : "牌堆顶"}的牌：`);
						dialog.addAuto(cards);
						dialog.addText("（牌堆顶——牌堆底）");
					} else {
						return "不给看";
					}
				}
			},
		},
		subSkill: {
			backup: {},
		},
		ai: {
			order: 8,
			result: {
				player: 1,
			},
		},
	},
	//新杀曹爽
	dcjianzhuan: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			const evtx = event.getParent("phaseUse");
			return (
				player.isPhaseUsing() &&
				player.getHistory("useSkill", evt => {
					return evt.skill == "dcjianzhuan" && evt.event.getParent("phaseUse") == evtx;
				}).length <
					4 - player.getStorage("dcjianzhuan").length
			);
		},
		forced: true,
		derivation: "dcjianzhuan_faq",
		async content(event, trigger, player) {
			const evtx = event.getParent("phaseUse"),
				num = player.getHistory("useSkill", evt => {
					return evt.skill == "dcjianzhuan" && evt.event.getParent("phaseUse") == evtx;
				}).length,
				info = get.info("dcjianzhuan").choices;
			let choices = [],
				choiceList = [],
				map = {};
			for (const i in info) {
				map[info[i].intro] = i;
				if (player.getStorage("dcjianzhuan").includes(i) || player.getStorage("dcjianzhuan_used").includes(i)) {
					continue;
				}
				choices.push(info[i].intro);
				choiceList.push(info[i].introx(num));
			}
			const { control } = await player
				.chooseControl(choices)
				.set("choiceList", choiceList)
				.set("ai", () => {
					const player = get.event().player,
						num = get.event().num,
						info = get.info("dcjianzhuan").choices;
					let choices = get.event().controls.slice(),
						map = get.event().map;
					return choices.sort((a, b) => info[map[b]].ai_effect(player, num) - info[map[a]].ai_effect(player, num))[0];
				})
				.set("num", num)
				.set("map", map)
				.set("prompt", "渐专：请选择一项执行")
				.forResult();
			if (control) {
				if (!player.storage.dcjianzhuan_used) {
					player.when("phaseUseAfter").step(async () => delete player.storage.dcjianzhuan_used);
				}
				player.markAuto("dcjianzhuan_used", [map[control]]);
				await info[map[control]].content(player, num);
			}
		},
		choices: {
			discard_target: {
				intro: "拆牌",
				introx: num => "令一名角色弃置" + num + "张牌",
				weight: 1,
				ai_effect(player, num) {
					return game.hasPlayer(target => {
						return get.effect(target, { name: "guohe_copy2" }, player, player) > 0;
					})
						? 2 + num
						: 0;
				},
				async content(player, num = 1) {
					const { bool, targets } = await player
						.chooseTarget("令一名角色弃置" + num + "张牌", true)
						.set("ai", target => {
							return (
								get.effect(target, { name: "guohe_copy2" }, get.event().player, get.event().player) *
								Math.sqrt(Math.min(get.event().num, target.countDiscardableCards(target, "he")))
							);
						})
						.set("num", num)
						.forResult();
					if (bool) {
						const target = targets[0];
						player.line(target);
						await target.chooseToDiscard(num, "he", true);
					}
				},
			},
			draw_self: {
				intro: "摸牌",
				introx: num => "摸" + num + "张牌",
				weight: 1,
				ai_effect(player, num) {
					return 3;
				},
				async content(player, num = 1) {
					await player.draw(num);
				},
			},
			recast_self: {
				intro: "重铸",
				introx: num => "重铸" + num + "张牌",
				weight: 1,
				ai_effect(player, num) {
					return 1;
				},
				async content(player, num = 1) {
					if (!player.hasCard(lib.filter.cardRecastable, "he")) {
						return;
					}
					const { bool, cards } = await player
						.chooseCard("重铸" + num + "张牌", "he", num, lib.filter.cardRecastable, true)
						.set("ai", lib.skill.zhiheng.check)
						.forResult();
					if (bool) {
						await player.recast(cards);
					}
				},
			},
			discard_self: {
				intro: "弃牌",
				introx: num => "弃置" + num + "张牌",
				weight: "90%",
				ai_effect(player, num) {
					let cards = player.getCards("hs");
					cards.sort((a, b) => get.value(b) - get.value(a));
					cards = cards.slice(0, -Math.min(num, cards.length));
					return cards.some(card => player.hasValueTarget(card, true, true)) ? 4 : -4;
				},
				async content(player, num = 1) {
					await player.chooseToDiscard(num, "he", true);
				},
			},
		},
		group: "dcjianzhuan_remove",
		subSkill: {
			remove: {
				audio: "dcjianzhuan",
				trigger: { player: "phaseUseEnd" },
				filter(event, player) {
					if (player.getStorage("dcjianzhuan").length >= 4) {
						return false;
					}
					return player.getStorage("dcjianzhuan_used").length >= 4 - player.getStorage("dcjianzhuan").length;
				},
				forced: true,
				async content(event, trigger, player) {
					const info = get.info("dcjianzhuan").choices;
					let map = {};
					let unfixedWeightTotal = 0,
						remainedWeight = 100;
					let entries = [];
					for (const i in info) {
						const infox = info[i];
						map[infox.intro] = i;
						if (player.getStorage("dcjianzhuan").includes(i)) {
							continue;
						}
						let weight = (infox.weight || 1).toString();
						if (weight.endsWith("%")) {
							weight = Math.min(remainedWeight, parseInt(weight.slice(0, -1)));
							entries.push([infox.intro, weight]);
							remainedWeight -= weight;
						} else {
							weight = parseInt(weight);
							unfixedWeightTotal += weight;
							entries.push([infox.intro, -weight]);
						}
					}
					entries = entries.map(entry => {
						let weight = entry[1];
						if (weight < 0) {
							weight = (-remainedWeight / unfixedWeightTotal) * weight;
						}
						return [entry[0], weight];
					});
					let rand = Math.random() * 100;
					let removeChoice = entries.find(entry => {
						rand -= entry[1];
						return rand < 0;
					})[0];
					if (get.isLuckyStar(player) && Object.keys(entries).includes("弃牌")) {
						removeChoice = "弃牌";
					}
					player.markAuto("dcjianzhuan", [map[removeChoice]]);
					player.popup(removeChoice);
					game.log(player, "移去了", "#g" + removeChoice, "项");
				},
			},
		},
		mark: true,
		intro: {
			markcount(storage) {
				return 4 - (storage || []).length;
			},
			content(storage) {
				if (!(storage || []).length) {
					return "暂未移去任何项";
				}
				const info = get.info("dcjianzhuan").choices;
				let str = "";
				for (const i of storage) {
					str += info[i].intro;
					str += "、";
				}
				str = str.slice(0, -1);
				return "已移去" + str + "项";
			},
		},
	},
	dcfanshi: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return 4 - player.getStorage("dcjianzhuan").length < 2;
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const info = get.info("dcjianzhuan").choices;
			let choices = [];
			for (const i in info) {
				if (!player.getStorage("dcjianzhuan").includes(i)) {
					choices.push(i);
				}
			}
			if (choices.length) {
				for (const choice of choices) {
					for (let i = 1; i <= 3; i++) {
						await info[choice].content(player, 1);
					}
				}
			}
			await player.gainMaxHp(2);
			await player.recover(2);
			await player.changeSkills(["dcfudou"], ["dcjianzhuan"]);
		},
		derivation: "dcfudou",
		ai: { combo: "dcjianzhuan" },
	},
	dcfudou: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (event.targets.length != 1 || event.target == player) {
				return false;
			}
			const color = get.color(event.card);
			if (!["black", "red"].includes(color)) {
				return false;
			}
			const damage = event.target.getAllHistory("sourceDamage", evt => evt.player == player).length;
			return Math.min(1, damage) == (color == "black");
		},
		check(event, player) {
			const color = get.color(event.card);
			if (color == "red") {
				return get.attitude(player, event.target) > 0;
			}
			if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) {
				return false;
			}
			return get.effect(player, { name: "losehp" }, player, player) >= get.effect(event.target, { name: "losehp" }, player, player);
		},
		prompt2(event, player) {
			return "与" + get.translation(event.target) + "各" + (get.color(event.card) == "black" ? "失去1点体力" : "摸一张牌");
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const color = get.color(trigger.card),
				target = trigger.target;
			if (color == "red") {
				await player.draw("nodelay");
				await target.draw();
			} else {
				await player.loseHp();
				await target.loseHp();
			}
		},
	},
	//司马师
	dcsanshi: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		group: ["dcsanshi_gain", "dcsanshi_directHit"],
		async content(event, trigger, player) {
			const recordedNumbers = [];
			let num = get.rand(0, ui.cardPile.childNodes.length - 1);
			for (let i = 0; i < ui.cardPile.childNodes.length; i++) {
				let j = i + num;
				if (j >= ui.cardPile.childNodes.length) {
					j -= ui.cardPile.childNodes.length;
				}
				const card = ui.cardPile.childNodes[j],
					number = get.number(card, false);
				if (!recordedNumbers.includes(number)) {
					recordedNumbers.add(number);
					card.storage.dcsanshi = true;
					num = get.rand(0, ui.cardPile.childNodes.length - 1);
				}
			}
			player.addSkill("dcsanshi_mark");
		},
		subSkill: {
			gain: {
				audio: "dcsanshi",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return game.hasGlobalHistory("cardMove", evt => {
						if (evt.name == "lose") {
							if (evt.position !== ui.discardPile) {
								return false;
							}
						} else if (evt.name !== "cardsDiscard") {
							return false;
						}
						if (lib.skill.dcsanshi_gain.notUseOrRespond(evt, player)) {
							return evt.cards.some(card => {
								return card.storage.dcsanshi && get.position(card) === "d";
							});
						}
						return false;
					});
				},
				forced: true,
				notUseOrRespond(event, player) {
					if (event.name !== "cardsDiscard") {
						return true;
					}
					const evtx = event.getParent();
					if (evtx.name !== "orderingDiscard") {
						return true;
					}
					const evt2 = evtx.relatedEvent || evtx.getParent();
					return !["useCard", "respond"].includes(evt2.name) || evt2.player !== player;
				},
				async content(event, trigger, player) {
					const cards = [];
					game.checkGlobalHistory("cardMove", evt => {
						if (evt.name == "lose") {
							if (evt.position !== ui.discardPile) {
								return false;
							}
						} else if (evt.name !== "cardsDiscard") {
							return false;
						}
						if (lib.skill.dcsanshi_gain.notUseOrRespond(evt, player)) {
							cards.addArray(
								evt.cards.filter(card => {
									return card.storage.dcsanshi && get.position(card) === "d";
								})
							);
						}
					});
					if (cards.length) {
						player.gain(cards, "gain2");
					}
				},
			},
			directHit: {
				audio: "dcsanshi",
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					return (
						event.cards &&
						event.cards.some(card => {
							return card.storage.dcsanshi;
						})
					);
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.filterPlayer());
					game.log(trigger.card, "不可被响应");
				},
			},
			mark: {
				trigger: {
					player: "gainEnd",
					global: "loseAsyncEnd",
				},
				forced: true,
				popup: false,
				silent: true,
				lastDo: true,
				filter(event, player) {
					if (!["dcsanshi", "dcchenlve"].every(skill => player.hasSkill(skill, null, false, false))) {
						return false;
					}
					const cards = event.getg(player);
					if (!cards.length) {
						return false;
					}
					return cards.some(card => card.storage.dcsanshi);
				},
				async content(event, trigger, player) {
					var cards = trigger.getg(player);
					if (cards.length) {
						cards = cards.filter(card => card.storage.dcsanshi);
						player.addGaintag(cards, "dcsanshi_tag");
					}
				},
			},
		},
		ai: {
			threaten: 3,
		},
	},
	dczhenrao: {
		audio: 2,
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (
				(() => {
					if (event.player === player) {
						if (!event.isFirstTarget) {
							return false;
						}
						return event.targets.some(target => target !== player);
					}
					return event.target === player;
				})()
			) {
				return event.targets.concat(event.player).some(target => {
					return target.countCards("h") > player.countCards("h") && !player.getStorage("dczhenrao").includes(target);
				});
			}
			return false;
		},
		direct: true,
		async content(event, trigger, player) {
			const result = await player
				.chooseTarget(get.prompt("dczhenrao"), "对一名可选角色造成1点伤害", (card, player, target) => {
					return get.event().targets.includes(target) && !player.getStorage("dczhenrao").includes(target);
				})
				.set(
					"targets",
					trigger.targets.concat(trigger.player).filter(target => target.countCards("h") > player.countCards("h"))
				)
				.set("ai", target => {
					const player = get.player();
					return get.damageEffect(target, player, player);
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			const target = result.targets[0];
			player.logSkill("dczhenrao", target);
			if (!player.storage.dczhenrao) {
				player.when({ global: "phaseAfter" }).step(async () => player.unmarkSkill("dczhenrao"));
			}
			player.markAuto("dczhenrao", target);
			await target.damage();
			await game.delayx();
		},
		intro: {
			content: "已以此法对$造成过伤害",
			onunmark: true,
		},
		ai: {
			expose: 0.2,
			threaten: 3,
		},
	},
	dcchenlve: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		manualConfirm: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cards = ["cardPile", "discardPile"].map(pos => Array.from(ui[pos].childNodes)).flat();
			const sishiList = [];
			const isSishi = card => card.storage.dcsanshi;
			const lose_list = [],
				players = game.filterPlayer();
			players.forEach(current => {
				const pos = "ej" + (current !== player ? "h" : "");
				const sishis = current.getCards(pos, isSishi);
				if (sishis.length > 0) {
					current.$throw(sishis);
					lose_list.push([current, sishis]);
					sishiList.addArray(sishis);
				}
			});
			if (lose_list.length) {
				await game.loseAsync({ lose_list }).setContent("chooseToCompareLose");
				await game.delayx();
			}
			sishiList.addArray(cards.filter(isSishi));
			player.gain(sishiList, "gain2");
			player
				.when("phaseUseEnd")
				.filter(evt => evt === event.getParent("phaseUse"))
				.step(async () => {
					const lose_list = [],
						players = game.filterPlayer();
					players.forEach(current => {
						const cards = current.getCards("hej").filter(card => sishiList.includes(card));
						if (cards.length > 0) {
							current.$throw(cards, 1000);
							lose_list.push([current, cards]);
						}
					});
					if (lose_list.length) {
						await game.loseAsync({ lose_list }).setContent("chooseToCompareLose");
					}
					await game.cardsGotoSpecial(sishiList);
					game.log(sishiList, "被移出了游戏");
				});
			player
				.when("die")
				.assign({
					forceDie: true,
				})
				.step(async () => {
					await game.cardsDiscard(sishiList);
					game.log(sishiList, "被置入了弃牌堆");
				});
		},
		ai: {
			order: 0.5,
			result: {
				player(player) {
					if (player.getHp(true) > 1 && player.countCards("he") > 1) {
						return 0;
					}
					if (!player.isDamaged() && (player.countCards("h") > 1 || player.countCards("e") > 0)) {
						return 0;
					}
					return 13;
				},
			},
			combo: "dcsanshi",
		},
	},
	//王凌
	dcjichou: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			const evts = player.getHistory("useCard");
			const names = evts.map(evt => evt.card.name).unique();
			return evts.length > 0 && evts.length === names.length && evts.some(evt => evt.cards.some(card => get.position(card) === "d"));
		},
		async content(event, trigger, player) {
			const cards = [];
			player.checkHistory("useCard", evt => {
				cards.addArray(evt.cards.filterInD("d"));
			});
			const num = Math.min(cards.length, game.countPlayer());
			if (_status.connectMode) {
				game.broadcastAll(() => {
					_status.noclearcountdown = true;
				});
			}
			const { bool, links } = await player
				.chooseButton(
					[`集筹：将${num < cards.length ? "至多" + get.cnNumber(num) + "张牌" : "任意张牌"}交给等量角色`, cards],
					"allowChooseAll"
				)
				.set("selectButton", [1, num])
				.set("population", [
					game.countPlayer(current => get.attitude(player, current) > 0),
					game.countPlayer(current => get.attitude(player, current) < 0),
				])
				.set("ai", button => {
					const card = button.link,
						population = get.event().population;
					if (ui.selected.buttons.length > population[0] + population[1]) {
						return 0;
					}
					if (ui.selected.buttons.length > get.event().population[0]) {
						return 2 - get.value(card);
					}
					return 2 + get.value(card);
				})
				.forResult();
			if (bool) {
				const { bool, targets } = await player
					.chooseTarget(
						`集筹：请选择${get.cnNumber(links.length)}名角色`,
						`操作提示：请按照顺序选择要交给牌的目标，令这些角色按顺序获得这些牌：${get.translation(links)}`,
						true,
						links.length
					)
					.set(
						"values",
						links.map(i => get.value(i))
					)
					.set("ai", target => {
						const att = get.attitude(get.player(), target);
						const chosenNum = ui.selected.targets.length,
							values = get.event().values;
						if (values[chosenNum] > 0) {
							return att;
						}
						return 0.01 - att;
					})
					.forResult();
				if (_status.connectMode) {
					game.broadcastAll(() => {
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				if (bool) {
					const gain_list = [],
						givenCards = [];
					targets.forEach((target, i) => {
						player.line(target, "green");
						gain_list.push([target, links[i]]);
						givenCards.push(links[i]);
						game.log(player, "将", links[i], "交给了", target);
					});
					event.getParent().set("givenCards", givenCards);
					await game
						.loseAsync({
							gain_list,
							player: player,
							cards: givenCards,
							giver: player,
							animate: "gain2",
						})
						.setContent("gaincardMultiple");
					const toDraw = player.getAllHistory("useSkill", evt => {
						const evtx = evt.event;
						return evt.skill === "dcjichou" && evtx.givenCards && evtx.givenCards.length;
					})[0].event.givenCards.length;
					await game.delayx();
					await player.draw(toDraw);
				}
			}
			if (_status.connectMode) {
				game.broadcastAll(() => {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
		},
	},
	dcmouli: {
		audio: 2,
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			const names = [];
			player.checkAllHistory("useSkill", evt => {
				if (evt.skill !== "dcjichou") {
					return;
				}
				const evtx = evt.event;
				if (evtx.givenCards) {
					names.addArray(evtx.givenCards.map(card => get.name(card, false)));
				}
			});
			return names.length > 5;
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "water",
		derivation: ["dczifu"],
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp();
			await player.recover();
			await player.addSkills("dczifu");
		},
		ai: {
			combo: "dcjichou",
		},
	},
	dczifu: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		forced: true,
		async content(event, trigger, player) {
			const maxLimit = Math.min(5, player.maxHp);
			let count = player.countCards("h");
			if (count < maxLimit) {
				await player.draw(maxLimit - count);
			}
			if (!player.hasHistory("gain", evt => evt.getParent(2) === event)) {
				return;
			}
			count = player.countCards("h");
			const toKeepCount = player
				.getCards("h")
				.map(card => get.name(card))
				.unique().length;
			if (count > toKeepCount) {
				const { bool, cards } = await player
					.chooseCard("自缚：选择要保留的手牌", "选择不同牌名的手牌各一张，然后弃置其余手牌", toKeepCount)
					.set("filterCard", card => {
						if (!ui.selected.cards.length) {
							return true;
						}
						const name = get.name(card, player);
						if (ui.selected.cards.some(card => get.name(card, player) === name)) {
							return false;
						}
						return true;
					})
					.set("complexCard", true)
					.set("ai", get.value)
					.forResult();
				if (!bool) {
					return;
				}
				const toDiscard = player.getCards("h").removeArray(cards);
				if (toDiscard.length) {
					player.discard(toDiscard);
				}
			}
		},
		ai: {
			halfneg: true,
		},
	},
	//蒋济
	dcshiju: {
		audio: 2,
		global: "dcshiju_global",
		subSkill: {
			global: {
				audio: "dcshiju",
				forceaudio: true,
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					if (!player.countCards("he")) {
						return false;
					}
					return game.hasPlayer(current => current.hasSkill("dcshiju"));
				},
				filterTarget(card, player, target) {
					return target.hasSkill("dcshiju");
				},
				selectTarget() {
					const num = game.countPlayer(current => current.hasSkill("dcshiju"));
					return num > 1 ? 1 : -1;
				},
				filterCard: true,
				position: "he",
				check(card) {
					const player = get.player();
					if (get.type(card) === "equip") {
						const subtype = get.subtype(card);
						let valueFix = 0;
						if (
							game.hasPlayer(current => {
								if (!current.hasSkill("dcshiju")) {
									return false;
								}
								if (current.hasUseTarget(card) && !player.countEmptySlot(subtype)) {
									return true;
								}
							})
						) {
							valueFix += 5;
						}
						if (player.countCards("he", { subtype }) > 1) {
							return valueFix + 12 - get.equipValue(card);
						}
						return valueFix + 6 - get.value(card);
					}
					return 4 - get.value(card);
				},
				prompt() {
					const list = game.filterPlayer(current => {
						return current.hasSkill("dcshiju");
					});
					return `将一张牌交给${get.translation(list)}${list.length > 1 ? "中的一人" : ""}，若此牌为装备牌，其可以使用之，且你本回合的攻击范围+X（X为其装备区的牌数）。若其以此法替换了装备，你与其各摸两张牌。`;
				},
				discard: false,
				lose: false,
				log: false,
				prepare(cards, player, targets) {
					targets[0].logSkill("dcshiju");
				},
				async content(event, trigger, player) {
					const card = event.cards[0],
						target = event.target;
					if (target != player) {
						await player.give(card, target);
					} else {
						await player.showCards(card, get.translation(player) + "发动了【势举】");
					}
					if (!target.getCards("h").includes(card) || get.type(card) !== "equip") {
						return;
					}
					const { bool } = await target
						.chooseUseTarget(card)
						.set("ai", (event, player) => {
							const { giver } = event;
							return get.attitude(player, giver) >= 0;
						})
						.set("giver", player)
						.forResult();
					if (!bool) {
						return;
					}
					const count = target.countCards("e");
					if (count > 0) {
						player.addTempSkill("dcshiju_range");
						player.addMark("dcshiju_range", count, false);
						if (
							target.hasHistory("lose", evt => {
								return evt.getParent().name === "equip" && evt.getParent(5) === event && evt.es && evt.es.length > 0;
							})
						) {
							for (const current of [player, target]) {
								await current.draw(2);
							}
						}
					}
				},
				ai: {
					order: 10,
					result: {
						target(player, target) {
							const card = ui.selected.cards[0];
							if (!card) {
								return;
							}
							if (target.hasSkillTag("nogain") && get.type(card) != "equip") {
								return 0;
							}
							if (card.name == "du" && target.hasSkillTag("nodu")) {
								return 0;
							}
							if (get.value(card) < 0) {
								return -5;
							}
							const nh = target.countCards("h");
							return Math.max(1, 5 - nh);
						},
					},
				},
			},
			range: {
				charlotte: true,
				onremove: true,
				mod: {
					attackRange(player, num) {
						return num + player.countMark("dcshiju_range");
					},
				},
				intro: { content: "本回合攻击范围+#" },
			},
		},
	},
	dcyingshi: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget) {
				return false;
			}
			if (event.card.storage && event.card.storage.dcyingshi) {
				return false;
			}
			return get.type(event.card) === "trick";
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget()
				.set("prompt", get.prompt2(event.skill))
				.set("filterTarget", (card, player, target) => {
					return get.event().getTrigger().targets.includes(target);
				})
				.set("ai", target => {
					const player = get.player(),
						trigger = get.event().getTrigger();
					const num = player.countCards("e");
					const effect = get.effect(target, trigger.card, player, player);
					if (!num) {
						return effect;
					}
					return Math.max(effect, get.effect(target, { name: "guohe_copy2" }, target, player) * num);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				count = player.countCards("e");
			let bool;
			if (count > 0) {
				const prompt = `###${get.translation(player)}对你发动了【应时】###弃置${get.cnNumber(count)}张牌，令其本回合不能再发动〖应时〗，或令其于此牌结算后视为对你使用一张同名牌"`;
				bool = (
					await target
						.chooseToDiscard(prompt, count, "he")
						.set("ai", card => {
							if (get.event().goon) {
								return 15 - get.value(card);
							}
							return 0;
						})
						.set("goon", !get.tag(trigger.card, "norepeat") && get.effect(target, trigger.card, trigger.player, target) < 0)
						.forResult()
				).bool;
			} else {
				bool = false;
			}
			if (bool) {
				player.tempBanSkill("dcyingshi");
			} else {
				const cardx = {
					name: trigger.card.name,
					nature: trigger.card.nature,
					isCard: true,
					storage: { dcyingshi: true },
				};
				player
					.when({ global: "useCardAfter" })
					.filter(evt => evt === trigger.getParent())
					.step(async (event, trigger, player) => {
						const next = player.useCard(get.copy(cardx), target, false);
						if (trigger.addedTarget) {
							next.addedTarget = trigger.addedTarget;
						}
						if (trigger.addedTargets && trigger.addedTargets.length) {
							next.addedTargets = trigger.addedTargets.slice(0);
						}
					});
			}
		},
	},
	//公孙修
	dcgangu: {
		audio: 2,
		trigger: { global: "loseHpAfter" },
		filter(event, player) {
			return event.player !== player;
		},
		usable: 1,
		forced: true,
		async content(event, trigger, player) {
			await player.draw(3);
			await player.loseHp();
		},
		ai: {
			combo: "dckuizhen",
			halfneg: true,
		},
	},
	dckuizhen: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => {
				return lib.skill.dckuizhen.filterTarget(null, player, current);
			});
		},
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			return target.countCards("h") >= player.countCards("h") || target.getHp() >= player.getHp();
		},
		usable: 1,
		async content(event, trigger, player) {
			const { target } = event,
				juedou = new lib.element.VCard({ name: "juedou", isCard: true });
			if (target.canUse(juedou, player, false)) {
				await target.useCard(juedou, player, "noai");
			}
			if (
				player.hasHistory("damage", evt => {
					return evt.getParent(3) === event;
				})
			) {
				await player.viewHandcards(target);
				const shas = target.getGainableCards(player, "h").filter(card => get.name(card) === "sha");
				if (shas.length) {
					player.addSkill("dckuizhen_effect");
					const next = player.gain(shas, "give", target);
					next.gaintag.add("dckuizhen");
					await next;
				}
			} else {
				await target.loseHp();
			}
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) + 1;
			},
			result: {
				player(player, target) {
					let eff = get.effect(player, { name: "juedou" }, target, player),
						shas = target.mayHaveSha(player, "respond", null, "count") - player.mayHaveSha(player, "respond", null, "count");
					if (shas > 0) {
						eff += shas * get.effect(target, { name: "shunshou" }, player, player);
					}
					return eff;
				},
				target(player, target) {
					let eff = get.effect(player, { name: "juedou" }, target, target),
						shas = target.mayHaveSha(player, "respond", null, "count") - player.mayHaveSha(player, "respond", null, "count");
					if (shas < -1) {
						eff += get.effect(target, { name: "losehp" }, target, target);
					} else if (shas > 0) {
						eff += shas * get.effect(target, { name: "shunshou" }, player, target);
					}
					return eff;
				},
			},
		},
		subSkill: {
			effect: {
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				firstDo: true,
				charlotte: true,
				filter(event, player) {
					if (event.addCount === false) {
						return false;
					}
					return player.hasHistory("lose", evt => {
						const evtx = evt.relatedEvent || evt.getParent();
						if (evtx != event) {
							return false;
						}
						for (const i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("dckuizhen")) {
								return true;
							}
						}
						return false;
					});
				},
				async content(event, trigger, player) {
					trigger.addCount = false;
					var stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
				},
				mod: {
					cardUsable(card) {
						if (!card.cards) {
							return;
						}
						if (card.cards.some(card => card.hasGaintag("dckuizhen"))) {
							return Infinity;
						}
					},
				},
			},
		},
	},
	//刘理
	dcfuli: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countDiscardableCards(player, "h");
		},
		usable: 1,
		async content(event, trigger, player) {
			await player.showHandcards(get.translation(player) + "发动了【抚黎】");
			const getNum = type => {
				let num = ["basic", "trick", "equip"].indexOf(type);
				if (num === -1) {
					num = 3;
				}
				return num;
			};
			const types = player
				.getDiscardableCards(player, "h")
				.reduce((list, card) => {
					return list.add(get.type2(card));
				}, [])
				.sort((a, b) => getNum(a) - getNum(b));
			if (types.length) {
				const { control } = await player
					.chooseControl(types)
					.set("ai", () => {
						const player = get.event().player,
							types = get.event().controls.slice();
						const getNum = type => {
							const cards = player.getDiscardableCards(player, "h").filter(card => get.type2(card) == type);
							const countCards = (target, player, cards) => {
								return target.countCards("h") - (target == player ? cards.length : 0);
							};
							const max = game
								.findPlayer(target => {
									return !game.hasPlayer(target2 => {
										return countCards(target2, player, cards) > countCards(target, player, cards);
									});
								})
								.countCards("h");
							return (
								Math.min(
									max,
									cards.reduce((sum, card) => sum + get.cardNameLength(card), 0)
								) / cards.length
							);
						};
						return types.sort((a, b) => {
							return getNum(b) - getNum(a);
						})[0];
					})
					.set("prompt", "弃置一种类别的所有手牌，然后摸这些牌的名字字数之和的牌")
					.forResult();
				if (control) {
					const cards = player.getDiscardableCards(player, "h").filter(card => get.type2(card) == control);
					await player.discard(cards);
					const max = game.findPlayer(target => target.isMaxHandcard()).countCards("h");
					const num = Math.min(
						max,
						cards.reduce((sum, card) => sum + get.cardNameLength(card), 0)
					);
					if (num) {
						await player.draw(num);
					}
					const goon = cards.some(card => get.is.damageCard(card));
					const { bool, targets } = await player
						.chooseTarget(
							"抚黎：是否令一名角色的攻击范围" + (goon ? "减至0" : "-1") + "直到你的下个回合开始？",
							(card, player, target) => {
								return !get.event().goon || target.getAttackRange() > 0;
							}
						)
						.set("ai", target => {
							const player = get.event().player,
								num = target.getAttackRange();
							if (get.attitude(player, target) > 0) {
								return -1;
							}
							if (get.event().goon) {
								return num;
							}
							if (num < 1) {
								return 1 / (1 - num);
							}
							return 5 / num;
						})
						.set("goon", goon)
						.forResult();
					if (bool) {
						const target = targets[0];
						player.line(target);
						target.addSkill("dcfuli_range");
						target.addMark("dcfuli_range", goon ? target.getAttackRange() : 1, false);
						player.when(["phaseBegin", "dieBegin"]).step(async () => {
							target.removeMark("dcfuli_range", target.countMark("dcfuli_range"), false);
							if (!target.hasMark("dcfuli_range")) {
								target.removeSkill("dcfuli_range");
							}
						});
					}
				}
			}
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					const types = player.getDiscardableCards(player, "h").reduce((list, card) => {
						return list.add(get.type2(card));
					}, []);
					if (
						!types.some(type => {
							const cards = player.getDiscardableCards(player, "h").filter(card => get.type2(card) == type);
							const countCards = (target, player, cards) => {
								return target.countCards("h") - (target == player ? cards.length : 0);
							};
							return !game
								.filterPlayer(target => {
									return !game.hasPlayer(target2 => {
										return countCards(target2, player, cards) > countCards(target, player, cards);
									});
								})
								.includes(player);
						})
					) {
						return 0;
					}
					return 1;
				},
			},
		},
		subSkill: {
			range: {
				charlotte: true,
				onremove: true,
				mod: {
					attackRange(player, num) {
						return num - player.countMark("dcfuli_range");
					},
				},
				marktext: " - ",
				intro: { content: "攻击范围-#" },
			},
		},
	},
	dcdehua: {
		audio: 2,
		trigger: { global: "roundStart" },
		forced: true,
		async content(event, trigger, player) {
			const list = lib.inpile.filter(name => {
				if (get.type(name) === "delay" || player.getStorage("dcdehua").includes(name)) {
					return false;
				}
				const card = new lib.element.VCard({ name: name, isCard: true });
				return get.tag(card, "damage") && player.hasUseTarget(card);
			});
			if (list.length) {
				const { bool, links } = await player
					.chooseButton(
						['###德化###<div class="text center">视为使用一张未以此法选择过且可以使用的伤害类卡牌</div>', [list, "vcard"]],
						true
					)
					.set("ai", button => {
						const name = button.link[2],
							player = get.player();
						let value = player.getUseValue({ name, isCard: true }, null, true);
						if (player.countCards("h", card => get.name(card) === name && player.hasUseTarget(card))) {
							value /= 3;
						}
						if (name === "sha") {
							value /= 2;
						}
						return value;
					})
					.forResult();
				if (bool) {
					const name = links[0][2],
						card = new lib.element.VCard({ name: name, isCard: true });
					await player.chooseUseTarget(card, true);
					player.markAuto("dcdehua", [name]);
				}
			}
			if (
				!lib.inpile.some(name => {
					if (get.type(name) === "delay") {
						return false;
					}
					const card = new lib.element.VCard({ name: name });
					return get.tag(card, "damage") && !player.getStorage("dcdehua").includes(name);
				})
			) {
				await player.removeSkills("dcdehua");
				player.addSkill("dcdehua_hand");
			}
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.getStorage("dcdehua").length;
			},
			cardEnabled(card, player) {
				if (
					player.getStorage("dcdehua").includes(card.name) &&
					(get.position(card) == "h" || (card.cards && card.cards.some(i => get.position(i) == "h")))
				) {
					return false;
				}
			},
			cardSavable(card, player) {
				if (
					player.getStorage("dcdehua").includes(card.name) &&
					(get.position(card) == "h" || (card.cards && card.cards.some(i => get.position(i) == "h")))
				) {
					return false;
				}
			},
			aiValue(player, card) {
				if (player.getStorage("dcdehua").includes(get.name(card))) {
					return 0;
				}
			},
			aiUseful() {
				return lib.skill.dcdehua.mod.aiValue.apply(this, arguments);
			},
		},
		intro: {
			content(storage) {
				return "<li>手牌上限+" + storage.length + "<br><li>不能使用手牌中的" + get.translation(storage);
			},
		},
		subSkill: {
			hand: {
				charlotte: true,
				mark: true,
				intro: { content: "伤害牌不计入手牌上限" },
				mod: {
					ignoredHandcard(card) {
						if (get.is.damageCard(card)) {
							return true;
						}
					},
					cardDiscardable(card, _, name) {
						if (name == "phaseDiscard" && get.is.damageCard(card)) {
							return false;
						}
					},
				},
			},
		},
	},
	//蒋琬费祎
	dcshoucheng: {
		audio: "shoucheng",
		global: "dcshoucheng_ai",
		trigger: {
			global: ["equipAfter", "addJudgeAfter", "loseAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			const target = _status.currentPhase;
			return game.hasPlayer(current => {
				if (target && current == target) {
					return false;
				}
				let evt = event.getl(current);
				return evt && evt.hs && evt.hs.length && current.countCards("h") == 0;
			});
		},
		async cost(event, trigger, player) {
			const targetx = _status.currentPhase;
			const targets = game
				.filterPlayer(current => {
					if ((targetx && current == targetx) || !current.isIn()) {
						return false;
					}
					let evt = trigger.getl(current);
					return evt && evt.hs && evt.hs.length && current.countCards("h") == 0;
				})
				.sortBySeat(targetx || player);
			event.result = await player
				.chooseTarget(
					"是否对" + (targets.length > 1 ? "其中一名角色" : get.translation(targets[0])) + "发动【守成】？",
					"令其摸两张牌",
					(card, player, target) => {
						return get.event().targets.includes(target);
					}
				)
				.set("targets", targets)
				.set("ai", target => get.attitude(get.event().player, target))
				.forResult();
		},
		usable: 1,
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (get.mode() != "identity" || player.identity != "nei") {
				player.addExpose(0.2);
			}
			target.draw(2);
		},
		subSkill: {
			ai: {
				ai: {
					noh: true,
					skillTagFilter(player, tag, arg) {
						if (player === _status.currentPhase || player.countCards("h") != 1) {
							return false;
						}
						return game.hasPlayer(current => {
							return current.hasSkill("dcshoucheng") && get.attitude(current, player) > 0;
						});
					},
				},
			},
		},
	},
	//乐大乔
	dczixi: {
		init() {
			game.addGlobalSkill("dczixi_judge");
			game.broadcastAll(() => lib.skill.dczixi.video());
		},
		video() {
			const list = lib.skill.dczixi.zixiList;
			for (const name of list) {
				const namex = "dczixi_" + name;
				if (!lib.card[namex]) {
					lib.card[namex] = {
						type: "special_delay",
						fullskin: true,
						noEffect: true,
						wuxieable: false,
					};
					lib.card[namex].cardimage = name;
					lib.translate[namex] = lib.translate[name] + "·姊希";
					lib.translate[namex + "_info"] = "由【姊希】技能创造的无效果【" + lib.translate[name] + "】";
				}
			}
		},
		audio: 2,
		trigger: { player: ["phaseUseBegin", "phaseUseEnd"] },
		filter(event, player) {
			return (
				player.countCards("h", card => {
					return (
						card.hasGaintag("eternal_dcqiqin_tag") &&
						lib.skill.dczixi.zixiList.some(name => {
							return game.hasPlayer(target => target.canAddJudge(get.autoViewAs({ name: "dczixi_" + name }, [card])));
						})
					);
				}) > 0
			);
		},
		zixiList: ["lebu", "bingliang", "shandian"],
		selectAi(player, names) {
			let max = [null, 0, null, null];
			for (let name of names) {
				let res = [null, null, 0];
				player.getCards("h", i => {
					if (!i.hasGaintag("eternal_dcqiqin_tag") || get.value(i) >= 7) {
						return false;
					}
					game.countPlayer(target => {
						if (!target.canAddJudge(get.autoViewAs({ name: "dczixi_" + name }, [i]))) {
							return;
						}
						let eff = get.effect(target, get.autoViewAs({ name }, [i]), player, player);
						if (get.attitude(player, target) > 0) {
							if (-eff > res[2]) {
								res = [target, i, -eff / 16];
							} //避免人机一直贴队友
						} else {
							if (eff > res[2]) {
								res = [target, i, eff];
							}
						}
					});
				});
				if (res[0] && res[2] > max[1]) {
					max = [get.translation(name), res[2], res[1], res[0]];
				}
			}
			return max;
		},
		direct: true,
		async content(event, trigger, player) {
			game.addVideo("skill", player, ["dczixi", []]);
			const names = lib.skill.dczixi.zixiList.filter(name => {
				return player.countCards("h", card => {
					return (
						card.hasGaintag("eternal_dcqiqin_tag") &&
						game.hasPlayer(target => target.canAddJudge(get.autoViewAs({ name: "dczixi_" + name }, [card])))
					);
				});
			});
			let map = {};
			for (const name of names) {
				map[get.translation(name)] = name;
			}
			let max = lib.skill.dczixi.selectAi(player, Object.values(map));
			const { bool, links } = await player
				.chooseButton(2, [
					"###" + get.prompt("dczixi") + '###<div class="text center">将一张“琴”以你选择的牌名置于一名角色的判定区</div>',
					player.getCards("h"),
					[Object.keys(map), "tdnodes"],
				])
				.set("filterButton", button => {
					const type = typeof button.link,
						card = button.link;
					if (ui.selected.buttons.length && type == typeof ui.selected.buttons[0].link) {
						return false;
					}
					if (type == "string") {
						return true;
					}
					return (
						card.hasGaintag("eternal_dcqiqin_tag") &&
						lib.skill.dczixi.zixiList.some(name => {
							return game.hasPlayer(target => target.canAddJudge(get.autoViewAs({ name: "dczixi_" + name }, [card])));
						})
					);
				})
				.set("ai", button => {
					if (typeof button.link == "string") {
						if (button.link == get.event().max[0]) {
							return 1;
						}
						return 0;
					}
					if (button.link == get.event().max[2]) {
						return 1;
					}
					return 0;
				})
				.set("max", max)
				.forResult();
			if (bool) {
				const name = links.find(i => typeof i == "string"),
					card = links.find(j => j != name),
					cardname = map[name];
				const { bool, targets } = await player
					.chooseTarget(
						"请选择【" + name + "（" + get.translation(card) + "）】置入的目标",
						(cardx, player, target) => {
							return target.canAddJudge(get.autoViewAs({ name: "dczixi_" + get.event().cardname }, [get.event().card]));
						},
						true
					)
					.set("ai", target => {
						if (target == get.event().max[3]) {
							return 1;
						}
						return 0;
					})
					.set("card", card)
					.set("cardname", cardname)
					.set("max", max)
					.forResult();
				if (bool) {
					const target = targets[0];
					player.logSkill("dczixi", target);
					player.$give(card, target, false);
					await game.delay(0.5);
					target.addJudge({ name: "dczixi_" + cardname }, [card]);
				}
			}
		},
		ai: {
			combo: "dcqiqin",
		},
		group: "dczixi_effect",
		subSkill: {
			judge: {
				mod: {
					targetEnabled(card, player, target) {
						const list = lib.skill.dczixi.zixiList;
						const name = typeof card == "string" ? card : card.viewAs ? card.viewAs : card.name;
						if (name.indexOf("dczixi_") == 0) {
							const namex = name.slice("dczixi_".length);
							if (list.includes(namex) && target.hasJudge(namex)) {
								return false;
							}
						} else if (list.includes(name) && target.hasJudge("dczixi_" + name)) {
							return false;
						}
					},
				},
				ai: {
					threaten(player, target) {
						if (!player.hasSkill("dczixi") || ![1, 2, 3].includes(target.countCards("j"))) {
							return;
						}
						return 3 + target.countCards("j");
					},
				},
			},
			effect: {
				audio: "dczixi",
				trigger: { player: "useCardToTargeted" },
				filter(event, player) {
					return (
						event.isFirstTarget &&
						event.targets.length == 1 &&
						[1, 2, 3].includes(event.target.countCards("j")) &&
						(get.type(event.card) == "basic" || get.type(event.card) == "trick")
					);
				},
				prompt2(event, player) {
					const target = event.target,
						str = get.translation(target);
					return [
						"令" + get.translation(event.card) + "对" + str + "额外结算一次",
						"摸两张牌",
						"弃置" + str + "判定区里的所有牌，对其造成3点伤害",
					][target.countCards("j") - 1];
				},
				check(event, player) {
					const target = event.target,
						num = target.countCards("j");
					if (num == 2) {
						return true;
					}
					if (num == 1) {
						return get.effect(target, event.card, player, player) > 0;
					}
					return get.attitude(player, target) < 0 && get.damageEffect(target, player, player) > 0;
				},
				logTarget: "target",
				async content(event, trigger, player) {
					const target = trigger.target,
						num = target.countCards("j");
					switch (num) {
						case 1:
							trigger.getParent().effectCount++;
							game.log(trigger.card, "额外结算一次");
							break;
						case 2:
							await player.draw(2);
							break;
						case 3:
							await target.discard(target.getCards("j"), player);
							await target.damage(3);
							break;
					}
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (!target || player._dczixi_effect_use || get.tag(card, "multitarget")) {
								return;
							}
							let js = target.countCards("j");
							if (js == 1) {
								return [2, 0, 2, 0];
							} else if (js == 2) {
								return [1, 2];
							} else if (js == 3 && get.attitude(player, target) < 0) {
								player._dczixi_effect_use = true;
								let eff = get.damageEffect(target, player, player);
								delete player._dczixi_effect_use;
								if (eff > 0) {
									return [1, 0, 1, -6];
								}
							}
						},
					},
				},
			},
		},
	},
	//孔融
	dckrmingshi: {
		audio: "mingshi",
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return event.source && event.source.countCards("h") > player.countCards("h");
		},
		forced: true,
		logTarget: "source",
		async content(event, trigger, player) {
			const target = trigger.source;
			const { bool } = await target
				.chooseToDiscard("名士：弃置一张手牌，或令对" + get.translation(player) + "造成的伤害-1")
				.set("ai", card => {
					if (get.event().goon) {
						return 0;
					}
					return 6 - get.value(card);
				})
				.set("goon", get.damageEffect(player, target, target) <= 0)
				.forResult();
			if (!bool) {
				trigger.num--;
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && target != player) {
						if (_status.event.name == "dckrmingshi") {
							return;
						}
						if (get.attitude(player, target) > 0 && current < 0) {
							return "zeroplayertarget";
						}
						var bs = player.getCards("h");
						bs.remove(card);
						if (card.cards) {
							bs.removeArray(card.cards);
						} else {
							bs.removeArray(ui.selected.cards);
						}
						if (bs.length > target.countCards("h")) {
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
	//新服SP孟获
	dcmanwang: {
		audio: "spmanwang",
		inherit: "spmanwang",
		check(card) {
			var player = _status.event.player;
			var max = Math.min(player.isDamaged() ? 3 : 2, 4 - player.countMark("dcmanwang"));
			if (!max && !player.hasSkill("dcpanqin")) {
				return 0;
			}
			if (max == 0 && ui.selected.length > 0) {
				return 0;
			}
			return 7 - ui.selected.cards.length - get.value(card);
		},
		content() {
			var num = Math.min(cards.length, 4 - player.countMark("dcmanwang"));
			if (num >= 1) {
				player.addSkills("dcpanqin");
			}
			if (num >= 2) {
				player.draw();
			}
			if (num >= 3) {
				player.recover();
			}
			if (num >= 4) {
				player.draw(2);
				player.removeSkills("dcpanqin");
			}
		},
		ai: {
			order: 2,
			result: {
				player(player, target) {
					if (player.getUseValue({ name: "nanman" }) <= 0) {
						return 0;
					}
					if (player.getStat("skill").spmanwang && player.hasSkill("dcpanqin")) {
						return 0;
					}
					return 1;
				},
			},
		},
		derivation: "dcpanqin",
	},
	dcpanqin: {
		audio: "sppanqin",
		inherit: "sppanqin",
		content() {
			var cards = [];
			player.getHistory("lose", function (evt) {
				if (evt.type != "discard" || evt.getParent(trigger.name) != trigger) {
					return false;
				}
				for (var i of evt.cards2) {
					if (get.position(i, true) == "d") {
						cards.add(i);
					}
				}
			});
			player.chooseUseTarget(true, { name: "nanman" }, cards);
			player.addTempSkill("dcpanqin_eff");
		},
		subSkill: {
			eff: {
				charlotte: true,
				trigger: { player: "useCard" },
				filter(event, player) {
					return (
						event.card.name == "nanman" &&
						event.getParent(2).name == "dcpanqin" &&
						player.countMark("dcmanwang") < 4 &&
						player.hasSkill("dcmanwang", null, null, false) &&
						event.cards.length <= event.targets.length
					);
				},
				forced: true,
				popup: false,
				content() {
					"step 0";
					player.addMark("dcmanwang", 1, false);
					switch (player.countMark("dcmanwang")) {
						case 1:
							player.draw(2);
							player.removeSkills("dcpanqin");
							break;
						case 2:
							player.recover();
							break;
						case 3:
							player.draw();
							break;
						case 4:
							player.addSkills("dcpanqin");
							break;
					}
					"step 1";
					player.gainMaxHp();
					player.recover();
				},
			},
		},
	},
	//小乔
	dcqiqin: {
		audio: 2,
		audioname: ["yue_daqiao"],
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		content() {
			let cards = player.getCards("h"); //
			player.addGaintag(cards, "eternal_dcqiqin_tag");
			//player.markAuto("dcqiqin", cards);
		},
		group: "dcqiqin_restore",
		subSkill: {
			tag: {},
			restore: {
				audio: "dcqiqin",
				audioname: ["yue_daqiao"],
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return Array.from(ui.discardPile.childNodes).some(card => card.hasGaintag("eternal_dcqiqin_tag"));
					/*const targets = game.players.slice().concat(game.dead);
					return targets.some(target => target.getStorage("dcqiqin").filterInD("d").length);*/
				},
				forced: true,
				content() {
					//const targets = game.players.slice().concat(game.dead);
					const cards = Array.from(ui.discardPile.childNodes).filter(card => card.hasGaintag("eternal_dcqiqin_tag"));
					//const cards = targets.reduce((list, target) => list.addArray(target.getStorage("dcqiqin").filterInD("d")), []);
					player.gain(cards, "gain2"); //.gaintag.add("dcqiqin_tag");
				},
			},
		},
		mod: {
			ignoredHandcard(card, player) {
				if (card.hasGaintag("eternal_dcqiqin_tag")) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("eternal_dcqiqin_tag")) {
					return false;
				}
			},
		},
	},
	dcweiwan: {
		audio: 2,
		enable: "phaseUse",
		filter: (event, player) => {
			return (
				player.countCards(lib.skill.dcweiwan.position, card => {
					return lib.skill.dcweiwan.filterCard(card, player);
				}) &&
				game.hasPlayer(target => {
					return lib.skill.dcweiwan.filterTarget(null, player, target);
				})
			);
		},
		filterCard: (card, player) => {
			return card.hasGaintag("eternal_dcqiqin_tag") && lib.filter.cardDiscardable(card, player);
		},
		filterTarget: (card, player, target) => {
			return target != player && target.countCards("hej");
		},
		position: "h",
		check: card => {
			const player = _status.event.player;
			const target = game.players.reduce(
				(result, current) => {
					if (current === player) {
						return result;
					}
					const effect = Math.abs(lib.skill.dcweiwan.ai.result.target(player, current));
					return effect > result[1] ? [current, effect] : result;
				},
				[null, 0]
			)[0];
			return target ? lib.skill.dcweiwan.getWeiWanEffect(player, card, target) : 0;
		},
		usable: 1,
		async content(event, trigger, player) {
			let target = event.target;
			let suit = get.suit(event.cards[0], player);
			let cards = target.getCards("hej", card => get.suit(card, target) != suit && lib.filter.canBeGained(card, player, target));
			if (!cards.length) {
				player.chat("无牌可得！！");
				return;
			}
			let suits = lib.suit.slice();
			suits.reverse();
			suits.add("none");
			suits.forEach(suit2 => {
				let cards2 = cards.filter(card => get.suit(card, target) == suit2);
				if (cards2.length) {
					cards2.randomRemove();
					cards.removeArray(cards2);
				}
			});
			if (!cards.length) {
				player.chat("无牌可得！！");
				return;
			}
			player.gain(cards, target, "give");
			switch (cards.length) {
				case 1:
					target.loseHp();
					break;
				case 2:
					player.addTempSkill("tanbei_effect3");
					target.addTempSkill("tanbei_effect1");
					break;
				case 3:
					player.addTempSkill("tanbei_effect3");
					target.addTempSkill("tanbei_effect2");
					break;
			}
		},
		ai: {
			order: 9,
			result: {
				target: (player, target) => {
					const att = get.sgn(get.attitude(player, target)) - 1;
					const cards = player.getCards(lib.skill.dcweiwan.position, card => lib.skill.dcweiwan.filterCard(card, player));
					return (
						att *
						cards.reduce((result, card) => {
							const effect = lib.skill.dcweiwan.getWeiWanEffect(player, card, target);
							return effect > result ? effect : result;
						}, 0)
					);
				},
			},
			combo: "dcqiqin",
		},
		getWeiWanEffect: (player, cardx, target) => {
			const suit = get.suit(cardx, player);
			const cards = target.getCards("hej", card => get.suit(card, target) !== suit && lib.filter.canBeGained(card, player, target));
			const num = lib.suits.filter(suit => cards.some(card => get.suit(card, target) === suit)).length;
			switch (num) {
				case 1:
					return num + Math.max(0, get.sgn(get.effect(target, { name: "losehp" }, player, player)));
				case 2:
					return num + player.countCards("he", card => player.canUse(card, target, false) && get.effect(target, card, player, player) > 0);
				case 3:
					return Math.ceil(num / 2);
				default:
					return num;
			}
		},
	},
	//董昭
	dcyijia: {
		audio: 2,
		trigger: { global: "damageEnd" },
		filter(event, player) {
			if (!event.player.isIn()) {
				return false;
			}
			if (get.distance(player, event.player) > 1) {
				return false;
			}
			return player.canMoveCard(
				null,
				true,
				game.filterPlayer(i => i != event.player),
				event.player,
				"canReplace"
			);
		},
		check(event, player) {
			return player.canMoveCard(
				true,
				true,
				game.filterPlayer(i => i != event.player),
				event.player,
				"canReplace"
			);
		},
		prompt2(event, player) {
			return `将场上一张装备牌移动至${get.translation(event.player)}的装备区内（替换原装备）。然后若其因此脱离了一名角色的攻击范围，你摸一张牌。`;
		},
		logTarget: "player",
		line: false,
		async content(event, trigger, player) {
			const target = trigger.player;
			const inRangeList = game.filterPlayer(current => current.inRange(target));
			await player
				.moveCard(
					true,
					game.filterPlayer(i => i != target),
					target,
					"canReplace"
				)
				.set("nojudge", true);
			const leaveSomeone = inRangeList.some(current => !current.inRange(target));
			if (leaveSomeone) {
				player.draw();
			}
		},
		ai: {
			maixie: true,
			expose: 0.2,
			threaten: 3.3,
		},
	},
	dcdingji: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		async content(event, trigger, player) {
			let result;
			result = await player
				.chooseTarget(get.prompt2("dcdingji"))
				.set("ai", target => {
					let att = get.attitude(get.player(), target) / 2;
					const delta = 5 - target.countCards("h");
					let fix = 1;
					const hs = target.getCards("h");
					outer: for (let i = 0; i < hs.length - 1; i++) {
						const name1 = get.name(hs[i]);
						for (let j = i + 1; j < hs.length; j++) {
							const name2 = get.name(hs[j]);
							if (name1 == name2) {
								fix = 0.5;
								break outer;
							}
						}
					}
					if (delta > 0) {
						if (target.hasSkillTag("nogain")) {
							att /= 3;
						}
						return Math.sqrt(delta) * att * fix;
					}
					if (delta > -2 && att > 0) {
						return fix == 0.5 ? 0.1 : -1;
					}
					return (-Math.sqrt(-delta) * att) / 2;
				})
				.forResult();
			if (!result.bool) {
				return event.finish();
			}
			const target = result.targets[0];
			player.logSkill("dcdingji", target);
			if (target != player) {
				player.addExpose(0.3);
			}
			const delta = 5 - target.countCards("h");
			if (delta != 0) {
				await target[delta > 0 ? "draw" : "chooseToDiscard"](Math.abs(delta), true, "allowChooseAll");
			}
			await target.showHandcards();
			const hs = target.getCards("h");
			let hasSame = false;
			outer: for (let i = 0; i < hs.length - 1; i++) {
				const name1 = get.name(hs[i]);
				for (let j = i + 1; j < hs.length; j++) {
					const name2 = get.name(hs[j]);
					if (name1 == name2) {
						hasSame = true;
						break outer;
					}
				}
			}
			await game.delayex();
			if (hasSame) {
				return event.finish();
			}
			const list = get.inpileVCardList(info => {
				if (!["basic", "trick"].includes(info[0])) {
					return false;
				}
				if (!target.hasUseTarget(new lib.element.VCard({ name: info[2], nature: info[3], isCard: true }))) {
					return false;
				}
				return hs.some(card => {
					return get.name(card) == info[2] && get.is.sameNature([card, info[3]], true);
				});
			});
			if (!list.length) {
				return event.finish();
			}
			result = await target
				.chooseButton(["是否视为使用其中一张牌？", [list, "vcard"]])
				.set("ai", button => {
					return get.player().getUseValue({ name: button.link[2] });
				})
				.forResult();
			if (result.bool) {
				target.chooseUseTarget(
					new lib.element.VCard({
						name: result.links[0][2],
						nature: result.links[0][3],
						isCard: true,
					}),
					true,
					false
				);
			}
		},
	},
	//蒯祺
	dcliangxiu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.hasCard(card => {
				const type = get.type2(card, player);
				return player.hasCard(cardx => {
					if (card == cardx) {
						return false;
					}
					return get.type2(cardx, player) != type;
				}, "he");
			}, "he");
		},
		filterCard(card, player) {
			if (!ui.selected.cards.length) {
				return true;
			}
			return get.type2(ui.selected.cards[0], player) != get.type2(card, player);
		},
		selectCard: 2,
		check(card) {
			const player = get.player();
			const bannedTypes = [];
			bannedTypes.addArray(player.getStorage("dcliangxiu"));
			if (!ui.selected.cards.length) {
				let val = get.value(card);
				if (val > 5.5) {
					return 0;
				}
				if (bannedTypes.includes(get.type2(card, player))) {
					return 7.5 - val;
				}
				return 5.5 - val;
			}
			bannedTypes.addArray(ui.selected.cards.map(card => get.type2(card, player)));
			bannedTypes.add(get.type2(card, player));
			const filter = card => !bannedTypes.includes(get.type2(card, player));
			if (!get.cardPile(filter)) {
				return 0;
			}
			return 6 - get.value(card);
		},
		position: "he",
		complexCard: true,
		onremove: true,
		async content(event, trigger, player) {
			let cards = [];
			const bannedTypes = [];
			bannedTypes.addArray(event.cards.map(card => get.type2(card, player)));
			bannedTypes.addArray(player.getStorage("dcliangxiu"));

			const filter = card => !bannedTypes.includes(get.type2(card, player));
			const piles = ["cardPile", "discardPile"];
			for (const pile of piles) {
				for (let i = 0; i < ui[pile].childNodes.length; i++) {
					const card = ui[pile].childNodes[i];
					if (filter(card)) {
						cards.add(card);
						if (cards.length >= 2) {
							break;
						}
					}
				}
				if (cards.length >= 2) {
					break;
				}
			}
			if (!cards.length) {
				player.chat("没牌了…");
				game.log("但是哪里都找不到没有符合条件的牌！");
				event.finish();
				return;
			}
			player.markAuto("dcliangxiu", cards.map(card => get.type2(card, false)).toUniqued());
			player.when({ global: "phaseChange" }).step(async () => {
				player.unmarkSkill("dcliangxiu");
			});
			if (_status.connectMode) {
				game.broadcastAll(() => (_status.noclearcountdown = true));
			}
			let given_map = {};
			while (cards.length) {
				let result;
				if (cards.length == 1) {
					result = { bool: true, links: cards.slice() };
				} else {
					result = await player
						.chooseCardButton("良秀：请选择要分配的牌", cards, [1, cards.length], true)
						.set("ai", button => {
							if (!ui.selected.buttons.length) {
								return get.buttonValue(button);
							}
							return 0;
						})
						.forResult();
				}
				const gives = result.links;
				const result2 = await player
					.chooseTarget("选择获得" + get.translation(gives) + "的角色", cards.length == 1)
					.set("ai", target => {
						return get.attitude(get.event().player, target) * get.sgn(get.sgn(get.event().goon) + 0.5);
					})
					.set(
						"goon",
						gives.reduce((sum, card) => sum + get.value(card), 0)
					)
					.forResult();
				if (result2.bool) {
					cards.removeArray(gives);
					const id = result2.targets[0].playerid;
					if (!given_map[id]) {
						given_map[id] = [];
					}
					given_map[id].addArray(gives);
				}
			}
			if (_status.connectMode) {
				game.broadcastAll(() => delete _status.noclearcountdown);
			}
			let list = [];
			for (const i in given_map) {
				const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				game.log(source, "获得了", given_map[i]);
				list.push([source, given_map[i]]);
			}
			await game
				.loseAsync({
					gain_list: list,
					giver: player,
					animate: "gain2",
				})
				.setContent("gaincardMultiple");
			game.delayx();
		},
		intro: {
			content: "已因此技能获得过$牌",
			onunmark: true,
		},
		ai: {
			order: 2,
			result: { player: 1 },
		},
	},
	dcxunjie: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (["handcard", "hp"].every(i => player.isTempBanned(`dcxunjie_${i}`))) {
				return false;
			}
			return player.hasHistory("gain", evt => {
				return !evt.getParent("phaseDraw", true);
			});
		},
		direct: true,
		async content(event, trigger, player) {
			const choices = [];
			const choiceList = ["令一名角色将手牌数摸或弃置至与其体力值相同", "令一名角色将体力回复或失去至与其手牌数相同"];
			if (!player.isTempBanned("dcxunjie_handcard")) {
				choices.push("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "（已被选择过）</span>";
			}
			if (!player.isTempBanned("dcxunjie_hp")) {
				choices.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "（已被选择过）</span>";
			}
			let result;
			if (_status.connectMode) {
				game.broadcastAll(() => {
					_status.noclearcountdown = true;
				});
			}
			if (choices.length == 1) {
				result = { control: choices[0] };
			} else {
				result = await player
					.chooseControl(choices, "cancel2")
					.set("choiceList", choiceList)
					.set("prompt", get.prompt("dcxunjie"))
					.set("ai", () => {
						return get.event().choice;
					})
					.set(
						"choice",
						(() => {
							const getValue = (index, target) => {
								let att = get.attitude(player, target);
								att = Math.sign(att) * Math.sqrt(Math.abs(att));
								let delt = target.getHp(true) - target.countCards("h");
								if (index == 1 && delt < 0) {
									delt = 0;
								}
								return (1 - 3 * index) * att * delt;
							};
							const list = game
								.filterPlayer()
								.map(current => {
									const val0 = getValue(0, current),
										val1 = getValue(1, current);
									return [val0, val1, Math.max(val0, val1)];
								})
								.sort((a, b) => {
									return b[2] - a[2];
								});
							const toChoose = list[0];
							if (toChoose[2] <= 0) {
								return "cancel2";
							}
							return toChoose[0] > toChoose[1] ? 0 : 1;
						})()
					)
					.forResult();
			}
			if (result.control == "cancel2") {
				if (_status.connectMode) {
					game.broadcastAll(() => {
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				return event.finish();
			}
			let prompt = "";
			const choice = result.control,
				index = choice == "选项一" ? 0 : 1;
			if (choices.length == 1) {
				prompt = `###${get.prompt("dcxunjie")}###<div class="text center">${choiceList[index]}</div>`;
			} else {
				prompt = `###殉节：请选择一名角色###<div class="text center">${choiceList[index].replace("一名", "该")}</div>`;
			}
			result = await player
				.chooseTarget(prompt)
				.set("ai", target => {
					const player = get.player(),
						index = get.event().index;
					let att = get.attitude(player, target);
					att = Math.sign(att) * Math.sqrt(Math.abs(att));
					let delt = target.getHp(true) - target.countCards("h");
					if (index == 1 && delt < 0) {
						delt = 0;
					}
					return (1 - 2 * index) * att * delt;
				})
				.set("index", index)
				.forResult();
			if (_status.connectMode) {
				game.broadcastAll(() => {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			if (!result.bool) {
				return event.finish();
			}
			const target = result.targets[0];
			player.logSkill("dcxunjie", target);
			player.tempBanSkill(`dcxunjie_${index == 0 ? "handcard" : "hp"}`, "roundStart", false);
			const delt = (target.getHp(true) - target.countCards("h")) * (1 - 2 * index);
			if (delt == 0) {
				event.finish();
			} else if (index == 0) {
				target[delt > 0 ? "draw" : "chooseToDiscard"](Math.abs(delt), true, "allowChooseAll");
			} else {
				target[delt > 0 ? "recover" : "loseHp"](Math.abs(delt));
			}
		},
	},
	//乐蔡邕
	dcjiaowei: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		group: "dcjiaowei_prevent",
		async content(event, trigger, player) {
			var cards = player.getCards("h");
			player.addGaintag(cards, "dcjiaowei_tag");
		},
		mod: {
			ignoredHandcard(card, player) {
				if (card.hasGaintag("dcjiaowei_tag")) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("dcjiaowei_tag")) {
					return false;
				}
			},
		},
		subSkill: {
			prevent: {
				audio: "dcjiaowei",
				trigger: {
					player: "loseAfter",
					global: ["loseAsyncAfter", "addJudgeAfter", "equipAfter", "gainAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (player.hasSkill("dcjiaowei_effect")) {
						return false;
					}
					if (!event.getl?.(player)?.hs?.length) {
						return false;
					}
					if (event.name === "lose") {
						return Object.values(event.gaintag_map).flat().includes("dcjiaowei_tag");
					}
					return player.hasHistory("lose", evt => {
						if (event !== evt.getParent()) {
							return false;
						}
						return Object.values(evt.gaintag_map).flat().includes("dcjiaowei_tag");
					});
				},
				forced: true,
				content() {
					player.addTempSkill("dcjiaowei_effect");
				},
			},
			effect: {
				audio: "dcjiaowei",
				trigger: { player: "damageBegin4" },
				forced: true,
				content() {
					player.removeSkill(event.name);
					trigger.cancel();
				},
				mark: true,
				intro: { content: "防止本回合下次受到的伤害" },
			},
		},
	},
	dcfeibai: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		locked: false,
		prompt(event, player) {
			const history = player.getHistory("useCard");
			const ind = history.indexOf(event) - 1,
				evt = history[ind];
			const len = get.cardNameLength(event.card) + (evt ? get.cardNameLength(evt.card) : 0);
			return `${get.prompt("dcfeibai")}（字数之和为${len}）`;
		},
		async content(event, trigger, player) {
			const history = player.getHistory("useCard");
			const ind = history.indexOf(trigger) - 1,
				evt = history[ind],
				cards = [];
			const len = get.cardNameLength(trigger.card) + (evt ? get.cardNameLength(evt.card) : 0);
			while (cards.length < 2) {
				const card = get.cardPile(cardx => get.cardNameLength(cardx, false) === len && !cards.includes(cardx));
				if (!card) {
					break;
				}
				cards.add(card);
			}
			if (cards.length) {
				const result = await player
					.chooseCardButton(`飞白：获得一张牌`, cards, true)
					.set("ai", button => get.value(button.link, player))
					.forResult();
				if (result?.links?.length) {
					await player.gain(result.links, "gain");
				}
			} else {
				await player.draw(2).gaintag.add("dcjiaowei_tag");
				player.tempBanSkill(event.name);
			}
		},
		mod: {
			aiOrder(player, card, num) {
				const evt = player.getLastUsed();
				const len = get.cardNameLength(card) + (evt ? get.cardNameLength(evt.card) : 0);
				const cardx = get.cardPile(card => get.cardNameLength(card, false) === len);
				if (cardx) {
					return num + 8 + (len == 2 || len == 4 ? 2 : 0);
				}
			},
		},
	},
	//庞山民
	dccaisi: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return get.type(event.card) == "basic" && _status.currentPhase;
		},
		prompt2(event, player) {
			const num = Math.pow(2, player.countMark("dccaisi_more"));
			return `从${player == _status.currentPhase ? "" : "弃"}牌堆中随机获得${get.cnNumber(num)}张非基本牌`;
		},
		async content(event, trigger, player) {
			const position = player == _status.currentPhase ? "cardPile2" : "discardPile";
			let cards = [],
				num = Math.pow(2, player.countMark("dccaisi_more"));
			while (num > 0) {
				num--;
				let card = get[position](card => get.type(card) != "basic" && !cards.includes(card), "random");
				if (card) {
					cards.add(card);
				} else {
					break;
				}
			}
			if (cards.length) {
				await player.gain(cards, "gain2");
			} else {
				player.chat("没有非基本牌…");
				game.log(`但是${position == "discardPile" ? "弃" : ""}牌堆里没有非基本牌！`);
			}
			const sum = player.getHistory("useSkill", evt => evt.skill == "dccaisi").length;
			if (sum <= player.maxHp) {
				player.addTempSkill("dccaisi_more");
				player.addMark("dccaisi_more", 1, false);
			} else {
				player.tempBanSkill("dccaisi");
			}
		},
		subSkill: { more: { charlotte: true, onremove: true } },
	},
	dczhuoli: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return (
				player.getHistory("useCard").length > player.getHp() ||
				player.getHistory("gain").reduce((sum, evt) => sum + evt.cards.length, 0) > player.getHp()
			);
		},
		async content(event, trigger, player) {
			if (player.maxHp < game.countPlayer2()) {
				await player.gainMaxHp();
			}
			await player.recover();
		},
	},
	//魏贾充
	dcbeini: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard(card, player) {
			const delt = player.countCards("h") - player.maxHp;
			return delt > 0;
		},
		selectCard() {
			const player = get.player();
			const delt = player.countCards("h") - player.maxHp;
			return delt > 0 ? delt : -1;
		},
		promptfunc: () => {
			const player = get.player();
			const delt = player.countCards("h") - player.maxHp;
			let str = "";
			if (delt > 0) {
				str += `弃置${get.cnNumber(delt)}张牌`;
			} else if (delt == 0) {
				str += `点击“确定”`;
			} else {
				str += `摸${get.cnNumber(-delt)}张牌`;
			}
			return `${str}，然后选择两名角色，前者视为对后者使用一张【杀】，且这两者的非锁定技失效。`;
		},
		allowChooseAll: true,
		async content(event, trigger, player) {
			if (player.countCards("h") < player.maxHp) {
				await player.drawTo(player.maxHp);
			}
			if (game.countPlayer() < 2) {
				event.finish();
				return;
			}
			var result = await player
				.chooseTarget(
					"悖逆：请选择两名角色",
					"前者视为对后者使用一张【杀】，且这两名角色的非锁定技失效直到回合结束。",
					true,
					2,
					(card, player, target) => {
						var sha = new lib.element.VCard({ name: "sha", isCard: true });
						if (ui.selected.targets.length) {
							var targetx = ui.selected.targets[0];
							return targetx.canUse(sha, target, false);
						}
						return lib.filter.cardEnabled(sha, target);
					}
				)
				.set("targetprompt", ["打人", "被打"])
				.set("multitarget", true)
				.set("ai", target => {
					var aiTargets = get.event().aiTargets;
					if (aiTargets) {
						return aiTargets[ui.selected.targets.length] == target ? 10 : 0;
					}
					return 0;
				})
				.set(
					"aiTargets",
					(() => {
						var targets = [],
							eff = 0;
						var sha = new lib.element.VCard({ name: "sha", isCard: true });
						for (var user of game.filterPlayer()) {
							for (var target of game.filterPlayer()) {
								if (user == target) {
									continue;
								}
								var targetsx = [user, target];
								targetsx.forEach(i => i.addSkill("dcbeini_fengyin2"));
								var effx = get.effect(target, sha, user, player);
								targetsx.forEach(i => i.removeSkill("dcbeini_fengyin2"));
								if (user == player) {
									effx += 1;
								}
								if (get.attitude(player, user) > 0) {
									effx -= 0.1;
								}
								if (effx > eff) {
									eff = effx;
									targets = targetsx;
								}
							}
						}
						if (targets.length) {
							return targets;
						}
						return null;
					})()
				)
				.forResult();
			if (result.bool) {
				var user = result.targets[0],
					target = result.targets[1];
				result.targets.forEach(i => i.addTempSkill("dcbeini_fengyin"));
				var sha = new lib.element.VCard({ name: "sha", isCard: true });
				if (user.canUse(sha, target, false)) {
					user.useCard(sha, target, false, "noai");
				}
			}
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					if (player.countCards("h") - player.maxHp >= 3) {
						return 1;
					}
					return game.hasPlayer(current => get.attitude(player, current) <= 0) ? 1 : 0;
				},
			},
		},
		subSkill: {
			fengyin: {
				inherit: "fengyin",
			},
			fengyin2: {
				inherit: "fengyin",
			},
		},
	},
	dcshizong: {
		audio: 2,
		enable: "chooseToUse",
		hiddenCard(player, name) {
			if (get.type(name) != "basic") {
				return false;
			}
			return player.countCards("he") >= player.countMark("dcshizong") + 1;
		},
		filter(event, player) {
			if (event.type == "wuxie" || event.dcshizong) {
				return false;
			}
			if (player.countCards("he") < player.countMark("dcshizong") + 1) {
				return false;
			}
			for (const name of lib.inpile) {
				if (get.type(name) != "basic") {
					continue;
				}
				const card = { name: name, isCard: true };
				if (event.filterCard(card, player, event)) {
					return true;
				}
				if (name == "sha") {
					for (const nature of lib.inpile_nature) {
						card.nature = nature;
						if (event.filterCard(card, player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return;
					}
					const card = { name: info[2], nature: info[3], isCard: true };
					return event.filterCard(card, player, event);
				});
				return ui.create.dialog("恃纵", [vcards, "vcard"], "hidden");
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				const player = get.player();
				const card = { name: button.link[2], nature: button.link[3] };
				if (
					game.hasPlayer(current => {
						return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
					})
				) {
					switch (button.link[2]) {
						case "tao":
							return 5;
						case "jiu":
							return 3.01;
						case "sha":
							if (button.link[3] == "fire") {
								return 2.95;
							} else if (button.link[3] == "thunder") {
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
					filterCard: true,
					filterTarget: lib.filter.notMe,
					selectTarget: 1,
					selectCard: () => get.player().countMark("dcshizong") + 1,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						suit: "none",
						number: null,
						isCard: true,
					},
					position: "he",
					popname: true,
					ignoreMod: true,
					ai1(card) {
						return 1 / (1.1 + Math.max(-1, get.value(card)));
					},
					ai2(target) {
						return get.attitude(get.player(), target);
					},
					async precontent(event, trigger, player) {
						var target = event.result.targets[0];
						player.logSkill("dcshizong", target);
						if (!player.countMark("dcshizong")) {
							player.when({ global: "phaseAfter" }).step(async () => delete player.storage.dcshizong);
						}
						player.addMark("dcshizong", 1, false);
						await player.give(event.result.cards.slice(), target);
						var viewAs = new lib.element.VCard({
							name: event.result.card.name,
							nature: event.result.card.nature,
							isCard: true,
						});
						var result = await target
							.chooseCard(
								"恃纵：是否将一张牌置于牌堆底？",
								`若如此做，${get.translation(player)}视为使用一张${get.translation(viewAs.nature)}【${get.translation(viewAs.name)}】`,
								"he"
							)
							.set("ai", card => {
								if (get.event().goon) {
									return 7 - get.value(card);
								}
								return 0;
							})
							.set("goon", get.attitude(target, player) * (player.getUseValue(viewAs) || 1) >= 1)
							.forResult();
						var card = event.result.cards[0];
						if (result.bool) {
							var card = result.cards[0];
							game.delayex();
							var next = target.loseToDiscardpile(card, ui.cardPile);
							next.log = false;
							if (get.position(card) == "e") {
								game.log(target, "将", card, "置于了牌堆底");
							} else {
								next.blank = true;
								game.log(target, "将一张牌置于了牌堆底");
							}
							result = await next.forResult();
							game.broadcastAll(viewAs => {
								lib.skill.dcshizong_backup2.viewAs = viewAs;
							}, lib.skill.dcshizong_backup.viewAs);
							var evt = event.getParent();
							evt.set("_backupevent", "dcshizong_backup2");
							evt.set("openskilldialog", `请选择${get.translation(viewAs.nature)}${get.translation(viewAs.name)}的目标`);
							evt.backup("dcshizong_backup2");
							evt.set("norestore", true);
							evt.set("custom", {
								add: {},
								replace: { window() {} },
							});
							evt.goto(0);
							if (target != _status.currentPhase) {
								player.tempBanSkill("dcshizong");
							}
						} else {
							target.chat("不放！");
							game.log(target, "选择不将牌置于牌堆底");
							var evt = event.getParent();
							evt.set("dcshizong", true);
							evt.goto(0);
						}
						game.delayx();
					},
					ai: { order: 10 },
				};
			},
			prompt(links, player) {
				return `###恃纵：选择要交出的牌和目标角色###将${get.cnNumber(player.countMark("dcshizong") + 1)}张牌交给一名其他角色，其可以选择将一张牌置于牌堆底，视为你使用一张${get.translation(links[0][3] || "")}${get.translation(links[0][2])}。`;
			},
		},
		ai: {
			order() {
				const player = get.player(),
					event = get.event();
				if (event.filterCard({ name: "jiu" }, player, event) && get.effect(player, { name: "jiu" }) > 0) {
					return get.order({ name: "jiu" }) + 0.1;
				}
				return get.order({ name: "sha" }) + 0.1;
			},
			respondSha: true,
			fireAttack: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (arg === "respond" || tag == "fireAttack") {
					return true;
				}
				if (player.countCards("he") < player.countMark("dcshizong") + 1) {
					return false;
				}
				if (tag == "respondSha") {
					return false;
				}
			},
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
			backup: {},
			backup2: {
				filterCard: () => false,
				selectCard: -1,
				log: false,
			},
		},
	},
	//张曼成
	dclvecheng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		content() {
			player.addTempSkill("dclvecheng_xiongluan");
			player.markAuto("dclvecheng_xiongluan", [target]);
			var cards = player.getCards("h", "sha");
			if (cards.length) {
				player.addGaintag(cards, "dclvecheng_xiongluan");
			}
		},
		ai: {
			threaten: 3.1,
			order: 3.5,
			expose: 0.2,
			result: {
				target(player, target) {
					if (player.getStorage("dclvecheng_xiongluan").includes(target)) {
						return 0;
					}
					if (
						target.hasSkillTag(
							"freeShan",
							false,
							{
								player: player,
								type: "use",
							},
							true
						)
					) {
						return -0.6;
					}
					var hs = player.countCards("h", card => {
						if (!player.canUse(card, target)) {
							return false;
						}
						return get.name(card) == "sha" && get.effect(target, card, player, player) > 0;
					});
					var ts = target.hp;
					if (hs >= ts && ts > 1) {
						return -2;
					}
					return -1;
				},
			},
		},
		subSkill: {
			xiongluan: {
				trigger: { player: ["phaseEnd", "useCard1"] },
				charlotte: true,
				forced: true,
				popup: false,
				onremove(player, skill) {
					player.removeGaintag(skill);
					delete player.storage[skill];
				},
				filter(event, player) {
					if (event.name == "useCard") {
						if (event.addCount === false || !event.targets?.some(target => player.getStorage("dclvecheng_xiongluan").includes(target))) {
							return false;
						}
						return player.hasHistory("lose", evt => {
							const evtx = evt.relatedEvent || evt.getParent();
							if (evtx != event) {
								return false;
							}
							return Object.values(evt.gaintag_map).flat().includes("dclvecheng_xiongluan");
						});
					}
					return player.getStorage("dclvecheng_xiongluan").some(i => i.isIn());
				},
				async content(event, trigger, player) {
					if (trigger.name == "useCard") {
						trigger.addCount = false;
						const stat = player.getStat().card,
							name = trigger.card.name;
						if (typeof stat[name] == "number") {
							stat[name]--;
						}
						return;
					}
					const targets = player.getStorage(event.name).slice().sortBySeat();
					if (!targets.length) {
						return;
					}
					while (targets.length && player.isIn()) {
						const target = targets.shift();
						await target.showHandcards();
						let cards = target.getCards("h", card => {
							return get.name(card) === "sha" && target.canUse(card, player, false);
						});
						if (!cards.length) {
							continue;
						}
						let forced = false;
						while (cards.length && player.isIn()) {
							const prompt2 = forced
								? `掠城：选择对${get.translation(player)}使用的【杀】`
								: `掠城：是否依次对${get.translation(player)}使用所有的【杀】？`;
							const result = await target
								.chooseToUse(
									forced,
									function (card, player, event) {
										if (get.itemtype(card) != "card" || get.name(card) != "sha") {
											return false;
										}
										return lib.filter.filterCard.apply(this, arguments);
									},
									prompt2
								)
								.set("targetRequired", true)
								.set("complexTarget", true)
								.set("complexSelect", true)
								.set("filterTarget", function (card, player, target) {
									if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
										return false;
									}
									return lib.filter.targetEnabled.apply(this, arguments);
								})
								.set("sourcex", player)
								.forResult();
							if (result.bool) {
								cards = target.getCards("h", card => {
									return get.name(card) === "sha" && target.canUse(card, player, false);
								});
								forced = true;
							} else {
								break;
							}
						}
					}
				},
				intro: { content: "对$使用“掠城”【杀】无任何次数限制" },
				mod: {
					cardUsableTarget(card, player, target) {
						if (!card.cards || card.cards.length != 1) {
							return;
						}
						if (
							card.name == "sha" &&
							card.cards[0].hasGaintag("dclvecheng_xiongluan") &&
							player.getStorage("dclvecheng_xiongluan").includes(target)
						) {
							return true;
						}
					},
				},
			},
		},
	},
	dczhongji: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			if (player.countCards("h") >= player.maxHp) {
				return false;
			}
			var suit = get.suit(event.card);
			return !lib.suit.includes(suit) || !player.countCards("h", { suit: suit });
		},
		check(event, player) {
			var num = Math.min(20, player.maxHp - player.countCards("h"));
			if (num <= 0) {
				return false;
			}
			var numx =
				player.getHistory("useSkill", evt => {
					return evt.skill == "dczhongji";
				}).length + 1;
			if (numx > num) {
				return false;
			}
			if (_status.currentPhase != player) {
				return true;
			}
			if (
				player.hasCard(card => {
					var suit = get.suit(card);
					return (
						player.hasValueTarget(card) &&
						!player.hasCard(cardx => {
							return cardx != card && get.suit(cardx) == suit;
						})
					);
				})
			) {
				return false;
			}
			return true;
		},
		prompt2(event, player) {
			var num = Math.min(20, player.maxHp - player.countCards("h"));
			var str = num > 0 ? "摸" + get.cnNumber(num) + "张牌，然后" : "";
			return (
				str +
				"弃置" +
				get.cnNumber(
					1 +
						player.getHistory("useSkill", evt => {
							return evt.skill == "dczhongji";
						}).length
				) +
				"张牌"
			);
		},
		content() {
			"step 0";
			var num = Math.min(20, player.maxHp - player.countCards("h"));
			if (num > 0) {
				player.draw(num);
			}
			"step 1";
			var num = player.getHistory("useSkill", evt => {
				return evt.skill == "dczhongji";
			}).length;
			player.chooseToDiscard("螽集：请弃置" + get.cnNumber(num) + "张牌", "he", true, num).set("ai", get.unuseful);
		},
		ai: {
			threaten: 3.2,
		},
	},
	//乐周妃
	dclingkong: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h");
		},
		async content(event, trigger, player) {
			const cards = player.getCards("h");
			if (cards.length) {
				player.addGaintag(cards, "dclingkong_tag");
			}
		},
		mod: {
			ignoredHandcard(card, player) {
				if (card.hasGaintag("dclingkong_tag")) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("dclingkong_tag")) {
					return false;
				}
			},
		},
		group: "dclingkong_marker",
		subSkill: {
			marker: {
				audio: "dclingkong",
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				forced: true,
				filter: (event, player) => {
					const phaseDraw = event.getParent("phaseDraw");
					if (phaseDraw?.player === player) {
						return false;
					}
					const history = player.getHistory("gain", evt => {
						const phaseDraw = evt.getParent("phaseDraw");
						return !phaseDraw || phaseDraw.player !== player;
					});
					const evt = event.name == "loseAsync" ? event.childEvents?.find(evtx => evtx.name == "gain" && evtx.player == player) : event;
					if (history.indexOf(evt) !== 0) {
						return false;
					}
					const hs = player.getCards("h");
					if (!hs.length) {
						return false;
					}
					const cards = event.getg?.(player);
					return cards?.some(card => hs.includes(card));
				},
				async content(event, trigger, player) {
					let hs = player.getCards("h"),
						cards = trigger.getg(player);
					cards = cards.filter(card => hs.includes(card));
					if (cards.length) {
						player.addGaintag(cards, "dclingkong_tag");
					}
					await game.delayx();
				},
			},
		},
	},
	dcxianshu: {
		audio: 2,
		enable: "phaseUse",
		filter: (event, player) => {
			return game.hasPlayer(current => current != player) && player.hasCard(card => card.hasGaintag("dclingkong_tag"), "h");
		},
		filterCard: card => card.hasGaintag("dclingkong_tag"),
		filterTarget: lib.filter.notMe,
		discard: false,
		lose: false,
		delay: false,
		position: "h",
		check: card => {
			const player = _status.event.player,
				event = _status.event,
				color = get.color(card);
			if (color == "red") {
				return (event.getTempCache("dcxianshu", "red") ||
					event.putTempCache(
						"dcxianshu",
						"red",
						game
							.hasPlayer(current => {
								return (
									current != player &&
									current.hp <= player.hp &&
									current.isDamaged() &&
									get.recoverEffect(current, player, player) > 0
								);
							})
							.toString()
					)) == "true"
					? 7 - get.value(card)
					: 0;
			} else if (color == "black") {
				return (event.getTempCache("dcxianshu", "black") ||
					event.putTempCache(
						"dcxianshu",
						"black",
						game
							.hasPlayer(current => {
								return current != player && current.hp >= player.hp && get.effect(current, { name: "losehp" }, player, player) > 0;
							})
							.toString()
					)) == "true"
					? 7 - get.value(card)
					: 0;
			}
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			player.give(cards, target, true);
			event.color = get.color(cards[0], player);
			"step 1";
			if (target.isIn()) {
				var num = Math.min(Math.abs(target.getHp() - player.getHp()), 5);
				if (num > 0) {
					player.draw(num);
				}
			}
			"step 2";
			if (event.color == "red") {
				if (target.getHp() <= player.getHp() && target.isDamaged()) {
					target.recover();
				}
			} else if (event.color == "black") {
				if (target.getHp() >= player.getHp()) {
					target.loseHp();
				}
			}
		},
		ai: {
			combo: "dclingkong",
			order: 10,
			result: {
				player(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					let num = target.getHp() - player.getHp();
					const card = ui.selected.cards[0],
						color = get.color(card);
					if (color == "red" && target.getHp() <= player.getHp() && target.isDamaged()) {
						num++;
					} else if (color == "black" && target.getHp() >= player.getHp()) {
						num--;
					}
					return Math.min(Math.abs(num), 5) * 1.1;
				},
				target(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					const card = ui.selected.cards[0],
						color = get.color(card),
						val = get.value(card, target);
					if (color == "red" && target.getHp() <= player.getHp() && target.isDamaged()) {
						return get.recoverEffect(target, player, target) + val / 1.4;
					} else if (color == "black" && target.getHp() >= player.getHp()) {
						return get.effect(target, { name: "losehp" }, player, target) + val / 1.4;
					}
					return val / 1.4;
				},
			},
		},
	},
	//吴班
	dcyouzhan: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		direct: true,
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				var evt = event.getl(current);
				return evt && evt.cards2.length;
			});
		},
		content() {
			"step 0";
			var targets = game.filterPlayer(current => {
				if (current == player) {
					return false;
				}
				var evt = trigger.getl(current);
				return evt && evt.cards2.length;
			});
			event.targets = targets;
			player.logSkill("dcyouzhan", targets);
			"step 1";
			event.target = targets.shift();
			event.num = trigger.getl(event.target).cards2.length;
			"step 2";
			player.draw().gaintag = ["dcyouzhan"];
			player.addTempSkill("dcyouzhan_limit");
			target.addTempSkill("dcyouzhan_effect");
			target.addMark("dcyouzhan_effect", 1, false);
			target.addTempSkill("dcyouzhan_draw");
			if (--event.num) {
				event.redo();
			}
			"step 3";
			if (targets.length) {
				event.goto(1);
			}
		},
		ai: {
			damageBonus: true,
			skillTagFilter(player, tag, arg) {
				if (!arg || !arg.target || !arg.target.hasSkill("dcyouzhan_effect")) {
					return false;
				}
			},
		},
		subSkill: {
			effect: {
				audio: "dcyouzhan",
				trigger: {
					player: "damageBegin3",
				},
				filter(event, player) {
					return player.hasMark("dcyouzhan_effect");
				},
				forced: true,
				charlotte: true,
				onremove: true,
				content() {
					"step 0";
					trigger.num += player.countMark("dcyouzhan_effect");
					player.removeSkill("dcyouzhan_effect");
				},
				mark: true,
				intro: {
					content: "本回合下一次受到的伤害+#",
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								return 1 + 0.5 * target.countMark("dcyouzhan_effect");
							}
						},
					},
				},
			},
			draw: {
				trigger: {
					global: "phaseJieshuBegin",
				},
				forced: true,
				charlotte: true,
				filter(event, player) {
					return !player.getHistory("damage").length;
				},
				content() {
					player.draw(Math.min(3, player.getHistory("lose").length));
				},
			},
			limit: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("dcyouzhan");
				},
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("dcyouzhan")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("dcyouzhan")) {
							return false;
						}
					},
				},
			},
		},
	},
	//乐蔡文姬
	dcshuangjia: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content() {
			"step 0";
			var cards = player.getCards("h");
			player.addGaintag(cards, "dcshuangjia_tag");
		},
		mod: {
			ignoredHandcard(card, player) {
				if (card.hasGaintag("dcshuangjia_tag")) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("dcshuangjia_tag")) {
					return false;
				}
			},
			globalTo(from, to, distance) {
				return (
					distance +
					Math.min(
						5,
						to.countCards("h", card => card.hasGaintag("dcshuangjia_tag"))
					)
				);
			},
		},
	},
	dcbeifen: {
		audio: 2,
		trigger: {
			player: ["loseAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			var evt = event.getl(player);
			if (!evt || !evt.hs || !evt.hs.length) {
				return false;
			}
			if (event.name == "lose") {
				for (var i in event.gaintag_map) {
					if (event.gaintag_map[i].includes("dcshuangjia_tag")) {
						return true;
					}
				}
				return false;
			}
			return player.hasHistory("lose", evt => {
				if (event != evt.getParent()) {
					return false;
				}
				for (var i in evt.gaintag_map) {
					if (evt.gaintag_map[i].includes("dcshuangjia_tag")) {
						return true;
					}
				}
				return false;
			});
		},
		forced: true,
		content() {
			var suits = lib.suit.slice();
			player.countCards("h", card => {
				if (!card.hasGaintag("dcshuangjia_tag")) {
					return false;
				}
				suits.remove(get.suit(card));
			});
			var cards = [];
			while (suits.length) {
				var suit = suits.shift();
				var card = get.cardPile(cardx => {
					return get.suit(cardx, false) == suit;
				});
				if (card) {
					cards.push(card);
				}
			}
			if (cards.length) {
				player.gain(cards, "gain2");
			}
		},
		mod: {
			cardUsable(card, player) {
				var len = player.countCards("h");
				var cnt = player.countCards("h", card => card.hasGaintag("dcshuangjia_tag"));
				if (2 * cnt < len) {
					return Infinity;
				}
			},
			targetInRange(card, player) {
				var len = player.countCards("h");
				var cnt = player.countCards("h", card => card.hasGaintag("dcshuangjia_tag"));
				if (2 * cnt < len) {
					return true;
				}
			},
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("dcshuangjia_tag")) {
					var suits = lib.suit.slice();
					player.countCards("h", cardx => {
						if (!cardx.hasGaintag("dcshuangjia_tag")) {
							return false;
						}
						if (card == cardx) {
							return false;
						}
						suits.remove(get.suit(cardx));
					});
					if (suits.length) {
						return num + suits.length * 2.5;
					}
				}
			},
		},
	},
	//孟优
	dcmanzhi: {
		audio: 2,
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		filter(event, player) {
			if (event.name == "phaseJieshu") {
				var del = 0;
				game.getGlobalHistory("changeHp", evt => {
					if (evt.player != player) {
						return;
					}
					for (var phase of lib.phaseName) {
						var evtx = evt.getParent(phase);
						if (evtx && evtx.name == phase) {
							del += evt.num;
							break;
						}
					}
				});
				if (del != 0) {
					return false;
				}
			}
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				return (!player.hasSkill("dcmanzhi_1") && current.countCards("he")) || (!player.hasSkill("dcmanzhi_2") && current.countCards("hej"));
			});
		},
		direct: true,
		content() {
			"step 0";
			if (_status.connectMode) {
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			}
			player
				.chooseTarget(get.prompt2("dcmanzhi"), (card, player, target) => {
					if (player == target) {
						return false;
					}
					return (
						(!player.hasSkill("dcmanzhi_1") && target.countCards("he")) || (!player.hasSkill("dcmanzhi_2") && target.countCards("hej"))
					);
				})
				.set("ai", target => {
					return 1 - get.attitude(get.player(), target);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				var choices = [];
				var choiceList = [
					"令其交给你两张牌，然后其视为使用一张无距离限制的【杀】",
					"你获得其区域内的至多两张牌，然后交给其等量的牌并摸一张牌",
				];
				var chosen = [player.hasSkill("dcmanzhi_1"), player.hasSkill("dcmanzhi_2")];
				if (target.countCards("he") && (!chosen[0] || trigger.name == "phaseZhunbei")) {
					choices.push("选项一");
				} else {
					choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + (chosen[0] ? "（已被选择过）" : "") + "</span>";
				}
				if (target.countCards("hej") && (!chosen[1] || trigger.name == "phaseZhunbei")) {
					choices.push("选项二");
				} else {
					choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + (chosen[1] ? "（已被选择过）" : "") + "</span>";
				}
				if (trigger.name == "phaseJieshu") {
					choices.push("cancel2");
				}
				player
					.chooseControl(choices)
					.set("choiceList", choiceList)
					.set("ai", () => {
						return _status.event.choice;
					})
					.set(
						"choice",
						(function () {
							if (target.getUseValue({ name: "sha" }, false) > 5 && !player.hasShan() && trigger.name == "phaseZhunbei") {
								return 1;
							}
							return 0;
						})()
					)
					.set("prompt", "蛮智：请选择一项");
			} else {
				if (_status.connectMode) {
					game.broadcastAll(function () {
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				event.finish();
			}
			"step 2";
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			if (result.control == "cancel2") {
				event.finish();
				return;
			}
			player.logSkill("dcmanzhi", target);
			if (result.control == "选项一") {
				player.addTempSkill("dcmanzhi_1");
				target.chooseCard(Math.min(2, target.countCards("he")), "he", "蛮智：请交给" + get.translation(player) + "两张牌", true);
			} else {
				player.addTempSkill("dcmanzhi_2");
				player.gainPlayerCard(target, "hej", [1, 2], true);
				event.goto(5);
			}
			"step 3";
			if (result.bool) {
				target.give(result.cards, player);
			} else {
				event.finish();
			}
			"step 4";
			target.chooseUseTarget("sha", true, "nodistance");
			event.finish();
			"step 5";
			if (result.bool && target.isIn()) {
				var num = result.cards.length,
					hs = player.getCards("he");
				if (!hs.length) {
					event.finish();
				} else if (hs.length < num) {
					event._result = { bool: true, cards: hs };
				} else {
					player.chooseCard("he", true, num, "交给" + get.translation(target) + get.cnNumber(num) + "张牌");
				}
			} else {
				event.finish();
			}
			"step 6";
			if (result.bool) {
				player.give(result.cards, target);
				player.draw();
			}
		},
		subSkill: {
			1: { charlotte: true },
			2: { charlotte: true },
		},
	},
	//孙綝
	dczigu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		selectCard: 1,
		check(card) {
			var player = _status.event.player;
			if (!player.hasSkill("dczuowei")) {
				return 6 - get.value(card);
			}
			if (player.countCards("h") == player.countCards("e") + 1 && !player.hasCard(card => player.hasValueTarget(card), "h")) {
				if (get.position(card) == "e") {
					return 0;
				}
				return 8 - get.value(card);
			}
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			var targets = game.filterPlayer(current => {
				return current.countGainableCards(player, "e");
			});
			if (targets.length == 0) {
				event._result = { bool: false };
			} else if (targets.length == 1) {
				event._result = { bool: true, targets: targets };
			} else {
				player
					.chooseTarget("自固：获得一名角色装备区里的一张牌", true, (card, player, target) => {
						return target.countGainableCards(player, "e");
					})
					.set("ai", target => {
						if (target == _status.event.player) {
							return 10;
						}
						if (get.attitude(_status.event.player, target) < 0) {
							if (
								target.hasCard(card => {
									return get.value(card, player) >= 6;
								})
							) {
								return 12;
							}
							return 8;
						}
						return 0;
					});
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.gainPlayerCard("e", target, true);
			}
			"step 2";
			if (!result.bool || target == player || !result.cards || !result.cards.some(i => get.owner(i) == player)) {
				player.draw();
			}
		},
		ai: {
			order(item, player) {
				if (!player.hasSkill("dczuowei")) {
					return 9;
				}
				if (player.countCards("h") == player.countCards("e") + 1 && !player.hasCard(card => player.hasValueTarget(card), "h")) {
					return 9;
				}
				return 1;
			},
			result: {
				player: 1,
			},
		},
	},
	dczuowei: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			if (_status.currentPhase != player) {
				return false;
			}
			if (!player.hasSkill("dczuowei_ban")) {
				return true;
			}
			return Math.sign(player.countCards("h") - Math.max(1, player.countCards("e"))) >= 0;
		},
		direct: true,
		locked: false,
		content() {
			"step 0";
			var hs = player.countCards("h");
			var es = Math.max(1, player.countCards("e"));
			var sign = Math.sign(hs - es);
			event.sign = sign;
			if (sign > 0) {
				player.chooseBool(get.prompt("dczuowei"), "令" + get.translation(trigger.card) + "不可被响应").set("ai", () => 1);
			} else if (sign == 0) {
				player.chooseTarget(get.prompt("dczuowei"), "对一名其他角色造成1点伤害", lib.filter.notMe).set("ai", target => {
					return get.damageEffect(target, _status.event.player, _status.event.player);
				});
			} else {
				player.chooseBool(get.prompt("dczuowei"), "摸两张牌，然后本回合你不能再触发该分支").set("ai", () => 1);
			}
			"step 1";
			if (!result.bool) {
				event.finish();
			} else if (event.sign <= 0 && !event.isMine() && !event.isOnline()) {
				game.delayx();
			}
			"step 2";
			var sign = event.sign;
			if (sign > 0) {
				player.logSkill("dczuowei");
				trigger.directHit.addArray(game.players);
				event.finish();
			} else if (sign == 0) {
				var target = result.targets[0];
				player.logSkill("dczuowei", target);
				target.damage();
			} else {
				player.logSkill("dczuowei");
				player.draw(2);
				player.addTempSkill("dczuowei_ban");
			}
		},
		subSkill: {
			ban: { charlotte: true },
		},
		mod: {
			aiValue(player, card, num) {
				if (_status.currentPhase != player) {
					return;
				}
				const event = get.event();
				if (!player.isPhaseUsing()) {
					return;
				}
				if (event.type != "phase") {
					return;
				}
				const cardsh = [],
					cardse = [];
				for (const cardx of ui.selected.cards) {
					const pos = get.position(cardx);
					if (pos == "h") {
						cardsh.add(cardx);
					} else if (pos == "e") {
						cardse.add(cardx);
					}
				}
				const hs = player.countCards("h") - cardsh.length,
					es = Math.max(1, player.countCards("e") - cardse.length);
				const delt = hs - es;
				if (delt <= 0) {
					return;
				}
				if (get.position(card) == "h" && delt == 1) {
					return num / 1.25;
				}
			},
			aiUseful() {
				return lib.skill.dczuowei.mod.aiValue.apply(this, arguments);
			},
			aiOrder(player, card, num) {
				if (player.hasSkill("dczuowei_ban") || _status.currentPhase != player) {
					return;
				}
				const cardsh = [],
					cardse = [];
				const pos = get.position(card);
				if (pos == "h") {
					cardsh.add(card);
				} else if (pos == "e") {
					cardse.add(card);
				}
				if (get.tag(card, "draw") || get.tag(card, "gain")) {
					const hs = player.countCards("h") - cardsh.length,
						es = Math.max(1, player.countCards("e") - cardse.length + (get.type(card) == "equip"));
					if ((player.hasSkill("dczuowei_ban") && hs < es) || hs == es) {
						return num + 10;
					}
					return num / 5;
				}
			},
		},
		ai: {
			threaten: 3,
			reverseEquip: true,
			effect: {
				player_use(card, player, target, current) {
					if (_status.currentPhase != player) {
						return;
					}
					let cha = player.countCards("h") - Math.max(1, player.countCards("e"));
					if (cha == 0 || (cha < 0 && !player.hasSkill("dczuowei_ban"))) {
						return [1, 2];
					}
				},
			},
		},
	},
	//刘宠骆俊
	dcminze: {
		audio: 2,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			if (player.getStorage("dcminze_targeted").includes(target)) {
				return false;
			}
			return target.countCards("h") < player.countCards("h");
		},
		filterCard(card, player) {
			if (!ui.selected.cards.length) {
				return true;
			}
			return get.name(ui.selected.cards[0]) != get.name(card);
		},
		selectCard: [1, 2],
		complexCard: true,
		position: "he",
		discard: false,
		lose: false,
		delay: false,
		group: "dcminze_draw",
		content() {
			player.give(cards, target);
			player.addTempSkill("dcminze_targeted", "phaseUseAfter");
			player.markAuto("dcminze_targeted", [target]);
			player.addTempSkill("dcminze_given");
			player.markAuto(
				"dcminze_given",
				cards.map(i => get.name(i, player))
			);
		},
		ai: {
			order: 6.5,
			expose: 0.2,
		},
		subSkill: {
			targeted: { onremove: true, charlotte: true },
			given: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "本回合以此法交出的牌名：$",
				},
			},
			draw: {
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return player.getStorage("dcminze_given").length;
				},
				forced: true,
				locked: false,
				content() {
					var num = Math.min(5, player.getStorage("dcminze_given").length) - player.countCards("h");
					if (num > 0) {
						player.draw(num);
					}
				},
			},
		},
	},
	dcjini: {
		audio: 2,
		trigger: { player: "damageEnd" },
		direct: true,
		filter(event, player) {
			return player.maxHp - player.countMark("dcjini_counted") > 0;
		},
		content() {
			"step 0";
			player
				.chooseCard(get.prompt2("dcjini"), [1, player.maxHp - player.countMark("dcjini_counted")], lib.filter.cardRecastable)
				.set("ai", card => {
					return 6 - get.value(card);
				});
			"step 1";
			if (result.bool) {
				var cards = result.cards;
				player.logSkill("dcjini");
				player.addTempSkill("dcjini_counted");
				player.addMark("dcjini_counted", cards.length, false);
				event.recast = player.recast(cards);
			} else {
				event.finish();
			}
			"step 2";
			if (
				trigger.source &&
				trigger.source.isIn() &&
				player.hasHistory("gain", evt => evt.getParent(2) == event.recast && evt.cards.some(value => get.name(value) == "sha"))
			) {
				player
					.chooseToUse(
						function (card) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						"击逆：是否对" + get.translation(trigger.source) + "使用一张不可被响应的杀？"
					)
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", trigger.source)
					.set("oncard", () => {
						_status.event.directHit.addArray(game.players);
					});
			}
		},
		subSkill: {
			counted: {
				onremove: true,
				charlotte: true,
			},
		},
	},
	//乐綝
	dcporui: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			if (player == event.player) {
				return false;
			}
			if (player.countMark("dcporui_round") >= (player.hasMark("dcgonghu_basic") ? 2 : 1) || player.countCards("h") == 0) {
				return false;
			}
			return (
				game.hasPlayer(current => {
					if (current == player || current == event.player) {
						return false;
					}
					return current.hasHistory("lose", evt => evt.cards2.length);
				}) && player.countCards("he") > 0
			);
		},
		async cost(event, trigger, player) {
			const map = new Map();
			game.countPlayer(current => {
				if (current == player || current == trigger.player) {
					return false;
				}
				if (current.hasHistory("lose", evt => evt.cards2.length)) {
					map.set(
						current,
						Math.min(
							5,
							current.getHistory("lose").reduce((num, evt) => num + evt.cards2.length, 0)
						) + 1
					);
				}
			});
			const next = player
				.chooseCardTarget({
					prompt: get.prompt(event.skill),
					prompt2: get.skillInfoTranslation(event.skill, player, false),
					filterCard: lib.filter.cardDiscardable,
					position: "he",
					filterTarget(card, player, target) {
						return get.event().map.has(target);
					},
					ai1(card) {
						return 7 - get.value(card);
					},
					ai2(target) {
						let player = get.event().player,
							num = get.event().map.get(target),
							eff = get.effect(target, { name: "sha" }, player, player);
						if (num > 1 && eff !== 0) {
							eff -= (10 / target.getHp()) * Math.pow(2, num);
						}
						return eff * num;
					},
				})
				.set("map", map);
			next.set(
				"targetprompt2",
				next.targetprompt2.concat([
					target => {
						if (!target.isIn() || !get.event().filterTarget(null, get.player(), target)) {
							return false;
						}
						return `破锐${get.event().map.get(target)}`;
					},
				])
			);
			event.result = await next.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			player.addTempSkill(event.name + "_round", "roundStart");
			player.addMark(event.name + "_round", 1, false);
			await player.discard(cards);
			const num = Math.min(
				5,
				target.getHistory("lose").reduce((num, evt) => num + evt.cards2.length, 0)
			);
			let count = num + 1;
			const card = get.autoViewAs({ name: "sha", isCard: true, storage: { [event.name]: true } });
			while (count-- && player.canUse(card, target, false) && target.isIn()) {
				await player.useCard(card, target);
			}
			if (!player.hasMark("dcgonghu_damage") && target.isIn() && player.countCards("h") && num) {
				const numx = Math.min(num, player.countCards("h"));
				await player.chooseToGive(target, "h", numx, true, `破锐：交给${get.translation(target)}${get.cnNumber(numx)}张手牌`);
			}
		},
		subSkill: { round: { charlotte: true, onremove: true } },
		ai: {
			expose: 0.4,
			threaten: 3.8,
		},
	},
	dcgonghu: {
		audio: 2,
		trigger: {
			player: ["loseAfter", "damageEnd"],
			source: "damageSource",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			if (event.name == "damage") {
				if (player.hasMark("dcgonghu_damage")) {
					return false;
				}
				var num = 0;
				player.getHistory("damage", evt => (num += evt.num));
				player.getHistory("sourceDamage", evt => (num += evt.num));
				return num > 1;
			}
			if (!_status.currentPhase || _status.currentPhase == player) {
				return false;
			}
			if (player.hasMark("dcgonghu_basic")) {
				return false;
			}
			if (_status.currentPhase && _status.currentPhase == player) {
				return false;
			}
			var evt = event.getl(player);
			if (!evt || !evt.cards2 || !evt.cards2.some(i => get.type2(i, player) == "basic")) {
				return false;
			}
			var num = 0;
			player.getHistory("lose", function (evtx) {
				if (num < 2) {
					if (evtx && evtx.cards2) {
						num += evtx.cards2.filter(i => get.type2(i, player) == "basic").length;
					}
				}
			});
			return num >= 2;
		},
		group: ["dcgonghu_basic", "dcgonghu_trick"],
		content() {
			player.addMark("dcgonghu_" + (trigger.name == "damage" ? "damage" : "basic"), 1, false);
			game.log(player, "修改了技能", "#g【破锐】");
		},
		ai: {
			combo: "dcporui",
		},
		subSkill: {
			trick: {
				audio: "dcgonghu",
				trigger: { player: "useCard2" },
				direct: true,
				locked: true,
				filter(event, player) {
					if (!player.hasMark("dcgonghu_basic") || !player.hasMark("dcgonghu_damage")) {
						return false;
					}
					var card = event.card;
					if (get.color(card, false) != "red" || get.type(card, null, false) != "trick") {
						return false;
					}
					var info = get.info(card);
					if (info.allowMultiple == false) {
						return false;
					}
					if (event.targets && !info.multitarget) {
						if (
							game.hasPlayer(function (current) {
								return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
							})
						) {
							return true;
						}
					}
					return false;
				},
				content() {
					"step 0";
					var prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
					player
						.chooseTarget(get.prompt("dcgonghu_trick"), function (card, player, target) {
							var player = _status.event.player;
							return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
						})
						.set("prompt2", prompt2)
						.set("ai", function (target) {
							var trigger = _status.event.getTrigger();
							var player = _status.event.player;
							return get.effect(target, trigger.card, player, player);
						})
						.set("card", trigger.card)
						.set("targets", trigger.targets);
					"step 1";
					if (result.bool) {
						if (!event.isMine() && !event.isOnline()) {
							game.delayx();
						}
						event.targets = result.targets;
					} else {
						event.finish();
					}
					"step 2";
					if (event.targets) {
						player.logSkill("dcgonghu_trick", event.targets);
						trigger.targets.addArray(event.targets);
					}
				},
			},
			basic: {
				audio: "dcgonghu",
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					if (!player.hasMark("dcgonghu_basic") || !player.hasMark("dcgonghu_damage")) {
						return false;
					}
					var card = event.card;
					return get.color(card, false) == "red" && get.type(card, null, false) == "basic";
				},
				content() {
					trigger.directHit.addArray(game.filterPlayer());
					game.log(trigger.card, "不可被响应");
				},
			},
		},
	},
	//张闿
	dcxiangshu: {
		audio: 2,
		trigger: { global: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return event.player != player && event.player.countCards("h") >= event.player.hp;
		},
		content() {
			"step 0";
			var list = [0, 1, 2, 3, 4, 5, "cancel2"];
			player
				.chooseControl(list)
				.set("prompt", get.prompt2("dcxiangshu"))
				.set("ai", () => {
					return _status.event.choice;
				})
				.set(
					"choice",
					(function () {
						if (get.attitude(player, trigger.player) > 0) {
							return "cancel2";
						}
						var cards = trigger.player.getCards("h");
						var num = 0;
						for (var card of cards) {
							if (!trigger.player.hasValueTarget(card)) {
								num++;
								if (num >= 5) {
									break;
								}
							}
						}
						if (cards.length >= 3 && Math.random() < 0.5) {
							num = Math.max(0, num - 1);
						}
						return num;
					})()
				);
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("dcxiangshu", trigger.player);
				var num = result.index;
				player.storage.dcxiangshu_lottery = num;
				player.addTempSkill("dcxiangshu_lottery", "phaseUseAfter");
			} else {
				event.finish();
			}
			"step 2";
			player.chooseToDiscard("相鼠：是否弃置一张牌不公布此数字？").set("ai", card => 2 - get.value(card));
			"step 3";
			if (!result.bool) {
				var num = player.storage.dcxiangshu_lottery;
				player.markSkill("dcxiangshu_lottery");
				player.popup(num);
				game.log(player, "选择了数字", "#g" + num);
			}
		},
		subSkill: {
			lottery: {
				audio: "dcxiangshu",
				trigger: { global: "phaseUseEnd" },
				charlotte: true,
				forced: true,
				onremove: true,
				logTarget: "player",
				filter(event, player) {
					return (
						typeof player.storage.dcxiangshu_lottery == "number" &&
						Math.abs(event.player.countCards("h") - player.storage.dcxiangshu_lottery) <= 1
					);
				},
				content() {
					var delt = Math.abs(trigger.player.countCards("h") - player.storage.dcxiangshu_lottery);
					if (delt <= 1 && trigger.player.countGainableCards("he", player) > 0) {
						player.gainPlayerCard(trigger.player, "he", true);
					}
					if (delt == 0) {
						trigger.player.damage(player);
					}
				},
				intro: { content: "猜测的数字为#" },
			},
		},
	},
	//裴元绍
	dcmoyu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => lib.skill.dcmoyu.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return player != target && !player.getStorage("dcmoyu_clear").includes(target) && target.countGainableCards(player, "hej");
		},
		async content(event, trigger, player) {
			const target = event.target;
			player.addTempSkill("dcmoyu_clear", "phaseUseAfter");
			player.markAuto("dcmoyu_clear", [target]);
			await player.gainPlayerCard(target, "hej", true, 1 + player.hasSkill("dcmoyu_add"));
			player.removeSkill("dcmoyu_add");
			const num = player.getStorage("dcmoyu_clear").length;
			const result = await target
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					"是否对" + get.translation(player) + "使用一张无距离限制的【杀】？"
				)
				.set("targetRequired", true)
				.set("complexTarget", true)
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("sourcex", player)
				.forResult();
			if (result.bool) {
				if (
					player.hasHistory("damage", evt => {
						return evt.card && evt.card.name == "sha" && evt.getParent(4) == event;
					})
				) {
					player.tempBanSkill("dcmoyu");
					player.addTempSkill("dcmoyu_ban");
				} else {
					player.addTempSkill("dcmoyu_add", "phaseChange");
				}
			}
		},
		global: "dcmoyu_ai",
		subSkill: {
			clear: {
				charlotte: true,
				onremove: true,
			},
			ban: {
				charlotte: true,
				mark: true,
				marktext: '<span style="text-decoration: line-through;">欲</span>',
				intro: { content: "偷马贼被反打了！" },
			},
			add: {
				charlotte: true,
				mark: true,
				marktext: "欲",
				intro: { content: "欲望加速，下次抢两张！" },
			},
			ai: {
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.type(card) == "delay" && current < 0) {
								var currentx = _status.currentPhase;
								if (!currentx || !currentx.isIn()) {
									return;
								}
								var list = game.filterPlayer(current => {
									if (current == target) {
										return true;
									}
									if (!current.hasSkill("dcmoyu")) {
										return false;
									}
									if (current.hasJudge("lebu")) {
										return false;
									}
									return get.attitude(current, target) > 0;
								});
								list.sortBySeat(currentx);
								if (list.indexOf(target) != 0) {
									return "zerotarget";
								}
							}
						},
					},
				},
			},
		},
		ai: {
			order: 9,
			threaten: 2.4,
			result: {
				target(player, target) {
					var num = get.sgn(get.attitude(player, target));
					var eff = get.effect(target, { name: "shunshou" }, player, player) * num;
					if (eff * num > 0) {
						return eff / 10;
					}
					if (
						player.hasShan() &&
						!target.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: player,
								card: { name: "sha" },
							},
							true
						)
					) {
						return eff;
					}
					if (
						target.hasSha() &&
						player.hp +
							player.countCards("hs", function (card) {
								var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
								if (mod2 != "unchanged") {
									return mod2;
								}
								var mod = game.checkMod(card, player, player, "unchanged", "cardSavable", player);
								if (mod != "unchanged") {
									return mod;
								}
								var savable = get.info(card).savable;
								if (typeof savable == "function") {
									savable = savable(card, player, player);
								}
								return savable;
							}) <=
							1
					) {
						return 0;
					}
					return eff;
				},
			},
		},
	},
	oldmoyu: {
		audio: "dcmoyu",
		init: () => {
			game.addGlobalSkill("oldmoyu_ai");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("oldmoyu", null, null, false), true)) {
				game.removeGlobalSkill("oldmoyu_ai");
			}
		},
		enable: "phaseUse",
		filter(event, player) {
			return !player.hasSkill("oldmoyu_ban") && game.hasPlayer(current => lib.skill.oldmoyu.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return player != target && !player.getStorage("oldmoyu_clear").includes(target) && target.countGainableCards(player, "hej");
		},
		content() {
			"step 0";
			player.addTempSkill("oldmoyu_clear");
			player.markAuto("oldmoyu_clear", [target]);
			player.gainPlayerCard(target, "hej", true);
			"step 1";
			var num = player.getStorage("oldmoyu_clear").length;
			target
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					"是否对" + get.translation(player) + "使用一张无距离限制的【杀】（伤害基数为" + num + "）？"
				)
				.set("targetRequired", true)
				.set("complexTarget", true)
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("sourcex", player)
				.set("num", num)
				.set("oncard", card => {
					_status.event.baseDamage = _status.event.getParent().num;
				});
			"step 2";
			if (result.bool) {
				if (
					player.hasHistory("damage", evt => {
						return evt.card && evt.card.name == "sha" && evt.getParent(4) == event;
					})
				) {
					player.addTempSkill("oldmoyu_ban");
				}
			}
		},
		subSkill: {
			clear: {
				charlotte: true,
				onremove: true,
			},
			ban: {
				charlotte: true,
				mark: true,
				marktext: "欲",
				intro: { content: "偷马贼被反打了！" },
			},
			ai: {
				trigger: { player: "dieAfter" },
				filter: () => {
					return !game.hasPlayer(i => i.hasSkill("oldmoyu", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				content: () => {
					game.removeGlobalSkill("oldmoyu_ai");
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.type(card) == "delay" && current < 0) {
								var currentx = _status.currentPhase;
								if (!currentx || !currentx.isIn()) {
									return;
								}
								var list = game.filterPlayer(current => {
									if (current == target) {
										return true;
									}
									if (!current.hasSkill("oldmoyu")) {
										return false;
									}
									if (current.hasJudge("lebu")) {
										return false;
									}
									return get.attitude(current, target) > 0;
								});
								list.sortBySeat(currentx);
								if (list.indexOf(target) != 0) {
									return "zerotarget";
								}
							}
						},
					},
				},
			},
		},
		ai: {
			order: 9,
			threaten: 2.4,
			result: {
				target(player, target) {
					var num = get.sgn(get.attitude(player, target));
					var eff = get.effect(target, { name: "shunshou" }, player, player) * num;
					if (eff * num > 0) {
						return eff / 10;
					}
					if (
						player.hasShan() &&
						!target.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: player,
								card: { name: "sha" },
							},
							true
						)
					) {
						return eff;
					}
					if (
						target.hasSha() &&
						player.hp +
							player.countCards("hs", function (card) {
								var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
								if (mod2 != "unchanged") {
									return mod2;
								}
								var mod = game.checkMod(card, player, player, "unchanged", "cardSavable", player);
								if (mod != "unchanged") {
									return mod;
								}
								var savable = get.info(card).savable;
								if (typeof savable == "function") {
									savable = savable(card, player, player);
								}
								return savable;
							}) <=
							player.getStorage("oldmoyu_clear").length + 1
					) {
						return 0;
					}
					return eff;
				},
			},
		},
	},
	//张楚
	dcjizhong: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		selectTarget: 1,
		async content(event, trigger, player) {
			const target = event.target;
			await target.draw(2);
			if (!target.hasMark("dcjizhong")) {
				const result = await target
					.chooseBool(`集众：令${get.translation(player)}获得你三张牌，或点击“取消”获得“信众”标记`)
					.set("ai", () => false)
					.forResult();
				if (!result.bool) {
					target.addMark("dcjizhong", 1);
					return;
				}
			}
			let num = Math.min(target.countCards("he"), 3);
			if (num > 0) {
				await player.gainPlayerCard(target, "he", num, true);
			}
		},
		marktext: "信",
		intro: {
			name: "信众",
			name2: "信众",
			markcount: () => 0,
			content: "已成为信徒",
		},
		ai: {
			order: 9.5,
			result: {
				target(player, target) {
					var num = target.countCards("h");
					if (num <= 1) {
						return -num;
					}
					if (get.attitude(player, target) > 0 && !target.hasMark("dcjizhong")) {
						return 1;
					}
					return -1 / (num / 2 + 1);
				},
			},
		},
	},
	dcrihui: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		usable: 1,
		filter(event, player) {
			if (!event.targets || event.targets.length != 1 || event.targets[0] == player) {
				return false;
			}
			var card = event.card;
			var target = event.targets[0];
			var marked = target.hasMark("dcjizhong");
			return (
				(get.type(card) == "trick" || (get.color(card) == "black" && get.type(card) == "basic")) &&
				((marked && target.countGainableCards(player, "hej")) || (!marked && game.hasPlayer(current => current.hasMark("dcjizhong"))))
			);
		},
		logTarget: event => event.targets[0],
		prompt2(event, player) {
			const target = event.targets[0];
			if (target.hasMark("dcjizhong")) {
				return "获得该角色区域内的一张牌";
			} else {
				const card = { name: event.card.name, nature: event.card.nature, isCard: true };
				return "令所有有“信众”的角色依次视为对其使用一张" + get.translation(card);
			}
		},
		check(event, player) {
			const target = event.targets[0];
			if (target.hasMark("dcjizhong")) {
				return get.effect(target, { name: "shunshou_copy" }, player, player) > 0;
			} else {
				const card = { name: event.card.name, nature: event.card.nature, isCard: true };
				let eff = 0;
				game.countPlayer(current => {
					if (!current.hasMark("dcjizhong") || !current.canUse(card, player, false)) {
						return;
					}
					eff += get.effect(target, card, current, player);
				});
				return eff > 0;
			}
		},
		async content(event, trigger, player) {
			const target = trigger.targets[0];
			if (target.hasMark("dcjizhong")) {
				await player.gainPlayerCard(target, "hej", true);
			} else {
				const card = { name: trigger.card.name, nature: trigger.card.nature, isCard: true };
				const targets = game.filterPlayer(current => current.hasMark("dcjizhong")).sortBySeat(_status.currentPhase);
				for (const current of targets) {
					if (target.isIn() && current.isIn() && current.canUse(card, target, false)) {
						await current.useCard(card, target, false);
					}
				}
			}
		},
		ai: {
			combo: "dcjizhong",
		},
	},
	dcguangshi: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return !game.hasPlayer(current => current != player && !current.hasMark("dcjizhong"));
		},
		forced: true,
		content() {
			player.draw(game.filterPlayer().reduce((sum, current) => (sum += current.countMark("dcjizhong")), 0));
			player.loseHp();
		},
		ai: {
			combo: "dcjizhong",
			halfneg: true,
		},
	},
	//董绾
	dcshengdu: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("dcshengdu"), lib.filter.notMe).set("ai", target => {
				var player = _status.event.player;
				var att = get.attitude(player, target);
				var eff = get.effect(
					target,
					{
						name: "sha",
						storage: { dcjieling: true },
					},
					player,
					player
				);
				var value = att / 5;
				if (value < 0) {
					value = -value / 1.3;
				}
				value = Math.max(value - eff / 20, 0.01);
				return value;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dcshengdu", target);
				target.addMark("dcshengdu", 1);
			}
		},
		intro: { content: "mark" },
		group: "dcshengdu_effect",
		subSkill: {
			effect: {
				audio: "dcshengdu",
				trigger: { global: "gainAfter" },
				filter(event, player) {
					return event.getParent(2).name == "phaseDraw" && event.player.hasMark("dcshengdu");
				},
				forced: true,
				logTarget: "player",
				content() {
					var num = trigger.player.countMark("dcshengdu");
					player.draw(num * trigger.cards.length);
					trigger.player.removeMark("dcshengdu", num);
				},
			},
		},
	},
	dcjieling: {
		audio: 2,
		enable: "phaseUse",
		position: "hs",
		viewAs: {
			name: "sha",
			storage: { dcjieling: true },
		},
		filterCard(card, player) {
			if (player.getStorage("dcjieling_count").includes(get.suit(card))) {
				return false;
			}
			if (ui.selected.cards.length) {
				return get.suit(card) != get.suit(ui.selected.cards[0]);
			}
			return true;
		},
		selectCard: 2,
		complexCard: true,
		check(card) {
			return 6 - get.value(card);
		},
		precontent() {
			player.addTempSkill("dcjieling_after");
			event.getParent().addCount = false;
			player.addTempSkill("dcjieling_count", "phaseUseAfter");
			player.markAuto(
				"dcjieling_count",
				event.result.cards.reduce((list, card) => list.add(get.suit(card, player)), [])
			);
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }) + 0.1;
			},
		},
		locked: false,
		mod: {
			targetInRange(card) {
				if (card.storage && card.storage.dcjieling) {
					return true;
				}
			},
			cardUsable(card, player, num) {
				if (card.storage && card.storage.dcjieling) {
					return Infinity;
				}
			},
		},
		subSkill: {
			after: {
				charlotte: true,
				audio: "dcjieling",
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					return event.card.name == "sha" && event.card.storage && event.card.storage.dcjieling;
				},
				direct: true,
				content() {
					"step 0";
					var damaged = game.hasPlayer2(current => {
						return current.hasHistory("damage", evt => evt.card == trigger.card);
					});
					var targets = trigger.targets.filter(i => i.isIn());
					player.logSkill("dcjieling_after", targets);
					if (damaged) {
						for (var target of targets) {
							target.loseHp();
						}
					} else {
						for (var target of targets) {
							target.addMark("dcshengdu", 1);
						}
					}
				},
			},
			count: {
				intro: {
					content(s, p) {
						let str = "此阶段已转化过的卡牌花色：";
						for (let i = 0; i < s.length; i++) {
							str += get.translation(s[i]);
						}
						return str;
					},
				},
				charlotte: true,
				onremove: true,
			},
		},
	},
	//袁胤
	dcmoshou: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return get.color(event.card) == "black" && player.maxHp > player.countMark("dcmoshou");
		},
		frequent: true,
		prompt2(event, player) {
			const num = player.maxHp - player.countMark("dcmoshou");
			let info = "摸" + get.cnNumber(num) + "张牌";
			if (num === 1) {
				info += "，然后重置【墨守】摸牌数";
			} else if (num > 1) {
				info += "，然后令你下次以此法摸的牌数-1";
			}
			return info;
		},
		async content(event, trigger, player) {
			const { name: mark } = event;
			let num = player.maxHp - player.countMark(mark);
			if (num > 0) {
				await player.draw(num);
			}
			if (num > 1) {
				player.addMark(mark, 1, false);
			} else if (num === 1) {
				player.clearMark(mark, false);
			}
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (typeof card === "object" && get.color(card) === "black") {
						const num = target.maxHp - target.countMark("dcmoshou");
						return [1, 0.6 * num];
					}
				},
			},
		},
		onremove: true,
		mark: true,
		intro: {
			markcount: (storage, player) => player.maxHp - player.countMark("dcmoshou"),
			content: (storage, player) => `下次【墨守】摸牌数：${player.maxHp - player.countMark("dcmoshou")}`,
		},
	},
	dcyunjiu: {
		audio: 2,
		trigger: { global: "dieAfter" },
		getCards(event, player) {
			const cards = [];
			const evt = player.getHistory("lose", evtx => evtx.getParent(2) == event)[0];
			return evt ? cards.addArray(evt.hs).addArray(evt.es).filterInD("d") : [];
		},
		filter(event, player) {
			return get.info("dcyunjiu").getCards(event, event.player).length;
		},
		async cost(event, trigger, player) {
			const { player: target } = trigger,
				cards = get.info(event.skill).getCards(trigger, target);
			let result;
			if (cards.length > 1) {
				result = await player
					.chooseCardButton("运柩：请选择要分配的牌", cards)
					.set("ai", button => {
						const player = get.player(),
							{ link } = button;
						if (!game.hasPlayer(current => player != current && get.attitude(player, current)) > 0) {
							return 6.5 - get.value(link);
						}
						return get.value(link);
					})
					.forResult();
			} else if (cards.length === 1) {
				result = { bool: true, links: cards.slice(0) };
			} else {
				return;
			}
			if (!result.bool) {
				return;
			}
			const toGive = result.links.slice(0);
			result = await player
				.chooseTarget("选择一名其他角色获得" + get.translation(toGive), lib.filter.notMe)
				.set("ai", target => {
					const { player, enemy } = get.event();
					const att = get.attitude(player, target);
					if (enemy) {
						return -att;
					} else if (att > 0) {
						return att / (1 + target.countCards("h"));
					} else {
						return Math.max(0.1, att) / 100;
					}
				})
				.set("enemy", get.value(toGive[0], player, "raw") < 0)
				.forResult();
			event.result = {
				bool: result.bool,
				targets: result.targets,
				cost_data: toGive,
			};
		},
		async content(event, trigger, player) {
			const {
				cost_data: cards,
				targets: [target],
			} = event;
			player.line(target, "green");
			await target.gain(cards, "gain2").set("giver", player);
			await player.gainMaxHp();
			await player.recover();
		},
	},
	//高翔
	dcchiying: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.hp <= player.hp;
		},
		async content(event, tirgger, player) {
			const target = event.target,
				targets = [player];
			while (game.hasPlayer(current => target.inRange(current) && !targets.includes(current))) {
				const result = await target
					.chooseTarget("驰应：是否弃置攻击范围内一名角色一张牌？", function (card, player, target) {
						return _status.event.player.inRange(target) && !_status.event.targets.includes(target);
					})
					.set("targets", targets)
					.set("ai", function (target) {
						return get.effect(target, { name: "guohe_copy2" }, _status.event.player, _status.event.player);
					})
					.forResult();
				if (result.bool) {
					target.line(result.targets, "green");
					await target.discardPlayerCard(result.targets[0], true, "he");
					targets.addArray(result.targets);
				} else {
					break;
				}
			}
			if (target != player) {
				let cards = [];
				game.getGlobalHistory("cardMove", evt => {
					if (evt.getParent(3) == event) {
						cards.addArray(evt.cards.filter(card => get.type(card) == "basic"));
					}
				});
				cards = cards.filterInD("d");
				if (cards.length) {
					target.gain(cards, "gain2");
				}
			}
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					var targets = game.filterPlayer(current => target.inRange(current) && current != player);
					var eff = 0;
					for (var targetx of targets) {
						var effx = get.effect(targetx, { name: "guohe_copy2" }, player, target);
						if (get.attitude(player, targetx) < 0) {
							effx /= 2;
						}
						eff += effx;
					}
					return (target == player ? 0.5 : 1) * eff * (get.attitude(player, target) <= 0 ? 0.75 : 1);
				},
			},
		},
	},
	//霍峻
	dcgue: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (player.hasSkill("dcgue_blocker", null, null, false)) {
				return false;
			}
			return name == "sha" || name == "shan";
		},
		filter(event, player) {
			if (event.dcgue || event.type == "wuxie" || player == _status.currentPhase) {
				return false;
			}
			if (player.hasSkill("dcgue_blocker", null, null, false)) {
				return false;
			}
			for (var name of ["sha", "shan"]) {
				if (event.filterCard({ name: name, isCard: true }, player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var vcards = [];
				for (var name of ["sha", "shan"]) {
					var card = { name: name, isCard: true };
					if (event.filterCard(card, player, event)) {
						vcards.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("孤扼", [vcards, "vcard"], "hidden");
			},
			check(button) {
				if (_status.event.player.countCards("h", { name: ["sha", "shan"] }) > 1) {
					return 0;
				}
				return 1;
			},
			backup(links, player) {
				return {
					filterCard: () => false,
					selectCard: -1,
					viewAs: {
						name: links[0][2],
						isCard: true,
					},
					log: false,
					popname: true,
					precontent() {
						"step 0";
						player.logSkill("dcgue");
						player.addTempSkill("dcgue_blocker");
						if (player.countCards("h")) {
							player.showHandcards();
						}
						"step 1";
						if (player.countCards("h", { name: ["sha", "shan"] }) > 1) {
							var evt = event.getParent();
							evt.set("dcgue", true);
							evt.goto(0);
							delete evt.openskilldialog;
							return;
						}
						game.delayx();
					},
				};
			},
			prompt(links, player) {
				return (
					(player.countCards ? "展示所有手牌" : "") +
					(player.countCards("h", { name: ["sha", "shan"] }) <= 1 ? "，然后视为使用【" + get.translation(links[0][2]) + "】" : "")
				);
			},
		},
		subSkill: { blocker: { charlotte: true } },
		ai: {
			order: 1,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (player.hasSkill("dcgue_blocker", null, null, false)) {
					return false;
				}
			},
			result: {
				player(player) {
					if (player.countCards("h", { name: ["sha", "shan"] }) > 1) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	dcsigong: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (event.player == player || !event.player.isIn()) {
				return false;
			}
			if (!player.canUse("sha", event.player, false)) {
				return false;
			}
			var respondEvts = [];
			game.countPlayer2(current => respondEvts.addArray(current.getHistory("useCard")).addArray(current.getHistory("respond")));
			respondEvts = respondEvts.filter(i => i.respondTo).map(evt => evt.respondTo);
			return event.player.hasHistory("useCard", evt => {
				return respondEvts.some(list => list[1] == evt.card);
			});
		},
		direct: true,
		content() {
			"step 0";
			var num = 1 - player.countCards("h");
			event.num = num;
			var prompt2 = "";
			if (num >= 0) {
				var next = player.chooseBool().set("ai", () => _status.event.goon);
				prompt2 += (num > 0 ? "摸一张牌，" : "") + "视为对" + get.translation(trigger.player) + "使用一张【杀】（伤害基数+1）";
			} else {
				var next = player
					.chooseToDiscard(-num, "allowChooseAll")
					.set("ai", card => {
						if (_status.event.goon) {
							return 5.2 - get.value(card);
						}
						return 0;
					})
					.set("logSkill", ["dcsigong", trigger.player]);
				prompt2 += "将手牌数弃置至1，视为对" + get.translation(trigger.player) + "使用一张【杀】（伤害基数+1）";
			}
			next.set("prompt", get.prompt("dcsigong", trigger.player));
			next.set("prompt2", prompt2);
			next.set("goon", get.effect(trigger.player, { name: "sha" }, player, player) > 0);
			"step 1";
			if (result.bool) {
				if (num >= 0) {
					player.logSkill("dcsigong", trigger.player);
				}
				if (num > 0) {
					player.draw(num, "nodelay");
				}
				event.num = Math.max(1, Math.abs(num));
			} else {
				event.finish();
			}
			"step 2";
			if (player.canUse("sha", trigger.player, false)) {
				player.addTempSkill("dcsigong_check");
				player
					.useCard({ name: "sha", isCard: true }, trigger.player, false)
					.set("shanReq", num)
					.set("oncard", card => {
						var evt = _status.event;
						evt.baseDamage++;
						for (var target of game.filterPlayer(null, null, true)) {
							var id = target.playerid;
							var map = evt.customArgs;
							if (!map[id]) {
								map[id] = {};
							}
							map[id].shanRequired = evt.shanReq;
						}
					});
			}
		},
		subSkill: {
			check: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { source: "damageSource" },
				filter(event, player) {
					return event.card && event.card.name == "sha" && event.getParent(3).name == "dcsigong";
				},
				content() {
					player.tempBanSkill("dcsigong", "roundStart");
				},
			},
		},
	},
	//孙寒华
	dchuiling: {
		audio: 2,
		trigger: { player: "useCard" },
		forced: true,
		direct: true,
		filter() {
			return ui.discardPile.childNodes.length > 0;
		},
		onremove: true,
		mark: true,
		marktext: "灵",
		intro: {
			name2: "灵",
			mark(dialog, storage, player) {
				dialog.addText("共有" + (storage || 0) + "个标记");
				dialog.addText("注：图标的颜色代表弃牌堆中较多的颜色");
			},
		},
		global: "dchuiling_hint",
		content() {
			"step 0";
			var mark = false;
			var red = 0,
				black = 0;
			for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
				var color = get.color(ui.discardPile.childNodes[i]);
				if (color == "red") {
					red++;
				}
				if (color == "black") {
					black++;
				}
			}
			if (red == black) {
				event.finish();
			} else if (red > black) {
				player.logSkill("dchuiling");
				player.recover();
				event.finish();
				if (get.color(trigger.card) == "black") {
					mark = true;
				}
				event.logged = true;
			} else {
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
				player
					.chooseTarget(get.prompt("dchuiling"), "弃置一名角色的一张牌", (card, player, target) => {
						return target.countDiscardableCards(player, "he") > 0;
					})
					.set("ai", target => {
						return get.effect(target, { name: "guohe_copy2" }, _status.event.player);
					});
				if (get.color(trigger.card) == "red") {
					mark = true;
				}
			}
			if (mark) {
				if (!event.logged) {
					player.logSkill("dchuiling");
				}
				player.addMark("dchuiling", 1);
				event.logged = true;
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				if (!event.logged) {
					player.logSkill("dchuiling", target);
				} else {
					player.line(target);
				}
				player.discardPlayerCard(target, "he", true);
			}
		},
		subSkill: {
			hint: {
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
				},
				forced: true,
				popup: false,
				lastDo: true,
				forceDie: true,
				forceOut: true,
				filter(event, player) {
					if (event._dchuiling_checked) {
						return false;
					}
					event._dchuiling_checked = true;
					var cards = event.getd();
					if (!cards.filterInD("d").length) {
						return false;
					}
					return true;
				},
				markColor: [
					["rgba(241, 42, 42, 0.75)", "black"],
					["", ""],
					["rgba(18, 4, 4, 0.75)", "rgb(200, 200, 200)"],
				],
				content() {
					"step 0";
					var red = 0,
						black = 0;
					for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
						var color = get.color(ui.discardPile.childNodes[i]);
						if (color == "red") {
							red++;
						}
						if (color == "black") {
							black++;
						}
					}
					if (trigger.name.indexOf("lose") == 0) {
						var cards = trigger.getd().filterInD("d");
						for (var i = 0; i < cards.length; i++) {
							var color = get.color(cards[i]);
							if (color == "red") {
								red++;
							}
							if (color == "black") {
								black++;
							}
						}
					}
					game.broadcastAll(
						function (ind) {
							var bgColor = lib.skill.dchuiling_hint.markColor[ind][0],
								text = '<span style="color: ' + lib.skill.dchuiling_hint.markColor[ind][1] + '">灵</span>';
							for (var player of game.players) {
								if (player.marks.dchuiling) {
									player.marks.dchuiling.firstChild.style.backgroundColor = bgColor;
									player.marks.dchuiling.firstChild.innerHTML = text;
								}
							}
						},
						Math.sign(black - red) + 1
					);
				},
			},
		},
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) != "card") {
					return;
				}
				var len = ui.discardPile.childNodes.length;
				if (!len) {
					var type = get.type(card);
					if (type == "basic" || type == "trick") {
						if (player.getDamagedHp() > 0) {
							return num + (get.color(card) == "red" ? 15 : 10);
						}
						return num + 10;
					}
					return;
				}
				if (len > 40) {
					return;
				}
				var red = 0,
					black = 0;
				for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
					var color = get.color(ui.discardPile.childNodes[i]);
					if (color == "red") {
						red++;
					}
					if (color == "black") {
						black++;
					}
				}
				if (red == black) {
					var type = get.type(card);
					if (type == "basic" || type == "trick") {
						if (player.getDamagedHp() > 0) {
							return num + (get.color(card) == "red" ? 15 : 10);
						}
						return num + 10;
					}
					return;
				} else {
					var color = get.color(card);
					if ((color == "red" && red < black) || (color == "black" && red > black)) {
						return num + 10;
					}
				}
			},
		},
	},
	dcchongxu: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		derivation: ["dctaji", "dcqinghuang"],
		manualConfirm: true,
		prompt() {
			return (
				"限定技。你可以失去〖汇灵〗，增加" +
				Math.min(game.countPlayer(), _status.event.player.countMark("dchuiling")) +
				"点体力上限，然后获得〖踏寂〗和〖清荒〗。"
			);
		},
		filter(event, player) {
			return player.countMark("dchuiling") >= 4;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.removeSkills("dchuiling");
			player.gainMaxHp(Math.min(game.countPlayer(), player.countMark("dchuiling")));
			"step 1";
			player.addSkills(["dctaji", "dcqinghuang"]);
		},
		ai: {
			combo: "dchuiling",
			order(itemp, player) {
				if (
					player.hasCard(card => {
						return get.type(card) != "equip" && player.getUseValue(card) > 1;
					}, "h")
				) {
					return 12;
				}
				return 0.1;
			},
			result: {
				player(player) {
					var count = player.countMark("dchuiling");
					if (count >= game.countPlayer() - 1) {
						return 1;
					}
					return count >= 6 || player.hp <= 2 ? 1 : 0;
				},
			},
		},
	},
	dctaji: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			var evt = event.getl(player);
			return evt && evt.hs && evt.hs.length;
		},
		content() {
			"step 0";
			var evt = trigger.getParent();
			var effects = [
				[
					"useCard",
					function () {
						"step 0";
						var targets = game.filterPlayer(current => {
							return current.countDiscardableCards(player, "he") && current != player;
						});
						if (!targets.length) {
							event.finish();
						} else {
							player
								.chooseTarget("踏寂：弃置其他角色一张牌", true, (card, player, target) => {
									return _status.event.targets.includes(target);
								})
								.set("targets", targets)
								.set("ai", target => {
									return get.effect(target, { name: "guohe_copy2" }, _status.event.player);
								});
						}
						"step 1";
						if (result.bool) {
							var target = result.targets[0];
							player.line(target);
							player.discardPlayerCard(target, "he", true);
						}
					},
				],
				[
					"respond",
					function () {
						player.draw();
					},
				],
				[
					"discard",
					function () {
						player.recover();
					},
				],
				[
					"other",
					function () {
						player.addSkill("dctaji_damage");
						player.addMark("dctaji_damage", 1, false);
						game.log(player, "下一次对其他角色造成的伤害", "#g+1");
					},
				],
			];
			var name = evt.name;
			if (trigger.name == "loseAsync") {
				name = evt.type;
			}
			var list = ["useCard", "respond", "discard", "other"];
			if (!list.includes(name)) {
				name = "other";
			}
			for (var i = 0; i < 1 + player.countMark("dcqinghuang_add"); i++) {
				if (!list.length) {
					break;
				}
				if (!list.includes(name)) {
					name = list.randomRemove(1)[0];
				}
				if (name == "useCard") {
					list.remove("useCard");
				}
				for (var effect of effects) {
					if (effect[0] == name) {
						list.remove(name);
						var next = game.createEvent("dctaji_" + name);
						next.player = player;
						next.setContent(effect[1]);
						break;
					}
				}
			}
		},
		subSkill: {
			damage: {
				audio: "dctaji",
				trigger: { source: "damageBegin1" },
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return event.player != player;
				},
				content() {
					trigger.num += player.countMark("dctaji_damage");
					player.removeSkill("dctaji_damage");
				},
				intro: {
					content: "下次对其他角色造成伤害时，此伤害+#",
				},
			},
		},
	},
	dcqinghuang: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.maxHp > 1;
		},
		check(event, player) {
			var num1 = player.countCards("h");
			var num2 = player.countCards("h", card => player.hasValueTarget(card));
			var num3 = player.getHandcardLimit();
			if (player.isDamaged()) {
				return num2 > 1 || num1 - num2 - num3 > 0;
			} else {
				return num2 > 2 + Math.max(0, 3 - player.hp) || (player.hp > 2 && num1 - num2 - num3 > 2);
			}
		},
		content() {
			player.loseMaxHp();
			player.addTempSkill("dcqinghuang_add");
			player.addMark("dcqinghuang_add", 1, false);
		},
		ai: {
			combo: "dctaji",
		},
		subSkill: {
			add: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//孟节
	dcyinlu: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		derivation: ["dcyinlu_lequan", "dcyinlu_huoxi", "dcyinlu_zhangqi", "dcyinlu_yunxiang"],
		global: ["dcyinlu_lequan", "dcyinlu_huoxi", "dcyinlu_zhangqi", "dcyinlu_yunxiang"],
		group: "dcyinlu_move",
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		hasMark(target) {
			return lib.skill.dcyinlu.derivation.some(i => target.hasMark(i));
		},
		content() {
			"step 0";
			event.marks = lib.skill.dcyinlu.derivation.slice(0, 3);
			if (game.countPlayer() <= 2) {
				event.goto(3);
			}
			"step 1";
			player
				.chooseTarget("引路：令三名角色分别获得〖引路〗标记", true, 3)
				.set("targetprompt", () => {
					return get.translation(lib.skill.dcyinlu.derivation[ui.selected.targets.length - 1]);
				})
				.set("complexSelect", true)
				.set("ai", target => {
					var player = _status.event.player;
					if (ui.selected.targets.length == 2) {
						return get.effect(target, { name: "losehp" }, player, player);
					}
					return get.attitude(player, target);
				});
			"step 2";
			if (result.bool) {
				var targets = result.targets;
				player.line(targets);
				for (var i = 0; i < targets.length; i++) {
					targets[i].addMark(event.marks[i]);
					if (player != targets[i] && targets[i].identityShown) {
						if (get.mode() != "identity" || player.identity != "nei") {
							player.addExpose(0.3);
						}
					}
				}
			}
			event.goto(5);
			"step 3";
			player.logSkill("dcyinlu", game.players);
			var list = [];
			for (var mark of event.marks) {
				list.push([
					mark,
					'<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' +
						get.translation(mark) +
						"】</div><div>" +
						lib.translate[mark + "_info"] +
						"</div></div>",
				]);
			}
			var target = game.filterPlayer(i => i != player)[0];
			if (!game.hasPlayer(current => current != player)) {
				target = player;
			}
			event.target = target;
			player
				.chooseButton(["引路：令" + get.translation(target) + "获得2枚〖引路〗标记", [list, "textbutton"]])
				.set("ai", button => {
					var mark = button.link;
					if (mark == "dcyinlu_lequan") {
						return 9;
					}
					if (mark == "dcyinlu_zhangqi") {
						return 10;
					}
					return 8;
				})
				.set("forced", true)
				.set("selectButton", 2)
				.set("forcebutton", true);
			"step 4";
			if (result.bool) {
				var marks = result.links;
				for (var mark of marks) {
					target.addMark(mark, 1);
				}
				if (player != target && target.identityShown) {
					if (get.mode() != "identity" || player.identity != "nei") {
						player.addExpose(0.3);
					}
				}
				event.marks.removeArray(marks);
				for (var mark of event.marks) {
					player.addMark(mark, 1);
				}
			}
			"step 5";
			player.addMark("dcyinlu_yunxiang", 1);
			player.addMark("dcyinlu_xiang", 1);
			game.log(player, "获得了1点芸香值");
		},
		subSkill: {
			move: {
				audio: "dcyinlu",
				trigger: {
					player: "phaseZhunbeiBegin",
					global: "die",
				},
				direct: true,
				filter(event, player) {
					if (event.name == "die") {
						return lib.skill.dcyinlu.hasMark(event.player);
					}
					return game.hasPlayer(current => {
						return lib.skill.dcyinlu.hasMark(current);
					});
				},
				content() {
					"step 0";
					if (trigger.name == "die") {
						var marks = lib.skill.dcyinlu.derivation.filter(mark => trigger.player.hasMark(mark));
						event.marks = marks;
						event.goto(3);
					} else {
						if (_status.connectMode) {
							game.broadcastAll(function () {
								_status.noclearcountdown = true;
							});
						}
						player
							.chooseTarget(get.prompt("dcyinlu_move"), "移动一名角色的〖引路〗标记", 2, (card, player, target) => {
								if (ui.selected.targets.length == 0) {
									return lib.skill.dcyinlu.hasMark(target);
								}
								return true;
							})
							.set("ai", target => {
								var player = _status.event.player;
								if (ui.selected.targets.length == 0) {
									var owned = lib.skill.dcyinlu.derivation.filter(i => target.hasMark(i));
									var att = get.attitude(player, target);
									if (att > 0) {
										if (owned.includes("dcyinlu_zhangqi")) {
											return target.hasCard({ suit: "spade" }, "he") ? 5 : 10;
										}
										if (
											owned.includes("dcyinlu_lequan") &&
											target.isHealthy() &&
											game.hasPlayer(current => {
												return current != target && get.recoverEffect(current, player, player) > 0;
											})
										) {
											return 2;
										}
										return 0;
									}
									if (att < 0) {
										if (owned.some(i => i != "dcyinlu_zhangqi")) {
											return 8;
										}
										return 0;
									}
									if (
										owned.includes("dcyinlu_zhangqi") &&
										game.hasPlayer(current => {
											return current != target && get.effect(current, { name: "losehp" }, player, player) > 0;
										})
									) {
										return 3;
									}
									return 1;
								} else {
									var targetx = ui.selected.targets[0];
									var att = get.attitude(player, targetx),
										att2 = get.attitude(player, target);
									var owned = lib.skill.dcyinlu.derivation.filter(i => targetx.hasMark(i));
									if (att > 0) {
										if (owned.includes("dcyinlu_zhangqi")) {
											return -att2;
										}
										if (owned.includes("dcyinlu_lequan")) {
											return get.recoverEffect(target, player, player);
										}
									} else if (att < 0) {
										if (owned.some(i => i != "dcyinlu_zhangqi")) {
											return att2;
										}
									} else {
										if (owned.includes("dcyinlu_zhangqi")) {
											return get.effect(target, { name: "losehp" }, player, player);
										}
										return att2;
									}
								}
								return Math.random();
							})
							.set("complexTarget", true);
					}
					"step 1";
					if (result.bool) {
						var marks = lib.skill.dcyinlu.derivation;
						var targets = result.targets,
							owned = marks.filter(mark => targets[0].hasMark(mark));
						event.targets = targets;
						if (owned.length == 1) {
							event._result = { bool: true, control: owned[0] };
						} else {
							player
								.chooseControl(owned)
								.set("prompt", "引路：选择要移动" + get.translation(targets[0]) + "的标记")
								.set(
									"choiceList",
									owned.map(mark => {
										return (
											'<div class="skill">【' +
											get.translation(mark) +
											"】</div><div>" +
											lib.translate[mark + "_info"] +
											"</div>"
										);
									})
								)
								.set("displayIndex", false)
								.set("ai", () => {
									return _status.event.choice;
								})
								.set(
									"choice",
									(function () {
										var att = get.attitude(player, targets[0]),
											att2 = get.attitude(player, targets[1]);
										if (att > 0) {
											if (owned.includes("dcyinlu_zhangqi") && att2 < 0) {
												return "dcyinlu_zhangqi";
											}
											if (owned.includes("dcyinlu_lequan") && att2 > 0) {
												return "dcyinlu_lequan";
											}
										} else if (att < 0) {
											var marksx = owned.filter(i => i != "dcyinlu_zhangqi");
											if (marksx.length && att2 > 0) {
												return marksx[0];
											}
											return owned[0];
										} else {
											if (owned.includes("dcyinlu_zhangqi")) {
												return "dcyinlu_zhangqi";
											}
										}
										if (owned.length > 1) {
											owned.remove("dcyinlu_zhangqi");
										}
										return owned[0];
									})()
								);
						}
					} else {
						if (_status.connectMode) {
							game.broadcastAll(function () {
								delete _status.noclearcountdown;
								game.stopCountChoose();
							});
						}
						event.finish();
					}
					"step 2";
					if (_status.connectMode) {
						game.broadcastAll(function () {
							delete _status.noclearcountdown;
							game.stopCountChoose();
						});
					}
					var mark = result.control,
						count = targets[0].countMark(mark);
					player.logSkill("dcyinlu_move", targets, false);
					player.line2(targets, mark == "dcyinlu_zhangqi" ? "fire" : "green");
					targets[0].removeMark(mark, count);
					targets[1].addMark(mark, count);
					if (player != targets[1] && targets[1].identityShown) {
						if (get.mode() != "identity" || player.identity != "nei") {
							player.addExpose(0.3);
						}
					}
					event.finish();
					"step 3";
					player
						.chooseTarget("引路：是否转移“" + get.translation(event.marks[0]) + "”标记？")
						.set("ai", target => {
							var player = _status.event.player,
								mark = _status.event.mark;
							if (mark == "dcyinlu_zhangqi") {
								return get.effect(target, { name: "losehp" }, player, player) + 0.1;
							}
							if (mark == "dcyinlu_lequan") {
								return get.recoverEffect(target, player, player) + get.attitude(player, target) / 5;
							}
							return get.attitude(player, target);
						})
						.set("mark", event.marks[0]);
					"step 4";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("dcyinlu_move", target);
						var count = trigger.player.countMark(event.marks[0]);
						trigger.player.removeMark(event.marks[0], count, false);
						target.addMark(event.marks[0], count);
						if (player != target && target.identityShown) {
							if (get.mode() != "identity" || player.identity != "nei") {
								player.addExpose(0.3);
							}
						}
					}
					"step 5";
					event.marks.shift();
					if (event.marks.length) {
						event.goto(3);
					}
				},
			},
			lequan: {
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				charlotte: true,
				filter(event, player) {
					return player.hasMark("dcyinlu_lequan") && game.hasPlayer(current => current.hasSkill("dcyinlu"));
				},
				marktext: "乐",
				intro: {
					name: "乐泉",
					name2: "乐泉",
					markcount: () => 0,
					content: "结束阶段，你可以弃置一张♦牌，然后回复1点体力。",
				},
				content() {
					"step 0";
					player
						.chooseToDiscard("乐泉：是否弃置一张♦牌，然后回复1点体力？", { suit: "diamond" }, "he")
						.set("ai", card => {
							if (_status.event.goon) {
								return 7 - get.value(card);
							}
							return 0;
						})
						.set("logSkill", "dcyinlu_lequan")
						.set("goon", get.recoverEffect(player, player));
					"step 1";
					if (result.bool) {
						player.recover();
					}
				},
			},
			huoxi: {
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				charlotte: true,
				filter(event, player) {
					return player.hasMark("dcyinlu_huoxi") && game.hasPlayer(current => current.hasSkill("dcyinlu"));
				},
				marktext: "藿",
				intro: {
					name: "藿溪",
					name2: "藿溪",
					markcount: () => 0,
					content: "结束阶段，你可以弃置一张♥牌，然后摸两张牌。",
				},
				content() {
					"step 0";
					player
						.chooseToDiscard("藿溪：是否弃置一张♥牌，然后摸两张牌？", { suit: "heart" }, "he")
						.set("ai", card => {
							return 6 - get.value(card);
						})
						.set("logSkill", "dcyinlu_huoxi");
					"step 1";
					if (result.bool) {
						player.draw(2);
					}
				},
			},
			zhangqi: {
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				direct: true,
				charlotte: true,
				filter(event, player) {
					return player.hasMark("dcyinlu_zhangqi") && game.hasPlayer(current => current.hasSkill("dcyinlu"));
				},
				marktext: "瘴",
				intro: {
					name: "瘴气",
					name2: "瘴气",
					markcount: () => 0,
					content: "锁定技。结束阶段，你须弃置一张♠牌，否则失去1点体力。",
				},
				content() {
					"step 0";
					player
						.chooseToDiscard("瘴气：弃置一张♠牌，或失去1点体力", { suit: "spade" }, "he")
						.set("ai", card => {
							if (_status.event.goon) {
								return 7 - get.value(card);
							}
							return 0;
						})
						.set("logSkill", "dcyinlu_zhangqi")
						.set("goon", get.effect(player, { name: "losehp" }, player) < 0);
					"step 1";
					if (!result.bool) {
						player.logSkill("dcyinlu_zhangqi");
						player.loseHp();
					}
				},
			},
			yunxiang: {
				trigger: { player: ["phaseJieshuBegin", "damageBegin4"] },
				direct: true,
				charlotte: true,
				filter(event, player) {
					if (!game.hasPlayer(current => current.hasSkill("dcyinlu"))) {
						return false;
					}
					if (event.name == "phaseJieshu") {
						return player.hasMark("dcyinlu_yunxiang");
					}
					return player.hasMark("dcyinlu_yunxiang") && player.hasMark("dcyinlu_xiang");
				},
				onremove(player) {
					delete player.storage.dcyinlu_xiang;
				},
				marktext: "芸",
				intro: {
					name: "芸香",
					name2: "芸香",
					markcount(storage, player) {
						return player.countMark("dcyinlu_xiang");
					},
					content(storage, player) {
						return (
							"①结束阶段，你可以弃置一张♣牌，获得1点“芸香”值。②当你受到伤害时，你可以扣减所有“芸香”值，减少等量的伤害。<li>当前芸香值：" +
							player.countMark("dcyinlu_xiang")
						);
					},
				},
				content() {
					"step 0";
					if (trigger.name == "phaseJieshu") {
						player
							.chooseToDiscard("芸香：是否弃置一张♣牌，获得1枚“香”？", { suit: "club" }, "he")
							.set("ai", card => {
								return 6 - get.value(card) + 2.5 * _status.event.player.countMark("dcyinlu_xiang");
							})
							.set("logSkill", "dcyinlu_yunxiang");
					} else {
						player
							.chooseBool("芸香：是否移去所有“香”，令此伤害-" + player.countMark("dcyinlu_xiang") + "？")
							.set("ai", () => {
								return _status.event.bool;
							})
							.set("bool", get.damageEffect(player, trigger.source, player) < 0);
					}
					"step 1";
					if (result.bool) {
						if (trigger.name == "phaseJieshu") {
							player.addMark("dcyinlu_xiang", 1, false);
							game.log(player, "获得了1点芸香值");
						} else {
							player.logSkill("dcyinlu_yunxiang");
							var num = player.countMark("dcyinlu_xiang");
							player.removeMark("dcyinlu_xiang", num, false);
							game.log(player, "扣减了", num, "点芸香值");
							trigger.num = Math.max(0, trigger.num - num);
						}
					}
				},
			},
		},
	},
	dcyouqi: {
		audio: 2,
		trigger: { global: "loseAfter" },
		filter(event, player) {
			if (event.getParent(3).name.indexOf("dcyinlu_") != 0 || player == event.player) {
				return false;
			}
			return true;
		},
		derivation: "dcyouqi_faq",
		direct: true,
		forced: true,
		content() {
			if (Math.random() < 1.25 - 0.25 * get.distance(player, trigger.player) || get.isLuckyStar(player)) {
				player.logSkill("dcyouqi");
				player.gain(trigger.cards.filterInD("d"), "gain2");
			}
		},
		ai: {
			combo: "dcyinlu",
		},
	},
	//孙资刘放
	dcqinshen: {
		audio: 2,
		trigger: { player: "phaseDiscardEnd" },
		frequent: true,
		prompt2() {
			return "摸" + get.cnNumber(lib.skill.dcqinshen.getNum()) + "张牌";
		},
		getNum() {
			const list = lib.suit.slice();
			const suit = get.discarded().map(c => get.suit(c, false));
			list.removeArray(suit);
			return list.length;
		},
		filter(event, player) {
			return lib.skill.dcqinshen.getNum() > 0;
		},
		async content(event, trigger, player) {
			await player.draw(lib.skill.dcqinshen.getNum());
		},
	},
	dcweidang: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		/**
		 * @deprecated
		 */
		getLength: card => get.cardNameLength(card),
		filter(event, player) {
			const num = lib.skill.dcqinshen.getNum();
			return (
				event.player != player &&
				(_status.connectMode ? player.countCards("he") : player.hasCard(card => get.cardNameLength(card) == num, "he"))
			);
		},
		async cost(event, trigger, player) {
			const num = lib.skill.dcqinshen.getNum();
			event.result = await player
				.chooseCard(
					get.prompt(event.skill),
					"将一张字数为" + num + "的牌置于牌堆底，然后获得一张字数为" + num + "的牌。若你能使用此牌，你使用之。",
					"he",
					(card, player, target) => {
						return get.cardNameLength(card) == _status.event.num;
					}
				)
				.set("num", num)
				.set("ai", card => {
					return 5 - get.value(card);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event;
			const num = lib.skill.dcqinshen.getNum();
			game.broadcastAll(function (player) {
				const cardx = ui.create.card();
				cardx.classList.add("infohidden");
				cardx.classList.add("infoflip");
				player.$throw(cardx, 1000, "nobroadcast");
			}, player);
			await player.lose(cards, ui.cardPile);
			await game.delayx();
			const card = get.cardPile(cardx => get.cardNameLength(cardx) == num);
			if (card) {
				await player.gain(card, "gain2");
				if (player.hasUseTarget(card)) {
					await player.chooseUseTarget(card, true);
				}
			}
		},
	},
	//三袁
	dcneifa: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		content() {
			"step 0";
			player.draw(3);
			player.chooseToDiscard(true, "he").set("ai", function (cardx) {
				var player = _status.event.player;
				var num = 0;
				var hs = player.getCards("h");
				var muniu = player.getEquip("muniu");
				if (muniu && muniu.cards) {
					hs = hs.concat(muniu.cards);
				}
				if (get.type(cardx) == "basic") {
					var shas = hs.filter(function (card) {
						return card != cardx && get.name(card, player) == "sha" && player.hasValueTarget(card, false);
					});
					var numx = player.countCards("h", function (card) {
						return get.type2(card, player) == "trick";
					});
					num += Math.min(numx, Math.max(0, shas.length - player.getCardUsable("sha"))) * 0.65;
					num +=
						Math.min(
							player.getCardUsable("sha") + numx,
							shas.filter(function (card) {
								return (
									game.countPlayer(function (current) {
										return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
									}) > 1
								);
							}).length
						) * 1.1;
					var taos = Math.min(
						player.maxHp - player.hp,
						hs.filter(function (card) {
							return cardx != card && get.name(card, player) == "tao";
						}).length
					);
					num += taos * player.getDamagedHp() * 1.2;
				} else if (get.type2(cardx) == "trick") {
					var numx = Math.sqrt(
						Math.min(
							5,
							player.countCards("h", function (card) {
								return get.type(card, null, player) == "basic";
							})
						)
					);
					num +=
						hs.filter(function (card) {
							return card != cardx && get.type2(card) == "trick" && player.hasValueTarget(card);
						}).length * 0.65;
				} else {
					num = 4;
				}
				return num * 1.5 - get.value(cardx);
			});
			"step 1";
			if (result.bool && result.cards && result.cards.length && get.type(result.cards[0]) != "equip") {
				var name = get.type(result.cards[0]) == "basic" ? "dcneifa_basic" : "dcneifa_trick";
				player.addTempSkill(name, "phaseUseAfter");
				var num = Math.min(
					5,
					player.countCards("h", function (cardx) {
						var type = get.type(cardx, null, player);
						return (name == "dcneifa_basic") != (type == "basic") && type != "equip";
					})
				);
				if (num > 0) {
					player.addMark(name, num, false);
				} else {
					player.storage[name] = 0;
				}
			}
		},
		ai: {
			threaten: 2.33,
		},
	},
	dcneifa_basic: {
		mark: true,
		marktext: "伐",
		onremove: true,
		intro: {
			name: "内伐 - 基本牌",
			content: "本回合内不能使用锦囊牌，使用【杀】选择目标时可以额外指定一个目标且使用【杀】的目标次数上限+#。",
		},
		mod: {
			cardEnabled(card, player) {
				if (get.type(card, "trick") == "trick") {
					return false;
				}
			},
			cardSavable(card, player) {
				if (get.type(card, "trick") == "trick") {
					return false;
				}
			},
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + player.countMark("dcneifa_basic");
				}
			},
		},
		trigger: { player: "useCard2" },
		sourceSkill: "dcneifa",
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			return game.hasPlayer(function (current) {
				return !event.targets.includes(current) && player.canUse(event.card, current, false);
			});
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("dcneifa"), "为" + get.translation(trigger.card) + "额外指定一个目标", function (card, player, target) {
					return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target, false);
				})
				.set("sourcex", trigger.targets)
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, _status.event.card, player, player);
				})
				.set("card", trigger.card);
			"step 1";
			if (result.bool) {
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 2";
			player.logSkill("dcneifa", event.targets);
			trigger.targets.addArray(event.targets);
		},
	},
	dcneifa_trick: {
		trigger: { player: "useCard2" },
		direct: true,
		mark: true,
		marktext: "伐",
		onremove: true,
		mod: {
			cardEnabled(card, player) {
				if (get.type(card) == "basic") {
					return false;
				}
			},
			cardSavable(card, player) {
				if (get.type(card) == "basic") {
					return false;
				}
			},
		},
		intro: {
			name: "内伐 - 锦囊牌",
			content: "本回合内不能使用基本牌，且使用普通锦囊牌选择目标时可以增加或减少一个目标。",
		},
		sourceSkill: "dcneifa",
		filter(event, player) {
			if (get.type(event.card) != "trick") {
				return false;
			}
			if (event.targets && event.targets.length > 0) {
				return true;
			}
			var info = get.info(event.card);
			if (info.allowMultiple == false) {
				return false;
			}
			if (event.targets && !info.multitarget) {
				if (
					game.hasPlayer(function (current) {
						return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var prompt2 = "为" + get.translation(trigger.card) + "增加或减少一个目标";
			player
				.chooseTarget(get.prompt("dcneifa"), function (card, player, target) {
					var player = _status.event.player;
					if (_status.event.targets.includes(target)) {
						return true;
					}
					return lib.filter.targetEnabled2(_status.event.card, player, target);
				})
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, player, player) * (_status.event.targets.includes(target) ? -1 : 1);
				})
				.set("targets", trigger.targets)
				.set("card", trigger.card);
			"step 1";
			if (result.bool) {
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets) {
				player.logSkill("dcneifa", event.targets);
				if (trigger.targets.includes(event.targets[0])) {
					trigger.targets.removeArray(event.targets);
				} else {
					trigger.targets.addArray(event.targets);
				}
			}
		},
	},
	//桥蕤
	dcaishou: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.hasCard(card => card.hasGaintag("dcaishou_tag"), "h");
		},
		forced: true,
		locked: false,
		group: ["dcaishou_draw", "dcaishou_lose"],
		subfrequent: ["draw"],
		content() {
			"step 0";
			player.discard(player.getCards("h", card => card.hasGaintag("dcaishou_tag")));
			"step 1";
			var len = 0;
			player.getHistory("lose", evt => {
				if (evt.getParent(2) == event) {
					len += evt.cards.length;
				}
			});
			if (len > Math.max(0, player.hp) && player.maxHp < 9) {
				player.gainMaxHp();
			}
		},
		subSkill: {
			draw: {
				audio: "dcaishou",
				trigger: { player: "phaseJieshuBegin" },
				frequent(event, player) {
					return player.maxHp > 1;
				},
				prompt2(event, player) {
					return "摸" + get.cnNumber(player.maxHp) + "张牌，称为“隘”";
				},
				check(event, player) {
					return player.maxHp > 1;
				},
				content() {
					player.draw(player.maxHp).gaintag = ["dcaishou_tag"];
				},
			},
			lose: {
				audio: "dcaishou",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				locked: false,
				filter(event, player) {
					if (player == _status.currentPhase) {
						return false;
					}
					var evt = event.getl(player);
					if (!evt || !evt.hs || !evt.hs.length || player.hasCard(card => card.hasGaintag("dcaishou_tag"), "h")) {
						return false;
					}
					if (event.name == "lose") {
						for (var i in event.gaintag_map) {
							if (event.gaintag_map[i].includes("dcaishou_tag")) {
								return true;
							}
						}
						return false;
					}
					return player.hasHistory("lose", function (evt) {
						if (event != evt.getParent()) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("dcaishou_tag")) {
								return true;
							}
						}
						return false;
					});
				},
				content() {
					player.loseMaxHp();
				},
			},
		},
	},
	dcsaowei: {
		audio: 2,
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			return (
				event.player != player &&
				event.card.name == "sha" &&
				event.targets.length &&
				!event.targets.includes(player) &&
				event.targets.every(current => player.inRange(current) && current.isIn()) &&
				player.hasCard(card => card.hasGaintag("dcaishou_tag"), "h")
			);
		},
		direct: true,
		content() {
			"step 0";
			player.chooseCardTarget({
				position: "hs",
				prompt: get.prompt("dcsaowei"),
				prompt2: "将一张“隘”当做【杀】对" + get.translation(trigger.targets) + "使用",
				targets: trigger.targets,
				filterCard(card, player) {
					if (get.itemtype(card) == "card" && !card.hasGaintag("dcaishou_tag")) {
						return false;
					}
					return _status.event.targets.every(current => player.canUse(get.autoViewAs({ name: "sha" }, [card]), current, false));
				},
				filterTarget(card, player, target) {
					if (!_status.event.targets.includes(target)) {
						return false;
					}
					card = get.autoViewAs({ name: "sha" }, [card]);
					return lib.filter.filterTarget.apply(this, arguments);
				},
				selectTarget: -1,
				ai1(card) {
					var player = _status.event.player;
					if (player.isHealthy() && player.hasSkill("dcaishou") && player.countCards("h", card => card.hasGaintag("dcaishou_tag") == 1)) {
						return 0;
					}
					var eff = 0;
					for (var target of _status.event.targets) {
						eff += get.effect(target, get.autoViewAs({ name: "sha" }, [card]), player, player);
					}
					if (eff > 0) {
						return 6.5 + eff / 10 - get.value(card);
					}
					return 0;
				},
				ai2: () => 1,
			});
			"step 1";
			if (result.bool) {
				var cards = result.cards,
					targets = result.targets;
				event.cards = cards;
				var next = player.useCard({ name: "sha" }, cards, targets, false, "dcsaowei");
				player
					.when("useCardAfter")
					.filter(event => event == next)
					.step(async (event, trigger, player) => {
						if (player.hasHistory("sourceDamage", evt => evt.card == trigger.card)) {
							var cards = trigger.cards.filterInD();
							if (cards.length > 0) {
								player.gain(cards, "gain2");
							}
						}
					});
			}
		},
		ai: {
			combo: "dcaishou",
		},
	},
	//向朗
	dckanji: {
		audio: 2,
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			return player.countCards("h");
		},
		content() {
			"step 0";
			player.showHandcards();
			"step 1";
			var suits = [];
			player.getCards("h", card => suits.add(get.suit(card)));
			if (suits.length == player.countCards("h")) {
				player.draw(2);
				event.suitsLength = suits.length;
				player.addTempSkill("dckanji_check");
			}
		},
		subSkill: {
			check: {
				trigger: { player: "gainAfter" },
				filter(event, player) {
					if (event.getParent(2).name != "dckanji") {
						return false;
					}
					var len = event.getParent(2).suitsLength;
					var suits = [];
					player.getCards("h", card => suits.add(get.suit(card)));
					return suits.length >= 4 && len < 4;
				},
				charlotte: true,
				forced: true,
				popup: false,
				content() {
					player.skip("phaseDiscard");
					game.log(player, "跳过了", "#y弃牌阶段");
				},
			},
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					var count = player.countCards("h");
					if (count > 4) {
						return false;
					}
					var suits = [];
					player.getCards("h", card => suits.add(get.suit(card)));
					return suits.length == count ? 1 : 0;
				},
			},
		},
	},
	dcqianzheng: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		usable: 2,
		filter(event, player) {
			return event.player != player && (get.type(event.card) == "trick" || event.card.name == "sha") && player.countCards("he") > 1;
		},
		preHidden: true,
		async cost(event, trigger, player) {
			const str =
				"，若重铸的牌中没有" + get.translation(get.type2(trigger.card)) + "牌，你于" + get.translation(trigger.cards) + "进入弃牌堆后获得之";
			event.result = await player
				.chooseCard(get.prompt(event.skill), "重铸两张牌" + (trigger.cards.length ? str : "") + "。", 2, "he", lib.filter.cardRecastable)
				.set("ai", card => {
					var val = get.value(card);
					if (get.type2(card) == _status.event.type) {
						val += 0.5;
					}
					return 6 - val;
				})
				.setHiddenSkill(event.skill)
				.set("type", get.type2(trigger.card))
				.forResult();
		},
		async content(event, trigger, player) {
			if (event.cards.every(card => get.type2(card) != get.type2(trigger.card))) {
				trigger.getParent().dcqianzheng = true;
				player.addTempSkill("dcqianzheng_gain");
			}
			await player.recast(event.cards);
		},
		subSkill: {
			gain: {
				trigger: { global: "cardsDiscardAfter" },
				filter(event, player) {
					var evt = event.getParent();
					if (evt.name != "orderingDiscard") {
						return false;
					}
					return evt.relatedEvent.dcqianzheng && evt.relatedEvent.cards.filterInD("d").length;
				},
				charlotte: true,
				forced: true,
				popup: false,
				content() {
					const evt = trigger.getParent().relatedEvent;
					player.gain(evt.cards.filterInD("d"), "gain2");
				},
			},
		},
	},
	//秦朗
	dchaochong: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return player.getHandcardLimit() != player.countCards("h");
		},
		direct: true,
		locked: false,
		content() {
			"step 0";
			var del = player.getHandcardLimit() - player.countCards("h");
			event.delta = del;
			if (del > 0) {
				player.chooseBool(get.prompt("dchaochong"), "摸" + get.cnNumber(Math.min(5, del)) + "张牌，然后令你的手牌上限-1").set("ai", () => {
					var player = _status.event.player;
					if (player.isPhaseUsing() && player.hasCard(cardx => player.hasUseTarget(cardx) && player.hasValueTarget(cardx), "hs")) {
						return false;
					}
					return true;
				});
			} else if (del < 0) {
				player
					.chooseToDiscard(get.prompt("dchaochong"), "弃置" + get.cnNumber(-del) + "张手牌，然后令你的手牌上限+1", -del, "allowChooseAll")
					.set("ai", card => {
						var player = _status.event.player;
						if (player.isPhaseUsing() && player.hasCard(cardx => player.hasValueTarget(cardx), "hs")) {
							return 6 - player.getUseValue(card);
						}
						return 5 - get.value(card);
					})
					.set("logSkill", "dchaochong");
			}
			"step 1";
			if (result.bool) {
				if (event.delta > 0) {
					player.logSkill("dchaochong");
					player.draw(Math.min(5, event.delta));
					lib.skill.dchaochong.change(player, -1);
				} else if (event.delta < 0) {
					lib.skill.dchaochong.change(player, 1);
				}
			}
		},
		change(player, num) {
			if (typeof player.storage.dchaochong !== "number") {
				player.storage.dchaochong = 0;
			}
			if (!num) {
				return;
			}
			player.storage.dchaochong += num;
			player.markSkill("dchaochong");
			game.log(player, "的手牌上限", "#g" + (num > 0 ? "+" : "") + num);
		},
		markimage: "image/card/handcard.png",
		intro: {
			content(storage, player) {
				var num = player.storage.dchaochong;
				return "手牌上限" + (num >= 0 ? "+" : "") + num;
			},
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("dchaochong");
			},
		},
		ai: { threaten: 2.2 },
	},
	dcjinjin: {
		audio: 2,
		trigger: {
			source: "damageSource",
			player: "damageEnd",
		},
		usable: 2,
		logTarget: "source",
		check(event, player) {
			if (typeof player.storage.dchaochong != "number" || player.storage.dchaochong == 0) {
				return true;
			}
			var evt = event.getParent("useCard");
			if (evt && evt.player == player && event.source == player) {
				return false;
			}
			if (player.isPhaseUsing() && player.storage.dchaochong == -1) {
				return true;
			}
			return Math.abs(player.storage.dchaochong) >= 2;
		},
		prompt2(event, player) {
			var str = "";
			if (typeof player.storage.dchaochong == "number" && player.storage.dchaochong != 0) {
				str += "重置因〖佞宠〗增加或减少的手牌上限，";
			}
			var num = Math.abs(player.countMark("dchaochong")) || 1;
			if (event.source && event.source.isIn()) {
				str += "令伤害来源弃置至多" + get.cnNumber(num) + "张牌，然后你摸" + num + "-X张牌（X为其弃置的牌数）";
			} else {
				str += "你摸" + get.cnNumber(num) + "张牌";
			}
			return str;
		},
		content() {
			"step 0";
			var del = Math.abs(player.countMark("dchaochong")) || 1;
			event.delta = del;
			player.storage.dchaochong = 0;
			if (player.hasSkill("dchaochong", null, false, false)) {
				player.markSkill("dchaochong");
			}
			game.log(player, "重置了手牌上限");
			if (trigger.source && trigger.source.isIn()) {
				trigger.source
					.chooseToDiscard(
						get.translation(player) + "对你发动了【矜谨】",
						"弃置至多" + get.cnNumber(del) + "张牌，然后" + get.translation(player) + "摸" + del + "-X张牌（X为你弃置的牌数）。",
						[1, del],
						"he",
						"allowChooseAll"
					)
					.set("ai", card => {
						if (_status.event.goon) {
							return 5.5 - get.value(card);
						}
						return 0;
					})
					.set("goon", get.attitude(trigger.source, player) < 0);
			}
			"step 1";
			var num = event.delta;
			if (result.bool) {
				num -= result.cards.length;
			}
			if (num > 0) {
				player.draw(num);
			}
		},
		ai: {
			combo: "dchaochong",
			maixie: true,
			maixie_hp: true,
			threaten: 0.85,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						var num = 0;
						if (typeof target.storage.dcninchong == "number") {
							num = Math.abs(target.storage.dcninchong);
						}
						if (num <= 0) {
							return;
						}
						return [1, Math.min(1, num / 3)];
					}
				},
			},
		},
	},
	//二傅
	dcxuewei: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("dcxuewei"), (card, player, target) => {
					return target.hp <= player.hp;
				})
				.set("ai", target => {
					var player = _status.event.player;
					return get.effect(target, { name: "tao" }, player, player) + 0.1;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dcxuewei", target);
				player.addTempSkill("dcxuewei_shelter", { player: "phaseBegin" });
				player.markAuto("dcxuewei_shelter", [target]);
			}
		},
		ai: { threaten: 1.1 },
		subSkill: {
			shelter: {
				audio: "dcxuewei",
				trigger: { global: "damageBegin4" },
				filter(event, player) {
					return player.getStorage("dcxuewei_shelter").includes(event.player);
				},
				charlotte: true,
				forced: true,
				onremove: true,
				logTarget: "player",
				marktext: "卫",
				intro: { content: "保护对象：$" },
				content() {
					"step 0";
					trigger.cancel();
					"step 1";
					player.loseHp();
					if (trigger.player != player) {
						game.asyncDraw([player, trigger.player]);
					} else {
						player.draw("nodelay");
					}
					"step 2";
					game.delayx();
				},
				ai: {
					filterDamage: true,
					skillTagFilter(player, tag, arg) {
						if (arg && arg.player && arg.player.hasSkillTag("jueqing", false, player)) {
							return false;
						}
						return true;
					},
				},
			},
		},
	},
	dcyuguan: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			var num = player.getDamagedHp();
			if (num == 0) {
				return false;
			}
			return !game.hasPlayer(current => {
				return current.getDamagedHp() > num;
			});
		},
		check(event, player) {
			var num = player.getDamagedHp() - 1;
			if (num <= 0) {
				return false;
			}
			return (
				game.countPlayer(target => {
					if (player === target) {
						return player.maxHp - player.countCards("h") - 1;
					}
					if (get.attitude(player, target) > 0) {
						return target.maxHp - target.countCards("h");
					}
					return 0;
				}) > 1
			);
		},
		content() {
			"step 0";
			player.loseMaxHp();
			"step 1";
			var num = player.getDamagedHp();
			if (!player.isIn() || !num) {
				event.finish();
			} else {
				player
					.chooseTarget("御关：令至多" + get.cnNumber(num) + "名角色将手牌摸至体力上限", [1, Math.min(game.countPlayer(), num)], true)
					.set("ai", target => {
						return get.attitude(_status.event.player, target) * Math.max(0.1, target.maxHp - target.countCards("h"));
					});
			}
			"step 2";
			if (result.bool) {
				var targets = result.targets.sortBySeat(_status.currentPhase);
				player.line(targets);
				for (var target of targets) {
					target.drawTo(target.maxHp);
				}
			}
		},
	},
	//郑浑
	dcqiangzhi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			return target.countDiscardableCards(player, "he") + player.countDiscardableCards(player, "he") >= 3;
		},
		content() {
			"step 0";
			var dialog = [];
			dialog.push("强峙：弃置你与" + get.translation(target) + "的共计三张牌");
			if (player.countCards("h")) {
				dialog.addArray(['<div class="text center">你的手牌</div>', player.getCards("h")]);
			}
			if (player.countCards("e")) {
				dialog.addArray(['<div class="text center">你的装备</div>', player.getCards("e")]);
			}
			if (target.countCards("h")) {
				dialog.add('<div class="text center">' + get.translation(target) + "的手牌</div>");
				if (player.hasSkillTag("viewHandcard", null, target, true)) {
					dialog.push(target.getCards("h"));
				} else {
					dialog.push([target.getCards("h"), "blank"]);
				}
			}
			if (target.countCards("e")) {
				dialog.addArray(['<div class="text center">' + get.translation(target) + "的装备</div>", target.getCards("e")]);
			}
			player
				.chooseButton(3, true)
				.set("createDialog", dialog)
				.set("filterButton", button => {
					if (!lib.filter.canBeDiscarded(button.link, _status.event.player, get.owner(button.link))) {
						return false;
					}
					return true;
				})
				.set("filterOk", () => {
					return ui.selected.buttons.length == 3;
				})
				.set("ai", button => {
					var player = _status.event.player;
					var target = _status.event.getParent().target;
					var card = button.link;
					if (get.owner(card) == player) {
						if (_status.event.damage) {
							return 15 - get.value(card);
						}
						if (
							player.hp >= 3 ||
							get.damageEffect(player, target, player) >= 0 ||
							(player.hasSkill("dcpitian") && player.getHandcardLimit() - player.countCards("h") >= 1 && player.hp > 1)
						) {
							return 0;
						}
						if (ui.selected.buttons.length == 0) {
							return 10 - get.value(card);
						}
						return 0;
					} else {
						if (_status.event.damage) {
							return 0;
						}
						return -(get.sgnAttitude(player, target) || 1) * get.value(card);
					}
				})
				.set(
					"damage",
					get.damageEffect(target, player, player) > 10 &&
						player.countCards("he", card => {
							return lib.filter.canBeDiscarded(card, player, player) && get.value(card) < 5;
						}) >= 3
				);
			"step 1";
			if (result.bool) {
				var links = result.links;
				var list1 = [],
					list2 = [];
				event.players = [player, target];
				for (var card of links) {
					if (get.owner(card) == player) {
						list1.push(card);
					} else {
						list2.push(card);
					}
				}
				if (list1.length && list2.length) {
					game.loseAsync({
						lose_list: [
							[player, list1],
							[target, list2],
						],
						discarder: player,
					}).setContent("discardMultiple");
					event.finish();
				} else if (list2.length) {
					target.discard(list2);
				} else {
					player.discard(list1);
				}
				if (list2.length >= 3) {
					event.players.reverse();
				}
			} else {
				event.finish();
			}
			"step 2";
			event.players[0].line(event.players[1]);
			event.players[1].damage(event.players[0]);
		},
		ai: {
			expose: 0.2,
			order: 4,
			result: {
				target(player, target) {
					return (
						(get.effect(target, { name: "guohe_copy2" }, player, target) / 2) *
							(target.countDiscardableCards(player, "he") >= 2 ? 1.25 : 1) +
						get.damageEffect(target, player, target) / 3
					);
				},
			},
		},
	},
	dcpitian: {
		audio: 2,
		trigger: {
			player: ["loseAfter", "damageEnd"],
			global: "loseAsyncAfter",
		},
		forced: true,
		locked: false,
		group: "dcpitian_draw",
		filter(event, player) {
			if (event.name == "damage") {
				return true;
			}
			return event.type == "discard" && event.getl(player).cards2.length > 0;
		},
		content() {
			player.addMark("dcpitian_handcard", 1, false);
			player.addSkill("dcpitian_handcard");
			game.log(player, "的手牌上限", "#y+1");
		},
		subSkill: {
			draw: {
				audio: "dcpitian",
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return player.countCards("h") < player.getHandcardLimit();
				},
				prompt2(event, player) {
					return (
						"摸" + get.cnNumber(Math.min(5, player.getHandcardLimit() - player.countCards("h"))) + "张牌，重置因〖辟田〗增加的手牌上限"
					);
				},
				check(event, player) {
					return player.getHandcardLimit() - player.countCards("h") > Math.min(2, player.hp - 1);
				},
				content() {
					"step 0";
					var num = Math.min(5, player.getHandcardLimit() - player.countCards("h"));
					if (num > 0) {
						player.draw(num);
					}
					"step 1";
					player.removeMark("dcpitian_handcard", player.countMark("dcpitian_handcard"), false);
					game.log(player, "重置了", "#g【辟田】", "增加的手牌上限");
				},
			},
			handcard: {
				markimage: "image/card/handcard.png",
				intro: {
					content(storage, player) {
						return "手牌上限+" + storage;
					},
				},
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("dcpitian_handcard");
					},
				},
			},
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "discard")) {
						return 0.9;
					}
					if (get.tag(card, "damage")) {
						return 0.95;
					}
				},
			},
		},
	},
	//新服二赵
	dcqingren: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter(event, player) {
			return player.hasHistory("useSkill", evt => ["yizan_use", "yizan_use_backup"].includes(get.sourceSkillFor(evt)));
		},
		content() {
			player.draw(player.getHistory("useSkill", evt => ["yizan_use", "yizan_use_backup"].includes(get.sourceSkillFor(evt))).length);
		},
		ai: {
			combo: "yizan_use",
		},
	},
	dclongyuan: {
		audio: "xinfu_longyuan",
		forced: true,
		juexingji: true,
		trigger: { global: "phaseEnd" },
		skillAnimation: true,
		animationColor: "orange",
		filter(event, player) {
			return player.countMark("yizan_use") >= 3;
		},
		content() {
			player.awakenSkill(event.name);
			player.draw(2);
			player.recover();
			player.storage.yizan = true;
		},
		derivation: "yizan_rewrite",
		ai: { combo: "yizan_use" },
	},
	//黄皓
	dcqinqing: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			var zhu = game.filterPlayer(current => current.getSeatNum() == 1)[0];
			if (!zhu || !zhu.isIn()) {
				return false;
			}
			return game.hasPlayer(current => {
				return current != player && current.inRange(zhu);
			});
		},
		seatRelated: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("dcqinqing"), function (card, player, target) {
					var zhu = game.filterPlayer(current => current.getSeatNum() == 1)[0];
					return target != player && target.inRange(zhu) && target.countDiscardableCards(player, "he") > 0;
				})
				.set("ai", function (target) {
					var zhu = game.filterPlayer(current => current.getSeatNum() == 1)[0];
					var he = target.countCards("he");
					if (get.attitude(_status.event.player, target) > 0) {
						if (target.countCards("h") > zhu.countCards("h") + 1) {
							return 0.1;
						}
					} else {
						if (he > zhu.countCards("h") + 1) {
							return 2;
						}
						if (he > 0) {
							return 1;
						}
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("dcqinqing", target);
				if (target.countCards("he")) {
					player.discardPlayerCard(target, "he", true);
				}
			} else {
				event.finish();
			}
			"step 2";
			var zhu = game.filterPlayer(current => current.getSeatNum() == 1)[0];
			if (zhu && zhu.isIn()) {
				if (target.countCards("h") > zhu.countCards("h")) {
					player.draw();
				}
			}
		},
	},
	dccunwei: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		forced: true,
		filter(event, player) {
			return get.type2(event.card) == "trick" && (event.targets.length == 1 || player.countCards("he") > 0);
		},
		content() {
			if (trigger.targets.length == 1) {
				player.draw();
			} else if (player.countCards("he") > 0) {
				player.chooseToDiscard("he", true, "存畏：请弃置一张牌");
			}
		},
		ai: { halfneg: true },
	},
	//刘辟
	dcjuying: {
		audio: 2,
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return ["sha", "jiu"].some(name => {
				return (
					player.getCardUsable(name, true) >
					player.getHistory("useCard", evt => {
						return evt.getParent("phaseUse") == event && evt.card.name == name && evt.addCount !== false;
					}).length
				);
			});
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseButton([
					get.prompt("dcjuying"),
					[
						[
							["sha", "你于下回合使用【杀】的次数上限+1"],
							["hand", "本回合手牌上限+2"],
							["draw", "摸三张牌"],
						],
						"textbutton",
					],
				])
				.set("ai", function (button) {
					var player = _status.event.player,
						choice = button.link;
					if (choice == "draw") {
						return 10;
					}
					if (choice == "sha") {
						return 9;
					}
					var del = 3 - player.hp;
					if (choice == "hand") {
						if (del <= 0 || player.needsToDiscard()) {
							return 8;
						}
					}
					return 0;
				})
				.set("selectButton", [1, 3]);
			"step 1";
			if (result.bool) {
				player.logSkill("dcjuying");
				var choices = result.links;
				event.choices = choices;
				if (choices.includes("sha")) {
					player.addMark("dcjuying_sha", 1, false);
					player.addSkill("dcjuying_sha");
				}
				if (choices.includes("hand")) {
					player.addMark("dcjuying_hand", 1, false);
					player.addTempSkill("dcjuying_hand");
				}
				if (choices.includes("draw")) {
					player.draw(3);
				}
			} else {
				event.finish();
			}
			"step 2";
			var num = event.choices.length - Math.max(0, player.hp);
			if (num > 0) {
				player.chooseToDiscard(true, "he");
			}
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (
						typeof card == "object" &&
						player.isPhaseUsing() &&
						["sha", "jiu"].some(name => {
							return card.name == name && player.getCardUsable(name) == 1 && !player.getCardUsable(name == "sha" ? "jiu" : "sha");
						})
					) {
						return "zeroplayertarget";
					}
				},
				target_use(card, player, target) {
					if (card.name == "jiu" && player.getCardUsable("sha") == 2) {
						return [1, 1];
					}
				},
			},
		},
		subSkill: {
			sha: {
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					return player.countMark("dcjuying_sha") > 0;
				},
				silent: true,
				firstDo: true,
				charlotte: true,
				onremove: true,
				content() {
					player.addMark("dcjuying_effect", player.countMark("dcjuying_sha"), false);
					player.addTempSkill("dcjuying_effect");
					player.removeSkill("dcjuying_sha");
				},
				intro: { content: "下回合使用【杀】的次数上限+#" },
			},
			effect: {
				onremove: true,
				charlotte: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("dcjuying_effect");
						}
					},
				},
				intro: { content: "本回合使用【杀】的次数上限+#" },
			},
			hand: {
				onremove: true,
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + 2 * player.countMark("dcjuying_hand");
					},
				},
			},
		},
	},
	//新服加强魏贾诩
	dcjianshu: {
		audio: "jianshu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", { color: "black" }) > 0;
		},
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			if (ui.selected.targets.length) {
				return (
					ui.selected.targets[0] != target &&
					!ui.selected.targets[0].hasSkillTag("noCompareSource") &&
					target.countCards("h") &&
					!target.hasSkillTag("noCompareTarget")
				);
			}
			return true;
		},
		targetprompt: ["发起者", "拼点目标"],
		filterCard: { color: "black" },
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
		content() {
			"step 0";
			player.give(cards, targets[0], "give");
			"step 1";
			if (targets[0].canCompare(targets[1])) {
				targets[0].chooseToCompare(targets[1]);
			} else {
				event.finish();
			}
			"step 2";
			player.addTempSkill("dcjianshu_check", "phaseUseAfter");
			if (result.bool) {
				var cards = targets[0].getCards("he", function (card) {
					return lib.filter.cardDiscardable(card, targets[0], "dcjianshu");
				});
				if (cards.length > 0) {
					targets[0].discard(cards.randomGet());
				}
				targets[1].loseHp();
			} else if (result.tie) {
				targets[0].loseHp();
				targets[1].loseHp();
			} else {
				var cards = targets[1].getCards("he", function (card) {
					return lib.filter.cardDiscardable(card, targets[1], "dcjianshu");
				});
				if (cards.length > 0) {
					targets[1].discard(cards.randomGet());
				}
				targets[0].loseHp();
			}
		},
		subSkill: {
			check: {
				trigger: { global: "dieAfter" },
				charlotte: true,
				forced: true,
				popup: false,
				filter(event, player) {
					return event.getParent(3).name == "dcjianshu";
				},
				content() {
					delete player.getStat("skill").dcjianshu;
				},
			},
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
	dcyongdi: {
		audio: "yongdi",
		audioname: ["xinping"],
		limited: true,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return target.hasSex("male");
		},
		animationColor: "thunder",
		skillAnimation: "legend",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const target = event.target;
			if (target.isMinMaxHp() || target.isMinHp()) {
				await target.gainMaxHp();
				await target.recover();
			}
			if (target.isMinHandcard()) {
				await target.draw(Math.min(5, target.maxHp));
			}
			await game.delayx();
		},
		ai: {
			expose: 0.3,
			order: 1,
			result: {
				target(player, target) {
					var val = 0;
					var bool1 = !game.hasPlayer(current => current.maxHp < target.maxHp),
						bool2 = target.isMinHp(),
						bool3 = target.isMinHandcard();
					if (bool1) {
						val += 6.5;
					}
					if (bool2) {
						if (bool1) {
							target.maxHp++;
						}
						val += Math.max(0, get.recoverEffect(target, player, player));
						if (bool1) {
							target.maxHp--;
						}
					}
					if (bool3) {
						var num = Math.max(0, Math.min(5, target.maxHp + (bool1 ? 1 : 0)));
						val += 5 * num;
					}
					return val;
				},
			},
		},
	},
	//雷普
	dcsilve: {
		audio: 2,
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		onremove: ["dcsilve", "dcsilve_self"],
		filter(event, player) {
			return (
				game.hasPlayer(current => current != player && !player.getStorage("dcsilve").includes(current)) &&
				(event.name != "phase" || game.phaseNumber == 0)
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					"私掠：请选择一名其他角色",
					"选择一名其他角色（暂时仅你可见），称为“私掠”角色，且你获得后续效果",
					true,
					(card, player, target) => {
						return target != player && !player.getStorage("dcsilve").includes(target);
					}
				)
				.set("ai", target => {
					const att = get.attitude(get.player(), target);
					if (att > 0) {
						return att + 1;
					}
					if (att == 0) {
						return Math.random();
					}
					return att;
				})
				.set("animate", false)
				.forResult();
		},
		logLine: false,
		async content(event, trigger, player) {
			const [target] = event.targets;
			player.markAuto(event.name, [target]);
			player.addSkill(event.name + "_rob");
			player.addSkill(event.name + "_revenge");
			target.addSkill(event.name + "_target");
			target.storage[event.name + "_target"] ??= [];
			target.storage[event.name + "_target"].push(player);
		},
		subSkill: {
			rob: {
				audio: "dcsilve",
				trigger: { global: "damageSource" },
				filter(event, player) {
					if (!player.getStorage("dcsilve").includes(event.source)) {
						return false;
					}
					if (!event.player.isIn() || event.player == player) {
						return false;
					}
					if (player.getStorage("dcsilve_robbed").includes(event.player)) {
						return false;
					}
					return event.player.countCards("he") > 0;
				},
				charlotte: true,
				prompt2(event, player) {
					return "获得" + get.translation(event.player) + "一张牌";
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const [target] = event.targets;
					player.addTempSkill("dcsilve_robbed");
					player.markAuto("dcsilve_self", [target]);
					if (target.countGainableCards(player, "he") > 0) {
						player.markAuto("dcsilve_robbed", [target]);
						await player.gainPlayerCard(target, "he", true);
					}
					if (trigger.source && trigger.source != player) {
						trigger.source.markSkill("dcsilve_target");
					}
				},
			},
			revenge: {
				audio: "dcsilve",
				trigger: { global: "damageEnd" },
				filter(event, player) {
					if (!player.getStorage("dcsilve").includes(event.player)) {
						return false;
					}
					if (!event.player.isIn() || !event.source?.isIn() || event.source == player) {
						return false;
					}
					return true;
				},
				charlotte: true,
				direct: true,
				clearTime: true,
				async content(event, trigger, player) {
					if (trigger.player && trigger.player != player) {
						trigger.player.markSkill("dcsilve_target");
					}
					player.markAuto("dcsilve_self", [trigger.player]);
					const result = await player
						.chooseToUse("私掠：对" + get.translation(trigger.source) + "使用一张【杀】，或弃置一张手牌", function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						})
						.set("targetRequired", true)
						.set("complexTarget", true)
						.set("complexSelect", true)
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.source && !ui.selected.targets.includes(_status.event.source)) {
								return false;
							}
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("source", trigger.source)
						.set("logSkill", event.name)
						.forResult();
					if (!result?.bool) {
						if (player.countCards("h") > 0) {
							await player.chooseToDiscard("h", true).set("logSkill", event.name);
						}
					}
				},
			},
			self: {
				marktext: "私",
				intro: {
					name: "私掠",
					content(storage, player) {
						if (!storage?.length) {
							return "没有打劫对象";
						}
						if (storage[0] == player) {
							return "已绑定" + get.translation(player) + "自己";
						}
						return "打劫对象：" + get.translation(storage);
					},
				},
			},
			target: {
				marktext: "掠",
				intro: {
					name: "私掠",
					content(storage, player) {
						return "被" + get.translation(storage) + "盯上了！";
					},
				},
			},
			robbed: { onremove: true, charlotte: true },
		},
	},
	dcshuaijie: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			var targets = player.getStorage("dcsilve").filter(i => i.isIn());
			if (!targets.length) {
				return true;
			}
			return (
				targets.filter(target => {
					return player.hp > target.hp && player.countCards("e") > target.countCards("e");
				}).length == targets.length
			);
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.loseMaxHp();
			var choices = [];
			var choiceList = ["获得“私掠”角色至多三张牌", "从牌堆随机获得三张类型各不相同的牌"];
			var targets = player.getStorage("dcsilve").filter(i => i.isIn());
			event.targets = targets;
			if (targets.length) {
				choices.push("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5; ">' + choiceList[0] + "</span>";
			}
			choices.push("选项二");
			player
				.chooseControl(choices)
				.set("prompt", "衰劫：选择一项")
				.set("choiceList", choiceList)
				.set("ai", () => _status.event.choice)
				.set(
					"choice",
					(function () {
						var eff = 0;
						for (var target of targets) {
							eff += get.effect(target, { name: "shunshou_copy2" }, player, player) * 2;
						}
						eff -= get.effect(player, { name: "dongzhuxianji" }, player, player);
						return eff > 0 && choices.includes("选项一") ? "选项一" : "选项二";
					})()
				);
			"step 1";
			if (result.control == "选项一") {
				if (targets.length) {
					for (var target of targets) {
						if (target.countGainableCards(player, "he") > 0) {
							player.line(target);
							player.gainPlayerCard(target, "he", true, [1, 3]);
						}
					}
				}
			} else {
				var cards = [];
				for (var i = 0; i < 3; i++) {
					var card = get.cardPile2(cardx => {
						return cards.filter(cardxx => get.type2(cardxx) == get.type2(cardx)).length == 0;
					}, "random");
					if (card) {
						cards.push(card);
					}
				}
				if (cards.length) {
					player.gain(cards, "gain2");
				}
			}
			"step 2";
			var targets = player.getStorage("dcsilve").filter(i => i.isIn());
			for (var target of targets) {
				target.unmarkAuto("dcsilve_target", [player]);
			}
			delete player.storage.dcsilve;
			delete player.storage.dcsilve_self;
			player.markAuto("dcsilve", [player]);
			player.markAuto("dcsilve_self", [player]);
		},
		ai: {
			combo: "dcsilve",
			order: 8,
			result: {
				player(player) {
					var targets = player.getStorage("dcsilve").filter(i => i.isIn());
					if (!targets.length) {
						return 1;
					}
					var att = 0;
					targets.forEach(i => (att += get.attitude(player, i)));
					if (att < 0) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	//庞会
	dcyiyong: {
		audio: 2,
		trigger: {
			source: "damageBegin1",
		},
		//usable:2,
		filter(event, player) {
			return player.countDiscardableCards(player, "he") > 0 && player != event.player;
		},
		check(event, player) {
			return (
				get.attitude(player, event.player) < 0 &&
				player.countCards("he", card => lib.filter.cardDiscardable(card, player, "dcyiyong") && get.value(card, player) < 7) > 0
			);
		},
		logTarget: "player",
		content() {
			"step 0";
			event.list = [player];
			event.cards0 = [];
			event.cards1 = [];
			if (trigger.player.countDiscardableCards(trigger.player, "he") > 0) {
				event.list.push(trigger.player);
			}
			if (!event.isMine() && !event.isOnline()) {
				game.delayx();
			}
			player
				.chooseCardOL(event.list, "he", true, [1, Infinity], "异勇：弃置任意张牌", (card, player, target) => {
					return lib.filter.cardDiscardable(card, player, "dcyiyong");
				})
				.set("allowChooseAll", true)
				.set("ai", card => {
					var evt = _status.event.getParent(2);
					var source = evt.player,
						player = _status.event.player,
						target = evt.list[1];
					if (!target) {
						return get.unuseful(card);
					}
					if (player == source) {
						var total = 0,
							need = 0;
						target.countCards("he", card => {
							if (lib.filter.cardDiscardable(card, target, "dcyiyong") && get.value(card) < 5) {
								need += get.number(card);
							}
						});
						for (var i of ui.selected.cards) {
							total += get.number(i);
						}
						if (total >= need + 5) {
							return 0;
						}
						var val = 6;
						if (
							target.hp <= 2 &&
							!target.hasSkillTag("filterDamage", null, {
								player: player,
								card: evt.getTrigger().card,
							})
						) {
							val += 2 + get.number(card) / 5;
						}
						if (target.countCards("he", card => get.value(card) < 5) >= 3) {
							val -= 3 + get.number(card) / 5;
						}
						return val - get.value(card);
					}
					if (ui.selected.cards.length > 1 && ui.selected.cards.length + 2 >= source.countCards("he")) {
						return 0;
					}
					if (
						player.hp <= 2 &&
						!target.hasSkillTag("filterDamage", null, {
							player: player,
							card: evt.getTrigger().card,
						})
					) {
						return 10 - get.value(card);
					}
					return 5 - get.value(card);
				});
			"step 1";
			var lose_list = [],
				cards = [];
			for (var i = 0; i < result.length; i++) {
				var current = event.list[i],
					cards2 = result[i].cards;
				cards.push(cards2);
				event["cards" + i] = cards2;
				event.cards = cards;
				lose_list.push([current, cards2]);
			}
			game.loseAsync({ lose_list: lose_list }).setContent("discardMultiple");
			"step 2";
			var getn = function (cards) {
				return cards.map(i => get.number(i, false)).reduce((p, c) => p + c, 0);
			};
			var num0 = getn(event.cards0),
				num1 = getn(event.cards1);
			if (num0 <= num1) {
				player.draw(event.cards1.length + 1);
			}
			if (num0 >= num1) {
				trigger.num++;
			}
		},
	},
	dcsuchou: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		forced: true,
		async content(event, trigger, player) {
			const { index } = await player
				.chooseControl()
				.set("prompt", "夙仇：请选择一项")
				.set("choiceList", ["失去1点体力，本阶段使用牌不可被响应", "减1点体力上限，本阶段使用牌不可被响应", "失去〖夙仇〗"])
				.set("ai", () => {
					const player = get.event().player;
					if (player.isHealthy()) {
						return player.maxHp <= 2 ? 2 : 0;
					}
					return 1;
				})
				.forResult();
			switch (index) {
				case 0:
					await player.loseHp();
					player.addTempSkill("dcsuchou_effect", "phaseUseAfter");
					break;
				case 1:
					await player.loseMaxHp();
					player.addTempSkill("dcsuchou_effect", "phaseUseAfter");
					break;
				case 2:
					await player.removeSkills("dcsuchou");
					break;
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				marktext: "仇",
				intro: { content: "使用牌不可被响应" },
				audio: "dcsuchou",
				trigger: { player: "useCard" },
				filter(event, player) {
					return event.card.name == "sha" || get.type(event.card) == "trick";
				},
				forced: true,
				content() {
					trigger.directHit.addArray(game.players);
					game.log(trigger.card, "不可被响应");
				},
				ai: { directHit_ai: true },
			},
		},
	},
	//乐就
	dccuijin: {
		audio: 2,
		trigger: { global: "useCard" },
		filter(event, player) {
			return (
				(event.card.name == "sha" || event.card.name == "juedou") &&
				(event.player == player || player.inRange(event.player)) &&
				player.countCards("he") > 0
			);
		},
		checkx(event, player) {
			const userDamage = get.damageEffect(event.player, player, player);
			let damageBonus = 0,
				mayDamage = 0,
				odds = 2;
			if (event.card.name === "sha") {
				const nature = get.nature(event.card);
				for (let tar of event.targets) {
					if (
						event.player.hasSkillTag("jueqing", false, tar) ||
						tar.hasSkillTag("filterDamage", null, {
							player: event.player,
							card: event.card,
						})
					) {
						continue;
					}
					const hitOdds = 1 - tar.mayHaveShan(player, "use", true, "odds");
					if (
						hitOdds >= 1 ||
						event.player.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: tar,
								card: event.card,
							},
							true
						)
					) {
						damageBonus += get.damageEffect(tar, event.player, player, nature);
					} else {
						odds = Math.min(odds, hitOdds);
						mayDamage += hitOdds * get.damageEffect(tar, event.player, player, nature);
					}
				}
			} else if (event.card.name === "juedou") {
				const targets = event.targets.sortBySeat(_status.currentPhase);
				let userSha = event.player.mayHaveSha(player, "respond", null, "count");
				for (let tar of event.targets) {
					if (
						event.player.hasSkillTag("jueqing", false, tar) ||
						tar.hasSkillTag("filterDamage", null, {
							player: event.player,
							card: event.card,
						})
					) {
						continue;
					}
					// 检查使用者能否强命目标或者剩余【杀】够不够决斗
					if (
						event.player.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: tar,
								card: event.card,
							},
							true
						) ||
						(userSha -= tar.mayHaveSha(player, "respond", null, "count")) >= 0
					) {
						damageBonus += get.damageEffect(tar, event.player, player);
					} else {
						damageBonus += get.damageEffect(event.player, tar, player);
					}
				}
			}
			if (damageBonus) {
				return damageBonus;
			}
			if (!mayDamage || odds > 1) {
				return get.damageEffect(event.player, player, player) + 2 * get.effect(player, "draw", player, player);
			}
			return mayDamage + (1 - odds) * (get.damageEffect(event.player, player, player) + 2 * get.effect(player, "draw", player, player));
		},
		async cost(event, trigger, player) {
			const skillName = event.name.slice(0, -5);
			event.result = await player
				.chooseToDiscard(
					"he",
					get.prompt(skillName, trigger.player),
					"弃置一张牌并令" +
						get.translation(trigger.player) +
						"使用的" +
						get.translation(trigger.card) +
						"伤害+1，但若其未造成伤害，则你摸两张牌并对其造成1点伤害。"
				)
				.set("ai", function (card) {
					const goon = get.event().goon;
					if (goon) {
						return goon - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					(() => {
						const num = (lib.skill.dccuijin.checkx(trigger, player) * player.countCards("he")) / 10;
						// game.log(trigger.player, "对", trigger.targets, "使用", trigger.card, "，乐就发动技能的收益为", num);
						return num;
					})()
				)
				.set("chooseonly", true)
				.set("logSkill", [skillName, trigger.player])
				.forResult();
			event.result.skill_popup = false;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.discard(event.cards);
			if (typeof trigger.baseDamage !== "number") {
				trigger.baseDamage = 1;
			}
			trigger.baseDamage++;
			player.addSkill("dccuijin_damage");
			player.markAuto("dccuijin_damage", [trigger.card]);
			if (!player.storage.dccuijin_map) {
				player.storage.dccuijin_map = { cards: [], targets: [] };
			}
			player.storage.dccuijin_map.cards.push(trigger.card);
			player.storage.dccuijin_map.targets.push(trigger.targets.slice());
		},
		subSkill: {
			damage: {
				trigger: {
					global: [
						"damage",
						"damageCancelled",
						"damageZero",
						"shaMiss",
						"useCardToExcluded",
						"useCardToEnd",
						"eventNeutralized",
						"useCardAfter",
						"shaCancelled",
					],
				},
				forced: true,
				silent: true,
				firstDo: true,
				charlotte: true,
				onremove: true,
				filter(event, player, name) {
					if (!event.card) {
						return false;
					}
					var cards = player.getStorage("dccuijin_damage");
					if (!cards.includes(event.card)) {
						return false;
					}
					return true;
				},
				content() {
					"step 0";
					var card = trigger.card,
						idx = player.storage.dccuijin_map.cards.indexOf(card);
					if (event.triggername == "useCardAfter") {
						var cards = player.getStorage("dccuijin_damage");
						cards = cards.remove(card);
						if (!cards.length) {
							player.removeSkill("dccuijin_damage");
							delete player.storage.dccuijin_map;
						} else if (idx !== -1) {
							player.storage.dccuijin_map.cards.splice(idx, 1);
							player.storage.dccuijin_map.targets.splice(idx, 1);
						}
						event.finish();
					} else if (idx !== -1) {
						var target, source;
						if (trigger.name.indexOf("damage") == 0) {
							target = trigger.player;
							source = trigger.source;
						} else {
							target = trigger.target;
							source = trigger.player;
						}
						if (
							player.storage.dccuijin_map.targets[idx].includes(target) &&
							!target.hasHistory("damage", evt => {
								return evt.card == card;
							})
						) {
							player.logSkill("dccuijin_damage", source);
							player.storage.dccuijin_map.targets[idx].remove(target);
							player.draw(2);
							if (source && source.isIn()) {
								player.line(source, "green");
								source.damage();
							}
						}
					}
					"step 1";
					game.delayx();
				},
			},
		},
	},
	//陈矫
	dcxieshou: {
		audio: 2,
		trigger: {
			global: "damageEnd",
		},
		usable: 1,
		filter(event, player) {
			return get.distance(player, event.player) <= 2 && event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) > 4;
		},
		locked: false,
		logTarget: "player",
		onremove: true,
		change(player, num) {
			player.addSkill("dcxieshoux");
			if (typeof player.storage.dcxieshoux !== "number") {
				player.storage.dcxieshoux = 0;
			}
			if (!num) {
				return;
			}
			player.storage.dcxieshoux += num;
			if (player.storage.dcxieshoux != 0) {
				player.markSkill("dcxieshoux");
			} else {
				player.unmarkSkill("dcxieshoux");
			}
			game.log(player, "的手牌上限", (num > 0 ? "+" : "") + num);
		},
		content() {
			"step 0";
			lib.skill.dcxieshou.change(player, -1);
			"step 1";
			var list = [],
				target = trigger.player;
			event.target = target;
			var choiceList = ["回复1点体力", "复原，摸两张牌"];
			if (target.getDamagedHp() == 0) {
				choiceList[0] = '<span style="opacity:0.5; ">' + choiceList[0] + "</span>";
			} else {
				list.push("选项一");
			}
			list.push("选项二");
			target
				.chooseControl(list)
				.set("choiceList", choiceList)
				.set("prompt", get.translation(player) + "对你发动了【协守】，请选择一项");
			"step 2";
			if (result.control == "选项一") {
				target.recover();
			} else {
				target.link(false);
				target.draw(2);
			}
		},
		ai: {
			expose: 0.3,
		},
	},
	dcxieshoux: {
		markimage: "image/card/handcard.png",
		intro: {
			content(storage, player) {
				var num = player.storage.dcxieshoux;
				return "手牌上限" + (num >= 0 ? "+" : "") + num;
			},
		},
		charlotte: true,
		mod: {
			maxHandcard(player, num) {
				return num + (player.storage.dcxieshoux || 0);
			},
		},
	},
	dcqingyan: {
		audio: 2,
		trigger: {
			target: "useCardToTargeted",
		},
		filter(event, player) {
			return event.player != player && get.color(event.card) == "black";
		},
		usable: 2,
		async cost(event, trigger, player) {
			if (player.countCards("h") < player.hp) {
				event.result = await player
					.chooseBool(get.prompt(event.skill), "将手牌摸至体力上限（摸" + get.cnNumber(player.maxHp - player.countCards("h")) + "张牌）")
					.set("ai", () => 1)
					.forResult();
			} else {
				event.result = await player
					.chooseToDiscard(get.prompt(event.skill), "弃置一张手牌令你的手牌上限+1", "chooseonly")
					.set("ai", card => 6 - get.value(card))
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (event.cards && event.cards.length) {
				await player.discard(event.cards);
				lib.skill.dcxieshou.change(player, 1);
			} else {
				player.drawTo(player.maxHp);
			}
		},
	},
	dcqizi: {
		mod: {
			cardSavable(card, player, target) {
				if (get.distance(player, target) > 2 && card.name == "tao" && target == _status.event.dying) {
					return false;
				}
			},
		},
		ai: {
			neg: true,
		},
	},
	//公孙度
	dczhenze: {
		audio: 2,
		trigger: { player: "phaseDiscardBegin" },
		direct: true,
		content() {
			"step 0";
			var getCond = player => Math.sign(player.countCards("h") - Math.max(0, player.hp));
			var me = getCond(player);
			var recovers = game.filterPlayer(current => getCond(current) == me),
				loses = game.filterPlayer().removeArray(recovers);
			event.recovers = recovers;
			event.loses = loses;
			var list = [];
			if (loses.length) {
				list.push("选项一");
			}
			if (recovers.length) {
				list.push("选项二");
			}
			list.push("cancel2");
			var sign = [
				["≥", "＜"],
				["≠", "＝"],
				["≤", "＞"],
			];
			var choiceList = [
				"令所有手牌数" + sign[me + 1][0] + "体力值的角色失去1点体力" + (loses.length ? "（" + get.translation(loses) + "）" : ""),
				"令所有手牌数" + sign[me + 1][1] + "体力值的角色回复1点体力" + (recovers.length ? "（" + get.translation(recovers) + "）" : ""),
			];
			if (!loses.length) {
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			}
			if (!recovers.length) {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			player
				.chooseControl(list)
				.set("choiceList", choiceList)
				.set("prompt", get.prompt("dczhenze"))
				.set("ai", () => _status.event.choice)
				.set(
					"choice",
					(() => {
						let eff1 = loses.reduce((prev, i) => prev + get.effect(i, { name: "losehp" }, player, player), 0),
							eff2 = recovers.reduce((prev, i) => prev + get.recoverEffect(i, player, player), 0),
							max = Math.max(0, eff1, eff2);
						if (max === 0) {
							return "cancel2";
						}
						if (eff1 > eff2) {
							return "选项一";
						}
						return "选项二";
					})()
				);
			"step 1";
			if (result.control == "cancel2") {
				event.finish();
			} else {
				var lose = result.control == "选项一",
					targets = event[lose ? "loses" : "recovers"];
				player.logSkill("dczhenze", targets);
				for (var i of targets) {
					i[lose ? "loseHp" : "recover"]();
				}
			}
		},
	},
	dcanliao: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return game.countPlayer(current => current.group == "qun");
		},
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.dcanliao.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target.countCards("he");
		},
		content() {
			"step 0";
			player
				.choosePlayerCard(target, "he", true)
				.set("filterButton", function (button) {
					var card = button.link,
						owner = get.owner(card);
					return !owner || owner.canRecast(card, _status.event.player);
				})
				.set("ai", function (card) {
					if (get.attitude(_status.event.player, _status.event.getParent().target) >= 0) {
						return -get.buttonValue(card);
					}
					return get.buttonValue(card);
				});
			"step 1";
			if (result.bool) {
				target.recast(result.links);
			}
		},
		ai: {
			expose: 0.1,
			result: {
				target(player, target) {
					if (target.hasCard(card => get.value(card) >= 6, "e") && get.attitude(player, target) < 0) {
						return -1;
					}
					return 1;
				},
			},
		},
	},
	//王烈
	dcchongwang: {
		audio: 2,
		trigger: { global: "useCard" },
		direct: true,
		filter(event, player) {
			if (player == event.player) {
				return false;
			}
			var type = get.type(event.card);
			if (type != "basic" && type != "trick") {
				return false;
			}
			var history = game.getAllGlobalHistory("useCard");
			var index = history.indexOf(event);
			if (index > 0) {
				return history[index - 1].player == player;
			}
			return false;
		},
		content() {
			"step 0";
			var source = trigger.player;
			var list = [["exclude", "令" + get.translation(trigger.card) + "无效"]];
			var cards = trigger.cards.filterInD();
			if (source.isIn() && cards.length > 0) {
				list.push(["gain", "令" + get.translation(source) + "收回" + get.translation(cards)]);
			}
			player.chooseButton([get.prompt("dcchongwang", source), [list, "textbutton"], "noforcebutton"]).set("ai", function (button) {
				var player = _status.event.player,
					choice = button.link;
				var evt = _status.event.getTrigger();
				if (choice == "exclude") {
					var effect = 0;
					if (!evt.targets.length && get.info(evt.card, false).notarget) {
						effect -= get.effect(evt.player, evt.card, evt.player, player);
					}
					for (var i of evt.targets) {
						effect -= get.effect(i, evt.card, evt.player, player);
					}
					return effect;
				} else {
					var cards = evt.cards.filterInD();
					return get.value(cards, evt.player) * get.attitude(player, evt.player);
				}
			});
			"step 1";
			if (result.bool) {
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.logSkill("dcchongwang", trigger.player);
				if (result.links[0] == "gain") {
					player.addTempSkill("dcchongwang_gain");
					trigger._dcchongwang = true;
				} else {
					trigger.targets.length = 0;
					trigger.all_excluded = true;
					game.log(trigger.card, "被无效了");
				}
			}
		},
		ai: {
			threaten: 3.5,
			directHit_ai: true,
		},
		subSkill: {
			gain: {
				trigger: { global: "useCardAfter" },
				charlotte: true,
				forced: true,
				popup: false,
				filter(event, player) {
					return event._dcchongwang;
				},
				content() {
					trigger.player.gain(trigger.cards.filterInD(), "gain2");
				},
			},
		},
	},
	dchuagui: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		async cost(event, trigger, player) {
			const min = Math.max.apply(
				Math,
				game.filterPlayer().map(current => 1 + current.getFriends().length)
			);
			const max = Math.min(
				min,
				game.countPlayer(current => current != player && current.countCards("he") > 0)
			);
			event.result = await player
				.chooseTarget(get.prompt(event.skill), `令至多${get.cnNumber(max)}名角色进行囚徒困境选择`, [1, max], (card, player, target) => {
					return target != player && target.countCards("he") > 0;
				})
				.set("animate", false)
				.set("ai", target => {
					return -get.attitude(get.player(), target);
				})
				.forResult();
		},
		logLine: false,
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			const shown = [],
				given = [];
			const map = await game.chooseAnyOL(targets, get.info(event.name).chooseButton, [player]).forResult();
			for (const target of targets) {
				target.addExpose(0.05);
				const { links } = map.get(target);
				let choice;
				if (links[0] == 0) {
					choice = "仅展示牌";
					shown.push([links[1], target, choice]);
				} else {
					choice = "交给牌";
					given.push([links[1], target, choice]);
				}
				target.popup(choice);
				game.log(target, "选择了", "#y" + choice);
			}
			if (shown.length) {
				await player
					.showCards(
						shown.flatMap(item => item[0]),
						get.translation(player) + "发动了【化归】"
					)
					.set("customButton", button => {
						const target = get.owner(button.link);
						if (target) {
							game.createButtonCardsetion(target.getName(true), button);
						}
					})
					.set("delay_time", 4)
					.set(
						"showers",
						shown.flatMap(item => item[1])
					);
			}
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				(name, id, results) => {
					const dialog = ui.create.dialog(name + "发动了【化归】", "hidden", "forcebutton");
					dialog.videoId = id;
					dialog.classList.add("scroll1");
					dialog.classList.add("scroll2");
					dialog.classList.add("fullwidth");
					dialog.classList.add("fullheight");
					dialog.buttonss = [];

					const list = ["仅展示牌的玩家", "交出牌的玩家"];
					for (let i = 0; i < list.length; i++) {
						dialog.add('<div class="text center">' + list[i] + "</div>");
						const buttons = ui.create.div(".buttons", dialog.content);
						dialog.buttonss.push(buttons);
						buttons.classList.add("popup");
						buttons.classList.add("guanxing");
					}
					dialog.open();

					const getx = function () {
						const item = results.shift();
						const card = item[0],
							index = item[2] == "仅展示牌" ? 0 : 1;
						const button = ui.create.button(card, "card", dialog.buttonss[index]);
						game.createButtonCardsetion(item[1].getName(true), button);
						if (results.length > 0) {
							setTimeout(getx, 500);
						}
					};
					setTimeout(getx, 500);
				},
				get.translation(player),
				event.videoId,
				shown.concat(given)
			);
			await game.delay(0, 2000 + (shown.length + given.length) * 500);
			game.broadcastAll("closeDialog", event.videoId);
			const list = given.length > 0 ? given : shown;
			const cards = list.flatMap(item => item[0]);
			player.line(list.map(item => item[1]));
			await player.gain(cards, "give");
		},
		chooseButton(player, source, eventId) {
			const str = get.translation(source);
			return player
				.chooseButton(
					2,
					[
						`###${str}对你发动了【化归】，选择展示或交给其一张牌###<div class="text center">若所有人都选择了仅展示，则${str}获得这张牌</div>`,
						player.getCards("he"),
						[
							["仅展示一张牌", `将一张牌交给${str}`].map((item, i) => {
								return [i, item];
							}),
							"textbutton",
						],
					],
					true
				)
				.set("filterButton", button => {
					const { link } = button;
					if (!ui.selected.buttons.length) {
						return typeof link == "number";
					}
					return get.itemtype(link) == "card";
				})
				.set("source", source)
				.set("id", eventId)
				.set("_global_waiting", true)
				.set("ai", button => {
					const { player, source } = get.event();
					const { link } = button;
					const att = get.attitude(player, source),
						hs = player.getCards("he");
					hs.sort((b, a) => get.value(b, player) - get.value(a, player));
					if (!ui.selected.buttons.length) {
						if (att < -2 && Math.random() > (get.value(hs[0], player) - 3) / 5 && link == 1) {
							return 2;
						}
						if (link == 0) {
							return 1;
						}
					} else {
						const choice = ui.selected.buttons[0].link;
						if (choice == 0) {
							return 6 - get.value(link);
						}
						return 6 + (att > 0 ? 1.5 : 0) - get.value(link);
					}
				});
		},
	},
	//陈珪
	dcyingtu: {
		audio: 2,
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		usable: 1,
		getIndex(event, player) {
			var targets = [];
			if (lib.skill.dcyingtu.filterx(event, player, player.getNext())) {
				targets.add(player.getNext());
			}
			if (lib.skill.dcyingtu.filterx(event, player, player.getPrevious())) {
				targets.add(player.getPrevious());
			}
			return targets.sortBySeat(_status.currentPhase);
		},
		filterx(event, player, target) {
			var evt = event.getParent("phaseDraw");
			if (evt && target == evt.player) {
				return false;
			}
			return (
				event.getg(target).length > 0 &&
				target.hasCard(function (card) {
					return lib.filter.canBeGained(card, target, player);
				}, "he")
			);
		},
		logTarget(event, player, triggername, target) {
			return target;
		},
		check(event, player, triggername, source) {
			var target = source == player.getNext() ? player.getPrevious() : player.getNext();
			return Math.min(0, get.attitude(player, target)) >= get.attitude(player, source);
		},
		prompt2: "获得该角色的一张牌，然后将一张牌交给该角色的对位角色。若你给出的是装备牌，则其使用其得到的牌。",
		content() {
			"step 0";
			var target = event.targets[0];
			event.target = target;
			event.side = target == player.getPrevious() ? "getNext" : "getPrevious";
			player.gainPlayerCard(target, true, "he");
			"step 1";
			var he = player.getCards("he");
			if (he.length > 0) {
				var target = player[event.side]();
				event.target = target;
				if (he.length == 1) {
					event._result = { bool: true, cards: he };
				} else {
					player.chooseCard("he", true, "交给" + get.translation(target) + "一张牌");
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var card = result.cards[0];
				event.card = card;
				player.line(target);
				player.give(card, target);
			} else {
				event.finish();
			}
			"step 3";
			if (target.getCards("h").includes(card) && get.type(card, null, target) == "equip" && target.canUse(card, target)) {
				target.chooseUseTarget(card, true, "nopopup");
			}
		},
	},
	dccongshi: {
		audio: 2,
		trigger: { global: "useCardAfter" },
		forced: true,
		filter(event, player) {
			return get.type(event.card, null, false) == "equip" && event.player.isMaxEquip();
		},
		content() {
			player.draw();
		},
	},
	//黄权
	dcquanjian: {
		audio: 2,
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("劝谏：令一名其他角色…", "hidden");
				dialog.add([
					[
						["damage", "对其攻击范围内的一名角色造成1点伤害"],
						["draw", "将其手牌数调整至手牌上限（至多摸至五张），且其本回合内不能使用手牌"],
					],
					"textbutton",
				]);
				return dialog;
			},
			filter(button, player) {
				return !player.getStorage("dcquanjian_used").includes(button.link);
			},
			check: () => 1 + Math.random(),
			backup(links) {
				return get.copy(lib.skill["dcquanjian_" + links[0]]);
			},
			prompt(links) {
				if (links[0] == "damage") {
					return "令一名其他角色对攻击范围内的另一名角色造成1点伤害";
				}
				return "令一名其他角色将手牌数调整至手牌上限（至多摸至五张）且本回合内不能使用手牌";
			},
		},
		ai: {
			order: 2,
			result: { player: 1 },
		},
		subSkill: {
			backup: { audio: "dcquanjian" },
			used: {
				charlotte: true,
				onremove: true,
			},
			damage: {
				audio: "dcquanjian",
				selectTarget: 2,
				filterTarget(card, player, target) {
					if (!ui.selected.targets.length) {
						return target != player;
					}
					return ui.selected.targets[0].inRange(target);
				},
				complexTarget: true,
				complexSelect: true,
				filterCard: () => false,
				selectCard: -1,
				targetprompt: ["造成伤害", "受到伤害"],
				multitarget: true,
				content() {
					"step 0";
					player.addTempSkill("dcquanjian_used", "phaseUseAfter");
					player.markAuto("dcquanjian_used", "damage");
					targets[0]
						.chooseControl()
						.set("choiceList", ["对" + get.translation(targets[1]) + "造成1点伤害", "本回合下次受到的伤害+1"])
						.set("ai", function () {
							return _status.event.eff >= 0 ? 0 : 1;
						})
						.set("eff", get.damageEffect(targets[1], targets[0], targets[0]));
					"step 1";
					if (result.index == 0) {
						targets[1].damage(targets[0]);
					} else {
						target.addMark("dcquanjian_effect", 1, false);
						target.addTempSkill("dcquanjian_effect");
					}
				},
				ai: {
					result: {
						player(player, target) {
							if (ui.selected.targets.length == 0) {
								if (!game.hasPlayer(current => current.inRangeOf(target) && get.damageEffect(current, target, player) > 0)) {
									return 0;
								}
								if (get.attitude(player, target) > 0) {
									return 2;
								}
								return 1;
							}
							return get.damageEffect(target, ui.selected.targets[0], player, player);
						},
					},
				},
			},
			draw: {
				audio: "dcquanjian",
				filterTarget: lib.filter.notMe,
				filterCard: () => false,
				selectCard: -1,
				content() {
					"step 0";
					player.addTempSkill("dcquanjian_used", "phaseUseAfter");
					player.markAuto("dcquanjian_used", "draw");
					var num1 = target.countCards("h"),
						num2 = target.getHandcardLimit();
					var num = 0;
					if (num1 > num2) {
						event.index = 0;
						num = num1 - num2;
						target
							.chooseControl()
							.set("choiceList", ["弃置" + get.cnNumber(num) + "张手牌，且本回合内不能使用或打出手牌", "本回合下次受到的伤害+1"])
							.set("ai", function () {
								var player = _status.event.player;
								if (
									_status.event.number == 1 &&
									player.hasCard(function (card) {
										return lib.filter.cardDiscardable(card, player, "dcquanjian_draw") && get.value(card) < 5;
									}, "h")
								) {
									return 0;
								}
								return 1;
							})
							.set("number", num);
					} else {
						event.index = 1;
						num = Math.min(num2, 5) - num1;
						target
							.chooseControl()
							.set("choiceList", [
								(num > 0 ? "摸" + get.cnNumber(num) + "张牌且" : "") + "本回合内不能使用或打出手牌",
								"本回合下次受到的伤害+1",
							])
							.set("ai", () => get.event().idx)
							.set(
								"idx",
								(function () {
									if (num > 0) {
										return 0;
									}
									if (get.damageEffect(target, player, target) > 20) {
										return 0;
									}
									return 1;
								})()
							);
					}
					event.num = num;
					"step 1";
					if (result.index == 0) {
						if (event.index == 0) {
							target.chooseToDiscard("h", true, num, "allowChooseAll");
						} else {
							target.draw(num);
						}
						target.addTempSkill("dcquanjian_disable");
					} else {
						target.addMark("dcquanjian_effect", 1, false);
						target.addTempSkill("dcquanjian_effect");
					}
				},
				ai: {
					result: {
						target(player, target) {
							var num1 = target.countCards("h"),
								num2 = target.getHandcardLimit();
							if (num1 > num2) {
								return -1;
							}
							return Math.min(5, num2) - num1;
						},
					},
				},
			},
			effect: {
				charlotte: true,
				trigger: { player: "damageBegin3" },
				forced: true,
				onremove: true,
				marktext: "谏",
				content() {
					trigger.num += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				intro: { content: "下次受到的伤害+#" },
				ai: { threaten: 2.5 },
			},
			disable: {
				charlotte: true,
				mod: {
					cardEnabled2(card, player) {
						if (get.position(card) == "h") {
							return false;
						}
					},
				},
				mark: true,
				marktext: "禁",
				intro: { content: "不能使用或打出手牌" },
				ai: { threaten: 2.5 },
			},
		},
	},
	dctujue: {
		audio: 2,
		trigger: { player: "dying" },
		limited: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(lib.filter.notMe, get.prompt2(event.skill))
				.set("ai", target => {
					const { skip, player } = get.event();
					if (skip) {
						return 0;
					}
					return 200 + get.attitude(player, target);
				})
				.set("skip", player.countCards("hs", { name: ["tao", "jiu"] }) + player.hp > 0)
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const {
				targets: [target],
			} = event;
			const cards = player.getCards("he");
			if (!cards.length) {
				return;
			}
			const num = Math.max(5, cards.length);
			await player.give(cards, target);
			await player.recover(num);
			await player.draw(num);
		},
	},
	//尹夫人
	dcyingyu: {
		audio: 2,
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		direct: true,
		filter(event, player) {
			if (event.name == "phaseJieshu" && !player.storage.dcyingyu) {
				return false;
			}
			return (
				game.countPlayer(function (current) {
					return current.countCards("h") > 0;
				}) > 1
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(
					2,
					get.prompt("dcyingyu"),
					"展示两名角色的各一张手牌。若这两张牌花色不同，则你可以令其中一名角色获得另一名角色的展示牌。",
					function (card, player, target) {
						return target.countCards("h") > 0;
					}
				)
				.set("ai", function (target) {
					var player = _status.event.player;
					if (!ui.selected.targets.length) {
						return get.attitude(player, target);
					}
					return 1 - get.attitude(player, target);
				});
			"step 1";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				event.targets = targets;
				event.cards = [];
				player.logSkill("dcyingyu", targets);
				player.choosePlayerCard(targets[0], true, "h");
			} else {
				event.finish();
			}
			"step 2";
			var card = result.cards[0];
			player.line(targets[0]);
			player.showCards(card, get.translation(player) + "对" + get.translation(targets[0]) + "发动了【媵予】");
			event.cards.push(card);
			player.choosePlayerCard(targets[1], true, "h");
			"step 3";
			var card = result.cards[0];
			player.line(targets[1]);
			player.showCards(card, get.translation(player) + "对" + get.translation(targets[1]) + "发动了【媵予】");
			event.cards.push(card);
			if (get.suit(cards[0], targets[0]) == get.suit(cards[1], targets[1])) {
				event.finish();
			}
			"step 4";
			var str1 = get.translation(targets[0]),
				str2 = get.translation(targets[1]);
			player
				.chooseControl("cancel2")
				.set("choiceList", [
					"令" + str1 + "获得" + str2 + "的" + get.translation(cards[1]),
					"令" + str2 + "获得" + str1 + "的" + get.translation(cards[0]),
				])
				.set("goon", get.attitude(player, targets[0]) > 0 ? 0 : 1)
				.set("ai", () => _status.event.goon);
			"step 5";
			if (result.control != "cancel2") {
				var i = result.index;
				targets[1 - i].give(cards[1 - i], targets[i], "give");
			}
		},
		onremove: true,
	},
	dcyongbi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > 0 && game.hasPlayer(current => lib.skill.dcyongbi.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target != player && target.hasSex("male");
		},
		selectCard: -1,
		filterCard: true,
		position: "h",
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		discard: false,
		lose: false,
		content() {
			"step 0";
			player.awakenSkill(event.name);
			if (player.hasSkill("dcyingyu", null, null, false)) {
				player.storage.dcyingyu = true;
			}
			player.give(cards, target);
			"step 1";
			var list = [];
			for (var i of cards) {
				list.add(get.suit(i, player));
				if (list.length >= 3) {
					break;
				}
			}
			if (list.length >= 2) {
				player.addMark("dcyongbi_eff1", 2, false);
				player.addSkill("dcyongbi_eff1");
				target.addMark("dcyongbi_eff1", 2, false);
				target.addSkill("dcyongbi_eff1");
			}
			if (list.length >= 3) {
				player.addMark("dcyongbi_eff2", 1, false);
				player.addSkill("dcyongbi_eff2");
				target.addMark("dcyongbi_eff2", 1, false);
				target.addSkill("dcyongbi_eff2");
			}
		},
		ai: {
			order(item, player) {
				if (player.hasUnknown()) {
					return 0;
				}
				let list = [];
				for (let i of player.getCards("h")) {
					list.add(get.suit(i, player));
					if (list.length >= 3) {
						return 10;
					}
				}
				return 0;
			},
			result: {
				player: 1.8,
				target(player, target) {
					let zhu = get.zhu(player);
					if (zhu && get.attitude(player, zhu) > 0) {
						if (target == zhu) {
							return 4;
						}
					}
					return 1.8;
				},
			},
		},
		subSkill: {
			eff1: {
				mod: {
					maxHandcard: (player, num) => num + player.countMark("dcyongbi_eff1"),
				},
				charlotte: true,
				onremove: true,
				marktext: "拥",
				intro: { content: "手牌上限+#" },
			},
			eff2: {
				audio: "dcyongbi",
				trigger: { player: "damageBegin4" },
				forced: true,
				filter(event, player) {
					return event.num > 1;
				},
				content() {
					trigger.num -= player.countMark("dcyongbi_eff2");
				},
				charlotte: true,
				onremove: true,
				marktext: "嬖",
				intro: { content: "受到大于1的伤害时，此伤害-#" },
			},
		},
	},
	//吕旷吕翔
	dcshuhe: {
		audio: 2,
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
		check(cardx) {
			var player = _status.event.player;
			var num1 = get.number(cardx),
				players = game.filterPlayer();
			var goon = false,
				effect = 0;
			for (var current of players) {
				var cards = current.getCards("ej", function (card) {
					var num = get.number(card);
					return num == num1;
				});
				if (cards.length) {
					goon = true;
					var att = get.attitude(player, current);
					for (var card of cards) {
						if (get.position(card) == "e") {
							var val = get.value(card, current);
							if (att <= 0) {
								effect += val;
							} else {
								effect -= val / 2;
							}
						} else {
							var eff = get.effect(current, { name: card.viewAs || card.name }, player, player);
							effect -= get.sgn(att) * eff;
						}
					}
				}
			}
			if (goon) {
				if (effect > 0) {
					return 6 + effect - get.value(cardx);
				}
				return 0;
			}
			return game.hasPlayer(function (current) {
				return current != player && get.attitude(player, current) > 0;
			})
				? 6 - get.value(cardx)
				: 0;
		},
		content() {
			"step 0";
			player.showCards(cards, get.translation(player) + "发动了【数合】");
			player.addMark("dcliehou", 1);
			"step 1";
			event.cards2 = [];
			var num1 = get.number(cards[0], player);
			var lose_list = [],
				players = game.filterPlayer();
			for (var current of players) {
				var cards = current.getCards("ej", function (card) {
					var num = get.number(card);
					return num == num1;
				});
				if (cards.length > 0) {
					player.line(current, "thunder");
					current.$throw(cards);
					lose_list.push([current, cards]);
					event.cards2.addArray(cards);
				}
			}
			if (lose_list.length) {
				event.lose_list = lose_list;
				game.loseAsync({
					lose_list: lose_list,
				}).setContent("chooseToCompareLose");
			} else {
				event.goto(3);
				player.chooseTarget(true, lib.filter.notMe, "将" + get.translation(event.cards[0]) + "交给一名其他角色").set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				});
			}
			"step 2";
			var cards = event.cards2;
			if (cards.length > 0) {
				if (event.lose_list) {
					game.delayx();
				}
				player.gain(cards, "gain2");
			}
			event.finish();
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				player.give(cards, target);
			}
		},
		ai: {
			order: 2,
			result: {
				player: 1,
			},
		},
	},
	dcliehou: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		forced: true,
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			var num = Math.min(5, 1 + player.countMark("dcliehou"));
			trigger.num += num;
			trigger._dcliehou = num;
		},
		group: "dcliehou_discard",
		subSkill: {
			discard: {
				audio: "dcliehou",
				trigger: { player: "phaseDrawEnd" },
				forced: true,
				filter(event, player) {
					return typeof event._dcliehou == "number";
				},
				content() {
					"step 0";
					var num = trigger._dcliehou;
					player
						.chooseToDiscard(num, "he", "弃置" + get.cnNumber(num) + "张牌，或失去1点体力")
						.set("ai", function (card) {
							if (_status.event.goon) {
								return 6 - get.value(card);
							}
							return 26 - get.value(card);
						})
						.set("goon", player.hp > Math.max(1, 4 - num) || get.effect(player, { name: "losehp" }, player, player) > 0);
					"step 1";
					if (!result.bool) {
						player.loseHp();
					}
				},
			},
		},
		marktext: "爵",
		intro: {
			name: "列侯(爵)",
			name2: "爵",
			content: "〖列侯〗的摸牌数+#",
		},
	},
	//管亥
	suoliang: {
		audio: 2,
		trigger: { source: "damageSource" },
		logTarget: "player",
		usable: 1,
		filter(event, player) {
			return event.player != player && event.player.maxHp > 0 && event.player.countCards("he") > 0;
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		content() {
			"step 0";
			var target = trigger.player;
			event.target = target;
			player.choosePlayerCard(
				target,
				true,
				"he",
				[1, target.maxHp],
				"选择" + get.translation(target) + "的至多" + get.cnNumber(target.maxHp) + "张牌"
			);
			"step 1";
			if (result.bool) {
				player.showCards(result.cards, get.translation(player) + "对" + get.translation(target) + "发动了【索粮】");
				var cards = result.cards.filter(function (card) {
					var suit = get.suit(card, target);
					if (suit != "heart" && suit != "club") {
						return false;
					}
					return lib.filter.canBeGained(card, target, player);
				});
				if (cards.length) {
					player.gain(cards, target, "giveAuto", "bySelf");
				} else {
					target.modedDiscard(result.cards, player);
				}
			}
		},
	},
	qinbao: {
		audio: 2,
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			return (
				(event.card.name == "sha" || get.type(event.card, null, false) == "trick") &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("h") >= player.countCards("h");
				})
			);
		},
		content() {
			var hs = player.countCards("h");
			trigger.directHit.addArray(
				game.filterPlayer(function (current) {
					return current != player && current.countCards("h") >= hs;
				})
			);
		},
		ai: {
			threaten: 1.4,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return (
					player.countCards("h", function (card) {
						return !ui.selected.cards.includes(card);
					}) <= arg.target.countCards("h")
				);
			},
		},
	},
	//胡昭
	midu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("弥笃：选择要废除或恢复的装备栏或判定区", "hidden");
				dialog.classList.add("withbg");
				dialog.noforcebutton = true;
				var list1 = [],
					list2 = [];
				for (var i = 1; i < 6; i++) {
					for (var j = 0; j < player.countEnabledSlot(i); j++) {
						list1.push(i);
					}
					if (player.hasDisabledSlot(i)) {
						list2.push(i);
					}
				}
				(player.isDisabledJudge() ? list2 : list1).push(-1);
				var addTable = function (list, bool) {
					const adds = [];
					for (var i of list) {
						adds.push([[i, bool], i > 0 ? get.translation("equip" + i) + "栏" : "判定区"]);
					}
					dialog.add([adds, "tdnodes"]);
				};
				if (list1.length) {
					dialog.addText("未废除");
					addTable(list1, true);
				}
				if (list2.length) {
					dialog.addText("已废除");
					addTable(list2, false);
				}
				return dialog;
			},
			filter(button, player) {
				if (!ui.selected.buttons.length) {
					return true;
				}
				if (!ui.selected.buttons[0].link[1]) {
					return false;
				}
				return button.link[1];
			},
			check(button) {
				var player = _status.event.player;
				if (!button.link[1]) {
					if (button.link[0] <= 0) {
						return -10;
					}
					if (
						player.hasCard(function (card) {
							return get.subtype(card) == "equip" + button.link[0];
						}, "hs")
					) {
						return 15;
					}
					return 10;
				}
				if (
					button.link[0] <= 0 ||
					(player.hasEmptySlot(button.link[0]) &&
						!player.hasCard(function (card) {
							return (
								get.subtype(card) == "equip" + button.link[0] &&
								player.canUse(card, player) &&
								get.effect(player, card, player, player) > 0
							);
						}, "hs"))
				) {
					return 5;
				}
				return 0;
			},
			select: [1, Infinity],
			backup(links, player) {
				if (!links[0][1]) {
					return {
						audio: "midu",
						selectCard: -1,
						selectTarget: -1,
						filterCard: () => false,
						filterTarget: () => false,
						equip: links[0][0],
						content() {
							var pos = lib.skill.midu_backup.equip;
							if (pos <= 0) {
								player.enableJudge();
							} else {
								player.enableEquip(pos);
							}
							player.addTempSkills("rehuomo", { player: "phaseBegin" });
						},
					};
				} else {
					return {
						audio: "midu",
						selectCard: -1,
						filterCard: () => false,
						filterTarget: true,
						equip: links.map(i => i[0]).sort(),
						content() {
							var list = lib.skill.midu_backup.equip,
								num = list.length,
								bool = false;
							if (list.includes(-1)) {
								list.remove(-1);
								bool = true;
							}
							if (list.length > 0) {
								player.disableEquip(list);
							}
							if (bool) {
								player.disableJudge();
							}
							target.draw(num);
						},
						ai: {
							tag: {
								draw: 1,
							},
							result: {
								target: 2,
							},
						},
					};
				}
			},
			prompt(links, player) {
				if (!links[0][1]) {
					return "恢复一个装备栏或判定区并获得〖活墨〗";
				}
				var numc = get.cnNumber(links.length);
				return "废除" + numc + "个区域并令一名角色摸" + numc + "张牌";
			},
		},
		derivation: "rehuomo",
		ai: {
			order: 8,
			result: { player: 1 },
		},
		subSkill: { backup: {} },
	},
	xianwang: {
		audio: 2,
		mod: {
			globalTo(source, player, distance) {
				var num = player.countDisabledSlot();
				if (num > 0) {
					return distance + (num > 2 ? 2 : 1);
				}
			},
			globalFrom(source, player, distance) {
				var num = source.countDisabledSlot();
				if (num > 0) {
					return distance - (num > 2 ? 2 : 1);
				}
			},
		},
		ai: {
			combo: "midu",
		},
	},
	//刘巴
	dczhubi: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "loseAsyncAfter"],
		},
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false) {
				return false;
			}
			for (var i of event.cards) {
				if (get.suit(i, event.player) == "diamond") {
					return true;
				}
			}
			return false;
		},
		prompt2: "检索一张【无中生有】并置于牌堆顶",
		async content(event, trigger, player) {
			const card = get.cardPile(function (card) {
				return card.name == "wuzhong" && get.suit(card) != "diamond";
			});
			if (card) {
				game.log(player, "将", card, "置于牌堆顶");
				await game.cardsGotoPile(card, "insert");
				await game.delayx();
			}
		},
	},
	dcliuzhuan: {
		audio: 2,
		group: ["dcliuzhuan_mark", "dcliuzhuan_gain"],
		mod: {
			targetEnabled(card) {
				if (card.cards) {
					for (var i of card.cards) {
						if (i.hasGaintag("dcliuzhuan_tag")) {
							return false;
						}
					}
				} else if (get.itemtype(card) == "card") {
					if (card.hasGaintag("dcliuzhuan_tag")) {
						return false;
					}
				}
			},
		},
		subSkill: {
			gain: {
				audio: "dcliuzhuan",
				trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"] },
				forced: true,
				logTarget: () => _status.currentPhase,
				filter(event, player) {
					var current = _status.currentPhase;
					if (!current) {
						return false;
					}
					if (event.name == "cardsDiscard") {
						var evtx = event.getParent();
						if (evtx.name != "orderingDiscard") {
							return false;
						}
						var evtx2 = evtx.relatedEvent || evtx.getParent();
						return current.hasHistory("lose", function (evtx3) {
							var evtx4 = evtx3.relatedEvent || evtx3.getParent();
							if (evtx2 != evtx4) {
								return false;
							}
							for (var i in evtx3.gaintag_map) {
								if (evtx3.gaintag_map[i].includes("dcliuzhuan_tag")) {
									return true;
								}
							}
						});
						//return false;
					} else if (event.name == "lose") {
						if (event.player != current || event.position != ui.discardPile) {
							return false;
						}
						for (var i in event.gaintag_map) {
							if (event.gaintag_map[i].includes("dcliuzhuan_tag")) {
								return true;
							}
						}
						return false;
					}
					return current.hasHistory("lose", function (evt) {
						if (evt.getParent() != event || evt.position != ui.discardPile) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("dcliuzhuan_tag")) {
								return true;
							}
						}
					});
				},
				async content(event, trigger, player) {
					let cards;
					const current = _status.currentPhase;
					if (trigger.name == "lose") {
						cards = trigger.hs.filter(function (i) {
							return (
								trigger.gaintag_map[i.cardid] &&
								trigger.gaintag_map[i.cardid].includes("dcliuzhuan_tag") &&
								get.position(i, true) == "d"
							);
						});
					} else if (trigger.name == "cardsDiscard") {
						const evtx = trigger.getParent();
						const evtx2 = evtx.relatedEvent || evtx.getParent();
						let bool = false;
						const history = current.getHistory("lose", function (evtx3) {
							const evtx4 = evtx3.relatedEvent || evtx3.getParent();
							if (evtx2 != evtx4) {
								return false;
							}
							for (const i in evtx3.gaintag_map) {
								if (evtx3.gaintag_map[i].includes("dcliuzhuan_tag")) {
									return true;
								}
							}
						});
						cards = trigger.cards.filter(function (i) {
							for (const evt of history) {
								if (
									evt.gaintag_map[i.cardid] &&
									evt.gaintag_map[i.cardid].includes("dcliuzhuan_tag") &&
									get.position(i, true) == "d"
								) {
									return true;
								}
							}
							return false;
						});
					} else {
						cards = [];
						current.getHistory("lose", function (evt) {
							if (evt.getParent() != trigger || evt.position != ui.discardPile) {
								return false;
							}
							for (const card of evt.hs) {
								if (get.position(card, true) != "d") {
									continue;
								}
								const i = card.cardid;
								if (evt.gaintag_map[i] && evt.gaintag_map[i].includes("dcliuzhuan_tag")) {
									cards.push(card);
								}
							}
						});
					}
					if (cards && cards.length > 0) {
						await player.gain(cards, "gain2");
					}
				},
			},
			mark: {
				trigger: { global: "gainBegin" },
				forced: true,
				popup: false,
				silent: true,
				lastDo: true,
				filter(event, player) {
					if (player == event.player || event.player != _status.currentPhase) {
						return false;
					}
					var evt = event.getParent("phaseDraw");
					if (evt && evt.name == "phaseDraw") {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					trigger.gaintag.add("dcliuzhuan_tag");
					trigger.player.addTempSkill("dcliuzhuan_tag");
				},
			},
			tag: {
				charlotte: true,
				onremove: (player, skill) => player.removeGaintag(skill),
			},
		},
	},
	//张勋
	suizheng: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("suizheng"), "令一名角色下回合内获得〖随征〗效果").set("", function (target) {
				var player = _status.event.player,
					att = get.attitude(player, target);
				if (target.hasJudge("lebu")) {
					return att / 2;
				}
				return att * get.threaten(target) * Math.sqrt(2 + player == target ? player.countCards("h", "sha") * 2 : target.countCards("h"));
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("suizheng", target);
				target.addMark("suizheng_effect", 1, false);
				target.markAuto("suizheng_source", [player]);
				target.addTempSkill("suizheng_effect", {
					player: player == target ? "phaseJieshuBefore" : "phaseAfter",
				});
			}
		},
		subSkill: {
			effect: {
				audio: "suizheng",
				charlotte: true,
				mod: {
					targetInRange(card) {
						if (card.name == "sha") {
							return true;
						}
					},
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + 2 * player.countMark("suizheng_effect");
						}
					},
				},
				trigger: { player: "phaseUseEnd" },
				forced: true,
				popup: false,
				filter(event, player) {
					var list = player.getStorage("suizheng_source");
					if (!list.filter(i => i.isIn().length)) {
						return false;
					}
					return player.hasHistory("sourceDamage", function (evt) {
						return evt.player.isIn() && evt.getParent("phaseUse") == event;
					});
				},
				content() {
					"step 0";
					var targets = player.getStorage("suizheng_source").slice(0).sortBySeat();
					event.targets = targets;
					"step 1";
					var target = targets.shift();
					event.target = target;
					var list = [];
					player.getHistory("sourceDamage", function (evt) {
						if (evt.player.isIn() && evt.getParent("phaseUse") == trigger) {
							list.add(evt.player);
						}
					});
					if (!list.length) {
						event.finish();
					} else if (target.isIn()) {
						list = list.filter(function (i) {
							return target.canUse("sha", i, false);
						});
						if (list.length > 0) {
							target
								.chooseTarget("随征：是否对一名角色使用【杀】？", function (card, player, target) {
									return _status.event.targets.includes(target);
								})
								.set("targets", list)
								.set("ai", function (target) {
									var player = _status.event.player;
									return get.effect(target, { name: "sha" }, player, player);
								});
						}
					} else {
						event._result = { bool: false };
					}
					"step 2";
					if (result.bool) {
						target.useCard(
							{
								name: "sha",
								isCard: true,
							},
							result.targets,
							false,
							"suizheng_effect"
						);
					}
					if (targets.length > 0) {
						event.goto(1);
					}
				},
				onremove(player) {
					delete player.storage.suizheng_effect;
					delete player.storage.suizheng_source;
				},
				intro: { content: "使用【杀】无距离限制且次数上限+#" },
			},
		},
	},
	//纪灵
	dcshuangren: {
		audio: "shuangren",
		trigger: { player: "phaseUseBegin" },
		direct: true,
		preHidden: true,
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && player.canCompare(current);
				})
			);
		},
		content() {
			"step 0";
			var goon;
			if (player.needsToDiscard() > 1) {
				goon = player.hasCard(function (card) {
					return card.number > 10 && get.value(card) <= 5;
				});
			} else if (player.hasSha()) {
				goon = player.hasCard(function (card) {
					return (card.number >= 9 && get.value(card) <= 5) || get.value(card) <= 3;
				});
			} else {
				goon = player.hasCard(function (card) {
					return get.value(card) <= 5;
				});
			}
			player
				.chooseTarget(get.prompt2("dcshuangren"), function (card, player, target) {
					return player.canCompare(target);
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					if (_status.event.goon && get.attitude(player, target) < 0) {
						return get.effect(target, { name: "sha" }, player, player);
					}
					return 0;
				})
				.set("goon", goon)
				.setHiddenSkill(event.name);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("dcshuangren", target);
				player.chooseToCompare(target);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = event.target;
				if (
					game.hasPlayer(function (current) {
						if (target == current || target.group != current.group) {
							return false;
						}
						return player.canUse("sha", current, false);
					})
				) {
					var str = "请选择视为使用【杀】的目标";
					var str2 =
						"操作提示：选择一名角色B，或选择包含A（" +
						get.translation(target) +
						"）在内的两名角色A和B（B的势力需为" +
						get.translation(target.group) +
						"势力）";
					player
						.chooseTarget([1, 2], str, str2, true, function (card, player, target) {
							if (!player.canUse("sha", target, false)) {
								return false;
							}
							var current = _status.event.target;
							if (target == current) {
								return true;
							}
							if (target.group != current.group) {
								return false;
							}
							if (!ui.selected.targets.length) {
								return true;
							}
							return ui.selected.targets[0] == current;
							//return current==target;
						})
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.effect(target, { name: "sha" }, player, player);
						})
						.set("target", target)
						.set("complexTarget", true);
				} else {
					player.useCard({ name: "sha", isCard: true }, target, false);
					event.finish();
				}
			} else {
				player.addTempSkill("dcshuangren_debuff", "phaseUseAfter");
				event.finish();
			}
			"step 3";
			if (result.bool && result.targets && result.targets.length) {
				player.useCard({ name: "sha", isCard: true }, result.targets, false);
			}
		},
		subSkill: {
			debuff: {
				charlotte: true,
				mod: {
					cardEnabled(card) {
						if (card.name == "sha") {
							return false;
						}
					},
				},
			},
		},
	},
	//羊祜
	dcdeshao: {
		audio: 2,
		usable: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return player != event.player && get.color(event.card) == "black";
		},
		logTarget: "player",
		check(event, player) {
			var eff = get.effect(player, { name: "draw" }, player, player);
			if (player.countCards("h") + 1 <= event.player.countCards("h") && event.player.countCards("he") > 0) {
				eff += get.effect(event.player, { name: "guohe_copy2" }, player, player);
			}
			return eff;
		},
		content() {
			"step 0";
			player.draw();
			"step 1";
			var target = trigger.player;
			if (player.countCards("h") <= target.countCards("h") && target.countCards("he") > 0) {
				player.discardPlayerCard(target, true, "he");
				player.addExpose(0.2);
			}
		},
	},
	dcmingfa: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		direct: true,
		filter(event, player) {
			return (
				player.isPhaseUsing() &&
				(event.card.name == "sha" || get.type(event.card) == "trick") &&
				event.cards.filterInD().length > 0 &&
				!player.getExpansions("dcmingfa").length
			);
		},
		content() {
			"step 0";
			var str,
				cards = trigger.cards.filterInD(),
				card = trigger.card;
			if (cards.length == 1 && card.name == cards[0].name && (card.nature || false) == (cards[0].nature || false)) {
				str = get.translation(cards[0]);
			} else {
				str = get.translation(trigger.card) + "（" + get.translation(cards) + "）";
			}
			var cardx = {
				name: trigger.card.name,
				nature: trigger.card.nature,
				isCard: true,
			};
			player
				.chooseTarget(
					lib.filter.notMe,
					get.prompt("dcmingfa"),
					"将" + str + "作为“明伐”牌置于武将牌上，并选择一名其他角色。该角色下回合结束时对其执行〖明伐〗的后续效果。"
				)
				.set("card", cardx)
				.set(
					"goon",
					(function () {
						var getMax = function (card) {
							return Math.max.apply(
								Math,
								game
									.filterPlayer(function (current) {
										return current != player && lib.filter.targetEnabled2(card, player, current);
									})
									.map(function (i) {
										return get.effect(i, card, player, player) * Math.sqrt(Math.min(i.getHandcardLimit(), 1 + i.countCards("h")));
									})
									.concat([0])
							);
						};
						var eff1 = getMax(cardx);
						if (
							player.hasCard(function (card) {
								if ((card.name != "sha" && get.type(card) != "trick") || !player.hasValueTarget(card, null, true)) {
									return false;
								}
								return (
									getMax({
										name: get.name(card),
										nature: get.nature(card),
										isCard: true,
									}) >= eff1
								);
							}, "hs")
						) {
							return false;
						}
						return true;
					})()
				)
				.set("ai", function (target) {
					if (!_status.event.goon) {
						return 0;
					}
					var player = _status.event.player,
						card = _status.event.card;
					if (!lib.filter.targetEnabled2(card, player, target)) {
						return 0;
					}
					return get.effect(target, card, player, player) * Math.sqrt(Math.min(target.getHandcardLimit(), 1 + target.countCards("h")));
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dcmingfa", target);
				var card = {
					name: trigger.card.name,
					nature: trigger.card.nature,
					isCard: true,
				};
				player.storage.dcmingfa_info = [card, target];
				player.addToExpansion(trigger.cards.filterInD(), "gain2").gaintag.add("dcmingfa");
			}
		},
		group: "dcmingfa_use",
		ai: { expose: 0.2 },
		intro: {
			mark(dialog, storage, player) {
				var cards = player.getExpansions("dcmingfa");
				if (!cards.length) {
					return "没有“明伐”牌";
				} else {
					dialog.add(cards);
				}
				var info = player.storage.dcmingfa_info;
				if (info) {
					dialog.addText("记录牌：" + get.translation(info[0]) + "<br>记录目标：" + get.translation(info[1]));
				}
			},
			content: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
			delete player.storage.dcmingfa_info;
		},
		subSkill: {
			use: {
				audio: "dcmingfa",
				trigger: { global: ["phaseEnd", "die"] },
				forced: true,
				filter(event, player) {
					if (!player.storage.dcmingfa_info || !player.getExpansions("dcmingfa").length) {
						return false;
					}
					return event.player == player.storage.dcmingfa_info[1];
				},
				content() {
					"step 0";
					var target = trigger.player;
					event.target = target;
					var card = player.storage.dcmingfa_info[0];
					delete player.storage.dcmingfa_info;
					event.card = card;
					event.count = Math.max(1, Math.min(5, target.countCards("h")));
					if (!event.player.isIn()) {
						event.goto(2);
					}
					"step 1";
					event.count--;
					if (target.isIn() && lib.filter.targetEnabled2(card, player, target)) {
						player.useCard(get.copy(card), target);
						if (event.count > 0) {
							event.redo();
						}
					}
					"step 2";
					var cards = player.getExpansions("dcmingfa");
					if (cards.length > 0) {
						player.loseToDiscardpile(cards);
					}
				},
			},
		},
	},
	//蔡瑁张允
	lianzhou: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			if (!player.isLinked()) {
				return true;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.hp == player.hp && !current.isLinked();
			});
		},
		content() {
			"step 0";
			if (!player.isLinked()) {
				player.link();
			}
			"step 1";
			var num = game.countPlayer(function (current) {
				return current != player && current.hp == player.hp && !current.isLinked();
			});
			if (num > 0) {
				player
					.chooseTarget([1, num], "选择横置任意名体力值等于你的角色", function (card, player, current) {
						return current != player && current.hp == player.hp && !current.isLinked();
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, { name: "tiesuo" }, player, player);
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				player.line(targets, "green");
				for (var i of targets) {
					i.link();
				}
			}
		},
		ai: { halfneg: true },
	},
	jinglan: {
		audio: 2,
		trigger: { source: "damageSource" },
		forced: true,
		content() {
			var delta = player.countCards("h") - player.hp;
			if (delta > 0) {
				player.chooseToDiscard("h", 4, true);
			} else if (delta == 0) {
				player.chooseToDiscard("he", true);
				player.recover();
			} else {
				player.damage("fire", "nosource");
				player.draw(5);
			}
		},
		ai: { halfneg: true },
	},
	//滕公主
	xingchong: {
		audio: 2,
		trigger: { global: "roundStart" },
		direct: true,
		filter(event, player) {
			return player.maxHp > 0;
		},
		content() {
			"step 0";
			var list = [];
			for (var i = 0; i <= Math.min(5, player.maxHp); i++) {
				list.push(get.cnNumber(i) + "张");
			}
			list.push("cancel2");
			player
				.chooseControl(list)
				.set("prompt", get.prompt("xingchong"))
				.set("prompt2", "请首先选择摸牌的张数")
				.set("ai", function () {
					var player = _status.event.player,
						num1 = player.maxHp,
						num2 = player.countCards("h");
					if (num1 <= num2) {
						return 0;
					}
					return Math.ceil((num1 - num2) / 2);
				});
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("xingchong");
				var num2 = result.index;
				if (num2 > 0) {
					player.draw(num2);
				}
				var num = Math.min(5, player.maxHp) - num2;
				if (num == 0) {
					event.finish();
				} else {
					event.num = num;
				}
			} else {
				event.finish();
			}
			"step 2";
			if (player.countCards("h") > 0) {
				player.chooseCard("h", [1, Math.min(player.countCards("h"), event.num)], "请选择要展示的牌").set("ai", () => 1 + Math.random());
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var cards = result.cards;
				player.showCards(cards, get.translation(player) + "发动了【幸宠】");
				player.addGaintag(cards, "xingchong");
				player.addTempSkill("xingchong_effect", "roundStart");
			}
		},
		subSkill: {
			effect: {
				audio: "xingchong",
				trigger: {
					player: ["loseAfter"],
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					var evt = event.getl(player);
					if (!evt || !evt.cards2 || !evt.cards2.length) {
						return false;
					}
					if (event.name == "lose") {
						for (var i in event.gaintag_map) {
							if (event.gaintag_map[i].includes("xingchong")) {
								return true;
							}
						}
						return false;
					}
					return player.hasHistory("lose", function (evt) {
						if (event != evt.getParent()) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("xingchong")) {
								return true;
							}
						}
						return false;
					});
				},
				forced: true,
				popup: false,
				charlotte: true,
				onremove(player) {
					player.removeGaintag("xingchong");
				},
				content() {
					"step 0";
					if (trigger.delay === false) {
						game.delayx();
					}
					"step 1";
					player.logSkill("xingchong_effect");
					var num = 0;
					if (trigger.name == "lose") {
						for (var i in trigger.gaintag_map) {
							if (trigger.gaintag_map[i].includes("xingchong")) {
								num++;
							}
						}
					} else {
						player.getHistory("lose", function (evt) {
							if (trigger != evt.getParent()) {
								return false;
							}
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("xingchong")) {
									num++;
								}
							}
						});
					}
					player.draw(2 * num);
				},
			},
		},
	},
	liunian: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return game.hasGlobalHistory("cardMove", function (evt) {
				return evt.washCard && (evt.shuffleNumber == 1 || evt.shuffleNumber == 2);
			});
		},
		content() {
			"step 0";
			if (
				game.hasGlobalHistory("cardMove", function (evt) {
					return evt.washCard && evt.shuffleNumber == 1;
				})
			) {
				player.gainMaxHp();
				game.delayx();
			}
			"step 1";
			if (
				game.hasGlobalHistory("cardMove", function (evt) {
					return evt.washCard && evt.shuffleNumber == 2;
				})
			) {
				player.recover();
				game.delayx();
			} else {
				event.finish();
			}
			"step 2";
			player.addSkill("liunian_effect");
			player.addMark("liunian_effect", 10, false);
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("liunian_effect");
					},
				},
				marktext: "年",
				intro: {
					content: "手牌上限+#",
				},
			},
		},
	},
	//黄承彦
	dcjiezhen: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player;
		},
		content() {
			var skills = target.getSkills(null, false, false).filter(function (i) {
				if (i == "bazhen") {
					return;
				}
				var info = get.info(i);
				return info && !get.is.locked(i) && !info.limited && !info.juexingji && !info.zhuSkill && !info.charlotte && !info.persevereSkill;
			});
			target.addAdditionalSkills("dcjiezhen_blocker", "bazhen");
			target.addSkill("dcjiezhen_blocker");
			target.markAuto("dcjiezhen_blocker", skills);
			player.addSkill("dcjiezhen_clear");
			player.markAuto("dcjiezhen_clear", [target]);
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					var skills = target.getSkills(null, false, false).filter(function (i) {
						if (i == "bazhen") {
							return;
						}
						var info = get.info(i);
						return (
							info && !get.is.locked(i) && !info.limited && !info.juexingji && !info.zhuSkill && !info.charlotte && !info.persevereSkill
						);
					});
					if (!skills.length && target.hasEmptySlot(2)) {
						return 1;
					}
					return -0.5 * skills.length;
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
					player.removeAdditionalSkill(skill);
					delete player.storage.dcjiezhen_blocker;
				},
				charlotte: true,
				locked: true,
				skillBlocker(skill, player) {
					return (
						skill != "bazhen" &&
						skill != "dcjiezhen_blocker" &&
						!lib.skill[skill].charlotte &&
						!lib.skill[skill].persevereSkill &&
						player.getStorage("dcjiezhen_blocker").includes(skill)
					);
				},
				mark: true,
				marktext: "阵",
				intro: {
					markcount: () => 0,
					content(storage, player, skill) {
						if (storage.length) {
							return "失效技能：" + get.translation(storage);
						}
						return "无失效技能";
					},
				},
			},
			clear: {
				audio: "dcjiezhen",
				charlotte: true,
				trigger: {
					global: ["judgeAfter", "die"],
					player: "phaseBegin",
				},
				forced: true,
				forceDie: true,
				onremove: true,
				filter(event, player) {
					if (event.name == "die") {
						return player == event.player || player.getStorage("dcjiezhen_clear").includes(event.player);
					} else if (event.name == "judge") {
						return event.skill == "bagua" && player.getStorage("dcjiezhen_clear").includes(event.player);
					}
					return player.getStorage("dcjiezhen_clear").length > 0;
				},
				logTarget(event, player) {
					if (event.name != "phase") {
						return event.player;
					}
					return player.getStorage("dcjiezhen_clear");
				},
				content() {
					"step 0";
					var targets = player.getStorage("dcjiezhen_clear");
					if (trigger.name == "die" && player == trigger.player) {
						for (var target of targets) {
							target.removeSkill("dcjiezhen_blocker");
						}
						player.removeSkill("dcjiezhen_clear");
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
					var storage = player.getStorage("dcjiezhen_clear");
					if (storage.includes(target)) {
						storage.remove(target);
						target.removeSkill("dcjiezhen_blocker");
						if (target.isIn() && target.countGainableCards(player, "hej") > 0) {
							player.gainPlayerCard(target, "hej", true);
						}
					}
					if (targets.length > 0) {
						event.redo();
					} else {
						player.removeSkill("dcjiezhen_clear");
					}
				},
			},
		},
		derivation: "bazhen",
	},
	dczecai: {
		audio: 2,
		trigger: { global: "roundEnd" },
		limited: true,
		skillAnimation: true,
		animationColor: "soil",
		getMax() {
			const getNum = function (current) {
				var history = current.actionHistory;
				var num = 0;
				for (var i = history.length - 1; i >= 0; i--) {
					for (var j = 0; j < history[i].useCard.length; j++) {
						if (get.type2(history[i].useCard[j].card, false) == "trick") {
							num++;
						}
					}
					if (history[i].isRound) {
						break;
					}
				}
				return num;
			};
			let max = 0,
				current = false,
				targets = game.filterPlayer();
			for (const target of targets) {
				const num = getNum(target);
				if (num > max) {
					max = num;
					current = target;
				} else if (num == max) {
					current = false;
				}
			}
			return current;
		},
		async cost(event, trigger, player) {
			const target = lib.skill.dczecai.getMax();
			let str = "令一名其他角色获得〖集智〗直到下一轮结束";
			if (target && target != player) {
				str += "；若选择的目标为" + get.translation(target) + "，则其获得一个额外的回合";
			}
			event.result = await player
				.chooseTarget(lib.filter.notMe, get.prompt(event.skill), str)
				.set("maximum", event.target)
				.set("ai", function (target) {
					if (target != _status.event.maximum) {
						return 0;
					}
					return get.attitude(_status.event.player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const target = event.targets[0];
			await target.addAdditionalSkills("dczecai_effect", "rejizhi");
			target.addTempSkill("dczecai_effect", "roundEnd");
			if (target == lib.skill.dczecai.getMax()) {
				target.insertPhase();
			}
		},
		derivation: "rejizhi",
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				marktext: "才",
				intro: { content: "已拥有技能〖集智〗" },
			},
		},
	},
	dcyinshi: {
		audio: 2,
		trigger: { player: "damageBegin" },
		usable: 1,
		filter(event, player) {
			return !event.card || get.color(event.card) == "none";
		},
		forced: true,
		content() {
			trigger.cancel();
		},
		group: "dcyinshi_gain",
		subSkill: {
			gain: {
				audio: "dcyinshi",
				trigger: { global: "judgeEnd" },
				forced: true,
				filter(event, player) {
					return event.skill == "bagua" && event.result.card && get.position(event.result.card, true) == "o";
				},
				content() {
					player.gain(trigger.result.card, "gain2");
				},
			},
		},
	},
	//高览
	xizhen: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && (player.canUse("sha", current, false) || player.canUse("juedou", current, false));
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("xizhen"), "视为对一名角色使用【杀】或【决斗】", function (card, player, target) {
					return target != player && (player.canUse("sha", target, false) || player.canUse("juedou", target, false));
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					var eff1 = 0,
						eff2 = 0;
					if (player.canUse("sha", target, false)) {
						eff1 = get.effect(target, { name: "sha" }, player, player);
					}
					if (player.canUse("juedou", target, false)) {
						eff2 = get.effect(target, { name: "juedou" }, player, player);
					}
					var effx = Math.max(eff1, eff2);
					if (effx <= 0) {
						return 0;
					}
					if (target.isHealthy()) {
						effx *= 3;
					}
					if (get.attitude(player, target) > 0) {
						effx *= 1.6;
					}
					return effx;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("xizhen", target);
				var list = [];
				if (player.canUse("sha", target, false)) {
					list.push("sha");
				}
				if (player.canUse("juedou", target, false)) {
					list.push("juedou");
				}
				if (list.length == 1) {
					event._result = { control: list[0] };
				} else {
					player
						.chooseControl(list)
						.set("prompt", "视为对" + get.translation(target) + "使用…")
						.set("ai", function () {
							var player = _status.event.player,
								target = _status.event.getParent().target;
							var eff1 = get.effect(target, { name: "sha" }, player, player),
								eff2 = get.effect(target, { name: "juedou" }, player, player);
							return eff1 > eff2 ? 0 : 1;
						});
				}
			} else {
				event.finish();
			}
			"step 2";
			player.useCard({ name: result.control, isCard: true }, target, false);
			"step 3";
			if (target.isIn()) {
				player.storage.xizhen_effect = target;
				player.addTempSkill("xizhen_effect", "phaseUseAfter");
			}
		},
		subSkill: {
			effect: {
				audio: "xizhen",
				charlotte: true,
				onremove: true,
				trigger: { global: ["useCard", "respond"] },
				logTarget(event, player) {
					return player.storage.xizhen_effect;
				},
				forced: true,
				filter(event, player) {
					return (
						Array.isArray(event.respondTo) &&
						event.respondTo[0] == player &&
						player.storage.xizhen_effect &&
						player.storage.xizhen_effect.isIn()
					);
				},
				content() {
					"step 0";
					var target = player.storage.xizhen_effect;
					event.target = target;
					target.recover();
					"step 1";
					player.draw(target.isHealthy() ? 2 : 1);
				},
				mark: "character",
				intro: { content: "已指定$为目标" },
			},
		},
	},
	//管宁
	dunshi: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		usable: 1,
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = [["sha", "shan", "tao", "jiu"], 0];
			}
		},
		hiddenCard(player, name) {
			if (player.storage.dunshi && player.storage.dunshi[0].includes(name) && !player.getStat("skill").dunshi) {
				return true;
			}
			return false;
		},
		marktext: "席",
		mark: true,
		intro: {
			markcount(storage) {
				return storage[1];
			},
			content(storage, player) {
				if (!storage) {
					return;
				}
				var str = "<li>";
				if (!storage[0].length) {
					str += "已无可用牌";
				} else {
					str += "剩余可用牌：";
					str += get.translation(storage[0]);
				}
				str += "<br><li>“席”标记数量：";
				str += storage[1];
				return str;
			},
		},
		filter(event, player) {
			if (event.type == "wuxie") {
				return false;
			}
			var storage = player.storage.dunshi;
			if (!storage || !storage[0].length) {
				return false;
			}
			for (var i of storage[0]) {
				var card = { name: i, isCard: true };
				if (event.filterCard(card, player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				var storage = player.storage.dunshi;
				for (var i of storage[0]) {
					list.push(["基本", "", i]);
				}
				return ui.create.dialog("遁世", [list, "vcard"], "hidden");
			},
			filter(button, player) {
				var evt = _status.event.getParent();
				return evt.filterCard({ name: button.link[2], isCard: true }, player, evt);
			},
			check(button) {
				var card = { name: button.link[2] },
					player = _status.event.player;
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				if (card.name == "jiu") {
					return 0;
				}
				if (card.name == "sha" && player.hasSkill("jiu")) {
					return 0;
				}
				return player.getUseValue(card, null, true);
			},
			backup(links, player) {
				return {
					audio: "dunshi",
					filterCard() {
						return false;
					},
					popname: true,
					viewAs: {
						name: links[0][2],
						isCard: true,
					},
					selectCard: -1,
					precontent() {
						player.addTempSkill("dunshi_damage");
						player.storage.dunshi_damage = event.result.card.name;
					},
				};
			},
			prompt(links, player) {
				return "选择【" + get.translation(links[0][2]) + "】的目标";
			},
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				var storage = player.storage.dunshi;
				if (!storage || !storage[0].length) {
					return false;
				}
				if (player.getStat("skill").dunshi) {
					return false;
				}
				switch (tag) {
					case "respondSha":
						return (
							(_status.event.type != "phase" || player == game.me || player.isUnderControl() || player.isOnline()) &&
							storage[0].includes("sha")
						);
					case "respondShan":
						return storage[0].includes("shan");
					case "save":
						if (arg == player && storage[0].includes("jiu")) {
							return true;
						}
						return storage[0].includes("tao");
				}
			},
			order: 2,
			result: {
				player(player) {
					if (_status.event.type == "dying") {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		initList() {
			var list,
				skills = [],
				banned = [],
				bannedInfo = ["游戏开始时"];
			if (get.mode() == "guozhan") {
				list = [];
				for (var i in lib.characterPack.mode_guozhan) {
					list.push(i);
				}
			} else if (_status.connectMode) {
				list = get.charactersOL();
			} else {
				list = [];
				for (var i in lib.character) {
					if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) {
						continue;
					}
					list.push(i);
				}
			}
			for (var i of list) {
				if (i.indexOf("gz_jun") == 0) {
					continue;
				}
				for (var j of lib.character[i][3]) {
					var skill = lib.skill[j];
					if (!skill || skill.zhuSkill || banned.includes(j)) {
						continue;
					}
					if (skill.ai && (skill.ai.combo || skill.ai.neg)) {
						continue;
					}
					const infox = get.skillInfoTranslation(j);
					if (bannedInfo.some(item => infox.includes(item))) {
						continue;
					}
					const info = get.plainText(get.translation(j));
					if ("仁/义/礼/智/信".split("/").some(item => info.includes(item))) {
						skills.add(j);
					}
				}
			}
			_status.dunshi_list = skills;
		},
		subSkill: {
			backup: { audio: "dunshi" },
			damage: {
				audio: "dunshi",
				trigger: { global: "damageBegin2" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return event.source == _status.currentPhase;
				},
				onremove: true,
				logTarget: "source",
				content() {
					"step 0";
					event.cardname = player.storage.dunshi_damage;
					player.removeSkill("dunshi_damage");
					event.target = trigger.source;
					var card = get.translation(trigger.source),
						card2 = get.translation(event.cardname),
						card3 = get.translation(trigger.player);
					var list = [
						"防止即将对" + card3 + "造成的伤害，并令" + card + "获得一个技能名中包含“仁/义/礼/智/信”的技能",
						"从〖遁世〗中删除【" + card2 + "】并获得一枚“席”",
						"减1点体力上限，然后摸等同于“席”数的牌",
					];
					var next = player.chooseButton([
						"遁世：请选择两项",
						[
							list.map((item, i) => {
								return [i, item];
							}),
							"textbutton",
						],
					]);
					next.set("forced", true);
					next.set("selectButton", 2);
					next.set("ai", function (button) {
						var player = _status.event.player;
						switch (button.link) {
							case 0:
								if (get.attitude(player, _status.currentPhase) > 0) {
									return 3;
								}
								return 0;
							case 1:
								return 1;
							case 2:
								var num = player.storage.dunshi[1];
								for (var i of ui.selected.buttons) {
									if (i.link == 1) {
										num++;
									}
								}
								if (num > 0 && player.isDamaged()) {
									return 2;
								}
								return 0;
						}
					});
					"step 1";
					event.links = result.links.sort();
					for (var i of event.links) {
						game.log(player, "选择了", "#g【遁世】", "的", "#y选项" + get.cnNumber(i + 1, true));
					}
					if (event.links.includes(0)) {
						trigger.cancel();
						if (!_status.dunshi_list) {
							lib.skill.dunshi.initList();
						}
						var list = _status.dunshi_list
							.filter(function (i) {
								return !target.hasSkill(i, null, null, false);
							})
							.randomGets(3);
						if (list.length == 0) {
							event.goto(3);
						} else {
							event.videoId = lib.status.videoId++;
							var func = function (skills, id, target) {
								var dialog = ui.create.dialog("forcebutton");
								dialog.videoId = id;
								dialog.add("令" + get.translation(target) + "获得一个技能");
								for (var i = 0; i < skills.length; i++) {
									dialog.add(
										'<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' +
											get.translation(skills[i]) +
											"】</div><div>" +
											lib.translate[skills[i] + "_info"] +
											"</div></div>"
									);
								}
								dialog.addText(" <br> ");
							};
							if (player.isOnline()) {
								player.send(func, list, event.videoId, target);
							} else if (player == game.me) {
								func(list, event.videoId, target);
							}
							player.chooseControl(list).set("ai", function () {
								var controls = _status.event.controls;
								if (controls.includes("cslilu")) {
									return "cslilu";
								}
								if (controls.includes("zhichi")) {
									return "zhichi";
								}
								return controls[0];
							});
						}
					} else {
						event.goto(3);
					}
					"step 2";
					game.broadcastAll("closeDialog", event.videoId);
					target.addSkills(result.control);
					"step 3";
					var storage = player.storage.dunshi;
					if (event.links.includes(1)) {
						storage[0].remove(event.cardname);
						storage[1]++;
						player.markSkill("dunshi");
					}
					if (event.links.includes(2)) {
						player.loseMaxHp();
						if (storage[1] > 0) {
							player.draw(storage[1]);
						}
					}
				},
			},
		},
	},
	//吉本
	xunli: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "loseAsyncAfter"],
		},
		forced: true,
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false || player.getExpansions("xunli").length >= 9) {
				return false;
			}
			for (var i of event.cards) {
				if (get.position(i, true) == "d" && get.color(i, event.cards2 && event.cards2.includes(i) ? event.player : false) == "black") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var num = 9 - player.getExpansions("xunli").length;
			var cards = [];
			for (var i of trigger.cards) {
				if (get.position(i, true) == "d" && get.color(i, trigger.cards2 && trigger.cards2.includes(i) ? trigger.player : false) == "black") {
					cards.push(i);
				}
			}
			if (cards.length <= num) {
				event._result = {
					bool: true,
					links: cards,
				};
			} else {
				player
					.chooseButton(true, num, ["寻疠：将" + get.cnNumber(num) + "张牌置于武将牌上", cards])
					.set("forceAuto", true)
					.set("ai", function (button) {
						return get.value(button.link, _status.event.player);
					});
			}
			"step 1";
			if (result.bool) {
				player.addToExpansion("gain2", result.links).gaintag.add("xunli");
			}
		},
		marktext: "疠",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		group: "xunli_exchange",
		subSkill: {
			exchange: {
				audio: "xunli",
				trigger: { player: "phaseUseBegin" },
				direct: true,
				filter(event, player) {
					return player.getExpansions("xunli").length > 0 && player.hasCard(card => get.color(card, player) == "black", "h");
				},
				content() {
					"step 0";
					var cards = player.getExpansions("xunli");
					if (!cards.length || !player.countCards("h")) {
						event.finish();
						return;
					}
					var next = player.chooseToMove("寻疠：是否交换“疠”和手牌？");
					next.set("list", [
						[get.translation(player) + "（你）的疠", cards],
						["手牌区", player.getCards("h", card => get.color(card, player) == "black")],
					]);
					next.set("filterMove", function (from, to) {
						return typeof to != "number";
					});
					next.set("processAI", function (list) {
						var player = _status.event.player;
						var getv = function (card) {
							if (get.info(card).toself) {
								return 0;
							}
							return player.getUseValue(card, false);
						};
						var cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
								return getv(b) - getv(a);
							}),
							cards2 = cards.splice(0, player.getExpansions("xunli").length);
						return [cards2, cards];
					});
					"step 1";
					if (result.bool) {
						var pushs = result.moved[0],
							gains = result.moved[1];
						pushs.removeArray(player.getExpansions("xunli"));
						gains.removeArray(player.getCards("h"));
						if (!pushs.length || pushs.length != gains.length) {
							return;
						}
						player.logSkill("xunli_exchange");
						player.addToExpansion(pushs, player, "giveAuto").gaintag.add("xunli");
						game.log(player, "将", pushs, "作为“疠”置于武将牌上");
						player.gain(gains, "gain2");
					}
				},
			},
		},
		ai: {
			notemp: true,
		},
	},
	zhishi: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("zhishi")).set("ai", function (target) {
				var player = _status.event.player;
				var att = get.attitude(player, target);
				if (att <= 4) {
					return 0;
				}
				if (target.hasSkillTag("nogain")) {
					att /= 10;
				}
				return att;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("zhishi", target);
				player.storage.zhishi_mark = target;
				player.addTempSkill("zhishi_mark", { player: "phaseBegin" });
			}
		},
		ai: {
			combo: "xunli",
			expose: 0.3,
		},
		subSkill: {
			mark: {
				trigger: {
					global: ["dying", "useCardToTargeted"],
				},
				direct: true,
				charlotte: true,
				filter(event, player) {
					if (!player.getExpansions("xunli").length) {
						return false;
					}
					var target = player.storage.zhishi_mark;
					if (event.name == "dying") {
						return event.player == target;
					}
					return event.card.name == "sha" && event.target == target;
				},
				content() {
					"step 0";
					var target = player.storage.zhishi_mark;
					event.target = target;
					player
						.chooseButton(
							[
								get.prompt("zhishi", target),
								'<div class="text center">弃置任意张“疠”并令其摸等量的牌</div>',
								player.getExpansions("xunli"),
							],
							[1, Infinity],
							"allowChooseAll"
						)
						.set("ai", function (button) {
							var player = _status.event.player,
								target = player.storage.zhishi_mark;
							if (target.hp < 1 && target != get.zhu(player)) {
								return 0;
							}
							if (target.hasSkillTag("nogain")) {
								return 0;
							}
							return 3 - player.getUseValue(card, false);
						});
					"step 1";
					if (result.bool) {
						player.logSkill("zhishi", target);
						player.loseToDiscardpile(result.links);
						target.draw(result.links.length);
					}
				},
				mark: "character",
				intro: {
					content: "决定帮助$，具体帮不帮另说",
				},
			},
		},
	},
	lieyi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.getExpansions("xunli").length > 0;
		},
		filterTarget: lib.filter.notMe,
		content() {
			"step 0";
			var cards = player.getExpansions("xunli");
			var cards2 = cards.filter(function (card) {
				return target.isIn() && player.canUse(card, target, false);
			});
			if (cards2.length) {
				player.chooseButton(["对" + get.translation(target) + "使用一张牌", cards2], true).set("ai", function (button) {
					return get.order(button.link);
				});
			} else {
				if (cards.length) {
					player.loseToDiscardpile(cards);
				}
				if (
					target.isIn() &&
					!target.hasHistory("damage", function (evt) {
						return evt.getParent("lieyi") == event && evt._dyinged;
					})
				) {
					player.loseHp();
				}
				event.finish();
			}
			"step 1";
			player.useCard(result.links[0], target, false);
			event.goto(0);
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					var cards = player.getExpansions("xunli");
					var effect = 0,
						damage = 0;
					for (var i of cards) {
						if (player.canUse(i, target, false)) {
							effect += get.effect(target, i, player, target);
							damage += get.tag(i, "damage");
						}
					}
					if (damage >= target.hp) {
						return effect;
					}
					if (player.hp > 2 && cards.length > 3) {
						return effect / 3;
					}
					return 0;
				},
			},
			combo: "xunli",
		},
	},
	//马日磾
	bingjie: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		check(event, player) {
			return (
				player.maxHp > 3 &&
				player.isDamaged() &&
				player.hasCard(function (card) {
					return (
						game.hasPlayer(function (current) {
							return (
								current != player &&
								get.attitude(player, current) < 0 &&
								player.canUse(card, current, null, true) &&
								get.effect(current, card, player, player) > 0
							);
						}) && player.hasValueTarget(card)
					);
				}, "hs")
			);
		},
		content() {
			"step 0";
			player.loseMaxHp();
			"step 1";
			player.addTempSkill("bingjie_effect");
			game.delayx();
		},
		subSkill: {
			effect: {
				audio: "bingjie",
				trigger: { player: "useCardToPlayered" },
				forced: true,
				charlotte: true,
				logTarget: "target",
				filter(event, player) {
					return (
						event.target != player &&
						(event.card.name == "sha" || get.type(event.card, null, false) == "trick") &&
						event.target.countCards("he") > 0
					);
				},
				content() {
					"step 0";
					trigger.target.chooseToDiscard("he", true);
					"step 1";
					if (result.bool && result.cards.length && get.color(result.cards[0], trigger.target) == get.color(trigger.card)) {
						game.log(trigger.target, "不能响应", trigger.card);
						trigger.directHit.push(trigger.target);
					}
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (
								player !== target &&
								get.itemtype(target) === "player" &&
								(card.name === "sha" || get.type(card, null, false) === "trick") &&
								target.countCards("he") &&
								!target.hasSkillTag("noh")
							) {
								return [1, 0, 1, -1];
							}
						},
					},
				},
			},
		},
	},
	zhengding: {
		audio: 2,
		trigger: { player: ["useCard", "respond"] },
		forced: true,
		filter(event, player) {
			if (player == _status.currentPhase) {
				return false;
			}
			if (!Array.isArray(event.respondTo)) {
				return false;
			}
			if (player == event.respondTo[0]) {
				return false;
			}
			var color = get.color(event.card);
			if (color == "none") {
				return false;
			}
			return color == get.color(event.respondTo[1]);
		},
		content() {
			player.gainMaxHp();
			player.recover();
		},
	},
	//孙茹
	xiecui: {
		audio: 2,
		trigger: { global: "damageBegin1" },
		filter(event, player) {
			var source = event.source;
			if (!source || source != _status.currentPhase || event.getParent().type != "card") {
				return false;
			}
			return !source.hasHistory("sourceDamage", function (evt) {
				return evt.getParent().type == "card";
			});
		},
		logTarget: "source",
		prompt2(event, player) {
			var str = "令" + get.translation(event.player) + "即将受到的";
			str += "" + event.num + "点";
			if (event.hasNature("linked")) {
				str += get.translation(event.nature) + "属性";
			}
			str += "伤害+1";
			if (event.source.group == "wu") {
				var cards = event.cards.filterInD();
				if (cards.length) {
					str += "；然后" + get.translation(event.source) + "获得" + get.translation(cards) + "，且本回合的手牌上限+1";
				}
			}
			return str;
		},
		check(event, player) {
			var att = get.attitude(player, event.player);
			if (att < 0) {
				if (event.source.group != "wu" || !event.cards.filterInD().length) {
					return true;
				}
				return get.attitude(player, event.source) > 0;
			}
			return false;
		},
		content() {
			trigger.num++;
			var source = trigger.source;
			if (source.group == "wu") {
				var cards = trigger.cards.filterInD();
				if (cards.length > 0) {
					source.gain(cards, "gain2");
					source.addMark("xiecui_effect", 1, false);
					source.addTempSkill("xiecui_effect");
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					maxHandcard: (player, num) => num + player.countMark("xiecui_effect"),
				},
				marktext: "翠",
				onremove: true,
				intro: { content: "手牌上限+#" },
			},
		},
		ai: { threaten: 1.75 },
	},
	youxu: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		logTarget: "player",
		filter(event, player) {
			return event.player.countCards("h") > event.player.hp;
		},
		check(event, player) {
			if (get.attitude(player, event.player) <= 0) {
				return true;
			} else {
				return game.hasPlayer(function (current) {
					return (
						current != event.player &&
						current.isDamaged() &&
						current.isMinHp() &&
						get.attitude(player, current) > 0 &&
						get.recoverEffect(current, player, player) > 0
					);
				});
			}
		},
		content() {
			"step 0";
			if (player == trigger.player) {
				player.chooseCard("h", true, "请展示一张手牌");
			} else {
				player.choosePlayerCard(trigger.player, true, "h");
			}
			"step 1";
			if (result.bool) {
				var card = result.cards[0];
				event.card = card;
				var str = get.translation(player);
				if (player != trigger.player) {
					str += "对" + get.translation(trigger.player);
				}
				str += "发动了【忧恤】";
				player.showCards(card, str);
				if (!game.hasPlayer(current => current != trigger.player)) {
					event.finish();
				}
				player
					.chooseTarget(
						"令一名角色获得" + get.translation(card),
						"若其体力值为全场最少，则其回复1点体力",
						true,
						function (card, player, target) {
							return target != _status.event.getTrigger().player;
						}
					)
					.set("ai", function (target) {
						var player = _status.event.player,
							att = get.attitude(player, target);
						if (att < 0) {
							return 0;
						}
						if (target.isDamaged() && target.isMinHp && get.recoverEffect(target, player, player) > 0) {
							return 4 * att;
						}
						return att;
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "green");
				target.gain(card, trigger.player, "give").giver = player;
			} else {
				event.finish();
			}
			"step 3";
			if (target.isMinHp()) {
				target.recover();
			}
		},
	},
	//夏侯令女
	fuping: {
		audio: 2,
		hiddenCard(player, name) {
			var list = player.getStorage("fuping").slice(0);
			list.removeArray(player.getStorage("fuping_round"));
			return list.includes(name) && player.hasCard(card => get.type(card) != "basic", "ehs");
		},
		enable: "chooseToUse",
		locked: false,
		filter(event, player) {
			var list = player.getStorage("fuping").slice(0);
			list.removeArray(player.getStorage("fuping_round"));
			if (!list.length) {
				return false;
			}
			if (!player.hasCard(card => get.type(card) != "basic", "ehs")) {
				return false;
			}
			for (var i of list) {
				var type = get.type2(i, false);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = player.getStorage("fuping").slice(0);
				list.removeArray(player.getStorage("fuping_round"));
				var list2 = [];
				for (var i of list) {
					var type = get.type2(i, false);
					if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
						list2.push([type, "", i]);
					}
				}
				return ui.create.dialog("浮萍", [list2, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				return _status.event.player.getUseValue({ name: button.link[2] }, null, true);
			},
			backup(links, player) {
				return {
					audio: "fuping",
					filterCard: card => get.type(card) != "basic",
					position: "he",
					popname: true,
					viewAs: {
						name: links[0][2],
					},
					check(card) {
						return 8 - get.value(card);
					},
					precontent() {
						player.addTempSkill("fuping_round");
						player.markAuto("fuping_round", [event.result.card.name]);
					},
				};
			},
			prompt(links, player) {
				return "将一张非基本牌当做【" + get.translation(links[0][2]) + "】使用";
			},
		},
		ai: {
			order: 8,
			result: { player: 1 },
			respondSha: true,
			skillTagFilter(player) {
				var list = player.getStorage("fuping").slice(0);
				list.removeArray(player.getStorage("fuping_round"));
				return list.includes("sha");
			},
		},
		mod: {
			targetInRange(card, player, target) {
				if (!player.hasEnabledSlot()) {
					return true;
				}
			},
		},
		marktext: "萍",
		intro: { content: "已记录$" },
		group: "fuping_mark",
		subSkill: {
			mark: {
				audio: "fuping",
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					return (
						player != event.player &&
						event.targets.includes(player) &&
						player.hasEnabledSlot() &&
						!player.getStorage("fuping").includes(event.card.name)
					);
				},
				logTarget: "player",
				prompt2: event => "废除一个装备栏并记录【" + get.translation(event.card.name) + "】",
				check(event, player) {
					var list = [
						"tao",
						"juedou",
						"guohe",
						"shunshou",
						"wuzhong",
						"xietianzi",
						"yuanjiao",
						"wanjian",
						"nanman",
						"huoshaolianying",
						"chuqibuyi",
						"zhujinqiyuan",
						"lebu",
						"bingliang",
					];
					if (!list.includes(event.card.name)) {
						return false;
					}
					if (["nanman", "wanjian"].includes(event.card.name) && !player.hasValueTarget({ name: event.card.name })) {
						return false;
					}
					var list = [3, 5, 4, 1, 2];
					for (var i of list) {
						if (player.hasEnabledSlot(i)) {
							var card = player.getEquip(i);
							if (!card || player.hasEmptySlot(i)) {
								return true;
							}
							if (get.value(card, player) <= 0) {
								return true;
							}
						}
					}
					return false;
				},
				content() {
					player.markAuto("fuping", [trigger.card.name]);
					game.log(player, "记录了", "#y" + get.translation(trigger.card.name));
					player.chooseToDisable().set("ai", function (event, player, list) {
						var list = [3, 5, 4, 1, 2];
						for (var i of list) {
							if (player.hasEnabledSlot(i)) {
								var card = player.getEquip(i);
								if (!card || player.hasEmptySlot(i)) {
									return "equip" + i;
								}
								if (get.value(card, player) <= 0) {
									return "equip" + i;
								}
							}
						}
						return list.randomGet();
					});
				},
			},
			backup: { audio: "fuping" },
			round: { charlotte: true, onremove: true },
		},
	},
	weilie: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return (
				player.countMark("weilie_used") <= player.getStorage("fuping").length + 1 &&
				player.countCards("he") > 0 &&
				game.hasPlayer(current => current.isDamaged())
			);
		},
		filterCard: true,
		position: "he",
		filterTarget: (card, player, target) => target.isDamaged(),
		check(card) {
			return 8 - get.value(card);
		},
		async content(event, trigger, player) {
			const { target, name } = event;
			player.addSkill(name + "_used");
			player.addMark(name + "_used", 1, false);
			await target.recover();
			if (target.isDamaged()) {
				await target.draw(2);
			}
		},
		onremove: true,
		ai: {
			order: 1,
			result: {
				player(player, target) {
					var eff = get.recoverEffect(target, player, player);
					if (target.getDamagedHp() > 1) {
						eff += get.effect(target, { name: "draw" }, player, player);
					}
					return eff;
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				intro: { content: "本局游戏已发动#次【炜烈】" },
			},
		},
	},
	//张瑶
	//Partly powered by 烟雨墨染
	yuanyu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			player.draw(2);
			"step 1";
			if (player.countCards("h") > 0 && game.hasPlayer(current => current != player)) {
				var suits = lib.suit.slice(0),
					cards = player.getExpansions("yuanyu");
				for (var i of cards) {
					suits.remove(get.suit(i, false));
				}
				var str = "选择一张手牌，作为“怨”置于武将牌上；同时选择一名其他角色，令该角色获得〖怨语〗的后续效果。";
				if (suits.length) {
					str += "目前“怨”中未包含的花色：";
					for (var i of suits) {
						str += get.translation(i);
					}
				}
				player.chooseCardTarget({
					filterCard: true,
					filterTarget: lib.filter.notMe,
					position: "h",
					prompt: "怨语：选择置于武将牌上的牌和目标",
					prompt2: str,
					suits: suits,
					forced: true,
					ai1(card) {
						var val = get.value(card),
							evt = _status.event;
						if (evt.suits.includes(get.suit(card, false))) {
							return 8 - get.value(card);
						}
						return 5 - get.value(card);
					},
					ai2(target) {
						var player = _status.event.player;
						if (player.storage.yuanyu_damage && player.storage.yuanyu_damage.includes(target)) {
							return 0;
						}
						return -get.attitude(player, target);
					},
				});
			} else {
				event.finish();
			}
			"step 2";
			var target = result.targets[0];
			player.addSkill("yuanyu_damage");
			player.markAuto("yuanyu_damage", result.targets);
			player.line(target, "green");
			if (!target.storage.yuanyu_mark) {
				target.storage.yuanyu_mark = player;
				target.markSkillCharacter("yuanyu_mark", player, "怨语", "已获得〖怨语〗效果");
				target.addSkill("yuanyu_mark");
			}
			player.addToExpansion(result.cards, player, "give").gaintag.add("yuanyu");
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
			player.removeSkill("yuanyu_damage");
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
		subSkill: {
			mark: {
				mark: "character",
				charlotte: true,
				intro: {
					content: "已获得〖怨语〗效果",
					onunmark: true,
				},
			},
			damage: {
				trigger: { global: ["damageSource", "phaseDiscardBegin"] },
				forced: true,
				charlotte: true,
				onremove(player, skill) {
					if (player.storage[skill]) {
						for (var i of player.storage[skill]) {
							if (i.storage.yuanyu_mark == player) {
								i.unmarkSkill("yuanyu_mark");
							}
						}
					}
					delete player.storage[skill];
				},
				filter(event, player) {
					if (event.name == "damage") {
						var source = event.source;
						return source && player.getStorage("yuanyu_damage").includes(source) && source.countCards("h") > 0;
					} else {
						if (player == event.player) {
							return player.getStorage("yuanyu_damage").some(function (target) {
								return target.isIn() && target.countCards("h") > 0;
							});
						} else if (player.getStorage("yuanyu_damage").includes(event.player)) {
							return event.player.countCards("h") > 0;
						}
						return false;
					}
				},
				content() {
					"step 0";
					if (trigger.name == "phaseDiscard") {
						if (trigger.player == player) {
							event.targets = player
								.getStorage("yuanyu_damage")
								.filter(function (target) {
									return target.isIn() && target.countCards("h") > 0;
								})
								.sortBySeat();
						} else {
							event.targets = [trigger.player];
						}
					} else {
						event.targets = [trigger.source];
					}
					"step 1";
					event.target = event.targets.shift();
					event.count = trigger.name == "damage" ? trigger.num : 1;
					"step 2";
					event.count--;
					var suits = lib.suit.slice(0),
						cards = player.getExpansions("yuanyu");
					for (var i of cards) {
						suits.remove(get.suit(i, false));
					}
					var next = target.chooseCard("h", true, "将一张手牌置于" + get.translation(player) + "的武将牌上");
					next.set("suits", suits);
					next.set("ai", function (card) {
						var val = get.value(card),
							evt = _status.event;
						if (evt.suits.includes(get.suit(card, false))) {
							return 5 - get.value(card);
						}
						return 8 - get.value(card);
					});
					if (suits.length) {
						var str = "目前未包含的花色：";
						for (var i of suits) {
							str += get.translation(i);
						}
						next.set("prompt2", str);
					}
					"step 3";
					player.addToExpansion(result.cards, target, "give").gaintag.add("yuanyu");
					"step 4";
					if (!player.hasSkill("yuanyu_damage")) {
						event.finish();
					} else if (event.count > 0 && target.countCards("h") > 0) {
						event.goto(2);
					} else if (event.targets.length > 0) {
						event.goto(1);
					}
				},
			},
		},
	},
	xiyan: {
		audio: 2,
		trigger: { player: "addToExpansionAfter" },
		filter(event, player) {
			if (!event.gaintag.includes("yuanyu")) {
				return false;
			}
			var cards = player.getExpansions("yuanyu");
			if (cards.length < lib.suit.length) {
				return false;
			}
			var suits = lib.suit.slice(0);
			for (var i of cards) {
				suits.remove(get.suit(i));
				if (!suits.length) {
					return true;
				}
			}
			return false;
		},
		logTarget: () => _status.currentPhase,
		prompt2: "获得所有“怨”",
		check: () => true,
		content() {
			"step 0";
			player.removeSkill("yuanyu_damage");
			var cards = player.getExpansions("yuanyu");
			player.gain(cards, "gain2");
			"step 1";
			var target = _status.currentPhase;
			if (player == target) {
				player.addMark("xiyan_buff", 4, false);
				player.addTempSkill("xiyan_buff");
				delete player.getStat("skill").yuanyu;
				event.finish();
			} else {
				player
					.chooseBool("夕颜：是否令" + get.translation(target) + "本回合的手牌上限-4且不能使用基本牌？")
					.set("ai", function () {
						return _status.event.bool;
					})
					.set("bool", get.attitude(player, target) < 0);
			}
			"step 2";
			if (result.bool) {
				var target = _status.currentPhase;
				target.addMark("xiyan_debuff", 4, false);
				target.addTempSkill("xiyan_debuff");
			}
		},
		subSkill: {
			buff: {
				charlotte: true,
				mark: true,
				marktext: " + ",
				intro: {
					content: "本回合手牌上限+#且使用牌无次数限制",
				},
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("xiyan_buff");
					},
					cardUsable(card, player) {
						return Infinity;
					},
				},
				sub: true,
			},
			debuff: {
				charlotte: true,
				mark: true,
				marktext: " - ",
				intro: {
					content: "本回合手牌上限-#且不能使用基本牌",
				},
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("xiyan_debuff");
					},
					cardEnabled(card) {
						if (get.type(card) == "basic") {
							return false;
						}
					},
					cardSavable(card) {
						if (get.type(card) == "basic") {
							return false;
						}
					},
				},
				sub: true,
			},
		},
		ai: {
			combo: "yuanyu",
		},
	},
	//滕胤
	chenjian: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		prompt2(event, player) {
			return (
				"亮出牌堆顶的" +
				get.cnNumber(3 + player.countMark("chenjian")) +
				"张牌，然后执行以下一至两项：⒈弃置一张牌，然后令一名角色获得与你弃置牌花色相同的牌。⒉使用其中剩余的一张牌。若你执行了所有选项，则你获得一枚“陈见”并重铸所有手牌"
			);
		},
		content() {
			"step 0";
			var cards = get.cards(3 + player.countMark("chenjian"));
			event.cards = cards;
			player.showCards(cards, get.translation(player) + "发动了【陈见】");
			"step 1";
			var list = [];
			if (
				player.countCards("he", i => {
					return lib.filter.cardDiscardable(i, player, "chenjian");
				})
			) {
				list.push("选项一");
			}
			if (
				event.cards.some(i => {
					return player.hasUseTarget(i);
				})
			) {
				list.push("选项二");
			}
			if (list.length === 1) {
				event._result = { control: list[0] };
			} else if (list.length > 1) {
				player
					.chooseControl(list)
					.set("choiceList", ["弃置一张牌，然后令一名角色获得与你弃置牌花色相同的牌", "使用" + get.translation(event.cards) + "中的一张牌"])
					.set("prompt", "陈见：请选择一项")
					.set("ai", () => {
						let player = _status.event.player,
							cards = _status.event.getParent().cards;
						if (
							cards.some(i => {
								return player.getUseValue(i) > 0;
							})
						) {
							return "选项二";
						}
						return "选项一";
					});
			} else {
				event.finish();
			}
			"step 2";
			event.goon = 0;
			event.choosed = result.control;
			if (result.control === "cancel2") {
				event.finish();
			} else if (result.control === "选项二") {
				event.goto(6);
			}
			"step 3";
			if (
				player.countCards("he", i => {
					return lib.filter.cardDiscardable(i, player, "chenjian");
				})
			) {
				player
					.chooseToDiscard("he", !event.goon)
					.set("ai", function (card) {
						let evt = _status.event.getParent(),
							val = event.goon && evt.player.countMark("chenjian") < 2 ? 0 : -get.value(card),
							suit = get.suit(card);
						for (let i of evt.cards) {
							if (get.suit(i, false) == suit) {
								val += get.value(i, "raw");
							}
						}
						return val;
					})
					.set(
						"prompt",
						"陈见：" +
							(event.goon ? "是否" : "请") +
							"弃置一张牌，然后令一名角色获得" +
							get.translation(event.cards) +
							"中花色与之相同的牌" +
							(event.goon ? "？" : "")
					);
			} else if (event.choosed === "选项一") {
				event.goto(6);
			} else {
				event.finish();
			}
			"step 4";
			if (result.bool) {
				event.goon++;
				var suit = get.suit(result.cards[0], player);
				var cards2 = event.cards.filter(function (i) {
					return get.suit(i, false) == suit;
				});
				if (cards2.length) {
					event.cards2 = cards2;
					player.chooseTarget(true, "选择一名角色获得" + get.translation(cards2)).set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (att > 0) {
							return att + Math.max(0, 5 - target.countCards("h"));
						}
						return att;
					});
				} else if (event.choosed === "选项一") {
					event.goto(6);
				} else {
					event.goto(8);
				}
			} else {
				event.finish();
			}
			"step 5";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.gain(event.cards2, "gain2");
				event.cards.removeArray(event.cards2);
			}
			if (event.choosed === "选项二") {
				event.goto(8);
			}
			"step 6";
			var cards2 = cards.filter(function (i) {
				return player.hasUseTarget(i);
			});
			if (cards2.length) {
				player
					.chooseButton(["陈见：" + (event.goon ? "是否" : "请") + "使用其中一张牌" + (event.goon ? "？" : ""), cards2], !event.goon)
					.set("ai", function (button) {
						return player.getUseValue(button.link);
					});
			} else if (event.choosed === "选项二") {
				event.goto(3);
			} else {
				event.finish();
			}
			"step 7";
			if (result.bool) {
				player.chooseUseTarget(true, result.links[0], false);
				event.cards.removeArray(result.links);
				event.goon += 2;
				if (event.choosed === "选项二") {
					event.goto(3);
				}
			} else {
				event.finish();
			}
			"step 8";
			if (event.goon > 2) {
				if (player.countMark("chenjian") < 2) {
					player.addMark("chenjian", 1, false);
				}
				player.recast(player.getCards("h", lib.filter.cardRecastable));
			}
		},
		marktext: "见",
		intro: { content: "展示牌数量+#" },
	},
	xixiu: {
		mod: {
			canBeDiscarded(card, player, target) {
				if (player != target && get.position(card) == "e" && target.countCards("e") == 1) {
					return false;
				}
			},
		},
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		forced: true,
		filter(event, player) {
			if (player == event.player || !player.countCards("e")) {
				return false;
			}
			var suit = get.suit(event.card, false);
			if (suit == "none") {
				return false;
			}
			return player.hasCard(function (card) {
				return get.suit(card, player) == suit;
			}, "e");
		},
		content() {
			player.draw();
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (typeof card == "object" && player != target) {
						var suit = get.suit(card);
						if (suit == "none") {
							return;
						}
						if (
							player.hasCard(function (card) {
								return get.suit(card, player) == suit;
							}, "e")
						) {
							return [1, 0.08];
						}
					}
				},
			},
		},
	},
	//张嫙
	tongli: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget || (event.card.storage && event.card.storage.tongli)) {
				return false;
			}
			var type = get.type(event.card);
			if (type != "basic" && type != "trick") {
				return false;
			}
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			var evt = event.getParent("phaseUse");
			if (!evt || evt.player != player) {
				return false;
			}
			var num1 = player.getHistory("useCard", function (evtx) {
				if (evtx.getParent("phaseUse") != evt) {
					return false;
				}
				return !evtx.card.storage || !evtx.card.storage.tongli;
			}).length;
			if (hs.length < num1) {
				return false;
			}
			var list = [];
			for (var i of hs) {
				list.add(get.suit(i, player));
			}
			return list.length == num1;
		},
		prompt2(event, player) {
			var evt = event.getParent("phaseUse");
			var num = player.getHistory("useCard", function (evtx) {
				if (evtx.getParent("phaseUse") != evt) {
					return false;
				}
				return !evtx.card.storage || !evtx.card.storage.tongli;
			}).length;
			//var str='视为额外使用'+get.cnNumber(num)+'张'
			var str = "额外结算" + get.cnNumber(num) + "次";
			if (event.card.name == "sha" && game.hasNature(event.card)) {
				str += get.translation(event.card.nature);
			}
			return str + "【" + get.translation(event.card.name) + "】";
		},
		check(event, player) {
			return !get.tag(event.card, "norepeat");
		},
		content() {
			//player.addTempSkill('tongli_effect');
			var evt = trigger.getParent("phaseUse");
			var num = player.getHistory("useCard", function (evtx) {
				if (evtx.getParent("phaseUse") != evt) {
					return false;
				}
				return true;
				//return !evtx.card.storage||!evtx.card.storage.tongli;
			}).length;
			trigger.getParent().effectCount += num;
		},
		/*subSkill:{
			effect:{
				trigger:{player:'useCardAfter'},
				forced:true,
				charlotte:true,
				filter:function(event,player){
					return event.tongli_effect!=undefined;
				},
				content:function(){
					'step 0'
					event.card=trigger.tongli_effect[0];
					event.count=trigger.tongli_effect[1];
					'step 1'
					event.count--;
					for(var i of trigger.targets){
						if(!i.isIn()||!player.canUse(card,i,false)) return;
					}
					if(trigger.addedTarget&&!trigger.addedTarget.isIn()) return;
					if(trigger.addedTargets&&trigger.addedTargets.length){
						for(var i of trigger.addedTargets){
							if(!i.isIn()) return;
						}
					}
					var next=player.useCard(get.copy(card),trigger.targets,false);
					if(trigger.addedTarget) next.addedTarget=trigger.addedTarget;
					if(trigger.addedTargets&&trigger.addedTargets.length) next.addedTargets=trigger.addedTargets.slice(0);
					if(event.count>0) event.redo();
				},
			},
		},*/
	},
	shezang: {
		audio: 2,
		round: 1,
		trigger: { global: "dying" },
		frequent: true,
		filter(event, player) {
			return event.player == player || player == _status.currentPhase;
		},
		content() {
			var cards = [];
			for (var i of lib.suit) {
				var card = get.cardPile2(function (card) {
					return get.suit(card, false) == i;
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
	//王桃王悦
	huguan: {
		audio: 2,
		audioname: ["wangyue"],
		init(player) {
			game.addGlobalSkill("huguan_all");
		},
		trigger: { global: "useCard" },
		direct: true,
		filter(event, player) {
			if (get.color(event.card, false) != "red") {
				return false;
			}
			var evt = event.getParent("phaseUse");
			if (!evt || evt.player != event.player) {
				return false;
			}
			return (
				event.player
					.getHistory("useCard", function (event) {
						return event.getParent("phaseUse") == evt;
					})
					.indexOf(event) === 0
			);
		},
		content() {
			"step 0";
			player
				.chooseControl(lib.suit, "cancel2")
				.set("prompt", get.prompt("huguan", trigger.player))
				.set("prompt2", "令某种花色的手牌不计入其本回合的手牌上限")
				.set("ai", function () {
					var player = _status.event.player,
						target = _status.event.getTrigger().player,
						att = get.attitude(player, target);
					if (att <= 0) {
						if (
							!player.hasSkill("yaopei") ||
							target.isDamaged() ||
							!player.countCards("he") ||
							target.needsToDiscard() - target.needsToDiscard(-target.countCards("h") / 4) > (att > -2 ? 1.6 : 1)
						) {
							return "cancel2";
						}
					}
					let list = lib.suit.slice(0);
					if (att <= 0 && target.getStorage("huguan_add")) {
						for (let i of target.getStorage("huguan_add")) {
							if (list.includes(i)) {
								return i;
							}
						}
					}
					list.removeArray(target.getStorage("huguan_add"));
					if (list.length) {
						return list.randomGet();
					}
					return "cancel2";
				});
			"step 1";
			if (result.control != "cancel2") {
				var target = trigger.player;
				player.logSkill("huguan", target);
				game.log(player, "选择了", "#g" + get.translation(result.control), "花色");
				target.addTempSkill("huguan_add");
				target.markAuto("huguan_add", [result.control]);
			}
		},
		subSkill: {
			add: {
				charlotte: true,
				onremove: true,
				mod: {
					ignoredHandcard(card, player) {
						if (player.getStorage("huguan_add").includes(get.suit(card, player))) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && player.getStorage("huguan_add").includes(get.suit(card, player))) {
							return false;
						}
					},
				},
				intro: { content: "本回合$花色的牌不计入手牌上限" },
			},
			all: {
				mod: {
					aiValue(player, card, num) {
						if (player && player.storage.huguan_all > 0 && get.itemtype(card) == "card" && get.color(card, player) == "red") {
							return num + player.storage.huguan_all;
						}
					},
				},
				trigger: {
					player: ["phaseUseBegin", "useCard"],
				},
				filter(event, player) {
					if (event.name === "useCard") {
						return player.storage.huguan_all;
					}
					return true;
				},
				silent: true,
				charlotte: true,
				content() {
					"step 0";
					if (trigger.name === "useCard") {
						player.storage.huguan_all = 0;
						event.finish();
					}
					"step 1";
					let num = -157;
					game.countPlayer(function (current) {
						if (current.hasSkill("huguan")) {
							num = Math.max(num, get.attitude(_status.event.player, current));
						}
					}, true);
					if (num === -157) {
						game.removeGlobalSkill("huguan_all");
					} else if (num === 0) {
						player.storage.huguan_all = 6;
					} else if (num > 0) {
						player.storage.huguan_all = 9;
					}
				},
			},
		},
	},
	yaopei: {
		audio: 2,
		trigger: { global: "phaseDiscardEnd" },
		direct: true,
		filter(event, player) {
			if (player == event.player || !event.player.isIn() || !player.countSkill("huguan")) {
				return false;
			}
			var suits = [];
			event.player.getHistory("lose", function (evt) {
				if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
					for (var i of evt.cards2) {
						suits.add(get.suit(i, evt.hs.includes(i) ? evt.player : false));
					}
				}
			});
			if (suits.length >= lib.suit.length) {
				return false;
			}
			if (_status.connectMode && player.countCards("h") > 0) {
				return true;
			}
			return player.hasCard(function (card) {
				return !suits.includes(get.suit(card));
			}, "he");
		},
		content() {
			"step 0";
			var suits = [];
			trigger.player.getHistory("lose", function (evt) {
				if (evt.type == "discard" && evt.getParent("phaseDiscard") == trigger) {
					for (var i of evt.cards2) {
						suits.add(get.suit(i, evt.hs.includes(i) ? evt.player : false));
					}
				}
			});
			player.chooseCardTarget({
				prompt: get.prompt("yaopei", trigger.player),
				prompt2: "操作提示：选择要弃置的牌，并选择执行摸牌选项的角色，另一名角色执行回复体力的选项。",
				suits: suits,
				position: "he",
				filterCard(card, player) {
					return !_status.event.suits.includes(get.suit(card)) && lib.filter.cardDiscardable(card, player, "yaopei");
				},
				filterTarget(card, player, target) {
					return target == player || target == _status.event.getTrigger().player;
				},
				ai1(card) {
					let player = _status.event.player,
						source = _status.event.getTrigger().player;
					if (
						get.attitude(player, source) > 0 &&
						(get.recoverEffect(player, player, player) > 0 || get.recoverEffect(source, player, player) > 0)
					) {
						return 12 - get.value(card);
					}
					return 8 - get.value(card);
				},
				ai2(target) {
					let player = _status.event.player,
						source = _status.event.getTrigger().player;
					let recoverer = player === target ? source : player;
					if (recoverer.isHealthy()) {
						return get.attitude(player, target);
					}
					let att = get.attitude(player, recoverer),
						rec = get.recoverEffect(recoverer, player, player);
					if (rec > 0) {
						return Math.abs(att) + get.attitude(player, target);
					}
					return 0;
				},
			});
			"step 1";
			if (result.bool) {
				var target = trigger.player;
				player.logSkill("yaopei", target);
				player.discard(result.cards);
				if (player == result.targets[0]) {
					if (target.isDamaged() && target.hp < player.hp && (get.mode() != "identity" || player.identity != "nei")) {
						player.addExpose(0.15);
					}
					target.recover();
					player.draw(2);
				} else {
					if ((player.isHealthy() || player.hp > target.hp) && (get.mode() != "identity" || player.identity != "nei")) {
						player.addExpose(0.15);
					}
					target.draw(2);
					player.recover();
				}
			}
		},
		ai: {
			combo: "huguan",
		},
	},
	mingluan: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player != event.player && event.player.isIn() && player.hasSkill("mingluan_mark") && player.countCards("he") > 0;
		},
		content() {
			"step 0";
			let he = player.getCards("he"),
				disval = 0,
				dis = 0,
				spare = 30,
				use = true;
			for (let i of he) {
				let val = get.value(i, player);
				if (val < 6 && get.position(i) == "h") {
					dis++;
					disval += val;
				} else if (val < spare) {
					spare = val;
				}
			}
			if (!dis) {
				dis = 1;
				disval = spare;
				spare = -1;
			}
			let draw = Math.min(trigger.player.countCards("h"), 5 + dis - player.countCards("h"));
			if (6 * draw < disval) {
				use = false;
			}
			player
				.chooseToDiscard(
					"he",
					get.prompt("mingluan"),
					"弃置任意张牌，并摸等同于" + get.translation(trigger.player) + "手牌数的牌（至多摸至五张）",
					[1, Infinity],
					"allowChooseAll"
				)
				.set("ai", function (card) {
					let val = get.value(card, player);
					if (val < 0 && card.name !== "du") {
						return 30;
					}
					if (!_status.event.use) {
						return 0;
					}
					if (ui.selected.cards.length) {
						if (get.position(card) !== "h") {
							return 0;
						}
						return 6 - val;
					}
					if (_status.event.spare < 0 || get.position(card) === "h") {
						return 30 - val;
					}
					return 0;
				})
				.set("spare", spare)
				.set("use", use).logSkill = ["mingluan", trigger.player];
			"step 1";
			if (result.bool) {
				var num = trigger.player.countCards("h"),
					num2 = 5 - player.countCards("h");
				if (num > 0 && num2 > 0) {
					player.draw(Math.min(num, num2));
				}
			}
		},
		group: "mingluan_count",
		subSkill: {
			count: {
				charlotte: true,
				trigger: { global: "recoverEnd" },
				silent: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					var current = _status.currentPhase;
					return current && current != player && !player.hasSkill("mingluan_mark");
				},
				content() {
					player.addTempSkill("mingluan_mark");
				},
			},
			mark: {
				charlotte: true,
			},
		},
	},
	//赵嫣
	jinhui: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			var cards = [];
			while (cards.length < 3) {
				var card = get.cardPile2(function (card) {
					for (var i of cards) {
						if (i.name == card.name) {
							return false;
						}
					}
					var info = get.info(card, false);
					if (info.ai && info.ai.tag && info.ai.tag.damage) {
						return false;
					}
					return !info.notarget && (info.toself || info.singleCard || !info.selectTarget || info.selectTarget == 1);
				});
				if (card) {
					cards.push(card);
				} else {
					break;
				}
			}
			if (!cards.length) {
				event.finish();
			} else {
				player.showCards(cards, get.translation(player) + "发动了【锦绘】");
				event.cards = cards;
				game.cardsGotoOrdering(cards);
				if (game.hasPlayer(current => current != player)) {
					player.chooseTarget("选择【锦绘】的目标", true, lib.filter.notMe).set("ai", function (target) {
						var player = _status.event.player,
							cards = _status.event.getParent().cards.slice(0);
						var max_effect = 0,
							max_effect_player = 0;
						for (var i of cards) {
							var targetx = lib.skill.jinhui.getUsableTarget(i, target, player);
							if (targetx) {
								var effect2 = get.effect(targetx, i, target, target);
								var effect3 = get.effect(targetx, i, target, player);
								if (effect2 > max_effect) {
									max_effect = effect2;
									max_effect_player = effect3;
								}
							}
						}
						return max_effect_player;
					});
				} else {
					event.finish();
				}
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "green");
				var cards = cards.filter(function (card) {
					return lib.skill.jinhui.getUsableTarget(card, target, player);
				});
				if (cards.length) {
					if (cards.length == 1) {
						event._result = { bool: true, links: cards };
					} else {
						target.chooseButton(["选择按“锦绘”规则使用一张牌", cards], true).set("ai", function (button) {
							var player = _status.event.player,
								target = _status.event.getParent().player,
								card = button.link;
							var targetx = lib.skill.jinhui.getUsableTarget(card, player, target);
							var effect = get.effect(targetx, card, player, player),
								cards = _status.event.getParent().cards.slice(0);
							var effect2 = 0,
								effect3 = 0;
							cards.remove(button.link);
							for (var i of cards) {
								var targetx = lib.skill.jinhui.getUsableTarget(i, target, player);
								if (targetx) {
									effect2 += get.effect(targetx, i, target, target);
									effect3 += get.effect(targetx, i, target, player);
								}
							}
							if (effect2 > 0) {
								effect += effect3;
							}
							return effect;
						});
					}
				} else {
					event.goto(3);
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var card = result.links[0];
				event.cards.remove(card);
				var targetx = lib.skill.jinhui.getUsableTarget(card, target, player);
				target.useCard(card, targetx, false, "noai");
			}
			"step 3";
			var cards = cards.filter(function (card) {
				return lib.skill.jinhui.getUsableTarget(card, player, target);
			});
			if (cards.length) {
				player.chooseButton(["是否按“锦绘”规则使用其中一张牌？", cards]).set("ai", function (button) {
					var player = _status.event.player,
						target = _status.event.getParent().target;
					var card = button.link,
						targetx = lib.skill.jinhui.getUsableTarget(card, player, target);
					return get.effect(targetx, card, player, player);
				});
			} else {
				event.finish();
			}
			"step 4";
			if (result.bool) {
				var card = result.links[0];
				cards.remove(card);
				var targetx = lib.skill.jinhui.getUsableTarget(card, player, target);
				if (targetx) {
					player.useCard(card, targetx, false, "noai");
				}
				if (cards.length) {
					event.goto(3);
				}
			} else {
				event.finish();
			}
		},
		getUsableTarget(card, player, target) {
			var info = get.info(card, false);
			if (info.toself) {
				return player.canUse(card, player, false) ? player : false;
			}
			return target.isIn() && player.canUse(card, target, false) ? target : false;
		},
		ai: {
			order: 5,
			result: { player: 1 },
		},
	},
	qingman: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		forced: true,
		logTarget: "player",
		filter(event, player) {
			if (!event.player.isIn()) {
				return false;
			}
			var num = player.countCards("h");
			if (num >= 5) {
				return false;
			}
			var num2 = 0;
			for (var i = 1; i <= 5; i++) {
				num2 += event.player.countEmptySlot(i);
			}
			return num < num2;
		},
		content() {
			var num2 = 0;
			for (var i = 1; i <= 5; i++) {
				num2 += trigger.player.countEmptySlot(i);
			}
			player.drawTo(num2);
		},
	},
	//何晏
	yachai: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source && event.source.isIn();
		},
		logTarget: "source",
		check(event, player) {
			if (get.attitude(player, event.source) <= 0) {
				return true;
			}
			return event.source.countCards("h") < Math.sqrt(event.source.getHp());
		},
		async content(event, trigger, player) {
			const target = trigger.source,
				str = get.translation(player);
			const th = target.countCards("h");
			const num = Math.ceil(th / 2);
			let result;
			if (th > 0) {
				const list = [
					"本回合不能使用手牌，然后" + str + "摸两张牌",
					"展示所有手牌，并将其中一种花色的所有牌交给" + str,
					"弃置" + get.cnNumber(num) + "张手牌",
				];
				result = await target
					.chooseControl()
					.set("choiceList", list)
					.set("ai", () => get.event().idx)
					.set(
						"idx",
						(function () {
							let att = get.sgn(get.attitude(target, player)),
								use = 2 * att,
								suits = {};
							target.countCards("h", i => {
								let suit = get.suit(i, target),
									val = target.getUseValue(i, null, true);
								if (suits[suit]) {
									suits[suit]++;
								} else {
									suits[suit] = 1;
								}
								if (val > 1) {
									use -= Math.sqrt(Math.abs(val));
								}
							});
							const res = [use, (att - 1) * Math.min(...Object.values(suits)), -num];
							return res.indexOf(Math.max(...res));
						})()
					)
					.forResult();
			} else {
				result = { index: 0 };
			}
			switch (result?.index) {
				case 0:
					target.addTempSkill("yachai_block");
					await player.draw(2);
					return;
				case 1: {
					await target.showHandcards();
					const map = {},
						hs = target.getCards("h");
					for (const i of hs) {
						map[get.suit(i, target)] = true;
					}
					const list = Object.keys(map).filter(i => lib.suit.includes(i));
					let result2;
					if (!list.length) {
						return;
					} else if (list.length == 1) {
						result2 = { control: list[0] };
					} else {
						result2 = await target
							.chooseControl(list)
							.set("prompt", "将一种花色的牌交给" + get.translation(player))
							.forResult();
					}
					if (result2?.control) {
						const cards = target.getCards("h", function (card) {
							return get.suit(card, target) == result2.control && lib.filter.canBeGained(card, player, target, "yachai");
						});
						if (cards.length) {
							await target.give(cards, player, "give");
						}
					}
					return;
				}
				case 2:
					await target.chooseToDiscard("h", true, num);
			}
		},
		subSkill: {
			block: {
				mark: true,
				intro: { content: "不能使用手牌" },
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						let hs = player.getCards("h"),
							cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						for (let i of cards) {
							if (hs.includes(i)) {
								return false;
							}
						}
					},
					cardSavable(card, player) {
						let hs = player.getCards("h"),
							cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						for (let i of cards) {
							if (hs.includes(i)) {
								return false;
							}
						}
					},
				},
			},
		},
	},
	qingtan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("h") > 0);
		},
		filterTarget(card, player, target) {
			return target.countCards("h") > 0;
		},
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const { targets } = event;
			targets.sortBySeat();
			const next = player
				.chooseCardOL(targets, "请选择要展示的牌", true)
				.set("ai", function (card) {
					return -get.value(card);
				})
				.set("source", player);
			next.aiCard = function (target) {
				const hs = target.getCards("h");
				return { bool: true, cards: [hs.randomGet()] };
			};
			next._args.remove("glow_result");
			const result = await next.forResult();
			const cards = result.map(i => i.cards[0]);
			await player
				.showCards(cards, get.translation(player) + "发动了【清谈】")
				.set("customButton", button => {
					const target = get.owner(button.link);
					if (target) {
						button.node.gaintag.innerHTML = target.getName();
					}
				})
				.set("delay_time", 4)
				.set("showers", targets);

			const list = [],
				map = {};
			for (const i of cards) {
				const suit = get.suit(i);
				if (!map[suit]) {
					map[suit] = [];
				}
				map[suit].push(i);
			}
			const dialog = ["选择获得一种花色的所有牌"];
			for (const suit of lib.suit) {
				if (map[suit]) {
					const targetsx = map[suit].map(function (card) {
						return targets[cards.indexOf(card)];
					});
					dialog.push('<div class="text center">' + get.translation(targetsx) + "</div>");
					dialog.push(map[suit]);
					list.push(suit);
				}
			}
			if (list.length) {
				const resultx = await player
					.chooseControl(list, "cancel2")
					.set("dialog", dialog)
					.set("list", list)
					.set("map", map)
					.set("ai", function () {
						let max = 0,
							res = "cancel2";
						for (let s of _status.event.list) {
							let temp = 0;
							for (let i of _status.event.map[s]) {
								temp +=
									get.value(i, _status.event.player) +
									get.sgn(get.attitude(_status.event.player, get.owner(i))) * (6 - get.value(i, get.owner(i)));
							}
							for (let i in _status.event.map) {
								if (i === s) {
									continue;
								}
								for (let j of _status.event.map[i]) {
									temp -= get.sgn(get.attitude(_status.event.player, get.owner(j))) * get.value(j, get.owner(j));
								}
							}
							if (temp > max) {
								res = s;
								max = temp;
							}
						}
						return res;
					})
					.forResult();
				if (resultx?.control != "cancel2") {
					const cards2 = cards.filter(function (i) {
						return get.suit(i) == resultx.control;
					});
					for (let i = 0; i < cards.length; i++) {
						if (cards2.includes(cards[i])) {
							targets[i].$give(cards[i], player, false);
						}
					}
					await player.gain(cards2, "log");
					const draws = [];
					for (let i = 0; i < cards.length; i++) {
						if (!cards2.includes(cards[i])) {
							await targets[i].modedDiscard(cards[i], player);
						} else {
							draws.push(targets[i]);
						}
					}
					if (draws.length) {
						await game.asyncDraw(draws);
					}
					await game.delayx();
				}
			}
		},
		ai: {
			order: 7,
			result: {
				player: 0.3,
				target: -1,
			},
		},
	},
	//邓芝
	jianliang: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return !player.isMaxHandcard();
		},
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("jianliang"), "令至多两名角色各摸一张牌", [1, 2]).set("ai", function (target) {
				return Math.sqrt(5 - Math.min(4, target.countCards("h"))) * get.attitude(_status.event.player, target);
			});
			"step 1";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				player.logSkill("jianliang", targets);
				if (targets.length == 1) {
					targets[0].draw();
					event.finish();
				} else {
					game.asyncDraw(targets);
				}
			} else {
				event.finish();
			}
			"step 2";
			game.delayx();
		},
	},
	weimeng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.hp > 0 && target != player && target.countGainableCards(player, "h") > 0;
		},
		content() {
			"step 0";
			player.gainPlayerCard(target, "h", true, [1, player.hp]);
			"step 1";
			if (result.bool && target.isIn()) {
				var num = result.cards.length,
					hs = player.getCards("he");
				var numx = 0;
				for (var i of result.cards) {
					numx += get.number(i, player);
				}
				event.num = numx;
				event.cards = result.cards;
				if (!hs.length) {
					event.finish();
				} else if (hs.length <= num) {
					event._result = { bool: true, cards: hs };
				} else {
					player.chooseCard(
						"he",
						true,
						"选择交给" + get.translation(target) + get.cnNumber(num) + "张牌",
						"（已得到牌的点数和：" + numx + "）",
						num
					);
				}
			} else {
				event.finish();
			}
			"step 2";
			player.give(result.cards, target);
			var numx = 0;
			for (var i of result.cards) {
				numx += get.number(i, player);
			}
			if (numx > num) {
				player.draw();
			} else if (numx < num) {
				player.discardPlayerCard(target, true, "hej");
			}
		},
		ai: {
			order: 6,
			tag: {
				lose: 1,
				loseCard: 1,
				gain: 1,
			},
			result: {
				target(player, target) {
					return -Math.pow(Math.min(player.hp, target.countCards("h")), 2) / 4;
				},
			},
		},
	},
	//冯熙
	yusui: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.player != player && event.player.isIn() && get.color(event.card) == "black";
		},
		logTarget: "player",
		check(event, player) {
			var target = event.player;
			if (player.hp < 3 || get.attitude(player, target) > -3) {
				return false;
			}
			if (player.hp < target.hp) {
				return true;
			}
			if (Math.min(target.countCards("h") - player.countCards("h"), target.countCards("h")) > 3) {
				return true;
			}
			return false;
		},
		usable: 1,
		preHidden: true,
		content() {
			"step 0";
			player.loseHp();
			event.target = trigger.player;
			"step 1";
			event.addIndex = 0;
			var list = [],
				num = target.countCards("h") - player.countCards("h");
			event.num = num;
			if (num > 0 && target.countCards("h") > 0) {
				list.push("令其弃置" + get.cnNumber(num) + "张手牌");
			} else {
				event.addIndex++;
			}
			if (target.hp > player.hp) {
				list.push("令其失去" + get.cnNumber(target.hp - player.hp) + "点体力");
			}
			if (!list.length) {
				event.finish();
			} else if (list.length == 1) {
				event._result = { index: 0 };
			} else {
				player
					.chooseControl()
					.set("choiceList", list)
					.set("prompt", "令" + get.translation(target) + "执行一项")
					.set("ai", function () {
						var player = _status.event.player,
							target = _status.event.getParent().target;
						return target.hp - player.hp > Math.min(_status.event.getParent().num, target.countCards("h")) / 2 ? 1 : 0;
					});
			}
			"step 2";
			if (result.index + event.addIndex == 0) {
				target.chooseToDiscard(num, true, "h", "allowChooseAll");
			} else {
				target.loseHp(target.hp - player.hp);
			}
		},
	},
	boyan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player;
		},
		content() {
			"step 0";
			target.drawTo(Math.min(5, target.maxHp));
			"step 1";
			target.addTempSkill("boyan_block");
		},
		subSkill: {
			block: {
				mark: true,
				intro: { content: "不能使用或打出手牌" },
				charlotte: true,
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") {
							return false;
						}
					},
				},
			},
		},
		ai: {
			order: (item, player) => {
				if (
					game.hasPlayer(cur => {
						if (player === cur || get.attitude(player, cur) <= 0) {
							return false;
						}
						return Math.min(5, cur.maxHp) - cur.countCards("h") > 2;
					})
				) {
					return get.order({ name: "nanman" }, player) - 0.1;
				}
				return 10;
			},
			result: {
				target(player, target) {
					if (get.attitude(player, target) > 0) {
						return Math.max(0, Math.min(5, target.maxHp) - target.countCards("h"));
					}
					if (
						Math.max(0, Math.min(5, target.maxHp) - target.countCards("h")) <= 1 &&
						target.countCards("h", "shan") &&
						!target.hasSkillTag("respondShan", true, null, true) &&
						player.countCards("h", function (card) {
							return (
								get.tag(card, "respondShan") &&
								player.getUseValue(card, null, true) > 0 &&
								get.effect(target, card, player, player) > 0
							);
						})
					) {
						return -2;
					}
				},
			},
		},
	},
	//祢衡
	rekuangcai: {
		audio: 2,
		forced: true,
		trigger: { player: "phaseDiscardBegin" },
		filter(event, player) {
			return !player.getHistory("useCard").length || !player.getHistory("sourceDamage").length;
		},
		content() {
			lib.skill.rekuangcai.change(player, player.getHistory("useCard").length ? -1 : 1);
		},
		mod: {
			targetInRange(card, player) {
				if (player == _status.currentPhase) {
					return true;
				}
			},
			cardUsable(card, player) {
				if (player == _status.currentPhase) {
					return Infinity;
				}
			},
		},
		change(player, num) {
			if (typeof player.storage.rekuangcai_change != "number") {
				player.storage.rekuangcai_change = 0;
			}
			player.storage.rekuangcai_change += num;
			player.addSkill("rekuangcai_change");
		},
		group: "rekuangcai_draw",
		subSkill: {
			draw: {
				audio: "rekuangcai",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				filter(event, player) {
					return player.getHistory("sourceDamage").length > 0;
				},
				content() {
					player.draw(Math.min(5, player.getStat("damage")));
				},
			},
			change: {
				mod: {
					maxHandcard(player, num) {
						if (typeof player.storage.rekuangcai_change == "number") {
							return num + player.storage.rekuangcai_change;
						}
					},
				},
				charlotte: true,
				mark: true,
				intro: {
					content: num => "手牌上限" + (num < 0 ? "" : "+") + num,
				},
			},
		},
	},
	reshejian: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			if (player == event.player || event.targets.length != 1) {
				return false;
			}
			return event.player.isIn() && player.countCards("h") >= 2;
		},
		usable: 2,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(
					"h",
					[2, Infinity],
					get.prompt(event.skill, trigger.player),
					'<div class="text center">弃置至少两张手牌，然后选择一项：<br>⒈弃置其等量的牌。⒉对其造成1点伤害。</div>',
					"allowChooseAll"
				)
				.set("ai", function (card) {
					if (_status.event.goon && ui.selected.cards.length < 2) {
						return 5.6 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					(function () {
						var target = trigger.player;
						if (get.attitude(player, target) >= 0) {
							return false;
						}
						if (get.damageEffect(target, player, player) > 0) {
							return true;
						}
						if (
							target.countCards("he", function (card) {
								return get.value(card, target) > 6;
							}) >= 2
						) {
							return true;
						}
						return false;
					})()
				)
				.set("chooseonly", true)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			await player.discard(cards);
			const num = cards.length;
			let result;
			if (!target.isIn()) {
				return event.finish();
			} else if (!target.countDiscardableCards(player, "he")) {
				result = { index: 1 };
			} else {
				result = await player
					.chooseControl()
					.set("choiceList", [
						"弃置" + get.translation(target) + "的" + get.cnNumber(num) + "张牌",
						"对" + get.translation(target) + "造成1点伤害",
					])
					.set("ai", function () {
						const player = _status.event.player;
						const eff0 = get.effect(target, { name: "guohe_copy2" }, player, player) * Math.min(1.7, target.countCards("he"));
						const eff1 = get.damageEffect(target, player, player);
						return eff0 > eff1 ? 0 : 1;
					})
					.forResult();
			}
			if (result?.index == 0) {
				await player.discardPlayerCard(target, num, true, "he", "allowChooseAll");
			} else if (result?.index == 1) {
				await target.damage();
			}
		},
	},
	//陈登
	refuyuan: {
		audio: 2,
		trigger: { global: "useCardToTargeted" },
		logTarget: "target",
		filter(event, player) {
			return (
				event.card.name == "sha" &&
				event.target.isIn() &&
				!game.hasPlayer2(function (current) {
					return current.hasHistory("useCard", function (evt) {
						return evt.card != event.card && get.color(evt.card, false) == "red" && evt.targets && evt.targets.includes(event.target);
					});
				})
			);
		},
		check(event, player) {
			return get.attitude(player, event.target) > 0;
		},
		content() {
			trigger.target.draw();
		},
	},
	reyingshui: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0 && game.hasPlayer(current => player.inRange(current));
		},
		position: "he",
		filterCard: true,
		filterTarget(card, player, target) {
			return player.inRange(target);
		},
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			if (get.type(card) == "equip") {
				return 3 - get.value(card);
			}
			return 6.5 - get.value(card);
		},
		content() {
			"step 0";
			player.give(cards, target);
			"step 1";
			var next = target.chooseCard(
				"he",
				[2, Infinity],
				"交给" + get.translation(player) + "至少两张装备牌，否则受到1点伤害",
				{ type: "equip" },
				"allowChooseAll"
			);
			if (get.damageEffect(target, player, target) >= 0) {
				next.set("ai", () => -1);
			} else {
				next.set("ai", card => (ui.selected.cards.length < 2 ? 6 - get.value(card) : 0));
			}
			"step 2";
			if (result.bool) {
				target.give(result.cards, player);
			} else {
				target.damage("nocard");
			}
		},
		ai: {
			order: 5,
			tag: {
				damage: 0.5,
			},
			result: {
				target: -1.5,
			},
		},
	},
	rewangzu: {
		audio: 2,
		trigger: { player: "damageBegin1" },
		filter(event, player) {
			return event.source && player != event.source && player.hasCard(card => lib.filter.cardDiscardable(card, player, "rewangzu"), "h");
		},
		usable: 1,
		async cost(event, trigger, player) {
			var num = player.getFriends().length;
			if (
				!game.hasPlayer(function (current) {
					return current != player && current.getFriends().length > num;
				})
			) {
				event.result = await player
					.chooseToDiscard("h", get.prompt(event.skill), "弃置一张牌并令伤害-1", "chooseonly")
					.set("ai", function (card) {
						return 7 - get.value(card);
					})
					.forResult();
			} else {
				event.result = await player.chooseBool(get.prompt(event.skill), "随机弃置一张牌并令伤害-1").forResult();
			}
		},
		async content(event, trigger, player) {
			if (!event.cards || !event.cards.length) {
				const cards = player.getCards("h", card => lib.filter.cardDiscardable(card, player, "rewangzu"));
				if (cards.length) {
					await player.discard(cards.randomGet());
				}
			} else {
				await player.discard(event.cards);
			}
			trigger.num--;
		},
	},
	//万年公主
	zhenge: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("zhenge"), "令一名角色的攻击范围+1").set("ai", function (target) {
				var player = _status.event.player,
					att = get.attitude(player, target);
				if (att > 0) {
					if (!target.hasMark("zhenge_effect")) {
						att *= 1.5;
					}
					if (
						!game.hasPlayer(function (current) {
							return get.distance(target, current, "attack") > 2;
						})
					) {
						var usf = Math.max.apply(
							Math,
							game.filterPlayer().map(function (current) {
								if (target.canUse("sha", current, false)) {
									return get.effect(current, { name: "sha" }, target, player);
								}
								return 0;
							})
						);
						return att + usf;
					}
					return att;
				}
				return 0;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("zhenge", target);
				target.addSkill("zhenge_effect");
				if (target.countMark("zhenge_effect") < 5) {
					target.addMark("zhenge_effect", 1, false);
				}
				if (
					!game.hasPlayer(function (current) {
						return current != target && !target.inRange(current);
					})
				) {
					player
						.chooseTarget("是否令" + get.translation(target) + "视为对另一名角色使用【杀】？", function (card, player, target) {
							return _status.event.source.canUse("sha", target);
						})
						.set("source", target)
						.set("ai", function (target) {
							var evt = _status.event;
							return get.effect(target, { name: "sha" }, evt.source, evt.player);
						});
				} else {
					game.delayx();
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				target.useCard({ name: "sha", isCard: true }, result.targets[0], false);
			}
			"step 3";
			game.delayx();
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					attackRange(player, num) {
						return num + player.countMark("zhenge_effect");
					},
				},
				intro: { content: "攻击范围+#" },
			},
		},
	},
	xinghan: {
		audio: 2,
		init(player) {
			player.addSkill("xinghan_count");
		},
		onremove(player) {
			player.removeSkill("xinghan_count");
		},
		trigger: { global: "damageSource" },
		forced: true,
		filter(event, player) {
			return event.card && event.card == player.storage.xinghan_temp && event.source && event.source.hasMark("zhenge_effect");
		},
		logTarget: "source",
		content() {
			player.draw(player.isMaxHandcard(true) ? 1 : Math.min(5, trigger.source.getAttackRange()));
		},
		subSkill: {
			count: {
				trigger: { global: "useCard1" },
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return (
						event.card.name == "sha" &&
						!game.hasPlayer2(function (current) {
							return current.hasHistory("useCard", function (evt) {
								return evt != event && evt.card.name == "sha";
							});
						})
					);
				},
				content() {
					player.addTempSkill("xinghan_temp");
					player.storage.xinghan_temp = trigger.card;
				},
			},
			temp: { onremove: true },
		},
		ai: { combo: "zhenge" },
	},
	//荀谌
	refenglve: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + player.countMark("refenglve_add");
		},
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				!player.hasSkillTag("noCompareSource") &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("h") > 0 && !current.hasSkillTag("noCompareTarget");
				})
			);
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0 && !target.hasSkillTag("noCompareTarget");
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				if (!target.countCards("hej")) {
					event.finish();
				} else {
					// event.giver = target;
					// event.gainner = player;
					player.gainPlayerCard(target, true, "hej", 2, "获得" + get.translation(target) + "区域里的两张牌");
				}
			} else if (result.tie) {
				player.addTempSkill(event.name + "_add", "phaseUseAfter");
				player.addMark(event.name + "_add", 1, false);
				if (get.position(result.player, true) == "d") {
					player.gain(result.player, "gain2");
				}
				// event.finish();
			} else {
				if (get.position(result.player, true) == "d") {
					target.gain(result.player, "gain2");
				}
				// event.finish();
				/*if(!player.countCards('he')) event.finish();
				else{
					event.giver=player;
					event.gainner=target;
					player.chooseCard(true,'he','交给'+get.translation(target)+'一张牌');
				}*/
			}
			"step 2";
			// if (result.bool) event.giver.give(result.cards, event.gainner);
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (
						!player.hasCard(function (card) {
							if (get.position(card) != "h") {
								return false;
							}
							var val = get.value(card);
							if (val < 0) {
								return true;
							}
							if (val <= 5) {
								return card.number >= 11;
							}
							if (val <= 6) {
								return card.number >= 13;
							}
							return false;
						})
					) {
						return 0;
					}
					return -Math.sqrt(1 + target.countCards("he")) / (1 + target.countCards("j"));
				},
			},
		},
		subSkill: {
			add: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	anyong: {
		audio: 2,
		trigger: { global: "damageSource" },
		direct: true,
		filter(event, player) {
			return (
				event.source &&
				event.source == _status.currentPhase &&
				event.num == 1 &&
				// event.player != event.source &&
				event.player.isIn() &&
				player.countCards("he") > 0 &&
				event.source
					.getHistory("sourceDamage", function (evt) {
						return evt.player != event.source;
					})
					.indexOf(event) == 0
			);
		},
		content() {
			"step 0";
			player
				.chooseToDiscard("he", get.prompt("anyong", trigger.player), "弃置一张牌并对其造成1点伤害")
				.set("goon", get.damageEffect(trigger.player, player, player) > 0)
				.set("ai", function (card) {
					if (_status.event.goon) {
						return 7 - get.value(card);
					}
					return 0;
				}).logSkill = ["anyong", trigger.player];
			"step 1";
			if (result.bool) {
				trigger.player.damage();
			}
		},
	},
	//刘永
	zhuning: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + (player.hasSkill(skill + "_rewrite", null, null, false) ? 1 : 0);
		},
		filter(event, player) {
			return player.countCards("he") && game.hasPlayer(current => player != current);
		},
		filterCard: true,
		position: "he",
		filterTarget: lib.filter.notMe,
		selectCard: [1, Infinity],
		delay: false,
		lose: false,
		discard: false,
		allowChooseAll: true,
		check(card) {
			if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
				return 0;
			}
			if (!ui.selected.cards.length && card.name == "du") {
				return 20;
			}
			var player = get.owner(card);
			if (ui.selected.cards.length >= Math.max(1, player.countCards("h") - player.hp)) {
				return 0;
			}
			return 10 - get.value(card);
		},
		async content(event, trigger, player) {
			const { cards, target } = event;
			const next = player.give(cards, target);
			next.gaintag.add("fengxiang_tag");
			await next;
			const list = get.inpileVCardList(info => {
				const card = { name: info[2], nature: info[3], isCard: true };
				if (!["basic", "trick"].includes(get.type(info[2])) || !get.tag(card, "damage")) {
					return false;
				}
				return player.hasUseTarget(card);
			});
			if (!list.length) {
				return;
			}
			const result = await player
				.chooseButton(["是否视为使用一张伤害牌？", [list, "vcard"]])
				.set("ai", button => {
					return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
				})
				.forResult();
			if (!result?.links?.length) {
				return;
			}
			await player.chooseUseTarget({ name: result.links[0][2], nature: result.links[0][3], isCard: true }, true, false);
			if (
				!player.hasHistory("sourceDamage", evt => {
					if (!evt.card) {
						return false;
					}
					const evtx = evt.getParent("useCard");
					return evtx.card == evt.card && evtx.getParent(2) == event;
				})
			) {
				player.addTempSkill(event.name + "_rewrite", "phaseUseEnd");
			}
		},
		subSkill: { rewrite: { charlotte: true } },
		ai: {
			fireAttack: true,
			order: 4,
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						if (target.hasSkillTag("nodu")) {
							return 0;
						}
						return -10;
					}
					if (target.hasJudge("lebu")) {
						return 0;
					}
					var nh = target.countCards("h");
					var np = player.countCards("h");
					if (player.hp == player.maxHp || player.countCards("h") <= 1) {
						if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) {
							return 0;
						}
					}
					return Math.max(1, 5 - nh);
				},
			},
		},
	},
	fengxiang: {
		getMax(event) {
			var max = 0,
				max2 = null,
				players = game.filterPlayer();
			for (var current of players) {
				var num = 0,
					cards = current.getCards("h", function (card) {
						return card.hasGaintag("fengxiang_tag");
					});
				if (event) {
					if (event.name == "gain" && event.gaintag.includes("fengxiang_tag")) {
						cards.removeArray(event.cards);
					}
					var evt = event.getl(current);
					if (evt && evt.gaintag_map) {
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("fengxiang_tag")) {
								num++;
							}
						}
					}
				}
				num += cards.length;
				if (num > max) {
					max = num;
					max2 = current;
				} else if (num == max) {
					max2 = null;
				}
			}
			return max2;
		},
		audio: 2,
		init(player) {
			game.addGlobalSkill("fengxiang_use");
		},
		onremove(player) {
			if (!game.hasPlayer(current => current.hasSkill("fengxiang", null, null, false), true)) {
				game.removeGlobalSkill("fengxiang_use");
			}
		},
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			var target = lib.skill.fengxiang.getMax();
			return !target || target.isDamaged();
		},
		logTarget(event, player) {
			return lib.skill.fengxiang.getMax() || player;
		},
		content() {
			var target = lib.skill.fengxiang.getMax();
			if (target) {
				target.recover();
			} else {
				player.draw();
			}
		},
		group: "fengxiang_draw",
		subSkill: {
			draw: {
				audio: "fengxiang",
				trigger: {
					global: ["equipAfter", "addJudgeAfter", "loseAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				filter(event, player) {
					if (event.name == "lose" && event.getlx === false) {
						return false;
					}
					return lib.skill.fengxiang.getMax() != lib.skill.fengxiang.getMax(event);
				},
				content() {
					if (trigger.delay === false) {
						game.delayx();
					}
					player.draw();
				},
			},
			use: {
				mod: {
					aiOrder(player, card, num) {
						if (
							num > 0 &&
							get.itemtype(card) === "card" &&
							card.hasGaintag("fengxiang_tag") &&
							game.hasPlayer(current => {
								return current.hasSkill("fengxiang") && get.attitude(player, current) > 0;
							})
						) {
							return num + 10;
						}
					},
				},
				trigger: { player: "dieAfter" },
				filter(event, player) {
					return !game.hasPlayer(current => current.hasSkill("fengxiang", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				charlotte: true,
				content() {
					game.removeGlobalSkill("fengxiang_use");
				},
			},
		},
	},
	//阚泽
	rekuanshi: {
		audio: "kuanshi",
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					let att = get.attitude(get.player(), target);
					if (target.hp < 3) {
						att /= 1.5;
					}
					return att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			player.addTempSkill(event.name + "_effect", { player: "phaseBegin" });
			player.markAuto(event.name + "_effect", [target]);
			await game.delayx();
		},
		subSkill: {
			effect: {
				charlotte: true,
				audio: "kuanshi",
				intro: { content: "每回合限一次，当$于一回合内受到第2点伤害后，其回复1点体力。" },
				trigger: { global: "damageEnd" },
				filter(event, player) {
					if (!player.getStorage("rekuanshi_effect").includes(event.player) || event.player.isHealthy()) {
						return false;
					}
					let history = event.player.getHistory("damage", null, event),
						num = 0;
					for (const evt of history) {
						if (evt.rekuanshi) {
							return false;
						}
						num += evt.num;
					}
					return num > 1 && num - event.num < 2;
				},
				forced: true,
				logTarget: "player",
				async content(event, trigger, player) {
					trigger.rekuanshi = true;
					await trigger.player.recover();
				},
			},
		},
	},
	//吕玲绮
	guowu: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		preHidden: true,
		content() {
			"step 0";
			var hs = player.getCards("h");
			player.showCards(hs, get.translation(player) + "发动了【帼武】");
			var list = [];
			for (var i of hs) {
				list.add(get.type2(i, player));
				if (list.length >= 3) {
					break;
				}
			}
			if (list.length >= 1) {
				var card = get.discardPile(function (i) {
					return i.name == "sha";
				});
				if (card) {
					player.gain(card, "gain2");
				}
			}
			if (list.length >= 2) {
				player.addTempSkill("guowu_dist", "phaseUseAfter");
			}
			if (list.length >= 3) {
				player.addTempSkill("guowu_add", "phaseUseAfter");
			}
		},
		subSkill: {
			dist: {
				charlotte: true,
				mod: { targetInRange: () => true },
			},
			used: { charlotte: true },
			add: {
				audio: "guowu",
				charlotte: true,
				trigger: { player: "useCard1" },
				direct: true,
				filter(event, player) {
					var info = get.info(event.card, false);
					if (info.allowMultiple == false) {
						return false;
					}
					if (event.card.name != "sha" && (info.type != "trick" || get.mode() == "guozhan" || player.hasSkill("guowu_used"))) {
						return false;
					}
					if (event.targets && !info.multitarget) {
						if (
							game.hasPlayer(function (current) {
								return (
									!event.targets.includes(current) &&
									lib.filter.targetEnabled2(event.card, player, current) &&
									lib.filter.targetInRange(event.card, player, current)
								);
							})
						) {
							return true;
						}
					}
					return false;
				},
				content() {
					"step 0";
					var num = game.countPlayer(function (current) {
						return (
							!trigger.targets.includes(current) &&
							lib.filter.targetEnabled2(trigger.card, player, current) &&
							lib.filter.targetInRange(trigger.card, player, current)
						);
					});
					player
						.chooseTarget(
							"帼武：是否为" + get.translation(trigger.card) + "增加" + (num > 1 ? "至多两个" : "一个") + "目标？",
							[1, Math.min(2, num)],
							function (card, player, target) {
								var trigger = _status.event.getTrigger();
								var card = trigger.card;
								return (
									!trigger.targets.includes(target) &&
									lib.filter.targetEnabled2(card, player, target) &&
									lib.filter.targetInRange(card, player, target)
								);
							}
						)
						.set("ai", function (target) {
							var player = _status.event.player;
							var card = _status.event.getTrigger().card;
							return get.effect(target, card, player, player);
						});
					"step 1";
					if (result.bool) {
						if (player != game.me && !player.isOnline()) {
							game.delayx();
						}
					} else {
						event.finish();
					}
					"step 2";
					var targets = result.targets.sortBySeat();
					player.logSkill("guowu_add", targets);
					trigger.targets.addArray(targets);
					if (get.mode() == "guozhan") {
						player.addTempSkill("guowu_used", "phaseUseAfter");
					}
				},
			},
		},
	},
	zhuangrong: {
		derivation: ["llqshenwei", "wushuang"],
		audio: 2,
		trigger: { global: "phaseEnd" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return player.hp == 1 || player.countCards("h") == 1;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.loseMaxHp();
			"step 1";
			if (player.maxHp > player.hp) {
				player.recover(player.maxHp - player.hp);
			}
			"step 2";
			player.drawTo(Math.min(5, player.maxHp));
			player.addSkills(["llqshenwei", "wushuang"]);
		},
	},
	llqshenwei: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		forced: true,
		filter: event => !event.numFixed,
		content() {
			trigger.num += 2;
		},
		mod: {
			maxHandcard: (player, num) => num + 2,
		},
	},
	cuijian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => lib.skill.cuijian.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		content() {
			"step 0";
			var hs = target.getCards("h", "shan");
			if (hs.length) {
				hs.addArray(
					target.getCards("he", function (card) {
						return get.subtype(card) == "equip2";
					})
				);
				player.gain(hs, target, "give", "bySelf");
				if (player.hasMark("zhtongyuan_basic")) {
					event.finish();
				} else {
					event.num = hs.length;
				}
			} else {
				if (player.hasMark("zhtongyuan_trick")) {
					player.draw(2);
				}
				event.finish();
			}
			"step 1";
			var hs = player.getCards("he");
			if (!hs.length || !target.isIn()) {
				event.finish();
			} else if (hs.length <= num) {
				event._result = { bool: true, cards: hs };
			} else {
				player.chooseCard("he", true, "选择交给" + get.translation(target) + get.cnNumber(num) + "张牌", num);
			}
			"step 2";
			if (result.bool && result.cards && result.cards.length) {
				player.give(result.cards, target);
			}
		},
		ai: {
			order: 4,
			result: {
				player(player, target) {
					if (!target.countCards("h", "shan")) {
						return player.hasMark("zhtongyuan_trick") ? 2 : 0;
					}
					return 0;
				},
				target(player, target) {
					if (target.countCards("h", "shan")) {
						var num = -target.countCards("h") / 2;
						var card = target.getEquip(2);
						if (card) {
							num -= get.value(card, target) / 2;
						}
						return num;
					}
					return -0.01;
				},
			},
		},
	},
	tongyuan: { audio: 2 },
	zhtongyuan: {
		audio: "tongyuan",
		trigger: { player: ["useCardAfter", "respondAfter"] },
		forced: true,
		filter(event, player) {
			var type = get.type2(event.card, false);
			return (type == "basic" || type == "trick") && get.color(event.card, false) == "red" && !player.hasMark("zhtongyuan_" + type);
		},
		content() {
			var type = get.type2(trigger.card, false);
			if (!player.hasMark("zhtongyuan_" + type)) {
				player.addMark("zhtongyuan_" + type, 1, false);
				game.log(player, "修改了技能", "#g【摧坚】");
			}
		},
		group: ["zhtongyuan_basic", "zhtongyuan_trick"],
		subSkill: {
			basic: {
				trigger: { player: "useCard2" },
				direct: true,
				locked: true,
				filter(event, player) {
					if (!player.hasMark("zhtongyuan_basic") || !player.hasMark("zhtongyuan_trick")) {
						return false;
					}
					var card = event.card;
					if (get.color(card, false) != "red" || get.type(card, null, false) != "basic") {
						return false;
					}
					var info = get.info(card);
					if (info.allowMultiple == false) {
						return false;
					}
					if (event.targets && !info.multitarget) {
						if (
							game.hasPlayer(function (current) {
								return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
							})
						) {
							return true;
						}
					}
					return false;
				},
				content() {
					"step 0";
					var prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
					player
						.chooseTarget(get.prompt("zhtongyuan"), function (card, player, target) {
							var player = _status.event.player;
							return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
						})
						.set("prompt2", prompt2)
						.set("ai", function (target) {
							var trigger = _status.event.getTrigger();
							var player = _status.event.player;
							return get.effect(target, trigger.card, player, player);
						})
						.set("card", trigger.card)
						.set("targets", trigger.targets);
					"step 1";
					if (result.bool) {
						if (!event.isMine() && !event.isOnline()) {
							game.delayx();
						}
						event.targets = result.targets;
					} else {
						event.finish();
					}
					"step 2";
					if (event.targets) {
						player.logSkill("zhtongyuan", event.targets);
						trigger.targets.addArray(event.targets);
					}
				},
			},
			trick: {
				audio: "zhtongyuan",
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					if (!player.hasMark("zhtongyuan_basic") || !player.hasMark("zhtongyuan_trick")) {
						return false;
					}
					var card = event.card;
					return get.color(card, false) == "red" && get.type(card, null, false) == "trick";
				},
				content() {
					trigger.directHit.addArray(game.filterPlayer());
					game.log(trigger.card, "不可被响应");
				},
			},
		},
		ai: {
			combo: "zhtongyuan",
		},
	},
	//陆郁生
	zhente: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		logTarget: "player",
		usable: 1,
		preHidden: true,
		filter(event, player) {
			var color = get.color(event.card);
			if (player == event.player || event.player.isDead() || color == "none" || (get.mode() == "guozhan" && color != "black")) {
				return false;
			}
			var type = get.type(event.card);
			return type == "basic" || type == "trick";
		},
		check(event, player) {
			return !event.excluded.includes(player) && get.effect(player, event.card, event.player, player) < 0;
		},
		content() {
			"step 0";
			trigger.player
				.chooseControl()
				.set("choiceList", [
					"本回合内不能再使用" + get.translation(get.color(trigger.card)) + "牌",
					"令" + get.translation(trigger.card) + "对" + get.translation(player) + "无效",
				])
				.set("prompt", get.translation(player) + "发动了【贞特】，请选择一项")
				.set("ai", function () {
					var player = _status.event.player;
					var target = _status.event.getParent().player;
					var card = _status.event.getTrigger().card,
						color = get.color(card);
					if (get.effect(target, card, player, player) <= 0) {
						return 1;
					}
					var hs = player.countCards("h", function (card) {
						return get.color(card, player) == color && player.hasValueTarget(card, null, true);
					});
					if (!hs.length) {
						return 0;
					}
					if (hs > 1) {
						return 1;
					}
					return Math.random() > 0.5 ? 0 : 1;
				});
			"step 1";
			if (result.index == 0) {
				trigger.player.addTempSkill("zhente2");
				trigger.player.storage.zhente2.add(get.color(trigger.card));
				trigger.player.markSkill("zhente2");
			} else {
				trigger.excluded.add(player);
			}
		},
	},
	zhente2: {
		mod: {
			cardEnabled(card, player) {
				const color = get.color(card);
				if (color != "unsure" && player.getStorage("zhente2").includes(color)) {
					return false;
				}
			},
			cardSavable(card, player) {
				const color = get.color(card);
				if (color != "unsure" && player.getStorage("zhente2").includes(color)) {
					return false;
				}
			},
		},
		charlotte: true,
		onremove: true,
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = [];
			}
		},
		intro: { content: "本回合内不能使用$牌" },
	},
	zhiwei: {
		audio: 2,
		trigger: {
			player: ["enterGame", "showCharacterAfter", "phaseBegin"],
			global: ["phaseBefore"],
		},
		direct: true,
		filter(event, player, name) {
			if (player.hasSkill("zhiwei2")) {
				return false;
			}
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			if (get.mode() == "guozhan") {
				return (
					event.name == "showCharacter" &&
					event.toShow.some(name => {
						return get.character(name, 3).includes("zhiwei");
					})
				);
			}
			return event.name != "showCharacter" && (name != "phaseBefore" || game.phaseNumber == 0);
		},
		content() {
			"step 0";
			player
				.chooseTarget(
					"请选择【至微】的目标",
					"选择一名其他角色。该角色造成伤害后，你摸一张牌，该角色受到伤害后，你随机弃置一张手牌。你弃牌阶段弃置的牌均被该角色获得。",
					true,
					lib.filter.notMe
				)
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					if (att > 0) {
						return 1 + att;
					}
					return Math.random();
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("zhiwei", target);
				player.storage.zhiwei2 = target;
				player.addSkill("zhiwei2");
			}
		},
	},
	zhiwei2: {
		group: ["zhiwei2_draw", "zhiwei2_discard", "zhiwei2_gain", "zhiwei2_clear"],
		charlotte: true,
		onremove: true,
		mark: "character",
		sourceSkill: "zhiwei",
		intro: {
			content: "$造成伤害后你摸一张牌；$受到伤害后你弃置一张牌；你于弃牌阶段弃置牌后交给$",
		},
		subSkill: {
			draw: {
				audio: "zhiwei",
				trigger: { global: "damageSource" },
				forced: true,
				filter(event, player) {
					return event.source == player.storage.zhiwei2;
				},
				logTarget: "source",
				content() {
					player.draw();
				},
			},
			discard: {
				audio: "zhiwei",
				trigger: { global: "damageEnd" },
				forced: true,
				filter(event, player) {
					return (
						event.player == player.storage.zhiwei2 &&
						player.countCards("h", function (card) {
							return lib.filter.cardDiscardable(card, player, "zhiwei2_discard");
						})
					);
				},
				logTarget: "player",
				content() {
					player.discard(
						player
							.getCards("h", function (card) {
								return lib.filter.cardDiscardable(card, player, "zhiwei2_discard");
							})
							.randomGet()
					);
				},
			},
			gain: {
				audio: "zhiwei",
				trigger: {
					player: "loseAfter",
					global: "loseAsyncAfter",
				},
				forced: true,
				filter(event, player) {
					if (
						event.type != "discard" ||
						event.getlx === false ||
						event.getParent("phaseDiscard").player != player ||
						!player.storage.zhiwei2 ||
						!player.storage.zhiwei2.isIn()
					) {
						return false;
					}
					var evt = event.getl(player);
					return evt && evt.cards2.filterInD("d").length > 0;
				},
				logTarget(event, player) {
					return player.storage.zhiwei2;
				},
				content() {
					if (trigger.delay === false) {
						game.delay();
					}
					player.storage.zhiwei2.gain(trigger.getl(player).cards2.filterInD("d"), "gain2");
				},
			},
			clear: {
				audio: "zhiwei",
				trigger: {
					global: "die",
					player: ["hideCharacterEnd", "removeCharacterEnd"],
				},
				forced: true,
				filter(event, player) {
					if (event.name == "die") {
						return event.player == player.storage.zhiwei2;
					}
					if (event.name == "removeCharacter") {
						return event.toRemove == "luyusheng" || event.toRemove == "gz_luyusheng";
					}
					return event.toHide == "luyusheng" || event.toHide == "gz_luyusheng";
				},
				content() {
					"step 0";
					player.removeSkill("zhiwei2");
					if (trigger.name != "die" || get.mode() != "guozhan") {
						event.finish();
					}
					"step 1";
					if (get.character(player.name1, 3).includes("zhiwei")) {
						player.hideCharacter(0);
					}
					if (get.character(player.name2, 3).includes("zhiwei")) {
						player.hideCharacter(1);
					}
				},
			},
		},
	},
	//华歆
	spwanggui: {
		audio: "wanggui",
		trigger: { source: "damageSource" },
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.group != player.group;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "对一名势力不同的其他角色造成1点伤害", function (card, player, target) {
					return target.group != player.group;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.damage();
		},
		group: "spwanggui_draw",
		subSkill: {
			draw: {
				audio: "wanggui",
				trigger: { player: "damageEnd" },
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(
							get.prompt("spwanggui"),
							"令自己摸一张牌，或和一名势力相同的其他角色各摸一张牌",
							function (card, player, target) {
								return target.group == player.group;
							}
						)
						.set("ai", function (target) {
							var player = _status.event.player,
								att = get.attitude(player, target);
							if (target != player) {
								att *= 2;
							}
							if (target.hasSkillTag("nogain")) {
								att /= 1.7;
							}
							return att;
						})
						.forResult();
				},
				content() {
					"step 0";
					var target = targets[0];
					if (player == target) {
						player.draw();
						event.finish();
					} else {
						var list = [player, target].sortBySeat();
						game.asyncDraw(list);
					}
					"step 1";
					game.delayx();
				},
			},
		},
	},
	wanggui: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			if (player.isUnseen()) {
				return false;
			}
			if (!player.isUnseen(2)) {
				return true;
			}
			return (
				(!player.isUnseen(0) && get.character(player.name1, 3).includes("wanggui")) ||
				(!player.isUnseen(1) && get.character(player.name2, 3).includes("wanggui"))
			);
		},
		usable: 1,
		preHidden: true,
		async cost(event, trigger, player) {
			if (player.isUnseen(2)) {
				event.result = await player
					.chooseTarget(get.prompt(event.skill), "望归：是否对与你势力不同的一名角色造成1点伤害？", (card, player, target) => {
						return target.isEnemyOf(player);
					})
					.set("ai", target => {
						let player = _status.event.player;
						return get.damageEffect(target, player, player);
					})
					.setHiddenSkill(event.skill)
					.forResult();
			} else {
				event.result = await player.chooseBool("望归：是否令与你势力相同的角色各摸一张牌？").setHiddenSkill(event.skill).forResult();
				event.result.targets = game.filterPlayer(current => {
					return current.isFriendOf(player);
				});
			}
		},
		async content(event, trigger, player) {
			if (player.isUnseen(2)) {
				const target = event.targets[0];
				target.damage("nocard");
			} else {
				const targets = event.targets;
				targets.sortBySeat();
				await game.asyncDraw(targets);
			}
		},
	},
	xibing: {
		audio: 2,
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (player == event.player || event.targets.length != 1) {
				return false;
			}
			var bool = function (card) {
				return (card.name == "sha" || get.type(card, null, false) == "trick") && get.color(card, false) == "black";
			};
			if (!bool(event.card)) {
				return false;
			}
			var evt = event.getParent("phaseUse");
			if (evt.player != event.player) {
				return false;
			}
			return true;
		},
		usable: 1,
		logTarget: "player",
		check(event, player) {
			var target = event.player;
			var att = get.attitude(player, target);
			var num2 = Math.min(5, target.hp) - target.countCards("h");
			if (num2 <= 0) {
				return false;
			}
			var num = target.countCards("h", function (card) {
				return target.hasValueTarget(card, null, true);
			});
			if (!num) {
				return att > 0;
			}
			return (num - num2) * att < 0;
		},
		preHidden: true,
		content() {
			"step 0";
			var num = Math.min(5, trigger.player.hp) - trigger.player.countCards("h");
			if (num > 0) {
				trigger.player.draw(num);
				trigger.player.addTempSkill("xibing_banned");
			}
		},
		subSkill: {
			banned: {
				mod: {
					cardEnabled(card) {
						return false;
					},
					cardSavable(card) {
						return false;
					},
				},
			},
		},
	},
	//小虎
	remeibu: {
		audio: "meibu",
		trigger: {
			global: "phaseUseBegin",
		},
		filter(event, player) {
			return event.player != player && event.player.isIn() && event.player.inRange(player) && player.countCards("he") > 0;
		},
		direct: true,
		derivation: ["rezhixi"],
		checkx(event, player) {
			if (get.attitude(player, event.player) >= 0) {
				return false;
			}
			return event.player.countCards("h") > event.player.hp;
		},
		content() {
			"step 0";
			var check = lib.skill.new_meibu.checkx(trigger, player);
			player
				.chooseToDiscard(get.prompt2("remeibu", trigger.player), "he")
				.set("ai", function (card) {
					if (_status.event.check) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set("check", check)
				.set("logSkill", ["remeibu", trigger.player]);
			"step 1";
			if (result.bool) {
				var target = trigger.player;
				var card = result.cards[0];
				player.line(target, "green");
				player.markAuto("remeibu_gain", [get.suit(card, player)]);
				player.addTempSkill("remeibu_gain");
				target.addTempSkills("rezhixi", "phaseUseEnd");
			}
		},
		ai: {
			expose: 0.2,
		},
		subSkill: {
			gain: {
				trigger: { global: "loseAfter" },
				forced: true,
				charlotte: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					return (
						event.getParent(3).name == "rezhixi" &&
						player.getStorage("remeibu_gain").includes(get.suit(event.cards[0], event.player)) &&
						get.position(event.cards[0]) == "d"
					);
				},
				content() {
					player.gain(trigger.cards[0], "gain2");
				},
			},
		},
	},
	remumu: {
		audio: "mumu",
		trigger: {
			player: "phaseUseBegin",
		},
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countCards("e") > 0;
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("remumu"), function (card, player, target) {
					return target.countCards("e") > 0;
				})
				.set("ai", function (target) {
					var player = _status.event.player,
						att = get.attitude(player, target),
						es = target.getCards("e"),
						val = 0;
					for (var i of es) {
						var eff = -(get.value(i, target) - 0.1) * att;
						if (eff > val) {
							val = eff;
						}
					}
					return eff;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("remumu", target);
				if (player == target) {
					event._result = { index: 1 };
				} else {
					var str = get.translation(target);
					player
						.chooseControl()
						.set("choiceList", [
							"弃置" + str + "装备区的一张牌且本阶段使用【杀】的次数上限+1",
							"获得" + str + "装备区的一张牌且本阶段使用【杀】的次数上限-1",
						])
						.set("ai", function () {
							var player = _status.event.player;
							if (
								player.countCards("hs", function (card) {
									return get.name(card, player) == "sha" && player.hasValueTarget(card);
								}) < Math.max(1, player.getCardUsable("sha"))
							) {
								return 1;
							}
							return 0;
						});
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.index == 0) {
				player.addTempSkill("remumu3", "phaseUseAfter");
				player.discardPlayerCard(target, "e", true);
			} else {
				player.addTempSkill("remumu2", "phaseUseAfter");
				player.gainPlayerCard(target, "e", true);
			}
		},
	},
	remumu2: {
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num - 1;
				}
			},
		},
	},
	remumu3: {
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + 1;
				}
			},
		},
	},
	rezhixi: {
		trigger: {
			player: "useCard",
		},
		forced: true,
		filter(event, player) {
			return (event.card.name == "sha" || get.type(event.card) == "trick") && player.countCards("h") > 0;
		},
		content() {
			player.chooseToDiscard("h", true);
		},
		ai: {
			neg: true,
			nokeep: true,
		},
	},
	//董白
	relianzhu: {
		audio: "lianzhu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterCard: true,
		discard: false,
		lose: false,
		delay: false,
		position: "he",
		filterTarget: lib.filter.notMe,
		check(card) {
			var num = get.value(card);
			if (get.color(card) == "black") {
				if (num >= 6) {
					return 0;
				}
				return 9 - num;
			} else {
				return 7 - num;
			}
		},
		async content(event, trigger, player) {
			const { cards, target } = event;
			player.give(cards, target, true);
			if (get.color(cards[0], player) == "red") {
				await player.draw();
				return;
			}
			const result = await target
				.chooseToDiscard("he", 2, "弃置两张牌，或令" + get.translation(player) + "摸两张牌")
				.set("goon", get.attitude(target, player) < 0)
				.set("ai", function (card) {
					if (!_status.event.goon) {
						return -get.value(card);
					}
					return 6 - get.value(card);
				})
				.forResult();
			if (!result.bool) {
				await player.draw(2);
			}
		},
		ai: {
			order: 3,
			expose: 0.2,
			result: {
				target(player, target) {
					if (ui.selected.cards.length && get.color(ui.selected.cards[0]) == "red") {
						if (target.countCards("h") < player.countCards("h")) {
							return 1;
						}
						return 0.5;
					}
					return -1;
				},
			},
		},
	},
	rexiahui: {
		audio: "xiahui",
		mod: {
			ignoredHandcard(card, player) {
				if (get.color(card, player) == "black") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && get.color(card, player) == "black") {
					return false;
				}
			},
		},
		trigger: { global: "phaseEnd" },
		forced: true,
		logTarget: "player",
		filter(event, player) {
			var target = event.player;
			return (
				target != player &&
				target.countCards("h", function (card) {
					return card.hasGaintag("rexiahui");
				}) == 0 &&
				target.getHistory("lose", function (evt) {
					for (var i in evt.gaintag_map) {
						if (evt.gaintag_map[i].includes("rexiahui")) {
							return true;
						}
					}
				}).length > 0
			);
		},
		content() {
			trigger.player.loseHp();
		},
		group: "rexiahui_gain",
		subSkill: {
			gain: {
				trigger: { global: "gainEnd" },
				forced: true,
				popup: false,
				filter(event, player) {
					if (player == event.player) {
						return false;
					}
					var evt = event.getl(player);
					return (
						evt &&
						evt.cards2 &&
						evt.cards2.filter(function (card) {
							return get.color(card, player) == "black";
						}).length > 0
					);
				},
				content() {
					trigger.player.addSkill("rexiahui_block");
					var cards = trigger.getl(player).cards2.filter(function (card) {
						return get.color(card, player) == "black";
					});
					trigger.player.addGaintag(cards, "rexiahui");
				},
			},
			block: {
				mod: {
					cardEnabled2(card) {
						if (get.itemtype(card) == "card" && card.hasGaintag("rexiahui")) {
							return false;
						}
					},
					cardDiscardable(card) {
						if (card.hasGaintag("rexiahui")) {
							return false;
						}
					},
				},
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { player: "changeHp" },
				filter(event, player) {
					return event.num < 0;
				},
				content() {
					player.removeSkill("rexiahui_block");
				},
				onremove(player) {
					player.removeGaintag("rexiahui");
				},
			},
		},
	},
	//周善
	dcmiyun: {
		audio: 2,
		trigger: { global: ["roundStart", "roundEnd"] },
		filter(event, player, name) {
			if (name === "roundStart") {
				return game.hasPlayer(current => current != player && current.countGainableCards(player, "he"));
			}
			return player.hasCard(card => card.hasGaintag("dcmiyun_tag"), "h") && game.hasPlayer(current => current != player);
		},
		forced: true,
		direct: true,
		group: "dcmiyun_lose",
		async content(event, trigger, player) {
			switch (event.triggername) {
				case "roundStart": {
					const result = await player
						.chooseTarget("密运：获得一名其他角色的一张牌，称为“安”", true, (card, player, target) => {
							return target != player && target.countGainableCards(player, "he");
						})
						.set("ai", target => {
							return get.effect(target, { name: "shunshou" }, _status.event.player, _status.event.player);
						})
						.forResult();
					if (result?.bool && result.targets?.length) {
						const target = result.targets[0];
						player.logSkill("dcmiyun", target);
						const next = player.gainPlayerCard(target, true, "visibleMove");
						next.gaintag.add("dcmiyun_tag");
						await next;
					}
					break;
				}
				case "roundEnd": {
					const result2 = await player
						.chooseCardTarget({
							prompt: "密运：将包括“安”在内的任意张手牌交给一名其他角色",
							forced: true,
							filterTarget: lib.filter.notMe,
							selectCard: [1, Infinity],
							filterOk() {
								for (var card of ui.selected.cards) {
									if (card.hasGaintag("dcmiyun_tag")) {
										return true;
									}
								}
								return false;
							},
							goon: game.hasPlayer(current => player != current && get.attitude(player, current) > 0),
							allowChooseAll: true,
							ai1(card) {
								if (get.itemtype(card) != "card") {
									return 0;
								}
								if (card.hasGaintag("dcmiyun_tag")) {
									return 100;
								}
								if (_status.event.goon) {
									return 8 - get.value(card);
								}
								return -get.value(card);
							},
							ai2(target) {
								return get.attitude(_status.event.player, target);
							},
						})
						.forResult();
					if (result2?.bool && result2.cards?.length && result2.targets?.length) {
						const {
							targets: [target],
							cards,
						} = result2;
						player.logSkill("dcmiyun", target);
						await player.give(cards, target);
						await player.drawTo(player.maxHp);
					}
					break;
				}
			}
		},
		mod: {
			aiValue(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("dcmiyun_tag")) {
					return Math.abs(num) * 10;
				}
			},
			aiUseful() {
				return lib.skill.dcmiyun.mod.aiValue.apply(this, arguments);
			},
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("dcmiyun_tag")) {
					return 0;
				}
			},
		},
		subSkill: {
			lose: {
				audio: "dcmiyun",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				filter(event, player) {
					if (event.getParent().name == "dcmiyun") {
						return false;
					}
					var evt = event.getl(player);
					if (!evt || !evt.cards2 || !evt.cards2.length) {
						return false;
					}
					if (event.name == "lose") {
						for (var i in event.gaintag_map) {
							if (event.gaintag_map[i].includes("dcmiyun_tag")) {
								return true;
							}
						}
						return false;
					}
					return player.hasHistory("lose", evt => {
						if (event != evt.getParent()) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("dcmiyun_tag")) {
								return true;
							}
						}
						return false;
					});
				},
				content() {
					player.loseHp();
				},
			},
		},
	},
	dcdanying: {
		audio: 2,
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || (card.name !== "sha" && card.name !== "shan") || !player.hasCard(i => i.hasGaintag("dcmiyun_tag"), "h")) {
					return;
				}
				return Math.max(0.12, num / 25);
			},
		},
		locked: false,
		enable: ["chooseToUse", "chooseToRespond"],
		usable: 1,
		hiddenCard(player, name) {
			if (!_status.connectMode && !player.hasCard(card => card.hasGaintag("dcmiyun_tag"), "h")) {
				return false;
			}
			return name == "sha" || name == "shan";
		},
		filter(event, player) {
			if (event.type == "wuxie" || !player.hasCard(card => card.hasGaintag("dcmiyun_tag"), "h")) {
				return false;
			}
			for (var name of ["sha", "shan"]) {
				if (event.filterCard({ name: name, isCard: true }, player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var vcards = [];
				for (var name of ["sha", "shan"]) {
					var card = { name: name, isCard: true };
					if (event.filterCard(card, player, event)) {
						vcards.push(["基本", "", name]);
					}
				}
				var dialog = ui.create.dialog("胆迎", [vcards, "vcard"], "hidden");
				dialog.direct = true;
				return dialog;
			},
			backup(links, player) {
				return {
					filterCard: () => false,
					selectCard: -1,
					viewAs: {
						name: links[0][2],
						isCard: true,
					},
					popname: true,
					precontent() {
						player.logSkill("dcdanying");
						player.showCards(
							player.getCards("h", card => card.hasGaintag("dcmiyun_tag")),
							get.translation(player) + "的“安”"
						);
						player.addTempSkill("dcdanying_discard");
					},
				};
			},
			prompt(links, player) {
				return "展示“安”，然后视为使用【" + get.translation(links[0][2]) + "】";
			},
		},
		ai: {
			order(item, player) {
				var o1 = get.order({ name: "sha" }),
					o2 = get.order({ name: "shan" });
				if (player.countCards("h") > 3 || player == _status.currentPhase) {
					return Math.max(o1, o2) + 0.1;
				}
				return Math.min(o1, o2) - 0.1;
			},
			combo: "dcmiyun",
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (!player.hasCard(card => card.hasGaintag("dcmiyun_tag"), "h")) {
					return false;
				}
			},
			result: {
				player: 1,
			},
		},
		subSkill: {
			discard: {
				audio: "dcdanying",
				trigger: { target: "useCardToTargeted" },
				charlotte: true,
				forced: true,
				filter(event, player) {
					return player.countDiscardableCards(event.player, "he");
				},
				content() {
					trigger.player.discardPlayerCard(player, "he", true);
					player.removeSkill("dcdanying_discard");
				},
				ai: {
					effect: {
						target_use(card, player, target) {
							if (_status._dcdanying_aiChecking) {
								return;
							}
							_status._dcdanying_aiChecking = true;
							let eff = get.effect(target, { name: "guohe_copy2" }, player, player);
							delete _status._dcdanying_aiChecking;
							return [1, get.sgn(eff)];
						},
					},
				},
			},
		},
	},
	//蔡阳
	dcxunji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && !player.getStorage("dcxunji_effect").includes(target);
		},
		content() {
			player.markAuto("dcxunji_effect", [target]);
			player.addTempSkill("dcxunji_effect", { player: "die" });
			target.addTempSkill("dcxunji_mark", { player: "phaseEnd" });
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (player.hp < 2) {
						return 0;
					}
					return get.effect(target, { name: "juedou" }, player, player);
				},
			},
		},
		subSkill: {
			mark: {
				mark: true,
				marktext: "嫉",
				intro: { content: "你已经被盯上了！" },
			},
			effect: {
				audio: "dcxunji",
				charlotte: true,
				trigger: { global: "phaseJieshuBegin" },
				forced: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					return player.getStorage("dcxunji_effect").includes(event.player);
				},
				content() {
					"step 0";
					var target = trigger.player;
					event.target = target;
					if (target.getHistory("useCard", evt => get.color(evt.card) == "black").length > 0 && player.canUse("juedou", target)) {
						player.useCard({ name: "juedou", isCard: true }, target, "dcxunji_effect");
					}
					"step 1";
					player.unmarkAuto("dcxunji_effect", [target]);
					if (!player.storage.dcxunji_effect.length) {
						player.removeSkill("dcxunji_effect");
					}
				},
				group: "dcxunji_loseHp",
			},
			loseHp: {
				trigger: { source: "damageSource" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.card && event.card.name == "juedou" && event.getParent().skill == "dcxunji_effect" && event.player.isIn();
				},
				content() {
					trigger.player.line(player);
					player.damage(trigger.num, trigger.player);
				},
			},
		},
	},
	dcjiaofeng: {
		audio: 2,
		trigger: { source: "damageBegin1" },
		forced: true,
		usable: 1,
		filter(event, player) {
			return player.isDamaged() && !player.getHistory("sourceDamage").length;
		},
		content() {
			var num = player.getDamagedHp();
			if (num > 0) {
				player.draw();
			}
			if (num > 1) {
				trigger.num++;
			}
			if (num > 2) {
				player.recover();
			}
		},
	},
	//夏侯杰
	liedan: {
		audio: 2,
		trigger: { global: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player != event.player || player.countMark("liedan") > 4;
		},
		logTarget: "player",
		content() {
			if (player == trigger.player) {
				player.die();
				return;
			}
			var num = 0;
			if (player.hp > trigger.player.hp) {
				num++;
			}
			if (player.countCards("h") > trigger.player.countCards("h")) {
				num++;
			}
			if (player.countCards("e") > trigger.player.countCards("e")) {
				num++;
			}
			if (num) {
				player.draw(num);
				if (num == 3 && player.maxHp < 8) {
					player.gainMaxHp();
				}
			} else {
				player.addMark("liedan", 1);
				player.loseHp();
			}
		},
		intro: { content: "mark" },
		ai: {
			halfneg: true,
		},
	},
	zhuangdan: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return player != event.player && player.isMaxHandcard(true);
		},
		async content(event, trigger, player) {
			player.addTempSkill("zhuangdan_mark", { player: "phaseEnd" });
			player.tempBanSkill("liedan", { player: "phaseEnd" });
		},
		ai: { combo: "liedan" },
		subSkill: {
			mark: {
				charlotte: true,
				mark: true,
				marktext: "胆",
				intro: { content: "我超勇的" },
			},
		},
	},
	//乌巢酒仙
	recangchu: {
		audio: 2,
		trigger: { global: "phaseBefore", player: "enterGame" },
		marktext: "粮",
		forced: true,
		filter(event, player) {
			if (event.name == "phase" && game.phaseNumber != 0) {
				return false;
			}
			return player.countMark("recangchu") < game.countPlayer();
		},
		content() {
			player.addMark("recangchu", Math.min(3, game.countPlayer() - player.countMark("recangchu")));
		},
		ai: {
			notemp: true,
		},
		intro: { content: "mark", name: "粮" },
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("recangchu");
			},
		},
		group: ["recangchu2", "recangchu3"],
	},
	recangchu2: {
		audio: "recangchu",
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		forced: true,
		usable: 1,
		sourceSkill: "recangchu",
		filter(event, player) {
			return player != _status.currentPhase && player.countMark("recangchu") < game.countPlayer() && event.getg(player).length > 0;
		},
		content() {
			player.addMark("recangchu", 1);
		},
	},
	recangchu3: {
		audio: "recangchu",
		trigger: { global: "die" },
		forced: true,
		sourceSkill: "recangchu",
		filter(event, player) {
			return player.countMark("recangchu") > game.countPlayer();
		},
		content() {
			player.removeMark("recangchu", player.countMark("recangchu") - game.countPlayer());
		},
	},
	reliangying: {
		audio: 2,
		trigger: { player: "phaseDiscardBegin" },
		filter(event, player) {
			return player.hasMark("recangchu");
		},
		direct: true,
		async content(event, trigger, player) {
			const draws = Array.from({ length: player.countMark("recangchu") }).map((_, i) => get.cnNumber(i + 1) + "张");
			const { control } = await player
				.chooseControl(draws, "cancel2")
				.set("prompt", get.prompt("reliangying"))
				.set("prompt2", "摸至多" + get.cnNumber(player.countMark("recangchu")) + "张牌，然后交给等量的角色各一张牌")
				.set("ai", () => {
					const player = get.event().player;
					const num = Math.min(
						player.countMark("recangchu"),
						game.countPlayer(current => get.attitude(player, current) > 0)
					);
					if (num > 0) {
						return get.cnNumber(num) + "张";
					}
					return "cancel2";
				})
				.forResult();
			if (control != "cancel2") {
				player.logSkill("reliangying");
				const num = draws.indexOf(control) + 1,
					max = Math.min(num, player.countCards("he"), game.countPlayer());
				await player.draw(num);
				let list = [];
				if (_status.connectMode) {
					game.broadcastAll(() => (_status.noclearcountdown = true));
				}
				while (max - list.length > 0) {
					const { bool, cards, targets } = await player
						.chooseCardTarget({
							prompt: "粮营：将" + get.cnNumber(max - 1) + "至" + get.cnNumber(max) + "张牌交给其他角色",
							position: "he",
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
						.set("forced", max - list.length > 1)
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
		ai: {
			combo: "recangchu",
		},
	},
	reshishou: {
		audio: 2,
		trigger: { player: ["useCard", "damageEnd"] },
		forced: true,
		filter(event, player) {
			if (!player.countMark("recangchu")) {
				return false;
			}
			return event.name == "damage" ? event.hasNature("fire") : event.card && event.card.name == "jiu";
		},
		content() {
			player.removeMark("recangchu", Math.min(player.countMark("recangchu"), trigger.num || 1));
		},
		ai: {
			combo: "recangchu",
			neg: true,
		},
		group: "reshishou2",
	},
	reshishou2: {
		audio: "reshishou",
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		sourceSkill: "reshishou",
		filter(event, player) {
			return !player.countMark("recangchu");
		},
		content() {
			player.loseHp();
		},
	},
	//曹性
	cxliushi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", { suit: "heart" }) > 0;
		},
		filterCard: { suit: "heart" },
		position: "he",
		filterTarget(card, player, target) {
			return player.canUse("sha", target, false);
		},
		check(card) {
			var player = _status.event.player;
			var next = player.getNext();
			var att = get.attitude(player, next);
			if (att > 0) {
				var js = next.getCards("j");
				if (js.length) {
					return get.judge(js[0]) + 10 - get.value(card);
				}
				return 9 - get.value(card);
			}
			return 6 - get.value(card);
		},
		discard: false,
		prepare: "throw",
		loseTo: "cardPile",
		visible: true,
		insert: true,
		async content(event, trigger, player) {
			const { cards, targets } = event;
			game.log(player, "将", cards, "置于牌堆顶");
			await player.useCard({ name: "sha", isCard: true, storage: { cxliushi: true } }, false, targets);
		},
		group: "cxliushi_damage",
		subSkill: {
			damage: {
				trigger: { source: "damageSource" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.card?.storage?.cxliushi == true && event.player.isIn() && event.getParent(3).name == "cxliushi";
				},
				async content(event, trigger, player) {
					trigger.player.addMark("cxliushi2", 1);
					trigger.player.addSkill("cxliushi2");
				},
			},
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) - 0.4;
			},
			result: {
				target(player, target) {
					var eff = get.effect(target, { name: "sha" }, player, target);
					var damageEff = get.damageEffect(target, player, player);
					if (eff > 0) {
						return damageEff > 0 ? 0 : eff;
					}
					if (target.hasSkill("bagua_skill") || target.hasSkill("rw_bagua_skill") || target.hasSkill("bazhen")) {
						return 0;
					}
					return eff;
				},
			},
		},
	},
	cxliushi2: {
		mod: {
			maxHandcard(player, num) {
				return num - player.countMark("cxliushi2");
			},
		},
		onremove: true,
		charlotte: true,
		intro: {
			name2: "流",
			content: "手牌上限-#",
		},
	},
	zhanwan: {
		audio: 2,
		trigger: { global: "phaseDiscardEnd" },
		forced: true,
		filter(event, player) {
			return (
				event.player.hasSkill("cxliushi2") &&
				event.player.getHistory("lose", function (evt) {
					if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
						return true;
					}
				}).length > 0
			);
		},
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.player.removeSkill("cxliushi2");
			let num = 0;
			trigger.player.getHistory("lose", function (evt) {
				if (evt.type == "discard" && evt.getParent("phaseDiscard") == trigger) {
					num += evt.cards2.length;
				}
			});
			await player.draw(num);
		},
		ai: {
			combo: "cxliushi",
		},
	},
	//说出吾名吓汝一跳
	xuxie: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		logTarget(event, player) {
			return game
				.filterPlayer(function (current) {
					return get.distance(player, current) <= 1;
				})
				.sortBySeat();
		},
		check(event, player) {
			if (player.isHealthy()) {
				return false;
			}
			var list = game.filterPlayer(function (current) {
				return get.distance(player, current) <= 1;
			});
			var draw = 0;
			var discard = 0;
			var num = 2 / player.getDamagedHp();
			while (list.length) {
				var target = list.shift();
				var att = get.attitude(player, target);
				if (att > 0) {
					draw++;
					if (target.countDiscardableCards(player, "he") > 0) {
						discard--;
					}
				}
				if (att == 0) {
					draw--;
					if (target.countDiscardableCards(player, "he") > 0) {
						discard--;
					}
				}
				if (att < 0) {
					draw--;
					if (target.countDiscardableCards(player, "he") > 0) {
						discard++;
					}
				}
			}
			return draw >= num || discard >= num;
		},
		content() {
			"step 0";
			player.loseMaxHp();
			"step 1";
			var targets = game
				.filterPlayer(function (current) {
					return get.distance(player, current) <= 1;
				})
				.sortBySeat();
			if (!targets.length) {
				event.finish();
			} else {
				event.targets = targets;
				player
					.chooseControl()
					.set("choiceList", ["弃置" + get.translation(targets) + "的各一张牌", "令" + get.translation(targets) + "各摸一张牌"])
					.set("ai", function () {
						var player = _status.event.player;
						var list = _status.event.getParent().targets.slice(0);
						var draw = 0;
						var discard = 0;
						while (list.length) {
							var target = list.shift();
							var att = get.attitude(player, target);
							if (att > 0) {
								draw++;
								if (target.countDiscardableCards(player, "he") > 0) {
									discard--;
								}
							}
							if (att < 0) {
								draw--;
								if (target.countDiscardableCards(player, "he") > 0) {
									discard++;
								}
							}
						}
						if (draw > discard) {
							return 1;
						}
						return 0;
					});
			}
			"step 2";
			event.index = result.index;
			if (result.index == 1) {
				game.asyncDraw(targets);
			} else {
				event.goto(4);
			}
			"step 3";
			game.delay();
			event.finish();
			"step 4";
			var target = targets.shift();
			if (target.countDiscardableCards(player, "he") > 0) {
				player.discardPlayerCard(target, "he", true);
			}
			if (targets.length) {
				event.redo();
			}
		},
		group: "xuxie_add",
		subSkill: {
			add: {
				audio: "xuxie",
				trigger: { player: "phaseUseEnd" },
				forced: true,
				locked: false,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current.maxHp > player.maxHp;
					});
				},
				content() {
					player.gainMaxHp();
					player.chooseDrawRecover(2, true);
				},
			},
		},
	},
	//新潘凤
	xinkuangfu: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		delay: false,
		filterTarget(card, player, target) {
			if (player == target) {
				return (
					player.countCards("e", function (card) {
						return lib.filter.cardDiscardable(card, player);
					}) > 0
				);
			}
			return target.countDiscardableCards(player, "e") > 0;
		},
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countCards("e") > 0;
			});
		},
		useShaValue(player) {
			let cache = _status.event.getTempCache("xinkuangfu", "useShaValue");
			if (cache) {
				return cache;
			}
			let eff = -Infinity,
				odds = 0,
				tar = null;
			game.countPlayer(cur => {
				if (!player.canUse("sha", cur, false)) {
					return;
				}
				let eff2 = get.effect(cur, { name: "sha" }, player, player);
				if (eff2 < eff) {
					return;
				}
				let directHit = 1 - cur.mayHaveShan(player, "use", true, "odds");
				if (get.attitude(player, cur) > 0) {
					directHit = 1;
				} else {
					eff2 *= directHit;
				}
				if (eff2 <= eff) {
					return;
				}
				tar = cur;
				eff = eff2;
				odds = directHit;
			});
			_status.event.putTempCache("xinkuangfu", "useShaValue", {
				tar,
				eff,
				odds,
			});
			return { tar, eff, odds };
		},
		content() {
			"step 0";
			if (player == target) {
				player.chooseToDiscard("e", true);
			} else {
				player.discardPlayerCard(target, "e", true);
			}
			"step 1";
			player.chooseUseTarget("sha", true, false, "nodistance");
			"step 2";
			var bool = game.hasPlayer2(function (current) {
				return (
					current.getHistory("damage", function (evt) {
						return evt.getParent("xinkuangfu") == event;
					}).length > 0
				);
			});
			if (player == target && bool) {
				player.draw(2);
			} else if (player != target && !bool) {
				player.chooseToDiscard("h", 2, true);
			}
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) - 0.3;
			},
			result: {
				player(player, target) {
					let cache = lib.skill.xinkuangfu.useShaValue(player),
						eff = cache.eff / 10;
					if (player === target) {
						return 2 * cache.odds + eff;
					}
					return Math.min(2, player.countCards("h")) * (cache.odds - 1) + eff;
				},
				target(player, target) {
					let att = get.attitude(player, target),
						max = 0,
						min = 1;
					target.countCards("e", function (card) {
						var val = get.value(card, target);
						if (val > max) {
							max = val;
						}
						if (val < min) {
							min = val;
						}
					});
					if (att <= 0) {
						if (target.hasSkillTag("noe")) {
							return 2 - max / 3;
						}
						if (min <= 0) {
							return 1;
						}
						return -max / 3;
					}
					if (target.hasSkillTag("noe")) {
						return 2 - min / 4;
					}
					if (min <= 0) {
						return 1;
					}
					if (player === target) {
						let cache = lib.skill.xinkuangfu.useShaValue(player);
						return cache.eff / 10 - 1;
					}
					return 0;
				},
			},
		},
	},
};

export default skills;
