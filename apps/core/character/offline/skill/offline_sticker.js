import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//桌游志贴纸
	spyinzhi: {
		trigger: { player: "damageEnd" },
		frequent: true,
		filter(event, player) {
			return event.num > 0;
		},
		getIndex: event => event.num,
		async content(event, trigger, player) {
			let cards = get.cards(2);
			await game.cardsGotoOrdering(cards);
			await player.showCards(cards);
			const { source } = trigger;
			let count = cards.filter(card => get.suit(card) === "spade").length;
			while (count-- && source?.isIn() && game.hasPlayer(current => current !== source && source.countGainableCards(current, "h"))) {
				const result = await player
					.chooseTarget(`令一名角色获得${get.translation(source)}的一张手牌`, (card, player, target) => {
						const source = get.event().source;
						return target !== source && source.countGainableCards(target, "h");
					})
					.set("source", source)
					.set("ai", target => {
						const { player, source } = get.event();
						return get.effect(target, { name: "shunshou_copy", position: "h" }, source, player);
					})
					.forResult();
				if (!result?.targets?.length) {
					continue;
				}
				const [target] = result.targets;
				player.line([source, target], "green");
				if (source.countGainableCards(target, "h")) {
					await target.gainPlayerCard(source, "h", true);
				}
			}
			cards = cards.filter(card => get.suit(card) !== "spade");
			if (cards.length) {
				await player.gain(cards, "gain2", "log");
			}
		},
	},
	spmingjian: {
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return player.hasCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard({
					prompt: get.prompt2("spmingjian", trigger.player),
					position: "he",
					ai: card => {
						if (get.attitude(player, trigger.player) > 0 && trigger.player.countCards("j") > 0) {
							return 5 - get.value(card);
						}
						return -1;
					},
					filterCard: (card, cardPlayer, chooseEvent) => get.position(card) !== "e" || lib.filter.cardDiscardable(card, cardPlayer, chooseEvent),
				})
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const card = event.cards[0];
			let index;
			if (get.position(card) === "e") {
				index = 0;
			} else if (!lib.filter.cardDiscardable(card, player, event)) {
				index = 1;
			} else {
				const name = get.translation(trigger.player);
				const controlResult = await player
					.chooseControl({
						choiceList: [`令${name}跳过本回合的判定阶段`, `令${name}于本回合的判定中不触发「判定结果生效前」的时机`],
						ai: () => 0,
					})
					.forResult();
				index = controlResult.index;
			}
			if (index === 0) {
				const discardEvent = player.discard({ cards: [card] });
				trigger.player.skip("phaseJudge");
				await discardEvent;
				return;
			}
			const expansionEvent = trigger.player.addToExpansion({
				cards: [card],
				source: player,
				animate: "giveAuto",
				gaintag: ["spmingjian_charlotte"],
			});
			trigger.player.addSkill("spmingjian_charlotte");
			await expansionEvent;
		},
		ai: {
			expose: 0.25,
		},
	},
	spmingjian_charlotte: {
		trigger: { player: ["judgeBefore", "phaseAfter"] },
		forced: true,
		firstDo: true,
		silent: true,
		popup: false,
		charlotte: true,
		sourceSkill: "spmingjian",
		async content(event, trigger, player) {
			if (trigger.name === "phase") {
				player.removeSkill(event.name);
			} else {
				trigger.noJudgeTrigger = true;
			}
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile({ cards });
			}
		},
		marktext: "鉴",
		intro: {
			name: "明鉴",
			content: "expansion",
			markcount: "expansion",
		},
	},
	spshude: {
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter(event, player) {
			return player.countCards("h") < player.maxHp;
		},
		async content(event, trigger, player) {
			await player.drawTo(player.maxHp);
		},
	},
	spfuluan: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.inRange(target);
		},
		selectCard: 3,
		position: "he",
		check(card) {
			return 5 - get.value(card);
		},
		complexCard: true,
		filterCard(card, player) {
			if (!ui.selected.cards.length) {
				return player.countCards("he", { suit: get.suit(card) }) > 2;
			}
			return get.suit(card) === get.suit(ui.selected.cards[0]);
		},
		async content(event, trigger, player) {
			await event.target.turnOver();
			await player.addTempSkill("spfuluan2");
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.isTurnedOver()) {
						return 2;
					}
					return -1;
				},
			},
		},
	},
	spfuluan2: {
		mod: {
			cardEnabled(card) {
				if (card.name === "sha") {
					return false;
				}
			},
		},
	},
	spzhaoxin: {
		trigger: { player: "phaseDrawEnd" },
		check(event, player) {
			return player.getUseValue({ name: "sha", isCard: true }) > 0;
		},
		filter(event, player) {
			return player.hasCards("h");
		},
		async content(event, trigger, player) {
			await player.showHandcards();
			await player.chooseUseTarget({
				card: get.autoViewAs({ name: "sha" }),
				addCount: false,
			});
		},
	},
	splanggu: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return get.itemtype(event.source) === "player";
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const result = await player.judge().forResult();
			if (!trigger.source.hasCards("h")) {
				return;
			}
			await player
				.discardPlayerCard({
					target: trigger.source,
					position: "h",
					selectButton: [1, Infinity],
					allowChooseAll: true,
					filterButton: button => get.suit(button.link) === get.event().suit,
					visible: true,
				})
				.set("suit", result.suit);
		},
		group: "splanggu_rewrite",
	},
	splanggu_rewrite: {
		trigger: { player: "judge" },
		sourceSkill: "splanggu",
		filter(event, player) {
			return player.hasCards("hs") && event.getParent()?.name === "splanggu";
		},
		direct: true,
		async content(event, trigger, player) {
			const cardResult = await player
				.chooseCard({
					prompt: `狼顾的判定结果为${get.translation(trigger.player.judging[0])}，是否打出一张手牌进行代替？`,
					position: "hs",
					filterCard(card, player) {
						const event = get.event();
						const mod2 = game.checkMod(card, player, event, "unchanged", "cardEnabled2", player);
						if (mod2 !== "unchanged") {
							return Boolean(mod2);
						}
						const mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
						if (mod !== "unchanged") {
							return Boolean(mod);
						}
						return true;
					},
					ai: () => -1,
				})
				.forResult();
			if (!cardResult.bool || !cardResult.cards?.length) {
				return;
			}
			await player.respond({
				cards: cardResult.cards,
				highlight: true,
				skill: "splanggu",
				noOrdering: true,
			});
			const judgedCard = trigger.player.judging[0];
			if (judgedCard.clone) {
				judgedCard.clone.classList.remove("thrownhighlight");
				game.broadcast(card => {
					if (card.clone) {
						card.clone.classList.remove("thrownhighlight");
					}
				}, judgedCard);
				game.addVideo("deletenode", player, get.cardsInfo([judgedCard.clone]));
			}
			const discardEvent = game.cardsDiscard(judgedCard);
			trigger.player.judging[0] = cardResult.cards[0];
			trigger.orderingCards.addArray(cardResult.cards);
			game.log(trigger.player, "的判定牌改为", cardResult.cards[0]);
			const delayEvent = game.delay(2);
			await discardEvent;
			await delayEvent;
		},
	},
	sphantong: {
		trigger: {
			player: "loseEnd",
		},
		frequent: true,
		filter(event, player) {
			return event.type === "discard" && event.getParent(3)?.name === "phaseDiscard" && event.cards.filterInD("d").length > 0;
		},
		async content(event, trigger, player) {
			if (!player.storage.sphantong) {
				player.storage.sphantong = [];
			}
			const cards = trigger.cards.filterInD("d");
			player.storage.sphantong.addArray(cards);
			player.$gain2(cards);
			game.log(player, "将", cards, "置于武将牌上");
			player.markSkill("sphantong");
		},
		group: ["sphantong_gain"],
		derivation: ["hujia", "jijiang", "jiuyuan", "xueyi"],
		marktext: "诏",
		intro: {
			content: "cards",
			onunmark: "throw",
		},
	},
	sphantong_gain: {
		trigger: { global: "phaseBegin" },
		direct: true,
		sourceSkill: "sphantong",
		filter(event, player) {
			return player.storage.sphantong && player.storage.sphantong.length > 0;
		},
		async content(event, trigger, player) {
			const cardResult = await player
				.chooseButton({
					createDialog: [get.prompt("sphantong"), player.storage.sphantong],
					ai: () => {
						const player = get.event().player;
						if (_status.currentPhase === player) {
							//血裔
							if ((player.hasJudge("lebu") || player.skipList.includes("phaseUse")) && game.hasPlayer(current => current !== player && current.group === "qun")) {
								return 1;
							}
							//激将
							if (!player.hasJudge("lebu") && !player.skipList.includes("phaseUse") && game.hasPlayer(current => current !== player && current.group === "shu" && current.hasSha() && get.attitude(player, current) > 0 && get.attitude(current, player) > 0) && game.hasPlayer(target => player.canUse({ name: "sha" }, target) && get.effect(target, { name: "sha" }, player, player) > 0)) {
								return 1;
							}
						} else if (!player.hasShan("all") && game.hasPlayer(current => current !== player && current.group === "wei" && current.mayHaveShan(player, "respond") && get.attitude(player, current) > 0 && get.attitude(current, player) > 0)) {
							//护驾
							return 1;
						}
						return -1;
					},
				})
				.forResult();
			if (!cardResult.bool) {
				return;
			}
			player.logSkill("sphantong");
			const card = cardResult.links[0];
			player.$throw(card);
			game.log(player, "将", card, "置入了弃牌堆");
			player.storage.sphantong.remove(card);
			player[player.storage.sphantong.length > 0 ? "markSkill" : "unmarkSkill"]("sphantong");
			const discardEvent = game.cardsDiscard(card);
			const list = ["hujia", "jijiang", "jiuyuan", "xueyi"].filter(skill => !player.hasSkill(skill));
			await discardEvent;
			if (!list.length) {
				return;
			}
			const controlResult = await player
				.chooseControl({
					controls: list,
					prompt: "选择获得以下技能中的一个",
					ai: () => {
						const player = get.event().player;
						if (_status.currentPhase === player) {
							//血裔
							if ((player.hasJudge("lebu") || player.skipList.includes("phaseUse")) && game.hasPlayer(current => current !== player && current.group === "qun")) {
								return "xueyi";
							}
							//激将
							if (!player.hasJudge("lebu") && !player.skipList.includes("phaseUse") && game.hasPlayer(current => current !== player && current.group === "shu" && current.hasSha() && get.attitude(player, current) > 0 && get.attitude(current, player) > 0) && game.hasPlayer(target => player.canUse({ name: "sha" }, target) && get.effect(target, { name: "sha" }, player, player) > 0)) {
								return "jijiang";
							}
						} else if (!player.hasShan("all") && game.hasPlayer(current => current !== player && current.group === "wei" && current.mayHaveShan(player, "respond") && get.attitude(player, current) > 0 && get.attitude(current, player) > 0)) {
							//护驾
							return "hujia";
						}
					},
				})
				.forResult();
			player.addTempSkills(controlResult.control);
		},
	},
	sphuangen: {
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget) {
				return false;
			}
			if (get.type(event.card) !== "trick") {
				return false;
			}
			if (get.info(event.card).multitarget) {
				return false;
			}
			if (event.targets.length < 2) {
				return false;
			}
			return player.hp > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("sphuangen"),
					selectTarget: [1, Math.min(player.hp, trigger.targets.length)],
					filterTarget: (_card, _player, target) => get.event().targets.includes(target),
					ai: target => -get.effect(target, trigger.card, trigger.player, player),
				})
				.set("targets", trigger.targets)
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.excluded.addArray(event.targets);
			await player.draw();
		},
		ai: { threaten: 3.5 },
		global: "sphuangen_ai",
		subSkill: {
			ai: {
				ai: {
					effect: {
						player_use(card, player) {
							if (
								typeof card !== "object" ||
								!game.hasPlayer(target => target.hasSkill("sphuangen") && (get.attitude(player, target) < 0 || get.attitude(target, player) < 0)) ||
								game.countPlayer(target => player.canUse(card, target)) < 2
							) {
								return;
							}
							if (get.info(card)?.type !== "trick") {
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
							} else if (typeof select === "function") {
								range = select(card, player);
								if (typeof range === "number") {
									range = [range, range];
								}
							}
							game.checkMod(card, player, range, "selectTarget", player);
							if (range[1] === -1 || (range[1] > 1 && ui.selected.targets && ui.selected.targets.length)) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	spyicong: {
		trigger: { player: "phaseDiscardEnd" },
		locked: false,
		filter(event, player) {
			return player.hasCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard({
					position: "he",
					selectCard: [1, player.countCards("he")],
					prompt: get.prompt2("spyicong"),
					allowChooseAll: true,
					ai: card => {
						if (card.name === "du") {
							return 10;
						}
						if (ui.selected.cards.length) {
							return -1;
						}
						return 4 - get.value(card);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.addToExpansion({
				cards: event.cards,
				source: player,
				animate: "give",
				gaintag: ["spyicong"],
			});
		},
		mod: {
			globalTo(from, to, num) {
				return num + to.getExpansions("spyicong").length;
			},
		},
		marktext: "扈",
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile({ cards });
			}
		},
		intro: {
			name: "义从",
			content(storage, player) {
				return `共有${get.cnNumber(player.getExpansions("spyicong").length)}张“扈”`;
			},
			markcount: "expansion",
		},
	},
	sptuji: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player.hasExpansions("spyicong");
		},
		async content(event, trigger, player) {
			const cards = player.getExpansions("spyicong");
			const num = cards.length;
			player.addMark("sptuji2", num, false);
			player.addTempSkill("sptuji2");
			player.loseToDiscardpile({ cards });
			if (num <= 1) {
				await player.draw();
			}
		},
		ai: {
			combo: "spyicong",
		},
	},
	sptuji2: {
		onremove: true,
		charlotte: true,
		mod: {
			globalFrom(from, to, num) {
				return num - from.countMark("sptuji2");
			},
		},
		marktext: "突",
		intro: {
			name: "突骑",
			content: "至其他角色的距离-#",
		},
	},
};

export default skills;
