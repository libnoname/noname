import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//谋陈泰
	sbdengxian: {
		audio: 2,
		enable: "chooseToUse",
		usable(skill, player) {
			return 1 + player.countMark("sbdengxian_count");
		},
		filter(event, player) {
			if (!player.countCards("e")) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (info[0] !== "basic" || player.getStorage("sbdengxian_round").includes(info[2])) {
					return false;
				}
				return event.filterCard(
					get.autoViewAs(
						{
							name: info[2],
							nature: info[3],
						},
						"unsure"
					),
					player,
					event
				);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (info[0] !== "basic" || player.getStorage("sbdengxian_round").includes(info[2])) {
						return false;
					}
					return event.filterCard(
						get.autoViewAs(
							{
								name: info[2],
								nature: info[3],
							},
							"unsure"
						),
						player,
						event
					);
				});
				return ui.create.dialog("登险", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard(
					{
						name: button.link[2],
						nature: button.link[3],
					},
					player,
					_status.event.getParent()
				);
			},
			check(button) {
				if (_status.event.getParent().type !== "phase") {
					return 1;
				}
				const player = get.player();
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					filterCard: true,
					audio: "sbdengxian",
					popname: true,
					check(card) {
						return 10 - get.value(card);
					},
					position: "e",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					log: false,
					async precontent(event, trigger, player) {
						event.getParent().addCount = false;
						player
							.when({
								player: ["useCardAfter"],
							})
							.filter(evt => evt.getParent() === event.getParent())
							.then(async (event, trigger, player) => {
								const bool1 = player.isDamaged();
								const bool2 = trigger.targets?.some(target => !target.isDamaged());
								if (bool1) {
									player.line(trigger.targets);
									await player.gainMultiple(trigger.targets.sortBySeat(), "he");
								}
								if (bool2) {
									player.addTempSkill("sbdengxian_count");
									player.addMark("sbdengxian_count", 1, false);
								}
								if (bool1 && bool2) {
									player.popup("乘势");
									const cards = [];
									game.checkGlobalHistory("cardMove", evt => {
										if (evt.name === "lose" && evt.position === ui.discardPile) {
											cards.addArray(evt.cards.filterInD("d"));
										}
										if (evt.name === "cardsDiscard" && !get.info("dcfuxue").isUse(evt)) {
											cards.addArray(evt.cards.filterInD("d"));
										}
									});
									if (cards.some(card => player.canEquip(card, true))) {
										const card = cards.filter(card => player.canEquip(card, true)).randomGet();
										await player.gain({ cards: [card], animate: "gain2" });
										if (player.getCards("h").includes(card)) {
											await player.chooseUseTarget({ card, forced: true });
										}
									} else {
										player.popup("杯具");
									}
								}
							});
						player.logSkill("sbdengxian");
						player.addTempSkill("sbdengxian_round", "roundStart");
						player.markAuto("sbdengxian_round", [event.result.card.name]);
					},
				};
			},
			prompt(links, player) {
				return `将一张装备区内的牌当做${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}使用`;
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name) || player.getStorage("sbdengxian_round").includes(name)) {
				return false;
			}
			const type = get.type(name);
			return type === "basic" && player.countCards("e");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (!player.countCards("e")) {
					return false;
				}
				if (tag === "respondSha" && player.getStorage("sbdengxian_round").includes("sha")) {
					return false;
				}
				if (tag === "respondShan" && player.getStorage("sbdengxian_round").includes("shan")) {
					return false;
				}
			},
			order: 7,
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
			count: { charlotte: true, onremove: true },
			round: { charlotte: true, onremove: true },
		},
	},
	sbzhejian: {
		audio: 2,
		limited: true,
		skillAnimation: true,
		animationColor: "watar",
		enable: "phaseUse",
		filter(event, player) {
			return player.countDiscardableCards(player, "h", card => get.type(card) === "basic");
		},
		filterCard(card, player) {
			return get.type(card) === "basic" && lib.filter.cardDiscardable(card, player, "sbzhejian");
		},
		selectCard: -1,
		filterTarget: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.addSkill(`${event.name}_effect`);
			player.markAuto(`${event.name}_effect`, [event.target]);
		},
		ai: {
			order: 5,
			result: {
				player: 1,
				target: -1,
			},
		},
		subSkill: {
			used: { charlotte: true },
			effect: {
				mark: true,
				charlotte: true,
				intro: {
					content: "已标记$",
				},
				trigger: {
					global: ["useCardToPlayered", "dying"],
				},
				filter(event, player) {
					if (event.name === "dying") {
						return player.getStorage("sbzhejian_effect").includes(event.player) && event.reason.getParent()?.name === "sbzhejian_effect";
					}
					if (!player.getStorage("sbzhejian_effect").includes(event.target) || player.hasSkill("sbzhejian_used")) {
						return false;
					}
					const target = game.findPlayer(current => current.getSeatNum() === 1);
					if (!target?.isIn() || !event.target?.isIn()) {
						return false;
					}
					const history = event.player.getHistory("useCard");
					const index = history.indexOf(event.getParent());
					if (index > 0) {
						return history[index - 1]?.targets?.includes(event.target);
					}
					return false;
				},
				async cost(event, trigger, player) {
					if (trigger.name === "dying") {
						event.result = {
							bool: true,
						};
					} else {
						const player2 = trigger.player;
						const target = trigger.target;
						const one = game.findPlayer(current => current.getSeatNum() === 1);
						const list = [];
						const choiceList = [`对${get.translation(target)}造成1点伤害`, `令${get.translation(one)}摸两张牌`];
						if (target?.isIn()) {
							list.push("选项一");
						} else {
							choiceList[0] = `<span style="opacity:0.5">${choiceList[0]}</span>`;
						}
						if (one?.isIn()) {
							list.push("选项二");
						} else {
							choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
						}
						if (!list.length) {
							return;
						}
						const result =
							list.length > 1
								? await player2
										.chooseControl({
											controls: list,
											choiceList: choiceList,
											prompt: "谪仙：请选择一项",
											ai() {
												const { player, target, one, controls } = get.event();
												if (get.attitude(player, target) > 0) {
													controls.remove("选项一");
												}
												return controls.slice(0).randomGet();
											},
										})
										.set("one", one)
										.set("target", target)
										.forResult()
								: { control: list[0] };
						if (typeof result?.control === "string") {
							event.result = {
								bool: true,
								cost_data: result.control,
								targets: [player2],
							};
						}
					}
				},
				popup: false,
				async content(event, trigger, player) {
					if (trigger.name === "dying") {
						player.line(trigger.player);
						player.unmarkAuto(event.name, [trigger.player]);
					} else {
						player.addTempSkill("sbzhejian_used");
						const {
							cost_data: link,
							targets: [player2],
						} = event;
						if (link === "选项一") {
							player.line([player2, trigger.target]);
							await trigger.target.damage({ source: player2 });
						} else {
							const one = game.findPlayer(current => current.getSeatNum() === 1);
							player.line([player2, one]);
							await one.draw(2);
						}
					}
				},
			},
		},
	},
	//谋朱然
	sbzhenwei: {
		audio: 2,
		chooseToDiscard(player, source, target, eventId) {
			const next = player.chooseToDiscard({
				prompt: "镇围：是否弃置任意张牌",
				selectCard: [1, Infinity],
				position: "he",
				chooseonly: true,
			});
			next.set("ai", card => {
				const { sourcex, targetx, player } = get.event();
				if (!targetx.hasCards("he") || (get.attitude(player, sourcex) < 0 && player != targetx)) {
					return 0;
				}
				if (get.attitude(sourcex, targetx) > 0 || ui.selected.cards?.length >= Math.min(3, targetx.countCards("he"))) {
					return 0;
				}
				if (player == targetx && player.countCards("he") < 3) {
					return 0;
				}
				return 5.5 - get.value(card);
			});
			next.set("sourcex", source);
			next.set("targetx", target);
			next.set("id", eventId);
			next.set("_global_waiting", true);
			return next;
		},
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const others = player.getStorage(event.name).filter(i => ![player, target].includes(i));
			const map = await game.chooseAnyOL([player, target, ...others], get.info(event.name).chooseToDiscard, [player, target]).forResult();
			const cards1 = [];
			const cards2 = [];
			let n = 0;
			for (const targetx of Array.from(map.keys()).sortBySeat()) {
				const result = map.get(targetx);
				if (result?.bool && result.cards?.length) {
					const { cards } = result;
					await targetx.modedDiscard(cards);
					if (targetx === target) {
						cards2.push(...cards);
					} else {
						if (targetx === player) {
							const storage = player.getStorage(`${event.name}_last`, []);
							n = cards.length;
							player.setStorage(`${event.name}_last`, storage);
						}
						cards1.push(...cards);
					}
				}
			}
			const storage = player.getStorage(`${event.name}_last`, []);
			storage[0] = n;
			player.setStorage(`${event.name}_last`, storage);
			let num = 0;
			["suit", "length", "type2"].forEach(method => {
				let num1;
				let num2;
				if (method === "length") {
					num1 = cards1.length;
					num2 = cards2.length;
				} else {
					num1 = cards1.map(card => get[method](card)).unique().length;
					num2 = cards2.map(card => get[method](card)).unique().length;
				}
				if (num1 >= num2) {
					num++;
				}
			});
			if (num > 0) {
				const result = await player
					.chooseButton({
						createDialog: [
							`镇围：执行至多${num}项`,
							[
								[
									["hujia", "获得1点护甲"],
									["draw", "摸四张牌"],
									["damage", `对${get.translation(target)}造成1点伤害`],
								],
								"textbutton",
							],
						],
						selectButton: [1, num],
					})
					.set("targetx", target)
					.set("ai", button => {
						const { targetx, player } = get.event();
						switch (button.link) {
							case "damage":
								return get.damageEffect(targetx, player, player);
							case "draw":
								return get.effect(player, { name: "draw" }, player, player) * 4;
							case "hujia":
								return 1;
						}
					})
					.forResult();
				if (result?.bool && result.links?.length) {
					const { links } = result;
					const storage = player.getStorage(`${event.name}_last`, []);
					const list = ["hujia", "draw", "damage"];
					links.sort((a, b) => list.indexOf(a) - list.indexOf(b));
					const map = get.info(event.name).map;
					for (const link of links) {
						const func = map[link][2];
						storage[1] = link;
						player.setStorage(`${event.name}_last`, storage);
						if (link === "damage") {
							await func(target);
						} else {
							await func(player);
						}
					}
				}
			}
		},
		map: {
			damage: ["对其造成1点伤害", (player, target) => get.damageEffect(target, player, player), player => player.damage()],
			draw: ["摸四张牌", (player, target) => get.effect(target, { name: "draw" }, player, player), player => player.draw(4)],
			hujia: ["获得1点护甲", (player, target) => get.recoverEffect(target, player, player), player => player.changeHujia(1, void 0, true)],
		},
		ai: {
			order: 6,
			result: {
				target: -1,
			},
		},
		intro: {
			content: "$与你合势而击之",
		},
	},
	sbheyuan: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			const storage = player.getStorage("sbzhenwei_last", []);
			const num = storage[0] || 0;
			return player.countCards("he") > num;
		},
		async cost(event, trigger, player) {
			const storage = player.getStorage("sbzhenwei_last", []);
			const map = get.info("sbzhenwei").map;
			event.result = await player
				.chooseCardTarget({
					prompt: `${get.prompt2(event.skill)}<br><span class=bluetext>上次弃牌数：${storage[0] || 0}<br>最后执行选项：${map[storage[1]]?.[0] || "无"}</span>`,
					filterTarget: (card, player, target) => {
						return true;
					},
					filterCard: lib.filter.cardDiscardable,
					selectCard: storage[0] || 0,
					position: "he",
					ai1(card) {
						return 7 - get.value(card);
					},
					ai2(target) {
						const { map, player } = get.event();
						const storage = player.getStorage("sbzhenwei_last", []);
						const num = storage[0] || 0;
						const choice = storage[1];
						let eff = 1;
						if (choice) {
							eff = map[choice][1](player, target);
						}
						if (!num || (num < 3 && player.hasCard(card => 6 - get.value(card), "he"))) {
							return eff;
						}
						return 0;
					},
				})
				.set("map", map)
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			player.markAuto(event.name, target);
			const storage = player.getStorage("sbzhenwei_last", []);
			await player.discard({ cards });
			player.markAuto("sbzhenwei", target);
			const map = get.info("sbzhenwei").map;
			const choice = storage[1];
			if (choice) {
				await map[choice][2](target);
			}
		},
	},
	//谋张郃·重做
	sbqiaobian: {
		getNum(player) {
			return ["h", "e", "j"].filter(position => {
				const cards = player.getDiscardableCards(player, position);
				if (position === "j") {
					return cards.some(card => {
						const cardj = card.viewAs ? { name: card.viewAs } : card;
						if (cardj.name === "xumou_jsrg") {
							return false;
						}
						return get.effect(player, cardj, player, player) < 0;
					});
				} else if (position === "e") {
					if (cards.some(card => get.value(card, player) < 7)) {
						return true;
					}
					if (player.isDamaged() && cards.some(card => card.name === "baiyin") && get.recoverEffect(player, player, player) > 0) {
						if (player.hp === 1 && !player.hujia) {
							return true;
						}
					}
					return false;
				}
				return cards.some(card => get.value(card, player) < 6.5);
			}).length;
		},
		choice: {
			phaseDraw(player, bool = false, numx = 0) {
				let i;
				let num = 0;
				let num2 = 0;
				const players = game.players;
				for (i = 0; i < players.length; i++) {
					if (player !== players[i] && players[i].countCards("h")) {
						const att = get.attitude(player, players[i]);
						if (att <= 0) {
							num++;
						}
						if (att < 0) {
							num2++;
						}
					}
				}
				if (num >= 2 && num2 > 0) {
					if (bool) {
						const max = get.info("sbqiaobian").getNum(player);
						if (max === 1 && !player.needsToDiscard()) {
							return 4.5;
						}
					} else {
						if (numx === 1 && !player.needsToDiscard()) {
							return 4.5;
						}
					}
					return !player.needsToDiscard() ? 3 : 2;
				}
				if (!num2) {
					return 0;
				}
				return 1.5;
			},
			phaseUse(player, bool = false, numx = 0) {
				if (player.canMoveCard(true)) {
					if (bool) {
						const max = get.info("sbqiaobian").getNum(player);
						if (max === 1 && player.countCards("h", card => player.hasValueTarget(card)) > 2) {
							return 0;
						}
						return player.countCards("h") >= game.players.length - 1 ? 2 : 1;
					} else {
						if (numx === 1 && player.countCards("h", card => player.hasValueTarget(card)) > 2) {
							return 0;
						}
						return 1.5;
					}
				}
				return 0;
			},
			phaseDiscard(player, bool = false, numx = 0) {
				if (player.countCards("h") >= game.players.length - 1 || player.needsToDiscard() >= 3) {
					return 4;
				}
				return 3.5;
			},
		},
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.hasDiscardableCards(player, "hej");
		},
		async cost(event, trigger, player) {
			const num1 = ["phaseDraw", "phaseUse", "phaseDiscard"].filter(phase => get.info(event.skill).choice[phase](player, true) > 0).length;
			const num2 = get.info(event.skill).getNum(player);
			event.result = await player
				.discardPlayerCard({
					prompt: get.prompt2(event.skill),
					target: player,
					position: "hej",
					selectButton: [1, 3],
				})
				.set("chooseonly", true)
				.set("filterButton", button => {
					const card = button.link;
					const player = get.player();
					if (!lib.filter.cardDiscardable(card, player)) {
						return false;
					}
					return !ui.selected.buttons.reduce((list, cardx) => list.add(get.position(cardx.link)), []).includes(get.position(card));
				})
				.set("ai", button => {
					const { player, numx } = get.event();
					const card = button.link;
					if (ui.selected.buttons.length >= numx) {
						return 0;
					}
					if (get.position(card) === "j") {
						const cardj = card.viewAs ? { name: card.viewAs } : card;
						if (cardj.name === "xumou_jsrg") {
							return 0;
						}
						return -get.effect(player, cardj, player, player);
					}
					return 7 - get.value(card);
				})
				.set("numx", Math.min(num1, num2))
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event;
			await player.discard({ cards });
			const num = cards.length;
			const list = ["phaseDraw", "phaseUse", "phaseDiscard"];
			const result = await player
				.chooseButton({
					createDialog: [`###巧变###<div class='text center'>请选择要跳过的${get.cnNumber(num)}个阶段</div>`, [list.map(phase => [phase, get.translation(phase)]), "tdnodes"]],
					forced: true,
					selectButton: num,
				})
				.set("direct", true)
				.set("ai", button => {
					const { player, numx } = get.event();
					const link = button.link;
					return get.info("sbqiaobian").choice[link](player, true, numx);
				})
				.set("numx", num)
				.forResult();
			for (const phase of list.filter(phase => result.links?.includes(phase))) {
				player.skip(phase);
				game.log(player, "跳过了", `#y${get.translation(phase)}`);
				player.addTempSkill(`${event.name}_${phase}`);
			}
		},
		subSkill: {
			phaseDraw: {
				audio: "sbqiaobian",
				charlotte: true,
				trigger: { player: ["Skipped", "Cancelled"].map(i => `phaseDraw${i}`) },
				filter(event, player) {
					return game.hasPlayer(target => target !== player && target.hasGainableCards(player, "h"));
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget({
							prompt: get.prompt(event.skill),
							prompt2: "获得至多两名其他角色各一张手牌",
							selectTarget: [1, 2],
							filterTarget: (card, player, target) => target !== player && target.hasGainableCards(player, "h"),
							ai: target => get.effect(target, { name: "shunshou_copy2", position: "h" }, get.player(), get.player()),
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const next = player.gainMultiple(event.targets);
					next.gaintag.add("sbqiaobian");
					await next;
				},
			},
			phaseUse: {
				audio: "sbqiaobian",
				charlotte: true,
				trigger: { player: ["Skipped", "Cancelled"].map(i => `phaseUse${i}`) },
				filter(event, player) {
					return player.canMoveCard();
				},
				prompt2: "移动场上一张牌",
				check(event, player) {
					return player.canMoveCard(true);
				},
				async content(event, trigger, player) {
					const num = player.countCards("he");
					const result = await player.moveCard({ forced: true }).forResult();
					if (result?.targets?.length) {
						const target = result.targets[1];
						if (target === player) {
							const { card } = result;
							player.addGaintag(card, "sbqiaobian");
						}
						if (num === player.countCards("he")) {
							const result = await player
								.chooseBool({
									prompt: `巧变：你可以令${get.translation(target)}摸两张牌`,
									choice: get.effect(target, { name: "draw" }, player, player) > 0,
								})
								.forResult();
							if (result?.bool) {
								const next = target.draw(2);
								next.gaintag.add("sbqiaobian");
								await next;
							}
						}
					}
				},
			},
			phaseDiscard: {
				audio: "sbqiaobian",
				charlotte: true,
				trigger: { player: ["Skipped", "Cancelled"].map(i => `phaseDiscard${i}`) },
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const next = player.draw(3);
					next.gaintag.add("sbqiaobian");
					await next;
					player.addTempSkill("sbqiaobian_phaseJieshu");
				},
			},
			phaseJieshu: {
				audio: "sbqiaobian",
				charlotte: true,
				forced: true,
				locked: false,
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return player.countCards("h") >= game.players.length;
				},
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					const evt = trigger.getParent("phase", true);
					if (evt) {
						evt.phaseList.splice(evt.num + 1, 0, `phaseUse|${event.name}`);
					}
				},
			},
		},
	},
	sbliaoshi: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			return (
				/*get.type(name) === "basic" &&
				lib.inpile.includes(name) &&*/
				["sha", "shan"].includes(name) && player.hasCards("he", card => card.hasGaintag("sbqiaobian")) && !player.getStat().skill.sbliaoshi
			);
		},
		getList(event, player) {
			return get.inpileVCardList(info => {
				/*if (info[0] !== "basic") {
					return false;
				}*/
				if (!["sha", "shan"].includes(info[2])) {
					return false;
				}
				const card = get.autoViewAs({ name: info[2], nature: info[3] }, "unsure");
				return event.filterCard(card, player, event);
			});
		},
		usable: 1,
		filter(event, player) {
			return get.info("sbliaoshi").getList(event, player).length && player.hasCards("he", card => card.hasGaintag("sbqiaobian"));
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.info("sbliaoshi").getList(event, player);
				const dialog = ui.create.dialog("料势", [list, "vcard"], "hidden");
				dialog.direct = true;
				return dialog;
			},
			check(button) {
				if (_status.event.getParent().type !== "phase") {
					return 1;
				}
				if (button.link[2] === "shan") {
					return 3;
				}
				const player = get.player();
				if (button.link[2] === "jiu") {
					if (player.getUseValue({ name: "jiu" }) <= 0) {
						return 0;
					}
					if (player.countCards("h", "sha")) {
						return player.getUseValue({ name: "jiu" });
					}
				}
				return player.getUseValue({ name: button.link[2], nature: button.link[3] }) / 4;
			},
			backup(links, player) {
				return {
					audio: "sbliaoshi",
					filterCard(card, player) {
						return card.hasGaintag("sbqiaobian");
					},
					position: "he",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					popname: true,
				};
			},
			prompt(links, player) {
				return `将一张“巧变”牌当作${get.translation(links[0][3]) || ""}【${get.translation(links[0][2])}】使用或打出`;
			},
		},
		ai: {
			order: 6,
			combo: "sbqiaobian",
			respondShan: true,
			respondSha: true,
			skillTagFilter(player) {
				if (!player.hasCards("he", card => card.hasGaintag("sbqiaobian"))) {
					return false;
				}
			},
			/*tag: {
				recover: 1,
				save: 1,
			},*/
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
	//谋吕布
	sbwushuang: {
		audio: 6,
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			const target = event.player;
			const evtx = event.getParent(2);
			const card = event.card;
			const name = card?.name;
			if (!card || !["sha", "juedou"].includes(name)) {
				return false;
			}
			if (name === "sha") {
				return !target.hasHistory("useCard", evt => {
					return evt.card.name === "shan" && evt.respondTo && evt.getParent(3) === evtx;
				});
			}
			return !target.hasHistory("respond", evt => {
				return evt.card.name === "sha" && evt.respondTo && evt.getParent(3) === evtx;
			});
		},
		forced: true,
		logTarget: "player",
		usable: 2,
		logAudio: () => ["sbwushuang4.mp3", "sbwushuang5.mp3"],
		async content(event, trigger, player) {
			trigger.num++;
		},
		group: ["sbwushuang_1", "sbwushuang_2"],
		preHidden: ["sbwushuang_1", "sbwushuang_2"],
		subSkill: {
			1: {
				audio: "sbwushuang",
				sourceSkill: "sbwushuang",
				logAudio: () => ["sbwushuang1.mp3", "sbwushuang6.mp3"],
				inherit: "wushuang1",
				audioname: [],
				audioname2: {},
			},
			2: {
				audio: "sbwushuang",
				sourceSkill: "sbwushuang",
				logAudio: () => ["sbwushuang1.mp3", "sbwushuang6.mp3"],
				inherit: "wushuang2",
				audioname: [],
				audioname2: {},
			},
		},
	},
	sbliyu: {
		audio: 5,
		logAudio: index => (typeof index === "number" ? `sbliyu${index}.mp3` : 2),
		trigger: { source: "damageSource" },
		filter(event, player) {
			return event.player !== player && event?.card?.name === "sha" && event.player.countGainableCards(player, "hej") > 0 && event.player.isIn();
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			event.result = await player
				.gainPlayerCard({
					prompt: get.prompt2(event.skill),
					target: trigger.player,
					position: "hej",
					selectButton: [1, trigger.num],
				})
				.set("logSkill", [event.skill, [target], null, null, [get.rand(1, 2)]])
				.forResult();
		},
		popup: false,
		async content(event, trigger, player) {
			const cards = event.cards;
			const target = trigger.player;
			const draw = (await target.draw(cards.length).forResult()).cards;
			if (Array.isArray(cards) && Array.isArray(draw)) {
				const types = [cards, draw]
					.map(list => list.map(card => get.type2(card)))
					.flat()
					.unique();
				if (types.length >= 3) {
					const list = [`${get.translation(player)}视为对你指定的另一名其他角色使用一张【决斗】`, `你获得技能〖无双〗直至你下个回合结束`];
					let result;
					const juedou = game.hasPlayer(current => current !== player && current !== target && player.canUse(new lib.element.VCard({ name: "juedou", isCard: true }), current, false));
					const wushuang = !target.hasSkill("wushuang", null, false, false);
					if (juedou || wushuang) {
						if (!juedou) {
							result = { control: "选项二" };
						} else if (!wushuang) {
							result = { control: "选项一" };
						} else {
							result = await target
								.chooseControl({
									prompt: `${get.translation(event.name)}：请选择一项`,
									choiceList: list,
									ai: () => {
										const player = get.player();
										const source = get.event().getParent().player;
										const juedou = new lib.element.VCard({ name: "juedou", isCard: true });
										return game.hasPlayer(target => {
											return ![player, source].includes(target) && source.canUse(juedou, target, false) && get.effect(target, juedou, source, player) > 0;
										})
											? "选项一"
											: "选项二";
									},
								})
								.forResult();
						}
						player.logSkill("sbliyu", null, null, null, [result.control === "选项一" ? get.rand(3, 4) : 5]);
						if (result.control === "选项一") {
							const result2 = await target
								.chooseTarget({
									forced: true,
									filterTarget: (card, player, target) => {
										const evt = get.event().getParent();
										return evt.player.canUse({ name: "juedou" }, target) && target !== get.player();
									},
									prompt: `利驭：请选择一名角色，视为${get.translation(player)}对其使用【决斗】`,
									ai: target => {
										const evt = get.event().getParent();
										return get.effect(target, { name: "juedou" }, evt.player, get.player());
									},
								})
								.set("animate", false)
								.forResult();
							if (result2?.bool && result2.targets?.length) {
								target.line2([player, result2.targets[0]]);
								await game.delayx();
								await player
									.useCard({
										card: new lib.element.VCard({ name: "juedou", isCard: true }),
										targets: [result2.targets[0]],
										addCount: false,
										noai: true,
									})
									.set("animate", false);
							}
						} else {
							const skill = `${event.name}_effect`;
							await target.addAdditionalSkills(skill, "wushuang");
							target.addTempSkill(skill, { player: "phaseAfter" });
						}
					}
				}
			}
		},
		derivation: "wushuang",
		subSkill: {
			effect: {
				charlotte: true,
				init(player) {
					game.broadcastAll(player => Array.isArray(player.tempname) && player.tempname.add("sb_lvbu"), player);
				},
				onremove(player) {
					game.broadcastAll(player => Array.isArray(player.tempname) && player.tempname.remove("sb_lvbu"), player);
				},
				mark: true,
				audio: ["sbwushuang2.mp3", "sbwushuang3.mp3"],
				intro: { content: "这熟悉的力量！！！" },
			},
		},
	},
	//谋夏侯渊
	sbshensu: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return ["phaseJudge|phaseDraw", "phaseDraw|phaseUse", "phaseUse|phaseDiscard"].some(item => {
				return item.split("|").every(i => !player.skipList.includes(i));
			});
		},
		async cost(event, trigger, player) {
			const list = ["phaseJudge|phaseDraw", "phaseDraw|phaseUse", "phaseUse|phaseDiscard"];
			const result = await player
				.chooseButton({
					createDialog: [
						get.prompt2(event.skill),
						[
							list.map(item => {
								return [
									item,
									`跳过${item
										.split("|")
										.map(i => get.translation(i))
										.join("和")}`,
								];
							}),
							"textbutton",
						],
					],
					selectButton: [1, 3],
				})
				.set("filterButton", button => {
					const player = get.player();
					return button.link.split("|").every(i => !player.skipList.includes(i));
				})
				.set("ai", button => {
					const player = get.player();
					const item = button.link;
					const skipList = item.split("|");
					const effectMap = new Map([
						["phaseJudge", -player.getVCards("j").reduce((sum, card) => sum + get.effect(player, { name: card.name }, player, player), 0)],
						["phaseDraw", -get.effect(player, { name: "wuzhong" }, player, player)],
						["phaseUse", -player.getCards("hs", card => player.hasValueTarget(card)).reduce((sum, card) => sum + player.getUseValue(card), 0)],
						["phaseDiscard", player.needsToDiscard()],
					]);
					const goon = skipList.includes("phaseUse");
					const vcard = get
						.inpileVCardList(info => info[2] === "sha")
						.filter(info => {
							const card = new lib.element.VCard({ name: "sha", nature: info[3], storage: { sbshensu: goon }, isCard: true });
							return player.hasValueTarget(card, false);
						});
					return (
						(() => {
							if (!vcard.length) {
								return 0;
							}
							return Math.max(
								...vcard.map(info => {
									const card = new lib.element.VCard({ name: "sha", nature: info[3], storage: { sbshensu: goon }, isCard: true });
									return player.getUseValue(card, false);
								})
							);
						})() + skipList.reduce((sum, name) => sum + effectMap.get(name), 0)
					);
				})
				.forResult();
			event.result = { bool: result?.bool, cost_data: list.filter(item => (result?.links ?? []).includes(item)) };
		},
		async content(event, trigger, player) {
			const cost_data = event.cost_data.map(item => item.split("|")).flat();
			const skipList = cost_data.toUniqued();
			for (const i of skipList) {
				player.skip(i);
			}
			game.log(player, "跳过了", `#y${get.translation(skipList)}`);
			let num = 0;
			let targets = [];
			while (num < event.cost_data.length) {
				num++;
				const goon = event.cost_data[num - 1].includes("phaseUse");
				const vcard = get
					.inpileVCardList(info => info[2] === "sha")
					.filter(info => {
						const card = new lib.element.VCard({
							name: "sha",
							nature: info[3],
							storage: { sbshensu: goon, sbshensu_targets: targets },
							isCard: true,
						});
						return player.hasUseTarget(card, false);
					});
				if (vcard.length > 0) {
					const [link] =
						vcard.length > 1
							? (
									await player
										.chooseButton({
											createDialog: ["神速：请选择你要视为使用的【杀】", `<div class="text center">无距离限制${goon ? "且不可被响应" : ""}</div>`, [vcard, "vcard"]],
											forced: true,
										})
										.set("ai", button => {
											const {
												player,
												infoMap: [goon, targets],
											} = get.event();
											const card = new lib.element.VCard({
												name: "sha",
												nature: button.link[3],
												storage: { sbshensu: goon, sbshensu_targets: targets },
												isCard: true,
											});
											return Math.max(...game.filterPlayer(target => player.canUse(card, target, false)).map(target => get.effect(target, card, player, player)));
										})
										.set("infoMap", [goon, targets])
										.forResult()
								).links
							: vcard;
					if (link) {
						const card = new lib.element.VCard({
							name: "sha",
							nature: link[3],
							storage: { sbshensu: goon, sbshensu_targets: targets },
							isCard: true,
						});
						const aims =
							(
								await player
									.chooseUseTarget({
										card,
										forced: true,
										addCount: false,
										nodistance: true,
									})
									.set("oncard", () => {
										const event = get.event();
										if (event.card.storage.sbshensu) {
											event.directHit.addArray(game.players);
											game.log(event.card, "不可被响应");
										}
									})
									.forResult()
							).targets ?? [];
						targets = aims || [];
						continue;
					}
				}
			}
			if (cost_data.length !== skipList.length) {
				await player.turnOver();
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(playe, tag, arg) {
				return arg?.card?.storage?.sbshensu;
			},
		},
		locked: false,
		mod: {
			playerEnabled(card, player, target) {
				const targets = card.storage?.sbshensu_targets;
				if (Array.isArray(targets) && targets.includes(target)) {
					return false;
				}
			},
		},
	},
	sbzhengzi: {
		audio: 2,
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			if (player.isHealthy()) {
				return false;
			}
			return player.getHistory("sourceDamage").reduce((sum, evt) => sum + evt.num, 0) >= player.getHp();
		},
		frequent: true,
		async content(event, trigger, player) {
			const recoverEvent = player.recover();
			const linkEvent = player.link(false);
			const turnOverEvent = player.turnOver(false);
			await recoverEvent;
			await linkEvent;
			await turnOverEvent;
		},
	},
	//谋郭淮
	sbjingce: {
		init(player) {
			player.storage.sbjingceCount = 0;
		},
		audio: 9,
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			return player.countExpansions("sbjingce_expansions");
		},
		locked: true,
		logAudio: index => (typeof index === "number" ? `sbjingce${index}.mp3` : 2),
		async cost(event, trigger, player) {
			const cards = player.getExpansions("sbjingce_expansions");
			const gainMap = new Map();
			let i = 0;
			while (true) {
				if (gainMap.size >= 3) {
					break;
				}
				const dialog = ["请选择一张牌预测（按取消重置预测）", [cards, "card"]];
				const next = player
					.chooseButton({
						createDialog: dialog,
						filterButton(button) {
							return !get.event().gainMap.has(button.link);
						},
					})
					.set("gainMap", gainMap);
				const { links, bool } = await next.forResult();
				if (bool) {
					const { control } = await player
						.chooseControl({ controls: ["被一名角色获得", "不被任何角色获得"] })
						.set("prompt", `预测${get.translation(links[0])}的去向`)
						.set("ai", () => {
							const { controls } = get.event();
							return controls.randomGet();
						})
						.forResult();
					i++;
					if (control === "被一名角色获得") {
						const {
							targets: [target],
						} = await player
							.chooseTarget({ prompt: `预测${get.translation(links[0])}被谁获得`, forced: true })
							.set("ai", target => {
								return Math.random();
							})
							.forResult();
						gainMap.set(links[0], [target, i]);
					} else {
						gainMap.set(links[0], ["none", i]);
					}
				} else {
					gainMap.clear();
				}
			}
			event.result = {
				bool: true,
				cost_data: gainMap,
			};
		},
		async content(event, trigger, player) {
			const { cost_data: gainMap } = event;
			player.storage[event.name] = gainMap;
			const cards = Array.from(gainMap.keys());
			const cardPile = ui.cardPile.childNodes;
			for (const [index, card] of cards.entries()) {
				const next = player.lose({ cards: [card], position: ui.cardPile });
				next.insert_index = () => {
					const { length } = cardPile;
					const num = Math.min(3 * (index + 1) - 1, length);
					return ui.cardPile.childNodes[num];
				};
				await next;
			}
		},
		group: ["sbjingce_expansions", "sbjingce_check"],
		subSkill: {
			expansions: {
				audio: ["sbjingce1.mp3", "sbjingce2.mp3"],
				trigger: { player: "phaseBegin" },
				mark: true,
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
				filter(event, player) {
					return !player.countExpansions("sbjingce_expansions");
				},
				forced: true,
				async content(event, trigger, player) {
					const { sbjingce: storage } = player.storage;
					if (storage) {
						delete player.storage.sbjingce;
						while (true) {
							if (storage.size === 0) {
								break;
							}
							const index = Array.from(storage.keys())[0];
							const arr = storage.get(index);
							if (arr[0] === "none") {
								player.storage.sbjingceCount++;
								player.logSkill("sbjingce", null, null, null, player.storage.sbjingceCount >= 6 ? [get.rand(7, 8)] : [get.rand(3, 4)]);
								await player.draw(arr[1]);
							}
							storage.delete(index);
						}
					}
					const cards = get.cards(3);
					const next = player.addToExpansion({ cards, source: player, animate: "draw" });
					next.gaintag.add("sbjingce_expansions");
					await next;
				},
			},
			check: {
				trigger: { global: ["equipAfter", "addJudgeAfter", "gainAfter", "addToExpansionAfter"] },
				forced: true,
				popup: false,
				filter(event, player) {
					const { sbjingce: storage } = player.storage;
					if (!storage) {
						return false;
					}
					const cards = [];
					cards.addArray(event.cards);
					for (const card of cards) {
						if (storage.has(card)) {
							return true;
						}
					}
				},
				async content(event, trigger, player) {
					const { sbjingce: storage } = player.storage;
					const cards = [];
					cards.addArray(trigger.cards);
					for (const card of cards) {
						if (storage.has(card)) {
							if (storage.get(card)[0] === trigger.player) {
								player.storage.sbjingceCount++;
								player.logSkill("sbjingce", null, null, null, player.storage.sbjingceCount >= 6 ? [get.rand(7, 8)] : [get.rand(3, 4)]);
								await player.draw(storage.get(card)[1]);
							} else {
								player.logSkill("sbjingce", null, null, null, player.storage.sbjingceCount >= 7 ? [9] : [get.rand(5, 6)]);
								player.storage.sbjingceCount = 0;
							}
							storage.delete(card);
						}
					}
				},
			},
		},
	},
	// 谋张辽
	sbtuxi: {
		audio: 2,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (player !== _status.currentPhase || event.getParent("sbtuxi").player === player) {
				return false;
			}
			return event.getg(player).length;
		},
		get usable() {
			return 2;
		},
		async cost(event, trigger, player) {
			const cards = trigger.getg(player).filter(i => get.owner(i) === player);
			event.result = await player
				.chooseCard({
					prompt: get.prompt(event.name.slice(0, -5)),
					prompt2: "将本次获得的任意张牌置于弃牌堆，然后获得至多等量名其他角色的各一张手牌",
					filterCard: card => get.event().cards.includes(card),
					selectCard: [1, cards.length],
					allowChooseAll: true,
				})
				.set("ai", card => {
					const player = get.player();
					const targets = game.filterPlayer(current => player !== current && current.countGainableCards(player, "h") && get.effect(current, { name: "shunshou_copy2" }, player, player) > 0);
					if (ui.selected.cards.length > targets.length) {
						return 0;
					}
					return 6.5 - get.value(card);
				})
				.set("cards", cards)
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event;
			const num = cards.length;
			await player.loseToDiscardpile({ cards });
			if (!game.hasPlayer(current => player !== current && current.countGainableCards(player, "h"))) {
				return;
			}
			const { bool, targets } = await player
				.chooseTarget({
					prompt: `获得至多${get.cnNumber(num)}名其他角色的各一张手牌`,
					filterTarget: (card, player, target) => player !== target && target.countGainableCards(player, "h"),
					selectTarget: [1, num],
					forced: true,
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "shunshou_copy2" }, player, player);
				})
				.forResult();
			if (bool) {
				await player.gainMultiple(targets.sortBySeat());
			}
		},
	},
	sbdengfeng: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => player !== current);
		},
		async cost(event, trigger, player) {
			const { bool, targets, links } = await player
				.chooseButtonTarget({
					createDialog: [
						`###${get.prompt(event.skill)}###选择一名其他角色并执行一项`,
						[
							[
								["equip", "令一名其他角色获得其装备区里的至多两张牌"],
								["sha", "获得牌堆里的一张【杀】"],
								["all", "背水！失去1点体力并执行所有选项"],
							],
							"textbutton",
						],
					],
					complexSelect: true,
					filterButton(button) {
						if (
							button.link === "equip" &&
							!game.hasPlayer(current => {
								return current !== get.player() && current.countCards("e");
							})
						) {
							return false;
						}
						return true;
					},
					filterTarget(card, player, target) {
						if (ui.selected.buttons[0]?.link === "equip") {
							return target.countCards("e") && target !== player;
						}
						return target !== player;
					},
					ai1(button) {
						const { player } = get.event();
						const bool1 = game.hasPlayer(current => {
							const es = current.getCards("e");
							const att = get.attitude(player, current);
							return (
								current !== player &&
								es.some(card => {
									if (att > 0) {
										return get.equipValue(card, current) <= 4;
									}
									return get.equipValue(card, current) > 7;
								})
							);
						});
						let num = 0;
						if (bool1 && ["all", "equip"].includes(button.link)) {
							num++;
						}
						const bool2 = !player.countCards("hs", { name: "sha" }) || player.hasSkill("sbtuxi");
						if (bool2 && ["all", "sha"].includes(button.link)) {
							num++;
						}
						if (player.getHp() <= 2 && get.effect(player, { name: "losehp" }, player, player) <= 0) {
							if (button.link === "all") {
								num = 0;
							}
						}
						return num;
					},
					ai2(target) {
						const player = get.player();
						const att = get.attitude(player, target);
						const es = target.getCards("e");
						if ((es.some(card => get.equipValue(card, target) <= 4) && att > 0) || (es.some(card => get.equipValue(card, target) > 7) && att < 0)) {
							return 10;
						}
						return 1;
					},
				})
				.forResult();
			event.result = {
				bool: bool,
				targets: targets,
				cost_data: links,
			};
		},
		async content(event, trigger, player) {
			const {
				cost_data: [control],
				targets: [target],
			} = event;
			if (["equip", "all"].includes(control) && target.countCards("e")) {
				const { cards } = await player.choosePlayerCard({ target, forced: true, position: "e", prompt: `选择${get.translation(target)}的至多两张装备牌令其获得之`, selectButton: [1, 2] }).forResult();
				if (cards?.length) {
					await target.gain({ cards, animate: "gain2" });
				}
			}
			if (["sha", "all"].includes(control)) {
				const card = get.cardPile2(card => card.name === "sha");
				if (card) {
					await player.gain({ cards: [card], animate: "gain2" });
				}
			}
			if (control === "all") {
				await player.loseHp();
			}
		},
	},
	// 谋郭嘉
	sbtiandu: {
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			content(storage) {
				return `出牌阶段开始时，${storage ? "你进行判定并获得判定牌，然后若判定结果与你本局游戏因〖天妒〗弃置的牌花色相同，你受到1点无来源伤害。" : "你可以弃置两张手牌，然后视为使用一张普通锦囊牌"}`;
			},
		},
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player, name) {
			const storage = player.storage.sbtiandu;
			if (storage) {
				return true;
			}
			return player.countCards("h", card => _status.connectMode || lib.filter.cardDiscardable(card, player)) > 1;
		},
		async cost(event, trigger, player) {
			const skillName = event.name.slice(0, -5);
			const storage = player.storage[skillName];
			if (storage) {
				event.result = {
					bool: true,
				};
			} else {
				event.result = await player
					.chooseToDiscard({ prompt: get.prompt(skillName), prompt2: "弃置两张手牌，然后视为使用一张普通锦囊牌", position: "h", selectCard: 2, chooseonly: true })
					.set("ai", card => {
						const player = get.player();
						const list = get.inpileVCardList(info => {
							if (info[0] !== "trick") {
								return false;
							}
							const cardx = { name: info[2], nature: info[3], isCard: true };
							return player.hasUseTarget(cardx) || (get.info(cardx).notarget && lib.filter.cardEnabled(cardx, player));
						});
						if (!list.length) {
							return 0;
						}
						if (player.getStorage("sbtiandu_record").includes(get.suit(card, player))) {
							return 1;
						}
						return 6 - get.value(card);
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const { name: skillName, cards } = event;
			player.changeZhuanhuanji(skillName);
			if (cards?.length) {
				await player.discard({ cards });
			}
			const storage = player.storage[skillName];
			const record = player.getStorage(`${skillName}_record`);
			if (storage) {
				const suits = cards.map(card => get.suit(card, player)).toUniqued();
				if (suits.some(suit => !record.includes(suit))) {
					player.addSkill(`${skillName}_record`);
					player.markAuto(
						`${skillName}_record`,
						suits.filter(suit => !record.includes(suit))
					);
					lib.skill[skillName].subSkill.record.init(player, `${skillName}_record`);
				}
				const list = get.inpileVCardList(info => {
					if (info[0] !== "trick") {
						return false;
					}
					const card = { name: info[2], nature: info[3], isCard: true };
					return player.hasUseTarget(card) || (get.info(card).notarget && lib.filter.cardEnabled(card, player));
				});
				if (!list.length) {
					return;
				}
				const { bool, links } = await player
					.chooseButton({ createDialog: ["天妒：视为使用其中一张锦囊牌", [list, "vcard"]] })
					.set("ai", button => {
						const player = get.player();
						const { link } = button;
						return player.getUseValue({ name: link[2], nature: link[3] });
					})
					.forResult();
				if (bool) {
					await player.chooseUseTarget({ card: { name: links[0][2], nature: links[0][3], isCard: true }, forced: true });
				}
			} else {
				const judgeEvent = player.judge({ judge: card => 1 });
				judgeEvent.judge2 = result => result.bool;
				judgeEvent.set("callback", async event => {
					if (get.position(event.card, true) === "o") {
						await player.gain({ cards: [event.card], animate: "gain2" });
					}
					if (record.includes(event.judgeResult.suit)) {
						await player.damage("nosource");
					}
				});
				await judgeEvent;
			}
		},
		getSuits(player) {
			const cards = player
				.getAllHistory("lose", evt => evt.getParent(2).name === "sbtiandu")
				.map(evt => evt.cards2)
				.flat();
			return cards.map(card => get.suit(card, player)).toUniqued();
		},
		init(player, skill) {
			const info = get.info(skill).getSuits(player);
			if (info.length) {
				player.addSkill(`${skill}_record`);
				player.markAuto(`${skill}_record`, info);
			}
		},
		onremove(player, skill) {
			player.removeSkill(`${skill}_record`);
		},
		subSkill: {
			record: {
				charlotte: true,
				init(player, skill) {
					const info = get.info("sbtiandu").getSuits(player);
					player.addTip(skill, get.translation(skill) + info.reduce((str, suit) => str + get.translation(suit), ""));
				},
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				intro: { content: "本局游戏已因【天妒】弃置过$花色" },
			},
		},
	},
	sbyiji: {
		audio: 2,
		trigger: { player: ["damageEnd", "dying"] },
		filter(event, player, name) {
			if (event.name === "damage") {
				return event.num > 0;
			}
			return game.getRoundHistory("everything", evt => evt.name === "dying" && evt.player === player).indexOf(event) === 0;
		},
		frequent: true,
		async content(event, trigger, player) {
			const mode = get.mode();
			const name = trigger.name;
			const yiji = mode === "identity" || (mode === "doudizhu" && name === "dying");
			let num = name === "damage" || !["identity", "doudizhu"].includes(mode) ? 2 : 1;
			const next = player.draw(num);
			if (yiji) {
				next.gaintag = ["sbyiji"];
			}
			await next;
			if (!game.hasPlayer(target => target !== player) || !player.hasCard(card => !yiji || card.hasGaintag("sbyiji"), "h")) {
				return;
			}
			if (_status.connectMode) {
				game.broadcastAll(() => (_status.noclearcountdown = true));
			}
			const given_map = [];
			while (
				num > 0 &&
				player.hasCard(card => {
					if (card.hasGaintag("olsujian_given")) {
						return false;
					}
					return !yiji || card.hasGaintag("sbyiji");
				}, "h") &&
				game.hasPlayer(target => target !== player)
			) {
				const result = await player
					.chooseCardTarget({
						filterCard(card, player) {
							if (card.hasGaintag("olsujian_given")) {
								return false;
							}
							return !get.event().yiji || card.hasGaintag("sbyiji");
						},
						selectCard: [1, num],
						filterTarget: lib.filter.notMe,
						prompt: "遗计：请选择要分配的卡牌和目标",
						prompt2: `（还可分配${num}张）`,
						ai1(card) {
							return !ui.selected.cards.length && card.name === "du" ? 1 : 0;
						},
						ai2(target) {
							const player = get.event().player;
							const card = ui.selected.cards[0];
							if (card) {
								return get.value(card, target) * get.attitude(player, target);
							}
							return 0;
						},
						yiji: yiji,
						position: "eh".slice(-1 + (!["identity", "doudizhu"].includes(mode) && name === "dying")), //三若为，怎么若都为构思
					})
					.forResult();
				if (result?.bool && result?.cards?.length && result?.targets?.length) {
					const { cards } = result;
					num -= cards.length;
					const target = result.targets[0];
					if (given_map.some(i => i[0] === target)) {
						given_map[given_map.indexOf(given_map.find(i => i[0] === target))][1].addArray(cards);
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
			if (yiji) {
				player.removeGaintag("sbyiji");
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
						if (target.hp >= 4) {
							return [1, 2];
						}
						if (target.hp === 3) {
							return [1, 1.5];
						}
						if (target.hp === 2) {
							return [1, 0.5];
						}
					}
				},
			},
		},
	},
	//诸葛瑾
	sbhuanshi: {
		audio: 2,
		trigger: { global: "judge" },
		check: () => true,
		async content(event, trigger, player) {
			let cardsx = get.cards(1, true).map(card => {
				const cardx = game.createFakeCards(card)[0];
				cardx.preCard = card;
				return cardx;
			});
			if (cardsx.length) {
				player.directgains(cardsx, null, "sbhuanshi_tag");
			}
			const result = await player
				.chooseCard({
					prompt: `缓释：${get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，是否打出牌堆顶的牌替代之或打出一张手牌替换之？`,
					position: "hs",
					filterCard: card => {
						const player = get.player();
						const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
						if (mod2 !== "unchanged") {
							return mod2;
						}
						const mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
						if (mod !== "unchanged") {
							return mod;
						}
						return true;
					},
				})
				.set("ai", card => {
					const trigger = _status.event.getTrigger();
					const player = _status.event.player;
					const judging = _status.event.judging;
					const result = trigger.judge(card) - trigger.judge(judging);
					const attitude = get.attitude(player, trigger.player);
					if (attitude === 0 || result === 0) {
						return 0;
					}
					if (get.event().pile.includes(card)) {
						return attitude > 0 ? result : -result;
					}
					if (attitude > 0) {
						return result - get.value(card) * 0.3;
					} else {
						return -result - get.value(card) * 0.3;
					}
				})
				.set("judging", trigger.player.judging[0])
				.set("pile", cardsx)
				.forResult();
			let cards = [];
			if (result?.cards?.length) {
				cards = result.cards;
				cardsx = player.getCards("s", card => card.hasGaintag("sbhuanshi_tag"));
				if (cardsx.length) {
					if (cards) {
						cards = cards.map(card => {
							if (cardsx.includes(card)) {
								return card.preCard;
							}
							return card;
						});
					}
				}
			} else {
				game.deleteFakeCards(cardsx);
				return;
			}
			game.deleteFakeCards(cardsx);
			const bool = result?.cards?.length && !result.cards[0].hasGaintag("sbhuanshi_tag");

			const next = player.respond({ cards, skill: event.name, highlight: true, noOrdering: true });
			await next;
			cards = next.cards;
			if (!cards?.length) {
				return;
			}
			if (trigger.player.judging[0].clone) {
				trigger.player.judging[0].clone.classList.remove("thrownhighlight");
				game.broadcast(card => {
					if (card.clone) {
						card.clone.classList.remove("thrownhighlight");
					}
				}, trigger.player.judging[0]);
				game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
			}
			if (bool) {
				await player.gain({ cards: trigger.player.judging, animate: "gain2" });
			} else {
				await game.cardsDiscard(trigger.player.judging);
			}
			trigger.player.judging[0] = cards[0];
			trigger.orderingCards.addArray(cards);
			game.log(trigger.player, "的判定牌改为", cards[0]);
			await game.delay(2);
		},
		locked: false,
		mod: {
			cardRespondable(card, player) {
				if (!card.preCard) {
					return;
				}
				return _status.event?.getParent()?.name === "sbhuanshi";
			},
		},
		ai: {
			rejudge: true,
			tag: { rejudge: 1 },
		},
	},
	sbhongyuan: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		chargeSkill: 3,
		init(player) {
			player.addCharge(1, false);
		},
		getIndex(event, player) {
			if (!player.countCharge()) {
				return [];
			}
			const list = [];
			if (event.getg && event.getg(player)?.length > 1) {
				list.push([player, "gain"]);
			}
			if (!event.getl) {
				return list;
			}
			for (const target of game.players) {
				const evt = event.getl(target);
				if (!evt || !evt.cards2 || !evt.cards2.length) {
					continue;
				}
			}
			return game
				.filterPlayer(current => {
					if (current === player) {
						return event.getg && event.getg(player)?.length > 1;
					}
					if (!event.getl) {
						return false;
					}
					const evt = event.getl(current);
					if (!evt || !evt.cards2) {
						return false;
					}
					return evt.cards2.length > 1;
				})
				.sortBySeat();
		},
		filter(event, player) {
			return player.countCharge();
		},
		async cost(event, trigger, player) {
			const target = event.indexedData;
			if (target === player) {
				event.result = await player
					.chooseTarget({ selectTarget: [1, 2], prompt: get.prompt(event.skill), prompt2: "令至多两名角色各摸一张牌" })
					.set("ai", target => {
						const player = get.player();
						return get.effect(target, { name: "draw" }, player, player);
					})
					.forResult();
				event.result.cost_data = "gain";
			} else {
				event.result = await player
					.chooseBool({ prompt: get.prompt(event.skill, target), prompt2: "令其摸两张牌" })
					.set("choice", get.effect(target, { name: "draw" }, player, player) > 0)
					.forResult();
				event.result.targets = [target];
				event.result.cost_data = "lose";
			}
		},
		async content(event, trigger, player) {
			player.removeCharge();
			if (event.cost_data === "gain") {
				const targets = event.targets;
				await game.asyncDraw(targets);
			} else {
				const target = event.targets[0];
				await target.draw(2);
			}
		},
		subSkill: {
			init: {
				audio: "sbhongyuan",
				trigger: {
					player: "enterGame",
					global: "phaseBefore",
				},
				filter(event, player) {
					if (!player.countCharge(true)) {
						return false;
					}
					return event.name !== "phase" || game.phaseNumber === 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.addCharge();
				},
			},
		},
		ai: {
			combo: "sbmingzhe",
		},
	},
	sbmingzhe: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		locked: true,
		filter(event, player) {
			if (player === _status.currentPhase) {
				return false;
			}
			if (player.countMark("sbmingzhe_used") >= 2) {
				return false;
			}
			const evt = event.getl(player);
			return evt.cards2?.length;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({ prompt: get.prompt2(event.skill), forced: true })
				.set("ai", target => {
					const player = get.player();
					let eff = get.effect(target, { name: "draw" }, player, player);
					if (target.countCharge(true) > 0) {
						eff *= 2.1;
					}
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.addTempSkill("sbmingzhe_used", "roundStart");
			player.addMark("sbmingzhe_used", 1, false);
			const target = event.targets[0];
			const cards = trigger.getl(player).cards2;
			if (target.countCharge(true)) {
				target.addCharge();
			}
			if (cards.some(card => get.type(card) !== "basic")) {
				await target.draw(2);
			}
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (player === _status.currentPhase || player.countMark("sbmingzhe_used") >= 2) {
						return;
					}
					if (typeof card === "object" && get.position(card) === "h") {
						return [1, 1];
					}
				},
				target(card, player, target) {
					if (target === _status.currentPhase || target.countMark("sbmingzhe_used") >= 2) {
						return;
					}
					if (get.tag(card, "lose") || get.tag(card, "discard")) {
						return [1, 1];
					}
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//贾诩
	sbwansha: {
		audio: 2,
		trigger: { global: "dying" },
		filter(event, player) {
			const position = player.storage.sbwansha ? "hej" : "h";
			return event.player.countCards(position) && player.countMark("sbwansha_used") < 2;
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		logTarget: "player",
		//round: 1,
		async content(event, trigger, player) {
			player.addTempSkill(`${event.name}_used`, "roundStart");
			player.addMark(`${event.name}_used`, 1, false);
			const target = trigger.player;
			const position = player.storage.sbwansha ? "hej" : "h";
			const num = 3;
			const prompt = `选择其中〇至${get.cnNumber(num)}张牌`;
			let result;
			result = await player.choosePlayerCard({ target, position, selectButton: [0, num], forced: true, prompt, visible: true }).forResult();
			//if (!result?.cards?.length) {
				//return;
			//}
			const { cards } = result;
			if (game.hasPlayer(current => current !== target)) {
				result = await target
					.chooseControl()
					.set("choiceList", [`令${get.translation(player)}将${player === target ? get.translation(cards) : "其选择的牌"}分配给其他角色`, `弃置所有未被${get.translation(player)}选择的牌`])
					.set("ai", () => {
						return get.event().goon ? 0 : 1;
					})
					.set(
						"goon",
						(() => {
							const att = get.sgnAttitude(target, player);
							const hs = target.countCards(position);
							if (att > 0 || hs > 5) {
								return true;
							}
							if (hs < 2) {
								return false;
							}
							let num;
							if (att === 0) {
								num = Math.min(hs, 2);
								return hs > 2 * num;
							}
							num = Math.min(hs, 0.5 + 1.2 * Math.random());
							return hs > 3 * num;
						})()
					)
					.forResult();
			} else {
				result = { index: 1 };
			}
			if (result?.index === 0 && cards.length) {
				if (_status.connectMode) {
					game.broadcastAll(() => (_status.noclearcountdown = true));
				}
				const given_map = {};
				while (cards.length && game.hasPlayer(current => current !== target)) {
					let result;
					if (cards.length === 1) {
						result = { bool: true, links: cards.slice() };
					} else {
						result = await player
							.chooseCardButton("完杀：请选择要分配的牌", cards, [1, cards.length], true)
							.set("ai", button => {
								if (!ui.selected.buttons.length) {
									return get.buttonValue(button);
								}
								return 0;
							})
							.forResult();
					}
					if (result?.links?.length) {
						const gives = result.links;
						result = await player
							.chooseTarget({
								prompt: `选择获得${get.translation(gives)}的角色`,
								forced: true,
								filterTarget: (card, player, target) => target !== get.event().getTrigger().player,
							})
							.set("ai", target => {
								return get.attitude(get.event().player, target) * get.sgn(get.sgn(get.event().goon) + 0.5);
							})
							.set(
								"goon",
								gives.reduce((sum, card) => sum + get.value(card), 0)
							)
							.forResult();
						if (result?.bool && result?.targets?.length) {
							cards.removeArray(gives);
							const id = result.targets[0].playerid;
							if (!given_map[id]) {
								given_map[id] = [];
							}
							given_map[id].addArray(gives);
						} else {
							break;
						}
					} else {
						break;
					}
				}
				if (_status.connectMode) {
					game.broadcastAll(() => delete _status.noclearcountdown);
				}
				const list = [];
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
						animate: "draw",
					})
					.setContent("gaincardMultiple");
			} else if (result?.index === 1) {
				const discard = target.getCards(position).removeArray(cards);
				if (discard.length) {
					await target.discard({ cards: discard });
				}
			}
		},
		global: "sbwansha_global",
		subSkill: {
			used: {
				onremove: true,
				charlotte: true,
				intro: {
					content: "本轮已发动#次",
				},
			},
			global: {
				mod: {
					cardEnabled(card, player) {
						const source = _status.currentPhase;
						if (card.name === "tao" && source?.isIn() && source !== player && source.hasSkill("sbwansha") && !player.isDying()) {
							return false;
						}
					},
					cardSavable(card, player) {
						const source = _status.currentPhase;
						if (card.name === "tao" && source?.isIn() && source !== player && source.hasSkill("sbwansha") && !player.isDying()) {
							return false;
						}
					},
				},
			},
		},
	},
	sbluanwu: {
		audio: 4,
		logAudio: () => 2,
		inherit: "luanwu",
		async contentBefore(event, trigger, player) {
			player.addTempSkill(`${event.skill}_add`);
			player.awakenSkill(event.skill);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await target
				.chooseToUse({
					prompt: "乱武：使用一张【杀】或失去1点体力",
					filterCard: (card, player, event) => {
						if (get.name(card) !== "sha") {
							return false;
						}
						return lib.filter.filterCard(card, player, event);
					},
					filterTarget: (card, player, target) => {
						if (player === target || target === get.event().targetx) {
							return false;
						}
						const dist = get.distance(player, target);
						if (dist > 1) {
							if (game.hasPlayer(current => current !== player && get.distance(player, current) < dist)) {
								return false;
							}
						}
						return lib.filter.filterTarget(card, player, target);
					},
				})
				.set("ai2", (...args) => get.effect_use(...args) - get.event().effect)
				.set("effect", get.effect(target, { name: "losehp" }, target, target))
				.set("addCount", false)
				.set("targetx", player)
				.forResult();
			if (!result?.bool) {
				await target.loseHp();
			}
		},
		subSkill: {
			add: {
				audio: ["sbluanwu3.mp3", "sbluanwu4.mp3"],
				trigger: { global: "loseHpEnd" },
				filter(event, player) {
					if (event.getParent().name !== "sbluanwu") {
						return false;
					}
					return ["sbwansha", "sbweimu"].some(skill => player.hasSkill(skill, null, null, false) && !player.storage[skill]);
				},
				async cost(event, trigger, player) {
					const choices = [];
					const list = ["sbwansha", "sbweimu"];
					const choiceList = ["修改【完杀】", "修改【帷幕】"];
					for (let i = 0; i < 2; i++) {
						if (!player.hasSkill(list[i], null, null, false) || player.storage[list[i]]) {
							choiceList[i] = `<span style="opacity:0.5;">${choiceList[i]}</span>`;
						} else {
							choices.push(`选项${get.cnNumber(i + 1, true)}`);
						}
					}
					const { control } = await player
						.chooseControl({ controls: [...choices, "cancel2"] })
						.set("choiceList", choiceList)
						.set("prompt", get.prompt(event.name.slice(0, -5)))
						.set("ai", () => {
							const choices = get.event().controls.slice().remove("cancel2");
							return choices.randomGet();
						})
						.forResult();
					event.result = {
						bool: control !== "cancel2",
						cost_data: control,
					};
				},
				async content(event, trigger, player) {
					const list = ["sbwansha", "sbweimu"];
					const index = ["选项一", "选项二"].indexOf(event.cost_data);
					player.storage[list[index]] = true;
				},
			},
		},
		derivation: ["sbwansha_rewrite", "sbweimu_rewrite"],
	},
	sbwansha_rewrite: { nopop: true },
	sbweimu_rewrite: {
		locked: true,
		nopop: true,
	},
	sbweimu: {
		audio: 4,
		trigger: {
			player: "addJudgeBefore",
			target: "useCardToTarget",
			global: "roundStart",
		},
		logAudio: index => (typeof index === "number" ? `sbweimu${index}.mp3` : 4),
		filter(event, player) {
			if (event.name === "useCardToTarget") {
				return get.type(event.card, null, false) === "trick" && get.color(event.card) === "black";
			}
			if (event.name === "addJudge") {
				return get.color(event.card) === "black";
			}
			if (!player.storage.sbweimu) {
				// || game.roundNumber < 2
				return false;
			}
			/*let num = 0;
			game.countPlayer2(current => {
				if (player === current) {
					return false;
				}
				num += current.getRoundHistory("useCard", evt => evt.targets?.includes(player), 1).length;
			});*/
			return Array.from(ui.discardPile.childNodes).some(card => get.info("sbweimu").filterCardx(card)); //num <= 1 &&
		},
		filterCardx(card) {
			return get.subtype(card) === "equip2" || (get.type(card) === "trick" && get.color(card) === "black");
		},
		forced: true,
		popup: false,
		async content(event, trigger, player) {
			if (trigger.name === "useCardToTarget" || trigger.name === "addJudge") {
				player.logSkill("sbweimu", null, null, null, [get.rand(1, 2)]);
			} else {
				player.logSkill("sbweimu", null, null, null, [get.rand(3, 4)]);
			}
			if (trigger.name === "useCardToTarget") {
				trigger.targets.remove(player);
				trigger.getParent().triggeredTargets2.remove(player);
				trigger.untrigger();
			} else if (trigger.name === "addJudge") {
				trigger.cancel();
				const owner = get.owner(trigger.card);
				if (owner?.getCards("hej").includes(trigger.card)) {
					await owner.lose({ cards: [trigger.card], position: ui.discardPile });
				} else {
					await game.cardsDiscard(trigger.card);
				}
				game.log(trigger.card, "进入了弃牌堆");
			} else {
				const cards = Array.from(ui.discardPile.childNodes).filter(card => get.info("sbweimu").filterCardx(card));
				await player.gain({ cards: [cards.randomGet()], animate: "gain2" });
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.type(card, "trick") === "trick" && get.color(card) === "black") {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	//韩当
	sbgongqi: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard({
					prompt: get.prompt(event.skill),
					prompt2: "你可以弃置一张牌，令你本阶段使用牌时，其他角色只能使用或打出与你弃置的牌颜色相同的手牌进行响应。",
					position: "he",
					chooseonly: true,
				})
				.set("ai", card => {
					const ind = get.event().colors.indexOf(get.color(card)) + 1;
					if (ind <= 0) {
						return 0;
					}
					return 1.5 + 2 * ind - get.value(card);
				})
				.set(
					"colors",
					(() => {
						if (!player.countCards("hs", card => player.hasValueTarget(card))) {
							return [];
						}
						const colors = Object.keys(lib.color);
						const infos = colors.map(color => {
							return [
								color,
								game.filterPlayer().map(current => {
									const att = get.attitude(player, current);
									return current
										.getCards("hes", card => {
											if (get.color(card) !== color) {
												return false;
											}
											if (current.hasUseTarget(card, false, false)) {
												return false;
											}
											if (!lib.filter.cardEnabled(card, current, "forceEnable")) {
												return false;
											}
											return true;
										})
										.map(card => {
											return get.value(card) * (att > 0 ? -0.2 : 1);
										})
										.reduce((p, c) => p + c, 0);
								}),
							];
						});
						infos.sort((a, b) => {
							return a[1] - b[1];
						});
						return infos.map(info => info[0]);
					})()
				)
				.forResult();
		},
		locked: false,
		async content(event, trigger, player) {
			const { cards } = event;
			await player.discard({ cards });
			await game.delayx();
			player.addTempSkill("sbgongqi_effect", "phaseChange");
			player.markAuto("sbgongqi_effect", [get.color(cards[0], player)]);
			player.line(game.filterPlayer());
			await game.delayx();
		},
		updateBlocker(player) {
			const list = [];
			const storage = player.storage.sbgongqi_block;
			if (storage?.length) {
				list.addArray(...storage.map(i => i[1]));
			}
			player.storage.sbgongqi_blocker = list;
		},
		mod: {
			attackRange(player, num) {
				return num + 4;
			},
		},
		subSkill: {
			effect: {
				audio: "sbgongqi",
				trigger: {
					player: "useCard",
				},
				onremove: true,
				charlotte: true,
				forced: true,
				async content(event, trigger, player) {
					game.countPlayer(current => {
						if (current === player) {
							return;
						}
						current.addTempSkill("sbgongqi_block", "phaseChange");
						if (!current.storage.sbgongqi_block) {
							current.storage.sbgongqi_block = [];
						}
						current.storage.sbgongqi_block.push([trigger.card, player.getStorage("sbgongqi_effect")]);
						lib.skill.sbgongqi.updateBlocker(current);
					});
				},
				intro: {
					content: "所有其他角色只能使用或打出$的手牌响应你使用的牌",
				},
			},
			block: {
				trigger: {
					player: ["damageBefore", "damageCancelled", "damageZero"],
					target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
					global: ["useCardEnd"],
				},
				forced: true,
				firstDo: true,
				popup: false,
				charlotte: true,
				onremove: ["sbgongqi_block", "sbgongqi_blocker"],
				filter(event, player) {
					const evt = event.getParent("useCard", true, true);
					if (evt && evt.effectedCount < evt.effectCount) {
						return false;
					}
					if (!event.card || !player.storage.sbgongqi_block) {
						return false;
					}
					return player.getStorage("sbgongqi_block").some(info => {
						return info[0] === event.card;
					});
				},
				async content(event, trigger, player) {
					const storage = player.storage.sbgongqi_block;
					for (const item of storage.slice()) {
						if (item[0] === trigger.card) {
							storage.remove(item);
						}
					}
					if (!storage.length) {
						player.removeSkill("sbgongqi_block");
					} else {
						lib.skill.sbgongqi.updateBlocker(player);
					}
				},
				mod: {
					cardEnabled(card, player) {
						if (!player.storage.sbgongqi_blocker) {
							return;
						}
						const color = get.color(card);
						if (color === "none") {
							return;
						}
						const hs = player.getCards("h");
						const cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						if (cards.containsSome(...hs) && !player.storage.sbgongqi_blocker.includes(color)) {
							return false;
						}
					},
					cardRespondable(card, player) {
						if (!player.storage.sbgongqi_blocker) {
							return;
						}
						const color = get.color(card);
						if (color === "none") {
							return;
						}
						const hs = player.getCards("h");
						const cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						const evt = _status.event;
						if (evt.name === "chooseToRespond" && cards.containsSome(...hs) && !player.storage.sbgongqi_blocker.includes(color)) {
							return false;
						}
					},
				},
			},
		},
	},
	sbjiefan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		async content(event, trigger, player) {
			const { target } = event;
			const targets = game.filterPlayer(current => {
				return current.inRange(target);
			});
			const count = targets.length;
			if (!count) {
				target.chat("没人打得到我喔！");
				return;
			}
			const controls = ["选项一", "选项二", "背水！"];
			const { control } = await target
				.chooseControl({ controls })
				.set("choiceList", [`令所有攻击范围内含有你的角色依次弃置一张牌（${get.translation(targets)}）`, `你摸等同于攻击范围内含有你的角色数的牌（${get.cnNumber(count)}张牌）`, `背水！令${get.translation(player)}的〖解烦〗失效直到其杀死一名角色，然后你依次执行上述所有选项`])
				.set("ai", () => {
					return get.event().choice;
				})
				.set(
					"choice",
					(() => {
						const eff1 = targets
							.map(current => {
								let position = "h";
								if (!current.countCards("h")) {
									position += "e";
								}
								return get.effect(current, { name: "guohe_copy", position }, target, target);
							})
							.reduce((p, c) => p + c, 0);
						const eff2 = (get.effect(target, { name: "wuzhong" }, target) * count) / 2;
						if (
							game.hasPlayer(current => {
								const att1 = get.attitude(player, current);
								const att2 = get.attitude(target, current);
								if (att1 < 0 && att2 < 0) {
									return current.getHp() <= 1;
								}
								return false;
							}) &&
							eff1 > 15 &&
							eff2 > 0
						) {
							return "背水！";
						}
						if (eff1 > 3 * eff2) {
							return "选项一";
						}
						return "选项二";
					})()
				)
				.forResult();
			game.log(target, "选择了", `#g${control}`);
			if (control !== "选项二") {
				for (const current of targets) {
					target.line(current, "thunder");
					await current.chooseToDiscard({ prompt: "解烦：请弃置一张牌", position: "he", forced: true });
				}
			}
			if (control !== "选项一") {
				await target.draw(count);
			}
			if (control === "背水！") {
				player.tempBanSkill("sbjiefan", { source: "die" });
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					const targets = game.filterPlayer(current => {
						return current.inRange(target);
					});
					return Math.min(2, targets.length) / 2;
				},
			},
		},
	},
	//公孙瓒
	sbyicong: {
		audio: 2,
		trigger: {
			global: "roundStart",
		},
		filter(event, player) {
			return player.countCharge();
		},
		chargeSkill: 4,
		init(player) {
			player.addCharge(2, false);
		},
		async cost(event, trigger, player) {
			const len = player.countCharge();
			const numbers = Array.from({ length: len }, (_, i) => get.cnNumber(i + 1, true));
			if (_status.connectMode) {
				game.broadcastAll(() => {
					_status.noclearcountdown = true;
				});
			}
			let result;
			let result2;
			while (true) {
				result = await player
					.chooseControl({ controls: [...numbers, "cancel2"] })
					.set("prompt", get.prompt(event.skill))
					.set("prompt2", "你可以消耗任意点蓄力值并选择一项：⒈你于本轮内至其他角色的距离-1，令系统选择牌堆中的X张【杀】；⒉其他角色于本轮内至你的距离+1，令系统选择牌堆中的X张【闪】（X为你消耗的蓄力值）。然后若你的“扈”数小于4，你将系统选择的牌置于武将牌上，称为“扈”。")
					.set("ai", () => {
						return get.event().choice;
					})
					.set(
						"choice",
						(() => {
							if (
								!game.hasPlayer(current => {
									return (
										get.distance(player, current) >= 2 &&
										player.countCards("hs", card => {
											const list = ["shunshou", "bingliang", "zhujinqiyuan"];
											if (!player.inRange(current)) {
												list.add("sha");
											}
											return list.includes(get.name(card)) && get.effect(current, card, player, player) > 0;
										}) > 0
									);
								})
							) {
								return 0;
							}
							return Math.ceil(len / 2) - 1;
						})()
					)
					.forResult();
				if (result.control === "cancel2") {
					return;
				}
				const num = result.index + 1;
				result2 = await player
					.chooseControl({ controls: ["选项一", "选项二", "返回"] })
					.set("prompt", "义从：请选择一项")
					.set("choiceList", [
						`你于本轮内至其他角色的距离-1${
							player.countCards("s", card => {
								return card.hasGaintag("sbyicong");
							}) >= 4
								? ""
								: `，将牌堆中的${get.cnNumber(
										Math.min(
											num,
											4 -
												player.countCards("s", card => {
													return card.hasGaintag("sbyicong");
												})
										)
									)}张【杀】置于你的武将牌上，称为“扈”`
						}`,
						`其他角色于本轮内至你的距离+1${
							player.countCards("s", card => {
								return card.hasGaintag("sbyicong");
							}) >= 4
								? ""
								: `，将牌堆中的${get.cnNumber(
										Math.min(
											num,
											4 -
												player.countCards("s", card => {
													return card.hasGaintag("sbyicong");
												})
										)
									)}张【闪】置于你的武将牌上，称为“扈”`
						}`,
					])
					.set("ai", () => {
						const player = get.player();
						if (player.getHp() > 2 || player.countCards("hsx", ["shan", "caochuan"]) >= 3) {
							return 0;
						}
						return 1;
					})
					.forResult();
				if (result2.control !== "返回") {
					break;
				}
			}
			if (_status.connectMode) {
				game.broadcastAll(() => {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			event.result = {
				bool: true,
				cost_data: {
					num: result.index + 1,
					choice: result2.index,
				},
			};
		},
		async content(event, trigger, player) {
			const { num, choice } = event.cost_data;
			const skill = choice === 0 ? "sbyicong_to" : "sbyicong_from";
			player.removeCharge(num);
			player.addTempSkill(skill, "roundStart");
			player.addMark(skill, 1, false);
			const cards = [];
			while (cards.length < num && cards.length + player.countCards("s", card => card.hasGaintag("sbyicong")) < 4) {
				const name = choice === 0 ? "sha" : "shan";
				const card = get.cardPile2(card => card.name === name && !cards.includes(card));
				if (card) {
					cards.push(card);
				} else {
					break;
				}
			}
			if (cards.length) {
				player.$gain2(cards, false);
				game.log(player, "将", cards, "置于了武将牌上");
				await player.loseToSpecial(cards, "sbyicong");
				player.markSkill("sbyicong");
			}
		},
		marktext: "扈",
		intro: {
			name: "扈(义从)",
			mark(dialog, storage, player) {
				const cards = player.getCards("s", card => {
					return card.hasGaintag("sbyicong");
				});
				if (cards.length) {
					dialog.addAuto(cards);
				} else {
					dialog.addText("暂无卡牌");
				}
			},
			markcount(storage, player) {
				return player.countCards("s", card => {
					return card.hasGaintag("sbyicong");
				});
			},
			onunmark(storage, player) {
				const cards = player.getCards("s", card => {
					return card.hasGaintag("sbyicong");
				});
				if (cards.length) {
					player.loseToDiscardpile({ cards });
				}
			},
		},
		subSkill: {
			init: {
				audio: "sbyicong",
				trigger: {
					player: "enterGame",
					global: "phaseBefore",
				},
				filter(event, player) {
					return event.name !== "phase" || game.phaseNumber === 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.addCharge(2);
				},
			},
			to: {
				charlotte: true,
				mod: {
					globalFrom(from, to, distance) {
						return distance - from.countMark("sbyicong_to");
					},
				},
				onremove: true,
				marktext: "从",
				intro: {
					content: "本轮你至其他角色的距离-#",
				},
			},
			from: {
				charlotte: true,
				mod: {
					globalTo(from, to, distance) {
						return distance + to.countMark("sbyicong_from");
					},
				},
				onremove: true,
				marktext: "从",
				intro: {
					content: "本轮其他角色至你的距离+#",
				},
			},
		},
		ai: {
			notemp: true,
		},
	},
	sbqiaomeng: {
		audio: 2,
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			if (!event.card || event.card.name !== "sha") {
				return false;
			}
			if (!player.hasSkill("sbyicong", null, false, false)) {
				return false;
			}
			if (player.countCharge(true)) {
				return true;
			}
			if (event.player.isIn() && event.player.countDiscardableCards(player, "hej")) {
				return true;
			}
			return false;
		},
		async cost(event, trigger, player) {
			const list = ["cancel2"];
			const choiceList = [`弃置${get.translation(trigger.player)}区域里的一张牌，你摸一张牌`, `获得3点蓄力值`];
			if (player.countCharge(true)) {
				list.unshift("蓄力");
			} else {
				choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
			}
			if (trigger.player.isIn() && trigger.player.countDiscardableCards(player, "hej")) {
				list.unshift("弃牌");
			} else {
				choiceList[0] = `<span style="opacity:0.5">${choiceList[0]}</span>`;
			}
			const result = await player
				.chooseControl({ controls: list })
				.set("prompt", get.prompt(event.skill))
				.set("choiceList", choiceList)
				.set("ai", () => {
					return get.event().choice;
				})
				.set(
					"choice",
					(() => {
						const eff = get.effect(trigger.player, { name: "guohe" }, player, player);
						if (list.length === 2) {
							if (!list.includes("弃牌")) {
								return "蓄力";
							}
							if (eff >= 0) {
								return "弃牌";
							}
							return "cancel2";
						}
						if (player.countCharge() >= 2 && eff >= 0) {
							return "弃牌";
						}
						return "蓄力";
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
		async content(event, trigger, player) {
			const { control } = event.cost_data;
			if (control === "弃牌") {
				player.line(trigger.player);
				await player.discardPlayerCard({ target: trigger.player, position: "hej", forced: true });
				await player.draw();
			} else {
				player.addCharge(3);
			}
		},
		ai: {
			combo: "sbyicong",
		},
	},
	//高顺
	sbxianzhen: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			if (get.mode() === "identity" && target.getHp() >= player.getHp()) {
				return false;
			}
			return target !== player;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.addTempSkill("sbxianzhen_attack", "phaseUseAfter");
			player.markAuto("sbxianzhen_attack", target);
		},
		ai: {
			expose: 0.2,
			order(item, player) {
				return get.order({ name: "sha" }) + 1;
			},
			result: {
				target(player, target) {
					if (
						!player.countCards("hs", card => {
							return get.name(card) === "sha" && player.canUse(card, target, false);
						})
					) {
						return -0.1;
					}
					if (target.countCards("h") === 1 && player.canCompare(target)) {
						return -2;
					}
					return -1.5;
				},
			},
		},
		subSkill: {
			attack: {
				audio: "sbxianzhen",
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					if (event.card.name !== "sha") {
						return false;
					}
					return player.getStorage("sbxianzhen_attack").includes(event.target) && event.target.isIn() && player.canCompare(event.target);
				},
				charlotte: true,
				onremove: true,
				logTarget: "target",
				check(event, player) {
					return get.attitude(player, event.target) < 0;
				},
				prompt(event, player) {
					return `陷阵：是否与${get.translation(event.target)}拼点？`;
				},
				prompt2(event, player) {
					const target = event.target;
					const card = event.card;
					return `若你赢，${get.translation(card)}无视防具且不计入次数，且若你本回合以此法对其造成的伤害小于2，你对其造成1点伤害；<br>若其拼点牌为【杀】，则你获得之；<br>若其拼点牌为其最后的手牌，则${get.translation(card)}对其造成伤害时，此伤害+1。`;
				},
				//group: "sbxianzhen_record",
				async content(event, trigger, player) {
					const target = trigger.target;
					const card = trigger.card;
					const next = player.chooseToCompare(target);
					const result = await next.forResult();
					if (result.bool) {
						target.addTempSkill("qinggang2");
						target.storage.qinggang2.add(card);
						if (trigger.addCount !== false) {
							trigger.addCount = false;
							const stat = player.getStat("card");
							if (stat[card.name] && stat[card.name] > 0) {
								stat[card.name]--;
							}
						}
						game.log(card, "无视防具且不计入次数限制");
						if (!player.storage.sbxianzhen_damaged) {
							player.storage.sbxianzhen_damaged = (player.storage.sbxianzhen_damaged || 0) + 1;
							player.when("phaseAfter").step(async () => {
								delete player.storage.sbxianzhen_damaged;
							});
						} else {
							player.storage.sbxianzhen_damaged++;
						}
						if (player.storage.sbxianzhen_damaged <= 1) {
							await target.damage();
							await game.delayx();
						}
					}
					const toGain = [];
					for (const lose_list of next.lose_list) {
						const comparer = lose_list[0];
						let cards = lose_list[1];
						if (!Array.isArray(cards)) {
							cards = [cards];
						}
						if (comparer === player) {
							continue;
						}
						for (const card of cards) {
							if (get.name(card, comparer) === "sha" && get.position(card, true) === "d") {
								toGain.push(card);
							}
						}
					}
					if (toGain.length) {
						await player.gain({ cards: toGain, animate: "gain2" });
					}
					if (player.getStorage("sbxianzhen_recorded").includes(target)) {
						const id = target.playerid;
						const map = trigger.getParent().customArgs;
						if (!map[id]) {
							map[id] = {};
						}
						if (typeof map[id].extraDamage !== "number") {
							map[id].extraDamage = 0;
						}
						map[id].extraDamage++;
						game.log(card, "对", target, "造成的伤害+1");
					}
				},
				intro: {
					content: "本阶段对$使用牌无距离限制，且使用杀指定其为目标后可以与其拼点",
				},
				mod: {
					targetInRange(card, player, target) {
						if (player.getStorage("sbxianzhen_attack").includes(target)) {
							return true;
						}
					},
				},
			},
			record: {
				trigger: {
					global: "loseAsyncEnd",
				},
				charlotte: true,
				silent: true,
				filter(event, player) {
					if (event.getParent(2).name !== "sbxianzhen_attack") {
						return false;
					}
					return game.hasPlayer(current => {
						if (current.countCards("h")) {
							return false;
						}
						const evt = event.getl(current);
						return evt && evt.hs && evt.hs.length;
					});
				},
				async content(event, trigger, player) {
					const targets = [];
					game.countPlayer(current => {
						if (current.countCards("h")) {
							return false;
						}
						const evt = trigger.getl(current);
						if (evt && evt.hs && evt.hs.length) {
							targets.add(current);
						}
					});
					if (!player.storage.sbxianzhen_recorded) {
						player.when("sbxianzhen_attackAfter").step(async () => {
							delete player.storage.sbxianzhen_recorded;
						});
					}
					player.markAuto("sbxianzhen_recorded", targets);
				},
			},
		},
	},
	sbjinjiu: {
		audio: 2,
		inherit: "rejinjiu",
		group: ["sbjinjiu_decrease", "sbjinjiu_compare"],
		global: "sbjinjiu_global",
		subSkill: {
			decrease: {
				audio: "sbjinjiu",
				forced: true,
				trigger: { player: "damageBegin3" },
				filter(event, player) {
					return event.getParent(evt => evt.name === "useCard" && evt.card === event.card).jiu;
				},
				async content(event, trigger) {
					trigger.num = 1;
				},
				ai: {
					filterDamage: true,
					skillTagFilter(player, tag, arg) {
						return arg && arg.jiu;
					},
				},
			},
			global: {
				mod: {
					cardEnabled(card, player) {
						if (card.name === "jiu" && _status.currentPhase && _status.currentPhase !== player && _status.currentPhase.hasSkill("sbjinjiu")) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (card.name === "jiu" && _status.currentPhase && _status.currentPhase !== player && _status.currentPhase.hasSkill("sbjinjiu")) {
							return false;
						}
					},
				},
			},
			compare: {
				trigger: {
					global: "compare",
				},
				filter(event, player) {
					const participant = [event.player];
					if (event.targets) {
						participant.addArray(event.targets);
					} else {
						participant.add(event.target);
					}
					if (!participant.includes(player)) {
						return false;
					}
					if (event.player !== player && event.card1 && event.card1.name === "jiu") {
						return true;
					}
					if (event.target !== player && event.card2 && event.card2.name === "jiu") {
						return true;
					}
					return false;
				},
				forced: true,
				direct: true,
				async content(event, trigger, player) {
					for (const [role, ind] of [
						["player", 1],
						["target", 2],
					]) {
						const current = trigger[role];
						const card = trigger[`card${ind}`];
						if (current !== player && card && card.name === "jiu") {
							await player.logSkill("sbjinjiu_compare", current);
							game.log(current, "拼点牌点数视为", "#yA");
							trigger[`num${ind}`] = 1;
						}
					}
				},
			},
		},
	},
	//夏侯惇
	sbganglie: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source?.isIn();
		},
		async cost(event, trigger, player) {
			const target = trigger.source;
			const list = [];
			const choiceList = [`弃置你或${get.translation(target)}的一张牌`, `对${get.translation(target)}造成1点伤害`];
			if (player.countDiscardableCards(player, "he") + target.countDiscardableCards(player, "he")) {
				list.push("选项一");
			} else {
				choiceList[0] = `<span style="opacity:0.5">${choiceList[0]}</span>`;
			}
			list.push("选项二");
			list.push("cancel2");
			const result = await player
				.chooseControl({
					controls: list,
					prompt: get.prompt(event.skill, target),
					choiceList: choiceList,
					ai() {
						const { player, source, controls } = get.event();
						if (get.attitude(player, source) > 0) {
							return "cancel2";
						}
						if (player.countCards("h") === source.countCards("h")) {
							return "选项二";
						}
						return controls.slice(0).remove("cancel2").randomGet();
					},
				})
				.set("source", target)
				.forResult();
			if (typeof result?.control === "string") {
				event.result = {
					bool: true,
					cost_data: result.control,
				};
			}
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const {
				cost_data: link,
				targets: [target],
			} = event;
			const fun1 = async target => {
				let prompt = "刚烈：弃置";
				let bool;
				if (player.countDiscardableCards(player, "he")) {
					bool = true;
					prompt += "你";
				}
				if (target.countDiscardableCards(player, "he")) {
					if (bool) {
						prompt += "或";
					}
					prompt += get.translation(target);
				}
				prompt += "的一张牌，若此牌为黑色，执行另一项";
				const dialog = [`刚烈：${prompt}`];
				if (player.countDiscardableCards(player, "h")) {
					dialog.push(`<div class="text center">你的手牌</div>`);
					dialog.push(player.getDiscardableCards(player, "h"));
				}
				if (player.countDiscardableCards(player, "e")) {
					dialog.push(`<div class="text center">你的装备牌</div>`);
					dialog.push(player.getDiscardableCards(player, "e"));
				}
				if (target.countDiscardableCards(player, "h")) {
					const cards = target.getDiscardableCards(player, "h");
					dialog.push(`<div class="text center">${get.translation(target)}的手牌</div>`);
					if (player.hasSkillTag("viewHandcard", null, target, true)) {
						dialog.push(cards);
					} else {
						dialog.push([cards.slice(0).randomSort(), "blank"]);
					}
				}
				if (target.countDiscardableCards(player, "e")) {
					dialog.push(`<div class="text center">${get.translation(target)}的装备牌</div>`);
					dialog.push(target.getDiscardableCards(player, "e"));
				}
				const result = await player
					.chooseButton({ createDialog: dialog })
					.set("ai", button => {
						const card = button.link;
						const { player, source } = get.event();
						const owner = get.owner(button.link);
						if (get.attitude(player, source) > 0) {
							return -get.value(card);
						}
						return get.value(button.link, get.owner(source)) * Math.sign(-get.attitude(player, source));
					})
					.set("source", target)
					.forResult();
				if (result?.bool && result.links?.length) {
					const cards = result.links;
					player.line(target);
					const owners = cards.map(i => get.owner(i)).unique();
					await owners[0].discard({
						cards: cards,
						discarder: player,
					});
					if (get.color(cards[0]) === "black") {
						await game.doAsyncInOrder(event.targets, fun2);
					}
				}
			};
			const fun2 = async target => {
				await target.damage();
				if (player.countCards("h") === target.countCards("h") && player.countDiscardableCards(player, "he") + target.countDiscardableCards(player, "h")) {
					await game.doAsyncInOrder(event.targets, fun1);
				}
			};
			await game.doAsyncInOrder(event.targets, link === "选项一" ? fun1 : fun2);
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1];
					}
					return 0.8;
				},
			},
		},
	},
	sbqingjian: {
		audio: 2,
		trigger: {
			global: ["loseAsyncAfter", "loseAfter"],
		},
		getIndex(event, player) {
			return game
				.filterPlayer(current => {
					if (player.getStorage("sbqingjian_round").includes(current)) {
						return false;
					}
					return event.type === "discard" && event.getl?.(current)?.cards2?.length === 1;
				})
				.sortBySeat();
		},
		logTarget(event, player, name, target) {
			return target;
		},
		check(event, player, name, target) {
			return get.attitude(player, target) > 0;
		},
		async content(event, trigger, player) {
			const target = event.indexedData;
			player.addTempSkill(`${event.name}_round`, "roundStart");
			player.markAuto(`${event.name}_round`, [target]);
			const cards = trigger.getl(target).cards2;
			if (cards?.length) {
				await target.gain({
					cards: cards,
					animate: "gain2",
				});
				await player.draw({ num: 1 });
			}
		},
		subSkill: {
			round: { charlotte: true, onremove: true },
		},
	},
	//荀彧
	sbquhu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.countPlayer(current => lib.skill.sbquhu.filterTarget(null, player, current)) > 1;
		},
		filterTarget(card, player, target) {
			return player !== target && target.countCards("he") > 0;
		},
		selectTarget: 2,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const targets = [player].addArray(event.targets);
			targets.sortBySeat();
			const result = await player
				.chooseCardOL({
					list: targets,
					position: "he",
					selectCard: [1, Infinity],
					forced: true,
					prompt: "驱虎：请将任意张牌扣置于武将牌上",
					allowChooseAll: true,
				})
				.set("ai", card => {
					const player = get.event().getParent(2).player;
					let value = 5;
					if (get.player() === player) {
						value -= 0.5;
					}
					return value - get.useful(card);
				})
				.forResult();
			const lose_list = [];
			const map = new Map();
			let myCards;
			let minLength = Infinity;
			for (const [i, item] of result.entries()) {
				const current = targets[i];
				const cards = item.cards;
				if (current === player) {
					myCards = cards;
				} else if (cards.length < minLength) {
					minLength = cards.length;
				}
				lose_list.push([current, cards]);
				map.set(current.playerid, cards);
			}
			await game
				.loseAsync({
					lose_list,
					log: true,
					animate: "giveAuto",
					gaintag: ["sbquhu"],
				})
				.setContent("addToExpansionMultiple");
			await game.delay(1.5);
			const isMin = minLength > myCards.length;
			const sortedList = lose_list
				.filter(list => list[0] !== player)
				.sort((a, b) => {
					return 1000 * (b[1].length - a[1].length) + (get.distance(player, a[0], "absolute") - get.distance(player, b[0], "absolute"));
				});
			const mostPlayer = sortedList[0][0];
			const secondPlayer = sortedList[1][0];
			await new Promise(resolve => {
				game.broadcastAll(lose_list => {
					lose_list.forEach(list => list[0].prompt(`${get.cnNumber(list[1].length)}张`, "wood"));
				}, lose_list);
				setTimeout(
					() => {
						game.broadcastAll(lose_list => {
							lose_list.forEach(list => list[0].unprompt());
						}, lose_list);
						resolve();
					},
					2000 / (lib.config.game_speed === "vvfast" ? 3 : 1)
				);
			});
			if (isMin) {
				await mostPlayer.gain({ cards: myCards, source: player, animate: "give" });
				await game.delay();
				const gain_list = lose_list.filter(list => list[0] !== player);
				game.loseAsync({
					gain_list,
					animate: "draw",
				}).setContent("gaincardMultiple");
			} else {
				mostPlayer.line(secondPlayer, "thunder");
				await secondPlayer.damage(mostPlayer);
				await game.delay();
				await mostPlayer.gain({ cards: myCards, source: player, animate: "give" });
				await game.delay();
				await game
					.loseAsync({
						lose_list: sortedList,
					})
					.setContent(() => {
						for (const [current, cards] of event.lose_list) {
							const next = current.lose({ cards, position: ui.discardPile });
							current.$throw(cards);
							game.log(current, "将", cards, "置入了弃牌堆");
							next.set("relatedEvent", event.getParent());
							next.set("getlx", false);
						}
					});
				await game.delayx();
			}
		},
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				const cards = player.getExpansions("sbquhu");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return `共有${get.cnNumber(cards.length)}张牌`;
				}
			},
		},
		ai: {
			order: 3.5,
			result: {
				target(player, target) {
					let sgn = 1;
					let preAtt = 0;
					if (ui.selected.targets.length) {
						const selected = ui.selected.targets[0];
						preAtt = get.attitude(player, selected);
						if (preAtt > 0) {
							sgn = -1;
						}
					}
					let eff =
						0.4 *
							target.countCards("h", card => {
								return 5 - get.useful(card);
							}) -
						1;
					if ((get.attitude(player, target) > 0 && sgn < 0) || (get.attitude(player, target) < 0 && preAtt < 0)) {
						eff = -Math.abs(eff);
					}
					return eff;
				},
			},
		},
	},
	sbjieming: {
		audio: 2,
		trigger: { player: "damageEnd" },
		async cost(event, trigger, player) {
			const num = Math.max(1, player.getDamagedHp());
			event.result = await player
				.chooseTarget({ prompt: get.prompt(event.skill), prompt2: `令一名角色摸四张牌，然后其可以弃置任意张牌。若其弃置的牌数小于${get.cnNumber(num)}张，你失去1点体力。` })
				.set("ai", target => {
					if (get.event().nope) {
						return 0;
					}
					const player = get.player();
					const att = get.attitude(player, target);
					if (att > 2) {
						const num = Math.sqrt(
							Math.min(
								5,
								Math.max(
									1,
									target.countCards("he", card => get.value(card) < 5.5)
								)
							)
						);
						return num * att;
					}
					return att / 3;
				})
				.set("nope", player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1 && num > 2)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw(4);
			const num = Math.max(1, player.getDamagedHp());
			const { bool, cards } = await target
				.chooseToDiscard({
					prompt: "节命：是否弃置任意张牌？",
					prompt2: `若你本次弃置的牌数小于${get.cnNumber(num)}张，${get.translation(player)}失去1点体力。`,
					selectCard: [1, Infinity],
					position: "he",
					allowChooseAll: true,
				})
				.set("ai", card => {
					if (get.event().nope) {
						return 0;
					}
					if (ui.selected.cards.length >= get.event().num) {
						return 0;
					}
					return 9 - get.value(card);
				})
				.set("nope", get.effect(player, { name: "losehp" }, player, target) >= 0)
				.set("num", num)
				.forResult();
			if (!bool || cards.length < num) {
				player.loseHp();
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
						if (!target.hasFriend()) {
							return;
						}
						return [1, 0.6 * (4 - 0.9 * Math.max(1, player.getDamagedHp()))];
					}
				},
			},
		},
	},
	//曹丕
	sbxingshang: {
		getLimit: 9,
		getList: [
			{
				cost: 2,
				prompt: () => "令一名角色复原武将牌",
				filter: () => game.hasPlayer(target => target.isLinked() || target.isTurnedOver()),
				filterTarget: {
					filterTarget: (card, player, target) => target.isLinked() || target.isTurnedOver(),
				},
				async content(player, target) {
					if (target.isLinked()) {
						await target.link(false);
					}
					if (target.isTurnedOver()) {
						await target.turnOver(false);
					}
				},
				ai: {
					result: {
						target(player, target) {
							let res = 0;
							if (target.isLinked()) {
								res = 0.3;
							}
							if (target.isTurnedOver()) {
								res += 3.5 * get.threaten(target, player);
							}
							return res;
						},
					},
				},
			},
			{
				cost: 2,
				prompt: () => "令一名角色摸三张牌",
				filter: () => true,
				filterTarget: {
					filterTarget: true,
				},
				async content(player, target) {
					await target.draw(3);
				},
				ai: {
					result: {
						player(player, target) {
							return get.effect(target, { name: "draw" }, player, player) * 3;
						},
					},
				},
			},
			{
				cost: 3,
				prompt: () => "令一名体力上限小于10的角色回复1点体力，增加1点体力上限，随机恢复一个废除的装备栏",
				filter: () => game.hasPlayer(target => target.maxHp < 10),
				filterTarget: {
					filterTarget: (card, player, target) => target.maxHp < 10,
				},
				async content(player, target) {
					await target.recover();
					await target.gainMaxHp();
					let list = Array.from({ length: 13 }).map((_, i) => `equip${parseFloat(i + 1)}`);
					list = list.filter(i => target.hasDisabledSlot(i));
					if (list.length) {
						await target.enableEquip(list.randomGet());
					}
				},
				ai: {
					result: {
						target(player, target) {
							let res = 0.2;
							if (target.isHealthy()) {
								res += 0.4;
							}
							if (
								Array.from({ length: 5 })
									.map((_, i) => `equip${parseFloat(i + 1)}`)
									.some(i => target.hasDisabledSlot(i))
							) {
								res += 0.3;
							}
							return res + get.recoverEffect(target, target, target) / 16;
						},
					},
				},
			},
			{
				cost: 4,
				prompt: () => "获得一名已阵亡角色的武将牌上除主公技外的所有技能，然后失去〖行殇〗〖放逐〗〖颂威〗",
				filter: () => game.dead.some(target => target.getStockSkills(true, true).some(i => get.info(i) && !get.info(i).charlotte && !get.info(i).zhuSkill)),
				filterTarget: {
					filterTarget(card, player, target) {
						if (!target.isDead()) {
							return false;
						}
						return target.getStockSkills(true, true).some(i => get.info(i) && !get.info(i).charlotte && !get.info(i).zhuSkill);
					},
					deadTarget: true,
				},
				async content(player, target) {
					await player.changeSkills(
						target.getStockSkills(true, true).filter(i => get.info(i) && !get.info(i).charlotte && !get.info(i).zhuSkill),
						["sbxingshang", "sbfangzhu", "sbsongwei"]
					);
				},
				ai: {
					result: {
						player(player, target) {
							return ["name", "name1", "name2"].reduce((sum, name) => {
								if (!target[name] || !lib.character[target[name]] || (name === "name1" && target.name1 === target.name)) {
									return sum;
								}
								return sum + get.rank(target[name], true);
							}, 0);
						},
					},
				},
			},
		],
		marktext: "颂",
		intro: {
			name: "颂",
			content: "mark",
		},
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return get.info("sbxingshang").getList.some(effect => {
				return player.countMark("sbxingshang") >= effect.cost && effect.filter(player);
			});
		},
		usable: 2,
		chooseButton: {
			dialog() {
				const dialog = ui.create.dialog("行殇：请选择一项", "hidden");
				const list = get.info("sbxingshang").getList.slice();
				dialog.add([
					list.map(effect => {
						return [effect, `移去${effect.cost}个“颂”标记，${effect.prompt()}`];
					}),
					"textbutton",
				]);
				return dialog;
			},
			filter(button, player) {
				const effect = button.link;
				return player.countMark("sbxingshang") >= effect.cost && effect.filter(player);
			},
			check(button) {
				const player = get.event().player;
				const effect = button.link;
				return Math.max(
					...game
						.filterPlayer(target => {
							const filterTarget = effect.filterTarget.filterTarget;
							if (!filterTarget) {
								return target === player;
							}
							if (typeof filterTarget === "function") {
								return filterTarget(null, player, target);
							}
							return true;
						})
						.map(target => {
							game.broadcastAll(effect => (lib.skill["sbxingshang_aiSkill"].ai = effect.ai), effect);
							return get.effect(target, "sbxingshang_aiSkill", player, player);
						})
				);
			},
			backup(links, player) {
				const effect = links[0];
				return {
					effect: effect,
					audio: "sbxingshang",
					filterCard: () => false,
					selectCard: -1,
					...effect.filterTarget,
					async content(event, trigger, player) {
						const effect = lib.skill.sbxingshang_backup.effect;
						player.removeMark("sbxingshang", effect.cost);
						await effect.content(player, ...event.targets);
					},
					ai: effect.ai,
				};
			},
			prompt(links, player) {
				const effect = links[0];
				const str = "###行殇###";
				return `${str}<div class="text center">` + `移去${effect.cost}个“颂”标记，${effect.prompt()}</div>`;
			},
		},
		ai: {
			order: 6.5,
			result: {
				player(player) {
					const list = get.info("sbxingshang").getList.filter(effect => {
						return player.countMark("sbxingshang") >= effect.cost && effect.filter(player);
					});
					return Math.max(
						...list.map(effect => {
							return Math.max(
								...game
									.filterPlayer(target => {
										const filterTarget = effect.filterTarget.filterTarget;
										if (!filterTarget) {
											return target === player;
										}
										if (typeof filterTarget === "function") {
											return filterTarget(null, player, target);
										}
										return true;
									})
									.map(target => {
										game.broadcastAll(effect => (lib.skill["sbxingshang_aiSkill"].ai = effect.ai || {}), effect);
										return get.effect(target, "sbxingshang_aiSkill", player, player);
									})
							);
						})
					);
				},
			},
		},
		group: "sbxingshang_gain",
		subSkill: {
			aiSkill: {},
			backup: {},
			gain: {
				audio: "sbxingshang",
				trigger: { global: ["die", "damageEnd"] },
				filter(event, player) {
					if (player.countMark("sbxingshang") >= get.info("sbxingshang").getLimit) {
						return false;
					}
					return event.name === "die" || !player.getHistory("custom", evt => evt.sbxingshang).length;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.addMark("sbxingshang", Math.min(2, get.info("sbxingshang").getLimit - player.countMark("sbxingshang")));
					if (trigger.name === "damage") {
						player.getHistory("custom").push({ sbxingshang: true });
					}
				},
			},
		},
	},
	sbfangzhu: {
		getList: [
			{
				cost: 2,
				prompt: () => "令一名其他角色于手牌中只能使用基本牌直到其回合结束",
				filter: player => game.hasPlayer(target => target !== player && !target.getStorage("sbfangzhu_ban").includes("basic")),
				filterTarget: {
					filterTarget: (card, player, target) => target !== player && !target.getStorage("sbfangzhu_ban").includes("basic"),
				},
				async content(player, target) {
					target.addTempSkill("sbfangzhu_ban", { player: "phaseEnd" });
					target.markAuto("sbfangzhu_ban", ["basic"]);
					lib.skill.sbfangzhu_ban.init(target, "sbfangzhu_ban");
				},
				ai: {
					result: {
						target(player, target) {
							return -(target.countCards("hs") + 2) / 3;
						},
					},
				},
			},
			{
				cost: 6,
				prompt: () => "令一名其他角色于手牌中只能使用锦囊牌直到其回合结束",
				filter: player => game.hasPlayer(target => target !== player && !target.getStorage("sbfangzhu_ban").includes("trick")),
				filterTarget: {
					filterTarget: (card, player, target) => target !== player && !target.getStorage("sbfangzhu_ban").includes("trick"),
				},
				async content(player, target) {
					target.addTempSkill("sbfangzhu_ban", { player: "phaseEnd" });
					target.markAuto("sbfangzhu_ban", ["trick"]);
					lib.skill.sbfangzhu_ban.init(target, "sbfangzhu_ban");
				},
				ai: {
					result: {
						target(player, target) {
							return -(target.countCards("hs") + 2) / 2;
						},
					},
				},
			},
			{
				cost: 8,
				prompt: () => "令一名其他角色于手牌中只能使用装备牌直到其回合结束",
				filter: player => get.mode() !== "doudizhu" && game.hasPlayer(target => target !== player && !target.getStorage("sbfangzhu_ban").includes("equip")),
				filterTarget: {
					filterTarget: (card, player, target) => target !== player && !target.getStorage("sbfangzhu_ban").includes("equip"),
				},
				async content(player, target) {
					target.addTempSkill("sbfangzhu_ban", { player: "phaseEnd" });
					target.markAuto("sbfangzhu_ban", ["equip"]);
					lib.skill.sbfangzhu_ban.init(target, "sbfangzhu_ban");
				},
				ai: {
					result: {
						target(player, target) {
							return -target.countCards("hs") - 2;
						},
					},
				},
			},
			{
				cost: 6,
				prompt: () => "令一名其他角色的非Charlotte技能失效直到其回合结束",
				filter: player => get.mode() !== "doudizhu" && game.hasPlayer(target => target !== player),
				filterTarget: {
					filterTarget: lib.filter.notMe,
				},
				async content(player, target) {
					target.addTempSkill("sbfangzhu_baiban", { player: "phaseEnd" });
				},
				ai: {
					result: {
						target(player, target) {
							return -target.getSkills(null, false).filter(i => get.info(i) && !get.info(i).charlotte).length * get.threaten(target, player);
						},
					},
				},
			},
			{
				cost: 4,
				prompt: () => "令一名其他角色不能响应另一名角色使用的牌直到其回合结束",
				filter(player) {
					return game.hasPlayer(target => {
						if (target !== player) {
							return game.hasPlayer(current => {
								if (current !== target) {
									return !current.getStorage("sbfangzhu_kill").includes(target);
								}
								return false;
							});
						}
						return false;
					});
				},
				filterTarget: {
					filterTarget(card, player, target) {
						return ui.selected.targets.length > 0 || target !== player;
					},
					selectTarget: 2,
					targetprompt: ["被响应", "响应源"],
					multitarget: true,
				},
				async content(player, target, source) {
					source.addTempSkill("sbfangzhu_kill", { player: "phaseEnd" });
					source.markAuto("sbfangzhu_kill", [target]);
				},
			},
			{
				cost: 8,
				prompt: () => "令一名其他角色将武将牌翻面",
				filter: player => get.mode() !== "doudizhu" && game.hasPlayer(target => target !== player),
				filterTarget: {
					filterTarget: lib.filter.notMe,
				},
				async content(player, target) {
					await target.turnOver();
				},
				ai: {
					result: {
						target(player, target) {
							return target.isTurnedOver() ? 3.5 : -3.5;
						},
					},
				},
			},
		],
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return get.info("sbfangzhu").getList.some(effect => {
				return player.countMark("sbxingshang") >= effect.cost && effect.filter(player);
			});
		},
		usable: 1,
		chooseButton: {
			dialog() {
				const dialog = ui.create.dialog("放逐：请选择一项", "hidden");
				const list = get.info("sbfangzhu").getList.slice();
				dialog.add([
					list.map(effect => {
						return [effect, `移去${effect.cost}个“颂”标记，${effect.prompt()}`];
					}),
					"textbutton",
				]);
				return dialog;
			},
			filter(button, player) {
				const effect = button.link;
				return player.countMark("sbxingshang") >= effect.cost && effect.filter(player);
			},
			check(button) {
				const player = get.event().player;
				const effect = button.link;
				return Math.max(
					...game
						.filterPlayer(target => {
							const filterTarget = effect.filterTarget.filterTarget;
							if (!filterTarget) {
								return target === player;
							}
							if (typeof filterTarget === "function") {
								return filterTarget(null, player, target);
							}
							return true;
						})
						.map(target => {
							game.broadcastAll(effect => (lib.skill["sbxingshang_aiSkill"].ai = effect.ai || {}), effect);
							return get.effect(target, "sbxingshang_aiSkill", player, player);
						})
				);
			},
			backup(links, player) {
				const effect = links[0];
				return {
					effect: effect,
					audio: "sbfangzhu",
					audioname: ["mb_caomao"],
					filterCard: () => false,
					selectCard: -1,
					...effect.filterTarget,
					async content(event, trigger, player) {
						const effect = lib.skill.sbfangzhu_backup.effect;
						player.removeMark("sbxingshang", effect.cost);
						await effect.content(player, ...event.targets);
					},
					ai: effect.ai,
				};
			},
			prompt(links, player) {
				const effect = links[0];
				const str = "###放逐###";
				return `${str}<div class="text center">` + `移去${effect.cost}个“颂”标记，${effect.prompt()}</div>`;
			},
		},
		ai: {
			combo: "sbxingshang",
			order: 7,
			result: {
				player(player) {
					const list = get.info("sbfangzhu").getList.filter(effect => {
						return player.countMark("sbxingshang") >= effect.cost && effect.filter(player);
					});
					return Math.max(
						...list.map(effect => {
							return Math.max(
								...game
									.filterPlayer(target => {
										const filterTarget = effect.filterTarget.filterTarget;
										if (!filterTarget) {
											return target === player;
										}
										if (typeof filterTarget === "function") {
											return filterTarget(null, player, target);
										}
										return true;
									})
									.map(target => {
										game.broadcastAll(effect => (lib.skill["sbxingshang_aiSkill"].ai = effect.ai), effect);
										return get.effect(target, "sbxingshang_aiSkill", player, player);
									})
							);
						})
					);
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
			kill: {
				charlotte: true,
				onremove: true,
				marktext: "放",
				intro: { content: "$不能响应你使用的牌" },
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.directHit.addArray(player.getStorage(event.name));
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return player.getStorage("sbfangzhu_kill").includes(arg?.target);
					},
				},
			},
			ban: {
				charlotte: true,
				mark: true,
				marktext: "禁",
				intro: {
					markcount: () => 0,
					content(storage) {
						if (storage.length > 1) {
							return "不能使用手牌";
						}
						return `于手牌中只能使用${get.translation(storage[0])}牌`;
					},
				},
				init(player, skill) {
					const storage = player.getStorage(skill);
					if (storage.length) {
						player.addTip(skill, `放逐 限${storage.length === 1 ? get.translation(storage[0])[0] : "手牌"}`);
					}
				},
				onremove(player, skill) {
					player.removeTip(skill);
					delete player.storage[skill];
				},
				mod: {
					cardEnabled(card, player) {
						const storage = player.getStorage("sbfangzhu_ban");
						const hs = player.getCards("h");
						const cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						if (cards.containsSome(...hs) && (storage.length > 1 || !storage.includes(get.type2(card)))) {
							return false;
						}
					},
					cardSavable(card, player) {
						const storage = player.getStorage("sbfangzhu_ban");
						const hs = player.getCards("h");
						const cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						if (cards.containsSome(...hs) && (storage.length > 1 || !storage.includes(get.type2(card)))) {
							return false;
						}
					},
				},
			},
		},
	},
	sbsongwei: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			if (player.countMark("sbxingshang") >= get.info("sbxingshang").getLimit) {
				return false;
			}
			return game.hasPlayer(target => target.group === "wei" && target !== player);
		},
		zhuSkill: true,
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			player.addMark("sbxingshang", Math.min(get.info("sbxingshang").getLimit - player.countMark("sbxingshang"), 2 * game.countPlayer(target => target.group === "wei" && target !== player)));
		},
		//group: "sbsongwei_delete",
		subSkill: {
			delete: {
				audio: "sbsongwei",
				enable: "phaseUse",
				filter(event, player) {
					if (player.storage.sbsongwei_delete) {
						return false;
					}
					return game.hasPlayer(target => lib.skill.sbsongwei.subSkill.delete.filterTarget(null, player, target));
				},
				filterTarget(card, player, target) {
					return target !== player && target.group === "wei" && target.getStockSkills(false, true).length;
				},
				skillAnimation: true,
				animationColor: "thunder",
				async content(event, trigger, player) {
					player.storage.sbsongwei_delete = true;
					player.awakenSkill(event.name);
					event.target.removeSkills(event.target.getStockSkills(false, true));
				},
				ai: {
					order: 13,
					result: {
						target(player, target) {
							return -target.getStockSkills(false, true).length;
						},
					},
				},
			},
		},
	},
	//关羽
	//矢
	sbwusheng: {
		audio: 3,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(target => target !== player && !target.isZhu2());
		},
		direct: true,
		async content(event, trigger, player) {
			const result = await player
				.chooseTarget({
					prompt: get.prompt("sbwusheng"),
					prompt2: `选择一名非主公的其他角色，本阶段对其使用【杀】无距离和次数限制，使用【杀】指定其为目标后摸${get.mode() === "identity" ? "两" : "一"}张牌，对其使用三张【杀】后不能对其使用【杀】`,
					filterTarget: (card, player, target) => target !== player && !target.isZhu2(),
				})
				.set("ai", target => {
					const player = _status.event.player;
					return get.effect(target, { name: "sha" }, player, player);
				})
				.forResult();
			if (result.bool) {
				const target = result.targets[0];
				player.logSkill("sbwusheng", target);
				if (get.mode() !== "identity" || player.identity !== "nei") {
					player.addExpose(0.25);
				}
				player.addTempSkill("sbwusheng_effect", { player: "phaseUseAfter" });
				player.storage.sbwusheng_effect[target.playerid] = 0;
			}
		},
		group: "sbwusheng_wusheng",
		subSkill: {
			wusheng: {
				audio: "sbwusheng",
				enable: ["chooseToUse", "chooseToRespond"],
				hiddenCard(player, name) {
					return name === "sha" && player.countCards("hs");
				},
				filter(event, player) {
					return event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event) || lib.inpile_nature.some(nature => event.filterCard(get.autoViewAs({ name: "sha", nature }, "unsure"), player, event));
				},
				chooseButton: {
					dialog(event, player) {
						const list = [];
						if (event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event)) {
							list.push(["基本", "", "sha"]);
						}
						for (const j of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name: "sha", nature: j }, "unsure"), player, event)) {
								list.push(["基本", "", "sha", j]);
							}
						}
						const dialog = ui.create.dialog("武圣", [list, "vcard"], "hidden");
						dialog.direct = true;
						return dialog;
					},
					check(button) {
						const player = _status.event.player;
						const card = { name: button.link[2], nature: button.link[3] };
						if (
							_status.event.getParent().type === "phase" &&
							game.hasPlayer(current => {
								return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
							})
						) {
							switch (button.link[2]) {
								case "sha":
									if (button.link[3] === "fire") {
										return 2.95;
									} else if (button.link[3] === "thunder" || button.link[3] === "ice") {
										return 2.92;
									} else {
										return 2.9;
									}
							}
						}
						return 1 + Math.random();
					},
					backup(links, player) {
						return {
							audio: "sbwusheng",
							filterCard: true,
							check(card) {
								return 6 - get.value(card);
							},
							viewAs: { name: links[0][2], nature: links[0][3] },
							position: "hs",
							popname: true,
						};
					},
					prompt(links, player) {
						return `将一张手牌当作${get.translation(links[0][3] || "")}【${get.translation(links[0][2])}】${_status.event.name === "chooseToUse" ? "使用" : "打出"}`;
					},
				},
				ai: {
					respondSha: true,
					fireAttack: true,
					skillTagFilter(player, tag) {
						if (!player.countCards("hs")) {
							return false;
						}
					},
					order(item, player) {
						if (player && _status.event.type === "phase") {
							let max = 0;
							if (lib.inpile_nature.some(i => player.getUseValue({ name: "sha", nature: i }) > 0)) {
								const temp = get.order({ name: "sha" });
								if (temp > max) {
									max = temp;
								}
							}
							if (max > 0) {
								max += 0.3;
							}
							return max;
						}
						return 4;
					},
					result: { player: 1 },
				},
			},
			effect: {
				charlotte: true,
				onremove: true,
				init(player) {
					if (!player.storage.sbwusheng_effect) {
						player.storage.sbwusheng_effect = {};
					}
				},
				mod: {
					targetInRange(card, player, target) {
						if (card.name === "sha" && typeof player.storage.sbwusheng_effect[target.playerid] === "number") {
							return true;
						}
					},
					cardUsableTarget(card, player, target) {
						if (card.name !== "sha" || typeof player.storage.sbwusheng_effect[target.playerid] !== "number") {
							return;
						}
						return player.storage.sbwusheng_effect[target.playerid] < 3;
					},
					playerEnabled(card, player, target) {
						if (card.name !== "sha" || typeof player.storage.sbwusheng_effect[target.playerid] !== "number") {
							return;
						}
						if (player.storage.sbwusheng_effect[target.playerid] >= 3) {
							return false;
						}
					},
				},
				audio: "sbwusheng",
				trigger: { player: ["useCardToPlayered", "useCardAfter"] },
				filter(event, player) {
					if (event.card.name !== "sha") {
						return false;
					}
					if (event.name === "useCard") {
						return event.targets.some(target => typeof player.storage.sbwusheng_effect[target.playerid] === "number");
					}
					return typeof player.storage.sbwusheng_effect[event.target.playerid] === "number";
				},
				direct: true,
				async content(event, trigger, player) {
					if (trigger.name === "useCard") {
						const targets = trigger.targets.filter(target => typeof player.storage.sbwusheng_effect[target.playerid] === "number");
						targets.forEach(target => player.storage.sbwusheng_effect[target.playerid]++);
					} else {
						player.logSkill("sbwusheng_effect", trigger.target);
						await player.draw(get.mode() === "identity" ? 2 : 1);
					}
				},
			},
		},
		ai: { threaten: 114514 },
	},
	sbyijue: {
		audio: 2,
		trigger: { global: "damageBegin4" },
		filter(event, player) {
			if (!event.source || event.source !== player || event.player === player) {
				return false;
			}
			return event.num >= event.player.hp && !player.getStorage("sbyijue").includes(event.player);
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.cancel();
			player.addTempSkill("sbyijue_effect");
			player.markAuto("sbyijue", [trigger.player]);
			player.markAuto("sbyijue_effect", [trigger.player]);
		},
		ai: {
			neg: true,
		},
		marktext: "绝",
		intro: { content: "已放$一马" },
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				audio: "sbyijue",
				trigger: { player: "useCardToPlayer" },
				filter(event, player) {
					return player.getStorage("sbyijue_effect").includes(event.target);
				},
				forced: true,
				logTarget: "target",
				async content(event, trigger, player) {
					trigger.getParent().excluded.add(trigger.target);
				},
				ai: {
					effect: {
						player(card, player, target) {
							if (player.getStorage("sbyijue_effect").includes(target)) {
								return "zeroplayertarget";
							}
						},
					},
				},
				marktext: "义",
				intro: { content: "本回合放$一马" },
			},
		},
	},
	//黄月英
	sbqicai: {
		mod: {
			targetInRange(card, player, target) {
				if (get.type2(card) === "trick") {
					return true;
				}
			},
		},
		locked: false,
		getLimit: 3,
		audio: 2,
		enable: "phaseUse",
		onChooseToUse(event) {
			if (!event.sbqicai && !game.online) {
				const player = get.player();
				const cards = Array.from(ui.discardPile.childNodes).filter(card => lib.skill.sbqicai.filterCardx(card, player));
				event.set("sbqicai", cards);
			}
		},
		filter(event, player) {
			return player.hasCards("h", card => lib.skill.sbqicai.filterCardx(card, player)) || (event.sbqicai && event.sbqicai.length);
		},
		filterCardx(card, player) {
			if (player.getStorage("sbqicai").includes(card.name)) {
				return false;
			}
			return get.type(card) === "equip" && game.hasPlayer(target => target !== player && target.hasEmptySlot(get.subtype(card)));
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const list1 = player.getCards("h", card => lib.skill.sbqicai.filterCardx(card, player));
				const list2 = event.sbqicai;
				const dialog = ui.create.dialog('###奇才###<div class="text center">请选择一张装备牌置入一名其他角色的装备区</div>');
				if (list1.length) {
					dialog.add('<div class="text center">手牌区</div>');
					dialog.add(list1);
				}
				if (list2.length) {
					dialog.add('<div class="text center">弃牌堆</div>');
					dialog.add(list2);
					if (list1.length) {
						dialog.classList.add("fullheight");
					}
				}
				return dialog;
			},
			check(button) {
				const player = _status.event.player;
				let num = get.value(button.link);
				if (!game.hasPlayer(target => target !== player && target.hasEmptySlot(get.subtype(button.link)) && get.attitude(player, target) > 0)) {
					num = 1 / (get.value(button.link) || 0.5);
				}
				if (get.owner(button.link)) {
					return num;
				}
				return num * 5;
			},
			backup(links, player) {
				return {
					audio: "sbqicai",
					card: links[0],
					filterCard(card, player) {
						const cardx = lib.skill.sbqicai_backup.card;
						if (get.owner(cardx)) {
							return card === cardx;
						}
						return false;
					},
					selectCard: -1,
					filterTarget(card, player, target) {
						return target !== player && target.canEquip(lib.skill.sbqicai_backup.card);
					},
					check: () => 1,
					discard: false,
					lose: false,
					prepare(cards, player, targets) {
						if (cards && cards.length) {
							player.$give(cards, targets[0], false);
						}
					},
					async content(event, trigger, player) {
						const { target } = event;
						let { cards } = event;
						let delayEvent;
						if (!cards || !cards.length) {
							cards = [lib.skill.sbqicai_backup.card];
							target.$gain2(cards);
							delayEvent = game.delayx();
						}
						const equipEvent = target.equip(cards[0]);
						player.addSkill("sbqicai_gain");
						lib.skill.sbqicai.updateCounter(player, target, 0);
						if (delayEvent) {
							await delayEvent;
						}
						await equipEvent;
					},
					ai: {
						result: {
							target(player, target) {
								const att = get.attitude(player, target);
								if (att > 0) {
									return 1;
								}
								if (att < 0) {
									return -3;
								}
								return 0;
							},
						},
					},
				};
			},
			prompt(links, player) {
				return `请选择置入${get.translation(links)}的角色`;
			},
		},
		updateCounter(player, target, num) {
			const skill = `sbqicai_${player.playerid}`;
			game.broadcastAll(lib.skill.sbqicai.initSkill, skill);
			if (!target.hasSkill(skill)) {
				target.addSkill(skill);
			}
			if (num === 0) {
				target.clearMark(skill, false);
			} else if (num > 0) {
				target.addMark(skill, num, false);
			}
			if (target.countMark(skill) >= lib.skill.sbqicai.getLimit) {
				target.removeSkill(skill);
			}
			if (!_status.postReconnect.sbqicai) {
				_status.postReconnect.sbqicai = [lib.skill.sbqicai.initSkill, []];
			}
			_status.postReconnect.sbqicai[1].add(skill);
		},
		initSkill: skill => {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					onremove: true,
					mark: true,
					marktext: "奇",
					intro: {
						markcount(storage) {
							return (storage || 0).toString();
						},
						content(storage) {
							return `已被掠夺${get.cnNumber(storage || 0)}张普通锦囊牌`;
						},
					},
				};
				lib.translate[skill] = "奇才";
				lib.translate[`${skill}_bg`] = "奇";
			}
		},
		ai: {
			order: 7,
			result: {
				player(player) {
					if (!game.hasPlayer(target => target !== player && target.hasEmptySlot(2) && get.attitude(player, target) !== 0)) {
						return 0;
					}
					return 1;
				},
			},
		},
		marktext: "才",
		intro: { content: "已使用$发动过此技能" },
		subSkill: {
			gain: {
				audio: "sbqicai",
				trigger: { global: ["gainAfter", "loseAsyncAfter"] },
				filter(event, player) {
					return game.hasPlayer(current => {
						const skill = `sbqicai_${player.playerid}`;
						if (!event.getg(current).length || !current.hasSkill(skill)) {
							return false;
						}
						if (current.countMark(skill) >= lib.skill.sbqicai.getLimit) {
							return false;
						}
						return event.getg(current).some(card => get.type(card) === "trick" && lib.filter.canBeGained(card, current, player));
					});
				},
				forced: true,
				direct: true,
				charlotte: true,
				async content(event, trigger, player) {
					const skill = `sbqicai_${player.playerid}`;
					const checkedTargets = [];
					while (true) {
						const target = game.findPlayer(current => {
							if (!trigger.getg(current).length || !current.hasSkill(skill)) {
								return false;
							}
							if (checkedTargets.includes(current) || current.countMark(skill) >= lib.skill.sbqicai.getLimit) {
								return false;
							}
							return trigger.getg(current).some(card => get.type(card) === "trick" && lib.filter.canBeGained(card, current, player));
						});
						if (!target) {
							break;
						}
						checkedTargets.push(target);
						player.logSkill("sbqicai_gain", target);
						let cards = trigger.getg(target).filter(card => get.type(card) === "trick" && lib.filter.canBeGained(card, target, player));
						const num = lib.skill.sbqicai.getLimit - target.countMark(skill);
						cards = cards.randomGets(num);
						const delayEvent = game.delaye(0.5);
						const giveEvent = target.give(cards, player);
						lib.skill.sbqicai.updateCounter(player, target, cards.length);
						await delayEvent;
						await giveEvent;
					}
				},
			},
		},
	},
	sbjizhi: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			return get.type(event.card) === "trick";
		},
		forced: true,
		async content(event, trigger, player) {
			const next = player.draw("nodelay");
			next.gaintag.add("sbjizhi");
			await next;
			player.addTempSkill("sbjizhi_mark");
		},
		subSkill: {
			mark: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("sbjizhi");
				},
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("sbjizhi")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name === "phaseDiscard" && card.hasGaintag("sbjizhi")) {
							return false;
						}
					},
				},
			},
		},
	},
	//诸葛亮
	sbhuoji: {
		audio: 3,
		dutySkill: true,
		onremove(player, skill) {
			player.removeSkill("sbhuoji_count");
		},
		derivation: ["sbguanxing", "sbkongcheng"],
		group: ["sbhuoji_fire", "sbhuoji_achieve", "sbhuoji_fail", "sbhuoji_mark"],
		subSkill: {
			fire: {
				audio: "sbhuoji1.mp3",
				enable: "phaseUse",
				filterTarget: lib.filter.notMe,
				prompt: "选择一名其他角色，对其与其势力相同的所有其他角色各造成1点火属性伤害",
				usable: 1,
				line: "fire",
				async content(event, trigger, player) {
					const { target } = event;
					await target.damage({ nature: "fire" });
					const targets = game.filterPlayer(current => current !== player && current !== target && current.group === target.group);
					if (!targets.length) {
						return;
					}
					player.line(targets, "fire");
					await game.delayx();
					await game.doAsyncInOrder(targets, current => current.damage({ nature: "fire" }));
				},
				ai: {
					order: 7,
					fireAttack: true,
					result: {
						target(player, target) {
							const att = get.attitude(player, target);
							return get.sgn(att) * game.filterPlayer(current => current !== player && current.group === target.group).reduce((num, current) => num + get.damageEffect(current, player, player, "fire"), 0);
						},
					},
				},
			},
			achieve: {
				audio: "sbhuoji2.mp3",
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return player.getAllHistory("sourceDamage", evt => evt.hasNature("fire") && evt.player !== player).reduce((num, evt) => num + evt.num, 0) >= game.players.length + game.dead.length;
				},
				forced: true,
				locked: false,
				skillAnimation: true,
				animationColor: "fire",
				async content(event, trigger, player) {
					player.awakenSkill("sbhuoji");
					game.log(player, "成功完成使命");
					player.changeSkin("sbhuoji", "sb_zhugeliang");
					player.changeSkills(["sbguanxing", "sbkongcheng"], ["sbhuoji", "sbkanpo", "twkanpo"]);
				},
			},
			fail: {
				audio: "sbhuoji3.mp3",
				trigger: { player: "dying" },
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.awakenSkill("sbhuoji");
					game.log(player, "使命失败");
				},
			},
			mark: {
				charlotte: true,
				trigger: { source: "damage" },
				filter(event, player) {
					return event.hasNature("fire");
				},
				firstDo: true,
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.addTempSkill("sbhuoji_count", {
						player: ["sbhuoji_achieveBegin", "sbhuoji_failBegin"],
					});
					player.storage.sbhuoji_count = player.getAllHistory("sourceDamage", evt => evt.hasNature("fire") && evt.player !== player).reduce((num, evt) => num + evt.num, 0);
					player.markSkill("sbhuoji_count");
				},
			},
			count: {
				charlotte: true,
				onremove: true,
				intro: { content: "本局游戏已造成过#点火属性伤害" },
			},
		},
	},
	sbkanpo: {
		audio: 2,
		trigger: { global: "roundStart" },
		filter(event, player) {
			const storage = player.storage.sbkanpo;
			return storage[0] || storage[1].length;
		},
		forced: true,
		locked: false,
		init(player) {
			if (!player.storage.sbkanpo) {
				player.storage.sbkanpo = [get.mode() !== "identity" ? 2 : 4, [], []];
				player.markSkill("sbkanpo");
			}
		},
		async content(event, trigger, player) {
			const storage = player.storage.sbkanpo;
			const sum = storage[0];
			storage[1] = [];
			player.markSkill("sbkanpo");
			if (!sum) {
				return;
			}
			const list = get.inpileVCardList(info => {
				if (info[2] === "sha" && info[3]) {
					return false;
				}
				return info[0] !== "equip";
			});
			const func = () => {
				const event = get.event();
				const controls = [
					link => {
						const evt = get.event();
						if (evt.dialog && evt.dialog.buttons) {
							for (const button of evt.dialog.buttons) {
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
					},
				];
				event.controls = [ui.create.control(controls.concat(["清除选择", "stayleft"]))];
			};
			const closeFunc = () => {
				const event = get.event();
				if (!event?.controls) {
					return;
				}
				event.controls[0].close();
			};
			if (event.isMine()) {
				func();
			} else if (event.isOnline()) {
				event.player.send(func);
			}
			const result = await player
				.chooseButton({
					createDialog: [`看破：是否记录至多${get.cnNumber(sum)}个牌名？`, [list, "vcard"]],
					selectButton: [1, sum],
					forced: false,
					ai: button => {
						if (ui.selected.buttons.length >= Math.max(3, game.countPlayer() / 2)) {
							return 0;
						}
						switch (button.link[2]) {
							case "wuxie":
								return 5 + Math.random();
							case "sha":
								return 5 + Math.random();
							case "tao":
								return 4 + Math.random();
							case "jiu":
								return 3 + Math.random();
							case "lebu":
								return 3 + Math.random();
							case "shan":
								return 4.5 + Math.random();
							case "wuzhong":
								return 4 + Math.random();
							case "shunshou":
								return 2.7 + Math.random();
							case "nanman":
								return 2 + Math.random();
							case "wanjian":
								return 1.6 + Math.random();
							default:
								return 1.5 + Math.random();
						}
					},
					filterButton: button => !_status.event.names.includes(button.link[2]),
				})
				.set("names", storage[2])
				.set("custom", {
					add: {
						confirm(bool) {
							if (bool !== true) {
								return;
							}
							const event = get.event().parent;
							if (event.controls) {
								for (const control of event.controls) {
									control.close();
								}
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
								for (const button of event.dialog.buttons) {
									const counterNode = button.querySelector(".caption");
									if (counterNode) {
										counterNode.childNodes[0].innerHTML = ``;
									}
								}
							}
							const evt = event.parent;
							if (evt.controls) {
								evt.controls[0].classList.add("disabled");
							}
						},
					},
					replace: {
						button(button) {
							const event = get.event();
							const sum = event.sum;
							if (!event.isMine()) {
								return;
							}
							if (!button.classList.contains("selectable")) {
								return;
							}
							if (ui.selected.buttons.length >= sum) {
								return false;
							}
							button.classList.add("selected");
							ui.selected.buttons.push(button);
							let counterNode = button.querySelector(".caption");
							const count = ui.selected.buttons.filter(current => current === button).length;
							if (counterNode) {
								counterNode = counterNode.childNodes[0];
								counterNode.innerHTML = `×${count}`;
							} else {
								counterNode = ui.create.caption(`<span style="font-size:24px; font-family:xinwei; text-shadow:#FFF 0 0 4px, #FFF 0 0 4px, rgba(74,29,1,1) 0 0 3px;">×${count}</span>`, button);
								counterNode.style.right = "5px";
								counterNode.style.bottom = "2px";
							}
							const evt = event.parent;
							if (evt.controls) {
								evt.controls[0].classList.remove("disabled");
							}
							game.check();
						},
					},
				})
				.set("sum", sum)
				.forResult();
			if (result.bool) {
				const names = result.links.map(link => link[2]);
				storage[0] -= names.length;
				storage[1] = names;
				storage[2] = names;
			} else {
				storage[2] = [];
				if (event.isMine()) {
					closeFunc();
				} else if (event.isOnline()) {
					event.player.send(closeFunc);
				}
			}
			player.markSkill("sbkanpo");
		},
		marktext: "破",
		intro: {
			markcount(storage) {
				return storage[1].length;
			},
			mark(dialog, content, player) {
				const storage = player.getStorage("sbkanpo");
				const sum = storage[0];
				const names = storage[1];
				dialog.addText(`剩余可记录${sum}次牌名`);
				if (player.isUnderControl(true) && names.length) {
					dialog.addText("当前记录牌名：");
					dialog.addSmall([names, "vcard"]);
				}
			},
		},
		group: "sbkanpo_kanpo",
		subSkill: {
			kanpo: {
				audio: "sbkanpo",
				trigger: { global: "useCard" },
				filter(event, player) {
					return event.player !== player && player.storage.sbkanpo[1].includes(event.card.name);
				},
				prompt2(event, player) {
					return `移除${get.translation(event.card.name)}的记录，令${get.translation(event.card)}无效`;
				},
				check(event, player) {
					let effect = 0;
					if (["wuxie", "shan"].includes(event.card.name)) {
						if (get.attitude(player, event.player) < -1) {
							effect = -1;
						}
					} else if (event.targets && event.targets.length) {
						for (const target of event.targets) {
							effect += get.effect(target, event.card, event.player, player);
						}
					}
					if (effect >= 0) {
						return false;
					}
					if (event.card.name !== "sha") {
						return true;
					}
					const target = event.targets[0];
					if (target === player) {
						return !player.countCards("h", "shan");
					}
					return target.hp === 1 || (target.countCards("h") <= 2 && target.hp <= 2);
				},
				logTarget: "player",
				async content(event, trigger, player) {
					player.storage.sbkanpo[1].remove(trigger.card.name);
					player.markSkill("sbkanpo");
					trigger.targets.length = 0;
					trigger.all_excluded = true;
					await player.draw();
				},
			},
		},
	},
	sbguanxing: {
		audio: 2,
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		filter(event, player) {
			const hasStars = player.hasCard(card => card.hasGaintag("sbguanxing"), "s");
			if (event.name === "phaseZhunbei") {
				return hasStars || 7 - lib.skill.sbguanxing.getNum * player.countMark("sbguanxingx") > 0;
			}
			return hasStars && player.hasSkill("sbguanxing_on");
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			if (trigger.name === "phaseZhunbei") {
				player.addMark("sbguanxingx", 1, false);
				const oldCards = player.getCards("s", card => card.hasGaintag("sbguanxing"));
				const markCount = player.countMark("sbguanxingx") - 1;
				const num = Math.max(0, 7 - lib.skill.sbguanxing.getNum * markCount);
				if (oldCards.length) {
					await player.loseToDiscardpile({ cards: oldCards });
				}
				if (num) {
					const newCards = get.cards(num);
					player.$gain2(newCards, false);
					game.log(player, "将", newCards, "置于了武将牌上");
					const loseEvent = player.loseToSpecial(newCards, "sbguanxing");
					loseEvent.visible = true;
					player.markSkill("sbguanxing");
					await loseEvent;
				}
			}
			const cards = player.getCards("s", card => card.hasGaintag("sbguanxing"));
			if (!cards.length) {
				if (trigger.name === "phaseZhunbei") {
					player.addTempSkill("sbguanxing_on");
				}
				return;
			}
			const result = await player
				.chooseToMove({
					allowChooseAll: true,
					list: [["你的“星”", cards], ["牌堆顶"]],
					prompt: "观星：点击或拖动将牌移动到牌堆顶",
					processAI: list => {
						const cards = list[0][1].slice();
						const player = _status.event.player;
						const name = _status.event.getTrigger().name;
						const target = name === "phaseZhunbei" ? player : player.getNext();
						const judges = target.getCards("j");
						const top = [];
						const att = get.sgn(get.attitude(player, target));
						if (judges.length && att !== 0 && (target !== player || !player.hasWuxie())) {
							for (const _judgeCard of judges) {
								const judge = (card, num) => get.judge(card) * num;
								cards.sort((a, b) => judge(b, att) - judge(a, att));
								if (judge(cards[0], att) < 0) {
									break;
								}
								top.unshift(cards.shift());
							}
						}
						return [cards, top];
					},
				})
				.set("filterOk", moved => moved[1].length)
				.forResult();
			if (!result.bool) {
				if (trigger.name === "phaseZhunbei") {
					player.addTempSkill("sbguanxing_on");
				}
				return;
			}
			const topCards = result.moved[1];
			const loseEvent = player.loseToDiscardpile({
				cards: topCards,
				position: ui.cardPile,
				insert_card: true,
			});
			loseEvent.log = false;
			game.log(player, "将", topCards, "置于了牌堆顶");
			await loseEvent;
		},
		getNum: 3,
		group: "sbguanxing_unmark",
		subSkill: {
			on: { charlotte: true },
			unmark: {
				trigger: { player: "loseAfter" },
				filter(event, player) {
					if (!event.ss || !event.ss.length) {
						return false;
					}
					return !player.countCards("s", card => card.hasGaintag("sbguanxing"));
				},
				charlotte: true,
				forced: true,
				silent: true,
				async content(event, trigger, player) {
					player.unmarkSkill("sbguanxing");
				},
			},
		},
		marktext: "星",
		intro: {
			mark(dialog, storage, player) {
				const cards = player.getCards("s", card => card.hasGaintag("sbguanxing"));
				if (!cards.length) {
					return;
				}
				dialog.addAuto(cards);
			},
			markcount(storage, player) {
				return player.countCards("s", card => card.hasGaintag("sbguanxing"));
			},
			onunmark(storage, player) {
				const cards = player.getCards("s", card => card.hasGaintag("sbguanxing"));
				if (cards.length) {
					player.loseToDiscardpile({ cards });
				}
			},
		},
		mod: {
			aiOrder(player, card, num) {
				const cards = player.getCards("s", card => card.hasGaintag("sbguanxing"));
				if (get.itemtype(card) === "card" && card.hasGaintag("sbguanxing")) {
					return num + (cards.length > 1 ? 0.5 : -0.0001);
				}
			},
		},
	},
	sbkongcheng: {
		audio: 2,
		trigger: { player: ["damageBegin3", "damageBegin4"] },
		filter(event, player, name) {
			if (!player.hasSkill("sbguanxing") && !player.hasSkill("jdguanxing")) {
				return false;
			}
			const num = player.countCards("s", card => card.hasGaintag("sbguanxing"));
			if (name === "damageBegin3" && !num) {
				return true;
			}
			if (name === "damageBegin4" && num) {
				return true;
			}
			return false;
		},
		forced: true,
		async content(event, trigger, player) {
			const num = player.countCards("s", card => card.hasGaintag("sbguanxing"));
			if (!num && event.triggername === "damageBegin3") {
				trigger.num++;
			} else if (num && event.triggername === "damageBegin4") {
				await player
					.judge({
						judge: result => (get.number(result) <= get.player().countCards("s", card => card.hasGaintag("sbguanxing")) ? 2 : -1),
						judge2: result => result.bool,
					})
					.set("callback", async (event, trigger, player) => {
						if (event.judgeResult.number <= player.countCards("s", card => card.hasGaintag("sbguanxing"))) {
							event.getParent("sbkongcheng").getTrigger().num--;
						}
					});
			}
		},
		ai: {
			combo: "sbguanxing",
		},
	},
	//卢植
	sbmingren: {
		audio: 2,
		trigger: {
			player: "enterGame",
			global: ["phaseBefore", "loseAfter"],
		},
		filter(event, player) {
			if (event.name === "lose") {
				const evt = event.getl(event.player);
				return event.position === ui.discardPile && event.getlx !== false && evt.xs?.some(card => evt.gaintag_map[card.cardid]?.includes("sbmingren"));
			}
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		intro: {
			content: "expansion",
		},
		forced: true,
		async content(event, trigger, player) {
			await player.draw(2);
			if (player.hasCards("h") && game.hasPlayer(target => !target.hasExpansions(event.name))) {
				const result = await player
					.chooseCardTarget({
						prompt: "明任：将一张牌置于一名角色武将牌上，称为“任”",
						filterCard: true,
						position: "h",
						filterTarget(card, player, target) {
							return !target.hasExpansions("sbmingren");
						},
						ai1(card) {
							return 6 - get.value(card);
						},
						ai2(target) {
							return Math.random();
						},
						forced: true,
					})
					.forResult();
				const { cards, targets } = result;
				if (cards?.length && targets?.length) {
					player.line(targets);
					await targets[0].addToExpansion({ cards, source: player, animate: "giveAuto", gaintag: [event.name] });
				}
			}
		},
	},
	sbweiliu: {
		audio: "sbzhenliang",
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player) {
			const cards = event.player.getExpansions("sbmingren");
			if (!cards.length) {
				return false;
			}
			const choices = ["gain", "damage"].removeArray(player.getStorage("sbweiliu_used"));
			return choices.length > 0;
		},
		async cost(event, trigger, player) {
			const controls = ["选项一", "选项二", "cancel2"];
			const target = trigger.player;
			const card = target.getExpansions("sbmingren")[0];
			const color = get.color(card);
			const num = player.getAllHistory("useSkill", evt => evt.skill === event.skill).length + 1;
			const choiceList = [`弃置${get.cnNumber(num)}张${get.translation(color)}牌对一名角色造成1点伤害`, `从牌堆获得${get.cnNumber(num)}张${get.translation(color)}牌`];
			const choices = ["gain", "damage"].removeArray(player.getStorage("sbweiliu_used"));
			if (!choices.includes("damage")) {
				controls.remove("选项一");
				choiceList[0] = `<span style="text-decoration: line-through;">${choiceList[0]}</span>`;
			}
			if (!choices.includes("gain")) {
				controls.remove("选项二");
				choiceList[1] = `<span style="text-decoration: line-through;">${choiceList[1]}</span>`;
			}
			const result = await player
				.chooseControl({
					prompt: get.prompt2(event.skill, target),
					controls,
					choiceList,
					choice: get.rand(0, choices.length),
				})
				.forResult();
			if (result.control !== "cancel2") {
				event.result = {
					bool: true,
					cost_data: {
						control: ["damage", "gain"][["选项一", "选项二"].indexOf(result.control)],
						num,
						color,
					},
				};
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const {
				cost_data: { control, num, color },
				targets: [target],
				name,
			} = event;
			player.addTempSkill(`${name}_used`, "roundStart");
			player.markAuto(`${name}_used`, control);
			if (control === "damage") {
				const hs = player.getDiscardableCards(player, "he", { color });
				const result = await player
					.chooseCardTarget({
						prompt: `卫旒：弃置${get.cnNumber(num)}张${get.translation(color)}牌对一名角色造成1点伤害`,
						filterCard(card, player) {
							return get.color(card) === get.event().color && lib.filter.cardDiscardable(card, player, "sbweiliu");
						},
						selectCard: hs.length <= num ? -1 : num,
						filterTarget: lib.filter.all,
						ai1(card) {
							return 6.5 - get.value(card);
						},
						ai2(target) {
							return get.damageEffect(target, get.player(), get.player());
						},
						forced: true,
					})
					.set("color", color)
					.forResult();
				const { cards, targets } = result;
				if (cards?.length && targets?.length) {
					player.line(targets);
					await player.modedDiscard({ cards });
					await targets[0].damage();
				}
			} else {
				const cards = [];
				while (cards.length < num) {
					const card = get.cardPile2(card => get.color(card) === color && !cards.includes(card));
					if (card) {
						cards.push(card);
					} else {
						break;
					}
				}
				if (cards.length) {
					await player.gain({ cards, animate: "gain2" });
				}
			}
			player.addTempSkill(`${name}_effect`);
			player.setStorage(`${name}_effect`, [control, num, color, target]);
			player.addTip(`${name}_effect`, `卫旒 ${control === "damage" ? "摸" : "弃"}${num}${get.translation(color).slice(0, 1)}`);
		},
		ai: {
			combo: "sbmingren",
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			effect: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				popup: false,
				filter(event, player) {
					return event.player === player.getStorage("sbweiliu_effect")[3] && event.player?.isIn();
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const target = event.targets[0];
					const [name, num, color] = player.getStorage(event.name).slice();
					player.removeSkill(event.name);
					let numx = 0;
					target.checkHistory(name === "damage" ? "gain" : "lose", evt => {
						if (name === "damage") {
							numx += evt.cards.filter(card => get.color(card) === color).length;
						} else if (evt.type === "discard") {
							numx += evt.cards2.filter(card => get.color(card) === color).length;
						}
					});
					if (numx >= num) {
						player.popup("达成条件", "blue");
						if (target.hasExpansions("sbmingren")) {
							await target.loseToDiscardpile({ cards: target.getExpansions("sbmingren") });
						}
					}
				},
			},
		},
	},
	old_sbmingren: {
		inherit: "nzry_mingren",
		drawNum: 3,
	},
	sbzhenliang: {
		inherit: "nzry_zhenliang",
		audio: 2,
		drawNum: 2,
		intro: {
			content(storage, player) {
				if (storage) {
					return "你的回合外，一名角色使用或打出牌结算完成后，若此牌与“任”类别相同，则你可以令至多两名角色各摸两张牌。";
				}
				return "出牌阶段限一次，你可以弃置与攻击范围内的一名角色体力值之差张与“任”颜色相同的牌（至少一张），对其造成1点伤害。";
			},
		},
		trigger: { global: ["useCardAfter", "respondAfter"] },
		filter(event, player) {
			const cards = player.getExpansions("nzry_mingren");
			if (!cards.length) {
				return false;
			}
			if (event.name === "chooseToUse") {
				if (player.storage.sbzhenliang || player.hasSkill("sbzhenliang_used", null, null, false)) {
					return false;
				}
				const color = get.color(cards[0]);
				if (!player.countCards("he", card => get.color(card) === color)) {
					return false;
				}
				return game.hasPlayer(current => {
					return (
						player.inRange(current) &&
						player.countCards("he", card => {
							return get.color(card) === color;
						}) >= Math.max(1, Math.abs(player.getHp() - current.getHp()))
					);
				});
			} else {
				if (_status.currentPhase === player || !player.storage.sbzhenliang) {
					return false;
				}
				return get.type2(event.card) === get.type2(cards[0]);
			}
		},
		selectCard: [1, Infinity],
		complexSelect: true,
		complexCard: true,
		filterTarget(card, player, target) {
			return player.inRange(target) && ui.selected.cards.length === Math.max(1, Math.abs(player.getHp() - target.getHp()));
		},
		prompt: "弃置与攻击范围内的一名角色体力值之差张与“任”颜色相同的牌（至少一张），对其造成1点伤害",
		subSkill: { used: { charlotte: true } },
	},
	//小乔
	sbtianxiang: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h", card => lib.skill.sbtianxiang.filterCard(card, player)) && game.hasPlayer(target => lib.skill.sbtianxiang.filterTarget(null, player, target));
		},
		filterCard(card, player) {
			return get.color(card, player) === "red";
		},
		filterTarget(card, player, target) {
			return target !== player && !target.getSkills().some(skill => skill.indexOf("sbtianxiang_") === 0);
		},
		position: "h",
		discard: false,
		lose: false,
		delay: 0,
		usable: 3,
		prompt: "将一张红色手牌交给一名角色并令其获得此花色的“天香”标记",
		async content(event, trigger, player) {
			const { cards, target } = event;
			const giveEvent = player.give(cards, target);
			const suit = get.suit(cards[0], player);
			target.addSkill(`sbtianxiang_${suit}`);
			await giveEvent;
		},
		ai: {
			order: 5,
			result: { target: -1 },
		},
		group: ["sbtianxiang_draw", "sbtianxiang_effect"],
		subSkill: {
			heart: {
				charlotte: true,
				mark: true,
				marktext: "♥︎",
				intro: { content: "伤害转移术" },
			},
			diamond: {
				charlotte: true,
				mark: true,
				marktext: "♦︎",
				intro: { content: "掳掠大法" },
			},
			draw: {
				audio: "sbtianxiang",
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return game.hasPlayer(target => target.getSkills().some(skill => skill.indexOf("sbtianxiang_") === 0));
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					let num = 0;
					game.countPlayer(target => {
						const skills = target.getSkills().filter(skill => skill.indexOf("sbtianxiang_") === 0);
						target.removeSkill(skills);
						num += skills.length;
					});
					if (get.mode() === "versus" && _status.mode === "two") {
						num += 2;
					}
					await player.draw(num);
				},
			},
			effect: {
				trigger: { player: "damageBegin3" },
				filter(event, player) {
					return game.hasPlayer(target => target.getSkills().some(skill => skill.indexOf("sbtianxiang_") === 0));
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget({
							prompt: get.prompt("sbtianxiang"),
							prompt2: "移去一名角色的“天香”标记并执行相应效果",
							filterTarget: (card, player, target) => target.getSkills().some(skill => skill.indexOf("sbtianxiang_") === 0),
						})
						.set("ai", target => {
							const player = _status.event.player;
							return -get.attitude(player, target) * target.getSkills().filter(skill => skill.indexOf("sbtianxiang_") === 0).length;
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					const skills = target.getSkills().filter(skill => skill.indexOf("sbtianxiang_") === 0);
					target.removeSkill(skills);
					if (skills.includes("sbtianxiang_heart")) {
						target.damage(trigger.source ? trigger.source : "nosource");
						trigger.cancel();
					}
					if (skills.includes("sbtianxiang_diamond")) {
						const cards = target.getCards("he");
						if (!cards.length) {
							return;
						}
						await target.chooseToGive({ target: player, position: "he", selectCard: 2, prompt: `天香：交给${get.translation(player)}两张牌`, forced: true });
					} else {
						return;
					}
				},
			},
		},
	},
	//牢张郃
	old_sbqiaobian: {
		audio: 2,
		trigger: { player: ["phaseJudgeBefore", "phaseDrawBefore", "phaseUseBefore"] },
		usable: 1,
		async cost(event, trigger, player) {
			const skillName = event.name.slice(0, -5);
			switch (trigger.name) {
				case "phaseJudge":
					event.result = await player
						.chooseTarget({ prompt: get.prompt(skillName), prompt2: "失去1点体力并跳过判定阶段，将判定区里的牌移动给一名其他角色", filterTarget: lib.filter.notMe })
						.set("ai", target => {
							const player = get.player();
							if (
								player.hp +
									player.countCards("h", card => {
										const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
										if (mod2 !== "unchanged") {
											return mod2;
										}
										const mod = game.checkMod(card, player, player, "unchanged", "cardSavable", player);
										if (mod !== "unchanged") {
											return mod;
										}
										let savable = get.info(card).savable;
										if (typeof savable === "function") {
											savable = savable(card, player, player);
										}
										return savable;
									}) <=
								1
							) {
								return 0;
							}
							let eff = 0;
							for (const card of player.getCards("j")) {
								const cardx = card.viewAs ? get.autoViewAs({ name: card.viewAs }, [card]) : card;
								if (target.canAddJudge(cardx)) {
									eff += get.effect(target, cardx, player, player);
								} else {
									eff -= get.attitude(player, target) / 114514;
								}
							}
							return eff;
						})
						.setHiddenSkill(skillName)
						.forResult();
					break;
				case "phaseDraw":
					event.result = await player
						.chooseBool({ prompt: get.prompt(skillName), prompt2: "跳过摸牌阶段，于下个准备阶段摸五张牌并回复1点体力" })
						.setHiddenSkill(skillName)
						.forResult();
					break;
				case "phaseUse": {
					let next;
					const num = player.countCards("h") - 6;
					if (num <= 0) {
						next = player.chooseBool({ prompt: get.prompt(skillName), prompt2: "跳过出牌阶段和弃牌阶段，然后移动场上的一张牌", choice: player.canMoveCard(true) }).setHiddenSkill(skillName);
					} else {
						next = player
							.chooseToDiscard({
								prompt: get.prompt(skillName),
								prompt2: `弃置${get.cnNumber(num)}张手牌并跳过出牌阶段和弃牌阶段，然后移动场上的一张牌`,
								selectCard: num,
								allowChooseAll: true,
							})
							.set("ai", card => {
								const player = get.player();
								if (!player.canMoveCard(true) || player.countCards("hs", card => player.hasValueTarget(card)) >= 9) {
									return 0;
								}
								return 7 - get.value(card);
							})
							.setHiddenSkill(skillName);
					}
					event.result = await next.forResult();
					break;
				}
			}
		},
		async content(event, trigger, player) {
			trigger.cancel();
			switch (trigger.name) {
				case "phaseJudge": {
					const {
						targets: [target],
					} = event;
					await player.loseHp();
					game.log(player, "跳过了判定阶段");
					for (const card of player.getCards("j")) {
						if (target.canAddJudge(card)) {
							player.$give(card, target, false);
							if (card.viewAs) {
								await target.addJudge({ name: card.viewAs }, [card]);
							} else {
								await target.addJudge(card);
							}
						} else {
							await player.discard({ cards: [card] });
						}
					}
					break;
				}
				case "phaseDraw":
					game.log(player, "跳过了摸牌阶段");
					player.addSkill("old_sbqiaobian_draw");
					break;
				case "phaseUse":
					player.skip("phaseDiscard");
					game.log(player, "跳过了出牌阶段");
					game.log(player, "跳过了弃牌阶段");
					await player.moveCard();
					break;
			}
		},
		subSkill: {
			draw: {
				charlotte: true,
				mark: true,
				intro: { content: "准备阶段摸五张牌并回复1点体力" },
				audio: "old_sbqiaobian",
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					const drawEvent = player.draw(5);
					const recoverEvent = player.recover();
					await drawEvent;
					await recoverEvent;
				},
			},
		},
	},
	//萌货
	sbhuoshou: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return true;
		},
		forced: true,
		onremove: true,
		group: ["sbhuoshou_cancel", "sbhuoshou_source", "sbhuoshou_nanmaned"],
		async content(event, trigger, player) {
			const card = get.discardPile(card => card.name === "nanman", "random");
			if (card) {
				await player.gain({ cards: [card], animate: "gain2" });
			} else {
				game.log("但是弃牌堆里并没有", "#y南蛮入侵", "！");
				player.addMark("sbhuoshou", 1, false);
				if (player.countMark("sbhuoshou") >= 5 && Math.random() < 0.25) {
					player.chat("我南蛮呢");
				}
			}
		},
		subSkill: {
			cancel: {
				audio: "sbhuoshou",
				trigger: { target: "useCardToBefore" },
				forced: true,
				priority: 15,
				filter(event, player) {
					return event.card.name === "nanman";
				},
				async content(event, trigger, player) {
					trigger.cancel();
				},
			},
			source: {
				audio: "sbhuoshou",
				trigger: { global: "useCardToPlayered" },
				forced: true,
				filter(event, player) {
					return event.isFirstTarget && event.card && event.card.name === "nanman" && event.player !== player;
				},
				async content(event, trigger, player) {
					trigger.getParent().customArgs.default.customSource = player;
				},
				ai: {
					halfneg: true,
				},
			},
			nanmaned: {
				trigger: {
					player: "useCard1",
				},
				filter(event, player) {
					return event.card.name === "nanman";
				},
				forced: true,
				popup: false,
				charlotte: true,
				async content(event, trigger, player) {
					player.addTempSkill("sbhuoshou_ban", "phaseUseAfter");
				},
			},
			ban: {
				charlotte: true,
				intro: {
					content: "此阶段不能再使用【南蛮入侵】",
				},
			},
		},
		mod: {
			cardEnabled(card, player) {
				if (player.hasSkill("sbhuoshou_ban") && card.name === "nanman") {
					return false;
				}
			},
		},
		ai: {
			threaten: 1.9,
		},
	},
	sbzaiqi: {
		audio: 2,
		trigger: {
			player: "phaseDiscardEnd",
		},
		chargeSkill: 7,
		filter(event, player) {
			return player.countCharge() > 0;
		},
		group: "sbzaiqi_backflow",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("sbzaiqi"),
					prompt2: "选择任意名角色并消耗等量蓄力值，令这些角色选择一项：1.令你摸一张牌；2.弃置一张牌，然后你回复1点体力",
					selectTarget: [1, player.countMark("charge")],
					ai: target => {
						const player = _status.event.player;
						const att = get.attitude(player, target);
						return 3 - get.sgn(att) + Math.abs(att / 1000);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			player.removeCharge(targets.length);
			for (const target of targets) {
				let discarded = false;
				if (target.hasCards("he")) {
					const result = await target
						.chooseToDiscard({
							prompt: `${get.translation(player)}对你发动了【再起】`,
							prompt2: "是否弃置一张牌令其回复1点体力？或者点击“取消”，令该角色摸一张牌。",
							position: "he",
							ai: card => {
								const eff = _status.event.eff;
								const att = _status.event.att;
								if ((eff > 0 && att > 0) || (eff <= 0 && att < 0)) {
									return 5.5 - get.value(card);
								}
								return 0;
							},
						})
						.set("eff", get.recoverEffect(player, player, target))
						.set("att", get.attitude(target, player))
						.forResult();
					discarded = result.bool;
				}
				target.line(player);
				if (discarded) {
					await player.recover({ source: target });
				} else {
					await player.draw();
				}
				await game.delayex();
			}
		},
		subSkill: {
			backflow: {
				audio: "sbzaiqi",
				trigger: {
					source: "damageSource",
				},
				usable: 1,
				filter(event, player) {
					if (!player.countCharge(true)) {
						return false;
					}
					if (event.name === "damage") {
						return true;
					}
					return event.name !== "phase" || game.phaseNumber === 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.addCharge(trigger.name === "damage" ? 1 : 3);
				},
			},
		},
	},
	//祝融
	sblieren: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.targets.length === 1 && event.card.name === "sha" && player.canCompare(event.target);
		},
		check(event, player) {
			return get.attitude(player, event.target) <= 0 || game.hasPlayer(current => get.damageEffect(current, player, player) > 0);
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const result = await player.chooseToCompare(trigger.target).forResult();
			if (result?.bool) {
				player.addTempSkill("sblieren_damage");
				if (!trigger.card.storage) {
					trigger.card.storage = {};
				}
				trigger.card.storage.sblieren = [player, trigger.target];
			}
		},
		subSkill: {
			damage: {
				audio: "sblieren",
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					return (
						event.card.name === "sha" &&
						event.card.storage &&
						event.card.storage.sblieren &&
						event.card.storage.sblieren[0] === player &&
						game.hasPlayer(current => {
							return !event.card.storage.sblieren.includes(current);
						})
					);
				},
				charlotte: true,
				async cost(event, trigger, player) {
					const target = trigger.card.storage.sblieren[1];
					event.result = await player
						.chooseTarget({
							prompt: `烈刃：是否对除${get.translation(target)}外的一名其他角色造成1点伤害？`,
							filterTarget: (card, player, target) => target !== _status.event.targeted && target !== player,
						})
						.set("targeted", target)
						.set("ai", targetx => get.damageEffect(targetx, _status.event.player, _status.event.player))
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					await target.damage();
				},
			},
		},
	},
	sbjuxiang: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		forced: true,
		direct: true,
		filter(event, player) {
			return !player.hasHistory("useCard", evt => evt.card.name === "nanman") && (!_status.sbjuxiang_nanman || _status.sbjuxiang_nanman.length);
		},
		group: ["sbjuxiang_cancel", "sbjuxiang_gain"],
		async content(event, trigger, player) {
			if (!_status.sbjuxiang_nanman) {
				_status.sbjuxiang_nanman = [
					{ name: "nanman", number: 7, suit: "spade" },
					{ name: "nanman", number: 7, suit: "club" },
				];
				game.broadcastAll(() => {
					if (!lib.inpile.includes("nanman")) {
						lib.inpile.add("nanman");
					}
				});
			}
			const result = await player
				.chooseTarget({
					prompt: "请选择【巨象】的目标",
					prompt2: `将游戏外的随机一张【南蛮入侵】交给一名角色（剩余${get.cnNumber(_status.sbjuxiang_nanman.length)}张）`,
					forced: true,
					ai: target => {
						const player = _status.event.player;
						return Math.max(0, target.getUseValue({ name: "nanman" })) * get.attitude(player, target) * (target === player ? 0.5 : 1);
					},
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			const target = result.targets[0];
			player.logSkill("sbjuxiang", target);
			if (!_status.sbjuxiang_nanman.length) {
				return;
			}
			const info = _status.sbjuxiang_nanman.randomRemove();
			const card = game.createCard2(info);
			const gainEvent = target.gain({ cards: [card], animate: "gain2" });
			gainEvent.giver = player;
			await gainEvent;
		},
		ai: {
			expose: 0.05,
			effect: {
				target(card) {
					if (card.name === "nanman") {
						return [0, 1, 0, 0];
					}
				},
			},
		},
		subSkill: {
			cancel: {
				audio: "sbjuxiang",
				trigger: { target: "useCardToBefore" },
				forced: true,
				priority: 15,
				filter(event, player) {
					return event.card.name === "nanman";
				},
				async content(event, trigger, player) {
					trigger.cancel();
				},
			},
			gain: {
				audio: "sbjuxiang",
				trigger: { global: "useCardAfter" },
				forced: true,
				filter(event, player) {
					return event.card.name === "nanman" && event.player !== player && event.cards.filterInD().length > 0;
				},
				async content(event, trigger, player) {
					await player.gain({ cards: trigger.cards.filterInD(), animate: "gain2" });
				},
			},
		},
	},
	//阿笨
	sbjiang: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			return event.card.name === "juedou" || (event.card.name === "sha" && get.color(event.card) === "red");
		},
		frequent: true,
		onremove: true,
		group: ["sbjiang_add", "sbjiang_qiben"],
		async content(event, trigger, player) {
			await player.draw();
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (card.name === "sha" && get.color(card) === "red") {
						return [1, 0.6];
					}
				},
				player_use(card, player, target) {
					if (card.name === "sha" && get.color(card) === "red") {
						return [1, 1];
					}
				},
			},
		},
		subSkill: {
			add: {
				audio: "sbjiang",
				trigger: { player: "useCard2" },
				direct: true,
				filter(event, player) {
					if (event.card.name !== "juedou") {
						return false;
					}
					const info = get.info(event.card);
					if (info.allowMultiple === false) {
						return false;
					}
					if (!event.targets || info.multitarget) {
						return false;
					}
					return game.hasPlayer(current => !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current));
				},
				async content(event, trigger, player) {
					const result = await player
						.chooseTarget({
							prompt: get.prompt("sbjiang_add"),
							prompt2: `为${get.translation(trigger.card)}额外指定一个目标，然后失去1点体力`,
							filterTarget: (_card, player, target) => {
								if (_status.event.targets.includes(target)) {
									return false;
								}
								return lib.filter.targetEnabled2(_status.event.card, player, target);
							},
							ai: target => {
								const trigger = _status.event.getTrigger();
								const player = _status.event.player;
								const eff = get.effect(target, trigger.card, player, player);
								if (player.hasZhuSkill("sbzhiba") && !player.hasMark("sbjiang")) {
									return eff;
								}
								if (eff + get.effect(player, { name: "losehp" }, player) / 8 > 0) {
									return eff;
								}
								return 0;
							},
						})
						.set("targets", trigger.targets)
						.set("card", trigger.card)
						.forResult();
					if (!result.bool) {
						return;
					}
					if (!event.isMine() && !event.isOnline()) {
						await game.delayx();
					}
					player.logSkill("sbjiang_add", result.targets);
					trigger.targets.addArray(result.targets);
					await player.loseHp();
				},
			},
			qiben: {
				audio: "sbjiang",
				enable: "phaseUse",
				usable(skill, player) {
					return player.hasMark("sbjiang") ? game.countPlayer(current => current.group === "wu" && current !== player) + 1 : 1;
				},
				viewAs: { name: "juedou" },
				filterCard: true,
				position: "h",
				selectCard: -1,
				prompt() {
					const player = _status.event.player;
					const limit = player.hasMark("sbjiang") ? game.countPlayer(current => current.group === "wu" && current !== player) + 1 : 1;
					return `出牌阶段限${get.cnNumber(limit)}次。你可以将所有手牌当【决斗】使用`;
				},
				filter(event, player) {
					const hs = player.getCards("h");
					if (!hs.length) {
						return false;
					}
					for (const card of hs) {
						const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
						if (mod2 === false) {
							return false;
						}
					}
					return event.filterCard(get.autoViewAs({ name: "juedou" }, hs));
				},
				ai: {
					order: 0.001,
					result: {
						player(player, target) {
							const cards = player.getCards("h");
							return get.value(cards, player) * Math.sqrt(cards.length) <= 12;
						},
					},
					nokeep: true,
					skillTagFilter(player, tag, arg) {
						if (tag !== "nokeep") {
							return;
						}
						if (arg && (!arg.card || get.name(arg.card) !== "tao")) {
							return false;
						}
						const limit = player.hasMark("sbjiang") ? game.countPlayer(current => current.group === "wu" && current !== player) + 1 : 1;
						return player.isPhaseUsing() && (player.getStat("skill").sbjiang_qiben || 0) < limit && player.hasCard(card => get.name(card) !== "tao", "h");
					},
				},
			},
		},
	},
	sbhunzi: {
		audio: 2,
		trigger: { player: "dyingAfter" },
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "wood",
		derivation: ["sbyingzi", "gzyinghun"],
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp();
			await player.changeHujia(1, null, true);
			await player.draw(3);
			await player.addSkills(["sbyingzi", "gzyinghun"]);
		},
		ai: {
			threaten(player, target) {
				if (target.hp === 1) {
					return 2;
				}
				return 0.5;
			},
			maixie: true,
			effect: {
				target(card, player, target) {
					if (!target.hasFriend() || target.hp > 1) {
						return;
					}
					if (get.tag(card, "damage") === 1 && ((target.hasZhuSkill("sbzhiba") && game.countPlayer(current => current !== target && current.group === "wu")) || player.countCards("hs", card => player.canSaveCard(card, target)) + target.countCards("hs", card => target.canSaveCard(card, target)) > 0) && !target.isTurnedOver() && _status.currentPhase !== target && get.distance(_status.currentPhase, target, "absolute") <= 3) {
						return [0.5, 1];
					}
				},
			},
		},
	},
	sbzhiba: {
		audio: 2,
		trigger: { player: "dying" },
		filter(event, player) {
			if (!player.hasZhuSkill("sbzhiba")) {
				return false;
			}
			return player.hp <= 0;
		},
		zhuSkill: true,
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const targets = game.filterPlayer(current => current.group === "wu" && current !== player).sortBySeat(_status.currentPhase);
			const num = targets.length;
			let recoverEvent;
			if (num > 0) {
				recoverEvent = player.recover(num);
			}
			player.addMark("sbjiang", 1, false);
			player.addTempSkill("sbzhiba_draw");
			if (recoverEvent) {
				await recoverEvent;
			}
			for (const target of targets) {
				await target.damage({ nosource: true });
			}
		},
		subSkill: {
			draw: {
				trigger: { global: "dieAfter" },
				filter(event, player) {
					return event.getParent(3).name === "sbzhiba";
				},
				forced: true,
				charlotte: true,
				async content(event, trigger, player) {
					await player.draw(3);
				},
			},
		},
	},
	//大乔
	sbguose: {
		audio: 2,
		enable: "phaseUse",
		usable: 4,
		discard: false,
		lose: false,
		delay: false,
		filter(event, player) {
			return player.hasCard(card => get.suit(card) === "diamond", "hes") || game.hasPlayer(current => current.hasJudge("lebu"));
		},
		position: "hes",
		filterCard(card, player) {
			if (get.suit(card) !== "diamond") {
				return false;
			}
			if (game.checkMod(card, player, "unchanged", "cardEnabled2", player) === false) {
				return false;
			}
			return true;
		},
		selectCard: [0, 1],
		filterTarget(card, player, target) {
			if (!ui.selected.cards.length) {
				if (target.hasJudge("lebu")) {
					return true;
				}
				return false;
			}
			if (player === target) {
				return false;
			}
			return player.canUse(get.autoViewAs({ name: "lebu" }, ui.selected.cards), target);
		},
		complexSelect: true,
		check(card) {
			return 7 - get.value(card);
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			if (target.hasJudge("lebu")) {
				await target.discard({ cards: [target.getJudge("lebu")] });
			} else {
				const next = player.useCard({ card: { name: "lebu" }, targets: [target], cards: event.cards });
				next.audio = false;
				await next;
			}
			await player.draw();
		},
		ai: {
			result: {
				target(player, target) {
					if (target.hasJudge("lebu")) {
						return -get.effect(target, { name: "lebu" }, player, target);
					}
					return get.effect(target, { name: "lebu" }, player, target);
				},
			},
			order: 9,
		},
	},
	sbliuli: {
		audio: 2,
		inherit: "liuli",
		group: "sbliuli_heart",
		subSkill: {
			heart: {
				trigger: { player: "discardAfter" },
				filter(event, player) {
					const evt = event.getParent("sbliuli", true);
					if (!evt?.cards?.length) {
						return false;
					}
					return get.suit(evt.cards[0]) === "heart";
				},
				usable: 1,
				popup: false,
				async cost(event, trigger, player) {
					const sourcex = trigger.getParent("sbliuli", true).getTrigger().player;
					event.result = await player
						.chooseTarget({
							prompt: `流离：是否令一名不为${get.translation(sourcex)}的其他角色获得“流离”标记？`,
							filterTarget: (card, player, target) => target !== player && target !== get.event().sourcex,
						})
						.set("ai", target => {
							return get.attitude(get.player(), target);
						})
						.set("sourcex", sourcex)
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.line(target, "green");
					game.countPlayer(current => current.removeSkill("sbliuli_dangxian"));
					target.addSkill("sbliuli_dangxian");
				},
			},
			dangxian: {
				audio: "sbliuli",
				trigger: { player: "phaseBegin" },
				forced: true,
				charlotte: true,
				mark: true,
				marktext: "流",
				intro: { content: "回合开始时，执行一个额外的出牌阶段" },
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
				},
			},
		},
	},
	//刘表
	sbzishou: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			if (player === event.player) {
				return false;
			}
			if (!event.player.hasCards("he")) {
				return false;
			}
			return !event.player.hasAllHistory("sourceDamage", evt => evt.player === player) && !event.player.hasAllHistory("damage", evt => evt.source === player);
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			const result = await trigger.player
				.chooseCard({
					forced: true,
					prompt: `${get.translation(player)}对你发动了【自守】`,
					prompt2: "交给其一张牌",
					position: "he",
				})
				.forResult();
			if (!result.bool || !result.cards?.length) {
				return;
			}
			await trigger.player.give(result.cards, player);
		},
		ai: {
			threaten: 3,
		},
	},
	sbzongshi: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (!event.source || !event.source.isIn()) {
				return false;
			}
			return !player.getStorage("sbzongshi").includes(event.source);
		},
		forced: true,
		onremove: true,
		logTarget: "source",
		async content(event, trigger, player) {
			const discardEvent = trigger.source.chooseToDiscard({
				selectCard: trigger.source.countCards("h"),
				forced: true,
			});
			player.markAuto("sbzongshi", [trigger.source]);
			await discardEvent;
		},
		intro: {
			content: "已扒过目标：$",
		},
		ai: {
			threaten: 0.5,
			effect: {
				target(card, player, target, current) {
					if (player._sbzongshi_aiChecking) {
						return;
					}
					if (!get.tag(card, "damage")) {
						return;
					}
					const cards = player.getCards("h");
					if (!target.hasFriend()) {
						return;
					}
					player._sbzongshi_aiChecking = true;
					const value = cards.reduce((p, c) => {
						return p + get.value(c);
					}, 0);
					delete player._sbzongshi_aiChecking;
					if (cards.length > 5 || value > 5 * cards.length) {
						return [1, 0, 0, -cards.length / 2];
					}
					return [1, 0, 0, -0.5];
				},
			},
		},
	},
	//貂蝉
	sblijian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.countPlayer(current => current !== player) > 1;
		},
		filterCard: true,
		selectCard: [1, Infinity],
		position: "he",
		filterTarget: lib.filter.notMe,
		selectTarget() {
			return ui.selected.cards.length + 1;
		},
		filterOk() {
			return ui.selected.targets.length === ui.selected.cards.length + 1;
		},
		check(card) {
			const player = get.owner(card);
			const targets = lib.skill.sblijian.selectTargetAi(_status.event, player);
			if (ui.selected.cards.length < targets - 1) {
				if (player.hasSkill("sbbiyue")) {
					return 4 * targets - get.value(card);
				}
				return 6 + targets - get.value(card);
			}
			return 0;
		},
		selectTargetAi: (event, player) => {
			const cache = _status.event.getTempCache("sblijian", "targets");
			if (Array.isArray(cache)) {
				return cache.length;
			}
			let targets = [];
			const cards = [0];
			const sbbiyue = player.hasSkill("sbbiyue") ? Math.max(0, 3 - game.countPlayer2(current => current.hasHistory("damage"))) : 0;
			let alter = [null, 1, 1];
			let temp;
			for (const i of game.players) {
				if (player === i) {
					continue;
				}
				temp = get.effect(i, new lib.element.VCard({ name: "juedou", isCard: true }), i, i);
				if (temp) {
					const att = get.attitude(event.player, i);
					if ((!att && sbbiyue) || att * temp > 0) {
						targets.push([i, temp, att]);
					} else if (!alter[2]) {
						continue;
					} else if (!att || (att > 0 && temp > -15 && i.hp > 2) || (att < 0 && temp < 15)) {
						alter = [i, temp, att];
					}
				}
			}
			targets.sort((a, b) => {
				if (Boolean(a[2]) !== Boolean(b[2])) {
					return Math.abs(b[2]) - Math.abs(a[2]);
				}
				return Math.abs(b[1]) - Math.abs(a[1]);
			});
			if (targets.length < 2 && alter[0]) {
				targets.push(alter);
			}
			targets = targets.slice(
				0,
				1 +
					player.countCards("he", card => {
						if (lib.filter.cardDiscardable(card, player, "sblijian")) {
							cards.push(get.value(card));
							return true;
						}
						return false;
					})
			);
			cards.sort((a, b) => a - b);
			for (const [i, target] of targets.entries()) {
				if (Math.abs(target[1]) < cards[i] / (1 + sbbiyue)) {
					targets.splice(i, targets.length - i);
					break;
				}
			}
			if (targets.length < 2) {
				event.putTempCache("sblijian", "targets", []);
				return 0;
			}
			event.putTempCache("sblijian", "targets", targets);
			return targets.length;
		},
		multiline: true,
		async content(event, trigger, player) {
			const { targets, target } = event;
			const targetx = targets.slice().sortBySeat(target)[1];
			const card = { name: "juedou", isCard: true };
			if (target.canUse(card, targetx)) {
				await target.useCard({ card, targets: [targetx] });
			}
		},
		ai: {
			threaten: 3,
			order: 7,
			result: {
				player(player, target) {
					const targets = _status.event.getTempCache("sblijian", "targets");
					if (Array.isArray(targets)) {
						for (const arr of targets) {
							if (target === arr[0] && !arr[2]) {
								return 1;
							}
						}
					}
					return 0;
				},
				target(player, target) {
					const targets = _status.event.getTempCache("sblijian", "targets");
					if (Array.isArray(targets)) {
						for (const arr of targets) {
							if (target === arr[0]) {
								if (arr[1] * arr[2] < 0) {
									return get.sgn(arr[2]);
								}
								return arr[1];
							}
						}
					}
					return 0;
				},
			},
		},
	},
	sbbiyue: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		async content(event, trigger, player) {
			await player.draw(Math.min(4, game.countPlayer2(current => current.hasHistory("damage")) + 1));
		},
	},
	//陈宫
	sbmingce: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterCard: true,
		check(card) {
			return 8 - get.value(card);
		},
		filterTarget: lib.filter.notMe,
		selectTarget: 1,
		discard: false,
		lose: false,
		delay: false,
		onremove: true,
		group: "sbmingce_hit",
		async content(event, trigger, player) {
			const { cards } = event;
			const { target } = event;
			await player.give(cards, target);
			const choices = ["选项二"];
			const choiceList = [`失去1点体力，令${get.translation(player)}摸两张牌并获得1枚“策”`, "摸一张牌"];
			if (target.hp > 0) {
				choices.unshift("选项一");
			} else {
				choiceList[0] = `<span style="opacity:0.5">${choiceList[0]}</span>`;
			}
			const result = await target
				.chooseControl({ controls: choices })
				.set("choiceList", choiceList)
				.set("prompt", `${get.translation(player)}对你发动了【明策】，请选择一项`)
				.set("ai", () => {
					return _status.event.choice;
				})
				.set("choice", target.hp <= 0 || (((target.hp + target.countCards("hs", "tao") > 2 && get.attitude(target, player) > 0) || get.effect(target, { name: "losehp" }, target, target) > 0) && target.hp > 0) ? 0 : 1)
				.forResult();
			if (!result) {
				return;
			}
			if (result.control === "选项一") {
				await target.loseHp();
				await player.draw(2);
				player.addMark("sbmingce", 1);
			} else {
				await target.draw();
			}
		},
		marktext: "笨",
		intro: {
			name: "策(明策)",
			name2: "策",
			content: "mark",
		},
		ai: {
			result: {
				player: 0.5,
				target: 1,
			},
			order: 8.5,
			expose: 0.2,
		},
		subSkill: {
			hit: {
				audio: "sbmingce",
				trigger: { player: "phaseUseBegin" },
				filter(event, player) {
					return player.hasMark("sbmingce");
				},
				async cost(event, trigger, player) {
					const num = player.countMark("sbmingce");
					event.result = await player
						.chooseTarget({ prompt: get.prompt("sbmingce"), prompt2: `移去所有“策”，对一名其他角色造成${num}点伤害`, filterTarget: lib.filter.notMe })
						.set("ai", target => {
							const player = _status.event.player;
							const eff = get.damageEffect(target, player, player);
							let num = player.countMark("sbmingce");
							if (target.hasSkillTag("filterDamage", null, { player: player })) {
								num = 1;
							}
							return eff * num;
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					const num = player.countMark("sbmingce");
					player.removeMark("sbmingce", num);
					await target.damage(num);
				},
			},
		},
	},
	sbzhichi: {
		audio: 2,
		trigger: { player: "damageEnd" },
		forced: true,
		async content(event, trigger, player) {
			player.addTempSkill("sbzhichi_muteki");
		},
		subSkill: {
			muteki: {
				audio: "sbzhichi",
				trigger: { player: "damageBegin4" },
				charlotte: true,
				forced: true,
				group: "sbzhichi_egg",
				async content(event, trigger, player) {
					trigger.cancel();
				},
				mark: true,
				intro: { content: "我无敌啦！" },
				ai: {
					maixie: true,
					maixie_hp: true,
					nofire: true,
					nothunder: true,
					nodamage: true,
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "damage")) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			egg: {
				trigger: { player: "die" },
				charlotte: true,
				forced: true,
				silent: true,
				forceDie: true,
				async content(event, trigger, player) {
					player.chat("你是真滴牛批");
				},
			},
		},
	},
	//袁绍
	sbluanji: {
		audio: 2,
		enable: "phaseUse",
		trigger: { global: "respond" },
		viewAs: { name: "wanjian" },
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name === "chooseToUse") {
				return player.countCards("hs") > 1 && !player.hasSkill("sbluanji_used");
			}
			const evt = event.getParent(2);
			return (
				evt.name === "wanjian" &&
				evt.getParent().player === player &&
				event.player !== player &&
				player.getHistory("gain", evt => {
					return evt.getParent(2).name === "sbluanji";
				}).length < 3
			);
		},
		filterCard: true,
		selectCard: 2,
		position: "hs",
		prompt: "将两张手牌当【万箭齐发】使用",
		check(card) {
			const player = _status.event.player;
			const targets = game.filterPlayer(current => {
				return player.canUse("wanjian", current);
			});
			let num = 0;
			for (const target of targets) {
				let eff = get.sgn(get.effect(target, { name: "wanjian" }, player, player));
				if (target.hp === 1) {
					eff *= 1.5;
				}
				if (get.attitude(player, target) === 0 || target.group === "qun") {
					eff += 0.5;
				}
				num += eff;
			}
			if (!player.needsToDiscard(-1)) {
				if (targets.length >= 7) {
					if (num < 1) {
						return 0;
					}
				} else if (targets.length >= 5) {
					if (num < 0.5) {
						return 0;
					}
				}
			}
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			await player.draw();
		},
		async precontent(event, trigger, player) {
			player.addTempSkill("sbluanji_used", "phaseUseAfter");
		},
		ai: {
			threaten: 1.6,
		},
		subSkill: { used: { charlotte: true } },
	},
	sbxueyi: {
		audio: 2,
		trigger: { player: "useCardToTargeted" },
		filter(event, player) {
			return player.hasZhuSkill("sbxueyi") && event.target !== player && event.target.group === "qun";
		},
		zhuSkill: true,
		forced: true,
		usable: 2,
		logTarget: "target",
		async content(event, trigger, player) {
			await player.draw();
		},
		mod: {
			maxHandcard(player, num) {
				if (player.hasZhuSkill("sbxueyi")) {
					return num + 2 * game.countPlayer(current => player !== current && current.group === "qun");
				}
			},
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (player !== target && target && target.group === "qun" && player.hasZhuSkill("sbxueyi") && player.countSkill("sbxueyi") < 2) {
						return [1, 0.6];
					}
				},
			},
		},
	},
	//庞统
	sblianhuan: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			const filterCard = lib.skill.sblianhuan.filterCard;
			if (typeof filterCard !== "function") {
				return false;
			}
			return player.hasCards(lib.skill.sblianhuan.position, card => filterCard(card, player));
		},
		filterTarget(card, player, target) {
			if (player.hasSkill("sblianhuan_blocker")) {
				return false;
			}
			if (!ui.selected.cards.length) {
				return false;
			}
			const vcard = get.autoViewAs({ name: "tiesuo" }, [ui.selected.cards[0]]);
			return player.canUse(vcard, target);
		},
		filterCard: (card, player) => get.suit(card) === "club" && (!player.hasSkill("sblianhuan_blocker") || player.canRecast(card)),
		selectCard: 1,
		position: "hs",
		derivation: "sblianhuan_lv2",
		selectTarget() {
			const card = get.card();
			const player = get.player();
			if (player.hasSkill("sblianhuan_blocker")) {
				return 0;
			}
			if (card === undefined) {
				return 0;
			}
			/** @type { Select } */
			const range = [0, 2];
			game.checkMod(card, player, range, "selectTarget", player);
			return range;
		},
		filterOk() {
			const card = ui.selected.cards[0];
			if (!card) {
				return false;
			}
			if (get.position(card) === "s" && !ui.selected.targets.length) {
				return false;
			}
			return true;
		},
		check(card) {
			return 6 - get.value(card);
		},
		prompt() {
			const player = _status.event.player;
			const use = !player.hasSkill("sblianhuan_blocker");
			return `重铸一张♣手牌${use ? "；或将一张♣手牌当【铁索连环】使用" : ""}`;
		},
		group: ["sblianhuan_use", "sblianhuan_add", "sblianhuan_discard2"],
		multitarget: true,
		multiline: true,
		discard: false,
		lose: false,
		delay: false,
		viewAs: {
			name: "tiesuo",
		},
		prepare: () => void 0,
		async precontent(event, trigger, player) {
			const result = event.result;
			if (!result?.targets?.length) {
				delete result.card;
				return;
			}
			player.addTempSkill("sblianhuan_blocker", "phaseUseAfter");
		},
		async content(event, trigger, player) {
			await player.recast(event.cards);
		},
		ai: {
			order: 7,
			result: {
				player: 1,
				target(player, target) {
					if (player.hasSkill("sblianhuan_blocker")) {
						return 0;
					}
					return lib.card.tiesuo.ai.result.target(player, target);
				},
			},
		},
		subSkill: {
			blocker: { charlotte: true },
			use: {
				audio: "sblianhuan",
				trigger: { player: "useCard" },
				filter(event, player) {
					return event.card.name === "tiesuo" && !player.storage.sblianhuan;
				},
				check(event, player) {
					let eff = 0;
					const targets = event.targets.filter(target => !target.isLinked());
					for (const target of targets) {
						eff += get.attitude(player, target);
					}
					return eff < -1;
				},
				prompt2: "失去1点体力，然后当此牌指定第一个目标后，你随机弃置所有不处于连环状态的目标角色各一张手牌",
				async content(event, trigger, player) {
					await player.loseHp();
					if (!trigger.card.storage) {
						trigger.card.storage = {};
					}
					trigger.card.storage.sblianhuan = true;
					trigger._sblianhuan = true;
					player.addTempSkill("sblianhuan_discard", "phaseUseAfter");
				},
			},
			discard: {
				trigger: { global: "useCardToPlayered" },
				forced: true,
				locked: false,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return event.isFirstTarget && event.card.storage && event.card.storage.sblianhuan;
				},
				async content(event, trigger, player) {
					const targets = trigger.targets.filter(target => !target.isLinked());
					if (!targets.length) {
						return;
					}
					player.logSkill("sblianhuan_discard", targets);
					for (const target of targets) {
						const cards = target.getCards("h", card => lib.filter.cardDiscardable(card, player, "sblianhuan"));
						if (!cards.length) {
							continue;
						}
						player.line(target);
						await target.discard({ cards: [cards.randomGet()] });
					}
				},
			},
			add: {
				trigger: { player: "useCard2" },
				filter(event, player) {
					return event.card.name === "tiesuo" && player.storage.sblianhuan && game.hasPlayer(current => !event.targets.includes(current) && player.canUse(event.card, current));
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget({
							prompt: get.prompt("sblianhuan_add"),
							prompt2: `为${get.translation(trigger.card)}额外指定任意个目标`,
							selectTarget: [1, Infinity],
							filterTarget: (card, player, target) => !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target),
							ai: target => get.effect(target, _status.event.card, _status.event.player, _status.event.player),
						})
						.set("sourcex", trigger.targets)
						.set("card", trigger.card)
						.forResult();
				},
				async content(event, trigger, player) {
					if (!event.isMine() && !event.isOnline()) {
						await game.delayx();
					}
					trigger.targets.addArray(event.targets);
				},
			},
			discard2: {
				trigger: { player: "useCardToPlayered" },
				forced: true,
				locked: false,
				popup: false,
				filter(event, player) {
					return event.isFirstTarget && event.card.name === "tiesuo" && player.storage.sblianhuan && !event.getParent()._sblianhuan;
				},
				async content(event, trigger, player) {
					const targets = trigger.targets.filter(target => !target.isLinked());
					if (!targets.length) {
						return;
					}
					player.logSkill("sblianhuan_discard2", targets);
					for (const target of targets) {
						const cards = target.getCards("h", card => lib.filter.cardDiscardable(card, player, "sblianhuan"));
						if (!cards.length) {
							continue;
						}
						player.line(target);
						await target.discard({ cards: [cards.randomGet()] });
					}
				},
			},
		},
	},
	sbniepan: {
		audio: 2,
		enable: "chooseToUse",
		mark: true,
		skillAnimation: true,
		limited: true,
		animationColor: "orange",
		filter(event, player) {
			return event.type === "dying" && player === event.dying;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.discard({ cards: player.getCards("hej") });
			await player.draw(2);
			if (player.hp < 2) {
				await player.recover(2 - player.hp);
			}
			await player.turnOver(false);
			await player.link(false);
			player.storage.sblianhuan = true;
			game.log(player, "修改了", "#g【连环】");
		},
		ai: {
			order: 1,
			skillTagFilter(player, arg, target) {
				if (player !== target || player.storage.sbniepan) {
					return false;
				}
			},
			save: true,
			result: {
				player(player) {
					if (player.hp <= 0) {
						return 10;
					}
					return 0;
				},
			},
			threaten(player, target) {
				if (!target.storage.sbniepan) {
					return 0.6;
				}
			},
		},
	},
	//法正
	sbxuanhuo: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		group: "sbxuanhuo_rob",
		filterTarget(card, player, target) {
			return !target.hasMark("sbxuanhuo_mark") && player !== target;
		},
		filterCard: true,
		position: "he",
		discard: false,
		lose: false,
		delay: false,
		onremove(player) {
			delete player.storage.sbxuanhuo;
			player.unmarkSkill("sbxuanhuo");
		},
		check(card) {
			return 6.5 - get.value(card);
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const cards = event.cards;
			await player.give(cards, target);
			if (player.storage[event.name] && player.storage[event.name][target.playerid]) {
				delete player.storage[event.name][target.playerid];
			}
			target.addMark(`${event.name}_mark`);
			const history = target.getAllHistory("lose");
			if (history.length) {
				history[history.length - 1][`${event.name}_mark`] = true;
			}
		},
		getNum(current, skill, mark) {
			let num = 0;
			const history = current.getAllHistory("lose");
			if (history.length) {
				for (const evt of history.slice().reverse()) {
					if (evt[mark]) {
						break;
					}
					if (typeof skill === "string") {
						if (evt.getParent(2).name === skill || evt.getParent(3).name === skill) {
							num += evt.cards2.length;
						}
					} else {
						const evtx = evt.getParent();
						const player = skill;
						if (evtx.name === "gain") {
							const cards = evtx.cards;
							if (evtx.player === player && cards.length > 0) {
								num += cards.length;
							}
						} else if (evtx.name === "loseAsync") {
							if (evtx.type !== "gain" || evtx.giver) {
								return false;
							}
							const cards = evtx.getl(current).cards2;
							const cardsx = evtx.getg(player);
							if (cardsx.length > 0) {
								num += cardsx.length;
							}
						}
					}
				}
			}
			return num;
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					return -Math.sqrt(Math.max(target.hp, 1));
				},
			},
		},
		marktext: "惑",
		intro: {
			content(storage, player) {
				if (!storage || get.is.empty(storage)) {
					return "未得到过牌";
				}
				const map = _status.connectMode ? lib.playerOL : game.playerMap;
				let str = "已得到";
				for (const i in storage) {
					str += `${get.translation(map[i])}的${get.cnNumber(storage[i])}张牌、`;
				}
				return str.slice(0, -1);
			},
		},
		subSkill: {
			mark: {
				marktext: "眩",
				intro: {
					name: "眩惑",
					name2: "眩",
					markcount: () => 0,
					content: "已获得“眩”标记",
				},
			},
			rob: {
				audio: "sbxuanhuo",
				trigger: {
					global: ["gainAfter", "loseAsyncAfter"],
				},
				filter(event, player, name, target) {
					return target?.isIn();
				},
				getIndex(event, player) {
					const evt = event.getParent("phaseDraw");
					if (evt?.name === "phaseDraw") {
						return false;
					}
					return game
						.filterPlayer(current => {
							if (!event.getg(current).length || !current.hasMark("sbxuanhuo_mark")) {
								return false;
							}
							if (evt?.player === current) {
								return false;
							}
							if (lib.skill.sbxuanhuo.getNum(current, "sbxuanhuo_rob", "sbxuanhuo_mark") >= 5) {
								return false;
							}
							return current.hasCard(card => lib.filter.canBeGained(card, current, player), "he");
						})
						.sortBySeat();
				},
				logTarget(event, player, triggername, target) {
					return target;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const target = event.targets[0];
					const hs = target.getCards("h", card => lib.filter.canBeGained(card, target, player));
					if (hs.length) {
						await player.gain({ cards: [hs.randomGet()], source: target, animate: "giveAuto" });
						if (!player.storage.sbxuanhuo) {
							player.storage.sbxuanhuo = {};
						}
						player.storage.sbxuanhuo[target.playerid] = lib.skill.sbxuanhuo.getNum(target, "sbxuanhuo_rob", "sbxuanhuo_mark");
						player.markSkill("sbxuanhuo");
					}
				},
			},
		},
	},
	sbenyuan: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player, name, target) {
			return target?.isIn();
		},
		getIndex(event, player) {
			return game.filterPlayer(target => target.hasMark("sbxuanhuo_mark")).sortBySeat();
		},
		logTarget(event, player, triggername, target) {
			return target;
		},
		logAudio: index => (typeof index === "number" ? `sbenyuan${index}.mp3` : 2),
		direct: true,
		locked: true,
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.clearMark("sbxuanhuo_mark");
			for (const current of game.players) {
				const storage = current.storage.sbxuanhuo;
				if (storage && storage[target.playerid]) {
					delete storage[target.playerid];
				}
				if (storage && get.is.empty(storage)) {
					delete current.storage.sbxuanhuo;
					current.unmarkSkill("sbxuanhuo");
				}
			}
			const num = lib.skill.sbxuanhuo.getNum(target, player, "sbxuanhuo_mark");
			player.logSkill("sbenyuan", target, null, null, [num >= 3 ? 1 : 2]);
			if (num >= 3) {
				const num = Math.min(player.countCards("he"), 3);
				if (num) {
					await player.chooseToGive({ target, prompt: `恩怨：交给${get.translation(target)}${get.cnNumber(num)}张牌`, forced: true, selectCard: num, position: "he" });
				}
			} else {
				await target.loseHp();
				await player.recover();
			}
		},
		ai: {
			combo: "sbxuanhuo",
		},
	},
	//姜维
	sbtiaoxin: {
		audio: 4,
		enable: "phaseUse",
		usable: 1,
		logAudio: index => (typeof index === "number" ? `sbtiaoxin${index}.mp3` : 2),
		filter(event, player) {
			return game.hasPlayer(current => current !== player);
		},
		chooseButton: {
			dialog(event, player) {
				const choiceList = [
					["juedou", "将一张手牌当作【决斗】对你使用，否则本回合不能使用或打出牌"],
					["sha", "对你使用一张【杀】，否则你弃置其一张牌"],
					["all", "背水：本回合你与其受到的伤害+1"],
				];
				return ui.create.dialog("挑衅：选择一项令一名其他角色执行", [choiceList, "textbutton"], "hidden");
			},
			check(button) {
				const event = get.event();
				const player = get.player();
				const effect = get.info("sbtiaoxin").getEffect(event, player);
				return effect.indexOf(button.link);
			},
			backup(links, player) {
				return {
					audio: "sbtiaoxin",
					control: links[0],
					filterTarget: lib.filter.notMe,
					logAudio: (event, player) => {
						const control = get.info("sbtiaoxin_backup")?.control;
						return control === "all" ? ["sbtiaoxin3.mp3", "sbtiaoxin4.mp3"] : 2;
					},
					async content(event, trigger, player) {
						const { control } = get.info(event.name);
						const { target } = event;
						if (control === "all") {
							player.popup("背水", "fire");
							player.addTempSkill("sbtiaoxin_damage");
							player.addMark("sbtiaoxin_damage", 1, false);
							target.addTempSkill("sbtiaoxin_damage");
							target.addMark("sbtiaoxin_damage", 1, false);
						}
						if (control !== "sha") {
							const next = target.chooseToUse();
							next.set("openskilldialog", `挑衅：是否将一张手牌当做决斗对${get.translation(player)}使用？`);
							next.set("norestore", true);
							next.set("_backupevent", "sbtiaoxin_backupx");
							next.set("targetRequired", true);
							next.set("complexTarget", true);
							next.set("sourcex", player);
							next.set("custom", {
								add: {},
								replace: { window() {} },
							});
							next.set("filterTarget", (card, player, target) => {
								const { sourcex } = get.event();
								if (target !== sourcex && !ui.selected.targets.includes(sourcex)) {
									return false;
								}
								return lib.filter.targetEnabled(card, player, target);
							});
							next.backup("sbtiaoxin_backupx");
							const result = await next.forResult();
							if (!result?.bool) {
								target.addTempSkill("sbtiaoxin_xiongluan");
							}
						}
						if (control !== "juedou") {
							const result = await target
								.chooseToUse({
									filterCard: (card, player, event) => {
										if (get.name(card) !== "sha") {
											return false;
										}
										return lib.filter.filterCard(card, player, event);
									},
									prompt: `挑衅：对${get.translation(player)}使用一张杀，或被其弃置一张牌`,
								})
								.set("targetRequired", true)
								.set("complexTarget", true)
								.set("filterTarget", (card, player, target) => {
									const { sourcex } = get.event();
									if (target !== sourcex && !ui.selected.targets.includes(sourcex)) {
										return false;
									}
									return lib.filter.targetEnabled(card, player, target);
								})
								.set("sourcex", player)
								.forResult();
							if (!result?.bool) {
								await player.discardPlayerCard({ target, position: "he", forced: true });
							}
						}
					},
					ai1: () => 1,
					ai2(target) {
						const player = get.player();
						const { control } = get.info("sbtiaoxin_backup");
						const val = get.info("sbtiaoxin").ai.result.player(player, target) + 1;
						let eff = get.effect(target, { name: "juedou" }, player, player) - target.countCards("h") / 4;
						if (control === "sha") {
							eff = 0;
						}
						if (control !== "juedou") {
							eff += val;
						}
						return eff;
					},
				};
			},
			prompt(links, player) {
				const list = ["1.其需将一张手牌当作【决斗】对你使用，否则本回合不能使用或打出牌", "2.其需对你使用一张【杀】，否则你弃置其一张牌", "3.本回合你与其受到的伤害+1"];
				const control = links[0];
				return `###挑衅：选择一名其他角色###${control === "all" ? list.join("<br>") : list[control === "sha" ? 1 : 0].slice(2)}`;
			},
		},
		getEffect(event, player) {
			if (!event.tiaoxinEffect) {
				const targets1 = game.filterPlayer(current => {
					if (get.attitude(player, current) >= 0) {
						return false;
					}
					return get.effect(current, { name: "juedou" }, player, player) > 0 || current.countCards("h") <= player.countCards("hs", "sha");
				});
				const targets2 = game.filterPlayer(current => {
					return get.info("sbtiaoxin").ai.result.player(player, current) > -1;
				});
				const result = ["sha"];
				result[targets1.length > targets2.length ? "push" : "unshift"]("juedou");
				const bool = targets1.length && targets2.length && targets1.containsSome(...targets2);
				result[bool ? "push" : "unshift"]("all");
				event.tiaoxinEffect = result;
				return result;
			}
			return event.tiaoxinEffect;
		},
		ai: {
			threaten: 1.2,
			order: 4,
			expose: 0.2,
			result: {
				player(player, target) {
					if (!target) {
						return game.countPlayer(current => {
							if (get.attitude(player, current) >= 0) {
								return false;
							}
							if (!current.countCards("h")) {
								return true;
							}
							return get.info("sbtiaoxin").ai.result.player(player, current) > -1;
						});
					}
					if (!target.canUse("sha", player)) {
						return 0;
					}
					if (target.countCards("h") === 0) {
						return 0;
					}
					if (target.countCards("h") === 1) {
						return -0.1;
					}
					if (player.hp <= 2) {
						return -2;
					}
					if (player.countCards("h", "shan") === 0) {
						return -1;
					}
					return -0.5;
				},
			},
		},
		subSkill: {
			backup: {},
			damage: {
				trigger: {
					player: "damageBegin3",
				},
				charlotte: true,
				filter(event, player) {
					return player.countMark("sbtiaoxin_damage");
				},
				async cost(event) {
					event.result = {
						bool: true,
						skill_popup: false,
					};
				},
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
				mark: true,
				onremove: true,
				intro: {
					content: "本回合受到的伤害+$",
				},
			},
			backupx: {
				filterCard(card) {
					return get.itemtype(card) === "card";
				},
				viewAs: {
					name: "juedou",
				},
				selectCard: 1,
				position: "hs",
				ai1(card) {
					return 7 - get.value(card);
				},
				log: false,
			},
			xiongluan: {
				charlotte: true,
				mark: true,
				marktext: "衅",
				mod: {
					cardEnabled2(card) {
						if (get.position(card) === "h") {
							return false;
						}
					},
				},
				intro: {
					content: "不能使用或打出手牌",
				},
			},
		},
	},
	sbzhiji: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "fire",
		filter(event, player) {
			return player.countCards("h") <= player.hp;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp();
			await player.recover();
			await player.draw(2);
			await player.addSkills("sbbeifa");
		},
		derivation: "sbbeifa",
	},
	sbbeifa: {
		audio: 5,
		chargeSkill: 9,
		logAudio: index => (typeof index === "number" ? `sbbeifa${index}.mp3` : 2),
		init(player, skill) {
			player.addCharge(3, false);
		},
		onremove: true,
		intro: {
			content: "已记录牌名：$",
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			const cards = event.sbbeifa;
			return cards?.length > 0 && player.countCards("hs") > 0;
		},
		onChooseToUse(event) {
			if (game.online || event.sbbeifa) {
				return;
			}
			const player = event.player;
			const list = get.inpileVCardList(list => {
				if (!["basic", "trick", "delay"].includes(list[0])) {
					return false;
				}
				if (player.getStorage("sbbeifa").includes(list[2])) {
					return false;
				}
				const info = lib.card[list[2]];
				if (!info || info.notarget) {
					return false;
				}
				if (get.cardNameLength(list[2]) > player.countCharge()) {
					return false;
				}
				return (
					!player.canUse(list[2], player, null, event) &&
					game.hasPlayer(current => {
						return player.canUse(list[2], current, null, event);
					})
				);
			});
			event.set("sbbeifa", list);
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("北伐", [event.sbbeifa, "vcard"], "hidden");
			},
			check(button) {
				const player = _status.event.player;
				const card = { name: button.link[2] };
				return player.getUseValue(card);
			},
			backup(links, player) {
				return {
					audio: "sbbeifa",
					logAudio: () => "sbbeifa",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					ai1: card => 7 - get.value(card),
					async precontent(event, trigger, player) {
						const name = event.result.card.name;
						player.logSkill("sbbeifa", null, null, null, [get.rand(3, 4)]);
						player.addSkill("sbbeifa_used");
						player.markAuto("sbbeifa", name);
						player.removeCharge(get.cardNameLength(name));
						await event.trigger("sbbeifaRecord");
					},
					filterCard: true,
					position: "hs",
					popname: true,
					log: false,
				};
			},
			prompt(links, player) {
				return `将一张手牌当做${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}使用`;
			},
		},
		ai: {
			order: 6,
			result: { player: 1 },
		},
		group: ["sbbeifa_backflow", "sbbeifa_benghuai"],
		subSkill: {
			used: {
				charlotte: true,
				onremove(player, skill) {
					player.setStorage("sbbeifa", [], true);
				},
			},
			backup: {},
			benghuai: {
				audio: ["sbbeifa5.mp3"],
				trigger: {
					player: ["damageEnd", "sbbeifaRecord"],
				},
				forced: true,
				locked: false,
				filter(event, player) {
					if (event.name === "damage") {
						return player === _status.currentPhase;
					}
					return player.getStorage("sbbeifa")?.length === 9 - player.countMark("sbbeifa_benghuai");
				},
				async content(event, trigger, player) {
					player.removeSkill("sbbeifa_used");
					if (player.countMark(event.name) < 8) {
						player.addMark(event.name, 1, false);
						game.log(player, "因", "#g【北伐】", "提供的蓄力值上限-1");
						if (player.countCharge(true) < 0) {
							player.removeCharge(-player.countCharge(true));
						}
					}
				},
				mod: {
					maxCharge(player, max) {
						return max - player.countMark("sbbeifa_benghuai");
					},
				},
			},
			backflow: {
				audio: ["sbbeifa1.mp3", "sbbeifa2.mp3"],
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "useCard", "respond"],
				},
				forced: true,
				locked: false,
				filter(event, player) {
					if (player !== _status.currentPhase) {
						return false;
					}
					if (event.name.indexOf("lose") === 0) {
						return (
							event.type === "discard" &&
							game.hasPlayer2(current => {
								return event.getl(current)?.cards2?.length;
							})
						);
					}
					return get.is.convertedCard(event.card) && event.cards?.length;
				},
				async content(event, trigger, player) {
					let num = 0;
					if (trigger.name.indexOf("lose") === 0) {
						game.filterPlayer2(
							current => {
								num += trigger.getl(current).cards2.length;
							},
							null,
							true
						);
					} else {
						num += trigger.cards.length;
					}
					player.addCharge(num);
				},
			},
		},
	},
	//刘备
	sbrende: {
		audio: 3,
		enable: ["chooseToUse", "chooseToRespond"],
		maxNum: 8,
		filter(event, player) {
			if (event.type === "wuxie") {
				return false;
			}
			const storage = player.getStorage("sbrende_used");
			if (
				event.type === "phase" &&
				player.countCards("h") &&
				game.hasPlayer(current => {
					return !storage.includes(current) && current !== player;
				})
			) {
				return true;
			}
			if (player.countMark("sbrende") < 2 || storage.includes("card")) {
				return false;
			}
			for (const name of lib.inpile) {
				if (get.type(name) !== "basic") {
					continue;
				}
				const card = { name: name, isCard: true };
				if (event.filterCard(card, player, event)) {
					return true;
				}
				if (name === "sha") {
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
		group: ["sbrende_gain"],
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog("仁德");
				const storage = player.getStorage("sbrende_used");
				const list = [];
				const cards = [];
				dialog.direct = true;
				if (event.type === "phase" && player.hasCard(() => true, "he") && game.hasPlayer(current => !storage.includes(current) && current !== player)) {
					dialog.add([[["give", "交给其他角色牌"]], "tdnodes"]);
				}
				if (player.countMark("sbrende") > 1 && !storage.includes("card")) {
					cards.addArray(
						get.inpileVCardList(info => {
							if (info[0] !== "basic") {
								return false;
							}
							const card = { name: info[2], nature: info[3], isCard: true };
							return event.filterCard(card, player, event);
						})
					);
					if (cards.length) {
						dialog.addText("视为使用基本牌");
						dialog.add([cards, "vcard"]);
					}
				}
				return dialog;
			},
			check(button, player) {
				if (typeof button.link === "string") {
					return 0.1;
				}
				if (_status.event.getParent().type !== "phase") {
					return 1;
				}
				return _status.event.player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				const isUse = links[0] !== "give";
				const backup = get.copy(lib.skill[`sbrende_${isUse ? "use" : "give"}`]);
				if (isUse) {
					const card = links[0];
					backup.viewAs = { name: card[2], nature: card[3], isCard: true };
				}
				return backup;
			},
			prompt(links, player) {
				const isUse = links[0] !== "give";
				return isUse ? `移去2枚“仁望”，视为使用或打出${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}` : `###仁德###出牌阶段每名角色限一次。你可以将任意张牌交给一名其他角色，然后你获得等量“仁望”标记（至多为${lib.skill.sbrende.maxNum}）`;
			},
		},
		hiddenCard(player, name) {
			return get.type(name) === "basic" && player.countMark("sbrende") > 1 && !player.hasSkill("sbrende_used");
		},
		marktext: "仁",
		intro: {
			name: "仁望",
			name2: "仁望",
			content: "mark",
		},
		ai: {
			respondSha: true,
			respondShan: true,
			save: true,
			skillTagFilter(player) {
				return player.countMark("sbrende") > 1 && !player.getStorage("sbrende_used").includes("card");
			},
			order(item, player) {
				if (_status.event.type === "phase" && lib.skill.sbzhangwu.ai.result.player(player) > 0) {
					return 7.1;
				}
				return 4;
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
			used: {
				charlotte: true,
				onremove: true,
			},
			use: {
				audio: "sbrende",
				filterCard: () => false,
				selectCard: -1,
				popname: true,
				log: false,
				async precontent(event, trigger, player) {
					player.logSkill("sbrende");
					player.removeMark("sbrende", 2);
					player.addTempSkill("sbrende_used");
					player.markAuto("sbrende_used", "card");
				},
			},
			give: {
				audio: "sbrende",
				filterCard: true,
				selectCard: [1, Infinity],
				allowChooseAll: true,
				position: "he",
				discard: false,
				lose: false,
				delay: false,
				filterTarget(card, player, target) {
					if (player.getStorage("sbrende_used").includes(target)) {
						return false;
					}
					return player !== target;
				},
				selectTarget: 1,
				prompt(event) {
					return `出牌阶段每名角色限一次。你可以将任意张牌交给一名其他角色，然后你获得等量“仁望”标记（至多为${lib.skill.sbrende.maxNum}）`;
				},
				ai1(card) {
					const player = get.owner(card);
					if (ui.selected.cards.length && ui.selected.cards[0].name === "du") {
						return 0;
					}
					if (ui.selected.cards.length + player.countMark("sbrende") > lib.skill.sbrende.maxNum) {
						return 0;
					}
					if (!ui.selected.cards.length && card.name === "du") {
						return 20;
					}
					if (ui.selected.cards.length >= Math.max(2, player.countCards("he") - player.hp)) {
						return 0;
					}
					if (player.countCards("he") <= 1) {
						const players = game.filterPlayer();
						for (const current of players) {
							if (current.hasSkill("haoshi") && !current.isTurnedOver() && !current.hasJudge("lebu") && get.attitude(player, current) >= 3 && get.attitude(current, player) >= 3) {
								return 11 - get.value(card);
							}
						}
						if (player.countCards("he") > player.hp) {
							return 10 - get.value(card);
						}
						if (player.countCards("he") > 2) {
							return 6 - get.value(card);
						}
						return -1;
					}
					return 18 - (ui.selected.cards.length + player.countMark("sbrende")) - get.value(card);
				},
				async content(event, trigger, player) {
					const { cards, target } = event;
					player.addTempSkill("sbrende_used");
					player.markAuto("sbrende_used", [target]);
					player.markAuto("sbrende_givenx", [target]);
					player
						.when({
							global: "phaseUseAfter",
						})
						.step(async (event, trigger, player) => {
							player.unmarkAuto("sbrende_used", [target]);
						});
					await player.give(cards, target);
					const num = Math.min(lib.skill.sbrende.maxNum - player.countMark("sbrende"), cards.length);
					if (num > 0) {
						player.addMark("sbrende", num);
					}
				},
				ai2(target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					if (ui.selected.cards.length && ui.selected.cards[0].name === "du") {
						if (target.hasSkillTag("nodu")) {
							return 0;
						}
						return -10;
					}
					if (target.hasJudge("lebu")) {
						return 0;
					}
					const nh = target.countCards("h");
					return Math.max(1, 5 - nh) * get.attitude(get.player(), target);
				},
			},
			gain: {
				audio: "sbrende",
				trigger: { player: "phaseUseBegin" },
				forced: true,
				locked: false,
				filter(event, player) {
					return player.countMark("sbrende") < lib.skill.sbrende.maxNum;
				},
				async content(event, trigger, player) {
					const num = Math.min(lib.skill.sbrende.maxNum - player.countMark("sbrende"), 2);
					if (num > 0) {
						player.addMark("sbrende", num);
					}
				},
			},
		},
	},
	sbzhangwu: {
		audio: 2,
		enable: "phaseUse",
		skillAnimation: "epic",
		animationColor: "orange",
		limited: true,
		filter(event, player) {
			if (game.roundNumber <= 1) {
				return false;
			}
			if (!game.hasPlayer(current => lib.skill.sbzhangwu.filterTarget(null, player, current))) {
				return false;
			}
			return true;
		},
		filterTarget(card, player, target) {
			if (target === player) {
				return false;
			}
			return player.getStorage("sbrende_givenx").includes(target);
		},
		manualConfirm: true,
		selectTarget: -1,
		multiline: true,
		async content(event, trigger, player) {
			const { target } = event;
			player.awakenSkill(event.name);
			const num = Math.min(game.roundNumber - 1, 3);
			const cards = target.getCards("he");
			if (!cards.length) {
				return;
			}
			let result = { bool: true, cards };
			if (cards.length > num) {
				result = await target
					.chooseCard({
						prompt: `章武：交给${get.translation(player)}${get.cnNumber(num)}张牌`,
						forced: true,
						position: "he",
						selectCard: num,
					})
					.forResult();
			}
			if (!result.bool) {
				return;
			}
			await target.give(result.cards, player);
		},
		async contentAfter(event, trigger, player) {
			await player.recover(3);
			player.removeSkills("sbrende");
			await game.delayx();
		},
		ai: {
			order: 7,
			combo: "sbrende",
			result: {
				player(player, target) {
					const targets = game.filterPlayer(current => lib.skill.sbzhangwu.filterTarget(null, player, current));
					if (!targets.length) {
						return 0;
					}
					let eff = 0;
					for (const target of targets) {
						eff += get.effect(target, { name: "shunshou_copy2" }, player, player);
					}
					eff += 15 - 5 * Math.max(0, 3 - player.getDamagedHp());
					return eff > 15 ? 1 : 0;
				},
			},
		},
	},
	sbjijiang: {
		audio: 2,
		trigger: { player: "phaseUseEnd" },
		zhuSkill: true,
		popup: false,
		filter(event, player) {
			if (!player.hasZhuSkill("sbjijiang")) {
				return false;
			}
			return game.hasPlayer(current => {
				if (current.group !== "shu" || player === current || current.hp < player.hp) {
					return false;
				}
				return game.hasPlayer(currentx => current.inRange(currentx));
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({ prompt: get.prompt2(event.skill), selectTarget: 2 })
				.set("filterTarget", (card, player, target) => {
					if (!ui.selected.targets.length) {
						return target.group === "shu" && target.hp >= player.hp && target !== player;
					}
					const current = ui.selected.targets[0];
					return current.inRange(target);
				})
				.set("targetprompt", ["进行选择", "出杀对象"])
				.set("multitarget", true)
				.set("ai", target => {
					const player = _status.event.player;
					if (ui.selected.targets.length) {
						const current = ui.selected.targets[0];
						return get.effect(target, new lib.element.VCard({ name: "sha", isCard: true }), current, player);
					}
					const curs = game.filterPlayer(current => {
						return target !== current && target.inRange(current) && target.canUse({ name: "sha", isCard: true }, current, false);
					});
					if (!curs.length) {
						const att = get.attitude(player, target);
						if (att >= 0) {
							return 0;
						}
						return -att * get.threaten(target, player);
					}
					return curs.reduce((max, i) => Math.max(max, get.effect(i, new lib.element.VCard({ name: "sha", isCard: true }), target, player)), -1);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			player.logSkill("sbjijiang", targets, false);
			player.line2(targets);
			const choiceList = [`视为对${get.translation(targets[1])}使用一张【杀】`, "你的下一个出牌阶段开始前，跳过此阶段"];
			let result;
			if (!targets[0].canUse({ name: "sha", isCard: true }, targets[1], false)) {
				result = { index: 1 };
			} else {
				result = await targets[0]
					.chooseControl()
					.set("choiceList", choiceList)
					.set("ai", () => {
						return _status.event.choice;
					})
					.set("choice", get.effect(targets[1], { name: "sha" }, targets[0], targets[0]) > get.effect(targets[0], { name: "lebu" }, targets[0], targets[0]) ? 0 : 1)
					.forResult();
			}
			if (result.index === 0) {
				await targets[0].useCard({ card: { name: "sha", isCard: true }, targets: [targets[1]], addCount: false });
			} else {
				targets[0].addSkill("sbjijiang_skip");
			}
		},
		subSkill: {
			skip: {
				trigger: { player: "phaseUseBefore" },
				charlotte: true,
				forced: true,
				async content(event, trigger, player) {
					trigger.cancel();
					player.removeSkill("sbjijiang_skip");
				},
			},
		},
	},
	//赵云
	sblongdan: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		chargeSkill: 3,
		init(player) {
			player.addCharge(1, false);
		},
		filter(event, player) {
			if (event.type === "wuxie" || !player.countCharge()) {
				return false;
			}
			const marked = player.hasSkill("sblongdan_mark", null, null, false);
			for (const name of lib.inpile) {
				if (!marked && name !== "sha" && name !== "shan") {
					continue;
				}
				if (get.type(name) !== "basic") {
					continue;
				}
				if (player.hasCard(lib.skill.sblongdan.getFilter(name, player), "hs")) {
					if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						return true;
					}
					if (marked && name === "sha") {
						for (const nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
								return true;
							}
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				const marked = player.hasSkill("sblongdan_mark", null, null, false);
				for (const name of lib.inpile) {
					if (!marked && name !== "sha" && name !== "shan") {
						continue;
					}
					if (get.type(name) !== "basic") {
						continue;
					}
					if (player.hasCard(lib.skill.sblongdan.getFilter(name, player), "hs")) {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
							list.push(["基本", "", name]);
						}
						if (marked && name === "sha") {
							for (const nature of lib.inpile_nature) {
								if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
									list.push(["基本", "", name, nature]);
								}
							}
						}
					}
				}
				const dialog = ui.create.dialog("龙胆", [list, "vcard"], "hidden");
				dialog.direct = true;
				return dialog;
			},
			check(button) {
				if (_status.event.getParent().type !== "phase") {
					return 1;
				}
				const player = _status.event.player;
				const card = { name: button.link[2], nature: button.link[3] };
				if (card.name === "jiu" && Math.min(player.countMark("charge"), player.countCards("h", { type: "basic" })) < 2) {
					return 0;
				}
				return player.getUseValue(card, null, true);
			},
			backup(links, player) {
				return {
					audio: "sblongdan",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					filterCard: lib.skill.sblongdan.getFilter(links[0][2], player),
					position: "he",
					popname: true,
					check(card) {
						return 6 / Math.max(1, get.value(card));
					},
					async precontent(event, trigger, player) {
						player.removeCharge();
						player.addTempSkill("sblongdan_draw");
					},
				};
			},
			prompt(links, player) {
				const marked = player.hasSkill("sblongdan_mark", null, null, false);
				const card = {
					name: links[0][2],
					nature: links[0][3],
					isCard: true,
				};
				if (marked) {
					return `将一张基本牌当做${get.translation(card)}使用`;
				}
				return `将一张${card.name === "sha" ? "闪" : "杀"}当做${get.translation(card)}使用`;
			},
		},
		hiddenCard(player, name) {
			if (get.type(name) !== "basic" || !player.countCharge()) {
				return false;
			}
			const marked = player.hasSkill("sblongdan_mark", null, null, false);
			if (!marked && name !== "sha" && name !== "shan") {
				return false;
			}
			return player.hasCard(lib.skill.sblongdan.getFilter(name, player), "hs");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				return lib.skill.sblongdan.hiddenCard(player, tag === "respondSha" ? "sha" : "shan");
			},
			order: 9,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		getFilter(name, player) {
			if (!player.hasSkill("sblongdan_mark", null, null, false)) {
				if (name === "sha") {
					return { name: "shan" };
				}
				if (name === "shan") {
					return { name: "sha" };
				}
				return () => false;
			}
			return { type: "basic" };
		},
		group: "sblongdan_charge",
		derivation: "sblongdan_shabi",
		onremove(player) {
			player.removeSkill("sblongdan_mark");
		},
		subSkill: {
			backup: {},
			mark: { charlotte: true },
			draw: {
				charlotte: true,
				trigger: { player: ["useCardAfter", "respondAfter"] },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.skill === "sblongdan_backup";
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
			charge: {
				audio: "sblongdan",
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				filter(event, player) {
					return player.countCharge(true);
				},
				async content(event, trigger, player) {
					player.addCharge();
				},
			},
		},
	},
	sbjizhu: {
		audio: 3,
		logAudio: () => 2,
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({ filterTarget: lib.filter.notMe, prompt: get.prompt(event.skill), prompt2: "和一名其他角色进行“协力”" })
				.set("ai", target => {
					return get.threaten(target) * Math.sqrt(1 + target.countCards("h")) * (target.isTurnedOver() || target.hasJudge("lebu") ? 0.1 : 1);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player
				.chooseCooperationFor(target, "sbjizhu")
				.set("ai", button => {
					let base = 0;
					switch (button.link) {
						case "cooperation_damage":
							base = 0.1;
							break;
						case "cooperation_draw":
							base = 0.6;
							break;
						case "cooperation_discard":
							base = 0.1;
							break;
						case "cooperation_use":
							base = 0.6;
							break;
					}
					return base + Math.random();
				})
				.forResult();
			player.addAdditionalSkill("cooperation", "sbjizhu_effect");
			await game.delayx();
		},
		subSkill: {
			effect: {
				audio: "sbjizhu3.mp3",
				charlotte: true,
				trigger: { global: "phaseJieshuBegin" },
				forced: true,
				logTarget: "player",
				filter(event, player) {
					return player.checkCooperationStatus(event.player, "sbjizhu") && ["sblongdan", "jdlongdan"].some(skill => player.hasSkill(skill, null, null, false));
				},
				async content(event, trigger, player) {
					game.log(player, "和", trigger.player, "的协力成功");
					player.addTempSkill("sblongdan_mark", { player: "phaseAfter" });
					await game.delayx();
				},
			},
		},
		ai: {
			combo: "sblongdan",
		},
	},
	//张飞
	sbpaoxiao: {
		audio: 2,
		mod: {
			cardUsable(card) {
				if (card.name === "sha") {
					return Infinity;
				}
			},
			targetInRange(card, player, target) {
				if (card.name === "sha" && player.getEquips(1).length > 0) {
					return true;
				}
			},
		},
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			if (event.card.name !== "sha") {
				return false;
			}
			const evt = event.getParent("phaseUse");
			if (!evt || evt.player !== player) {
				return false;
			}
			return player.hasHistory("useCard", evtx => evtx !== event && evtx.card.name === "sha" && evtx.getParent("phaseUse") === evt, event);
		},
		async content(event, trigger, player) {
			if (!trigger.card.storage) {
				trigger.card.storage = {};
			}
			trigger.card.storage.sbpaoxiao = true;
			trigger.baseDamage++;
			trigger.directHit.addArray(game.players);
			player.addTempSkill("sbpaoxiao_effect", "phaseUseAfter");
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "useCardToPlayered" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.card.storage && event.card.storage.sbpaoxiao && event.target.isIn();
				},
				async content(event, trigger, player) {
					trigger.target.addTempSkill("fengyin");
				},
				group: "sbpaoxiao_recoil",
			},
			recoil: {
				audio: "sbpaoxiao",
				charlotte: true,
				trigger: { source: "damageSource" },
				forced: true,
				filter(event, player) {
					return event.card && event.card.storage && event.card.storage.sbpaoxiao && event.player.isIn();
				},
				async content(event, trigger, player) {
					await player.loseHp();
					const hs = player.getCards("h", card => lib.filter.cardDiscardable(card, player, "sbpaoxiao_recoil"));
					if (!hs.length) {
						return;
					}
					await player.discard({ cards: [hs.randomGet()] });
				},
			},
		},
	},
	sbxieji: {
		audio: 3,
		trigger: { player: "phaseZhunbeiBegin" },
		logAudio: () => 2,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					filterTarget: lib.filter.notMe,
					prompt: get.prompt(event.skill),
					prompt2: "和一名其他角色进行“协力”",
					ai: target => get.threaten(target) * Math.sqrt(1 + target.countCards("h")) * (target.isTurnedOver() || target.hasJudge("lebu") ? 0.1 : 1),
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			//保证技能cooperation被移除之后 失去该技能
			player.addAdditionalSkill("cooperation", "sbxieji_effect");
			//选择对方的协击条件
			await player.chooseCooperationFor({ target, reason: "sbxieji" }).set("ai", button => {
				let base = 0;
				switch (button.link) {
					case "cooperation_damage":
						base = 0.8;
						break;
					case "cooperation_draw":
						base = 0.1;
						break;
					case "cooperation_discard":
						base = 0.1;
						break;
					case "cooperation_use":
						base = 0.1;
						break;
				}
				return base + Math.random();
			});
			await game.delayx();
		},
		subSkill: {
			effect: {
				audio: "sbxieji3.mp3",
				charlotte: true,
				trigger: { global: "phaseJieshuBegin" },
				direct: true,
				filter(event, player) {
					//判断自己是否有目标为该角色 且已经完成的协力记录
					return player.checkCooperationStatus(event.player, "sbxieji");
				},
				async content(event, trigger, player) {
					game.log(player, "和", trigger.player, "的协力成功");
					const result = await player
						.chooseTarget({
							prompt: "协击：请选择【杀】的目标",
							prompt2: `你和${get.translation(trigger.player)}协力成功，可以视为对至多三名其他角色使用一张【杀】，且此【杀】造成伤害时，你摸等同于伤害值的牌`,
							selectTarget: [1, 3],
							filterTarget: (card, player, target) => player.canUse("sha", target),
							ai: target => {
								const player = _status.event.player;
								return get.effect(target, { name: "sha" }, player, player);
							},
						})
						.forResult();
					if (!result.bool || !result.targets?.length) {
						return;
					}
					player.addTempSkill("sbxieji_reward", "sbxieji_effectAfter");
					await player.useCard({
						card: get.autoViewAs({
							name: "sha",
							isCard: true,
							storage: { sbxieji: true },
						}),
						skill: "sbxieji_effect",
						targets: result.targets,
					});
				},
			},
			reward: {
				charlotte: true,
				trigger: { source: "damageSource" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.card && event.card.storage && event.card.storage.sbxieji && event.getParent().type === "card";
				},
				async content(event, trigger, player) {
					await player.draw(trigger.num);
				},
			},
		},
	},
	//徐晃
	sbduanliang: {
		audio: 4,
		enable: "phaseUse",
		usable: 1,
		logAudio: () => 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player
				.chooseToDuiben(target)
				.set("title", "谋弈")
				.set("namelist", ["固守城池", "突出重围", "围城断粮", "擂鼓进军"])
				.set("translationList", [`以防止${get.translation(player)}通过此技能对你使用【决斗】`, `以防止${get.translation(player)}通过此技能对你使用【兵粮寸断】`, `若成功，将牌堆顶的牌当做【兵粮寸断】对${get.translation(target)}使用`, `若成功，视为对${get.translation(target)}使用【决斗】`])
				.set("ai", button => {
					const source = _status.event.getParent().player;
					const target = _status.event.getParent().target;
					if (get.effect(target, { name: "juedou" }, source, source) >= 10 && button.link[2] === "db_def2" && Math.random() < 0.5) {
						return 10;
					}
					return 1 + Math.random();
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			if (result.player !== "db_def1") {
				const card = get.autoViewAs({ name: "juedou", isCard: true });
				if (player.canUse(card, target)) {
					await player.useCard({ card, targets: [target] });
				}
				return;
			}
			if (target.hasJudge("bingliang")) {
				await player.gainPlayerCard({ target, position: "he", forced: true });
				return;
			}
			if (!ui.cardPile.childNodes.length) {
				return;
			}
			const card = get.autoViewAs({ name: "bingliang" }, [ui.cardPile.firstChild]);
			if (!player.canUse(card, target, false)) {
				return;
			}
			await player.useCard({
				card: get.autoViewAs({
					name: "bingliang",
				}),
				cards: get.cards(),
				targets: [target],
			});
		},
		ai: {
			threaten: 1.2,
			order: 5.5,
			result: {
				player: 1,
				target: -1,
			},
		},
		subSkill: {
			true1: {
				audio: "sbduanliang2.mp3",
			},
			true2: {
				audio: "sbduanliang3.mp3",
			},
			false: {
				audio: "sbduanliang4.mp3",
			},
		},
	},
	sbshipo: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.hasPlayer(current => current.hp < player.hp || current.hasJudge("bingliang"));
		},
		async cost(event, trigger, player) {
			const controls = [];
			const choiceList = ["选择一名体力少于你的角色", "选择所有判定区有兵粮寸断的其他角色"];
			const bool = game.hasPlayer(current => current.hp < player.hp);
			const bool2 = game.hasPlayer(current => current.hasJudge("bingliang"));
			if (bool) {
				controls.push("选项一");
			} else {
				choiceList[0] = `<span style="opacity:0.5">${choiceList[0]}</span>`;
			}
			if (bool2) {
				controls.push("选项二");
			} else {
				choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
			}
			if (_status.connectMode) {
				game.broadcastAll(() => {
					_status.noclearcountdown = true;
				});
			}
			let eff = controls.includes("选项一") ? 0 : Infinity;
			let eff2 = controls.includes("选项二") ? 0 : Infinity;
			for (const current of game.filterPlayer()) {
				if (current.hp < player.hp) {
					const effx = get.attitude(player, current) / Math.sqrt(Math.max(0.1, 2 * current.hp + current.countCards("h")));
					if (effx < eff) {
						eff = effx;
					}
				}
				if (current.hasJudge("bingliang")) {
					eff2 += get.attitude(player, current) / Math.sqrt(Math.max(0.1, 2 * current.hp + current.countCards("h")));
				}
			}
			const choice = eff >= 0 && eff2 >= 0 ? "cancel2" : eff < eff2 ? "选项一" : "选项二";
			const { control } = await player
				.chooseControl({
					controls: [...controls, "cancel2"],
					prompt: get.prompt2("sbshipo"),
					choiceList,
					ai: () => _status.event.choice,
					choice,
				})
				.forResult();
			switch (control) {
				case "选项一":
					event.result = await player
						.chooseTarget({
							prompt: "选择一名体力少于你的角色",
							filterTarget: (card, player, target) => target.hp < player.hp,
							forced: true,
							ai: target => -get.attitude(get.player(), target) / Math.sqrt(Math.max(0.1, 2 * target.hp + target.countCards("h"))),
						})
						.forResult();
					break;
				case "选项二":
					event.result = {
						bool: true,
						targets: game.filterPlayer(current => current.hasJudge("bingliang")),
					};
					break;
				case "cancel2":
					break;
			}
			game.broadcastAll(() => {
				delete _status.noclearcountdown;
				game.stopCountChoose();
			});
		},
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			const gainedCards = [];
			for (const target of targets) {
				const result = await target
					.chooseCard({
						prompt: `交给${get.translation(player)}一张手牌，或受到1点伤害`,
						ai: card => {
							const target = _status.event.player;
							const source = _status.event.getParent().player;
							if (get.damageEffect(target, source, target) > 0) {
								return 0;
							}
							if (get.attitude(target, source) > 0) {
								return 1;
							}
							if (get.tag(card, "recover") > 0) {
								return 0;
							}
							return (target.hp < 2 ? 7 : 5.5) - get.value(card);
						},
					})
					.forResult();
				if (!result.bool) {
					await target.damage();
					continue;
				}
				gainedCards.addArray(result.cards);
				await target.give(result.cards, player);
			}
			const cards = gainedCards.filter(card => get.owner(card) === player && get.position(card) === "h");
			if (!cards.length) {
				return;
			}
			const result = await player
				.chooseCardTarget({
					filterCard: card => _status.event.cards.includes(card),
					filterTarget: lib.filter.notMe,
					selectCard: [1, cards.length],
					prompt: "是否将任意张得到的牌交给一名其他角色？",
					cards,
					ai1(card) {
						const player = _status.event.player;
						const val = player.getUseValue(card);
						if (val > 0) {
							return 2;
						}
						if (player.hp <= 2 && val === 0 && get.value(card) > 5) {
							return 0;
						}
						return Math.random() > 0.5 ? 1 : 0;
					},
					ai2(target) {
						const player = _status.event.player;
						const cards = ui.selected.cards;
						const val = cards.reduce((sum, card) => sum + target.getUseValue(card), 0);
						if (val > 0) {
							return val * get.attitude(player, target) * 2;
						}
						const lastCard = cards[cards.length - 1];
						return get.value(lastCard, target) * get.attitude(player, target);
					},
					allowChooseAll: true,
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			await player.give(result.cards, result.targets[0]);
		},
	},
	//马超
	sbtieji: {
		audio: 4,
		trigger: { player: "useCardToPlayered" },
		logTarget: "target",
		logAudio: () => 1,
		filter(event, player) {
			return player !== event.target && event.card.name === "sha" && event.target.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		async content(event, trigger, player) {
			const target = trigger.target;
			event.target = target;
			target.addTempSkill("fengyin");
			trigger.directHit.add(target);
			const result = await player
				.chooseToDuiben(target)
				.set("title", "谋弈")
				.set("namelist", ["出阵迎战", "拱卫中军", "直取敌营", "扰阵疲敌"])
				.set("translationList", [`以防止${get.translation(player)}摸两张牌`, `以防止${get.translation(player)}获得你一张牌`, `若成功，你获得${get.translation(target)}一张牌`, `若成功，你摸两张牌`])
				.set("ai", button => {
					const source = get.event().getParent().player;
					const target = get.event().getParent().target;
					if (!target.countCards("he") && button.link[2] === "db_def2") {
						return 10;
					}
					if (!target.countCards("he") && get.attitude(target, source) <= 0 && button.link[2] === "db_atk1") {
						return 10;
					}
					return 1 + Math.random();
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			if (result.player === "db_def1") {
				await player.gainPlayerCard({ target, position: "he", forced: true });
				return;
			}
			await player.draw(2);
		},
		ai: {
			ignoreSkill: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "directHit_ai") {
					return arg?.target && get.attitude(player, arg.target) <= 0;
				}
				if (!arg || arg.isLink || !arg.card || arg.card.name !== "sha") {
					return false;
				}
				if (!arg.target || get.attitude(player, arg.target) >= 0) {
					return false;
				}
				if (!arg.skill || !lib.skill[arg.skill] || lib.skill[arg.skill].charlotte || lib.skill[arg.skill].persevereSkill || get.is.locked(arg.skill) || !arg.target.getSkills(true, false).includes(arg.skill)) {
					return false;
				}
			},
			directHit_ai: true,
		},
		subSkill: {
			true1: {
				audio: "sbtieji2.mp3",
			},
			true2: {
				audio: "sbtieji3.mp3",
			},
			false: {
				audio: "sbtieji4.mp3",
			},
		},
	},
	//甘宁
	sbqixi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCards("h");
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			const allSuits = lib.suit.slice();
			const cards = player.iterableGetCards("h");
			const map = new Map();
			let max = -Infinity;
			for (const card of cards) {
				const suit = get.suit(card, player);
				if (!map.has(suit)) {
					map.set(suit, 0);
				}
				let num = map.get(suit);
				++num;
				if (num > max) {
					max = num;
				}
				map.set(suit, num);
			}
			const suits = [];
			for (const [suit, count] of map) {
				if (count === max) {
					suits.push(suit);
				}
			}
			let num = 0;
			while (allSuits.length) {
				const { control } = await target
					.chooseControl({
						controls: [...allSuits],
						prompt: `奇袭：猜测${get.translation(player)}手牌中最多的花色`,
						ai() {
							const event = get.event();
							const controls = event.controls;

							const parent = event.getParent();
							if (parent != null) {
								const player = parent.player;
								if (player.countCards("h") <= 3 && controls.includes("diamond") && Math.random() < 0.3) {
									return "diamond";
								}
							}
							return controls.randomGet();
						},
					})
					.forResult();
				target.chat(`我猜是${get.translation(control)}！`);
				game.log(target, "猜测为", `#y${control}`);
				if (!event.isMine() && !event.isOnline()) {
					await game.delayx();
				}
				if (suits.includes(control)) {
					player.chat(num === 0 ? "这么准？" : "猜对了！");
					game.log(target, "猜测", "#g正确");
					await player.showHandcards();
					break;
				}
				player.chat("猜错了！");
				game.log(target, "猜测", "#y错误");
				num++;
				allSuits.remove(control);
				const { bool } = await player
					.chooseBool({
						prompt: "是否令其重新选择一个花色继续猜测？",
						ai: () => true,
					})
					.forResult();
				if (!bool) {
					break;
				}
			}
			if (num > 0 && target.hasDiscardableCards(player, "hej")) {
				const max = Math.min(num, target.countDiscardableCards(player, "hej"));
				player.line(target);
				await player.discardPlayerCard({
					target,
					selectButton: max,
					forced: true,
					position: "hej",
				});
			}
		},
		ai: {
			order: 10,
			result: {
				player: 1,
				target(player, target) {
					return get.effect(target, { name: "guohe" }, player, target) * (5 - get.attitude(player, target) / 2);
				},
			},
		},
	},
	sbfenwei: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.hasCards("he");
		},
		skillAnimation: true,
		animationColor: "wood",
		limited: true,
		position: "he",
		filterCard: true,
		selectCard: [1, 3],
		filterTarget: true,
		selectTarget() {
			return ui.selected.cards.length;
		},
		delay: false,
		discard: false,
		lose: false,
		complexSelect: true,
		filterOk() {
			return ui.selected.targets.length === ui.selected.cards.length;
		},
		multitarget: true,
		multiline: true,
		check(card) {
			return 7 - get.value(card);
		},
		async content(event, trigger, player) {
			const { cards, targets } = event;
			player.awakenSkill(event.name);
			for (const [index, card] of cards.entries()) {
				await targets[index].addToExpansion({
					cards: [card],
					source: player,
					animate: "give",
					gaintag: ["sbfenwei_effect"],
				});
			}
			player.addSkill("sbfenwei_effect");
			await player.draw(cards.length);
		},
		intro: {
			content: "limited",
		},
		ai: {
			order: 6.9,
			result: {
				target(player, target) {
					if (game.hasPlayer(current => (!get.rawAttitude || get.rawAttitude(player, current) > 0) && current !== player && get.attitude(player, current) <= 0) && game.countPlayer(current => get.attitude(player, current) > 0) <= 2) {
						return 0;
					}
					return 1;
				},
			},
		},
		subSkill: {
			effect: {
				audio: "sbfenwei",
				trigger: {
					global: "useCardToTarget",
				},
				charlotte: true,
				forced: true,
				filter(event, player) {
					return event.target.getExpansions("sbfenwei_effect").length > 0 && get.type2(event.card) === "trick";
				},
				async content(event, trigger, player) {
					const choiceList = [`令${get.translation(trigger.target)}获得其“威”`, `移去${get.translation(trigger.target)}的“威”，取消${get.translation(trigger.card)}对其的目标`];
					const { index } = await player
						.chooseControl({
							choiceList,
							prompt: "奋威：请选择一项",
							ai: () => {
								const player = _status.event.player;
								const evt = _status.event.getTrigger();
								if (get.effect(evt.target, evt.card, evt.player, player) < -10) {
									return 1;
								}
								return 0;
							},
						})
						.forResult();
					const cards = trigger.target.getExpansions("sbfenwei_effect");
					if (index === 0) {
						await trigger.target.gain({ cards, animate: "gain2", fromStorage: true });
						return;
					}
					const loseEvent = trigger.target.loseToDiscardpile({ cards });
					trigger.targets.remove(trigger.target);
					trigger.getParent().triggeredTargets2.remove(trigger.target);
					trigger.untrigger();
					await loseEvent;
				},
				marktext: "威",
				intro: {
					name: "威",
					markcount: "expansion",
					content: "expansion",
				},
			},
		},
	},
	//甄宓
	sbluoshen: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("sbluoshen"),
					ai: target => {
						let eff = 0;
						const num = Math.ceil(game.countPlayer() / 2);
						const players = game
							.filterPlayer(current => current !== player)
							.sortBySeat(target)
							.slice(0, num);
						for (const targetx of players) {
							eff += get.attitude(player, targetx) * Math.sqrt(targetx.countCards("h"));
						}
						return 1 - eff;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const firstTarget = event.targets[0];
			player.addTempSkill("sbluoshen_add");
			const targets = game
				.filterPlayer(current => current !== player)
				.sortBySeat(firstTarget)
				.slice(0, Math.ceil(game.countPlayer() / 2));
			for (const target of targets) {
				player.line(target);
				if (!target.hasCards("h")) {
					continue;
				}
				const result = await target
					.chooseCard({
						prompt: "展示一张手牌",
						forced: true,
						ai: card => {
							const val = _status.event.goon ? 15 : 5;
							if (get.color(card) === "black") {
								return val - get.value(card);
							}
							return 7 - get.value(card);
						},
					})
					.set("goon", get.attitude(target, player) > 0)
					.forResult();
				if (!result.bool) {
					continue;
				}
				const card = result.cards[0];
				await target.showCards(card, `${get.translation(target)}【洛神】展示`);
				const color = get.color(card);
				if (color === "black") {
					await player.gain({
						cards: [card],
						source: target,
						animate: "give",
						bySelf: true,
						gaintag: ["sbluoshen"],
					});
				} else if (color === "red") {
					await target.discard({ cards: [card] });
				}
			}
		},
		subSkill: {
			add: {
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("sbluoshen")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name === "phaseDiscard" && card.hasGaintag("sbluoshen")) {
							return false;
						}
					},
				},
				onremove(player) {
					player.removeGaintag("sbluoshen");
				},
			},
		},
	},
	//曹操
	sbjianxiong: {
		audio: 2,
		trigger: { player: "damageEnd" },
		group: "sbjianxiong_mark",
		filter(event, player) {
			return (get.itemtype(event.cards) === "cards" && event.cards.some(i => get.position(i, true) === "o")) || 3 - player.countMark("sbjianxiong") > 0;
		},
		prompt2(event, player) {
			const gain = get.itemtype(event.cards) === "cards" && event.cards.some(i => get.position(i, true) === "o");
			const draw = 3 - player.countMark("sbjianxiong");
			let str = "";
			if (gain) {
				str += `获得${get.translation(event.cards)}`;
			}
			if (gain && draw > 0) {
				str += "并";
			}
			if (draw > 0) {
				str += `摸${get.cnNumber(3 - player.countMark("sbjianxiong"))}张牌`;
			}
			if (player.countMark("sbjianxiong")) {
				str += "，然后可以弃1枚“治世”";
			}
			return str;
		},
		async content(event, trigger, player) {
			const { cards } = trigger;
			if (get.itemtype(cards) === "cards" && cards.someInD()) {
				await player.gain({ cards: cards.filterInD(), animate: "gain2" });
			}
			const num = player.countMark(event.name);
			if (3 - num > 0) {
				await player.draw({ num: 3 - num, nodelay: true });
			}
			if (num) {
				const result = await player
					.chooseBool({ prompt: "奸雄：是否弃1枚“治世”？" })
					.set("ai", () => {
						const player = _status.event.player;
						const current = _status.currentPhase;
						if (get.distance(current, player, "absolute") > 3 && player.hp <= 2) {
							return true;
						}
						return false;
					})
					.forResult();
				if (result.bool) {
					player.removeMark(event.name, 1);
				}
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1];
					}
					if (get.tag(card, "damage") && player !== target) {
						let cards = card.cards;
						const evt = _status.event;
						if (evt.player === target && card.name === "damage" && evt.getParent().type === "card") {
							cards = evt.getParent().cards.filterInD();
						}
						if (target.hp <= 1) {
							return;
						}
						if (get.itemtype(cards) !== "cards") {
							return;
						}
						for (const i of cards) {
							if (get.name(i, target) === "tao") {
								return [1, 4.5];
							}
						}
						if (get.value(cards, target) >= 7 + target.getDamagedHp()) {
							return [1, 2];
						}
						return [1, 0.55 + 0.05 * Math.max(0, 1 - target.countMark("sbjianxiong"))];
					}
				},
			},
		},
		marktext: "治",
		intro: {
			name: "治世",
			name2: "治世",
			content: "mark",
		},
		subSkill: {
			mark: {
				audio: "sbjianxiong",
				trigger: { global: "phaseBefore", player: "enterGame" },
				forced: true,
				filter(event, player) {
					return event.name !== "phase" || game.phaseNumber === 0;
				},
				async content(event, trigger, player) {
					const map = {};
					const list = [];
					for (let i = 1; i <= 2; i++) {
						const cn = get.cnNumber(i, true);
						map[cn] = i;
						list.push(cn);
					}
					list.push("cancel2");
					const result = await player
						.chooseControl({ controls: list, ai: () => get.cnNumber(2, true) })
						.set("prompt", "奸雄：获得任意枚“治世”标记")
						.forResult();
					if (result.control !== "cancel2") {
						player.addMark("sbjianxiong", map[result.control]);
					}
				},
			},
		},
	},
	sbqingzheng: {
		audio: 2,
		inherit: "mbcmqingzheng",
		persevereSkill: false,
		ai: { combo: "sbjianxiong" },
	},
	sbhujia: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		zhuSkill: true,
		direct: true,
		filter(event, player) {
			return !player.hasSkill("sbhujia_used") && game.hasPlayer(current => current !== player && current.group === "wei" && player.hasZhuSkill("sbhujia", current));
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseTarget({
					prompt: get.prompt("sbhujia"),
					prompt2: `将${get.translation(trigger.source)}即将对你造成的${trigger.num}点伤害转移给一名其他魏势力角色`,
					filterTarget: (card, player, target) => target !== player && target.group === "wei" && player.hasZhuSkill("sbhujia", target),
					ai: target => {
						const player = _status.event.player;
						const evt = _status.event.getTrigger();
						return get.damageEffect(target, evt.source, player, evt.nature) - _status.event.eff;
					},
				})
				.set("eff", get.damageEffect(player, trigger.source, player, trigger.nature))
				.forResult();
			if (!result.bool) {
				return;
			}
			const target = result.targets[0];
			player.logSkill("sbhujia", target);
			player.addTempSkill("sbhujia_used", "roundStart");
			trigger.cancel();
			if (trigger.source) {
				await target.damage({
					source: trigger.source,
					nature: trigger.nature,
					num: trigger.num,
					card: trigger.card,
					cards: trigger.cards,
				});
				return;
			}
			await target.damage({
				nosource: true,
				nature: trigger.nature,
				num: trigger.num,
				card: trigger.card,
				cards: trigger.cards,
			});
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (get.tag(card, "damage") && !target.hasSkill("sbhujia_used") && game.hasPlayer(current => current !== target && current.group === "wei" && target.hasZhuSkill("sbhujia", current))) {
						return 0.8;
					}
				},
			},
			threaten(player, target) {
				if (target.countCards("h") === 0) {
					return 2;
				}
			},
		},
		subSkill: {
			used: { charlotte: true },
		},
	},
	//张角
	sbleiji: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countMark("sbguidao") >= 4;
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			player.removeMark("sbguidao", 4);
			await event.target.damage({ nature: "thunder" });
		},
		ai: {
			combo: "sbguidao",
			order: 9,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target, "thunder");
				},
			},
		},
	},
	sbguidao: {
		audio: 2,
		trigger: {
			global: ["phaseBefore", "damageEnd"],
			player: "enterGame",
		},
		forced: true,
		locked: false,
		group: "sbguidao_defend",
		filter(event, player) {
			if (player.hasSkill("sbguidao_banned") || player.countMark("sbguidao") >= 8) {
				return false;
			}
			if (event.name === "damage") {
				return event.hasNature();
			}
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		async content(event, trigger, player) {
			const gain = trigger.name === "damage" ? 2 : 6;
			const num = Math.min(8 - player.countMark("sbguidao"), gain);
			player.addMark("sbguidao", num);
		},
		marktext: "兵",
		intro: {
			name: "道兵",
			name2: "道兵",
			content: "共有$枚“道兵”",
		},
		subSkill: {
			defend: {
				audio: "sbguidao",
				trigger: { player: "damageBegin4" },
				filter(event, player) {
					return player.countMark("sbguidao") >= 2;
				},
				prompt2: "弃2枚“道兵”，防止伤害",
				check(event, player) {
					return event.num >= 2 || player.hp <= event.num;
				},
				async content(event, trigger, player) {
					trigger.cancel();
					player.removeMark("sbguidao", 2);
					if (player !== _status.currentPhase) {
						player.addTempSkill("sbguidao_banned", { player: "phaseBegin" });
					}
				},
			},
			banned: {
				charlotte: true,
				mark: true,
				marktext: '<span style="text-decoration: line-through;">道</span>',
				intro: { content: "孩子们，我不能获得道兵了" },
			},
		},
	},
	sbhuangtian: {
		audio: 2,
		trigger: {
			player: "phaseBegin",
		},
		forced: true,
		zhuSkill: true,
		group: "sbhuangtian_mark",
		filter(event, player) {
			if (player.phaseNumber > 1 || game.phaseNumber > 1) {
				return false;
			}
			if (!player.hasZhuSkill("sbhuangtian")) {
				return false;
			}
			return (
				!game.hasPlayer(current => current.hasCards("hej", "taipingyaoshu")) &&
				!Array.from(ui.cardPile.childNodes)
					.concat(Array.from(ui.discardPile.childNodes))
					.concat(Array.from(ui.ordering.childNodes))
					.map(i => i.name)
					.includes("taipingyaoshu")
			);
		},
		async content(event, trigger, player) {
			if (!lib.inpile.includes("taipingyaoshu")) {
				lib.inpile.push("taipingyaoshu");
			}
			const card = game.createCard2("taipingyaoshu", "heart", 3);
			if (!card) {
				return;
			}
			await player.equip(card);
		},
		subSkill: {
			mark: {
				audio: "sbhuangtiang",
				trigger: { global: "damageSource" },
				forced: true,
				zhuSkill: true,
				filter(event, player) {
					if (!player.hasZhuSkill("sbhuangtian") || !player.hasSkill("sbguidao", null, false, false)) {
						return false;
					}
					if (!event.source || player === event.source || event.source.group !== "qun") {
						return false;
					}
					if (player.hasSkill("sbguidao") && player.countMark("sbguidao") >= 8) {
						return false;
					}
					if (player.countMark("sbhuangtian_count") >= 4) {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					const num = Math.min(8 - player.countMark("sbhuangtian_count"), 2);
					player.addMark("sbguidao", num);
					player.addTempSkill("sbhuangtian_count", "roundStart");
					player.addMark("sbhuangtian_count", num, false);
				},
			},
			count: { onremove: true },
		},
	},
	//夏侯氏
	sbqiaoshi: {
		audio: 2,
		trigger: { player: "damageEnd" },
		usable: 1,
		filter(event, player) {
			return event.source && event.source !== player && event.source.isIn();
		},
		async cost(event, trigger, player) {
			const { source, num } = trigger;
			event.result = await source
				.chooseBool({ prompt: `樵拾：是否令${get.translation(player)}回复${num}点体力，然后你摸两张牌？` })
				.set("ai", () => {
					return _status.event.bool;
				})
				.set("bool", get.recoverEffect(player, source, source) + 2 * get.effect(source, { name: "draw" }, source) > 5)
				.forResult();
		},
		async content(event, trigger, player) {
			const { source, num } = trigger;
			source.line(player, "green");
			await player.recover({ num, source });
			await source.draw(2);
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (get.attitude(target, player) <= 0 || target === player) {
							return;
						}
						if (target.storage.counttrigger?.sbqiaoshi) {
							return;
						}
						if (target.hp <= 1 && !player.canSave(target)) {
							return;
						}
						return [0, 0.5, 0, 0.5];
					}
				},
			},
		},
	},
	sbyanyu: {
		audio: 2,
		enable: "phaseUse",
		usable: 2,
		filterCard: { name: "sha" },
		selectCard: 1,
		group: "sbyanyu_draw",
		check: () => 1,
		async content(event, trigger, player) {
			await player.draw();
		},
		subSkill: {
			draw: {
				trigger: { player: "phaseUseEnd" },
				filter(event, player) {
					const phaseUse = _status.event.getParent("phaseUse");
					return (
						player.getHistory("useSkill", evt => {
							const evtPhaseUse = evt.event.getParent("phaseUse");
							return evt.skill === "sbyanyu" && Boolean(evtPhaseUse) && evtPhaseUse === phaseUse;
						}).length > 0
					);
				},
				direct: true,
				async content(event, trigger, player) {
					const phaseUse = _status.event.getParent("phaseUse");
					const num =
						3 *
						player.getHistory("useSkill", evt => {
							const evtPhaseUse = evt.event.getParent("phaseUse");
							return evt.skill === "sbyanyu" && Boolean(evtPhaseUse) && evtPhaseUse === phaseUse;
						}).length;
					const result = await player
						.chooseTarget({
							prompt: get.prompt("sbyanyu"),
							prompt2: `令一名其他角色摸${get.cnNumber(num)}张牌`,
							filterTarget: lib.filter.notMe,
							ai: target => get.effect(target, { name: "draw" }, player, player),
						})
						.forResult();
					if (!result.bool) {
						return;
					}
					const target = result.targets[0];
					player.logSkill("sbyanyu_draw", target);
					await target.draw(num);
				},
			},
		},
		ai: {
			order(obj, player) {
				const hasFriendlyTarget = game.hasPlayer(current => current !== player && get.attitude(player, current) > 0);
				const phaseUse = _status.event.getParent("phaseUse");
				const useCount = player.getHistory("useSkill", evt => {
					const evtPhaseUse = evt.event.getParent("phaseUse");
					return evt.skill === "sbyanyu" && Boolean(evtPhaseUse) && evtPhaseUse === phaseUse;
				}).length;
				return hasFriendlyTarget && useCount < 2 ? 9 : 2;
			},
			result: {
				player: 1,
			},
		},
	},
	//曹仁
	sbjushou: {
		audio: 3,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return !player.isTurnedOver();
		},
		filterCard: true,
		selectCard: [1, 2],
		check(card) {
			if (ui.selected.cards.length + _status.event.player.hujia >= 5) {
				return 0;
			}
			return 6.5 - get.value(card);
		},
		position: "he",
		logAudio: () => 1,
		group: ["sbjushou_damage", "sbjushou_draw"],
		async content(event, trigger, player) {
			const { cards } = event;
			await player.turnOver();
			await player.changeHujia(cards.length, null, true);
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
		subSkill: {
			damage: {
				audio: "sbjushou2.mp3",
				trigger: {
					player: "damageEnd",
				},
				filter(event, player) {
					return player.isTurnedOver();
				},
				direct: true,
				async content(event, trigger, player) {
					const { control } = await player
						.chooseControl({
							controls: ["翻面", "获得1点护甲", "cancel2"],
							prompt: get.prompt("sbjushou"),
							prompt2: "选择一项",
							ai: () => (player.hujia >= 3 ? 0 : 1),
						})
						.forResult();
					if (control === "cancel2") {
						return;
					}
					player.logSkill("sbjushou_damage");
					if (control === "翻面") {
						await player.turnOver();
					} else {
						await player.changeHujia(1, null, true);
					}
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (!target.isTurnedOver()) {
								return;
							}
							if (!get.tag(card, "damage")) {
								return;
							}
							if (player.hasSkillTag("jueqing", false, target)) {
								return [1, -2];
							}
							if (
								(card.name === "sha" && !player.hasSkill("jiu")) ||
								target.hasSkillTag("filterDamage", null, {
									player,
									card,
								})
							) {
								return 0.1;
							}
						},
					},
				},
			},
			draw: {
				audio: "sbjushou3.mp3",
				trigger: { player: "turnOverAfter" },
				forced: true,
				locked: false,
				filter(event, player) {
					return !player.isTurnedOver() && player.hujia > 0;
				},
				async content(event, trigger, player) {
					await player.draw(player.hujia);
				},
			},
		},
	},
	sbjiewei: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hujia > 0;
		},
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h");
		},
		async content(event, trigger, player) {
			const { target } = event;
			const changeHujiaEvent = player.changeHujia(-1);
			const gainEvent = player.gainPlayerCard({
				target,
				position: "h",
				visible: true,
				forced: true,
				ai: button => get.value(button.link, _status.event.target),
			});
			await changeHujiaEvent;
			await gainEvent;
		},
		ai: {
			combo: "sbjushou",
			order: 8,
			result: {
				player(player, target) {
					return player.hujia - 3.6;
				},
				target: -1,
			},
		},
	},
	//周瑜
	sbyingzi: {
		audio: 2,
		audioname: ["sb_sunce"],
		trigger: { player: "phaseDrawBegin2" },
		forced: true,
		getNum(player) {
			return (player.countCards("h") >= 2) + (player.hp >= 2) + (player.countCards("e") >= 1);
		},
		filter(event, player) {
			return !event.numFixed && lib.skill.sbyingzi.getNum(player) > 0;
		},
		async content(event, trigger, player) {
			const num = lib.skill.sbyingzi.getNum(player);
			trigger.num += num;
			player.addTempSkill("sbyingzi_limit");
			player.addMark("sbyingzi_limit", num, false);
		},
		ai: {
			threaten: 2,
		},
		subSkill: {
			limit: {
				charlotte: true,
				forced: true,
				onremove: true,
				marktext: "英",
				intro: {
					content: "本回合手牌上限+#",
				},
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("sbyingzi_limit");
					},
				},
			},
		},
	},
	sbfanjian: {
		audio: 2,
		enable: "phaseUse",
		usable: 5,
		chooseButton: {
			dialog() {
				return ui.create.dialog(`###反间###${get.translation("sbfanjian_info")}`);
			},
			chooseControl(event, player) {
				return [...lib.suit, "cancel2"];
			},
			check(event, player) {
				const suits = lib.suit.filter(suit => !player.getStorage("sbfanjian_guessed").includes(suit));
				return suits.randomGet();
			},
			backup(result, player) {
				return {
					audio: "sbfanjian",
					filterCard(card, player) {
						return !player.getStorage("sbfanjian_guessed").includes(get.suit(card, player));
					},
					suit: result.control,
					position: "h",
					filterTarget: lib.filter.notMe,
					check(card) {
						return 6 - get.value(card);
					},
					discard: false,
					lose: false,
					delay: false,
					async content(event, trigger, player) {
						const cards = event.cards;
						const target = event.targets[0];
						const claimSuit = lib.skill.sbfanjian_backup.suit;
						const cardSuit = get.suit(cards, player);
						event.claimSuit = claimSuit;
						event.cardSuit = cardSuit;
						player.addTempSkill("sbfanjian_guessed");
						const claim = get.translation(`${claimSuit}2`);
						player.chat(`我声明${claim}`);
						game.log(player, "声明了", `#y${claim}`);
						const choiceList = [`猜测此牌花色为${claim}`, `猜测此牌花色不为${claim}`, "不猜测，你翻面并令其〖反间〗失效"];
						const { index } = await target
							.chooseControl({
								choiceList,
								prompt: `${get.translation(player)}对你发动了【反间】并选择了一张牌，请选择一项`,
								ai: () => {
									const player = _status.event.player;
									const user = _status.event.getParent().player;
									const claim = _status.event.getParent().claimSuit;
									const suit = _status.event.getParent().cardSuit;
									if (player.isTurnedOver()) {
										return 2;
									}
									const lose = get.effect(player, { name: "losehp" }, user, player);
									if (user.getStorage("sbfanjian_guessed").includes(claim) && claim === suit) {
										return lose <= 0 ? 0 : 1;
									}
									if (get.attitude(player, user) > 0) {
										return 0;
									}
									const list = [0, 1];
									if (player.hp <= 1 && player.getFriends().length > 0) {
										list.push(2);
									}
									return list.randomGet();
								},
							})
							.forResult();
						const skill = "sbfanjian_guessed";
						player.markAuto(skill, [cardSuit]);
						const suits = player
							.getStorage(skill)
							.map(suit => get.translation(suit))
							.join("");
						player.addTip(skill, `${get.translation(skill)} ${suits}`);
						if (index === 2) {
							game.log(target, "选择", "#y不猜测");
							target.chat("不猜！");
							await target.turnOver();
						} else {
							target.chat(`我猜花色${index === 1 ? "不" : ""}为${claim}`);
							game.log(target, "猜测花色", `#g${index === 1 ? "不" : ""}为${claim}`);
						}
						if (event.isMine() && !event.isOnline()) {
							await game.delayx();
						}
						await target.gain({
							cards,
							source: player,
							animate: "giveAuto",
							bySelf: true,
						});
						if ((index === 0 && claimSuit !== cardSuit) || (index === 1 && claimSuit === cardSuit)) {
							game.log(target, "猜测", "#y错误");
							await target.loseHp();
							return;
						}
						if (index !== 2) {
							game.log(target, "猜测", "#g正确");
						}
						player.tempBanSkill("sbfanjian");
					},
					ai: {
						result: {
							target(player, target) {
								if (!ui.selected.cards.length) {
									return 0;
								}
								const val = get.value(ui.selected.cards, target);
								if (val < 0) {
									return val + get.effect(target, { name: "losehp" }, player, target);
								}
								if (val > 5 || get.value(ui.selected.cards, player) > 5) {
									return target.isTurnedOver() ? 5 : 0;
								}
								if (target.isTurnedOver()) {
									return 1;
								}
								return get.effect(target, { name: "losehp" }, player, target);
							},
						},
					},
				};
			},
			prompt(result) {
				return `你选择了${get.translation(result.control)}，请选择一张手牌和【反间】的目标`;
			},
		},
		subSkill: {
			guessed: {
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				charlotte: true,
			},
			backup: {},
		},
		ai: {
			order: 4,
			result: { player: 1 },
		},
	},
	//黄盖
	sbkurou: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt(event.skill),
					prompt2: "交给其他角色一张牌，若此牌为【桃】或【酒】，你失去2点体力，否则你失去1点体力",
					filterCard: true,
					position: "he",
					filterTarget: lib.filter.notMe,
					ai1(card) {
						const player = get.player();
						if ((player.hp <= 1 && !player.canSave(player)) || player.hujia >= 5) {
							return 0;
						}
						if (
							get.value(card, player) > 6 &&
							!game.hasPlayer(current => {
								return current !== player && get.attitude(current, player) > 0 && !current.hasSkillTag("nogain");
							})
						) {
							return 0;
						}
						if (
							player.hp >= 2 &&
							(card.name === "tao" ||
								(card.name === "jiu" &&
									player.countCards("hs", cardx => {
										return cardx !== card && get.tag(cardx, "save");
									}))) &&
							player.hujia <= 1
						) {
							return 10;
						}
						if (player.hp <= 1 && !player.canSave(player)) {
							return 0;
						}
						return 1 / Math.max(0.1, get.value(card));
					},
					ai2(target) {
						const player = get.player();
						let att = get.attitude(player, target);
						if (ui.selected.cards.length) {
							const val = get.value(ui.selected.cards[0]);
							att *= val >= 0 ? 1 : -1;
						}
						if (target.hasSkillTag("nogain")) {
							att /= 9;
						}
						return 15 + att;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			if (get.mode() !== "identity" || player.identity !== "nei") {
				player.addExpose(0.15);
			}
			await player.give(cards, target);
			await player.loseHp(["tao", "jiu"].includes(get.name(cards[0], false)) ? 2 : 1);
		},
		group: "sbkurou_gain",
		ai: {
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (!arg || (arg.card && get.name(arg.card) === "tao")) && player.hp <= 0 && player.isPhaseUsing();
				}
			},
		},
		subSkill: {
			gain: {
				audio: "sbkurou",
				trigger: { player: "loseHpEnd" },
				forced: true,
				locked: false,
				filter(event, player) {
					return player.isIn() && player.hujia < 5 && event.num > 0;
				},
				getIndex: event => event.num,
				async content(event, trigger, player) {
					await player.changeHujia(2, null, true);
				},
				ai: {
					maihp: true,
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) {
									return [1, 1];
								}
								return 1.2;
							}
							if (get.tag(card, "loseHp")) {
								if (target.hp <= 1 || target.hujia >= 5) {
									return;
								}
								return [1, 1];
							}
						},
					},
				},
			},
		},
	},
	sbzhaxiang: {
		audio: 2,
		trigger: { player: "useCard1" },
		forced: true,
		group: ["sbzhaxiang_draw", "sbzhaxiang_mark"],
		filter(event, player) {
			return player.getHistory("useCard").length <= player.getDamagedHp() && player === _status.currentPhase;
		},
		async content(event, trigger, player) {
			trigger.directHit.addArray(game.filterPlayer());
			game.log(trigger.card, "不可被响应");
		},
		ai: {
			threaten: 1.5,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return player.countUsed() < player.getDamagedHp();
			},
		},
		mod: {
			targetInRange(card, player) {
				if (player.countUsed() < player.getDamagedHp()) {
					return true;
				}
			},
			cardUsable(card, player) {
				if (player.countUsed() < player.getDamagedHp()) {
					return Infinity;
				}
			},
			aiOrder(player, card, num) {
				if (player.countUsed() >= player.getDamagedHp()) {
					return;
				}
				const numx = get.info(card).usable;
				if (typeof numx === "function") {
					return numx(card, player) + 10;
				}
				if (typeof numx === "number") {
					return num + 10;
				}
			},
		},
		subSkill: {
			mark: {
				charlotte: true,
				silent: true,
				firstDo: true,
				trigger: {
					player: ["changeHp", "useCard"],
					global: ["phaseBegin", "phaseAfter"],
				},
				filter(event, player) {
					return player === _status.currentPhase;
				},
				async content(event, trigger, player) {
					const skill = event.name;
					if (event.triggername !== "phaseAfter") {
						const num = Math.max(0, player.getDamagedHp() - player.getHistory("useCard").length);
						if (player.countMark(skill) !== num) {
							player.setMark(skill, num, false);
						}
						player.addTip(skill, `${get.translation(skill)}剩余${num}`);
					} else {
						player.clearMark(skill, false);
						player.removeTip(skill);
					}
				},
				intro: {
					content: "还剩 # 张牌无距离次数限制且不可被响应",
				},
			},
			draw: {
				audio: "sbzhaxiang",
				mod: {
					aiOrder(player, card, num) {
						if (num > 0 && _status.event && _status.event.type === "phase" && get.tag(card, "recover")) {
							return num / 5;
						}
					},
				},
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				filter(event, player) {
					return !event.numFixed && player.getDamagedHp() > 0;
				},
				async content(event, trigger, player) {
					trigger.num += player.getDamagedHp();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.tag(card, "recover") && target.hp > 0 && target.needsToDiscard() < 1) {
								return [0, 0];
							}
						},
					},
				},
			},
		},
	},
	//孙权
	sbzhiheng: {
		audio: 2,
		audioname: ["shen_caopi"],
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || get.itemtype(card) !== "card" || get.type(card) !== "equip") {
					return num;
				}
				const eq = player.getEquip(get.subtype(card));
				if (eq && get.equipValue(card) - get.equipValue(eq) < Math.max(1.2, 6 - player.hp)) {
					return 0;
				}
			},
		},
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filterCard: lib.filter.cardDiscardable,
		discard: false,
		lose: false,
		delay: false,
		selectCard: [1, Infinity],
		allowChooseAll: true,
		check(card) {
			const player = _status.event.player;
			if (
				get.position(card) === "h" &&
				!player.countCards("h", "du") &&
				(player.hp > 2 ||
					!player.countCards("h", i => {
						return get.value(i) >= 8;
					}))
			) {
				return 1;
			}
			if (get.position(card) === "e") {
				const subs = get.subtypes(card);
				if (subs.includes("equip2") || subs.includes("equip3")) {
					return player.getHp() - get.value(card);
				}
			}
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			const discard = player.modedDiscard({ cards: event.cards });
			await discard;
			const { cards } = discard;
			let num = cards.length;
			const nums = ["h", "e", "j"].map(p => player.countCards(p));
			const count = {};
			for (const i of nums) {
				count[i] = (count[i] || 0) + 1;
			}
			if (Math.max(...Object.values(count)) > 1) {
				num += Math.max(...Object.values(count));
			}
			await player.draw({ num });
		},
		ai: {
			order(item, player) {
				player ??= get.player();
				if (player.hasCard(i => get.value(i) > Math.max(6, 9 - player.hp), "he")) {
					return 1;
				}
				return 10;
			},
			result: {
				player: 1,
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (!arg || (arg && arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && !player.getStat().skill.sbzhiheng && player.hasCard(card => get.name(card) !== "tao", "h");
				}
			},
			threaten: 1.56,
		},
	},
	sbtongye: {
		audio: 2,
		trigger: { player: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return ["h", "e", "j"].every(pos => {
				return game.hasPlayer(current => {
					return current !== player && current.countCards(pos) === player.countCards(pos);
				});
			});
		},
		async content(event, trigger, player) {
			const card = get.cardPile(card => !player.getStorage(`${event.name}_used`).includes(card.name));
			if (card) {
				await player.gain({ cards: [card], animate: "gain2" });
				player.addSkill(`${event.name}_used`);
				player.markAuto(`${event.name}_used`, [card.name]);
			} else {
				player.chat("无牌可得");
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	sbjiuyuan: {
		audio: 2,
		trigger: { global: "useCard" },
		forced: true,
		zhuSkill: true,
		group: "sbjiuyuan_recover",
		filter(event, player) {
			return event.card.name === "tao" && player !== event.player && event.player.group === "wu" && event.player.isIn() && player.hasZhuSkill("sbjiuyuan", event.player);
		},
		async content(event, trigger, player) {
			await player.draw();
		},
		subSkill: {
			recover: {
				audio: "sbjiuyuan",
				trigger: { target: "taoBegin" },
				zhuSkill: true,
				forced: true,
				filter(event, player) {
					if (event.player === player) {
						return false;
					}
					if (!player.hasZhuSkill("sbjiuyuan", event.player)) {
						return false;
					}
					if (event.player.group !== "wu") {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					trigger.baseDamage++;
				},
			},
		},
	},
	//孙尚香
	sbjieyin: {
		audio: 4,
		dutySkill: true,
		initGroup: "shu",
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return player.getStorage("sbjieyin").includes(event.player);
		},
		logAudio: () => 1,
		async cost(event, trigger, player) {
			const target = trigger.player;
			const num = Math.min(3, game.roundNumber);
			const list = [];
			const choiceList = [`令${get.translation(target)}获得1点护甲`, `获得${get.translation(target)}至多${get.cnNumber(num)}张牌，然后将势力变更为吴`];
			if (target.hujia < 5) {
				list.push("选项一");
			} else {
				choiceList[0] = `<span style="opacity:0.5">${choiceList[0]}</span>`;
			}
			list.push("选项二");
			const result =
				list.length > 1
					? await player
							.chooseControl({
								controls: list,
								choiceList: choiceList,
								prompt: `结姻：请选择一项`,
								ai() {
									const { player, controls, target } = get.event();
									if (get.attitude(player, target) < 0) {
										return "选项二";
									}
									if (controls.includes("选项一")) {
										return "选项一";
									}
									return controls.randomGet();
								},
							})
							.set("target", target)
							.forResult()
					: { control: list[0] };
			if (typeof result?.control === "string") {
				event.result = {
					bool: true,
					cost_data: result.control,
				};
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const link = event.cost_data;
			const target = event.targets[0];
			if (link === "选项一") {
				await target.changeHujia(1, null, true);
			} else {
				const num = Math.min(3, game.roundNumber);
				if (target.countGainableCards(player, "he")) {
					await player.gainPlayerCard({ target, forced: true, position: "he", selectButton: [1, num], allowChooseAll: true });
				}
				await player.changeGroup("wu");
			}
		},
		onremove: true,
		intro: { content: "结姻角色：$" },
		group: ["sbjieyin_init", "sbjieyin_fail", "sbjieyin_achieve"],
		subSkill: {
			fail: {
				audio: "sbjieyin2.mp3",
				trigger: {
					global: "dieAfter",
					player: "changeGroupAfter",
				},
				filter(event, player) {
					if (event.name === "die") {
						return player.getStorage("sbjieyin").includes(event.player);
					}
					return player.group === "wu";
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					if (trigger.name === "die") {
						await player.loseMaxHp();
					}
					player.awakenSkill("sbjieyin");
					game.log(player, "使命失败");
					player.setStorage("sbjieyin", [], true);
					const cards = player.getCards("h", card => get.suit(card) === "heart" && player.canRecast(card));
					if (cards.length) {
						await player.recast(cards);
					}
					await player.draw({ num: 2 });
				},
			},
			achieve: {
				audio: "sbjieyin",
				logAudio: event => (event.player.hujia >= 5 ? "sbjieyin3.mp3" : "sbjieyin4.mp3"),
				trigger: { global: ["changeHujiaEnd", "loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"] },
				skillAnimation: true,
				animationColor: "metal",
				filter(event, player) {
					if (event.name === "changeHujia") {
						return player.getStorage("sbjieyin").includes(event.player) && (event.player.hujia === 5 || event.player.countCards("e") === 4);
					}
					return game.hasPlayer(current => {
						if (!player.getStorage("sbjieyin").includes(current)) {
							return false;
						}
						const evt = event.getl(current);
						if (event.name === "equip" && event.player === current && (!evt || evt.cards.length !== 1)) {
							return current.hujia === 5 || current.countCards("e") === 4;
						}
						return evt?.es?.length && (current.hujia === 5 || current.countCards("e") === 4);
					});
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.awakenSkill("sbjieyin");
					game.log(player, "使命成功");
					player.addSkill("sbjieyin_effect");
					const map = { hujia: false, equip: false };
					if (trigger.name === "changeHujia") {
						const target = trigger.player;
						if (target.hujia === 5) {
							map.hujia = true;
						}
						if (target.countCards("e") === 4) {
							map.equip = true;
						}
					} else {
						const bool1 = game.hasPlayer(current => {
							if (!player.getStorage("sbjieyin").includes(current)) {
								return false;
							}
							const evt = trigger.getl(current);
							if (trigger.name === "equip" && trigger.player === current && (!evt || evt.cards.length !== 1)) {
								return current.hujia === 5;
							}
							return evt?.es?.length && current.hujia === 5;
						});
						const bool2 = game.hasPlayer(current => {
							if (!player.getStorage("sbjieyin").includes(current)) {
								return false;
							}
							const evt = trigger.getl(current);
							if (trigger.name === "equip" && trigger.player === current && (!evt || evt.cards.length !== 1)) {
								return current.countCards("e") === 4;
							}
							return evt?.es?.length && current.countCards("e") === 4;
						});
						if (bool1) {
							map.hujia = true;
						}
						if (bool2) {
							map.equip = true;
						}
					}
					player.setStorage("sbjieyin_effect", map, true);
				},
			},
			init: {
				audio: "sbjieyin1.mp3",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return game.hasPlayer(current => current !== player && !player.getStorage("sbjieyin").includes(current)) && (event.name !== "phase" || game.phaseNumber === 0);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget({
							forced: true,
							prompt: "请选择一名其他角色为“结姻”角色",
							filterTarget(card, player, target) {
								return player !== target && !player.getStorage("sbjieyin").includes(target);
							},
							ai(target) {
								const player = get.player();
								return get.attitude(player, target);
							},
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.markAuto("sbjieyin", target);
					if (target.identityShown && (get.mode() !== "identity" || player.identity !== "nei")) {
						player.addExpose(0.3);
					}
					await game.delayx();
				},
			},
			effect: {
				audio: "sbjieyin",
				charlotte: true,
				onremove: true,
				intro: {
					content(storage = { hujia: false, equip: false }, player) {
						if (!storage.hujia && !storage.equip) {
							return "无加成";
						}
						let str = "";
						if (storage.equip) {
							str += "发动【枭姬】后，本回合使用【杀】的次数上限+1";
						}
						if (storage.hujia) {
							if (storage.equip) {
								str += "，且若为本轮首次发动，则你获得1点护甲";
							} else {
								str += "每轮首次发动【枭姬】后，获得1点护甲";
							}
						}
						return str;
					},
				},
				trigger: { player: "logSkill" },
				filter(event, player) {
					if (event.skill !== "sbxiaoji") {
						return false;
					}
					if (
						player.getStorage("sbjieyin_effect", {}).hujia &&
						player
							.getRoundHistory("useSkill", evt => evt.skill === "sbxiaoji")
							.map(evt => evt.event)
							.indexOf(event.log_event) === 0
					) {
						return true;
					}
					if (player.getStorage("sbjieyin_effect", {}).equip) {
						return true;
					}
					return false;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					if (
						player.getStorage(event.name, {}).hujia &&
						player
							.getRoundHistory("useSkill", evt => evt.skill === "sbxiaoji")
							.map(evt => evt.event)
							.indexOf(trigger.log_event) === 0
					) {
						await player.changeHujia(1, null, true);
					}
					if (player.getStorage(event.name, {}).equip) {
						player.addTempSkill("sbjieyin_sha");
						player.addMark("sbjieyin_sha", 1, false);
					}
				},
			},
			sha: {
				charlotte: true,
				onremove: true,
				marktext: "枭",
				intro: { content: "本回合使用【杀】的次数+#" },
				mod: {
					cardUsable(card, player, num) {
						if (card.name === "sha") {
							return num + player.countMark("sbjieyin_sha");
						}
					},
				},
			},
		},
		derivation: "sbxiaoji",
	},
	sbliangzhu: {
		audio: 2,
		groupSkill: "shu",
		trigger: { global: "recoverAfter" },
		filter(event, player) {
			if (player.group !== "shu") {
				return false;
			}
			const targets = game.filterPlayer(current => player.getStorage("sbjieyin").includes(current));
			if (targets.includes(event.player)) {
				return true;
			}
			return player === event.player && targets.length > 0;
		},
		forced: true,
		logTarget(event, player) {
			const targets = game.filterPlayer(current => player.getStorage("sbjieyin").includes(current));
			if (event.player === player) {
				return targets.sortBySeat();
			}
			return player;
		},
		async content(event, trigger, player) {
			await game.asyncDraw(event.targets);
		},
		group: "sbliangzhu_effect",
		subSkill: {
			effect: {
				audio: "sbliangzhu",
				trigger: { player: "phaseUseEnd" },
				filter(event, player) {
					if (player.group !== "shu") {
						return false;
					}
					return player.isDamaged() || game.hasPlayer(current => player.getStorage("sbjieyin").includes(current));
				},
				forced: true,
				async content(event, trigger, player) {
					if (player.isHealthy()) {
						const targets = game.filterPlayer(current => player.getStorage("sbjieyin").includes(current));
						if (!targets.length) {
							return;
						}
						const cards = ["cardPile", "discardPile"]
							.map(pos => Array.from(ui[pos].childNodes))
							.flat()
							.filter(card => get.type(card) === "equip")
							.randomGets(3);
						if (cards.length) {
							const result = await player
								.chooseButtonTarget({
									createDialog: [`良助：令一名“结姻”角色获得其中一张装备牌`, cards],
									filterTarget(card, player, target) {
										return get.event().targets?.includes(target);
									},
									forced: true,
									ai1(button) {
										return get.value(button.link);
									},
									ai2(target) {
										return get.attitude(get.player(), target);
									},
									targets,
								})
								.forResult();
							if (result?.bool && result.links?.length && result.targets?.length) {
								const card = result.links[0];
								const target = result.targets[0];
								await target.gain({ cards: [card], giver: player, animate: "draw" });
								if (target.hasUseTarget(card) && target.getCards("h").includes(card) && get.type(card, target) === "equip" && target.hasEmptySlot(get.equiptype(card))) {
									await target.chooseUseTarget({ card, forced: true, addCount: false });
								}
							}
						} else {
							player.chat("没有装备？");
						}
					} else {
						await player.recover();
					}
				},
			},
		},
	},
	sbxiaoji: {
		//玩家是否有成功/失败的使命技
		hasAchievedDutySkill(player, achieved = true) {
			const branch = achieved ? "_achieve" : "_fail";
			return player.hasAllHistory("useSkill", evt => {
				const skills = [evt.skill];
				game.expandSkills(skills, true);
				for (const skill of skills) {
					const sourceSkill = get.sourceSkillFor(skill);
					const info = get.info(sourceSkill);
					return skill.endsWith(branch) && player.awakenedSkills.includes(sourceSkill) && info?.dutySkill;
				}
			});
		},
		audio: 2,
		trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
		forced: true,
		locked: false,
		getIndex(event, player) {
			const cards = [];
			const bool = get.info("sbxiaoji").hasAchievedDutySkill(player);
			const targets = game.filterPlayer(current => {
				return current === player || (bool && player.getStorage("sbjieyin").includes(current));
			});
			return targets.reduce((num, current) => {
				const evt = event.getl?.(current);
				return num + (evt?.es?.length || 0);
			}, 0);
		},
		async content(event, trigger, player) {
			await player.draw({ num: 2 });
			const bool = get.info(event.name).hasAchievedDutySkill(player, false);
			if (game.hasPlayer(current => current.hasDiscardableCards(player, "ej")) && bool) {
				const result = await player
					.chooseTarget({
						prompt: "枭姬：你可以弃置场上的一张牌",
						filterTarget(card, player, target) {
							return target.hasDiscardableCards(player, "ej");
						},
						ai(target) {
							const player = get.player();
							return get.effect(target, { name: "guohe_copy", position: "ej" }, player, player);
						},
					})
					.forResult();
				if (result?.bool && result?.targets?.length) {
					await player.discardPlayerCard({ target: result.targets[0], position: "ej", forced: true });
				}
			}
		},
		ai: {
			noe: true,
			reverseEquip: true,
			effect: {
				target(card, player, target, current) {
					if (get.type(card) === "equip" && !get.cardtag(card, "gifts")) {
						return [1, 3];
					}
				},
			},
		},
	},
	//吕蒙
	sbkeji: {
		audio: 2,
		enable: "phaseUse",
		filterCard: true,
		selectCard() {
			const player = _status.event.player;
			const list = player.getStorage("sbkeji_used");
			if (list.includes("discard")) {
				return [0, 0];
			}
			if (list.includes("losehp")) {
				return [1, 1];
			}
			return [0, 1];
		},
		locked: false,
		usable: 2,
		prompt(event) {
			const player = _status.event.player;
			const discard = player.getStorage("sbkeji_used").includes("discard");
			const losehp = player.getStorage("sbkeji_used").includes("losehp");
			const options = [];
			if (!discard) {
				options.push("弃置一张手牌并获得1点护甲");
			}
			if (!losehp) {
				options.push("点击“确定”失去1点体力并获得2点护甲");
			}
			return `出牌阶段${player.storage.sbkeji ? "" : "各"}限一次。你可以${options.join("，或")}`;
		},
		filter(event, player) {
			return (player.getStat("skill").sbkeji || 0) < (player.storage.sbkeji ? 1 : 2);
		},
		check(card) {
			const player = _status.event.player;
			if (player.hp === 1 && player.canSave(player) && player.hujia <= 3) {
				return 0;
			}
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			const { cards } = event;
			player.addTempSkill("sbkeji_used", "phaseUseAfter");
			if (cards.length) {
				const changeHujiaEvent = player.changeHujia(1, null, true);
				player.markAuto("sbkeji_used", "discard");
				await changeHujiaEvent;
				return;
			}
			await player.loseHp();
			const changeHujiaEvent = player.changeHujia(2, null, true);
			player.markAuto("sbkeji_used", "losehp");
			await changeHujiaEvent;
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.hujia;
			},
			cardEnabled(card, player) {
				if (player !== _status.event.dying && card.name === "tao") {
					return false;
				}
			},
			cardSavable(card, player) {
				if (player !== _status.event.dying && card.name === "tao") {
					return false;
				}
			},
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (player.hujia >= 5) {
						return 0;
					}
					if (player.hp === 1 && !player.canSave(player) && !player.hasCard(card => lib.filter.cardDiscardable(card, player, "sbkeji") && get.value(card) < 6, "h")) {
						return 0;
					}
					return 1;
				},
			},
		},
		subSkill: {
			used: { charlotte: true, onremove: true },
		},
	},
	sbdujiang: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		derivation: "sbduojing",
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "wood",
		filter(event, player) {
			return player.hujia >= 3;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const addSkillsEvent = player.addSkills("sbduojing");
			player.storage.sbkeji = true;
			await addSkillsEvent;
		},
		ai: {
			combo: "sbkeji",
		},
	},
	sbduojing: {
		audio: 2,
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			return player.hujia > 0 && event.card.name === "sha";
		},
		check(event, player) {
			return (
				(get.attitude(player, event.target) <= 0 && event.target.countGainableCards(player, "h") > 0) ||
				(player.getCardUsable("sha") === 0 &&
					player.countCards("hs", card => {
						if (get.name(card) !== "sha") {
							return false;
						}
						return player.hasValueTarget(card, true, true);
					}) > 0)
			);
		},
		logTarget: "target",
		async content(event, trigger, player) {
			await player.changeHujia(-1);
			trigger.card.storage ??= {};
			trigger.card.storage.sbduojing = true;
			const { target } = trigger;
			if (target.countGainableCards(player, "h") > 0) {
				await player.gainPlayerCard({ target, position: "h", forced: true });
			}
			player.addTempSkill("sbduojing_add", "phaseUseAfter");
			player.addMark("sbduojing_add", 1, false);
		},
		subSkill: {
			add: {
				charlotte: true,
				marktext: "夺",
				onremove: true,
				intro: { content: "本阶段使用杀次数上限+$" },
				mod: {
					cardUsable(card, player, num) {
						if (card.name === "sha") {
							return num + player.countMark("sbduojing_add");
						}
					},
				},
			},
		},
		ai: {
			unequip: true,
			unequip_ai: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "unequip" && !arg?.card?.storage?.sbduojing) {
					return false;
				}
				if (tag === "unequip_ai" && (!arg || arg.name !== "sha" || player.hujia <= 0)) {
					return false;
				}
			},
		},
	},
	//于禁
	sbxiayuan: {
		audio: 2,
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.hujia && !event.player.hujia && event.player.isIn() && player.countCards("h") > 1 && !player.hasSkill("sbxiayuan_round", null, false, false);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard({
					selectCard: 2,
					position: "h",
					prompt: get.prompt("sbxiayuan", trigger.player),
					prompt2: `弃置两张手牌，令其获得${get.cnNumber(trigger.hujia)}点护甲`,
					chooseonly: true,
					ai: card => (_status.event.goon ? 5 - get.value(card) : 0),
				})
				.set("goon", get.attitude(player, trigger.player) > 0)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.addTempSkill("sbxiayuan_round", "roundStart");
			player.discard({ cards: event.cards });
			const target = trigger.player;
			await target.changeHujia(trigger.hujia, null, true);
			await game.delayx();
		},
		subSkill: { round: { charlotte: true } },
		ai: {
			combo: "sbjieyue",
			expose: 0.2,
		},
	},
	sbjieyue: {
		audio: 4,
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("sbjieyue"),
					prompt2: "令一名其他角色获得1点护甲，然后该角色可以交给你一张牌。",
					filterTarget: lib.filter.notMe,
					ai(target) {
						return get.attitude(_status.event.player, target) / Math.sqrt(Math.min(1, target.hp + target.hujia));
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.changeHujia(1, null, true);
			const result = await target
				.chooseCard({
					prompt: `是否交给${get.translation(player)}一张牌？`,
					position: "he",
					ai(card) {
						return 0.1 - get.value(card);
					},
				})
				.forResult();
			if (result.bool && result.cards?.length) {
				target.give(result.cards, player);
			}
		},
		ai: {
			threaten: 2.7,
			expose: 0.2,
		},
	},
	//华雄
	sbyangwei: {
		audio: 2,
		enable: "phaseUse",
		async content(event, trigger, player) {
			const drawEvent = player.draw(2);
			player.tempBanSkill("sbyangwei", "forever");
			player.addTempSkill("sbyangwei_effect");
			player.addSkill("sbyangwei_counter");
			await drawEvent;
		},
		ai: {
			order: 9,
			result: { player: 1 },
		},
		subSkill: {
			effect: {
				audio: "sbyangwei",
				equipSkill: false,
				inherit: "qinggang_skill",
				charlotte: true,
				nopop: true,
				mod: {
					targetInRange(card) {
						if (card.name === "sha") {
							return true;
						}
					},
					cardUsable(card, player, num) {
						if (card.name === "sha") {
							return num + 1;
						}
					},
				},
				mark: true,
				marktext: "威",
				intro: { content: "使用【杀】的次数上限+1且无距离限制且无视防具" },
			},
			counter: {
				trigger: { player: "phaseJieshu" },
				silent: true,
				popup: false,
				forced: true,
				charlotte: true,
				onremove: true,
				async content(event, trigger, player) {
					if (!player.storage.sbyangwei_counter) {
						player.storage.sbyangwei_counter = true;
					} else {
						player.removeSkill("sbyangwei_counter");
						delete player.storage[`temp_ban_sbyangwei`];
					}
				},
			},
		},
	},
	//黄忠
	sbliegong: {
		audio: 2,
		mod: {
			cardnature(card, player) {
				if (!player.getVEquip(1) && get.name(card, player) === "sha") {
					return false;
				}
			},
		},
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return !event.getParent()._sbliegong_player && event.targets.length === 1 && event.card.name === "sha" && player.getStorage("sbliegong").length > 0;
		},
		prompt2(event, player) {
			const storage = player.getStorage("sbliegong");
			const prefix = storage.length > 1 ? `亮出牌堆顶的${get.cnNumber(storage.length - 1)}张牌并增加伤害；且` : "";
			const suits = storage.map(suit => get.translation(suit)).join("");
			return `${prefix}令${get.translation(event.target)}不能使用花色为${suits}的牌响应${get.translation(event.card)}`;
		},
		logTarget: "target",
		locked: false,
		check(event, player) {
			const target = event.target;
			if (get.attitude(player, target) > 0) {
				return false;
			}
			if (
				target.hasSkillTag("filterDamage", null, {
					player: player,
					card: event.card,
				})
			) {
				return false;
			}
			const storage = player.getStorage("sbliegong");
			if (storage.length >= 4) {
				return true;
			}
			if (storage.length < 3) {
				return false;
			}
			if (target.hasShan()) {
				return storage.includes("heart") && storage.includes("diamond");
			}
			return true;
		},
		async content(event, trigger, player) {
			const storage = player.getStorage("sbliegong").slice(0);
			const num = storage.length - 1;
			const evt = trigger.getParent();
			if (num > 0) {
				if (typeof evt.baseDamage !== "number") {
					evt.baseDamage = 1;
				}
				const cards = get.cards(num);
				await game.cardsGotoOrdering(cards);
				await player.showCards(cards.slice(0), `${get.translation(player)}发动了【烈弓】`);
				while (cards.length > 0) {
					const card = cards.pop();
					if (storage.includes(get.suit(card, false))) {
						evt.baseDamage++;
					}
					//ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
				}
				//game.updateRoundNumber();
			}
			evt._sbliegong_player = player;
			player.addTempSkill("sbliegong_clear");
			const target = trigger.target;
			target.addTempSkill("sbliegong_block");
			if (!target.storage.sbliegong_block) {
				target.storage.sbliegong_block = [];
			}
			target.storage.sbliegong_block.push([evt.card, storage]);
			lib.skill.sbliegong.updateBlocker(target);
		},
		updateBlocker(player) {
			const list = [];
			const storage = player.storage.sbliegong_block;
			if (storage?.length) {
				for (const i of storage) {
					list.addArray(i[1]);
				}
			}
			player.storage.sbliegong_blocker = list;
		},
		ai: {
			threaten: 3.5,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (arg?.card?.name === "sha") {
					const storage = player.getStorage("sbliegong");
					if (storage.length < 3 || !storage.includes("heart") || !storage.includes("diamond")) {
						return false;
					}
					const target = arg.target;
					if (target.hasSkill("bagua_skill") || target.hasSkill("bazhen") || target.hasSkill("rw_bagua_skill")) {
						return false;
					}
					return true;
				}
				return false;
			},
		},
		intro: {
			content: "已记录花色：$",
			onunmark: true,
		},
		onremove(player, skill) {
			delete player.storage[skill];
			player.removeTip(skill);
		},
		group: "sbliegong_count",
		subSkill: {
			clear: {
				trigger: { player: "useCardAfter" },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return event._sbliegong_player === player;
				},
				async content(event, trigger, player) {
					player.unmarkSkill("sbliegong");
					player.removeTip("sbliegong");
				},
			},
			block: {
				mod: {
					cardEnabled(card, player) {
						if (!player.storage.sbliegong_blocker) {
							return;
						}
						const suit = get.suit(card);
						if (suit === "none") {
							return;
						}
						let evt = _status.event;
						if (evt.name !== "chooseToUse") {
							evt = evt.getParent("chooseToUse");
						}
						const cards = player.storage.sbliegong_block.map(i => i[0]);
						if (!evt || !evt.respondTo || !cards.includes(evt.respondTo[1])) {
							return;
						}
						if (player.storage.sbliegong_blocker.includes(suit)) {
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
					delete player.storage.sbliegong_block;
					delete player.storage.sbliegong_blocker;
				},
				filter(event, player) {
					const evt = event.getParent("useCard", true, true);
					if (evt && evt.effectedCount < evt.effectCount) {
						return false;
					}
					if (!event.card || !player.storage.sbliegong_block) {
						return false;
					}
					return player.storage.sbliegong_block.some(i => i[0] === event.card);
				},
				async content(event, trigger, player) {
					const storage = player.storage.sbliegong_block;
					for (const item of storage.slice()) {
						if (item[0] === trigger.card) {
							storage.remove(item);
						}
					}
					if (!storage.length) {
						player.removeSkill(event.name);
					} else {
						lib.skill.sbliegong.updateBlocker(player);
					}
				},
			},
			count: {
				trigger: {
					player: "useCard",
					target: "useCardToTargeted",
				},
				forced: true,
				locked: false,
				popup: false,
				filter(event, player, name) {
					if (name !== "useCard" && player === event.player) {
						return false;
					}
					const suit = get.suit(event.card);
					if (!lib.suit.includes(suit)) {
						return false;
					}
					if (player.storage.sbliegong?.includes(suit)) {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					player.markAuto("sbliegong", [get.suit(trigger.card)]);
					player.storage.sbliegong.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
					const suits = player
						.getStorage("sbliegong")
						.map(suit => get.translation(suit))
						.join("");
					player.addTip("sbliegong", `${get.translation("sbliegong")}${suits}`);
				},
			},
		},
	},
	//刘赪
	splveying: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		forced: true,
		locked: false,
		filter(event, player) {
			return event.card.name === "sha" && player.countMark("splveying") > 1;
		},
		async content(event, trigger, player) {
			player.removeMark("splveying", 2);
			await player.draw();
			await player.chooseUseTarget({ card: { name: "guohe", isCard: true } });
		},
		marktext: "椎",
		intro: {
			name: "椎(掠影/莺舞)",
			name2: "椎",
			content: "mark",
		},
		group: "splveying_add",
		subSkill: {
			add: {
				audio: "splveying",
				trigger: { player: "useCardToPlayered" },
				forced: true,
				locked: false,
				filter(event, player) {
					return event.card.name === "sha" && player.isPhaseUsing() && player.countMark("splveying_used") < 2 && player != event.target;
				},
				async content(event, trigger, player) {
					player.addMark("splveying", 1);
					player.addTempSkill("splveying_used", "phaseUseEnd");
					player.addMark("splveying_used", 1);
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	spyingwu: {
		group: "spyingwu_add",
		audio: 2,
		trigger: { player: "useCardAfter" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player.hasSkill("splveying", null, null, false) && get.type(event.card) === "trick" && !get.tag(event.card, "damage") && player.countMark("splveying") > 1;
		},
		async content(event, trigger, player) {
			player.removeMark("splveying", 2);
			await player.draw();
			await player.chooseUseTarget({ card: { name: "sha", isCard: true }, addCount: false });
		},
		ai: { combo: "splveying" },
		subSkill: {
			add: {
				audio: "spyingwu",
				trigger: { player: "useCardToPlayered" },
				forced: true,
				locked: false,
				filter(event, player) {
					return player.hasSkill("splveying") && get.type(event.card) === "trick" && !get.tag(event.card, "damage") && player.isPhaseUsing() && player.countMark("spyingwu_used") < 2;
				},
				async content(event, trigger, player) {
					player.addMark("splveying", 1);
					player.addTempSkill("spyingwu_used", "phaseUseEnd");
					player.addMark("spyingwu_used", 1);
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//手杀杨婉
	spmingxuan: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		forced: true,
		filter(event, player) {
			const list = player.getStorage("spmingxuan");
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(current => {
					return current !== player && !list.includes(current);
				})
			);
		},
		async content(event, trigger, player) {
			const suits = player
				.getCards("h")
				.map(card => get.suit(card, player))
				.toUniqued();
			const targets = game.filterPlayer(current => {
				return current !== player && !player.getStorage(event.name).includes(current);
			});
			const numx = Math.min(suits.length, targets.length);
			const result = await player
				.chooseCard({
					position: "h",
					forced: true,
					selectCard: [1, numx],
					prompt: `瞑昡：请选择至多${get.cnNumber(numx)}张花色各不相同的手牌`,
					filterCard: (card, player) => ui.selected.cards.every(cardx => get.suit(cardx, player) !== get.suit(card, player)),
				})
				.set("complexCard", true)
				.set("ai", card => 6 - get.value(card))
				.forResult();
			if (!result?.bool || !result.cards?.length) {
				return;
			}
			const cards = result.cards.randomSort();
			const targets2 = targets.randomGets(cards.length).sortBySeat();
			player.line(targets2, "green");
			const gain_list = targets2.map((target, index) => {
				return [target, cards[index]];
			});
			await game
				.loseAsync({
					gain_list,
					player,
					cards,
					giver: player,
					animate: "giveAuto",
				})
				.setContent("gaincardMultiple");
			await game.delayx();
			let num = 0;
			for (const target of targets2) {
				if (!target.isIn()) {
					continue;
				}
				const result2 = await target
					.chooseToUse({
						filterCard: (card, player, event) => {
							if (get.name(card) !== "sha") {
								return false;
							}
							return lib.filter.filterCard(card, player, event);
						},
						prompt: `对${get.translation(player)}使用一张杀，否则交给其一张牌，且其摸一张牌`,
					})
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("complexTarget", true)
					.set("filterTarget", (card, player, target) => {
						if (target !== _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.filterTarget(card, player, target);
					})
					.set("sourcex", player)
					.set("addCount", false)
					.forResult();
				if (result2?.bool) {
					num++;
					player.markAuto(event.name, target);
				} else {
					num--;
					const hs = target.getCards("he");
					if (!hs.length) {
						continue;
					}
					const result = await target.chooseToGive({ target: player, position: "he", forced: true }).forResult();
					await player.draw();
				}
				if (Math.abs(num) === targets2.length) {
					const result2 = await player
						.chooseTarget({ prompt: "是否令一名未被记录的角色视为使用一张杀？", filterTarget: (card, player, target) => get.event().targetx.includes(target) })
						.set(
							"targetx",
							game.filterPlayer(current => {
								return !player.getStorage(event.name).includes(current);
							})
						)
						.set("ai", target => {
							const player = get.player();
							const card = new lib.element.VCard({ name: "sha", isCard: true });
							return target.getUseValue(card) * get.attitude(player, target);
						})
						.forResult();
					if (result2?.bool) {
						const target = result2.targets[0];
						const card = new lib.element.VCard({ name: "sha", isCard: true });
						if (target.hasUseTarget(card)) {
							await target.chooseUseTarget({ card, forced: true, addCount: false });
						}
					}
				}
			}
		},
		intro: { content: "已被$使用过杀" },
	},
	spxianchou: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return (
				event.source?.isIn() &&
				event.source !== player &&
				game.hasPlayer(current => {
					return current !== player && current !== event.source;
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					filterTarget: (card, player, target) => {
						const { source } = get.event().getTrigger();
						return target !== player && target !== source;
					},
				})
				.set("ai", target => {
					const card = new lib.element.VCard({ name: "sha", isCard: true });
					const { source } = get.event().getTrigger();
					if (get.attitude(target, get.player()) <= 0) {
						return 0;
					}
					return get.effect(source, card, target, get.player()) * Math.sqrt(target.countCards("he"));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			const result = await target
				.chooseToDiscard({ position: "he", prompt: `是否弃置一张牌，视为对${get.translation(trigger.source)}使用一张【杀】？` })
				.set("ai", card => {
					return get.event().goon - get.value(card);
				})
				.set(
					"goon",
					(() => {
						let eff = get.recoverEffect(player, target, target);
						if (target.canUse(card, trigger.source, false)) {
							eff += get.effect(trigger.source, card, target, target);
						}
						return eff;
					})()
				)
				.forResult();
			if (!result?.bool || !target.canUse(card, trigger.source, false)) {
				return;
			}
			const next = target.useCard({ card, targets: [trigger.source], addCount: false });
			await next;
			if (
				target.hasHistory("sourceDamage", evt => {
					return evt.card === next.card && evt.getParent("useCard") === next;
				})
			) {
				await target.draw();
				await player.recover();
			}
		},
	},
	new_spxianchou: {
		audio: "spxianchou",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return (
				event.source?.isIn() &&
				event.source !== player &&
				game.hasPlayer(current => {
					return current !== player && current !== event.source;
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					filterTarget: (card, player, target) => {
						const { source } = get.event().getTrigger();
						return target !== player && target !== source;
					},
				})
				.set("ai", target => {
					const card = new lib.element.VCard({ name: "sha", isCard: true });
					const { source } = get.event().getTrigger();
					if (get.attitude(target, get.player()) <= 0) {
						return 0;
					}
					return get.effect(source, card, target, get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			if (!target.canUse(card, trigger.source, false)) {
				return;
			}
			const result = await target
				.chooseBool({ prompt: `是否视为对${get.translation(trigger.source)}使用一张杀？` })
				.set("choice", get.effect(trigger.source, card, target, target) + get.recoverEffect(player, player, target) > 0)
				.forResult();
			if (!result?.bool) {
				return;
			}
			const next = target.useCard({ card, targets: [trigger.source], addCount: false });
			await next;
			if (
				target.hasHistory("sourceDamage", evt => {
					return evt.card === next.card && evt.getParent("useCard") === next;
				})
			) {
				await player.recover();
				await target.draw();
			}
		},
	},
	//陆逊
	sbqianxun: {
		audio: 2,
		trigger: {
			target: "useCardToBegin",
			player: "judgeBefore",
		},
		filter(event, player) {
			if (!event.card || player.getStorage("sbqianxun").includes(event.card.viewAs || event.card.name)) {
				return false;
			}
			if (event.getParent().name === "phaseJudge") {
				return true;
			}
			if (event.name === "judge") {
				return false;
			}
			if (get.type(event.card) === "trick" && event.player !== player) {
				return true;
			}
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			player.markAuto("sbqianxun", [trigger.card.viewAs || trigger.card.name]);
			if (player.countCards("he")) {
				const num = Math.min(5, player.getStorage("sbqianxun").length);
				const result = await player
					.chooseCard({ prompt: get.prompt(event.name), prompt2: `将至多${get.cnNumber(num)}张牌置于武将牌上`, position: "he", selectCard: [1, num] })
					.set("ai", card => {
						return 4 - get.value(card);
					})
					.forResult();
				if (result.bool) {
					player.addToExpansion({
						cards: result.cards,
						source: player,
						animate: "giveAuto",
						gaintag: ["sbqianxun_gain"],
					});
					player.addSkill("sbqianxun_gain");
				}
			}
		},
		onremove: true,
		intro: {
			content: "已记录牌名：$",
		},
		group: "sbqianxun_use",
		subSkill: {
			use: {
				audio: "sbqianxun",
				trigger: {
					player: "phaseUseBegin",
				},
				filter(event, player) {
					return player.getStorage("sbqianxun").some(name => {
						if (get.type(name) !== "trick") {
							return false;
						}
						return player.hasUseTarget(name);
					});
				},
				async cost(event, trigger, player) {
					const list = player.getStorage("sbqianxun").map(name => ["锦囊", "", name]);
					const result = await player
						.chooseButton({ createDialog: [get.prompt(event.skill), "移去一个记录的牌名，若为普通锦囊牌则可以视为使用之", [list, "vcard"]] })
						.set("ai", button => {
							const player = get.player();
							const card = { name: button.link[2], isCard: true };
							return player.getUseValue(card);
						})
						.set("filterButton", button => {
							return true;
						})
						.forResult();
					event.result = {
						bool: result.bool,
						cost_data: result.bool ? result.links[0][2] : [],
					};
				},
				async content(event, trigger, player) {
					const name = event.cost_data;
					player.unmarkAuto("sbqianxun", [name]);
					const card = { name: name, isCard: true };
					if (get.type(card) === "trick" && player.hasUseTarget(card)) {
						await player.chooseUseTarget({ card, prompt: `是否视为使用【${get.translation(name)}】？` });
					}
				},
			},
			gain: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				charlotte: true,
				async content(event, trigger, player) {
					const cards = player.getExpansions("sbqianxun_gain");
					if (cards.length) {
						await player.gain({ cards, animate: "draw" });
					}
					player.removeSkill("sbqianxun_gain");
				},
				intro: {
					mark(dialog, storage, player) {
						const cards = player.getExpansions("sbqianxun_gain");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return `共有${get.cnNumber(cards.length)}张牌`;
						}
					},
					markcount: "expansion",
				},
			},
		},
	},
	sblianying: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return event.player !== player;
		},
		frequent: true,
		async content(event, trigger, player) {
			let num = 1;
			player.getHistory("lose", evt => {
				if (evt.cards2) {
					num += evt.cards2.length;
				}
			});
			num = Math.min(5, num);
			const cards = get.cards(num);
			await game.cardsGotoOrdering(cards);
			if (!cards.length) {
				return;
			}
			do {
				const result =
					cards.length > 1
						? await player
								.chooseButtonTarget({
									createDialog: [`连营：请选择要分配的牌和目标`, cards],
									forced: true,
									allowChooseAll: true,
									selectButton: [1, Infinity],
									cardsx: cards,
									ai1(button) {
										return get.value(button.link);
									},
									ai2(target) {
										const player = get.player();
										const card = ui.selected.buttons[0].link;
										if (card) {
											return get.value(card, target) * get.attitude(player, target);
										}
										return 1;
									},
								})
								.forResult()
						: await player
								.chooseTarget({ prompt: `选择一名角色获得${get.translation(cards)}`, forced: true })
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
								.set("enemy", get.value(cards[0], player, "raw") < 0)
								.forResult();
				if (result?.bool) {
					if (!result.links?.length) {
						result.links = cards.slice(0);
					}
					cards.removeArray(result.links);
					player.line(result.targets, "green");
					const gainEvent = result.targets[0].gain({ cards: result.links, animate: "draw" });
					gainEvent.giver = player;
					await gainEvent;
				}
			} while (cards.length > 0);
		},
	},
};

export default skills;
