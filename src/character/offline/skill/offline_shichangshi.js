import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	// 十常侍共用技能
	pschangshi: {
		initSkill(changshi, skill) {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					charlotte: true,
					onremove: true,
					mark: true,
					intro: {
						name: `常侍（${get.translation(changshi)}）`,
						name2: "常侍",
						content: "mark",
					},
				};
				lib.translate[skill] = "常侍";
				lib.translate[skill + "_bg"] = "侍";
			}
		},
		changshi: ["ps_zhangrang", "ps_zhaozhong", "ps_sunzhang", "ps_bilan", "ps_xiayun", "ps_hankui", "ps_lisong", "ps_duangui", "ps_guosheng", "ps_gaowang"],
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const changshi = get.info(event.name).changshi.randomGet();
			const skill = `${changshi}_${player.playerid}`;
			game.broadcastAll(get.info(event.name).initSkill, changshi, skill);
			player.addSkill([skill, `${event.name}_effect`]);
			player.addMark(skill, 1);
			game.broadcastAll(
				(player, changshi, skill) => {
					if (player.marks[skill]) {
						player.marks[skill].setBackground(changshi, "character");
					}
				},
				player,
				changshi,
				skill
			);
		},
		group: "pschangshi_remove",
		subSkill: {
			remove: {
				trigger: { player: "removeMark" },
				forced: true,
				locked: false,
				filter(event, player) {
					return get.info("pschangshi").changshi.some(name => event.markName == `${name}_${player.playerid}`);
				},
				async content(event, trigger, player) {
					await player.loseMaxHp();
				},
			},
			effect: {
				charlotte: true,
				trigger: {
					player: "damageBegin4",
					global: "phaseDiscardBegin",
				},
				filter(event, player) {
					if (get.info("pschangshi").changshi.every(name => !player.hasMark(`${name}_${player.playerid}`))) {
						return false;
					}
					if (event.name == "phaseDiscard") {
						return get.info("jsrgzhenglve").isFirst(event.player);
					}
					if (event.player.hp + event.player.hujia > event.num) {
						return false;
					}
					return game.hasPlayer(current => {
						return current != player && get.info("pschangshi").changshi.some(name => current.hasMark(`${name}_${current.playerid}`));
					});
				},
				async cost(event, trigger, player) {
					if (trigger.name == "phaseDiscard") {
						const { player: target } = trigger;
						const result = await player
							.chooseBool(get.prompt(event.skill, target), `摸一张牌，令其本局游戏手牌上限+1`)
							.set("choice", get.attitude(player, target) > 0)
							.forResult();
						event.result = {
							bool: result?.bool,
							targets: [target],
						};
					} else {
						event.result = await player
							.chooseTarget(
								get.prompt(event.skill),
								(card, player, target) => {
									return target != player && get.info("pschangshi").changshi.some(name => target.hasMark(`${name}_${target.playerid}`));
								},
								`选择一名角色转移伤害`
							)
							.set("ai", target => {
								const player = get.player();
								return -get.attitude(player, target);
							})
							.forResult();
					}
				},
				async content(event, trigger, player) {
					const {
						targets: [target],
					} = event;
					if (trigger.name == "phaseDiscard") {
						await player.draw();
						target.addSkill("pschangshi_hand");
						target.addMark("pschangshi_hand", 1, false);
					} else {
						trigger.cancel();
						await game.delay(0.5);
						const marks = get.info("pschangshi").changshi.filter(name => player.hasMark(`${name}_${player.playerid}`));
						if (marks.length == 1) {
							const mark = `${marks[0]}_${player.playerid}`;
							player.removeMark(mark, 1);
							if (!player.hasMark(mark)) {
								player.removeSkill(mark);
							}
						} else if (marks.length) {
							const result = await player.chooseButton(["选择一个常侍标记移去", [marks, "character"]], true).forResult();
							if (result?.bool && result?.links?.length) {
								const mark = `${result.links[0]}_${player.playerid}`;
								player.removeMark(mark, 1);
								if (!player.hasMark(mark)) {
									player.removeSkill(mark);
								}
							}
						}
						if (get.info("pschangshi").changshi.every(name => !player.hasMark(`${name}_${player.playerid}`))) {
							player.removeSkill(event.name);
						}
						await target
							.damage(trigger.source ? trigger.source : "nosource", trigger.nature, trigger.num)
							.set("card", trigger.card)
							.set("cards", trigger.cards);
					}
				},
			},
			hand: {
				charlotte: true,
				onremove: true,
				markimage: "image/card/handcard.png",
				intro: { content: "手牌上限+#" },
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("pschangshi_hand");
					},
				},
			},
		},
	},
	// 张让
	pstaoluan: {
		audio: "scstaoluan",
		enable: "phaseUse",
		usable(skill, player) {
			return game.filterPlayer().reduce((num, current) => {
				const count = get.info("pschangshi").changshi.reduce((sum, name) => sum + current.countMark(`${name}_${current.playerid}`), 0);
				return num + count;
			}, 0);
		},
		filter(event, player) {
			if (!player.countCards("hes")) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (!["basic", "trick"].includes(info[0]) || player.getStorage("pstaoluan_record").includes(info[2])) {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = get.inpileVCardList(info => {
					if (!["basic", "trick"].includes(info[0]) || player.getStorage("pstaoluan_record").includes(info[2])) {
						return false;
					}
					return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
				});
				return ui.create.dialog("滔乱", [vcards, "vcard"]);
			},
			check(button) {
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
			},
			backup(links, player) {
				return {
					audio: "pstaoluan",
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3] },
					filterCard: true,
					position: "hes",
					async precontent(event, trigger, player) {
						player.addTempSkill("pstaoluan_record");
						player.markAuto("pstaoluan_record", [event.result.card.name]);
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			combo: "pschangshi",
			order: 7,
			result: { player: 1 },
			threaten: 1.9,
		},
		subSkill: {
			record: {
				charlotte: true,
				onremove: true,
				intro: { content: "已记录牌名：$" },
			},
		},
	},
	// 赵忠
	pschiyan: {
		audio: "scschiyan",
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && event.target.countCards("he") && player.countCards("he");
		},
		logTarget: "target",
		check(event, player) {
			return get.attitude(player, event.target) <= 0;
		},
		async content(event, trigger, player) {
			for (const target of [player, trigger.target].sortBySeat()) {
				if (!target.isIn() || !target.countCards("he")) {
					continue;
				}
				const result = await target
					.chooseCard("鸱咽：将任意张牌置于武将牌上直到回合结束", [1, Infinity], true, "he", "allowChooseAll")
					.set("ai", card => {
						const player = get.player();
						if (ui.selected.cards.length) {
							return 0;
						}
						return 6 - get.value(card);
					})
					.forResult();
				if (result?.bool && result?.cards?.length) {
					target.addSkill(event.name + "_gain");
					const next = target.addToExpansion("giveAuto", result.cards, target);
					next.gaintag.add(event.name + "_gain");
					await next;
				}
			}
			const { target } = trigger;
			if (target.countCards("h") <= player.countCards("h")) {
				target.addTempSkill(event.name + "_damage");
			}
			if (target.countCards("h") >= player.countCards("h")) {
				target.addTempSkill(event.name + "_effect");
			}
		},
		subSkill: {
			gain: {
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return player.countExpansions("pschiyan_gain");
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions(event.name);
					await player.gain(cards, "draw");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张“鸱咽”牌");
					player.removeSkill(event.name);
				},
				intro: {
					markcount: "expansion",
					mark(dialog, storage, player) {
						var cards = player.getExpansions("pschiyan_gain");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
				},
			},
			damage: {
				charlotte: true,
				trigger: { player: "damageBegin3" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.num++;
				},
				mark: true,
				intro: { content: "本回合受到的伤害+1" },
			},
			effect: {
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						const hs = player.getCards("h");
						if ([card].concat(card.cards || []).containsSome(...hs)) {
							return false;
						}
					},
					cardSavable(card, player) {
						return lib.skill.pschiyan_effect.mod.cardEnabled.apply(this, arguments);
					},
				},
				mark: true,
				intro: { content: "本回合不能使用手牌" },
			},
		},
	},
	// 孙璋
	pszimou: {
		audio: "scszimou",
		trigger: { player: "phaseUseBegin" },
		forced: true,
		logTarget: () => game.filterPlayer().sortBySeat(),
		async content(event, trigger, player) {
			for (const target of event.targets) {
				if (!target.isIn()) {
					continue;
				}
				if (target != player) {
					const result = !target.countCards("he")
						? { bool: false }
						: await target
								.chooseToGive(player, "he", `交给${get.translation(player)}一张牌，或弃置其一张牌并受到其造成的1点伤害`)
								.set("ai", card => {
									const { player, target } = get.event();
									if (get.damageEffect(player, target, player) + get.effect(target, { name: "guohe_copy2" }, player, player) > 0) {
										return 0;
									}
									return 6 - get.value(card);
								})
								.forResult();
					if (!result?.bool) {
						if (player.countDiscardableCards(target, "he")) {
							await target.discardPlayerCard(player, "he", true);
							await target.damage();
						}
					}
				} else if (player.countDiscardableCards(player, "he")) {
					await player.chooseToDiscard("he", true);
					await player.damage();
				}
			}
		},
	},
	// 毕岚
	psbicai: {
		audio: "scspicai",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.countPlayer(current => current.countCards("h")) >= player.getHp() && player.getHp() > 0;
		},
		filterTarget(card, player, target) {
			return target.countCards("h");
		},
		selectTarget() {
			return get.player().getHp();
		},
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const num = event.targets.length;
			const list = [];
			for (const target of event.targets.sortBySeat()) {
				if (target.isIn() && target.countCards("h")) {
					const result = await target.chooseCard("选择一张手牌置于牌堆顶", "h", true).forResult();
					if (result?.bool && result?.cards?.length) {
						list.push(target);
						await target.lose(result.cards, ui.cardPile, "insert");
						game.broadcastAll(player => {
							const cardx = ui.create.card();
							cardx.classList.add("infohidden");
							cardx.classList.add("infoflip");
							player.$throw(cardx, 1000, "nobroadcast");
						}, target);
					}
					if (player == game.me) {
						await game.delay(0.5);
					}
				}
			}
			let cards = get.cards(num);
			await game.cardsGotoOrdering(cards);
			await player.showCards(cards, get.translation(player) + `发动了【${get.translation(event.name)}】`);
			const draw = cards.map(card => get.type2(card)).toUniqued().length;
			await player.draw(draw);
			if (draw == 3 && cards.someInD()) {
				cards = cards.filterInD();
				for (const target of list.sortBySeat()) {
					if (!target.isIn()) {
						continue;
					}
					const result = cards.length == 1 ? { bool: true, links: cards } : await target.chooseButton([`${get.translation(event.name)}：获得其中一张牌`, cards], true).forResult();
					if (result?.bool && result?.links?.length) {
						const { links } = result;
						await target.gain(links, "gain2");
						cards.remove(links[0]);
					}
				}
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
	},
	// 夏恽
	psyaozhuo: {
		audio: "scsyaozhuo",
		enable: "phaseUse",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (!game.hasPlayer(current => player.canCompare(current))) {
				return false;
			}
			return event.name == "damage" || !player.hasSkill("psyaozhuo_used", null, null, false);
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player.canCompare(target);
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, "psyaozhuo", player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			if (!trigger) {
				player.addTempSkill(event.name + "_used", "phaseUseAfter");
			}
			const {
				targets: [target],
			} = event;
			const result = await player.chooseToCompare(target).forResult();
			if (result?.bool) {
				target.addTempSkill(event.name + "_effect");
				target.addMark(event.name + "_effect", 2, false);
			} else {
				await player.recover();
			}
		},
		ai: {
			order(item, player) {
				if (player.isDamaged()) {
					return 10;
				}
				return 1;
			},
			result: {
				target(player, target) {
					var hs = player.getCards("h").sort((a, b) => b.number - a.number);
					var ts = target.getCards("h").sort((a, b) => b.number - a.number);
					if (!hs.length || !ts.length) {
						return 0;
					}
					if ((hs[0].number > ts[0].number - 2 && hs[0].number > 5) || player.isDamaged()) {
						return -1;
					}
					return 0;
				},
			},
		},
		group: "psyaozhuo_gain",
		subSkill: {
			used: { charlotte: true },
			effect: {
				// charlotte: true,
				charlotte: true,
				onremove: true,
				markimage: "image/card/handcard.png",
				intro: { content: "本回合手牌上限-#" },
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("psyaozhuo_effect");
					},
				},
			},
			gain: {
				audio: "scspsyaozhuo",
				getCards(event, player) {
					if (event.compareMultiple) {
						return [];
					}
					if (event.compareMeanwhile) {
						const index = [...event.targets, event.player].indexOf(player),
							winner = event.winner || event.result.winner;
						if (index < 0) {
							return [];
						}
						return event.cards
							.filter((card, i) => {
								return i !== index;
							})
							.filterInD("od");
					}
					if (player != event.player && player != event.target) {
						return [];
					}
					const bool = player == event.player;
					return [event[bool ? "card2" : "card1"]].filterInD("od");
				},
				trigger: {
					global: ["chooseToCompareAfter", "compareMultipleAfter"],
				},
				filter(event, player) {
					const cards = get.info("psyaozhuo_gain").getCards(event, player);
					return cards.length;
				},
				check(event, player) {
					const cards = get.info("psyaozhuo_gain").getCards(event, player);
					return cards.every(card => card.name != "du");
				},
				prompt2(event, player) {
					const cards = get.info("psyaozhuo_gain").getCards(event, player);
					return `获得${get.translation(cards)}`;
				},
				async content(event, trigger, player) {
					const cards = get.info(event.name).getCards(trigger, player);
					await player.gain(cards, "gain2", "log");
				},
			},
		},
	},
	// 韩悝
	psxiaolu: {
		audio: "scsxiaolu",
		global: "psxiaolu_give",
		subSkill: {
			give: {
				enable: "phaseUse",
				prompt() {
					const player = get.player();
					const list = game.filterPlayer(current => current != player && current.hasSkill("psxiaolu"));
					let str = "将一张牌交给" + get.translation(list);
					if (list.length > 1) {
						str += "中的一人";
					}
					return str;
				},
				filter(event, player) {
					if (!player.countCards("he") || player.hasSkill("psxiaolu_used", null, null, false)) {
						return false;
					}
					return game.hasPlayer(current => current != player && current.hasSkill("psxiaolu"));
				},
				filterTarget(card, player, target) {
					return target != player && target.hasSkill("psxiaolu");
				},
				selectTarget() {
					const player = get.player();
					const count = game.countPlayer(current => current != player && current.hasSkill("psxiaolu"));
					return count > 1 ? 1 : -1;
				},
				chessForceAll: true,
				check(card) {
					const player = get.player();
					const hasFriend = game.hasPlayer(current => {
						return current != player && current.hasSkill("psxiaolu") && get.attitude(player, current) > 0;
					});
					return (hasFriend ? 7 : 1) - get.value(card);
				},
				filterCard: true,
				position: "he",
				discard: false,
				lose: false,
				delay: false,
				line: true,
				log: false,
				async content(event, trigger, player) {
					const { target } = event;
					player.logSkill("psxiaolu", target);
					player.addTempSkill("psxiaolu_used", "phaseUseEnd");
					await player.give(event.cards, target);
					const targets = game.filterPlayer(current => current != player && current != target);
					if (!targets.length) {
						return;
					}
					const result =
						targets.length == 1
							? { bool: true, targets }
							: await player
									.chooseTarget("请选择你要使用牌的目标", true, (card, player, target) => {
										return get.event().targetsx.includes(target);
									})
									.set("ai", target => {
										const player = get.player();
										return Math.max.apply(
											Math,
											lib.inpile
												.filter(name => get.type(name) == "trick")
												.map(name => {
													const card = { name, isCard: true };
													if (!player.canUse(card, target, false)) {
														return 0;
													}
													return get.effect(target, card, player, player);
												})
										);
									})
									.set("targetsx", targets)
									.forResult();
					if (result?.bool && result?.targets?.length) {
						const [target1] = result.targets;
						player.line(target1);
						game.log(player, "选择了", target1);
						const list = get.inpileVCardList(info => {
							return info[0] == "trick" && player.canUse({ name: info[2], nature: info[3], isCard: true }, target1, false);
						});
						if (list.length) {
							const result =
								list.length == 1
									? { bool: true, links: list }
									: await player
											.chooseButton([`请选择你要${get.translation(target1)}使用的牌`, [list, "vcard"]], true)
											.set("ai", button => {
												const { player, target1 } = get.event();
												return get.effect(target1, { name: button.link[2], nature: button.link[3], isCard: true }, player, player);
											})
											.set("target1", target1)
											.forResult();
							if (result?.bool && result?.links?.length) {
								const card = get.autoViewAs({ name: result.links[0][2], isCard: true, nature: result.links[0][3] });
								await player.useCard(card, false, target1);
							}
						}
					}
				},
				ai: {
					expose: 0.3,
					order: 10,
					result: { target: 5 },
				},
			},
			used: { charlotte: true },
		},
	},
	// 栗嵩
	pskuiji: {
		audio: "scskuiji",
		inherit: "scskuiji",
		async content(event, trigger, player) {
			const { target } = event;
			if (!target.countCards("h")) {
				return;
			}
			event.list1 = [];
			event.list2 = [];
			const dialog = [];
			if (player.countCards("h")) {
				dialog.addArray(["你的手牌", player.getCards("h")]);
			}
			if (target.countCards("h")) {
				dialog.addArray([get.translation(target) + "的手牌", target.getCards("h")]);
			}
			const next = player.chooseButton(4, dialog);
			next.set("target", target);
			next.set("ai", button => {
				const { player, target } = get.event();
				const ps = [];
				const ts = [];
				for (let i = 0; i < ui.selected.buttons.length; i++) {
					const card = ui.selected.buttons[i].link;
					if (target.getCards("h").includes(card)) {
						ts.push(card);
					} else {
						ps.push(card);
					}
				}
				const card = button.link;
				const owner = get.owner(card);
				const val = get.value(card) || 1;
				if (owner == target) {
					return 2 * val;
				}
				return 7 - val;
			});
			next.set("filterButton", button => {
				if (get.owner(button.link) && !lib.filter.canBeDiscarded(button.link, get.owner(button.link), get.player())) {
					return false;
				}
				for (let i = 0; i < ui.selected.buttons.length; i++) {
					if (get.suit(button.link) == get.suit(ui.selected.buttons[i].link)) {
						return false;
					}
				}
				return true;
			});
			const result = await next.forResult();
			if (result?.bool && result?.links?.length) {
				for (const link of result.links) {
					if (get.owner(link) == player) {
						event.list1.push(link);
					} else {
						event.list2.push(link);
					}
				}
				if (event.list1.length && event.list2.length) {
					await game
						.loseAsync({
							lose_list: [
								[player, event.list1],
								[target, event.list2],
							],
							discarder: player,
						})
						.setContent("discardMultiple");
				} else if (event.list2.length) {
					await target.discard(event.list2);
				} else {
					await player.discard(event.list1);
				}
				if (event.list1.length != event.list2.length) {
					const list = [player, target];
					if (event.list1.length < event.list2.length) {
						list.reverse();
					}
					await list[0].loseHp();
					await list[1].addTempSkills("rechouhai", "roundEnd");
				}
			}
		},
		derivation: "rechouhai",
	},
	// 段珪
	pschihe: {
		audio: "scschihe",
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			return event.targets.length == 1 && event.card.name == "sha";
		},
		logTarget(event, player) {
			return player == event.player ? event.targets[0] : event.player;
		},
		check(event, player) {
			const target = get.info("pschihe").logTarget(event, player);
			return get.attitude(player, target) <= 0 || !player.canCompare(target);
		},
		async content(event, trigger, player) {
			await player.draw(2);
			if (!player.countCards("h")) {
				return;
			}
			const result = await player.chooseCard("h", true, 2, "选择两张手牌展示").forResult();
			if (result?.bool && result?.cards?.length) {
				await player.showCards(result.cards, get.translation(player) + "发动了【" + get.translation(event.name) + "】");
			}
			const target = get.info(event.name).logTarget(trigger, player);
			if (player.canCompare(target)) {
				const result = await player.chooseToCompare(target).forResult();
				if (result?.bool) {
					const evt = trigger.getParent();
					if (typeof evt.baseDamage != "number") {
						evt.baseDamage = 1;
					}
					evt.baseDamage++;
				} else if (player.countDiscardableCards(player, "he")) {
					await player.chooseToDiscard("he", 2, true);
				}
			}
		},
	},
	// 郭胜
	psniqu: {
		audio: "scsniqu",
		trigger: { global: ["useCardAfter", "respondAfter"] },
		filter(event, player) {
			return event.card?.name == "shan";
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0 || player == event.player;
		},
		usable: 1,
		logTarget: "player",
		async content(event, trigger, player) {
			await player.draw();
			const { player: target } = trigger;
			const sha = get.autoViewAs({ name: "sha", isCard: true });
			if (player.canUse(sha, target, false)) {
				await player.useCard(sha, target, false);
			}
		},
	},
	// 高望
	psmiaoyu: {
		audio: "scsmiaoyu",
		trigger: { global: "recoverEnd" },
		filter(event, player) {
			return event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const { player: target } = trigger;
			player.addTempSkill(event.name + "_effect");
			player.markAuto(event.name + "_effect", [target]);
			const gainEvent = target.gain(get.cards(), "draw");
			gainEvent.giver = player;
			await gainEvent;
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					for (const target of player.getStorage(event.name)) {
						if (!target.isIn()) {
							continue;
						}
						const num = game.getGlobalHistory("everything", evt => evt.name == "psmiaoyu").length;
						player.line(target, "green");
						await target.loseHp(num);
					}
				},
			},
		},
	},
};

export default skills;
