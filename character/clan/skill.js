import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	// 族王昶
	clankaiji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (!event.clankaiji_enabledTargets) return false;
			return game.hasPlayer(current => get.info("clankaiji").filterTarget(null, player, current));
		},
		onChooseToUse(event) {
			if (game.online || event.type !== "phase") return;
			const player = event.player;
			const chosen = player.getRoundHistory("useSkill", evt => evt.skill === "clankaiji").reduce((list, evt) => list.add(evt.targets[0]), []);
			event.set("clankaiji_enabledTargets", chosen);
		},
		filterTarget(card, player, target) {
			return !get.event("clankaiji_enabledTargets").includes(target) && player.countDiscardableCards(target, "h");
		},
		async content(event, trigger, player) {
			const { target } = event;
			const cards = await target
				.discardPlayerCard(player, "h", true)
				.set("ai", button => {
					const { player, target } = get.event(),
						{ link } = button;
					if (get.attitude(player, target) > 0) {
						if (target.hasUseTarget(link)) return 10;
						return 6 - get.value(link);
					}
					if (player.hasSkillTag("viewHandcard", null, target, true)) {
						if (!target.hasUseTarget(link)) return 10;
						return get.value(link);
					}
					if (get.is.shownCard(link) && !target.hasUseTarget(link)) return 10;
					return 1;
				})
				.forResultLinks();
			if (!cards || !cards.someInD("d")) return;
			const card = cards.filterInD("d");
			await game.delayx();
			const bool = await player.chooseUseTarget(`你可以使用${get.translation(card)}然后摸一张牌`, card, false).forResultBool();
			if (bool) await player.draw();
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					if (!player.hasCard(card => player.hasUseTarget(card), "h")) return -1;
					if (player == target || get.attitude(player, target) > 0) return 1;
					if (player.countCards("h", card => player.hasUseTarget(card)) >= player.countCards("h", card => !player.hasUseTarget(card))) return -0.5 + Math.random();
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
			if (get.type(name) != "basic" && get.type(name) != "trick") return false;
			if (get.info("clanchengqi").getUsed(player).includes(name)) return false;
			return player.countCards("hs") > 1 && lib.inpile.includes(name);
		},
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			if (player.countCards("hs") < 2) return false;
			return get
				.inpileVCardList(info => {
					const name = info[2];
					if (get.type(name) != "basic" && get.type(name) != "trick") return false;
					return !(event.clanchengqi || []).includes(name);
				})
				.some(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
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
						if (get.type(name) != "basic" && get.type(name) != "trick") return false;
						return !(event.clanchengqi || []).includes(name);
					})
					.filter(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
				return ui.create.dialog("承启", [list, "vcard"]);
			},
			check(button) {
				if (get.event().getParent().type != "phase") return 1;
				return get.event("player").getUseValue({
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
						const player = get.event("player");
						const name = lib.skill.clanchengqi_backup.viewAs.name;
						if (ui.selected.cards.length > 1 || card.name == name) return 0;
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
							if (get.type(name) != "basic" && get.type(name) != "trick") return false;
							return !get.info("clanchengqi").getUsed(player).includes(name);
						})
						.map(card => {
							return { name: card[2], nature: card[3] };
						})
						.filter(card => player.getUseValue(card, true, true) > 0);
					if (!list.length) return 0;
					list.sort((a, b) => (player.getUseValue(b, true, true) || 0) - (player.getUseValue(a, true, true) || 0));
					return get.order(list[0], player) * 0.99;
				}
				return 0.001;
			},
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") return false;
				const name = tag == "respondSha" ? "sha" : "shan";
				return get.info("clanchengqi").hiddenCard(player, name);
			},
			result: { player: 1 },
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
							const player = get.event("player");
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
				.chooseTarget(get.prompt("clanjieli"), "观看一名角色的牌名字数最多的手牌" + str, (card, player, target) => {
					return target.countCards("h");
				})
				.set("ai", target => {
					const player = get.event("player");
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
						const player = get.event("player"),
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
					if (lose.some(i => get.owner(i)))
						await game.cardsGotoOrdering(lose.filter(i => get.owner(i)));
					for (let i = lose.length - 1; i--; i >= 0) {
						ui.cardPile.insertBefore(lose[i], ui.cardPile.firstChild);
					}
					game.updateRoundNumber();
					if (gain.length) await target.gain(gain, "draw");
				} else {
					for (let i = topCards.length - 1; i--; i >= 0) {
						ui.cardPile.insertBefore(topCards[i], ui.cardPile.firstChild);
					}
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
			if (!evt || !evt.card) return false;
			const curCard = event.card,
				prevCard = evt.card;
			const curNum = get.number(curCard),
				prevNum = get.number(prevCard);
			if (typeof curNum != "number" || typeof prevNum != "number") return false;
			const delNum = Math.abs(curNum - prevNum);
			if (delNum === 0) return false;
			return game.hasPlayer(current => {
				return current.getHp() === delNum;
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
				.chooseTarget(get.prompt("clantanque"), `对一名体力值为${delNum}的角色造成1点伤害`, (card, player, target) => {
					return target.getHp() === get.event("delNum");
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
				if (typeof card != "object") return;
				const evt = lib.skill.dcjianying.getLastUsed(player);
				if (!evt || !evt.card) return;
				const curNum = get.number(card),
					prevNum = get.number(evt.card);
				if (typeof curNum != "number" || typeof prevNum != "number") return;
				const pairs = game
					.filterPlayer()
					.map(current => {
						return [current.getHp(), get.damageEffect(current, player, player)];
					})
					.filter(pair => pair[1] > 0);
				if (!pairs.length) return;
				const delNum = Math.abs(curNum - prevNum);
				for (const [hp, eff] of pairs) {
					if (hp != delNum) continue;
					return num + 10 + pairs.filter(pair => pair[0] === hp).sort((a, b) => b[1] - a[1])[0][1] / 20;
				}
			},
		},
		group: "clantanque_mark",
		init(player) {
			var history = player.getAllHistory("useCard");
			if (history.length) {
				var trigger = history[history.length - 1];
				if (typeof get.number(trigger.card, player) != "number") return;
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
					if (typeof get.number(trigger.card, player) != "number") player.unmarkSkill("clantanque_mark");
					else {
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
		hiddenCard(player, name) {
			if (get.type(name) != "basic") return false;
			if (!player.getStorage("clanshengmo").includes(name) && (get.event("clanshengmo_cards") || []).length > 0) return true;
		},
		filter(event, player) {
			if (event.responded) return false;
			const names = lib.inpile.filter(name => get.type(name) == "basic" && !player.getStorage("clanshengmo").includes(name)),
				cards = get.event("clanshengmo_cards") || [];
			return (
				cards.length > 0 &&
				names.some(name => {
					return event.filterCard({ name, isCard: true }, player, event);
				})
			);
		},
		onChooseToUse(event) {
			if (game.online) return;
			if (!event.clanshengmo_cards) {
				let cards = [];
				game.checkGlobalHistory("cardMove", evt => {
					if (evt.name != "cardsDiscard" && (evt.name != "lose" || evt.position != ui.discardPile)) return;
					cards.addArray(evt.cards.filter(card => get.position(card, true) == "d"));
				});
				const numbers = cards.map(card => get.number(card, false)).unique();
				const [min, max] = [Math.min(...numbers), Math.max(...numbers)];
				event.set(
					"clanshengmo_cards",
					cards.filter(card => {
						const num = get.number(card, false);
						return num > min && num < max;
					})
				);
			}
		},
		async content(event, trigger, player) {
			const evt = event.getParent(2);
			const names = lib.inpile.filter(name => get.type(name) == "basic" && !player.getStorage("clanshengmo").includes(name)),
				cards = evt.clanshengmo_cards;
			const links = await player
				.chooseButton(["剩墨：获得其中一张牌", cards], true)
				.set("ai", button => {
					return get.value(button.link);
				})
				.forResultLinks();
			if (!links || !links.length) return;
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
			if (!list.length) return;
			const links2 = await player
				.chooseButton(["视为使用一张未以此法使用过的基本牌", [list, "vcard"]], true)
				.set("ai", button => {
					return get.player().getUseValue(button.link) + 1;
				})
				.forResultLinks();
			const name = links2[0][2],
				nature = links2[0][3];
			game.broadcastAll(
				(name, nature, toGain) => {
					lib.skill.clanshengmo_backup.viewAs = {
						name,
						nature,
						isCard: true,
					};
					lib.skill.clanshengmo_backup.prompt = `选择${get.translation(nature)}【${get.translation(name)}】的目标`;
					lib.skill.clanshengmo_backup.cardToGain = toGain;
				},
				name,
				nature,
				links[0]
			);
			evt.set("_backupevent", "clanshengmo_backup");
			evt.backup("clanshengmo_backup");
			evt.set("openskilldialog", `选择${get.translation(nature)}【${get.translation(name)}】的目标`);
			evt.set("norestore", true);
			evt.set("custom", {
				add: {},
				replace: { window() { } },
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
					delete event.result.skill;
					event.result.card.storage.clanshengmo = true;
					player.markAuto("clanshengmo", event.result.card.name);
					player.gain(lib.skill.clanshengmo_backup.cardToGain, "gain2");
				},
				filterCard: () => false,
				selectCard: -1,
			},
		},
		ai: {
			order: 3,
			result: {
				player(player) {
					if (get.event().dying) return get.attitude(player, get.event().dying);
					if (get.event().type != "phase") return 1;
					const names = lib.inpile.filter(name => get.type(name) == "basic" && !player.getStorage("clanshengmo").includes(name));
					if (Array.isArray(names)) {
						return names.some(name => {
							return player.getUseValue({ name }) > 0;
						});
					}
					return 0;
				},
			},
		},
	},
	//族贝斯塔[doge]
	clanlilun: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.hasCard(card => get.info("clanlilun").filterCard(card, player), "h");
		},
		filterCard(card, player) {
			if (player.getStorage("clanlilun").includes(card.name)) return false;
			if (ui.selected.cards.length && ui.selected.cards[0].name != card.name) return false;
			const cards = player.getCards("h", cardx => player.canRecast(cardx));
			return cards.includes(card) && cards.filter(i => i.name == card.name).length > 1;
		},
		selectCard: 2,
		position: "h",
		check(card) {
			const player = get.event("player");
			const value = function (card, player) {
				const num = player.getUseValue(card);
				return num > 0 ? num + 1 / (get.value(card) || 0.5) + 7 : 7 - get.value(card);
			};
			if (ui.selected.cards.length && value(card, player) < value(ui.selected.cards[0], player)) return 20 - get.value(card);
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
				player.when({ global: "phaseAfter" }).then(() => {
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
				const {
					result: { bool, links },
				} = await player
					.chooseButton(["离论：是否使用其中的一张牌？", cards])
					.set("filterButton", button => {
						return get.event("player").hasUseTarget(button.link);
					})
					.set("ai", button => {
						return get.event("player").getUseValue(button.link);
					});
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
				if (!cards.length) return 1;
				cards.sort((a, b) => get.order(b) - get.order(a));
				return get.order(cards[0]) - 0.001;
			},
			result: { player: 1 },
		},
	},
	clanjianji: {
		unique: true,
		limited: true,
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			if (!event.player.isIn()) return false;
			const targets = game.filterPlayer(target => {
				return event.player.getPrevious() == target || event.player.getNext() == target;
			});
			if (!targets.length) return false;
			const card = new lib.element.VCard({ name: "sha" });
			return (
				!targets.some(target => {
					return target.getHistory("useCard").length;
				}) ||
				(player.hasUseTarget(card) &&
					!targets.some(target => {
						return game.hasPlayer2(current => {
							return current.getHistory("useCard", evt => {
								return evt.targets && evt.targets.includes(target);
							}).length;
						});
					}))
			);
		},
		skillAnimation: true,
		animationColor: "watar",
		prompt2(event, player) {
			let str = "";
			const card = new lib.element.VCard({ name: "sha" });
			const targets = game.filterPlayer(target => {
				return event.player.getPrevious() == target || event.player.getNext() == target;
			}),
				bool = !targets.some(target => {
					return target.getHistory("useCard").length;
				}),
				goon =
					player.hasUseTarget(card) &&
					!targets.some(target => {
						return game.hasPlayer2(current => {
							return current.getHistory("useCard", evt => {
								return evt.targets && evt.targets.includes(target);
							}).length;
						});
					});
			if (bool) {
				if (goon) str += "你可以";
				str += "与" + get.translation(get.translation(event.player)) + "各摸一张牌";
			}
			if (goon) {
				if (bool) str += "，然后你可以";
				str += "视为使用一张【杀】";
			}
			return str;
		},
		check(event, player) {
			const card = new lib.element.VCard({ name: "sha" });
			const targets = game.filterPlayer(target => {
				return event.player.getPrevious() == target || event.player.getNext() == target;
			}),
				bool = !targets.some(target => {
					return target.getHistory("useCard").length;
				}),
				goon =
					player.hasUseTarget(card) &&
					!targets.some(target => {
						return game.hasPlayer2(current => {
							return current.getHistory("useCard", evt => {
								return evt.targets && evt.targets.includes(target);
							}).length;
						});
					});
			return (bool && (get.attitude(player, event.player) > 0 || event.player.countCards("h") > player.countCards("h"))) || (goon && player.hasValueTarget(card));
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill("clanjianji");
			const card = new lib.element.VCard({ name: "sha" });
			const targets = game.filterPlayer(target => {
				return trigger.player.getPrevious() == target || trigger.player.getNext() == target;
			}),
				boolx = !targets.some(target => {
					return target.getHistory("useCard").length;
				}),
				goon =
					player.hasUseTarget(card) &&
					!targets.some(target => {
						return game.hasPlayer2(current => {
							return current.getHistory("useCard", evt => {
								return evt.targets && evt.targets.includes(target);
							}).length;
						});
					});
			if (boolx) {
				let draw = false;
				if (goon) {
					const {
						result: { bool },
					} = await player.chooseBool("是否与" + get.translation(trigger.player) + "各摸一张牌？").set("choice", get.attitude(player, trigger.player) > 0 || trigger.player.countCards("h") > player.countCards("h"));
					if (bool) draw = true;
				} else draw = true;
				if (draw) {
					await player.draw("nodelay");
					await trigger.player.draw();
				}
			}
			if (goon) await player.chooseUseTarget(card, false, !boolx);
		},
	},
	//族吴乔
	clanqiajue: {
		audio: 2,
		trigger: { player: "phaseDrawBegin" },
		filter(event, player) {
			return (
				player.countCards("he", card => {
					if (_status.connectMode && get.position(card) == "h") return true;
					return get.color(card, player) == "black" && lib.filter.cardDiscardable(card, player);
				}) > 0
			);
		},
		direct: true,
		async content(event, trigger, player) {
			const {
				result: { bool },
			} = await player
				.chooseToDiscard((card, player) => {
					return get.color(card, player) == "black" && lib.filter.cardDiscardable(card, player);
				}, "he")
				.set("prompt", "当前手牌点数和为" + player.getCards("h").reduce((sum, card) => sum + get.number(card), 0) + "，" + get.prompt("clanqiajue"))
				.set("prompt2", lib.translate.clanqiajue_info.slice(lib.translate.clanqiajue_info.indexOf("弃置")).slice(0, -1))
				.set("ai", card => {
					const player = get.event("player"),
						goon = get.position(card) == "h";
					let num = player.getCards("h").reduce((sum, card) => sum + get.number(card), 0);
					if (num - (goon ? get.number(card) : 0) > 30) return 0;
					return goon ? get.number(card) : 1 / (get.value(card) || 0.5);
				})
				.set("logSkill", "clanqiajue");
			if (bool) {
				player
					.when({
						player: ["phaseDrawEnd", "phaseDrawCancelled", "phaseUseSkipped"],
					})
					.filter(evt => evt == trigger)
					.then(() => {
						const cards = player.getCards("h"),
							num = cards.reduce((sum, card) => sum + get.number(card), 0);
						if (cards.length) player.showCards(cards, get.translation(player) + "【跒倔】展示");
						if (num > 30) {
							player.popup("杯具");
							lib.skill.chenliuwushi.change(player, -2);
						} else {
							player.popup("洗具");
							const evt = trigger.getParent("phase", true, true);
							if (evt && evt.phaseList) evt.phaseList.splice(evt.num + 1, 0, "phaseDraw|clanqiajue");
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
			if (Object.values(storage).includes(event.card.name)) return true;
			const suit = get.suit(event.card);
			if (suit == "none") return false;
			if (!player.hasSkill("qice")) return true;
			const key = `${suit}+${get.type2(event.card)}`;
			return !(key in storage);
		},
		forced: true,
		content() {
			"step 0";
			var storage = player.storage.clanbaichu || {},
				suit = get.suit(trigger.card);
			if (suit != "none") {
				var key = `${suit}+${get.type2(trigger.card)}`;
				if (key in storage) {
					if (!player.hasSkill("qice")) {
						player.addTempSkills("qice", "roundStart");
						player.popup("奇策");
						// game.log(player,'获得了技能','#g【奇策】');
					}
					event.goto(2);
				} else {
					var list = lib.inpile.filter(name => get.type(name) == "trick");
					list.removeArray(Object.values(storage));
					if (list.length > 0) {
						var dialog = ["百出：选择记录一种普通锦囊牌", [list, "vcard"]];
						player.chooseButton(dialog, true).set("ai", function (button) {
							var player = _status.event.player,
								name = button.link[2];
							if (name == _status.event.getTrigger().card.name) return 1919810;
							if (name == "wuxie") return 114514;
							return get.effect(player, { name: name }, player, player) * (1 + player.countCards("hs", name));
						});
					} else event.goto(2);
				}
			} else event.goto(2);
			"step 1";
			if (result.bool) {
				var key = `${get.suit(trigger.card)}+${get.type2(trigger.card)}`,
					name = result.links[0][2];
				if (!player.storage.clanbaichu) player.storage.clanbaichu = {};
				player.storage.clanbaichu[key] = name;
				player.markSkill("clanbaichu");
				game.log(player, "记录了", "#y" + get.translation(name));
				game.delayx();
			}
			"step 2";
			if (Object.values(player.getStorage("clanbaichu")).includes(trigger.card.name)) {
				player.chooseDrawRecover(true);
			}
		},
		mark: true,
		intro: {
			markcount(storage = {}) {
				return Object.keys(storage).length;
			},
			/*
			content(storage) {
				if (!storage) return "当前暂无记录";
				const keys = Object.keys(storage).map(i => i.split("+"));
				keys.sort((a, b) => {
					if (a[0] != b[0]) return lib.suit.indexOf(b[0]) - lib.suit.indexOf(a[0]);
					return lib.sort.name(a[1], b[1]);
				});
				return keys
					.map(item => {
						return `<li>${get.translation(item[0])}+${get.translation(item[1])}:【${get.translation(storage[item.join("+")])}】`;
					})
					.join("<br>");
			},
			*/
			mark(dialog, storage = {}) {
				const addNewRow = lib.element.dialog.addNewRow.bind(dialog);
				dialog.css({ width: "50%" });
				if (get.is.phoneLayout()) dialog.classList.add("fullheight");
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
								if (storage[suit + "+" + type]) return get.translation(storage[suit + "+" + type]);
								return null;
							})(suit, type, storage),
							ratio: 2,
						});
					}
					addNewRow(...list);
				}
			},
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
					if (!player.canUse(get.autoViewAs({ name: "sha" }, []), target)) num1 = 0;
					var num2 = 0;
					for (var name of lib.inpile) {
						if (get.type(name) != "trick") continue;
						if (!player.canUse(get.autoViewAs({ name: name }, []), target)) continue;
						if (num2 < get.effect(target, get.autoViewAs({ name: name }, []), player, player)) num2 = get.effect(target, get.autoViewAs({ name: name }, []), player, player);
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
						if (get.name(card, player) != "sha" && get.type(card, null, player) != "trick") return false;
						return player.hasValueTarget(card);
					});
					if (cards.some(card => player.canUse(card, target) && get.effect(target, card, player, player) > 0)) {
						var att = get.attitude(player, target);
						if (att > 0) return 9;
						if (att < 0) return -6;
						return 0;
					} else {
						var att = get.attitude(player, target);
						if (att < 0) return -3;
						if (att > 0) return 1;
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
							if (list[1]) strx.reverse();
							infos.add("对" + get.translation(list[0]) + "使用" + strx[0] + "后，视为对其使用" + strx[1]);
						}
						return infos.join("<br>");
					},
				},
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					if (!event.targets || !event.targets.length) return false;
					if (event.card.name == "sha")
						return event.targets.some(target => {
							return player.getStorage("clanqiuxin_effect").some(list => list[0] == target && list[1] == 0);
						});
					if (get.type(event.card) == "trick")
						return event.targets.some(target => {
							return player.getStorage("clanqiuxin_effect").some(list => list[0] == target && list[1] == 1);
						});
					return false;
				},
				forced: true,
				popup: false,
				content() {
					"step 0";
					var list;
					if (trigger.card.name == "sha") list = player.getStorage("clanqiuxin_effect").filter(listx => trigger.targets.includes(listx[0]) && listx[1] == 0);
					if (get.type(trigger.card) == "trick") list = player.getStorage("clanqiuxin_effect").filter(listx => trigger.targets.includes(listx[0]) && listx[1] == 1);
					player.unmarkAuto("clanqiuxin_effect", list);
					var targets = list.map(listx => listx[0]);
					event.targets = targets;
					"step 1";
					var target = event.targets.shift();
					event.target = target;
					var list = [];
					const nameFilter = trigger.card.name == "sha" ? name => get.type(name) == "trick" : name => name == "sha";
					for (var name of lib.inpile) {
						if (name != "sha" && get.type(name) != "trick") continue;
						if (!nameFilter(name)) continue;
						if (!player.canUse(get.autoViewAs({ name: name }, []), target)) continue;
						list.push([get.translation(get.type(name)), "", name]);
					}
					if (!list.length) event.goto(3);
					else {
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
					if (event.targets.length) event.goto(1);
					else if (!player.getStorage("clanqiuxin_effect").length) player.removeSkill("clanqiuxin_effect");
				},
			},
		},
	},
	clanjianyuan: {
		inherit: "clanchenya",
		filter(event, player) {
			if (event.type != "player") return false;
			var skill = get.sourceSkillFor(event);
			var info = get.info(skill);
			if (info.charlotte) return false;
			var translation = get.skillInfoTranslation(skill, event.player);
			if (!translation) return false;
			var match = get.plainText(translation).match(/“?出牌阶段限一次/g);
			if (!match || match.every(value => value != "出牌阶段限一次") || !event.player.countCards("he")) return false;
			for (var phase of lib.phaseName) {
				var evt = event.getParent(phase);
				if (evt && evt.name == phase) {
					if (event.player.getHistory("useCard", evtx => evtx.getParent(phase) == evt).length) return true;
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
				.chooseCard("是否重铸任意张牌名字数为" + num + "的牌？", [1, Infinity], "he", (card, player) => _status.event.cards.includes(card) && player.canRecast(card))
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
			if (result.bool) trigger.player.recast(result.cards);
		},
	},
	//族钟毓
	clanjiejian: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget || get.type(event.card) == "equip") return false;
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
					if (!target || typeof card !== "object" || player._clanjiejian_mod_temp || get.type(card) === "equip" || get.attitude(player, target) <= 0 || get.cardNameLength(card) !== player.getHistory("useCard").length + 1) return;
					let targets = [target],
						evt = _status.event.getParent("useCard");
					targets.addArray(ui.selected.targets);
					if (evt && evt.card == card) targets.addArray(evt.targets);
					return [1, (0.8 * get.cardNameLength(card)) / targets.length];
				},
			},
		},
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object" && get.type(card) !== "equip") {
					let cs = get.cardNameLength(card) - player.getHistory("useCard").length - 1;
					if (cs < 0) return num;
					if (cs > 0) return num / 3;
					player._clanjiejian_mod_temp = true;
					let bool = game.hasPlayer(target => {
						if (get.attitude(player, target) <= 0 || !player.canUse(card, target, null, true)) return false;
						return get.effect(target, card, player, player) + get.effect(target, { name: "draw" }, player, player) > 0;
					});
					delete player._clanjiejian_mod_temp;
					if (bool) return num + 15;
				}
			},
		},
	},
	clanhuanghan: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (!event.card) return false;
			var num = get.cardNameLength(event.card);
			return typeof num == "number" && num > 0;
		},
		check(event, player) {
			let num = get.cardNameLength(event.card) - player.getDamagedHp();
			if (num >= 0) return true;
			if (num < -1) return false;
			if (
				player.hasSkill("clanbaozu", null, false, false) &&
				player.awakenedSkills.includes("clanbaozu") &&
				player.getHistory("useSkill", evt => {
					return evt.skill == "clanhuanghan";
				}).length
			)
				return true;
			return false;
		},
		content() {
			"step 0";
			player.draw(get.cardNameLength(trigger.card));
			if (player.isDamaged()) player.chooseToDiscard(player.getDamagedHp(), "he", true);
			"step 1";
			if (player.getHistory("useSkill", evt => evt.skill == "clanhuanghan").length > 1 && player.hasSkill("clanbaozu", null, false, false) && player.awakenedSkills.includes("clanbaozu")) {
				player.restoreSkill("clanbaozu");
				player.popup("保族");
				game.log(player, "恢复了技能", "#g【保族】");
			}
		},
		ai: {
			threaten: 3,
			effect: {
				target(card, player, target) {
					if (!lib.translate[card.name] || !get.tag(card, "damage") || player.hasSkillTag("jueqing", false, target)) return;
					let num = get.cardNameLength(card) - target.getDamagedHp();
					if (num > 0) return [1, 0.8 * num + 0.1];
				},
			},
		},
	},
	//族钟会
	clanyuzhi: {
		mod: {
			aiOrder(player, card, num) {
				if (card.name == "tao") return num / 114514;
			},
		},
		audio: 6,
		trigger: { global: "roundStart" },
		direct: true,
		locked: true,
		content() {
			"step 0";
			player.unmarkSkill("clanyuzhi");
			const cards = player.getCards("h", card => {
				return card.hasGaintag("clanyuzhi") && lib.filter.cardDiscardable(card, player);
			});
			if (cards.length) {
				event.logged = true;
				player.logSkill("clanyuzhi");
				player.discard(cards);
			}
			"step 1";
			player.removeGaintag("clanyuzhi");
			var num1 = player
				.getRoundHistory(
					"gain",
					evt => {
						return evt.getParent().name == "draw" && evt.getParent(2).name == "clanyuzhi";
					},
					1
				)
				.reduce((sum, evt) => sum + evt.cards.length, 0);
			var num2 = player
				.getRoundHistory(
					"gain",
					evt => {
						return evt.getParent().name == "draw" && evt.getParent(2).name == "clanyuzhi";
					},
					2
				)
				.reduce((sum, evt) => sum + evt.cards.length, 0);
			var num3 = player
				.getRoundHistory(
					"useCard",
					evt => {
						return evt.cards && evt.cards.length;
					},
					1
				)
				.reduce((sum, evt) => sum + evt.cards.length, 0);
			event.num1 = num1;
			if ((num1 > 0 && num2 > 0 && num1 > num2) || num1 > num3) {
				if (!event.logged) player.logSkill("clanyuzhi");
				if (num2 > 0 && num1 > num2) game.log(player, "的野心已开始膨胀", "#y(" + num1 + "张>" + num2 + "张)");
				if (num1 > num3) game.log(player, "的行动未达到野心", "#y(" + num3 + "张<" + num1 + "张)");
				if (player.hasSkill("clanbaozu", null, false, false)) player.chooseBool("迂志：是否失去〖保族〗？", "若选择“否”，则你受到1点雷属性伤害").set("choice", player.awakenedSkills.includes("clanbaozu"));
				else event._result = { bool: false };
			} else event.goto(3);
			"step 2";
			if (result.bool) {
				player.removeSkills("clanbaozu");
			} else player.damage(1, "thunder");
			"step 3";
			if (player.countCards("h")) {
				player
					.chooseCard(
						"迂志：请展示一张手牌",
						"摸此牌牌名字数的牌。下一轮开始时弃置此牌，若本轮你使用的牌数或上一轮你以此法摸的牌数小于此牌牌名字数，则你受到1点雷属性伤害或失去〖保族〗。",
						function (card, player) {
							var num = get.cardNameLength(card);
							return typeof num == "number" && num > 0;
						},
						true
					)
					.set("ai", function (card) {
						if (_status.event.dying && _status.event.num > 0 && get.cardNameLength(card) > _status.event.num) return 1 / get.cardNameLength(card); //怂
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
					.set("num", event.num1);
			} else event.finish();
			"step 4";
			if (result.bool) {
				player.logSkill("clanyuzhi");
				player.showCards(result.cards, get.translation(player) + "发动了【迂志】");
				player.addGaintag(result.cards, "clanyuzhi");
				player.draw(get.cardNameLength(result.cards[0]));
				player.storage.clanyuzhi = get.cardNameLength(result.cards[0]);
				player.markSkill("clanyuzhi");
			}
		},
		ai: {
			threaten: 3,
			nokeep: true,
		},
		onremove: true,
		intro: { content: "本轮野心：#张" },
	},
	clanxieshu: {
		audio: 6,
		trigger: { player: "damageEnd", source: "damageSource" },
		filter(event, player) {
			if (!event.card || player.isLinked()) return false;
			var num = get.cardNameLength(event.card);
			return typeof num == "number" && num > 0 && player.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			var num = get.cardNameLength(trigger.card),
				str = "";
			if (player.getDamagedHp() > 0) str += "，然后摸" + get.cnNumber(player.getDamagedHp()) + "张牌";
			event.result = await player
				.chooseToDiscard(get.prompt("clanxieshu"), "横置武将牌并弃置" + get.cnNumber(num) + "张牌" + str, "he", num)
				.set("ai", function (card) {
					var player = _status.event.player;
					var num = _status.event.num;
					var num2 = player.getDamagedHp();
					if (!num2) return 0;
					if (num < num2) return 8 - get.value(card);
					if (num == num2 || num2 >= 2 + num - num2) return lib.skill.zhiheng.check(card);
					return 0;
				})
				.set("num", num)
				.set("logSkill", "clanxieshu")
				.forResult();
		},
		popup: false,
		*content(event, map) {
			const player = map.player;
			yield player.link(true);
			if (player.getDamagedHp() > 0) {
				yield player.draw(player.getDamagedHp());
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
				if (player.isPhaseUsing() && get.type(card) == "equip" && get.equipValue(card, player) > 0) return num + 3;
			},
			cardUsable(card) {
				if (card.storage?.clanfuxun) return Infinity;
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
			if (ui.selected.targets.length && !ui.selected.targets[0].countGainableCards(player, "h")) return 1;
			return [0, 1];
		},
		filterTarget(card, player, target) {
			if (player == target) return false;
			if (!ui.selected.cards.length) return target.countGainableCards(player, "h") > 0;
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
					if (player.countCards("h") > target.countCards("h")) return 1 / (get.value(card) || 0.5);
					return -1;
				}
				if (card.name == "du") return 20;
				return -1;
			}
			if (card.name == "du") return 20;
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
					if (get.type(name) != "basic") continue;
					if (player.hasUseTarget({ name: name })) list.push(["基本", "", name]);
					if (name == "sha") {
						for (var nature of lib.inpile_nature) {
							if (
								player.hasUseTarget({
									name: name,
									nature: nature,
								})
							)
								list.push(["基本", "", name, nature]);
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
				} else event.finish();
			} else event.finish();
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
					replace: { window() { } },
				});
				next.backup("clanfuxun_backup");
			}
		},
		ai: {
			order(item, player) {
				var evtx = _status.event.getParent("phaseUse");
				if (
					game.hasPlayer(current => {
						if (current == player || !evtx || get.attitude(player, current) == 0) return false;
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
				)
					return 10;
				return 2;
			},
			result: {
				target(player, target) {
					var evtx = _status.event.getParent("phaseUse");
					var num = get.sgn(get.attitude(player, target));
					var targets = game.filterPlayer(current => {
						if (current == player || !evtx || get.attitude(player, current) == 0) return false;
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
						if (player.countCards("h") < target.countCards("h")) return get.sgn(num + 0.5) * Math.sqrt(2 - num);
						else return num * (2 + num);
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
					if (player.hasSkill("clanzhongliu") && get.position(card) != "h") return 10 - get.value(card);
					return 5 - get.value(card);
				},
				log: false,
				precontent() {
					delete event.result.skill;
				},
			},
		},
	},
	clanchenya: {
		audio: 2,
		trigger: {
			global: ["useSkillAfter", "logSkill"],
		},
		filter(event, player) {
			if (event.type != "player") return false;
			var skill = get.sourceSkillFor(event);
			var info = get.info(skill);
			if (info.charlotte) return false;
			var translation = get.skillInfoTranslation(skill, event.player);
			if (!translation) return false;
			var match = get.plainText(translation).match(/“?出牌阶段限一次/g);
			if (!match || match.every(value => value != "出牌阶段限一次")) return false;
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
				.chooseCard("是否重铸任意张牌名字数为" + num + "的牌？", [1, Infinity], "he", (card, player) => _status.event.cards.includes(card) && player.canRecast(card))
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
			if (result.bool) trigger.player.recast(result.cards);
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
			if ((storage || 0) % 2) return "将一张黑色牌当【过河拆桥】使用";
			return "将一张红色牌当【顺手牵羊】使用";
		},
		skillAnimation: true,
		animationColor: "thunder",
		precontent() {
			"step 0";
			var skill = "clanjiexuan";
			player.logSkill(skill);
			player.changeZhuanhuanji(skill);
			player.awakenSkill(skill, true);
			delete event.result.skill;
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
						content: storage => "已被" + get.translation(storage[0]) + "指定为【铭戒】目标",
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
				return skill.startsWith("clanmingjiex_" + player.playerid + "_") && target.storage[skill] === 1 + (_status.currentPhase === target);
			});
		},
		skillAnimation: true,
		animationColor: "thunder",
		content() {
			player.awakenSkill("clanmingjie");
			player.addSkill("clanmingjie_effect");
			let skill;
			do {
				skill = "clanmingjiex_" + player.playerid + "_" + Math.random().toString(36).slice(-8);
			} while (lib.skill[skill] != null);
			game.broadcastAll(lib.skill.clanmingjie.initSkill, skill);
			target.addSkill(skill);
			target.storage[skill] = _status.currentPhase === target ? 2 : 1;
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (player.hasSkill("clanzhongliu") || player.hp == 1) {
						if (
							!player.hasCard(card => {
								var info = get.info(card);
								if (info.allowMultiple == false) return false;
								if (!lib.filter.targetEnabled2(card, player, target)) return false;
								return game.hasPlayer(current => {
									return player.canUse(card, current) && get.effect(current, card, player, player) > 0 && current != target && get.effect(target, card, player, player) > 0;
								});
							}, "hs")
						)
							return 0;
					} else {
						if (
							player.countCards("hs", card => {
								var info = get.info(card);
								if (info.allowMultiple == false) return false;
								if (!lib.filter.targetEnabled2(card, player, target)) return false;
								return game.hasPlayer(current => {
									return player.canUse(card, current) && get.effect(current, card, player, player) > 0 && current != target && get.effect(target, card, player, player) > 0;
								});
							}) < 3
						)
							return 0;
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
					var card = event.card;
					var info = get.info(card);
					if (info.allowMultiple == false) return false;
					if (event.targets && !info.multitarget) {
						return game.filterPlayer().some(current => {
							if (!Object.keys(current.storage).some(skill => skill.startsWith("clanmingjiex_" + player.playerid + "_"))) return false;
							return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && lib.filter.targetInRange(card, player, current);
						});
					}
					return false;
				},
				direct: true,
				content() {
					"step 0";
					player
						.chooseTarget(
							get.prompt("clanmingjie_effect"),
							"令任意【铭戒】目标角色成为" + get.translation(trigger.card) + "的目标",
							function (card, player, target) {
								var trigger = _status.event.getTrigger();
								if (trigger.targets.includes(target) || !Object.keys(target.storage).some(skill => skill.startsWith("clanmingjiex_" + player.playerid + "_"))) return false;
								return lib.filter.targetEnabled2(trigger.card, player, target) && lib.filter.targetInRange(trigger.card, player, target);
							},
							[1, Infinity]
						)
						.set("ai", function (target) {
							var player = _status.event.player;
							var trigger = _status.event.getTrigger();
							return get.effect(target, trigger.card, player, player);
						});
					"step 1";
					if (result.bool) {
						var targets = result.targets.sortBySeat();
						player.logSkill("clanmingjie_effect", targets);
						trigger.targets.addArray(targets);
						game.log(targets, "成为了", trigger.card, "的额外目标");
					}
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
						player.storage[skill]--;
						if (!player.storage[skill]) player.removeSkill(skill);
					}
				},
			},
			targeted: {
				charlotte: true,
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					if (!Object.keys(event.player.storage).some(skill => {
						return skill.startsWith("clanmingjiex_" + player.playerid + "_") && event.player.storage[skill] == 1;
					})) return false;
					return player.getStorage("clanmingjie_record").someInD("d");
				},
				forced: true,
				popup: false,
				content() {
					"step 0";
					var cards = player.getStorage("clanmingjie_record").slice();
					cards = cards.filterInD("d");
					event.cards = cards;
					"step 1";
					player
						.chooseButton(["铭戒：是否使用这些牌？", cards])
						.set("filterButton", button => {
							return _status.event.player.hasUseTarget(button.link);
						})
						.set("ai", button => {
							return _status.event.player.getUseValue(button.link);
						});
					"step 2";
					if (result.bool) {
						var card = result.links[0];
						event.cards.remove(card);
						player.$gain2(card, false);
						game.delayx();
						player.chooseUseTarget(card, true);
					} else event.finish();
					"step 3";
					if (
						event.cards.filter(card => {
							return get.position(card, true) == "d" && player.hasUseTarget(card);
						}).length
					)
						event.goto(1);
				},
			},
			record: {
				charlotte: true,
				trigger: {
					global: ["useCard", "respond", "useCard1", "phaseAfter"],
				},
				filter(event, player, name) {
					if (name == "useCard1") return get.suit(event.card) == "spade";
					if (event.name == "phase") return true;
					if (!Array.isArray(event.respondTo)) return false;
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
								if (event.triggername == "useCard1") return evt == trigger;
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
			if (player.storage.clanguangu)
				return game.hasPlayer(current => {
					return current.countCards("h");
				});
			return true;
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("观骨：选择观看牌堆的牌数", "hidden");
				if (player.storage.clanguangu) dialog.forceDirect = true;
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
				if (!player.hasSkill("clanxiaoyong")) ret = 4;
				else {
					var list = [4, 3, 2, 1];
					player.getHistory("useCard", evt => {
						var len = get.cardNameLength(evt.card);
						list.remove(len);
					});
					if (list.length) ret = list[0];
					else ret = 4;
				}
				return get.cnNumber(ret, true);
			},
			backup(result, player) {
				return {
					audio: "clanguangu",
					filterCard: () => false,
					selectCard: -1,
					filterTarget(card, player, target) {
						if (player.storage.clanguangu) return true;
						return false;
					},
					selectTarget() {
						var player = _status.event.player;
						if (player.storage.clanguangu) return 1;
						return -1;
					},
					num: result.index + 1,
					content() {
						"step 0";
						player.changeZhuanhuanji("clanguangu");
						if (!targets.length) {
							var num = lib.skill.clanguangu_backup.num;
							var cards = get.cards(num);
							event.cards = cards.slice(0);
							while (cards.length) ui.cardPile.insertBefore(cards.pop().fix(), ui.cardPile.firstChild);
							game.updateRoundNumber();
							event.goto(2);
						} else {
							var ret;
							if (!player.hasSkill("clanxiaoyong")) ret = 4;
							else {
								var list = [4, 3, 2, 1];
								player.getHistory("useCard", evt => {
									var len = get.cardNameLength(evt.card);
									list.remove(len);
								});
								if (list.length) ret = list[0];
								else ret = 4;
							}
							player
								.choosePlayerCard(target, "h", true, [1, 4])
								.set("prompt", "观骨：观看" + get.translation(target) + "的至多四张牌")
								.set("ai", button => {
									if (ui.selected.buttons.length >= _status.event.num) return 0;
									return Math.random();
								})
								.set("num", ret);
						}
						"step 1";
						if (result.bool) {
							event.cards = result.links;
						} else {
							event.finish();
						}
						"step 2";
						var count = cards.length;
						event.getParent().viewedCount = count;
						player
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
								if (get.cardNameLength(card) == len) fix = 2;
								return fix * _status.event.player.getUseValue(card);
							})
							.set(
								"len",
								(function () {
									if (!player.hasSkill("clanxiaoyong")) return 0;
									var list = [];
									player.getHistory("useCard", evt => {
										var len = get.cardNameLength(evt.card);
										list.add(len);
									});
									if (!list.includes(count)) return count;
									if (list.length) return list.randomGet();
									return 4;
								})()
							);
						"step 3";
						if (result.bool) {
							var card = result.links[0];
							cards.remove(card);
							var cardx = {
								name: get.name(card, get.owner(card)),
								nature: get.nature(card, get.owner(card)),
								cards: [card],
							};
							var next = player.chooseUseTarget(cardx, [card], true, false).set("oncard", card => {
								var owner = _status.event.getParent().owner;
								if (owner) owner.$throw(card.cards);
							});
							if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) next.viewAs = false;
							var owner = get.owner(card);
							if (owner != player && get.position(card) == "h") {
								next.throw = false;
								next.set("owner", owner);
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
				if (!player.storage.clanguangu) return "点击“确定”以观看牌堆顶牌";
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
			)
				return false;
			if (!player.getStat().skill.clanguangu) return false;
			var history = player
				.getAllHistory("useSkill", evt => {
					return evt.skill == "clanguangu_backup";
				})
				.map(evt => evt.event);
			if (!history.length) return false;
			var num = 0;
			for (var i = history.length - 1; i >= 0; i--) {
				var evt = history[i];
				if (evt.viewedCount) {
					num = evt.viewedCount;
					break;
				}
			}
			if (num && len == num) return true;
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
				if (!player.hasSkill("clanguangu") || !player.getStat().skill.clanguangu) return;
				var history = player
					.getAllHistory("useSkill", evt => {
						return evt.skill == "clanguangu_backup";
					})
					.map(evt => evt.event);
				if (!history.length) return;
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
			player.awakenSkill("clanbaozu");
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
			if (!num || target.countCards("he") < num) event._result = { bool: false };
			else
				target
					.chooseCard(get.translation(player) + "对你发动了【驳龙】", str, num, "he")
					.set("ai", card => {
						if (_status.event.canGive) return 5 + Math.max(0, 3 - _status.event.player.hp) / 1.5 - get.value(card);
						return 0;
					})
					.set(
						"canGive",
						(function () {
							if (get.attitude(target, player) > 1) return true;
							if (!player.hasSha() && player.countCards("h") <= 4) return true;
							var sha = {
								name: "sha",
								nature: "thunder",
								isCard: true,
							};
							if (
								game.hasPlayer(current => {
									return player.canUse(sha, current, true, true) && get.effect(current, sha, player, target) < 0 && !current.countCards("hs", ["shan", "caochuan"]);
								})
							)
								return false;
							return true;
						})()
					);
			"step 1";
			if (result.bool) {
				var cards = result.cards;
				target.give(cards, player);
				if (lib.filter.targetEnabled2({ name: "jiu", isCard: true }, target, player)) target.useCard({ name: "jiu", isCard: true }, player, false);
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
				if (player.canUse(sha, target, false, false)) player.useCard(sha, target, false);
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
					)
						return -1;
					return 0;
				},
			},
		},
	},
	clanzhongliu: {
		audio: 2,
		audioname: ["clan_wangling", "clan_wangyun", "clan_wanghun", "clan_wanglun", "clan_wangguang", "clan_wangmingshan", "clan_wangchang"],
		trigger: { player: "useCard" },
		forced: true,
		clanSkill: true,
		filter(event, player) {
			if (!event.cards.length) return true;
			return !game.hasPlayer2(current => {
				if (!current.hasClan("太原王氏") && current != player) return false;
				return current.hasHistory("lose", evt => {
					return evt.getParent() == event && evt.hs.length > 0;
				});
			});
		},
		content() {
			"step 0";
			var skills = player.getStockSkills(true, true);
			game.expandSkills(skills);
			var resetSkills = [];
			var suffixs = ["used", "round", "block", "blocker"];
			for (var skill of skills) {
				var info = get.info(skill);
				if (info.usable !== undefined) {
					if (player.hasSkill("counttrigger") && player.storage.counttrigger[skill] && player.storage.counttrigger[skill] >= 1) {
						delete player.storage.counttrigger[skill];
						resetSkills.add(skill);
					}
					if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
						delete player.getStat("skill")[skill];
						resetSkills.add(skill);
					}
				}
				if (info.round && player.storage[skill + "_roundcount"]) {
					delete player.storage[skill + "_roundcount"];
					resetSkills.add(skill);
				}
				if (player.storage[`temp_ban_${skill}`]) {
					delete player.storage[`temp_ban_${skill}`];
				}
				if (player.awakenedSkills.includes(skill)) {
					player.restoreSkill(skill);
					resetSkills.add(skill);
				}
				for (var suffix of suffixs) {
					if (player.hasSkill(skill + "_" + suffix)) {
						player.removeSkill(skill + "_" + suffix);
						resetSkills.add(skill);
					}
				}
			}
			if (resetSkills.length) {
				var str = "";
				for (var i of resetSkills) {
					str += "【" + get.translation(i) + "】、";
				}
				game.log(player, "重置了技能", "#g" + str.slice(0, -1));
			}
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
				if (!storage) str += "Ａ可以重铸一张牌，然后你可以重铸一张牌。若这两张牌颜色不同，则你的手牌上限-1。";
				else str += "Ａ可以令你选择一名在你或Ａ攻击范围内的另一名其他角色Ｂ，然后Ａ和你可依次选择是否对Ｂ使用一张【杀】。若这两张【杀】颜色相同，则你的手牌上限+1";
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
									if (current == player || current == target) return false;
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
					if (!target) return false;
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
										if (current == player || current == target) return false;
										return current.inRangeOf(player) || current.inRangeOf(target);
									})
								)
									kita.add(target);
							} else {
								if (player.countCards("he") > 0) bocchi.add(target);
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
							if (i < bocchi.length - 1) str += "或";
						});
						str += "选择是否重铸一张牌";
						if (kita.length) str += "。<br>或者";
					}
					if (kita.length) {
						str += "令";
						kita.forEach((current, i) => {
							str += get.translation(current);
							if (i < kita.length - 1) str += "或";
						});
						str += "选择一名目标，然后对其进行集火";
					}
					str += "。";
					return str;
				},
				content() {
					"step 0";
					target.addTempSkill("clanlianzhu_targeted", "phaseUseAfter");
					if (target.storage.clanlianzhu) event.goto(4);
					target.changeZhuanhuanji("clanlianzhu");
					"step 1";
					player.recast(cards);
					"step 2";
					if (!target.countCards("he") && !_status.connectMode) event._result = { bool: false };
					else target.chooseCard("he", "联诛：是否重铸一张牌？", lib.filter.cardRecastable);
					"step 3";
					if (result.bool) {
						target.recast(result.cards);
						if (get.color(cards[0]) === get.color(result.cards[0])) lib.skill.chenliuwushi.change(target, 1);
					}
					event.finish();
					"step 4";
					target
						.chooseTarget("联诛：选择其与你使用【杀】的目标", true, (card, player, target) => {
							if (target == player || target == _status.event.sourcex) return false;
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
						if (!event.isMine() && !event.isOnline()) game.delayx();
					} else event.finish();
					"step 6";
					var current = targets.shift();
					current
						.chooseToUse(function (card, player, event) {
							if (get.name(card) != "sha") return false;
							return lib.filter.filterCard.apply(this, arguments);
						}, "联诛：是否对" + get.translation(event.targetx) + "使用一张杀？")
						.set("targetRequired", true)
						.set("complexSelect", true)
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("sourcex", event.targetx)
						.set("addCount", false);
					"step 7";
					if (result.bool) cards.push(result.card);
					if (targets.length > 0) event.goto(6);
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
							if (!target.storage.clanlianzhu && player.hasCard(card => get.value(card) < 5, "he")) return 1;
							return 0;
						},
						target(player, target) {
							if (target.storage.clanlianzhu && player.hasSha()) return 1;
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
								if (get.name(cardx) != "sha") return false;
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
						if (eff > 0) return eff;
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
						if (get.name(card) != "sha") return false;
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
				if (target.isDamaged()) choices.push("选项二");
				else choiceList[1] = '<span style="opacity:0.5; ">' + choiceList[1] + "</span>";
				player
					.chooseControl(choices)
					.set("prompt", "放赈：请选择一项")
					.set("choiceList", choiceList)
					.set("ai", () => {
						var player = _status.event.player,
							target = _status.event.getParent().target;
						if (!target.isDamaged()) return 0;
						if (get.attitude(player, target) <= 0 && player.countCards("he", card => get.value(card) < 0) >= 2) return 0;
						return 2 * get.effect(target, { name: "draw" }, player, player) + 0.6 * get.effect(player, { name: "draw" }, player, player) > get.recoverEffect(target, player, player) ? 0 : 1;
					});
			} else event.finish();
			"step 2";
			if (result.control == "选项一") {
				player.draw(2);
				if (player == target) event.finish();
			} else {
				target.recover();
				event.finish();
			}
			"step 3";
			if (!player.countCards("he")) event.finish();
			else if (player.countCards("he") <= 2)
				event._result = {
					bool: true,
					cards: player.getCards("he"),
				};
			else {
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
				.chooseTarget(get.prompt("clanliuju"), "与一名其他角色拼点，输的角色可以使用任意张拼点牌中的非基本牌", (card, player, target) => {
					return player.canCompare(target);
				})
				.set("ai", target => {
					var player = _status.event.player;
					var ts = target.getCards("h").sort((a, b) => get.number(a) - get.number(b));
					if (get.attitude(player, target) < 0) {
						var hs = player.getCards("h").sort((a, b) => get.number(a) - get.number(b));
						if (!hs.length || !ts.length) return 0;
						if (get.type(hs[0], null, false) == "basic" && get.value(hs[0]) > 6) return 0;
						if (get.number(hs[0]) < get.number(ts[0]) || get.type(hs[0], null, false) == "basic") return 1;
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
					if (evt.getParent(2).name === "chooseToCompare" && evt.getParent(3) === event)
						cards.addArray(
							evt.cards.filter(i => {
								return get.position(i, true) == "d" && get.type(i, null, false) != "basic";
							})
						);
				});
				event.loser = loser;
				event.distance = [get.distance(player, target), get.distance(target, player)];
				if (cards.length) event.cards = cards;
				else event.finish();
			} else event.finish();
			"step 2";
			var cardsx = cards.filter(i => get.position(i, true) == "d" && event.loser.hasUseTarget(i));
			if (!cardsx.length) event.goto(6);
			else
				event.loser
					.chooseButton(["留驹：是否使用其中的一张牌？", cardsx])
					.set("filterButton", button => {
						return _status.event.player.hasUseTarget(button.link);
					})
					.set("ai", button => {
						return _status.event.player.getUseValue(button.link) + 0.1;
					});
			"step 3";
			if (result.bool) {
				var card = result.links[0];
				event.cards.remove(card);
				event.loser.$gain2(card, false);
				game.delayx();
				event.loser.chooseUseTarget(true, card, false);
			} else event.goto(5);
			"step 4";
			if (cards.filter(i => get.position(i, true) == "d" && event.loser.hasUseTarget(i)).length) event.goto(2);
			"step 5";
			if (get.distance(player, target) != event.distance[0] || get.distance(target, player) != event.distance[1]) {
				player.restoreSkill("clanxumin");
				game.log(player, "重置了", "#g【恤民】");
			}
		},
	},
	clanxumin: {
		audio: 2,
		audioname: ["clan_hanshao", "clan_hanrong"],
		enable: "phaseUse",
		viewAs: { name: "wugu" },
		filterCard: true,
		filterTarget(card, player, target) {
			if (player == target) return false;
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
		precontent() {
			player.logSkill("clanxumin");
			player.awakenSkill("clanxumin");
			delete event.result.skill;
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
					if (att > 0) att /= 1.2;
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
					if (trigger.name == "die") event.finish();
					"step 1";
					if (
						trigger.player.hasHistory("gain", evt => {
							return evt.getParent().name == "draw" && evt.getParent("phaseUse") == trigger;
						})
					)
						event.finish();
					else {
						player.logSkill("clanlianhe_effect", trigger.player);
						var num = 0;
						trigger.player.getHistory("gain", evt => {
							if (evt.getParent("phaseUse") != trigger) return false;
							num += evt.cards.length;
						});
						num = Math.min(num, 3);
						event.num = num;
						if (num <= 1) event._result = { bool: false };
						else {
							var pos = player == trigger.player ? "e" : "he";
							trigger.player
								.chooseCard("连和：交给" + get.translation(player) + get.cnNumber(num - 1) + "张牌，或点“取消”令其摸" + get.cnNumber(num + 1) + "张牌", num - 1, pos)
								.set("ai", card => {
									if (_status.event.draw) return 0;
									return 5 - get.value(card);
								})
								.set("draw", get.attitude(trigger.player, player) >= 0);
						}
					}
					"step 2";
					if (result.bool) {
						trigger.player.give(result.cards, player);
					} else player.draw(num + 1);
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
						if (!hs.length || !ts.length) return 0;
						if (get.number(hs[0]) > get.number(ts[0]) && !get.tag(hs[0], "damage") && player.hasValueTarget(hs[0])) return 1;
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
			} else event.finish();
			"step 2";
			if (!result.tie) {
				var winner = result.bool ? player : target;
				var cards = [];
				game.getGlobalHistory("cardMove", evt => {
					if (evt.getParent(3) == event) cards.addArray(evt.cards.filterInD("d"));
				});
				event.winner = winner;
				if (cards.length) event.cards = cards;
				else event.finish();
			} else event.finish();
			"step 3";
			var cardsx = cards.filter(i => get.position(i, true) == "d" && event.winner.hasUseTarget(i));
			if (!cardsx.length) event.goto(6);
			else
				event.winner
					.chooseButton(["缓颊：是否使用其中的一张牌？", cardsx])
					.set("filterButton", button => {
						return _status.event.player.hasUseTarget(button.link);
					})
					.set("ai", button => {
						var damage = 1;
						if (_status.event.att > 2 && get.tag(button.link, "damage")) damage *= 2;
						return _status.event.player.getUseValue(button.link) * damage + 0.1;
					})
					.set("att", get.attitude(event.winner, player));
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
					if (!info || get.is.empty(info) || info.charlotte) return false;
					return true;
				});
				player
					.chooseControl(skills)
					.set(
						"choiceList",
						skills.map(i => {
							return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div>";
						})
					)
					.set("displayIndex", false)
					.set("prompt", "恤民：失去一个技能")
					.set("ai", () => {
						var choices = _status.event.controls.slice();
						var value = skill => get.skillRank(skill, "in") + get.skillRank(skill, "out");
						choices = choices.map(skill => [skill, value(skill)]);
						var list = choices.sort((a, b) => a[1] - b[1])[0];
						if (list[1] < 2) return list[0];
						else {
							if (_status.event.controls.includes("clanxumin")) return "clanxumin";
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
		direct: true,
		forced: true,
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) return false;
			const type = get.type2(event.card);
			return player.getRoundHistory("useCard", evt => get.type2(evt.card) == type).indexOf(event) == 0;
		},
		getNum(player) {
			return (player.countCards("ej") > 0) + player.isDamaged() + (Math.max(0, player.hp) < player.countCards("h"));
		},
		content() {
			"step 0";
			var cards = trigger.cards.filterInD("oe");
			player
				.chooseTarget("三恇：选择一名其他角色", "令其交给你至少X张牌" + (cards.length ? "，然后其获得" + get.translation(cards) : "") + "（X为以下条件中其满足的项数：场上有牌、已受伤、体力值小于手牌数）", true, lib.filter.notMe)
				.set("ai", target => {
					var att = get.attitude(player, target),
						num = lib.skill.clansankuang.getNum(target);
					if (num == 0) return att;
					if (_status.event.goon) return -att;
					return -Math.sqrt(Math.abs(att)) - lib.skill.clansankuang.getNum(target);
				})
				.set(
					"goon",
					Math.max.apply(
						Math,
						trigger.cards.map(i => get.value(i))
					) <= 5 || trigger.cards.filterInD("oe").length == 0
				);
			"step 1";
			if (result.bool) {
				var target = result.targets[0],
					num = lib.skill.clansankuang.getNum(target),
					num2 = target.countCards("he");
				event.target = target;
				player.logSkill("clansankuang", target);
				if (num2 == 0) event._result = { bool: false };
				else if (num2 <= num)
					event._result = {
						bool: true,
						cards: target.getCards("he"),
					};
				else {
					var cards = trigger.cards.filterInD("oe");
					target
						.chooseCard("he", num > 0, [num, Infinity])
						.set("ai", get.unuseful)
						.set("prompt", num > 0 ? "是否交给" + get.translation(player) + "任意张牌" + (cards.length ? "并获得" + get.translation(cards) : "") + "？" : "交给" + get.translation(player) + "至少" + get.cnNumber(num) + "张牌");
				}
			} else event.finish();
			"step 2";
			if (result.bool) {
				var cards = result.cards;
				target.give(cards, player);
				if (!cards.length) event.finish();
				else game.delayx();
			} else event.finish();
			"step 3";
			if (trigger.cards.filterInD().length) target.gain(trigger.cards.filterInD(), "gain2", "bySelf");
			else if (trigger.cards.filterInD("e").length) target.gain(trigger.cards.filterInD("e"), get.owner(trigger.cards.filterInD("e")[0]), "give");
		},
		ai: {
			reverseOrder: true,
			skillTagFilter(player) {
				if (player.getHistory("useCard", evt => get.type(evt.card) == "equip").length > 0) return false;
			},
			effect: {
				target_use(card, player, target) {
					if (player == target && get.type(card) == "equip" && !player.getHistory("useCard", evt => get.type(evt.card) == "equip").length == 0) return [1, 3];
				},
			},
			threaten: 1.6,
		},
	},
	clanbeishi: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			var history = player.getAllHistory("useSkill", evt => evt.skill == "clansankuang");
			if (!history.length) return false;
			var target = history[0].targets[0];
			if (target.countCards("h")) return false;
			var evt = event.getl(target);
			return evt && evt.hs && evt.hs.length;
		},
		content() {
			player.recover();
		},
		ai: {
			combo: "clansankuang",
		},
	},
	//族荀淑
	clanshenjun: {
		audio: 2,
		trigger: {
			global: "useCard",
		},
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
				if (!evt || evt.name != name) continue;
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
				} else return "无展示牌";
			},
		},
		subSkill: {
			viewAs: {
				trigger: {
					global: ["phaseZhunbeiEnd", "phaseJudgeEnd", "phaseDrawEnd", "phaseUseEnd", "phaseDiscardEnd", "phaseJieshuEnd"],
				},
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
							if (names.includes(namex)) continue;
							list.push([get.type(card), "", name, nature]);
						} else {
							if (names.includes(namex)) continue;
							list.push([get.type(card), "", name]);
						}
						names.push(namex);
					}
					list.sort((a, b) => {
						var del1 = lib.inpile.indexOf(a[2]) - lib.inpile.indexOf(b[2]);
						if (del1 != 0) return del1;
						var a1 = 0,
							b1 = 0;
						if (a.length > 3) a1 = lib.nature.get(a) || 0;
						if (b.length > 3) b1 = lib.nature.get(b) || 0;
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
							replace: { window() { } },
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
				precontent() {
					delete event.result.skill;
				},
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
			if (game.getGlobalHistory("changeHp", evt => evt.player == player).length != 1) return false;
			var cards = player.getCards("h"),
				map = {};
			if (!cards.length) return false;
			for (var card of cards) {
				var type = get.type2(card);
				if (typeof map[type] != "number") map[type] = 0;
				map[type]++;
			}
			var list = [];
			for (var i in map) {
				if (map[i] > 0) list.push([i, map[i]]);
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
						if (eff > eff2) return "选项一";
						else return "选项二";
					})()
				);
			"step 2";
			var players = [target, player];
			if (result.control == "选项二") players.reverse();
			var card = { name: "sha", nature: "ice", isCard: true };
			if (players[0].canUse(card, players[1], false)) players[0].useCard(card, players[1], false, "noai");
		},
		ai: {
			order: 2,
			expose: 0.2,
			result: {
				target(player, target) {
					var eff = get.recoverEffect(target, player, player);
					if (eff > 0) return 1;
					else if (
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
					)
						return -1;
					return 0;
				},
			},
		},
	},
	clanshangshen: {
		audio: 2,
		trigger: { global: "damageEnd" },
		filter(event, player) {
			if (!event.hasNature() || !event.player.isIn()) return false;
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
			if (get.attitude(player, event.player) <= 2) return false;
			if (event.player.countCards("h") >= 4) return false;
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
			if (player.getStorage("clanfenchai").length > 0) return;
			var history = player.getHistory("useSkill", evt => {
				if (evt.type != "player") return false;
				var skill = get.sourceSkillFor(evt),
					targets = evt.targets;
				var info = get.info(skill);
				if (!info || info.charlotte) return false;
				if (targets && targets.length) {
					if (targets.filter(i => player.differentSexFrom(i)).length > 0) return true;
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
			player: ["logSkill", "useSkillAfter"],
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
			if (event.type != "player") return false;
			var targets = event.targets;
			if (!targets || !targets.length) return false;
			var info = get.info(get.sourceSkillFor(event));
			if (!info || info.charlotte) return false;
			if (player.getStorage("clanfenchai").length != 0) return false;
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
				content() { },
			},
		},
		mod: {
			suit(card, suit) {
				var player = get.owner(card) || _status.event.player;
				if (!player || !player.judging || player.judging[0] != card) return;
				var storage = player.getStorage("clanfenchai");
				if (!storage.length) return;
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
				if (link == "damage") return !player.isDisabledJudge();
				var num = player.countCards("h", link);
				return num > 0 && num == player.getDiscardableCards(player, "h").filter(i => get.name(i) == link).length;
			},
			check(button) {
				var player = _status.event.player;
				switch (button.link) {
					case "damage":
						if (get.damageEffect(player, player, player, "fire") >= 0) return 10;
						if (player.hp >= Math.max(2, 3 - player.getFriends().length) && game.countPlayer(current => get.attitude(player, current) < 0 && current.countCards("h", card => ["sha", "shan"].includes(get.name(card))))) return 0.8 + Math.random();
						return 0;
					case "shan":
						if (player.countCards("h", "shan") == 1) return 8 + Math.random();
						return 1 + Math.random();
					case "sha":
						if (player.countCards("h", "sha") == 1) return 8 + Math.random();
						return 0.9 + Math.random();
				}
			},
			backup(links) {
				var next = get.copy(lib.skill["clanlieshi_backupx"]);
				next.choice = links[0];
				return next;
			},
			prompt(links) {
				if (links[0] == "damage") return "废除判定区并受到1点火焰伤害";
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
				if (!player) return;
				var eff = get.damageEffect(player, player, player, "fire"),
					disabled = !player.isDisabledJudge();
				if ((player.countCards("h", "sha") == 1 || player.countCards("h", "shan") == 1) && eff < 0 && !disabled) return 8;
				else if (eff >= 0 && !disabled) return 5.8;
				if (!disabled && !player.countCards("h", card => ["sha", "shan"].includes(get.name(card)))) {
					if ((!player.hasSkill("clanhuanyin") || !player.canSave(player)) && player.hp <= 1) return 0;
					if (player.canSave(player) && player.hp == 1 && player.countCards("h") <= 1) return 2.6;
					if (player.hp < Math.max(2, 3 - player.getFriends().length) || !game.countPlayer(current => get.attitude(player, current) < 0 && current.countCards("h", card => ["sha", "shan"].includes(get.name(card))))) return 0;
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
						if (!player.isDisabledJudge()) player.disableJudge();
					} else {
						var cards = player.getCards("h", choice);
						if (cards.length) player.discard(cards);
					}
					"step 1";
					if (!player.isIn() || !game.hasPlayer(current => current != player)) event.finish();
					else
						player.chooseTarget("烈誓：令一名其他角色选择另一项", lib.filter.notMe, true).set("ai", target => {
							var player = _status.event.player,
								chosen = _status.event.getParent().choice,
								att = get.attitude(player, target);
							if (chosen == "damage") {
								if (att > 0) return 0;
								return -att / 2 + target.countCards("h", card => ["sha", "shan"].includes(get.name(card)));
							}
							return get.damageEffect(target, player, player, "fire");
						});
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
								if (target.isDisabledJudge()) ok = false;
							} else if (ind > 0) {
								var name = ind == 1 ? "shan" : "sha";
								if (!target.countCards("h", name)) ok = false;
							}
							if (!ok) link = '<span style="opacity:0.5">' + link + "</span>";
							else list.push("选项" + get.cnNumber(ind + 1, true));
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
								if (controls.length == 1) return controls[0];
								if (controls.includes("选项一") && get.damageEffect(player, user, player, "fire") >= 0) return "选项一";
								if (controls.includes("选项一") && player.hp <= 2 && player.countCards("h", card => ["sha", "shan"].includes(get.name(card))) <= 3) controls.remove("选项一");
								if (controls.length == 1) return controls[0];
								if (player.getCards("h", "sha").reduce((p, c) => p + get.value(c, player), 0) > player.getCards("h", "sha").reduce((p, c) => p + get.value(c, player), 0)) {
									if (controls.includes("选项三")) return "选项三";
								} else if (controls.includes("选项二")) return "选项二";
								return controls.randomGet();
							});
					} else event.finish();
					"step 3";
					if (result.control == "选项一") {
						if (!target.isDisabledJudge()) target.disableJudge();
						target.damage("fire");
					} else {
						var cards = target.getCards("h", result.control == "选项二" ? "shan" : "sha");
						if (cards.length) target.discard(cards);
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
			if (!lib.suit.includes(get.suit(event.card))) return false;
			const suit = get.suit(event.card);
			if (player.getRoundHistory("useCard", evt => get.suit(evt.card) == suit).indexOf(event) != 0) return false;
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
			if (event.link && event.recast) player.draw();
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
						player.when({ global: "roundStart" }).then(() => {
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
					player.when({ global: "roundStart" }).then(() => {
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
		audioname: ["clan_xunshu", "clan_xunchen", "clan_xuncai", "clan_xuncan", "clan_xunyou"],
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
		content() {
			"step 0";
			let skills = player.getSkills(null, false, false).filter(skill => {
				let info = get.info(skill);
				if (!info || info.charlotte || !get.is.locked(skill) || get.skillInfoTranslation(skill, player).length == 0) return false;
				return true;
			});
			let list = [];
			for (let skill of skills) {
				list.push([skill, '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"]);
			}
			player
				.chooseButton(["蹈节：失去一个锁定技，或点“取消”失去1点体力", [list, "textbutton"]])
				.set("displayIndex", false)
				.set("ai", (button) => {
					const player = get.player();
					let info = get.info(button.link);
					if (info?.ai?.neg || info?.ai?.halfneg) return 3;
					if (get.effect(player, { name: "losehp" }, player, player) >= 0 || player.hp > 3) return 0;
					if (Math.random() < 0.75 && button.link == "clandaojie") return 2;
					return 1;
				});
			"step 1";
			if (result.bool) {
				player.removeSkills(result.links[0]);
			} else {
				player.loseHp();
			}
			"step 2";
			var targets = game.filterPlayer(current => current == player || current.hasClan("颍川荀氏"));
			if (targets.length == 1) event._result = { bool: true, targets: targets };
			else
				player
					.chooseTarget("蹈节：将" + get.translation(trigger.cards.filterInD()) + "交给一名颍川荀氏角色", true, (card, player, target) => {
						return target == player || target.hasClan("颍川荀氏");
					})
					.set("ai", target => get.attitude(_status.event.player, target));
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.gain(trigger.cards.filterInD(), player, "gain2");
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
						if (num1 < num2) player.draw(num2 - num1);
					} else if (trigger.addCount !== false) {
						trigger.addCount = false;
						player.getStat().card.sha--;
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
			if (num1 > num2) return num1 - num2;
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
			)
				return 0;
			return lib.skill.clanyirong.checkx(card);
		},
		checkx(card) {
			var num = 1;
			if (_status.event.player.getUseValue(card, null, true) <= 0) num = 1.5;
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
				if (num1 < num2) player.draw(num2 - num1);
			}
			"step 1";
			lib.skill.chenliuwushi.change(player, -1);
		},
		ai: {
			order(item, player) {
				var num = player.getHandcardLimit(),
					numx = (_status.event.getParent().phaseIndex || 0) + 1;
				if (num == 5 && numx == 4 && player.getStat("skill").clanyirong) return 0;
				if (player.countCards("h") == num + 1 && num != 2 && (num <= 4 || (num > 4 && numx > 4))) return 10;
				return 0.5;
			},
			result: { player: 1 },
			threaten: 5,
		},
	},
	clanguixiang: {
		audio: 2,
		trigger: {
			player: "phaseChange",
		},
		forced: true,
		filter(event, player) {
			if (event.phaseList[event.num].startsWith("phaseUse")) return false;
			var num1 = player.getHandcardLimit() - 1,
				num2 = event.num - player.getHistory("skipped").length;
			return num1 == num2;
		},
		content() {
			trigger.phaseList[trigger.num] = "phaseUse|clanguixiang";
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
			if (typeof info.chenliuwushi != "number") info.chenliuwushi = 0;
			info.chenliuwushi += num;
			if (info.chenliuwushi == 0) player.unmarkSkill("chenliuwushi");
			else player.markSkill("chenliuwushi");
			if (num >= 0) game.log(player, "的手牌上限", "#y+" + num);
			else game.log(player, "的手牌上限", "#g" + num);
		},
		mod: {
			maxHandcard(player, num) {
				var add = player.storage.chenliuwushi;
				if (typeof add == "number") return num + add;
			},
		},
		markimage: "image/card/handcard.png",
		intro: {
			content(num, player) {
				var str = "<li>手牌上限";
				if (num >= 0) str += "+";
				str += num;
				str += "<br><li>当前手牌上限：";
				str += player.getHandcardLimit();
				return str;
			},
		},
	},
};

export default skills;
