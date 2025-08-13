import { initCustomFormatter } from "../../game/vue.esm-browser.js";
import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//珍藏封印
	//张美人
	stdlianrong: {
		trigger: {
			global: ["loseAfter", "loseAsyncAfter"],
		},
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false) {
				return false;
			}
			return game.hasPlayer2(target => target != player && event.getl?.(target)?.cards2.some(card => get.suit(card) == "heart" && get.position(card, true) == "d"));
		},
		async cost(event, trigger, player) {
			const cards = game
				.filterPlayer2(target => target != player)
				.map(target => trigger.getl?.(target)?.cards2?.filter(card => get.suit(card) == "heart" && get.position(card, true) == "d"))
				.flat();
			const result = await player
				.chooseCardButton(get.prompt2(event.skill), cards, [1, Infinity])
				.set("ai", button => {
					return get.value(button.link, get.player(), "raw");
				})
				.forResult();
			if (result?.links?.length) {
				event.result = {
					bool: true,
					cost_data: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			const cards = event.cost_data;
			await player.gain(cards, "gain2");
		},
	},
	stdyuanzhuo: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.stdyuanzhuo.filterTarget(void 0, player, target));
		},
		filterTarget(card, player, target) {
			return target != player && target.countDiscardableCards(player, "he");
		},
		async content(event, trigger, player) {
			const { target } = event;
			await player.discardPlayerCard(target, "he", true);
			const card = get.autoViewAs({ name: "huogong", isCard: true });
			if (target.canUse(card, player, true, false)) {
				await target.useCard(card, player, false);
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					return -get.effect(target, { name: "guohe_copy2" }, player, player);
				},
			},
		},
	},
	//王美人
	stdbizun: {
		enable: ["chooseToUse"],
		usable: 1,
		onChooseToUse(event) {
			const player = event.player;
			if (!event.stdbizun) {
				const list = get.inpileVCardList(info => {
					if (!["sha", "shan"].includes(info[2])) {
						return false;
					}
					return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
				});
				event.set("stdbizun", list);
			}
		},
		hiddenCard(player, name) {
			return ["sha", "shan"].includes(name) && player.countCards("hes", card => get.type(card, player) == "equip");
		},
		filter(event, player) {
			return player.countCards("hes", card => get.type(card, player) == "equip") && event.stdbizun.length > 0;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("避尊", [event.stdbizun, "vcard"]);
			},
			filter(button) {
				return get
					.event()
					.getParent()
					.filterCard(get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure"), get.player(), get.event().getParent());
			},
			check(button) {
				const player = get.player();
				return player.getUseValue(get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure"));
			},
			backup(links, player) {
				return {
					popname: true,
					filterCard(card, player) {
						return get.type(card, player) === "equip";
					},
					selectCard: 1,
					check(card) {
						return 7 - get.value(card);
					},
					position: "hes",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					log: false,
					async precontent(event, trigger, player) {
						player.logSkill("stdbizun");
						player
							.when({ player: "useCardAfter" })
							.filter(evt => evt.getParent() == event.getParent())
							.step(async (event, trigger, player) => {
								const target = game.findPlayer(targetx => targetx.canMoveCard() && targetx.isMaxHandcard(true));
								if (target) {
									await target.moveCard();
								}
							});
					},
				};
			},
			prompt(links, player) {
				return `将一张装备牌当做${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}使用`;
			},
		},
	},
	stdhuangong: {
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			if (player.countCards("ej")) {
				return false;
			}
			const evt = event.getl(player);
			return evt?.es?.length || evt.js?.length;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.draw();
		},
	},
	//庞林
	stdzhuying: {
		trigger: { global: "damageBegin3" },
		filter(event, player) {
			return event.player != player && !event.hasNature() && !event.player.isLinked();
		},
		check(event, player) {
			return get.effect(event.player, { name: "tiesuo" }, player, player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			await target.link(true);
		},
	},
	stdzhongshi: {
		forced: true,
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			return player.isLinked() != event.player.isLinked();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.num++;
		},
	},
	//黄崇
	stdjuxian: {
		trigger: { global: "gainBefore" },
		filter(event, player) {
			return event.player != player && event.cards.some(card => get.owner(card) == player && "he".includes(get.position(card)));
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.cancel();
		},
		mod: {
			cardGiftable(card, player, target) {
				if (player != target && get.type(card, null, false) != "equip") {
					return false;
				}
			},
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name == "shunshou") {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	stdlijun: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(target => target.countCards("h"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, player.getHp()], (card, player, target) => {
					return target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player(),
						att = get.attitude(player, target);
					if (att > 0) {
						return target.countCards("h", card => target.hasValueTarget(card, true, false));
					}
					return true;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			for (const target of targets.sortBySeat()) {
				const result = await player.choosePlayerCard(target, `励军：请展示${get.translation(target)}一张手牌`, "h", true).forResult();
				if (result?.cards?.length) {
					const card = result.cards[0];
					await player.showCards([card], `${get.translation(target)}被展示的牌`);
					let resultx;
					if (target.hasUseTarget(card, true, false)) {
						resultx = await target.chooseUseTarget(`励军：使用${get.translation(card)}或者取消并弃置之`, card, false).forResult();
					} else {
						resultx = { bool: false };
					}
					if (!resultx.bool) {
						await target.modedDiscard(card);
					}
				}
			}
		},
	},
	//曹熊
	stdwuwei: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.countCards("he", card => get.type(card, player) == "equip" && game.hasPlayer(target => target.canEquip(card, true)));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard(card, player) {
						return get.type(card, player) == "equip";
					},
					filterTarget(card, player, target) {
						return target.canEquip(card, true);
					},
					ai1(card) {
						return 6 - get.value(card);
					},
					ai2(target) {
						const card = ui.selected.cards[0],
							att = get.attitude(get.player(), target),
							range = target.getAttackRange(),
							cardrange = 1 - (get.info(card, false)?.distance?.attackFrom || 0);
						if (att <= 0 && cardrange > range) {
							return get.effect(target, { name: "guohe_copy2" }, get.player(), get.player());
						}
						return att * get.equipValue(card, target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const card = event.cards[0],
				target = event.targets[0],
				range = target.getAttackRange();
			await target.equip(card);
			const num = target.getAttackRange() - range;
			if (num > 0 && target.countDiscardableCards(player, "he")) {
				await player.discardPlayerCard(target, "he", num, true);
			}
		},
	},
	stdleiruo: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.hasPlayer(target => target != player && target.countGainableCards(player, "e"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player && target.countGainableCards(player, "e");
				})
				.set("ai", target => {
					if (!get.player().hasShan()) {
						return false;
					}
					return get.effect(target, { name: "shunshou_copy2" }, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.gainPlayerCard(target, "e", true);
			const card = get.autoViewAs({ name: "sha", isCard: true });
			if (target.canUse(card, player, false, false)) {
				const result = await target
					.chooseBool(`羸弱：是否视为对${get.translation(player)}使用一张无距离限制的【杀】`)
					.set("choice", get.effect(player, card, target, target) > 0)
					.forResult();
				if (result?.bool) {
					await target.useCard(card, player, false);
				}
			}
		},
	},
	//毛皇后
	stddechong: {
		trigger: { global: "phaseZhunbeiBegin" },
		filter(event, player) {
			return event.player != player && player.countCards("he");
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseCard(get.prompt2(event.skill, trigger.player), "he", [1, Infinity], (card, player) => {
					const target = get.event().getTrigger().player;
					return lib.filter.canBeGained(card, target, player);
				})
				.set("ai", card => {
					const player = get.player(),
						target = get.event().getTrigger().player,
						att = get.attitude(player, target);
					if (att <= 0) {
						const num = target.countCards("h", card => !target.hasValueTarget(card));
						if (num >= target.hp) {
							return 6 - get.value(card);
						}
						return 0;
					}
					if (att > 0) {
						return target.getUseValue(card) - 2;
					}
				})
				.forResult();
			if (result?.cards?.length) {
				event.result = {
					bool: true,
					targets: [trigger.player],
					cost_data: result.cards,
				};
			}
		},
		async content(event, trigger, player) {
			const cards = event.cost_data,
				target = trigger.player;
			await player.give(cards, target);
			player
				.when({ global: "phaseDiscardBegin" })
				.filter(evt => evt.player == target)
				.step(async (event, trigger, player) => {
					if (trigger.stddechong) {
						return;
					}
					trigger.set("stddechong");
					const target = trigger.player;
					if (target.countCards("h") > target.hp) {
						const result = await player
							.chooseBool(`得宠：是否对${get.translation(target)}造成一点伤害`)
							.set("choice", get.damageEffect(target, player, player) > 0)
							.forResult();
						if (result?.bool) {
							await target.damage();
						}
					}
				});
		},
	},
	stdyinzu: {
		locked: true,
		global: ["stdyinzu_global"],
		subSkill: {
			global: {
				charlotte: true,
				mod: {
					attackRange(player, num) {
						const sub = player.countCards("h") - player.hp;
						if (sub > 0) {
							return num + 1;
						}
						return num - 1;
					},
				},
			},
		},
	},
	//郑聪
	stdqiyue: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && player.hasEquipableSlot(1);
		},
		async content(event, trigger, player) {
			const card = game.createCard2("xuanhuafu", "diamond", 5);
			await player.gain(card, "gain2");
		},
	},
	xuanhuafu_skill: {
		equipSkill: true,
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			const card = event.card;
			if (card.name != "sha" || !event.isFirstTarget) {
				return false;
			}
			return game.hasPlayer(target => get.distance(target, event.target) == 1 && lib.filter.targetInRange(card, player, target) && lib.filter.targetEnabled2(card, player, target) && !event.targets.includes(target));
		},
		async cost(event, trigger, player) {
			const card = trigger.card;
			const targets = game.filterPlayer(target => get.distance(target, trigger.target) == 1 && lib.filter.targetInRange(card, player, target) && lib.filter.targetEnabled2(card, player, target) && !trigger.targets.includes(target));
			if (targets.length == 1) {
				event.result = { bool: true, targets: targets };
			} else {
				event.result = await player
					.chooseTarget(`宣花斧：为${get.translation(card)}额外指定一个目标`, true, (card, player, target) => {
						return get.event().targetsx.includes(target);
					})
					.set("targetsx", targets)
					.set("ai", target => get.effect(target, get.event().getTrigger().card, get.player(), get.player()))
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const { targets } = event;
			trigger.targets.addArray(targets);
		},
	},
	stdjieji: {
		trigger: { source: "damageSource" },
		filter(event, player) {
			return event.player != player && event.player.isIn() && event.card?.name == "sha" && player.getHistory("useCard", evt => evt.card.name == "sha").indexOf(event.getParent("useCard")) == 0 && event.player.countGainableCards(player, "he");
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.gainPlayerCard(target, "he", true);
			const card = get.autoViewAs({ name: "sha", isCard: true });
			if (target.canUse(card, player, false, false)) {
				await target.useCard(card, player, false, "noai");
			}
		},
	},
	//姜婕
	stdfengzhan: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && player.hasEquipableSlot(1);
		},
		async content(event, trigger, player) {
			const card = game.createCard2("baipishuangbi", "spade", 2);
			await player.gain(card, "gain2");
		},
	},
	baipishuangbi_skill: {
		trigger: { player: "useCardToPlayered" },
		equipSkill: true,
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && player.differentSexFrom(event.target) && !player.countCards("h");
		},
		async content(event, trigger, player) {
			trigger.getParent().baseDamage++;
		},
	},
	stdruixi: {
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			return player.countCards("hes") && player.hasUseTarget(get.autoViewAs({ name: "sha" }, "unsure"), false, false) && player.hasHistory("lose");
		},
		popup: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToUse()
				.set("openskilldialog", `###${get.prompt(event.skill)}###将一张牌当作无距离限制的【杀】使用`)
				.set("norestore", true)
				.set("_backupevent", `${event.name.slice(0, -5)}_backup`)
				.set("custom", {
					add: {},
					replace: { window() {} },
				})
				.backup(`${event.name.slice(0, -5)}_backup`)
				.set("targetRequired", true)
				.set("complexTarget", true)
				.set("complexSelect", true)
				.set("addCount", false)
				.set("chooseonly", true)
				.set("logSkill", event.name.slice(0, -5))
				.forResult();
		},
		async content(event, trigger, player) {
			const { ResultEvent, logSkill } = event.cost_data;
			event.next.push(ResultEvent);
			if (logSkill) {
				if (typeof logSkill == "string") {
					ResultEvent.player.logSkill(logSkill);
				} else if (Array.isArray(logSkill)) {
					ResultEvent.player.logSkill.call(ResultEvent.player, ...logSkill);
				}
			}
			await ResultEvent;
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				filterTarget(card, player, target) {
					return lib.filter.targetEnabled.apply(this, arguments);
				},
				viewAs: {
					name: "sha",
				},
				selectCard: 1,
				position: "hes",
				ai1(card) {
					return 7 - get.value(card);
				},
				log: false,
			},
		},
	},
	//四象封印·青龙
	//标鲍信
	stdyimou: {
		audio: "yimou",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.countCards("he") && game.hasPlayer(target => target != player) && event.num > 0;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard: true,
					position: "he",
					filterTarget: lib.filter.notMe,
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
			if (result?.bool) {
				event.result = {
					bool: true,
					cost_data: result.cards,
					targets: result.targets,
				};
			}
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cards = event.cost_data;
			await player.give(cards, target);
		},
	},
	stdmutao: {
		audio: "mutao",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(target => target.countCards("h"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.countCards("h");
				})
				.set("ai", target => get.damageEffect(target, get.player(), get.player()))
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.showHandcards();
			if (target.countCards("h", card => get.name(card, target) == "sha")) {
				await target.damage();
			}
		},
	},
	//标裴秀
	stdzhitu: {
		enable: "chooseToUse",
		filter(event, player) {
			if (player.countCards("he") < 2) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (info[0] != "trick") {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: info[2] }, "unsure"), player, event);
			}).length;
		},
		hiddenCard(player, name) {
			if (get.type(name) == "trick" && lib.inpile.includes(name) && player.countCards("he") > 1) {
				return true;
			}
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => info[0] == "trick");
				return ui.create.dialog("制图", [list, "vcard"]);
			},
			filter(button, player) {
				return get.event().getParent().filterCard({ name: button.link[2] }, player, get.event().getParent());
			},
			check(button) {
				const player = get.player();
				return player.getUseValue({ name: button.link[2] }) + 1;
			},
			backup(links, player) {
				return {
					audio: "fjzhitu",
					filterCard(card, player) {
						const selected = ui.selected.cards;
						if (!selected.length) {
							return true;
						}
						return get.number(card, player) + selected.reduce((sum, card) => sum + get.number(card, get.player()), 0) <= 13;
					},
					selectCard: [2, Infinity],
					filterOk() {
						const selected = ui.selected.cards;
						if (!selected.length) {
							return false;
						}
						return selected.reduce((sum, card) => sum + get.number(card, get.player()), 0) == 13;
					},
					ai1(card) {
						const player = get.player();
						const name = lib.skill.stdzhitu_backup.viewAs.name;
						if (ui.selected.cards.length > 1 || card.name == name) {
							return 0;
						}
						const sum = ui.selected.cards.reduce((sumx, cardx) => sumx + get.number(cardx, player), 0);
						if (sum + get.number(card, player) == 13) {
							return 7 - get.value(card);
						}
						return 6 - get.value(card);
					},
					position: "hes",
					popname: true,
					viewAs: { name: links[0][2] },
				};
			},
			prompt(links, player) {
				return "将至少两张点数和等于13的牌当作" + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	//标杨彪
	stdyizheng: {
		audio: "yizheng",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(target => target.hp >= player.hp && player.canCompare(target));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.hp >= player.hp && player.canCompare(target);
				})
				.set("ai", target => {
					const player = get.player(),
						hs = player.getCards("h").sort(function (a, b) {
							return b.number - a.number;
						}),
						ts = target.getCards("h").sort(function (a, b) {
							return b.number - a.number;
						}),
						eff = get.damageEffect(target, player, player);
					if (hs[0].number > ts[0].number) {
						return eff;
					}
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (!player.canCompare(target)) {
				return;
			}
			const result = await player.chooseToCompare(target).forResult();
			if (result.winner) {
				const winner = result.winner,
					loser = winner == player ? target : player;
				winner.line(loser);
				await loser.damage(winner);
			}
		},
	},
	stdrangjie: {
		audio: "rangjie",
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			return player.canMoveCard() && event.num > 0;
		},
		check(event, player) {
			return player.canMoveCard(true);
		},
		content() {
			player.moveCard(true);
		},
	},
	//标皇甫嵩
	stdtaoluan: {
		audio: "sptaoluan",
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("he") && event.player != player;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseCard(get.prompt2(event.skill, trigger.player), "he")
				.set("ai", card => {
					const target = get.event().getTrigger().player,
						att = get.attitude(get.player(), target),
						shan = target.countCards("h", "shan");
					if (att < 0 && shan.length) {
						return (card.name == "shan" ? 8 : 6) - get.value(card);
					}
					return 0;
				})
				.forResult();
			if (result?.cards?.length) {
				event.result = {
					bool: true,
					cost_data: result.cards,
					targets: [trigger.player],
				};
			}
		},
		async content(event, trigger, player) {
			const cards = event.cost_data,
				target = trigger.player;
			await player.give(cards, target);
			await target.showHandcards();
			await target.modedDiscard(target.getCards("h", card => get.name(card, target) == "shan"));
		},
	},
	//标笮融
	stdcansi: {
		audio: "dccansi",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.countCards("he") && game.hasPlayer(target => player.inRange(target)); //&&player.countGainableCards(target,"he")
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(`残肆：令攻击范围内的一名角色获得你一张牌，然后视为对其依次使用【杀】,【决斗】`, true, (card, player, target) => {
					return player.inRange(target);
				})
				.set("ai", target => {
					const cards = [get.autoViewAs({ name: "sha", isCard: true }), get.autoViewAs({ name: "juedou", isCard: true })];
					return cards.reduce((eff, card) => eff + get.effect(target, card, get.player(), get.player()), 0);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const bool = await target.gainPlayerCard(player, "he", true).forResultBool();
			if (!bool) {
				return;
			}
			await game.delayx();
			for (let name of ["sha", "juedou"]) {
				const card = get.autoViewAs({ name: name, isCard: true });
				if (player.canUse(card, target, false, false)) {
					await player.useCard(card, target, false);
				}
			}
		},
	},
	//标庞德公
	stdlingjian: {
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return player.getHistory("useCard", evt => evt.card?.name == "sha").indexOf(event) == 0 && !player.hasHistory("sourceDamage", evt => evt.card && evt.getParent("useCard") === event) && player.hasSkill("stdmingshi", null, false, false) && player.awakenedSkills.includes("stdmingshi");
		},
		forced: true,
		async content(event, trigger, player) {
			player.restoreSkill("stdmingshi");
			player.popup("明识");
			game.log(player, "恢复了技能", "#g【明识】");
		},
		ai: { combo: "stdmingshi" },
	},
	stdmingshi: {
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog(`###明识###请选择一项`);
				dialog.add([
					[
						["draw", "摸两张牌"],
						["recover", "回复一点体力"],
						["damage", "对一名角色造成一点伤害"],
						["move", "移动场上的一张牌"],
					],
					"textbutton",
				]);
				return dialog;
			},
			filter(button) {
				const player = get.player();
				const { link } = button;
				if (link == "recover") {
					return player.isDamaged();
				}
				if (link == "move") {
					return player.canMoveCard();
				}
				return true;
			},
			check(button) {
				const player = get.player();
				const { link } = button;
				if (link == "recover") {
					return get.recoverEffect(player, player, player);
				}
				if (link == "draw") {
					return get.effect(player, { name: "wuzhong" }, player, player);
				}
				if (link == "damage") {
					return game
						.filterPlayer()
						.map(target => get.damageEffect(target, player, player))
						.sort((a, b) => b - a)[0];
				}
				if (button.link == "move") {
					return 2;
				}
				return 0;
			},
			backup(links, player) {
				return {
					link: links[0],
					delay: false,
					async content(event, trigger, player) {
						player.awakenSkill("stdmingshi");
						const { link } = get.info(event.name);
						switch (link) {
							case "draw":
								await player.draw(2);
								break;
							case "recover":
								if (player.isDamaged()) {
									await player.recover();
								}
								break;
							case "damage": {
								const { result } = await player.chooseTarget(`明识：对一名角色造成一点伤害`, true).set("ai", target => {
									const player = get.player();
									return get.damageEffect(target, player, player);
								});
								if (result?.targets?.length) {
									player.line(result.targets);
									await result.targets[0].damage();
								}
								break;
							}
							case "move":
								if (player.canMoveCard()) {
									await player.moveCard(true);
								}
								break;
						}
					},
				};
			},
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
		subSkill: { backup: {} },
	},
	//标南华老仙
	stdxianlu: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(target => target.countCards("e", { type: "equip" }));
		},
		filterTarget(card, player, target) {
			return target.countCards("e", { type: "equip" });
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (!target.countCards("e", { type: "equip" })) {
				return false;
			}
			const result = await player.discardPlayerCard(target, "e", true, card => get.type(card) == "equip").forResult();
			if (result?.cards) {
				const card = result.cards[0];
				if (get.color(card, false) == "red") {
					if (player.canAddJudge("lebu")) {
						await player.addJudge("lebu", [card]);
					}
					await target.damage();
				}
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target, card) {
					return -1 / target.countCards("e");
				},
			},
		},
	},
	stdtianshu: {
		mod: {
			maxHandcard(player, num) {
				return num + game.countGroup() - 1;
			},
		},
	},
	//四象封印·太阳
	//田丰
	stdgangjian: {
		audio: "sijian",
		trigger: { global: "phaseZhunbeiBegin" },
		filter(event, player) {
			return event.player.canUse({ name: "sha" }, player);
		},
		check(event, player) {
			if (get.attitude(player, event.player) > 0) {
				return false;
			}
			if (player.getEquip("bagua") || player.getEquip("rw_bagua")) {
				return true;
			}
			if (player.hasSkill("stdguijie") && player.countCards("hes", { color: "red" }) > 1) {
				return true;
			}
			if (player.countCards("hs", "shan") || (player.countCards("hs", "sha") && player.hasSkill("ollongdan", null, null, false))) {
				return true;
			}
			return get.effect(player, { name: "draw" }, player, player) + get.effect(event.player, { name: "sha" }, event.player, player);
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const { player: target } = trigger;
			const sha = get.autoViewAs({ name: "sha", isCard: true });
			if (target.canUse({ name: "sha" }, player)) {
				await target.useCard(sha, player);
				if (!game.hasPlayer(current => current.hasHistory("damage", evt => evt.getParent(3) == event))) {
					target.addTempSkill(event.name + "_effect");
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					cardEnabled(card) {
						if (get.type2(card) == "trick") {
							return false;
						}
					},
				},
				intro: { content: "本回合不能使用锦囊牌" },
			},
		},
	},
	stdguijie: {
		enable: ["chooseToRespond", "chooseToUse"],
		viewAs: {
			name: "shan",
			isCard: true,
		},
		filter(event, player) {
			return player.countCards("hes", { color: "red" }) > 1;
		},
		filterCard(card) {
			return get.color(card) == "red";
		},
		selectCard: 2,
		position: "hes",
		prompt: "弃置两张红色牌并摸一张牌，然后视为使用或打出一张【闪】",
		check(card) {
			return 6.5 - get.value(card);
		},
		log: false,
		async precontent(event, trigger, player) {
			player.logSkill("stdguijie");
			const cards = event.result.cards;
			await player.discard(cards);
			event.result.cards = [];
			await player.draw();
		},
		ai: {
			order(item, player) {
				if (player.countCards("hes", card => get.color(card) == "red" && get.name(card) != "shan") > 3) {
					return 7;
				}
				return 2;
			},
			respondShan: true,
			skillTagFilter(player) {
				return player.countCards("hes", { color: "red" }) > 1;
			},
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondShan") && current < 0) {
						return 0.6;
					}
				},
			},
		},
	},
	//刘协
	stdtianming: {
		audio: "tianming",
		inherit: "tianming",
		check(event, player) {
			const hs = player.getCards("h");
			if (hs.length <= 2 && hs.some(card => ["shan", "tao"].includes(card.name))) {
				return false;
			}
			return player.countCards("he") <= 3;
		},
		filter(event, player) {
			return event.card.name == "sha" && player.countCards("he");
		},
		async content(event, trigger, player) {
			if (player.countCards("he")) {
				await player.modedDiscard(player.getCards("he"));
			}
			await player.draw(2);
			const target = game.findPlayer(current => current.isMaxHp(true));
			if (target?.countCards("he") && player != target) {
				const { result } = await target.chooseBool(get.prompt(event.name), `弃置所有牌然后摸两张牌？`).set("choice", target.countCards("he") <= 3);
				if (result?.bool) {
					await target.modedDiscard(target.getCards("he"));
					await target.draw(2);
				}
			}
		},
	},
	stdmizhao: {
		audio: "mizhao",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h") && game.countPlayer(current => player != current) > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), 2, lib.filter.notMe)
				.set("targetprompt", ["传诏对象", "讨伐对象"])
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (ui.selected.targets.length) {
						const target1 = ui.selected.targets[0];
						const targets = game.filterPlayer(current => player != current && current != target1 && get.effect(current, { name: "losehp" }, player, target1, player) > 0);
						if (targets.length) {
							return get.effect(target, { name: "losehp" }, player, target1, player);
						}
					}
					return att;
				})
				.set("multitarget", true)
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			player.line2(targets);
			const [target1, target2] = targets;
			if (player.countCards("he")) {
				await player.give(player.getCards("he"), target1);
			}
			const { result } = await target1.chooseBool(get.prompt(event.name), `与${get.translation(target2)}各失去1点体力？`).set("choice", get.effect(target1, { name: "losehp" }, player, target1, player) + get.effect(target2, { name: "losehp" }, player, target1, player) > 0);
			if (!result?.bool) {
				return;
			}
			for (const target of targets.sortBySeat()) {
				await target.loseHp();
			}
		},
	},
	stdzhongyan: {
		trigger: { global: "die" },
		filter(event, player) {
			return event.player.group == "qun" && player.isDamaged();
		},
		zhuSkill: true,
		frequent: true,
		async content(event, trigger, player) {
			await player.recover();
		},
	},
	//司马昭
	stdzhaoxin: {
		audio: "xinfu_zhaoxin",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.countCards("h");
		},
		forced: true,
		async content(event, trigger, player) {
			const hs = player.getCards("h");
			if (!hs.length) {
				return;
			}
			await player.showCards(hs, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
			const colors = hs.map(card => get.color(card)).toUniqued();
			if (colors.length !== 1) {
				return;
			}
			const { result } = await player.chooseTarget(true, get.prompt2(event.name)).set("ai", target => {
				const player = get.player();
				return get.damageEffect(target, player, player);
			});
			if (result?.bool && result?.targets?.length) {
				await result.targets[0].damage();
			}
		},
	},
	//郭照
	stdwufei: {
		audio: "wufei",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(current => current.hasSex("female") && current.countCards("h"));
		},
		async cost(event, trigger, player) {
			const list = game.filterPlayer(current => current.hasSex("female") && current.countCards("h"));
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return get.event("list").includes(target);
				})
				.set("ai", target => {
					const player = get.player();
					const att = Math.sign(get.attitude(player, target));
					const list = get.event("list").filter(current => current.hasSex("female") && current.countCards("h") && get.attitude(player, current) < 0);
					if (list.length) {
						return -att * target.countCards("h");
					}
					const bool = Object.keys(lib.color).some(color => {
						const num = target.countCards("h", card => get.color(card, target) == color);
						return num > 0 && num <= 2;
					});
					return att * (bool ? 1 : 0);
				})
				.set("list", list)
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			if (!target.countCards("h")) {
				return;
			}
			await target.showHandcards();
			const list = [],
				bannedList = [],
				indexs = Object.keys(lib.color),
				hs = target.getCards("h");
			for (const card of hs) {
				const color = get.color(card, target);
				list.add(color);
				if (!lib.filter.cardDiscardable(card, target, "stdwufei")) {
					bannedList.add(color);
				}
				if (bannedList.length == indexs.length) {
					break;
				}
			}
			list.removeArray(bannedList);
			list.sort((a, b) => indexs.indexOf(a) - indexs.indexOf(b));
			if (!list.length) {
				return;
			}
			const dialog = ["诬诽：弃置一种颜色的所有牌并摸一张牌"];
			for (let i = 0; i < list.length; i++) {
				const colorx = list[i];
				const cards = hs.filter(card => get.color(card, target) == colorx);
				if (cards.length) {
					dialog.addArray([`<span class="text center">${get.translation(colorx)}</span>`, cards]);
				}
			}
			const result =
				list.length > 1
					? await target
							.chooseControl(list)
							.set("ai", () => {
								const { player, controls } = get.event();
								const cards = player.getCards("h");
								return controls.sort((a, b) => {
									return get.value(cards.filter(card => get.color(card) === a)) - get.value(cards.filter(card => get.color(card) === b));
								})[0];
							})
							.set("dialog", dialog)
							.forResult()
					: { control: list[0] };
			const control = result?.control;
			if (control) {
				target.popup(control);
				game.log(target, "选择了", "#g" + get.translation(control));
				const cards = target.getCards("h").filter(card => get.color(card) === control);
				if (cards.length) {
					await target.discard(cards);
					await target.draw();
				}
			}
		},
	},
	stdjiaochong: {
		audio: "yichong",
		inherit: "stdwufei",
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return event.player.hasSex("male") && game.hasPlayer(current => current.hasSex("female") && current.countCards("h"));
		},
		async content(event, trigger, player) {
			await player.useSkill("stdwufei", event.targets);
		},
		derivation: "stdwufei",
	},
	//贾逵
	stdzhongzuo: {
		audio: "zhongzuo",
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return ["damage", "sourceDamage"].some(key => player.hasHistory(key));
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			await game.asyncDraw([trigger.player, player].sortBySeat());
		},
	},
	stdwanlan: {
		audio: "wanlan",
		inherit: "wanlan",
		filter(event, player) {
			return event.player != player && event.player.hp <= 0 && player.countCards("h");
		},
		check(event, player) {
			if (get.attitude(player, event.player) < 4) {
				return false;
			}
			if (player.countCards("hs", card => player.canSaveCard(card, event.player)) >= 1 - event.player.hp) {
				return false;
			}
			if (event.player == player || event.player == get.zhu(player)) {
				return true;
			}
			if (get.recoverEffect(event.player, player, player) <= 0) {
				return false;
			}
			return !player.hasUnknown();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { player: target } = trigger;
			if (player.countCards("h")) {
				await player.give(player.getCards("h"), target);
			}
			await target.recoverTo(1);
		},
	},
	//虞翻
	stdzongxuan: {
		audio: "zongxuan",
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.type != "discard" || !game.hasPlayer(current => current.countDiscardableCards(player, "ej"))) {
				return false;
			}
			return event.getl?.(player)?.hs?.someInD("d");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.countDiscardableCards(player, "ej");
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "guohe_copy", position: "ej" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			if (target.countDiscardableCards(player, "ej")) {
				await player.discardPlayerCard(target, "ej", true);
			}
		},
	},
	stdzhiyan: {
		audio: "zhiyan",
		getcards: () =>
			get
				.discarded()
				.filterInD("d")
				.filter(card => get.type(card) == "equip"),
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return get.info("stdzhiyan").getcards().length;
		},
		async cost(event, trigger, player) {
			const cards = get.info(event.skill).getcards();
			const { result } = await player.chooseButton(["直言：获得其中一张牌", cards]).set("ai", button => {
				return get.value(button.link);
			});
			event.result = {
				bool: result?.bool,
				cost_data: result?.links,
			};
		},
		async content(event, trigger, player) {
			await player.gain(event.cost_data, "gain2");
		},
	},
	//诸葛恪
	stdaocai: {
		audio: "aocai",
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return !player.countCards("h");
		},
		async cost(event, trigger, player) {
			const cards = get.cards(2, true);
			const { result } = await player.chooseButton(["傲才：获得其中一张牌", cards]).set("ai", button => {
				return get.value(button.link);
			});
			event.result = {
				bool: result?.bool,
				cost_data: result?.links,
			};
		},
		async content(event, trigger, player) {
			await player.gain(event.cost_data, "gain2");
		},
	},
	stdduwu: {
		audio: "duwu",
		inherit: "duwu",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") && game.hasPlayer(current => get.info("stdduwu").filterTarget(null, player, current));
		},
		filterCard: true,
		selectCard: -1,
		position: "h",
		filterTarget(card, player, target) {
			return player.inRange(target);
		},
		check: card => 1,
		async content(event, trigger, player) {
			await event.target.damage("nocard");
		},
		ai: {
			damage: true,
			order(item, player) {
				if (game.hasPlayer(current => player.inRange(current) && get.effect(current, "stdduwu", player, player) > 0) && !player.hasCard(card => player.hasValueTarget(card) > 0, "h")) {
					return 10;
				}
				return 2;
			},
			result: {
				target(player, target) {
					return get.damageEffect(target, player);
				},
			},
			threaten: 1.5,
			expose: 0.3,
		},
	},
	//孟达
	stdzhuan: {
		audio: "dclibang",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.getHistory("damage").indexOf(event) == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.draw(3);
			const { source } = trigger;
			if (source?.isIn() && player.countGainableCards(source, "he")) {
				await source.gainPlayerCard(player, "he", true);
			}
		},
	},
	//曹真
	stdsidi: {
		audio: "sidi",
		trigger: { global: "respond" },
		frequent: true,
		filter: event => event.card?.name == "sha",
		async content(event, trigger, player) {
			await player.draw();
		},
	},
	//董允
	stdbingzheng: {
		audio: "bingzheng",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.hasPlayer(target => target.countDiscardableCards(target, "he"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.countDiscardableCards(target, "he");
				})
				.set("ai", target => {
					const player = get.player();
					if (!target.countCards("e") && target.countCards("h") - 1 == target.getHp()) {
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					}
					return get.effect(target, { name: "guohe_copy2" }, player, player) + get.effect(player, { name: "losehp" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (target.countDiscardableCards(target, "he")) {
				await target.chooseToDiscard("he", true);
			}
			if (target.countCards("h") != target.getHp()) {
				await player.loseHp();
			}
		},
	},
	stdduliang: {
		trigger: { player: "damageEnd" },
		filter: event => event.num > 0,
		async content(event, trigger, player) {
			await player.draw();
			if (player.countCards("h") == player.getHp() && player.isDamaged()) {
				await player.recover();
			}
		},
	},
	//鲍三娘
	stdzhennan: {
		audio: "xinfu_zhennan",
		trigger: { global: "phaseZhunbeiBegin" },
		filter(event, player) {
			return event.player != player && player.countDiscardableCards(player, "h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill, trigger.player))
				.set("ai", card => {
					const { goon } = get.event();
					return goon ? 6.5 - get.value(card) : 0;
				})
				.set("goon", get.attitude(player, trigger.player) > 0)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const { player: target } = trigger;
			player.addTempSkill(event.name + "_effect");
			player.markAuto(event.name + "_effect", [target]);
			target.addTempSkill(event.name + "_ai");
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					return player.getStorage("stdzhennan_effect").includes(event.player);
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.unmarkAuto(event.name, [trigger.player]);
					if (get.color(trigger.card) == "red") {
						const cards = trigger.cards?.filterInD("od");
						if (cards.length) {
							player.logSkill(event.name, trigger.player);
							await trigger.player.gain(cards, "gain2");
						}
					}
				},
			},
			ai: {
				charlotte: true,
				mod: {
					aiOrder(player, card, num) {
						if (get.itemtype(card) == "card" && get.color(card) == "red" && !["equip", "delay"].includes(get.type(card))) {
							return num + 10;
						}
					},
				},
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
				},
			},
		},
	},
	stdshuyong: {
		audio: "meiyong",
		trigger: { global: "useCard" },
		frequent: true,
		filter(event, player) {
			const target = event.player,
				last = target.getLastUsed(1);
			if (target == player || _status.currentPhase != target) {
				return false;
			}
			return last?.card?.name == event.card.name;
		},
		async content(event, trigger, player) {
			await player.draw();
		},
	},
	//刘巴
	stdduanbi: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h");
		},
		check(event, player) {
			if (player.countCards("h") <= 2) {
				return true;
			}
			const val = player.getCards("h").reduce((sum, card) => sum + get.value(card), 0);
			return val <= 16;
		},
		async content(event, trigger, player) {
			await player.modedDiscard(player.getCards("h"));
			if (game.countPlayer() < 2) {
				return;
			}
			const { result } = await player.chooseTarget(`锻币：令两名角色各摸两张牌`, 2, true).set("ai", target => {
				const player = get.player();
				return get.effect(target, { name: "draw" }, player, player) * 2;
			});
			if (result?.targets?.length) {
				const targets = result.targets.sortBySeat();
				player.line(targets);
				await game.asyncDraw(targets, 2);
			}
		},
	},
	//孔融
	stdlirang: {
		getCards(event) {
			return game
				.getGlobalHistory("everything", evt => {
					if (!evt.cards?.length) {
						return false;
					}
					return (evt.name === "cardsDiscard" || evt.position == ui.discardPile) && evt.getParent("phaseDiscard") == event;
				})
				.reduce((cards, evt) => cards.addArray(evt.cards.filterInD("d")), [])
				.filter(card => get.color(card) == "red");
		},
		trigger: { global: "phaseDiscardEnd" },
		filter(event, player) {
			return event.player != player && player.countCards("he");
		},
		logTarget: "player",
		async cost(event, trigger, player) {
			const { player: target } = trigger;
			const cards = get.info(event.skill).getCards(trigger);
			let str = `交给${get.translation(target)}一张牌`;
			if (cards.length) {
				str += `然后获得${get.translation(cards)}`;
			}
			event.result = await player
				.chooseCard(get.prompt(event.skill, target), "he", str)
				.set("ai", card => {
					const { player, targetx, cardsx } = get.event();
					const att = get.attitude(player, targetx);
					if (att > 0 && cardsx.length) {
						return 8 - get.value(card);
					}
					if (att <= 0 && cardsx.length >= 2) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set("targetx", target)
				.set("cardsx", cards)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.give(event.cards, trigger.player);
			const cards = get.info(event.name).getCards(trigger);
			if (cards.length) {
				await player.gain(cards, "gain2");
			}
		},
	},
	//邹氏
	stdhuoshui: {
		audio: "rehuoshui",
		trigger: { global: "damageBegin3" },
		filter(event, player) {
			return event.player != player && event.player.countCards("j");
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num++;
		},
	},
	stdqingcheng: {
		audio: "reqingcheng",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (player.hasJudge("lebu")) {
				return false;
			}
			return player.countCards("hes", card => get.info("stdqingcheng").filterCard(card, player)) > 1;
		},
		filterCard(card, player) {
			return get.type2(card, player) != "trick" && get.color(card, player) == "red";
		},
		position: "he",
		selectCard: 2,
		filterTarget(card, player, target) {
			return target != player && target.canAddJudge("lebu");
		},
		filterOk() {
			const {
					cards,
					targets: [target],
				} = ui.selected,
				player = get.player();
			return player.canAddJudge({ name: "lebu", cards: [cards[0]] }) && player.canUse({ name: "lebu", cards: [cards[1]] }, target);
		},
		check(card) {
			return 8 - get.value(card);
		},
		discard: false,
		lose: false,
		delay: false,
		async content(event, trigger, player) {
			const { cards } = event;
			const targets = [player, event.target].sortBySeat();
			for (let i = 0; i < cards.length; i++) {
				const card = get.autoViewAs({ name: "lebu", cards: [cards[i]] }),
					target = targets[i];
				if ((player == target && player.canAddJudge(card)) || (player != target && player.canUse(card, target))) {
					await player.useCard(card, [cards[i]], targets[i]);
				}
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					return get.effect(target, { name: "lebu" }, player, target);
				},
			},
		},
	},
	//孙鲁育
	stdmumu: {
		audio: "mumu",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.countDiscardableCards(player, "h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill), "h")
				.set("ai", card => {
					if (get.event("goon")) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set("goon", player.canMoveCard(true, true))
				.forResult();
		},
		async content(event, trigger, player) {
			if (player.canMoveCard(null, true)) {
				await player.moveCard().set("nojudge", true);
			}
		},
	},
	stdmeibu: {
		audio: "meibu",
		trigger: { global: "useCard" },
		filter(event, player) {
			return event.player.countDiscardableCards(event.player, "h") && event.player.getEquips(1).length && event.card?.name == "sha";
		},
		logTarget: "player",
		check: (event, player) => get.attitude(player, event.player) < 0,
		async content(event, trigger, player) {
			const { player: target } = trigger;
			if (target.countDiscardableCards(target, "h")) {
				await target.chooseToDiscard("h", true);
			}
		},
	},
	//周鲂
	stdqijian: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(current => game.hasPlayer(currentx => current.countCards("h") + currentx.countCards("h") == 7));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), 2)
				.set("filterTarget", (card, player, target) => {
					if (!ui.selected.targets.length) {
						return true;
					}
					const targetx = ui.selected.targets[0];
					return targetx.countCards("h") + target.countCards("h") == 7;
				})
				.set("complexTarget", true)
				.set("ai", target => {
					const player = get.player();
					if (!ui.selected.targets.length) {
						return get.attitude(player, target);
					}
					return 1;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			const list = ["摸牌", "弃牌"];
			for (const target of targets) {
				if (!target.isIn()) {
					continue;
				}
				const targetx = targets.filter(current => current != target)[0];
				let result;
				const goon = targetx.countDiscardableCards(target, "he");
				if (goon) {
					result = await target
						.chooseControl(list)
						.set("prompt", `七笺：弃置${get.translation(targetx)}一张牌或令其摸一张牌`)
						.set("ai", () => {
							const { player, targetx } = get.event();
							const att = get.attitude(player, targetx);
							return att > 0 ? "摸牌" : "弃牌";
						})
						.set("targetx", targetx)
						.forResult();
				} else {
					result = { control: "摸牌" };
				}
				const control = result?.control;
				if (!targetx.isIn() || !control) {
					continue;
				}
				target.popup(control);
				game.log(target, "选择", "#g" + control);
				target.line(targetx);
				if (control == "摸牌") {
					await targetx.draw();
				} else if (control == "弃牌" && targetx.countDiscardableCards(target, "he")) {
					await target.discardPlayerCard(targetx, "he", true);
				}
			}
		},
	},
	stdyoudi: {
		audio: "xinfu_youdi",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("hes", card => player.hasUseTarget(get.autoViewAs({ name: "shunshou" }, [card]), false, false) && get.color(card, player) == "red");
		},
		direct: true,
		clearTime: true,
		async content(event, trigger, player) {
			const next = player.chooseToUse();
			next.set("openskilldialog", get.prompt2(`${event.name}`));
			next.set("norestore", true);
			next.set("_backupevent", `${event.name}_backup`);
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup(`${event.name}_backup`);
			next.set("logSkill", event.name);
			await next;
		},
		subSkill: {
			backup: {
				filterCard(card, player) {
					return get.itemtype(card) == "card" && get.color(card, player) == "red";
				},
				position: "hes",
				viewAs: { name: "shunshou" },
				check(card) {
					return 7 - get.value(card);
				},
				log: false,
			},
		},
	},
	//四象封印·少阳
	//张苞
	stdjuezhu: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player, name) {
			if (name == "damageSource") {
				return true;
			}
			return event.source?.isIn() && player.canUse({ name: "juedou", isCard: true }, event.source);
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername == "damageSource") {
				player.addTempSkill("stdjuezhu_paoxiao");
			} else {
				let card = { name: "juedou", isCard: true };
				if (player.canUse(card, trigger.source)) {
					await player.useCard(card, trigger.source);
				}
			}
		},
		subSkill: {
			paoxiao: {
				charlotte: true,
				mod: {
					cardUsable() {
						return Infinity;
					},
				},
			},
		},
	},
	stdchengji: {
		audio: 2,
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			if (!ui.selected.cards.length) {
				return true;
			}
			return ui.selected.cards.every(cardx => get.color(cardx, player) != get.color(card, player));
		},
		complexCard: true,
		position: "hes",
		selectCard: 2,
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			if (player.countCards("hes") < 2) {
				return false;
			}
			let color = get.color(player.getCards("hes")[0], player);
			return _status.connectMode || player.getCards("hes").some(card => get.color(card, player) != color);
		},
		prompt: "将两张颜色不同的牌当杀使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
		ai: {
			skillTagFilter(player) {
				if (player.countCards("hes") < 2) {
					return false;
				}
				let color = get.color(player.getCards("hes")[0], player);
				return _status.connectMode || player.getCards("hes").some(card => get.color(card, player) != color);
			},
			respondSha: true,
		},
	},
	//刘谌
	stdzhanjue: {
		audio: "zhanjue",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: -1,
		position: "h",
		filter(event, player) {
			let hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (let i = 0; i < hs.length; i++) {
				let mod2 = game.checkMod(hs[i], player, "unchanged", "cardEnabled2", player);
				if (mod2 === false) {
					return false;
				}
			}
			return event.filterCard(get.autoViewAs({ name: "juedou" }, hs));
		},
		viewAs: { name: "juedou" },
		ai: {
			order(item, player) {
				if (player.countCards("h") > 1) {
					return 0.8;
				}
				return 8;
			},
			tag: {
				respond: 2,
				respondSha: 2,
				damage: 1,
			},
			result: {
				player(player, target) {
					let td = get.damageEffect(target, player, target);
					if (!td) {
						return 0;
					}
					let hs = player.getCards("h"),
						val = hs.reduce((acc, i) => acc - get.value(i, player), 0) / 6 + 1;
					if (td > 0) {
						return val;
					}
					if (
						player.hasSkillTag("directHit_ai", true, {
							target: target,
							card: get.autoViewAs({ name: "juedou" }, hs),
						})
					) {
						return val;
					}
					let pd = get.damageEffect(player, target, player),
						att = get.attitude(player, target);
					if (att > 0 && get.damageEffect(target, player, player) > pd) {
						return val;
					}
					let ts = target.mayHaveSha(player, "respond", null, "count");
					if (ts < 1 && ts * 8 < Math.pow(player.hp, 2)) {
						return val;
					}
					let damage = pd / get.attitude(player, player),
						ps = player.mayHaveSha(player, "respond", hs, "count");
					if (att > 0) {
						if (ts < 1) {
							return val;
						}
						return val + damage + 1;
					}
					if (pd >= 0) {
						return val + damage + 1;
					}
					if (ts - ps + Math.exp(0.8 - player.hp) < 1) {
						return val - ts;
					}
					return val + damage + 1 - ts;
				},
				target(player, target) {
					let td = get.damageEffect(target, player, target) / get.attitude(target, target);
					if (!td) {
						return 0;
					}
					let hs = player.getCards("h");
					if (
						td > 0 ||
						player.hasSkillTag("directHit_ai", true, {
							target: target,
							card: get.autoViewAs({ name: "juedou" }, hs),
						})
					) {
						return td + 1;
					}
					let pd = get.damageEffect(player, target, player),
						att = get.attitude(player, target);
					if (att > 0) {
						return td + 1;
					}
					let ts = target.mayHaveSha(player, "respond", null, "count"),
						ps = player.mayHaveSha(player, "respond", hs, "count");
					if (ts < 1) {
						return td + 1;
					}
					if (pd >= 0) {
						return 0;
					}
					if (ts - ps < 1) {
						return td + 1 - ts;
					}
					return -ts;
				},
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (
						(!arg || (arg.card && get.name(arg.card) === "tao")) &&
						player.isPhaseUsing() &&
						!player.countSkill("stdzhanjue") &&
						player.hasCard(card => {
							return get.name(card) !== "tao";
						}, "h")
					);
				}
			},
		},
		group: "stdzhanjue_draw",
		subSkill: {
			draw: {
				trigger: {
					player: "useCardAfter",
				},
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return event.skill == "stdzhanjue";
				},
				content() {
					player.draw();
				},
			},
		},
	},
	stdqinwang: {
		audio: "qinwang1",
		zhuSkill: true,
		group: "stdqinwang_effect",
		filter(event, player) {
			if (!player.hasZhuSkill("stdqinwang") || event.stdqinwang) {
				return false;
			}
			return game.hasPlayer(current => current != player && current.group == "shu");
		},
		enable: "chooseToRespond",
		viewAs: { name: "sha" },
		filterCard() {
			return false;
		},
		selectCard: -1,
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.3;
			},
			respondSha: true,
			skillTagFilter(player) {
				if (!player.hasZhuSkill("stdqinwang") || !game.hasPlayer(current => current != player && current.group == "shu")) {
					return false;
				}
			},
		},
		subSkill: {
			effect: {
				audio: "stdqinwang",
				trigger: {
					player: "respondBegin",
				},
				filter(event, player) {
					return event.skill == "stdqinwang";
				},
				forced: true,
				async content(event, trigger, player) {
					delete trigger.skill;
					trigger.getParent().set("stdqinwang", true);
					while (true) {
						if (event.current == undefined) {
							event.current = player.next;
						}
						if (event.current == player) {
							trigger.cancel();
							trigger.getParent().goto(0);
							return;
						} else if (event.current.group == "shu") {
							const discardEvent = event.current.chooseToDiscard("是否弃置一张牌，视为" + get.translation(player) + "打出一张杀？");
							discardEvent.set("filterCard", card => get.type(card) == "basic");
							discardEvent.set("ai", card => {
								const event = _status.event;
								if (get.attitude(event.player, event.source) >= 2) {
									return 6 - get.value(card);
								}
								return 0;
							});
							discardEvent.set("source", player);
							discardEvent.set("skillwarn", "弃置一张牌，视为" + get.translation(player) + "打出一张杀");
							const { bool } = await discardEvent.forResult();
							if (bool) {
								if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
									event.current.ai.shown += 0.3;
									if (event.current.ai.shown > 0.95) {
										event.current.ai.shown = 0.95;
									}
								}
								return;
							} else {
								event.current = event.current.next;
							}
						} else {
							event.current = event.current.next;
						}
					}
				},
			},
		},
	},
	//关索
	stdzhengnan: {
		audio: "zhengnan",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return player.countCards("hs", { color: "red" });
		},
		direct: true,
		async content(event, trigger, player) {
			const next = player.chooseToUse();
			next.set("openskilldialog", get.prompt2("stdzhengnan"));
			next.set("norestore", true);
			next.set("_backupevent", "stdzhengnan_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("stdzhengnan_backup");
			await next;
			if (
				game.getGlobalHistory("everything", evt => {
					if (evt.name != "die" || evt?.source != player) {
						return false;
					}
					return evt.reason?.getParent(event.name) == event;
				}).length > 0
			) {
				await player.draw(2);
			}
		},
		subSkill: {
			backup: {
				audio: "stdzhengnan",
				filterCard(card) {
					return get.itemtype(card) == "card" && get.color(card) == "red";
				},
				position: "hs",
				viewAs: {
					name: "sha",
				},
				prompt: "将一张红色手牌当杀使用",
				check(card) {
					return 7 - get.value(card);
				},
			},
		},
	},
	//夏侯霸
	stdbaobian: {
		audio: "rebaobian",
		trigger: { player: "phaseUseBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					if (player.hp < 2) {
						return 0;
					}
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.loseHp();
			const target = event.targets[0],
				card = { name: "sha", isCard: true };
			const { cards } = await target.chooseToDiscard("h", true).forResult();
			if (get.type(cards[0]) == "basic" && player.canUse(card, target, false)) {
				await player.useCard(card, target, false);
			}
		},
	},
	//曹睿
	stdhuituo: {
		audio: "huituo",
		trigger: {
			player: "damageEnd",
		},
		async content(event, trigger, player) {
			const cards = game.cardsGotoOrdering(get.cards(2)).cards;
			await player.showCards(cards, get.translation(player) + "发动了【恢拓】");
			const next = player.chooseToMove("恢拓：是否交换任意张牌？");
			next.set("list", [
				["展示牌", cards, "sbhuanshi_tag"],
				["你的手牌", player.getCards("h")],
			]);
			next.set("filterMove", (from, to) => {
				return typeof to !== "number";
			});
			next.set("processAI", list => {
				let cards = [...list[0][1], ...list[1][1]],
					player = get.player();
				cards.sort((a, b) => player.getUseValue(a, null, true) - player.getUseValue(b, null, true));
				return [cards.slice(0, 2), cards.slice(2)];
			});
			const { bool, moved } = await next.forResult();
			if (bool) {
				const puts = player.getCards("h", i => moved[0].includes(i)),
					gains = cards.filter(i => moved[1].includes(i));
				if (puts.length && gains.length) {
					player.$throw(puts, 1000);
					await player.lose(puts, ui.special);
					await player.gain(gains, "gain2");
					const cardx = moved[0].slice();
					if (cardx.length) {
						await game.cardsGotoOrdering(cardx);
						for (let i = cardx.length - 1; i >= 0; i--) {
							ui.cardPile.insertBefore(cardx[i], ui.cardPile.firstChild);
						}
						game.updateRoundNumber();
					}
				}
			}
		},
	},
	stdmingjian: {
		audio: "mingjian",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		filterTarget: lib.filter.notMe,
		check(card) {
			return 7 - get.value(card);
		},
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const cards = event.cards,
				target = event.target;
			await player.showCards(cards, get.translation(player) + "发动了【明鉴】");
			await player.give(cards, target, true);
			await target
				.chooseToUse(function (card, player, event) {
					if (!get.event("cardx")?.includes(card)) {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				}, "明鉴：是否使用" + get.translation(cards) + "？")
				.set("cardx", cards);
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					return target.getUseValue(ui.selected.cards[0]) + 1;
				},
			},
		},
	},
	//刘晔
	stdpolu: {
		audio: "polu",
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			return event.player.countDiscardableCards(player, "e");
		},
		async cost(event, trigger, player) {
			const { bool, links: cards } = await player
				.choosePlayerCard("e", trigger.player, get.prompt2(event.skill, trigger.player))
				.set("ai", button => {
					const target = get.event().getTrigger().player,
						player = get.player();
					if (get.attitude(player, target) <= 0) {
						return get.value(button.link) + 2;
					}
					if (player == target) {
						return 5 - get.value(button.link);
					}
					return 0;
				})
				.forResult();
			event.result = {
				bool: bool,
				cards: cards,
				targets: [trigger.player],
			};
		},
		async content(event, trigger, player) {
			const { targets, cards } = event;
			const next = targets[0].discard(cards);
			if (player != targets[0]) {
				next.notBySelf = true;
			}
			next.discarder = player;
			await next;
			if (player == targets[0]) {
				await player.draw();
			}
		},
	},
	stdchoulve: {
		audio: "choulve",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		filterTarget: lib.filter.notMe,
		check(card) {
			return 7 - get.value(card);
		},
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const cards = event.cards,
				target = event.target;
			await player.give(cards, target);
			const { bool, cards: cardx } = await target
				.chooseCard(`是否展示并交给${get.translation(player)}一张装备牌？`, "he")
				.set("filterCard", card => get.type(card) == "equip")
				.set("ai", card => {
					if (get.event("att") <= 0) {
						return 0;
					}
					return 5 - get.value(card);
				})
				.set("att", get.attitude(target, player))
				.forResult();
			if (bool) {
				await target.showCards(cardx);
				await target.give(cardx, player);
			}
		},
		ai: {
			order: 7,
			result: {
				target: 1,
			},
		},
	},
	//郭皇后
	stdjiaozhao: {
		audio: "rejiaozhao",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 1;
		},
		async content(event, trigger, player) {
			const { target } = event;
			if (!target.countCards("h")) {
				return;
			}
			const { result } = await target.chooseCard("展示两张手牌", "h", 2, true);
			if (!result?.cards?.length) {
				return;
			}
			const { cards } = result;
			await target.showCards(cards);
			if (event.getParent(2).name == "stddanxin") {
				const result = await player
					.chooseButton(["是否选择其中一张牌获得？", cards])
					.set("ai", button => {
						if (button.link.name == "du") {
							return 0;
						}
						return get.value(button.link) + 1;
					})
					.forResult();
				if (result?.bool && result?.links?.length) {
					await player.gain(result.links, target, "giveAuto");
				}
			} else {
				if (!player.countCards("h")) {
					return;
				}
				const cardx = player.getCards("h").sort((a, b) => player.getUseValue(a) - player.getUseValue(b))[0];
				const result = await player
					.chooseButton(2, ["你的手牌", player.getCards("h"), `${get.translation(target)}展示的手牌`, cards])
					.set("filterButton", button => {
						const { player, cards } = get.event();
						if (!ui.selected.buttons.length) {
							return true;
						}
						let card = ui.selected.buttons[0].link;
						if (cards.includes(card)) {
							return !cards.includes(button.link);
						}
						return cards.includes(button.link);
					})
					.set("cards", cards)
					.set("cardx", cardx)
					.set("ai", button => {
						const { player, cards, cardx } = get.event();
						if (ui.selected.buttons.length) {
							return button.link == cardx;
						}
						if (!cards.includes(button.link)) {
							return 0;
						}
						if (player.getUseValue(button.link) > player.getUseValue(cardx)) {
							return 0;
						}
						return player.getUseValue(button.link) + 1;
					})
					.forResult();
				if (result?.bool && result?.links?.length) {
					const cards1 = result.links.filter(card => !cards.includes(card)),
						cards2 = result.links.filter(card => cards.includes(card));
					await player.swapHandcards(target, cards1, cards2);
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					return get.attitude(player, target);
				},
			},
		},
	},
	stddanxin: {
		audio: "redanxin",
		trigger: { player: "damageEnd" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("filterTarget", (card, player, target) => {
					return target != player && target.countCards("h") > 1;
				})
				.set("ai", target => {
					return get.effect(target, { name: "shunshou_copy2" }, get.player(), get.player());
				})
				.forResult();
		},
		derivation: "stdjiaozhao",
		async content(event, trigger, player) {
			await player.useSkill("stdjiaozhao", event.targets);
		},
	},
	//吕范
	stddianfeng: {
		audio: "spdiancai",
		trigger: {
			player: ["loseAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		getIndex(event, player) {
			return game
				.filterPlayer(current => {
					let evt = event.getl(current);
					return evt?.es?.length > 0 && !current.countCards("e");
				})
				.sortBySeat();
		},
		logTarget(_1, _2, _3, target) {
			return target;
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
		},
	},
	//丁奉
	stdduanbing: {
		audio: "duanbing",
		forced: true,
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			if (player.hasHistory("sourceDamage", evt => evt?.card?.name == "sha")) {
				return false;
			}
			return event?.card?.name == "sha";
		},
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.num++;
		},
		group: "stdduanbing_forced",
		subSkill: {
			forced: {
				priority: Infinity,
				mod: {
					attackRange: () => 1,
				},
			},
		},
	},
	stdfenxun: {
		audio: "fenxun",
		enable: "phaseUse",
		usable: 1,
		filterCard(card, player) {
			return get.subtype(card) == "equip2";
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			player.markAuto("stdfenxun_effect", [event.target]);
			player.addTempSkill("stdfenxun_effect");
		},
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			order: 4,
			result: {
				player(player, target) {
					if (player.inRange(target)) {
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
							return current != player && player.inRange(target) && geteff(current);
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
		subSkill: {
			effect: {
				mark: "character",
				onremove: true,
				intro: {
					content: "$视为在你攻击范围内",
				},
				mod: {
					inRange(from, to) {
						if (from.getStorage("stdfenxun_effect").includes(to)) {
							return true;
						}
					},
				},
			},
		},
	},
	//孙鲁班
	stdzenhui: {
		audio: "rechanhui",
		trigger: { player: "useCard2" },
		filter(event, player) {
			if (!event.targets?.length) {
				return false;
			}
			const card = event.card;
			if (card.name != "sha" && get.type2(card) != "trick") {
				return false;
			}
			return game.hasPlayer(current => {
				return current != player && !event.targets.includes(current);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					if (player == target) {
						return false;
					}
					const evt = _status.event.getTrigger();
					return !evt.targets.includes(target);
				})
				.set("ai", target => {
					const trigger = _status.event.getTrigger(),
						player = _status.event.player;
					let eff = 0;
					for (let current of trigger.targets) {
						eff += get.effect(current, trigger.card, target, player);
					}
					return eff > get.event("original");
				})
				.set(
					"original",
					(function () {
						let eff = 0;
						for (let cur of trigger.targets) {
							eff += get.effect(cur, trigger.card, player, player);
						}
						return eff;
					})()
				)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			trigger.player = target;
			game.log(target, "成为了", trigger.card, "的使用者");
		},
	},
	stdchuyi: {
		audio: "xinzenhui",
		trigger: {
			global: "damageBegin1",
		},
		round: 1,
		filter(event, player) {
			if (!event.source || !event.source.isIn() || event.source == player) {
				return false;
			}
			return player.inRange(event.player);
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0 && get.damageEffect(event.player, event.source, player, event.nature) > 0;
		},
		async content(event, trigger, player) {
			trigger.num++;
		},
	},
	//留赞
	stdfenyin: {
		audio: "fenyin",
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed;
		},
		async content(event, trigger, player) {
			trigger.num += 2;
			player.addTempSkill("stdfenyin_discard");
		},
		subSkill: {
			discard: {
				mod: {
					aiOrder(player, card, num) {
						if (typeof card == "object" && player == _status.currentPhase) {
							var evt = player.getLastUsed();
							if (evt && evt.card && get.color(evt.card) != "none" && get.color(card) != "none" && get.color(evt.card) != get.color(card)) {
								return num + 10;
							}
						}
					},
				},
				audio: "stdfenyin",
				trigger: { player: "useCard" },
				charlotte: true,
				forced: true,
				filter(event, player) {
					if (!player.countCards("he")) {
						return false;
					}
					if (_status.currentPhase != player) {
						return false;
					}
					var color2 = get.color(event.card);
					var evt = player.getLastUsed(1);
					if (!evt) {
						return false;
					}
					var color1 = get.color(evt.card);
					return color1 && color2 && color1 != "none" && color2 != "none" && color1 == color2;
				},
				async content(event, trigger, player) {
					await player.chooseToDiscard("he", true);
				},
			},
		},
	},
	//孙翊
	stdzaoli: {
		audio: "zaoli",
		locked: true,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return player.countCards("he");
		},
		async cost(event, trigger, player) {
			let list = [];
			if (player.countCards("h")) {
				list.push("手牌");
			}
			if (player.countCards("e")) {
				list.push("装备区");
			}
			let choice = list[0];
			if (list.length > 1) {
				const { control } = await player
					.chooseControl(list)
					.set("prompt", "躁厉：选择弃置的区域")
					.set("ai", () => ["手牌", "装备区"].randomGet())
					.forResult();
				if (control) {
					choice = control;
				}
			}
			event.result = {
				bool: true,
				cost_data: choice == "手牌" ? "h" : "e",
			};
		},
		async content(event, trigger, player) {
			const pos = event.cost_data;
			let num = player.countCards(pos);
			await player.chooseToDiscard(pos, num, true);
			num += player.getDamagedHp();
			await player.draw(num);
			await player.loseHp();
		},
	},
	//陶谦
	stdyirang: {
		audio: "yirang",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					if (target == player) {
						return false;
					}
					return !game.hasPlayer(current => {
						return current != player && current.countCards("h") < target.countCards("h");
					});
				})
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = player.getCards("h"),
				target = event.targets[0];
			let types = [];
			for (let i = 0; i < cards.length; i++) {
				types.add(get.type(cards[i], "trick"));
			}
			await player.give(cards, target);
			await player.draw(types.length);
		},
	},
	//纪灵
	stdshuangdao: {
		audio: "shuangren",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && player.canCompare(current);
				})
			);
		},
		async cost(event, trigger, player) {
			let goon;
			if (player.needsToDiscard() > 1) {
				goon = player.hasCard(function (card) {
					return card.number > 10 && get.value(card) <= 5;
				});
			} else {
				goon = player.hasCard(function (card) {
					return (card.number >= 9 && get.value(card) <= 5) || get.value(card) <= 3;
				});
			}
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
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
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const { result } = await player.chooseToCompare(target);
			if (result.bool) {
				if (
					game.hasPlayer(function (current) {
						if (!player.canUse("sha", current, false)) {
							return false;
						}
						return get.distance(target, current) <= 1;
					})
				) {
					const result2 = await player
						.chooseTarget("是否对至多两名与其距离为1的角色各使用一张杀？", [1, 2], function (card, player, target) {
							if (!player.canUse("sha", target, false)) {
								return false;
							}
							return get.distance(get.event("identity"), target) <= 1;
						})
						.set("ai", function (target) {
							let player = _status.event.player;
							return get.effect(target, { name: "sha" }, player, player);
						})
						.set("identity", target)
						.forResult();
					if (result2.bool) {
						for (let targetx of result2.targets) {
							await player.useCard({ name: "sha", isCard: true }, targetx, false);
						}
					}
				} else {
					return;
				}
			} else {
				player.addTempSkill("rexianzhen3");
			}
		},
	},
	//李儒
	stdjuece: {
		audio: "rejuece",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.hasPlayer(current => {
				let num = 0;
				current.getHistory("lose", evt => {
					if (evt.cards2?.length > 0) {
						num += evt.cards2.length;
					}
				});
				return num > 1;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "对一名本回合失去过至少两张牌的角色造成1点伤害", function (card, player, target) {
					return _status.event.targets.includes(target);
				})
				.set(
					"targets",
					game.filterPlayer(current => {
						let num = 0;
						current.getHistory("lose", evt => {
							if (evt.cards2?.length > 0) {
								num += evt.cards2.length;
							}
						});
						return num > 1;
					})
				)
				.set("ai", target => {
					var player = _status.event.player;
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.damage();
		},
	},
	stdmieji: {
		audio: "remieji",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", { type: ["trick", "delay"], color: "black" });
		},
		filterCard(card) {
			return get.color(card) == "black" && get.type(card, "trick") == "trick";
		},
		filterTarget(card, player, target) {
			return target != player;
		},
		discard: false,
		delay: false,
		check(card) {
			return 8 - get.value(card);
		},
		lose: false,
		async content(event, trigger, player) {
			await player.give(event.cards, event.target);
			await player.discardPlayerCard(event.target, "he", [1, 2]);
		},
		ai: {
			order: 9,
			result: {
				target: -1,
			},
		},
	},
	//王允
	stdyunji: {
		audio: "jingong",
		enable: "chooseToUse",
		filterCard(card, player) {
			return get.type(card) == "equip";
		},
		position: "hes",
		viewAs: { name: "jiedao" },
		viewAsFilter(player) {
			return player.countCards("hes", { type: "equip" });
		},
		prompt: "将一张装备牌当借刀杀人使用",
		check(card) {
			const val = get.value(card);
			return 5 - val;
		},
	},
	stdzongji: {
		audio: "wylianji",
		trigger: {
			global: "damageEnd",
		},
		filter(event, player) {
			if (!event.card || !["sha", "juedou"].includes(event.card.name)) {
				return false;
			}
			if (!event.player.isIn() || !event.source || !event.source.isIn()) {
				return false;
			}
			return event.player.countCards("he") || event.source.countCards("he");
		},
		check(event, player) {
			let eff1 = get.effect(event.player, { name: "guohe_copy2" }, player, player),
				eff2 = get.effect(event.source, { name: "guohe_copy2" }, player, player);
			return eff1 + eff2 > 0;
		},
		logTarget(event) {
			return [event.player, event.source];
		},
		async content(event, trigger, player) {
			if (trigger.player.countCards("he")) {
				await player.discardPlayerCard(trigger.player, "he", true);
			}
			if (trigger.source.countCards("he")) {
				await player.discardPlayerCard(trigger.source, "he", true);
			}
		},
	},
	//四象封印·太阴
	//华歆
	stdyuanqing: {
		audio: "yuanqing",
		trigger: {
			player: "phaseEnd",
		},
		getCards(player) {
			let cards = [];
			player.getHistory("lose", evt => {
				if (evt.cards2 && evt.cards2.some(i => get.position(i) == "d")) {
					cards.addArray(evt.cards2.filter(i => get.position(i) == "d"));
				}
			});
			return cards;
		},
		filter(event, player) {
			let targets = lib.skill.stdyuanqing.logTarget(event, player);
			return targets && targets.length;
		},
		logTarget(event, player) {
			return game.filterPlayer(current => {
				let cards = lib.skill.stdyuanqing.getCards(current);
				return cards && cards.length;
			});
		},
		async content(event, trigger, player) {
			for (const target of event.targets) {
				let cards = lib.skill.stdyuanqing.getCards(target);
				if (!cards.length) {
					continue;
				}
				const result = await target.chooseButton(["获得其中一张牌", cards], true).forResult();
				if (result.bool) {
					await target.gain(result.links, "gain2");
				}
			}
		},
	},
	stdshuchen: {
		audio: "shuchen",
		enable: "chooseToUse",
		viewAsFilter(player) {
			return player != _status.currentPhase && player.countCards("h") > player.getHandcardLimit();
		},
		filterCard: true,
		position: "h",
		selectCard() {
			const player = get.player();
			return player.countCards("h") - player.getHandcardLimit();
		},
		viewAs: {
			name: "tao",
		},
		prompt: "将超出手牌上限的手牌当桃使用",
		check(card) {
			return 15 - get.value(card);
		},
	},
	//玩姬
	stdqianchong: {
		mod: {
			cardUsable(card, player) {
				if (player.countCards("e") % 2 != 0) {
					return Infinity;
				}
			},
			targetInRange(card, player) {
				if (player.countCards("e") % 2 == 0) {
					return true;
				}
			},
		},
	},
	stdshangjian: {
		trigger: {
			player: "phaseJieshuBegin",
		},
		audio: "xinfu_shangjian",
		filter(event, player) {
			let num = 0,
				cards = [];
			player.getHistory("lose", evt => {
				if (evt.cards2) {
					num += evt.cards2.length;
				}
				if (evt.cards2.some(i => get.position(i) == "d")) {
					cards.addArray(evt.cards2.filter(i => get.position(i) == "d"));
				}
			});
			return cards.length && num > 0 && num <= player.hp;
		},
		async cost(event, trigger, player) {
			let cards = [];
			player.getHistory("lose", evt => {
				if (evt.cards2 && evt.cards2.some(i => get.position(i) == "d")) {
					cards.addArray(evt.cards2.filter(i => get.position(i) == "d"));
				}
			});
			const result = await player
				.chooseButton(["尚俭：选择获得其中一张牌", cards])
				.set("ai", button => {
					return get.value(button.link, get.event("player"));
				})
				.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.links,
			};
		},
		async content(event, trigger, player) {
			await player.gain(event.cost_data, "gain2");
		},
	},
	//王司徒
	stdgushe: {
		audio: "gushe",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			let num = 1,
				target = event.target;
			while (num > 0 && player.canCompare(target)) {
				num--;
				let winner = [],
					failure = [];
				let { result } = await player.chooseToCompare(target);
				if (result.bool) {
					failure.push(target);
					target.chat(lib.skill.gushe.chat.randomGet());
					await player.draw();
				} else if (result.tie) {
					failure = [player, target];
				} else {
					failure.push(player);
					target.chat(lib.skill.gushe.chat.randomGet());
					await target.draw();
				}
				if (player.canCompare(target)) {
					for (let loser of failure) {
						let choice = loser.countCards("h", card => get.value(card) <= 6 && card.number > 10) > 0;
						const {
							result: { bool },
						} = await loser.chooseBool("是否与其再次拼点？").set("choice", choice);
						if (bool) {
							num++;
						}
					}
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					let hs = player.getCards("h");
					if (hs.some(card => get.value(card) <= 6 && card.number > 10) || (player.getHp() < 2 && player.getHp() + player.countCards("h", { name: ["tao", "jiu"] }) > 2) || (player.getHp() > 1 && player.getHp() + player.countCards("h", { name: "tao" }) > 2)) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	stdjici: {
		audio: "jici",
		trigger: {
			player: "compare",
			target: "compare",
		},
		filter(event, player) {
			if (event.player == player && event.iwhile) {
				return false;
			}
			return true;
		},
		check(event, player) {
			return (player.getHp() < 2 && player.getHp() + player.countCards("h", { name: ["tao", "jiu"] }) > 2) || (player.getHp() > 1 && player.getHp() + player.countCards("h", { name: "tao" }) > 2);
		},
		async content(event, trigger, player) {
			await player.loseHp();
			if (player == trigger.player) {
				trigger.num1 = 13;
			} else {
				trigger.num2 = 13;
			}
			game.log(player, "的拼点牌点数为13");
		},
	},
	//钟会
	stdxingfa: {
		audio: "gzpaiyi",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return (
				player.getHp() <= player.countCards("h") &&
				game.hasPlayer(function (current) {
					return current != player;
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "对一名其他角色造成1点伤害", function (card, player, target) {
					return target != player;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await event.targets[0].damage("nocard");
		},
		ai: {
			expose: 0.25,
			threaten: 1.7,
		},
	},
	//刘璋
	stdyinge: {
		audio: "yinlang",
		usable: 1,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return player != target && target.countCards("he");
		},
		async content(event, trigger, player) {
			const target = event.target;
			await target.chooseToGive(1, "he", player, true);
			let targets = game.filterPlayer(current => {
				if (!target.canUse({ name: "sha", isCard: true }, current, false)) {
					return false;
				}
				if (current == player) {
					return true;
				}
				return player.inRange(current);
			});
			if (!targets.length) {
				return;
			}
			const result = await target
				.chooseTarget("选择使用杀的目标", true)
				.set("useTargets", targets)
				.set("filterTarget", (card, player, target) => {
					let targets = get.event("useTargets");
					return targets.includes(target);
				})
				.set("ai", target => {
					return get.effect(target, { name: "sha", isCard: true }, get.player(), get.player());
				})
				.forResult();
			if (result.bool) {
				await target.useCard({ name: "sha", isCard: true }, result.targets);
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					return target.countCards("he") > 2 ? 1 : 0;
				},
			},
		},
	},
	stdshiren: {
		audio: "xiusheng",
		trigger: {
			target: "useCardToTargeted",
		},
		filter(event, player) {
			return event.card.name == "sha" && event.player != player;
		},
		usable: 1,
		logTarget: "player",
		async content(event, trigger, player) {
			await player.draw(2);
			await player.chooseToGive(event.targets[0], "he", true);
		},
	},
	stdjuyi: {
		zhuSkill: true,
		trigger: {
			player: "damageBegin4",
		},
		filter(event, player) {
			if (!event.source || event.source == player || !player.countCards("he")) {
				return false;
			}
			if (player.hasHistory("damage", evt => evt.source && evt.source == event.source)) {
				return false;
			}
			return event.source.group == "qun" && !player.getStorage("stdjuyi").includes(event.source);
		},
		async cost(event, trigger, player) {
			const result = await trigger.source
				.choosePlayerCard(player, "he", get.prompt(event.skill, player), "据益：是否获得" + get.translation(player) + "一张牌并防止此次伤害？")
				.set("ai", button => {
					if (get.event("eff") > 0) {
						return 0;
					}
					return get.value(button.link);
				})
				.set("eff", get.damageEffect(player, trigger.source, trigger.source))
				.forResult();
			event.result = {
				bool: result.bool,
				cards: result.links,
				targets: [trigger.source],
			};
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.give(event.cards, target);
			trigger.cancel();
			if (!player.getStorage("stdjuyi").length) {
				player.when({ global: "phaseEnd" }).then(() => {
					delete player.storage.stdjuyi;
				});
			}
			player.markAuto("stdjuyi", target);
		},
	},
	//薛总
	stdfunan: {
		audio: "funan",
		trigger: {
			target: "shaMiss",
			global: "eventNeutralized",
		},
		usable: 1,
		filter(event, player, name) {
			if (event.type != "card" || event.player == player) {
				return false;
			}
			if (name != "shaMiss" && event._neutralize_event.player != player) {
				return false;
			}
			return event.cards && event.cards.someInD();
		},
		async content(event, trigger, player) {
			await player.gain(trigger.cards.filterInD(), "gain2");
		},
	},
	stdxunjie: {
		audio: "jiexun",
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					return target.countCards("h");
				})
				.set("ai", function (target) {
					const player = _status.event.player;
					let eff = get.effect(target, { name: "guohe_copy2" }, player, player);
					if (target == player) {
						return player.countCards("h", { suit: "diamod" }) ? 2 : -2;
					}
					return eff * (target.countCards("h") > 4 ? -1 : 1);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.chooseToDiscard("h", 1, true)
				.set("ai", card => {
					if (get.suit(card) == "diamond") {
						return 11 - get.value(card);
					}
					return 5 - get.value(card);
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			if (get.suit(result.cards[0]) == "diamond") {
				await target.draw(2);
			}
		},
	},
	//徐庶
	stdwuyan: {
		audio: "wuyan",
		trigger: {
			player: "useCard",
		},
		forced: true,
		filter(event, player) {
			if (!event.cards || event.cards.length != 1 || get.type2(event.cards[0]) != "trick") {
				return false;
			}
			return event.card.name == "wuxie";
		},
		async content() {},
		mod: {
			cardname(card, player) {
				let info = lib.card[card.name];
				if (info && ["trick", "delay"].includes(info.type)) {
					return "wuxie";
				}
			},
		},
	},
	stdjujian: {
		audio: "jujian",
		trigger: { player: "useCardAfter" },
		usable: 1,
		filter(event, player) {
			return event.cards && event.cards.length && event.card.name == "wuxie";
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					return target.getUseValue(_status.event.getTrigger().cards[0]) * get.attitude(player, target);
				})
				.forResult();
			event.result.cards = trigger.cards;
		},
		async content(event, trigger, player) {
			await event.targets[0].gain(event.cards, "gain2");
		},
	},
	//牢彭羕
	stdxiaofan: {
		audio: "olxiaofan",
		trigger: {
			player: "useCardAfter",
		},
		forced: true,
		filter(event, player) {
			const num = Math.min(3, lib.skill.olxiaofan.getNum(player)),
				pos = "jeh".slice(0, num);
			return num > 0 && player.countCards(pos);
		},
		async content(event, trigger, player) {
			const num = Math.min(3, lib.skill.olxiaofan.getNum(player)),
				pos = "jeh".slice(0, num);
			let index = 0;
			while (index < num) {
				const posi = pos[index];
				const hs = player.countCards(posi);
				if (hs > 0) {
					await player.chooseToDiscard(hs, posi, true);
				}
				index++;
			}
		},
		ai: {
			effect: {
				player_use(card, player) {
					if (get.type(card) == "equip") {
						return [0, -5];
					}
				},
			},
			neg: true,
		},
	},
	stdtuishi: {
		audio: "oltuishi",
		mod: {
			wuxieJudgeEnabled: () => false,
			wuxieEnabled: () => false,
			cardEnabled: card => {
				if (card.name == "wuxie") {
					return false;
				}
			},
			aiValue: (player, card, val) => {
				if (card.name == "wuxie") {
					return 0;
				}
				var num = get.number(card);
				if (typeof get.strNumber(num, false) === "string") {
					return 0;
				}
			},
			aiUseful: (player, card, val) => {
				if (card.name == "wuxie") {
					return 0;
				}
				var num = get.number(card);
				if (typeof get.strNumber(num, false) === "string") {
					return 0;
				}
			},
			aiOrder: (player, card, order) => {
				var num = get.number(card);
				if (typeof get.strNumber(num, false) === "string") {
					return 0;
				}
				return order;
			},
		},
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			return typeof get.strNumber(get.number(event.card), false) === "string";
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.targets.length = 0;
			trigger.all_excluded = true;
			game.log(trigger.card, "被无效了");
		},
	},
	//牢赵云
	oldjuejing: {
		audio: "xinjuejing",
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed && player.getHp() < player.maxHp;
		},
		forced: true,
		content() {
			trigger.num += player.getDamagedHp();
		},
		mod: {
			maxHandcard: (player, num) => num + 2,
			aiOrder(player, card, num) {
				if (num <= 0 || !player.isPhaseUsing() || !get.tag(card, "recover")) {
					return num;
				}
				if (player.needsToDiscard() > 1) {
					return num;
				}
				return 0;
			},
		},
	},
	oldlonghun: {
		audio: "relonghun",
		inherit: "xinlonghun",
		prompt: () => `将${get.cnNumber(Math.max(1, get.player().getHp()))}张♦牌当做杀，♥牌当做桃，♣牌当做闪，♠牌当做无懈可击使用或打出`,
		selectCard: () => Math.max(1, get.player().getHp()),
		complexCard: true,
		log: false,
		precontent() {
			player.logSkill("oldlonghun");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				var name;
				switch (tag) {
					case "respondSha":
						name = "diamond";
						break;
					case "respondShan":
						name = "club";
						break;
					case "save":
						name = "heart";
						break;
				}
				if (!player.countCards("hes", { suit: name })) {
					return false;
				}
			},
			order(item, player) {
				if (player && _status.event.type == "phase") {
					var max = 0;
					var list = ["sha", "tao"];
					var map = { sha: "diamond", tao: "heart" };
					for (var i = 0; i < list.length; i++) {
						var name = list[i];
						if (
							player.countCards("hes", function (card) {
								return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
							}) >= Math.max(1, player.getHp()) &&
							player.getUseValue({
								name: name,
								nature: name == "sha" ? "fire" : null,
							}) > 0
						) {
							var temp = get.order({
								name: name,
								nature: name == "sha" ? "fire" : null,
							});
							if (temp > max) {
								max = temp;
							}
						}
					}
					max /= 1.1;
					return max;
				}
				return 2;
			},
		},
		hiddenCard(player, name) {
			if (name == "wuxie" && _status.connectMode && player.countCards("hes") > 0) {
				return true;
			}
			if (name == "wuxie") {
				return player.countCards("hes", { suit: "spade" }) >= Math.max(1, get.player().getHp());
			}
			if (name == "tao") {
				return player.countCards("hes", { suit: "heart" }) >= Math.max(1, get.player().getHp());
			}
		},
	},
	//马良
	stdxiemu: {
		audio: "xiemu",
		global: "stdxiemu_global",
		subSkill: {
			global: {
				audio: "xiemu",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					if (!player.countCards("he", card => get.type(card) == "basic")) {
						return false;
					}
					return game.hasPlayer(current => current.hasSkill("stdxiemu") && current != player);
				},
				filterTarget(card, player, target) {
					return target.hasSkill("stdxiemu") && target != player;
				},
				selectTarget() {
					const num = game.countPlayer(current => current.hasSkill("stdxiemu") && current != get.player());
					return num > 1 ? 1 : -1;
				},
				filterCard(card) {
					return get.type(card) == "basic";
				},
				position: "he",
				check(card) {
					return 4 - get.value(card);
				},
				prompt() {
					const list = game.filterPlayer(current => {
						return current.hasSkill("stdxiemu");
					});
					return `将一张牌交给${get.translation(list)}${list.length > 1 ? "中的一人" : ""}，然后你本回合攻击范围+1。`;
				},
				log: false,
				discard: false,
				lose: false,
				async content(event, trigger, player) {
					const card = event.cards[0],
						target = event.target;
					player.logSkill("stdxiemu", target);
					await player.showCards(card, get.translation(player) + "发动了【协穆】");
					await player.give(card, target, true);
					player.addTempSkill("stdxiemu_range");
					player.addMark("stdxiemu_range", 1, false);
				},
				ai: {
					order: 7,
					result: {
						target: 1,
					},
				},
			},
			range: {
				charlotte: true,
				onremove: true,
				mod: {
					attackRange(player, num) {
						return num + player.countMark("stdxiemu_range");
					},
				},
				intro: {
					content: "本回合攻击范围+#",
				},
			},
		},
	},
	stdnaman: {
		audio: "naman",
		enable: "phaseUse",
		usable: 1,
		viewAs: {
			name: "nanman",
		},
		viewAsFilter(player) {
			if (!player.countCards("he", card => get.type(card) == "basic")) {
				return false;
			}
		},
		filterCard(card) {
			return get.type(card) == "basic";
		},
		position: "he",
		selectCard: [1, Infinity],
		selectTarget() {
			return ui.selected.cards.length;
		},
		complexSelect: true,
	},
	//蒋琬
	stdruwu: {
		audio: "olxvfa",
		enable: "chooseToUse",
		filter(event, player) {
			if (!event.stdruwu || !event.stdruwu.length) {
				return false;
			}
			if (event.filterCard(get.autoViewAs({ name: "juedou" }, "unsure"), player, event)) {
				return true;
			}
			if (event.filterCard(get.autoViewAs({ name: "wuzhong" }, "unsure"), player, event)) {
				return true;
			}
			return false;
		},
		onChooseToUse(event) {
			if (game.online || event.stdruwu) {
				return;
			}
			var list = event.player.getCards("e");
			var history = game.getGlobalHistory("everything", evt => evt.player == event.player && evt.name == "equip");
			list = list.filter(card => {
				return !history.some(evt => evt.cards && evt.cards.includes(card));
			});
			event.set("stdruwu", list);
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				if (event.filterCard(get.autoViewAs({ name: "juedou" }, "unsure"), player, event)) {
					list.push(["锦囊", "", "juedou"]);
				}
				if (event.filterCard(get.autoViewAs({ name: "wuzhong" }, "unsure"), player, event)) {
					list.push(["锦囊", "", "wuzhong"]);
				}
				return ui.create.dialog("儒武", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				var player = _status.event.player;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					filterCard(card) {
						return _status.event.stdruwu.includes(card);
					},
					position: "e",
					audio: "olxvfa",
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					viewAs: { name: links[0][2] },
				};
			},
			prompt(links, player) {
				return "将装备区里的一张牌当做" + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			var list = player.getCards("e");
			var history = game.getGlobalHistory("everything", evt => evt.player == player && evt.name == "equip");
			list = list.filter(card => {
				return !history.some(evt => evt.cards && evt.cards.includes(card));
			});
			if (!list.length) {
				return false;
			}
			return ["juedou", "wuzhong"].includes(name);
		},
		ai: {
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
	},
	stdchengshi: {
		audio: "spjincui",
		trigger: {
			global: "die",
		},
		filter(event, player) {
			return event.player != player;
		},
		check(event, player) {
			return event.player.countCards("e") > player.countCards("e");
		},
		logTarget: "player",
		skillAnimation: true,
		limited: true,
		animationColor: "fire",
		seatRelated: "changeSeat",
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.awakenSkill(event.name);
			game.broadcastAll(
				function (target1, target2) {
					game.swapSeat(target1, target2);
				},
				player,
				target
			);
			await player.swapEquip(target);
		},
		mark: true,
		intro: {
			content: "limited",
		},
		init: (player, skill) => (player.storage[skill] = false),
	},
	//孙邵
	stddingyi: {
		audio: "mjdingyi",
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return !event.player.countCards("e");
		},
		async cost(event, trigger, player) {
			event.result = await trigger.player.chooseBool(get.prompt(event.skill), "摸一张牌").forResult();
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			await event.targets[0].draw();
		},
	},
	stdzuici: {
		audio: "mjzuici",
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			if (!event.source) {
				return false;
			}
			return player.canMoveCard(
				null,
				null,
				game.filterPlayer(current => current != event.source),
				event.source
			);
		},
		direct: true,
		async content(event, trigger, player) {
			const next = player.moveCard(
				game.filterPlayer(current => current != trigger.source),
				trigger.source
			);
			next.prompt = get.prompt("stdzuici", trigger.source);
			next.prompt2 = "将场上一张牌移动到其区域内";
			next.logSkill = event.name;
			await next;
		},
	},
	//司马师
	stdjinglve: {
		audio: "jinglve",
		trigger: { global: "phaseDiscardBegin" },
		filter(event, player) {
			return player.countCards("h") > 1 && event.player != player;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), 2)
				.set("ai", card => {
					if (!_status.event.bool) {
						return 0;
					}
					return 5 - get.value(card);
				})
				.set(
					"bool",
					(() => {
						if (get.attitude(player, trigger.player) >= 0) {
							return false;
						}
						const hs = trigger.player.countCards("h"),
							dis = trigger.player.needsToDiscard(0, true, true);
						return hs && dis > 0;
					})()
				)
				.forResult();
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			const cards = event.cards,
				target = event.targets[0];
			await player.showCards(cards, get.translation(player) + "发动了【景略】");
			const next = player.give(cards, target);
			next.gaintag.add("stdjinglve");
			await next;
			trigger.player.addTempSkill("stdjinglve_discard");
			player
				.when({ global: "phaseDiscardEnd" })
				.filter(evt => evt == trigger)
				.then(() => {
					trigger.player.removeSkill("stdjinglve_discard");
					const cards = [];
					game.getGlobalHistory("cardMove", function (evt) {
						if (evt.name == "cardsDiscard") {
							if (evt.getParent("phaseDiscard") == trigger) {
								const moves = evt.cards.filterInD("d");
								cards.addArray(moves);
							}
						}
						if (evt.name == "lose") {
							if (evt.type != "discard" || evt.position != ui.discardPile || evt.getParent("phaseDiscard") != trigger) {
								return;
							}
							const moves = evt.cards.filterInD("d");
							cards.addArray(moves);
						}
					});
					if (cards.length) {
						player.chooseButton(["景略：是否获得本阶段弃置的一张牌？", cards]);
					} else {
						event._result = { bool: false };
					}
				})
				.then(() => {
					if (result.bool) {
						player.gain(result.links, "gain2");
					}
				});
		},
		subSkill: {
			discard: {
				charlotte: true,
				mod: {
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("stdjinglve")) {
							return false;
						}
					},
				},
				onremove(player) {
					player.removeGaintag("stdjinglve");
				},
			},
		},
	},
	//岑昏
	stdjishe: {
		audio: "jishe",
		enable: "phaseUse",
		filter(event, player) {
			return player.getHandcardLimit() > 0;
		},
		locked: false,
		async content(event, trigger, player) {
			player.addTempSkill("stdjishe_limit");
			player.addMark("stdjishe_limit", 1, false);
			player.draw();
		},
		subSkill: {
			limit: {
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("stdjishe_limit");
					},
				},
				onremove: true,
				charlotte: true,
				marktext: "奢",
				intro: {
					content: "手牌上限-#",
				},
			},
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					if (!player.needsToDiscard(1)) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	stdwudu: {
		trigger: {
			global: "damageBegin4",
		},
		filter(event, player) {
			return !event.player.countCards("h");
		},
		logTarget: "player",
		check(event, player) {
			return player.maxHp > 1 && get.damageEffect(event.player, event.source, player) < 0;
		},
		async content(event, trigger, player) {
			trigger.cancel();
			await player.loseMaxHp();
		},
	},
	//公孙渊
	stdhuaiyi: {
		audio: "rehuaiyi",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return player.countCards("h");
		},
		forced: true,
		async content(event, trigger, player) {
			const hs = player.getCards("h");
			await player.showCards(hs, get.translation(player) + "发动了【怀异】");
			const colors = [];
			for (let card of hs) {
				colors.add(get.color(card));
			}
			if (colors.length < 2) {
				return;
			}
			const result = await player
				.chooseControl(colors)
				.set("ai", () => {
					return _status.event.color;
				})
				.set(
					"color",
					(function () {
						return colors.sort((a, b) => {
							return player.countCards("h", { color: a }) - player.countCards("h", { color: b });
						})[0];
					})()
				)
				.forResult();
			const discards = player.getCards("h", { color: result.control });
			if (discards.length) {
				await player.discard(discards);
				if (game.hasPlayer(current => current != player && current.countCards("he"))) {
					const result2 = await player
						.chooseTarget(`获得至多${discards.length}名其他角色各一张牌`, [1, discards.length], true, function (card, player, target) {
							return target != player && target.countCards("he") > 0;
						})
						.set("ai", function (target) {
							const player = get.player();
							return get.effect(target, { name: "shunshou_copy2" }, player, player);
						})
						.forResult();
					await player.gainMultiple(result2.targets.sortBySeat(), "he");
					if (result2.targets.length > 1) {
						await player.loseHp();
					}
				}
			}
		},
	},
	stdfengbai: {
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		zhuSkill: true,
		logTarget: (event, player, triggername, target) => target,
		check(event, player) {
			return get.effect(event.indexedData, { name: "draw" }, player, player) > 0;
		},
		getIndex(event, player) {
			if (!event.getg || !event.getl) {
				return false;
			}
			const cards = event.getg(player);
			return game
				.filterPlayer(current => {
					if (current == player || current.group != "qun") {
						return false;
					}
					const evt = event.getl(current);
					if (!evt || !evt.es) {
						return false;
					}
					game.log(evt.es);
					return evt.es.some(card => cards.includes(card));
				})
				.sortBySeat();
		},
		async content(event, trigger, player) {
			await event.targets[0].draw();
		},
	},
	//刘表
	stdzishou: {
		audio: "zishou",
		trigger: {
			player: "phaseUseBefore",
		},
		check(event, player) {
			return player.countCards("h") + 2 <= player.getHandcardLimit();
		},
		async content(event, trigger, player) {
			await player.draw(game.countGroup());
			trigger.cancel();
		},
		ai: {
			threaten: 1.5,
		},
	},
	stdjujin: {
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			if (!event.source || event.source.group != "qun") {
				return false;
			}
			return player.countCards("he") > 1;
		},
		zhuSkill: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill), 2, "he")
				.set("ai", card => {
					const player = get.player();
					if (get.recoverEffect(player, player, player) <= 0 || player.hp >= player.maxHp) {
						return 0;
					}
					return 5 - get.value(card);
				})
				.set("chooseonly", true)
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			await player.discard(cards);
			if (player.isDamaged()) {
				await player.recover();
			}
		},
	},
	//伏皇后
	stdqiuyuan: {
		audio: "xinqiuyuan",
		inherit: "qiuyuan",
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const { card } = trigger;
			const { result } = await target.chooseToGive(`交给${get.translation(player)}一张牌，或成为${get.translation(card)}的额外目标`, player).set("ai", card => {
				const { player, target } = get.event();
				return get.attitude(player, target) >= 0 ? 1 : -1;
			});
			if (!result?.bool) {
				trigger.getParent().targets.push(target);
				trigger.getParent().triggeredTargets2.push(target);
				game.log(target, "成为了", card, "的额外目标");
			}
		},
	},
	stdzhuikong: {
		audio: "rezhuikong",
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		check(event, player) {
			if (get.attitude(player, event.player) < -2) {
				var cards = player.getCards("h");
				if (cards.length > player.hp) {
					return true;
				}
				for (var i = 0; i < cards.length; i++) {
					var useful = get.useful(cards[i]);
					if (useful < 5) {
						return true;
					}
					if (get.number(cards[i]) > 9 && useful < 7) {
						return true;
					}
				}
			}
			return false;
		},
		filter(event, player) {
			if (!player.canCompare(event.player)) {
				return false;
			}
			return (_status.connectMode && player.countCards("h")) || player.countCards("h", "sha");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt(event.skill, trigger.player), "使用一张【杀】与其拼点", { name: "sha" })
				.set("ai", card => {
					if (_status.event.effect) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set("effect", lib.skill.stdzhuikong.check(trigger, player))
				.forResult();
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const next = player.chooseToCompare(target);
			if (!next.fixedResult) {
				next.fixedResult = {};
			}
			next.fixedResult[player.playerid] = event.cards[0];
			const result = await next.forResult();
			if (result.winner) {
				const card = result[result.winner == player ? "target" : "player"];
				if (!card || !result.winner.hasUseTarget(card)) {
					return;
				}
				await result.winner.chooseUseTarget(card);
			}
		},
	},
	//关兴
	stdwuyou: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const { result } = await player.chooseToCompare(target);
			if (!result.bool) {
				player.addTempSkill(event.name + "_effect");
				await player.addAdditionalSkills(event.name + "_effect", "new_rewusheng");
			}
			const winner = result.winner;
			if (!winner) {
				return;
			}
			const loser = player == winner ? target : player;
			const juedou = get.autoViewAs({ name: "juedou", isCard: true });
			if (winner.canUse(juedou, loser, false)) {
				await winner.useCard(juedou, loser, false);
			}
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					return get.effect(target, { name: "juedou" }, player, player) * get.attitude(player, target);
				},
			},
		},
		derivation: "new_rewusheng",
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				marktext: "佑",
				intro: {
					content: "视为拥有〖武圣〗",
				},
			},
		},
	},

	//四象封印·少阴
	//孙皓
	stdcanshi: {
		audio: "canshi",
		inherit: "canshi",
		forced: true,
		async content(event, trigger, player) {
			trigger.changeToZero();
			await player.draw(
				Math.max(
					1,
					game.countPlayer(target => {
						if (player.hasSkill("guiming") && target != player && target.group == "wu") {
							return true;
						}
						return target.isDamaged();
					})
				)
			);
			player.addTempSkill("stdcanshi_effect");
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					if (event.card.name != "sha" && get.type(event.card) != "trick") {
						return false;
					}
					return event.target.isDamaged() && player.countCards("he");
				},
				forced: true,
				autodelay: true,
				content() {
					player.chooseToDiscard("he", true);
				},
			},
		},
	},
	//马腾
	stdxiongyi: {
		limited: true,
		audio: "xiongyi",
		enable: "phaseUse",
		filterTarget: true,
		selectTarget: [1, Infinity],
		multitarget: true,
		multiline: true,
		skillAnimation: true,
		animationColor: "thunder",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const targets = event.targets.sortBySeat();
			let keep = true;
			while (true) {
				let stop = false;
				for (const target of targets) {
					let next = target
						.chooseToUse(function (card) {
							const event = get.event();
							if (!lib.filter.cardEnabled(card, event.player, event)) {
								return false;
							}
							return get.name(card) == "sha";
						}, "雄异：是否使用一张不可被响应的【杀】？")
						.set("oncard", card => {
							_status.event.directHit.addArray(game.players);
						});
					if (!keep) {
						next.set("prompt2", "若你不使用，则结束此流程");
					}
					const result = await next.forResult();
					if (!result.bool && !keep) {
						stop = true;
						break;
					}
				}
				if (keep) {
					keep = false;
				}
				if (stop) {
					break;
				}
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (player.hasUnknown()) {
						return 0;
					}
					return target.countCards("hs");
				},
			},
		},
	},
	stdyouji: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.canMoveCard(
				null,
				true,
				game.filterPlayer(i => {
					return i.group == "qun";
				}),
				card => {
					return [3, 4, 6].includes(parseInt(get.subtype(card)?.slice("equip".length)));
				},
				"nojudge"
			);
		},
		direct: true,
		zhuSkill: true,
		content() {
			player
				.moveCard(
					game.filterPlayer(i => {
						return i.group == "qun";
					}),
					card => {
						return [3, 4, 6].includes(parseInt(get.subtype(card)?.slice("equip".length)));
					}
				)
				.set("prompt", get.prompt2("stdyouji"))
				.set("nojudge", true)
				.set("logSkill", "stdyouji");
		},
	},
	//马云禄
	stdfengpo: {
		audio: "fengpo",
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			return (
				event.card?.name == "sha" &&
				[player, event.player].some(target => {
					return target.isIn() && target.countCards("he");
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					const event = get.event().getTrigger();
					return [player, event.player]
						.filter(targetx => {
							return targetx.isIn() && targetx.countCards("he");
						})
						.includes(target);
				})
				.set("ai", target => {
					const player = get.event("player"),
						aim = get.event().getTrigger().player;
					let eff = get.damageEffect(aim, player, player);
					if (aim === player && player.getDiscardableCards(player, "he", card => get.suit(card) == "diamond")) {
						eff /= 4;
					}
					return eff + get.effect(target, { name: "guohe" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.discardPlayerCard(target, "he", true)
				.set("ai", button => {
					const suit = get.suit(button.link);
					return get.event().att * (suit == "diamond" ? 5 : 1) * get.value(button.link, player);
				})
				.set("prompt", "凤魄：弃置" + (target != player ? get.translation(target) : "") + "一张牌")
				.set("prompt2", "若弃置了方片牌，则此伤害+1")
				.set("att", get.sgnAttitude(player, target))
				.forResult();
			if (result.bool) {
				if (result.cards && result.cards.some(i => get.suit(i, target) == "diamond")) {
					player.popup("洗具");
					trigger.increase("num");
				}
			}
		},
	},
	//蒋干
	stddaoshu: {
		audio: "daoshu",
		trigger: { global: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(target => {
				return target != event.player && target.countCards("h");
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					const event = get.event().getTrigger();
					return target != event.player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.event("player");
					if (get.attitude(player, target) >= 0) {
						return 0;
					}
					return 1 / target.countCards("h");
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.tempBanSkill("stddaoshu", "roundStart", false);
			const target = event.targets[0];
			const result = await player.choosePlayerCard(target, "h", true).forResult();
			if (result.bool) {
				const cards = result.cards || [];
				if (cards.length) {
					await player.showCards(cards, get.translation(player) + "发动了【盗书】");
					await trigger.player.gain(cards, target, "give");
					const suits = cards.reduce((list, card) => {
						return list.add(get.suit(card, target));
					}, []);
					if (suits.length) {
						for (const i of [player, trigger.player]) {
							i.addTempSkill("stddaoshu_effect");
							i.markAuto("stddaoshu_effect", suits);
						}
					}
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("stddaoshu_effect").includes(get.suit(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (player.getStorage("stddaoshu_effect").includes(get.suit(card))) {
							return false;
						}
					},
				},
				intro: { content: "不能使用$花色的牌" },
			},
		},
	},
	stddaizui: {
		audio: "spdaizui",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.isTempBanned("stddaoshu");
		},
		forced: true,
		content() {
			delete player.storage.temp_ban_stddaoshu;
			player.popup("盗书");
			game.log(player, "重置了技能", "#g【盗书】");
		},
		ai: {
			combo: "stddaoshu",
		},
	},
	//周处
	stdxiongxia: {
		audio: "xianghai",
		enable: "chooseToUse",
		filterCard: true,
		selectCard: 2,
		position: "hes",
		viewAs: { name: "juedou" },
		selectTarget: 2,
		viewAsFilter(player) {
			if (player.countCards("hes") < 2) {
				return false;
			}
		},
		check(card) {
			if (get.name(card) == "sha") {
				return 4 - get.value(card);
			}
			return 7.5 - get.value(card);
		},
		onuse(links, player) {
			player.addTempSkill("stdxiongxia_effect");
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return (
						event.skill == "stdxiongxia" &&
						(event.targets || []).every(target => {
							return target.getHistory("damage", evt => {
								return evt.card && evt.card == event.card;
							}).length;
						})
					);
				},
				forced: true,
				popup: false,
				content() {
					player.tempBanSkill("stdxiongxia");
				},
			},
		},
	},
	//吕玲绮
	stdhuizhan: {
		audio: "guowu",
		trigger: { player: "useCard2" },
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			return game.hasPlayer(target => {
				return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2(event.skill),
					(card, player, target) => {
						const event = get.event().getTrigger();
						return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
					},
					[1, 2]
				)
				.set("ai", target => {
					const player = get.event("player"),
						event = get.event().getTrigger();
					return get.effect(target, event.card, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.targets.addArray(event.targets);
			player.addTempSkill("stdhuizhan_effect");
			trigger.card.stdhuizhan = true;
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { global: "chooseToUseBegin" },
				filter(event, player) {
					if (event._stdhuizhan_effect) {
						return false;
					}
					const evt = event.getParent(2);
					return evt.card && evt.card.stdhuizhan;
				},
				forced: true,
				popup: false,
				forceDie: true,
				async content(event, trigger, player) {
					trigger._stdhuizhan_effect = true;
					const targets = trigger
						.getParent(2)
						.targets.filter(i => {
							return i != trigger.player;
						})
						.sortBySeat();
					if (targets.length) {
						for (const target of targets) {
							if (!target.isIn()) {
								continue;
							}
							const next = target.chooseToUse("挥战：是否替" + get.translation(trigger.player) + "使用一张【闪】？", { name: "shan" });
							next.set("ai", () => {
								const event = _status.event;
								return get.attitude(event.player, event.source) - 2;
							});
							next.set("skillwarn", "替" + get.translation(player) + "打出一张闪");
							next.autochoose = lib.filter.autoRespondShan;
							next.set("source", player);
							const result = await next.forResult();
							if (result.bool) {
								trigger.result = { bool: true, card: { name: "shan", isCard: true, cards: result.cards.slice() }, cards: result.cards.slice() };
								trigger.responded = true;
								trigger.animate = false;
								break;
							}
						}
					}
				},
			},
		},
	},
	//羊祜
	stdmingfa: {
		audio: "dcmingfa",
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => target.getHp() > 1);
		},
		filterTarget(card, player, target) {
			return target.getHp() > 1;
		},
		async content(event, trigger, player) {
			const target = event.target;
			await target.damage();
			if (target.isIn()) {
				player.tempBanSkill("stdmingfa", "forever");
				player.addSkill("stdmingfa_used");
				player.markAuto("stdmingfa_used", [target]);
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				trigger: { global: ["dieAfter", "recoverAfter"] },
				filter(event, player) {
					return player.getStorage("stdmingfa_used").includes(event.player);
				},
				forced: true,
				popup: false,
				content() {
					delete player.storage[`temp_ban_stdmingfa`];
					player.popup("明伐");
					game.log(player, "恢复了技能", "#g【明伐】");
					player.removeSkill("stdmingfa_used");
				},
			},
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					return get.sgn(get.attitude(player, target)) * get.damageEffect(target, player, player);
				},
			},
		},
	},
	//骆统
	stdrenzheng: {
		audio: "renzheng",
		trigger: { global: ["damageCancelled", "damageZero"] },
		filter(event, player, name) {
			if (!_status.currentPhase?.isIn()) {
				return false;
			}
			if (name == "damageCancelled") {
				return true;
			}
			return event.change_history.some(i => i < 0);
		},
		forced: true,
		logTarget: () => _status.currentPhase,
		content() {
			_status.currentPhase.draw();
		},
	},
	stdjinjian: {
		audio: "jinjian",
		trigger: {
			source: "damageBegin2",
			player: "damageBegin4",
		},
		filter(event, player, name) {
			return !player.getStorage("stdjinjian_used").includes(name.slice(11));
			// return !player.hasSkill(`stdjinjian_effect${name.slice(11)}`);
		},
		prompt2(event, player, name) {
			return `防止即将${name == "damageBegin2" ? "造成" : "受到"}的伤害`;
		},
		check(event, player) {
			return get.damageEffect(event.player, event.source, player) < 0;
		},
		async content(event, trigger, player) {
			trigger.cancel();
			player.addTempSkill("stdjinjian_used");
			player.markAuto("stdjinjian_used", event.triggername.slice(11));
			player.addTempSkill(`stdjinjian_effect${event.triggername.slice(11)}`);
			player.addMark(`stdjinjian_effect${event.triggername.slice(11)}`, 1, false);
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			effect2: {
				trigger: { source: "damageBegin1" },
				forced: true,
				charlotte: true,
				onremove: true,
				async content(event, trigger, player) {
					const num = player.countMark(event.name);
					trigger.num += num;
					player.removeMark(event.name, num, false);
				},
				marktext: "进",
				intro: {
					content: "下次造成的伤害+$",
				},
			},
			effect4: {
				trigger: { player: "damageBegin3" },
				forced: true,
				charlotte: true,
				onremove: true,
				async content(event, trigger, player) {
					const num = player.countMark(event.name);
					trigger.num += num;
					player.removeMark(event.name, num, false);
				},
				marktext: "谏",
				intro: {
					content: "下次受到的伤害+$",
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
					if (player._stdjinjian_tmp) {
						return;
					}
					if (_status.event.getParent("useCard", true) || _status.event.getParent("_wuxie", true)) {
						return;
					}
					if (get.tag(card, "damage")) {
						if (target.hasSkill("stdjinjian_effect4")) {
							return [1, -2];
						} else if (!target.getStorage("stdjinjian_used").includes("4")) {
							if (get.attitude(player, target) > 0) {
								return [0, 0.2];
							}
							if (get.attitude(player, target) < 0) {
								var sha = player.getCardUsable({ name: "sha" });
								player._stdjinjian_tmp = true;
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
								delete player._stdjinjian_tmp;
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
	//李傕
	stdxiongsuan: {
		audio: "xinfu_langxi",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.isMaxHp();
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					"请选择【凶算】的目标",
					lib.translate.stdxiongsuan_info,
					(card, player, target) => {
						return target.getHp() == player.getHp();
					},
					[1, Infinity],
					true
				)
				.set("ai", target => {
					const player = get.event("player");
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		locked: true,
		async content(event, trigger, player) {
			for (const i of event.targets) {
				await i.damage();
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (target.hp <= 1 || !target.hasFriend() || !_status.currentPhase || !get.tag(card, "damage")) {
						return;
					}
					let hp = target.hp - 1;
					if (
						game.hasPlayer(cur => {
							return cur.hp > hp;
						})
					) {
						return;
					}
					let ori = game.countPlayer(cur => {
							return cur.hp === hp + 1 && get.attitude(target, cur) <= 0;
						}),
						now = game.countPlayer(cur => {
							return cur.hp === hp && get.attitude(target, cur) <= 0;
						}),
						seat = 1,
						tar = _status.currentPhase.next;
					while (tar !== target) {
						if (get.attitude(target, tar) <= 0) {
							seat++;
						}
						tar = tar.next;
					}
					return [1, (2 * (now - ori)) / seat];
				},
			},
		},
	},
	//程普
	stdchunlao: {
		audio: "chunlao",
		trigger: { player: "phaseDiscardEnd" },
		filter(event, player) {
			return (
				(event.cards || []).length >= 2 &&
				game.hasPlayer(target => {
					return target != player && target.countCards("h");
				})
			);
		},
		async cost(event, trigger, player) {
			const cards = trigger.cards;
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "用" + get.translation(cards) + "交换一名其他角色的手牌", (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					return get.event("cards").length - target.countCards("h") - 0.5;
				})
				.set("cards", cards)
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = trigger.cards,
				target = event.targets[0];
			await target.loseToDiscardpile(target.getCards("h"));
			await target.gain(cards, "gain2").set("giver", player);
			if (player.isDamaged()) {
				const bool = await target
					.chooseBool("是否令" + get.translation(player) + "回复1点体力？")
					.set("choice", get.recoverEffect(player, target, target) > 0)
					.forResult("bool");
				if (bool) {
					target.line(player);
					await player.recover(target);
				}
			}
		},
	},
	//文鸯
	stdquedi: {
		audio: "dbquedi",
		enable: "chooseToUse",
		filterCard: { name: "sha" },
		position: "hes",
		viewAs: { name: "juedou" },
		viewAsFilter(player) {
			if (!player.countCards("hes", { name: "sha" })) {
				return false;
			}
		},
		check(card) {
			return 6 - get.value(card);
		},
	},
	//邓芝
	//只因盟
	stdzhiyinmeng: {
		audio: "weimeng",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterTarget: lib.filter.notMe,
					filterCard: true,
					position: "he",
					selectCard: [1, Infinity],
					complexCard: true,
					complexTarget: true,
					complexSelect: true,
					ai1(card) {
						if (ui.selected.cards.length && card.name != "du") {
							return 0;
						}
						if (card.name == "du") {
							return 114514;
						}
						return 5 - get.value(card);
					},
					ai2(target) {
						if (!ui.selected.cards.length) {
							return 0;
						}
						const player = get.event("player"),
							att = get.attitude(player, target);
						if (ui.selected.cards[0].name == "du") {
							if (!target.hasSkillTag("nodu")) {
								return -att;
							}
							return -0.00001 * att;
						}
						return att;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.give(event.cards, target);
			await target.chooseToGive("he", [1, Infinity], player);
		},
	},
	stdhehe: {
		audio: "jianliang",
		trigger: { player: "phaseDrawEnd" },
		filter(event, player) {
			return game.hasPlayer(target => {
				return target != player && target.countCards("h") == player.countCards("h");
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2(event.skill),
					(card, player, target) => {
						return target != player && target.countCards("h") == player.countCards("h");
					},
					[1, 2]
				)
				.set("ai", target => {
					const player = get.event("player");
					return get.effect(target, { name: "draw" }, player, player);
				})
				.forResult();
		},
		locked: true,
		async content(event, trigger, player) {
			await game.asyncDraw(event.targets);
			await game.delayx();
		},
	},
	//张翼
	stdzhiyi: {
		audio: "zhiyi",
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return player.getHistory("useCard", evt => {
				return evt.card.name == "sha";
			}).length;
		},
		forced: true,
		async content(event, trigger, player) {
			const result = await player.chooseUseTarget("执义：视为使用【杀】，或摸一张牌", { name: "sha" }, false).forResult();
			if (!result.bool) {
				await player.draw();
			}
		},
	},
	//大魏汉尼拔
	stdshefu: {
		audio: "shefu",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt(event.skill), "将一张手牌置于武将牌上", "h")
				.set("ai", card => {
					return (
						(lib.card.list
							.slice()
							.map(list => list[2])
							.filter(name => {
								return card.name == name;
							}).length -
							1) /
						(get.value(card) || 0.5)
					);
				})
				.forResult();
		},
		content() {
			player.addToExpansion(event.cards, player, "giveAuto").gaintag.add("stdshefu");
		},
		marktext: "伏",
		intro: {
			markcount: "expansion",
			mark(dialog, _, player) {
				const cards = player.getExpansions("stdshefu");
				if (player.isUnderControl(true) && cards.length) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张“伏兵”";
				}
			},
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: "stdshefu_effect",
		subSkill: {
			effect: {
				audio: "shefu",
				trigger: { global: "useCard" },
				filter(event, player) {
					return player.getExpansions("stdshefu").some(card => card.name == event.card.name);
				},
				async cost(event, trigger, player) {
					let result = await player
						.chooseButton(["###" + get.prompt("stdshefu") + "###弃置一张同名牌，令此牌无效", player.getExpansions("stdshefu")])
						.set("filterButton", button => {
							return button.link.name == get.event().getTrigger().card.name;
						})
						.set("ai", button => {
							return get.event("goon") ? 1 : 0;
						})
						.set("goon", lib.skill.sbkanpo.subSkill.kanpo.check(trigger, player))
						.forResult();
					if (result.bool && result.links) {
						result.cards = result.links.slice();
						delete result.links;
					}
					event.result = result;
				},
				async content(event, trigger, player) {
					await player.loseToDiscardpile(event.cards);
					trigger.targets.length = 0;
					trigger.all_excluded = true;
				},
			},
		},
	},
	stdyibing: {
		audio: "benyu",
		trigger: { global: "dying" },
		filter(event, player) {
			return event.player != player && event.player.countCards("eh");
		},
		logTarget: "player",
		check(event, player) {
			return get.effect(event.player, { name: "shunshou_copy2" }, player, player) > 0;
		},
		async content(event, trigger, player) {
			await player.gainPlayerCard(trigger.player, "he", `获得${get.translation(trigger.player)}一张牌`, true);
		},
	},
	//樊玉凤
	stdbazhan: {
		audio: "bazhan",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		position: "h",
		filterTarget(card, player, target) {
			return target != player && target.hasSex("male");
		},
		discard: false,
		lose: false,
		delay: false,
		usable: 2,
		check(card) {
			if (card.name == "du") {
				return 114514;
			}
			return 5 - get.value(card);
		},
		async content(event, trigger, player) {
			const target = event.target;
			await player.showCards(event.cards);
			await player.give(event.cards, target, "visible");
			if (target.countCards("h")) {
				await target
					.chooseToGive(player, (card, player) => {
						return get.type2(card) != get.type2(get.event("cards")[0]);
					})
					.set("cards", event.cards);
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					const cardxx = ui.selected.cards[0];
					if (cardxx.name == "du") {
						return -100;
					}
					if (!player.hasSkill("stdzhanying")) {
						return 1;
					}
					if (target.countMark("stdzhanying_count") == target.countCards("h") + 1) {
						const cards = player.getCards("hs", card => {
							return card != cardxx && get.tag(card, "damage") && player.canUse(card, target) && get.effect(target, card, player, player) > 0;
						});
						if (!cards.length) {
							return 1;
						}
						let cardx = cards.filter(card => get.name(card) == "sha");
						cardx.sort((a, b) => get.effect(target, b, player, player) - get.effect(target, a, player, player));
						cardx = cardx.slice(Math.min(cardx.length, player.getCardUsable("sha")), cardx.length);
						cards.removeArray(cardx);
						return -cards.reduce((sum, card) => sum + get.effect(target, card, player, player), 0);
					}
					return 1;
				},
			},
		},
	},
	stdzhanying: {
		audio: "jiaoying",
		trigger: { global: "damageBegin2" },
		filter(event, player) {
			if (_status.currentPhase !== player) {
				return false;
			}
			return event.player.countCards("h") > event.player.countMark("stdzhanying_count");
		},
		forced: true,
		logTarget: "player",
		content() {
			trigger.increase("num");
		},
		global: "stdzhanying_mark",
		subSkill: {
			count: {
				charlotte: true,
				onremove: true,
				intro: {
					markcount: storage => (storage || 0).toString(),
					content: "本回合开始时手牌数为#张",
				},
			},
			mark: {
				charlotte: true,
				trigger: { global: "phaseBegin" },
				filter(event, player) {
					return event.player.hasSkill("stdzhanying", null, null, false);
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player.addTempSkill("stdzhanying_count");
					player.addMark("stdzhanying_count", player.countCards("h"), false);
				},
				mod: {
					cardEnabled(card, player) {
						if (!_status.currentPhase || !_status.currentPhase.hasSkill("stdzhanying")) {
							return;
						}
						if (get.color(card) == "red" && player.countMark("stdzhanying_count") < player.countCards("h")) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (!_status.currentPhase || !_status.currentPhase.hasSkill("stdzhanying")) {
							return;
						}
						if (get.color(card) == "red" && player.countMark("stdzhanying_count") < player.countCards("h")) {
							return false;
						}
					},
				},
			},
		},
	},
	//F1
	stdtiaohe: {
		audio: "fyjianyu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(tar1 => {
				return (
					tar1.countDiscardableCards(player, "e", i => get.subtype(i) == "equip2") &&
					game.hasPlayer(tar2 => {
						return tar1 !== tar2 && tar2.countDiscardableCards(player, "e");
					})
				);
			});
			// 下面是将判定区内的装备牌也考虑在内的
			// let e = 0,
			// 	fj = false;
			// game.countPlayer(target => {
			// 	let es = target.getDiscardableCards(player, "e"),
			// 		js = target.getDiscardableCards(player, "j", i => get.type(i) == "equip");
			// 	if (es.length) {
			// 		e++;
			// 	}
			// 	e += js.length;
			// 	if (!fj && (es.some(card => get.subtype(card) == "equip2") || js.some(card => get.subtype(card) == "equip2"))) {
			// 		fj = true;
			// 	}
			// });
			// return fj && e >= 2;
		},
		filterTarget(card, player, target) {
			if (!ui.selected.targets.length || ui.selected.targets[0].countDiscardableCards(player, "e", i => get.subtype(i) == "equip2")) {
				return target.countDiscardableCards(player, "e");
			}
			return target.countDiscardableCards(player, "e", i => get.subtype(i) == "equip2");
			// let e = 0;
			// let es = target.getDiscardableCards(player, "e"),
			// 	js = target.getDiscardableCards(player, "j", i => get.type(i) == "equip");
			// if (es.length) {
			// 	e++;
			// }
			// e += js.length;
			// if (!e) {
			// 	return false;
			// }
			// if (!ui.selected.targets.length) {
			// 	return true;
			// }
			// if (!ui.selected.targets[0].countDiscardableCards(player, "ej", i => get.subtype(i) == "equip2")) {
			// 	return es.some(card => get.subtype(card) == "equip2") || js.some(card => get.subtype(card) == "equip2");
			// }
			// return true;
		},
		selectTarget() {
			return 2;
			// /-?
			// if (!ui.selected.targets.length) {
			// 	return [1, 2];
			// }
			// let e = 0,
			// 	player = get.event("player"),
			// 	target = ui.selected.targets[0];
			// let es = target.getDiscardableCards(player, "e"),
			// 	js = target.getDiscardableCards(player, "j", i => get.type(i) == "equip");
			// if (es.length) {
			// 	e++;
			// }
			// e += js.length;
			// if (e >= 2 && (es.some(card => get.subtype(card) == "equip2") || js.some(card => get.subtype(card) == "equip2"))) {
			// 	return [1, 2];
			// }
			// return 2;
		},
		complexTarget: true,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const targets = event.targets.slice();
			if (targets.length == 1) {
				await player
					.discardPlayerCard("ej", targets[0], true, 2)
					.set("filterButton", button => {
						let position = get.position(button.link),
							subtype = get.subtype(button.link);
						if (!subtype || !subtype.startsWith("equip")) {
							return false;
						}
						if (ui.selected.buttons.length) {
							let pos = get.position(ui.selected.buttons[0].link),
								sub = get.subtype(ui.selected.buttons[0].link);
							if (pos == "e" && position == "e") {
								return false;
							}
							if (sub == "equip2") {
								return true;
							}
							return subtype == "equip2";
						}
						if (position == "e") {
							if (!get.event("js").some(i => get.subtype(i) == "equip2")) {
								return subtype == "equip2";
							}
							return true;
						}
						if (!get.event("es").length) {
							return subtype == "equip2";
						}
						return true;
					})
					.set(
						"es",
						targets[0].getDiscardableCards(player, "e", i => get.subtype(i) == "equip2")
					)
					.set(
						"js",
						targets[0].getDiscardableCards(player, "j", i => get.type(i) == "equip")
					);
				return;
			}
			let canfj = targets.filter(target => {
				return target.countDiscardableCards(player, "e", i => get.subtype(i) == "equip2");
			});
			for (let i = 0; i < 2; i++) {
				if (i && canfj.includes(targets[i]) && !targets[i].countDiscardableCards(player, "e", i => get.subtype(i) == "equip2")) {
					break;
				}
				const result = await player
					.discardPlayerCard("e", targets[i], true)
					.set("filterButton", button => {
						if (get.event("fj")) {
							return get.subtype(button.link) == "equip2";
						}
						// return true;
						return get.type(button.link) == "equip";
					})
					.set("fj", canfj.length === 1 && canfj.includes(targets[i]))
					.forResult();
				if (result.bool && get.subtype(result.cards[0]) == "equip2") {
					canfj = [];
				}
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					let att = get.attitude(player, target),
						es = [];
					target.countDiscardableCards(player, "e", i => {
						es.push(get.value(i, target));
					});
					let min = Math.min(...es),
						max = Math.max(...es),
						ext = target.hasSkillTag("noe") ? 10 : 0;
					if (att <= 0) {
						return ext - max;
					}
					return ext - min;
				},
			},
		},
	},
	stdqiansu: {
		audio: "shengxi_feiyi",
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return get.type2(event.card) == "trick" && !player.countCards("e");
		},
		frequent: true,
		content() {
			player.draw();
		},
		ai: {
			noe: true,
			effect: {
				target(card, player, target) {
					if (target.countCards("e")) {
						return;
					}
					if (target == player && get.type(card) == "equip" && get.equipValue(card) < 5) {
						return 0;
					}
					if (get.type2(card) == "trick") {
						return [1, 0.6];
					}
				},
			},
		},
	},
};

export default skills;
