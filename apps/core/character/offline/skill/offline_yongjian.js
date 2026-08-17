import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//用间篇豪华版盒子甄姬
	yjluoshen: {
		audio: "luoshen",
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		async content(event, trigger, player) {
			event.cards = [];
			while (true) {
				const judgeEvent = player.judge({
					judge(card) {
						const color = get.color(card);
						const parentEvent = get.event().getParent("yjluoshen");
						if (!parentEvent) {
							return 1;
						}
						if (!parentEvent.color) {
							parentEvent.color = color;
						} else if (parentEvent.color !== color) {
							return -1;
						}
						return 1;
					},
					judge2: result => result.bool,
				});
				if (get.mode() !== "guozhan" && !player.hasSkillTag("rejudge")) {
					judgeEvent.set("callback", async (event, trigger, player) => {
						if (get.position(event.card, true) === "o") {
							await player.gain({
								cards: [event.card],
								animate: "gain2",
							});
						}
					});
				} else {
					judgeEvent.set("callback", async event => {
						event.getParent().orderingCards.remove(event.card);
					});
				}
				const judgeResult = await judgeEvent.forResult();
				if (judgeResult.judge <= 0) {
					event.cards = event.cards.filter(card => get.position(card, true) === "o");
					if (event.cards.length) {
						await player.gain({ cards: event.cards, animate: "gain2" });
					}
					return;
				}
				event.cards.push(judgeResult.card);
				const continueResult = await player
					.chooseBool({ prompt: "是否再次发动【洛神】？" })
					.set("frequentSkill", "yjluoshen")
					.forResult();
				if (!continueResult.bool) {
					if (event.cards.length) {
						await player.gain({ cards: event.cards, animate: "gain2" });
					}
					return;
				}
			}
		},
	},
	//用间篇豪华版盒子贾诩
	yjzhenlve: {
		audio: "zhenlue",
		inherit: "zhenlue",
		async content(event, trigger, player) {
			trigger.directHit.addArray(game.players);
		},
	},
	yjjianshu: {
		audio: "jianshu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCards("h");
		},
		filterTarget(card, player, target) {
			if (!ui.selected.targets.length) {
				return target !== player;
			}
			const firstTarget = ui.selected.targets[0];
			return target !== player && firstTarget !== target && !firstTarget.hasSkillTag("noCompareSource") && target.hasCards("h") && !target.hasSkillTag("noCompareTarget");
		},
		filterCard: true,
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			if (_status.event.player.hp === 1) {
				return 8 - get.value(card);
			}
			return 6 - get.value(card);
		},
		selectTarget: 2,
		targetprompt: ["发起者", "拼点对象"],
		multitarget: true,
		async content(event, trigger, player) {
			const cards = event.cards;
			const firstTarget = event.targets[0];
			const secondTarget = event.targets[1];
			await player.give(cards, firstTarget, true);
			if (!firstTarget.canCompare(secondTarget)) {
				return;
			}
			const result = await firstTarget.chooseToCompare(secondTarget).forResult();
			if (result.tie) {
				await firstTarget.loseHp();
				await secondTarget.loseHp();
				return;
			}
			const loser = result.bool ? secondTarget : firstTarget;
			await loser.loseHp();
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
	yjyongdi: {
		audio: "yongdi",
		limited: true,
		trigger: { player: "phaseZhunbeiBegin" },
		animationColor: "thunder",
		skillAnimation: "legend",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					filterTarget: (card, player, target) => target.hasSex("male") || target.name === "key_yuri",
					ai: target => {
						if (!_status.event.goon) {
							return 0;
						}
						const currentPlayer = _status.event.player;
						const attitude = get.attitude(currentPlayer, target);
						if (attitude <= 1) {
							return 0;
						}
						const mode = get.mode();
						if (mode === "identity" || (mode === "versus" && _status.mode === "four")) {
							const hasZhuSkill = target.getStockSkills(true, true).some(skill => {
								if (target.hasSkill(skill)) {
									return false;
								}
								const info = get.info(skill);
								return info && info.zhuSkill;
							});
							if (hasZhuSkill) {
								return attitude * 2;
							}
						}
						return attitude;
					},
				})
				.set("goon", !player.hasUnknown(Math.round(game.players.length / 4 - 0.2)))
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const target = event.targets[0];
			const mode = get.mode();
			if (player !== target && (mode !== "identity" || player.identity !== "nei")) {
				player.addExpose(0.3);
			}
			await target.gainMaxHp({ forced: true });
			await target.recover();
			if (mode === "identity" || (mode === "versus" && _status.mode === "four") || mode === "doudizhu") {
				const skills = target.getStockSkills(true, true).filter(skill => {
					if (target.hasSkill(skill)) {
						return false;
					}
					const info = get.info(skill);
					return info && info.zhuSkill;
				});
				if (skills.length) {
					await target.addSkills(skills);
				}
			}
		},
	},
	//用间篇豪华版盒子许攸
	yjshicai: {
		audio: "spshicai",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		prompt() {
			const card = _status.pileTop;
			if (get.itemtype(card) === "card") {
				return `弃置一张牌，然后获得${get.translation(card)}`;
			}
			return "弃置一张牌，然后获得牌堆顶的一张牌";
		},
		check(card) {
			const player = _status.event.player;
			const cardx = _status.pileTop;
			if (get.itemtype(cardx) !== "card") {
				return 0;
			}
			const val = player.getUseValue(cardx, null, true);
			if (!val) {
				return 0;
			}
			const val2 = player.getUseValue(card, null, true);
			return (val - val2) / Math.max(0.1, get.value(card));
		},
		group: ["yjshicai_mark"],
		async content(event, trigger, player) {
			const card = get.cards()[0];
			const gainEvent = player.gain({
				cards: [card],
				animate: "gain2",
				gaintag: ["yjshicai_clear"],
			});
			player.addTempSkill("yjshicai_clear", "phaseUseAfter");
			await gainEvent;
		},
		ai: {
			order: 3,
			result: { player: 1 },
		},
		subSkill: {
			mark: {
				trigger: { player: "phaseBegin" },
				silent: true,
				firstDo: true,
				async content(event, trigger, player) {
					player.addTempSkill("spshicai2");
				},
			},
			clear: {
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					if (event.name === "lose") {
						return Object.values(event.gaintag_map).some(gaintags => gaintags.includes("yjshicai_clear"));
					}
					return player.hasHistory("lose", evt => {
						if (evt.getParent() !== event) {
							return false;
						}
						return Object.values(evt.gaintag_map).some(gaintags => gaintags.includes("yjshicai_clear"));
					});
				},
				async content(event, trigger, player) {
					delete player.getStat("skill").yjshicai;
				},
			},
		},
	},
	yjchenggong: {
		audio: "chenggong",
		trigger: {
			global: "useCardToPlayered",
		},
		filter(event, player) {
			return event.isFirstTarget && event.targets.length > 1 && event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await trigger.player.draw();
		},
		ai: { expose: 0.2 },
	},
	yjzezhu: {
		audio: "zezhu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			const zhu = get.zhu(player);
			if (!zhu) {
				return false;
			}
			return zhu.hasGainableCards(player, zhu === player ? "ej" : "hej");
		},
		filterTarget(card, player, target) {
			const zhu = get.zhu(player);
			return target === zhu;
		},
		selectTarget: 1,
		async content(event, trigger, player) {
			const target = event.target;
			await player.gainPlayerCard({
				target,
				position: player === target ? "ej" : "hej",
				forced: true,
			});
			if (!player.hasCards("he") || player === target) {
				return;
			}
			const result = await player
				.chooseCard({
					prompt: `择主：交给${get.translation(target)}一张牌`,
					position: "he",
					forced: true,
				})
				.forResult();
			await player.give(result.cards, target);
		},
		ai: {
			order: 2.9,
			result: { player: 1 },
		},
	},
	//用间beta董卓
	yjtuicheng: {
		enable: "phaseUse",
		viewAs: { name: "tuixinzhifu", isCard: true },
		filterCard: () => false,
		selectCard: -1,
		log: false,
		async precontent(event, trigger, player) {
			player.logSkill("yjtuicheng");
			await player.loseHp();
		},
		ai: {
			effect: {
				player(card, player) {
					if (get.name(card) !== "tuixinzhifu" || _status.event.skill !== "yjtuicheng") {
						return;
					}
					if (player.hp < 3) {
						return "zeroplayertarget";
					}
					if (player.hasSkill("yjshicha") && !player.hasHistory("useSkill", evt => evt.skill === "yjtuicheng")) {
						return [1, 2];
					}
					return "zeroplayertarget";
				},
			},
		},
	},
	yjyaoling: {
		trigger: {
			player: "phaseUseEnd",
		},
		async cost(event, trigger, player) {
			const check =
				player.maxHp >= 2 &&
				((player.hasSkill("yjshicha") && !player.hasHistory("useSkill", evt => evt.skill === "yjtuicheng")) || (player.maxHp > 2 && player.getDamagedHp() > 1));
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("yjyaoling"),
					prompt2: "减1点体力上限，选择一名其他角色A和一名角色B，令A选择对B使用杀或被你弃牌",
					selectTarget: 2,
					filterTarget: (card, player, target) => {
						if (!ui.selected.targets.length) {
							return target !== player;
						}
						return ui.selected.targets[0].canUse("sha", target, false);
					},
					ai: target => {
						if (!get.event().check) {
							return -1;
						}
						const currentPlayer = _status.event.player;
						if (!ui.selected.targets.length) {
							return get.effect(target, { name: "guohe_copy2" }, currentPlayer, currentPlayer);
						}
						const firstTarget = ui.selected.targets[0];
						return get.effect(target, { name: "sha" }, firstTarget, currentPlayer) + 5;
					},
				})
				.set("targetprompt", ["打人", "被打"])
				.set("complexSelect", true)
				.set("check", check)
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			const firstTarget = targets[0];
			const secondTarget = targets[1];
			player.line2(targets);
			await player.loseMaxHp();
			const useResult = await firstTarget
				.chooseToUse({
					prompt: `耀令：对${get.translation(secondTarget)}使用一张杀，或令${get.translation(player)}弃置你的一张牌`,
					filterCard: (card, player, event) => {
						if (get.name(card) !== "sha") {
							return false;
						}
						return lib.filter.filterCard(card, player, event);
					},
					complexTarget: true,
					filterTarget: (card, player, target) => {
						const source = _status.event.sourcex;
						if (target !== source && !ui.selected.targets.includes(source)) {
							return false;
						}
						return lib.filter.filterTarget(card, player, target);
					},
				})
				.set("targetRequired", true)
				.set("sourcex", secondTarget)
				.forResult();
			if (!useResult.bool && firstTarget.countDiscardableCards(player, "he")) {
				await player.discardPlayerCard({
					target: firstTarget,
					position: "he",
					forced: true,
				});
			}
		},
	},
	yjshicha: {
		trigger: { player: "phaseDiscardBegin" },
		forced: true,
		filter(event, player) {
			return !player.hasHistory("useSkill", evt => evt.skill === "yjtuicheng" || evt.skill === "yjyaoling");
		},
		async content(event, trigger, player) {
			player.addTempSkill("yjshicha_limit");
		},
		subSkill: {
			limit: {
				charlotte: true,
				mark: true,
				intro: { content: "本回合手牌上限为1" },
				mod: {
					maxHandcard: () => 1,
				},
			},
		},
		ai: {
			neg: true,
		},
	},
	yjyongquan: {
		trigger: { player: "phaseJieshuBegin" },
		zhuSkill: true,
		filter(event, player) {
			return (
				player.hasZhuSkill("yjyongquan") &&
				game.hasPlayer(current => current !== player && player.hasZhuSkill(current) && current.group === "qun")
			);
		},
		logTarget(event, player) {
			return game.filterPlayer(current => current !== player && player.hasZhuSkill(current) && current.group === "qun");
		},
		async content(event, trigger, player) {
			const targets = lib.skill.yjyongquan.logTarget(trigger, player);
			for (const target of targets) {
				const result = await target
					.chooseCard({
						prompt: `拥权：是否交给${get.translation(player)}一张牌？`,
						position: "he",
						ai: card => {
							if (_status.event.goon) {
								return 4.5 - get.value(card);
							}
							return 0;
						},
					})
					.set("goon", get.attitude(target, player) > 3)
					.forResult();
				if (!result.bool) {
					continue;
				}
				target.line(player);
				await target.give(result.cards, player);
			}
		},
	},
	//用间beta甘宁的新版
	yjjielve: {
		enable: "phaseUse",
		viewAs: { name: "chenghuodajie" },
		filterCard(card, player) {
			if (ui.selected.cards.length) {
				return get.color(card) === get.color(ui.selected.cards[0]);
			}
			const cards = player.getCards("hes");
			return cards.some(cardx => card !== cardx && get.color(card) === get.color(cardx));
		},
		position: "hes",
		selectCard: 2,
		complexCard: true,
		check(card) {
			return 5 - get.value(card);
		},
		onuse(links, player) {
			player.addTempSkill("yjjielve_check");
		},
		subSkill: {
			check: {
				trigger: { source: "damageSource" },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return event.card && event.card.name === "chenghuodajie" && event.getParent().skill === "yjjielve";
				},
				async content(event, trigger, player) {
					player.tempBanSkill("yjjielve");
				},
			},
		},
	},
	//用间beta张飞
	yjmangji: {
		trigger: {
			player: ["loseAfter", "changeHpAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			if (player.hp < 1 || !player.countDiscardableCards(player, "h")) {
				return false;
			}
			if (event.name === "changeHp") {
				return event.changedHp !== 0;
			}
			const evt = event.getl(player);
			if (event.name === "equip" && event.player === player) {
				return !evt || evt.cards.length !== 1;
			}
			if (!evt?.es.length) {
				return false;
			}
			return game.hasPlayer(current => player.canUse({ name: "sha", isCard: true }, current, false));
		},
		direct: true,
		forced: true,
		async content(event, trigger, player) {
			if (!player.countDiscardableCards(player, "h") || !game.hasPlayer(current => player.canUse({ name: "sha", isCard: true }, current, false))) {
				return;
			}
			const result = await player
				.chooseCardTarget({
					prompt: "莽击：弃置一张手牌，视为对一名其他角色使用一张【杀】",
					forced: true,
					filterCard: lib.filter.cardDiscardable,
					filterTarget(card, player, target) {
						return player.canUse({ name: "sha", isCard: true }, target, false);
					},
					ai2(target) {
						return get.effect(target, { name: "sha" }, _status.event.player);
					},
				})
				.forResult();
			if (!result?.bool) {
				return;
			}
			const target = result.targets[0];
			const cards = result.cards;
			player.logSkill(event.name, target);
			await player.discard({ cards });
			if (player.canUse({ name: "sha", isCard: true }, target, false)) {
				await player.useCard({
					card: { name: "sha", isCard: true },
					targets: [target],
					addCount: false,
				});
			}
		},
	},
	//用间beta曹洪
	yjlifeng: {
		enable: "phaseUse",
		usable: 1,
		locked: false,
		filter(event, player) {
			for (const card of ui.discardPile.childNodes) {
				if (get.type(card) === "equip") {
					return true;
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			const cards = Array.from(ui.discardPile.childNodes).filter(card => get.type(card) === "equip");
			const result = await player
				.chooseButton({
					createDialog: ["厉锋：获得一张装备牌", cards],
					forced: cards.length > 0,
					ai: get.buttonValue,
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			const card = result.links[0];
			await player.gain({
				cards: [card],
				animate: "gain2",
			});
		},
		ai: {
			order: 10,
			result: { player: 1 },
			effect: {
				target(card, player, target) {
					if (card && get.type(card) === "equip" && _status.event.skill === "_gifting") {
						return 0;
					}
				},
			},
		},
		mod: {
			cardGiftable(card, player) {
				return get.type(card) === "equip";
			},
		},
	},
	//用间篇李儒
	yjdumou: {
		forced: true,
		mod: {
			cardname(card, player, name) {
				if (player === _status.currentPhase && card.name === "du") {
					return "guohe";
				}
			},
			aiValue(player, card, num) {
				if (card.name === "du") {
					return get.value({ name: "guohe" });
				}
			},
		},
		init: () => {
			game.addGlobalSkill("yjdumou_du");
			game.addGlobalSkill("g_du");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("yjdumou", null, null, false), true)) {
				game.removeGlobalSkill("yjdumou_du");
			}
		},
		subSkill: {
			du: {
				mod: {
					cardname(card, player, name) {
						if (_status.currentPhase && player !== _status.currentPhase && _status.currentPhase.hasSkill("yjdumou") && get.color(card) === "black") {
							return "du";
						}
					},
					aiValue(player, card, num) {
						if (get.name(card) === "du" && card.name !== "du") {
							return get.value({ name: card.name });
						}
					},
				},
				trigger: { player: "dieAfter" },
				filter: () => !game.hasPlayer(current => current.hasSkill("yjdumou", null, null, false), true),
				silent: true,
				forceDie: true,
				content: async () => {
					game.removeGlobalSkill("yjdumou_du");
				},
			},
		},
		ai: { threaten: 2.1 },
	},
	yjweiquan: {
		enable: "phaseUse",
		skillAnimation: true,
		animationColor: "soil",
		filterTarget: true,
		limited: true,
		selectTarget: () => [1, game.roundNumber],
		async contentBefore(event, trigger, player) {
			const targets = event.targets;
			player.awakenSkill("yjweiquan");
			const result = await player
				.chooseTarget({
					prompt: "威权：选择获得牌的角色",
					forced: true,
					ai: target => {
						const attitude = get.attitude(_status.event.player, target);
						const num = target.needsToDiscard(targets.filter(current => current !== target && current.countCards("h")).length);
						if (attitude > 0 && num <= 2) {
							return 0;
						}
						if (attitude < 0 && target.needsToDiscard(-5)) {
							return -attitude - Math.sqrt(num);
						}
						return attitude - Math.sqrt(num);
					},
				})
				.forResult();
			event.getParent()._yjweiquan = result.targets[0];
		},
		async content(event, trigger, player) {
			const target = event.target;
			const recipient = event.getParent()._yjweiquan;
			if (target === recipient || !target.countCards("h")) {
				return;
			}
			const result = await target
				.chooseCard({
					prompt: `威权：将一张手牌交给${get.translation(recipient)}`,
					forced: true,
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			await target.give(result.cards, recipient);
		},
		async contentAfter(event, trigger, player) {
			const recipient = event.getParent()._yjweiquan;
			if (recipient.countCards("h") <= recipient.hp) {
				return;
			}
			const next = recipient.phase();
			event.next.remove(next);
			event.getParent().after.push(next);
			next.player = recipient;
			next._noTurnOver = true;
			next._triggered = null;
			next.setContent(async (event, trigger, player) => {
				game.broadcastAll(() => {
					if (ui.tempnowuxie) {
						ui.tempnowuxie.close();
						delete ui.tempnowuxie;
					}
				});
				player.phaseDiscard();
				if (!player.noPhaseDelay) {
					game.delayx();
				}
				delete player._noSkill;
			});
		},
		ai: {
			order: 6,
			result: {
				player(player) {
					const num = game.countPlayer(current => get.attitude(player, current) < 0 && current.countCards("h"));
					if (
						(game.roundNumber < num && player.hp > 2) ||
						!game.hasPlayer(
							current => (get.attitude(player, current) > 0 && current.needsToDiscard(num) < 2) || (get.attitude(player, current) < 0 && current.needsToDiscard(-5))
						)
					) {
						return -10;
					}
					return 1;
				},
				target: -1,
			},
		},
	},
	yjrenwang: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			for (const card of ui.discardPile.childNodes) {
				if (get.color(card) === "black" && get.type(card) === "basic") {
					return true;
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			const cards = Array.from(ui.discardPile.childNodes).filter(card => get.color(card) === "black" && get.type(card) === "basic");
			const cardResult = await player
				.chooseButton({
					createDialog: ["人望：选择一张黑色基本牌", cards],
					forced: cards.length > 0,
					ai: get.buttonValue,
				})
				.forResult();
			if (!cardResult.bool) {
				return;
			}
			const card = cardResult.links[0];
			const targetResult = await player
				.chooseTarget({
					prompt: `选择一名角色获得${get.translation(card)}`,
					forced: true,
					ai: target => get.attitude(_status.event.player, target),
				})
				.forResult();
			if (!targetResult.bool) {
				return;
			}
			const target = targetResult.targets[0];
			player.line(target);
			await target.gain({
				cards: [card],
				animate: "gain2",
			});
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
	},
	//群曹操
	yjxiandao: {
		trigger: { player: "giftAccepted" },
		usable: 1,
		forced: true,
		locked: false,
		filter: (event, player) => event.target !== player && event.target.isIn(),
		logTarget: "target",
		async content(event, trigger, player) {
			const target = trigger.target;
			const card = trigger.card;
			target.markAuto("yjxiandao_block", [get.suit(card, false)]);
			target.addTempSkill("yjxiandao_block");
			const type = get.type(card);
			if (type === "trick") {
				await player.draw(2);
				return;
			}
			if (type !== "equip") {
				return;
			}
			if (target.hasGainableCards(player, "he", cardx => cardx !== card)) {
				await player
					.gainPlayerCard({
						target,
						position: "he",
						forced: true,
						filterButton: button => button.link !== _status.event.card,
					})
					.set("card", card);
			}
			if (get.subtype(card, false) === "equip1") {
				await target.damage();
			}
		},
		subSkill: {
			block: {
				charlotte: true,
				onremove: true,
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("yjxiandao_block").includes(get.suit(card))) {
							return false;
						}
					},
					cardRespondable(card, player) {
						if (player.getStorage("yjxiandao_block").includes(get.suit(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (player.getStorage("yjxiandao_block").includes(get.suit(card))) {
							return false;
						}
					},
				},
				mark: true,
				intro: { content: "不能使用或打出$牌" },
			},
		},
	},
	yjsancai: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCards("h");
		},
		async content(event, trigger, player) {
			await player.showHandcards();
			const hs = player.getCards("h");
			if (hs.length > 1) {
				const type = get.type2(hs[0], player);
				for (const card of hs.slice(1)) {
					if (get.type(card) !== type) {
						return;
					}
				}
			}
			const result = await player
				.chooseCardTarget({
					prompt: "是否赠予一张手牌？",
					filterCard: true,
					filterTarget: lib.filter.notMe,
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			const target = result.targets[0];
			player.line(target, "green");
			await player.gift(result.cards, target);
		},
		ai: {
			combo: "yixiandao",
		},
	},
	yjyibing: {
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		direct: true,
		filter(event, player) {
			if (event.getParent().name === "gift") {
				return false;
			}
			if (event.getParent("yjyibing").player === player) {
				return false;
			}
			const phaseDrawEvent = event.getParent("phaseDraw");
			const handCards = player.getCards("h");
			const cards = event.getg(player);
			return (
				cards.length > 0 &&
				(!phaseDrawEvent || phaseDrawEvent.player !== player) &&
				cards.every(card => handCards.includes(card) && game.checkMod(card, player, "unchanged", "cardEnabled2", player) !== false) &&
				player.hasUseTarget(
					{
						name: "sha",
						cards: event.cards,
					},
					false
				)
			);
		},
		async content(event, trigger, player) {
			const cards = trigger.getg(player);
			await player
				.chooseUseTarget({
					prompt: get.prompt("yjyibing"),
					prompt2: `将${get.translation(cards)}当做【杀】使用`,
					card: { name: "sha" },
					cards,
					addCount: false,
					nodistance: true,
				})
				.set("logSkill", "yjyibing");
		},
	},
	//用间篇
	yjxuepin: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(event, player, target) {
			return player.inRange(target) && target.hasDiscardableCards(player, "he");
		},
		async content(event, trigger, player) {
			const target = event.target;
			await player.loseHp();
			if (!target.hasDiscardableCards(player, "he")) {
				return;
			}
			const result = await player
				.discardPlayerCard({
					target,
					selectButton: 2,
					position: "he",
					forced: true,
				})
				.forResult();
			if (!result.bool || result.cards?.length !== 2) {
				return;
			}
			const firstCard = result.cards[0];
			const secondCard = result.cards[1];
			const firstType = get.type2(firstCard, firstCard.original === "h" ? target : false);
			const secondType = get.type2(secondCard, secondCard.original === "h" ? target : false);
			if (firstType !== secondType) {
				return;
			}
			await player.recover();
		},
		ai: {
			order: 4,
			result: {
				player(player, target) {
					if (player.hp === 1) {
						return -8;
					}
					if (target.countCards("e") > 1) {
						return 0;
					}
					if (player.hp > 2 || target.countCards("h") > 1) {
						return -0.5;
					}
					return -2;
				},
				target(player, target) {
					if (target.countDiscardableCards(player, "he") < 2) {
						return 0;
					}
					return -2;
				},
			},
		},
	},
	nsjianglie: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name === "sha" && event.target.hasCards("h");
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = trigger.target;
			await target.showHandcards();
			const cards = target.getCards("h");
			const colors = [...new Set(cards.map(card => get.color(card)))];
			let color;
			if (colors.length === 1) {
				color = colors[0];
			} else {
				colors.sort();
				const result = await target
					.chooseControl({
						controls: colors,
						prompt: "选择弃置一种颜色的所有手牌",
						ai: (event, player) =>
							get.value(player.getCards("h", { color: "red" })) >= get.value(player.getCards("h", { color: "black" })) ? "black" : "red",
					})
					.forResult();
				color = result.control;
			}
			await target.discard({ cards: target.getCards("h", { color }) });
		},
	},
};

export default skills;
