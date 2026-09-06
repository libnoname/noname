import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//神曹操------by 清风
	psguixin: {
		audio: "guixin",
		trigger: {
			global: "roundStart",
			player: "damageEnd",
		},
		filter(event, player) {
			return game.hasPlayer(current => current !== player && current.hasGainableCards(player, "he"));
		},
		logTarget(event, player) {
			return game.filterPlayer(current => current !== player && current.hasGainableCards(player, "he")).sortBySeat();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			await player.gainMultiple(targets, "he");
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			threaten(player2, target) {
				if (target.hp === 1) {
					return 2.5;
				}
				return 0.5;
			},
			effect: {
				target(card, player2, target) {
					if (!target._psguixin_eff && get.tag(card, "damage") && target.hp > (player2.hasSkillTag("damageBonus", true, { card, target }) ? 2 : 1)) {
						if (player2.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						target._psguixin_eff = true;
						const gain = game.countPlayer(current => {
							if (target === current) {
								return 0;
							}
							if (get.attitude(target, current) > 0) {
								if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "psguixin") && get.effect(current, cardx, current, current) < 0, "e")) {
									return 1.3;
								}
								return 0;
							}
							if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "psguixin") && get.effect(current, cardx, current, current) > 0, "e")) {
								return 1.1;
							}
							if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "psguixin"), "h")) {
								return 0.9;
							}
							return 0;
						});
						delete target._psguixin_eff;
						return [1, Math.max(0, gain)];
					}
				},
			},
		},
	},
	psshenzun: {
		audio: 2,
		trigger: { source: "damageBegin2" },
		filter(event, player) {
			return event.player?.isIn() && player.group !== event.player.group && player.hasDiscardableCards(player, "he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard({
					prompt: get.prompt(event.skill),
					prompt2: "弃置一张牌令此伤害+1",
					position: "he",
					ai(card) {
						const { player, target } = get.event();
						if (get.damageEffect(target, player, player) > 0) {
							return 8 - get.value(card);
						}
						return 0;
					},
					chooseonly: true,
				})
				.set("target", trigger.player)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const cards = event.cards;
			await player.modedDiscard(cards);
			trigger.num++;
			if (trigger.card && trigger.getParent(2).addCount !== false) {
				trigger.getParent(2).addCount = false;
				const stat = player.getStat("card");
				const name = trigger.card.name;
				if (typeof stat[name] === "number" && stat[name] > 0) {
					stat[name]--;
				}
			}
		},
	},
	psfeiying: {
		locked: true,
		mod: {
			targetInRange: () => true,
		},
	},
	//官盗S系列关羽
	pszhonghun: {
		audio: "zhongyi",
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			return get.color(event.card) === "red";
		},
		frequent: true,
		async content(event, trigger, player) {
			const card = game.cardsGotoOrdering(get.cards()).cards[0];
			game.updateRoundNumber();
			await player.showCards(card, `${get.translation(player)}发动了【忠魂】`);
			if (get.color(card) === "red") {
				await player.gain({
					cards: [card],
					animate: "gain2",
				});
			}
		},
	},
	//官盗S系列郭嘉·一版
	psqizuo: {
		trigger: { global: ["damageBegin1", "damageBegin3"] },
		filter(event, player, name) {
			return (name === "damageBegin1" && event.source && event.source.isIn() && player.inRange(event.source)) || (name === "damageBegin3" && event.player && event.player.isIn() && player.inRange(event.player));
		},
		direct: true,
		async content(event, trigger, player) {
			const name = event.triggername;
			const source = get.translation(trigger.source);
			const target = get.translation(trigger.player);
			const num = trigger.num;
			const targetx = trigger[name === "damageBegin1" ? "source" : "player"];
			const description = name === "damageBegin1" ? `${source}即将对${target}造成${num}点伤害` : `${target}即将受到${source}造成的${num}点伤害`;
			const effect = get.damageEffect(trigger.player, trigger.source, player);
			const goon =
				(effect > 5 &&
					!trigger.player.hasSkillTag("filterDamage", null, {
						player,
						card: trigger.card,
					})) ||
				effect < -5;
			const discardResult = await player
				.chooseToDiscard({
					prompt: get.prompt("psqizuo", targetx),
					prompt2: `${description}，是否弃置一张牌并判定，若结果颜色与此牌相同，你可以令此伤害+1或-1？`,
					position: "he",
				})
				.set("ai", card => {
					if (_status.event.goon) {
						return 5.25 - get.value(card) + (get.color(card) === get.color(_status.pileTop) ? 0.75 : 0);
					}
					return 0;
				})
				.set("goon", goon)
				.set("logSkill", ["psqizuo", targetx])
				.forResult();
			if (!discardResult.bool) {
				return;
			}
			event.color = get.color(discardResult.cards[0], player);
			const judgeResult = await player.judge(card => (get.color(card) === _status.event.getParent("psqizuo").color ? 1 : 0)).forResult();
			if (!judgeResult.bool) {
				return;
			}
			const controlResult = await player
				.chooseControl("+1", "-1", "cancel2")
				.set("prompt", "是否令此伤害+1或-1？")
				.set("ai", () => (_status.event.eff < 0 ? 1 : 0))
				.set("eff", get.damageEffect(trigger.player, trigger.source, player))
				.forResult();
			if (controlResult.index === 0) {
				trigger.num++;
				player.popup(" +1 ", "fire");
				game.log(player, "令此伤害+1");
			} else if (controlResult.index === 1) {
				trigger.num--;
				player.popup(" -1 ", "water");
				game.log(player, "令此伤害-1");
			}
		},
		ai: {
			threaten: 0.8,
		},
	},
	//官盗S系列郭嘉·二版
	psquanmou: {
		trigger: {
			global: "useCardAfter",
		},
		direct: true,
		filter(event, player) {
			return get.type2(event.card) === "trick" && event.player !== player && event.targets?.includes(player) && event.cards.filterInD("odj").length > 0 && player.hasCards("h");
		},
		async content(event, trigger, player) {
			const discardResult = await player
				.chooseToDiscard(get.prompt("psquanmou"), `弃置一张${get.translation(get.color(trigger.card))}手牌，获得${get.translation(trigger.cards)}`, "h", card => get.color(card) === _status.event.color)
				.set("ai", card => _status.event.value - get.value(card))
				.set("logSkill", "psquanmou")
				.set("value", get.value(trigger.cards, player))
				.set("color", get.color(trigger.card))
				.forResult();
			if (!discardResult.bool) {
				return;
			}
			const cards = trigger.cards.filterInD("odj");
			if (cards.filterInD("od").length) {
				await player.gain(cards.filterInD("od"), "gain2");
			}
			if (cards.filterInD("j").length) {
				await player.gain(cards.filterInD("j"), get.owner(cards.filterInD("j")[0]), "give");
			}
		},
	},
	//官盗S赵云·一版
	pshuiqiang: {
		trigger: { player: ["shaMiss", "eventNeutralized"] },
		direct: true,
		clearTime: true,
		filter(event, player) {
			if (!event.card || event.card.name !== "sha") {
				return false;
			}
			return event.target.isIn() && player.canUse("sha", event.target, false) && (player.hasSha() || (_status.connectMode && player.hasCards("h")));
		},
		async content(event, trigger, player) {
			await player
				.chooseToUse({
					prompt: get.prompt2("pshuiqiang", trigger.target),
					filterCard(card, player, event) {
						if (get.name(card) !== "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					filterTarget: trigger.target,
					selectTarget: -1,
				})
				.set("addCount", false)
				.set("logSkill", "pshuiqiang");
		},
	},
	pshuntu: {
		trigger: { source: "damageSource" },
		usable: 1,
		filter(event, player) {
			return event.card && event.card.name === "sha" && event.getParent(2).player === player && event.notLink() && player.isPhaseUsing();
		},
		direct: true,
		clearTime: true,
		async content(event, trigger, player) {
			const result = await player
				.chooseToUse({
					prompt: get.prompt2("pshuntu", trigger.player),
					filterCard(card, player, event) {
						return get.name(card) === "sha" && lib.filter.filterCard.apply(this, arguments);
					},
					filterTarget: trigger.player,
					selectTarget: -1,
				})
				.set("addCount", false)
				.set("logSkill", "pshuntu")
				.forResult();
			if (!result.bool) {
				player.storage.counttrigger.pshuntu--;
			}
		},
	},
	//官盗S赵云·二版
	psqijin: {
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		async content(event, trigger, player) {
			trigger.changeToZero();
			const cards = get.cards(7);
			const orderingEvent = game.cardsGotoOrdering(cards);
			const videoId = lib.status.videoId++;
			game.broadcastAll(
				(player, id, cards) => {
					const title = player === game.me && !_status.auto ? "七进：获得一种颜色的所有牌" : "七进";
					const dialog = ui.create.dialog(title, cards);
					dialog.videoId = id;
				},
				player,
				videoId,
				cards
			);
			const startTime = get.utc();
			game.addVideo("showCards", player, ["七进", get.cardsInfo(cards)]);
			game.addVideo("delay", null, 2);
			await orderingEvent;

			const list = [];
			for (const card of cards) {
				list.add(get.color(card, false));
			}
			list.sort();
			let choice = list[0];
			if (list.length > 0) {
				const cards1 = cards.filter(card => get.color(card) === list[0]);
				const cards2 = cards.filter(card => get.color(card) === list[1]);
				choice = get.value(cards1) * cards1.length > get.value(cards2) * cards2.length ? list[0] : list[1];
			}
			const result = await player
				.chooseControl(list)
				.set("ai", () => _status.event.choice)
				.set("choice", choice)
				.forResult();
			const remainingTime = 1000 - (get.utc() - startTime);
			if (remainingTime > 0) {
				await game.delay(0, remainingTime);
			}
			game.broadcastAll("closeDialog", videoId);
			await player.gain(
				cards.filter(card => get.color(card, false) === result.control),
				"gain2"
			);
		},
		ai: {
			threaten: 1.5,
		},
	},
	psqichu: {
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (player !== _status.currentPhase && !player.hasSkill("psqichu_used") && get.type(name) === "basic" && lib.inpile.includes(name)) {
				return true;
			}
		},
		filter(event, player) {
			if (event.responded || player === _status.currentPhase || player.hasSkill("psqichu_used")) {
				return false;
			}
			for (const name of lib.inpile) {
				if (get.type(name) === "basic" && event.filterCard({ name }, player, event)) {
					return true;
				}
			}
			return false;
		},
		delay: false,
		async content(event, trigger, player) {
			player.addTempSkill("psqichu_used");
			const parentEvent = event.getParent(2);
			const cards = get.cards(2, true);
			const hasAozhan = player.hasSkill("aozhan");
			const buttonResult = await player
				.chooseButton([`七出：选择要${parentEvent.name === "chooseToUse" ? "使用" : "打出"}的牌`, cards])
				.set("filterButton", button => _status.event.cards.includes(button.link))
				.set(
					"cards",
					cards.filter(card => {
						if (get.type(card) !== "basic") {
							return false;
						}
						if (hasAozhan && card.name === "tao") {
							return (
								parentEvent.filterCard(
									{
										name: "sha",
										isCard: true,
										cards: [card],
									},
									parentEvent.player,
									parentEvent
								) ||
								parentEvent.filterCard(
									{
										name: "shan",
										isCard: true,
										cards: [card],
									},
									parentEvent.player,
									parentEvent
								)
							);
						}
						return parentEvent.filterCard(card, parentEvent.player, parentEvent);
					})
				)
				.set("ai", button => {
					const chooseEvent = _status.event.getParent(3);
					if (!chooseEvent?.ai) {
						return 1;
					}
					const currentEvent = _status.event;
					_status.event = chooseEvent;
					const result = (chooseEvent.ai || event.ai1)(button.link, _status.event.player, chooseEvent);
					_status.event = currentEvent;
					return result;
				})
				.forResult();
			if (!buttonResult.bool || !buttonResult.links?.length) {
				parentEvent.goto(0);
				return;
			}
			const selectedCard = buttonResult.links[0];
			let name = selectedCard.name;
			const aozhan = player.hasSkill("aozhan") && name === "tao";
			if (aozhan) {
				name = parentEvent.filterCard(
					{
						name: "sha",
						isCard: true,
						cards: [event.card],
					},
					parentEvent.player,
					parentEvent
				)
					? "sha"
					: "shan";
			}
			if (parentEvent.name !== "chooseToUse") {
				delete parentEvent.result.used;
				delete parentEvent.result.skill;
				parentEvent.result.card = get.autoViewAs(selectedCard);
				if (aozhan) {
					parentEvent.result.card.name = name;
				}
				parentEvent.result.cards = [selectedCard];
				parentEvent.redo();
				return;
			}
			game.broadcastAll(
				(card, name) => {
					lib.skill.psqichu_backup.viewAs = {
						name,
						cards: [card],
						isCard: true,
					};
					lib.skill.psqichu_backup.prompt = `选择${get.translation(card)}的目标`;
				},
				selectedCard,
				name
			);
			parentEvent.set("_backupevent", "psqichu_backup");
			parentEvent.backup("psqichu_backup");
			parentEvent.goto(0);
		},
		ai: {
			effect: {
				target(card, player, target, effect) {
					if (target.hasSkill("psqichu_used")) {
						return;
					}
					if (get.tag(card, "respondShan")) {
						return 0.7;
					}
					if (get.tag(card, "respondSha")) {
						return 0.7;
					}
				},
			},
			order: 11,
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
			backup: {
				async precontent(event) {
					const name = event.result.card.name;
					event.result.cards = event.result.card.cards;
					event.result.card = get.autoViewAs(event.result.cards[0]);
					event.result.card.name = name;
					event.result._apply_args = { addSkillCount: false };
				},
				filterCard: () => false,
				selectCard: -1,
				log: false,
			},
			used: { charlotte: true },
		},
	},
	pslongxin: {
		trigger: { player: "phaseJudgeBegin" },
		filter(event, player) {
			return player.hasCards("j") && player.hasCards("h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard({
					prompt: get.prompt2("pslongxin"),
					filterCard: { type: "equip" },
					position: "he",
					chooseonly: true,
					ai: card => (_status.event.goon ? 15 - get.value(card) : 0),
				})
				.set(
					"goon",
					player.hasCard(card => {
						const cardj = card.viewAs ? { name: card.viewAs } : card;
						return get.effect(player, cardj, player, player) < 0;
					}, "j")
				)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discard({
				cards: event.cards,
				discarder: player,
			});
			await player.discardPlayerCard({
				target: player,
				position: "j",
				forced: true,
			});
		},
	},
	//官盗S周瑜·一版
	psoldshiyin: {
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		frequent: true,
		filter(event, player) {
			if (player !== _status.currentPhase) {
				return false;
			}
			return event.getg(player).filter(i => get.owner(i) === player).length > 0;
		},
		async content(event, trigger, player) {
			await player.showCards(
				trigger.getg(player).filter(i => get.owner(i) === player),
				`${get.translation(player)}发动了【识音】`
			);
			const suits = [];
			const cards = trigger.getg(player).filter(i => get.owner(i) === player);
			for (const card of cards) {
				suits.add(get.suit(card, player));
			}
			player.addTempSkill("psoldshiyin_effect");
			if (!player.storage.psoldshiyin_effect) {
				player.storage.psoldshiyin_effect = 0;
			}
			player.storage.psoldshiyin_effect = Math.max(player.storage.psoldshiyin_effect, suits.length);
			if (suits.length >= 2) {
				player.addMark("psoldshiyin_damage", 1, false);
			}
		},
		subSkill: {
			effect: {
				trigger: { player: "useCard" },
				charlotte: true,
				forced: true,
				onremove: ["psoldshiyin_effect", "psoldshiyin_damage"],
				async content(event, trigger, player) {
					const num = player.countMark("psoldshiyin_effect");
					if (num >= 1) {
						trigger.directHit.addArray(game.players);
					}
					if (num >= 2 && get.tag(trigger.card, "damage")) {
						trigger.baseDamage += player.countMark("psoldshiyin_damage");
					}
					if (num >= 3) {
						player.draw();
					}
					player.removeSkill("psoldshiyin_effect");
				},
				mod: {
					aiOrder(player, card, num) {
						const numx = player.countMark("psoldshiyin_effect");
						if (numx >= 2 && get.tag(card, "damage")) {
							return num + 10;
						}
					},
				},
			},
		},
	},
	//官盗S周瑜·二版
	psshiyin: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		locked: false,
		group: "psshiyin_change",
		filter(event, player) {
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard({
					prompt: get.prompt("psshiyin"),
					prompt2: "将一张手牌置于武将牌上，称为“杂音”牌",
					ai: card => 20 - get.value(card),
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.addToExpansion({
				cards: event.cards,
				source: player,
				animate: "give",
				gaintag: ["psshiyin"],
			});
		},
		marktext: "音",
		intro: {
			name: "杂音",
			name2: "杂音",
			content: "expansion",
			markcount: "expansion",
		},
		subSkill: {
			change: {
				trigger: { player: "phaseUseBegin" },
				direct: true,
				filter(event, player) {
					return player.hasExpansions("psshiyin") && player.hasCards("h");
				},
				async content(event, trigger, player) {
					const card = player.getExpansions("psshiyin")[0];
					const suits = lib.suit
						.slice()
						.map(suit => [suit, (get.suit(card) === suit ? 1 : 0) + player.countCards("h", { suit })])
						.filter(item => item[1] > 0);
					suits.sort((a, b) => a[1] - b[1]);
					const suit = suits.length > 0 ? suits[0][0] : null;
					const result = await player
						.chooseCard({
							prompt: get.prompt("psshiyin"),
							prompt2: `用一张手牌替换“杂音”牌（${get.translation(card)}）`,
							ai: card => (_status.event.suit && get.suit(card) === _status.event.suit ? 8 - get.value(card) : 0),
						})
						.set("suit", suit)
						.forResult();
					if (!result.bool) {
						return;
					}
					player.logSkill("psshiyin");
					const cardToGain = player.getExpansions("psshiyin")[0];
					await player.addToExpansion({
						cards: [result.cards[0]],
						source: player,
						animate: "give",
						gaintag: ["psshiyin"],
					});
					if (!cardToGain) {
						return;
					}
					await player.gain({
						cards: [cardToGain],
						animate: "gain2",
					});
				},
			},
		},
		ai: {
			combo: "psliaozou",
		},
	},
	psquwu: {
		forced: true,
		trigger: { target: "useCardToBefore" },
		filter(event, player) {
			return player.hasExpansions("psshiyin") && get.suit(player.getExpansions("psshiyin")[0]) === get.suit(event.card);
		},
		async content(event, trigger, player) {
			trigger.cancel();
		},
		ai: {
			threaten: 1.1,
			combo: "psshiyin",
			effect: {
				target(card, player, target, current) {
					const list = target.getExpansions("psshiyin");
					for (const cardx of list) {
						if (get.suit(cardx) === get.suit(card)) {
							return "zeroplayertarget";
						}
					}
				},
			},
		},
		mod: {
			cardEnabled2(card, player) {
				const list = player.getExpansions("psshiyin");
				for (const cardx of list) {
					if (get.suit(cardx) === get.suit(card)) {
						return false;
					}
				}
			},
			cardRespondable(card, player) {
				const list = player.getExpansions("psshiyin");
				for (const cardx of list) {
					if (get.suit(cardx) === get.suit(card)) {
						return false;
					}
				}
			},
			cardSavable(card, player) {
				const list = player.getExpansions("psshiyin");
				for (const cardx of list) {
					if (get.suit(cardx) === get.suit(card)) {
						return false;
					}
				}
			},
		},
	},
	psliaozou: {
		enable: "phaseUse",
		locked: false,
		filter(event, player) {
			return !player.hasSkill("psliaozou_blocker", null, null, false) && player.hasExpansions("psshiyin");
		},
		async content(event, trigger, player) {
			await player.showHandcards(`${get.translation(player)}发动了【聊奏】`);
			const cards = player.getExpansions("psshiyin");
			const hasMatchingSuit = cards.some(card => {
				const suit = get.suit(card);
				return player.hasCard(cardx => get.suit(cardx) === suit);
			});
			if (hasMatchingSuit) {
				player.addTempSkill("psliaozou_blocker", {
					player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
				});
				return;
			}
			await player.draw();
		},
		subSkill: {
			blocker: { charlotte: true },
		},
		mod: {
			aiValue(player, card, num) {
				const suit = get.suit(card);
				if (player.isPhaseUsing() && player.getExpansions("psshiyin").some(i => get.suit(i) === suit)) {
					return num / 5;
				}
			},
			aiUseful() {
				return lib.skill.psliaozou.mod.aiValue.apply(this, arguments);
			},
		},
		ai: {
			combo: "psshiyin",
			order: 9.9,
			result: {
				player(player) {
					const cards = player.getExpansions("psshiyin");
					for (const card of cards) {
						const suit = get.suit(card);
						if (player.hasCard(cardx => get.suit(cardx) === suit)) {
							return 0;
						}
					}
					return 1;
				},
			},
		},
	},
	//官盗S武将传晋司马
	psquanyi: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		group: "psquanyi_tianbian",
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player
				.chooseToCompare(target, card => {
					if (typeof card === "string" && lib.skill[card]) {
						const ais = lib.skill[card].check || (() => 0);
						return ais();
					}
					const cardOwner = get.owner(card);
					const getn = card => {
						if (cardOwner.hasSkill("tianbian") && get.suit(card) === "heart") {
							return 13;
						}
						return get.number(card);
					};
					const compareEvent = _status.event.getParent();
					const to = cardOwner === compareEvent.player ? compareEvent.target : compareEvent.player;
					let addi = get.value(card) >= 8 && get.type(card) !== "equip" ? -6 : 0;
					if (card.name === "du") {
						addi -= 5;
					}
					if (get.color(card) === "black") {
						addi -= 6;
					}
					if (cardOwner === compareEvent.player) {
						if (compareEvent.small) {
							return -getn(card) - get.value(card) / 2 + addi;
						}
						return getn(card) - get.value(card) / 2 + addi;
					}
					if (get.attitude(cardOwner, to) <= 0 === Boolean(compareEvent.small)) {
						return -getn(card) - get.value(card) / 2 + addi;
					}
					return getn(card) - get.value(card) / 2 + addi;
				})
				.forResult();
			if (result.tie) {
				return;
			}
			const targets = [player, target];
			if (!result.bool) {
				targets.reverse();
			}
			const suits = [result.player, result.target].map(card => get.suit(card, false));
			if (suits.includes("heart") && targets[1].countGainableCards("hej", targets[0]) > 0) {
				await targets[0].gainPlayerCard(targets[1], "hej", true);
			}
			if (suits.includes("diamond")) {
				await targets[1].damage(targets[0]);
			}
			if (suits.includes("spade")) {
				await targets[0].loseHp();
			}
			if (suits.includes("club") && targets[0].countDiscardableCards(targets[0], "he")) {
				await targets[0].chooseToDiscard(2, true, "he");
			}
		},
		ai: {
			order: 6,
			result: {
				target: -1,
			},
		},
		subSkill: {
			tianbian: {
				audio: "psquanyi",
				enable: "chooseCard",
				check(event) {
					const player = _status.event.player;
					if (player.hasSkill("smyyingshi")) {
						const card = ui.cardPile.childNodes[0];
						if ((get.color(card) === "black" && get.number(card) <= 4) || (get.color(card) === "red" && get.number(card) >= 11)) {
							return 20;
						}
					}
					return player.hasCard(card => {
						const val = get.value(card);
						return val < 0 || (get.color(card) === "black" && val <= 4) || (get.color(card) === "red" && get.number(card) >= 11);
					}, "h")
						? 0
						: 20;
				},
				filter(event) {
					return event.type === "compare" && !event.directresult;
				},
				onCompare(player) {
					return game.cardsGotoOrdering(get.cards()).cards;
				},
			},
		},
	},
	//官盗S曹植
	psliushang: {
		trigger: { player: "phaseDrawBegin1" },
		forced: true,
		filter(event, player) {
			return !event.numFixed;
		},
		group: "psliushang_give",
		async content(event, trigger, player) {
			trigger.changeToZero();
			const drawEvent = player.draw(1 + Math.max(3, game.countPlayer()));
			const targets = game.filterPlayer(current => current !== player);
			await drawEvent;
			for (const current of targets) {
				if (!player.hasCards("h")) {
					return;
				}
				const result = await player
					.chooseCardTarget({
						prompt: `流殇：将一张牌置于${get.translation(current)}武将牌上`,
						current,
						filterCard: true,
						forced: true,
						filterTarget(card, player, target) {
							return target === _status.event.current;
						},
						selectTarget: -1,
						ai1(card) {
							const current = _status.event.current;
							return get.value(card, current) * get.attitude(_status.event.player, current);
						},
						ai2: () => 1,
					})
					.forResult();
				if (result.bool) {
					const next = result.targets[0].addToExpansion(result.cards, player, "give");
					next.gaintag.add("psliushang");
					await next;
				}
			}
		},
		marktext: "殇",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		subSkill: {
			give: {
				trigger: { global: "phaseZhunbeiBegin" },
				filter(event, player) {
					return event.player !== player && event.player.getExpansions("psliushang").length;
				},
				forced: true,
				logTarget: "player",
				async content(event, trigger, player) {
					const cards = trigger.player.getExpansions("psliushang");
					const name = get.translation(cards);
					let choice = 0;
					if (get.damageEffect(player, trigger.player, trigger.player) > 0 && (get.value(cards, trigger.player) < 0 || trigger.player.hasCard(card => get.tag(card, "damage") && trigger.player.canUse(card, player) && get.effect(player, card, trigger.player, trigger.player) > 0, "hs"))) {
						choice = 1;
					}
					const result = await trigger.player
						.chooseControl()
						.set("choiceList", [`获得${name}，且于本回合防止对${get.translation(player)}的伤害`, `将${name}置入弃牌堆`])
						.set("ai", () => _status.event.choice)
						.set("choice", choice)
						.forResult();
					if (result.index === 0) {
						const next = trigger.player.gain(cards, "gain2");
						trigger.player.addTempSkill("psliushang_prevent");
						trigger.player.markAuto("psliushang_prevent", [player]);
						await next;
					} else {
						await trigger.player.loseToDiscardpile(cards);
					}
					await game.delayx();
				},
			},
			prevent: {
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					return player.getStorage("psliushang_prevent").includes(event.player);
				},
				forced: true,
				onremove: true,
				charlotte: true,
				logTarget: "player",
				async content(event, trigger, player) {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (player.getStorage("psliushang_prevent").includes(target) && get.tag(card, "damage")) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	psqibu: {
		trigger: { player: "dying" },
		filter(event, player) {
			return player.hp <= 0;
		},
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cards = game.cardsGotoOrdering(get.cards(7)).cards;
			game.updateRoundNumber();
			await player.showCards(cards, `${get.translation(player)}发动了【流殇】`);
			const num = cards.filter(card => get.suit(card) === "heart").length;
			const gains = cards.filter(card => get.suit(card) === "club");
			if (num > 0) {
				await player.recover(num);
			}
			if (gains.length) {
				await player.gain({
					cards: gains,
					animate: "gain2",
				});
			}
		},
	},
	//官盗S曹丕
	psjianwei: {
		trigger: { player: "phaseBegin" },
		skillAnimation: true,
		animationColor: "water",
		limited: true,
		filter(event, player) {
			return player.hp >= 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("psjianwei"),
					filterTarget: lib.filter.notMe,
					ai(target) {
						const player = get.player();
						if (player.hp === 1 && !player.canSave(player)) {
							return 0;
						}
						const sgn = get.sgnAttitude(player, target);
						const valMine = [0, 0];
						const valHis = [0, 0];
						for (const card of player.iterableGetCards("hej")) {
							if (get.position(card) === "j") {
								valMine[0] += get.effect(player, card, player);
								valMine[1] += get.effect(target, card, player);
							} else {
								valMine[0] += get.value(card, player);
								valMine[1] += get.value(card, target) * sgn;
							}
						}
						for (const card of target.iterableGetCards("hej")) {
							if (get.position(card) === "j") {
								valHis[0] += get.effect(player, card, player);
								valHis[1] += get.effect(target, card, player);
							} else {
								valHis[0] += get.value(card, player);
								valHis[1] += get.value(card, target) * sgn;
							}
						}
						return valMine[1] - valMine[0] + valHis[0] - valHis[1] >= 60 ? 1 : 0;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.awakenSkill(event.name);
			await player.loseHp();
			if (!player.isIn() || !target.isIn()) {
				return;
			}
			const next = game.createEvent("psjianwei_swap");
			next.player = player;
			next.target = target;
			next.set("cards1", player.getCards("hej"));
			next.set("cards2", target.getCards("hej"));
			next.setContent(lib.skill.psjianwei.swapRegioncards);
			await next;
		},
		async swapRegioncards(event, trigger, player) {
			const { target, cards1, cards2 } = event;
			player.$giveAuto(cards1, target);
			target.$giveAuto(cards2, player);
			const h1 = cards1.filter(card => get.position(card) === "h");
			const e1 = cards1.filter(card => get.position(card) === "e");
			const j1 = cards1.filter(card => get.position(card) === "j");
			const h2 = cards2.filter(card => get.position(card) === "h");
			const e2 = cards2.filter(card => get.position(card) === "e");
			const j2 = cards2.filter(card => get.position(card) === "j");
			await game
				.loseAsync({
					lose_list: [
						[player, cards1],
						[target, cards2],
					],
				})
				.setContent("chooseToCompareLose");
			const toDiscard = [];
			for (const card of j1) {
				if (target.isDisabledJudge() || target.hasJudge(card.viewAs || card.name)) {
					toDiscard.push(card);
				}
			}
			for (const card of j2) {
				if (player.isDisabledJudge() || player.hasJudge(card.viewAs || card.name)) {
					toDiscard.push(card);
				}
			}
			if (toDiscard.length) {
				await game.cardsDiscard(toDiscard);
			}
			const nextEvents = [
				game
					.loseAsync({
						gain_list: [
							[player, h2.filter(card => get.position(card, true) === "o")],
							[target, h1.filter(card => get.position(card, true) === "o")],
						],
					})
					.setContent("gaincardMultiple"),
			];
			for (const card of e2) {
				if (get.position(card, true) !== "o") {
					continue;
				}
				nextEvents.push(player.equip(card));
			}
			for (const card of e1) {
				if (get.position(card, true) !== "o") {
					continue;
				}
				nextEvents.push(target.equip(card));
			}
			for (const card of j2) {
				if (get.position(card, true) !== "o") {
					continue;
				}
				nextEvents.push(player.addJudge(card));
			}
			for (const card of j1) {
				if (get.position(card, true) !== "o") {
					continue;
				}
				nextEvents.push(target.addJudge(card));
			}
			for (const next of nextEvents) {
				await next;
			}
			await game.delayx();
		},
	},
	//官盗S司马懿
	pszhonghu: {
		trigger: { global: "dieAfter" },
		global: "pszhonghu_skip",
		filter(event, player) {
			return player !== _status.currentPhase;
		},
		async content(event, trigger, player) {
			const evt = trigger.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
			const evtx = trigger.getParent("phase");
			if (evtx) {
				game.log(evtx.player, "结束了回合");
				evtx.num = evtx.phaseList.length;
				evtx.goto(11);
			}
			_status._pszhonghu = player;
		},
		subSkill: {
			skip: {
				trigger: { player: "phaseBeforeStart" },
				forced: true,
				priority: Infinity,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if ((_status._pszhonghu && !_status._pszhonghu.isIn()) || event.player === _status._pszhonghu) {
						delete _status._pszhonghu;
					}
					return _status._pszhonghu && event.player !== _status._pszhonghu;
				},
				async content(event, trigger, player) {
					trigger.cancel(null, null, "notrigger");
				},
			},
		},
	},
	//官盗S虎啸龙吟司马懿&诸葛亮
	pshuxiao: {
		trigger: { player: "phaseBegin" },
		frequent: true,
		async content(event, trigger, player) {
			const result = await player
				.judge({
					judge: card => (["basic", "trick"].includes(get.type(card)) ? 3 : -1),
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			player.addTempSkill("pshuxiao_use");
			player.storage.pshuxiao_use = {
				card: { name: result.name, nature: result.card.nature },
				number: result.number,
				suit: result.suit,
			};
		},
		subSkill: {
			use: {
				charlotte: true,
				onremove: true,
				enable: "chooseToUse",
				popname: true,
				position: "hs",
				hiddenCard(player, name) {
					return player.storage.pshuxiao_use.card.name === name;
				},
				filter(event, player) {
					if (!player.storage.pshuxiao_use) {
						return false;
					}
					if (!player.countCards("h")) {
						return false;
					}
					return event.filterCard(player.storage.pshuxiao_use.card, player, event);
				},
				viewAs(cards, player) {
					return player.storage.pshuxiao_use.card;
				},
				filterCard(card, player) {
					return get.number(card) === player.storage.pshuxiao_use.number || get.suit(card) === player.storage.pshuxiao_use.suit;
				},
				prompt(event) {
					const player = _status.event.player;
					const { suit, number, card } = player.storage.pshuxiao_use;
					return `将一张${get.translation(suit)}牌或点数为${get.strNumber(number)}的牌当作${get.translation(card)}使用`;
				},
			},
		},
	},
	psguanxing: {
		audio: "guanxing",
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		preHidden: true,
		async content(event, trigger, player) {
			const result = await player.chooseToGuanxing(5).set("prompt", "观星：点击或拖动将牌移动到牌堆顶或牌堆底").forResult();
			if (!result.bool || !result.moved[0].length) {
				player.addTempSkill("guanxing_fail");
			}
		},
		ai: {
			threaten: 1.2,
			guanxing: true,
		},
	},
	pslongyin: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countCards("hse") || player.hasSkill("pslongyin_used")) {
				return false;
			}
			for (const i of lib.inpile) {
				const type = get.type(i);
				if ((type === "basic" || type === "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				for (const name of lib.inpile) {
					if (name === "sha") {
						if (event.filterCard({ name: name }, player, event)) {
							list.push(["基本", "", "sha"]);
						}
						for (const j of lib.inpile_nature) {
							if (event.filterCard({ name: name, nature: j }, player, event)) {
								list.push(["基本", "", "sha", j]);
							}
						}
					} else if (get.type(name) === "trick" && event.filterCard({ name: name }, player, event)) {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) === "basic" && event.filterCard({ name: name }, player, event)) {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("虎啸", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
			},
			check(button) {
				if (_status.event.getParent().type !== "phase") {
					return 1;
				}
				const player = _status.event.player;
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) {
					return 0;
				}
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					filterCard(card, player) {
						let num = 0;
						for (const selectedCard of ui.selected.cards) {
							num += get.number(selectedCard);
						}
						return get.number(card) + num <= 13;
					},
					selectCard: [1, Infinity],
					filterOk() {
						let num = 0;
						for (const selectedCard of ui.selected.cards) {
							num += get.number(selectedCard);
						}
						return num === 13;
					},
					audio: "pslongyin",
					popname: true,
					complexCard: true,
					check(card) {
						let num = 0;
						for (const selectedCard of ui.selected.cards) {
							num += get.number(selectedCard);
						}
						if (num + get.number(card) === 13) {
							return 5.5 - get.value(card);
						}
						if (ui.selected.cards.length === 0) {
							const cards = _status.event.player.getCards("h");
							for (const [index, firstCard] of cards.entries()) {
								for (const secondCard of cards.slice(index + 1)) {
									if (get.number(firstCard) + get.number(secondCard) === 13 && (firstCard === card || secondCard === card)) {
										return 6 - get.value(card);
									}
								}
							}
						}
						return 0;
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
					async precontent(event, trigger, player) {
						player.addTempSkill("pslongyin_used");
					},
				};
			},
			prompt(links, player) {
				return `将任意张点数和为13牌当做${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}使用`;
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			const type = get.type(name);
			return (type === "basic" || type === "trick") && player.countCards("she") > 0 && !player.hasSkill("pslongyin_used");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countCards("hse") || player.hasSkill("pslongyin_used")) {
					return false;
				}
			},
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
		subSkill: {
			used: { charlotte: true },
		},
	},
	//官盗S武将传诸葛亮
	pszhiji: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return !ui.selected.targets.length || target.group !== ui.selected.targets[0].group;
		},
		selectTarget: 2,
		complexTarget: true,
		multitarget: true,
		multiline: true,
		filterCard: true,
		selectCard: 2,
		check(card) {
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			const { targets } = event;
			targets.sortBySeat();
			if (targets[0].canUse("sha", targets[1], false)) {
				await targets[0].useCard({
					card: get.autoViewAs({ name: "sha", isCard: true }),
					targets: [targets[1]],
					addCount: false,
					noai: true,
				});
			}
			if (targets[1].canUse("sha", targets[0], false)) {
				await targets[1].useCard({
					card: get.autoViewAs({ name: "sha", isCard: true }),
					targets: [targets[0]],
					addCount: false,
					noai: true,
				});
			}
		},
		ai: {
			order: 2.5,
			result: {
				player: 1,
				target(player, target) {
					if (!ui.selected.targets.length) {
						return -1;
					}
					const targetx = ui.selected.targets[0];
					if (get.effect(targetx, { name: "sha" }, target, player) + get.effect(target, { name: "sha" }, targetx, player) < 0) {
						return 0;
					}
					return -1;
				},
			},
		},
	},
	psjiefeng: {
		enable: "phaseUse",
		filterCard: true,
		selectCard: 2,
		check(card) {
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			const orderingEvent = game.cardsGotoOrdering(get.cards(5));
			const { cards } = orderingEvent;
			event.cards = cards;
			await orderingEvent;
			await player.showCards(cards, `${get.translation(player)}发动了【借风】`);
			if (cards.filter(card => get.color(card) === "red").length < 2) {
				return;
			}
			await player.chooseUseTarget({
				card: get.autoViewAs({ name: "wanjian", isCard: true }),
				forced: true,
			});
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (player.getUseValue({ name: "wanjian" }) < 0) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	//官盗S马超
	psweihou: {
		trigger: { player: "judgeBegin" },
		filter(event, player) {
			return !event.directresult;
		},
		async content(event, trigger, player) {
			const cards = get.cards(2, true);
			const videoId = lib.status.videoId++;
			game.broadcastAll(
				(player, id, cards) => {
					const title = player === game.me && !_status.auto ? "威侯：选择一张作为本次判定结果" : `${get.translation(player)}发动了【威侯】`;
					const dialog = ui.create.dialog(title, cards);
					dialog.videoId = id;
				},
				player,
				videoId,
				cards
			);
			game.addVideo("showCards", player, ["威侯", get.cardsInfo(cards)]);
			if (!event.isMine() && !event.isOnline()) {
				await game.delayx();
			}
			const result = await player
				.chooseButton({
					createDialog: ["威侯：选择一张作为本次判定结果", cards],
					forced: true,
					ai(button) {
						return _status.event.getTrigger().judge(button.link);
					},
				})
				.set("dialog", videoId)
				.forResult();
			game.broadcastAll("closeDialog", videoId);
			if (result.bool) {
				trigger.directresult = result.links[0];
				await game.cardsDiscard(cards.removeArray(result.links).filter(card => get.position(card) === "c"));
			}
			game.updateRoundNumber();
		},
	},
	//官盗S1066★贾诩
	psqupo: {
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return player.countCards("he") && game.countPlayer() > 2;
		},
		async cost(event, trigger, player) {
			const cards = player.getCards("he");
			const { player: current } = trigger;
			const targets = game.filterPlayer(currentx => {
				if (currentx === current || current === player) {
					return false;
				}
				return !current.canUse("sha", currentx) || (get.effect(currentx, { name: "sha" }, current, player) > 0 && get.attitude(player, currentx) > -3);
			});
			const targets2 = game.filterPlayer(currentx => {
				if (currentx === current || current === player) {
					return false;
				}
				return current.hasCard(card => current.canUse(card, currentx) && get.effect(currentx, card, current, player) > 0 && get.color(card) === "red" && get.tag(card, "damage") && get.type(card) !== "delay", "hs");
			});
			event.result = await player
				.chooseCardTarget({
					filterCard: true,
					position: "he",
					prompt: get.prompt2(event.skill),
					current: current,
					targets1: targets,
					targets2: targets2,
					filterTarget(card, player, target) {
						return player !== target && target !== get.event().current;
					},
					ai1(card) {
						const { player, current, targets1, targets2 } = get.event();
						const color = get.color(card);
						if (!targets2.length) {
							if (get.effect(current, { name: "losehp" }, player, player) < 0) {
								return 0;
							}
							if (color !== "black" || !targets1.length) {
								return 0;
							}
							return 5.5 - get.value(card);
						}
						targets2.sort((a, b) => get.threaten(b, current) - get.threaten(a, current));
						if (!targets1.length) {
							if (color !== "red") {
								return 0;
							}
							if (get.attitude(player, current) <= 0) {
								return 0;
							}
							return 5.5 - get.value(card);
						}
						const target = targets2[0];
						const color1 = get.effect(current, { name: "losehp" }, player, player) > Math.max(0, get.effect(target, { name: "losehp" }, player, player)) ? "black" : "red";
						if (color !== color1) {
							return 0;
						}
						return 6 - get.value(card);
					},
					ai2(target) {
						if (!ui.selected.cards.length) {
							return 0;
						}
						const { player, current, targets1, targets2 } = get.event();
						const color = get.color(ui.selected.cards[0]);
						if (!["red", "black"].includes(color)) {
							return 0;
						}
						if (color === "black") {
							if (!targets1.includes(target)) {
								return 0;
							}
							return get.attitude(player, target) + 0.1;
						}
						if (!targets2.includes(target)) {
							return 0;
						}
						return get.effect(target, { name: "losehp" }, player, player);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			await player.give(cards, target);
			const color = get.color(cards[0]);
			const skill = `${event.name}_${color}`;
			if (color === "black") {
				trigger.player.addTempSkill(skill);
				trigger.player.markAuto(skill, [target]);
			} else if (color === "red") {
				target.addTempSkill(skill);
				target.addMark(skill, 1, false);
			}
		},
		subSkill: {
			black: {
				trigger: { player: "useCardToPlayer" },
				charlotte: true,
				onremove: true,
				forced: true,
				popup: false,
				filter(event, player) {
					if (event.card.name !== "sha") {
						return false;
					}
					return !player.getStorage("psqupo_black").includes(event.target);
				},
				async content(event, trigger, player) {
					player.loseHp();
				},
				intro: { content: "本回合使用【杀】指定不为$的目标时失去1点体力" },
			},
			red: {
				trigger: { player: "damageBegin3" },
				charlotte: true,
				onremove: true,
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.loseHp(player.countMark(event.name));
					player.removeSkill(event.name);
				},
				intro: { content: "本回合下一次受到伤害时失去#点体力" },
			},
		},
	},
	psbaoquan: {
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return _status.connectMode || player.hasCards("h", { type: ["trick", "delay"] });
		},
		direct: true,
		async content(event, trigger, player) {
			const result = await player
				.chooseToDiscard({
					prompt: get.prompt2("psbaoquan"),
					filterCard: { type: ["trick", "delay"] },
					ai: card => (_status.event.goon ? 7 - get.value(card) : 0),
				})
				.set("logSkill", "psbaoquan")
				.set("goon", get.damageEffect(player, trigger.source, player) < -5)
				.forResult();
			if (!result.bool) {
				return;
			}
			trigger.cancel();
		},
	},
	//官盗S吕布
	pssheji: {
		enable: "phaseUse",
		filterCard: true,
		selectCard: -1,
		position: "h",
		locked: false,
		filter(event, player) {
			if (player.hasSkill("pssheji_used")) {
				return false;
			}
			const hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (const card of hs) {
				if (game.checkMod(card, player, "unchanged", "cardEnabled2", player) === false) {
					return false;
				}
			}
			return event.filterCard(get.autoViewAs({ name: "sha" }, hs));
		},
		viewAs: {
			name: "sha",
			storage: { pssheji: true },
		},
		onuse(links, player) {
			player.addTempSkill("pssheji_used", "phaseUseAfter");
		},
		ai: {
			order: 1,
			threaten: 1.1,
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.storage && card.storage.pssheji) {
					return true;
				}
			},
		},
		subSkill: {
			used: {
				audio: "pssheji",
				trigger: { source: "damageSource" },
				charlotte: true,
				forced: true,
				popup: false,
				logTarget: "player",
				filter(event, player) {
					return event.card.storage && event.card.storage.pssheji && event.player.hasCard(card => lib.filter.canBeGained(card, player, event.player) && ["equip1", "equip3", "equip4", "equip6"].includes(get.subtype(card)), "e");
				},
				async content(event, trigger, player) {
					const cards = trigger.player.getCards("e", card => lib.filter.canBeGained(card, player, trigger.player) && ["equip1", "equip3", "equip4", "equip6"].includes(get.subtype(card)));
					if (!cards.length) {
						return;
					}
					await player.gain({ cards, source: trigger.player, animate: "giveAuto" });
				},
			},
		},
	},
	//龙羽飞
	longyi: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (event.type === "wuxie") {
				return false;
			}
			const hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (const i of hs) {
				if (game.checkMod(i, player, "unchanged", "cardEnabled2", player) === false) {
					return false;
				}
			}
			for (const i of lib.inpile) {
				if (i !== "du" && get.type(i) === "basic" && event.filterCard({ name: i, cards: hs }, player, event)) {
					return true;
				}
				if (i === "sha") {
					const list = ["fire", "thunder", "ice"];
					for (const j of list) {
						if (event.filterCard({ name: i, nature: j, cards: hs }, player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = [];
				const hs = player.getCards("h");
				for (const i of lib.inpile) {
					if (i !== "du" && get.type(i) === "basic" && event.filterCard({ name: i, cards: hs }, player, event)) {
						vcards.push(["基本", "", i]);
					}
					if (i === "sha") {
						for (const j of lib.inpile_nature) {
							if (event.filterCard({ name: i, nature: j, cards: hs }, player, event)) {
								vcards.push(["基本", "", i, j]);
							}
						}
					}
				}
				return ui.create.dialog("龙裔", [vcards, "vcard"]);
			},
			check(button, player) {
				if (_status.event.getParent().type !== "phase") {
					return 1;
				}
				return _status.event.player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "longyi",
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3] },
					filterCard: true,
					selectCard: -1,
					position: "h",
				};
			},
			prompt(links, player) {
				return `将所有手牌当做${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}使用或打出`;
			},
		},
		hiddenCard(player, name) {
			return name !== "du" && get.type(name) === "basic" && player.countCards("h") > 0;
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				return player.countCards("h") > 0;
			},
			order: 0.5,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					if (_status.event.type === "respondShan") {
						return 1;
					}
					let val = 0;
					const hs = player.getCards("h");
					let max = 0;
					for (const i of hs) {
						val += get.value(i, player);
						if (get.type(i, null, player) === "trick") {
							max += 5;
						}
					}
					if (player.hasSkill("zhenjue")) {
						max += 7;
					}
					return val <= max ? 1 : 0;
				},
			},
		},
		group: "longyi_effect",
		subSkill: {
			effect: {
				trigger: { player: ["useCard", "respond"] },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					if (event.skill !== "longyi_backup") {
						return false;
					}
					for (const i of event.cards) {
						const type = get.type2(i, player);
						if (type === "equip" || type === "trick") {
							return true;
						}
					}
					return false;
				},
				async content(event, trigger, player) {
					const map = {};
					for (const i of trigger.cards) {
						map[get.type2(i, player)] = true;
					}
					if (map.trick) {
						player.draw();
					}
					if (map.equip && trigger.directHit) {
						trigger.directHit.addArray(game.players);
					}
				},
			},
			backup: {},
		},
	},
	zhenjue: {
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return !player.hasCards("h");
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const result = await trigger.player
				.chooseToDiscard({
					position: "he",
					prompt: `弃置一张牌，或令${get.translation(player)}摸一张牌`,
					ai: card => (_status.event.goon ? 7 - get.value(card) : -get.value(card)),
				})
				.set("goon", get.attitude(trigger.player, player) < 0)
				.forResult();
			if (result.bool) {
				return;
			}
			await player.draw();
		},
	},
	//群刘备
	jsprende: {
		audio: "rerende",
		enable: "phaseUse",
		filterCard: true,
		selectCard: [1, Infinity],
		allowChooseAll: true,
		discard: false,
		lose: false,
		delay: false,
		filterTarget(card, player, target) {
			return player !== target;
		},
		onremove: true,
		check(card) {
			if (ui.selected.cards.length && ui.selected.cards[0].name === "du") {
				return 0;
			}
			if (!ui.selected.cards.length && card.name === "du") {
				return 20;
			}
			const player = get.owner(card);
			if (player == null) {
				return 0;
			}
			if (ui.selected.cards.length >= Math.max(2, player.countCards("h") - player.hp)) {
				return 0;
			}
			if (player.hp === player.maxHp || player.storage.jsprende < 0 || player.countCards("h") <= 1) {
				const players = game.filterPlayer();
				for (const current of players) {
					if (current.hasSkill("haoshi") && !current.isTurnedOver() && !current.hasJudge("lebu") && get.attitude(player, current) >= 3 && get.attitude(current, player) >= 3) {
						return 11 - get.value(card);
					}
				}
				if (player.countCards("h") > player.hp) {
					return 10 - get.value(card);
				}
				if (player.countCards("h") > 2) {
					return 6 - get.value(card);
				}
				return -1;
			}
			return 10 - get.value(card);
		},
		async content(event, trigger, player) {
			const { cards, target } = event;
			const phaseUseEvent = event.getParent("phaseUse");
			if (phaseUseEvent?.name === "phaseUse" && !phaseUseEvent.jsprende) {
				const clearEvent = game.createEvent("jsprende_clear");
				event.next.remove(clearEvent);
				phaseUseEvent.after.push(clearEvent);
				phaseUseEvent.jsprende = true;
				clearEvent.player = player;
				clearEvent.setContent(async ({ player }) => {
					delete player.storage.jsprende;
				});
			}
			const giveEvent = player.give(cards, target);
			if (typeof player.storage.jsprende !== "number") {
				player.storage.jsprende = 0;
			}
			if (player.storage.jsprende < 0) {
				await giveEvent;
				return;
			}
			player.storage.jsprende += cards.length;
			if (player.storage.jsprende < 2) {
				await giveEvent;
				return;
			}

			const list = [];
			const chooseToUseEvent = event.getParent("chooseToUse");
			if (lib.filter.cardUsable({ name: "sha", isCard: true }, player, chooseToUseEvent) && game.hasPlayer(current => player.canUse("sha", current))) {
				list.push(["基本", "", "sha"]);
			}
			for (const nature of lib.inpile_nature) {
				const sha = { name: "sha", nature, isCard: true };
				if (lib.filter.cardUsable(sha, player, chooseToUseEvent) && game.hasPlayer(current => player.canUse(sha, current))) {
					list.push(["基本", "", "sha", nature]);
				}
			}
			if (lib.filter.cardUsable({ name: "tao", isCard: true }, player, chooseToUseEvent) && game.hasPlayer(current => player.canUse("tao", current))) {
				list.push(["基本", "", "tao"]);
			}
			if (lib.filter.cardUsable({ name: "jiu", isCard: true }, player, chooseToUseEvent) && game.hasPlayer(current => player.canUse("jiu", current))) {
				list.push(["基本", "", "jiu"]);
			}
			player.storage.jsprende = -1;
			await giveEvent;
			if (!list.length) {
				return;
			}

			const result = await player
				.chooseButton({
					createDialog: ["是否视为使用一张基本牌？", [list, "vcard"]],
					ai: button => {
						const player = _status.event.player;
						const card = {
							name: button.link[2],
							nature: button.link[3],
							isCard: true,
						};
						if (card.name === "tao") {
							if (player.hp === 1 || (player.hp === 2 && !player.hasShan("all")) || player.needsToDiscard()) {
								return 5;
							}
							return 1;
						}
						if (card.name === "sha") {
							if (!game.hasPlayer(current => player.canUse(card, current) && get.effect(current, card, player, player) > 0)) {
								return 0;
							}
							if (card.nature === "fire") {
								return 2.95;
							}
							if (card.nature === "thunder" || card.nature === "ice") {
								return 2.92;
							}
							return 2.9;
						}
						if (card.name === "jiu") {
							return 0.5;
						}
						return 0;
					},
				})
				.forResult();
			if (!result?.bool || !result.links?.[0]) {
				return;
			}
			const card = get.autoViewAs({ name: result.links[0][2], nature: result.links[0][3], isCard: true });
			await player.chooseUseTarget({
				card,
				forced: true,
			});
		},
		ai: {
			fireAttack: true,
			order(skill, player) {
				if (player == null) {
					return 0;
				}
				if (player.hp < player.maxHp && player.storage.jsprende < 2 && player.countCards("h") > 1) {
					return 10;
				}
				return 4;
			},
			result: {
				target(player, target) {
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
					const np = player.countCards("h");
					if (player.hp === player.maxHp || player.storage.jsprende < 0 || player.countCards("h") <= 1) {
						if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) {
							return 0;
						}
					}
					return Math.max(1, 5 - nh);
				},
			},
			effect: {
				target_use(card, player, target) {
					if (player !== target || get.type(card) !== "equip") {
						return;
					}
					if (!player.hasCards("e", { subtype: get.subtype(card) })) {
						return;
					}
					if (game.hasPlayer(current => current !== player && get.attitude(player, current) > 0)) {
						return 0;
					}
				},
			},
			threaten: 0.8,
		},
	},
	//S贾诩
	nsyice: {
		trigger: {
			player: "loseAfter",
			global: ["cardsDiscardAfter", "loseAsyncAfter"],
		},
		filter(event, player) {
			if (event.name === "cardsDiscard") {
				const evt = event.getParent();
				if (evt.name !== "orderingDiscard" || !evt.relatedEvent || evt.relatedEvent.player !== player || !["useCard", "respond"].includes(evt.relatedEvent.name)) {
					return false;
				}
				return event.cards.filterInD("d").length > 0;
			}
			if (event.type !== "discard") {
				return false;
			}
			const evt = event.getl(player);
			return evt.cards2 && evt.cards2.filterInD("d").length > 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const relatedEvent = trigger.getParent().relatedEvent;
			if ((trigger.name === "discard" && !trigger.delay) || (relatedEvent && relatedEvent.name === "respond")) {
				await game.delayx();
			}
			let discardedCards;
			if (trigger.getl) {
				discardedCards = trigger.getl(player).cards2.filterInD("d");
			} else {
				discardedCards = trigger.cards.filterInD("d");
			}
			let result;
			if (discardedCards.length === 1) {
				result = { bool: true, links: discardedCards };
			} else {
				const dialog = ["遗策：选择要放置的卡牌", '<div class="text center">（从左到右为从旧到新，后选择的后置入）</div>', discardedCards];
				const expansionCards = player.getExpansions("nsyice");
				expansionCards.reverse();
				if (expansionCards.length) {
					dialog.push('<div class="text center">原有“策”</div>');
					dialog.push(expansionCards);
				}
				result = await player
					.chooseButton(dialog, true, discardedCards.length)
					.set("filterButton", button => _status.event.cards.includes(button.link))
					.set("cards", discardedCards)
					.forResult();
			}
			const expansionEvent = player.addToExpansion(result.links, "gain2");
			expansionEvent.gaintag.add("nsyice");
			await expansionEvent;

			const storage = player.getExpansions("nsyice");
			let matchedCards;
			for (const [startIndex, startCard] of storage.entries()) {
				const followingCards = storage.slice(startIndex + 1).reverse();
				for (const [reverseIndex, endCard] of followingCards.entries()) {
					if (get.number(startCard) !== get.number(endCard)) {
						continue;
					}
					const endIndex = storage.length - 1 - reverseIndex;
					matchedCards = storage.splice(startIndex, endIndex - startIndex + 1);
					break;
				}
				if (matchedCards) {
					break;
				}
			}
			if (!matchedCards) {
				return;
			}

			const edgeCards = [matchedCards.shift(), matchedCards.pop()];
			if (matchedCards.length) {
				await player.gain(matchedCards, "gain2");
			}
			const arrangeResult = await player.chooseButton(["将一张牌置于牌堆顶，将另一张牌置于牌堆底", edgeCards], true).forResult();
			const loseEvent = player.lose(edgeCards, ui.cardPile).set("topper", arrangeResult.links[0]);
			loseEvent.insert_index = (event, card) => (card === event.topper ? ui.cardPile.firstChild : null);
			const canDamage = !_status.dying.length;
			await loseEvent;
			if (!canDamage) {
				return;
			}

			const targetResult = await player
				.chooseTarget("对一名角色造成1点伤害", true)
				.set("ai", target => get.damageEffect(target, _status.event.player, _status.event.player))
				.forResult();
			if (targetResult.bool) {
				const target = targetResult.targets[0];
				player.line(target);
				await target.damage("nocard");
			}
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		marktext: "策",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
	},
};

export default skills;
