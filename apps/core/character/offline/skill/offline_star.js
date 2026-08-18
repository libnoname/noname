import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	xinfu_yanyu: {
		trigger: {
			global: "phaseUseBegin",
		},
		direct: true,
		filter(event, player) {
			return player.hasCards("he");
		},
		async content(event, trigger, player) {
			const next = player
				.chooseToDiscard({
					prompt: get.prompt2("xinfu_yanyu"),
					position: "he",
				})
				.set("logSkill", "xinfu_yanyu");
			if (player === trigger.player) {
				const map = {
					basic: 0,
					trick: 0.1,
				};
				const hs = trigger.player.getCards("h");
				let sha = false;
				let jiu = false;
				for (const card of hs) {
					if (!trigger.player.hasValueTarget(card)) {
						continue;
					}
					if (card.name === "sha" && !sha) {
						sha = true;
						map.basic += 2;
					}
					if (card.name === "tao") {
						map.basic += 6;
					}
					if (card.name === "jiu") {
						jiu = true;
						map.basic += 2.5;
					}
					if (get.type(card) === "trick") {
						map.trick += get.value(card, player, "raw");
					}
				}
				next.set("goon", map).set("ai", card => {
					const map = _status.event.goon;
					const type = get.type(card, "trick");
					if (!map[type]) {
						return -1;
					}
					return map[type] - get.value(card);
				});
			} else {
				next.set("ai", cardx => {
					const map = {
						basic: 0,
						trick: 0,
					};
					const hs = trigger.player.getCards("h");
					let sha = false;
					let jiu = false;
					for (const card of hs) {
						if (card === cardx || !trigger.player.hasValueTarget(card)) {
							continue;
						}
						if (card.name === "sha" && !sha) {
							sha = true;
							map.basic += 2;
						}
						if (card.name === "tao") {
							map.basic += 6;
						}
						if (card.name === "jiu") {
							jiu = true;
							map.basic += 3;
						}
						if (get.type(card) === "trick") {
							map.trick += player.getUseValue(card);
						}
					}
					const type = get.type(cardx, "trick");
					if (!map[type]) {
						return -get.value(cardx);
					}
					return map[type] - get.value(cardx);
				});
			}
			const result = await next.forResult();
			if (!result.bool || !result.cards?.length) {
				return;
			}
			player.storage.xinfu_yanyu = get.type(result.cards[0], "trick");
			player.addTempSkill("xinfu_yanyu2", "phaseUseAfter");
		},
	},
	xinfu_yanyu2: {
		init(player, skill) {
			player.storage[skill] = 0;
		},
		onremove(player, skill) {
			delete player.storage.xinfu_yanyu;
			delete player.storage.xinfu_yanyu2;
		},
		trigger: {
			global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
		},
		direct: true,
		sourceSkill: "xinfu_yanyu",
		filter(event, player) {
			if (player.storage.xinfu_yanyu2 >= 3) {
				return false;
			}
			const type = player.storage.xinfu_yanyu;
			const cards = event.getd();
			return cards.some(card => get.type(card, "trick") === type && get.position(card, true) === "d");
		},
		async content(event, trigger, player) {
			const type = player.storage.xinfu_yanyu;
			const cards = trigger.getd().filter(card => get.type(card, "trick") === type && get.position(card, true) === "d");
			let logged = false;
			for (; cards.length && player.storage.xinfu_yanyu2 < 3; ) {
				const cardResult = await player
					.chooseCardButton({
						cards,
						prompt: "【燕语】：是否将其中的一张牌交给一名角色？",
						ai: button => (button.link.name === "du" ? 10 : get.value(button.link)),
					})
					.forResult();
				if (!cardResult.bool) {
					break;
				}
				player.storage.xinfu_yanyu2++;
				if (!logged) {
					player.logSkill("xinfu_yanyu");
					player.addExpose(0.25);
					logged = true;
				}
				const card = cardResult.links[0];
				cards.remove(card);
				const targetResult = await player
					.chooseTarget({
						forced: true,
						prompt: `请选择要获得${get.translation(card)}的角色`,
						ai: target => {
							const player = _status.event.player;
							const card = _status.event.card;
							const value = get.value(card);
							let attitude = get.attitude(player, target);
							if (player.storage.xinfu_yanyu2 < 3 && target === _status.currentPhase && target.hasValueTarget(card, null, true)) {
								attitude *= 5;
							} else if (target === player && !player.hasJudge("lebu") && get.type(card) === "trick") {
								attitude *= 3;
							}
							if (target.hasSkillTag("nogain")) {
								attitude /= 10;
							}
							return attitude * value;
						},
					})
					.set("card", card)
					.forResult();
				const target = targetResult.targets[0];
				player.line(target, "green");
				await target.gain({ cards: [card], animate: "gain2" });
			}
		},
	},
	xinfu_xiaode: {
		trigger: { global: "dieAfter" },
		filter(event, player) {
			return !player.hasSkill("xinfu_xiaode_remove");
		},
		async cost(event, trigger, player) {
			const mainSkills = lib.character[trigger.player.name1 ?? trigger.player.name][3];
			const viceSkills = trigger.player.name2 != null ? lib.character[trigger.player.name2][3] : [];
			const skills = mainSkills.concat(viceSkills);
			const isSkillAvailable = skill => {
				const info = get.info(skill);
				return !(info.charlotte || info.zhuSkill || (info.unique && !info.limited) || info.juexingji || info.dutySkill || info.hiddenSkill);
			};
			const list = skills.filter(isSkillAvailable);
			if (!list.length) {
				return;
			}
			const result = await player
				.chooseControl({
					controls: [...list, "cancel2"],
					prompt: get.prompt2("xinfu_xiaode"),
					ai: () => list.randomGet(),
				})
				.forResult();
			if (result.control) {
				event.result = {
					bool: result.control !== "cancel2",
					cost_data: {
						control: result.control,
					},
				};
			}
		},
		async content(event, trigger, player) {
			const { control } = event.cost_data;
			player.popup(control, "thunder");
			game.log(player, "获得了技能", `#g【${get.translation(control)}】`);
			player.addAdditionalSkill("xinfu_xiaode", [control]);
			player.addSkill("xinfu_xiaode_remove");
		},
		subSkill: {
			remove: {
				trigger: { player: "phaseAfter" },
				charlotte: true,
				silent: true,
				async content(event, trigger, player) {
					player.removeAdditionalSkill("xinfu_xiaode");
					player.removeSkill("xinfu_xiaode_remove");
				},
			},
		},
	},
	chixin: {
		group: ["chixin1", "chixin2"],
		mod: {
			cardUsableTarget(card, player, target) {
				if (card.name === "sha" && !target.hasSkill("chixin3") && player.inRange(target)) {
					return true;
				}
			},
		},
		trigger: { player: "useCardToPlayered" },
		silent: true,
		firstDo: true,
		locked: false,
		async content(event, trigger, player) {
			trigger.target.addTempSkill("chixin3");
		},
	},
	chixin1: {
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard: { suit: "diamond" },
		position: "hes",
		viewAs: { name: "sha" },
		prompt: "将一张♦牌当杀使用或打出",
		sourceSkill: "chixin",
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			respondSha: true,
		},
	},
	chixin2: {
		enable: ["chooseToUse", "chooseToRespond"],
		filterCard: { suit: "diamond" },
		viewAs: { name: "shan" },
		position: "hes",
		prompt: "将一张♦牌当闪使用或打出",
		sourceSkill: "chixin",
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			respondShan: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondShan") && current < 0) {
						return 0.8;
					}
				},
			},
		},
	},
	chixin3: { charlotte: true },
	suiren: {
		trigger: { player: "phaseZhunbeiBegin" },
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return !player.storage.suiren;
		},
		direct: true,
		limited: true,
		async content(event, trigger, player) {
			const check = player.hp === 1 || (player.hp === 2 && player.countCards("h") <= 1);
			const result = await player
				.chooseTarget({
					prompt: get.prompt2("suiren"),
					ai: target => (check ? get.attitude(player, target) : 0),
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			player.storage.suiren = true;
			player.awakenSkill(event.name);
			player.logSkill("suiren", result.targets);
			await player.removeSkills("reyicong");
			await player.gainMaxHp();
			await player.recover();
			await result.targets[0].draw(3);
		},
	},
	xinmanjuan: {
		audio: "manjuan",
		forced: true,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			const hs = player.getCards("h");
			return event.type !== "xinmanjuan" && event.getg(player).some(card => hs.includes(card));
		},
		async content(event, trigger, player) {
			const hs = player.getCards("h");
			const cards = trigger.getg(player).filter(card => hs.includes(card));
			const rawCards = cards.slice();
			await player.loseToDiscardpile({ cards });
			if (_status.currentPhase !== player) {
				return;
			}
			for (const card of cards) {
				const cardsToGain = [];
				const number = get.number(card);
				for (const current of ui.discardPile.childNodes) {
					if (!rawCards.includes(current) && get.number(current) === number) {
						cardsToGain.push(current);
					}
				}
				if (!cardsToGain.length) {
					continue;
				}
				const result = await player
					.chooseButton({
						createDialog: ["是否获得其中的一张牌？", cardsToGain],
						ai: button => get.value(button.link),
					})
					.forResult();
				if (!result.bool) {
					continue;
				}
				await player.gain({ cards: [result.links[0]], animate: "gain2" }).set("type", "xinmanjuan");
			}
		},
		ai: {
			threaten: 4.2,
			nogain: 1,
			skillTagFilter(player) {
				return player !== _status.currentPhase;
			},
		},
	},
	manjuan: {
		audio: true,
		trigger: { global: "loseAfter" },
		filter(event, player) {
			if (event.type !== "discard") {
				return false;
			}
			if (event.player === player) {
				return false;
			}
			if (!player.countCards("he")) {
				return false;
			}
			return event.cards2.some(card => get.position(card, true) === "d");
		},
		direct: true,
		gainable: true,
		async content(event, trigger, player) {
			if (trigger.delay === false) {
				await game.delay();
			}
			const cards = [];
			const suits = ["club", "spade", "heart", "diamond"];
			for (const card of trigger.cards2) {
				if (get.position(card, true) === "d") {
					cards.push(card);
					suits.remove(get.suit(card));
				}
			}
			if (!cards.length) {
				return;
			}
			let maxValue = 0;
			for (const card of cards) {
				maxValue = Math.max(maxValue, get.value(card));
			}
			maxValue += cards.length - 1;
			const result = await player
				.chooseToDiscard({
					position: "he",
					filterCard: { suit: suits },
					ai: card => _status.event.maxval - get.value(card),
				})
				.set("maxval", maxValue)
				.set("dialog", [get.prompt(event.name), "hidden", cards])
				.set("logSkill", event.name)
				.forResult();
			if (!result.bool) {
				return;
			}
			await player.gain({ cards, animate: "gain2", log: true });
		},
		ai: {
			threaten: 1.3,
		},
	},
	zuixiang: {
		skillAnimation: true,
		animationColor: "gray",
		audio: true,
		limited: true,
		trigger: { player: "phaseZhunbeiBegin" },
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cards = get.cards(3);
			const showEvent = player.showCards(cards);
			const expansionEvent = player.addToExpansion({
				cards,
				animate: "gain2",
				gaintag: ["zuixiang2"],
			});
			await showEvent;
			await expansionEvent;
			if (lib.skill.zuixiang.filterSame(cards)) {
				await player.gain({ cards, animate: "gain2" }).set("type", "xinmanjuan");
				return;
			}
			trigger._zuixiang = true;
			player.addSkill("zuixiang2");
		},
		filterSame(c) {
			const numbers = c.map(card => get.number(card));
			return new Set(numbers).size !== numbers.length;
		},
	},
	zuixiang2: {
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		mod: {
			cardEnabled(card, player) {
				const type = get.type2(card);
				if (player.getExpansions("zuixiang2").some(card => get.type2(card, false) === type)) {
					return false;
				}
			},
			cardRespondable(card, player) {
				const type = get.type2(card);
				if (player.getExpansions("zuixiang2").some(card => get.type2(card, false) === type)) {
					return false;
				}
			},
			cardSavable(card, player) {
				const type = get.type2(card);
				if (player.getExpansions("zuixiang2").some(card => get.type2(card, false) === type)) {
					return false;
				}
			},
		},
		trigger: {
			player: "phaseZhunbeiBegin",
			target: "useCardToBefore",
		},
		forced: true,
		charlotte: true,
		sourceSkill: "zuixiang",
		filter(event, player) {
			if (event.name === "phaseZhunbei") {
				return !event._zuixiang;
			}
			const type = get.type2(event.card);
			return player.getExpansions("zuixiang2").some(card => get.type2(card) === type);
		},
		async content(event, trigger, player) {
			if (event.triggername === "useCardToBefore") {
				trigger.cancel();
				return;
			}
			const newCards = get.cards(3);
			await player.addToExpansion({
				cards: newCards,
				animate: "gain2",
				gaintag: ["zuixiang2"],
			});
			const cards = player.getExpansions("zuixiang2");
			const showEvent = player.showCards(cards);
			if (!lib.skill.zuixiang.filterSame(cards)) {
				await showEvent;
				return;
			}
			const gainEvent = player.gain({ cards, animate: "gain2", log: true }).set("type", "xinmanjuan");
			player.removeSkill("zuixiang2");
			await showEvent;
			await gainEvent;
		},
		ai: {
			effect: {
				target(card, player, target) {
					const type = get.type2(card);
					if (target.getExpansions("zuixiang2").some(card => get.type2(card) === type)) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	yanxiao: {
		audio: 2,
		enable: "phaseUse",
		filterCard: { suit: "diamond" },
		filterTarget(card, player, target) {
			return target.canAddJudge({ name: "yanxiao_card" });
		},
		check(card) {
			return 7 - get.value(card);
		},
		position: "he",
		filter(event, player) {
			return player.hasCards("he", { suit: "diamond" });
		},
		discard: false,
		lose: false,
		delay: false,
		prepare: "give",
		async content(event, trigger, player) {
			const { target, cards } = event;
			game.addGlobalSkill("yanxiao_global");
			await target.addJudge({ name: "yanxiao_card" }, cards);
			await game.delay();
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					const harmfulJudge = target.hasCards(
						"j",
						card =>
							get.effect(
								target,
								{
									name: card.viewAs || card.name,
									cards: [card],
								},
								target,
								target
							) < 0
					);
					return harmfulJudge ? 1 : 0;
				},
			},
		},
	},
	yanxiao_global: {
		trigger: { player: "phaseJudgeBegin" },
		forced: true,
		filter(event, player) {
			return player.hasCards("j") && player.hasJudge("yanxiao_card");
		},
		async content(event, trigger, player) {
			await player.gain({ cards: player.getCards("j"), animate: "gain2" });
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (get.type(card) === "delay" && target.hasJudge("yanxiao_card")) {
						return [0, 0.1];
					}
				},
			},
		},
	},
	anxian: {
		audio: 2,
		group: ["anxian_source", "anxian_target"],
		subSkill: {
			source: {
				audio: "anxian",
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					return event.card && event.card.name === "sha";
				},
				check(event, player) {
					return get.damageEffect(event.player, player, player) <= 0;
				},
				async content(event, trigger, player) {
					if (trigger.player.hasCards("h")) {
						await trigger.player.chooseToDiscard({ forced: true });
					}
					const drawEvent = player.draw();
					trigger.cancel();
					await drawEvent;
				},
			},
			target: {
				audio: "anxian",
				trigger: { target: "useCardToTargeted" },
				direct: true,
				filter(event, player) {
					return event.card.name === "sha" && player.hasCards("h");
				},
				async content(event, trigger, player) {
					const result = await player
						.chooseToDiscard({
							prompt: get.prompt2("anxian"),
							ai: card => {
								if (get.attitude(player, trigger.player) > 0) {
									return 9 - get.value(card);
								}
								if (player.hasCards("h", { name: "shan" })) {
									return -1;
								}
								return 7 - get.value(card);
							},
						})
						.set("logSkill", "anxian")
						.forResult();
					if (!result.bool) {
						return;
					}
					const drawEvent = trigger.player.draw();
					trigger.getParent()?.excluded.push(player);
					await drawEvent;
				},
			},
		},
	},
	junwei: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countExpansions("yinling") >= 3;
		},
		async cost(event, trigger, player) {
			const cards = player.getExpansions("yinling");
			if (cards.length > 3) {
				event.result = await player
					.chooseButton({
						selectButton: 3,
						createDialog: [get.prompt("junwei"), "hidden", cards],
						ai: () => 1,
					})
					.forResult();
				event.result.cards = event.result.links;
			} else {
				event.result = await player
					.chooseBool({ choice: true })
					.set("createDialog", [get.prompt("junwei"), "hidden", cards])
					.set("dialogselectx", true)
					.forResult();
				event.result.cards = cards;
			}
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			await player.loseToDiscardpile({ cards });
			const result = await player
				.chooseTarget({
					forced: true,
					filterTarget: (_card, player, target) => player !== target,
					ai: target => -get.attitude(_status.event.player, target) / Math.sqrt(1 + target.hp),
				})
				.forResult();
			if (!result.bool || !result.targets?.length) {
				return;
			}
			const target = result.targets[0];
			player.line(result.targets);
			const shan = _status.connectMode || target.hasCards("h", card => card.name === "shan");
			let result2 = { bool: false };
			if (shan) {
				result2 = await target
					.chooseCard({
						prompt: `交给${get.translation(player)}一张【闪】，或失去1点体力`,
						filterCard: card => card.name === "shan",
						ai: () => (get.event().target.hp < 3 ? 1 : 0),
					})
					.set("target", target)
					.forResult();
			}
			if (result2.bool) {
				await game.delay();
			}
			ui.clear();
			if (result2.bool) {
				const shanCards = result2.cards;
				target.$throw(shanCards);
				const recipientResult = await player
					.chooseTarget({
						prompt: `将${get.translation(shanCards)}交给一名角色`,
						forced: true,
						filterTarget: (_card, _player, current) => current !== target,
						ai: current => get.attitude(_status.event.player, current) / (current.countCards("h", "shan") + 1),
					})
					.forResult();
				player.line(recipientResult.targets, "green");
				await recipientResult.targets?.[0].gain({ cards: shanCards, animate: "gain2" }).set("giver", player);
				game.log(player, "将", shanCards, "交给", recipientResult.targets?.[0]);
				return;
			}
			await target.loseHp();
			if (!target.hasCards("e")) {
				return;
			}
			const equipmentResult = await player
				.choosePlayerCard({
					position: "e",
					prompt: `将${get.translation(target)}的一张装备牌移出游戏`,
					forced: true,
					target,
				})
				.forResult();
			if (!equipmentResult.bool) {
				return;
			}
			const expansionEvent = target.addToExpansion({
				cards: [equipmentResult.links?.[0]],
				source: target,
				animate: "give",
				gaintag: ["junwei2"],
			});
			target.addSkill("junwei2");
			await expansionEvent;
		},
		ai: {
			combo: "yinling",
		},
	},
	junwei2: {
		mark: true,
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile({ cards });
			}
		},
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		charlotte: true,
		sourceSkill: "junwei",
		async content(event, trigger, player) {
			const getEquippableCard = () => player.getExpansions("junwei2").find(card => player.canEquip(card, true));
			for (let card = getEquippableCard(); card != null; card = getEquippableCard()) {
				player.$give(card, player, false);
				await game.delay(0.5);
				await player.equip(card);
			}
			player.removeSkill("junwei2");
		},
	},
	yinling: {
		enable: "phaseUse",
		filterCard: { color: "black" },
		position: "he",
		marktext: "锦",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile({ cards });
			}
		},
		filter(event, player) {
			return player.hasCards("he", { color: "black" }) && player.countExpansions("yinling") < 4;
		},
		filterTarget(card, player, target) {
			return target.hasCards("he") && target !== player;
		},
		check(card) {
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player
				.choosePlayerCard({
					target,
					position: "hej",
					forced: true,
				})
				.forResult();
			if (!result.bool || !result.links?.length) {
				return;
			}
			await player.addToExpansion({
				cards: result.links,
				source: target,
				animate: "give",
				gaintag: ["yinling"],
			});
		},
		ai: {
			order: 10.1,
			expose: 0.1,
			result: {
				target(player, target) {
					if (target.hasSkill("tuntian")) {
						return 0;
					}
					const es = target.getCards("e");
					const nh = target.countCards("h");
					const noe = es.length === 0 || target.hasSkillTag("noe");
					const noe2 = es.length === 1 && es[0].name === "baiyin" && target.hp < target.maxHp;
					const noh = nh === 0 || target.hasSkillTag("noh");
					if (noh && noe) {
						return 0;
					}
					if (noh && noe2) {
						return 0.01;
					}
					if (get.attitude(player, target) <= 0) {
						return target.countCards("he") ? -1.5 : 1.5;
					}
					const js = target.getCards("j");
					if (js.length) {
						const jj = js[0].viewAs ? { name: js[0].viewAs } : js[0];
						if (jj.name === "guohe") {
							return 3;
						}
						if (js.length === 1 && get.effect(target, jj, target, player) >= 0) {
							return -1.5;
						}
						return 2;
					}
					return -1.5;
				},
			},
		},
	},
	fenyong: {
		audio: 2,
		trigger: { player: "damageEnd" },
		frequent: true,
		filter(event, player) {
			return !player.hasSkill("fenyong_mark");
		},
		async content(event, trigger, player) {
			player.addSkill("fenyong_mark");
		},
		subSkill: {
			mark: {
				audio: "fenyong",
				mark: true,
				intro: {
					content: "防止你受到的所有伤害",
				},
				trigger: { player: "damageBegin3" },
				charlotte: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					trigger.cancel();
				},
				ai: {
					maixie: true,
					maixie_hp: true,
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
	xuehen: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player.hasSkill("fenyong_mark") && event.player.isIn();
		},
		async content(event, trigger, player) {
			player.removeSkill("fenyong_mark");
			const list = [];
			if (trigger.player.countDiscardableCards(player, "he") && player.isDamaged()) {
				list.add("弃牌");
			}
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			const targets = game.filterPlayer(current => player.canUse(card, current, false));
			if (targets.length) {
				list.add("出杀");
			}
			if (!list.length) {
				return;
			}
			const result =
				list.length > 1
					? await player
							.chooseControl("弃牌", "出杀")
							.set("prompt", `###雪恨###弃置${get.translation(trigger.player)}${get.cnNumber(player.getDamagedHp())}张牌，或对任意一名角色使用一张杀`)
							.set("ai", () => get.event().resultx)
							.set(
								"resultx",
								(() => {
									const getV = current => get.effect(current, card, player, player);
									const target = targets.maxBy(getV);
									const eff = getV(target);
									const eff2 = get.effect(trigger.player, { name: "guohe_copy2" }, player, player);
									if (eff < 0) {
										return 0;
									}
									if (eff2 < 0) {
										return 1;
									}
									return eff > eff2 ? 1 : 0;
								})()
							)
							.forResult()
					: {
							control: list[0],
						};
			if (!result) {
				return;
			}
			if (result.control === "弃牌") {
				player.line(trigger.player, "green");
				const num = Math.min(player.getDamagedHp(), trigger.player.countDiscardableCards(player, "he"));
				if (num > 0) {
					player.discardPlayerCard(trigger.player, true, "he", num);
				}
			} else {
				await player.chooseUseTarget(card, true, false, "nodistance");
			}
		},
		ai: {
			combo: "fenyong",
		},
	},
	mouduan: {
		audio: 1,
		init2(player) {
			game.broadcastAll(player => {
				player._mouduan_mark = player.mark("武", {
					content: "拥有技能【激昂】、【谦逊】",
				});
			}, player);
			player.addAdditionalSkill("mouduan", ["jiang", "qianxun"]);
		},
		derivation: ["jiang", "qianxun", "yingzi", "keji"],
		onremove(player) {
			game.broadcastAll(player => {
				if (!player._mouduan_mark) {
					return;
				}
				player._mouduan_mark.delete();
				delete player._mouduan_mark;
			}, player);
			player.removeAdditionalSkills("mouduan");
		},
		trigger: { player: "loseEnd" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player._mouduan_mark && player._mouduan_mark.name === "武" && player.countCards("h") <= 2;
		},
		async content(event, trigger, player) {
			game.broadcastAll(player => {
				if (!player._mouduan_mark) {
					return;
				}
				player._mouduan_mark.name = "文";
				player._mouduan_mark.skill = "文";
				player._mouduan_mark.firstChild.innerHTML = "文";
				player._mouduan_mark.info.content = "拥有技能【英姿】、【克己】";
			}, player);
			player.addAdditionalSkills("mouduan", ["yingzi", "keji"]);
		},
		group: "mouduan2",
	},
	mouduan2: {
		audio: 1,
		trigger: { global: "phaseZhunbeiBegin" },
		sourceSkill: "mouduan",
		//priority:5,
		filter(event, player) {
			return player._mouduan_mark && player._mouduan_mark.name === "文" && player.countCards("h") > 2;
		},
		direct: true,
		async content(event, trigger, player) {
			const result = await player
				.chooseToDiscard({
					position: "he",
					prompt: "谋断：是否弃置一张牌将标记变为“武”？",
					ai: () => -1,
				})
				.forResult();
			if (!result.bool || player.countCards("h") <= 2) {
				return;
			}
			game.broadcastAll(player => {
				if (!player._mouduan_mark) {
					return;
				}
				player._mouduan_mark.name = "武";
				player._mouduan_mark.skill = "武";
				player._mouduan_mark.firstChild.innerHTML = "武";
				player._mouduan_mark.info.content = "拥有技能【激昂】、【谦逊】";
			}, player);
			player.addAdditionalSkills("mouduan", ["jiang", "qianxun"]);
		},
	},
	tanhu: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player.chooseToCompare(target).forResult();
			if (!result.bool) {
				return;
			}
			target.addTempSkill("tanhu2");
		},
		ai: {
			result: {
				target(player, target) {
					const hs = player.getCards("h");
					if (hs.length < 3) {
						return 0;
					}
					const hasGoodCompareCard = hs.some(card => card.number >= 9 && get.value(card) < 7);
					return hasGoodCompareCard ? -1 : 0;
				},
			},
			order: 9,
		},
		group: "tanhu3",
	},
	tanhu2: {
		mark: true,
		intro: {
			content: "已成为探虎目标",
		},
	},
	tanhu3: {
		mod: {
			globalFrom(from, to) {
				if (to.hasSkill("tanhu2")) {
					return -Infinity;
				}
			},
			wuxieRespondable(card, player, target) {
				if (target && target.hasSkill("tanhu2")) {
					return false;
				}
			},
		},
	},
	jie: {
		audio: 1,
		trigger: { source: "damageBegin1" },
		filter(event) {
			return event.card?.name === "sha" && get.color(event.card) === "red";
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num++;
		},
	},
	dahe: {
		audio: true,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return game.hasPlayer(current => get.info("dahe").filterTarget(null, player, current));
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player.chooseToCompare(target).set("preserve", "win").forResult();
			if (result?.bool) {
				target.addTempSkill(`${event.name}_effect`);
				const card = result?.target;
				if (get.itemtype(card) === "card") {
					const result = await player
						.chooseTarget(`将${get.translation(card)}交给一名角色`, (card, player, target) => target.hp <= player.hp)
						.set("ai", target => {
							const { player, du } = get.event();
							const att = get.attitude(player, target);
							if (du) {
								return -att;
							}
							return att;
						})
						.set("du", card.name === "du")
						.forResult();
					if (result?.bool && result?.targets?.length) {
						player.line(result.targets, "green");
						await result.targets[0].gain(card, "gain2");
					}
				}
			} else if (player.countCards("h")) {
				await player.showHandcards();
				if (player.countDiscardableCards(player, "h")) {
					await player.chooseToDiscard("h", true);
				}
			}
		},
		ai: {
			result: {
				target(player, target) {
					const hs = player.getCards("h");
					if (hs.length < 3) {
						return 0;
					}
					const hasGoodCompareCard = hs.some(card => card.number >= 9 && get.value(card) < 7);
					if (!hasGoodCompareCard) {
						return 0;
					}
					if (player.canUse("sha", target) && player.countCards("h", "sha")) {
						return -2;
					}
					return -0.5;
				},
			},
			order: 9,
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				intro: { content: "非红桃闪无效" },
				mod: {
					cardRespondable(card, player) {
						if (card.name === "shan") {
							const suit = get.suit(card);
							if (suit !== "heart" && suit !== "unsure") {
								return false;
							}
						}
					},
					cardEnabled(card, player) {
						if (card.name === "shan") {
							const suit = get.suit(card);
							if (suit !== "heart" && suit !== "unsure") {
								return false;
							}
						}
					},
				},
			},
		},
	},
	shichou: {
		initSkill(skill) {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					mod: {
						aiOrder(player, card, num) {
							if (typeof card === "object" && get.tag(card, "recover")) {
								return num / 114514;
							}
						},
					},
					charlotte: true,
					onremove: true,
					mark: true,
					marktext: "誓",
					intro: {
						markcount: () => 0,
						content: storage => `已为${get.translation(storage)}李代桃僵`,
					},
				};
				lib.translate[skill] = "誓仇";
				lib.translate[`${skill}_bg`] = "仇";
			}
		},
		audio: true,
		skillAnimation: true,
		animationColor: "orange",
		limited: true,
		trigger: { player: "phaseZhunbeiBegin" },
		zhuSkill: true,
		filter(event, player) {
			if (!player.hasZhuSkill("shichou")) {
				return false;
			}
			if (player.countCards("he") < 2) {
				return false;
			}
			return game.hasPlayer(current => current !== player && current.group === "shu");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					selectCard: 2,
					filterTarget(card, player, target) {
						return target.group === "shu" && target !== player;
					},
					filterCard: true,
					position: "he",
					ai1(card) {
						return 7 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						if (player.hasUnknown()) {
							return 0;
						}
						if (target.hasSkillTag("nodamage")) {
							return 10;
						}
						const att = get.attitude(player, target);
						if (att <= 0) {
							if (target.hp === 1) {
								return (10 - att) / 2;
							}
							return 10 - att;
						}
						if (target.hp === 1) {
							return 0;
						}
						return (10 - att) / 4;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			player.awakenSkill(event.name);
			await player.give(cards, target);
			player.addSkill(`${event.name}_effect`);
			const skill = `${event.name}_${player.playerid}`;
			game.broadcastAll(lib.skill.shichou.initSkill, skill);
			for (const current of game.filterPlayer()) {
				current.removeSkill(skill);
				if (current === target) {
					target.addSkill(skill);
					target.storage[skill] = player;
					target.markSkill(skill);
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: {
					global: ["dying", "die"],
					player: "damageBegin4",
				},
				filter(event, player) {
					const target = game.findPlayer(current => current.storage[`shichou_${player.playerid}`] === player);
					if (!target) {
						return false;
					}
					if (event.name === "damage") {
						return target.isIn();
					}
					return event.player === target;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const target = game.findPlayer(current => current.storage[`shichou_${player.playerid}`] === player);
					if (trigger.name === "damage") {
						trigger.cancel();
						await game.delay(0.5);
						await target
							.damage(trigger.source?.isIn() ? trigger.source : "nosource", trigger.nature, trigger.num)
							.set("card", trigger.card)
							.set("cards", trigger.cards);
						await target.draw(trigger.num);
					} else {
						target.removeSkill(`shichou_${player.playerid}`);
						player.removeSkill(event.name);
					}
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) {
									return [1, -2];
								}
								if (get.attitude(player, target) > 0) {
									return [0, 0];
								}
								const targetx = game.findPlayer(current => current.storage[`shichou_${target.playerid}`] === target);
								if (!targetx?.isIn()) {
									return;
								}
								const bool = game.hasPlayer(current => current.hasCard(card => current.canSaveCard(card, targetx), "hs") && get.attitude(current, targetx) > 0);
								const num = -1;
								if (targetx.hp >= 4) {
									return [0, num * 2];
								}
								if (targetx.hp === 3) {
									return [0, num * 1.5];
								}
								if (targetx.hp <= 2) {
									return [0, bool ? num : -num];
								}
							}
						},
					},
				},
			},
		},
	},
	zhaolie: {
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return event.num > 0 && !event.numFixed && game.hasPlayer(current => player.inRange(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => player.inRange(target))
				.set("ai", target => {
					const player = get.player();
					if (get.attitude(player, target) > 0) {
						return 0;
					}
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			trigger.num--;
			if (trigger.num <= 0) {
				await game.delay();
			}
			player
				.when({ player: "phaseDrawEnd" })
				.filter(evt => trigger === evt)
				.step(async () => {
					let cards = get.cards(3);
					await game.cardsGotoOrdering(cards);
					await player.showCards(cards);
					const cards2 = cards.filter(card => get.type(card) !== "basic" || get.name(card) === "tao");
					const num = cards.filter(card => get.type(card) !== "basic").length;
					if (cards2.length) {
						cards.removeArray(cards2);
						await game.cardsDiscard(cards2);
					}
					cards = cards.filter(card => get.type(card) === "basic");
					if (!target.isIn()) {
						return;
					}
					let result;
					if (!num) {
						if (!cards.length) {
							return;
						}
						result = await target
							.chooseTarget((card, player, target) => get.event().list.includes(target), `选择一个目标获得${get.translation(cards)}`, true)
							.set("ai", target => {
								const { player, cardsx } = get.event();
								return get.attitude(player, target) * get.value(cardsx, target);
							})
							.set("list", [player, target])
							.set("cardsx", cards)
							.forResult();
						if (result?.bool && result?.targets?.length) {
							await result.targets[0].gain(cards, "gain2");
						}
					} else {
						let str = `弃置${get.cnNumber(num)}张牌`;
						if (cards.length) {
							str += `并令${get.translation(player)}获得${get.translation(cards)}`;
						}
						str += `，或受到${get.translation(player)}的${num}点伤害`;
						if (cards.length) {
							str += `并获得${get.translation(cards)}`;
						}
						result =
							target.countCards("he") < num
								? { bool: false }
								: await target
										.chooseToDiscard(num, "he", get.prompt("zhaolie"), str)
										.set("ai", card => {
											const { goon } = get.event();
											return goon ? 8 - get.value(card) : 0;
										})
										.set("goon", (get.damageEffect(target, player, target) < 0 && target.getHp() <= 2 * num) || (num >= 2 && !target.countCards("hs", card => target.canSaveCard(card, target)) >= num))
										.forResult();
						if (result?.bool) {
							if (cards.length) {
								await player.gain(cards, "gain2");
							}
						} else {
							if (num) {
								await target.damage(num);
							}
							if (cards.length) {
								if (target.isIn()) {
									await target.gain(cards, "gain2");
								} else {
									await game.cardsDiscard(cards);
								}
							}
						}
					}
				});
		},
	},
	fulu: {
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (event.card.name === "sha" && !game.hasNature(event.card)) {
				return true;
			}
		},
		audio: true,
		check(event, player) {
			let eff = 0;
			for (const target of event.targets) {
				const eff1 = get.damageEffect(target, player, player);
				const eff2 = get.damageEffect(target, player, player, "thunder");
				eff += eff2;
				eff -= eff1;
			}
			return eff >= 0;
		},
		async content(event, trigger, player) {
			game.setNature(trigger.card, "thunder");
			if (get.itemtype(trigger.card) === "card") {
				const next = game.createEvent("fulu_clear");
				next.card = trigger.card;
				event.next.remove(next);
				trigger.after.push(next);
				next.setContent(async ({ card }) => {
					game.setNature(card, []);
				});
			}
		},
	},
	fuji: {
		trigger: { global: "damageBegin1" },
		filter(event) {
			return event.source && event.source.isIn() && event.hasNature("thunder");
		},
		check(event, player) {
			return get.attitude(player, event.source) > 0 && get.attitude(player, event.player) < 0;
		},
		prompt(event) {
			return `${get.translation(event.source)}即将对${get.translation(event.player)}造成伤害，${get.prompt("fuji")}`;
		},
		logTarget: "source",
		async content(event, trigger, player) {
			trigger.source.judge().callback = lib.skill.fuji.callback;
		},
		async callback(event, trigger, player) {
			const evt = event.getParent(2);
			switch (event.judgeResult.color) {
				case "black":
					evt._trigger.num++;
					break;

				case "red":
					evt._trigger.source.gain(event.card, "gain2");
					break;
				default:
					break;
			}
		},
	},
};

export default skills;
