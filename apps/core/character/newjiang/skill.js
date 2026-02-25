import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	youtan: {
		audio: 4,
		logAudio(event) {
			if (event.name == "useCardToTarget") {
				return ["youtan3.mp3", "youtan4.mp3"];
			}
			return 2;
		},
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
			target: "useCardToTarget",
		},
		filter(event, player, name) {
			if (name == "useCardToTarget") {
				if (event.player == player) {
					return false;
				}
				return !player.getStorage("youtan").includes(get.suit(event.card));
			}
			const evt = event.getParent("phaseUse", true);
			if (evt && evt.player == player) {
				return false;
			}
			const cards = event.getg(player);
			return cards?.length && cards.some(card => !player.getStorage("youtan").includes(get.suit(card)));
		},
		intro: {
			content: "已记录花色:$",
		},
		forced: true,
		onremove(player, skill) {
			player.removeTip(skill);
			player.setStorage(skill, []);
		},
		async content(event, trigger, player) {
			if (event.triggername == "useCardToTarget") {
				const eff = get.effect(player, trigger.card, trigger.player, trigger.player);
				const result = await trigger.player
					.chooseToDiscard(`忧叹：弃置一张牌，否则${get.translation(trigger.card)}对${get.translation(player)}无效`, "he")
					.set("ai", card => {
						const { eff } = get.event();
						if (eff > 0) {
							return 10 - get.value(card);
						}
						return 0;
					})
					.set("eff", eff)
					.forResult();
				if (!result?.bool) {
					trigger.getParent().excluded.add(player);
				}
			} else {
				const suits = trigger
					.getg(player)
					.map(card => get.suit(card))
					.removeArray(player.getStorage(event.name));
				if (suits?.length) {
					player.markAuto(event.name, suits);
					player.addTip(
						event.name,
						`忧叹${player
							.getStorage(event.name)
							.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a))
							.map(i => get.translation(i))
							.join("")}`
					);
				}
			}
		},
		mod: {
			cardEnabled(card, player) {
				if (!player.isPhaseUsing() || get.suit(card) == "unsure") {
					return;
				}
				if (!player.getStorage("youtan").includes(get.suit(card))) {
					return false;
				}
			},
			cardSavable(card, player) {
				if (!player.isPhaseUsing() || get.suit(card) == "unsure") {
					return;
				}
				if (!player.getStorage("youtan").includes(get.suit(card))) {
					return false;
				}
			},
		},
	},
	ciren: {
		audio: 2,
		global: "ciren_global",
		subSkill: {
			global: {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter(event, player) {
					if (!player.countCards("he")) {
						return false;
					}
					return game.hasPlayer(current => {
						return current != player && current.hasSkill("ciren");
					});
				},
				async cost(event, trigger, player) {
					const targets = game.filterPlayer(current => current != player && current.hasSkill("ciren"));
					event.result = await player
						.chooseCardTarget({
							prompt: get.prompt("ciren"),
							prompt2: `将一张牌交给${get.translation(targets)}${targets.length > 1 ? "中的一人" : ""}，令其交给你另一张同花色牌，或你摸一张牌`,
							position: "he",
							filterCard: true,
							filterTarget(card, player, target) {
								return get.event().targetx.includes(target);
							},
							targetx: targets,
							ai1(card) {
								return 6 - get.value(card);
							},
							ai2(target) {
								const player = get.player();
								return get.attitude(player, target);
							},
						})
						.forResult();
					event.result.skill_popup = false;
				},
				async content(event, trigger, player) {
					const {
							cards,
							targets: [target],
						} = event,
						suit = get.suit(cards[0]);
					await target.logSkill("ciren", player);
					await player.give(cards, target);
					const result = await target
						.chooseToGive(player, `交给${get.translation(player)}另一张${get.translation(suit)}牌，否则其摸一张牌`, "he")
						.set("filterCard", card => {
							const { player, preCards, suit } = get.event();
							return !preCards.includes(card) && get.suit(card) == suit;
						})
						.set("ai", card => {
							const { player, att } = get.event(),
								value = get.value(card);
							if (value <= 0 && att <= 0) {
								return 10;
							}
							if (value > 15 && att > 0) {
								return 10;
							}
							return 0;
						})
						.set("att", get.attitude(target, player))
						.set("preCards", cards)
						.set("suit", suit)
						.forResult();
					if (!result?.bool) {
						await player.draw();
					}
				},
			},
		},
	},
	zhancai: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.getStorage("youtan").length;
		},
		prompt() {
			const num = get.player().getStorage("youtan").length;
			return `摸${get.cnNumber(num)}张牌，然后移去一个记录的花色`;
		},
		manualConfirm: true,
		async content(event, trigger, player) {
			const skill = "youtan";
			await player.draw(player.getStorage(skill).length);
			const list = player.getStorage(skill);
			if (!list?.length) {
				return;
			}
			const result = await player
				.chooseButton(["展才：移去一个花色", [list.map(suit => ["", "", `lukai_${suit}`]), "vcard"]], true)
				.set("ai", button => {
					const player = get.player(),
						suit = button.link[2].slice(6);
					const num = player.countCards("hs", card => {
						return get.suit(card) == suit && player.hasValueTarget(card);
					});
					if (num > 0) {
						return 1 / num;
					}
					return 2;
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				player.unmarkAuto(
					skill,
					result.links.map(i => i[2].slice(6))
				);
				player.addTip(
					skill,
					`忧叹${player
						.getStorage(skill)
						.map(i => get.translation(i))
						.join("")}`
				);
			}
		},
		ai: {
			order: 9,
			combo: "youtan",
			result: {
				player(player) {
					return player.getStorage("youtan").filter(suit => {
						return (
							player.countCards("hs", card => {
								return get.suit(card) == suit && player.hasValueTarget(card);
							}) === 0
						);
					}).length;
				},
			},
		},
	},
	tenggu: {
		audio: 2,
		trigger: {
			player: "dying",
		},
		init(player, skill) {
			player.addExtraEquip(skill, "tengjia", true, player => lib.card.tengjia);
		},
		onremove(player, skill) {
			player.removeExtraEquip(skill);
		},
		filter(event, player) {
			if (!event.reason) {
				return false;
			}
			const reason = event.reason;
			return reason.name == "damage" && !reason.hasNature("fire");
		},
		forced: true,
		async content(event, trigger, player) {
			await player.loseMaxHp();
			await player.recoverTo(player.maxHp);
		},
		mod: {
			targetEnabled(card, player, target) {
				if (get.subtypes(card)?.includes("equip2")) {
					return false;
				}
			},
		},
		group: ["tenggu_tengjia", "tenggu_noequip"],
		subSkill: {
			noequip: {
				audio: "tenggu",
				trigger: {
					player: "equipBefore",
				},
				filter(event, player) {
					return get.subtypes(event.card)?.includes("equip2");
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.cancel();
					if (trigger.cards?.length) {
						const map = new Map(),
							targets = [];
						for (const card of trigger.cards) {
							const owner = get.owner(card);
							if (owner) {
								targets.add(owner);
								map.set(owner, (map.get(owner) ?? []).concat([card]));
							}
						}
						if (targets.length) {
							await game
								.loseAsync({
									map: map,
									targets: targets,
									cards: trigger.cards,
								})
								.setContent(async (event, trigger, player) => {
									const { map, targets, cards } = event;
									for (const target of targets) {
										const lose = map.get(target);
										const next = target.lose(lose, ui.discardPile);
										next.getlx = false;
										await next;
									}
									game.log(cards, "进入了弃牌堆");
								});
						}
					}
				},
			},
			tengjia: {
				trigger: {
					target: ["useCardToBefore", "shaBefore"],
					player: "damageBegin3",
				},
				equipSkill: true,
				forced: true,
				priority: 6,
				audio: "tengjia",
				logAudio(event) {
					return `tengjia${event.name == "damage" ? 2 : 1}.mp3`;
				},
				filter(event, player, name) {
					if (player.hasSkillTag("unequip2")) {
						return false;
					}
					const owner = event[event.name == "damage" ? "source" : "player"];
					if (
						owner?.hasSkillTag("unequip", false, {
							name: event.card ? event.card.name : null,
							target: player,
							card: event.card,
						})
					) {
						return false;
					}
					if (name == "shaBefore") {
						return event.card.name == "sha" && !game.hasNature(event.card);
					}
					if (event.name == "damage") {
						return game.hasNature(event, "fire");
					}
					return ["wanjian", "nanman"].includes(event.card.name);
				},
				async content(event, trigger, player) {
					if (trigger.name == "damage") {
						trigger.num++;
					} else {
						trigger.cancel();
					}
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (target.hasSkillTag("unequip2")) {
								return;
							}
							if (
								player.hasSkillTag("unequip", false, {
									name: card ? card.name : null,
									target: target,
									card: card,
								}) ||
								player.hasSkillTag("unequip_ai", false, {
									name: card ? card.name : null,
									target: target,
									card: card,
								})
							) {
								return;
							}
							if (card.name == "nanman" || card.name == "wanjian") {
								return "zeroplayertarget";
							}
							if (card.name == "sha") {
								if (game.hasNature(card, "fire")) {
									return 2;
								}
								if (player.hasSkill("zhuque_skill")) {
									return 1.9;
								}
								if (!game.hasNature(card)) {
									return "zeroplayertarget";
								}
							}
							if (get.tag(card, "fireDamage") && current < 0) {
								return 2;
							}
						},
					},
				},
			},
		},
	},
	dunyong: {
		audio: 2,
		trigger: {
			source: "damageBegin4",
			global: "dying",
		},
		filter(event, player) {
			if (event.name == "damage") {
				if (event.player == player || player.isMinMaxHp(true)) {
					return false;
				}
				return true;
			}
			return event.player.maxHp > 0;
		},
		priority: 1,
		forced: true,
		locked: false,
		logTarget: "player",
		async content(event, trigger, player) {
			const name = event.name;
			if (trigger.name == "damage") {
				await player.damage(trigger.num, "nosource", "nocard");
			} else {
				await player.draw(trigger.player.maxHp);
				player.addTip(name, "钝勇 无限制");
				player
					.when({
						global: ["phaseBefore", "phaseAfter"],
					})
					.step(async (event, trigger, player) => {
						player.removeTip(name);
					})
					.assign({
						mod: {
							cardUsable: () => Infinity,
							targetInRange: () => true,
						},
					});
			}
		},
	},
	bingling: {
		audio: 2,
		trigger: { player: ["useCardToPlayer"] },
		filter(event, player) {
			return event.card.name == "sha" && event.target.countDiscardableCards(player, "he") >= 2;
		},
		logTarget: "target",
		async cost(event, trigger, player) {
			const target = trigger.target;
			event.result = await player.discardPlayerCard(target, "he", get.prompt2(event.skill), 2).set("chooseonly", true).forResult();
		},
		async content(event, trigger, player) {
			await trigger.target.modedDiscard(event.cards, player);
			if (event.cards.length > 1) {
				const card = event.cards[0],
					cardx = event.cards[1];
				let num = 0;
				if (get.type2(card, false) == get.type2(cardx, false)) {
					await player.gain(event.cards, "gain2");
					num++;
				}
				if (get.suit(card, false) == get.suit(cardx, false)) {
					await player.recover();
					num++;
				}
				if (get.cardNameLength(card, false) == get.cardNameLength(cardx, false)) {
					await player.draw(get.cardNameLength(card));
					num++;
				}
				if (get.number(card, false) == get.number(cardx, false)) {
					await trigger.target.loseHp(trigger.target.getHp());
					num++;
				}
				if (num == 0) {
					await player.damage(1, "fire", "nosource");
				}
			}
		},
	},
	renjia: {
		trigger: {
			player: ["damageBegin3", "damageAfter"],
			source: ["damageSource"],
		},
		forced: true,
		filter(event, player, triggername) {
			if (triggername == "damageBegin3") {
				if (!event.hasNature()) {
					return (
						game
							.getRoundHistory(
								"everything",
								evt => {
									return evt.name == "damage" && evt.player == player && !evt.hasNature();
								},
								0,
								false,
								event
							)
							.indexOf(event) < 2
					);
				}
				return event.hasNature("fire");
			}
			return event.hasNature();
		},
		async content(event, trigger, player) {
			if (event.triggername == "damageBegin3") {
				if (trigger.hasNature("fire")) {
					trigger.num++;
				} else {
					trigger.num--;
				}
			} else if (trigger.hasNature()) {
				await player.draw();
			}
		},
		group: ["renjia_gain"],
		subSkill: {
			gain: {
				trigger: { player: ["expandEquipBegin", "enableEquipBegin"] },
				forced: true,
				init(player, skill) {
					player.disableEquip(2);
				},
				onremove(player, skill) {
					player.enableEquip(2);
				},
				filter(event, player) {
					return event.slots.includes("equip2");
				},
				async content(event, trigger, player) {
					trigger.slots.remove("equip2");
					if (trigger.slots.length == 0) {
						trigger.cancel();
					}
				},
			},
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "fireDamage")) {
						return [1, 0, 1, -3];
					}
					if (!get.natureList(card).length && target.getRoundHistory("damage", evt => evt.hasNature()).length < 2) {
						return [1, -1];
					}
				},
			},
		},
	},
	yj_yanyu: {
		enable: ["phaseUse"],
		limited: true,
		lose: false,
		discard: false,
		selectCard: 2,
		check(card) {
			if (ui.selected.cards.some(cardx => get.suit(cardx) == get.suit(card))) {
				return 0;
			}
			return 1;
		},
		filterCard: () => true,
		filter(event, player) {
			return player.countCards("h") >= 2;
		},
		filterTarget(card, player, target) {
			return target != player;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.showCards(event.cards);
			const card = get.cardPile2("tengjia"),
				suits = event.cards.map(card => get.suit(card));
			if (card && event.targets[0].canEquip("tengjia", true)) {
				await event.targets[0].equip(card);
			} else {
				player.popup("杯具");
			}
			player.addSkill("yj_yanyu_use");
			const targets = game.filterPlayer(curr => curr != event.targets[0]);
			targets.forEach(curr => {
				curr.markAuto("yj_yanyu_fire", suits);
				const list = curr.getStorage("yj_yanyu_source");
				list.add(player);
				curr.setStorage("yj_yanyu_source", list);
				curr.addSkill("yj_yanyu_fire");
			});
		},
		subSkill: {
			use: {
				forced: true,
				charlotte: true,
				trigger: { global: ["useCardAfter"] },
				filter(event, player) {
					if (!event.player.getStorage("yj_yanyu_source").includes(player)) {
						return false;
					}
					const suits = event.cards.map(card => get.suit(card, false));
					return event.player.getStorage("yj_yanyu_fire").some(suit => suits.includes(suit)) && ["basic", "trick", "equip"].includes(get.type2(event.card, false));
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
			fire: {
				marktext: "焰",
				charlotte: true,
				intro: {
					name: "焰狱",
					mark(dialog, storage, player) {
						const str = get.translation(storage).split("、"),
							sources = get.translation(player.getStorage("yj_yanyu_source")).split("、");
						dialog.addText(`${str}花色的手牌遵循:基本牌:火杀,锦囊牌:火攻,装备牌:铁索连环且使用后${sources}摸一张牌`);
					},
				},
				mod: {
					cardname(card, player, name) {
						const suits = player.getStorage("yj_yanyu_fire"),
							suit = get.suit(card);
						if (!suits.includes(suit)) {
							return;
						}
						if (get.type(name, null, false) == "basic") {
							return "sha";
						} else if (get.type2(name, false) == "trick") {
							return "huogong";
						} else if (get.type(name, null, false) == "equip") {
							return "tiesuo";
						}
					},
					cardnature(card, player) {
						const suits = player.getStorage("yj_yanyu_fire"),
							suit = get.suit(card, false);
						if (suits.includes(suit) && get.type(card, null, false) == "basic") {
							return "fire";
						}
					},
				},
			},
		},
		ai: {
			order: 10,
			result: {
				player: 1,
				target: -1,
			},
		},
	},
	biancai: {
		trigger: {
			global: ["phaseBegin"],
		},
		check(event, player) {
			return true;
		},
		filter(event, player) {
			return true;
		},
		async content(event, trigger, player) {
			const result = await player.judge().forResult();
			if (result?.color == "red") {
				const card = get.cardPile(card => get.type(card) == "equip", "cardPile");
				await player.gain(card, "gain2");
			} else if (result?.color == "black") {
				const card = get.cardPile(card => get.type(card) == "equip", "discardPile");
				await player.gain(card, "gain2");
			} else {
				player.popup("杯具");
			}
		},
	},
	cuiren: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: () => false,
		selectTarget: 0,
		position: "he",
		filterCard(card, player) {
			return get.type(card) == "equip" && lib.filter.cardDiscardable(card, player, "cuiren");
		},
		filter(event, player) {
			return player.countCards("he", card => get.type(card) == "equip") > 0;
		},
		check(card) {
			if (get.subtype(card) == "equip5") {
				return 0;
			}
			return 20 - get.value(card);
		},
		async content(event, trigger, player) {
			const type = get.subtype(event.cards[0]);
			if (type == "equip1") {
				player.addTempSkill("cuiren_effect1");
			} else if (type == "equip2") {
				player.addTempSkill("cuiren_effect2");
			} else if (parseInt(type.slice(-1)) > 4) {
				player.popup("杯具");
			} else {
				player.addTempSkill("cuiren_effect3");
			}
		},
		subSkill: {
			effect1: {
				charlotte: true,
				mod: {
					targetInRange(card, player) {
						return true;
					},
					cardUsable(card, player) {
						return Infinity;
					},
				},
			},
			effect2: {
				trigger: {
					player: ["useCard"],
				},
				charlotte: true,
				forced: true,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
				},
				ai: {
					directHit_ai: true,
				},
			},
			effect3: {
				trigger: {
					player: ["useCard2"],
				},
				filter(event, player) {
					if (!["basic", "trick"].includes(get.type(event.card)) || !event.targets?.length) {
						return false;
					}
					return game.hasPlayer(current => {
						if (event.targets.includes(current)) {
							return false;
						}
						return lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
					});
				},
				charlotte: true,
				async cost(event, trigger, player) {
					const targets = game.filterPlayer(current => {
						if (trigger.targets.includes(current)) {
							return false;
						}
						return lib.filter.targetEnabled2(trigger.card, player, current) && lib.filter.targetInRange(trigger.card, player, current);
					});
					if (!targets?.length) {
						return;
					}
					event.result = await player
						.chooseTarget(`为${get.translation(trigger.card)}额外指定任意目标`)
						.set("ai", target => {
							const player = get.player(),
								trigger = get.event().getTrigger();
							return get.effect(target, trigger.card, player, player);
						})
						.set("targetx", targets)
						.set("filterTarget", (card, player, target) => {
							return get.event().targetx.includes(target);
						})
						.set("selectTarget", [1, Infinity])
						.forResult();
				},
				async content(event, trigger, player) {
					trigger.targets.addArray(event.targets);
				},
			},
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	shenfeng: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return get.name(event.card) == "sha" && player.countCards("he", card => get.type(card) == "equip") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill), "he", card => {
					return get.type(card) == "equip";
				})
				.set("ai", card => {
					const player = get.player();
					if (get.name(card) == "muniu" && player.countCards("h") > 3) {
						return 0;
					}
					return 6 - get.value(card);
				})
				.set("chooseonly", true)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			const result = await player
				.chooseButton([
					"神锋：请选择一项",
					[
						[
							["damage", "此【杀】伤害+1"],
							["losehp", "令此【杀】造成的伤害视为失去体力"],
							["discard", "令目标角色弃置两张牌"],
						],
						"textbutton",
					],
				])
				.set("forced", true)
				.set("filterButton", button => {
					const { target, evt } = get.event();
					if (button.link == "discard") {
						return target.countCards("he") > 0;
					}
					if (button.link == "losehp") {
						return !evt.yjspshenfeng;
					}
					return true;
				})
				.set("target", trigger.target)
				.set("evt", trigger.getParent())
				.set("ai", button => Math.random())
				.forResult();
			if (!result?.links?.length) {
				return;
			}
			if (result.links[0] == "damage") {
				trigger.getParent().baseDamage++;
			} else if (result.links[0] == "losehp") {
				trigger.getParent().yjspshenfeng = true;
				if (!player.hasSkill("shenfeng_effect", null, false, false)) {
					player.addTempSkill("shenfeng_effect");
				}
			} else {
				await trigger.target.chooseToDiscard(2, "he", true);
			}
		},
		subSkill: {
			effect: {
				trigger: { source: "damageBefore" },
				charlotte: true,
				forced: true,
				popup: false,
				filter(event, player) {
					return event.getParent(2).yjspshenfeng;
				},
				async content(event, trigger, player) {
					trigger.cancel();
					await trigger.player.loseHp(trigger.num);
				},
			},
		},
	},
	pyhuanling: {
		trigger: { player: ["phaseUseBegin", "damageEnd"] },
		filter(event, player) {
			return player.countCards("hes") > 0;
		},
		check(event, player) {
			return true;
		},
		init(player, skill) {
			if (!_status.bingzhuSkill) {
				const bingzhuSkill = {};
				Object.keys(lib.card)
					.filter(name => get.type(name) == "equip" && get.bingzhu(name).length)
					.map(name => get.bingzhu(name))
					.flat()
					.forEach(name => (bingzhuSkill[name] = []));
				if (!_status.characterlist) {
					game.initCharacterList();
				}
				_status.characterlist.map(character => {
					const names = get
							.characterSurname(character)
							.map(info => info.join(""))
							.concat([get.rawName(character)]),
						skills = get.character(character, 3);
					names.forEach(name => {
						if (bingzhuSkill[name]) {
							bingzhuSkill[name].addArray(skills);
						}
					});
				});
				for (let name in bingzhuSkill) {
					bingzhuSkill[name] = bingzhuSkill[name].randomSort();
				}
				game.broadcastAll(bingzhuSkill => (_status.bingzhuSkill = bingzhuSkill), new Map(Object.entries(bingzhuSkill)));
			}
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), lib.filter.cardRecastable, "he")
				.set("ai", card => 10 - get.value(card))
				.forResult();
		},
		async content(event, trigger, player) {
			await player.recast(event.cards);
			const suitx = get.suit(event.cards[0]);
			const card = get.cardPile(card => get.suit(card) == suitx && get.type(card) == "equip", "field");
			if (!card) {
				player.chat("谁偷走了我的装备牌！");
				return;
			}
			await player.gain(card, "gain2");
			const result = await player
				.chooseTarget("选择一名角色获得技能")
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target);
				})
				.set("forced", true)
				.forResult();
			const name = get.bingzhu(card).randomGet();
			if (!result?.targets?.length) {
				return;
			}
			const [target] = result.targets;
			const skills = get
				.bingzhu(card)
				.map(name => _status.bingzhuSkill.get(name))
				.flat()
				.filter(skill => !target.hasSkill(skill, null, false, false))
				.randomGets(3);
			if (!skills.length) {
				player.chat("没有技能喵");
			} else {
				const result = await player
					.chooseButton([`选择一个技能令${get.translation(target)}获得`, [skills, "skill"]])
					.set("ai", button => {
						return get.priority(button.link);
					})
					.set("forced", true)
					.forResult();
				if (result?.links?.length) {
					await target.addSkills(result.links[0]);
				}
			}
			if (target != player) {
				await player.draw(
					target.getSkills(null, false, false).filter(skill => {
						const info = get.info(skill);
						return info && !info.charlotte && get.skillInfoTranslation(skill, target).length;
					}).length
				);
			}
		},
	},
	pyshenduan: {
		trigger: {
			player: "useCardAfter",
		},
		init(player, skill) {
			player.storage.pyshenduan_effect = new Map([
				[
					"equip1",
					async player => {
						const card = get.autoViewAs({
							name: "sha",
							isCard: true,
						});
						await player.chooseUseTarget(card, false);
					},
				],
				[
					"equip2",
					async player => {
						await player.gainMaxHp();
						await player.recover();
					},
				],
				[
					"equip3",
					async player => {
						await player.draw();
						player.addMark("pyshenduan_max", 1, false);
					},
				],
				[
					"equip4",
					async player => {
						const targets = game.filterPlayer(curr => curr != player);
						await game.doAsyncInOrder(targets, async target => {
							await player.discardPlayerCard(target, true, "he");
						});
					},
				],
			]);
			player.addSkill("pyshenduan_max");
		},
		check(event, player) {
			if (get.subtypes(event.card)?.includes("equip4") && game.countPlayer(curr => curr != player && get.attitude(player, curr) > 0) - game.countPlayer(curr => get.attitude(player, curr) < 0) > 0) {
				return false;
			}
			return true;
		},
		filter(event, player) {
			if (get.type(event.card) != "equip" || get.subtype(event.card) == "equip5") {
				return false;
			}
			const subtypes = player.getStorage("pyshenduan_used");
			return !get.subtypes(event.card).every(type => subtypes.includes(type));
		},
		forced: true,
		async content(event, trigger, player) {
			const types = get.subtypes(trigger.card);
			const subtypes = (player.getStorage("pyshenduan_used") || []).addArray(types);
			player.markAuto("pyshenduan_used", subtypes);
			if (!player.hasSkill("pyshenduan_used", null, false, false)) {
				player.addTempSkill("pyshenduan_used");
			}
			for (let type of types) {
				await player.storage.pyshenduan_effect.get(type)(player);
			}
		},
		subSkill: {
			max: {
				charlotte: true,
				marktext: "神锻",
				mark: true,
				intro: {
					name: "神锻",
					mark(dialog, storage) {
						if (!storage) {
							dialog.addText("手牌上限+0");
						} else {
							dialog.addText(`手牌上限+${storage}`);
						}
					},
				},
				mod: {
					maxHandcard: function (player, num) {
						return num + player.countMark("pyshenduan_max");
					},
				},
			},
			used: {
				charlotte: true,
				marktext: "神锻",
				onremove: true,
				intro: {
					name: "神锻",
					mark(dialog, storage) {
						const text = storage.map(type => `${get.translation(type)}`).join("、");
						dialog.addText("神锻使用过的类型:" + "<br>");
						dialog.addText(text);
					},
				},
			},
		},
	},
	//爻袁术
	dcwangyao: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.name.startsWith("useCard")) {
				if (event.player == player) {
					return false;
				}
				if (event.card?.name != "sha" && get.type(event.card) != "trick") {
					return false;
				}
				return ["dcwangyao_marka", "dcwangyao_markb"].every(mark => player.hasSkill(mark));
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			if (trigger.name.startsWith("useCard")) {
				const list = ["dcwangyao_marka", "dcwangyao_markb"].map(mark => {
					const type = player.getStorage(mark, false);
					return [mark, "", type ? "阳" : "阴"];
				});
				const result = await player
					.chooseButton([
						"妄爻：是否翻转一枚爻？",
						[
							list,
							(item, type, position, noclick, node) => {
								node = ui.create.buttonPresets.vcard(item, "vcard", position, noclick, node);
								node.owner = get.player();
								node._customintro = function (uiintro, evt) {
									const yao = node.owner?.getStorage(node.link[2], false);
									uiintro.add(`${yao ? "阳" : "阴"}爻`);
								};
								return node;
							},
						],
					])
					.set("ai", button => {
						if (button.link[2] == true) {
							return 1;
						}
						return 2;
					})
					.forResult();
				if (result.bool) {
					event.result = {
						bool: true,
						cost_data: result.links[0],
					};
				}
			} else {
				event.result = {
					bool: true,
				};
			}
		},
		async content(event, trigger, player) {
			if (trigger.name.startsWith("useCard")) {
				const [mark, trash, type] = event.cost_data;
				game.log(player, "翻转了一枚", type, "爻");
				get.info(event.name).setType(player, mark, type != "阳");
				const list = ["dcwangyao_marka", "dcwangyao_markb"];
				if (player.getStorage(list[0], false) == player.getStorage(list[1], false)) {
					await player.draw();
				}
				return;
			}
			player.addSkill("dcwangyao_marka");
			player.addSkill("dcwangyao_markb");
		},
		setType(player, skill, type) {
			player.setStorage(skill, type);
			player.markSkill(skill);
			game.broadcastAll(
				(player, skill, type) => {
					const color = type ? "black" : "white",
						bgColor = type ? "rgb(255, 255, 255)" : "rgba(1, 1, 1, 0.9)";
					const text = `<span style="color: ${color}">爻</span>`;
					if (player.marks[skill]) {
						player.marks[skill].firstChild.style.backgroundColor = bgColor;
						player.marks[skill].firstChild.innerHTML = text;
					}
				},
				player,
				skill,
				type
			);
		},
		subSkill: {
			marka: {
				init(player, skill) {
					get.info("dcwangyao").setType(player, skill, true);
				},
				mark: true,
				marktext: "爻",
				intro: {
					content(storage, player) {
						const color = storage ? "gold" : "gray",
							name = storage ? "阳" : "阴";
						return `此爻为<span style="color: ${color}">${name}爻</span>`;
					},
				},
				onremove: true,
			},
			markb: {
				init(player, skill) {
					get.info("dcwangyao").setType(player, skill, false);
				},
				mark: true,
				marktext: "爻",
				intro: {
					content(storage, player) {
						const color = storage ? "gold" : "gray",
							name = storage ? "阳" : "阴";
						return `此爻为<span style="color:${color}">${name}爻</span>`;
					},
				},
				onremove: true,
			},
		},
	},
	dczengua: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		filterCard: true,
		async content(event, trigger, player) {
			const target = event.target;
			const result = await player
				.chooseButton(
					[
						`猜测${get.translation(target)}手牌中某种类型的牌是否为全场最多`,
						[
							["basic", "trick", "equip"].map(type => {
								return ["", "", `caoying_${type}`];
							}),
							"vcard",
						],
						[
							[
								["isMax", "全场最多"],
								["notMax", "不为最多"],
							],
							"tdnodes",
						],
					],
					2,
					true
				)
				.set("filterButton", button => {
					if (ui.selected.buttons?.length) {
						return typeof button.link == "string";
					}
					return typeof button.link != "string";
				})
				.set("complexSelect", true)
				.set("ai", button => {
					//花里胡哨一看战绩0.5
					return Math.random();
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			const type = result.links[0][2].slice(8),
				isMax = result.links[1] == "isMax";
			const count = current => current.countCards("h", card => get.type2(card) == type),
				bool = !game.hasPlayer(current => {
					return count(current) > count(target);
				});
			if (isMax == bool) {
				player.popup("洗具", "wood");
				if (!target.countGainableCards(player, "h", card => get.type2(card) == type)) {
					return;
				}
				await player
					.gainPlayerCard(target, "h", true)
					.set("filterButton", button => {
						return get.type2(button.link) == get.event().cardType;
					})
					.set("cardType", type);
			} else {
				player.popup("杯具", "fire");
				await target.draw();
				const list = ["dcwangyao_marka", "dcwangyao_markb"].map(mark => {
					const type = player.getStorage(mark, false);
					return [mark, "", type ? "阳" : "阴"];
				});
				if (
					!list.every(info => {
						return typeof player.storage[info[0]] == "boolean";
					})
				) {
					return;
				}
				const result2 = await player
					.chooseButton(
						[
							"谮卦：翻转一枚爻",
							[
								list,
								(item, type, position, noclick, node) => {
									node = ui.create.buttonPresets.vcard(item, "vcard", position, noclick, node);
									node.owner = get.player();
									node._customintro = function (uiintro, evt) {
										const yao = node.owner?.getStorage(node.link[2], false);
										uiintro.add(`${yao ? "阳" : "阴"}爻`);
									};
									return node;
								},
							],
						],
						true
					)
					.set("ai", button => {
						if (button.link[2] == true) {
							return 1;
						}
						return 2;
					})
					.forResult();
				if (result2.bool) {
					const [mark, trash, type] = result2.links[0];
					game.log(player, "翻转了一枚", type, "爻");
					get.info("dcwangyao").setType(player, mark, type != "阳");
				}
			}
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (
						target.countCards("h") < 2 ||
						!game.hasPlayer(current => {
							return current != target && current.countCards("h") > target.countCards("h") / 2;
						})
					) {
						return 2 * get.sgnAttitude(player, target);
					}
					return 0;
				},
				player: -1,
			},
		},
	},
	dckanghui: {
		audio: 2,
		forced: true,
		trigger: {
			player: "damageBegin3",
		},
		filter(event, player) {
			if (event.source == player) {
				return false;
			}
			const list = ["dcwangyao_marka", "dcwangyao_markb"];
			return list.every(mark => {
				if (typeof player.storage[mark] != "boolean") {
					return false;
				}
				return player.getStorage(mark, false) == false;
			});
		},
		async content(event, trigger, player) {
			trigger.num++;
		},
		mod: {
			maxHandcard(player, num) {
				const list = ["dcwangyao_marka", "dcwangyao_markb"];
				if (list.every(mark => player.getStorage(mark, false))) {
					return num + 2;
				}
			},
		},
		ai: {
			combo: "dcwangyao",
		},
	},
	//张奂
	dcyiju: {
		audio: 2,
		trigger: { target: "useCardToPlayered" },
		forced: true,
		filter(event, player) {
			return event.player != player && event.targets.length == 1 && player.countDiscardableCards(player, "he");
		},
		async content(event, trigger, player) {
			await player.chooseToDiscard(`义拒：请弃置一张牌`, "he", true).set("ai", card => {
				const player = get.player();
				if (player.hasSkill("dcshuguo", null, false, false)) {
					return Math.max(...game.filterPlayer2(target => player.canUse(card, target, true, false)).map(target => get.effect_use(target, card, player, player)));
				}
				return 6 - get.value(card);
			});
		},
		ai: {
			neg: true,
			combo: "dcshuguo",
		},
	},
	dcshuguo: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return game.hasGlobalHistory("cardMove", evt => {
				if (evt.type != "discard" || evt.getlx === false) {
					return false;
				}
				return evt.getd().someInD("d");
			});
		},
		async content(event, trigger, player) {
			const cards = [],
				cards2 = [];
			game.checkGlobalHistory("cardMove", evt => {
				if (evt.type != "discard" || evt.getlx === false) {
					return false;
				}
				game.filterPlayer2().forEach(target => {
					const cardsx = evt.getd(target, "cards2").filterInD("d");
					if (cardsx.length) {
						cards.addArray(cardsx);
						if (target != player) {
							cards2.addArray(cardsx);
						}
					}
				});
			});
			const goon = () => cards.some(card => player.hasUseTarget(card) && get.position(card) == "d");
			while (goon()) {
				const result = await player
					.chooseButton([
						"戍国：请选择要使用的牌",
						[
							cards.map(card => [
								card,
								(() => {
									return cards2.includes(card) ? "其他角色" : "";
								})(),
							]),
							(item, type, position, noclick, node) => {
								node = ui.create.buttonPresets.card(item[0], type, position, noclick);
								game.createButtonCardsetion(item[1], node);
								return node;
							},
						],
					])
					.set("filterButton", button => {
						return get.event().canUse.includes(button.link);
					})
					.set("ai", button => {
						return get.player().getUseValue(button.link);
					})
					.set(
						"canUse",
						cards.filter(card => player.hasUseTarget(card) && get.position(card) == "d")
					)
					.forResult();
				if (result?.bool && result.links?.length) {
					const card = result.links[0];
					cards.remove(card);
					await player.chooseUseTarget(card, true);
					if (cards2.includes(card)) {
						break;
					}
				} else {
					break;
				}
			}
			if (!player.isMaxHandcard(true)) {
				await player.draw(Math.min(cards.length, 5));
			}
		},
	},
	//张燕
	dcqiaolve: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!event.targets?.length || !event.isFirstTarget) {
				return false;
			}
			return event.targets.some(target => {
				if (target == player || !target.countGainableCards(player, "he")) {
					return false;
				}
				return game.getAllGlobalHistory("useCard", evt => evt.targets.includes(target) && evt.card.name == event.card.name).indexOf(event.getParent()) == 0;
			});
		},
		async cost(event, trigger, player) {
			const targets = trigger.targets.filter(target => {
				if (target == player || !target.countGainableCards(player, "he")) {
					return false;
				}
				return game.getAllGlobalHistory("useCard", evt => evt.targets.includes(target) && evt.card.name == trigger.card.name).indexOf(trigger.getParent()) == 0;
			});
			if (targets.length > 1) {
				event.result = await player
					.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
						const { targets } = get.event();
						return targets?.includes(target);
					})
					.set("targets", targets)
					.set("ai", target => {
						const player = get.player();
						return get.effect(target, { name: "shunshou_copy2" }, player, player);
					})
					.forResult();
			} else {
				event.result = await player
					.chooseBool(get.prompt2(event.skill, targets))
					.set("choice", get.effect(targets[0], { name: "shunshou_copy2" }, player, player) > 0)
					.forResult();
				event.result.targets = targets;
			}
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			await player.gainPlayerCard(target, "he", true);
		},
	},
	dchanjie: {
		audio: 2,
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return player != event.player && event.player.hp >= player.hp && player.countCards("hs", { color: "black" });
		},
		direct: true,
		clearTime: true,
		async content(event, trigger, player) {
			const list = get.inpileVCardList(info => {
				if (info[0] == "delay") {
					return false;
				}
				return (
					get.tag({ name: info[2] }, "damage") &&
					player.countCards("hs", card => {
						if (get.color(card) != "black") {
							return false;
						}
						const vcard = get.autoViewAs({ name: info[2], nature: info[3] }, [card]);
						return player.canUse(vcard, trigger.player, false);
					}) > 0
				);
			});
			if (!list.length) {
				return;
			}
			const result = await player
				.chooseButton([get.prompt2(event.name, trigger.player), [list, "vcard"]])
				.set("ai", button => {
					const { player, sourcex: target } = get.event();
					const card = player.getCards("hs", { color: "black" }).maxBy(card => {
						const vcard = get.autoViewAs({ name: button.link[2], nature: button.link[3] }, [card]);
						if (player.canUse(vcard, target, false)) {
							return get.effect_use(target, vcard, player, player);
						}
						return 0;
					});
					if (!card) {
						return 0;
					}
					return get.effect_use(target, card, player, player);
				})
				.set("sourcex", trigger.player)
				.forResult();
			if (!result?.links?.length) {
				return;
			}
			const card = {
				name: result.links[0][2],
				nature: result.links[0][3],
			};
			const prompt = `撼捷：是否将一张黑色手牌当做${get.translation(card)}对${get.translation(trigger.player)}使用？`;
			game.broadcastAll(
				(card, prompt) => {
					lib.skill.dchanjie_backup.viewAs = card;
					lib.skill.dchanjie_backup.prompt = prompt;
				},
				card,
				prompt
			);
			const next = player.chooseToUse();
			next.set("openskilldialog", prompt);
			next.set("norestore", true);
			next.set("addCount", false);
			next.set("onlyTarget", trigger.player);
			next.set("_backupevent", "dchanjie_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.set("logSkill", event.name);
			next.backup("dchanjie_backup");
			event.result = await next.forResult();
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card" && get.color(card) == "black";
				},
				position: "hs",
				selectCard: 1,
				check: card => 7 - get.value(card),
				filterTarget(card, player, target) {
					const { onlyTarget } = get.event();
					return target == onlyTarget && lib.filter.targetEnabled.apply(this, arguments);
				},
				async precontent(event) {
					delete event.result.skill;
				},
				log: false,
				popname: true,
			},
		},
	},
	//伍孚
	dchuairen: {
		audio: 2,
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
						return event.filterCard({ name: card[2], nature: card[3], storage: { dchuairen: true }, cards: [cardx] }, player, event);
					}, "e");
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
							return event.filterCard({ name: card[2], nature: card[3], storage: { dchuairen: true }, cards: [cardx] }, player, event);
						}, "e");
					});
				return ui.create.dialog("怀刃", [list, "vcard"]);
			},
			filter(button, player) {
				const evt = get.event().getParent();
				return evt.filterCard({ name: button.link[2], nature: button.link[3], storage: { dchuairen: true } }, player, evt);
			},
			check(button) {
				if (get.event().type != "phase") {
					return 1;
				}
				return player.getUseValue({ name: button.link[2], nature: button.link[3], storage: { dchuairen: true } });
			},
			backup(links, player) {
				return {
					audio: "dchuairen",
					filterCard: { type: "equip" },
					popname: true,
					check(card) {
						return 6 - get.value(card);
					},
					position: "e",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						storage: { dchuairen: true },
					},
					async precontent(event, trigger, player) {
						const cards = event.result.cards,
							card = event.result.card,
							strs = cards.map(i => get.cardDescription(i, player));
						event.getParent().addCount = false;
						if (strs.some(str => str.includes(`【${get.translation(card.name)}】`))) {
							await player.draw(2);
						}
						if (!player.countCards("e", card => !cards.includes(card))) {
							event.getParent().set("oncard", () => {
								_status.event.baseDamage++;
							});
						}
					},
				};
			},
			prompt(links, player) {
				return "###怀刃###将一张装备牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
			},
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.storage?.dchuairen) {
					return Infinity;
				}
			},
		},
		locked: false,
		hiddenCard(player, name) {
			return lib.inpile.includes(name) && get.type(name) == "basic" && player.countCards("e");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond" || !player.countCards("e")) {
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
						return { name: namex[2], nature: namex[3], storage: { dchuairen: true } };
					});
					names.forEach(card => {
						if (player.getUseValue(card) > 0) {
							let temp = get.order(card);
							max = temp > max ? temp : max;
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
		},
	},
	dcchizei: {
		audio: 2,
		trigger: {
			player: "damageBegin3",
		},
		filter(event, player) {
			return event.source?.isIn() && player.canCompare(event.source, true);
		},
		logTarget: "source",
		check(event, player) {
			return get.attitude(player, event.source) < 0;
		},
		async content(event, trigger, player) {
			let num = 0;
			while (true) {
				const next = player.chooseToCompare(trigger.source);
				if (!next.fixedResult) {
					next.fixedResult = {};
				}
				next.fixedResult[player.playerid] = get.cards()[0];
				const result = await next.forResult();
				if (result.bool) {
					if (!player.canCompare(trigger.source, true)) {
						return;
					}
					num++;
					const result2 = await player
						.chooseBool(`是否继续与${get.translation(trigger.source)}拼点？（已赢${num}次）`)
						.set("choice", Math.random() > 0.7)
						.forResult();
					if (!result2.bool) {
						return;
					}
				} else {
					if (num > 0) {
						await player.chooseToDiscard("he", num, true);
					}
					return;
				}
			}
		},
	},
	dczhonge: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		filterCard(card, player) {
			return player.countCards("h") > player.maxHp;
		},
		selectCard() {
			const player = get.player();
			if (player.countCards("h") <= player.maxHp) {
				return [0, 1];
			}
			return player.countCards("h") - player.maxHp;
		},
		allowChooseAll: true,
		async content(event, trigger, player) {
			if (!event.cards?.length) {
				await player.drawTo(player.maxHp);
			}
			const target = event.target,
				targets = [player, target];
			const map = await game.chooseAnyOL(targets, get.info(event.name).chooseControl, [targets]).forResult();
			let list = [];
			for (const i of targets) {
				const result = map.get(i);
				i.popup(result.control);
				list.push(result.control);
			}
			const bool = list[0] != list[1];
			for (const i of list) {
				for (const current of targets) {
					if (i == "摸牌") {
						await current.draw();
						if (bool && current == player) {
							await current.draw();
						}
					} else {
						const sha = new lib.element.VCard({ name: "sha", isCard: true }),
							aim = current === player ? target : player;
						if (current.isIn() && current.canUse(sha, aim, false)) {
							current.line(aim);
							await current.useCard(sha, aim, false, "noai");
						}
						if (bool && current == player) {
							const sha2 = new lib.element.VCard({ name: "sha", isCard: true });
							if (current.isIn() && current.canUse(sha2, aim, false)) {
								current.line(aim);
								await current.useCard(sha2, aim, false, "noai");
							}
						}
					}
				}
			}
		},
		chooseControl(player, targets, eventId) {
			const str = get.translation(targets[0] == player ? targets[1] : targets[0]);
			return player
				.chooseControl("摸牌", "出杀")
				.set("prompt", `忠锷：请选择一项与${str}依次执行`)
				.set("prompt2", `若你与其选择的选项不同，${get.translation(targets[0])}执行时额外执行一遍`)
				.set("ai", () => {
					if (get.event().att > 0) {
						return "摸牌";
					}
					return Math.random() > 0.3 ? "出杀" : "摸牌";
				})
				.set("att", Math.max(get.attitude(targets[0], targets[1]), get.attitude(targets[1], targets[0])))
				.set("id", eventId)
				.set("_global_waiting", true);
		},
		ai: {
			order: 3,
			result: {
				target(player, target) {
					return get.effect(target, { name: "sha" }, player, target) + 1;
				},
				player(player, target) {
					return player.maxHp - player.countCards("h");
				},
			},
		},
	},
	dcjuekai: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		manualConfirm: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			if (typeof get.skillCount("dczhonge") == "number" && get.skillCount("dczhonge") >= 1) {
				delete player.getStat("skill")["dczhonge"];
				game.log(player, "重置了技能", "#g【忠锷】");
			}
			player.addTempSkill("dcjuekai_effect", "phaseChange");
			for (const target of game.players) {
				if (
					target.getHistory("gain", evt => {
						return evt.getParent("phaseUse") == event.getParent("phaseUse", true);
					}).length
				) {
					player.line(target, "green");
					target.addTempSkill("dcjuekai_fengyin", "phaseChange");
				}
			}
		},
		ai: {
			combo: "dczhonge",
			order: 1,
			result: {
				player(player) {
					if (!player.getStat("skill")?.["dczhonge"]) {
						return 0;
					}
					return 1;
				},
			},
		},
		subSkill: {
			effect: {
				trigger: {
					global: ["gainAfter", "loseAsyncAfter"],
				},
				charlotte: true,
				direct: true,
				async content(event, trigger, player) {
					for (const target of game.players) {
						if (!target.hasSkill("dcjuekai_fengyin") && trigger.getg && trigger.getg(target)?.length) {
							player.line(target, "green");
							target.addTempSkill("dcjuekai_fengyin", "phaseChange");
						}
					}
				},
			},
			fengyin: {
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "忾",
				intro: {
					content: "本阶段无法使用手牌",
				},
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") {
							return false;
						}
					},
				},
			},
		},
	},
	//修爵裴秀
	xjzhitu: {
		mod: {
			targetInRange(card, player, target) {
				if (player.getStorage("xjzhitu").includes(get.number(card))) {
					return true;
				}
			},
		},
		trigger: {
			target: "useCardToTarget",
			player: "useCard",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			const number = get.number(event.card);
			if (typeof number !== "number") {
				return false;
			}
			const storage = player.getStorage("xjzhitu"),
				bool = !storage.includes(number);
			if (event.name == "useCard") {
				return bool || storage.filter(num => num > 0).length >= 13;
			}
			return bool;
		},
		async content(event, trigger, player) {
			const storage = player.getStorage(event.name),
				{ card } = trigger,
				number = get.number(card);
			if (trigger.name == "useCard" && storage.filter(num => num > 0).length >= 13) {
				trigger.directHit.addArray(game.players);
				game.log(card, "不能被响应");
			}
			if (!storage.includes(number)) {
				player.markAuto(event.name, [number]);
				player.storage[event.name].sort((a, b) => a - b);
				player.markSkill(event.name);
				await player.draw();
			}
		},
		onremove: true,
		intro: { content: "已记录点数：$" },
	},
	dcxiujue: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => get.info("dcxiujue").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player.chooseToCompare(target).forResult();
			const { winner } = result;
			if (winner) {
				const cards = [result.player, result.target].filterInD("d").filter(card => winner.hasUseTarget(card));
				while (cards.length) {
					const card = cards.shift();
					await game.delayx();
					const { bool } = await winner
						.chooseUseTarget(true, card, false)
						.set("filterTarget", function (card, player, target) {
							let evt = _status.event;
							if (_status.event.name == "chooseTarget") {
								evt = evt.getParent();
							}
							if (!evt.dcxiujue_target.includes(target)) {
								return false;
							}
							return lib.filter.targetEnabledx(card, player, target);
						})
						.set("dcxiujue_target", [player, target])
						.forResult();
					if (!bool) {
						break;
					}
				}
			} else {
				await game.asyncDraw([player, target]);
			}
		},
		ai: {
			order: 6.5,
			result: {
				target(player, target) {
					const hs = player.getCards("h").sort((a, b) => {
						return get.number(b) - get.number(a);
					});
					const ts = target.getCards("h").sort((a, b) => {
						return get.number(b) - get.number(a);
					});
					if (!hs.length || !ts.length) {
						return 0;
					}
					if (get.number(hs[0]) > get.number(ts[0]) || get.number(hs[0]) - ts.length >= 9 + Math.min(2, player.hp / 2)) {
						return get.sgnAttitude(player, target);
					}
					return 0;
				},
			},
		},
	},
	//复爵裴秀
	fjzhitu: {
		audio: 2,
		trigger: {
			player: "useCard2",
		},
		filter(event, player) {
			const { card, targets } = event;
			const info = get.info(card);
			if (info.allowMultiple == false) {
				return false;
			}
			const infox = lib.card[get.name(card)];
			if (get.type(card) != "basic" && (!info || info.type != "trick" || info.notarget || (info.selectTarget && info.selectTarget != 1))) {
				return false;
			}
			if (targets && targets.length == 1 && !info.multitarget) {
				return game.hasPlayer(current => !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.distance(player, current) == get.distance(player, targets[0]));
			}
			return false;
		},
		async cost(event, trigger, player) {
			const { card, targets } = trigger;
			const prompt2 = `为${get.translation(card)}增加任意个你与其距离为${get.distance(player, targets[0])}的目标`;
			event.result = await player
				.chooseTarget(
					get.prompt(event.skill),
					(card, player, target) => {
						const { card: cardx, targets } = get.event();
						return !targets.includes(target) && lib.filter.targetEnabled2(cardx, get.player(), target) && get.distance(player, target) == get.distance(player, targets[0]);
					},
					[1, Infinity]
				)
				.set("prompt2", prompt2)
				.set("ai", target => {
					const { card, player } = get.event();
					return get.effect(target, card, player, player);
				})
				.set("card", card)
				.set("targets", targets)
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.targets.addArray(event.targets);
			game.log(event.targets, "也成为了", trigger.card, "的目标");
		},
	},
	dcfujue: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.canMoveCard();
		},
		async content(event, trigger, player) {
			await player.moveCard(true);
			const num = player.countCards("he") - 5;
			if (num == 0) {
				return;
			}
			if (num > 0) {
				await player.chooseToDiscard("he", num, true, "allowChooseAll");
			} else {
				await player.draw(-num);
			}
			const lose = player.hasHistory("lose", evt => evt.getParent(3) == event);
			const bool1 = lose && player.hasHistory("gain", evt => evt.getParent(2) == event);
			const bool2 = game.getGlobalHistory("everything", evt => evt.name == "equip" && evt.player == player && evt.getParent(2) == event).length && lose;
			if (bool1 || bool2) {
				player.addTempSkill(event.name + "_effect");
				player.addMark(event.name + "_effect", 1, false);
			}
		},
		ai: {
			expose: 0.2,
			order(item, player) {
				if (player.countCards("he") > 4) {
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
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content: `本回合计算与其他角色的距离-#`,
				},
				mod: {
					globalFrom(from, to, current) {
						return current - from.countMark("dcfujue_effect");
					},
				},
			},
		},
	},
	//传械马钧
	chuanxie: {
		trigger: { global: "useCard" },
		filter(event, player) {
			return player.getStorage("chuanxie")[0] === get.suit(event.card);
		},
		forced: true,
		async content(event, trigger, player) {
			const [suit, current, gain] = Array.from({ length: 3 }).map((_, num) => player.getStorage("chuanxie")[num]);
			player.unmarkAuto("chuanxie", [suit]);
			player.markAuto("chuanxie", [suit]);
			player.popup(current);
			game.log(player, "将", "#g【传械】", "的首个花色改为了", "#y" + get.translation(current));
			const card = get.cardPile2(card => get.suit(card) === gain);
			if (gain) {
				player.gain(card, "gain2");
			}
		},
		mod: {
			aiOrder(player, card, num) {
				if (get.suit(card) === player.getStorage("chuanxie")[0]) {
					return num + 10;
				}
			},
		},
		group: "chuanxie_init",
		subSkill: {
			init: {
				audio: "chuanxie",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name !== "phase" || game.phaseNumber === 0;
				},
				forced: true,
				async content(event, trigger, player) {
					let suits = ["spade", "heart", "diamond", "club"];
					const result = await player
						.chooseButton(
							[
								'###传械：请选择一个花色###<div class="text center">传械花色顺序：' +
									suits
										.slice()
										.map(suit => get.translation(suit))
										.join("|") +
									"</div>",
								[suits.map(i => ["", "", "lukai_" + i]), "vcard"],
							],
							true
						)
						.set("ai", () => 1 + Math.random())
						.forResult();
					if (result.bool) {
						const suitx = result.links[0][2].slice("lukai_".length);
						player.popup(suitx);
						game.log(player, "将", "#g【传械】", "的首个花色改为了", "#y" + get.translation(suitx));
						while (suits[0] !== suitx) {
							const suit = suits[0];
							suits.remove(suit);
							suits.push(suit);
						}
						player.markAuto("chuanxie", suits);
					}
				},
			},
		},
		intro: {
			markcount: suits => get.translation(suits[0]),
			content: suits => "当前顺序：" + suits.map(suit => get.translation(suit)).join("|"),
		},
	},
	yjqiaosi: {
		trigger: {
			source: "damageSource",
			player: "damageEnd",
		},
		filter(event, player) {
			return player.getStorage("chuanxie").length > 2;
		},
		usable: 1,
		async cost(event, trigger, player) {
			const result = await player
				.chooseButton([get.prompt2(event.skill), [[3, 1].map(i => ["", "", "lukai_" + player.getStorage("chuanxie")[i]]), "vcard"]])
				.set("ai", () => 1 + Math.random())
				.forResult();
			if (result.bool) {
				result.cost_data = result.links[0][2].slice("lukai_".length);
			}
			event.result = result;
		},
		async content(event, trigger, player) {
			player.popup(event.cost_data);
			game.log(player, "将", "#g【传械】", "的首个花色改为了", "#y" + get.translation(event.cost_data));
			while (player.getStorage("chuanxie").indexOf(event.cost_data) !== 0) {
				const suit = player.getStorage("chuanxie")[0];
				player.unmarkAuto("chuanxie", [suit]);
				player.markAuto("chuanxie", [suit]);
			}
		},
		ai: { combo: "chuanxie" },
	},
	//奇巧马钧
	yuliao: {
		trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"] },
		filter(event, player) {
			if (player.hasSkill("yuliao_used") || player.getExpansions("yuliao").length >= 8) {
				return false;
			}
			return event.getd()?.someInD("od");
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseButton(["###" + get.prompt(event.skill) + '###<div class="text center">将其中一张牌置于武将牌上', trigger.getd().filterInD("od")])
				.set("ai", button => get.value(button.link))
				.forResult();
			if (result.bool) {
				result.cards = result.links;
			}
			event.result = result;
		},
		async content(event, trigger, player) {
			player.addTempSkill("yuliao_used", ["phaseBefore", "phaseChange", "phaseAfter"]);
			const next = player.addToExpansion(event.cards, "gain2");
			next.gaintag.add("yuliao");
			await next;
		},
		marktext: "材",
		intro: {
			name2: "材",
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: "yuliao_dying",
		subSkill: {
			used: { charlotte: true },
			dying: {
				audio: "yuliao",
				trigger: { player: "dying" },
				filter(event, player) {
					return player.getExpansions("yuliao").length > 0;
				},
				prompt2(event, player) {
					const cards = player.getExpansions("yuliao");
					return "将" + get.translation(cards) + "置入弃牌堆，然后摸" + get.cnNumber(cards.length) + "张牌";
				},
				content() {
					const cards = player.getExpansions("yuliao");
					player.loseToDiscardpile(cards);
					player.draw(cards.length);
				},
			},
		},
	},
	qiqiao: {
		enable: "phaseUse",
		filter(event, player) {
			if (player.getExpansions("yuliao").filter(card => ["basic", "trick", "equip"].includes(get.type2(card))).length < 2) {
				return false;
			}
			return game.hasPlayer(target => lib.skill.qiqiao.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target.getVCards("e").length;
		},
		chooseButton: {
			dialog(event, player) {
				const [target] = event.result.targets;
				const dialog = ui.create.dialog("奇巧：请选择" + get.translation(target) + "装备区的一张牌和你要移去的“材”");
				dialog.add('<div class="text center">' + get.translation(target) + "的装备区</div>");
				dialog.add([target.getVCards("e"), "vcard"]);
				dialog.add('<div class="text center">你的“材”</div>');
				dialog.add(player.getExpansions("yuliao"));
				return dialog;
			},
			filter(button, player) {
				const bool = Boolean(ui.selected.buttons.length);
				if (bool !== player.getExpansions("yuliao").includes(button.link)) {
					return false;
				}
				return !bool || ["basic", "trick", "equip"].includes(get.type2(button.link));
			},
			check(button) {
				const player = get.player(),
					[target] = get.event().getParent().result.targets;
				return 114514 + get.attitude(player, target) * get.value(button.link.cards || [], target);
			},
			select: 3,
			backup(links, player) {
				return {
					audio: "qiqiao",
					target: get.event().result.targets[0],
					filterTarget(card, player, target) {
						return target === lib.skill.qiqiao_backup.target;
					},
					delay: 0,
					effect: links,
					selectTarget: -1,
					async content(event, trigger, player) {
						const [card, ...lose] = lib.skill.qiqiao_backup.effect;
						await player.loseToDiscardpile(lose);
						const target = event.target,
							types = lose.slice().map(i => get.type2(i)),
							typeList = ["basic", "trick", "equip"];
						target.addSkill("qiqiao_effect");
						const listx = target.storage["qiqiao_effect"].find(list => list[0] === card);
						if (listx) {
							for (let i = 0; i < typeList.length; i++) {
								if (types.includes(typeList[i])) {
									listx[1][i] += lose.filter(j => get.type2(j) === typeList[i]).length;
								}
							}
						} else {
							let list = [0, 0, 0];
							for (let i = 0; i < typeList.length; i++) {
								if (types.includes(typeList[i])) {
									list[i] += lose.filter(j => get.type2(j) === typeList[i]).length;
								}
							}
							target.storage["qiqiao_effect"].push([card, list]);
						}
						target.markSkill("qiqiao_effect");
					},
				};
			},
			prompt(links) {
				const [card, ...lose] = links,
					str = get.translation(get.event().result.targets[0]);
				return (
					"###奇巧：令" +
					str +
					"直到" +
					get.translation(card) +
					'离开装备区前###<span class="text left">' +
					[
						["basic", "使用【杀】的次数上限+1"],
						["trick", "使用锦囊牌不可被响应"],
						["equip", get.translation(card) + "离开装备区后摸两张牌"],
					]
						.filter(list => {
							return lose.map(i => get.type2(i)).includes(list[0]);
						})
						.map(list => "※" + list[1]) +
					"</span>"
				);
			},
		},
		ai: {
			combo: "yuliao",
			order: 10,
			result: {
				player(player, target) {
					if (target.hasSkill("qiqiao_effect")) {
						return 0;
					}
					return get.attitude(player, target) * Math.max(0, ...target.getVCards("e").map(card => (card.cards || []).reduce((sum, i) => sum + get.value(i))));
				},
			},
		},
		subSkill: {
			backup: {},
			effect: {
				charlotte: true,
				onremove: true,
				init: (player, skill) => (player.storage[skill] = player.storage[skill] || []),
				intro: {
					content(storage) {
						return storage
							.map(map => {
								const [card, list] = map;
								return (
									"※" +
									get.translation(card) +
									"离开装备区前：<br>" +
									[
										[list[0], "使用【杀】的次数上限+" + list[0]],
										[list[1], "使用锦囊牌不可被响应"],
										[list[2], get.translation(card) + "离开装备区后摸" + get.cnNumber(list[2] * 2) + "张牌"],
									]
										.filter(listx => listx[0] > 0)
										.map(listx => "<li>" + listx[1])
										.join("<br>")
								);
							})
							.join("<br>");
					},
				},
				audio: "qiqiao",
				trigger: {
					player: ["useCard", "loseAfter"],
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					const storage = player.storage["qiqiao_effect"];
					if (!storage?.length) {
						return false;
					}
					if (event.name === "useCard") {
						return get.type2(event.card) === "trick" && storage.some(list => list[1][1] > 0);
					}
					const evt = event.getl(player);
					return evt?.es?.some(card => storage.some(list => evt.vcard_map.get(card)?.cardid === list[0].cardid));
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					if (trigger.name === "useCard") {
						player.logSkill(event.name);
						game.log(trigger.card, "不可被响应");
						trigger.directHit.addArray(game.players);
					} else {
						const storage = player.storage[event.name],
							evt = trigger.getl(player);
						const lists = storage.filter(list => evt.es.some(card => evt.vcard_map.get(card)?.cardid === list[0].cardid));
						const sum = lists.reduce((sum, list) => sum + list[1][2] * 2, 0);
						if (sum > 0) {
							player.logSkill(event.name);
							await player.draw(sum);
						}
						player.unmarkAuto(event.name, lists);
						if (!player.storage[event.name].length) {
							player.removeSkill(event.name);
						}
					}
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name === "sha") {
							return (num += player.storage["qiqiao_effect"].reduce((sum, list) => sum + list[1][0], 0));
						}
					},
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						const storage = player.storage["qiqiao_effect"];
						return arg?.card && get.type2(arg.card) === "trick" && storage?.some(list => list[1][1] > 0);
					},
				},
			},
		},
	},
	yanxie: {
		enable: "phaseUse",
		filter(event, player) {
			const cards = player.getExpansions("yuliao").map(i => get.type2(i));
			return cards.length > 1 && cards.length !== cards.unique().length;
		},
		chooseButton: {
			dialog(event, player) {
				const [target] = event.result.targets;
				const dialog = ui.create.dialog("研械：请选择要重铸的“料”");
				dialog.add(player.getExpansions("yuliao"));
				return dialog;
			},
			filter(button) {
				return !ui.selected.buttons.length || get.type2(button.link) === get.type2(ui.selected.buttons[0].link);
			},
			check(button) {
				return 1 + Math.random();
			},
			select: 2,
			backup(links, player) {
				return {
					audio: "yanxie",
					delay: 0,
					effect: links,
					async content(event, trigger, player) {
						const cards = lib.skill.yanxie_backup.effect;
						await player.loseToDiscardpile(cards);
						await player.draw(cards.length);
						const card = get.cardPile2(card => get.type(card) === "equip", "random");
						if (card) {
							await player.gain(card, "gain2");
						}
					},
				};
			},
			prompt(links) {
				return '###研械###<div class="text center">重铸' + get.translation(links) + "，从牌堆中获得一张装备牌</div>";
			},
		},
		ai: {
			combo: "yuliao",
			order: 7,
			result: { player: 1 },
		},
		group: "yanxie_zhijian",
		subSkill: {
			backup: {},
			zhijian: {
				audio: "yanxie",
				inherit: "zhijian",
				prompt: "将一张装备牌置入一名其他角色的装备区",
				content() {
					target.equip(cards[0]);
				},
				filter(event, player) {
					return player.countCards("he", { type: "equip" }) > 0;
				},
				position: "he",
			},
		},
	},
	//星董卓
	xiongjin: {
		audio: 2,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return !player.getStorage("xiongjin_used").includes((event.player === player).toString());
		},
		logTarget: "player",
		prompt2(event, player) {
			const goon = event.player === player;
			return (goon ? "" : "令其") + "摸" + get.cnNumber(Math.min(4, Math.max(1, player.getDamagedHp()))) + "张牌，本回合的弃牌阶段开始时，" + (goon ? "弃置所有非基本牌" : "其弃置所有基本牌");
		},
		content() {
			const target = trigger.player;
			const goon = target === player;
			player.addTempSkill("xiongjin_used", "roundStart");
			player.markAuto("xiongjin_used", [goon.toString()]);
			player.addTempSkill("xiongjin_effect");
			player.storage.xiongjin_effect_target ??= [];
			player.storage.xiongjin_effect_target.add(target);
			target.markAuto("xiongjin_effect", [goon ? "nobasic" : "basic"]);
			target.draw(Math.min(4, Math.max(1, player.getDamagedHp())));
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			effect: {
				charlotte: true,
				onremove(player, skill) {
					player.storage.xiongjin_effect_target.forEach(target => {
						target.unmarkAuto(skill, target.storage[skill]);
					});
					delete player.storage.xiongjin_effect_target;
				},
				intro: {
					markcount: () => 0,
					content(storage) {
						if (storage.length > 1) {
							return "弃牌阶段开始时，弃置所有牌";
						}
						return "弃牌阶段开始时，弃置所有" + (storage[0] === "basic" ? "基本" : "非基本") + "牌";
					},
				},
				trigger: { global: "phaseDiscardBegin" },
				forced: true,
				popup: false,
				content() {
					const targets = player.storage.xiongjin_effect_target;
					if (targets?.length) {
						for (const target of targets.sortBySeat()) {
							const storage = target.getStorage("xiongjin_effect");
							const cards = target.getCards("he", card => {
								if (!lib.filter.cardDiscardable(card, target)) {
									return false;
								}
								const type = get.type(card);
								return (type === "basic" && storage.includes("basic")) || (type !== "basic" && storage.includes("nobasic"));
							});
							if (cards.length) {
								target.discard(cards);
							}
						}
					}
				},
			},
		},
	},
	zhenbian: {
		audio: 2,
		trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter"] },
		filter(event, player) {
			if (event.name.indexOf("lose") === 0) {
				if (event.getlx === false || event.position !== ui.discardPile) {
					return false;
				}
			} else if (event.getParent()?.relatedEvent?.name == "useCard") {
				return false;
			}
			return event.cards.length;
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.cards.some(card => !player.getStorage("zhenbian").includes(get.suit(card, false)))) {
				player.markAuto(
					"zhenbian",
					trigger.cards.reduce((list, card) => list.add(get.suit(card, false)), [])
				);
				player.storage.zhenbian.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
				player.addTip("zhenbian", get.translation("zhenbian") + player.getStorage("zhenbian").reduce((str, suit) => str + get.translation(suit), ""));
			}
			if (player.getStorage("zhenbian").length >= 4 && player.maxHp < 8) {
				player.unmarkSkill("zhenbian");
				await player.gainMaxHp();
			}
		},
		intro: {
			content: "已记录花色$",
			onunmark(storage, player) {
				delete player.storage.zhenbian;
				player.removeTip("zhenbian");
			},
		},
		mod: { maxHandcardBase: player => player.maxHp },
		onremove: (player, skill) => player.removeTip(skill),
	},
	baoxi: {
		audio: 2,
		group: ["baoxi_juedou", "baoxi_sha"], //同时机沟槽技能改个翻译方便区分
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			backup: {
				filterCard: card => get.itemtype(card) === "card",
				filterTarget: lib.filter.targetEnabled,
				check(card) {
					const player = get.player();
					if (player.maxHp <= 1) {
						return 0;
					}
					return player.getUseValue(get.autoViewAs(get.info("baoxi_backup").viewAs, [card]), false) - get.value(card);
				},
				log: false,
				precontent() {
					player.logSkill("baoxi");
					player.loseMaxHp();
					player.addTempSkill("baoxi_used", "roundStart");
					player.markAuto("baoxi_used", [event.result.card.name]);
				},
			},
			juedou: {
				trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter"] },
				filter(event, player) {
					if (player.getStorage("baoxi_used").includes("juedou")) {
						return false;
					}
					if (event.name.indexOf("lose") === 0 && (event.getlx === false || event.position !== ui.discardPile)) {
						return false;
					}
					return (
						event.cards.filter(card => get.type(card) === "basic").length > 1 &&
						player.hasCard(card => {
							return _status.connectMode || player.hasUseTarget(get.autoViewAs({ name: "juedou" }, [card]), false);
						}, "h")
					);
				},
				direct: true,
				content() {
					game.broadcastAll(() => (lib.skill.baoxi_backup.viewAs = { name: "juedou" }));
					const next = player.chooseToUse();
					next.set("openskilldialog", "暴袭：是否将一张手牌当作【决斗】使用？");
					next.set("norestore", true);
					next.set("_backupevent", "baoxi_backup");
					next.set("custom", {
						add: {},
						replace: { window: function () {} },
					});
					next.backup("baoxi_backup");
					next.set("addCount", false);
				},
			},
			sha: {
				trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter"] },
				filter(event, player) {
					if (player.getStorage("baoxi_used").includes("sha")) {
						return false;
					}
					if (event.name.indexOf("lose") === 0 && (event.getlx === false || event.position !== ui.discardPile)) {
						return false;
					}
					return (
						event.cards.filter(card => get.type(card) !== "basic").length > 1 &&
						player.hasCard(card => {
							return _status.connectMode || player.hasUseTarget(get.autoViewAs({ name: "sha" }, [card]), false);
						}, "h")
					);
				},
				direct: true,
				content() {
					game.broadcastAll(() => (lib.skill.baoxi_backup.viewAs = { name: "sha" }));
					const next = player.chooseToUse();
					next.set("openskilldialog", "暴袭：是否将一张手牌当作【杀】使用？");
					next.set("norestore", true);
					next.set("_backupevent", "baoxi_backup");
					next.set("custom", {
						add: {},
						replace: { window: function () {} },
					});
					next.backup("baoxi_backup");
					next.set("addCount", false);
				},
			},
		},
	},
	//向秀
	mpmiaoxi: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + (player.hasSkill(skill + "_rewrite", null, null, false) ? 1 : 0);
		},
		filterCard: true,
		position: "h",
		filterTarget(card, player, target) {
			return target.countCards("h") && target != player;
		},
		discard: false,
		lose: false,
		delay: false,
		async content(event, trigger, player) {
			const target = event.target;
			const carda = event.cards[0];
			const result = await player.choosePlayerCard(target, "h", true).forResult();
			if (result.bool) {
				const cardb = result.cards[0];
				player.$throw(carda);
				target.$throw(cardb);
				game.log(player, "展示了", player, "的", carda, "和", target, "的", cardb);
				await player.showCards([carda, cardb], get.translation(player) + "发动了【妙析】");
				if (get.color(carda) == get.color(cardb)) {
					await player.gain(cardb, "gain2");
				}
				if (get.suit(carda) == get.suit(cardb)) {
					await target.loseHp();
				}
				if (get.number(carda) == get.number(cardb) && !player.hasSkill("mpmiaoxi_rewrite", null, null, false)) {
					player.addTempSkill("mpmiaoxi_rewrite");
				}
			}
		},
		ai: {
			order: 5,
			result: {
				target: -1,
			},
		},
		subSkill: { rewrite: { charlotte: true } },
	},
	mpsijiu: {
		audio: 2,
		trigger: {
			player: "phaseEnd",
		},
		filter(event, player) {
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				return (
					current.getHistory("lose", evt => {
						let evtx = evt.getParent();
						if (!evtx.getg) {
							return false;
						}
						var cards = evtx.getg(player);
						if (!cards.length) {
							return false;
						}
						var cards2 = evt.cards2;
						for (var card of cards2) {
							if (cards.includes(card)) {
								return true;
							}
						}
						return false;
					}).length > 0
				);
			});
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
			const result = await player
				.chooseTarget("是否观看一名角色的手牌？", function (card, player, target) {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					return 11 - get.attitude(get.player(), target);
				})
				.forResult();
			if (result.bool) {
				const target = result.targets[0];
				await player.viewHandcards(target);
			}
		},
	},
	//马钧
	gongqiao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		locked: false,
		filter(event, player) {
			if (!player.countCards("h")) {
				return false;
			}
			for (let i = 0; i <= 5; i++) {
				if (player.hasEquipableSlot(i)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###工巧###你可将一张手牌置于你的任意装备栏内（可替换原装备牌）");
			},
			chooseControl(event, player) {
				const choices = [];
				for (let i = 0; i <= 5; i++) {
					if (player.hasEquipableSlot(i)) {
						choices.push(`equip${i}`);
					}
				}
				choices.push("cancel2");
				return choices;
			},
			check() {
				const player = get.player(),
					num = [5, 3, 4, 1, 2].find(index => player.hasEmptySlot(index));
				if (num) {
					return `equip${num}`;
				}
				return "cancel2";
			},
			backup(result, player) {
				return {
					audio: "gongqiao",
					slot: result.control,
					filterCard: true,
					position: "h",
					discard: false,
					lose: false,
					delay: false,
					prepare: "throw",
					async content(event, trigger, player) {
						const card = get.autoViewAs({ name: `gongqiao_${get.type2(event.cards[0])}` }, event.cards);
						card.subtypes = [lib.skill.gongqiao_backup.slot];
						await player.equip(card);
					},
					ai1(card) {
						const player = get.player();
						if (
							player.hasCard(cardx => {
								return get.type2(cardx, false) === get.type2(card, false);
							}, "e")
						) {
							return 7 - get.value(card);
						}
						return 15 - get.value(card);
					},
					ai2: () => 1,
				};
			},
			prompt(result, player) {
				return `选择一张手牌置入${get.translation(result.control)}栏`;
			},
		},
		mod: {
			maxHandcard(player, num) {
				if (
					player.hasCard(card => {
						return get.type2(card, false) === "equip";
					}, "e")
				) {
					return num + 3;
				}
			},
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
		group: ["gongqiao_basic", "gongqiao_trick"],
		subSkill: {
			backup: {},
			basic: {
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				filter(event, player) {
					return (
						get.type2(event.card, false) === "basic" &&
						player.hasCard(card => {
							return get.type2(card, false) === "basic";
						}, "e")
					);
				},
				async content(event, trigger, player) {
					trigger.baseDamage++;
					game.log(player, "使用的", trigger.card, "牌面数值+1");
				},
			},
			trick: {
				audio: "gongqiao",
				trigger: { player: "useCardAfter" },
				forced: true,
				filter(event, player) {
					const type = get.type2(event.card, false);
					if (
						player.hasHistory(
							"useCard",
							evt => {
								return evt !== event && get.type2(evt.card, false) === type;
							},
							event
						)
					) {
						return false;
					}
					return player.hasCard(card => {
						return get.type2(card, false) === "trick";
					}, "e");
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
	},
	jingyi: {
		audio: 2,
		trigger: { player: "equipAfter" },
		forced: true,
		filter(event, player, name, card) {
			const subtypes = get.subtypes(card);
			return !player.getStorage("jingyi_used").some(i => subtypes.includes(i));
		},
		getIndex(event, player) {
			return event.cards ?? [];
		},
		async content(event, trigger, player) {
			const card = event.indexedData,
				subtypes = get.subtypes(card);
			player.addTempSkill(event.name + "_used");
			if (subtypes?.length) {
				player.markAuto(event.name + "_used", subtypes);
			}
			const num = player.getCards("e").reduce((sum, card) => {
				const num = card.viewAs ? card.cards.length : 1;
				return sum + num;
			}, 0);
			if (num > 0) {
				await player.draw(num);
			}
			if (player.countCards("he") > 0) {
				await player.chooseToDiscard(2, "he", true);
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//新谋郭嘉
	xianmou: {
		mark: true,
		marktext: "☯",
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			player.changeSkin({ characterName: "yj_sb_guojia" }, "yj_sb_guojia" + (player.storage[skill] ? "_shadow" : ""));
		},
		intro: {
			content(storage) {
				if (!storage) {
					return "你失去过牌的回合结束时，你可以观看牌堆顶五张牌并获得至多X张牌，若未获得X张牌则获得〖遗计〗直到再发动此项（X为你本回合失去牌数）";
				}
				return "你失去过牌的回合结束时，你可以观看一名角色手牌并弃置其中至多X张牌，若弃置X张牌则你进行一次【闪电】判定（X为你本回合失去牌数）";
			},
		},
		audio: 2,
		audioname: ["yj_sb_guojia_shadow"],
		trigger: {
			global: "phaseEnd",
		},
		filter(event, player) {
			return player.getHistory("lose", evt => evt.cards2 && evt.cards2.length).length;
		},
		getNum(player) {
			let num = 0;
			player.getHistory("lose", evt => {
				if (evt.cards2) {
					num += evt.cards2.length;
				}
			});
			return num;
		},
		async cost(event, trigger, player) {
			let num = get.info(event.skill)?.getNum(player);
			if (player.storage[event.skill]) {
				event.result = await player
					.chooseTarget(get.prompt(event.skill), `观看一名角色手牌并弃置其中至多${num}张牌`, function (card, player, target) {
						return target.countCards("h");
					})
					.set("ai", function (target) {
						const player = _status.event.player;
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					})
					.forResult();
			} else {
				event.result = await player.chooseBool(get.prompt(event.skill), `观看牌堆顶五张牌并获得至多${num}张牌`).forResult();
			}
			event.result.cost_data = num;
		},
		async content(event, trigger, player) {
			let num = event.cost_data;
			player.changeZhuanhuanji(event.name);
			if (player.storage[event.name]) {
				player.addAdditionalSkills(event.name, []);
				let cards = game.cardsGotoOrdering(get.cards(5)).cards;
				const result = await player
					.chooseButton([`是否获得至多${num}张牌？`, cards], [1, num])
					.set("ai", function (button) {
						if (ui.selected.buttons.length + 1 >= _status.event.maxNum) {
							return 0;
						}
						return get.value(button.link);
					})
					.set("maxNum", num)
					.forResult();
				if (result.bool) {
					await player.gain(result.links, "gain2");
					cards.removeArray(result.links);
				}
				await game.cardsGotoPile(cards.reverse(), "insert");
				if (!result.bool || result.links.length < num) {
					await player.addAdditionalSkills(event.name, get.info(event.name)?.derivation);
				}
			} else {
				const target = event.targets[0];
				const result = await player
					.discardPlayerCard(target, "h", `是否弃置${get.translation(target)}至多${num}张牌?`, [1, num], "visible")
					.set("ai", function (button) {
						if (ui.selected.buttons.length + 1 >= _status.event.maxNum) {
							return 5 - get.value(button.link);
						}
						return get.value(button.link);
					})
					.set("maxNum", num)
					.forResult();
				if (result?.bool && result.links?.length >= num) {
					await player.executeDelayCardEffect("shandian");
				}
			}
		},
		derivation: "new_reyiji",
		group: "xianmou_change",
		subSkill: {
			change: {
				audio: "xianmou",
				audioname: ["yj_sb_guojia_shadow"],
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【先谋】为状态" + (player.storage.xianmou ? "阳" : "阴");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("xianmou");
				},
			},
		},
	},
	lunshi: {
		audio: 2,
		audioname: ["yj_sb_guojia_shadow"],
		position: "hs",
		enable: "chooseToUse",
		filter(event, player) {
			if (!player.countCards("hs")) {
				return false;
			}
			if (player.countCards("h", { color: "black" }) != player.countCards("h", { color: "red" })) {
				return false;
			}
			if (event.type != "wuxie") {
				return false;
			}
			let info = event.info_map;
			if (!info || get.type(info.card) != "trick") {
				return false;
			}
			return info.player != info.target;
		},
		filterCard: true,
		viewAs: {
			name: "wuxie",
		},
		viewAsFilter(player) {
			if (!player.countCards("hs")) {
				return false;
			}
			if (player.countCards("h", { color: "black" }) != player.countCards("h", { color: "red" })) {
				return false;
			}
			return true;
		},
		prompt: "将一张手牌当无懈可击使用",
		check(card) {
			return 8 - get.value(card);
		},
		group: "lunshi_nowuxie",
		subSkill: {
			nowuxie: {
				trigger: {
					player: "useCard",
				},
				forced: true,
				locked: false,
				popup: false,
				filter(event, player) {
					return event.card.name == "wuxie" && event.skill && event.skill == "lunshi";
				},
				content() {
					trigger.directHit.addArray(game.players);
				},
			},
		},
	},
	//荀彧荀攸 - 想你了
	zhinang: {
		getMap() {
			if (!_status.zhinang_map) {
				_status.zhinang_map = {
					name: {},
					info: {},
				};
				let list;
				if (_status.connectMode) {
					list = get.charactersOL();
				} else {
					list = get.gainableCharacters();
				}
				list.forEach(name => {
					if (name !== "xunyuxunyou") {
						const skills = get.character(name, 3);
						skills.forEach(skill => {
							const info = get.info(skill);
							if (!info || (info.ai && info.ai.combo)) {
								return;
							}
							if (skill in _status.zhinang_map) {
								return;
							}
							if (get.translation(skill).includes("谋")) {
								_status.zhinang_map.name[skill] = name;
							}
							const voices = get.Audio.skill({ skill, name }).textList;
							if (voices.some(data => data.includes("谋"))) {
								_status.zhinang_map.info[skill] = name;
							}
						});
					}
				});
			}
			return _status.zhinang_map;
		},
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			return ["trick", "equip"].includes(get.type2(event.card));
		},
		prompt2(event, player) {
			const type = get.type2(event.card),
				name = `zhinang_${type}`,
				skills = player.getRemovableAdditionalSkills(name);
			let str = `获得一个技能${type == "trick" ? "台词" : "名"}包含“谋”的技能`;
			if (skills.length) {
				str = `失去${skills.map(skill => `【${get.translation(skill)}】`)}并${str}`;
			}
			return str;
		},
		async content(event, trigger, player) {
			const map = lib.skill.zhinang.getMap(),
				type = get.type2(trigger.card) == "equip" ? "name" : "info",
				list = Object.keys(map[type]);
			if (list.length > 0) {
				const skill = list.randomGet(),
					voiceMap = get.Audio.skill({ skill, player: map[type][skill] }).audioList;
				if (type == "info") {
					findaudio: for (let data of voiceMap) {
						if (!data.text) {
							continue;
						}
						if (data.text.includes("谋")) {
							player.chat(data.text);
							game.broadcastAll(file => game.playAudio(file), data.file);
							break findaudio;
						}
					}
				} else {
					player.flashAvatar("zhinang", map[type][skill]);
				}
				await player.addAdditionalSkills(`zhinang_${get.type2(trigger.card)}`, skill);
			}
		},
		init(player, skill) {
			player.addSkill(["zhinang_equip", "zhinang_trick"]);
		},
		onremove(player, skill) {
			player.removeSkill(["zhinang_equip", "zhinang_trick"]);
		},
		subSkill: {
			equip: {},
			trick: {},
		},
	},
	gouzhu: {
		trigger: {
			player: "changeSkillsAfter",
		},
		filter(_1, player, _3, skill) {
			let list = get.skillCategoriesOf(skill, player);
			return list.length && list.some(item => item in lib.skill.gouzhu.effectMap);
		},
		getIndex(event, player) {
			if (!event.removeSkill.length) {
				return false;
			}
			return event.removeSkill;
		},
		prompt(_1, _2, _3, skill) {
			return `失去了技能【${get.translation(skill)}】，是否发动【苟渚】？`;
		},
		frequent: true,
		effectMap: {
			锁定技: async function () {
				let player = _status.event.player;
				if (player.isDamaged()) {
					await player.recover();
				}
			},
			觉醒技: async function () {
				let player = _status.event.player;
				let card = get.cardPile(card => get.type(card) == "basic");
				if (card) {
					await player.gain(card, "gain2");
				}
			},
			限定技: async function () {
				let player = _status.event.player;
				let target = game.filterPlayer(current => current != player).randomGet();
				if (target) {
					player.line(target, "green");
					await target.damage(player);
				}
			},
			转换技: async function () {
				let player = _status.event.player;
				player.addMark("gouzhu", 1, false);
				game.log(player, "手牌上限+1");
				await game.delay();
			},
			主公技: async function () {
				let player = _status.event.player;
				await player.gainMaxHp();
			},
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("gouzhu");
			},
		},
		intro: {
			content: "手牌上限+#",
		},
		locked: false,
		onremove: true,
		async content(event, trigger, player) {
			let skill = event.indexedData;
			let list = get.skillCategoriesOf(skill, player);
			for (const item of list) {
				if (item in lib.skill.gouzhu.effectMap) {
					const next = game.createEvent("gouzhu_effect", false);
					next.player = player;
					next.setContent(lib.skill.gouzhu.effectMap[item]);
					await next;
				}
			}
		},
	},
	//一将2024
	//令狐愚
	xvzhi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return (
				game.countPlayer(target => {
					return lib.skill.xvzhi.filterTarget(null, player, target);
				}) > 1
			);
		},
		filterTarget(card, player, target) {
			const stat = player.getStat("xvzhi");
			return target.countCards("h") && (!stat || !stat.includes(target));
		},
		selectTarget: 2,
		usable: 1,
		multiline: true,
		multitarget: true,
		async content(event, trigger, player) {
			const targets = event.targets;
			if (!player.getStat().xvzhi) {
				player.getStat().xvzhi = [];
			}
			player.getStat().xvzhi.addArray(targets);
			if (targets.some(i => !i.countCards("h"))) {
				return;
			}
			const next = player.chooseCardOL(targets, "h", true, [1, Infinity], "蓄志：选择任意张手牌并与对方交换", "allowChooseAll").set("ai", card => {
				const player = get.event().player,
					target = get
						.event()
						.getParent(2)
						.targets.find(i => i != player);
				const sha = new lib.element.VCard({ name: "sha", isCard: true });
				const playerEffect = player.hasUseTarget(sha, false)
					? Math.max(
							...game
								.filterPlayer(current => player.canUse(sha, current, false))
								.map(current => {
									return get.effect(current, sha, player, player);
								})
						)
					: 0;
				const targetEffect = target.hasUseTarget(sha, false)
					? Math.max(
							...game
								.filterPlayer(current => target.canUse(sha, current, false))
								.map(current => {
									return get.effect(current, sha, player, player);
								})
						)
					: 0;
				return 5 + 2 * get.sgn(playerEffect - targetEffect) - get.value(card);
			});
			next._args.remove("glow_result");
			const result = await next.forResult();
			await targets[0].swapHandcards(targets[1], result[0].cards, result[1].cards);
			if (result[0].cards.length == result[1].cards.length) {
				await player.draw(2);
				player.getStat("skill").xvzhi--;
			} else {
				const aim = targets[result[0].cards.length > result[1].cards.length ? 0 : 1];
				const sha = new lib.element.VCard({ name: "sha", isCard: true });
				if (aim.hasUseTarget(sha, false)) {
					await aim.chooseUseTarget(sha, true, false, "nodistance");
				}
			}
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					return get.sgn(get.attitude(player, target)) * target.countCards("h");
				},
			},
		},
	},
	//司马孚
	beiyu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") < player.maxHp;
		},
		usable: 1,
		manualConfirm: true,
		async content(event, trigger, player) {
			await player.drawTo(player.maxHp);
			if (!player.countCards("h")) {
				return;
			}
			const list = get.addNewRowList(player.getCards("h"), "suit", player);
			const result = await player
				.chooseButton([
					[
						[[`备预：将一种花色的手牌置于牌堆底`], "addNewRow"],
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
					return button.links.length > 0;
				})
				.set("ai", button => {
					const player = get.player();
					const { links } = button;
					return Math.max(1, 5 - links.length);
				})
				.forResult();
			if (result?.links?.length) {
				const [suit] = result.links,
					cards = player.getCards("h", card => get.suit(card, player) == suit);
				if (cards.length) {
					let resultx;
					if (cards.length == 1) {
						resultx = { bool: true, moved: [cards] };
					} else {
						resultx = await player
							.chooseToMove("备预：将牌按顺序置于牌堆底", true)
							.set("list", [["牌堆底", cards]])
							.set("processAI", list => {
								return [list[0][1].slice(0)];
							})
							.forResult();
					}
					if (resultx?.bool) {
						const moved = resultx.moved[0];
						if (moved.length) {
							game.log(player, `将${get.cnNumber(moved.length)}张牌置于牌堆底`);
							player.$throw(moved.length, 1000);
							await player.lose(moved, ui.cardPile);
							/*for (let i = 0; i < moved.length; i++) {
								const card = moved[i];
								card.fix();
								ui.cardPile.appendChild(card);
							}*/
						}
					}
				}
			}
		},
		ai: {
			order: 0.001,
			result: { player: 1 },
		},
	},
	duchi: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.player != player;
		},
		usable: 1,
		logTarget: "player",
		check(event, player) {
			return get.effect(player, event.card, event.player, player) <= 0;
		},
		async content(event, trigger, player) {
			await player.draw().set("bottom", true);
			if (player.countCards("h")) {
				await player.showHandcards(get.translation(player) + "发动了【督持】");
				const colors = player.getCards("h").reduce((list, card) => list.add(get.color(card)), []);
				if (colors.length == 1) {
					player.popup("洗具");
					trigger.getParent().excluded.add(player);
					return;
				}
			}
			player.popup("杯具");
		},
		ai: { threaten: 0.8 },
	},
	//宣公主
	yjqimei: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event;
			await player.draw(2, "nodelay");
			await target.draw(2);
			const targets = [player, target].filter(current => current.countCards("h") > 1);
			if (targets.length) {
				const next = player.chooseCardOL(targets, "h", true, 2, "齐眉：请展示两张手牌");
				next._args.remove("glow_result");
				const result = await next.forResult();
				const videoId = lib.status.videoId++;
				game.broadcastAll(
					(targets, result, id, player) => {
						const dialog = ui.create.dialog(get.translation(player) + "发动了【齐眉】");
						dialog.videoId = id;
						for (let i = 0; i < result.length; i++) {
							dialog.add('<div class="text center">' + get.translation(targets[i]) + "展示</div>");
							dialog.add(result[i].cards);
						}
					},
					targets,
					result,
					videoId,
					player
				);
				let cards = result.reduce((list, evt) => {
					list.addArray(evt.cards);
					return list;
				}, []);
				await player.showCards(cards).set("dialog", videoId).set("delay_time", 4).set("multipleShow", true);
				const suits = cards.reduce((list, card) => list.add(get.suit(card)), []);
				switch (suits.length) {
					case 1:
						while (cards.length) {
							const card = cards.shift();
							if (player.hasUseTarget(card)) {
								player.$gain2(card, false);
								await game.delayx();
								await player.chooseUseTarget(true, card, false);
							}
						}
						break;
					case 2:
						for (const current of [player, target]) {
							if (!current.isIn()) {
								continue;
							}
							if (current.isLinked()) {
								await current.link(false);
							}
							if (current.isTurnedOver()) {
								await current.turnOver(false);
							}
						}
						break;
					case 3:
						for (let i = 0; i < result.length; i++) {
							const current = targets[i],
								cards = result[i].cards.filter(card => {
									return get.owner(card) === current && current.canRecast(card);
								});
							if (cards.length) {
								await current.recast(cards);
							}
						}
						break;
					case 4:
						await player.draw("nodelay");
						await target.draw();
						break;
				}
			}
		},
		ai: {
			order: 9,
			result: {
				target: 1,
			},
		},
	},
	yjzhuiji: {
		audio: 2,
		trigger: { player: "die" },
		filter(event, player) {
			return game.hasPlayer(target => {
				return (
					target != player &&
					Array.from({ length: 5 })
						.map((_, i) => i + 1)
						.some(i => target.hasEmptySlot(i))
				);
			});
		},
		forceDie: true,
		skillAnimation: true,
		animationColor: "water",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return (
						target != player &&
						Array.from({ length: 5 })
							.map((_, i) => i + 1)
							.some(i => target.hasEmptySlot(i))
					);
				})
				.set("ai", target => {
					const player = get.event().player;
					return (
						get.sgn(get.attitude(player, target)) *
						Array.from({ length: 5 })
							.map((_, i) => i + 1)
							.reduce((sum, i) => sum + target.countEmptySlot(i), 0)
					);
				})
				.set("forceDie", true)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let num = 1,
				cards = [];
			while (num <= 5) {
				while (target.hasEmptySlot(num)) {
					const card = get.cardPile2(card => {
						return !cards.includes(card) && get.subtype(card) == "equip" + num && target.canUse(card, target);
					}, "random");
					if (card) {
						cards.push(card);
						target.$gain2(card, false);
						await game.delayx();
						await target.chooseUseTarget(card, true, "nopopup");
					} else {
						break;
					}
				}
				num++;
			}
			if (cards.length) {
				target.addSkill("yjzhuiji_buff");
				target.markAuto("yjzhuiji_buff", cards);
			}
		},
		subSkill: {
			buff: {
				charlotte: true,
				mod: {
					aiValue(player, card, num) {
						if (player.getStorage("yjzhuiji_buff").includes(card)) {
							return num + 100;
						}
					},
					aiUseful(player, card, num) {
						if (player.getStorage("yjzhuiji_buff").includes(card)) {
							return num / 114514;
						}
					},
				},
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					const evt = event.getl(player);
					return evt && evt.es && evt.es.some(i => player.getStorage("yjzhuiji_buff").includes(i));
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					const evt = trigger.getl(player);
					const cards = evt.es.filter(i => player.getStorage("yjzhuiji_buff").includes(i));
					player.unmarkAuto("yjzhuiji_buff", cards);
					for (const card of cards) {
						player.disableEquip(get.subtype(card));
					}
				},
				intro: {
					mark(dialog, storage) {
						if (storage && storage.length) {
							dialog.addSmall([storage, "vcard"]);
						} else {
							return "暂无装备";
						}
					},
				},
			},
		},
	},
	//徐琨（菜不菜我不知道）
	fazhu: {
		audio: 3,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.hasCard(card => !get.is.damageCard(card) && player.canRecast(card), "hej");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.choosePlayerCard(get.prompt(event.name.slice(0, -5)), player, "hej", [1, Infinity], "allowChooseAll")
				.set("ai", button => {
					const card = button.link;
					if (get.position(card) == "j") {
						return 10;
					}
					return 6 - get.value(card);
				})
				.set("filterButton", button => {
					const card = button.link,
						player = get.player();
					return !get.is.damageCard(card) && player.canRecast(card);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.recast(event.cards);
			const cards = player
				.getHistory("gain", evt => evt.getParent(3) == event)
				.reduce((list, evt) => {
					list.addArray(evt.cards);
					return list;
				}, []);
			let num = Math.min(cards.length, game.countPlayer()),
				list = [];
			if (!num) {
				return;
			}
			if (_status.connectMode) {
				game.broadcastAll(() => (_status.noclearcountdown = true));
			}
			while (num - list.length > 0 && cards.some(i => get.owner(i) == player && get.position(i) == "h" && !i.hasGaintag("olsujian_given"))) {
				const result = await player
					.chooseCardTarget({
						prompt: "筏铸：将以此法获得的牌交给任意角色各一张",
						position: "he",
						animate: false,
						filterCard(card, player) {
							if (!get.event().cards.includes(card)) {
								return false;
							}
							return !get.event().list.some(list => list[1] == card);
						},
						filterTarget(card, player, target) {
							return !get.event().list.some(list => list[0] == target);
						},
						ai1(card) {
							if (card.name == "sha") {
								return 2.5;
							}
							return 1 + Math.random();
						},
						ai2(target) {
							return get.attitude(get.event().player, target);
						},
					})
					.set("forced", !list.length)
					.set("list", list)
					.set("cards", cards)
					.forResult();
				if (result.bool) {
					list.push([result.targets[0], result.cards[0]]);
					player.addGaintag(result.cards, "olsujian_given");
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
				const targets = list.slice().map(list => list[0]);
				await game
					.loseAsync({
						gain_list: list,
						player: player,
						cards: list.slice().flatMap(list => list[1]),
						giver: player,
						animate: "giveAuto",
					})
					.setContent("gaincardMultiple");
				for (const target of targets) {
					await target
						.chooseToUse(function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.cardEnabled.apply(this, arguments);
						})
						.set("openskilldialog", "筏铸：是否使用一张【杀】（无距离限制）？")
						.set("norestore", true)
						.set("custom", {
							add: {},
							replace: { window() {} },
						})
						.set("targetRequired", true)
						.set("complexSelect", true)
						.set("filterTarget", function (card, player, target) {
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("addCount", false);
				}
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (!card || get.type(card) != "delay") {
						return;
					}
					if (!get.tag(card, "damage") && target.canRecast(card)) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	//一将2023
	//孙礼
	kangli: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		forced: true,
		locked: false,
		content() {
			player.draw(2).gaintag = ["kangli"];
			player.when({ source: "damageBegin1" }).step(async () => {
				var cards = player.getCards("h", card => card.hasGaintag("kangli") && lib.filter.cardDiscardable(card, player, "kangli"));
				if (cards.length) {
					await player.discard(cards);
				}
			});
		},
		ai: {
			maixie: true,
		},
	},
	//夏侯楙
	tongwei: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he", card => lib.skill.tongwei.filterCard(card, player)) > 1 && game.hasPlayer(i => i != player);
		},
		filterTarget: lib.filter.notMe,
		filterCard: lib.filter.cardRecastable,
		selectCard: 2,
		position: "he",
		discard: false,
		lose: false,
		delay: false,
		popname: true,
		check(card) {
			var num = 6.5;
			if (ui.selected.cards.length) {
				var cardx = ui.selected.cards[0];
				num = get.number(cardx);
			}
			var del = Math.abs(get.number(card) - num);
			return 5 + del / 5 - get.value(card);
		},
		content() {
			"step 0";
			player.recast(cards);
			"step 1";
			const numbers = cards.map(c => get.number(c, player)).sort((a, b) => a - b);
			target.when("useCard1").step(async (event, trigger, player) => {
				trigger._tongwei_checked = true;
			});
			const playerx = player;
			target
				.when("useCardAfter")
				.assign({
					mod: {
						aiOrder(player, card, num) {
							var number = get.number(card);
							if (typeof number != "number" || number < numbers[0] || number > numbers[1]) {
								return num + 10;
							}
						},
					},
				})
				.filter((event, player) => {
					return event._tongwei_checked;
				})
				.step(async (event, trigger, player) => {
					const number = get.number(trigger.card);
					if (typeof number != "number" || number < numbers[0] || number > numbers[1]) {
						return;
					}
					const names = ["sha", "guohe"].filter(name => playerx.canUse({ name: name, isCard: true }, player, false));
					let result;
					if (!names.length) {
						return;
					} else if (names.length == 1) {
						result = { links: [[null, null, names[0]]] };
					} else {
						result = await playerx
							.chooseButton([`请选择要视为对${get.translation(player)}使用的牌`, [names, "vcard"]], true)
							.set("ai", button => {
								return button.link[0][2] == _status.event.choice;
							})
							.set(
								"choice",
								(function () {
									const list = names
										.map(name => {
											return [name, get.effect(player, { name: name, isCard: true }, playerx, playerx)];
										})
										.sort((a, b) => {
											return b[1] - a[1];
										});
									return list[0][0];
								})()
							)
							.forResult();
					}
					const name = result.links[0][2];
					const card = { name: name, isCard: true };
					if (playerx.canUse(card, player, false)) {
						await playerx.useCard(card, player, "tongwei");
					}
				});
		},
		ai: {
			expose: 0.2,
			order: 7,
			threaten: 2.2,
			result: {
				target: -1,
			},
		},
	},
	cuguo: {
		audio: 2,
		trigger: { player: ["shaMiss", "eventNeutralized"] },
		filter(event, player) {
			if (event.type != "card" && event.name != "_wuxie") {
				return false;
			}
			if (
				!event.target ||
				!event.target.isIn() ||
				!player.canUse(
					{
						name: event.card.name,
						nature: event.card.nature,
						isCard: true,
					},
					event.target,
					false
				)
			) {
				return false;
			}
			if (!player.hasCard(card => lib.filter.cardDiscardable(card, player), "he")) {
				return false;
			}
			const history = game.getGlobalHistory("everything", evt => {
				if (evt._neutralized || (evt.responded && (!evt.result || !evt.result.bool))) {
					var evtx = evt.getParent();
					return evtx.name == "useCard" && evtx.player == player;
				}
			});
			return history.length == 1;
		},
		locked: true,
		async cost(event, trigger, player) {
			const card = {
				name: trigger.card.name,
				nature: trigger.card.nature,
				isCard: true,
				storage: { cuguo: true },
			};
			event.result = await player
				.chooseToDiscard("蹙国：请弃置一张牌", `视为你对${get.translation(trigger.target)}使用一张${get.translation(card.nature || "")}【${get.translation(card.name)}】`, "he", true)
				.set("logSkill", [event.skill, trigger.target])
				.forResult();
		},
		async content(event, trigger, player) {
			const card = {
				name: trigger.card.name,
				nature: trigger.card.nature,
				isCard: true,
				storage: { cuguo: true },
			};
			if (player.canUse(card, trigger.target, false)) {
				const next = player.useCard(card, trigger.target);
				player
					.when("useCardAfter")
					.filter(event => {
						return event.card.storage?.cuguo && event == next;
					})
					.step(async (event, trigger, player) => {
						if (
							game.hasGlobalHistory("everything", evt => {
								if (evt._neutralized || (evt.responded && (!evt.result || !evt.result.bool))) {
									if (evt.getParent() == trigger) {
										return true;
									}
								}
								return false;
							})
						) {
							await player.loseHp();
						}
					});
				await next;
			}
		},
	},
	//陈式
	qingbei: {
		audio: 2,
		trigger: {
			global: "roundStart",
			player: "useCardAfter",
		},
		filter(event, player) {
			if (event.name != "useCard") {
				return true;
			}
			if (!player.getStorage("qingbei_effect").length) {
				return false;
			}
			const suit = get.suit(event.card);
			if (!suit) {
				return false;
			}
			return suit !== "none";
		},
		async cost(event, trigger, player) {
			if (trigger.name == "useCard") {
				event.result = {
					bool: true,
				};
				return;
			}
			const result = await player
				.chooseButton([`###${get.prompt(event.skill)}###<div class='text center'>选择任意个花色，令你本轮不能使用这些花色的牌</div>`, [lib.suit.map(i => ["", "", "lukai_" + i]), "vcard"]], [1, 4])
				.set("ai", button => {
					const player = get.player(),
						suit = button.link[2].slice(6),
						val = player
							.getCards("hs", { suit: suit })
							.map(card => {
								return get.value(card) + player.getUseValue(card) / 3;
							})
							.reduce((sum, value) => {
								return sum + value;
							}, 0);
					if (val > 10 && ui.selected.buttons.length > 0) {
						return -1;
					}
					if (val > 6 && ui.selected.buttons.length == 2) {
						return -1;
					}
					if (ui.selected.buttons.length == 3) {
						return -1;
					}
					return 1 + 1 / val;
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				event.result = {
					bool: true,
					cost_data: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				await player.draw(player.getStorage("qingbei_effect").length, "nodelay");
				return;
			}
			const { name, cost_data: links } = event;
			const suits = links.map(i => i[2].slice(6)).sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
			const skill = `${name}_effect`;
			player.addTempSkill(skill, "roundStart");
			player.setStorage(skill, suits, true);
			player.addTip(skill, `${get.translation(skill)}${suits.map(i => get.translation(i)).join("")}`);
		},
		ai: {
			threaten: 2.3,
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				mark: true,
				intro: {
					content: `本轮内不能使用$花色的牌`,
				},
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("qingbei_effect").includes(get.suit(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (player.getStorage("qingbei_effect").includes(get.suit(card))) {
							return false;
						}
					},
				},
			},
		},
	},
	//费曜
	zhenfeng: {
		audio: 2,
		trigger: { global: "useCard" },
		usable: 1,
		filter(event, player) {
			return event.player != player && event.player == _status.currentPhase && event.player.countCards("h") <= event.player.getHp();
		},
		check(event, player) {
			var type = get.type2(event.card, event.player);
			if (type == "equip" && event.player.hasCard(card => event.player.hasValueTarget(card))) {
				return false;
			}
			if (get.attitude(player, event.player) > 0 && (!event.player.isAllCardsKnown(player) || 2 * event.player.getHp() + 0.7 * event.player.countCards("hs") <= 6 - player.countMark("zhenfeng"))) {
				return false;
			}
			return true;
		},
		onremove: true,
		logTarget: "player",
		content() {
			"step 0";
			var choices = Array.from({ length: trigger.player.countCards("h") + 1 }).map((_, i) => get.cnNumber(i, true));
			var type = get.type2(trigger.card, trigger.player);
			player
				.chooseControl(choices)
				.set("prompt", "镇锋：猜测其手牌中的" + get.translation(type) + "牌数")
				.set("ai", () => {
					return _status.event.choice;
				})
				.set(
					"choice",
					(function () {
						var num = trigger.player.countCards("h", card => get.type2(card) == type);
						var knownNum = trigger.player.countKnownCards(_status.event.player, card => get.type2(card) == type);
						if (trigger.player.isAllCardsKnown(_status.event.player)) {
							return knownNum;
						}
						var restNum = num - knownNum;
						var numx;
						if (type == "basic") {
							numx = num + Math.floor(Math.random() * restNum + 1);
						} else if (type == "trick") {
							if (num > 2) {
								numx = 2;
							} else {
								numx = 1;
							}
							if (Math.random() < 0.5) {
								numx += Math.random() > 0.5 ? 1 : -1;
							}
						} else {
							numx = [0, 1].randomGet();
						}
						if (numx < knownNum) {
							numx = knownNum;
						} else if (numx >= choices.length) {
							numx = choices.length - 1;
						}
						return numx;
					})()
				);
			"step 1";
			var type = get.type2(trigger.card, trigger.player);
			var guessedNum = result.index;
			player.chat("我猜" + get.cnNumber(guessedNum) + "张");
			game.log(player, "猜测", trigger.player, "有", get.cnNumber(guessedNum) + "张" + get.translation(type) + "牌");
			event.guessedNum = guessedNum;
			game.delay();
			"step 2";
			var type = get.type2(trigger.card, trigger.player);
			var count = trigger.player.countCards("h", card => get.type2(card) == type);
			var guessedNum = event.guessedNum;
			if (count == guessedNum) {
				player.popup("洗具");
				game.log(player, "猜测", "#g正确");
				if (player.countMark("zhenfeng") < 5) {
					player.addMark("zhenfeng", 1, false);
				}
				player.draw(player.countMark("zhenfeng"));
				if (player.canUse("sha", trigger.player, false)) {
					player.useCard({ name: "sha", isCard: true }, trigger.player);
				}
			} else {
				player.popup("杯具");
				game.log(player, "猜测", "#y错误");
				player.clearMark("zhenfeng");
				if (Math.abs(count - guessedNum) > 1 && trigger.player.canUse("sha", player, false)) {
					trigger.player.useCard({ name: "sha", isCard: true }, player, false, "noai");
				}
			}
		},
		intro: {
			content: "已连续猜对#次",
		},
	},
	//新杀小加强 李严
	dcduliang: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target && target.countCards("he") > 0;
		},
		audio: "duliang",
		async content(event, trigger, player) {
			const { target } = event;
			await player.gainPlayerCard(target, "he", true);
			const name = get.translation(target);
			const result = await player
				.chooseControl(function () {
					return Math.random() < 0.5 ? "选项一" : "选项二";
				})
				.set("prompt", "督粮：请选择一项")
				.set("choiceList", ["你观看牌堆顶的两张牌，然后令" + name + "获得其中的一或两张基本牌", "令" + name + "于下回合的摸牌阶段额外摸一张牌"])
				.forResult();
			if (result.control == "选项一") {
				const cards = get.cards(2, true);
				let bool = false;
				await game.cardsGotoOrdering(cards);
				for (const card of cards) {
					if (get.type(card) == "basic") {
						bool = true;
						break;
					}
				}
				const result = await player
					.chooseButton(["督粮：选择令" + get.translation(target) + "获得的牌", cards], [1, 2], bool)
					.set("filterButton", button => {
						return get.type(button.link) == "basic";
					})
					.set("ai", button => {
						return _status.event.sgn * get.value(button.link);
					})
					.set("sgn", get.sgnAttitude(player, target) > 0)
					.forResult();
				if (result.links?.length) {
					const cardsx = result.links;
					await target.gain(cardsx, "draw");
					game.log(target, "获得了" + get.cnNumber(cardsx.length) + "张牌");
					cards.removeArray(cardsx);
					await game.cardsGotoPile(cards.reverse(), "insert");
				}
			} else {
				target.addTempSkill("dcduliang2", { player: "phaseAfter" });
				target.addMark("dcduliang2", 1, false);
			}
		},
		ai: {
			order: 4,
			result: {
				target: -1,
				player: 0.1,
			},
		},
	},
	dcduliang2: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		mark: true,
		audio: false,
		onremove: true,
		charlotte: true,
		intro: {
			content: "下回合的摸牌阶段额外摸#张牌",
		},
		sourceSkill: "dcduliang",
		content() {
			trigger.num += player.countMark("dcduliang2");
		},
	},
	//苏飞
	shuojian: {
		audio: 2,
		enable: "phaseUse",
		usable: 3,
		filterTarget: lib.filter.notMe,
		filterCard: true,
		position: "he",
		discard: false,
		lose: false,
		delay: false,
		check(card, player) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			player.give(cards, target);
			"step 1";
			var num = 3 - get.skillCount("shuojian") + 1;
			event.num = num;
			event.num2 = num;
			if (event.num == 0) {
				event.finish();
			}
			"step 2";
			var forced = num != event.num2;
			var prompt = "###" + get.translation(player) + "对你发动了【数谏】###视为使用" + get.cnNumber(num) + "张【过河拆桥】" + (forced ? "" : "且" + get.translation(player) + "此技能本回合失效，或点击“取消”令其摸" + get.cnNumber(num) + "张牌");
			if (!target.hasUseTarget({ name: "guohe" })) {
				event._result = { bool: false };
			} else {
				target
					.chooseUseTarget(prompt, "guohe", forced)
					.set("ai", function () {
						var evt = _status.event;
						if (evt.name == "chooseTarget") {
							evt = evt.getParent();
						}
						if (!evt.goon) {
							return 0;
						}
						return get.effect_use.apply(this, arguments);
					})
					.set("goon", target.getUseValue({ name: "guohe" }) > (get.sgnAttitude(target, player) * player.getUseValue({ name: "wuzhong" })) / (2 - num * 0.4));
			}
			"step 3";
			if (!result.bool) {
				player.draw(num);
				if (num > 1) {
					player.chooseToDiscard("he", num - 1, true);
				}
				event.finish();
			}
			"step 4";
			if (--event.num2 > 0) {
				event.goto(2);
			} else {
				player.tempBanSkill("shuojian");
			}
		},
		ai: {
			expose: 0.15,
			order: 8,
			result: { target: 1 },
		},
	},
	//谯周
	shiming: {
		audio: 2,
		trigger: { global: "phaseDrawBegin1" },
		filter(event, player) {
			return !player.hasSkill("shiming_round");
		},
		check(event, player) {
			return true; //get.attitude(player,event.player)<0||get.damageEffect(event.player,event.player,player)>0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.addTempSkill("shiming_round", "roundStart");
			const {
				targets: [target],
			} = event;
			const cards = get.cards(3, true);
			const result = await player
				.chooseButton(["识命：是否将其中一张置于牌堆底？", cards.slice(0)])
				.set("ai", button => {
					var att = _status.event.att,
						damage = _status.event.damage,
						val = get.value(button.link, _status.event.player);
					if ((att > 0 && damage < 0) || (att <= 0 && damage > 0)) {
						return 6 - val;
					}
					return val - 5.99;
				})
				.set("att", get.attitude(player, target))
				.set("damage", get.damageEffect(target, target, player) > 0 && target.hp <= 3 ? 1 : -1)
				.forResult();
			if (result.bool && result.links?.length) {
				const { links: cards } = result;
				player.popup("一下", "wood");
				game.log(player, "将一张牌置于了牌堆底");
				await game.cardsGotoPile(cards);
			}
			const result2 = await target
				.chooseBool("是否跳过摸牌阶段并对自己造成1点伤害，然后从牌堆底摸三张牌？")
				.set("ai", () => _status.event.bool)
				.set("bool", get.damageEffect(target, target) >= -6 || target.hp > 3)
				.forResult();
			if (result2.bool) {
				trigger.cancel();
				await target.damage(target);
				await target.draw(3);
			}
		},
		subSkill: {
			round: {
				mark: true,
				intro: { content: "本轮已发动〖识命〗" },
			},
		},
	},
	jiangxi: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			var zhu = game.findPlayer(i => i.getSeatNum() == 1);
			return (
				(zhu &&
					player.hasSkill("shiming_round") &&
					(game.getGlobalHistory("changeHp", evt => {
						return evt.player == zhu && evt._dyinged;
					}).length > 0 ||
						zhu.getHistory("damage").length == 0)) ||
				!game.hasPlayer2(current => current.getHistory("damage").length > 0)
			);
		},
		direct: true,
		seatRelated: true,
		content() {
			"step 0";
			var zhu = game.findPlayer(i => i.getSeatNum() == 1);
			if (zhu && player.hasSkill("shiming_round")) {
				if (
					game.getGlobalHistory("changeHp", evt => {
						return evt.player == zhu && evt._dyinged;
					}).length > 0 ||
					zhu.getHistory("damage").length == 0
				) {
					player.chooseBool(get.prompt("jiangxi"), "重置〖识命〗");
				}
			} else {
				event.goto(2);
			}
			"step 1";
			if (result.bool) {
				player.logSkill("jiangxi");
				event.logged = true;
				player.removeSkill("shiming_round");
				player.draw();
			}
			"step 2";
			if (!game.hasPlayer2(current => current.getHistory("damage").length > 0)) {
				player.chooseBool(get.prompt("jiangxi"), "与" + get.translation(trigger.player) + "各摸一张牌").set(
					"choice",
					(() => {
						let eff = current => get.effect(current, { name: "draw" }, player, player);
						return eff(trigger.player) + eff(player) > 0;
					})()
				);
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				if (!event.logged) {
					player.logSkill("jiangxi");
				}
				trigger.player.draw("nodelay");
				player.draw();
			}
		},
	},
	//韩龙
	duwang: {
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
			var cards = [];
			for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
				var card = ui.cardPile.childNodes[i];
				if (card.name != "sha") {
					cards.push(card);
				}
				if (cards.length >= 5) {
					break;
				}
			}
			if (cards.length) {
				player.addToExpansion(cards, "gain2").gaintag.add("duwang");
			}
		},
		marktext: "刺",
		intro: {
			name: "刺",
			name2: "刺",
			content: "expansion",
			markcount: "expansion",
		},
		mod: {
			globalFrom(from, to, distance) {
				return distance + Math.min(1, from.getExpansions("duwang").filter(i => i.name != "sha").length);
			},
			globalTo(from, to, distance) {
				return distance + Math.min(1, to.getExpansions("duwang").filter(i => i.name != "sha").length);
			},
		},
	},
	cibei: {
		audio: 2,
		trigger: { global: "cardsDiscardAfter" },
		filter(event, player) {
			if (!player.getExpansions("duwang").filter(i => i.name != "sha").length) {
				return false;
			}
			var evt = event.getParent();
			if (evt.name != "orderingDiscard") {
				return false;
			}
			var evtx = evt.relatedEvent || evt.getParent();
			return (
				evtx.name == "useCard" &&
				evtx.card.name == "sha" &&
				evtx.card.isCard &&
				event.cards.filterInD("d").length &&
				game.hasPlayer2(current =>
					current.hasHistory("sourceDamage", evtxx => {
						return evtxx.card == evtx.card;
					})
				)
			);
		},
		direct: true,
		group: "cibei_fullyReady",
		content() {
			"step 0";
			player.chooseButton(["###" + get.prompt(event.name) + '###<div class="text center">将一张“刺”置入弃牌堆，并将' + get.translation(trigger.cards.filterInD("d")) + "置入“刺”</div>", player.getExpansions("duwang")]).set("filterButton", button => {
				return button.link.name != "sha";
			});
			"step 1";
			if (result.bool) {
				player.logSkill(event.name);
				player.loseToDiscardpile(result.links);
				player.addToExpansion(trigger.cards.filterInD("d"), "gain2").gaintag.add("duwang");
				if (game.hasPlayer(current => current.countDiscardableCards(player, "hej") > 0)) {
					player
						.chooseTarget("刺北：弃置一名角色区域内的一张牌", true, (card, player, target) => {
							return target.countDiscardableCards(player, "hej") > 0;
						})
						.set("ai", target => {
							return get.effect(target, { name: "guohe" }, _status.event.player);
						});
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				player.discardPlayerCard(target, "hej", true);
				player.addExpose(0.1);
			}
		},
		ai: {
			combo: "duwang",
		},
		subSkill: {
			fullyReady: {
				audio: "cibei",
				trigger: { global: "phaseEnd" },
				forced: true,
				locked: false,
				filter(event, player) {
					var storage = player.getExpansions("duwang");
					return storage.length > 0 && storage.every(i => i.name == "sha");
				},
				content() {
					player.gain(player.getExpansions("duwang"), "gain2").gaintag.add("cibei_mark");
					player.addSkill("cibei_mark");
				},
			},
			mark: {
				trigger: { player: "useCard1" },
				onremove: true,
				charlotte: true,
				silent: true,
				firstDo: true,
				filter(event, player) {
					return player.hasHistory("lose", evt => {
						const evtx = evt.relatedEvent || evt.getParent();
						if (evtx != event) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("cibei_mark")) {
								return true;
							}
						}
						return false;
					});
				},
				content() {
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						var stat = player.getStat().card,
							name = trigger.card.name;
						if (typeof stat[name] == "number") {
							stat[name]--;
						}
					}
				},
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("cibei_mark")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (card.hasGaintag("cibei_mark")) {
							return false;
						}
					},
					canBeDiscarded(card) {
						if (card.hasGaintag("cibei_mark")) {
							return false;
						}
					},
					targetInRange(card, player, target) {
						if (!card.cards) {
							return;
						}
						for (var i of card.cards) {
							if (i.hasGaintag("cibei_mark")) {
								return true;
							}
						}
					},
					cardUsable(card, player) {
						if (!card.cards) {
							return;
						}
						for (var i of card.cards) {
							if (i.hasGaintag("cibei_mark")) {
								return true;
							}
						}
					},
				},
			},
		},
	},
	//武安国
	diezhang: {
		audio: 2,
		locked: false,
		zhuanhuanji(player, skill) {
			if (!player.storage.duanwan) {
				player.storage[skill] = !player.storage[skill];
			}
		},
		trigger: { global: ["eventNeutralized", "shaMiss"] },
		filter(event, player) {
			if (player.hasSkill("diezhang_used")) {
				return false;
			}
			if (event.type != "card") {
				return false;
			}
			var evt = event._neutralize_event;
			var user, responder;
			if (event.name == "sha") {
				user = event.player;
				responder = event.target;
			} else {
				if (evt.type != "card") {
					return false;
				}
				user = event.player;
				responder = evt.player;
			}
			if (!player.storage.diezhang) {
				if (user != player || responder == player) {
					return false;
				}
				return player.countDiscardableCards(player, "he") > 0 && player.canUse("sha", responder, false);
			} else {
				if (user == player || responder != player) {
					return false;
				}
				return player.canUse("sha", user, false);
			}
		},
		direct: true,
		content() {
			"step 0";
			var evt = trigger._neutralize_event;
			var user, responder;
			if (trigger.name == "sha") {
				user = trigger.player;
				responder = trigger.target;
			} else {
				user = trigger.player;
				responder = evt.player;
			}
			var num = player.storage.duanwan ? 2 : 1;
			event.num = num;
			if (!player.storage.diezhang) {
				var target = responder;
				event.target = target;
				var next = player
					.chooseToDiscard(get.prompt("diezhang", target), "弃置一张牌，视为对其使用" + get.cnNumber(num) + "张【杀】", "he")
					.set("ai", card => {
						if (_status.event.goon) {
							return 6 - get.value(card);
						}
						return 0;
					})
					.set("logSkill", ["diezhang", target]);
			} else {
				var target = user;
				event.target = target;
				var next = player.chooseBool(get.prompt("diezhang", target), "摸" + get.cnNumber(num) + "张牌，视为对其使用一张【杀】").set("ai", () => _status.event.goon);
			}
			next.set("goon", get.effect(target, { name: "sha" }, player, player) > 0);
			"step 1";
			if (result.bool) {
				if (player.storage.duanwan) {
					player.addTempSkill("diezhang_used");
				}
				player.changeZhuanhuanji("diezhang");
				if (!result.cards || !result.cards.length) {
					player.logSkill("diezhang", target);
					player.draw(num, "nodelay");
					player.useCard({ name: "sha", isCard: true }, target, false);
				} else {
					while (num--) {
						player.useCard({ name: "sha", isCard: true }, target, false);
					}
				}
			}
		},
		marktext: "☯",
		mark: true,
		intro: {
			content(storage, player) {
				var cnNum = get.cnNumber(player.storage.duanwan ? 2 : 1);
				if (storage) {
					return "当其他角色使用牌被你抵消后，你可以摸" + cnNum + "张牌，视为对其使用一张【杀】。";
				}
				return "当你使用牌被其他角色抵消后，你可以弃置一张牌，视为对其使用" + cnNum + "张【杀】。";
			},
		},
		mod: {
			cardUsable(card, player, num) {
				if (!player.storage.duanwan && card.name == "sha") {
					return num + 1;
				}
			},
		},
		subSkill: { used: { charlotte: true } },
	},
	duanwan: {
		audio: 2,
		enable: "chooseToUse",
		skillAnimation: true,
		animationColor: "soil",
		limited: true,
		filter(event, player) {
			return event.type == "dying" && player == event.dying;
		},
		content() {
			player.changeZhuanhuanji("diezhang");
			player.awakenSkill(event.name);
			var num = 2 - player.hp;
			if (num > 0) {
				player.recover(num);
			}
		},
		ai: {
			save: true,
			skillTagFilter(player, tag, target) {
				return player == target;
			},
			result: { player: 1 },
		},
	},
	//李婉
	liandui: {
		audio: 2,
		trigger: { global: "useCard" },
		filter(event, player) {
			const history = game.getAllGlobalHistory("useCard");
			const index = history.indexOf(event);
			if (index <= 0) {
				return false;
			}
			const previous = history[index - 1].player;
			if (event.player == player && previous != player && previous.isIn()) {
				return true;
			}
			if (event.player != player && previous == player) {
				return true;
			}
			return false;
		},
		async cost(event, trigger, player) {
			if (!trigger.player) {
				return;
			}
			const history = game.getAllGlobalHistory("useCard");
			const index = history.indexOf(trigger);
			const previous = history[index - 1].player;
			const result = await trigger.player
				.chooseBool("是否对" + get.translation(previous) + "发动【联对】？", "令" + get.translation(previous) + "摸两张牌")
				.set("ai", () => _status.event.bool)
				.set("bool", get.effect(previous, { name: "draw" }, trigger.player, trigger.player) > 0)
				.forResult();
			if (result.bool) {
				event.result = { bool: true, cost_data: previous };
			}
		},
		async content(event, trigger, player) {
			const { cost_data: previous } = event;
			previous.draw(2);
		},
	},
	biejun: {
		audio: 2,
		global: "biejun_give",
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return (
				!player.hasSkill("biejun_used") &&
				player.countCards("h", card => {
					return card.hasGaintag("biejun");
				}) == 0
			);
		},
		prompt2: "翻面并防止此伤害",
		check(event, player) {
			return player.isTurnedOver() || event.num >= player.hp || get.distance(_status.currentPhase, player, "absolute") >= 3;
		},
		content() {
			player.addTempSkill("biejun_used");
			player.turnOver();
			trigger.cancel();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -2];
					}
					if (get.tag(card, "damage")) {
						if (player.getNext() == target && lib.skill.biejun.filter(null, target) && target.isTurnedOver()) {
							return [0, 1];
						}
					}
				},
			},
		},
		subSkill: {
			used: { charlotte: true },
			give: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					if (!player.countCards("h")) {
						return false;
					}
					var targets = game.filterPlayer(function (current) {
						return current != player && current.hasSkill("biejun");
					});
					if (!targets.length) {
						return false;
					}
					return true;
				},
				selectCard: 1,
				filterCard: true,
				chessForceAll: true,
				filterTarget(card, player, target) {
					return target.hasSkill("biejun");
				},
				selectTarget() {
					var player = _status.event.player;
					var targets = game.filterPlayer(function (current) {
						return current != player && current.hasSkill("biejun");
					});
					return targets.length > 1 ? 1 : -1;
				},
				complexSelect: true,
				prompt() {
					var player = _status.event.player;
					var targets = game.filterPlayer(function (current) {
						return current != player && current.hasSkill("biejun");
					});
					return "将一张手牌交给" + get.translation(targets) + (targets.length > 1 ? "中的一人" : "");
				},
				position: "h",
				discard: false,
				lose: false,
				delay: false,
				check(card) {
					var player = _status.event.player;
					if (
						game.hasPlayer(function (current) {
							return lib.skill.biejun_give.filterTarget(null, player, current) && get.attitude(player, current) > 0;
						})
					) {
						return 5 - get.value(card);
					}
					return -get.value(card);
				},
				content() {
					game.trySkillAudio("biejun", target);
					player.give(cards, target).gaintag.add("biejun");
					target.addTempSkill("biejun_tag");
				},
				ai: {
					order: 2,
					result: { target: 1 },
				},
			},
			tag: {
				charlotte: true,
				forced: true,
				onremove(player) {
					player.removeGaintag("biejun");
				},
			},
		},
	},
	//诸葛尚
	sangu: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		getEffect(player, target, event, list1, list2) {
			let att = get.attitude(player, target);
			if (att === 0) {
				return 0;
			}
			let getv = function (name, player, arg) {
				let v = event.getTempCache("sangu", player.playerid + name);
				if (typeof v === "number") {
					return v;
				}
				v = player.getUseValue({ name: name, storage: { sangu: true } }, arg);
				event.putTempCache("sangu", player.playerid + name, v);
				return v;
			};
			if (att < 0) {
				for (let i of list1) {
					if (getv(i, target) <= 0 || getv(i, target) <= 0) {
						return -att * Math.sqrt(get.threaten(target)) * 2;
					}
				}
				return 0;
			} else {
				let list = list1.concat(player.hp > 1 ? list2 : []),
					eff = 0;
				list.sort(function (a, b) {
					return getv(b, target) - getv(a, target);
				});
				list = list.slice(3);
				for (let i of list) {
					let res = getv(i, target);
					if (res <= 5) {
						break;
					} else {
						eff += res;
					}
				}
				return Math.sqrt(eff / 1.5) * att;
			}
		},
		content() {
			"step 0";
			event.list1 = [];
			event.list2 = [];
			event.used = [];
			player.getHistory("useCard", function (evt) {
				event.used.add(evt.card.name);
			});
			for (let name of lib.inpile) {
				let add = false,
					type = get.type(name);
				if (name === "sha") {
					add = true;
				} else if (type === "trick") {
					let info = lib.card[name];
					if (info && !info.singleCard && !info.notarget) {
						add = true;
					}
				}
				if (!add) {
					continue;
				}
				if (event.used.includes(name)) {
					event.list1.push(name);
				} else {
					event.list2.push(name);
				}
			}
			if (!event.list1.length && !event.list2.length) {
				event.finish();
			} else {
				player
					.chooseTarget(get.prompt2("sangu"), lib.filter.notMe)
					.set("ai", function (target) {
						return lib.skill.sangu.getEffect(_status.event.player, target, _status.event.getTrigger(), _status.event.list1, _status.event.list2);
					})
					.set("list1", event.list1)
					.set("list2", event.list2);
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("sangu", target);
				event.target = target;
			} else {
				event.finish();
			}
			"step 2";
			var dialog = ["为" + get.translation(target) + "选择至多三个牌名"];
			if (event.list1.length) {
				dialog.push('<div class="text center">本回合已使用过的牌</div>');
				dialog.push([event.list1.map(i => [get.type(i), "", i]), "vcard"]);
			}
			if (event.list2.length) {
				dialog.push('<div class="text center">本回合未使用过的牌</div>');
				dialog.push([event.list2.map(i => [get.type(i), "", i]), "vcard"]);
			}
			player
				.chooseButton(dialog, true, [1, 3])
				.set("ai", function (button) {
					let name = button.link[2],
						list = _status.event.list,
						player = _status.event.player,
						target = _status.event.getParent().target,
						trigger = _status.event.getTrigger(),
						getv = (name, player) => {
							let v = trigger.getTempCache("sangu", player.playerid + name);
							if (typeof v === "number") {
								return v;
							}
							v = player.getUseValue({ name: name, storage: { sangu: true } });
							trigger.putTempCache("sangu", player.playerid + name, v);
							return v;
						};
					if (get.attitude(player, target) < 0) {
						if (!list.includes(name)) {
							return 0;
						}
						return -getv(name, target);
					} else {
						if (player.hp < 2 && !list.includes(name)) {
							return 0;
						}
						let val = getv(name, target),
							base = 5;
						val = Math.min(15, val - base);
						if (name === "wuzhong" || name === "dongzhuxianji") {
							val += 15;
						} else if (name === "shunshou") {
							val += 6;
						}
						return val;
					}
				})
				.set("list", event.list1);
			"step 3";
			if (result.bool) {
				var names = result.links.map(i => i[2]);
				if (!target.storage.sangu_effect) {
					target.storage.sangu_effect = [];
				}
				target.storage.sangu_effect = target.storage.sangu_effect.concat(names);
				game.log(player, "为", target, "选择了", "#y" + get.translation(names));
				target.addTempSkill("sangu_effect", { player: "phaseUseAfter" });
				target.markSkill("sangu_effect");
				var bool = true;
				for (var i of names) {
					if (!event.used.includes(i)) {
						bool = false;
						break;
					}
				}
				if (bool) {
					target.addTempSkill("sangu_prevent", { player: "phaseUseAfter" });
					target.markAuto("sangu_prevent", [player]);
				}
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && card.storage && card.storage.sangu) {
						return "zeroplayertarget";
					}
				},
			},
		},
		subSkill: {
			effect: {
				trigger: { player: "phaseUseBegin" },
				charlotte: true,
				forced: true,
				popup: false,
				content() {
					player.addTempSkill("sangu_viewas");
				},
				onremove: true,
				intro: {
					mark(dialog, storage, player) {
						if (!storage || !storage.length) {
							return "当前无可用牌";
						}
						dialog.add([[storage[0]], "vcard"]);
						if (storage.length > 1) {
							dialog.addSmall([storage.slice(1), "vcard"]);
						}
					},
					content: "$",
				},
			},
			viewas: {
				hiddenCard(player, name) {
					var storage = player.getStorage("sangu_effect");
					if (storage.length) {
						return name == storage[0];
					}
				},
				mod: {
					cardname(card, player) {
						if (_status.event.name != "chooseToUse" || _status.event.skill) {
							return;
						}
						var storage = player.getStorage("sangu_effect");
						if (storage.length) {
							return storage[0];
						}
					},
					cardnature(card, player) {
						if (_status.event.name != "chooseToUse" || _status.event.skill) {
							return;
						}
						var storage = player.getStorage("sangu_effect");
						if (storage.length) {
							return false;
						}
					},
				},
				trigger: { player: ["useCard", "respond"] },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return event.cards.length > 0 && player.getStorage("sangu_effect").length > 0;
				},
				content() {
					if (!trigger.card.storage) {
						trigger.card.storage = {};
					}
					trigger.card.storage.sangu = true;
					player.unmarkAuto("sangu_effect", [player.getStorage("sangu_effect")[0]]);
				},
			},
			prevent: {
				trigger: { source: "damageBegin2" },
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return event.card && event.card.storage && event.card.storage.sangu && player.getStorage("sangu_prevent").includes(event.player);
				},
				content() {
					trigger.cancel();
				},
			},
		},
	},
	yizu: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		forced: true,
		usable: 1,
		filter(event, player) {
			return player.isDamaged() && player.hp <= event.player.hp && (event.card.name == "sha" || event.card.name == "juedou");
		},
		content() {
			player.recover();
		},
		ai: {
			effect: {
				target_use(card, player, target, current) {
					if (target.isHealthy() || (card.name != "sha" && card.name != "juedou")) {
						return;
					}
					if (target.storage.counttrigger && target.storage.counttrigger.yizu && current < 0) {
						return 5;
					}
					if (player.hp < target.hp) {
						return;
					}
					if (current > 0) {
						return 1.2;
					}
					if (get.attitude(player, target) >= 0) {
						return;
					}
					var copy = get.effect(target, { name: "shacopy" }, player, player);
					if (
						copy > 0 &&
						player.isPhaseUsing() &&
						Math.min(
							player.getCardUsable("sha"),
							player.countCards("hs", function (card) {
								return get.name(card) == "sha" && player.canUse(card, target, null, true);
							})
						) >= 2
					) {
						return;
					}
					return [0, 2];
				},
			},
		},
	},
	//轲比能
	kousheng: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player
				.chooseCard("h", [1, player.countCards("h")], get.prompt("kousheng"), "你可以选择任意张手牌，这些手牌于本回合内视为无次数限制的【杀】。但当有角色受到这些【杀】的伤害后，其可以用所有手牌交换剩余的牌。", "allowChooseAll")
				.set("standard", player.getUseValue({ name: "sha" }, null, true))
				.set("ai", function (card) {
					var player = _status.event.player,
						standard = _status.event.standard;
					if (standard <= 0) {
						return 0;
					}
					var eff = player.getUseValue(card, null, true);
					if (eff <= standard) {
						return standard - eff + 0.1;
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				player.logSkill("kousheng");
				player.addGaintag(result.cards, "kousheng");
				player.addTempSkill("kousheng_effect");
				game.delayx();
			}
		},
		subSkill: {
			effect: {
				audio: "kousheng",
				trigger: { player: "useCard1" },
				forced: true,
				charlotte: true,
				firstDo: true,
				filter(event, player) {
					if (event.card.name != "sha") {
						return false;
					}
					return player.hasHistory("lose", function (evt) {
						const evtx = evt.relatedEvent || evt.getParent();
						if (evtx != event) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("kousheng")) {
								return true;
							}
						}
						return false;
					});
				},
				content() {
					if (!trigger.card.storage) {
						trigger.card.storage = {};
					}
					trigger.card.storage.kousheng = true;
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						const stat = player.getStat().card,
							name = trigger.card.name;
						if (typeof stat[name] == "number") {
							stat[name]--;
						}
					}
				},
				onremove(player) {
					player.removeGaintag("kousheng");
				},
				mod: {
					cardUsable(card, player, target) {
						if (card.name != "sha" || !card.cards) {
							return;
						}
						for (var i of card.cards) {
							if (i.hasGaintag("kousheng")) {
								return Infinity;
							}
						}
					},
					cardname(card) {
						if (get.itemtype(card) == "card" && card.hasGaintag("kousheng")) {
							return "sha";
						}
					},
					cardnature(card) {
						if (get.itemtype(card) == "card" && card.hasGaintag("kousheng")) {
							return false;
						}
					},
				},
				group: "kousheng_damage",
			},
			damage: {
				audio: "kousheng",
				trigger: { source: "damageSource" },
				forced: true,
				filter(event, player) {
					if (!event.card || !event.card.storage || !event.card.storage.kousheng || event.getParent().type != "card") {
						return false;
					}
					var target = event.player;
					return (
						target.isIn() &&
						player.hasCard(function (card) {
							return card.hasGaintag("kousheng");
						}, "h")
					);
				},
				content() {
					"step 0";
					var target = trigger.player;
					event.target = target;
					var cards = player.getCards("h", function (card) {
						return card.hasGaintag("kousheng");
					});
					event.cards = cards;
					var str = get.translation(player);
					player.showCards(cards, str + "的【寇旌】牌");
					if (target.countCards("h") > 0) {
						target.chooseBool("是否交换“寇旌”牌？", "用你的所有手牌交换" + str + "的下列“寇旌”牌：" + get.translation(cards)).set("ai", function () {
							var player = _status.event.player,
								target = _status.event.getParent().player;
							if (player.hasShan() || player.countCards("hs", { name: ["tao", "jiu"] }) > 0 || get.attitude(player, target) >= 0) {
								return false;
							}
							var hs1 = player.getCards("h"),
								hs2 = _status.event.getParent().cards;
							if (hs2.length >= player.hp) {
								return true;
							}
							if (get.value(hs1, player) >= get.value(hs2, target)) {
								return false;
							}
							return true;
						});
					} else {
						event.finish();
					}
					"step 1";
					if (result.bool) {
						player.swapHandcards(target, cards, target.getCards("h"));
					}
				},
			},
		},
	},
	//陆凯
	lkbushi: {
		audio: 2,
		getBushi(player) {
			if (!player.storage.lkbushi) {
				return ["spade", "heart", "club", "diamond"];
			}
			return player.storage.lkbushi;
		},
		init(player, skill) {
			player.addTip(skill, get.translation(skill) + lib.skill.lkbushi.getBushi(player).reduce((str, i) => str + get.translation(i), ""));
		},
		onremove(player, skill) {
			delete player.storage[skill];
			player.removeTip(skill);
		},
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		locked: false,
		content() {
			"step 0";
			var list = lib.skill.lkbushi.getBushi(player);
			list = list.map(function (i) {
				return ["", "", "lukai_" + i];
			});
			var next = player.chooseToMove("卜筮：是否调整〖卜筮〗的花色顺序？");
			next.set("list", [
				[
					"无次数限制/使用打出摸牌<br>可弃牌无效/结束阶段获得",
					[list, "vcard"],
					function (list) {
						var list2 = list.map(function (i) {
							return get.translation(i[2].slice(6));
						});
						return "你使用" + list2[0] + "牌时无次数限制；使用或打出" + list2[1] + "时，摸一张牌；<br>成为" + list2[2] + "牌目标后可弃一张牌无效；结束阶段获得一张" + list2[3] + "牌";
					},
				],
			]);
			next.set("processAI", function () {
				var player = _status.event.player;
				var list = lib.skill.lkbushi.getBushi(player);
				var list2 = [];
				var hs = player.getCards("hs", function (card) {
					return player.hasValueTarget(card);
				});
				list.sort(function (a, b) {
					return hs.filter(i => get.suit(i) == b).length - hs.filter(i => get.suit(i) == a).length;
				});
				list2.push(list.shift());
				hs = player.getCards("hs", "sha");
				list.sort(function (a, b) {
					return hs.filter(i => get.suit(i) == b).length - hs.filter(i => get.suit(i) == a).length;
				});
				list2.unshift(list.shift());
				list.randomSort();
				list2.addArray(list);
				return [list2.map(i => ["", "", "lukai_" + i])];
			});
			"step 1";
			if (result.bool) {
				var list = lib.skill.lkbushi.getBushi(player),
					list2 = result.moved[0].map(function (i) {
						return i[2].slice(6);
					});
				for (var i = 0; i < 4; i++) {
					if (list[i] != list2[i]) {
						player.logSkill("lkbushi");
						player.storage.lkbushi = list2;
						player.addTip("lkbushi", get.translation("lkbushi") + lib.skill.lkbushi.getBushi(player).reduce((str, i) => str + get.translation(i), ""));
						var str = "#g";
						for (var j = 0; j < 4; j++) {
							str += get.translation(list2[j]);
							if (j != 3) {
								str += "/";
							}
						}
						game.log(player, "将", "#g【卜筮】", "的花色序列改为", str);
						game.delayx();
						break;
					}
				}
			}
		},
		mark: true,
		marktext: "筮",
		intro: {
			content(storage, player) {
				var list = lib.skill.lkbushi.getBushi(player).map(i => get.translation(i));
				return "①你使用" + list[0] + "牌无次数限制。②当你使用或打出" + list[1] + "牌后，你摸一张牌。③当你成为" + list[2] + "牌的目标后，你可以弃置一张牌，令此牌对你无效。④结束阶段开始时，你从牌堆或弃牌堆获得一张" + list[3] + "牌。⑤准备阶段开始时，你可调整此技能中四种花色的对应顺序。";
			},
		},
		group: ["lkbushi_unlimit", "lkbushi_draw", "lkbushi_defend", "lkbushi_gain"],
		subSkill: {
			unlimit: {
				mod: {
					cardUsable(card, player) {
						const list = lib.skill.lkbushi.getBushi(player),
							suit = get.suit(card);
						if (suit === "unsure" || list[0] === suit) {
							return Infinity;
						}
					},
				},
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				silent: true,
				firstDo: true,
				filter(event, player) {
					if (event.addCount === false) {
						return false;
					}
					var list = lib.skill.lkbushi.getBushi(player);
					return list[0] == get.suit(event.card);
				},
				content() {
					trigger.addCount = false;
					var stat = player.getStat().card,
						name = trigger.card.name;
					if (stat[name] && typeof stat[name] == "number") {
						stat[name]--;
					}
				},
			},
			draw: {
				audio: "lkbushi",
				trigger: { player: ["useCardAfter", "respondAfter"] },
				forced: true,
				locked: false,
				filter(event, player) {
					var list = lib.skill.lkbushi.getBushi(player);
					return list[1] == get.suit(event.card);
				},
				content() {
					player.draw();
				},
			},
			defend: {
				audio: "lkbushi",
				trigger: { target: "useCardToTargeted" },
				direct: true,
				filter(event, player) {
					var list = lib.skill.lkbushi.getBushi(player);
					return list[2] == get.suit(event.card) && !event.excluded.includes(player) && player.countCards("he") > 0;
				},
				content() {
					"step 0";
					player
						.chooseToDiscard("he", get.prompt("lkbushi"), "弃置一张牌，令" + get.translation(trigger.card) + "对你无效")
						.set("ai", function (card) {
							if (_status.event.eff >= 0) {
								return false;
							}
							return -_status.event.eff * 1.1 - get.value(card);
						})
						.set("eff", get.effect(player, trigger.card, trigger.player, player)).logSkill = ["lkbushi_defend", trigger.player];
					"step 1";
					if (result.bool) {
						trigger.excluded.add(player);
					}
				},
			},
			gain: {
				audio: "lkbushi",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				locked: false,
				content() {
					var list = lib.skill.lkbushi.getBushi(player);
					var card = get.cardPile(function (card) {
						return get.suit(card, false) == list[3];
					});
					if (card) {
						player.gain(card, "gain2");
					}
				},
			},
		},
	},
	lkzhongzhuang: {
		audio: 2,
		trigger: { source: ["damageBegin1", "damageBegin4"] },
		forced: true,
		filter(event, player, name) {
			if (!event.card || event.card.name != "sha" || event.getParent().type != "card") {
				return false;
			}
			var range = player.getAttackRange();
			if (name == "damageBegin1") {
				return range > 3;
			}
			return range < 3 && event.num > 1;
		},
		content() {
			if (event.triggername == "damageBegin1") {
				trigger.num++;
			} else {
				trigger.num = 1;
			}
		},
		global: "lkzhongzhuang_ai",
		subSkill: {
			ai: {
				ai: {
					filterDamage: true,
					skillTagFilter(player, tag, arg) {
						if (arg && arg.card && arg.card.name == "sha") {
							if (arg.player && arg.player.hasSkill("lkzhongzhuang") && arg.player.getAttackRange() < 3) {
								return true;
							}
						}
						return false;
					},
				},
			},
		},
	},
	//将星独具
	xinzhilve: {
		enable: "phaseUse",
		audio: "zhilve",
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const list = ["移动场上的一张牌", "摸一张牌并视为使用一张【杀】"];
				const choiceList = ui.create.dialog("知略：失去1点体力并...", "forcebutton", "hidden");
				choiceList.add([
					list.map((item, i) => {
						return [i, item];
					}),
					"textbutton",
				]);
				return choiceList;
			},
			filter(button, player) {
				if (button.link == 0) {
					return player.canMoveCard();
				}
				return player.hasUseTarget({ name: "sha", isCard: true }, false);
			},
			check(button) {
				return button.link;
			},
			backup(links) {
				return lib.skill["xinzhilve_" + ["move", "use"][links[0]]];
			},
			prompt() {
				return "请选择【杀】的目标";
			},
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }) + 0.1;
			},
			result: {
				player(player) {
					if (player.hp > 2 && player.hasValueTarget({ name: "sha" })) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: {
			backup: {},
			move: {
				audio: "zhilve",
				filterCard: () => false,
				selectCard: -1,
				delay: false,
				async content(event, trigger, player) {
					await player.loseHp();
					if (player.canMoveCard()) {
						await player.moveCard(true);
					}
					player.addTempSkill("xinzhilve_mark");
					player.addMark("xinzhilve_mark", 1, false);
				},
			},
			use: {
				audio: "zhilve",
				filterCard: () => false,
				selectCard: -1,
				delay: false,
				filterTarget(card, player, target) {
					return player.canUse({ name: "sha", isCard: true }, target, false);
				},
				async content(event, trigger, player) {
					await player.loseHp();
					await player.draw();
					const next = player.useCard({ name: "sha", isCard: true }, false, event.target);
					next.forceDie = true;
					await next;
					player.addTempSkill("xinzhilve_mark");
					player.addMark("xinzhilve_mark", 1, false);
				},
				ai: {
					result: {
						target(player, target) {
							return get.effect(target, { name: "sha" }, player, target);
						},
					},
				},
			},
			mark: {
				markimage: "image/card/handcard.png",
				charlotte: true,
				onremove: true,
				intro: { content: "本回合手牌上限+#" },
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("xinzhilve_mark");
					},
				},
			},
		},
	},
	xinxhzhiyan: {
		audio: "xhzhiyan",
		enable: "phaseUse",
		filter(event, player) {
			const list = player.getStorage("xinxhzhiyan_used");
			return (!list.includes("give") && player.countCards("h") > player.hp) || (!list.includes("draw") && player.countCards("h") < player.maxHp);
		},
		filterCard: true,
		selectCard() {
			var player = _status.event.player;
			const list = player.getStorage("xinxhzhiyan_used");
			if (list.includes("give")) {
				return 0;
			}
			var num = Math.max(0, player.countCards("h") - player.hp);
			if (ui.selected.cards.length || !list.includes("draw") || player.countCards("h") >= player.maxHp) {
				return [num, num];
			}
			return [0, num];
		},
		filterTarget: lib.filter.notMe,
		selectTarget() {
			if (ui.selected.cards.length) {
				return [1, 1];
			}
			return [0, 0];
		},
		check(card) {
			var player = _status.event.player;
			var checkx = function (card) {
				if (
					player.getUseValue(card, null, true) <= 0 &&
					game.hasPlayer(function (current) {
						return current != player && get.value(card, current) > 0 && get.attitude(player, current) > 0;
					})
				) {
					return 2;
				}
				return 1;
			};
			if (
				player.countCards("h", function (card) {
					return checkx(card) > 0;
				}) <
				player.countCards("h") - player.hp
			) {
				return 0;
			}
			return checkx(card);
		},
		delay: false,
		discard: false,
		lose: false,
		allowChooseAll: true,
		content() {
			var bool = cards && cards.length > 0;
			player.addTempSkill("xinxhzhiyan_used", "phaseUseEnd");
			if (!bool) {
				player.markAuto("xinxhzhiyan_used", "draw");
				player.addTempSkill("xinxhzhiyan_false", "phaseUseEnd");
				player.draw(player.maxHp - player.countCards("h"));
			} else {
				player.markAuto("xinxhzhiyan_used", "give");
				player.give(cards, target);
			}
		},
		ai: {
			order(obj, player) {
				if (player.countCards("h") > player.hp) {
					return 10;
				}
				return 0.5;
			},
			result: {
				player(player, target) {
					if (!ui.selected.cards.length && player.countCards("h") < player.maxHp) {
						return 1;
					}
					return 0;
				},
				target: 1,
			},
		},
	},
	xinxhzhiyan_used: {
		charlotte: true,
		onremove: true,
	},
	xinxhzhiyan_false: {
		mod: {
			playerEnabled(card, player, target) {
				if (player != target && (!get.info(card) || !get.info(card).singleCard || !ui.selected.targets.length)) {
					return false;
				}
			},
		},
		charlotte: true,
		mark: true,
		intro: {
			content: "不能对其他角色使用牌",
		},
	},
	weifeng: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		forced: true,
		filter(event, player) {
			if (
				!event.targets ||
				!event.targets.filter(function (target) {
					return target != player && !target.storage.weifeng2;
				}).length
			) {
				return false;
			}
			var evt = event.getParent("phaseUse");
			if (!evt || evt.player != player) {
				return false;
			}
			if (!get.tag(event.card, "damage")) {
				return false;
			}
			if (!["basic", "trick"].includes(get.type(event.card))) {
				return false;
			}
			return (
				player
					.getHistory("useCard", function (ev) {
						return ev.getParent("phaseUse") == evt && get.tag(ev.card, "damage") && ["basic", "trick"].includes(get.type(ev.card));
					})
					.indexOf(event) == 0 &&
				game.hasPlayer(function (current) {
					return current != player && !current.storage.weifeng2 && event.targets.includes(current);
				})
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(true, "威风：请选择一个目标，令其获得一个【惧(" + get.translation(trigger.card.name) + ")】标记", function (card, player, target) {
					return player != target && !target.storage.weifeng2 && _status.event.getTrigger().targets.includes(target);
				})
				.set("ai", function (target) {
					return -get.attitude(_status.event.player, target);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				target.storage.weifeng2 = trigger.card.name;
				player.line(target, "green");
				game.log(target, "获得了一个", "#g【惧(" + get.translation(trigger.card.name) + ")】", "标记");
				target.markSkill("weifeng2");
				player.addSkill("weifeng3");
			}
		},
	},
	weifeng2: {
		intro: {
			content: "当前“惧”标记名称：$",
			onunmark(storage, player) {
				if (player.storage.weifeng2) {
					game.log(player, "移去了一个", "#g【惧(" + get.translation(player.storage.weifeng2) + ")】", "标记");
					delete player.storage.weifeng2;
				}
			},
		},
		marktext: "惧",
	},
	weifeng3: {
		trigger: {
			global: "damageBegin3",
			player: ["phaseZhunbeiBegin", "dieBegin"],
		},
		forced: true,
		popup: false,
		sourceSkill: "weifeng",
		filter(event, player) {
			if (event.name != "damage") {
				return true;
			}
			return event.player != player && typeof event.player.storage.weifeng2 == "string";
		},
		content() {
			if (trigger.name == "damage") {
				player.logSkill("weifeng", trigger.player);
				if (trigger.card && trigger.card.name == trigger.player.storage.weifeng2) {
					trigger.num++;
				} else if (trigger.player.countGainableCards(player, "he") > 0) {
					player.gainPlayerCard(trigger.player, "he", true);
				}
				trigger.player.unmarkSkill("weifeng2");
			} else {
				game.countPlayer(function (current) {
					if (current.storage.weifeng2) {
						current.unmarkSkill("weifeng2");
					}
				});
				player.removeSkill("weifeng3");
			}
		},
	},
	gnjinfan: {
		trigger: { player: "phaseDiscardBegin" },
		direct: true,
		locked: false,
		audio: 2,
		filter(event, player) {
			var list = [];
			player.getCards("s", function (card) {
				if (card.hasGaintag("gnjinfan")) {
					list.add(get.suit(card));
				}
			});
			if (list.length >= lib.suit.length) {
				return false;
			}
			return (
				player.countCards("h", function (card) {
					return _status.connectMode || !list.includes(get.suit(card));
				}) > 0
			);
		},
		content() {
			"step 0";
			player
				.chooseCard(
					"h",
					get.prompt("gnjinfan"),
					"将任意张手牌当做“铃”置于武将牌上",
					[
						1,
						(function () {
							var list = [];
							var list2 = [];
							player.getCards("s", function (card) {
								if (card.hasGaintag("gnjinfan")) {
									list.add(get.suit(card));
								}
							});
							player.getCards("h", function (card) {
								list2.add(get.suit(card));
							});
							list2.removeArray(list);
							return Math.max(1, list2.length);
						})(),
					],
					function (card, player) {
						return (
							!player.countCards("s", function (cardx) {
								return cardx.hasGaintag("gnjinfan") && get.suit(cardx, false) == get.suit(card, player);
							}) &&
							!ui.selected.cards.filter(function (cardx) {
								return get.suit(cardx, player) == get.suit(card, player);
							}).length
						);
					}
				)
				.set("ai", function (card) {
					var player = _status.event.player;
					if (player.hasUseTarget(card) && !player.hasValueTarget(card)) {
						return 0;
					}
					if (["sha", "shan", "wuxie", "caochuan"].includes(card.name)) {
						return 2 + Math.random();
					}
					return 1 + Math.random();
				})
				.set("complexCard", true);
			"step 1";
			if (result.bool) {
				player.logSkill("gnjinfan");
				game.log(player, "将", result.cards, "放到了武将牌上");
				player.loseToSpecial(result.cards, "gnjinfan").visible = true;
			} else {
				event.finish();
			}
			"step 2";
			player.markSkill("gnjinfan");
		},
		group: ["gnjinfan_gain"],
		marktext: "铃",
		intro: {
			mark(dialog, storage, player) {
				dialog.addAuto(
					player.getCards("s", function (card) {
						return card.hasGaintag("gnjinfan");
					})
				);
			},
			markcount(storage, player) {
				return player.getCards("s", function (card) {
					return card.hasGaintag("gnjinfan");
				}).length;
			},
			onunmark(storage, player) {
				var cards = player.getCards("s", function (card) {
					return card.hasGaintag("gnjinfan");
				});
				if (cards.length) {
					player.lose(cards, ui.discardPile);
					player.$throw(cards, 1000);
					game.log(cards, "进入了弃牌堆");
				}
			},
		},
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("gnjinfan")) {
					return num + 0.5;
				}
			},
		},
		init(player, skill) {
			player.addSkill("gnjinfan_nouse");
		},
		onremove(player, skill) {
			player.removeSkill("gnjinfan_nouse");
		},
		subSkill: {
			nouse: {
				charlotte: true,
				locked: true,
				mod: {
					cardEnabled2(card, player) {
						if (get.itemtype(card) == "card" && card.hasGaintag("gnjinfan")) {
							if (!player.hasSkill("gnjinfan")) {
								return false;
							}
						}
					},
				},
			},
		},
	},
	gnjinfan_gain: {
		audio: "gnjinfan",
		trigger: { player: "loseAfter" },
		forced: true,
		sourceSkill: "gnjinfan",
		filter(event, player) {
			if (!event.ss || !event.ss.length) {
				return false;
			}
			for (var i in event.gaintag_map) {
				if (event.gaintag_map[i].includes("gnjinfan")) {
					return true;
				}
				return false;
			}
		},
		content() {
			"step 0";
			var cards = [];
			for (var i of trigger.ss) {
				if (!trigger.gaintag_map[i.cardid] || !trigger.gaintag_map[i.cardid].includes("gnjinfan")) {
					continue;
				}
				var suit = get.suit(i, false);
				var card = get.cardPile2(function (card) {
					return !cards.includes(card) && get.suit(card, false) == suit;
				});
				if (card) {
					cards.push(card);
				}
			}
			if (cards.length) {
				player.gain(cards, "gain2");
			}
			var num = player.getCards("s", function (card) {
				return card.hasGaintag("gnjinfan");
			}).length;
			if (num) {
				player.markSkill("gnjinfan");
			} else {
				player.unmarkSkill("gnjinfan");
			}
			"step 1";
			game.updateRoundNumber();
		},
	},
	gnsheque: {
		audio: 2,
		trigger: { global: "phaseZhunbeiBegin" },
		direct: true,
		filter(event, player) {
			return event.player.isIn() && event.player.countCards("e") > 0 && lib.filter.targetEnabled({ name: "sha" }, player, event.player) && (player.hasSha() || (_status.connectMode && player.countCards("h") > 0));
		},
		clearTime: true,
		content() {
			player
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					"射却：是否对" + get.translation(trigger.player) + "使用一张杀？"
				)
				.set("logSkill", "gnsheque")
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("sourcex", trigger.player)
				.set("oncard", function (card) {
					try {
						card.gnsheque_tag = true;
					} catch (e) {
						alert("发生了一个导致【射却】无法正常触发无视防具效果的错误。请关闭十周年UI/手杀ui等扩展以解决");
					}
				});
		},
		ai: {
			unequip: true,
			unequip_ai: true,
			skillTagFilter(player, tag, arg) {
				if (tag == "unequip_ai") {
					if (_status.event.getParent().name != "gnsheque") {
						return false;
					}
				} else if (!arg || !arg.card || !arg.card.gnsheque_tag) {
					return false;
				}
			},
		},
	},
	//猩黄忠
	spshidi: {
		audio: 2,
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		zhuanhuanji: "number",
		filter(event, player) {
			return player.countMark("spshidi") % 2 == ["phaseJieshu", "phaseZhunbei"].indexOf(event.name);
		},
		logAudio(event, player) {
			return "spshidi" + (2 - (player.countMark("spshidi") % 2)) + ".mp3";
		},
		forced: true,
		content() {
			player.changeZhuanhuanji("spshidi");
		},
		mod: {
			globalFrom(from, to, distance) {
				if (from.countMark("spshidi") % 2 == 0) {
					return distance - 1;
				}
			},
			globalTo(from, to, distance) {
				if (to.countMark("spshidi") % 2 == 1) {
					return distance + 1;
				}
			},
			aiOrder(player, card, num) {
				if (player.countMark("spshidi") % 2 == 0 && card.name == "sha" && get.color(card) == "black") {
					return num + 0.1;
				}
			},
		},
		mark: true,
		marktext: "☯",
		intro: {
			content(storage, player) {
				return "已转换过" + (storage || 0) + "次";
			},
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (!arg || !arg.card || !arg.target || arg.card.name != "sha") {
					return false;
				}
				return player.countMark("spshidi") % 2 == 0 && get.color(arg.card) == "black";
			},
		},
		group: ["spshidi_use", "spshidi_beused"],
		subSkill: {
			use: {
				audio: "spshidi1.mp3",
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					return event.card.name == "sha" && player.countMark("spshidi") % 2 == 0 && get.color(event.card, false) == "black";
				},
				content() {
					trigger.directHit.addArray(game.players);
				},
			},
			beused: {
				audio: "spshidi2.mp3",
				trigger: { target: "useCardToTargeted" },
				forced: true,
				filter(event, player) {
					return event.card.name == "sha" && player.countMark("spshidi") % 2 == 1 && get.color(event.card, false) == "red";
				},
				content() {
					trigger.directHit.add(player);
				},
			},
		},
	},
	spyishi: {
		audio: 2,
		trigger: { source: "damageBegin2" },
		filter(event, player) {
			return player != event.player && event.player.countCards("e") > 0;
		},
		check(event, player) {
			return (
				get.damageEffect(event.player, player, player) <= 0 ||
				(get.attitude(player, event.player) <= 0 &&
					!event.player.hasSkillTag("noe") &&
					event.player.hasCard(function (card) {
						return get.value(card) > 9 - event.player.hp;
					}, "e"))
			);
		},
		logTarget: "player",
		content() {
			trigger.num--;
			player.gainPlayerCard(trigger.player, "e", true);
		},
	},
	spqishe: {
		audio: 2,
		enable: "chooseToUse",
		viewAs: { name: "jiu" },
		filterCard: { type: "equip" },
		position: "hes",
		viewAsFilter(player) {
			return player.hasCard({ type: "equip" }, "ehs");
		},
		check(card) {
			if (_status.event.type == "dying") {
				return 1 / (get.value(card) || 0.5);
			}
			return 5 - get.value(card);
		},
		locked: false,
		mod: {
			maxHandcard(player, num) {
				return num + player.countCards("e");
			},
		},
	},
	//☆胃炎
	mbguli: {
		audio: 2,
		enable: "phaseUse",
		filterCard: true,
		selectCard: -1,
		position: "h",
		usable: 1,
		filter(event, player) {
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (var card of hs) {
				var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
				if (mod2 === false) {
					return false;
				}
			}
			return event.filterCard(get.autoViewAs({ name: "sha" }, hs));
		},
		viewAs: {
			name: "sha",
			storage: { mbguli: true },
		},
		onuse(links, player) {
			player.addTempSkill("mbguli_effect", "phaseUseAfter");
		},
		locked: false,
		mod: {
			cardUsable(card, player) {
				if (card?.storage?.mbguli) {
					return Infinity;
				}
			},
		},
		ai: {
			order: 1,
			threaten: 1.14514,
			unequip_ai: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.name == "sha" && arg.card && arg.card.storage && arg.card.storage.mbguli) {
					return true;
				}
				return false;
			},
		},
		subSkill: {
			effect: {
				audio: "mbguli",
				trigger: { global: "useCardAfter" },
				charlotte: true,
				prompt2: "将手牌摸至体力上限，然后若此牌未造成过伤害，你失去1点体力",
				check(event, player) {
					var num = player.maxHp - player.countCards("h");
					return (num >= 3 && player.hp >= 2) || (num >= 2 && player.hp >= 3);
				},
				filter(event, player) {
					return event.card.storage?.mbguli;
				},
				async content(event, trigger, player) {
					await player.drawTo(player.maxHp);
					if (
						game.hasPlayer2(current => {
							return current.hasHistory("damage", evt => evt.card == trigger.card);
						}, true)
					) {
						return;
					}
					await player.loseHp();
				},
				group: "mbguli_unequip",
			},
			unequip: {
				trigger: {
					player: "useCardToPlayered",
				},
				filter({ card }) {
					return card.name == "sha" && card.storage && card.storage.mbguli;
				},
				forced: true,
				popup: false,
				logTarget: "target",
				async content(event, trigger, player) {
					trigger.target.addTempSkill("qinggang2");
					trigger.target.storage.qinggang2.add(trigger.card);
					trigger.target.markSkill("qinggang2");
				},
			},
		},
	},
	mbaosi: {
		audio: 2,
		trigger: { source: "damageSource" },
		forced: true,
		filter(event, player) {
			return player.inRange(event.player) && player.isPhaseUsing() && event.player.isIn() && !player.getStorage("mbaosi_inf").includes(event.player);
		},
		logTarget: "player",
		content() {
			player.addTempSkill("mbaosi_inf", "phaseUseAfter");
			player.markAuto("mbaosi_inf", [trigger.player]);
		},
		group: ["mbaosi_directHit"],
		subSkill: {
			directHit: {
				forced: true,
				trigger: { player: "useCard" },
				filter(event, player) {
					const evt = event.getParent("phaseUse");
					return evt?.player == player && player.getHistory("useCard", evtx => evtx.getParent("phaseUse") == evt).indexOf(event) == game.roundNumber - 1;
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
					game.log(trigger.card, "不可被响应");
				},
			},
			inf: {
				charlotte: true,
				onremove: true,
				forced: true,
				intro: { content: "对$使用牌无次数限制" },
				mod: {
					cardUsableTarget(card, player, target) {
						if (player.getStorage("mbaosi_inf").includes(target)) {
							return true;
						}
					},
				},
			},
		},
	},
	//☆周不疑
	mbhuiyao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		// filterTarget:lib.filter.notMe,
		content() {
			"step 0";
			player.damage("nosource");
			"step 1";
			if (game.countPlayer() < 2) {
				event.finish();
			}
			if (game.countPlayer() == 2) {
				event._result = {
					bool: true,
					targets: [game.findPlayer(i => i != player), player],
				};
			} else {
				player
					.chooseTarget(
						`慧夭：请选择两名角色`,
						`令不为你的第一名角色视为对第二名角色造成过1点伤害。`,
						(card, player, target) => {
							if (!ui.selected.targets.length) {
								return player != target;
							}
							return true;
						},
						2,
						true
					)
					.set("multitarget", true)
					.set("targetprompt", ["伤害来源", "受伤角色"])
					.set("ai", target => {
						return target == get.event().aiTargets[ui.selected.targets.length] ? 10 : 0;
					})
					.set("aiTargets", lib.skill.mbhuiyao.getUnrealDamageTargets(player, [game.filterPlayer(i => i != player), game.filterPlayer()], true));
			}
			"step 2";
			if (result.bool) {
				var targets = result.targets;
				player.line2(targets, "green");
				game.delaye();
				targets[1].damage(targets[0], "unreal");
			}
		},
		getUnrealDamageTargets: (player, lists, forced) => {
			const targets = [null, null];
			let sourceList, targetList;
			if (lists.length == 2 && lists.every(l => Array.isArray(l))) {
				sourceList = lists[0];
				targetList = lists[1];
			} else {
				sourceList = lists.slice();
				targetList = lists.slice();
			}
			const list = targetList
				.map(current => {
					const _hp = current.hp,
						_maxhp = current.maxHp;
					current.hp = 100;
					current.maxHp = 100;
					const att = -get.sgnAttitude(player, current);
					let val = get.damageEffect(current, player, current) * att;
					current.getSkills(null, false, false).forEach(skill => {
						const info = get.info(skill);
						if (info && info.ai && (info.ai.maixie || info.ai.maixie_hp || info.ai.maixie_defend)) {
							val = Math[val > 0 ? "max" : "min"](val > 0 ? 0.1 : -0.1, val + 2 * att);
						}
					});
					const eff = 100 / val + 15;
					current.hp = _hp;
					current.maxHp = _maxhp;
					return [current, eff];
				})
				.sort((a, b) => b[1] - a[1])[0];
			if (list[1] < 0 && !forced) {
				return targets;
			}
			const targetx = list[0];
			targets[1] = targetx;
			const list2 = sourceList
				.filter(i => i != targetx)
				.map(current => {
					const _hp = targetx.hp,
						_maxhp = targetx.maxHp;
					targetx.hp = 100;
					targetx.maxHp = 100;
					const att = -get.sgnAttitude(player, current);
					const eff = get.damageEffect(targetx, current, current) * att;
					targetx.hp = _hp;
					targetx.maxHp = _maxhp;
					return [current, eff];
				})
				.sort((a, b) => b[1] - a[1])[0];
			if (!list2) {
				return targets;
			}
			targets[0] = list2[0];
			return targets;
		},
		ai: {
			order: 6,
			result: {
				player(player) {
					if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) {
						return 0;
					}
					var limit = 25;
					var quesong = player.hasSkill("mbquesong") && !player.getStat().damaged;
					if (quesong) {
						limit -= 7.5;
					}
					if (
						quesong &&
						game.hasPlayer(target => {
							var att = get.attitude(player, target);
							if (att < 0) {
								return false;
							}
							return (
								att *
									Math.sqrt(
										Math.max(
											1,
											[1, 2, 3, 4].reduce((p, c) => p + target.countEmptySlot(c), 0)
										)
									) >=
									10 || target.getHp() <= 2
							);
						})
					) {
						return 1;
					}
					if (
						!quesong &&
						game.hasPlayer(target => {
							if (target == player) {
								return false;
							}
							var _hp = target.hp,
								_maxhp = target.maxHp;
							target.hp = 100;
							target.maxHp = 100;
							var att = -get.sgnAttitude(player, target);
							var val = get.damageEffect(target, player, target) * att;
							target.getSkills(null, false, false).forEach(skill => {
								var info = get.info(skill);
								if (info && info.ai && (info.ai.maixie || info.ai.maixie_hp || info.ai.maixie_defend)) {
									val = Math[val > 0 ? "max" : "min"](val > 0 ? 0.1 : -0.1, val + 2 * att);
								}
							});
							var eff = 100 / val;
							target.hp = _hp;
							target.maxHp = _maxhp;
							if (eff < limit) {
								return false;
							}
							return true;
						})
					) {
						return 1;
					}
					return 0;
				},
			},
			combo: "mbquesong",
			halfneg: true,
		},
	},
	mbquesong: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return player.hasHistory("damage");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, 3])
				.set("ai", target => {
					const player = get.player();
					if (get.attitude(player, target) <= 0) {
						return 0;
					}
					var len = 4 - (ui.selected.targets.length + 1),
						hp = target.getHp();
					return len + target.isTurnedOver() * 2 + (1.5 * Math.min(4, target.getDamagedHp())) / (hp + 1);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			const num = targets.length;
			const list = [`摸${get.cnNumber(4 - num)}张牌并复原武将牌`, `${num > 1 ? `弃置${get.cnNumber(num - 1)}张牌然后` : ""}回复一点体力`];
			if (player.getHistory("damage").length > num) {
				list.push(`依次执行以上两项，然后非锁定失效直到你下个回合开始`);
			}
			await game.doAsyncInOrder(targets, async target => {
				const result = await target
					.chooseControl()
					.set("choiceList", list)
					.set("prompt", "雀颂：请选择一项")
					.set("ai", () => {
						const { num, player } = get.event();
						return get.effect(player, { name: "draw" }, player, player) * (4 - num) >= get.effect(player, { name: "guohe_copy2" }, player, player) + get.recoverEffect(player, player, player) ? 0 : 1;
					})
					.set("num", num)
					.forResult();
				if (typeof result.index == "number") {
					const { index } = result;
					if (index % 2 == 0) {
						await target.draw(4 - num);
						await target.link(false);
						await target.turnOver(false);
					}
					if (index > 0) {
						if (num > 1) {
							await target.chooseToDiscard(num - 1, "he", true);
						}
						await target.recover();
					}
					if (index == 2) {
						target.addTempSkill("fengyin", { player: "phaseBeforeStart" });
					}
				}
			});
		},
		ai: {
			expose: 0.2,
			maixie: true,
			skillTagFilter(player, tag) {
				if (player.getStat().damaged) {
					return false;
				}
			},
		},
	},
	old_mbquesong: {
		audio: "mbquesong",
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return player.getHistory("damage").length;
		},
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("mbquesong")).set("ai", target => {
				var player = _status.event.player;
				if (get.attitude(player, target) <= 0) {
					return 0;
				}
				var len = lib.skill.old_mbquesong.getNum(target),
					hp = target.getHp();
				return len + target.isTurnedOver() * 2 + (1.5 * Math.min(4, target.getDamagedHp())) / (hp + 1);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("mbquesong", target);
				var len = lib.skill.old_mbquesong.getNum(target);
				if (target.isHealthy()) {
					event._result = { index: 0 };
				} else {
					target
						.chooseControl()
						.set("choiceList", ["摸" + get.cnNumber(len) + "张牌并复原武将牌", "回复1点体力"])
						.set("prompt", "雀颂：请选择一项")
						.set("ai", () => {
							var player = _status.event.player;
							var len = _status.event.len;
							return get.effect(player, { name: "draw" }, player, player) * len >= get.recoverEffect(player, player, player) ? 0 : 1;
						})
						.set("len", len);
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.index == 1) {
				target.recover();
				event.finish();
			} else {
				target.draw(lib.skill.old_mbquesong.getNum(target));
			}
			"step 3";
			target.link(false);
			"step 4";
			target.turnOver(false);
		},
		getNum(player) {
			return player.countCards("e", card => get.subtype(card) != "equip5") >= 3 ? 2 : 3;
		},
		ai: {
			expose: 0.2,
			maixie: true,
			skillTagFilter(player, tag) {
				if (player.getStat().damaged) {
					return false;
				}
			},
		},
	},
	//王戎
	mpjianlin: {
		audio: 2,
		trigger: {
			global: "phaseAfter",
		},
		getCards(player) {
			const cards = [];
			game.checkGlobalHistory("cardMove", evt => {
				if (evt.name == "lose") {
					if (evt.position !== ui.discardPile) {
						return false;
					}
				} else if (evt.name !== "cardsDiscard") {
					return false;
				}
				if (get.info("mpjianlin").isUseOrRespond(evt, player)) {
					cards.addArray(
						evt.cards.filter(card => {
							return get.type(card) == "basic" && get.position(card) === "d";
						})
					);
				}
			});
			player.checkHistory("lose", evt => {
				if (evt.type == "discard") {
					cards.addArray(
						evt.cards2.filter(card => {
							return get.type(card) == "basic" && get.position(card) === "d";
						})
					);
				}
			});
			return cards;
		},
		isUseOrRespond(event, player) {
			if (event.name !== "cardsDiscard") {
				return false;
			}
			const evtx = event.getParent();
			if (evtx.name !== "orderingDiscard") {
				return false;
			}
			const evt2 = evtx.relatedEvent || evtx.getParent();
			return ["useCard", "respond"].includes(evt2.name) && evt2.player == player;
		},
		filter(event, player) {
			return get.info("mpjianlin").getCards(player).length;
		},
		async cost(event, trigger, player) {
			const cards = get.info(event.skill).getCards(player);
			const { bool, links } = await player.chooseButton(["俭吝：你可以获得其中一张牌", cards]).set("ai", get.buttonValue).forResult();
			event.result = {
				bool: bool,
				cost_data: links,
			};
		},
		async content(event, trigger, player) {
			player.gain(event.cost_data, "gain2");
		},
	},
	mpsixiao: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		locked: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(true, lib.filter.notMe, "死孝：请选择一名角色当其孝子", lib.translate.mpsixiao_info)
				.set("ai", target => {
					return get.attitude(get.player(), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			game.log(player, "成为了", target, "的孝子");
			target.storage.mpsixiao_use = player;
			target.addSkill("mpsixiao_use");
		},
		subSkill: {
			use: {
				charlotte: true,
				mark: "character",
				intro: {
					content: "当你需要使用或打出牌时，你可以观看$的手牌并可以使用或打出其中一张牌，然后$摸一张牌",
				},
				hiddenCard(player, name) {
					if (!lib.inpile.includes(name) || player.hasSkill("mpsixiao_used", null, null, false)) {
						return false;
					}
					const target = player.storage.mpsixiao_use;
					const cards = target.getCards("h");
					for (var i of cards) {
						if (get.name(i, target) == name) {
							return true;
						}
					}
					return false;
				},
				enable: ["chooseToUse", "chooseToRespond"],
				filter(event, player) {
					const target = player.storage.mpsixiao_use;
					const cards = target.getCards("h");
					if (player.hasSkill("mpsixiao_used", null, null, false)) {
						return false;
					}
					return cards.some(i =>
						event.filterCard(
							{
								name: get.name(i, target),
								nature: get.nature(i, target),
								isCard: true,
							},
							player,
							event
						)
					);
				},
				chooseButton: {
					dialog(event, player) {
						const target = player.storage.mpsixiao_use;
						const cards = target.getCards("h");
						return ui.create.dialog("死孝", cards);
					},
					filter(button, player) {
						const evt = _status.event.getParent();
						const target = player.storage.mpsixiao_use;
						return evt.filterCard(
							{
								name: get.name(button.link, target),
								nature: get.nature(button.link, target),
								isCard: true,
							},
							player,
							evt
						);
					},
					check(button) {
						const player = get.player();
						const evt = _status.event.getParent();
						if (evt.dying) {
							return get.attitude(player, evt.dying);
						}
						if (_status.event.getParent().type != "phase") {
							return 1;
						}
						return player.getUseValue(get.autoViewAs(button.link), null, true);
					},
					backup(links, player) {
						const target = player.storage.mpsixiao_use;
						return {
							viewAs: {
								name: get.name(links[0], target),
								nature: get.nature(links[0], target),
								isCard: true,
							},
							card: links[0],
							filterCard: () => false,
							selectCard: -1,
							log: false,
							async precontent(event, trigger, player) {
								const card = lib.skill.mpsixiao_use_backup.card,
									target = player.storage.mpsixiao_use;
								event.result.card = card;
								event.result.cards = [card];
								player.logSkill("mpsixiao_use", target);
								player.addTempSkill("mpsixiao_used");
								target
									.when({ global: ["useCardAfter", "respondAfter"] })
									.filter(evt => evt.player == player && evt.skill == "mpsixiao_use_backup")
									.step(async () => {
										await target.draw();
									});
							},
						};
					},
					ai: {
						respondSha: true,
						respondShan: true,
						skillTagFilter(player, tag) {
							const name = "s" + tag.slice("respondS".length);
							return lib.skill.mpsixiao_use.hiddenCard(player, name);
						},
					},
				},
				ai: {
					order: 8,
					result: {
						player: 1,
					},
				},
			},
			used: {},
		},
	},
	//小程序刘伶
	mpjiusong: {
		audio: 2,
		enable: "chooseToUse",
		trigger: { global: "useCard" },
		filterCard(card) {
			return get.type2(card) == "trick";
		},
		viewAs: { name: "jiu" },
		position: "hs",
		viewAsFilter(player) {
			return player.hasCard(card => get.type2(card) == "trick", "hs");
		},
		check(card) {
			if (get.itemtype(card) !== "card") {
				return true;
			}
			if (get.event().type == "dying") {
				return 1 / Math.max(0.1, get.value(card));
			}
			return 4 - get.value(card);
		},
		prompt: "将一张锦囊牌当【酒】使用",
		filter(event, player) {
			if (event.name == "chooseToUse") {
				return player.hasCard(card => get.type2(card) == "trick", "hs");
			}
			return event.card?.name == "jiu" && player.countMark("mpjiusong") < 3;
		},
		forced: true,
		locked: false,
		content() {
			player.addMark("mpjiusong");
		},
		marktext: "醉",
		intro: {
			name: "醉(酒颂/酕醄)",
			name2: "醉",
			content: "mark",
		},
	},
	mpmaotao: {
		audio: 2,
		trigger: { global: "useCardToPlayer" },
		filter(event, player) {
			if (event.targets.length != 1 || !event.isFirstTarget) {
				return false;
			}
			if (!["basic", "trick"].includes(get.type(event.card))) {
				return false;
			}
			return event.player != player && player.countMark("mpjiusong");
		},
		prompt2(event, player) {
			let list;
			if (get.type(event.card) != "delay") {
				list = game.filterPlayer(current => {
					return lib.filter.targetEnabled2(event.card, event.player, current);
				});
			} else {
				list = game.filterPlayer(current => lib.filter.judge(event.card, event.player, current));
			}
			const gainText = `${list.length > 1 && !player.storage.mpmaotao_gained ? `若新目标与原目标相同，你` : ""}${!player.storage.mpmaotao_gained ? "获得牌堆中的一张锦囊牌。" : ""}`;
			return `移去1枚“醉”${list.length > 1 ? `，令${get.translation(event.card)}目标改为${get.translation(list)}中的一名随机角色` : ""}。${gainText}`;
		},
		check(event, player) {
			const eff = get.effect(event.target, event.card, player, player);
			let list;
			if (get.type(event.card) != "delay") {
				list = game.filterPlayer(current => {
					return lib.filter.targetEnabled2(event.card, event.player, current);
				});
			} else {
				list = game.filterPlayer(current => lib.filter.judge(event.card, event.player, current));
			}
			let list2 = list.filter(current => get.effect(current, event.card, player, player) > eff);
			let list3 = list.filter(current => get.effect(current, event.card, player, player) > 0);
			return list2.length >= list.length / 2 || (player.countMark("mpjiusong") >= 2 && list3.length >= list.length / 2);
		},
		content() {
			player.removeMark("mpjiusong", 1);
			var list,
				oriTarget = trigger.target;
			trigger.targets.remove(oriTarget);
			trigger.getParent().triggeredTargets1.remove(oriTarget);
			trigger.untrigger();
			game.delayx();
			if (get.type(trigger.card) != "delay") {
				list = game.filterPlayer(current => {
					return lib.filter.targetEnabled2(trigger.card, trigger.player, current);
				});
			} else {
				list = game.filterPlayer(current => lib.filter.judge(trigger.card, trigger.player, current));
			}
			if (list.length) {
				target = list.randomGet();
			}
			trigger.targets.push(target);
			trigger.player.line(target, "thunder");
			game.log(trigger.card, "的目标被改为", target);
			if (target == oriTarget && !player.storage.mpmaotao_gained) {
				var card = get.cardPile2(card => get.type2(card) == "trick");
				if (card) {
					if (!player.storage.mpmaotao_gained) {
						player.when({ global: "phaseAfter" }).step(async () => {
							delete player.storage.mpmaotao_gained;
						});
						player.storage.mpmaotao_gained = true;
					}
					player.gain(card, "gain2");
				} else {
					// player.chat('没酒了！');
					// game.log('但是牌堆中已经没有','#y酒','了!');
					player.chat("没牌了！");
					game.log("但是牌堆中已经没有", "#y锦囊牌", "了!");
				}
			}
		},
		ai: {
			combo: "mpjiusong",
		},
	},
	mpbishi: {
		audio: 2,
		forced: true,
		trigger: { global: "useCard1" },
		filter(event, player) {
			if (get.type2(event.card) != "trick" || !get.tag(event.card, "damage")) {
				return false;
			}
			if (!lib.skill.xunshi.isXunshi(event.card)) {
				return false;
			}
			const targets = event.targets.slice();
			targets.remove(event.player);
			return targets.length == game.countPlayer() - 2;
		},
		async content(event, trigger, player) {},
		mod: {
			targetEnabled(card) {
				if (get.type2(card) == "trick" && get.tag(card, "damage") > 0) {
					return false;
				}
			},
		},
	},
};

export default skills;
