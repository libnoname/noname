import { lib, game, ui, get, ai, _status } from "../../noname.js";
import cards from "../sp2/card.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	dcsbqiaodui: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		usable: 1,
		filter(event, player) {
			if (!player.countCards("eh")) {
				return false;
			}
			return event.player != event.target;
		},
		async cost(event, trigger, player) {
			const prompt2 = `你可将至多两张牌交给一名其他角色，并令${get.translation(trigger.card)}${trigger.player == player ? "额外结算一次" : "无效"}`;
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt(event.skill),
					prompt2: prompt2,
					filterCard: true,
					selectCard: [1, 2],
					position: "he",
					filterTarget: lib.filter.notMe,
					ai1(card) {
						if (get.event("val")) {
							return 1 / Math.max(0.1, get.value(card));
						}
						return 0;
					},
					val: get.effect(trigger.target, trigger.card, trigger.player, player) > 0 === (trigger.player == player),
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
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			await player.give(cards, target);
			if (trigger.player === player) {
				trigger.getParent().effectCount++;
			} else {
				trigger.targets.length = 0;
				trigger.all_excluded = true;
			}
		},
	},
	dcsbtuicheng: {
		audio: 2,
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		forced: true,
		filter(event, player, name, target) {
			if (event.name == "gain" && !event.giver) {
				return false;
			}
			return event.getl(player).cards2?.containsSome(...event.getg(target));
		},
		getIndex(event, player) {
			if (!event.getg || !event.getl || !event.getl(player)?.cards2?.length) {
				return [];
			}
			return game
				.filterPlayer(current => {
					if (current == player) {
						return false;
					}
					return event.getg(current)?.length;
				})
				.sortBySeat();
		},
		logTarget: (event, player, name, target) => target,
		async content(event, trigger, player) {
			const [target] = event.targets;
			const num = trigger.getg(target).filter(card => trigger.getl(player).cards2?.includes(card)).length;
			const result = await target
				.chooseToGive(
					player,
					`推诚：交给${get.translation(player)}${get.cnNumber(num)}张牌（不得是本回合其交给你过的牌），否则其摸等量牌`,
					num,
					card => {
						return !get.event("cardfilter").includes(card);
					},
					"he"
				)
				.set("give", true)
				.set(
					"cardfilter",
					target
						.getHistory("gain", evt => {
							return evt.getl?.(player)?.cards2?.length && evt.giver === player;
						})
						.map(evt => evt.getl?.(player)?.cards2)
						.flat()
				)
				.forResult();
			if (!result?.bool) {
				await player.draw(num);
			}
		},
	},
	dcsbjuce: {
		audio: 2,
		trigger: {
			player: "useCardToPlayer",
		},
		filter(event, player) {
			if (!event.isFirstTarget || !["basic", "trick"].includes(get.type(event.card)) || _status.currentPhase !== player) {
				return false;
			}
			if (player.getHistory("useCard", evt => evt?.targets?.length).indexOf(event.getParent()) != 0) {
				return false;
			}
			return game.hasPlayer(current => lib.filter.targetEnabled2(event.card, player, current) && !event.targets.includes(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), `是否为${get.translation(trigger.card)}额外指定一名目标？该角色下回合使用基本或普通锦囊牌须额外指定你为目标`, (card, player, target) => {
					if (trigger.targets.includes(target)) {
						return false;
					}
					return lib.filter.targetEnabled2(trigger.card, player, target);
				})
				.set("ai", target => {
					const card = get.event("card");
					const player = get.player();
					return get.effect(target, card, player, player);
				})
				.set("targets", trigger.targets)
				.set("card", trigger.card)
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			game.log(target, "成为了", trigger.card, "的额外目标");
			trigger.getParent().targets.push(target);
			target.markAuto(event.name + "_effect", [player]);
			target.addTempSkill(event.name + "_effect", { player: "phaseEnd" });
		},
		subSkill: {
			effect: {
				mark: true,
				onremove: true,
				marktext: "举",
				intro: {
					content: "下回合使用基本牌和普通锦囊牌额外指定$为目标",
				},
				trigger: {
					player: "useCard",
				},
				charlotte: true,
				forced: true,
				filter(event, player) {
					if (!["basic", "trick"].includes(get.type(event.card)) || _status.currentPhase !== player) {
						return false;
					}
					return get.info("dcsbjuce_effect")?.logTarget(event, player)?.length;
				},
				logTarget(event, player) {
					return player.getStorage("dcsbjuce_effect").filter(target => {
						if (!target?.isIn() || event.targets.includes(target)) {
							return false;
						}
						return lib.filter.targetEnabled2(event.card, player, target);
					});
				},
				async content(event, trigger, player) {
					const targets = event.targets;
					trigger.targets.addArray(targets);
					game.log(targets, "成为了", trigger.card, "的额外目标");
				},
			},
		},
	},
	dcsbkangming: {
		audio: 2,
		trigger: {
			global: "useCardToTargeted",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.player == player || event.target != player) {
				return false;
			}
			return event.player.getHistory("useCard", evt => evt?.targets.includes(player)).indexOf(event.getParent()) > 0;
		},
		async content(event, trigger, player) {
			player
				.when({ global: "useCardAfter" })
				.filter(evt => evt == trigger.getParent())
				.step(get.info(event.name).contentx);
		},
		async contentx(event, trigger, player) {
			await player.draw();
			const result = await player
				.chooseToUse("抗明：是否对" + get.translation(trigger.player) + "使用一张牌？否则你摸三张牌且本技能失效直到你的下回合")
				.set("filterTarget", function (card, player, target) {
					const targetx = get.event("target");
					if (target !== targetx && !ui.selected.targets.includes(targetx)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("targetRequired", true)
				.set("complexTarget", true)
				.set("complexSelect", true)
				.set("target", trigger.player)
				.set("addCount", false)
				.forResult();
			if (!result?.bool) {
				await player.draw(3);
				player.tempBanSkill("dcsbkangming", { player: "phaseBegin" });
			}
		},
	},
	//董絮
	dcqingleng: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.card.color == "black" && !get.is.convertedCard(event.card);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.countDiscardableCards(player, "he");
				})
				.set("ai", target => get.effect(target, { name: "guohe_copy2" }, get.player(), get.player()))
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			const result = await player.discardPlayerCard(target, "he", true).forResult();
			if (result?.cards?.length) {
				const [card] = result.cards;
				if (get.type(card) == "equip") {
					trigger.getParent().excluded.add(player);
					//trigger.triggeredTargets4.remove(player);
				} else {
					const resultx = await player
						.chooseBool(`是否令你下次〖酖毒〗使用牌可以视为使用${get.translation(trigger.card)}`)
						.set("choice", player.hasValueTarget(trigger.card, false, false))
						.forResult();
					if (resultx?.bool) {
						player.markAuto("dczhendu_effect", get.autoViewAs(trigger.card));
					}
				}
			}
		},
	},
	dczhendu: {
		audio: 2,
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return player.countCards("he", card => ["basic", "trick"].includes(get.type(card, player)));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), [1, 5], (card, player) => {
					return ["basic", "trick"].includes(get.type(card, player));
				})
				.set("ai", card => {
					return get.player().hasValueTarget(card, false, false);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event;
			await player.showCards(cards, `${get.translation(player)}发动了【酖毒】`);
			player.addSkill(event.name + "_effect");
			player.markAuto(
				event.name + "_effect",
				cards.map(card => get.autoViewAs(card))
			);
		},
		subSkill: {
			effect: {
				audio: "dczhendu",
				trigger: {
					player: "phaseBegin",
				},
				onremove: true,
				forced: true,
				charlotte: true,
				filter(event, player) {
					return player.getStorage("dczhendu_effect").length > 0;
				},
				async content(event, trigger, player) {
					const cards = player.getStorage(event.name);
					player.removeSkill(event.name);
					const func = card => {
						return get.autoViewAs({
							name: card.name,
							nature: card.nature,
							suit: card.suit,
							number: card.number,
							isCard: true,
						});
					};
					player.addTempSkill("dczhendu_draw");
					while (cards.some(card => ["basic", "trick"].includes(get.type(card)) && (player.hasUseTarget(func(card), false, false) || (get.info(func(card)).notarget && lib.filter.cardEnabled(func(card), player))))) {
						const result = await player
							.chooseButton([`酖毒：视为使用一张牌`, [cards, "vcard"]], true)
							.set("ai", button => get.order(get.event().func(button.link)))
							.set("filterButton", button => {
								const card = get.event().func(button.link);
								return player.hasUseTarget(card, false, false) || (get.info(card).notarget && lib.filter.cardEnabled(card, player));
							})
							.set("func", func)
							.forResult();
						if (result?.links?.length) {
							const [card] = result.links;
							cards.remove(card);
							const VCard = func(card);
							await player.chooseUseTarget(VCard, true, false, "nodistance");
						} else {
							break;
						}
					}
					player.removeSkill("dczhendu_draw");
				},
				intro: {
					mark(dialog, storage, player) {
						dialog.add([storage, "vcard"]);
					},
				},
			},
			draw: {
				audio: "dczhendu",
				forced: true,
				charlotte: true,
				trigger: { global: ["recoverEnd", "damageEnd"] },
				async content(event, trigger, player) {
					const next = player.draw();
					next.gaintag.add("dczhendu_handcard");
					player.addTempSkill("dczhendu_handcard");
					await next;
				},
			},
			handcard: {
				charlotte: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("dczhendu_handcard")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("dczhendu_handcard")) {
							return false;
						}
					},
				},
			},
		},
	},
	//威马超
	dczhongtao: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return player.hasSkill("dczhongtao_double") ? 2 : 1;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog(`###众讨###出牌阶段限一次，你可以选择至多${Math.min(4, player.getDamagedHp() + 1)}种花色，然后随机获得弃牌堆中你选择花色的各一张牌。`, [lib.suit.map(suit => "lukai_" + suit), "vcard"]);
			},
			check(button) {
				const suit = button.link[2].slice(6);
				return Math.max(...Array.from(ui.discardPile.childNodes).map(card => (get.suit(card) == suit ? get.value(card) : 0)));
			},
			select() {
				const player = get.player();
				return [1, 1 + player.getDamagedHp()];
			},
			backup(links) {
				return {
					audio: "dczhongtao",
					suits: links.map(list => list[2].slice(6)),
					async content(event, trigger, player) {
						const suits = get.info(event.name).suits;
						const cards = [];
						for (const suit of suits) {
							const card = get.discardPile(card => get.suit(card) == suit, "random");
							if (card) {
								cards.push(card);
							}
						}
						if (cards.length) {
							await player.gain(cards, "gain2");
						} else {
							player.chat("牌堆我对你的爱像叮咚鸡");
						}
					},
				};
			},
		},
		group: ["dczhongtao_types"],
		subSkill: {
			backup: {},
			double: {
				charlotte: true,
			},
			types: {
				audio: "dczhongtao",
				forced: true,
				locked: false,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return (
						player
							.getHistory("useCard")
							.map(evt => get.type2(evt.card))
							.unique().length >= 3 && !player.hasSkill("dczhongtao_double")
					);
				},
				async content(event, trigger, player) {
					player.addTempSkill("dczhongtao_double", "phaseChange");
				},
			},
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
	},
	dcjizhan: {
		audio: 2,
		comboSkill: true,
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object") {
					const evt = lib.skill.dcjianying.getLastUsed(player);
					if (evt?.card && ["equip2", "equip3", "equip4", "equip3_4"].includes(get.subtype(evt.card)) && !evt.dcjizhan && get.color(card, player) == "black") {
						return num + 10;
					}
				}
			},
		},
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			if (get.color(event.card) != "black") {
				return false;
			}
			const evt = lib.skill.dcjianying.getLastUsed(player, event);
			if (!evt || !evt.card || evt.dcjizhan) {
				return false;
			}
			return ["equip2", "equip3", "equip4", "equip3_4"].includes(get.subtype(evt.card));
		},
		locked: false,
		async cost(event, trigger, player) {
			const num = player.getHistory("useSkill", evt => evt.skill == event.skill).length + 1;
			const result = await player
				.chooseButtonTarget({
					createDialog: [
						get.prompt2(event.skill),
						[
							[
								["discard", `弃置至多${num}名角色各一张牌`],
								["damage", `对一名角色造成${num}点伤害，然后此技能本回合失效`],
							],
							"textbutton",
						],
					],
					filterButton(button) {
						const player = get.player();
						if (button.link == "discard") {
							return game.hasPlayer(target => target.countDiscardableCards(player, "he"));
						}
						return true;
					},
					filterTarget(card, player, target) {
						const selected = ui.selected.buttons;
						if (!selected.length) {
							return false;
						}
						if (selected[0].link == "discard") {
							return target.countDiscardableCards(player, "he");
						}
						return true;
					},
					selectTarget() {
						const selected = ui.selected.buttons;
						if (!selected.length) {
							return false;
						}
						if (selected[0].link == "discard") {
							return [1, get.event().num];
						}
						return 1;
					},
					num: num,
					ai1(button) {
						const player = get.player();
						if (button.link == "discard") {
							const list = game
								.filterPlayer(target => target.countDiscardableCards(player, "he"))
								.map(target => {
									const num = get.effect(target, { name: "guohe_copy2" }, player, player);
									return num ? num : 0;
								})
								.sort((a, b) => b - a);
							return list.slice(0, Math.min(get.event().num, list.length)).reduce((eff, num) => eff + num, 0);
						}
						return Math.max(...game.filterPlayer().map(target => get.damageEffect(target, player, player) * get.event().num));
					},
					ai2(target) {
						const selected = ui.selected.buttons;
						const player = get.player();
						if (selected[0].link == "discard") {
							return get.effect(target, { name: "guohe_copy2" }, player, player);
						}
						return get.damageEffect(target, player, player) * get.event().num;
					},
				})
				.forResult();
			if (result?.links?.length && result?.targets?.length) {
				event.result = {
					bool: true,
					targets: result.targets,
					cost_data: result.links[0],
				};
			}
		},
		async content(event, trigger, player) {
			const choice = event.cost_data;
			const { targets } = event;
			const num = player.getHistory("useSkill", evt => evt.skill == event.name).length;
			for (const target of targets.sortBySeat()) {
				if (choice == "discard") {
					await player.discardPlayerCard(target, "he", true);
				} else {
					await target.damage(num);
					player.tempBanSkill(event.name);
				}
			}
		},
		init(player, skill) {
			player.addSkill(skill + "_mark");
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_mark");
		},
		subSkill: {
			mark: {
				init(player, skill) {
					const evt = lib.skill.dcjianying.getLastUsed(player);
					if (evt?.card && ["equip2", "equip3", "equip4", "equip3_4"].includes(get.subtype(evt.card)) && !evt[skill]) {
						player.addTip(skill, "极斩 可连击");
					}
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				charlotte: true,
				trigger: {
					player: ["useCard1", "useCardAfter"],
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					if (event.triggername == "useCard1") {
						if (["equip2", "equip3", "equip4", "equip3_4"].includes(get.subtype(trigger.card))) {
							player.addTip("dcjiazhan", "极斩 可连击");
						} else {
							player.removeTip("dcjiazhan");
						}
					} else if (trigger.dcjiazhan) {
						player.removeTip("dcjiazhan");
					}
				},
			},
		},
	},
	//谋陆逊
	dcsbjunmou: {
		audio: 2,
		group: "dcsbjunmou_change",
		audioname: ["dc_sb_luxun_shadow"],
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			player.changeSkin({ characterName: "dc_sb_luxun" }, "dc_sb_luxun" + (player.storage[skill] ? "_shadow" : ""));
		},
		marktext: "☯",
		mark: true,
		intro: {
			content(storage, player) {
				if (!storage) {
					return `转换技，若你成为牌的目标，此牌结算后你可摸一张牌并选择一张手牌，此牌视为无次数限制的火【杀】。`;
				}
				return `转换技，若你成为牌的目标，此牌结算后你可摸一张牌并选择一张手牌，重铸此牌并横置一名角色。`;
			},
		},
		trigger: {
			global: ["useCardAfter"],
		},
		filter(event, player) {
			return event.targets?.includes(player);
		},
		check: () => true,
		frequent: true,
		async content(event, trigger, player) {
			const bool = player.storage[event.name];
			player.changeZhuanhuanji(event.name);
			await player.draw();
			if (!player.countCards("h")) {
				return;
			}
			const result = await player.chooseCard(`隽谋：选择一张手牌，${bool ? "重铸此牌并横置一名角色" : "此牌视为无次数限制的火【杀】"}`, "h", true).forResult();
			if (result?.cards?.length) {
				const card = result.cards[0];
				if (!bool) {
					player.addSkill(event.name + "_sha");
					player.addGaintag(card, event.name + "_sha");
				} else {
					await player.recast(card);
					if (game.hasPlayer(target => !target.isLinked())) {
						const resultx = await player
							.chooseTarget("隽谋：横置一名角色", true, (card, player, target) => {
								return !target.isLinked();
							})
							.set("ai", target => -get.attitude(get.player(), target))
							.forResult();
						if (resultx?.targets?.length) {
							const target = resultx.targets[0];
							player.line(target, "yellow");
							await target.link(true);
						}
					}
				}
			}
		},
		subSkill: {
			sha: {
				mod: {
					cardname(card, player, name) {
						if (card.hasGaintag("dcsbjunmou_sha")) {
							return "sha";
						}
					},
					cardnature(card, player, nature) {
						if (card.hasGaintag("dcsbjunmou_sha")) {
							return "fire";
						}
					},
					cardUsable(card, player, num) {
						if (card.cards?.length !== 1 || !card.isCard) {
							return;
						}
						if (card.cards[0].hasGaintag("dcsbjunmou_sha")) {
							return Infinity;
						}
					},
				},
				forced: true,
				popup: false,
				charlotte: true,
				firstDo: true,
				trigger: {
					player: "useCard1",
				},
				filter(event, player) {
					return (
						event.addCount !== false &&
						event.card.isCard &&
						event.cards?.length == 1 &&
						player.hasHistory("lose", evt => {
							if ((evt.relatedEvent || evt.getParent()) !== event) {
								return false;
							}
							return evt.hs.length == 1 && Object.values(evt.gaintag_map).flat().includes("dcsbjunmou_sha");
						})
					);
				},
				async content(event, trigger, player) {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
					game.log(trigger.card, "不计入次数");
				},
			},
			change: {
				audio: "dcsbjunmou",
				audioname: ["dc_sb_luxun_shadow"],
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【隽谋】为状态" + (player.storage.dcsbjunmou ? "阳" : "阴");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("dcsbjunmou");
				},
			},
		},
	},
	dcsbzhanyan: {
		audio: 2,
		limited: true,
		enable: "phaseUse",
		skillAnimation: true,
		animationColor: "wood",
		filter(event, player) {
			return game.hasPlayer(target => target.isLinked() && target != player);
		},
		filterTarget(card, player, target) {
			return target.isLinked() && target != player;
		},
		selectTarget: [1, Infinity],
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.addTempSkill(event.name + "_draw");
			let { targets } = event;
			await player.draw(targets.length);
			while (true) {
				targets = targets.filter(target => target.isIn() && target.countCards("h"));
				if (!targets.length) {
					break;
				}
				const showEvent = player
					.chooseCardOL(targets, "绽炎：请选择要展示的牌", true)
					.set("ai", function (card) {
						return Math.random();
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
				const suits = cards.map(card => get.suit(card)).unique();
				const next = player
					.showCards(cards, `${get.translation(player)} 发动了【${get.translation(event.name)}】`, false)
					.set("showers", targets)
					.set("customButton", button => {
						const target = get.owner(button.link);
						if (target) {
							const div = button.querySelector(".info");
							div.innerHTML = "<span style = 'font-weight:bold'>" + get.translation(get.suit(button.link, target)) + target.getName() + "</span>";
						}
					})
					.set("delay_time", targets.length * 2)
					.set("closeDialog", false);
				await next;
				const id = next.videoId;

				const update = function (id, suits) {
					const dialog = get.idDialog(id);
					if (dialog) {
						const div = dialog.querySelector(".caption");
						div.innerHTML = `绽炎：你可以弃置任意张花色为<span style = "font-weight:bold;font-size: 150%">${get.translation(suits)}</span>的牌对所选角色造成1点火焰伤害`;
						ui.update();
					}
				};
				if (player.isOnline2()) {
					player.send(update, id, suits);
				} else {
					update(id, suits);
				}
				const nextx = player.chooseCardTarget({
					prompt: false,
					dialog: get.idDialog(id),
					filterCard(card) {
						if (!get.event().suits.includes(get.suit(card, get.player()))) {
							return false;
						}
						return lib.filter.cardDiscardable.apply(this, arguments);
					},
					selectCard: [1, Infinity],
					filterTarget(card, player, target) {
						const selected = ui.selected.cards;
						if (!selected.length) {
							return false;
						}
						const suits = selected.map(card => get.suit(card, player)).unique();
						return suits.includes(get.suit(get.event().cards[get.event().targets.indexOf(target)], target));
					},
					//complexTarget: true,
					selectTarget: -1,
					suits: suits,
					cards: cards,
					targets: targets,
					position: "he",
					ai1(card) {
						return 10 - get.value(card);
					},
				});
				nextx.set(
					"targetprompt2",
					nextx.targetprompt2.concat([
						target => {
							const evt = get.event();
							if (!target.isIn() || !evt.filterTarget(null, get.player(), target)) {
								return;
							}
							const card = evt.cards[evt.targets.indexOf(target)];
							if (!card) {
								return;
							}
							const suit = get.suit(card, target);
							const color = get.color(card, target);
							const str = get.translation(suit);
							return `<span style = "color:${color};font-weight:bold;font-size: 200%">${str}</span>`;
						},
					])
				);
				const resultx = await nextx.forResult();
				game.broadcastAll("closeDialog", id);
				if (resultx?.cards?.length && resultx.targets?.length) {
					const damage = resultx.targets;
					await player.discard(resultx.cards);
					player.line(damage, "fire");
					const damaged = [];
					await game.doAsyncInOrder(damage, async target => {
						const next = target.damage("fire");
						await next;
						damaged.addArray(targets.filter(i => i.hasHistory("damage", evt => (evt.getParent()?.getTrigger() || evt) == next)));
					});
					if (damaged.length != event.targets.length) {
						targets.forEach(target => {
							if (!damaged.includes(target)) {
								target.chat("☝🤓唉，没打着");
								target.throwEmotion(player, ["egg", "shoe"].randomGet());
							}
						});
						break;
					}
				} else {
					targets.forEach(target => {
						target.chat("☝🤓唉，没打着");
						target.throwEmotion(player, ["egg", "shoe"].randomGet());
					});
					break;
				}
			}
			player.removeSkill(event.name + "_draw");
		},
		subSkill: {
			draw: {
				audio: "dcsbzhanyan",
				charlotte: true,
				forced: true,
				trigger: {
					player: "loseAfter",
					global: ["gainAfter", "loseAsyncAfter", "addJudgeAfter", "addToExpansionAfter", "equipAfter"],
				},
				filter(event, player) {
					return event.getl?.(player)?.cards2?.length;
				},
				async content(event, trigger, player) {
					await player.draw(trigger.getl?.(player)?.cards2?.length);
				},
			},
		},
		ai: {
			order: 1,
			result: {
				target: -1,
			},
		},
	},
	//谋邓艾
	dcsbzhouxi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard(card, player, event) {
			return game.players.every(current => current == player || !player.canUse(card, current, true, true));
		},
		filter(event, player) {
			return player.countCards("h", card => get.info("dcsbzhouxi")?.filterCard(card, player, event));
		},
		selectCard: -1,
		manualConfirm: true,
		position: "h",
		async content(event, trigger, player) {
			let num = Math.min(3, event.cards.length),
				select = [];
			const bool1 =
					game.countPlayer(current => {
						return player.canUse("shunshou", current, true) && get.effect(current, { name: "shunshou" }, player, player) > 0;
					}) < num,
				bool2 = game.hasPlayer(current => {
					return player.canUse("shunshou", current, false) && get.distance(player, current) == 2 && get.effect(current, { name: "shunshou" }, player, player) > 0;
				});
			while (num > 0) {
				num--;
				const choiceList = [`计算与其他角色距离-${select.length + 1}`, `视为对至多${select.length + 1}名角色使用【顺手牵羊】`, `视为对至多${select.length + 1}名角色使用【杀】`],
					controls = ["选项一", "选项二", "选项三"];
				for (const chosen of select) {
					const index = controls.indexOf(chosen);
					choiceList[index] = `<span style="opacity:0.5;">${choiceList[index]}</span>`;
				}
				const result = await player
					.chooseControl(controls.removeArray(select))
					.set("prompt", `骤袭：请选择一项（还可选择${num}项）`)
					.set("choiceList", choiceList)
					.set("ai", () => {
						return get.event("res");
					})
					.set(
						"res",
						(() => {
							if (controls.includes("选项一") && (num > 1 || (num > 0 && bool1 && bool2))) {
								return "选项一";
							}
							return controls[controls.length - 1];
						})()
					)
					.forResult();
				const control = result.control;
				select.push(control);
				game.log(player, "选择了", `#g${choiceList[["选项一", "选项二", "选项三"].indexOf(control)]}`);
			}
			let count = 0;
			while (select.length) {
				let result = select.shift();
				switch (result) {
					case "选项一": {
						player.addTempSkill("dcsbzhouxi_range");
						player.addMark("dcsbzhouxi_range", count, false);
						count++;
						break;
					}
					case "选项二": {
						const card = new lib.element.VCard({ name: "shunshou" });
						if (player.hasUseTarget(card)) {
							count++;
							await player.chooseUseTarget(card, [1, count], true);
						}
						break;
					}
					case "选项三": {
						const card = new lib.element.VCard({ name: "sha" });
						if (player.hasUseTarget(card)) {
							count++;
							await player.chooseUseTarget(card, [1, count], true, false);
						}
						break;
					}
				}
			}
			if (count >= 3) {
				if (player.getStat("skill")[event.name]) {
					delete player.getStat("skill")[event.name];
					game.log(player, "重置了", "#g【骤袭】");
				}
			}
		},
		subSkill: {
			range: {
				charlotte: true,
				onremove: true,
				intro: {
					markcount(storage) {
						return storage ? `-${storage}` : null;
					},
					content: "计算与其他角色距离-#",
				},
				mod: {
					globalFrom(from, to, num) {
						return num - from.countMark("dcsbzhouxi_range");
					},
				},
			},
		},
		ai: {
			order: 6,
			result: {
				player(player) {
					if (
						game.hasPlayer(current => {
							if (get.distance(player, current) > 2 || get.effect(current, { name: "shunshou" }, player, player) <= 0) {
								return false;
							}
							return player.canUse("shunshou", current, false) || player.canUse("sha", current, false);
						})
					) {
						if (player.hasSkill("dcsbshijin") && !player.getStorage("dcsbshijin", false)) {
							const num = player.countCards("h", card => get.info("dcsbzhouxi")?.filterCard(card, player, get.event()));
							if (num < 3 && player.getHistory("sourceDamage").length) {
								return 0;
							}
						}
						return 1;
					}
					return 0;
				},
			},
		},
	},
	dcsbshijin: {
		audio: 2,
		enable: "phaseUse",
		manualConfirm: true,
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		onChooseToUse(event) {
			if (!game.online && !event.shijin_record) {
				event.set("shijin_record", event.player.getHistory("sourceDamage"));
			}
		},
		filter(event, player) {
			return event.shijin_record?.length;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.draw(2);
			/*let cards = [];
			while (true) {
				const card = get.cardPile(card => cards.every(cardx => get.type2(cardx) != get.type2(card)));
				if (card) {
					cards.push(card);
				} else {
					break;
				}
			}
			if (cards.length) {
				await player.gain(cards, "gain2");
			}*/
			player.addTempSkill("dcsbshijin_defend", { player: "phaseBeginStart" });
			player
				.when({
					player: "phaseBegin",
				})
				.step(async (event, trigger, player) => {
					const cards = player.getDiscardableCards(player, "h").filter(card => {
						return get.name(card) == "sha" || get.type2(card) == "trick";
					});
					if (cards.length) {
						await player.discard(cards);
						await player.loseHp(cards.length);
					} else {
						player.restoreSkill("dcsbshijin");
						game.log(player, "重置了", "#g【恃矜】");
					}
				});
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
		subSkill: {
			defend: {
				charlotte: true,
				mark: true,
				intro: {
					content: "受到伤害时，防止之并摸一张牌",
				},
				trigger: {
					player: "damageBegin3",
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					trigger.cancel();
					await player.draw();
				},
				ai: {
					filterDamage: true,
					skillTagFilter(player, tag, arg) {
						if (arg.player.hasSkillTag("jueqing", false, player)) {
							return false;
						}
					},
				},
			},
		},
	},
	//mega张琪瑛X
	x_dc_falu: {
		audio: "xinfu_falu",
		trigger: {
			player: ["loseAfter", "enterGame"],
			target: "useCardToTarget",
			global: ["loseAsyncAfter", "phaseBefore"],
		},
		forced: true,
		locked: false,
		filter(event, player, name) {
			let suits = [];
			if (name == "useCardToTarget") {
				const suit = get.suit(event.card, event.player);
				suits.add(suit);
			} else if (event.name.indexOf("lose") != 0) {
				if (event.name != "phase" || game.phaseNumber == 0) {
					suits.addArray(lib.suit);
				}
			} else if (event.type == "discard" && event.getlx !== false) {
				suits.addArray(event.getl(player)?.cards2?.map(card => get.suit(card)));
			}
			suits = suits.filter(suit => lib.suit.includes(suit));
			return suits?.length && !player.getStorage("x_dc_falu").containsAll(...suits);
		},
		intro: {
			content(storage, player) {
				if (!storage) {
					return "未记录";
				}
				return `已记录花色：${storage.map(i => get.translation(i)).join("")}`;
			},
		},
		onremove(player, skill) {
			player.removeTip(skill);
			delete player.storage[skill];
		},
		async content(event, trigger, player) {
			let suits = [];
			if (event.triggername == "useCardToTarget") {
				const suit = get.suit(trigger.card, trigger.player);
				suits.add(suit);
			} else if (trigger.name.indexOf("lose") != 0) {
				if (trigger.name != "phase" || game.phaseNumber == 0) {
					suits.addArray(lib.suit);
				}
			} else if (trigger.type == "discard" && trigger.getlx !== false) {
				suits.addArray(trigger.getl(player)?.cards2?.map(card => get.suit(card)));
			}
			suits = suits.filter(suit => lib.suit.includes(suit) && !player.getStorage(event.name).includes(suit));
			player.markAuto(event.name, suits);
			player.storage[event.name].sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
			game.log(player, "记录了", suits.map(i => get.translation(i)).join(""));
			const tip = player
				.getStorage(event.name)
				.map(i => get.translation(i))
				.join("");
			player.addTip(event.name, `法箓${tip}`);
		},
		ai: { combo: "x_dc_zhenyi" },
	},
	x_dc_zhenyi: {
		audio: "xinfu_zhenyi",
		trigger: { global: "useCard" },
		filter(event, player) {
			if (event.player != _status.currentPhase || !player.getStorage("x_dc_falu").length) {
				return false;
			}
			return event.player.getHistory("useCard", evt => get.type(evt.card) != "equip").indexOf(event) == 0;
		},
		filterx: {
			heartA: event => {
				const info = get.info(event.card);
				if (!event.targets?.length || info.multitarget || info.allowMultiple === false) {
					return false;
				}
				return game.hasPlayer(current => {
					return lib.filter.targetEnabled2(event.card, event.player, current) && !event.targets.includes(current);
				});
			},
			heartB: event => {
				const info = get.info(event.card);
				if (!event.targets?.length || info.multitarget || info.allowMultiple === false) {
					return false;
				}
				return event.targets.length;
			},
			clubA: event => {
				if (!event.targets?.length) {
					return false;
				}
				var type = get.type(event.card);
				if (type != "basic" && type != "trick") {
					return false;
				}
				return true;
			},
		},
		effectx: {
			heartA: (event, player) => {
				const targets = game
					.filterPlayer(current => {
						return lib.filter.targetEnabled2(event.card, player, current) && !event.targets.includes(current);
					})
					.map(current => get.effect(current, event.card, event.player, player));
				return targets.maxBy();
			},
			heartB: (event, player) => {
				const targets = event.targets.map(current => -get.effect(current, event.card, event.player, player));
				return targets.maxBy();
			},
			diamondA: (event, player) => {
				if (!get.tag(event.card, "damage") || !event.targets?.length) {
					return 0;
				}
				return event.targets.reduce((sum, current) => {
					return sum + get.damageEffect(current, event.player, player, get.natureList(event.card, event.player));
				}, 0);
			},
			diamondB: (event, player) => {
				if (!get.tag(event.card, "damage") || !event.targets?.length) {
					return 0;
				}
				return event.targets.reduce((sum, current) => {
					return sum - get.damageEffect(current, event.player, player, get.natureList(event.card, event.player));
				}, 0);
			},
			spadeA: (event, player) => {
				return 0.2 * get.attitude(player, event.player) * event.player.countCards("h");
			},
			spadeB: (event, player) => {
				return -0.2 * get.attitude(player, event.player) * event.player.countCards("h");
			},
			clubA: (event, player) => {
				return event.targets.reduce((sum, current) => {
					return sum + get.effect(current, event.card, event.player, player);
				}, 0);
			},
			clubB: (event, player) => {
				if (!event.targets?.length) {
					return get.attitude(player, event.player) >= -1 ? 0 : -2;
				}
				return event.targets.reduce((sum, current) => {
					return sum - get.effect(current, event.card, event.player, player);
				}, 0);
			},
		},
		async cost(event, trigger, player) {
			const suit = get.suit(trigger.card),
				result = await player
					.chooseButton([
						get.prompt(event.skill, trigger.player),
						[
							[
								["heartA", "♥：此牌目标+1"],
								["heartB", "♥：此牌目标-1"],
							],
							"tdnodes",
						],
						[
							[
								["diamondA", "♦：此牌伤害+1"],
								["diamondB", "♦：此牌伤害-1"],
							],
							"tdnodes",
						],
						[
							[
								["spadeA", `♠：其使用${get.translation(suit)}牌时摸一张牌`],
								["spadeB", `♠：其不能使用${get.translation(suit)}牌`],
							],
							"tdnodes",
						],
						[
							[
								["clubA", "♣：此牌额外结算一次"],
								["clubB", "♣：此牌无效"],
							],
							"tdnodes",
						],
					])
					.set("filterButton", button => {
						const player = get.player(),
							list = player.getStorage("x_dc_falu"),
							trigger = get.event().getTrigger(),
							filterx = get.info("x_dc_zhenyi").filterx;
						if (!list.includes(button.link.slice(0, -1))) {
							return false;
						}
						return !filterx[button.link] || filterx[button.link](trigger);
					})
					.set("ai", button => {
						const player = get.player(),
							check = get.info("x_dc_zhenyi")?.effectx,
							trigger = get.event().getTrigger();
						return check[button.link](trigger, player);
					})
					.forResult();
			if (result.bool && result.links) {
				const link = result.links[0];
				event.result = {
					bool: true,
					targets: [trigger.player],
					cost_data: [link.slice(0, -1), link.slice(-1)],
				};
			}
		},
		async content(event, trigger, player) {
			const [suit, type] = event.cost_data;
			player.unmarkAuto("x_dc_falu", suit);
			game.log(player, "移去了记录", get.translation(suit));
			const tip = player
				.getStorage("x_dc_falu")
				.map(i => get.translation(i))
				.join("");
			tip.length > 0 ? player.addTip("x_dc_falu", `法箓${tip}`) : player.removeTip("x_dc_falu");
			switch (suit) {
				case "heart": {
					const result = await player
						.chooseTarget(
							`真仪：为${get.translation(trigger.card)}${type == "A" ? "增加" : "减少"}一个目标`,
							(card, player, target) => {
								const trigger = get.event().getTrigger(),
									{ resultType: type } = get.event();
								if (type == "A") {
									return lib.filter.targetEnabled2(trigger.card, player, target) && !trigger.targets.includes(target);
								}
								return trigger.targets.includes(target);
							},
							true
						)
						.set("resultType", type)
						.set("ai", target => {
							const trigger = get.event().getTrigger(),
								{ resultType: type, player } = get.event();
							let eff = get.effect(target, trigger.card, trigger.player, player);
							return type == "A" ? eff : -eff;
						})
						.forResult();
					if (result.bool && result.targets) {
						player.line(result.targets, "green");
						game.log(player, "令", result.targets, type == "A" ? "成为了" : "移出了", trigger.card, "的目标");
						trigger.targets[type == "A" ? "addArray" : "removeArray"](result.targets);
					}
					break;
				}
				case "diamond": {
					const map = trigger.customArgs;
					if (map) {
						for (const target of game.players) {
							const id = target.playerid;
							if (!map[id]) {
								map[id] = {};
							}
							if (typeof map[id].extraDamage != "number") {
								map[id].extraDamage = 0;
							}
							map[id].extraDamage += type == "A" ? 1 : -1;
						}
					}
					game.log(player, "令", trigger.card, "造成的伤害", type == "A" ? "+1" : "-1");
					break;
				}
				case "spade": {
					trigger.player.addTempSkill(`x_dc_zhenyi_${type}`);
					const suit = get.suit(trigger.card);
					trigger.player.markAuto(`x_dc_zhenyi_${type}`, suit);
					game.log(player, "令", trigger.player, type == "A" ? "使用" : "无法使用", suit, type == "A" ? "牌时摸一张牌" : "牌");
					break;
				}
				case "club": {
					if (type == "A") {
						trigger.effectCount++;
					} else {
						trigger.targets.length = 0;
						trigger.all_excluded = true;
					}
					game.log(player, "令", trigger.card, type == "A" ? "额外结算一次" : "无效");
					break;
				}
			}
		},
		ai: { combo: "x_dc_falu" },
		subSkill: {
			A: {
				intro: {
					markcount(storage, player) {
						return storage ? storage.map(i => get.translation(i)).join("") : null;
					},
					content(storage, player) {
						if (storage) {
							return `使用${storage.map(i => get.translation(i)).join("")}牌时摸一张牌`;
						}
						return "未记录";
					},
				},
				charlotte: true,
				onremove: true,
				trigger: { player: "useCard" },
				filter(event, player) {
					return player.getStorage("x_dc_zhenyi_A").includes(get.suit(event.card));
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.draw();
				},
			},
			B: {
				intro: {
					markcount(storage, player) {
						return storage ? storage.map(i => get.translation(i)).join("") : null;
					},
					content(storage, player) {
						if (storage) {
							return `无法使用${storage.map(i => get.translation(i)).join("")}牌`;
						}
						return "未记录";
					},
				},
				charlotte: true,
				onremove: true,
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("x_dc_zhenyi_B").includes(get.suit(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (player.getStorage("x_dc_zhenyi_B").includes(get.suit(card))) {
							return false;
						}
					},
				},
			},
		},
	},
	x_dc_dianhua: {
		audio: "xinfu_dianhua",
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		frequent: true,
		async content(event, trigger, player) {
			const cards = get.cards(4);
			const result = await player
				.chooseToMove(true)
				.set("list", [["牌堆顶", cards], ["获得"]])
				.set("prompt", "点化：获得一张已记录花色的牌，将其余牌以任意顺序放回牌堆顶")
				.set("filterx", (card, player) => player.getStorage("x_dc_falu").includes(get.suit(card)))
				.set("filterOk", moved => {
					const { filterx: filter, player } = get.event();
					return moved[1].length == 1 || moved[0].every(card => !filter(card, player));
				})
				.set("filterMove", (from, to, moved) => {
					const { filterx: filter, player } = get.event();
					if (moved[0].includes(from.link)) {
						if (typeof to == "number") {
							return to == 0 || (!moved[1].length && filter(from.link, player));
						}
						return moved[0].includes(to.link) || filter(from.link, player);
					}
					if (typeof to == "number") {
						return to == 0;
					}
					return filter(to.link, player);
				})
				.set("processAI", list => {
					const { filterx: filter, player } = get.event();
					const cards = list[0][1].slice(0).filter(card => filter(card, player));
					if (cards?.length) {
						const card = cards.maxBy(card => get.value(card, player));
						return [list[0][1].remove(card), [card]];
					}
					return [list[0][1], []];
				})
				.forResult();
			if (result.bool && result.moved) {
				const top = result.moved[0].reverse(),
					gains = result.moved[1];
				if (top?.length) {
					for (let i = 0; i < top.length; i++) {
						ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
					}
				}
				if (gains?.length) {
					await player.gain(gains, "gain2");
				}
			}
		},
	},
	//mega张琪瑛Y
	y_dc_falu: {
		audio: "xinfu_falu",
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.getl(player).hs.length > 0;
		},
		intro: {
			content(storage, player) {
				if (storage) {
					return `当前记录花色：${storage.map(i => get.translation(i)).join("")}`;
				}
				return "未记录";
			},
		},
		async content(event, trigger, player) {
			const suits = trigger.getl(player).hs.map(i => get.suit(i, player));
			let list = player.getStorage(event.name).concat(suits);
			if (list.length > 3) {
				list = list.slice(-3);
			}
			player.setStorage(event.name, list, true);
			const tip = player
				.getStorage(event.name)
				.map(i => get.translation(i))
				.join("");
			player.addTip(event.name, `法箓${tip}`);
			if (list.length < 3) {
				return;
			}
			if (list.toUniqued().length == 1) {
				const suit = list[0];
				player.setStorage(event.name, [], true);
				player.removeTip(event.name);
				const next = game.createEvent("removeFaluRecord", false);
				next.player = player;
				next.type = "same";
				next.suit = suit;
				next.setContent("emptyEvent");
				await next;
				const cards = [];
				while (true) {
					const card = get.cardPile2(card => {
						return cards.every(cardx => get.suit(cardx) != get.suit(card)) && get.suit(card) != suit;
					});
					if (card) {
						cards.add(card);
					} else {
						break;
					}
				}
				if (cards?.length) {
					await player.gain(cards, "gain2");
				}
			}
			if (list.toUniqued().length == 3) {
				const result = await player
					.chooseButtonTarget({
						createDialog: [
							"法箓：是否清空记录并令一名角色失去或回复1点体力？",
							[
								[
									["loseHp", "失去1点体力"],
									["recover", "回复1点体力"],
								],
								"tdnodes",
							],
						],
						filterTarget(card, player, target) {
							const buttons = ui.selected.buttons;
							if (!buttons?.length) {
								return false;
							}
							return buttons[0].link == "loseHp" || target.isDamaged();
						},
						ai1(button) {
							const player = get.player();
							let eff1 = 0,
								eff2 = 0;
							game.filterPlayer(current => {
								const losehp = get.effect(current, { name: "losehp" }, current, player);
								if (losehp > eff1) {
									eff1 = losehp;
								}
								const recover = get.recoverEffect(current, player, player);
								if (recover > eff2) {
									eff2 = recover;
								}
							});
							if (eff1 > eff2 && eff1 > 0) {
								return button.link == "loseHp" ? 1 : 0;
							}
							if (eff1 < eff2 && eff2 > 0) {
								return button.link == "loseHp" ? 0 : 1;
							}
							return 0;
						},
						ai2(target) {
							const player = get.player(),
								buttons = ui.selected.buttons;
							if (!buttons?.length) {
								return false;
							}
							if (buttons[0].link == "loseHp") {
								return get.effect(target, { name: "losehp" }, target, player);
							}
							return get.recoverEffect(target, player, player);
						},
					})
					.forResult();
				if (!result?.bool) {
					return;
				}
				player.setStorage(event.name, [], true);
				player.removeTip(event.name);
				const next = game.createEvent("removeFaluRecord", false);
				next.player = player;
				next.type = "diff";
				next.setContent("emptyEvent");
				await next;
				const [target] = result.targets,
					[link] = result.links;
				player.line(target, "green");
				await target[link](1, player);
			}
		},
		onremove(player, skill) {
			player.removeTip(skill);
			delete player.storage[skill];
		},
	},
	y_dc_zhenyi: {
		audio: "xinfu_zhenyi",
		trigger: { player: ["removeFaluRecord", "useCard"] },
		filter(event, player) {
			if (event.name == "useCard") {
				return player.getStorage("y_dc_zhenyi_record").includes(get.suit(event.card));
			}
			if (event.type == "diff") {
				return player.countMark("y_dc_zhenyi") < 4;
			}
			return !player.getStorage("y_dc_zhenyi_record").includes(event.suit);
		},
		intro: {
			mark(dialog, storage, player) {
				const list = player.getStorage("y_dc_zhenyi_record");
				if (list?.length) {
					dialog.addText(`使用${list.map(i => get.translation(i)).join("")}牌无距离限制且不可被响应`);
				}
				if (storage) {
					dialog.addText(`发动〖点化〗观看牌数+${storage}`);
				}
				if (!list?.length && !storage) {
					dialog.addText("未发动过〖真仪〗");
				}
			},
			markcount: (storage, player) => `${player.getStorage("y_dc_zhenyi_record").length}/${(storage || 0).toString()}`,
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				trigger.directHit.addArray(game.players);
			} else {
				if (trigger.type == "diff") {
					player.addMark(event.name, 1, false);
					player.addTip("y_dc_dianhua", "点化+" + player.countMark(event.name));
				} else {
					player.markAuto("y_dc_zhenyi_record", trigger.suit);
					player.storage["y_dc_zhenyi_record"].sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
					player.markSkill(event.name);
					player.addTip(event.name, "真仪" + player.storage["y_dc_zhenyi_record"].map(i => get.translation(i)).join(""));
				}
			}
		},
		ai: { combo: "y_dc_falu" },
		mod: {
			targetInRange(card, player) {
				if (player.getStorage("y_dc_zhenyi_record").includes(get.suit(card))) {
					return true;
				}
			},
		},
		onremove(player, skill) {
			player.removeTip(skill);
			player.removeTip("y_dc_dianhua");
			delete player.storage[skill];
			delete player.storage[skill + "_record"];
		},
	},
	y_dc_dianhua: {
		audio: "xinfu_dianhua",
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		frequent: true,
		async content(event, trigger, player) {
			const cards = get.cards(1 + player.countMark("y_dc_zhenyi"));
			const result = await player
				.chooseToMove(true)
				.set("list", [["牌堆顶", cards], ["获得"]])
				.set("prompt", "点化：获得一张牌，将其余牌以任意顺序放回牌堆顶")
				.set("filterOk", moved => {
					return moved[1].length == 1;
				})
				.set("filterMove", (from, to, moved) => {
					if (moved[0].includes(from.link)) {
						if (typeof to == "number") {
							return to == 0 || !moved[1].length;
						}
						return true;
					}
					if (typeof to == "number") {
						return to == 0;
					}
					return true;
				})
				.set("processAI", list => {
					const { player } = get.event();
					const cards = list[0][1].slice(0);
					if (cards?.length) {
						const card = cards.maxBy(card => get.value(card, player));
						return [cards.remove(card), [card]];
					}
					return [cards, []];
				})
				.forResult();
			if (result.bool && result.moved) {
				const top = result.moved[0].reverse(),
					gains = result.moved[1];
				if (top?.length) {
					for (let i = 0; i < top.length; i++) {
						ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
					}
				}
				if (gains?.length) {
					await player.gain(gains, "gain2");
				}
			}
		},
	},
	//任婉
	dcjuanji: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.getStorage("dcjuanji_used").length < 3 && event.juanji_record > 0;
		},
		onChooseToUse(event) {
			if (!game.online && !event.juanji_record) {
				const num = event.player.getStat("skill")["dcjuanji"] ?? 0;
				event.set("juanji_record", num + 1);
			}
		},
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog("狷急"),
					num = event.juanji_record;
				const list = [
					["damage", `令你与一名其他角色各回复${num}点体力，然后对你与其各造成${num}点伤害`],
					["discard", `弃置至多${num}名其他角色各一张牌，然后你翻面`],
					["draw", `摸${num}张牌，然后你弃置等量张牌`],
				];
				dialog.add([list, "textbutton"]);
				dialog.direct = true;
				return dialog;
			},
			filter(button, player) {
				if (player.getStorage("dcjuanji_used").includes(button.link)) {
					return false;
				}
				return (
					button.link == "draw" ||
					game.hasPlayer(current => {
						if (current == player) {
							return false;
						}
						return button.link == "damage" || current.countCards("he");
					})
				);
			},
			check(button) {
				const player = get.player(),
					num = get.event("juanji_record");
				switch (button.link) {
					case "damage": {
						let eff = current => {
							const recover = Math.min(current.getDamagedHp(), num);
							return recover * get.recoverEffect(current, player, player) + num * get.damageEffect(current, player, player);
						};
						const target = game.filterPlayer().maxBy(
							current => eff(current),
							current => current != player
						);
						return eff(player) + target ? eff(target) : 0;
					}
					case "discard": {
						const targets = game.filterPlayer(current => {
							return current != player && get.effect(current, { name: "guohe_copy2" }, player, player) > 0;
						});
						return Math.min(targets.length, num) * 0.2;
					}
					default: {
						return num * 0.3;
					}
				}
			},
			backup(links, player) {
				return {
					audio: "dcjuanji",
					numx: get.event("juanji_record"),
					choice: links[0],
					filterTarget(card, player, target) {
						const { choice } = get.info("dcjuanji_backup");
						switch (choice) {
							case "damage": {
								return true;
							}
							case "discard": {
								return target.countCards("he");
							}
							default: {
								return false;
							}
						}
					},
					selectTarget() {
						const { choice, numx } = get.info("dcjuanji_backup");
						switch (choice) {
							case "damage": {
								return 1;
							}
							case "discard": {
								return [1, numx];
							}
							default: {
								return -1;
							}
						}
					},
					multiline: true,
					multitarget: true,
					async content(event, trigger, player) {
						const { choice, numx } = get.info(event.name);
						player.addTempSkill("dcjuanji_used", "phaseChange");
						player.markAuto("dcjuanji_used", choice);
						switch (choice) {
							case "damage": {
								for (const method of ["recover", "damage"]) {
									for (const current of [player, ...event.targets]) {
										if (current.isIn()) {
											await current[method](numx);
										}
									}
								}
								break;
							}
							case "discard": {
								for (const target of event.targets) {
									await player.discardPlayerCard(target, "he", true);
								}
								await player.turnOver();
								break;
							}
							default: {
								await player.draw(numx);
								await player.chooseToDiscard("he", numx, true);
								break;
							}
						}
					},
					ai1() {
						return 1;
					},
					ai2(target) {
						const { choice, numx } = get.info("dcjuanji_backup"),
							player = get.player();
						switch (choice) {
							case "damage": {
								let eff = current => {
									const recover = Math.min(current.getDamagedHp(), numx);
									return recover * get.recoverEffect(current, player, player) + numx * get.damageEffect(current, player, player);
								};
								return eff(player) + eff(target);
							}
							case "discard": {
								return get.effect(target, { name: "guohe_copy2" }, player, player);
							}
							default: {
								return 1;
							}
						}
					},
				};
			},
			prompt(links, player) {
				const { choice, numx: num } = get.info("dcjuanji_backup");
				switch (choice) {
					case "damage": {
						return `令你与一名其他角色各回复${num}点体力，然后对你与其各造成${num}点伤害`;
					}
					case "discard": {
						return `弃置至多${num}名其他角色各一张牌，然后你翻面`;
					}
					default: {
						return `摸${num}张牌，然后你弃置等量张牌`;
					}
				}
			},
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			backup: {},
		},
	},
	dcrenshuang: {
		trigger: {
			player: ["changeHpAfter"],
		},
		audio: 2,
		forced: true,
		filter(event, player) {
			return player.hp == 1 && event.num != 0;
		},
		async content(event, trigger, player) {
			await player.link(false);
			await player.turnOver(false);
			const cards = get.inpileVCardList(info => {
				return info[0] == "trick" && player.hasUseTarget(info[2]) && !player.getStorage("dcrenshuang_used").includes(info[2]);
			});
			if (!cards?.length) {
				return;
			}
			const result = await player
				.chooseButton(["纫霜：选择要视为使用的牌", [cards, "vcard"]], true)
				.set("ai", button => {
					return get.player().getUseValue(button.link[2]);
				})
				.forResult();
			if (result?.bool) {
				player.addTempSkill("dcrenshuang_used", "roundStart");
				player.markAuto("dcrenshuang_used", result.links[0][2]);
				const card = new lib.element.VCard({ name: result.links[0][2] });
				if (player.hasUseTarget(card)) {
					await player.chooseUseTarget(card, true);
				}
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	old_dcjuanji: {
		trigger: {
			player: ["phaseUseBegin", "phaseDrawBegin", "phaseDiscardBegin"],
		},
		filter(event, player) {
			if (event.name == "phaseUse") {
				const card = new lib.element.VCard({ name: "sha" });
				return player.hasUseTarget(card, false);
			}
			if (event.name == "phaseDiscard") {
				return player.countCards("h") != player.getHandcardLimit();
			}
			return true;
		},
		audio: 2,
		async cost(event, trigger, player) {
			const name = trigger.name.slice(5);
			event.result =
				name == "Draw"
					? await player.chooseBool(get.prompt(event.skill)).set("prompt2", "摸体力上限张牌").forResult()
					: name == "Use"
					? await player
							.chooseTarget(get.prompt(event.skill))
							.set("prompt2", "失去1点体力并视为对一名角色使用一张【杀】")
							.set("filterTarget", (event, player, target) => {
								const card = new lib.element.VCard({ name: "sha" });
								return player.canUse(card, target, false);
							})
							.set("ai", target => {
								const card = new lib.element.VCard({ name: "sha" }),
									player = get.player(),
									eff1 = get.effect(target, card, player, player),
									eff2 = get.effect(player, { name: "losehp" }, player, player);
								return Math.max(0, eff1 - eff2);
							})
							.forResult()
					: await player
							.chooseCardTarget({
								filterCard(card, player) {
									const num = get.event("numx");
									return num > 0 && lib.filter.cardDiscardable(card, player, "dcjuanji");
								},
								prompt: get.prompt(event.skill),
								prompt2: "将手牌调整至手牌上限，然后弃置一名角色区域里至多两张牌",
								numx: player.countCards("h") - player.getHandcardLimit(),
								selectCard() {
									const num = get.event("numx");
									if (num > 0) {
										return num;
									}
									return -1;
								},
								filterTarget(card, player, target) {
									return player == target || target.countCards("hej");
								},
								ai1(card) {
									return 10 - get.value(card);
								},
								ai2(target) {
									const player = get.player();
									return get.effect(target, { name: "guohe" }, player, player);
								},
							})
							.forResult();
		},
		async content(event, trigger, player) {
			const name = trigger.name.slice(5);
			if (name == "Draw") {
				await player.draw(player.maxHp);
			} else if (name == "Use") {
				const {
					targets: [target],
				} = event;
				const card = new lib.element.VCard({ name: "sha" });
				await player.loseHp();
				await player.useCard(card, target, false);
			} else {
				const {
					cards,
					targets: [target],
				} = event;
				if (cards?.length) {
					await player.discard(cards);
				} else {
					await player.drawTo(player.getHandcardLimit());
				}
				if (target.countCards("hej")) {
					await player.discardPlayerCard(target, "hej", [1, 2], true);
				}
			}
		},
	},
	old_dcrenshuang: {
		trigger: {
			player: ["dying", "dyingAfter"],
		},
		audio: 2,
		filter(event, player, name) {
			if (name == "dyingAfter") {
				return player.isIn();
			}
			return game.getRoundHistory("everything", evt => evt.name == "dying" && evt.player == player).indexOf(event) == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername == "dying") {
				await player.recoverTo(1);
				if (player.getAllHistory("custom", evt => evt.dcrenshuang).length < 3) {
					player.getHistory("custom").push({
						dcrenshuang: true,
					});
					await player.gainMaxHp();
				}
			} else {
				await player.link(false);
				await player.turnOver(false);
				const cards = get.inpileVCardList(info => info[0] == "trick" && player.hasUseTarget(info[2]));
				if (!cards?.length) {
					return;
				}
				const result = await player
					.chooseButton(["纫霜：选择要视为使用的牌", [cards, "vcard"]], true)
					.set("ai", button => {
						return get.player().getUseValue(button.link[2]);
					})
					.forResult();
				if (result?.bool) {
					const card = new lib.element.VCard({ name: result.links[0][2] });
					if (player.hasUseTarget(card)) {
						await player.chooseUseTarget(card, true);
					}
				}
			}
		},
	},
	//谋姜维
	dcsbjuemou: {
		audio: 2,
		audioname: ["dc_sb_jiangwei_shadow"],
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			player.changeSkin({ characterName: "dc_sb_jiangwei" }, "dc_sb_jiangwei" + (player.storage[skill] ? "_shadow" : ""));
		},
		marktext: "☯",
		mark: true,
		intro: {
			content(storage, player) {
				if (!storage) {
					return `转换技，你使用锦囊牌时，${player.storage.dcsbjuemou_rewrite ? "或回合开始和结束时，" : ""}可对自己造成1点伤害并摸已损失体力值数张牌。`;
				}
				return `转换技，你使用锦囊牌时，${player.storage.dcsbjuemou_rewrite ? "或回合开始和结束时，" : ""}可令一名角色弃置另一名角色一张牌并受到其造成的1点伤害。`;
			},
		},
		trigger: {
			player: ["useCard", "phaseBegin", "phaseEnd"],
		},
		filter(event, player) {
			if (event.name == "useCard") {
				return get.type2(event.card) == "trick";
			}
			return player.storage.dcsbjuemou_rewrite;
		},
		async cost(event, trigger, player) {
			const storage = player.storage.dcsbjuemou;
			if (!storage) {
				event.result = await player
					.chooseBool(`###${get.prompt(event.skill)}###对自己造成1点伤害并摸已损失体力值张牌`)
					.set("ai", () => true)
					.forResult();
			} else {
				event.result = await player
					.chooseTarget(`###${get.prompt(event.skill)}###令一名角色弃置另一名角色一张牌并受到其造成的1点伤害`, 2, (card, player, target) => {
						const selected = ui.selected.targets;
						if (!selected.length) {
							return game.hasPlayer(targetx => targetx.countDiscardableCards(target, "he"));
						}
						return target.countDiscardableCards(selected[0], "he");
					})
					.set("complexTarget", true)
					.set("complexSelect", true)
					.set("targetprompt", ["受到伤害", "被弃牌"])
					.set("ai", target => {
						const selected = ui.selected.targets,
							player = get.player();
						if (!selected.length) {
							return Math.max(
								...game
									.filterPlayer(targetx => targetx.countDiscardableCards(target, "he"))
									.map(targetx => {
										return get.effect(targetx, { name: "guohe_copy2" }, target, player) + get.damageEffect(target, targetx, player);
									})
							);
						}
						return get.effect(selected[0], { name: "guohe_copy2" }, target, player) + get.damageEffect(target, selected[0], player);
					})
					.forResult();
			}
		},
		line: false,
		async content(event, trigger, player) {
			const storage = player.storage.dcsbjuemou;
			player.changeZhuanhuanji(event.name);
			if (!storage) {
				await player.damage();
				await player.draw(player.getDamagedHp());
			} else {
				const source = event.targets[0],
					target = event.targets[1];
				player.line2([source, target], "green");
				await source.discardPlayerCard(target, "he", true);
				await source.damage(target);
			}
		},
		ai: {
			threaten: 1.5,
		},
		group: ["dcsbjuemou_change", "dcsbjuemou_recover"],
		subSkill: {
			recover: {
				audio: "dcsbjuemou",
				audioname: ["dc_sb_jiangwei_shadow"],
				trigger: { player: "dying" },
				filter(event, player) {
					return event.reason?.name == "damage" && event.reason.getParent()?.name == "dcsbjuemou";
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.recoverTo(1);
				},
			},
			rewrite: {
				charlotte: true,
			},
			change: {
				audio: "dcsbjuemou",
				audioname: ["dc_sb_jiangwei_shadow"],
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【绝谋】为状态" + (player.storage.dcsbjuemou ? "阳" : "阴");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("dcsbjuemou");
				},
			},
		},
	},
	dcsbfuzhan: {
		derivation: ["dcsbjuemou_rewrite"],
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		trigger: { global: "dyingAfter" },
		filter(event, player) {
			return event.player.isIn();
		},
		check(event, player) {
			if (player.hp <= 2) {
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recoverTo(player.maxHp);
			player.storage.dcsbjuemou_rewrite = true;
			game.log(player, "修改了", "#g【绝谋】");
		},
	},
	//谋胡烈
	dcsbchuanyu: {
		trigger: { global: ["roundStart", "roundEnd"] },
		filter(event, player, name) {
			if (name == "roundStart") {
				return player.countCards("he");
			}
			return player.getStorage("dcsbchuanyu").some(target => target.isIn());
		},
		async cost(event, trigger, player) {
			if (event.triggername == "roundStart") {
				event.result = await player
					.chooseCardTarget({
						prompt: get.prompt(event.skill),
						prompt2: "将一张牌交给一名角色",
						filterCard: true,
						filterTarget: true,
						ai1(card) {
							return 1 / Math.max(0.1, get.value(card));
						},
						ai2(target) {
							var player = _status.event.player,
								att = get.attitude(player, target);
							if (target.hasSkillTag("nogain")) {
								att /= 9;
							}
							return 4 + att;
						},
					})
					.forResult();
			} else {
				event.result = await player
					.chooseTarget(`###${get.prompt(event.skill)}###本轮所有获得过「舆」的角色依次视为对你指定的一名角色使用【杀】(不限距离），然后弃置所有「舆」`)
					.set("ai", target => {
						return get.effect(target, { name: "sha" }, get.player(), get.player());
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (event.triggername == "roundStart") {
				if (!player.storage[event.name]) {
					player
						.when({ global: "roundStart" })
						.filter(evt => evt != trigger)
						.then(() => {
							player.unmarkSkill("dcsbchuanyu");
							delete player.storage.dcsbchuanyu;
						});
				}
				const {
					cards,
					targets: [target],
				} = event;
				player.line(target);
				player.markAuto(event.name, target);
				//player.markAuto(event.name+"_card",cards);
				if (target == player) {
					player.addGaintag(cards, event.name + "_tag");
				} else {
					await player.give(cards, target).set("gaintag", [event.name + "_tag"]);
				}
			} else {
				const use = player
						.getStorage("dcsbchuanyu")
						.filter(target => target.isIn())
						.sortBySeat(),
					card = get.autoViewAs({ name: "sha", isCard: true }),
					target = event.targets[0];
				while (use.length) {
					const source = use.shift();
					if (source.canUse(card, target, false, false)) {
						await source.useCard(card, target, false);
					}
				}
				const lose_list = [];
				game.players.forEach(target => {
					const cards = target.getCards("h", card => card.hasGaintag(event.name + "_tag"));
					if (cards.length) {
						lose_list.push([target, cards]);
					}
				});
				await game
					.loseAsync({
						lose_list: lose_list,
						discarder: player,
					})
					.setContent("discardMultiple");
			}
		},
		intro: {
			content: "本轮获得过「舆」的角色：$",
		},
		group: ["dcsbchuanyu_give"],
		subSkill: {
			give: {
				trigger: { global: ["cardsDiscardAfter"] },
				filter(event, player) {
					return lib.skill.dcsbchuanyu_give.getCards(event, player).length > 0 && game.hasPlayer(target => !player.getStorage("dcsbchuanyu").includes(target));
				},
				getCards(event, player) {
					const evt = event.getParent();
					if (evt.name !== "orderingDiscard") {
						return [];
					}
					const evt2 = evt.relatedEvent || evt.getParent();
					if (evt2.name != "useCard" || !event.getd?.()?.length) {
						return [];
					}
					const historys = game.getGlobalHistory("everything", evt => {
						if (evt.name != "lose" || evt.getParent() != evt2) {
							return false;
						}
						return Object.values(evt.gaintag_map).flat().includes("dcsbchuanyu_tag");
					});
					return event.getd().filter(card => {
						return historys.some(evt => evt.gaintag_map[card.cardid].includes("dcsbchuanyu_tag"));
					});
				},
				async cost(event, trigger, player) {
					const cards = lib.skill.dcsbchuanyu_give.getCards(trigger, player);
					event.result = await player
						.chooseTarget(`###${get.prompt(event.skill)}###将${get.translation(cards)}交给本轮未获得过「舆」的一名角色`, (card, player, target) => {
							return !player.getStorage("dcsbchuanyu").includes(target);
						})
						.set("ai", target => {
							const player = get.player(),
								val = get.event().val;
							if (val > 5) {
								return get.attitude(player, target);
							}
							return -get.attitude(player, target);
						})
						.set("val", Math.max(...cards.map(card => get.value(card))))
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0],
						cards = lib.skill.dcsbchuanyu_give.getCards(trigger, player);
					player.markAuto("dcsbchuanyu", target);
					await target.gain(cards, "gain2").set("gaintag", ["dcsbchuanyu_tag"]);
				},
			},
		},
	},
	dcsbyitou: {
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player != player && event.player.isMaxHandcard() && player.countCards("h");
		},
		check(event, player) {
			if (player.countCards("h", card => get.value(card) - 5) < 1) {
				return true;
			}
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			player.addTempSkill(event.name + "_effect");
			player.markAuto(event.name + "_effect", target);
			await player.give(player.getCards("h"), target);
		},
		subSkill: {
			effect: {
				onremove: true,
				charlotte: true,
				forced: true,
				trigger: { global: "damageSource" },
				filter(event, player) {
					return player.getStorage("dcsbyitou_effect").includes(event.source);
				},
				async content(event, trigger, player) {
					await player.draw();
				},
				intro: {
					content: "players",
				},
			},
		},
	},
	//崔令仪
	dchuashang: {
		audio: 2,
		group: ["dchuashang_gaoda", "dchuashang_init"],
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			const suit = get.suit(event.card);
			return player.countCards("h", card => get.suit(card, player) == suit && get.type(card, player) != "equip");
		},
		async cost(event, trigger, player) {
			const equips = [],
				suit = get.suit(trigger.card),
				cards = player.getCards("h", card => get.suit(card, player) == suit && get.type(card, player) != "equip");
			for (let i = 1; i < 6; i++) {
				if (!player.hasEquipableSlot(i)) {
					continue;
				}
				equips.push([i, get.translation("equip" + i)]);
			}
			if (!equips.length) {
				return;
			}
			const result = await player
				.chooseButton([`###${get.prompt(event.skill)}###<div class="text center">你可将一张相同花色的非装备手牌置入你的装备区</div>`, [equips, "tdnodes"], cards], 2)
				.set("filterButton", button => {
					if (ui.selected.buttons.length && typeof button.link == typeof ui.selected.buttons[0].link) {
						return false;
					}
					return true;
				})
				.set("ai", button => {
					const player = get.player(),
						suits = player
							.getCards("e")
							.map(card => get.suit(card))
							.unique(),
						suit = get.suit(get.event().getTrigger().card);
					if (typeof button.link == "number") {
						const card = player.getEquips(button.link);
						if (card) {
							const val = get.value(card);
							if (val > 0) {
								return 0;
							}
							return 5 - val;
						}
						switch (button.link) {
							case 3:
								return 4.5;
							case 4:
								return 4.4;
							case 5:
								return 4.3;
							case 2:
								return 3.1;
							case 1: {
								return 3.2;
							}
						}
					} else {
						if (suits.includes(suit)) {
							return 0;
						}
						return 7 - get.value(button.link);
					}
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				const links = result.links;
				if (typeof links[1] == "number") {
					links.reverse();
				}
				event.result = {
					bool: true,
					cost_data: {
						slot: links[0],
						card: links[1],
					},
				};
			}
		},
		async content(event, trigger, player) {
			const slot = event.cost_data.slot,
				card = event.cost_data.card;
			const cardx = get.autoViewAs(card);
			cardx.subtypes = [`equip${slot}`];
			await player.equip(cardx);
		},
		subSkill: {
			init: {
				audio: "dchuashang",
				forced: true,
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async content(event, trigger, player) {
					const colors = Object.keys(lib.color);
					for (const color of colors) {
						const card = get.cardPile(cardx => get.color(cardx) == color);
						if (card) {
							const choices = [];
							for (let i = 0; i <= 5; i++) {
								if (player.hasEquipableSlot(i)) {
									choices.push(`equip${i}`);
								}
							}
							if (!choices.length) {
								break;
							}
							const result = await player
								.chooseControl(choices)
								.set("prompt", `将${get.translation(card)}置入你的一个装备栏`)
								.set("slots", choices)
								.set("ai", () => {
									const player = get.player();
									const func = slot => {
										const num = parseInt(slot.slice(5));
										const card = player.getEquips(num)[0];
										if (card) {
											return 0;
										}
										switch (num) {
											case 3:
												return 4.5;
											case 4:
												return 4.4;
											case 5:
												return 4.3;
											case 2:
												return 3.1;
											case 1: {
												return 3.2;
											}
										}
									};
									const slots = get.event().slots.sort((a, b) => func(b) - func(a));
									return slots[0];
								})
								.forResult();
							if (result?.control) {
								const slot = result.control;
								const cardx = get.autoViewAs(card);
								cardx.subtypes = [slot];
								await player.equip(cardx);
							}
						}
					}
				},
			},
			gaoda: {
				audio: "dchuashang",
				forced: true,
				locked: false,
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					const num = player
						.getCards("e")
						.map(card => get.suit(card))
						.unique().length;
					if (event.getg?.(player)?.length) {
						return player.countCards("h") < num;
					}
					var evt = event.getl(player);
					if (!evt || !evt.hs || evt.hs.length == 0 || player.countCards("h") >= num) {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					const num = player
						.getCards("e")
						.map(card => get.suit(card))
						.unique().length;
					await player.drawTo(num);
				},
				ai: {
					noh: true,
					skillTagFilter(player, tag) {
						if (
							tag == "noh" &&
							player
								.getCards("e")
								.map(card => get.suit(card))
								.unique().length < player.countCards("h")
						) {
							return false;
						}
					},
				},
			},
		},
	},
	dcyuzhi: {
		audio: 2,
		forced: true,
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			return event.card.name == "sha" && player.countCards("e");
		},
		async content(event, trigger, player) {
			let result;
			const choices = [],
				num = player.countCards("e", card => get.type(card) != "equip");
			if (!player.hasSkill("dcyuzhi_delete") && player.countDiscardableCards(player, "e")) {
				choices.push(`弃置一张装备区内的牌并失去此选项至本轮结束`);
			}
			choices.push(`此【杀】伤害+${num}`);
			if (choices.length == 1) {
				result = { index: 1 };
			} else {
				result = await player
					.chooseControl()
					.set("choiceList", choices)
					.set("choice", num > 0 && (!player.hasShan("use") || trigger.getParent().directHit?.includes(player)) ? 0 : 1)
					.forResult();
			}
			if (result?.index == 0) {
				player.addTempSkill("dcyuzhi_delete", "roundEnd");
				await player.chooseToDiscard("e", true);
			} else if (result?.index == 1) {
				game.log(trigger.card, "伤害+", "#y", num);
				trigger.getParent().baseDamage++;
			}
		},
		ai: {
			neg: true,
		},
		subSkill: {
			delete: {
				charlotte: true,
			},
		},
	},
	//吴质
	dcweiti: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		async content(event, trigger, player) {
			const target = event.target;
			const result = await target
				.chooseControl("受到伤害", "回复体力")
				.set("prompt", "伪涕：请选择一项")
				.set("choiceList", ["受到1点伤害，然后获得两张点数与你所有手牌均不同的牌", "回复1点体力，然后弃置两张点数不相同的牌"])
				.set("ai", () => {
					const player = get.player();
					let eff1 = get.recoverEffect(player, player) - Math.min(2, player.countCards("he")),
						eff2 = 2 + get.damageEffect(player, player);
					return eff1 > eff2 ? "回复体力" : "受到伤害";
				})
				.forResult();
			if (result.control == "受到伤害") {
				await target.damage();
				const nums = target.getCards("h").map(card => get.number(card, target));
				let cards = [];
				while (cards.length < 2) {
					const card = get.cardPile2(card => !nums.includes(get.number(card, target)) && !cards.includes(card));
					if (card) {
						cards.push(card);
					} else {
						break;
					}
				}
				if (cards.length) {
					await target.gain(cards, "gain2");
				}
			} else {
				await target.recover();
				const num = Math.min(
					2,
					target
						.getCards("h")
						.map(card => get.number(card, target))
						.toUniqued().length
				);
				await target
					.chooseToDiscard(num, true, `弃置${get.cnNumber(num)}张点数不同的牌`, "he")
					.set("filterCard", card => {
						const player = get.player();
						return !ui.selected.cards?.some(cardx => get.number(cardx, player) == get.number(card, player));
					})
					.set("complexCard", true);
			}
		},
		ai: {
			order: 1,
			result: {
				target: 1,
			},
		},
	},
	dcyuanrong: {
		trigger: {
			player: "phaseEnd",
		},
		filter(event, player) {
			if (!player.getHistory("lose").length) {
				return false;
			}
			let cardsLost = [];
			game.getGlobalHistory("cardMove", evt => {
				if (evt.name === "cardsDiscard" || (evt.name === "lose" && evt.position === ui.discardPile)) {
					cardsLost.addArray(evt.cards);
				}
			});
			cardsLost = cardsLost.filterInD("d");
			return cardsLost.some(card => get.color(card) == "black");
		},
		async cost(event, trigger, player) {
			let cardsLost = [];
			game.getGlobalHistory("cardMove", evt => {
				if (evt.name === "cardsDiscard" || (evt.name === "lose" && evt.position === ui.discardPile)) {
					cardsLost.addArray(evt.cards);
				}
			});
			cardsLost = cardsLost.filterInD("d").filter(card => get.color(card) == "black");
			let cards = get.inpileVCardList(info => {
				if (get.type(info[2]) != "trick") {
					return false;
				}
				return cardsLost.some(card => {
					const cardx = get.autoViewAs({ name: info[2] }, [card]);
					return player.hasUseTarget(cardx, true, true);
				});
			});
			if (!cards.length) {
				return;
			}
			const result = await player
				.chooseButton([`###${get.prompt(event.skill)}###弃牌堆`, cardsLost, "###可转化锦囊牌###", [cards, "vcard"]], 2)
				.set("filterButton", button => {
					if (!Array.isArray(button.link)) {
						return ui.selected.buttons.length == 0;
					}
					if (ui.selected.buttons.length != 1) {
						return false;
					}
					const cardx = get.autoViewAs(
						{ name: button.link[2] },
						ui.selected.buttons.map(i => i.link)
					);
					return get.player().hasUseTarget(cardx, true, true) && ui.selected.buttons.length;
				})
				.set("complexButton", true)
				.set("ai", button => {
					if (ui.selected.buttons.length == 0) {
						return Math.random();
					}
					if (!Array.isArray(button.link)) {
						return 0;
					}
					const cardx = get.autoViewAs({ name: button.link[2] });
					return get.player().getUseValue(cardx, true, true);
				})
				.forResult();
			event.result = {
				bool: result.bool,
				cards: [result?.links?.[0]],
				cost_data: result?.links?.[1][2],
			};
		},
		async content(event, trigger, player) {
			const { cards, cost_data: name } = event;
			const card = get.autoViewAs({ name: name }, cards);
			if (player.hasUseTarget(card, true, true)) {
				await player.chooseUseTarget(card, true, cards);
			}
			let cardsLost = [];
			game.getGlobalHistory("cardMove", evt => {
				if (evt.name === "cardsDiscard" || (evt.name === "lose" && evt.position === ui.discardPile)) {
					cardsLost.addArray(evt.cards);
				}
			});
			cardsLost = cardsLost.filterInD("d").filter(card => get.color(card) == "red");
			let cardxs = get.inpileVCardList(info => {
				if (get.type(info[2]) != "basic") {
					return false;
				}
				return cardsLost.some(card => {
					const cardx = get.autoViewAs({ name: info[2], nature: info[3] }, [card]);
					return player.hasUseTarget(cardx, true, true);
				});
			});
			if (!cardxs.length) {
				return;
			}
			let bcard, btarget;
			if (cardsLost.length == 1 && cardxs.length == 1) {
				bcard = cardsLost;
				btarget = cardxs[0];
			} else {
				const result = await player
					.chooseButton([`###圆融：将一张红色牌当基本牌使用###弃牌堆`, cardsLost, "###可转化基本牌###", [cardxs, "vcard"]], 2, true)
					.set("filterButton", button => {
						if (!Array.isArray(button.link)) {
							return ui.selected.buttons.length == 0;
						}
						if (ui.selected.buttons.length != 1) {
							return false;
						}
						const cardx = get.autoViewAs(
							{ name: button.link[2], nature: button.link[3] },
							ui.selected.buttons.map(i => i.link)
						);
						return player.hasUseTarget(cardx, true, true) && ui.selected.buttons.length;
					})
					.set("complexButton", true)
					.set("ai", button => {
						if (ui.selected.buttons.length == 0) {
							return Math.random();
						}
						if (!Array.isArray(button.link)) {
							return 0;
						}
						const cardx = get.autoViewAs({ name: button.link[2] });
						return player.getUseValue(cardx, true, true);
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				bcard = [result.links[0]];
				btarget = result.links[1];
			}
			const cardx = get.autoViewAs({ name: btarget[2], nature: btarget[3] }, bcard);
			if (player.hasUseTarget(cardx, true, true)) {
				await player.chooseUseTarget(cardx, true, bcard);
			}
		},
	},
	//朱铄
	dczsshuhe: {
		audio: 2,
		trigger: {
			global: "useCard",
		},
		usable: 1,
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			return get.tag(event.card, "damage");
		},
		logTarget: "player",
		check(event, player) {
			if (get.attitude(player, event.player) > 0) {
				return true;
			}
			let eff = 2;
			if (event.targets) {
				for (let target of event.targets) {
					eff += get.effect(target, event.card, event.player, player);
				}
			}
			return eff <= 0;
		},
		async content(event, trigger, player) {
			const card = get.cardPile2(card => card.name == "jiu");
			if (card) {
				await player.gain(card, "gain2");
			}
			let eff = -1;
			if (trigger.targets) {
				for (let target of trigger.targets) {
					eff += get.effect(target, trigger.card, trigger.player, trigger.player);
				}
			}
			const result = await trigger.player
				.chooseBool()
				.set("prompt", "疏和")
				.set("prompt2", `令${get.translation(trigger.card)}无效并视为使用一张【酒】，或点取消令${get.translation(player)}摸一张牌`)
				.set("choice", eff < 0)
				.forResult();
			if (result.bool) {
				trigger.targets.length = 0;
				trigger.all_excluded = true;
				game.log(trigger.card, "被无效了");
				const card = { name: "jiu", isCard: true };
				if (trigger.player.hasUseTarget(card)) {
					const next = trigger.player.chooseUseTarget(card, false, true);
					event.next.remove(next);
					trigger.after.push(next);
				}
			} else {
				await player.draw();
			}
		},
	},
	dcjilie: {
		audio: 2,
		enable: "phaseUse",
		filterCard(card, player) {
			return true;
			//return !ui.selected.cards.some(cardx => get.suit(cardx, player) == get.suit(card, player));
		},
		position: "he",
		selectCard() {
			return get.player().getHp();
		},
		complexCard: true,
		complexSelect: true,
		usable: 1,
		filter(event, player) {
			return player.getHp() > 0 && player.countCards("he") >= player.getHp();
		},
		check(card) {
			const player = get.player(),
				value = get.value(card);
			if (ui.selected.cards?.some(cardx => get.suit(cardx, player) == get.suit(card, player))) {
				return 3 - value;
			}
			return 7 - value;
		},
		async content(event, trigger, player) {
			let num = event.cards.map(i => get.suit(i, player)).toUniqued().length * 2;
			while (num > 0) {
				num--;
				const judgeEvent = player.judge(card => (card.name == "sha" ? 10 : -1));
				judgeEvent.set("callback", async event => {
					if (event.card.name == "sha" && player.hasUseTarget(event.card, false)) {
						const next = player.chooseUseTarget(event.card, false, "nodistance");
						next.set("oncard", () => {
							_status.event.baseDamage += player.getHistory("useCard", evt => evt.card.name == "sha").length;
						});
						await next;
					}
				});
				await judgeEvent;
			}
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	//威曹丕
	dcdianlun: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countDiscardableCards(player, "h");
		},
		filterCard: lib.filter.cardDiscardable,
		selectCard: [1, Infinity],
		filterOk() {
			const cards = ui.selected?.cards,
				player = get.player();
			if (!cards?.length || cards?.length < 3) {
				return true;
			}
			let nums = cards
				.map(card => get.number(card, player))
				//.unique()
				.sort((a, b) => b - a);
			nums = nums
				.map((num, index) => {
					if (nums[index + 1]) {
						return num - nums[index + 1];
					}
					return nums[index - 1] - num;
				})
				.unique();
			return nums.length == 1;
		},
		check(card) {
			return 7 - get.value(card);
		},
		async content(event, trigger, player) {
			let num = event.cards?.length;
			if (player.hasSkill(event.name + "_double")) {
				num *= 2;
			}
			player.addTempSkill(event.name + "_effect");
			const next = player.draw(num);
			next.gaintag.add(event.name);
			await next;
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
		subSkill: {
			effect: {
				onremove(player) {
					player.removeGaintag("dcdianlun");
				},
				charlotte: true,
				forced: true,
				popup: false,
				mod: {
					cardUsable(card) {
						if (get.number(card) === "unsure" || card.cards?.some(card => card.hasGaintag("dcdianlun"))) {
							return Infinity;
						}
					},
					targetInRange(card) {
						if (get.number(card) === "unsure" || card.cards?.some(card => card.hasGaintag("dcdianlun"))) {
							return true;
						}
					},
				},
				trigger: {
					player: "useCard1",
				},
				filter(event, player) {
					return (
						event.addCount !== false &&
						player.hasHistory("lose", evt => {
							if ((evt.relatedEvent || evt.getParent()) !== event) {
								return false;
							}
							return Object.values(evt.gaintag_map).flat().includes("dcdianlun");
						})
					);
				},
				firstDo: true,
				content() {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] === "number") {
						stat[name]--;
					}
				},
			},
			double: { charlotte: true },
		},
	},
	dcjiwei: {
		audio: 2,
		global: ["dcjiwei_global"],
		subSkill: {
			global: {
				enable: "phaseUse",
				filter(event, player) {
					return player.group == "wei" && game.hasPlayer(target => target != player && target.hasSkill("dcjiwei"));
				},
				filterCard: true,
				filterTarget(card, player, target) {
					return target != player && target.hasSkill("dcjiwei");
				},
				lose: false,
				discard: false,
				delay: false,
				log: false,
				line: false,
				usable: 1,
				check(card) {
					return 6 - get.value(card);
				},
				async precontent(event, trigger, player) {
					event.result.targets[0].logSkill("dcjiwei", player);
				},
				prompt: `交给拥有〖极威〗的角色一张手牌，然后其可令你发动一次至多弃置三张牌的〖典论〗`,
				async content(event, trigger, player) {
					const cards = event.cards,
						target = event.targets[0];
					await player.give(cards, target);
					const result1 = await target
						.chooseBool(`极威：是否令${get.translation(player)}发动一次至多弃置三张牌的〖典论〗`)
						.set("ai", () => get.attitude(get.player(), get.event().getParent().player) > 0)
						.forResult();
					if (!result1?.bool) {
						target.popup("拒绝");
						return;
					}
					target.popup("同意");
					const result2 = await player
						.chooseToDiscard(`###典论###${lib.translate["dcdianlun_infox"]}`, [1, 3], true, "chooseonly")
						.set("filterOk", get.info("dcdianlun").filterOk)
						.set("ai", card => 6 - get.value(card))
						.forResult();
					if (result2?.bool && result2.cards?.length) {
						await player.useSkill("dcdianlun", result2.cards);
					}
				},
				ai: {
					order: 7,
					result: {
						target: 1,
					},
				},
			},
		},
	},
	dcsugang: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		async content(event, trigger, player) {
			const result = await player
				.judge()
				.set("callback", () => {
					const player = get.event().getParent(2).player,
						card = get.event().judgeResult.card;
					if (get.position(card, true) == "o") {
						player.gain(card, "gain2").gaintag.add("dcsugang_viewAs");
					}
					player.when({ global: "phaseAfter" }).then(() => {
						player.removeGaintag("dcsugang_viewAs");
					});
				})
				.forResult();
			if (!result?.card) {
				return;
			}
			const card = result.card,
				num = get.number(card);
			const resultx = await player
				.chooseButton(
					[
						`肃纲：请选择至多两项`,
						[
							[
								["viewAs", `${get.translation(card)}本回合可以当任意伤害牌使用`],
								["debuff", `展示一张手牌，然后本回合所有角色均只能使用${get.translation(card)}与展示牌点数之间的手牌`],
								["buff", `本回合获得〖行殇〗且〖典论〗中的“等量”改为“两倍”`],
							],
							"textbutton",
						],
					],
					true,
					[1, 2]
				)
				.set("ai", button => {
					switch (button.link) {
						case "viewAs":
						case "buff":
							return 5 + Math.random();
						case "debuff":
							return 10;
					}
				})
				.forResult();
			if (resultx?.links?.length) {
				const links = resultx.links,
					skill = event.name;
				if (links.includes("viewAs")) {
					game.log(player, "选择了", "#y选项一");
					player.addTempSkill(skill + "_viewAs");
				}
				if (links.includes("debuff")) {
					game.log(player, "选择了", "#y选项二");
					if (!player.countCards("h")) {
						return;
					}
					const resulty = await player
						.chooseCard(`肃纲：请展示一张手牌`, true)
						.set("num", num)
						.set("ai", card => {
							return -Math.abs(get.number(card, get.player()) - get.event().num);
						})
						.forResult();
					if (!resulty?.cards) {
						return;
					}
					const cardx = resulty.cards[0],
						name = skill + "_debuff";
					await player.showCards(cardx, `${get.translation(player)}发动【肃纲】展示的牌`);
					const range = [num, get.number(cardx, player)].sort((a, b) => a - b);
					player.line(game.filterPlayer(), "yellow");
					for (const target of game.filterPlayer()) {
						let storage = target.getStorage(name);
						if (!storage.length) {
							storage = range;
						} else {
							storage = storage
								.concat(range)
								.sort((a, b) => a - b)
								.slice(1, 3);
						}
						target.setStorage(name, storage);
						target.addTempSkill(name);
					}
				}
				if (links.includes("buff")) {
					game.log(player, "选择了", "#y选项三");
					await player.addTempSkills(["rexingshang"]);
					player.addTempSkill("dcdianlun_double");
				}
			}
		},
		derivation: "rexingshang",
		subSkill: {
			viewAs: {
				enable: "phaseUse",
				filter(event, player) {
					return player.countCards("h", card => card.hasGaintag("dcsugang_viewAs")) > 0;
				},
				chooseButton: {
					dialog(event, player) {
						const list = get.inpileVCardList(info => {
							return get.tag({ name: info[2] }, "damage") > 0.5;
						});
						return ui.create.dialog("肃纲", [list, "vcard"]);
					},
					filter(button, player) {
						return get
							.event()
							.getParent()
							.filterCard(get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure"), player, get.event().getParent());
					},
					check(button) {
						var player = get.player();
						if (player.countCards("hs", button.link[2]) > 0) {
							return 0;
						}
						var effect = player.getUseValue(button.link[2]);
						if (effect > 0) {
							return effect;
						}
						return 0;
					},
					backup(links, player) {
						return {
							// filterCard: true,
							audio: "dcsugang",
							filterCard: card => card.hasGaintag("dcsugang_viewAs"),
							popname: true,
							check(card) {
								return 7 - get.value(card);
							},
							viewAs: { name: links[0][2], nature: links[0][3] },
						};
					},
					prompt(links, player) {
						return "将「肃纲」牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
					},
				},
				ai: {
					order: 7,
					result: {
						player: 1,
					},
				},
			},
			debuff: {
				charlotte: true,
				mark: true,
				intro: {
					markcount(storage, player) {
						if (!storage) {
							return;
						}
						return `${get.strNumber(storage[0])}${get.strNumber(storage[1])}`;
					},
					content(storage, player) {
						if (!storage) {
							return `无事发生`;
						}
						return `只能使用点数在[${storage[0]},${storage[1]}]区间的手牌`;
					},
				},
				onremove: true,
				mod: {
					cardEnabled(card, player) {
						const num = get.number(card, player),
							range = player.storage["dcsugang_debuff"],
							hs = player.getCards("h"),
							cards = card.cards;
						if (num === "unsure" || !range?.length) {
							return;
						}
						if (!cards?.length || cards?.some(cardx => !hs.includes(cardx))) {
							return false;
						}
						if (!cards.some(cardx => !cardx.hasGaintag("dcdianlun"))) {
							return;
						}
						if (typeof num != "number" || num < range[0] || num > range[1]) {
							return false;
						}
					},
					cardSavable(card, player) {
						const num = get.number(card, player),
							range = player.storage["dcsugang_debuff"],
							hs = player.getCards("h"),
							cards = card.cards;
						if (num === "unsure" || !range?.length) {
							return;
						}
						if (!cards?.length || cards?.some(cardx => !hs.includes(cardx))) {
							return false;
						}
						if (!cards.some(cardx => !cardx.hasGaintag("dcdianlun"))) {
							return;
						}
						if (typeof num != "number" || num < range[0] || num > range[1]) {
							return false;
						}
					},
				},
			},
		},
	},
	//钟毓
	dczhidui: {
		audio: 2,
		init(player) {
			player.addSkill("dczhidui_mark");
		},
		onremove(player) {
			player.removeSkill("dczhidui_mark");
		},
		trigger: { player: "useCard" },
		filter(event, player) {
			const history = game.getAllGlobalHistory("useCard"),
				index = history.indexOf(event);
			return index >= 1;
		},
		async cost(event, trigger, player) {
			const history = game.getAllGlobalHistory("useCard"),
				index = history.indexOf(trigger);
			if (index < 1) {
				return;
			}
			const bool1 = get.cardNameLength(trigger.card) === get.cardNameLength(history[index - 1].card);
			const bool2 = get.type2(trigger.card) === get.type2(history[index - 1].card);
			if (bool1 && bool2) {
				const result = await player
					.chooseButton([
						get.prompt2(event.skill),
						[
							[
								["draw", `摸两张牌`],
								["noCount", `令${get.translation(trigger.card)}不计入次数`],
							],
							"textbutton",
						],
					])
					.set("ai", button => {
						if (button.link == "draw") {
							return 2;
						}
						if (button.link == "noCount") {
							const usable = get.player().getCardUsable(get.event().getTrigger().card);
							if (usable > 0) {
								return 1.5;
							}
							return 2.5;
						}
					})
					.forResult();
				if (result?.links?.length) {
					event.result = {
						bool: true,
						cost_data: result.links[0],
					};
				}
			} else if (!bool1 && !bool2) {
				event.result = {
					bool: true,
					cost_data: "tempBan",
				};
			}
		},
		async content(event, trigger, player) {
			const link = event.cost_data;
			if (link == "draw") {
				await player.draw(2);
			}
			if (link == "noCount") {
				if (trigger.addCount !== false) {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] === "number") {
						stat[name]--;
					}
				}
			}
			if (link == "tempBan") {
				player.tempBanSkill(event.name);
			}
		},
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object") {
					var history = game.getAllGlobalHistory("useCard");
					if (!history.length) {
						return;
					}
					var evt = history[history.length - 1];
					if (evt?.card && get.cardNameLength(evt.card) == get.cardNameLength(card) && get.type(evt.card) == get.type2(card)) {
						return num + 4;
					}
				}
			},
		},
		subSkill: {
			mark: {
				charlotte: true,
				init(player, skill) {
					const history = game.getAllGlobalHistory("useCard"),
						length = history.length;
					if (!length) {
						return;
					}
					const card = history[length - 1].card;
					player.storage[skill] = card;
					player.markSkill(skill);
					game.broadcastAll(
						function (player, type) {
							if (player.marks.dczhidui_mark) {
								player.marks.dczhidui_mark.firstChild.innerHTML = get.translation(type).slice(0, 1);
							}
						},
						player,
						get.type2(card)
					);
					//player.addTip(skill,get.translation(skill)+`  ${get.translation(get.type2(card))}${get.cardNameLength(card)}`);
				},
				onremove(player, skill) {
					delete player.storage[skill];
					//player.removeTip(skill);
				},
				intro: {
					markcount(storage, player) {
						return get.cardNameLength(storage);
					},
					content(storage, player) {
						let str = "";
						str += `<li>类型：${get.translation(get.type2(storage))}`;
						str += `<br><li>牌名字数：${get.cardNameLength(storage)}`;
						return str;
					},
				},
				silent: true,
				trigger: { global: "useCard1" },
				content() {
					lib.skill[event.name].init(player, event.name);
				},
			},
		},
	},
	dcjiesi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		onChooseToUse(event) {
			if (!game.online && !event.dcjiesi) {
				event.set(
					"dcjiesi",
					["cardPile", "discardPile"]
						.map(pos => Array.from(ui[pos].childNodes))
						.flat()
						.map(card => get.cardNameLength(card))
						.unique()
						.sort()
				);
			}
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###捷思###", get.translation("dcjiesi_info"));
			},
			chooseControl(event, player) {
				const list = event.dcjiesi.slice();
				list.push("cancel2");
				return list;
			},
			check(event, player) {
				const sortlist = [4, 1, 2, 3, 5];
				const list = event.dcjiesi.slice();
				return (
					list.sort((a, b) => {
						return sortlist.indexOf(a) - sortlist.indexOf(b);
					})[0] - 1
				);
			},
			backup(result, player) {
				return {
					audio: "dcjiesi",
					async content(event, trigger, player) {
						const len = result.control;
						const card = get.cardPile(cardx => get.cardNameLength(cardx) == len);
						if (!card) {
							player.chat(`一张${num}字牌都没有？！`);
							return;
						}
						await player.gain(card, "gain2");
						const skill = "dcjiesi_used";
						player.addTempSkill(skill, "phaseUseAfter");
						const bool = !player.getStorage(skill).some(cardx => cardx.name == card.name);
						player.markAuto(skill, card);
						if (bool) {
							const result = await player
								.chooseToDiscard(`捷思：是否弃置${len}张牌，然后重置此技能？`, len, "he")
								.set("ai", card => (get.event().goon ? 6.5 - get.value(card) : 0))
								.set("goon", player.countCards("he", card => 6 - get.value(card)) >= len)
								.forResult();
							if (result?.bool) {
								delete player.getStat().skill.dcjiesi;
							}
						}
					},
				};
			},
		},
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object") {
					if (get.type(card) == "equip") {
						return num - 3;
					}
				}
			},
		},
		subSkill: {
			backup: {},
			used: {
				charlotte: true,
				onremove: true,
				intro: {
					content: storage => "获得过的牌名：" + storage.map(card => get.translation(card.name)).unique(),
				},
			},
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
	},
	//夏侯徽
	dcdujun: {
		audio: 2,
		trigger: {
			global: ["damageSource", "damageEnd"],
		},
		filter(event, player, name) {
			const key = name == "damageSource" ? "sourceDamage" : "damage",
				targets = [player, player.storage?.dcdujun],
				target = name == "damageSource" ? event.source : event.player;
			if (targets.includes(target)) {
				return target.getHistory(key, evt => evt.num > 0).indexOf(event) == 0;
			}
		},
		prompt2: "摸2张牌，然后可以将这些牌交给一名角色",
		check: () => true,
		//frequent:true,
		async content(event, trigger, player) {
			const cards = await player.draw(2).forResult();
			if (get.itemtype(cards) != "cards") {
				return;
			}
			const result = await player
				.chooseTarget(`笃君：可以将${get.translation(cards)}交给一名角色`)
				.set("ai", target => {
					const att = get.sgnAttitude(get.player(), target),
						cards = get.event().cardsx;
					return att * cards.reduce((sum, card) => sum + get.value(card, target), 0);
				})
				.set("cardsx", cards)
				.forResult();
			if (result?.targets) {
				const target = result.targets[0];
				if (player == target) {
					return;
				}
				player.line(target);
				await player.give(cards, target);
			}
		},
		intro: {
			content: "player",
		},
		group: ["dcdujun_init"],
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "<span class=thundertext>$</span>不能响应你使用的牌",
				},
				trigger: {
					player: "useCard1",
				},
				forced: true,
				popup: false,
				content() {
					trigger.directHit.addArray(player.getStorage(event.name));
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return player.storage.dcdujun_effect.includes(arg.target);
					},
				},
			},
			init: {
				audio: "dcdujun",
				trigger: {
					player: "enterGame",
					global: "phaseBefore",
				},
				filter(event, player) {
					return (event.name != "phase" || game.phaseNumber == 0) && game.hasPlayer(target => target != player);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(`笃君：请选择一名其他角色作为你的“夫君”`, true, lib.filter.notMe)
						.set("ai", target => get.attitude(get.player(), target))
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0],
						skill = "dcdujun";
					player.storage[skill] = target;
					player.markSkill(skill);
					target.addSkill(skill + "_effect");
					target.markAuto(skill + "_effect", player);
				},
			},
		},
	},
	dcjikun: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["addToExpansionAfter", "gainAfter", "addJudgeAfter", "loseAsyncAfter", "equipAfter"],
		},
		filter(event, player) {
			return event.dcjikun_count > 0;
		},
		getIndex(event, player) {
			return event.dcjikun_count;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const selected = ui.selected?.targets;
					if (!selected?.length) {
						return get.attitude(get.player(), target);
					}
					return get.effect(target, { name: "shunshou_copy2" }, selected[0], get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const gainer = event.targets[0],
				targets = game.filterPlayer(target => target.isMaxHandcard()).sortBySeat();
			gainer.line(targets);
			for (const gainee of targets) {
				const card = gainee.getGainableCards(gainer, "he").randomGet();
				await gainer.gain(card, gainee, "giveAuto", "bySelf");
			}
		},
		init(player, skill) {
			player.addSkill(skill + "_mark");
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_mark");
		},
		subSkill: {
			mark: {
				charlotte: true,
				onremove: true,
				silent: true,
				trigger: {
					player: "loseEnd",
					global: ["addToExpansionEnd", "gainEnd", "addJudgeEnd", "loseAsyncEnd", "equipEnd"],
				},
				content() {
					const evt = trigger.getl(player);
					if (!evt?.cards2?.length) {
						return;
					}
					const prev = player.countMark(event.name);
					player.addMark(event.name, evt.cards.length, false);
					const now = player.countMark(event.name);
					const num = Math.floor(now / 5) - Math.floor(prev / 5);
					trigger.set("dcjikun_count", num);
				},
				intro: {
					markcount: storage => storage % 5,
					content: (storage, player) => `<li>已失去${storage}张牌<br><li>当前充能：${storage % 5}/5`,
				},
			},
		},
	},
	//谋刘协
	dcsbzhanban: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog(
					`斩绊：请选择是否摸牌或者弃牌`,
					[[1, 2, 3].map((item, index) => [index + 1, `摸${item}张`]), "tdnodes"],
					[
						[
							[0, "不摸不弃"],
							[-1, "弃置至多3张"],
						],
						"tdnodes",
					],
					"hidden"
				);
				return dialog;
			},
			filter(button, player) {
				if (button.link == -1) {
					return player.countDiscardableCards(player, "he");
				}
				return true;
			},
			check(button) {
				const player = get.player(),
					link = button.link,
					hs = player.countCards("h"),
					nums = [],
					effs = [];
				let mine = [];
				if (link < 0) {
					// 考虑人机可能弃装备牌
					let discard = player
						.getCards("he")
						.sort((a, b) => get.value(a, player) - get.value(b, player))
						.slice(0, 3);
					let num = -discard.length;
					for (let card of discard) {
						if (get.position(card) === "e") {
							num++;
						} else {
							// 计算弃牌收益
							mine.push((mine.at(-1) || 0) - get.value(card, player));
						}
					}
					if (!num) {
						return 0;
					}
					while (num < 0) {
						// 枚举可能弃牌情况
						nums.push(hs + num);
						num++;
					}
				} else {
					nums.push(hs + link);
					mine.push(link * get.effect(player, { name: "draw" }, player, player));
				}
				for (const num of nums) {
					// 自己的摸弃牌收益+其他人的
					let eff = mine.pop();
					eff += game
						.filterPlayer(targetx => targetx !== player)
						.reduce((sum, targetx) => {
							const numx = num - targetx.countCards("h");
							let val;
							if (numx > 0) {
								val = (numx - 3) * get.effect(targetx, { name: "draw" }, player, player);
							} else if (numx < 0) {
								val = (numx + 3) * get.effect(targetx, { name: "draw" }, player, player);
							} else {
								val = get.damageEffect(targetx, player, player);
							}
							if (val < 0 && player.hasZhuSkill("dcsbtiancheng", targetx)) {
								return sum;
							}
							return sum + val;
						}, 0);
					effs.push(eff);
				}
				return Math.max(...effs);
			},
			backup(links) {
				return {
					audio: "dcsbzhanban",
					filterTarget: lib.filter.notMe,
					selectTarget: -1,
					log: false,
					link: links[0],
					async precontent(event, trigger, player) {
						player.logSkill("dcsbzhanban", event.result.targets);
						const link = lib.skill.dcsbzhanban_backup.link;
						if (link > 0) {
							await player.draw(link);
						} else if (link < 0) {
							await player.chooseToDiscard(`斩绊：弃置至多三张牌`, "he", [1, 3], true);
						}
					},
					async content(event, trigger, player) {
						const num = player.countCards("h"),
							{ target } = event;
						const numx = num - target.countCards("h");
						if (numx > 0) {
							await target.draw(numx, "nodelay");
						} else if (numx < 0) {
							await target.chooseToDiscard(-numx, "h", true);
						}
						if (target.hasHistory("gain", evt => evt.getParent(2) == event)) {
							await target.chooseToDiscard(3, "he", true);
						} else if (target.hasHistory("lose", evt => evt.type == "discard" && evt.getlx !== false && evt.getParent(3) == event)) {
							await target.draw(3, "nodelay");
						} else {
							await target.damage();
						}
					},
				};
			},
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
	},
	dcsbchensheng: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		forced: true,
		locked: false,
		filter(event, player) {
			return !player.isMaxHandcard(true) && !_status.currentPhase?.isMaxHandcard(true) && player != _status.currentPhase;
		},
		content() {
			player.draw();
		},
	},
	dcsbtiancheng: {
		audio: 2,
		zhuSkill: true,
		trigger: { player: "pre_dcsbzhanban_backupBegin" },
		filter(event, player) {
			return event.player == player && game.hasPlayer(target => target != player && target.group == "qun" && event.result.targets.includes(target)) && player.hasZhuSkill("dcsbtiancheng");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, Infinity], (card, player, target) => {
					return target != player && target.group == "qun" && get.event().getTrigger().result.targets.includes(target);
				})
				.set("ai", target => {
					const num = get.player().countCards("h"),
						numx = num - target.countCards("h"),
						att = get.attitude(get.player(), target);
					let val;
					if (numx > 0) {
						val = numx - 3;
					} else if (numx < 0) {
						val = numx + 3;
					} else {
						val = -2;
					}
					val = val == 0 ? 0.5 : val;
					return val * att < 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			trigger.result.targets.removeArray(targets);
			await game.delayx();
		},
		ai: { combo: "dcsbzhanban" },
	},
	//谋曹洪
	dcsbyingjia: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		forced: true,
		filter(event, player) {
			return lib.skill.dcsbyingjia.logTarget(event, player).length;
		},
		logTarget(event, player) {
			return event.targets?.filter(target => target != player);
		},
		async content(event, trigger, player) {
			const targets = event.targets.filter(target => get.distance(player, target) != 1).sortBySeat();
			player.addTempSkill("dcsbyingjia_distance");
			player.markAuto("dcsbyingjia_distance", targets);
			if (!game.hasPlayer(target => target != player && get.distance(player, target) != 1)) {
				if (
					!game.hasPlayer(target => {
						return target != player && target.countCards("h") && !player.getStorage("dcsbyingjia_used").includes(target);
					})
				) {
					return;
				}
				const result = await player
					.chooseTarget(`迎驾：你可以获得一名其他角色所有手牌，然后交给其等量张牌`, (card, player, target) => {
						return player != target && target.countCards("h") && !player.getStorage("dcsbyingjia_used").includes(target);
					})
					.set("ai", target => -get.attitude(get.player(), target) * target.countCards("h"))
					.forResult();
				if (result?.bool && result?.targets?.length) {
					const target = result.targets[0];
					player.line(target);
					player.addTempSkill("dcsbyingjia_used");
					player.markAuto("dcsbyingjia_used", target);
					const cards = target.getGainableCards(player, "h");
					if (!cards.length) {
						return;
					}
					await player.gain(cards, target, "giveAuto", "bySelf");
					if (player.countCards("he")) {
						await player.chooseToGive(target, cards.length, true, "he");
					}
				}
			}
		},
		subSkill: {
			used: {
				onremove: true,
				charlotte: true,
			},
			distance: {
				onremove: true,
				charlotte: true,
				mark: true,
				intro: { content: "本回合你计算与 $ 的距离为1" },
				mod: {
					globalFrom(from, to) {
						if (from.getStorage("dcsbyingjia_distance").includes(to)) {
							return -Infinity;
						}
					},
				},
			},
		},
	},
	dcsbxianju: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(target => target != player && target.inRangeOf(player) && target.countGainableCards(player, "he"));
		},
		filterTarget(card, player, target) {
			return target != player && target.inRangeOf(player);
		},
		selectTarget: -1,
		multiline: true,
		multitarget: true,
		async content(event, trigger, player) {
			await player.gainMultiple(event.targets, "he");
			player
				.when("phaseUseEnd")
				.filter(evt => evt === event.getParent("phaseUse"))
				.then(() => {
					const num = game.countPlayer(target => target != player && !target.inRangeOf(player));
					if (!num) {
						return;
					}
					if (player.countDiscardableCards(player, "he")) {
						player.chooseToDiscard(num, "he", true);
					}
				});
		},
		ai: {
			order: 2,
			result: {
				player: 1,
				target: -1,
			},
		},
	},
	//谋董承
	dcsbbaojia: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && game.hasPlayer(target => target != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget("###保驾###选择一名其他角色，为其保驾护航", true, lib.filter.notMe)
				.set("ai", target => {
					return get.attitude(get.player(), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.storage.dcsbbaojia_effect = target;
			player.markSkillCharacter("dcsbbaojia_effect", target, "保驾", `你为${get.translation(target)}保驾护航`);
		},
		group: ["dcsbbaojia_effect"],
		subSkill: {
			effect: {
				audio: "dcsbbaojia",
				onremove: true,
				trigger: {
					global: "damageBegin4",
				},
				filter(event, player) {
					const target = player.storage.dcsbbaojia_effect;
					if (![player, target].includes(event.player)) {
						return false;
					}
					return (
						event.card &&
						player.hasEnabledSlot() &&
						game
							.getGlobalHistory(
								"everything",
								evt => {
									return evt.name == "damage" && evt.player == event.player && evt.card;
								},
								event
							)
							.indexOf(event) === 0
					);
				},
				async cost(event, trigger, player) {
					const list = [1, 2, 3, 4, 5].filter(num => player.hasEnabledSlot(num)).map(num => "equip" + num),
						target = trigger.player;
					const result = await player
						.chooseControl(list, "cancel2")
						.set("prompt", `###${get.prompt(event.skill, target)}###废除1个装备栏并防止其受到的伤害，且${get.translation(trigger.card)}结算完毕后你获得之。`)
						.set("ai", () => {
							if (get.attitude(get.player(), get.event().target) < 0) {
								return "cancel2";
							}
							for (var i = 5; i > 0; i--) {
								if (get.player().hasEmptySlot(i)) {
									return "equip" + i;
								}
							}
							return "cancel2";
						})
						.set("target", target)
						.forResult();
					if (result.control != "cancel2") {
						event.result = {
							bool: true,
							cost_data: result.control,
						};
					}
				},
				async content(event, trigger, player) {
					const slot = event.cost_data;
					player.line(trigger.player);
					await player.disableEquip(slot);
					trigger.cancel();
					player
						.when({ global: "useCardAfter" })
						.filter(evt => evt === trigger.getParent("useCard"))
						.then(() => {
							const cards = (trigger.cards || []).filterInD("od");
							if (cards.length) {
								player.gain(cards, "gain2");
							}
						});
				},
			},
		},
	},
	dcsbdouwei: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.hasCard(card => get.tag(card, "damage") > 0.5, "h");
		},
		filterCard(card, player) {
			const cardx = get.autoViewAs({
				name: get.name(card, player),
				nature: get.nature(card, player),
				suit: get.suit(card, player),
				number: get.number(card, player),
				isCard: true,
			});
			return get.tag(card, "damage") > 0.5 && game.hasPlayer(target => player !== target && player.inRangeOf(target) && player.canUse(cardx, target, false, false));
		},
		async content(event, trigger, player) {
			const card = event.cards[0],
				cardx = get.autoViewAs({
					name: get.name(card, player),
					nature: get.nature(card, player),
					suit: get.suit(card, player),
					number: get.number(card, player),
					isCard: true,
					storage: { dcsbdouwei: true },
				});
			await player.chooseUseTarget(cardx, [1, Infinity], true, false).set("filterTarget", (card, player, target) => {
				if (player === target || !player.inRangeOf(target)) {
					return false;
				}
				return lib.filter.targetEnabledx(card, player, target);
			});
		},
		group: ["dcsbdouwei_effect"],
		subSkill: {
			effect: {
				silent: true,
				trigger: { global: "dying" },
				filter(event, player) {
					return event.reason?.card?.storage?.dcsbdouwei;
				},
				async content(event, trigger, player) {
					if (player.isDamaged()) {
						await player.recover();
					}
					if (player.hasDisabledSlot()) {
						const list = [1, 2, 3, 4, 5].filter(num => player.hasDisabledSlot(num)).map(num => "equip" + num);
						const result = await player
							.chooseControl(list)
							.set("prompt", `斗围：恢复一个装备栏`)
							.set("ai", () => {
								const player = get.player();
								const val = slot => {
									if (
										player.hasCard(function (card) {
											return get.subtype(card) == slot;
										}, "hs")
									) {
										return 15;
									}
									return 10;
								};
								return get.event().list.sort((a, b) => val(b) - val(a))[0];
							})
							.set("list", list)
							.forResult();
						if (result?.control) {
							await player.enableEquip(result.control);
						}
					}
					player.tempBanSkill("dcsbdouwei");
				},
			},
		},
	},
	//谋荀彧
	dcsbbizuo: {
		audio: 2,
		audioname: ["dc_sb_xunyu_shadow"],
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			var zhu = game.filterPlayer(current => current.getSeatNum() == 1)[0];
			if (!zhu || !zhu.isIn()) {
				return false;
			}
			return zhu.isMinHp();
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					let player = get.player();
					if (target.hasJudge("lebu") || target.isTurnedOver()) {
						return false;
					}
					if (get.attitude(player, target) > 4) {
						return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1) > 0;
					}
					return false;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const target = event.targets[0];
			const next = target.insertPhase();
			target
				.when({ player: "phaseBegin" })
				.filter(evt => {
					return evt?.skill == "dcsbbizuo";
				})
				.assign({
					firstDo: true,
				})
				.vars({
					source: player,
				})
				.then(() => {
					player.addTempSkill("dcsbbizuo_mark", "phaseAfter");
					game.filterPlayer(target => {
						return target !== player && target !== source;
					}).forEach(target => {
						target.addTempSkill("fengyin", "phaseAfter");
					});
				});
			player
				.when({ global: "phaseEnd" })
				.filter(evt => {
					return evt?.skill == "dcsbbizuo";
				})
				.step(async (event, trigger, player) => {
					let cards = game
						.getGlobalHistory("cardMove", evt => {
							if (evt.name.indexOf("lose") == 0) {
								if (evt.position !== ui.discardPile || evt.type === "discard") {
									return false;
								} //|| evt.getlx === false
								return true;
							} else if (evt.name == "cardsDiscard") {
								return true;
							}
						})
						.map(evt => {
							return evt.cards.filterInD("d");
						})
						.flat()
						.unique();
					if (cards.length) {
						if (_status.connectMode) {
							game.broadcastAll(() => {
								_status.noclearcountdown = true;
							});
						}
						const given_map = {};
						let result;
						while (true) {
							if (cards.length > 1) {
								result = await player
									.chooseCardButton("弼佐：请选择要分配的牌", true, cards, [1, cards.length])
									.set("ai", button => {
										if (ui.selected.buttons.length) {
											return 0;
										}
										return get.buttonValue(button);
									})
									.forResult();
							} else if (cards.length === 1) {
								result = { bool: true, links: cards.slice(0) };
							} else {
								break;
							}
							const toGive = result.links;
							result = await player
								.chooseTarget(`选择一名角色获得${get.translation(toGive)}`, cards.length === 1)
								.set("ai", target => {
									const att = get.attitude(get.player(), target);
									if (get.event("toEnemy")) {
										return Math.max(0.01, 100 - att);
									} else if (att > 0) {
										return Math.max(0.1, att / Math.sqrt(1 + target.countCards("h") + (get.event("given_map")[target.playerid] || 0)));
									} else {
										return Math.max(0.01, (100 + att) / 200);
									}
								})
								.set("given_map", given_map)
								.set("toEnemy", get.value(toGive[0], player, "raw") < 0)
								.forResult();
							if (result.bool) {
								cards.removeArray(toGive);
								if (result.targets.length) {
									const id = result.targets[0].playerid;
									if (!given_map[id]) {
										given_map[id] = [];
									}
									given_map[id].addArray(toGive);
								}
								if (!cards.length) {
									break;
								}
							}
						}
						if (_status.connectMode) {
							game.broadcastAll(() => {
								delete _status.noclearcountdown;
								game.stopCountChoose();
							});
						}
						const gain_list = [];
						for (const i in given_map) {
							const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
							player.line(source, "green");
							gain_list.push([source, given_map[i]]);
							game.log(source, "获得了", given_map[i]);
						}
						await game
							.loseAsync({
								gain_list,
								giver: player,
								animate: "gain2",
							})
							.setContent("gaincardMultiple");
					}
				});
		},
		subSkill: {
			//防呆标记
			mark: {
				charlotte: true,
				mark: true,
				intro: {
					markcount: () => 0,
					content: "当前回合为〖弼佐〗回合",
				},
			},
		},
	},
	dcsbshimou: {
		audio: 2,
		audioname: ["dc_sb_xunyu_shadow"],
		enable: "phaseUse",
		usable: 1,
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			player.changeSkin({ characterName: "dc_sb_xunyu" }, "dc_sb_xunyu" + (player.storage[skill] ? "_shadow" : ""));
		},
		marktext: "☯",
		mark: true,
		intro: {
			content(storage) {
				if (!storage) {
					return "转换技，出牌阶段限一次，你可令一名手牌数全场最低的角色将手牌调整至体力上限（至多摸五张）并视为使用一张仅指定单目标的普通锦囊牌（此牌牌名与目标由你指定）。若以此法摸牌，此牌可额外增加一个目标；若以此法弃牌，此牌额外结算一次。";
				}
				return "转换技，出牌阶段限一次，你可令一名手牌数全场最高的角色将手牌调整至体力上限（至多摸五张）并视为使用一张仅指定单目标的普通锦囊牌（此牌牌名与目标由你指定）。若以此法摸牌，此牌可额外增加一个目标；若以此法弃牌，此牌额外结算一次。";
			},
		},
		filterTarget(card, player, target) {
			if (!player.storage.dcsbshimou) {
				return target.isMinHandcard();
			}
			return target.isMaxHandcard();
		},
		selectTarget: 1,
		prompt() {
			const player = get.event("player");
			return lib.skill.dcsbshimou.intro.content(player.storage.dcsbshimou);
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji(event.name);
			const target = event.targets[0];
			let num = target.maxHp - target.countCards("h");
			if (num > 0) {
				await target.draw(Math.min(5, num));
			} else if (num < 0 && target.countDiscardableCards(target, "h") > 0) {
				await target.chooseToDiscard(-num, "h", true);
			}
			if (!target.isIn()) {
				return;
			}
			let list = get.inpileVCardList(info => {
				if (info[0] != "trick") {
					return false;
				}
				return true;
			});
			if (
				!list.filter(info => {
					return game.hasPlayer(targetx => {
						return lib.filter.targetEnabled2({ name: info[2], isCard: true }, target, targetx);
					});
				}).length
			) {
				return;
			}
			//判断是否因此摸牌弃牌
			const bool1 = target.hasHistory("gain", evt => {
				return evt.getParent().name == "draw" && evt.getParent(2) == event;
			});
			const bool2 = target.hasHistory("lose", evt => {
				return evt.type == "discard" && evt.getParent(3) == event;
			});
			let str = `势谋：请选择${get.translation(target)}要使用的牌名`;
			if (bool1) {
				str += "（可额外增加1个目标）";
			}
			if (bool2) {
				str += "（可额外结算一次）";
			}
			const result = await player
				.chooseButton([str, [list, "vcard"]], true)
				.set("filterButton", button => {
					const source = get.event("source");
					return game.hasPlayer(target => {
						return lib.filter.targetEnabled2({ name: button.link[2], isCard: true }, source, target);
					});
				})
				.set("ai", button => {
					const card = get.autoViewAs({ name: button.link[2], isCard: true });
					return get.event("source").getUseValue(card) * Math.sign(get.attitude(get.player(), get.event("source")));
				})
				.set("source", target)
				.forResult();
			const card = get.autoViewAs({ name: result.links[0][2], isCard: true, storage: { dcsbshimou: [num, target] } });
			let range = [1, 1];
			if (bool1) {
				range[1]++;
			}
			const result2 = await player
				.chooseTarget(
					`势谋：请为${get.translation(target)}选择${get.translation(card)}的目标`,
					(card, player, target) => {
						return lib.filter.targetEnabled2(get.event("cardx"), get.event("source"), target);
					},
					true,
					range
				)
				.set("source", target)
				.set("cardx", card)
				.set("ai", target => {
					return get.effect(target, get.event("cardx"), get.event("source"), get.player());
				})
				.forResult();
			const next = target.useCard(card, result2.targets, false);
			if (bool2) {
				next.set("oncard", () => {
					const event = get.event();
					event.effectCount++;
					game.log(event.card, "额外结算一次");
				});
			}
			await next;
		},
		ai: {
			//ai还有待完善
			order: 5,
			result: {
				player: 1,
				target(player, target) {
					const num = target.maxHp - target.countCards("h");
					const att = get.attitude(player, target);
					if (num > 0) {
						return num;
					} else if (num < 0) {
						if (-num < 2) {
							if (att > 0) {
								return 1.5;
							}
							return -2;
						}
						return num;
					}
					return Math.random() > 0.5;
				},
			},
		},
		locked: false,
		group: ["dcsbshimou_change"],
		subSkill: {
			change: {
				audio: "dcsbshimou",
				audioname: ["dc_sb_xunyou_shadow"],
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【势谋】为状态" + (player.storage.dcsbshimou ? "阳" : "阴");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("dcsbshimou");
				},
			},
		},
	},
	dcsbxianshi: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			return get.type2(event.card) == "trick";
		},
		forced: true,
		popup: false,
		locked: false,
		async content(event, trigger, player) {
			player.addSkill(event.name + "_wuxie");
			player
				.when({ global: "useCardAfter" })
				.filter(evt => evt === trigger.getParent())
				.then(() => {
					player.removeSkill("dcsbxianshi_wuxie");
					let cards = [];
					let history = game.getGlobalHistory("everything", evt => {
						if (evt == trigger) {
							return true;
						}
						return ["lose", "loseAsync", "cardsDiscard"].includes(evt.name);
					});
					const startIndex = history.indexOf(trigger);
					for (let index = startIndex + 1; index < history.length; index++) {
						const evt = history[index];
						if (evt.name.indexOf("lose") == 0 && evt.position == ui.discardPile) {
							cards.addArray(evt.cards.filterInD("d"));
						} else if (evt.name == "cardsDiscard") {
							const evtx = evt.getParent();
							if (evtx.name === "orderingDiscard") {
								const evt2 = evtx.relatedEvent || evtx.getParent();
								if (evt2.name == "useCard" && evt2.player == player) {
									continue;
								}
							}
							cards.addArray(evt.cards.filterInD("d"));
						}
					}
					if (cards.length) {
						player.gain(cards, "gain2");
					}
				});
		},
		subSkill: {
			wuxie: {
				charlotte: true,
				audio: "dcsbxianshi",
				enable: "chooseToUse",
				filterCard: true,
				viewAsFilter(player) {
					return player.countCards("hs") > 0;
				},
				viewAs: { name: "wuxie" },
				hiddenCard(name) {
					return name === "wuxie";
				},
				position: "hs",
				popname: true,
				prompt: "将一张手牌当【无懈可击】使用",
				check(card) {
					return 8 - get.value(card);
				},
				ai: {
					basic: {
						useful: [6, 4, 3],
						value: [6, 4, 3],
					},
					result: { player: 1 },
					expose: 0.2,
				},
			},
		},
	},
	//威董卓
	dcguangyong: {
		audio: 2,
		locked: true,
		group: ["dcguangyong_self", "dcguangyong_toself"], //同时机沟槽技能改个翻译方便区分
		subSkill: {
			self: {
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return event.isFirstTarget && event.targets.includes(player);
				},
				forced: true,
				popup: false,
				prompt2: () => "增加1点体力上限",
				content() {
					player.logSkill("dcguangyong");
					player.gainMaxHp();
				},
			},
			toself: {
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return event.isFirstTarget && event.targets.some(i => i !== player && i.countGainableCards(player, "he"));
				},
				locked: true,
				popup: false,
				async cost(event, trigger, player) {
					const targets = trigger.targets.filter(i => i !== player && i.countGainableCards(player, "he"));
					if (targets.length === 1) {
						event.result = { bool: true, targets: targets };
						return;
					}
					let prompt = '<div class="text center">';
					if (player.maxHp > 1) {
						prompt += "减1点体力上限，";
					}
					prompt += "获得一名其他目标角色的一张牌</div>";
					event.result = await player
						.chooseTarget(
							true,
							(card, player, target) => {
								const targets = get.event().getTrigger().targets;
								return targets.includes(target) && target !== player && target.countGainableCards(player, "he");
							},
							"请选择【" + get.translation("dcguangyong") + "】的目标",
							prompt
						)
						.set("ai", target => {
							const player = get.player();
							return get.effect(target, { name: "shunshou_copy2" }, player, player);
						})
						.forResult();
				},
				content() {
					player.logSkill("dcguangyong", event.targets);
					if (player.maxHp > 1) {
						player.loseMaxHp();
					}
					player.gainPlayerCard(event.targets[0], "he", true);
				},
			},
		},
	},
	dcjuchui: {
		audio: 2,
		comboSkill: true,
		trigger: { player: "useCard" },
		filter(event, player) {
			if (!event.targets?.length || get.type2(event.card) !== "trick") {
				return false;
			}
			const evt = get.info("dcjianying").getLastUsed(player, event);
			return evt && get.type(evt.card) === "equip";
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return get.event().getTrigger().targets.includes(target);
				})
				.set("ai", target => {
					const player = get.player();
					if (target.maxHp <= player.maxHp) {
						return Math.max(get.effect(target, { name: "losehp" }, player, player), get.recoverEffect(target, player, player));
					}
					return get.effect(player, { name: "draw" }, player, player) + 1145141919810 - Math.sign(get.attitude(player, target)) * target.countCards("h");
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			if (target.hasSex("male")) {
				player.chat("雄性人类！");
			}
			await game.delayx();
			if (target.maxHp <= player.maxHp) {
				const result = target.isDamaged()
					? await player
							.chooseControl("失去体力", "回复体力")
							.set("ai", () => {
								const {
									player,
									targets: [target],
								} = get.event().getParent();
								return get.effect(target, { name: "losehp" }, player, player) >= get.recoverEffect(target, player, player) ? 0 : 1;
							})
							.set("prompt", get.translation(event.name) + "：令" + get.translation(target) + "失去或回复1点体力")
							.forResult()
					: { index: 0 };
				if (result.index === 0) {
					player.chat("曼巴出去！");
				}
				await target[result.index === 0 ? "loseHp" : "recover"]();
			} else {
				const types = lib.inpile.map(name => get.type2(name)).unique();
				const choice =
					types.length > 1
						? await player
								.chooseControl(types)
								.set("ai", () => {
									const {
										player,
										targets: [target],
									} = get.event().getParent();
									let controls = get.event().controls,
										att = Math.sign(get.attitude(player, target));
									return controls.sort((a, b) => att * (target.countCards("h", card => get.type2(card) === a) - target.countCards("h", card => get.type2(card) === b)))[0];
								})
								.set("prompt", get.translation(event.name) + "：选择获得类别的牌且" + get.translation(target) + "本回合不能使用此类别的牌")
								.forResult("control")
						: types[0];
				const card = get.cardPile2(card => get.type2(card) === choice);
				card ? await player.gain(card, "gain2") : player.chat("什么罐头我说？！");
				target.addTempSkill("dcjuchui_ban");
				target.markAuto("dcjuchui_ban", [choice]);
			}
		},
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (typeof card === "object") {
					const evt = get.info("dcjianying").getLastUsed(player);
					if ((!evt || get.type(evt.card) !== "equip") && get.type(card) === "equip") {
						return num + 10;
					}
					if (evt && get.type(evt.card) === "equip" && get.info(card).filterTarget) {
						return num + 10;
					}
				}
			},
		},
		init(player, skill) {
			player.addSkill(skill + "_combo");
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_combo");
		},
		subSkill: {
			combo: {
				charlotte: true,
				init(player, skill) {
					const evt = get.info("dcjianying").getLastUsed(player);
					if (evt && get.type(evt.card) === "equip") {
						player.addSkill(skill + "Skill");
					}
				},
				onremove(player, skill) {
					player.removeSkill(skill + "Skill");
				},
				trigger: { player: "useCard0" },
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player[get.type(trigger.card) === "equip" ? "addSkill" : "removeSkill"](event.name + "Skill");
				},
			},
			comboSkill: {
				charlotte: true,
				init(player, skill) {
					player.addTip(skill, [get.translation(skill), "可连击"].join(" "));
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				mark: true,
				intro: { content: "准备好触发连招吧!" },
			},
			ban: {
				charlotte: true,
				onremove: true,
				intro: { content: "不能使用$类别的牌" },
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("dcjuchui_ban").includes(get.type2(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (player.getStorage("dcjuchui_ban").includes(get.type2(card))) {
							return false;
						}
					},
				},
			},
		},
	},
	//曹媛
	dcwuyan: {
		audio: 2,
		enable: "phaseUse",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return game.hasPlayer(target => get.info("dcwuyan").filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			if (!ui.selected.targets.length) {
				if (!target.hasSex("male")) {
					return false;
				}
				return game.hasPlayer(current => current !== player && current !== target);
			}
			return ![player, ...ui.selected.targets].includes(target);
		},
		selectTarget: 2,
		targetprompt: ["发起者", "承担者"],
		complexTarget: true,
		async cost(event, trigger, player) {
			const info = get.info(event.skill);
			const next = player.chooseTarget(get.prompt2(event.skill));
			for (const item of ["filterTarget", "selectTarget", "targetprompt", "complexTarget"]) {
				next.set(item, info[item]);
			}
			next.set("ai", target => {
				const player = get.player();
				return get.effect(target, "dcwuyan", player, player);
			});
			event.result = await next.forResult();
		},
		line: false,
		delay: false,
		multitarget: true,
		async content(event, trigger, player) {
			const [source, target] = event.targets;
			player.line2(event.targets);
			await game.delayx();
			const result = await source
				.chooseToUse(function (card, player, event) {
					if (get.itemtype(card) != "card" || (get.position(card) != "h" && get.position(card) != "s")) {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				}, get.translation(event.name) + "：是否对" + get.translation(target) + "使用一张手牌？")
				.set("filterTarget", function (card, player, target) {
					const source = get.event().sourcex;
					if (target !== source) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("targetRequired", true)
				.set("complexTarget", true)
				.set("complexSelect", true)
				.set("sourcex", target)
				.set("addCount", false)
				.forResult();
			if (result?.bool) {
				await player.draw(2);
			}
			if (!result?.bool || !source.hasHistory("sourceDamage", evt => evt.getParent(4) === event)) {
				const result = await player
					.chooseBool("是否令" + get.translation(source) + "失去1点体力？")
					.set(
						"choice",
						(() => {
							return get.effect(source, { name: "losehp" }, player, player) > 0;
						})()
					)
					.forResult();
				if (result?.bool) {
					await source.loseHp();
				}
				player.tempBanSkill(event.name, ["phaseBefore", "phaseAfter", "phaseChange", ...lib.phaseName]);
			}
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					if (!ui.selected.targets.length) {
						return Math.max(
							...game
								.filterPlayer(current => ![player, target].includes(current))
								.map(current => {
									let sum = 0,
										cards = target.getCards("h", card => target.canUse(card, current) && get.effect(current, card, target, target) > 0);
									if (cards.length) {
										cards.sort((a, b) => get.effect(current, b, target, target) - get.effect(current, a, target, target));
									}
									if (cards[0]) {
										sum += get.effect(current, cards[0], target, player);
									}
									if (!cards[0] || !get.tag(cards[0], "damage")) {
										if (get.effect(target, { name: "losehp" }, player, player) > 0) {
											sum += get.effect(target, { name: "losehp" }, player, player);
										}
										if (get.effect(player, { name: "draw" }, player, player) > 0) {
											sum += get.effect(player, { name: "draw" }, player, player) * 2;
										}
									}
									return sum;
								})
						);
					}
					const source = ui.selected.targets[0];
					let sum = 0,
						cards = source.getCards("h", card => source.canUse(card, target) && get.effect(target, card, source, source) > 0);
					if (cards.length) {
						cards.sort((a, b) => get.effect(target, b, source, source) - get.effect(target, a, source, source));
					}
					if (cards[0]) {
						sum += get.effect(target, cards[0], source, player);
					}
					if (!cards[0] || !get.tag(cards[0], "damage")) {
						if (get.effect(source, { name: "losehp" }, player, player) > 0) {
							sum += get.effect(source, { name: "losehp" }, player, player);
						}
						if (get.effect(player, { name: "draw" }, player, player) > 0) {
							sum += get.effect(player, { name: "draw" }, player, player) * 2;
						}
					}
					return sum;
				},
			},
		},
	},
	dczhanyu: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return player.countCards("h");
		},
		async cost(event, trigger, player) {
			const cards = player.getCards("h");
			event.result =
				cards.length > 1
					? await player
							.chooseCard(true)
							.set("ai", card => {
								const player = get.player(),
									suit = get.suit(card);
								return get.value(card) * (2 + lib.suit.indexOf(suit)) * game.countPlayer(target => (target === player ? 0 : Math.sign(-get.attitude(player, target))));
							})
							.set("prompt", get.translation(event.skill) + "：请展示一张手牌")
							.set("prompt2", lib.translate[event.skill + "_info"])
							.forResult()
					: { bool: true, cards: cards };
		},
		async content(event, trigger, player) {
			await player.showCards(event.cards, get.translation(player) + "发动了【" + get.translation(event.name) + "】");
			const targets = game.filterPlayer(target => target !== player);
			if (targets.length) {
				player.line(targets);
				for (const target of targets) {
					const cards = target.getDiscardableCards(target, "h", card => get.suit(card) === get.suit(event.cards[0]));
					if (cards.length) {
						await target.discard(cards.randomGets(1));
					}
				}
			}
			const cards = game
				.getGlobalHistory("everything", evt => evt.name === "discard" && evt.getParent() == event)
				.reduce((cards, evt) => cards.addArray(evt.cards), [])
				.filterInD("d");
			if (!cards.length) {
				return;
			}
			const result = cards.length > 1 ? await player.chooseCardButton(cards, true, "获得其中一张牌").forResult() : { bool: true, links: cards };
			if (result?.bool && result?.links?.length) {
				await player.gain(result.links, "gain2");
			}
		},
	},
	//二刘
	dcllqixin: {
		audio: 2,
		trigger: {
			player: ["gainAfter", "useCard"],
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.name === "useCard") {
				return event.getParent(2).name !== "dcllqixin" && get.type(event.card) === "basic";
			}
			if (event.name === "gain" && (event.getParent().name !== "draw" || event.getParent(2).name === "dcllqixin")) {
				return false;
			}
			if (event.name !== "gain" && event.type !== "draw") {
				return false;
			}
			return event.getg(player).length === 2;
		},
		usable: 2,
		direct: true,
		clearTime: true,
		frequent: true,
		async content(event, trigger, player) {
			let result;
			if (trigger.name === "useCard") {
				result = await player.chooseBool(get.prompt(event.name), "摸两张牌").set("frequentSkill", event.name).forResult();
				if (result?.bool) {
					player.logSkill(event.name);
					await player.draw(2);
				}
			} else {
				result = await player
					.chooseToUse(function (card, player, event) {
						if (get.type(card) !== "basic") {
							return false;
						}
						return lib.filter.cardEnabled.apply(this, arguments);
					}, get.translation(event.name) + "：是否使用一张基本牌？")
					.set("logSkill", event.name)
					.set("addCount", false)
					.forResult();
			}
			if (!result?.bool && player.storage.counttrigger?.[event.name] > 0) {
				player.storage.counttrigger[event.name]--;
			}
		},
	},
	dcjiusi: {
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type === "wuxie") {
				return false;
			}
			return get
				.inpileVCardList(info => get.type(info[2]) == "basic")
				.some(card => {
					return event.filterCard({ name: card[2], nature: card[3] }, player, event);
				});
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => get.type(info[2]) == "basic")
					.filter(card => {
						return event.filterCard({ name: card[2], nature: card[3] }, player, event);
					});
				return ui.create.dialog("纠思", [list, "vcard"], "hidden");
			},
			check(button) {
				const event = get.event().getParent();
				if (event.type !== "phase") {
					return 1;
				}
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
			},
			prompt(links) {
				return "将武将牌翻面，视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
			},
			backup(links, player) {
				return {
					selectCard: -1,
					filterCard: () => false,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
					},
					log: false,
					precontent() {
						player.logSkill("dcjiusi");
						player.turnOver();
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (player.getStat("skill").dcjiusi) {
				return false;
			}
			return get.type(name) == "basic" && lib.inpile.includes(name);
		},
		ai: {
			order: 10,
			respondShan: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") {
					return false;
				}
				return get.info("dcjiusi").hiddenCard(player, tag.slice("respond".length).toLowerCase());
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
	},
	//张怀
	dclaoyan: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.player !== player && event.targets.length > 1;
		},
		forced: true,
		logTarget(event, player) {
			return event.targets.filter(i => i !== player);
		},
		async content(event, trigger, player) {
			trigger.getParent().excluded.addArray(event.targets);
			game.log(trigger.card, "对", event.targets, "无效");
			let number = get.number(trigger.card);
			if (typeof number === "number") {
				let gains = [];
				number--;
				while (number > 0) {
					const card = get.cardPile2(card => get.number(card) === number);
					if (card) {
						gains.push(card);
					}
					number--;
				}
				if (gains.length) {
					player.addTempSkill("dclaoyan_effect");
					const next = player.gain(gains, "gain2");
					next.gaintag.add("dclaoyan_effect");
					await next;
				}
			}
		},
		global: "dclaoyan_zhuiji",
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				content() {
					const cards = player.getCards("h", card => card.hasGaintag(event.name) && lib.filter.cardDiscardable(card, player));
					if (cards.length) {
						player.discard(cards);
					}
				},
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
			},
			//孩子们，原谅我这个梗小鬼还在玩牢大梗
			zhuiji: {
				ai: {
					effect: {
						player_use(card, player) {
							if (_status._zhuiji_check || typeof card !== "object") {
								return;
							}
							const targets = game.filterPlayer(target => player.canUse(card, target) && target.hasSkill("dclaoyan")).sortBySeat(player);
							if (!targets.length || game.countPlayer(target => player.canUse(card, target)) < 2) {
								return;
							}
							const select = get.info(card).selectTarget;
							let range;
							if (select === undefined) {
								range = [1, 1];
							} else if (typeof select === "number") {
								range = [select, select];
							} else if (get.itemtype(select) === "select") {
								range = select;
							} else if (typeof select == "function") {
								range = select(card, player);
							}
							game.checkMod(card, player, range, "selectTarget", player);
							if (range[1] === -1 || (range[1] > 1 && ui.selected.targets?.length)) {
								_status._zhuiji_check = true;
								const result = get.effect(targets[0], card, player, player);
								delete _status._zhuiji_check;
								return [0, result];
							}
						},
					},
				},
			},
		},
	},
	dcjueyan: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (!event.targets || event.targets.length !== 1) {
				return false;
			}
			if (event.targets[0] === player || !event.targets[0].isIn()) {
				return false;
			}
			return player.storage.dcjueyan[3] || player.canCompare(event.targets[0]);
		},
		logTarget: event => event.targets[0],
		check(event, player) {
			const [target] = event.targets,
				storage = player.storage.dcjueyan;
			if (!storage[3] && get.attitude(player, target) > 0) {
				return false;
			}
			return Math.max(...[(get.damageEffect(player, player, player) + get.damageEffect(target, player, player)) * storage[0], get.recoverEffect(player, player, player) * storage[1], get.effect(target, { name: "shunshou_copy", position: "h" }, player, player) * Math.min(target.countGainableCards(player, "h") - !storage[3], storage[2])]) > 0;
		},
		async content(event, trigger, player) {
			const [target] = trigger.targets,
				storage = player.storage[event.name];
			const goon = storage[3] || (await player.chooseToCompare(target).forResult("bool"));
			if (!goon) {
				return;
			}
			let list = ["造成伤害", "回复体力", "获得手牌"],
				choices = list.slice(); ///[list[0]];
			let choiceList = ["依次对你与" + get.translation(target) + "各造成" + storage[0] + "点伤害", "回复" + storage[1] + "点体力", "获得" + get.translation(target) + get.cnNumber(storage[2]) + "张手牌"];
			/*
			因为可以叠数值所以不能执行的也能选（?）
			if (player.isDamaged()) choices.add("回复体力");
			else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "（无法选择）</span>";
			if (target.countCards("h")) choices.add("获得手牌");
			else choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "（无法选择）</span>";
			*/
			const choice =
				choices.length > 1
					? await player
							.chooseControl(choices)
							.set("ai", () => {
								const player = get.player(),
									target = get.event().getParent().targets[0],
									storage = player.storage.dcjueyan;
								const map = {
									造成伤害: (get.damageEffect(player, player, player) + get.damageEffect(target, player, player)) * storage[0],
									回复体力: get.recoverEffect(player, player, player) * storage[1],
									获得手牌: get.effect(target, { name: "shunshou_copy", position: "h" }, player, player) * Math.min(target.countGainableCards(player, "h"), storage[2]),
								};
								return get
									.event()
									.controls.slice()
									.sort((a, b) => map[b] - map[a])[0];
							})
							.set("choiceList", choiceList)
							.set("prompt", "诀言：请选择一项执行，执行后该项目数值变为1，其余项目数值+1")
							.forResult("control")
					: choices[0];
			const index = (event.index = list.indexOf(choice));
			switch (index) {
				case 0:
					await player.damage(storage[0]);
					await target.damage(storage[0]);
					break;
				case 1:
					await player.recover(storage[1]);
					break;
				case 2:
					await player.gainPlayerCard(target, "h", storage[2], true);
					break;
			}
			if (Array.isArray(player.storage[event.name])) {
				player.storage[event.name][index] = 1;
				const nums = Array.from({ length: 3 })
					.map((_, i) => i)
					.filter(i => i !== index);
				for (const num of nums) {
					player.storage[event.name][num]++;
				}
				get.info(event.name).updateMark(player, event.name);
				if (
					!storage[3] &&
					Array.from({ length: 3 })
						.map((_, i) => i)
						.every(num => {
							return (
								game.getAllGlobalHistory("everything", evt => {
									return evt.name === event.name && evt.player === player && evt.index === num;
								}).length > 0
							);
						})
				) {
					player.storage[event.name][3] = true;
					player.popup(event.name);
					game.log(player, "修改了技能", "#g【" + get.translation(event.name) + "】");
				}
			}
		},
		init(player, skill) {
			player.storage[skill] = [1, 1, 1, false];
			get.info(skill).updateMark(player, skill);
		},
		onremove(player, skill) {
			player.removeTip(skill);
			delete player.storage[skill];
		},
		updateMark(player, skill) {
			player.markSkill(skill);
			player.addTip(skill, [get.translation(skill), ...player.storage[skill].slice(0, 3)].join(" "));
		},
		intro: {
			markcount: storage =>
				storage
					.slice(0, 3)
					.map(i => i.toString())
					.join(""),
			content: storage => "当前选项数值为：" + storage.slice(0, 3),
		},
	},
	dcrejueyan: {
		audio: "dcjueyan",
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (player.getStorage("dcrejueyan_used").includes(get.type2(event.card))) {
				return false;
			}
			return event.targets?.length === 1;
		},
		async cost(event, trigger, player) {
			const storage = player.storage[event.skill];
			let list = ["摸牌", "拿牌", "拼点"],
				choices = [list[0]];
			let choiceList = ["摸" + get.cnNumber(storage[0]) + "张牌", "随机从弃牌堆获得" + get.cnNumber(storage[1]) + "张牌", "与一名角色拼点，赢的角色对没赢的角色造成" + storage[2] + "点伤害"];
			if (Array.from(ui.discardPile.childNodes).length) {
				choices.add("拿牌");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "（无法选择）</span>";
			}
			if (game.hasPlayer(target => player.canCompare(target))) {
				choices.add("拼点");
			} else {
				choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "（无法选择）</span>";
			}
			const choice = await player
				.chooseControl(choices, "cancel2")
				.set("ai", () => {
					const player = get.player(),
						storage = player.storage.dcrejueyan;
					const map = {
						摸牌: get.effect(player, { name: "draw" }, player, player) * storage[0],
						拿牌: get.effect(player, { name: "draw" }, player, player) * Math.min(Array.from(ui.discardPile.childNodes).length, storage[1]),
						拼点: Math.max(...[0].concat(game.filterPlayer(target => player.canCompare(target)).map(target => get.effect(target, "hannan", player, player)))),
					};
					return get
						.event()
						.controls.slice()
						.sort((a, b) => map[b] - map[a])[0];
				})
				.set("choiceList", choiceList)
				.set("prompt", [get.prompt(event.skill), '<div class="text center">你可以选择一项执行，执行后该项目数值变为1，其余项目数值+1</div>'].map(str => "###" + str).join(""))
				.forResult("control");
			if (!choice || choice === "cancel2") {
				event.result = { bool: false };
			} else {
				event.result = { bool: true, cost_data: list.indexOf(choice) };
			}
		},
		async content(event, trigger, player) {
			player.addTempSkill("dcrejueyan_used");
			player.markAuto("dcrejueyan_used", [get.type2(trigger.card)]);
			const storage = player.storage[event.name];
			const index = event.cost_data;
			switch (index) {
				case 0:
					await player.draw(storage[0]);
					break;
				case 1:
					await player.gain(Array.from(ui.discardPile.childNodes).randomGets(storage[1]));
					break;
				case 2: {
					const result = await player
						.chooseTarget(
							true,
							(card, player, target) => {
								return player.canCompare(target);
							},
							"与一名角色拼点，赢的角色对没赢的角色造成" + storage[2] + "点伤害"
						)
						.set("ai", target => {
							const player = get.player();
							return get.effect(target, "hannan", player, player);
						})
						.forResult();
					if (result?.bool && result.targets?.length) {
						const target = result.targets[0];
						const result2 = await player.chooseToCompare(target).forResult();
						if (result2) {
							if (!result2.tie) {
								const winner = result2.bool ? player : target;
								const loser = !result2.bool ? player : target;
								winner.line(loser);
								await loser.damage(storage[2], winner);
							}
						}
					}
					break;
				}
			}
			if (Array.isArray(player.storage[event.name])) {
				player.storage[event.name][index] = 1;
				const nums = Array.from({ length: 3 })
					.map((_, i) => i)
					.filter(i => i !== index);
				for (const num of nums) {
					if (player.storage[event.name][num] < 3) {
						player.storage[event.name][num]++;
					}
				}
				get.info(event.name).updateMark(player, event.name);
			}
		},
		init(player, skill) {
			player.storage[skill] = [1, 1, 1, false];
			get.info(skill).updateMark(player, skill);
		},
		onremove(player, skill) {
			player.removeTip(skill);
			delete player.storage[skill];
		},
		updateMark(player, skill) {
			player.markSkill(skill);
			player.addTip(skill, [get.translation(skill), ...player.storage[skill].slice(0, 3)].join(" "));
		},
		intro: {
			markcount: storage =>
				storage
					.slice(0, 3)
					.map(i => i.toString())
					.join(""),
			content: storage => "当前选项数值为：" + storage.slice(0, 3),
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//徐馨
	dcyuxian: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			return player.isPhaseUsing() && player.getStorage("dcyuxian").length < 4 && get.suit(event.card, player) !== "none";
		},
		forced: true,
		locked: false,
		content() {
			player.storage[event.name] = player.getStorage(event.name).concat([get.suit(trigger.card, player)]);
			player.markSkill(event.name);
			player.addTip(event.name, get.translation(event.name) + player.getStorage(event.name).reduce((str, suit) => str + get.translation(suit), ""));
			player
				.when("phaseUseBegin")
				.then(() => {
					get.info("dcyuxian").onremove(player, "dcyuxian");
					player.unmarkSkill("dcyuxian");
				})
				.assign({ firstDo: true });
		},
		intro: { content: "已记录花色：$" },
		onremove(player, skill) {
			delete player.storage[skill];
			player.removeTip(skill);
		},
		group: "dcyuxian_draw",
		subSkill: {
			draw: {
				audio: "dcyuxian",
				trigger: { global: "useCard" },
				filter(event, player) {
					if (_status.currentPhase !== event.player || event.player === player) {
						return false;
					}
					const num = event.player.getHistory("useCard").indexOf(event);
					return player.getStorage("dcyuxian")[num] === get.suit(event.card, event.player);
				},
				logTarget: "player",
				check: (event, player) => get.attitude(player, event.player) > 0,
				prompt2: (event, player) => "与" + get.translation(event.player) + "各摸一张牌",
				async content(event, trigger, player) {
					await game.asyncDraw([player, trigger.player]);
				},
			},
		},
	},
	dcminshan: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.num > 0;
		},
		getIndex: event => event.num,
		async cost(event, trigger, player) {
			event.result = player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "draw" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			let cards = [];
			if (player.getStorage("dcyuxian").length) {
				while (cards.length < 2) {
					let card = get.cardPile2(card => {
						if (cards.includes(card)) {
							return false;
						}
						const suit = get.suit(card);
						if (player.getStorage("dcyuxian").includes(suit)) {
							return true;
						}
						return false;
					});
					if (card) {
						cards.push(card);
					} else {
						break;
					}
				}
			}
			if (cards.length < 2) {
				cards.addArray(get.cards(2 - cards.length));
			}
			if (cards.length) {
				await event.targets[0].gain(cards, "draw");
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
					if (get.tag(card, "damage")) {
						return [1, 0.55];
					}
				},
			},
		},
	},
	//威吕布
	dcbaguan: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (!player.getEquips(1).length || get.type(event.card) !== "equip" || !get.subtypes(event.card).includes("equip1")) {
				return false;
			}
			const num = player.getEquips(1).reduce((sum, card) => sum + get.cardNameLength(card), 0);
			return lib.skill.dcbaguan.getUsed(player) && num > 0 && player.countCards("hs") > 0;
		},
		direct: true,
		comboSkill: true,
		clearTime: true,
		async content(event, trigger, player) {
			const num = player.getEquips(1).reduce((sum, card) => sum + get.cardNameLength(card), 0);
			game.broadcastAll(num => (lib.skill.dcbaguan_backup.selectCard = [1, num]), num);
			const next = player.chooseToUse();
			next.set("openskilldialog", `###${get.prompt(event.name)}###是否将至多${get.cnNumber(num)}张手牌当作无任何次数限制且伤害基数为对应实体牌数的【杀】使用`);
			next.set("norestore", true);
			next.set("_backupevent", "dcbaguan_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("dcbaguan_backup");
			next.set("targetRequired", true);
			next.set("complexSelect", true);
			next.set("logSkill", event.name);
			next.set("addCount", false);
			next.set("oncard", () => {
				let event = get.event(),
					{ cards } = event;
				event.set("dcbaguan", true);
				event.baseDamage = cards.length;
			});
			await next;
		},
		init(player, skill) {
			player.addSkill(skill + "_mark");
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_mark");
		},
		getUsed(player, first) {
			let history;
			if (first) {
				history = player
					.getAllHistory("useCard")
					//.filter(c => c.targets && c.targets.length)
					.at(-1);
			} else {
				history = player
					.getAllHistory("useCard")
					.slice(0, -1)
					//.filter(c => c.targets && c.targets.length)
					.at(-1);
			}
			if (!history) {
				return false;
			}
			return history.targets.length == 1;
		},
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (lib.skill.dcbaguan.getUsed(player, true) && typeof card === "object") {
					if (get.itemtype(card) === "card" && get.subtype(card) === "equip1") {
						return num + 100;
					}
				}
			},
			cardUsable(card, player, num) {
				if (card.storage?.dcbaguan) {
					return Infinity;
				}
			},
			cardEnabled(card, player) {
				if (card.storage?.dcbaguan) {
					return true;
				}
			},
		},
		//group: "dcbaguan_mark",
		subSkill: {
			mark: {
				init(player, skill) {
					const evt = lib.skill.dcbaguan.getUsed(player, true);
					if (evt && !evt.dcbaguan) {
						player.addTip(skill, "霸关 可连击");
					}
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				charlotte: true,
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					if (lib.skill.dcbaguan.getUsed(player, true) && !trigger.dcbaguan) {
						player.addTip("dcbaguan", "霸关 可连击");
					} else {
						player.removeTip("dcbaguan");
					}
				},
			},
			backup: {
				filterCard(card, player) {
					return get.itemtype(card) === "card";
				},
				filterTarget: lib.filter.filterTarget,
				viewAs: {
					name: "sha",
					storage: { dcbaguan: true },
				},
				position: "hs",
				ai1(card) {
					return 8 - get.value(card);
				},
				log: false,
			},
		},
	},
	dcxiaowu: {
		audio: 2,
		usable: 1,
		enable: "phaseUse",
		position: "he",
		filterCard: lib.filter.cardDiscardable,
		check(card) {
			const player = get.player();
			if (card.hasGaintag("dcxiaowu") && !player.hasValueTarget(card)) {
				return 4;
			}
			return 6 - get.value(card);
		},
		content() {
			player.addSkill("dcxiaowu_effect");
			const cards = [];
			const num = player.hasHistory("custom", evt => evt.dcxiaowu) ? 2 : 1;
			while (cards.length < num) {
				let card = get.cardPile2(card => {
					if (cards.includes(card)) {
						return false;
					}
					return card.name == "sha" || get.cardDescription(card, player).includes("【杀】");
				});
				if (card) {
					cards.push(card);
				} else {
					break;
				}
			}
			if (cards.length) {
				player.gain(cards, "gain2").gaintag.add("dcxiaowu");
			} else {
				player.chat("孩子们怎么没有牌");
			}
		},
		locked: false,
		mod: {
			aiValue(player, card, num) {
				if (card.name === "zhangba") {
					return num + 1145141919810;
				}
			},
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
		group: ["dcxiaowu_restore"],
		subSkill: {
			restore: {
				trigger: { source: "damageSource" },
				forced: true,
				popup: false,
				locked: false,
				content() {
					if (player.getStat().skill.dcxiaowu) {
						delete player.getStat().skill.dcxiaowu;
						game.log(player, "重置了", "#g【骁武】");
					}
					player.getHistory("custom").push({ dcxiaowu: true });
				},
			},
			effect: {
				charlotte: true,
				mod: {
					cardUsable(card) {
						if (get.number(card) === "unsure" || card.cards?.some(card => card.hasGaintag("dcxiaowu"))) {
							return Infinity;
						}
					},
				},
				trigger: { player: "useCard1" },
				filter(event, player) {
					return (
						event.addCount !== false &&
						player.hasHistory("lose", evt => {
							if ((evt.relatedEvent || evt.getParent()) !== event) {
								return false;
							}
							return Object.values(evt.gaintag_map).flat().includes("dcxiaowu");
						})
					);
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] === "number") {
						stat[name]--;
					}
				},
			},
		},
	},
	//武陆抗
	dcshenduan: {
		audio: 2,
		trigger: { global: "chooseToCompareBegin" },
		filter(event, player) {
			if (player === event.player) {
				return true;
			}
			return (event?.targets?.includes(player) || player == event.target) && player.countDiscardableCards(player, "he") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(`###${get.prompt(event.skill)}###弃置一张牌，然后用牌堆中点数最大的牌拼点`, "he")
				.set("ai", cardx => {
					const player = get.player();
					return !player.hasCard(function (card) {
						var val = get.value(card);
						return val < 0 || (val <= 4 && get.number(card) >= 11);
					}, "h")
						? 6 - get.value(cardx)
						: 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = lib.skill.dcshenduan.getExtreCard("max");
			await game.cardsGotoOrdering(cards);
			if (!trigger.fixedResult) {
				trigger.fixedResult = {};
			}
			trigger.fixedResult[player.playerid] = cards[0];
		},
		//获得牌堆X个点数不同且为极大或极小的牌各一张
		getExtreCard(str, count = 1) {
			let cards = [];
			if (!["max", "min"].includes(str) || count < 1) {
				return cards;
			}
			let num = str == "max" ? 13 : 1;
			while (num > 0 && num < 14) {
				const card = get.cardPile2(card => {
					return get.number(card, false) == num;
				});
				if (card) {
					cards.add(card);
					if (cards.length == count) {
						break;
					}
				}
				str == "max" ? num-- : num++;
			}
			return cards;
		},
		group: ["dcshenduan_2"],
		subSkill: {
			2: {
				audio: 2,
				trigger: { global: ["chooseToCompareAfter", "compareMultipleAfter"] },
				filter(event, player, name) {
					if (event.preserve || event.result?.cancelled) {
						return false;
					}
					if (!lib.skill.dcshenduan_2.logTarget(event, player).length) {
						return false;
					}
					if (event.name == "compareMultiple") {
						return true;
					}
					return !event.compareMultiple;
				},
				logTarget(event, player) {
					let list = [];
					if (event.targets?.length) {
						list.push([event.player, event.result.num1[0], event.result.player]);
						for (const i in event.targets) {
							list.push([event.targets[i], event.result.num2[i], event.result.targets[i]]);
						}
					} else {
						list = [
							[event.player, event.num1, event.card1],
							[event.target, event.num2, event.card2],
						];
					}
					event.set("dcshenduan_list", list);
					return list
						.filter(arr => arr[1] == 13)
						.map(arr => arr[0])
						.filter(target => target.isIn());
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const targets = [player].concat(event.targets.sortBySeat());
					for (const target of targets) {
						const card = lib.skill.dcshenduan.getExtreCard("min");
						if (card) {
							game.log(target, "从牌堆获得一张牌");
							await target.gain(card, "draw");
						} else {
							break;
						}
					}
					const putter = trigger.name == "compareMultiple" ? trigger.winner : trigger.result.winner;
					if (putter?.isIn()) {
						const card = trigger.dcshenduan_list?.filter(arr => arr[0] === putter)[0][2];
						if (get.owner(card)) {
							return;
						}
						game.log(putter, "将", card, "置于牌堆底");
						await game.cardsGotoPile(card);
					}
				},
			},
		},
	},
	dckegou: {
		audio: 2,
		enable: "phaseUse",
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (!game.hasPlayer(target => player.canCompare(target))) {
				return false;
			}
			if (event.name == "chooseToUse") {
				return !player.hasSkill("dckegou_used");
			}
			return _status.currentPhase != player && (player.hasHistory("useCard") || player.hasHistory("respond"));
		},
		precontent() {
			player.addTempSkill("dckegou_used", "phaseUseAfter");
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => player.canCompare(target))
				.set("ai", target => -get.attitude(get.player(), target) / target.countCards("h"))
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			while (player.canCompare(target)) {
				const result = await player.chooseToCompare(target).forResult();
				if (result.bool) {
					const cards = lib.skill.dcshenduan.getExtreCard("min", Math.min(3, Math.abs(result.num1 - result.num2)));
					if (cards.length) {
						await player.gain(cards, "gain2");
					}
					break;
				} else {
					if (target.canUse({ name: "sha", isCard: true }, player, false, false)) {
						await target.useCard(get.autoViewAs({ name: "sha", isCard: true }), player, false);
					}
					if (!player.canCompare(target)) {
						break;
					}
					const result2 = await player
						.chooseBool(`克构：是否继续与${get.translation(target)}拼点`)
						.set("ai", () => get.attitude(get.player(), get.event().target) < 0)
						.set("target", target)
						.forResult();
					if (!result2.bool) {
						break;
					}
				}
			}
		},
		ai: {
			order: 5,
			result: {
				target: -1,
			},
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	dcdixian: {
		audio: 2,
		limited: true,
		enable: "phaseUse",
		chooseButton: {
			dialog(event, player) {
				const card = lib.skill.dcshenduan.getExtreCard("min")[0];
				const num = get.number(card, false);
				return ui.create.dialog(get.prompt2("dcdixian") + `<span class=thundertext> 当前牌堆最小点数为：${get.strNumber(num)}</span>`);
			},
			chooseControl(event, player) {
				const choices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => get.strNumber(i));
				choices.push("cancel2");
				return choices;
			},
			check(event, player) {
				return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].randomGet();
			},
			backup(result, player) {
				return {
					audio: "dcdixian",
					skillAnimation: true,
					animationColor: "metal",
					num: result.control,
					async content(event, trigger, player) {
						player.awakenSkill("dcdixian");
						const num = get.numString(lib.skill.dcdixian_backup.num);
						const card = get.cardPile2(card => get.number(card, false) < num);
						if (!card) {
							await player.draw(num);
							player.addSkill("dcdixian_effect");
							player.markAuto("dcdixian_effect", [num]); //用数组存还是考虑到后续重置限定技的问题（）
						} else {
							const discard = Array.from(ui["discardPile"].childNodes).filter(cardx => get.number(cardx, false) == 13);
							const cards = Array.from(ui["cardPile"].childNodes)
								.filter(cardx => get.number(cardx, false) == 13)
								.concat(discard);
							if (cards.length) {
								//照搬武陆逊的写法，父子在技能代码上也有联系，这很合理吧（）
								const next = player.gain(cards);
								next.shown_cards = discard;
								next.set("animate", event => {
									const player = event.player,
										cards = event.cards,
										shown = event.shown_cards;
									if (shown.length < cards.length) {
										var num = cards.length - shown.length;
										player.$draw(num);
										game.log(player, "从牌堆获得了", get.cnNumber(num), "张点数为K的牌");
									}
									if (shown.length > 0) {
										player.$gain2(shown, false);
										game.log(player, "从弃牌堆获得了", shown);
									}
									return 500;
								});
								await next;
							}
						}
					},
				};
			},
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
		subSkill: {
			effect: {
				mark: true,
				intro: {
					markcount: () => 0,
					content: `使用点数小于等于$的牌无距离次数限制`,
				},
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player) {
						const num = get.number(card, player) || 0;
						if (player.getStorage("dcdixian_effect").some(numx => num <= numx)) {
							return Infinity;
						}
					},
					targetInRange(card, player, target) {
						const num = get.number(card, player) || 0;
						if (player.getStorage("dcdixian_effect").some(numx => num <= numx)) {
							return true;
						}
					},
				},
			},
		},
	},
	//牢武陆抗 —— by 刘巴
	old_dckegou: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return event.player != player && _status.discarded.length > 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const discardPile = _status.discarded;
			let maxNumber = Math.max(...discardPile.map(c => get.number(c)));
			await player.gain(discardPile.filter(c => get.number(c) === maxNumber).randomGets(1), "gain2");
		},
	},
	old_dcjiduan: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter: (event, player) => event.isFirstTarget && event.targets.filter(c => !player.getStorage("old_dcjiduan_used").includes(c)).some(z => z.countCards("h")),
		async cost(event, trigger, player) {
			let targets = trigger.targets.filter(c => !player.getStorage(event.name + "_used").includes(c));
			event.result = await player
				.chooseTarget("急断：请选择一名角色")
				.set("filterTarget", (card, player, target) => targets.includes(target) && target.countCards("h"))
				.set("ai", target => {
					let items = target.getCards("h");
					let count = [...new Set(items.map(item => get.suit(item, target)))].length;
					let player = get.player();
					if (get.attitude(player, target) > 0) {
						return (4 - count) * get.effect(target, { name: "draw" }, target, player);
					}
					if (get.attitude(player, target) < 0) {
						return count * get.effect(target, { name: "guohe_copy2" }, player);
					}
				})
				.forResult();
		},
		async content(event, trigger, player) {
			let target = event.targets[0];
			let numberx = get.number(trigger.card);
			const show = await target
				.chooseCard()
				.set("forced", true)
				.set("prompt", `${get.translation(event.name)}：请展示一张手牌`)
				.set("prompt2", `若此牌点数小于${numberx}则你被${get.translation(player)}执行摸牌或弃牌效果`)
				.set("ai", card => {
					if (get.attitude(get.player(), _status.event.getParent().player) <= 0) {
						return get.number(card) >= numberx;
					} else {
						return get.number(card) < numberx;
					}
				})
				.set("numberx", numberx)
				.forResult();
			if (show) {
				await target.showCards(show.cards);
			}
			if (numberx != 13) {
				player.markAuto(event.name + "_used", target);
			}
			player.when({ global: ["phaseBeginStart", "phaseEnd"] }).then(() => (player.storage.old_dcjiduan_used = []));
			if (get.number(show.cards[0]) >= numberx) {
				return;
			}
			const result = await player
				.chooseControlList(get.prompt(event.name), ["令" + get.translation(target) + "摸手牌中没有的花色各一张牌", "令" + get.translation(target) + "弃置每种花色的手牌各一张"], true)
				.set("ai", () => {
					if (get.attitude(get.player(), target) <= 0) {
						return 1;
					} else {
						return 0;
					}
				})
				.set("target", target)
				.forResult();
			let suitx = [...new Set(target.getCards("h").map(item => get.suit(item, target)))];
			if (result.index == 0) {
				let suits = lib.suit.filter(c => !suitx.includes(c));
				let gains = [];
				for (const suit of suits) {
					const card = get.cardPile(card => get.suit(card) === suit && !gains.includes(card));
					if (card) {
						gains.push(card);
					}
				}
				if (gains.length) {
					await target.gain(gains, "gain2");
				}
			} else {
				let num = target.getDiscardableCards(target, "h").length;
				if (num) {
					await target
						.chooseToDiscard("h", Math.min(suitx.length, num), true)
						.set("filterCard", (card, player) => !ui.selected.cards.length || !ui.selected.cards.some(i => get.suit(i, player) === get.suit(card, player)))
						.set("prompt", "请弃置不同花色的牌")
						.set("complexCard", true)
						.set("ai", function (card) {
							const player = get.player();
							if (!player.hasValueTarget(card)) {
								return 5;
							}
							return 5 - get.value(card);
						});
				}
			}
		},
	},
	old_dcdixian: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		onChooseToUse(event) {
			if (!game.online && !event.old_dcdixian) {
				event.set("old_dcdixian", ui.cardPile.childNodes.length);
			}
		},
		filter(event, player) {
			if (!event.old_dcdixian) {
				return false;
			}
			return player.hasCard(card => lib.filter.cardDiscardable(card, player), "h");
		},
		filterCard: lib.filter.cardDiscardable,
		selectCard: [1, Infinity],
		check(card) {
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.addSkill(event.name + "_mark");
			const cardPile = Array.from(ui.cardPile.childNodes).sort(lib.sort.number2);
			if (!cardPile.length) {
				return;
			}
			const next = player.gain(cardPile.splice(0, event.cards.length), "draw");
			next.gaintag.add(event.name);
			await next;
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
			threaten: 1.5,
		},
		subSkill: {
			mark: {
				charlotte: true,
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("old_dcdixian")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name === "phaseDiscard" && card.hasGaintag("old_dcdixian")) {
							return false;
						}
					},
				},
			},
		},
	},
	//SP马超二号
	twodcspzhuiji: {
		audio: "zhuiji",
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return event.targets?.some(i => i !== player && !player.getStorage("twodcspzhuiji_buff").includes(i));
		},
		forced: true,
		logTarget(event, player) {
			return event.targets.filter(i => i !== player && !player.getStorage("twodcspzhuiji_buff").includes(i));
		},
		async content(event, trigger, player) {
			player.addTempSkill("twodcspzhuiji_buff");
			player.markAuto("twodcspzhuiji_buff", event.targets);
		},
		subSkill: {
			buff: {
				charlotte: true,
				onremove: true,
				mod: {
					globalFrom(from, to) {
						if (from.getStorage("twodcspzhuiji_buff").includes(to)) {
							return -Infinity;
						}
					},
				},
				intro: { content: "计算与$的距离视为1" },
			},
		},
	},
	twodcspshichou: {
		audio: "ol_shichou",
		enable: "phaseUse",
		viewAs: {
			name: "sha",
		},
		position: "hes",
		viewAsFilter(player) {
			return (
				player.countCards("hes", function (card) {
					return lib.skill.twodcspshichou.filterCard(card, player);
				}) > 0
			);
		},
		filterCard(card, player) {
			const color = player.getStorage("twodcspshichou_used", [[], []])[0];
			return !color.includes(get.color(card));
		},
		filterTarget(card, player, target) {
			const targetsx = player.getStorage("twodcspshichou_used", [[], []])[1];
			if (targetsx.length > 0 && !targetsx.includes(target)) {
				return false;
			}
			return lib.filter.filterTarget(card, player, target);
		},
		async precontent(event, trigger, player) {
			const { result } = event;
			event.getParent().addCount = false;
			player.addTempSkill("twodcspshichou_used");
			const storage = player.getStorage("twodcspshichou_used");
			storage[0].add(get.color(result.card));
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }, player) + 0.1;
			},
		},
		subSkill: {
			used: {
				init(player, skill) {
					player.storage[skill] = [[], []];
				},
				onremove: true,
				group: "twodcspshichou_directHit",
			},
			directHit: {
				charlotte: true,
				trigger: { player: "useCardToBegin" },
				filter(event, trigger, player) {
					if (!event.target?.isIn()) {
						return false;
					}
					return event.card.name === "sha" && event.skill == "twodcspshichou";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const { card, target } = trigger;
					const storage = player.getStorage("twodcspshichou_used");
					storage[1].add(trigger.target);
					let func, prompt;
					if (get.color(card) == "red") {
						prompt = "弃置一张装备牌，否则无法响应此【杀】";
						func = function (card) {
							return get.type(card) == "equip";
						};
					} else if (get.color(card) == "black") {
						prompt = "弃置一张黑色手牌，否则无法响应此【杀】";
						func = function (card) {
							return get.color(card) == "black" && get.position(card) == "h";
						};
					} else {
						return;
					}
					const {
						result: { bool },
					} = await target.chooseToDiscard("he", func, prompt).set("ai", card => {
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
					if (!bool) {
						trigger.set("directHit", true);
						game.log(target, "不可响应", card);
					}
				},
			},
		},
	},
	//SP马超一号
	onedcspzhuiji: {
		audio: "zhuiji",
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return (
				player.getHistory("sourceDamage", evt => {
					return evt.getParent("phaseUse") === event;
				}).length > 0
			);
		},
		async cost(event, trigger, player) {
			const { result } = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("filterTarget", (card, player, target) => {
					return get.event("targets").includes(target);
				})
				.set(
					"targets",
					player
						.getHistory("sourceDamage", evt => {
							return evt.getParent("phaseUse") === trigger;
						})
						.map(evt => evt.player)
				)
				.set("ai", function (target) {
					const sha = get.autoViewAs({ name: "sha" });
					return get.effect(target, sha, get.player());
				});
			event.result = result;
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			let numx = player
				.getHistory("sourceDamage", evt => {
					return evt.player === target && evt.getParent("phaseUse") === trigger;
				})
				.reduce((num, evt) => num + evt.num, 0);
			const sha = get.autoViewAs({ name: "sha", isCard: true });
			while (numx--) {
				if (player.canUse(sha, target, false)) {
					await player.useCard(sha, target, false);
				}
			}
		},
	},
	onedcspshichou: {
		audio: "ol_shichou",
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			return (
				player.getHistory("sourceDamage", evt => {
					return evt.card === event.card;
				}).length == 0
			);
		},
		direct: true,
		clearTime: true,
		async content(event, trigger, player) {
			const { targets } = trigger;
			const next = player.chooseToUse();
			next.set(
				"targets",
				game.filterPlayer(function (current) {
					return targets.includes(current) && trigger.targets.includes(current);
				})
			);
			next.set("openskilldialog", get.prompt2("onedcspshichou"));
			next.set("norestore", true);
			next.set("_backupevent", "onedcspshichou_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("onedcspshichou_backup");
			next.set("logSkill", event.name);
			await next;
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				position: "hes",
				viewAs: {
					name: "juedou",
				},
				filterTarget(card, player, target) {
					return _status.event.targets && _status.event.targets.includes(target) && lib.filter.filterTarget.apply(this, arguments);
				},
				log: false,
				prompt: "将一张牌当决斗使用",
				check(card) {
					return 7 - get.value(card);
				},
			},
		},
	},
	//孙霸
	dcjiedang: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		frequent: true,
		logTarget: () => game.filterPlayer().sortBySeat(),
		async content(event, trigger, player) {
			for (const target of event.targets) {
				if (!target.isIn() || !target.countCards("he")) {
					continue;
				}
				const { result } = await target
					.chooseCard([1, Infinity], "he")
					.set("ai", card => {
						const { targetx, player } = get.event();
						const att = get.attitude(player, targetx);
						if (att <= 0) {
							return 0;
						}
						if (player == targetx) {
							return 7.5 - get.value(card);
						}
						if (!ui.selected.cards.length) {
							return 6 - get.value(card);
						}
						return 0;
					})
					.set("targetx", player)
					.set("prompt", `是否响应${get.translation(player)}的【结党】？`)
					.set("prompt2", `将任意张牌置于${get.translation(player)}的武将牌上`);
				if (result?.bool && result?.cards?.length) {
					target.chat("我没意见");
					target.line(player);
					const next = player.addToExpansion(result.cards, target, "give");
					next.gaintag.add(event.name);
					await next;
					await target.draw();
				} else {
					target.chat("但是我拒绝");
				}
			}
		},
		marktext: "党",
		intro: {
			markcount: "expansion",
			content: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: "dcjiedang_lose",
		subSkill: {
			lose: {
				audio: "dcjiedang",
				trigger: { player: ["phaseUseBegin", "phaseJieshuBegin", "dying"] },
				filter(event, player) {
					return player.getExpansions("dcjiedang").length > 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const expansions = player.getExpansions("dcjiedang");
					const list = expansions.map(card => get.type2(card)).unique();
					const dialog = ["结党：移去一种类别的所有“结党”牌并摸等量张牌"];
					for (let i = 0; i < list.length; i++) {
						const type = list[i];
						const cards = expansions.filter(card => get.type2(card) == type);
						if (cards.length) {
							dialog.addArray([`<span class="text center">${get.translation(type)}</span>`, cards]);
						}
					}
					const result =
						list.length > 1
							? await player
									.chooseControl(list)
									.set("ai", () => {
										let { player, controls, expansions } = get.event();
										return controls.sort((a, b) => {
											return expansions.filter(card => get.type2(card) === b).length - expansions.filter(card => get.type2(card) === a).length;
										})[0];
									})
									.set("dialog", dialog)
									.set("expansions", expansions)
									.forResult()
							: { control: list[0] };
					const control = result?.control;
					if (control) {
						const lose = expansions.filter(card => get.type2(card) == control);
						if (!lose.length) {
							return;
						}
						await player.loseToDiscardpile(lose);
						await player.draw(lose.length);
					}
				},
			},
		},
	},
	dcjidi: {
		audio: 2,
		trigger: {
			player: "damageBegin4",
		},
		forced: true,
		filter(event, player) {
			const { source } = event;
			if (!source) {
				return false;
			}
			return source.getHp() > player.getHp() || source.countCards("h") > player.countCards("h");
		},
		async content(event, trigger, player) {
			const { source } = trigger;
			if (source.getHp() > player.getHp()) {
				await source.loseHp();
			}
			if (source.countCards("h") > player.countCards("h")) {
				await source.randomDiscard(2);
			}
		},
	},
	//威孙权
	dcwoheng: {
		audio: 2,
		trigger: { player: "damageEnd" },
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		prompt() {
			const num = get.player().countMark("dcwoheng");
			return `令一名其他角色摸${get.cnNumber(num + 1)}张牌或弃置${get.cnNumber(num + 1)}张牌`;
		},
		async cost(event, trigger, player) {
			const num = player.countMark("dcwoheng");
			event.result = await player
				.chooseTarget(get.prompt(event.skill), `令一名其他角色摸${get.cnNumber(num + 1)}张牌或弃置${get.cnNumber(num + 1)}张牌`, lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, "dcwoheng", player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.target || event.targets[0];
			game.countPlayer(current => {
				if (current.hasSkill("dcwoheng", null, null, false)) {
					current.addTempSkill("dcwoheng_used", "roundStart");
					current.addMark("dcwoheng", 1, false);
				}
			});
			const goon = event.getParent(2).name !== "dcyuhui_buff";
			const num = goon ? player.countMark("dcwoheng") : 1;
			if (!target?.isIn()) {
				return;
			}
			const str1 = "摸" + get.cnNumber(num) + "张牌";
			const str2 = "弃" + get.cnNumber(num) + "张牌";
			const list = [str1];
			if (target.countCards("he")) {
				list.push(str2);
			}
			let directcontrol =
				str1 ==
				(await player
					.chooseControl(list)
					.set("ai", () => get.event().choice)
					.set(
						"choice",
						get.effect(target, { name: "draw" }, player, player) *
							(() => {
								if (goon && player.countMark("dcwoheng") <= 3) {
									if (target.countCards("h") + num === player.countCards("h")) {
										return 100 * num;
									}
								}
								return num;
							})() >
							get.effect(target, { name: "guohe_copy2" }, target, player) *
								(() => {
									const numx = Math.min(num, target.countDiscardableCards(target, "he"));
									if (goon && player.countMark("dcwoheng") <= 3) {
										if (target.countCards("h") - numx === player.countCards("h")) {
											return 100 * numx;
										}
									}
									return numx;
								})()
							? str1
							: str2
					)
					.set("prompt", get.translation("dcwoheng") + "：令" + get.translation(target) + "…")
					.forResultControl());
			if (directcontrol) {
				await target.draw(num);
			} else {
				await target.chooseToDiscard(num, true, "he");
			}
			if (player.countMark("dcwoheng") > 3 || player.countCards("h") !== target.countCards("h")) {
				await player.draw(2);
				if (player.hasSkill("dcwoheng", null, null, false)) {
					player.tempBanSkill("dcwoheng");
				}
			}
		},
		ai: {
			order(item, player) {
				const num = player.countMark("dcwoheng") + 1;
				if (
					game.hasPlayer(target => {
						if (get.effect(target, { name: "draw" }, player, player) > 0) {
							if (target.countCards("h") + num === player.countCards("h")) {
								return true;
							}
						}
						if (get.effect(target, { name: "guohe_copy2" }, player, player) > 0) {
							const numx = Math.min(num, target.countDiscardableCards(target, "he"));
							if (target.countCards("h") - numx === player.countCards("h")) {
								return true;
							}
						}
						return false;
					})
				) {
					return 100;
				}
				return 7;
			},
			result: {
				player(player, target) {
					const goon = !get.event()?.getParent()?.name.includes("dcyuhui_buff");
					const num = goon ? player.countMark("dcwoheng") + 1 : 1;
					return Math.max(
						get.effect(target, { name: "draw" }, player, player) *
							(() => {
								if (goon && player.countMark("dcwoheng") < 3) {
									if (target.countCards("h") + num === player.countCards("h")) {
										return 100 * num;
									}
								}
								return num;
							})(),
						get.effect(target, { name: "guohe_copy2" }, target, player) *
							(() => {
								const numx = Math.min(num, target.countDiscardableCards(target, "he"));
								if (goon && player.countMark("dcwoheng") < 3) {
									if (target.countCards("h") - numx === player.countCards("h")) {
										return 100 * numx;
									}
								}
								return numx;
							})()
					);
				},
			},
		},
		init(player) {
			const num = (() => {
				let num = 0,
					globalHistory = _status.globalHistory;
				for (let i = globalHistory.length - 1; i >= 0; i--) {
					num += globalHistory[i].everything.filter(evt => evt.name === "dcwoheng").length;
					if (globalHistory[i].isRound) {
						break;
					}
				}
				return num;
			})();
			if (num) {
				player.addTempSkill("dcwoheng_used", "roundStart");
				player.addMark("dcwoheng", num, false);
			}
		},
		onremove: true,
		mark: true,
		intro: {
			markcount(num = 0) {
				return num + 1;
			},
			content(num = 0) {
				return `令一名其他角色摸${get.cnNumber(num + 1)}张牌或弃置${get.cnNumber(num + 1)}张牌`;
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove(player) {
					player.clearMark("dcwoheng", false);
				},
			},
		},
	},
	dcyuhui: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.hasPlayer(target => {
				if (target == player) {
					return false;
				}
				return target.group === "wu";
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("filterTarget", (_, player, target) => {
					if (target == player) {
						return false;
					}
					return target.group === "wu";
				})
				.set("ai", target => get.attitude(get.player(), target))
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			for (const target of targets) {
				target.addSkill("dcyuhui_buff");
				target.markAuto("dcyuhui_buff", [player]);
			}
		},
		derivation: "dcwoheng",
		subSkill: {
			buff: {
				charlotte: true,
				trigger: { player: "phaseUseBegin" },
				getIndex(event, player) {
					return player.getStorage("dcyuhui_buff");
				},
				async cost(event, trigger, player) {
					const target = event.indexedData;
					player.unmarkAuto("dcyuhui_buff", [target]);
					if (!player.getStorage("dcyuhui_buff").length) {
						player.removeSkill("dcyuhui_buff");
					}
					if (!target?.isIn() || !game.hasPlayer(target => target !== player)) {
						event.result = { bool: false };
						return;
					}
					const list = ["dcyuhui_buff", target];
					event.result = await player
						.chooseToGive(
							target,
							card => {
								return get.color(card) == "red" && get.type(card) == "basic";
							},
							"he",
							get.prompt(...list)
						)
						.set("ai", card => {
							const player = get.player();
							if (get.attitude(player, get.event().getParent().indexedData) < 0) {
								return 0;
							}
							return (
								Math.max(
									...game
										.filterPlayer(target => target !== player)
										.map(target => {
											return get.effect(target, "dcwoheng", player, player);
										})
								) - get.value(card)
							);
						})
						.set("prompt2", "交给" + get.translation(target) + "一张红色基本牌，发动一次X为1的〖斡衡〗")
						.set("logSkill", list)
						.forResult();
				},
				popup: false,
				async content(event, trigger, player) {
					const result = await player
						.chooseTarget(get.prompt("dcwoheng"), `令一名其他角色摸一张牌或弃置一张牌`, lib.filter.notMe)
						.set("ai", target => {
							const player = get.player();
							return get.effect(target, "dcwoheng", player, player);
						})
						.forResult();
					if (result?.bool && result.targets?.length) {
						await player.useSkill("dcwoheng", result.targets);
					}
				},
				intro: { content: "出牌阶段开始时，你可以交给$一张红色基本牌，发动一次X为1的〖斡衡〗" },
			},
		},
	},
	//吕据
	dczhengyue: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return !player.getExpansions("dczhengyue").length;
		},
		async cost(event, trigger, player) {
			const { result } = await player
				.chooseControl(
					Array.from({ length: 5 }).map((_, i) => get.cnNumber(i + 1) + "张"),
					"cancel2"
				)
				.set("ai", () => {
					return 4;
				})
				.set("prompt", get.prompt(event.skill))
				.set("prompt2", "将牌堆顶至多五张牌置于武将牌上");
			event.result = result;
			event.result.bool = result.control !== "cancel2";
			event.result.cost_data = result.index + 1;
		},
		async content(event, trigger, player) {
			const cards = get.cards(event.cost_data);
			await game.cardsGotoOrdering(cards);
			const next = player.chooseToMove("征越：将这些牌以任意顺序置于武将牌上", true);
			next.set("list", [["武将牌", cards]]);
			next.set("processAI", list => [list[0][1]]);
			const {
				result: { bool, moved: cost_data },
			} = await next;
			if (bool) {
				const cardsx = [];
				cardsx.addArray(cost_data[0]);
				cardsx.reverse();
				const next2 = player.addToExpansion(cardsx, "gain2");
				next2.gaintag.add("dczhengyue");
				await next2;
				if (player.getExpansions("dczhengyue")[0]) {
					const card = player.getExpansions("dczhengyue")[0];
					player.addTip("dczhengyue", ["dczhengyue", get.suit(card), get.number(card)].map(i => get.translation(i)).join(" "));
				} else {
					player.removeTip("dczhengyue");
				}
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
			player.removeTip(skill);
		},
		group: "dczhengyue_useCard",
		subSkill: {
			useCard: {
				audio: "dczhengyue",
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					const cards = player.getExpansions("dczhengyue"),
						firstCard = cards[0];
					if (!firstCard) {
						return false;
					}
					if (get.suit(firstCard) == get.suit(event.card) || get.number(firstCard) == get.number(event.card) || get.name(firstCard) == get.name(event.card)) {
						return true;
					}
					return cards.length < 5 && event.cards?.someInD("ode");
				},
				forced: true,
				async content(event, trigger, player) {
					const firstCard = player.getExpansions("dczhengyue")[0];
					if (get.suit(firstCard) == get.suit(trigger.card) || get.number(firstCard) == get.number(trigger.card) || get.name(firstCard) == get.name(trigger.card)) {
						await player.discard([firstCard]);
						await player.draw(2);
					} else {
						const puts = trigger.cards.filterInD("ode");
						const expansion = player.getExpansions("dczhengyue");
						await game.cardsGotoOrdering(puts.filterInD("od"));
						const next = player.chooseToMove("征越：将这些牌以任意顺序置于武将牌上", true);
						next.set("list", [
							["武将牌", expansion],
							["实体牌", puts],
						]);
						next.set("processAI", list => {
							const cards = list[1][1].randomGets(5 - list[0][1].length, list[1][1].length);
							return [list[0][1].addArray(cards), list[1][1].removeArray(cards)];
						});
						next.set("filterOk", moved => {
							const { list } = get.event();
							return moved[0].length === Math.min(5, list[0][1].length + list[1][1].length);
						});
						const {
							result: { moved },
						} = await next;
						const cards = moved[0];
						cards.reverse();
						const targets = game.filterPlayer(i => {
							if (i === player && expansion.length) {
								return true;
							}
							return puts.filterInD("d").some(j => get.owner(j) === i);
						});
						if (targets.length > 0) {
							const lose_list = [];
							for (const i of targets) {
								const loseCard = puts.filterInD("d").filter(j => get.owner(j) === i);
								lose_list.push([i, (i === player ? expansion : []).concat(loseCard)]);
							}
							await game.loseAsync({ lose_list }).setContent("chooseToCompareLose");
						}
						const next2 = player.addToExpansion(cards, "gain2");
						next2.gaintag.add("dczhengyue");
						await next2;
						player.addTempSkill("dczhengyue_count");
						player.addMark("dczhengyue_count", puts.length - moved[1].length, false);
						if (player.storage.dczhengyue_count >= 2) {
							player.storage.dczhengyue_count = player.storage.dczhengyue_count % 2;
							player.addTempSkill("dczhengyue_debuff");
						}
					}
					if (player.getExpansions("dczhengyue")[0]) {
						const card = player.getExpansions("dczhengyue")[0];
						player.addTip("dczhengyue", ["dczhengyue", get.suit(card), get.number(card)].map(i => get.translation(i)).join(" "));
					} else {
						player.removeTip("dczhengyue");
					}
				},
			},
			count: {
				charlotte: true,
				onremove: true,
			},
			debuff: {
				mod: {
					cardEnabled(card, player, result) {
						if (get.position(card) == "h") {
							return false;
						}
						return result;
					},
				},
			},
		},
	},
	//莫琼树
	dcwanchan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		async content(event, trigger, player) {
			const { target } = event,
				num = Math.min(get.distance(player, target), 3);
			if (num > 0) {
				await target.draw(num);
			}
			target
				.when({ player: "useCard" })
				.filter(
					evt =>
						evt.getParent(2) == event &&
						game.hasPlayer(current => {
							if (evt.targets.includes(current) || !lib.filter.targetEnabled2(evt.card, evt.player, current)) {
								return false;
							}
							return evt.targets.some(target => [target.getPrevious(), target.getNext()].includes(current));
						})
				)
				.step(async (event, trigger, player) => {
					const targets = game.filterPlayer(current => {
						if (trigger.targets.includes(current) || !lib.filter.targetEnabled2(trigger.card, trigger.player, current)) {
							return false;
						}
						return trigger.targets.some(target => [target.getPrevious(), target.getNext()].includes(current));
					});
					if (targets.length) {
						trigger.player.line(targets, "green");
						trigger.targets.addArray(targets);
						game.log(targets, "也成为了", trigger.card, "的目标");
					}
				});
			await target
				.chooseToUse(function (card, player, event) {
					if (!["basic", "trick"].includes(get.type(card))) {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				}, "宛蝉：是否使用一张基本牌或普通锦囊牌？")
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("addCount", false);
		},
		ai: {
			order(item, player) {
				if (game.hasPlayer(current => get.distance(player, current) && get.attitude(player, current) > 0) || player.hasCard(card => ["basic", "trick"].includes(get.type(card)) && player.hasValueTarget(card, false, false), "hs")) {
					return 10;
				}
				return 0.001;
			},
			result: {
				target(player, target) {
					const num = Math.min(get.distance(player, target), 3);
					let eff = get.effect(target, { name: "draw" }, player, player) * num;
					if (player == target && target.hasCard(card => ["basic", "trick"].includes(get.type(card)) && player.hasValueTarget(card, false, false), "hs")) {
						return 1;
					}
					return Math.max(0, eff) * Math.sqrt(target.countCards("h") + 1);
				},
			},
		},
	},
	dcjiangzhi: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			const { card, targets } = event;
			if (!["basic", "trick"].includes(get.type(card))) {
				return false;
			}
			return targets?.length > 1;
		},
		frequent: true,
		async content(event, trigger, player) {
			const judgeEvent = player.judge(card => {
				if (["red", "black"].includes(get.color(card))) {
					return 1.5;
				}
				return -1.5;
			});
			judgeEvent.judge2 = result => result.bool;
			const {
				result: { color, judge },
			} = await judgeEvent;
			if (judge < 0) {
				return;
			}
			const targetsx = game.filterPlayer(current => current != player && current.countDiscardableCards(player, "he"));
			if (color == "red") {
				await player.draw(3);
			} else if (color == "black" && targetsx.length) {
				const targets = await player
					.chooseTarget(`选择一名角色弃置其至多两张牌`, (card, player, target) => {
						return get.event("targetsx").includes(target);
					})
					.set("ai", target => {
						const player = get.player();
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					})
					.set("targetsx", targetsx)
					.forResultTargets();
				if (targets?.length) {
					await player.discardPlayerCard(targets[0], "he", true, [1, 2]);
				}
			}
		},
	},
	//威张辽
	dcyuxi: {
		audio: 2,
		trigger: {
			source: "damageBegin3",
			player: "damageBegin4",
		},
		frequent: true,
		content() {
			player.addSkill(event.name + "_effect");
			player.draw().gaintag = [event.name];
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "useCard1" },
				filter(event, player) {
					return (
						event.addCount !== false &&
						player.hasHistory("lose", evt => {
							return (evt.relatedEvent || evt.getParent()) == event && evt.hs.length && Object.values(evt.gaintag_map).flat().includes("dcyuxi");
						})
					);
				},
				forced: true,
				popup: false,
				content() {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
					game.log(trigger.card, "不计入次数");
				},
				mod: {
					cardUsable(card) {
						if (get.number(card) === "unsure" || card.cards?.some(card => card.hasGaintag("dcyuxi"))) {
							return Infinity;
						}
					},
				},
			},
		},
	},
	dcporong: {
		audio: 2,
		comboSkill: true,
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object") {
					const evt = lib.skill.dcjianying.getLastUsed(player);
					if (evt?.card && get.tag(evt.card, "damage") > 0.5 && !evt.dcporong && get.name(card, player) == "sha") {
						return num + 10;
					}
				}
			},
		},
		trigger: { player: "useCard" },
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			const evt = lib.skill.dcjianying.getLastUsed(player, event);
			if (!evt || !evt.card || evt.dcporong) {
				return false;
			}
			return get.tag(evt.card, "damage") > 0.5;
		},
		locked: false,
		logTarget(event, player) {
			return event.targets.sortBySeat();
		},
		check(event, player) {
			if (event.targets.reduce((sum, target) => sum + get.effect(target, event.card, player, player), 0) > 0) {
				return true;
			}
			const targets = event.targets.map(target => [target, target.getNext(), target.getPrevious()].filter(current => current != player && current.countGainableCards(player, "h"))).flat();
			return targets.reduce((sum, target) => sum + get.effect(target, { name: "shunshou_copy2" }, player, player), 0) > 0;
		},
		async content(event, trigger, player) {
			const { targets, name } = event;
			trigger.set(name, true);
			//game.log(trigger.card, "不可被响应");
			//trigger.directHit.addArray(game.filterPlayer());
			for (const target of targets) {
				const targetsx = [target, target.getNext(), target.getPrevious()].filter(current => current != player && current.countGainableCards(player, "h")).sortBySeat();
				if (targetsx.length) {
					await player.gainMultiple(targetsx);
				}
			}
			trigger.effectCount++;
		},
		init(player, skill) {
			player.addSkill(skill + "_mark");
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_mark");
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (!arg?.card || get.name(arg.card) !== "sha") {
					return;
				}
				const evt = lib.skill.dcjianying.getLastUsed(player);
				return evt?.card && get.tag(evt.card, "damage") > 0.5 && !evt.dcporong;
			},
		},
		//group: "dcporong_mark",
		subSkill: {
			mark: {
				init(player, skill) {
					const evt = lib.skill.dcjianying.getLastUsed(player);
					if (evt?.card && get.tag(evt.card, "damage") > 0.5 && !evt[skill]) {
						player.addTip(skill, "破戎 可连击");
					}
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				charlotte: true,
				trigger: { player: ["useCard1", "useCardAfter"] },
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					if (event.triggername == "useCard1") {
						if (get.tag(trigger.card, "damage") > 0.5) {
							player.addTip("dcporong", "破戎 可连击");
						} else {
							player.removeTip("dcporong");
						}
					} else if (trigger.dcporong) {
						player.removeTip("dcporong");
					}
				},
			},
		},
	},
	//庞凤衣
	dcyitong: {
		audio: 2,
		trigger: {
			global: ["phaseBefore", "cardsDiscardAfter"],
			player: "enterGame",
		},
		filter(event, player, name) {
			const suits = player.getStorage("dcyitong");
			if (name === "phaseBefore" || name === "enterGame") {
				return suits.length < 4 && (event.name !== "phase" || game.phaseNumber === 0);
			}
			return suits.some(suit => {
				if (!event.getd?.().some(card => get.suit(card, false) === suit)) {
					return false;
				}
				return (
					game
						.getGlobalHistory("cardMove", evt => {
							if (evt.name !== "cardsDiscard") {
								return false;
							}
							const evtx = evt.getParent();
							if (evtx.name !== "orderingDiscard") {
								return false;
							}
							const evt2 = evtx.relatedEvent || evtx.getParent();
							if (evt2.name != "useCard") {
								return false;
							}
							return evt.getd?.()?.some(card => get.suit(card, false) === suit);
						})
						.indexOf(event) === 0
				);
			});
		},
		forced: true,
		async content(event, trigger, player) {
			const name = event.triggername,
				storage = player.getStorage("dcyitong"),
				suits = lib.suit
					.filter(suit => {
						if (name === "phaseBefore" || name === "enterGame") {
							return !storage.includes(suit);
						}
						if (!storage.includes(suit) || !trigger.getd?.().some(card => get.suit(card, false) === suit)) {
							return false;
						}
						return (
							game
								.getGlobalHistory("everything", evt => {
									if (evt.name !== "cardsDiscard") {
										return false;
									}
									const evtx = evt.getParent();
									if (evtx.name !== "orderingDiscard") {
										return false;
									}
									const evt2 = evtx.relatedEvent || evtx.getParent();
									if (evt2.name != "useCard") {
										return false;
									}
									return evt.getd?.()?.some(card => get.suit(card, false) === suit);
								})
								.indexOf(trigger) === 0
						);
					})
					.reverse();
			if (name === "phaseBefore" || name === "enterGame") {
				const result =
					suits.length > 1
						? await player
								.chooseControl(suits)
								.set("ai", () => {
									return get.event().controls.randomGet();
								})
								.set("prompt", "异瞳：请记录一个花色")
								.forResult()
						: { control: suits[0] };
				const suit = result.control;
				if (suit) {
					player.markAuto("dcyitong", [suit]);
					player.addTip("dcyitong", get.translation("dcyitong") + player.getStorage("dcyitong").reduce((str, suit) => str + get.translation(suit), ""));
				}
			} else {
				let gains = [];
				for (const suitx of suits) {
					for (const suit of lib.suit.slice().reverse()) {
						if (suitx === suit) {
							continue;
						}
						const card = get.cardPile(card => get.suit(card) === suit && !gains.includes(card));
						if (card) {
							gains.push(card);
						}
					}
				}
				if (gains.length) {
					await player.gain(gains, "gain2");
				}
			}
		},
		onremove(player, skill) {
			delete player.storage[skill];
			player.removeTip(skill);
		},
		intro: { content: "已记录$花色" },
	},
	dcpeiniang: {
		audio: 2,
		mod: {
			cardUsable(card) {
				if (card?.storage?.dcpeiniang) {
					return Infinity;
				}
			},
		},
		locked: false,
		enable: "chooseToUse",
		filterCard(card, player) {
			return player.getStorage("dcyitong").includes(get.suit(card));
		},
		viewAs: {
			name: "jiu",
			storage: { dcpeiniang: true },
		},
		prompt() {
			const player = get.player();
			return "将" + player.getStorage("dcyitong").reduce((str, suit) => str + get.translation(suit), "") + "牌当作【酒】使用";
		},
		check(card, player) {
			return 0 + lib.skill.oljiuchi?.check?.(card, player);
		},
		precontent() {
			event.getParent().addCount = false;
		},
		position: "hes",
		ai: {
			jiuOther: true,
			combo: "dcyitong",
		},
	},
	//谋黄盖
	//时代的♿otto♿
	dcsblieji: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return get.type2(event.card) === "trick" && player.hasCard(card => get.tag(card, "damage") > 0.5, "h");
		},
		frequent: true,
		content() {
			const skill = "dcsblieji_effect";
			player.addTempSkill(skill);
			const cards = player.getCards("h", card => get.tag(card, "damage") > 0.5);
			for (const card of cards) {
				let tag = card.gaintag?.find(tag => tag.startsWith(skill));
				if (tag) {
					player.removeGaintag(tag, [card]);
				}
				tag = tag ? skill + parseFloat(parseInt(tag.slice(skill.length)) + 1) : "dcsblieji_effect1";
				if (!lib.skill[tag]) {
					game.broadcastAll(
						(tag, str) => {
							lib.skill[tag] = {};
							lib.translate[tag] = "烈计+" + str;
						},
						tag,
						tag.slice(skill.length)
					);
				}
				player.addGaintag([card], tag);
			}
		},
		subSkill: {
			effect: {
				audio: "dcsblieji",
				charlotte: true,
				onremove(player, skill) {
					let tags = player.getCards("h", card => card.gaintag?.some(tag => tag.startsWith(skill)));
					if (tags.length) {
						tags = tags
							.slice()
							.map(card => card.gaintag.find(tag => tag.startsWith(skill)))
							.unique();
						tags.forEach(tag => player.removeGaintag(tag));
					}
				},
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					if (!event.card) {
						return false;
					}
					const evt = event.getParent("useCard");
					if (!evt || evt.card !== event.card || evt.cards?.length !== 1) {
						return false;
					}
					return player.hasHistory(
						"lose",
						evtx =>
							evtx.getParent() === evt &&
							Object.keys(evtx.gaintag_map).some(i => {
								return evtx.gaintag_map[i].some(tag => tag.startsWith("dcsblieji_effect"));
							})
					);
				},
				forced: true,
				logTarget: "player",
				content() {
					const skill = "dcsblieji_effect",
						evt = trigger.getParent("useCard");
					const evtx = player.getHistory(
						"lose",
						evtx =>
							evtx.getParent() === evt &&
							Object.keys(evtx.gaintag_map).some(i => {
								return evtx.gaintag_map[i].some(tag => tag.startsWith(skill));
							})
					)[0];
					trigger.num += Object.keys(evtx.gaintag_map).reduce((sum, i) => {
						const tag = evtx.gaintag_map[i].find(tag => tag.startsWith(skill));
						if (tag) {
							sum += parseInt(tag.slice(skill.length));
						}
						return sum;
					}, 0);
				},
			},
		},
	},
	dcsbquzhou: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		frequent: true,
		async content(event, trigger, player) {
			let cards = [];
			while (true) {
				const card = get.cards()[0];
				await game.cardsGotoOrdering(card);
				const judgestr = get.translation(player) + "亮出的第" + get.cnNumber(cards.length + 1, true) + "张【趋舟】牌",
					videoId = lib.status.videoId++;
				game.addVideo("judge1", player, [get.cardInfo(card), judgestr, event.videoId]);
				game.broadcastAll(
					(player, card, str, id, cardid) => {
						let event;
						if (game.online) {
							event = {};
						} else {
							event = _status.event;
						}
						if (game.chess) {
							event.node = card.copy("thrown", "center", ui.arena).addTempClass("start");
						} else {
							event.node = player.$throwordered(card.copy(), true);
						}
						if (lib.cardOL) {
							lib.cardOL[cardid] = event.node;
						}
						event.node.cardid = cardid;
						event.node.classList.add("thrownhighlight");
						ui.arena.classList.add("thrownhighlight");
						event.dialog = ui.create.dialog(str);
						event.dialog.classList.add("center");
						event.dialog.videoId = id;
					},
					player,
					card,
					judgestr,
					videoId,
					get.id()
				);
				game.log(player, "亮出了牌堆顶的", card);
				await game.delay(2);
				game.broadcastAll(id => {
					const dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
					}
					ui.arena.classList.remove("thrownhighlight");
				}, videoId);
				game.addVideo("judge2", null, videoId);
				if (card.name === "sha") {
					if (cards.length) {
						game.broadcastAll(() => ui.clear());
						await game.cardsDiscard(cards);
					}
					if (player.hasUseTarget(card)) {
						await player.chooseUseTarget(card, true, false);
					}
					break;
				} else {
					cards.add(card);
					let result;
					if (cards.length < game.countPlayer()) {
						result = await player.chooseBool("是否继续亮出牌堆顶的牌？").set("frequentSkill", event.name).forResult();
					} else {
						result = { bool: false };
					}
					if (!result.bool) {
						game.broadcastAll(() => ui.clear());
						await player.gain(cards, "gain2");
						break;
					}
				}
			}
		},
		ai: {
			order: 1,
			result: { player: 1 },
		},
	},
	//谋陈琳
	dcsbyaozuo: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		selectTarget: -1,
		multiline: true,
		multitarget: true,
		chooseCard(boss, current) {
			const next = current.chooseCard("he");
			next.set("prompt", "是否交给" + get.translation(boss) + "一张牌？");
			next.set("_global_waiting", true);
			next.set("ai", card => {
				if (get.event("att") > 0) {
					return 6 - get.value(card);
				}
				return 1 - get.value(card);
			});
			next.set("att", get.attitude(current, boss));
			return next;
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			let humans = targets.filter(current => current === game.me || current.isOnline());
			let locals = targets.slice(0).randomSort();
			locals.removeArray(humans);
			const eventId = get.id();
			const send = (boss, current, eventId) => {
				lib.skill.dcsbyaozuo.chooseCard(boss, current, eventId);
				game.resume();
			};
			event._global_waiting = true;
			let time = 10000;
			let giver = [];
			if (lib.configOL && lib.configOL.choose_timeout) {
				time = parseInt(lib.configOL.choose_timeout) * 1000;
			}
			targets.forEach(current => current.showTimer(time));
			if (humans.length > 0) {
				const solve = (result, chooser) => {
					if (result && result.bool) {
						giver.add([chooser, result.cards]);
					}
				};
				await Promise.all(
					humans.map(current => {
						return new Promise((resolve, reject) => {
							if (current.isOnline()) {
								current.send(send, player, current);
								current.wait((result, player) => {
									solve(result, player);
									resolve(void 0);
								});
							} else if (current == game.me) {
								const next = lib.skill.dcsbyaozuo.chooseCard(player, current);
								const solver = (result, player) => {
									solve(result, player);
									resolve(void 0);
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
			if (locals.length > 0) {
				for (const current of locals) {
					const result = await lib.skill.dcsbyaozuo.chooseCard(player, current).forResult();
					if (result && result.bool) {
						giver.add([current, result.cards]);
					}
				}
			}
			delete event._global_waiting;
			for (const i of targets) {
				i.hideTimer();
				if (giver.some(key => i == key[0])) {
					i.popup("交给", "wood");
				} else {
					i.popup("拒绝", "fire");
					player.addTempSkill("dcsbyaozuo_effect");
					player.markAuto("dcsbyaozuo_effect", [i]);
				}
			}
			await game.delay();
			if (!giver.length) {
				return;
			}
			const first = giver[0][0],
				cards = [];
			for (const key of giver) {
				key[0].$giveAuto(key[1], player, false);
				cards.addArray(key[1]);
				game.log(key[0], "交给了", player, "一张牌");
			}
			await player.gain(cards);
			if (first && first.isIn()) {
				game.log(first, "第一个写出了文章");
				await game.delay();
				if (!game.hasPlayer(current => ![first, player].includes(current))) {
					return;
				}
				const result = await first
					.chooseTarget("令" + get.translation(player) + "对一名其他角色发动〖撰文〗", true, function (card, player, target) {
						return !get.event("targets").includes(target);
					})
					.set("targets", [first, player])
					.set("ai", target => {
						const player = get.player(),
							hs = target.countCards("h");
						if (get.attitude(player, target) <= 0 && target.hp <= Math.floor(target.maxHp)) {
							return hs * 2;
						}
						return hs;
					})
					.forResult();
				if (result.bool) {
					const targets = result.targets;
					first.line(targets, "green");
					await player.useSkill("dcsbzhuanwen", null, targets);
				}
			}
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
		derivation: "dcsbzhuanwen",
		subSkill: {
			effect: {
				audio: "dcsbyaozuo",
				onremove: true,
				charlotte: true,
				mark: true,
				intro: {
					content: "本回合下次对$造成的伤害+1",
				},
				trigger: {
					source: "damageBegin1",
				},
				filter(event, player) {
					return player.getStorage("dcsbyaozuo_effect").includes(event.player);
				},
				logTarget: "player",
				forced: true,
				async content(event, trigger, player) {
					trigger.num++;
					player.unmarkAuto(event.name, [trigger.player]);
				},
			},
		},
	},
	dcsbzhuanwen: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.hasPlayer(current => current != player && current.countCards("h"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player(),
						hs = target.countCards("h");
					if (get.attitude(player, target) <= 0 && target.hp <= Math.floor(target.maxHp)) {
						return hs * 2;
					}
					return hs;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (!target.countCards("h")) {
				game.log(target, "没有手牌");
				return;
			}
			let cards = game.cardsGotoOrdering(get.cards(Math.min(5, target.countCards("h")))).cards;
			await player.showCards(cards, get.translation(player) + "发动了〖撰文〗");
			let damages = cards.filter(card => get.tag(card, "damage") && player.canUse(card, target, false)),
				nodamages = cards.filter(card => !get.tag(card, "damage"));
			const list = [`依次对${get.translation(target)}使用${damages.length ? get.translation(damages) : "空气"}`, `令${get.translation(target)}获得${nodamages.length ? get.translation(nodamages) : "空气"}`];
			const result = await player
				.chooseControl("使用伤害牌", "获得非伤害牌")
				.set("choiceList", list)
				.set("prompt", "撰文：请选择一项")
				.set(
					"effect",
					(function () {
						let eff = 0;
						for (let card of damages) {
							eff += get.effect(target, card, player, player);
						}
						for (let card of nodamages) {
							eff -= get.value(card, target) * get.attitude(player, target);
						}
						return eff;
					})()
				)
				.set("ai", () => {
					if (get.event("effect") > 0) {
						return "使用伤害牌";
					}
					return "获得非伤害牌";
				})
				.forResult();
			if (result.control == "使用伤害牌") {
				while (damages.length) {
					let card;
					if (damages.length == 1) {
						card = damages[0];
					} else {
						const result2 = await player
							.chooseButton([`选择要对${get.translation(target)}使用的牌`, damages], true)
							.set("ai", button => {
								const { player, target } = get.event();
								return get.effect(target, button.link, player, player);
							})
							.set("target", target)
							.forResult();
						card = result2.links[0];
					}
					if (player.canUse(card, target, false)) {
						await player.useCard(card, target, false);
					}
					cards.remove(card);
					damages = damages.filter(cardx => card != cardx && player.canUse(cardx, target, false));
				}
			} else {
				cards.removeArray(nodamages);
				await target.gain(nodamages, "gain2");
			}
			await game.cardsGotoPile(cards.reverse(), "insert");
		},
	},
	//武皇甫嵩
	//nnd怎么这么耐改
	dcchaozhen: {
		audio: 2,
		trigger: { player: ["phaseZhunbeiBegin", "dying"] },
		async cost(event, trigger, player) {
			const list = ["场上", "牌堆", "cancel2"];
			if (
				!game.hasPlayer(function (current) {
					return current.countCards("ej");
				})
			) {
				list.remove("场上");
			}
			const control = await player
				.chooseControl(list, () => {
					const player = _status.event.player;
					let cards = game
						.filterPlayer()
						.reduce((arr, current) => {
							if (current.countCards("ej")) {
								arr.addArray(current.getCards("ej"));
							}
							return arr;
						}, [])
						.sort((a, b) => get.number(a, false) - get.number(b, false));
					if (!cards.length) {
						return "牌堆";
					}
					if (player.hp < 1 && get.number(cards[0], false) > 1) {
						return "牌堆";
					}
					cards = cards.filter(card => get.number(card, false) == get.number(cards[0], false));
					let valueCards = cards.filter(card => {
						let owner = get.owner(card);
						if (!owner) {
							return false;
						}
						let att = get.attitude(player, owner);
						if (get.position(card) == "j" && (card.viewAs || card.name) == "jsrg_xumou") {
							att *= -1;
						}
						if (get.position(card) == "e" && get.equipValue(card, owner) > 0) {
							att *= -1;
						}
						return att > 0;
					});
					if (valueCards.length * 2 >= cards.length) {
						return "场上";
					}
					return "牌堆";
				})
				.set("prompt", get.prompt2(event.skill))
				.forResultControl();
			event.result = {
				bool: control != "cancel2",
				cost_data: control,
			};
		},
		async content(event, trigger, player) {
			const control = event.cost_data;
			var num = 1,
				card;

			if (control == "场上") {
				let cards = game
					.filterPlayer()
					.reduce((arr, current) => {
						if (current.countCards("ej")) {
							arr.addArray(current.getCards("ej"));
						}
						return arr;
					}, [])
					.sort((a, b) => get.number(a, false) - get.number(b, false));
				num = get.number(cards[0], false);
				card = cards.filter(card => get.number(card, false) == num).randomGet();
			} else {
				while (num < 14) {
					let cardx = get.cardPile2(card => get.number(card, false) == num);
					if (cardx) {
						card = cardx;
						break;
					} else {
						num++;
					}
				}
			}
			if (card) {
				await player.gain(card, get.owner(card) ? "give" : "gain2");
				if (num == 1) {
					await player.recover();
					player.tempBanSkill("dcchaozhen");
				}
			}
		},
	},
	dclianjie: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
		},
		locked: false,
		filter(event, player) {
			if (
				!game.hasPlayer(current => {
					return current.countCards("h") && !player.getStorage("dclianjie_used").includes(current);
				}) ||
				!player.hasHistory("lose", evt => {
					if ((evt.relatedEvent || evt.getParent()) != event.getParent()) {
						return false;
					}
					return event.cards?.some(card => (evt.hs || []).includes(card));
				}) ||
				!player.countCards("h")
			) {
				return false;
			}
			const num = get.number(event.card, player);
			if (typeof num !== "number" || player.hasCard(card => get.number(card, player) < num, "h")) {
				return false;
			}
			return event.isFirstTarget;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.name.slice(0, -5)), (card, player, target) => {
					return target.countCards("h") && !player.getStorage("dclianjie_used").includes(target);
				})
				//.set("drawed", player.getStorage("dclianjie_used").includes(get.number(trigger.card, player) || 0))
				.set("ai", target => {
					const player = get.player();
					const eff1 = get.effect(target, { name: "guohe_copy2" }, player, player);
					const eff2 = get.effect(target, { name: "draw" }, player, player);
					if (player == target) {
						return eff2 * (1 + player.maxHp - player.countCards("h"));
					} // && !get.event("drawed")
					return eff1;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const num = get.number(trigger.card, player) || 0;
			const target = event.targets[0];
			const cards = target.getCards("h"),
				minNumber = cards.map(card => get.number(card)).sort((a, b) => a - b)[0];
			player.addTempSkill("dclianjie_used");
			player.markAuto("dclianjie_used", target);
			const toLose = cards.filter(card => get.number(card) === minNumber);
			if (target != player || toLose.length <= 1) {
				await target.lose(toLose.randomGet(), ui.cardPile);
			} else {
				const result = await player
					.chooseCard("h", card => get.event("toLose")?.includes(card), true)
					.set("toLose", toLose)
					.set("ai", card => 10 - get.value(card))
					.forResult();
				if (result.bool) {
					await player.lose(result.cards[0], ui.cardPile);
				}
			}
			game.broadcastAll(function (player) {
				var cardx = ui.create.card();
				cardx.classList.add("infohidden");
				cardx.classList.add("infoflip");
				player.$throw(cardx, 1000, "nobroadcast");
			}, target);
			await game.delayx();
			if (player.countCards("h") >= player.maxHp) {
				return;
			}
			const result = await player.drawTo(player.maxHp).forResult();
			if (result) {
				player.addGaintag(result, "dclianjie");
			}
		},
		mod: {
			aiOrder(player, card, num) {
				var number = get.number(card, player);
				if (player.countCards("h") < player.maxHp) {
					return num + number / 10;
				} /*else if (!player.getStorage("dclianjie_used").includes(number)) {
					return num - 0.5;
				}*/
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeGaintag("dclianjie");
				},
				mod: {
					targetInRange(card, player, target) {
						if (get.suit(card) == "unsure") {
							return true;
						}
						if (!card.cards) {
							return;
						}
						for (var i of card.cards) {
							if (i.hasGaintag("dclianjie")) {
								return true;
							}
						}
					},
					cardUsable(card, player, num) {
						if (get.suit(card) == "unsure") {
							return Infinity;
						}
						if (!card.cards) {
							return;
						}
						for (var i of card.cards) {
							if (i.hasGaintag("dclianjie")) {
								return Infinity;
							}
						}
					},
				},
				intro: {
					//${get.translation(storage).replace("13", "K").replace("12", "Q").replace("11", "J").replace("1", "A")}
					content: "已放置：$",
				},
			},
		},
	},
	dcjiangxian: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.addTempSkill(event.name + "_effect");
			const evtx = event.getParent("phase", true, true);
			player
				.when({ global: "phaseAfter" })
				.filter((evt, player) => {
					return evt == evtx && ["dcchaozhen", "dclianjie"].some(skill => player.hasSkill(skill, null, null, false));
				})
				.step(async () => {
					const {
						result: { bool, links },
					} = await player
						.chooseButton(
							[
								"将贤：请选择一项",
								[
									[
										["dcchaozhen", "失去〖朝镇〗"],
										["dclianjie", "失去〖连捷〗"],
									],
									"textbutton",
								],
							],
							true
						)
						.set("filterButton", button => {
							const player = get.player();
							return player.hasSkill(button.link, null, null, false);
						})
						.set("ai", button => {
							if (button.link == "dcchaozhen" && player.getHp() > 2) {
								return 1.1;
							}
							return 1;
						});
					if (bool) {
						await player.removeSkills(links);
					}
				});
		},
		subSkill: {
			effect: {
				audio: "dcjiangxian",
				charlotte: true,
				mark: true,
				intro: {
					//content: "本回合因使用〖连捷〗摸的牌造成的伤害+1，回合结束后失去〖连捷〗或〖朝镇〗",
					content: "本回合因使用〖连捷〗摸的牌造成的伤害+X（X为你本回合造成伤害的次数且至多为5），回合结束后失去〖连捷〗或〖朝镇〗",
				},
				trigger: {
					source: "damageBegin1",
				},
				filter(event, player) {
					if (
						!player.hasHistory("lose", evt => {
							let gaintag = false;
							if ((evt.relatedEvent || evt.getParent()) != event.getParent("useCard")) {
								return false;
							}
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("dclianjie")) {
									gaintag = true;
								}
							}
							return gaintag && event.cards.some(card => (evt.hs || []).includes(card));
						})
					) {
						return false;
					}
					//return true;
					return player.getHistory("sourceDamage").length > 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					trigger.num += Math.min(5, player.getHistory("sourceDamage").length);
				},
			},
		},
		ai: {
			order: 9,
			threaten: 2.9,
			result: {
				player(player) {
					if (!game.hasPlayer(current => get.attitude(player, current) < 0)) {
						return 0;
					}
					return player.countCards("h", card => card.hasGaintag("dclianjie") && player.hasUseTarget(card)) > 2 ? 4 : 0;
				},
			},
			combo: "dclianjie",
		},
	},
	//文鸳
	dckengqiang: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			const num = player.storage.dcshangjue ? 2 : 1;
			return player.getStorage("dckengqiang_used").length < num && get.tag(event.card, "damage") > 0.5;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseButton([
					get.prompt(event.skill, trigger.player),
					[
						[
							["draw", "摸体力上限张牌"],
							["damage", `令${get.translation(trigger.card)}伤害+1` + (trigger.cards?.length ? `并获得${get.translation(trigger.cards)}` : "")],
						],
						"textbutton",
					],
				])
				.set("filterButton", button => {
					const player = get.player();
					return !player.getStorage("dckengqiang_used").includes(button.link);
				})
				.set("ai", button => {
					return get.event("value")[button.link] || 0;
				})
				.set(
					"value",
					(function () {
						let draw = player.maxHp * get.effect(player, { name: "draw" }, player, player),
							damage =
								trigger.targets.reduce((sum, target) => {
									return sum + get.damageEffect(target, player, player);
								}, 0) || 0;
						if (trigger.cards) {
							damage += trigger.cards.reduce((acc, card) => {
								return acc + get.value(card, player);
							}, 0);
						}
						return { damage, draw };
					})()
				)
				.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.links,
			};
		},
		async content(event, trigger, player) {
			const result = event.cost_data[0];
			player.addTempSkill("dckengqiang_used");
			player.markAuto("dckengqiang_used", result);
			if (result == "draw") {
				await player.draw(player.maxHp);
			} else {
				trigger.baseDamage++;
				const cards = trigger.cards?.filterInD("od");
				if (cards.length) {
					await player.gain(cards, "gain2");
				} else {
					await game.delay();
				}
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	dckuichi: {
		audio: 2,
		trigger: {
			player: "phaseEnd",
		},
		filter(event, player) {
			if (
				player
					.getHistory("gain", evt => {
						return evt.getParent().name == "draw" && evt.cards.length;
					})
					.reduce((sum, evt) => sum + evt.cards.length, 0) < player.maxHp
			) {
				return false;
			}
			if (
				player
					.getHistory("sourceDamage", evt => {
						return evt.num > 0;
					})
					.reduce((sum, evt) => sum + evt.num, 0) < player.maxHp
			) {
				return false;
			}
			return true;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.loseHp();
		},
	},
	dcshangjue: {
		skillAnimation: true,
		animationColor: "fire",
		juexingji: true,
		audio: 2,
		derivation: "dckunli",
		trigger: { player: "dying" },
		forced: true,
		filter(event, player) {
			return player.hp < 1;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.storage[event.name] = true;
			await player.recoverTo(1);
			await player.gainMaxHp();
			await player.addSkills("dckunli");
		},
	},
	dckunli: {
		skillAnimation: true,
		animationColor: "fire",
		juexingji: true,
		audio: 2,
		trigger: { player: "dying" },
		forced: true,
		filter(event, player) {
			return player.hp < 2;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recoverTo(2);
			await player.gainMaxHp();
			await player.removeSkills("dckuichi");
		},
	},
	//这是俺拾嘞
	dcsbkongwu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard() {
			const player = get.player();
			return [1, player.maxHp];
		},
		position: "he",
		zhuanhuanji: true,
		marktext: "☯",
		mark: true,
		intro: {
			content(storage, player) {
				return "出牌阶段限一次，你可以弃置至多体力上限张牌并选择一名其他角色，" + (storage ? "视为对其使用等量张【杀】。" : "弃置其等量张牌。") + "若此阶段结束时其手牌数和体力值均不大于你，其下回合摸牌阶段少摸一张牌且装备技能失效。";
			},
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			player.changeZhuanhuanji(event.name);
			if (player.storage.dcsbkongwu) {
				const num = Math.min(event.cards.length, target.countCards("he"));
				if (num > 0) {
					await player.discardPlayerCard("he", target, true, num);
				}
			} else {
				let used = 0,
					card = { name: "sha", isCard: true };
				while (used < event.cards.length && target.isIn() && player.canUse(card, target, false)) {
					used++;
					await player.useCard(card, target, false);
				}
			}
			player
				.when("phaseUseEnd")
				.then(() => {
					if (target.isIn() && target.hp <= player.hp && target.countCards("h") <= player.countCards("h")) {
						player.line(target, "green");
						target.addTempSkill("dcsbkongwu_effect", { player: "phaseEnd" });
					}
				})
				.vars({ target: target });
		},
		//这里需要写ai，但是地方太小我写不下
		check(card) {
			return 4 - get.value(card);
		},
		ai: {
			order: 5,
			result: {
				target: -1,
			},
		},
		getSkills(player) {
			return player.getCards("e").reduce((list, card) => {
				const info = get.info(card);
				if (info && info.skills) {
					return list.addArray(info.skills);
				}
				return list;
			}, []);
		},
		subSkill: {
			effect: {
				trigger: {
					player: ["phaseDrawBegin", "phaseBegin", "equipAfter"],
				},
				direct: true,
				forced: true,
				charlotte: true,
				filter(event, player) {
					if (event.name == "phaseDraw") {
						return !event.numFixed;
					}
					return true;
				},
				content() {
					if (trigger.name == "phaseDraw") {
						trigger.num--;
						player.logSkill(event.name);
					} else {
						player.disableSkill(event.name, lib.skill.dcsbkongwu.getSkills(player));
					}
				},
				onremove(player, skill) {
					player.enableSkill(skill);
				},
				mark: true,
				marktext: "※",
				intro: {
					content: "摸牌阶段少摸一张牌，装备牌失效",
				},
				mod: {
					attackRange(player, num) {
						if (player != _status.currentPhase) {
							return;
						}
						return num + 1 - player.getEquipRange();
					},
					globalFrom(from, to, distance) {
						if (from != _status.currentPhase) {
							return;
						}
						let num = 0;
						for (let i of from.getVCards("e")) {
							const info = get.info(i).distance;
							if (!info) {
								continue;
							}
							if (info.globalFrom) {
								num += info.globalFrom;
							}
						}
						return distance - num;
					},
					globalTo(from, to, distance) {
						if (to != _status.currentPhase) {
							return;
						}
						let num = 0;
						for (let i of to.getVCards("e")) {
							const info = get.info(i).distance;
							if (!info) {
								continue;
							}
							if (info.globalTo) {
								num += info.globalTo;
							}
							if (info.attackTo) {
								num += info.attackTo;
							}
						}
						return distance - num;
					},
				},
			},
		},
	},
	//蒋钦
	dcshangyi: {
		audio: "shangyi",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0 && game.hasPlayer(current => lib.skill.dcshangyi.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target != player;
		},
		async content(event, trigger, player) {
			const target = event.target;
			await target.viewHandcards(player);
			if (!target.countCards("h")) {
				return;
			}
			await player.discardPlayerCard(target, "h", [1, 2], "visible", "是否弃置" + get.translation(target) + "不同花色的黑色牌至多各一张？").set("filterButton", button => {
				if (get.color(button.link) !== "black") {
					return false;
				}
				return ui.selected.buttons?.every(buttonx => {
					return get.suit(buttonx.link) !== get.suit(button.link);
				});
			});
		},
		ai: {
			order: 6,
			result: {
				player: 0.5,
				target(player, target) {
					if (!target.countCards("h")) {
						return 1;
					}
					return -2;
				},
			},
		},
	},
	dcniaoxiang: {
		audio: "zniaoxiang",
		trigger: { player: "useCardToPlayered" },
		forced: true,
		filter(event, player) {
			if (!event.target.inRange(player)) {
				return false;
			}
			return event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const id = trigger.target.playerid;
			const map = trigger.getParent().customArgs;
			if (!map[id]) {
				map[id] = {};
			}
			if (typeof map[id].shanRequired == "number") {
				map[id].shanRequired++;
			} else {
				map[id].shanRequired = 2;
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (!arg.target.inRange(player)) {
					return false;
				}
				if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1) {
					return false;
				}
			},
		},
	},
	//田丰
	dcsuishi: {
		audio: "suishi",
		trigger: {
			global: ["dying", "dieAfter"],
		},
		forced: true,
		logAudio(event, player, name) {
			if (name == "dying") {
				return "suishi1.mp3";
			}
			return "suishi2.mp3";
		},
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			if (event.name == "dying") {
				return event.reason?.name == "damage" && event.reason.source?.group == player.group;
			}
			return event.player?.group == player.group && player.countCards("h");
		},
		async content(event, trigger, player) {
			if (trigger.name == "dying") {
				await player.draw();
			} else {
				await player.chooseToDiscard("h", [1, Infinity], true).set("ai", card => {
					if (get.player().countCards("h") - ui.selected.cards.length > 1) {
						return 2 - get.value(card);
					}
					return 4 - get.value(card);
				});
			}
		},
		ai: {
			halfneg: true,
		},
	},
	//张任
	dcchuanxin: {
		audio: "chuanxin",
		trigger: { source: "damageBegin2" },
		filter(event, player) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			if (!event.card || !["sha", "juedou"].includes(event.card.name)) {
				return false;
			}
			const evt = event.getParent(2);
			return evt.name === "useCard" && evt.card?.name === event.card.name;
		},
		logTarget: "player",
		check(event, player) {
			const target = event.player;
			const bool = target.countDiscardableCards(target, "e") > 0;
			const goon = target.countDiscardableCards(target, "h") >= 2;
			const def = get.damageEffect(target, player, player);
			if (!bool && !goon) {
				return def < 0;
			}
			return (
				Math.min(
					def,
					...(() => {
						let list = [];
						if (bool) {
							list.push(get.effect(target, { name: "guohe_copy", position: "e" }, target, player) * Math.sqrt(target.countDiscardableCards(target, "e")) + get.effect(target, { name: "losehp" }, target, player));
						}
						if (goon) {
							list.push(get.effect(target, { name: "guohe_copy", position: "h" }, target, player) * Math.sqrt(Math.min(2, target.countDiscardableCards(target, "h"))));
						}
						return list;
					})()
				) > 0
			);
		},
		async content(event, trigger, player) {
			trigger.cancel();
			let result;
			const target = event.targets[0];
			const bool = target.countDiscardableCards(target, "e") > 0;
			const goon = target.countDiscardableCards(target, "h") >= 2;
			if (!bool && !goon) {
				return;
			}
			if (bool && goon) {
				result = await target
					.chooseControl()
					.set("choiceList", ["弃置装备区内的所有牌并失去1点体力", "弃置两张手牌，然后非锁定技本回合失效"])
					.set("ai", () => {
						const player = get.player();
						const bool = get.effect(player, { name: "guohe_copy", position: "e" }, player, player) * Math.sqrt(player.countDiscardableCards(player, "e")) + get.effect(player, { name: "losehp" }, player, player);
						const goon = get.effect(player, { name: "guohe_copy", position: "h" }, player, player) * Math.sqrt(Math.min(2, player.countDiscardableCards(player, "h")));
						return bool > goon ? 0 : 1;
					})
					.forResult();
			} else {
				result = { index: bool ? 0 : 1 };
			}
			if (result.index == 1) {
				await target.chooseToDiscard("h", 2, true);
				target.addTempSkill("fengyin");
			} else {
				await target.discard(trigger.player.getDiscardableCards(target, "e"));
				await target.loseHp();
			}
		},
	},
	dcfengshi: {
		audio: "zfengshi",
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (event.card.name != "sha" || event.target.inRange(player)) {
				return false;
			}
			return event.target.getCards("e", card => ["equip2", "equip3"].includes(get.subtype(card))).length;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.choosePlayerCard("e", trigger.target, get.prompt2(event.skill, trigger.target))
				.set("filterButton", button => {
					return ["equip2", "equip3"].includes(get.subtype(button.link));
				})
				.set("ai", button => {
					if (get.attitude(get.player(), get.event().getTrigger().target) > 0) {
						return 0;
					}
					return get.value(button.link) + 1;
				})
				.forResult();
			event.result.targets = [trigger.target];
		},
		async content(event, trigger, player) {
			await event.targets[0].discard(event.cards);
		},
	},
	//谋沮授
	dcsbzuojun: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		async content(event, trigger, player) {
			const target = event.targets[0];
			const { result } = await target.draw(3);
			const {
				result: { index },
			} = await target
				.chooseControl()
				.set("choiceList", [`${get.translation(result)}不能被你使用且不计入你的手牌上限`, `失去1点体力，再摸一张牌并使用其中任意张牌，然后弃置其余牌`])
				.set("ai", () => {
					const player = get.player(),
						cards = get.event("cards");
					let eff = get.effect(player, { name: "losehp" }, player, player) + get.effect(player, { name: "draw" }, player, player);
					for (const card of cards) {
						eff += player.getUseValue(card);
					}
					return eff > 6 ? 1 : 0;
				})
				.set("cards", result);
			if (index == 0) {
				target.addGaintag(result, "dcsbzuojun_tag");
				target.addSkill("dcsbzuojun_effect");
				target
					.when({ player: "phaseEnd" })
					.filter(evt => evt != event.getParent("phase"))
					.assign({
						firstDo: true,
					})
					.then(() => {
						player.removeGaintag("dcsbzuojun_tag", toRemove);
						if (!player.hasCard(card => card.hasGaintag("dcsbzuojun_tag"))) {
							player.removeSkill("dcsbzuojun_effect");
						}
					})
					.vars({ toRemove: result });
			} else {
				await target.loseHp();
				const { result: result2 } = await target.draw();
				let cards = result.slice().concat(result2);
				while (cards.some(i => get.owner(i) == target && target.hasUseTarget(i))) {
					const result = await target
						.chooseToUse(function (card, player, event) {
							if (get.itemtype(card) != "card" || !get.event("cards").includes(card)) {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						}, "佐军：是否使用其中的一张牌？")
						.set("cards", cards)
						.set("addCount", false)
						.forResult();
					if (result.bool) {
						cards.removeArray(result.cards);
						await game.delayx();
					} else {
						break;
					}
				}
				cards = cards.filter(i => get.owner(i) == target);
				if (cards.length) {
					await target.modedDiscard(cards);
				}
			}
		},
		ai: {
			order: 10,
			result: {
				target: 1,
			},
		},
		subSkill: {
			tag: {},
			effect: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("dcsbzuojun_tag");
				},
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("dcsbzuojun_tag")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("dcsbzuojun_tag")) {
							return false;
						}
					},
					cardEnabled(card, player) {
						if (card.cards?.some(i => i.hasGaintag("dcsbzuojun_tag"))) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (card.cards?.some(i => i.hasGaintag("dcsbzuojun_tag"))) {
							return false;
						}
					},
				},
			},
		},
	},
	dcsbmuwang: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
		},
		forced: true,
		filter(event, player) {
			if (player.getHistory("useSkill", evt => evt.skill == "dcsbmuwang").length) {
				return false;
			}
			const filter = card => ["basic", "trick"].includes(get.type(card));
			if (event.name != "cardsDiscard") {
				return event.getd(player, "cards2").filter(filter).length > 0;
			} else {
				if (event.cards.filterInD("d").filter(filter).length <= 0) {
					return false;
				}
				const evt = event.getParent();
				if (evt.name != "orderingDiscard") {
					return false;
				}
				const evtx = evt.relatedEvent || evt.getParent();
				if (evtx.player != player) {
					return false;
				}
				return player.hasHistory("lose", evtxx => {
					return evtx == (evtxx.relatedEvent || evtxx.getParent());
				});
			}
		},
		async content(event, trigger, player) {
			let cards;
			if (trigger.name != "cardsDiscard") {
				cards = trigger.getd(player, "cards2");
			} else {
				cards = trigger.cards.filterInD("d");
			}
			cards = cards.filter(card => ["basic", "trick"].includes(get.type(card)));
			if (cards.length) {
				const next = player.gain(cards.randomGet(), "gain2");
				next.gaintag.add("dcsbmuwang_tag");
				await next;
				player.addTempSkill("dcsbmuwang_lose");
			}
		},
		subSkill: {
			tag: {},
			lose: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("dcsbmuwang_tag");
				},
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (!player.countCards("he")) {
						return false;
					}
					const evt = event.getl(player);
					if (!evt || !evt.cards2 || !evt.cards2.length) {
						return false;
					}
					if (event.name == "lose") {
						return evt.cards2.some(card => (evt.gaintag_map[card.cardid] || []).includes("dcsbmuwang_tag"));
					}
					return player.hasHistory("lose", evt => {
						if (event != evt.getParent()) {
							return false;
						}
						return evt.cards2.some(card => (evt.gaintag_map[card.cardid] || []).includes("dcsbmuwang_tag"));
					});
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					if (player.countCards("he")) {
						await player.chooseToDiscard("he", true);
					}
				},
			},
		},
	},
	//谋汉尼拔
	dcshizha: {
		audio: 2,
		trigger: { global: "useCard" },
		usable: 1,
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			let history = game.getGlobalHistory("everything");
			for (let i = history.length - 1; i >= 0; i--) {
				const evt = history[i];
				if (evt == event || evt.player != event.player) {
					continue;
				}
				if (evt.name == "useCard") {
					return false;
				}
				if (evt.name == "changeHp" && evt.num != 0) {
					return true;
				}
			}
			return false;
		},
		check(event, player) {
			let eff = 0;
			if (event.card.name == "wuxie" || event.card.name == "shan") {
				if (get.attitude(player, event.player) < -1) {
					eff = -1;
				}
			} else if (event.targets && event.targets.length) {
				for (var i = 0; i < event.targets.length; i++) {
					eff += get.effect(event.targets[i], event.card, event.player, player);
				}
			}
			return eff < 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.targets.length = 0;
			trigger.all_excluded = true;
			if (trigger.cards?.someInD()) {
				await player.gain(trigger.cards.filterInD(), "gain2");
			}
		},
	},
	dcgaojian: {
		audio: 2,
		trigger: {
			global: "cardsDiscardAfter",
		},
		filter(event, player) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			var evt = event.getParent();
			if (evt.name != "orderingDiscard") {
				return false;
			}
			var evtx = evt.relatedEvent || evt.getParent();
			return evtx.name == "useCard" && evtx.player == player && get.type2(evtx.card) == "trick";
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					return get.attitude(get.player(), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let showCards = [],
				useCard;
			while (showCards.length < 5) {
				const cards = game.cardsGotoOrdering(get.cards()).cards;
				showCards.addArray(cards);
				target.showCards(cards, get.translation(player) + "发动了【告谏】");
				if (get.type2(cards[0]) == "trick") {
					useCard = cards[0];
					break;
				}
			}
			const goon1 = useCard && target.hasUseTarget(useCard);
			const goon2 = showCards.length > 0 && target.countCards("h") > 0;
			if (!goon1 && !goon2) {
				return;
			}
			let resultx;
			if (!goon1) {
				resultx = { control: "交换牌" };
			} else if (!goon2) {
				resultx = { control: "使用牌" };
			} else {
				resultx = await target
					.chooseControl("使用牌", "交换牌")
					.set("choiceList", [`使用${get.translation(useCard)}`, `使用任意张手牌与${get.translation(showCards)}中的等量牌交换`])
					.set("ai", () => {
						if (_status.event.useValue > 2) {
							return "使用牌";
						}
						return "交换牌";
					})
					.set("useValue", target.getUseValue(useCard))
					.forResult();
			}
			if (resultx.control == "使用牌") {
				await target.chooseUseTarget(useCard, true);
			} else {
				const result = await target
					.chooseToMove("告谏：是否交换其中任意张牌？")
					.set("list", [
						["你的手牌", target.getCards("h"), "dcgaojian_tag"],
						["展示牌", showCards],
					])
					.set("filterMove", (from, to) => {
						return typeof to != "number";
					})
					.set("filterOk", moved => {
						return moved[1].some(card => get.owner(card));
					})
					.set("processAI", list => {
						const num = Math.min(list[0][1].length, list[1][1].length);
						const cards1 = list[0][1].slice().sort((a, b) => get.value(a, "raw") - get.value(b, "raw"));
						const cards2 = list[1][1].slice().sort((a, b) => get.value(b, "raw") - get.value(a, "raw"));
						return [cards1.slice().addArray(cards2.slice(0, num)), cards2.slice().addArray(cards1.slice(0, num))];
					})
					.forResult();
				if (result.bool) {
					const lose = result.moved[1].slice();
					const gain = result.moved[0].slice().filter(i => !get.owner(i));
					if (lose.some(i => get.owner(i))) {
						await target.lose(
							lose.filter(i => get.owner(i)),
							ui.special
						);
					}
					for (let i = lose.length - 1; i--; i >= 0) {
						ui.cardPile.insertBefore(lose[i], ui.cardPile.firstChild);
					}
					game.updateRoundNumber();
					if (gain.length) {
						await target.gain(gain, "draw");
					}
				} else {
					if (!showCards.length) {
						return;
					}
					for (let i = showCards.length - 1; i--; i >= 0) {
						ui.cardPile.insertBefore(showCards[i], ui.cardPile.firstChild);
					}
					game.updateRoundNumber();
				}
			}
		},
	},
	//诸葛京
	dcyanzuo: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + player.countMark("dcyanzuo_add");
		},
		filter(event, player) {
			return player.countCards("he");
		},
		filterCard: true,
		check(card) {
			const player = _status.event.player;
			let val = ["trick", "basic"].includes(get.type(card, player)) ? player.getUseValue(card) : 0,
				now = 0;
			player.getExpansions("dcyanzuo").forEach(i => {
				if (!["trick", "basic"].includes(get.type(i))) {
					return;
				}
				now = Math.max(now, player.getUseValue(i));
			});
			if (val > now) {
				return val + 3;
			}
			if (now <= 0) {
				return val;
			}
			return now * 2 - get.value(card);
		},
		position: "he",
		lose: false,
		discard: false,
		async content(event, trigger, player) {
			const next = player.addToExpansion(event.cards, player, "give");
			next.gaintag.add("dcyanzuo");
			await next;
			const cards = player.getExpansions("dcyanzuo").filter(i => ["trick", "basic"].includes(get.type(i)));
			if (!cards.length) {
				return;
			}
			const result = await player
				.chooseButton(["是否视为使用其中一张牌？", cards])
				.set("filterButton", button => {
					const player = _status.event.player;
					const card = {
						name: get.name(button.link),
						suit: get.suit(button.link),
						// nature: get.nature(button.link),
						nature: button.link.nature,
						isCard: true,
					};
					return player.hasUseTarget(card);
				})
				.set("ai", button => {
					const player = _status.event.player;
					const card = {
						name: get.name(button.link),
						suit: get.suit(button.link),
						nature: get.nature(button.link),
						isCard: true,
					};
					return player.getUseValue(card);
				})
				.forResult();
			if (result.bool) {
				const card = {
					name: get.name(result.links[0]),
					suit: get.suit(result.links[0]),
					nature: get.nature(result.links[0]),
					isCard: true,
				};
				await player.chooseUseTarget(card, true, false);
			}
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_add", false);
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			markcount: "expansion",
			content: "expansion",
			mark(dialog, storage, player) {
				const marks = player.countMark("dcyanzuo_add");
				if (marks > 0) {
					dialog.addText(`〖研作〗发动次数+${marks}`);
				}
				const cards = player.getExpansions("dcyanzuo");
				if (cards.length) {
					dialog.addSmall(cards);
				}
			},
		},
		subSkill: {
			add: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	dczuyin: {
		audio: 2,
		forced: true,
		trigger: {
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			return event.card.name == "sha" || get.type(event.card) == "trick";
		},
		async content(event, trigger, player) {
			const cards = player.getExpansions("dcyanzuo");
			if (cards.some(card => card.name == trigger.card.name)) {
				trigger.getParent().all_excluded = true;
				trigger.getParent().targets.length = 0;
				const discards = cards.filter(card => card.name == trigger.card.name);
				if (discards.length) {
					await player.loseToDiscardpile(discards);
				}
			} else {
				if (player.countMark("dcyanzuo_add") < 2 && player.hasSkill("dcyanzuo", null, null, false)) {
					player.addSkill("dcyanzuo_add");
					player.addMark("dcyanzuo_add", 1, false);
				}
				const card = get.cardPile(card => card.name == trigger.card.name);
				if (card) {
					const next = player.addToExpansion(card, "gain2");
					next.gaintag.add("dcyanzuo");
					await next;
				}
			}
		},
	},
	dcpijian: {
		audio: 2,
		trigger: {
			player: "phaseEnd",
		},
		filter(event, player) {
			return player.getExpansions("dcyanzuo").length >= game.countPlayer();
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), true)
				.set("ai", target => {
					const player = _status.event.player;
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.loseToDiscardpile(player.getExpansions("dcyanzuo"));
			const target = event.targets[0];
			await target.damage(2);
		},
		ai: {
			combo: "dcyanzuo",
		},
	},
	//凌操
	dcdufeng: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		forced: true,
		async content(event, trigger, player) {
			const { result } = await player
				.chooseButton(
					[
						get.translation(event.name) + "：请选择你要执行的选项",
						'<div class="text center">' + lib.translate[event.name + "_info"] + "</div>",
						[
							[
								"失去体力",
								...Array.from({ length: 5 })
									.map((_, i) => {
										const sub = "equip" + (i + 1).toString();
										return [sub, get.translation(sub)];
									})
									.filter(sub => player.hasEnabledSlot(sub[0])),
							],
							"tdnodes",
						],
					],
					[1, 2],
					true
				)
				.set("filterButton", button => {
					if (!ui.selected.buttons.length) {
						return true;
					}
					return (button.link === "失去体力") !== (ui.selected.buttons[0].link === "失去体力");
				})
				.set("ai", button => {
					const player = get.player(),
						choice = button.link;
					const list = Array.from({ length: 5 })
						.map((_, i) => "equip" + (i + 1).toString())
						.filter(sub => player.hasEnabledSlot(sub));
					if (player.getHp() <= 2 && list.length > 1) {
						list.remove("失去体力");
					}
					const listx = list.filter(subtype => subtype !== "失去体力" && !player.getEquips(subtype).length);
					return choice === (listx.length ? listx : list).randomGet() ? 10 : 0;
				});
			if (!result?.links?.length) {
				return;
			}
			if (result.links.includes("失去体力")) {
				await player.loseHp();
			}
			if (result.links.some(sub => sub !== "失去体力")) {
				await player.disableEquip(result.links.filter(sub => sub !== "失去体力")[0]);
			}
			if (!player.isIn()) {
				return;
			}
			const num = Math.min(player.countDisabled() + player.getDamagedHp(), player.maxHp);
			if (num) {
				await player.draw(num);
				player.addTempSkill("dcdufeng_effect");
				player.addMark("dcdufeng_effect", num, false);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "本回合攻击范围与使用【杀】的次数上限均为#" },
				mod: {
					attackRangeBase(player, num) {
						return player.countMark("dcdufeng_effect");
					},
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return player.countMark("dcdufeng_effect");
						}
					},
				},
			},
		},
	},
	//柳婒
	dcjingyin: {
		audio: 2,
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			if (_status.currentPhase === event.player) {
				return false;
			}
			if (!game.hasPlayer(target => target != event.player)) {
				return false;
			}
			return event.card.name == "sha" && event.cards && event.cards.someInD();
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "令一名角色获得" + get.translation(trigger.cards.filterInD()), (card, player, target) => {
					return target != get.event().getTrigger().player;
				})
				.set("ai", target => {
					const player = get.event().player,
						cards = get.event().cards;
					return get.attitude(player, target) * cards.reduce((sum, card) => sum + get.value(card, target), 0);
				})
				.set("cards", trigger.cards.filterInD())
				.forResult();
		},
		usable: 1,
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.addSkill("dcjingyin_tag");
			target.gain(trigger.cards.filterInD(), "gain2").set("gaintag", ["dcjingyin_tag"]);
		},
		subSkill: {
			tag: {
				charlotte: true,
				mod: {
					/*
					targetInRange(card, player, target) {
						if (!card.cards) return;
						if (card.cards.some(i => i.hasGaintag("dcjingyin_tag"))) return true;
					},
					*/
					cardUsable(card, player, target) {
						if (!card.cards) {
							return;
						}
						if (card.cards.some(i => i.hasGaintag("dcjingyin_tag"))) {
							return Infinity;
						}
					},
					aiOrder(player, card, num) {
						if (get.itemtype(card) == "card" && card.hasGaintag("dcjingyin_tag")) {
							return num - 0.1;
						}
					},
				},
			},
		},
	},
	dcchixing: {
		audio: 2,
		trigger: { global: "phaseUseEnd" },
		filter(event, player) {
			return lib.skill.dcchixing.getNum(event).length;
		},
		frequent: true,
		async content(event, trigger, player) {
			const result = await player.draw(lib.skill.dcchixing.getNum(trigger).length).forResult();
			if (Array.isArray(result) && result.some(card => get.name(card, false) == "sha")) {
				await player
					.chooseToUse(function (card) {
						const evt = _status.event;
						if (!lib.filter.cardEnabled(card, evt.player, evt)) {
							return false;
						}
						let cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						return get.itemtype(evt.cards) == "cards" && cards.containsSome(...evt.cards) && get.name(card, false) == "sha";
					}, "迟行：是否使用一张【杀】？")
					.set("cards", result);
			}
		},
		getNum(event) {
			return game
				.getGlobalHistory("everything", evt => {
					if (evt.getParent("phaseUse") != event) {
						return false;
					}
					return evt.name == "cardsDiscard" || (evt.name == "lose" && evt.position == ui.discardPile);
				})
				.reduce((list, evt) => list.addArray(evt.cards.filter(i => i.name == "sha")), []);
		},
	},
	//卞玥
	dcbizu: {
		audio: 2,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return target.countCards("h") == player.countCards("h");
		},
		filterCard: () => false,
		selectCard: [-1, -2],
		prompt: () => {
			const player = get.player();
			const targets = game.filterPlayer(current => current.countCards("h") == player.countCards("h"));
			return "令" + get.translation(targets) + (targets.length > 1 ? "各" : "") + "摸一张牌";
		},
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			await game.asyncDraw(event.targets.sortBySeat());
			if (game.getGlobalHistory("everything", evt => evt.name == "dcbizu" && evt.player == player && evt != event).some(evtx => evtx.targets.length == event.targets.length && evtx.targets.every(i => event.targets.includes(i)))) {
				player.tempBanSkill("dcbizu");
				await player.recover();
			}
		},
		ai: {
			order: 4,
			result: {
				player(player, target) {
					return game.filterPlayer(current => current.countCards("h") == player.countCards("h")).reduce((e, p) => e + get.effect(p, { name: "draw" }, player, player), 0);
				},
			},
		},
	},
	dcwuxie: {
		audio: 2,
		trigger: {
			player: "phaseUseEnd",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player && current.countCards("h"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					return target != player && target.countCards("h");
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
			const cards1 = player.getCards("h", card => get.tag(card, "damage") > 0.5),
				cards2 = target.getCards("h", card => get.tag(card, "damage") > 0.5);
			if (cards1.length) {
				player.$throw(cards1.length, 1000);
				await player.lose(cards1, ui.cardPile);
			}
			/*if (cards2.length) {
				target.$throw(cards2.length, 1000);
				await target.lose(cards2, ui.cardPile);
			}
			await game.delayx();
			if (cards1.length != cards2.length) {
				const recover = cards1.length < cards2.length ? target : player;
				if (!recover.isDamaged()) {
					return;
				}
				const result = await player
					.chooseBool("是否令" + get.translation(recover) + "回复1点体力？")
					.set("choice", get.recoverEffect(recover, player, player) > 0)
					.forResult();
				if (result.bool) {
					await recover.recover();
				}
			}*/
		},
	},
	//朱佩兰
	dccilv: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return get.type(event.card) == "trick" && player.getStorage("dccilv").length < 3;
		},
		async content(event, trigger, player) {
			await player.draw(3 - player.getStorage("dccilv").length);
			if (player.countCards("h") > player.maxHp) {
				let result,
					list = ["无效", "防伤", "获得"].filter(i => !player.getStorage("dccilv").includes(i));
				if (list.length == 1) {
					result = { control: list[0] };
				} else {
					result = await player
						.chooseControl(list)
						.set("prompt", "辞虑：选择执行并移去一项")
						.set("ai", () => {
							const player = get.event("player"),
								trigger = get.event().getTrigger(),
								card = trigger.card;
							let controls = get.event("controls").slice();
							if (controls.includes("防伤")) {
								if (get.tag(card, "damage")) {
									return "防伤";
								} else {
									controls.remove("防伤");
								}
							}
							if (get.effect(player, trigger.card, trigger.player, player) < 0 && controls.includes("无效")) {
								return "无效";
							}
							return controls[controls.length - 1];
						})
						.forResult();
				}
				const choice = result.control;
				player.popup(choice);
				game.log(player, "选择了", "#y" + choice);
				switch (choice) {
					case "无效":
						trigger.getParent().excluded.add(player);
						game.log(trigger.card, "对", player, "无效");
						break;
					case "防伤":
						player.addTempSkill("dccilv_effect");
						player.markAuto("dccilv_effect", [trigger.card]);
						break;
					case "获得":
						player
							.when({ global: "useCardAfter" })
							.filter(evt => evt == trigger.getParent())
							.then(() => {
								const cards = (trigger.cards || []).filterInD();
								if (cards.length) {
									player.gain(cards, "gain2");
								}
							});
						break;
				}
				player.markAuto("dccilv", [choice]);
			}
		},
		mark: true,
		intro: {
			markcount: storage => 3 - (storage || []).length,
			content: storage => ((storage || []).length ? "已移去了" + storage + "项" : "暂未移去任何项"),
		},
		subSkill: {
			effect: {
				audio: "dccilv",
				charlotte: true,
				trigger: { player: "damageBegin4" },
				filter(event, player) {
					const evt = event.getParent(2);
					return evt && evt.name == "useCard" && player.getStorage("dccilv_effect").includes(evt.card);
				},
				forced: true,
				content() {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (player.getStorage("dccilv_effect").includes(card)) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	dctongdao: {
		limited: true,
		audio: 2,
		trigger: { player: "dying" },
		skillAnimation: true,
		animationColor: "fire",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.event("player");
					if (player.hp + player.countCards("hs", card => player.canSaveCard(card, player)) > 0) {
						return target == player ? 1 : 0;
					}
					return target.hp + 114514;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.awakenSkill(event.name);
			const removeSkills = target.getSkills(null, false, false).filter(i => {
				const info = get.info(i);
				return !info || !info.charlotte;
			});
			if (removeSkills.length) {
				target.removeSkill(removeSkills);
			}
			const gainSkills = target.getStockSkills(true, true).filter(i => {
				const info = get.info(i);
				return info && !info.charlotte && (!info.zhuSkill || target.isZhu2());
			});
			if (gainSkills.length) {
				//抽象
				//混沌初开——牢戏
				Object.keys(target.storage)
					.filter(i => gainSkills.some(skill => i.startsWith(skill)))
					.forEach(storage => delete target.storage[storage]);
				target.addSkill(gainSkills);
				const suffixs = ["used", "round", "block", "blocker"];
				for (const skill of gainSkills) {
					const info = get.info(skill);
					if (info.usable !== undefined) {
						if (target.hasSkill("counttrigger") && target.storage.counttrigger[skill] && target.storage.counttrigger[skill] >= 1) {
							delete target.storage.counttrigger[skill];
						}
						if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
							delete target.getStat("skill")[skill];
						}
					}
					if (info.round && target.storage[skill + "_roundcount"]) {
						delete target.storage[skill + "_roundcount"];
					}
					if (target.storage[`temp_ban_${skill}`]) {
						delete target.storage[`temp_ban_${skill}`];
					}
					if (target.awakenedSkills.includes(skill)) {
						target.restoreSkill(skill);
					}
					for (const suffix of suffixs) {
						if (target.hasSkill(skill + "_" + suffix)) {
							target.removeSkill(skill + "_" + suffix);
						}
					}
				}
			}
			if (target != player && target.hp > player.hp) {
				await player.recoverTo(target.hp);
			}
		},
	},
	//张绣
	dcsbfuxi: {
		audio: 2,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			const target = event.player;
			if (!player.countCards("he") && !target.countCards("he") && !player.canUse(new lib.element.VCard({ name: "sha" }), target, false)) {
				return false;
			}
			return event.player != player && event.player.isMaxHandcard();
		},
		async cost(event, trigger, player) {
			const target = trigger.player,
				str = get.translation(target);
			let result;
			if (!player.countCards("he")) {
				result = await player
					.chooseBool(get.prompt(event.skill, target), "弃置" + str + "的一张牌，然后视为对其使用一张【杀】")
					.set("choice", get.effect(target, { name: "guohe_copy2" }, player, player) + get.effect(target, new lib.element.VCard({ name: "sha" }), player, player) > 0)
					.forResult();
				result.index = 1;
			} else if (!target.countCards("he") && !player.canUse(new lib.element.VCard({ name: "sha" }), target, false)) {
				result = await player
					.chooseBool(get.prompt(event.skill, target), "交给" + str + "一张牌，然后摸两张牌")
					.set("choice", get.attitude(player, target) > 0 || player.hasCard(card => card.name == "du", "h"))
					.forResult();
				result.index = 0;
			} else {
				result = await player
					.chooseControl("给牌", "出杀", "cancel2")
					.set("choiceList", ["交给" + str + "一张牌，然后摸两张牌", "弃置" + str + "的一张牌，然后视为对其使用一张【杀】"])
					.set("ai", () => {
						const player = get.event("player"),
							target = get.event("target");
						const num = get.effect(target, { name: "guohe_copy2" }, player, player) + get.effect(target, new lib.element.VCard({ name: "sha" }), player, player);
						if (num <= 0 && get.attitude(player, target) < 0) {
							return "cancel2";
						}
						return get.attitude(player, target) >= 0 ? 0 : 1;
					})
					.set("target", target)
					.forResult();
				result.bool = result.control != "cancel2";
			}
			if (result.bool) {
				result.targets = [target];
				result.cost_data = result.index;
			}
			event.result = result;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			if (event.cost_data == 0) {
				await player.chooseToGive(target, "he", true);
				await player.draw(2);
			} else {
				await player.discardPlayerCard(target, "he", true);
				const sha = new lib.element.VCard({ name: "sha" });
				if (player.canUse(sha, target, false)) {
					await player.useCard(sha, target, false);
				}
			}
		},
	},
	dcsbhaoyi: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return lib.skill.dcsbhaoyi.getCards().length;
		},
		frequent: true,
		prompt(event, player) {
			return get.prompt("dcsbhaoyi") + "（可获得" + get.translation(lib.skill.dcsbhaoyi.getCards()) + "）";
		},
		async content(event, trigger, player) {
			let cardx = lib.skill.dcsbhaoyi.getCards();
			await player.gain(cardx, "gain2");
			cardx = cardx.filter(i => get.owner(i) == player && get.position(i) == "h");
			if (!cardx.length) {
				return;
			}
			if (_status.connectMode) {
				game.broadcastAll(() => (_status.noclearcountdown = true));
			}
			let given_map = [];
			while (player.hasCard(card => cardx.includes(card) && !card.hasGaintag("olsujian_given"), "h")) {
				const {
					result: { bool, cards, targets },
				} = await player
					.chooseCardTarget({
						filterCard(card, player) {
							return get.event("cards").includes(card) && !card.hasGaintag("olsujian_given");
						},
						selectCard: [1, Infinity],
						position: "h",
						filterTarget: lib.filter.notMe,
						prompt: "豪义：请选择要分配的卡牌和目标",
						ai1(card) {
							return !ui.selected.cards.length && card.name == "du" ? 1 : 0;
						},
						ai2(target) {
							const player = get.event("player");
							const card = ui.selected.cards[0];
							if (card) {
								return get.value(card, target) * get.attitude(player, target);
							}
							return 0;
						},
					})
					.set("cards", cardx);
				if (bool) {
					const target = targets[0];
					if (given_map.some(i => i[0] == target)) {
						given_map[given_map.indexOf(given_map.find(i => i[0] == target))][1].addArray(cards);
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
		getCards() {
			let cards = [],
				targets = game.players.slice().concat(game.dead.slice());
			for (const target of targets) {
				const history = target.getHistory("lose", evt => evt.position == ui.discardPile);
				if (history.length) {
					for (const evt of history) {
						cards.addArray(evt.cards2.filterInD("d"));
					}
				}
			}
			const historyx = game.getGlobalHistory("cardMove", evt => evt.name == "cardsDiscard");
			if (historyx.length) {
				for (const evtx of historyx) {
					cards.addArray(evtx.cards.filterInD("d"));
				}
			}
			for (const target of targets) {
				const history = target.getHistory(
					"useCard",
					evt =>
						(evt.cards || []).length &&
						target.getHistory("sourceDamage", evtx => {
							return evtx.card && evtx.card == evt.card;
						}).length
				);
				if (history.length) {
					for (const evt of history) {
						cards.removeArray(evt.cards.filterInD("d"));
					}
				}
			}
			return cards.filter(card => get.tag(card, "damage"));
		},
	},
	//关平
	dcsbwuwei: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + player.countMark("dcsbwuwei_count");
		},
		filter(event, player) {
			const colors = player.getCards("h").reduce((list, card) => list.add(get.color(card)), []);
			return colors.some(color => event.filterCard(get.autoViewAs(lib.skill.dcsbwuwei.viewAs, player.getCards("h", { color: color })), player, event));
		},
		viewAs: { name: "sha", storage: { dcsbwuwei: true } },
		locked: false,
		mod: {
			targetInRange(card) {
				if (card.storage && card.storage.dcsbwuwei) {
					return true;
				}
			},
			cardUsable(card, player, num) {
				if (card.storage && card.storage.dcsbwuwei) {
					return Infinity;
				}
			},
		},
		filterCard: () => false,
		selectCard: -1,
		async precontent(event, _, player) {
			let colors = player.getCards("h").reduce((list, card) => list.add(get.color(card)), []),
				evt = event.getParent();
			colors = colors.filter(color => evt.filterCard(get.autoViewAs(lib.skill.dcsbwuwei.viewAs, player.getCards("h", { color: color })), player, evt));
			colors = colors.map(color => (color == "none" ? "none2" : color));
			const result = await player
				.chooseControl(colors, "cancel2")
				.set("prompt", "武威：将一种颜色的所有手牌当作【杀】使用")
				.set("ai", () => {
					const player = get.event().player;
					let controls = get.event().controls.slice();
					controls.remove("cancel2");
					return controls.sort((a, b) => {
						return player.countCards("h", { color: a == "none2" ? "none" : a }) - player.countCards("h", { color: b == "none2" ? "none" : b });
					})[0];
				})
				.forResult();
			const color = result.control == "none2" ? "none" : result.control;
			if (color == "cancel2") {
				evt.goto(0);
				return;
			}
			player.addTempSkill("dcsbwuwei_effect");
			event.result.cards = player.getCards("h", { color: color });
			event.result.card.cards = player.getCards("h", { color: color });
			event.getParent().addCount = false;
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }, player) - 0.001;
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "useCard" },
				filter(event, player) {
					return (event.card.storage || {}).dcsbwuwei && (event.cards || []).length;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const func = () => {
						const event = get.event();
						const controls = [
							link => {
								const evt = get.event();
								if (evt.dialog && evt.dialog.buttons) {
									for (let i = 0; i < evt.dialog.buttons.length; i++) {
										const button = evt.dialog.buttons[i];
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
								return;
							},
						];
						event.controls = [ui.create.control(controls.concat(["清除选择", "stayleft"]))];
					};
					if (event.isMine()) {
						func();
					} else if (event.isOnline()) {
						event.player.send(func);
					}
					let types = trigger.cards.reduce((list, card) => list.add(get.type2(card, player)), []);
					let result = await player
						.chooseButton(["武威：请选择" + get.cnNumber(types.length) + "次以下项", [["摸一张牌", "令目标角色本回合非锁定技失效", "令本回合〖武威〗可发动次数+1"].map((item, i) => [i, item]), "textbutton"]])
						.set("forced", true)
						.set("selectButton", [types.length, types.length + 1])
						.set("filterButton", button => {
							const selected = ui.selected.buttons.slice().map(i => i.link);
							if (selected.length >= get.event().selectButton[0]) {
								return false;
							}
							return button.link != 1 || !selected.includes(1);
						})
						.set("ai", button => {
							const selected = ui.selected.buttons.slice().map(i => i.link);
							if (get.event().selectButton >= 3) {
								return selected.includes(button.link) ? 0 : 1;
							}
							return [0, 2, 1].slice(0, get.event("selectButton")).includes(button.link) ? 1 : 0;
						})
						.set("custom", {
							add: {
								confirm(bool) {
									if (bool != true) {
										return;
									}
									const event = get.event().parent;
									if (event.controls) {
										event.controls.forEach(i => i.close());
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
										for (let i = 0; i < event.dialog.buttons.length; i++) {
											const button = event.dialog.buttons[i];
											const counterNode = button.querySelector(".caption");
											if (counterNode) {
												counterNode.childNodes[0].innerHTML = ``;
											}
										}
									}
									if (!ui.selected.buttons.length) {
										const evt = event.parent;
										if (evt.controls) {
											evt.controls[0].classList.add("disabled");
										}
									}
								},
							},
							replace: {
								button(button) {
									const event = get.event();
									if (!event.isMine() || !event.filterButton(button)) {
										return;
									}
									if (button.classList.contains("selectable") == false) {
										return;
									}
									button.classList.add("selected");
									ui.selected.buttons.push(button);
									let counterNode = button.querySelector(".caption");
									const count = ui.selected.buttons.filter(i => i == button).length;
									if (counterNode) {
										counterNode = counterNode.childNodes[0];
										counterNode.innerHTML = `×${count}`;
									} else {
										counterNode = ui.create.caption(`<span style="font-family:xinwei; text-shadow:#FFF 0 0 4px, #FFF 0 0 4px, rgba(74,29,1,1) 0 0 3px;">×${count}</span>`, button);
									}
									const evt = event.parent;
									if (evt.controls) {
										evt.controls[0].classList.remove("disabled");
									}
									game.check();
								},
							},
						})
						.forResult();
					if (result.bool) {
						result.links.sort((a, b) => a - b);
						for (const i of result.links) {
							game.log(player, "选择了", "#g【武威】", "的", "#y第" + get.cnNumber(i + 1, true) + "项");
						}
						if (result.links.includes(0)) {
							await player.draw(result.links.filter(count => count == 0).length);
						}
						if (result.links.includes(1)) {
							for (const target of trigger.targets || []) {
								target.addTempSkill("dcsbwuwei_fengyin");
							}
						}
						if (result.links.includes(2)) {
							player.addTempSkill("dcsbwuwei_count");
							player.addMark("dcsbwuwei_count", result.links.filter(count => count == 2).length, false);
						}
						if (
							Array.from({ length: 3 })
								.map((_, i) => i)
								.every(i => result.links.includes(i))
						) {
							trigger.baseDamage++;
							game.log(trigger.card, "造成的伤害", "#y+1");
						}
					}
				},
			},
			count: {
				charlotte: true,
				onremove: true,
				intro: { content: "本回合〖武威〗可发动次数+#" },
			},
			fengyin: {
				inherit: "fengyin",
			},
		},
	},
	//曹昂
	dcsbfengmin: {
		audio: 2,
		trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
		filter(event, player, name, target) {
			if (
				!target ||
				!target.isIn() ||
				!Array.from({ length: 5 })
					.map((_, i) => i + 1)
					.reduce((sum, i) => sum + target.countEmptySlot(i), 0)
			) {
				return false;
			}
			const evt = event.getl(target);
			return evt?.es?.length;
		},
		usable: 1,
		forced: true,
		getIndex(event, player) {
			return game.filterPlayer(target => {
				if (
					!target ||
					!target.isIn() ||
					!Array.from({ length: 5 })
						.map((_, i) => i + 1)
						.reduce((sum, i) => sum + target.countEmptySlot(i), 0)
				) {
					return false;
				}
				const evt = event.getl(target);
				return evt?.es?.length;
			});
		},
		logTarget: (_1, _2, _3, target) => target,
		async content(event, trigger, player) {
			player.addMark("dcsbfengmin", 1, false);
			const target = event.indexedData;
			await player.draw(
				Array.from({ length: 5 })
					.map((_, i) => i + 1)
					.reduce((sum, i) => sum + target.countEmptySlot(i), 0)
			);
			/*if (player.countMark("dcsbfengmin") > player.getDamagedHp()) {
				player.tempBanSkill("dcsbfengmin");
			}*/
		},
		//intro: { content: "本局游戏已发动过#次此技能" },
	},
	dcsbzhiwang: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		async content(event, trigger, player) {
			await player.discardPlayerCard("e", player, player.countCards("e"), true);
			if (
				player.hasHistory("lose", evt => {
					return evt.type == "discard" && evt.getParent(3) == event && evt?.es?.length;
				})
			) {
				const cards = Array.from(ui.discardPile.childNodes).filter(
					card =>
						get.tag(card, "damage") &&
						game.hasPlayer(current => {
							return current != player && current.hasUseTarget(card, true);
						})
				);
				if (!cards?.length) {
					return;
				}
				const result = await player
					.chooseButtonTarget({
						createDialog: ["质亡：令一名其他角色使用一张牌", cards],
						forced: true,
						filterTarget(card, player, target) {
							if (player == target) {
								return false;
							}
							const buttons = ui.selected.buttons;
							return buttons?.length && target.hasUseTarget(buttons[0].link, true);
						},
						ai1(button) {
							let max = 0;
							game.filterPlayer(current => {
								if (current == player || !current.hasUseTarget(button.link, true)) {
									return false;
								}
								max = Math.max(max, current.getUseValue(button.link, true));
							});
							return max;
						},
						ai2(target) {
							const buttons = ui.selected.buttons;
							if (!buttons?.length) {
								return 0;
							}
							return target.getUseValue(buttons[0].link, true);
						},
					})
					.forResult();
				if (result?.bool) {
					const {
						links: [card],
						targets: [target],
					} = result;
					target.addTempSkill("dcsbzhiwang_nosource");
					const map = target.getStorage("dcsbzhiwang_nosource", new Map());
					map.set(player, card);
					target.setStorage("dcsbzhiwang_nosource", map);
					if (target.hasUseTarget(card, true)) {
						await target.chooseUseTarget(card, true, false).set("oncard", (card, target) => {
							const map = target.getStorage("dcsbzhiwang_nosource", new Map());
							map.forEach((cardx, player) => {
								if (card.cards?.includes(cardx)) {
									map.set(player, card);
								}
							});
							target.setStorage("dcsbzhiwang_nosource", map);
						});
					}
				}
			}
		},
		subSkill: {
			nosource: {
				charlotte: true,
				onremove: true,
				trigger: {
					source: "damageBefore",
				},
				silent: true,
				filter(event, player) {
					const list = player.getStorage("dcsbzhiwang_nosource", new Map());
					const card = list.get(event.player);
					return event.source && card && get.autoViewAs(card) == event.card;
				},
				async content(event, trigger, player) {
					delete trigger.source;
				},
			},
		},
	},
	/*dcsbzhiwang: {
		audio: 2,
		trigger: { player: "dying" },
		filter(event, player) {
			const evt = event.getParent(),
				evtx = event.getParent(3);
			if (!evt || evt.name != "damage" || !evtx || evtx.name != "useCard") {
				return false;
			}
			return game.hasPlayer(target => target != player);
		},
		usable: 1,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), lib.filter.notMe)
				.set("ai", target => {
					return get.attitude(get.event("player"), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			if (trigger.source) {
				delete trigger.source;
			}
			if (trigger.getParent().source) {
				delete trigger.getParent().source;
			}
			event.targets[0].addTempSkill("dcsbzhiwang_effect");
			event.targets[0].markAuto("dcsbzhiwang_effect", [player]);
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					let cards = game
						.getGlobalHistory("everything", evt => {
							if (evt.name != "dying") {
								return false;
							}
							if (!player.getStorage("dcsbzhiwang_effect").includes(evt.player)) {
								return false;
							}
							const evtx = evt.getParent(3);
							return (evtx.cards || []).someInD("d");
						})
						.reduce((cards, evt) => cards.addArray(evt.getParent(3).cards.filterInD("d")), []);
					while (cards.length) {
						const result = await player
							.chooseButton(["质亡：是否使用其中的一张牌？", cards])
							.set("filterButton", button => {
								return get.event("player").hasUseTarget(button.link, false);
							})
							.set("ai", button => {
								if (button.link.name == "jiu") {
									return 10;
								}
								return get.event("player").getUseValue(button.link);
							})
							.forResult();
						if (result.bool) {
							const card = result.links[0];
							cards.remove(card);
							player.$gain2(card, false);
							await game.delayx();
							await player.chooseUseTarget(true, card, false);
						}
					}
				},
				intro: { content: "本回合结束时，可以使用令$进入濒死的牌" },
			},
		},
	},*/
	//典韦
	dcsbkuangzhan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") < player.maxHp;
		},
		async content(event, trigger, player) {
			await player.drawTo(player.maxHp);
			let num = 0;
			player.getHistory("gain", evt => {
				if (evt.getParent(event.name) == event) {
					num += evt.cards.length;
				}
			});
			while (num > 0 && player.countCards("h")) {
				num--;
				if (!game.hasPlayer(current => player.canCompare(current))) {
					break;
				}
				const result = await player
					.chooseTarget("狂战：与一名角色拼点", true, function (card, player, target) {
						return target != player && player.canCompare(target);
					})
					.set("ai", function (target) {
						const player = get.player();
						if (target.countCards("h") >= player.countCards("h")) {
							return 0;
						}
						return get.effect(target, { name: "sha" }, player, player) + 1;
					})
					.forResult();
				const target = result.targets[0];
				const compare = await player.chooseToCompare(target).forResult();
				if (!player.storage[event.name]) {
					player.storage[event.name] = [];
					player.when({ global: "phaseEnd" }).then(() => {
						delete player.storage.dcsbkuangzhan;
					});
				}
				if (compare.bool) {
					player.storage[event.name].add(target);
					let card = { name: "sha", isCard: true };
					let targets = player.storage[event.name].filter(current => current != player && player.canUse(card, current, false));
					await player.useCard(card, targets, false);
				} else {
					player.storage[event.name].add(player);
					let card = { name: "sha", isCard: true };
					if (target.canUse(card, player, false)) {
						await target.useCard(card, player, false);
					}
				}
			}
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					let num = player.maxHp - player.countCards("h");
					for (let i of game.players) {
						if (get.attitude(player, i) <= 0) {
							num -= i.countCards("h");
						}
					}
					if (num <= 0) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	dcsbkangyong: {
		audio: 2,
		trigger: {
			player: ["phaseBegin", "phaseEnd"],
		},
		filter(event, player, name) {
			if (name == "phaseBegin") {
				return player.isDamaged();
			}
			return event.kangyongRecover && player.hp > 1;
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername == "phaseBegin") {
				const num = player.maxHp - player.hp;
				await player.recover(num);
				trigger.kangyongRecover = num;
			} else {
				const num = Math.min(player.hp - 1, trigger.kangyongRecover);
				if (num > 0) {
					await player.loseHp(num);
				}
			}
		},
	},
	//诸葛瑾
	dcsbtaozhou: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => {
				if (current.hasSkill("dcsbzijin")) {
					return false;
				}
				return current.countCards("h") > 0 && current !== player;
			});
		},
		derivation: "dcsbzijin",
		chooseButton: {
			dialog() {
				return ui.create.dialog("###讨州###请选择一个数字（对其他角色不可见）");
			},
			chooseControl(event, player) {
				const list = [1, 2, 3];
				list.push("cancel2");
				return list;
			},
			check() {
				const event = get.event(),
					player = get.player();
				if (
					game.hasPlayer(current => {
						return current !== player && get.attitude(player, current) < 0;
					})
				) {
					return [0, 1, 2].randomGet();
				}
				if (player.hasShan()) {
					return 2;
				}
				const rand = event.getRand();
				if (rand < 0.2) {
					return 0;
				}
				if (rand < 0.5) {
					return 1;
				}
				return 2;
			},
			backup(result, player) {
				return {
					audio: "dcsbtaozhou",
					chosenNumber: result.index + 1,
					filterCard: () => false,
					selectCard: -1,
					filterTarget(card, player, target) {
						return target.countCards("h") > 0 && target !== player;
					},
					async content(event, trigger, player) {
						const [target] = event.targets;
						const chosenNumber = get.info("dcsbtaozhou_backup").chosenNumber;
						const cards = await target
							.chooseToGive(`${get.translation(player)}对你发动了【讨州】`, "你可以交给其至多三张手牌", [1, 3], player)
							.set("ai", card => {
								if (get.event("att") > 0) {
									if (get.event("chosenNumber") < ui.selected.cards.length + (get.event().getRand() < 0.5)) {
										return 5.1 - get.value(card);
									}
									return 0;
								}
								if (ui.selected.cards.length > 1) {
									return -get.value(card);
								}
								if (ui.selected.cards.length > 0) {
									return 3.6 - get.value(card);
								}
								return 4.6 - get.value(card);
							})
							.set("att", get.attitude(target, player))
							.set("chosenNumber", chosenNumber)
							.forResultCards();
						const givenCount = (cards && cards.length) || 0;
						const delta = Math.abs(givenCount - chosenNumber);
						if (givenCount >= chosenNumber) {
							await game.asyncDraw([player, target]);
						} else {
							target.addSkill("dcsbtaozhou_debuff");
							target.addMark("dcsbtaozhou_debuff", delta, false);
						}
						if (delta >= 2) {
							const sha = get.autoViewAs({ name: "sha" });
							if (target.canUse(sha, player, false)) {
								await target.addSkills("dcsbzijin");
							}
						}
						const roundNumberToRestore = game.roundNumber + chosenNumber;
						player.tempBanSkill("dcsbtaozhou", "forever");
						player
							.when({ global: "roundStart" })
							.filter(() => {
								return game.roundNumber >= roundNumberToRestore;
							})
							.assign({
								firstDo: true,
							})
							.then(() => {
								delete player.storage[`temp_ban_dcsbtaozhou`];
							});
					},
					ai: {
						result: {
							player: 0.5,
							target() {
								const chosenNumber = get.info("dcsbtaozhou_backup").chosenNumber;
								if (chosenNumber > 1) {
									return -1;
								}
								return 0;
							},
						},
					},
				};
			},
			prompt: () => "请选择【讨州】的目标",
		},
		subSkill: {
			backup: {},
			debuff: {
				trigger: { player: "damageBegin3" },
				forced: true,
				charlotte: true,
				async content(event, trigger, player) {
					trigger.num++;
					player.removeMark("dcsbtaozhou_debuff", 1, false);
					if (!player.countMark("dcsbtaozhou_debuff")) {
						player.removeSkill("dcsbtaozhou_debuff");
					}
				},
				intro: {
					content: "下&次受到伤害时，伤害+1",
				},
			},
		},
		ai: {
			order: 9.6,
			result: {
				player: 1,
			},
		},
	},
	dcsbzijin: {
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			return !game.hasPlayer2(current => {
				return current.hasHistory("damage", evt => evt.card === event.card);
			}, true);
		},
		forced: true,
		async content(event, trigger, player) {
			const bool = await player
				.chooseToDiscard("自矜：弃置一张牌或失去1点体力", "he")
				.set("ai", card => {
					const player = get.player();
					if (get.effect(player, { name: "losehp" }, player, player) > 0) {
						return 0;
					}
					return 5 - get.value(card);
				})
				.forResultBool();
			if (!bool) {
				await player.loseHp();
			}
		},
		ai: {
			effect: {
				player_use(card, player) {
					if (get.effect(player, { name: "losehp" }, player) > 0) {
						return;
					}
					if (!get.tag(card, "damage") && get.value(card) < 5) {
						return [
							0.2,
							player.hasCard(card => {
								return get.value(card) < 3;
							}, "he")
								? -0.1
								: -2,
						];
					}
				},
			},
			neg: true,
		},
	},
	dcsbhoude: {
		audio: 2,
		trigger: {
			target: "useCardToTargeted",
		},
		filter(event, player) {
			const phaseUse = event.getParent("phaseUse");
			if (!phaseUse || phaseUse.name !== "phaseUse" || phaseUse.player === player) {
				return false;
			}
			const filter = card => {
				const color = get.color(card);
				return (get.name(card) === "sha" && color === "red") || (get.type(card) === "trick" && color === "black");
			};
			const evt = event.getParent();
			if (
				game
					.getGlobalHistory(
						"useCard",
						evt => {
							return filter(evt.card);
						},
						evt
					)
					.indexOf(evt) !== 0
			) {
				return false;
			}
			return filter(event.card);
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			let result;
			if (get.name(trigger.card) === "sha") {
				result = await player
					.chooseToDiscard(get.prompt(event.skill, target), `弃置一张牌，令${get.translation(trigger.card)}对你无效。`, "chooseonly", "he")
					.set("ai", card => {
						if (!get.event("goon")) {
							return 0;
						}
						return 5.5 - get.value(card);
					})
					.set("goon", get.effect(player, trigger.card, target, player) < 0)
					.forResult();
			} else {
				result = await player
					.choosePlayerCard(`###${get.prompt(event.skill, target)}###<div class="text center">弃置其的一张牌，令${get.translation(trigger.card)}对你无效。</div>`, target, "he")
					.set("ai", button => {
						if (!get.event("goon")) {
							return 0;
						}
						const val = get.buttonValue(button);
						if (get.attitude(get.player(), get.owner(button.link)) > 0) {
							return -val;
						}
						return val;
					})
					.set("goon", get.effect(player, trigger.card, target, player) < 0)
					.forResult();
			}
			if (result.bool) {
				event.result = {
					bool: true,
					cost_data: {
						cards: result.cards,
						links: result.links,
					},
				};
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			const result = event.cost_data;
			if (result.links && result.links.length) {
				await target.discard(result.links, "notBySelf").set("discarder", player);
			} else {
				await player.discard(result.cards);
			}
			trigger.excluded.add(player);
		},
	},
	//谋贾诩
	dcsbsushen: {
		limited: true,
		audio: 2,
		audioname: ["dc_sb_jiaxu_shadow"],
		enable: "phaseUse",
		skillAnimation: true,
		animationColor: "soil",
		content() {
			player.awakenSkill(event.name);
			player.storage.dcsbsushen_reload = [Boolean(player.storage.dcsbfumou), player.countCards("h"), player.getHp()];
			player.addSkill("dcsbsushen_reload");
			player.addSkills("dcsbrushi");
		},
		derivation: "dcsbrushi",
		subSkill: {
			reload: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: {
					content(storage) {
						return ["【覆谋】状态：" + ["阳", "阴"][storage[0] ? 1 : 0], "手牌数：" + storage[1], "体力值：" + storage[2]].join("<br>");
					},
				},
			},
		},
		ai: {
			//waiting for PZ157
		},
	},
	dcsbrushi: {
		limited: true,
		audio: 2,
		audioname: ["dc_sb_jiaxu_shadow"],
		enable: "phaseUse",
		filter(event, player) {
			return Array.isArray(player.storage.dcsbsushen_reload);
		},
		skillAnimation: true,
		animationColor: "thunder",
		*content(event, map) {
			const player = map.player,
				storage = player.storage.dcsbsushen_reload;
			player.awakenSkill(event.name);
			player.removeSkill("dcsbsushen_reload");
			if (Boolean(player.storage.dcsbfumou) !== storage[0]) {
				if (player.hasSkill("dcsbfumou", null, null, false)) {
					player.changeZhuanhuanji("dcsbfumou");
				}
			}
			if (player.countCards("h") != storage[1]) {
				if (player.countCards("h") < storage[1]) {
					yield player.drawTo(storage[1]);
				} else {
					yield player.chooseToDiscard("h", true, player.countCards("h") - storage[1]);
				}
			}
			if (player.getHp() != storage[2]) {
				yield player[player.getHp() > storage[2] ? "loseHp" : "recover"](Math.abs(player.getHp() - storage[2]));
			}
			if (player.getStat("skill").dcsbfumou) {
				delete player.getStat("skill").dcsbfumou;
			}
		},
		ai: {
			//waiting for PZ157
		},
	},
	dcsbfumou: {
		audio: 2,
		audioname: ["dc_sb_jiaxu_shadow"],
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => {
				return target != player && target.countCards("h");
			});
		},
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			if (!ui.selected.targets.length) {
				return target.countCards("h");
			}
			return !player.storage.dcsbfumou && game.countPlayer(target => target != player) > 1;
		},
		selectTarget() {
			const player = get.event("player");
			if (game.countPlayer(target => target != player) == 1) {
				return [1, 2];
			}
			return player.storage.dcsbfumou ? [1, 2] : 2;
		},
		targetprompt() {
			const player = get.event("player");
			if (game.countPlayer(target => target != player) == 1) {
				return "";
			}
			return player.storage.dcsbfumou ? "" : ["看牌角色", "得牌角色"][ui.selected.targets.length - 1];
		},
		prompt() {
			const player = get.event("player");
			return lib.skill.dcsbfumou.intro.content(player.storage.dcsbfumou);
		},
		usable: 1,
		complexTarget: true,
		complexSelect: true,
		multitarget: true,
		async content(event, trigger, player) {
			const storage = player.storage.dcsbfumou,
				target = event.targets[0],
				num = Math.ceil(target.countCards("h") / 2);
			player.changeZhuanhuanji("dcsbfumou");
			let cards = await player
				.choosePlayerCard("覆谋：选择展示" + get.translation(target) + "的至多" + get.cnNumber(num) + "张牌", target, "h", [1, num], true)
				.set("ai", card => {
					const player = get.event("player"),
						storage = get.event("storage"),
						target = get.event().getParent().targets[0];
					if (!storage) {
						return get.value(card) * -get.attitude(player, target);
					}
					return target.getUseValue(card, false) * get.attitude(player, target);
				})
				.set("visible", true)
				.set("storage", storage)
				.forResult("cards");
			if (!cards.length) {
				return;
			}
			await player.showCards(cards, get.translation(player) + "发动了【覆谋】");
			if (!storage) {
				const aim = event.targets[1];
				if (aim) {
					cards = cards.filter(card => lib.filter.canBeGained(card, aim, target));
					if (cards.length) {
						await aim.gain(cards, target, "give");
						await game.asyncDraw([player, target], cards.length);
					} else {
						aim.popup("杯具");
						aim.chat("555一张都拿不到");
					}
				} else {
					player.chat("只是看看，但给不了...");
				}
			} else {
				for (const card of cards) {
					if (target.hasUseTarget(card, false)) {
						await target.chooseUseTarget(card, true, false, "nodistance").set("oncard", card => {
							game.log(_status.event.card, "不可被响应");
							_status.event.directHit.addArray(game.players);
						});
					}
				}
			}
		},
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			player.changeSkin({ characterName: "dc_sb_jiaxu" }, "dc_sb_jiaxu" + (player.storage[skill] ? "_shadow" : ""));
		},
		marktext: "☯",
		mark: true,
		intro: {
			content(storage) {
				if (storage) {
					return "转换技，出牌阶段限一次，你可以观看一名其他角色的手牌并展示其至多一半手牌，令其依次使用这些牌中所有其可以使用的牌（无距离限制且不可被响应）。";
				}
				return "转换技，出牌阶段限一次，你可以观看一名其他角色A的手牌并展示其至多一半手牌并将这些牌交给另一名其他角色B，然后你与A各摸X张牌（X为A以此法失去的手牌数）。";
			},
		},
		ai: {
			order: 7,
			result: {
				player(player, target) {
					const storage = player.storage.dcsbfumou;
					if (!storage && !ui.selected.targets.length) {
						return Math.ceil(target.countCards("h") / 2);
					}
					return 0;
				},
				target(player, target) {
					const storage = player.storage.dcsbfumou;
					if (storage) {
						return target.countCards("h") * get.threaten(target, player);
					}
					let att = get.attitude(player, target);
					if (!ui.selected.targets.length) {
						if (
							att > 0 &&
							game.hasPlayer(cur => {
								return cur !== player && cur !== target && get.attitude(player, cur) > 0;
							})
						) {
							return target.countCards("h") / get.threaten(target, player) / 10;
						}
						return -Math.ceil(target.countCards("h") / 2);
					}
					return Math.ceil(ui.selected.targets[0].countCards("h") / 2);
				},
			},
		},
		group: "dcsbfumou_change",
		subSkill: {
			change: {
				audio: "dcsbfumou",
				audioname: ["dc_sb_jiaxu_shadow"],
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【覆谋】为状态" + (player.storage.dcsbfumou ? "阳" : "阴");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("dcsbfumou");
				},
			},
		},
	},
	//关樾
	dcshouzhi: {
		audio: 2,
		trigger: {
			global: "phaseEnd",
		},
		filter(event, player) {
			let delt = 0;
			player.checkHistory("lose", evt => {
				delt -= evt.hs.length;
			});
			player.checkHistory("gain", evt => {
				delt += evt.cards.length;
			});
			return delt < 0 || (delt > 0 && player.countCards("h"));
		},
		locked(skill, player) {
			return !(player && player.storage.dcshouzhi_modified);
		},
		derivation: ["dcshouzhi_modified"],
		onremove: ["dcshouzhi_modified"],
		async cost(event, trigger, player) {
			let delt = 0;
			player.checkHistory("lose", evt => {
				delt -= evt.hs.length;
			});
			player.checkHistory("gain", evt => {
				delt += evt.cards.length;
			});
			const forced = !player.storage.dcshouzhi_modified;
			if (delt < 0) {
				const bool = forced ? true : await player.chooseBool(get.prompt(event.skill), "你可以摸两张牌。").forResultBool();
				event.result = { bool };
			} else {
				const next = player.chooseCard("守执：请弃置一张手牌").set("filterCard", (card, player) => {
					return lib.filter.cardDiscardable(card, player, "dcshouzhi");
				});
				next.set("forced", forced);
				if (!forced) {
					next.set("prompt", get.prompt(event.skill))
						.set("prompt2", "你可以弃置一张手牌。")
						.set("ai", card => {
							const player = get.player();
							if (player.hasSkill("dcxingmen") && get.recoverEffect(player, player) > 0) {
								return 6 - get.value(card);
							}
							return 0;
						});
				}
				event.result = await next.forResult();
			}
		},
		async content(event, trigger, player) {
			const { cards } = event;
			if (cards && cards.length) {
				await player.discard(cards);
			} else {
				await player.draw(2);
			}
			await game.delayx();
		},
	},
	dcfenhui: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		filterTarget(card, player, target) {
			const list = get.event("dcfenhui_enabled");
			if (!list || !list.length) {
				return false;
			}
			return list.includes(target);
		},
		onChooseToUse(event) {
			if (game.online) {
				return;
			}
			const player = event.player;
			const evts = player.getAllHistory("useCard", evt => {
				return evt.targets && evt.targets.length;
			});
			event.set(
				"dcfenhui_enabled",
				game.filterPlayer(current => {
					return evts.filter(evt => evt.targets.includes(current)).length;
				})
			);
		},
		skillAnimation: true,
		animationColor: "fire",
		derivation: ["dcxingmen"],
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const target = event.target;
			const count = player.getAllHistory("useCard", evt => {
				return evt.targets && evt.targets.includes(target);
			}).length;
			target.addMark("dcfenhui_mark", Math.min(5, count));
			await player.draw(Math.min(5, count));
			player.addSkill("dcfenhui_effect");
		},
		subSkill: {
			effect: {
				audio: "dcfenhui",
				trigger: {
					global: ["damageBegin1", "die"],
				},
				filter(event, player) {
					return event.player.hasMark("dcfenhui_mark");
				},
				logTarget: "player",
				forced: true,
				charlotte: true,
				async content(event, trigger, player) {
					if (trigger.name === "damage") {
						trigger.player.removeMark("dcfenhui_mark", 1);
						trigger.num++;
					} else {
						await player.loseMaxHp();
						player.storage.dcshouzhi_modified = true;
						await player.addSkills("dcxingmen");
					}
				},
			},
			mark: {
				marktext: "恨",
				intro: {
					name: "恨(奋恚)",
					name2: "恨",
					content: "mark",
				},
			},
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					if (
						!player.hasCard(card => {
							return get.tag(card, "damage") && player.canUse(card, target, true, true) && get.effect(target, card, player, player) > 0;
						}, "hs")
					) {
						return 0;
					}
					const count = Math.min(
						5,
						player.getAllHistory("useCard", evt => {
							return evt.targets && evt.targets.includes(target);
						}).length
					);
					let value = Math.max(player.getHp(true), 3) - count;
					if (
						(count - 1) *
							(target.hasSkillTag("filterDamage", null, {
								player: player,
							})
								? 1
								: 2) >=
						target.getHp(true) +
							target.countCards("hs", card => {
								return target.canSaveCard(card, target);
							})
					) {
						value -= 2;
					}
					return Math.min(0, value);
				},
			},
		},
	},
	dcxingmen: {
		audio: 2,
		trigger: {
			player: "loseAfter",
		},
		filter(event, player) {
			return event.getParent(2).name === "dcshouzhi" && player.isDamaged();
		},
		frequent: true,
		prompt2: "你可以回复1点体力。",
		group: ["dcxingmen_norespond"],
		check(event, player) {
			return get.recoverEffect(player, player) > 0;
		},
		async content(event, trigger, player) {
			await player.recover();
		},
		subSkill: {
			norespond: {
				audio: "dcxingmen",
				trigger: {
					player: "gainAfter",
				},
				filter(event, player) {
					return event.getParent().name === "draw" && event.cards.length >= 2 && event.cards.some(card => get.color(card) === "red");
				},
				forced: true,
				locked: false,
				popup: false,
				async content(event, trigger, player) {
					player.addGaintag(
						trigger.cards.filter(card => get.color(card) === "red"),
						"dcxingmen"
					);
					player.addSkill("dcxingmen_directHit");
				},
			},
			directHit: {
				audio: "dcxingmen",
				trigger: { player: "useCard" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return player.hasHistory("lose", evt => {
						if ((evt.relatedEvent || evt.getParent()) !== event) {
							return false;
						}
						return Object.values(evt.gaintag_map).some(tags => tags.includes("dcxingmen"));
					});
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.filterPlayer());
					game.log(trigger.card, "不可被响应");
				},
			},
		},
	},
	//武关羽
	dcjuewu: {
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			if (
				!player.hasCard(card => {
					return _status.connectMode || get.number(card) === 2;
				}, "hes")
			) {
				return false;
			}
			for (const name of ["shuiyanqijuny"].concat(lib.inpile)) {
				if (player.getStorage("dcjuewu_used").includes(name)) {
					continue;
				}
				const card = get.autoViewAs({ name }, "unsure");
				if (!get.tag(card, "damage")) {
					continue;
				}
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
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			if (player.getStorage("dcjuewu_used").includes(name)) {
				return false;
			}
			if (
				!player.hasCard(card => {
					return _status.connectMode || get.number(card) === 2;
				}, "hes")
			) {
				return false;
			}
			return get.tag({ name }, "damage");
		},
		group: "dcjuewu_inTwo",
		chooseButton: {
			dialog(event, player) {
				let list = get.inpileVCardList(info => {
					return get.tag({ name: info[2] }, "damage");
				});
				if (!list.some(info => info[2] === "shuiyanqijuny")) {
					list.add(["锦囊", "", "shuiyanqijuny"]);
				}
				list = list.filter(info => {
					const name = info[2],
						nature = info[3];
					if (player.getStorage("dcjuewu_used").includes(name)) {
						return false;
					}
					const card = get.autoViewAs({ name, nature }, "unsure");
					return event.filterCard(card, player, event);
				});
				return ui.create.dialog("绝武", [list, "vcard"]);
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
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
					audio: "dcjuewu",
					filterCard(card, player) {
						return get.number(card) === 2;
					},
					position: "hes",
					check(card) {
						return 8 - get.value(card);
					},
					popname: true,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					precontent() {
						if (!player.storage.dcjuewu_used) {
							player.when({ global: "phaseAfter" }).then(() => {
								delete player.storage.dcjuewu_used;
							});
						}
						player.markAuto("dcjuewu_used", event.result.card.name);
					},
				};
			},
			prompt(links, player) {
				return "将一张点数为2的牌当" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		subSkill: {
			backup: {},
			inTwo: {
				audio: "dcjuewu",
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					const cards = event.getg(player);
					if (!cards.length) {
						return false;
					}
					return game.hasPlayer(current => {
						if (current === player) {
							return false;
						}
						const evt = event.getl(current);
						if (!evt) {
							return false;
						}
						return evt.hs.some(i => cards.includes(i)) || evt.es.some(i => cards.includes(i)) || evt.js.some(i => cards.includes(i));
					});
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					let gcards = trigger.getg(player),
						cards = [];
					game.countPlayer(current => {
						if (current === player) {
							return false;
						}
						const evt = trigger.getl(current);
						if (!evt) {
							return false;
						}
						cards.addArray(evt.hs.filter(i => gcards.includes(i)));
						cards.addArray(evt.es.filter(i => gcards.includes(i)));
						cards.addArray(evt.js.filter(i => gcards.includes(i)));
					});
					player.addGaintag(cards, "dcjuewu_two");
					player.addSkill("dcjuewu_two");
				},
			},
			two: {
				charlotte: true,
				mod: {
					cardnumber(card) {
						if (card.hasGaintag("dcjuewu_two")) {
							return 2;
						}
					},
				},
			},
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			skillTagFilter(player) {
				if (
					!player.hasCard(card => {
						return _status.connectMode || get.number(card) === 2;
					}, "hes")
				) {
					return false;
				}
			},
			order: 7,
			result: {
				player(player) {
					if (get.event("dying")) {
						return get.attitude(player, get.event("dying"));
					}
					return 1;
				},
			},
		},
	},
	dcwuyou: {
		audio: 2,
		global: "dcwuyou_g",
		subSkill: {
			g: {
				audio: "dcwuyou",
				forceaudio: true,
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					if (!player.countCards("h")) {
						return false;
					}
					return game.hasPlayer(current => {
						return current.hasSkill("dcwuyou");
					});
				},
				filterCard: true,
				filterTarget(card, player, target) {
					return target.hasSkill("dcwuyou");
				},
				selectTarget() {
					const count = game.countPlayer(current => {
						return current.hasSkill("dcwuyou");
					});
					return count > 1 ? 1 : -1;
				},
				check(card) {
					const player = get.player();
					const hasFriend = game.hasPlayer(current => {
						return current.hasSkill("dcwuyou") && get.attitude(player, current) > 0;
					});
					return (hasFriend ? 7 : 1) - get.value(card);
				},
				prompt() {
					const player = get.player(),
						list = game.filterPlayer(current => {
							return current.hasSkill("dcwuyou");
						}),
						list2 = list.filter(current => current !== player);
					const moreThanOne = list.length > 1,
						includesMe = list.includes(player);
					let str = "选择一张手牌，";
					if (includesMe) {
						str += `点击“确定”，${moreThanOne ? "或" : ""}`;
					}
					if (moreThanOne || !includesMe) {
						str += `将此牌交给${get.translation(list2)}${list2.length > 1 ? "中的一人" : ""}，`;
					}
					str += "然后执行后续效果。";
					return str;
				},
				discard: false,
				lose: false,
				delay: false,
				async content(event, trigger, player) {
					const { target } = event;
					const isMe = target === player;
					let { cards } = event;
					if (!isMe) {
						await player.give(cards, target);
					}
					const names = lib.inpile
						.filter(name => {
							return get.type2(name) !== "equip";
						})
						.randomGets(5);
					if (names.includes("sha")) {
						names.splice(names.indexOf("sha") + 1, 0, ...lib.inpile_nature.map(nature => ["sha", nature]));
					}
					const vcard = names.map(namex => {
						let name = namex,
							nature;
						if (Array.isArray(namex)) {
							[name, nature] = namex;
						}
						const info = [get.type(name), "", name, nature];
						return info;
					});
					const links = await target
						.chooseButton(["武佑：选择一个牌名", [vcard, "vcard"]], true)
						.set("user", player)
						.set("ai", button => {
							const player = get.player(),
								user = get.event("user");
							return user.getUseValue({ name: button.link[2], nature: button.link[3] }) * get.attitude(player, user);
						})
						.forResultLinks();
					if (!links || !links.length) {
						return;
					}
					const viewAs = { name: links[0][2], nature: links[0][3] };
					if (!isMe) {
						cards = await target
							.chooseToGive(player)
							.set("ai", card => {
								const player = get.event("player"),
									target = get.event().getParent().player;
								if (get.attitude(player, target) <= 0) {
									return 0;
								}
								return 6 - get.value(card);
							})
							.forResultCards();
					}
					if (!cards) {
						return;
					}
					const card = cards[0];
					if (player.getCards("h").includes(card)) {
						if (!player.storage.dcwuyou_transfer) {
							player.storage.dcwuyou_transfer = {};
						}
						player.storage.dcwuyou_transfer[card.cardid] = viewAs;
						player.addGaintag(cards, "dcwuyou_transfer");
						player.addSkill("dcwuyou_transfer");
					}
				},
				ai: {
					order: 10,
					result: {
						player(player, target) {
							if (get.attitude(player, target) > 0) {
								return 1;
							}
							return 0;
						},
						target: 0.5,
					},
				},
			},
			transfer: {
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					if (event.addCount === false) {
						return false;
					}
					return player.hasHistory("lose", evt => {
						if ((evt.relatedEvent || evt.getParent()) != event) {
							return false;
						}
						for (const i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("dcwuyou_transfer")) {
								return true;
							}
						}
						return false;
					});
				},
				async content(event, trigger, player) {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] === "number") {
						stat[name]--;
					}
				},
				mod: {
					cardname(card, player) {
						const map = player.storage.dcwuyou_transfer;
						if (map && map[card.cardid] && get.itemtype(card) == "card" && card.hasGaintag("dcwuyou_transfer")) {
							return map[card.cardid].name;
						}
					},
					cardnature(card, player) {
						const map = player.storage.dcwuyou_transfer;
						if (map && map[card.cardid] && get.itemtype(card) == "card" && card.hasGaintag("dcwuyou_transfer")) {
							return map[card.cardid].nature || false;
						}
					},
					cardUsable(card) {
						if (!card.cards) {
							return;
						}
						if (card.cards.some(card => card.hasGaintag("dcwuyou_transfer"))) {
							return Infinity;
						}
					},
					targetInRange(card, player) {
						if (!card.cards) {
							return;
						}
						if (card.cards.some(card => card.hasGaintag("dcwuyou_transfer"))) {
							return true;
						}
					},
				},
			},
		},
	},
	dcyixian: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog("义贤：你可以选择一项", "hidden");
				dialog.add([
					[
						["field", "获得场上的所有装备牌"],
						["discardPile", "获得弃牌堆中的所有装备牌"],
					],
					"textbutton",
				]);
				return dialog;
			},
			check(button) {
				const player = get.player();
				if (button.link == "field") {
					return game
						.filterPlayer()
						.map(current => {
							const cards = current.getCards("e"),
								att = get.sgnAttitude(player, current);
							return cards
								.map(card => {
									return Math.max(player.hasSkill("dcjuewu") ? 5 : 0, get.value(card, player)) - get.value(card, current) * att;
								})
								.reduce((p, c) => p + c, 0);
						})
						.reduce((p, c) => p + c, 0);
				}
				if (button.link == "discardPile") {
					return Array.from(ui.discardPile.childNodes)
						.filter(card => {
							return get.type(card) === "equip";
						})
						.map(card => {
							return Math.max(player.hasSkill("dcjuewu") ? 5 : 0, get.value(card, player));
						})
						.reduce((p, c) => p + c, 0);
				}
				return 0.1;
			},
			backup(links) {
				return {
					audio: "dcyixian",
					filterCard: () => false,
					selectCard: -1,
					pos: links[0],
					filterTarget: () => false,
					selectTarget: -1,
					skillAnimation: true,
					animationColor: "metal",
					async content(event, trigger, player) {
						player.awakenSkill("dcyixian");
						const position = lib.skill.dcyixian_backup.pos;
						let cards = [];
						if (position === "field") {
							cards.addArray(
								game
									.filterPlayer()
									.map(current => current.getCards("e"))
									.flat()
							);
						} else {
							cards.addArray(
								Array.from(ui.discardPile.childNodes).filter(card => {
									return get.type(card) === "equip";
								})
							);
						}
						if (!cards.length) {
							return;
						}
						await player.gain(cards, position === "field" ? "give" : "gain2");
						const pairs = game.filterPlayer().map(current => {
							let lostNum = 0;
							current.checkHistory("lose", evt => {
								if (evt.getParent(2) === event) {
									lostNum += evt.cards2.length;
								}
							});
							return [current, lostNum];
						});
						for (const pair of pairs) {
							const [target, num] = pair;
							if (!num) {
								continue;
							}
							const bool = await player
								.chooseBool(`是否令${get.translation(target)}摸${get.cnNumber(num)}张牌并回复1点体力？`)
								.set("choice", get.effect(target, { name: "draw" }, player, player) + get.recoverEffect(target, player, player) / 5 > 0)
								.forResultBool();
							if (bool) {
								player.line(target, "green");
								await target.draw(num);
								await target.recover();
							}
							if (!event.isMine() && !event.isOnline()) {
								await game.delayx();
							}
						}
					},
				};
			},
			prompt(links) {
				return `点击“确定”，从${links[0] === "field" ? "场上" : "弃牌堆中"}获得所有装备牌`;
			},
		},
		subSkill: {
			backup: {},
		},
		ai: {
			order: 10,
			threaten: 2.9,
			result: {
				player(player) {
					const enemies = game.filterPlayer(current => {
							return (!get.rawAttitude || get.rawAttitude(player, current) < 0) && get.attitude(player, current) >= 0;
						}),
						knownEnemies = game.filterPlayer(current => {
							return get.attitude(player, current) < 0;
						});
					if ((!knownEnemies.length && player.countCards("e") > 1) || (player.getHp() > 3 && enemies.length > 0 && knownEnemies.length < 2 && knownEnemies.length < enemies.length && !knownEnemies.some(enemy => get.attitude(player, enemy) <= -9))) {
						return 0;
					}
					const val1 = game
						.filterPlayer()
						.map(current => {
							const cards = current.getCards("e"),
								att = get.sgnAttitude(player, current);
							return cards
								.map(card => {
									return Math.max(player.hasSkill("dcjuewu") ? 5 : 0, get.value(card, player)) - get.value(card, current) * att;
								})
								.reduce((p, c) => p + c, 0);
						})
						.reduce((p, c) => p + c, 0);
					const val2 = Array.from(ui.discardPile.childNodes)
						.filter(card => {
							return get.type(card) === "equip";
						})
						.map(card => {
							return Math.max(player.hasSkill("dcjuewu") ? 5 : 0, get.value(card, player));
						})
						.reduce((p, c) => p + c, 0);
					return Math.max(val1, val2) > 20 ? 4 : 0;
				},
			},
		},
	},
	//SP甄宓
	dcjijie: {
		audio: 2,
		trigger: {
			global: ["gainAfter", "loseAsyncAfter", "recoverAfter"],
		},
		getIndex(event, player) {
			if (event.name !== "loseAsync") {
				return [[event.player]];
			}
			return [
				game
					.filterPlayer(current => {
						return current !== player && _status.currentPhase !== current && event.getg(current).length > 0;
					})
					.sortBySeat(),
			];
		},
		filter(event, player, triggername, targets) {
			if (player.getStorage("dcjijie_used").includes(event.name == "recover" ? "recover" : "draw")) {
				return false;
			}
			if (event.name === "recover") {
				return targets[0] !== player && _status.currentPhase !== targets[0] && player.isDamaged();
			}
			return targets.some(current => {
				return current !== player && _status.currentPhase !== current && event.getg(current).length > 0;
			});
		},
		forced: true,
		logTarget(event, player, triggername, targets) {
			return targets;
		},
		async content(event, trigger, player) {
			player.addTempSkill("dcjijie_used");
			if (trigger.name === "recover") {
				player.markAuto("dcjijie_used", ["recover"]);
				await player.recover(trigger.num);
			} else {
				const count = game.countPlayer(current => {
					if (current === player || _status.currentPhase === current) {
						return 0;
					}
					return trigger.getg(current).length;
				});
				player.markAuto("dcjijie_used", ["draw"]);
				await player.draw(count);
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	dchuiji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		chooseButton: {
			dialog(event, player) {
				const name = get.translation(event.result.targets[0]);
				const dialog = ui.create.dialog(
					`惠济：请选择要令${name}执行的选项`,
					[
						[
							["draw", "令其摸两张牌"],
							["equip", "令其随机使用牌堆中的一张装备牌"],
						],
						"textbutton",
					],
					"hidden"
				);
				return dialog;
			},
			filter(button, player) {
				const target = get.event().getParent().result.targets[0];
				if (button.link === "equip" && target.isMin()) {
					return false;
				}
				return true;
			},
			check(button) {
				const player = get.player(),
					target = get.event().getParent().result.targets[0];
				const link = button.link;
				const att = Math.sign(get.attitude(player, target));
				const drawWugu = target.countCards("h") + 2 >= game.countPlayer();
				if (link === "draw") {
					return (drawWugu ? -1 : 2) * att;
				}
				return 1;
			},
			backup(links) {
				return {
					audio: "dchuiji",
					target: get.event().result.targets[0],
					link: links[0],
					filterTarget(card, player, target) {
						return target === lib.skill.dchuiji_backup.target;
					},
					selectTarget: -1,
					async content(event, trigger, player) {
						const link = lib.skill.dchuiji_backup.link;
						const { target } = event;
						if (link === "draw") {
							await target.draw(2);
						} else {
							const card = get.cardPile2(card => {
								if (get.type(card) !== "equip") {
									return false;
								}
								return target.canUse(card, target) && !get.cardtag(card, "gifts");
							});
							if (card) {
								await target.chooseUseTarget(card, true).set("nopopup", true);
							} else {
								game.log("但是牌堆里没有", target, "的装备！");
								await game.delayx();
							}
						}
						if (target.countCards("h") >= game.countPlayer()) {
							target.addTempSkill("dchuiji_effect");
							target.markAuto("dchuiji_effect", [event]);
							const card = new lib.element.VCard({ name: "wugu", storage: { fixedShownCards: [] } });
							if (target.hasUseTarget(card)) {
								await target.chooseUseTarget(card, true, false);
							}
						}
					},
				};
			},
			prompt(links) {
				return "点击“确定”以执行效果";
			},
		},
		subSkill: {
			backup: {},
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { player: "wuguContentBeforeBefore", global: "wuguRemained" },
				filter(event, player) {
					if (!player.getStorage("dchuiji_effect").includes(event.getParent(3))) {
						return false;
					}
					return event.name == "wuguContentBefore" || event.remained.someInD();
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					if (trigger.name == "wuguContentBefore") {
						trigger.card.storage ??= {};
						trigger.card.storage.fixedShownCards = player.getCards("h");
					} else {
						const remained = trigger.remained.filterInD();
						if (remained.length) {
							player.gain(remained, "gain2");
						}
					}
				},
			},
		},
		ai: {
			order(item, player) {
				if (!game.hasPlayer(current => current !== player && get.attitude(player, current) > 0) && game.hasPlayer(current => get.attitude(player, current) <= 0)) {
					return 10;
				}
				if (
					game.hasPlayer(current => {
						const del = player.countCards("h") - current.countCards("h"),
							toFind = [2, 4].find(num => Math.abs(del) === num);
						if (toFind === 4 && del < 0 && get.attitude(player, current) <= 0) {
							return true;
						}
						return false;
					})
				) {
					return 10;
				}
				return 1;
			},
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					const wugu = target.countCards("h") + 2 > game.countPlayer();
					if (wugu) {
						return Math.min(0, att) * Math.min(3, target.countCards("h"));
					}
					return Math.max(0, att) * Math.min(3, target.countCards("h"));
				},
			},
		},
	},
	//曹芳
	dczhimin: {
		audio: 2,
		trigger: { global: "roundStart" },
		filter(event, player) {
			return game.hasPlayer(current => current != player && current.countCards("h")) && player.getHp() > 0;
		},
		forced: true,
		group: ["dczhimin_mark", "dczhimin_draw"],
		async content(event, trigger, player) {
			const targets = await player
				.chooseTarget(
					`置民：请选择至多${get.cnNumber(player.getHp())}名其他角色`,
					"你获得这些角色各自手牌中的随机一张点数最小的牌",
					(card, player, target) => {
						return target !== player && target.countCards("h");
					},
					[1, player.getHp()],
					true
				)
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "shunshou_copy", position: "h" }, player, player) + 0.1;
				})
				.forResultTargets();
			if (!targets || !targets.length) {
				return;
			}
			targets.sortBySeat(trigger.player);
			player.line(targets, "thunder");
			const toGain = [];
			for (const target of targets) {
				const cards = target.getCards("h"),
					minNumber = cards.map(card => get.number(card)).sort((a, b) => a - b)[0];
				const gainableCards = cards
					.filter(card => {
						return get.number(card) === minNumber && lib.filter.canBeGained(card, player, target);
					})
					.randomSort();
				toGain.push(gainableCards[0]);
			}
			if (toGain.length) {
				await player.gain(toGain, "giveAuto");
			}
			await game.delayx();
		},
		ai: {
			threaten: 5.8,
		},
		mod: {
			aiOrder(player, card, num) {
				if (
					num > 0 &&
					get.itemtype(card) === "card" &&
					card.hasGaintag("dczhimin_tag") &&
					player.countCards("h", cardx => {
						return cardx.hasGaintag("dczhimin_tag") && cardx !== card;
					}) < player.maxHp
				) {
					return num / 10;
				}
			},
		},
		subSkill: {
			mark: {
				audio: "dczhimin",
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				forced: true,
				filter(event, player) {
					if (_status.currentPhase === player || !event.getg(player).some(card => get.position(card) === "h" && get.owner(card) === player)) {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					player.addGaintag(
						trigger.getg(player).filter(card => get.position(card) === "h" && get.owner(card) === player),
						"dczhimin_tag"
					);
				},
			},
			draw: {
				audio: "dczhimin",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				filter(event, player) {
					const evt = event.getl(player);
					if (!evt.hs.length) {
						return false;
					}
					return Object.values(evt.gaintag_map).flat().includes("dczhimin_tag");
				},
				async content(event, trigger, player) {
					const count = player.maxHp - player.countCards("h");
					if (count <= 0) {
						return;
					}
					await player.draw(count);
				},
			},
		},
	},
	dcjujian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		zhuSkill: true,
		filter(event, player) {
			return game.hasPlayer(current => {
				return player.hasZhuSkill("dcjujian", current) && current.group === "wei" && current !== player;
			});
		},
		filterTarget(_, player, target) {
			return player.hasZhuSkill("dcjujian", target) && target.group === "wei" && target !== player;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw();
			target.addTempSkill("dcjujian_forbid", "roundStart");
			target.markAuto("dcjujian_forbid", player);
		},
		ai: {
			result: {
				target(player, target) {
					const num = target.countCards("hs", card => {
							return get.type(card) == "trick" && target.canUse(card, player) && get.effect(player, card, target, player) < -2;
						}),
						att = get.attitude(player, target);
					if (att < 0) {
						return -0.74 * num;
					}
					return 1.5;
				},
			},
		},
		subSkill: {
			forbid: {
				audio: "dcjujian",
				trigger: {
					player: "useCardToBefore",
				},
				filter(event, player) {
					if (get.type(event.card) !== "trick") {
						return false;
					}
					return player.getStorage("dcjujian_forbid").includes(event.target);
				},
				forced: true,
				charlotte: true,
				onremove: true,
				direct: true,
				async content(event, trigger, player) {
					await trigger.target.logSkill("dcjujian_forbid", player);
					trigger.cancel();
				},
				intro: {
					content: "使用普通锦囊牌对$无效",
				},
				ai: {
					effect: {
						player(card, player, target, current) {
							if (get.type(card) == "trick" && player.getStorage("dcjujian_forbid").includes(target)) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	//谋司马懿
	dcsbquanmou: {
		audio: 2,
		audioname: ["dc_sb_simayi_shadow"],
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			player.changeSkin({ characterName: "dc_sb_simayi" }, "dc_sb_simayi" + (player.storage[skill] ? "_shadow" : ""));
		},
		marktext: "☯",
		enable: "phaseUse",
		filter(event, player) {
			const selected = player.getStorage("dcsbquanmou_selected");
			return game.hasPlayer(current => !selected.includes(current) && player.inRange(current) && current.countCards("he") > 0);
		},
		filterTarget(card, player, target) {
			if (player === target) {
				return false;
			}
			const selected = player.getStorage("dcsbquanmou_selected");
			return !selected.includes(target) && player.inRange(target) && target.countCards("he") > 0;
		},
		prompt() {
			const player = get.player();
			if (player.storage.dcsbquanmou) {
				return "转换技。出牌阶段每名角色限一次，你可以令一名攻击范围内的其他角色交给你一张牌。当你于本阶段内下次对其造成伤害后，你可以选择除其外的至多三名其他角色，对这些角色依次造成1点伤害。";
			}
			return "转换技。出牌阶段每名角色限一次，你可以令一名攻击范围内的其他角色交给你一张牌。当你于本阶段内下次对其造成伤害时，取消之。";
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.changeZhuanhuanji("dcsbquanmou");
			player.markAuto("dcsbquanmou_selected", [target]);
			const cards = await target.chooseCard("he", true, `选择交给${get.translation(player)}一张牌`).forResultCards();
			if (cards && cards.length) {
				await target.give(cards, player);
				const key = `dcsbquanmou_${Boolean(!player.storage.dcsbquanmou)}`;
				player.addTempSkill(key, { global: ["phaseUseBefore", "phaseChange"] });
				player.markAuto(key, [target]);
				target.addAdditionalSkill(`${key}_${player.playerid}`, `${key}_mark`);
			}
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					if (player.storage.dcsbquanmou) {
						return 1;
					}
					return 1 + game.countPlayer(i => player !== i && target !== i && !i.hasSkill("false_mark") && get.attitude(player, i) < 0);
				},
				target(player, target) {
					let res = target.hasSkillTag("noh") ? 0 : -1;
					if (player.storage.dcsbquanmou) {
						return res + 0.6;
					}
					return res;
				},
			},
		},
		onremove: true,
		mark: true,
		intro: {
			content: storage => {
				if (storage) {
					return "转换技。出牌阶段每名角色限一次，你可以令一名攻击范围内的其他角色交给你一张牌。当你于本阶段内下次对其造成伤害后，你可以选择除其外的至多三名其他角色，对这些角色依次造成1点伤害。";
				}
				return "转换技。出牌阶段每名角色限一次，你可以令一名攻击范围内的其他角色交给你一张牌。当你于本阶段内下次对其造成伤害时，取消之。";
			},
		},
		group: "dcsbquanmou_change",
		subSkill: {
			change: {
				audio: "dcsbquanmou",
				audioname: ["dc_sb_simayi_shadow"],
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【权谋】为状态" + (player.storage.dcsbquanmou ? "阳" : "阴");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("dcsbquanmou");
				},
			},
			true: {
				charlotte: true,
				audio: "dcsbquanmou",
				audioname: ["dc_sb_simayi_shadow"],
				trigger: { source: "damageSource" },
				forced: true,
				popup: false,
				filter(event, player) {
					return player.getStorage("dcsbquanmou_true").includes(event.player);
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					player.getStorage("dcsbquanmou_true").remove(target);
					target.removeAdditionalSkill(`dcsbquanmou_true_${player.playerid}`);
					if (game.hasPlayer(current => current != player && current != target)) {
						const result = await player
							.chooseTarget([1, 3], `权谋：是否对${get.translation(target)}之外的至多三名其他角色各造成1点伤害？`, (card, player, target) => {
								return target != player && target != get.event().getTrigger().player;
							})
							.set("ai", target => {
								const player = get.player();
								return get.damageEffect(target, player, player);
							})
							.forResult();
						if (result.bool) {
							await player.logSkill("dcsbquanmou", result.targets);
							for (let i of result.targets) {
								if (i.isIn()) {
									await i.damage();
								}
							}
						}
					}
				},
				onremove(player, skill) {
					game.filterPlayer(current => {
						current.removeAdditionalSkill(`${skill}_${player.playerid}`);
					});
					delete player.storage[skill];
					delete player.storage.dcsbquanmou_selected;
				},
			},
			true_mark: {
				charlotte: true,
				mark: true,
				marktext: "讨",
				intro: {
					name: "权谋 - 阴",
					content: () => {
						return `当你下次受到${get.translation(_status.currentPhase)}造成的伤害后，其可以对除你之外的至多三名其他角色各造成1点伤害。`;
					},
				},
				ai: {
					threaten: 2.5,
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage") && player && player.hasSkill("dcsbquanmou_true")) {
								let tars = game.countPlayer(i => player !== i && target !== i && get.attitude(player, target) < 0 && !target.hasSkill("dcsbquanmou_false_mark"));
								return [1, 0, 1, (6 * Math.min(3, tars)) / (3 + Math.pow(target.countCards("h"), 2))];
							}
						},
					},
				},
			},
			false: {
				charlotte: true,
				audio: "dcsbquanmou",
				audioname: ["dc_sb_simayi_shadow"],
				trigger: { source: "damageBegin2" },
				forced: true,
				filter(event, player) {
					return player.getStorage("dcsbquanmou_false").includes(event.player);
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					player.getStorage("dcsbquanmou_false").remove(target);
					target.removeAdditionalSkill(`dcsbquanmou_false_${player.playerid}`);
					trigger.cancel();
				},
				onremove(player, skill) {
					game.filterPlayer(current => {
						current.removeAdditionalSkill(`${skill}_${player.playerid}`);
					});
					delete player.storage[skill];
					delete player.storage.dcsbquanmou_selected;
				},
			},
			false_mark: {
				charlotte: true,
				mark: true,
				marktext: "抚",
				intro: {
					name: "权谋 - 阳",
					content: () => {
						return `当你下次受到${get.translation(_status.currentPhase)}造成的伤害时，防止此伤害。`;
					},
				},
				ai: {
					nodamage: true,
					nofire: true,
					nothunder: true,
					skillTagFilter(player, tag, arg) {
						return arg && arg.player && arg.player.hasSkill("dcsbquanmou_false");
					},
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage") && player && player.hasSkill("dcsbquanmou_false")) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	dcsbpingliao: {
		audio: 2,
		audioname: ["dc_sb_simayi_shadow"],
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha";
		},
		logTarget(event, player) {
			return game.filterPlayer(current => player.inRange(current));
		},
		async content(event, trigger, player) {
			const unrespondedTargets = [];
			const respondedTargets = [];
			let nonnonTargetResponded = false;
			const targets = game.filterPlayer().sortBySeat();
			const prompt = `###是否打出红色基本牌响应${get.translation(player)}？###${get.translation(player)}使用了一张不公开目标的${get.translation(trigger.card)}。若你选择响应且你不是此牌的隐藏目标，则其摸两张牌；若你选择不响应且你是此牌的隐藏目标，则你本回合内不能使用或打出手牌。`;
			for (let target of targets) {
				if (target.isIn() && player.inRange(target)) {
					const result = await target
						.chooseToRespond(prompt, (card, player) => {
							if (get.type(card) !== "basic") {
								return false;
							}
							const color = get.color(card);
							return color == "red" || color == "unsure";
						})
						.set("ai", card => {
							const player = get.player(),
								event = get.event();
							const source = event.getParent().player;
							//是队友且没有其他疑似队友的选手响应 那响应一下
							if (get.attitude(player, source) > 0) {
								if (
									!event.respondedTargets.some(current => {
										return get.attitude(player, current) > 0 || get.attitude(source, current) >= 0;
									})
								) {
									return get.order(card);
								}
								return -1;
							} else {
								//不残或者没有其他的闪就不响应
								if (
									player.hp > 1 ||
									!player.hasCard("hs", i => {
										if (i == card || (card.cards && card.cards.includes(i))) {
											return false;
										}
										let name = get.name(i, player);
										return name == "shan" || name == "tao" || name == "jiu";
									})
								) {
									return 0;
								}
							}
							return event.getRand("dcsbpingliao") > 1 / Math.max(1, player.hp) ? 0 : get.order(card);
						})
						.set("respondedTargets", respondedTargets)
						.forResult();
					if (result.bool) {
						respondedTargets.push(target);
						if (!trigger.targets.includes(target)) {
							nonnonTargetResponded = true;
						}
						await game.delay();
					} else if (trigger.targets.includes(target)) {
						unrespondedTargets.push(target);
					}
				}
			}
			unrespondedTargets.forEach(current => {
				current.addTempSkill("dcsbpingliao_blocker");
				game.log(current, "本回合内无法使用或打出手牌");
			});
			if (nonnonTargetResponded) {
				player.draw(2);
				player.addTempSkill("dcsbpingliao_buff", { global: "phaseChange" });
				player.addMark("dcsbpingliao_buff", 1, false);
			}
		},
		ai: {
			ignoreLogAI: true,
			skillTagFilter(player, tag, args) {
				if (args) {
					return args.card && get.name(args.card) == "sha";
				}
			},
		},
		group: "dcsbpingliao_hide",
		subSkill: {
			hide: {
				audio: "dcsbpingliao",
				trigger: { player: "useCard0" },
				forced: true,
				filter(event, player) {
					return event.card.name == "sha";
				},
				async content(event, trigger, player) {
					trigger.hideTargets = true;
					game.log(player, "隐藏了", trigger.card, "的目标");
				},
			},
			buff: {
				onremove: true,
				charlotte: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("dcsbpingliao_buff");
						}
					},
				},
				mark: true,
				intro: {
					content: "本阶段内使用【杀】的次数上限+#",
				},
			},
			blocker: {
				charlotte: true,
				mod: {
					cardEnabled2(card, player) {
						if (player.getCards("h").includes(card)) {
							return false;
						}
					},
				},
				mark: true,
				marktext: "封",
				intro: {
					content: "本回合内不能使用或打出手牌",
				},
			},
		},
	},
	//陈武董袭
	dcduanxie: {
		audio: "duanxie",
		inherit: "duanxie",
		selectTarget: 1,
	},
	//吕范
	diaodu: {
		audio: 2,
		trigger: { player: ["phaseUseBegin", "logSkill"] },
		filter(event, player) {
			if (event.name == "logSkill" && event.skill != "diancai") {
				return false;
			}
			return game.hasPlayer(target => {
				return get.distance(player, target) <= 1 && target.countGainableCards(player, "e");
			});
		},
		direct: true,
		async content(event, trigger, player) {
			const {
				result: { bool, targets },
			} = await player
				.chooseTarget(get.prompt2("diaodu"), (card, player, target) => {
					return get.distance(player, target) <= 1 && target.countGainableCards(player, "e");
				})
				.set("ai", target => {
					const player = get.event("player");
					return get.effect(target, { name: "shunshou_copy", position: "e" }, player, player);
				});
			if (bool) {
				const aim = targets[0];
				player.logSkill("diaodu", aim);
				const {
					result: { bool, cards },
				} = await player.gainPlayerCard(aim, "e", true);
				if (bool && game.hasPlayer(target => target != aim)) {
					const card = cards[0];
					const {
						result: { bool, targets },
					} = await player
						.chooseTarget(
							"调度：将" + get.translation(card) + "交给另一名角色",
							(card, player, target) => {
								return target != get.event("aim");
							},
							true
						)
						.set("ai", target => {
							const player = get.event("player");
							return get.attitude(player, target);
						})
						.set("aim", aim);
					if (bool && get.owner(card) == player) {
						const target = targets[0];
						player.line(target, "green");
						if (target != player) {
							await player.give([card], target);
						}
						if (get.owner(card) == target) {
							const {
								result: { bool },
							} = await target.chooseUseTarget(card);
							if (bool) {
								await player.draw();
							} else {
								await target.draw();
							}
						}
					}
				}
			}
		},
	},
	diancai: {
		audio: 2,
		inherit: "mbdiancai",
		filter(event, player) {
			if (_status.currentPhase === player) {
				return false;
			}
			let num = player
				.getHistory("lose", evt => {
					return evt.cards2 && evt.cards2.length && evt.getParent("phaseUse") == event;
				})
				.reduce((sum, evt) => {
					return sum + evt.cards2.length;
				}, 0);
			return num >= Math.min(5, player.getHp());
		},
	},
	//崔琰毛玠
	zhengbi: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(target => target != player);
		},
		direct: true,
		async content(event, trigger, player) {
			const {
				result: { bool, targets },
			} = await player.chooseTarget(get.prompt2("zhengbi"), lib.filter.notMe).set("ai", target => {
				const player = get.event("player");
				return -get.attitude(player, target) * target.countCards("he");
			});
			if (bool) {
				const target = targets[0],
					str = get.translation(target);
				player.logSkill("zhengbi", target);
				let choiceList = ["此阶段结束时，若" + str + "本阶段获得过牌，则你获得其手牌区和装备区各一张牌"];
				if (player.countCards("h", { type: "basic" })) {
					choiceList.push("交给" + str + "一张基本牌，然后其交给你一张非基本牌或两张基本牌");
				}
				const {
					result: { index },
				} = await player
					.chooseControl()
					.set("choiceList", choiceList)
					.set("ai", () => get.event("controls").length - 1);
				if (index == 0) {
					player.line(target);
					player
						.when("phaseUseEnd")
						.filter(evt => evt == trigger)
						.then(() => {
							if (target.isIn() && target.getHistory("gain", evt => evt.getParent("phaseUse") == trigger).length) {
								player.line(target);
								let num = (target.countGainableCards(player, "h") > 0) + (target.countGainableCards(player, "e") > 0);
								if (num) {
									player.gainPlayerCard(target, num, "he", true).set("filterButton", button => {
										return !ui.selected.buttons.some(but => get.position(button.link) == get.position(but.link));
									});
								}
							}
						})
						.vars({ target: target });
				} else {
					const {
						result: { bool },
					} = await player.chooseToGive(target, { type: "basic" }, true).set("prompt", "征辟：交给" + str + "一张基本牌");
					if (bool) {
						let choices = [];
						if (target.countCards("he", { type: ["trick", "delay", "equip"] })) {
							choices.push("一张非基本牌");
						}
						if (target.countCards("h", { type: "basic" }) > 1) {
							choices.push("两张基本牌");
						}
						if (choices.length) {
							const {
								result: { control },
							} = await target
								.chooseControl(choices)
								.set("ai", function (event, player) {
									if (choices.length > 1) {
										if (
											player.countCards("he", { type: ["trick", "delay", "equip"] }, function (card) {
												return get.value(card) < 7;
											})
										) {
											return 0;
										}
										return 1;
									}
									return 0;
								})
								.set("prompt", "征辟：交给" + get.translation(player) + "…</div>");
							const check = control == "一张非基本牌";
							await target.chooseToGive("he", check ? 1 : 2, { type: check ? ["trick", "delay", "equip"] : "basic" }, player, true).set("prompt", "征辟：交给" + get.translation(player) + control);
						} else if (target.countCards("h")) {
							await target.give(target.getCards("h"), player);
						}
					}
				}
			}
		},
	},
	fengying: {
		limited: true,
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") && player.countCards("h") == player.countDiscardableCards(player, "h");
		},
		skillAnimation: true,
		animationColor: "thunder",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.discard(player.getCards("h"));
			const evt = player.insertPhase();
			player
				.when("phaseBegin")
				.filter(evtx => evtx == evt)
				.then(() => {
					if (player.isMinHp() && player.maxHp > 0 && player.countCards("h") < player.maxHp) {
						player.drawTo(player.maxHp);
					}
				});
		},
		ai: {
			order: 0.0001,
			result: {
				player(player) {
					return player.isMinHp() ? 1 : 0;
				},
			},
		},
	},
	//胡遵
	dczhantao: {
		audio: 2,
		trigger: { global: "damageEnd" },
		filter(event, player) {
			if (!event.player.isIn() || (event.player !== player && !player.inRange(event.player))) {
				return false;
			}
			return event.source && event.source != player;
		},
		check(event, player) {
			if (!event.source.isIn() || !event.card || typeof get.number(event.card) !== "number") {
				return 0;
			}
			return get.effect(event.source, { name: "sha" }, player, player) >= 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player
				.judge(card => {
					const evt = get.event().getParent(get.event("eventName")).getTrigger();
					if (!evt.source || !evt.source.isIn() || !evt.card || typeof get.number(evt.card) !== "number") {
						return 0;
					}
					if (get.number(card) > get.number(evt.card)) {
						return 1.5;
					}
					return 0;
				})
				.set("judge2", r => r.bool)
				.set("callback", () => {
					const evtx = event.getParent();
					const evt = event.getParent(evtx.eventName).getTrigger();
					if (!evt.source || !evt.source.isIn() || !evt.card || typeof get.number(evt.card) !== "number") {
						return;
					}
					if (event.judgeResult.number > get.number(evt.card)) {
						const sha = new lib.element.VCard({ name: "sha" }),
							target = evt.source;
						if (player.canUse(sha, target, false, false)) {
							player.useCard(sha, target, false);
						}
					}
				})
				.set("eventName", event.name);
		},
	},
	dcanjing: {
		audio: 2,
		trigger: { source: "damageSource" },
		filter(event, player) {
			return game.hasPlayer(current => current.isDamaged());
		},
		usable: 1,
		async cost(event, trigger, player) {
			const skillName = event.name.slice(0, -5);
			const maxCount = player.getAllHistory("useSkill", evt => evt.skill === skillName).length + 1;
			event.result = await player
				.chooseTarget(get.prompt2(skillName), (card, player, target) => target.isDamaged(), [1, maxCount])
				.set("ai", target => {
					return get.attitude(get.player(), target) > 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.slice();
			targets.sortBySeat(_status.currentPhase);
			for (const target of targets) {
				await target.draw();
			}
			const minHp = targets.map(i => i.getHp()).sort((a, b) => a - b)[0];
			await game.delayx();
			for (const target of targets) {
				if (!target.isIn()) {
					continue;
				}
				if (target.getHp() === minHp) {
					await target.recover();
				}
			}
		},
	},
	//诸葛梦雪
	dcjichun: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", card => lib.skill.dcjichun.filterCard(card, player));
		},
		filterCard(card, player) {
			if (!get.cardNameLength(card) || ui.selected.cards.length) {
				return false;
			}
			if (
				game.hasPlayer(target => {
					return target.countCards("h") < player.countCards("h");
				}) &&
				!player.getStorage("dcjichun_used").includes("draw")
			) {
				return true;
			}
			if (
				lib.filter.cardDiscardable(card, player) &&
				game.hasPlayer(target => {
					return target.countCards("h") > player.countCards("h") && target.countDiscardableCards(player, "hej");
				}) &&
				!player.getStorage("dcjichun_used").includes("discard")
			) {
				return true;
			}
			return false;
		},
		selectCard: [1, 2],
		filterTarget(cardx, player, target) {
			if (!ui.selected.cards.length) {
				return false;
			}
			const card = ui.selected.cards[0];
			if (target.countCards("h") < player.countCards("h")) {
				return !player.getStorage("dcjichun_used").includes("draw");
			}
			if (lib.filter.cardDiscardable(card, player) && target.countCards("h") > player.countCards("h") && target.countDiscardableCards(player, "hej")) {
				return !player.getStorage("dcjichun_used").includes("discard");
			}
			return false;
		},
		usable: 2,
		position: "he",
		check(card) {
			return get.cardNameLength(card);
		},
		complexCard: true,
		complexSelect: true,
		lose: false,
		discard: false,
		delay: false,
		targetprompt() {
			const target = ui.selected.targets[0],
				player = get.event("player");
			return target.countCards("h") < player.countCards("h") ? "给牌摸牌" : "双双弃牌";
		},
		async content(event, trigger, player) {
			const card = event.cards[0],
				target = event.target;
			const num = get.cardNameLength(card);
			await player.showCards([card], get.translation(player) + "发动了【寄春】");
			player.addTempSkill("dcjichun_used", "phaseUseAfter");
			if (target.countCards("h") < player.countCards("h")) {
				player.markAuto("dcjichun_used", "draw");
				await player.give(card, target);
				await player.draw(num);
			} else {
				player.markAuto("dcjichun_used", "discard");
				await player.discard(card);
				await player.discardPlayerCard(target, "hej", [1, num]);
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					return target.countCards("h") < player.countCards("h") ? get.effect(target, { name: "draw" }, player, target) : get.effect(target, { name: "guohe" }, player, target);
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
	dchanying: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		async content(event, trigger, player) {
			const card = get.cardPile(card => get.type(card) == "equip" && !get.cardtag(card, "gifts"));
			if (!card) {
				player.chat("无牌可得？！");
				game.log("但是牌堆已经没有装备牌了！");
				return;
			}
			await player.showCards([card], get.translation(player) + "发动了【寒英】");
			if (game.hasPlayer(target => target.countCards("h") == player.countCards("h") && target.hasUseTarget(card))) {
				const {
					result: { bool, targets },
				} = await player
					.chooseTarget(
						"请选择使用" + get.translation(card) + "的目标角色",
						(card, player, target) => {
							return target.countCards("h") == player.countCards("h") && target.hasUseTarget(get.event("card"));
						},
						true
					)
					.set("ai", target => get.effect(target, get.event("card"), target, get.event("player")))
					.set("card", card);
				if (bool) {
					const target = targets[0];
					player.line(target);
					target.chooseUseTarget(card, true, "nopopup");
				}
			} else {
				player.chat("无人可装？！");
				game.log("但是场上没有角色可以使用", card, "！");
			}
		},
	},
	//柏灵筠
	dclinghui: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			if (_status.currentPhase === player) {
				return true;
			}
			return game.getGlobalHistory("everything", evt => evt.name == "dying").length;
		},
		frequent: true,
		async content(event, trigger, player) {
			let cards = get.cards(3);
			await game.cardsGotoOrdering(cards);
			const {
				result: { bool, links },
			} = await player
				.chooseButton(["灵慧：是否使用其中的一张牌并随机获得其中一张剩余牌？", cards])
				.set("filterButton", button => {
					return get.player().hasUseTarget(button.link);
				})
				.set("ai", button => {
					return get.event("player").getUseValue(button.link);
				});
			if (bool) {
				const card = links[0];
				cards.remove(card);
				player.$gain2(card, false);
				await game.delayx();
				await player.chooseUseTarget(true, card, false);
				cards = cards.filterInD();
				if (cards.length) {
					const cardx = cards.randomRemove();
					await player.gain(cardx, "gain2");
				}
			}
			if (cards.length) {
				cards.reverse();
				game.cardsGotoPile(cards.filterInD(), "insert");
				game.log(player, "将", get.cnNumber(cards.length), "张牌置于了牌堆顶");
			}
		},
	},
	dcxiace: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			const bool1 = event.player == player && !player.getStorage("dcxiace_used").includes("player") && game.hasPlayer(target => target != player && !target.hasSkill("fengyin"));
			const bool2 =
				event.source &&
				event.source == player &&
				!player.getStorage("dcxiace_used").includes("source") &&
				player.isDamaged() &&
				player.countCards("he", card => {
					if (_status.connectMode && get.position(card) == "h") {
						return true;
					}
					return lib.filter.cardDiscardable(card, player);
				});
			return bool1 || bool2;
		},
		direct: true,
		async content(event, trigger, player) {
			if (trigger.player == player && !player.getStorage("dcxiace_used").includes("player") && game.hasPlayer(target => target != player && !target.hasSkill("fengyin"))) {
				const {
					result: { bool, targets },
				} = await player
					.chooseTarget((card, player, target) => {
						return target != player && !target.hasSkill("fengyin");
					})
					.set("prompt", get.prompt("dcxiace"))
					.set("prompt2", "令一名其他角色的非锁定技于本回合失效")
					.set("ai", target => {
						const player = get.event("player");
						return (
							-get.sgn(get.attitude(player, target)) *
							(target.getSkills(null, false, false).filter(skill => {
								return !get.is.locked(skill);
							}).length +
								1) *
							(target === _status.currentPhase ? 10 : 1)
						);
					});
				if (bool) {
					const target = targets[0];
					player.logSkill("dcxiace", target);
					player.addTempSkill("dcxiace_used");
					player.markAuto("dcxiace_used", "player");
					target.addTempSkill("fengyin");
				}
			}
			if (
				trigger.source &&
				trigger.source == player &&
				!player.getStorage("dcxiace_used").includes("source") &&
				player.isDamaged() &&
				player.countCards("he", card => {
					if (_status.connectMode && get.position(card) == "h") {
						return true;
					}
					return lib.filter.cardDiscardable(card, player);
				}) &&
				player.hasSkill("dcxiace")
			) {
				const {
					result: { bool },
				} = await player
					.chooseToDiscard("he", get.prompt("dcxiace"), "弃置一张牌并回复1点体力")
					.set("ai", card => {
						const player = get.event("player");
						if (get.recoverEffect(player, player, player) <= 0) {
							return 0;
						}
						return 7 - get.value(card);
					})
					.set("logSkill", "dcxiace");
				if (bool) {
					player.addTempSkill("dcxiace_used");
					player.markAuto("dcxiace_used", "source");
					await player.recover();
				}
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	dcyuxin: {
		limited: true,
		audio: 2,
		trigger: { global: "dying" },
		filter(event, player) {
			return event.player.hp < (event.player == player ? 1 : player.getHp());
		},
		prompt2(event, player) {
			return "令其将体力值回复至" + (event.player == player ? 1 : player.getHp()) + "点";
		},
		check(event, player) {
			if (get.recoverEffect(event.player, player, player) <= 0) {
				return false;
			}
			return lib.skill.luanfeng.check(event, player);
		},
		logTarget: "player",
		skillAnimation: true,
		animationColor: "thunder",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			trigger.player.recover((trigger.player == player ? 1 : player.getHp()) - trigger.player.hp);
		},
	},
	//清河公主
	dczhangji: {
		audio: 2,
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
			const evtx = trigger.getParent();
			trigger.targets = [player, ...trigger.targets.remove(player)];
			evtx.targets = [player, ...evtx.targets.remove(player)];
			evtx.triggeredTargets4 = [player, ...evtx.triggeredTargets4.remove(player)];
			await player.draw(evtx.targets.length - 1);
		},
	},
	dczengou: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.maxHp > 0 && player.countCards("he") > 0;
		},
		filterCard: true,
		selectCard: () => [1, _status.event.player.maxHp],
		position: "he",
		filterTarget: lib.filter.notMe,
		discard: false,
		lose: false,
		delay: false,
		usable: 1,
		check(card) {
			if (card.name == "tao" || card.name == "jiu") {
				return 0;
			}
			return 1 / (get.value(card) || 0.5);
		},
		*content(event, map) {
			const player = map.player,
				cards = event.cards,
				target = event.target;
			yield player.give(cards, target).gaintag.add("dczengou_debuff");
			yield player.draw(cards.length);
			target.addSkill("dczengou_debuff");
		},
		ai: {
			order: 10,
			result: { target: -1 },
		},
		subSkill: {
			debuff: {
				charlotte: true,
				mark: true,
				intro: {
					content: "下次体力值增加或使用牌结算完毕后展示所有手牌，然后失去手牌中“谮构”牌数的体力值",
				},
				trigger: { player: ["changeHp", "useCardAfter"] },
				filter(event, player) {
					return event.name == "useCard" || event.num > 0;
				},
				forced: true,
				popup: false,
				content() {
					player.removeSkill("dczengou_debuff");
					const cards = player.getCards("h", card => card.hasGaintag("dczengou_debuff"));
					player.showHandcards();
					if (cards.length) {
						player.loseHp(cards.length);
					}
				},
				mod: {
					aiValue(player, card, num) {
						if (get.itemtype(card) == "card" && card.hasGaintag("dczengou_debuff")) {
							return -1;
						}
					},
					aiUseful() {
						return lib.skill.dczengou.subSkill.debuff.mod.aiValue.apply(this, arguments);
					},
					aiOrder(player, card, num) {
						if (get.itemtype(card) == "card" && card.hasGaintag("dczengou_debuff")) {
							const cards = player.getCards("h", card => card.hasGaintag("dczengou_debuff"));
							if (cards.length == 1) {
								return num + 10;
							}
							return 0;
						}
					},
				},
			},
		},
	},
	//曹宪
	dclingxi: {
		audio: 2,
		trigger: { player: ["phaseUseBegin", "phaseUseEnd"] },
		filter(event, player) {
			return player.countCards("he") && player.maxHp > 0;
		},
		direct: true,
		*content(event, map) {
			var player = map.player,
				num = player.maxHp;
			var result = yield player
				.chooseCard(get.prompt("dclingxi"), "将至多" + get.cnNumber(num) + "张牌称为“翼”置于武将牌上", "he", [1, num])
				.set("ai", card => {
					let player = _status.event.player,
						dis = player.needsToDiscard(0, (i, player) => {
							return !player.canIgnoreHandcard(i) && !ui.selected.cards.includes(i);
						}),
						cards = ui.selected.cards.concat(player.getExpansions("dclingxi")),
						suit = get.suit(card, false);
					if (_status.event.suits.length < 4) {
						_status.event.suits.add(get.suit(ui.selected.cards.at(-1), false));
					}
					if (_status.event.triggerName === "phaseUseEnd") {
						if (_status.event.suits.includes(suit)) {
							return (dis ? 10 : 3) - get.useful(card);
						}
						return (dis ? 6 : 1) - get.useful(card);
					}
					_status.event.hvt.remove(ui.selected.cards.at(-1));
					if (_status.event.hvt.length === 1 && card === _status.event.hvt[0]) {
						return 0;
					}
					let temp;
					if (
						!cards.some(i => {
							temp = get.suit(i, false);
							return cards.some(j => {
								return i !== j && suit === get.suit(j, false);
							});
						}) &&
						suit === temp
					) {
						return 15 - get.value(card);
					}
					if (!_status.event.hvt.length) {
						if (_status.event.suits.includes(suit)) {
							return (dis ? 10 : 3) - get.useful(card);
						}
						return (dis ? 6 : 1) - get.useful(card);
					}
					if (_status.event.hvt.includes(card)) {
						if (!_status.event.suits.includes(suit)) {
							return 6 - get.value(card);
						}
						if (card.name === "sha") {
							return 3 - get.value(card);
						}
						return 1 - get.value(card);
					}
					return 15 - get.value(card);
				})
				.set("complexCard", true)
				.set(
					"hvt",
					player.getCards("hs", card => {
						return card.name === "zhuge" || player.hasValueTarget(card, null, true);
					})
				)
				.set(
					"suits",
					(() => {
						let suits = [];
						player.getExpansions("dclingxi").forEach(i => {
							suits.add(get.suit(i, false));
						});
						return suits;
					})()
				)
				.set("triggerName", event.triggername);
			if (result.bool) {
				player.logSkill("dclingxi");
				player.addToExpansion(result.cards, player, "give").gaintag.add("dclingxi");
			}
		},
		marktext: "翼",
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
		group: "dclingxi_effect",
		subSkill: {
			effect: {
				audio: "dclingxi",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter"],
				},
				filter(event, player) {
					var num = 2 * player.getExpansions("dclingxi").reduce((list, card) => list.add(get.suit(card, false)), []).length;
					num -= player.countCards("h");
					if (!num) {
						return false;
					}
					if (event.name == "lose" && event.getlx !== false) {
						for (var i in event.gaintag_map) {
							if (event.gaintag_map[i].includes("dclingxi")) {
								return true;
							}
						}
						return false;
					}
					return game.getGlobalHistory("cardMove", function (evt) {
						if (evt.name != "lose" || event != evt.getParent()) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("dclingxi") && evt.player == player) {
								return true;
							}
						}
						return false;
					}).length;
				},
				forced: true,
				locked: false,
				content() {
					var num = 2 * player.getExpansions("dclingxi").reduce((list, card) => list.add(get.suit(card, false)), []).length;
					num -= player.countCards("h");
					if (num > 0) {
						player.draw(num);
					} else {
						player.chooseToDiscard("h", -num, true);
					}
				},
			},
		},
		ai: {
			combo: "dczhifou",
		},
	},
	dczhifou: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			var num = player.getHistory("useSkill", evt => evt.skill == "dczhifou").length + 1;
			return player.getExpansions("dclingxi").length >= num;
		},
		direct: true,
		*content(event, map) {
			var player = map.player,
				cards = player.getExpansions("dclingxi");
			var num = player.getHistory("useSkill", evt => evt.skill == "dczhifou").length + 1;
			var result = yield player
				.chooseButton(["###" + get.prompt("dczhifou") + "###移去至少" + get.cnNumber(num) + "张武将牌上的“翼”", cards], [num, cards.length])
				.set("ai", button => {
					if (!_status.event.res.bool) {
						return 0;
					}
					if (_status.event.res.cards.includes(button.link)) {
						return 1;
					}
					return 0;
				})
				.set("num", num)
				.set(
					"res",
					(() => {
						if (
							player.isPhaseUsing() &&
							player.hasCard(i => {
								return player.hasValueTarget(i, null, true);
							}, "h")
						) {
							return false;
						}
						let suits = [],
							cs = player.getExpansions("dclingxi"),
							cards = [],
							temp = num;
						for (let i = 0; i < cs.length; i++) {
							if (!temp) {
								break;
							}
							let suit = get.suit(cs[i], false);
							if (suits.includes(suit)) {
								cards.push(cs.splice(i--, 1)[0]);
								temp--;
							} else {
								suits.push(suit);
							}
						}
						while (temp > 0) {
							cards.push(cs.pop());
							temp--;
						}
						temp = suits.length * 2 - player.countCards("h");
						if (temp > 0 || (!temp && num < Math.max(2, 5 - player.hp))) {
							cs = true;
						} else {
							cs = false;
						}
						return {
							bool: cs,
							cards: cards,
						};
					})()
				);
			if (result.bool) {
				player.logSkill("dczhifou");
				player.loseToDiscardpile(result.links);
				var list = [],
					choiceList = ["将一张牌称为“翼”置于你的武将牌上", "弃置两张牌", "失去1点体力"];
				if (!player.hasSkill("dczhifou_0") && game.hasPlayer(target => target.countCards("he"))) {
					list.push("置入“翼”");
				} else {
					choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
				}
				if (
					!player.hasSkill("dczhifou_1") &&
					game.hasPlayer(target => {
						return target == player ? target.countDiscardableCards(target, "he") : target.countCards("he");
					})
				) {
					list.push("弃置卡牌");
				} else {
					choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
				}
				if (!player.hasSkill("dczhifou_2")) {
					list.push("失去体力");
				} else {
					choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "</span>";
				}
				if (!list.length) {
					return;
				}
				var str = "";
				for (var i of list) {
					str += i;
					str += "、";
				}
				str = str.slice(0, -1);
				var result2 = yield player
					.chooseTarget(
						"知否：令一名角色执行以下一项",
						str,
						(card, player, target) => {
							if (!player.hasSkill("dczhifou_2")) {
								return true;
							}
							if (!player.hasSkill("dczhifou_0") && target.countCards("he")) {
								return true;
							}
							return target == player ? target.countDiscardableCards(target, "he") : target.countCards("he");
						},
						true
					)
					.set("ai", target => {
						var player = _status.event.player,
							list = [];
						if (!player.hasSkill("dczhifou_0")) {
							list.push(get.effect(target, { name: "guohe_copy2" }, target, player) / 2);
						}
						if (!player.hasSkill("dczhifou_1")) {
							list.push(get.effect(target, { name: "guohe_copy2" }, target, player));
						}
						if (!player.hasSkill("dczhifou_2")) {
							list.push(get.effect(target, { name: "losehp" }, player, player));
						}
						return list.sort((a, b) => b - a)[0];
					});
				if (result2.bool) {
					var target = result2.targets[0];
					player.line(target);
					list = list.filter(control => {
						if (control == "失去体力") {
							return true;
						}
						if (control == "置入“翼”" && target.countCards("he")) {
							return true;
						}
						return target.countDiscardableCards(target, "he");
					});
					var result3;
					if (!list.length) {
						game.log(target, "没有可执行项");
						return;
					} else if (list.length == 1) {
						result3 = { control: list[0] };
					} else {
						result3 = yield player
							.chooseControl(list)
							.set("prompt", "知否：请选择一项")
							.set(
								"choiceList",
								choiceList.map(str => "令" + get.translation(target) + str)
							)
							.set("ai", () => {
								var player = _status.event.player;
								var target = _status.event.target;
								var getNum = function (control) {
									return [get.effect(target, { name: "guohe_copy2" }, target, player) / 2, get.effect(target, { name: "guohe_copy2" }, target, player), get.effect(target, { name: "losehp" }, target, player)][["置入“翼”", "弃置卡牌", "失去体力"].indexOf(control)];
								};
								var controls = _status.event.controls.slice();
								return controls.sort((a, b) => getNum(b) - getNum(a))[0];
							})
							.set("target", target);
					}
					switch (result3.control) {
						case "置入“翼”":
							player.addTempSkill("dczhifou_0");
							var result4 = yield target.chooseCard("he", choiceList[0], true);
							if (result4.bool) {
								player.addToExpansion(result4.cards, target, "give").gaintag.add("dclingxi");
							}
							break;
						case "弃置卡牌":
							player.addTempSkill("dczhifou_1");
							target.chooseToDiscard("he", 2, true);
							break;
						case "失去体力":
							player.addTempSkill("dczhifou_2");
							target.loseHp();
							break;
					}
				}
			}
		},
		subSkill: {
			0: { charlotte: true },
			1: { charlotte: true },
			2: { charlotte: true },
		},
		ai: {
			combo: "dclingxi",
		},
	},
	//周瑜
	//无 双 万 军 取 首
	dcsbronghuo: {
		audio: 2,
		audioname: ["dc_sb_zhouyu_shadow"],
		trigger: { player: "useCard1" },
		filter(event, player) {
			return (event.card.name == "sha" && game.hasNature(event.card, "fire")) || event.card.name == "huogong";
		},
		forced: true,
		content() {
			trigger.baseDamage = game.countGroup();
		},
		ai: { threaten: 3.5 },
	},
	dcsbyingmou: {
		mark: true,
		marktext: "☯",
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			player.changeSkin({ characterName: "dc_sb_zhouyu" }, "dc_sb_zhouyu" + (player.storage[skill] ? "_shadow" : ""));
		},
		intro: {
			content(storage) {
				return "每回合限一次，当你对其他角色使用牌后，你可以选择其中一名目标角色，" + (storage ? "令一名手牌数为全场最大的角色对其使用手牌中所有的【杀】和伤害类锦囊牌（若其没有可使用的牌则将手牌数弃至与你相同）。" : "你将手牌数摸至与其相同（至多摸五张），然后视为对其使用一张【火攻】。");
			},
		},
		audio: 2,
		audioname: ["dc_sb_zhouyu_shadow"],
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return event.targets?.some(target => target != player);
		},
		usable: 1,
		async cost(event, trigger, player) {
			const { targets } = trigger;
			const skillName = event.name.slice(0, -5);
			const storage = player.storage[skillName];
			let next;
			if (storage) {
				next = player
					.chooseCardTarget({
						prompt: get.prompt(skillName),
						prompt2: "选择一名目标角色，令一名手牌数为全场最大的角色对其使用手牌中所有的【杀】和伤害类锦囊牌（若其没有可使用的牌则将手牌数弃至与你相同）",
						filterTarget(card, player, target) {
							if (!ui.selected.targets.length) {
								return _status.event.targets.includes(target);
							}
							return target.isMaxHandcard();
						},
						selectTarget: 2,
						complexSelect: true,
						complexTarget: true,
						multitarget: true,
						targetprompt: ["目标角色", "使用角色"],
						filterCard: () => false,
						selectCard: -1,
						ai2(target) {
							const player = get.player();
							const getNum = (player, target, source) => {
								return player
									.getCards("h", card => {
										if (get.name(card) != "sha" && (get.type(card) != "trick" || !get.tag(card, "damage"))) {
											return false;
										}
										return player.canUse(card, target, false);
									})
									.reduce((sum, card) => sum + get.effect(target, card, player, source), 0);
							};
							if (!ui.selected.targets.length) {
								const targets = game.filterPlayer(target => target.isMaxHandcard());
								targets.sort((a, b) => getNum(b, target, player) - getNum(a, target, player));
								return getNum(targets[0], target, player) + 1;
							}
							return getNum(target, ui.selected.targets[0], player) + 1;
						},
					})
					.set("targets", targets);
			} else {
				next = player
					.chooseTarget(get.prompt(skillName), "选择一名目标角色，将手牌数摸至与其相同，然后视为对其使用一张【火攻】", (card, player, target) => _status.event.targets.includes(target))
					.set("ai", target => {
						const player = get.player();
						return Math.max(0, Math.min(5, target.countCards("h") - player.countCards("h"))) * 2 + get.effect(target, { name: "huogong" }, player, player);
					})
					.set("targets", targets);
			}
			event.result = await next.forResult();
		},
		async content(event, trigger, player) {
			const { targets, name: skillName } = event;
			player.changeZhuanhuanji(skillName);
			const target = targets[0];
			if (!player.storage[skillName]) {
				player.line2(targets);
				let source = targets[1],
					discard = true;
				while (true) {
					const cards = source.getCards("h", card => {
						if (get.name(card) != "sha" && (get.type(card) != "trick" || !get.tag(card, "damage"))) {
							return false;
						}
						return source.canUse(card, target, false);
					});
					if (cards.length) {
						if (discard) {
							discard = false;
						}
						await source.useCard(cards.randomGet(), target, false);
					} else {
						break;
					}
				}
				if (discard && player.countCards("h") < source.countCards("h")) {
					await source.chooseToDiscard(source.countCards("h") - player.countCards("h"), "h", true);
				}
			} else {
				if (player.countCards("h") < target.countCards("h")) {
					await player.draw(Math.min(5, target.countCards("h") - player.countCards("h")));
				}
				if (player.canUse({ name: "huogong" }, target, false)) {
					await player.useCard({ name: "huogong" }, target, false);
				}
			}
		},
		group: "dcsbyingmou_change",
		subSkill: {
			change: {
				audio: "dcsbyingmou",
				audioname: ["dc_sb_zhouyu_shadow"],
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【英谋】为状态" + (player.storage.dcsbyingmou ? "阳" : "阴");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("dcsbyingmou");
				},
			},
		},
	},
	//鲁肃
	dcsbmingshi: {
		audio: 2,
		audioname: ["dc_sb_lusu_shadow"],
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed;
		},
		frequent: true,
		content() {
			trigger.num += 2;
			player
				.when("phaseDrawEnd")
				.filter((evt, player) => evt == trigger && player.countCards("h"))
				.then(() => {
					var str = "明势：请展示三张牌并令一名其他角色选择获得其中的一张牌";
					if (player.countCards("h") <= 3) {
						str = "明势：展示手牌并令一名其他角色选择获得其中的一张牌";
					}
					player.chooseCardTarget({
						prompt: str,
						filterTarget: lib.filter.notMe,
						filterCard: true,
						selectCard() {
							var player = _status.event.player;
							if (player.countCards("h") <= 3) {
								return -1;
							}
							return 3;
						},
						position: "h",
						forced: true,
						ai1(card) {
							return -get.value(card);
						},
						ai2(target) {
							var player = _status.event.player;
							if (player.hasSkill("dcsbmengmou") && !get.is.blocked("dcsbmengmou", player) && player.storage.dcsbmengmou && get.attitude(player, target) < 0) {
								return get.effect(target, { name: "losehp" }, player, player);
							}
							return get.attitude(player, target);
						},
					});
				})
				.then(() => {
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						var cards = result.cards;
						player.showCards(cards, get.translation(player) + "发动了【明势】");
						target
							.chooseButton(["明势：请获得其中一张牌", cards], true)
							.set("filterButton", button => {
								return lib.filter.canBeGained(button.link, _status.event.source, _status.event.player);
							})
							.set("ai", button => get.value(button.link))
							.set("source", player);
					} else {
						event.finish();
					}
				})
				.then(() => {
					if (result.bool) {
						var card = result.links[0];
						if (lib.filter.canBeGained(card, player, target)) {
							target.gain(card, player, "giveAuto");
						} else {
							game.log("但", card, "不能被", player, "获得！");
						}
					}
				});
		},
	},
	dcsbmengmou: {
		mark: true,
		marktext: "☯",
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			player.changeSkin({ characterName: "dc_sb_lusu" }, "dc_sb_lusu" + (player.storage[skill] ? "_shadow" : ""));
		},
		intro: {
			content(storage) {
				if (!storage) {
					return "每回合限一次，当你得到其他角色的牌后，或其他角色得到你的牌后，你可以令该角色使用至多X张【杀】，且其每以此法造成1点伤害，其回复1点体力。（X为你的体力上限）";
				}
				return "每回合限一次，当你得到其他角色的牌后，或其他角色得到你的牌后，你可令该角色打出至多X张【杀】，然后其失去Y点体力。（X为你的体力上限，Y为X-其打出【杀】数）";
			},
		},
		audio: 2,
		audioname: ["dc_sb_lusu_shadow"],
		trigger: { global: ["gainAfter", "loseAsyncAfter"] },
		filter(event, player) {
			if (typeof player.maxHp != "number" || player.maxHp <= 0) {
				return false;
			}
			if (event.name == "loseAsync" && event.type != "gain") {
				return false;
			}
			if (player.getStorage("dcsbmengmou_used").includes(player.storage.dcsbmengmou ? "yin" : "yang")) {
				return false;
			}
			var cards1 = event.getl(player).cards2,
				cards2 = event.getg(player);
			return (
				game.hasPlayer(function (current) {
					if (current == player) {
						return false;
					}
					var cardsx = event.getg(current);
					return cardsx.some(i => cards1.includes(i));
				}) ||
				game.hasPlayer(function (current) {
					if (current == player) {
						return false;
					}
					var cardsx = event.getl(current).cards2;
					return cards2.some(i => cardsx.includes(i));
				})
			);
		},
		direct: true,
		*content(event, map) {
			var player = map.player,
				trigger = map.trigger;
			var storage = player.storage.dcsbmengmou;
			player.addTempSkill("dcsbmengmou_effect", "dcsbmengmouAfter");
			var targets = [],
				num = player.maxHp;
			var cards1 = trigger.getl(player).cards2;
			var cards2 = trigger.getg(player);
			targets.addArray(
				game.filterPlayer(function (current) {
					if (current == player) {
						return false;
					}
					var cardsx = trigger.getg(current);
					return cardsx.some(i => cards1.includes(i));
				})
			);
			targets.addArray(
				game.filterPlayer(function (current) {
					if (current == player) {
						return false;
					}
					var cardsx = trigger.getl(current).cards2;
					return cards2.some(i => cardsx.includes(i));
				})
			);
			targets.sortBySeat();
			var check_true = function (player, target) {
				if (get.attitude(player, target) > 0) {
					if (
						target.countCards("hs", card => {
							if (get.name(card) != "sha") {
								return false;
							}
							return target.hasValueTarget(card);
						})
					) {
						return 4;
					}
					return 0.5;
				}
				if (get.attitude(player, target) < 0) {
					if (
						!target.countCards("hs", card => {
							if (get.name(card) != "sha") {
								return false;
							}
							return target.hasValueTarget(card);
						})
					) {
						if (
							target.countCards("hs", card => {
								if (get.name(card) != "sha") {
									return false;
								}
								return target.hasUseTarget(card);
							})
						) {
							return -3;
						}
						return -1;
					}
					return 0;
				}
				return 0;
			};
			var check_false = function (player, target) {
				if (get.attitude(player, target) < 0) {
					return get.effect(target, { name: "losehp" }, player, player);
				}
				return 0;
			};
			var result, target;
			if (targets.length == 1) {
				target = targets[0];
				var str;
				if (storage) {
					str = "令" + get.translation(target) + "打出至多" + get.cnNumber(num) + "张【杀】，然后其失去Y点体力。（Y为" + num + "-其打出【杀】数）";
				} else {
					str = "令" + get.translation(target) + "使用至多" + get.cnNumber(num) + "张【杀】，其每以此法造成1点伤害，其回复1点体力";
				}
				result = yield player.chooseBool(get.prompt("dcsbmengmou", target), str).set("choice", (storage ? check_false(player, target) : check_true(player, target)) > 0);
			} else {
				result = yield player
					.chooseTarget(get.prompt("dcsbmengmou"), lib.skill.dcsbmengmou.intro.content(storage), (card, player, target) => _status.event.targets.includes(target))
					.set("ai", target => {
						return _status.event.check(_status.event.player, target);
					})
					.set("targets", targets)
					.set("check", storage ? check_false : check_true)
					.set("ainmate", false);
			}
			if (result.bool) {
				if (!target) {
					target = result.targets[0];
				}
				yield player.logSkill("dcsbmengmou", target);
				player.addTempSkill("dcsbmengmou_used");
				player.markAuto("dcsbmengmou_used", [storage ? "yin" : "yang"]);
				player.changeZhuanhuanji("dcsbmengmou");
				while (num > 0) {
					num--;
					var result2;
					if (storage) {
						result2 = yield target
							.chooseToRespond((card, player) => {
								return get.name(card) == "sha";
							})
							.set("ai", card => {
								return 1 + Math.random();
							})
							.set("prompt", "盟谋：是否打出一张【杀】？")
							.set("prompt2", "当前进度:" + (3 - num) + "/3");
					} else {
						result2 = yield target
							.chooseToUse(card => {
								if (!lib.filter.cardEnabled(card, _status.event.player, _status.event)) {
									return false;
								}
								return get.name(card) == "sha";
							})
							.set("prompt", "盟谋：是否使用一张【杀】？")
							.set("prompt2", "当前进度:" + (3 - num) + "/3");
					}
					if (!result2.bool) {
						if (storage) {
							target.popup("杯具");
							target.loseHp(num + 1);
						}
						break;
					}
				}
			}
		},
		group: "dcsbmengmou_change",
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { global: "damageSource" },
				filter(event, player) {
					if (!event.source || event.getParent().type != "card") {
						return false;
					}
					if (event.source.isHealthy() || event.card.name != "sha") {
						return false;
					}
					return event.getParent(4).name == "dcsbmengmou" && event.getParent(4).player == player;
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					trigger.source.recover(trigger.num);
				},
			},
			used: { charlotte: true, onremove: true },
			change: {
				audio: "dcsbmengmou",
				audioname: ["dc_sb_lusu_shadow"],
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【盟谋】为状态" + (player.storage.dcsbmengmou ? "阳" : "阴");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("dcsbmengmou");
				},
			},
		},
	},
	//张臶
	dc_zj_a: {
		audio: 2,
		trigger: { player: "damageBegin2" },
		filter(event, player) {
			return event.getParent().type == "card";
		},
		forced: true,
		async content(event, trigger, player) {
			var num = get.number(trigger.card);
			if (typeof num == "number" && num > 0) {
				trigger.num = num;
			} else {
				trigger.cancel();
			}
		},
		ai: {
			filterDamage: true,
			nodamage: true,
			nofire: true,
			nothunder: true,
			skillTagFilter(player, tag, arg) {
				if (!arg?.card) {
					return false;
				}
				if (tag === "filterDamage") {
					return true;
				}
				return typeof get.number(arg.card) !== "number";
			},
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && typeof get.number(card) != "number") {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	dc_zj_b: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countDiscardableCards(player, "he");
		},
		*cost(event, map) {
			event.result = yield map.player.chooseTarget(get.prompt2("dc_zj_b"), lib.filter.notMe).set("ai", target => {
				var player = _status.event.player;
				if (!player.hasFriend()) {
					return 0;
				}
				return -game.countPlayer(current => current.inRange(target) && get.attitude(current, target) < 0 && get.damageEffect(target, current, current) > 0);
			});
		},
		*content(event, map) {
			const player = map.player;
			const target = event.targets[0];
			yield player.discard(player.getDiscardableCards(player, "he"));
			player.addTempSkill("dc_zj_b_effect", { player: "phaseBegin" });
			yield target.addAdditionalSkills("dc_zj_b_" + player.playerid, "dc_zj_a", true);
		},
		derivation: "dc_zj_a",
		subSkill: {
			effect: {
				charlotte: true,
				onremove(player) {
					game.countPlayer(current => current.removeAdditionalSkills("dc_zj_b_" + player.playerid));
				},
			},
		},
	},
	//诸葛若雪
	dcqiongying: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		direct: true,
		filter(event, player) {
			return player.canMoveCard();
		},
		*content(event, map) {
			const player = map.player;
			event.pushHandler("onNextMoveCard", (event, option) => {
				if (_status.connectMode && event.step == 1 && event._result.bool && option.state == "end") {
					game.broadcastAll(() => {
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
			});
			let result = yield player
				.moveCard(false, `###琼英###移动场上的一张牌，然后弃置一张与此牌花色相同的手牌（若没有则展示手牌）。`)
				.set("logSkill", "dcqiongying")
				.set("custom", {
					add: {},
					replace: {
						window: () => {
							if (get.event().name == "chooseTarget") {
								ui.click.cancel();
							}
						},
					},
				});
			if (result.bool) {
				const card = result.card,
					suit = get.suit(card);
				if (!player.hasCard({ suit: suit })) {
					player.showHandcards();
				} else {
					player.chooseToDiscard({ suit: suit }, true, `请弃置一张${get.translation(suit)}手牌`);
				}
			} else {
				player.getStat("skill").dcqiongying--;
			}
		},
		ai: {
			expose: 0.2,
			order(item, player) {
				if (player.countCards("h") <= 4) {
					return 0.5;
				}
				return 9;
			},
			result: {
				player(player) {
					if (player.canMoveCard(true)) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	dcnuanhui: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("dcnuanhui"))
				.set("ai", target => {
					return get.event("aiTarget") == target ? 10 : 0;
				})
				.set(
					"aiTarget",
					(() => {
						const player = get.player();
						const list = get.inpileVCardList(info => {
							return info[0] == "basic";
						});
						if (!list.length) {
							return null;
						}
						const getUseValue = target => {
							if (get.attitude(player, target) <= 0) {
								return -1;
							}
							const toUse = [];
							const hp = target.hp;
							let eff = 0,
								count = Math.max(1, target.countCards("e"));
							while (count--) {
								target.hp = Math.min(target.maxHp, target.hp + toUse.filter(card => card.name == "tao").length);
								const listx = list
									.map(info => {
										const card = new lib.element.VCard({
											name: info[2],
											nature: info[3],
											isCard: true,
										});
										return [card, target.getUseValue(card)];
									})
									.sort((a, b) => {
										return b[1] - a[1];
									});
								const mostValuablePair = listx[0].slice();
								if (mostValuablePair[1] <= 0) {
									mostValuablePair[1] = 0;
								}
								eff += mostValuablePair[1];
								toUse.push(mostValuablePair[0]);
								target.hp = hp;
							}
							if (toUse.length > 1 && eff > 0) {
								eff -= target
									.getCards("e", card => {
										return lib.filter.cardDiscardable(card, target, "dcnuanhui");
									})
									.map(card => {
										return get.value(card, target);
									})
									.reduce((p, c) => {
										return p + c;
									}, 0);
							}
							return eff;
						};
						const playerList = game
							.filterPlayer()
							.map(current => [current, getUseValue(current)])
							.sort((a, b) => b[1] - a[1]);
						if (playerList[0][1] <= 0) {
							return null;
						}
						return playerList[0][0];
					})()
				)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (!target.isUnderControl(true) && !target.isOnline()) {
				game.delayx();
			}
			const total = Math.max(1, target.countCards("e"));
			let count = 0,
				forced = false,
				used = [],
				discard = false;
			while (count < total) {
				const basicList = get.inpileVCardList(info => {
					return info[0] == "basic" && target.hasUseTarget({ name: info[2], nature: info[3], isCard: true });
				});
				if (!basicList.length) {
					game.log("但是", target, "无牌可出！");
					break;
				}
				const str = forced ? "视为使用一张基本牌" : "是否视为使用一张基本牌？";
				const result = await target
					.chooseButton([str, [basicList, "vcard"]], forced)
					.set("ai", button => {
						return get.player().getUseValue({
							name: button.link[2],
							nature: button.link[3],
							isCard: true,
						});
					})
					.forResult();
				if (!result?.bool) {
					game.log("但是", target, "不愿出牌！");
					break;
				}
				forced = true;
				const card = new lib.element.VCard({
					name: result.links[0][2],
					nature: result.links[0][3],
					isCard: true,
				});
				const result2 = await target.chooseUseTarget(card, true, false).forResult();
				if (!discard && result2?.bool) {
					if (used.includes(result.links[0][2])) {
						discard = true;
					} else {
						used.add(result.links[0][2]);
					}
				}
				count++;
			}
			if (discard) {
				const cards = target.getCards("e", card => {
					return lib.filter.cardDiscardable(card, target, "dcnuanhui");
				});
				if (cards.length) {
					await target.discard(cards).set("discarder", target);
				}
			}
		},
		ai: {
			expose: 0.3,
			threaten: 3.7,
		},
	},
	//曹轶
	dcmiyi: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		*content(event, map) {
			const player = map.player;
			if (_status.connectMode) {
				game.broadcastAll(() => {
					_status.noclearcountdown = true;
				});
			}
			let result = yield player
				.chooseControl(["回复体力", "受到伤害"], "cancel2")
				.set("choiceList", ["令你即将选择的角色各回复1点体力", "令你即将选择的角色各受到你造成的1点伤害"])
				.set("prompt", get.prompt("dcmiyi"))
				.set("ai", () => {
					return get.event("choice");
				})
				.set(
					"choice",
					(() => {
						let damage = 0;
						game.countPlayer(current => {
							let eff = get.damageEffect(current, player, player);
							if (!current.isDamaged()) {
								if (eff > 0) {
									eff = -eff;
								}
							} else if (current.hasSkillTag("maixie")) {
								if (get.attitude(player, current) <= 0) {
									if (current.getHp(true) >= 2) {
										eff = 0;
									} else {
										eff /= 10;
									}
								} else if (current.getHp(true) >= 2) {
									eff += 30;
								}
							} else {
								eff /= 3;
							}
							damage += eff;
						});
						if (damage < -20) {
							return 0;
						}
						if (damage > 5) {
							return 1;
						}
						if (lib.skill.mbhuiyao.getUnrealDamageTargets(player, [[player], game.filterPlayer()])) {
							return 0;
						}
						return "cancel2";
					})()
				);
			if (result.control == "cancel2") {
				if (_status.connectMode) {
					game.broadcastAll(() => {
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				return event.finish();
			}
			const func = ["recover", "damage"],
				ind = result.index;
			const fn = func[ind];
			result = yield player
				.chooseTarget(`蜜饴：令任意名角色${result.control.slice(0, 2)}1点${result.control.slice(2)}`, [1, Infinity])
				.set("ai", target => {
					const toDamage = get.event("toDamage");
					let eff = get.damageEffect(target, player, player);
					if (toDamage) {
						if (target.hasSkillTag("maixie")) {
							if (get.attitude(player, target) <= 0) {
								if (target.getHp(true) >= 2) {
									eff = 0;
								} else {
									eff /= 10;
								}
							} else if (target.getHp(true) >= 2) {
								eff += 30;
							}
						}
						return eff;
					}
					if (!target.isDamaged()) {
						eff *= -2;
					}
					if (target.getHp(true) >= 2) {
						return -eff;
					}
					return 0;
				})
				.set("toDamage", result.index == 1);
			if (_status.connectMode) {
				game.broadcastAll(() => {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			if (!result.bool) {
				return event.finish();
			}
			const targets = result.targets.slice().sortBySeat();
			player.logSkill("dcmiyi", targets, fn == "damage" ? "fire" : "green");
			while (targets.length) {
				const target = targets.shift();
				if (!target.isIn()) {
					continue;
				}
				target[fn]();
				target
					.when({ global: "phaseJieshuBegin" })
					.vars({
						fn: func[ind ^ 1],
						source: player,
					})
					.then(() => {
						if (source.isIn()) {
							if (!trigger._dcmiyi_logged) {
								source.logSkill("dcmiyi");
								trigger._dcmiyi_logged = true;
							}
							source.line(player, fn == "damage" ? "fire" : "green");
						}
						player[fn](source);
					});
			}
		},
	},
	dcyinjun: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (get.name(event.card, false) != "sha" && get.type2(event.card) != "trick") {
				return false;
			}
			if (event.targets.length != 1 || !event.targets[0].isIn()) {
				return false;
			}
			if (!player.canUse(new lib.element.VCard({ name: "sha" }), event.targets[0], false)) {
				return false;
			}
			return player.hasHistory("lose", evt => {
				if ((evt.relatedEvent || evt.getParent()) != event) {
					return false;
				}
				return event.cards.every(card => {
					return evt.hs.includes(card);
				});
			});
		},
		prompt2(event, player) {
			return `视为对${get.translation(event.targets)}使用一张无伤害来源的【杀】`;
		},
		check(event, player) {
			const sha = new lib.element.VCard({ name: "sha" });
			return Math.max(...[event.targets[0], player].map(source => get.effect(event.targets[0], sha, source, player))) > 0;
		},
		logTarget: "targets",
		*content(event, map) {
			const player = map.player,
				trigger = map.trigger,
				target = trigger.targets[0];
			yield (player.useCard(new lib.element.VCard({ name: "sha" }), target, false).oncard = () => {
				get.event().customArgs.default.customSource = {
					isDead: () => true,
				};
			});
			if (player.getHistory("useSkill", evt => evt.skill == "dcyinjun").length > player.getHp()) {
				player.tempBanSkill("dcyinjun");
			}
		},
	},
	//马伶俐
	dclima: {
		mod: {
			globalFrom(from, to, distance) {
				return (
					distance -
					Math.max(
						1,
						game.countPlayer(current => {
							return current.countCards("e", card => {
								return get.is.attackingMount(card) || get.is.defendingMount(card);
							});
						})
					)
				);
			},
		},
	},
	dcxiaoyin: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(current => get.distance(player, current) <= 1);
		},
		group: "dcxiaoyin_damage",
		prompt2(event, player) {
			return `亮出牌堆顶的${get.cnNumber(game.countPlayer(current => get.distance(player, current) <= 1))}张牌，获得其中的红色牌，将其中任意张黑色牌置于等量名座次连续的其他角色的武将牌上。`;
		},
		frequent: true,
		check: () => true,
		*content(event, map) {
			var player = map.player;
			var count = game.countPlayer(current => get.distance(player, current) <= 1);
			var cards = game.cardsGotoOrdering(get.cards(count)).cards;
			yield player.showCards(cards, `${get.translation(player)}【硝引】亮出`);
			player.gain(
				cards.filter(i => get.color(i, false) == "red"),
				"gain2"
			);
			var blackOnes = cards.filter(i => get.color(i, false) == "black");
			if (!blackOnes.length) {
				return event.finish();
			}
			var targets = game.filterPlayer(current => current != player);
			if (targets.length == 1) {
				var result = { bool: true, targets: targets };
			} else {
				var result = yield player
					.chooseTarget([1, blackOnes.length], true, (card, player, target) => {
						if (player == target) {
							return false;
						}
						var selected = ui.selected.targets;
						if (!selected.length) {
							return true;
						}
						for (var i of selected) {
							if (i.getNext() == target || i.getPrevious() == target) {
								return true;
							}
						}
						return false;
					})
					.set("complexSelect", true)
					.set("complexTarget", true)
					.set("multitarget", true)
					.set("multiline", true)
					.set("ai", target => {
						if (get.event("aiTargets").includes(target)) {
							return 10;
						}
						return 0.1;
					})
					.set(
						"aiTargets",
						(() => {
							const targets = game.filterPlayer(i => i != player).sortBySeat(player),
								values = targets.map(cur => {
									const eff = get.damageEffect(cur, cur, player, "fire");
									if (eff > 0) {
										return Math.min(eff, -get.attitude(player, cur));
									}
									return eff;
								});
							let maxEff = -Infinity,
								aiTargets = [];
							for (let i = 0; i < targets.length; i++) {
								for (let j = 1; j < blackOnes.length; j++) {
									if (targets.length < j) {
										break;
									}
									let targetsx = targets.slice(i, i + j),
										tmpEff = values.slice(i, i + j).reduce((p, c) => {
											return p + c;
										}, 0);
									if (tmpEff > maxEff) {
										maxEff = tmpEff;
										aiTargets = targetsx;
									}
								}
							}
							return aiTargets;
						})()
					)
					.set("createDialog", [`###硝引：剩余的黑色牌###<div class="text center">请选择至多${get.cnNumber(blackOnes.length)}名座次连续的其他角色，然后将以下这些牌置于这些角色的武将牌上。</div>`, blackOnes]);
			}
			if (!result.bool) {
				event.finish();
				return;
			}
			var targets = result.targets.slice().sortBySeat(player);
			var num = targets.length;
			if (blackOnes.length == 1) {
				var result = { bool: true, links: blackOnes };
			} else {
				var result = yield player.chooseCardButton(`###硝引：剩余的黑色牌###<div class="text center">将${get.cnNumber(num)}张黑色牌按照选择的角色的座次顺序置于这些角色武将牌上</div>`, blackOnes, true, num).set("ai", () => 1);
			}
			if (result.bool) {
				var cards = result.links;
				player.line(targets);
				targets.forEach((current, ind) => {
					current.addToExpansion(cards[ind], "gain2").gaintag.add("dcxiaoyin");
					game.log(current, "将", cards[ind], "当“硝引”置于了武将牌上");
				});
			}
		},
		marktext: "硝",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		subSkill: {
			damage: {
				audio: "dcxiaoyin",
				trigger: { global: "damageBegin3" },
				filter(event, player) {
					if (!event.source || !event.source.isIn()) {
						return false;
					}
					return event.player.getExpansions("dcxiaoyin").length;
				},
				//direct:true,
				async cost(event, trigger, player) {
					const source = trigger.source,
						target = trigger.player;
					const cards = target.getExpansions("dcxiaoyin");
					if (trigger.hasNature("fire")) {
						const types = cards.map(i => get.type2(i, false));
						const str = get.translation(types).replace(/(.*)、/, "$1或");
						event.result = await source
							.chooseCard(`硝引：是否弃置一张${str}牌？`, `若如此做，将${get.translation(target)}的对应的“硝引”牌置入弃牌堆，令你对其造成的伤害+1`, "he", function (card, player) {
								if (!get.event("types").includes(get.type2(card))) {
									return false;
								}
								return lib.filter.cardDiscardable.apply(this, arguments);
							})
							.set("types", types)
							.set("ai", card => {
								if (get.event("goon")) {
									return 7 - get.value(card);
								}
								return 0;
							})
							.set("goon", get.damageEffect(target, player, player, "fire") > 0 && get.attitude(player, target) <= 0)
							.forResult();
					} else {
						event.result = await source
							.chooseBool(`###是否响应${get.translation(player)}的【硝引】？###获得${get.translation(target)}的一张“硝引”牌（${get.translation(cards)}），然后将你对其造成的此次伤害改为火焰伤害。`)
							.set(
								"choice",
								(() => {
									if (get.damageEffect(target, source, source, "fire") < get.damageEffect(target, source, source) - 5) {
										return false;
									}
									if (cards.map(i => get.value(i)).reduce((p, c) => p + c, 0) > 0) {
										return true;
									}
									return false;
								})()
							)
							.forResult();
					}
				},
				async content(event, trigger, player) {
					const source = trigger.source,
						target = trigger.player;
					if (trigger.hasNature("fire")) {
						source.line(target, "fire");
						const type = get.type2(event.cards[0]);
						await source.discard(event.cards).set("discarder", source);
						//await game.delayx();
						const cardsToDiscard = target.getExpansions("dcxiaoyin").filter(card => get.type2(card, false) === type);
						if (cardsToDiscard.length === 1) {
							await target.loseToDiscardpile(cardsToDiscard);
						} else if (cardsToDiscard.length > 1) {
							const result = await source.chooseButton([`请选择移去${get.translation(source)}的一张“硝引”牌`, cardsToDiscard], true).forResult();
							await target.loseToDiscardpile(result.links);
						}
						trigger.addNumber("num", 1);
					} else {
						source.line(target, "fire");
						const cards = target.getExpansions("dcxiaoyin");
						if (cards.length === 1) {
							await source.gain(cards, target, "give");
						} else if (cards.length > 1) {
							const result = await source.chooseButton([`请选择获得${get.translation(source)}的一张“硝引”牌`, cards], true).forResult();
							await source.gain(result.links, target, "give");
						}
						game.setNature(trigger, "fire");
					}
				},
			},
		},
		ai: {
			threaten: 4,
		},
	},
	dchuahuo: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		viewAs: {
			name: "sha",
			nature: "fire",
			storage: { dchuahuo: true },
		},
		filterCard: { color: "red" },
		position: "hs",
		filter(event, player) {
			return player.countCards("hs", { color: "red" });
		},
		check(card) {
			return 6 - get.value(card);
		},
		precontent() {
			event.getParent().addCount = false;
			player
				.when("useCardToPlayer")
				.filter(evt => evt.card.storage && evt.card.storage.dchuahuo)
				.then(() => {
					if (trigger.target.getExpansions("dcxiaoyin").length) {
						var targets = game.filterPlayer(current => {
							return current.getExpansions("dcxiaoyin").length;
						});
						player.chooseBool(`是否更改${get.translation(trigger.card)}的目标？`, `将此牌的目标改为所有有“硝引”的角色（${get.translation(targets)}）。`).set("choice", targets.map(current => get.effect(current, trigger.card, player, player)).reduce((p, c) => p + c, 0) > get.effect(trigger.target, trigger.card, player, player));
					} else {
						event.finish();
					}
				})
				.then(() => {
					if (result.bool) {
						trigger.targets.length = 0;
						trigger.getParent().triggeredTargets1.length = 0;
						trigger.untrigger();
						var targets = game.filterPlayer(current => {
							return current.getExpansions("dcxiaoyin").length;
						});
						player.line(targets, "fire");
						trigger.targets.addArray(targets);
						game.log(targets, "成为了", trigger.card, "的新目标");
						game.delayx();
					}
				});
		},
		ai: {
			order: () => get.order({ name: "sha" }) + 0.2,
			result: { player: 1 },
		},
	},
	//武陆逊
	dcxiongmu: {
		audio: 2,
		trigger: { global: "roundStart" },
		group: "dcxiongmu_minus",
		prompt2(event, player) {
			return (player.countCards("h") < player.maxHp ? "将手牌摸至" + get.cnNumber(player.maxHp) + "张，然后" : "") + "将任意张牌随机置入牌堆并从牌堆或弃牌堆中获得等量点数为8的牌。";
		},
		content() {
			"step 0";
			player.drawTo(player.maxHp);
			"step 1";
			var cards = player.getCards("he");
			if (!cards.length) {
				event.finish();
			} else if (cards.length == 1) {
				event._result = { bool: true, cards: cards };
			} else {
				player.chooseCard("雄幕：将任意张牌置入牌堆的随机位置", "he", [1, Infinity], true).set("ai", card => {
					return 6 - get.value(card);
				});
			}
			"step 2";
			if (result.bool) {
				var cards = result.cards;
				event.cards = cards;
				game.log(player, `将${get.cnNumber(cards.length)}张牌置入了牌堆`);
				player.loseToDiscardpile(cards, ui.cardPile, "blank").set("log", false).insert_index = function () {
					return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
				};
			} else {
				event.finish();
			}
			"step 3";
			var list = [],
				shown = [];
			var piles = ["cardPile", "discardPile"];
			for (var pile of piles) {
				for (var i = 0; i < ui[pile].childNodes.length; i++) {
					var card = ui[pile].childNodes[i];
					var number = get.number(card, false);
					if (!list.includes(card) && number == 8) {
						list.push(card);
						if (pile == "discardPile") {
							shown.push(card);
						}
						if (list.length >= cards.length) {
							break;
						}
					}
				}
				if (list.length >= cards.length) {
					break;
				}
			}
			if (list.length) {
				var next = player.gain(list);
				next.shown_cards = shown;
				next.set("animate", function (event) {
					var player = event.player,
						cards = event.cards,
						shown = event.shown_cards;
					if (shown.length < cards.length) {
						var num = cards.length - shown.length;
						player.$draw(num);
						game.log(player, "从牌堆获得了", get.cnNumber(num), "张点数为8的牌");
					}
					if (shown.length > 0) {
						player.$gain2(shown, false);
						game.log(player, "从弃牌堆获得了", shown);
					}
					return 500;
				});
				next.gaintag.add("dcxiongmu_tag");
				player.addTempSkill("dcxiongmu_tag", "roundStart");
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (target.countCards("h") > target.getHp() || player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (player._dcxiongmu_temp) {
						return;
					}
					if (_status.event.getParent("useCard", true) || _status.event.getParent("_wuxie", true)) {
						return;
					}
					if (get.tag(card, "damage")) {
						if (target.getHistory("damage").length > 0) {
							return [1, -2];
						} else {
							if (get.attitude(player, target) > 0 && target.hp > 1) {
								return "zeroplayertarget";
							}
							if (get.attitude(player, target) < 0 && !player.hasSkillTag("damageBonus")) {
								if (card.name == "sha") {
									return;
								}
								var sha = false;
								player._dcxiongmu_temp = true;
								var num = player.countCards("h", function (card) {
									if (card.name == "sha") {
										if (sha) {
											return false;
										} else {
											sha = true;
										}
									}
									return get.tag(card, "damage") && player.canUse(card, target) && get.effect(target, card, player, player) > 0;
								});
								delete player._dcxiongmu_temp;
								if (player.hasSkillTag("damage")) {
									num++;
								}
								if (num < 2) {
									var enemies = player.getEnemies();
									if (enemies.length == 1 && enemies[0] == target && player.needsToDiscard()) {
										return;
									}
									return "zeroplayertarget";
								}
							}
						}
					}
				},
			},
		},
		subSkill: {
			minus: {
				audio: "dcxiongmu",
				trigger: { player: "damageBegin4" },
				filter(event, player) {
					return (
						player.countCards("h") <= player.getHp() &&
						game
							.getGlobalHistory(
								"everything",
								evt => {
									return evt.name == "damage" && evt.player == player;
								},
								event
							)
							.indexOf(event) == 0
					);
				},
				forced: true,
				locked: false,
				content() {
					trigger.num--;
				},
			},
			tag: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("dcxiongmu_tag");
				},
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("dcxiongmu_tag")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("dcxiongmu_tag")) {
							return false;
						}
					},
				},
			},
		},
	},
	dczhangcai: {
		audio: 2,
		mod: {
			aiOrder: (player, card, num) => {
				if (num > 0 && get.tag(card, "draw") && ui.cardPile.childNodes.length + ui.discardPile.childNodes.length < 20) {
					return 0;
				}
			},
			aiValue: (player, card, num) => {
				if (num > 0 && card.name === "zhuge") {
					return 20;
				}
			},
			aiUseful: (player, card, num) => {
				if (num > 0 && card.name === "zhuge") {
					return 10;
				}
			},
		},
		trigger: {
			player: ["useCard", "respond"],
		},
		filter(event, player) {
			if (player.hasSkill("dczhangcai_all")) {
				return true;
			}
			return get.number(event.card) == 8;
		},
		prompt2(event, player) {
			const num = player.hasSkill("dczhangcai_all") ? get.number(event.card) : 8;
			let count = 1;
			if (typeof num == "number") {
				count = Math.max(
					1,
					player.countCards("h", card => get.number(card) == num)
				);
			}
			return "你可以摸" + get.cnNumber(count) + "张牌。";
		},
		check: (event, player) => {
			const num = player.hasSkill("dczhangcai_all") ? get.number(event.card) : 8;
			let count = 1;
			if (typeof num == "number") {
				count = Math.max(
					1,
					player.countCards("h", card => get.number(card) == num)
				);
			}
			return ui.cardPile.childNodes.length + ui.discardPile.childNodes.length >= count;
		},
		frequent: true,
		locked: false,
		content() {
			var num = player.hasSkill("dczhangcai_all") ? get.number(trigger.card) : 8;
			var count = 1;
			if (typeof num == "number") {
				count = Math.max(
					1,
					player.countCards("h", card => get.number(card) == num)
				);
			}
			player.draw(count);
		},
		ai: {
			threaten: 4,
			combo: "dcxiongmu",
		},
		subSkill: {
			all: {
				charlotte: true,
				mark: true,
				intro: {
					content: "当你使用或打出牌时，你可以摸X张牌（X为你手牌中与此牌点数相同的牌数且至少为1）",
				},
			},
		},
	},
	dcruxian: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.addTempSkill("dczhangcai_all", { player: "phaseBegin" });
		},
		ai: {
			combo: "dczhangcai",
			order: 15,
			result: {
				player(player) {
					if (!player.hasSkill("dczhangcai")) {
						return 0;
					}
					if (player.countCards("hs", card => get.number(card) != 8 && player.hasValueTarget(card)) > 3 || player.hp == 1) {
						return 5;
					}
					return 0;
				},
			},
		},
	},
	//新杀许靖
	dcshangyu: {
		audio: 2,
		init: () => {
			game.addGlobalSkill("dcshangyu_ai");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("dcshangyu", null, null, false), true)) {
				game.removeGlobalSkill("dcshangyu_ai");
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
			"step 0";
			var card = get.cardPile(card => get.name(card, false) == "sha");
			if (card) {
				event.card = card;
				player.gain(card, "gain2").gaintag.add("dcshangyu_tag");
				player.markAuto("dcshangyu", card);
			} else {
				player.chat("不是，连杀都没有？");
				event.finish();
			}
			"step 1";
			if (get.owner(card) == player && get.position(card) == "h" && game.hasPlayer(current => current != player)) {
				let targets = game
					.filterPlayer(
						i => {
							return get.attitude(player, i) > 0;
						},
						null,
						true
					)
					.sortBySeat(
						get.zhu(player) ||
							game.findPlayer(i => {
								return i.getSeatNum() === 1;
							})
					);
				if (targets.includes(player)) {
					targets = targets.slice(0, targets.indexOf(player));
				}
				player
					.chooseTarget(`是否将${get.translation(card)}交给一名其他角色？`, lib.filter.notMe)
					.set("ai", target => {
						let idx = _status.event.targets.indexOf(target);
						if (idx < 0) {
							return -1;
						}
						return 1 / (idx + 1);
					})
					.set("targets", targets);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				if (get.mode() !== "identity" || player.identity !== "nei") {
					player.addExpose(0.2);
				}
				player.give(card, target).gaintag.add("dcshangyu_tag");
			}
			player.addSkill("dcshangyu_effect");
		},
		subSkill: {
			ai: {
				mod: {
					aiOrder(player, card, num) {
						if (
							get.itemtype(card) == "card" &&
							card.hasGaintag("dcshangyu_tag") &&
							game.hasPlayer(current => {
								return current.hasSkill("dcshangyu") && get.attitude(player, current) >= 0;
							})
						) {
							return num + 0.1;
						}
					},
					aiValue(player, card, num) {
						if (
							get.itemtype(card) == "card" &&
							card.hasGaintag("dcshangyu_tag") &&
							game.hasPlayer(current => {
								return current.hasSkill("dcshangyu") && get.attitude(player, current) >= 0;
							})
						) {
							return num / 10;
						}
					},
					aiUseful() {
						return lib.skill.dcshangyu_ai.mod.aiValue.apply(this, arguments);
					},
				},
				trigger: {
					player: "dieAfter",
				},
				filter: () => {
					return !game.hasPlayer(i => i.hasSkill("dcshangyu", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				forced: true,
				popup: false,
				content: () => {
					game.removeGlobalSkill("dcshangyu_ai");
				},
			},
			effect: {
				audio: "dcshangyu",
				trigger: {
					global: "damageSource",
				},
				filter(event, player) {
					return event.cards && event.cards.some(card => player.getStorage("dcshangyu").includes(card));
				},
				forced: true,
				charlotte: true,
				direct: true,
				group: ["dcshangyu_transfer", "dcshangyu_addTag"],
				content() {
					"step 0";
					var list = [player];
					if (trigger.source && trigger.source.isIn()) {
						player.logSkill("dcshangyu_effect", trigger.source);
						list.push(trigger.source);
					} else {
						player.logSkill("dcshangyu_effect");
					}
					list.sortBySeat();
					game.asyncDraw(list);
				},
			},
			transfer: {
				audio: "dcshangyu",
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
				},
				forced: true,
				direct: true,
				filter(event, player) {
					if (
						!game.hasPlayer(current => {
							return !player.getStorage("dcshangyu_transfer").includes(current);
						})
					) {
						return false;
					}
					return event.getd().some(card => {
						return get.position(card) == "d" && player.getStorage("dcshangyu").includes(card);
					});
				},
				content() {
					"step 0";
					var cards = trigger.getd().filter(card => {
							return get.position(card) == "d" && player.getStorage("dcshangyu").includes(card);
						}),
						targets = game
							.filterPlayer(current => {
								return !player.getStorage("dcshangyu_transfer").includes(current);
							})
							.sortBySeat(_status.currentPhase);
					if (targets.length && targets[0] === _status.currentPhase && !_status.currentPhase?.getCardUsable("sha")) {
						targets.push(targets.shift());
					}
					event.cards = cards;
					player
						.chooseTarget(
							`赏誉：将${get.translation(cards)}交给一名可选角色`,
							(card, player, target) => {
								return !player.getStorage("dcshangyu_transfer").includes(target);
							},
							true
						)
						.set("ai", target => {
							let att = get.sgnAttitude(_status.event.player, target),
								idx = 1 + _status.event.targets.indexOf(target);
							if (att < 0) {
								return -idx;
							}
							return att + 1 / idx;
						})
						.set("targets", targets);
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("dcshangyu_transfer", target);
						if (!player.storage.dcshangyu_transfer) {
							player.when({ global: "phaseAfter" }).then(() => {
								player.unmarkSkill("dcshangyu_transfer");
								delete player.storage.dcshangyu_transfer;
							});
						}
						player.markAuto("dcshangyu_transfer", target);
						target.gain(cards, "gain2").set("giver", player).gaintag.add("dcshangyu_tag");
					}
				},
				intro: {
					content: "本回合已交给过$",
				},
			},
			addTag: {
				trigger: {
					global: ["gainAfter", "loseAsyncAfter"],
				},
				charlotte: true,
				popup: false,
				silent: true,
				lastDo: true,
				filter(event, player) {
					return game.hasPlayer(current => {
						var cards = event.getg(current);
						return cards.some(card => player.getStorage("dcshangyu").includes(card));
					});
				},
				content() {
					game.countPlayer(current => {
						var cards = trigger.getg(current);
						if (cards.length) {
							cards = cards.filter(card => player.getStorage("dcshangyu").includes(card));
							current.addGaintag(cards, "dcshangyu_tag");
						}
					});
				},
			},
		},
	},
	dccaixia: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			return !player.hasMark("dccaixia_clear");
		},
		direct: true,
		locked: false,
		content() {
			"step 0";
			var choices = Array.from({
				length: Math.min(5, game.players.length + game.dead.length),
			}).map((_, i) => get.cnNumber(i + 1, true));
			player
				.chooseControl(choices, "cancel2")
				.set("prompt", get.prompt("dccaixia"))
				.set("prompt2", "你可以摸至多" + get.cnNumber(choices.length) + "张牌，但是你此后需要再使用等量的牌才可再发动本技能。")
				.set("ai", () => {
					return _status.event.choice;
				})
				.set(
					"choice",
					(function () {
						var cards = player.getCards("hs", card => get.name(card, player) !== "sha" && player.hasValueTarget(card));
						var damage = Math.min(player.getCardUsable({ name: "sha" }), player.countCards("hs", "sha")) + cards.filter(i => get.tag(i, "damage")).length;
						if (player.isPhaseUsing() || player.hp + player.hujia + player.countCards("hs", card => get.tag(card, "recover")) > 2) {
							if (damage) {
								return Math.min(choices.length - 1, cards.length - damage);
							}
							return Math.min(choices.length - 1, cards.length - 1);
						}
						return choices.length - 1;
					})()
				);
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("dccaixia");
				var num = result.index + 1;
				player.draw(num);
				player.addMark("dccaixia_clear", num, false);
				player.addSkill("dccaixia_clear");
			}
		},
		mod: {
			aiOrder(player, card, num) {
				if (!get.tag(card, "damage")) {
					return;
				}
				if (player.countMark("dccaixia_clear") > 1) {
					return num / 3;
				}
				return num + 6;
			},
		},
		subSkill: {
			clear: {
				trigger: { player: "useCard1" },
				filter(event, player) {
					return player.hasMark("dccaixia_clear");
				},
				forced: true,
				popup: false,
				charlotte: true,
				content() {
					player.removeMark("dccaixia_clear", 1, false);
				},
				intro: {
					name: "才瑕",
					name2: "瑕",
					content: "距离刷新技能还需使用&张牌",
				},
			},
		},
	},
	//十周年二乔
	dcxingwu: {
		intro: {
			content: "expansion",
			markcount: "expansion",
			onunmark(storage, player) {
				player.removeAdditionalSkill("dcluoyan");
			},
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		audio: "xingwu",
		trigger: { player: "phaseDiscardBegin" },
		filter(event, player) {
			return player.countCards("h");
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseCard("h", get.prompt("dcxingwu"), "将一张手牌作为“舞”置于武将牌上")
				.set("ai", function (card) {
					var att = 1,
						list = [];
					for (var i of player.getExpansions("dcxingwu")) {
						if (!list.includes(get.suit(i))) {
							list.push(get.suit(i));
						}
					}
					if (!list.includes(get.suit(card))) {
						att = 2;
					}
					if (_status.event.goon) {
						return (20 - get.value(card)) * att;
					}
					return (7 - get.value(card)) * att;
				})
				.set("goon", player.needsToDiscard() || player.getExpansions("dcxingwu").length == 2);
			"step 1";
			if (result.bool) {
				player.logSkill("dcxingwu");
				var cards = result.cards;
				player.addToExpansion(cards, player, "give").gaintag.add("dcxingwu");
			}
			"step 2";
			game.delayx();
			if (player.getExpansions("dcxingwu").length > 2) {
				player.chooseButton(["是否移去三张“舞”并发射核弹？", player.getExpansions("dcxingwu")], 3).ai = button => {
					if (
						game.hasPlayer(function (current) {
							return get.attitude(player, current) < 0;
						})
					) {
						return 1;
					}
					return 0;
				};
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				event.cards = result.links;
				var list = [],
					str = ["<span class='texiaotext' style='color:#66FF00'>小型</span>", "<span class='texiaotext' style='color:#6666FF'>中型</span>", "<span class='texiaotext' style='color:#FF0000'>巨型</span>"];
				for (var i of event.cards) {
					if (!list.includes(get.suit(i))) {
						list.push(get.suit(i));
					}
				}
				player.chooseTarget("请选择" + str[list.length - 1] + "核弹的投射的目标（伤害：" + list.length + "点）", lib.filter.notMe, true).ai = target => {
					var att = 1;
					if (target.sex == "male") {
						att = 1.5;
					}
					if ((target.hp == target.sex) == "male" ? 2 : 1) {
						att *= 1.2;
					}
					if (get.mode() == "identity" && player.identity == "fan" && target.isZhu) {
						att *= 3;
					}
					return -get.attitude(player, target) * att * Math.max(1, target.countCards("e"));
				};
			}
			"step 4";
			if (result.bool) {
				var list = [];
				for (var i of event.cards) {
					if (!list.includes(get.suit(i))) {
						list.push(get.suit(i));
					}
				}
				player.loseToDiscardpile(event.cards);
				player.logSkill("dcxingwu", result.targets[0]);
				player.discardPlayerCard(result.targets[0], "e", result.targets[0].countCards("e"), true);
				result.targets[0].damage(result.targets[0].sex == "female" ? 1 : list.length);
			}
		},
	},
	dcluoyan: {
		derivation: ["retianxiang", "liuli"],
		init(player) {
			if (player.getExpansions("dcxingwu").length) {
				player.addAdditionalSkill("dcluoyan", ["retianxiang", "liuli"]);
			} else {
				player.removeAdditionalSkill("dcluoyan");
			}
		},
		onremove(player) {
			player.removeAdditionalSkill("dcluoyan");
		},
		trigger: { player: ["loseAfter", "loseAsyncAfter", "addToExpansionAfter"] },
		filter(event, player) {
			var cards = player.getExpansions("dcxingwu"),
				skills = player.additionalSkills.dcluoyan;
			return !((cards.length && skills && skills.length) || (!cards.length && (!skills || !skills.length)));
		},
		forced: true,
		silent: true,
		content() {
			lib.skill.dcluoyan.init(player, "dcluoyan");
		},
		ai: {
			combo: "dcxingwu",
		},
	},
	retianxiang_daxiaoqiao: {
		audio: "tianxiang_daxiaoqiao",
		inherit: "retianxiang",
	},
	//田尚衣
	dcposuo: {
		onChooseToUse(event) {
			if (!game.online && !event.dcposuo_cards) {
				var player = event.player;
				var evtx = event.getParent("phaseUse");
				var suits = lib.suit.slice(0).reverse();
				suits = suits.filter(suit => !player.getStorage("dcposuo_suits").includes(suit) && player.countCards("hs", card => get.suit(card, player) == suit));
				if (
					!suits.length ||
					player.getHistory("sourceDamage", evt => {
						return evt.player != player && evt.getParent("phaseUse") == evtx;
					}).length
				) {
					event.set("dcposuo_cards", undefined);
				} else {
					var list = [],
						cards = Array.from(ui.cardPile.childNodes);
					cards.addArray(Array.from(ui.discardPile.childNodes));
					game.countPlayer(current => cards.addArray(current.getCards("hejxs")));
					for (var name of lib.inpile) {
						if (!get.tag({ name: name }, "damage") || get.type(new lib.element.VCard({ name: name })) === "delay") {
							continue;
						}
						let same = cards.filter(card => get.name(card, false) == name && !get.natureList(card, false).length);
						if (same.length) {
							for (var suit of suits) {
								if (same.some(card => get.suit(card, false) == suit)) {
									list.push([suit, "", name, undefined, suit]);
								}
							}
						}
						for (var nature of lib.inpile_nature) {
							same = cards.filter(card => get.name(card, false) == name && get.is.sameNature(get.natureList(card, false), nature));
							if (same.length) {
								for (var suit of suits) {
									if (same.some(card => get.suit(card, false) == suit)) {
										list.push([suit, "", name, nature, suit]);
									}
								}
							}
						}
					}
					event.set("dcposuo_cards", list);
				}
			}
		},
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return event.dcposuo_cards && event.dcposuo_cards.length;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("婆娑", [event.dcposuo_cards, "vcard"], "hidden");
			},
			check(button) {
				var player = _status.event.player;
				return player.getUseValue({ name: button.link[2], nature: button.link[3] });
			},
			backup(links, player) {
				return {
					suit: links[0][4],
					filterCard(card, player) {
						return get.suit(card, player) == lib.skill.dcposuo_backup.suit;
					},
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					check(card) {
						return 6.5 - get.value(card);
					},
					log: false,
					precontent() {
						player.logSkill("dcposuo");
						player.addTempSkill("dcposuo_suits", "phaseUseAfter");
						player.markAuto("dcposuo_suits", [get.suit(event.result.cards[0])]);
					},
				};
			},
			prompt(links, player) {
				var suit = links[0][4];
				var name = links[0][2];
				var nature = links[0][3];
				return "将一张" + get.translation(suit) + "牌当作" + (get.translation(nature) || "") + get.translation(name) + "使用";
			},
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
		subSkill: {
			suits: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	dcxiaoren: {
		audio: 2,
		trigger: {
			source: "damageSource",
		},
		usable: 1,
		check: (event, player) => {
			let rev = game.countPlayer(i => {
				return i.isDamaged() && get.attitude(_status.event.player, i) > 0;
			});
			if (!event.player.isIn() || game.countPlayer() < 2) {
				return rev;
			}
			if (get.damageEffect(event.player.getPrevious(), player, _status.event.player) > -rev) {
				return true;
			}
			return get.damageEffect(event.player.getNext(), player, _status.event.player) > -rev;
		},
		content() {
			"step 0";
			player.addTempSkill("dcxiaoren_dying");
			event.target = trigger.player;
			"step 1";
			player.judge();
			"step 2";
			if (result.color == "red") {
				player.chooseTarget("绡刃：是否令一名角色回复1点体力（若回满则额外摸一张牌）？").set("ai", target => {
					let rec = get.recoverEffect(target, _status.event.player, _status.event.player);
					if (target.getDamagedHp() <= 1) {
						return rec + get.effect(target, { name: "draw" }, target, _status.event.player);
					}
					return rec;
				});
			} else if (result.color != "black" || !trigger.player.isIn() || game.countPlayer() < 2) {
				event.goto(9);
			} else {
				event.goto(5);
			}
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target);
				target.recover();
			} else {
				event.goto(9);
			}
			"step 4";
			if (event.target.isHealthy()) {
				event.target.draw();
			}
			event.goto(9);
			"step 5";
			var targets = [].addArray([target.getPrevious(), target.getNext()]);
			if (targets.length > 1) {
				player
					.chooseTarget(
						"绡刃：对其中一名角色造成1点伤害",
						(card, player, target) => {
							return _status.event.targets.includes(target);
						},
						true
					)
					.set("ai", target => {
						let player = _status.event.player;
						return get.damageEffect(target, player, player);
					})
					.set("targets", targets);
			} else if (targets.length) {
				event._result = { bool: true, targets: targets };
			}
			"step 6";
			if (result.bool) {
				let target = result.targets[0];
				event.target = target;
				player.line(target);
				target.damage("nocard");
			} else {
				event.goto(9);
			}
			"step 7";
			if (player.storage.dcxiaoren_dying || get.is.blocked(event.name, player)) {
				event._result = { bool: false };
			} else if (event.frequent) {
				event._result = { bool: true };
			} else {
				player
					.chooseBool("绡刃：是否再次进行判定并执行对应效果直到未能执行此项或有角色进入濒死状态？")
					.set("ai", function () {
						return _status.event.bool;
					})
					.set("bool", lib.skill.dcxiaoren.check({ player: event.target }, player));
			}
			"step 8";
			if (result.bool) {
				event.frequent = true;
				event.goto(1);
			}
			"step 9";
			player.removeSkill("dcxiaoren_dying");
		},
		subSkill: {
			dying: {
				init: player => {
					delete player.storage.dcxiaoren_dying;
				},
				onremove: player => {
					delete player.storage.dcxiaoren_dying;
				},
				trigger: { global: "dying" },
				forced: true,
				popup: false,
				charlotte: true,
				content() {
					player.storage.dcxiaoren_dying = true;
				},
			},
		},
	},
	//孙翎鸾
	dclingyue: {
		audio: 2,
		trigger: { global: "damageSource" },
		forced: true,
		filter(event, player) {
			if (!event.source || !event.source.isIn()) {
				return false;
			}
			var history = event.source.actionHistory;
			for (var i = history.length - 1; i >= 0; i--) {
				if (i == history.length - 1) {
					if (history[i].sourceDamage.indexOf(event) > 0) {
						return false;
					}
				} else if (history[i].sourceDamage.some(evt => evt != event)) {
					return false;
				}
				if (history[i].isRound) {
					break;
				}
			}
			return true;
		},
		content() {
			var num = 1,
				current = _status.currentPhase;
			if (current && trigger.source != current) {
				var num = 0,
					players = game.players.slice(0).concat(game.dead);
				for (var target of players) {
					target.getHistory("sourceDamage", function (evt) {
						num += evt.num;
					});
				}
			}
			player.draw(num);
		},
	},
	dcpandi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			var players = event.dcpandi;
			if (!players || !players.length) {
				return false;
			}
			var source = player.storage.dcpandi_effect;
			return get.itemtype(source) != "player" || !source.isIn();
		},
		pandi_wrapKey() {
			var str = "";
			for (var arg of arguments) {
				if (arg === null || arg === undefined) {
					str += arg + "-";
					continue;
				}
				switch (get.itemtype(arg)) {
					case "player":
						str += "p:" + arg.playerid;
						break;
					case "card":
						if (arg.cardid) {
							str += "c:" + arg.cardid;
						} else {
							str += "c:" + arg.name;
						}
						break;
					default:
						str += "n:" + arg;
						break;
				}
				str += "-";
			}
			return str;
		},
		pandi_effect(target, card, player, viewer) {
			if (!_status.event) {
				return get.effect(target, card, player, viewer);
			}
			var key = lib.skill.dcpandi.pandi_wrapKey.apply(null, arguments);
			var effect = _status.event.getTempCache("effect", key);
			if (effect !== undefined) {
				return effect;
			}
			effect = get.effect(target, card, player, viewer);
			_status.event.putTempCache("effect", key, effect);
			return effect;
		},
		pandi_canUse(player, card, target, arg1, arg2) {
			if (!_status.event) {
				return player.canUse(card, target, arg1, arg2);
			}
			var key = lib.skill.dcpandi.pandi_wrapKey.apply(null, arguments);
			var effect = _status.event.getTempCache("canUse", key);
			if (effect !== undefined) {
				return effect;
			}
			effect = player.canUse(card, target, arg1, arg2);
			_status.event.putTempCache("canUse", key, effect);
			return effect;
		},
		pandi_effect_use(target, card, player, viewer) {
			if (!_status.event) {
				return get.effect_use(target, card, player, viewer);
			}
			var key = lib.skill.dcpandi.pandi_wrapKey.apply(null, arguments);
			var effect = _status.event.getTempCache("effect_use", key);
			if (effect !== undefined) {
				return effect;
			}
			effect = get.effect_use(target, card, player, viewer);
			_status.event.putTempCache("effect_use", key, effect);
			return effect;
		},
		onChooseToUse(event) {
			if (!game.online && event.type == "phase" && !event.dcpandi) {
				var players = game.filterPlayer(function (current) {
					return current != event.player && current.getHistory("sourceDamage").length == 0;
				});
				event.set("dcpandi", players);
			}
		},
		filterTarget(card, player, target) {
			var players = _status.event.dcpandi;
			if (!players || !players.length) {
				return false;
			}
			return players.includes(target);
		},
		content() {
			if (target.isIn()) {
				player.storage.dcpandi_effect = target;
				player.addTempSkill("dcpandi_effect", "phaseUseAfter");
			}
		},
		ai: {
			threaten: 4,
			order: 12,
			result: {
				player(player, target) {
					return player.getCards("hs").reduce(function (eff, card) {
						return Math.max(eff, lib.skill.dcpandi.getUseValue(card, target, player) - lib.skill.dcpandi.getUseValue(card, player, player));
					}, 0);
				},
			},
		},
		getUseValue(card, player, viewer) {
			if (typeof card == "string") {
				card = { name: card, isCard: true };
			}
			var key = lib.skill.dcpandi.pandi_wrapKey(card, player, viewer);
			if (_status.event) {
				var uv = _status.event.getTempCache("getUseValue", key);
				if (uv !== undefined) {
					return uv;
				}
			}
			var targets = game.filterPlayer();
			var value = [];
			var min = 0;
			var info = get.info(card);
			if (!info || info.notarget) {
				if (_status.event) {
					_status.event.putTempCache("getUseValue", key, 0);
				}
				return 0;
			}
			var range;
			var select = get.copy(info.selectTarget);
			if (select == undefined) {
				if (info.filterTarget == undefined) {
					if (_status.event) {
						_status.event.putTempCache("getUseValue", key, true);
					}
					return true;
				}
				range = [1, 1];
			} else if (typeof select == "number") {
				range = [select, select];
			} else if (get.itemtype(select) == "select") {
				range = select;
			} else if (typeof select == "function") {
				range = select(card, player);
			}
			if (info.singleCard) {
				range = [1, 1];
			}
			game.checkMod(card, player, range, "selectTarget", player);
			if (!range) {
				if (_status.event) {
					_status.event.putTempCache("getUseValue", key, 0);
				}
				return 0;
			}
			for (var i = 0; i < targets.length; i++) {
				if (lib.skill.dcpandi.pandi_canUse(player, card, targets[i], null, true)) {
					var eff = lib.skill.dcpandi.pandi_effect(targets[i], card, player, viewer);
					value.push(eff);
				}
			}
			value.sort(function (a, b) {
				return b - a;
			});
			for (var i = 0; i < value.length; i++) {
				if (i == range[1] || (range[1] != -1 && value[i] <= 0)) {
					break;
				}
				min += value[i];
			}
			if (_status.event) {
				_status.event.putTempCache("getUseValue", key, min);
			}
			return min;
		},
		subSkill: {
			effect: {
				audio: "dcpandi",
				charlotte: true,
				priority: Infinity,
				onremove: true,
				mark: "character",
				intro: {
					content: "下一张牌视为由$使用",
				},
				trigger: { player: "useCardBefore" },
				forced: true,
				filter(event, player) {
					var source = player.storage.dcpandi_effect;
					return get.itemtype(source) == "player" && source.isIn();
				},
				logTarget: (event, player) => player.storage.dcpandi_effect,
				content() {
					trigger.player = player.storage.dcpandi_effect;
					trigger.noai = true;
					player.removeSkill("dcpandi_effect");
					game.delay(0.5);
				},
				ai: {
					order(card, player, target, current) {
						if (typeof card != "object") {
							return;
						}
						var source = player.storage.dcpandi_effect;
						if (!source.isIn() || get.itemtype(source) != "player" || get.itemtype(source.storage.dcpandi_effect) == "player") {
							return;
						}
						return [0, lib.skill.dcpandi.pandi_effect_use(target, card, source, player), 0, lib.skill.dcpandi.pandi_effect(target, card, source, target)];
					},
				},
				mod: {
					selectTarget(card, player, range) {
						var source = player.storage.dcpandi_effect;
						if (!source.isIn() || get.itemtype(source) != "player" || get.itemtype(source.storage.dcpandi_effect) == "player") {
							return;
						}
						var range,
							info = get.info(card);
						var select = get.copy(info.selectTarget);
						if (select == undefined) {
							if (info.filterTarget == undefined) {
								return [0, 0];
							}
							range = [1, 1];
						} else if (typeof select == "number") {
							range = [select, select];
						} else if (get.itemtype(select) == "select") {
							range = select;
						} else if (typeof select == "function") {
							range = select(card, source);
						}
						game.checkMod(card, source, range, "selectTarget", source);
					},
					cardEnabled2(card, player, event) {
						var source = player.storage.dcpandi_effect;
						if (!source.isIn() || get.itemtype(source) != "player" || get.itemtype(source.storage.dcpandi_effect) == "player") {
							return;
						}
						var check = game.checkMod(card, source, event, "unchanged", "cardEnabled2", source);
						return check;
					},
					cardEnabled(card, player, event) {
						var source = player.storage.dcpandi_effect;
						if (!source.isIn() || get.itemtype(source) != "player" || get.itemtype(source.storage.dcpandi_effect) == "player") {
							return;
						}
						if (event === "forceEnable") {
							var mod = game.checkMod(card, source, event, "unchanged", "cardEnabled", source);
							if (mod != "unchanged") {
								return mod;
							}
							return true;
						} else {
							var filter = get.info(card).enable;
							if (!filter) {
								return;
							}
							var mod = game.checkMod(card, player, source, "unchanged", "cardEnabled", source);
							if (mod != "unchanged") {
								return mod;
							}
							if (typeof filter == "boolean") {
								return filter;
							}
							if (typeof filter == "function") {
								return filter(card, source, event);
							}
						}
					},
					cardUsable(card, player, num) {
						var source = player.storage.dcpandi_effect;
						if (!source.isIn() || get.itemtype(source) != "player" || get.itemtype(source.storage.dcpandi_effect) == "player") {
							return;
						}
						var event = _status.event;
						if (event.type == "chooseToUse_button") {
							event = event.getParent();
						}
						if (source != _status.event.player) {
							return true;
						}
						if (info.updateUsable == "phaseUse") {
							if (event.getParent().name != "phaseUse") {
								return true;
							}
							if (event.getParent().player != source) {
								return true;
							}
						}
						event.addCount_extra = true;
						var num = info.usable;
						if (typeof num == "function") {
							num = num(card, source);
						}
						num = game.checkMod(card, source, num, event, "cardUsable", source);
						if (typeof num != "number") {
							return true;
						}
						if (source.countUsed(card) < num) {
							return true;
						}
						if (
							game.hasPlayer(function (current) {
								return game.checkMod(card, source, current, false, "cardUsableTarget", source);
							})
						) {
							return true;
						}
						return false;
					},
					playerEnabled(card, player, target) {
						var source = player.storage.dcpandi_effect;
						if (!source.isIn() || get.itemtype(source) != "player" || get.itemtype(source.storage.dcpandi_effect) == "player") {
							return;
						}
						return lib.filter.targetEnabledx(card, source, target);
					},
					targetInRange(card, player, target) {
						var source = player.storage.dcpandi_effect;
						if (!source.isIn() || get.itemtype(source) != "player" || get.itemtype(source.storage.dcpandi_effect) == "player") {
							return;
						}
						return lib.filter.targetInRange(card, source, target);
					},
				},
			},
		},
	},
	//新服灭霸
	dctongye: {
		audio: 2,
		trigger: {
			global: ["phaseBefore", "dieAfter"],
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			if (game.countGroup() > 4) {
				return false;
			}
			if (event.name == "die") {
				return true;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		*content(event, map) {
			const player = map.player;
			player.removeSkill("dctongye_buff");
			player.addSkill("dctongye_buff");
			const num = game.countGroup();
			if (num <= 4) {
				player.addMark("dctongye_handcard", 3, false);
				game.log(player, "手牌上限", "#y+3");
				if (4 - num > 0) {
					player.addMark("dctongye_draw", 4 - num, false);
					game.log(player, "摸牌阶段额定摸牌数", "#y+" + parseFloat(4 - num));
				}
			}
			if (num <= 3) {
				player.addMark("dctongye_range", 3, false);
				game.log(player, "攻击范围", "#y+3");
			}
			if (num <= 2) {
				player.addMark("dctongye_sha", 3, false);
				game.log(player, "使用杀的次数上限", "#y+3");
			}
			if (num <= 1) {
				yield player.recover(3);
			}
		},
		subSkill: {
			buff: {
				audio: "dctongye",
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				filter(event, player) {
					if (!player.hasMark("dctongye_draw")) {
						return false;
					}
					return !event.numFixed;
				},
				content() {
					trigger.num += player.countMark("dctongye_draw");
				},
				charlotte: true,
				onremove: ["dctongye_handcard", "dctongye_range", "dctongye_sha", "dctongye_draw"],
				mark: true,
				marktext: "统",
				intro: {
					content(storage, player) {
						var str = "";
						var hand = player.countMark("dctongye_handcard"),
							range = player.countMark("dctongye_range"),
							sha = player.countMark("dctongye_sha"),
							draw = player.countMark("dctongye_draw");
						if (hand > 0) {
							str += "<li>手牌上限+" + hand + "；";
						}
						if (range > 0) {
							str += "<li>攻击范围+" + range + "；";
						}
						if (sha > 0) {
							str += "<li>使用【杀】的次数上限+" + sha + "；";
						}
						if (draw > 0) {
							str += "<li>摸牌阶段额定摸牌数+" + draw + "。";
						}
						str = str.slice(0, -1) + "。";
						return str;
					},
				},
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("dctongye_handcard");
					},
					attackRange(player, num) {
						return num + player.countMark("dctongye_range");
					},
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("dctongye_sha");
						}
					},
				},
				ai: {
					threaten: 2.6,
				},
			},
		},
	},
	dcmianyao: {
		audio: 2,
		trigger: {
			player: "phaseDrawEnd",
		},
		direct: true,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player
				.chooseCard("h", get.prompt("dcmianyao"), "展示点数最小的一张牌并随机插入牌堆中，然后于回合结束时摸此牌点数张牌。", function (card, player) {
					var num = get.number(card, player);
					return !player.hasCard(card2 => {
						return card != card2 && get.number(card2, player) < num;
					});
				})
				.set("ai", card => {
					var player = _status.event.player;
					var value = player.getUseValue(card, null, true);
					if (value > 5 && get.number(card) <= 2) {
						return 0;
					}
					return 1 + 1 / Math.max(0.1, value);
				});
			"step 1";
			if (result.bool) {
				player.logSkill("dcmianyao");
				var card = result.cards[0];
				event.card = card;
				player.showCards([card], get.translation(player) + "发动了【免徭】");
			} else {
				event.finish();
			}
			"step 2";
			player.$throw(1, 1000);
			player.lose(card, ui.cardPile).insert_index = function () {
				return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
			};
			player.addTempSkill("dcmianyao_draw");
			var num = get.number(card);
			if (num > 0) {
				player.addMark("dcmianyao_draw", num, false);
			}
		},
		subSkill: {
			draw: {
				audio: "dcmianyao",
				trigger: {
					player: "phaseEnd",
				},
				filter(event, player) {
					return player.hasMark("dcmianyao_draw");
				},
				forced: true,
				charlotte: true,
				onremove: true,
				content() {
					player.draw(player.countMark("dcmianyao_draw"));
				},
			},
		},
	},
	dcchangqu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		selectTarget() {
			return [1, game.countPlayer() - 1];
		},
		complexSelect: true,
		complexTarget: true,
		multitarget: true,
		multiline: true,
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			var next = player.getNext(),
				prev = player.getPrevious();
			var selected = ui.selected.targets;
			if (!selected.includes(next) && !selected.includes(prev)) {
				return target == next || target == prev;
			}
			for (var i of selected) {
				if (i.getNext() == target || i.getPrevious() == target) {
					return true;
				}
			}
			return false;
		},
		contentBefore() {
			event.getParent()._dcchangqu_targets = targets.slice();
		},
		content() {
			"step 0";
			event.targets = event.getParent()._dcchangqu_targets;
			var current = targets[0];
			current.addMark("dcchangqu_warship");
			current.addMark("dcchangqu_warshipx", 1, false);
			event.num = 0;
			game.delayx();
			"step 1";
			var target = targets.shift();
			event.target = target;
			var num = Math.max(1, event.num);
			var nextPlayer = targets.find(i => {
				return i.isIn();
			});
			if (target.hasMark("dcchangqu_warshipx")) {
				var prompt2 = "是否交给" + get.translation(player) + get.cnNumber(num) + "张手牌？" + (nextPlayer ? "若如此做，将“战舰”移动给" + get.translation(nextPlayer) + "，" : "，") + "否则你下次受到的属性伤害值+" + num;
				target
					.chooseCard(get.translation(player) + "对你发动了【长驱】", prompt2, num)
					.set("ai", card => {
						if (_status.event.att > 0) {
							return 15 - get.value(card);
						}
						if (_status.event.take) {
							return 0;
						}
						return 8.2 - 0.8 * Math.min(5, _status.event.target.hp + _status.event.target.hujia) - get.value(card);
					})
					.set("att", get.attitude(target, player))
					.set("take", function () {
						var base = num;
						var getEffect = function (target, player, num) {
							var natures = ["fire", "thunder", "ice"];
							return (
								natures
									.map(nature => {
										return (get.damageEffect(target, target, player, nature) * Math.sqrt(num)) / Math.min(1.5, 1 + target.countCards("h"));
									})
									.reduce((sum, eff) => {
										return sum + eff;
									}, 0) / natures.length
							);
						};
						var eff = getEffect(player, player, base);
						return targets
							.some((current, ind) => {
								var num = base + ind + 1;
								var effx = getEffect(current, player, num);
								return effx < eff;
							})
							.set("target", target);
					});
			} else {
				event.goto(4);
			}
			"step 2";
			if (result.bool) {
				var cards = result.cards;
				target.give(cards, player);
				event.num++;
			} else {
				target.addSkill("dcchangqu_add");
				target.addMark("dcchangqu_add", Math.max(1, event.num), false);
				target.link(true);
				event.goto(4);
			}
			"step 3";
			var nextPlayer = targets.find(i => {
				return i.isIn();
			});
			if (nextPlayer) {
				target.line(nextPlayer);
				nextPlayer.addMark("dcchangqu_warship", target.countMark("dcchangqu_warship"));
				nextPlayer.addMark("dcchangqu_warshipx", target.countMark("dcchangqu_warshipx"), false);
				event.goto(1);
				game.delayx();
			}
			target.removeMark("dcchangqu_warship", target.countMark("dcchangqu_warship"));
			target.removeMark("dcchangqu_warshipx", target.countMark("dcchangqu_warshipx"), false);
			"step 4";
			var targets = game.players.slice().concat(game.dead);
			targets.forEach(i => {
				delete i.storage.dcchangqu_warshipx;
			});
		},
		ai: {
			order: 10,
			expose: 0.05,
			result: {
				target(player, target) {
					let targets = game.filterPlayer(i => i != player);
					targets.sortBySeat(player);
					let targets2 = targets.slice(0).reverse();
					let sum = 0;
					let maxSum = -Infinity,
						maxIndex = -1;
					let maxSum2 = -Infinity,
						maxIndex2 = -1;
					for (let i = 0; i < targets.length; i++) {
						let current = targets[i];
						let att = -get.attitude(player, current) - 0.1;
						let val = Math.sqrt(i + 1) * att;
						val /= 0.01 + Math.max(3, current.countCards("h") / 2);
						sum += val;
						if (sum > maxSum) {
							maxSum = sum;
							maxIndex = i;
						}
					}
					sum = 0;
					for (let i = 0; i < targets2.length; i++) {
						let current = targets[i];
						let att = -get.attitude(player, current) - 0.1;
						let val = Math.sqrt(i + 1) * att;
						val /= 0.01 + Math.max(3, current.countCards("h") / 2);
						sum += val;
						if (sum > maxSum2) {
							maxSum2 = sum;
							maxIndex2 = i;
						}
					}
					if (maxSum < maxSum2) {
						targets = targets2;
						maxIndex = maxIndex2;
					}
					if (ui.selected.targets.length > maxIndex) {
						return -100 * get.sgnAttitude(player, target);
					}
					if (target == targets[ui.selected.targets.length]) {
						return get.sgnAttitude(player, target);
					}
					return 0;
				},
			},
		},
		subSkill: {
			warship: {
				marktext: "舰",
				intro: {
					name: "战舰",
					name2: "战舰",
					content: "这里停了&艘战舰！不过啥用没有。",
				},
			},
			add: {
				trigger: {
					player: "damageBegin3",
				},
				filter(event, player) {
					return event.hasNature() && player.hasMark("dcchangqu_add");
				},
				forced: true,
				onremove: true,
				charlotte: true,
				content() {
					"step 0";
					trigger.num += player.countMark("dcchangqu_add");
					player.removeSkill("dcchangqu_add");
				},
				marktext: "驱",
				intro: {
					content: "下次受到的属性伤害+#",
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (game.hasNature(card)) {
								return 1 + target.countMark("dcchangqu_add");
							}
						},
					},
				},
			},
		},
	},
	//周不疑
	dcshiji: {
		audio: 2,
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			return event.player.isIn() && !event.player.getHistory("sourceDamage").length;
		},
		direct: true,
		content() {
			"step 0";
			trigger.player.addTempSkill("dcshiji_forbidself");
			var list = [];
			for (var name of lib.inpile) {
				var type = get.type(name);
				if (type != "trick") {
					continue;
				}
				if (player.getStorage("dcshiji_used").includes(name)) {
					continue;
				}
				var card = {
					name: name,
					storage: { dcshiji: true },
				};
				if (trigger.player.hasUseTarget(card)) {
					list.push([type, "", name]);
				}
			}
			if (list.length) {
				player
					.chooseButton([get.prompt("dcshiji", trigger.player), [list, "vcard"]])
					.set("ai", button => {
						if (_status.event.tochoose) {
							return _status.event.getTrigger().player.getUseValue({ name: button.link[2] });
						}
						return 0;
					})
					.set(
						"tochoose",
						get.attitude(player, trigger.player) > 0 &&
							trigger.player.hasCard(card => {
								return get.value(card) < 7;
							}, "hes")
					);
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				var card = {
					name: result.links[0][2],
					storage: { dcshiji: true },
				};
				var str = get.translation(card);
				player.logSkill("dcshiji", trigger.player);
				player.addTempSkill("dcshiji_used", "roundStart");
				player.markAuto("dcshiji_used", [card.name]);
				player.popup(str);
				game.log(player, "声明了", "#y" + str);
				game.broadcastAll(function (card) {
					lib.skill.dcshiji_backup.viewAs = card;
					lib.skill.dcshiji_backup.prompt = "十计：是否将一张牌当做" + get.translation(card) + "使用？";
				}, card);
				var next = trigger.player.chooseToUse();
				next.set("openskilldialog", "十计：是否将一张牌当做" + get.translation(card) + "使用？");
				next.set("norestore", true);
				next.set("addCount", false);
				next.set("_backupevent", "dcshiji_backup");
				next.set("custom", {
					add: {},
					replace: { window() {} },
				});
				next.backup("dcshiji_backup");
			}
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				position: "hes",
				selectCard: 1,
				check: card => 7 - get.value(card),
				popname: true,
			},
			used: {
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "计",
				intro: {
					content: "本轮已声明过$",
				},
			},
			forbidself: {
				charlotte: true,
				mod: {
					targetEnabled(card, player, target) {
						if (player == target && card.storage && card.storage.dcshiji) {
							return false;
						}
					},
				},
			},
		},
	},
	dcsilun: {
		audio: 2,
		trigger: {
			player: ["phaseZhunbeiBegin", "damageEnd"],
		},
		frequent: true,
		content() {
			"step 0";
			player.draw(4);
			event.count = 0;
			event.equipCount = {};
			game.countPlayer(current => {
				event.equipCount[current.playerid] = current.countCards("e");
			}, true);
			"step 1";
			if (!player.countCards("he")) {
				event.finish();
			} else {
				player.chooseCard("四论：选择一张牌（" + (event.count + 1) + "/" + "4）", "然后选择将此牌置于场上或牌堆的两端", true, "he").set("ai", card => {
					var player = _status.event.player;
					if (["equip", "delay"].includes(get.type(card)) && player.hasValueTarget(card)) {
						return 50;
					}
					return 50 - get.value(card);
				});
			}
			"step 2";
			if (result.bool) {
				var card = result.cards[0];
				event.card = card;
				event.count++;
				var choices = ["牌堆顶", "牌堆底"];
				var type = get.type(card);
				if (
					(type == "equip" &&
						game.hasPlayer(current => {
							return current.canEquip(card);
						})) ||
					(type == "delay" &&
						game.hasPlayer(current => {
							return current.canAddJudge(card);
						}))
				) {
					choices.unshift("场上");
				}
				player
					.chooseControl(choices)
					.set("prompt", "请选择要将" + get.translation(card) + "置于的位置")
					.set("ai", () => {
						return _status.event.choice;
					})
					.set(
						"choice",
						(function () {
							if (["equip", "delay"].includes(get.type(card)) && player.hasValueTarget(card) && choices.includes("场上")) {
								return "场上";
							}
							var val = get.value(card);
							var next = _status.currentPhase;
							if (next) {
								if (trigger.name == "damage") {
									next = next.getNext();
								}
								if ((get.attitude(player, next) > 0 && val >= 6) || (get.attitude(player, next) < 0 && val <= 4.5)) {
									return "牌堆顶";
								}
							}
							return "牌堆底";
						})()
					);
			}
			"step 3";
			if (result.control == "场上") {
				var type = get.type(card);
				player
					.chooseTarget("将" + get.translation(card) + "置于一名角色的场上", true, (card, player, target) => {
						return _status.event.targets.includes(target);
					})
					.set(
						"targets",
						game.filterPlayer(current => {
							if (type == "equip") {
								return current.canEquip(card);
							}
							if (type == "delay") {
								return current.canAddJudge(card);
							}
							return false;
						})
					)
					.set("ai", target => {
						var player = _status.event.player;
						var card = _status.event.card;
						return (
							get.attitude(player, target) *
							(get.type(card) == "equip"
								? get.value(card, target)
								: get.effect(
										target,
										{
											name: card.viewAs || card.name,
											cards: [card],
										},
										target,
										target
								  ))
						);
					})
					.set("card", card);
			} else {
				player.$throw(card, 1000);
				var next = player.lose(card, ui.cardPile, "visible");
				if (result.control == "牌堆顶") {
					next.insert_card = true;
				}
				game.log(player, "将", card, "置于了", "#y" + result.control);
			}
			"step 4";
			if (result.bool && result.targets && result.targets.length) {
				var target = result.targets[0];
				player.line(target);
				player.$give(card, target, false);
				if (get.type(card) == "equip") {
					target.equip(card);
				} else {
					target.addJudge(card);
				}
			}
			"step 5";
			game.countPlayer(current => {
				var count = current.countCards("e");
				var prevCount = event.equipCount[current.playerid] || 0;
				if (count != prevCount) {
					current.link(false);
					current.turnOver(false);
				}
				event.equipCount[current.playerid] = count;
			});
			if (event.count < 4) {
				event.goto(1);
			}
		},
	},
	//杜预
	dcjianguo: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return ["discard", "draw"].some(i => !player.getStorage("dcjianguo_used").includes(i));
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("谏国：请选择一项", "hidden");
				dialog.add([
					[
						["discard", "令一名角色摸一张牌，然后弃置一半手牌"],
						["draw", "令一名角色弃置一张牌，然后摸等同于手牌数一半的牌"],
					],
					"textbutton",
				]);
				return dialog;
			},
			filter(button, player) {
				return !player.getStorage("dcjianguo_used").includes(button.link);
			},
			check(button) {
				var player = _status.event.player;
				if (button.link == "discard") {
					var discard = Math.max.apply(
						Math,
						game
							.filterPlayer(current => {
								return lib.skill.dcjianguo_discard.filterTarget(null, player, current);
							})
							.map(current => {
								return get.effect(current, "dcjianguo_discard", player, player);
							})
					);
					return discard;
				}
				if (button.link == "draw") {
					var draw = Math.max.apply(
						Math,
						game
							.filterPlayer(current => {
								return lib.skill.dcjianguo_draw.filterTarget(null, player, current);
							})
							.map(current => {
								return get.effect(current, "dcjianguo_draw", player, player);
							})
					);
					return draw;
				}
				return 0;
			},
			backup(links) {
				return get.copy(lib.skill["dcjianguo_" + links[0]]);
			},
			prompt(links) {
				if (links[0] == "discard") {
					return "令一名角色摸一张牌，然后弃置一半手牌";
				}
				return "令一名角色弃置一张牌，然后摸等同于手牌数一半的牌";
			},
		},
		ai: {
			order: 10,
			threaten: 2.8,
			result: {
				//想让杜预两个技能自我联动写起来太累了，开摆
				player: 1,
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			backup: { audio: "dcjianguo" },
			discard: {
				audio: "dcjianguo",
				filterTarget: () => true,
				filterCard: () => false,
				selectCard: -1,
				content() {
					"step 0";
					player.addTempSkill("dcjianguo_used", "phaseUseAfter");
					player.markAuto("dcjianguo_used", ["discard"]);
					target.draw();
					game.delayex();
					"step 1";
					var num = Math.ceil(target.countCards("h") / 2);
					if (num > 0) {
						target.chooseToDiscard(num, true, "谏国：请弃置" + get.cnNumber(num) + "张手牌");
					}
				},
				ai: {
					result: {
						target(player, target) {
							return 1.1 - Math.floor(target.countCards("h") / 2);
						},
					},
					tag: {
						gain: 1,
						loseCard: 2,
					},
				},
			},
			draw: {
				audio: "dcjianguo",
				filterTarget(card, player, target) {
					return target.countCards("he");
				},
				filterCard: () => false,
				selectCard: -1,
				content() {
					"step 0";
					player.addTempSkill("dcjianguo_used", "phaseUseAfter");
					player.markAuto("dcjianguo_used", ["draw"]);
					target.chooseToDiscard("he", true, "谏国：请弃置一张牌");
					"step 1";
					var num = Math.ceil(target.countCards("h") / 2);
					if (num > 0) {
						target.draw(num);
					}
				},
				ai: {
					result: {
						target(player, target) {
							var fix = 0;
							var num = target.countCards("h");
							if (player == target && num % 2 == 1 && num >= 5) {
								fix += 1;
							}
							return Math.ceil(num / 2 - 0.5) + fix;
						},
					},
					tag: {
						loseCard: 1,
						gain: 2,
					},
				},
			},
		},
	},
	dcdyqingshi: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			if (!event.isFirstTarget) {
				return false;
			}
			if (event.card.name != "sha" && get.type(event.card, null, false) != "trick") {
				return false;
			}
			if (player.countCards("h") != player.getHistory("useCard").indexOf(event.getParent()) + 1) {
				return false;
			}
			return event.targets.some(target => {
				return target != player && target.isIn();
			});
		},
		direct: true,
		locked: false,
		content() {
			"step 0";
			var targets = trigger.targets.filter(target => {
				return target != player && target.isIn();
			});
			player
				.chooseTarget(get.prompt("dcdyqingshi"), "对一名不为你的目标角色造成1点伤害", (card, player, target) => {
					return _status.event.targets.includes(target);
				})
				.set("ai", target => {
					var player = _status.event.player;
					return get.damageEffect(target, player, player);
				})
				.set("targets", targets);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dcdyqingshi", target);
				target.damage();
			}
		},
		mod: {
			aiOrder(player, card, num) {
				if (_status.currentPhase != player) {
					return;
				}
				var cardsh = [];
				if (Array.isArray(card.cards)) {
					cardsh.addArray(
						card.cards.filter(card => {
							return get.position(card) == "h";
						})
					);
				}
				var del = player.countCards("h") - cardsh.length - player.getHistory("useCard").length - 1;
				if (del < 0) {
					return;
				}
				if (del > 0) {
					if (card.name == "sha" || get.type(card, null, player) != "trick") {
						return num / 3;
					}
					return num + 1;
				}
				return num + 15;
			},
		},
	},
	//甘糜
	dcchanjuan: {
		init(player) {
			if (!player.storage.dcchanjuan) {
				player.storage.dcchanjuan = {};
			}
		},
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (
				event.targets.length != 1 ||
				!player.hasHistory("lose", evt => {
					if ((evt.relatedEvent || evt.getParent()) != event) {
						return false;
					}
					return event.cards.every(card => evt.hs.includes(card));
				})
			) {
				return false;
			}
			if (!["basic", "trick"].includes(get.type(event.card, null, false))) {
				return false;
			}
			if (event.getParent(2).name == "dcchanjuan") {
				return false;
			}
			return !player.storage.dcchanjuan[event.card.name] || player.storage.dcchanjuan[event.card.name] < 2;
		},
		direct: true,
		content() {
			"step 0";
			var card = {
				name: trigger.card.name,
				nature: trigger.card.nature,
				isCard: true,
			};
			player
				.chooseUseTarget(card, get.prompt("dcchanjuan"), false, false)
				.set("prompt2", "视为再使用一张" + get.translation(card))
				.set("logSkill", "dcchanjuan");
			"step 1";
			if (result.bool) {
				if (!player.storage.dcchanjuan[trigger.card.name]) {
					player.storage.dcchanjuan[trigger.card.name] = 0;
				}
				player.storage.dcchanjuan[trigger.card.name]++;
				var list1 = trigger.targets,
					list2 = result.targets;
				if (list1.slice().removeArray(list2).length == 0 && list2.slice().removeArray(list1).length == 0) {
					player.draw();
				}
			}
		},
		ai: { threaten: 2 },
		mark: true,
		intro: {
			markcount: storage => 0,
			content(storage) {
				var str = "已使用牌名：",
					names = Object.keys(storage);
				if (!names.length) {
					str += "无";
				} else {
					names.forEach(name => {
						str += "<br><li>【";
						str += get.translation(name);
						str += "】：";
						str += storage[name] + "次";
					});
				}
				return str;
			},
		},
	},
	dcxunbie: {
		audio: 2,
		trigger: { player: "dying" },
		filter(event, player) {
			if (player.hp > 0) {
				return false;
			}
			var characters = ["dc_ganfuren", "dc_mifuren"];
			game.countPlayer(current => {
				if (current.name1 == "dc_ganfuren" || current.name2 == "dc_ganfuren") {
					characters.remove("dc_ganfuren");
				}
				if (current.name1 == "dc_mifuren" || current.name2 == "dc_mifuren") {
					characters.remove("dc_mifuren");
				}
			});
			return (
				characters.length &&
				[player.name1, player.name2].some(name => {
					return get.character(name, 3).includes("dcxunbie");
				})
			);
		},
		check: () => true,
		skillAnimation: true,
		animationColor: "fire",
		limited: true,
		derivation: ["dcyongjue", "dcshushen", "dcshenzhi", "dcguixiu", "dccunsi"],
		content() {
			"step 0";
			player.awakenSkill(event.name);
			var characters = ["dc_ganfuren", "dc_mifuren"];
			game.countPlayer(current => {
				if (current.name1 == "dc_ganfuren" || current.name2 == "dc_ganfuren") {
					characters.remove("dc_ganfuren");
				}
				if (current.name1 == "dc_mifuren" || current.name2 == "dc_mifuren") {
					characters.remove("dc_mifuren");
				}
			});
			if (characters.length == 1) {
				event._result = { control: characters[0] };
			} else {
				player
					.chooseControl(characters)
					.set("dialog", ["选择要替换成的武将", [characters, "character"]])
					.set("ai", () => [0, 1].randomGet());
			}
			"step 1";
			var character = result.control;
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			player.reinitCharacter(get.character(player.name2, 3).includes("dcxunbie") ? player.name2 : player.name1, character);
			"step 2";
			player.recover(1 - player.hp);
			player.addTempSkill("dcxunbie_muteki");
		},
		subSkill: {
			muteki: {
				audio: "dcxunbie",
				trigger: {
					player: "damageBegin4",
				},
				charlotte: true,
				forced: true,
				content() {
					trigger.cancel();
				},
				mark: true,
				intro: { content: "防止受到的所有伤害直到本回合结束" },
				ai: {
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
		},
	},
	//散装版糜夫人
	dcguixiu: {
		audio: "guixiu",
		trigger: {
			player: "phaseBegin",
		},
		forced: true,
		onremove: true,
		filter(event, player) {
			return !player.hasMark("dcguixiu");
		},
		group: "dcguixiu_rec",
		content() {
			player.addMark("dcguixiu", 1, false);
			player.draw(2);
		},
		subSkill: {
			rec: {
				audio: "guixiu",
				trigger: {
					player: "useSkillAfter",
				},
				forced: true,
				filter(event, player) {
					return event.skill == "dccunsi" && player.isDamaged();
				},
				content() {
					player.recover();
				},
			},
		},
	},
	dccunsi: {
		audio: "cunsi",
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		filterTarget: true,
		derivation: "dcyongjue",
		content() {
			"step 0";
			player.awakenSkill(event.name);
			target.addSkills("dcyongjue");
			if (target != player) {
				player.draw(2);
			}
		},
		ai: {
			order: 10,
			result: {
				target: 1,
			},
		},
	},
	dcyongjue: {
		audio: "yongjue",
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			var evtx = event.getParent("phaseUse");
			if (!evtx || evtx.player != player) {
				return false;
			}
			return (
				player
					.getHistory("useCard", evt => {
						return evt.card.name == "sha" && event.getParent("phaseUse") == evtx;
					})
					.indexOf(event) == 0
			);
		},
		direct: true,
		content() {
			"step 0";
			var choices = ["选项一"];
			var choiceList = ["令" + get.translation(trigger.card) + "不计入次数", "获得此牌"];
			if (trigger.cards.length) {
				choices.push("选项二");
				choiceList[1] = "获得" + get.translation(trigger.cards);
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			choices.push("cancel2");
			player
				.chooseControl(choices)
				.set("choiceList", choiceList)
				.set("ai", () => {
					return _status.event.choice;
				})
				.set(
					"choice",
					(function () {
						if (choices.length == 3 && trigger.addCount === false) {
							return 1;
						}
						if (player.getCardUsable({ name: "sha" }) < player.countCards("hs", "sha")) {
							return 0;
						}
						if (choices.length == 3) {
							return 1;
						}
						return 0;
					})()
				);
			"step 1";
			if (result.control == "cancel2") {
				event.finish();
				return;
			}
			player.logSkill("dcyongjue");
			game.log(player, "选择了", "#y" + result.control);
			if (result.control == "选项一") {
				if (trigger.addCount !== false) {
					trigger.addCount = false;
					trigger.player.getStat().card.sha--;
				}
			} else {
				var cards = trigger.cards.filterInD();
				if (cards.length) {
					player.gain(cards, "gain2");
				}
			}
		},
	},
	//散装版甘夫人
	dcshushen: {
		audio: "shushen",
		trigger: { player: "recoverEnd" },
		filter(event, player) {
			return game.hasPlayer(current => current != player) && event.num > 0;
		},
		getIndex: event => event.num,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					return get.recoverEffect(target, player, player) / 2 + get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			let result;
			if (target.isDamaged()) {
				result = await player
					.chooseControl("选项一", "选项二")
					.set("choiceList", [`令${get.translation(target)}回复1点体力`, `你与${get.translation(target)}各摸一张牌`])
					.set("prompt", "淑慎：请选择一项")
					.set("ai", () => {
						return get.event("choice");
					})
					.set(
						"choice",
						(() => {
							if (target.hp <= 2 || get.recoverEffect(target, player, player) > 20) {
								return "选项一";
							}
							return "选项二";
						})()
					)
					.forResult();
			} else {
				result = { control: "选项二" };
			}
			if (result?.control == "选项一") {
				await target.recover();
			} else if (result?.control == "选项二") {
				const drawers = [player, target].sortBySeat(_status.currentPhase);
				await game.asyncDraw(drawers);
			}
		},
	},
	dcshenzhi: {
		audio: "shenzhi",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return player.countCards("h") > player.hp;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt(event.skill), "弃置一张手牌，然后回复1点体力")
				.set("logSkill", event.skill)
				.set("ai", card => {
					return get.event("recover") - get.value(card);
				})
				.set("recover", get.recoverEffect(player, player, player))
				.forResult();
			event.result.skill_popup = false;
		},
		async content(event, trigger, player) {
			await player.recover();
		},
	},
	//阮籍
	dczhaowen: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h");
		},
		check(event, player) {
			return player.hasCard(card => {
				return get.color(card) == "black" || (get.color(card) == "red" && player.hasValueTarget(card));
			});
		},
		content() {
			"step 0";
			player.showHandcards();
			"step 1";
			player.addTempSkill("dczhaowen_effect");
			game.broadcastAll(function (cards) {
				cards.forEach(card => card.addGaintag("dczhaowen_tag"));
			}, player.getCards("h"));
		},
		ai: {
			threaten: 3,
		},
		subSkill: {
			effect: {
				audio: "dczhaowen",
				enable: "chooseToUse",
				charlotte: true,
				onremove(player) {
					player.removeGaintag("dczhaowen_tag");
				},
				hiddenCard(player, name) {
					return (
						get.type(name) == "trick" &&
						!player.getStorage("dczhaowen_viewed").includes(name) &&
						player.countCards("h", card => {
							return get.color(card) == "black" && card.hasGaintag("dczhaowen_tag");
						}) > 0
					);
				},
				filter(event, player) {
					if (
						!player.hasCard(card => {
							return get.color(card) == "black" && card.hasGaintag("dczhaowen_tag");
						})
					) {
						return false;
					}
					var storage = player.getStorage("dczhaowen_viewed");
					for (var i of lib.inpile) {
						if (!storage.includes(i) && get.type(i) == "trick" && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
							return true;
						}
					}
					return false;
				},
				chooseButton: {
					dialog(event, player) {
						var cards = player.getCards("h", card => {
							return get.color(card) == "black" && card.hasGaintag("dczhaowen_tag");
						});
						var storage = player.getStorage("dczhaowen_viewed");
						var list = [];
						for (var i of lib.inpile) {
							if (!storage.includes(i) && get.type(i) == "trick" && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
								list.push(["锦囊", "", i]);
							}
						}
						return ui.create.dialog("昭文", [list, "vcard"], "hidden");
					},
					check(button) {
						var player = _status.event.player;
						return player.getUseValue({ name: button.link[2] }) + 1;
					},
					backup(links, player) {
						return {
							audio: "dczhaowen",
							popname: true,
							filterCard(card, player) {
								return get.color(card) == "black" && card.hasGaintag("dczhaowen_tag");
							},
							selectCard: 1,
							position: "h",
							viewAs: {
								name: links[0][2],
							},
							onuse(links, player) {
								player.addTempSkill("dczhaowen_viewed");
								player.markAuto("dczhaowen_viewed", [links.card.name]);
							},
						};
					},
					prompt(links, player) {
						return "将一张展示过的黑色手牌当做" + get.translation(links[0][2]) + "使用";
					},
				},
				group: "dczhaowen_draw",
				mod: {
					aiOrder(player, card, num) {
						var cards = [];
						if (card.cards) {
							cards.addArray(cards);
						}
						if (get.itemtype(card) == "card") {
							cards.push(card);
						}
						for (var cardx of cards) {
							if (get.color(cardx) != "red") {
								continue;
							}
							if (cardx.hasGaintag("dczhaowen_tag")) {
								return num + 0.2;
							}
						}
					},
				},
				ai: {
					order: 12,
					result: {
						player: 1,
					},
				},
			},
			draw: {
				audio: "dczhaowen",
				forced: true,
				charlotte: true,
				trigger: { player: "useCard" },
				filter(event, player) {
					var cards = event.cards.filter(card => get.color(card, player) == "red");
					return player.hasHistory("lose", evt => {
						if (event != (evt.relatedEvent || evt.getParent())) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("dczhaowen_tag")) {
								if (cards.some(card => card.cardid == i)) {
									return true;
								}
							}
						}
					});
				},
				content() {
					var num = 0;
					var cards = trigger.cards.filter(card => get.color(card, player) == "red");
					player.getHistory("lose", evt => {
						if (trigger != (evt.relatedEvent || evt.getParent())) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("dczhaowen_tag")) {
								if (cards.some(card => card.cardid == i)) {
									num++;
								}
							}
						}
					});
					while (num--) {
						player.draw();
					}
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (get.itemtype(card) === "card" && cardx.hasGaintag("dczhaowen_tag") && get.color(card, player) === "red") {
								return [1, 1];
							}
						},
					},
				},
			},
			viewed: {
				onremove: true,
				charlotte: true,
			},
			effect_backup: {
				audio: "dczhaowen",
			},
		},
	},
	dcjiudun: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			if (event.player == player || get.color(event.card) != "black") {
				return false;
			}
			if (player.hasSkill("jiu")) {
				return player.countCards("h", card => {
					return _status.connectMode || lib.filter.cardDiscardable(card, player, "dcjiudun");
				});
			}
			return true;
		},
		direct: true,
		content() {
			"step 0";
			if (player.hasSkill("jiu")) {
				player
					.chooseToDiscard(get.prompt("dcjiudun"), '<div class="text center">弃置一张手牌，令' + get.translation(trigger.card) + "对你无效</div>")
					.set("logSkill", "dcjiudun")
					.set("ai", card => {
						if (_status.event.goon) {
							return 4.5 + Math.max(0, 3 - player.hp) - get.value(card);
						}
						return 0;
					})
					.set(
						"goon",
						(function () {
							if (get.effect(player, trigger.card, trigger.player, player) < -4 * Math.max(0, 5 - Math.sqrt(player.countCards("h")))) {
								return true;
							}
							return false;
						})()
					);
				event.goto(2);
			} else {
				player.chooseBool(get.prompt("dcjiudun"), "摸一张牌，然后视为使用一张【酒】").set("ai", () => 1);
			}
			"step 1";
			if (result.bool) {
				player.logSkill("dcjiudun");
				player.draw();
				player.chooseUseTarget("jiu", true);
			}
			event.finish();
			"step 2";
			if (result.bool) {
				trigger.excluded.add(player);
				game.log(trigger.card, "对", player, "无效");
			}
		},
		ai: {
			jiuSustain: true,
			skillTagFilter(player, tag, name) {
				if (name != "phase") {
					return false;
				}
			},
			effect: {
				target(card, player, target) {
					if (player === target || typeof card !== "object" || get.color(card) !== "black") {
						return;
					}
					if (target.hasSkill("jiu")) {
						if (
							card.name !== "huogong" &&
							get.tag(card, "damage") &&
							get.attitude(player, target) <= 0 &&
							target.hasCard(i => {
								return _status.connectMode || lib.filter.cardDiscardable(i, player, "dcjiudun");
							}, "h")
						) {
							return [0, -1];
						}
					} else {
						return [1, 1.2];
					}
				},
			},
		},
	},
	//武诸葛
	dcjincui: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return true;
		},
		forced: true,
		group: "dcjincui_advent",
		async content(event, trigger, player) {
			let num = 0;
			for (let i = 0; i < ui.cardPile.childNodes.length; i++) {
				let card = ui.cardPile.childNodes[i];
				if (get.number(card) == 7) {
					num++;
					if (num >= player.maxHp) {
						break;
					}
				}
			}
			if (num < 1) {
				num = 1;
			}
			if (num > player.hp) {
				await player.recover(num - player.hp);
			} else if (num < player.hp) {
				await player.loseHp(player.hp - num);
			}
			const result = await player
				.chooseToGuanxing(player.hp)
				.set("prompt", "尽瘁：点击或拖动将牌移动到牌堆顶或牌堆底")
				.set("processAI", list => {
					let cards = list[0][1],
						player = _status.event.player,
						target = _status.currentPhase || player,
						name = _status.event.getTrigger().name,
						countWuxie = current => {
							let num = current.getKnownCards(player, card => {
								return get.name(card, current) === "wuxie";
							});
							if (num && current !== player) {
								return num;
							}
							let skills = current.getSkills("invisible").concat(lib.skill.global);
							game.expandSkills(skills);
							for (let i = 0; i < skills.length; i++) {
								let ifo = get.info(skills[i]);
								if (!ifo) {
									continue;
								}
								if (ifo.viewAs && typeof ifo.viewAs != "function" && ifo.viewAs.name == "wuxie") {
									if (!ifo.viewAsFilter || ifo.viewAsFilter(current)) {
										num++;
										break;
									}
								} else {
									let hiddenCard = ifo.hiddenCard;
									if (typeof hiddenCard == "function" && hiddenCard(current, "wuxie")) {
										num++;
										break;
									}
								}
							}
							return num;
						},
						top = [],
						bottom = [];
					for (let i = 0; i < cards.length; i++) {
						if (get.number(cards[i]) == 7) {
							bottom.addArray(cards.splice(i--, 1));
						}
					}
					switch (name) {
						case "phaseJieshu":
							target = target.next;
						// [falls through]
						case "phaseZhunbei": {
							let att = get.sgn(get.attitude(player, target)),
								judges = target.getCards("j"),
								needs = 0,
								wuxie = countWuxie(target);
							for (let i = Math.min(cards.length, judges.length) - 1; i >= 0; i--) {
								let j = judges[i],
									cardj = j.viewAs ? { name: j.viewAs, cards: j.cards || [j] } : j;
								if (wuxie > 0 && get.effect(target, j, target, target) < 0) {
									wuxie--;
									continue;
								}
								let judge = get.judge(j);
								cards.sort((a, b) => {
									return (judge(b) - judge(a)) * att;
								});
								if (judge(cards[0]) * att < 0) {
									needs++;
									continue;
								} else {
									top.unshift(cards.shift());
								}
							}
							if (needs > 0 && needs >= judges.length) {
								bottom.addArray(cards);
								return [top, bottom];
							}
							cards.sort((a, b) => {
								return (get.value(b, target) - get.value(a, target)) * att;
							});
							while (needs--) {
								top.unshift(cards.shift());
							}
							while (cards.length) {
								if (get.value(cards[0], target) > 6 == att > 0) {
									top.unshift(cards.shift());
								} else {
									break;
								}
							}
							bottom.addArray(cards);
							return [top, bottom];
						}
						default:
							cards.sort((a, b) => {
								return get.value(b, target) - get.value(a, target);
							});
							while (cards.length) {
								if (get.value(cards[0], target) > 6) {
									top.unshift(cards.shift());
								} else {
									break;
								}
							}
							bottom.addArray(cards);
							return [top, bottom];
					}
				})
				.forResult();
			if (!result.bool || !result.moved[0].length) {
				player.addTempSkill("guanxing_fail");
			}
		},
		ai: {
			guanxing: true,
			effect: {
				target(card, player, target) {
					if (!get.tag(card, "damage")) {
						return;
					}
					var num = 0,
						bool = false;
					for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
						var card = ui.cardPile.childNodes[i];
						if (get.number(card) == 7) {
							num++;
							if (num >= target.hp) {
								bool = true;
								break;
							}
						}
					}
					if (bool) {
						return 0.2;
					}
				},
			},
			threaten: 0.6,
		},
		subSkill: {
			advent: {
				audio: "dcjincui",
				trigger: { global: "phaseBefore", player: "enterGame" },
				forced: true,
				filter(event, player) {
					return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h") < 7;
				},
				content() {
					player.drawTo(7);
				},
			},
		},
	},
	dcqingshi: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			if (player.getStorage("dcqingshi_clear").includes(event.card.name)) {
				return false;
			}
			if (
				player.hasCard(card => {
					return get.name(card) == event.card.name;
				})
			) {
				return true;
			}
			return false;
		},
		direct: true,
		content() {
			"step 0";
			var choices = [];
			var choiceList = ["令" + get.translation(trigger.card) + "对其中一个目标角色造成的伤害+1", "令任意名其他角色各摸一张牌", "摸三张牌，然后〖情势〗于本回合失效"];
			if (trigger.targets && trigger.targets.length) {
				choices.push("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "(无目标角色)</span>";
			}
			if (game.countPlayer(i => i != player)) {
				choices.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			choices.push("选项三");
			player
				.chooseControl(choices, "cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt("dcqingshi"))
				.set("ai", () => {
					return _status.event.choice;
				})
				.set(
					"choice",
					(() => {
						var choicesx = choices.slice();
						var cards = player.getCards("hs");
						var bool1 =
								get.tag(trigger.card, "damage") &&
								choicesx.includes("选项一") &&
								trigger.targets.some(current => {
									return get.attitude(player, current) < 0;
								}),
							bool2 = choicesx.includes("选项二");
						if (bool2) {
							bool2 = game.countPlayer(function (current) {
								return player != current && get.attitude(player, current) > 0;
							});
						} else {
							bool2 = 0;
						}
						if (bool1 || bool2) {
							for (var i = 0; i < cards.length; i++) {
								var name = get.name(cards[i]);
								if (player.getStorage("dcqingshi_clear").includes(name)) {
									continue;
								}
								for (var j = i + 1; j < cards.length; j++) {
									if (name === get.name(cards[j]) && get.position(cards[i]) + get.position(cards[j]) !== "ss" && player.hasValueTarget(cards[i])) {
										choicesx.remove("选项三");
										break;
									}
								}
							}
						}
						if (bool2 > 2) {
							return "选项二";
						}
						if (choicesx.includes("选项三")) {
							return "选项三";
						}
						if (bool2 === 2) {
							return "选项二";
						}
						if (bool1) {
							return "选项一";
						}
						if (bool2) {
							return "选项二";
						}
						return "cancel2";
					})()
				);
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("dcqingshi");
				game.log(player, "选择了", "#y" + result.control);
				var index = ["选项一", "选项二", "选项三"].indexOf(result.control) + 1;
				player.addTempSkill("dcqingshi_clear");
				player.markAuto("dcqingshi_clear", [trigger.card.name]);
				var next = game.createEvent("dcqingshi_after");
				next.player = player;
				next.card = trigger.card;
				next.setContent(lib.skill.dcqingshi["content" + index]);
			}
		},
		content1() {
			"step 0";
			player
				.chooseTarget("令" + get.translation(card) + "对其中一个目标造成的伤害+1", true, (card, player, target) => {
					return _status.event.targets.includes(target);
				})
				.set("ai", target => {
					return 2 - get.attitude(_status.event.player, target);
				})
				.set("targets", event.getParent().getTrigger().targets);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				player.addTempSkill("dcqingshi_ex");
				if (!player.storage.dcqingshi_ex) {
					player.storage.dcqingshi_ex = [];
				}
				player.storage.dcqingshi_ex.push([target, card]);
			}
		},
		content2() {
			"step 0";
			player.chooseTarget("令任意名其他角色各摸一张牌", [1, Infinity], true, lib.filter.notMe).set("ai", target => {
				return get.attitude(_status.event.player, target);
			});
			"step 1";
			if (result.bool) {
				var targets = result.targets;
				targets.sortBySeat();
				player.line(targets);
				game.asyncDraw(targets);
				game.delayex();
			}
		},
		content3() {
			"step 0";
			player.draw(3);
			player.tempBanSkill("dcqingshi");
		},
		subSkill: {
			ex: {
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					return (
						player.storage.dcqingshi_ex &&
						player.storage.dcqingshi_ex.some(info => {
							return info[0] == event.player && info[1] == event.card;
						})
					);
				},
				forced: true,
				charlotte: true,
				popup: false,
				onremove: true,
				content() {
					trigger.num++;
					for (var i = 0; i < player.storage.dcqingshi_ex.length; i++) {
						if (player.storage.dcqingshi_ex[i][1] == trigger.card) {
							player.storage.dcqingshi_ex.splice(i--, 1);
						}
					}
				},
			},
			clear: {
				onremove: true,
				charlotte: true,
			},
		},
		ai: {
			threaten: 6,
		},
	},
	dczhizhe: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		filterCard: true,
		position: "h",
		discard: false,
		lose: false,
		delay: false,
		skillAnimation: true,
		animationColor: "metal",
		check(card) {
			if (get.type(card) != "basic" && get.type(card) != "trick") {
				return 0;
			}
			return get.value(card) - 7.5;
		},
		content() {
			"step 0";
			var card = cards[0];
			player.awakenSkill(event.name);
			var cardx = game.createCard2(card.name, card.suit, card.number, card.nature);
			player.gain(cardx).gaintag.add("dczhizhe");
			player.addSkill("dczhizhe_effect");
		},
		ai: {
			order: 15,
			result: {
				player: 1,
			},
		},
		subSkill: {
			effect: {
				mod: {
					aiOrder(player, card, num) {
						if (num > 0 && get.itemtype(card) === "card" && card.hasGaintag("dczhizhe")) {
							return num + 0.16;
						}
					},
					aiValue(player, card, num) {
						if (num > 0 && get.itemtype(card) === "card" && card.hasGaintag("dczhizhe")) {
							return 2 * num;
						}
					},
					aiUseful(player, card, num) {
						if (num > 0 && !player._dczhizhe_mod && get.itemtype(card) === "card" && card.hasGaintag("dczhizhe")) {
							if (player.canIgnoreHandcard(card)) {
								return Infinity;
							}
							player._dczhizhe_mod = true;
							if (
								player.hp < 3 &&
								player.needsToDiscard(0, (i, player) => {
									return !player.canIgnoreHandcard(i) && get.useful(i) > 6;
								})
							) {
								return num * 1.5;
							}
							return num * 10;
						}
					},
				},
				audio: "dczhizhe",
				trigger: { player: ["useCardAfter", "respondAfter"] },
				charlotte: true,
				forced: true,
				filter(event, player) {
					return player.hasHistory("lose", function (evt) {
						if ((evt.relatedEvent || evt.getParent()) != event) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("dczhizhe")) {
								if (
									event.cards.some(card => {
										return get.position(card, true) == "o" && card.cardid == i;
									})
								) {
									return true;
								}
							}
						}
						return false;
					});
				},
				content() {
					"step 0";
					var cards = [];
					player.getHistory("lose", function (evt) {
						if ((evt.relatedEvent || evt.getParent()) != trigger) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("dczhizhe")) {
								var cardsx = trigger.cards.filter(card => {
									return get.position(card, true) == "o" && card.cardid == i;
								});
								if (cardsx.length) {
									cards.addArray(cardsx);
								}
							}
						}
					});
					if (cards.length) {
						player.gain(cards, "gain2").gaintag.addArray(["dczhizhe", "dczhizhe_clear"]);
						player.addTempSkill("dczhizhe_clear");
					}
				},
			},
			clear: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("dczhizhe_clear");
				},
				mod: {
					cardEnabled2(card, player) {
						var cards = [];
						if (card.cards) {
							cards.addArray(cards);
						}
						if (get.itemtype(card) == "card") {
							cards.push(card);
						}
						for (var cardx of cards) {
							if (cardx.hasGaintag("dczhizhe_clear")) {
								return false;
							}
						}
					},
					cardRespondable(card, player) {
						var cards = [];
						if (card.cards) {
							cards.addArray(cards);
						}
						if (get.itemtype(card) == "card") {
							cards.push(card);
						}
						for (var cardx of cards) {
							if (cardx.hasGaintag("dczhizhe_clear")) {
								return false;
							}
						}
					},
					cardSavable(card, player) {
						var cards = [];
						if (card.cards) {
							cards.addArray(cards);
						}
						if (get.itemtype(card) == "card") {
							cards.push(card);
						}
						for (var cardx of cards) {
							if (cardx.hasGaintag("dczhizhe_clear")) {
								return false;
							}
						}
					},
				},
			},
		},
	},
	//段巧笑
	dccaizhuang: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCard(function (card) {
				return lib.filter.cardDiscardable(card, player, "dccaizhuang");
			}, "he");
		},
		complexCard: true,
		selectCard: [1, Infinity],
		position: "he",
		filterCard: true,
		check(card) {
			let cache = lib.skill.dccaizhuang.tempCache();
			if (!cache || cache.no) {
				return 0;
			}
			let player = _status.event.player,
				suit = get.suit(card);
			if (
				ui.selected.cards.filter(i => {
					return get.suit(i) === suit;
				}).length < (cache[suit] || 0)
			) {
				if (get.position(card) === "h") {
					return 15 - get.value(card);
				}
				return 9 - get.value(card);
			}
			return 0;
		},
		tempCache() {
			let cache = _status.event.getTempCache("dccaizhuang", "dsuits");
			if (cache) {
				return cache;
			}
			cache = { no: true };
			_status.event.putTempCache("dccaizhuang", "dsuits", cache);
			let player = _status.event.player,
				suits = {};
			lib.suit.forEach(i => {
				suits[i] = 0;
			});
			player.getCards("h", i => {
				let suit = get.suit(i);
				if (lib.suit.includes(suit)) {
					suits[suit]++;
				}
			});
			let sortedSuits = Object.fromEntries(Object.entries(suits).sort((a, b) => b[1] - a[1]));
			let dis = 0,
				idx = 0,
				dsuits = 0,
				leave = 0;
			for (let i in sortedSuits) {
				idx++;
				if (!sortedSuits[i]) {
					continue;
				}
				let num = 1;
				if (idx > 2 || sortedSuits[i] < 3) {
					num = sortedSuits[i];
				}
				cache[i] = num;
				dis += num;
				suits[i] -= num;
				dsuits++;
			}
			for (let i in suits) {
				if (suits[i]) {
					leave++;
				}
			}
			player.getCards("e", i => {
				let suit = get.suit(i);
				if (!cache[suit]) {
					dsuits++;
					cache[suit] = 1;
					dis++;
				}
			});
			let draw = 0,
				e = [0, 1, 4 / 3, 2, 4];
			if (dsuits <= leave) {
				return false;
			}
			do {
				draw += e[dsuits--];
			} while (dsuits > leave);
			if (draw > dis) {
				delete cache.no;
				_status.event.putTempCache("dccaizhuang", "dsuits", cache);
				return cache;
			}
			return false;
		},
		async content(event, trigger, player) {
			const num = event.cards.map(card => get.suit(card, player)).toUniqued().length;
			while (true) {
				await player.draw();
				if (
					player
						.getCards("h")
						.map(card => get.suit(card, player))
						.toUniqued().length >= num
				) {
					break;
				}
			}
		},
		ai: {
			order: 2,
			result: { player: 1 },
		},
	},
	dchuayi: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		async content(event, trigger, player) {
			const next = player.judge(() => 1);
			next.judge2 = result => result.bool;
			const { result } = await next;
			if (result?.color && ["red", "black"].includes(result.color)) {
				player.addTempSkill(event.name + "_" + result.color, { player: "phaseBegin" });
			}
		},
		subSkill: {
			red: {
				audio: "dchuayi",
				trigger: { global: "phaseEnd" },
				charlotte: true,
				forced: true,
				content() {
					player.draw();
				},
				mark: true,
				intro: {
					name: "华衣·红",
					content: "一名角色的回合结束时，你摸一张牌",
				},
			},
			black: {
				audio: "dchuayi",
				trigger: { player: "damageEnd" },
				charlotte: true,
				forced: true,
				content() {
					player.draw(2);
				},
				mark: true,
				intro: {
					name: "华衣·黑",
					content: "当你受到伤害后，摸两张牌",
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
		},
	},
	//张瑾云
	dchuizhi: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt("dchuizhi"), "你可以选择弃置任意张手牌并点击“确定”，将手牌摸至与全场手牌数最多的角色数相同。", [0, Infinity])
				.set("logSkill", "dchuizhi")
				.set("ai", card => {
					if (_status.event.isMax) {
						if (ui.selected.cards.length) {
							return -get.value(card);
						}
						return 0;
					}
					return 6 - get.value(card);
				})
				.set("isMax", player.isMaxHandcard());
			"step 1";
			if (result.bool) {
				var num = 0,
					targets = game.filterPlayer();
				for (var current of targets) {
					if (current.isMaxHandcard()) {
						num = current.countCards("h");
						break;
					}
				}
				num = Math.max(1, Math.min(5, num - player.countCards("h")));
				player.draw(num);
			}
		},
	},
	dcjijiao: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		init(player) {
			player.addSkill("dcjijiao_machi");
		},
		onremove(player) {
			player.removeSkill("dcjijiao_machi");
		},
		onChooseToUse(event) {
			if (event.dcjijiao == undefined && !game.online) {
				var bool = lib.skill.dcjijiao.getCards(event.player, true);
				event.set("dcjijiao", bool);
			}
		},
		filter(event, player) {
			return event.dcjijiao;
		},
		filterTarget: true,
		getCards(player, bool) {
			const cards = Array.from(ui.discardPile.childNodes);
			const gains = game
				.getAllGlobalHistory("everything", evt => {
					if (evt.name == "lose" || evt.name == "loseAsync") {
						if (!evt.getl) {
							return false;
						}
						if (evt.type != "discard" || evt.getlx === false) {
							return false;
						}
						return evt.getl(player)?.cards2?.length > 0;
					}
					return evt.name == "useCard" && evt.player == player && evt.cards?.length > 0;
				})
				.reduce((list, evt) => {
					if (evt.name == "useCard") {
						return list.addArray(evt.cards);
					}
					return list.addArray(evt.getl(player)?.cards2);
				}, [])
				.filter(i => cards.includes(i));
			if (bool) {
				return gains.some(card => get.type(card) == "trick");
			}
			return gains.filter(card => get.type(card) == "trick");
		},
		content() {
			player.awakenSkill(event.name);
			var cards = lib.skill.dcjijiao.getCards(player);
			if (cards.length) {
				target.gain(cards, "gain2").gaintag.add("dcjijiao");
				target.addSkill("dcjijiao_nowuxie");
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (ui.cardPile.childNodes.length > game.players.length * 5 && !player.hasSkill("dcjijiao_risutoa") && !game.hasPlayer(current => current.hp <= 1) && game.countPlayer(current => current.hp === 2 && current.countCards("hes") < 3) <= 1) {
						return 0;
					}
					return 5;
				},
			},
		},
		subSkill: {
			machi: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: {
					global: ["washCard", "die"],
				},
				filter(event, player) {
					return player.hasSkill("dcjijiao", null, false, false);
				},
				content() {
					player.addSkill("dcjijiao_risutoa");
				},
			},
			risutoa: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { global: "phaseAfter" },
				content() {
					if (player.awakenedSkills.includes("dcjijiao")) {
						player.restoreSkill("dcjijiao");
						game.log(player, "重置了", "#g【继椒】");
						//player.removeSkill('dcjijiao_machi');
					}
					player.removeSkill("dcjijiao_risutoa");
				},
			},
			nowuxie: {
				trigger: { player: "useCard1" },
				forced: true,
				charlotte: true,
				firstDo: true,
				popup: false,
				filter(event, player) {
					if (get.type(event.card) != "trick") {
						return false;
					}
					return player.hasHistory("lose", function (evt) {
						if ((evt.relatedEvent || evt.getParent()) != event) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("dcjijiao")) {
								return true;
							}
						}
						return false;
					});
				},
				content() {
					trigger.nowuxie = true;
				},
				onremove(player) {
					player.removeGaintag("dcjijiao");
				},
			},
		},
	},
	//桓范
	dcjianzheng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countCards("h") && target != player;
		},
		content() {
			"step 0";
			var forced = target.hasCard(i => player.hasUseTarget(i), "h");
			player
				.choosePlayerCard(target, "h", "visible", forced, "获得并使用其中一张牌")
				.set("filterButton", button => {
					return _status.event.player.hasUseTarget(button.link);
				})
				.set("ai", button => {
					return _status.event.player.getUseValue(button.link);
				});
			"step 1";
			if (result.bool) {
				var card = result.links[0];
				event.card = card;
				player.gain(card, "giveAuto");
			} else {
				event.goto(3);
			}
			"step 2";
			if (get.position(card) == "h" && get.owner(card) == player && player.hasUseTarget(card)) {
				if (get.name(card, player) == "sha") {
					player.chooseUseTarget(card, true, false);
				} else {
					player.chooseUseTarget(card, true);
				}
			}
			"step 3";
			if (
				player.hasHistory("useCard", evt => {
					return evt.getParent(2).name == "dcjianzheng" && evt.targets.includes(target);
				})
			) {
				player.link(true);
				target.link(true);
			} else {
				event.finish();
			}
			"step 4";
			target.viewHandcards(player);
		},
		ai: {
			order: 10,
			expose: 0.2,
			result: {
				target(player, target) {
					return -Math.sqrt(target.countCards("h"));
				},
			},
		},
	},
	//fumo!
	dcfumou: {
		audio: 2,
		trigger: { player: "damageEnd" },
		direct: true,
		filter(event, player) {
			return player.getDamagedHp() > 0;
		},
		content() {
			"step 0";
			event.num = trigger.num;
			"step 1";
			player.chooseTarget(get.prompt2("dcfumou"), [1, player.getDamagedHp()]).set("ai", target => {
				var att = get.attitude(_status.event.player, target);
				if (target.countCards("h") >= 3 && (!target.isDamaged() || !target.countCards("e"))) {
					if (!target.canMoveCard()) {
						return -att;
					} else if (!target.canMoveCard(true)) {
						return -att / 5;
					}
				}
				return att;
			});
			"step 2";
			if (result.bool) {
				var targets = result.targets;
				targets.sortBySeat(player);
				event.targets = targets;
				player.logSkill("dcfumou", targets);
				event.num--;
			} else {
				event.finish();
			}
			"step 3";
			var target = targets.shift();
			event.target = target;
			var choices = [];
			var choiceList = ["移动场上的一张牌", "弃置所有手牌并摸两张牌", "弃置装备区里的所有牌并回复1点体力"];
			if (target.canMoveCard()) {
				choices.push("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			}
			if (
				target.countCards("h") &&
				!target.hasCard(card => {
					return !lib.filter.cardDiscardable(card, target, "dcfumou");
				}, "h")
			) {
				choices.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			if (
				target.countCards("e") &&
				!target.hasCard(card => {
					return !lib.filter.cardDiscardable(card, target, "dcfumou");
				}, "h")
			) {
				choices.push("选项三");
			} else {
				choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "</span>";
			}
			if (choices.length) {
				target
					.chooseControl(choices)
					.set("prompt", "腹谋：请选择一项")
					.set("choiceList", choiceList)
					.set("ai", () => {
						return _status.event.choice;
					})
					.set(
						"choice",
						(function () {
							if (choices.length == 1) {
								return choices[0];
							}
							var func = (choice, target) => {
								switch (choice) {
									case "选项一":
										if (target.canMoveCard(true)) {
											return 5;
										}
										return 0;
									case "选项二":
										return (
											4 -
											target.getCards("h").reduce((acc, card) => {
												return acc + get.value(card);
											}, 0) /
												3
										);
									case "选项三": {
										var e2 = target.getEquip(2);
										if (target.isHealthy()) {
											return -1.8 * target.countCards("e") - (e2 ? 1 : 0);
										}
										if (!e2 && target.hp + target.countCards("hs", ["tao", "jiu"]) < 2) {
											return 6;
										}
										let rec =
											get.recoverEffect(target, target, target) / 4 -
											target.getCards("e").reduce((acc, card) => {
												return acc + get.value(card);
											}, 0) /
												3;
										if (!e2) {
											rec += 2;
										}
										return rec;
									}
								}
							};
							var choicesx = choices.map(i => [i, func(i, target)]).sort((a, b) => b[1] - a[1]);
							return choicesx[0][0];
						})()
					);
			} else {
				event.goto(5);
			}
			"step 4";
			game.log(target, "选择了", "#y" + result.control);
			if (result.control == "选项一") {
				target.moveCard(true);
			} else if (result.control == "选项二") {
				target.chooseToDiscard(true, "h", target.countCards("h"));
				target.draw(2);
			} else {
				target.chooseToDiscard(true, "e", target.countCards("e"));
				target.recover();
			}
			"step 5";
			if (event.targets.length) {
				event.goto(3);
			}
			// else if(event.num) event.goto(1);
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
						var num = 1;
						if (get.attitude(player, target) > 0) {
							if (player.needsToDiscard()) {
								num = 0.7;
							} else {
								num = 0.5;
							}
						}
						if (target.hp == 2 && target.hasFriend()) {
							return [1, num * 1.5];
						}
						if (target.hp >= 2) {
							return [1, num];
						}
					}
				},
			},
		},
	},
	//陈泰
	dcctjiuxian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard: lib.filter.cardRecastable,
		selectCard() {
			return Math.ceil(_status.event.player.countCards("h") / 2);
		},
		check(card) {
			return 6.5 - get.value(card);
		},
		discard: false,
		lose: false,
		delay: false,
		content() {
			"step 0";
			player.recast(cards);
			"step 1";
			player.addTempSkill("dcctjiuxian_help");
			player.chooseUseTarget(
				{
					name: "juedou",
					isCard: true,
					storage: { dcctjiuxian: true },
				},
				true
			);
		},
		ai: {
			order() {
				return 0.9 * get.order({ name: "juedou" });
			},
			tag: {
				respond: 2,
				respondSha: 2,
				damage: 1,
			},
			result: {
				player(player) {
					let target = null,
						maxval = 0;
					for (let i of game.players) {
						let jdeff = get.effect(
							i,
							{
								name: "juedou",
								isCard: true,
								cards: ui.selected.cards,
								storage: { dcctjiuxian: true },
							},
							player,
							player
						);
						if (
							i === player ||
							!player.canUse(
								{
									name: "juedou",
									isCard: true,
									cards: ui.selected.cards,
									storage: { dcctjiuxian: true },
								},
								i
							) ||
							jdeff < 0
						) {
							continue;
						}
						let receff = 0;
						game.filterPlayer(function (current) {
							if (player != current && i.inRange(current) && current.isDamaged()) {
								receff = Math.max(receff, get.recoverEffect(current, i, i));
							}
						});
						if (jdeff + receff / 5 > maxval) {
							target = i;
							maxval = jdeff + receff / 5;
						}
					}
					if (target) {
						return maxval / 80;
					}
					return 0;
				},
			},
		},
		subSkill: {
			help: {
				trigger: { global: "damageSource" },
				filter(event, player) {
					return (
						event.card &&
						event.card.storage &&
						event.card.storage.dcctjiuxian &&
						event.player.isIn() &&
						event.getParent(2).targets.includes(event.player) &&
						game.hasPlayer(current => {
							return current != player && event.player.inRange(current) && current.isDamaged();
						})
					);
				},
				direct: true,
				forced: true,
				charlotte: true,
				content() {
					"step 0";
					player
						.chooseTarget("救陷：是否令其攻击范围内的一名其他角色回复1点体力？", (card, player, target) => {
							if (_status.event.player == target) {
								return false;
							}
							return target.isDamaged() && _status.event.targetx.inRange(target);
						})
						.set("targetx", trigger.player)
						.set("ai", target => get.recoverEffect(target, _status.event.player, _status.event.player));
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("dcctjiuxian_help", target);
						target.recover(player);
					}
				},
			},
		},
	},
	dcchenyong: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter(event, player) {
			return player.getHistory("useCard").length;
		},
		content() {
			var types = [];
			var history = player.getHistory("useCard");
			for (var evt of history) {
				types.add(get.type2(evt.card));
			}
			var num = types.length;
			player.draw(num);
		},
		ai: { threaten: 2.2 },
	},
	//孙瑜
	dcquanshou: {
		audio: 2,
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return event.player.countCards("h") <= event.player.maxHp;
		},
		logTarget: "player",
		check(event, player) {
			if (get.attitude(player, event.player) > 0) {
				return true;
			}
			const draw = event.player.maxHp - event.player.countCards("h");
			return draw <= 2 && event.player.getHp(true) - draw >= 1;
		},
		content() {
			"step 0";
			var draw = Math.min(5, trigger.player.maxHp - trigger.player.countCards("h"));
			trigger.player
				.chooseControl()
				.set("choiceList", [(draw > 0 ? "摸" + get.cnNumber(draw) + "张牌，然后" : "令") + "你本回合使用【杀】的次数上限-1", "当你本回合使用牌被抵消后，" + get.translation(player) + "摸一张牌"])
				.set("ai", () => _status.event.choice)
				.set(
					"choice",
					(function () {
						var draw = Math.min(5, Math.max(0, trigger.player.maxHp - trigger.player.countCards("h")));
						if (get.attitude(trigger.player, player) > 0) {
							if (draw >= 3 || trigger.player.getCardUsable("sha") > 1) {
								return "选项一";
							}
							if (
								!draw ||
								(draw <= 1 &&
									trigger.player.countCards("hs", card => {
										return get.name(card) == "sha" && trigger.player.hasValueTarget(card);
									}))
							) {
								return "选项二";
							}
							return "选项一";
						} else {
							if (draw >= 4) {
								return "选项一";
							}
							if (
								draw < 2 &&
								trigger.player.countCards("hs", card => {
									return trigger.player.hasValueTarget(card);
								})
							) {
								return "选项二";
							}
							return "选项一";
						}
					})()
				)
				.set("prompt", "劝守：请选择一项");
			"step 1";
			game.log(trigger.player, "选择了", "#y" + result.control);
			if (result.control == "选项一") {
				var draw = Math.min(5, trigger.player.maxHp - trigger.player.countCards("h"));
				if (draw > 0) {
					trigger.player.draw(draw);
				}
				trigger.player.addTempSkill("dcquanshou_sha");
				trigger.player.addMark("dcquanshou_sha", 1, false);
			} else {
				trigger.player.addTempSkill("dcquanshou_respond");
				trigger.player.markAuto("dcquanshou_respond", [player]);
			}
		},
		ai: {
			expose: 0.1,
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				marktext: "守",
				intro: { content: "使用【杀】的次数上限-#" },
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num - player.countMark("dcquanshou_sha");
						}
					},
				},
			},
			respond: {
				trigger: { player: ["shaMiss", "eventNeutralized"] },
				filter(event, player) {
					if (event.type != "card" && event.name != "_wuxie") {
						return false;
					}
					return player.getStorage("dcquanshou_respond").some(i => i.isIn());
				},
				forced: true,
				popup: false,
				charlotte: true,
				onremove: true,
				marktext: '<span style="text-decoration: line-through;">守</span>',
				intro: { content: "本回合使用的牌被抵消后，$摸一张牌" },
				content() {
					var targets = player.getStorage("dcquanshou_respond");
					targets.sortBySeat();
					for (var target of targets) {
						if (target.isIn()) {
							target.logSkill("dcquanshou_respond", player);
							target.draw();
						}
					}
				},
			},
		},
	},
	dcshexue: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			var cards = lib.skill.dcshexue.getLast();
			return cards.some(card => player.hasUseTarget(card, false));
		},
		getLast() {
			var cards = [];
			for (var current of game.filterPlayer()) {
				var history = current.actionHistory;
				if (history.length < 2) {
					continue;
				}
				if (history[history.length - 2].isMe) {
					var evts = history[history.length - 2].useCard;
					for (var i = evts.length - 1; i >= 0; i--) {
						var evt = evts[i];
						if (get.type(evt.card) != "basic" && get.type(evt.card) != "trick") {
							continue;
						}
						var evtx = evt.getParent("phaseUse");
						if (evtx && evtx.player == current) {
							cards.push({ name: evt.card.name, nature: evt.card.nature });
						}
					}
				}
			}
			return cards;
		},
		direct: true,
		group: "dcshexue_end",
		content() {
			"step 0";
			var cards = lib.skill.dcshexue.getLast();
			cards = cards.filter(card => player.hasUseTarget(card, false));
			player.chooseButton(["设学：是否将一张牌当作其中一张牌使用？", [cards, "vcard"]]);
			"step 1";
			if (!result.bool) {
				return;
			}
			var card = result.links[0];
			game.broadcastAll(function (card) {
				lib.skill.dcshexue_backup.viewAs = card;
			}, card);
			var next = player.chooseToUse();
			next.set("openskilldialog", `###${get.prompt("dcshexue")}###将一张牌当做${get.translation(card.nature) || ""}【${get.translation(card.name)}】使用`);
			next.set("norestore", true);
			next.set("addCount", false);
			next.set("_backupevent", "dcshexue_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("dcshexue_backup");
		},
		subSkill: {
			backup: {
				audio: "dcshexue",
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				filterTarget: lib.filter.targetEnabled,
				position: "hes",
				selectCard: 1,
				check: card => 6 - get.value(card),
				popname: true,
			},
			end: {
				audio: "dcshexue",
				trigger: { player: "phaseUseEnd" },
				filter(event, player) {
					return player.getHistory("useCard", evt => {
						return evt.getParent("phaseUse") == event && (get.type(evt.card) == "basic" || get.type(evt.card) == "trick");
					}).length;
				},
				prompt2(event, player) {
					return "令下一回合的角色于其出牌阶段开始时选择是否将一张牌当做你本阶段使用过的一张基本牌或普通锦囊牌使用？";
				},
				check(event, player) {
					let evt = event.getParent("phase").getParent();
					let nextPlayer = player.getNext();
					if (evt && evt.next && evt.next.length) {
						nextPlayer = evt.next[0].player;
					}
					return get.attitude(player, nextPlayer) > 0;
				},
				content() {
					var history = player.getHistory("useCard", evt => {
						return evt.getParent("phaseUse") == trigger && (get.type(evt.card) == "basic" || get.type(evt.card) == "trick");
					});
					player.addSkill("dcshexue_studyclear");
					if (!player.storage.dcshexue_studyclear) {
						player.storage.dcshexue_studyclear = [];
					}
					history.forEach(evt => {
						var card = evt.card;
						card = { name: card.name, nature: card.nature };
						player.storage.dcshexue_studyclear.push(card);
					});
				},
			},
			study: {
				trigger: { player: "phaseUseBegin" },
				filter(event, player) {
					return player.getStorage("dcshexue_study").some(i => event.player.hasUseTarget(i, false));
				},
				onremove: true,
				charlotte: true,
				direct: true,
				async content(event, trigger, player) {
					let cards = player.getStorage("dcshexue_study");
					const result = await player
						.chooseButton(["设学：是否将一张牌当作其中一张牌使用？", [cards, "vcard"]])
						.set("ai", button => {
							return get.event().player.getUseValue(button.link, false);
						})
						.forResult();
					if (!result.bool) {
						return;
					}
					const card = result.links[0];
					if (!trigger.player.hasUseTarget(card, false)) {
						return;
					}
					game.broadcastAll(function (card) {
						lib.skill.dcshexue_backup.viewAs = card;
						lib.skill.dcshexue_backup.prompt = "设学：是否将一张牌当做" + get.translation(card) + "使用？";
					}, card);
					await trigger.player
						.chooseToUse()
						.set(
							"openskilldialog",
							`###${get.prompt("dcshexue_study")}###
							将一张牌当做${get.translation(card.nature) || ""}【${get.translation(card.name)}】使用`
						)
						.set("norestore", true)
						.set("addCount", false)
						.set("_backupevent", "dcshexue_backup")
						.set("custom", {
							add: {},
							replace: { window() {} },
						})
						.backup("dcshexue_backup");
				},
			},
			studyclear: {
				trigger: { global: "phaseBegin" },
				charlotte: true,
				forceDie: true,
				silent: true,
				onremove: true,
				lastDo: true,
				content() {
					trigger.player.addTempSkill("dcshexue_study");
					if (!trigger.player.storage.dcshexue_study) {
						trigger.player.storage.dcshexue_study = [];
					}
					trigger.player.storage.dcshexue_study = trigger.player.storage.dcshexue_study.concat(player.getStorage("dcshexue_studyclear"));
					player.removeSkill("dcshexue_studyclear");
				},
			},
		},
	},
	//郤正
	dcdanyi: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget) {
				return false;
			}
			if (!event.targets || !event.targets.length) {
				return false;
			}
			var evt = lib.skill.dcjianying.getLastUsed(player, event.getParent());
			if (!evt || !evt.targets || !evt.targets.length) {
				return false;
			}
			return event.targets.some(target => evt.targets.includes(target));
		},
		frequent: true,
		locked: false,
		content() {
			var evt = lib.skill.dcjianying.getLastUsed(player, trigger.getParent());
			player.draw(trigger.targets.filter(target => evt.targets.includes(target)).length);
		},
		mod: {
			aiOrder(player, card, num) {
				var evt = player.getLastUsed();
				if (
					evt &&
					evt.targets &&
					evt.targets.length &&
					game.hasPlayer(current => {
						return evt.targets.includes(current) && player.canUse(card, current) && get.effect(current, card, player, player) > 0;
					})
				) {
					return num + 10;
				}
			},
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					var evt = player.getLastUsed();
					if (evt && evt.targets.includes(target)) {
						return [1, 1];
					}
				},
			},
		},
	},
	dcwencan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			if (ui.selected.targets.length) {
				if (ui.selected.targets[0].hp == target.hp) {
					return false;
				}
			}
			return target != player;
		},
		selectTarget: [1, 2],
		complexTarget: true,
		multiline: true,
		content() {
			"step 0";
			target
				.chooseToDiscard(get.translation(player) + "对你发动了【文灿】", "是否弃置两张花色不同的牌？或者点击“取消”，令其本回合对你使用牌无距离和次数限制", "he", 2, (card, player) => {
					if (!ui.selected.cards.length) {
						return true;
					}
					var suit = get.suit(card, player);
					for (var i of ui.selected.cards) {
						if (get.suit(i, player) == suit) {
							return false;
						}
					}
					return true;
				})
				.set("complexCard", true)
				.set("ai", card => {
					if (_status.event.nofear) {
						return 0;
					}
					return 5 - get.value(card);
				})
				.set(
					"nofear",
					player.countCards("hs", card => {
						return get.tag(card, "damage") && player.canUse(card, target, false) && get.effect(target, card, player, target) <= 0;
					}) < target.hp
				);
			"step 1";
			if (!result.bool) {
				player.addTempSkill("dcwencan_paoxiao");
				player.markAuto("dcwencan_paoxiao", [target]);
			}
		},
		subSkill: {
			paoxiao: {
				charlotte: true,
				onremove: true,
				marktext: "灿",
				intro: { content: "对$使用牌无距离和次数限制" },
				mod: {
					cardUsableTarget(card, player, target) {
						if (player.getStorage("dcwencan_paoxiao").includes(target)) {
							return true;
						}
					},
					targetInRange(card, player, target) {
						if (player.getStorage("dcwencan_paoxiao").includes(target)) {
							return true;
						}
					},
				},
			},
		},
		ai: {
			order: 9,
			result: { target: -1 },
		},
	},
	//芮姬
	dcwangyuan: {
		audio: 2,
		trigger: {
			player: ["loseAfter", "logSkill"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		filter(event, player, name) {
			if (player == _status.currentPhase) {
				return name == "logSkill" && event.skill == "dcliying" && player.getExpansions("dcwangyuan").length < game.countPlayer2();
			}
			if (name == "logSkill") {
				return false;
			}
			if (player.getExpansions("dcwangyuan").length >= game.countPlayer2()) {
				return false;
			}
			if (event.name == "gain" && event.player == player) {
				return false;
			}
			var evt = event.getl(player);
			return evt && evt.cards2 && evt.cards2.length > 0;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("dcwangyuan");
			var card = get.cardPile2(cardx => {
				var type = get.type2(cardx);
				return (type == "basic" || type == "trick") && !cards.some(cardxx => get.name(cardx, false) == get.name(cardxx, false));
			}, "random");
			if (card) {
				player.addToExpansion(card, "gain2").gaintag.add("dcwangyuan");
			}
		},
		ai: {
			combo: "dclingyin",
		},
		marktext: "妄",
		intro: {
			name: "妄(妄缘/铃音)",
			content: "expansion",
			markcount: "expansion",
		},
	},
	dclingyin: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.getExpansions("dcwangyuan").length;
		},
		direct: true,
		content() {
			"step 0";
			var cards = player.getExpansions("dcwangyuan");
			player
				.chooseButton([get.prompt("dclingyin") + "（当前轮数：" + get.cnNumber(game.roundNumber, true) + "）", cards], [1, game.roundNumber])
				.set("ai", button => {
					var color = _status.event.color,
						player = _status.event.player;
					if (ui.selected.buttons.length > 0 && ui.selected.buttons.length == player.getExpansions("dcwangyuan").length - 1) {
						return 0;
					}
					if (color == 1) {
						return get.value(button.link);
					}
					if (color) {
						return get.color(button.link) == color ? 1 : 0;
					}
					return 0;
				})
				.set(
					"color",
					(function () {
						var cardsR = cards.filter(i => get.color(i) == "red");
						if (cardsR.length == cards.length || cardsR.length == 0 || cards.length <= game.roundNumber) {
							return 1;
						}
						if (cardsR.length <= game.roundNumber) {
							return "red";
						}
						if (cards.length - cardsR.length <= game.roundNumber) {
							return "black";
						}
						return 1;
					})()
				);
			"step 1";
			if (result.bool) {
				player.logSkill("dclingyin");
				var cards = result.links;
				player.gain(cards, "gain2");
				var cardsx = player.getExpansions("dcwangyuan").removeArray(cards);
				if (cardsx.length <= 1 || get.color(cardsx) != "none") {
					player.addTempSkill("dclingyin_effect");
					player.addMark("dclingyin_effect", 1, false);
					game.log(player, "获得了", "#g【铃音】", "的后续效果");
				}
			}
		},
		ai: {
			combo: "dcwangyuan",
			threaten: 3,
		},
		subSkill: {
			effect: {
				audio: "dclingyin",
				enable: "phaseUse",
				trigger: { source: "damageBegin1" },
				viewAs: { name: "juedou" },
				charlotte: true,
				forced: true,
				onremove: true,
				prompt: "将一张武器牌或防具牌当【决斗】使用",
				filterCard(card) {
					return get.subtype(card) == "equip1" || get.subtype(card) == "equip2";
				},
				position: "hes",
				filter(event, player) {
					if (event.name == "chooseToUse") {
						return player.countCards("hes", { subtype: ["equip1", "equip2"] }) > 0;
					}
					return event.player != player;
				},
				content() {
					trigger.num += player.countMark("dclingyin_effect");
				},
				ai: {
					damageBonus: true,
				},
			},
		},
	},
	dcliying: {
		audio: 2,
		usable: 1,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			const cards = event.getg(player).filter(i => get.owner(i) == player && get.position(i) == "h");
			if (!cards.length) {
				return false;
			}
			const evt = event.getParent("phaseDraw");
			if (evt?.name == "phaseDraw") {
				return false;
			}
			return true;
		},
		async cost(event, trigger, player) {
			const cards = trigger.getg(player).filter(i => get.owner(i) == player && get.position(i) == "h");
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt(event.name.slice(0, -5)),
					prompt2: "选择本次获得的任意张牌交给一名其他角色，然后摸一张牌",
					filterTarget: lib.filter.notMe,
					filterCard: card => _status.event.cards.includes(card),
					cards: cards,
					selectCard: [1, cards.length],
					ai1(card) {
						if (ui.selected.cards.length) {
							return 0;
						}
						return 3 / (Math.abs(get.value(card)) + 0.1);
					},
					ai2(target) {
						return get.value(ui.selected.cards, target) * get.attitude(_status.event.player, target);
					},
				})
				.set("cards", cards)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.give(event.cards, event.targets[0]);
			await player.draw();
		},
	},
	//谢灵毓
	dcyuandi: {
		audio: 2,
		init: () => {
			game.addGlobalSkill("dcyuandi_ai");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("dcyuandi", null, null, false), true)) {
				game.removeGlobalSkill("dcyuandi_ai");
			}
		},
		trigger: { global: "useCard" },
		filter(event, player) {
			var evt = event.getParent("phaseUse");
			if (!evt || evt.player != event.player) {
				return false;
			}
			if (event.player == player || !event.targets || event.targets.length > 1 || event.targets[0] != event.player) {
				return false;
			}
			return (
				event.player
					.getHistory("useCard", evtx => {
						return evtx.getParent("phaseUse") == evt;
					})
					.indexOf(event) == 0
			);
		},
		direct: true,
		content() {
			"step 0";
			var target = trigger.player;
			var name = get.translation(target);
			var choices = ["选项二"];
			var choiceList = ["弃置" + name + "一张手牌", "你与" + name + "各摸一张牌"];
			if (target.countDiscardableCards(player, "h")) {
				choices.unshift("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5; ">' + choiceList[0] + "</span>";
			}
			player
				.chooseControl(choices, "cancel2")
				.set("choiceList", choiceList)
				.set("ai", () => {
					return _status.event.choice;
				})
				.set("prompt", get.prompt("dcyuandi", trigger.player))
				.set(
					"choice",
					(function () {
						if (get.attitude(player, target) < 0) {
							if (choices.includes("选项一")) {
								return "选项一";
							}
							return "cancel2";
						}
						return "选项二";
					})()
				);
			"step 1";
			if (result.control != "cancel2") {
				var target = trigger.player;
				player.logSkill("dcyuandi", target);
				if (result.control == "选项一") {
					player.discardPlayerCard(target, "h", true);
					if (get.mode() !== "identity" || player.identity !== "nei") {
						player.addExpose(0.15);
					}
				} else {
					game.asyncDraw([target, player]);
				}
			}
		},
		subSkill: {
			ai: {
				mod: {
					aiOrder(player, card, num) {
						var info = get.info(card);
						if (!info || !info.toself) {
							return;
						}
						var evt = _status.event.getParent("phaseUse");
						if (!evt || evt.player != player) {
							return;
						}
						if (player.hasHistory("useCard", evtx => evtx.getParent("phaseUse") == evt)) {
							return;
						}
						if (
							game.hasPlayer(current => {
								return current.hasSkill("dcyuandi") && get.attitude(player, current) >= 0;
							})
						) {
							return num + 10;
						}
						return num / 3;
					},
				},
				trigger: { player: "dieAfter" },
				filter: () => {
					return !game.hasPlayer(i => i.hasSkill("dcyuandi", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				content: () => {
					game.removeGlobalSkill("dcyuandi_ai");
				},
			},
		},
	},
	dcxinyou: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") < player.maxHp || player.isDamaged();
		},
		content() {
			"step 0";
			player.recover(player.getDamagedHp(true));
			player.drawTo(player.maxHp);
			"step 1";
			var check = 0;
			if (
				player.hasHistory("gain", evt => {
					return evt.getParent(2) == event && evt.cards.length >= 3;
				})
			) {
				check |= 1;
			}
			if (
				game.getGlobalHistory("changeHp", evt => {
					return evt.getParent().name == "recover" && evt.getParent(2) == event;
				}).length
			) {
				check |= 2;
			}
			if (check > 0) {
				player.addTempSkill("dcxinyou_effect");
				player.storage.dcxinyou_effect = check;
			}
		},
		ai: {
			order: 1,
			result: { player: 1 },
		},
		subSkill: {
			effect: {
				audio: "dcxinyou",
				trigger: { player: "phaseJieshuBegin" },
				charlotte: true,
				forced: true,
				onremove: true,
				filter(event, player) {
					return player.storage.dcxinyou_effect;
				},
				content() {
					if ((player.storage.dcxinyou_effect & 1) > 0) {
						player.loseHp();
					}
					if ((player.storage.dcxinyou_effect & 2) > 0) {
						player.chooseToDiscard("心幽：请弃置一张牌", 1, true, "he");
					}
				},
			},
		},
	},
	//笮融
	dccansi: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		content() {
			"step 0";
			player.recover();
			if (!game.hasPlayer(current => current != player)) {
				event.finish();
			} else {
				player.chooseTarget("残肆：选择一名其他角色", true, lib.filter.notMe).set("ai", target => {
					var player = _status.event.player;
					var list = ["recover", "sha", "juedou", "huogong"];
					return list.reduce((p, c) => {
						return p + get.effect(target, { name: c }, player, player);
					}, 0);
				});
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "fire");
				target.recover();
				event.list = ["sha", "juedou", "huogong"];
				player.addTempSkill("dccansi_draw");
				player.storage.dccansi_draw = target;
			} else {
				event.finish();
			}
			"step 2";
			var card = { name: event.list.shift(), isCard: true };
			if (target.isIn() && player.canUse(card, target, false)) {
				player.useCard(card, target, false);
			}
			if (event.list.length) {
				event.redo();
			}
			"step 3";
			player.removeSkill("dccansi_draw");
		},
		subSkill: {
			draw: {
				audio: "dccansi",
				trigger: { global: "damageEnd" },
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return event.getParent(3).name == "dccansi" && player.storage.dccansi_draw == event.player;
				},
				content() {
					for (var i = 0; i < trigger.num; i++) {
						player.draw(2);
					}
				},
			},
		},
		ai: {
			threaten: 5,
			expose: 0.3,
		},
	},
	dcfozong: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h") > 7;
		},
		forced: true,
		direct: true,
		intro: {
			markcount: "expansion",
			content: "expansion",
		},
		content() {
			"step 0";
			var num = player.countCards("h") - 7;
			player.chooseCard("佛宗：将" + get.cnNumber(num) + "张手牌置于武将上", true, num);
			"step 1";
			if (result.bool) {
				var cards = result.cards;
				player.logSkill("dcfozong");
				player.addToExpansion(cards, player, "give").gaintag.add("dcfozong");
			}
			"step 2";
			var cards = player.getExpansions("dcfozong");
			if (cards.length < 7) {
				event.finish();
			} else {
				event.targets = game.filterPlayer(i => i != player).sortBySeat(player);
				game.delayx();
			}
			"step 3";
			var target = targets.shift();
			event.target = target;
			player.line(target);
			var cards = player.getExpansions("dcfozong");
			if (!cards.length) {
				event._result = { bool: false };
			} else {
				target
					.chooseButton(['###佛宗###<div class="text center">获得一张牌并令' + get.translation(player) + "回复1点体力，或点击“取消”令其失去1点体力</div>", cards])
					.set("ai", button => {
						if (_status.event.refuse) {
							return get.value(button.link) - 7.5;
						}
						return get.value(button.link);
					})
					.set("refuse", get.attitude(target, player) < 1 && get.effect(player, { name: "losehp" }, player, target) > 0);
			}
			"step 4";
			if (result.bool) {
				var card = result.links[0];
				target.gain(card, "give", player);
				player.recover(target);
			} else {
				player.loseHp();
			}
			"step 5";
			if (targets.length) {
				event.goto(3);
			}
		},
		ai: { halfneg: true },
	},
	//滕芳兰
	dcluochong: {
		audio: 2,
		trigger: { global: "roundStart" },
		filter(event, player) {
			return game.hasPlayer(current => current.countDiscardableCards(player, "hej") > 0);
		},
		direct: true,
		async content(event, trigger, player) {
			if (_status.connectMode) {
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			}
			const lose_list = [];
			let num = 4 - player.countMark("dcluochong");
			let log = false;
			while (num > 0) {
				const result = await player
					.chooseTarget(get.prompt("dcluochong"), `弃置任意名角色区域内的累计至多${num}张牌`, (card, player, target) => {
						return target.hasCard(card => {
							return lib.filter.canBeDiscarded(card, player, target, "dcluochong");
						}, "hej");
					})
					.set("ai", target => {
						const player = _status.event.player,
							discarded = _status.event.lose_list.find(item => item[0] == target);
						if (discarded) {
							if (target == player) {
								return 0;
							}
							const num = discarded[1].length;
							if (num > 1 && player.hp + player.hujia > 2) {
								return 0;
							}
						}
						if (target == player) {
							if (ui.cardPile.childNodes.length > 80 && player.hasCard(card => get.value(card) < 8)) {
								return 20;
							}
							return 0;
						}
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					})
					.set("lose_list", lose_list)
					.forResult();
				if (result.bool) {
					if (!log) {
						player.logSkill("dcluochong");
						log = true;
					}
					const target = result.targets[0];
					const cards = await player
						.choosePlayerCard(target, true, "hej", [1, num], `选择弃置${get.translation(target)}区域内的牌`)
						.set("filterButton", button => {
							const card = button.link,
								target = _status.event.target,
								player = get.player();
							return lib.filter.canBeDiscarded(card, player, target, "dcluochong");
						})
						.set("lose_list", lose_list)
						.set("ai", button => {
							if (ui.selected.buttons.length > 0) {
								return false;
							}
							var val = get.buttonValue(button);
							if (get.attitude(_status.event.player, _status.event.target) > 0) {
								return -val;
							}
							return val;
						})
						.forResultCards();
					num -= cards.length;
					const index = lose_list.find(item => item[0] == target);
					if (!index) {
						lose_list.push([target, cards]);
					} else {
						index[1].addArray(cards);
					}
					await target.discard(cards, "notBySelf").set("discarder", player);
				} else {
					break;
				}
			}
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			if (lose_list.length > 0 && lose_list.some(i => i[1].length > 2)) {
				game.log(player, "可弃置牌数", "#g-1");
				player.addMark("dcluochong", 1, false);
			}
		},
		ai: {
			threaten: 2.5,
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "delay" && current < 0) {
						var current2 = _status.currentPhase;
						if (current2 && current2.getSeatNum() > target.getSeatNum()) {
							return 0.1;
						}
					}
				},
			},
		},
	},
	dcaichen: {
		audio: 2,
		init(player) {
			game.addGlobalSkill("dcaichen_hit");
		},
		onremove(player) {
			if (!game.hasPlayer(current => current.hasSkill("dcaichen", null, null, false), true)) {
				game.removeGlobalSkill("dcaichen_hit");
			}
		},
		trigger: {
			player: ["loseAfter", "phaseDiscardBefore"],
			target: "useCardToTargeted",
		},
		filter(event, player, name) {
			if (event.name == "phaseDiscard") {
				return ui.cardPile.childNodes.length > 40;
			}
			if (name == "useCardToTargeted") {
				return ui.cardPile.childNodes.length < 40 && get.suit(event.card) == "spade";
			}
			const evt = event.getParent(2);
			if (evt.name != "dcluochong" || evt.player != player || player.hasHistory("lose", evtx => evtx.getParent("dcluochong", true) == evt && evtx != event)) {
				return false;
			}
			if (!event.getl(player).cards.length) {
				return false;
			}
			return ui.cardPile.childNodes.length > 80;
		},
		forced: true,
		content() {
			if (trigger.name.indexOf("lose") == 0) {
				player.draw(2);
			} else if (trigger.name == "phaseDiscard") {
				trigger.cancel();
				game.log(player, "跳过了弃牌阶段");
			} else {
				trigger.directHit.add(player);
				game.log(player, "不可响应", trigger.card);
			}
		},
		subSkill: {
			hit: {
				trigger: { player: "dieAfter" },
				filter(event, player) {
					return !game.hasPlayer(current => current.hasSkill("dcaichen", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				content() {
					game.removeGlobalSkill("dcaichen_hit");
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return arg && arg.card && arg.target && arg.target.hasSkill("dcaichen") && ui.cardPile.childNodes.length < 40 && get.suit(arg.card) === "spade";
					},
				},
			},
		},
	},
	//杨彪
	dczhaohan: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		frequent: true,
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			trigger.num += 2;
			trigger.dczhaohan = true;
			player.addTempSkill("dczhaohan_choose", "phaseDrawAfter");
		},
		subSkill: {
			choose: {
				trigger: { player: "gainAfter" },
				filter(event, player) {
					return event.getParent(2).dczhaohan && player.countCards("h") >= 2;
				},
				forced: true,
				charlotte: true,
				popup: false,
				content() {
					"step 0";
					var choices = [],
						choiceList = ["将两张手牌交给一名没有手牌的角色", "弃置两张手牌"];
					if (game.hasPlayer(current => current.countCards("h") == 0)) {
						choices.push("选项一");
					} else {
						choiceList[0] = '<span style="opacity:0.5; ">' + choiceList[0] + "</span>";
					}
					choices.push("选项二");
					if (choices.length == 1) {
						event._result = { control: "选项二" };
					} else {
						player
							.chooseControl(choices)
							.set("choiceList", choiceList)
							.set("ai", () => _status.event.choice)
							.set(
								"choice",
								(function () {
									if (
										game.hasPlayer(current => {
											return current.countCards("h") == 0 && get.attitude(player, current) > 0;
										})
									) {
										return "选项一";
									}
									return "选项二";
								})()
							);
					}
					"step 1";
					if (result.control == "选项一") {
						player.chooseCardTarget({
							filterCard: true,
							selectCard: 2,
							forced: true,
							filterTarget(card, player, target) {
								return !target.countCards("h");
							},
							ai1(card) {
								return 7 - get.value(card);
							},
							ai2(target) {
								return get.attitude(_status.event.player, target);
							},
							prompt: "将两张手牌交给一名没有手牌的角色",
						});
					} else {
						player.chooseToDiscard("昭汉：请弃置两张手牌", true, 2);
						event.finish();
					}
					"step 2";
					if (result.bool) {
						player.give(result.cards, result.targets[0]);
					}
				},
			},
		},
	},
	oldjinjie: {
		audio: "dcjinjie",
		trigger: { global: "dying" },
		hasPhase(player) {
			var history = player.actionHistory;
			for (var i = history.length - 1; i >= 0; i--) {
				if (history[i].isMe && !history[i].isSkipped) {
					return true;
				}
				if (history[i].isRound) {
					break;
				}
			}
			return false;
		},
		direct: true,
		content() {
			"step 0";
			player.chooseBool(get.prompt("oldjinjie", trigger.player), "令其摸一张牌").set("ai", () => {
				return get.attitude(_status.event.player, _status.event.getTrigger().player) > 0;
			});
			"step 1";
			if (result.bool) {
				player.logSkill("oldjinjie", trigger.player);
				trigger.player.draw();
			} else {
				event.finish();
			}
			if (lib.skill.oldjinjie.hasPhase(player)) {
				event.finish();
			}
			"step 2";
			var num = 0;
			var history = player.actionHistory;
			for (var i = history.length - 1; i >= 0; i--) {
				for (var evt of history[i].useSkill) {
					if (evt.skill == "oldjinjie") {
						num++;
					}
				}
				if (history[i].isRound) {
					break;
				}
			}
			if (num == 0) {
				player.chooseBool(get.prompt("oldjinjie", trigger.player), "令其回复1点体力").set("ai", () => {
					var player = _status.event.player;
					return get.effect(_status.event.getTrigger().player, { name: "tao" }, player, player) > 0;
				});
			} else {
				player
					.chooseToDiscard(get.prompt("oldjinjie", trigger.player), "弃置" + get.cnNumber(num) + "张牌，令其回复1点体力", "he", num)
					.set("ai", card => {
						if (_status.event.eff > 0) {
							return get.value({ name: "tao" }) - get.value(card);
						}
						return 0;
					})
					.set("eff", get.effect(trigger.player, { name: "tao" }, player, player));
			}
			"step 3";
			if (result.bool) {
				player.line(trigger.player, "green");
				trigger.player.recover();
			}
		},
	},
	dcjinjie: {
		audio: 2,
		trigger: { global: "dying" },
		async cost(event, trigger, player) {
			const target = trigger.player;
			const result = await player
				.chooseControl(
					[0, 1, 2, 3].map(i => get.cnNumber(i, true)),
					"cancel2"
				)
				.set("prompt", get.prompt(event.skill, target))
				.set("prompt2", `令${get.translation(target)}摸至多三张牌，然后你可以弃置等量的牌令其回复1点体力。`)
				.set("ai", () => {
					return get.event("choice");
				})
				.set(
					"choice",
					(() => {
						if (get.attitude(player, target) <= 0) {
							return "cancel2";
						}
						if (target === player) {
							return 3;
						}
						const unusefulCount = player.countCards("he", card => {
							return lib.filter.cardDiscardable(card, player, "dcjinjie") && get.value(card) < 5 && !player.canSaveCard(card, target);
						});
						if (
							[player, target]
								.unique()
								.map(current => {
									return current.countCards("hs", card => {
										return player.canSaveCard(card, target);
									});
								})
								.reduce((p, c) => p + c) > unusefulCount
						) {
							return 3;
						}
						return Math.min(3, unusefulCount);
					})()
				)
				.forResult();
			if (result.control !== "cancel2") {
				event.result = {
					bool: true,
					cost_data: {
						index: result.index,
					},
				};
			}
		},
		round: 1,
		logTarget: "player",
		async content(event, trigger, player) {
			const num = event.cost_data.index,
				target = trigger.player;
			if (num > 0) {
				await target.draw(num);
			}
			let next;
			if (num > 0) {
				next = player
					.chooseToDiscard(`尽节：是否弃置${get.cnNumber(num)}张牌，令${get.translation(target)}回复1点体力？`, num, "he")
					.set("ai", card => {
						if (get.event("goon")) {
							return 100 / Math.max(0.01, get.value(card) + 20);
						}
						return 0;
					})
					.set(
						"goon",
						(() => {
							if (get.attitude(player, target) <= 0) {
								return false;
							}
							const count = player.countCards("hs", card => {
								return player.canSaveCard(card, target);
							});
							return (
								!count ||
								(count > 0 &&
									player.countCards("he", card => {
										return get.value(card) < 5;
									}) >= num)
							);
						})()
					);
			} else {
				next = player.chooseBool(`尽节：是否令${get.translation(target)}回复1点体力？`).set("choice", get.attitude(player, target) > 0);
			}
			const bool = await next.forResultBool();
			if (bool) {
				player.line(target, "green");
				await target.recover();
			}
		},
		subSkill: {
			round: {},
		},
	},
	oldjue: {
		audio: "dcjue",
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(current => (current.getHp() > player.getHp() || current.countCards("h") > player.countCards("h")) && player.canUse("sha", current, false));
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("oldjue"), "视为对一名体力值或手牌数大于你的角色使用一张【杀】", (card, player, target) => {
					return player.canUse("sha", target, false) && (target.getHp() > player.getHp() || target.countCards("h") > player.countCards("h"));
				})
				.set("ai", target => {
					return get.effect(target, { name: "sha" }, _status.event.player);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("oldjue", target);
				player.useCard({ name: "sha", isCard: true }, target, false);
			}
		},
	},
	dcjue: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			if (!lib.skill.dcjue.getCards().length) {
				return false;
			}
			return (
				(event.player !== player && event.player.isIn()) ||
				(event.player === player &&
					game.hasPlayer(current => {
						return current.isIn();
					}))
			);
		},
		round: 1,
		async cost(event, trigger, player) {
			let maxLimit = lib.skill.dcjue.getCards().length;
			if (trigger.player === player) {
				event.result = await player
					.chooseTarget(get.prompt(event.skill), `选择一名其他角色，视为对其依次随机使用X次【杀】/【过河拆桥】/【五谷丰登】（X为${maxLimit}与其体力上限中的较小值）。`)
					.set("filterTarget", lib.filter.notMe)
					.set("ai", target => {
						return -get.attitude(get.player(), target);
					})
					.forResult();
			} else {
				const target = trigger.player;
				maxLimit = Math.min(maxLimit, target.maxHp);
				event.result = await player
					.chooseBool(get.prompt("dcjue", target), `视为对${get.translation(target)}依次随机使用${get.cnNumber(maxLimit)}次【杀】/【过河拆桥】/【五谷丰登】。`)
					.set("choice", get.attitude(player, target) < 0)
					.forResult();
			}
		},
		logTarget: "player",
		getCards() {
			const cards = [];
			game.countPlayer2(current => {
				current.getHistory("lose", evt => {
					if (evt.type == "discard") {
						cards.addArray(evt.cards.filterInD("d"));
					}
				});
			});
			return cards;
		},
		async content(event, trigger, player) {
			const target = event.targets ? event.targets[0] : trigger.player;
			const nameList = ["sha", "guohe", "wugu"];
			let maxLimit = Math.min(lib.skill.dcjue.getCards().length, target.maxHp);
			while (maxLimit--) {
				if (!target.isIn()) {
					return;
				}
				const list = nameList.slice().randomSort();
				for (const name of list) {
					const card = new lib.element.VCard({ name });
					let targets = [player, target].filter(current => player.canUse(card, current));
					if (targets.length) {
						await player.useCard(card, targets);
						await game.delayx();
						break;
					}
				}
			}
		},
	},
	//杨弘
	dcjianji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.getAttackRange() >= 1;
		},
		selectTarget() {
			return [1, _status.event.player.getAttackRange()];
		},
		complexSelect: true,
		complexTarget: true,
		filterTarget(card, player, target) {
			var selected = ui.selected.targets;
			if (!selected.length) {
				return true;
			}
			for (var i of selected) {
				if (i.getNext() == target || i.getPrevious() == target) {
					return true;
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			const { target } = event;
			if (target.countCards("he") > 0) {
				await target.chooseToDiscard(true, "he");
			}
		},
		async contentAfter(event, trigger, player) {
			const { targets } = event;
			let list = targets.filter(target => {
				let num = target.countCards("h");
				return targets.every(targetx => {
					return targetx.countCards("h") <= num;
				});
			});
			if (!list.length) {
				return;
			}
			for (let current of list) {
				const result = await current
					.chooseTarget("间计：是否视为对" + get.translation(player) + "以外被选择的一名角色使用一张杀？", (card, player, target) => {
						const { owner, targets } = get.event();
						if (target == player || target == owner) {
							return false;
						}
						return targets.includes(target) && player.canUse("sha", target, false);
					})
					.set("owner", player)
					.set("targets", targets)
					.set("ai", target => {
						let player = _status.event.player;
						return get.effect(target, { name: "sha" }, player, player);
					})
					.forResult();
				if (result.bool) {
					const card = new lib.element.VCard({ name: "sha" });
					await current.useCard(card, result.targets, false);
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					var eff = get.effect(target, { name: "guohe_copy2" }, player, target) / 2;
					if (ui.selected.targets.length && eff < 0) {
						var len = target.countCards("h");
						if (
							ui.selected.targets.every(i => {
								return i.countCards("h") < len + 1;
							}) &&
							ui.selected.targets.some(i => {
								return get.effect(i, { name: "sha" }, target, player) > 0;
							})
						) {
							return 0.1;
						}
					}
					return ui.selected.targets.reduce((p, c) => p + get.effect(c, { name: "guohe_copy2" }, player, c) / 2, 0) + eff;
				},
			},
		},
	},
	dcyuanmo: {
		audio: 2,
		trigger: { player: ["damageEnd", "phaseZhunbeiBegin"] },
		direct: true,
		group: "dcyuanmo_add",
		init(player) {
			player.storage.dcyuanmo_range = 0;
		},
		change(player, num) {
			player.addSkill("dcyuanmo_range");
			if (typeof player.storage.dcyuanmo_range !== "number") {
				player.storage.dcyuanmo_range = 0;
			}
			if (!num) {
				return;
			}
			player.storage.dcyuanmo_range += num;
			if (player.storage.dcyuanmo_range != 0) {
				player.markSkill("dcyuanmo_range");
			} else {
				player.unmarkSkill("dcyuanmo_range");
			}
			game.log(player, "的攻击范围", (num > 0 ? "+" : "") + num);
		},
		content() {
			"step 0";
			event.targets = game.filterPlayer(current => player.inRange(current));
			var choiceList = ["攻击范围+1。然后若你攻击范围内的角色数因此增加，你可以获得其中任意名角色的一张牌", "攻击范围-1。然后你摸两张牌"];
			player
				.chooseControl("cancel2")
				.set("prompt", get.prompt("dcyuanmo"))
				.set("choiceList", choiceList)
				.set("ai", () => {
					return _status.event.choice;
				})
				.set(
					"choice",
					(function () {
						if (
							trigger.name == "phaseZhunbei" &&
							player.getAttackRange() == 1 &&
							!player.hasCard(card => {
								if (get.subtype(card) != "equip1" && !player.hasUseTarget(card)) {
									return false;
								}
								var num = 1;
								var info = get.info(card, false);
								if (info && info.distance && typeof info.distance.attackFrom == "number") {
									num -= info.distance.attackFrom;
								}
								return num > 1;
							}, "hs")
						) {
							return "选项一";
						}
						var targets = event.targets.slice(),
							targetsx = [];
						var _tmp = player.storage.dcyuanmo_range;
						player.storage.dcyuanmo_range++;
						try {
							targetsx = game.filterPlayer(current => player.inRange(current));
						} catch (e) {
							player.storage.dcyuanmo_range = _tmp;
						}
						player.storage.dcyuanmo_range = _tmp;
						targetsx.removeArray(targets);
						return targetsx.reduce((p, c) => {
							return p + Math.max(0, get.effect(c, { name: "shunshou_copy2" }, player, player));
						}, 0) >
							get.effect(player, { name: "draw" }, player, player) * 1.3
							? "选项一"
							: "选项二";
					})()
				);
			"step 1";
			if (result.control == "cancel2") {
				event.finish();
				return;
			}
			player.logSkill("dcyuanmo");
			if (result.control == "选项一") {
				lib.skill.dcyuanmo.change(player, 1);
				var targetsx = game.filterPlayer(current => player.inRange(current));
				if (targetsx.length <= targets.length) {
					event.finish();
				} else {
					event.targets = targetsx.removeArray(targets);
				}
			} else {
				lib.skill.dcyuanmo.change(player, -1);
				player.draw(2);
				event.finish();
			}
			"step 2";
			player
				.chooseTarget("远谟：获得任意名本次进入你攻击范围的角色的一张牌", [1, targets.length], (card, player, target) => {
					return _status.event.getParent().targets.includes(target) && target.countGainableCards(player, "he") > 0;
				})
				.set("ai", target => {
					var player = _status.event.player;
					return get.effect(target, { name: "shunshou_copy2" }, player, player);
				});
			"step 3";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				player.line(targets);
				for (var target of targets) {
					player.gainPlayerCard(target, "he", true);
				}
			}
		},
		subSkill: {
			add: {
				audio: "dcyuanmo",
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return !game.hasPlayer(current => player.inRange(current));
				},
				prompt2: "令你的攻击范围+1",
				check: () => true,
				content() {
					lib.skill.dcyuanmo.change(player, 1);
				},
			},
			range: {
				charlotte: true,
				intro: {
					content(storage, player) {
						var num = player.storage.dcyuanmo_range;
						return "攻击范围" + (num >= 0 ? "+" : "") + num;
					},
				},
				mod: {
					attackRange(player, num) {
						return num + player.countMark("dcyuanmo_range");
					},
				},
			},
		},
	},
	//薛灵芸
	dcxialei: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["loseAsyncAfter", "cardsDiscardAfter", "equipAfter", "addJudgeAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			if (player.countMark("dcxialei_clear") >= 3) {
				return false;
			}
			return event.getd(player, "cards2").some(i => get.color(i, player) === "red");
		},
		async content(event, trigger, player) {
			let cards = get.cards(3 - player.countMark("dcxialei_clear"));
			await game.cardsGotoOrdering(cards);
			let result;
			if (cards.length == 1) {
				result = { bool: true, links: cards };
			} else {
				result = await player.chooseButton(["霞泪：获得其中的一张牌", cards], true).forResult();
			}
			if (result.bool) {
				let card = result.links[0];
				await player.gain(card, "draw");
				cards.remove(card);
				if (cards.length) {
					const result2 = await player
						.chooseBool()
						.set("createDialog", ["是否将剩余牌置于牌堆底？", cards])
						.set("ai", () => _status.event.bool)
						.set(
							"bool",
							(() => {
								if (!player.hasSkill("dcanzhi")) {
									return Math.random() < 0.5;
								}
								if (player.isTempBanned("dcanzhi")) {
									const next = _status.currentPhase?.getNext();
									if (!next) {
										return Math.random() < 0.5;
									}
									const judges = next.getCards("j");
									let val = 0;
									if (judges.length && !next.hasWuxie()) {
										const att = get.attitude(player, next);
										for (var i = 0; judges.length; i++) {
											var judge = judges[i] && get.judge(judges[i]),
												card = cards[i];
											if (!judge || !card) {
												break;
											}
											val += judge(card) * att;
										}
									}
									if (val > 0) {
										return false;
									} else if (val == 0) {
										return Math.random() < 0.5;
									}
									return true;
								}
								var card = cards[0];
								if (
									get.color(card, player) == "red" &&
									player.isPhaseUsing() &&
									player.countCards("hs", card => {
										return get.color(card) == "red" && player.hasValueTarget(card) && ["basic", "trick"].includes(get.type(card));
									}) > 0
								) {
									return false;
								}
								if (get.color(card, player) == "black") {
									return false;
								}
								return true;
							})()
						)
						.forResult();
					if (result2.bool) {
						player.popup("牌堆底");
						game.log(player, "将" + get.cnNumber(cards.length) + "张牌置于了牌堆底");
					} else {
						player.popup("牌堆顶");
					}
					while (cards.length) {
						let cardx = cards.pop();
						cardx.fix();
						if (result2.bool) {
							ui.cardPile.appendChild(cardx);
						} else {
							ui.cardPile.insertBefore(cardx, ui.cardPile.firstChild);
						}
					}
					game.updateRoundNumber();
				}
			}
			player.addMark("dcxialei_clear", 1, false);
			player.addTempSkill("dcxialei_clear");
		},
		subSkill: { clear: { onremove: true } },
	},
	dcanzhi: {
		audio: 2,
		enable: "phaseUse",
		trigger: { player: "damageEnd" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseBool(get.prompt(event.skill))
				.set("prompt2", "你判定，若结果为红色，你重置〖霞泪〗的观看牌数；若结果为黑色，〖暗织〗于本回合失效，然后你可以令一名非当前回合角色获得本回合进入弃牌堆的两张牌。")
				.set(
					"choice",
					game.hasPlayer(current => get.attitude(player, current) > 0 && current != _status.currentPhase)
				)
				.forResult();
		},
		async content(event, trigger, player) {
			const next = player.judge(result => {
				if (get.color(result) == "red") {
					return get.event().getParent().player.countMark("dcxialei_clear") / 2;
				}
				return 2;
			});
			next.judge2 = result => result.bool;
			const { result } = await next;
			if (result?.color && ["red", "black"].includes(result.color)) {
				const { color } = result;
				if (color == "red") {
					player.removeSkill("dcxialei_clear");
				} else {
					player.tempBanSkill(event.name);
					let cards = get.discarded().filterInD("d");
					if (!cards.length || !game.hasPlayer(current => current != _status.currentPhase)) {
						return;
					}
					const { result } = await player
						.chooseTarget("暗织：是否令一名非当前回合角色获得本回合进入弃牌堆的两张牌？", (card, player, target) => {
							return target != _status.currentPhase;
						})
						.set("ai", target => {
							const player = get.player();
							return get.effect(target, { name: "wuzhong" }, player, player);
						});
					if (result?.bool && result?.targets?.length) {
						cards = cards.filterInD("d");
						if (!cards.length) {
							return;
						}
						const [target] = result.targets;
						const { result: result2 } = await player
							.chooseButton([`暗织：选择令${get.translation(target)}获得的牌`, cards], true, Math.min(cards.length, 2))
							.set("ai", button => {
								const { player, target } = get.event();
								return get.sgnAttitude(player, target) * get.value(button.link, target);
							})
							.set("target", target);
						if (result2?.bool && result2?.links?.length) {
							await target.gain(result2.links, "gain2");
						}
					}
				}
			}
		},
		ai: {
			combo: "dcxialei",
			order(item, player) {
				if (player.countMark("dcxialei_clear") >= 2) {
					return 10;
				}
				if (player.hasHistory("useSkill", evt => evt.skill == "dcxialei") && get.color(ui.cardPile.firstChild, player) == "red" && player.countMark("dcxialei_clear") > 0) {
					return 9;
				}
				return 1;
			},
			result: { player: 1 },
		},
	},
	//十周年王允
	dclianji: {
		enable: "phaseUse",
		audio: "wylianji",
		usable: 1,
		check(card) {
			return 5 - get.value(card);
		},
		filterTarget(card, player, target) {
			return target != player;
		},
		filterCard: true,
		content() {
			"step 0";
			var card = get.cardPile2(function (card) {
				return get.subtype(card) == "equip1" && targets[0].hasUseTarget(card);
			}, "random");
			if (card) {
				if (card.name == "qinggang" && !lib.inpile.includes("qibaodao")) {
					card.remove();
					card = game.createCard("qibaodao", card.suit, card.number);
				}
				targets[0].chooseUseTarget(card, true, "nopopup", "nothrow");
			} else {
				player.chat("没有装备牌了吗");
				game.log("但是牌堆里已经没有装备牌了！");
			}
			"step 1";
			game.updateRoundNumber();
			targets[0]
				.chooseToUse(get.translation(player) + "对你发动了【连计】", { name: "sha" })
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target == _status.event.source) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("addCount", false)
				.set("source", player)
				.set("prompt2", "对除" + get.translation(player) + "外的一名角色使用一张【杀】，并将装备区内的武器牌交给其中一名目标角色；或点击“取消”，令" + get.translation(player) + "视为对你使用一张【杀】，并获得你装备区内的武器牌");
			"step 2";
			var card = targets[0].getEquips(1);
			if (result.bool) {
				player.addSkill("dclianji_1");
				if (card.length && result.targets.filter(target => target.isIn()).length > 0) {
					event.card = card;
					targets[0]
						.chooseTarget(true, "将" + get.translation(card) + "交给一名目标角色", (card, player, target) => {
							return _status.event.targets.includes(target);
						})
						.set("ai", function (target) {
							var card = _status.event.getParent().card[0];
							return (target.hasSkillTag("nogain") ? 0 : get.attitude(_status.event.player, target)) * Math.max(0.1, target.getUseValue(card));
						})
						.set("targets", result.targets);
				} else {
					event.finish();
				}
			} else {
				player.addSkill("dclianji_2");
				event.goto(4);
			}
			"step 3";
			targets[0].give(card, result.targets[0], "give");
			event.finish();
			"step 4";
			player.useCard({ name: "sha", isCard: true }, targets[0], false);
			"step 5";
			var card = targets[0].getEquips(1);
			if (card.length) {
				targets[0].give(card, player, "give");
			}
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					if (game.countPlayer() === 2) {
						return -3;
					}
					let val = 0;
					let ev = target
						.getEquips(1)
						.map(card => get.value(card, target))
						.sort((a, b) => a - b);
					if (target.hasEquipableSlot(1) && !target.hasEmptySlot(1)) {
						// 要顶掉原来的武器
						val -= ev[0] || 0;
					}
					let nouse = get.effect(target, { name: "sha", isCard: true }, player, target);
					if (!player.hasSkillTag("nogain")) {
						nouse += get.sgnAttitude(target, player) * get.value({ name: "qinggang" }, player);
					}
					if (target.mayHaveSha(player, "use")) {
						const use =
							game
								.filterPlayer(current => current !== player && current !== target)
								.reduce((max, current) => {
									let eff = get.effect(current, { name: "sha" }, target, target);
									if (!current.hasSkillTag("nogain")) {
										eff += get.sgnAttitude(target, current) * get.value({ name: "qinggang" }, current);
									}
									return Math.max(max, eff);
								}, 0) - get.value({ name: "sha" }, target);
						return Math.max(use, nouse);
					}
					return nouse;
				},
			},
		},
		subSkill: {
			1: { charlotte: true, onremove: true },
			2: { charlotte: true, onremove: true },
		},
	},
	dcmoucheng: {
		trigger: { player: "phaseZhunbeiBegin" },
		audio: "moucheng",
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		derivation: "xinjingong",
		filter(event, player) {
			return player.hasSkill("dclianji_1") && player.hasSkill("dclianji_2");
		},
		content() {
			player.awakenSkill(event.name);
			player.changeSkills(["xinjingong"], ["dclianji"]);
		},
		ai: { combo: "dclianji" },
	},
	//周宣
	dcwumei: {
		audio: 2,
		round: 1,
		trigger: { player: "phaseBeforeEnd" },
		filter(event, player) {
			if (event.finished) {
				return false;
			}
			return !player.isTurnedOver() || event._noTurnOver; //笑点解析：回合开始前，但是翻面不能发动
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => get.attitude(get.player(), target))
				.forResult();
		},
		onRound(event) {
			return !event.wumei_phase;
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			const next = target.insertPhase();
			target.addSkill("dcwumei_wake");
			target.storage["dcwumei_wake"][2].add(next);
			if (!trigger._finished) {
				trigger.finish();
				trigger.untrigger(true);
				trigger._triggered = 5;
				if (!lib.onround.includes(lib.skill.dcwumei.onRound)) {
					lib.onround.push(lib.skill.dcwumei.onRound);
				}
				const evt = player.insertPhase();
				evt.wumei_phase = true;
				evt.phaseList = trigger.phaseList;
				evt.relatedEvent = trigger.relatedEvent || trigger.getParent(2);
				evt.skill = trigger.skill;
				evt._noTurnOver = true;
				evt.set("phaseList", trigger.phaseList);
				evt.pushHandler("dcwumei_phase", (event, option) => {
					if (event.step === 0 && option.state === "begin") {
						event.step = 4;
						_status.globalHistory.push({
							cardMove: [],
							custom: [],
							useCard: [],
							changeHp: [],
							everything: [],
						});
						var players = game.players.slice(0).concat(game.dead);
						for (var i = 0; i < players.length; i++) {
							var current = players[i];
							current.actionHistory.push({
								useCard: [],
								respond: [],
								skipped: [],
								lose: [],
								gain: [],
								sourceDamage: [],
								damage: [],
								custom: [],
								useSkill: [],
							});
							current.stat.push({ card: {}, skill: {} });
						}
					}
				});
			}
			const nexts = trigger.getParent()?.next;
			if (nexts?.length) {
				for (let evt of nexts.slice(0)) {
					if (evt.finished) {
						continue;
					}
					if (evt == next) {
						break;
					}
					nexts.remove(evt);
					nexts.push(evt);
				}
			}
		},
		subSkill: {
			wake: {
				init(player, skill) {
					if (!player.storage[skill]) {
						player.storage[skill] = [[], [], []];
					}
				},
				charlotte: true,
				onremove: true,
				trigger: { player: ["phaseBegin", "phaseEnd"] },
				filter(event, player) {
					return player.storage["dcwumei_wake"][2].includes(event);
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const name = event.triggername;
					if (name === "phaseBegin") {
						for (const playerx of game.filterPlayer()) {
							player.storage[event.name][0].push(playerx);
							player.storage[event.name][1].push(playerx.hp);
						}
						player.markSkill(event.name);
					} else {
						const storage = player.getStorage(event.name);
						if (storage.length) {
							for (let i = 0; i < storage[0].length; i++) {
								const target = storage[0][i];
								if (target?.isIn?.()) {
									if (target.hp != storage[1][i]) {
										game.log(target, "将体力从", "#y" + target.hp, "改为", "#g" + storage[1][i]);
										const next = target.changeHp(storage[1][i] - target.hp);
										next._triggered = null;
										await next;
									}
								}
							}
						}
						player.storage[event.name][2].remove(trigger);
						player.storage[event.name][0] = player.storage[event.name][1] = [];
						player[player.storage[event.name][2].length ? "unmarkSkill" : "removeSkill"](event.name);
					}
				},
				marktext: "梦",
				intro: {
					markcount: (storage = [[]]) => storage[0].length,
					content(storage = [[]], player) {
						if (!storage.length) {
							return "无信息";
						}
						var str = "所有角色于回合开始时的体力值：<br>";
						for (var i = 0; i < storage[0].length; i++) {
							var str2 = get.translation(storage[0][i]) + "：" + storage[1][i];
							if (!storage[0][i].isIn()) {
								str2 = '<span style="opacity:0.5">' + str2 + "（已故）</span>";
							}
							str += "<li>" + str2;
						}
						return str;
					},
				},
				global: "dcwumei_all",
			},
			all: {
				mod: {
					aiOrder(player, card, num) {
						if (num <= 0 || !game.hasPlayer(t => t.marks["dcwumei_wake"])) {
							return;
						}
						if (get.tag(card, "recover") && !_status.event.dying && player.hp > 0) {
							return 0;
						}
						if (get.tag(card, "damage")) {
							if (
								card.name == "sha" &&
								game.hasPlayer(cur => {
									return cur.hp < 2 && player.canUse(card, cur, null, true) && get.effect(cur, card, player, player) > 0;
								})
							) {
								return num;
							}
							if (player.needsToDiscard()) {
								return num / 5;
							}
							return 0;
						}
					},
				},
			},
		},
	},
	dczhanmeng: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			return (
				!player.hasSkill("dczhanmeng_choice1") ||
				!player.hasSkill("dczhanmeng_choice2") ||
				(!player.hasSkill("dczhanmeng_choice0") &&
					!game.hasPlayer2(current => {
						const history = current.actionHistory;
						if (history.length < 2) {
							return false;
						}
						for (let i = history.length - 2; i >= 0; i--) {
							if (history[i].isSkipped) {
								continue;
							}
							const list = history[i].useCard.map(evt => evt.card.name);
							return list.includes(event.card.name);
						}
						return false;
					}, true))
			);
		},
		direct: true,
		content() {
			"step 0";
			var list = [];
			var choiceList = ["上回合若没有同名牌被使用过，你获得一张非伤害牌", "下回合当同名牌首次被使用后，你获得一张伤害牌", "令一名其他角色弃置两张牌，若点数之和大于10，你对其造成1点火焰伤害"];
			var used = game.hasPlayer2(current => {
				var history = current.actionHistory;
				if (history.length < 2) {
					return false;
				}
				for (let i = history.length - 2; i >= 0; i--) {
					if (history[i].isSkipped) {
						continue;
					}
					const list = history[i].useCard.map(evt => evt.card.name);
					return list.includes(trigger.card.name);
				}
				return false;
			}, true);
			if (!player.hasSkill("dczhanmeng_choice0") && !used) {
				list.push("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5; ">' + choiceList[0] + (used ? "（同名牌被使用过）" : "（已选择）") + "</span>";
			}
			if (!player.hasSkill("dczhanmeng_choice1")) {
				list.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "（已选择）</span>";
			}
			var other = game.hasPlayer(current => current != player);
			if (!player.hasSkill("dczhanmeng_choice2") && other) {
				list.push("选项三");
			} else {
				choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + (!other ? "（没人啦）" : "（已选择）") + "</span>";
			}
			list.push("cancel2");
			player
				.chooseControl(list)
				.set("prompt", get.prompt("dczhanmeng"))
				.set("ai", () => {
					var choices = _status.event.controls.slice().remove("cancel2");
					var player = _status.event.player,
						evt = _status.event.getTrigger();
					if (!game.hasPlayer(current => get.attitude(player, current) < 0)) {
						choices.remove("选项三");
					} else if (choices.includes("选项三")) {
						return "选项三";
					}
					if (choices.includes("选项二")) {
						if (evt.card.name == "sha") {
							return "选项二";
						}
						if (get.type(evt.card, null, false) == "equip") {
							choices.remove("选项二");
						}
					}
					if (!choices.length) {
						return "cancel2";
					}
					return choices.randomGet();
				})
				.set("choiceList", choiceList);
			"step 1";
			if (result.control == "cancel2") {
				event.finish();
				return;
			}
			if (result.control == "选项一") {
				player.logSkill("dczhanmeng");
				game.log(player, "选择了", "#y" + result.control);
				player.addTempSkill("dczhanmeng_choice0");
				var card = get.cardPile2(card => {
					return !get.tag(card, "damage");
				});
				if (card) {
					player.gain(card, "gain2");
				}
				event.finish();
			} else if (result.control == "选项二") {
				player.logSkill("dczhanmeng");
				game.log(player, "选择了", "#y" + result.control);
				player.addTempSkill("dczhanmeng_choice1");
				trigger["dczhanmeng_" + player.playerid] = true;
				player.addSkill("dczhanmeng_delay");
				event.finish();
			} else {
				player.addTempSkill("dczhanmeng_choice2");
				player.chooseTarget("占梦：令一名其他角色弃置两张牌", lib.filter.notMe, true).set("ai", target => {
					var player = _status.event.player;
					var eff1 = get.effect(target, { name: "guohe_copy2" }, player, player) + 0.1;
					var eff2 = get.damageEffect(target, player, player, "fire") + 0.1;
					if (eff1 < 0 && eff2 < 0) {
						return -eff1 * eff2;
					}
					return eff1 * eff2;
				});
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("dczhanmeng", target);
				game.log(player, "选择了", "#y选项三");
				target.chooseToDiscard(2, "he", true);
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var cards = result.cards;
				var num = 0;
				for (var card of cards) {
					num += get.number(card, false);
				}
				if (num > 10) {
					player.line(target, "fire");
					target.damage("fire");
				}
			}
		},
		ai: { threaten: 8 },
		subSkill: {
			delay: {
				trigger: { global: ["useCardAfter", "phaseBeginStart"] },
				charlotte: true,
				forced: true,
				popup: false,
				silent: true,
				filter(event, player, name) {
					var history = player.actionHistory;
					if (history.length < 2) {
						return false;
					}
					var list = history[history.length - 2].useCard;
					if (name == "phaseBeginStart") {
						return !list.some(evt => evt["dczhanmeng_" + player.playerid]);
					}
					for (var evt of list) {
						if (
							evt["dczhanmeng_" + player.playerid] &&
							event.card.name == evt.card.name &&
							game
								.getGlobalHistory("useCard", evtx => {
									return evtx.card.name == event.card.name;
								})
								.indexOf(event) == 0
						) {
							return true;
						}
					}
					return false;
				},
				content() {
					if (event.triggername != "phaseBeginStart") {
						player.logSkill("dczhanmeng_delay");
						var card = get.cardPile2(card => {
							return get.tag(card, "damage");
						});
						if (card) {
							player.gain(card, "gain2");
						}
					} else {
						player.removeSkill("dczhanmeng_delay");
					}
				},
			},
			choice0: { charlotte: true },
			choice1: { charlotte: true },
			choice2: { charlotte: true },
		},
	},
	//程秉
	dcjingzao: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (3 + player.countMark("dcjingzao_add") - player.countMark("dcjingzao_ban") <= 0) {
				return false;
			}
			return game.hasPlayer(current => lib.skill.dcjingzao.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return player != target && !target.hasSkill("dcjingzao_temp");
		},
		content() {
			"step 0";
			target.addTempSkill("dcjingzao_temp");
			var cards = get.cards(3 + player.countMark("dcjingzao_add") - player.countMark("dcjingzao_ban"), true);
			event.cards = cards;
			game.log(player, "亮出了", event.cards);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, target, id, cards) {
					var str = get.translation(player) + "对" + (target == game.me ? "你" : get.translation(target)) + "发动了【经造】";
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				target,
				event.videoId,
				event.cards
			);
			game.addVideo("showCards", player, [get.translation(player) + "发动了【经造】", get.cardsInfo(event.cards)]);
			game.delay();
			"step 1";
			target
				.chooseToDiscard("he")
				.set("prompt", false)
				.set("filterCard", card => {
					var names = _status.event.getParent().cards.map(i => i.name);
					return names.includes(get.name(card));
				})
				.set("ai", card => {
					var target = _status.event.player,
						player = _status.event.getParent().player;
					var att = get.attitude(target, player),
						val = get.value(card);
					if (!lib.skill.dcjingzao.filter(null, player)) {
						if (att > 0) {
							return 0;
						}
						return 6 - val;
					} else {
						if (att > 0) {
							return 4 - val;
						}
						return 0;
					}
				});
			var update = function (id, source) {
				var dialog = get.idDialog(id);
				if (dialog) {
					var div = ui.create.div("", dialog.content, 1);
					var name = get.translation(source);
					div.innerHTML = "弃置一张满足条件的牌，然后" + name + "〖经造〗本回合亮出牌数+1；或点“取消”令" + name + "随机获得每种牌名的牌各一张，且〖经造〗本回合失效";
					ui.update();
				}
			};
			if (target == game.me) {
				update(event.videoId, player);
			} else if (target.isOnline()) {
				target.send(update, event.videoId, player);
			}
			"step 2";
			game.broadcastAll("closeDialog", event.videoId);
			if (result.bool) {
				player.addTempSkill("dcjingzao_add");
				player.addMark("dcjingzao_add", 1, false);
			} else {
				var cards = cards.randomSort(),
					cards2 = [];
				for (var card of cards) {
					if (!cards2.map(i => i.name).includes(card.name)) {
						cards2.push(card);
					}
				}
				if (cards2.length) {
					player.gain(cards2, "gain2");
				}
				player.addTempSkill("dcjingzao_ban");
				player.addMark("dcjingzao_ban", cards2.length, false);
			}
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
		subSkill: {
			add: { charlotte: true, onremove: true },
			ban: { charlotte: true, onremove: true },
			temp: { charlotte: true },
		},
	},
	dcenyu: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		forced: true,
		filter(event, player) {
			return (
				event.player != player &&
				game.hasPlayer2(current => {
					return current.hasHistory("useCard", evt => {
						return evt.card.name == event.card.name && evt != event.getParent() && evt.targets && evt.targets.includes(player);
					});
				}) &&
				(event.card.name == "sha" || get.type(event.card) == "trick")
			);
		},
		content() {
			trigger.getParent().excluded.add(player);
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (player === target) {
						return;
					}
					if (
						game.hasPlayer2(current => {
							return current.hasHistory("useCard", evt => evt.card.name == card.name && evt.targets && evt.targets.includes(target));
						}) &&
						(card.name == "sha" || get.type(card) == "trick")
					) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	//董贵人
	dclianzhi: {
		audio: 2,
		trigger: { player: "dying" },
		usable: 1,
		forced: true,
		locked: false,
		derivation: "dcshouze",
		group: ["dclianzhi_connect", "dclianzhi_reproach"],
		filter(event, player) {
			return player.getStorage("dclianzhi").filter(i => i && i.isIn()).length;
		},
		content() {
			player.recover();
			game.asyncDraw([player].concat(player.getStorage("dclianzhi").filter(i => i && i.isIn())).sortBySeat());
		},
		ai: {
			threaten: 0.6,
		},
		subSkill: {
			connect: {
				audio: "dclianzhi",
				trigger: {
					player: "enterGame",
					global: "phaseBefore",
				},
				forced: true,
				direct: true,
				filter(event, player) {
					return game.hasPlayer(current => current != player) && (event.name != "phase" || game.phaseNumber == 0);
				},
				content() {
					"step 0";
					player
						.chooseTarget("连枝：请选择一名其他角色", lib.translate.dclianzhi_info, true, (card, player, target) => {
							return target != player && !player.getStorage("dclianzhi").includes(target);
						})
						.set("ai", target => {
							var att = get.attitude(_status.event.player, target);
							if (att > 0) {
								return att + 1;
							}
							if (att == 0) {
								return Math.random();
							}
							return att;
						})
						.set("animate", false);
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("dclianzhi");
						player.markAuto("dclianzhi", [target]);
					}
				},
			},
			reproach: {
				audio: "dclianzhi",
				trigger: { global: "dieAfter" },
				filter(event, player) {
					return player.getStorage("dclianzhi").includes(event.player);
				},
				direct: true,
				content() {
					"step 0";
					var num = Math.max(1, player.countMark("dclingfang"));
					player
						.chooseTarget(get.prompt("dclianzhi"), "选择一名其他角色，你与其各获得〖受责〗，且其获得" + num + "枚“绞”标记", (card, player, target) => {
							return target != player;
						})
						.set("ai", target => -get.attitude(_status.event.player, target));
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("dclianzhi_reproach", target);
						player.addSkills("dcshouze");
						target.addSkills("dcshouze");
						target.addMark("dclingfang", Math.max(1, player.countMark("dclingfang")));
					}
				},
			},
		},
	},
	dclingfang: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
			global: "useCardAfter",
		},
		forced: true,
		filter(event, player) {
			if (event.name != "useCard") {
				return true;
			}
			if (get.color(event.card) != "black") {
				return false;
			}
			if (event.player == player) {
				return !event.targets || !event.targets.includes(player);
			}
			return event.targets && event.targets.includes(player);
		},
		content() {
			player.addMark("dclingfang", 1);
		},
		ai: {
			combo: "dcfengying",
		},
		marktext: "绞",
		intro: {
			name: "绞",
			name2: "绞",
			content: "mark",
		},
	},
	dcfengying: {
		audio: 2,
		enable: "chooseToUse",
		group: "dcfengying_record",
		locked: false,
		filter(event, player) {
			var mark = player.countMark("dclingfang");
			if (mark <= 0 || !player.hasCard(card => get.number(card) <= mark, "hs")) {
				return false;
			}
			var storage = player.getStorage("dcfengying");
			if (!storage.length) {
				return false;
			}
			var storage2 = player.getStorage("dcfengying_used");
			return storage.some(name => {
				return !storage2.includes(name) && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event);
			});
		},
		hiddenCard(player, name) {
			var list = player.getStorage("dcfengying");
			if (player.getStorage("dcfengying_used").includes(name)) {
				return false;
			}
			return list.includes(name) && player.hasCard(card => get.number(card) <= player.countMark("dclingfang"), "hs");
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of player.storage.dcfengying) {
					if (get.type(name) == "basic") {
						list.push(["基本", "", name]);
					}
					if (get.type(name) == "trick") {
						list.push(["锦囊", "", name]);
					}
				}
				return ui.create.dialog("风影", [list, "vcard"]);
			},
			filter(button, player) {
				var card = { name: button.link[2], storage: { dcfengying: true } };
				if (player.getStorage("dcfengying_used").includes(card.name)) {
					return false;
				}
				return _status.event.getParent().filterCard(get.autoViewAs(card, "unsure"), player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				if (player.countCards("hs", button.link[2]) > 0) {
					return 0;
				}
				if (button.link[2] == "wugu") {
					return;
				}
				var effect = player.getUseValue(button.link[2]);
				if (effect > 0) {
					return effect;
				}
				return 0;
			},
			backup(links, player) {
				return {
					filterCard(card, player, event) {
						return get.number(card) <= player.countMark("dclingfang");
					},
					audio: "dcfengying",
					selectCard: 1,
					popname: true,
					check(card) {
						return 6 - get.value(card) + get.number(card) / 15;
					},
					position: "hs",
					viewAs: {
						name: links[0][2],
						storage: { dcfengying: true },
					},
					log: false,
					precontent() {
						player.logSkill("dcfengying");
						player.addTempSkill("dcfengying_used");
						player.markAuto("dcfengying_used", [event.result.card.name]);
						event.getParent().addCount = false;
					},
				};
			},
			prompt(links, player) {
				return "将一张点数不大于" + get.strNumber(player.countMark("dclingfang")) + "的手牌当做" + get.translation(links[0][2]) + "使用（无距离和次数限制）";
			},
		},
		mod: {
			targetInRange(card) {
				if (card.storage?.dcfengying) {
					return true;
				}
			},
			cardUsable(card, player) {
				if (card.storage?.dcfengying) {
					return Infinity;
				}
			},
		},
		ai: {
			order: 4,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
			threaten: 2,
			combo: "dclingfang",
		},
		subSkill: {
			record: {
				trigger: { global: "phaseBegin" },
				filter(event, player) {
					return ui.discardPile.childNodes.length > 0;
				},
				forced: true,
				popup: false,
				content() {
					player.storage.dcfengying = [];
					for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
						var card = ui.discardPile.childNodes[i];
						if (get.color(card, false) != "black") {
							continue;
						}
						if (!["basic", "trick"].includes(get.type(card))) {
							continue;
						}
						player.storage.dcfengying.add(card.name);
					}
					player.storage.dcfengying.sort((a, b) => {
						return lib.inpile.indexOf(a) - lib.inpile.indexOf(b);
					});
				},
			},
			used: {
				charlotte: true,
				onremove: true,
				intro: { content: "已使用过$" },
			},
		},
	},
	dcshouze: {
		audio: true,
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		filter(event, player) {
			return player.countMark("dclingfang") > 0;
		},
		content() {
			"step 0";
			player.removeMark("dclingfang", 1);
			"step 1";
			var card = get.discardPile(card => get.color(card, false) == "black", "random");
			if (card) {
				player.gain(card, "gain2");
			}
			player.loseHp();
		},
		ai: {
			combo: "dclingfang",
			neg: true,
		},
	},
	//袁姬
	dcmengchi: {
		audio: "dcfangdu",
		trigger: { player: ["linkBefore", "damageEnd"] },
		forced: true,
		filter(event, player) {
			var num = player.getStat("gain");
			if (num && num > 0) {
				return false;
			}
			if (event.name == "link") {
				return !player.isLinked();
			}
			return !event.hasNature();
		},
		content() {
			if (trigger.name == "link") {
				trigger.cancel();
			} else {
				player.recover();
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.itemtype(player) != "player" || player._dcmengchi_aiChecking || target.getStat("gain")) {
						return;
					}
					if (card.name == "tiesuo" && !target.isLinked()) {
						return 0;
					}
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (!get.tag(card, "damage") || get.tag(card, "natureDamage")) {
						return;
					}
					if (target.hp <= 1) {
						return 0.75;
					}
					if (
						!target.hasSkillTag("filterDamage", null, {
							player: player,
							card: card,
						}) &&
						player.hasSkillTag("damageBonus", false, {
							target: target,
							card: card,
						})
					) {
						if (target.hp > 2) {
							return 0.5;
						}
						return 0.75;
					}
					if (get.attitude(player, target) > 0) {
						return [0, 0];
					}
					var sha = player.getCardUsable({ name: "sha" });
					player._dcmengchi_aiChecking = true;
					var num = player.countCards("h", function (card) {
						if (get.name(card) == "sha") {
							if (sha == 0) {
								return false;
							} else {
								sha--;
							}
						}
						return player.canUse(card, target) && get.effect(target, card, player, player) > 0;
					});
					delete player._dcmengchi_aiChecking;
					if (player.hasSkillTag("damage")) {
						num++;
					}
					if (num < 2) {
						return [0, 0];
					}
				},
			},
		},
		mod: {
			cardEnabled(card, player) {
				if (!player.getStat("gain")) {
					return false;
				}
			},
			cardSavable(card, player) {
				if (!player.getStat("gain")) {
					return false;
				}
			},
		},
	},
	dcfangdu: {
		audio: 2,
		trigger: {
			player: "damageEnd",
		},
		forced: true,
		filter(event, player) {
			if (player == _status.currentPhase) {
				return false;
			}
			return (
				(!event.hasNature() &&
					!player.hasHistory(
						"damage",
						evt => {
							return !evt.hasNature() && evt != event;
						},
						event
					)) ||
				(event.hasNature() &&
					!player.hasHistory(
						"damage",
						evt => {
							return evt.hasNature() && evt != event;
						},
						event
					) &&
					event.source &&
					event.source.isIn() &&
					event.source.countGainableCards(player, "h"))
			);
		},
		content() {
			"step 0";
			if (!trigger.hasNature()) {
				player.recover();
			} else {
				var cards = trigger.source.getGainableCards(player, "h");
				if (cards.length) {
					player.gain(cards.randomGet(), trigger.source, "giveAuto", "bySelf");
				}
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (player._dcfangdu_aiChecking || target == _status.currentPhase) {
						return;
					}
					if (!get.tag(card, "damage") || player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (_status.event.getParent("useCard", true) || _status.event.getParent("_wuxie", true)) {
						return;
					}
					if (!get.tag(card, "natureDamage")) {
						if (target.hasHistory("damage", evt => !evt.hasNature())) {
							return 1.5;
						} else if (
							target.hp <= 1 ||
							(player.hasSkillTag("damageBonus", false, {
								target: target,
								card: card,
							}) &&
								!target.hasSkillTag("filterDamage", null, {
									player: player,
									card: card,
								}))
						) {
							return 0.75;
						} else {
							if (get.attitude(player, target) > 0) {
								return [0, 0];
							}
							var sha = player.getCardUsable({ name: "sha" });
							player._dcfangdu_aiChecking = true;
							var num = player.countCards("h", function (card) {
								if (get.name(card) == "sha") {
									if (sha == 0) {
										return false;
									} else {
										sha--;
									}
								}
								return player.canUse(card, target) && get.effect(target, card, player, player) > 0;
							});
							delete player._dcfangdu_aiChecking;
							if (player.hasSkillTag("damage")) {
								num++;
							}
							if (num < 2) {
								return [0, 0];
							}
						}
					}
					if (get.tag(card, "natureDamage") && !target.hasHistory("damage", evt => evt.hasNature()) && player.countCards("he") > 1) {
						return [1, 1, 1, -1];
					}
				},
			},
		},
	},
	dcjiexing: {
		audio: 2,
		trigger: { player: ["recoverEnd", "damageEnd", "loseHpEnd"] },
		check(event, player) {
			var current = _status.currentPhase;
			if (!player.hasSkill("dcmengchi") || get.attitude(player, current) >= 0) {
				return true;
			}
			var num = player.getStat("gain");
			if (num && num > 0) {
				return true;
			}
			if (current.countCards("hs", card => current.canUse(card, player) && get.effect(player, card, current, player) < 0) >= 2) {
				return false;
			}
			return true;
		},
		frequent: "check",
		content() {
			player.draw().gaintag = ["dcjiexing"];
			player.addTempSkill("dcjiexing_add");
		},
		subSkill: {
			add: {
				charlotte: true,
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("dcjiexing")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("dcjiexing")) {
							return false;
						}
					},
				},
				onremove(player) {
					player.removeGaintag("dcjiexing");
				},
			},
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "recover")) {
						return [1, 1];
					}
					if (get.tag(card, "damage")) {
						var draw = 0.9;
						if (target.hasSkill("dcmengchi") && target.getStat("gain")) {
							draw = 1.8;
						}
						if (
							target.hp <= 1 ||
							(card.name == "sha" && player.hasSkill("jiu")) ||
							(get.itemtype(player) == "player" &&
								!target.hasSkillTag("filterDamage", null, {
									player: player,
									card: card,
								}) &&
								player.hasSkillTag("damageBonus", false, {
									target: target,
									card: card,
								}))
						) {
							if (target.hp > 2) {
								return [1, draw];
							}
							return;
						}
						return [1, draw];
					}
				},
			},
		},
	},
	//朱建平
	olddcxiangmian: {
		audio: "dcxiangmian",
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return !player.getStorage("olddcxiangmian").includes(event.player) && player != event.player;
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		content() {
			"step 0";
			player.judge(card => 2 / Math.sqrt(get.number(card, false))).set("judge2", result => result.bool);
			"step 1";
			player.markAuto("olddcxiangmian", [trigger.player]);
			trigger.player.addSkill("olddcxiangmian_countdown");
			if (!trigger.player.storage["olddcxiangmian_countdown"]) {
				trigger.player.storage["olddcxiangmian_countdown"] = [];
			}
			[player.playerid, result.suit, result.number].forEach(i => trigger.player.storage["olddcxiangmian_countdown"].push(i));
			trigger.player.markSkill("olddcxiangmian_countdown");
		},
		intro: { content: "已对$发动过技能" },
		ai: {
			expose: 0.3,
		},
		subSkill: {
			countdown: {
				trigger: { player: "useCardAfter" },
				mark: true,
				marktext: "噬",
				silent: true,
				forced: true,
				charlotte: true,
				intro: {
					markcount(storage) {
						if (storage) {
							var list = storage.filter((_, i) => i % 3 == 2);
							return Math.min.apply(null, list);
						}
					},
					content(storage, player) {
						var str = "使用";
						for (var i = 0; i < storage.length / 3; i++) {
							str += get.cnNumber(storage[i * 3 + 2]) + "张" + get.translation(storage[i * 3 + 1]) + "牌、";
						}
						str = str.slice(0, -1);
						str += "后，失去等同于体力值的体力";
						return str;
					},
				},
				filter(event, player) {
					if (!player.getStorage("olddcxiangmian_countdown").length) {
						return false;
					}
					return player
						.getStorage("olddcxiangmian_countdown")
						.filter((_, i) => i % 3 == 1)
						.includes(get.suit(event.card, player));
				},
				content() {
					"step 0";
					var storage = player.getStorage("olddcxiangmian_countdown");
					for (var i = 0; i < storage.length / 3; i++) {
						if (storage[i * 3 + 1] == get.suit(trigger.card, player)) {
							storage[i * 3 + 2]--;
						}
					}
					player.markSkill("olddcxiangmian_countdown");
					"step 1";
					var storage = player.getStorage("olddcxiangmian_countdown");
					for (var i = 0; i < storage.length / 3; i++) {
						if (storage[i * 3 + 2] <= 0) {
							if (!event.isMine() && !event.isOnline()) {
								game.delayx();
							}
							player.logSkill("olddcxiangmian_countdown");
							var target = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
							player.storage["olddcxiangmian_countdown"].splice(i * 3, 3);
							if (!player.getStorage("olddcxiangmian_countdown").length) {
								player.removeSkill("olddcxiangmian_countdown");
							}
							if (player.hp > 0) {
								player.loseHp(player.hp);
							}
							i--;
						}
					}
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (typeof card != "object") {
								return;
							}
							var storage = player.getStorage("olddcxiangmian_countdown");
							for (var i = 0; i < storage.length / 3; i++) {
								if (get.suit(card, player) == storage[i * 3 + 1] && storage[i * 3 + 2] == 1) {
									if (!player.canSave(player) && !get.tag(card, "save")) {
										return [0, -100, 0, 0];
									}
									return [1, -2 * player.hp, 1, 0];
								}
							}
						},
					},
				},
			},
		},
	},
	dcxiangmian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => lib.skill.dcxiangmian.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return !player.getStorage("dcxiangmian").includes(target) && player != target;
		},
		content() {
			"step 0";
			target.judge(card => -2 / Math.sqrt(get.number(card, false))).set("judge2", result => (result.bool === false ? true : false));
			"step 1";
			player.markAuto("dcxiangmian", [target]);
			target.addSkill("dcxiangmian_countdown");
			if (!target.storage["dcxiangmian_countdown"]) {
				target.storage["dcxiangmian_countdown"] = [];
			}
			[player.playerid, result.suit, result.number].forEach(i => target.storage["dcxiangmian_countdown"].push(i));
			target.markSkill("dcxiangmian_countdown");
		},
		intro: { content: "已对$发动过技能" },
		ai: {
			expose: 0.3,
			order: 10,
			result: { target: -5 },
		},
		subSkill: {
			countdown: {
				trigger: { player: "useCardAfter" },
				mark: true,
				marktext: "💀",
				silent: true,
				forced: true,
				charlotte: true,
				intro: {
					markcount(storage) {
						if (storage) {
							var list = storage.filter((_, i) => i % 3 == 2);
							return Math.min.apply(null, list);
						}
					},
					content(storage, player) {
						if (!storage) {
							return;
						}
						var str = "使用";
						str +=
							get.cnNumber(
								Math.min.apply(
									null,
									storage.filter((_, i) => i % 3 == 2)
								)
							) + "张牌后，或使用一张";
						for (var i = 0; i < storage.length / 3; i++) {
							str += get.translation(storage[i * 3 + 1]) + "、";
						}
						str = str.slice(0, -1);
						str += "后，失去等同于体力值的体力";
						return str;
					},
				},
				filter(event, player) {
					if (!player.getStorage("dcxiangmian_countdown").length) {
						return false;
					}
					//return (player.getStorage('dcxiangmian_countdown').filter((_,i)=>i%3==1)).includes(get.suit(event.card,player));
					return true;
				},
				content() {
					"step 0";
					var storage = player.getStorage("dcxiangmian_countdown");
					for (var i = 0; i < storage.length / 3; i++) {
						if (storage[i * 3 + 1] == get.suit(trigger.card, player)) {
							storage[i * 3 + 2] = 0;
						} else {
							storage[i * 3 + 2]--;
						}
					}
					player.markSkill("dcxiangmian_countdown");
					"step 1";
					var storage = player.getStorage("dcxiangmian_countdown");
					for (var i = 0; i < storage.length / 3; i++) {
						if (storage[i * 3 + 2] <= 0) {
							if (!event.isMine() && !event.isOnline()) {
								game.delayx();
							}
							player.logSkill("dcxiangmian_countdown");
							player.storage["dcxiangmian_countdown"].splice(i * 3, 3);
							if (!player.getStorage("dcxiangmian_countdown").length) {
								player.removeSkill("dcxiangmian_countdown");
							}
							if (player.hp > 0) {
								player.loseHp(player.hp);
							}
							i--;
						}
					}
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (typeof card != "object") {
								return;
							}
							var storage = player.getStorage("dcxiangmian_countdown");
							for (var i = 0; i < storage.length / 3; i++) {
								if (storage[i * 3 + 2] == 1 || get.suit(card, player) == storage[i * 3 + 1]) {
									if (!player.canSave(player) && !get.tag(card, "save")) {
										return [0, -100, 0, 0];
									}
									return [1, -2 * player.hp, 1, 0];
								}
							}
						},
					},
				},
			},
		},
	},
	dctianji: {
		audio: 2,
		trigger: { global: "cardsDiscardAfter" },
		forced: true,
		filter(event, player) {
			var evt = event.getParent().relatedEvent;
			return evt && evt.name == "judge" && event.cards.filterInD("d").length;
		},
		content() {
			var card = trigger.cards[0],
				cards = [],
				func = ["type2", "suit", "number"];
			for (var fn of func) {
				var cardx = get.cardPile2(cardxx => {
					if (get[fn](card, player) == get[fn](cardxx, player) && !cards.includes(cardxx)) {
						return true;
					}
				}, "random");
				if (cardx) {
					cards.push(cardx);
				}
			}
			/*if(cards.length&&!player.isMaxHandcard(true)) player.draw();
			else*/ if (cards.length) {
				player.gain(cards, "gain2");
			}
		},
	},
	//赵直
	dctongguan: {
		audio: 2,
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player) {
			return (
				event.player
					.getAllHistory()
					.filter(history => {
						return history.isMe && !history.isSkipped;
					})
					.indexOf(event.player.getHistory()) === 0 &&
				lib.skill.dctongguan.derivation.some(i => {
					return (player.getStorage("dctongguan")[i] || 0) < 2;
				})
			);
		},
		forced: true,
		locked: false,
		logTarget: "player",
		derivation: ["dctongguan_wuyong", "dctongguan_gangying", "dctongguan_duomou", "dctongguan_guojue", "dctongguan_renzhi"],
		content() {
			"step 0";
			var skills = lib.skill.dctongguan.derivation.slice();
			player
				.chooseControl(
					skills.filter(i => {
						return (player.getStorage("dctongguan")[i] || 0) < 2;
					})
				)
				.set(
					"choiceList",
					skills.map(i => {
						var info = "";
						switch (player.getStorage("dctongguan")[i]) {
							case 1:
								info = ' style="opacity:0.65;"';
								break;
							case 2:
								info = ' style="text-decoration:line-through; opacity:0.3;"';
								break;
						}
						return '<div class="skill">「' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "」</div>" + "<div" + info + ">" + get.skillInfoTranslation(i, player) + "（已选过" + get.cnNumber(player.getStorage("dctongguan")[i] || 0) + "次）" + "</div>";
					})
				)
				.set("displayIndex", false)
				.set("prompt", "统观：为" + get.translation(trigger.player) + "选择一个属性")
				.set("ai", function () {
					var controls = _status.event.controls,
						target = _status.event.getTrigger().player;
					var str = target
						.getSkills(null, false, false)
						.map(i => get.skillInfoTranslation(i))
						.join("");
					var choices = [];
					if (controls.includes("dctongguan_wuyong") && /你对\S{1,15}造成\S{1,10}伤害/.test(str)) {
						choices.push("dctongguan_wuyong");
					}
					if (controls.includes("dctongguan_gangying") && /回复\S{1,5}体力/.test(str) && _status.event.player.getFriends().length) {
						choices.push("dctongguan_gangying");
					}
					if (controls.includes("dctongguan_duomou") && /你(可|可以)?摸\S{1,3}张牌/.test(str)) {
						choices.push("dctongguan_duomou");
					}
					if (controls.includes("dctongguan_guojue") && /(当【过河拆桥】使用|((弃置|获得)\S{1,5}其他角色\S{1,7}牌|))/.test(str)) {
						choices.push("dctongguan_guojue");
					}
					if (controls.includes("dctongguan_renzhi") && /交给\S{0,5}其他角色/.test(str) && _status.event.player.getFriends().length) {
						choices.push("dctongguan_renzhi");
					}
					if (choices.length) {
						return choices.randomGet();
					}
					return _status.event.controls.randomGet();
				});
			"step 1";
			if (result.control) {
				var skill = result.control;
				player.localMarkSkill(skill, trigger.player, event);
				// game.log(player,'为',trigger.player,'选择了','#g「'+get.translation(skill)+'」','属性');
				game.log(player, "为", trigger.player, "选择了", "#g一个属性");
				// player.popup(skill);
				trigger.player.addSkill(skill);
				if (!player.storage.dctongguan) {
					player.storage.dctongguan = {};
				}
				if (!player.storage.dctongguan[skill]) {
					player.storage.dctongguan[skill] = 0;
				}
				player.storage.dctongguan[skill]++;
			}
		},
		localMark(skill, player) {
			var name = skill,
				info;
			if (player.marks[name]) {
				player.updateMarks();
			}
			if (lib.skill[name]) {
				info = lib.skill[name].intro;
			}
			if (!info) {
				return;
			}
			if (player.marks[name]) {
				player.marks[name].info = info;
			} else {
				player.marks[name] = player.mark(name, info);
			}
			player.updateMarks();
		},
		ai: {
			combo: "dcmengjie",
		},
		subSkill: {
			forceFinish: { charlotte: true },
			wuyong: {
				marktext: "勇",
				intro: {
					name: "武勇",
					content: "属性目标：造成伤害",
				},
				charlotte: true,
				silent: true,
				nopop: true,
			},
			gangying: {
				marktext: "刚",
				intro: {
					name: "刚硬",
					content: "属性目标：回复体力，或手牌数大于体力值",
				},
				charlotte: true,
				silent: true,
				nopop: true,
			},
			duomou: {
				marktext: "谋",
				intro: {
					name: "多谋",
					content: "属性目标：于摸牌阶段外摸牌",
				},
				charlotte: true,
				silent: true,
				nopop: true,
			},
			guojue: {
				marktext: "决",
				intro: {
					name: "果决",
					content: "属性目标：弃置或获得其他角色牌",
				},
				charlotte: true,
				silent: true,
				nopop: true,
			},
			renzhi: {
				marktext: "仁",
				intro: {
					name: "仁智",
					content: "属性目标：交给其他角色牌",
				},
				charlotte: true,
				silent: true,
				nopop: true,
			},
		},
	},
	dcmengjie: {
		audio: 2,
		trigger: {
			global: "phaseEnd",
		},
		forced: true,
		direct: true,
		locked: false,
		filter(event, player) {
			var target = event.player;
			if (
				(target.hasSkill("dctongguan_gangying") &&
					(target.countCards("h") > target.hp ||
						game.getGlobalHistory("changeHp", function (evt) {
							return evt.player == target && (evt.getParent().name == "recover" || target.countCards("h") > target.hp);
						}).length > 0)) ||
				(target.hasSkill("dctongguan_wuyong") && target.getHistory("sourceDamage").length) ||
				(target.hasSkill("dctongguan_duomou") && target.getHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent("phaseDraw").name != "phaseDraw").length)
			) {
				return true;
			}
			var guojue = false,
				renzhi = false;
			game.countPlayer2(current => {
				if (current == target) {
					return false;
				}
				if (
					!guojue &&
					current.hasHistory("lose", evt => {
						if (evt.type == "discard") {
							if ((evt.discarder || evt.getParent(2).player) != target) {
								return false;
							}
							if (!evt.getl(current).cards2.length) {
								return false;
							}
							return true;
						} else if (evt.type == "gain") {
							var evtx = evt.getParent();
							if (evtx.giver || evtx.getParent().name == "gift") {
								return false;
							}
							var cards = evtx.getg(target);
							if (!cards.length) {
								return false;
							}
							var cards2 = evtx.getl(current).cards2;
							for (var card of cards2) {
								if (cards.includes(card)) {
									return true;
								}
							}
						}
						return false;
					})
				) {
					guojue = true;
				}
				if (
					!renzhi &&
					current.hasHistory("gain", evt => {
						if (evt.giver != target || evt.getParent().name == "gift") {
							return false;
						}
						return evt.cards.length;
					})
				) {
					renzhi = true;
				}
			});
			return (target.hasSkill("dctongguan_guojue") && guojue) || (target.hasSkill("dctongguan_renzhi") && renzhi);
		},
		rules: [
			target => target.getHistory("sourceDamage").length,
			target =>
				target.countCards("h") > target.hp ||
				game.getGlobalHistory("changeHp", function (evt) {
					return evt.player == target && evt.getParent().name == "recover";
				}).length > 0 ||
				target.countCards("h") > target.hp,
			target => target.getHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent("phaseDraw").name != "phaseDraw").length,
			(target, bool) => bool,
			(target, bool) => bool,
		],
		content() {
			"step 0";
			event.nowProperty = 0;
			var target = trigger.player;
			var guojue = false,
				renzhi = false;
			game.countPlayer2(current => {
				if (current == target) {
					return false;
				}
				if (
					!guojue &&
					current.hasHistory("lose", evt => {
						if (evt.type == "discard") {
							if ((evt.discarder || evt.getParent(2).player) != target) {
								return false;
							}
							if (!evt.getl(current).cards2.length) {
								return false;
							}
							return true;
						} else if (evt.type == "gain") {
							var evtx = evt.getParent();
							if (evtx.giver || evtx.getParent().name == "gift") {
								return false;
							}
							var cards = evtx.getg(target);
							if (!cards.length) {
								return false;
							}
							var cards2 = evtx.getl(current).cards2;
							for (var card of cards2) {
								if (cards.includes(card)) {
									return true;
								}
							}
						}
						return false;
					})
				) {
					guojue = true;
				}
				if (
					!renzhi &&
					current.hasHistory("gain", evt => {
						if (evt.giver != target || evt.getParent().name == "gift") {
							return false;
						}
						return evt.cards.length;
					})
				) {
					renzhi = true;
				}
			});
			event.guojue = guojue;
			event.renzhi = renzhi;
			"step 1";
			if (event.nowProperty >= 5) {
				event.finish();
				return;
			}
			var skills = lib.skill.dctongguan.derivation;
			if (trigger.player.hasSkill(skills[event.nowProperty]) && lib.skill.dcmengjie.rules[event.nowProperty](trigger.player, event[event.nowProperty == 3 ? "guojue" : "renzhi"])) {
				event.goto(2 + event.nowProperty * 2);
			} else {
				event.redo();
			}
			event.nowProperty++;
			"step 2";
			if (!game.hasPlayer(current => current != player)) {
				event._result = { bool: false };
			} else {
				player.chooseTarget("梦解：对一名其他角色造成1点伤害", true, lib.filter.notMe).set("ai", target => get.damageEffect(target, player, player));
			}
			"step 3";
			if (result.bool) {
				player.logSkill("dcmengjie", result.targets[0]);
				result.targets[0].damage();
			}
			game.delayx();
			event.goto(1);
			"step 4";
			if (game.hasPlayer(target => target != player && target.isDamaged())) {
				player
					.chooseTarget("梦解：令一名角色回复1点体力", function (card, player, target) {
						return target.isDamaged();
					})
					.set("ai", target => get.recoverEffect(target, player, player));
			} else {
				event._result = { bool: false };
			}
			"step 5";
			if (result.bool) {
				player.logSkill("dcmengjie", result.targets[0]);
				result.targets[0].recover();
			}
			game.delayx();
			event.goto(1);
			"step 6";
			player.logSkill("dcmengjie");
			player.draw(2);
			"step 7";
			game.delayx();
			event.goto(1);
			"step 8";
			if (game.hasPlayer(target => target.countDiscardableCards(player, "hej"))) {
				player
					.chooseTarget("梦解：弃置一名角色区域内至多两张牌", true, (card, player, target) => {
						return target.countDiscardableCards(player, "hej");
					})
					.set("ai", target => get.effect(target, { name: "guohe" }, player, player));
			} else {
				event._result = { bool: false };
			}
			"step 9";
			if (result.bool) {
				player.logSkill("dcmengjie", result.targets[0]);
				player.discardPlayerCard(result.targets[0], true, "hej", [1, 2]);
			}
			game.delayx();
			event.goto(1);
			"step 10";
			if (!game.hasPlayer(current => current != player)) {
				event._result = { bool: false };
			} else {
				player
					.chooseTarget("梦解：令一名其他角色将手牌补至上限", true, (card, player, target) => {
						return target != player;
					})
					.set("ai", target => {
						var att = get.attitude(_status.event.player, target);
						if (target.hasSkillTag("nogain")) {
							att /= 6;
						}
						if (att > 2) {
							return Math.min(5, target.maxHp) - target.countCards("h");
						}
						return att / 3;
					});
			}
			"step 11";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dcmengjie", target);
				var num = Math.min(5, target.maxHp - target.countCards("h"));
				target.draw(num);
			}
			game.delayx();
			event.goto(1);
		},
		ai: {
			combo: "dctongguan",
		},
	},
	//刘晔
	dcpoyuan: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: ["phaseBegin", "enterGame"],
		},
		filter(event, player, name) {
			if (name == "phaseBefore" && game.phaseNumber > 0) {
				return false;
			}
			if (player.getEquip("pilitoushiche")) {
				return game.hasPlayer(function (current) {
					return current != player && current.countDiscardableCards(player, "he") > 0;
				});
			} else {
				return player.hasEquipableSlot(5);
			}
		},
		direct: true,
		content() {
			"step 0";
			if (player.getEquip("pilitoushiche")) {
				event.goto(2);
				player
					.chooseTarget(get.prompt("dcpoyuan"), "弃置一名其他角色的至多两张牌", function (card, player, target) {
						return target != player && target.countDiscardableCards(player, "he") > 0;
					})
					.set("ai", function (target) {
						var player = _status.event.player,
							cards = target.getDiscardableCards(player, "he");
						var att = get.attitude(player, target);
						if (att < 0 && target.hasSkillTag("noe")) {
							att /= 2;
						}
						var zheng = [],
							fu = [];
						for (var i of cards) {
							var val = get.value(i, target);
							if (val > 0) {
								zheng.push(i);
							} else {
								fu.push(i);
							}
						}
						zheng.sort((a, b) => get.value(b, target) - get.value(a, target));
						fu.sort((a, b) => get.value(b, target) - get.value(a, target));
						zheng = zheng.slice(0, 2);
						fu = fu.slice(0, 2);
						var eff1 = 0,
							eff2 = 0;
						for (var i of zheng) {
							eff1 += get.value(i, target);
						}
						for (var i of fu) {
							if (get.position(i) == "e") {
								eff2 += 1 - get.value(i, target);
							}
						}
						return -att * Math.max(eff1, eff2);
					});
			} else {
				player.chooseBool(get.prompt("dcpoyuan"), "装备一张【霹雳投石车】").set("ai", function () {
					return true;
				});
			}
			"step 1";
			if (result.bool) {
				player.logSkill("dcpoyuan");
				var card = game.createCard("pilitoushiche", "diamond", 9);
				player.$gain2(card);
				game.delayx();
				player.equip(card);
			}
			event.finish();
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dcpoyuan", target);
				player.discardPlayerCard(target, true, "he", [1, 2]);
			}
		},
	},
	dchuace: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return event.dchuace && event.dchuace.length > 0 && player.countCards("hs") > 0;
		},
		onChooseToUse(event) {
			if (game.online || event.dchuace) {
				return;
			}
			var list = lib.inpile.filter(function (i) {
				return get.type(i) == "trick" && lib.filter.filterCard({ name: i }, event.player, event);
			});
			if (!list.length) {
				event.set("dchuace", list);
				return;
			}
			var history = _status.globalHistory;
			var stop = false;
			for (var i = history.length - 1; i >= 0; i--) {
				var evt = history[i];
				if (!stop) {
					if (evt.isRound) {
						stop = true;
					}
					continue;
				} else {
					for (var j of evt.useCard) {
						list.remove(j.card.name);
					}
					if (evt.isRound) {
						break;
					}
				}
			}
			event.set("dchuace", list);
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("画策", [event.dchuace, "vcard"], "hidden");
			},
			check(button) {
				var player = _status.event.player,
					card = { name: button.link[2] };
				return player.getUseValue(card);
			},
			backup(links, player) {
				return {
					audio: "dchuace",
					viewAs: { name: links[0][2] },
					ai1: card => 7 - get.value(card),
					filterCard: true,
					position: "hs",
					popname: true,
				};
			},
			prompt(links, player) {
				return "将一张手牌当做【" + get.translation(links[0][2]) + "】使用";
			},
		},
		ai: {
			order: 6,
			result: { player: 1 },
		},
		subSkill: { backup: {} },
	},
	pilitoushiche: {
		trigger: { player: ["useCard", "respond"] },
		forced: true,
		equipSkill: true,
		filter(event, player) {
			return get.type(event.card) == "basic";
		},
		content() {
			if (player == _status.currentPhase) {
				trigger.baseDamage++;
			} else {
				player.draw();
			}
		},
		mod: {
			targetInRange(card, player) {
				if (get.type(card) == "basic" && player == _status.currentPhase) {
					return true;
				}
			},
		},
	},
	//路易
	dcyaoyi: {
		audio: 2,
		getZhuanhuanji(player, bool) {
			var skills = player.getSkills(null, false, false).filter(function (i) {
				return get.is.zhuanhuanji(i, player);
			});
			if (!bool) {
				return skills;
			}
			if (!skills.length) {
				return "none";
			}
			var state = lib.skill.dcyaoyi.getState(player, skills[0]);
			for (var i = 1; i < skills.length; i++) {
				if (lib.skill.dcyaoyi.getState(player, skills[i]) != state) {
					return "none";
				}
			}
			return state;
		},
		getState(player, skill) {
			var info = get.info(skill),
				zhuanhuan = info.zhuanhuanji;
			if (zhuanhuan && zhuanhuan == "number") {
				return player.countMark(skill) % 2 == 1;
			}
			return Boolean(player.storage[skill]);
		},
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		forced: true,
		filter(event, player) {
			if (event.name == "phase" && game.phaseNumber != 0) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return lib.skill.dcyaoyi.getZhuanhuanji(current).length == 0;
			});
		},
		logTarget() {
			return game.filterPlayer(function (current) {
				return lib.skill.dcyaoyi.getZhuanhuanji(current).length == 0;
			});
		},
		content() {
			var targets = lib.skill.dcyaoyi.logTarget().sortBySeat();
			for (var target of targets) {
				target.addSkills("dcshoutan");
			}
			game.delayx();
		},
		derivation: "dcshoutan",
		global: "dcyaoyi_blocker",
		subSkill: {
			blocker: {
				mod: {
					targetEnabled(card, player, target) {
						if (
							player == target ||
							!game.hasPlayer(function (current) {
								return current.hasSkill("dcyaoyi");
							})
						) {
							return;
						}
						var state1 = lib.skill.dcyaoyi.getZhuanhuanji(player, true);
						if (state1 == "none") {
							return;
						}
						if (lib.skill.dcyaoyi.getZhuanhuanji(target, true) == state1) {
							return false;
						}
					},
					cardSavable(card, player, target) {
						if (
							player == target ||
							!game.hasPlayer(function (current) {
								return current.hasSkill("dcyaoyi");
							})
						) {
							return;
						}
						var state1 = lib.skill.dcyaoyi.getZhuanhuanji(player, true);
						if (state1 == "none") {
							return;
						}
						if (lib.skill.dcyaoyi.getZhuanhuanji(target, true) == state1) {
							return false;
						}
					},
				},
			},
		},
	},
	dcshoutan: {
		audio: 2,
		enable: "phaseUse",
		position: "h",
		filter(event, player) {
			if (player.hasSkill("dcyaoyi")) {
				return !player.hasSkill("dcshoutan_blocker", null, null, false);
			}
			return player.countCards("h") > 0 && !player.getStat("skill").dcshoutan;
		},
		selectCard() {
			if (_status.event.player.hasSkill("dcyaoyi")) {
				return [0, 1];
			}
			return [1, 1];
		},
		filterCard(card, player) {
			if (player.hasSkill("dcyaoyi")) {
				return false;
			}
			var color = get.color(card, player);
			if (player.storage.dcshoutan) {
				return color == "black";
			}
			return color != "black";
		},
		prompt() {
			var player = _status.event.player;
			if (player.hasSkill("dcyaoyi")) {
				return "点击“确认”来变更转换技状态";
			}
			if (player.storage.dcshoutan) {
				return "弃置一张黑色手牌，变更转换技状态";
			}
			return "弃置一张非黑色手牌，变更转换技状态";
		},
		check(card) {
			return 11 - get.value(card);
		},
		content() {
			player.changeZhuanhuanji("dcshoutan");
			player.addTempSkill("dcshoutan_blocker", {
				player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
			});
		},
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			content(storage, player) {
				if (storage) {
					return "转换技。出牌阶段限一次，你可以弃置一张黑色手牌。";
				}
				return "转换技。出牌阶段限一次，你可以弃置一张不为黑色的手牌。";
			},
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					var base = 0;
					if (ui.selected.cards.length) {
						base = get.value(ui.selected.cards[0]);
					}
					var status = player.storage.dcshoutan;
					var cards = player.getCards("hs", function (card) {
						return !ui.selected.cards.includes(card);
					});
					for (var card of cards) {
						var val1 = player.getUseValue(card, null, true);
						player.storage.dcshoutan = !status;
						var val2 = 0;
						try {
							val2 = player.getUseValue(card, null, true);
						} catch (e) {
							player.storage.dcshoutan = status;
						}
						player.storage.dcshoutan = status;
						if (val2 > val1) {
							base -= val2 - val1;
						}
					}
					if (base < 0) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: { blocker: { charlotte: true } },
	},
	dcfuxue: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		filter(event, player) {
			return player.hp > 0 && ui.discardPile.childNodes.length > 0;
		},
		content() {
			"step 0";
			var cards = Array.from(ui.discardPile.childNodes);
			var gains = cards.slice(0);
			var history = game.getAllGlobalHistory("cardMove", function (evt) {
				if (evt.name == "lose") {
					return evt.position == ui.discardPile;
				}
				return evt.name == "cardsDiscard";
			});
			for (var i = history.length - 1; i >= 0; i--) {
				var evt = history[i];
				var cards2 = evt.cards.filter(function (card) {
					return cards.includes(card);
				});
				if (cards2.length) {
					if (lib.skill.dcfuxue.isUse(evt)) {
						gains.removeArray(cards2);
					}
					cards.removeArray(cards2);
				}
				if (!cards.length) {
					break;
				}
			}
			if (gains.length) {
				var num = player.hp;
				player.chooseButton(["复学：选择获得" + (num > 0 ? "至多" : "") + get.cnNumber(num) + "张牌", gains], [1, num]).set("ai", function (button) {
					var player = _status.event.player,
						card = button.link;
					var getn = function (card) {
						return player.countCards("h", card.name) + ui.selected.buttons.filter(button => button.link.name == card.name).length;
					};
					var val = player.getUseValue(card);
					if (card.name == "tao" && getn(card) >= player.getDamagedHp()) {
						return 0;
					}
					if (card.name == "sha" && getn(card) >= player.getCardUsable("sha")) {
						return 0;
					}
					return val;
				});
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				player.logSkill("dcfuxue");
				player.gain(result.links, "gain2").gaintag.add("dcfuxue");
			}
		},
		isUse(event) {
			if (event.name != "cardsDiscard") {
				return false;
			}
			var evtx = event.getParent();
			if (evtx.name != "orderingDiscard") {
				return false;
			}
			var evt2 = evtx.relatedEvent || evtx.getParent();
			return evt2.name == "phaseJudge" || evt2.name == "useCard";
		},
		group: "dcfuxue_draw",
		subSkill: {
			draw: {
				audio: "dcfuxue",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				locked: false,
				mod: {
					aiOrder(player, card, num) {
						if (get.itemtype(card) == "card" && card.hasGaintag("dcfuxue")) {
							return num + 0.5;
						}
					},
				},
				filter(event, player) {
					return (
						player.hp > 0 &&
						!player.hasCard(function (card) {
							return card.hasGaintag("dcfuxue");
						}, "h")
					);
				},
				content() {
					player.draw(player.hp);
				},
			},
		},
	},
	//丁尚涴
	dcfengyan: {
		audio: 2,
		enable: "phaseUse",
		usable: 2,
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("讽言：请选择一项", "hidden");
				dialog.add([
					[
						["gain", "令一名体力值不大于你的其他角色交给你一张手牌"],
						["sha", "视为对一名手牌数不大于你的其他角色使用一张【杀】"],
					],
					"textbutton",
				]);
				return dialog;
			},
			filter(button, player) {
				return !player.getStorage("dcfengyan_used").includes(button.link);
			},
			check(button) {
				var player = _status.event.player;
				if (
					button.link == "gain" &&
					game.hasPlayer(function (current) {
						return lib.skill.dcfengyan_gain.filterTarget(null, player, current) && get.effect(current, "dcfengyan_gain", player, player) > 0;
					})
				) {
					return 4;
				}
				if (
					button.link == "sha" &&
					game.hasPlayer(function (current) {
						return lib.skill.dcfengyan_sha.filterTarget(null, player, current) && get.effect(current, "dcfengyan_sha", player, player) > 0;
					})
				) {
					return 4;
				}
				return 2;
			},
			backup(links) {
				return get.copy(lib.skill["dcfengyan_" + links[0]]);
			},
			prompt(links) {
				if (links[0] == "gain") {
					return "令一名体力值不大于你的其他角色交给你一张手牌";
				}
				return "视为对一名手牌数不大于你的其他角色使用【杀】";
			},
		},
		ai: {
			order: 10,
			threaten: 1.7,
			result: { player: 1 },
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			backup: { audio: "dcfengyan" },
			gain: {
				audio: "dcfengyan",
				filterTarget(card, player, target) {
					return target != player && target.hp <= player.hp && target.countCards("h") > 0;
				},
				filterCard: () => false,
				selectCard: -1,
				content() {
					"step 0";
					player.addTempSkill("dcfengyan_used", "phaseUseAfter");
					player.markAuto("dcfengyan_used", "gain");
					target.chooseCard("h", true, "交给" + get.translation(player) + "一张牌");
					"step 1";
					if (result.bool) {
						target.give(result.cards, player);
					}
				},
				ai: {
					tag: {
						loseCard: 1,
						gain: 1,
					},
					result: {
						player: 0.1,
						target: -1,
					},
				},
			},
			sha: {
				audio: "dcfengyan",
				filterTarget(card, player, target) {
					return target != player && target.countCards("h") <= player.countCards("h") && player.canUse("sha", target, false);
				},
				filterCard: () => false,
				selectCard: -1,
				content() {
					player.addTempSkill("dcfengyan_used", "phaseUseAfter");
					player.markAuto("dcfengyan_used", "sha");
					player.useCard(
						{
							name: "sha",
							isCard: true,
						},
						target,
						false
					);
				},
				ai: {
					result: {
						player(player, target) {
							return get.effect(
								target,
								{
									name: "sha",
									isCard: true,
								},
								player,
								player
							);
						},
					},
				},
			},
		},
	},
	dcfudao: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && game.hasPlayer(current => current != player);
		},
		content() {
			"step 0";
			player.chooseTarget(true, lib.filter.notMe, "抚悼：请选择一名“继子”", "你或“继子”每回合首次使用牌指定对方为目标后各摸两张牌；杀死你或“继子”的角色称为“决裂”。你或“继子”对“决裂”造成的伤害+1。“决裂”对你使用牌后，其本回合内不能再使用牌。").set("ai", function (target) {
				return get.attitude(_status.event.player, target);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dcfudao", target);
				game.log(target, "成为了", player, "的继子");
				player.addSkill("dcfudao_effect");
				target.addSkill("dcfudao_effect");
				player.markAuto("dcfudao_effect", [target]);
				target.markAuto("dcfudao_effect", [player]);
			}
		},
		group: "dcfudao_refuse",
		subSkill: {
			effect: {
				trigger: { player: "useCardToPlayered" },
				forced: true,
				charlotte: true,
				usable: 1,
				filter(event, player) {
					var target = event.target;
					if (player == target || !target.isIn()) {
						return false;
					}
					return player.getStorage("dcfudao_effect").includes(target);
				},
				logTarget: "target",
				content() {
					"step 0";
					var list = [player, trigger.target];
					list.sortBySeat();
					game.asyncDraw(list, 2);
					"step 1";
					game.delayx();
				},
				marktext: "继",
				intro: { content: "已和$成为继母子关系" },
				group: ["dcfudao_revenge", "dcfudao_deadmark"],
			},
			deadmark: {
				trigger: { player: "dieBegin" },
				forced: true,
				popup: false,
				lastDo: true,
				silent: true,
				filter(event, player) {
					return get.itemtype(event.source) == "player";
				},
				content() {
					trigger.source.markAuto("dcfudao_deadmark", [player]);
				},
				marktext: "裂",
				intro: {
					name: "决裂",
					content: "你害死了$！",
				},
			},
			revenge: {
				trigger: { source: "damageBegin1" },
				forced: true,
				filter(event, player) {
					var storage1 = event.player.getStorage("dcfudao_deadmark"),
						storage2 = player.getStorage("dcfudao_effect");
					for (var i of storage1) {
						if (storage2.includes(i)) {
							return true;
						}
					}
					return false;
				},
				content() {
					trigger.num++;
				},
				logTarget: "player",
			},
			refuse: {
				trigger: { target: "useCardToTargeted" },
				forced: true,
				filter(event, player) {
					var storage1 = event.player.getStorage("dcfudao_deadmark"),
						storage2 = player.getStorage("dcfudao_effect");
					return storage1.some(i => storage2.includes(i)) && get.color(event.card) == "black";
				},
				content() {
					trigger.player.addTempSkill("dcfudao_blocker");
				},
				logTarget: "player",
			},
			blocker: {
				charlotte: true,
				mod: {
					cardEnabled: () => false,
					cardSavable: () => false,
				},
			},
		},
	},
	//全惠解
	dchuishu: {
		audio: 2,
		getList(player) {
			if (!player.storage.dchuishu) {
				return [3, 1, 2];
			}
			return player.storage.dchuishu.slice(0);
		},
		trigger: { player: "phaseDrawEnd" },
		content() {
			"step 0";
			var list = lib.skill.dchuishu.getList(player);
			event.list = list;
			player.draw(list[0]);
			"step 1";
			player.addTempSkill("dchuishu_effect");
			player.chooseToDiscard("h", true, event.list[1]);
		},
		onremove: true,
		mark: true,
		intro: {
			markcount(storage, player) {
				var list = lib.skill.dchuishu.getList(player);
				return Math.max.apply(Math, list);
			},
			content(storage, player) {
				var list = lib.skill.dchuishu.getList(player);
				return "摸牌阶段结束时，你可以摸[" + list[0] + "]张牌。若如此做：你弃置[" + list[1] + "]张手牌，且当你于本回合内弃置第[" + list[2] + "]+1张牌后，你从弃牌堆中获得[" + list[2] + "]张非基本牌。";
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				audio: "dchuishu",
				trigger: {
					player: "loseAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					var num = lib.skill.dchuishu.getList(player)[2];
					if (typeof num != "number") {
						return false;
					}
					if (event.type != "discard" || event.getlx === false) {
						return false;
					}
					var evt = event.getl(player);
					if (evt.cards2.length == 0) {
						return false;
					}
					var prev = 0,
						goon = true;
					player.getHistory("lose", function (evt) {
						if (!goon || evt.type != "discard") {
							return false;
						}
						prev += evt.cards2.length;
						if (evt == event || event.getParent() == event) {
							goon = false;
							return false;
						}
					});
					return prev > num;
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					var num = lib.skill.dchuishu.getList(player)[2];
					var cards = [];
					for (var i = 0; i < num; i++) {
						var card = get.discardPile(function (card) {
							return get.type(card) != "basic" && !cards.includes(card);
						}, "random");
						if (card) {
							cards.push(card);
						} else {
							break;
						}
					}
					if (cards.length) {
						player.gain(cards, "gain2");
					}
				},
			},
		},
	},
	dcyishu: {
		audio: 2,
		trigger: {
			player: ["loseAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			var evt = event.getl(player);
			if (!evt || !evt.cards2.length) {
				return false;
			}
			return !player.isPhaseUsing() && player.hasSkill("dchuishu", null, null, false);
		},
		content() {
			"step 0";
			var list = lib.skill.dchuishu.getList(player);
			var min = list[0],
				max = list[0];
			for (var i of list) {
				if (i < min) {
					min = i;
				}
				if (i > max) {
					max = i;
				}
			}
			var exps = ["摸牌数[", "弃牌数[", "目标牌数["];
			var choices_min = [],
				choices_max = [];
			for (var i = 0; i < list.length; i++) {
				if (list[i] == min) {
					choices_min.push(exps[i] + min + "]");
				}
				if (list[i] == max) {
					choices_max.push(exps[i] + max + "]");
				}
			}
			if (choices_min.length == 1 && choices_max.length == 1) {
				event._result = { bool: true, min: choices_min[0], max: choices_max[0] };
			} else {
				if (player.isUnderControl()) {
					game.swapPlayerAuto(player);
				}
				var switchToAuto = function () {
					_status.imchoosing = false;
					event._result = {
						bool: true,
						min: choices_min[0],
						max: choices_max[0],
					};
					if (event.dialog) {
						event.dialog.close();
					}
					if (event.control) {
						event.control.close();
					}
				};
				var chooseButton = function (player, min, max) {
					var event = _status.event;
					player = player || event.player;
					var list = lib.skill.dchuishu.getList(player);
					if (!event._result) {
						event._result = {};
					}
					var dialog = ui.create.dialog("###易数：请选择更改的数值###令〖慧淑〗的一个最小数值+2并令一个最大数值-1", "forcebutton", "hidden");
					event.dialog = dialog;
					dialog.addText("最小值+2");
					var table = document.createElement("div");
					table.classList.add("add-setting");
					table.style.margin = "0";
					table.style.width = "100%";
					table.style.position = "relative";
					for (var i = 0; i < min.length; i++) {
						var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
						td.link = min[i];
						table.appendChild(td);
						td.innerHTML = "<span>" + min[i] + "</span>";
						td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
							if (_status.dragged) {
								return;
							}
							if (_status.justdragged) {
								return;
							}
							_status.tempNoButton = true;
							setTimeout(function () {
								_status.tempNoButton = false;
							}, 500);
							var link = this.link;
							var current = this.parentNode.querySelector(".bluebg");
							if (current) {
								current.classList.remove("bluebg");
							}
							this.classList.add("bluebg");
							event._result.min = link;
						});
					}
					dialog.content.appendChild(table);
					dialog.addText("最大值-1");
					var table2 = document.createElement("div");
					table2.classList.add("add-setting");
					table2.style.margin = "0";
					table2.style.width = "100%";
					table2.style.position = "relative";
					for (var i = 0; i < max.length; i++) {
						var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
						td.link = max[i];
						table2.appendChild(td);
						td.innerHTML = "<span>" + max[i] + "</span>";
						td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
							if (_status.dragged) {
								return;
							}
							if (_status.justdragged) {
								return;
							}
							_status.tempNoButton = true;
							setTimeout(function () {
								_status.tempNoButton = false;
							}, 500);
							var link = this.link;
							var current = this.parentNode.querySelector(".bluebg");
							if (current) {
								current.classList.remove("bluebg");
							}
							this.classList.add("bluebg");
							event._result.max = link;
						});
					}
					dialog.content.appendChild(table2);
					dialog.add("　　");
					event.dialog.open();
					event.switchToAuto = function () {
						event._result = {
							bool: true,
							min: min[0],
							max: max[0],
						};
						event.dialog.close();
						event.control.close();
						game.resume();
						_status.imchoosing = false;
					};
					event.control = ui.create.control("ok", function (link) {
						var result = event._result;
						if (!result.min || !result.max) {
							return;
						}
						result.bool = true;
						event.dialog.close();
						event.control.close();
						game.resume();
						_status.imchoosing = false;
					});
					for (var i = 0; i < event.dialog.buttons.length; i++) {
						event.dialog.buttons[i].classList.add("selectable");
					}
					game.pause();
					game.countChoose();
				};
				if (event.isMine()) {
					chooseButton(player, choices_min, choices_max);
				} else if (event.isOnline()) {
					event.player.send(chooseButton, event.player, choices_min, choices_max);
					event.player.wait();
					game.pause();
				} else {
					switchToAuto();
				}
			}
			"step 1";
			var map = event.result || result;
			if (map.bool) {
				var min = map.min,
					max = map.max;
				min = min.slice(0, min.indexOf("["));
				max = max.slice(0, max.indexOf("["));
				var exps = ["摸牌数", "弃牌数", "目标牌数"];
				var list = lib.skill.dchuishu.getList(player);
				list[exps.indexOf(min)] += 2;
				list[exps.indexOf(max)]--;
				game.log(player, "令", "#g【慧淑】", "中的", "#y" + min, "+2");
				game.log(player, "令", "#g【慧淑】", "中的", "#y" + max, "-1");
				player.storage.dchuishu = list;
			} else {
				event.finish();
			}
			"step 2";
			player.markSkill("dchuishu");
			game.delayx();
		},
		ai: { combo: "dchuishu" },
	},
	dcligong: {
		audio: 2,
		juexingji: true,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			if (!player.hasSkill("dchuishu")) {
				return false;
			}
			var list = lib.skill.dchuishu.getList(player);
			for (var i of list) {
				if (i >= 5) {
					return true;
				}
			}
			return false;
		},
		skillAnimation: true,
		animationColor: "wood",
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.gainMaxHp();
			player.recover();
			"step 1";
			player.removeSkills("dcyishu");
			"step 2";
			var list;
			if (_status.characterlist) {
				list = [];
				for (var i = 0; i < _status.characterlist.length; i++) {
					var name = _status.characterlist[i];
					if (lib.character[name][1] == "wu" && (lib.character[name][0] == "female" || lib.character[name][0] == "double")) {
						list.push(name);
					}
				}
			} else if (_status.connectMode) {
				list = get.charactersOL(function (i) {
					return lib.character[i][1] != "wu" || (lib.character[i][0] != "female" && lib.character[i][0] != "double");
				});
			} else {
				list = get.gainableCharacters(function (info) {
					return info[1] == "wu" && (info[0] == "female" || info[0] == "double");
				});
			}
			var players = game.players.concat(game.dead);
			for (var i = 0; i < players.length; i++) {
				list.remove(players[i].name);
				list.remove(players[i].name1);
				list.remove(players[i].name2);
			}
			list = list.randomGets(4);
			var skills = [];
			for (var i of list) {
				skills.addArray(
					(lib.character[i][3] || []).filter(function (skill) {
						var info = get.info(skill);
						return info && !info.charlotte;
					})
				);
			}
			if (!list.length || !skills.length) {
				event.result = {
					bool: false,
					skills: [],
				};
				return;
			}
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				_status.imchoosing = false;
				event._result = {
					bool: true,
					skills: skills.randomGets(2),
				};
				if (event.dialog) {
					event.dialog.close();
				}
				if (event.control) {
					event.control.close();
				}
			};
			var chooseButton = function (list, skills) {
				var event = _status.event;
				if (!event._result) {
					event._result = {};
				}
				event._result.skills = [];
				var rSkill = event._result.skills;
				var dialog = ui.create.dialog("请选择获得至多两个技能", [list, "character"], "hidden");
				event.dialog = dialog;
				var table = document.createElement("div");
				table.classList.add("add-setting");
				table.style.margin = "0";
				table.style.width = "100%";
				table.style.position = "relative";
				for (var i = 0; i < skills.length; i++) {
					var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
					td.link = skills[i];
					table.appendChild(td);
					td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
					td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
						if (_status.dragged) {
							return;
						}
						if (_status.justdragged) {
							return;
						}
						_status.tempNoButton = true;
						setTimeout(function () {
							_status.tempNoButton = false;
						}, 500);
						var link = this.link;
						if (!this.classList.contains("bluebg")) {
							if (rSkill.length >= 2) {
								return;
							}
							rSkill.add(link);
							this.classList.add("bluebg");
						} else {
							this.classList.remove("bluebg");
							rSkill.remove(link);
						}
					});
				}
				dialog.content.appendChild(table);
				dialog.add("　　");
				dialog.open();

				event.switchToAuto = function () {
					event.dialog.close();
					event.control.close();
					game.resume();
					_status.imchoosing = false;
				};
				event.control = ui.create.control("ok", function (link) {
					event.dialog.close();
					event.control.close();
					game.resume();
					_status.imchoosing = false;
				});
				for (var i = 0; i < event.dialog.buttons.length; i++) {
					event.dialog.buttons[i].classList.add("selectable");
				}
				game.pause();
				game.countChoose();
			};
			if (event.isMine()) {
				chooseButton(list, skills);
			} else if (event.isOnline()) {
				event.player.send(chooseButton, list, skills);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 3";
			var map = event.result || result;
			if (map.skills && map.skills.length) {
				//player.removeSkill('dchuishu');
				//for(var i of map.skills) player.addSkillLog(i);
				player.changeSkills(map.skills, ["dchuishu"]);
				player.markAuto("zhuSkill_dcligong", map.skills);
			} else {
				player.draw(3);
			}
		},
		ai: {
			combo: "dchuishu",
		},
	},
	//杜夔
	dcfanyin: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return ui.cardPile.childNodes.length > 0;
		},
		frequent: true,
		locked: false,
		content() {
			"step 0";
			var card = false;
			if (typeof event.num != "number") {
				var num = false;
				for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
					var cardx = ui.cardPile.childNodes[i],
						numc = get.number(cardx, false);
					if (!num || numc < num) {
						num = numc;
						card = cardx;
						if (num == 1) {
							break;
						}
					}
				}
				event.num = num;
			} else {
				card = get.cardPile2(function (card) {
					return get.number(card, false) == event.num;
				});
			}
			if (!card) {
				event.finish();
			} else {
				event.card = card;
				game.cardsGotoOrdering(card);
				player.showCards(card, get.translation(player) + "发动了【泛音】");
			}
			"step 1";
			if (!player.hasUseTarget(card, false)) {
				event._result = { index: 1 };
			} else {
				player
					.chooseControl()
					.set("choiceList", ["使用" + get.translation(card) + "（无距离限制）", "令本回合使用的下一张牌可以多选择一个目标"])
					.set("ai", function () {
						var player = _status.event.player,
							card = _status.event.getParent().card;
						if (player.hasValueTarget(card, false)) {
							return 0;
						}
						return 1;
					});
			}
			"step 2";
			if (result.index == 0) {
				var cardx = get.autoViewAs(card);
				cardx.storage.dcfanyin = true;
				player.chooseUseTarget(cardx, [card], true, false);
			} else {
				player.addTempSkill("dcfanyin_effect");
				player.addMark("dcfanyin_effect", 1, false);
			}
			event.num *= 2;
			if (event.num <= 13) {
				event.goto(0);
			}
		},
		mod: {
			targetInRange(card) {
				if (card.storage && card.storage.dcfanyin) {
					return true;
				}
			},
		},
		subSkill: {
			effect: {
				audio: "dcfanyin",
				trigger: { player: "useCard2" },
				forced: true,
				charlotte: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					var type = get.type(event.card, null, false);
					return type == "basic" || type == "trick";
				},
				content() {
					"step 0";
					var num = player.countMark("dcfanyin_effect");
					player.removeSkill("dcfanyin_effect");
					var filter = function (event, player) {
						var card = event.card,
							info = get.info(card);
						if (info.allowMultiple == false) {
							return false;
						}
						if (event.targets && !info.multitarget) {
							if (
								game.hasPlayer(function (current) {
									return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && lib.filter.targetInRange(card, player, current);
								})
							) {
								return true;
							}
						}
						return false;
					};
					if (!filter(trigger, player)) {
						event.finish();
					} else {
						var prompt = "为" + get.translation(trigger.card) + "增加至多" + get.cnNumber(num) + "个目标？";
						trigger.player
							.chooseTarget(get.prompt("dcfanyin_effect"), prompt, [1, num], function (card, player, target) {
								var player = _status.event.player;
								return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target) && lib.filter.targetInRange(_status.event.card, player, target);
							})
							.set("ai", function (target) {
								var trigger = _status.event.getTrigger();
								var player = _status.event.player;
								return get.effect(target, trigger.card, player, player);
							})
							.set("card", trigger.card)
							.set("targets", trigger.targets);
					}
					"step 1";
					if (result.bool) {
						if (!event.isMine() && !event.isOnline()) {
							game.delayx();
						}
					} else {
						event.finish();
					}
					"step 2";
					player.logSkill("dcfanyin_effect", result.targets);
					game.log(result.targets, "也成为了", trigger.card, "的目标");
					trigger.targets.addArray(result.targets);
				},
				intro: { content: "使用下一张牌选择目标后，可以增加#个目标" },
			},
		},
	},
	dcpeiqi: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.canMoveCard();
		},
		check(event, player) {
			return player.canMoveCard(true);
		},
		content() {
			"step 0";
			player.moveCard(true);
			"step 1";
			if (result.bool && player.canMoveCard()) {
				var goon = true,
					players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					for (var j = i + 1; j < players.length; j++) {
						if (!players[i].inRange(players[j]) || !players[i].inRangeOf(players[j])) {
							goon = false;
							break;
						}
					}
					if (!goon) {
						break;
					}
				}
				if (goon) {
					player.moveCard();
				}
			}
		},
	},
	//张奋和大风车
	dcwanglu: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		content() {
			if (!player.hasEquipableSlot(5) || player.getEquip("dagongche")) {
				const evt = trigger.getParent("phase", true, true);
				if (evt?.phaseList) {
					evt.phaseList.splice(evt.num + 1, 0, `phaseUse|${event.name}`);
				}
			} else {
				var card = game.createCard("dagongche", "spade", 9);
				player.$gain2(card);
				game.delayx();
				player.equip(card);
			}
		},
		broadcast(player) {
			var card = player.getEquip("dagongche");
			if (card) {
				game.broadcast(
					function (card, storage) {
						card.storage = storage;
					},
					card,
					card.storage
				);
			}
		},
	},
	dcxianzhu: {
		audio: 2,
		trigger: { source: "damageSource" },
		direct: true,
		filter(event, player) {
			if (!event.card || event.card.name != "sha") {
				return false;
			}
			var card = player.getEquip("dagongche");
			if (!card) {
				return false;
			}
			var num = 0;
			for (var i = 1; i <= 3; i++) {
				var key = "大攻车选项" + get.cnNumber(i, true);
				if (card.storage[key]) {
					num += card.storage[key];
				}
			}
			return num < 5;
		},
		content() {
			"step 0";
			var choiceList = ["令【杀】无距离限制且无视防具", "令【杀】的可选目标数+1", "令后续的弃牌数量+1"];
			var list = [];
			var card = player.getEquip("dagongche");
			for (var i = 1; i <= 3; i++) {
				var key = "大攻车选项" + get.cnNumber(i, true);
				var num = card.storage[key];
				if (i == 1) {
					if (!num) {
						list.push("选项一");
					} else {
						choiceList[0] = '<span style="opacity:0.5; ">' + choiceList[0] + "（已强化）</span>";
					}
				} else {
					list.push("选项" + get.cnNumber(i, true));
					if (num) {
						choiceList[i - 1] += "（已强化" + num + "次）";
					}
				}
			}
			player
				.chooseControl(list, "cancel2")
				.set("prompt", "是否发动【陷筑】强化【大攻车】？")
				.set("choiceList", choiceList)
				.set("ai", function () {
					var player = _status.event.player,
						controls = _status.event.controls.slice(0);
					var getval = function (choice) {
						var card = player.getEquip("dagongche");
						if (choice == "选项一") {
							card.storage.大攻车选项一 = 1;
							var goon = false;
							if (
								game.hasPlayer(function (current) {
									var eff1 = 0,
										eff2 = 0;
									var cardx = { name: "sha", isCard: true };
									if (player.canUse(cardx, current)) {
										eff1 = get.effect(current, cardx, player, player);
									}
									cardx.storage = { dagongche: true };
									if (player.canUse(cardx, current)) {
										eff2 = get.effect(current, cardx, player, player);
									}
									return eff2 > eff1;
								})
							) {
								goon = true;
							}
							delete card.storage.大攻车选项一;
							if (goon) {
								return 5;
							}
							return 0;
						} else if (choice == "选项二") {
							var num = 1;
							if (card.storage.大攻车选项二) {
								num += card.storage.大攻车选项二;
							}
							var cardx = { name: "sha", isCard: true };
							if (
								game.countPlayer(function (current) {
									return player.canUse(cardx, current) && get.effect(current, cardx, player, player) > 0;
								}) > num
							) {
								return 2;
							}
						} else if (choice == "选项三") {
							return 1;
						}
						return 0;
					};
					var eff = 0,
						current = "cancel2";
					for (var i of controls) {
						var effx = getval(i);
						if (effx > eff) {
							eff = effx;
							current = i;
						}
					}
					return current;
				});
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("dcxianzhu");
				var card = player.getEquip("dagongche"),
					key = "大攻车" + result.control;
				if (!card.storage[key]) {
					card.storage[key] = 0;
				}
				card.storage[key]++;
				lib.skill.dcwanglu.broadcast(player);
			}
		},
		ai: {
			combo: "dcwanglu",
		},
	},
	dcchaixie: {
		audio: 2,
		trigger: {
			player: ["loseAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			var evt = event.getl(player);
			if (!evt || !evt.es || !evt.es.length) {
				return false;
			}
			for (var card of evt.es) {
				if (card.name == "dagongche") {
					for (var i = 1; i <= 3; i++) {
						if (card.storage["大攻车选项" + get.cnNumber(i, true)]) {
							return true;
						}
					}
				}
			}
			return false;
		},
		content() {
			var num = 0;
			var evt = trigger.getl(player);
			for (var card of evt.es) {
				if (card.name == "dagongche") {
					for (var i = 1; i <= 3; i++) {
						var key = "大攻车选项" + get.cnNumber(i, true);
						if (card.storage[key]) {
							num += card.storage[key];
						}
					}
				}
			}
			player.draw(num);
		},
		ai: {
			combo: "dcwanglu",
		},
	},
	dagongche_skill: {
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			var cardx = {
				name: "sha",
				isCard: true,
				storage: { dagongche: true },
			};
			return player.hasUseTarget(cardx);
		},
		equipSkill: true,
		content() {
			var card = {
				name: "sha",
				isCard: true,
				storage: { dagongche: true },
			};
			lib.skill.dcwanglu.broadcast(player);
			player.chooseUseTarget(card, "大攻车：是否视为使用【杀】？", false).logSkill = "dagongche_skill";
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.storage && card.storage.dagongche) {
					var cardx = player.getEquip("dagongche");
					if (cardx && cardx.storage.大攻车选项一) {
						return true;
					}
				}
			},
			selectTarget(card, player, range) {
				if (card.storage && card.storage.dagongche && range[1] != -1) {
					var cardx = player.getEquip("dagongche");
					if (cardx && cardx.storage.大攻车选项二) {
						range[1] += cardx.storage.大攻车选项二;
					}
				}
			},
			canBeDiscarded(card) {
				if (card.name == "dagongche" && get.position(card) == "e") {
					for (var i = 1; i <= 3; i++) {
						if (card.storage["大攻车选项" + get.cnNumber(i, true)]) {
							return;
						}
					}
					return false;
				}
			},
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (!arg || !arg.card || !arg.card.storage || !arg.card.storage.dagongche) {
					return false;
				}
				var card = player.getEquip("dagongche");
				if (!card || !card.storage.大攻车选项一) {
					return false;
				}
			},
		},
		group: "dagongche_skill_discard",
		subSkill: {
			discard: {
				trigger: { source: "damageSource" },
				equipSkill: true,
				forced: true,
				filter(event, player) {
					if (!event.card || !event.card.storage || !event.card.storage.dagongche) {
						return false;
					}
					if (event.getParent().type != "card") {
						return false;
					}
					return event.player.hasCard(function (card) {
						return lib.filter.canBeDiscarded(card, event.player, player);
					}, "he");
				},
				logTarget: "player",
				content() {
					var num = 1;
					var cardx = player.getEquip("dagongche");
					if (cardx && cardx.storage.大攻车选项三) {
						num += cardx.storage.大攻车选项三;
					}
					player.discardPlayerCard(trigger.player, true, num, "he");
				},
			},
		},
	},
	//刘徽
	dcgeyuan: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
		},
		forced: true,
		filter(event, player) {
			var cards = event.getd();
			for (var i of cards) {
				if (lib.skill.dcgeyuan.filterNumber(player, get.number(i, false))) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			event.cards = trigger.getd();
			"step 1";
			var card = false;
			for (var i of cards) {
				if (lib.skill.dcgeyuan.filterNumber(player, get.number(i, false))) {
					card = i;
					cards.remove(card);
					break;
				}
			}
			if (card) {
				var number = get.number(card, false);
				game.log(player, "将", "#y" + get.strNumber(number), "记录为", "#g“圆环之弧”");
				player.markAuto("dcgeyuan_homura", [number]);
				player.markSkill("dcgeyuan");
				if (player.getStorage("dcgeyuan").length > player.getStorage("dcgeyuan_homura").length) {
					if (cards.length > 0) {
						event.redo();
					} else {
						event.finish();
					}
				} else if (player.storage.dcgusuan) {
					event.goto(5);
				}
			} else {
				event.finish();
			}
			"step 2";
			var list = player.getStorage("dcgeyuan_homura");
			var num1 = list[0],
				num2 = list[list.length - 1];
			event.cards2 = [];
			var lose_list = [],
				players = game.filterPlayer();
			for (var current of players) {
				var cards = current.getCards("ej", function (card) {
					var num = get.number(card);
					return num == num1 || num == num2;
				});
				if (cards.length > 0) {
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
			}
			"step 3";
			var list = player.getStorage("dcgeyuan_homura");
			var num1 = list[0],
				num2 = list[list.length - 1];
			var cards = event.cards2;
			for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
				var card = ui.cardPile.childNodes[i];
				var number = get.number(card, false);
				if (number == num1 || number == num2) {
					cards.push(card);
				}
			}
			if (cards.length > 0) {
				if (event.lose_list) {
					game.delayx();
				}
				player.gain(cards, "gain2");
			}
			"step 4";
			var list = player.getStorage("dcgeyuan_homura");
			var num1 = list[0],
				num2 = list[list.length - 1];
			player.storage.dcgeyuan_homura = [];
			game.log(player, "清空了", "#g“圆环之弧”");
			player.markSkill("dcgeyuan");
			if (player.getStorage("dcgeyuan").length > 3) {
				player.unmarkAuto("dcgeyuan", [num1, num2]);
				game.log(player, "从", "#g“圆环之理”", "中移除了", "#y" + get.strNumber(num1), "和", "#y" + get.strNumber(num2));
			}
			event.finish();
			"step 5";
			player.chooseTarget("割圆：选择至多三名角色", "第一名角色摸三张牌，第二名角色弃置四张牌，第三名角色将所有手牌与牌堆底的牌交换", true, [1, 3]);
			"step 6";
			if (result.bool) {
				var targets = result.targets;
				event.targets = targets;
				player.line(targets);
				targets[0].draw(3);
				if (targets.length < 2) {
					event.goto(4);
				}
			} else {
				event.goto(4);
			}
			"step 7";
			if (targets[1].countCards("he") > 0) {
				targets[1].chooseToDiscard("he", true, 4);
			}
			if (targets.length < 3) {
				event.goto(4);
			}
			"step 8";
			var target = targets[2];
			var cards = get.bottomCards(5);
			game.cardsGotoOrdering(cards);
			var hs = target.getCards("h");
			if (hs.length > 0) {
				target.lose(hs, ui.cardPile);
			}
			target.gain(cards, "draw");
			event.goto(4);
		},
		group: "dcgeyuan_kyubey",
		filterNumber(player, num) {
			var list1 = player.getStorage("dcgeyuan");
			var list2 = player.getStorage("dcgeyuan_homura");
			if (!list1.includes(num)) {
				return false;
			}
			if (!list2.length) {
				return true;
			}
			if (list2.includes(num)) {
				return false;
			}
			var madoka = list1.indexOf(num);
			for (var i of list2) {
				var homura = list1.indexOf(i);
				var dist = Math.abs(madoka - homura);
				if (dist == 1 || dist == list1.length - 1) {
					return true;
				}
			}
			return false;
		},
		subSkill: {
			kyubey: {
				audio: "dcgeyuan",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				filter(event, player) {
					return (event.name != "phase" || game.phaseNumber == 0) && !player.storage.dcgusuan;
				},
				content() {
					var list = [];
					for (var i = 1; i <= 13; i++) {
						list.push(i);
					}
					list.randomSort();
					player.storage.dcgeyuan = list;
					player.markSkill("dcgeyuan");
					var str = "#y";
					for (var i = 0; i < 13; i++) {
						str += get.strNumber(list[i]);
						if (i != 12) {
							str += ",";
						}
					}
					game.log(player, "将", "#y“圆环之理”", "赋值为", str);
				},
			},
		},
		intro: {
			name: "圆环之理",
			markcount(storage, player) {
				if (!player.storage.dcgeyuan || !player.getStorage("dcgeyuan_homura").length) {
					return 0;
				}
				var list = player.storage.dcgeyuan.filter(i => lib.skill.dcgeyuan.filterNumber(player, i));
				if (!list.length) {
					return 0;
				}
				list = list.map(num => {
					if (num == 10) {
						return "X";
					}
					return get.strNumber(num);
				});
				return list.reduce((str, num) => {
					return str + num;
				}, "");
			},
			mark(dialog, storage, player) {
				dialog.content.style["overflow-x"] = "visible";
				var list = storage;
				if (!storage || !storage.length) {
					return "（圆环之理尚不存在）";
				}
				var list2 = player.getStorage("dcgeyuan_homura");
				var core = document.createElement("div");
				core.style.width = "0";
				var centerX = -15,
					centerY = 80,
					radius = 80;
				var radian = (Math.PI * 2) / list.length;
				var fulllist = ["Ａ", "２", "３", "４", "５", "６", "７", "８", "９", "10", "Ｊ", "Ｑ", "Ｋ"];
				for (var i = 0; i < list.length; i++) {
					var td = document.createElement("div");
					var color = "";
					if (list2[0] == list[i]) {
						color = ' class="yellowtext"';
					} else if (list2.includes(list[i])) {
						color = ' class="greentext"';
					}
					td.innerHTML = "<span" + color + ">[" + fulllist[list[i] - 1] + "]</span>";
					td.style.position = "absolute";
					core.appendChild(td);
					td.style.left = centerX + radius * Math.sin(radian * i) + "px";
					td.style.top = centerY - radius * Math.cos(radian * i) + "px";
				}
				dialog.content.appendChild(core);
			},
		},
	},
	dcjieshu: {
		audio: 2,
		trigger: { player: ["useCard", "respond"] },
		forced: true,
		filter(event, player) {
			var num = get.number(event.card, false);
			if (typeof num != "number") {
				return false;
			}
			return lib.skill.dcgeyuan.filterNumber(player, num);
		},
		content() {
			player.draw();
		},
		mod: {
			ignoredHandcard(card, player) {
				if (!player.getStorage("dcgeyuan").includes(get.number(card))) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && !player.getStorage("dcgeyuan").includes(get.number(card))) {
					return false;
				}
			},
		},
		ai: {
			combo: "dcgeyuan",
		},
	},
	dcgusuan: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "soil",
		filter(event, player) {
			return player.getStorage("dcgeyuan").length == 3;
		},
		content() {
			player.awakenSkill(event.name);
			player.storage.dcgusuan = true;
			player.loseMaxHp();
		},
		ai: { combo: "dcgeyuan" },
		derivation: "dcgeyuan_magica",
	},
	//王昶
	dckaiji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (player.maxHp <= 0) {
				return false;
			}
			if (!player.storage.dckaiji) {
				return true;
			}
			return player.hasCard(card => lib.filter.cardDiscardable(card, player, "phaseUse"), "he");
		},
		filterCard(card, player) {
			if (!player.storage.dckaiji) {
				return false;
			}
			return true;
		},
		position: "he",
		selectCard() {
			var player = _status.event.player;
			return player.storage.dckaiji ? [1, player.maxHp] : -1;
		},
		check(card) {
			var player = _status.event.player;
			if (!player.hasSkill("dcpingxi")) {
				if (ui.selected.cards.length) {
					return 0;
				}
				if (player.needsToDiscard()) {
					return 12 - get.value(card);
				}
				return 2 * player.hp + 1.5 - get.value(card);
			}
			var num = lib.skill.dcpingxi.getNum() + ui.selected.cards.length;
			if (
				num <
				game.countPlayer(function (current) {
					if (current == player || current.countCards("he") == 0) {
						return false;
					}
					return get.effect(current, { name: "guohe_copy2" }, player, player) + get.effect(current, { name: "sha" }, player, player) > 0;
				})
			) {
				if (
					get.position(card) == "h" &&
					player.needsToDiscard(0, (i, player) => {
						return !ui.selected.cards.includes(i) && !player.canIgnoreHandcard(i);
					})
				) {
					return 7 + 1 / Math.max(1, get.value(card));
				}
				return 7 - get.value(card);
			}
			return 0;
		},
		content() {
			player.changeZhuanhuanji("dckaiji");
			if (!cards.length) {
				player.draw(Math.min(player.maxHp, 5));
			}
		},
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			content: storage => "转换技。出牌阶段限一次，你可以" + (storage ? "弃置至多X张牌" : "摸X张牌") + "（X为你的体力上限且至多为5）。",
		},
		ai: {
			threaten: 1.6,
			order(item, player) {
				if (player.storage.dckaiji) {
					return 0.1;
				}
				return 8;
			},
			result: { player: 1 },
		},
	},
	dcpingxi: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		getNum() {
			var num = 0;
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.name == "lose" && evt.type == "discard") {
					num += evt.cards2.length;
				}
			});
			return num;
		},
		filter(event, player) {
			return (
				lib.skill.dcpingxi.getNum() > 0 &&
				game.hasPlayer(function (current) {
					return current != player;
				})
			);
		},
		content() {
			"step 0";
			var num = lib.skill.dcpingxi.getNum();
			player
				.chooseTarget(
					[1, num],
					function (card, player, target) {
						return target != player;
					},
					get.prompt("dcpingxi"),
					"选择至多" + get.cnNumber(num) + "名其他角色。弃置这些角色的各一张牌，然后视为对这些角色使用一张【杀】"
				)
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, { name: "guohe_copy2" }, player, player) + get.effect(target, { name: "sha" }, player, player);
				});
			"step 1";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				event.targets = targets;
				player.logSkill("dcpingxi", targets);
				event.num = 0;
			} else {
				event.finish();
			}
			"step 2";
			var target = targets[num];
			if (
				target.hasCard(function (card) {
					return lib.filter.canBeDiscarded(card, player, target);
				}, "he")
			) {
				player.discardPlayerCard(target, "he", true);
			}
			event.num++;
			if (event.num < targets.length) {
				event.redo();
			}
			"step 3";
			var targetsx = targets.filter(function (target) {
				return player.canUse("sha", target, false);
			});
			if (targetsx.length > 0) {
				player.useCard(
					{
						name: "sha",
						isCard: true,
					},
					targetsx
				);
			}
		},
	},
	//赵昂
	dczhongjie: {
		audio: 2,
		round: 1,
		trigger: { global: "dying" },
		logTarget: "player",
		filter(event, player) {
			return event.player.hp < 1 && event.reason && event.reason.name == "loseHp";
		},
		check(event, player) {
			return get.attitude(player, event.player) > 2;
		},
		content() {
			trigger.player.recover();
			trigger.player.draw();
		},
		ai: {
			combo: "dcsushou",
		},
	},
	dcsushou: {
		audio: 2,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return player.hp > 0 && event.player.isMaxHandcard(true);
		},
		logTarget: "player",
		check(event, player) {
			var num = player.hp;
			if (player.hasSkill("dczhongjie") && (player.storage.dczhongjie_roundcount || 0) < game.roundNumber) {
				num++;
			}
			return num > 1;
		},
		content() {
			"step 0";
			player.loseHp();
			event.target = trigger.player;
			"step 1";
			var num = player.getDamagedHp();
			if (num > 0) {
				player.draw(num);
			}
			if (player == target) {
				event.finish();
			}
			"step 2";
			var ts = target.getCards("h");
			if (ts.length < 2) {
				event.finish();
			} else {
				var hs = player.getCards("h");
				ts = ts.randomGets(Math.floor(ts.length / 2));
				if (!hs.length) {
					player.viewCards(get.translation(target) + "的部分手牌", ts);
					event.finish();
					return;
				}
				var next = player.chooseToMove("夙守：交换至多" + get.cnNumber(Math.min(hs.length, ts.length, player.getDamagedHp())) + "张牌");
				next.set("list", [
					[get.translation(target) + "的部分手牌", ts, "dcsushou_tag"],
					["你的手牌", hs],
				]);
				next.set("filterMove", function (from, to, moved) {
					if (typeof to == "number") {
						return false;
					}
					var player = _status.event.player;
					var hs = player.getCards("h");
					var changed = hs.filter(function (card) {
						return !moved[1].includes(card);
					});
					var changed2 = moved[1].filter(function (card) {
						return !hs.includes(card);
					});
					if (changed.length < player.getDamagedHp()) {
						return true;
					}
					var pos1 = moved[0].includes(from.link) ? 0 : 1,
						pos2 = moved[0].includes(to.link) ? 0 : 1;
					if (pos1 == pos2) {
						return true;
					}
					if (pos1 == 0) {
						if (changed.includes(from.link)) {
							return true;
						}
						return changed2.includes(to.link);
					}
					if (changed2.includes(from.link)) {
						return true;
					}
					return changed.includes(to.link);
				});
				next.set("max", Math.min(hs.length, ts.length, player.getDamagedHp()));
				next.set("processAI", function (list) {
					if (_status.event.max) {
						let gain = list[0][1]
								.sort((a, b) => {
									return player.getUseValue(b, null, true) - player.getUseValue(a, null, true);
								})
								.slice(0, _status.event.max),
							give = list[1][1]
								.sort((a, b) => {
									return get.value(a, player) - get.value(b, player);
								})
								.slice(0, _status.event.max);
						for (let i of gain) {
							if (get.value(i, player) < get.value(give[0], player)) {
								continue;
							}
							let j = give.shift();
							list[0][1].remove(i);
							list[0][1].push(j);
							list[1][1].remove(j);
							list[1][1].push(i);
							if (!give.length) {
								break;
							}
						}
					}
					return [list[0][1], list[1][1]];
				});
			}
			"step 3";
			var moved = result.moved;
			var hs = player.getCards("h"),
				ts = target.getCards("h");
			var cards1 = [],
				cards2 = [];
			for (var i of result.moved[0]) {
				if (!ts.includes(i)) {
					cards1.push(i);
				}
			}
			for (var i of result.moved[1]) {
				if (!hs.includes(i)) {
					cards2.push(i);
				}
			}
			if (cards1.length) {
				player.swapHandcards(target, cards1, cards2);
			}
		},
	},
	//蓝曹华
	caiyi: {
		audio: 2,
		zhuanhuanji: true,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		onremove(player) {
			delete player.storage.caiyi;
			delete player.storage.caiyi_info;
		},
		filter(event, player) {
			if (player.storage.caiyi_info) {
				if (player.storage.caiyi_info[player.storage.caiyi ? 1 : 0].length >= 4) {
					return false;
				}
			}
			return true;
		},
		choices: [
			["回复X点体力", "摸X张牌", "复原武将牌", "随机执行一个已经移除过的选项"],
			["受到X点伤害", "弃置X张牌", "翻面并横置", "随机执行一个已经移除过的选项"],
		],
		filterx: [
			[player => player.isDamaged(), () => true, player => player.isTurnedOver() || player.isLinked(), () => true],
			[
				() => true,
				player =>
					player.hasCard(function (card) {
						return lib.filter.cardDiscardable(card, player, "caiyi");
					}, "he"),
				player => !player.isTurnedOver() || !player.isLinked(),
				() => true,
			],
		],
		content() {
			"step 0";
			if (!player.storage.caiyi_info) {
				player.storage.caiyi_info = [[], []];
			}
			var index = player.storage.caiyi ? 1 : 0;
			event.index = index;
			var list = player.storage.caiyi_info[index],
				choices = lib.skill.caiyi.choices[index],
				numbers = ["⒈", "；⒉", "；⒊", "；⒋"];
			event.num = 4 - list.length;
			var str = "令一名角色选择执行其中一项：";
			for (var i = 0; i < 4; i++) {
				if (list.includes(i)) {
					continue;
				}
				if (i == 3 && !list.length) {
					continue;
				}
				str += numbers.shift();
				str += choices[i];
			}
			str += "。";
			str = str.replace(/X/g, get.cnNumber(event.num));
			player.chooseTarget(get.prompt("caiyi") + "（当前状态：" + (index ? "阳" : "阴") + "）", str).set("ai", function (target) {
				var player = _status.event.player;
				return (player.storage.caiyi ? -1 : 1) * get.attitude(player, target);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("caiyi", target);
				player.changeZhuanhuanji("caiyi");
				event.goto(event.index == 1 ? 5 : 2);
			} else {
				event.finish();
			}
			"step 2";
			var list = [],
				str = get.cnNumber(num);
			var choiceList = ["回复" + str + "点体力。", "摸" + str + "张牌。", "将武将牌翻至正面且重置。", "随机执行一个已经被移除的选项。"];
			var storage = player.storage.caiyi_info[event.index];
			for (var i = 0; i < 4; i++) {
				if (storage.includes(i)) {
					choiceList[i] = '<span style="text-decoration:line-through; opacity:0.5; ">' + choiceList[i] + "</span>";
				} else if (!lib.skill.caiyi.filterx[event.index][i](target) || (i == 3 && !storage.length)) {
					choiceList[i] = '<span style="opacity:0.5;">' + choiceList[i] + "</span>";
				} else {
					list.push("选项" + get.cnNumber(i + 1, true));
				}
			}
			if (!list.length) {
				event.finish();
				return;
			}
			target
				.chooseControl(list)
				.set("choiceList", choiceList)
				.set("ai", function () {
					var evt = _status.event,
						player = evt.player;
					var list = evt.controls.slice(0);
					var gett = function (choice) {
						if (choice == "cancel2") {
							return 0.1;
						}
						var max = 0,
							func = {
								选项一(current) {
									max = get.recoverEffect(current, player, player) * Math.min(evt.getParent().num, player.getDamagedHp());
								},
								选项二(target) {
									max = get.effect(target, { name: "draw" }, player, player) * evt.getParent().num;
								},
								选项三(target) {
									if (player.isTurnedOver()) {
										max += 25;
									}
									if (player.isLinked()) {
										max += get.effect(player, { name: "tiesuo" }, player, player);
									}
								},
								选项四(target) {
									max = 3;
								},
							}[choice];
						func(player);
						return max;
					};
					return list.sort(function (a, b) {
						return gett(b) - gett(a);
					})[0];
				});
			"step 3";
			var index2 = ["选项一", "选项二", "选项三", "选项四"].indexOf(result.control);
			player.storage.caiyi_info[event.index].push(index2);
			if (index2 == 3) {
				var list = player.storage.caiyi_info[event.index].filter(function (i) {
					return i != 3 && lib.skill.caiyi.filterx[event.index][i](target);
				});
				if (!list.length) {
					event.finish();
					return;
				}
				index2 = list.randomGet();
			}
			switch (index2) {
				case 0:
					target.recover(num);
					break;
				case 1:
					target.draw(num);
					break;
				case 2:
					!target.isTurnedOver() || target.turnOver();
					break;
			}
			if (index2 != 2) {
				event.finish();
			}
			"step 4";
			!target.isLinked() || target.link();
			event.finish();
			"step 5";
			var list = [],
				str = get.cnNumber(num);
			var choiceList = ["受到" + str + "点伤害。", "弃置" + str + "张牌。", "将武将牌翻至背面并横置。", "随机执行一个已经被移除的选项。"];
			var storage = player.storage.caiyi_info[event.index];
			for (var i = 0; i < 4; i++) {
				if (storage.includes(i)) {
					choiceList[i] = '<span style="text-decoration:line-through; opacity:0.5; ">' + choiceList[i] + "</span>";
				} else if (!lib.skill.caiyi.filterx[event.index][i](target) || (i == 3 && !storage.length)) {
					choiceList[i] = '<span style="opacity:0.5;">' + choiceList[i] + "</span>";
				} else {
					list.push("选项" + get.cnNumber(i + 1, true));
				}
			}
			if (!list.length) {
				event.finish();
				return;
			}
			target
				.chooseControl(list)
				.set("choiceList", choiceList)
				.set("ai", function () {
					var evt = _status.event,
						player = evt.player;
					var list = evt.controls.slice(0);
					var gett = function (choice) {
						if (choice == "cancel2") {
							return 0.1;
						}
						var max = 0,
							func = {
								选项一(current) {
									max = get.effect(current, { name: "damage" }, player, player) * evt.getParent().num;
								},
								选项二(target) {
									max = get.effect(target, { name: "guohe_copy2" }, player, player) * Math.min(player.countCards("he"), evt.getParent().num);
								},
								选项三(target) {
									if (!player.isTurnedOver()) {
										max -= 5;
									}
									if (!player.isLinked()) {
										max += get.effect(player, { name: "tiesuo" }, player, player);
									}
								},
								选项四(target) {
									max = -3;
								},
							}[choice];
						func(player);
						return max;
					};
					return list.sort(function (a, b) {
						return gett(b) - gett(a);
					})[0];
				});
			"step 6";
			var index2 = ["选项一", "选项二", "选项三", "选项四"].indexOf(result.control);
			player.storage.caiyi_info[event.index].push(index2);
			if (index2 == 3) {
				var list = player.storage.caiyi_info[event.index].filter(function (i) {
					return i != 3 && lib.skill.caiyi.filterx[event.index][i](target);
				});
				if (!list.length) {
					event.finish();
					return;
				}
				index2 = list.randomGet();
			}
			switch (index2) {
				case 0:
					target.damage(num);
					break;
				case 1:
					target.chooseToDiscard(num, true, "he");
					break;
				case 2:
					target.isTurnedOver() || target.turnOver();
					break;
			}
			if (index2 != 2) {
				event.finish();
			}
			"step 7";
			target.isLinked() || target.link();
			event.finish();
		},
		mark: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "转换技。结束阶段，你可令一名角色选择并执行一项，然后移除此选项：⒈受到X点伤害。⒉弃置X张牌。⒊翻面并横置。⒋随机执行一个已经移除过的阳选项。（X为该阴阳态剩余选项的数量）。";
				}
				return "转换技。结束阶段，你可令一名角色选择并执行一项，然后移除此选项：⒈回复X点体力。⒉摸X张牌，⒊复原武将牌。⒋随机执行一个已经移除过的阴选项。⒋随机执行一个已经移除过的阳选项。（X为该阴阳态剩余选项的数量）。";
			},
		},
	},
	guili: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player.phaseNumber == 1 && game.hasPlayer(current => current != player);
		},
		content() {
			"step 0";
			player.chooseTarget(lib.filter.notMe, true, "请选择【归离】的目标", lib.translate.guili_info).set("ai", function (target) {
				return -get.threaten(target);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				game.log(player, "选择了", target);
				player.storage.guili_insert = target;
				player.addSkill("guili_insert");
				game.delayx();
			}
		},
		onremove: true,
		subSkill: {
			insert: {
				audio: "guili",
				mark: true,
				intro: {
					content: "players",
				},
				trigger: { global: "phaseAfter" },
				forced: true,
				charlotte: true,
				logTarget: "player",
				filter(event, player) {
					if (event.player != player.storage.guili_insert) {
						return false;
					}
					if (event.player.getHistory("sourceDamage").length > 0) {
						return false;
					}
					var history = event.player.actionHistory;
					if (history[history.length - 1].isRound) {
						return true;
					}
					for (var i = history.length - 2; i >= 0; i--) {
						if (history[i].isMe) {
							return false;
						}
						if (history[i].isRound) {
							return true;
						}
					}
					return false;
				},
				content() {
					player.insertPhase();
				},
			},
		},
	},
	//刘虞
	dcsuifu: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			if (player == event.player || !event.player.countCards("h")) {
				return false;
			}
			var num = 0;
			game.countPlayer(function (current) {
				if (current == player || current.getSeatNum() == 1) {
					current.getHistory("damage", function (evt) {
						num += evt.num;
					});
				}
			});
			return num >= 2;
		},
		seatRelated: true,
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		content() {
			"step 0";
			var target = trigger.player,
				cards = target.getCards("h");
			target.lose(cards, ui.cardPile, "insert");
			target.$throw(cards.length);
			game.updateRoundNumber();
			game.log(player, "将", target, "的", get.cnNumber(cards.length), "张手牌置于牌堆顶");
			"step 1";
			game.delayx();
			player.chooseUseTarget({ name: "wugu", isCard: true }, true);
		},
	},
	dcpijing: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget([1, game.countPlayer()], get.prompt("dcpijing"), "令任意名角色获得技能〖自牧〗").set("ai", function (target) {
				return get.attitude(_status.event.player, target);
			});
			"step 1";
			if (result.bool) {
				var targets = result.targets;
				targets.add(player);
				targets.sortBySeat();
				player.logSkill("dcpijing", targets);
				game.countPlayer(function (current) {
					if (!targets.includes(current)) {
						current.removeSkills("dczimu");
					} else {
						current.addSkills("dczimu");
					}
				});
				game.delayx();
			}
		},
		derivation: "dczimu",
	},
	dczimu: {
		audio: 1,
		trigger: { player: "damageEnd" },
		forced: true,
		mark: true,
		logTarget(event, player) {
			return game
				.filterPlayer(function (current) {
					return current.hasSkill("dczimu", null, null, false);
				})
				.sortBySeat();
		},
		content() {
			"step 0";
			var list = game.filterPlayer(function (current) {
				return current.hasSkill("dczimu", null, null, false);
			});
			if (list.length > 0) {
				if (list.length == 1) {
					list[0].draw();
				} else {
					game.asyncDraw(list);
					event.delay = true;
				}
			}
			"step 1";
			player.removeSkills("dczimu");
			if (event.delay) {
				game.delayx();
			}
		},
		marktext: "牧",
		intro: {
			content: "锁定技。当你受到伤害后，你令所有拥有〖自牧〗的角色各摸一张牌，然后你失去〖自牧〗。",
		},
	},
	//黄祖
	dcjinggong: {
		audio: 2,
		enable: "chooseToUse",
		locked: false,
		mod: {
			targetInRange(card) {
				if (card.storage && card.storage.dcjinggong) {
					return true;
				}
			},
		},
		viewAsFilter(player) {
			return player.hasCard(function (card) {
				return get.type(card) == "equip";
			}, "ehs");
		},
		position: "hes",
		filterCard: { type: "equip" },
		viewAs: {
			name: "sha",
			storage: { dcjinggong: true },
		},
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				return player.hasCard(function (card) {
					return get.type(card) == "equip";
				}, "ehs");
			},
		},
		group: "dcjinggong_base",
		subSkill: {
			base: {
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return event.skill == "dcjinggong" && event.targets.length > 0;
				},
				content() {
					trigger.baseDamage = Math.min(5, get.distance(player, trigger.targets[0]));
				},
			},
		},
	},
	dcxiaojuan: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		logTarget: "target",
		filter(event, player) {
			return event.targets.length == 1 && player != event.target && event.target.countCards("h") > 1;
		},
		check(event, player) {
			var target = event.target;
			if (get.attitude(player, target) >= 0) {
				return false;
			}
			if (get.color(event.card) == "none") {
				return true;
			}
			return Math.floor(target.countCards("h") / 2) >= Math.floor(player.countCards("h") / 2);
		},
		content() {
			"step 0";
			var target = trigger.target;
			event.target = target;
			var num = Math.floor(target.countCards("h") / 2);
			if (num > 0) {
				player.discardPlayerCard(target, "h", num, true);
			} else {
				event.finish();
			}
			"step 1";
			var suit = get.suit(trigger.card);
			if (result.bool && lib.suit.includes(suit) && player.countCards("h") > 1) {
				var bool = false;
				for (var i of result.cards) {
					if (get.suit(i, target) == suit) {
						bool = true;
						break;
					}
				}
				if (!bool) {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (player.countCards("h") > 0) {
				player.chooseToDiscard("h", 1, true);
			}
		},
	},
	//来莺儿
	xiaowu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		selectTarget() {
			return [1, game.countPlayer() - 1];
		},
		complexSelect: true,
		complexTarget: true,
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			var next = player.getNext(),
				prev = player.getPrevious();
			var selected = ui.selected.targets;
			if (!selected.includes(next) && !selected.includes(prev)) {
				return target == next || target == prev;
			}
			for (var i of selected) {
				if (i.getNext() == target || i.getPrevious() == target) {
					return true;
				}
			}
			return false;
		},
		contentBefore() {
			event.getParent()._xiaowu_targets = [];
		},
		content() {
			"step 0";
			if (!target.isIn()) {
				event.finish();
				return;
			}
			target
				.chooseControl()
				.set("choiceList", ["令" + get.translation(player) + "摸一张牌", "令自己摸一张牌"])
				.set("ai", function () {
					var player = _status.event.player,
						target = _status.event.getParent().player;
					var all = _status.event.getParent().targets.length,
						dam = _status.event.getParent(2)._xiaowu_targets.length;
					if (get.attitude(player, target) > 0 || dam >= Math.floor(all / 2)) {
						return 0;
					}
					return 1;
				});
			"step 1";
			if (result.index == 0) {
				player.draw();
			} else {
				target.draw();
				event.getParent()._xiaowu_targets.push(target);
			}
		},
		contentAfter() {
			var targetsx = event.getParent()._xiaowu_targets;
			var num = targets.length - targetsx.length - targetsx.length;
			if (num > 0) {
				player.addMark("shawu", 1);
			} else if (num < 0) {
				player.line(targetsx, "fire");
				for (var i of targetsx) {
					i.damage();
				}
			}
		},
		ai: {
			order: 8,
			result: { player: 1 },
		},
	},
	huaping: {
		audio: 2,
		trigger: { global: "die" },
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		filter(event, player) {
			return player != event.player;
		},
		logTarget: "player",
		check(event, player) {
			return get.rank(event.player.name, true) >= 5;
		},
		content() {
			player.awakenSkill(event.name);
			var skills = trigger.player.getSkills(null, false, false).filter(function (i) {
				var info = get.info(i);
				return info && !info.charlotte;
			});
			if (skills.length) {
				//for(var i of skills) player.addSkillLog(i);
				player.addSkills(skills);
			}
			player.removeSkills("xiaowu");
			var num = player.countMark("shawu");
			if (num > 0) {
				player.removeMark("shawu", num);
				player.draw(num);
			}
		},
		group: "huaping_give",
		subSkill: {
			give: {
				audio: "huaping",
				trigger: { player: "die" },
				direct: true,
				filter(event, player) {
					return event.player == player;
				},
				forceDie: true,
				skillAnimation: true,
				animationColor: "gray",
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt("huaping"), "令一名其他角色获得〖沙舞〗", lib.filter.notMe)
						.set("forceDie", true)
						.set("ai", function (target) {
							return get.attitude(_status.event.player, target) + 100;
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.awakenSkill("huaping");
						player.logSkill("huaping_give", target);
						target.addSkills("shawu");
						var num = player.countMark("shawu");
						if (num > 0) {
							player.removeMark("shawu", num);
							target.addMark("shawu", num);
						}
					}
				},
			},
		},
		derivation: "shawu",
	},
	shawu: {
		trigger: { player: "useCardToTargeted" },
		direct: true,
		filter(event, player) {
			return (
				event.card.name == "sha" &&
				event.player.isIn() &&
				(player.hasMark("shawu") ||
					player.countCards("h", function (card) {
						return lib.filter.cardDiscardable(card, player, "shawu");
					}) > 1)
			);
		},
		content() {
			"step 0";
			var list = [];
			if (
				player.countCards("h", function (card) {
					return lib.filter.cardDiscardable(card, player, "shawu");
				}) > 1
			) {
				list.push("弃置手牌");
			}
			if (player.hasMark("shawu")) {
				list.push("移除标记");
			}
			list.push("cancel2");
			player
				.chooseControl(list)
				.set("prompt", get.prompt("shawu", trigger.target))
				.set("prompt2", "弃置两张手牌，或移去一枚“沙”并摸两张牌，然后对该角色造成1点伤害")
				.set("ai", function () {
					var player = _status.event.player,
						target = _status.event.getTrigger().target;
					if (get.damageEffect(target, player, player) <= 0) {
						return "cancel2";
					}
					if (player.hasMark("shawu")) {
						return "移除标记";
					}
					if (
						player.countCards("h", function (card) {
							return lib.filter.cardDiscardable(card, player, "shawu") && get.value(card) <= 6.5;
						}) > 1
					) {
						return "弃置手牌";
					}
					return "cancel2";
				});
			"step 1";
			var target = trigger.target;
			if (result.control == "cancel2") {
				event.finish();
				return;
			} else if (result.control == "移除标记") {
				player.logSkill("shawu", target);
				player.removeMark("shawu", 1);
				player.draw(2);
				target.damage();
				event.finish();
			} else {
				player.chooseToDiscard("h", true, 2).logSkill = ["shawu", target];
			}
			"step 2";
			trigger.target.damage();
		},
		intro: {
			content: "mark",
		},
	},
	//曹髦
	qianlong: {
		audio: 2,
		trigger: { player: "damageEnd" },
		frequent: true,
		content() {
			"step 0";
			var cards = get.cards(3);
			event.cards = cards;
			game.cardsGotoOrdering(cards);
			//展示牌
			game.log(player, "展示了", event.cards);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					if (player == game.me || player.isUnderControl()) {
						return;
					}
					var str = get.translation(player) + "发动了【潜龙】";
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			game.addVideo("showCards", player, [get.translation(player) + "发动了【潜龙】", get.cardsInfo(event.cards)]);
			if (player != game.me && !player.isUnderControl() && !player.isOnline()) {
				game.delay(2);
			}
			//选牌
			var next = player.chooseToMove("潜龙：获得至多" + get.cnNumber(Math.min(3, player.getDamagedHp())) + "张牌并将其余牌置于牌堆底");
			next.set("list", [["置于牌堆底", cards], ["自己获得"]]);
			next.set("filterMove", function (from, to, moved) {
				if (moved[0].includes(from.link)) {
					if (typeof to == "number") {
						if (to == 1) {
							if (moved[1].length >= _status.event.player.getDamagedHp()) {
								return false;
							}
						}
						return true;
					}
				}
				return true;
			});
			next.set("processAI", function (list) {
				let cards = list[0][1].slice(0),
					player = _status.event.player;
				cards.sort((a, b) => {
					return get.value(b, player) - get.value(a, player);
				});
				if (!player.storage.juetao && player.hasSkill("juetao") && player.hasSha()) {
					let gain,
						bottom,
						pai = cards.filter(card => card.name !== "sha");
					pai.sort((a, b) => {
						return get.value(b, player) - get.value(a, player);
					});
					gain = pai.splice(0, player.getDamagedHp());
					bottom = cards.slice(0);
					bottom.removeArray(gain);
					return [bottom, gain];
				}
				return [cards, cards.splice(0, player.getDamagedHp())];
			});
			"step 1";
			game.broadcastAll("closeDialog", event.videoId);
			game.addVideo("cardDialog", null, event.videoId);
			var moved = result.moved;
			if (moved[0].length > 0) {
				for (var i of moved[0]) {
					i.fix();
					ui.cardPile.appendChild(i);
				}
			}
			if (moved[1].length > 0) {
				player.gain(moved[1], "gain2");
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return;
						}
						if (!target.hasFriend()) {
							return;
						}
						var num = 1;
						if (!player.needsToDiscard() && target.isDamaged()) {
							num = 0.7;
						} else {
							num = 0.5;
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
	fensi: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		content() {
			"step 0";
			if (
				!game.hasPlayer(function (current) {
					return current != player && current.hp >= player.hp;
				})
			) {
				player.damage();
				event.finish();
				return;
			} else {
				player
					.chooseTarget(true, "忿肆：对一名体力值不小于你的角色造成1点伤害", function (card, player, target) {
						return target.hp >= player.hp;
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.damageEffect(target, player, player);
					});
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "green");
				target.damage();
			} else {
				event.finish();
			}
			"step 2";
			if (target.isIn() && target.canUse("sha", player, false)) {
				target.useCard({ name: "sha", isCard: true }, player, false, "noai");
			}
		},
	},
	juetao: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.hp == 1;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("juetao"), lib.filter.notMe).set("ai", function (target) {
				let att = -get.attitude(_status.event.player, target);
				if (att <= 0) {
					return att;
				}
				if (
					target.hasSkillTag("nodamage", null, {
						source: player,
					}) ||
					target.getEquip("qimenbagua")
				) {
					return 0.01 * att;
				}
				if (target.getEquip("tengjia") || target.getEquip("renwang")) {
					return 0.3 * att;
				}
				if (target.getEquip("rewrite_tengjia") || target.getEquip("rewrite_renwang")) {
					return 0.2 * att;
				}
				if (
					target.hasSkillTag(
						"freeShan",
						false,
						{
							player: _status.event.player,
							type: "use",
						},
						true
					)
				) {
					return 0.3 * att;
				}
				if (target.getEquip(2)) {
					return att / 2;
				}
				return 1.2 * att;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("juetao", target);
				player.awakenSkill(event.name);
			} else {
				event.finish();
			}
			"step 2";
			var card = get.bottomCards()[0];
			game.cardsGotoOrdering(card);
			player.showCards(card);
			player
				.chooseUseTarget(card, true, false, "nodistance")
				.set("filterTarget", function (card, player, target) {
					var evt = _status.event;
					if (_status.event.name == "chooseTarget") {
						evt = evt.getParent();
					}
					if (target != player && target != evt.juetao_target) {
						return false;
					}
					return lib.filter.targetEnabledx(card, player, target);
				})
				.set("juetao_target", target);
			"step 3";
			if (result.bool && target.isIn()) {
				event.goto(2);
			}
		},
	},
	zhushi: {
		audio: 2,
		usable: 1,
		trigger: { global: "recoverEnd" },
		zhuSkill: true,
		filter(event, player) {
			return player != event.player && event.player.group == "wei" && event.player == _status.currentPhase && event.player.isIn() && player.hasZhuSkill("zhushi", event.player);
		},
		async cost(event, trigger, player) {
			const str = get.translation(player);
			event.result = await trigger.player
				.chooseBool(`是否响应${str}的主公技【助势】？`, `令${str}摸一张牌`)
				.set("goon", get.attitude(trigger.player, player) > 0)
				.set("ai", () => _status.event.goon)
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.player.line(player, "thunder");
			await player.draw();
		},
	},
	//骆统
	renzheng: {
		audio: 2,
		trigger: { global: ["damageCancelled", "damageZero", "damageAfter"] },
		forced: true,
		filter(event, player, name) {
			if (name == "damageCancelled") {
				return true;
			}
			for (var i of event.change_history) {
				if (i < 0) {
					return true;
				}
			}
			return false;
		},
		content() {
			player.draw(2);
		},
	},
	jinjian: {
		audio: 2,
		trigger: { source: "damageBegin1" },
		logTarget: "player",
		filter(event, player) {
			return !event.jinjian_source2 && !player.hasSkill("jinjian_source2");
		},
		prompt2: "令即将对其造成的伤害+1",
		check(event, player) {
			return (
				get.attitude(player, event.player) < 0 &&
				!event.player.hasSkillTag("filterDamage", null, {
					player: player,
					card: event.card,
				})
			);
		},
		content() {
			trigger.jinjian_source = true;
			trigger.num++;
			player.addTempSkill("jinjian_source2");
		},
		group: "jinjian_player",
		subSkill: {
			player: {
				audio: "jinjian",
				trigger: { player: "damageBegin4" },
				filter(event, player) {
					return !event.jinjian_player2 && !player.hasSkill("jinjian_player2");
				},
				prompt2: "令即将受到的伤害-1",
				content() {
					trigger.jinjian_player = true;
					trigger.num--;
					player.addTempSkill("jinjian_player2");
				},
			},
			source2: {
				trigger: { source: "damageBegin1" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return !event.jinjian_source;
				},
				content() {
					trigger.num--;
					trigger.jinjian_source2 = true;
					player.removeSkill("jinjian_source2");
				},
				marktext: " -1 ",
				intro: {
					content: "下次造成的伤害-1",
				},
			},
			player2: {
				trigger: { player: "damageBegin3" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return !event.jinjian_player;
				},
				content() {
					trigger.num++;
					trigger.jinjian_player2 = true;
					player.removeSkill("jinjian_player2");
				},
				marktext: " +1 ",
				intro: {
					content: "下次受到的伤害+1",
				},
			},
		},
		ai: {
			maixie_defend: true,
			threaten: 0.9,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					//if(target.hujia) return;
					if (player._jinjian_tmp) {
						return;
					}
					if (_status.event.getParent("useCard", true) || _status.event.getParent("_wuxie", true)) {
						return;
					}
					if (get.tag(card, "damage")) {
						if (target.hasSkill("jinjian_player2")) {
							return [1, -2];
						} else {
							if (get.attitude(player, target) > 0) {
								return [0, 0.2];
							}
							if (get.attitude(player, target) < 0 && !player.hasSkillTag("damageBonus")) {
								var sha = player.getCardUsable({ name: "sha" });
								player._jinjian_tmp = true;
								var num = player.countCards("h", function (card) {
									if (card.name == "sha") {
										if (sha == 0) {
											return false;
										} else {
											sha--;
										}
									}
									return get.tag(card, "damage") && player.canUse(card, target) && get.effect(target, card, player, player) > 0;
								});
								delete player._jinjian_tmp;
								if (player.hasSkillTag("damage")) {
									num++;
								}
								if (num < 2) {
									return [0, 0.8];
								}
							}
						}
					}
				},
			},
		},
	},
	//冯妤
	tiqi: {
		audio: 2,
		trigger: { global: ["phaseDrawEnd", "phaseDrawSkipped", "phaseDrawCancelled"] },
		filter(event, player) {
			if (player == event.player) {
				return false;
			}
			var num = 0;
			event.player.getHistory("gain", function (evt) {
				if (evt.getParent().name == "draw" && evt.getParent("phaseDraw") == event) {
					num += evt.cards.length;
				}
			});
			return num != 2;
		},
		frequent: true,
		logTarget: "player",
		content() {
			"step 0";
			var num = 0;
			trigger.player.getHistory("gain", function (evt) {
				if (evt.getParent().name == "draw" && evt.getParent("phaseDraw") == trigger) {
					num += evt.cards.length;
				}
			});
			num = Math.abs(num - 2);
			event.num = num;
			player.draw(num);
			"step 1";
			if (trigger.player.isIn()) {
				player
					.chooseControl(" +" + num + " ", " -" + num + " ", "cancel2")
					.set("prompt", "是否改变" + get.translation(trigger.player) + "本回合的手牌上限？")
					.set("ai", function () {
						var sgn = get.sgn(get.attitude(_status.event.player, _status.event.getTrigger().player));
						if (sgn == 0) {
							return 2;
						}
						if (sgn == 1) {
							return 0;
						}
						return 1;
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.index < 2) {
				var target = trigger.player;
				player.line(target);
				if (!target.storage.tiqi_effect) {
					target.storage.tiqi_effect = 0;
				}
				target.storage.tiqi_effect += num * get.sgn(0.5 - result.index);
				target.addTempSkill("tiqi_effect");
				target.markSkill("tiqi_effect");
			}
		},
		subSkill: {
			effect: {
				mod: {
					maxHandcard(player, num) {
						if (typeof player.storage.tiqi_effect == "number") {
							return num + player.storage.tiqi_effect;
						}
					},
				},
				charlotte: true,
				onremove: true,
				mark: true,
				intro: {
					content: num => "手牌上限" + (num < 0 ? "" : "+") + num,
				},
			},
		},
	},
	baoshu: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		filter(event, player) {
			return player.maxHp > 0;
		},
		content() {
			"step 0";
			player.chooseTarget([1, player.maxHp], get.prompt("baoshu"), "令至多" + get.cnNumber(player.maxHp) + "名角色重置武将牌并获得“梳”").set("ai", function (target) {
				var att = get.attitude(player, target);
				if (att <= 0) {
					return 0;
				}
				//if(target.isTurnedOver()) return 3*att;
				if (target.isLinked() && get.effect(target, { name: "tiesuo" }, player, player) > 0) {
					return 1.6 * att;
				}
				if (ui.selected.targets.length >= Math.sqrt(1 + player.maxHp)) {
					return 0;
				}
				if (target != player) {
					return 1.3 * att;
				}
				return att;
			});
			"step 1";
			if (result.bool) {
				var targets = result.targets;
				targets.sortBySeat();
				player.logSkill("baoshu", targets);
				event.targets = targets;
				event.num = 0;
				event.num2 = 1 + player.maxHp - targets.length;
			} else {
				event.finish();
			}
			"step 2";
			var target = targets[num];
			event.target = target;
			if (!target.isIn()) {
				if (num < targets.length - 1) {
					event.num++;
					event.goto(2);
				} else {
					event.finish();
				}
			} else if (target.isLinked()) {
				target.link();
			}
			"step 3";
			if (target.isIn()) {
				target.addSkill("baoshu_draw");
				target.addMark("baoshu", event.num2);
			}
			if (num < targets.length - 1) {
				event.num++;
				event.goto(2);
			} else {
				event.finish();
			}
		},
		marktext: "梳",
		intro: {
			name2: "梳",
			content: "mark",
			onunmark(storage, player) {
				delete player.storage.baoshu;
				player.removeSkill("baoshu_draw");
			},
		},
		//group: "baoshu_draw",
		subSkill: {
			draw: {
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return !event.numFixed && player.hasMark("baoshu");
				},
				content() {
					var num = player.countMark("baoshu");
					trigger.num += num;
					trigger.player.removeMark("baoshu", num);
				},
			},
		},
	},
	//吴范
	tianyun: {
		audio: 2,
		trigger: { global: "phaseBegin" },
		frequent: true,
		filter(event, player) {
			return event.player.getSeatNum() == game.roundNumber && player.countCards("h") > 0;
		},
		seatRelated: true,
		content() {
			"step 0";
			var suits = [],
				hs = player.getCards("h");
			for (var i of hs) {
				suits.add(get.suit(i, player));
			}
			var num = suits.length;
			event.num = num;
			var cards = get.cards(num);
			game.cardsGotoOrdering(cards);
			var next = player.chooseToMove();
			next.set("list", [["牌堆顶", cards], ["牌堆底"]]);
			next.set("prompt", "天运：点击或拖动将牌移动到牌堆顶或牌堆底");
			next.processAI = function (list) {
				var cards = list[0][1];
				return [[], cards];
			};
			"step 1";
			var top = result.moved[0];
			var bottom = result.moved[1];
			top.reverse();
			for (var i = 0; i < top.length; i++) {
				ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
			}
			for (i = 0; i < bottom.length; i++) {
				ui.cardPile.appendChild(bottom[i]);
			}
			player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
			game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
			game.updateRoundNumber();
			if (top.length) {
				game.delayx();
				event.finish();
			}
			"step 2";
			player
				.chooseTarget("是否令一名角色摸" + get.cnNumber(num) + "张牌，然后失去1点体力？")
				.set("", function (target) {
					if (!_status.event.goon || target.hasSkillTag("nogain")) {
						return 0;
					}
					return get.attitude(_status.event.player, target) * Math.sqrt(Math.max(1, 5 - target.getCards("h")));
				})
				.set("goon", num > 1 && player.hp > 5 - num);
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.draw(num);
				player.loseHp();
			} else {
				game.delayx();
			}
		},
		group: "tianyun_gain",
		subSkill: {
			gain: {
				audio: "tianyun",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					if (event.name == "phase" && game.phaseNumber != 0) {
						return false;
					}
					var suits = lib.suit.slice(0),
						hs = player.getCards("h");
					for (var i of hs) {
						suits.remove(get.suit(i, player));
						if (!suits.length) {
							return false;
						}
					}
					return true;
				},
				content() {
					var suits = lib.suit.slice(0),
						hs = player.getCards("h");
					for (var i of hs) {
						suits.remove(get.suit(i, player));
					}
					var cards = [];
					for (var i of suits) {
						var card = get.cardPile(function (card) {
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
		},
	},
	wfyuyan: {
		audio: 2,
		// derivation: "refenyin",
		trigger: { global: "roundStart" },
		forced: true,
		locked: false,
		derivation: "iwasawa_refenyin",
		content() {
			"step 0";
			var next = player
				.chooseTarget("请选择【预言】的目标", true)
				.set("animate", false)
				.set("ai", function () {
					return Math.random();
				});
			"step 1";
			if (result.bool) {
				player.storage.wfyuyan = result.targets[0];
				player.addSkill("wfyuyan_dying");
				player.addSkill("wfyuyan_damage");
			}
		},
		subSkill: {
			dying: {
				trigger: { global: "dying" },
				forced: true,
				charlotte: true,
				popup: false,
				content() {
					if (trigger.player == player.storage.wfyuyan) {
						player.logSkill("wfyuyan", trigger.player);
						player.addTempSkills("iwasawa_refenyin", { player: "phaseEnd" });
					}
					player.removeSkill("wfyuyan_dying");
				},
			},
			damage: {
				trigger: { global: "damageSource" },
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return event.source && event.source.isIn();
				},
				content() {
					if (trigger.source == player.storage.wfyuyan) {
						player.logSkill("wfyuyan", trigger.source);
						player.draw(2);
					}
					player.removeSkill("wfyuyan_damage");
				},
			},
		},
	},
	//张宝
	xinzhoufu: {
		audio: "rezhoufu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterCard: true,
		filterTarget(card, player, target) {
			return target != player && !target.getExpansions("xinzhoufu2").length;
		},
		check(card) {
			return 6 - get.value(card);
		},
		position: "he",
		discard: false,
		lose: false,
		delay: false,
		content() {
			target.addToExpansion(cards, player, "give").gaintag.add("xinzhoufu2");
			target.addSkill("xinzhoufu_judge");
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (player.inRange(target)) {
						return -1.3;
					}
					return -1;
				},
			},
		},
		subSkill: {
			judge: {
				audio: "xinzhoufu",
				trigger: { player: "judgeBefore" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return !event.directresult && player.getExpansions("xinzhoufu2").length;
				},
				content() {
					var cards = [player.getExpansions("xinzhoufu2")[0]];
					trigger.directresult = cards[0];
				},
			},
		},
	},
	xinzhoufu2: {
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
	},
	xinyingbing: {
		audio: "reyingbing",
		trigger: { player: "useCardToPlayered" },
		forced: true,
		logTarget: "target",
		filter(event, player) {
			return (
				event.target.getExpansions("xinzhoufu2").length > 0 &&
				!player.hasHistory("gain", function (evt) {
					var evtx = evt.getParent(2);
					return evtx && evtx.name == "xinyingbing" && evtx._trigger.target == event.target;
				})
			);
		},
		content() {
			player.draw(2);
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (
						target &&
						target.getExpansions("xinzhoufu2").length > 0 &&
						!player.hasHistory("gain", function (evt) {
							var evtx = evt.getParent(2);
							return evtx && evtx.name == "xinyingbing" && evtx._trigger.target == target;
						})
					) {
						return [1, 2];
					}
				},
			},
			combo: "xinzhoufu",
		},
	},
	//孙翊
	syjiqiao: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		content() {
			var cards = get.cards(player.maxHp);
			cards.sort(function (a, b) {
				return get.color(b).length - get.color(a).length;
			});
			player.addToExpansion(cards, "gain2").gaintag.add("syjiqiao");
			player.addTempSkill("syjiqiao_gain", "phaseUseAfter");
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		subSkill: {
			gain: {
				audio: "syjiqiao",
				trigger: { player: "useCardAfter" },
				charlotte: true,
				forced: true,
				filter(event, player) {
					return player.hasCard(card => card.hasGaintag("syjiqiao"), "x");
				},
				content() {
					"step 0";
					var cards = player.getExpansions("syjiqiao");
					var dialog = ["激峭：选择获得一张牌"];
					var reds = [],
						blacks = [];
					for (var i of cards) {
						(get.color(i) == "red" ? reds : blacks).push(i);
					}
					if (reds.length > 0) {
						dialog.push('<div class="text center">红色牌</div>');
						dialog.push(reds);
					}
					if (blacks.length > 0) {
						dialog.push('<div class="text center">黑色牌</div>');
						dialog.push(blacks);
					}
					player.chooseButton(dialog, true).set("ai", function (button) {
						var player = _status.event.player;
						var color = get.color(button.link),
							cards = player.getExpansions("syjiqiao");
						var num1 = cards.filter(card => get.color(card) == color).length,
							num2 = cards.length - num1;
						if (num1 >= num2) {
							return get.value(button.link);
						}
						return 0;
					});
					"step 1";
					if (result.bool) {
						player.gain(result.links, "gain2");
					} else {
						event.finish();
					}
					"step 2";
					var map = { red: 0, black: 0 },
						cards = player.getExpansions("syjiqiao");
					for (var i of cards) {
						var color = get.color(i, false);
						if (map[color] != undefined) {
							map[color]++;
						}
					}
					if (map.red == map.black) {
						player.recover();
					} else {
						player.loseHp();
					}
				},
				onremove(player) {
					var cards = player.getExpansions("syjiqiao");
					if (cards.length) {
						player.loseToDiscardpile(cards);
					}
				},
			},
		},
	},
	syxiongyi: {
		audio: 2,
		skillAnimation: true,
		animationColor: "wood",
		limited: true,
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type != "dying") {
				return false;
			}
			if (player != event.dying) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			"step 0";
			player.awakenSkill(event.name);
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			if (_status.characterlist.includes("xushi")) {
				if (player.name2 && get.character(player.name2)[3].includes("syxiongyi")) {
					await player.reinitCharacter(player.name2, "xushi");
				} else {
					await player.reinitCharacter(player.name1, "xushi");
				}
				if (player.hp < 3) {
					await player.recover(3 - player.hp);
				}
			} else {
				await player.addSkills("olhunzi");
				if (player.hp < 1) {
					await player.recover(1 - player.hp);
				}
			}
		},
		ai: {
			order: 1,
			save: true,
			skillTagFilter(player, arg, target) {
				return player == target;
			},
			result: {
				player: 10,
			},
		},
		derivation: ["olhunzi", "reyingzi", "gzyinghun"],
	},
	gzyinghun_re_sunyi: { audio: 1 },
	reyingzi_re_sunyi: { audio: 1 },
	//曹金玉
	yuqi: {
		audio: 2,
		trigger: { global: "damageEnd" },
		getInfo(player) {
			if (!player.storage.yuqi) {
				player.storage.yuqi = [0, 3, 1, 1];
			}
			return player.storage.yuqi;
		},
		usable: 2,
		filter(event, player) {
			var list = lib.skill.yuqi.getInfo(player);
			return event.player.isIn() && get.distance(player, event.player) <= list[0];
		},
		logTarget: "player",
		content() {
			"step 0";
			event.list = lib.skill.yuqi.getInfo(player);
			var cards = get.cards(event.list[1]);
			event.cards = cards;
			game.cardsGotoOrdering(cards);
			var next = player.chooseToMove_new(true, "隅泣");
			next.set("list", [
				["牌堆顶的牌", cards],
				[["交给" + get.translation(trigger.player) + '<div class="text center">至少一张' + (event.list[2] > 1 ? "<br>至多" + get.cnNumber(event.list[2]) + "张" : "") + "</div>"], ['交给自己<div class="text center">至多' + get.cnNumber(event.list[3]) + "张</div>"]],
			]);
			next.set("filterMove", function (from, to, moved) {
				var info = lib.skill.yuqi.getInfo(_status.event.player);
				if (to == 1) {
					return moved[1].length < info[2];
				}
				if (to == 2) {
					return moved[2].length < info[3];
				}
				return true;
			});
			next.set("processAI", function (list) {
				var cards = list[0][1].slice(0).sort(function (a, b) {
						return get.value(b, "raw") - get.value(a, "raw");
					}),
					player = _status.event.player,
					target = _status.event.getTrigger().player;
				var info = lib.skill.yuqi.getInfo(_status.event.player);
				var cards1 = cards.splice(0, Math.min(info[3], cards.length - 1));
				var card2;
				if (get.attitude(player, target) > 0) {
					card2 = cards.shift();
				} else {
					card2 = cards.pop();
				}
				return [cards, [card2], cards1];
			});
			next.set("filterOk", function (moved) {
				return moved[1].length > 0;
			});
			"step 1";
			if (result.bool) {
				var moved = result.moved;
				cards.removeArray(moved[1]);
				cards.removeArray(moved[2]);
				while (cards.length) {
					ui.cardPile.insertBefore(cards.pop().fix(), ui.cardPile.firstChild);
				}
				var list = [[trigger.player, moved[1]]];
				if (moved[2].length) {
					list.push([player, moved[2]]);
				}
				game.loseAsync({
					gain_list: list,
					giver: player,
					animate: "draw",
				}).setContent("gaincardMultiple");
			}
		},
		mark: true,
		intro: {
			content(storage, player) {
				var info = lib.skill.yuqi.getInfo(player);
				return '<div class="text center"><span class=thundertext>蓝色：' + info[0] + "</span>　<span class=firetext>红色：" + info[1] + "</span><br><span class=greentext>绿色：" + info[2] + "</span>　<span class=yellowtext>黄色：" + info[3] + "</span></div>";
			},
		},
		ai: {
			threaten: 8.8,
		},
		init(player, skill) {
			const list = lib.skill.yuqi.getInfo(player);
			player.addTip(skill, get.translation(skill) + " " + list.slice().join(" "));
		},
		onremove: (player, skill) => player.removeTip(skill),
	},
	shanshen: {
		audio: 2,
		trigger: { global: "die" },
		direct: true,
		content() {
			"step 0";
			event.goon = !player.hasAllHistory("sourceDamage", function (evt) {
				return evt.player == trigger.player;
			});
			var list = lib.skill.yuqi.getInfo(player);
			player
				.chooseControl("<span class=thundertext>蓝色(" + list[0] + ")</span>", "<span class=firetext>红色(" + list[1] + ")</span>", "<span class=greentext>绿色(" + list[2] + ")</span>", "<span class=yellowtext>黄色(" + list[3] + ")</span>", "cancel2")
				.set("prompt", get.prompt("shanshen"))
				.set("prompt2", "令〖隅泣〗中的一个数字+2" + (event.goon ? "并回复1点体力" : ""))
				.set("ai", function () {
					var player = _status.event.player,
						info = lib.skill.yuqi.getInfo(player);
					if (
						info[0] < info[3] &&
						game.countPlayer(function (current) {
							return get.distance(player, current) <= info[0];
						}) < Math.min(3, game.countPlayer())
					) {
						return 0;
					}
					if (info[3] < info[1] - 1) {
						return 3;
					}
					if (info[1] < 5) {
						return 1;
					}
					if (
						info[0] < 5 &&
						game.hasPlayer(function (current) {
							return current != player && get.distance(player, current) > info[0];
						})
					) {
						return 0;
					}
					return 2;
				});
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("shanshen", trigger.player);
				var list = lib.skill.yuqi.getInfo(player);
				list[result.index] = Math.min(5, list[result.index] + 2);
				game.log(player, "将", result.control, "数字改为", "#y" + list[result.index]);
				player.markSkill("yuqi");
				lib.skill.yuqi.init(player, "yuqi");
				if (event.goon) {
					player.recover();
				}
			}
		},
		ai: {
			combo: "yuqi",
		},
	},
	xianjing: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			var list = lib.skill.yuqi.getInfo(player);
			player
				.chooseControl("<span class=thundertext>蓝色(" + list[0] + ")</span>", "<span class=firetext>红色(" + list[1] + ")</span>", "<span class=greentext>绿色(" + list[2] + ")</span>", "<span class=yellowtext>黄色(" + list[3] + ")</span>", "cancel2")
				.set("prompt", get.prompt("xianjing"))
				.set("prompt2", "令〖隅泣〗中的一个数字+1")
				.set("ai", function () {
					var player = _status.event.player,
						info = lib.skill.yuqi.getInfo(player);
					if (
						info[0] < info[3] &&
						game.countPlayer(function (current) {
							return get.distance(player, current) <= info[0];
						}) < Math.min(3, game.countPlayer())
					) {
						return 0;
					}
					if (info[3] < info[1] - 1) {
						return 3;
					}
					if (info[1] < 5) {
						return 1;
					}
					if (
						info[0] < 5 &&
						game.hasPlayer(function (current) {
							return current != player && get.distance(player, current) > info[0];
						})
					) {
						return 0;
					}
					return 2;
				});
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("xianjing");
				var list = lib.skill.yuqi.getInfo(player);
				list[result.index] = Math.min(5, list[result.index] + 1);
				game.log(player, "将", result.control, "数字改为", "#y" + list[result.index]);
				player.markSkill("yuqi");
				lib.skill.yuqi.init(player, "yuqi");
				if (player.isDamaged()) {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			var list = lib.skill.yuqi.getInfo(player);
			player
				.chooseControl("<span class=thundertext>蓝色(" + list[0] + ")</span>", "<span class=firetext>红色(" + list[1] + ")</span>", "<span class=greentext>绿色(" + list[2] + ")</span>", "<span class=yellowtext>黄色(" + list[3] + ")</span>", "cancel2")
				.set("prompt", "是否令〖隅泣〗中的一个数字+1？")
				.set("ai", function () {
					var player = _status.event.player,
						info = lib.skill.yuqi.getInfo(player);
					if (
						info[0] < info[3] &&
						game.countPlayer(function (current) {
							return get.distance(player, current) <= info[0];
						}) < Math.min(3, game.countPlayer())
					) {
						return 0;
					}
					if (info[3] < info[1] - 1) {
						return 3;
					}
					if (info[1] < 5) {
						return 1;
					}
					if (
						info[0] < 5 &&
						game.hasPlayer(function (current) {
							return current != player && get.distance(player, current) > info[0];
						})
					) {
						return 0;
					}
					return 2;
				});
			"step 3";
			if (result.control != "cancel2") {
				var list = lib.skill.yuqi.getInfo(player);
				list[result.index] = Math.min(5, list[result.index] + 1);
				game.log(player, "将", result.control, "数字改为", "#y" + list[result.index]);
				player.markSkill("yuqi");
				lib.skill.yuqi.init(player, "yuqi");
			}
		},
		ai: {
			combo: "yuqi",
		},
	},
	//周夷
	zhukou: {
		audio: 2,
		trigger: { source: "damageSource" },
		filter(event, player) {
			if (!player.getHistory("useCard").length) {
				return false;
			}
			var evt = event.getParent("phaseUse");
			if (!evt || !evt.player) {
				return false;
			}
			return (
				player
					.getHistory("sourceDamage", function (evtx) {
						return evtx.getParent("phaseUse") == evt;
					})
					.indexOf(event) == 0
			);
		},
		frequent: true,
		content() {
			player.draw(player.getHistory("useCard").length);
		},
		group: "zhukou_all",
		subSkill: {
			all: {
				audio: "zhukou",
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return game.countPlayer(current => current != player) > 1 && !player.getHistory("sourceDamage").length;
				},
				direct: true,
				content() {
					"step 0";
					player.chooseTarget(get.prompt("zhukou"), "对两名其他角色各造成1点伤害", 2, lib.filter.notMe).set("ai", function (target) {
						var player = _status.event.player;
						return get.damageEffect(target, player, player);
					});
					"step 1";
					if (result.bool) {
						var targets = result.targets.sortBySeat();
						player.logSkill("zhukou", targets);
						for (var i of targets) {
							i.damage();
						}
					}
				},
			},
		},
	},
	mengqing: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return game.countPlayer(current => current.isDamaged()) > player.hp;
		},
		juexingji: true,
		skillAnimation: true,
		animationColor: "wood",
		content() {
			player.awakenSkill(event.name);
			player.gainMaxHp(3);
			player.recover(3);
			//player.removeSkill('zhukou');
			//player.addSkill('yuyun');
			player.changeSkills(["yuyun"], ["zhukou"]);
		},
		derivation: "yuyun",
	},
	yuyun: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		locked: true,
		filter(event, player) {
			return player.hp > 0 || player.maxHp > 1;
		},
		async cost(event, trigger, player) {
			if (player.hp <= 1 || player.maxHp <= 1) {
				event.result = { bool: true, cost_data: 1 };
			} else {
				const result = await player
					.chooseControl("失去体力", "减体力上限")
					.set("prompt", "玉陨：失去1点体力或减1点体力上限")
					.set("ai", function () {
						var player = _status.event.player;
						if (player.hp < 2 || player.getDamagedHp() > 2) {
							return 1;
						}
						return 0;
					})
					.forResult();
				event.result = {
					bool: true,
					cost_data: result.index,
				};
			}
		},
		async content(event, trigger, player) {
			if (event.cost_data == 1) {
				if (player.maxHp > 1) {
					await player.loseMaxHp();
				}
			} else {
				if (player.hp > 1) {
					await player.loseHp();
				}
			}
			const list = ["选项一：摸两张牌", "选项二：对一名其他角色造成1点伤害，且本回合对其使用【杀】无距离和次数限制", "选项三：本回合手牌上限视为无限", "选项四：获得一名其他角色区域内的一张牌", "选项五：令一名其他角色将手牌数摸至体力上限（至多摸至五张）"],
				num = Math.min(5, player.getDamagedHp() + 1),
				selected = [];
			while (selected.length < num) {
				const result = await player
					.chooseButton([
						"玉陨：是否选择一项执行？",
						[
							list.map((item, i) => {
								return [i, item];
							}),
							"textbutton",
						],
					])
					.set("filterButton", button => {
						return !get.event("selected").includes(button.link);
					})
					.set("selected", selected)
					.set("ai", function (button) {
						let player = _status.event.player;
						switch (button.link) {
							case 0:
								return 2;
							case 1:
								return (
									Math.max(
										0.5,
										player.countCards("hs", function (card) {
											return get.name(card) == "sha" && player.hasValueTarget(card);
										}) - player.getCardUsable({ name: "sha" })
									) +
									Math.max.apply(
										Math,
										game
											.filterPlayer(function (current) {
												return current != player;
											})
											.map(function (target) {
												return get.damageEffect(target, player, player);
											})
									)
								);
							case 2:
								return player.needsToDiscard() / 4;
							case 3:
								var num = 0;
								return (
									0.8 *
									Math.max.apply(
										Math,
										game
											.filterPlayer(function (current) {
												return current != player && current.hasCard(card => lib.filter.canBeGained(card, current, player), "hej");
											})
											.map(function (target) {
												return get.effect(target, { name: "shunshou_copy" }, player, player);
											})
									)
								);
							case 4:
								var num = 0;
								game.countPlayer(function (current) {
									if (current != player && get.attitude(player, current) > 0) {
										var num2 = Math.min(5, current.maxHp) - current.countCards("h");
										if (num2 > num) {
											num = num2;
										}
									}
								});
								return num * 0.8;
						}
					})
					.forResult();
				if (result.bool) {
					const choice = result.links[0];
					selected.add(choice);
					game.log(player, "选择了", "#g【玉陨】", "的", "#y选项" + get.cnNumber(1 + choice, true));
					switch (choice) {
						case 0:
							await player.draw(2);
							break;
						case 1: {
							if (game.hasPlayer(current => current != player)) {
								const result2 = await player
									.chooseTarget(lib.filter.notMe, true, "对一名其他角色造成1点伤害")
									.set("ai", function (target) {
										let player = _status.event.player;
										return get.damageEffect(target, player, player);
									})
									.forResult();
								if (result2.bool) {
									const target = result2.targets[0];
									player.line(target, "green");
									await target.damage();
									player.markAuto("yuyun_sha", [target]);
									player.addTempSkill("yuyun_sha");
								}
							}
							break;
						}
						case 2:
							player.addTempSkill("yuyun_114514");
							break;
						case 3: {
							if (
								game.hasPlayer(function (current) {
									return current != player && current.hasCard(card => lib.filter.canBeGained(card, current, player), "hej");
								})
							) {
								const result2 = await player
									.chooseTarget(true, "获得一名其他角色区域内的一张牌", function (card, player, current) {
										return current != player && current.hasCard(card => lib.filter.canBeGained(card, current, player), "hej");
									})
									.set("ai", function (target) {
										let player = _status.event.player;
										return get.effect(target, { name: "shunshou_copy" }, player, player);
									})
									.forResult();
								if (result2.bool) {
									const target = result2.targets[0];
									player.line(target, "green");
									await player.gainPlayerCard(target, "hej", true);
								}
							}
							break;
						}
						case 4: {
							if (
								game.hasPlayer(function (current) {
									return current != player && current.countCards("h") < Math.min(5, current.maxHp);
								})
							) {
								const result2 = await player
									.chooseTarget(true, "令一名其他角色将手牌数摸至体力上限", function (card, player, current) {
										return current != player && current.countCards("h") < Math.min(5, current.maxHp);
									})
									.set("ai", function (target) {
										let att = get.attitude(_status.event.player, target);
										if (target.hasSkillTag("nogain")) {
											att /= 6;
										}
										if (att > 2) {
											return Math.min(5, target.maxHp) - target.countCards("h");
										}
										return att / 3;
									})
									.forResult();
								if (result2.bool) {
									const target = result2.targets[0];
									player.line(target, "green");
									await target.drawTo(Math.min(5, target.maxHp));
								}
							}
							break;
						}
					}
				} else {
					break;
				}
			}
		},
		subSkill: {
			114514: {
				mod: {
					maxHandcardFinal(player, num) {
						return 114514;
					},
				},
				charlotte: true,
			},
			sha: {
				mod: {
					cardUsableTarget(card, player, target) {
						if (card.name == "sha" && player.getStorage("yuyun_sha").includes(target)) {
							return Infinity;
						}
					},
					targetInRange(card, player, target) {
						if (card.name == "sha" && player.getStorage("yuyun_sha").includes(target)) {
							return true;
						}
					},
				},
				charlotte: true,
				onremove: true,
			},
		},
	},
	//潘淑
	zhiren: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			if (!(player == _status.currentPhase || player.hasSkill("yaner_zhiren"))) {
				return false;
			}
			return (
				player
					.getHistory("useCard", evt => {
						return !evt.cards?.length || evt.card.isCard;
					})
					.indexOf(event) == 0
			);
		},
		frequent: true,
		locked: false,
		content() {
			"step 0";
			event.num = get.translation(trigger.card.name).length;
			player.chooseToGuanxing(event.num);
			if (event.num < 2) {
				event.finish();
			}
			"step 1";
			if (
				!game.hasPlayer(function (current) {
					return current.countDiscardableCards(player, "e") > 0;
				})
			) {
				event.goto(3);
			} else {
				player
					.chooseTarget("织纴：是否弃置一名角色装备区内的一张牌？", function (card, player, target) {
						return target.countDiscardableCards(player, "e") > 0;
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
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.addExpose(0.15);
				player.line(target, "green");
				player.discardPlayerCard(target, "e", true);
			} else {
				event.goto(5);
			}
			if (event.num < 3) {
				event.finish();
			} else if (get.mode() == "guozhan") {
				event.goto(5);
			}
			"step 3";
			if (
				!game.hasPlayer(function (current) {
					return current.countDiscardableCards(player, "j") > 0;
				})
			) {
				if (event.num < 3) {
					event.finish();
				} else {
					event.goto(5);
				}
			} else {
				player
					.chooseTarget("织纴：是否弃置一名角色判定区内的一张牌？", function (card, player, target) {
						return target.countDiscardableCards(player, "j") > 0;
					})
					.set("ai", function (target) {
						var player = _status.event.player,
							att = get.attitude(player, target),
							es = target.getCards("j"),
							val = 0;
						for (var i of es) {
							var eff = -get.effect(target, i, target, player);
							if (eff > val) {
								val = eff;
							}
						}
						return eff;
					});
			}
			"step 4";
			if (result.bool) {
				var target = result.targets[0];
				player.addExpose(0.15);
				player.line(target, "green");
				player.discardPlayerCard(target, "j", true);
			}
			if (event.num < 3) {
				event.finish();
			}
			"step 5";
			player.recover();
			if (event.num < 4) {
				event.finish();
			}
			"step 6";
			player.draw(get.mode() == "guozhan" ? 2 : 3);
		},
		mod: {
			aiOrder(player, card, num) {
				if (
					player == _status.currentPhase &&
					!player.getHistory("useCard", function (evt) {
						return evt.card.isCard;
					}).length
				) {
					return num + Math.pow(get.translation(card.name).length, 2);
				}
			},
		},
	},
	yaner: {
		audio: 2,
		trigger: {
			global: ["equipAfter", "addJudgeAfter", "loseAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			var current = _status.currentPhase;
			if (!current || current == player || !current.isIn() || !current.isPhaseUsing()) {
				return false;
			}
			var evt = event.getl(current);
			return evt && evt.hs && evt.hs.length && current.countCards("h") == 0;
		},
		usable: 1,
		logTarget() {
			return _status.currentPhase;
		},
		prompt2: "与该角色各摸两张牌",
		check(event, player) {
			return get.attitude(player, _status.currentPhase) > 0;
		},
		content() {
			"step 0";
			game.asyncDraw([_status.currentPhase, player], 2);
			"step 1";
			var e1 = player.getHistory("gain", function (evt) {
				return evt.getParent(2) == event;
			})[0];
			if (e1 && e1.cards && e1.cards.length == 2 && get.type(e1.cards[0]) == get.type(e1.cards[1])) {
				player.addTempSkill("yaner_zhiren", { player: "phaseBegin" });
				game.log(player, "修改了技能", "#g【织纴】");
			}
			var target = _status.currentPhase;
			if (target.isIn() && target.isDamaged()) {
				var e2 = target.getHistory("gain", function (evt) {
					return evt.getParent(2) == event;
				})[0];
				if (e2 && e2.cards && e2.cards.length == 2 && get.type(e2.cards[0]) == get.type(e2.cards[1])) {
					target.recover();
				}
			}
			"step 2";
			game.delayx();
		},
		subSkill: {
			zhiren: { charlotte: true },
		},
		ai: {
			expose: 0.5,
		},
	},
	//杨婉
	youyan: {
		audio: 2,
		trigger: {
			player: ["loseAfter", "equipAfter"],
			global: ["loseAsyncAfter", "cardsDiscardAfter"],
		},
		prompt2(event, player) {
			var cards2 = [];
			if (event.name == "cardsDiscard") {
				var evtx = event.getParent();
				if (evtx.name != "orderingDiscard") {
					return false;
				}
				var evtx2 = evtx.relatedEvent || evtx.getParent();
				if (evtx2.name == "useCard" || evtx2.name == "respond") {
					return false;
				}
				player.getHistory("lose", evtx3 => {
					var evtx4 = evtx3.relatedEvent || evtx3.getParent();
					if (evtx2 != evtx4) {
						return false;
					}
					if (!evtx3.cards2 || !evtx3.cards2.length) {
						return false;
					}
					cards2.addArray(evtx3.cards2.filterInD("d"));
				});
			} else if (event.name == "loseAsync") {
				player.hasHistory("lose", evt => {
					if (evt.getParent() != event || evt.position != ui.discardPile) {
						return false;
					}
					cards2.addArray(evt.cards2.filterInD("d"));
				});
			} else {
				cards2.addArray(event.getd(player).filterInD("d"));
			}
			return "获得与" + get.translation(cards2) + "花色" + (cards2.length > 1 ? "各" : "") + "不相同的牌各一张";
		},
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			var cards2 = [];
			if (event.name == "cardsDiscard") {
				var evtx = event.getParent();
				if (evtx.name != "orderingDiscard") {
					return false;
				}
				var evtx2 = evtx.relatedEvent || evtx.getParent();
				if (evtx2.name == "useCard" || evtx2.name == "respond") {
					return false;
				}
				player.getHistory("lose", evtx3 => {
					var evtx4 = evtx3.relatedEvent || evtx3.getParent();
					if (evtx2 != evtx4) {
						return false;
					}
					if (!evtx3.cards2 || !evtx3.cards2.length) {
						return false;
					}
					cards2.addArray(evtx3.cards2.filterInD("d"));
				});
			} else if (event.name == "loseAsync") {
				player.hasHistory("lose", evt => {
					if (evt.getParent() != event || evt.position != ui.discardPile) {
						return false;
					}
					cards2.addArray(evt.cards2.filterInD("d"));
				});
			} else {
				cards2.addArray(event.getd(player).filterInD("d"));
			}
			if (!cards2.length) {
				return false;
			}
			var list = [];
			for (var i of cards2) {
				list.add(get.suit(i, player));
				if (list.length >= lib.suit.length) {
					return false;
				}
			}
			var evt = event.getParent("phaseUse");
			if (evt && evt.player == player && !evt.youyaned) {
				return true;
			}
			var evt = event.getParent("phaseDiscard");
			if (evt && evt.player == player && !evt.youyaned) {
				return true;
			}
			return false;
		},
		content() {
			let evt = trigger.getParent("phaseUse");
			if (evt && evt.player == player) {
				player.tempBanSkill("youyan", "phaseUseAfter", false);
			} else {
				let evtx = trigger.getParent("phaseDiscard");
				if (evtx && evtx.player == player) {
					player.tempBanSkill("youyan", "phaseDiscardAfter", false);
				}
			}
			var list = [],
				cards = [];
			var cards2 = [];
			if (trigger.name == "cardsDiscard") {
				var evtx = trigger.getParent();
				if (evtx.name != "orderingDiscard") {
					return false;
				}
				var evtx2 = evtx.relatedEvent || evtx.getParent();
				if (evtx2.name == "useCard" || evtx2.name == "respond") {
					return false;
				}
				player.getHistory("lose", evtx3 => {
					var evtx4 = evtx3.relatedEvent || evtx3.getParent();
					if (evtx2 != evtx4) {
						return false;
					}
					if (!evtx3.cards2 || !evtx3.cards2.length) {
						return false;
					}
					cards2.addArray(evtx3.cards2.filterInD("d"));
				});
			} else if (trigger.name == "loseAsync") {
				player.hasHistory("lose", evt => {
					if (evt.getParent() != trigger || evt.position != ui.discardPile) {
						return false;
					}
					cards2.addArray(evt.cards2.filterInD("d"));
				});
			} else {
				cards2.addArray(trigger.getd(player).filterInD("d"));
			}
			for (var i of cards2) {
				list.add(get.suit(i, player));
			}
			for (var i of lib.suit) {
				if (list.includes(i)) {
					continue;
				}
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
		ai: {
			effect: {
				player_use(card, player, target) {
					if (
						typeof card == "object" &&
						player == _status.currentPhase &&
						//(!player.storage.counttrigger||!player.storage.counttrigger.youyan)&&
						player.needsToDiscard() == 1 &&
						card.cards &&
						card.cards.filter(function (i) {
							return get.position(i) == "h";
						}).length > 0 &&
						!get.tag(card, "draw") &&
						!get.tag(card, "gain") &&
						!get.tag(card, "discard")
					) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	zhuihuan: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return !current.hasSkill("zhuihuan2_new");
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("zhuihuan"), "令一名角色获得“追还”效果", function (card, player, target) {
					return !target.hasSkill("zhuihuan2_new");
				})
				.set("ai", function (target) {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (target.hasSkill("maixie") || target.hasSkill("maixie_defend")) {
						att /= 3;
					}
					if (target != player) {
						att /= Math.pow(game.players.length - get.distance(player, target, "absolute"), 0.7);
					}
					return att;
				})
				.set("animate", false);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("zhuihuan");
				target.addTempSkill("zhuihuan2_new", { player: "phaseZhunbei" });
				game.delayx();
			}
		},
	},
	zhuihuan2_new: {
		trigger: { player: "phaseZhunbeiBegin" },
		charlotte: true,
		forced: true,
		onremove: true,
		sourceSkill: "zhuihuan",
		filter(event, player) {
			if (player.storage.zhuihuan2_new) {
				for (var source of player.storage.zhuihuan2_new) {
					if (!source.isIn()) {
						continue;
					}
					if (source.hp > player.hp) {
						return true;
					}
					return source.countCards("h") > 0;
				}
			}
		},
		logTarget(event, player) {
			return player.storage.zhuihuan2_new.filter(function (target) {
				return target.isIn();
			});
		},
		content() {
			"step 0";
			event.targets = player.storage.zhuihuan2_new;
			player.removeSkill("zhuihuan2_new");
			"step 1";
			var target = targets.shift();
			if (target.isIn()) {
				if (target.hp > player.hp) {
					target.damage(2);
				} else {
					var hs = target.getCards("h");
					if (hs.length) {
						target.discard(hs.randomGets(2));
					}
				}
			}
			if (targets.length) {
				event.redo();
			}
		},
		group: "zhuihuan2_new_count",
		subSkill: {
			count: {
				trigger: { player: "damage" },
				forced: true,
				silent: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return get.itemtype(event.source) == "player";
				},
				content() {
					player.markAuto("zhuihuan2_new", [trigger.source]);
				},
			},
		},
	},
	zhuihuan2: {
		trigger: { player: "damageEnd" },
		forced: true,
		charlotte: true,
		logTarget: "source",
		sourceSkill: "zhuihuan",
		filter(event, player) {
			var source = event.source;
			if (source.hp > player.hp) {
				return true;
			}
			return source.countCards("h") > 0;
		},
		content() {
			if (player.hp < trigger.source.hp) {
				trigger.source.damage();
			} else {
				trigger.source.discard(trigger.source.getCards("h").randomGet());
			}
		},
		mark: true,
		intro: {
			content: "当你受到伤害后，若伤害来源体力值大于你，则你对其造成1点伤害，否则其随机弃置一张手牌",
		},
	},
	//阮瑀
	xingzuo: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		frequent: true,
		content() {
			"step 0";
			player.addTempSkill("xingzuo2");
			var cards = get.bottomCards(3);
			event.cards2 = cards;
			game.cardsGotoOrdering(cards);
			var next = player.chooseToMove("兴作：将三张牌置于牌堆底");
			var list = [["牌堆底", cards]],
				hs = player.getCards("h");
			if (hs.length) {
				list.push(["手牌", hs]);
				next.set("filterMove", function (from, to) {
					return typeof to != "number";
				});
			}
			next.set("list", list);
			next.set("processAI", function (list) {
				var allcards = list[0][1].slice(0),
					cards = [];
				if (list.length > 1) {
					allcards = allcards.concat(list[1][1]);
				}
				var canchoose = allcards.slice(0);
				var player = _status.event.player;
				var getv = function (button) {
					if (
						button.name == "sha" &&
						allcards.filter(function (card) {
							return (
								card.name == "sha" &&
								!cards.filter(function () {
									return button == card;
								}).length
							);
						}).length > player.getCardUsable({ name: "sha" })
					) {
						return 10;
					}
					return -player.getUseValue(button, player);
				};
				while (cards.length < 3) {
					canchoose.sort(function (a, b) {
						return getv(b) - getv(a);
					});
					cards.push(canchoose.shift());
				}
				return [cards, canchoose];
			});
			"step 1";
			if (result.bool) {
				event.forceDie = true;
				var cards = result.moved[0];
				event.cards = cards;
				player.storage.xingzuo2 = cards;
				var hs = player.getCards("h");
				var lose = [],
					gain = event.cards2;
				for (var i of cards) {
					if (hs.includes(i)) {
						lose.push(i);
					} else {
						gain.remove(i);
					}
				}
				if (lose.length) {
					player.lose(lose, ui.cardPile);
				}
				if (gain.length) {
					player.gain(gain, "draw");
				}
			} else {
				event.finish();
			}
			"step 2";
			for (var i of cards) {
				if (!"hejsdx".includes(get.position(i, true))) {
					i.fix();
					ui.cardPile.appendChild(i);
				}
			}
			game.updateRoundNumber();
		},
	},
	xingzuo2: {
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		charlotte: true,
		onremove: true,
		sourceSkill: "xingzuo",
		filter(event, player) {
			return game.hasPlayer(function (target) {
				return target.countCards("h") > 0;
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(function (card, player, target) {
					return target.countCards("h") > 0;
				}, "兴作：是否令一名角色将其手牌与牌堆底的三张牌替换？")
				.set("ai", function (target) {
					var player = _status.event.player,
						att = get.attitude(player, target),
						hs = target.getCards("h"),
						num = hs.length;
					var getv = function (list, target) {
							var num = 0;
							for (var i of list) {
								num += get.value(i, target);
							}
							return num;
						},
						val = getv(hs, target) - getv(player.storage.xingzuo2, target);
					if (num < 3) {
						return att * Math.sqrt(Math.max(0, -val)) * 1.5;
					}
					if (num == 3) {
						return -att * Math.sqrt(Math.max(0, val));
					}
					if (player.hp < (num > 4 ? 3 : 2)) {
						return 0;
					}
					return -att * Math.sqrt(Math.max(0, val));
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("xingzuo", target);
				var cards = get.bottomCards(3);
				game.cardsGotoOrdering(cards);
				var hs = target.getCards("h");
				target.lose(hs, ui.cardPile);
				target.gain(cards, "draw");
				if (hs.length > 3) {
					player.loseHp();
				}
			} else {
				event.finish();
			}
			"step 2";
			game.updateRoundNumber();
		},
	},
	miaoxian: {
		hiddenCard(player, name) {
			return get.type(name) == "trick" && !player.hasSkill("miaoxian_used") && player.countCards("h", { color: "black" }) == 1;
		},
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			if (player.hasSkill("miaoxian_used")) {
				return false;
			}
			var cards = player.getCards("h", { color: "black" });
			if (cards.length != 1) {
				return false;
			}
			var mod2 = game.checkMod(cards[0], player, "unchanged", "cardEnabled2", player);
			if (mod2 === false) {
				return false;
			}
			for (var i of lib.inpile) {
				if (
					get.type(i) == "trick" &&
					event.filterCard(
						{
							name: i,
							cards: cards,
						},
						player,
						event
					)
				) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var cards = player.getCards("h", { color: "black" });
				var list = [];
				for (var i of lib.inpile) {
					if (
						get.type(i) == "trick" &&
						event.filterCard(
							{
								name: i,
								cards: cards,
							},
							player,
							event
						)
					) {
						list.push(["锦囊", "", i]);
					}
				}
				return ui.create.dialog("妙弦", [list, "vcard"], "hidden");
			},
			check(button) {
				var player = _status.event.player;
				return player.getUseValue({ name: button.link[2] }) + 1;
			},
			backup(links, player) {
				return {
					audio: "miaoxian",
					popname: true,
					filterCard: { color: "black" },
					selectCard: -1,
					position: "h",
					viewAs: {
						name: links[0][2],
					},
					onuse(links, player) {
						player.addTempSkill("miaoxian_used");
					},
				};
			},
			prompt(links, player) {
				return "将" + get.translation(player.getCards("h", { color: "black" })[0]) + "当做" + get.translation(links[0][2]) + "使用";
			},
		},
		group: "miaoxian_use",
		subfrequent: ["use"],
		subSkill: {
			use: {
				audio: "miaoxian",
				trigger: { player: "loseAfter" },
				frequent: true,
				prompt: "是否发动【妙弦】摸一张牌？",
				filter(event, player) {
					var evt = event.getParent();
					if (evt.name != "useCard") {
						return false;
					}
					return event.hs && event.hs.length == 1 && event.cards && event.cards.length == 1 && get.color(event.hs[0], player) == "red" && !player.countCards("h", { color: "red" });
				},
				content() {
					player.draw();
				},
			},
			backup: { audio: "miaoxian" },
			used: { charlotte: true },
		},
		ai: {
			order: 12,
			result: { player: 1 },
		},
	},
	//樊玉凤
	bazhan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		zhuanhuanji: true,
		marktext: "☯",
		mark: true,
		intro: {
			content(storage, player) {
				return "出牌阶段限一次，" + (storage ? "你可以获得一名其他角色的至多两张手牌。" : "你可以将至多两张手牌交给一名其他角色。") + "若以此法移动的牌包含【酒】或♥牌，则你可令得到牌的角色执行一项：①回复1点体力。②复原武将牌。";
			},
		},
		filter(event, player) {
			if (player.storage.bazhan) {
				return game.hasPlayer(function (current) {
					return current != player && current.countGainableCards(player, "h") > 0;
				});
			}
			return player.countCards("h") > 0;
		},
		filterCard: true,
		discard: false,
		lose: false,
		selectCard() {
			if (_status.event.player.storage.bazhan) {
				return 0;
			}
			return [1, 2];
		},
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			if (player.storage.bazhan) {
				return target.countGainableCards(player, "h") > 0;
			}
			return true;
		},
		prompt() {
			if (_status.event.player.storage.bazhan) {
				return "获得一名其他角色的至多两张手牌";
			}
			return "将至多两张手牌交给一名其他角色";
		},
		delay: false,
		check(card) {
			var player = _status.event.player;
			var bool1 = false,
				bool2 = false;
			for (var i of game.players) {
				if (get.attitude(player, i) <= 0 || player == i) {
					continue;
				}
				bool1 = true;
				if (i.isDamaged() || i.isTurnedOver()) {
					bool2 = true;
					break;
				}
			}
			if (bool2 && !ui.selected.cards.length && (get.suit(card, player) == "heart" || get.name(card, player) == "jiu")) {
				return 10;
			}
			if (bool1) {
				return 9 - get.value(card);
			}
			if (get.color(card) == "red") {
				return 5 - get.value(card);
			}
			return 0;
		},
		content() {
			"step 0";
			if (player.storage.bazhan) {
				event.recover = player;
				player.gainPlayerCard(target, "h", true, "visibleMove", [1, 2]);
			} else {
				event.recover = target;
				player.give(cards, target);
			}
			player.changeZhuanhuanji("bazhan");
			"step 1";
			var target = event.recover;
			var cards = event.cards;
			if (result.bool && result.cards && result.cards.length) {
				cards = result.cards;
			}
			if (
				!cards ||
				!target ||
				!target.getCards("h").filter(function (i) {
					return cards.includes(i);
				}).length ||
				(function () {
					for (var card of cards) {
						if (get.suit(card, target) == "heart" || get.name(card, target) == "jiu") {
							return false;
						}
					}
					return true;
				})()
			) {
				event.finish();
				return;
			}
			var list = [];
			event.addIndex = 0;
			var str = get.translation(target);
			event.target = target;
			if (target.isDamaged()) {
				list.push("令" + str + "回复1点体力");
			} else {
				event.addIndex++;
			}
			if (target.isLinked() || target.isTurnedOver()) {
				list.push("令" + get.translation(target) + "复原武将牌");
			}
			if (!list.length) {
				event.finish();
			} else {
				player
					.chooseControl("cancel2")
					.set("choiceList", list)
					.set("ai", function () {
						var evt = _status.event.getParent();
						if (get.attitude(evt.player, evt.target) < 0) {
							return "cancel2";
						}
						if (evt.target.hp > 1 && evt.target.isTurnedOver()) {
							return 1 - evt.addIndex;
						}
						return 0;
					});
			}
			"step 2";
			if (result.control == "cancel2") {
				event.finish();
			} else if (result.index + event.addIndex == 0) {
				event.recover.recover();
				event.finish();
			} else if (event.recover.isLinked()) {
				event.recover.link();
			}
			"step 3";
			if (event.recover.isTurnedOver()) {
				event.recover.turnOver();
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (player.storage.bazhan) {
						return -1;
					}
					if (ui.selected.cards.length) {
						var cards = ui.selected.cards,
							card = cards[0];
						if (get.value(cards, target) < 0) {
							return -0.5;
						}
						if (get.attitude(player, target) > 0) {
							if ((target.isDamaged() || target.isTurnedOver()) && (get.suit(card, target) == "heart" || get.name(card, target) == "jiu")) {
								return 3;
							}
							if (target.hasUseTarget(card) && target.getUseValue(card) > player.getUseValue(card, null, true)) {
								return 1.4;
							}
							return 1;
						}
					}
					return 0;
				},
			},
		},
	},
	jiaoying: {
		audio: 2,
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		forced: true,
		getIndex(event, player) {
			if (!event.getl || !event.getg) {
				return [];
			}
			let evt = event.getl(player);
			if (!evt || !evt.hs || !evt.hs.length) {
				return [];
			}
			return game
				.filterPlayer(current => {
					let evtx = event.getg(current);
					return evtx && evtx.some(card => evt.hs.includes(card));
				})
				.sortBySeat();
		},
		logTarget(_1, _2, _3, target) {
			return target;
		},
		async content(event, trigger, player) {
			const target = event.indexedData;
			if (!target.storage.jiaoying2) {
				target.storage.jiaoying2 = [];
			}
			const cs = trigger.getl(player).hs,
				cards = trigger.getg(target).filter(card => cs.includes(card));
			for (let i of cards) {
				target.storage.jiaoying2.add(get.color(i, player));
			}
			target.addTempSkill("jiaoying2");
			target.markSkill("jiaoying2");
			player.addTempSkill("jiaoying3");
			if (!player.storage.jiaoying3) {
				player.storage.jiaoying3 = [];
			}
			player.storage.jiaoying3.add(target);
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				var target = arg.target;
				if (target.getStorage("jiaoying2").includes("red") && get.tag(arg.card, "respondShan") && !target.hasSkillTag("respondShan", true, null, true)) {
					return true;
				}
				return false;
			},
		},
	},
	jiaoying2: {
		onremove: true,
		charlotte: true,
		mod: {
			cardEnabled2(card, player) {
				if (player.getStorage("jiaoying2").includes(get.color(card))) {
					return false;
				}
			},
		},
		intro: {
			content: "本回合内不能使用或打出$牌",
		},
	},
	jiaoying3: {
		onremove: true,
		trigger: { global: "useCard1" },
		silent: true,
		firstDo: true,
		charlotte: true,
		sourceSkill: "jiaoying",
		filter(event, player) {
			return player.storage.jiaoying3.includes(event.player);
		},
		content() {
			while (player.storage.jiaoying3.includes(trigger.player)) {
				player.storage.jiaoying3.remove(trigger.player);
			}
			if (!player.storage.jiaoying3.length) {
				player.removeSkill("jiaoying3");
			}
		},
		group: "jiaoying3_draw",
	},
	jiaoying3_draw: {
		trigger: { global: "phaseEnd" },
		direct: true,
		charlotte: true,
		sourceSkill: "jiaoying",
		filter(event, player) {
			return (
				player.getStorage("jiaoying3").length > 0 &&
				game.hasPlayer(function (current) {
					return current.countCards("h") < 5;
				})
			);
		},
		content() {
			"step 0";
			player.storage.jiaoying3.shift();
			player
				.chooseTarget("醮影：令一名角色将手牌摸至五张", function (card, player, target) {
					return target.countCards("h") < 5;
				})
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					if (att > 2) {
						return 5 - target.countCards("h");
					}
					return att / 3;
				});
			"step 1";
			if (result.bool) {
				player.logSkill("jiaoying", result.targets);
				for (var i = 0; i < result.targets.length; i++) {
					result.targets[i].drawTo(5);
				}
				if (lib.skill.jiaoying3_draw.filter(null, player)) {
					event.goto(0);
				}
			}
		},
	},
	//郭照
	pianchong: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		check(event, player) {
			return player.getStorage("pianchong_effect").length < 2 || event.num <= 2;
		},
		async content(event, trigger, player) {
			trigger.changeToZero();
			const cards = [];
			const card1 = get.cardPile2(card => get.color(card, false) == "red");
			if (card1) {
				cards.push(card1);
			}
			const card2 = get.cardPile2(card => get.color(card, false) == "black");
			if (card2) {
				cards.push(card2);
			}
			if (cards.length) {
				await player.gain(cards, "gain2");
			}
			const effect = event.name + "_effect";
			const control = await player
				.chooseControl("red", "black")
				.set("prompt", "偏宠：请选择一种颜色。直至你的下回合开始时，失去该颜色的一张牌后，从牌堆获得另一种颜色的一张牌。")
				.set("ai", () => {
					const { player, effect, controls } = get.event();
					if (!effect.length) {
						let red = 0,
							black = 0;
						const cards = player.getCards("he");
						for (const i of cards) {
							let add = 1;
							const color = get.color(i, player);
							if (get.position(i) == "e") {
								add = 0.5;
							} else if (get.name(i, player) != "sha" && player.hasValueTarget(i)) {
								add = 1.5;
							}
							if (color == "red") {
								red += add;
							} else {
								black += add;
							}
						}
						if (black > red) {
							return "black";
						}
						return "red";
					} else if (effect.length == 1) {
						return controls.remove(effect[0])[0];
					} else {
						return controls.randomGet();
					}
				})
				.set("effect", player.getStorage(effect))
				.forResultControl();
			if (!["red", "black"].includes(control)) {
				return;
			}
			player.markAuto(effect, control);
			player.addTempSkill(effect, { player: "phaseBeginStart" });
			player.popup(control, control == "red" ? "fire" : "thunder");
			game.log(player, "声明了", "#y" + get.translation(control));
		},
		subSkill: {
			effect: {
				audio: "pianchong",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					const evt = event.getl(player);
					return evt?.cards2?.some(card => player.getStorage("pianchong_effect").includes(get.color(card, player)));
				},
				async content(event, trigger, player) {
					let cardsx = trigger
						.getl(player)
						.cards2.filter(card => player.getStorage(event.name).includes(get.color(card, player)))
						.slice(0);
					let cards = [];
					while (cardsx.length) {
						let precard = cardsx.shift();
						const card = get.cardPile2(card => !cards.includes(card) && get.color(card, false) != get.color(precard, false));
						if (card) {
							cards.push(card);
						} else {
							break;
						}
					}
					if (cards.length) {
						await player.gain(cards, "gain2");
					}
				},
				mark: true,
				intro: { content: "失去一张$牌后，从牌堆中获得一张与此牌颜色不同的牌" },
			},
		},
		ai: { threaten: 4.8 },
	},
	zunwei: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			let storage = player.getStorage("zunwei");
			return (
				storage.length < 3 &&
				game.hasPlayer(current => {
					return (player.isDamaged() && current.getHp() > player.getHp() && !storage.includes(0)) || (current.countCards("h") > player.countCards("h") && !storage.includes(1)) || (current.countCards("e") > player.countCards("e") && !storage.includes(2));
				})
			);
		},
		chooseButton: {
			dialog(event, player) {
				var list = ["选择体力值大于你的一名角色", "选择手牌数大于你的一名角色", "选择装备数大于你的一名角色"];
				var choiceList = ui.create.dialog("尊位：请选择一项", "forcebutton", "hidden");
				choiceList.add([
					list.map((item, i) => {
						if (player.getStorage("zunwei").includes(i)) {
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
				if (player.getStorage("zunwei").includes(button.link)) {
					return false;
				}
				if (button.link == 0) {
					if (!player.isDamaged()) {
						return false;
					}
					return game.hasPlayer(current => {
						return current.getHp() > player.getHp();
					});
				}
				if (button.link == 1) {
					return game.hasPlayer(current => {
						return current.countCards("h") > player.countCards("h");
					});
				}
				if (button.link == 2) {
					return game.hasPlayer(current => {
						return current.countCards("e") > player.countCards("e");
					});
				}
			},
			backup(links) {
				var next = get.copy(lib.skill.zunwei.backups[links[0]]);
				next.audio = "zunwei";
				next.filterCard = function () {
					return false;
				};
				next.selectCard = -1;
				return next;
			},
			check(button) {
				var player = _status.event.player;
				switch (button.link) {
					case 0: {
						var target = game.findPlayer(function (current) {
							return current.isMaxHp();
						});
						return (Math.min(target.hp, player.maxHp) - player.hp) * 2;
					}
					case 1: {
						var target = game.findPlayer(function (current) {
							return current.isMaxHandcard();
						});
						return Math.min(5, target.countCards("h") - player.countCards("h")) * 0.8;
					}
					case 2: {
						var target = game.findPlayer(function (current) {
							return current.isMaxEquip();
						});
						return (target.countCards("e") - player.countCards("e")) * 1.4;
					}
				}
			},
			prompt(links) {
				return ["选择一名体力值大于你的其他角色，将体力值回复至与其相同", "选择一名手牌数大于你的其他角色，将手牌数摸至与其相同", "选择一名装备区内牌数大于你的其他角色，依次使用牌堆中的装备牌，直到装备数与其相同"][links[0]];
			},
		},
		backups: [
			{
				filterTarget(card, player, target) {
					if (player.isHealthy()) {
						return false;
					}
					return target.hp > player.hp;
				},
				content() {
					player.recover(target.hp - player.hp);
					if (!player.storage.zunwei) {
						player.storage.zunwei = [];
					}
					player.storage.zunwei.add(0);
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
			{
				filterTarget(card, player, target) {
					return target.countCards("h") > player.countCards("h");
				},
				content() {
					player.draw(Math.min(5, target.countCards("h") - player.countCards("h")));
					if (!player.storage.zunwei) {
						player.storage.zunwei = [];
					}
					player.storage.zunwei.add(1);
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
				content() {
					"step 0";
					if (!player.storage.zunwei) {
						player.storage.zunwei = [];
					}
					player.storage.zunwei.add(2);
					event.num = 1;
					"step 1";
					var type = "equip" + num;
					if (!player.hasEmptySlot(type)) {
						return;
					}
					var card = get.cardPile2(function (card) {
						return get.subtype(card, false) == type && player.canUse(card, player);
					});
					if (card) {
						player.chooseUseTarget(card, true).nopopup = true;
					}
					"step 2";
					event.num++;
					if (event.num <= 5 && target.isIn() && player.countCards("e") < target.countCards("e")) {
						event.goto(1);
					}
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
		],
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	//辛宪英
	rezhongjian: {
		enable: "phaseUse",
		audio: "zhongjian",
		usable(skill, player) {
			return 1 + (player.hasSkill(skill + "_rewrite", null, null, false) ? 1 : 0);
		},
		filter(event, player) {
			return game.hasPlayer(current => lib.skill.rezhongjian.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			if (!player.storage.rezhongjian_effect) {
				return true;
			}
			return !player.storage.rezhongjian_effect[0]?.includes(target) && !player.storage.rezhongjian_effect[1]?.includes(target);
		},
		line: false,
		log: "notarget",
		async content(event, trigger, player) {
			const { target } = event;
			const { result } = await player
				.chooseControl()
				.set("prompt", "忠鉴：为" + get.translation(target) + "选择获得一项效果")
				.set("choiceList", ["令其于下回合开始前首次造成伤害后弃置两张牌", "令其于下回合开始前首次受到伤害后摸两张牌"])
				.set("ai", () => {
					const player = get.player();
					const { target } = get.event().getParent();
					return get.attitude(player, target) > 0 ? 1 : 0;
				});
			if (typeof result?.index !== "number") {
				return;
			}
			const skill = `${event.name}_effect`;
			player.addTempSkill(skill, { player: "phaseBeginStart" });
			player.storage[skill][result.index].push(target);
			player.markSkill(skill);
		},
		ai: {
			order: 10,
			expose: 0,
			result: {
				player(player, target) {
					if (get.attitude(player, target) == 0) {
						return false;
					}
					var sgn = get.sgn((get.realAttitude || get.attitude)(player, target));
					if (
						game.countPlayer(function (current) {
							return get.sgn((get.realAttitude || get.attitude)(player, current)) == sgn;
						}) <=
						game.countPlayer(function (current) {
							return get.sgn((get.realAttitude || get.attitude)(player, current)) != sgn;
						})
					) {
						return 1;
					}
					return 0.9;
				},
			},
		},
		subSkill: {
			rewrite: { charlotte: true },
			effect: {
				init(player, skill) {
					player.storage[skill] ??= [[], []];
				},
				charlotte: true,
				onremove: true,
				trigger: { global: ["damageSource", "damageEnd"] },
				filter(event, player, name) {
					const index = name == "damageSource" ? 0 : 1;
					const target = name == "damageSource" ? event.source : event.player;
					return target?.isIn() && player.storage["rezhongjian_effect"][index].includes(target);
				},
				forced: true,
				logTarget(event, player, name) {
					return name == "damageSource" ? event.source : event.player;
				},
				async content(event, trigger, player) {
					const [target] = event.targets;
					const index = event.triggername == "damageSource" ? 0 : 1;
					const storage = player.storage[event.name];
					storage[index].remove(target);
					if (storage[0].length + storage[1].length) {
						player.markSkill(event.name);
					} else {
						player.removeSkill(event.name);
					}
					await target[event.triggername == "damageSource" ? "chooseToDiscard" : "draw"](2, true, "he");
					await player.draw();
				},
				intro: {
					markcount(storage) {
						if (!storage) {
							return 0;
						}
						return storage[0].length + storage[1].length;
					},
					mark(dialog, storage, player) {
						if (!storage) {
							return "尚未选择";
						}
						if (player == game.me || player.isUnderControl()) {
							if (storage?.[0]?.length) {
								dialog.addText("弃牌");
								dialog.add([storage[0], "player"]);
							}
							if (storage?.[1]?.length) {
								dialog.addText("摸牌");
								dialog.add([storage[1], "player"]);
							}
						} else {
							dialog.addText(`${get.translation(player)}共选择了${get.cnNumber(storage[0].length + storage[1].length)} 人`);
						}
					},
				},
			},
		},
	},
	recaishi: {
		isSame(event) {
			const cards = [];
			event.player.getHistory("gain", function (evt) {
				if (evt.getParent().name == "draw" && evt.getParent("phaseDraw") == event) {
					cards.addArray(evt.cards);
				}
			});
			if (!cards.length) {
				return "nogain";
			}
			const list = cards.map(card => get.suit(card)).toUniqued();
			if (list.length == 1) {
				return true;
			}
			if (list.length == cards.length) {
				return false;
			}
			return "nogain";
		},
		audio: "caishi",
		trigger: { player: "phaseDrawEnd" },
		filter(event, player) {
			const isSame = lib.skill.recaishi.isSame(event);
			if (isSame == "nogain") {
				return false;
			}
			return isSame || player.isDamaged();
		},
		async cost(event, trigger, player) {
			const isSame = lib.skill.recaishi.isSame(trigger);
			if (isSame) {
				event.result = {
					bool: true,
					cost_data: "rewrite",
				};
			} else if (player.isDamaged()) {
				event.result = await player
					.chooseBool(get.prompt(event.skill), "回复1点体力，然后本回合内不能对自己使用牌")
					.set(
						"choice",
						(() => {
							if (player.countCards("h", "tao")) {
								return false;
							}
							if (player.hp < 2) {
								return true;
							}
							return (
								player.countCards("h", card => {
									const info = get.info(card);
									return info && (info.toself || info.selectTarget == -1) && player.canUse(card, player) && player.getUseValue(card) > 0;
								}) == 0
							);
						})()
					)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (event.cost_data === "rewrite") {
				player.addTempSkill("rezhongjian_rewrite");
			} else {
				await player.recover();
				player.addTempSkill(event.name + "_effect");
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				intro: { content: "本回合内不能对自己使用牌" },
				mod: {
					targetEnabled(card, player, target) {
						if (player == target) {
							return false;
						}
					},
				},
			},
		},
	},
	//刘辩
	shiyuan: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		frequent: true,
		filter(event, player) {
			var num = 1;
			if (_status.currentPhase && _status.currentPhase != player && _status.currentPhase.group == "qun" && player.hasZhuSkill("yuwei", _status.currentPhase)) {
				num = 2;
			}
			return (
				player != event.player &&
				player.getHistory("gain", function (evt) {
					return evt.getParent(2).name == "shiyuan" && evt.cards.length == 2 + get.sgn(event.player.hp - player.hp);
				}).length < num
			);
		},
		content() {
			player.draw(2 + get.sgn(trigger.player.hp - player.hp));
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (get.itemtype(player) !== "player" || player === target) {
						return 1;
					}
					let num = 1,
						ds = 2 + get.sgn(player.hp - target.hp);
					if (player === _status.currentPhase && _status.currentPhase?.group === "qun" && target.hasZhuSkill("yuwei", player)) {
						num = 2;
					}
					if (
						target.getHistory("gain", function (evt) {
							return evt.getParent(2).name === "shiyuan" && evt.cards.length === ds;
						}).length >= num
					) {
						return 1;
					}
					let name = get.name(card);
					if (get.tag(card, "lose") || name === "huogong" || name === "juedou" || name === "tiesuo") {
						return [1, ds];
					}
					if (!target.hasFriend()) {
						return 1;
					}
					return [1, 0.5 * ds];
				},
			},
		},
	},
	dushi: {
		audio: 2,
		global: "dushi2",
		locked: true,
		trigger: { player: "die" },
		forceDie: true,
		direct: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		content() {
			"step 0";
			player
				.chooseTarget("请选择【毒逝】的目标", "选择一名其他角色，令其获得技能【毒逝】", true, lib.filter.notMe)
				.set("forceDie", true)
				.set("ai", function (target) {
					return -get.attitude(_status.event.player, target);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dushi", target);
				target.markSkill("dushi");
				target.addSkills("dushi");
			}
		},
		intro: { content: "您已经获得弘农王的诅咒" },
	},
	dushi2: {
		mod: {
			cardSavable(card, player, target) {
				if (card.name == "tao" && target != player && target.hasSkill("dushi")) {
					return false;
				}
			},
		},
	},
	yuwei: {
		trigger: { player: "shiyuanBegin" },
		filter(event, player) {
			return _status.currentPhase && _status.currentPhase.group == "qun";
		},
		zhuSkill: true,
		forced: true,
		content() {},
		ai: { combo: "shiyuan" },
	},
	//新岩泽(划掉)留赞
	refenyin: {
		audio: 2,
		audioname: ["wufan"],
		trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"] },
		forced: true,
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			var cards = event.getd();
			if (!cards.length) {
				return false;
			}
			var list = [];
			var num = cards.length;
			for (var i = 0; i < cards.length; i++) {
				var card = cards[i];
				list.add(get.suit(card, false));
			}
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.name != "lose" && evt.name != "cardsDiscard") {
					return false;
				}
				if (evt.name == "lose" && evt.position != ui.discardPile) {
					return false;
				}
				if (evt == event || evt.getParent() == event) {
					return false;
				}
				num += evt.cards.length;
				for (var i = 0; i < evt.cards.length; i++) {
					var card = evt.cards[i];
					list.remove(get.suit(card, evt.cards2 && evt.cards2.includes(card) ? evt.player : false));
				}
			});
			player.storage.refenyin_mark2 = num;
			return list.length > 0;
		},
		content() {
			var list = [];
			var list2 = [];
			var cards = trigger.getd();
			for (var i = 0; i < cards.length; i++) {
				var card = cards[i];
				var suit = get.suit(card, false);
				list.add(suit);
				list2.add(suit);
			}
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.name != "lose" && evt.name != "cardsDiscard") {
					return false;
				}
				if (evt.name == "lose" && evt.position != ui.discardPile) {
					return false;
				}
				if (evt == trigger || evt.getParent() == trigger) {
					return false;
				}
				for (var i = 0; i < evt.cards.length; i++) {
					var card = evt.cards[i];
					var suit = get.suit(card, false);
					list.remove(suit);
					list2.add(suit);
				}
			});
			list2.sort();
			player.draw(list.length);
			player.storage.refenyin_mark = list2;
			player.addTempSkill("refenyin_mark");
			player.markSkill("refenyin_mark");
		},
		subSkill: {
			mark: {
				onremove(player) {
					delete player.storage.refenyin_mark;
					delete player.storage.refenyin_mark2;
				},
				intro: {
					content(s, p) {
						var str = "本回合已经进入过弃牌堆的卡牌的花色：";
						for (var i = 0; i < s.length; i++) {
							str += get.translation(s[i]);
						}
						str += "<br>本回合进入过弃牌堆的牌数：";
						str += p.storage.refenyin_mark2;
						return str;
					},
				},
			},
		},
	},
	liji: {
		enable: "phaseUse",
		usable(skill, player) {
			return get.event().liji_num;
		},
		audio: 2,
		onChooseToUse(event) {
			if (game.online) {
				return;
			}
			var num = 0;
			var evt2 = event.getParent();
			if (!evt2.liji_all) {
				evt2.liji_all = game.players.length > 4 ? 8 : 4;
			}
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.name == "cardsDiscard" || (evt.name == "lose" && evt.position == ui.discardPile)) {
					num += evt.cards.length;
				}
			});
			event.set("liji_num", Math.floor(num / evt2.liji_all));
		},
		filterCard: true,
		position: "he",
		check(card) {
			var val = get.value(card);
			if (!_status.event.player.getStorage("refenyin_mark").includes(get.suit(card))) {
				return 12 - val;
			}
			return 8 - val;
		},
		filterTarget: lib.filter.notMe,
		content() {
			target.damage("nocard");
		},
		ai: {
			order: 1,
			result: {
				target: -1.5,
			},
			tag: {
				damage: 1,
			},
		},
	},
	//文鸯
	xinlvli: {
		audio: "lvli",
		trigger: { player: "damageEnd", source: "damageSource" },
		filter(event, player, name) {
			if (name == "damageEnd" && !player.storage.beishui) {
				return false;
			}
			if (player.hp == player.countCards("h")) {
				return false;
			}
			if (player.hp < player.countCards("h") && player.isHealthy()) {
				return false;
			}
			return true;
		},
		usable(skill, player) {
			let num = 1;
			if (player.storage.choujue && player === _status.currentPhase) {
				num++;
			}
			return num;
		},
		async content(event, trigger, player) {
			const num = player.hp - player.countCards("h");
			if (num > 0) {
				await player.draw(num);
			} else {
				await player.recover(-num);
			}
		},
		//group:'lvli3',
	},
	lvli: {
		audio: 2,
		init(player, skill) {
			player.storage[skill] = 0;
		},
		enable: "chooseToUse",
		filter(event, player) {
			if (player.storage.lvli > 1) {
				return false;
			}
			if (player.storage.lvli > 0 && (player != _status.currentPhase || !player.storage.choujue)) {
				return false;
			}
			return event.type != "wuxie" && event.type != "respondShan";
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "wuxie") {
						continue;
					}
					if (name == "sha") {
						list.push(["基本", "", "sha"]);
						list.push(["基本", "", "sha", "fire"]);
						list.push(["基本", "", "sha", "thunder"]);
					} else if (get.type(name) == "trick") {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) == "basic") {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog(event.lvli6 ? get.prompt("lvli") : "膂力", [list, "vcard"]);
			},
			filter(button, player) {
				var evt = _status.event.getParent();
				if (evt && typeof evt.filterCard == "function") {
					return evt.filterCard({ name: button.link[2] }, player, evt);
				}
				return lib.filter.filterCard({ name: button.link[2], isCard: true }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				if (player.countCards("h", button.link[2])) {
					return 0;
				}
				if (_status.event.getParent().type != "phase" && !_status.event.getParent().lvli6) {
					return 1;
				}
				return player.getUseValue({ name: button.link[2], isCard: true });
			},
			backup(links, player) {
				return {
					filterCard() {
						return false;
					},
					audio: "lvli",
					selectCard: -1,
					check(card) {
						return 1;
					},
					viewAs: { name: links[0][2], nature: links[0][3], isCard: true },
				};
			},
			prompt(links, player) {
				return "请选择" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "的目标";
			},
		},
		ai: {
			order: 4,
			result: {
				player: 1,
			},
			threaten: 2.9,
			fireAttack: true,
		},
		group: ["lvli2", "lvli3", "lvli4", "lvli5", "lvli6"],
	},
	lvli2: {
		trigger: { player: ["useCardBefore", "respondBefore"] },
		forced: true,
		popup: false,
		priority: 35,
		sourceSkill: "lvli",
		filter(event, player) {
			return event.skill == "lvli_backup" || event.skill == "lvli5" || event.skill == "lvli4";
		},
		content() {
			"step 0";
			player.logSkill("lvli");
			player.storage.lvli++;
			player.popup(trigger.card.name, trigger.name == "useCard" ? "metal" : "wood");
			"step 1";
			var random = 0.5 + player.countCards("e") * 0.1;
			if (get.isLuckyStar(player)) {
				random = 1;
			}
			if (random >= Math.random()) {
				player.popup("洗具");
			} else {
				player.popup("杯具");
				trigger.cancel();
				if (!trigger.getParent().lvli6) {
					trigger.getParent().goto(0);
				}
				game.broadcastAll(function (str) {
					var dialog = ui.create.dialog(str);
					dialog.classList.add("center");
					setTimeout(function () {
						dialog.close();
					}, 1000);
				}, get.translation(player) + "声明的" + get.translation(trigger.card.name) + "并没有生效");
				game.log("然而什么都没有发生");
				game.delay(2);
			}
		},
	},
	lvli3: {
		trigger: { global: "phaseBefore" },
		forced: true,
		silent: true,
		popup: false,
		sourceSkill: "lvli",
		content() {
			player.storage.lvli = 0;
		},
	},
	lvli4: {
		log: false,
		enable: "chooseToUse",
		sourceSkill: "lvli",
		viewAsFilter(player) {
			if (player.storage.lvli > 1) {
				return false;
			}
			if (player.storage.lvli > 0 && (player != _status.currentPhase || !player.storage.choujue)) {
				return false;
			}
			return true;
		},
		filterCard() {
			return false;
		},
		selectCard: -1,
		viewAs: {
			name: "shan",
			isCard: true,
		},
		ai: {
			skillTagFilter(player) {
				if (player.storage.lvli > 1) {
					return false;
				}
				if (player.storage.lvli > 0 && (player != _status.currentPhase || !player.storage.choujue)) {
					return false;
				}
				return true;
			},
			threaten: 1.5,
			respondShan: true,
		},
	},
	lvli5: {
		log: false,
		enable: "chooseToUse",
		sourceSkill: "lvli",
		viewAsFilter(player) {
			if (player.storage.lvli > 1) {
				return false;
			}
			if (player.storage.lvli > 0 && (player != _status.currentPhase || !player.storage.choujue)) {
				return false;
			}
			return true;
		},
		filterCard() {
			return false;
		},
		selectCard: -1,
		viewAs: {
			name: "wuxie",
			isCard: true,
		},
	},
	lvli6: {
		trigger: { player: "damageEnd" },
		direct: true,
		sourceSkill: "lvli",
		filter(event, player) {
			if (!player.storage.beishui) {
				return false;
			}
			if (player.storage.lvli > 1) {
				return false;
			}
			if (player.storage.lvli > 0 && (player != _status.currentPhase || !player.storage.choujue)) {
				return false;
			}
			return true;
		},
		content() {
			var next = player.chooseToUse();
			next.set("norestore", true);
			next.set("_backupevent", "lvli");
			next.backup("lvli");
			next.set("lvli6", true);
		},
	},
	choujue: {
		derivation: ["beishui", "qingjiao"],
		trigger: { global: "phaseAfter" },
		audio: 2,
		skillAnimation: true,
		animationColor: "water",
		juexingji: true,
		forced: true,
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = false;
			}
		},
		filter(event, player) {
			if (player.storage.choujue) {
				return false;
			}
			return Math.abs(player.hp - player.countCards("h")) >= 3;
		},
		content() {
			player.awakenSkill(event.name);
			player.storage.choujue = true;
			player.loseMaxHp();
			player.addSkills("beishui");
		},
	},
	beishui: {
		trigger: { player: "phaseZhunbeiBegin" },
		audio: 2,
		skillAnimation: "epic",
		animationColor: "thunder",
		juexingji: true,
		forced: true,
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = false;
			}
		},
		filter(event, player) {
			if (player.storage.beishui) {
				return false;
			}
			return Math.min(player.hp, player.countCards("h")) < 2;
		},
		content() {
			player.awakenSkill(event.name);
			player.storage.beishui = true;
			player.loseMaxHp();
			player.addSkills("qingjiao");
		},
	},
	qingjiao: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			// /-?
			// if (!ui.cardPile.hasChildNodes() && !ui.discardPile.hasChildNodes()) {
			// }
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (var i of hs) {
				if (!lib.filter.cardDiscardable(i, player, "qingjiao")) {
					return false;
				}
			}
			return true;
		},
		//check:function(event,player){
		//	return player.countCards('h')<=player.hp;
		//},
		content() {
			"step 0";
			player.chooseToDiscard(true, "h", player.countCards("h"));
			"step 1";
			var evt = trigger.getParent();
			if (evt && evt.getParent && !evt.qingjiao) {
				evt.qingjiao = true;
				var next = game.createEvent("qingjiao_discard", false, evt.getParent());
				next.player = player;
				next.setContent(function () {
					var hs = player.getCards("he");
					if (hs.length) {
						player.discard(hs);
					}
				});
			}
			"step 2";
			var list = [];
			var typelist = [];
			var getType = function (card) {
				var sub = get.subtype(card);
				if (sub) {
					return sub;
				}
				return card.name;
			};
			for (var i = 0; i < ui.cardPile.childElementCount; i++) {
				var node = ui.cardPile.childNodes[i];
				var typex = getType(node);
				if (!typelist.includes(typex)) {
					list.push(node);
					typelist.push(typex);
					if (list.length >= 8) {
						break;
					}
				}
			}
			if (list.length < 8) {
				for (var i = 0; i < ui.discardPile.childElementCount; i++) {
					var node = ui.discardPile.childNodes[i];
					var typex = getType(node);
					if (!typelist.includes(typex)) {
						list.push(node);
						typelist.push(typex);
						if (list.length >= 8) {
							break;
						}
					}
				}
			}
			player.gain(list, "gain2");
		},
	},
	//王双
	spzhuilie: {
		mod: {
			targetInRange(card) {
				if (card.name == "sha") {
					return true;
				}
			},
		},
		audio: 2,
		trigger: { player: "useCardToTargeted" },
		filter(event, player) {
			return event.card && event.card.name == "sha" && !player.inRange(event.target);
		},
		forced: true,
		logTarget: "target",
		async content(event, trigger, player) {
			const next = player.judge(function (card) {
				var type = get.subtype(card);
				return ["equip1", "equip4", "equip3", "equip6"].includes(type) ? 6 : -6;
			});
			next.judge2 = function (result) {
				return result.bool;
			};
			const { result } = await next;
			if (trigger.getParent().addCount !== false) {
				trigger.getParent().addCount = false;
				var stat = player.getStat();
				if (stat && stat.card && stat.card.sha) {
					stat.card.sha--;
				}
			}
			if (result.bool === true) {
				var map = trigger.customArgs;
				var id = trigger.target.playerid;
				if (!map[id]) {
					map[id] = {};
				}
				if (typeof map[id].extraDamage != "number") {
					map[id].extraDamage = 0;
				}
				map[id].extraDamage += trigger.target.hp - 1;
			} else if (result.bool === false && get.type(result.card) != "basic") {
				await player.loseHp();
				await player.gain(result.card);
			}
		},
		group: "spzhuilie_sha",
		subSkill: {
			sha: {
				silent: true,
				charlotte: true,
				trigger: { player: "useCardToTargeted" },
				filter(event, player) {
					return event.card && event.card.name == "sha";
				},
				async content(event, trigger, player) {
					trigger.target.addTempSkill("qinggang2");
					trigger.target.storage.qinggang2.add(trigger.card);
					trigger.target.markSkill("qinggang2");
				},
			},
		},
	},
	spzhuilie2: {
		onremove: true,
		intro: {
			content: "使用【杀】的次数上限+#",
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + player.countMark("spzhuilie2");
				}
			},
		},
	},
	//花鬘
	manyi: {
		audio: 2,
		audioname: ["mengyou", "menghuo", "zhurong"],
		trigger: { target: "useCardToBefore" },
		filter(event, player) {
			return event.card.name == "nanman";
		},
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			effect: {
				target(card) {
					if (card.name == "nanman") {
						return "zeroplayertarget";
					}
				},
			},
		},
		group: "manyi_single",
		subSkill: {
			single: {
				trigger: {
					player: "enterGame",
					global: "gameDrawAfter",
				},
				filter(event, player) {
					return get.mode() == "single" && _status.mode == "normal";
				},
				direct: true,
				content() {
					player.chooseUseTarget("nanman", get.prompt("manyi"), "视为使用一张【南蛮入侵】").logSkill = "manyi";
				},
			},
		},
	},
	mansi: {
		audio: 2,
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.card?.name == "nanman";
		},
		frequent: true,
		async content(event, trigger, player) {
			player.addMark(event.name, 1, false);
			await player.draw();
		},
		intro: { content: "已因此技能得到了#张牌" },
		group: "mansi_viewas",
		subSkill: {
			viewas: {
				audio: "mansi",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					const hs = player.getCards("h");
					if (!hs.length) {
						return false;
					}
					if (hs.some(card => game.checkMod(card, player, "unchanged", "cardEnabled2", player) === false)) {
						return false;
					}
					return true;
				},
				viewAs: { name: "nanman" },
				filterCard: true,
				selectCard: -1,
				position: "h",
				ai: {
					order: 0.1,
					nokeep: true,
					skillTagFilter(player, tag, arg) {
						if (tag === "nokeep") {
							return (!arg || (arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && !player.getStat("skill").mansi_viewas && player.hasCard(card => get.name(card) !== "tao", "h");
						}
					},
				},
			},
		},
	},
	souying: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player, name) {
			if (!player.countCards("he")) {
				return false;
			}
			if (!event.targets || event.targets.length != 1 || event.player == event.target) {
				return false;
			}
			if (event.card.name != "sha" && get.type(event.card) != "trick") {
				return false;
			}
			if (name == "useCardToPlayered") {
				if (!event.cards.filterInD().length) {
					return false;
				}
				const { target } = event;
				return player.getHistory("useCard", evt => evt.targets?.includes(target)).indexOf(event.getParent()) > 0;
			} else {
				const { player: source } = event;
				return source.getHistory("useCard", evt => evt.targets?.includes(player)).indexOf(event.getParent()) > 0;
			}
		},
		usable: 1,
		async cost(event, trigger, player) {
			let prompt, target;
			const next = player.chooseToDiscard("he");
			if (event.triggername == "useCardToTargeted") {
				target = trigger.player;
				prompt = `令${get.translation(trigger.card)}对你无效`;
				next.set("goon", -get.effect(player, trigger.card, trigger.player, player));
			} else {
				target = trigger.targets[0];
				prompt = `弃置一张牌，并获得${get.translation(trigger.cards.filterInD())}`;
				next.set("goon", get.value(trigger.cards.filterInD()));
			}
			next.set("prompt", get.prompt(event.skill, target));
			next.set("prompt2", prompt);
			next.set("ai", card => {
				return get.event("goon") - get.value(card);
			});
			next.set("logSkill", [event.skill, target]);
			event.result = await next.forResult();
		},
		popup: false,
		async content(event, trigger, player) {
			if (event.triggername == "useCardToTargeted") {
				trigger.excluded.add(player);
			} else if (trigger.cards?.someInD()) {
				await player.gain(trigger.cards.filterInD(), "gain2");
			}
		},
		ai: { expose: 0.25 },
	},
	zhanyuan: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.getAllHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent(2).name == "mansi").reduce((num, evt) => num + evt.cards.length, 0) >= 7;
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "soil",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp();
			await player.recover();
			if (!game.hasPlayer(current => current != player && current.hasSex("male"))) {
				return;
			}
			const { result } = await player
				.chooseTarget("是否失去〖蛮嗣〗，令一名其他男性角色和自己一同获得技能〖系力〗？", (card, player, target) => {
					return target != player && target.hasSex("male");
				})
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target);
				});
			if (result?.bool && result?.targets?.length) {
				const target = result.targets[0];
				player.line(target, "fire");
				await player.changeSkills(["hmxili"], ["mansi"]);
				await target.addSkills("hmxili");
			}
		},
		derivation: "hmxili",
		ai: { combo: "mansi" },
	},
	hmxili: {
		audio: 2,
		trigger: { global: "damageBegin1" },
		filter(event, player) {
			return event.source?.hasSkill("hmxili") && event.source != player && player !== _status.currentPhase && !event.player.hasSkill("hmxili") && player.countCards("he") > 0;
		},
		usable: 1,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt(event.skill, trigger.source), `是否弃置一张牌，令${get.translation(trigger.source)}对${get.translation(trigger.player)}的伤害+1，且你与其各摸两张牌？`, "he", "chooseonly")
				.set("ai", card => {
					if (get.event("eff") > 0) {
						return 7 - get.value(card);
					}
					return 0;
				})
				.set("eff", get.damageEffect(trigger.player, trigger.source, player) + 0.2 * get.attitude(player, trigger.source))
				.forResult();
		},
		logTarget: "source",
		async content(event, trigger, player) {
			await player.discard(event.cards);
			await game.asyncDraw([trigger.source, player].sortBySeat(), 2);
			trigger.num++;
			await game.delayx();
		},
	},
	//吴兰雷铜
	wlcuorui: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			if (!["identity", "guozhan"].includes(get.mode())) {
				return game.hasPlayer(function (current) {
					return current.isFriendOf(player) && current.countDiscardableCards(player, "hej") > 0;
				});
			}
			return game.hasPlayer(current => {
				return get.distance(player, current) <= 1 && current.countDiscardableCards(player, "hej") > 0;
			});
		},
		async cost(event, trigger, player) {
			if (!["identity", "guozhan"].includes(get.mode())) {
				event.result = await player
					.chooseTarget(function (card, player, target) {
						return target.isFriendOf(player) && target.countDiscardableCards(player, "hej") > 0;
					}, get.prompt2(event.skill))
					.set("ai", function (target) {
						let min = 10;
						if (
							target.hasCard(card => {
								const val = get.value(card, target);
								if (val < 0 && card.name !== "tengjia") {
									return true;
								}
								if (val < min) {
									min = val;
								}
							}, "e")
						) {
							return 10;
						}
						if (
							target.hasCard(card => {
								const eff = get.effect(
									target,
									{
										name: card.viewAs || card.name,
										cards: [card],
									},
									target,
									target
								);
								if (eff < 0) {
									return true;
								}
								if (eff < min) {
									min = eff;
								}
							}, "j")
						) {
							return 10;
						}
						if (!get.event("discard")) {
							return 0;
						}
						if (min > 6 && target.countCards("h")) {
							min = 6;
						}
						return 7 - min - 1 / (1 + target.countCards("h"));
					})
					.set(
						"discard",
						game.hasPlayer(current => {
							if (current.isFriendOf(player)) {
								return false;
							}
							let values = {};
							current.countCards("e", card => {
								const color = get.color(card);
								if (!values[color]) {
									values[color] = 0;
								}
								values[color] += Math.max(0, get.value(card));
							});
							return Math.max(...Object.values(values)) > 8;
						})
					)
					.forResult();
			} else {
				event.result = await player
					.chooseTarget(function (card, player, target) {
						return get.distance(player, target) <= 1 && target.countDiscardableCards(player, "hej") > 0;
					}, get.prompt2(event.skill))
					.set("ai", function (target) {
						let min = 10;
						const player = get.event("player"),
							att = get.attitude(player, target);
						if (att === 0) {
							min = 0;
						}
						if (
							target.hasCard(card => {
								const val = get.value(card, target);
								if (att < 0) {
									if (val > 0) {
										min = Math.min(min, -val - 6);
									}
									return false;
								}
								if (val < 0 && card.name !== "tengjia") {
									return true;
								}
								if (val < min) {
									min = val;
								}
							}, "e")
						) {
							return 12;
						}
						if (
							target.hasCard(card => {
								const eff = get.effect(
									target,
									{
										name: card.viewAs || card.name,
										cards: [card],
									},
									target,
									target
								);
								if (att < 0) {
									if (eff < 0) {
										min = Math.min(min, eff - 6);
									}
									return false;
								}
								if (eff < 0) {
									return true;
								}
								if (eff < min) {
									min = eff;
								}
							}, "j")
						) {
							return 14;
						}
						if (
							!game.hasPlayer(current => {
								if (player === current || target === current || get.attitude(player, current) > 0) {
									return false;
								}
								let values = {};
								current.countCards("e", card => {
									const color = get.color(card);
									if (!values[color]) {
										values[color] = 0;
									}
									values[color] += Math.max(0, get.value(card));
								});
								return Math.max(...Object.values(values)) > 8;
							})
						) {
							return 0;
						}
						if (att <= 0) {
							return 7 - min + 1 / (1 + target.countCards("h"));
						}
						if (min > 6 && target.countCards("h")) {
							min = 6;
						}
						return 7 - min - 1 / (1 + target.countCards("h"));
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player.discardPlayerCard(target, "hej", true).forResult();
			const card = result.cards[0];
			const str = ["identity", "guozhan"].includes(get.mode()) ? "另一名其他角色" : "对手";
			const filter = ["identity", "guozhan"].includes(get.mode())
				? current => {
						if (current == player || current == target) {
							return false;
						}
						return true;
				  }
				: current => {
						return current.isEnemyOf(player);
				  };
			const list = [];
			if (
				game.hasPlayer(function (current) {
					return filter(current) && current.countCards("h");
				})
			) {
				list.push("展示手牌");
			}
			if (
				game.hasPlayer(function (current) {
					return filter(current) && current.countCards("e", { color: get.color(card) });
				})
			) {
				list.push("弃置装备");
			}
			if (!list.length) {
				return;
			}
			let result2;
			if (list.length == 1) {
				result2 = { control: list[0] };
			} else {
				result2 = await player
					.chooseControl(list)
					.set("prompt", "挫锐：展示" + str + "的至多两张手牌，或弃置" + str + "装备区内至多两张" + get.translation(get.color(card)) + "牌")
					.set(
						"resultx",
						(function () {
							let color = get.color(card);
							if (
								game.hasPlayer(current => {
									if (!filter(current) || get.attitude(player, current) > 0) {
										return false;
									}
									return (
										current.countCards("e", card => {
											if (get.color(card) === color) {
												return Math.max(0, get.value(card));
											}
											return 0;
										}) > 8
									);
								})
							) {
								return 1;
							}
							return 0;
						})()
					)
					.set("ai", () => _status.event.resultx)
					.forResult();
			}
			if (result2.control == "展示手牌") {
				let dialog = ["请选择要展示的牌"];
				let targets = game
					.filterPlayer(function (current) {
						return filter(current) && current.countCards("h");
					})
					.sortBySeat();
				for (let i of targets) {
					dialog.push('<div class="text center">' + get.translation(i) + "</div>");
					if (player.hasSkillTag("viewHandcard", null, i, true)) {
						dialog.push(i.getCards("h"));
					} else {
						dialog.push([i.getCards("h"), "blank"]);
					}
				}
				const result3 = await player
					.chooseButton([1, 2], true)
					.set("createDialog", dialog)
					.set("color", get.color(card))
					.set("filterButton", button => {
						if (!["identity", "guozhan"].includes(get.mode())) {
							return true;
						}
						if (!ui.selected.buttons.length) {
							return true;
						}
						return get.owner(button.link) == get.owner(ui.selected.buttons[0].link);
					})
					.set("ai", button => {
						let color = get.color(button.link) == _status.event.color;
						return color ? Math.random() : 0.35;
					})
					.forResult();
				await player.showCards(result3.links);
				let map = {};
				let map2 = {};
				for (let i of result3.links) {
					let id = get.owner(i).playerid;
					if (!map[id]) {
						map[id] = [];
					}
					map[id].push(i);
					if (get.color(i) != get.color(card)) {
						continue;
					}
					if (!map2[id]) {
						map2[id] = [];
					}
					map2[id].push(i);
				}
				for (let i in map) {
					let source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
					if (map2[i]) {
						await player.gain(map2[i], source, "bySelf", "give");
					}
					player.line(source);
					game.log(player, "展示了", source, "的", map[i]);
				}
			} else {
				let dialog = ["请选择要弃置的牌"];
				let targets = game
					.filterPlayer(function (current) {
						return (
							filter(current) &&
							current.countCards("e", function (cardx) {
								return get.color(card) == get.color(cardx);
							})
						);
					})
					.sortBySeat();
				for (let i of targets) {
					dialog.push('<div class="text center">' + get.translation(i) + "</div>");
					dialog.push(
						i.getCards("e", function (cardx) {
							return get.color(card) == get.color(cardx);
						})
					);
				}
				const result3 = await player
					.chooseButton([1, 2], true)
					.set("createDialog", dialog)
					.set("filterButton", button => {
						if (!["identity", "guozhan"].includes(get.mode())) {
							return true;
						}
						if (!ui.selected.buttons.length) {
							return true;
						}
						return get.owner(button.link) == get.owner(ui.selected.buttons[0].link);
					})
					.set("ai", function (button) {
						let owner = get.owner(button.link);
						return get.value(button.link, owner);
					})
					.forResult();
				let map = {};
				for (let i of result3.links) {
					if (get.color(i) != get.color(card)) {
						continue;
					}
					let id = get.owner(i).playerid;
					if (!map[id]) {
						map[id] = [];
					}
					map[id].push(i);
				}
				for (let i in map) {
					const next = (_status.connectMode ? lib.playerOL : game.playerMap)[i].discard(map[i], "notBySelf");
					next.discarder = player;
					await next;
				}
			}
		},
	},
	kuiji: {
		audio: 2,
		usable: 1,
		enable: "phaseUse",
		filter(event, player) {
			if (player.hasJudge("bingliang")) {
				return false;
			}
			return (
				player.countCards("hes", function (card) {
					return get.color(card) == "black" && get.type(card) == "basic";
				}) > 0
			);
		},
		position: "hes",
		discard: false,
		lose: false,
		delay: false,
		prepare(cards, player) {
			player.$give(cards, player, false);
		},
		filterCard(card, player, event) {
			return get.color(card) == "black" && get.type(card) == "basic" && player.canAddJudge({ name: "bingliang", cards: [card] });
		},
		selectTarget: -1,
		filterTarget(card, player, target) {
			return player == target;
		},
		check(card) {
			return 9 - get.value(card);
		},
		// onuse:function(links,player){
		// 	var next=game.createEvent('kuiji_content',false,_status.event.getParent());
		// 	next.player=player;
		// 	next.setContent(lib.skill.kuiji.kuiji_content);
		// },
		// kuiji_content:function(){
		content() {
			"step 0";
			player.addJudge({ name: "bingliang" }, cards);
			player.draw();
			"step 1";
			var next = player.chooseTarget().set("ai", function (target) {
				let player = _status.event.player;
				if (
					target.hasSkillTag(
						"filterDamage",
						null,
						{
							player: player,
						},
						true
					)
				) {
					return get.damageEffect(target, player, player);
				}
				return 2 * get.damageEffect(target, player, player);
			});
			if (!["identity", "guozhan"].includes(get.mode())) {
				next.set("prompt", "选择一名体力值最大的敌方角色，对其造成2点伤害");
				next.set("filterTarget", function (card, player, target) {
					return (
						target.isEnemyOf(player) &&
						!game.hasPlayer(function (current) {
							return current.isEnemyOf(player) && current.hp > target.hp;
						})
					);
				});
			} else {
				next.set("prompt", "选择一名除你外体力值最大的角色，对其造成2点伤害");
				next.set("filterTarget", function (card, player, target) {
					return (
						player != target &&
						!game.hasPlayer(function (current) {
							return current != player && current.hp > target.hp;
						})
					);
				});
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				target.damage(2);
			}
		},
		ai: {
			result: {
				target(player, target) {
					let es;
					if (["identity", "guozhan"].includes(get.mode())) {
						es = game.hasPlayer(i => {
							return (
								i != player &&
								!game.hasPlayer(j => {
									return player !== j && j.hp > i.hp;
								}) &&
								get.attitude(player, i) < 0
							);
						});
					} else {
						es = game.hasPlayer(i => {
							return (
								i.isEnemyOf(player) &&
								!game.hasPlayer(j => {
									return j.hp > i.hp && j.isEnemyOf(player);
								}) &&
								get.attitude(player, i) < 0
							);
						});
					}
					if (es) {
						return 2;
					}
					return -1.5;
				},
			},
			order: 12,
		},
		group: "kuiji_dying",
		subSkill: {
			dying: {
				trigger: { global: "dying" },
				filter(event, player) {
					let evt = event.getParent(2);
					return evt && evt.name == "kuiji";
				},
				locked: true,
				direct: true,
				content() {
					"step 0";
					var list;
					if (["identity", "guozhan"].includes(get.mode())) {
						list = game
							.filterPlayer(current => {
								return (
									current !== trigger.player &&
									!game.hasPlayer(i => {
										return trigger.player !== i && i.hp < current.hp;
									})
								);
							})
							.filter(i => i.isDamaged());
					} else {
						list = game
							.filterPlayer(current => {
								return (
									current.isFriendOf(player) &&
									!game.hasPlayer(i => {
										return i.hp < current.hp && i.isFriendOf(player);
									})
								);
							})
							.filter(i => i.isDamaged());
					}
					if (list.length > 1) {
						player
							.chooseTarget(
								"溃击：选择一名角色回复1点体力",
								(card, player, target) => {
									return _status.event.list.includes(target);
								},
								true
							)
							.set("list", list)
							.set("ai", target => {
								return get.recoverEffect(target, player, _status.event.player);
							});
					} else if (list.length) {
						event._result = { bool: true, targets: list };
					} else {
						event._result = { bool: false };
					}
					"step 1";
					if (result.bool) {
						let target = result.targets[0];
						player.logSkill("kuiji", target);
						target.recover();
					}
				},
			},
		},
	},
	//蒲元
	pytianjiang: {
		audio: 2,
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
			"step 0";
			var i = 0;
			var list = [];
			while (i++ < 2) {
				var card = get.cardPile(
					function (card) {
						if (get.type(card) != "equip") {
							return false;
						}
						return list.length == 0 || get.subtype(card) != get.subtype(list[0]);
					},
					false,
					"random"
				);
				if (card) {
					list.push(card);
				}
			}
			if (!list.length) {
				event.finish();
				return;
			}
			event.list = list;
			player.gain(event.list, "gain2");
			"step 1";
			game.delay(1);
			var card = event.list.shift();
			if (player.getCards("h").includes(card)) {
				player.$give(card, player, false);
				player.equip(card);
			}
			if (event.list.length) {
				event.redo();
			}
		},
		group: "pytianjiang_move",
	},
	pytianjiang_move: {
		audio: "pytianjiang",
		prompt: "将装备区里的一张牌移动至其他角色的装备区",
		enable: "phaseUse",
		position: "e",
		sourceSkill: "pytianjiang",
		filter(event, player) {
			return player.countCards("e") > 0;
		},
		check() {
			return 1;
		},
		filterCard: true,
		filterTarget(event, player, target) {
			return target != player && target.canEquip(ui.selected.cards[0], true);
		},
		prepare: "give",
		discard: false,
		lose: false,
		content() {
			"step 0";
			target.equip(cards[0]);
			"step 1";
			if (cards[0].name.indexOf("pyzhuren_") == 0 && !player.getCards("e").includes(cards[0])) {
				player.draw(2);
			}
		},
		ai: {
			order: (item, player) => {
				if (player.hasCard(i => get.subtype(i) === "equip1", "h")) {
					return 11;
				}
				return 1;
			},
			expose: 0.2,
			result: {
				target(player, target) {
					if (ui.selected.cards.length) {
						let card = ui.selected.cards[0],
							tv = get.value(card, target),
							sub = get.subtype(card);
						if (sub === "equip1") {
							let ev = Infinity,
								te = target.getEquips(1);
							if (!te.length) {
								return tv;
							}
							te.forEach(i => {
								ev = Math.min(ev, get.value(i));
							});
							if (card.name.indexOf("pyzhuren_") == 0) {
								return 2 + tv - ev;
							}
							return tv - ev;
						}
						if (target.hasCard(i => get.subtype(i) === sub, "he")) {
							return 0;
						}
						let pv = get.value(card, player);
						if (pv > 0 && Math.abs(tv) <= pv) {
							return 0;
						}
						return tv;
					}
					return 0;
				},
			},
		},
	},
	pyzhuren: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: 1,
		check(card) {
			var player = _status.event.player;
			var name = "pyzhuren_" + card[card.name == "shandian" ? "name" : "suit"];
			if (!lib.card[name] || (_status.pyzhuren && _status.pyzhuren[name])) {
				if (!player.countCards("h", "sha")) {
					return 4 - get.value(card);
				}
				return 0;
			}
			return 7 - get.value(card);
		},
		content() {
			//player.addSkill('pyzhuren_destroy');
			if (!_status.pyzhuren) {
				_status.pyzhuren = {};
			}
			var rand = 0.85;
			var num = get.number(cards[0]);
			if (num > 4) {
				rand = 0.9;
			}
			if (num > 8) {
				rand = 0.95;
			}
			if (num > 12 || cards[0].name == "shandian" || get.isLuckyStar(player)) {
				rand = 1;
			}
			var name = "pyzhuren_" + cards[0][cards[0].name == "shandian" ? "name" : "suit"];
			if (!lib.card[name] || _status.pyzhuren[name] || Math.random() > rand) {
				player.popup("杯具");
				game.log(player, "锻造失败");
				var card = get.cardPile(function (card) {
					return card.name == "sha";
				});
				if (card) {
					player.gain(card, "gain2");
				}
			} else {
				_status.pyzhuren[name] = true;
				var card = game.createCard(name, cards[0].name == "shandian" ? "spade" : cards[0].suit, 1);
				card.destroyed = "discardPile";
				player.gain(card, "gain2");
			}
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	pyzhuren_heart: {
		audio: true,
		trigger: { source: "damageSource" },
		usable: 1,
		equipSkill: true,
		filter(event, player) {
			return event.getParent().name == "sha";
		},
		content() {
			"step 0";
			player.judge(function (card) {
				var player = _status.event.getParent("pyzhuren_heart").player;
				if (player.isHealthy() && get.color(card) == "red") {
					return 0;
				}
				return 2;
			});
			"step 1";
			switch (result.color) {
				case "red":
					player.recover();
					break;
				case "black":
					player.draw(2);
					break;
				default:
					break;
			}
		},
		ai: {
			equipValue(card, player) {
				if (player.isDamaged()) {
					return 4.5;
				}
				return 6;
			},
			basic: {
				equipValue: 4.5,
			},
		},
	},
	pyzhuren_diamond: {
		audio: true,
		trigger: { source: "damageBegin1" },
		usable: 2,
		equipSkill: true,
		locked: false,
		mod: {
			cardUsable(card, player, num) {
				var cardx = player.getEquip("pyzhuren_diamond");
				if (card.name == "sha" && (!cardx || player.hasSkill("pyzhuren_diamond", null, false) || (!_status.pyzhuren_diamond_temp && !ui.selected.cards.includes(cardx)))) {
					return num + 1;
				}
			},
			cardEnabled2(card, player) {
				if (!_status.event.addCount_extra || player.hasSkill("pyzhuren_diamond", null, false)) {
					return;
				}
				if (card && card == player.getEquip("pyzhuren_diamond")) {
					_status.pyzhuren_diamond_temp = true;
					var bool = lib.filter.cardUsable(get.autoViewAs({ name: "sha" }, ui.selected.cards.concat([card])), player);
					delete _status.pyzhuren_diamond_temp;
					if (!bool) {
						return false;
					}
				}
			},
		},
		filter(event, player) {
			if (event.getParent().name != "sha") {
				return false;
			}
			return (
				player.countCards("he", card => {
					return card != player.getEquip("pyzhuren_diamond");
				}) > 0
			);
		},
		async cost(event, trigger, player) {
			const next = player.chooseToDiscard(
				"he",
				(card, player) => {
					return card != player.getEquip("pyzhuren_diamond");
				},
				get.prompt(event.name.slice(0, -5), trigger.player),
				"弃置一张牌，令即将对其造成的伤害+1"
			);
			next.set("target", trigger.player);
			next.set("ai", card => {
				const { goon, target } = get.event();
				if (goon) {
					return 30 / (1 + target.hp) - get.value(card);
				}
				return -1;
			});
			next.set(
				"goon",
				get.attitude(player, trigger.player) < 0 &&
					!trigger.player.hasSkillTag("filterDamage", null, {
						player: player,
						card: trigger.card,
					}) &&
					get.damageEffect(trigger.player, player, player, get.natureList(trigger)) > 0
			);
			event.result = await next.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.num++;
		},
		ai: {
			expose: 0.25,
			equipValue(card, player) {
				return Math.min(7, 3.6 + player.countCards("h") / 2);
			},
			basic: { equipValue: 4.5 },
		},
	},
	pyzhuren_club: {
		audio: true,
		trigger: { player: "useCard2" },
		direct: true,
		equipSkill: true,
		filter(event, player) {
			if (event.card.name != "sha" && get.type(event.card) != "trick") {
				return false;
			}
			var info = get.info(event.card);
			if (info.allowMultiple == false) {
				return false;
			}
			var num = player.getHistory("useSkill", function (evt) {
				return evt.skill == "pyzhuren_club";
			}).length;
			if (num >= 2) {
				return false;
			}
			if (event.targets && !info.multitarget) {
				if (
					game.hasPlayer(function (current) {
						return lib.filter.targetEnabled2(event.card, player, current) && !event.targets.includes(current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var prompt2 = "为" + get.translation(trigger.card) + "额外指定一个目标";
			player
				.chooseTarget([1, player.storage.fumian_red], get.prompt(event.name), function (card, player, target) {
					var player = _status.event.player;
					if (_status.event.targets.includes(target)) {
						return false;
					}
					return lib.filter.targetEnabled2(_status.event.card, player, target);
				})
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, player, player);
				})
				.set("targets", trigger.targets)
				.set("card", trigger.card);
			"step 1";
			if (result.bool) {
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
				event.targets = result.targets;
			}
			"step 2";
			if (event.targets) {
				player.logSkill(event.name, event.targets);
				trigger.targets.addArray(event.targets);
			}
		},
		ai: {
			equipValue(card, player) {
				if (player.getEnemies().length < 2) {
					if (player.isDamaged()) {
						return 0;
					}
					return 1;
				}
				return 4.5;
			},
			basic: {
				equipValue: 4.5,
			},
		},
		subSkill: {
			lose: {
				audio: "pyzhuren_club",
				forced: true,
				charlotte: true,
				equipSkill: true,
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter: (event, player) => {
					return player.isDamaged() && !player.hasSkillTag("unequip2");
				},
				getIndex(event, player) {
					const evt = event.getl(player);
					const lostCards = [];
					evt.es.forEach(card => {
						const VEquip = evt.vcard_map.get(card);
						if (VEquip.name === "pyzhuren_club") {
							lostCards.add(VEquip);
						}
					});
					return lostCards.length;
				},
				async content(event, trigger, player) {
					await player.recover();
				},
			},
		},
	},
	pyzhuren_spade: {
		audio: true,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha"; //&&event.targets.length==1&&get.color(event.card)=='black';
		},
		check(event, player) {
			return get.attitude(player, event.target) <= 0;
		},
		equipSkill: true,
		logTarget: "target",
		content() {
			var num = player.getHistory("useSkill", function (evt) {
				return evt.skill == "pyzhuren_spade";
			}).length;
			trigger.target.loseHp(Math.min(num, 5)); //.set('source',player);
		},
		ai: {
			equipValue(card, player) {
				return 1 + 4 * Math.min(5, player.getCardUsable("sha"));
			},
			basic: {
				equipValue: 5,
			},
			jueqing: true,
			unequip_ai: true,
			skillTagFilter(player, tag, arg) {
				if (tag == "unequip_ai") {
					return arg && arg.name === "sha";
				}
			},
		},
	},
	pyzhuren_shandian: {
		audio: true,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha"; //&&event.targets.length==1;
		},
		check(event, player) {
			return get.attitude(player, event.target) <= 0;
		},
		equipSkill: true,
		logTarget: "target",
		content() {
			"step 0";
			trigger.target.judge(function (card) {
				var suit = get.suit(card);
				if (suit == "spade") {
					return -10;
				}
				if (suit == "club") {
					return -5;
				}
				return 0;
			}).judge2 = function (result) {
				return result.color == "black" ? true : false;
			};
			"step 1";
			if (result.suit == "spade") {
				trigger.target.damage(3, "thunder");
				//trigger.getParent().excluded.add(trigger.target);
			} else if (result.suit == "club") {
				trigger.target.damage("thunder");
				player.recover();
				player.draw();
			}
		},
		ai: {
			equipValue(card, player) {
				if (player.isDamaged()) {
					return 6;
				}
				return 4.8;
			},
			basic: {
				equipValue: 5,
			},
		},
	},
	//管辂和葛玄
	gxlianhua: {
		derivation: ["reyingzi", "reguanxing", "xinzhiyan", "gongxin"],
		audio: 2,
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = {
					red: 0,
					black: 0,
				};
			}
		},
		marktext: "丹",
		intro: {
			name: "丹血",
			markcount(storage) {
				return storage.red + storage.black;
			},
			content(storage) {
				return "共有" + (storage.red + storage.black) + "个标记";
			},
		},
		trigger: { global: "damageEnd" },
		forced: true,
		locked: false,
		filter(event, player) {
			return event.player != player && event.player.isIn() && _status.currentPhase != player;
		},
		content() {
			player.storage.gxlianhua[player.getFriends().includes(trigger.player) ? "red" : "black"]++;
			player.markSkill("gxlianhua");
		},
		group: "gxlianhua_harmonia",
		subSkill: {
			harmonia: {
				forced: true,
				audio: "gxlianhua",
				sub: true,
				trigger: { player: "phaseZhunbeiBegin" },
				//filter:function(event,player){
				//	return player.storage.gxlianhua&&player.storage.gxlianhua.red+player.storage.gxlianhua.black>0;
				//},
				content() {
					var cards = [];
					var cards2 = [];
					var skill = "";
					var red = player.storage.gxlianhua.red;
					var black = player.storage.gxlianhua.black;
					player.storage.gxlianhua = { red: 0, black: 0 };
					player.unmarkSkill("gxlianhua");
					if (red + black < 4) {
						cards = ["tao"];
						skill = "reyingzi";
					} else if (red > black) {
						cards = ["wuzhong"];
						skill = "reguanxing";
					} else if (red < black) {
						cards = ["shunshou"];
						skill = "xinzhiyan";
					} else {
						cards = ["sha", "juedou"];
						skill = "gongxin";
					}
					for (var i = 0; i < cards.length; i++) {
						var card = get.cardPile(function (shiona) {
							return shiona.name == cards[i];
						});
						if (card) {
							cards2.push(card);
						}
					}
					player.addTempSkills(skill);
					if (cards2.length) {
						player.gain(cards2, "gain2", "log");
					}
				},
			},
		},
	},
	zhafu: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		filterTarget: lib.filter.notMe,
		content() {
			player.awakenSkill(event.name);
			player.addSkill("zhafu_hf");
			target.addMark("zhafu_hf", 1);
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					return Math.max(
						0,
						1 +
							target.countCards("h") -
							game.countPlayer(current => {
								if (get.attitude(target, current) > 0) {
									return 0.3;
								}
								if (target.hasJudge("lebu")) {
									return 0.6;
								}
								if (target.inRange(current)) {
									return 1.5;
								}
								return 1;
							})
					);
				},
				target(player, target) {
					return -Math.max(
						0,
						1 +
							target.countCards("h") -
							game.countPlayer(current => {
								if (get.attitude(target, current) > 0) {
									return 0.3;
								}
								if (target.hasJudge("lebu")) {
									return 0.6;
								}
								if (target.inRange(current)) {
									return 1.5;
								}
								return 1;
							})
					);
				},
			},
		},
		subSkill: {
			hf: {
				trigger: {
					global: "phaseDiscardBegin",
				},
				forced: true,
				charlotte: true,
				filter(event, player) {
					return event.player != player && event.player.hasMark("zhafu_hf");
				},
				content() {
					"step 0";
					var target = trigger.player;
					event.target = target;
					target.removeMark("zhafu_hf", 1);
					if (target.countCards("h") <= 1) {
						event.finish();
					}
					"step 1";
					target.chooseCard("h", true, "选择保留一张手牌，将其余的手牌交给" + get.translation(player)).set("ai", get.value);
					"step 2";
					var cards = target.getCards("h");
					cards.remove(result.cards[0]);
					target.give(cards, player);
				},
				intro: {
					content: "mark",
					onunmark: true,
				},
			},
		},
	},
	reyingzi_gexuan: { audio: 1 },
	guanxing_gexuan: { audio: 1 },
	zhiyan_gexuan: { audio: 1 },
	gongxin_gexuan: { audio: 1 },
	tuiyan: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		frequent: true,
		content() {
			"step 0";
			var cards = get.cards(3);
			event.cards = cards;
			game.log(player, "观看了牌堆顶的" + get.cnNumber(cards.length) + "张牌");
			player.chooseControl("ok").set("dialog", ["推演", cards]);
			"step 1";
			while (cards.length) {
				ui.cardPile.insertBefore(cards.pop(), ui.cardPile.firstChild);
			}
			game.updateRoundNumber();
		},
	},
	busuan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		content() {
			"step 0";
			var list = [];
			for (var i = 0; i < lib.inpile.length; i++) {
				var name = lib.inpile[i];
				var type = get.type(name, "trick");
				if (["basic", "trick"].includes(type)) {
					list.push([type, "", name]);
				}
				if (name == "sha") {
					for (let nature of lib.inpile_nature) {
						list.push([type, "", name, nature]);
					}
				}
			}
			player.chooseButton(["选择至多两种牌", [list, "vcard"]], true, [1, 2]).set("ai", function (button) {
				var target = _status.event.getParent().target;
				var card = { name: button.link[2], nature: button.link[3] };
				if (get.type(card) == "basic" || !target.hasUseTarget(card)) {
					return false;
				}
				return get.attitude(_status.event.player, target) * (target.getUseValue(card) - 0.1);
			});
			"step 1";
			target.storage.busuan_angelbeats = result.links.slice(0);
			target.addSkill("busuan_angelbeats");
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					var att = get.attitude(player, target);
					if (att > 0) {
						return 1;
					}
					return -5 / (target.countCards("h") + 1);
				},
			},
		},
	},
	busuan_angelbeats: {
		mark: true,
		intro: {
			mark(dialog, content, player) {
				if (content && content.length) {
					dialog.add([content, "vcard"]);
				}
			},
		},
		trigger: { player: "drawBefore" },
		forced: true,
		sourceSkill: "busuan",
		filter(event, player) {
			return event.getParent().name == "phaseDraw";
		},
		onremove: true,
		content() {
			"step 0";
			var list = player.storage["busuan_angelbeats"];
			var cards = [];
			for (var i = 0; i < Math.min(trigger.num, list.length); i++) {
				var card = get.cardPile(function (cardx) {
					if (cards.includes(cardx)) {
						return false;
					}
					if (cardx.name != list[Math.min(i, list.length - 1)][2]) {
						return false;
					}
					if (get.nature(cardx, false) != list[Math.min(i, list.length - 1)][3]) {
						return false;
					}
					return true;
				});
				if (card) {
					player.storage.busuan_angelbeats.splice(i--, 1);
					trigger.num--;
					cards.push(card);
				}
			}
			if (cards.length) {
				player.gain(cards, "gain2", "log");
			}
			"step 1";
			if (!trigger.num) {
				trigger.cancel();
			}
			if (!player.storage.busuan_angelbeats.length) {
				player.removeSkill("busuan_angelbeats");
			}
		},
	},
	mingjie: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		check() {
			return ui.cardPile.hasChildNodes() && get.color(ui.cardPile.firstChild) != "black";
		},
		content() {
			"step 0";
			event.count = 0;
			"step 1";
			player.draw();
			"step 2";
			if (Array.isArray(result)) {
				event.count += result.length;
				if (get.color(result) != "red") {
					if (player.hp > 1) {
						player.loseHp();
					}
					event.finish();
				} else if (event.count < 3) {
					player.chooseBool("是否继续发动【命戒】？").ai = function () {
						if (event.count == 2) {
							return Math.random() < 0.5;
						}
						return lib.skill.mingjie.check();
					};
				}
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				event.goto(1);
			}
		},
	},
};

export default skills;
