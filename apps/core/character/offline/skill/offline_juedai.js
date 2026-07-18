import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	zj_juxian: {
		trigger: {
			player: ["damageBegin3", "loseBefore"],
		},
		usable: 20, //红桃七惨案
		filter(event, player) {
			if (event.name == "damage") {
				return player.countCards("h") == 1;
			}
			return event.cards.length && event.cards.someInD("he");
		},
		prompt2(event, player) {
			if (event.name == "damage") {
				return "防止此伤害";
			}
			return `即将失去${get.translation(event.cards.filterInD("he"))}，失去1点体力并防止之`;
		},
		check(event, player) {
			if (event.name == "damage") {
				return true;
			}
			if (player.hp <= 1) {
				return false;
			}
			return event.cards.filterInD("he").reduce((sum, card) => sum + player.getUseValue(card), -10) > 0;
		},
		async content(event, trigger, player) {
			if (trigger.name == "damage") {
				trigger.cancel();
				return;
			}
			await player.loseHp();
			if (trigger.cards.everyInD("he")) {
				trigger.cancel();
			} else {
				for (let i = 0; i < trigger.cards.length; i++) {
					const pos = get.position(trigger.cards[i]);
					if ("he".includes(pos)) {
						trigger.cards.splice(i--, 1);
					}
				}
			}
		},
	},
	zj_lijun: {
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
		},
		filter(event, player) {
			if (event.name == "phaseZhunbei") {
				return game.hasPlayer(current => current.isDamaged());
			}
			return !player.getHistory("lose", evt => evt.type == "discard").length;
		},
		async cost(event, trigger, player) {
			if (trigger.name == "phaseZhunbei") {
				event.result = await player
					.chooseTarget(
						get.prompt(event.skill),
						"令任意名已受伤的角色各摸一张牌",
						(card, player, target) => {
							return target.isDamaged();
						},
						[1, Infinity]
					)
					.set("ai", target => {
						return get.attitude(get.player(), target);
					})
					.forResult();
			} else {
				event.result = await player.chooseBool(get.prompt(event.skill), "回复1点体力").forResult();
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "phaseZhunbei") {
				await game.asyncDraw(event.targets.sortBySeat(player));
			} else {
				await player.recover();
			}
		},
	},
	zj_duanbing: {
		audio: "duanbing",
		trigger: {
			player: ["useCard2", "useCardToPlayered"],
			source: "damageSource",
		},
		filter(event, player) {
			if (event.name == "damage") {
				if (get.distance(player, event.player) > 1) {
					return false;
				}
				return player.getHistory("sourceDamage", evt => evt.player == event.player).indexOf(event) === 0;
			}
			if (event.card?.name != "sha") {
				return false;
			}
			if (event.name == "useCard") {
				return game.hasPlayer(current => {
					return !event.targets.includes(current) && get.distance(player, current) <= 1 && lib.filter.targetEnabled2(event.card, event.player, current);
				});
			}
			return !event.getParent().directHit.includes(event.target) && get.distance(player, event.target) <= 1;
		},
		async cost(event, trigger, player) {
			if (trigger.name == "useCard") {
				event.result = await player
					.chooseTarget(`###${get.prompt(event.skill)}###为${get.translation(trigger.card)}增加一个目标`, function (card, player, target) {
						const { sourcex, card: cardx } = get.event();
						return !sourcex.includes(target) && get.distance(player, target) <= 1 && lib.filter.targetEnabled2(cardx, player, target);
					})
					.set("sourcex", trigger.targets)
					.set("ai", function (target) {
						const { player, card } = get.event();
						return get.effect(target, card, player, player);
					})
					.set("card", trigger.card)
					.setHiddenSkill(event.skill)
					.forResult();
			} else {
				event.result = {
					bool: true,
					targets: [trigger[trigger.name == "damage" ? "player" : "target"]],
				};
			}
		},
		async content(event, trigger, player) {
			switch (trigger.name) {
				case "useCard": {
					if (!event.isMine() && !event.isOnline()) {
						await game.delayx();
					}
					trigger.targets.addArray(event.targets);
					break;
				}
				case "damage": {
					await player.draw();
					break;
				}
				default: {
					const id = trigger.target.playerid,
						map = trigger.getParent().customArgs;
					map[id] ??= {};
					if (typeof map[id].shanRequired == "number") {
						map[id].shanRequired++;
					} else {
						map[id].shanRequired = 2;
					}
					break;
				}
			}
		},
		ai: {
			effect: {
				directHit_ai: true,
				skillTagFilter(player, tag, arg) {
					if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1 || get.distance(player, arg.target) > 1) {
						return false;
					}
				},
				player_use(card, player, target, current, isLink) {
					if (!isLink && card.name == "sha") {
						if (player._reduanbingtmp) {
							return;
						}
						player._reduanbingtmp = true;
						if (get.effect(target, card, player, player) <= 0) {
							delete player._reduanbingtmp;
							return;
						}
						if (
							game.hasPlayer(function (current) {
								return current != target && get.distance(player, current) <= 1 && player.canUse(card, current) && get.effect(current, card, player, player) > 0;
							})
						) {
							delete player._reduanbingtmp;
							return [1, 1];
						}
						delete player._reduanbingtmp;
					}
				},
			},
		},
	},
	zj_fenxun: {
		audio: "fenxun",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player;
		},
		async content(event, trigger, player) {
			const target = event.target;
			player.markAuto("fenxun2", [target]);
			player.addTempSkill("fenxun2");
		},
		ai: {
			order: 4,
			result: {
				player(player, target) {
					if (get.distance(player, target) <= 1) {
						return 0;
					}
					var hs = player.getCards("h", "shunshou");
					if (hs.length && player.canUse(hs[0], target, false)) {
						return 1;
					}
					var geteff = function (current) {
						return player.canUse("sha", current, false, true) && get.effect(current, { name: "sha" }, player, player) > 0;
					};
					if (player.hasSha() && geteff(target)) {
						var num = game.countPlayer(function (current) {
							return current != player && get.distance(player, current) <= 1 && geteff(current);
						});
						if (num == 0) {
							if (
								game.hasPlayer(function (current) {
									return player.canUse("sha", current) && geteff(current) && current != target;
								})
							) {
								return 1;
							}
						} else if (num == 1) {
							return 1;
						}
					}
					return 0;
				},
			},
		},
	},
	zj_dangxian: {
		audio: "dangxian",
		trigger: {
			player: "phaseBegin",
		},
		forced: true,
		async content(event, trigger, player) {
			const cards = Array.from(ui.discardPile.childNodes).filter(card => card.name == "sha");
			if (cards.length) {
				const result = await player.chooseButton(["获得一张杀", cards], true).forResult();
				if (result?.bool && result?.links?.length) {
					await player.gain(result.links, "gain2");
				}
			}
			game.updateRoundNumber();
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
		},
		mod: {
			targetInRange(card, player) {
				const evt = get.event().getParent("phaseUse", true);
				if (evt?._extraPhaseReason) {
					return true;
				}
			},
		},
	},
	zj_fuli: {
		audio: "refuli",
		skillAnimation: true,
		animationColor: "soil",
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
			player.awakenSkill(event.name);
			await player.recoverTo(2);
			await player.draw(2);
			const next = player.insertPhase();
			next.phaseList = ["phaseUse"];
		},
		ai: {
			order: 3,
			save: true,
			skillTagFilter(player, arg, target) {
				return player == target;
			},
			result: { player: 10 },
			threaten(player, target) {
				if (!target.storage.zj_fuli) {
					return 0.9;
				}
			},
		},
	},
	//绝代智将
	//张虎乐綝
	zj_cuijian: {
		audio: "cuijian",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => lib.skill.zj_cuijian.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const target = event.target;
			const { cards } = await target.showHandcards().forResult();
			const gains = cards.filter(card => get.name(card, target) == "shan" || get.subtype(card) == "equip2");
			if (gains?.length) {
				await player.gain(gains, "give", target, "bySelf");
			}
			if (!player.hasHistory("gain", evt => evt.getParent() == event)) {
				await player.draw(2);
			}
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					return target.countCards("h") * -0.5;
				},
			},
		},
	},
	zj_porui: {
		audio: "dcporui",
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			if (player == event.player) {
				return false;
			}
			if (player.countMark("zj_porui_round") >= 2 || player.countCards("he") <= 1) {
				return false;
			}
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				return current.hasHistory("lose", function (evt) {
					return evt.cards2.length > 0;
				});
			});
		},
		async cost(event, trigger, player) {
			const map = new Map();
			game.countPlayer(function (current) {
				if (current == player) {
					return false;
				}
				const num = current.getHistory("lose").reduce((sum, evt) => {
					if (evt?.cards2?.length) {
						return sum + evt.cards2.length;
					}
					return sum;
				}, 1);
				map.set(current, Math.min(5, num));
			});
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard(card, player) {
						return lib.filter.cardDiscardable(card, player, "zj_porui");
					},
					selectCard: 2,
					position: "he",
					filterTarget(card, player, target) {
						const { map } = get.event();
						if (map.has(target) && map.get(target) > 1) {
							target.prompt(`破锐${map.get(target)}`);
							return true;
						}
						return false;
					},
					complexTarget: true,
					ai1(card) {
						return 7 - get.value(card);
					},
					ai2(target) {
						const { player, map } = get.event(),
							num = map.get(target);
						let eff = get.effect(target, { name: "sha" }, player, player);
						if (num > 1 && eff !== 0) {
							eff -= (10 / target.getHp()) * Math.pow(2, num);
						}
						return eff * num;
					},
				})
				.set("map", map)
				.forResult();
		},
		async content(event, trigger, player) {
			player.addTempSkill("zj_porui_round", "roundStart");
			player.addMark("zj_porui_round", 1, false);
			const {
				cards,
				targets: [target],
			} = event;
			await player.modedDiscard(cards);
			const num = Math.min(
				5,
				target.getHistory("lose").reduce((sum, evt) => {
					if (evt?.cards2?.length) {
						return sum + evt.cards2.length;
					}
					return sum;
				}, 1)
			);
			let count = 0;
			while (count < num) {
				count++;
				const card = new lib.element.VCard({ name: "sha", isCard: true });
				if (target?.isIn() && player.canUse(card, target, false)) {
					await player.useCard(card, target);
				}
			}
		},
		subSkill: {
			round: { charlotte: true, onremove: true },
		},
		ai: {
			expose: 0.4,
			threaten: 3.8,
		},
	},
	//胡烈
	zj_chengxi: {
		trigger: {
			player: "useCardToPlayer",
		},
		logTarget: "target",
		filter(event, player) {
			return event.targets?.length == 1 && event.target.countCards("h");
		},
		check(event, player) {
			return get.effect(event.target, event.card, event.player, player) * get.attitude(player, event.target) >= 0;
		},
		async content(event, trigger, player) {
			const target = trigger.target;
			const { cards } = await target.showHandcards(`${get.translation(player)}发动了【乘袭】`).forResult();
			if (!target.countCards("he")) {
				return;
			}
			const eff = lib.skill.dcshixian.filterx(trigger) ? get.effect(target, trigger.card, trigger.player, target) : 0;
			const result = await target
				.chooseCard([1, Infinity], "重铸至少一张牌", true, lib.filter.cardRecastable, "he", "allowChooseAll")
				.set("ai", card => {
					const { player, showCards: cards, eff } = get.event(),
						suit = get.suit(card),
						selects = ui.selected.cards ?? [];
					if (eff >= 0 && selects.length) {
						return 0;
					}
					if (selects.some(cardx => get.suit(cardx) == suit) || cards.every(cardx => get.suit(cardx) != suit)) {
						return 4 - get.value(card);
					}
					return 8 - get.value(card);
				})
				.set("complexCard", true)
				.set("showCards", cards)
				.set("eff", eff)
				.forResult();
			if (result.bool && result.cards?.length) {
				await target.recast(result.cards);
				const suits1 = cards.map(card => get.suit(card)).toUniqued(),
					suits2 = result.cards.map(card => get.suit(card)).toUniqued(),
					num = suits1.removeArray(suits2).length;
				if (num > 0 && lib.skill.dcshixian.filterx(trigger)) {
					trigger.getParent().effectCount += num;
					game.log(player, "令", trigger.card, `额外结算了${num}次`);
				}
			}
		},
	},
	zj_zhaoe: {
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (!_status.currentPhase?.isIn() || !_status.currentPhase.countCards("h")) {
				return false;
			}
			return player.hasHistory("lose", evt => evt?.cards2?.length);
		},
		skillAnimation: true,
		animationColor: "thunder",
		limited: true,
		logTarget: () => _status.currentPhase,
		check(event, player) {
			if (!_status.currentPhase || get.attitude(player, _status.currentPhase) >= 0) {
				return false;
			}
			return _status.currentPhase.countCards("h") >= game.players.length / 2;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.awakenSkill(event.name);
			const { cards } = await target.showHandcards(`${get.translation(player)}发动了【昭恶】`).forResult();
			const num = cards.filter(card => get.is.damageCard(card)).length;
			if (num <= 0) {
				return;
			}
			const result = await player
				.chooseTarget(`令至多${get.cnNumber(num)}名角色对其使用${get.cnNumber(num)}张杀`, [1, num], true)
				.set("ai", target => {
					const { player, targetx } = get.event(),
						card = get.autoViewAs({ name: "sha" }, "unsure");
					if (get.attitude(target, targetx) >= 0) {
						return 0.1;
					}
					let eff = get.effect(targetx, card, target, player);
					if (target.mayHaveSha(player, "use", null, "bool")) {
						eff *= 1.5;
					}
					return eff;
				})
				.set("targetx", target)
				.forResult();
			if (result?.bool && result.targets?.length) {
				player.line(result.targets);
				await game.delay(2);
				for (const current of result.targets.sortBySeat(target)) {
					let count = 0;
					while (count < num) {
						count++;
						const result = await current
							.chooseToUse(
								function (card, player, event) {
									if (get.name(card) != "sha") {
										return false;
									}
									return lib.filter.filterCard.apply(this, arguments);
								},
								`昭恶：是否对${get.translation(target)}使用杀？（${count}/${num}）`
							)
							.set("targetRequired", true)
							.set("complexTarget", true)
							.set("filterTarget", function (card, player, target) {
								const { preTarget } = get.event();
								if (target != preTarget && !ui.selected.targets?.includes(preTarget)) {
									return false;
								}
								return lib.filter.targetEnabled.apply(this, arguments);
							})
							.set("preTarget", target)
							.forResult();
						if (!result?.bool) {
							break;
						}
					}
				}
			}
		},
	},
	//诸葛绪
	zj_tuizhi: {
		enable: "chooseToUse",
		hiddenCard(player, name) {
			if (get.type(name) == "basic" && lib.inpile.includes(name) && player.countCards("h")) {
				return true;
			}
		},
		filter(event, player) {
			if (event.responded || !player.countCards("h")) {
				return false;
			}
			for (let i of lib.inpile) {
				if (get.type(i) == "basic" && event.filterCard({ name: i, isCard: true }, player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					const card = get.autoViewAs({ name: info[2], nature: info[3] }, "unsure");
					return event.filterCard(card, player, event);
				});
				return ui.create.dialog("退制", [list, "vcard"], "hidden");
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				if (button.link[2] == "shan") {
					return 3;
				}
				let player = _status.event.player;
				if (button.link[2] == "jiu") {
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
					filterCard(card, player) {
						return player.getCards("h").every(cardx => {
							if (get.color(cardx) != get.color(card)) {
								return true;
							}
							return lib.filter.cardDiscardable(cardx, player);
						});
					},
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						suit: "none",
						number: null,
						isCard: true,
					},
					position: "h",
					ignoreMod: true,
					check(card) {
						return player
							.getCards("h", cardx => get.color(cardx) == get.color(card))
							.reduce((sum, cardx) => {
								return sum - get.value(cardx);
							}, 10);
					},
					log: false,
					async precontent(event, trigger, player) {
						player.logSkill("zj_tuizhi");
						const cards = player.getCards("h", card => get.color(card) == get.color(event.result.cards[0]));
						await player.showCards(cards);
						await player.discard(cards);
						event.result.card = {
							name: event.result.card.name,
							nature: event.result.card.nature,
							isCard: true,
						};
						event.result.cards = [];
						player
							.when({
								player: "useCardAfter",
							})
							.filter(evt => evt.getParent() == event.getParent())
							.step(async (event, trigger, player) => {
								if (
									game.hasPlayer2(current => {
										return current.hasHistory("sourceDamage", evt => evt.card == trigger.card);
									}, true)
								) {
									await player.draw();
								}
							});
					},
				};
			},
			prompt(links, player) {
				const [_1, _2, name, nature] = links[0];
				return `弃置一种颜色的所有手牌，然后视为使用${get.translation(nature) || ""}${get.translation(name)}`;
			},
		},
		ai: {
			order: 1,
			respondShan: true,
			respondSha: true,
			skillTagFilter(player) {
				if (!player.countCards("h")) {
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
	},
	zj_qianjun: {
		trigger: {
			global: "useCardAfter",
		},
		filter(event, player) {
			if (event.player == player || event.card?.name != "sha") {
				return false;
			}
			const card = get.autoViewAs({ name: "sha" }, "unsure");
			return event.targets?.some(target => player.canUse(card, target, false));
		},
		direct: true,
		clearTime: true,
		async content(event, trigger, player) {
			const next = player
				.chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				}, get.prompt2(event.name))
				.set("targetRequired", true)
				.set("filterTarget", function (card, player, target) {
					const { preTargets: targets } = get.event();
					if (!targets.includes(target)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("logSkill", event.name)
				.set("preTargets", trigger.targets);
			const result = await next.forResult();
			if (!result?.bool) {
				return;
			}
			const evts = player.getHistory("useCard", evt => evt.getParent() == next);
			if (evts.length && evts[0]?.targets?.length) {
				const evt = evts[0];
				for (const target of evt.targets) {
					if (!target.hasHistory("damage", evtx => evtx.card == evt.card)) {
						await player.discardPlayerCard(target, "he", true);
					}
				}
			}
		},
	},
	zj_guluo: {
		trigger: {
			player: "dying",
		},
		filter(event, player) {
			return !player.countCards("h");
		},
		forced: true,
		async content(event, trigger, player) {
			await player.loseMaxHp();
			await player.recoverTo(1);
		},
	},
	//陆抗
	zj_jueyan: {
		audio: "drlt_jueyan",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasEnabledSlot(1) || player.hasEnabledSlot(2) || player.hasEnabledSlot(5) || player.hasEnabledSlot("horse");
		},
		async content(event, trigger, player) {
			const { control } = await player
				.chooseToDisable(true)
				.set("ai", function (event, player, list) {
					if (list.includes("equip2")) {
						return "equip2";
					}
					if (
						list.includes("equip1") &&
						player.countCards("h", function (card) {
							return get.name(card, player) == "sha" && player.hasUseTarget(card);
						}) -
							player.getCardUsable("sha") >
							1
					) {
						return "equip1";
					}
					if (
						list.includes("equip5") &&
						player.countCards("h", function (card) {
							return get.type2(card, player) == "trick" && player.hasUseTarget(card);
						}) > 1
					) {
						return "equip5";
					}
				})
				.forResult();
			switch (control) {
				case "equip1":
					player.addTempSkill("zj_jueyan_limit");
					break;
				case "equip2": {
					await player.draw(3);
					const evt = event.getParent("phase", true);
					if (evt?.player == player) {
						for (let i = evt.num; i < evt.phaseList.length; i++) {
							const phase = evt.phaseList[i];
							if (phase.startsWith("phaseDiscard")) {
								evt.phaseList[i] = phase.replace("phaseDiscard", `skipDiscard-${event.name}`);
							}
						}
					}
					break;
				}
				case "equip3_4":
					player.addTempSkill("zj_jueyan_distance");
					break;
				case "equip5":
					await player.addTempSkills("rejizhi");
					break;
			}
		},
		ai: {
			order: 13,
			result: {
				player(player) {
					if (player.hasEnabledSlot("equip2")) {
						return 1;
					}
					if (
						player.hasEnabledSlot("equip1") &&
						player.countCards("h", function (card) {
							return get.name(card, player) == "sha" && player.hasValueTarget(card);
						}) -
							player.getCardUsable("sha") >
							1
					) {
						return 1;
					}
					if (
						player.hasEnabledSlot("equip5") &&
						player.countCards("h", function (card) {
							return get.type2(card, player) == "trick" && player.hasUseTarget(card);
						}) > 1
					) {
						return 1;
					}
					return -1;
				},
			},
		},
		derivation: "rejizhi",
		subSkill: {
			limit: {
				mod: {
					cardUsable: () => Infinity,
				},
				mark: true,
				marktext: "决",
				charlotte: true,
				locked: false,
				intro: {
					name: "决堰 - 武器",
					content: "本回合使用牌无次数限制",
				},
			},
			distance: {
				trigger: {
					player: "useCard",
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
				},
				mod: {
					targetInRange: () => true,
				},
				mark: true,
				marktext: "决",
				charlotte: true,
				locked: false,
				intro: {
					name: "决堰 - 坐骑",
					content: "本回合使用牌无距离限制且不可被响应",
				},
			},
		},
	},
	zj_huairou: {
		audio: "drlt_huairou",
		enable: "phaseUse",
		position: "he",
		filter(event, player) {
			return player.hasCard(card => get.info("zj_huairou").filterCard(card, player), "he");
		},
		filterCard(card, player) {
			return get.type(card) == "equip" && player.canRecast(card);
		},
		check(card) {
			if (get.position(card) == "e") {
				return 0.5 - get.value(card, get.player());
			}
			if (!get.player().hasEquipableSlot(get.subtype(card))) {
				return 5;
			}
			return 3 - get.value(card);
		},
		async content(event, trigger, player) {
			const next = player.recast(event.cards).set("skill", event.name);
			await next;
			if (
				game
					.getGlobalHistory("everything", evt => {
						if (evt.name != "recast") {
							return false;
						}
						return evt.player == player && evt.skill == event.name;
					})
					.indexOf(next) != 0
			) {
				return;
			}
			const cards = get.inpileVCardList(info => {
				return info[0] == "trick" && player.hasUseTarget(info[2]);
			});
			if (!cards?.length) {
				return;
			}
			const result = await player
				.chooseButton(["怀柔：是否视为使用一张普通锦囊牌？", [cards, "vcard"]])
				.set("ai", button => {
					return get.player().getUseValue(button.link[2]);
				})
				.forResult();
			if (result?.bool) {
				const card = new lib.element.VCard({ name: result.links[0][2], isCard: true });
				if (player.hasUseTarget(card)) {
					await player.chooseUseTarget(card, true);
				}
			}
		},
		discard: false,
		lose: false,
		delay: false,
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	//赵统赵广
	zj_yizan: {
		audio: "yizan_respond_shan",
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (get.type(name) != "basic") {
				return false;
			}
			return player.countCards("esh") > 1;
		},
		filter(event, player) {
			if (player.countCards("hes") < 2) {
				return false;
			}
			for (const name of lib.inpile) {
				if (get.type(name) != "basic") {
					continue;
				}
				if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
					return true;
				}
				if (name == "sha") {
					for (const nature of lib.inpile_nature) {
						if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				let list = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					const card = get.autoViewAs({ name: info[2], nature: info[3] }, "unsure");
					return event.filterCard(card, player, event);
				});
				return ui.create.dialog("翊赞", [list, "vcard"], "hidden");
			},
			check(button) {
				let player = _status.event.player;
				let card = { name: button.link[2], nature: button.link[3] };
				if (
					_status.event.getParent().type != "phase" ||
					game.hasPlayer(function (current) {
						return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
					})
				) {
					switch (button.link[2]) {
						case "tao":
						case "shan":
							return 5;
						case "jiu": {
							if (player.countCards("hes") > 2) {
								return 3;
							}
							return 0;
						}
						case "sha":
							if (button.link[3] == "fire") {
								return 2.95;
							} else if (button.link[3] == "thunder" || button.link[3] == "ice") {
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
					audio: "zj_yizan",
					filterCard: true,
					selectCard: 2,
					check(card) {
						return 6 - get.value(card);
					},
					viewAs: { name: links[0][2], nature: links[0][3] },
					async precontent(event) {
						event.result.skill = "zj_yizan";
					},
					position: "hes",
					popname: true,
				};
			},
			prompt(links, player) {
				return `将两张牌当做${get.translation(links[0][3] || "")}${get.translation(links[0][2])}使用或打出`;
			},
		},
		ai: {
			order() {
				let player = _status.event.player;
				let event = _status.event;
				if (event.filterCard({ name: "jiu" }, player, event) && get.effect(player, { name: "jiu" }) > 0 && player.countCards("hes") > 2) {
					return 3.3;
				}
				return 3.1;
			},
			skillTagFilter(player, tag, arg) {
				if (tag == "fireAttack") {
					return true;
				}
				if (player.countCards("hes") < 2) {
					return false;
				}
			},
			result: {
				player: 1,
			},
			respondSha: true,
			respondShan: true,
			fireAttack: true,
		},
	},
	zj_shuge: {
		trigger: {
			global: "phaseEnd",
		},
		filter(event, player) {
			if (!player.hasHistory("useSkill", evt => evt.skill == "zj_yizan")) {
				return false;
			}
			return game.hasPlayer(current => current.group == "shu");
		},
		async cost(event, trigger, player) {
			const num = player.getHistory("useSkill", evt => evt.skill == "zj_yizan").length;
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, num], (card, player, target) => {
					return target.group == "shu";
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "draw" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await game.asyncDraw(event.targets);
		},
	},
	zj_zhengui: {
		trigger: {
			global: "phaseEnd",
		},
		filter(event, player) {
			const targets = get.info("zj_zhengui").logTarget(event, player);
			return targets?.length;
		},
		logTarget(event, player) {
			return game
				.filterPlayer(current => {
					if (!current.hasHistory("sourceDamage", evt => evt.player?.group == "shu")) {
						return false;
					}
					const card = new lib.element.VCard({ name: "juedou", isCard: true });
					return player.canUse(card, current);
				})
				.sortBySeat();
		},
		check(event, player) {
			const card = new lib.element.VCard({ name: "juedou", isCard: true }),
				targets = get.info("zj_zhengui").logTarget(event, player);
			return (
				targets.reduce((eff, target) => {
					return eff + get.effect(target, card, player, player);
				}, 0) > 0
			);
		},
		async content(event, trigger, player) {
			for (const target of event.targets) {
				const card = new lib.element.VCard({ name: "juedou", isCard: true });
				if (player.canUse(card, target)) {
					await player.useCard(card, target);
				}
			}
		},
	},
	//诸葛瞻
	zj_zhongwang: {
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseEnd"],
		},
		locked: true,
		filter(event, player) {
			return event.name != "phase" || event?.zhongwangMap?.has(player);
		},
		async cost(event, trigger, player) {
			if (trigger.name == "phase") {
				const targets = trigger.zhongwangMap?.get(player)?.filter(target => target?.isIn());
				let num = 0;
				if (player.isMinHandcard()) {
					num++;
				}
				if (player.hasHistory("sourceDamage")) {
					num++;
				}
				if (!player.hasHistory("lose", evt => evt.type == "discard")) {
					num++;
				}
				event.result = {
					bool: true,
					cost_data: num >= 2,
					targets: [...targets],
				};
				if (num < 2) {
					event.result.targets.add(player);
				}
				if (!event.result.targets?.length) {
					event.result.bool = false;
				}
				event.result.targets.sortBySeat();
			} else {
				event.result = {
					bool: true,
					targets: game.filterPlayer(current => current != player).sortBySeat(),
				};
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "phase") {
				let doing;
				if (event.cost_data) {
					player.popup("不负众望", "fire");
					doing = target => target.draw(2);
				} else {
					player.popup("有负重托", "wood");
					doing = target => target.loseHp();
				}
				await game.doAsyncInOrder(event.targets, doing);
				return;
			}
			const list = [];
			for (const target of event.targets) {
				const result = await target
					.chooseCard(`###众望：是否相信${get.translation(player)}？###将至少一张牌置于牌堆顶`, [1, Infinity])
					.set("allowChooseAll", true)
					.set("ai", card => {
						const { player, att } = get.event();
						if (att <= 0 || ui.selected.cards?.length) {
							return 0;
						}
						if (get.tag(card, "damage") && card.name != "sha") {
							return 10 - get.value(card);
						}
						return player.getUseValue(card);
					})
					.set("att", get.attitude(target, player))
					.forResult();
				if (result.bool) {
					list.add(target);
					const cards = result.cards;
					target.$throw(cards, 1000);
					game.log(target, "将", cards, "置于了牌堆顶");
					await target.lose(cards, ui.cardPile, "insert", "visible");
				}
			}
			const map = trigger.getParent().zhongwangMap || new Map();
			map.set(player, list);
			trigger.getParent().zhongwangMap = map;
			await game.delayx(4);
			await player.draw(5);
		},
	},
	zj_fuyin: {
		trigger: {
			target: "useCardToTarget",
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		forced: true,
		async content(event, trigger, player) {
			const history = game.getGlobalHistory("useCard", evt => evt.card?.name == "sha" && evt.targets?.includes(player));
			if (history.indexOf(trigger.getParent()) == 0) {
				trigger.getParent().excluded.add(player);
			} else {
				player.addTempSkill("zj_fuyin_ranji");
			}
		},
		mod: {
			maxHandcard(player, num) {
				return num + game.countPlayer(current => current.group == "shu");
			},
		},
		subSkill: {
			ranji: {
				charlotte: true,
				mark: true,
				intro: { content: "不能回复体力" },
				trigger: { player: "recoverBefore" },
				forced: true,
				firstDo: true,
				content() {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.tag(card, "recover")) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	//柳隐
	zj_guguo: {
		trigger: {
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			return event.card?.name == "sha" || get.type2(event.card) == "trick";
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
			player
				.when({
					global: "useCardAfter",
				})
				.filter(evt => evt == trigger.getParent())
				.step(async (event, trigger, player) => {
					if (
						game.hasPlayer2(current => {
							return current.hasHistory("sourceDamage", evt => evt.card == trigger.card);
						}, true)
					) {
						return;
					}
					if (!trigger.player.countDiscardableCards(player, "he")) {
						return;
					}
					await player.discardPlayerCard(trigger.player, "he", `###固国###是否弃置${get.translation(trigger.player)}一张牌？`);
				});
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (player == target) {
						return;
					}
					let bool = get.attitude(target, player) <= 0 && !get.tag(card, "damage");
					return [1, 0.3, 1, bool ? -0.5 : 0];
				},
			},
		},
	},
	//霍弋
	zj_zhongjue: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			const targets = game.filterPlayer(current => current != player);
			event.result =
				targets.length > 1
					? await player
							.chooseTarget("###忠绝###令一名其他角色使用牌无次数限制并获得其武将牌上的主公技", true, lib.filter.notMe)
							.set("ai", target => {
								return get.attitude(get.player(), target) + 0.1;
							})
							.forResult()
					: {
							bool: true,
							targets: targets,
						};
		},
		onremove(player, skill) {
			player.getStorage(skill).forEach(target => {
				player.removeTip(`${skill}_${target.playerid}`);
			});
			player.setStorage(skill, []);
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			target.addSkill("zj_zhongjue_effect");
			target.markSkillCharacter("zj_zhongjue_effect", player, "忠绝", "使用牌无次数限制");
			player.markAuto(event.name, target);
			player.addTip(`${event.name}_${target.playerid}`, `忠绝 ${get.translation(target)}`);
			let skills = target.getStockSkills(true, true).filter(skill => {
				if (target.hasSkill(skill, null, null, false)) {
					return false;
				}
				let info = get.info(skill);
				return info && info.zhuSkill;
			});
			if (skills.length) {
				await target.addSkills(skills);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					cardUsable: () => Infinity,
				},
			},
		},
	},
	zj_qingming: {
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			const history = game.getAllGlobalHistory("useCard");
			if (!history?.length) {
				return false;
			}
			return player.getStorage("zj_zhongjue")?.some(target => {
				return target.isIn() && target.countCards("h");
			});
		},
		async cost(event, trigger, player) {
			const targets = player.getStorage("zj_zhongjue").filter(target => {
					return target?.isIn() && target.countCards("h");
				}),
				card = game.getAllGlobalHistory("useCard").slice(-1)[0].card,
				prompt = `与一名“忠绝”角色进行议事，且你的议事牌改为${get.translation(card)}`;
			if (targets.length > 1) {
				event.result = await player
					.chooseTarget(get.prompt(event.skill), prompt, (card, player, target) => {
						return get.event().targets.includes(target);
					})
					.set("targets", targets)
					.set("ai", target => {
						return get.attitude(get.player(), target) * target.countCards("h");
					})
					.forResult();
			} else {
				event.result = await player.chooseBool(get.prompt(event.skill, targets), prompt).forResult();
				event.result.targets = targets;
			}
			event.result.cost_data = card;
		},
		async content(event, trigger, player) {
			const { targets, cost_data: card } = event;
			const next = player
				.chooseToDebate([player, ...targets])
				.set("callback", async (event, trigger, player) => {
					const result = event.debateResult;
					if (result.opinions?.filter(color => result[color]?.length)?.length == 1) {
						await player.draw(2);
						await player.addSkills("zj_liefa");
						const evt = event.getParent("phase", true);
						if (evt?.player == player) {
							for (let i = evt.num; i < evt.phaseList.length; i++) {
								const phase = evt.phaseList[i];
								if (phase.startsWith("phaseDiscard")) {
									evt.phaseList[i] = phase.replace("phaseDiscard", "skipDiscard-zj_qingming");
								}
							}
						}
					}
				})
				.set("card", card)
				.set("ai", card => {
					const evt = get.event().getParent(2);
					if (evt.card && get.color(card) == get.color(evt.card)) {
						return Math.random() + get.sgnAttitude(get.player(), evt.player);
					}
					return Math.random();
				});
			next.fixedResult ??= [];
			next.fixedResult.add([player, card]);
			await next;
		},
		derivation: "zj_liefa",
	},
	zj_liefa: {
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type == "wuxie") {
				return false;
			}
			return get.inpileVCardList(info => {
				if (info[0] != "basic") {
					return false;
				}
				const card = get.autoViewAs({ name: info[2], nature: info[3], storage: { liefa: true } }, "unsure");
				return event.filterCard(card, player, event);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					const card = get.autoViewAs({ name: info[2], nature: info[3], storage: { liefa: true } }, "unsure");
					return event.filterCard(card, player, event);
				});
				return ui.create.dialog("烈伐", [vcards, "vcard"]);
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3], storage: { liefa: true } });
			},
			backup(links, player) {
				return {
					audio: "zj_liefa",
					popname: true,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						storage: {
							liefa: true,
						},
						isCard: true,
					},
					filterCard: () => false,
					selectCard: -1,
					async precontent(event, trigger, player) {
						player
							.when({
								player: "useCardAfter",
							})
							.filter(evt => evt.getParent() == event.getParent())
							.step(async (event, trigger, player) => {
								let list = ["选项一"],
									choiceList = ["失去1点体力", "弃置两张牌", "失去【烈伐】"];
								if (player.countDiscardableCards(player, "he") > 1) {
									list.push("选项二");
								} else {
									choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
								}
								if (player.hasSkill("zj_liefa", null, null, false)) {
									list.push("选项三");
								} else {
									choiceList[2] = `<span style="opacity:0.5">${choiceList[2]}</span>`;
								}
								const result =
									list.length > 1
										? await player
												.chooseControl(list)
												.set("choiceList", choiceList)
												.set("ai", () => 1)
												.forResult()
										: {
												control: list[0],
											};
								switch (result.control) {
									case "选项一": {
										await player.loseHp();
										break;
									}
									case "选项二": {
										await player.chooseToDiscard("he", 2, true);
										break;
									}
									case "选项三": {
										await player.removeSkills("zj_liefa");
										break;
									}
								}
							});
					},
				};
			},
			prompt(links, player) {
				return "视为使用一张" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
			},
		},
		hiddenCard(player, name) {
			return get.type(name) == "basic";
		},
		ai: {
			order: 6,
			save: true,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		locked: false,
		mod: {
			playerEnabled(card, player, target) {
				if (card?.storage?.liefa && player == target) {
					return false;
				}
			},
		},
		subSkill: {
			backup: {},
		},
	},
	//姚柯回
	zj_qiangdu: {
		trigger: {
			global: "phaseUseBegin",
		},
		filter(event, player) {
			return event.player != player;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.draw();
			if (!player.countCards("he")) {
				return;
			}
			await player.chooseToGive(target, "he", true);
			player
				.when({
					global: ["useCardAfter", "phaseAfter"],
				})
				.filter((evt, player) => {
					if (evt.name == "phase") {
						return true;
					}
					if (evt.targets?.length != 1 || evt.player != target) {
						return false;
					}
					return evt.card?.name == "sha" || get.type(evt.card) == "trick";
				})
				.step(async (event, trigger, player) => {
					if (trigger.name == "phase") {
						return;
					}
					const card = new lib.element.VCard({ name: trigger.card.name, nature: trigger.card.nature, isCard: true });
					if (player.hasUseTarget(card, false)) {
						trigger.targets.forEach(target => {
							target.prompt("羌督目标", "fire");
						});
						const result = await player
							.chooseUseTarget(card, "nodistance", false)
							.set("ai", target => {
								if (get.event().name == "chooseBool") {
									const { targets2, card, player, preTargets } = target;
									let eff = 0;
									targets2.forEach(target2 => {
										eff += get.effect(target2, card, player, player);
									});
									if (!targets2.containsSome(...preTargets)) {
										let losehp = get.effect(player, { name: "losehp" }, player, player);
										if (player.hp <= 1 && losehp < 0) {
											losehp *= 2;
										}
										eff += losehp;
									}
									return eff > 0;
								}
								const { player, _get_card: card } = get.event(),
									{ preTargets } = get.event().getParent();
								let eff = get.effect(target, card, player, player);
								if (!preTargets?.includes(target) && !ui.selected.targets?.containsSome(...preTargets)) {
									eff += get.effect(player, { name: "losehp" }, player, player);
								}
								return eff;
							})
							.set("preTargets", trigger.targets)
							.forResult();
						if (result?.bool && !result.targets?.containsAll(...trigger.targets)) {
							await player.loseHp();
						}
					}
				});
		},
	},
	//夏侯含
	zj_zhuhui: {
		round: 1,
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player) {
			return event.player.hasSex("male");
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		async content(event, trigger, player) {
			const choiceList = [
					["new_qingjian", `${get.translation(player)}本轮获得【清俭】，然后你交给其至少一张手牌`],
					["jijiu", `${get.translation(player)}本轮获得【急救】，然后你选择受到至少1点伤害`],
				],
				target = trigger.player;
			const result = await target
				.chooseButton(["烛晦：选择一项", [choiceList, "textbutton"]], true)
				.set("ai", button => {
					const { player, source } = get.event(),
						name = button.link;
					if (name == "new_qingjian") {
						if (!player.countCards("h")) {
							return 10;
						}
						return get.effect(player, { name: "shunshou_copy2" }, source, player);
					}
					return get.damageEffect(player);
				})
				.set("source", player)
				.forResult();
			if (!result?.bool) {
				return;
			}
			await player.addTempSkills(result.links, "roundStart");
			if (result.links[0] == "jijiu") {
				const result = await target
					.chooseNumbers("烛晦", [{ prompt: "请选择你要受到的伤害值", min: 1, max: target.getHp() }], true)
					.set("processAI", () => {
						return [1];
					})
					.forResult();
				if (result?.numbers?.length) {
					await target.damage(result.numbers[0], target);
				}
			} else if (target.countGainableCards(player, "h")) {
				await target
					.chooseToGive(`###烛晦###交给${get.translation(player)}至少一张牌`, player, "h", [1, Infinity], true)
					.set("allowChooseAll", true)
					.set("ai", card => {
						if (ui.selected.cards?.length) {
							return 0;
						}
						return 5 - get.value(card);
					});
			}
		},
		derivation: ["new_qingjian", "jijiu"],
	},
	zj_hanci: {
		trigger: {
			global: "changeSkillsAfter",
		},
		getIndex(event, player) {
			if (event.addSkill?.length) {
				return event.addSkill;
			}
			return [];
		},
		filter(event, player) {
			return event.player?.isIn();
		},
		logTarget: "player",
		forced: true,
		async content(event, trigger, player) {
			await player.draw();
			await trigger.player.draw();
		},
	},
	zj_jieyi: {
		trigger: {
			global: "roundStart",
		},
		filter(event, player) {
			return game.hasPlayer(current => current.hasSex("male") && current != player && current.countCards("he"));
		},
		intro: {
			content: "结依角色：$",
		},
		onremove: true,
		async cost(event, trigger, player) {
			player.setStorage(event.skill, [], true);
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.hasSex("male") && target != player && target.countCards("he");
				})
				.set("ai", target => {
					return get.attitude(get.player(), target) + 0.1;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target
				.chooseToGive(`###结依###交给${get.translation(player)}至少一张牌`, true, [1, Infinity], player, "he")
				.set("ai", card => {
					if (ui.selected.cards?.length) {
						return 0;
					}
					return 6 - get.value(card);
				})
				.set("allowChooseAll", true);
			player.markAuto(event.name, target);
			const num = target
				.getHistory("lose", evt => evt.getParent(3) == event)
				.reduce((sum, evt) => {
					const length = evt?.cards2?.length || 0;
					return sum + length;
				}, 0);
			if (target.countCards("h") > num) {
				const result = await player.chooseBool("是否失去1点体力并令你本轮发动【理内】次数+1？").set("choice", false).forResult();
				if (result.bool) {
					await player.loseHp();
					player.addTempSkill("zj_linei_count", "roundStart");
					player.addMark("zj_linei_count", 1, false);
				}
			}
		},
	},
	zj_linei: {
		trigger: {
			global: ["gainAfter", "loseAfter", "loseAsyncAfter"],
		},
		filter(event, player, name, target) {
			if (!player.getStorage("zj_jieyi").includes(target)) {
				return false;
			}
			const num = player.getRoundHistory("useSkill", evt => evt.skill == "zj_linei").length;
			if (num > player.countMark("zj_linei_count")) {
				return false;
			}
			return target.countCards("h") > target.hp;
		},
		getIndex(event, player) {
			return game.filterPlayer(current => event.getg?.(current)?.length);
		},
		check(event, player, name, target) {
			return get.recoverEffect(target, player, player) > 4;
		},
		logTarget: (_1, _2, _3, target) => target,
		async content(event, trigger, player) {
			const target = event.indexedData,
				num = Math.min(target.countGainableCards(player, "he"), Math.max(3, target.countCards("h") - target.hp));
			await player.gainPlayerCard(target, num, true, "he", "allowChooseAll");
			await target.recover();
		},
		subSkill: {
			count: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	zj_tongxin: {
		trigger: {
			global: "phaseDrawEnd",
		},
		getIndex(event, player) {
			if (event.player == player) {
				return player.getStorage("zj_jieyi");
			}
			return [event.player];
		},
		filter(event, player, name, target) {
			if (event.player == player) {
				if (!target?.isIn()) {
					return false;
				}
			} else {
				if (!player.getStorage("zj_jieyi").includes(target)) {
					return false;
				}
			}
			return event.player.hasHistory("gain", evt => {
				if (evt.getParent(event.name) != event) {
					return false;
				}
				return evt.getParent()?.name == "draw" && evt.cards?.length;
			});
		},
		logTarget: (_1, _2, _3, target) => target,
		forced: true,
		async content(event, trigger, player) {
			const num = trigger.player
				.getHistory("gain", evt => {
					if (evt.getParent(trigger.name) != trigger) {
						return false;
					}
					return evt.getParent()?.name == "draw" && evt.cards?.length;
				})
				.reduce((sum, evt) => sum + evt.cards.length, 0);
			if (num <= 0) {
				return;
			}
			const target = trigger.player == player ? event.indexedData : player;
			await target.draw(num);
		},
	},
	//忠会
	zj_quanwei: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return player.countCards("h") && game.hasPlayer(current => current != player && current.countCards("h"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard: true,
					position: "h",
					filterTarget(card, player, target) {
						return target != player && target.countCards("h");
					},
					ai1(card) {
						return Math.random();
					},
					ai2(target) {
						return 10 + get.attitude(get.player(), target);
					},
				})
				.forResult();
		},
		multitarget: true,
		multiline: true,
		lose: false,
		discard: false,
		async content(event, trigger, player) {
			const {
				cards: [card],
				targets,
			} = event;
			await player.showCards(card, `${get.translation(player)}发动了【权威】`);
			await player
				.chooseToDebate([player, ...targets])
				.set("callback", async (event, trigger, player) => {
					const result = event.debateResult;
					if (result.bool && result.opinion == event.getParent().color) {
						const evt = event.getParent("phase", true);
						if (!evt) {
							return;
						}
						const list = evt.phaseList
							.map((name, index) => [index + 1, "", name.split("|")[0]])
							.filter(info => {
								if (info[2].startsWith("skip")) {
									return false;
								}
								return info[0] - 1 > evt.num;
							});
						let num = 0;
						while (list?.length) {
							const result2 = await player
								.chooseButton([
									`###权威###是否跳过一个阶段？（已跳过${num}个阶段）`,
									[
										list,
										(item, type, position, noclick, node) => {
											let showCard = [item[0], item[1], `lusu_${item[2]}`];
											node = ui.create.buttonPresets.vcard(showCard, type, position, noclick);
											node.node.info.innerHTML = `<span style = "color:#ffffff">${item[0]}</span>`;
											node.node.info.style["font-size"] = "20px";
											node._link = node.link = item;
											node._customintro = uiintro => {
												uiintro.add(get.translation(node._link[2]));
												uiintro.addText(`此阶段为本回合第${get.cnNumber(node._link[0], true)}个阶段`);
												return uiintro;
											};
											return node;
										},
									],
								])
								.set("ai", button => {
									if (["phaseDiscard", "phaseJudge"].includes(button.link[2])) {
										return 1;
									}
									if (button.link[2] == "phaseJieshu") {
										if (player.hasSkill("zj_quanqing")) {
											return 0;
										}
										return 1;
									}
									return 0;
								})
								.set("forceAuto", true)
								.forResult();
							if (result2?.bool) {
								const [index, _1, name] = result2.links[0],
									phase = evt.phaseList[index - 1].replace(name, `skip${name.slice(5)}-zj_quanwei`);
								evt.phaseList[index - 1] = phase;
								list.remove(result2.links[0]);
								num++;
							} else {
								break;
							}
						}
						const targets = game.filterPlayer(current => current.isDamaged());
						if (num <= 0 || targets.length <= 0) {
							return;
						}
						const result3 =
							targets.length > 1
								? await player
										.chooseTarget(`###权威###令至多两名角色恢复${get.cnNumber(num)}点体力`, true, [1, 2], (card, player, target) => {
											return target.isDamaged();
										})
										.set("ai", target => {
											return get.recoverEffect(target, get.player(), get.player());
										})
										.forResult()
								: {
										bool: true,
										targets: targets,
									};
						if (result3?.bool) {
							player.line(result3.targets);
							for (const target of result3.targets.sortBySeat()) {
								await target.recover(num);
							}
						}
					} else {
						const color = result.opinions.find(color => result[color].some(info => info[0] == player));
						if (!color || !result?.[color]?.length) {
							return;
						}
						const targets = result.targets.removeArray(result[color].map(info => info[0]));
						if (!targets?.length) {
							return;
						}
						const result2 = await player
							.chooseBool(`###权威###是否减少1点体力上限并获得${get.translation(targets)}的所有手牌`)
							.set(
								"choice",
								player.maxHp > 1 &&
									targets.reduce((sum, target) => {
										if (get.attitude(player, target) > 0) {
											return sum - target.countGainableCards(player, "h");
										}
										return sum + target.countGainableCards(player, "h");
									}, 0) > 0
							)
							.forResult();
						if (result2?.bool) {
							await player.loseMaxHp();
							const cards = [];
							targets.forEach(target => {
								if (target.countGainableCards(player, "h")) {
									cards.addArray(target.getGainableCards(player, "h"));
								}
							});
							if (cards?.length) {
								await player.gain(cards, "giveAuto");
							}
							await game.delayx();
						}
					}
				})
				.set("color", get.color(card))
				.set("ai", card => {
					const evt = get.event().getParent(2);
					if (get.color(card) == evt?.color) {
						return 1 + Math.random();
					}
					return Math.random();
				});
		},
	},
	zj_quanshu: {
		trigger: {
			player: "damageEnd",
			global: "chooseToDebateAfter",
		},
		filter(event, player) {
			return event.name == "damage" || event.targets.includes(player);
		},
		frequent(event, player) {
			return player.countCards("ej");
		},
		async content(event, trigger, player) {
			const num = player.countCards("ej");
			if (num > 0) {
				await player.draw(num);
			}
			if (player.countCards("h") && !player.isDisabledJudge()) {
				const result = await player
					.chooseCard("###权术###蓄谋一张牌", true)
					.set("ai", card => {
						const player = get.player();
						if (player.hasValueTarget(card)) {
							return player.getUseValue(card);
						}
						return 0.1;
					})
					.forResult();
				if (result?.bool && result?.cards?.length) {
					await player.addJudge({ name: "xumou_jsrg" }, result.cards);
				}
			}
		},
		locked: false,
		mod: {
			maxHandcard(player, num) {
				return num + player.countCards("ej");
			},
		},
	},
	zj_quanqing: {
		trigger: {
			player: "phaseJieshuBegin",
		},
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.countCards("h") && get.info("zj_quanqing")?.logTarget(event, player)?.length;
		},
		logTarget(event, player) {
			return game.filterPlayer(current => {
				return player.inRange(current) && current.countCards("h");
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill, get.info(event.skill).logTarget(trigger, player)), "h")
				.set("ai", card => 7 - get.value(card))
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { cards, targets } = event;
			const result = {
				cards: cards,
				targets: targets,
				skill: "zj_quanwei",
			};
			await player.useResult(result, event);
			const groups = lib.group.slice(0),
				maxGroup = groups.slice().sort((a, b) => {
					return (
						game.countPlayer(current => {
							return current.group == b && get.attitude(player, current) <= 0;
						}) -
						game.countPlayer(current => {
							return current.group == a && get.attitude(player, current) <= 0;
						})
					);
				})[0];
			const result2 = await player
				.chooseControl(groups.concat(["cancel2"]))
				.set("prompt", "权倾：是否变更势力并获得【伐异】？")
				.set("ai", () => {
					return get.event().choice;
				})
				.set("choice", maxGroup)
				.forResult();
			if (result2.control != "cancel2") {
				const group = result2.control;
				await player.changeGroup(group);
				player.popup(`${group}2`, get.groupnature(group, "raw"));
				await player.addSkills("zj_qiangyi");
			}
		},
		derivation: "zj_qiangyi",
	},
	zj_qiangyi: {
		zhuSkill: true,
		enable: "chooseToUse",
		viewAsFilter(player) {
			return player.countCards("hes", "ying") > 0;
		},
		filterCard(card) {
			return get.name(card) == "ying";
		},
		position: "hes",
		viewAs: {
			name: "yushijiesui",
			storage: {
				zjfayi: true,
			},
		},
		prompt: "将一张【影】当【玉石皆碎】对与你势力相同的角色使用",
		check(card) {
			return 5 - get.value(card);
		},
		locked: false,
		mod: {
			playerEnabled(card, player, target) {
				if (!card?.storage?.zjfayi) {
					return;
				}
				if (target.group != player.group) {
					return false;
				}
			},
		},
		subfrequent: ["gain"],
		group: "zj_qiangyi_gain",
		subSkill: {
			gain: {
				zhuSkill: true,
				trigger: {
					player: "addJudgeAfter",
				},
				filter(event, player) {
					return event?.card?.name == "xumou_jsrg";
				},
				frequent: true,
				async content(event, trigger, player) {
					await player.gain(lib.card.ying.getYing(1), "gain2");
				},
			},
		},
	},
	//姜维
	zj_juta: {
		trigger: {
			target: "useCardToTarget",
			player: "useCardAfter",
		},
		filter(event, player, name) {
			if (name == "useCardAfter") {
				return event.card?.name == "sha";
			}
			return event.player != player;
		},
		async cost(event, trigger, player) {
			event.result = {
				bool: true,
			};
			if (event.triggername != "useCardAfter") {
				event.result.targets = [trigger.player];
			}
		},
		locked: true,
		async content(event, trigger, player) {
			if (event.triggername == "useCardAfter") {
				await player.changeSkills(["zj_buji"], ["zj_juta"]);
			} else {
				const target = trigger.player,
					num = get.distance(player, target);
				const result =
					target.countDiscardableCards(target, "he") >= num
						? await target
								.chooseToDiscard(`###据沓###弃置${get.cnNumber(num)}张牌或令${get.translation(trigger.card)}对${get.translation(player)}无效`, num)
								.set("ai", card => {
									const { player, source, numx } = get.event(),
										trigger = get.event().getTrigger();
									if (get.effect(source, trigger.card, player, player) < numx) {
										return 0;
									}
									return 5 - get.value(card);
								})
								.set("numx", num)
								.set("source", player)
								.forResult()
						: {
								bool: false,
							};
				if (!result?.bool) {
					trigger.getParent().excluded.add(player);
				}
			}
		},
		mod: {
			globalTo(from, to, current) {
				return current + 1;
			},
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					const distance = get.distance(target, player),
						cards = player.getCards("he");
					cards.remove(card);
					if (card.cards) {
						cards.removeArray(card.cards);
					} else {
						cards.removeArray(ui.selected.cards);
					}
					if (cards?.length < distance) {
						return "zerotarget";
					}
					return [1, 0, 1, distance * -0.4];
				},
			},
		},
		derivation: "zj_buji",
	},
	zj_buji: {
		trigger: {
			player: "gainAfter",
			global: ["loseAfter", "loseAsyncAfter"],
		},
		filter(event, player) {
			const canUse = card => {
				if (player.hasUseTarget(card)) {
					return true;
				}
				return get.info(card).notarget && lib.filter.cardEnabled(card, player);
			};
			if (event.type == "discard") {
				return event.getl?.(player)?.cards2?.some(card => canUse(card));
			}
			return event.getg(player)?.some(card => canUse(card));
		},
		async cost(event, trigger, player) {
			const cards = [];
			if (trigger.type == "discard") {
				cards.addArray(trigger.getl(player).cards2);
			} else {
				cards.addArray(trigger.getg(player));
			}
			const canUse = card => {
				if (player.hasUseTarget(card)) {
					return true;
				}
				return get.info(card).notarget && lib.filter.cardEnabled(card, player);
			};
			const cardx = cards.filter(canUse);
			const result = await player
				.chooseButton([get.prompt2(event.skill), cards])
				.set("filterButton", button => {
					return get.event().cardx.includes(button.link);
				})
				.set("cardx", cardx)
				.set("ai", button => {
					const player = get.player(),
						val = player.getUseValue(button.link);
					if (player.hp <= 1 && !get.tag(button.link, "damage")) {
						return 0;
					}
					return val - get.effect(player, { name: "losehp" }, player, player) * 0.5;
				})
				.forResult();
			if (result.bool) {
				event.result = {
					bool: true,
					cards: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			const card = event.cards[0];
			await player.showCards(card, `${get.translation(player)}发动了【不戢】`);
			await player.chooseUseTarget(card, true, false);
			if (!player.hasHistory("sourceDamage", evt => evt.cards?.includes(card) && evt.getParent(event.name) == event)) {
				await player.loseHp();
			}
		},
	},
	zj_linze: {
		init(player, skill) {
			player.setStorage("kunfen", true);
			let skills = [],
				hp = player.getHp(),
				dhp = player.getDamagedHp();
			if (hp >= dhp) {
				skills.add("retiaoxin");
			}
			if (hp <= dhp) {
				skills.add("kunfen");
			}
			let currentSkills = player?.additionalSkills?.[skill];
			if (!currentSkills?.length || !currentSkills.containsAll(...skills) || !skills.containsAll(...currentSkills)) {
				player.addAdditionalSkill(skill, skills);
			}
		},
		trigger: { player: ["changeHpAfter", "gainMaxHpAfter", "loseMaxHpAfter"] },
		forced: true,
		popup: false,
		async content(event, trigger, player) {
			get.info(event.name).init(player, event.name);
		},
		derivation: ["retiaoxin", "kunfenx"],
	},
	zj_fuji: {
		trigger: {
			player: "phaseJieshuBegin",
		},
		init(player, skill) {
			player.addSkill("zj_fuji_effect");
		},
		filter(event, player) {
			const bool = game.hasPlayer(current => current.getSeatNum() > 0),
				first = game.findPlayer(current => {
					return bool ? current.getSeatNum() == 1 : current == _status.roundStart;
				});
			if (!first) {
				return false;
			}
			return first.hasAllHistory("lose", evt => {
				if (evt.type != "discard" || !evt?.cards2?.length) {
					return false;
				}
				return evt.getParent("phase", true)?.player == first;
			});
		},
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		check(event, player) {
			return game.hasPlayer(current => {
				if (get.attitude(player, current) >= 0) {
					return false;
				}
				const num =
					player.countCards("hs", card => {
						return get.tag(card, "damage") && player.canUse(card, current);
					}) + 1;
				return current.getHp() <= num;
			});
		},
		async content(event, trigger, player) {
			player.awakenSkill("zj_fuji");
			player.insertPhase();
		},
		subSkill: {
			effect: {
				trigger: {
					source: "dieAfter",
				},
				filter(event, player) {
					const phase = event.getParent("phase", true);
					return phase?.skill == "zj_fuji" && phase.player == player;
				},
				charlotte: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.draw(3);
					await player.recoverTo(player.maxHp);
					player.restoreSkill("zj_fuji");
					game.log(player, "重置了", "【扶稷】");
				},
			},
		},
	},
	zj_jindao: {
		audio: "dcjincui",
		trigger: {
			player: "phaseDrawBegin1",
		},
		forced: true,
		filter(event, player) {
			return !event.numFixed;
		},
		async content(event, trigger, player) {
			trigger.changeToZero();
			if (player.countCards("h") < 7) {
				await player.drawTo(7);
			}
			if (player.countCards("h", card => _status.connectMode || get.number(card) == 7)) {
				const result = await player
					.chooseCard(
						[1, Infinity],
						"展示任意张点数为7的手牌并回复等量体力",
						card => {
							return get.number(card) == 7;
						},
						"allowChooseAll"
					)
					.set("ai", card => 1)
					.forResult();
				if (result.bool) {
					const cards = result.cards;
					await player.showCards(cards, `${get.translation(player)}发动了【尽道】`);
					await player.recover(cards.length);
				}
			}
			await player.chooseToGuanxing(7);
		},
	},
	zj_hanshi: {
		audio: "dcqingshi",
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			if (player.getStorage("zj_hanshi_used").includes(event.card.name)) {
				return false;
			}
			return player.countCards("he", card => get.name(card) == event.card.name);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), card => {
					return get.name(card) == get.event().cardName;
				})
				.set("cardName", trigger.card.name)
				.set("ai", () => 1)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.showCards(event.cards, `${get.translation(player)}发动了【汉势】`);
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				const stat = player.getStat("card"),
					name = trigger.card.name;
				if (typeof stat[name] == "number") {
					stat[name]--;
				}
			}
			player.addSkill("zj_hanshi_damage");
			player.markAuto("zj_hanshi_damage", trigger.card);
			player.addTempSkill("zj_hanshi_used", "phaseChange");
			player.markAuto("zj_hanshi_used", trigger.card.name);
		},
		subSkill: {
			damage: {
				charlotte: true,
				onremove: true,
				firstDo: true,
				trigger: {
					source: "damageBegin1",
					player: "useCardAfter",
				},
				filter(event, player) {
					return event.card && player.getStorage("zj_hanshi_damage").includes(event.card) && event.notLink();
				},
				async cost(event, trigger, player) {
					if (trigger.name == "damage") {
						trigger.num++;
					} else {
						player.unmarkAuto("zj_hanshi_damage", trigger.card);
					}
				},
			},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	zj_wuzhe: {
		audio: "dczhizhe",
		enable: "phaseUse",
		limited: true,
		filter(event) {
			return get.inpileVCardList(info => {
				return ["trick", "delay"].includes(info[0]);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					return ["trick", "delay"].includes(info[0]);
				});
				return ui.create.dialog("武哲", [list, "vcard"], "hidden");
			},
			select: [1, 2],
			check(button) {
				if (button.link[2] == "wuxie") {
					return 114;
				}
				return get.player().getUseValue({ name: button.link[2] });
			},
			backup(links, player) {
				return {
					audio: "zj_wuzhe",
					names: links.map(info => info[2]),
					manualConfirm: true,
					skillAnimation: true,
					animationColor: "fire",
					async content(event, trigger, player) {
						player.awakenSkill("zj_wuzhe");
						const { names } = get.info(event.name);
						player.markAuto("zj_wuzhe_effect", names);
						player.addSkill("zj_wuzhe_effect");
						game.addGlobalSkill("zj_wuzhe_ai");
					},
				};
			},
			prompt(links, player) {
				return `###是否发动【武哲】？###其他角色使用${links
					.map(info => {
						return `【${get.translation(info[2])}】`;
					})
					.join("或")}时，你可令此牌无效，然后于此牌置入弃牌堆后获得之`;
			},
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
		subSkill: {
			backup: {},
			effect: {
				audio: "zj_wuzhe",
				trigger: {
					global: "useCard",
				},
				init(player, skill) {
					const list = player.getStorage(skill);
					if (list.length) {
						player.addTip(skill, list.map(name => `武哲 ${get.translation(name)}`).join("\n"));
					}
				},
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					return player.getStorage("zj_wuzhe_effect").includes(event.card.name);
				},
				prompt2(event, player) {
					return `令${get.translation(event.card)}无效，然后于此牌进入弃牌堆后获得之`;
				},
				check(event, player) {
					if (event.targets?.length) {
						return (
							event.targets.reduce((sum, current) => {
								return sum + get.effect(current, event.card, event.player, player);
							}, 0) <= 0
						);
					}
					return get.attitude(player, event.player) <= 0;
				},
				charlotte: true,
				logTarget: "player",
				async content(event, trigger, player) {
					trigger.targets.length = 0;
					trigger.all_excluded = true;
					player
						.when({
							global: "cardsDiscardAfter",
						})
						.filter(evt => {
							if (!evt.cards.someInD("od")) {
								return false;
							}
							const evtx = evt.getParent();
							if (evtx.name != "orderingDiscard") {
								return false;
							}
							const evtxx = evtx.relatedEvent || evtx.getParent();
							return evtxx.getParent() == (trigger.relatedEvent || trigger.getParent());
						})
						.step(async (event, trigger, player) => {
							await player.gain(trigger.cards.filterInD("od"), "gain2");
						});
				},
			},
			ai: {
				effect: {
					player_use(card, player) {
						if (
							typeof card == "object" &&
							game.hasPlayer(target => {
								return target.getStorage("zj_wuzhe_effect").includes(card.name) && get.attitude(target, player) < 0;
							})
						) {
							return "zeroplayertarget";
						}
					},
				},
			},
		},
	},
	zj_jianxi: {
		audio: 2,
		trigger: { player: "damageEnd" },
		frequent: true,
		initSkill(name) {
			game.broadcastAll(() => {
				_status.jianxiSkill ??= {};
			});
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			if (!(name in _status.jianxiSkill)) {
				const characters = _status.characterlist.slice(0),
					skills = [];
				characters.forEach(character => {
					const skillsx = get.character(character, 3);
					skillsx.forEach(skill => {
						const info = get.info(skill);
						if (!info || info.charlotte) {
							return false;
						}
						if (info.derivation) {
							let list = info.derivation;
							if (!Array.isArray(list)) {
								list = [list];
							}
							list.forEach(deriSkill => {
								const infox = get.info(deriSkill);
								if (!infox || infox.charlotte) {
									return false;
								}
								if (!get.skillInfoTranslation(deriSkill).includes(`【${get.translation(name)}】`)) {
									return false;
								}
								skills.add([deriSkill, character]);
							});
						}
						if (!get.skillInfoTranslation(skill).includes(`【${get.translation(name)}】`)) {
							return false;
						}
						skills.add([skill, character]);
					});
				});
				game.broadcastAll(skills => (_status.jianxiSkill[name] = skills), skills);
			}
			return _status.jianxiSkill[name];
		},
		async content(event, trigger, player) {
			let result = (await player.draw().forResult()).cards;
			if (get.itemtype(result) !== "cards") {
				return;
			}
			await player.showCards(result, `${get.translation(player)}发动了【兼习】`);
			const name = get.name(result[0]);
			result = await player
				.chooseButton([
					[
						dialog => {
							dialog.add("兼习", "forcebutton");
							dialog.addText(`声明一个含有【${get.translation(get.event().cardName)}】的技能，或点击“取消”令你使用基本牌的数值+1`);
							const caption = ui.create.div(".searcher.caption");
							const input = document.createElement("input").css({
								textAlign: "center",
								border: "solid 2px #294510",
								borderRadius: "6px",
								fontWeight: "bold",
								fontSize: "21px",
							});
							input.type = "text";
							input.placeholder = "请输入技能id/技能名";
							input.spellcheck = false;
							//使用click事件确定，因为用input事件，难以解决按下a键会触发自动托管的bug
							let find = ui.create.button(["find", "确定"], "tdnodes");
							find.style.display = "inline";
							const updateFind = () => {
								const value = input.value.trim();
								caption.link = value;
								ui.selected.buttons.add(caption);
								ui.create.confirm();
								ui.click.ok();
							};
							find.addEventListener("click", updateFind);
							input.onkeydown = function (e) {
								e.stopPropagation();
								if (e.key == "Enter") {
									updateFind();
								}
							};
							//阻止冒泡以防止触发窗口被拖动而无法选中文字
							input.onmousedown = function (e) {
								e.stopPropagation();
							};
							caption.append(input, find);
							dialog.content.appendChild(caption);
						},
						"handle",
					],
				])
				.set("cardName", name)
				.set("processAI", () => {
					// 单纯输入字符串，不是选牌或者按钮，需要使用processAI直接输出选择结果
					const skills = get
						.info("zj_jianxi")
						.initSkill(get.event().cardName)
						.filter(skill => {
							return !game.hasPlayer(current => current.hasSkill(skill[0]));
						})
						.sort((a, b) => {
							let value = list => {
								const [skill, name] = list;
								let value = get.skillRank(skill, "inout") * get.rank(name, true);
								if (["relonghun", "dunshi", "olfuhun", "mbjuejin", "dcjiushi"].includes(skill)) {
									value *= 24;
								}
								const info = get.info(skill);
								if (info?.ai?.neg) {
									value = 0;
								}
								if (info?.ai?.combo) {
									let skills = info.ai.combo;
									if (!Array.isArray(skills)) {
										skills = [skills];
									}
									if (!skills.every(skill => player.hasSkill(skill, null, null, false))) {
										value = 0;
									}
								}
								return value;
							};
							return value(b) - value(a);
						});
					const choice = skills?.length ? skills[0][0] : ["wusheng", "jiang", "hunzi"].randomGet();
					return { bool: true, links: [choice] };
				})
				.set("switchToAuto", () => {
					_status.event.result = "ai";
					_status.event.dialog?.close();
					ui.confirm?.close();
				})
				.forResult();
			if (!result?.links?.length) {
				player.addMark("zj_jianxi_effect", 1, false);
				return;
			} else {
				let skill,
					str = `【${get.translation(name)}】`,
					[link] = result.links;
				if (link in lib.skill) {
					skill = link;
				} else {
					const skills = get
						.info(event.name)
						.initSkill(name)
						.filter(skill => {
							if (game.hasPlayer(current => current.hasSkill(skill[0]))) {
								return false;
							}
							return get.translation(skill[0], "skill") == link;
						});
					if (skills.length) {
						const result =
							skills.length == 1
								? { bool: true, links: skills }
								: await player
										.chooseButton(
											[
												"选择你要声明的技能",
												[
													skills,
													(item, type, position, noclick, node) => {
														node = ui.create.buttonPresets.skill(item, "skill", position, noclick);
														node._customintro = function (uiintro, evt) {
															const skill = node.link;
															uiintro.add(get.translation(skill));
															if (node.owner) {
																uiintro.add(`持有者 ${get.slimName(node.owner)}`);
															}
														};
														return node;
													},
												],
											],
											true
										)
										.forResult();
						if (result?.links?.length) {
							skill = Array.isArray(result.links[0]) ? result.links[0][0] : result.links[0];
						}
					}
				}
				if (skill) {
					game.log(player, "声明了技能", `【${get.translation(skill)}】`);
					player.chat(`我声明技能【${get.translation(skill)}】`);
					if (
						get.skillInfoTranslation(skill).includes(str) &&
						!game.hasPlayer(current => {
							return current.hasSkill(skill);
						})
					) {
						const skills = get.info(event.name).initSkill(name),
							list = skills.find(info => info[0] == skill);
						if (list[1]) {
							player.flashAvatar(event.name, list[1]);
						}
						await player.addSkills(skill);
						return;
					}
					game.log("可是", `【${get.translation(skill)}】`, "并不符合条件！");
					player.popup("杯具");
					await game.delay();
				}
				player.addMark("zj_jianxi_effect", 1, false);
			}
		},
		ai: {
			maixie: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (target.hp > 1 || target.hasSkillTag("save", true, target)) {
							return [1, 0.7];
						}
					}
				},
			},
		},
		onremove: ["zj_jianxi_effect"],
		group: "zj_jianxi_effect",
		subSkill: {
			effect: {
				intro: { content: "使用基本牌的数值+$" },
				trigger: { player: ["useCard", "respond"] },
				locked: false,
				forced: true,
				filter(event, player) {
					return get.type(event.card) == "basic" && player.hasMark("zj_jianxi_effect");
				},
				async content(event, trigger, player) {
					trigger.baseDamage += player.countMark(event.name);
				},
			},
		},
	},
	zj_zhaofu: {
		audio: 2,
		trigger: { player: ["useCardAfter", "damageBegin4"] },
		forced: true,
		isMinSkill(player) {
			const countSkill = current =>
				current.getSkills(null, false, false).filter(skill => {
					const info = get.info(skill);
					if (!info || info.charlotte) {
						return false;
					}
					return true;
				}).length;
			const bool = game.hasPlayer(current => current.getSeatNum() > 0),
				first = game.findPlayer(current => {
					return bool ? current.getSeatNum() == 1 : current == _status.roundStart;
				});
			return first && countSkill(player) < countSkill(first);
		},
		filter(event, player) {
			if (event.name == "damage") {
				return event.num > 1;
			}
			if (!get.is.damageCard(event.card)) {
				return false;
			}
			return get.info("zj_zhaofu").isMinSkill(player);
		},
		async content(event, trigger, player) {
			if (trigger.name == "damage") {
				trigger.num = 1;
			} else {
				await player.loseMaxHp();
			}
		},
		mod: {
			aiOrder(player, card, num) {
				const bool = get.info("zj_zhaofu").isMinSkill(player);
				if (bool && get.itemtype(card) == "card" && get.tag(card, "damage")) {
					return Math.min(num, 0);
				}
			},
			aiValue(player, card, num) {
				const bool = get.info("zj_zhaofu").isMinSkill(player);
				if (bool && get.itemtype(card) == "card" && get.tag(card, "damage")) {
					return Math.min(num, 0);
				}
			},
			aiUseful(player, card, num) {
				const bool = get.info("zj_zhaofu").isMinSkill(player);
				if (bool && get.itemtype(card) == "card" && get.tag(card, "damage")) {
					return Math.min(num, 0);
				}
			},
		},
	},
	zj_tuicheng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (event.type == "wuxie") {
				return false;
			}
			if (!player.countCards("hes", card => get.is.damageCard(card))) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (info[0] != "basic") {
					return false;
				}
				const card = get.autoViewAs({ name: info[2], nature: info[3], storage: { tuicheng: true } }, "unsure");
				return (
					event.filterCard(card, player, event) &&
					game.countPlayer(current => {
						return lib.filter.targetEnabled2(card, player, current);
					}) > 1
				);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					const card = get.autoViewAs({ name: info[2], nature: info[3], storage: { tuicheng: true } }, "unsure");
					return (
						event.filterCard(card, player, event) &&
						game.countPlayer(current => {
							return lib.filter.targetEnabled2(card, player, current);
						}) > 1
					);
				});
				return ui.create.dialog("推诚", [vcards, "vcard"]);
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3], storage: { tuicheng: true } });
			},
			backup(links, player) {
				return {
					audio: "zj_tuicheng",
					popname: true,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						storage: {
							tuicheng: true,
						},
					},
					filterTarget(card, player, target) {
						if (!card) {
							card = get.card();
						}
						return lib.filter.targetEnabled2(card, player, target) && lib.filter.targetInRange(card, player, target);
					},
					filterCard(card, player) {
						return get.is.damageCard(card);
					},
					selectCard: 1,
					position: "hes",
					selectTarget: 2,
					async precontent(event, trigger, player) {
						event.getParent().addCount = false;
						player
							.when({
								player: "useCardAfter",
							})
							.filter(evt => evt.getParent() == event.getParent())
							.step(async (event, trigger, player) => {
								const targets = trigger.targets.filter(target => target.isIn()),
									cards = trigger.cards?.filterInD("od");
								if (!targets?.length || !cards?.length) {
									return;
								}
								const result =
									targets.length > 1
										? await player
												.chooseTarget(`令一名目标角色获得${get.translation(cards)}`, true, (card, player, target) => {
													return get.event().targets.includes(target);
												})
												.set("targets", targets)
												.set("ai", target => {
													return get.attitude(get.player(), target);
												})
												.forResult()
										: {
												bool: true,
												targets: targets,
											};
								if (result?.bool && result.targets?.length) {
									await result.targets[0].gain(cards, "gain2");
								}
							});
					},
				};
			},
			prompt(links, player) {
				return "将一张伤害牌当" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "对两名角色使用";
			},
		},
		ai: {
			order: 6,
			result: {
				player: 1,
			},
		},
		locked: false,
		mod: {
			cardUsable(card, player, num) {
				if (card?.storage?.tuicheng) {
					return Infinity;
				}
			},
		},
	},
};

export default skills;
