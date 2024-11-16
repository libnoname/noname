import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//四象封印·少阳
	//张苞
	stdjuezhu: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player, name) {
			if (name == "damageSource") return true;
			return event.source?.isIn() && player.canUse({ name: "juedou", isCard: true }, event.source);
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername == "damageSource") player.addTempSkill("stdjuezhu_paoxiao");
			else {
				let card = { name: "juedou", isCard: true };
				if (player.canUse(card, trigger.source)) await player.useCard(card, trigger.source);
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
			if (!ui.selected.cards.length) return true;
			return ui.selected.cards.every(cardx => get.color(cardx, player) != get.color(card, player));
		},
		complexCard: true,
		position: "hes",
		selectCard: 2,
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			if (player.countCards("hes") < 2) return false;
			let color = get.color(player.getCards("hes")[0], player);
			return _status.connectMode || player.getCards("hes").some(card => get.color(card, player) != color);
		},
		prompt: "将两张颜色不同的牌当杀使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") return 1 / Math.max(0.1, val);
			return 5 - val;
		},
		ai: {
			skillTagFilter(player) {
				if (player.countCards("hes") < 2) return false;
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
			if (!hs.length) return false;
			for (let i = 0; i < hs.length; i++) {
				let mod2 = game.checkMod(hs[i], player, "unchanged", "cardEnabled2", player);
				if (mod2 === false) return false;
			}
			return event.filterCard(get.autoViewAs({ name: "juedou" }, hs));
		},
		viewAs: { name: "juedou" },
		ai: {
			order(item, player) {
				if (player.countCards("h") > 1) return 0.8;
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
					if (!td) return 0;
					let hs = player.getCards("h"),
						val = hs.reduce((acc, i) => acc - get.value(i, player), 0) / 6 + 1;
					if (td > 0) return val;
					if (
						player.hasSkillTag("directHit_ai", true, {
							target: target,
							card: get.autoViewAs({ name: "juedou" }, hs),
						})
					)
						return val;
					let pd = get.damageEffect(player, target, player),
						att = get.attitude(player, target);
					if (att > 0 && get.damageEffect(target, player, player) > pd) return val;
					let ts = target.mayHaveSha(player, "respond", null, "count");
					if (ts < 1 && ts * 8 < Math.pow(player.hp, 2)) return val;
					let damage = pd / get.attitude(player, player),
						ps = player.mayHaveSha(player, "respond", hs, "count");
					if (att > 0) {
						if (ts < 1) return val;
						return val + damage + 1;
					}
					if (pd >= 0) return val + damage + 1;
					if (ts - ps + Math.exp(0.8 - player.hp) < 1) return val - ts;
					return val + damage + 1 - ts;
				},
				target(player, target) {
					let td = get.damageEffect(target, player, target) / get.attitude(target, target);
					if (!td) return 0;
					let hs = player.getCards("h");
					if (
						td > 0 ||
						player.hasSkillTag("directHit_ai", true, {
							target: target,
							card: get.autoViewAs({ name: "juedou" }, hs),
						})
					)
						return td + 1;
					let pd = get.damageEffect(player, target, player),
						att = get.attitude(player, target);
					if (att > 0) return td + 1;
					let ts = target.mayHaveSha(player, "respond", null, "count"),
						ps = player.mayHaveSha(player, "respond", hs, "count");
					if (ts < 1) return td + 1;
					if (pd >= 0) return 0;
					if (ts - ps < 1) return td + 1 - ts;
					return -ts;
				},
			},
			nokeep: true,
			skillTagFilter: function (player, tag, arg) {
				if (tag === "nokeep") return (!arg || (arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && !player.countSkill("stdzhanjue") && player.hasCard(card => {
					return get.name(card) !== "tao";
				}, "h");
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
			if (!player.hasZhuSkill("stdqinwang") || event.stdqinwang) return false;
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
				if (!player.hasZhuSkill("stdqinwang") || !game.hasPlayer(current => current != player && current.group == "shu")) return false;
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
						if (event.current == undefined) event.current = player.next;
						if (event.current == player) {
							trigger.cancel();
							trigger.getParent().goto(0);
							return;
						} else if (event.current.group == "shu") {
							const discardEvent = event.current.chooseToDiscard("是否弃置一张牌，视为" + get.translation(player) + "打出一张杀？");
							discardEvent.set("filterCard", card => get.type(card) == "basic");
							discardEvent.set("ai", (card) => {
								const event = _status.event;
								if (get.attitude(event.player, event.source) >= 2) return 6 -get.value(card);
								return 0;
							});
							discardEvent.set("source", player);
							discardEvent.set("skillwarn", "弃置一张牌，视为" + get.translation(player) + "打出一张杀");
							const { bool } = await discardEvent.forResult();
							if (bool) {
								if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
									event.current.ai.shown += 0.3;
									if (event.current.ai.shown > 0.95) event.current.ai.shown = 0.95;
								}
								return;
							} else event.current = event.current.next;
						} else event.current = event.current.next;
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
				replace: { window: function () {} },
			});
			next.backup("stdzhengnan_backup");
			await next;
			if (
				game.getGlobalHistory("everything", evt => {
					if (evt.name != "die" || evt?.source != player) return false;
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
		trigger: {
			player: "phaseUseBegin",
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("stdbaobian"), (card, player, target) => {
					return target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					if (player.hp < 2) return 0;
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.loseHp();
			const target = event.targets[0],
				card = { name: "sha", isCard: true };
			const { cards } = await target.chooseToDiscard("h", true).forResult();
			if (get.type(cards[0]) == "basic" && player.canUse(card, target, false)) await player.useCard(card, target, false);
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
					if (!get.event("cardx")?.includes(card)) return false;
					return lib.filter.filterCard.apply(this, arguments);
				}, "明鉴：是否使用" + get.translation(cards) + "？")
				.set("cardx", cards);
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (!ui.selected.cards.length) return 0;
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
				.choosePlayerCard("e", trigger.player, get.prompt2("stdpolu", trigger.player))
				.set("ai", button => {
					const target = get.event().getTrigger().player,
						player = get.player();
					if (get.attitude(player, target) <= 0) return get.value(button.link) + 2;
					if (player == target) return 5 - get.value(button.link);
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
			if (player != targets[0]) next.notBySelf = true;
			next.discarder = player;
			await next;
			if (player == targets[0]) await player.draw();
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
					if (get.event("att") <= 0) return 0;
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
			const target = event.target;
			const { bool, cards } = await target.chooseCard("展示两张手牌", "h", 2, true).forResult();
			if (!bool) return;
			await target.showCards(cards);
			if (event.name == "danxin_jiaozhao") {
				const result = await player
					.chooseButton(["是否选择其中一张牌获得？", cards])
					.set("ai", button => {
						if (button.link.name == "du") return 0;
						return get.value(button.link) + 1;
					})
					.forResult();
				if (result.bool) {
					await target.give(result.links, player);
				}
			}
			else {
				const cardx = player.getCards("h").sort((a, b) => player.getUseValue(a) - player.getUseValue(b))[0];
				const result = await player
					.chooseButton(2, ["你的手牌", player.getCards("h"), `${get.translation(target)}展示的手牌`, cards])
					.set("filterButton", button => {
						const { player, cards } = get.event();
						if (!ui.selected.buttons.length) return true;
						let card = ui.selected.buttons[0].link;
						if (cards.includes(card)) return !cards.includes(button.link);
						return cards.includes(button.link);
					})
					.set("cards", cards)
					.set("cardx", cardx)
					.set("ai", button => {
						const { player, cards, cardx } = get.event();
						if (ui.selected.buttons.length) {
							return button.link == cardx;
						}
						if (!cards.includes(button.link)) return 0;
						if (player.getUseValue(button.link) > player.getUseValue(cardx)) return 0;
						return player.getUseValue(button.link) + 1;
					})
					.forResult();
				if (result.bool) {
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
		trigger: {
			player: "damageEnd",
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("stddanxin"))
				.set("filterTarget", (card, player, target) => {
					return target != player && target.countCards("h") > 1;
				})
				.set("ai", target => {
					return get.effect(target, { name: "shunshou_copy2"}, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill("stdjiaozhao", target);
			const next = game.createEvent("danxin_jiaozhao");
			next.player = player;
			next.target = target;
			next.setContent(lib.skill.stdjiaozhao.content);
			await next;
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
			return game.filterPlayer(current => {
				let evt = event.getl(current);
				return evt?.es?.length > 0 && !current.countCards("e");
			}).sortBySeat();
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
			if (player.hasHistory("sourceDamage", evt => evt?.card?.name == "sha")) return false;
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
					if (player.inRange(target)) return 0;
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
						if (from.getStorage("stdfenxun_effect").includes(to)) return true;
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
			if (!event.targets?.length) return false;
			const card = event.card;
			if (card.name != "sha" && get.type2(card) != "trick") return false;
			return game.hasPlayer(current => {
				return current != player && !event.targets.includes(current);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("stdzenhui"), (card, player, target) => {
					if (player == target) return false;
					const evt = _status.event.getTrigger();
					return !evt.targets.includes(target);
				})
				.set("ai", target => {
					const trigger = _status.event.getTrigger(),
						player = _status.event.player;
					let eff = 0;
					for(let current of trigger.targets) {
						eff += get.effect(current, trigger.card, player, player);
						eff += get.effect(current, trigger.card, target, player);
					}
					return eff;
				})
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
			if (!event.source || !event.source.isIn() || event.source == player) return false;
			return player.inRange(event.player);
		},
		check(event, player) {
			return get.damageEffect(event.player, event.source, player, event.nature) > 0;
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
					aiOrder: function (player, card, num) {
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
					if (!player.countCards("he")) return false;
					if (_status.currentPhase != player) return false;
					var color2 = get.color(event.card);
					var evt = player.getLastUsed(1);
					if (!evt) return false;
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
			if (player.countCards("h")) list.push("手牌");
			if (player.countCards("e")) list.push("装备区");
			let choice = list[0];
			if (list.length > 1) {
				const { control } = await player
					.chooseControl(list)
					.set("prompt", "躁厉：选择弃置的区域")
					.set("ai", () => ["手牌", "装备区"].randomGet())
					.forResult();
				if (control) choice = control;
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
			.chooseTarget(get.prompt2("stdyirang"), (card, player, target) => {
				if (target == player) return false;
				return !game.hasPlayer(current => {
					return current != player && current.countCards("h") <target.countCards("h");
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
				.chooseTarget(get.prompt2("stdshuangdao"), function (card, player, target) {
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
						if (!player.canUse("sha", current, false)) return false;
						return get.distance(target, current) <= 1;
					})
				) {
					const result2 = await player
						.chooseTarget("是否对至多两名与其距离为1的角色各使用一张杀？", [1, 2], function (card, player, target) {
							if (!player.canUse("sha", target, false)) return false;
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
				}
				else return;
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
					if (evt.cards2?.length > 0) num += evt.cards2.length;
				});
				return num > 1;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt("stdjuece"), "对一名本回合失去过至少两张牌的角色造成1点伤害", function (card, player, target) {
					return _status.event.targets.includes(target);
				})
				.set(
					"targets",
					game.filterPlayer(current => {
						let num = 0;
						current.getHistory("lose", evt => {
							if (evt.cards2?.length > 0) num += evt.cards2.length;
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
			if (!event.card || !["sha", "juedou"].includes(event.card.name)) return false;
			if (!event.player.isIn() || !event.source || !event.source.isIn()) return false;
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
			if (trigger.player.countCards("he")) await player.discardPlayerCard(trigger.player, "he", true);
			if (trigger.source.countCards("he")) await player.discardPlayerCard(trigger.source, "he", true);
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
				if (!cards.length) continue;
				const result = await target.chooseButton(["获得其中一张牌", cards], true).forResult();
				if (result.bool) {
					await target.gain(result.links, 'gain2');
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
			cardUsable: function (card, player) {
				if (player.countCards("e") % 2 != 0) return Infinity;
			},
			targetInRange: function (card, player) {
				if (player.countCards("e") % 2 == 0) return true;
			},
		},
	},
	stdshangjian: {
		trigger: {
			player: "phaseJieshuBegin",
		},
		audio: "xinfu_shangjian",
		filter: function (event, player) {
			let num = 0, cards = [];
			player.getHistory("lose", evt => {
				if (evt.cards2) num += evt.cards2.length;
				if (evt.cards2.some(i => get.position(i) == "d")) cards.addArray(evt.cards2.filter(i => get.position(i) == "d"))
			});
			return cards.length && num > 0 && num <= player.hp;
		},
		async cost(event, trigger, player) {
			let cards = [];
			player.getHistory("lose", evt => {
				if (evt.cards2 && evt.cards2.some(i => get.position(i) == "d")) cards.addArray(evt.cards2.filter(i => get.position(i) == "d"));
			});
			const result = await player.chooseButton(['尚俭：选择获得其中一张牌', cards]).set('ai', button => {
				return get.value(button.link, get.event('player'));
			}).forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.links,
			}
		},
		async content(event, trigger, player) {
			await player.gain(event.cost_data, 'gain2');
		},
	},
	//王司徒
	stdgushe: {
		audio: "gushe",
		enable: "phaseUse",
		usable: 1,
		filterTarget: function (card, player, target) {
			return player.canCompare(target);
		},
		filter: function (event, player) {
			return player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			let num = 1, target = event.target;
			while (num > 0 && player.canCompare(target)) {
				num--;
				let winner = [], failure = [];
				let { result } = await player.chooseToCompare(target)
				if (result.bool) {
					failure.push(target);
					target.chat(lib.skill.gushe.chat.randomGet());
					await player.draw();
				}
				else if (result.tie) failure = [player, target];
				else {
					failure.push(player);
					target.chat(lib.skill.gushe.chat.randomGet());
					await target.draw();
				}
				if (player.canCompare(target)) {
					for (let loser of failure) {
						let choice = loser.countCards("h", card => get.value(card) <= 6 && card.number > 10) > 0;
						const { result: { bool } } = await loser.chooseBool('是否与其再次拼点？').set('choice', choice)
						if (bool) num++;
					}
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target: function (player, target) {
					let hs = player.getCards("h");
					if (hs.some(card => get.value(card) <= 6 && card.number > 10) || player.getHp() < 2 && player.getHp() + player.countCards('h', { name: ["tao", "jiu"] }) > 2 || player.getHp() > 1 && player.getHp() + player.countCards('h', { name: "tao" }) > 2) return -1;
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
		filter: function (event, player) {
			if (event.player == player && event.iwhile) return false;
			return true;
		},
		check(event, player) {
			return player.getHp() < 2 && player.getHp() + player.countCards('h', { name: ["tao", "jiu"] }) > 2 || player.getHp() > 1 && player.getHp() + player.countCards('h', { name: "tao" }) > 2
		},
		async content(event, trigger, player) {
			await player.loseHp();
			if (player == trigger.player) trigger.num1 = 13
			else trigger.num2 = 13;
			game.log(player, "的拼点牌点数为13");
		},
	},
	//钟会
	stdxingfa: {
		audio: "gzpaiyi",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter: function (event, player) {
			return player.getHp() <= player.countCards("h") && game.hasPlayer(function (current) {
				return current != player;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseTarget(get.prompt("stdxingfa"), "对一名其他角色造成1点伤害", function (card, player, target) {
				return target != player;
			})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.damageEffect(target, player, player);
				}).forResult();
		},
		async content(event, trigger, player) {
			await event.targets[0].damage('nocard')
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
		filterTarget: function (card, player, target) {
			return player != target && target.countCards("he");
		},
		async content(event, trigger, player) {
			const target = event.target;
			await target.chooseToGive(1, "he", player, true);
			let targets = game.filterPlayer(current => {
				if (!target.canUse({ name: "sha", isCard: true }, current, false)) return false;
				if (current == player) return true;
				return player.inRange(current);
			});
			if (!targets.length) return;
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
			if (result.bool) await target.useCard({ name: "sha", isCard: true }, result.targets);
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
			if (!event.source || event.source == player || !player.countCards("he")) return false;
			if (player.hasHistory("damage", evt => evt.source && evt.source == event.source)) return false;
			return event.source.group == "qun" && !player.getStorage("stdjuyi").includes(event.source);
		},
		async cost(event, trigger, player) {
			const result = await trigger.source.choosePlayerCard(player, "he", get.prompt("stdjuyi", player), "据益：是否获得" + get.translation(player) + "一张牌并防止此次伤害？")
				.set("ai", button => {
					if (get.event("eff") > 0) return 0;
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
			if (event.type != "card" || event.player == player) return false;
			if (name != "shaMiss" && event._neutralize_event.player != player) return false;
			return event.cards && event.cards.someInD();
		},
		async content(event, trigger, player) {
			await player.gain(trigger.cards.filterInD(), "gain2");
		},
	},
	stdxunjie: {
		audio: "jiexun",
		trigger: {
			player: "phaseJieshuBegin",
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("stdxunjie"), function (card, player, target) {
					return target.countCards("h");
				})
				.set("ai", function (target) {
					const player = _status.event.player;
					let eff = get.effect(target, { name: "guohe_copy2" }, player, player);
					if (target == player) return player.countCards("h", { suit: "diamod" }) ? 2 : -2;
					return eff * (target.countCards("h") > 4 ? -1 : 1);
				}).forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target.chooseToDiscard("h", 1, true).set("ai", card => {
				if (get.suit(card) == "diamond") return 11 - get.value(card);
				return 5 - get.value(card);
			}).forResult();
			if (!result.bool) return;
			if (get.suit(result.cards[0]) == "diamond") await target.draw(2);
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
			if (!event.cards || event.cards.length != 1 || get.type2(event.cards[0]) != "trick") return false;
			return event.card.name == "wuxie";
		},
		async content() { },
		mod: {
			cardname(card, player) {
				let info = lib.card[card.name];
				if (info && ["trick", "delay"].includes(info.type)) return "wuxie";
			},
		},
	},
	stdjujian: {
		audio: "jujian",
		trigger: {
			player: "useCardAfter"
		},
		usable: 1,
		filter(event, player) {
			return event.cards && event.cards.length && event.card.name == "wuxie";
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseTarget(get.prompt2("stdjujian"), lib.filter.notMe).set("ai", target => {
				const player = get.player();
				return target.getUseValue(_status.event.getTrigger().cards[0]) * get.attitude(player, target);
			}).forResult();
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
				if (hs > 0) await player.chooseToDiscard(hs, posi, true);
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
				if (card.name == "wuxie") return false;
			},
			aiValue: (player, card, val) => {
				if (card.name == "wuxie") return 0;
				var num = get.number(card);
				if (typeof get.strNumber(num, false) === "string") return 0;
			},
			aiUseful: (player, card, val) => {
				if (card.name == "wuxie") return 0;
				var num = get.number(card);
				if (typeof get.strNumber(num, false) === "string") return 0;
			},
			aiOrder: (player, card, order) => {
				var num = get.number(card);
				if (typeof get.strNumber(num, false) === "string") return 0;
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
		filter: function (event, player) {
			return !event.numFixed && player.getHp() < player.maxHp;
		},
		forced: true,
		content: function () {
			trigger.num += player.getDamagedHp();
		},
		mod: {
			maxHandcard: (player, num) => num + 2,
			aiOrder(player, card, num) {
				if (num <= 0 || !player.isPhaseUsing() || !get.tag(card, "recover")) return num;
				if (player.needsToDiscard() > 1) return num;
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
		precontent: function () {
			delete event.result.skill;
			player.logSkill("oldlonghun");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter: function (player, tag) {
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
				if (!player.countCards("hes", { suit: name })) return false;
			},
			order: function (item, player) {
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
							if (temp > max) max = temp;
						}
					}
					max /= 1.1;
					return max;
				}
				return 2;
			},
		},
		hiddenCard: function (player, name) {
			if (name == "wuxie" && _status.connectMode && player.countCards("hes") > 0) return true;
			if (name == "wuxie") return player.countCards("hes", { suit: "spade" }) >= Math.max(1, get.player().getHp());
			if (name == "tao") return player.countCards("hes", { suit: "heart" }) >= Math.max(1, get.player().getHp());
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
					if (!player.countCards("he", card => get.type(card) == "basic")) return false;
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
					await player.give(card, target);
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
			if (!player.countCards("he", card => get.type(card) == "basic")) return false;
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
			if (!event.stdruwu || !event.stdruwu.length) return false;
			if (event.filterCard(get.autoViewAs({ name: "juedou" }, "unsure"), player, event)) return true;
			if (event.filterCard(get.autoViewAs({ name: "wuzhong" }, "unsure"), player, event)) return true;
			return false;
		},
		onChooseToUse(event) {
			if (game.online || event.stdruwu) return;
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
				if (event.filterCard(get.autoViewAs({ name: "juedou" }, "unsure"), player, event)) list.push(["锦囊", "", "juedou"]);
				if (event.filterCard(get.autoViewAs({ name: "wuzhong" }, "unsure"), player, event)) list.push(["锦囊", "", "wuzhong"]);
				return ui.create.dialog("儒武", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") return 1;
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
			if (!list.length) return false;
			return ["juedou", "wuzhong"].includes(name);
		},
		ai: {
			order: 1,
			result: {
				player: function (player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
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
		changeSeat: true,
		seatRelated: true,
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.awakenSkill(event.name);
			game.broadcastAll(function (target1, target2) {
				game.swapSeat(target1, target2);
			}, player, target);
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
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			return !event.player.countCards("e");
		},
		async cost(event, trigger, player) {
			event.result = await trigger.player.chooseBool(get.prompt("stddingyi"), "摸一张牌").forResult();
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
			if (!event.source) return false;
			return player.canMoveCard(null, null, game.filterPlayer(current => current != event.source), event.source);
		},
		direct: true,
		async content(event, trigger, player) {
			const next = player.moveCard(game.filterPlayer(current => current != trigger.source), trigger.source);
			next.prompt = get.prompt("stdzuici", trigger.source);
			next.prompt2 = "将场上一张牌移动到其区域内";
			next.logSkill = event.name;
			await next;
		},
	},
	//司马师
	stdjinglve: {
		audio: "jinglve",
		trigger: {
			global: "phaseDiscardBegin",
		},
		filter(event, player) {
			return player.countCards("h") > 1 && event.player != player;
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseCard(get.prompt2("stdjinglve"), 2).set("ai", card => {
				if (_status.event.att <= 0) return 0;
				return 5 - get.value(card);
			}).set("att", get.attitude(player, trigger.player)).forResult();
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			const cards = event.cards, target = event.targets[0];
			await player.showCards(cards, get.translation(player) + "发动了【景略】");
			const next = player.give(cards, target);
			next.gaintag.add("stdjinglve");
			await next;
			trigger.player.addTempSkill("stdjinglve_discard");
			player.when({ global: "phaseDiscardEnd" }).filter(evt => evt == trigger).then(() => {
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
						if (evt.type != "discard" || evt.position != ui.discardPile || evt.getParent("phaseDiscard") != trigger) return;
						const moves = evt.cards.filterInD("d");
						cards.addArray(moves);
					}
				});
				player.chooseButton(["景略：是否获得本阶段弃置的一张牌？", cards]);
			}).then(() => {
				if (result.bool) player.gain(result.links, "gain2");
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
					maxHandcard: function (player, num) {
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
				player: function (player) {
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
			if (colors.length < 2) return;
			const result = await player.chooseControl(colors).set("ai", () => {
				return _status.event.color;
			}).set("color", function () {
				return colors.sort((a, b) => {
					return player.countCards("h", { color: a }) - player.countCards("h", { color: b });
				})[0];
			}()).forResult();
			const discards = player.getCards("h", { color: result.control });
			if (discards.length) {
				await player.discard(discards);
				if (game.hasPlayer(current => current != player && current.countCards("he"))) {
					const result2 = await player.chooseTarget(`获得至多${discards.length}名其他角色各一张牌`, [1, discards.length], true, function (card, player, target) {
						return target != player && target.countCards("he") > 0;
					}).set("ai", function (target) {
						const player = get.player();
						return get.effect(target, { name: "shunshou_copy2" }, player, player);
					}).forResult();
					await player.gainMultiple(result2.targets.sortBySeat(), "he");
					if (result2.targets.length > 1) await player.loseHp();
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
			if (!event.getg || !event.getl) return false;
			const cards = event.getg(player);
			return game.filterPlayer(current => {
				if (current == player || current.group != "qun") return false;
				const evt = event.getl(current);
				if (!evt || !evt.es) return false;
				game.log(evt.es);
				return evt.es.some(card => cards.includes(card));
			}).sortBySeat();
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
		check: function (event, player) {
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
			if (!event.source || event.source.group != "qun") return false;
			return player.countCards("he") > 1;
		},
		zhuSkill: true,
		async cost(event, trigger, player) {
			event.result = await player.chooseToDiscard(get.prompt2("stdjujin"), 2, "he")
				.set("ai", card => {
					const player = get.player();
					if (get.recoverEffect(player, player, player) <= 0 || player.hp >= player.maxHp) return 0;
					return 5 - get.value(card);
				})
				.set("chooseonly", true).forResult();
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			await player.discard(cards);
			if (player.isDamaged()) await player.recover();
		},
	},
	//伏皇后
	stdqiuyuan: {
		audio: "xinqiuyuan",
		trigger: {
			target: "useCardToTarget",
		},
		filter(event, player) {
			return (
				event.card.name == "sha" &&
				game.hasPlayer(function (current) {
					return current != player && !event.targets.includes(current) && lib.filter.targetEnabled(event.card, event.player, current);
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("stdqiuyuan"), function (card, player, target) {
					var evt = _status.event.getTrigger();
					return target != player && !evt.targets.includes(target) && lib.filter.targetEnabled(evt.card, evt.player, target);
				})
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, trigger.player, player) + 0.1;
				})
				.set("targets", trigger.targets)
				.set("playerx", trigger.player).forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.chooseCard("交给" + get.translation(player) + "一张牌，或成为此杀的额外目标")
				.set("ai", function (card) {
					return get.attitude(target, _status.event.sourcex) >= 0 ? 1 : -1;
				})
				.set("sourcex", player).forResult();
			if (result.bool) {
				await target.give(result.cards, player);
				game.delay();
			} else {
				trigger.getParent().targets.push(target);
				trigger.getParent().triggeredTargets2.push(target);
				game.log(target, "成为了额外目标");
			}
		},
		ai: {
			expose: 0.2,
			effect: {
				target_use(card, player, target) {
					if (card.name != "sha") return;
					var players = game.filterPlayer();
					if (get.attitude(player, target) <= 0) {
						for (var i = 0; i < players.length; i++) {
							var target2 = players[i];
							if (player != target2 && target != target2 && player.canUse(card, target2, false) && get.effect(target2, { name: "shacopy", nature: card.nature, suit: card.suit }, player, target) > 0 && get.effect(target2, { name: "shacopy", nature: card.nature, suit: card.suit }, player, player) < 0) {
								if (target.hp == target.maxHp) return 0.3;
								return 0.6;
							}
						}
					} else {
						for (var i = 0; i < players.length; i++) {
							var target2 = players[i];
							if (player != target2 && target != target2 && player.canUse(card, target2, false) && get.effect(target2, { name: "shacopy", nature: card.nature, suit: card.suit }, player, player) > 0) {
								if (player.canUse(card, target2)) return;
								if (target.hp == target.maxHp) return [0, 1];
								return [0, 0];
							}
						}
					}
				},
			},
		},
	},
	stdzhuikong: {
		audio: "rezhuikong",
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		check: function (event, player) {
			if (get.attitude(player, event.player) < -2) {
				var cards = player.getCards("h");
				if (cards.length > player.hp) return true;
				for (var i = 0; i < cards.length; i++) {
					var useful = get.useful(cards[i]);
					if (useful < 5) return true;
					if (get.number(cards[i]) > 9 && useful < 7) return true;
				}
			}
			return false;
		},
		filter(event, player) {
			if (!player.canCompare(event.player)) return false;
			return _status.connectMode && player.countCards("h") || player.countCards("h", "sha");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt("stdzhuikong", trigger.player), "使用一张【杀】与其拼点", { name: "sha" })
				.set("ai", card => {
					if (_status.event.effect) return 6 - get.value(card);
					return 0;
				})
				.set("effect", lib.skill.stdzhuikong.check(trigger, player)).forResult();
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const next = player.chooseToCompare(target);
			if (!next.fixedResult) next.fixedResult = {};
			next.fixedResult[player.playerid] = event.cards[0];
			const result = await next.forResult();
			if (result.winner) {
				const card = result[result.winner == player ? "target" : "player"];
				if (!card || !result.winner.hasUseTarget(card)) return;
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
			if (!winner) return;
			const loser = player == winner ? target : player;
			const juedou = get.autoViewAs({ name: "juedou", isCard: true });
			if (winner.canUse(juedou, loser, false)) await winner.useCard(juedou, loser, false);
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
						if (player.hasSkill("guiming") && target != player && target.group == "wu") return true;
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
					if (event.card.name != "sha" && get.type(event.card) != "trick") return false;
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
		unique: true,
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
			player.awakenSkill("stdxiongyi");
			const targets = event.targets.sortBySeat();
			let keep = true;
			while (true) {
				let stop = false;
				for (const target of targets) {
					let next = target
						.chooseToUse(function (card) {
							const event = get.event();
							if (!lib.filter.cardEnabled(card, event.player, event)) return false;
							return get.name(card) == "sha";
						}, "雄异：是否使用一张不可被响应的【杀】？")
						.set("oncard", card => {
							_status.event.directHit.addArray(game.players);
						});
					if (!keep) next.set("prompt2", "若你不使用，则结束此流程");
					const result = await next.forResult();
					if (!result.bool && !keep) {
						stop = true;
						break;
					}
				}
				if (keep) keep = false;
				if (stop) break;
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (player.hasUnknown()) return 0;
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
					return [3, 4, 6].includes(parseInt(get.subtype(card).slice("equip".length)));
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
						return [3, 4, 6].includes(parseInt(get.subtype(card).slice("equip".length)));
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
				event.card.name == "sha" &&
				[player, event.player].some(target => {
					return target.isIn() && target.countCards("he");
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("stdfengpo"), (card, player, target) => {
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
					if (aim === player && player.getDiscardableCards(player, "he", card => get.suit(card) == "diamond")) eff /= 4;
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
				.chooseTarget(get.prompt2("stddaoshu"), (card, player, target) => {
					const event = get.event().getTrigger();
					return target != event.player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.event("player");
					if (get.attitude(player, target) >= 0) return 0;
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
						if (player.getStorage("stddaoshu_effect").includes(get.suit(card))) return false;
					},
					cardSavable(card, player) {
						if (player.getStorage("stddaoshu_effect").includes(get.suit(card))) return false;
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
			combo: "stddaoshu"
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
			if (player.countCards("hes") < 2) return false;
		},
		check(card) {
			if (get.name(card) == "sha") return 4 - get.value(card);
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
			if (event.card.name != "sha") return false;
			return game.hasPlayer(target => {
				return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2("stdhuizhan"),
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
					if (event._stdhuizhan_effect) return false;
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
							if (!target.isIn()) continue;
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
			if (!_status.currentPhase || !_status.currentPhase.isIn()) return false;
			if (name == "damageCancelled") return true;
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
		filter: function (event, player, name) {
			return !player.getStorage("stdjinjian_used").includes(name.slice(11));
			return !player.hasSkill(`stdjinjian_effect${name.slice(11)}`);
		},
		prompt2(event, player, name) {
			return `防止即将${name == "damageBegin2" ? "造成" : "受到"}的伤害`;
		},
		check: function (event, player) {
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
				target: function (card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) return;
					if (player._stdjinjian_tmp) return;
					if (_status.event.getParent("useCard", true) || _status.event.getParent("_wuxie", true)) return;
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
					if (
						target.hp <= 1 ||
						!target.hasFriend() ||
						!_status.currentPhase ||
						!get.tag(card, "damage")
					) return;
					let hp = target.hp - 1;
					if (game.hasPlayer(cur => {
						return cur.hp > hp;
					})) return;
					let ori = game.countPlayer(cur => {
						return cur.hp === hp + 1 && get.attitude(target, cur) <= 0;
					}), now = game.countPlayer(cur => {
						return cur.hp === hp && get.attitude(target, cur) <= 0;
					}), seat = 1, tar = _status.currentPhase.next;
					while (tar !== target) {
						if (get.attitude(target, tar) <= 0) seat++;
						tar = tar.next;
					}
					return [1, 2 * (now - ori) / seat];
				}
			}
		}
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
				.chooseTarget(get.prompt("stdchunlao"), "用" + get.translation(cards) + "交换一名其他角色的手牌", (card, player, target) => {
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
					await player.recover();
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
			if (!player.countCards("hes", { name: "sha" })) return false;
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
					prompt: get.prompt2("stdzhiyinmeng"),
					filterTarget: lib.filter.notMe,
					filterCard: true,
					position: "he",
					selectCard: [1, Infinity],
					complexCard: true,
					complexTarget: true,
					complexSelect: true,
					ai1(card) {
						if (ui.selected.cards.length && card.name != "du") return 0;
						if (card.name == "du") return 114514;
						return 5 - get.value(card);
					},
					ai2(target) {
						if (!ui.selected.cards.length) return 0;
						const player = get.event("player"),
							att = get.attitude(player, target);
						if (ui.selected.cards[0].name == "du") {
							if (!target.hasSkillTag("nodu")) return -att;
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
					get.prompt2("stdhehe"),
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
			if (!result.bool) await player.draw();
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
				.chooseCard(get.prompt("stdshefu"), "将一张手牌置于武将牌上", "h")
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
				if (player.isUnderControl(true) && cards.length) dialog.addAuto(cards);
				else return "共有" + get.cnNumber(cards.length) + "张“伏兵”";
			},
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
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
			return event.player != player && event.player.countCards("h");
		},
		direct: true,
		content() {
			const target = trigger.player;
			player.gainPlayerCard(target, "h", true).set("prompt", get.prompt("stdyibing", target)).logSkill = ["stdyibing", target];
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
			if (card.name == "du") return 114514;
			return 5 - get.value(card);
		},
		async content(event, trigger, player) {
			const target = event.target;
			await player.showCards(event.cards);
			await player.give(event.cards, target, "visible");
			if (target.countCards("h")) await target
				.chooseToGive(
					player,
					(card, player) => {
						return get.type2(card) != get.type2(get.event("cards")[0]);
					}
				)
				.set("cards", event.cards);
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (!ui.selected.cards.length) return 0;
					const cardxx = ui.selected.cards[0];
					if (cardxx.name == "du") return -100;
					if (!player.hasSkill("stdzhanying")) return 1;
					if (target.countMark("stdzhanying_count") == target.countCards("h") + 1) {
						const cards = player.getCards("hs", card => {
							return card != cardxx && get.tag(card, "damage") && player.canUse(card, target) && get.effect(target, card, player, player) > 0;
						});
						if (!cards.length) return 1;
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
			if (_status.currentPhase !== player) return false;
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
						if (!_status.currentPhase || !_status.currentPhase.hasSkill("stdzhanying")) return;
						if (get.color(card) == "red" && player.countMark("stdzhanying_count") < player.countCards("h")) return false;
					},
					cardSavable(card, player) {
						if (!_status.currentPhase || !_status.currentPhase.hasSkill("stdzhanying")) return;
						if (get.color(card) == "red" && player.countMark("stdzhanying_count") < player.countCards("h")) return false;
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
				return tar1.countDiscardableCards(player, "e", i => get.subtype(i) == "equip2") && game.hasPlayer(tar2 => {
					return tar1 !== tar2 && tar2.countDiscardableCards(player, "e");
				});
			});
			let e = 0, fj = false;
			game.countPlayer(target => {
				let es = target.getDiscardableCards(player, "e"), js = target.getDiscardableCards(player, "j", i => get.type(i) == "equip");
				if (es.length) e++;
				e += js.length;
				if (!fj && (es.some(card => get.subtype(card) == "equip2") || js.some(card => get.subtype(card) == "equip2"))) fj = true;
			});
			return fj && e >= 2;
		},
		filterTarget(card, player, target) {
			if (!ui.selected.targets.length || ui.selected.targets[0].countDiscardableCards(player, "e", i => get.subtype(i) == "equip2")) {
				return target.countDiscardableCards(player, "e");
			}
			return target.countDiscardableCards(player, "e", i => get.subtype(i) == "equip2");
			let e = 0;
			let es = target.getDiscardableCards(player, "e"), js = target.getDiscardableCards(player, "j", i => get.type(i) == "equip");
			if (es.length) e++;
			e += js.length;
			if (!e) return false;
			if (!ui.selected.targets.length) return true;
			if (!ui.selected.targets[0].countDiscardableCards(player, "ej", i => get.subtype(i) == "equip2")) {
				return es.some(card => get.subtype(card) == "equip2") || js.some(card => get.subtype(card) == "equip2");
			}
			return true;
		},
		selectTarget: function () {
			return 2;
			if (!ui.selected.targets.length) return [1, 2];
			let e = 0, player = get.event("player"), target = ui.selected.targets[0];
			let es = target.getDiscardableCards(player, "e"), js = target.getDiscardableCards(player, "j", i => get.type(i) == "equip");
			if (es.length) e++;
			e += js.length;
			if (e >= 2 && (es.some(card => get.subtype(card) == "equip2") || js.some(card => get.subtype(card) == "equip2"))) return [1, 2];
			return 2;
		},
		complexTarget: true,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const targets = event.targets.slice();
			if (targets.length == 1) {
				await player.discardPlayerCard("ej", targets[0], true, 2).set("filterButton", button => {
					let position = get.position(button.link), subtype = get.subtype(button.link);
					if (!subtype || !subtype.startsWith("equip")) return false;
					if (ui.selected.buttons.length) {
						let pos = get.position(ui.selected.buttons[0].link), sub = get.subtype(ui.selected.buttons[0].link);
						if (pos == "e" && position == "e") return false;
						if (sub == "equip2") return true;
						return subtype == "equip2";
					}
					if (position == "e") {
						if (!get.event("js").some(i => get.subtype(i) == "equip2")) return subtype == "equip2";
						return true;
					}
					if (!get.event("es").length) return subtype == "equip2";
					return true;
				}).set("es", targets[0].getDiscardableCards(player, "e", i => get.subtype(i) == "equip2")).set("js", targets[0].getDiscardableCards(player, "j", i => get.type(i) == "equip"));
				return;
			}
			let canfj = targets.filter(target => {
				return target.countDiscardableCards(player, "e", i => get.subtype(i) == "equip2");
			});
			for (let i = 0; i < 2; i++) {
				if (i && canfj.includes(targets[i]) && !targets[i].countDiscardableCards(player, "e", i => get.subtype(i) == "equip2")) break;
				const result = await player
					.discardPlayerCard("e", targets[i], true)
					.set("filterButton", button => {
						if (get.event("fj")) return get.subtype(button.link) == "equip2";
						return true;
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
					let att = get.attitude(player, target), es = [];
					target.countDiscardableCards(player, "e", i => {
						es.push(get.value(i, target));
					});
					let min = Math.min(...es), max = Math.max(...es), ext = target.hasSkillTag("noe") ? 10 : 0;
					if (att <= 0) return ext - max;
					return ext - min;
				}
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
					if (target.countCards("e")) return;
					if (target == player && get.type(card) == "equip" && get.equipValue(card) < 5) return 0;
					if (get.type2(card) == "trick") return [1, 0.6];
				},
			},
		},
	},
};

export default skills;
