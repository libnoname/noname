import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//族荀莳（族荀肘）
	clanqingjue: {
		audio: 2,
		forced: true,
		trigger: {
			player: "changeHpAfter",
		},
		isOnlySuit(card, player) {
			return !player.hasCard(cardx => cardx != card && get.suit(cardx) == get.suit(card), "h");
		},
		init(player, skill) {
			player.addSkill(`${skill}_mark`);
		},
		onremove(player, skill) {
			player.removeSkill(`${skill}_mark`);
		},
		filter(event, player) {
			const hs = player.getCards("h");
			return game.getGlobalHistory("changeHp", evt => evt.player == player).indexOf(event) == 0 && player.countDiscardableCards(player, "h", card => !get.info("clanqingjue").isOnlySuit(card, player)) > 0;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseToDiscard(`###${get.translation(event.name)}###弃置手牌中任意张花色数量不为一的牌，并执行等量项`, "h", [1, Infinity], true, "allowChooseAll")
				.set("filterCard", (card, player) => !get.info("clanqingjue").isOnlySuit(card, player))
				.forResult();
			const { cards } = result;
			const resultx =
				cards.length > 1
					? { bool: true, links: ["give", "gain"] }
					: await player
							.chooseButton(
								[
									`清绝：执行${get.cnNumber(Math.min(cards.length, 2))}项`,
									[
										[
											["give", `将${get.translation(cards)}交给其他角色`],
											["gain", `获得未拥有花色的牌各一张（${get.translation(lib.suit.filter(suit => !player.hasCard({ suit: suit }, "h")))}）`],
										],
										"textbutton",
									],
								],
								true
							)
							.set("ai", button => {
								if (button.link == "give") {
									if (game.hasPlayer(target => target != get.player() && get.attitude(get.player(), target) > 0)) {
										return 2;
									}
									return 0.5;
								}
								return 1;
							})
							.forResult();
			const { links } = resultx;
			if (links?.includes("give") && game.hasPlayer(target => target != player) && cards?.someInD("d")) {
				const toGive = cards?.filterInD("d");
				const result = await player
					.chooseTarget(true, lib.filter.notMe)
					.set("createDialog", [`清绝：将这些牌交给一名其他角色`, toGive, [dialog => dialog.buttons.forEach(button => button.style.setProperty("opacity", "1", "important")), "handle"]])
					.set("toGive", toGive)
					.set("ai", target => get.attitude(get.player(), target) * get.value(get.event().toGive, target))
					.forResult();
				const {
					targets: [target],
				} = result;
				player.line(target);
				const next = target.gain(toGive, "gain2");
				next.giver = player;
				await next;
			}
			if (links?.includes("gain")) {
				const hs = player.getCards("h").map(i => get.suit(i));
				const suits = lib.suit.slice().removeArray(hs);
				if (suits?.length) {
					const cards = [];
					for (const suit of suits) {
						const card = get.cardPile(i => get.suit(i) == suit);
						if (card) {
							cards.push(card);
						}
					}
					if (cards.length) {
						await player.gain(cards, "gain2");
					}
				}
			}
		},
		mod: {
			ignoredHandcard(card, player) {
				if (get.info("clanqingjue").isOnlySuit(card, player)) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard") {
					if (get.info("clanqingjue").isOnlySuit(card, player)) {
						return false;
					}
				}
			},
		},
		subSkill: {
			mark: {
				//太棒了，是宝宝标记，我们有救了！
				charlotte: true,
				init(player, skill) {
					player.removeGaintag(skill);
					player.addGaintag(
						player.getCards("h", card => get.info("clanqingjue").isOnlySuit(card, player)),
						skill
					);
				},
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				trigger: {
					player: ["loseEnd", "enterGame"],
					global: ["gainEnd", "equipEnd", "addJudgeEnd", "loseAsyncEnd", "addToExpansionEnd", "phaseBefore"],
				},
				silent: true,
				filter(event, player, name) {
					if (event.name == "phase") {
						return game.phaseNumber == 0;
					}
					return name == "enterGame" || event.getg?.(player)?.length || event.getl?.(player)?.hs?.length;
				},
				async content(event, trigger, player) {
					get.info(event.name).init(player, event.name);
				},
			},
		},
	},
	clanxsyingxiang: {
		audio: 2,
		trigger: {
			global: ["useCardAfter", "loseAfter", "loseAsyncAfter", "gainAfter", "equipAfter", "addJudgeAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			if (event.name === "useCard") {
				return event.player.hasHistory("lose", evt => {
					if (evt.getParent() !== event) {
						return false;
					}
					return Object.values(evt.gaintag_map).flat().includes("clanxsyingxiang");
				});
			}
			if (player.hasSkill("clanxsyingxiang_used") || !player.countDiscardableCards(player, "h", card => !get.info("clanqingjue").isOnlySuit(card, player))) {
				return false;
			}
			if (event.name === "lose" && event.getParent().name === "useCard") {
				return false;
			}
			return game.hasPlayer(target => {
				const evt = event.getl?.(target);
				return evt?.hs?.some(card => evt.gaintag_map?.[card.cardid]?.includes("clanxsyingxiang"));
			});
		},
		logTarget(event, player) {
			if (event.name === "useCard") {
				return game
					.filterPlayer(i => {
						if (i === event.player) {
							return true;
						}
						return i.hasCard(card => card.hasGaintag("clanxsyingxiang"), "h");
					})
					.sortBySeat();
			}
			return player;
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.name === "useCard") {
				await game.asyncDraw([player, ...event.targets].sortBySeat());
				await game.delayx();
			} else {
				const skill = "clanqingjue";
				player.logSkill(skill);
				player.addTempSkill(`${event.name}_used`, "roundStart");
				const next = game.createEvent(skill);
				next.player = player;
				next.setContent(get.info(skill).content);
				await next;
			}
		},
		group: "clanxsyingxiang_mark",
		subSkill: {
			used: {
				charlotte: true,
				init(player, skill) {
					player.addTip(skill, `${get.translation(skill)} 已${get.translation("clanqingjue")}`);
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
			},
			mark: {
				audio: "clanxsyingxiang",
				forced: true,
				trigger: {
					global: ["gainEnd", "loseAsyncEnd"],
				},
				getIndex(event, player) {
					return game
						.filterPlayer(target => {
							if (target == player) {
								return false;
							}
							const gain = event.getg?.(target) ?? [];
							const lose = event.getl?.(player)?.cards2 ?? [];
							return gain.length > 0 && (event.giver === player || lose.some(i => gain.includes(i)));
						})
						.sortBySeat();
				},
				filter(event, player, name, target) {
					return target?.isIn();
				},
				logTarget(event, player, name, target) {
					return target;
				},
				async content(event, trigger, player) {
					const target = event.indexedData;
					const gain = trigger.getg?.(target);
					const lose = trigger.getl?.(player)?.cards2;
					target.addGaintag(
						gain.filter(i => trigger.giver === player || lose.includes(i)),
						"clanxsyingxiang"
					);
				},
			},
		},
	},
	//族陈泰
	clanfenjian: {
		audio: 2,
		onChooseToUse(event) {
			const { player } = event;
			if (!game.online && !event.clanfenjian) {
				event.set("clanfenjian", true);
				event.targetprompt2.push(target => {
					if (!target.classList.contains("selectable") || event.skill !== "clanfenjian") {
						return false;
					}
					const num = target.getAttackRange() - get.event().player.getAttackRange();
					if (num < 0) {
						return "小于你";
					} else if (num > 0) {
						return "大于你";
					} else {
						return "等于你";
					}
				});
			}
		},
		enable: "phaseUse",
		filter(event, player) {
			const name = "clanfenjian_used";
			return game.hasPlayer(target => {
				return !player.getStorage(name).includes(Math.sign(target.getAttackRange() - player.getAttackRange())) && target.countDiscardableCards(target, "he") > 0;
			});
		},
		filterTarget(card, player, target) {
			return !player.getStorage("clanfenjian_used").includes(Math.sign(target.getAttackRange() - player.getAttackRange())) && target.countDiscardableCards(target, "he") > 0;
		},
		async content(event, trigger, player) {
			const { target } = event;
			const num = Math.sign(target.getAttackRange() - player.getAttackRange());
			player.addTempSkill(`${event.name}_used`, "phaseChange");
			player.markAuto(`${event.name}_used`, num);
			const result = await target.chooseToDiscard(`奋剑：你须弃置一张牌，若为【闪】，${get.translation(player)}摸一张牌，否则其本回合攻击范围-1`, "he", true).forResult();
			const {
				cards: [card],
			} = result;
			if (get.name(card) == "shan") {
				await player.draw();
			} else {
				player.addTempSkill(`${event.name}_debuff`);
				player.addMark(`${event.name}_debuff`, 1, false);
			}
		},
		ai: {
			order: 3,
			result: {
				target(player, target) {
					return -get.effect(target, { name: "guohe_copy2" }, player, player);
				},
			},
		},
		subSkill: {
			debuff: {
				charlotte: true,
				onremove: true,
				intro: {
					markcount: storage => -storage,
					content: "攻击范围-#",
				},
				mod: {
					attackRange(player, num) {
						return num - player.countMark("clanfenjian_debuff");
					},
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	clandongxu: {
		audio: 2,
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			content(storage) {
				return !storage ? "你可以将你装备区里的一张牌置于其他角色装备区（替换原装备），视为对其使用一张【杀】" : "你可以将手牌摸至X（X为你的攻击范围且至多为5），视为使用一张【闪】";
			},
		},
		group: ["clandongxu_yang", "clandongxu_yin"],
		subSkill: {
			yang: {
				log: false,
				enable: "chooseToUse",
				hiddenCard(player, name) {
					return name == "sha" && !player.storage.clandongxu && player.countCards("e") > 0;
				},
				filter(event, player) {
					return event.filterCard(get.autoViewAs({ name: "sha", isCard: true }), player, event) && !player.storage.clandongxu && player.countCards("e") > 0;
				},
				prompt: "将装备区里的一张牌置于其他角色装备区（替换原装备），视为对其使用一张【杀】",
				ignoreMod: true,
				viewAs: {
					name: "sha",
					cards: [],
					isCard: true,
				},
				filterCard: true,
				position: "e",
				filterTarget(card, player, target) {
					const {
						cards: [cardx],
					} = ui.selected;
					if (!cardx) {
						return;
					}
					return target.canEquip(cardx, true) && lib.filter.filterTarget(get.autoViewAs(get.info("clandongxu_yang").viewAs), player, target);
				},
				async precontent(event, trigger, player) {
					player.logSkill("clandongxu");
					player.changeZhuanhuanji("clandongxu");
					const [card] = event.result.cards;
					const [target] = event.result.targets;
					event.result.cards = [];
					event.result.card = { name: "sha", isCard: true };
					player.$give(card, target, false);
					await target.equip(card);
					await game.delayx(2);
				},
				ai: {
					respondSha: true,
					skillTagFilter(player, tag, arg) {
						if (tag == "respond") {
							return false;
						}
						if (tag == "respondSha" && (player.storage.clandongxu || !player.countCards("e"))) {
							return false;
						}
					},
				},
			},
			yin: {
				log: false,
				enable: "chooseToUse",
				hiddenCard(player, name) {
					return name == "shan" && !player.storage.clandongxu && player.countCards("h") < Math.min(player.getAttackRange(), 5);
				},
				filter(event, player) {
					return event.filterCard(get.autoViewAs({ name: "shan", isCard: true }), player, event) && player.storage.clandongxu && player.countCards("h") < Math.min(player.getAttackRange(), 5);
				},
				viewAs: {
					name: "shan",
					isCard: true,
				},
				filterCard: () => false,
				selectCard: 0,
				async precontent(event, trigger, player) {
					player.logSkill("clandongxu");
					player.changeZhuanhuanji("clandongxu");
					await player.drawTo(Math.min(player.getAttackRange(), 5));
				},
				ai: {
					respondShan: true,
					skillTagFilter(player, tag, arg) {
						if (tag == "respond") {
							return false;
						}
						if (tag == "respondShan" && (!player.storage.clandongxu || player.countCards("h") >= Math.min(player.getAttackRange(), 5))) {
							return false;
						}
					},
				},
			},
		},
	},
	//族陈群
	clangezhi: {
		audio: 2,
		usable: 1,
		trigger: {
			global: "damageEnd",
		},
		filter(event, player) {
			return (event.player == player || player.inRange(event.player)) && event.source && event.source != player && (player.countDiscardableCards(player, "he") > 0 || event.source.countDiscardableCards(player, "he") > 0);
		},
		check: (event, player) => get.effect(event.source, { name: "guohe_copy2" }, player, player) > 0,
		logTarget: "source",
		async assignCards(event, trigger, player) {
			let { cards, goon, filterCard, filterButton, filterTarget, forced, position, complexCard, prompt, ai1, ai2, selectCard, selectButton, chooseonly, gaintag } = event;
			if (!cards.length) {
				return;
			}
			if (cards.some(card => get.owner(card) != player || !"he".includes(get.position(card)))) {
				event.type = "button";
			} else {
				event.type = "card";
			}
			goon ??= () => true;
			filterCard ??= () => true;
			filterButton ??= () => true;
			filterTarget ??= () => true;
			forced ??= false;
			position ??= "h";
			complexCard ??= false;
			prompt ??= "请选择要分配的卡牌和目标";
			ai1 ??=
				event.type == "card"
					? card => {
							if (!ui.selected.cards.length) {
								return 1;
							}
							return 0;
						}
					: button => {
							if (!ui.selected.buttons.length) {
								return 1;
							}
							return 0;
						};
			ai2 ??= target => {
				const player = get.player(),
					card = get.event().name == "chooseCardTarget" ? ui.selected.cards[0] : ui.selected.buttons[0].link;
				const val = target.getUseValue(card);
				if (val > 0) {
					return val * get.attitude(player, target) * 2;
				}
				return get.value(card, target) * get.attitude(player, target);
			};
			selectCard ??= [1, Infinity];
			selectButton ??= [1, Infinity];
			const give_map = new Map();
			event.give_map = give_map;
			if (_status.connectMode) {
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			}
			const assigned = [];
			event.assigned = assigned;
			if (event.type == "card") {
				while (assigned.length < cards.length && goon(event)) {
					const result = await player
						.chooseCardTarget({
							prompt: prompt,
							forced: typeof forced == "boolean" ? forced : forced(event),
							filterCardx: filterCard,
							filterCard(card, ...args) {
								if (card.hasGaintag("assigned_tag")) {
									return false;
								}
								return get.event().filterCardx.call(this, card, ...args);
							},
							selectCard: selectCard,
							filterTarget: filterTarget,
							position: position,
							complexCard: complexCard,
							ai1: ai1,
							ai2: ai2,
						})
						.forResult();
					if (result?.bool && result.cards?.length && result.targets?.length) {
						const {
							cards,
							targets: [target],
						} = result;
						player.addGaintag(cards, "assigned_tag");
						assigned.addArray(cards);
						give_map.set(target, (give_map.get(target) || []).concat(cards));
					} else {
						break;
					}
				}
			} else {
				while (assigned.length < cards.length && goon(event)) {
					const result = await player
						.chooseButtonTarget({
							createDialog: [prompt, cards.filter(i => !assigned.includes(i))],
							forced: typeof forced == "boolean" ? forced : forced(event),
							filterButton: filterButton,
							filterTarget: filterTarget,
							selectButton: selectButton,
							ai1: ai1,
							ai2: ai2,
						})
						.forResult();
					if (result?.bool && result.links?.length && result.targets?.length) {
						const {
							links,
							targets: [target],
						} = result;
						assigned.addArray(links);
						give_map.set(target, (give_map.get(target) || []).concat(links));
					} else {
						break;
					}
				}
			}
			event.result = give_map;
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			if (!chooseonly) {
				player.line(Array.from(give_map.keys()));
				if (event.type == "button") {
					for (const target of Array.from(give_map.keys()).sortBySeat()) {
						game.log(target, "获得了", give_map.get(target));
					}
				}
				event.done ??= game
					.loseAsync({
						gain_list: Array.from(give_map.entries()),
						giver: player,
						player: event.type == "card" ? player : null,
						cards: Array.from(give_map.values()).flat(),
						animate: event.type == "card" ? "giveAuto" : "gain2",
						gaintag: gaintag || [],
					})
					.setContent("gaincardMultiple");
				await event.done;
			}
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			let cards = [];
			if (player.countDiscardableCards(player, "he")) {
				const result = await player.chooseToDiscard("he", true).forResult();
				if (result?.cards?.length) {
					cards.addArray(result.cards);
				}
			}
			if (target.countDiscardableCards(player, "he")) {
				const result = await player.discardPlayerCard(target, "he", true).forResult();
				if (result?.cards?.length) {
					cards.addArray(result.cards);
				}
			}
			const cardsx = cards.filterInD("d");
			if (cardsx.length) {
				const next = game.createEvent("assignCards");
				next.set("player", player);
				next.set("cards", cardsx);
				next.setContent(get.info(event.name).assignCards);
				await next;
			}
			const types = cards.map(card => get.type2(card)).unique();
			if (types.length != 1) {
				[player, target].forEach(i => {
					i.addTempSkill(`${event.name}_debuff`);
					i.setStorage(`${event.name}_debuff`, types);
					i.markSkill(`${event.name}_debuff`);
				});
			}
		},
		subSkill: {
			debuff: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "只能使用：$",
				},
				mod: {
					cardEnabled(card, player) {
						if (!player.getStorage("clangezhi_debuff").includes(get.type2(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (!player.getStorage("clangezhi_debuff").includes(get.type2(card))) {
							return false;
						}
					},
				},
			},
		},
	},
	clanmingdian: {
		audio: 2,
		enable: "phaseUse",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.hasCard(card => get.type(card) == "basic" && player.canRecast(card) && !player.getStorage("clanmingdian_used").includes(get.name(card)), "he");
		},
		filterCard(card) {
			const player = get.player();
			return get.type(card) == "basic" && player.canRecast(card) && !player.getStorage("clanmingdian_used").includes(get.name(card));
		},
		selectCard: [1, Infinity],
		position: "he",
		check(card) {
			return 7 - get.value(card);
		},
		lose: false,
		discard: false,
		delay: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), [1, Infinity], "he", get.info(event.skill).filterCard)
				.set("ai", card => 7.5 - get.value(card))
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event;
			const names = cards.map(card => get.name(card)).unique();
			player.addTempSkill(`${event.name}_used`, "roundStart");
			player.markAuto(`${event.name}_used`, names);
			await player.recast(cards);
			if (player.hasHistory("useCard", evt => names.includes(get.name(evt.card)))) {
				const list = player
					.getCards("h")
					.map(card => get.name(card))
					.unique();
				const card = get.cardPile(card => get.type(card) == "basic" && !list.includes(get.name(card)), void 0, "random");
				if (card) {
					await player.gain(card, "gain2");
				} else {
					player.chat("碰！");
				}
			}
		},
		ai: {
			order: 4,
			result: {
				player: 1,
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "已重铸：$",
				},
			},
		},
	},
	clanshize: {
		audio: 2,
		clanSkill: true,
		audioname: ["clan_chenqun"],
		trigger: {
			global: ["useCard", "respond"],
		},
		locked: true,
		filter(event, player) {
			if (_status.currentPhase !== player) {
				return false;
			}
			const history = game.getGlobalHistory("everything", evt => {
				if (!["useCard", "respond"].includes(evt.name)) {
					return false;
				}
				return evt.respondTo?.[0] == player;
			});
			return history.indexOf(event) == 0 && game.hasPlayer(target => target.hasClan("颍川陈氏") || target == player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(`###${get.translation(event.skill)}###${get.skillInfoTranslation(event.skill, player)}`, true, (card, player, target) => {
					return target.hasClan("颍川陈氏") || target == player;
				})
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (att > 0) {
						return game.countPlayer(i => !i.inRangeOf(target)) + 1;
					}
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			game.log(target, "的攻击范围", "#g+1");
			target.addSkill(`${event.name}_effect`);
			target.addMark(`${event.name}_effect`, 1, false);
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { player: "damage" },
				filter(event, player) {
					return player.hasMark("clanshize_effect");
				},
				silent: true,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
				},
				mod: {
					attackRange(player, num) {
						return num + player.countMark("clanshize_effect");
					},
				},
				markimage: "image/card/attackRange.png",
				intro: {
					content(num, player) {
						let str = "<li>攻击范围+";
						str += num;
						str += "<br><li>当前攻击范围：";
						str += player.getAttackRange(false);
						return str;
					},
				},
			},
		},
	},
	//族荀彧
	clandingan: {
		audio: 2,
		trigger: {
			global: "useCardAfter",
		},
		filter(event, player) {
			return game.getGlobalHistory("useCard", evt => evt.card.name == event.card.name).indexOf(event) == 1;
		},
		forced: true,
		async content(event, trigger, player) {
			const skill = `${event.name}_used`;
			const pre_targets = game.filterPlayer(target => {
				return !trigger.targets.includes(target) && !player.getStorage(skill).includes(target);
			});
			const result =
				pre_targets.length > 1
					? await player
							.chooseTarget(
								`定安：与任意名不为此牌目标的其他角色各摸一张牌`,
								(card, player, target) => {
									return get.event().targetx.includes(target);
								},
								true,
								[1, pre_targets.length]
							)
							.set("targetx", pre_targets)
							.set("prompt2", "然后你令手牌最多的其他角色执行一项：1.受到你造成的1点伤害；2.弃置手牌中最多的同名牌。")
							.set("ai", target => {
								const { player, targetx } = get.event(),
									getD = current => get.effect(current, { name: "draw" }, player, player);
								const eff = getD(target);
								if (eff > 0) {
									return 2;
								}
								if (ui.selected.targets.every(current => getD(current) > 0 && current.countCards("h") < target.countCards("h"))) {
									return -eff;
								}
								return 0;
							})
							.forResult()
					: {
							bool: true,
							targets: pre_targets,
						};
			if (!result?.bool || !result.targets) {
				return;
			}
			player.addTempSkill(skill);
			player.markAuto(skill, result.targets);
			const targets = [player, ...result.targets.sortBySeat()];
			await game.asyncDraw(targets);
			const currents = game.filterPlayer(target => target != player && target.isMaxHandcard(false, current => current != player));
			if (!currents?.length) {
				return;
			}
			const func = async target => {
				const result2 = await player
					.chooseButton(
						[
							`定安：选择一项令${get.translation(target)}执行`,
							[
								[
									["damage", "受到你造成的1点伤害"],
									["discard", "随机弃置手牌中最多的同名牌"],
								],
								"textbutton",
							],
						],
						true
					)
					.set("targetx", target)
					.set("ai", button => {
						const { player, targetx: target } = get.event();
						if (button.link == "damage") {
							return get.damageEffect(target, player, player);
						}
						return get.sgnAttitude(player, target) * Math.sqrt(target.countCards("h"));
					})
					.forResult();
				if (result2?.bool && result2.links?.length) {
					player.line(target);
					if (result2.links[0] == "damage") {
						await target.damage(player);
					} else {
						const cards = target.getCards("h"),
							names = cards.map(card => get.name(card)),
							maxName = names.toUniqued().maxBy(name => get.numOf(names, name));
						const num = get.numOf(names, maxName);
						const name = names
							.toUniqued()
							.filter(name => get.numOf(names, name) == num)
							.randomGet();
						if (name) {
							const discards = cards.filter(card => get.name(card) == name);
							if (discards?.length) {
								await target.modedDiscard(discards);
							}
						}
					}
				}
			};
			await game.doAsyncInOrder(currents, func);
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	clanfuning: {
		audio: 2,
		trigger: {
			player: "changeHpAfter",
		},
		filter(event, player) {
			const evts = game.getRoundHistory("changeHp", evt => evt.player == player && evt.num != 0);
			if (evts.indexOf(event) !== 0) {
				return false;
			}
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			const num = Math.max(1, player.getDamagedHp());
			return player.countCards("he") >= num;
		},
		async cost(event, trigger, player) {
			const num = Math.max(1, player.getDamagedHp()),
				count = game.countPlayer2(current => current.hasHistory("damage"), true);
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard: true,
					position: "he",
					selectCard: [num, Infinity],
					filterTarget: lib.filter.notMe,
					complexCard: true,
					count: count,
					ai1(card) {
						const color = get.color(card),
							{ player, count } = get.event();
						if (!player.isDamaged() || ui.selected.cards.every(cardx => get.color(cardx) == color)) {
							const num = ui.selected.cards.length,
								num2 = player.countCards("h", cardx => !ui.selected.cards.includes(cardx));
							if (count <= num && num2 > player.maxHp) {
								return 15 - get.value(card);
							}
							return 10 - get.value(card);
						}
						return 3 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						return get.attitude(player, target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			const bool1 = cards.map(card => get.color(card)).toUniqued().length == 1,
				bool2 = cards.length > game.countPlayer2(current => current.hasHistory("damage"), true);
			await player.give(cards, target);
			if (bool1) {
				await player.recover();
			}
			if (bool2) {
				const num = player.countCards("h") - player.maxHp;
				if (num > 0) {
					const count = Math.min(num, player.countDiscardableCards(player, "h"));
					if (count > 0) {
						await player.chooseToDiscard("h", count, true);
					}
				} else if (num < 0) {
					await player.draw(-num);
				}
			}
		},
	},
	//族韩馥
	clanheta: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return !player.isLinked();
		},
		async content(event, trigger, player) {
			await player.link(true);
			player.addTempSkill("clanheta_effect");
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCard1",
				},
				filter(event, player) {
					if (!player.isLinked() || ["equip", "delay"].includes(get.type(event.card))) {
						return false;
					}
					if (get.info(event.card)?.multitarget) {
						return false;
					}
					const targets = player
						.getHistory(
							"useCard",
							evt => {
								return evt?.targets?.length && evt != event;
							},
							event
						)
						.map(evt => evt.targets ?? [])
						.flat()
						.toUniqued();
					return targets.some(target => {
						if (event.targets?.includes(target)) {
							return true;
						}
						return lib.filter.targetEnabled2(event.card, player, target);
					});
				},
				charlotte: true,
				async cost(event, trigger, player) {
					const targets = player
						.getHistory(
							"useCard",
							evt => {
								return evt?.targets?.length && evt != trigger;
							},
							trigger
						)
						.map(evt => evt.targets ?? [])
						.flat()
						.toUniqued();
					event.result = await player
						.chooseTarget(
							(card, player, target) => {
								const { targetx, targety, cardx } = get.event();
								if (!targetx.includes(target)) {
									return false;
								}
								if (ui.selected.targets?.length) {
									const first = ui.selected.targets[0];
									if (targety.includes(first) !== targety.includes(target)) {
										return false;
									}
								}
								return targety.includes(target) || lib.filter.targetEnabled2(cardx, player, target);
							},
							[1, Infinity]
						)
						.set("targetx", targets)
						.set("targety", trigger.targets)
						.set("cardx", trigger.card)
						.set("complexTarget", true)
						.set("targetprompt", target => {
							const { targety } = get.event();
							return targety.includes(target) ? "取消目标" : "成为目标";
						})
						.set("prompt", get.translation(event.skill))
						.set("prompt2", "为此牌增加或减少任意个目标")
						.set("ai", target => {
							const { targety, cardx, player } = get.event(),
								eff = get.effect(target, cardx, player, player);
							if (targety.includes(target)) {
								return -eff * get.attitude(player, target);
							}
							return eff * get.attitude(player, target);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					await player.link(false);
					const bool = trigger.targets.containsSome(...event.targets);
					trigger.targets[bool ? "removeArray" : "addArray"](event.targets);
					await game.delay();
				},
			},
		},
	},
	clanyingxiang: {
		audio: 3,
		trigger: {
			player: "phaseUseEnd",
		},
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		async cost(event, trigger, player) {
			const list = get.inpileVCardList(info => {
				if (info[0] == "basic" && !info[3]) {
					return true;
				}
				if (info[0] != "trick") {
					return false;
				}
				const infox = lib.card[info[2]];
				if (infox.notarget || (info.selectTarget && infox.selectTarget != 1)) {
					return false;
				}
				return infox.type == "trick";
			});
			if (!list.length) {
				return;
			}
			const result = await player
				.chooseButtonTarget({
					createDialog: [get.prompt2(event.skill), [list, "vcard"]],
					filterTarget(card, player, target) {
						return player.canCompare(target);
					},
					ai1(button) {
						const card = player.getCards("h").maxBy(
							card => {
								return get.number(card);
							},
							card => card.name == button.link[2]
						);
						if (card) {
							return get.number(card);
						}
						return 0;
					},
					ai2(target) {
						return -get.attitude(get.player(), target);
					},
				})
				.forResult();
			if (result.bool) {
				event.result = {
					bool: true,
					targets: result.targets,
					cost_data: result.links[0][2],
				};
			}
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: name,
			} = event;
			game.log(player, "声明的牌名为", `#y${get.translation(name)}`);
			player.chat(get.translation(name));
			const result = await player.chooseToCompare(target).forResult();
			if (!result.tie) {
				const winner = result.bool ? player : target,
					card = new lib.element.VCard({ name: name, isCard: true });
				if (winner.hasUseTarget(card)) {
					await winner.chooseUseTarget(card, true);
				}
			}
			const cards = [result.player, result.target];
			if (cards.some(card => card.name == name)) {
				if (player.hasSkill("clanxumin", null, null, false) && !player.hasSkill("clanxumin")) {
					player.restoreSkill("clanxumin");
					game.log(player, "重置了", "【恤民】");
				}
			} else {
				if (cards.someInD("od")) {
					await player.gain(cards.filterInD("od"), "gain2");
				}
				const skills = player.getSkills(null, false, false).filter(skill => {
					let info = get.info(skill);
					if (!info || info.charlotte || get.skillInfoTranslation(skill, player).length == 0) {
						return false;
					}
					return true;
				});
				const result2 =
					skills.length > 1
						? await player
								.chooseButton(["迎乡：失去一个技能", [skills, "skill"]], true)
								.set("ai", button => {
									const { link } = button;
									const info = get.info(link);
									if (info?.ai?.neg || info?.ai?.halfneg) {
										return 3;
									}
									return ["clanyingxiang", "clanxumin"].indexOf(link) + 1;
								})
								.forResult()
						: {
								bool: true,
								links: skills,
							};
				if (result2?.bool && result2?.links?.length) {
					await player.removeSkills(result2.links);
				}
			}
		},
	},
	//族陆绩
	clangailan: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && !lib.inpile.includes("huntianyi");
		},
		async content(event, trigger, player) {
			const cards = [];
			for (const i of [1, 3, 10, 12]) {
				cards.push(game.createCard2("huntianyi", "diamond", i));
			}
			game.broadcastAll(function () {
				lib.inpile.add("huntianyi");
			});
			await game.cardsGotoPile(cards, () => {
				return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
			});
		},
		group: "clangailan_equip",
		subSkill: {
			equip: {
				audio: "clangailan",
				trigger: {
					player: "phaseBegin",
				},
				filter(event, player) {
					return lib.inpile.includes("huntianyi");
				},
				forced: true,
				async content(event, trigger, player) {
					const card = get.cardPile(card => card.name == "huntianyi");
					if (card && player.canEquip(card, true)) {
						player.$gain2(card);
						await game.delayx();
						await player.equip(card);
					}
				},
			},
		},
	},
	huntianyi_skill: {
		equipSkill: true,
		trigger: { player: "damageBegin2" },
		filter(event, player) {
			if (player.hasSkillTag("unequip2")) {
				return false;
			}
			if (
				event.source?.hasSkillTag("unequip", false, {
					name: event.card ? event.card.name : null,
					target: player,
					card: event.card,
				})
			) {
				return false;
			}
			return player.getEquip("huntianyi");
		},
		forced: true,
		async content(event, trigger, player) {
			const card = player.getEquip("huntianyi");
			await player.lose(card, "visible", ui.ordering);
			trigger.cancel();
		},
		subSkill: {
			lose: {
				audio: "huntianyi_skill",
				forced: true,
				charlotte: true,
				equipSkill: true,
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter: (event, player, name, card) => {
					if (!card || card.name != "huntianyi") {
						return false;
					}
					return !player.hasSkillTag("unequip2");
				},
				getIndex(event, player) {
					const evt = event.getl(player);
					const lostCards = [];
					evt.es.forEach(card => {
						const VEquip = evt.vcard_map.get(card);
						if (VEquip?.name === "huntianyi") {
							lostCards.add(VEquip);
						}
					});
					return lostCards;
				},
				async content(event, trigger, player) {
					const num = get.number(event.indexedData, false),
						cards = [];
					while (cards.length < 2) {
						const cardx = get.cardPile2(card => {
							return get.number(card, false) == num && !cards.includes(card) && get.type2(card, false) == "trick";
						});
						if (cardx) {
							cards.push(cardx);
						} else {
							break;
						}
					}
					if (cards.length) {
						await player.gain(cards, "gain2");
					}
				},
			},
		},
	},
	clanfennu: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("he"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, player.hp])
				.set("filterTarget", (card, player, target) => {
					return target.countCards("he");
				})
				.set("ai", target => {
					const player = get.player();
					if (target.hasSkill("clanzelie") && target.countCards("e") == 1 && !target.countCards("j")) {
						return get.attitude(player, target);
					}
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.filter(target => target.countDiscardableCards(target, "he"));
			if (!targets?.length) {
				return;
			}
			if (!event.isMine() && !event.isOnline()) {
				await game.delayx();
			}
			const nextx = player
				.chooseCardOL(targets, "he", true, 1, "奋驽：弃置一张牌", (card, player, target) => {
					return lib.filter.cardDiscardable(card, player, "clanfennu");
				})
				.set("ai", card => {
					return 7 - get.value(card);
				});
			nextx._args.remove("glow_result");
			const result = await nextx.forResult();
			const lose_list = [],
				cards = [];
			for (let i = 0; i < result.length; i++) {
				const current = targets[i],
					cards2 = result[i].cards;
				cards.addArray(cards2);
				//lose_list.push([current, cards2]);
				await current.modedDiscard(cards2);
			}
			/*await game
				.loseAsync({
					lose_list: lose_list,
					discarder: player,
				})
				.setContent("discardMultiple");*/
			const next = player.addToExpansion(cards, "gain2");
			next.gaintag.add("clanfennu");
			await next;
		},
		marktext: "逸",
		intro: {
			name: "逸",
			mark(dialog, storage, player) {
				const list = player.getExpansions("clanfennu");
				if (!list.length) {
					return "没有记录";
				}
				const num1 = list.reduce((sum, card) => sum + get.number(card, false), 0);
				dialog.addText(`“逸”牌总点数：${num1}`);
				dialog.addSmall(list);
				const num2 = player.countMark("clanfennu_record");
				dialog.addText(`已记录点数：${num2}`);
			},
			markcount(storage, player) {
				const num = player.countMark("clanfennu_record");
				return num || null;
			},
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
			player.clearMark(`${skill}_record`, false);
		},
		group: ["clanfennu_record", "clanfennu_gain"],
		subSkill: {
			record: {
				trigger: {
					player: "useCardToPlayer",
				},
				filter(event, player) {
					if (!player.getExpansions("clanfennu").length || !event.isFirstTarget) {
						return false;
					}
					const num = get.number(event.card, false);
					return num && typeof num == "number";
				},
				direct: true,
				async content(event, trigger, player) {
					player.addMark(event.name, get.number(trigger.card), false);
					player.markSkill("clanfennu");
				},
			},
			gain: {
				audio: "clanfennu",
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter(event, player) {
					if (!player.getExpansions("clanfennu").length || !player.countMark("clanfennu_record")) {
						return false;
					}
					const num1 = player.getExpansions("clanfennu").reduce((sum, card) => sum + get.number(card, false), 0),
						num2 = player.countMark("clanfennu_record");
					return num1 < num2;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.clearMark("clanfennu_record", false);
					await player.gain(player.getExpansions("clanfennu"), "gain2");
				},
			},
		},
	},
	clanzelie: {
		audio: 2,
		audioname: ["clan_lujing"],
		trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
		getIndex(event, player) {
			return game
				.filterPlayer(current => {
					if (current.countCards("ej") || (!current.hasClan("吴郡陆氏") && current != player)) {
						return false;
					}
					const evt = event.getl(current);
					return evt?.es?.length || evt?.js?.length;
				})
				.sortBySeat(_status.currentPhase);
		},
		filter: (event, player, name, target) => target?.isIn(),
		clanSkill: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player(),
						att = get.attitude(player, target);
					return att;
					//相信后人智慧
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.addTempSkill("clanzelie_effect");
			target.addMark("clanzelie_effect", 1, false);
		},
		ai: {
			noe: true,
			skillTagFilter(player, tag, arg) {
				return player.countCards("ej") == 1;
			},
		},
		subSkill: {
			effect: {
				trigger: {
					player: ["gainAfter", "loseAfter"],
					global: "loseAsyncAfter",
				},
				charlotte: true,
				direct: true,
				firstDo: true,
				onremove: true,
				getIndex(event, player) {
					return player.countMark("clanzelie_effect");
				},
				filter(event, player) {
					if (!player.hasMark("clanzelie_effect")) {
						return false;
					}
					if (event.name == "gain") {
						return event.getParent().name == "draw";
					}
					return event.type == "discard" && event.getl(player).cards2.length && player.countCards("he");
				},
				intro: {
					content: "本回合下$次摸牌/弃置牌后，摸一张牌/弃置一张牌",
				},
				async content(event, trigger, player) {
					player.removeMark("clanzelie_effect", 1, false);
					if (trigger.name == "gain") {
						await player.draw();
					} else {
						await player.chooseToDiscard("he", true);
					}
				},
			},
		},
	},
	//族陆景
	clantanfeng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		viewAs: {
			name: "sha",
			isCard: true,
			storage: {
				tanfeng: true,
			},
		},
		async precontent(event, trigger, player) {
			if (event.getParent().addCount !== false) {
				event.getParent().addCount = false;
			}
			const target = event.result.targets[0];
			player
				.when({ player: "useCardAfter" })
				.filter(evt => evt.getParent() == event.getParent())
				.assign({
					ai: {
						unequip: true,
						unequip_ai: true,
						skillTagFilter(player, tag, arg) {
							const card = tag == "unequip_ai" ? arg : arg?.card;
							if (!card?.storage?.tanfeng) {
								return false;
							}
						},
					},
				})
				.step(async (event, trigger, player) => {
					if (player.getHistory("sourceDamage", evt => evt.card == trigger.card).length) {
						const num = Math.abs(player.countCards("e") - target.countCards("e"));
						if (num > 0) {
							await player.draw(num);
						}
					} else {
						const sha = get.autoViewAs({ name: "sha", isCard: true });
						if (!target.canUse(sha, player, false)) {
							return;
						}
						const { bool } = await target
							.chooseBool("探锋", `是否视为对${get.translation(player)}使用一张【杀】？`)
							.set("choice", get.effect(player, sha, target, target) > 0)
							.forResult();
						if (bool) {
							await target.useCard(sha, player, false);
						}
					}
				});
		},
		selectCard: -1,
		filterCard: () => false,
		selectTarget: 1,
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.1;
			},
		},
	},
	clanjuewei: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player, name) {
			if (!event.card || !get.is.damageCard(event.card)) {
				return false;
			}
			if (name == "useCardToPlayered" && !event.isFirstTarget) {
				return false;
			}
			return player.countCards("he", card => {
				if (get.type(card, player) != "equip") {
					return false;
				}
				return lib.filter.cardDiscardable(card, player, "clanjuewei") || lib.filter.cardRecastable(card, player);
			});
		},
		usable: 1,
		async cost(event, trigger, player) {
			const prompt1 = `重铸一张装备牌，于${get.translation(trigger.card)}结算完成后视为对一名不为你的角色使用此牌`,
				prompt2 = `弃置一张装备牌，令${get.translation(trigger.card)}无效`;
			const result = await player
				.chooseButton([
					get.prompt(event.skill),
					[
						[
							["Recast", prompt1],
							["Discard", prompt2],
						],
						"textbutton",
					],
				])
				.set("filterButton", button => {
					const player = get.player(),
						source = button.link == "Recast" ? null : "clanjuewei";
					return player.countCards("he", card => {
						if (get.type(card, player) != "equip") {
							return false;
						}
						return lib.filter[`card${button.link}able`](card, player, source);
					});
				})
				.set("ai", button => {
					const player = get.player(),
						trigger = get.event().getTrigger();
					if (button.link == "Recast") {
						if (!trigger.targets || trigger.targets.every(target => target == player)) {
							return 0;
						}
						const target = trigger.targets.maxBy(
							target => {
								return get.effect(target, trigger.card, player, player);
							},
							target => target != player
						);
						return get.effect(target, trigger.card, player, player);
					}
					return (
						trigger.targets.reduce((sum, target) => {
							sum -= get.effect(target, trigger.card, trigger.player, player);
						}, 0) - 2
					);
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			const link = result.links[0],
				type = `card${link}able`;
			event.result = await player
				.chooseCard(
					"绝围",
					link == "Recast" ? prompt1 : prompt2,
					card => {
						const { player, actType: type } = get.event(),
							source = type == "Recast" ? null : "clanjuewei";
						return get.type(card, player) == "equip" && lib.filter[type](card, player, source);
					},
					"he"
				)
				.set("actType", type)
				.set("ai", card => {
					return 8 - get.value(card);
				})
				.forResult();
			event.result.cost_data = link;
		},
		async content(event, trigger, player) {
			if (event.cost_data == "Recast") {
				await player.recast(event.cards);
				player
					.when({ global: "useCardAfter" })
					.filter(evt => evt == trigger.getParent())
					.step(async (event, trigger, player) => {
						const targets = trigger.targets.filter(target => target != player && target.isIn());
						if (targets?.length) {
							await player.chooseUseTarget(trigger.card, false, true, targets, 1);
						}
					});
			} else {
				await player.discard(event.cards);
				trigger.getParent().all_excluded = true;
				trigger.getParent().targets.length = 0;
			}
		},
	},
	//族杨彪
	clanjiannan: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		frequent: true,
		async content(event, trigger, player) {
			const next = player.draw(2);
			next.gaintag = [event.name];
			await next;
			player.addTempSkill("clanjiannan_effect", "phaseChange");
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				sub: true,
			},
			effect: {
				audio: "clanjiannan",
				trigger: {
					global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				onremove(player) {
					game.filterPlayer().forEach(target => target.removeGaintag("clanjiannan"));
				},
				charlotte: true,
				filter(event, player, triggername, target) {
					if (_status?.dying?.length || player.getStorage("clanjiannan_used").length > 3) {
						return false;
					}
					return true;
				},
				getIndex(event, player, triggername) {
					const targets = game.filterPlayer(target => {
						const evt = event.getl(target);
						if (!target.countCards("h") && evt?.hs?.length) {
							return true;
						}
						if (!evt?.cards2?.length || target.countCards("h", card => card.hasGaintag("clanjiannan"))) {
							return false;
						}
						if (event.name == "lose") {
							return Object.values(event.gaintag_map).flat().includes("clanjiannan");
						}
						return target.hasHistory("lose", evtx => {
							if (event != evtx.getParent()) {
								return false;
							}
							return Object.values(evtx.gaintag_map).flat().includes("clanjiannan");
						});
					});
					return targets.length;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseButtonTarget({
							createDialog: [
								"间难：令一名角色执行本回合未执行过的一项",
								[
									[
										["discard", "弃置两张牌"],
										["draw", "摸两张牌"],
										["recast", "重铸所有装备牌"],
										["put", "将一张锦囊牌置于牌堆顶或失去1点体力"],
									],
									"textbutton",
								],
							],
							forced: true,
							chooseds: player.getStorage("clanjiannan_used"),
							filterButton: button => {
								const link = button.link;
								return !get.event().chooseds.includes(link);
							},
							filterTarget: true,
							ai1: button => {
								const player = get.player();
								switch (button.link) {
									case "discard": {
										if (
											game.hasPlayer(target => {
												const att = get.attitude(player, target);
												return att < 0 && target.countCards("he");
											})
										) {
											return 2;
										}
										break;
									}
									case "draw": {
										return 4;
									}
									case "recast": {
										if (player.hasCard(card => get.type(card) == "equip", "he")) {
											return 3;
										}
										break;
									}
									case "put": {
										if (
											game.hasPlayer(target => {
												const att = get.attitude(player, target);
												return att < 0 && target.hp <= 1 && target.countCards("h") <= 3;
											})
										) {
											return 5;
										}
										break;
									}
								}
								return 1;
							},
							ai2: target => {
								const link = ui.selected.buttons[0]?.link,
									player = get.player(),
									att = get.attitude(player, target);
								if (!link) {
									return 0;
								}
								if (["draw", "recast"].includes(link)) {
									if (target == player) {
										return att * 3;
									}
									return att;
								}
								return -att;
							},
						})
						.forResult();
					if (event.result.bool) {
						event.result.cost_data = { link: event.result.links[0] };
					}
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.addTempSkill("clanjiannan_used");
					const link = event.cost_data.link;
					player.markAuto("clanjiannan_used", link);
					switch (link) {
						case "discard": {
							await target.chooseToDiscard("he", 2, true);
							break;
						}
						case "draw": {
							const next = target.draw(2);
							next.gaintag = ["clanjiannan"];
							await next;
							break;
						}
						case "recast": {
							await target.recast(
								target.getCards("he", card => target.canRecast(card) && get.type(card, player) == "equip"),
								null,
								(player, cards) => {
									let next = player.draw(cards.length);
									next.log = false;
									next.gaintag = ["clanjiannan"];
								}
							);
							break;
						}
						case "put": {
							const result2 = await target
								.chooseCard(
									"将一张锦囊牌置于牌堆顶，或失去1点体力",
									card => {
										return get.type2(card) == "trick";
									},
									"h"
								)
								.set("ai", function (card) {
									return 7 - get.value(card);
								})
								.forResult();
							if (result2.bool) {
								target.$throw(result2.cards.length);
								game.log(target, "将", result2.cards, "置于牌堆顶");
								await target.lose(result2.cards, ui.cardPile, "insert");
							} else {
								await target.loseHp();
							}
							break;
						}
					}
				},
			},
		},
	},
	clanyichi: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			return game.hasPlayer(target => player.canCompare(target));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => player.canCompare(target))
				.set("ai", target => {
					const player = get.player(),
						num = player.getHistory("useSkill", evt => ["clanjiannan", "clanjiannan_effect"].includes(evt.skill)).length;
					return num > 1 ? get.attitude(player, target) : -get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				{ bool } = await player.chooseToCompare(target).forResult(),
				num = player.getHistory("useSkill", evt => ["clanjiannan", "clanjiannan_effect"].includes(evt.skill)).length;
			if (bool && num > 0) {
				let count = 1;
				while (count < 5) {
					switch (count) {
						case 1: {
							if (target.countDiscardableCards(target, "he")) {
								await target.chooseToDiscard("he", 2, true);
							}
							break;
						}
						case 2: {
							await target.draw(2);
							break;
						}
						case 3: {
							await target.recast(target.getCards("he", card => target.canRecast(card) && get.type(card, player) == "equip"));
							break;
						}
						case 4: {
							const result2 = await target
								.chooseCard(
									"将一张锦囊牌置于牌堆顶，或失去1点体力",
									card => {
										return get.type2(card) == "trick";
									},
									"h"
								)
								.set("ai", function (card) {
									return 7 - get.value(card);
								})
								.forResult();
							if (result2.bool) {
								await target.lose(result2.cards, ui.cardPile, "insert");
								target.$throw(result2.cards.length);
								game.updateRoundNumber();
								game.log(target, "将", result2.cards, "置于牌堆顶");
							} else {
								await target.loseHp();
							}
							break;
						}
					}
					count++;
					if (count > num) {
						break;
					}
				}
			}
		},
	},
	//族杨众 —— by 星の语
	clanjuetu: {
		audio: 2,
		trigger: { player: "phaseDiscardBegin" },
		forced: true,
		async content(event, trigger, player) {
			trigger.setContent(lib.skill[event.name].phaseDiscard);
		},
		phaseDiscard: [
			async (event, trigger, player) => {
				game.log(player, "进入了弃牌阶段");
				game.broadcastAll(function (player) {
					if (lib.config.show_phase_prompt) {
						player.popup("弃牌阶段", null, false);
					}
				}, player);
				event.trigger("phaseDiscard");
			},
			async (event, trigger, player) => {
				const cards = player.getCards("h"),
					suits = cards.map(card => get.suit(card, player));
				if (!cards.length) {
					event.finish();
					return;
				}
				if (lib.suits.some(suit => suits.filter(suitx => suitx == suit).length > 1)) {
					const result = await player
						.chooseCard("请保留每种花色的手牌各一张，将其余手牌置入弃牌堆", [1, Infinity], true, (card, player) => {
							const selected = ui.selected.cards;
							if (!selected?.length) {
								return true;
							}
							return !selected.some(cardx => get.suit(cardx, player) == get.suit(card, player));
						})
						.set("complexCard", true)
						.set("suits", suits)
						.set("ai", card => get.value(card))
						.forResult();
					if (!result?.cards?.length) {
						event.finish();
						return;
					}
					const discard = cards.removeArray(result.cards);
					await player.loseToDiscardpile(discard);
				}
				if (game.hasPlayer(target => target.countDiscardableCards(target, "h"))) {
					const result2 = await player
						.chooseTarget(`绝途：令一名角色弃置一张手牌`, true, (card, player, target) => {
							return target.countDiscardableCards(target, "h");
						})
						.set("ai", target => {
							return get.effect(target, { name: "guohe_copy", position: "h" }, target, get.player());
						})
						.forResult();
					if (!result2?.targets?.length) {
						event.finish();
						return;
					}
					const target = result2.targets[0];
					player.line(target);
					//修复有些角色的牌不能在弃牌阶段弃置的bug
					const next = game.createEvent("clanjuetu_discard", false);
					next.player = player;
					next.target = target;
					next.setContent(async (event, trigger, player) => {
						const result = await target.chooseToDiscard("绝途：请弃置一张手牌", true, "h").forResult();
						if (!result?.cards?.length) {
							event.finish();
							return;
						}
						const suit = get.suit(result.cards[0], target);
						if (!player.hasCard(cardx => get.suit(cardx, player) == suit, "h")) {
							await target.damage();
						}
					});
					await next;
				}
			},
		],
	},
	clankudu: {
		audio: 2,
		limited: true,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h", card => player.canRecast(card)) > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard: (card, player) => player.canRecast(card),
					selectCard: 2,
					filterTarget: true,
					position: "he",
					ai1(card) {
						return 6 - get.value(card);
					},
					ai2(target) {
						return get.attitude(get.player(), target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cards = event.cards,
				num = Math.min(5, Math.abs(get.number(cards[0]) - get.number(cards[1]))),
				target = event.targets[0],
				skill = event.name + "_effect";
			await player.recast(cards);
			if (num > 0) {
				target.addSkill(skill);
				target.addMark(skill, num, false);
			}
		},
		subSkill: {
			effect: {
				intro: {
					content: "<li>下#个回合结束时摸一张牌<br><li>第#个回合后执行一个额外回合",
				},
				onremove: true,
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { global: "phaseEnd" },
				async content(event, trigger, player) {
					player.removeMark(event.name, 1, false);
					player.draw();
					if (!player.hasMark(event.name)) {
						player.insertPhase();
						player.removeSkill(event.name);
					}
				},
			},
		},
	},
	//族荀爽 —— by 刘巴
	clanyangji: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
			global: "phaseAnyEnd",
		},
		filter(event, player, name) {
			if (name !== "phaseZhunbeiBegin" && !game.hasGlobalHistory("changeHp", evt => evt.player === player && evt.num !== 0 && evt.getParent(event.name) === event)) {
				return false;
			}
			return true;
		},
		direct: true,
		clearTime: true,
		async content(event, trigger, player) {
			const next = player.chooseToUse(get.prompt2(event.name)).set("logSkill", event.name);
			const result = await next.forResult();
			if (!result?.bool) {
				return;
			}
			const target = _status.currentPhase;
			if (!player.hasHistory("sourceDamage", evt => evt.getParent(next.name) == next) && target?.canAddJudge("lebu")) {
				await player
					.chooseToUse()
					.set("openskilldialog", `佯疾：是否将一张黑桃牌当作【乐不思蜀】对${get.translation(target)}使用？`)
					.set("norestore", true)
					.set("_backupevent", `${event.name}_backup`)
					.set("custom", {
						add: {},
						replace: { window() {} },
					})
					.backup(`${event.name}_backup`)
					.set("targetRequired", true)
					.set("complexTarget", true)
					.set("complexSelect", true)
					.set("addCount", false)
					.set("targetx", target);
			}
		},
		subSkill: {
			backup: {
				filterCard(card, player) {
					if (get.itemtype(card) !== "card") {
						return;
					}
					return get.suit(card, player) == "spade";
				},
				filterTarget(card, player, target) {
					return lib.filter.judge(card, player, target) && target === get.event().targetx;
				},
				filterOk() {
					return ui.selected.targets.length === 1;
				},
				selectTarget: -1,
				viewAs: {
					name: "lebu",
				},
				selectCard: 1,
				position: "hes",
				ai1(card) {
					return 7 - get.value(card);
				},
				ai2(target) {
					if (target == get.player() && get.player().hasSkill("clandandao")) {
						return true;
					}
					return get.effect_use.apply(this, arguments);
				},
				log: false,
			},
		},
	},
	clandandao: {
		audio: 2,
		trigger: { player: "judgeAfter" },
		forced: true,
		filter(event, player) {
			return _status.currentPhase?.isIn() && game.getGlobalHistory("everything", evt => evt.name == "judge" && evt.player == player).indexOf(event) == 0;
		},
		content() {
			const target = _status.currentPhase;
			if (!target?.isIn()) {
				return;
			}
			target.addSkill(event.name + "_add");
			target.addMark(event.name + "_add", 1, false);
		},
		subSkill: {
			add: {
				charlotte: true,
				onremove: true,
				mark: true,
				markimage: "image/card/handcard.png",
				intro: {
					content: "手牌上限+#",
				},
				mod: { maxHandcard: (player, num) => num + player.countMark("clandandao_add") },
			},
		},
	},
	clanqingli: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return player.countCards("h") < Math.min(5, player.getHandcardLimit());
		},
		async content(event, trigger, player) {
			await player.drawTo(Math.min(player.getHandcardLimit(), 5));
		},
	},
	//族杨修 —— by 刘巴
	clanjiewu: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "令一名角色的手牌在本阶段对你可见")
				.set("ai", target => {
					let items = target.getCards("h");
					let count = [...new Set(items.map(item => get.suit(item, target)))].length;
					const player = get.player();
					return (get.effect(target, { name: "draw" }, target, player) * items) / (count + 1);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.markAuto(event.name + "_effect", target);
			player.addSkill(event.name + "_effect");
			target.addSkill(event.name + "_view");
			const func = target => target.markSkill("clanjiewu_view", null, null, true);
			event.isMine() ? func(target) : player.isOnline2() && player.send(func, target);
			player
				.when({ global: "phaseUseAfter" })
				.filter(evt => evt === trigger)
				.step(async () => player.removeSkill("clanjiewu_effect"));
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove(player, skill) {
					if (player.storage[skill]) {
						Array.isArray(player.storage[skill]) && player.storage[skill].forEach(i => i.removeSkill("clanjiewu_view"));
						delete player.storage[skill];
					}
				},
				audio: "clanjiewu",
				trigger: { player: "useCardToPlayered" },
				filter: (event, player) => event.isFirstTarget && event.targets.some(target => target != player),
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt(event.skill), "选择一名「捷悟」角色展示其一张手牌")
						.set("filterTarget", (card, player, target) => target.hasCard(true, "h") && player.getStorage("clanjiewu_effect").includes(target))
						.set("ai", target => {
							let items = target.getCards("h");
							let count = [...new Set(items.map(item => get.suit(item, target)))].length;
							const player = get.player();
							return (4 - count) * get.effect(target, { name: "draw" }, target, player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					let cards;
					if (target === player) {
						cards = (await player.chooseCard("h", true, `捷悟：展示你的一张手牌`).forResult()).cards;
					} else {
						cards = (await player.choosePlayerCard(target, true, "h", `捷悟：展示${get.translation(target)}的一张手牌`).forResult()).cards;
					}
					if (!cards?.length) {
						return;
					}
					const card = cards[0];
					await player.showCards(card, `${get.translation(player)}对${get.translation(target)}发动了【捷悟】`).set("clanjiewu", true);
					if (get.suit(trigger.card, player) === get.suit(card, target)) {
						await player.draw();
					}
					if (
						game.getGlobalHistory("everything", evt => {
							return evt.name === "showCards" && evt.cards.length && evt.cards.some(c => c === card) && evt?.clanjiewu;
						}).length > 1
					) {
						let cardsx;
						if (target.countCards("h") !== player.countCards("h")) {
							const putee = player.countCards("h") > target.countCards("h") ? player : target;
							if (!putee.countCards("he")) {
								return;
							}
							if (player !== putee) {
								cardsx = (await player.choosePlayerCard(putee, true, "he", "捷悟：将" + get.translation(putee) + "的一张牌置于牌堆顶").forResult()).cards;
							} else {
								cardsx = (await player.chooseCard("he", true, "捷悟：将你的一张牌置于牌堆顶").forResult()).cards;
							}
							const card = cardsx[0];
							putee.$throw(get.position(card) == "h" ? 1 : card, 1000);
							game.log(player, "将", putee === player ? "" : get.translation(putee) + "的", get.position(card) == "h" ? "一张牌" : card, "置于牌堆顶");
							await putee.lose(card, ui.cardPile, "insert");
						}
					}
				},
				ai: {
					viewHandcard: true,
					skillTagFilter(player, tag, arg) {
						if (!player.getStorage("clanjiewu_effect").includes(arg)) {
							return false;
						}
					},
				},
			},
			view: {
				charlotte: true,
				intro: {
					markcount: (content, player) => player.countCards("h").toString(),
					mark(dialog, content, player) {
						const hs = player.getCards("h");
						hs.length > 0 ? dialog.addSmall(hs) : dialog.addText("没有手牌");
					},
				},
			},
		},
	},
	clangaoshi: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter: (event, player) => player.hasHistory("useSkill", evt => ["clanjiewu", "clanjiewu_effect"].includes(evt.skill)),
		prompt(event, player) {
			return get.prompt("clangaoshi") + "（可亮出" + get.cnNumber(player.getHistory("useSkill", evt => ["clanjiewu", "clanjiewu_effect"].includes(evt.skill)).length) + "张牌）";
		},
		async content(event, trigger, player) {
			const num = player.getHistory("useSkill", evt => {
				return ["clanjiewu", "clanjiewu_effect"].includes(evt.skill);
			}).length;
			const names = player.getHistory("useCard").map(evt => evt.card.name),
				cards = [];
			event.forceDie = true;
			event.includeOut = true;
			while (cards.length < num) {
				//周群亮出的写法
				const judgestr = get.translation(player) + "展示的第" + get.cnNumber(cards.length + 1, true) + "张【高视】牌";
				event.videoId = lib.status.videoId++;
				const card = get.cards()[0];
				cards.add(card);
				await game.cardsGotoOrdering(card);
				game.addVideo("judge1", player, [get.cardInfo(card), judgestr, event.videoId]);
				game.broadcastAll(
					function (player, card, str, id, cardid) {
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
					event.videoId,
					get.id()
				);
				game.log(player, "展示了牌堆顶的", card);
				await game.delay(2);
				game.broadcastAll(function (id) {
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
					}
					ui.arena.classList.remove("thrownhighlight");
				}, event.videoId);
				game.addVideo("judge2", null, event.videoId);
				if (names.includes(card.name)) {
					break;
				}
			}
			game.broadcastAll(function () {
				ui.clear();
			});
			if (!cards.length) {
				return;
			}
			while (cards.some(card => player.hasUseTarget(card))) {
				const { links } = await player
					.chooseButton([`高视：是否使用其中一张牌？`, cards])
					.set("filterButton", button => {
						const player = get.player(),
							card = button.link;
						return player.hasUseTarget(card);
					})
					.set("ai", button => {
						return get.player().getUseValue(button.link);
					})
					.forResult();
				if (!links?.length) {
					break;
				}
				cards.remove(links[0]);
				player.$gain2(links[0], false);
				await player.chooseUseTarget(links[0], true, false);
			}
			if (!cards.length) {
				await player.draw(2);
			}
		},
		ai: {
			combo: "clanjiewu",
		},
	},
	//族杨赐
	clanqieyi: {
		audio: 2,
		trigger: { player: ["phaseUseBegin", "useCardAfter"] },
		filter(event, player) {
			if (event.name == "useCard") {
				if (!player.hasSkill("clanqieyi_effect") || !lib.suits.includes(get.suit(event.card))) {
					return false;
				}
				const history = player.getHistory("useCard", evt => get.suit(evt.card) == get.suit(event.card));
				return history.indexOf(event) == 0;
			}
			return true;
		},
		async cost(event, trigger, player) {
			if (trigger.name == "phaseUse") {
				event.result = await player
					.chooseBool(get.prompt2(event.skill))
					.set("ai", () => true)
					.forResult();
			} else {
				event.result = { bool: true };
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "phaseUse") {
				player.addTempSkill(event.name + "_effect");
				const cards = get.cards(2, true);
				await player.viewCards("切议", cards);
			} else {
				const card = get.cards(1, true)[0];
				await player.showCards([card]);
				if (get.color(card) == get.color(trigger.card) || get.type2(card) == get.type2(trigger.card)) {
					await player.gain(card, "gain2");
				} else {
					if (!player.countCards("he")) {
						return;
					}
					const result = await player.chooseCard(`切议：将一张牌置于牌堆顶`, "he", true).forResult();
					const card = result.cards[0];
					player.$throw(get.position(card) == "h" ? 1 : card, 1000);
					game.log(player, "将", get.position(card) == "h" ? "一张牌" : card, "置于牌堆顶");
					await player.lose(card, ui.cardPile, "insert");
					await game.delayx();
				}
			}
		},
		subSkill: {
			effect: {
				init(player, skill) {
					const suits = player
						.getHistory("useCard", evt => lib.suits.includes(get.suit(evt.card)))
						.map(evt => get.suit(evt.card))
						.unique()
						.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
					player.markAuto(skill, suits);
					if (suits.length) {
						player.addTip(skill, get.translation(skill) + suits.reduce((str, i) => str + get.translation(i), ""));
					}
				},
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				mark: true,
				intro: {
					content: "已使用过的花色：$",
					onunmark(storage, player) {
						player.removeTip("clanqieyi_effect");
					},
				},
				silent: true,
				charlotte: true,
				trigger: { player: "useCard" },
				content() {
					lib.skill.clanqieyi_effect.init(player, event.name);
				},
			},
		},
	},
	clanjianzhi: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		filter(event, player) {
			const num = player.getHistory("useSkill", evt => evt.skill == "clanqieyi").length;
			return num > 0;
		},
		async content(event, trigger, player) {
			const list = Array.from({
				length: player.getHistory("useSkill", evt => evt.skill == "clanqieyi").length,
			}).map((_, i) => get.cnNumber(i + 1, true));
			const result = await player
				.chooseControl(list)
				.set("prompt", `###谏直###进行至多${get.cnNumber(list.length)}次判定，并执行后续效果`)
				.set("ai", () => get.event().list.length - 1)
				.set("list", list)
				.forResult();
			if (typeof result?.index !== "number") {
				return;
			}
			let num = result.index + 1,
				judge = [];
			while (num--) {
				const judgeEvent = player.judge();
				judgeEvent.judge2 = result => result.bool;
				judgeEvent.set("callback", async event => {
					event.getParent().orderingCards.remove(event.card);
				});
				const result = await judgeEvent.forResult();
				if (!result?.card) {
					break;
				} else {
					judge.push(result.card);
				}
			}
			const suits = player
				.getHistory("useCard")
				.map(evt => get.suit(evt.card))
				.unique();
			const cards = judge.filter(card => suits.includes(get.suit(card, false)));
			if (cards.length) {
				if (_status.connectMode) {
					game.broadcastAll(() => {
						_status.noclearcountdown = true;
					});
				}
				const given_map = new Map();
				let result;
				while (cards.length) {
					if (cards.length > 1) {
						result = await player
							.chooseButtonTarget({
								createDialog: ["谏直：请选择要分配的牌", cards],
								forced: true,
								selectButton: [1, Infinity],
								ai1(button) {
									if (ui.selected.buttons.length) {
										return 0;
									}
									return get.buttonValue(button);
								},
								ai2(target) {
									const { player, given_map: map } = get.event(),
										att = get.attitude(player, target),
										card = ui.selected.buttons?.[0]?.link;
									if (!card) {
										return 0;
									}
									if (get.value(card, player, "raw") < 0) {
										return Math.max(0.01, 100 - att);
									} else if (att > 0) {
										const cards = map.has(target) ? map.get(target) : [];
										return Math.max(0.1, att / Math.sqrt(1 + target.countCards("h") + cards.length));
									} else {
										return 0;
									}
								},
								given_map: given_map,
							})
							.forResult();
					} else if (cards.length === 1) {
						result = await player
							.chooseTarget(`选择一名角色获得${get.translation(cards)}`, true)
							.set("ai", target => {
								const { player, given_map: map, toGive: card } = get.event(),
									att = get.attitude(player, target);
								if (!card) {
									return 0;
								}
								if (get.value(card, player, "raw") < 0) {
									return Math.max(0.01, 100 - att);
								} else if (att > 0) {
									const cards = map.has(target) ? map.get(target) : [];
									return Math.max(0.1, att / Math.sqrt(1 + target.countCards("h") + cards.length));
								} else {
									return 0;
								}
							})
							.set("given_map", given_map)
							.set("toGive", cards[0])
							.forResult();
						result.links = cards.slice(0);
					} else {
						break;
					}
					if (result.bool) {
						const {
							links: toGive,
							targets: [target],
						} = result;
						cards.removeArray(toGive);
						const given = (given_map.get(target) ?? []).concat(toGive);
						given_map.set(target, given);
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
				const gain_list = Array.from(given_map.entries());
				for (const info of gain_list) {
					player.line(info[0], "green");
					game.log(info[0], "获得了", info[1]);
				}
				await game
					.loseAsync({
						gain_list,
						giver: player,
						animate: "gain2",
					})
					.setContent("gaincardMultiple");
			}
			if (judge.some(card => !suits.includes(get.suit(card, false)))) {
				await player.damage("nosource", "thunder");
			}
		},
		ai: { combo: "clanqieyi" },
	},
	clanquhuo: {
		audio: 2,
		clanSkill: true,
		audioname: ["clan_yangci", "clan_yangxiu", "clan_yangbiao", "clan_yangzhong"],
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			const evt = event.getl(player);
			if (!evt?.hs?.length) {
				return false;
			}
			const hs = evt.hs;
			if (!hs.some(card => get.type(card) == "equip" || get.name(card) == "jiu")) {
				return false;
			}
			//排除因使用、打出、弃置而失去牌的情况
			if (event.name.indexOf("lose") == 0) {
				if (event.type === "discard") {
					return false;
				}
				if (["useCard", "respond"].includes(event.getParent()?.name)) {
					return false;
				}
			}
			const history = player
				.getHistory("lose", evtx => {
					if (evtx.type == "discard") {
						return false;
					}
					const evt2 = evtx.relatedEvent || evtx.getParent();
					if (["useCard", "respond"].includes(evt2?.name)) {
						return false;
					}
					return evtx?.hs.some(card => get.type(card) == "equip" || get.name(card) == "jiu");
				})
				.map(evtx => (event.name == "lose" ? evtx : evtx.getParent()));
			return (
				history.indexOf(event) == 0 &&
				game.hasPlayer(target => {
					return target.isDamaged() && (target.hasClan("弘农杨氏") || target == player);
				})
			);
		},
		async cost(event, trigger, player) {
			const targets = game.filterPlayer(target => {
				return target.isDamaged() && (target.hasClan("弘农杨氏") || target == player);
			});
			if (!targets.length) {
				return;
			}
			if (targets.length == 1) {
				const result = await player
					.chooseBool(get.prompt2(event.skill, targets))
					.set("ai", () => {
						return get.attitude(get.player(), get.event().target) > 0;
					})
					.set("target", targets[0])
					.forResult();
				if (result.bool) {
					event.result = {
						bool: true,
						targets: targets,
					};
				}
			} else {
				event.result = await player
					.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
						return target.isDamaged() && (target.hasClan("弘农杨氏") || target == player);
					})
					.set("ai", target => {
						return get.recoverEffect(target, get.player());
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.recover();
		},
	},
	//族吴懿
	clangaojin: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			return player.getHistory("useCard", evt => evt.card).indexOf(event) == player.getHandcardLimit() - 1;
		},
		async content(event, trigger, player) {
			player.addTempSkill(event.name + "_effect");
			const result = await player
				.chooseButton([
					`高劲：你可以选择至多两项`,
					[
						[
							[0, "手牌上限-1"],
							[1, `摸${player.getHp()}张牌`],
							[2, `手牌上限+1`],
						],
						"tdnodes",
					],
				])
				.set("selectButton", [1, 2])
				.set("ai", button => {
					if (button.link == 1) {
						return get.player().getHp();
					}
					return 0;
				})
				.forResult();
			if (result?.links?.length) {
				const links = result.links;
				if (links.includes(0)) {
					lib.skill.chenliuwushi.change(player, -1);
				}
				if (links.includes(1)) {
					await player.draw(player.getHp());
				}
				if (links.includes(2)) {
					lib.skill.chenliuwushi.change(player, 1);
				}
				if (links.length > 1 && Math.abs(links[0] - links[1]) == 1) {
					await player.chooseToDiscard("he", player.getHandcardLimit(), true);
				}
			}
		},
		subSkill: {
			effect: {
				mod: {
					cardUsable: () => Infinity,
					targetInRange: () => true,
				},
				trigger: {
					player: "useCard1",
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				content() {
					player.removeSkill(event.name);
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						const stat = player.getStat().card,
							name = trigger.card.name;
						if (typeof stat[name] == "number") {
							stat[name]--;
						}
					}
				},
				mark: true,
				intro: {
					content: "使用下一张牌无距离和次数限制",
				},
			},
		},
	},
	//距离变化后神将
	old_clangaojin: {
		audio: 2,
		updateDistanceMap() {
			const obj = {};
			for (const i of game.players) {
				if (!obj[i.playerid]) {
					obj[i.playerid] = {};
				}
				for (const j of game.players) {
					//i到j的距离
					obj[i.playerid][j.playerid] = get.distance(i, j);
				}
			}
			_status.playerDistanceMap = obj;
		},
		hasDistanceChanged(player) {
			const map = _status.playerDistanceMap;
			if (!map) {
				lib.skill.old_clangaojin.updateDistanceMap();
			}
			let bool = false;
			for (const i of game.players) {
				if (map[player.playerid][i.playerid] != get.distance(player, i)) {
					bool = true;
				}
			}
			lib.skill.old_clangaojin.updateDistanceMap();
			return bool;
		},
		init: () => lib.skill.old_clangaojin.updateDistanceMap(),
		trigger: {
			global: ["logSkill", "useSkillAfter", "dieAfter", "changeHp", "equipAfter", "changeSkillsAfter"],
		},
		forced: true,
		filter(event, player) {
			return lib.skill.old_clangaojin.hasDistanceChanged(player);
		},
		async content(event, trigger, player) {
			await player.draw();
		},
		group: "old_clangaojin_buff",
		subSkill: {
			buff: {
				audio: "old_clangaojin",
				trigger: {
					global: ["phaseBefore", "roundStart"],
					player: ["enterGame"],
				},
				filter(event, player, name) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				async content(event, trigger, player) {
					player.addMark(event.name, player.getHandcardLimit(), false);
				},
				mod: {
					globalFrom(from, to, current) {
						return current - from.countMark("old_clangaojin_buff");
					},
				},
				intro: {
					content: "计算与其他角色的距离-#",
				},
			},
		},
	},
	clanpoxi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(_, player, target) {
			if (target.countDiscardableCards("he") <= 0) {
				return false;
			}
			return get.distance(player, target) <= 1;
		},
		mod: {
			globalFrom(from, to, current) {
				return current + from.countMark("clanpoxi");
			},
		},
		intro: {
			content: "计算与其他角色的距离+#",
		},
		async content(event, trigger, player) {
			const { target } = event;
			const { cards } = await player
				.discardPlayerCard(target, true)
				.set("ai", function (button) {
					if (!["basic", "equip"].includes(get.type(button.link))) {
						return 0;
					}
					return Math.random();
				})
				.forResult();
			if (["basic", "equip"].includes(get.type(cards[0]))) {
				await player.chooseUseTarget({ name: "sha", isCard: true }, cards);
			}
		},
		group: ["clanpoxi_directHit", "clanpoxi_check"],
		subSkill: {
			directHit: {
				direct: true,
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					return event.getParent(2).name == "clanpoxi";
				},
				async content(event, trigger, player) {
					const { bool } = await player.chooseBool("破袭：是否令此牌不可被响应？").forResult();
					if (bool) {
						trigger.directHit.addArray(trigger.targets);
					}
				},
			},
			check: {
				silent: true,
				trigger: {
					source: "damageSource",
				},
				filter(event, player) {
					return event.getParent(4).name == "clanpoxi";
				},
				async content(event, trigger, player) {
					player.addMark("clanpoxi", 1, false);
				},
			},
		},
		ai: {
			order: 7,
			result: {
				player: 2,
				target: -1,
			},
		},
	},
	//族王沈
	clananran: {
		audio: 2,
		trigger: { player: ["phaseUseBegin", "damageEnd"] },
		async cost(event, trigger, player) {
			const count = Math.min(4, player.countMark("clananran_used") + 1);
			const result = await player
				.chooseButton([
					get.prompt2(event.skill),
					[
						[
							["draw", `摸${get.cnNumber(count)}张牌`],
							["asyncDraw", `令至多${get.cnNumber(count)}名角色摸一张牌`],
						],
						"textbutton",
					],
				])
				.set("ai", button => {
					const player = get.player(),
						count = Math.min(4, player.countMark("clananran_used") + 1);
					if (button.link === "draw") {
						return get.effect(player, { name: "draw" }, player, player) * count;
					}
					return game
						.filterPlayer(target => get.effect(target, { name: "draw" }, player, player) > 0)
						.sort((a, b) => {
							return get.effect(b, { name: "draw" }, player, player) - get.effect(a, { name: "draw" }, player, player);
						})
						.slice(0, count)
						.reduce((sum, target) => sum + get.effect(target, { name: "draw" }, player, player), 0);
				})
				.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.links?.[0],
			};
		},
		async content(event, trigger, player) {
			const tag = "clananran_tag",
				mark = "clananran_used";
			player.addSkill(mark);
			if (player.countMark(mark) < 4) {
				player.addMark(mark, 1, false);
			}
			const count = player.countMark(mark);
			const { cost_data } = event,
				map = { player: "useCard1", global: "phaseAfter" };
			if (cost_data == "draw") {
				player.addTempSkill(tag, map);
				await player.draw(count).set("gaintag", [tag]);
			} else {
				const result = await player.chooseTarget(`岸然：令至多${get.cnNumber(count)}名角色各摸一张牌`, [1, count], true).forResult();
				if (result.targets?.length) {
					for (const i of result.targets.sortBySeat()) {
						i.addTempSkill(tag, map);
						await i.draw("nodelay").set("gaintag", [tag]);
					}
					await game.delayx();
				}
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				intro: { content: "当前【岸然】X为#" },
			},
			tag: {
				charlotte: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				mod: {
					cardEnabled(card) {
						if ([card].concat(card.cards || []).some(c => get.itemtype(c) === "card" && c.hasGaintag("clananran_tag"))) {
							return false;
						}
					},
					cardSavable(card) {
						if ([card].concat(card.cards || []).some(c => get.itemtype(c) === "card" && c.hasGaintag("clananran_tag"))) {
							return false;
						}
					},
				},
			},
		},
	},
	clangaobian: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			const targets = game.filterPlayer2(target => target.hasHistory("damage"));
			return targets.length == 1 && targets[0]?.isIn();
		},
		forced: true,
		logTarget(event, player) {
			return game.findPlayer2(target => target.hasHistory("damage"));
		},
		async content(event, trigger, player) {
			const target = game.findPlayer2(target => target.hasHistory("damage"));
			const discarded = _status.discarded.filter(c => c.name == "sha");
			const bool = discarded.some(c => target.hasUseTarget(c));
			const result = bool
				? await target
						.chooseButton(
							[
								"告变：请选择一项",
								[
									[
										["sha", "使用本回合进入弃牌堆的一张【杀】"],
										["loseHp", "失去1点体力"],
									],
									"textbutton",
								],
							],
							true
						)
						.set(
							"discarded",
							discarded.filter(c => target.hasUseTarget(c))
						)
						.set("ai", button => {
							const { player, discarded: cards } = get.event();
							return {
								sha: Math.max(...cards.map(card => player.getUseValue(card))),
								loseHp: get.effect(player, { name: "losehp" }, player, player),
							}[button.link];
						})
						.forResult()
				: { bool: true, links: ["loseHp"] };
			if (result.links[0] == "sha") {
				const result2 = await target
					.chooseCardButton("告变：请选择其中一张【杀】使用", discarded, true)
					.set("filterButton", button => {
						return get.player().hasUseTarget(button.link);
					})
					.forResult();
				if (result2?.bool && result2.links?.length) {
					await target.chooseUseTarget(result2.links[0], true, false);
				}
			} else {
				await target.loseHp();
			}
		},
	},
	// 族王昶
	clankaiji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (!event.clankaiji_enabledTargets) {
				return false;
			}
			return game.hasPlayer(current => get.info("clankaiji").filterTarget(null, player, current));
		},
		onChooseToUse(event) {
			if (game.online || event.type !== "phase") {
				return;
			}
			const player = event.player;
			const chosen = player.getRoundHistory("useSkill", evt => evt.skill === "clankaiji").reduce((list, evt) => list.add(evt.targets[0]), []);
			event.set("clankaiji_enabledTargets", chosen);
		},
		filterTarget(card, player, target) {
			return !get.event().clankaiji_enabledTargets.includes(target) && player.countDiscardableCards(target, "h");
		},
		async content(event, trigger, player) {
			const { target } = event;
			const { links: cards } = await target
				.discardPlayerCard(player, "h", true)
				.set("ai", button => {
					const { player, target } = get.event(),
						{ link } = button;
					if (get.attitude(player, target) > 0) {
						if (target.hasUseTarget(link)) {
							return 10;
						}
						return 6 - get.value(link);
					}
					if (player.hasSkillTag("viewHandcard", null, target, true)) {
						if (!target.hasUseTarget(link)) {
							return 10;
						}
						return get.value(link);
					}
					if (get.is.shownCard(link) && !target.hasUseTarget(link)) {
						return 10;
					}
					return 1;
				})
				.forResult();
			if (!cards || !cards.someInD("d")) {
				return;
			}
			const card = cards.filterInD("d");
			await game.delayx();
			const { bool } = await player.chooseUseTarget(`你可以使用${get.translation(card)}然后摸一张牌`, card, false).forResult();
			if (bool) {
				await player.draw();
			}
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					if (!player.hasCard(card => player.hasUseTarget(card), "h")) {
						return -1;
					}
					if (player == target || get.attitude(player, target) > 0) {
						return 1;
					}
					if (player.countCards("h", card => player.hasUseTarget(card)) >= player.countCards("h", card => !player.hasUseTarget(card))) {
						return -0.5 + Math.random();
					}
					return -1;
				},
			},
		},
	},
	//族钟繇
	clanchengqi: {
		getUsed: player =>
			player
				.getHistory("useCard", evt => ["basic", "trick"].includes(get.type(evt.card, null, false)))
				.map(evt => get.name(evt.card))
				.toUniqued(),
		hiddenCard(player, name) {
			if (get.type(name) != "basic" && get.type(name) != "trick") {
				return false;
			}
			if (get.info("clanchengqi").getUsed(player).includes(name)) {
				return false;
			}
			return player.countCards("hs") > 1 && lib.inpile.includes(name);
		},
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			if (player.countCards("hs") < 2) {
				return false;
			}
			return get
				.inpileVCardList(info => {
					const name = info[2];
					if (get.type(name) != "basic" && get.type(name) != "trick") {
						return false;
					}
					return !(event.clanchengqi || []).includes(name);
				})
				.some(card => event.filterCard(get.autoViewAs({ name: card[2], nature: card[3] }, "unsure"), player, event));
		},
		onChooseToUse(event) {
			if (!game.online && !event.clanchengqi) {
				const player = event.player;
				event.set("clanchengqi", get.info("clanchengqi").getUsed(player));
			}
		},
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => {
						const name = info[2];
						if (get.type(name) != "basic" && get.type(name) != "trick") {
							return false;
						}
						return !(event.clanchengqi || []).includes(name);
					})
					.filter(card => event.filterCard(get.autoViewAs({ name: card[2], nature: card[3] }, "unsure"), player, event));
				return ui.create.dialog("承启", [list, "vcard"]);
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return get.event().player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "clanchengqi",
					filterCard: true,
					complexCard: true,
					selectCard: [2, Infinity],
					popname: true,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					filterOk() {
						return (
							(ui.selected.cards || []).reduce((sum, card) => {
								return sum + get.cardNameLength(card);
							}, 0) >= get.cardNameLength(lib.skill.clanchengqi_backup.viewAs.name)
						);
					},
					ai1(card) {
						const player = get.event().player;
						const name = lib.skill.clanchengqi_backup.viewAs.name;
						if (ui.selected.cards.length > 1 || card.name == name) {
							return 0;
						}
						if (
							ui.selected.cards.length &&
							game.hasPlayer(target => {
								return get.effect(target, { name: "draw" }, player, player) > 0;
							})
						) {
							if (get.cardNameLength(name) <= get.cardNameLength(card) + get.cardNameLength(ui.selected.cards[0])) {
								return 10 / (get.value(card) || 0.5);
							}
						}
						return 1 / (get.value(card) || 0.5);
					},
					position: "hs",
					precontent() {
						player.addTempSkill("clanchengqi_effect");
					},
				};
			},
			prompt(links, player) {
				return "将至少两张手牌当作" + get.translation(links[0][3] || "") + "【" + get.translation(links[0][2]) + "】使用";
			},
		},
		ai: {
			order(item, player) {
				if (player && get.event().type == "phase") {
					let list = get
						.inpileVCardList(info => {
							const name = info[2];
							if (get.type(name) != "basic" && get.type(name) != "trick") {
								return false;
							}
							return !get.info("clanchengqi").getUsed(player).includes(name);
						})
						.map(card => {
							return { name: card[2], nature: card[3] };
						})
						.filter(card => player.getUseValue(card, true, true) > 0);
					if (!list.length) {
						return 0;
					}
					list.sort((a, b) => (player.getUseValue(b, true, true) || 0) - (player.getUseValue(a, true, true) || 0));
					return get.order(list[0], player) * 0.99;
				}
				return 0.001;
			},
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") {
					return false;
				}
				const name = tag == "respondSha" ? "sha" : "shan";
				return get.info("clanchengqi").hiddenCard(player, name);
			},
			result: {
				player(player) {
					if (_status.event?.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		subSkill: {
			backup: { audio: "clanchengqi" },
			effect: {
				charlotte: true,
				trigger: { player: "useCard" },
				filter(event, player) {
					return (
						event.skill == "clanchengqi_backup" &&
						get.cardNameLength(event.card) ==
							(event.cards || []).reduce((sum, card) => {
								return sum + get.cardNameLength(card);
							}, 0)
					);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget("承启：是否令一名角色摸一张牌？")
						.set("ai", target => {
							const player = get.event().player;
							return get.effect(target, { name: "draw" }, player, player);
						})
						.forResult();
				},
				popup: false,
				content() {
					player.line(event.targets);
					event.targets[0].draw();
				},
			},
		},
	},
	clanjieli: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.hasPlayer(target => {
				return target.countCards("h");
			});
		},
		async cost(event, trigger, player) {
			const num = player.getHistory("useCard").length > 0 ? Math.max(...player.getHistory("useCard").map(history => get.cardNameLength(history.card))) : 0;
			const str = num > 0 ? "并观看牌堆顶" + get.cnNumber(num) + "张牌，然后你可以交换其中任意张牌" : "";
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "观看一名角色的牌名字数最多的手牌" + str, (card, player, target) => {
					return target.countCards("h");
				})
				.set("ai", target => {
					const player = get.event().player;
					const num = Math.max(...target.getCards("h").map(card => get.cardNameLength(card)));
					return num + 0.0001 * get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = player.getHistory("useCard").length > 0 ? Math.max(...player.getHistory("useCard").map(history => get.cardNameLength(history.card))) : 0;
			const limit = Math.max(...target.getCards("h").map(card => get.cardNameLength(card)));
			const cards = target.getCards("h", card => get.cardNameLength(card) == limit);
			if (num > 0) {
				const topCards = get.cards(num);
				await game.cardsGotoOrdering(topCards);
				const result = await player
					.chooseToMove("诫厉：交换其中任意张牌")
					.set("list", [
						[get.translation(target) + "牌名字数最多的手牌", cards, "dcsushou_tag"],
						["牌堆顶", topCards],
					])
					.set("filterMove", (from, to) => {
						return typeof to != "number";
					})
					.set("filterOk", moved => {
						return moved[1].some(card => get.owner(card));
					})
					.set("processAI", list => {
						const num = Math.min(list[0][1].length, list[1][1].length);
						const player = get.event().player,
							target = get.event().getParent().targets[0];
						const sgn = get.sgn(get.sgn(get.attitude(player, target)) - 0.5);
						const cards1 = list[0][1].slice().sort((a, b) => get.value(a, "raw") * sgn - get.value(b, "raw") * sgn);
						const cards2 = list[1][1].slice().sort((a, b) => get.value(b, "raw") * sgn - get.value(a, "raw") * sgn);
						return [cards1.slice().addArray(cards2.slice(0, num)), cards2.slice().addArray(cards1.slice(0, num))];
					})
					.forResult();
				if (result.bool) {
					const lose = result.moved[1].slice();
					const gain = result.moved[0].slice().filter(i => !get.owner(i));
					if (lose.some(i => get.owner(i))) {
						await game.cardsGotoOrdering(lose.filter(i => get.owner(i)));
					}
					await game.cardsGotoPile(lose.reverse(), "insert");
					game.updateRoundNumber();
					if (gain.length) {
						await target.gain(gain, "draw");
					}
				} else {
					await game.cardsGotoPile(topCards.slice().reverse(), "insert");
					game.updateRoundNumber();
				}
			} else {
				const content = ['###诫厉###<div class="text center">' + get.translation(target) + "牌名字数最多的手牌</div>", cards];
				await player.chooseControl("ok").set("dialog", content);
			}
		},
	},
	//族王明山
	clantanque: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		usable: 1,
		filter(event, player) {
			const evt = lib.skill.dcjianying.getLastUsed(player, event);
			if (!evt || !evt.card) {
				return false;
			}
			const curCard = event.card,
				prevCard = evt.card;
			const curNum = get.number(curCard),
				prevNum = get.number(prevCard);
			if (typeof curNum != "number" || typeof prevNum != "number") {
				return false;
			}
			const delNum = Math.abs(curNum - prevNum);
			if (delNum === 0) {
				return false;
			}
			return game.hasPlayer(current => {
				return current.getHp() === delNum || current.countCards("h") == delNum;
			});
		},
		locked: false,
		async cost(event, trigger, player) {
			const evt = lib.skill.dcjianying.getLastUsed(player, trigger);
			const curCard = trigger.card,
				prevCard = evt.card;
			const curNum = get.number(curCard),
				prevNum = get.number(prevCard);
			const delNum = Math.abs(curNum - prevNum);
			event.result = await player
				.chooseTarget(get.prompt(event.skill), `对一名体力值或手牌数为${delNum}的角色造成1点伤害`, (card, player, target) => {
					return target.getHp() === get.event().delNum || target.countCards("h") == get.event().delNum;
				})
				.set("delNum", delNum)
				.set("ai", target => {
					return get.damageEffect(target, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.damage();
			await game.delayx();
		},
		mod: {
			aiOrder(player, card, num) {
				if (typeof card != "object") {
					return;
				}
				const evt = lib.skill.dcjianying.getLastUsed(player);
				if (!evt || !evt.card) {
					return;
				}
				const curNum = get.number(card),
					prevNum = get.number(evt.card);
				if (typeof curNum != "number" || typeof prevNum != "number") {
					return;
				}
				const pairs = game
					.filterPlayer()
					.map(current => {
						return [current.getHp(), get.damageEffect(current, player, player)];
					})
					.filter(pair => pair[1] > 0);
				if (!pairs.length) {
					return;
				}
				const delNum = Math.abs(curNum - prevNum);
				for (const [hp, eff] of pairs) {
					if (hp != delNum) {
						continue;
					}
					return num + 10 + pairs.filter(pair => pair[0] === hp).sort((a, b) => b[1] - a[1])[0][1] / 20;
				}
			},
		},
		group: "clantanque_mark",
		init(player) {
			var history = player.getAllHistory("useCard");
			if (history.length) {
				var trigger = history[history.length - 1];
				if (typeof get.number(trigger.card, player) != "number") {
					return;
				}
				player.storage.clantanque_mark = trigger.card;
				player.markSkill("clantanque_mark");
			}
		},
		onremove(player) {
			player.unmarkSkill("clantanque_mark");
			delete player.storage.clantanque_mark;
		},
		subSkill: {
			mark: {
				charlotte: true,
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					if (typeof get.number(trigger.card, player) != "number") {
						player.unmarkSkill("clantanque_mark");
					} else {
						player.storage.clantanque_mark = trigger.card;
						player.markSkill("clantanque_mark");
					}
				},
				intro: {
					markcount(card, player) {
						return get.strNumber(get.number(card, player));
					},
					content(card, player) {
						return "上一张牌的点数：" + get.strNumber(get.number(card, player));
					},
				},
			},
		},
	},
	clanshengmo: {
		audio: 2,
		enable: "chooseToUse",
		round: 1,
		hiddenCard(player, name) {
			if (get.type(name) != "basic") {
				return false;
			}
			if (!player.getStorage("clanshengmo").includes(name) && (get.event().clanshengmo_cards || []).length > 0) {
				return true;
			}
		},
		filter(event, player) {
			if (event.responded) {
				return false;
			}
			const names = lib.inpile.filter(name => get.type(name) == "basic"),
				cards = get.event().clanshengmo_cards || [];
			return (
				cards.length > 0 &&
				cards.some(card => !player.getStorage("clanshengmo_num").includes(get.number(card, false))) &&
				names.some(name => {
					return event.filterCard({ name, isCard: true }, player, event);
				})
			);
		},
		onChooseToUse(event) {
			if (game.online) {
				return;
			}
			if (!event.clanshengmo_cards) {
				let cards = [];
				game.checkGlobalHistory("cardMove", evt => {
					if (evt.name != "cardsDiscard" && (evt.name != "lose" || evt.position != ui.discardPile)) {
						return;
					}
					cards.addArray(evt.cards.filter(card => get.position(card, true) == "d"));
				});
				event.set("clanshengmo_cards", cards);
				/*
				const numbers = cards.map(card => get.number(card, false)).unique();
				const [min, max] = [Math.min(...numbers), Math.max(...numbers)];
				event.set(
					"clanshengmo_cards",
					cards.filter(card => {
						const num = get.number(card, false);
						return num > min && num < max;
					})
				);*/
			}
		},
		async content(event, trigger, player) {
			const evt = event.getParent(2);
			const names = lib.inpile.filter(name => get.type(name) == "basic" && !player.getStorage("clanshengmo").includes(name)),
				cards = evt.clanshengmo_cards.sort((a, b) => get.number(a, false) - get.number(b, false)),
				canChoose = cards.filter(card => !player.getStorage("clanshengmo_num").includes(get.number(card, false)));
			const { links } = await player
				.chooseButton(["剩墨：获得其中一张牌", cards], true)
				.set("filterButton", button => {
					return get.event().canChoose.includes(button.link);
				})
				.set("canChoose", canChoose)
				.set("ai", button => {
					return get.value(button.link);
				})
				.forResult();
			if (!links || !links.length) {
				return;
			}
			await player.gain(links, "gain2");
			player.markAuto("clanshengmo_num", links.map(card => get.number(card, false)).toUniqued());
			const numbers = cards.map(card => get.number(card, false)).unique();
			const [min, max] = [Math.min(...numbers), Math.max(...numbers)],
				num = get.number(links[0], false);
			if (num <= min || num >= max) {
				return;
			}
			const list = [];
			for (const name of names) {
				const card = { name, isCard: true };
				if (evt.filterCard(card, player, evt)) {
					list.push(["基本", "", name]);
				}
				if (name == "sha") {
					for (const nature of lib.inpile_nature) {
						card.nature = nature;
						if (evt.filterCard(card, player, evt)) {
							list.push(["基本", "", name, nature]);
						}
					}
				}
			}
			if (!list.length) {
				return;
			}
			const { links: links2 } = await player
				.chooseButton(["视为使用一张未以此法使用过的基本牌", [list, "vcard"]], true)
				.set("ai", button => {
					return get.player().getUseValue(button.link) + 1;
				})
				.forResult();
			const name = links2[0][2],
				nature = links2[0][3];
			game.broadcastAll(
				(name, nature) => {
					lib.skill.clanshengmo_backup.viewAs = {
						name,
						nature,
						isCard: true,
					};
					lib.skill.clanshengmo_backup.prompt = `选择${get.translation(nature)}【${get.translation(name)}】的目标`;
				},
				name,
				nature
			);
			evt.set("_backupevent", "clanshengmo_backup");
			evt.backup("clanshengmo_backup");
			evt.set("openskilldialog", `选择${get.translation(nature)}【${get.translation(name)}】的目标`);
			evt.set("norestore", true);
			evt.set("custom", {
				add: {},
				replace: { window() {} },
			});
			evt.goto(0);
		},
		marktext: "墨",
		intro: {
			content: "已以此法使用过$",
		},
		subSkill: {
			backup: {
				precontent() {
					event.result.card.storage.clanshengmo = true;
					player.markAuto("clanshengmo", event.result.card.name);
				},
				filterCard: () => false,
				selectCard: -1,
				log: false,
			},
		},
		ai: {
			order: 3,
			result: {
				player(player) {
					if (get.event().dying) {
						return get.attitude(player, get.event().dying);
					}
					if (get.event().type != "phase") {
						return 1;
					}
					const names = lib.inpile.filter(name => get.type(name) == "basic" && !player.getStorage("clanshengmo").includes(name));
					if (Array.isArray(names)) {
						return names.some(name => {
							return player.getUseValue({ name }) > 0;
						});
					}
					return 0;
				},
			},
			tag: {
				recover: 1,
				save: 1,
			},
		},
	},
	//族贝斯塔[doge]
	clanlilun: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.hasCard(card => get.info("clanlilun").filterCard(card, player), "he");
		},
		filterCard(card, player) {
			if (player.getStorage("clanlilun").includes(card.name)) {
				return false;
			}
			if (ui.selected.cards.length && ui.selected.cards[0].name != card.name) {
				return false;
			}
			const cards = player.getCards("he", cardx => player.canRecast(cardx));
			return cards.includes(card) && cards.filter(i => i.name == card.name).length > 1;
		},
		selectCard: 2,
		position: "he",
		check(card) {
			const player = get.event().player;
			const value = function (card, player) {
				const num = player.getUseValue(card);
				return num > 0 ? num + 1 / (get.value(card) || 0.5) + 7 : 7 - get.value(card);
			};
			if (ui.selected.cards.length && value(card, player) < value(ui.selected.cards[0], player)) {
				return 20 - get.value(card);
			}
			return value(card, player);
		},
		complexCard: true,
		discard: false,
		lose: false,
		delay: 0,
		usable: 1,
		async content(event, trigger, player) {
			await player.recast(event.cards);
			if (!player.storage.clanlilun) {
				player.when({ global: "phaseAfter" }).step(async () => {
					player.unmarkSkill("clanlilun");
					delete player.storage.clanlilun;
				});
			}
			player.markAuto(
				"clanlilun",
				event.cards.slice().map(card => card.name)
			);
			const cards = event.cards.filterInD("d");
			if (cards.some(card => player.hasUseTarget(card))) {
				const { bool, links } = await player
					.chooseButton(["离论：是否使用其中的一张牌？", cards])
					.set("filterButton", button => {
						return get.event().player.hasUseTarget(button.link);
					})
					.set("ai", button => {
						return get.event().player.getUseValue(button.link);
					})
					.forResult();
				if (bool) {
					const card = links[0];
					player.$gain2(card, false);
					await game.delayx();
					await player.chooseUseTarget(true, card, false);
				}
			}
		},
		onremove: true,
		intro: { content: "本回合已重铸过$" },
		ai: {
			order(item, player) {
				let cards = player.getCards("h", card => get.info("clanlilun").filterCard(card, player) && player.getUseValue(card) > 0);
				cards = cards.filter(card => cards.filter(i => i.name == card.name).length > 1);
				if (!cards.length) {
					return 1;
				}
				cards.sort((a, b) => get.order(b) - get.order(a));
				return get.order(cards[0]) - 0.001;
			},
			result: { player: 1 },
		},
	},
	clanjianji: {
		getBool(event, player) {
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			const targets = game.filterPlayer(target => {
				return event.player.getPrevious() == target || event.player.getNext() == target;
			});
			const bool = !targets.some(target => {
				return target.getHistory("useCard").length;
			});
			const goon =
				player.hasUseTarget(card) &&
				!game.getGlobalHistory("useCard", evt => {
					return evt.targets?.some(target => targets.includes(target));
				}).length;
			return [bool, goon];
		},
		limited: true,
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			if (!event.player.isIn()) {
				return false;
			}
			const targets = game.filterPlayer(target => {
				return event.player.getPrevious() == target || event.player.getNext() == target;
			});
			if (!targets.length) {
				return false;
			}
			const [bool, goon] = get.info("clanjianji").getBool(event, player);
			return bool || goon;
		},
		skillAnimation: true,
		animationColor: "watar",
		prompt2(event, player) {
			let str = "";
			const [bool, goon] = get.info("clanjianji").getBool(event, player);
			if (bool) {
				if (goon) {
					str += "你可以";
				}
				str += "与" + get.translation(get.translation(event.player)) + "各摸一张牌";
			}
			if (goon) {
				if (bool) {
					str += "，然后你可以";
				}
				str += "视为使用一张【杀】";
			}
			return str;
		},
		check(event, player) {
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			const [bool, goon] = get.info("clanjianji").getBool(event, player);
			return (bool && (get.attitude(player, event.player) > 0 || event.player.countCards("h") > player.countCards("h"))) || (goon && player.hasValueTarget(card));
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			const [boolx, goon] = get.info(event.name).getBool(trigger, player);
			if (boolx) {
				let draw = false;
				if (goon) {
					const result = await player
						.chooseBool("是否与" + get.translation(trigger.player) + "各摸一张牌？")
						.set("choice", get.attitude(player, trigger.player) > 0 || trigger.player.countCards("h") > player.countCards("h"))
						.forResult();
					if (result?.bool) {
						draw = true;
					}
				} else {
					draw = true;
				}
				if (draw) {
					await player.draw("nodelay");
					await trigger.player.draw();
				}
			}
			if (goon) {
				await player.chooseUseTarget(card, false, !boolx);
			}
		},
	},
	//族吴乔
	clanqiajue: {
		audio: 2,
		trigger: { player: "phaseDrawBegin" },
		filter(event, player) {
			return (
				player.countCards("he", card => {
					if (_status.connectMode && get.position(card) == "h") {
						return true;
					}
					return get.color(card, player) == "black" && lib.filter.cardDiscardable(card, player);
				}) > 0
			);
		},
		direct: true,
		async content(event, trigger, player) {
			const { bool } = await player
				.chooseToDiscard((card, player) => {
					return get.color(card, player) == "black" && lib.filter.cardDiscardable(card, player);
				}, "he")
				.set("prompt", "当前手牌点数和为" + player.getCards("h").reduce((sum, card) => sum + get.number(card), 0) + "，" + get.prompt("clanqiajue"))
				.set("prompt2", lib.translate.clanqiajue_info.slice(lib.translate.clanqiajue_info.indexOf("弃置")).slice(0, -1))
				.set("ai", card => {
					const player = get.event().player,
						goon = get.position(card) == "h";
					let num = player.getCards("h").reduce((sum, card) => sum + get.number(card), 0);
					if (num - (goon ? get.number(card) : 0) > 30) {
						return 0;
					}
					return goon ? get.number(card) : 1 / (get.value(card) || 0.5);
				})
				.set("logSkill", "clanqiajue")
				.forResult();
			if (bool) {
				player
					.when({
						player: ["phaseDrawEnd", "phaseDrawCancelled", "phaseUseSkipped"],
					})
					.filter(evt => evt == trigger)
					.step(async (event, trigger, player) => {
						const cards = player.getCards("h"),
							num = cards.reduce((sum, card) => sum + get.number(card), 0);
						if (cards.length) {
							player.showCards(cards, get.translation(player) + "【跒倔】展示");
						}
						if (num > 30) {
							player.popup("杯具");
							lib.skill.chenliuwushi.change(player, -2);
						} else {
							player.popup("洗具");
							const evt = trigger.getParent("phase", true, true);
							if (evt?.phaseList) {
								evt.phaseList.splice(evt.num + 1, 0, "phaseDraw|clanqiajue");
							}
						}
					});
			}
		},
	},
	//族荀攸
	clanbaichu: {
		derivation: "qice",
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			const storage = player.storage.clanbaichu || {};
			if (Object.values(storage).includes(event.card.name)) {
				return true;
			}
			const suit = get.suit(event.card);
			if (suit == "none") {
				return false;
			}
			if (!player.hasSkill("qice")) {
				return true;
			}
			const key = `${suit}+${get.type2(event.card)}`;
			return !(key in storage);
		},
		forced: true,
		async content(event, trigger, player) {
			const storage = player.storage.clanbaichu || {},
				suit = get.suit(trigger.card);
			if (suit != "none") {
				const key = `${suit}+${get.type2(trigger.card)}`;
				if (key in storage) {
					if (!player.hasSkill("qice", null, false, false)) {
						await player.addTempSkills("qice", "roundStart");
					}
				} else {
					const list = lib.inpile.filter(name => get.type(name) == "trick");
					list.removeArray(Object.values(storage));
					if (list.length) {
						const dialog = ["百出：选择记录一种普通锦囊牌", [list, "vcard"]];
						const result = await player
							.chooseButton(dialog, true)
							.set("ai", function (button) {
								const player = get.player(),
									name = button.link[2];
								if (name == get.event().getTrigger().card.name) {
									return 1919810;
								}
								if (name == "wuxie") {
									return 114514;
								}
								return get.effect(player, { name: name }, player, player) * (1 + player.countCards("hs", name));
							})
							.forResult();
						if (result?.bool && result?.links?.length) {
							const key = `${get.suit(trigger.card)}+${get.type2(trigger.card)}`,
								name = result.links[0][2];
							player.storage.clanbaichu ??= {};
							player.storage.clanbaichu[key] = name;
							player.markSkill("clanbaichu");
							game.log(player, "记录了", "#y" + get.translation(name));
							await event.trigger("clanbaichu");
							await game.delayx();
						}
					}
				}
			}
			if (Object.values(player.getStorage("clanbaichu")).includes(trigger.card.name)) {
				await player.chooseDrawRecover(true);
			}
		},
		mark: true,
		intro: {
			markcount(storage = {}) {
				if (!storage) {
					return 0;
				}
				return Object.keys(storage).length;
			},
			mark(dialog, storage = {}) {
				if (!storage) {
					return "当前暂无记录";
				}
				const addNewRow = lib.element.dialog.addNewRow.bind(dialog);
				dialog.css({ width: "50%" });
				if (get.is.phoneLayout()) {
					dialog.classList.add("fullheight");
				}
				let types = ["basic", "trick", "equip"].concat(Object.keys(storage).map(list => list.split("+")[1])).toUniqued();
				let suits = lib.suit
					.slice()
					.reverse()
					.concat(Object.keys(storage).map(list => list.split("+")[0]))
					.toUniqued();
				addNewRow(
					...["花色"].concat(types.map(i => get.translation(i))).map(type => {
						return { item: type, ratio: type == "花色" ? 1 : 2 };
					})
				);
				for (const suit of suits) {
					let list = [{ item: get.translation(suit), ratio: 1 }];
					for (const type of types) {
						list.add({
							item: ((suit, type, storage) => {
								if (storage[suit + "+" + type]) {
									return get.translation(storage[suit + "+" + type]);
								}
								return null;
							})(suit, type, storage),
							ratio: 2,
						});
					}
					addNewRow(...list);
				}
			},
		},
		init(player, skill) {
			player.addSkill(skill + "_count");
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_count");
		},
		subSkill: {
			count: {
				charlotte: true,
				init(player) {
					const storage = player.storage.clanbaichu || {};
					//移除已经记录的新组合标记
					const cards_old = player.getCards("h", card => {
						const suit = get.suit(card, false);
						return (suit === "none" || `${suit}+${get.type2(card, false)}` in storage) && card.hasGaintag("clanbaichu_new");
					});
					if (cards_old.length) {
						player.removeGaintag("clanbaichu_new", cards_old);
					}
					//添加未曾记录的新组合标记
					const cards_new = player.getCards("h", card => {
						const suit = get.suit(card, false);
						return suit !== "none" && !(`${suit}+${get.type2(card, false)}` in storage) && !card.hasGaintag("clanbaichu_new");
					});
					if (cards_new.length) {
						player.addGaintag(cards_new, "clanbaichu_new");
					}
					//添加记录锦囊的已记录标记
					const cards_trick = player.getCards("h", card => Object.values(storage).includes(get.name(card, false)) && !card.hasGaintag("clanbaichu_trick"));
					if (cards_trick.length) {
						player.addGaintag(cards_trick, "clanbaichu_trick");
					}
				},
				onremove(player) {
					player.removeGaintag("clanbaichu_new");
					player.removeGaintag("clanbaichu_trick");
				},
				trigger: {
					player: ["gainEnd", "clanbaichu", "enterGame"],
					global: ["loseAsyncEnd", "gameDrawEnd", "phaseBefore"],
				},
				filter(event, player) {
					if (["gain", "loseAsync"].includes(event.name) && !event.getg?.(player)?.length) {
						return false;
					}
					const storage = player.storage.clanbaichu || {};
					return player.hasCard(card => {
						const suit = get.suit(card, false);
						const old = (suit === "none" || `${suit}+${get.type2(card, false)}` in storage) && card.hasGaintag("clanbaichu_new");
						const newx = suit !== "none" && !(`${suit}+${get.type2(card, false)}` in storage) && !card.hasGaintag("clanbaichu_new");
						const load = Object.values(storage).includes(get.name(card, false)) && !card.hasGaintag("clanbaichu_trick");
						return old || newx || load;
					}, "h");
				},
				silent: true,
				firstDo: true,
				content() {
					get.info(event.name).init(player);
				},
			},
			new: {},
			trick: {},
		},
	},
	//族王沦
	clanqiuxin: {
		audio: 2,
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		usable: 1,
		content() {
			"step 0";
			var str = get.translation(player);
			target
				.chooseControl()
				.set("choiceList", [str + "下次对你使用【杀】后，其视为对你使用任意普通锦囊牌", str + "下次对你使用任意普通锦囊牌后，其视为对你使用【杀】"])
				.set("ai", function () {
					var target = _status.event.player;
					var player = _status.event.target;
					var num1 = get.effect(target, get.autoViewAs({ name: "sha" }, []), player, player);
					if (!player.canUse(get.autoViewAs({ name: "sha" }, []), target)) {
						num1 = 0;
					}
					var num2 = 0;
					for (var name of lib.inpile) {
						if (get.type(name) != "trick") {
							continue;
						}
						if (!player.canUse(get.autoViewAs({ name: name }, []), target)) {
							continue;
						}
						if (num2 < get.effect(target, get.autoViewAs({ name: name }, []), player, player)) {
							num2 = get.effect(target, get.autoViewAs({ name: name }, []), player, player);
						}
					}
					return num1 >= num2 ? 1 : 0;
				})
				.set("target", player);
			"step 1";
			player.addSkill("clanqiuxin_effect");
			player.markAuto("clanqiuxin_effect", [[target, result.index]]);
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					var cards = player.getCards("hs", card => {
						if (get.name(card, player) != "sha" && get.type(card, null, player) != "trick") {
							return false;
						}
						return player.hasValueTarget(card);
					});
					if (cards.some(card => player.canUse(card, target) && get.effect(target, card, player, player) > 0)) {
						var att = get.attitude(player, target);
						if (att > 0) {
							return 9;
						}
						if (att < 0) {
							return -6;
						}
						return 0;
					} else {
						var att = get.attitude(player, target);
						if (att < 0) {
							return -3;
						}
						if (att > 0) {
							return 1;
						}
						return 2;
					}
				},
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content(storage, player) {
						var infos = [];
						for (var i = 0; i < storage.length; i++) {
							var list = storage[i];
							var strx = ["【杀】", "任意普通锦囊牌"];
							if (list[1]) {
								strx.reverse();
							}
							infos.add("对" + get.translation(list[0]) + "使用" + strx[0] + "后，视为对其使用" + strx[1]);
						}
						return infos.join("<br>");
					},
				},
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					if (!event.targets || !event.targets.length) {
						return false;
					}
					if (event.card.name == "sha") {
						return event.targets.some(target => {
							return player.getStorage("clanqiuxin_effect").some(list => list[0] == target && list[1] == 0);
						});
					}
					if (get.type(event.card) == "trick") {
						return event.targets.some(target => {
							return player.getStorage("clanqiuxin_effect").some(list => list[0] == target && list[1] == 1);
						});
					}
					return false;
				},
				forced: true,
				popup: false,
				content() {
					"step 0";
					var list;
					if (trigger.card.name == "sha") {
						list = player.getStorage("clanqiuxin_effect").filter(listx => trigger.targets.includes(listx[0]) && listx[1] == 0);
					}
					if (get.type(trigger.card) == "trick") {
						list = player.getStorage("clanqiuxin_effect").filter(listx => trigger.targets.includes(listx[0]) && listx[1] == 1);
					}
					player.unmarkAuto("clanqiuxin_effect", list);
					var targets = list.map(listx => listx[0]);
					event.targets = targets;
					"step 1";
					var target = event.targets.shift();
					event.target = target;
					var list = [];
					const nameFilter = trigger.card.name == "sha" ? name => get.type(name) == "trick" : name => name == "sha";
					for (var name of lib.inpile) {
						if (name != "sha" && get.type(name) != "trick") {
							continue;
						}
						if (!nameFilter(name)) {
							continue;
						}
						if (!player.canUse(get.autoViewAs({ name: name }, []), target)) {
							continue;
						}
						list.push([get.translation(get.type(name)), "", name]);
					}
					if (!list.length) {
						event.goto(3);
					} else {
						player
							.chooseButton(["求心：视为对" + get.translation(target) + "使用一张牌", [list, "vcard"]], true)
							.set("ai", function (button) {
								var player = _status.event.player;
								var target = _status.event.target;
								return get.effect(
									target,
									{
										name: button.link[2],
										nature: button.link[3],
									},
									player,
									player
								);
							})
							.set("target", target);
					}
					"step 2";
					if (result.bool) {
						var card = {
							name: result.links[0][2],
							nature: result.links[0][3],
						};
						player.useCard(card, target, false);
					}
					"step 3";
					if (event.targets.length) {
						event.goto(1);
					} else if (!player.getStorage("clanqiuxin_effect").length) {
						player.removeSkill("clanqiuxin_effect");
					}
				},
			},
		},
	},
	clanjianyuan: {
		inherit: "clanchenya",
		filter(event, player) {
			if (event.type != "player") {
				return false;
			}
			var skill = get.sourceSkillFor(event);
			var info = get.info(skill);
			if (info.charlotte) {
				return false;
			}
			var translation = get.skillInfoTranslation(skill, event.player);
			if (!translation) {
				return false;
			}
			var match = get.plainText(translation).match(/“?出牌阶段限一次/g);
			if (!match || match.every(value => value != "出牌阶段限一次") || !event.player.countCards("he")) {
				return false;
			}
			for (var phase of lib.phaseName) {
				var evt = event.getParent(phase);
				if (evt && evt.name == phase) {
					if (event.player.getHistory("useCard", evtx => evtx.getParent(phase) == evt).length) {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			"step 0";
			var num = 0;
			for (var phase of lib.phaseName) {
				var evt = trigger.getParent(phase);
				if (evt && evt.name == phase) {
					num += trigger.player.getHistory("useCard", evtx => evtx.getParent(phase) == evt).length;
				}
			}
			trigger.player
				.chooseCard("是否重铸任意张牌名字数为" + num + "的牌？", [1, Infinity], "he", (card, player) => _status.event.cards.includes(card) && player.canRecast(card), "allowChooseAll")
				.set("ai", card => {
					var val = get.value(card);
					return 6 - val;
				})
				.set(
					"cards",
					trigger.player.getCards("he", card => {
						return get.cardNameLength(card) == num;
					})
				);
			"step 1";
			if (result.bool) {
				trigger.player.recast(result.cards);
			}
		},
	},
	//族钟毓
	clanjiejian: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget || get.type(event.card) == "equip") {
				return false;
			}
			return get.cardNameLength(event.card) == player.getHistory("useCard").indexOf(event.getParent()) + 1;
		},
		direct: true,
		locked: false,
		content() {
			"step 0";
			var num = get.cardNameLength(trigger.card);
			event.num = num;
			player
				.chooseTarget(get.prompt("clanjiejian"), "令一名目标角色摸" + get.cnNumber(num) + "张牌", function (card, player, target) {
					return _status.event.getTrigger().targets.includes(target);
				})
				.set("ai", target => get.attitude(_status.event.player, target));
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("clanjiejian", target);
				target.draw(num);
			}
		},
		ai: {
			threaten: 3,
			effect: {
				player_use(card, player, target) {
					if (!target || typeof card !== "object" || player._clanjiejian_mod_temp || get.type(card) === "equip" || get.attitude(player, target) <= 0 || get.cardNameLength(card) !== player.getHistory("useCard").length + 1) {
						return;
					}
					let targets = [target],
						evt = _status.event.getParent("useCard");
					targets.addArray(ui.selected.targets);
					if (evt && evt.card == card) {
						targets.addArray(evt.targets);
					}
					return [1, (0.8 * get.cardNameLength(card)) / targets.length];
				},
			},
		},
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object" && get.type(card) !== "equip") {
					let cs = get.cardNameLength(card) - player.getHistory("useCard").length - 1;
					if (cs < 0) {
						return num;
					}
					if (cs > 0) {
						return num / 3;
					}
					player._clanjiejian_mod_temp = true;
					let bool = game.hasPlayer(target => {
						if (get.attitude(player, target) <= 0 || !player.canUse(card, target, null, true)) {
							return false;
						}
						return get.effect(target, card, player, player) + get.effect(target, { name: "draw" }, player, player) > 0;
					});
					delete player._clanjiejian_mod_temp;
					if (bool) {
						return num + 15;
					}
				}
			},
		},
	},
	clanhuanghan: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (!event.card) {
				return false;
			}
			var num = get.cardNameLength(event.card);
			return typeof num == "number" && num > 0;
		},
		check(event, player) {
			let num = get.cardNameLength(event.card) - player.getDamagedHp();
			if (num >= 0) {
				return true;
			}
			if (num < -1) {
				return false;
			}
			if (
				player.hasSkill("clanbaozu", null, false, false) &&
				player.awakenedSkills.includes("clanbaozu") &&
				player.getHistory("useSkill", evt => {
					return evt.skill == "clanhuanghan";
				}).length
			) {
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			player.addTempSkill("clanhuanghan_used");
			player.addMark("clanhuanghan_used");
			const num = player.countMark("clanhuanghan_used");
			await player.draw(get.cardNameLength(trigger.card));
			if (player.isDamaged()) {
				await player.chooseToDiscard(player.getDamagedHp(), "he", true);
			}
			if (num > 1 && player.hasSkill("clanbaozu", null, false, false) && player.awakenedSkills.includes("clanbaozu")) {
				player.restoreSkill("clanbaozu");
				player.popup("保族");
				game.log(player, "恢复了技能", "#g【保族】");
			}
		},
		ai: {
			threaten: 3,
			effect: {
				target(card, player, target) {
					if (!lib.translate[card.name] || !get.tag(card, "damage") || player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					let num = get.cardNameLength(card) - target.getDamagedHp();
					if (num > 0) {
						return [1, 0.8 * num + 0.1];
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
	//族钟会
	clanyuzhi: {
		mod: {
			aiOrder(player, card, num) {
				if (card.name == "tao") {
					return num / 114514;
				}
			},
		},
		audio: 6,
		trigger: { global: ["roundStart", "roundEnd"] },
		filter(event, player, name) {
			if (name === "roundStart") {
				return player.countCards("h");
			}
			if (player.hasCard(card => card.hasGaintag("clanyuzhi") && lib.filter.cardDiscardable(card, player), "h")) {
				return true;
			}
			const num1 = player.getRoundHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent(2).name == "clanyuzhi").reduce((sum, evt) => sum + evt.cards.length, 0);
			const num2 = player.getRoundHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent(2).name == "clanyuzhi", 1).reduce((sum, evt) => sum + evt.cards.length, 0);
			const num3 = player.getRoundHistory("useCard").length;
			return (num1 > 0 && num2 > 0 && num1 > num2) || num1 > num3;
		},
		forced: true,
		async content(event, trigger, player) {
			const name = event.triggername;
			const num1 = player.getRoundHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent(2).name == "clanyuzhi", name === "roundStart" ? 1 : 0).reduce((sum, evt) => sum + evt.cards.length, 0);
			switch (name) {
				case "roundStart": {
					const result = await player
						.chooseCard(
							"迂志：请展示一张手牌",
							"摸此牌牌名字数的牌。本轮结束时弃置此牌，若本轮你使用的牌数或上一轮你以此法摸的牌数小于此牌牌名字数，则你受到1点雷属性伤害或失去〖保族〗。",
							(card, player) => {
								const num = get.cardNameLength(card);
								return typeof num == "number" && num > 0;
							},
							true
						)
						.set("ai", card => {
							const { dying, num } = get.event();
							if (dying && num > 0 && get.cardNameLength(card) > num) {
								return 1 / get.cardNameLength(card); //怂
							}
							return get.cardNameLength(card); //勇
						})
						.set(
							"dying",
							player.hp +
								player.countCards("hs", {
									name: ["tao", "jiu"],
								}) <
								1
						)
						.set("num", num1)
						.forResult();
					if (result?.bool && result.cards?.length) {
						await player.showCards(result.cards, get.translation(player) + "发动了【迂志】");
						player.addGaintag(result.cards, "clanyuzhi");
						await player.draw(get.cardNameLength(result.cards[0]));
						player.storage.clanyuzhi_mark = get.cardNameLength(result.cards[0]);
						player.addTempSkill("clanyuzhi_mark", "roundStart");
					}
					break;
				}
				case "roundEnd": {
					const cards = player.getCards("h", card => card.hasGaintag("clanyuzhi") && lib.filter.cardDiscardable(card, player));
					if (cards.length) {
						await player.discard(cards);
					}
					const num2 = player.getRoundHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent(2).name == "clanyuzhi", 1).reduce((sum, evt) => sum + evt.cards.length, 0);
					const num3 = player.getRoundHistory("useCard").length;
					if ((num1 > 0 && num2 > 0 && num1 > num2) || num1 > num3) {
						let result;
						if (num2 > 0 && num1 > num2) {
							game.log(player, "的野心已开始膨胀", "#y(" + num1 + "张>" + num2 + "张)");
						}
						if (num1 > num3) {
							game.log(player, "的行动未达到野心", "#y(" + num3 + "张<" + num1 + "张)");
						}
						if (player.hasSkill("clanbaozu", null, false, false)) {
							result = await player.chooseBool("迂志：是否失去〖保族〗？", "若选择“否”，则你受到1点雷属性伤害").set("choice", player.awakenedSkills.includes("clanbaozu")).forResult();
						} else {
							result = { bool: false };
						}
						if (result?.bool) {
							await player.removeSkills("clanbaozu");
						} else {
							await player.damage(1, "thunder");
						}
					}
				}
			}
		},
		ai: {
			threaten: 3,
			nokeep: true,
		},
		onremove(player, skill) {
			player.removeGaintag(skill);
			player.removeSkill(skill + "_mark");
		},
		subSkill: {
			mark: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: { content: "本轮野心：#张" },
			},
		},
	},
	clanxieshu: {
		audio: 6,
		trigger: { player: "damageEnd", source: "damageSource" },
		filter(event, player) {
			if (!event.card || player.isLinked()) {
				return false;
			}
			var num = get.cardNameLength(event.card);
			return typeof num == "number" && num > 0 && player.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			var num = get.cardNameLength(trigger.card),
				str = "";
			if (player.getDamagedHp() > 0) {
				str += "，然后摸" + get.cnNumber(player.getDamagedHp()) + "张牌";
			}
			event.result = await player
				.chooseToDiscard(get.prompt(event.skill), "横置武将牌并弃置" + get.cnNumber(num) + "张牌" + str, "he", num, "chooseonly")
				.set("ai", function (card) {
					var player = _status.event.player;
					var num = _status.event.num;
					var num2 = player.getDamagedHp();
					if (!num2) {
						return 0;
					}
					if (num < num2) {
						return 8 - get.value(card);
					}
					if (num == num2 || num2 >= 2 + num - num2) {
						return lib.skill.zhiheng.check(card);
					}
					return 0;
				})
				.set("num", num)
				//.set("logSkill", "clanxieshu")
				.forResult();
		},
		//popup: false,
		async content(event, trigger, player) {
			await player.discard(event.cards);
			await player.link(true);
			if (player.getDamagedHp() > 0) {
				await player.draw(player.getDamagedHp());
			}
			if (
				game.getGlobalHistory("everything", evt => {
					return evt.name == "dying";
				}).length
			) {
				player.tempBanSkill("clanxieshu");
			}
		},
		ai: { threaten: 3 },
	},
	//族王浑
	clanfuxun: {
		mod: {
			aiOrder(player, card, num) {
				if (player.isPhaseUsing() && get.type(card) == "equip" && get.equipValue(card, player) > 0) {
					return num + 3;
				}
			},
			cardUsable(card) {
				if (card.storage?.clanfuxun) {
					return Infinity;
				}
			},
		},
		locked: false,
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "h",
		discard: false,
		lose: false,
		delay: false,
		selectCard() {
			var player = _status.event.player;
			if (ui.selected.targets.length && !ui.selected.targets[0].countGainableCards(player, "h")) {
				return 1;
			}
			return [0, 1];
		},
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			if (!ui.selected.cards.length) {
				return target.countGainableCards(player, "h") > 0;
			}
			return true;
		},
		check(card) {
			var player = _status.event.player;
			var evtx = _status.event.getParent("phaseUse");
			var targets = game.filterPlayer(target => target != player && lib.skill.clanfuxun.ai.result.target(player, target) != 0);
			targets.sort((a, b) => Math.abs(lib.skill.clanfuxun.ai.result.target(player, b)) - Math.abs(lib.skill.clanfuxun.ai.result.target(player, a)));
			if (evtx && targets.length) {
				var target = targets[0];
				if (
					!target.hasHistory("lose", evt => {
						return evt.getParent(3).name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards2.length;
					}) &&
					!target.hasHistory("gain", evt => {
						return evt.getParent().name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards.length;
					}) &&
					Math.abs(player.countCards("h") - target.countCards("h")) == 2
				) {
					if (player.countCards("h") > target.countCards("h")) {
						return 1 / (get.value(card) || 0.5);
					}
					return -1;
				}
				if (card.name == "du") {
					return 20;
				}
				return -1;
			}
			if (card.name == "du") {
				return 20;
			}
			return -1;
		},
		content() {
			"step 0";
			if (cards.length) {
				player.give(cards, target);
			} else {
				player.gainPlayerCard(target, "h", true);
			}
			"step 1";
			var evtx = event.getParent("phaseUse");
			if (
				player.countCards("h") == target.countCards("h") &&
				evtx &&
				!target.hasHistory("lose", evt => {
					return evt.getParent(3).name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards2.length;
				}) &&
				!target.hasHistory("gain", evt => {
					return evt.getParent().name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards.length;
				}) &&
				player.countCards("he")
			) {
				var list = [];
				for (var name of lib.inpile) {
					if (get.type(name) != "basic") {
						continue;
					}
					if (player.hasUseTarget({ name: name })) {
						list.push(["基本", "", name]);
					}
					if (name == "sha") {
						for (var nature of lib.inpile_nature) {
							if (
								player.hasUseTarget({
									name: name,
									nature: nature,
								})
							) {
								list.push(["基本", "", name, nature]);
							}
						}
					}
				}
				if (list.length) {
					player.chooseButton(["是否将一张牌当做一种基本牌使用？", [list, "vcard"]]).set("ai", button => {
						return _status.event.player.getUseValue({
							name: button.link[2],
							nature: button.link[3],
						});
					});
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var card = {
					name: result.links[0][2],
					nature: result.links[0][3],
					storage: { clanfuxun: true },
				};
				game.broadcastAll(function (card) {
					lib.skill.clanfuxun_backup.viewAs = card;
				}, card);
				var next = player.chooseToUse();
				next.set("openskilldialog", "将一张牌当做" + get.translation(card) + "使用");
				next.set("norestore", true);
				next.set("addCount", false);
				next.set("_backupevent", "clanfuxun_backup");
				next.set("custom", {
					add: {},
					replace: { window() {} },
				});
				next.backup("clanfuxun_backup");
			}
		},
		ai: {
			order(item, player) {
				var evtx = _status.event.getParent("phaseUse");
				if (
					game.hasPlayer(current => {
						if (current == player || !evtx || get.attitude(player, current) == 0) {
							return false;
						}
						return (
							!current.hasHistory("lose", evt => {
								return evt.getParent(3).name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards2.length;
							}) &&
							!current.hasHistory("gain", evt => {
								return evt.getParent().name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards.length;
							}) &&
							Math.abs(player.countCards("h") - current.countCards("h")) == 2
						);
					})
				) {
					return 10;
				}
				return 2;
			},
			result: {
				target(player, target) {
					var evtx = _status.event.getParent("phaseUse");
					var num = get.sgn(get.attitude(player, target));
					var targets = game.filterPlayer(current => {
						if (current == player || !evtx || get.attitude(player, current) == 0) {
							return false;
						}
						return (
							!current.hasHistory("lose", evt => {
								return evt.getParent(3).name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards2.length;
							}) &&
							!current.hasHistory("gain", evt => {
								return evt.getParent().name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards.length;
							}) &&
							Math.abs(player.countCards("h") - current.countCards("h")) == 2
						);
					});
					if (targets.includes(target)) {
						if (player.countCards("h") < target.countCards("h")) {
							return get.sgn(num + 0.5) * Math.sqrt(2 - num);
						} else {
							return num * (2 + num);
						}
					}
					return get.sgn(num + 0.5) * (1 - num) * 0.25;
				},
			},
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				position: "hes",
				filterTarget: lib.filter.filterTarget,
				selectCard: 1,
				check(card) {
					var player = _status.event.player;
					if (player.hasSkill("clanzhongliu") && get.position(card) != "h") {
						return 10 - get.value(card);
					}
					return 5 - get.value(card);
				},
				log: false,
			},
		},
	},
	clanchenya: {
		audio: 2,
		trigger: {
			global: ["useSkillAfter", "logSkill"],
		},
		filter(event, player) {
			if (event.type != "player") {
				return false;
			}
			var skill = get.sourceSkillFor(event);
			var info = get.info(skill);
			if (info.charlotte) {
				return false;
			}
			var translation = get.skillInfoTranslation(skill, event.player);
			if (!translation) {
				return false;
			}
			var match = get.plainText(translation).match(/“?出牌阶段限一次/g);
			if (!match || match.every(value => value != "出牌阶段限一次")) {
				return false;
			}
			return event.player.countCards("h") > 0;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		content() {
			"step 0";
			var num = trigger.player.countCards("h");
			trigger.player
				.chooseCard("是否重铸任意张牌名字数为" + num + "的牌？", [1, Infinity], "he", (card, player) => _status.event.cards.includes(card) && player.canRecast(card), "allowChooseAll")
				.set("ai", card => {
					var val = get.value(card);
					return 6 - val;
				})
				.set(
					"cards",
					trigger.player.getCards("he", card => {
						return get.cardNameLength(card) == num;
					})
				);
			"step 1";
			if (result.bool) {
				trigger.player.recast(result.cards);
			}
		},
	},
	//族王允
	clanjiexuan: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		zhuanhuanji: "number",
		mark: true,
		marktext: "☯",
		intro: {
			markcount: () => 0,
			content(storage) {
				return "限定技，转换技。你可以将一张" + ((storage || 0) % 2 ? "黑色牌当【过河拆桥】" : "红色牌当【顺手牵羊】") + "使用。";
			},
		},
		viewAs(cards, player) {
			var storage = player.storage.clanjiexuan;
			var name = (storage || 0) % 2 ? "guohe" : "shunshou";
			return { name: name };
		},
		check(card) {
			var player = _status.event.player;
			var storage = player.storage.clanjiexuan;
			var name = (storage || 0) % 2 ? "guohe" : "shunshou";
			var fix = player.hasSkill("clanzhongliu") && get.position(card) != "h" ? 2 : 1;
			return (get.value({ name: name }, player) - get.value(card)) * fix;
		},
		position: "hes",
		filterCard(card, player) {
			var storage = player.storage.clanjiexuan;
			return get.color(card) == ((storage || 0) % 2 ? "black" : "red");
		},
		prompt() {
			var storage = _status.event.player.storage.clanjiexuan;
			if ((storage || 0) % 2) {
				return "将一张黑色牌当【过河拆桥】使用";
			}
			return "将一张红色牌当【顺手牵羊】使用";
		},
		skillAnimation: true,
		animationColor: "thunder",
		log: false,
		precontent() {
			var skill = "clanjiexuan";
			player.logSkill(skill);
			player.changeZhuanhuanji(skill);
			player.awakenSkill(skill, true);
		},
		ai: {
			order(item, player) {
				player = player || _status.event.player;
				var storage = _status.event.player.storage.clanjiexuan;
				var name = (storage || 0) % 2 ? "guohe" : "shunshou";
				return get.order({ name: name }) + 0.1;
			},
		},
	},
	clanmingjie: {
		init(player) {
			player.addSkill("clanmingjie_record");
		},
		initSkill(skill) {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					charlotte: true,
					onremove: true,
					mark: true,
					marktext: "戒",
					intro: {
						markcount: () => 0,
						content: storage => "已被" + get.translation(storage[1]) + "指定为【铭戒】目标",
					},
					group: "clanmingjie_clear",
				};
				lib.translate[skill] = "铭戒";
				lib.translate[skill + "_bg"] = "戒";
			}
		},
		onremove(player) {
			player.removeSkill("clanmingjie_record");
		},
		audio: 2,
		enable: "phaseUse",
		limited: true,
		filterTarget(card, player, target) {
			return !Object.keys(target.storage).some(skill => {
				return skill.startsWith("clanmingjiex_" + player.playerid + "_") && target.storage[skill][0] === 1 + (_status.currentPhase === target);
			});
		},
		skillAnimation: true,
		animationColor: "thunder",
		content() {
			player.awakenSkill(event.name);
			player.addSkill("clanmingjie_effect");
			let skill;
			do {
				skill = "clanmingjiex_" + player.playerid + "_" + Math.random().toString(36).slice(-8);
			} while (lib.skill[skill] != null);
			game.broadcastAll(lib.skill.clanmingjie.initSkill, skill);
			target.addSkill(skill);
			target.storage[skill] = [_status.currentPhase === target ? 2 : 1, player];
			target.markSkill(skill);
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (player.hasSkill("clanzhongliu") || player.hp == 1) {
						if (
							!player.hasCard(card => {
								var info = get.info(card);
								if (info.allowMultiple == false) {
									return false;
								}
								if (!lib.filter.targetEnabled2(card, player, target)) {
									return false;
								}
								return game.hasPlayer(current => {
									return player.canUse(card, current) && get.effect(current, card, player, player) > 0 && current != target && get.effect(target, card, player, player) > 0;
								});
							}, "hs")
						) {
							return 0;
						}
					} else {
						if (
							player.countCards("hs", card => {
								var info = get.info(card);
								if (info.allowMultiple == false) {
									return false;
								}
								if (!lib.filter.targetEnabled2(card, player, target)) {
									return false;
								}
								return game.hasPlayer(current => {
									return player.canUse(card, current) && get.effect(current, card, player, player) > 0 && current != target && get.effect(target, card, player, player) > 0;
								});
							}) < 3
						) {
							return 0;
						}
					}
					return get.sgnAttitude(player, target);
				},
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				audio: "clanmingjie",
				trigger: { player: "useCard2" },
				filter(event, player) {
					const { card } = event;
					const info = get.info(card);
					if (info.allowMultiple == false) {
						return false;
					}
					if (event.targets && !info.multitarget) {
						return game.filterPlayer().some(current => {
							if (!Object.keys(current.storage).some(skill => skill.startsWith("clanmingjiex_" + player.playerid + "_"))) {
								return false;
							}
							return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && lib.filter.targetInRange(card, player, current);
						});
					}
					return false;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(
							get.prompt(event.skill),
							"令任意【铭戒】目标角色成为" + get.translation(trigger.card) + "的目标",
							(card, player, target) => {
								const trigger = get.event().getTrigger();
								if (trigger.targets.includes(target) || !Object.keys(target.storage).some(skill => skill.startsWith("clanmingjiex_" + player.playerid + "_"))) {
									return false;
								}
								return lib.filter.targetEnabled2(trigger.card, player, target) && lib.filter.targetInRange(trigger.card, player, target);
							},
							[1, Infinity]
						)
						.set("ai", target => {
							const player = get.player();
							const trigger = get.event().getTrigger();
							return get.effect(target, trigger.card, player, player);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const targets = event.targets.sortBySeat();
					trigger.targets.addArray(targets);
					game.log(targets, "成为了", trigger.card, "的额外目标");
				},
				group: "clanmingjie_targeted",
			},
			clear: {
				charlotte: true,
				trigger: { player: "phaseAfter" },
				filter(event, player) {
					return Object.keys(player.storage).some(i => i.startsWith("clanmingjiex_"));
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					const storages = Object.keys(player.storage).filter(i => i.startsWith("clanmingjiex_"));
					for (const skill of storages) {
						player.storage[skill][0]--;
						if (!player.storage[skill][0]) {
							player.removeSkill(skill);
						}
					}
				},
			},
			targeted: {
				charlotte: true,
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					if (
						!Object.keys(event.player.storage).some(skill => {
							return skill.startsWith("clanmingjiex_" + player.playerid + "_") && event.player.storage[skill][0] == 1;
						})
					) {
						return false;
					}
					return player.getStorage("clanmingjie_record").someInD("d");
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					let cards = player.getStorage("clanmingjie_record").slice().filterInD("d");
					while (cards.some(card => get.position(card, true) == "d" && player.hasUseTarget(card))) {
						const result = await player
							.chooseButton(["铭戒：是否使用这些牌？", cards])
							.set("filterButton", button => {
								return get.player().hasUseTarget(button.link);
							})
							.set("ai", button => {
								return get.player().getUseValue(button.link);
							})
							.forResult();
						if (result.bool) {
							const card = result.links[0];
							cards.remove(card);
							player.$gain2(card, false);
							await game.delayx();
							await player.chooseUseTarget(card, true);
						} else {
							break;
						}
					}
				},
			},
			record: {
				charlotte: true,
				trigger: { global: ["useCard", "respond", "useCard1", "phaseAfter"] },
				filter(event, player, name) {
					if (name == "useCard1") {
						return get.suit(event.card) == "spade";
					}
					if (event.name == "phase") {
						return true;
					}
					if (!Array.isArray(event.respondTo)) {
						return false;
					}
					return get.type(event.respondTo[1]) != "trick" || ["caochuan", "wuxie"].includes(event.card.name);
				},
				silent: true,
				forced: true,
				content() {
					if (trigger.name == "phase") {
						delete player.storage.clanmingjie_record;
					} else {
						player.markAuto(
							"clanmingjie_record",
							game.getGlobalHistory("everything", evt => {
								if (event.triggername == "useCard1") {
									return evt == trigger;
								}
								return evt.name == "useCard" && evt.card == trigger.respondTo[1];
							})[0].cards
						);
					}
				},
			},
		},
	},
	//族钟琰
	clanguangu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			content(storage) {
				return "转换技。出牌阶段限一次，你可以观看" + (storage ? "一名角色的至多四张手" : "牌堆顶的至多四张") + "牌，然后可以使用其中的一张牌。";
			},
		},
		filter(event, player) {
			if (player.storage.clanguangu) {
				return game.hasPlayer(current => {
					return current.countCards("h");
				});
			}
			return true;
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("观骨：选择观看牌堆的牌数", "hidden");
				if (player.storage.clanguangu) {
					dialog.forceDirect = true;
				}
				return dialog;
			},
			chooseControl(event, player) {
				var list = [1, 2, 3, 4].map(i => {
					return get.cnNumber(i, true);
				});
				list.push("cancel2");
				return list;
			},
			check(button, player) {
				var ret;
				if (!player.hasSkill("clanxiaoyong")) {
					ret = 4;
				} else {
					var list = [4, 3, 2, 1];
					player.getHistory("useCard", evt => {
						var len = get.cardNameLength(evt.card);
						list.remove(len);
					});
					if (list.length) {
						ret = list[0];
					} else {
						ret = 4;
					}
				}
				return get.cnNumber(ret, true);
			},
			backup(result, player) {
				return {
					audio: "clanguangu",
					filterCard: () => false,
					selectCard: -1,
					filterTarget(card, player, target) {
						if (player.storage.clanguangu) {
							return true;
						}
						return false;
					},
					selectTarget() {
						var player = _status.event.player;
						if (player.storage.clanguangu) {
							return 1;
						}
						return -1;
					},
					num: result.index + 1,
					async content(event, trigger, player) {
						const { targets } = event;
						player.changeZhuanhuanji("clanguangu");
						let cards;
						if (!targets?.length) {
							const num = lib.skill["clanguangu_backup"].num;
							cards = get.cards(num, true);
						} else {
							const [target] = targets;
							let ret;
							if (!player.hasSkill("clanxiaoyong")) {
								ret = 4;
							} else {
								const list = [4, 3, 2, 1];
								player.getHistory("useCard", evt => {
									var len = get.cardNameLength(evt.card);
									list.remove(len);
								});
								if (list.length) {
									ret = list[0];
								} else {
									ret = 4;
								}
							}
							const result = await player
								.choosePlayerCard(target, "h", true, [1, 4])
								.set("prompt", "观骨：观看" + get.translation(target) + "的至多四张牌")
								.set("ai", button => {
									if (ui.selected.buttons.length >= _status.event.num) {
										return 0;
									}
									return Math.random();
								})
								.set("num", ret)
								.forResult();
							cards = result.cards;
						}
						if (cards?.length) {
							const count = cards.length;
							event.getParent().viewedCount = count;
							const result = await player
								.chooseButton(["观骨：是否使用其中一张牌？", cards])
								.set("filterButton", button => {
									var player = _status.event.player;
									var card = button.link;
									var cardx = {
										name: get.name(card, get.owner(card)),
										nature: get.nature(card, get.owner(card)),
										cards: [card],
									};
									return player.hasUseTarget(cardx, null, false);
								})
								.set("ai", button => {
									var len = _status.event.len;
									var card = button.link;
									var fix = 1;
									if (get.cardNameLength(card) == len) {
										fix = 2;
									}
									return fix * _status.event.player.getUseValue(card);
								})
								.set(
									"len",
									(function () {
										if (!player.hasSkill("clanxiaoyong")) {
											return 0;
										}
										var list = [];
										player.getHistory("useCard", evt => {
											var len = get.cardNameLength(evt.card);
											list.add(len);
										});
										if (!list.includes(count)) {
											return count;
										}
										if (list.length) {
											return list.randomGet();
										}
										return 4;
									})()
								)
								.forResult();
							if (result.bool && result.links?.length) {
								const {
									links: [card],
								} = result;
								cards.remove(card);
								const cardx = {
									name: get.name(card, get.owner(card)),
									nature: get.nature(card, get.owner(card)),
									cards: [card],
								};
								const next = player.chooseUseTarget(cardx, [card], true, false);
								if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) {
									next.viewAs = false;
								}
								await next;
							}
						}
					},
					ai: {
						order: 10,
						result: {
							target(player, target) {
								return -Math.min(target.countCards("h"), 4) / 2;
							},
						},
					},
				};
			},
			prompt(result, player) {
				if (!player.storage.clanguangu) {
					return "点击“确定”以观看牌堆顶牌";
				}
				return "观骨：选择观看牌的目标";
			},
		},
		subSkill: {
			backup: {},
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	clanxiaoyong: {
		audio: 2,
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			var len = get.cardNameLength(event.card);
			if (
				player.hasHistory(
					"useCard",
					function (evt) {
						return evt != event && get.cardNameLength(evt.card) == len;
					},
					event
				)
			) {
				return false;
			}
			if (!player.getStat().skill.clanguangu) {
				return false;
			}
			var history = player
				.getAllHistory("useSkill", evt => {
					return evt.skill == "clanguangu_backup";
				})
				.map(evt => evt.event);
			if (!history.length) {
				return false;
			}
			var num = 0;
			for (var i = history.length - 1; i >= 0; i--) {
				var evt = history[i];
				if (evt.viewedCount) {
					num = evt.viewedCount;
					break;
				}
			}
			if (num && len == num) {
				return true;
			}
			return false;
		},
		forced: true,
		content() {
			"step 0";
			delete player.getStat().skill.clanguangu;
			game.log(player, "重置了", "#g【观骨】");
		},
		ai: {
			combo: "clanguangu",
		},
		mod: {
			aiOrder(player, card, num) {
				if (!player.hasSkill("clanguangu") || !player.getStat().skill.clanguangu) {
					return;
				}
				var history = player
					.getAllHistory("useSkill", evt => {
						return evt.skill == "clanguangu_backup";
					})
					.map(evt => evt.event);
				if (!history.length) {
					return;
				}
				var numx = 0;
				for (var i = history.length - 1; i >= 0; i--) {
					var evt = history[i];
					if (evt.viewedCount) {
						numx = evt.viewedCount;
						break;
					}
				}
				if (numx == get.cardNameLength(card)) {
					if (
						!player.hasHistory("useCard", evt => {
							return numx == get.cardNameLength(evt.card);
						})
					) {
						return num + 9;
					}
				}
			},
		},
	},
	clanbaozu: {
		audio: 2,
		audioname: ["clan_zhongyan", "clan_zhongyu", "clan_zhongyao"],
		audioname2: { clan_zhonghui: "clanbaozu_clan_zhonghui" },
		trigger: { global: "dying" },
		clanSkill: true,
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		filter(event, player) {
			return (event.player == player || event.player.hasClan("颍川钟氏")) && event.player.hp <= 0 && !event.player.isLinked();
		},
		logTarget: "player",
		check(event, player) {
			return lib.skill.wanlan.check(event, player);
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			"step 1";
			trigger.player.link(true);
			trigger.player.recover();
		},
		subSkill: { clan_zhonghui: { audio: 6 } },
	},
	//族王凌
	clanbolong: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterTarget: lib.filter.notMe,
		content() {
			"step 0";
			var num = player.countCards("h");
			var str = "是否交给其" + get.cnNumber(num) + "张牌，然后视为你对其使用一张【酒】？或者点击“取消”，令其交给你一张牌，然后其视为对你使用一张雷【杀】。";
			if (!num || target.countCards("he") < num) {
				event._result = { bool: false };
			} else {
				target
					.chooseCard(get.translation(player) + "对你发动了【驳龙】", str, num, "he")
					.set("ai", card => {
						if (_status.event.canGive) {
							return 5 + Math.max(0, 3 - _status.event.player.hp) / 1.5 - get.value(card);
						}
						return 0;
					})
					.set(
						"canGive",
						(function () {
							if (get.attitude(target, player) > 1) {
								return true;
							}
							if (!player.hasSha() && player.countCards("h") <= 4) {
								return true;
							}
							var sha = {
								name: "sha",
								nature: "thunder",
								isCard: true,
							};
							if (
								game.hasPlayer(current => {
									return player.canUse(sha, current, true, true) && get.effect(current, sha, player, target) < 0 && !current.countCards("hs", ["shan", "caochuan"]);
								})
							) {
								return false;
							}
							return true;
						})()
					);
			}
			"step 1";
			if (result.bool) {
				var cards = result.cards;
				target.give(cards, player);
				if (lib.filter.targetEnabled2({ name: "jiu", isCard: true }, target, player)) {
					target.useCard({ name: "jiu", isCard: true }, player, false);
				}
				event.finish();
			} else {
				player.chooseCard("驳龙：交给" + get.translation(target) + "一张牌", get.translation(target) + "拒绝给牌，请交给其一张牌然后视为对其使用一张雷【杀】", true, "he");
			}
			"step 2";
			if (result.bool) {
				var cards = result.cards;
				player.give(cards, target);
				var sha = {
					name: "sha",
					nature: "thunder",
					isCard: true,
				};
				if (player.canUse(sha, target, false, false)) {
					player.useCard(sha, target, false);
				}
			}
		},
		ai: {
			order(item, player) {
				return get.order({ name: "jiu" }) + 0.01;
			},
			threaten: 2,
			result: {
				target(player, target) {
					if (
						player.hasCard(card => {
							return get.value(card) < 5 && !["shan", "tao", "jiu", "wuxie", "caochuan"].includes(get.name(card));
						}, "he")
					) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	clanzhongliu: {
		audio: 2,
		audioname: ["clan_wangling", "clan_wangyun", "clan_wanghun", "clan_wanglun", "clan_wangguang", "clan_wangmingshan", "clan_wangchang", "clan_wangshen"],
		trigger: { player: "useCard" },
		forced: true,
		clanSkill: true,
		filter(event, player) {
			if (!event.cards.length) {
				return true;
			}
			return !game.hasPlayer2(current => {
				if (!current.hasClan("太原王氏") && current != player) {
					return false;
				}
				return current.hasHistory("lose", evt => {
					const evtx = evt.relatedEvent || evt.getParent();
					return evtx == event && evt.hs.length > 0;
				});
			});
		},
		content() {
			player.refreshSkill();
		},
	},
	//族吴匡
	clanlianzhu: {
		audio: 2,
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			content(storage) {
				var str = "转换技。每名角色Ａ的出牌阶段限一次。";
				if (!storage) {
					str += "Ａ可以重铸一张牌，然后你可以重铸一张牌。若这两张牌颜色不同，则你的手牌上限-1。";
				} else {
					str += "Ａ可以令你选择一名在你或Ａ攻击范围内的另一名其他角色Ｂ，然后Ａ和你可依次选择是否对Ｂ使用一张【杀】。若这两张【杀】颜色相同，则你的手牌上限+1";
				}
				return str;
			},
		},
		global: "clanlianzhu_global",
		subSkill: {
			global: {
				forceaudio: true,
				audio: "clanlianzhu",
				enable: "phaseUse",
				filter: (event, player) => game.hasPlayer(current => lib.skill.clanlianzhu_global.filterTarget(null, player, current)),
				filterCard: (card, player) => game.hasPlayer(current => current.hasSkill("clanlianzhu") && !current.hasSkill("clanlianzhu_targeted") && !current.storage.clanlianzhu) && player.canRecast(card),
				selectCard: [0, 1],
				check(card) {
					return 5 - get.value(card);
				},
				filterTarget(card, player, target) {
					return (
						target.hasSkill("clanlianzhu") &&
						!target.hasSkill("clanlianzhu_targeted") &&
						(!target.storage.clanlianzhu ||
							(target.storage.clanlianzhu &&
								game.hasPlayer(current => {
									if (current == player || current == target) {
										return false;
									}
									return current.inRangeOf(player) || current.inRangeOf(target);
								})))
					);
				},
				selectTarget() {
					var player = _status.event.player;
					var count = game.countPlayer(current => lib.skill.clanlianzhu_global.filterTarget(null, player, current));
					return count == 1 ? -1 : 1;
				},
				filterOk() {
					var target = ui.selected.targets[0];
					if (!target) {
						return false;
					}
					if (!target.storage.clanlianzhu) {
						return ui.selected.cards.length == 1;
					}
					return ui.selected.cards.length == 0;
				},
				position: "he",
				discard: false,
				lose: false,
				delay: false,
				prompt() {
					var player = _status.event.player;
					var bocchi = [],
						kita = [];
					game.countPlayer(function (target) {
						if (target.hasSkill("clanlianzhu") && !target.hasSkill("clanlianzhu_targeted")) {
							if (target.storage.clanlianzhu) {
								if (
									game.hasPlayer(current => {
										if (current == player || current == target) {
											return false;
										}
										return current.inRangeOf(player) || current.inRangeOf(target);
									})
								) {
									kita.add(target);
								}
							} else {
								if (player.countCards("he") > 0) {
									bocchi.add(target);
								}
							}
						}
					});
					bocchi.sortBySeat();
					kita.sortBySeat();
					var str = "";
					if (bocchi.length) {
						str += "重铸一张牌，然后令";
						bocchi.forEach((current, i) => {
							str += get.translation(current);
							if (i < bocchi.length - 1) {
								str += "或";
							}
						});
						str += "选择是否重铸一张牌";
						if (kita.length) {
							str += "。<br>或者";
						}
					}
					if (kita.length) {
						str += "令";
						kita.forEach((current, i) => {
							str += get.translation(current);
							if (i < kita.length - 1) {
								str += "或";
							}
						});
						str += "选择一名目标，然后对其进行集火";
					}
					str += "。";
					return str;
				},
				content() {
					"step 0";
					target.addTempSkill("clanlianzhu_targeted", "phaseUseAfter");
					if (target.storage.clanlianzhu) {
						event.goto(4);
					}
					target.changeZhuanhuanji("clanlianzhu");
					"step 1";
					player.recast(cards);
					"step 2";
					if (!target.countCards("he") && !_status.connectMode) {
						event._result = { bool: false };
					} else {
						target.chooseCard("he", "联诛：是否重铸一张牌？", lib.filter.cardRecastable);
					}
					"step 3";
					if (result.bool) {
						target.recast(result.cards);
						if (get.color(cards[0]) === get.color(result.cards[0])) {
							lib.skill.chenliuwushi.change(target, 1);
						}
					}
					event.finish();
					"step 4";
					target
						.chooseTarget("联诛：选择其与你使用【杀】的目标", true, (card, player, target) => {
							if (target == player || target == _status.event.sourcex) {
								return false;
							}
							return target.inRangeOf(player) || target.inRangeOf(_status.event.sourcex);
						})
						.set("ai", target => {
							return get.effect(target, { name: "sha" }, _status.event.player, _status.event.player);
						})
						.set("sourcex", player);
					"step 5";
					if (result.bool) {
						var targetx = result.targets[0];
						event.targetx = targetx;
						target.line(targetx);
						event.targets = [player, target];
						event.cards = [];
						if (!event.isMine() && !event.isOnline()) {
							game.delayx();
						}
					} else {
						event.finish();
					}
					"step 6";
					var current = targets.shift();
					current
						.chooseToUse(
							function (card, player, event) {
								if (get.name(card) != "sha") {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							},
							"联诛：是否对" + get.translation(event.targetx) + "使用一张杀？"
						)
						.set("targetRequired", true)
						.set("complexSelect", true)
						.set("complexTarget", true)
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
								return false;
							}
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("sourcex", event.targetx)
						.set("addCount", false);
					"step 7";
					if (result.bool) {
						cards.push(result.card);
					}
					if (targets.length > 0) {
						event.goto(6);
					}
					"step 8";
					if (cards.length > 1) {
						const color = get.color(cards[0], false);
						if (color != "none") {
							for (let i = 1; i < cards.length; i++) {
								const color2 = get.color(cards[i], false);
								if (color !== color2 && color2 !== "none") {
									lib.skill.chenliuwushi.change(target, -1);
									break;
								}
							}
						}
					}
				},
				ai: {
					order: 4.1,
					result: {
						player(player, target) {
							if (!target.storage.clanlianzhu && player.hasCard(card => get.value(card) < 5, "he")) {
								return 1;
							}
							return 0;
						},
						target(player, target) {
							if (target.storage.clanlianzhu && player.hasSha()) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			targeted: { charlotte: true },
		},
	},
	//族韩韶
	clanfangzhen: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(current => !current.isLinked());
		},
		direct: true,
		seatRelated: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("clanfangzhen"), (card, player, target) => {
					return !target.isLinked();
				})
				.set("ai", target => {
					var player = _status.event.player;
					if (_status.event.goon && target != player) {
						target.classList.add("linked");
						target.classList.add("linked2");
						try {
							var cards = player.getCards("hs", cardx => {
								if (get.name(cardx) != "sha") {
									return false;
								}
								return game.hasNature(cardx, "linked");
							});
							cards.map(i => [i, get.effect(target, i, player, player)]);
							cards.sort((a, b) => b[1] - a[1]);
						} catch (e) {
							target.classList.remove("linked");
							target.classList.remove("linked2");
						}
						target.classList.remove("linked");
						target.classList.remove("linked2");
						var eff = cards[0][1];
						if (eff > 0) {
							return eff;
						}
						return Math.max(2 * get.effect(target, { name: "draw" }, player, player) + 0.6 * get.effect(player, { name: "draw" }, player, player), get.recoverEffect(target, player, player));
					}
					return Math.max(2 * get.effect(target, { name: "draw" }, player, player) + 0.6 * get.effect(player, { name: "draw" }, player, player), get.recoverEffect(target, player, player));
				})
				.set(
					"goon",
					player.countCards("hs", card => {
						return get.name(card) == "jiu" && player.hasUseTarget(card);
					}) &&
						player.countCards("hs", card => {
							if (get.name(card) != "sha") {
								return false;
							}
							return game.hasNature(card, "linked");
						})
				);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("clanfangzhen", target);
				player.addSkill("clanfangzhen_remove");
				player.markAuto("clanfangzhen_remove", [target.getSeatNum()]);
				target.link(true);
				var choices = ["选项一"],
					choiceList = ["摸两张牌，然后交给" + get.translation(target) + "两张牌", "令" + get.translation(target) + "回复1点体力"];
				if (target.isDamaged()) {
					choices.push("选项二");
				} else {
					choiceList[1] = '<span style="opacity:0.5; ">' + choiceList[1] + "</span>";
				}
				player
					.chooseControl(choices)
					.set("prompt", "放赈：请选择一项")
					.set("choiceList", choiceList)
					.set("ai", () => {
						var player = _status.event.player,
							target = _status.event.getParent().target;
						if (!target.isDamaged()) {
							return 0;
						}
						if (get.attitude(player, target) <= 0 && player.countCards("he", card => get.value(card) < 0) >= 2) {
							return 0;
						}
						return 2 * get.effect(target, { name: "draw" }, player, player) + 0.6 * get.effect(player, { name: "draw" }, player, player) > get.recoverEffect(target, player, player) ? 0 : 1;
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.control == "选项一") {
				player.draw(2);
				if (player == target) {
					event.finish();
				}
			} else {
				target.recover();
				event.finish();
			}
			"step 3";
			if (!player.countCards("he")) {
				event.finish();
			} else if (player.countCards("he") <= 2) {
				event._result = {
					bool: true,
					cards: player.getCards("he"),
				};
			} else {
				player.chooseCard("放赈：交给" + get.translation(target) + "两张牌", "he", 2, true);
			}
			"step 4";
			if (result.bool) {
				player.give(result.cards, target);
			}
		},
		ai: {
			expose: 0.2,
		},
		subSkill: {
			remove: {
				audio: "clanfangzhen",
				trigger: { global: "roundStart" },
				onremove: true,
				forced: true,
				locked: false,
				charlotte: true,
				filter(event, player) {
					return player.getStorage("clanfangzhen_remove").includes(game.roundNumber);
				},
				content() {
					player.removeSkills("clanfangzhen");
				},
			},
		},
	},
	clanliuju: {
		audio: 2,
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "与一名其他角色拼点，输的角色可以使用任意张拼点牌中的非基本牌", (card, player, target) => {
					return player.canCompare(target);
				})
				.set("ai", target => {
					var player = _status.event.player;
					var ts = target.getCards("h").sort((a, b) => get.number(a) - get.number(b));
					if (get.attitude(player, target) < 0) {
						var hs = player.getCards("h").sort((a, b) => get.number(a) - get.number(b));
						if (!hs.length || !ts.length) {
							return 0;
						}
						if (get.type(hs[0], null, false) == "basic" && get.value(hs[0]) > 6) {
							return 0;
						}
						if (get.number(hs[0]) < get.number(ts[0]) || get.type(hs[0], null, false) == "basic") {
							return 1;
						}
						return Math.random() - 0.7;
					}
					return get.type(ts[0]) != "basic";
				})
				.forResult();
		},
		content() {
			"step 0";
			var target = targets[0];
			event.target = target;
			player.chooseToCompare(target).set("small", true);
			"step 1";
			if (!result.tie) {
				var loser = result.bool ? target : player;
				var cards = [];
				game.getGlobalHistory("cardMove", evt => {
					if (evt.getParent(2).name === "chooseToCompare" && evt.getParent(3) === event) {
						cards.addArray(
							evt.cards.filter(i => {
								return get.position(i, true) == "d" && get.type(i, null, false) != "basic";
							})
						);
					}
				});
				event.loser = loser;
				event.distance = [get.distance(player, target), get.distance(target, player)];
				if (cards.length) {
					event.cards = cards;
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			var cardsx = cards.filter(i => get.position(i, true) == "d" && event.loser.hasUseTarget(i));
			if (!cardsx.length) {
				event.goto(6);
			} else {
				event.loser
					.chooseButton(["留驹：是否使用其中的一张牌？", cardsx])
					.set("filterButton", button => {
						return _status.event.player.hasUseTarget(button.link);
					})
					.set("ai", button => {
						return _status.event.player.getUseValue(button.link) + 0.1;
					});
			}
			"step 3";
			if (result.bool) {
				var card = result.links[0];
				event.cards.remove(card);
				event.loser.$gain2(card, false);
				game.delayx();
				event.loser.chooseUseTarget(true, card, false);
			} else {
				event.goto(5);
			}
			"step 4";
			if (cards.filter(i => get.position(i, true) == "d" && event.loser.hasUseTarget(i)).length) {
				event.goto(2);
			}
			"step 5";
			if (get.distance(player, target) != event.distance[0] || get.distance(target, player) != event.distance[1]) {
				player.restoreSkill("clanxumin");
				game.log(player, "重置了", "#g【恤民】");
			}
		},
	},
	clanxumin: {
		audio: 2,
		audioname: ["clan_hanshao", "clan_hanrong", "clan_hanfu"],
		enable: "phaseUse",
		viewAs: { name: "wugu" },
		filterCard: true,
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			return player.canUse(card, target);
		},
		selectTarget: [1, Infinity],
		check(card) {
			return 6 - get.value(card);
		},
		position: "he",
		limited: true,
		clanSkill: true,
		skillAnimation: true,
		animationColor: "soil",
		log: false,
		precontent() {
			player.logSkill("clanxumin");
			player.awakenSkill("clanxumin");
		},
		ai: {
			order: 7,
			result: { target: 1 },
		},
	},
	//族韩融
	//我们连和！（？）
	clanlianhe: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(current => !current.isLinked());
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("clanlianhe"), 2, (card, player, target) => {
					return !target.isLinked();
				})
				.set("ai", target => {
					var att = get.attitude(_status.event.player, target);
					if (att > 0) {
						att /= 1.2;
					}
					return Math.abs(att);
				});
			"step 1";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				targets.forEach(i => i.link(true));
				player.logSkill("clanlianhe", targets);
				player.addSkill("clanlianhe_effect");
				player.markAuto("clanlianhe_effect", targets);
			}
		},
		subSkill: {
			effect: {
				audio: "clanlianhe",
				trigger: { global: ["phaseUseEnd", "die"] },
				charlotte: true,
				forced: true,
				locked: false,
				popup: false,
				onremove: true,
				filter(event, player) {
					return player.getStorage("clanlianhe_effect").includes(event.player);
				},
				marktext: "连",
				intro: { content: "已选择目标：$" },
				content() {
					"step 0";
					player.unmarkAuto("clanlianhe_effect", [trigger.player]);
					if (trigger.name == "die") {
						event.finish();
					}
					"step 1";
					if (
						trigger.player.hasHistory("gain", evt => {
							return evt.getParent().name == "draw" && evt.getParent("phaseUse") == trigger;
						})
					) {
						event.finish();
					} else {
						player.logSkill("clanlianhe_effect", trigger.player);
						var num = 0;
						trigger.player.getHistory("gain", evt => {
							if (evt.getParent("phaseUse") != trigger) {
								return false;
							}
							num += evt.cards.length;
						});
						num = Math.min(num, 3);
						event.num = num;
						if (num <= 1) {
							event._result = { bool: false };
						} else {
							var pos = player == trigger.player ? "e" : "he";
							trigger.player
								.chooseCard("连和：交给" + get.translation(player) + get.cnNumber(num - 1) + "张牌，或点“取消”令其摸" + get.cnNumber(num + 1) + "张牌", num - 1, pos)
								.set("ai", card => {
									if (_status.event.draw) {
										return 0;
									}
									return 5 - get.value(card);
								})
								.set("draw", get.attitude(trigger.player, player) >= 0);
						}
					}
					"step 2";
					if (result.bool) {
						trigger.player.give(result.cards, player);
					} else {
						player.draw(num + 1);
					}
				},
			},
		},
	},
	clanhuanjia: {
		audio: 2,
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("clanhuanjia"), "与一名其他角色拼点，赢的角色可以使用一张拼点牌。若此牌未造成过伤害，你获得另一张拼点牌，否则你失去一个技能", (card, player, target) => {
					return player.canCompare(target);
				})
				.set("ai", target => {
					var player = _status.event.player;
					if (get.attitude(player, target) <= 0) {
						var hs = player.getCards("h").sort((a, b) => get.number(b) - get.number(a));
						var ts = target.getCards("h").sort((a, b) => get.number(b) - get.number(a));
						if (!hs.length || !ts.length) {
							return 0;
						}
						if (get.number(hs[0]) > get.number(ts[0]) && !get.tag(hs[0], "damage") && player.hasValueTarget(hs[0])) {
							return 1;
						}
						return Math.random() - 0.4;
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("clanhuanjia", target);
				player.chooseToCompare(target);
			} else {
				event.finish();
			}
			"step 2";
			if (!result.tie) {
				var winner = result.bool ? player : target;
				var cards = [];
				game.getGlobalHistory("cardMove", evt => {
					if (evt.getParent(3) == event) {
						cards.addArray(evt.cards.filterInD("d"));
					}
				});
				event.winner = winner;
				if (cards.length) {
					event.cards = cards;
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 3";
			var cardsx = cards.filter(i => get.position(i, true) == "d" && event.winner.hasUseTarget(i));
			if (!cardsx.length) {
				event.goto(6);
			} else {
				event.winner
					.chooseButton(["缓颊：是否使用其中的一张牌？", cardsx])
					.set("filterButton", button => {
						return _status.event.player.hasUseTarget(button.link);
					})
					.set("ai", button => {
						var damage = 1;
						if (_status.event.att > 2 && get.tag(button.link, "damage")) {
							damage *= 2;
						}
						return _status.event.player.getUseValue(button.link) * damage + 0.1;
					})
					.set("att", get.attitude(event.winner, player));
			}
			"step 4";
			if (result.bool) {
				var card = result.links[0];
				event.card = card;
				event.cards.remove(card);
				event.winner.$gain2(card, false);
				game.delayx();
				event.winner.chooseUseTarget(true, card, false);
			}
			"step 5";
			if (
				game.hasPlayer2(current => {
					return current.hasHistory("sourceDamage", evt => evt.cards && evt.cards[0] == card);
				})
			) {
				var skills = player.getSkills(null, false, false).filter(skill => {
					var info = get.info(skill);
					if (!info || get.is.empty(info) || info.charlotte) {
						return false;
					}
					return true;
				});
				player
					.chooseControl(skills)
					.set(
						"choiceList",
						skills.map(i => {
							return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player, false) + "</div>";
						})
					)
					.set("displayIndex", false)
					.set("prompt", "恤民：失去一个技能")
					.set("ai", () => {
						var choices = _status.event.controls.slice();
						var value = skill => get.skillRank(skill, "in") + get.skillRank(skill, "out");
						choices = choices.map(skill => [skill, value(skill)]);
						var list = choices.sort((a, b) => a[1] - b[1])[0];
						if (list[1] < 2) {
							return list[0];
						} else {
							if (_status.event.controls.includes("clanxumin")) {
								return "clanxumin";
							}
							return list[0];
						}
					});
			} else {
				player.gain(cards, "gain2");
				event.finish();
			}
			"step 6";
			player.removeSkills(result.control);
		},
		ai: {
			expose: 0.1,
		},
	},
	//族荀谌
	clansankuang: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		locked: true,
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			const type = get.type2(event.card);
			return player.getRoundHistory("useCard", evt => get.type2(evt.card) == type).indexOf(event) == 0;
		},
		getNum(player) {
			return (player.countCards("ej") > 0) + player.isDamaged() + (Math.max(0, player.hp) < player.countCards("h"));
		},
		async cost(event, trigger, player) {
			const func = (event, player) => {
				const name = event.skill;
				game.countPlayer(target => {
					if (target != player) {
						target.prompt(get.translation(name) + get.info(name).getNum(target));
					}
				});
			};
			if (event.player == game.me) {
				func(event, player);
			} else if (event.isOnline()) {
				player.send(func, event, player);
			}
			const cards = trigger.cards.filterInD("oe");
			event.result = await player
				.chooseTarget("三恇：选择一名其他角色", "令其交给你至少X张牌" + (cards.length ? "，然后其获得" + get.translation(cards) : "") + "（X为以下条件中其满足的项数：场上有牌、已受伤、体力值小于手牌数）", true, lib.filter.notMe)
				.set("ai", target => {
					const { player, goon } = get.event();
					const att = get.attitude(player, target),
						num = lib.skill.clansankuang.getNum(target);
					if (num == 0) {
						return att;
					}
					if (goon) {
						return -att;
					}
					return -Math.sqrt(Math.abs(att)) - lib.skill.clansankuang.getNum(target);
				})
				.set(
					"goon",
					Math.max.apply(
						Math,
						trigger.cards.map(i => get.value(i))
					) <= 5 || trigger.cards.filterInD("oe").length == 0
				)
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const num = lib.skill.clansankuang.getNum(target),
				num2 = target.countCards("he");
			const cards = trigger.cards.filterInD("oe");
			const result =
				num2 == 0
					? { bool: false }
					: await target
							.chooseToGive(player, "he", num > 0, [Math.min(num2, num), Infinity], "allowChooseAll")
							.set("ai", get.unuseful)
							.set("prompt", num > 0 ? "是否交给" + get.translation(player) + "任意张牌" + (cards.length ? "并获得" + get.translation(cards) : "") + "？" : "交给" + get.translation(player) + "至少" + get.cnNumber(num) + "张牌")
							.forResult();
			if (!result?.bool || !result.cards?.length || !cards.length) {
				return;
			}
			await game.delayx();
			if (trigger.cards.filterInD().length) {
				await target.gain(trigger.cards.filterInD(), "gain2", "bySelf");
			} else if (trigger.cards.filterInD("e").length) {
				await target.gain(trigger.cards.filterInD("e"), get.owner(trigger.cards.filterInD("e")[0]), "give");
			}
		},
		ai: {
			reverseOrder: true,
			skillTagFilter(player) {
				if (player.getHistory("useCard", evt => get.type(evt.card) == "equip").length > 0) {
					return false;
				}
			},
			effect: {
				target_use(card, player, target) {
					if (player == target && get.type(card) == "equip" && !player.getHistory("useCard", evt => get.type(evt.card) == "equip").length == 0) {
						return [1, 3];
					}
				},
			},
			threaten: 1.6,
		},
	},
	clanbeishi: {
		audio: 2,
		trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
		forced: true,
		filter(event, player) {
			if (player.isHealthy()) {
				return false;
			}
			const history = player.getAllHistory("useSkill", evt => evt.skill == "clansankuang");
			if (!history.length) {
				return false;
			}
			const target = history[0].targets[0];
			if (target.countCards("h")) {
				return false;
			}
			const evt = event.getl(target);
			return evt?.hs?.length;
		},
		content() {
			player.recover();
		},
		ai: { combo: "clansankuang" },
	},
	//族荀淑
	clanshenjun: {
		audio: 2,
		trigger: { global: "useCard" },
		forced: true,
		locked: false,
		filter(event, player) {
			return (event.card.name == "sha" || get.type(event.card) == "trick") && player.countCards("h", event.card.name) > 0;
		},
		content() {
			var cards = player.getCards("h", trigger.card.name);
			player.showCards(cards, get.translation(player) + "发动了【神君】");
			player.markSkill("clanshenjun");
			player.addGaintag(cards, "clanshenjun");
			for (var name of lib.phaseName) {
				var evt = _status.event.getParent(name);
				if (!evt || evt.name != name) {
					continue;
				}
				player.addTempSkill("clanshenjun_viewAs", name + "After");
				break;
			}
		},
		marktext: "君",
		intro: {
			markcount(storage, player) {
				return player.countCards("h", card => card.hasGaintag("clanshenjun"));
			},
			mark(dialog, content, player) {
				var cards = player.getCards("h", card => card.hasGaintag("clanshenjun"));
				if (cards.length) {
					dialog.addAuto(cards);
				} else {
					return "无展示牌";
				}
			},
		},
		subSkill: {
			viewAs: {
				audio: "clanshenjun",
				trigger: { global: ["phaseZhunbeiEnd", "phaseJudgeEnd", "phaseDrawEnd", "phaseUseEnd", "phaseDiscardEnd", "phaseJieshuEnd"] },
				filter(event, player) {
					return player.countCards("h", card => card.hasGaintag("clanshenjun")) > 0;
				},
				forced: true,
				charlotte: true,
				content() {
					"step 0";
					var cards = player.getCards("h", card => card.hasGaintag("clanshenjun"));
					var list = [],
						names = [];
					for (var card of cards) {
						var name = get.name(card),
							nature = get.nature(card);
						var namex = name;
						if (nature && nature.length) {
							namex += nature;
							if (names.includes(namex)) {
								continue;
							}
							list.push([get.type(card), "", name, nature]);
						} else {
							if (names.includes(namex)) {
								continue;
							}
							list.push([get.type(card), "", name]);
						}
						names.push(namex);
					}
					list.sort((a, b) => {
						var del1 = lib.inpile.indexOf(a[2]) - lib.inpile.indexOf(b[2]);
						if (del1 != 0) {
							return del1;
						}
						var a1 = 0,
							b1 = 0;
						if (a.length > 3) {
							a1 = lib.nature.get(a) || 0;
						}
						if (b.length > 3) {
							b1 = lib.nature.get(b) || 0;
						}
						return a1 - b1;
					});
					player.chooseButton(["是否将" + get.cnNumber(cards.length) + "张牌当下列一张牌使用？", [list, "vcard"]]).set("ai", function (button) {
						return _status.event.player.getUseValue({
							name: button.link[2],
							nature: button.link[3],
						});
					});
					"step 1";
					if (result.bool) {
						var name = result.links[0][2],
							nature = result.links[0][3];
						var cards = player.getCards("h", card => card.hasGaintag("clanshenjun"));
						game.broadcastAll(
							function (num, card) {
								lib.skill.clanshenjun_backup.selectCard = num;
								lib.skill.clanshenjun_backup.viewAs = card;
							},
							cards.length,
							{ name: name, nature: nature }
						);
						var next = player.chooseToUse();
						next.set("openskilldialog", "将" + get.cnNumber(cards.length) + "张牌当做" + (get.translation(nature) || "") + "【" + get.translation(name) + "】使用");
						next.set("norestore", true);
						next.set("addCount", false);
						next.set("_backupevent", "clanshenjun_backup");
						next.set("custom", {
							add: {},
							replace: { window() {} },
						});
						next.backup("clanshenjun_backup");
					}
				},
			},
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				position: "hes",
				filterTarget: lib.filter.filterTarget,
				check: card => 6 - get.value(card),
				log: false,
			},
		},
	},
	clanbalong: {
		audio: 2,
		trigger: {
			player: ["damageEnd", "recoverEnd", "loseHpEnd"],
		},
		forced: true,
		filter(event, player) {
			if (game.getGlobalHistory("changeHp", evt => evt.player == player).length != 1) {
				return false;
			}
			var cards = player.getCards("h"),
				map = {};
			if (!cards.length) {
				return false;
			}
			for (var card of cards) {
				var type = get.type2(card);
				if (typeof map[type] != "number") {
					map[type] = 0;
				}
				map[type]++;
			}
			var list = [];
			for (var i in map) {
				if (map[i] > 0) {
					list.push([i, map[i]]);
				}
			}
			list.sort((a, b) => b[1] - a[1]);
			return list[0][0] == "trick" && (list.length == 1 || list[0][1] > list[1][1]);
		},
		content() {
			player.showHandcards(get.translation(player) + "发动了【八龙】");
			player.drawTo(game.countPlayer());
		},
	},
	//族荀粲
	clanyunshen: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target && target.isDamaged();
		},
		content() {
			"step 0";
			target.recover();
			"step 1";
			var name = get.translation(target);
			player
				.chooseControl()
				.set("choiceList", [name + "视为对你使用一张冰【杀】", "你视为对" + name + "使用一张冰【杀】"])
				.set("prompt", "熨身：请选择一项")
				.set("ai", () => _status.event.choice)
				.set(
					"choice",
					(function () {
						var card = {
							name: "sha",
							nature: "ice",
							isCard: true,
						};
						var eff = get.effect(player, card, target, player),
							eff2 = get.effect(target, card, player, player);
						if (eff > eff2) {
							return "选项一";
						} else {
							return "选项二";
						}
					})()
				);
			"step 2";
			var players = [target, player];
			if (result.control == "选项二") {
				players.reverse();
			}
			var card = { name: "sha", nature: "ice", isCard: true };
			if (players[0].canUse(card, players[1], false)) {
				players[0].useCard(card, players[1], false, "noai");
			}
		},
		ai: {
			order: 2,
			expose: 0.2,
			result: {
				target(player, target) {
					var eff = get.recoverEffect(target, player, player);
					if (eff > 0) {
						return 1;
					} else if (
						get.effect(
							target,
							{
								name: "sha",
								nature: "ice",
								isCard: true,
							},
							player,
							player
						) > eff
					) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	clanshangshen: {
		audio: 2,
		trigger: { global: "damageEnd" },
		filter(event, player) {
			if (!event.hasNature() || !event.player.isIn()) {
				return false;
			}
			return (
				game.countPlayer2(current => {
					return current.hasHistory("damage", evt => {
						return evt.hasNature() && evt != event;
					});
				}) == 0
			);
		},
		logTarget: "player",
		check(event, player) {
			if (get.attitude(player, event.player) <= 2) {
				return false;
			}
			if (event.player.countCards("h") >= 4) {
				return false;
			}
			return true;
		},
		content() {
			player.executeDelayCardEffect("shandian");
			trigger.player.drawTo(4);
		},
		ai: { expose: 0.25 },
	},
	clanfenchai: {
		audio: 2,
		init(player) {
			if (player.getStorage("clanfenchai").length > 0) {
				return;
			}
			var history = player.getHistory("useSkill", evt => {
				if (evt.type != "player") {
					return false;
				}
				var skill = get.sourceSkillFor(evt),
					targets = evt.targets;
				var info = get.info(skill);
				if (!info || info.charlotte) {
					return false;
				}
				if (targets && targets.length) {
					if (targets.filter(i => player.differentSexFrom(i)).length > 0) {
						return true;
					}
				}
				return false;
			});
			if (history.length) {
				var evt = history[0],
					targets = evt.targets;
				player.markAuto(
					"clanfenchai",
					targets.filter(i => player.differentSexFrom(i))
				);
			}
		},
		trigger: {
			player: ["logSkillBegin", "useSkill"],
		},
		forced: true,
		silent: true,
		onremove: true,
		marktext: "钗",
		intro: {
			content: (storage, player) => "对象：" + get.translation(storage),
		},
		group: "clanfenchai_audio",
		filter(event, player) {
			if (event.type != "player") {
				return false;
			}
			var targets = event.targets;
			if (!targets || !targets.length) {
				return false;
			}
			var info = get.info(get.sourceSkillFor(event));
			if (!info || info.charlotte) {
				return false;
			}
			if (player.getStorage("clanfenchai").length != 0) {
				return false;
			}
			return targets.filter(i => player.differentSexFrom(i)).length > 0;
		},
		content() {
			player.markAuto(
				"clanfenchai",
				trigger.targets.filter(i => player.differentSexFrom(i))
			);
		},
		subSkill: {
			audio: {
				audio: "clanfenchai",
				forced: true,
				trigger: { player: "judge" },
				filter(event, player) {
					return player.getStorage("clanfenchai").length;
				},
				content() {},
			},
		},
		mod: {
			suit(card, suit) {
				var player = get.owner(card) || _status.event.player;
				if (!player || !player.judging || player.judging[0] != card) {
					return;
				}
				var storage = player.getStorage("clanfenchai");
				if (!storage.length) {
					return;
				}
				return storage.filter(i => i.isIn()).length > 0 ? "heart" : "spade";
			},
		},
	},
	//族荀采
	clanlieshi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return !player.isDisabledJudge() || player.countCards("h", card => ["sha", "shan"].includes(get.name(card))) > 0;
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("烈誓：选择一项", "hidden");
				dialog.add([lib.skill.clanlieshi.choices.slice(), "textbutton"]);
				return dialog;
			},
			filter(button, player) {
				var link = button.link;
				if (link == "damage") {
					return !player.isDisabledJudge();
				}
				var num = player.countCards("h", link);
				return num > 0 && num == player.getDiscardableCards(player, "h").filter(i => get.name(i) == link).length;
			},
			check(button) {
				var player = _status.event.player;
				switch (button.link) {
					case "damage":
						if (get.damageEffect(player, player, player, "fire") >= 0) {
							return 10;
						}
						if (player.hp >= Math.max(2, 3 - player.getFriends().length) && game.countPlayer(current => get.attitude(player, current) < 0 && current.countCards("h", card => ["sha", "shan"].includes(get.name(card))))) {
							return 0.8 + Math.random();
						}
						return 0;
					case "shan":
						if (player.countCards("h", "shan") == 1) {
							return 8 + Math.random();
						}
						return 1 + Math.random();
					case "sha":
						if (player.countCards("h", "sha") == 1) {
							return 8 + Math.random();
						}
						return 0.9 + Math.random();
				}
			},
			backup(links) {
				var next = get.copy(lib.skill["clanlieshi_backupx"]);
				next.choice = links[0];
				return next;
			},
			prompt(links) {
				if (links[0] == "damage") {
					return "废除判定区并受到1点火焰伤害";
				}
				return "弃置所有【" + get.translation(links[0]) + "】";
			},
		},
		choices: [
			["damage", "废除判定区并受到1点火焰伤害"],
			["shan", "弃置所有【闪】"],
			["sha", "弃置所有【杀】"],
		],
		ai: {
			order(item, player) {
				if (!player) {
					return;
				}
				var eff = get.damageEffect(player, player, player, "fire"),
					disabled = !player.isDisabledJudge();
				if ((player.countCards("h", "sha") == 1 || player.countCards("h", "shan") == 1) && eff < 0 && !disabled) {
					return 8;
				} else if (eff >= 0 && !disabled) {
					return 5.8;
				}
				if (!disabled && !player.countCards("h", card => ["sha", "shan"].includes(get.name(card)))) {
					if ((!player.hasSkill("clanhuanyin") || !player.canSave(player)) && player.hp <= 1) {
						return 0;
					}
					if (player.canSave(player) && player.hp == 1 && player.countCards("h") <= 1) {
						return 2.6;
					}
					if (player.hp < Math.max(2, 3 - player.getFriends().length) || !game.countPlayer(current => get.attitude(player, current) < 0 && current.countCards("h", card => ["sha", "shan"].includes(get.name(card))))) {
						return 0;
					}
				}
				return 2.5;
			},
			expose: 0.2,
			result: { player: 1 },
		},
		subSkill: {
			backup: {},
			backupx: {
				audio: "clanlieshi",
				selectCard: -1,
				selectTarget: -1,
				filterCard: () => false,
				filterTarget: () => false,
				multitarget: true,
				content() {
					"step 0";
					var choice = lib.skill.clanlieshi_backup.choice;
					event.choice = choice;
					if (choice == "damage") {
						player.damage("fire");
						if (!player.isDisabledJudge()) {
							player.disableJudge();
						}
					} else {
						var cards = player.getCards("h", choice);
						if (cards.length) {
							player.discard(cards);
						}
					}
					"step 1";
					if (!player.isIn() || !game.hasPlayer(current => current != player)) {
						event.finish();
					} else {
						player.chooseTarget("烈誓：令一名其他角色选择另一项", lib.filter.notMe, true).set("ai", target => {
							var player = _status.event.player,
								chosen = _status.event.getParent().choice,
								att = get.attitude(player, target);
							if (chosen == "damage") {
								if (att > 0) {
									return 0;
								}
								return -att / 2 + target.countCards("h", card => ["sha", "shan"].includes(get.name(card)));
							}
							return get.damageEffect(target, player, player, "fire");
						});
					}
					"step 2";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.line(target, "fire");
						var list = [],
							choice = event.choice;
						var choiceList = lib.skill.clanlieshi.choices.slice();
						choiceList = choiceList.map((link, ind, arr) => {
							link = link[1];
							var ok = true;
							if (arr[ind][0] == choice) {
								link += "（" + get.translation(player) + "已选）";
								ok = false;
							}
							if (ind == 0) {
								if (target.isDisabledJudge()) {
									ok = false;
								}
							} else if (ind > 0) {
								var name = ind == 1 ? "shan" : "sha";
								if (!target.countCards("h", name)) {
									ok = false;
								}
							}
							if (!ok) {
								link = '<span style="opacity:0.5">' + link + "</span>";
							} else {
								list.push("选项" + get.cnNumber(ind + 1, true));
							}
							return link;
						});
						if (!list.length) {
							game.log(target, "没有能执行的选项");
							event.finish();
							return;
						}
						target
							.chooseControl(list)
							.set("choiceList", choiceList)
							.set("ai", () => {
								var controls = _status.event.controls.slice(),
									player = _status.event.player,
									user = _status.event.getParent().player;
								if (controls.length == 1) {
									return controls[0];
								}
								if (controls.includes("选项一") && get.damageEffect(player, user, player, "fire") >= 0) {
									return "选项一";
								}
								if (controls.includes("选项一") && player.hp <= 2 && player.countCards("h", card => ["sha", "shan"].includes(get.name(card))) <= 3) {
									controls.remove("选项一");
								}
								if (controls.length == 1) {
									return controls[0];
								}
								if (player.getCards("h", "sha").reduce((p, c) => p + get.value(c, player), 0) > player.getCards("h", "sha").reduce((p, c) => p + get.value(c, player), 0)) {
									if (controls.includes("选项三")) {
										return "选项三";
									}
								} else if (controls.includes("选项二")) {
									return "选项二";
								}
								return controls.randomGet();
							});
					} else {
						event.finish();
					}
					"step 3";
					if (result.control == "选项一") {
						if (!target.isDisabledJudge()) {
							target.disableJudge();
						}
						target.damage("fire");
					} else {
						var cards = target.getCards("h", result.control == "选项二" ? "shan" : "sha");
						if (cards.length) {
							target.discard(cards);
						}
					}
				},
			},
		},
	},
	clandianzhan: {
		audio: 2,
		intro: {
			content: "已使用过的花色：$",
			onunmark: true,
		},
		trigger: { player: "useCardAfter" },
		forced: true,
		filter(event, player) {
			if (!lib.suit.includes(get.suit(event.card))) {
				return false;
			}
			const suit = get.suit(event.card);
			if (player.getRoundHistory("useCard", evt => get.suit(evt.card) == suit).indexOf(event) != 0) {
				return false;
			}
			return (event.targets && event.targets.length == 1 && !event.targets[0].isLinked()) || player.hasCard(card => get.suit(card) == get.suit(event.card) && player.canRecast(card), "h");
		},
		content() {
			"step 0";
			if (trigger.targets && trigger.targets.length == 1 && !trigger.targets[0].isLinked()) {
				trigger.targets[0].link(true);
				event.link = true;
			}
			var cards = player.getCards("h", card => get.suit(card) == get.suit(trigger.card) && player.canRecast(card));
			if (cards.length > 0) {
				player.recast(cards);
				event.recast = true;
			}
			"step 1";
			if (event.link && event.recast) {
				player.draw();
			}
		},
		group: "clandianzhan_count",
		subSkill: {
			count: {
				charlotte: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					let suit = get.suit(event.card);
					return lib.suits.includes(suit) && !player.getStorage("clandianzhan").includes(suit);
				},
				forced: true,
				silent: true,
				content() {
					let suits = player
						.getRoundHistory("useCard", evt => {
							return lib.suits.includes(get.suit(evt.card));
						})
						.reduce((list, evt) => {
							return list.add(get.suit(evt.card));
						}, [])
						.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
					if (!player.storage.clandianzhan) {
						player.when({ global: "roundStart" }).step(async () => {
							delete player.storage.clandianzhan;
							player.unmarkSkill("clandianzhan");
						});
					}
					player.storage.clandianzhan = suits;
					player.markSkill("clandianzhan");
				},
			},
		},
		init(player) {
			let suits = player
				.getRoundHistory("useCard", evt => {
					return lib.suits.includes(get.suit(evt.card));
				})
				.reduce((list, evt) => {
					return list.add(get.suit(evt.card));
				}, [])
				.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
			if (suits.length) {
				if (!player.storage.clandianzhan) {
					player.when({ global: "roundStart" }).step(async () => {
						delete player.storage.clandianzhan;
						player.unmarkSkill("clandianzhan");
					});
				}
				player.storage.clandianzhan = suits;
				player.markSkill("clandianzhan");
			}
		},
	},
	clanhuanyin: {
		audio: 2,
		trigger: { player: "dying" },
		forced: true,
		check: () => true,
		filter(event) {
			return event.player.countCards("h") < 4;
		},
		content() {
			player.drawTo(4);
		},
	},
	clandaojie: {
		audio: 2,
		audioname: ["clan_xunshu", "clan_xunchen", "clan_xuncai", "clan_xuncan", "clan_xunyou", "clan_xunyu"],
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return (
				get.type(event.card, null, false) == "trick" &&
				!get.tag(event.card, "damage") &&
				event.cards.filterInD().length > 0 &&
				player
					.getHistory("useCard", evt => {
						return get.type(evt.card, null, false) == "trick" && !get.tag(evt.card, "damage");
					})
					.indexOf(event) == 0
			);
		},
		forced: true,
		clanSkill: true,
		async content(event, trigger, player) {
			const skills = player.getSkills(null, false, false).filter(skill => {
				let info = get.info(skill);
				if (!info || info.charlotte || !get.is.locked(skill) || get.skillInfoTranslation(skill, player).length == 0) {
					return false;
				}
				return true;
			});
			let result;
			if (!skills.length) {
				result = { bool: false };
			} else {
				result = await player
					.chooseButton(["蹈节：失去一个锁定技，或点“取消”失去1点体力", [skills, "skill"]])
					.set("displayIndex", false)
					.set("ai", button => {
						const player = get.player();
						const skills = get.event().listx.slice();
						skills.removeArray(["clanbaichu"]);
						const { link } = button;
						if (!skills.includes(link)) {
							return 0;
						}
						const info = get.info(link);
						if (info?.ai?.neg || info?.ai?.halfneg) {
							return 3;
						}
						if (get.effect(player, { name: "losehp" }, player, player) >= 0 || player.hp > 3 || player.countCards("hs", card => player.canSaveCard(card, player))) {
							return 0;
						}
						if (Math.random() < 0.75 && link == "clandaojie") {
							if (player.hasSkill("clanbaichu")) return 0;
							return 2;
						}
						return 0;
					})
					.set("listx", skills)
					.forResult();
			}
			if (result?.bool && result?.links?.length) {
				await player.removeSkills(result.links);
			} else {
				await player.loseHp();
			}
			const targets = game.filterPlayer(current => current == player || current.hasClan("颍川荀氏"));
			if (!targets.length || !trigger.cards.someInD()) {
				return;
			}
			result =
				targets.length == 1
					? { bool: true, targets }
					: await player
							.chooseTarget("蹈节：将" + get.translation(trigger.cards.filterInD()) + "交给一名颍川荀氏角色", true, (card, player, target) => {
								return target == player || target.hasClan("颍川荀氏");
							})
							.set("ai", target => get.attitude(get.player(), target))
							.forResult();
			if (result?.bool && result?.targets?.length) {
				const target = result.targets[0];
				player.line(target, "green");
				if (trigger.cards.someInD()) {
					await target.gain(trigger.cards.filterInD(), player, "gain2");
				}
			}
		},
	},
	//族吴班
	clanzhanding: {
		audio: 2,
		enable: "chooseToUse",
		viewAsFilter(player) {
			return player.countCards("hes") > 0;
		},
		viewAs: { name: "sha" },
		filterCard: true,
		position: "hes",
		selectCard: [1, Infinity],
		check(card) {
			return 6 - ui.selected.cards.length - get.value(card);
		},
		allowChooseAll: true,
		onuse(links, player) {
			lib.skill.chenliuwushi.change(player, -1);
			player.addTempSkill("clanzhanding_effect");
		},
		ai: {
			order: 1,
			respondSha: true,
			skillTagFilter(player) {
				return player.countCards("hes") > 0;
			},
		},
		subSkill: {
			effect: {
				trigger: { player: "useCardAfter" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.skill == "clanzhanding";
				},
				content() {
					if (
						player.hasHistory("sourceDamage", function (evt) {
							return evt.card == trigger.card;
						})
					) {
						var num1 = player.countCards("h"),
							num2 = player.getHandcardLimit();
						if (num1 < num2) {
							player.draw(num2 - num1);
						}
					} else if (trigger.addCount !== false) {
						trigger.addCount = false;
						const stat = player.getStat().card,
							name = trigger.card.name;
						if (typeof stat[name] == "number") {
							stat[name]--;
						}
					}
				},
			},
		},
	},
	//族吴苋
	clanyirong: {
		audio: 2,
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			var num1 = player.countCards("h"),
				num2 = player.getHandcardLimit();
			return num1 != num2;
		},
		selectCard() {
			var player = _status.event.player;
			var num1 = player.countCards("h"),
				num2 = player.getHandcardLimit();
			if (num1 > num2) {
				return num1 - num2;
			}
			return [0, 1];
		},
		filterCard(card, player) {
			var num1 = player.countCards("h"),
				num2 = player.getHandcardLimit();
			return num1 > num2;
		},
		check(card) {
			var player = _status.event.player;
			if (
				player.countCards("h", function (card) {
					return lib.skill.clanyirong.checkx(card) > 0;
				}) +
					1 <
				player.countCards("h") - player.getHandcardLimit()
			) {
				return 0;
			}
			return lib.skill.clanyirong.checkx(card);
		},
		checkx(card) {
			var num = 1;
			if (_status.event.player.getUseValue(card, null, true) <= 0) {
				num = 1.5;
			}
			return (15 - get.value(card)) * num;
		},
		prompt() {
			var player = _status.event.player;
			var num1 = player.countCards("h"),
				num2 = player.getHandcardLimit();
			var str = '<span class="text center">';
			if (num1 > num2) {
				str += "弃置" + get.cnNumber(num1 - num2) + "张牌，然后手牌上限+1。";
			} else {
				str += "摸" + get.cnNumber(num2 - num1) + "张牌，然后手牌上限-1。";
			}
			str += "<br>※当前手牌上限：" + num2;
			var num3 = (_status.event.getParent().phaseIndex || 0) + 1;
			if (num3 > 0) {
				str += "；阶段数：" + num3;
			}
			str += "</span>";
			return str;
		},
		content() {
			"step 0";
			if (cards.length) {
				lib.skill.chenliuwushi.change(player, 1);
				event.finish();
			} else {
				var num1 = player.countCards("h"),
					num2 = player.getHandcardLimit();
				if (num1 < num2) {
					player.draw(num2 - num1);
				}
			}
			"step 1";
			lib.skill.chenliuwushi.change(player, -1);
		},
		ai: {
			order(item, player) {
				var num = player.getHandcardLimit(),
					numx = (_status.event.getParent().phaseIndex || 0) + 1;
				if (num == 5 && numx == 4 && player.getStat("skill").clanyirong) {
					return 0;
				}
				if (player.countCards("h") == num + 1 && num != 2 && (num <= 4 || (num > 4 && numx > 4))) {
					return 10;
				}
				return 0.5;
			},
			result: { player: 1 },
			threaten: 5,
		},
	},
	clanguixiang: {
		audio: 2,
		trigger: { player: "phaseChange" },
		forced: true,
		filter(event, player) {
			if (event.phaseList[event.num].startsWith("phaseUse")) {
				return false;
			}
			const num1 = player.getHandcardLimit() - 1,
				num2 = event.num - player.getHistory("skipped").length;
			return num1 == num2;
		},
		content() {
			trigger.phaseList[trigger.num] = `phaseUse|${event.name}`;
			game.delayx();
		},
	},
	clanmuyin: {
		audio: 2,
		clanSkill: true,
		audioname: ["clan_wuxian", "clan_wuban", "clan_wukuang", "clan_wuqiao"],
		trigger: { player: "phaseBegin" },
		isMax(player) {
			var num = player.getHandcardLimit();
			return !game.hasPlayer(function (current) {
				return current != player && current.getHandcardLimit() > num;
			});
		},
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return (current == player || current.hasClan("陈留吴氏")) && !lib.skill.clanmuyin.isMax(current);
			});
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("clanmuyin"), "令一名陈留吴氏角色的手牌上限+1", function (card, player, current) {
					return (current == player || current.hasClan("陈留吴氏")) && !lib.skill.clanmuyin.isMax(current);
				})
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("clanmuyin", target);
				lib.skill.chenliuwushi.change(target, 1);
				game.delayx();
			}
		},
	},
	chenliuwushi: {
		charlotte: true,
		change(player, num) {
			player.addSkill("chenliuwushi");
			var info = player.storage;
			if (typeof info.chenliuwushi != "number") {
				info.chenliuwushi = 0;
			}
			info.chenliuwushi += num;
			if (info.chenliuwushi == 0) {
				player.unmarkSkill("chenliuwushi");
			} else {
				player.markSkill("chenliuwushi");
			}
			if (num >= 0) {
				game.log(player, "的手牌上限", "#y+" + num);
			} else {
				game.log(player, "的手牌上限", "#g" + num);
			}
		},
		mod: {
			maxHandcard(player, num) {
				var add = player.storage.chenliuwushi;
				if (typeof add == "number") {
					return num + add;
				}
			},
		},
		markimage: "image/card/handcard.png",
		intro: {
			content(num, player) {
				var str = "<li>手牌上限";
				if (num >= 0) {
					str += "+";
				}
				str += num;
				str += "<br><li>当前手牌上限：";
				str += player.getHandcardLimit();
				return str;
			},
		},
	},
};

export default skills;
