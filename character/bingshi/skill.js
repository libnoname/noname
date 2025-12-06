import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//potential--潜在, 潜力, 可能, 电位, 潜能, 势
	//势陈矫
	potqingyan: {
		audio: 3,
		enable: "chooseToUse",
		onChooseToUse(event) {
			if (game.online) {
				return;
			}
			const num = Math.min(event.player.getRoundHistory("useSkill", evt => evt.skill == "potqingyan").length + 1, 5);
			event.set("qingyanCount", num);
		},
		filter(event, player) {
			if (player.countCards("h", card => card.hasGaintag("potqingyan"))) {
				return false;
			}
			if (player.countCards("h") < event.qingyanCount) {
				return false;
			}
			return ["shan", "wuxie"].some(name => {
				const card = new lib.element.VCard({ name, isCard: true });
				return event.filterCard(card, player, event);
			});
		},
		chooseButton: {
			dialog(event, player) {
				const list = ["shan", "wuxie"].filter(name => {
					const card = new lib.element.VCard({ name, isCard: true });
					return event.filterCard(card, player, event);
				});
				const dialog = ui.create.dialog("清严", [list, "vcard"], "hidden");
				dialog.direct = true;
				return dialog;
			},
			backup(links, player) {
				const num = get.event().qingyanCount;
				return {
					filterCard: true,
					ignoreMod: true,
					position: "h",
					selectCard: num,
					popname: true,
					viewAs: {
						name: links[0][2],
						isCard: true,
						suit: "none",
						number: null,
					},
					log: false,
					async precontent(event, trigger, player) {
						player.logSkill("potqingyan");
						const evt = event.result;
						await player.showCards(evt.cards, `${get.translation(player)}发动了【清严】`);
						player.addGaintag(evt.cards, "potqingyan");
						evt.card = new lib.element.VCard({ name: evt.card.name, isCard: true });
						evt.cards = [];
					},
				};
			},
			prompt(links, player) {
				const event = get.event();
				return `###清严###展示${get.cnNumber(event.qingyanCount)}张手牌，视为使用一张${get.translation(links[0][2])}`;
			},
		},
		hiddenCard(player, name) {
			if (!["shan", "wuxie"].includes(name)) {
				return false;
			}
			if (player.countCards("h", card => card.hasGaintag("potqingyan"))) {
				return false;
			}
			const num = player.getRoundHistory("useSkill", evt => evt.skill == "potqingyan").length + 1;
			return player.countCards("h") >= num;
		},
		ai: {
			order(item, player) {
				player ??= get.player();
				return get.order({ name: "shan" }, player) + 0.1;
			},
			result: {
				player: 1,
			},
		},
	},
	potceduan: {
		audio: 3,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.inRange(player);
		},
		async content(event, trigger, player) {
			const { target } = event,
				targets = game.filterPlayer(current => target.inRange(current) && current.countCards("h"));
			const map = await game.chooseAnyOL(targets, get.info(event.name).showCard, []).forResult();
			const cards = [];
			for (const target of targets) {
				const result = map.get(target);
				if (result?.bool && result.cards?.length) {
					cards.addArray(result.cards);
				}
			}
			if (!cards?.length) {
				return;
			}
			await player.showCards(cards, `${get.translation(player)}发动了【策断】`).set("showers", targets);
			const colorMap = new Map();
			for (const card of cards) {
				const color = get.color(card);
				let num = 0;
				if (colorMap.has(color)) {
					num = colorMap.get(color);
				}
				num++;
				colorMap.set(color, num);
			}
			const colors = Array.from(colorMap.keys()),
				maxColor = colors.maxBy(color => colorMap.get(color));
			if (!maxColor) {
				return;
			}
			const num = colorMap.get(maxColor);
			const cards2 = player.getCards("h", card => {
				const color = get.color(card);
				return colorMap.has(color) && colorMap.get(color) == num;
			});
			if (cards2.length) {
				const card = get.autoViewAs({ name: "sha" }, cards2);
				if (player.canUse(card, target, false, true)) {
					const next = player.useCard(card, cards2, target, false);
					await next;
					if (player.hasHistory("sourceDamage", evt => evt.getParent(2) == next)) {
						await player.draw();
					}
				}
			}
		},
		showCard(player, eventId) {
			const next = player.chooseCard("策断：展示一张手牌", "h", true);
			next.set("id", eventId);
			next.set("_global_waiting", true);
			return next;
		},
		ai: {
			order(item, player) {
				player ??= get.player();
				return get.order({ name: "sha" }, player) + 0.1;
			},
			result: {
				target(player, target) {
					const card = get.autoViewAs({ name: "sha" }, "unsure");
					if (player.canUse(card, target, false, true)) {
						return get.effect(target, card, player, target);
					}
					return 0;
				},
				player(player) {
					if (player.countCards("h") >= 4) {
						return -3;
					}
					return -1;
				},
			},
		},
	},
	//势邓艾（神笔三技能互绑的三血白）
	pottuntian: {
		audio: 2,
		beginMarkCount: 1,
		chargeSkill: 3,
		getNum(player) {
			const num = game
				.getGlobalHistory("everything", evt => {
					if (evt.player != player || evt.name != "removeMark") {
						return false;
					}
					return evt.markName == "charge";
				})
				.reduce((sum, evt) => sum + evt.num, 0);
			return num;
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCharge();
		},
		filterTarget(event, player, target) {
			return target.countCards("he");
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.removeCharge();
			const cards = await target
				.chooseCard("he", true, "选择一张牌置于" + get.translation(player) + "的武将牌上作为「田」")
				.set("ai", card => {
					const player = get.player(),
						target = get.event("target"),
						att = get.attitude(player, target);
					if (att <= 0) {
						return 6 - get.value(card);
					}
					return target.getUseValue(card);
				})
				.set("target", player)
				.forResultCards();
			if (cards?.length) {
				const next = player.addToExpansion(cards, target, "give");
				next.gaintag.add("pottuntian");
				await next;
			}
		},
		marktext: "田",
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
		group: ["pottuntian_init", "pottuntian_biyue", "pottuntian_addCharge"],
		subSkill: {
			init: {
				audio: "pottuntian",
				trigger: {
					player: "enterGame",
					global: "phaseBefore",
				},
				filter(event, player) {
					if (!player.countCharge(true)) {
						return false;
					}
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const num = lib.skill.pottuntian.beginMarkCount;
					player.addCharge(num);
				},
			},
			biyue: {
				audio: "pottuntian",
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					const num = lib.skill.pottuntian.getNum(player);
					return num > 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const num = lib.skill.pottuntian.getNum(player);
					if (num > 0) {
						await player.draw(num);
					}
				},
			},
			addCharge: {
				audio: "pottuntian",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (player == _status.currentPhase || !player.countCharge(true)) {
						return false;
					}
					//我真没招了
					if (event.name != "addToExpansion") {
						if (event.name == "lose" && event.getlx !== false) {
							for (var i in event.gaintag_map) {
								if (event.gaintag_map[i].includes("pottuntian")) {
									return true;
								}
							}
						}
						if (
							game.getGlobalHistory("cardMove", evt => {
								if (evt.name != "lose" || event != evt.getParent()) {
									return false;
								}
								for (var i in evt.gaintag_map) {
									if (evt.gaintag_map[i].includes("pottuntian") && evt.player == player) {
										return true;
									}
								}
								return false;
							}).length
						) {
							return true;
						}
					}
					if (event.name == "gain" && event.player == player) {
						return false;
					}
					const evt = event.getl(player);
					return evt && evt.cards2 && evt.cards2.length > 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.addCharge(1);
				},
			},
		},
		ai: {
			order: 7,
			result: {
				player(player, target) {
					return get.effect(target, { name: "shunshou_copy2" }, player, player);
				},
			},
			//剩下这部分ai直接照抄手杀界屯田力
			effect: {
				target() {
					return lib.skill.tuntian.ai.effect.target.apply(this, arguments);
				},
			},
			threaten(player, target) {
				if (target.countCards("h") == 0) {
					return 2;
				}
				return 0.5;
			},
			nodiscard: true,
			nolose: true,
			notemp: true,
		},
	},
	potjixi: {
		audio: 2,
		mod: {
			targetInRange(card) {
				if (card.storage?.potjixi) {
					return true;
				}
			},
		},
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (player.hasSkill("pottuntian", null, null, false) && player.hasMark("potzaoxian") && player.getExpansions("pottuntian").some(card => card.name == name)) {
				return true;
			}
		},
		filter(event, player) {
			if (event.responded || event.potjixi || !player.hasSkill("pottuntian", null, null, false) || !player.hasMark("potzaoxian")) {
				return false;
			}
			return player.getExpansions("pottuntian").some(card => event.filterCard(get.autoViewAs({ name: card.name, nature: card.nature, storage: { potjixi: true } }, [card]), player, event));
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("急袭", player.getExpansions("pottuntian"), "hidden");
			},
			filter(button, player) {
				const evt = _status.event.getParent();
				return evt.filterCard(get.autoViewAs({ name: button.link.name, nature: button.link.nature, storage: { potjixi: true } }, [button.link]), player, evt);
			},
			check(button) {
				const card = button.link,
					player = get.player();
				return player.getUseValue({
					name: card.name,
					nature: card.nature,
					storage: { potjixi: true },
				});
			},
			backup(links, player) {
				return {
					audio: "potjixi",
					filterCard(card) {
						return card === lib.skill.potjixi_backup.card;
					},
					selectCard: -1,
					viewAs: {
						name: links[0].name,
						nature: links[0].nature,
						storage: { potjixi: true },
					},
					card: links[0],
					position: "x",
					precontent() {
						player.removeMark("potzaoxian", 1);
						event.result.card = get.autoViewAs(event.result.cards[0]);
						event.getParent().addCount = false;
						game.log(event.result.cards[0], "不计入次数");
					},
				};
			},
			prompt(links, player) {
				return "急袭：请选择" + get.translation(links[0]) + "的目标";
			},
		},
		ai: {
			combo: ["pottuntian", "potzaoxian"],
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
			order: 9,
			respondShan: true,
			respondSha: true,
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
			backup: { audio: "potjixi" },
		},
	},
	potzaoxian: {
		audio: 2,
		trigger: {
			global: "phaseEnd",
		},
		filter(event, player) {
			if (!player.hasSkill("pottuntian", null, null, false)) {
				return false;
			}
			const num = player.countCharge();
			return [0, 3].includes(num);
		},
		forced: true,
		async content(event, trigger, player) {
			player.addMark("potzaoxian", 1);
		},
		marktext: "峥",
		intro: {
			name: "峥嵘",
			content: "mark",
		},
		ai: {
			combo: ["pottuntian", "potjixi"],
		},
	},
	//势桓阶（传奇搅屎棍，新时代鲁大师）
	potgongmou: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(target => {
				if (target == player || target.countCards("h") + player.countCards("h") == 0) {
					return false;
				}
				return true;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget("你可发动共谋，与1名其他角色交换手牌并获得技能", (card, player, target) => {
					if (target == player || target.countCards("h") + player.countCards("h") == 0) {
						if (target != player) {
							target.prompt("没牌交换", "fire");
						}
						return false;
					}
					return true;
				})
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target) * (target.countCards("h") - player.countCards("h"));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.swapHandcards(target);
			await player.addTempSkills(get.info(event.name).derivation[0]);
			await target.addTempSkills(get.info(event.name).derivation[1]);
		},
		derivation: ["qice", "kanpo"],
		ai: {
			threaten: 3,
		},
	},
	potzhengshuo: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		filter(event, player) {
			return !game.hasPlayer(target => target.countCards("h") == 4);
		},
		prompt: "你可令全场角色依次弃置所有牌，然后洗牌并重新分发手牌",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const targets = game.filterPlayer().sortBySeat();
			player.chat("新年好啊！");
			player.line(targets, "thunder");
			for (const target of targets) {
				if (target.countDiscardableCards(target, "he")) {
					await target.modedDiscard(target.getCards("he"));
				}
			}
			await game.washCard();
			player.chat("发牌！");
			for (const target of targets) {
				await target.draw(4);
			}
		},
		ai: {
			//贯彻搅屎棍精神，有大直接开
			order: 114514,
			threaten: 10086,
			result: {
				player: 73547,
			},
		},
	},

	//势辛宪英
	potjiejie: {
		global: "potjiejie_global",
		audio: 2,
		subSkill: {
			global: {
				audio: "potjiejie",
				enable: "phaseUse",
				filter(event, player) {
					if (player != _status.currentPhase) {
						return false;
					}
					if (!player.countCards("h") || player.hasSkill("potjiejie_used")) {
						return false;
					}
					return game.hasPlayer(current => current.hasSkill("potjiejie"));
				},
				filterTarget(card, player, target) {
					return target.hasSkill("potjiejie");
				},
				selectTarget() {
					if (
						game.countPlayer(current => {
							return current.hasSkill("potjiejie");
						}) > 1
					) {
						return 1;
					}
					return -1;
				},
				prompt() {
					const player = get.player(),
						targets = game.filterPlayer(current => {
							return current.hasSkill("potjiejie");
						});
					let list = get.translation(targets);
					if (targets.length > 1) {
						list += "中的一人";
					}
					if (targets.length == 1 && targets[0] == player) {
						return "观看自己手牌并选择花色执行对应效果";
					}
					return `令${list}观看你的手牌并选择花色执行效果`;
				},
				prepare(cards, player, targets) {
					targets[0].logSkill("potjiejie", [player]);
				},
				log: false,
				manualConfirm: true,
				async content(event, trigger, player) {
					const target = event.target;
					player.addTempSkill("potjiejie_used", "phaseUseAfter");
					//await target.viewHandcards(player);
					game.addCardKnower(player.getCards("h"), target);
					player.getHistory("custom").push({
						potjiejie: true,
						suits: player
							.getCards("h")
							.map(card => get.suit(card, player))
							.toUniqued(),
						target: target,
					});
					const result = await target
						.chooseControl([...lib.suit.slice(0).reverse(), "cancel2"])
						.set("dialog", ["请选择一个花色", player.getCards("h")])
						.set("ai", () => {
							const target = get.event("target");
							const player = get.player();
							const att = get.attitude(player, target);
							if (att > 0) {
								const lack = lib.suit.slice(0).filter(suit => !target.hasCard(card => get.suit(card, target) == suit, "h"));
								if (lack.length) {
									return lack.randomGet();
								}
							} else if (att <= 0 && target.hasCard(true, "h")) {
								return lib.suit.filter(suit => target.hasCard(card => get.suit(card, target) == suit, "h")).reduce((min, current) => (target.countCards("h", { suit: current }) < target.countCards("h", { suit: min }) ? current : min));
							}
							return lib.suit.randomGet();
						})
						.set("target", player)
						.forResult();
					const choice = result.control;
					if (choice !== "cancel2") {
						game.log(target, "选择了" + get.translation(choice));
						target.popup(choice);
						if (player.hasCard(card => get.suit(card, player) == choice, "h")) {
							const skill = "potjiejie_effect";
							player.markAuto(skill, [choice]);
							player.addTip(
								skill,
								`诫节${player
									.getStorage(skill)
									.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a))
									.map(suit => get.translation(suit))
									.join("")}`
							);
							player.addTempSkill(skill);
							await player.modedDiscard(player.getCards("h", card => get.suit(card, player) != choice));
						} else {
							const card = get.cardPile2(card => {
								return get.suit(card) == choice;
							});
							if (card) {
								await player.gain(card, "gain2");
							}
						}
					}
					if (target.countMark("potjiejie_blocker") >= 2) {
						return;
					}
					let getSuits = current =>
						current
							.getRoundHistory("custom", evt => {
								return evt?.potjiejie && evt.target == target;
							})
							.reduce((arr, evt) => arr.addArray(evt?.suits || []), []);
					const num = getSuits(player).length;
					if (!game.hasPlayer(current => current != player && getSuits(current).length >= num)) {
						target.addTempSkill("potjiejie_blocker", { global: "roundStart" });
						target.addMark("potjiejie_blocker", 1, false);
						await target.useSkill("potqingshi", [player]);
					}
				},
				ai: {
					order: 5,
					result: {
						player(player, target) {
							return get.attitude(player, target);
						},
					},
				},
			},
			blocker: {
				charlotte: true,
				onremove: true,
			},
			used: {
				charlotte: true,
			},
			effect: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				mark: true,
				intro: {
					content: storage => `本回合使用${get.translation(storage)}牌无次数限制`,
				},
				mod: {
					cardUsable(card, player) {
						const list = player.getStorage("potjiejie_effect");
						const suit = get.suit(card);
						if (suit === "unsure" || list.includes(suit)) {
							return Infinity;
						}
					},
				},
			},
		},
	},
	potqingshi: {
		audio: 4,
		logAudio(event, player, triggername, _, costResult) {
			let target;
			if (event.name == "useSkill") {
				target = event.targets[0];
			} else {
				target = costResult.targets[0];
			}
			if (player.getFriends(true).includes(target)) {
				return ["potqingshi1.mp3", "potqingshi2.mp3"];
			}
			return ["potqingshi3.mp3", "potqingshi4.mp3"];
		},
		trigger: {
			player: "damageEnd",
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player();
					if (player.getFriends(true).includes(target)) {
						return get.effect(player, { name: "draw" }, player, player) + get.effect(target, { name: "draw" }, player, player) > 0;
					}
					return get.effect(target, { name: "guohe_copy2" }, target, player) + get.effect(player, { name: "guohe_copy2" }, player, player) > 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (player.getFriends(true).includes(target)) {
				await game.asyncDraw([player, target]);
			} else {
				await player.chooseToDiscard(true, "he");
				await player.discardPlayerCard(target, "he", true);
			}
		},
	},
	//陈祇
	mbquanchong: {
		audio: 4,
		logAudio: index => (typeof index == "number" ? `mbquanchong${index}.mp3` : 2),
		trigger: {
			player: "phaseJieshuBegin",
		},
		forced: true,
		round: 1,
		filter(event, player) {
			return player.countDiscardableCards(player, "he");
		},
		async content(event, trigger, player) {
			if (player.countDiscardableCards(player, "he")) {
				await player.modedDiscard(player.getCards("he"));
				player.insertPhase();
				if (!player.isMaxHp(true)) {
					player
						.when({ player: "phaseBegin" })
						.filter(evt => evt.skill == event.name)
						.step(async (event, trigger, player) => {
							player.logSkill("mbquanchong", null, null, null, [get.rand(1, 2)]);
							await player.loseHp();
						})
						.assign({ firstDo: true });
				}
			}
		},
	},
	mbrenxing: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "loseAsyncAfter"],
		},
		filter(event, player) {
			if (game.players.every(target => !event.getl(target)?.cards?.length) || event.getParent("phaseDiscard", true)) {
				return false;
			}
			return (
				game
					.getGlobalHistory("everything", evt => {
						if (!["lose", "loseAsync"].includes(evt.name) || evt.type != "discard" || evt.getParent("phaseDiscard", true)) {
							return false;
						}
						return game.players.some(target => evt.getl(target)?.cards?.length);
					})
					.indexOf(event) == 0
			);
		},
		async cost(event, trigger, player) {
			const { bool, links, targets } = await player
				.chooseButtonTarget({
					createDialog: [
						"任行：你可选择一项",
						[
							[
								["draw", "你与当前回合角色各摸一张牌"],
								["discard", "弃置一名本回合未使用或打出过【杀】的角色一张牌"],
							],
							"textbutton",
						],
					],
					noShas: (() => {
						return game.filterPlayer(current => {
							return ["useCard", "respond"].every(key => !current.getHistory(key, evt => evt.card?.name == "sha").length);
						});
					})(),
					filterButton(button) {
						if (button.link == "discard") {
							return get.event("noShas")?.length;
						}
						return true;
					},
					selectTarget() {
						const link = ui.selected.buttons?.[0]?.link;
						return link == "discard" ? 1 : -1;
					},
					filterTarget(card, player, target) {
						const link = ui.selected.buttons?.[0]?.link;
						if (link == "discard") {
							return get.event("noShas")?.includes(target);
						}
						return target == _status.currentPhase || target == player;
					},
					ai1(button) {
						const player = get.player();
						const target = _status?.currentPhase;
						if (button.link === "draw") {
							return get.effect(target, { name: "draw" }, target, player) + get.effect(player, { name: "draw" }, player, player);
						} else {
							return Math.max(...game.filterPlayer().map(current => get.effect(current, { name: "guohe_copy2" }, player, player)));
						}
					},
					ai2(target) {
						const player = get.player();
						return get.effect(target, { name: "guohe_copy2" }, player, player);
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
			const { targets, cost_data: choice } = event;
			if (choice.includes("draw")) {
				if (player == _status.currentPhase) {
					targets.push(player);
				}
				await game.asyncDraw(targets);
			} else {
				await player.discardPlayerCard(event.targets[0], "he", true);
			}
		},
	},
	//势鲁肃
	pothaoshi: {
		audio: 3,
		logAudio: () => 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.hasPlayer(target => target != player); //target.hp <= player.hp &&
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player; //target.hp <= player.hp &&
				})
				.set("ai", target => {
					return get.attitude(get.player(), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				skill = event.name + "_clear";
			target.markAuto(event.name + "_use", player);
			target.addAdditionalSkill(`${event.name}_use_${player.playerid}`, event.name + "_use");
			player.addTempSkill(skill, { player: "phaseBegin" });
			player.storage[skill].set(target, 2);
			player.addTip(
				skill,
				[...player.storage[skill].entries()]
					.map(([target, num]) => {
						return `${get.translation(skill)}${get.translation(target)} ${num}`;
					})
					.join("<br>")
			);
			player.addTempSkill(event.name + "_change", { player: "phaseBegin" });
		},
		group: ["pothaoshi_draw"],
		subSkill: {
			tag: {},
			draw: {
				audio: "pothaoshi",
				logAudio: () => "pothaoshi3.mp3",
				trigger: { player: "loseAfter" },
				forced: true,
				locked: false,
				filter(event, player) {
					const storage = player.storage["pothaoshi_clear"],
						target = event.getParent().pothaoshi;
					return event.getl(player)?.hs?.length && !player.countCards("h") && storage?.has(target) && storage.get(target) > 0;
				},
				async content(event, trigger, player) {
					const skill = "pothaoshi_clear";
					player.storage[skill].set(trigger.getParent().pothaoshi, player.storage[skill].get(trigger.getParent().pothaoshi) - 1);
					player.addTip(
						skill,
						[...player.storage[skill].entries()]
							.map(([target, num]) => {
								return `${get.translation(skill)}${get.translation(target)} ${num}`;
							})
							.join("<br>")
					);
					await player.drawTo(3);
				},
			},
			clear: {
				charlotte: true,
				init(player, skill) {
					player.storage[skill] = new Map([]);
				},
				onremove(player, skill) {
					[...player.storage[skill].entries()].forEach(([target, num]) => {
						target.unmarkAuto("pothaoshi_use", [player]);
						lib.skill.pothaoshi_use.init(target, "pothaoshi_use");
						target.removeAdditionalSkill(`pothaoshi_use_${player.playerid}`);
					});
					player.removeTip(skill);
					delete player.storage[skill];
				},
			},
			change: {
				trigger: {
					global: ["loseEnd", "loseAsyncEnd", "gainEnd", "addToExpansionEnd", "equipEnd", "addJudgeEnd"],
				},
				silent: true,
				charlrotte: true,
				filter(event, player) {
					return event.getg?.(player)?.length || event.getl?.(player)?.hs?.length;
				},
				forceDie: true,
				async content(event, trigger, player) {
					const toAdd = trigger.getg?.(player) || [],
						toRemove = trigger.getl?.(player)?.hs || [];
					event.set("toAdd", toAdd);
					event.set("toRemove", toRemove);
					await event.trigger("pothaoshiChange");
				},
			},
			use: {
				init(player, skill) {
					const toRemove = player.getCards("s", card => card.hasGaintag("pothaoshi_tag"));
					game.deleteFakeCards(toRemove);
					const cards = player.getStorage(skill).reduce((cards, target) => {
						const fake = target.isAlive() && target.countCards("h") ? game.createFakeCards(target.getCards("h")) : [];
						return cards.addArray(fake);
					}, []);
					player.directgains(cards, null, "pothaoshi_tag");
				},
				onremove(player, skill) {
					const toRemove = player.getCards("s", card => card.hasGaintag("pothaoshi_tag"));
					game.deleteFakeCards(toRemove);
				},
				mark: true,
				intro: {
					content: "你可以如手牌般使用或打出<span class=thundertext>$</span>的手牌",
				},
				forced: true,
				popup: false,
				delay: false,
				charlotte: true,
				trigger: {
					player: ["useCardBefore", "respondBefore"],
					global: ["pothaoshiChange"],
				},
				filter(event, player) {
					if (["useCard", "respond"].includes(event.name)) {
						const cards = player.getCards("s", card => card.hasGaintag("pothaoshi_tag"));
						return event.cards && event.cards.some(card => cards.includes(card));
					}
					return player.getStorage("pothaoshi_use").includes(event.player);
				},
				async content(event, trigger, player) {
					const tag = "pothaoshi_tag";
					if (["useCard", "respond"].includes(trigger.name)) {
						trigger.set("pothaoshi", player);
						const real = player.getStorage(event.name).reduce((cards, target) => {
							const hs = target.isAlive() && target.countCards("h") ? target.getCards("h") : [];
							return cards.addArray(hs);
						}, []);
						for (let i = 0; i < trigger.cards.length; i++) {
							const card = trigger.cards[i];
							const cardx = real.find(cardx => cardx.cardid == card._cardid);
							if (cardx) {
								trigger.cards[i] = cardx;
								trigger.card.cards[i] = cardx;
							}
						}
					} else {
						game.deleteFakeCards(player.getCards("s", card => trigger.toRemove.find(cardx => cardx.cardid == card._cardid)));
						player.directgains(game.createFakeCards(trigger.toAdd), null, tag);
					}
				},
			},
		},
	},
	potdimeng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.countPlayer() > 1;
		},
		filterTarget(card, player, target) {
			const selected = ui.selected.targets;
			if (!selected.length) {
				return true;
			}
			return Math.abs(target.countCards("h") - selected[0].countCards("h")) <= 3;
		},
		complexTarget: true,
		selectTarget: 2,
		multiline: true,
		multitarget: true,
		async content(event, trigger, player) {
			const { targets } = event,
				num = player.getDamagedHp();
			await targets[0].swapHandcards(targets[1]);
			if (num == 0) {
				return;
			}
			const discard = Math.min(num, player.countDiscardableCards(player, "he")),
				count = targets[0].countCards("h") - targets[1].countCards("h");
			if (discard == 0 && count == 0) {
				return;
			}
			if (count == 0) {
				await player.chooseToDiscard(`缔盟：是否弃置${get.cnNumber(discard)}张牌？`, discard, "he");
				return;
			}
			const target = targets.sort((a, b) => a.countCards("h") - b.countCards("h"))[0];
			if (discard == 0) {
				const result = await player
					.chooseBool(`缔盟：是否令${get.translation(target)}摸${get.cnNumber(num)}张牌？`)
					.set("choice", get.effect(target, { name: "draw" }, player, player) > 0)
					.forResult();
				if (result?.bool) {
					await target.draw(num);
				}
				return;
			}
			const result = await player
				.chooseToDiscard(`缔盟：弃置${get.cnNumber(discard)}张牌或令${get.translation(target)}摸${get.cnNumber(num)}张牌`, discard, "he")
				.set("targetx", target)
				.set("ai", card => {
					const player = get.player(),
						target = get.event().targetx,
						eff = get.effect(target, { name: "wuzhong" }, player, player);
					if (eff > 0) {
						return 0;
					}
					return 6.5 - get.value(card);
				})
				.forResult();
			if (!result?.cards?.length) {
				await target.draw(num);
			}
		},
		ai: {
			order: 6,
			threaten: 3,
			expose: 0.9,
			result: {
				target(player, target) {
					const list = [];
					const num = player.getDamagedHp();
					const players = game.filterPlayer();
					if (ui.selected.targets.length == 0) {
						for (let i = 0; i < players.length; i++) {
							if (players[i] != player && get.attitude(player, players[i]) > 3) {
								list.push(players[i]);
							}
						}
						list.sort(function (a, b) {
							return a.countCards("h") - b.countCards("h");
						});
						if (target == list[0]) {
							return get.attitude(player, target);
						}
						return -get.attitude(player, target);
					} else {
						const from = ui.selected.targets[0];
						for (let i = 0; i < players.length; i++) {
							if (players[i] != player && get.attitude(player, players[i]) < 1) {
								list.push(players[i]);
							}
						}
						list.sort(function (a, b) {
							return b.countCards("h") - a.countCards("h");
						});
						if (from.countCards("h") >= list[0].countCards("h")) {
							return -get.attitude(player, target);
						}
						for (let i = 0; i < list.length && from.countCards("h") < list[i].countCards("h"); i++) {
							if (list[i].countCards("h") - from.countCards("h") <= num) {
								const count = list[i].countCards("h") - from.countCards("h");
								if (count < 2 && from.countCards("h") >= 2) {
									return -get.attitude(player, target);
								}
								if (target == list[i]) {
									return get.attitude(player, target);
								}
								return -get.attitude(player, target);
							}
						}
					}
				},
			},
		},
	},
	//孙峻
	mbxiongtu: {
		audio: 4,
		logAudio: index => (typeof index === "number" ? `mbxiongtu${index}.mp3` : 2),
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(target => target.countCards("h") && target != player);
		},
		filterTarget(card, player, target) {
			return target.countCards("h") && target != player;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player.choosePlayerCard(`凶图：请展示${get.translation(target)}的一张手牌`, target, "h", true).forResult();
			if (result?.cards?.length) {
				const card = result.cards[0];
				await player.showCards(card, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
				const num = lib.suit.slice(0).removeArray(
					get
						.discarded()
						.map(card => get.suit(card))
						.unique()
				).length;
				const resultx = await player
					.chooseToDiscard(`凶图：取消并弃置${get.translation(card)}或弃置${num}张牌对${get.translation(target)}造成1点伤害`, "he", [0, Infinity])
					.set("filterOk", () => {
						if (ui.selected.cards.length == get.event().num) {
							return true;
						}
						return false;
					})
					.set("ai", card => {
						if (get.event().num > 2) {
							return 0;
						}
						return 6 - get.value(card);
					})
					.set("num", num)
					.forResult();
				if (resultx?.bool) {
					player.logSkill("mbxiongtu", [target], null, null, [get.rand(3, 4)]);
					await target.damage();
				} else {
					await target.modedDiscard(card).set("discarder", player);
				}
			}
		},
		ai: {
			order: 1,
			result: {
				target: -1,
			},
		},
	},
	mbxianshuai: {
		audio: 2,
		init(player, skill) {
			player.addSkill(skill + "_record");
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_record");
		},
		mod: {
			cardUsable(card, player, num) {
				if (_status.currentPhase != player) {
					return;
				}
				const cards = card.cards;
				if (cards.length == 1) {
					if (player.getCards("h").includes(cards[0]) && !player.getStorage("mbxianshuai_record").includes(get.suit(cards[0], player))) {
						return Infinity;
					}
				}
				return;
			},
		},
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (_status.currentPhase != player) {
				return false;
			}
			return event.mbxianshuai && event.addCount !== false;
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.addCount = false;
			const stat = player.getStat().card,
				name = trigger.card.name;
			if (typeof stat[name] === "number") {
				stat[name]--;
			}
		},
		subSkill: {
			record: {
				init(player, skill) {
					if (_status.currentPhase != player) {
						return;
					}
					const suits = player
						.getHistory("lose", evt => {
							if ((evt.relatedEvent || evt.getParent()).name != "useCard") {
								return false;
							}
							return evt.cards.length == 1 && evt.hs?.length == 1;
						})
						.map(evt => get.suit(evt.getParent()?.card))
						.unique();
					if (suits.length) {
						player.addTempSkill("mbxianshuai_clear");
						player.markAuto(
							skill,
							suits.sort((a, b) => lib.suit.indexOf(a) - lib.suit.indexOf(b))
						);
						player.addTip(skill, `${get.translation(skill)} ${player.getStorage(skill).reduce((str, suit) => (str += get.translation(suit)), "")}`);
					}
				},
				trigger: { player: "useCard0" },
				charlotte: true,
				silent: true,
				filter(event, player) {
					if (_status.currentPhase != player) {
						return false;
					}
					return (
						event.cards.length == 1 &&
						!player.getStorage("mbxianshuai_record").includes(get.suit(event.card)) &&
						player.hasHistory("lose", evt => {
							const evtx = evt.relatedEvent || evt.getParent();
							return evtx == event && evt.hs?.length == 1;
						})
					);
				},
				async content(event, trigger, player) {
					trigger.set("mbxianshuai", true);
					player.addTempSkill("mbxianshuai_clear");
					player.markAuto(event.name, get.suit(trigger.card));
					player.storage[event.name] = player.getStorage(event.name).sort((a, b) => lib.suit.indexOf(a) - lib.suit.indexOf(b));
					player.addTip(event.name, `${get.translation(event.name)} ${player.getStorage(event.name).reduce((str, suit) => (str += get.translation(suit)), "")}`);
				},
				intro: {
					content: "已使用过的花色:$",
				},
			},
			clear: {
				onremove(player, skill) {
					delete player.storage.mbxianshuai_record;
					player.unmarkSkill("mbxianshuai_record");
					player.removeTip("mbxianshuai_record");
				},
				charlotte: true,
			},
		},
	},
	//势魏延
	potzhongao: {
		audio: 5,
		dutySkill: true,
		derivation: ["potkuanggu", "potkuanggu_pot_weiyan_achieve", "kunfen"],
		group: ["potzhongao_start", "potzhongao_achieve", "potzhongao_fail"],
		subSkill: {
			start: {
				audio: "potzhongao1.mp3",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.addSkills("potkuanggu");
				},
			},
			achieve: {
				audio: ["potzhongao2.mp3", "potzhongao3.mp3"],
				trigger: {
					source: "dieAfter",
				},
				forced: true,
				locked: false,
				skillAnimation: true,
				animationColor: "fire",
				async content(event, trigger, player) {
					player.awakenSkill(event.name.slice(0, -8));
					game.log(player, "成功完成使命");
					player.changeSkin("potzhongao", "pot_weiyan_achieve");
					game.broadcastAll(() => {
						_status.tempMusic = "effect_yinzhanBGM";
						game.playBackgroundMusic();
					});
					player.setStorage("potkuanggu", 1);
					const num1 = player.countMark("potzhuangshi_limit"),
						num2 = player.countMark("potzhuangshi_directHit");
					if (num1 > 0) {
						await player.draw();
					}
					if (num2 > 0) {
						if (!player.isDamaged()) {
							await player.draw();
						} else {
							await player.recover();
						}
					}
				},
			},
			fail: {
				audio: ["potzhongao4.mp3", "potzhongao5.mp3"],
				trigger: {
					player: ["dying", "phaseUseBegin"],
				},
				filter(event, player) {
					return event.name == "dying" || !event.usedZhuangshi;
				},
				lastDo: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.awakenSkill(event.name.slice(0, -5));
					game.log(player, "使命失败");
					player.changeSkin("potzhongao", "pot_weiyan_fail");
					game.broadcastAll(() => {
						_status.tempMusic = "effect_tuishouBGM";
						game.playBackgroundMusic();
					});
					await player.changeSkills(["kunfen"], ["potzhuangshi"]);
				},
			},
		},
	},
	potzhuangshi: {
		audio: 2,
		audioname: ["pot_weiyan_achieve"],
		trigger: {
			player: "phaseUseBegin",
		},
		async cost(event, trigger, player) {
			const { bool: bool1, cards } = await player
				.chooseToDiscard(get.prompt(event.skill), [1, Infinity], "h", "allowChooseAll")
				.set("prompt2", "弃置任意张手牌，令你此阶段使用的前等量张牌无距离限制且不可被响应")
				.set("ai", card => {
					const player = get.player();
					let num = Math.floor(player.countCards("h") / 2);
					if (!game.hasPlayer(current => get.attitude(player, current) < 0)) {
						num = 1;
					}
					if (ui.selected.cards.length < num && card.name != "du") {
						if (get.tag(card, "damage")) {
							return 0.1 - ui.selected.cards.length;
						}
						return 7 - get.value(card);
					}
					return 0;
				})
				.set("chooseonly", true)
				.forResult();
			if (bool1 && cards.length) {
				game.broadcastAll(cards => {
					cards.forEach(card => card.addGaintag("potzhuangshi_tag"));
				}, cards);
			}
			const { bool: bool2, numbers } = await player
				.chooseNumbers(get.prompt(event.skill), [
					{
						prompt: "失去任意点体力值，令你此阶段使用的前等量张牌不计入次数限制",
						min: 1,
						max: player.getHp(),
					},
				])
				.set("processAI", () => {
					const player = get.player();
					if (player.hp < 2 || !game.hasPlayer(current => get.attitude(player, current) < 0)) {
						return false;
					}
					let num = Math.min(Math.floor(player.countCards("h") / 2), player.hp - 1);
					return [num];
				})
				.forResult();
			event.result = {
				bool: bool1 || bool2,
				cards: cards,
				cost_data: numbers,
			};
			player.removeGaintag("potzhuangshi_tag");
		},
		async content(event, trigger, player) {
			trigger.set("usedZhuangshi", true);
			const { cards, cost_data: numbers } = event;
			if (cards) {
				const number = cards.length;
				player.addTempSkill("potzhuangshi_directHit", "phaseChange");
				player.addMark("potzhuangshi_directHit", number, false);
				player.addTip("potzhuangshi_directHit", `不可响应 ${number}`);
			}
			if (numbers) {
				const number = numbers[0];
				player.addTempSkill("potzhuangshi_limit", "phaseChange");
				player.addMark("potzhuangshi_limit", number, false);
				player.addTip("potzhuangshi_limit", `不计次数 ${number}`);
			}
			if (cards) {
				await player.modedDiscard(cards);
			}
			if (numbers) {
				const number = numbers[0];
				await player.loseHp(number);
			}
		},
		onremove(player) {
			player.removeSkill("potzhuangshi_directHit");
			player.removeSkill("potzhuangshi_limit");
		},
		subSkill: {
			limit: {
				trigger: {
					player: "useCard0",
				},
				charlotte: true,
				filter(event, player) {
					return player.hasMark("potzhuangshi_limit");
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						const stat = player.getStat().card,
							name = trigger.card.name;
						if (typeof stat[name] == "number") {
							stat[name]--;
						}
					}
					player.removeMark("potzhuangshi_limit", 1, false);
					const num = player.countMark("potzhuangshi_limit");
					if (num > 0) {
						player.addTip("potzhuangshi_limit", `不计次数 ${num}`);
					} else {
						player.removeTip("potzhuangshi_limit");
					}
				},
				onremove(player, skill) {
					player.clearMark(skill, false);
					player.removeTip(skill);
				},
				ai: {
					presha: true,
					skillTagFilter(player, tag, arg) {
						if (!player.hasMark("potzhuangshi_limit")) {
							return false;
						}
					},
				},
			},
			directHit: {
				trigger: {
					player: "useCard0",
				},
				charlotte: true,
				filter(event, player) {
					return player.hasMark("potzhuangshi_directHit");
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
					player.removeMark("potzhuangshi_directHit", 1, false);
					const num = player.countMark("potzhuangshi_directHit");
					if (num > 0) {
						player.addTip("potzhuangshi_directHit", `不可响应 ${num}`);
					} else {
						player.removeTip("potzhuangshi_directHit");
					}
				},
				onremove(player, skill) {
					player.clearMark(skill, false);
					player.removeTip(skill);
				},
				mod: {
					targetInRange(card, player) {
						if (player.hasMark("potzhuangshi_directHit")) {
							return true;
						}
					},
				},
			},
		},
	},
	potyinzhan: {
		audio: 3,
		audioname: ["pot_weiyan_achieve", "pot_weiyan_fail"],
		trigger: {
			source: "damageBegin1",
		},
		forced: true,
		filter(event, player) {
			if (event.card?.name != "sha") {
				return false;
			}
			const target = event.player;
			if (player.hp <= target.hp || player.countCards("he") <= target.countCards("he")) {
				return true;
			}
			return false;
		},
		logTarget: "player",
		popup: false,
		logAudio: (player, indexedData) => "potyinzhan" + (lib.skill.potyinzhan.audioname.includes(player.skin.name) ? "_" + player.skin.name : "") + (indexedData ? indexedData : get.rand(1, 2)) + ".mp3",
		async content(event, trigger, player) {
			const target = trigger.player,
				bool1 = target.hp >= player.hp,
				bool2 = target.countCards("he") >= player.countCards("he");
			player.logSkill("potyinzhan", null, null, null, [player, bool1 && bool2 ? 3 : get.rand(1, 2)]);
			if (bool1) {
				trigger.num++;
			}
			if (bool2) {
				if (bool1) {
					player.popup("乘势", "fire");
				}
				player
					.when("useCardAfter")
					.filter(evt => evt == trigger.getParent(2))
					.step(async (event, trigger, player) => {
						let result;
						if (target.isIn() && target.countDiscardableCards(player, "he")) {
							result = await player.discardPlayerCard(target, "he", true).forResult();
						}
						if (bool1) {
							await player.recover();
							if (result?.cards?.length) {
								await player.gain(result.cards.filterInD("od"), "gain2");
							}
						}
					});
			}
		},
	},
	potkuanggu: {
		audio: 2,
		audioname: ["pot_weiyan_fail"],
		audioname2: {
			pot_weiyan_achieve: "potkuanggu_pot_weiyan_achieve",
		},
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			return event.checkKuanggu && event.num > 0;
		},
		frequent: true,
		popup: false,
		logAudio: (player, indexedData) => "potkuanggu" + (lib.skill.potkuanggu.audioname.includes(player.skin.name) ? "_" + player.skin.name : "") + (indexedData ? indexedData : get.rand(1, 2)) + ".mp3",
		logAudio2: {
			pot_weiyan_achieve: (player, indexedData) => "potkuanggu_pot_weiyan_achieve" + (indexedData ? indexedData : get.rand(1, 2)) + ".mp3",
		},
		async cost(event, trigger, player) {
			let choice,
				list = ["draw_card"],
				choiceList = ["选项一：回复1点体力", "选项二：摸一张牌"];
			if (player.getStorage(event.skill, 0) && player.countCards("he")) {
				list.push("背水！");
				choiceList.push("背水：弃置一张牌并令你本阶段使用【杀】的次数+1");
			}
			if (player.isDamaged()) {
				list.unshift("recover_hp");
			} else {
				choiceList[0] = `<span class = 'transparent'>${choiceList[0]}</span>`;
			}
			if (list.length == 1) {
				event.result = await player.chooseBool(get.prompt(event.skill), "摸一张牌").set("frequentSkill", event.skill).forResult();
				event.result.cost_data = "draw_card";
			} else {
				list.push("cancel2");
				if (
					player.isDamaged() &&
					get.recoverEffect(player) > 0 &&
					player.countCards("hs", function (card) {
						return card.name == "sha" && player.hasValueTarget(card);
					}) >= player.getCardUsable("sha")
				) {
					if (player.countCards("he") > 1 && list.includes("背水！")) {
						choice = "背水！";
					} else {
						choice = "recover_hp";
					}
				} else {
					choice = "draw_card";
				}
				const control = await player
					.chooseControl(list)
					.set("prompt", get.prompt(event.skill))
					.set("choiceList", choiceList)
					.set("displayIndex", false)
					.set("choice", choice)
					.set("ai", () => {
						return get.event("choice");
					})
					.forResultControl();
				event.result = {
					bool: control != "cancel2",
					cost_data: control,
				};
			}
		},
		async content(event, trigger, player) {
			const result = event.cost_data;
			if (result == "背水！" && player.skin.name === "pot_weiyan_achieve") {
				player.logSkill("potkuanggu", null, null, null, [player, get.rand(3, 4)]);
			} else {
				player.logSkill("potkuanggu", null, null, null, [player]);
			}

			if (result == "recover_hp" || result == "背水！") {
				await player.recover();
			}
			if (result == "draw_card" || result == "背水！") {
				await player.draw();
			}
			if (result == "背水！" && player.countCards("he")) {
				await player.chooseToDiscard("he", true);
				player.addTempSkill("potkuanggu_effect", "phaseChange");
				player.addMark("potkuanggu_effect", 1, false);
			}
		},
		subSkill: {
			pot_weiyan_achieve: {
				audio: 4,
			},
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (player.countMark("potkuanggu_effect") && card.name == "sha") {
							return num + player.countMark("potkuanggu_effect");
						}
					},
				},
			},
		},
	},
	kunfen_pot_weiyan: { audio: 2 },
	//张燕
	mbfeijing: {
		audio: 4,
		logAudio() {
			return ["mbfeijing1.mp3", "mbfeijing3.mp3"];
		},
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			if (event.card.name != "sha" || !event.isFirstTarget) {
				return false;
			}
			if (event.targets?.length != 1 || !event.target?.isIn()) {
				return false;
			}
			const [left, right] = get.info("mbfeijing").getTargets(player, event.target);
			return left.length || right.length;
		},
		usable: 2,
		getTargets(source, target) {
			let left = [],
				right = [],
				left2 = source,
				right2 = source;
			while (!(left2 == target && right2 == target)) {
				if (left2 != target) {
					left2 = left2.getPrevious();
					if (left2.isIn() && left2 != target) {
						left.push(left2);
					}
				}
				if (right2 != target) {
					right2 = right2.getNext();
					if (right2.isIn() && right2 != target) {
						right.push(right2);
					}
				}
			}
			return [left, right];
		},
		async cost(event, trigger, player) {
			const [left, right] = get.info(event.skill).getTargets(player, trigger.target);
			if (left.length && right.length) {
				const shun = `顺时针：${left.map(i => get.translation(i)).join("、")}`,
					ni = `逆时针：${right.map(i => get.translation(i)).join("、")}`,
					prompt = "令顺时针或逆时针上的角色同时展示并依次弃置一张手牌，然后你可令弃置一种颜色牌的所有角色成为此【杀】额外目标";
				const result = await player
					.chooseButton([
						get.prompt(event.skill),
						prompt,
						[
							[
								[left, shun],
								[right, ni],
							],
							"textbutton",
						],
					])
					.set("ai", button => {
						const player = get.player(),
							trigger = get.event().getTrigger(),
							targets = button.link;
						let eff = 0;
						for (let target of targets) {
							if (lib.filter.targetEnabled2(trigger.card, player, target)) {
								eff += get.effect(target, trigger.card, player, player);
							}
						}
						return eff;
					})
					.forResult();
				event.result = {
					bool: result?.bool,
					targets: result?.links?.[0],
				};
			} else {
				const targets = left.length ? left : right;
				event.result = await player.chooseBool(get.prompt2(event.skill, targets)).forResult();
				if (event.result?.bool) {
					event.result.targets = targets;
				}
			}
		},
		async content(event, trigger, player) {
			const targets = event.targets.filter(target => target.countCards("h", card => lib.filter.cardDiscardable(card, target, "mbfeijing")));
			if (targets.length) {
				const next = player
					.chooseCardOL(targets, "h", true, "飞径：展示并弃置一张手牌", (card, player) => {
						return lib.filter.cardDiscardable(card, player, "mbfeijing");
					})
					.set("ai", get.unuseful)
					.set("aiCard", target => {
						const cards = target.getCards("h");
						return { bool: true, cards: [cards.randomGet()] };
					});
				next._args.remove("glow_result");
				const result = await next.forResult();
				const cards = [];
				for (let i = 0; i < result.length; i++) {
					const current = targets[i],
						card = result[i].cards[0];
					cards.push(card);
				}
				event.videoId = lib.status.videoId++;
				game.log(player, "展示了", targets, "的", cards);
				game.broadcastAll(
					(targets, cards, id, player) => {
						const dialog = ui.create.dialog(get.translation(player) + "发动了【飞径】", cards);
						dialog.videoId = id;
						for (let i = 0; i < targets.length; i++) {
							game.createButtonCardsetion(`${targets[i].getName(true)}${get.translation(cards[i].suit)}`, dialog.buttons[i]);
						}
					},
					targets,
					cards,
					event.videoId,
					player
				);
				await game.delay(4);
				game.broadcastAll("closeDialog", event.videoId);
				const colors = {};
				for (let i = 0; i < result.length; i++) {
					const current = targets[i],
						card = result[i].cards[0],
						color = get.color(card, current);
					await current.discard([card]);
					if (!colors[color]) {
						colors[color] = [];
					}
					colors[color].add(current);
				}
				const list = [];
				for (let color in colors) {
					list.add([colors[color], `${get.translation(color)}：${colors[color].map(i => get.translation(i)).join("、")}`]);
				}
				if (!list.length) {
					return;
				}
				const result2 = await player
					.chooseButton(["飞径：是否令弃置一种颜色牌的所有角色成为此【杀】额外目标？", [list, "textbutton"]])
					.set("ai", button => {
						const player = get.player(),
							trigger = get.event().getTrigger(),
							targets = button.link;
						let eff = 0;
						for (let target of targets) {
							if (lib.filter.targetEnabled2(trigger.card, player, target)) {
								eff += get.effect(target, trigger.card, player, player);
							}
						}
						return eff;
					})
					.forResult();
				if (result2?.bool && result2.links?.length) {
					const targetx = result2.links[0].filter(target => lib.filter.targetEnabled2(trigger.card, player, target));
					if (targetx.length) {
						player.line(targetx);
						trigger.targets.addArray(targetx);
						trigger.getParent().feijingExtra ??= [];
						trigger.getParent().feijingExtra.addArray(targetx);
					}
				}
			}
		},
		group: "mbfeijing_viewas",
		subSkill: {
			viewas: {
				audio: ["mbfeijing2.mp3", "mbfeijing4.mp3"],
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard(card, player) {
					return get.type2(card) == "trick" && get.tag(card, "damage");
				},
				position: "hes",
				viewAs: {
					name: "sha",
				},
				viewAsFilter(player) {
					if (!player.countCards("hes", card => get.type2(card) == "trick" && get.tag(card, "damage"))) {
						return false;
					}
				},
				prompt: "将一张伤害类锦囊牌当杀使用或打出",
				check(card) {
					const val = get.value(card);
					if (_status.event.name == "chooseToRespond") {
						return 1 / Math.max(0.1, val);
					}
					return 7 - val;
				},
				ai: {
					skillTagFilter(player) {
						if (!player.countCards("hes", card => get.type2(card) == "trick" && get.tag(card, "damage"))) {
							return false;
						}
					},
					respondSha: true,
				},
			},
		},
	},
	mbxiaoge: {
		audio: 4,
		trigger: {
			source: "damageBegin2",
			player: "useCardAfter",
		},
		forced: true,
		filter(event, player) {
			if (event.name == "damage") {
				const evt = event.getParent("useCard", true);
				return evt?.feijingExtra?.includes(event.player) && evt?.targets?.includes(event.player) && evt?.card?.name == "sha";
			}
			return event.card.name == "sha" && event.targets.length == 1;
		},
		logTarget(event, player) {
			return event[event.name == "damage" ? "player" : "targets"];
		},
		logAudio(event) {
			if (event.name == "damage") {
				return 2;
			}
			return ["mbxiaoge3.mp3", "mbxiaoge4.mp3"];
		},
		async content(event, trigger, player) {
			if (trigger.name == "damage") {
				trigger.cancel();
				if (player.isDamaged()) {
					await player.recover();
				}
				const target = trigger.player,
					evt = trigger.getParent("useCard", true);
				let cards;
				target.getHistory("lose", evtx => {
					const evtv = evtx.getParent(2);
					if (evtv?.name != "mbfeijing") {
						return false;
					}
					if (evtv?.getTrigger()?.getParent() != evt) {
						return false;
					}
					cards = evtx.cards2.filterInD("d");
				});
				if (cards?.length) {
					await player.gain(cards, "gain2");
				}
			} else {
				const card = { name: "juedou", isCard: true },
					target = event.targets[0];
				if (player.canUse(card, target)) {
					await player.useCard(card, target);
				}
			}
		},
	},
	//国渊
	mbqingdao: {
		audio: 2,
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			return event.player != player && get.tag(event.card, "damage") > 0.5 && event.targets.includes(player);
		},
		async cost(event, trigger, player) {
			const damaged = player.hasHistory("damage", evt => evt.card && evt.getParent(2) == trigger);
			let result;
			if (damaged) {
				//新函数chooseButtonTarget第一次使用，用法跟chooseCardTarget类似
				result = await player
					.chooseButtonTarget({
						createDialog: [
							`###${get.prompt(event.skill)}###<div class="text center">从牌堆或弃牌堆中获得一张【闪】，或弃置一名角色区域内的一张牌</div>`,
							[
								[
									["shan", "获得【闪】"],
									["discard", "弃置牌"],
								],
								"tdnodes",
							],
						],
						filterButton(button) {
							if (button.link == "discard") {
								return game.hasPlayer(target => target.countDiscardableCards(get.player(), "hej"));
							}
							return true;
						},
						filterTarget(card, player, target) {
							return target.countDiscardableCards(player, "hej");
						},
						selectTarget() {
							if (ui.selected.buttons.length) {
								const link = ui.selected.buttons[0].link;
								if (link == "discard") {
									return 1;
								}
								return 0;
							}
							return 0;
						},
						filterOk() {
							if (ui.selected.buttons.length) {
								const link = ui.selected.buttons[0].link;
								if (link == "discard") {
									return ui.selected.targets.length == 1;
								}
								return true;
							}
							return false;
						},
						ai1(button) {
							const player = get.player();
							if (button.link == "discard") {
								const values = game
									.filterPlayer(target => target.countDiscardableCards(player, "hej"))
									.map(target => get.effect(target, { name: "guohe_copy" }, player, player))
									.sort((a, b) => b - a);
								return values.length ? values[0] : 0;
							}
							if (button.link == "shan") {
								if (!player.countCards("h", "shan")) {
									return get.effect(player, { name: "wuzhong" }, player, player) * 2;
								}
								return get.effect(player, { name: "wuzhong" }, player, player) / 3;
							}
						},
						ai2(target) {
							if (ui.selected.buttons[0].link != "discard") {
								return 1;
							}
							return get.effect(target, { name: "guohe_copy" }, get.player(), get.player());
						},
					})
					.forResult();
			} else {
				result = await player
					.chooseButton([
						`###${get.prompt(event.skill)}###<div class="text center">从牌堆或弃牌堆中获得一张【杀】，或使用一张手牌（无距离限制）</div>`,
						[
							[
								["sha", "获得【杀】"],
								["use", "使用手牌"],
							],
							"tdnodes",
						],
					])
					.set("filterButton", button => {
						if (button.link == "use") {
							return get.player().hasCard(card => get.player().hasUseTarget(card, false, false), "hs");
						}
						return true;
					})
					.set("ai", button => {
						const player = get.player();
						if (button.link == "use") {
							const values = player
								.getCards("hs", card => player.hasUseTarget(card, false, false))
								.map(card => player.getUseValue(card))
								.sort((a, b) => b - a);
							return values.length ? values[0] * 1.5 : 0;
						}
						if (button.link == "sha") {
							if (!player.countCards("h", "sha")) {
								return get.effect(player, { name: "wuzhong" }, player, player);
							}
							return get.effect(player, { name: "wuzhong" }, player, player) / 3;
						}
					})
					.forResult();
			}
			if (result.bool) {
				event.result = {
					bool: true,
					cost_data: {
						links: result.links,
						targets: result?.targets || [],
					},
				};
			}
		},
		async content(event, trigger, player) {
			const link = event.cost_data.links[0],
				targets = event.cost_data.targets;
			if (link == "sha" || link == "shan") {
				const card = get.cardPile(card => card.name == link);
				if (card) {
					await player.gain(card, "gain2");
				} else {
					player.chat(`孩子们，一张${get.translation(link)}都没有力`);
				}
			}
			if (link == "discard" && targets.length) {
				player.line(targets);
				if (!targets[0].countDiscardableCards(player, "hej")) {
					return;
				}
				await player.discardPlayerCard(targets[0], "hej", true);
			}
			if (link == "use" && player.hasCard(card => player.hasUseTarget(card, false, false), "hs")) {
				await player.chooseToUse({
					filterCard(card) {
						if (get.itemtype(card) != "card" || !["h", "s"].includes(get.position(card))) {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					filterTarget(card, player, target) {
						return lib.filter.targetEnabled.apply(this, arguments);
					},
					prompt: "清蹈：使用一张手牌（无距离限制）",
					addCount: false,
					forced: true,
				});
			}
		},
	},
	mbxiugeng: {
		audio: 4,
		logAudio: index => (typeof index === "number" ? "mbxiugeng" + index + ".mp3" : 2),
		trigger: { player: "phaseBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, 2])
				.set("ai", target => get.attitude(get.player(), target))
				.forResult();
		},
		async content(event, trigger, player) {
			player.line(event.targets);
			for (const target of event.targets.sortBySeat()) {
				target.removeSkill("mbxiugeng_effect");
				target.setStorage("mbxiugeng_effect", target.countCards("h"));
				target.addSkill("mbxiugeng_effect");
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				forced: true,
				popup: false,
				init(player, skill) {
					const storage = player.storage[skill];
					if (storage >= 0) {
						player.addTip(skill, `${get.translation(skill)} ${storage}`);
					}
				},
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				mark: true,
				intro: {
					content: "当前记录值为：#",
				},
				trigger: { player: "phaseDrawBegin" },
				content() {
					const record = player.storage[event.name];
					if (typeof record == "number") {
						player.logSkill("mbxiugeng", null, null, null, [player.countCards("h") >= record ? 4 : 3]);
						if (player.countCards("h") <= record) {
							player.draw(2);
						}
						if (player.countCards("h") >= record) {
							player.addSkill("mbxiugeng_handcard");
							player.addMark("mbxiugeng_handcard", 1, false);
						}
					}
					player.removeSkill(event.name);
				},
			},
			handcard: {
				markimage: "image/card/handcard.png",
				charlotte: true,
				onremove: true,
				intro: {
					content: "手牌上限+#",
				},
				mark: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("mbxiugeng_handcard");
					},
				},
			},
		},
	},
	mbchenshe: {
		audio: 3,
		logAudio: index => (typeof index === "number" ? "mbchenshe" + index + ".mp3" : 2),
		trigger: { global: "dying" },
		filter(event, player) {
			return event.player != player && lib.skill.mbchenshe.logTarget(event, player).length;
		},
		logTarget(event, player) {
			return [player, event.player, event.source].filter(target => target?.isIn() && target?.countDiscardableCards(player, "he"));
		},
		check(event, player) {
			const targets = lib.skill.mbchenshe.logTarget(event, player);
			return (
				targets.reduce((sum, target) => {
					return sum + get.effect(target, { name: "guohe_copy2" }, player, player);
				}, 0) > 0
			);
		},
		async content(event, trigger, player) {
			const targets = lib.skill.mbchenshe.logTarget(trigger, player),
				cards = [];
			for (const target of targets) {
				let result;
				if (!target.countDiscardableCards(player, "he")) {
					continue;
				}
				if (target == player) {
					result = await target.chooseToDiscard(`陈赦：请弃置一张牌`, "he", true).forResult();
				} else {
					result = await player.discardPlayerCard(`陈赦：请弃置${get.translation(target)}一张牌`, target, "he", true).forResult();
				}
				if (result?.cards) {
					cards.addArray(result.cards);
				}
			}
			if (cards.length == 3 && cards.map(card => get.suit(card, false)).unique().length == 1) {
				player.logSkill("mbchenshe", trigger.player, null, null, [3]);
				await trigger.player.recoverTo(trigger.player.maxHp);
				await player.removeSkills(event.name);
			}
		},
	},
	//手杀黄祖
	mbchizhang: {
		mod: {
			targetInRange(card, player, target) {
				if (get.tag(card, "damage") > 0.5) {
					return true;
				}
			},
		},
		locked: false,
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return (
				event.isFirstTarget &&
				get.tag(event.card, "damage") > 0.5 &&
				player.countDiscardableCards(player, "h") &&
				player.hasHistory("lose", evt => {
					const evtx = evt.relatedEvent || evt.getParent();
					return evtx == event.getParent() && evt.hs?.length;
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill), [1, Infinity], "chooseonly")
				.set("ai", card => {
					const suits = ui.selected.cards?.map(card => get.suit(card, get.player())).unique();
					if (suits?.includes(get.suit(card, get.player()))) {
						return 0;
					}
					return 6 - get.value(card);
				})
				.forResult();
		},
		logTarget(event, player) {
			return game.filterPlayer(target => target != player);
		},
		async content(event, trigger, player) {
			const cards = event.cards,
				colors = cards.map(card => get.color(card)).unique(),
				targets = game.filterPlayer(target => target != player);
			await player.discard(cards);
			targets.forEach(target => target.addTempSkill(event.name + "_global"));
			trigger.card.storage ??= {};
			trigger.card.storage.mbchizhang = [targets, colors];
		},
		subSkill: {
			global: {
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						let evt = get.event();
						if (evt.name != "chooseToUse") {
							evt = evt.getParent("chooseToUse");
						}
						if (!evt?.respondTo || !evt.respondTo[1]?.storage?.mbchizhang) {
							return;
						}
						const color = get.color(card, player),
							colors = evt.respondTo[1].storage.mbchizhang[1],
							targets = evt.respondTo[1].storage.mbchizhang[0];
						if (color === "unsure" || !targets.includes(player)) {
							return;
						}
						if (colors.includes(color)) {
							return false;
						}
					},
					cardRespondable(card, player) {
						let evt = get.event();
						if (evt.name != "chooseToRespond") {
							evt = evt.getParent("chooseToRespond");
						}
						if (!evt?.respondTo || !evt.respondTo[1]?.storage?.mbchizhang) {
							return;
						}
						const color = get.color(card, player),
							colors = evt.respondTo[1].storage.mbchizhang[1],
							targets = evt.respondTo[1].storage.mbchizhang[0];
						if (color === "unsure" || !targets.includes(player)) {
							return;
						}
						if (colors.includes(color)) {
							return false;
						}
					},
				},
			},
		},
	},
	mbduanyang: {
		audio: 3,
		logAudio: index => (typeof index === "number" ? "mbduanyang" + index + ".mp3" : 2),
		trigger: {
			player: "loseAfter",
			global: ["loseAsyncAfter", "equipAfter", "addJudgeAfter", "gainAfter", "addToExpansionAfter"],
		},
		usable: 1,
		filter(event, player) {
			if (event.getParent().name == "useCard") {
				return false;
			}
			return event.getl(player)?.hs?.some(card => get.name(card, false) == "sha" && !get.owner(card));
		},
		async content(event, trigger, player) {
			const card = trigger
				.getl(player)
				.hs.filter(card => get.name(card, false) == "sha" && !get.owner(card))
				.randomGet();
			await player.addToExpansion(card, "gain2").set("gaintag", ["mbduanyang"]);
		},
		intro: {
			markcount: "expansion",
			content: "expansion",
		},
		group: ["mbduanyang_damage", "mbduanyang_use"],
		subSkill: {
			use: {
				audio: ["mbduanyang1.mp3", "mbduanyang2.mp3"],
				charlotte: true,
				trigger: {
					global: "phaseAnyEnd",
				},
				filter(event, player) {
					return player.getExpansions("mbduanyang").length;
				},
				forced: true,
				async content(event, trigger, player) {
					for (const card of player.getExpansions("mbduanyang")) {
						if (!player.hasUseTarget(card, true, false)) {
							continue;
						}
						player.$gain2(card);
						const sha = get.autoViewAs(card, [card]);
						//sha.storage ??= {};
						sha.storage.mbduanyang = true;
						await player.chooseUseTarget(sha, [card], true, false);
					}
					await player.loseToDiscardpile(player.getExpansions("mbduanyang"));
				},
			},
			damage: {
				popup: false,
				trigger: { source: "damageSource" },
				filter(event, player) {
					const target = event.player;
					return event.card?.storage?.mbduanyang && event.card?.name == "sha" && target.isIn() && target.countCards("hej", card => target.canRecast(card));
				},
				async cost(event, trigger, player) {
					const target = trigger.player;
					event.result = await player.choosePlayerCard(get.prompt2(event.skill, target), target, "hej", [1, 2], card => target.canRecast(card)).forResult();
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const cards = event.cards,
						target = trigger.player;
					player.logSkill("mbduanyang", target, null, null, [3]);
					await target.recast(cards);
					await player.draw(4);
				},
			},
		},
	},
	//手杀田丰
	mbganggeng: {
		audio: 4,
		logAudio: index => (typeof index === "number" ? "mbganggeng" + index + ".mp3" : 2),
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 1;
		},
		filterCard: true,
		selectCard: [2, Infinity],
		filterTarget: lib.filter.notMe,
		lose: false,
		discard: false,
		delay: false,
		check(card) {
			if (get.player().countCards("h") < 3) {
				8 - get.value(card);
			}
			return 7 - get.value(card);
		},
		allowChooseAll: true,
		async content(event, trigger, player) {
			const cards = event.cards,
				target = event.targets[0];
			await player.give(cards, target);
			player.addTempSkill(event.name + "_effect");
			player.markAuto(event.name + "_effect", [target]);
		},
		subSkill: {
			effect: {
				intro: {
					content: "players",
				},
				onremove: true,
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					return lib.skill.mbganggeng_effect.logTarget(event, player).length;
				},
				logTarget(event, player) {
					return player
						.getStorage("mbganggeng_effect")
						.filter(target => target.isIn())
						.sortBySeat();
				},
				async content(event, trigger, player) {
					const targets = lib.skill[event.name].logTarget(trigger, player);
					for (const target of targets) {
						player.logSkill("mbganggeng", [target], null, null, [target.isMaxHandcard() ? 3 : 4]);
						if (target.isMaxHandcard()) {
							await player.draw();
						} else {
							await player.discardPlayerCard(target, "hej", true);
						}
					}
				},
			},
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					return 1;
				},
			},
		},
	},
	mbsijian: {
		audio: 2,
		trigger: {
			player: ["loseAfter", "dying"],
			global: ["loseAsyncAfter", "equipAfter", "addJudgeAfter", "gainAfter", "addToExpansionAfter"],
		},
		usable: 2,
		filter(event, player) {
			if (event.name == "dying") {
				return true;
			}
			return event.getl(player)?.hs?.length && !player.countCards("h");
		},
		async cost(event, trigger, player) {
			const count = player.getAllHistory("useSkill", evt => evt.skill == event.skill && evt.event.mbsijian_both).length;
			const result = await player
				.chooseButton([
					get.prompt(event.skill),
					[
						[
							["discard", `令一名其他角色使用下一张牌后需弃置一张牌`],
							["draw", `令当前回合角色摸两张牌`],
							["both", `背水！执行以上所有选项，然后失去${count}点体力`],
						],
						"textbutton",
					],
				])
				.set("filterButton", button => {
					const bool1 = game.hasPlayer(target => target != get.player()),
						bool2 = _status.currentPhase?.isIn();
					if (button.link == "discard") {
						return bool1;
					}
					if (button.link == "draw") {
						return bool2;
					}
					if (button.link == "both") {
						return (bool1 || bool2) && !_status.dying.length;
					}
				})
				.set("ai", button => {
					if (button.link == "discard") {
						return 1;
					}
					const target = _status.currentPhase;
					if (target?.isIn() && get.attitude(get.player(), target) > 0) {
						if (button.link == "both") {
							return get.event("count") > 1 ? 0 : 3;
						}
						return 2;
					}
					return 0;
				})
				.set("count", count)
				.forResult();
			if (result?.links) {
				event.result = {
					bool: true,
					cost_data: result.links[0],
				};
			}
		},
		async content(event, trigger, player) {
			const link = event.cost_data;
			if (link != "draw" && game.hasPlayer(target => target != player)) {
				const result = await player
					.chooseTarget(`死谏：令一名其他角色使用下一张牌后需弃置一张牌`, true, lib.filter.notMe)
					.set("ai", target => {
						const has = target.hasSkill("mbsijian_handcard") ? 0 : 2;
						return -get.attitude(get.player(), target) * target.countCards("he") + has;
					})
					.forResult();
				if (result?.targets) {
					const target = result.targets[0];
					player.line(target);
					target.addSkill(event.name + "_discard");
				}
			}
			if (link != "discard" && _status.currentPhase?.isIn()) {
				await _status.currentPhase.draw(2);
			}
			if (link == "both") {
				const num = player.getAllHistory("useSkill", evt => evt.skill == event.name && evt.event.mbsijian_both).length;
				await player.loseHp(num);
				event.getParent().set("mbsijian_both", true);
			}
		},
		subSkill: {
			discard: {
				trigger: { player: "useCardAfter" },
				forced: true,
				charlotte: true,
				content() {
					player.removeSkill(event.name);
					if (player.countDiscardableCards(player, "he")) {
						player.chooseToDiscard("he", true);
					}
				},
				intro: {
					content: "下次使用牌后弃置一张牌",
				},
				mark: true,
			},
		},
	},
	//手杀陆郁生
	mbrunwei: {
		audio: 4,
		logAudio: index => (typeof index === "number" ? "mbrunwei" + index + ".mp3" : 2),
		enable: "phaseUse",
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog(get.prompt2("mbrunwei"));
			},
			chooseControl(event, player) {
				return [1, 2, 3, 4, 5, "cancel2"];
			},
			check() {
				return 4;
			},
			backup(result, player) {
				return {
					num: result.control,
					log: false,
					delay: false,
					async content(event, trigger, player) {
						const num = lib.skill.mbrunwei_backup.num,
							skill = "mbrunwei";
						const cards = get.cards(num, true);
						player.logSkill("mbrunwei", null, null, null, [get.rand(1, 2)]);
						await player.showCards(cards, `${get.translation(player)}发动了【${get.translation(skill)}】`);
						const used = player.hasSkill(skill + "_twice");
						if (
							used &&
							!game.hasPlayer(target => {
								return !target.hasHistory("gain", evt => evt.cards?.length);
							})
						) {
							return;
						}
						const list = get.addNewRowList(cards, "color");
						const { result } = await player.chooseButtonTarget({
							createDialog: [
								[
									[[`润微：选择一名角色令其获得其中一种颜色的牌`], "addNewRow"],
									[
										dialog => {
											dialog.forcebutton = false;
											dialog._scrollset = false;
											dialog.css({
												top: "20%",
											});
										},
										"handle",
									],
									list.map(item => [Array.isArray(item) ? item : [item], "addNewRow"]),
								],
							],
							forced: true,
							used: used,
							targetsx: game.filterPlayer(target => !target.hasHistory("gain", evt => evt.cards?.length)),
							filterButton(button) {
								return button.links.length;
							},
							filterTarget(card, player, target) {
								if (get.event().used) {
									return get.event().targetsx?.includes(target);
								}
								return true;
							},
							ai1(button) {
								return button.links.length;
							},
							ai2(target) {
								const player = get.player();
								if (!get.event().used && player == target) {
									return 114514;
								}
								return get.attitude(player, target);
							},
						});
						if (result?.links?.length && result?.targets.length) {
							const target = result.targets[0],
								gain = cards.filter(card => get.color(card, false) == result.links[0]);
							player.line(target);
							if (!player.hasSkill(skill + "_twice")) {
								player.addTempSkill(skill + "_twice", "phaseChange");
								player.addMark(skill + "_twice", gain.length, false);
								player.addTip(skill + "_twice", `润微  ${gain.length}`);
							}
							let gaintag = [];
							if (player == target) {
								gaintag = ["mbrunwei"];
								player
									.when({ player: "phaseUseEnd" })
									.filter(evt => event.getParent("phaseUse") == evt)
									.step(async () => {
										const cards = player.getCards("h", card => card.hasGaintag("mbrunwei"));
										if (cards.length) {
											player.logSkill("mbrunwei", null, null, null, [4]);
											await player.modedDiscard(cards).set("discarder", player);
										}
									});
							}
							const next = target.gain(gain, "gain2");
							next.gaintag.addArray(gaintag);
							await next;
						}
					},
				};
			},
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					const used = player.hasSkill("mbrunwei_twice");
					if (!used) {
						return 1;
					} else if (
						game.hasPlayer(target => {
							return !target.hasHistory("gain", evt => evt.cards.length) && get.attitude(player, target) > 0;
						})
					) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: {
			twice: {
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				intro: {
					markcount: "mark",
					content: "再失去#张牌重置技能",
				},
				trigger: {
					player: "loseAfter",
					global: ["loseAsyncAfter", "equipAfter", "gainAfter", "addToExpansionAfter", "addJudgeAfter"],
				},
				filter(event, player) {
					return event.getl(player)?.cards2?.length && player.hasMark("mbrunwei_twice");
				},
				silent: true,
				content() {
					const num = trigger.getl(player)?.cards2?.length;
					if (num >= player.countMark(event.name)) {
						player.logSkill("mbrunwei", null, null, null, [3]);
						get.info(event.name).onremove(player, event.name);
						player.unmarkSkill(event.name);
						delete player.getStat().skill.mbrunwei;
						game.log(player, "重置了", `#g【${get.translation(event.name)}】`);
					} else {
						player.removeMark(event.name, num, false);
						player.addTip(event.name, `润微  ${player.countMark(event.name)}`);
					}
				},
			},
		},
	},
	mbshuanghuai: {
		audio: 3,
		logAudio: index => (typeof index === "number" ? "mbshuanghuai" + index + ".mp3" : 3),
		init(player, skill) {
			const history = player.getAllHistory("useSkill", evt => evt.skill == skill && evt.targets);
			if (history.length) {
				const target = history[history.length - 1].targets[0];
				if (target) {
					player.storage[skill] = target;
					player.markSkill(skill);
					player.addTip(skill, `霜怀 ${get.translation(target)}`);
				}
			}
		},
		onremove(player, skill) {
			delete player.storage[skill];
			player.removeTip(skill);
		},
		trigger: { global: "damageBegin4" },
		usable: 1,
		filter(event, player) {
			return get.distance(event.player, player) <= 1 && player != event.player;
		},
		popup: false,
		logTarget: "player",
		async cost(event, trigger, player) {
			const result = await player
				.chooseButton([
					get.prompt2(event.skill, trigger.player),
					[
						[
							["cancel", `防止此伤害`],
							["tao", `令其从弃牌堆获得一张【桃】`],
						],
						"textbutton",
					],
				])
				.set("filterButton", button => {
					return get.event().links.includes(button.link);
				})
				.set(
					"links",
					["cancel", "tao"].filter(link => {
						if (link == "tao") {
							const card = get.discardPile(cardx => cardx.name == "tao");
							if (!card) {
								return false;
							}
						}
						return true;
					})
				)
				.set("ai", button => {
					const trigger = get.event().getTrigger(),
						eff = get.damageEffect(trigger.player, trigger.source, get.player());
					if (eff > 0) {
						return 0;
					}
					if (trigger.player.hasSkillTag("maixie") && trigger.num === 1 && button.link == "tao") {
						return 1 + Math.random();
					}
					return Math.random();
				})
				.forResult();
			if (result.bool) {
				event.result = {
					bool: true,
					cost_data: result.links[0],
				};
			}
		},
		async content(event, trigger, player) {
			const link = event.cost_data,
				target = trigger.player,
				last = player.storage[event.name];
			player.logSkill("mbshuanghuai", target, null, null, [link == "cancel" ? 1 : 2]);
			if (link == "cancel") {
				trigger.cancel();
			} else {
				const card = get.discardPile("tao");
				if (card) {
					await target.gain(card, "gain2");
				}
			}
			if (last && last == target) {
				await game.asyncDraw([player, target]);
				return;
			}
			if (last && last != target) {
				player.logSkill("mbshuanghuai", null, null, null, [3]);
				await player.loseHp();
			}
			player.storage[event.name] = target;
			player.markSkill(event.name);
			player.addTip(event.name, `霜怀 ${get.translation(target)}`);
		},
		intro: {
			content: "player",
			markcount: () => 0,
		},
	},
	//势陈到
	potwanglie: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), "h")
				.set("ai", card => {
					const player = get.player();
					if (player.hasValueTarget(card, true)) {
						return player.getUseValue(card, false, true) * (get.tag(card, "damage") > 0.5 ? 2 : 1);
					}
					return 0.1 + Math.random();
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const card = event.cards[0];
			player.addGaintag(card, "potwanglie");
			player.addTempSkill(event.name + "_effect", "phaseUseAfter");
			await game.delayx();
		},
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (!player.isPhaseUsing() || typeof card !== "object" || num <= 0) {
					return;
				}
				if (get.itemtype(card) == "card" && card.hasGaintag("potwanglie")) {
					num / 20;
				}
				return num;
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("potwanglie");
				},
				mod: {
					targetInRange(card, player, target) {
						if (card.cards?.some(cardx => cardx.hasGaintag("potwanglie"))) {
							return true;
						}
					},
				},
				audio: "potwanglie",
				trigger: { player: ["useCard", "useCardAfter"] },
				filter(event, player) {
					return player.hasHistory("lose", evt => {
						const evtx = evt.relatedEvent || evt.getParent();
						if (event !== evtx) {
							return false;
						}
						return Object.values(evt.gaintag_map).flat().includes("potwanglie");
					});
				},
				silent: true,
				content() {
					if (event.triggername == "useCard") {
						player.logSkill(event.name);
						trigger.directHit.addArray(game.players);
						game.log(trigger.card, "不可被响应");
					} else {
						player.addTempSkill("potwanglie_debuff", "phaseUseAfter");
					}
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (arg?.card?.cards?.some(card => card.hasGaintag("potwanglie"))) {
							return true;
						}
					},
				},
			},
			debuff: {
				mark: true,
				charlotte: true,
				intro: { content: "本阶段不能对其他角色使用牌" },
				mod: {
					playerEnabled(card, player, target) {
						if (player !== target) {
							return false;
						}
					},
				},
			},
		},
	},
	pothongyi: {
		audio: 4,
		locked: true,
		popup: false,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.hasMark("pothongyi");
		},
		//提前若为
		maxMark() {
			//if (get.mode() == "doudizhu") return 1;
			return 4;
		},
		logAudio: index => (typeof index === "number" ? "pothongyi" + index + ".mp3" : 2),
		async cost(event, trigger, player) {
			const num = player.countMark("pothongyi");
			let list = [`摸${get.cnNumber(num)}张牌`, `移去所有“毅”标记`];
			const result = await player
				.chooseControl()
				.set("prompt", get.translation(event.skill) + "：请选择一项执行，并于结束阶段执行另一项")
				.set("choiceList", list)
				.set("num", num)
				.set("ai", () => {
					return 1;
				})
				.forResult();
			event.result = { bool: true, cost_data: result.index };
		},
		async content(event, trigger, player) {
			player.logSkill("pothongyi", null, null, null, [get.rand(3, 4)]);
			const control = event.cost_data;
			const num = player.countMark("pothongyi");
			if (!num) {
				return;
			}
			if (control === 0) {
				player.draw(num);
			} else if (control === 1) {
				player.clearMark("pothongyi");
			}
			//初版势陈到的遗产，默哀吧
			/*for (let i = 0; i < num; i++) {
					const card = new lib.element.VCard({ name: "sha", isCard: true });
					if (player.hasUseTarget(card)) await player.chooseUseTarget(card, true, false).set("prompt2", `还可以再使用${num - i}张`);
					else break;
				}*/
			player
				.when({ player: "phaseJieshuBegin" })
				.filter(evt => evt.getParent("phase") == trigger.getParent("phase"))
				.step(async (event, trigger, player) => {
					if (control === 1) {
						player.draw(num);
					} else if (control === 0) {
						player.clearMark("pothongyi");
					}
				});
		},
		marktext: "毅",
		intro: {
			name2: "毅",
			content: "mark",
		},
		group: "pothongyi_mark",
		subSkill: {
			mark: {
				audio: ["pothongyi1.mp3", "pothongyi2.mp3"],
				trigger: {
					global: "phaseBefore",
					source: "damageSource",
					player: ["enterGame", "damageEnd"],
				},
				//getIndex: event => (event.name === "damage" ? event.num : 1),
				filter(event, player) {
					if (player.countMark("pothongyi") >= get.info("pothongyi").maxMark()) {
						return false;
					}
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				async content(event, trigger, player) {
					const num = get.info("pothongyi").maxMark() - player.countMark("pothongyi");
					player.addMark("pothongyi", Math.min(trigger.name === "damage" ? 1 : 2, num));
				},
			},
		},
	},
	//手杀杨弘 —— by 刘巴
	//用同一张牌拼点神将
	mbjianji: {
		audio: 3,
		logAudio: index => (typeof index === "number" ? "mbjianji" + index + ".mp3" : "mbjianji" + get.rand(2, 3) + ".mp3"),
		enable: "phaseUse",
		usable: 1,
		filter: (event, player) => player.hasCard(true, "h"),
		filterTarget(card, player, target) {
			if (ui.selected.targets.length) {
				return ui.selected.targets[0].canCompare(target, true, true) && !ui.selected.targets[0].hasSkillTag("noCompareSource") && !target.hasSkillTag("noCompareTarget");
			}
			return true;
		},
		targetprompt: ["发起者", "拼点目标"],
		filterCard: true,
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			if (get.player().getHp() == 1) {
				return 8 - get.value(card);
			}
			if (get.name(card, get.player()) == "sha") {
				return 7 - get.value(card);
			}
			return 6 - get.value(card);
		},
		selectTarget: 2,
		multitarget: true,
		multiline: true,
		complexTarget: true,
		complexSelect: true,
		async content(event, trigger, player) {
			const target1 = event.targets[0],
				target2 = event.targets[1],
				card = event.cards[0];
			player.addGaintag(card, "mbjianji");
			player.addTempSkill(event.name + "_put");
			event.targets.forEach(target => target.addTempSkill(event.name + "_fake"));
			const result = await target1
				.chooseToCompare(target2, function (card) {
					if (typeof card == "string" && lib.skill[card]) {
						var ais =
							lib.skill[card].check ||
							function () {
								return 0;
							};
						return ais();
					}
					var addi = get.value(card) >= 8 && get.type(card) != "equip" ? -3 : 0;
					if (card.name == "du") {
						addi -= 3;
					}
					var source = _status.event.source;
					var player = _status.event.player;
					var event = _status.event.getParent();
					var getn = function (card) {
						//会赢吗？会赢的！
						if (card.hasGaintag("mbjianji")) {
							if (
								!player.hasCard(function (card) {
									var val = get.value(card);
									//对秦宓天辩的ai做了点小修改
									return val < 0 || (val <= 5 && get.number(card) >= 10);
								}, "h")
							) {
								return 10 + Math.random() * 3;
							}
						}
						if (player.hasSkillTag("forceWin", null, { card })) {
							return 13 * (event.small ? -1 : 1);
						}
						return get.number(card) * (event.small ? -1 : 1);
					};
					if (source && source != player) {
						if (get.attitude(player, source) > 1) {
							if (event.small) {
								return getn(card) - get.value(card) / 3 + addi;
							}
							return -getn(card) - get.value(card) / 3 + addi;
						}
						if (event.small) {
							return -getn(card) - get.value(card) / 5 + addi;
						}
						return getn(card) - get.value(card) / 5 + addi;
					} else {
						if (event.small) {
							return -getn(card) - get.value(card) / 5 + addi;
						}
						return getn(card) - get.value(card) / 5 + addi;
					}
				})
				.set("mbjianji", true)
				.set("mbjianji_card", card)
				.set("position", "hs")
				.set("filterCard", function (card) {
					/*if (typeof originalFilter === "function" && !originalFilter(card)) {
								return false;
							}*/
					if (get.position(card) == "s") {
						return card.hasGaintag("mbjianji");
					}
					return true;
				})
				.forResult();
			const sha = async function sha(target, victim) {
				if (!target.canUse({ name: "sha", isCard: true }, victim, false, false)) {
					return;
				}
				await target.useCard({ name: "sha", isCard: true }, victim).set("addCount", false);
			};
			player.removeGaintag("mbjianji");
			if (result.bool) {
				await sha(target1, target2);
			} else if (!result.tie) {
				await sha(target2, target1);
			}
			if (get.name(event.cards[0], player) === "sha") {
				let targets = [
					[target1, result.player],
					[target2, result.target],
				]
					.filter(list => {
						if (list[1] == card) {
							return true;
						}
					})
					.map(list => list[0])
					.sortBySeat();
				if (targets.length) {
					for (const target of targets) {
						await target.chat("我也干了");
					}
					await game.delayx();
					player.logSkill("mbjianji", [targets], null, null, [1]);
					for (const target of targets) {
						await target.damage();
					}
				}
			}
		},
		subSkill: {
			fake: {
				charlotte: true,
				trigger: {
					global: ["chooseCardOLBegin", "chooseCardOLEnd"],
				},
				filter(event, player) {
					return event.type == "compare" && event.getParent().mbjianji;
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					const evt = trigger.getParent(2);
					const card = evt.cards[0];
					if (!card) {
						return;
					}
					if (event.triggername == "chooseCardOLBegin") {
						const cardx = game.createFakeCards(card, true, "mbjianji_card")[0];
						player.directgains([cardx], null, "mbjianji");
					} else {
						const cards = player.getCards("s", card => card.hasGaintag("mbjianji"));
						game.deleteFakeCards(cards);
						if (!trigger.result[trigger.targets.indexOf(player)].skill) {
							if (trigger.result[trigger.targets.indexOf(player)].cards[0]._cardid === card.cardid) {
								trigger.result[trigger.targets.indexOf(player)].cards = [card];
							}
						}
					}
				},
			},
			put: {
				charlotte: true,
				trigger: { global: "compareCardShowBefore" },
				filter(event, player) {
					if (!event?.mbjianji) {
						return false;
					}
					const evt = event.getParent();
					if (!(evt?.name === "mbjianji" && evt.player === player)) {
						return false;
					}
					//其实不用看fixedResult吧，这会看card1，card2应该就可以了
					return [event.card1, event.card2].includes(evt.cards[0]);
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					const card = trigger.getParent().cards[0];
					if (get.position(card) !== "o") {
						const owner = get.owner(card);
						if (owner) {
							await owner.lose([card], ui.ordering, false).set("log", false);
						} else {
							await game.cardsGotoOrdering([card]);
						}
					}
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
	mbyuanmo: {
		audio: 3,
		trigger: { player: ["phaseZhunbeiBegin", "damageEnd"] },
		filter: (event, player) => player.canMoveCard(),
		logAudio: index => (typeof index === "number" ? "mbyuanmo" + index + ".mp3" : 1),
		async cost(event, trigger, player) {
			let nums = {};
			game.filterPlayer().forEach(target => (nums[target.playerid] = game.countPlayer(c => c.inRangeOf(target))));
			event.result = await player
				.moveCard(get.prompt2(event.skill))
				.set("logSkill", [event.skill, null, null, null, [get.rand(2, 3)]])
				.forResult();
			event.result.cost_data = nums;
		},
		usable: 2,
		popup: false,
		async content(event, trigger, player) {
			const drawer = event.targets[0];
			const num = event.cost_data[drawer.playerid] - game.countPlayer(c => c.inRangeOf(drawer));
			if (num > 0) {
				const result = await player
					.chooseBool("远谟", `是否令${get.translation(drawer)}摸${get.cnNumber(num)}张牌？`)
					.set("choice", get.effect(drawer, { name: "draw" }, player, player) > 0)
					.forResult();
				if (result?.bool) {
					player.logSkill("mbyuanmo", [drawer], null, null, [1]);
					await drawer.draw(Math.min(5, num));
				}
			}
		},
	},
	//夏侯尚 —— by 刘巴
	mbtanfeng: {
		audio: "twtanfeng",
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			const result = await player
				.chooseButton([
					get.prompt(event.skill),
					[
						[
							["discard", "弃置一名角色至多两张牌，然后若其手牌数小于等于你,你跳过摸牌阶段"],
							["damage", "对一名角色造成1点火焰伤害，然后若其体力值小于等于你，你跳过出牌阶段。"],
						],
						"textbutton",
					],
				])
				.set("filterButton", button => !(button.link === "discard" && !game.hasPlayer(c => c.countDiscardableCards(get.player(), "he"))))
				.set("ai", button => {
					const player = get.player();
					if (button.link === "discard") {
						if (
							!game.hasPlayer(target => {
								return target.countCards("he") - 2 > player.countCards("he") && get.effect(target, { name: "guohe_copy2" }, player);
							})
						) {
							return 0;
						}
						return 1;
					} else if (button.link === "damage") {
						if (!game.hasPlayer(target => target.getHp() - 1 > player.getHp() && get.damageEffect(target, player, player, "fire"))) {
							return 0;
						}
						return 1;
					}
				})
				.set("selectButton", [1, 2])
				.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.links,
			};
		},
		async content(event, trigger, player) {
			const choices = event.cost_data;
			if (choices.includes("discard") && game.hasPlayer(c => c.countDiscardableCards(player, "he"))) {
				const result = await player
					.chooseTarget("探锋：弃置一名角色至多两张牌", true, (card, player, target) => {
						return target.countDiscardableCards(player, "he");
					})
					.set("ai", target => {
						return get.effect(target, { name: "guohe_copy2" }, get.player());
					})
					.forResult();
				player.line(result.targets);
				await player.discardPlayerCard(result.targets[0], true, "he", [1, 2]);
				if (result.targets[0].countCards("h") <= player.countCards("h")) {
					player.skip("phaseDraw");
				}
			}
			if (choices.includes("damage")) {
				const result = await player
					.chooseTarget("探锋：对一名角色造成1点火焰伤害", true)
					.set("ai", target => {
						const player = get.player();
						return get.damageEffect(target, player, player, "fire");
					})
					.forResult();
				player.line(result.targets);
				await result.targets[0].damage("fire");
				if (result.targets[0].getHp() <= player.getHp()) {
					player.skip("phaseUse");
				}
			}
		},
	},
	//孙韶
	mbganjue: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("e") > 0;
		},
		filterCard: true,
		position: "e",
		viewAs: {
			name: "sha",
			storage: { mbganjue: true },
		},
		viewAsFilter(player) {
			if (!player.countCards("e")) {
				return false;
			}
		},
		prompt: "将装备区的一张牌当【杀】使用或打出",
		check(card) {
			return 6 - get.value(card);
		},
		precontent() {
			event.getParent().addCount = false;
			event.result._apply_args = {
				oncard: (card, player) => {
					const evt = get.event();
					evt.directHit.addArray(
						evt.targets.filter(target => {
							return !target.hasCard(cardx => get.color(cardx, target) == get.color(card), "h");
						})
					);
				},
			};
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }, player) - 0.2;
			},
			result: { player: 1 },
		},
		locked: false,
		mod: {
			cardUsable(card, player) {
				if (card?.storage?.mbganjue) {
					return Infinity;
				}
			},
			targetInRange(card, player, target) {
				if (card?.storage?.mbganjue) {
					return true;
				}
			},
		},
	},
	mbzhuji: {
		audio: 4,
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		logAudio: index => (typeof index === "number" ? "mbzhuji" + index + ".mp3" : 2),
		popup: false,
		async cost(event, trigger, player) {
			const list = get.addNewRowList(player.getCards("h"), "suit", player);
			const { result } = await player
				.chooseButton([
					[
						[[`${get.translation(event.skill)}：请选择一个花色的牌`], "addNewRow"],
						[
							dialog => {
								dialog.classList.add("fullheight");
								dialog.forcebutton = false;
								dialog._scrollset = false;
							},
							"handle",
						],
						list.map(item => [Array.isArray(item) ? item : [item], "addNewRow"]),
					],
				])
				.set("filterButton", button => {
					const player = get.player();
					if (!button.links.length || button.links.some(card => !lib.filter.cardDiscardable(card, player, get.event().getParent().name))) {
						return false;
					}
					return true;
				})
				.set("ai", button => {
					const player = get.player();
					const es = player.countCards("e");
					if (!es) {
						return 4 - button.links.length;
					}
					if (button.links.length > es && button.links.length <= 3) {
						return 5 - button.links.length;
					}
					return 0;
				});
			if (result?.bool && result?.links?.length) {
				event.result = {
					bool: result?.bool,
					cost_data: result?.links,
					cards: player.getCards("h").filter(card => result?.links?.includes(get.suit(card, player))),
				};
			}
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			const suit = get.suit(cards[0], player);
			//官方结算是对比弃牌前的
			const es = player.countCards("e");
			const next = player.modedDiscard(cards);
			await next;
			const card = get.cardPile2(card => get.type(card) == "equip" && get.suit(card) == suit);
			if (!card) {
				player.chat(`孩子们，牌堆没有${get.translation(suit)}装备牌了`);
				return;
			}
			await player.gain(card, "draw");
			if (player.hasCard(cardx => cardx == card, "h")) {
				await player.chooseUseTarget(card, true);
			}
			const num = next.cards.length;
			player.logSkill("mbzhuji", null, null, null, [num >= es ? get.rand(1, 2) : get.rand(3, 4)]);
			if (num >= es) {
				const result = await player
					.chooseButton(
						[
							"筑墼：选择一项执行",
							[
								[
									["draw", "摸两张牌"],
									["recover", "回复1点体力"],
									["hujia", "获得1点护甲"],
								],
								"textbutton",
							],
						],
						true
					)
					.set("filterButton", button => {
						const player = get.player();
						if (button.link == "recover") {
							return player.isDamaged();
						}
						if (button.link == "hujia") {
							return player.hujia < 5;
						}
						return true;
					})
					.set("ai", button => {
						if (button.link == "recover") {
							return get.recoverEffect(player, player, player) > 0 ? 1 : 0;
						}
						return Math.random();
					})
					.forResult();
				if (!result?.bool || !result.links?.length) {
					return;
				}
				switch (result.links[0]) {
					case "draw": {
						await player.draw(2);
						break;
					}
					case "recover": {
						await player.recover();
						break;
					}
					case "hujia": {
						await player.changeHujia(1, null, true);
						break;
					}
				}
			}
		},
	},
	//庞羲
	mbxuye: {
		audio: 3,
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.player.isMinHandcard() && event.player.isAlive();
		},
		usable: 1,
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logAudio: index => "mbxuye" + (typeof index === "number" ? index : [1, 3].randomGet()) + ".mp3",
		async content(event, trigger, player) {
			const target = event.targets[0]; //兼容匡襄后续效果才这么写的
			const isMax = target.isMaxHandcard();
			await target.draw(2);
			//player.logSkill("mbxuye", [target], null, null, !isMax && target.isMaxHandcard() && target.countCards("ej") > 0 ? [1] : [get.rand(2, 3)]);
			if (!isMax && target.isMaxHandcard() && target.countCards("hej") > 0) {
				player.logSkill("mbxuye", target, null, null, [2]);
				const result = await player.choosePlayerCard(`蓄业：将${get.translation(target)}场上一张牌置于牌堆顶`, target, "hej", true).forResult();
				const card = result.cards[0];
				target.$throw(card, 1000);
				game.log(player, "将", card, "置于牌堆顶");
				await target.lose(card, ui.cardPile, "insert");
				game.updateRoundNumber();
			}
		},
		ai: { expose: 0.2 },
	},
	mbkuangxiang: {
		audio: 3,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => {
				return target != player && target.countCards("h") <= player.countCards("h");
			});
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") <= player.countCards("h");
		},
		usable: 1,
		logAudio: index => "mbkuangxiang" + [1, 3].randomGet() + ".mp3",
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.addTempSkill("mbkuangxiang_effect", { player: "phaseUseBegin" });
			player.markAuto("mbkuangxiang_effect", [player, target]);
			await player.swapHandcards(target);
		},
		derivation: "mbxuye",
		//ai待补充
		ai: {
			order: 6,
			result: {
				target(player, target) {
					const hs1 = player.getCards("h"),
						hs2 = target.getCards("h");
					return get.value(hs1, player) - get.value(hs2, target);
				},
			},
		},
		group: ["mbkuangxiang_mark"],
		subSkill: {
			//给交换的牌上标记
			mark: {
				charlotte: true,
				trigger: { global: "loseAsyncBegin" },
				filter(event, player) {
					return event.getParent(2).name == "mbkuangxiang" && event.getParent(2).player == player;
				},
				silent: true,
				firstDo: true,
				content() {
					//考虑场上出现复数个技能的情况
					game.broadcastAll(player => {
						lib.translate["mbkuangxiang_" + player.playerid] = "匡襄";
					}, player);
					trigger.set("gaintag", ["mbkuangxiang_" + player.playerid]);
				},
			},
			effect: {
				charlotte: true,
				onremove(player, skill) {
					game.filterPlayer(target => {
						return player.storage[skill].includes(target);
					}).forEach(target => target.removeGaintag("mbkuangxiang_" + player.playerid));
					delete player.storage[skill];
				},
				intro: { content: "players" },
				audio: "mbkuangxiang2.mp3",
				trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
				getIndex(event, player) {
					return game
						.filterPlayer2(target => {
							if (!player.getStorage("mbkuangxiang_effect").includes(target)) {
								return false;
							}
							let evt = event.getl(target);
							if (!evt?.hs?.length) {
								return false;
							}
							if (event.name == "lose") {
								return Object.values(event.gaintag_map)
									.flat()
									.includes("mbkuangxiang_" + player.playerid);
							}
							return target.hasHistory("lose", evtx => {
								return (
									evtx.getParent() == event &&
									evtx.hs.length &&
									Object.values(evtx.gaintag_map)
										.flat()
										.includes("mbkuangxiang_" + player.playerid)
								);
							});
						})
						.sortBySeat();
				},
				check: () => true,
				prompt2: "你执行一次〖蓄业〗的效果：摸两张牌，然后若手牌数因此成为全场最多，你将场上的一张牌置于牌堆顶。",
				filter(event, player, triggername, target) {
					return !target.hasCard(card => card.hasGaintag("mbkuangxiang_" + player.playerid), "h");
				},
				async content(event, trigger, player) {
					var next = game.createEvent("mbkuangxiang_xuye");
					next.set("player", player);
					next.set("targets", [player]);
					next.setContent(lib.skill.mbxuye.content);
				},
			},
		},
	},
	//势娄圭
	potguansha: {
		limited: true,
		audio: 2,
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return player.countCards("he");
		},
		check(event, player) {
			return player.getCards("he").reduce((sum, card) => sum + get.info("zhiheng").check(card), 0) > 0;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cards = player.getCards("he");
			await player.loseToDiscardpile(cards);
			let gains = [];
			while (gains.length < cards.length) {
				const card = get.cardPile2(card => get.type(card) === "basic" && !gains.includes(card));
				if (card) {
					gains.push(card);
				} else {
					break;
				}
			}
			if (gains.length) {
				await player.gain(gains, "gain2");
				player.addTempSkill("potguansha_hand");
				player.addMark("potguansha_hand", gains.length, false);
			}
		},
		subSkill: {
			hand: {
				charlotte: true,
				onremove: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("potguansha_hand");
					},
				},
				intro: { content: "手牌上限+#" },
			},
		},
	},
	potjiyu: {
		audio: 3,
		enable: "phaseUse",
		filter(event, player) {
			return player.hasCard(card => lib.filter.cardDiscardable(card, player), "h");
		},
		filterCard: lib.filter.cardDiscardable,
		check(card) {
			return 8 - get.value(card);
		},
		prompt() {
			return lib.translate["potjiyu_info"].split("②")[0].slice(1);
		},
		usable: 1,
		content() {
			let gains = [];
			let types = [get.type2(cards[0])];
			while (true) {
				const card = get.cardPile2(card => !types.includes(get.type2(card)));
				if (card) {
					gains.push(card);
					types.push(get.type2(card));
				} else {
					break;
				}
			}
			if (gains.length) {
				player.addTempSkill("potjiyu_effect", ["phaseBefore", "phaseChange", "phaseAfter", ...lib.phaseName.map(i => i + "After")]);
				player.gain(gains, "gain2").gaintag.add("potjiyu_effect");
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
		group: "potjiyu_refresh",
		subSkill: {
			effect: {
				charlotte: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
					if (typeof player.storage?.counttrigger?.["potjiyu_refresh"] === "number") {
						delete player.storage.counttrigger["potjiyu_refresh"];
					}
				},
			},
			refresh: {
				audio: "potjiyu",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (player.hasCard(card => card.hasGaintag("potjiyu_effect"), "h") || typeof player.getStat("skill")?.["potjiyu"] !== "number") {
						return false;
					}
					const evt = event.getl(player);
					if (!evt?.hs?.length) {
						return false;
					}
					if (event.name === "lose") {
						return Object.values(event.gaintag_map).flat().includes("potjiyu_effect");
					}
					return player.hasHistory("lose", evt => {
						if (event !== evt.getParent()) {
							return false;
						}
						return Object.values(evt.gaintag_map).flat().includes("potjiyu_effect");
					});
				},
				usable: 2,
				forced: true,
				locked: false,
				content() {
					delete player.getStat("skill")["potjiyu"];
					player.popup("potjiyu");
					game.log(player, "重置了技能", "#g【" + get.translation("potjiyu") + "】");
				},
			},
		},
	},
	//势于吉
	potdaozhuan: {
		audio: 4,
		enable: "chooseToUse",
		logAudio: index => (typeof index === "number" ? "potdaozhuan" + index + ".mp3" : 2),
		filter(event, player) {
			if (event.potdaozhuan) {
				return false;
			}
			let num = player.countCards("he");
			if (_status.currentPhase?.isIn() && _status.currentPhase !== player) {
				num += _status.currentPhase.countCards("he");
			}
			if (num <= 0) {
				return false;
			}
			return get
				.inpileVCardList(info => {
					const name = info[2];
					if (get.type(name) !== "basic") {
						return false;
					}
					return !player.getStorage("potdaozhuan_used").includes(name);
				})
				.some(card => event.filterCard(new lib.element.VCard({ name: card[2], nature: card[3], isCard: true }), player, event));
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("道转", [get.inpileVCardList(info => get.type(info[2]) === "basic"), "vcard"]);
			},
			filter(button, player) {
				const event = get.event().getParent();
				if (player.getStorage("potdaozhuan_used").includes(button.link[2])) {
					return false;
				}
				return event.filterCard(new lib.element.VCard({ name: button.link[2], nature: button.link[3], isCard: true }), player, event);
			},
			check(button) {
				const event = get.event().getParent();
				if (event.type !== "phase") {
					return 1;
				}
				return get.player().getUseValue(new lib.element.VCard({ name: button.link[2], nature: button.link[3], isCard: true }));
			},
			prompt(links, player) {
				let prompt = "将你";
				if (_status.currentPhase?.isIn() && _status.currentPhase !== player) {
					prompt += "与" + get.translation(_status.currentPhase);
				}
				prompt += "的一张牌置入弃牌堆，";
				return '###道转###<div class="text center">' + prompt + "视为使用" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】</div>";
			},
			backup(links) {
				return {
					filterCard: () => false,
					selectCard: -1,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
					},
					log: false,
					async precontent(event, trigger, player) {
						const goon = _status.currentPhase?.isIn() && _status.currentPhase !== player;
						let prompt = "将你";
						if (goon) {
							prompt += "与" + get.translation(_status.currentPhase);
						}
						prompt += "的一张牌置入弃牌堆";
						let dialog = ["道转：" + prompt];
						if (player.countCards("h")) {
							dialog.push('<div class="text center">你的手牌</div>');
							dialog.push(player.getCards("h"));
						}
						if (player.countCards("e")) {
							dialog.push('<div class="text center">你的装备牌</div>');
							dialog.push(player.getCards("e"));
						}
						if (goon) {
							const target = _status.currentPhase;
							if (target.countCards("h")) {
								const cards = target.getCards("h");
								dialog.push('<div class="text center">' + get.translation(target) + "的手牌</div>");
								if (player.hasSkillTag("viewHandcard", null, target, true)) {
									dialog.push(cards);
								} else {
									dialog.push([cards.slice().randomSort(), "blank"]);
								}
							}
							if (target.countCards("e")) {
								dialog.push('<div class="text center">' + get.translation(target) + "的装备牌</div>");
								dialog.push(target.getCards("e"));
							}
						}
						const result = await player
							.chooseButton(dialog)
							.set("filterButton", button => {
								const card = button.link,
									{ player, useCard, targets } = get.event();
								if (!targets?.length) {
									return true;
								}
								ui.selected.cards.add(card);
								const bool = targets.some(target => {
									if (!lib.filter.cardEnabled(useCard, player, "forceEnable")) {
										return false;
									}
									return lib.filter.targetEnabled2(useCard, player, target) && lib.filter.targetInRange(useCard, player, target);
								});
								ui.selected.cards.remove(card);
								return bool;
							})
							.set("useCard", event.result.card)
							.set("targets", event.result.targets)
							.set("ai", button => {
								const player = get.player(),
									source = get.owner(button.link);
								return get.value(button.link, get.owner(source)) * Math.sign(-get.attitude(player, source));
							})
							.forResult();
						if (result?.bool) {
							player.logSkill("potdaozhuan", null, null, null, [get.rand(1, 2)]);
							player.addTempSkill("potdaozhuan_used", "roundStart");
							player.markAuto("potdaozhuan_used", [event.result.card.name]);
							if (result.links?.length) {
								const target = _status.currentPhase;
								const owners = result.links.map(i => get.owner(i)).unique();
								await owners[0].loseToDiscardpile(result.links);
								if (owners[0] === target) {
									player.tempBanSkill("potdaozhuan", "roundStart");
									player.logSkill("potdaozhuan", null, null, null, [get.rand(3, 4)]);
								}
							}
							return;
						}
						const evt = event.getParent();
						evt.set("potdaozhuan", true);
						evt.goto(0);
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (player.isTempBanned("potdaozhuan") || player.getStat("skill")["potdaozhuan"]) {
				return false;
			}
			return get.type(name) === "basic" && !player.getStorage("potdaozhuan_used").includes(name);
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") {
					return false;
				}
				return get.info("potdaozhuan").hiddenCard(
					player,
					(() => {
						switch (tag) {
							case "fireAttack":
								return "sha";
							default:
								return tag.slice("respond".length).toLowerCase();
						}
					})()
				);
			},
			order(item, player) {
				if (player && _status.event.type === "phase") {
					let max = 0,
						names = get.inpileVCardList(info => {
							const name = info[2];
							if (get.type(name) !== "basic") {
								return false;
							}
							return !player.getStorage("potdaozhuan_used").includes(name);
						});
					names = names.map(namex => new lib.element.VCard({ name: namex[2], nature: namex[3] }));
					names.forEach(card => {
						if (player.getUseValue(card) > 0) {
							let temp = get.order(card);
							if (temp > max) {
								max = temp;
							}
						}
					});
					return max + (max > 0 ? 0.2 : 0);
				}
				return 10;
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
				intro: { content: "本轮已使用牌名：$" },
			},
		},
	},
	potfuji: {
		audio: 5,
		enable: "phaseUse",
		logAudio: () => 2,
		filter(event, player) {
			return player.countCards("he") > 0 && game.hasPlayer(target => target !== player);
		},
		filterCard: true,
		position: "he",
		selectCard: () => [1, Infinity],
		filterTarget: lib.filter.notMe,
		selectTarget: () => ui.selected.cards.length,
		targetprompt() {
			const links = ui.selected.cards;
			return ["获得", get.translation(links[ui.selected.targets.length - 1])].join("<br>");
		},
		check(card) {
			const player = get.player();
			if (
				ui.selected.cards.length >=
				game.countPlayer(current => {
					return current != player && get.attitude(player, current) > 0;
				})
			) {
				return 0;
			}
			return 6 - get.value(card);
		},
		multiline: true,
		multitarget: true,
		complexSelect: true,
		usable: 1,
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const { targets, cards: links } = event;
			await player.showCards(links, get.translation(player) + "发动了【" + get.translation(event.name) + "】");
			const gain_list = targets.map((target, i) => [target, [links[i]]]);
			await game
				.loseAsync({
					gain_list: gain_list,
					player: player,
					cards: links,
					giver: player,
					animate: "give",
					gaintag: ["potfuji"],
				})
				.setContent("gaincardMultiple");
			for (const list of gain_list) {
				list[0].addSkill("potfuji_effect");
			}
			if (player.isMinHandcard()) {
				player.logSkill("potfuji", null, null, null, [3]);
				player.changeSkin({ characterName: "pot_yuji" }, "pot_yuji_shadow");
				get.info(event.name).dynamic(player);
				await player.draw(2);
				player.addTempSkill(["potfuji_sha", "potfuji_shan"], { player: "phaseBegin" });
			}
			player
				.when({ player: ["phaseBegin"] })
				.assign({
					lastDo: true,
				})
				.then(() => {
					player.changeSkin({ characterName: "pot_yuji" }, "pot_yuji");
					game.broadcastAll(function (player) {
						if (player.node.potfuji_dynamic) {
							player.node.potfuji_dynamic.delete();
							player.node.potfuji_dynamic2.delete();
							delete player.node.potfuji_dynamic;
							delete player.node.potfuji_dynamic2;
						}
					}, player);
				});
		},
		dynamic(player) {
			game.broadcastAll(function (player) {
				if (
					(() => {
						for (const sheet of document.styleSheets) {
							try {
								const rules = sheet.cssRules || sheet.rules;
								for (const rule of rules) {
									if (rule.selectorText === ".player .player_fuji") {
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
					lib.init.sheet(".player .player_fuji { animation: game_start 0.5s; -webkit-animation: game_start 0.5s; position: absolute; width: 100%; height: 100%; left: 0; top: 0; z-index: 4; pointer-events: none; background: linear-gradient( to top, rgba(0, 255, 255, 0.3) 0%, rgba(0, 255, 255, 0.3) 60%, rgba(0, 255, 255, 0) 80%, rgba(0, 255, 255, 0) 100% );}");
				}
				if (!player.node.potfuji_dynamic) {
					player.node.potfuji_dynamic = ui.create.div(".player_fuji", player.node.avatar);
					player.node.potfuji_dynamic2 = ui.create.div(".player_fuji", player.node.avatar2);
				}
			}, player);
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					var card = ui.selected.cards[ui.selected.targets.length];
					if (!card) {
						return 0;
					}
					if (get.value(card) < 0) {
						return -1;
					}
					return Math.sqrt(5 - Math.min(4, target.countCards("h")));
				},
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: {
					player: ["useCard", "useCardAfter"],
					source: "damageBegin1",
				},
				mark: true,
				marktext: "符",
				intro: {
					mark(dialog, content, player) {
						const cards = player.getCards("h", card => card.hasGaintag("potfuji"));
						if (cards?.length) {
							dialog.addAuto(cards);
						} else {
							dialog.addText("无符济牌");
						}
					},
				},
				filter(event, player, name) {
					const ori_event = event.name === "damage" ? event.getParent("useCard") : event;
					if (
						!ori_event ||
						ori_event.name !== "useCard" ||
						!player.hasHistory("lose", evt => {
							const evtx = evt.relatedEvent || evt.getParent();
							if (evtx !== ori_event) {
								return false;
							}
							return Object.values(evt.gaintag_map).flat().includes("potfuji");
						})
					) {
						return false;
					}
					return name === "useCard" || ori_event.card.name === (event.name === "damage" ? "sha" : "shan");
				},
				forced: true,
				logTarget: "player",
				popup: false,
				async content(event, trigger, player) {
					if (trigger.name === "damage" || event.triggername === "useCardAfter") {
						player.logSkill("potfuji", null, null, null, [trigger.name === "damage" ? 4 : 5]);
					}
					if (trigger.name === "damage") {
						trigger.num++;
					} else if (event.triggername === "useCardAfter") {
						await player.draw();
					} else {
						const history = player.getHistory("lose", evt => {
								if ((evt.relatedEvent || evt.getParent()) !== trigger) {
									return false;
								}
								return Object.values(evt.gaintag_map).flat().includes("potfuji");
							})[0],
							cards = history.getl(player).cards2.filter(card => history.gaintag_map[card.cardid]?.includes("potfuji"));
						let gains = [];
						for (const card of cards) {
							const gain = get.cardPile2(gain => !gains.includes(gain) && get.suit(gain) === get.suit(card, false));
							if (gain) {
								gains.push(gain);
							}
						}
						if (gains.length) {
							await player.gain(gains, "gain2");
						}
					}
				},
			},
			sha: {
				charlotte: true,
				mark: true,
				marktext: "杀",
				intro: {
					name: "符济 - 杀",
					content: "使用【杀】造成的伤害+1",
				},
				audio: "potfuji4.mp3",
				trigger: { player: "useCard" },
				filter(event, player) {
					return event.card.name === "sha";
				},
				forced: true,
				logTarget: "player",
				content() {
					const gain = get.cardPile2(gain => get.suit(gain) === get.suit(trigger.card, false));
					if (gain) {
						player.gain(gain, "gain2");
					}
					trigger.baseDamage++;
					player
						.when({
							player: "useCardAfter",
						})
						.filter(evt => evt === trigger)
						.then(() => {
							player.removeSkill("potfuji_sha");
						});
				},
			},
			shan: {
				charlotte: true,
				mark: true,
				marktext: "闪",
				intro: {
					name: "符济 - 闪",
					content: "使用【闪】结算完毕后摸一张牌",
				},
				audio: "potfuji5.mp3",
				trigger: { player: "useCard" },
				filter(event, player) {
					return event.card.name === "shan";
				},
				forced: true,
				content() {
					const gain = get.cardPile2(gain => get.suit(gain) === get.suit(trigger.card, false));
					if (gain) {
						player.gain(gain, "gain2");
					}
					player
						.when("useCardAfter")
						.filter(evt => evt === trigger)
						.then(() => {
							player.removeSkill("potfuji_shan");
							player.draw();
						});
				},
			},
		},
	},
	//势董昭
	spmiaolve: {
		audio: "twmiaolve",
		inherit: "twmiaolve",
		getIndex: () => 1,
		async cost(event, trigger, player) {
			if (trigger.name == "damage") {
				const { result } = await player.chooseButton([`###${get.prompt(event.skill)}###获得一张智囊或摸两张牌`, [get.zhinangs(), "vcard"], [["摸两张牌", "取消"], "tdnodes"]], true).set("ai", button => {
					const player = get.player();
					const { link } = button;
					if (Array.isArray(link)) {
						if (!get.cardPile(cardx => cardx.name == link[2])) {
							return 0;
						}
						return (Math.random() + 1.5) * player.getUseValue({ name: link[2] });
					}
					if (link == "摸两张牌") {
						return get.effect(player, { name: "draw" }, player, player) * 2;
					}
					return 0;
				});
				event.result = {
					bool: result?.bool && result?.links?.[0] != "取消",
					cost_data: result?.links,
				};
			} else {
				event.result = { bool: true };
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "damage") {
				if (event.cost_data[0] == "摸两张牌") {
					await player.draw(2);
				} else {
					const card = get.cardPile(card => card.name == event.cost_data[0][2]);
					if (card) {
						await player.gain(card, "gain2");
					}
				}
			} else {
				if (!lib.inpile.includes("dz_mantianguohai")) {
					lib.inpile.add("dz_mantianguohai");
				}
				if (!_status.dz_mantianguohai_suits) {
					_status.dz_mantianguohai_suits = lib.suit.slice(0);
				}
				const list = _status.dz_mantianguohai_suits.randomRemove(2).map(i => game.createCard2("dz_mantianguohai", i, 5));
				if (list.length) {
					await player.gain(list, "gain2", "log");
				}
			}
		},
	},
	spyingjia: {
		audio: "twyingjia",
		inherit: "twyingjia",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			player.awakenSkill(event.name);
			await player.discard(cards);
			target.insertPhase(event.name);
			target.addSkill(event.name + "_draw");
		},
		subSkill: {
			draw: {
				charlotte: true,
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					return event.skill == "spyingjia";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					await player.draw(2);
				},
			},
		},
	},
	//势太史慈 --- by 刘巴
	potzhanlie: {
		audio: 3,
		trigger: { global: "phaseBegin" },
		forced: true,
		locked: false,
		logAudio: () => 2,
		content() {
			const effectMap = new Map([
				["hp", player.getHp()],
				["damagedHp", player.getDamagedHp()],
				["countplayer", game.countPlayer()],
			]);
			const num = effectMap.get(player.storage.potzhanlie) || player.getAttackRange();
			player.addTempSkill("potzhanlie_addMark");
			if (num > 0) {
				player.addMark("potzhanlie_addMark", num, false);
			}
		},
		get limit() {
			return 6;
		},
		group: "potzhanlie_lie",
		subSkill: {
			addMark: {
				charlotte: true,
				onremove: true,
				audio: "potzhanlie3.mp3",
				trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"] },
				getIndex(event, player) {
					return Math.min(
						event.getd().filter(i => i.name === "sha").length,
						get.info("potzhanlie").limit - player.countMark("potzhanlie_lie"),
						Math.max(
							player.countMark("potzhanlie_addMark") -
								game
									.getGlobalHistory(
										"everything",
										evt => {
											if (evt === event) {
												return false;
											}
											return ["lose", "loseAsync", "cardsDiscard"].includes(evt.name) && evt.getd().some(i => i.name === "sha");
										},
										event
									)
									.reduce((sum, evt) => sum + evt.getd().filter(i => i.name === "sha").length, 0),
							0
						)
					);
				},
				forced: true,
				content() {
					player.addMark("potzhanlie_lie", 1);
				},
				intro: { content: "本回合前#张【杀】进入弃牌堆后，获得等量“烈”标记" },
			},
			lie: {
				trigger: { player: "phaseUseEnd" },
				filter: (event, player) => player.hasUseTarget(new lib.element.VCard({ name: "sha", isCard: true }), false),
				direct: true,
				content() {
					const str = player.hasMark("potzhanlie_lie") ? "移去所有“烈”，" : "";
					player.chooseUseTarget("###" + get.prompt("potzhanlie") + '###<div class="text center">' + str + "视为使用一张无次数限制的【杀】</div>", new lib.element.VCard({ name: "sha", isCard: true }), false).set("oncard", () => {
						const event = get.event(),
							{ player } = event,
							num = player.countMark("potzhanlie_lie");
						player.addTempSkill("potzhanlie_buff");
						player.clearMark("potzhanlie_lie");
						event.set("potzhanlie", Math.floor(num / 2));
					}).logSkill = "potzhanlie";
				},
				marktext: "烈",
				intro: {
					name: "烈",
					content: "mark",
				},
			},
			buff: {
				charlotte: true,
				trigger: { player: "useCard1" },
				filter: event => event?.potzhanlie,
				forced: true,
				locked: false,
				popup: false,
				async content(event, trigger, player) {
					const num = trigger.potzhanlie,
						str = get.translation(trigger.card);
					const result = await player
						.chooseButton([
							"战烈：是否选择至多" + get.cnNumber(num) + "项执行？",
							[
								[
									["目标+1", "令" + str + "可以额外指定一个目标"],
									["伤害+1", "令" + str + "基础伤害值+1"],
									["弃牌响应", "令" + str + "需额外弃置一张牌方可响应"],
									["摸牌", str + "结算完毕后，你摸三张牌"],
								],
								"textbutton",
							],
						])
						.set("selectButton", [1, num])
						.set("ai", button => {
							const player = get.player(),
								trigger = get.event().getTrigger(),
								choice = button.link;
							switch (choice) {
								case "目标+1":
									return Math.max(
										...game
											.filterPlayer(target => {
												return !trigger.targets?.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target) && lib.filter.targetInRange(trigger.card, player, target);
											})
											.map(target => get.effect(target, trigger.card, player, player))
									);
								case "伤害+1":
									return (trigger.targets || []).reduce((sum, target) => {
										const effect = get.damageEffect(target, player, player);
										return (
											sum +
											effect *
												(target.hasSkillTag("filterDamage", null, {
													player: player,
													card: trigger.card,
												})
													? 1
													: 1 + (trigger.baseDamage || 1) + (trigger.extraDamage || 0))
										);
									}, 0);
								case "弃牌响应":
									return (trigger.targets || []).reduce((sum, target) => {
										const card = get.copy(trigger.card);
										game.setNature(card, "stab");
										return sum + get.effect(target, card, player, player);
									}, 0);
								case "摸牌":
									return get.effect(player, { name: "draw" }, player, player) * 3;
							}
						})
						.forResult();
					if (result.bool) {
						const choices = result.links;
						game.log(player, "选择了", "#g【战烈】", "的", "#y" + choices);
						for (const choice of choices) {
							player.popup(choice);
							switch (choice) {
								case "目标+1":
									player
										.when("useCard2")
										.filter(evt => evt === trigger)
										.then(() => {
											player
												.chooseTarget("是否为" + get.translation(trigger.card) + "增加一个目标？", (card, player, target) => {
													const evt = get.event().getTrigger();
													return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target) && lib.filter.targetInRange(evt.card, player, target);
												})
												.set("ai", target => {
													const player = get.player(),
														evt = get.event().getTrigger();
													return get.effect(target, evt.card, player);
												});
										})
										.then(() => {
											if (result?.bool && result.targets?.length) {
												const [target] = result.targets;
												player.line(target, trigger.card.nature);
												trigger.targets.add(target);
												game.log(target, "成为了", trigger.card, "的额外目标");
											}
										});
									break;
								case "伤害+1":
									trigger.baseDamage++;
									game.log(trigger.card, "造成的伤害", "#y+1");
									break;
								case "弃牌响应":
									player.addTempSkill("potzhanlie_guanshi");
									player.markAuto("potzhanlie_guanshi", [trigger.card]);
									break;
								case "摸牌":
									player
										.when("useCardAfter")
										.filter(evt => evt === trigger)
										.then(() => player.draw(3));
									break;
							}
						}
					}
				},
			},
			guanshi: {
				charlotte: true,
				onremove: true,
				audio: "potzhanlie",
				trigger: { player: "useCardToBegin" },
				filter(event, player) {
					if (!event.target?.isIn()) {
						return false;
					}
					return !event.getParent().directHit.includes(event.target) && player.getStorage("potzhanlie_guanshi").includes(event.card);
				},
				forced: true,
				logTarget: "target",
				async content(event, trigger, player) {
					const { target } = trigger;
					const { result } = await target.chooseToDiscard("战烈：弃置一张牌，否则不可响应" + get.translation(trigger.card)).set("ai", card => {
						const player = get.player(),
							trigger = get.event().getTrigger();
						if (get.effect(player, trigger.card, trigger.player, player) >= 0) {
							return 0;
						}
						const num = player.countCards("hs", { name: "shan" });
						if (num === 0) {
							return 0;
						}
						if (card.name === "shan" && num <= 1) {
							return 0;
						}
						return 8 - get.value(card);
					});
					if (!result?.bool) {
						trigger.set("directHit", true);
						game.log(target, "不可响应", trigger.card);
					}
				},
			},
		},
	},
	pothanzhan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.targets[0];
			for (const drawer of [player, target]) {
				const num = (() => {
					return (
						({
							hp: drawer.getHp(),
							damagedHp: drawer.getDamagedHp(),
							countplayer: game.countPlayer(),
						}[player.storage.pothanzhan] ?? drawer.maxHp) - drawer.countCards("h")
					);
				})();
				if (num > 0) {
					await drawer.draw(Math.min(num, 3));
				}
			}
			const juedou = new lib.element.VCard({ name: "juedou", isCard: true });
			if (player.canUse(juedou, target)) {
				await player.useCard(juedou, target, false);
			}
		},
		ai: {
			order(item, player) {
				if ((player.countCards("h", { name: "sha" }) || player.maxHp - player.countCards("h")) > 1) {
					return 10;
				}
				return 1;
			},
			result: {
				target(player, target) {
					return (
						get.effect(target, new lib.element.VCard({ name: "juedou", isCard: true }), player, player) -
						Math.max(
							0,
							Math.min(
								3,
								(() => {
									return (
										({
											hp: target.getHp(),
											damagedHp: target.getDamagedHp(),
											countplayer: game.countPlayer(),
										}[player.storage.pothanzhan] ?? target.maxHp) - target.countCards("h")
									);
								})()
							)
						) *
							get.effect(target, { name: "draw" }, player, player)
					);
				},
			},
		},
	},
	potzhenfeng: {
		limited: true,
		audio: 4,
		enable: "phaseUse",
		filter(event, player) {
			return player.isDamaged() || ["pothanzhan", "potzhanlie"].some(skill => player.hasSkill(skill, null, null, false));
		},
		skillAnimation: true,
		animationColor: "metal",
		logAudio: index => (typeof index === "number" ? "potzhenfeng" + index + ".mp3" : 2),
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog("振锋：你可以选择一项", "hidden");
				dialog.add([
					[
						["recover", "回复2点体力"],
						["cover", "修改〖酣战〗和〖战烈〗描述中的“X”值"],
					],
					"textbutton",
				]);
				return dialog;
			},
			filter(button, player) {
				switch (button.link) {
					case "recover":
						return player.isDamaged();
					case "cover":
						return ["pothanzhan", "potzhanlie"].some(skill => player.hasSkill(skill, null, null, false));
				}
			},
			check(button) {
				const player = get.player();
				if (button.link == "recover") {
					return player.getHp() + player.countCards("h", { name: "tao" }) < 2;
				}
				if (button.link == "cover") {
					let numbers = [player.getHp(), player.getDamagedHp(), game.countPlayer()];
					if (numbers.some(c => c > player.getAttackRange())) {
						return Math.max(...numbers) * 2;
					}
				}
				return 0.1;
			},
			backup(links) {
				return {
					item: links[0],
					skillAnimation: true,
					animationColor: "metal",
					log: false,
					async content(event, trigger, player) {
						player.awakenSkill("potzhenfeng");
						if (get.info(event.name).item === "recover") {
							player.logSkill("potzhenfeng", null, null, null, [null]);
							player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow1");
							await player.recover(2);
						} else {
							let dialog = [],
								skills = ["pothanzhan", "potzhanlie"].filter(skill => player.hasSkill(skill, null, null, false)),
								list = [
									["hp", "当前体力值"],
									["damagedHp", "当前已损失体力值"],
									["countplayer", "场上存活角色数"],
								];
							dialog.push("振锋：修改" + skills.map(skill => "〖" + get.translation(skill) + "〗").join("和") + "描述中的“X”为...");
							for (const skill of skills) {
								dialog.push('<div class="text center">' + get.translation(skill) + "</div>");
								dialog.push([list.map(item => [item[0] + "|" + skill, item[1]]), "tdnodes"]);
							}
							const result = await player
								.chooseButton(dialog, [1, Math.min(2, skills.length)], true)
								.set("filterButton", button => {
									return !ui.selected.buttons.some(but => but.link.split("|")[1] === button.link.split("|")[1]);
								})
								.set("ai", button => {
									const player = get.player();
									switch (button.link.split("|")[0]) {
										case "hp":
											return player.getHp();
										case "damagedHp":
											return player.getDamagedHp();
										case "countplayer":
											return game.countPlayer();
									}
								})
								.forResult();
							if (result?.bool && result.links?.length) {
								player.logSkill("potzhenfeng", null, null, null, [get.rand(3, 4)]);
								let changeList = [];
								for (const link of result.links) {
									const [change, skill] = link.split("|");
									if (skill == "pothanzhan") {
										changeList.push(change);
									}
									player.storage[skill] = change;
									player.popup(skill);
									game.log(player, "修改", "#g【" + get.translation(skill) + "】", "的", "#yX", "为", "#g" + list.find(item => item[0] === change)[1]);
								}
								if (changeList[0]) {
									switch (changeList[0]) {
										case "hp":
											player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow3");
											break;
										case "damagedHp":
											player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow2");
											break;
										case "countplayer":
											player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow4");
									}
								} else {
									player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow1");
								}
							}
						}
					},
				};
			},
			prompt(links) {
				return `点击“确定”，${links[0] === "recover" ? "回复2点体力" : "修改〖酣战〗和〖战烈〗描述中的“X”值"}`;
			},
		},
		subSkill: {
			backup: {},
		},
		ai: {
			order: 15,
			threaten: 2,
			result: {
				player(player) {
					if ([player.getHp(), player.getDamagedHp(), game.countPlayer()].some(c => c > player.getAttackRange())) {
						return 10;
					}
					return get.recoverEffect(player, player, player);
				},
			},
		},
	},
};

export default skills;
