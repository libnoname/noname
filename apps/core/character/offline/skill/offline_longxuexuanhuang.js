import { lib, game, ui, get, ai, _status } from "noname";
/** @type { importCharacterConfig["skill"] } */
const skills = {
	//甲虫
	lxbeini: {
		audio: "beini",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.players.length > 1;
		},
		filterTarget(card, player, target) {
			if (!ui.selected.targets?.length) {
				return target != player;
			}
			return true;
		},
		selectTarget: 2,
		targetprompt: ["使用牌", "目标"],
		multiline: true,
		multitarget: true,
		complexTarget: true,
		async content(event, trigger, player) {
			const targets = event.targets;
			const result = await targets[0]
				.chooseToUse({
					filterCard(card) {
						return lib.filter.filterCard.apply(this, arguments) && get.is.damageCard(card);
					},
					prompt: `对${get.translation(targets[1])}使用一张伤害牌或点“取消”交给${get.translation(player)}一张非伤害牌`,
					targetRequired: true,
					complexSelect: true,
					complexTarget: true,
					filterTarget(card, player, target) {
						const { targetx } = get.event();
						if (target != targetx && !ui.selected.targets.includes(targetx)) {
							return false;
						}
						return lib.filter.filterTarget.apply(this, arguments);
					},
				})
				.set("targetx", targets[1])
				.forResult();
			if (!result?.bool && targets[0].hasGainableCards(player, "he", card => !get.is.damageCard(card))) {
				await targets[0].chooseToGive({
					forced: true,
					filterCard(card) {
						return !get.is.damageCard(card);
					},
					prompt: `悖逆：请交给${get.translation(player)}一张非伤害牌`,
					position: "he",
					target: player,
				});
			}
		},
		ai: {
			order: 5,
			result: {
				player: 1,
				target(player, target) {
					if (!ui.selected.targets?.length || game.countPlayer(current => get.attitude(player, current) < 0) > 1) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	lxdingfa: {
		audio: "dingfa",
		forced: true,
		locked: false,
		trigger: { player: "phaseDiscardEnd" },
		filter(event, player) {
			return get.discarded().some(card => get.is.damageCard(card)) && game.hasPlayer(current => current != player && current.hasCards("he"));
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseTarget({
					prompt: "定法：弃置一名其他角色一张牌",
					filterTarget(card, player, target) {
						return player != target && target.hasCards("he");
					},
					forced: true,
					ai(target) {
						const player = get.player();
						return get.effect(target, { name: "guohe_copy", position: "he" }, player, player);
					},
				})
				.forResult();
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				player.line(target);
				if (target.hasCards("he")) {
					await player.discardPlayerCard({ target, forced: true, position: "he" });
				}
			}
		},
	},
	//成济
	lxkuangli: {
		audio: "mbkuangli",
		forced: true,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return get.is.damageCard(event.card) && player != event.target && (player.hasCards("he") || event.target.hasCards("he"));
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = event.targets[0];
			let result;
			const cards = [];
			if (player.hasDiscardableCards(player, "he")) {
				result = await player.chooseToDiscard({ forced: true, position: "he" }).forResult();
				if (result?.bool && result.cards?.length) {
					cards.addArray(result.cards);
				}
			}
			let num = player == _status.currentPhase ? 1 : 2;
			if (target.hasCards("he")) {
				result = await player.discardPlayerCard({ forced: true, target, position: "he", selectButton: num }).forResult();
				if (result?.bool && result.links?.length) {
					cards.addArray(result.links);
				}
			}
			if (cards.length) {
				const types = cards.map(card => get.type2(card));
				if (types.length == 1 || types[0] == types[1]) {
					trigger.getParent().baseDamage ??= 1;
					trigger.getParent().baseDamage++;
				} else {
					await player.draw(2);
				}
			}
		},
	},
	lxxiongsi: {
		audio: "mbxiongsi",
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		enable: "phaseUse",
		manualConfirm: true,
		filter(event, player) {
			return player.getAllHistory("sourceDamage").reduce((a, b) => a + b.num, 0) >= 3 && player.hasDiscardableCards(player, "he");
		},
		filterCard: lib.filter.cardDiscardable,
		selectCard: -1,
		position: "h",
		filterTarget: lib.filter.notMe,
		selectTarget: -1,
		multiline: true,
		multitarget: true,
		lose: false,
		discard: false,
		delay: 0,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { cards, targets } = event;
			await player.modedDiscard({ cards });
			await game.doAsyncInOrder(targets, async target => {
				await target.loseHp();
			});
		},
	},
	//李昭焦伯
	lxzuoyou: {
		audio: "mbzuoyou",
		enable: "phaseUse",
		usable: 1,
		zhuanhuanji: true,
		marktext: "☯",
		mark: true,
		intro: {
			content(storage, player) {
				if (!storage) {
					return `转换技，出牌阶段限一次，你可受到1点无来源伤害，令一名角色获得1点护甲。`;
				}
				return `转换技，出牌阶段限一次，你可失去1点护甲，对一名角色造成1点伤害。`;
			},
		},
		filter(event, player) {
			const storage = player.storage.lxzuoyou;
			return !storage || player.hujia > 0;
		},
		filterTarget(card, player, target) {
			const storage = player.storage.lxzuoyou;
			return storage || target.hujia < 5;
		},
		prompt(event, player) {
			const storage = player.storage.lxzuoyou;
			return get.info("lxzuoyou").intro.content(storage, player);
		},
		async content(event, trigger, player) {
			const target = event.target,
				storage = player.storage.lxzuoyou;
			player.changeZhuanhuanji(event.name);
			if (!storage) {
				await player.damage({ num: 1, nosource: true });
				await target.changeHujia(1, null, true);
			} else {
				await player.changeHujia(-1);
				await target.damage({ num: 1, source: player });
			}
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					const storage = player.storage.lxzuoyou;
					if (!storage && player.hp <= 1) {
						return -1;
					}
					return 1;
				},
				target(player, target) {
					const storage = player.storage.lxzuoyou;
					if (!storage) {
						if (target == player && player.hujia < 1) {
							return 6;
						}
						if (target.hp === 1) {
							return 5;
						}
						return 2;
					} else {
						return get.sgnAttitude(player, target) * get.damageEffect(target, player, player);
					}
				},
			},
		},
	},
	lxshishou: {
		audio: "mbshishou",
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return player.hasHistory("damage") || player.hasHistory("sourceDamage");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					filterTarget(card, player, target) {
						return player.group == target.group && target.hujia < 5;
					},
					ai(target) {
						return get.attitude(get.player(), target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.changeHujia(1, null, true);
		},
	},
	//文钦
	lxbeiming: {
		audio: "mbbeiming",
		enable: "phaseUse",
		usable: 1,
		manualConfirm: true,
		filter(event, player) {
			return Array.from(ui.discardPile.childNodes).some(card => get.type(card) == "equip");
		},
		async content(event, trigger, player) {
			const cards = Array.from(ui.discardPile.childNodes).filter(card => get.type(card) == "equip");
			const card = cards[cards.length - 1];
			let result;
			if (card) {
				player.addSkill("lxbeiming_use");
				await player.gain({ cards: [card], animate: "gain2" });
				player.addGaintag(card, "lxbeiming_use");
				result = await player
					.chooseTarget({
						prompt: `孛明：你可以将${get.translation(card)}置于一名其他角色的装备区内`,
						filterTarget(card, player, target) {
							const { cardx } = get.event();
							return target.canEquip(cardx, true) && target != player;
						},
						ai(target) {
							return get.attitude(get.player(), target);
						},
					})
					.set("cardx", card)
					.forResult();
				if (result?.bool && result.targets?.length) {
					const target = result.targets[0];
					target.addSkill("lxbeiming_use");
					player.line(target);
					player.$give(card, target);
					await target.equip(card);
					game.broadcastAll(card => {
						card.addGaintag("lxbeiming_use");
					}, card);
					result = await player
						.chooseBool({
							prompt: `孛明：你可再从弃牌堆获得一张装备牌`,
							ai: () => 1,
						})
						.forResult();
					if (result?.bool) {
						const cards = Array.from(ui.discardPile.childNodes).filter(card => get.type(card) == "equip");
						const card = cards[cards.length - 1];
						if (card) {
							await player.gain({ cards: [card], animate: "gain2" });
							player.addGaintag(card, "lxbeiming_use");
						} else {
							player.popup("杯具");
						}
					}
				}
			}
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
		subSkill: {
			use: {
				charlotte: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				enable: "chooseToUse",
				mod: {
					targetInRange(card) {
						if (card?.storage?.lxbeiming_use) {
							return true;
						}
					},
				},
				filter(event, player) {
					return player.hasCards("he", card => {
						if (!card.hasGaintag("lxbeiming_use")) {
							return false;
						}
						return get.inpileVCardList(info => {
							if (!["sha", "jiu"].includes(info[2]) || info[3]) {
								return false;
							}
							const cardx = get.autoViewAs({ name: info[2], storage: { lxbeiming_use: true } }, [card]);
							return event.filterCard(cardx, player, event);
						}).length;
					});
				},
				chooseButton: {
					dialog(event, player) {
						const list = get.inpileVCardList(info => {
							if (!["sha", "jiu"].includes(info[2]) || info[3]) {
								return false;
							}
							return player.hasCards("he", card => {
								if (!card.hasGaintag("lxbeiming_use")) {
									return false;
								}
								const cardx = get.autoViewAs({ name: info[2], storage: { lxbeiming_use: true } }, [card]);
								return event.filterCard(cardx, player, event);
							});
						});
						return ui.create.dialog("孛明", [list, "vcard"]);
					},
					check(button) {
						if (_status.event.getParent().type != "phase") {
							return 1;
						}
						const player = get.player();
						return player.getUseValue({
							name: button.link[2],
						});
					},
					backup(links, player) {
						return {
							filterCard(card) {
								return card.hasGaintag("lxbeiming_use");
							},
							audio: "lxbeiming",
							popname: true,
							check(card) {
								return 10 - get.value(card);
							},
							position: "he",
							viewAs: {
								name: links[0][2],
								storage: { lxbeiming_use: true },
							},
						};
					},
					prompt(links, player) {
						return "将一张“孛明”牌当做" + get.translation(links[0][2]) + "使用";
					},
				},
				hiddenCard(player, name) {
					if (!lib.inpile.includes(name)) {
						return false;
					}
					return player.hasCards("he", card => card.hasGaintag("lxbeiming_use")) && ["jiu", "sha"].includes(name);
				},
				ai: {
					respondSha: true,
					unequip: true,
					skillTagFilter(player, tag, arg) {
						if (tag == "unequip") {
							if (!arg?.card?.storage?.lxbeiming_use) {
								return false;
							}
							return true;
						}
						if (arg == "respond") {
							return false;
						}
						return lib.skill["lxbeiming_use"].hiddenCard(player, "sha");
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
			},
		},
	},
	lxchoumang: {
		audio: "mbchoumang",
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && event.isFirstTarget;
		},
		async cost(event, trigger, player) {
			const targets = trigger.targets,
				card = trigger.card;
			const controls = ["选项一"],
				choiceList = ["令此【杀】伤害+1", "令一名其他角色成为此【杀】的额外目标", "执行上述全部效果并废除一个装备栏"];
			if (game.hasPlayer(current => !targets.includes(current) && player != current && player.canUse(card, current, true, false))) {
				controls.push("选项二");
			} else {
				choiceList[1] = `<span style="opacity:0.5">` + choiceList[1] + "</span>";
			}
			if (player.hasEnabledSlot()) {
				controls.push("背水！");
			} else {
				choiceList[2] = `<span style="opacity:0.5">` + choiceList[2] + "</span>";
			}
			controls.push("cancel2");
			const result = await player
				.chooseControl({
					controls,
					choiceList,
					prompt: "仇铓：你可以选择一项",
					ai() {
						const { player, controls, card, targets } = get.event();
						if (game.hasPlayer(current => !targets.includes(current) && current != player && player.canUse(card, current, true, false))) {
							if (controls.length >= 4 && controls.includes("背水！")) {
								return "背水！";
							}
							if (controls.includes("选项二")) {
								return "选项二";
							}
						}
						if (!targets.includes(target => get.attitude(player, target) > 0)) {
							return "选项一";
						}
						return "cancel2";
					},
				})
				.set("card", card)
				.set("targets", targets)
				.forResult();
			if (typeof result?.control == "string" && result.control != "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.control,
				};
			}
		},
		async content(event, trigger, player) {
			const link = event.cost_data;
			const targets = trigger.targets,
				card = trigger.card;
			if (["背水！", "选项一"].includes(link)) {
				trigger.getParent().baseDamage ??= 1;
				trigger.getParent().baseDamage++;
			}
			if (["背水！", "选项二"].includes(link) && game.hasPlayer(current => !targets.includes(current) && player != current && player.canUse(card, current, true, false))) {
				const result = await player
					.chooseTarget({
						prompt: `仇铓：选择一名其他角色成为${get.translation(card)}的额外目标`,
						forced: true,
						filterTarget(card, player, target) {
							const { targets, cardx } = get.event();
							return target != player && !targets.includes(target) && player.canUse(cardx, target, true, false);
						},
						ai(target) {
							const { player, cardx } = get.event();
							return get.effect(target, cardx, player, player);
						},
					})
					.set("cardx", card)
					.set("targets", targets)
					.forResult();
				if (result?.bool && result.targets?.length) {
					const target = result.targets[0];
					player.line(target);
					trigger.targets.push(target);
				}
			}
			if (link == "背水！") {
				await player.chooseToDisable();
			}
		},
	},
	//毌丘俭
	lxcuizhen: {
		audio: "mbcuizhen",
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return player.hasCards("he", card => get.type(card) == "equip");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard({
					prompt: get.prompt2(event.skill),
					filterCard(card) {
						return get.type(card) == "equip";
					},
					selectCard: [1, Infinity],
					position: "he",
					check(card) {
						return 6 - get.value(card);
					},
					chooseonly: true,
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event;
			await player.modedDiscard({ cards });
			const num = cards.length,
				subtypes = cards.map(card => get.subtype(card)).unique();
			if (!game.hasPlayer(current => subtypes.concat(["equip1"]).some(subtype => current.hasEnabledSlot(subtype)))) {
				return;
			}
			const result = await player
				.chooseButtonTarget({
					createDialog: [
						"摧阵：请选择一项",
						[
							[
								["one", `废除一名角色的${get.translation(subtypes)}栏`],
								["two", `废除至多${get.cnNumber(num)}名角色的武器栏`],
							],
							"textbutton",
						],
					],
					complexSelect: true,
					forced: true,
					filterTarget(card, player, target) {
						const link = ui.selected.buttons?.[0]?.link;
						if (link == "one") {
							return get.event().subtypes.some(subtype => target.hasEnabledSlot(subtype));
						}
						return target.hasEnabledSlot("equip1");
					},
					selectTarget() {
						const link = ui.selected.buttons?.[0]?.link;
						if (link == "one") {
							return 1;
						}
						return [1, get.event().num];
					},
					ai1(button) {
						return 1 + Math.random();
					},
					ai2(target) {
						return -get.attitude(get.player(), target);
					},
				})
				.set("subtypes", subtypes)
				.set("num", num)
				.forResult();
			if (result?.bool && result.targets?.length && result.links?.length) {
				const targets = result.targets.sortBySeat(),
					link = result.links[0];
				player.line(targets);
				if (link == "one") {
					await targets[0].disableEquip(subtypes);
				} else {
					await game.doAsyncInOrder(targets, async target => {
						await target.disableEquip(["equip1"]);
					});
				}
			}
		},
		group: "lxcuizhen_draw",
		subSkill: {
			draw: {
				audio: "lxcuizhen",
				forced: true,
				locked: false,
				trigger: { player: "phaseDrawBegin2" },
				filter(event, player) {
					return !event.numFixed && game.hasPlayer(current => current.hasDisabledSlot());
				},
				async content(event, trigger, player) {
					const num = Math.min(
						3,
						game.countPlayer(current => current.hasDisabledSlot())
					);
					trigger.num += num;
				},
			},
		},
	},
	lxkuili: {
		audio: "mbkuili",
		forced: true,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source?.isIn() && event.source.hasDisabledSlot();
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.chooseToEnable();
		},
	},
	//司马伷
	lxbifeng: {
		audio: "mbbifeng",
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			return event.card.name == "sha" || get.type(event.card) == "trick";
		},
		check(event, player) {
			let cancel = get.effect(player, event.card, event.player, player),
				name = event.card.name;
			if (get.effect(player, { name: "losehp" }, player, player) - cancel > 0) {
				return true;
			}
			if (2 * get.effect(player, { name: "draw" }, player, player) - cancel <= 0) {
				return false;
			}
			const targets = event.targets.filter(current => {
				return player !== current && get.effect(current, event.card, event.player, current) < 0;
			});
			if (name === "sha") {
				return targets.some(target => {
					return target.mayHaveShan(player, "use");
				});
			}
			if (name === "juedou" || name === "nanman") {
				return targets.some(target => {
					return target.mayHaveSha(player, "respond");
				});
			}
			if (name === "wanjian") {
				return targets.some(target => {
					return target.mayHaveShan(player, "respond");
				});
			}
			if (name === "qizhengxiangsheng") {
				return targets.some(target => {
					return target.mayHaveSha(player, "respond") || target.mayHaveShan(player, "respond");
				});
			}
			return false;
		},
		async content(event, trigger, player) {
			const bool = player.isTurnedOver();
			await player.turnOver();
			trigger.targets.remove(player);
			trigger.getParent().triggeredTargets2.remove(player);
			trigger.untrigger();
			if (bool && !player.isTurnedOver()) {
				await player.loseHp();
			}
		},
	},
	lxsuwang: {
		audio: "mbsuwang",
		trigger: { player: "turnOverEnd" },
		filter(event, player) {
			return player.countCards("h") != 4;
		},
		async content(event, trigger, player) {
			if (player.countCards("h") < 4) {
				await player.drawTo(4);
			} else if (player.countCards("h") > 4) {
				await player.chooseToDiscard({ forced: true, position: "h", selectCard: player.countCards("h") - 4 });
			}
			if (!player.isTurnedOver() && player.hasCards("h")) {
				const num = Math.min(player.countCards("h"), game.players.length);
				const result = await player
					.chooseCardTarget({
						prompt: "宿望：将所有手牌分配给等量名角色各一张",
						forced: true,
						selectCard: [1, num],
						selectTarget: [1, num],
						complexSelect: true,
						complexCard: true,
						complexTarget: true,
						position: "h",
						filterOk() {
							const { num } = get.event();
							return ui.selected.cards.length == ui.selected.targets.length && num == ui.selected.cards.length;
						},
						ai1(card) {
							return -get.value(card);
						},
						ai2(target) {
							const card = ui.selected.cards[ui.selected.cards.length - 1];
							if (get.value(card) <= 0) {
								return -get.attitude(get.player(), target);
							}
							return get.attitude(get.player(), target);
						},
						targetprompt() {
							const links = ui.selected.cards;
							return ["获得", get.translation(links[ui.selected.targets.length - 1])].join("<br>");
						},
					})
					.set("num", num)
					.forResult();
				if (result?.bool && result.targets?.length && result.cards?.length) {
					const cards = result.cards,
						targets = result.targets;
					const gain_list = targets.map((target, i) => [target, [cards[i]]]);
					await game
						.loseAsync({
							gain_list: gain_list,
							player: player,
							cards: cards,
							giver: player,
							animate: "give",
						})
						.setContent("gaincardMultiple");
				}
			}
		},
	},
	//司马孚
	lxpanxiang: {
		audio: "mbpanxiang",
		trigger: { global: ["damageBegin1", "damageBegin3"] },
		filter(event, player, name) {
			const target = name == "damageBegin1" ? event.source : event.player;
			if (!target?.isIn()) {
				return false;
			}
			return target.group == player.group && ((!player.getStorage("lxpanxiang").includes("add") && target.hasCards("he")) || (!player.getStorage("lxpanxiang").includes("reduce") && player.hasDiscardableCards(player, "he")));
		},
		logTarget(event, player, name) {
			return name == "damageBegin1" ? event.source : event.player;
		},
		async cost(event, trigger, player) {
			const name = event.triggername;
			const target = name == "damageBegin1" ? trigger.source : trigger.player;
			const target2 = name != "damageBegin1" ? trigger.source : trigger.player;
			const controls = [],
				choiceList = [`令${get.translation(target)}交给你一张牌，此伤害+1`, "你弃置一张牌，此伤害-1"];
			const pos = target == player ? "e" : "he";
			if (!player.getStorage("lxpanxiang").includes("add") && target.hasCards(pos)) {
				controls.push("选项一");
			} else {
				choiceList[0] = `<span style="opacity:0.5">` + choiceList[0] + "</span>";
			}
			if (!player.getStorage("lxpanxiang").includes("reduce") && player.hasDiscardableCards(player, "he")) {
				controls.push("选项二");
			} else {
				choiceList[1] = `<span style="opacity:0.5">` + choiceList[1] + "</span>";
			}
			if (!controls.length) {
				return;
			}
			controls.push("cancel2");
			const result = await player
				.chooseControl({
					controls,
					choiceList,
					prompt: "蹒襄：你可以选择一项",
					ai() {
						const { player, target, controls, name, target2 } = get.event();
						if (name == "damageBegin1") {
							if (controls.includes("选项一") && get.damageEffect(target2, target, player) > 0) {
								return "选项一";
							}
							if (controls.includes("选项二") && get.damageEffect(target2, target, player) < 0) {
								return "选项二";
							}
						} else {
							if (controls.includes("选项一") && get.damageEffect(target, target2, player) > 0) {
								return "选项一";
							}
							if (controls.includes("选项二") && get.damageEffect(target, target2, player) < 0) {
								return "选项二";
							}
						}
						return "cancel2";
					},
				})
				.set("target", target)
				.set("target2", target2)
				.set("name", name)
				.forResult();
			if (typeof result?.control == "string" && result.control != "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.control,
				};
			}
		},
		async content(event, trigger, player) {
			const link = event.cost_data,
				target = event.targets[0];
			player.markAuto(event.name, [link == "选项一" ? "add" : "reduce"]);
			player.markAuto(event.name + "_targets", [target]);
			if (link == "选项一") {
				const pos = target == player ? "e" : "he";
				if (target.hasCards(pos)) {
					await target.chooseToGive({ target: player, forced: true, position: pos });
				}
				trigger.num++;
			} else {
				await player.chooseToDiscard({ forced: true, position: "he" });
				trigger.num--;
			}
			if (player.getStorage("lxpanxiang").length >= 2) {
				player.setStorage("lxpanxiang", [], true);
			}
		},
		intro: {
			content(storage, player) {
				const s = player.getStorage("lxpanxiang");
				if (!s.length) {
					return "当前没触发任何选项";
				}
				let str = "";
				if (s.includes("add")) {
					str += "当前触发了加伤选项";
				} else {
					str += "当前触发了减伤选项";
				}
				return str;
			},
		},
		subSkill: {
			targets: {
				intro: { content: "$成为过【蹒襄】的目标" },
			},
		},
	},
	lxchenjie: {
		audio: "mbchenjie",
		forced: true,
		trigger: { global: "die" },
		filter(event, player) {
			return player.getStorage("lxpanxiang_targets").includes(event.player) && event.source?.isIn();
		},
		logTarget(event, player) {
			return event.source;
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cards = target.getCards("h");
			if (cards.length && target != player) {
				await player.gain({ cards, animate: "giveAuto", target });
			}
			player.addTempSkill(event.name + "_effect", "roundStart");
			player.markAuto(event.name + "_effect", [target]);
		},
		subSkill: {
			effect: {
				charlotte: true,
				intro: { content: "$本轮使用牌不能指定你为目标" },
				mod: {
					targetEnabled(card, player, target) {
						if (target.getStorage("lxchenjie_effect").includes(player)) {
							return false;
						}
					},
				},
			},
		},
	},
	//神马超 孩子们这次我不是区了
	lxyuli: {
		audio: "yuli",
		forced: true,
		trigger: {
			source: "damageBegin1",
			player: "damageBegin4",
			global: "damageEnd",
		},
		logAudio(event, player, name) {
			switch (name) {
				case "damageBegin1":
					return ["yuli1.mp3", "yuli2.mp3"];
					break;
				case "damageEnd":
					return ["yuli3.mp3", "yuli4.mp3"];
					break;
				case "damageBegin4":
					return ["yuli5.mp3", "yuli6.mp3"];
					break;
			}
		},
		filter(event, player, name) {
			if (name == "damageBegin1") {
				return !event.hasNature("thunder");
			}
			return event.hasNature("thunder");
		},
		async content(event, trigger, player) {
			switch (event.triggername) {
				case "damageBegin1":
					game.setNature(trigger, "thunder");
					break;
				case "damageBegin4":
					trigger.cancel();
					break;
				case "damageEnd":
					await player.draw({ num: trigger.num });
					break;
			}
		},
		ai: {
			nothunder: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "thunderDamage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	lxtingwei: {
		audio: "tingwei",
		logAudio: event => (typeof event == "number" ? `tingwei${event}.mp3` : 2),
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			return event.card.name == "sha";
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.addTempSkill(event.name + "_baiban", { player: "damageAfter" });
			target
				.when({ player: "damageBegin2" })
				.filter(evt => evt.getParent(2) == event.getParent(4))
				.step(async (event, trigger, playerx) => {
					const cards = playerx.getCards("e");
					player.logSkill("lxtingwei", playerx, null, null, [get.rand(3, 4)]);
					if (cards.length) {
						await playerx.modedDiscard({ cards, discarder: player });
					}
					trigger.num++;
				});
		},
		subSkill: {
			baiban: {
				charlotte: true,
				inherit: "baiban",
			},
		},
	},
	lxjimie: {
		audio: "jimie",
		trigger: { player: "phaseJieshuBegin" },
		skillAnimation: true,
		animationColor: "wood",
		filter(event, player) {
			return game.hasPlayer(current => current.hasHistory("damage"));
		},
		async cost(event, trigger, player) {
			const next = player.chooseTarget({
				prompt: get.prompt2(event.skill),
				filterTarget(card, player, target) {
					return target.hasHistory("damage");
				},
				ai(target) {
					const player = get.player();
					const list = [];
					game.countPlayer(current => {
						const num = current.getHistory("damage").reduce((sum, evt) => sum + evt.num, 0);
						if (num > 0) {
							list.push([target, get.damageEffect(target, player, player) * num]);
						}
					});
					if (!list.length) {
						return false;
					}
					list.sort((a, b) => b[1] - a[1]);
					return target == list[0][0];
				},
			});
			next.set(
				"targetprompt2",
				next.targetprompt2.concat([
					target => {
						if (!target.isIn()) {
							return;
						}
						return `寂灭${target.getHistory("damage").reduce((sum, evt) => sum + evt.num, 0)}`;
					},
				])
			);
			event.result = await next.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = target.getHistory("damage").reduce((sum, evt) => sum + evt.num, 0);
			await target.damage({ num, source: player });
			player.addSkill(event.name + "_use");
			player.markAuto(event.name + "_use", [target]);
		},
		subSkill: {
			use: {
				charlotte: true,
				intro: { content: "对$使用牌无次数限制" },
				mod: {
					cardUsableTarget(card, player, target) {
						if (player.getStorage("lxjimie_use").includes(target)) {
							return Infinity;
						}
					},
				},
			},
		},
	},
	//曹髦
	lxqianlong: {
		audio: "mbqianlong",
		persevereSkill: true,
		forced: true,
		locked: false,
		keepSkill: true,
		derivation: ["lxjuejin", "lxwuhui"],
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			let num = game.hasPlayer(current => {
				return current !== player && current.group === "wei" && player.hasZhuSkill("lxweitong", current);
			})
				? 8
				: 5;
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			const alllist = _status.characterlist.slice();
			game.countPlayer2(current => {
				alllist.removeArray([current.name, current.name1, current.name2]);
			});
			const characters = alllist.filter(name => get.characterSurname(name).some(j => j[0] == "曹") && get.character(name, 1) == "wei").randomGets(num);
			const skills = characters.flatMap(name => get.character(name).skills);
			if (!characters.length || !skills.length) {
				player.popup("孩子你都禁了什么将");
				return;
			}
			const list = [];
			for (const skill of skills) {
				list.push([skill, `<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【` + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"]);
			}
			num = Math.min(5, skills.length);
			const result =
				skills.length > num
					? await player
							.chooseButton({
								createDialog: [`潜龙：获得其中任意${num}个技能`, [list, "textbutton"]],
								selectButton: num,
								forced: true,
								ai(button) {
									const skill = button.link;
									const info = get.info(skill);
									if (!info || info.ai?.neg || info.ai?.combo) {
										return 0;
									}
									return 1 + Math.random();
								},
							})
							.forResult()
					: { bool: true, links: skills };
			if (result?.bool && result.links?.length) {
				const skills = result.links;
				player.markAuto(event.name, skills);
				await player.addAdditionalSkills(event.name, skills, true);
			}
		},
		intro: {
			content(storage, player) {
				let str = "";
				const skills = player.getStorage("lxqianlong");
				for (const skill of skills) {
					str += `${get.poptip(skill)}`;
				}
				return str;
			},
		},
		group: ["lxqianlong_remove", "lxqianlong_juexing"],
		subSkill: {
			remove: {
				audio: "lxqianlong",
				trigger: { global: "roundEnd" },
				filter(event, player) {
					return player.getStorage("lxqianlong").containsSome(...player.getSkills(null, false, false));
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const skills = player.getStorage("lxqianlong").filter(skill => player.getSkills(null, false, false).includes(skill));
					const list = [];
					for (const skill of skills) {
						list.push([skill, `<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【` + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"]);
					}
					if (skills.length) {
						const result =
							skills.length > 1
								? await player
										.chooseButton({
											createDialog: ["潜龙：请失去一个技能", [list, "textbutton"]],
											forced: true,
											ai(button) {
												return 1 + Math.random();
											},
										})
										.forResult()
								: { bool: true, links: skills };
						if (result?.bool && result.links?.length) {
							const skill = result.links[0];
							await player.removeSkills(skill);
							//小巧思
							get.info("potyinhui").refreshSkill(player, skill);
						}
					}
				},
			},
			juexing2: { charlotte: true },
			juexing: {
				audio: "lxqianlong",
				forced: true,
				locked: false,
				skillAnimation: true,
				animationColor: "wood",
				trigger: {
					player: ["dying", "changeSkillsAfter"],
				},
				filter(event, player) {
					//本来想用history的  但是这里的本意明显是获得此技能后首次进入濒死干脆加个skill算了
					return (event.name == "dying" && !player.hasSkill("lxqianlong_juexing2")) || (!player.getStorage("lxqianlong").some(skill => player.hasSkill(skill, null, false, false)) && event.removeSkill?.length);
				},
				async content(event, trigger, player) {
					if (trigger.name == "dying") {
						player.addSkill(event.name + "2");
					}
					await player.recoverTo(player.maxHp);
					player.insertPhase();
					await player.addSkills(["lxjuejin", "lxwuhui"]);
				},
			},
		},
	},
	lxweitong: {
		audio: "mbweitong",
		persevereSkill: true,
		zhuSkill: true,
		trigger: {
			player: "lxqianlongBegin",
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {},
		ai: {
			combo: "mbqianlong",
		},
	},
	lxjuejin: {
		audio: "mbjuejin",
		persevereSkill: true,
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		manualConfirm: true,
		enable: "phaseUse",
		filterTarget: true,
		selectTarget: -1,
		multiline: true,
		multitarget: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.changeSkin({ characterName: "lx_caomao" }, "lx_caomao_shadow");
			const targets = event.targets.sortBySeat();
			await game.doAsyncInOrder(targets, async target => {
				let delt = target.getHp() - 1,
					num = Math.abs(delt);
				if (delt != 0) {
					if (delt > 0) {
						const next = target.changeHp(-delt);
						next._triggered = null;
						await next;
					} else {
						num = 1 - target.getHp(true);
						await target.recover(num);
					}
				}
				if (delt > 0) {
					await target.changeHujia(num + (player == target ? 2 : 0), null, true);
				} else if (player == target) {
					await target.changeHujia(2, null, true);
				}
			});
			game.addGlobalSkill("lxjuejin_xiangsicunwei");
			player.$fullscreenpop("向死存魏！", "thunder");
			const cards = ["cardPile", "discardPile"].map(pos => Array.from(ui[pos].childNodes)).flat();
			const filter = card => ["shan", "tao", "jiu"].includes(card.name);
			const cardx = cards.filter(filter);
			if (cardx.length) {
				await game.cardsGotoSpecial(cardx);
				game.log(cardx, "被移出了游戏");
			}
			for (const target of game.filterPlayer()) {
				const sishis = target.getCards("hej", filter);
				if (sishis.length) {
					target.$throw(sishis);
					game.log(sishis, "被移出了游戏");
					await target.lose(sishis, ui.special);
				}
			}
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					let eff = 1;
					game.countPlayer(current => {
						const att = get.attitude(player, current),
							num = Math.abs(current.getHp(true) - 1);
						const delt = Math.max(0, num + current.hujia - 5);
						eff -= att * delt;
					});
					return eff > 0 ? 1 : 0;
				},
			},
		},
		subSkill: {
			xiangsicunwei: {
				forced: true,
				silent: true,
				firstDo: true,
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				getIndex(event, player) {
					return game
						.filterPlayer(current => {
							const cards = event.getg?.(current);
							if (!cards?.length) {
								return false;
							}
							return cards.some(card => ["shan", "tao", "jiu"].includes(card.name));
						})
						.sortBySeat();
				},
				async content(event, trigger, player) {
					const target = event.indexedData;
					const cards = trigger.getg(target).filter(card => ["shan", "tao", "jiu"].includes(card.name));
					if (cards.length) {
						await target.recast(cards);
					}
				},
			},
		},
	},
	lxwuhui: {
		audio: "mbcmqingzheng",
		persevereSkill: true,
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		manualConfirm: true,
		enable: "phaseUse",
		keepSkill: true,
		filter(event, player) {
			return player.getStorage("lxqianlong").length && player.getStorage("lxqianlong").some(skill => !player.hasSkill(skill, null, false, false));
		},
		changeLimit(skill) {
			game.broadcastAll(skill => {
				//限定技标签
				const info = get.info(skill);
				info.limited = true;
				info.skillAnimation = true;
				info.animationColor = "wood";
				//修改描述
				if (lib.dynamicTranslate[skill]) {
					lib.dynamicTranslate[skill] = `限定技，${lib.dynamicTranslate[skill]}`;
				} else {
					lib.translate[skill + "_info"] = `限定技，${lib.translate[skill + "_info"]}`;
				}
				game.finishSkill(skill);
			}, skill);
			return skill;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.addSkill(event.name + "_limit");
			player.addTempSkill(event.name + "_use");
			const skills = player.getStorage("lxqianlong").filter(skill => !player.hasSkill(skill, null, false, false));
			const skillx = [];
			if (skills.length) {
				for (let skill of skills) {
					const info = get.info(skill);
					if (!info) {
						continue;
					}
					if (info?.limited) {
						skillx.push(skill);
					} else {
						skill = get.info(event.name).changeLimit(skill);
						skillx.push(skill);
					}
				}
			}
			await player.addAdditionalSkills("lxqianlong", skillx, true);
			player.markAuto(event.name, skillx);
		},
		ai: {
			order: 114514,
			result: {
				player: 1,
			},
			combo: "lxqianlong",
		},
		subSkill: {
			use: {
				charlotte: true,
				mark: true,
				intro: { content: "本回合使用牌无次数限制" },
				mod: {
					cardUsable: () => Infinity,
				},
			},
			limit: {
				charlotte: true,
				silent: true,
				popup: false,
				firstDo: true,
				trigger: {
					player: ["useSkill", "logSkillBegin", "changeSkillsAfter"],
				},
				filter(event, player) {
					if (event.name == "changeSkills") {
						return event.removeSkill?.length && player.getStorage("lxwuhui").containsSome(...event.removeSkill);
					}
					if (["global", "equip"].includes(event.type)) {
						return false;
					}
					const skill = get.sourceSkillFor(event);
					if (!skill || !player.getStorage("lxwuhui").includes(skill)) {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					if (trigger.name == "changeSkills") {
						const skills = trigger.removeSkill;
						player.unmarkAuto("lxwuhui", skills);
						if (!player.getStorage("lxwuhui").length) {
							await player.die();
						}
					} else {
						const skill = get.sourceSkillFor(trigger);
						player.awakenSkill(skill);
					}
				},
			},
		},
	},
	//司马昭
	lxqiantun: {
		audio: ["jsrgqiantun1.mp3", "jsrgqiantun2.mp3"],
		trigger: { source: "damageSource" },
		forced: true,
		locked: false,
		getIndex: event => event.num,
		async content(event, trigger, player) {
			const targets = game.filterPlayer(current => lib.skill.jsrgjuxia.countSkill(current) >= lib.skill.jsrgjuxia.countSkill(player)).sortBySeat();
			const result =
				targets.length > 1
					? await player
							.chooseTarget({
								prompt: `令${get.translation(targets)}中的一名角色摸一张牌并展示所有手牌`,
								filterTarget(card, player, target) {
									return get.event().targets.includes(target);
								},
								ai(target) {
									const player = get.player();
									return get.effect(target, { name: "draw" }, player, player) + get.effect(target, { name: "shunshou" }, player, player) > 0;
								},
							})
							.set("targets", targets)
							.forResult()
					: { bool: true, targets };
			if (result?.bool && result.targets?.length) {
				const target = result.targets[0];
				player.line(target);
				await target.draw();
				await target.showCards(target.getCards("h"), `${get.translation(player)}发动了〖${get.translation(event.name)}〗`);
				const position = player == target ? "ej" : "hej";
				if (target.hasCards(position)) {
					await player.gainPlayerCard({ target, position, forced: true });
				}
			}
		},
	},
	lxxiezheng: {
		audio: "jsrgxiezheng",
		enable: "phaseUse",
		usable: 1,
		manualConfirm: true,
		filter(event, player) {
			return game.hasPlayer(current => get.info("lxxiezheng").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target.getSeatNum() == 1 && target.hasCards("he");
		},
		async content(event, trigger, player) {
			const target = event.target;
			if (target.hasCards("he")) {
				await player.discardPlayerCard({ forced: true, target, position: "he" });
				const card = get.autoViewAs({ name: "juedou", isCard: true }, "unsure");
				if (player.hasUseTarget(card)) {
					const next = player.chooseUseTarget({ card, forced: true });
					player
						.when({ player: "damageEnd" })
						.filter(evt => evt.getParent(3) == next)
						.step(async (event, trigger, player) => {
							const source = trigger.source;
							if (source?.isIn() && source.hasCards("he")) {
								await player.gainPlayerCard({ target: source, forced: true, promisify: "he" });
							}
						});
					await next;
				}
			}
		},
	},
	lxweisi: {
		audio: "jsrgweisi",
		logAudio: () => ["jsrgweisi3.mp3"],
		derivation: "lxzhaoxiong",
		dutySkill: true,
		group: ["lxweisi_achieve", "lxweisi_fail"],
		forced: true,
		locked: false,
		trigger: {
			global: ["roundStart", "loseAsyncEnd"],
			player: "gainEnd",
		},
		getIndex(event, player, name) {
			if (name == "roundStart") {
				return 1;
			}
			const cards = event.getg?.(player);
			if (!cards?.length) {
				return 0;
			}
			return game.countPlayer(current => {
				if (current == player) {
					return false;
				}
				const cardx = event.getl?.(current)?.cards2;
				if (!cardx?.length) {
					return false;
				}
				return cards.containsSome(...cardx);
			});
		},
		jiuxiList: ["gongshi", "fuyue", "zhuhu", "chema", "nabi", "juchang", "yifu", "huben", "lexuan"],
		jiuxiLength(player) {
			return get.info("lxweisi").jiuxiList.filter(skill => player.hasSkill(`lxweisi_${skill}`)).length;
		},
		init(player, skill) {
			player.addSkill(skill + "_mark");
		},
		onremove(player, skill) {
			const list = get.info(skill).jiuxiList;
			for (const skillx of list) {
				player.removeSkill(`${skill}_${skillx}`);
			}
			player.removeSkill(skill + "_mark");
		},
		filter(event, player) {
			return get.info("lxweisi").jiuxiList.some(skill => !player.hasSkill(`lxweisi_${skill}`));
		},
		async content(event, trigger, player) {
			const skill = get
				.info("lxweisi")
				.jiuxiList.slice()
				.filter(skill => !player.hasSkill(`${event.name}_${skill}`))
				.randomGet();
			player.addSkill(`${event.name}_${skill}`);
			game.log(player, "获得了“九锡”中的", `#g${get.translation(`${event.name}_${skill}`)}`);
			player.markAuto("lxweisi_mark", [`${event.name}_${skill}`]);
			await event.trigger("gainJiuxi");
		},
		subSkill: {
			achieve: {
				audio: "jsrgweisi1.mp3",
				forced: true,
				locked: false,
				skillAnimation: true,
				animationColor: "wood",
				trigger: { player: "gainJiuxi" },
				filter(event, player) {
					return !get.info("lxweisi").jiuxiList.some(skill => !player.hasSkill(`lxweisi_${skill}`));
				},
				async content(event, trigger, player) {
					game.log(player, "成功完成使命");
					player.awakenSkill("lxweisi");
					player.changeSkin({ characterName: "lx_simazhao" }, "lx_simazhao_shadow");
					await player.addSkills("lxzhaoxiong");
				},
			},
			fail: {
				audio: "jsrgweisi2.mp3",
				forced: true,
				locked: false,
				trigger: { player: "dying" },
				async content(event, trigger, player) {
					game.log(player, "使命失败");
					player.awakenSkill("lxweisi");
					await player.recoverTo(1);
					const list = get.info("lxweisi").jiuxiList.filter(skill => !player.hasSkill(`lxweisi_${skill}`));
					if (!list.length) {
						return;
					}
					for (const skillx of list) {
						player.addSkill(`lxweisi_${skillx}`);
						player.markAuto("lxweisi_mark", [`lxweisi_${skillx}`]);
						game.log(player, "获得了“九锡”中的", `#g${get.translation(`lxweisi_${skillx}`)}`);
					}
				},
			},
			mark: {
				charlotte: true,
				onremove: true,
				marktext: "九锡",
				intro: {
					name: "九锡",
					content(storage, player) {
						const jiuxi = player.getStorage("lxweisi_mark");
						if (!jiuxi.length) {
							return "当前没有“九锡”";
						}
						let str = "";
						for (const skill of jiuxi) {
							str += `<li>${get.info(skill).name}：${get.info(skill).info}`;
						}
						return str;
					},
				},
			},
			gongshi: {
				charlotte: true,
				name: "弓矢",
				info: "你的攻击范围+X（X为你获得的“九锡”牌的数量）。",
				mod: {
					attackRange(player, num) {
						return num + get.info("lxweisi").jiuxiLength(player);
					},
				},
			},
			fuyue: {
				charlotte: true,
				name: "斧钺",
				info: "你造成的伤害值+X（X为你获得的“九锡”牌的数量）。",
				forced: true,
				trigger: { source: "damageBegin2" },
				async content(event, trigger, player) {
					trigger.num += get.info("lxweisi").jiuxiLength(player);
				},
			},
			zhuhu: {
				charlotte: true,
				name: "朱户",
				info: "摸牌阶段，你将手牌摸至场上最多。",
				forced: true,
				trigger: { player: "phaseDrawBegin2" },
				filter(event, player) {
					return !event.numFixed && !player.isMaxHandcard();
				},
				async content(event, trigger, player) {
					const num = game.filterPlayer(current => current.isMaxHandcard())[0].countCards("h");
					if (player.countCards("h") < num) {
						await player.drawTo(num);
					}
				},
			},
			chema: {
				charlotte: true,
				name: "车马",
				info: "其他角色计算与你的距离+1，你计算与其他角色的距离-1。",
				mod: {
					globalFrom(from, to, distance) {
						return distance - 1;
					},
					globalTo(from, to, distance) {
						return distance + 1;
					},
				},
			},
			nabi: {
				charlotte: true,
				name: "纳陛",
				info: "每轮限一次，一号位的回合结束后，你获得一个额外的回合。",
				round: 1,
				forced: true,
				trigger: { global: "phaseAfter" },
				async content(event, trigger, player) {
					player.insertPhase();
				},
			},
			juchang: {
				charlotte: true,
				name: "秬鬯",
				info: "当你的判定牌生效前，你可此打出一张牌代替之。",
				trigger: { player: "judge" },
				filter(event, player) {
					return player.hasCards("hes");
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseCard({
							prompt: get.prompt(event.skill),
							prompt2: `${get.translation(player)}的${trigger.judgestr || ""}判定为${get.translation(player.judging[0])}`,
							position: "hes",
							filterCard(card, player) {
								const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
								if (mod2 != "unchanged") {
									return mod2;
								}
								const mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
								if (mod != "unchanged") {
									return mod;
								}
								return true;
							},
							ai(card) {
								const trigger = get.event().getTrigger();
								const { player, judging } = get.event();
								const result = trigger.judge(card) - trigger.judge(judging);
								let val = get.value(card);
								if (get.subtype(card) == "equip2") {
									val /= 2;
								} else {
									val /= 4;
								}
								if (result == 0) {
									return 0;
								}
								return result - val;
							},
						})
						.set("judging", player.judging[0])
						.forResult();
				},
				async content(event, trigger, player) {
					const next = player.respond(event.cards, event.name, "highlight", "noOrdering");
					await next;
					const { cards } = next;
					if (cards?.length) {
						if (player.judging[0].clone) {
							player.judging[0].clone.classList.remove("thrownhighlight");
							game.broadcast(function (card) {
								if (card.clone) {
									card.clone.classList.remove("thrownhighlight");
								}
							}, player.judging[0]);
							game.addVideo("deletenode", player, get.cardsInfo([player.judging[0].clone]));
						}
						await game.cardsDiscard(player.judging[0]);
						player.judging[0] = cards[0];
						trigger.orderingCards.addArray(cards);
						game.log(player, "的判定牌改为", cards);
						await game.delay(2);
					}
				},
			},
			yifu: {
				charlotte: true,
				name: "衣服",
				info: "当你成为【杀】的目标时，你可进行判定，若判定结果与此【杀】花色相同，则你令此【杀】无效。",
				trigger: { target: "useCardToTarget" },
				filter(event, player) {
					return event.card.name == "sha";
				},
				prompt2: "你可进行判定，若判定结果与此【杀】花色相同，则你令此【杀】无效",
				async content(event, trigger, player) {
					const suit = get.suit(trigger.card);
					const result = await player
						.judge(card => {
							const suit = get.event().suit;
							if (get.suit(card) == suit) {
								return 1;
							}
							return 0;
						})
						.set("suit", suit)
						.set("judge2", result => (result.bool == true ? true : false))
						.forResult();
					if (result.bool) {
						trigger.getParent().excluded.add(player);
					}
				},
			},
			huben2: { charlotte: true },
			huben: {
				charlotte: true,
				name: "虎贲",
				info: "出牌阶段限一次，你可将一张牌当做【杀】使用或打出，若此【杀】造成伤害，则此【杀】不计入次数。",
				enable: ["chooseToUse", "chooseToRespond"],
				filter(event, player) {
					if (player.hasSkill("lxweisi_huben2") || !player.isPhaseUsing()) {
						return false;
					}
					return player.hasCards("hes", card => {
						const cardx = get.autoViewAs({ name: "sha" }, [card]);
						return event.filterCard(cardx, player, event);
					});
				},
				filterCard: true,
				position: "hes",
				viewAs: {
					name: "sha",
				},
				async precontent(event, trigger, player) {
					player.addTempSkill("lxweisi_huben2", "phaseAnyAfter");
					player
						.when({ source: "damageSource" })
						.filter(evt => {
							return evt.getParent(3) == event.getParent() && evt.getParent(3).addCount != false;
						})
						.step(async (event, trigger, player) => {
							trigger.getParent(3).addCount = false;
							const stat = player.getStat("card"),
								name = trigger.card.name;
							if (typeof stat[name] == "number" && stat[name] > 0) {
								stat[name]--;
							}
						});
				},
				hiddenCard(player, name) {
					return name == "sha" && !player.hasSkill("lxweisi_huben2") && player.isPhaseUsing() && player.hasCards("hes");
				},
				prompt: "将一张牌当做【杀】使用或打出",
				ai: {
					order(item, player) {
						player ??= get.player();
						return get.order({ name: "sha" }, player) + 0.1;
					},
					result: {
						player: 1,
					},
				},
			},
			lexuan: {
				charlotte: true,
				name: "乐縣",
				info: "当一张多目标牌生效前，你可令此牌对其中任意名目标角色无效。",
				trigger: { global: "useCard" },
				filter(event, player) {
					return get.info("lxweisi").lexuanCard(event.card.name) && event.targets?.length;
				},
				async cost(event, trigger, player) {
					const card = trigger.card,
						targets = trigger.targets;
					event.result = await player
						.chooseTarget({
							prompt: get.prompt(event.skill),
							prompt2: `令任意名${get.translation(card)}对任意名目标角色无效`,
							filterTarget(card, player, target) {
								return get.event().targets.includes(target);
							},
							selectTarget: [1, Infinity],
							ai(target) {
								const { card, player, targetx } = get.event();
								return -get.effect(target, card, targetx, player);
							},
						})
						.set("card", card)
						.set("targets", targets)
						.set("targetx", trigger.player)
						.forResult();
				},
				async content(event, trigger, player) {
					const targets = event.targets;
					trigger.targets.removeArray(targets);
				},
			},
		},
		lexuanCard(name) {
			const info = lib.card[name];
			if (!info || info.notarget) {
				return false;
			}
			if (info.selectTarget != undefined) {
				if (Array.isArray(info.selectTarget)) {
					if (info.selectTarget[0] < 0) {
						return !info.toself;
					}
					return info.selectTarget[0] != 1 || info.selectTarget[1] != 1;
				} else {
					if (info.selectTarget < 0) {
						return !info.toself;
					}
					return info.selectTarget != 1;
				}
			}
			return false;
		},
	},
	lxzhaoxiong: {
		audio: "jsrgzhaoxiong",
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		enable: "phaseUse",
		manualConfirm: true,
		filter(event, player) {
			return game.players.length > 1;
		},
		filterTarget: lib.filter.notMe,
		selectTarget: -1,
		multiline: true,
		multitarget: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const targets = event.targets.sortBySeat();
			const targetx = [];
			await game.doAsyncInOrder(targets, async target => {
				const cards = target.getCards("h").filter(card => card.name == "sha");
				if (cards.length) {
					await target.showCards(cards);
					targetx.push(target);
				} else {
					await target.damage();
				}
			});
			if (targetx.length) {
				const result = await player
					.chooseTarget({
						prompt: "昭凶：选择一名角色令展示过【杀】的角色对其使用所有【杀】",
						ai(target) {
							return -get.attitude(get.player(), target);
						},
						forced: true,
					})
					.forResult();
				if (result?.bool && result.targets?.length) {
					const target = result.targets[0];
					player.line(target);
					player.popup("给我杀！");
					await game.doAsyncInOrder(targetx, async i => {
						while (true) {
							const cards = i.getCards("h").filter(card => card.name == "sha" && i.canUse(card, target, false, false));
							if (cards.length) {
								await i.useCard({ card: cards[0], targets: [target], addCount: false });
							} else {
								break;
							}
						}
					});
				}
			}
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (!game.hasPlayer(current => get.attitude(player, current) < 0)) {
						return -1;
					}
					if (player.getEnemies().length > player.getFriends(true).length) {
						return 1;
					}
					return -1;
				},
			},
		},
	},
};

export default skills;
