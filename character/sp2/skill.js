import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//星张让
	starduhai: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.player != player && event.player.isIn() && event.player.getStorage("starduhai_debuff").length < 4;
		},
		logTarget: "player",
		async cost(event, trigger, player) {
			const suits = lib.suit.slice().filter(suit => !trigger.player.getStorage("starduhai_debuff").includes(suit));
			if (!suits.length) {
				return;
			}
			const result = await player
				.chooseControl(suits, "cancel2")
				.set("prompt", get.prompt2(event.skill, trigger.player))
				.set("ai", () => {
					const player = get.player(),
						target = get.event().targetx;
					if (get.attitude(player, target) > 0) {
						return "cancel2";
					}
					return get.event().choices.randomGet();
				})
				.set("targetx", trigger.player)
				.set("choices", suits)
				.forResult();
			if (result?.control != "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.control,
				};
			}
		},
		async content(event, trigger, player) {
			const suit = event.cost_data,
				skill = event.name + "_debuff",
				target = trigger.player;
			target.addSkill(skill);
			target.markAuto(skill, [suit]);
			game.log(target, "获得了一个", `#g【蠹】(${get.translation(suit)})`);
		},
		subSkill: {
			debuff: {
				onremove: true,
				charlotte: true,
				forced: true,
				intro: {
					content: storage => `已获得标记：<span class=thundertext>${storage.reduce((str, suit) => str + get.translation(suit), "")}</span>`,
				},
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					return player.hasCard(card => player.getStorage("starduhai_debuff").includes(get.suit(card, player)), "h");
				},
				async content(event, trigger, player) {
					const skill = event.name,
						suits = player.getStorage(skill).filter(suit => player.hasCard(card => get.suit(card, player) == suit, "h"));
					await player.loseHp(suits.length);
					if (!player?.isIn()) {
						return;
					}
					player.unmarkAuto(skill, suits);
					game.log(player, "移去了", get.cnNumber(suits.length), "个", `#g【蠹】(${suits.reduce((str, suit) => str + get.translation(suit), "")})`);
					if (!player.getStorage(skill).length) {
						player.removeSkill(skill);
					}
				},
			},
		},
	},
	starlingse: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") && game.hasPlayer(target => target != player);
		},
		filterCard: true,
		filterTarget: lib.filter.notMe,
		lose: false,
		discard: false,
		delay: false,
		check(card) {
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			const card = event.cards[0],
				type = get.type2(card, false),
				target = event.targets[0];
			await player.give(card, target);
			const cards = target.getCards("he", cardx => get.type2(cardx) == type),
				sha = get.autoViewAs({ name: "sha", isCard: true });
			let gain = [];
			if (cards.length > 0 && cards.length <= 2) {
				gain = cards.slice();
			} else if (cards.length > 2) {
				gain = cards.randomGets(2);
			}
			await player.gain(gain, target, "giveAuto", "bySelf");
			if (cards.length < 2 && target.canUse(sha, player, false, false)) {
				await target.useCard(sha, player, false);
				if (player.hasHistory("damage", evt => evt.getParent(3) == event)) {
					delete player.getStat("skill")[event.name];
					game.log(player, "重置了", "#g【令色】");
				}
			}
		},
		ai: {
			order: 5,
			result: {
				target: -1,
			},
		},
	},
	//文丑
	starlianzhan: {
		audio: 2,
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			if (event.targets.length !== 1) {
				return false;
			}
			return get.tag(event.card, "damage") >= 0.5;
		},
		filterx(event, player) {
			const info = get.info(event.card);
			if (info.allowMultiple == false) {
				return false;
			}
			if (event.targets && !info.multitarget) {
				return game.hasPlayer(current => {
					return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
				});
			}
			return false;
		},
		async cost(event, trigger, player) {
			const { result } = await player
				.chooseButton([
					get.prompt2(event.skill),
					[
						[
							["extraTarget", `使${get.translation(trigger.card)}增加一个目标`],
							["extraEffect", `令${get.translation(trigger.card)}额外结算一次`],
						],
						"textbutton",
					],
				])
				.set("filterButton", button => {
					const { player, evt: event } = get.event();
					if (button.link == "extraTarget") {
						return lib.skill.starlianzhan.filterx(event, player);
					}
					return true;
				})
				.set("ai", button => {
					const { player, evt: event } = get.event();
					if (button.link == "extraTarget") {
						const targets = game.filterPlayer(current => {
							return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
						});
						return Math.max(...targets.map(target => get.effect(target, event.card, player, player)));
					}
					return event.targets.reduce((sum, target) => sum + get.effect(target, event.card, player, player), 0);
				})
				.set("evt", trigger.getParent());
			event.result = {
				bool: result.bool,
				cost_data: result.links,
			};
		},
		async content(event, trigger, player) {
			const { cost_data } = event;
			player.addTempSkill("starlianzhan_check");
			trigger.getParent().set("starlianzhan_check", true);
			if (cost_data[0] == "extraTarget") {
				const { result } = await player
					.chooseTarget(
						"请选择" + get.translation(trigger.card) + "的额外目标",
						(card, player, target) => {
							const event = get.event().getTrigger();
							if (event.targets.includes(target)) {
								return false;
							}
							return lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
						},
						true
					)
					.set("ai", target => {
						const player = get.player(),
							event = get.event().getTrigger();
						return get.effect(target, event.card, player, player);
					});
				if (result?.bool && result.targets?.length) {
					player.line(result.targets);
					trigger.targets.addArray(result.targets);
					game.log(result.targets, "成为了", trigger.card, "的额外目标");
				}
			} else {
				trigger.getParent().effectCount++;
				game.log(trigger.card, "额外结算一次");
			}
		},
		subSkill: {
			check: {
				charlotte: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					if (!event.starlianzhan_check) {
						return false;
					}
					const history = player.getHistory("sourceDamage", evt => {
						return event.targets.includes(evt.player) && evt.card == event.card;
					});
					if (history.length == 2) {
						return true;
					}
					if (history.length !== 0) {
						return false;
					}
					const card = new lib.element.VCard({ name: event.card.name });
					return event.targets?.some(target => {
						if (!target?.isIn()) {
							return false;
						}
						return target.canUse(card, player, false);
					});
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const history = player.getHistory("sourceDamage", evt => {
						return trigger.targets.includes(evt.player) && evt.card == trigger.card;
					});
					if (history.length == 0) {
						const card = new lib.element.VCard({ name: trigger.card.name });
						for (const target of trigger.targets || []) {
							if (!target?.isIn()) {
								continue;
							}
							if (target.canUse(card, player, false)) {
								await target.useCard(card, player, false);
							}
						}
					} else if (history.length == 2) {
						const prompt = player.isDamaged() ? "回复1点体力" : "摸两张牌";
						const { result } = await player.chooseBool(`连战：是否${prompt}？`);
						const next = player.isDamaged() ? player.recover() : player.draw(2);
						await next;
					}
				},
			},
		},
	},
	starweiming: {
		audio: 2,
		trigger: { global: "useCard" },
		filter(event, player) {
			if (event.player === player || !event.targets?.includes(player)) {
				return false;
			}
			return (
				event.player.getHp() < player.getHp() ||
				player.getRoundHistory("sourceDamage", evt => {
					return event.player == evt.player;
				}).length > 0
			);
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			await trigger.player.randomDiscard();
			if (
				trigger.player.getHp() < player.getHp() &&
				player.getRoundHistory("sourceDamage", evt => {
					return trigger.player == evt.player;
				}).length > 0
			) {
				await player.draw();
			}
		},
	},
	//丁奉
	stardangchen: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player != target && target.countCards("he");
				})
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let result = await target
				.chooseToGive(player, "he", true, [1, Infinity])
				.set("ai", card => {
					const { player, target } = get.event();
					const att = get.attitude(player, target);
					if (att <= 0) {
						if (ui.selected.cards.length > 1) {
							return 0;
						}
						return 6 - get.value(card);
					}
					if (ui.selected.cards.length) {
						return 0;
					}
					return 7 - get.value(card);
				})
				.forResult();
			if (result?.bool && result.cards?.length) {
				const num = result.cards.length;
				const next = player.chooseToDiscard("he", num);
				next.set("prompt", "荡尘：是否弃置" + get.cnNumber(num) + "张牌并获得后续效果？");
				next.set("prompt2", "当你于本回合使用基本牌或普通锦囊牌时，可以进行一次判定，若判定的点数为" + num + "的倍数，则此牌额外结算一次");
				result = await next.forResult();
				if (!result?.bool) {
					return;
				}
				player.addTempSkill("stardangchen_buff");
				player.addMark("stardangchen_buff", num, false);
			}
		},
		subSkill: {
			buff: {
				charlotte: true,
				onremove: true,
				audio: "stardangchen",
				trigger: { player: "useCard" },
				filter(event, player) {
					if (!lib.skill.dcshixian.filterx(event) || !player.hasMark("stardangchen_buff")) {
						return false;
					}
					return typeof get.number(event.card) === "number";
				},
				check(event, player) {
					return !get.tag(event.card, "norepeat") ^ (event.targets?.reduce((sum, i) => sum + get.effect(event.card, i, player, player), 0) < 0);
				},
				prompt2(event, player) {
					return "进行一次判定，若判定结果为" + player.countMark("stardangchen_buff") + "的倍数，则" + get.translation(event.card) + "额外结算一次";
				},
				async content(event, trigger, player) {
					const { result } = await player
						.judge(card => {
							const number = get.number(card);
							return 10 * (0.5 - (number % get.player().countMark("stardangchen_buff") !== 0));
						})
						.set("judge2", result => Boolean(result.bool));
					const { number } = result;
					if (number % player.countMark("stardangchen_buff") === 0) {
						trigger.effectCount++;
						game.log(trigger.card, "额外结算一次");
					}
				},
				intro: { content: "使用基本牌或普通锦囊牌时可以进行一次判定，若判定的点数为#的倍数，则此牌额外结算一次" },
			},
		},
	},
	starjianyu: {
		audio: 2,
		trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
		getIndex(event, player) {
			if (_status.currentPhase !== player) {
				return false;
			}
			return game.filterPlayer2(target => target !== player && event.getl?.(target)?.es?.length);
		},
		filterTarget: (event, player, name, target) => target,
		logTarget: (event, player, name, target) => target,
		forced: true,
		content() {
			player.draw();
		},
	},
	//法正
	starzhiji: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.hasCard(card => _status.connectMode || lib.filter.cardDiscardable(card, player), "h");
		},
		async cost(event, trigger, player) {
			const next = player.chooseToDiscard(get.prompt2(event.skill), [1, Infinity]).set("logSkill", "starzhiji");
			if (_status.auto || !(player === game.me || player.isOnline())) {
				next.complexCard = true;
				next.ai = function (card) {
					const player = get.player();
					switch (get.sgn(player.countCards("h") - 5)) {
						case 1: {
							const num = game.countPlayer(target => target !== player && get.damageEffect(target, player, player) > 0);
							if (ui.selected.cards.length < num) {
								return 8 - get.value(card);
							}
							return 0;
						}
						default:
							return lib.skill.zhiheng.check(card) + (5 - player.countCards("h")) * get.effect(player, { name: "draw" }, player, player);
					}
				};
			}
			event.result = await next.forResult();
		},
		popup: false,
		async content(event, trigger, player) {
			const num = event.cards.length - ((await player.drawTo(5).forResult()) || []).length;
			switch (get.sgn(num)) {
				case 1: {
					const result = await player
						.chooseTarget("是否对至多" + num + "名其他角色各造成1点伤害？", lib.filter.notMe, [1, num])
						.set("ai", target => {
							const player = get.player();
							return get.damageEffect(target, player, player);
						})
						.forResult();
					if (result.bool) {
						const targets = result.targets.sortBySeat();
						player.line(targets);
						for (const i of targets) {
							await i.damage();
						}
					}
					break;
				}
				case 0:
					player.addTempSkill("starzhiji_fuqi");
					break;
				case -1:
					player.addTempSkill("starzhiji_hand");
					player.addMark("starzhiji_hand", 2, false);
					break;
			}
		},
		subSkill: {
			fuqi: {
				charlotte: true,
				audio: "starzhiji",
				trigger: { player: "useCard" },
				forced: true,
				content() {
					trigger.directHit.addArray(game.players);
					game.log(trigger.cards, "不可被响应");
				},
				ai: { directHit_ai: true },
				mark: true,
				intro: { content: "使用牌不可被响应" },
			},
			hand: {
				charlotte: true,
				onremove: true,
				mod: { maxHandcard: (player, num) => num + player.countMark("starzhiji_hand") },
				intro: { content: "手牌上限+#" },
			},
		},
	},
	staranji: {
		getUsed(player) {
			let history = game.getRoundHistory("useCard"),
				suits = lib.suit.slice();
			const map = history.reduce((map, evt) => {
				const suit = get.suit(evt.card);
				if (!map[suit]) {
					map[suit] = 1;
					suits.add(suit);
				} else {
					map[suit]++;
				}
				return map;
			}, {});
			return [map, suits];
		},
		audio: 2,
		trigger: { global: "useCard" },
		filter(event, player) {
			const [map, suits] = get.info("staranji").getUsed(player),
				min = Math.min(...suits.slice().map(suit => map[suit] || 0));
			return map[get.suit(event.card)] === min;
		},
		forced: true,
		logTarget: "player",
		content() {
			player.draw();
		},
		init(player, skill) {
			const [map] = get.info(skill).getUsed(player);
			if (Object.keys(map).length) {
				player.storage[skill] = map;
				player.markSkill(skill);
			}
		},
		onremove: true,
		intro: {
			content(storage = {}, player) {
				if (!storage) {
					return "当前暂无记录";
				}
				let str = "本轮游戏所有角色使用牌的花色情况：<br>";
				const list = lib.suit.slice();
				const entries = Object.entries(storage).sort((a, b) => list.indexOf(a[0]) - list.indexOf(b[0]));
				for (const entry of entries) {
					str += "<li>" + get.translation(entry[0]) + "：" + entry[1];
				}
				return str;
			},
		},
		ai: { threaten: 2 },
		group: "staranji_count",
		subSkill: {
			count: {
				charlotte: true,
				trigger: { global: ["useCard1", "roundStart"] },
				filter(event, player, name) {
					return name == "useCard1" || Object.keys(player.storage.staranji || {}).length;
				},
				firstDo: true,
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					if (event.triggername == "roundStart") {
						delete player.storage.staranji;
						player.unmarkSkill("staranji");
					} else {
						const key = get.suit(trigger.card);
						player.storage.staranji ??= {};
						player.storage.staranji[key] ??= 0;
						player.storage.staranji[key]++;
						player.markSkill("staranji");
					}
				},
			},
		},
	},
	//荀彧
	staranshu: {
		audio: 2,
		trigger: { global: "roundEnd" },
		filter(event, player) {
			return get.discardPile(card => get.type(card) == "basic");
		},
		async cost(event, trigger, player) {
			const cards = Array.from(ui.discardPile.childNodes).filter(card => get.type(card) == "basic");
			const result = await player
				.chooseButton([get.prompt2(event.skill), cards], [1, Infinity])
				.set("filterButton", button => {
					if (ui.selected.buttons?.some(buttonx => buttonx.link.name == button.link.name)) {
						return false;
					}
					return true;
				})
				.set("ai", () => 1 + Math.random())
				.forResult();
			event.result = {
				bool: result?.bool,
				cards: result?.links ?? [],
			};
		},
		async content(event, trigger, player) {
			game.players.forEach(current => current.addTempSkill("staranshu_remove", "roundEnd"));
			await game.cardsGotoPile(event.cards, "insert");
			player
				.when({ global: "useCardToTargeted" })
				.filter(evt => evt.card?.anshu && evt?.targets?.length == evt.getParent()?.triggeredTargets4?.length)
				.then(() => {
					delete trigger.card.anshu;
					const targets = game.filterPlayer(current => current == player || current.isDamaged());
					if (targets.length > 1) {
						player
							.chooseTarget("请选择【五谷丰登】的起点", true, function (card, player, target) {
								return get.event("targets").includes(target);
							})
							.set("targets", targets)
							.set("ai", target => {
								return get.attitude(get.player(), target);
							});
					}
				})
				.then(() => {
					let target = player;
					if (result?.targets) {
						target = result.targets[0];
					}
					trigger.getParent().targets = trigger.getParent().targets.sortBySeat(target);
					trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.sortBySeat(target);
				});
			await player.chooseUseTarget({ name: "wugu", isCard: true, anshu: true }, true);
		},
		group: "staranshu_draw",
		subSkill: {
			draw: {
				audio: "staranshu",
				trigger: { global: "phaseEnd" },
				getIndex(event, player) {
					return game
						.filterPlayer(current => {
							return current.hasHistory("lose", evt => {
								for (var i in evt.gaintag_map) {
									if (evt.gaintag_map[i].includes("staranshu")) {
										return true;
									}
								}
								return false;
							});
						})
						.sortBySeat();
				},
				filter(event, player, name, target) {
					return target.countCards("h") < target.maxHp;
				},
				logTarget(event, player, name, target) {
					return target;
				},
				check(event, player, name, target) {
					return get.attitude(player, target) > 0;
				},
				prompt2: "令其将手牌摸至体力上限（至多摸五张）",
				async content(event, trigger, player) {
					const target = event.targets[0];
					const num = Math.min(5, target.maxHp - target.countCards("h"));
					if (num > 0) {
						await target.draw(num);
					}
				},
			},
			remove: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("staranshu");
				},
				trigger: { player: "gainAfter" },
				filter(event, player) {
					return event.getParent("staranshu", true) && event.getParent("wugu", true);
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.addGaintag(trigger.cards, "staranshu");
				},
			},
		},
	},
	starkuangzuo: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		filterTarget: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const target = event.target;
			await target.addSkills("starchengfeng");
			if (
				target.isZhu2() &&
				!target.getSkills(null, false, false).filter(skill => {
					var info = get.info(skill);
					if (!info || info.charlotte || !info.zhuSkill || get.skillInfoTranslation(skill, player).length == 0) {
						return false;
					}
					return true;
				}).length
			) {
				await target.addSkills("startongyin");
			}
			const targets = game.filterPlayer(current => current != target && current.countCards("he"));
			let targetx;
			if (!targets.length) {
				return;
			} else if (targets.length == 1) {
				targetx = targets[0];
			} else {
				const result = await player
					.chooseTarget(`令另一名角色将牌置于${get.translation(target)}武将牌上`, true, function (card, player, target) {
						return target != get.event("gainer") && target.countCards("he");
					})
					.set("gainer", target)
					.set("ai", target => {
						return get.attitude(get.player(), target) * target.countCards("he");
					})
					.forResult();
				if (result.bool) {
					targetx = result.targets[0];
				} else {
					return;
				}
			}
			let suits = [];
			for (let card of targetx.getCards("he")) {
				suits.add(get.suit(card));
			}
			const result = await targetx
				.chooseCard("he", true, suits.length)
				.set("complexCard", true)
				.set("filterCard", card => {
					return ui.selected.cards.every(cardx => get.suit(cardx) != get.suit(card));
				})
				.forResult();
			if (result.bool) {
				const next = target.addToExpansion(result.cards, targetx, "give");
				next.gaintag.add("starchengfeng");
				await next;
			}
		},
		ai: {
			order: 10,
			result: {
				target: 1,
			},
		},
		derivation: ["starchengfeng", "startongyin"],
	},
	starchengfeng: {
		marktext: "匡",
		intro: {
			name: "匡祚",
			markcount: "expansion",
			content: "expansion",
		},
		audio: 2,
		usable: 1,
		enable: "chooseToUse",
		filter(event, player) {
			for (const name of ["shan", "wuxie"]) {
				if (name == "wuxie") {
					let info = event.info_map;
					if (info && player != info.target) {
						continue;
					}
				} else if (!event.respondTo) {
					continue;
				}
				const color = name == "shan" ? "red" : "black";
				if (!event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) {
					continue;
				}
				if (player.getExpansions("starchengfeng").some(card => get.color(card) == color)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("承奉", player.getExpansions("starchengfeng"), "hidden");
			},
			filter(button, player) {
				const card = button.link;
				if (!game.checkMod(card, player, "unchanged", "cardEnabled2", player)) {
					return false;
				}
				const evt = _status.event.getParent();
				const name = get.color(card) == "red" ? "shan" : "wuxie";
				return evt.filterCard(get.autoViewAs({ name: name }, [card]), player, evt);
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
					audio: "starchengfeng",
					selectCard: -1,
					position: "x",
					filterCard: card => card == lib.skill.starchengfeng_backup.card,
					viewAs(cards, player) {
						const name = get.color(cards[0]) == "red" ? "shan" : "wuxie";
						return { name: name };
					},
					card: links[0],
				};
			},
			prompt(links, player) {
				return "将一张基本牌当做" + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			const color = name == "shan" ? "red" : "black";
			if (player.getExpansions("starchengfeng").some(card => get.color(card) == color)) {
				return true;
			}
		},
		ai: {
			respondShan: true,
			skillTagFilter(player, tag) {
				if (player.getExpansions("starchengfeng").some(card => get.color(card) == "red")) {
					return true;
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
		group: "starchengfeng_use",
		subSkill: {
			backup: {},
			use: {
				audio: "starchengfeng",
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					let colors = [];
					for (let card of player.getExpansions("starchengfeng")) {
						colors.add(get.color(card));
					}
					return event.skill == "starchengfeng_backup" && colors.length < 2;
				},
				prompt2: "将牌堆顶一张牌置入“匡祚”",
				content() {
					player.addToExpansion(get.cards(1), "gain2").gaintag.add("starchengfeng");
				},
			},
		},
	},
	startongyin: {
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			if (!event.source || !event.card) {
				return false;
			}
			if (event.source == player) {
				return false;
			}
			if (event.source.group == player.group) {
				return event.cards?.length;
			}
			return event.source.countCards("he");
		},
		zhuSkill: true,
		logTarget: "source",
		async content(event, trigger, player) {
			let next;
			if (trigger.source.group == player.group) {
				next = player.addToExpansion(trigger.cards, "gain2");
			} else {
				const result = await player.choosePlayerCard(trigger.source, "he", true).forResult();
				next = player.addToExpansion(result.cards, trigger.source, "give");
			}
			next.gaintag.add("starchengfeng");
			await next;
		},
	},
	//马铁
	dczhuiwang: {
		mod: {
			globalFrom(from, to) {
				if (from.hp >= to.hp) {
					return -Infinity;
				}
			},
		},
	},
	dcquxian: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "选择一名角色，攻击范围内包含其的角色可以对其使用【杀】")
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				targets = game.filterPlayer(current => current != player && current.inRange(target)).sortBySeat();
			if (!targets.length) {
				return;
			}
			const sha = [],
				nosha = [];
			while (targets.length) {
				const current = targets.shift();
				const bool = await current
					.chooseToUse(function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					}, "驱险：是否对" + get.translation(target) + "使用一张杀？")
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("complexTarget", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", target)
					.set("addCount", false)
					.forResultBool();
				if (bool) {
					sha.push(current);
				} else {
					nosha.push(current);
				}
			}
			if (!target.hasHistory("damage", evt => evt.getParent().type == "card" && evt.getParent(4) == event) && sha.length && nosha.length) {
				for (const i of nosha) {
					await i.loseHp(sha.length);
				}
			}
		},
	},
	//韩嵩
	dcyinbi: {
		mod: {
			targetInRange(card, player) {
				if (!game.hasPlayer(current => current != player && current.countCards("h") == player.countCards("h"))) {
					return true;
				}
			},
			cardUsable(card, player) {
				if (!game.hasPlayer(current => current != player && current.countCards("h") == player.countCards("h"))) {
					return Infinity;
				}
			},
			maxHandcardBase(player) {
				if (_status.dcyinbi) {
					return;
				}
				_status.dcyinbi = true;
				const num = Math.max(...game.filterPlayer().map(target => target.getHandcardLimit()));
				delete _status.dcyinbi;
				return num;
			},
		},
	},
	dcshuaiyan: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player, name, target) {
			return target && target.countCards("h") == player.countCards("h");
		},
		getIndex(event, player) {
			return game
				.filterPlayer(target => {
					if (target == player) {
						return false;
					}
					if (event.getg && event.getg(target) && event.getg(target).length && target.countCards("h") == player.countCards("h")) {
						return true;
					}
					const evt = event.getl(target);
					if (evt && evt.hs && evt.hs.length && target.countCards("h") == player.countCards("h")) {
						return true;
					}
					return false;
				})
				.sortBySeat();
		},
		logTarget(event, player, triggername, target) {
			return target;
		},
		forced: true,
		async content(event, trigger, player) {
			const target = event.targets[0],
				goon = target.countDiscardableCards(player, "he");
			let result;
			if (goon) {
				result = await player
					.chooseControl()
					.set("choiceList", ["弃置" + get.translation(target) + "的一张牌", "摸一张牌"])
					.set("ai", () => {
						const player = get.player();
						const eff1 = get.effect(get.event("target"), { name: "guohe_copy2" }, player, player);
						const eff2 = get.effect(player, { name: "draw" }, player, player);
						return eff1 > eff2 ? 0 : 1;
					})
					.set("target", target)
					.forResult();
			} else {
				result = { index: 1 };
			}
			if (result.index == 0) {
				player.discardPlayerCard(target, "he", true);
			} else {
				player.draw();
			}
		},
	},
	//侧肘
	dcshefu: {
		audio: 2,
		trigger: {
			player: "damageBegin2",
			source: "damageBegin1",
		},
		filter(event, player) {
			if (!event.source || event.source == event.player) {
				return false;
			}
			const evt = event.getParent(2);
			return evt && evt.name == "useCard";
		},
		forced: true,
		logTarget(event, player) {
			return event.source == player ? event.player : event.source;
		},
		content() {
			if (!trigger.cards?.length) {
				trigger.cancel();
				return;
			}
			const evt = trigger.getParent(2);
			const cards = evt.cards.filter(card => {
				if (trigger.source._start_cards?.includes(card)) {
					return true;
				}
				return trigger.source.getAllHistory("gain", evt => {
					return evt.cards.includes(card);
				}).length;
			});
			trigger.num =
				cards.length +
				cards.reduce((sum, card) => {
					let num = 0,
						history = trigger.source.actionHistory;
					for (let i = history.length - 1; i >= 0; i--) {
						if (history[i].gain.some(evtx => evtx.cards.includes(card))) {
							break;
						}
						if (history[i].isRound) {
							num++;
						}
						if (i == 0 && trigger.source._start_cards?.includes(card)) {
							num--;
						}
					}
					return sum + num;
				}, 0);
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (target == player || !get.tag(card, "damage")) {
						return;
					}
					if (!(card.cards || []).length) {
						return "zeroplayertarget";
					}
				},
				player() {
					return lib.skill.dcshefu.ai.effect.target.apply(this, arguments);
				},
			},
		},
	},
	dcpigua: {
		audio: 2,
		trigger: { source: "damageSource" },
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			return event.num > 1 && event.player.isIn() && event.player.countCards("he") && game.roundNumber > 0;
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			let result = await player.gainPlayerCard(target, "he", [1, game.roundNumber]).set("prompt", get.prompt2(event.skill, target)).set("logSkill", [event.skill, target]).forResult();
			result.bool = Boolean((result.cards || []).length);
			event.result = result;
		},
		popup: false,
		async content(event, trigger, player) {
			player.addTempSkill("dcpigua_effect");
			player.addGaintag(event.cards, "dcpigua_effect");
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				mod: {
					ignoredHandcard(card) {
						if (card.hasGaintag("dcpigua_effect")) {
							return true;
						}
					},
					cardDiscardable(card, _, name) {
						if (name == "phaseDiscard" && card.hasGaintag("dcpigua_effect")) {
							return false;
						}
					},
				},
			},
		},
	},
	//星张昭
	starzhongyan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => get.info("starzhongyan").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target.countCards("h");
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				topCards = get.cards(3);
			await game.cardsGotoOrdering(topCards);
			await player.showCards(topCards, get.translation(player) + "发动了【忠言】");
			if (!target.countCards("h")) {
				return;
			}
			const result = await target
				.chooseToMove("忠言：交换其中一张牌")
				.set("list", [
					["牌堆顶", topCards],
					["你的手牌", target.getCards("h")],
				])
				.set("filterMove", (from, to, moved) => {
					if (typeof to == "number") {
						return false;
					}
					var player = _status.event.player;
					var hs = player.getCards("h");
					var changed = hs.filter(function (card) {
						return !moved[1].includes(card);
					});
					var changed2 = moved[1].filter(function (card) {
						return !hs.includes(card);
					});
					if (changed.length < 1) {
						return true;
					}
					var pos1 = moved[0].includes(from.link) ? 0 : 1,
						pos2 = moved[0].includes(to.link) ? 0 : 1;
					if (pos1 == pos2) {
						return true;
					}
					if (pos1 == 0) {
						if (changed.includes(from.link)) {
							return true;
						}
						return changed2.includes(to.link);
					}
					if (changed2.includes(from.link)) {
						return true;
					}
					return changed.includes(to.link);
				})
				.set("filterOk", moved => {
					return moved[0].filter(card => get.owner(card)).length == 1;
				})
				.set("processAI", function (list) {
					var cards1 = list[0][1].slice(),
						cards2 = list[1][1].slice();
					var card1 = cards1.sort((a, b) => get.value(b) - get.value(a))[0];
					var card2 = cards2.sort((a, b) => get.value(a) - get.value(b))[0];
					if (card1 && card2 && get.value(card1) > get.value(card2)) {
						cards1.remove(card1);
						cards2.remove(card2);
						cards1.push(card2);
						cards2.push(card1);
					}
					return [cards1, cards2];
				})
				.forResult();
			if (result.bool) {
				const lose = result.moved[0].slice();
				const gain = result.moved[1].slice().filter(i => !get.owner(i));
				if (lose.some(i => get.owner(i))) {
					await target.lose(
						lose.filter(i => get.owner(i)),
						ui.special
					);
				}
				for (let i = lose.length - 1; i--; i >= 0) {
					ui.cardPile.insertBefore(lose[i], ui.cardPile.firstChild);
				}
				game.updateRoundNumber();
				if (gain.length) {
					await target.gain(gain, "draw");
				}
				if (lose.map(card => get.color(card)).toUniqued().length == 1) {
					const chosen = [],
						list = player != target ? [target, player] : [target];
					for (const current of list) {
						const goon = game.hasPlayer(i => i.countGainableCards(current, "ej"));
						const choices = [];
						const choiceList = ["回复1点体力", "获得场上一张牌"];
						if (current.isDamaged() && !chosen.includes("选项一")) {
							choices.push("选项一");
						} else {
							choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
						}
						if (goon && !chosen.includes("选项二")) {
							choices.push("选项二");
						} else {
							choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
						}
						if (!choices.length) {
							continue;
						}
						const control =
							choices.length == 1
								? choices[0]
								: await current
										.chooseControl(choices)
										.set("choiceList", choiceList)
										.set("prompt", "忠言：请选择一项")
										.set("ai", () => {
											const player = get.player();
											const eff2 = get.recoverEffect(player, player, player);
											return eff2 ? 0 : 1;
										})
										.forResultControl();
						chosen.push(control);
						if (control == "选项一") {
							await current.recover();
						} else {
							const targets = await current
								.chooseTarget("获得一名角色场上的一张牌", true, (card, player, target) => {
									const targetx = get.event("targetx");
									return target.countGainableCards(targetx, "ej") > 0;
								})
								.set("ai", target => {
									const player = get.player();
									let att = get.attitude(player, target);
									if (att < 0) {
										att = -Math.sqrt(-att);
									} else {
										att = Math.sqrt(att);
									}
									return att * lib.card.shunshou.ai.result.target(player, target);
								})
								.set("targetx", current)
								.forResultTargets();
							await current.gainPlayerCard(targets[0], "ej", true);
						}
					}
				}
			} else {
				for (let i = topCards.length - 1; i--; i >= 0) {
					ui.cardPile.insertBefore(topCards[i], ui.cardPile.firstChild);
				}
				game.updateRoundNumber();
			}
		},
		ai: {
			order: 8,
			result: {
				player: 1,
				target: 1,
			},
		},
	},
	starjinglun: {
		audio: 2,
		trigger: {
			global: "damageSource",
		},
		filter(event, player) {
			const target = event.source;
			return target && target.isIn() && get.distance(player, target) <= 1;
		},
		check(event, player) {
			return get.attitude(player, event.source) > 0;
		},
		usable: 1,
		logTarget: "source",
		async content(event, trigger, player) {
			const target = trigger.source,
				num = target.countCards("e");
			if (num) {
				await target.draw(num);
			}
			await player.useSkill("starzhongyan", [target]);
		},
		derivation: "starzhongyan",
	},
	//星孙坚
	starruijun: {
		audio: 2,
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || !player.isPhaseUsing()) {
					return num;
				}
				if (get.tag(card, "recover")) {
					if (player.needsToDiscard()) {
						return num / 3;
					}
					return 0;
				}
				if (player.hasSkill("starruijun_effect")) {
					return num;
				}
				const info = get.info(card);
				if (info?.toself) {
					return num;
				}
				if (
					game.hasPlayer(cur => {
						return (
							player.canUse(card, cur, true, true) &&
							get.attitude(player, cur) < 0 &&
							get.effect(cur, card, player, player) > 0 &&
							get.damageEffect(cur, player, player) > 0 &&
							!cur.hasSkillTag("filterDamage", null, {
								player,
								card,
							})
						);
					})
				) {
					return num + 2;
				}
				return num / 10;
			},
		},
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			if (
				!player.isPhaseUsing() ||
				player.hasHistory("useCard", evt => {
					if (evt === event.getParent()) {
						return false;
					}
					const targets = evt.targets;
					return evt.isPhaseUsing() && targets.some(target => target !== player);
				})
			) {
				return false;
			}
			return event.isFirstTarget && (event.targets || []).some(target => target !== player && target.isIn());
		},
		locked: false,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.name.slice(0, -5)), `选择其中一名目标角色，摸${get.cnNumber(player.getDamagedHp() + 1)}张牌，令所有除其外的其他角色不在你的攻击范围内，且你对其造成的伤害逐次增加。`, (card, player, target) => {
					return target != player && get.event().getTrigger().targets.includes(target) && target.isIn();
				})
				.set("ai", target => {
					const player = get.player(),
						original = get.event("original"),
						draw = 1 + player.getDamagedHp();
					if (Array.isArray(original)) {
						if (original.includes(target)) {
							return -get.attitude(player, target);
						}
						return 0;
					}
					if (get.attitude(player, target) >= 0) {
						return draw * get.effect(player, { name: "draw" }, player, player) - original;
					}
					let shas = player.getCardUsable("sha"),
						filterDamage = target.hasSkillTag("filterDamage", null, {
							player,
						}),
						idx = filterDamage ? 1 : 0;
					return (
						player.countCards("hs", card => {
							if (get.info(card).toself || !player.canUse(card, target, false, true)) {
								return 0;
							}
							let eff = get.effect(target, card, player, player);
							if (eff <= 0) {
								return 0;
							}
							if (card.name === "sha" && shas-- <= 0) {
								return 0;
							}
							if (!get.tag(card, "damage") || get.type(card, null, player) === "delay") {
								return eff;
							}
							if (!filterDamage && idx < 3) {
								idx += 0.65;
							}
							return eff * idx;
						}) +
						draw * get.effect(player, { name: "draw" }, player, player) -
						original
					);
				})
				.set(
					"original",
					(function () {
						const cards = player.getCards("hs");
						let shas = player.getCardUsable("sha"), //【杀】的剩余使用次数
							damage = trigger.targets
								.filter(tar => {
									//筛选目标中可狙敌人
									return (
										get.attitude(player, tar) < 0 &&
										get.damageEffect(tar, player, player) > 0 &&
										!tar.hasSkillTag("filterDamage", null, {
											player,
										})
									);
								})
								.map(i => [i, 0]),
							eff = 0;
						for (let card of cards) {
							if (card.name === "sha" && shas-- <= 0) {
								continue;
							} //【杀】只能用次数上限张
							if (get.info(card).toself) {
								continue;
							}
							if (get.tag(card, "damage") && get.type(card, null, player) !== "delay") {
								for (let arr of damage) {
									if (player.canUse(card, arr[0], false, true) && get.effect(arr[0], card, player, player) > 0) {
										arr[1]++; //统计每个可狙敌人可以用的伤害牌数
										if (arr[1] > 4) {
											return damage
												.filter(cur => {
													return cur[1] > 3;
												})
												.map(i => i[0]);
										} //针对目标中敌方角色的伤害牌已经足够多，为降低计算开销直接狙他
									}
								}
							}
							let val = player.getUseValue(card, true, true);
							if (val <= 0) {
								continue;
							}
							eff += val; //正常对其他人用牌的总收益
						}
						return eff;
					})()
				)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.draw(player.getDamagedHp() + 1);
			player.addTempSkill("starruijun_effect", "phaseChange");
			player.markAuto("starruijun_effect", event.targets[0]);
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (!target || target === player || player._starruijun_effect_use || !player.isPhaseUsing() || player.countSkill("starruijun")) {
						return;
					}
					player._starruijun_effect_use = true;
					if (
						get.attitude(player, target) < 0 &&
						get.damageEffect(target, player, player) > 0 &&
						!target.hasSkillTag("filterDamage", null, {
							player,
							card,
						})
					) {
						delete player._starruijun_effect_use;
						return [1, 1 + player.getDamagedHp(), 1, -1.8 * player.countCards("hs", i => get.tag(i, "damage") > 0.5)];
					}
					delete player._starruijun_effect_use;
				},
			},
			threaten(player, target) {
				if (target.hp < 3) {
					return 9 / (1 + target.getHp());
				}
				return 1 + 0.3 * target.getDamagedHp();
			},
		},
		subSkill: {
			effect: {
				audio: "starruijun",
				trigger: {
					source: "damageBegin2",
				},
				filter(event, player) {
					if (!player.getStorage("starruijun_effect").includes(event.player)) {
						return false;
					}
					let evt = event.getParent("phaseUse");
					return (
						evt &&
						player.hasHistory("sourceDamage", evt2 => {
							return evt2.source === player && evt2.player === event.player && evt2.getParent("phaseUse") === evt;
						})
					);
				},
				charlotte: true,
				forced: true,
				onremove: true,
				async content(event, trigger, player) {
					let num = 1;
					const evts = player.getHistory("sourceDamage", evt => {
						return evt.source === player && evt.player === trigger.player && evt.getParent("phaseUse") === trigger.getParent("phaseUse");
					});
					if (evts.length) {
						num += evts.lastItem.num;
					}
					trigger.num = Math.min(5, num);
				},
				ai: {
					damageBonus: true,
					skillTagFilter(player, tag, arg) {
						if (tag !== "damageBonus") {
							return false;
						}
						return (
							arg &&
							arg.target &&
							player.hasHistory("sourceDamage", evt => {
								return evt.source === player && evt.player === arg.target && evt.getParent("phaseUse") === _status.event.getParent("phaseUse");
							})
						);
					},
					effect: {
						player(card, player, target) {
							if (!target || !player.getStorage("starruijun_effect").includes(target) || !get.tag(card, "damage")) {
								return;
							}
							return [2.5, 0, 2.5, 0];
						},
					},
				},
				mod: {
					inRange(from, to) {
						if (!from.getStorage("starruijun_effect").includes(to)) {
							return false;
						}
					},
					targetInRange(card, player, target) {
						if (player.getStorage("starruijun_effect").includes(target)) {
							return true;
						}
					},
				},
			},
		},
	},
	stargangyi: {
		audio: 2,
		trigger: {
			source: "damage",
		},
		silent: true,
		forced: true,
		group: "stargangyi_recover",
		async content(event, trigger, player) {
			player.addTempSkill("stargangyi_access");
		},
		ai: {
			halfneg: true,
		},
		subSkill: {
			recover: {
				audio: "stargangyi",
				trigger: {
					player: "recoverBegin",
				},
				filter(event, player) {
					const evt = event.getParent(3);
					if (!player.isDying() || evt.type !== "dying") {
						return false;
					}
					return ["tao", "jiu"].includes(event.getParent().name);
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.num++;
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (target.hp <= 0 && get.tag(card, "recover")) {
								return 2;
							}
						},
					},
				},
			},
			access: {
				charlotte: true,
			},
		},
		mod: {
			cardEnabled(card, player) {
				if (player.hasSkill("stargangyi_access")) {
					return;
				}
				if (player === _status.currentPhase && card.name === "tao") {
					return false;
				}
			},
			cardSavable(card, player) {
				if (player.hasSkill("stargangyi_access")) {
					return;
				}
				if (player === _status.currentPhase && card.name === "tao") {
					return false;
				}
			},
		},
	},
	//李傕郭汜
	xiongsuan: {
		audio: 2,
		enable: "phaseUse",
		filterTarget: true,
		filterCard: lib.filter.cardDiscardable,
		position: "h",
		usable: 1,
		async content(event, trigger, player) {
			const target = event.target;
			await target.damage();
			await player.draw(3);
			if (target != player) {
				await player.loseHp();
			}
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					let res = 2 * get.effect(player, { name: "draw" }, player, player);
					if (
						player.hp <= 1 &&
						!player.hasCard(i => {
							let name = get.name(i, player);
							if (name != "tao" && name != "jiu") {
								return false;
							}
							return lib.filter.cardSavable(i, player, player);
						}, "hs")
					) {
						res = -res / 2;
					}
					if (player !== target) {
						res += get.effect(player, { name: "losehp" }, player, player);
					}
					return res;
				},
				target(player, target) {
					return get.damageEffect(target, player, target);
				},
			},
		},
	},
	//张春华
	starliangyan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		chooseButton: {
			dialog(event, player) {
				const name = get.translation(event.result.targets[0]);
				const list = ["你摸一张牌，其弃置一张牌", "你弃置一张牌，其摸一张牌", "你摸两张牌，其弃置两张牌", "你弃置两张牌，其摸两张牌"].map((item, i) => [i, item]);
				const dialog = ui.create.dialog(`梁燕：请选择你与${name}要执行的选项`, [list.slice(0, 2), "tdnodes"], [list.slice(2, 4), "tdnodes"], "hidden");
				return dialog;
			},
			filter(button, player) {
				const link = button.link;
				if (link % 2 === 0) {
					return true;
				}
				return player.countDiscardableCards(player, "he") >= (link + 1) / 2;
			},
			check(button) {
				const player = get.player(),
					target = get.event().getParent().result.targets[0];
				const link = button.link;
				if (get.attitude(player, target) <= 0 && link === 2) {
					return 100;
				}
				const ph = player.countCards("h"),
					th = target.countCards("h");
				if (link % 2 === 0) {
					const num = link / 2 + 1;
					if (ph + num === th - num) {
						return 10;
					}
				} else {
					const num = (link + 1) / 2;
					if (ph - num === th + num) {
						return 10;
					}
				}
				return 5;
			},
			backup(links) {
				return {
					audio: "starliangyan",
					target: get.event().result.targets[0],
					link: links[0],
					filterTarget(card, player, target) {
						return target === lib.skill.starliangyan_backup.target;
					},
					selectTarget: -1,
					async content(content, trigger, player) {
						const target = lib.skill.starliangyan_backup.target;
						const link = lib.skill.starliangyan_backup.link;
						const num = link <= 1 ? 1 : 2;
						const fn = ["draw", "chooseToDiscard"];
						if (link % 2 === 1) {
							fn.reverse();
						}
						await player[fn[0]](num, true, "he");
						await target[fn[1]](num, true, "he");
						if (player.countCards("h") === target.countCards("h")) {
							const skipper = [player, target][link % 2];
							skipper.skip("phaseDiscard");
							game.log(skipper, "跳过了下一个", "#y弃牌阶段");
						}
					},
				};
			},
			prompt(links) {
				return "点击“确定”以执行效果";
			},
		},
		subSkill: {
			backup: {},
		},
		ai: {
			order(item, player) {
				if (!game.hasPlayer(current => current !== player && get.attitude(player, current) > 0) && game.hasPlayer(current => get.attitude(player, current) <= 0)) {
					return 10;
				}
				if (
					game.hasPlayer(current => {
						const del = player.countCards("h") - current.countCards("h"),
							toFind = [2, 4].find(num => Math.abs(del) === num);
						if (toFind === 4 && del < 0 && get.attitude(player, current) <= 0) {
							return true;
						}
						return false;
					})
				) {
					return 10;
				}
				return 1;
			},
			result: {
				target(player, target) {
					const del = player.countCards("h") - target.countCards("h"),
						toFind = [2, 4].find(num => Math.abs(del) === num);
					if (toFind) {
						return (-del * (get.attitude(player, target) * Math.min(3, target.countCards("h"))) * toFind) / 10;
					}
					return -1;
				},
			},
		},
	},
	starminghui: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return player.isMinHandcard() || player.isMaxHandcard();
		},
		direct: true,
		async content(event, trigger, player) {
			let logged = false;
			if (player.isMinHandcard()) {
				const card = new lib.element.VCard({
					name: "sha",
				});
				const result = await player
					.chooseUseTarget(`###${get.prompt("starminghui")}###视为使用一张无距离限制的【杀】`, card, false, "nodistance")
					.set("logSkill", "starminghui")
					.forResult();
				if (result.bool) {
					logged = true;
				}
			}
			const num = player.countCards("h");
			if (player.isMaxHandcard() && num > 0) {
				const maxNum = game
					.findPlayer(current => {
						if (current === player) {
							return false;
						}
						return !game.hasPlayer(current2 => {
							if (current2 === player) {
								return false;
							}
							return current2.countCards("h") > current.countCards("h");
						});
					})
					.countCards("h");
				const leastDiscardNum = num - maxNum + 1;
				const prompt = logged ? `是否将手牌弃置至不为最多？` : get.prompt("starminghui");
				const next = player
					.chooseToDiscard(prompt, `弃置至少${get.cnNumber(leastDiscardNum)}张手牌，然后你令一名角色回复1点体力`)
					.set("selectCard", [leastDiscardNum, Infinity])
					.set(
						"goon",
						game.hasPlayer(current => get.recoverEffect(current, get.player(), get.player()))
					)
					.set("ai", card => {
						if (!get.event("goon")) {
							return 0;
						}
						if (get.tag(card, "recover")) {
							return 0;
						}
						if (ui.selected.cards.length === get.event("selectCard")[0] - 1) {
							return 6.5 - get.value(card);
						}
						return 4 - get.value(card);
					});
				if (!logged) {
					next.set("logSkill", "starminghui");
				}
				const result = await next.forResult();
				if (!result.bool) {
					return;
				}
				if (!player.isUnderControl(true) && !player.isOnline()) {
					await game.delayx();
				}
				const [bool, targets] = await player
					.chooseTarget("令一名角色回复1点体力")
					.set("ai", target => get.recoverEffect(target, get.player(), get.player()))
					.forResult("bool", "targets");
				if (bool) {
					const target = targets[0];
					player.line(target, "green");
					await target.recover();
				}
			}
		},
	},
	//星袁绍
	starxiaoyan: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: ["enterGame" /*,'logSkill'*/],
		},
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			//if(event.name=='logSkill'&&evt.skill!='starjiaowang') return false;
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			let targets = game.filterPlayer(current => current != player);
			player.line(targets);
			for (const target of targets) {
				await target.damage("fire");
			}
			targets = targets.filter(i => i.isIn());
			if (targets.length) {
				for (const target of targets) {
					if (!target.countCards("he")) {
						continue;
					}
					const {
						result: { bool },
					} = await target
						.chooseToGive("he", player)
						.set("prompt", "是否交给" + get.translation(player) + "一张牌" + (target.isDamaged() ? "并回复1点体力" : "") + "？")
						.set("ai", card => {
							const target = get.event("player"),
								player = get.event("target");
							const att = get.attitude(target, player);
							if (get.recoverEffect(target, target, target) <= 0) {
								if (att <= 0) {
									return -get.value(card);
								}
								return 0;
							}
							return 7 - get.value(card);
						})
						.set("target", player);
					if (bool) {
						await target.recover();
					}
				}
			}
		},
	},
	starzongshi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			const cards = player.getCards("h", card => {
				const type = get.type(card, null, player);
				if (type != "basic" && type != "trick") {
					return false;
				}
				return (
					lib.filter.cardUsable(card, player) &&
					game.hasPlayer(target => {
						return lib.filter.targetEnabled2(card, player, target) /*&&lib.filter.targetInRange(card,player,target)*/;
					})
				);
			});
			if (!cards.length) {
				return false;
			}
			return cards.some(card => {
				const cardss = player.getCards("h", cardx => card != cardx && get.suit(card, player) == get.suit(cardx, player));
				return cardss.length && !cardss.some(cardx => !game.checkMod(cardx, player, "unchanged", "cardEnabled2", player));
			});
		},
		filterCard(card, player) {
			if (ui.selected.cards.length) {
				return false;
			}
			const cards = player.getCards("h", card => {
				const type = get.type(card, null, player);
				if (type != "basic" && type != "trick") {
					return false;
				}
				return (
					lib.filter.cardUsable(card, player) &&
					game.hasPlayer(target => {
						return lib.filter.targetEnabled2(card, player, target) /*&&lib.filter.targetInRange(card,player,target)*/;
					})
				);
			});
			if (!cards.includes(card)) {
				return false;
			}
			const cardss = player.getCards("h", cardx => card != cardx && get.suit(card, player) == get.suit(cardx, player));
			return cardss.length && !cardss.some(cardx => !game.checkMod(cardx, player, "unchanged", "cardEnabled2", player));
		},
		selectCard: [1, 2],
		complexCard: true,
		check(card) {
			const player = get.event("player"),
				select = get.copy(get.info(card).selectTarget);
			let range;
			if (select == undefined) {
				range = [1, 1];
			} else if (typeof select == "number") {
				range = [select, select];
			} else if (get.itemtype(select) == "select") {
				range = select;
			} else if (typeof select == "function") {
				range = select(card, player);
			}
			game.checkMod(card, player, range, "selectTarget", player);
			const cards = player.getCards("h", cardx => card != cardx && get.suit(card, player) == get.suit(cardx, player));
			let targets = game.filterPlayer(target => lib.filter.targetEnabled2(card, player, target) /*&&lib.filter.targetInRange(card,player,target)*/ && get.effect(target, card, player, player) > 0);
			const max = range[1],
				max2 = Math.min(cards.length, targets.length);
			if (max > max2) {
				return 0;
			}
			targets = targets.sort((a, b) => get.effect(b, card, player, player) - get.effect(a, card, player, player)).slice(0, max2);
			const sum = targets.reduce((num, target) => num + get.effect(target, card, player, player), 0);
			if (max == -1) {
				if (
					game
						.filterPlayer(target => {
							return lib.filter.targetEnabled2(card, player, target) /*&&lib.filter.targetInRange(card,player,target)*/;
						})
						.reduce((num, target) => num + get.effect(target, card, player, player), 0) > sum
				) {
					return 0;
				}
			}
			return sum;
		},
		position: "h",
		discard: false,
		lose: false,
		delay: false,
		async content(event, trigger, player) {
			const card = event.cards[0],
				cards = player.getCards("h", cardx => card != cardx && get.suit(card, player) == get.suit(cardx, player));
			await player.showCards([card], get.translation(player) + "发动了【纵势】");
			const cardx = new lib.element.VCard({
				name: get.name(card, player),
				nature: get.nature(card, player),
				cards: cards,
			});
			const {
				result: { bool, targets },
			} = await player
				.chooseTarget((card, player, target) => {
					//return player.canUse(get.event('cardx'),target);
					return lib.filter.targetEnabled2(get.event("cardx"), player, target) /*&&lib.filter.targetInRange(get.event('cardx'),player,target)*/;
				}, true)
				.set("cardx", cardx)
				.set("selectTarget", [1, cards.length])
				.set("prompt", "请选择" + (game.hasNature(cardx) ? get.translation(get.nature(cardx)) : "") + "【" + get.translation(cardx) + "】（" + get.translation(cards) + "）的目标")
				.set("ai", target => {
					const player = get.event("player"),
						card = get.event("cardx");
					return get.effect(target, card, player, player);
				});
			if (bool) {
				player.useCard(cardx, cards, targets.sortBySeat());
			}
		},
		ai: {
			order: 9,
			result: { player: 1 },
		},
	},
	starjiaowang: {
		audio: 2,
		trigger: { global: "roundEnd" },
		filter(event, player) {
			const history = game.getAllGlobalHistory();
			for (let i = history.length - 1; i >= 0; i--) {
				const evt = history[i]["everything"];
				for (let j = evt.length - 1; j >= 0; j--) {
					if (evt[j].name == "die") {
						return false;
					}
				}
				if (history[i].isRound) {
					break;
				}
			}
			return true;
		},
		forced: true,
		derivation: "starxiaoyan",
		async content(event, trigger, player) {
			await player.loseHp();
			if (game.hasPlayer(current => current != player)) {
				player.useResult({ skill: "starxiaoyan" }, event);
			}
		},
	},
	staraoshi: {
		audio: 2,
		zhuSkill: true,
		global: "staraoshi_global",
		derivation: "starzongshi",
		subSkill: {
			global: {
				audio: "staraoshi",
				forceaudio: true,
				enable: "phaseUse",
				filter(event, player) {
					return player.group == "qun" && game.hasPlayer(target => lib.skill.staraoshi.subSkill.global.filterTarget(null, player, target));
				},
				filterTarget(card, player, target) {
					return target != player && target.hasZhuSkill("staraoshi");
				},
				prompt() {
					const player = get.event("player");
					const targets = game.filterPlayer(target => lib.skill.staraoshi.subSkill.global.filterTarget(null, player, target));
					return "交给" + get.translation(targets) + (targets.length > 1 ? "中的一人" : "") + "一张手牌，然后其可以发动一次【纵势】";
				},
				filterCard: true,
				check(card) {
					const player = get.event("player");
					const target = game
						.filterPlayer(target => {
							return lib.skill.staraoshi.subSkill.global.filterTarget(null, player, target);
						})
						.sort((a, b) => b.countCards("h") - a.countCards("h"))[0];
					return target.getUseValue(card);
				},
				discard: false,
				lose: false,
				delay: false,
				usable: 1,
				async content(event, trigger, player) {
					const target = event.target,
						info = get.info("starzongshi");
					await player.give(event.cards, target);
					const {
						result: { bool, cards },
					} = await target
						.chooseCard(info.position, (card, player) => {
							return get.event("info").filterCard(card, player);
						})
						.set("info", info)
						.set("ai", card => get.event("info").check(card))
						.set("selectCard", [1, 2])
						.set("complexCard", true)
						.set("prompt", get.prompt("starzongshi"))
						.set("prompt2", lib.translate.starzongshi_info.slice(8).slice(0, -1));
					if (bool) {
						target.useResult({ skill: "starzongshi", cards: cards }, event);
					}
				},
				ai: {
					order: 9,
					result: {
						target(player, target) {
							return target.countCards("h") + 1;
						},
					},
				},
			},
		},
	},
	//星董卓
	starweilin: {
		audio: 2,
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			if (_status.currentPhase !== player) {
				return false;
			}
			return !event.player.getHistory("damage").length && player.getHistory("useCard").length >= event.player.getHp();
		},
		forced: true,
		logTarget: "player",
		content() {
			trigger.num++;
		},
	},
	starzhangrong: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.getHp() > 0;
		},
		direct: true,
		*content(event, map) {
			var player = map.player;
			var str = get.cnNumber(player.getHp());
			var choiceList = ["令至多" + str + "名体力值大于等于你的角色各失去1点体力", "令至多" + str + "名手牌数大于等于你的角色各弃置一张手牌"],
				list = ["cancel2"];
			if (
				game.hasPlayer(target => {
					if (target == player) {
						return player.countCards("h", card => lib.filter.cardDiscardable(card, player));
					}
					return target.countCards("h") >= Math.max(1, player.countCards("h"));
				})
			) {
				list.unshift("弃牌");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			list.unshift("扣血");
			var result = yield player
				.chooseControl(list)
				.set("prompt", "###" + get.prompt("starzhangrong") + "###选择其中一项令任意名符合条件的角色执行，然后你摸等量的牌，回合结束时，若这些角色中有本回合未受到过伤害的角色，则你失去1点体力")
				.set("ai", () => {
					var player = _status.event.player;
					var controls = _status.event.controls.slice();
					/*
				var cards=player.getCards('hes',card=>get.tag(card,'damage')&&player.hasValueTarget(card));
				var cardx=cards.filter(card=>get.name(card)=='sha');
				cardx.sort((a,b)=>player.getUseValue(b)-player.getUseValue(a));
				cardx=cardx.slice(Math.min(cardx.length,player.getCardUsable('sha')),cardx.length);
				cards.removeArray(cardx);
				*/
					var targets1 = game.filterPlayer(target => get.attitude(player, target) < 0 && target.getHp() >= player.getHp() && get.effect(target, { name: "losehp" }, player, player) > 0 /*&&cards.some(card=>player.canUse(card,target))*/);
					_status.starzhangrong_check = true;
					var targets2 = game.filterPlayer(target => get.attitude(player, target) < 0 && target.countCards("h") >= Math.max(1, player.countCards("h")) && get.effect(target, { name: "guohe_copy2" }, player, player) > 0 /*&&cards.some(card=>player.canUse(card,target))*/);
					delete _status.starzhangrong_check;
					[targets1, targets2].forEach(list => {
						list.sort((a, b) => get.damageEffect(b) - get.damageEffect(a));
						list = list.slice(0, Math.min(player.getHp() /*,cards.length*/));
					});
					if (!controls.includes("弃牌")) {
						return 1 - get.sgn(targets1.length);
					}
					return Math.max(0, get.sgn(targets2.length - targets1.length));
				})
				.set("choiceList", choiceList);
			if (result.control != "cancel2") {
				var choice = result.index;
				var result2 = yield player
					.chooseTarget([1, player.getHp()], "请选择【掌戎】的目标", "令至多" + str + "名" + (choice ? "手牌数" : "体力值") + "大于你的角色各" + (choice ? "弃置一张手牌" : "失去1点体力"), (card, player, target) => {
						var name = _status.event.card.name;
						if (name == "guohe_copy2") {
							if (target == player) {
								return player.countCards("h", card => lib.filter.cardDiscardable(card, player));
							}
							return target.countCards("h") >= Math.max(1, player.countCards("h"));
						}
						return target.getHp() >= player.getHp();
					})
					.set("ai", target => {
						var player = _status.event.player;
						if (get.attitude(player, target) >= 0) {
							return 0;
						}
						return get.effect(target, _status.event.card, player, player);
					})
					.set("card", { name: choice ? "guohe_copy2" : "losehp" });
				if (result2.bool) {
					var targets = result2.targets.sortBySeat();
					player.logSkill("starzhangrong", targets);
					targets.forEach(target => {
						target.addTempSkill("starzhangrong_threaten");
						if (choice) {
							target.chooseToDiscard("h", true);
						} else {
							target.loseHp();
						}
					});
					player.draw(targets.length);
					player
						.when("phaseEnd")
						.then(() => {
							targets.forEach(target => target.removeSkill("starzhangrong_threaten"));
							var targetx = targets.filter(target => !target.getHistory("damage").length);
							if (targetx.length) {
								targetx.forEach(target => target.chat("乐"));
								player.popup("杯具");
								player.loseHp();
								return;
							}
							player.popup("洗具");
						})
						.vars({ targets: targets });
				}
			}
		},
		global: "starzhangrong_check",
		subSkill: {
			check: {
				mod: {
					canBeDiscarded(card, player, target) {
						if (!_status.starzhangrong_check) {
							return;
						}
						if (player.hasSkill("starzhangrong") && get.position(card) != "h") {
							return false;
						}
					},
				},
			},
			threaten: {
				charlotte: true,
				trigger: { player: "damageEnd" },
				firstDo: true,
				forced: true,
				popup: false,
				content() {
					player.removeSkill("starzhangrong_threaten");
				},
				ai: { threaten: 114514 + 1919810 },
				mark: true,
				markimage: "image/card/sha.png",
				intro: { content: "我还没受到伤害哟！" },
			},
		},
	},
	starhaoshou: {
		audio: 2,
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			return event.player != player && event.card.name == "jiu" && player.isDamaged() && event.player.group == "qun";
		},
		direct: true,
		zhuSkill: true,
		*content(event, map) {
			var player = map.player,
				target = map.trigger.player;
			var result = yield target.chooseBool(get.prompt("starhaoshou", player), "令" + get.translation(player) + "回复1点体力").set("choice", get.recoverEffect(player, target, target) > 0);
			if (result.bool) {
				target.line(player);
				player.logSkill("starhaoshou");
				player.recover(target);
			}
		},
		//global:'starhaoshou_global',
		subSkill: {
			global: {
				audio: "starhaoshou",
				forceaudio: true,
				filter(event, player) {
					if (
						!player.countCards("hes", card => {
							if (get.position(card) == "h" && _status.connectMode) {
								return true;
							}
							return get.name(card) == "jiu";
						})
					) {
						return false;
					}
					return event.type == "dying" && event.dying && event.dying != player && event.dying.hp <= 0 && event.dying.hasZhuSkill("starhaoshou") && player.group == "qun";
				},
				filterCard(card, player) {
					return get.name(card) == "jiu";
				},
				check: () => 1,
				viewAs: { name: "tao" },
				position: "hes",
				prompt() {
					return "将一张【酒】当作【桃】对" + get.translation(_status.event.dying) + "使用";
				},
				ai: {
					save: true,
					skillTagFilter(player, arg, target) {
						if (
							!player.countCards("hes", card => {
								if (get.position(card) == "h" && _status.connectMode) {
									return true;
								}
								return get.name(card) == "jiu";
							}) ||
							player == target ||
							!target.hasSkill("starhaoshou") ||
							player.group != "qun"
						) {
							return false;
						}
					},
				},
			},
		},
	},
	//星袁术
	starcanxi: {
		audio: 2,
		trigger: {
			global: ["phaseBefore", "roundStart"],
			player: "enterGame",
		},
		filter(event, player, name) {
			if (name == "roundStart") {
				return player.getSkills().some(skill => skill.indexOf("starcanxi_") == 0);
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		content() {
			"step 0";
			if (event.triggername != "roundStart") {
				var list = game.filterPlayer().reduce((list, target) => list.add(target.group), []);
				list.sort((a, b) => lib.group.indexOf(a) - lib.group.indexOf(b));
				let lacks = lib.group.filter(group => group != "shen" && !list.includes(group));
				list.forEach(group => lib.skill.starcanxi.create(group, player));
				if (lacks.length) {
					player.gainMaxHp(lacks.length);
				}
				event.finish();
				return;
			}
			"step 1";
			var groups = player.getSkills().filter(skill => skill.indexOf("starcanxi_") == 0);
			groups = groups.map(group => group.slice(10));
			groups.sort((a, b) => lib.group.indexOf(a) - lib.group.indexOf(b));
			event.map = groups;
			player
				.chooseButton(
					[
						'###残玺###<div class="text center">请选择势力和效果</div>',
						[groups.map(group => [group, lib.translate[group + "2"] || lib.translate[group]]), "tdnodes"],
						[
							[
								["wangsheng", '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【妄生】</div><div>被选择势力角色每回合首次造成的伤害+1且计算与其他角色间的距离-1</div></div>'],
								["xiangsi", '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【向死】</div><div>其他被选择势力角色每回合首次回复体力后失去1点体力且每回合对你使用的第一张牌无效</div></div>'],
							],
							"textbutton",
						],
					],
					2,
					true
				)
				.set("filterButton", function (button) {
					var list = ["wangsheng", "xiangsi"];
					if (!ui.selected.buttons.length) {
						return true;
					}
					return list.includes(ui.selected.buttons[0].link) != list.includes(button.link);
				})
				.set("ai", function (button) {
					var player = _status.event.player;
					var map = _status.event.map,
						list = ["wangsheng", "xiangsi"];
					var getNum = function (group, effect) {
						var num = 0,
							sgn = effect == "wangsheng" ? 1.05 : -1;
						game.countPlayer(function (current) {
							if (!(current == player && sgn == -1) && current.group == group) {
								num += get.sgn(get.attitude(player, current)) * sgn;
							}
						});
						return num;
					};
					var listx = [];
					map.forEach(group => list.forEach(effect => listx.add([group, effect])));
					listx.sort((a, b) => getNum(b[0], b[1]) - getNum(a[0], a[1]));
					if (button.link == listx[0][0] || button.link == listx[0][1]) {
						return 1;
					}
					return 0;
				})
				.set("map", groups);
			"step 2";
			if (result.bool) {
				if (!event.map.includes(result.links[0])) {
					result.links.reverse();
				}
				var group = result.links[0];
				var skill = "starcanxi_" + result.links[1];
				var str = lib.translate[group + "2"] || lib.translate[group];
				player.popup([str, skill]);
				game.log(player, "选择了", "#g" + str, "、", "#y" + get.translation(skill));
				player.addTempSkill(skill, "roundStart");
				player.markAuto(skill, [group]);
			}
		},
		create(group, player) {
			const skill = "starcanxi_" + group;
			get.info("starcanxi").createSkill(skill);
			if (!_status.postReconnect.starcanxi) {
				_status.postReconnect.starcanxi = [get.info("starcanxi").createSkill, []];
			}
			_status.postReconnect.starcanxi[1].add(skill);
			player.addSkill(skill);
		},
		createSkill(skill) {
			if (!lib.skill[skill]) {
				game.broadcastAll(skill => {
					const group = skill.slice("starcanxi_".length);
					lib.skill[skill] = {
						mark: true,
						charlotte: true,
						onremove(player) {
							player.addMark("starpizhi", 1, false);
						},
						intro: { content: "玉玺的一角" },
					};
					lib.translate[skill] = "残玺·" + get.translation(group + "2");
					lib.skill[skill].marktext = get.translation(group);
					lib.translate[skill + "_bg"] = get.translation(group);
				}, skill);
			}
		},
		subSkill: {
			wangsheng: {
				charlotte: true,
				onremove: true,
				trigger: { global: "damageBegin1" },
				filter(event, player) {
					if (!event.source || !player.getStorage("starcanxi_wangsheng").includes(event.source.group)) {
						return false;
					}
					return !event.source.getHistory("sourceDamage").length;
				},
				forced: true,
				logTarget: "source",
				content() {
					trigger.num++;
				},
				group: "starcanxi_remove",
				global: "starcanxi_effect",
				intro: { content: "$势力角色每回合首次造成的伤害+1且计算与其他角色间的距离-1" },
			},
			xiangsi: {
				charlotte: true,
				onremove: true,
				trigger: { global: "recoverEnd" },
				filter(event, player) {
					if (!player.getStorage("starcanxi_xiangsi").includes(event.player.group) || event.player == player) {
						return false;
					}
					return (
						game
							.getGlobalHistory("changeHp", function (evt) {
								return evt.getParent().name == "recover" && evt.player == event.player;
							})
							.map(evt => evt.getParent())
							.indexOf(event) === 0
					);
				},
				forced: true,
				logTarget: "player",
				content() {
					trigger.player.loseHp();
				},
				group: ["starcanxi_remove", "starcanxi_cancel"],
				global: "starcanxi_effect",
				intro: { content: "其他$势力角色每回合首次回复体力后失去1点体力且每回合对你使用的第一张牌无效" },
			},
			cancel: {
				charlotte: true,
				trigger: { global: "useCard" },
				filter(event, player) {
					if (!event.targets || !event.targets.includes(player) || !player.getStorage("starcanxi_xiangsi").includes(event.player.group) || event.player == player) {
						return false;
					}
					return event.player.getHistory("useCard", evt => evt.targets && evt.targets.includes(player)).indexOf(event) == 0;
				},
				forced: true,
				logTarget: "player",
				content() {
					trigger.excluded.add(player);
				},
			},
			effect: {
				mod: {
					globalFrom(from, to, distance) {
						if (game.hasPlayer(target => target.getStorage("starcanxi_wangsheng").includes(from.group))) {
							return distance - 1;
						}
					},
				},
				ai: {
					effect: {
						player(card, player, target) {
							if (get.itemtype(card) !== "card" || !player || !target) {
								return;
							}
							var targets = game.filterPlayer(targetx => targetx != player && targetx.getStorage("starcanxi_xiangsi").includes(player.group));
							if (!targets.length) {
								return;
							}
							if (get.tag(card, "recover") && target == player && target.hp > 2) {
								return 0;
							}
							if (get.tag(card, "damage") && targets.includes(target)) {
								return 0.5;
							}
						},
					},
				},
			},
			remove: {
				charlotte: true,
				trigger: { player: "die" },
				forced: true,
				popup: false,
				firstDo: true,
				forceDie: true,
				content() {
					player.removeSkill("starcanxi_wangsheng");
					player.removeSkill("starcanxi_xiangsi");
				},
			},
		},
	},
	starpizhi: {
		audio: 2,
		trigger: { player: "phaseEnd", global: "die" },
		filter(event, player) {
			if (event.name == "phase") {
				return player.hasMark("starpizhi");
			}
			if (!game.hasPlayer(current => current != event.player && current.group == event.player.group)) {
				return true;
			}
			if (!player.getStorage("starcanxi_wangsheng").includes(event.player.group) && !player.getStorage("starcanxi_xiangsi").includes(event.player.group)) {
				return false;
			}
			var groups = player.getSkills().filter(skill => skill.indexOf("starcanxi_") == 0);
			groups = groups.map(group => group.slice(10));
			return groups.includes(event.player.group);
		},
		forced: true,
		content() {
			"step 0";
			if (trigger.name == "die") {
				var skills = player.getSkills().filter(skill => skill.indexOf("starcanxi_") == 0 && skill.slice(10) == trigger.player.group);
				player.removeSkill(skills);
			}
			"step 1";
			player.draw(player.countMark("starpizhi"));
			"step 2";
			if (player.isDamaged() && trigger.name == "die") {
				player.recover();
			}
		},
		intro: { content: "已失去#个“玺角”" },
		ai: { combo: "starcanxi" },
	},
	starzhonggu: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed;
		},
		forced: true,
		zhuSkill: true,
		content() {
			var num = game.roundNumber >= game.countPlayer(current => current.group == "qun") ? 2 : -1;
			trigger.num += num;
		},
	},
	//星曹仁
	starsujun: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			return player.countCards("h", { type: "basic" }) * 2 == player.countCards("h");
		},
		frequent: true,
		locked: false,
		content() {
			player.draw(2);
		},
		mod: {
			aiOrder(player, card, num) {
				var num = player.countCards("h") - 2 * player.countCards("h", { type: "basic" });
				if (Math.abs(num) != 1) {
					return;
				}
				if (num == 1 && get.type(card) != "basic") {
					return num + 10;
				}
				if (num == -1 && get.type(card) == "basic") {
					return num + 10;
				}
			},
		},
	},
	starlifeng: {
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			if (!event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event) && !event.filterCard(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event)) {
				return false;
			}
			return player.hasCard(card => {
				return !player.getStorage("starlifeng_count").includes(get.color(card, player));
			}, "hs");
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				if (event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event)) {
					list.push(["基本", "", "sha"]);
				}
				if (event.filterCard(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event)) {
					list.push(["锦囊", "", "wuxie"]);
				}
				const dialog = ui.create.dialog("砺锋", [list, "vcard"]);
				dialog.direct = true;
				return dialog;
			},
			check(button) {
				var player = _status.event.player;
				return _status.event.getParent().type == "phase" ? player.getUseValue({ name: button.link[2] }) : 1;
			},
			backup(links, player) {
				return {
					filterCard(card, player) {
						return !player.getStorage("starlifeng_count").includes(get.color(card, player));
					},
					precontent() {
						player.logSkill("starlifeng");
						event.getParent().addCount = false;
					},
					log: false,
					popname: true,
					viewAs: {
						name: links[0][2],
					},
					ai1(card) {
						var player = _status.event.player;
						var num = player.countCards("h") - 2 * player.countCards("h", { type: "basic" });
						if (player.hasSkill("starsujin") && Math.abs(num) == 1) {
							if (num == 1 && get.type(card) != "basic") {
								return 15 - get.value(card);
							}
							if (num == -1 && get.type(card) == "basic") {
								return 15 - get.value(card);
							}
						}
						return 7 - get.value(card);
					},
				};
			},
			prompt(links) {
				return "将一张本回合未使用过的颜色的手牌当做【" + get.translation(links[0][2]) + "】使用";
			},
		},
		hiddenCard(player, name) {
			if (name == "wuxie") {
				return player.countCards("hs", card => {
					return !player.getStorage("starlifeng_count").includes(get.color(card, player)) || _status.connectMode;
				});
			}
		},
		ai: {
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") {
					return false;
				}
				if (
					!player.countCards("hs", card => {
						return !player.getStorage("starlifeng_count").includes(get.color(card, player)) || _status.connectMode;
					})
				) {
					return false;
				}
			},
			order: 10,
			result: { player: 1 },
		},
		group: "starlifeng_mark",
		subSkill: {
			mark: {
				charlotte: true,
				trigger: { global: "useCard1" },
				filter(event, player) {
					return !player.getStorage("starlifeng_count").includes(get.color(event.card));
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player.addTempSkill("starlifeng_count");
					player.markAuto("starlifeng_count", [get.color(trigger.card)]);
				},
			},
			count: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//星孙尚香
	starsaying: {
		audio: 2,
		enable: "chooseToUse",
		hiddenCard(player, name) {
			if (player.getStorage("starsaying").includes(name)) {
				return false;
			}
			if (["shan", "sha"].includes(name)) {
				return player.countCards("hs", card => get.type(card) == "equip" && player.canEquip(card, true));
			}
			if (["tao", "jiu"].includes(name)) {
				return player.countCards("e");
			}
		},
		filter(event, player) {
			for (var name of ["shan", "sha"]) {
				if (player.getStorage("starsaying").includes(name)) {
					continue;
				}
				if (!player.countCards("hs", card => get.type(card) == "equip" && player.canEquip(card, true))) {
					continue;
				}
				if (event.filterCard({ name: name, isCard: true }, player, event)) {
					return true;
				}
			}
			for (var name of ["tao", "jiu"]) {
				if (player.getStorage("starsaying").includes(name)) {
					continue;
				}
				if (!player.countCards("e")) {
					continue;
				}
				if (event.filterCard({ name: name, isCard: true }, player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of ["shan", "sha"]) {
					if (player.getStorage("starsaying").includes(name)) {
						continue;
					}
					if (!player.countCards("hs", card => get.type(card) == "equip" && player.canEquip(card, true))) {
						continue;
					}
					if (event.filterCard({ name: name, isCard: true }, player, event)) {
						list.push(["基本", "", name]);
					}
				}
				for (var name of ["tao", "jiu"]) {
					if (player.getStorage("starsaying").includes(name)) {
						continue;
					}
					if (!player.countCards("e")) {
						continue;
					}
					if (event.filterCard({ name: name, isCard: true }, player, event)) {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("飒影", [list, "vcard"], "hidden");
			},
			check(button) {
				var player = _status.event.player;
				var card = { name: button.link[2], isCard: true };
				return player.getUseValue(card);
			},
			backup(links, player) {
				return {
					check(card) {
						return 1 / Math.max(0.1, get.value(card));
					},
					filterCard(card) {
						let bool = ["sha", "shan"].includes(links[0][2]);
						if (bool) {
							return get.position(card) != "e" && get.type(card) == "equip" && player.canEquip(card, true);
						}
						return get.position(card) == "e";
					},
					position: "hes",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						suit: "none",
						number: null,
						isCard: true,
					},
					popname: true,
					ignoreMod: true,
					precontent() {
						player.logSkill("starsaying");
						var card = event.result.cards[0];
						player.$give(card, player, false);
						if (["sha", "shan"].includes(event.result.card.name)) {
							player.equip(card);
						} else {
							player.gain(card, "gain2");
						}
						var viewAs = {
							name: event.result.card.name,
							nature: event.result.card.nature,
						};
						event.result.card = viewAs;
						event.result.cards = [];
						if (!player.storage.starsaying) {
							player.when({ global: "roundStart" }).then(() => {
								delete player.storage.starsaying;
							});
						}
						player.markAuto("starsaying", viewAs.name);
					},
				};
			},
			prompt(links, player) {
				var str = ["sha", "shan"].includes(links[0][2]) ? "使用一张装备牌" : "获得装备区里的一张牌";
				return str + "，视为使用" + get.translation(links[0][3] || "") + get.translation(links[0][2]);
			},
		},
		ai: {
			order() {
				var player = _status.event.player;
				var event = _status.event;
				if (event.filterCard({ name: "jiu" }, player, event) && get.effect(player, { name: "jiu" }) > 0) {
					return 6.3;
				}
				return 6.1;
			},
			skillTagFilter(player, tag, arg) {
				let name = tag == "respondSha" ? "sha" : "shan";
				if (player.getStorage("starsaying").includes(name)) {
					return false;
				}
				if (!player.countCards("hs", card => get.type(card) == "equip" && player.canEquip(card, true))) {
					return false;
				}
			},
			result: {
				player: 1,
			},
			respondSha: true,
			respondShan: true,
		},
	},
	starjiaohao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") && game.hasPlayer(current => lib.skill.starjiaohao.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target) && player.countCards("e") >= target.countCards("e");
		},
		async content(event, trigger, player) {
			const target = event.target;
			const result = await player.chooseToCompare(target).forResult();
			if (result.winner) {
				const cards = [result.player, result.target].filterInD("d");
				const result2 = await player
					.chooseControl("cancel2")
					.set("choiceList", ["令" + get.translation(result.winner) + "获得" + (cards.length ? get.translation(cards) : "空气"), "令" + get.translation(result.winner) + "使用一张杀"])
					.set("ai", function () {
						return _status.event.check;
					})
					.set(
						"check",
						(function () {
							if (get.attitude(player, result.winner) <= 0) {
								return "cancel2";
							}
							if (
								!game.hasPlayer(current => {
									return result.winner.canUse({ name: "sha" }, current, false) && get.effect(current, { name: "sha" }, result.winner, result.winner) > 0;
								}) ||
								!cards.length
							) {
								return "选项一";
							}
							let eff1 = result.winner.getUseValue({ name: "sha" }),
								eff2 = 0;
							for (let card of cards) {
								eff2 += get.value(card, result.winner);
							}
							if (eff1 > eff2 * 2.5) {
								return "选项二";
							}
							return "选项一";
						})()
					)
					.forResult();
				switch (result2.control) {
					case "选项二": {
						const next = result.winner
							.chooseToUse("是否使用一张杀？", { name: "sha" })
							.set("filterTarget", function (card, player, target) {
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("addCount", false);
						await next;
						break;
					}
					case "选项一": {
						await result.winner.gain(cards, "gain2");
						break;
					}
				}
			}
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					var hs = player.getCards("h").sort(function (a, b) {
						return b.number - a.number;
					});
					var ts = target.getCards("h").sort(function (a, b) {
						return b.number - a.number;
					});
					if (!hs.length || !ts.length) {
						return 0;
					}
					if (hs[0].number <= ts[0].number) {
						return 2;
					}
					if (player.countCards("h") >= target.countCards("h")) {
						return -10;
					}
					return -1;
				},
			},
		},
	},
	//十周年嵇康
	dcjuexiang: {
		derivation: "dccanyun",
		audio: "juexiang",
		trigger: { player: "die" },
		forced: true,
		locked: false,
		forceDie: true,
		skillAnimation: true,
		animationColor: "water",
		content() {
			"step 0";
			if (trigger.source && trigger.source.isIn()) {
				trigger.source.discard(trigger.source.getCards("e"));
				trigger.source.loseHp();
			}
			"step 1";
			player
				.chooseTarget("绝响：是否令一名其他角色获得技能〖残韵〗？", lib.filter.notMe)
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				})
				.set("forceDie", true);
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "thunder");
				target.addSkills("dccanyun");
			}
		},
	},
	dccanyun: {
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(function (target) {
				return lib.skill.dccanyun.filterTarget(null, player, target);
			});
		},
		filterTarget(card, player, target) {
			var list = [player];
			player.getAllHistory("useSkill", function (evt) {
				if (evt.skill == "dccanyun") {
					list.addArray(evt.targets);
				}
			});
			return !list.includes(target) && !ui.selected.targets.length;
		},
		selectTarget: [1, 2],
		targetprompt(target) {
			var pe = _status.event.player.countCards("e", function (card) {
				return ui.selected.cards.includes(card) == false;
			});
			var te = target.countCards("e");
			if (pe > te) {
				return "回复体力";
			} else if (pe == te) {
				return "摸一张牌";
			} else if (pe < te) {
				return "失去体力";
			}
		},
		filterCard: true,
		position: "he",
		check(cardx) {
			var player = _status.event.player;
			var number = game.countPlayer(function (target) {
				if (player == target) {
					return false;
				}
				var pe = player.countCards("e", function (card) {
					return card != cardx && ui.selected.cards.includes(card) == false;
				});
				var te = target.countCards("e");
				if (pe > te && target.isDamaged() && get.attitude(player, target) > 2) {
					return true;
				} else if (pe < te && get.attitude(player, target) < 0) {
					return true;
				}
				return false;
			});
			if (ui.selected.cards.length < number) {
				return 6 - get.value(cardx);
			} else {
				return 0;
			}
		},
		usable: 1,
		content() {
			var pe = player.countCards("e");
			var te = target.countCards("e");
			if (pe > te) {
				target.recover();
			} else if (pe == te) {
				target.draw();
			} else if (pe < te) {
				target.loseHp();
			}
		},
		contentAfter() {
			if (player.hp == 1) {
				player.draw();
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					var pe = player.countCards("e");
					var te = target.countCards("e");
					if (pe > te && target.isDamaged()) {
						return 2;
					} else if (pe == te) {
						return 1;
					} else if (pe < te) {
						return -2.5;
					} else {
						return 0;
					}
				},
			},
		},
	},
	//董翓
	dcjiaoxia: {
		mod: {
			cardUsableTarget(card, player, target) {
				if (!player.isPhaseUsing()) {
					return;
				}
				if (card.name == "sha" && !player.getStorage("dcjiaoxia_mark").includes(target)) {
					return true;
				}
			},
			targetInRange(card, player, target) {
				if (!player.isPhaseUsing()) {
					return;
				}
				if (card.name == "sha" && !player.getStorage("dcjiaoxia_mark").includes(target)) {
					return true;
				}
			},
		},
		audio: 2,
		locked: false,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h");
		},
		check(event, player) {
			return player.countCards("h", card => {
				return game.hasPlayer(target => {
					var cardx = get.autoViewAs({ name: "sha" }, [card]);
					return player.canUse(cardx, target) && get.effect(target, cardx, player, player) > 0 && (!player.hasUseTarget(card) || player.hasValueTarget(card));
				});
			});
		},
		content() {
			var cards = player.getCards("h");
			player.addTempSkill("dcjiaoxia_viewas", "phaseUseAfter");
			player.addGaintag(cards, "dcjiaoxia_viewas");
		},
		group: "dcjiaoxia_load",
		subSkill: {
			load: {
				charlotte: true,
				trigger: { player: "useCard1" },
				filter(event, player) {
					if (!player.isPhaseUsing()) {
						return false;
					}
					return event.card.name == "sha" && event.targets && event.targets.some(target => !player.getStorage("dcjiaoxia_mark").includes(target));
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						trigger.player.getStat().card.sha--;
					}
					player.addTempSkill("dcjiaoxia_mark", "phaseUseAfter");
					player.markAuto(
						"dcjiaoxia_mark",
						trigger.targets.filter(target => !player.getStorage("dcjiaoxia_mark").includes(target))
					);
				},
			},
			mark: {
				charlotte: true,
				onremove: true,
			},
			viewas: {
				mod: {
					aiOrder(player, card, num) {
						if (get.itemtype(card) == "card" && card.hasGaintag("dcjiaoxia_viewas")) {
							return num + 1;
						}
					},
					cardname(card, player) {
						if (get.itemtype(card) == "card" && card.hasGaintag("dcjiaoxia_viewas")) {
							return "sha";
						}
					},
				},
				charlotte: true,
				onremove(player) {
					player.removeGaintag("dcjiaoxia_viewas");
				},
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return (
						event.cards &&
						event.cards.length == 1 &&
						player.hasUseTarget(get.copy(event.cards[0])) &&
						player.getHistory("lose", evt => {
							if (evt.getParent() != event) {
								return false;
							}
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("dcjiaoxia_viewas")) {
									return true;
								}
							}
							return false;
						}).length &&
						player.getHistory("sourceDamage", evt => evt.card == event.card).length &&
						player.hasUseTarget(event.cards[0])
					);
				},
				direct: true,
				content() {
					player.chooseUseTarget(trigger.cards[0], get.prompt("dcjiaoxia"), false, false).set("prompt2", "使用" + get.translation(trigger.cards[0])).logSkill = "dcjiaoxia";
				},
			},
		},
	},
	dchumei: {
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
		onChooseToUse(event) {
			if (!game.online && !event.dchumei_num) {
				var player = event.player;
				var evtx = event.getParent("phaseUse");
				event.set(
					"dchumei_num",
					player
						.getHistory("sourceDamage", evt => {
							return evt.getParent("phaseUse") == evtx;
						})
						.reduce((sum, evt) => sum + evt.num, 0)
				);
			}
		},
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (typeof event.dchumei_num != "number") {
				return false;
			}
			return game.hasPlayer(target => lib.skill.dchumei.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			if (target.getHp() > _status.event.dchumei_num) {
				return false;
			}
			const list = player.getStorage("dchumei_used");
			if (!list.includes("draw")) {
				return true;
			}
			if (!list.includes("give") && target.countCards("he")) {
				return true;
			}
			if (!list.includes("recover") && target.isDamaged()) {
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			var str = get.translation(target);
			player
				.chooseButton(
					[
						"狐魅：请选择一项",
						[
							[
								["draw", "令" + str + "摸一张牌"],
								["give", "令" + str + "交给你一张牌"],
								["recover", "令" + str + "回复1点体力"],
							].filter(list => {
								if (player.getStorage("dchumei_used").includes(list[0])) {
									return false;
								}
								if (list[0] == "give" && !target.countCards("he")) {
									return false;
								}
								if (list[0] == "recover" && target.isHealthy()) {
									return false;
								}
								return true;
							}),
							"textbutton",
						],
					],
					true
				)
				.set("filterButton", button => {
					const { player, target } = get.event();
					if (player.getStorage("dchumei_used").includes(button.link)) {
						return false;
					}
					if (button.link == "give" && !target.countCards("he")) {
						return false;
					}
					if (button.link == "recover" && target.isHealthy()) {
						return false;
					}
					return true;
				})
				.set("ai", function (button) {
					let target = _status.event.target;
					switch (button.link) {
						case "draw": {
							return get.effect(target, { name: "draw" }, player, player);
						}
						case "give": {
							return get.effect(target, { name: "shunshou_copy2" }, player, player);
						}
						case "recover": {
							return get.recoverEffect(target, player, player);
						}
					}
					return 0;
				})
				.set("target", target);
			"step 1";
			if (result.bool) {
				player.addTempSkill("dchumei_used", "phaseUseAfter");
				player.markAuto("dchumei_used", result.links);
				switch (result.links[0]) {
					case "draw":
						target.draw();
						break;
					case "give":
						target.chooseCard("狐魅：交给" + get.translation(player) + "一张牌", "he", true);
						break;
					case "recover":
						target.recover();
						break;
				}
				if (result.links[0] != "give") {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.gain(result.cards, target, "giveAuto");
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					const list = player.getStorage("dchumei_used");
					if (!list.includes("draw")) {
						return 1;
					}
					if (!list.includes("give")) {
						return -1;
					}
					if (!list.includes("recover")) {
						return 1;
					}
				},
			},
		},
	},
	//魏关羽
	dcdanji: {
		audio: "danji",
		skillAnimation: true,
		animationColor: "water",
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		derivation: ["mashu", "dcnuchen"],
		filter(event, player) {
			return player.countCards("hej") > player.getHp();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp();
			const num = player.maxHp - player.hp;
			if (num) {
				await player.recover(num);
				await player.draw(num);
			}
			await player.addSkills(["mashu", "dcnuchen"]);
		},
		ai: {
			maixie: true,
			skillTagFilter: (player, tag, arg) => {
				if (tag === "maixie") {
					return player.hp >= 2 && !player.storage.dcdanji && !player.hasSkill("dcnuchen") && player.countCards("h") === player.hp;
				}
			},
			effect: {
				target: (card, player, target) => {
					let hs = target.countCards("h");
					if (target.hp < 3 || target.storage.dcdanji || target.hasSkill("dcnuchen") || hs > target.hp + 1) {
						return;
					}
					if (get.tag(card, "draw")) {
						return 1.6;
					}
					if (get.tag(card, "lose") || get.tag(card, "discard")) {
						return [1, -0.8];
					}
					if (hs === target.hp && get.tag(card, "damage")) {
						return [1, target.hp / 3];
					}
					if (hs > target.hp && target.hp > 3 && (card.name === "shan" || card.name === "wuxie")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	dcnuchen: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countCards("h") && target != player;
		},
		content() {
			"step 0";
			player.choosePlayerCard(target, true, "h");
			"step 1";
			if (result.bool) {
				var card = result.cards[0];
				event.card = card;
				player.showCards(card, get.translation(player) + "对" + get.translation(target) + "发动了【怒嗔】");
			} else {
				event.finish();
			}
			"step 2";
			var suit = get.suit(card);
			var str = get.translation(suit);
			player
				.chooseToDiscard("怒嗔：是否弃置至少一张" + str + "牌？", "若如此做，你对其造成等量伤害；或点击“取消”，获得其所有" + str + "手牌", "he", { suit: suit }, [1, Infinity])
				.set("ai", card => {
					if (ui.selected.cards.length >= _status.event.num) {
						return 0;
					}
					return 6 - get.value(card);
				})
				.set(
					"num",
					(function () {
						var eff = get.damageEffect(target, player, player);
						if (eff > 0) {
							if (get.attitude(player, target) > 0) {
								return 1;
							}
							var cards = target.getCards("h", { suit: suit });
							if (cards.length > 2 || get.value(cards) >= 6) {
								return 0;
							}
							if (!player.hasSkillTag("jueqing", false, target) && target.hasSkillTag("filterDamage", null, { player: player })) {
								return 1;
							}
							return Infinity;
						}
						return 0;
					})()
				);
			"step 3";
			if (result.bool) {
				target.damage(result.cards.length);
			} else {
				var cards = target.getCards("h", { suit: get.suit(card) });
				if (cards.length) {
					player.gain(cards, target, "giveAuto", "bySelf");
				}
			}
		},
		ai: {
			expose: 0.4,
			order: 10,
			result: {
				target(player, target) {
					return -Math.sqrt(target.countCards("h"));
				},
			},
		},
	},
	//孟达
	dclibang: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		filter(event, player) {
			return (
				player.hasCard(function (card) {
					return lib.filter.cardDiscardable(card, player, "dclibang");
				}, "he") && game.countPlayer(current => current != player) >= 2
			);
		},
		filterTarget(card, player, target) {
			return target != player;
		},
		selectTarget: 2,
		multiline: true,
		multitarget: true,
		content() {
			"step 0";
			event.num = 0;
			event.cardsx = [];
			event.targets.sortBySeat();
			"step 1";
			var current = targets[event.num];
			if (current.countCards("he")) {
				player.gainPlayerCard(current, "he", true, "visibleMove");
			}
			event.num++;
			"step 2";
			if (result.bool) {
				var card = result.cards[0];
				event.cardsx.push(card);
			}
			if (event.num < targets.length) {
				event.goto(1);
			}
			"step 3";
			player.judge().set("callback", lib.skill.dclibang.contentx);
		},
		contentx() {
			"step 0";
			var card = event.judgeResult.card;
			var color = event.judgeResult.color;
			var player = event.getParent(2).player;
			var cards = event.getParent(2).cardsx;
			for (var cardx of cards) {
				if (get.color(cardx) == color) {
					if (get.position(card, true) == "o") {
						player.gain(card, "gain2");
					}
					return;
				}
			}
			event.goto(3);
			"step 1";
			var targets = event.getParent(2).targets.filter(target => {
				return player.canUse("sha", target);
			});
			if (!targets.length) {
				event.finish();
			} else {
				player
					.chooseTarget("利傍：视为对其中一名角色使用一张【杀】", true, (card, player, target) => {
						return _status.event.targets.includes(target);
					})
					.set("targets", targets)
					.set("ai", target => {
						return get.effect(target, { name: "sha" }, player, player);
					});
			}
			"step 2";
			if (result.bool) {
				player.useCard({ name: "sha", isCard: true }, result.targets[0], false);
			}
			event.finish();
			"step 3";
			player.chooseCardTarget({
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				filterTarget(card, player, target) {
					return _status.event.targets.includes(target);
				},
				selectCard: 2,
				targets: event.getParent(2).targets,
				position: "he",
				prompt: "交给其中一名角色两张牌，或失去1点体力",
				ai1(card) {
					return 1;
				},
				ai2(target) {
					var player = _status.event.player,
						card = ui.selected.cards[0];
					var val = get.value(card, target);
					if (val > 0) {
						return get.attitude(player, target) * 2;
					}
					return (val - 2) * get.attitude(player, target);
				},
			});
			"step 4";
			if (result.bool) {
				player.give(result.cards, result.targets[0]);
			} else {
				player.loseHp();
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (get.attitude(player, target) > 0 && ui.selected.targets.length) {
						return 0.1;
					}
					return -1;
				},
			},
		},
	},
	dcwujie: {
		audio: 2,
		trigger: {
			global: ["discardBegin", "drawBegin"],
		},
		forced: true,
		forceDie: true,
		group: "dcwujie_inf",
		logTarget: "player",
		filter(event, player) {
			return event.getParent().name == "die" && event.getParent().source == event.player && event.player != player && event.getParent().player == player;
		},
		content() {
			trigger.cancel();
		},
		subSkill: {
			inf: {
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if (get.color(event.card) == "none" && event.addCount !== false) {
						return true;
					}
					return false;
				},
				content() {
					trigger.addCount = false;
					var stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
				},
			},
		},
		mod: {
			targetInRange(card, player) {
				const color = get.color(card);
				if (color === "none" || color === "unsure") {
					return true;
				}
			},
			cardUsable(card) {
				const color = get.color(card);
				if (color === "none" || color === "unsure") {
					return Infinity;
				}
			},
		},
	},
	//关宁
	dcxiuwen: {
		audio: 2,
		trigger: { player: "useCard" },
		filter(event, player) {
			return !player.getStorage("dcxiuwen").includes(event.card.name);
		},
		frequent: true,
		content() {
			player.draw();
			player.markAuto("dcxiuwen", [trigger.card.name]);
		},
		intro: { content: "已使用：$" },
	},
	oldlongsong: {
		audio: "dclongsong",
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		getSkills(target, player, trigger) {
			return target.getSkills(null, false).filter(skill => {
				var skills = game.expandSkills([skill]);
				if (
					skills.filter(skillx => {
						var info = get.info(skillx);
						if (!info || !info.enable || (info.usable && !(info.usable >= 1))) {
							return false;
						}
						if (info.enable != "phaseUse" && (!Array.isArray(info.enable) || !info.enable.includes("phaseUse"))) {
							return false;
						}
						if (info.viewAs && info.usable && info.usable != 1) {
							return false;
						}
						if (info.juexingji || info.hiddenSkill || info.charlotte || info.limited || info.dutySkill) {
							return false;
						}
						if ((!info.usable || info.usable > 1) && info.filter) {
							try {
								var bool1 = info.filter(trigger, player);
								var num = player.getStat().skill[skillx];
								player.getStat().skill[skillx] = 1;
								var bool2 = info.filter(trigger, player);
								if (!num) {
									delete player.getStat().skill[skillx];
								} else {
									player.getStat().skill[skillx] = num;
								}
								var bool3 = !(bool1 && !bool2);
							} catch (e) {
								console.trace(e);
							}
							if (!bool1 && !bool2 && get.skillInfoTranslation(skill, player).indexOf("出牌阶段限一次") == -1) {
								return false;
							}
							if ((bool1 || bool2) && bool3) {
								return false;
							}
						}
						return true;
					}).length
				) {
					return true;
				}
				return false;
			});
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				filterCard: true,
				selectCard: 1,
				filterTarget(card, player, target) {
					return player != target;
				},
				ai1(card) {
					return 6 - get.value(card);
				},
				ai2(target) {
					var att = get.attitude(_status.event.player, target),
						trigger = _status.event.getTrigger(),
						player = _status.event.player;
					return lib.skill.oldlongsong.getSkills(target, player, trigger).length * 3 + att / 3;
				},
				prompt: get.prompt2("oldlongsong"),
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("oldlongsong", target);
				event.target = target;
				player.line(target, "green");
				player.give(result.cards, target);
				var skills = lib.skill.oldlongsong.getSkills(target, player, trigger);
				if (skills.length) {
					if (!event.isMine() && !event.isOnline()) {
						game.delayx();
					}
					target.disableSkill("oldlongsong_back", skills);
					target.markAuto("oldlongsong_back", skills);
					target.addTempSkill("oldlongsong_back", ["phaseUseAfter", "phaseAfter"]);
					var str = "";
					for (var i = 0; i < skills.length; i++) {
						str += "【" + get.translation(skills[i]) + "】";
						if (i != skills.length - 1) {
							str += "、";
						}
					}
					game.log(target, "的技能", "#g" + str, "失效了");
					// game.log(player,'获得了技能','#g'+str);
					for (var skill of skills) {
						player.addTempSkills(skill, ["phaseUseAfter", "phaseAfter"]);
					}
				}
			}
		},
		ai: { expose: 0.2 },
		subSkill: {
			back: {
				charlotte: true,
				onremove(player, skill) {
					var skills = player.getStorage("oldlongsong_back");
					for (var key of skills) {
						game.log(player, "恢复了技能", "#g【" + get.translation(key) + "】");
						delete player.storage[key];
					}
					player.enableSkill(skill);
					player.popup(skills, "thunder");
				},
			},
		},
	},
	dclongsong: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		getSkills(target, skills) {
			return (target && !skills ? target.getSkills(null, false) : skills).filter(skill => {
				var str = get.skillInfoTranslation(skill, target);
				if (str.indexOf("当你于出牌阶段") != -1) {
					return true;
				}
				var skills = game.expandSkills([skill]);
				if (
					skills.some(skillx => {
						var info = get.info(skillx);
						if (!info || !info.enable) {
							return false;
						}
						if (info.enable != "phaseUse" && info.enable != "chooseToUse" && (!Array.isArray(info.enable) || (!info.enable.includes("phaseUse") && !info.enable.includes("chooseToUse")))) {
							return false;
						}
						if (info.juexingji || info.hiddenSkill || info.charlotte || info.limited || info.dutySkill) {
							return false;
						}
						if (info.ai && info.ai.notemp) {
							return false;
						}
						return true;
					})
				) {
					return true;
				}
				return false;
			});
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				filterCard: { color: "red" },
				selectCard: 1,
				position: "he",
				filterTarget(card, player, target) {
					return player != target;
				},
				ai1(card) {
					return 6 - get.value(card);
				},
				ai2(target) {
					var att = get.attitude(_status.event.player, target);
					return lib.skill.dclongsong.getSkills(target).length * 2 + att / 2.5;
				},
				prompt: get.prompt2("dclongsong"),
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dclongsong", target);
				event.target = target;
				player.line(target, "green");
				player.give(result.cards, target);
				var skills = lib.skill.dclongsong.getSkills(target);
				if (skills.length) {
					if (!event.isMine() && !event.isOnline()) {
						game.delayx();
					}
					target.disableSkill("dclongsong_back", skills);
					target.markAuto("dclongsong_back", skills);
					player.addTempSkill("dclongsong_remove", ["phaseUseAfter", "phaseAfter"]);
					player.markAuto("dclongsong_remove", skills);
					target.addTempSkill("dclongsong_back", ["phaseUseAfter", "phaseAfter"]);
					var str = "";
					for (var i = 0; i < skills.length; i++) {
						str += "【" + get.translation(skills[i]) + "】";
						if (i != skills.length - 1) {
							str += "、";
						}
					}
					game.log(target, "的技能", "#g" + str, "失效了");
					// game.log(player,'获得了技能','#g'+str);
					for (var skill of skills) {
						player.addTempSkills(skill, ["phaseUseAfter", "phaseAfter"]);
					}
				}
			}
		},
		ai: { expose: 0.2 },
		subSkill: {
			back: {
				charlotte: true,
				onremove(player, skill) {
					var skills = player.getStorage("dclongsong_back");
					for (var key of skills) {
						game.log(player, "恢复了技能", "#g【" + get.translation(key) + "】");
						//delete player.storage[key];
					}
					player.enableSkill(skill);
					player.popup(skills, "thunder");
				},
			},
			remove: {
				trigger: { player: ["useSkill", "logSkillBegin"] },
				forced: true,
				charlotte: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					var skill = get.sourceSkillFor(event);
					return player.getStorage("dclongsong_remove").includes(skill) && !player.getStockSkills(false, true).includes(skill);
				},
				content() {
					"step 0";
					var skill = get.sourceSkillFor(trigger);
					player.removeSkills(skill);
					player.unmarkAuto("dclongsong_remove", [skill]);
				},
			},
		},
	},
	longsong: {
		audio: "dclongsong",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(target => {
				return target.hasCard(card => {
					if (get.position(card) == "h") {
						return true;
					}
					if (get.color(card) != "red") {
						return false;
					}
					if (player == target) {
						return true;
					}
					return lib.filter.canBeGained(card, player, target);
				}, "he");
			});
		},
		getSkills(skills, len) {
			skills = skills.filter(skill => {
				let str = get.skillInfoTranslation(skill, get.event().player);
				if (str.indexOf("当你于出牌阶段外") != -1) {
					return false;
				}
				if (str.indexOf("当你于出牌阶段") != -1) {
					return true;
				}
				let ss = game.expandSkills([skill]);
				if (
					ss.some(skillx => {
						let info = get.info(skillx);
						if (!info || !info.enable) {
							return false;
						}
						if (info.enable != "phaseUse" && info.enable != "chooseToUse" && (!Array.isArray(info.enable) || (!info.enable.includes("phaseUse") && !info.enable.includes("chooseToUse")))) {
							return false;
						}
						if (info.juexingji || info.hiddenSkill || info.charlotte || info.limited || info.dutySkill) {
							return false;
						}
						if (info.ai && info.ai.notemp) {
							return false;
						}
						return true;
					})
				) {
					return true;
				}
				return false;
			});
			if (len && !skills.length) {
				if (!_status.characterlist) {
					game.initCharactertList();
				}
				let allList = _status.characterlist.slice(0);
				allList.randomSort();
				for (const name of allList) {
					const curSkills = lib.character[name][3];
					const filteredSkills = lib.skill.longsong.getSkills(curSkills);
					if (filteredSkills.length > 0) {
						return filteredSkills.randomGets(1);
					}
				}
			}
			return skills;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterTarget(card, player, target) {
						if (target === player) {
							return false;
						}
						const skills = lib.skill.longsong.getSkills(target.getSkills(null, false)).map(skill => get.translation(skill));
						if (skills.length) {
							target.prompt(skills.join("<br>"));
						}
						return (
							ui.selected.cards.length ||
							target.hasCard(card => {
								return get.color(card) == "red" && lib.filter.canBeGained(card, player, target);
							}, "he")
						);
					},
					filterCard: { color: "red" },
					selectCard: [0, 1],
					multitarget: true,
					ai1(card) {
						const ai2 = get.event("ai2");
						if (
							game.hasPlayer(current => {
								return ai2(current) > 0;
							})
						) {
							return -1 - get.value(card);
						}
						return 6 - get.value(card);
					},
					ai2(target) {
						const player = get.event("player"),
							att = get.attitude(player, target);
						if (att > 0 && !target.getGainableCards(player, "he").some(card => get.color(card) == "red")) {
							return 0;
						}
						return lib.skill.longsong.getSkills(target.getSkills(null, false)).length + (att > 0 ? 0 : Math.max(0, get.effect(target, { name: "shunshou_copy2" }, player, player)));
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cards = event.cards,
				gainableCards = target.getGainableCards(player, "he").filter(card => get.color(card) == "red");
			if (cards) {
				await player.give(cards, target);
			} else {
				if (gainableCards.length) {
					let dialog = ["龙诵：获得" + get.translation(target) + "的一张红色牌"];
					let cards1 = gainableCards.filter(i => get.position(i) == "h"),
						cards2 = gainableCards.filter(i => get.position(i) == "e");
					if (cards1.length) {
						dialog.push('<div class="text center">手牌区</div>');
						if (player.hasSkillTag("viewHandcard", null, target, true)) {
							dialog.push(cards1);
						} else {
							dialog.push([cards1.randomSort(), "blank"]);
						}
					}
					if (cards2.length) {
						dialog.push('<div class="text center">装备区</div>');
						dialog.push(cards2);
					}
					const {
						result: { bool, links },
					} = await player.chooseButton(dialog, true).set("ai", button => {
						const player = get.event("player"),
							target = get.event().getParent().targets[0];
						return get.value(button.link, player) * get.value(button.link, target) * (1 + Math.random());
					});
					if (!bool) {
						return;
					}
					await player.gain(links, target, "giveAuto", "bySelf");
				} else {
					player.popup("杯具");
					player.chat("无牌可得？！");
					game.log("但是", target, "没有红色牌可被" + get.translation(player) + "获得！");
				}
			}
			let skills = lib.skill.longsong.getSkills(target.getSkills(null, false), true);
			if (!event.isMine() && !event.isOnline()) {
				await game.delayx();
			}
			if (!skills.length) {
				return;
			}
			let skill;
			if (skills.length == 1) {
				skill = skills[0];
			} else {
				skill = await player
					.chooseControl(skills)
					.set(
						"choiceList",
						skills.map(i => {
							return '<div class="skill">' + (lib.translate[i + "_ab"] || lib.translate[i]) + "</div><div>" + get.skillInfoTranslation(i, player) + "</div>";
						})
					)
					.set("displayIndex", false)
					.set("prompt", "龙诵：请选择你要获得的技能")
					.set("ai", () => {
						var list = _status.event.controls.slice();
						return list.sort((a, b) => {
							return get.skillRank(b, "in") - get.skillRank(a, "in");
						})[0];
					})
					.forResultControl();
			}
			player.addTempSkill("dclongsong_remove", ["phaseUseAfter", "phaseAfter"]);
			player.markAuto("dclongsong_remove", [skill]);
			await player.addTempSkills(skill, ["phaseUseAfter", "phaseAfter"]);
		},
	},
	//伏完
	dcmoukui: {
		audio: "moukui",
		trigger: { player: "useCardToPlayered" },
		direct: true,
		filter(event, player) {
			return event.card && event.card.name == "sha" && event.isFirstTarget;
		},
		content() {
			"step 0";
			player
				.chooseButton([
					get.prompt("dcmoukui"),
					[
						[
							["draw", "摸一张牌"],
							["discard", "弃置" + (trigger.targets.length == 1 ? get.translation(trigger.targets[0]) : "一名目标角色") + "的一张牌"],
						],
						"textbutton",
					],
				])
				.set("filterButton", button => {
					if (
						button.link == "discard" &&
						_status.event.getTrigger().targets.every(target => {
							return target.countDiscardableCards(_status.event.player, "he") == 0;
						})
					) {
						return false;
					}
					return true;
				})
				.set("ai", function (button) {
					if (
						button.link == "discard" &&
						_status.event.getTrigger().targets.every(target => {
							return get.effect(target, { name: "guohe_copy2" }, _status.event.player) <= 0;
						})
					) {
						return 0;
					}
					return 1;
				})
				.set("selectButton", [1, 2]);
			"step 1";
			if (result.bool) {
				player.logSkill("dcmoukui");
				var choices = result.links;
				event.choices = choices;
				if (choices.includes("draw")) {
					game.log(player, "选择了", "#y选项一");
					player.draw();
				}
				if (choices.includes("discard")) {
					game.log(player, "选择了", "#y选项二");
					if (trigger.targets.length == 1) {
						event.directtarget = trigger.targets[0];
					} else {
						player
							.chooseTarget("谋溃：弃置一名目标角色的一张牌", true, (card, player, target) => {
								return _status.event.getTrigger().targets.includes(target) && target.countDiscardableCards(player, "he") > 0;
							})
							.set("ai", target => {
								return get.effect(target, { name: "guohe_copy2" }, _status.event.player);
							});
					}
				} else {
					event.finish();
				}
				if (choices.length >= 2) {
					player.addTempSkill("dcmoukui_conseq");
					player.markAuto("dcmoukui_conseq", [trigger.card]);
				}
			} else {
				event.finish();
			}
			"step 2";
			player.discardPlayerCard(event.directtarget || result.targets[0], true, "he").boolline = true;
		},
		subSkill: {
			conseq: {
				trigger: {
					global: ["shaMiss", "useCardToExcluded", "eventNeutralized", "shaCancelled"],
				},
				forced: true,
				popup: false,
				charlotte: true,
				onremove: true,
				filter(event, player, name) {
					if (!event.card) {
						return false;
					}
					var cards = player.getStorage("dcmoukui_conseq");
					if (!cards.includes(event.card)) {
						return false;
					}
					return true;
				},
				content() {
					"step 0";
					game.delayx();
					"step 1";
					trigger.target.discardPlayerCard(player, true, "he").boolline = true;
				},
			},
		},
	},
	//孙桓
	dcniji: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return get.type(event.card) != "equip";
		},
		frequent: true,
		group: "dcniji_discard",
		content() {
			var next = player.draw();
			var evt = trigger.getParent("dcniji_discard");
			if (!evt || evt.player != player) {
				next.gaintag = ["dcniji"];
			}
			player.addTempSkill("dcniji_clear");
		},
		subSkill: {
			clear: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("dcniji");
				},
			},
			discard: {
				audio: "dcniji",
				trigger: { global: "phaseJieshuBegin" },
				filter(event, player) {
					return player.hasCard(card => card.hasGaintag("dcniji"), "h");
				},
				forced: true,
				locked: false,
				content() {
					"step 0";
					var cards = player.getCards("h", card => card.hasGaintag("dcniji") && lib.filter.cardDiscardable(card, player, "dcniji"));
					event.cards = cards;
					// if(cards.length>=player.hp){
					if (cards.some(card => player.hasUseTarget(card))) {
						player.chooseToUse({
							prompt: "是否使用一张“逆击”牌？",
							filterCard(card, player) {
								if (![card].concat(card.cards || []).some(c => get.itemtype(c) == "card" && c.hasGaintag("dcniji"))) {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							},
							ai1(card) {
								return get.player().getUseValue(card);
							},
						});
					}
					// }
					"step 1";
					if (result.bool) {
						game.delayex();
					}
					var cards = cards.filter(card => get.owner(card) == player && get.position(card) == "h" && lib.filter.cardDiscardable(card, player, "dcniji"));
					if (cards.length) {
						player.discard(cards);
					}
				},
			},
		},
	},
	//孙狼
	dctingxian: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		usable: 1,
		filter(event, player) {
			return event.card.name == "sha" && event.getParent().triggeredTargets3.length == event.targets.length;
		},
		/*
		check(event, player) {
			return event.targets.some(target => get.effect(target, event.card, player, player) <= 0);
		},
		*/
		content() {
			"step 0";
			var num = player.countCards("e") + 1;
			event.num = num;
			player.draw(num);
			"step 1";
			var num = Math.min(trigger.targets.length, num);
			player
				.chooseTarget("铤险：是否令此杀对其中至多" + get.cnNumber(num) + "个目标无效？", [1, num], (card, player, target) => {
					return _status.event.getTrigger().targets.includes(target);
				})
				.set("ai", target => {
					return 1 - get.effect(target, _status.event.getTrigger().card, _status.event.player, _status.event.player);
				});
			"step 2";
			if (result.bool) {
				player.line(result.targets);
				trigger.getParent().excluded.addArray(result.targets);
			}
		},
		/*
		ai: {
			effect: {
				player_use(card, player, target) {
					if (_status.event.name == "chooseToUse" && get.name(card) == "sha" && (!player.storage.counttrigger || !player.storage.counttrigger.dctingxian) && !_status._dctingxian_aiChecking) {
						_status._dctingxian_aiChecking = true;
						var eff = get.effect(target, { name: "sha" }, player, player);
						delete _status._dctingxian_aiChecking;
						if (
							eff < 0 &&
							ui.selected.targets.filter(targetx => {
								if (targetx == target) return false;
								_status._dctingxian_aiChecking = true;
								var eff = get.effect(targetx, { name: "sha" }, player, player);
								delete _status._dctingxian_aiChecking;
								if (eff < 0) return true;
							}).length <
								player.countCards("e") + 1
						)
							return [0, 0, 0, 0.5];
					}
				},
			},
		},
		*/
	},
	dcbenshi: {
		audio: 2,
		forced: true,
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			var card = event.card;
			var range;
			var select = get.copy(get.info(card).selectTarget);
			if (select == undefined) {
				if (get.info(card).filterTarget == undefined) {
					return false;
				}
				range = [1, 1];
			} else if (typeof select == "number") {
				range = [select, select];
			} else if (get.itemtype(select) == "select") {
				range = select;
			} else if (typeof select == "function") {
				range = select(card, player);
			}
			game.checkMod(card, player, range, "selectTarget", player);
			return range[1] == -1;
		},
		content() {},
		mod: {
			/*
			attackRangeBase(player, num) {
				if (num !== "unchanged") return num;
				var range = 1;
				var equips = player.getCards("e", function (card) {
					return get.subtype(card) != "equip1" && (!ui.selected.cards || !ui.selected.cards.includes(card));
				});
				for (var i = 0; i < equips.length; i++) {
					var info = get.info(equips[i], false).distance;
					if (!info) continue;
					if (info.attackFrom) {
						range -= info.attackFrom;
					}
				}
				return range;
			},
			*/
			attackRange(player, num) {
				return num + 1;
			},
			selectTarget(card, player, range) {
				if (card.name == "sha") {
					range[0] = -1;
					range[1] = -1;
				}
			},
		},
	},
	//是仪
	dccuichuan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		filterCard: true,
		derivation: "dczuojian",
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			event.num = target.countCards("e");
			var subtypes = [];
			for (var i = 1; i < 7; i++) {
				if (target.hasEmptySlot(i)) {
					subtypes.push("equip" + i);
				}
			}
			if (subtypes.length) {
				subtypes.randomSort();
				for (var subtype of subtypes) {
					var card = get.cardPile2(card => get.subtype(card) == subtype, "random");
					if (card && target.canUse(card, target)) {
						target.chooseUseTarget(card, true, "nopopup");
						break;
					}
				}
			}
			"step 1";
			var numx = target.countCards("e");
			if (numx > 0) {
				player.draw(numx);
			}
			game.delayx();
			"step 2";
			event.num2 = target.countCards("e");
			if (event.num2 == 4 && num != 4) {
				player.trySkillAnimate("dccuichuan_animate", "dccuichuan_animate", player.checkShow("dccuichuan"));
				//player.removeSkill('dccuichuan');
				//game.log(player,'失去了技能','#g【榱椽】');
				player.changeSkills(["dczuojian"], ["dccuichuan"]);
				target.insertPhase();
				game.delayx();
			}
		},
		subSkill: {
			animate: {
				audio: "dccuichuan",
				skillAnimation: true,
				animationColor: "wood",
			},
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (target.countCards("e") == 3) {
						return 2;
					}
					return 1;
				},
				player(player, target) {
					if (target.countCards("e") == 3) {
						return 0.5;
					}
					return target.countCards("e") + 1;
				},
			},
		},
	},
	dczhengxu: {
		audio: 2,
		group: ["dczhengxu_lose", "dczhengxu_damage"],
		subSkill: {
			lose: {
				audio: "dczhengxu",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				prompt2(event, player) {
					return "当你失去牌后，若你本回合受到过伤害，你可以摸等量的牌（" + get.cnNumber(event.getl(player).cards2.length) + "张）";
				},
				check: () => true,
				filter(event, player) {
					if (event.name == "gain" && event.player == player) {
						return false;
					}
					if (!player.getHistory("damage").length || player.hasHistory("useSkill", evt => evt.skill == "dczhengxu_lose")) {
						return false;
					}
					var evt = event.getl(player);
					return evt && evt.cards2 && evt.cards2.length > 0;
				},
				content() {
					player.draw(trigger.getl(player).cards2.length);
				},
				ai: {
					effect: {
						target: (card, player, target) => {
							if ((get.tag(card, "lose") || get.tag(card, "discard")) && target.getHistory("damage").length && !target.hasHistory("useSkill", evt => evt.skill == "dczhengxu_lose")) {
								return [1, 1];
							}
						},
					},
				},
			},
			damage: {
				audio: "dczhengxu",
				trigger: {
					player: "damageBegin4",
				},
				prompt2: "当你受到伤害时，若你本回合失去过牌，你可以防止之",
				check: () => true,
				filter(event, player) {
					if (!player.hasHistory("lose", evt => evt.cards2 && evt.cards2.length) || player.hasHistory("useSkill", evt => evt.skill == "dczhengxu_damage")) {
						return false;
					}
					return true;
				},
				content() {
					trigger.cancel();
				},
				ai: {
					effect: {
						target: (card, player, target) => {
							if (player.hasSkillTag("jueqing", false, target) || !get.tag(card, "damage")) {
								return;
							}
							if (target.hasHistory("useSkill", evt => evt.skill == "dczhengxu_damage") || !target.hasHistory("lose", evt => evt.cards2 && evt.cards2.length)) {
								return;
							}
							if (get.attitude(player, target) >= 0) {
								return "zeroplayertarget";
							}
							let num = 0,
								shas = player.getCardUsable("sha"),
								hs = player.getCards("hs", i => {
									if (i === card || (card.cards && card.cards.includes(i)) || !get.tag(i, "damage") || !player.canUse(i, target)) {
										return false;
									}
									if (get.name(i) === "sha") {
										num++;
										return false;
									}
									return true;
								});
							if (card.name === "sha") {
								shas--;
							}
							num = Math.min(num, shas);
							num += hs.length;
							if (!num) {
								return "zeroplayertarget";
							}
							num = 1 - 2 / 3 / num;
							return [num, 0, num, 0];
						},
					},
				},
			},
		},
	},
	dczuojian: {
		audio: 2,
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return (
				player.getHistory("useCard", evt => {
					var evtx = evt.getParent("phaseUse");
					if (evtx && evtx == event) {
						return true;
					}
					return false;
				}).length >= player.hp
			);
		},
		direct: true,
		content() {
			"step 0";
			var choices = [];
			var choiceList = ["令装备区牌数多于你的角色各摸一张牌", "令装备区牌数少于你的角色各弃置一张手牌"];
			var num = player.countCards("e");
			var targets = [],
				targets2 = [];
			var eff = 0,
				eff2 = 0;
			for (var target of game.filterPlayer()) {
				if (target.countCards("e") > num) {
					targets.push(target);
					eff += get.attitude(player, target);
				}
				if (target.countCards("e") < num) {
					targets2.push(target);
					eff2 -= get.attitude(player, target);
				}
			}
			event.targets = targets;
			event.targets2 = targets2;
			if (targets.length) {
				choices.push("选项一");
				choiceList[0] += "（" + get.translation(targets) + "）";
			} else {
				choiceList[0] = '<span style="opacity:0.5; ">' + choiceList[0] + "</span>";
			}
			if (targets2.length) {
				choices.push("选项二");
				choiceList[1] += "（" + get.translation(targets2) + "）";
			} else {
				choiceList[1] = '<span style="opacity:0.5; ">' + choiceList[1] + "</span>";
			}
			if (!choices.length) {
				event.finish();
			} else {
				player
					.chooseControl(choices, "cancel2")
					.set("prompt", get.prompt("dczuojian"))
					.set("choiceList", choiceList)
					.set("ai", () => {
						var controls = _status.event.controls,
							choice = _status.event.choice;
						if (!controls.includes("选项一") || (controls.includes("选项二") && choice == 1)) {
							return "选项二";
						}
						return "选项一";
					})
					.set("choice", eff <= 0 && eff2 <= 0 ? "cancel2" : eff > -eff2 ? 0 : 1);
			}
			"step 1";
			if (result.control == "选项一") {
				player.logSkill("dczuojian", targets);
				game.asyncDraw(targets, 1);
			} else if (result.control == "选项二") {
				player.logSkill("dczuojian", event.targets2);
				for (var target of event.targets2) {
					player.discardPlayerCard("h", target, true);
				}
			}
		},
	},
	//胡金定
	dcdeshi: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		forced: true,
		filter(event, player) {
			return player.isDamaged() && event.card && event.card.name == "sha";
		},
		content() {
			"step 0";
			trigger.cancel();
			for (var func of ["discardPile", "cardPile2"]) {
				var card = get[func](card => card.name == "sha");
				if (card) {
					player.gain(card, "gain2");
					break;
				}
			}
			"step 1";
			player.loseMaxHp();
		},
		ai: {
			halfneg: true,
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.card && arg.card.name == "sha") {
					return true;
				}
				return false;
			},
		},
	},
	dcwuyuan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", "sha") > 0;
		},
		filterCard: { name: "sha" },
		filterTarget: lib.filter.notMe,
		check(card) {
			var player = _status.event.player;
			if (
				get.color(card) == "red" &&
				game.hasPlayer(function (current) {
					return current != player && current.isDamaged() && get.attitude(player, current) > 2;
				})
			) {
				return 2;
			}
			if (get.natureList(card).length) {
				return 1.5;
			}
			return 1;
		},
		discard: false,
		lose: false,
		delay: false,
		content() {
			"step 0";
			player.give(cards, target, "give");
			player.recover();
			"step 1";
			var num = 1;
			if (get.natureList(cards[0]).length) {
				num++;
			}
			player.draw("nodelay");
			target.draw(num);
			if (get.color(cards[0]) == "red") {
				target.recover();
			}
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (player.isDamaged()) {
						return 1;
					}
					return 0;
				},
				target(player, target) {
					if (ui.selected.cards.length) {
						var num = 1;
						if (get.natureList(ui.selected.cards[0]).length) {
							num++;
						}
						if (target.hasSkillTag("nogain")) {
							num = 0;
						}
						if (get.color(ui.selected.cards[0]) == "red") {
							return num + 2;
						} else {
							return num + 1;
						}
					}
					return 1;
				},
			},
		},
	},
	//李异谢旌
	dcdouzhen: {
		audio: 2,
		trigger: {
			player: ["useCard", "respond"],
		},
		forced: true,
		zhuanhuanji: "number",
		mark: true,
		marktext: "☯",
		intro: {
			content(storage, player) {
				var str = "<li>已转换过" + get.cnNumber(storage || 0) + "次。<li>你的回合内，";
				str += player.countMark("dcdouzhen") % 2 ? "你的红色基本牌均视为普【杀】且无次数限制。" : "你的黑色基本牌均视为【决斗】且使用时获得目标的一张牌。";
				return str;
			},
		},
		filter(event, player) {
			if (player != _status.currentPhase || !event.card.isCard || !event.cards || event.cards.length != 1 || get.type(event.cards[0]) != "basic") {
				return false;
			}
			if (player.countMark("dcdouzhen") % 2) {
				return get.color(event.cards[0]) == "red" && event.card.name == "sha";
			}
			return event.name != "respond" && get.color(event.cards[0]) == "black" && event.card.name == "juedou";
		},
		content() {
			if (player.countMark("dcdouzhen") % 2) {
				// if(trigger.addCount!==false){
				// 	 trigger.addCount=false;
				// 	 if(player.stat[player.stat.length-1].card.sha>0){
				// 		 player.stat[player.stat.length-1].card.sha--;
				// 	 }
				// }
			} else {
				if (trigger.targets.length && trigger.targets.filter(i => i.countGainableCards(player, "he") > 0).length) {
					player.gainMultiple(trigger.targets.sortBySeat(), "he");
				}
			}
			player.changeZhuanhuanji("dcdouzhen");
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (card.name != "juedou") {
						return;
					}
					if (
						player.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: target,
								card: card,
							},
							true
						)
					) {
						return [1, 1];
					}
					var hs1 = target.getCards("h", "sha");
					var hs2 = player.getCards("h", card => (get.color(card) == "red" && get.type(card) == "basic") || get.name(card) == "sha");
					var hsx = target.getCards("h");
					if (hs1.length > hs2.length + 1 || (hsx.length > 2 && hs2.length == 0 && hsx[0].number < 6) || (hsx.length > 3 && hs2.length == 0) || (hs1.length > hs2.length && (!hs2.length || hs1[0].number > hs2[0].number))) {
						return [1, -2];
					}
					return [1, -0.5];
				},
			},
		},
		mod: {
			cardname(card, player) {
				if (get.type(card, null, false) != "basic" || player != _status.currentPhase) {
					return;
				}
				if (player.countMark("dcdouzhen") % 2) {
					if (get.color(card) == "red") {
						return "sha";
					}
				} else {
					if (get.color(card) == "black") {
						return "juedou";
					}
				}
			},
			cardnature(card, player) {
				if (get.type(card, null, false) != "basic" || player != _status.currentPhase) {
					return;
				}
				if (player.countMark("dcdouzhen") % 2) {
					if (get.color(card) == "red") {
						return false;
					}
				}
			},
			cardUsable(card, player) {
				if (_status.currentPhase == player && card.name == "sha" && player.countMark("dcdouzhen") % 2 && get.color(card) == "red" && card.isCard) {
					return Infinity;
				}
			},
		},
	},
	//穆顺
	dcjinjian: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		forced: true,
		locked: false,
		filter(event, player, name) {
			return name == "damageSource" || (event.source && event.source != player && event.source.isIn());
		},
		content() {
			"step 0";
			player.addMark("dcjinjian", 1);
			game.delayx();
			"step 1";
			var source = trigger.source;
			if (source && source != player && source.isIn() && player.canCompare(source)) {
				player
					.chooseBool("是否和" + get.translation(source) + "拼点？", "若你赢，则你恢复1点体力")
					.set(
						"goon",
						(player.countCards("h") == 1 ||
							player.hasCard(function (card) {
								return get.value(card) <= 5 || get.number(card) > 10;
							})) &&
							(get.attitude(player, source) <= 0 || source.countCards("h") >= 4)
					)
					.set("ai", function () {
						return _status.event.goon;
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.line(trigger.source, "green");
				player.chooseToCompare(trigger.source);
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				player.recover();
			}
		},
		intro: {
			name2: "劲",
			content: "mark",
		},
		mod: {
			attackRange(player, num) {
				return num + player.countMark("dcjinjian");
			},
		},
	},
	dcshizhao: {
		audio: 2,
		usable: 1,
		trigger: {
			player: ["loseAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			return player != _status.currentPhase && player.countCards("h") == 0 && event.getl(player).hs.length > 0;
		},
		content() {
			if (player.hasMark("dcjinjian")) {
				player.removeMark("dcjinjian", 1);
				player.draw(2);
			} else {
				player.addTempSkill("dcshizhao_effect");
				player.addMark("dcshizhao_effect", 1, false);
				game.delayx();
			}
		},
		subSkill: {
			effect: {
				audio: "dcshizhao",
				charlotte: true,
				onremove: true,
				trigger: { player: "damageBegin1" },
				forced: true,
				content() {
					trigger.num += player.countMark(event.name);
					player.removeSkill(event.name);
				},
			},
		},
		ai: {
			combo: "dcjinjian",
			halfneg: true,
		},
	},
	//赵俨
	dcfuning: {
		audio: 2,
		trigger: { player: "useCard" },
		prompt2(event, player) {
			return (
				"摸两张牌，然后弃置" +
				get.cnNumber(
					1 +
						player.getHistory("useSkill", function (evt) {
							return evt.skill == "dcfuning";
						}).length
				) +
				"张牌"
			);
		},
		check(event, player) {
			return (
				player.getHistory("useSkill", function (evt) {
					return evt.skill == "dcfuning";
				}).length < 2
			);
		},
		content() {
			player.draw(2);
			player.chooseToDiscard(
				"he",
				true,
				+player.getHistory("useSkill", function (evt) {
					return evt.skill == "dcfuning";
				}).length
			);
		},
	},
	dcbingji: {
		mod: {
			cardUsable(card, player, num) {
				if (card.storage?.dcbingji) {
					return Infinity;
				}
			},
			cardEnabled(card, player) {
				if (card.storage?.dcbingji) {
					return true;
				}
			},
		},
		locked: false,
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			var hs = player.getCards("h"),
				suits = player.getStorage("dcbingji_used");
			if (!hs.length) {
				return false;
			}
			var suit = get.suit(hs[0], player);
			if (suit == "none" || suits.includes(suit)) {
				return false;
			}
			for (var i = 1; i < hs.length; i++) {
				if (get.suit(hs[i], player) != suit) {
					return false;
				}
			}
			return true;
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("秉纪", [["sha", "tao"], "vcard"], "hidden");
			},
			filter(button, player) {
				return lib.filter.cardEnabled(
					{
						name: button.link[2],
						isCard: true,
						storage: { dcbingji: true },
					},
					player,
					"forceEnable"
				);
			},
			check(button) {
				var card = {
						name: button.link[2],
						isCard: true,
						storage: { dcbingji: true },
					},
					player = _status.event.player;
				return Math.max.apply(
					Math,
					game
						.filterPlayer(function (target) {
							if (player == target) {
								return false;
							}
							return lib.filter.targetEnabled2(card, player, target) && lib.filter.targetInRange(card, player, target);
						})
						.map(function (target) {
							return get.effect(target, card, player, player);
						})
				);
			},
			backup(links, player) {
				return {
					viewAs: {
						name: links[0][2],
						isCard: true,
						storage: { dcbingji: true },
					},
					filterCard: () => false,
					selectCard: -1,
					filterTarget(card, player, target) {
						if (!card) {
							card = get.card();
						}
						if (player == target) {
							return false;
						}
						return lib.filter.targetEnabled2(card, player, target) && lib.filter.targetInRange(card, player, target);
					},
					selectTarget: 1,
					ignoreMod: true,
					filterOk: () => true,
					log: false,
					precontent() {
						player.logSkill("dcbingji");
						var hs = player.getCards("h");
						event.getParent().addCount = false;
						player.showCards(hs, get.translation(player) + "发动了【秉纪】");
						player.markAuto("dcbingji_used", [get.suit(hs[0], player)]);
						player.addTempSkill("dcbingji_used");
					},
				};
			},
			prompt(links, player) {
				return "请选择【" + get.translation(links[0][2]) + "】的目标";
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//王威
	dcruizhan: {
		audio: 2,
		trigger: { global: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player != event.player && event.player.countCards("h") >= Math.max(1, event.player.hp) && player.canCompare(event.player);
		},
		logTarget: "player",
		check(event, player) {
			var goon = player.hasCard(function (card) {
				return card.name == "sha" || get.value(card) <= 5;
			});
			var target = event.player;
			if (goon && get.attitude(player, target) < 0) {
				return get.effect(target, { name: "sha" }, player, player) > 0;
			}
			return 0;
		},
		content() {
			"step 0";
			event.target = trigger.player;
			player.chooseToCompare(event.target).set("ai", function (card) {
				if (typeof card == "string" && lib.skill[card]) {
					var ais =
						lib.skill[card].check ||
						function () {
							return 0;
						};
					return ais();
				}
				var player = get.owner(card);
				var getn = function (card) {
					if (player.hasSkill("tianbian") && get.suit(card) == "heart") {
						return 13;
					}
					return get.number(card);
				};
				var event = _status.event.getParent();
				var to = player == event.player ? event.target : event.player;
				var addi = get.value(card) >= 8 && get.type(card) != "equip" ? -6 : 0;
				if (card.name == "du") {
					addi -= 5;
				}
				if (player == event.player) {
					if (get.name(card, player) == "sha") {
						return 10 + getn(card);
					}
					return getn(card) - get.value(card) / 2 + addi;
				} else {
					if (get.name(card, player) == "sha") {
						return -10 - getn(card) - get.value(card) / 2 + addi;
					}
					return getn(card) - get.value(card) / 2 + addi;
				}
			});
			"step 1";
			var bool1 = result.bool;
			var bool2 = get.name(result.player, player) == "sha" || get.name(result.target, target) == "sha";
			if (bool1 || bool2) {
				if (player.canUse("sha", target, false)) {
					player.useCard({ name: "sha", isCard: true }, target, false);
					if (!bool1 || !bool2) {
						event.finish();
					}
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (
				target.hasCard(function (card) {
					return lib.filter.canBeGained(card, player, target);
				}, "he") &&
				player.hasHistory("sourceDamage", function (evt) {
					var evtx = evt.getParent("useCard");
					return evtx && evtx.card == evt.card && evtx.getParent() == event;
				})
			) {
				player.gainPlayerCard(target, true, "he");
			}
		},
	},
	dcshilie: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog(
					"示烈：请选择一项",
					[
						[
							["recover", "回复1点体力，将两张牌置于武将牌上作为“示烈”"],
							["losehp", "失去1点体力，获得两张“示烈”牌"],
						],
						"textbutton",
					],
					"hidden"
				);
			},
			check(button) {
				return button.link == "recover" ? 1 : 0;
			},
			backup(links, player) {
				return get.copy(lib.skill["dcshilie_" + links[0]]);
			},
			prompt: () => "点击“确定”以执行选项",
		},
		intro: {
			markcount: "expansion",
			content: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: "dcshilie_die",
		ai: {
			order: 0.5,
			result: {
				player(player) {
					if (player.isDamaged() && !player.countCards("h", "tao")) {
						return 1;
					}
					return 0;
				},
			},
		},
		subSkill: {
			backup: {},
			recover: {
				audio: "dcshilie",
				selectCard: -1,
				selectTarget: -1,
				filterCard: () => false,
				filterTarget: () => false,
				multitarget: true,
				content() {
					"step 0";
					player.recover();
					"step 1";
					var hs = player.getCards("he");
					if (!hs.length) {
						event.finish();
					} else if (hs.length <= 2) {
						event._result = { bool: true, cards: hs };
					} else {
						player.chooseCard("he", 2, true, "选择两张牌作为“示烈”牌");
					}
					"step 2";
					if (result.bool) {
						player.addToExpansion(result.cards, player, "give").gaintag.add("dcshilie");
					} else {
						event.finish();
					}
					"step 3";
					var cards = player.getExpansions("dcshilie");
					if (cards.length > game.countPlayer()) {
						player.loseToDiscardpile(cards.slice(game.countPlayer()));
					}
				},
			},
			losehp: {
				audio: "dcshilie",
				selectCard: -1,
				selectTarget: -1,
				filterCard: () => false,
				filterTarget: () => false,
				multitarget: true,
				content() {
					"step 0";
					player.loseHp();
					"step 1";
					var hs = player.getExpansions("dcshilie");
					if (!hs.length) {
						event.finish();
					} else if (hs.length <= 2) {
						event._result = { bool: true, links: hs };
					} else {
						player.chooseButton(["选择获得两张“示烈”牌", hs], 2, true);
					}
					"step 2";
					if (result.bool) {
						player.gain(result.links, "gain2");
					}
				},
			},
			die: {
				audio: "dcshilie",
				forceDie: true,
				trigger: { player: "die" },
				filter(event, player) {
					return player.getExpansions("dcshilie").length > 0;
				},
				direct: true,
				skillAnimation: true,
				animationColor: "metal",
				content() {
					"step 0";
					player.chooseTarget(get.prompt("dcshilie"), "令一名角色获得你的“示烈”牌", function (card, player, target) {
						return target != player && target != _status.event.getTrigger().source;
					});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("dcshilie_die", target);
						player.give(player.getExpansions("dcshilie"), target, "give");
					}
				},
			},
		},
	},
	//胡班
	dcchongyi: {
		audio: 2,
		init: () => {
			game.addGlobalSkill("dcchongyi_ai");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("dcchongyi", null, null, false), true)) {
				game.removeGlobalSkill("dcchongyi_ai");
			}
		},
		trigger: { global: "useCard" },
		logTarget: "player",
		filter(event, player) {
			if (event.card.name != "sha" || !event.player.isIn()) {
				return false;
			}
			var evt = event.getParent("phaseUse");
			if (!evt || evt.player != event.player) {
				return false;
			}
			var goon = false;
			var history = event.player.getHistory("useCard", function (evtx) {
				if (goon || evtx.getParent("phaseUse") != evt) {
					return false;
				}
				goon = true;
				return true;
			});
			return history[0] == event;
		},
		prompt2: event => "令其摸两张牌，且使用【杀】的次数上限+1",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		content() {
			var target = trigger.player;
			target.draw(2);
			target.addMark("dcchongyi_sha", 1, false);
			target.addTempSkill("dcchongyi_sha");
		},
		group: "dcchongyi_end",
		subSkill: {
			ai: {
				mod: {
					aiOrder(player, card, num) {
						if (card.name != "sha") {
							return;
						}
						var evt = _status.event.getParent("phaseUse");
						if (!evt || evt.player != player) {
							return;
						}
						if (
							player.hasHistory("useCard", function (evtx) {
								return evtx.getParent("phaseUse") == evt;
							})
						) {
							return;
						}
						if (
							game.hasPlayer(function (current) {
								return current.hasSkill("dcchongyi") && get.attitude(player, current) >= 0;
							})
						) {
							return num + 10;
						}
					},
				},
				trigger: { player: "dieAfter" },
				filter: () => {
					return !game.hasPlayer(i => i.hasSkill("dcchongyi", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				content: () => {
					game.removeGlobalSkill("dcchongyi_ai");
				},
			},
			end: {
				audio: "dcchongyi",
				trigger: { global: "phaseUseEnd" },
				logTarget: "player",
				filter(event, player) {
					if (!event.player.isIn()) {
						return false;
					}
					var history = event.player.getHistory("useCard", function (evt) {
						return evt.getParent("phaseUse") == event;
					});
					return history.length && history[history.length - 1].card.name == "sha";
				},
				prompt2(event, player) {
					const target = event.player;
					const history = target.getHistory("useCard", evt => {
						return evt.getParent("phaseUse") === event;
					});
					const evt = history.lastItem,
						cards = evt.cards.filterInD("d");
					let str = "令" + get.translation(target) + "本回合的手牌上限+1";
					if (cards.length) {
						str += `，然后你获得${get.translation(cards)}`;
					}
					str += "。";
					return str;
				},
				check(event, player) {
					return get.attitude(player, event.player) > 0;
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					target.addMark("dcchongyi_keep", 1, false);
					target.addTempSkill("dcchongyi_keep");
					const history = target.getHistory("useCard", evt => {
						return evt.getParent("phaseUse") === trigger;
					});
					const evt = history.lastItem,
						cards = evt.cards.filterInD("d");
					if (cards.length) {
						await player.gain(cards, "gain2");
					} else {
						await game.delayx();
					}
				},
			},
			sha: {
				charlotte: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("dcchongyi_sha");
						}
					},
				},
				onremove: true,
				intro: { content: "使用【杀】的次数上限+#" },
			},
			keep: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("dcchongyi_keep");
					},
				},
				onremove: true,
				intro: { content: "手牌上限+#" },
			},
		},
	},
	//牛辅
	dcxiaoxi: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		forced: true,
		filter(event, player) {
			return player.maxHp > 1;
		},
		content() {
			"step 0";
			if (player.maxHp <= 2) {
				event._result = { index: 0 };
			} else {
				player
					.chooseControl("1点", "2点")
					.set("prompt", "宵袭：减少1或2点体力上限")
					.set("ai", function () {
						var player = _status.event.player;
						if (
							!game.hasPlayer(function (current) {
								if (!player.inRange(current) || get.attitude(player, current) >= 0) {
									return false;
								}
								if (
									get.effect(current, { name: "shunshou_copy2" }, player, player) > 0 &&
									current.countCards("h") +
										current.countCards("e", function (card) {
											return get.value(card, current) > 0;
										}) >
										1
								) {
									return true;
								}
								if (get.effect(current, { name: "sha" }, player, player) > 0 && current.countCards("hs", "shan") + current.hp > 1) {
									return true;
								}
							})
						) {
							return 0;
						}
						return 1;
					});
			}
			"step 1";
			player.loseMaxHp(1 + result.index);
			event.num = 1 + result.index;
			"step 2";
			if (!game.hasPlayer(current => player.inRange(current))) {
				event.finish();
			} else {
				player
					.chooseTarget(
						"请选择【宵袭】的目标",
						"然后你选择一项：⒈获得该角色的" + get.cnNumber(num) + "张牌。⒉视为对其使用" + get.cnNumber(num) + "张【杀】。",
						function (card, player, target) {
							return player.inRange(target);
						},
						true
					)
					.set("ai", function (target) {
						var player = _status.event.player;
						if (get.attitude(player, target) >= 0) {
							return 0;
						}
						var eff1 = get.effect(target, { name: "shunshou_copy2" }, player, player);
						if (
							eff1 > 0 &&
							target.countCards("h") +
								target.countCards("e", function (card) {
									return get.value(card, target) > 0;
								}) >
								1
						) {
							eff1 *= 1.6;
						}
						var eff2 = player.canUse("sha", target) ? get.effect(target, { name: "sha" }, player, player) : 0;
						if (eff2 > 0 && target.countCards("hs", "shan") + target.hp > 1) {
							eff2 *= 2;
						}
						return Math.max(eff1, eff2);
					});
			}
			"step 3";
			var target = result.targets[0];
			player.line(target, "green");
			event.target = target;
			var bool1 = target.countGainableCards(player, "he") > 0;
			var bool2 = player.canUse("sha", target);
			if (!bool1 && !bool2) {
				event.finish();
			} else if (bool1 && bool2) {
				var str = get.translation(target),
					numx = get.cnNumber(num);
				player
					.chooseControl()
					.set("choiceList", ["获得" + str + "的" + numx + "张牌", "视为对" + str + "使用" + numx + "张【杀】"])
					.set("ai", function () {
						var player = _status.event.player,
							target = _status.event.getParent().target;
						var eff1 = get.effect(target, { name: "shunshou_copy2" }, player, player);
						if (
							eff1 > 0 &&
							target.countCards("h") +
								target.countCards("e", function (card) {
									return get.value(card, target) > 0;
								}) >
								1
						) {
							eff1 *= 1.6;
						}
						var eff2 = player.canUse("sha", target) ? get.effect(target, { name: "sha" }, player, player) : 0;
						if (eff2 > 0 && target.countCards("hs", "shan") + target.hp > 1) {
							eff2 *= 2;
						}
						return eff1 > eff2 ? 0 : 1;
					});
			} else {
				event._result = { index: bool1 ? 0 : 1 };
			}
			"step 4";
			if (result.index == 0) {
				player.gainPlayerCard(target, true, num, "he");
				event.finish();
			}
			"step 5";
			event.num--;
			if (player.canUse("sha", target, false)) {
				player.useCard({ name: "sha", isCard: true }, target, false);
				if (event.num > 0) {
					event.redo();
				}
			}
		},
		ai: {
			neg: true,
		},
	},
	xiongrao: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		limited: true,
		skillAnimation: true,
		animationColor: "soil",
		prompt(event, player) {
			var str = "是否发动【熊扰】？";
			str += "（可摸" + get.cnNumber(Math.max(0, 7 - player.maxHp)) + "张牌）";
			return str;
		},
		logTarget: (event, player) => game.filterPlayer(current => current != player),
		check(event, player) {
			return player.maxHp <= 3;
		},
		content() {
			player.awakenSkill(event.name);
			game.countPlayer(function (current) {
				if (current != player) {
					current.addTempSkill("xiongrao_blocker");
				}
			});
			var num = 7 - player.maxHp;
			if (num > 0) {
				player.gainMaxHp(num);
				player.draw(num);
			}
		},
		subSkill: {
			blocker: {
				init(player, skill) {
					player.addSkillBlocker(skill);
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
				},
				charlotte: true,
				locked: true,
				skillBlocker(skill, player) {
					var info = get.info(skill);
					return info && !info.charlotte && !info.persevereSkill && !get.is.locked(skill) && !info.limited && !info.juexingji;
				},
				mark: true,
				marktext: "扰",
				intro: {
					content(list, player, skill) {
						var storage = player.getSkills(null, false, false).filter(function (i) {
							return lib.skill.xiongrao_blocker.skillBlocker(i, player);
						});
						if (storage.length) {
							return "失效技能：" + get.translation(storage);
						}
						return "无失效技能";
					},
				},
			},
		},
	},
	//卞喜
	dunxi: {
		audio: 2,
		trigger: { player: "useCard" },
		direct: true,
		filter(event, player) {
			if (!get.tag(event.card, "damage")) {
				return false;
			}
			return event.targets.some(target => target != player && target.isIn());
		},
		content() {
			"step 0";
			var targets = trigger.targets.filter(function (current) {
				return current != player && current.isIn();
			});
			if (targets.length == 1) {
				event.target = targets[0];
				player
					.chooseBool(get.prompt("dunxi", event.target), "令" + get.translation(event.target) + "获得一枚“钝”标记")
					.set("goon", get.attitude(player, event.target) < 0)
					.set("ai", () => _status.event.goon);
			} else {
				player
					.chooseTarget(get.prompt("dunxi"), "选择一名目标角色获得一枚“钝”标记", function (card, player, target) {
						return target != player && _status.event.getTrigger().targets.includes(target);
					})
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (att >= 0) {
							return 0;
						}
						return -att / (1 + target.hasMark("dunxi"));
					});
			}
			"step 1";
			if (result.bool) {
				var target = event.target || result.targets[0];
				player.logSkill("dunxi", target);
				target.addMark("dunxi", 1);
				game.delayx();
			}
		},
		intro: { content: "mark", name2: "钝" },
		group: "dunxi_random",
		subSkill: {
			random: {
				audio: "dunxi",
				trigger: { global: "useCard" },
				forced: true,
				locked: false,
				filter(event, player) {
					if (!event.player.hasMark("dunxi") || event.targets.length != 1 || event._dunxi || _status.dying.length) {
						return false;
					}
					var type = get.type2(event.card, false);
					return type == "basic" || type == "trick";
				},
				logTarget: "player",
				line: "fire",
				content() {
					"step 0";
					trigger._dunxi = true;
					trigger.player.removeMark("dunxi", 1);
					var target = trigger.targets[0];
					event.target = target;
					trigger.targets.remove(target);
					game.delayx();
					"step 1";
					var list;
					if (get.type(event.card) != "delay") {
						list = game.filterPlayer(function (current) {
							return lib.filter.targetEnabled2(trigger.card, trigger.player, current);
						});
					} else {
						list = game.filterPlayer(function (current) {
							return current.canAddJudge(event.card);
						});
					}
					if (list.length) {
						target = list.randomGet();
					}
					trigger.targets.push(target);
					trigger.player.line(target, "fire");
					game.log(trigger.card, "的目标被改为", target);
					if (target == event.target) {
						trigger.player.loseHp();
						var evt = trigger.getParent("phaseUse");
						if (evt && evt.player == trigger.player) {
							evt.skipped = true;
						}
					}
				},
			},
		},
	},
	//冯方
	dcditing: {
		audio: 2,
		trigger: { global: "phaseUseBegin" },
		logTarget: "player",
		filter(event, player) {
			return player.hp > 0 && event.player.countCards("h") > 0 && event.player.inRange(player);
		},
		prompt2: (event, player) => "观看其" + get.cnNumber(Math.min(player.hp, event.player.countCards("h"))) + "张手牌并选择其中一张",
		check(event, player) {
			var target = event.player;
			if (get.attitude(player, target) > 0) {
				return true;
			}
			if (Math.min(player.hp, target.countCards("h")) > 2) {
				return true;
			}
			return false;
		},
		content() {
			"step 0";
			var target = trigger.player;
			var cards = target.getCards("h");
			var num = Math.min(cards.length, player.hp),
				cards2 = cards.randomGets(num);
			player.chooseButton([get.translation(target) + "的手牌（" + num + "/" + cards.length + "）", cards2], true).set("ai", function (button) {
				var player = _status.event.player,
					target = _status.event.getTrigger().player,
					card = button.link;
				var att = get.attitude(player, target);
				var val = target.getUseValue(card, null, true);
				if (val <= 0) {
					return (-get.value(card, target) / 2) * get.sgn(att - 0.05);
				}
				if (target.canUse(card, player) && get.effect(player, card, target, target) > 0) {
					var eff = get.effect(player, card, target, player);
					if (eff < 0) {
						val -= eff;
					}
				}
				return val;
			});
			"step 1";
			if (result.bool) {
				player.addTempSkill("dcditing_effect", "phaseUseAfter");
				player.storage.dcditing_effect = [trigger.player, result.links[0]];
			}
		},
		subSkill: {
			effect: {
				audio: "dcditing",
				charlotte: true,
				trigger: { target: "useCardToTargeted" },
				forced: true,
				filter(event, player) {
					var list = player.storage.dcditing_effect;
					return list && event.player == list[0] && event.cards.includes(list[1]);
				},
				content() {
					trigger.excluded.add(player);
					game.delayx();
				},
				group: ["dcditing_draw", "dcditing_gain"],
			},
			draw: {
				audio: "dcditing",
				charlotte: true,
				trigger: { global: "useCardAfter" },
				forced: true,
				filter(event, player) {
					var list = player.storage.dcditing_effect;
					return list && event.player == list[0] && event.cards.includes(list[1]) && !event.targets.includes(player);
				},
				content() {
					player.draw(2);
				},
			},
			gain: {
				audio: "dcditing",
				charlotte: true,
				trigger: { global: "phaseUseEnd" },
				forced: true,
				filter(event, player) {
					var list = player.storage.dcditing_effect;
					return list && event.player == list[0] && event.player.getCards("h").includes(list[1]);
				},
				content() {
					var list = player.storage.dcditing_effect;
					player.gain(list[0], list[1], "giveAuto", "bySelf");
				},
			},
		},
	},
	dcbihuo: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		direct: true,
		filter(event, player) {
			return event.source && event.player != event.source;
		},
		content() {
			"step 0";
			event.num = event.triggername == "damageEnd" ? 1 : -1;
			player.chooseTarget(get.prompt("dcbihuo"), "令一名角色下回合的额定摸牌数" + (event.num > 0 ? "+1" : "-1")).set("ai", function (target) {
				var player = _status.event.player,
					num = _status.event.getParent().num;
				var att = get.attitude(player, target);
				if (num > 0) {
					if (att <= 0) {
						return 0;
					}
					if (target.hasJudge("lebu")) {
						return att / 10;
					}
					return (att / Math.sqrt(Math.min(5, 1 + target.countCards("h")))) * Math.sqrt(1 + target.hp);
				}
				if (num < 0) {
					if (att >= 0) {
						return 0;
					}
					if ((target.storage.dcbihuo_effect || 0) <= -2) {
						return -att / 10;
					}
					return (-att / Math.sqrt(Math.min(5, 1 + target.countCards("h")))) * Math.sqrt(1 + target.hp);
				}
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dcbihuo", target);
				if (typeof target.storage.dcbihuo_effect != "number") {
					target.storage.dcbihuo_effect = 0;
				}
				target.storage.dcbihuo_effect += event.num;
				target.addTempSkill("dcbihuo_effect", { player: "phaseAfter" });
				game.delayx();
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				onremove: true,
				content() {
					var num = player.storage.dcbihuo_effect;
					trigger.num += num;
					game.log(player, "的额定摸牌数", "#g" + (num >= 0 ? "+" : "") + num);
				},
				mark: true,
				intro: {
					content: num => "额定摸牌数" + (num >= 0 ? "+" : "") + num,
				},
			},
		},
	},
	//秦宜禄
	piaoping: {
		audio: 2,
		trigger: { player: "useCard" },
		forced: true,
		zhuanhuanji: true,
		content() {
			player.changeZhuanhuanji("piaoping");
			var num = Math.min(
				player.hp,
				player.getHistory("useSkill", function (evt) {
					return evt.skill == "piaoping";
				}).length
			);
			if (num <= 0) {
				return;
			}
			if (player.storage.piaoping == true) {
				player.draw(num);
			} else if (
				player.hasCard(function (card) {
					return lib.filter.cardDiscardable(card, player, "piaoping");
				}, "he")
			) {
				game.delayx();
				player.chooseToDiscard(true, "he", num);
			}
		},
		mark: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "转换技，锁定技。当你使用一张牌时，你弃置X张牌。（X为你本阶段内发动过〖漂萍〗的次数且至多等于你的体力值）";
				}
				return "转换技，锁定技。当你使用一张牌时，你摸X张牌。（X为你本阶段内发动过〖漂萍〗的次数且至多等于你的体力值）";
			},
		},
	},
	tuoxian: {
		audio: 2,
		ai: { combo: "piaoping" },
		trigger: { player: "loseAfter" },
		marktext: "栗",
		filter(event, player) {
			return event.type == "discard" && event.getParent(3).name == "piaoping" && player.countMark("tuoxian") > player.countMark("tuoxian_used") && event.cards.filterInD("d").length > 0;
		},
		async cost(event, trigger, player) {
			const cards = trigger.cards.filterInD("d");
			event.result = await player
				.chooseTarget(lib.filter.notMe, get.prompt(event.skill), "令一名其他角色获得" + get.translation(cards))
				.set("ai", function (target) {
					const player = _status.event.player;
					let att = get.attitude(player, target);
					if (att < 0) {
						return 0;
					}
					if (target.hasSkillTag("nogain")) {
						att /= 10;
					}
					return att * Math.pow(1 + target.countCards("he"), 0.25);
				})
				.forResult();
			event.result.cards = cards;
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cards = event.cards;
			player.addSkill(event.name + "_used");
			player.addMark(event.name + "_used", 1, false);
			await target.gain(cards, "gain2");
			const result = await target
				.chooseControl()
				.set("choiceList", ["弃置区域内的" + get.cnNumber(cards.length) + "张牌", "令" + get.translation(player) + "的〖漂萍〗于本回合内失效"])
				.set("ai", function () {
					const player = _status.event.player,
						target = _status.event.getParent().player;
					if (
						player.hasCard(function (card) {
							return get.effect(player, { name: card.viewAs || card.name }, player, player) < 0;
						}, "j") ||
						player.hasCard(function (card) {
							return get.value(card, player) <= 0;
						})
					) {
						return 0;
					}
					if (get.attitude(player, target) <= 0 || !target.isPhaseUsing()) {
						return 1;
					}
					if (
						!target.needsToDiscard() &&
						!target.hasCard(function (card) {
							return !target.hasValueTarget(card, null, true);
						}, "hs")
					) {
						return 1;
					}
					return 0;
				})
				.forResult();
			if (result.index == 0) {
				const num = Math.min(target.countCards("hej"), cards.length);
				if (target.countCards("j") > 0) {
					await target.discardPlayerCard(target, num, true, "hej");
				} else {
					await target.chooseToDiscard("he", true, num);
				}
			} else {
				player.tempBanSkill("piaoping");
			}
		},
		init(player) {
			player.addMark("tuoxian", 1, false);
		},
		onremove: true,
		intro: {
			name2: "栗",
			markcount(storage, player) {
				return player.countMark("tuoxian") - player.countMark("tuoxian_used");
			},
			content(storage, player) {
				return `剩余可用${player.countMark("tuoxian") - player.countMark("tuoxian_used")}次`;
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	zhuili: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		forced: true,
		filter(event, player) {
			if (player == event.player || get.color(event.card) != "black") {
				return false;
			}
			if (!player.hasSkill("piaoping", null, null, false)) {
				return false;
			}
			return true;
		},
		content() {
			if (player.storage.piaoping == true) {
				player.changeZhuanhuanji("piaoping");
			} else {
				player.addMark("tuoxian", 1, false);
				if (player.getAllHistory("useSkill", evt => evt.skill == "tuoxian").length > 3) {
					player.tempBanSkill("zhuili");
				}
			}
			game.delayx();
		},
		ai: { combo: "piaoping" },
	},
	//闫柔
	choutao: {
		audio: 2,
		trigger: {
			player: "useCard",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.card.name != "sha" || !event.player.isIn()) {
				return false;
			}
			if (player == event.player) {
				return player.hasCard(function (card) {
					return lib.filter.cardDiscardable(card, player, "choutao");
				}, "he");
			}
			return event.player.hasCard(function (card) {
				return lib.filter.canBeDiscarded(card, player, event.player);
			}, "he");
		},
		check(event, player) {
			if (player == event.player) {
				if (
					!player.hasCard(function (card) {
						return get.value(card) <= 5;
					}, "he")
				) {
					return false;
				}
				for (var i of event.targets) {
					var eff1 = get.damageEffect(i, player, player);
					if (eff1 < 0) {
						return false;
					}
					if (i.hasShan() && eff1 > 0) {
						return true;
					}
				}
				var sha = false;
				return (
					player.getCardUsable({ name: "sha" }) <= 0 &&
					player.hasCard(function (card) {
						if (!sha && get.name(card) == "sha" && player.getUseValue(card) > 0) {
							sha = true;
							return false;
						}
						return sha && get.value(card) <= 5;
					}, "hs")
				);
			} else {
				var eff1 = get.effect(event.player, { name: "guohe_copy2" }, player, player);
				var eff2 = get.damageEffect(player, event.player, player);
				if (!player.hasShan()) {
					return eff1 > 0;
				}
				if (eff2 > 0) {
					return eff1 > 0;
				}
				return player.hp > 2 && eff2 < eff1;
			}
		},
		logTarget: "player",
		content() {
			"step 0";
			if (player != game.me && !player.isOnline() && !player.isUnderControl()) {
				game.delayx();
			}
			if (player == trigger.player) {
				player.chooseToDiscard("he", true).set("ai", function (card) {
					var player = _status.event.player;
					var val = player.getUseValue(card);
					if (get.name(card) == "sha" && player.getUseValue(card) > 0) {
						val += 5;
					}
					return 20 - val;
				});
			} else {
				player.discardPlayerCard(trigger.player, true, "he");
			}
			"step 1";
			trigger.directHit.addArray(game.players);
			if (player == trigger.player && trigger.addCount !== false) {
				trigger.addCount = false;
				player.getStat().card.sha--;
			}
		},
	},
	xiangshu: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		limited: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return (player.getStat("damage") || 0) > 0 && game.hasPlayer(current => current.isDamaged());
		},
		content() {
			"step 0";
			event.num = Math.min(5, player.getStat("damage"));
			player
				.chooseTarget("是否发动限定技【襄戍】？", "令一名角色回复" + event.num + "点体力并摸" + get.cnNumber(event.num) + "张牌", function (card, player, target) {
					return target.isDamaged();
				})
				.set("ai", function (target) {
					var num = _status.event.getParent().num,
						player = _status.event.player;
					var att = get.attitude(player, target);
					if (att > 0 && num >= Math.min(player.hp, 2)) {
						return att * Math.sqrt(target.getDamagedHp());
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.awakenSkill(event.name);
				player.logSkill("xiangshu", target);
				target.recover(num);
				target.draw(num);
				if (player != target) {
					player.addExpose(0.2);
				}
			}
		},
	},
	//朱灵
	dczhanyi: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			var list = ["basic", "trick", "equip"];
			var list2 = [];
			var hs = player.getCards("he");
			for (var card of hs) {
				var type = get.type2(card, player);
				if (list.includes(type)) {
					var bool = lib.filter.cardDiscardable(card, player, "dczhanyi");
					if (bool) {
						list2.add(type);
					} else {
						list.remove(type);
						list2.remove(type);
					}
				}
			}
			return list2.length > 0;
		},
		content() {
			"step 0";
			var list = ["basic", "trick", "equip"];
			var list2 = [];
			var hs = player.getCards("he");
			for (var card of hs) {
				var type = get.type2(card, player);
				if (list.includes(type)) {
					var bool = lib.filter.cardDiscardable(card, player, "dczhanyi");
					if (bool) {
						list2.add(type);
					} else {
						list.remove(type);
						list2.remove(type);
					}
				}
			}
			player
				.chooseControl(list2, "cancel2")
				.set("prompt", get.prompt("dczhanyi"))
				.set("prompt2", "弃置一种类型的所有牌")
				.set("ai", function () {
					var player = _status.event.player;
					var getval = function (control) {
						if (control == "cancel2") {
							return 0;
						}
						var hs = player.getCards("h"),
							eff = 0;
						var es = player.getCards("e");
						var ss = player.getCards("s");
						var sha = player.getCardUsable({ name: "sha" });
						for (var i of hs) {
							var type = get.type2(i);
							if (type == control) {
								eff -= get.value(i, player);
							} else {
								switch (type) {
									case "basic":
										if (sha > 0 && get.name(i) == "sha") {
											sha--;
											var add = 3;
											if (!player.hasValueTarget(i) && player.hasValueTarget(i, false)) {
												add += player.getUseValue(i, false);
											}
											eff += add;
										}
										break;
									case "trick":
										if (player.hasValueTarget(i)) {
											eff += 6;
										}
										break;
									case "equip":
										if (player.hasValueTarget({ name: "guohe_copy2" })) {
											eff += player.getUseValue({ name: "guohe_copy2" });
										}
										break;
								}
							}
						}
						if (control == "equip") {
							for (var i of es) {
								eff -= get.value(i, player);
							}
						} else {
							for (var i of ss) {
								var type = get.type2(i);
								if (type == control) {
									continue;
								}
								switch (type) {
									case "basic":
										if (sha > 0 && get.name(i) == "sha") {
											sha--;
											var add = 3;
											if (!player.hasValueTarget(i) && player.hasValueTarget(i, false)) {
												add += player.getUseValue(i, false);
											}
											eff += add;
										}
										break;
									case "trick":
										if (player.hasValueTarget(i)) {
											eff += 6;
										}
										break;
									case "equip":
										if (player.hasValueTarget({ name: "guohe_copy2" })) {
											eff += player.getUseValue({ name: "guohe_copy2" });
										}
										break;
								}
							}
						}
						return eff;
					};
					var controls = _status.event.controls.slice(0);
					var eff = 0,
						current = "cancel2";
					for (var i of controls) {
						var effx = getval(i);
						if (effx > eff) {
							eff = effx;
							current = i;
						}
					}
					return current;
				});
			"step 1";
			var type = result.control;
			if (type != "cancel2") {
				event.type = type;
				var cards = player.getCards("he", function (card) {
					return get.type2(card, player) == type;
				});
				if (cards.length) {
					player.logSkill("dczhanyi");
					player.discard(cards);
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			var list = ["basic", "trick", "equip"];
			for (var i of list) {
				if (i != event.type) {
					player.addTempSkill("dczhanyi_" + i, { player: "phaseBegin" });
				}
			}
		},
		subSkill: {
			basic: {
				audio: "dczhanyi",
				charlotte: true,
				marktext: "基",
				mark: true,
				intro: {
					content: "使用基本牌无距离限制，且伤害值和回复值基数+1",
				},
				trigger: { source: ["damageBegin1", "recoverBegin"] },
				filter(event, player) {
					var evt = event.getParent();
					return evt.type == "card" && get.type(evt.card, null, false) == "basic";
				},
				forced: true,
				logTarget: "player",
				content() {
					trigger.num++;
				},
				mod: {
					targetInRange(card) {
						if (get.type(card) == "basic") {
							return true;
						}
					},
				},
				ai: {
					damageBonus: true,
				},
			},
			trick: {
				audio: "dczhanyi",
				charlotte: true,
				marktext: "锦",
				mark: true,
				intro: {
					content: "使用锦囊牌时摸一张牌，且锦囊牌不计入本回合的手牌上限",
				},
				trigger: { player: "useCard" },
				filter(event, player) {
					return get.type2(event.card) == "trick";
				},
				forced: true,
				content() {
					player.draw();
				},
				mod: {
					ignoredHandcard(card, player) {
						if (get.type2(card, player) == "trick") {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && get.type2(card, player) == "trick") {
							return false;
						}
					},
				},
			},
			equip: {
				audio: "dczhanyi",
				charlotte: true,
				marktext: "装",
				mark: true,
				intro: {
					content: "有装备牌进入你的装备区时，可弃置一名其他角色的一张牌",
				},
				trigger: { player: "equipAfter" },
				filter(event, player) {
					return game.hasPlayer(target => target != player && target.countDiscardableCards(player, "he") > 0);
				},
				direct: true,
				content() {
					"step 0";
					player
						.chooseTarget("战意：是否弃置一名其他角色的一张牌？", function (card, player, target) {
							return target != player && target.countDiscardableCards(player, "he") > 0;
						})
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.effect(target, { name: "guohe_copy2" }, player, player);
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("dczhanyi_equip", target);
						player.discardPlayerCard(target, "he", true);
					}
				},
			},
		},
	},
	//李采薇
	yijiao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && !current.hasMark("yijiao");
			});
		},
		filterTarget(card, player, target) {
			return target != player && !target.hasMark("yijiao");
		},
		content() {
			"step 0";
			player
				.chooseControl("10个", "20个", "30个", "40个")
				.set("prompt", "要令" + get.translation(target) + "获得多少标记？")
				.set("ai", function () {
					let player = _status.event.player,
						target = _status.event.getParent().target;
					if (get.attitude(player, target) < 0) {
						return 3;
					}
					return 0;
				});
			"step 1";
			target.addMark("yijiao", 10 * (1 + result.index));
		},
		ai: {
			order: 1.1,
			result: {
				player: 1,
				target: -0.5,
			},
		},
		group: "yijiao_effect",
		subSkill: {
			effect: {
				audio: "yijiao",
				trigger: { global: "phaseJieshuBegin" },
				forced: true,
				filter(event, player) {
					return event.player.isIn() && event.player != player && event.player.hasMark("yijiao");
				},
				logTarget: "player",
				content() {
					var target = trigger.player,
						num = target.countMark("yijiao");
					var num2 = 0;
					target.getHistory("useCard", function (evt) {
						var numz = get.number(evt.card);
						if (typeof numz == "number") {
							num2 += numz;
						}
					});
					if (num > num2) {
						var hs = target.getCards("h", function (card) {
							return lib.filter.cardDiscardable(card, target, "yijiao_effect");
						});
						if (hs.length) {
							target.discard(hs.randomGets(get.rand(1, 3)));
						}
					} else if (num == num2) {
						target.insertPhase();
						player.draw(2);
					} else {
						player.draw(3);
					}
					target.removeMark("yijiao", num);
				},
			},
		},
		intro: {
			onunmark: true,
			name2: "异",
			content: "mark",
		},
	},
	qibie: {
		audio: 2,
		trigger: { global: "die" },
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				!player.hasCard(function (card) {
					return !lib.filter.cardDiscardable(card, player, "qibie");
				}, "h")
			);
		},
		check(event, player) {
			return player.isDamaged() && player.countCards("h", "tao") < Math.max(2, player.hp);
		},
		content() {
			var hs = player.getCards("h");
			player.discard(hs);
			player.recover();
			player.draw(hs.length + 2);
		},
	},
	//严夫人
	channi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget: lib.filter.notMe,
		filterCard: true,
		selectCard: [1, Infinity],
		check(card) {
			let player = _status.event.player,
				num = player.hasSkill("nifu") ? 15 : 8;
			if (ui.selected.cards.length <= Math.max(1, player.needsToDiscard(), player.countCards("h") - 4)) {
				return num - get.value(card);
			}
			return num / 2 - get.value(card);
		},
		position: "h",
		discard: false,
		lose: false,
		delay: false,
		content() {
			"step 0";
			player.give(cards, target);
			player.addTempSkill("channi_effect");
			"step 1";
			if (target.countCards("h") > 0) {
				game.broadcastAll(function (num) {
					lib.skill.channi_backup.selectCard = [1, num];
				}, cards.length);
				var next = target.chooseToUse();
				next.set("openskilldialog", "将至多" + get.cnNumber(cards.length) + "张手牌当做【决斗】使用");
				next.set("norestore", true);
				next.set("addCount", false);
				next.set("_backupevent", "channi_backup");
				next.set("custom", {
					add: {},
					replace: { window() {} },
				});
				next.backup("channi_backup");
			}
			"step 2";
			player.removeSkill("channi_effect");
		},
		subSkill: {
			effect: {
				trigger: { global: ["damageSource", "damageEnd"] },
				filter(event, player, name) {
					if (!event.card || event.card.name != "juedou") {
						return false;
					}
					let evt = event.getParent(2);
					if (!evt || evt.name != "useCard" || evt.card.name != "juedou") {
						return false;
					}
					let user = evt.player;
					let evtx = event.getParent("channi", true);
					if (!evtx || evtx.player != player) {
						return false;
					}
					if (name == "damageSource") {
						return event.source == user && evt.cards.length;
					}
					return event.player == user && player.countCards("h");
				},
				forced: true,
				charlotte: true,
				logTarget(event, player, name) {
					return event[name == "damageSource" ? "source" : "player"];
				},
				content() {
					let evt = trigger.getParent(2);
					if (event.triggername == "damageSource") {
						evt.player.draw(evt.cards.length);
					} else {
						player.chooseToDiscard("h", true, player.countCards("h"));
					}
				},
			},
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				viewAs: { name: "juedou" },
				position: "h",
				filterTarget: lib.filter.targetEnabled,
				ai1: card => {
					if (get.name(card) === "sha") {
						return 0;
					}
					return 5.5 - get.value(card);
				},
				log: false,
			},
		},
		ai: {
			order: 0.3,
			result: {
				target(player, target) {
					if (target == game.me || target.isOnline() || target.hasValueTarget({ name: "juedou" })) {
						return 2;
					}
					if (player.needsToDiscard()) {
						return 0.5;
					}
					return 0;
				},
			},
		},
	},
	nifu: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return player.countCards("h") !== 4;
		},
		content() {
			var num = player.countCards("h") - 4;
			if (num > 0) {
				player.chooseToDiscard("h", num, true);
			} else {
				player.draw(-num);
			}
		},
	},
	//郝萌
	xiongmang: {
		audio: 2,
		enable: "chooseToUse",
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			return player.countCards("hs") > 0;
		},
		selectCard() {
			return [1, 4];
		},
		selectTarget() {
			var card = get.card(),
				player = get.player();
			if (card == undefined) {
				return;
			}
			var range = [1, Math.max(1, ui.selected.cards.length)];
			game.checkMod(card, player, range, "selectTarget", player);
			return range;
		},
		complexCard: true,
		filterCard(card) {
			if (!ui.selected.cards.length) {
				return true;
			}
			var suit = get.suit(card);
			for (var i of ui.selected.cards) {
				if (get.suit(i) == suit) {
					return false;
				}
			}
			return true;
		},
		filterOk() {
			if (!ui.selected.targets.length) {
				return false;
			}
			var card = get.card(),
				player = get.player();
			if (card == undefined) {
				return;
			}
			var range = [1, Math.max(1, ui.selected.cards.length)];
			game.checkMod(card, player, range, "selectTarget", player);
			if ((range[0] <= ui.selected.targets.length && range[1] >= ui.selected.targets.length) || range[0] == -1) {
				return true;
			}
			return false;
		},
		check(card) {
			var player = _status.event.player,
				card = get.autoViewAs({ name: "sha" }, ui.selected.cards.concat(card));
			if (
				game.countPlayer(function (current) {
					return (_status.event.filterTarget || lib.filter.filterTarget)(card, player, current) && get.effect_use(current, card, player, player) > 0;
				}) <= ui.selected.cards.length
			) {
				return 0;
			}
			return 5 - get.value(card);
		},
		position: "hs",
		onuse(links, player) {
			player.addTempSkill("xiongmang_effect");
		},
		ai: {
			order: () => get.order({ name: "sha" }) + 0.2,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				return player.countCards("hs") > 0;
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return event.skill == "xiongmang";
				},
				forced: true,
				popup: false,
				content() {
					if (!game.getGlobalHistory("changeHp", evt => evt.getParent().name == "damage" && evt.getParent().card && evt.getParent().card == trigger.card).length) {
						player.loseMaxHp();
					} else {
						player.addTempSkill("xiongmang_more", ["phaseChange", "phaseAfter"]);
						player.addMark("xiongmang_more", 1, false);
					}
				},
			},
			more: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("xiongmang_more");
						}
					},
				},
				intro: { content: "使用【杀】的额定次数+#" },
			},
		},
	},
	//庞德公
	heqia: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(current => current.countCards(current == player ? "he" : "h") > 0);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt(event.skill),
					prompt2: "操作提示：选择要给出的牌和目标角色，或直接选择一名目标角色，令其将牌交给自己",
					filterCard: true,
					position: "he",
					selectCard() {
						if (ui.selected.targets.length && !ui.selected.targets[0].countCards("h")) {
							return [1, Infinity];
						}
						return [0, Infinity];
					},
					filterTarget(card, player, target) {
						if (player == target) {
							return false;
						}
						if (!ui.selected.cards.length) {
							return target.countCards("h") > 0;
						}
						return true;
					},
					ai1(card) {
						if (!get.event().nogive || ui.selected.cards.length) {
							return 0 - get.value(card);
						}
						return 1 / Math.max(1, get.value(card));
					},
					ai2(target) {
						return (get.attitude(get.player(), target) - 0.1) * (ui.selected.cards.length ? 1 : -1);
					},
					nogive: !game.hasPlayer(current => current != player && get.attitude(player, current) <= 0 && current.countCards("h")),
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			let source, num;
			if (cards?.length) {
				await player.give(cards, target);
				source = target;
				num = cards.length;
			} else if (target.countCards("h")) {
				event.source = target;
				const { result } = await target.chooseToGive(player, "he", true, [1, Infinity], `选择交给${get.translation(player)}任意张牌`).set("ai", card => -get.value(card));
				if (result?.cards?.length) {
					source = player;
					num = result.cards.length;
				}
			}
			event.num = num;
			if (source?.isIn() && source.countCards("h")) {
				const list = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					return source.hasUseTarget({ name: info[2], nature: info[3] }, false);
				});
				if (!list.length) {
					return;
				}
				const { result } = await source.chooseButton(["是否将一张手牌当做一种基本牌使用？", [list, "vcard"]]).set("ai", button => get.player().getUseValue({ name: button.link[2], nature: button.link[3] }, false));
				if (!result?.links?.length) {
					return;
				}
				source.addSkill(event.name + "_add");
				const card = { name: result.links[0][2], nature: result.links[0][3] };
				game.broadcastAll(card => {
					lib.skill.heqia_backup.viewAs = card;
				}, card);
				const next = source.chooseToUse();
				next.set("openskilldialog", "将一张手牌当做" + get.translation(card) + "使用");
				next.set("norestore", true);
				next.set("addCount", false);
				next.set("_backupevent", "heqia_backup");
				next.set("custom", {
					add: {},
					replace: { window() {} },
				});
				next.backup("heqia_backup");
				await next;
			}
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				position: "h",
				filterTarget: lib.filter.targetEnabled,
				selectCard: 1,
				check: card => 6 - get.value(card),
				log: false,
			},
			add: {
				charlotte: true,
				trigger: { player: "useCard2" },
				filter(event, player) {
					const evt = event.getParent(2);
					if (evt.name != "heqia" || !event.targets?.length || typeof evt.num != "number" || evt.num <= event.targets.length) {
						return false;
					}
					const { card } = event,
						info = get.info(card);
					if (info.allowMultiple == false) {
						return false;
					}
					if (event.targets && !info.multitarget) {
						return game.hasPlayer(current => {
							return !event.targets.includes(current) && lib.filter.targetEnabled2(card, event.player, current);
						});
					}
					return false;
				},
				async cost(event, trigger, player) {
					player.removeSkill(event.skill);
					const num = trigger.getParent(2).num - trigger.targets.length;
					const prompt2 = "是否为" + get.translation(trigger.card) + "增加至多" + get.cnNumber(num) + "个目标？";
					event.result = await player
						.chooseTarget(prompt2, [1, num], (card, player, target) => {
							return !get.event().targets.includes(target) && lib.filter.targetEnabled2(get.event().card, get.player(), target);
						})
						.set("ai", target => {
							const trigger = get.event().getTrigger();
							const player = get.player();
							return get.effect(target, trigger.card, player, player);
						})
						.set("card", trigger.card)
						.set("targets", trigger.targets)
						.forResult();
				},
				popup: false,
				async content(event, trigger, player) {
					player.line(event.targets);
					game.log(event.targets, "也成为了", trigger.card, "的目标");
					trigger.targets.addArray(event.targets);
				},
			},
		},
	},
	yinyi: {
		audio: 2,
		trigger: { player: "damageBegin1" },
		forced: true,
		usable: 1,
		filter(event, player) {
			return event.source && event.source.hp != player.hp && !event.hasNature("linked") && event.source.countCards("h") != player.countCards("h");
		},
		content() {
			trigger.cancel();
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage")) {
						if (player.hp == target.hp || lib.linked.includes(get.nature(card))) {
							return;
						}
						var cards = [card];
						if (card.cards && card.cards.length) {
							cards.addArray(card.cards);
						}
						if (ui.selected.cards.length) {
							cards.addArray(ui.selected.cards);
						}
						if (
							player.countCards("h", function (card) {
								return !cards.includes(card);
							}) == target.countCards("h")
						) {
							return;
						}
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	//韩猛
	jieliang: {
		audio: 2,
		trigger: { global: "phaseDrawBegin2" },
		direct: true,
		filter(event, player) {
			return event.player != player && !event.numFixed && event.num > 1 && player.countCards("he") > 0;
		},
		content() {
			"step 0";
			event.target = trigger.player;
			player
				.chooseToDiscard(get.prompt2("jieliang", event.target), "he")
				.set("goon", get.attitude(player, trigger.player) < -2)
				.set("ai", function (card) {
					if (!_status.event.goon) {
						return 0;
					}
					return 7 - get.value(card);
				}).logSkill = ["jieliang", event.target];
			"step 1";
			if (result.bool) {
				trigger.num--;
				if (get.mode() != "identity" || player.identity != "nei") {
					player.addExpose(0.15);
				}
				target.addMark("jieliang_less", 1, false);
				target.addTempSkill("jieliang_less");
				player.addTempSkill("jieliang_gain");
			}
		},
		subSkill: {
			less: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("jieliang_less");
					},
				},
				onremove: true,
				intro: { content: "手牌上限-#" },
			},
			gain: {
				trigger: { global: "loseAfter" },
				charlotte: true,
				direct: true,
				filter(event, player) {
					return event.type == "discard" && event.player == _status.currentPhase && event.getParent(3).name == "phaseDiscard" && event.cards2.filterInD("d").length > 0;
				},
				content() {
					"step 0";
					player.chooseButton(["截粮：是否获得一张牌?", trigger.cards2.filterInD("d")]).set("ai", function (button) {
						return get.value(button.link, _status.event.player);
					});
					"step 1";
					if (result.bool) {
						player.logSkill("jieliang", trigger.player);
						player.gain(result.links, "gain2");
					}
				},
			},
		},
	},
	quanjiu: {
		audio: 2,
		mod: {
			aiOrder(player, card, num) {
				if ((card.name == "jiu" || card.name == "xujiu") && get.name(card) == "sha") {
					return num + 0.5;
				}
			},
			cardname(card, player, name) {
				if (card.name == "jiu" || card.name == "xujiu") {
					return "sha";
				}
			},
		},
		trigger: { player: "useCard1" },
		forced: true,
		filter(event, player) {
			return event.addCount !== false && event.card.isCard && event.card.name == "sha" && event.cards.length == 1 && (event.cards[0].name == "jiu" || event.cards[0].name == "xujiu");
		},
		content() {
			trigger.addCount = false;
			player.getStat().card.sha--;
		},
	},
	//辛评
	fuyuan: {
		audio: 2,
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			var target = _status.currentPhase;
			return target && target != player && target.isIn();
		},
		logTarget(event, player) {
			var target = _status.currentPhase;
			return target.countCards("h") < player.countCards("h") ? target : player;
		},
		check(event, player) {
			var target = lib.skill.fuyuan.logTarget(event, player);
			return get.attitude(player, target) > 0;
		},
		prompt: "是否发动【辅袁】？",
		prompt2(event, player) {
			var target = lib.skill.fuyuan.logTarget(event, player);
			return "令" + get.translation(target) + (target == player ? "（你）" : "") + "摸一张牌";
		},
		content() {
			lib.skill.fuyuan.logTarget(trigger, player).draw();
		},
	},
	zhongjie: {
		audio: 2,
		trigger: { player: "die" },
		direct: true,
		forceDie: true,
		skillAnimation: true,
		animationColor: "gray",
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("zhongjie"), lib.filter.notMe).set("ai", function (target) {
				return get.attitude(_status.event.player, target);
			});
			"step 1";
			if (result.bool) {
				//player.awakenSkill('zhongjie');
				var target = result.targets[0];
				player.logSkill("zhongjie", target);
				target.gainMaxHp();
				target.recover();
				target.draw();
			}
		},
	},
	//张宁
	tianze: {
		audio: 2,
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			if (player === event.player || !event.player.isIn() || player.hasSkill("tianze_block")) {
				return false;
			}
			let evt = event.getParent("phaseUse");
			if (!evt || evt.player !== event.player) {
				return false;
			}
			return (
				get.color(event.card) === "black" &&
				event.player.hasHistory("lose", event2 => {
					return event2 && event2.hs.length && event2.getParent() === event;
				}) &&
				event.player
					.getHistory("useCard", event2 => {
						return event2.getParent("phaseUse") === evt && get.color(event2.card) === "black";
					})
					.indexOf(event) === 0 &&
				player.hasCard(card => {
					if (_status.connectMode && get.position(card) == "h") {
						return true;
					}
					return get.color(card, player) == "black";
				}, "he")
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(
					"he",
					function (card, player) {
						return get.color(card, player) == "black";
					},
					get.prompt(event.skill, trigger.player),
					"弃置一张黑色牌并对其造成1点伤害"
				)
				.set("ai", function (card) {
					if (!_status.event.goon) {
						return 0;
					}
					return 8 - get.value(card);
				})
				.set("goon", get.damageEffect(trigger.player, player, player) > 0)
				.set("logSkill", [event.skill, trigger.player])
				.forResult();
		},
		popup: false,
		async content(event, trigger, player) {
			player.addTempSkill("tianze_block");
			if (get.mode() != "identity" || player.identity != "nei") {
				player.addExpose(0.2);
			}
			await trigger.player.damage();
			await game.asyncDelayx();
		},
		group: "tianze_draw",
		subSkill: {
			block: { charlotte: true },
			draw: {
				audio: "tianze",
				trigger: { global: "judgeEnd" },
				forced: true,
				locked: false,
				filter(event, player) {
					return event.player != player && event.result && event.result.color == "black";
				},
				content() {
					player.draw();
				},
			},
		},
	},
	difa: {
		audio: 2,
		trigger: { player: "gainAfter" },
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (var i of event.cards) {
				if (hs.includes(i) && get.color(i, player) == "red" && lib.filter.cardDiscardable(i, player, "difa")) {
					return true;
				}
			}
			return false;
		},
		async cost(event, trigger, player) {
			let hs = player.getCards("h"),
				cards = trigger.cards.filter(function (i) {
					return hs.includes(i) && get.color(i, player) == "red" && lib.filter.cardDiscardable(i, player, "difa");
				}),
				tricks = [];
			for (let i = 0; i < ui.cardPile.childNodes.length; i++) {
				let card = ui.cardPile.childNodes[i],
					type = get.type2(card, false);
				if (type != "trick" || tricks.includes(type)) {
					continue;
				}
				tricks.push([card.name, get.event().player.getUseValue(card)]);
			}
			for (let i = 0; i < ui.discardPile.childNodes.length; i++) {
				let card = ui.discardPile.childNodes[i],
					type = get.type2(card, false);
				if (type != "trick" || tricks.includes(type)) {
					continue;
				}
				tricks.push([card.name, get.event().player.getUseValue(card)]);
			}
			tricks.sort((a, b) => b[1] - a[1]);
			let result = await player
				.chooseToDiscard(get.prompt2(event.skill), card => {
					return get.event().cards.includes(card);
				})
				.set("ai", card => {
					let val = get.event().val;
					if (typeof val !== "number") {
						return 0;
					}
					return val - get.value(card);
				})
				.set(
					"val",
					(function () {
						if (!tricks.length) {
							return false;
						}
						return 3 * tricks[0][1];
					})()
				)
				.set("cards", cards)
				.forResult();
			event.result = {
				bool: result.bool,
				cost_data: tricks,
			};
		},
		usable: 1,
		async content(event, trigger, player) {
			let list = lib.inpile.filter(function (i) {
				return get.type2(i, false) == "trick";
			});
			if (!list.length) {
				return;
			}
			const result = await player
				.chooseButton(["选择获得一种锦囊牌", [list.map(i => ["锦囊", "", i]), "vcard"]], true)
				.set("ai", function (button) {
					var name = button.link[2];
					for (let i of get.event().list) {
						if (i[0] == name) {
							return i[1];
						}
					}
					return 0;
				})
				.set("list", event.cost_data)
				.forResult();
			if (result.bool) {
				let card = get.cardPile(i => {
					return i.name == result.links[0][2];
				});
				if (card) {
					await player.gain(card, "gain2");
				}
			}
		},
	},
	//童渊
	chaofeng: {
		audio: 2,
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			return player.countCards("h") > 0 && player.isPhaseUsing() && !player.hasSkill("chaofeng_used");
		},
		popup: false,
		async cost(event, trigger, player) {
			let str = "弃置一张手牌并摸一张牌",
				color,
				type;
			if (trigger.card) {
				type = get.type2(trigger.card, false);
				color = get.color(trigger.card, false);
				if (color != "none") {
					str += "；若弃置" + get.translation(color) + "牌则改为摸两张牌";
				}
				if (type) {
					str += "；若弃置类型为" + get.translation(type) + "的牌则伤害+1";
				}
			}
			const next = player.chooseToDiscard("h", get.prompt(event.skill, trigger.player), str);
			next.set("ai", card => {
				const { player, att, color, type } = get.event();
				let val = 4.2 - get.value(card);
				if (get.color(card) == color) {
					val += 3;
				}
				if (get.type2(card) == type) {
					if (att < 0) {
						val += 4;
					} else if (att === 0) {
						val += 2;
					} else {
						val = 0;
					}
				}
				return val;
			});
			next.set("att", get.attitude(player, trigger.player));
			next.logSkill = ["chaofeng", trigger.player];
			if (color != "none") {
				next.set("color", color);
			}
			if (type) {
				next.set("type", type);
			}
			event.result = await next.forResult();
			event.result.cost_data = [color, type];
		},
		async content(event, trigger, player) {
			player.addTempSkill(event.name + "_used", "phaseUseEnd");
			const {
				cards: [card],
				cost_data: [color, type],
			} = event;
			await player.draw(color && get.color(card, card.original == "h" ? player : false) == color ? 2 : 1);
			if (type && get.type2(card, card.original == "h" ? player : false) == type) {
				trigger.num++;
			}
		},
		subSkill: { used: { charlotte: true } },
	},
	chuanshu: {
		audio: 2,
		trigger: { player: ["phaseZhunbeiBegin", "die"] },
		limited: true,
		forceDie: true,
		filter(event, player) {
			return player.isDamaged() && (event.name == "die" || player.isIn()) && game.hasPlayer(current => current != player);
		},
		skillAnimation: true,
		animationColor: "gray",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(lib.filter.notMe, get.prompt2(event.skill))
				.set("ai", target => {
					return get.attitude(get.player(), target);
				})
				.set("forceDie", true)
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const {
				targets: [target],
			} = event;
			await target.addSkills("chaofeng");
			if (player.isIn()) {
				await player.addSkills(get.info(event.name).derivation);
			}
		},
		derivation: ["chaofeng", "ollongdan", "drlt_congjian", "chuanyun"],
		ai: {
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (target.isHealthy() && target.maxHp > 1 && game.hasPlayer(current => current != target && get.attitude(current, target) > 0)) {
							return [1, 1.6];
						}
					} else if (get.tag(card, "recover") && target.getDamagedHp() == 1) {
						return [0, 0];
					}
				},
			},
		},
	},
	longdan_tongyuan: { audio: true },
	ocongjian_tongyuan: { audio: true },
	chuanyun: {
		audio: true,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && event.target.countCards("e") > 0;
		},
		logTarget: "target",
		content() {
			var target = trigger.target;
			card = target.getCards("e").randomGet();
			if (card) {
				target.discard(card);
			}
		},
	},
	//南华老仙
	jinghe: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return !player.hasSkill("jinghe_clear");
		},
		selectCard() {
			if (ui.selected.targets.length) {
				return [ui.selected.targets.length, 4];
			}
			return [1, 4];
		},
		selectTarget() {
			return ui.selected.cards.length;
		},
		filterTarget: true,
		filterCard(card) {
			if (ui.selected.cards.length) {
				var name = get.name(card);
				for (var i of ui.selected.cards) {
					if (get.name(i) == name) {
						return false;
					}
				}
			}
			return true;
		},
		check(card) {
			var player = _status.event.player;
			if (
				game.countPlayer(function (current) {
					return get.attitude(player, current) > 0;
				}) > ui.selected.cards.length
			) {
				return 1;
			}
			return 0;
		},
		position: "h",
		complexCard: true,
		discard: false,
		lose: false,
		delay: false,
		multitarget: true,
		multiline: true,
		content() {
			"step 0";
			player.showCards(cards, get.translation(player) + "发动了【经合】");
			event.skills = lib.skill.jinghe.derivation.randomGets(4);
			player.addTempSkill("jinghe_clear", { player: "phaseBegin" });
			event.targets.sortBySeat();
			event.num = 0;
			"step 1";
			event.target = targets[num];
			event.num++;
			event.target
				.chooseControl(event.skills, "cancel2")
				.set(
					"choiceList",
					event.skills.map(function (i) {
						return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div>";
					})
				)
				.set("displayIndex", false)
				.set("prompt", "选择获得一个技能");
			"step 2";
			var skill = result.control;
			if (skill != "cancel2") {
				event.skills.remove(skill);
				target.addAdditionalSkills("jinghe_" + player.playerid, skill, true);
			}
			if (event.num < event.targets.length) {
				event.goto(1);
			}
			if (target != game.me && !target.isOnline2()) {
				game.delayx();
			}
		},
		ai: {
			threaten: 3,
			order: 10,
			result: {
				target: 1,
			},
		},
		derivation: ["releiji", "rebiyue", "new_retuxi", "remingce", "xinzhiyan", "nhyinbing", "nhhuoqi", "nhguizhu", "nhxianshou", "nhlundao", "nhguanyue", "nhyanzheng"],
		subSkill: {
			clear: {
				onremove(player) {
					game.countPlayer(function (current) {
						current.removeAdditionalSkills("jinghe_" + player.playerid);
					});
				},
			},
		},
	},
	gongxiu: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player.hasSkill("jinghe_clear");
		},
		content() {
			"step 0";
			event.list1 = [];
			event.list2 = [];
			event.addIndex = 0;
			var choices = [];
			game.countPlayer(function (current) {
				if (current.additionalSkills["jinghe_" + player.playerid]) {
					event.list1.push(current);
				} else {
					event.list2.push(current);
				}
			});
			event.list1.sortBySeat();
			if (event.list1.length) {
				choices.push("令" + get.translation(event.list1) + (event.list1.length > 1 ? "各" : "") + "摸一张牌");
			} else {
				event.addIndex++;
			}
			event.list2.sortBySeat();
			if (event.list2.length) {
				choices.push("令" + get.translation(event.list2) + (event.list2.length > 1 ? "各" : "") + "弃置一张手牌");
			}
			player
				.chooseControl("cancel2")
				.set("choiceList", choices)
				.set("prompt", get.prompt("gongxiu"))
				.set("", function () {
					var evt = _status.event.getParent();
					if (
						evt.list2.filter(function (current) {
							return get.attitude(player, current) <= 0 && !current.hasSkillTag("noh");
						}).length -
							evt.list1.length >
						1
					) {
						return 1 - evt.addIndex;
					}
					return 0;
				});
			"step 1";
			if (result.control != "cancel2") {
				if (result.index + event.addIndex == 0) {
					player.logSkill("gongxiu", event.list1);
					game.asyncDraw(event.list1);
				} else {
					player.logSkill("gongxiu", event.list2);
					for (var i of event.list2) {
						i.chooseToDiscard("h", true);
					}
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			game.delayx();
		},
		ai: {
			combo: "jinghe",
		},
	},
	nhyinbing: {
		trigger: { source: "damageBefore" },
		forced: true,
		filter(event, player) {
			return event.card && event.card.name == "sha";
		},
		content() {
			trigger.cancel();
			trigger.player.loseHp(trigger.num);
		},
		group: "nhyinbing_draw",
		subSkill: {
			draw: {
				trigger: { global: "loseHpAfter" },
				forced: true,
				filter(event, player) {
					return player != event.player;
				},
				content() {
					player.draw();
				},
			},
		},
		ai: {
			jueqing: true,
		},
	},
	nhhuoqi: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		position: "he",
		filterCard: true,
		filterTarget(card, player, target) {
			return target.isMinHp();
		},
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			target.recover();
			target.draw();
		},
		ai: {
			order: 1,
			tag: {
				draw: 1,
				recover: 1,
			},
			result: {
				target(player, target) {
					if (target.isDamaged()) {
						return 3;
					}
					if (ui.selected.cards.length) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	nhguizhu: {
		trigger: { global: "dying" },
		usable: 1,
		logTarget: "player",
		frequent: true,
		content() {
			player.draw(2);
		},
	},
	nhxianshou: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		content() {
			target.draw(target.isHealthy() ? 2 : 1);
		},
		ai: {
			order: 1,
			tag: {
				draw: 1,
			},
			result: {
				target(player, target) {
					return target.isHealthy() ? 2 : 0.5;
				},
			},
		},
	},
	nhlundao: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source && player != event.source && player.countCards("h") != event.source.countCards("h");
		},
		logTarget: "source",
		check(event, player) {
			return player.countCards("h") < event.source.countCards("h") || get.effect(event.source, { name: "guohe_copy2" }, player, player) > 0;
		},
		content() {
			if (player.countCards("h") > trigger.source.countCards("h")) {
				player.draw();
			} else {
				player.discardPlayerCard(trigger.source, "he", true);
			}
		},
	},
	nhguanyue: {
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		content() {
			"step 0";
			var cards = get.cards(2);
			player.chooseButton(["观月：选择获得一张牌", cards.slice(0)], true).set("ai", function (button) {
				return get.value(button.link, _status.event.player);
			});
			while (cards.length) {
				ui.cardPile.insertBefore(cards.pop(), ui.cardPile.firstChild);
			}
			"step 1";
			if (result.bool) {
				player.gain(result.links, "gain2");
			}
		},
	},
	nhyanzheng: {
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player
				.chooseCard("h", get.prompt("nhyanzheng"))
				.set(
					"goon",
					(function () {
						var num = player.countCards("h") - 1;
						return (
							game.countPlayer(function (current) {
								return get.damageEffect(current, player, player) > 0;
							}) >= Math.min(3, num)
						);
					})()
				)
				.set("ai", function (card) {
					if (_status.event.goon) {
						return Math.max(1, get.value(card));
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				player.logSkill("nhyanzheng");
				var cards = player.getCards("h", function (card) {
					return card != result.cards[0] && lib.filter.cardDiscardable(card, player, "nhyanzheng");
				});
				if (cards.length) {
					player.discard(cards);
					event.num = cards.length;
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			num = Math.min(num, game.countPlayer());
			player.chooseTarget([1, num], true, "对" + (num > 1 ? "至多" : "") + get.cnNumber(num) + "名角色造成1点伤害").set("ai", function (target) {
				var player = _status.event.player;
				return get.damageEffect(target, player, player);
			});
			"step 3";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				player.line(targets, "green");
				for (var i of targets) {
					i.damage();
				}
			}
		},
	},
	//樊稠
	xinxingluan: {
		audio: "xinfu_xingluan",
		usable: 1,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return player.isPhaseUsing();
		},
		async cost(event, trigger, player) {
			const choiceList = ["观看牌堆中两张点数为6的牌并获得其中一张", "令一名其他角色弃置一张点数为6的牌或交给你一张牌", "获得场上一张点数为6的牌"],
				choices = ["选项一"];
			if (game.hasPlayer(current => current != player && current.countCards("he") > 0)) {
				choices.push("选项二");
			} else {
				choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
			}
			if (
				game.hasPlayer(current => {
					return current.hasCard(function (card) {
						return get.number(card) == 6 && lib.filter.canBeGained(card, current, player);
					}, "ej");
				})
			) {
				choices.push("选项三");
			} else {
				choiceList[2] = `<span style="opacity:0.5">${choiceList[2]}</span>`;
			}
			const result = await player
				.chooseControl(choices, "cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt(event.skill))
				.set("ai", function () {
					var player = _status.event.player;
					if (
						game.hasPlayer(function (current) {
							if (current == player) {
								return false;
							}
							var att = -get.sgn(get.attitude(player, current) - 0.1);
							return current.hasCard(function (card) {
								return get.number(card) == 6 && lib.filter.canBeGained(card, current, player) && get.sgn(get.useful(card, current)) == att;
							}, "ej");
						})
					) {
						return "选项三";
					}
					if (
						game.hasPlayer(function (target) {
							if (target == player) {
								return false;
							}
							var att = get.attitude(player, target);
							return (
								att < 0 &&
								target.countCards("he") > 0 &&
								!target.hasCard(function (card) {
									return get.value(card, target) <= 0;
								}, "he")
							);
						})
					) {
						return "选项二";
					}
					return "选项一";
				})
				.forResult();
			if (result.control !== "cancel2") {
				const results = { bool: true, cost_data: { index: choices.indexOf(result.control) } };
				if (results.cost_data.index === 1) {
					const { targets } = await player
						.chooseTarget("令一名其他角色弃置一张点数为6的牌，否则交给你一张牌", true, function (card, player, current) {
							return current != player && current.countCards("he") > 0;
						})
						.set("ai", function (target) {
							var player = _status.event.player,
								att = get.attitude(player, target);
							if (att >= 0) {
								return 0;
							}
							if (
								!target.hasCard(function (card) {
									return get.value(card, target) <= 0;
								}, "he")
							) {
								return -att / Math.sqrt(target.countCards("he"));
							}
							return 0;
						})
						.forResult();
					results.targets = targets;
				} else if (results.cost_data.index === 2) {
					const { targets } = await player
						.chooseTarget("获得一名角色装备区或判定区内点数为6的牌", true, function (card, player, current) {
							return current.hasCard(function (card) {
								return get.number(card) == 6 && lib.filter.canBeGained(card, current, player);
							}, "ej");
						})
						.set("ai", function (target) {
							var player = _status.event.player,
								att = -get.sgn(get.attitude(player, target) - 0.1),
								max = 0,
								ej = target.getCards("ej", function (card) {
									return get.number(card) == 6 && lib.filter.canBeGained(card, target, player);
								});
							for (var i of ej) {
								var num = get.useful(i, target) * att;
								if (num > max) {
									max = num;
								}
								return max;
							}
						})
						.forResult();
					results.targets = targets;
				}
				event.result = results;
			}
		},
		content() {
			"step 0";
			var result = event.cost_data;
			if (result.index === 1) {
				event.goto(4);
			} else if (result.index === 2) {
				event.goto(3);
			}
			"step 1";
			var cards = [];
			while (cards.length < 2) {
				var card = get.cardPile2(function (card) {
					return !cards.includes(card) && get.number(card) == 6;
				});
				if (!card) {
					break;
				}
				cards.push(card);
			}
			if (!cards.length) {
				player.draw(6);
				event.finish();
			} else if (cards.length == 1) {
				event._result = { bool: true, links: cards };
			} else {
				player.chooseButton(["兴乱：选择获得其中一张", cards], true).set("ai", function (button) {
					return get.value(button.link, _status.event.player);
				});
			}
			"step 2";
			if (result.bool) {
				player.gain(result.links, "gain2");
			}
			event.finish();
			"step 3";
			var target = targets[0];
			player.gainPlayerCard(target, "ej", true).set("filterButton", function (button) {
				return get.number(button.link) == 6;
			});
			event.finish();
			"step 4";
			var target = targets[0];
			event.target = target;
			target.chooseToDiscard("he", "弃置一张点数为6的牌，否则交给" + get.translation(player) + "一张牌", function (card) {
				return get.number(card) == 6;
			}).ai = card => 8 - get.value(card);
			"step 5";
			if (!result.bool) {
				target.chooseCard("he", true, "交给" + get.translation(player) + "一张牌");
			} else {
				event.finish();
			}
			"step 6";
			if (result.bool) {
				target.give(result.cards, player, "giveAuto");
			}
		},
	},
	rexingluan: {
		audio: "xinfu_xingluan",
		usable: 1,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return event.targets && event.targets.length == 1 && typeof get.number(event.card, false) == "number" && player.isPhaseUsing();
		},
		direct: true,
		content() {
			"step 0";
			var str = "",
				num = get.number(trigger.card, false),
				nums = get.strNumber(num);
			var list = game.filterPlayer(function (current) {
				return current.hasCard(function (card) {
					return get.number(card) == num && lib.filter.canBeGained(card, current, player);
				}, "ej");
			});
			if (list.length) {
				str += "获得一名角色装备区或判定区内的一张点数为" + nums + "的牌，或直接从牌堆中获得一张点数为" + nums + "的牌";
				player
					.chooseTarget(get.prompt("rexingluan"), str, [0, 1], function (card, player, target) {
						return _status.event.targets.includes(target);
					})
					.set("targets", list)
					.set("ai", function (target) {
						if (!target) {
							return 1;
						}
						var player = _status.event.player,
							num = get.number(_status.event.getTrigger().card, false),
							att = -get.sgn(get.attitude(player, target));
						if (
							target.hasCard(function (card) {
								return get.number(card) == num && get.effect(target, card, target, player) < 0;
							}, "j")
						) {
							return 1.2 * Math.abs(get.attitude(player, target));
						}
						if (
							target.hasCard(function (card) {
								return get.number(card) == num && get.sgn(get.value(card, target) + 0.1) == att;
							}, "e")
						) {
							return Math.abs(get.attitude(player, target));
						}
						return 0;
					});
			} else {
				player.chooseBool(get.prompt("rexingluan"), "从牌堆中获得一张点数为" + nums + "的牌").ai = () => true;
			}
			"step 1";
			if (result.bool) {
				if (result.targets && result.targets.length) {
					var target = result.targets[0];
					player.logSkill("rexingluan", target);
					player
						.gainPlayerCard(target, "ej", true)
						.set("num", get.number(trigger.card, false))
						.set("filterButton", function (button) {
							return get.number(button.link) == _status.event.num;
						});
				} else {
					player.logSkill("rexingluan");
					var num = get.number(trigger.card, false),
						card = get.cardPile2(function (i) {
							return get.number(i, false) == num;
						}, "random");
					if (card) {
						player.gain(card, "gain2");
					}
				}
			}
		},
	},
	//杜夫人
	yise: {
		audio: 2,
		trigger: {
			global: "gainAfter",
			player: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.name == "loseAsync") {
				if (event.type != "gain") {
					return false;
				}
			}
			var cards = event.getl(player).cards2;
			return game.hasPlayer(function (current) {
				if (current == player) {
					return false;
				}
				var cardsx = event.getg(current);
				for (var i of cardsx) {
					if (cards.includes(i)) {
						if (current.isDamaged()) {
							return true;
						}
						return get.color(i, player) == "black";
					}
				}
				return false;
			});
		},
		direct: true,
		content() {
			"step 0";
			var cards = trigger.getl(player).cards2;
			event.cards = cards;
			event.targets = game
				.filterPlayer(function (current) {
					if (current == player) {
						return false;
					}
					var cardsx = trigger.getg(current);
					for (var i of cardsx) {
						if (cards.includes(i)) {
							return true;
						}
					}
					return false;
				})
				.sortBySeat();
			if (!event.targets.length) {
				event.finish();
			}
			"step 1";
			var target = targets.shift();
			var cardsx = trigger.getg(target);
			var goon = false;
			for (var i of cardsx) {
				if (cards.includes(i)) {
					if (target.isDamaged() || get.color(i, player) == "black") {
						goon = true;
						break;
					}
				}
			}
			if (goon) {
				var next = game.createEvent("yise_insert");
				next.player = player;
				next.target = target;
				next.cards = cardsx;
				next.setContent(lib.skill.yise.contentx);
			}
			if (targets.length > 0) {
				event.redo();
			}
		},
		contentx() {
			"step 0";
			for (var i of cards) {
				event[get.color(i, player)] = true;
				if (event.red && event.black) {
					break;
				}
			}
			if (event.red && target.isDamaged()) {
				player.chooseBool(get.prompt("yise", target), "令" + get.translation(target) + "回复1点体力").set("ai", () => get.recoverEffect(_status.event.getParent().target, _status.event.player, _status.event.player) > 0);
			}
			"step 1";
			if (event.black || (event.red && result.bool)) {
				player.logSkill("yise", target);
			}
			if (event.red && result.bool) {
				target.recover();
			}
			if (event.black) {
				target.addMark("yise_damage", 1, false);
				target.addSkill("yise_damage");
			}
		},
		subSkill: {
			damage: {
				trigger: { player: "damageBegin1" },
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return event.card && event.card.name == "sha" && event.getParent().name == "sha";
				},
				content() {
					trigger.num += player.countMark("yise_damage");
					player.removeSkill("yise_damage");
				},
				intro: {
					content: "下一次受到杀的伤害+#",
				},
			},
		},
	},
	shunshi: {
		audio: 2,
		trigger: { player: ["damageEnd", "phaseZhunbeiBegin"] },
		direct: true,
		filter(event, player) {
			return (
				(event.name != "damage" || player != _status.currentPhase) &&
				player.countCards("he") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && current != event.source;
				})
			);
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt("shunshi"),
				prompt2: "将一张牌交给一名其他角色，并获得+1效果",
				filterCard: true,
				filterTarget(card, player, target) {
					return target != player && target != _status.event.source;
				},
				position: "he",
				source: trigger.source,
				ai1(card) {
					var player = _status.event.player;
					if (player.hasSkill("yise")) {
						if (
							get.color(card, player) == "red" &&
							game.hasPlayer(function (current) {
								return current != player && current != _status.event.source && current.isDamaged() && get.recoverEffect(current, player, player) > 0;
							})
						) {
							return 10 - get.value(card);
						}
						if (get.color(card, player) == "black") {
							return 4 - get.value(card);
						}
					}
					return 8 - get.value(card);
				},
				ai2(target) {
					var player = _status.event.player,
						card = ui.selected.cards[0];
					if (player.hasSkill("yise")) {
						if (get.color(card) == "red" && target.isDamaged()) {
							return 2 * get.recoverEffect(target, player, player);
						}
						if (get.color(card) == "black") {
							return -get.attitude(player, target);
						}
					}
					if (get.value(card, target) < 0) {
						return -get.attitude(player, target);
					}
					if (get.value(card, target) < 1) {
						return 0.01 * -get.attitude(player, target);
					}
					return Math.max(1, get.value(card, target) - get.value(card, player)) * get.attitude(player, target);
				},
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("shunshi", target);
				player.give(result.cards, target);
				player.addMark("shunshi_mark", 1, false);
				player.addTempSkill("shunshi_mark", { player: "phaseEnd" });
			}
		},
		subSkill: {
			mark: {
				onremove: true,
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return !event.numFixed;
				},
				content() {
					trigger.num += player.countMark("shunshi_mark");
				},
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("shunshi_mark");
					},
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("shunshi_mark");
						}
					},
				},
				intro: {
					content: "拥有#层效果",
				},
			},
		},
	},
	xianwei: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.hasEnabledSlot();
		},
		content() {
			"step 0";
			player.chooseToDisable().ai = function (event, player, list) {
				var getVal = function (num) {
					var card = player.getEquip(num);
					if (card) {
						var val = get.value(card);
						if (val > 0) {
							return 0;
						}
						return 5 - val;
					}
					switch (num) {
						case "equip3":
							return 4.5;
						case "equip4":
							return 4.4;
						case "equip5":
							return 4.3;
						case "equip2":
							return (3 - player.hp) * 1.5;
						case "equip1": {
							if (
								game.hasPlayer(function (current) {
									return (get.realAttitude || get.attitude)(player, current) < 0 && get.distance(player, current) > 1;
								})
							) {
								return 0;
							}
							return 3.2;
						}
					}
				};
				list.sort(function (a, b) {
					return getVal(b) - getVal(a);
				});
				return list[0];
			};
			"step 1";
			var cardType = result.control;
			event.cardType = cardType;
			var num = player.countDisabledSlot();
			if (num < 5) {
				player.draw(5 - num);
			}
			if (!game.hasPlayer(current => current != player)) {
				return;
			}
			player
				.chooseTarget(lib.filter.notMe, true, "令一名其他角色从牌堆中使用一张" + get.translation(cardType) + "牌")
				.set("ai", function (target) {
					var player = _status.event.player,
						type = _status.event.cardType;
					var card = get.cardPile2(function (card) {
						return get.subtype(card) == type && target.canUse(card, target);
					});
					if (!card) {
						return 0;
					}
					return get.effect(target, card, target, player);
				})
				.set("cardType", event.cardType);
			"step 2";
			if (!result.bool) {
				return;
			}
			var target = result.targets[0];
			player.line(target, "green");
			var card = get.cardPile2(function (card) {
				return get.subtype(card) == event.cardType && target.canUse(card, target);
			});
			if (card) {
				target.chooseUseTarget(card, "nopopup", true);
			} else {
				target.draw();
			}
		},
		group: "xianwei_all",
		subSkill: {
			all: {
				audio: "xianwei",
				trigger: { player: "disableEquipAfter" },
				forced: true,
				filter(event, player) {
					return !player.hasEnabledSlot();
				},
				content() {
					player.gainMaxHp(2);
					player.addSkill("xianwei_effect");
				},
			},
			effect: {
				charlotte: true,
				mark: true,
				intro: { content: "和其他角色视为在彼此的攻击范围内" },
				mod: {
					inRange: () => true,
					inRangeOf: () => true,
				},
			},
		},
	},
	rehuoshui: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		content() {
			"step 0";
			var num = Math.min(game.countPlayer() - 1, Math.max(1, player.getDamagedHp()));
			var str;
			if (num > 1) {
				str = "选择至多" + get.cnNumber(num) + "名其他角色。";
				var list = ["第一名角色的非锁定技失效直到回合结束", "；第二名角色交给你一张手牌", "；第三名及之后角色弃置装备区内的所有牌"];
				for (var i = 0; i < Math.min(3, num); i++) {
					str += list[i];
				}
				str += "。";
			} else {
				str = "令一名其他角色的非锁定技本回合内失效";
			}
			player.chooseTarget([1, num], get.prompt("rehuoshui"), str, lib.filter.notMe).set("ai", function (target) {
				var att = -get.attitude(_status.event.player, target);
				if (att <= 0) {
					return 0;
				}
				if (target.hasSkillTag("maixie") || target.hasSkill("maixie_hp") || target.hasSkill("maixie_defed")) {
					att *= 3;
				}
				return att / get.threaten(target);
			});
			"step 1";
			if (result.bool) {
				var targets = result.targets;
				player.logSkill("rehuoshui", targets);
				event.targets = targets;
				targets[0].addTempSkill("fengyin");
				if (targets.length < 2) {
					event.goto(6);
				}
			} else {
				event.finish();
			}
			"step 2";
			if (targets[1].countCards("h") == 0) {
				event.goto(targets.length > 2 ? 4 : 6);
			} else {
				targets[1].chooseCard("h", true, "交给" + get.translation(player) + "一张手牌");
			}
			"step 3";
			if (result.bool) {
				targets[1].give(result.cards, player);
			}
			"step 4";
			if (targets.length < 3) {
				event.goto(6);
			} else {
				targets.splice(0, 2);
			}
			"step 5";
			var target = targets.shift();
			var num = target.countCards("e");
			if (num > 0) {
				target.chooseToDiscard("e", true, num);
			}
			if (targets.length > 0) {
				event.redo();
			}
			"step 6";
			game.delayx();
		},
	},
	reqingcheng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => lib.skill.reqingcheng.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target != player && target.hasSex("male") && target.countCards("h") <= player.countCards("h");
		},
		content() {
			player.swapHandcards(target);
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (target.countCards("h") > 0) {
						return -Math.max(get.value(target.getCards("h"), player) - get.value(player.getCards("h"), player), 0);
					}
					return 0;
				},
			},
		},
	},
	//丘力居
	koulve: {
		audio: 2,
		trigger: { source: "damageSource" },
		logTarget: "player",
		filter(event, player) {
			return event.player.isDamaged() && event.player.countCards("h") > 0 && player.isPhaseUsing();
		},
		check(event, player) {
			if (player.hp == 1 && player.isHealthy()) {
				return false;
			}
			return get.attitude(player, event.player) <= 0;
		},
		content() {
			"step 0";
			player.choosePlayerCard(trigger.player, "h", true, trigger.player.getDamagedHp());
			"step 1";
			var card = result.cards;
			event.cards = card;
			player.showCards(card, get.translation(player) + "发动了【宼略】");
			"step 2";
			var gains = [],
				red = false;
			var target = trigger.player;
			for (var card of cards) {
				var type = get.type2(card, target);
				if ((type == "basic" || type == "trick") && get.tag(card, "damage") > 0) {
					gains.push(card);
				}
				if (!red && get.color(card, target) == "red") {
					red = true;
				}
			}
			if (gains.length) {
				player.gain(gains, "give");
			}
			if (!red) {
				event.finish();
			}
			"step 3";
			player[player.isDamaged() ? "loseMaxHp" : "loseHp"]();
			player.draw(2);
		},
	},
	qljsuiren: {
		audio: 2,
		trigger: { player: "die" },
		direct: true,
		forceDie: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return player.countCards("h", function (card) {
				var type = get.type(card, null, player);
				return (type == "basic" || type == "trick") && get.tag(card, "damage") > 0;
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(lib.filter.notMe, get.prompt("qljsuiren"), "将所有伤害性基本牌和锦囊牌交给一名其他角色")
				.set("forceDie", true)
				.set("ai", function (target) {
					var player = _status.event.player,
						cards = _status.event.aiCards;
					var att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					if (target.hasSkillTag("nogain")) {
						att /= 100;
					}
					var num = 0.1;
					for (var i of cards) {
						num += Math.max(0, target.getUseValue(card));
					}
					return num * att;
				})
				.set(
					"aiCards",
					player.getCards("h", function (card) {
						var type = get.type(card, null, player);
						return (type == "basic" || type == "trick") && get.tag(card, "damage") > 0;
					})
				);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("qljsuiren", target);
				player.give(
					player.getCards("h", function (card) {
						var type = get.type(card, null, player);
						return (type == "basic" || type == "trick") && get.tag(card, "damage") > 0;
					}),
					target,
					"give"
				);
			}
		},
	},
	//胡车儿
	redaoji: {
		audio: 2,
		trigger: { global: "useCard" },
		direct: true,
		filter(event, player) {
			if (player == event.player || get.subtype(event.card, false) != "equip1" || (event.player.isDead() && !event.cards.filterInD().length)) {
				return false;
			}
			var all = event.player.getAllHistory("useCard");
			for (var i of all) {
				if (get.subtype(i.card, false) == "equip1") {
					return i == event;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var list = [];
			event.addIndex = 0;
			if (trigger.cards.filterInD().length > 0) {
				list.push("获得" + get.translation(trigger.cards.filterInD()));
			} else {
				event.addIndex++;
			}
			if (trigger.player.isIn()) {
				list.push("令" + get.translation(trigger.player) + "本回合不能使用或打出【杀】");
			}
			player
				.chooseControl("cancel2")
				.set("choiceList", list)
				.set("prompt", get.prompt("redaoji", trigger.player))
				.set("ai", function () {
					var evt = _status.event.getParent(),
						player = evt.player,
						evt2 = evt._trigger;
					if (evt.addIndex == 0) {
						var noob = get.attitude(player, evt2.player) < 0 ? 1 : "cancel2";
						if (player.countMark("fuzhong") == 3) {
							return noob;
						}
						if (get.effect(evt2.targets[0], evt2.card, evt2.player, player) <= 0) {
							return 0;
						}
						return noob;
					}
					return get.attitude(player, evt2.player) < 0 ? 0 : "cancel2";
				});
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("redaoji", trigger.player);
				game.delayx();
				if (result.index + event.addIndex == 0) {
					player.gain(trigger.cards.filterInD(), "gain2");
				} else {
					trigger.player.addTempSkill("redaoji2");
				}
			}
		},
	},
	redaoji2: {
		charlotte: true,
		mark: true,
		mod: {
			cardEnabled(card) {
				if (card.name == "sha") {
					return false;
				}
			},
			cardRespondable(card) {
				if (card.name == "sha") {
					return false;
				}
			},
		},
		intro: {
			content: "本回合不能使用或打出杀",
		},
	},
	fuzhong: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		filter(event, player) {
			return player.countMark("fuzhong") > 3;
		},
		content() {
			"step 0";
			player.chooseTarget(lib.filter.notMe, "对一名其他角色造成1点伤害", true).set("ai", function (target) {
				var player = _status.event.player;
				return get.damageEffect(target, player, player);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				target.damage("nocard");
			}
			player.removeMark("fuzhong", 4);
		},
		marktext: "重",
		intro: { content: "mark" },
		group: ["fuzhong_gain", "fuzhong_yingzi"],
		mod: {
			maxHandcard(player, num) {
				if (player.countMark("fuzhong") > 2) {
					return num + 3;
				}
			},
			globalFrom(player, target, num) {
				if (player.countMark("fuzhong") > 1) {
					return num - 2;
				}
			},
		},
		subSkill: {
			gain: {
				audio: "fuzhong",
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				forced: true,
				filter(event, player) {
					return player != _status.currentPhase && event.getg(player).length > 0;
				},
				content() {
					player.addMark("fuzhong", 1);
				},
			},
			yingzi: {
				audio: "fuzhong",
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				filter(event, player) {
					return !event.numFixed && player.countMark("fuzhong") > 0;
				},
				content() {
					trigger.num++;
				},
			},
		},
	},
	//董承
	xuezhao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.maxHp > 0 && player.countCards("h") > 0;
		},
		filterCard: true,
		position: "h",
		filterTarget: lib.filter.notMe,
		selectTarget() {
			return [1, _status.event.player.maxHp];
		},
		check(card) {
			return 2 * (_status.event.player.maxHp + 2) - get.value(card);
		},
		content() {
			"step 0";
			if (!target.countCards("he")) {
				event._result = { bool: false };
			} else {
				target.chooseCard("he", "交给" + get.translation(player) + "一张牌并摸一张牌，或不能响应其使用的牌直到回合结束").set("ai", function (card) {
					var player = _status.event.player,
						target = _status.event.getParent().player,
						val = get.value(card);
					if (get.attitude(player, target) > 0) {
						if (get.name(card, target) == "sha" && target.hasValueTarget(card)) {
							return 30 - val;
						}
						return 20 - val;
					}
					return -val;
				});
			}
			"step 1";
			if (result.bool) {
				player.addTempSkill("xuezhao_sha");
				player.addMark("xuezhao_sha", 1, false);
				target.give(result.cards, player);
				target.draw();
			} else {
				player.addTempSkill("xuezhao_hit");
				player.markAuto("xuezhao_hit", [target]);
			}
		},
		contentAfter() {
			if (!player.getHistory("gain", evt => evt.getParent("useSkill") == event.getParent("useSkill")).length) {
				player.drawTo(player.maxHp);
			}
		},
		ai: {
			threaten: 2.4,
			order: 3.6,
			result: {
				player(player, target) {
					if (get.attitude(target, player) > 0) {
						if (
							target.countCards("e", function (card) {
								return get.value(card, target) < 0;
							})
						) {
							return 3;
						}
						return Math.sqrt(target.countCards("he"));
					}
					if (
						target.mayHaveShan(player, "use") &&
						player.countCards("hs", function (card) {
							return !ui.selected.cards.includes(card) && get.name(card) == "sha" && player.canUse(card, target) && get.effect(target, card, player, player) != 0;
						})
					) {
						return -Math.sqrt(Math.abs(get.attitude(player, target))) / 2;
					}
					return 0.1;
				},
			},
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				marktext: "血",
				intro: { content: "多杀#刀，誓诛曹贼！" },
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("xuezhao_sha");
						}
					},
				},
			},
			hit: {
				charlotte: true,
				onremove: true,
				marktext: "诏",
				intro: { content: "$篡汉，其心可诛！" },
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				content() {
					trigger.directHit.addArray(player.getStorage("xuezhao_hit"));
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return player.getStorage("xuezhao_hit").includes(arg.target);
					},
				},
			},
		},
	},
	//唐姬
	kangge: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		direct: true,
		filter(event, player) {
			return player.phaseNumber == 1 && !player.storage.kangge && game.hasPlayer(current => current != player);
		},
		content() {
			"step 0";
			player.chooseTarget("请选择【抗歌】的目标", "其于回合外摸牌后，你摸等量的牌；其进入濒死状态时，你可令其回复体力至1点；其死亡后，你弃置所有牌并失去1点体力", lib.filter.notMe, true).set("ai", function (target) {
				return get.attitude(_status.event.player, target);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("kangge", target);
				if (get.mode() != "identity" || player.identity != "nei") {
					if (target.identityShown || (typeof target.ai.expose == "number" && target.ai.expose > 0.5)) {
						player.addExpose(0.4);
					}
				}
				player.addSkill("kangge_clear");
				player.storage.kangge = target;
				player.markSkill("kangge");
				game.delayx();
			}
		},
		intro: { content: "已指定$为目标" },
		group: ["kangge_draw", "kangge_dying", "kangge_die"],
		subSkill: {
			draw: {
				audio: "kangge",
				trigger: {
					global: ["gainAfter", "loseAsyncAfter"],
				},
				forced: true,
				filter(event, player) {
					if (player.countMark("kangge_draw") >= 3) {
						return false;
					}
					var target = player.storage.kangge;
					return target && target != _status.currentPhase && event.getg(target).length > 0;
				},
				logTarget: "player",
				content() {
					var num = Math.min(3 - player.countMark("kangge_draw"), trigger.getg(player.storage.kangge).length);
					player.addMark("kangge_draw", num, false);
					player.draw(num);
				},
			},
			clear: {
				trigger: { global: "phaseBeginStart" },
				forced: true,
				firstDo: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return player.countMark("kangge_draw") > 0;
				},
				content() {
					player.removeMark("kangge_draw", player.countMark("kangge_draw"), false);
				},
			},
			dying: {
				audio: "kangge",
				trigger: { global: "dying" },
				logTarget: "player",
				filter(event, player) {
					return event.player == player.storage.kangge && event.player.hp < 1 && !player.hasSkill("kangge_temp");
				},
				check(event, player) {
					return get.attitude(player, event.player) > 0;
				},
				prompt2: "令其将体力值回复至1点",
				content() {
					trigger.player.recover(1 - trigger.player.hp);
					player.addTempSkill("kangge_temp", "roundStart");
				},
			},
			temp: {},
			die: {
				audio: "kangge",
				trigger: { global: "dieAfter" },
				filter(event, player) {
					return event.player == player.storage.kangge;
				},
				forced: true,
				content() {
					var cards = player.getCards("he");
					if (cards.length) {
						player.discard(cards);
					}
					player.loseHp();
				},
			},
		},
		ai: {
			threaten: 2,
		},
	},
	jielie: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		direct: true,
		filter(event, player) {
			return (!event.source || (event.source != player && event.source != player.storage.kangge)) && player.storage.kangge && player.storage.kangge.isIn();
		},
		content() {
			"step 0";
			player
				.chooseControl(lib.suit.slice(0), "cancel2")
				.set("prompt", get.prompt("jielie"))
				.set("prompt2", "防止伤害并改为失去等量体力，且令" + get.translation(player.storage.kangge) + "从弃牌堆中随机获得等量的花色牌")
				.set("ai", function () {
					var player = _status.event.player;
					if (get.attitude(player, player.storage.kangge) <= 0) {
						return "cancel2";
					}
					return lib.suit.randomGet();
				});
			"step 1";
			if (result.control != "cancel2") {
				event.suit = result.control;
				player.logSkill("jielie", player.storage.kangge);
				trigger.cancel();
				player.loseHp(trigger.num);
			} else {
				event.finish();
			}
			"step 2";
			var cards = [];
			while (cards.length < trigger.num) {
				var card = get.discardPile(function (card) {
					return get.suit(card, false) == event.suit && !cards.includes(card);
				}, "random");
				if (card) {
					cards.push(card);
				} else {
					break;
				}
			}
			if (cards.length) {
				player.storage.kangge.gain(cards, "gain2");
			}
		},
	},
	//张横
	dangzai: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return (
				!player.isDisabledJudge() &&
				game.hasPlayer(function (current) {
					return (
						current != player &&
						current.countCards("j", function (card) {
							return player.canAddJudge(card);
						}) > 0
					);
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					function (card, player, target) {
						return (
							target != player &&
							target.countCards("j", function (card) {
								return player.canAddJudge(card);
							}) > 0
						);
					},
					get.prompt(event.skill),
					"将一名其他角色判定区内的任意张牌移动到你的判定区内"
				)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.choosePlayerCard(target, "j", true, [1, Infinity])
				.set("filterButton", function (button) {
					return _status.event.player.canAddJudge(button.link);
				})
				.forResult();
			if (result.bool && result.cards) {
				while (result.cards.length) {
					const card = result.cards.shift();
					target.$give(card, player);
					await game.delay();
					const name = card.viewAs || card.name;
					if (card.name != name) {
						await player.addJudge(name, card);
					} else {
						await player.addJudge(card);
					}
				}
			}
		},
	},
	liangjue: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		getIndex(event, player, triggername) {
			let num = 0;
			if (event.player == player) {
				if (event.name == "equip" && get.color(event.card, player) == "black") {
					num++;
				}
				if (event.name == "addJudge" && get.color(event.cards[0], player) == "black") {
					num++;
				}
			}
			if (!event.getl) {
				return num;
			}
			let evt = event.getl(player);
			if (evt.es && evt.es.length) {
				for (var i of evt.es) {
					if (get.color(i, player) == "black") {
						num++;
					}
				}
			}
			if (evt.js && evt.js.length) {
				for (var i of evt.js) {
					if (get.color(i, player) == "black") {
						num++;
					}
				}
			}
			return num;
		},
		async content(event, trigger, player) {
			await player.draw(2);
			if (player.hp > 1) {
				await player.loseHp();
			}
		},
	},
	//狼灭
	langmie: {
		audio: 2,
		trigger: { global: "phaseUseEnd" },
		//forced:true,
		filter(event, player) {
			if (player == event.player || !player.countCards("he")) {
				return false;
			}
			var map = {};
			var list = event.player.getHistory("useCard", function (evt) {
				var evt2 = evt.getParent("phaseUse");
				return evt2 == event;
			});
			for (var i of list) {
				var name = get.type2(i.card, false);
				if (!map[name]) {
					map[name] = true;
				} else {
					return true;
				}
			}
		},
		frequent: true,
		content() {
			player.draw();
		},
		group: "langmie_damage",
	},
	langmie_damage: {
		audio: "langmie",
		trigger: { global: "phaseEnd" },
		direct: true,
		sourceSkill: "langmie",
		filter(event, player) {
			return event.player != player && (event.player.getStat("damage") || 0) > 1 && player.countCards("he") > 0;
		},
		content() {
			"step 0";
			player
				.chooseToDiscard("he", get.prompt("langmie", trigger.player), "弃置一张牌并对其造成1点伤害")
				.set("goon", get.damageEffect(trigger.player, player, player) > 0)
				.set("ai", function (card) {
					if (!_status.event.goon) {
						return 0;
					}
					return 7 - get.value(card);
				}).logSkill = ["langmie_damage", trigger.player];
			"step 1";
			if (result.bool) {
				trigger.player.damage();
			}
		},
		ai: { expose: 0.2 },
	},
	//牛金
	recuorui: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return (
				player.hp > 0 &&
				game.hasPlayer(function (current) {
					return current != player && current.countGainableCards(player, "h") > 0;
				})
			);
		},
		filterTarget(card, player, target) {
			return target != player && target.countGainableCards(player, "h") > 0;
		},
		selectTarget() {
			return [1, _status.event.player.hp];
		},
		content() {
			if (num == 0) {
				player.awakenSkill(event.name);
			}
			player.gainPlayerCard(target, true, "h");
		},
		ai: {
			order: 10,
			result: {
				player: 1,
				target(player, target) {
					if (target.hasSkillTag("noh")) {
						return 0;
					}
					return -1;
				},
			},
		},
	},
	reliewei: {
		audio: 2,
		trigger: { global: "dying" },
		filter(event, player) {
			return player == _status.currentPhase || player.getHistory("useSkill", evt => evt.skill == "reliewei").length < player.getHp();
		},
		frequent: true,
		content() {
			player.draw();
		},
	},
	//张邈
	mouni: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("h", "sha") > 0;
		},
		content() {
			"step 0";
			player.addSkill("mouni2");
			player.chooseTarget(get.prompt2("mouni"), lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player,
					cards = player.getCards("h", "sha");
				if (
					get.attitude(player, target) >= 0 ||
					!player.canUse(cards[0], target, false) ||
					(!player.hasJudge("lebu") &&
						target.mayHaveShan(player, "use") &&
						!player.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: target,
								card: cards[0],
							},
							true
						))
				) {
					return 0;
				}
				return get.effect(target, cards[0], player, player);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("mouni", target);
				event.cards = player.getCards("h", "sha");
			} else {
				event.finish();
			}
			"step 2";
			if (event.mouni_dying) {
				return;
			}
			var hs = player.getCards("h");
			cards = cards.filter(function (card) {
				return (
					hs.includes(card) &&
					get.name(card, player) == "sha" &&
					player.canUse(
						{
							name: "sha",
							nature: get.nature(card, player),
							isCard: true,
							cards: [card],
						},
						target,
						false
					)
				);
			});
			if (cards.length) {
				var card = cards.randomRemove(1)[0];
				player.useCard(target, false, card);
				event.redo();
			}
			"step 3";
			if (
				player.getHistory("useCard", function (evt) {
					return (
						evt.getParent() == event &&
						!player.getHistory("sourceDamage", function (evt2) {
							return evt.card == evt2.card;
						}).length
					);
				}).length
			) {
				player.skip("phaseUse");
				player.skip("phaseDiscard");
			}
			player.removeSkill("mouni2");
		},
	},
	mouni2: {
		charlotte: true,
		trigger: { global: "dying" },
		forced: true,
		firstDo: true,
		popup: false,
		sourceSkill: "mouni",
		filter(event, player) {
			var evt = event.getParent("mouni");
			return evt && evt.player == player && evt.target == event.player;
		},
		content() {
			trigger.getParent("mouni").mouni_dying = true;
		},
	},
	zongfan: {
		derivation: "zhangu",
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return (
				!player.getHistory("skipped").includes("phaseUse") &&
				player.getHistory("useCard", function (evt) {
					return evt.getParent().name == "mouni";
				}).length > 0
			);
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			var num = player.countCards("he");
			if (num > 0) {
				player.chooseCardTarget({
					prompt: "是否将任意张牌交给一名其他角色？",
					selectCard: [1, num],
					filterCard: true,
					filterTarget: lib.filter.notMe,
					position: "he",
					ai1(card) {
						if (card.name == "du") {
							return 10;
						} else if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
							return 0;
						}
						var player = _status.event.player;
						if (
							ui.selected.cards.length > 4 ||
							!game.hasPlayer(function (current) {
								return get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
							})
						) {
							return 0;
						}
						return 1 / Math.max(0.1, get.value(card));
					},
					ai2(target) {
						var player = _status.event.player,
							att = get.attitude(player, target);
						if (ui.selected.cards[0].name == "du") {
							return -att;
						}
						if (target.hasSkillTag("nogain")) {
							att /= 6;
						}
						return att;
					},
				});
			} else {
				event.goto(2);
			}
			"step 1";
			if (result.bool) {
				var cards = result.cards,
					target = result.targets[0],
					num = Math.min(5, cards.length);
				player.give(cards, target);
				player.gainMaxHp(num);
				player.recover(num);
			}
			"step 2";
			//player.removeSkill('mouni');
			player.changeSkills(["zhangu"], ["mouni"]);
		},
		ai: {
			combo: "mouni",
		},
	},
	zhangu: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.maxHp > 1 && (player.countCards("h") == 0 || player.countCards("e") == 0);
		},
		content() {
			var cards = [],
				types = [];
			for (var i = 0; i < 3; i++) {
				var card = get.cardPile2(function (card) {
					return !cards.includes(card) && !types.includes(get.type2(card, false));
				});
				if (card) {
					cards.push(card);
					types.push(get.type2(card, false));
				} else {
					break;
				}
			}
			if (cards.length) {
				player.gain(cards, "gain2");
			}
			player.loseMaxHp();
		},
	},
	//梁兴
	lulve: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			var hs = player.countCards("h");
			return (
				hs > 1 &&
				game.hasPlayer(function (target) {
					var ts = target.countCards("h");
					return target != player && ts > 0 && hs > ts;
				})
			);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("lulve"), function (card, player, target) {
					var hs = player.countCards("h"),
						ts = target.countCards("h");
					return target != player && ts > 0 && hs > ts;
				})
				.set("ai", function (target) {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (target.isTurnedOver()) {
						return att / 10;
					}
					if (!player.hasShan() && target.canUse({ name: "sha", isCard: true }, player, false) && get.effect(player, { name: "sha", isCard: true }, target, player) < 0 && player.hp < 4) {
						return 0;
					}
					return -att * Math.sqrt(target.countCards("h"));
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("lulve", target);
				var str = get.translation(player);
				target
					.chooseControl()
					.set("choiceList", ["将所有手牌交给" + str + "，然后其将武将牌翻面", "将武将牌翻面，然后视为对" + str + "使用【杀】"])
					.set("ai", function () {
						var player = _status.event.player,
							target = _status.event.getParent().player;
						if (player.isTurnedOver()) {
							return 1;
						}
						if (!target.hasShan() && player.canUse({ name: "sha", isCard: true }, target, false) && get.effect(target, { name: "sha", isCard: true }, player, player) < 0) {
							return 0;
						}
						return Math.random() < 0.5 ? 0 : 1;
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.index == 0) {
				target.give(target.getCards("h"), player);
				player.turnOver();
				event.finish();
			} else {
				target.turnOver();
			}
			"step 3";
			if (target.canUse({ name: "sha", isCard: true }, player, false)) {
				target.useCard({ name: "sha", isCard: true }, player, false);
			}
		},
	},
	lxzhuixi: {
		audio: 2,
		trigger: {
			player: "damageBegin3",
			source: "damageBegin1",
		},
		forced: true,
		logTarget: "player",
		filter(event, player) {
			return event.source && event.player.isTurnedOver() != event.source.isTurnedOver();
		},
		content() {
			trigger.num++;
		},
		ai: {
			combo: "lulve",
			halfneg: true,
		},
	},
	//陶谦和曹嵩
	reyirang: {
		audio: "yirang",
		audioname: ["re_taoqian"],
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			if (
				!player.countCards("he", function (card) {
					return get.type(card) != "basic";
				})
			) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != player;
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("reyirang"), function (card, player, target) {
					return target != player;
				})
				.set("ai", function (target) {
					return (get.attitude(_status.event.player, target) - 2) * target.maxHp;
				});
			"step 1";
			if (result.bool) {
				var cards = player.getCards("he", function (card) {
					return get.type(card) != "basic";
				});
				var target = result.targets[0];
				player.logSkill("reyirang", target);
				player.give(cards, target, "give");
				if (target.maxHp > player.maxHp) {
					player.gainMaxHp(target.maxHp - player.maxHp, true);
					player.recover(cards.length);
				}
			}
		},
	},
	cslilu: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		check(event, player) {
			return (
				Math.min(player.maxHp, 5) - player.countCards("h") > 3 ||
				game.hasPlayer(function (current) {
					return current != player && get.attitude(player, current) > 0;
				})
			);
		},
		content() {
			"step 0";
			trigger.changeToZero();
			"step 1";
			player.drawTo(Math.min(player.maxHp, 5));
			"step 2";
			if (player.countCards("h") > 0) {
				var str = "将至少一张手牌交给一名其他角色";
				var num = player.countMark("cslilu");
				if (num < player.countCards("h")) {
					if (num > 0) {
						str += "。若给出的牌数大于" + get.cnNumber(num) + "张，则你";
					} else {
						str += "，并";
					}
					str += "加1点体力上限并回复1点体力";
				}
				player.chooseCardTarget({
					prompt: str,
					filterCard: true,
					filterTarget: lib.filter.notMe,
					selectCard: [1, Infinity],
					forced: true,
					ai1(card) {
						if (ui.selected.cards.length < _status.event.goon) {
							if (
								get.tag(card, "damage") &&
								game.hasPlayer(function (current) {
									current != player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain") && !current.hasJudge("lebu") && current.hasValueTarget(card);
								})
							) {
								return 1;
							}
							return 1 / Math.max(0.1, get.value(card));
						}
						return 0;
					},
					ai2(target) {
						return Math.sqrt(5 - Math.min(4, target.countCards("h"))) * get.attitude(_status.event.player, target);
					},
					goon: (function () {
						if (
							!game.hasPlayer(function (current) {
								return current != player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain") && !current.hasJudge("lebu");
							})
						) {
							return 1;
						}
						if (num < player.countCards("h")) {
							return num + 1;
						}
						return 1;
					})(),
				});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var num = player.countMark("cslilu");
				player.give(result.cards, result.targets[0]);
				if (result.cards.length > num) {
					player.gainMaxHp();
					player.recover();
				}
				player.storage.cslilu = result.cards.length;
				player.markSkill("cslilu");
			}
		},
	},
	csyizheng: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("csyizheng"), lib.filter.notMe).set("ai", function (target) {
				if (target.isTurnedOver() || target.hasJudge("lebu")) {
					return 0;
				}
				return get.attitude(_status.event.player, target) * Math.max(0, target.countCards("h") - 2);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("csyizheng", target);
				player.storage.csyizheng2 = target;
				player.addTempSkill("csyizheng2", { player: "phaseBegin" });
			}
		},
		ai: {
			combo: "cslilu",
		},
	},
	csyizheng2: {
		audio: "csyizheng",
		trigger: {
			global: ["recoverBegin", "damageBegin1"],
		},
		forced: true,
		charlotte: true,
		sourceSkill: "csyizheng",
		logTarget(event) {
			return event.name == "damage" ? event.source : event.player;
		},
		filter(event, player) {
			var target = lib.skill.csyizheng2.logTarget(event);
			if (target != player.storage.csyizheng2) {
				return false;
			}
			return player.maxHp > target.maxHp;
		},
		content() {
			player.loseMaxHp();
			trigger.num++;
		},
		mark: "character",
		intro: {
			content: "$造成伤害或回复体力时，若你的体力上限大于其，则你减1点体力上限，然后此伤害/回复量+1",
		},
	},
	reyixiang: {
		audio: "yixiang",
		audioname: ["re_taoqian"],
		trigger: { player: "damageBegin1" },
		forced: true,
		filter(event, player) {
			var evt = event.getParent(2);
			if (evt.name != "useCard" || evt.card != event.card) {
				return false;
			}
			var source = evt.player;
			var phsu = evt.getParent("phaseUse");
			if (!source || source == player || source != phsu.player) {
				return false;
			}
			return (
				source.getHistory("useCard", function (evt2) {
					return evt2.getParent("phaseUse") == phsu;
				})[0] == evt
			);
		},
		content() {
			trigger.num--;
		},
		group: "reyixiang_card",
		subSkill: {
			card: {
				audio: "yixiang",
				audioname: ["re_taoqian"],
				trigger: { target: "useCardToTargeted" },
				forced: true,
				filter(event, player) {
					if (get.color(event.card) != "black") {
						return false;
					}
					var evt = event.getParent();
					var source = evt.player;
					var phsu = evt.getParent("phaseUse");
					if (!source || source == player || source != phsu.player) {
						return false;
					}
					return (
						source
							.getHistory("useCard", function (evt2) {
								return evt2.getParent("phaseUse") == phsu;
							})
							.indexOf(evt) == 1
					);
				},
				content() {
					trigger.excluded.add(player);
				},
			},
		},
		ai: {
			effect: {
				target(card, player, target, current, isLink) {
					if (isLink || typeof card !== "object" || !player.isPhaseUsing()) {
						return;
					}
					var num;
					var evt = _status.event.getParent("useCard"),
						evt2 = _status.event.getParent("phaseUse");
					if (evt.card == card) {
						num = player
							.getHistory("useCard", function (evt) {
								return evt.getParent("phaseUse") == evt2;
							})
							.indexOf(evt);
					} else {
						num = player.getHistory("useCard", function (evt) {
							return evt.getParent("phaseUse") == evt2;
						}).length;
					}
					if (num < 0 || num > 1) {
						return;
					}
					if (num === 0 && get.tag(card, "damage")) {
						if (
							target.hasSkillTag("filterDamage", null, {
								player: player,
								card: card,
							}) ||
							!player.hasSkillTag("damageBonus", true, {
								target: target,
								card: card,
							})
						) {
							return "zeroplayertarget";
						}
						return [0.5, 0, 0.5, 0];
					}
					if (num === 1 && get.color(card) == "black") {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	//赵忠
	yangzhong: {
		audio: 2,
		trigger: {
			source: "damageSource",
			player: "damageEnd",
		},
		direct: true,
		filter(event, player) {
			var target = event.player,
				source = event.source;
			if (player != source && !player.hasSkill("yangzhong")) {
				return false;
			}
			if (!target || !source || !target.isIn() || !source.isIn()) {
				return false;
			}
			return source.countCards("he") > 1;
		},
		content() {
			"step 0";
			trigger.source.chooseToDiscard("是否对" + get.translation(trigger.player) + "发动【殃众】？", "弃置两张牌，并令其失去1点体力", "he", 2).set("ai", function (card) {
				var evt = _status.event;
				if (get.attitude(evt.player, evt.getTrigger().player) >= 0) {
					return 0;
				}
				return 7 - get.value(card);
			}).logSkill = ["yangzhong", trigger.player];
			"step 1";
			if (result.bool) {
				trigger.player.loseHp();
			}
		},
	},
	huangkong: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		forced: true,
		filter(event, player) {
			if (player == _status.currentPhase || player.countCards("h")) {
				return false;
			}
			return event.card.name == "sha" || get.type(event.card, null, false) == "trick";
		},
		content() {
			player.draw(2);
		},
	},
	hfjieying: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("hfjieying"), lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player;
				return (
					(get.attitude(player, target) *
						(1 +
							target.countCards("h", function (card) {
								return !get.tag(card, "damage") && target.hasValueTarget(card);
							}))) /
					(1 + target.countCards("h"))
				);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("hfjieying", target);
				target.addTempSkill("hfjieying2", { player: "phaseJieshuBegin" });
			}
		},
		ai: {
			expose: 0.05,
		},
	},
	hfjieying2: {
		mod: {
			cardEnabled(card, player) {
				if (player.storage.hfjieying2) {
					return false;
				}
			},
			cardSavable(card, player) {
				if (player.storage.hfjieying2) {
					return false;
				}
			},
			targetInRange(card, player) {
				if (player == _status.currentPhase && (card.name == "sha" || get.type(card) == "trick")) {
					return true;
				}
			},
			aiOrder(player, card, num) {
				var info = get.info(card);
				if (!get.tag(card, "damage") && (!info || !info.toself)) {
					return num + 8;
				}
			},
		},
		onremove: true,
		trigger: { player: "useCard2" },
		direct: true,
		charlotte: true,
		sourceSkill: "hfjieying",
		filter(event, player) {
			if (player != _status.currentPhase || event.targets.length != 1) {
				return false;
			}
			var card = event.card;
			if (card.name != "sha" && get.type(card) != "trick") {
				return false;
			}
			var info = get.info(card);
			if (info.allowMultiple == false) {
				return false;
			}
			if (event.targets && !info.multitarget) {
				if (
					game.hasPlayer(function (current) {
						return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
			player
				.chooseTarget(get.prompt("hfjieying2"), function (card, player, target) {
					var player = _status.event.player;
					return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
				})
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, player, player);
				})
				.set("card", trigger.card)
				.set("targets", trigger.targets);
			"step 1";
			if (result.bool) {
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets) {
				player.logSkill("hfjieying2", event.targets);
				trigger.targets.addArray(event.targets);
			}
		},
		group: "hfjieying3",
		mark: true,
		intro: {
			content(player) {
				if (player) {
					return "不能使用牌直到回合结束";
				}
				return "使用【杀】或普通锦囊牌时无距离限制且可以多指定一个目标";
			},
		},
	},
	hfjieying3: {
		trigger: { source: "damageSource" },
		forced: true,
		popup: false,
		sourceSkill: "hfjieying",
		filter(event, player) {
			return !player.storage.hfjieying2 && player == _status.currentPhase;
		},
		content() {
			player.storage.hfjieying2 = true;
		},
	},
	weipo: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		forced: true,
		filter(event, player) {
			return player != event.player && player.countCards("h") < Math.min(5, player.maxHp) && (event.card.name == "sha" || get.type(event.card) == "trick");
		},
		content() {
			"step 0";
			player.addTempSkill("weipo2");
			player.drawTo(Math.min(5, player.maxHp));
			"step 1";
			var evt = trigger.getParent();
			if (!evt.weipo) {
				evt.weipo = {};
			}
			evt.weipo[player.playerid] = player.countCards("h");
		},
	},
	weipo2: {
		charlotte: true,
		trigger: { global: "useCardAfter" },
		forced: true,
		popup: false,
		sourceSkill: "weipo",
		filter(event, player) {
			return event.weipo && event.weipo[player.playerid] != undefined && event.weipo[player.playerid] > player.countCards("h");
		},
		content() {
			"step 0";
			player.tempBanSkill("weipo", { player: "phaseBegin" });
			if (player.countCards("h") && trigger.player.isIn()) {
				player.chooseCard("h", true, "将一张手牌交给" + get.translation(trigger.player));
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				player.give(result.cards, trigger.player);
			}
		},
	},
	refuqi: {
		audio: "fuqi",
		forced: true,
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			return (
				event.card &&
				(get.type(event.card) == "trick" || (get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name))) &&
				game.hasPlayer(function (current) {
					return current != player && get.distance(player, current) <= 1;
				})
			);
		},
		content() {
			trigger.directHit.addArray(
				game.filterPlayer(function (current) {
					return current != player && get.distance(player, current) <= 1;
				})
			);
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return get.distance(player, arg.target) <= 1;
			},
		},
	},
	zhuide: {
		audio: 2,
		trigger: { player: "die" },
		forceDie: true,
		skillAnimation: true,
		animationColor: "thunder",
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("zhuide"), lib.filter.notMe).set("ai", function (target) {
				return get.attitude(_status.event.player, target);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("zhuide", target);
				var names = [];
				var cards = [];
				while (cards.length < 4) {
					var card = get.cardPile2(function (card) {
						return !cards.includes(card) && !names.includes(card.name) && get.type(card) == "basic";
					});
					if (card) {
						cards.push(card);
						names.push(card.name);
					} else {
						break;
					}
				}
				if (cards.length) {
					target.gain(cards, "gain2");
				}
			}
		},
	},
	juntun: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.maxHp > 1;
		},
		content() {
			player.loseMaxHp();
			player.draw(player.maxHp);
		},
	},
	jiaojie: {
		audio: 2,
		mod: {
			ignoredHandcard(card, player) {
				if (get.color(card) == "red") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && get.color(card) == "red") {
					return false;
				}
			},
			targetInRange(card) {
				const color = get.color(card);
				if (color === "black" || color === "unsure") {
					return true;
				}
			},
			cardUsable(card) {
				const color = get.color(card);
				if (color === "black" || color === "unsure") {
					return Infinity;
				}
			},
		},
	},
	decadewuniang: {
		trigger: {
			player: ["useCard", "respond"],
		},
		audio: "xinfu_wuniang",
		direct: true,
		filter(event, player) {
			return event.card.name == "sha";
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("decadewuniang"), function (card, player, target) {
					if (player == target) {
						return false;
					}
					return target.countGainableCards(player, "he") > 0;
				})
				.set("ai", function (target) {
					return 10 - get.attitude(_status.event.player, target);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("decadewuniang", target);
				player.line(target, "fire");
				player.gainPlayerCard(target, "he", true);
				target.draw();
				if (!player.storage.decadexushen) {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			var list = game.filterPlayer(function (current) {
				return current.name == "dc_guansuo" || current.name2 == "dc_guansuo";
			});
			if (list.length) {
				game.asyncDraw(list);
			} else {
				event.finish();
			}
			"step 3";
			game.delayx();
		},
	},
	minsi: {
		audio: 2,
		enable: "phaseUse",
		getResult(cards) {
			var l = cards.length;
			var all = Math.pow(l, 2);
			var list = [];
			for (var i = 1; i < all; i++) {
				var array = [];
				for (var j = 0; j < l; j++) {
					if (Math.floor((i % Math.pow(2, j + 1)) / Math.pow(2, j)) > 0) {
						array.push(cards[j]);
					}
				}
				var num = 0;
				for (var k of array) {
					num += get.number(k);
				}
				if (num == 13) {
					list.push(array);
				}
			}
			if (list.length) {
				list.sort(function (a, b) {
					if (a.length != b.length) {
						return b.length - a.length;
					}
					return get.value(a) - get.value(b);
				});
				return list[0];
			}
			return list;
		},
		usable: 1,
		filterCard(card) {
			var num = 0;
			for (var i = 0; i < ui.selected.cards.length; i++) {
				num += get.number(ui.selected.cards[i]);
			}
			return get.number(card) + num <= 13;
		},
		complexCard: true,
		selectCard() {
			var num = 0;
			for (var i = 0; i < ui.selected.cards.length; i++) {
				num += get.number(ui.selected.cards[i]);
			}
			if (num == 13) {
				return ui.selected.cards.length;
			}
			return ui.selected.cards.length + 2;
		},
		check(card) {
			var evt = _status.event;
			if (!evt.minsi_choice) {
				evt.minsi_choice = lib.skill.minsi.getResult(evt.player.getCards("he"));
			}
			if (!evt.minsi_choice.includes(card)) {
				return 0;
			}
			return 1;
		},
		position: "he",
		content() {
			player.draw(cards.length * 2).gaintag = ["minsi2"];
			player.addTempSkill("minsi2");
		},
		ai: {
			order: 5,
			result: { player: 1 },
		},
	},
	minsi2: {
		onremove(player) {
			player.removeGaintag("minsi2");
		},
		mod: {
			targetInRange(card, player, target) {
				if (!card.cards || !card.cards.length) {
					return;
				}
				for (var i of card.cards) {
					if (!i.hasGaintag("minsi2") || get.color(i) != "black") {
						return;
					}
				}
				return true;
			},
			ignoredHandcard(card, player) {
				if (card.hasGaintag("minsi2") && get.color(card) == "red") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("minsi2") && get.color(card) == "red") {
					return false;
				}
			},
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("minsi2") && get.color(card) == "black") {
					return num - 0.1;
				}
			},
		},
	},
	jijing: {
		audio: 2,
		trigger: { player: "damageEnd" },
		frequent: true,
		content() {
			"step 0";
			player.judge();
			"step 1";
			var num = result.number;
			var next = player.chooseToDiscard(
				"是否弃置任意张点数之和为" + get.cnNumber(num) + "的牌并回复1点体力？",
				function (card) {
					var num = 0;
					for (var i = 0; i < ui.selected.cards.length; i++) {
						num += get.number(ui.selected.cards[i]);
					}
					return get.number(card) + num <= _status.event.num;
				},
				"he"
			);
			next.set("num", num);
			next.set("complexCard", true);
			next.set("selectCard", function () {
				var num = 0;
				for (var i = 0; i < ui.selected.cards.length; i++) {
					num += get.number(ui.selected.cards[i]);
				}
				if (num == _status.event.num) {
					return ui.selected.cards.length;
				}
				return ui.selected.cards.length + 2;
			});
			next.set(
				"cardResult",
				(function () {
					var cards = player.getCards("he");
					var l = cards.length;
					var all = Math.pow(l, 2);
					var list = [];
					for (var i = 1; i < all; i++) {
						var array = [];
						for (var j = 0; j < l; j++) {
							if (Math.floor((i % Math.pow(2, j + 1)) / Math.pow(2, j)) > 0) {
								array.push(cards[j]);
							}
						}
						var numx = 0;
						for (var k of array) {
							numx += get.number(k);
						}
						if (numx == num) {
							list.push(array);
						}
					}
					if (list.length) {
						list.sort(function (a, b) {
							return get.value(a) - get.value(b);
						});
						return list[0];
					}
					return list;
				})()
			);
			next.set("ai", function (card) {
				if (!_status.event.cardResult.includes(card)) {
					return 0;
				}
				return 6 - get.value(card);
			});
			"step 2";
			if (result.bool) {
				player.recover();
			}
		},
	},
	cixiao: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		filter(event, player) {
			if (
				!game.hasPlayer(function (current) {
					return current.hasSkill("panshi");
				})
			) {
				return true;
			}
			return (
				player.countCards("he") >= 1 &&
				game.hasPlayer(function (current) {
					return current != player && !current.hasSkill("panshi");
				})
			);
		},
		content() {
			"step 0";
			if (
				game.hasPlayer(function (current) {
					return current.hasSkill("panshi");
				})
			) {
				event.goto(2);
			} else {
				player.chooseTarget(lib.filter.notMe, get.prompt("cixiao"), "令一名其他角色获得「义子」标记").set("ai", function (target) {
					var player = _status.event.player;
					var att = -get.attitude(player, target);
					return att * target.countCards("h");
				});
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("cixiao", target);
				target.addSkills("panshi");
			}
			event.finish();
			"step 2";
			var list = game.filterPlayer(function (current) {
				return current.hasSkill("panshi");
			});
			player.chooseCardTarget({
				prompt: get.prompt("cixiao"),
				prompt2: "弃置一张牌并将" + get.translation(list) + "的「义子」标记转移给其他角色",
				position: "he",
				filterTarget(card, player, target) {
					return player != target && !target.hasSkill("panshi");
				},
				filterCard: lib.filter.cardDiscardable,
				ai1(card) {
					if (_status.event.goon) {
						return 5 - get.value(card);
					}
					return 0;
				},
				ai2(target) {
					var player = _status.event.player;
					var att = -get.attitude(player, target);
					return att * target.countCards("h");
				},
				goon: (function (target) {
					var att = -get.attitude(player, target);
					return att * target.countCards("h") <= 0;
				})(list[0]),
			});
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("cixiao");
				player.discard(result.cards).delay = false;
				player.line2(
					game
						.filterPlayer(function (current) {
							if (current.hasSkill("panshi")) {
								current.removeSkills("panshi");
								return true;
							}
						})
						.concat(result.targets),
					"green"
				);
				target.addSkills("panshi");
			} else {
				event.finish();
			}
			"step 4";
			game.delayx();
		},
		derivation: "panshi",
		ai: { threaten: 8 },
	},
	panshi: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && current.hasSkill("cixiao");
				})
			);
		},
		content() {
			"step 0";
			var targets = game.filterPlayer(function (current) {
				return current != player && current.hasSkill("cixiao");
			});
			if (targets.length == 1) {
				event.target = targets[0];
				player.chooseCard("h", true, "叛弑：将一张手牌交给" + get.translation(targets));
			} else {
				player.chooseCardTarget({
					prompt: "叛弑：将一张手牌交给" + get.translation(targets) + "中的一名角色",
					filterCard: true,
					position: "h",
					targets: targets,
					forced: true,
					filterTarget(card, player, target) {
						return _status.event.targets.includes(target);
					},
				});
			}
			"step 1";
			if (result.bool) {
				if (!target) {
					target = result.targets[0];
				}
				player.line(target);
				player.give(result.cards, target);
			}
		},
		mark: true,
		marktext: "子",
		intro: {
			name: "义子",
			//content:'我是儿子',
			//R·I·P——永远怀念：被棘手砍掉的“我是儿子”
			content(_, player) {
				const targets = game.filterPlayer2(target => target.hasSkill("cixiao", null, null, false)).sortBySeat(player);
				if (!targets.length) {
					return "我义父呢？！";
				}
				if (
					["name", "name1", "name2"].some(name => {
						if (!player[name] || !get.character(player[name]) || typeof get.translation(player[name]) != "string") {
							return false;
						}
						return player[name].includes("lvbu") && get.translation(player[name]).includes("吕布");
					})
				) {
					return "公若不弃，布愿拜为义父";
				}
				return (
					"我是" +
					get.translation(targets) +
					"的" +
					(player => {
						switch (player.sex) {
							case "female":
								return "义女";
							case "double":
								return "义子义女";
							default:
								return "义子";
						}
					})(player)
				);
			},
		},
		group: "panshi_damage",
		ai: {
			halfneg: true,
		},
	},
	panshi_damage: {
		trigger: { source: "damageBegin1" },
		forced: true,
		logTarget: "player",
		sourceSkill: "panshi",
		filter(event, player) {
			return player.isPhaseUsing() && event.card && event.card.name == "sha" && event.player.hasSkill("cixiao");
		},
		content() {
			trigger.num++;
			if (
				["name", "name1", "name2"].some(name => {
					if (!player[name] || !get.character(player[name]) || typeof get.translation(player[name]) != "string") {
						return false;
					}
					return player[name].includes("lvbu") && get.translation(player[name]).includes("吕布");
				})
			) {
				player.chat("吾堂堂丈夫，安肯为汝子乎！");
			}
			var evt = event.getParent("phaseUse");
			if (evt && evt.player == player) {
				evt.skipped = true;
			}
		},
	},
	xianshuai: {
		audio: 2,
		trigger: { global: "damageSource" },
		forced: true,
		filter(event, player) {
			return event.source && event.source.isIn() && !player.hasSkill("xianshuai2");
		},
		content() {
			player.addTempSkill("xianshuai2", "roundStart");
			player.draw();
			if (player == trigger.source && trigger.player.isIn()) {
				player.line(trigger.player, "green");
				trigger.player.damage();
			}
		},
	},
	xianshuai2: { charlotte: true },
	decadexushen: {
		derivation: "decadezhennan",
		audio: "xinfu_xushen",
		trigger: { player: "dying" },
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		filter(event, player) {
			return player.hp < 1;
		},
		content() {
			player.awakenSkill(event.name);
			player.addSkills("decadezhennan");
			player.addTempSkill("decadexushen2");
			trigger.decadexushen = true;
			player.recover();
		},
	},
	decadexushen2: {
		trigger: { player: "dyingAfter" },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "decadexushen",
		filter(event, player) {
			return (
				event.decadexushen == true &&
				!game.hasPlayer(function (current) {
					return current.name == "dc_guansuo" || current.name2 == "dc_guansuo";
				})
			);
		},
		content() {
			"step 0";
			player.chooseTarget(lib.filter.notMe, "许身：是否令一名其他角色选择是否将其武将牌替换为“关索”并令其摸三张牌？").set("ai", function (target) {
				return get.attitude(_status.event.player, target);
			});
			"step 1";
			if (!result.bool) {
				event.finish();
				return;
			}
			var target = result.targets[0];
			event.target = target;
			player.line(target, "fire");
			target.chooseBool("许身：是否将自己的一张武将牌替换为“关索”并令" + get.translation(player) + "摸三张牌？");
			"step 2";
			if (result.bool) {
				if (target.name2 != undefined) {
					target.chooseControl(target.name1, target.name2).set("prompt", "请选择要更换的武将牌");
				} else {
					event._result = { control: target.name1 };
				}
			} else {
				event.goto(4);
			}
			"step 3";
			target.reinitCharacter(result.control, "dc_guansuo");
			"step 4";
			target.draw(3);
		},
	},
	decadezhennan: {
		audio: "xinfu_zhennan",
		trigger: {
			global: "useCardToPlayered",
		},
		filter(event, player) {
			return event.isFirstTarget && event.targets && event.targets.length > 1 && get.type2(event.card) == "trick";
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("decadezhennan"), "对一名其他角色造成1点伤害", function (card, player, target) {
					return target != player;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.damageEffect(target, player, player);
				});
			"step 1";
			if (result.bool && result.targets && result.targets.length) {
				player.logSkill("decadezhennan", result.targets);
				result.targets[0].damage();
			}
		},
		ai: {
			expose: 0.25,
		},
	},
	yujue: {
		audio: 2,
		derivation: "zhihu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasEnabledSlot();
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###鬻爵###" + lib.translate.yujue_info);
			},
			chooseControl(event, player) {
				var list = [];
				for (var i = 1; i < 6; i++) {
					if (player.hasEnabledSlot(i)) {
						list.push("equip" + i);
					}
				}
				list.push("cancel2");
				return list;
			},
			check(event, player) {
				for (var i = 5; i > 0; i--) {
					if (player.hasEmptySlot(i)) {
						return "equip" + i;
					}
				}
				return "cancel2";
			},
			backup(result) {
				var next = get.copy(lib.skill.yujuex);
				next.position = result.control;
				return next;
			},
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					if (
						game.hasPlayer(function (target) {
							if (player == target) {
								return false;
							}
							var hs = target.countCards("h");
							return hs > 2 && get.attitude(player, target) > 0;
						})
					) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	yujuex: {
		audio: "yujue",
		sourceSkill: "yujue",
		async content(event, trigger, player) {
			await player.disableEquip(lib.skill.yujue_backup.position);
			if (
				player.isIn() &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("h");
				})
			) {
				const result = await player
					.chooseTarget(true, "选择一名角色交给你一张牌并获得技能〖执笏〗", function (card, player, target) {
						if (player == target) {
							return false;
						}
						return target.countCards("h") > 0;
					})
					.set("ai", function (target) {
						return get.attitude(_status.event.player, target) * target.countCards("h");
					})
					.forResult();
				if (result.bool) {
					var target = result.targets[0];
					event.target = target;
					player.line(target);
					const result2 = await target.chooseCard("h", true, "交给" + get.translation(player) + "一张手牌").forResult();
					if (result2.bool && result2.cards && result2.cards.length) {
						await target.give(result2.cards, player);
						target.storage.zhihu_mark = player;
						await target.addSkills("zhihu");
						target.addSkill("zhihu_mark");
					}
				}
			}
		},
	},
	zhihu: {
		usable: 2,
		trigger: { source: "damageSource" },
		forced: true,
		filter(event, player) {
			return player != event.player;
		},
		content() {
			player.draw(2);
		},
	},
	zhihu_mark: {
		mark: "character",
		intro: {
			content: "以$之名，授予汝技能〖执笏〗，直至$的下回合开始为止！",
		},
		onremove(player) {
			delete player.storage.zhihu_mark;
			player.removeSkills("zhihu");
		},
		trigger: { global: "phaseBeginStart" },
		firstDo: true,
		charlotte: true,
		silent: true,
		sourceSkill: "zhihu",
		filter(event, player) {
			return event.player == player.storage.zhihu_mark;
		},
		content() {
			player.removeSkill("zhihu_mark");
		},
	},
	tuxing: {
		audio: 2,
		trigger: { player: "disableEquipAfter" },
		forced: true,
		content() {
			"step 0";
			player.gainMaxHp();
			player.recover();
			"step 1";
			if (!player.hasEnabledSlot()) {
				player.loseMaxHp(4);
				player.addSkill("tuxing2");
			}
		},
		ai: {
			combo: "yujue",
		},
	},
	tuxing2: {
		audio: "tuxing",
		trigger: { source: "damageBegin1" },
		forced: true,
		charlotte: true,
		sourceSkill: "tuxing",
		content() {
			trigger.num++;
		},
		mark: true,
		intro: {
			content: "造成伤害时，此伤害+1",
		},
	},
	gongjian: {
		audio: 2,
		trigger: { global: "useCardToPlayered" },
		usable: 1,
		logTarget(event) {
			return event.parent.gongjian_targets.filter(function (target) {
				return event.targets.includes(target) && target.countCards("he") > 0;
			});
		},
		filter(event, player) {
			if (event.card.name != "sha" || !event.isFirstTarget) {
				return false;
			}
			if (
				event.parent.gongjian_targets &&
				event.parent.gongjian_targets.filter(function (target) {
					return event.targets.includes(target) && target.countCards("he") > 0;
				}).length > 0
			) {
				return true;
			}
			return false;
		},
		check(event, player) {
			var targets = event.parent.gongjian_targets.filter(function (target) {
					return event.targets.includes(target) && target.countCards("he") > 0;
				}),
				att = 0;
			for (var i of targets) {
				att += get.attitude(player, i);
			}
			return att < 0;
		},
		content() {
			"step 0";
			event.targets = trigger.parent.gongjian_targets.filter(function (target) {
				return trigger.targets.includes(target);
			});
			event.num = 0;
			"step 1";
			var target = targets[num];
			player.discardPlayerCard(target, true, "he", [1, 2]).set("forceAuto", true);
			"step 2";
			event.num++;
			if (event.num < targets.length) {
				event.goto(1);
			} else {
				var cards = [];
				game.getGlobalHistory("cardMove", function (evt) {
					if (evt.player && evt.hs && evt.type == "discard" && evt.getParent(3) == event) {
						for (var i of evt.hs) {
							if (get.name(i, evt.player) == "sha" && get.position(i, true) == "d") {
								cards.add(i);
							}
						}
					}
				});
				if (cards.length) {
					player.gain(cards, "gain2");
				}
			}
		},
		group: "gongjian_count",
		subSkill: {
			count: {
				trigger: { global: "useCard1" },
				silent: true,
				firstDo: true,
				filter(event, player) {
					return event.card && event.card.name == "sha";
				},
				content() {
					if (player.storage.gongjian) {
						trigger.gongjian_targets = player.storage.gongjian;
					}
					player.storage.gongjian = trigger.targets;
				},
			},
		},
	},
	kuimang: {
		audio: 2,
		trigger: { global: "dieAfter" },
		forced: true,
		filter(event, player) {
			return (
				player.getAllHistory("sourceDamage", function (target) {
					return target.player == event.player;
				}).length > 0
			);
		},
		content() {
			player.draw(2);
		},
	},
	rexiemu: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return !game.hasPlayer(function (current) {
				return current.hasMark("rexiemu");
			});
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("rexiemu"), lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player;
				return get.attitude(player, target) * Math.sqrt(Math.max(1 + player.countCards("h"), 1 + target.countCards("h")));
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("rexiemu", target);
				target.addMark("rexiemu", 1);
				player.addSkill("rexiemu2");
			}
		},
		intro: { content: "mark" },
		ai: {
			expose: 0.1,
		},
	},
	rexiemu2: {
		audio: "rexiemu",
		trigger: { global: ["loseAfter"] },
		forced: true,
		charlotte: true,
		usable: 1,
		sourceSkill: "rexiemu",
		filter(event, player) {
			return (
				(event.player == player || event.player.hasMark("rexiemu")) &&
				["useCard", "respond"].includes(event.getParent().name) &&
				event.hs &&
				event.hs.length &&
				event.player != _status.currentPhase &&
				game.hasPlayer(function (current) {
					return current.hasMark("rexiemu");
				})
			);
		},
		content() {
			"step 0";
			game.asyncDraw(
				game.filterPlayer(function (current) {
					return current == player || current == trigger.player || current.hasMark("rexiemu");
				})
			);
			"step 1";
			game.delayx();
		},
		group: "rexiemu3",
	},
	rexiemu3: {
		trigger: { player: "phaseBegin" },
		forced: true,
		charlotte: true,
		silent: true,
		firstDo: true,
		sourceSkill: "rexiemu",
		content() {
			player.removeSkill("rexiemu2");
			game.countPlayer(function (current) {
				var num = current.countMark("rexiemu");
				if (num) {
					current.removeMark("rexiemu", num);
				}
			});
		},
	},
	heli: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return lib.skill.heli.filterTarget(null, player, current);
			});
		},
		filterTarget(card, player, target) {
			return target.countCards("h") < player.countCards("h");
		},
		content() {
			"step 0";
			if (target.countCards("h")) {
				target.showHandcards();
			}
			"step 1";
			var list = [];
			var cards = [];
			for (var i of lib.inpile) {
				list.add(get.type2(i));
			}
			for (var i of list) {
				if (
					!target.countCards("h", function (card) {
						return get.type2(card, target) == i;
					})
				) {
					var card = get.cardPile2(function (card) {
						return get.type2(card, false) == i;
					}, "random");
					if (card) {
						cards.push(card);
					}
				}
			}
			if (cards.length) {
				target.gain(cards, "gain2", "log");
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					return 1 / Math.sqrt(1 + target.countCards("h"));
				},
			},
		},
	},
	moying: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		direct: true,
		filter(event, player) {
			if (player == _status.currentPhase || event.getParent().name == "useCard") {
				return false;
			}
			if (event.name == "gain" && event.player == player) {
				return false;
			}
			var evt = event.getl(player);
			return evt && evt.cards2 && evt.cards2.length == 1 && ["equip", "trick"].includes(get.type2(evt.cards2[0], evt.type == "discard" && evt.hs.includes(evt.cards2[0]) ? player : false)) && !player.hasSkill("moying2");
		},
		content() {
			"step 0";
			var number = trigger.getl(player).cards2[0].number;
			var numbers = [number - 2, number - 1, number, number + 1, number + 2].filter(function (number) {
				return number >= 1 && number <= 13;
			});
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				_status.imchoosing = false;
				event._result = {
					bool: true,
					suit: lib.suit.randomGet(),
					number: numbers.randomGet(),
				};
				if (event.dialog) {
					event.dialog.close();
				}
				if (event.control) {
					event.control.close();
				}
			};
			var chooseButton = function (player, numbers) {
				var event = _status.event;
				player = player || event.player;
				if (!event._result) {
					event._result = {};
				}
				var dialog = ui.create.dialog("是否发动【墨影】？", "forcebutton", "hidden");
				event.dialog = dialog;
				dialog.addText("花色");
				var table = document.createElement("div");
				table.classList.add("add-setting");
				table.style.margin = "0";
				table.style.width = "100%";
				table.style.position = "relative";
				var listi = ["spade", "heart", "club", "diamond"];
				for (var i = 0; i < listi.length; i++) {
					var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
					td.link = listi[i];
					table.appendChild(td);
					td.innerHTML = "<span>" + get.translation(listi[i]) + "</span>";
					td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
						if (_status.dragged) {
							return;
						}
						if (_status.justdragged) {
							return;
						}
						_status.tempNoButton = true;
						setTimeout(function () {
							_status.tempNoButton = false;
						}, 500);
						var link = this.link;
						var current = this.parentNode.querySelector(".bluebg");
						if (current) {
							current.classList.remove("bluebg");
						}
						this.classList.add("bluebg");
						event._result.suit = link;
					});
				}
				dialog.content.appendChild(table);
				dialog.addText("点数");
				var table2 = document.createElement("div");
				table2.classList.add("add-setting");
				table2.style.margin = "0";
				table2.style.width = "100%";
				table2.style.position = "relative";
				for (var i = 0; i < numbers.length; i++) {
					var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
					td.link = numbers[i];
					table2.appendChild(td);
					td.innerHTML = "<span>" + get.strNumber(numbers[i]) + "</span>";
					td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
						if (_status.dragged) {
							return;
						}
						if (_status.justdragged) {
							return;
						}
						_status.tempNoButton = true;
						setTimeout(function () {
							_status.tempNoButton = false;
						}, 500);
						var link = this.link;
						var current = this.parentNode.querySelector(".bluebg");
						if (current) {
							current.classList.remove("bluebg");
						}
						this.classList.add("bluebg");
						event._result.number = link;
					});
				}
				dialog.content.appendChild(table2);
				dialog.add("　　");
				event.dialog.open();

				event.switchToAuto = function () {
					event._result = {
						bool: true,
						number: numbers.randomGet(),
						suit: lib.suit.randomGet(),
					};
					event.dialog.close();
					event.control.close();
					game.resume();
					_status.imchoosing = false;
				};
				event.control = ui.create.control("ok", "cancel2", function (link) {
					var result = event._result;
					if (link == "cancel2") {
						result.bool = false;
					} else {
						if (!result.number || !result.suit) {
							return;
						}
						result.bool = true;
					}
					event.dialog.close();
					event.control.close();
					game.resume();
					_status.imchoosing = false;
				});
				for (var i = 0; i < event.dialog.buttons.length; i++) {
					event.dialog.buttons[i].classList.add("selectable");
				}
				game.pause();
				game.countChoose();
			};
			if (event.isMine()) {
				chooseButton(player, numbers);
			} else if (event.isOnline()) {
				event.player.send(chooseButton, event.player, numbers);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			var map = event.result || result;
			if (map.bool) {
				player.logSkill("moying");
				player.addTempSkill("moying2");
				var cards = [];
				for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
					var card = ui.cardPile.childNodes[i];
					if (get.suit(card) == map.suit && get.number(card) == map.number) {
						cards.push(card);
					}
				}
				if (cards.length) {
					player.gain(cards, "gain2", "log");
				}
			}
		},
	},
	moying2: {},
	juanhui: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("juanhui"), lib.filter.notMe, "选择记录一名其他角色使用过的牌").set("ai", function (target) {
				if (target.isTurnedOver() || target.hasJudge("lebu")) {
					return Math.random();
				}
				return (1 + target.countCards("h")) * 2 + Math.random();
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("juanhui", target);
				player.storage.juanhui2 = target;
				player.storage.juanhui3 = [];
				player.addSkill("juanhui2");
			}
		},
	},
	juanhui2: {
		charlotte: true,
		mark: true,
		mod: {
			cardUsable(card) {
				if (card.name == "sha" && _status.event.skill == "juanhui2_backup") {
					return Infinity;
				}
			},
		},
		intro: {
			markcount(storage, player) {
				return player.getStorage("juanhui3").length;
			},
			mark(dialog, storage, player) {
				dialog.addText("记录目标");
				dialog.addSmall([storage]);
				var vcard = player.getStorage("juanhui3");
				if (vcard.length) {
					dialog.addText("记录卡牌");
					dialog.addSmall([vcard, "vcard"]);
				}
			},
			content(storage, player) {
				var str = "记录目标：" + get.translation(storage);
				var vcard = player.getStorage("juanhui3");
				if (vcard.length) {
					str += "<br>记录卡牌：";
					for (var i of vcard) {
						if (i[2] == "sha" && i[3]) {
							str += get.translation(i[3]);
						}
						str += get.translation(i[2]);
						str += "、";
					}
					str = str.slice(0, str.length - 1);
				}
				return str;
			},
		},
		onremove(player) {
			delete player.storage.juanhui2;
			delete player.storage.juanhui3;
		},
		group: "juanhui3",
		enable: "phaseUse",
		sourceSkill: "juanhui",
		filter(event, player) {
			return player.getStorage("juanhui3").length > 0 && player.countCards("hs") > 0;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("绢绘", [player.getStorage("juanhui3"), "vcard"], "hidden");
			},
			filter(button, player) {
				return lib.filter.cardEnabled(
					{
						name: button.link[2],
						nature: button.link[3],
					},
					player,
					_status.event.getParent()
				);
			},
			check(button) {
				var player = _status.event.player;
				var card = {
					name: button.link[2],
					nature: button.link[3],
				};
				if (player.getUseValue(card) > 0) {
					return get.order(card);
				}
				return -1;
			},
			backup(links, player) {
				return {
					audio: "juanhui",
					popname: true,
					filterCard: true,
					position: "hs",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					check(card) {
						return 6 - get.value(card);
					},
					precontent() {
						var card = event.result.card;
						if (card.name == "sha") {
							event.getParent().addCount = false;
						}
						var vcard = player.storage.juanhui3;
						for (var i = 0; i < vcard.length; i++) {
							if (vcard[i][2] == card.name) {
								vcard.splice(i--, 1);
							}
						}
						if (vcard.length) {
							player.markSkill("juanhui2");
						} else {
							player.unmarkSkill("juanhui2");
							event.getParent().juanhui = true;
						}
					},
				};
			},
			prompt(links, player) {
				return "将一张手牌当做" + (links[0][2] == "sha" && links[0][3] ? get.translation(links[0][3]) : "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order(item, player) {
				var muniu = player.getStorage("juanhui3");
				var order = 0;
				for (var i = 0; i < muniu.length; i++) {
					var card = { name: muniu[i][2], nature: muniu[i][3] };
					if (player.getUseValue(card) > 0) {
						var order2 = get.order(card);
						if (order2 > order) {
							order = order2;
						}
					}
				}
				return order + 0.1;
			},
			result: {
				player: 1,
			},
		},
	},
	juanhui3: {
		charlotte: true,
		firstDo: true,
		trigger: {
			global: "useCard2",
			player: ["phaseUseEnd", "phaseUseSkipped", "useCardAfter"],
		},
		silent: true,
		sourceSkill: "juanhui",
		filter(event, player, name) {
			if (event.name == "phaseUse") {
				return true;
			} else if (name == "useCardAfter") {
				return event.getParent().juanhui;
			}
			return (
				event.player == player.storage.juanhui2 &&
				event.player.isPhaseUsing() &&
				["basic", "trick"].includes(get.type(event.card)) &&
				player.getStorage("juanhui3").filter(function (vcard) {
					return vcard[2] == event.card.name;
				}).length == 0
			);
		},
		content() {
			if (trigger.name == "phaseUse") {
				player.removeSkill("juanhui2");
			} else if (event.triggername == "useCardAfter") {
				player.recover();
				player.drawTo(3);
			} else {
				var vcard = [get.type(trigger.card), "", trigger.card.name];
				if (game.hasNature(trigger.card)) {
					vcard.push(get.nature(trigger.card));
				}
				player.storage.juanhui3.push(vcard);
				player.markSkill("juanhui2");
			}
		},
	},
	mubing: {
		audio: 2,
		audioname: ["sp_key_yuri"],
		trigger: { player: "phaseUseBegin" },
		//direct:true,
		frequent: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			var num = player.storage.mubing2 ? 4 : 3;
			event.num = num;
			event.cards = game.cardsGotoOrdering(get.cards(num)).cards;
			game.log(player, "展示了", event.cards);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					var str = get.translation(player) + "发动了【募兵】";
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			game.addVideo("showCards", player, [get.translation(player) + "发动了【募兵】", get.cardsInfo(event.cards)]);
			game.delay(2);
			"step 1";
			var numa = 0;
			cards.sort(function (a, b) {
				return a.number - b.number;
			});
			for (var i of cards) {
				if (get.value(i, player) > 0) {
					numa += get.number(i);
				}
			}
			player
				.chooseToDiscard([1, Infinity], "h")
				.set("ai", function (card) {
					var player = _status.event.player;
					var numa = _status.event.numa;
					//if(card.name!='tengjia'&&get.position(card)=='e'&&get.equipValue(card,player)<=0) return 14;
					var num = 0;
					for (var i of ui.selected.cards) {
						num += i.number;
					}
					if (num >= numa) {
						return 0;
					}
					if (card.number + num >= numa) {
						return 15 - get.value(card);
					}
					if (!ui.selected.cards.length) {
						var min = _status.event.min;
						if (
							card.number < min &&
							!player.countCards("h", function (xcard) {
								return xcard != card && card.number + xcard.number > min;
							})
						) {
							return 0;
						}
						return card.number;
					}
					return Math.max(5 - get.value(card), card.number);
				})
				.set("prompt", false)
				.set("numa", numa)
				.set("min", cards[0].number);
			var func = function (id) {
				var dialog = get.idDialog(id);
				if (dialog) {
					dialog.content.firstChild.innerHTML = "请选择要弃置的牌";
				}
			};
			if (player == game.me) {
				func(event.videoId);
			} else if (player.isOnline()) {
				player.send(func, event.videoId);
			}
			"step 2";
			if (!result.bool) {
				return;
			}
			var numx = 0;
			for (var i of result.cards) {
				numx += get.number(i);
			}
			event.numx = numx;
			var next = player.chooseButton([0, num]);
			next.set("dialog", event.videoId);
			next.set("filterButton", function (button) {
				var num = 0;
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					num += get.number(ui.selected.buttons[i].link);
				}
				return num + get.number(button.link) <= _status.event.maxNum;
			});
			next.set("maxNum", event.numx);
			next.set("ai", function (button) {
				return get.value(button.link, _status.event.player);
			});
			var func = function (id) {
				var dialog = get.idDialog(id);
				if (dialog) {
					dialog.content.firstChild.innerHTML = "请选择要获得的牌";
				}
			};
			if (player == game.me) {
				func(event.videoId);
			} else if (player.isOnline()) {
				player.send(func, event.videoId);
			}
			"step 3";
			if (!result.bool) {
				event.cards = [];
			} else {
				event.cards = result.links;
			}
			"step 4";
			game.broadcastAll("closeDialog", event.videoId);
			game.addVideo("cardDialog", null, event.videoId);
			if (!cards.length) {
				event.finish();
				return;
			}
			player.gain(cards, "log", "gain2");
			if (!player.storage.mubing2) {
				event.finish();
				return;
			}
			event.given = [];
			"step 5";
			var hs = player.getCards("h");
			cards = cards.filter(function (card) {
				return hs.includes(card);
			});
			if (
				cards.length &&
				game.hasPlayer(function (current) {
					return current != player && !event.given.includes(current);
				})
			) {
				player.chooseCardTarget({
					prompt: "是否将得到的牌中的任意张交给其他角色？",
					selectCard: [1, cards.length],
					filterCard(card) {
						return _status.event.cards.includes(card);
					},
					filterTarget(card, player, target) {
						return target != player && !_status.event.given.includes(target);
					},
					cards: cards,
					given: event.given,
					ai1(card) {
						return -1;
					},
				});
			} else {
				event.finish();
			}
			"step 6";
			if (result.bool) {
				var target = result.targets[0];
				var cards = result.cards;
				event.given.push(target);
				event.cards.removeArray(cards);
				player.line(target, "green");
				player.give(cards, target);
				event.goto(5);
			}
		},
	},
	ziqu: {
		audio: 2,
		audioname: ["sp_key_yuri"],
		trigger: { source: "damageBegin2" },
		filter(event, player) {
			return event.player != player && !player.getStorage("ziqu").includes(event.player) && event.player.countCards("he") > 0;
		},
		check(event, player) {
			var target = event.player;
			var eff = get.damageEffect(target, player, player);
			if (get.attitude(player, target) > 0) {
				if (eff >= 0) {
					return false;
				}
				return true;
			}
			if (eff <= 0) {
				return true;
			}
			if (target.hp == 1) {
				return false;
			}
			if (event.num > 1) {
				return false;
			}
			var cards = target.getCards("he");
			for (var i = 0; i < cards.length; i++) {
				if (get.number(cards[i]) > 10) {
					return true;
				}
			}
			return false;
		},
		logTarget: "player",
		content() {
			"step 0";
			trigger.cancel();
			if (!player.storage.ziqu) {
				player.storage.ziqu = [];
			}
			player.storage.ziqu.push(trigger.player);
			player.markSkill("ziqu");
			trigger.player.chooseCard(true, "he", function (card, player) {
				return !player.countCards("he", function (cardx) {
					return cardx.number > card.number;
				});
			});
			"step 1";
			if (result.bool && result.cards && result.cards.length) {
				trigger.player.give(result.cards, player);
			}
		},
		intro: { content: "已对$发动过" },
	},
	mubing_rewrite: {
		mark: true,
		intro: {
			content: "出牌阶段开始时，你可以亮出牌堆顶的四张牌。你可弃置任意张手牌，并可获得任意张点数之和不大于你弃置的牌点数之和的牌。然后你可将以此法得到的牌以任意方式交给其他角色。",
		},
		ai: {
			combo: "mubing",
		},
	},
	diaoling: {
		audio: 2,
		audioname: ["sp_key_yuri"],
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "metal",
		filter(event, player) {
			var num = 0;
			player.getAllHistory("gain", function (evt) {
				var evt2 = evt.getParent();
				if (evt2.name == "mubing" && evt2.player == player) {
					num += evt.cards.filter(function (card) {
						return card.name == "sha" || get.subtype(card, false) == "equip1" || (get.type2(card, false) == "trick" && get.tag({ name: card.name }, "damage"));
					}).length;
				}
			});
			return num >= 6;
		},
		content() {
			player.awakenSkill(event.name);
			player.storage.mubing2 = true;
			player.markSkill("mubing_rewrite");
			player.chooseDrawRecover(2, true);
		},
		ai: {
			combo: "mubing",
		},
		derivation: "mubing_rewrite",
	},
	refenyin_wufan: { audio: 2 },
	//官渡之战
	xiying: {
		trigger: { player: "phaseUseBegin" },
		audio: 2,
		direct: true,
		filter(event, player) {
			return (
				player.countCards("h", function (card) {
					return _status.connectMode || get.type(card) != "basic";
				}) > 0
			);
		},
		content() {
			"step 0";
			var list = game.filterPlayer(function (current) {
				return current != player;
			});
			list.sortBySeat();
			event.targets = list;
			player
				.chooseToDiscard(get.prompt2("xiying"), "h", function (card) {
					return get.type(card) != "basic";
				})
				.set("logSkill", ["xiying", list])
				.set("ai", function (card) {
					return _status.event.val - get.value(card);
				})
				.set(
					"val",
					(function () {
						return (
							4 *
							Math.sqrt(
								game.countPlayer(function (current) {
									return get.attitude(player, current) < 0 && current.countCards("he") > 0;
								})
							)
						);
					})()
				);
			"step 1";
			if (!result.bool) {
				event.finish();
			} else {
				player.addTempSkill("xiying_gain");
			}
			"step 2";
			var target = targets.shift();
			event.target = target;
			if (target.isIn()) {
				target.chooseToDiscard("he", "弃置一张牌，或本回合内不能使用或打出牌").set("ai", function (card) {
					var player = _status.event.player;
					var source = _status.event.getTrigger().player;
					if (get.attitude(source, player) > 0) {
						return -1;
					}
					if (_status.event.getRand() > 0.5) {
						return 5 - get.value(card);
					}
					return -1;
				});
			}
			"step 3";
			if (target.isIn() && !result.bool) {
				target.addTempSkill("xiying2");
			}
			if (targets.length) {
				event.goto(2);
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return arg.target.hasSkill("xiying2");
			},
		},
		subSkill: {
			gain: {
				audio: "xiying",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return (
						player.getHistory("sourceDamage", function (evt) {
							return evt.isPhaseUsing(player);
						}).length > 0
					);
				},
				content() {
					var card = get.cardPile2(function (card) {
						var type = get.type(card, null, false);
						if (type != "basic" && type != "trick") {
							return false;
						}
						return get.tag(card, "damage") > 0;
					});
					if (card) {
						player.gain(card, "gain2");
					}
				},
			},
		},
	},
	xiying2: {
		mark: true,
		intro: { content: "本回合内不能使用或打出牌" },
		mod: {
			cardEnabled(card) {
				return false;
			},
			cardSavable(card) {
				return false;
			},
			cardRespondable(card) {
				return false;
			},
		},
	},
	gangzhi: {
		audio: 2,
		trigger: {
			player: "damageBefore",
			source: "damageBefore",
		},
		forced: true,
		filter(event, player) {
			if (event.source == event.player) {
				return false;
			}
			if (event.player == player) {
				return event.source && event.source.isIn();
			}
			return true;
		},
		content() {
			trigger.cancel();
			trigger.player.loseHp(trigger.num);
		},
		ai: {
			jueqing: true,
		},
		init(player) {
			game.addGlobalSkill("gangzhi_jueqing");
		},
		onremove() {
			if (!game.hasPlayer(cur => cur.hasSkill("gangzhi", null, null, false), true)) {
				game.removeGlobalSkill("gangzhi_jueqing");
			}
		},
		subSkill: {
			jueqing: {
				trigger: { player: "dieAfter" },
				filter(event, player) {
					return !game.hasPlayer(cur => cur.hasSkill("gangzhi", null, null, false));
				},
				silent: true,
				forceDie: true,
				content() {
					game.removeGlobalSkill("gangzhi_jueqing");
				},
				ai: {
					jueqing: true,
					skillTagFilter(player, tag, arg) {
						if (tag === "jueqing") {
							return arg && arg.hasSkill("gangzhi");
						}
					},
				},
			},
		},
	},
	beizhan: {
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		audio: 2,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("beizhan")).set("ai", function (target) {
				var player = _status.event.player;
				var att = get.attitude(player, target);
				var hs = target.countCards("h");
				var ht = target.maxHp;
				if (hs >= ht && target.isMaxHandcard()) {
					return -att * hs;
				}
				if (
					hs < ht &&
					game.hasPlayer(function (current) {
						return current.countCards("h") > ht;
					})
				) {
					return att * 2 * (ht - hs);
				}
				return 0;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("beizhan", target);
				target.drawTo(Math.min(5, target.maxHp));
				target.addSkill("beizhan2");
			}
		},
		ai: {
			expose: 0.25,
		},
	},
	beizhan2: {
		trigger: { player: "phaseBegin" },
		silent: true,
		firstDo: true,
		sourceSkill: "beizhan",
		content() {
			player.removeSkill("beizhan2");
			if (player.isMaxHandcard()) {
				player.addTempSkill("zishou2");
			}
		},
		mark: true,
		intro: { content: "回合开始时，若手牌数为全场最多，则回合内不能使用牌指定其他角色为目标" },
	},
	fenglve: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		direct: true,
		content() {
			"step 0";
			var goon = player.hasCard(function (card) {
				if (get.position(card) != "h") {
					return false;
				}
				var val = get.value(card);
				if (val < 0) {
					return true;
				}
				if (val <= 5) {
					return card.number >= 12;
				}
				if (val <= 6) {
					return card.number >= 13;
				}
				return false;
			});
			player
				.chooseTarget(get.prompt2("fenglve"), function (card, player, target) {
					return player.canCompare(target);
				})
				.set("ai", function (target) {
					if (!_status.event.goon) {
						return 0;
					}
					return (-get.attitude(player, target) * (1 + target.countCards("e"))) / (1 + target.countCards("j"));
				})
				.set("goon", goon);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("fenglve", target);
				player.chooseToCompare(target);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var num = 0;
				if (target.countCards("h")) {
					num++;
				}
				if (target.countCards("e")) {
					num++;
				}
				if (target.countCards("j")) {
					num++;
				}
				if (num) {
					event.gainner = player;
					event.giver = target;
					target
						.choosePlayerCard(target, num, "hej", true)
						.set("filterButton", function (button) {
							for (var i = 0; i < ui.selected.buttons.length; i++) {
								if (get.position(button.link) == get.position(ui.selected.buttons[i].link)) {
									return false;
								}
							}
							return true;
						})
						.set("prompt", "选择交给" + get.translation(event.gainner) + "的牌");
				} else {
					event.finish();
				}
			} else {
				if (player.countCards("he")) {
					event.gainner = target;
					event.giver = player;
					player.choosePlayerCard(player, true, "he").set("prompt", "选择交给" + get.translation(event.gainner) + "的牌");
				} else {
					event.finish();
				}
			}
			"step 3";
			event.giver.give(result.links, event.gainner);
		},
		group: "fenglve2",
		ai: {
			expose: 0.25,
		},
	},
	fenglve2: {
		trigger: {
			player: "chooseToCompareAfter",
			target: "chooseToCompareAfter",
		},
		sourceSkill: "fenglve",
		check(event, player) {
			var card, target;
			if (player == event.player) {
				card = event.card1;
				target = event.target;
			} else {
				card = event.card2;
				target = event.player;
			}
			return get.attitude(player, target) * get.value(card, target, "raw") > 0;
		},
		filter(event, player) {
			if (event.targets) {
				return false;
			}
			var card, target;
			if (player == event.player) {
				card = event.card1;
				target = event.target;
			} else {
				card = event.card2;
				target = event.player;
			}
			return get.position(card, true) == "o";
		},
		prompt(event, player) {
			var card, target;
			if (player == event.player) {
				card = event.card1;
				target = event.target;
			} else {
				card = event.card2;
				target = event.player;
			}
			return "是否发动【锋略】，令" + get.translation(target) + "获得" + get.translation(card) + "？";
		},
		logTarget(event, player) {
			var target;
			if (player == event.player) {
				target = event.target;
			} else {
				target = event.player;
			}
			return target;
		},
		content() {
			var card, target;
			if (player == trigger.player) {
				card = trigger.card1;
				target = trigger.target;
			} else {
				card = trigger.card2;
				target = trigger.player;
			}
			target.gain(card, "gain2", "log");
		},
	},
	mouzhi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		filterTarget(card, player, target) {
			if (target.storage.mouzhi2 && target.storage.mouzhi2.includes(player)) {
				return false;
			}
			return target != player;
		},
		delay: 0,
		lose: false,
		discard: false,
		check(card) {
			if (card.name == "du") {
				return 20;
			}
			var player = _status.event.player;
			var useval = player.getUseValue(card);
			var maxval = 0;
			game.countPlayer(function (current) {
				if (current != player && !current.hasSkillTag("nogain") && get.attitude(player, current) > 0) {
					var temp = current.getUseValue(card);
					if (temp > maxval) {
						maxval = temp;
					}
				}
			});
			if (maxval > 0 && get.tag(card, "damage")) {
				return 15;
			}
			if (maxval > useval) {
				return 10;
			}
			if (player.needsToDiscard()) {
				return 1 / Math.max(0.1, get.value(card));
			}
			return -1;
		},
		content() {
			player.give(cards, target);
			target.addTempSkill("mouzhi2", { player: "phaseEnd" });
			target.storage.mouzhi2.add(player);
			target.storage.mouzhi2.sortBySeat(target);
			target.markSkill("mouzhi2");
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (ui.selected.cards.length) {
						var card = ui.selected.cards[0];
						if (card.name == "du") {
							return target.hasSkill("lucia_duqu") ? 1 : -1;
						}
						var t = target.getUseValue(card);
						var p = player.getUseValue(card);
						if (t > p) {
							return 2;
						}
						if (t > 0) {
							return 1.5;
						}
						if (player.needsToDiscard()) {
							return 1;
						}
						return 0;
					}
					return 0;
				},
			},
		},
	},
	mouzhi2: {
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = [];
			}
		},
		onremove: true,
		trigger: { source: "damageSource" },
		forced: true,
		intro: {
			content: "出牌阶段内第一次对一名其他角色造成伤害时，$摸一张牌",
		},
		sourceSkill: "mouzhi",
		filter(event, player) {
			var evt2 = event.getParent("phaseUse");
			if (!evt2 || evt2.player != player) {
				return false;
			}
			var history = event.player.getHistory("damage", function (evt) {
				return evt.source == player && evt.getParent("phaseUse") == evt2;
			});
			return history[0] == event;
		},
		content() {
			"step 0";
			game.asyncDraw(player.storage.mouzhi2);
			"step 1";
			game.delay();
		},
	},
	yuanlve: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		filter(event, player) {
			return player.countCards("h", function (card) {
				return get.type(card) != "equip";
			});
		},
		filterCard(card) {
			return get.type(card) != "equip";
		},
		filterTarget: lib.filter.notMe,
		delay: false,
		discard: false,
		lose: false,
		check(card) {
			if (card.name == "du") {
				return 20;
			}
			var player = _status.event.player;
			var useval = player.getUseValue(card);
			var maxval = 0;
			game.countPlayer(function (current) {
				if (current != player && !current.hasSkillTag("nogain") && get.attitude(player, current) > 0) {
					var temp = current.getUseValue(card);
					if (temp > maxval) {
						maxval = temp;
					}
				}
			});
			if (maxval > useval) {
				return 15;
			}
			if (maxval > 0) {
				return 10;
			}
			if (player.needsToDiscard()) {
				return 1 / Math.max(0.1, get.value(card));
			}
			return -1;
		},
		content() {
			"step 0";
			player.give(cards, target);
			"step 1";
			target.chooseUseTarget(cards[0]);
			"step 2";
			if (result.bool) {
				player.draw();
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (ui.selected.cards.length) {
						var card = ui.selected.cards[0];
						if (card.name == "du") {
							return target.hasSkill("lucia_duqu") ? 1 : -1;
						}
						var t = target.getUseValue(card);
						var p = player.getUseValue(card);
						if (t > p) {
							return 2;
						}
						if (t > 0) {
							return 1.5;
						}
						if (player.needsToDiscard()) {
							return 1;
						}
						return 0;
					}
					return 0;
				},
			},
		},
	},
	//吕旷吕翔和淳于琼和官渡哔哔机
	spshicai: {
		audio: 2,
		enable: "phaseUse",
		position: "he",
		filter(event, player) {
			return !player.storage.spshicai2 || !player.getCards("h").includes(player.storage.spshicai2);
		},
		filterCard: true,
		prompt() {
			var str = "弃置一张牌，然后获得";
			if (get.itemtype(_status.pileTop) == "card") {
				str += get.translation(_status.pileTop);
			} else {
				str += "牌堆顶的一张牌";
			}
			return str;
		},
		check(card) {
			var player = _status.event.player;
			var cardx = _status.pileTop;
			if (get.itemtype(cardx) != "card") {
				return 0;
			}
			var val = player.getUseValue(cardx, null, true);
			if (!val) {
				return 0;
			}
			var val2 = player.getUseValue(card, null, true);
			return (val - val2) / Math.max(0.1, get.value(card));
		},
		content() {
			var card = get.cards()[0];
			player.storage.spshicai2 = card;
			player.gain(card, "draw");
			game.log(player, "获得了牌堆顶的一张牌");
		},
		group: "spshicai_mark",
		ai: {
			order: 1,
			result: { player: 1 },
		},
	},
	spshicai_mark: {
		trigger: { player: "phaseUseBegin" },
		silent: true,
		firstDo: true,
		sourceSkill: "spshicai",
		content() {
			player.addTempSkill("spshicai2", "phaseUseEnd");
		},
	},
	spshicai2: {
		onremove: true,
		mark: true,
		intro: {
			mark(dialog, content, player) {
				if (player != game.me) {
					return get.translation(player) + "观看牌堆中...";
				}
				if (get.itemtype(_status.pileTop) != "card") {
					return "牌堆顶无牌";
				}
				dialog.add([_status.pileTop]);
			},
		},
	},
	spfushi: {
		group: ["zezhu", "chenggong"],
		derivation: ["zezhu", "chenggong"],
		locked: true,
	},
	zezhu: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var enemy = 0;
			var friend = 0;
			var zhu = 0;
			for (var i of game.players) {
				if (i.isEnemyOf(player)) {
					enemy++;
				} else {
					friend++;
				}
				if (i != player && i.isZhu) {
					zhu++;
				}
			}
			return zhu > 0 && enemy < friend;
		},
		filterTarget(card, player, target) {
			return target != player && target.isZhu;
		},
		selectTarget: -1,
		multiline: true,
		multitarget: true,
		content() {
			"step 0";
			event.targets.sortBySeat();
			event.targets2 = event.targets.slice(0);
			"step 1";
			var target = event.targets2.shift();
			if (target.countGainableCards(player, "he") > 0) {
				player.gainPlayerCard(target, "he", true);
			} else {
				player.draw();
			}
			if (event.targets2.length) {
				event.redo();
			}
			"step 2";
			if (player.countCards("he") >= targets.length) {
				player.chooseCard("he", true, "依次选择" + get.cnNumber(targets.length) + "张牌，分别交给" + get.translation(targets), targets.length).set("ai", function (card) {
					var target = _status.event.getParent().targets[ui.selected.cards.length];
					var player = _status.event.player;
					return get.attitude(player, target) * get.value(card, target);
				});
			} else {
				event.finish();
			}
			"step 3";
			var list = [];
			for (var i = 0; i < targets.length; i++) {
				list.push([targets[i], result.cards[i]]);
			}
			game.loseAsync({
				gain_list: list,
				giver: player,
				player: player,
				cards: result.cards,
				animate: "giveAuto",
			}).setContent("gaincardMultiple");
		},
		ai: {
			order: 6,
			result: { player: 1 },
		},
	},
	chenggong: {
		audio: 2,
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (!(event.isFirstTarget && event.targets && event.targets.length > 1 && event.player.isIn())) {
				return false;
			}
			var enemy = 0;
			var friend = 0;
			for (var i of game.players) {
				if (i.isEnemyOf(player)) {
					enemy++;
				} else {
					friend++;
				}
			}
			return enemy > friend;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		content() {
			trigger.player.draw();
		},
	},
	cangchu: {
		trigger: {
			global: "phaseBefore",
			player: ["damageEnd", "enterGame"],
		},
		audio: 2,
		forced: true,
		filter(event, player) {
			if (event.name != "damage") {
				return event.name != "phase" || game.phaseNumber == 0;
			}
			return event.hasNature("fire") && player.countMark("cangchu") > 0;
		},
		content() {
			if (trigger.name != "damage") {
				player.addMark("cangchu", 3);
			} else {
				player.removeMark("cangchu", Math.min(trigger.num, player.countMark("cangchu")));
				if (!player.hasMark("cangchu")) {
					event.trigger("cangchuAwaken");
				}
			}
		},
		marktext: "粮",
		intro: {
			name2: "粮",
			content: "mark",
		},
		ai: {
			threaten(player, target) {
				return 1 + target.countMark("cangchu") / 2;
			},
			effect: {
				target(card, player, target, current) {
					if (target.hasMark("cangchu")) {
						if (card.name == "sha") {
							if (lib.skill.global.includes("huoshaowuchao") || game.hasNature(card, "fire") || player.hasSkill("zhuque_skill")) {
								return 2;
							}
						}
						if (get.tag(card, "fireDamage") && current < 0) {
							return 2;
						}
					}
				},
			},
			combo: "liangying",
		},
	},
	sushou: {
		audio: 2,
		trigger: { player: "phaseDiscardBegin" },
		frequent: true,
		async content(event, trigger, player) {
			await player.draw(1 + player.countMark("cangchu"));
			const num = Math.min(
				player.countCards("h"),
				player.countCards("he"),
				game.countPlayer(target => target != player && target.isFriendOf(player))
			);
			if (num) {
				let list = [];
				if (_status.connectMode) {
					game.broadcastAll(() => (_status.noclearcountdown = true));
				}
				while (num - list.length > 0) {
					const {
						result: { bool, targets, cards },
					} = await player
						.chooseCardTarget({
							prompt: "宿守：你可以交给友方角色各一张牌",
							position: "he",
							animate: false,
							filterCard(card, player) {
								return !get.event("list").some(list => list[1] == card);
							},
							filterTarget(card, player, target) {
								return target != player && target.isFriendOf(player) && !get.event("list").some(list => list[0] == target);
							},
							ai1(card) {
								if (card.name == "shan") {
									return 1;
								}
								return Math.random();
							},
							ai2(target) {
								return get.attitude(get.event("player"), target);
							},
						})
						.set("list", list);
					if (bool) {
						list.push([targets[0], cards[0]]);
						player.addGaintag(cards, "olsujian_given");
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
					await game
						.loseAsync({
							gain_list: list,
							player: player,
							cards: list.slice().flatMap(list => list[1]),
							giver: player,
							animate: "giveAuto",
						})
						.setContent("gaincardMultiple");
				}
			}
		},
	},
	liangying: {
		trigger: {
			global: "phaseDrawBegin2",
			player: "cangchuAwaken",
		},
		forced: true,
		audio: false,
		logTarget(event, player) {
			if (event.name == "phaseDraw") {
				return event.player;
			}
			return game.filterPlayer(function (current) {
				return current.isEnemyOf(player);
			});
		},
		filter(event, player) {
			if (event.name == "cangchu") {
				return true;
			}
			return player.hasMark("cangchu") && !event.numFixed && event.player.isFriendOf(player);
		},
		content() {
			"step 0";
			if (trigger.name == "cangchu") {
				player.loseMaxHp();
				var list = game.filterPlayer(function (current) {
					return current.isEnemyOf(player);
				});
				if (list.length) {
					game.asyncDraw(list, 2);
				}
			} else {
				trigger.num++;
				event.finish();
			}
			"step 1";
			game.delay();
		},
		ai: {
			combo: "cangchu",
		},
	},
	liehou: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		filterTarget(card, player, target) {
			return player.inRange(target) && target.countCards("h");
		},
		content() {
			"step 0";
			target.chooseCard("h", true, "交给" + get.translation(player) + "一张牌");
			"step 1";
			if (result.bool) {
				target.give(result.cards, player);
			} else {
				event.finish();
			}
			"step 2";
			if (
				player.countCards("h") &&
				game.hasPlayer(function (current) {
					return current != target && player.inRange(current);
				})
			) {
				player.chooseCardTarget({
					position: "h",
					filterCard: true,
					filterTarget(card, player, target) {
						return target != _status.event.getParent().target && player.inRange(target);
					},
					forced: true,
					prompt: "将一张手牌交给一名攻击范围内的其他角色",
					ai1(card) {
						var player = _status.event.player;
						if (get.name(card) == "du") {
							return 20;
						}
						if (
							game.hasPlayer(function (current) {
								return current != _status.event.getParent().target && player.inRange(current) && get.attitude(player, current) > 0 && current.getUseValue(card) > player.getUseValue(card) && current.getUseValue(card) > player.getUseValue(card);
							})
						) {
							return 12;
						}
						if (
							game.hasPlayer(function (current) {
								return current != player && get.attitude(player, current) > 0;
							})
						) {
							if (card.name == "wuxie") {
								return 11;
							}
							if (card.name == "shan" && player.countCards("h", "shan") > 1) {
								return 9;
							}
						}
						return 6 / Math.max(1, get.value(card));
					},
					ai2(target) {
						var player = _status.event.player;
						var card = ui.selected.cards[0];
						var att = get.attitude(player, target);
						if (card.name == "du") {
							return -6 * att;
						}
						if (att > 0) {
							if (get.position(card) == "h" && target.getUseValue(card) > player.getUseValue(card)) {
								return 4 * att;
							}
							if (get.value(card, target) > get.value(card, player)) {
								return 2 * att;
							}
							return 1.2 * att;
						}
						return (-att * Math.min(4, target.countCards("he"))) / 6;
					},
				});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				player.give(result.cards, result.targets[0]);
			}
		},
		ai: {
			order: 6,
			result: {
				target: -1,
			},
		},
	},
	qigong: {
		trigger: { player: "shaMiss" },
		direct: true,
		audio: 2,
		filter(event, player) {
			return (
				event.target.isIn() &&
				game.hasPlayer(function (current) {
					return current != event.target && current.canUse("sha", event.target, false);
				})
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("qigong"), "令一名角色可再对" + get.translation(trigger.target) + "使用一张【杀】", function (card, player, target) {
					var source = _status.event.getTrigger().target;
					return target != source && target.canUse("sha", source, false);
				})
				.set("ai", function (target) {
					var player = _status.event.player,
						card = { name: "sha" },
						source = _status.event.getTrigger().target;
					if (target.hasSha()) {
						var eff1 = get.effect(source, card, target, target);
						if (eff1 > 0) {
							return get.effect(source, card, target, player);
						}
					}
					return target != player ? Math.random() * get.attitude(player, target) : 0;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("qigong", target);
				target.addTempSkill("qigong_ai", "chooseToUseEnd");
				target
					.chooseToUse(
						"是否再对" + get.translation(trigger.target) + "使用一张【杀】？",
						function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						trigger.target,
						-1
					)
					.set("addCount", false)
					.set("oncard", function () {
						_status.event.directHit.addArray(game.players);
					});
			}
		},
		subSkill: {
			ai: {
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return arg.card && arg.card.name == "sha";
					},
				},
			},
		},
	},
	//和沙摩柯一起上线的新服三将
	spjiedao: {
		audio: 2,
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			return (
				player.isDamaged() &&
				game
					.getGlobalHistory(
						"everything",
						evt => {
							return evt.name == "damage" && evt.source == player;
						},
						event
					)
					.indexOf(event) == 0 &&
				event.player.isIn()
			);
		},
		logTarget: "player",
		direct: true,
		check(trigger, player) {
			if (get.attitude(player, trigger.player) >= -1) {
				return false;
			}
			return !trigger.player.hasSkillTag("filterDamage", null, {
				player: player,
				card: trigger.card,
			});
		},
		content() {
			"step 0";
			var num = player.getDamagedHp();
			var map = {};
			var list = [];
			for (var i = 1; i <= num; i++) {
				var cn = get.cnNumber(i, true);
				map[cn] = i;
				list.push(cn);
			}
			event.map = map;
			player
				.chooseControl(list, "cancel2", function () {
					if (!lib.skill.spjiedao.check(_status.event.getTrigger(), player)) {
						return "cancel2";
					}
					return get.cnNumber(_status.event.goon, true);
				})
				.set("prompt", get.prompt2("spjiedao", trigger.player))
				.set("goon", num);
			"step 1";
			if (result.control == "cancel2") {
				return;
			}
			player.logSkill("spjiedao", trigger.player);
			var num = event.map[result.control] || 1;
			trigger.num += num;
			player
				.when({ global: "damageEnd" })
				.filter(evt => evt == trigger)
				.then(() => {
					if (trigger.player.isIn()) {
						player.chooseToDiscard(num, true, "he");
					}
				})
				.vars({ num: num });
		},
	},
	biaozhao: {
		audio: 2,
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		trigger: {
			player: "phaseJieshuBegin",
		},
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0 && !player.getExpansions("biaozhao").length;
		},
		content() {
			"step 0";
			player.chooseCard("he", get.prompt("biaozhao"), "将一张牌置于武将牌上作为“表”").ai = function (card) {
				return 6 - get.value(card);
			};
			"step 1";
			if (result.bool) {
				player.logSkill("biaozhao");
				player.addToExpansion(result.cards, player, "give").gaintag.add("biaozhao");
			}
		},
		ai: {
			notemp: true,
		},
		group: ["biaozhao2", "biaozhao3"],
	},
	biaozhao2: {
		trigger: {
			global: ["loseAsyncAfter", "loseAfter", "cardsDiscardAfter"],
		},
		forced: true,
		audio: "biaozhao",
		sourceSkill: "biaozhao",
		filter(event, player) {
			if (event.name == "loseAsyncAfter" && event.type != "discard") {
				return false;
			}
			if (event.name == "lose" && (event.getlx === false || event.position != ui.discardPile)) {
				return false;
			}
			var cards = player.getExpansions("biaozhao");
			if (!cards.length) {
				return false;
			}
			var suit = get.suit(cards[0]);
			var num = get.number(cards[0]);
			var cards = event.getd();
			for (var card of cards) {
				if (get.suit(card) == suit && get.number(card) == num) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var card = player.getExpansions("biaozhao")[0];
			if (trigger.getParent().name == "discard") {
				trigger.player.gain(card, player, "give", "bySelf");
			} else {
				player.loseToDiscardpile(card);
			}
			"step 1";
			player.loseHp();
		},
	},
	biaozhao3: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		forced: true,
		charlotte: true,
		audio: "biaozhao",
		sourceSkill: "biaozhao",
		filter(event, player) {
			return player.getExpansions("biaozhao").length > 0;
		},
		content() {
			"step 0";
			var card = player.getExpansions("biaozhao")[0];
			player.loseToDiscardpile(card);
			"step 1";
			event.num = 0;
			game.countPlayer(function (current) {
				if (current.countCards("h") > event.num) {
					event.num = current.countCards("h");
				}
			});
			player.chooseTarget("是否令一名角色将手牌摸至" + event.num + "张并回复1点体力？").ai = function (target) {
				var num = Math.min(event.num - target.countCards("h"), 5);
				if (target.isDamaged()) {
					num++;
				}
				return num * get.attitude(_status.event.player, target);
			};
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				var draw = Math.min(num - target.countCards("h"), 5);
				if (draw) {
					target.draw(draw);
				}
				target.recover();
			}
		},
	},
	yechou: {
		audio: 2,
		trigger: {
			player: "die",
		},
		direct: true,
		forceDie: true,
		skillAnimation: true,
		animationColor: "wood",
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("yechou"), function (card, player, target) {
					return player != target && target.getDamagedHp() > 1;
				})
				.set("forceDie", true)
				.set("ai", function (target) {
					let att = get.attitude(_status.event.player, target);
					if (att > 0) {
						return 0;
					}
					att = Math.sqrt(0.01 - att);
					return att * (get.distance(_status.currentPhase, target, "absolute") || game.players.length);
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("yechou", target);
				player.line(target, "green");
				target.addTempSkill("yechou2", { player: "phaseZhunbeiBegin" });
			}
		},
		ai: {
			expose: 0.5,
			maixie_defend: true,
		},
	},
	yechou2: {
		mark: true,
		marktext: "仇",
		intro: {
			content: "每个回合结束时失去1点体力直到回合开始",
		},
		trigger: {
			global: "phaseAfter",
		},
		forced: true,
		sourceSkill: "yechou",
		content() {
			player.loseHp();
		},
	},
	yanjiao: {
		audio: 2,
		ai: {
			order: 10,
			result: {
				player: 1,
				target: 1.1,
			},
		},
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player;
		},
		content() {
			"step 0";
			var num = 4;
			if (player.storage.xingshen) {
				num += player.storage.xingshen;
				player.storage.xingshen = 0;
				player.unmarkSkill("xingshen");
			}
			if (player.storage.olxingshen) {
				num += player.storage.olxingshen;
				player.storage.olxingshen = 0;
				player.unmarkSkill("olxingshen");
			}
			num = Math.min(10, num);
			event.cards = get.cards(num);
			game.cardsGotoOrdering(event.cards);
			player.showCards(event.cards);
			"step 1";
			event.getedResult = lib.skill.yanjiao.getResult(cards);
			if (!event.getedResult.length) {
				player.addTempSkill("yanjiao2");
				event.finish();
			}
			"step 2";
			target.chooseControl("自动分配", "手动分配").set("prompt", "【严教】：是否让系统自动分配方案？").ai = function () {
				return 0;
			};
			"step 3";
			if (result.control == "手动分配") {
				event.goto(8);
			}
			"step 4";
			event.index = 0;
			event.togain = event.getedResult[event.index];
			target.showCards(event.togain[0], get.translation(target) + "分出的第一份牌");
			"step 5";
			target.showCards(event.togain[1], get.translation(target) + "分出的第二份牌");
			"step 6";
			target.chooseControl().set("choiceList", ["获得" + get.translation(event.togain[0]), "获得" + get.translation(event.togain[1])]).ai = function () {
				return Math.random() < 0.5 ? 1 : 0;
			};
			"step 7";
			var list = [
				[target, event.togain[result.index]],
				[player, event.togain[1 - result.index]],
			];
			game.loseAsync({
				gain_list: list,
				giver: target,
				animate: "gain2",
			}).setContent("gaincardMultiple");
			if (event.togain[2].length > 1) {
				player.addTempSkill("yanjiao2");
			}
			event.finish();
			"step 8";
			var next = target.chooseToMove("严教：分出点数相等的两组牌");
			next.set("chooseTime", (cards.length * 4).toString());
			next.set("list", [
				[
					"未分配",
					cards,
					function (list) {
						var num = 0;
						for (var i of list) {
							num += i.number;
						}
						return "未分配（点数和" + num + "）";
					},
				],
				[
					"第一组",
					[],
					function (list) {
						var num = 0;
						for (var i of list) {
							num += i.number;
						}
						return "第一组（点数和" + num + "）";
					},
				],
				[
					"第二组",
					[],
					function (list) {
						var num = 0;
						for (var i of list) {
							num += i.number;
						}
						return "第二组（点数和" + num + "）";
					},
				],
			]);
			next.set("filterOk", function (moved) {
				var num1 = 0;
				for (var i of moved[1]) {
					num1 += i.number;
				}
				if (num1 == 0) {
					return false;
				}
				var num2 = 0;
				for (var i of moved[2]) {
					num2 += i.number;
				}
				return num1 == num2;
			});
			next.set("processAI", () => false);
			"step 9";
			if (result.bool) {
				var moved = result.moved;
				event.getedResult = [[moved[1], moved[2], moved[0]]];
				event.goto(4);
			} else {
				player.addTempSkill("yanjiao2");
			}
		},
		getResult(cards) {
			var cl = cards.length;
			var maxmium = Math.pow(3, cl);
			var filter = function (list) {
				if (!list[1].length || !list[0].length) {
					return false;
				}
				var num1 = 0;
				for (var i = 0; i < list[1].length; i++) {
					num1 += list[1][i].number;
				}
				var num2 = 0;
				for (var j = 0; j < list[0].length; j++) {
					num2 += list[0][j].number;
				}
				return num1 == num2;
			};
			var results = [];
			for (var i = 0; i < maxmium; i++) {
				var result = [[], [], []];
				for (var j = 0; j < cl; j++) {
					result[Math.floor((i % Math.pow(3, j + 1)) / Math.pow(3, j))].push(cards[j]);
				}
				if (filter(result)) {
					results.push(result);
				}
			}
			var filterSame = function (list1, list2) {
				if (list1[1].length == list2[0].length && list1[0].length == list2[1].length) {
					for (var i = 0; i < list1[0].length; i++) {
						if (!list2[1].includes(list1[0][i])) {
							return false;
						}
					}
					for (var i = 0; i < list1[1].length; i++) {
						if (!list2[0].includes(list1[1][i])) {
							return false;
						}
					}
					return true;
				}
				return false;
			};
			for (var i = 0; i < results.length; i++) {
				for (var j = i + 1; j < results.length; j++) {
					if (filterSame(results[i], results[j])) {
						results.splice(j--, 1);
					}
				}
			}
			results.sort(function (a, b) {
				return a[2].length - b[2].length;
			});
			return results.slice(0, 50);
		},
	},
	yanjiao2: {
		marktext: "教",
		mark: true,
		intro: {
			content: "本回合手牌上限-1",
		},
		mod: {
			maxHandcard(player, num) {
				return num - 1;
			},
		},
	},
	xingshen: {
		audio: 2,
		intro: {
			content: "下一次发动【严教】时多展示#张牌",
		},
		trigger: {
			player: "damageEnd",
		},
		frequent: true,
		content() {
			player.draw(player.isMinHandcard() ? 2 : 1);
			if (!player.storage.xingshen) {
				player.storage.xingshen = 0;
			}
			player.storage.xingshen += player.isMinHp() ? 2 : 1;
			if (player.storage.xingshen > 4) {
				player.storage.xingshen = 4;
			}
			player.markSkill("xingshen");
		},
	},
	pingjian: {
		initList() {
			game.initCharactertList();
		},
		init(player) {
			player.addSkill("pingjian_check");
			if (!player.storage.pingjian_check) {
				player.storage.pingjian_check = {};
			}
		},
		audio: 2,
		trigger: { player: ["damageEnd", "phaseJieshuBegin"] },
		frequent: true,
		content() {
			"step 0";
			if (!_status.characterlist) {
				game.initCharactertList();
			}
			var allList = _status.characterlist.slice(0);
			game.countPlayer(function (current) {
				if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") != 0 && current.name.indexOf("gz_jun_") != 0) {
					allList.add(current.name);
				}
				if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") != 0 && current.name1.indexOf("gz_jun_") != 0) {
					allList.add(current.name1);
				}
				if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") != 0 && current.name2.indexOf("gz_jun_") != 0) {
					allList.add(current.name2);
				}
			});
			var list = [];
			var skills = [];
			var map = [];
			allList.randomSort();
			var name2 = event.triggername;
			for (var i = 0; i < allList.length; i++) {
				var name = allList[i];
				if (name.indexOf("zuoci") != -1 || name.indexOf("xushao") != -1) {
					continue;
				}
				var skills2 = lib.character[name][3];
				for (var j = 0; j < skills2.length; j++) {
					if (player.getStorage("pingjian").includes(skills2[j])) {
						continue;
					}
					if (skills.includes(skills2[j])) {
						list.add(name);
						if (!map[name]) {
							map[name] = [];
						}
						map[name].push(skills2[j]);
						skills.add(skills2[j]);
						continue;
					}
					var list2 = [skills2[j]];
					game.expandSkills(list2);
					for (var k = 0; k < list2.length; k++) {
						var info = lib.skill[list2[k]];
						if (get.is.zhuanhuanji(list2[k], player)) {
							continue;
						}
						if (!info || !info.trigger || !info.trigger.player || info.silent || info.limited || info.juexingji || info.hiddenSkill || info.dutySkill || (info.zhuSkill && !player.isZhu2())) {
							continue;
						}
						if (info.trigger.player == name2 || (Array.isArray(info.trigger.player) && info.trigger.player.includes(name2))) {
							if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) {
								continue;
							}
							if (info.init) {
								continue;
							}
							if (info.filter) {
								try {
									var bool = info.filter(trigger, player, name2);
									if (!bool) {
										continue;
									}
								} catch (e) {
									continue;
								}
							}
							list.add(name);
							if (!map[name]) {
								map[name] = [];
							}
							map[name].push(skills2[j]);
							skills.add(skills2[j]);
							break;
						}
					}
				}
				if (list.length > 2) {
					break;
				}
			}
			if (skills.length) {
				event.list = list;
				player.chooseControl(skills).set("dialog", ["评鉴：请选择尝试发动的技能", [list, "character"]]);
			} else {
				event.finish();
			}
			"step 1";
			player.markAuto("pingjian", [result.control]);
			player.addTempSkill(result.control);
			player.storage.pingjian_check[result.control] = trigger.name == "damage" ? trigger : "phaseJieshu";
			var name = event.list.find(name => lib.character[name][3].includes(result.control));
			// if(name) lib.skill.rehuashen.createAudio(name,result.control,'xushao');
			if (name) {
				game.broadcastAll((player, name) => player.tempname.add(name), player, name);
			}
		},
		group: "pingjian_use",
		phaseUse_special: [],
		ai: { threaten: 5 },
	},
	pingjian_use: {
		audio: "pingjian",
		enable: "phaseUse",
		usable: 1,
		sourceSkill: "pingjian",
		prompt: () => lib.translate.pingjian_info,
		content() {
			"step 0";
			var list = [];
			var skills = [];
			var map = [];
			var evt = event.getParent(2);
			if (!_status.characterlist) {
				game.initCharactertList();
			}
			var allList = _status.characterlist.slice(0);
			game.countPlayer(function (current) {
				if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") != 0 && current.name.indexOf("gz_jun_") != 0) {
					allList.add(current.name);
				}
				if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") != 0 && current.name1.indexOf("gz_jun_") != 0) {
					allList.add(current.name1);
				}
				if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") != 0 && current.name2.indexOf("gz_jun_") != 0) {
					allList.add(current.name2);
				}
			});
			allList.randomSort();
			for (var i = 0; i < allList.length; i++) {
				var name = allList[i];
				if (name.indexOf("zuoci") != -1 || name.indexOf("xushao") != -1) {
					continue;
				}
				var skills2 = lib.character[name][3];
				for (var j = 0; j < skills2.length; j++) {
					if (player.getStorage("pingjian").includes(skills2[j])) {
						continue;
					}
					if (get.is.locked(skills2[j], player)) {
						continue;
					}
					var info = lib.translate[skills2[j] + "_info"];
					if (skills.includes(skills2[j]) || (info && info.indexOf("当你于出牌阶段") != -1 && info.indexOf("当你于出牌阶段外") == -1)) {
						list.add(name);
						if (!map[name]) {
							map[name] = [];
						}
						map[name].push(skills2[j]);
						skills.add(skills2[j]);
						continue;
					}
					var list2 = [skills2[j]];
					game.expandSkills(list2);
					for (var k = 0; k < list2.length; k++) {
						var info = lib.skill[list2[k]];
						if (get.is.zhuanhuanji(list2[k], player)) {
							continue;
						}
						if (!info || !info.enable || info.charlotte || info.limited || info.juexingji || info.hiddenSkill || info.dutySkill || (info.zhuSkill && !player.isZhu2())) {
							continue;
						}
						if (info.enable == "phaseUse" || (Array.isArray(info.enable) && info.enable.includes("phaseUse")) || info.enable == "chooseToUse" || (Array.isArray(info.enable) && info.enable.includes("chooseToUse"))) {
							if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) {
								continue;
							}
							if (info.init || info.onChooseToUse) {
								continue;
							}
							if (info.filter) {
								try {
									var bool = info.filter(evt, player);
									if (!bool) {
										continue;
									}
								} catch (e) {
									continue;
								}
							} else if (info.viewAs && typeof info.viewAs != "function") {
								try {
									if (evt.filterCard && !evt.filterCard(info.viewAs, player, evt)) {
										continue;
									}
									if (info.viewAsFilter && info.viewAsFilter(player) == false) {
										continue;
									}
								} catch (e) {
									continue;
								}
							}
							list.add(name);
							if (!map[name]) {
								map[name] = [];
							}
							map[name].push(skills2[j]);
							skills.add(skills2[j]);
							break;
						}
					}
				}
				if (list.length > 2) {
					break;
				}
			}
			if (skills.length) {
				event.list = list;
				player.chooseControl(skills).set("dialog", ["评鉴：请选择尝试发动的技能", [list, "character"]]);
			} else {
				event.finish();
			}
			"step 1";
			player.markAuto("pingjian", [result.control]);
			player.addTempSkill(result.control);
			player.storage.pingjian_check[result.control] = "phaseUse";
			var name = event.list.find(name => lib.character[name][3].includes(result.control));
			// if(name) lib.skill.rehuashen.createAudio(name,result.control,'xushao');
			if (name) {
				game.broadcastAll((player, name) => player.tempname.add(name), player, name);
			}
		},
		ai: { order: 12, result: { player: 1 } },
	},
	pingjian_check: {
		charlotte: true,
		trigger: { player: ["useSkill", "logSkillBegin"] },
		sourceSkill: "pingjian",
		filter(event, player) {
			var info = get.info(event.skill);
			if (info && info.charlotte) {
				return false;
			}
			var skill = get.sourceSkillFor(event);
			return player.storage.pingjian_check[skill];
		},
		direct: true,
		firstDo: true,
		priority: Infinity,
		content() {
			var skill = get.sourceSkillFor(trigger);
			player.removeSkill(skill);
			const names = player.tempname && player.tempname.filter(i => lib.character[i][3].includes(skill));
			if (names) {
				game.broadcastAll((player, names) => player.tempname.removeArray(names), player, names);
			}
			delete player.storage.pingjian_check[skill];
		},
		group: "pingjian_check2",
	},
	pingjian_check2: {
		charlotte: true,
		trigger: { player: ["phaseUseEnd", "damageEnd", "phaseJieshuBegin"] },
		sourceSkill: "pingjian",
		filter(event, player) {
			return Object.keys(player.storage.pingjian_check).find(function (skill) {
				if (event.name != "damage") {
					return player.storage.pingjian_check[skill] == event.name;
				}
				return player.storage.pingjian_check[skill] == event;
			});
		},
		direct: true,
		lastDo: true,
		priority: -Infinity,
		content() {
			var skills = Object.keys(player.storage.pingjian_check).filter(function (skill) {
				if (trigger.name != "damage") {
					return player.storage.pingjian_check[skill] == trigger.name;
				}
				return player.storage.pingjian_check[skill] == trigger;
			});
			player.removeSkill(skills);
			const names = player.tempname && player.tempname.filter(i => skills.some(skill => lib.character[i][3].includes(skill)));
			if (names) {
				game.broadcastAll((player, names) => player.tempname.removeArray(names), player, names);
			}
			for (var skill of skills) {
				delete player.storage.pingjian_check[skill];
			}
		},
	},
	//上兵伐谋
	//伊籍在标包 不会移动
	songshu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			return target != player && player.canCompare(target);
		},
		content() {
			"step 0";
			player.chooseToCompare(target).set("small", get.attitude(player, target) > 0);
			"step 1";
			if (!result.bool) {
				player.draw(2, "nodelay");
				target.draw(2);
				player.tempBanSkill("songshu", "phaseUseAfter");
			} else {
				target.addTempSkill("songshu_ai");
			}
		},
		ai: {
			basic: {
				order: 1,
			},
			expose: 0.2,
			result: {
				target(player, target) {
					if (target.hasSkill("songshu_ai", null, null, false)) {
						return 0;
					}
					var maxnum = 0;
					var cards2 = target.getCards("h");
					for (var i = 0; i < cards2.length; i++) {
						if (get.number(cards2[i]) > maxnum) {
							maxnum = get.number(cards2[i]);
						}
					}
					if (maxnum > 10) {
						maxnum = 10;
					}
					if (maxnum < 5 && cards2.length > 1) {
						maxnum = 5;
					}
					var cards = player.getCards("h");
					for (var i = 0; i < cards.length; i++) {
						if (get.number(cards[i]) < maxnum) {
							return 1;
						}
					}
					return 0;
				},
			},
		},
	},
	songshu_ai: { charlotte: true },
	sibian: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			"step 0";
			trigger.changeToZero();
			event.cards = get.cards(4);
			game.cardsGotoOrdering(event.cards);
			player.showCards(event.cards);
			"step 1";
			cards.sort(function (a, b) {
				return b.number - a.number;
			});
			var gains = [];
			var mx = [cards[0].number, cards[3].number];
			for (var i = 0; i < cards.length; i++) {
				if (mx.includes(cards[i].number)) {
					gains.addArray(cards.splice(i--, 1));
				}
			}
			player.gain(gains, "gain2");
			if (cards.length > 0) {
				player
					.chooseTarget("是否令一名手牌数最少的角色获得" + get.translation(cards), function (card, player, target) {
						return target.isMinHandcard();
					})
					.set("ai", function (target) {
						return get.attitude(_status.event.player, target);
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				player.addExpose(0.2);
				target.gain(cards, "gain2");
			}
		},
	},
	lslixun: {
		audio: 2,
		forced: true,
		trigger: { player: "damageBegin4" },
		marktext: "珠",
		intro: {
			name2: "珠",
			content: "共有#个“珠”",
		},
		content() {
			trigger.cancel();
			player.addMark("lslixun", trigger.num);
		},
		group: "lslixun_fate",
	},
	lslixun_fate: {
		audio: "lslixun",
		trigger: { player: "phaseUseBegin" },
		forced: true,
		sourceSkill: "lslixun",
		filter(event, player) {
			return player.countMark("lslixun") > 0;
		},
		content() {
			"step 0";
			event.forceDie = true;
			_status.lslixun = player.countMark("lslixun");
			player.judge(function (card) {
				if (get.number(card) < _status.lslixun) {
					return -_status.lslixun;
				}
				return 1;
			}).judge2 = function (result) {
				return result.bool ? true : false;
			};
			"step 1";
			delete _status.lslixun;
			if (!result.bool) {
				player.chooseToDiscard([1, player.countMark("lslixun")], "h").ai = lib.skill.qiangxi.check;
			} else {
				event.finish();
			}
			"step 2";
			var num = player.countMark("lslixun");
			if (result.cards && result.cards.length) {
				num -= result.cards.length;
			}
			if (num) {
				player.loseHp(num);
			}
		},
	},
	lskuizhu: {
		audio: 2,
		trigger: { player: "phaseUseEnd" },
		direct: true,
		filter(event, player) {
			return player.isMaxHp(true) == false;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("lskuizhu"), function (card, player, target) {
				return target != player && target.isMaxHp();
			}).ai = function (target) {
				var player = _status.event.player;
				var ts = Math.min(5, target.countCards("h"));
				var delta = ts - player.countCards("h");
				if (delta <= 0) {
					return 0;
				}
				if (get.attitude(player, target) < 1) {
					return false;
				}
				return target.countCards("he", function (card) {
					return lib.skill.zhiheng.check(card) > 0;
				}) > 1
					? delta
					: 0;
			};
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("lskuizhu", target);
				player.drawTo(Math.min(5, target.countCards("h")));
			} else {
				event.finish();
			}
			"step 2";
			if (!player.countCards("h")) {
				event.finish();
				return;
			}
			target.viewHandcards(player);
			"step 3";
			if (!target.countCards("h")) {
				event.finish();
				return;
			}
			target.chooseToDiscard(true, "h", [1, player.countCards("h")], "弃置至多" + get.cnNumber(player.countCards("h")) + "张手牌，并获得" + get.translation(player) + "等量的手牌").ai = function (card) {
				if (ui.selected.cards.length > 1) {
					return -1;
				}
				return lib.skill.zhiheng.check.apply(this, arguments);
			};
			"step 4";
			if (result.bool && result.cards && result.cards.length && player.countGainableCards(target, "h") > 0) {
				target.gainPlayerCard(player, "h", true, result.cards.length).visible = true;
			}
			"step 5";
			if (result.bool && result.cards && result.cards.length > 1) {
				var bool = player.storage.lslixun > 0 !== true;
				player
					.chooseTarget(bool, "令" + get.translation(target) + "对其攻击范围内的一名角色造成1点伤害" + (bool ? "" : "，或点「取消」移去一个“珠”"), function (card, player, target) {
						var source = _status.event.source;
						return target != source && source.inRange(target);
					})
					.set("source", target)
					.set("ai", function (target) {
						return get.damageEffect(target, _status.event.source, _status.event.player);
					});
			} else {
				event.finish();
			}
			"step 6";
			if (result.bool && result.targets && result.targets.length) {
				player.line(result.targets[0]);
				result.targets[0].damage(target);
			} else {
				player.removeMark("lslixun", 1);
			}
		},
		ai: {
			expose: 0.25,
		},
	},
	xpchijie: {
		audio: 2,
		trigger: {
			target: "useCardToAfter",
		},
		filter(event, player) {
			var evt = event.getParent();
			var targets = evt.targets.slice(evt.num + 1);
			return event.player != player && targets.length > 0;
		},
		usable: 1,
		prompt2(event, player) {
			var evt = event.getParent();
			var targets = evt.targets.slice(evt.num + 1);
			return "令" + get.translation(event.card) + "对" + get.translation(targets) + "无效";
		},
		check(event, player) {
			var evt = event.getParent();
			var targets = evt.targets.slice(evt.num + 1);
			var num = 0;
			for (var i = 0; i < targets.length; i++) {
				num += get.effect(targets[i], evt.card, evt.player, player);
			}
			return num < -1;
		},
		content() {
			var evt = trigger.getParent();
			evt.excluded.addArray(evt.targets);
		},
		group: "xpchijie2",
	},
	xpchijie2: {
		trigger: { global: "useCardAfter" },
		audio: "xpchijie",
		sourceSkill: "xpchijie",
		filter(event, player) {
			return (
				event.player != player &&
				event.targets.includes(player) &&
				event.cards.filterInD().length > 0 &&
				!game.hasPlayer2(function (current) {
					return (
						current.getHistory("damage", function (evt) {
							return evt.card == event.card;
						}).length > 0
					);
				})
			);
		},
		usable: 1,
		check(event, player) {
			return get.value(event.cards.filterInD(), player, "raw") > 0;
		},
		prompt2(event, player) {
			return "获得" + get.translation(event.cards.filterInD()) + "。";
		},
		content() {
			player.gain(trigger.cards.filterInD(), "log", "gain2");
		},
	},
	xpchijie4: {},
	yinju: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		filterTarget: lib.filter.notMe,
		skillAnimation: true,
		animationColor: "water",
		content() {
			player.awakenSkill(event.name);
			player.storage.yinju2 = target;
			player.addTempSkill("yinju2");
			target.addTempSkill("yinju2_target");
		},
		ai: {
			result: {
				order: 10,
				player(player, target) {
					if (
						player.countCards("hs", function (card) {
							return get.tag(card, "damage") && player.canUse(card, target);
						}) >= 1 &&
						target.hp <= 2
					) {
						return 0.1;
					}
					if (
						player.countCards("hes", function (card) {
							return player.canUse(card, target);
						}) <= 2
					) {
						return -100;
					}
					return 1;
				},
				target(player, target) {
					return target.isDamaged() ? 5 : 3;
				},
			},
		},
	},
	yinju2: {
		trigger: {
			player: "useCardToPlayered",
			source: "damageBefore",
		},
		forced: true,
		onremove: true,
		filter(event, player, name) {
			if (name == "useCardToPlayered") {
				return event.target == player.storage.yinju2;
			}
			return event.player == player.storage.yinju2;
		},
		logTarget(event) {
			return event[event.name == "damage" ? "player" : "target"];
		},
		async content(event, trigger, player) {
			if (trigger.name === "damage") {
				trigger.cancel();
				await trigger.player.recover(trigger.num);
			} else {
				await game.asyncDraw([player, trigger.target]);
				await game.delayx();
			}
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (target !== player.storage.yinju2) {
						return;
					}
					if (card.name === "lebu") {
						return;
					}
					return [1, 0.6, 1, 0.6];
				},
			},
		},
		subSkill: {
			target: {
				charlotte: true,
				ai: {
					effect: {
						target(card, player, target) {
							if (!player || target !== player.storage.yinju2) {
								return;
							}
							if (card.name !== "huogong" && get.tag(card, "damage")) {
								return [0, target.isDamaged() ? 2.5 : 0.6, 0, 1];
							}
							return [1, 0.6, 1, 1];
						},
					},
				},
			},
		},
	},
	rewenji: {
		audio: "spwenji",
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("he");
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("rewenji"), function (card, player, target) {
					return target != player && target.countCards("he") > 0;
				})
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					if (att > 0) {
						return Math.sqrt(att) / 10;
					}
					return 5 - att;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("rewenji", target);
				target.chooseCard("he", true, "问计：将一张牌交给" + get.translation(player));
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.addTempSkill("rewenji_respond");
				player.storage.rewenji_respond = get.type2(result.cards[0], target);
				event.target.give(result.cards, player, true);
			}
		},
		subSkill: {
			respond: {
				onremove: true,
				trigger: { player: "useCard" },
				forced: true,
				charlotte: true,
				audio: "spwenji",
				filter(event, player) {
					return get.type2(event.card) == player.storage.rewenji_respond;
				},
				content() {
					trigger.directHit.addArray(
						game.filterPlayer(function (current) {
							return current != player;
						})
					);
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return get.type2(arg.card) == player.storage.rewenji_respond;
					},
				},
			},
		},
	},
	spwenji: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("he");
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("spwenji"), function (card, player, target) {
					return target != player && target.countCards("he") > 0;
				})
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					if (att > 0) {
						return Math.sqrt(att) / 10;
					}
					return 5 - att;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("spwenji", target);
				target.chooseCard("he", true, "问计：将一张牌交给" + get.translation(player));
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.addTempSkill("spwenji_respond");
				player.storage.spwenji_respond = result.cards[0].name;
				event.target.give(result.cards, player, true);
			}
		},
		subSkill: {
			respond: {
				onremove: true,
				trigger: { player: "useCard" },
				forced: true,
				charlotte: true,
				audio: "spwenji",
				filter(event, player) {
					return event.card.name == player.storage.spwenji_respond;
				},
				content() {
					trigger.directHit.addArray(
						game.filterPlayer(function (current) {
							return current != player;
						})
					);
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return arg.card.name == player.storage.spwenji_respond;
					},
				},
			},
		},
	},
	sptunjiang: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter(event, player) {
			//if(player.getHistory('skipped').includes('phaseUse')) return false;
			return (
				player.getHistory("useCard", function (evt) {
					if (evt.targets && evt.targets.length && evt.isPhaseUsing()) {
						var targets = evt.targets.slice(0);
						while (targets.includes(player)) {
							targets.remove(player);
						}
						return targets.length > 0;
					}
					return false;
				}).length == 0
			);
		},
		content() {
			player.draw(game.countGroup());
		},
	},
	bingzhao: {
		audio: 2,
		trigger: {
			global: ["phaseBefore", "zhuUpdate"],
			player: "enterGame",
		},
		filter(event, player) {
			if (player.storage.bingzhao) {
				return false;
			}
			return lib.group.some(group => group != player.group) && player.hasZhuSkill("bingzhao") && (event.name != "phase" || game.phaseNumber == 0);
		},
		zhuSkill: true,
		async cost(event, trigger, player) {
			const list = lib.group.filter(group => group != player.group).slice();
			const maxGroup = list.slice().sort((a, b) => {
				return (
					game.countPlayer(current => {
						return current.group == b && current != player;
					}) -
					game.countPlayer(current => {
						return current.group == a && current != player;
					})
				);
			})[0];
			const control = await player
				.chooseControl(list)
				.set("prompt", "秉诏：请选择一个其他势力")
				.set("ai", () => {
					return get.event().choice;
				})
				.set("choice", maxGroup)
				.forResultControl();
			event.result = { bool: true, cost_data: control };
		},
		async content(event, trigger, player) {
			const { cost_data: group } = event;
			player.popup(get.translation(group) + "势力", get.groupnature(group, "raw"));
			game.log(player, "选择了", "#y" + get.translation(group) + "势力");
			player.storage[event.name] = group;
			player.markSkill(event.name);
		},
		intro: { content: "已选择了$势力" },
		ai: { combo: "guju" },
	},
	baijia: {
		audio: 2,
		audioname: ["tw_beimihu"],
		derivation: "bmcanshi",
		juexingji: true,
		ai: { combo: "guju" },
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.getAllHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent(2).name == "guju").reduce((num, evt) => num + evt.cards.length, 0) >= 7;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp();
			await player.recover();
			const targets = game.filterPlayer(current => player != current && !current.hasMark("zongkui_mark"));
			if (targets.length) {
				for (const target of targets.sortBySeat()) {
					target.addMark("zongkui_mark", 1);
					player.line(target, "green");
				}
			}
			await player.changeSkills(["bmcanshi"], ["guju"]);
		},
	},
	bmcanshi: {
		audio: 2,
		audioname: ["tw_beimihu"],
		trigger: {
			player: "useCard2",
			target: "useCardToTarget",
		},
		filter(event, player, name) {
			const { targets, card } = event;
			if (!["basic", "trick"].includes(get.type(card))) {
				return false;
			}
			if (!targets || targets.length != 1) {
				return false;
			}
			if (name == "useCardToTarget") {
				return event.player.hasMark("zongkui_mark");
			}
			const info = get.info(card);
			if (info.multitarget) {
				return false;
			}
			if (info.allowMultiple == false) {
				return false;
			}
			return game.hasPlayer(current => {
				if (!current.hasMark("zongkui_mark")) {
					return false;
				}
				return !targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
			});
		},
		check(event, player) {
			return get.attitude(event.player, player) < 0 && get.effect(player, event.card, event.player, player) < 0;
		},
		async cost(event, trigger, player) {
			if (event.triggername == "useCardToTarget") {
				const { player: target } = trigger;
				const { result } = await player.chooseBool(get.prompt2(event.skill, target)).set("choice", get.info(event.skill).check(trigger, player));
				if (result?.bool) {
					event.result = { bool: true, targets: [target] };
				}
			} else {
				event.result = await player
					.chooseTarget(get.prompt2(event.skill), [1, Infinity], (card, player, target) => {
						if (!target.hasMark("zongkui_mark")) {
							return false;
						}
						const trigger = get.event().getTrigger();
						return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target);
					})
					.set("ai", target => {
						const player = get.player();
						return get.effect(target, get.event().getTrigger().card, player, player);
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (event.triggername == "useCardToTarget") {
				trigger.targets.remove(player);
				trigger.getParent().triggeredTargets2.remove(player);
				await game.delay();
				trigger.player.removeMark("zongkui_mark");
			} else {
				if (!event.isMine() && !event.isOnline()) {
					await game.delayx();
				}
				const { targets } = event;
				targets.sortBySeat().forEach(current => current.removeMark("zongkui_mark", 1));
				trigger.targets.addArray(event.targets);
			}
		},
		ai: { combo: "zongkui" },
	},
	guju: {
		audio: 2,
		audioname: ["tw_beimihu"],
		trigger: { global: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.player != player && event.player.hasMark("zongkui_mark");
		},
		async content(event, trigger, player) {
			await player.draw();
			player.addMark(event.name, 1, false);
			const { player: target } = trigger;
			if (player.hasZhuSkill("bingzhao", target) && target.group == player.storage.bingzhao && target.isIn()) {
				const { result } = await target.chooseBool(`是否对${get.translation(player)}发动【秉诏】？`).set("choice", get.attitude(target, player) > 1);
				if (!result?.bool) {
					return;
				}
				target.logSkill("bingzhao", player);
				await player.draw();
				player.addMark(event.name, 1, false);
			}
		},
		intro: { content: "已因〖骨疽〗获得#张牌" },
		ai: { combo: "zongkui" },
	},
	zongkui: {
		trigger: {
			player: "phaseBeforeEnd",
			global: "roundStart",
		},
		audio: 2,
		audioname: ["tw_beimihu"],
		filter(event, player, name) {
			return game.hasPlayer(current => {
				if (name == "roundStart" && !current.isMinHp()) {
					return false;
				}
				return current != player && !current.hasMark("zongkui_mark");
			});
		},
		async cost(event, trigger, player) {
			const targets = game.filterPlayer(current => {
				if (event.triggername == "roundStart" && !current.isMinHp()) {
					return false;
				}
				return current != player && !current.hasMark("zongkui_mark");
			});
			if (event.triggername == "roundStart" && targets.length == 1) {
				event.result = { bool: true, targets: targets };
			} else {
				const round = event.triggername == "roundStart";
				const next = player
					.chooseTarget(get.prompt(event.skill), `令一名${event.triggername == "roundStart" ? "体力值最小的" : ""}其他角色获得“傀”标记`, (card, player, target) => {
						if (get.event().round && !target.isMinHp()) {
							return false;
						}
						return target != player && !target.hasMark("zongkui_mark");
					})
					.set("ai", target => {
						const num = target.isMinHp() ? 0.5 : 1;
						return num * get.threaten(target);
					})
					.set("round", round);
				if (round) {
					next.set("forced", true);
				}
				event.result = await next.forResult();
			}
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			target.addMark("zongkui_mark", 1);
			await game.delayx();
		},
		subSkill: {
			mark: {
				marktext: "傀",
				intro: {
					name2: "傀",
					content: "mark",
				},
			},
		},
		ai: {
			combo: "guju",
			threaten: 1.4,
		},
	},
	xinfu_langxi: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.hp <= player.hp;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.name.slice(0, -5)), "对一名体力值不大于你的其他角色造成0-2点随机伤害", (card, player, target) => {
					return target !== player && target.hp <= player.hp;
				})
				.set("ai", target => {
					const player = get.event().player,
						att = get.attitude(player, target);
					if (att > 0) {
						return 0;
					}
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (get.mode() !== "identity" || player.identity !== "nei") {
				player.addExpose(0.3);
			}
			event.num = get.rand(1, 6);
			const num = Math.ceil(event.num / 2 - 1);
			player.popup(num ? get.cnNumber(num) + "点" : "🐏袭");
			await target.damage(Math.ceil(event.num / 2 - 1));
		},
		ai: {
			threaten: 1.7,
		},
	},
	xinfu_yisuan: {
		usable: 1,
		audio: 2,
		trigger: {
			player: "useCardEnd",
		},
		check(event, player) {
			return get.value(event.cards) + player.maxHp * 2 - 18 > 0;
		},
		prompt2(event, player) {
			return "你可以减1点体力上限，然后获得" + get.translation(event.cards.filterInD()) + "。";
		},
		filter(event, player) {
			return player.isPhaseUsing() && get.type(event.card) == "trick" && event.cards.filterInD().length > 0;
		},
		content() {
			player.loseMaxHp();
			player.gain(trigger.cards.filterInD(), "gain2", "log");
		},
	},
	xinfu_xingluan: {
		usable: 1,
		audio: 2,
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			if (get.type(event.card) == undefined) {
				return false;
			}
			return event.targets && event.targets.length == 1;
		},
		content() {
			var card = get.cardPile2(function (card) {
				return card.number == 6;
			}, "random");
			if (!card) {
				player.chat("无牌可得了吗");
				game.log("但是牌堆里面已经没有点数为6的牌了！");
				event.finish();
				return;
			}
			player.gain(card, "gain2");
		},
	},
	xinfu_lveming: {
		init(player) {
			player.storage.xinfu_lveming = 0;
		},
		mark: true,
		intro: {
			content: "已发动过#次",
		},
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target && target.countCards("e") < player.countCards("e");
		},
		content() {
			"step 0";
			var list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => get.strNumber(i));
			target
				.chooseControl(list)
				.set("ai", function () {
					return get.rand(0, 12);
				})
				.set("prompt", "请选择一个点数");
			"step 1";
			if (result.control) {
				target.$damagepop(result.control, "thunder");
				var num = result.index + 1;
				event.num = num;
			} else {
				target.$damagepop("K", "thunder");
				event.num = 13;
			}
			game.log(target, "选择的点数是", "#y" + get.strNumber(event.num));
			player.storage.xinfu_lveming++;
			player.judge(function (card) {
				if (card.number == _status.event.getParent("xinfu_lveming").num) {
					return 4;
				}
				return 0;
			});
			"step 2";
			if (result.bool == true) {
				target.damage(2);
			} else {
				var card = target.getCards("hej").randomGet();
				player.gain(card, target, "giveAuto", "bySelf");
			}
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					if (target.countCards("hej")) {
						return 0.92;
					}
					return 0;
				},
				target(player, target) {
					var numj = target.countCards("j");
					var numhe = target.countCards("he");
					if (numhe + numj > 0) {
						return (1.6 * numj - numhe) / (numj + numhe) - 0.3;
					}
					return -0.3;
				},
			},
			threaten: 1.1,
		},
	},
	xinfu_tunjun: {
		skillAnimation: true,
		animationColor: "metal",
		limited: true,
		enable: "phaseUse",
		audio: 2,
		filter(event, player) {
			return player.countMark("xinfu_lveming") > 0;
		},
		filterTarget: true,
		selectTarget: 1,
		content() {
			"step 0";
			player.awakenSkill(event.name);
			event.num = player.storage.xinfu_lveming;
			event.toequip = [];
			"step 1";
			var equip = get.cardPile(
				function (card) {
					var bool1 = true;
					for (var i = 0; i < event.toequip.length; i++) {
						if (get.type(card) == "equip" && get.subtype(card) == get.subtype(event.toequip[i])) {
							bool1 = false;
						}
					}
					return get.type(card) == "equip" && !event.toequip.includes(card) && target.hasEmptySlot(card) && bool1;
				},
				false,
				"random"
			);
			if (equip) {
				event.toequip.push(equip);
			} else {
				event.num = 0;
			}
			event.num--;
			"step 2";
			if (event.num > 0) {
				event.goto(1);
			}
			"step 3";
			for (var i = 0; i < event.toequip.length; i++) {
				target.chooseUseTarget(event.toequip[i], true).set("animate", false).set("nopopup", true);
			}
		},
		ai: {
			combo: "xinfu_lveming",
			order() {
				var player = _status.event.player,
					num = 0;
				for (var i = 1; i < 6; i++) {
					num += player.countEquipableSlot(i);
				}
				if (num <= 2) {
					return 6;
				}
				if (
					player.hp <= 2 ||
					!game.hasPlayer(current => {
						if (player == current || get.attitude(player, current) < 0 || current.hp <= 1) {
							return false;
						}
						return current.hp > 2 || current.countCards("hs") > 2;
					})
				) {
					return 1;
				}
				return 0;
			},
			result: {
				target(player, target) {
					var num = 0;
					for (var i = 1; i < 6; i++) {
						num += target.countEquipableSlot(i);
					}
					return num;
				},
			},
		},
	},
	xinfu_tanbei: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target;
		},
		content() {
			"step 0";
			if (target.countCards("hej") == 0) {
				event._result = { index: 1 };
			} else {
				target
					.chooseControl()
					.set("choiceList", ["令" + get.translation(player) + "随机获得你区域内的一张牌，然后其本回合内不能再对你使用牌。", "令" + get.translation(player) + "本回合内对你使用牌没有次数与距离限制。"])
					.set("ai", function () {
						var list = [0, 1];
						return list.randomGet();
					});
			}
			"step 1";
			player.addTempSkill("tanbei_effect3");
			if (result.index == 0) {
				var card = target.getCards("hej").randomGet();
				player.gain(card, target, "giveAuto", "bySelf");
				target.addTempSkill("tanbei_effect2");
			} else {
				target.addTempSkill("tanbei_effect1");
			}
		},
		ai: {
			order() {
				return [2, 4, 6, 8, 10].randomGet();
			},
			result: {
				target(player, target) {
					return -2 - target.countCards("h");
				},
			},
			threaten: 1.1,
		},
	},
	tanbei_effect3: {
		charlotte: true,
		mod: {
			targetInRange(card, player, target) {
				if (target.hasSkill("tanbei_effect1")) {
					return true;
				}
			},
			cardUsableTarget(card, player, target) {
				if (target.hasSkill("tanbei_effect1")) {
					return true;
				}
			},
			playerEnabled(card, player, target) {
				if (target.hasSkill("tanbei_effect2")) {
					return false;
				}
			},
		},
	},
	xinfu_sidao: {
		audio: 2,
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			if (player.hasSkill("xinfu_sidaoy") || !player.countCards("hs")) {
				return false;
			}
			if (!event.targets || !event.targets.length || !event.isPhaseUsing(player)) {
				return false;
			}
			var history = player.getHistory("useCard");
			var index = history.indexOf(event) - 1;
			if (index < 0) {
				return false;
			}
			var evt = history[index];
			if (!evt || !evt.targets || !evt.targets.length || !evt.isPhaseUsing(player)) {
				return false;
			}
			for (var i = 0; i < event.targets.length; i++) {
				if (evt.targets.includes(event.targets[i]) && lib.filter.filterTarget({ name: "shunshou" }, player, event.targets[i])) {
					return true;
				}
			}
			return false;
		},
		direct: true,
		content() {
			var targets = player.getLastUsed(1).targets;
			var next = player.chooseToUse();
			next.set(
				"targets",
				game.filterPlayer(function (current) {
					return targets.includes(current) && trigger.targets.includes(current);
				})
			);
			next.set("openskilldialog", get.prompt2("xinfu_sidao"));
			next.set("norestore", true);
			next.set("_backupevent", "xinfu_sidaox");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("xinfu_sidaox");
		},
	},
	xinfu_sidaox: {
		audio: "xinfu_sidao",
		sourceSkill: "xinfu_sidao",
		filterCard(card) {
			return get.itemtype(card) == "card";
		},
		position: "hs",
		viewAs: {
			name: "shunshou",
		},
		filterTarget(card, player, target) {
			return _status.event.targets && _status.event.targets.includes(target) && lib.filter.filterTarget.apply(this, arguments);
		},
		prompt: "将一张手牌当顺手牵羊使用",
		check(card) {
			return 7 - get.value(card);
		},
		onuse(links, player) {
			player.addTempSkill("xinfu_sidaoy");
		},
	},
	xinfu_sidaoy: {},
	tanbei_effect1: {
		charlotte: true,
	},
	tanbei_effect2: {
		charlotte: true,
	},
	xinfu_tunan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player;
		},
		content() {
			"step 0";
			event.cards = get.cards(1);
			player.showCards(get.translation(player) + "对" + get.translation(target) + "发动了【图南】", event.cards);
			"step 1";
			var card = cards[0];
			var bool1 = game.hasPlayer(function (current) {
				return target.canUse(card, current, false);
			});
			var bool2 = game.hasPlayer(function (current) {
				return target.canUse({ name: "sha" }, current);
			});
			if (bool1 && bool2) {
				target
					.chooseControl(function () {
						return 0;
					})
					.set("choiceList", ["使用" + get.translation(cards) + "。（没有距离限制）", "将" + get.translation(cards) + "当做【杀】使用。"])
					.set("ai", function () {
						return _status.event.choice;
					})
					.set("choice", target.getUseValue(card, false) > target.getUseValue({ name: "sha", cards: cards }) ? 0 : 1);
			} else if (bool1) {
				event.directindex = 0;
			} else if (bool2) {
				event.directindex = 1;
			} else {
				ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
				event.finish();
			}
			"step 2";
			var card = cards[0];
			if (result && typeof event.directindex != "number") {
				event.directindex = result.index;
			}
			if (event.directindex == 1) {
				target.chooseUseTarget({ name: "sha" }, cards, true, false).viewAs = false;
			} else {
				target.chooseUseTarget(card, true, false, "nodistance");
			}
		},
		ai: {
			order: 7,
			result: {
				target: 1,
			},
		},
	},
	xinfu_bijing: {
		audio: 2,
		subSkill: {
			lose: {
				trigger: {
					global: "phaseDiscardBegin",
				},
				audio: "xinfu_bijing",
				charlotte: true,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					return (
						player.getHistory("lose", function (evt) {
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("xinfu_bijing")) {
									return true;
								}
							}
						}).length > 0 && event.player.countCards("he") > 0
					);
				},
				forced: true,
				logTarget: "player",
				content() {
					trigger.player.chooseToDiscard(2, true, "he");
				},
				sub: true,
			},
			discard: {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				forced: true,
				charlotte: true,
				filter(event, player) {
					return player.hasCard(card => card.hasGaintag("xinfu_bijing") && player.canRecast(card), "h");
				},
				content() {
					player.recast(player.getCards("h", card => card.hasGaintag("xinfu_bijing") && player.canRecast(card)));
				},
				sub: true,
			},
		},
		trigger: {
			player: "phaseJieshuBegin",
		},
		direct: true,
		filter(player, event) {
			return event.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.chooseCard(get.prompt2("xinfu_bijing"), "h", [1, 2]).set("ai", function (card) {
				if (card.name == "shan") {
					return 6;
				}
				return 6 - get.value(card);
			});
			"step 1";
			if (result.bool) {
				player.logSkill("xinfu_bijing");
				player.addGaintag(result.cards, "xinfu_bijing");
				player.addSkill("xinfu_bijing_lose");
				player.addSkill("xinfu_bijing_discard");
			}
		},
	},
	xinfu_zhenxing: {
		audio: 2,
		trigger: {
			player: ["damageEnd", "phaseJieshuBegin"],
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl("一张", "两张", "三张", "cancel2")
				.set("prompt", get.prompt2(event.skill))
				.set("ai", function () {
					return 0;
				})
				.forResult();
			event.result = {
				bool: result.control !== "cancel2",
				cost_data: result.index + 1,
			};
		},
		async content(event, trigger, player) {
			const cards = get.cards(event.cost_data);
			await game.cardsGotoOrdering(cards);
			let result = await player
				.chooseButton(["【镇行】：请选择要获得的牌", cards])
				.set("filterButton", function (button) {
					var cards = _status.event.cards;
					for (var i = 0; i < cards.length; i++) {
						if (button.link != cards[i] && get.suit(cards[i]) == get.suit(button.link)) {
							return false;
						}
					}
					return true;
				})
				.set("ai", function (button) {
					return get.value(button.link);
				})
				.set("cards", cards)
				.forResult();
			if (result.bool) {
				player.gain(result.links, "gain2");
			}
		},
	},
	xinfu_qianxin: {
		audio: 2,
		group: ["xinfu_qianxin2"],
		enable: "phaseUse",
		usable: 1,
		onChooseToUse(event) {
			if (!game.online) {
				var num1 = game.players.length - 1;
				var player = event.player;
				var num2 = ui.cardPile.childElementCount;
				var num3 = num2;
				if (num1 > num2) {
					num3 = 0;
				} else if (player.storage.xinfu_qianxin) {
					for (var i = 0; i < num2; i++) {
						if (player.storage.xinfu_qianxin.includes(ui.cardPile.childNodes[i])) {
							num3 = 0;
							break;
						}
					}
				}
				event.set("qianxinNum", num3);
			}
		},
		filter(event, player) {
			return event.qianxinNum && event.qianxinNum > 0;
		},
		filterTarget(card, player, target) {
			return target != player;
		},
		filterCard: true,
		selectCard() {
			var num1 = game.players.length - 1;
			var num2 = _status.event.qianxinNum;
			return [1, Math.floor(num2 / num1)];
		},
		discard: false,
		check() {
			return -1;
		},
		delay: false,
		lose: false,
		prompt() {
			return "选择一名角色并将任意张手牌放置于牌堆中" + get.cnNumber(game.players.length) + "倍数的位置（先选择的牌在上）";
		},
		content() {
			"step 0";
			player.$throw(cards.length);
			player.storage.xinfu_qianxin = cards.slice(0);
			player.storage.xinfu_qianxin2 = target;
			//cards.reverse();
			player.lose(cards, ui.cardPile).insert_index = function (event, card) {
				var num1 = game.players.length,
					i = event.cards.indexOf(card);
				var num3 = num1 * (i + 1) - 1;
				return ui.cardPile.childNodes[num3];
			};
			"step 1";
			game.updateRoundNumber();
			game.log(player, "把", get.cnNumber(cards.length), "张牌放在了牌堆里");
			game.delayx();
		},
		ai: {
			order: 1,
			result: {
				target: -1,
			},
		},
	},
	xinfu_qianxin2: {
		subSkill: {
			dis: {
				mod: {
					maxHandcard(player, num) {
						return num - 2;
					},
				},
				sub: true,
			},
		},
		forced: true,
		locked: false,
		audio: "xinfu_qianxin",
		logTarget: "player",
		sourceSkill: "xinfu_qianxin",
		trigger: {
			global: "phaseDiscardBegin",
		},
		filter(event, player) {
			if (player.storage.xinfu_qianxin2 != event.player) {
				return false;
			}
			if (!player.storage.xinfu_qianxin) {
				return false;
			}
			var hs = event.player.getCards("h");
			var cs = player.storage.xinfu_qianxin;
			var bool = false;
			var history = event.player.getHistory("gain");
			for (var i = 0; i < history.length; i++) {
				for (var j = 0; j < history[i].cards.length; j++) {
					var card = history[i].cards[j];
					if (hs.includes(card) && cs.includes(card)) {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			"step 0";
			delete player.storage.xinfu_qianxin2;
			if (player.countCards("h") >= 4) {
				event._result = { index: 1 };
			} else {
				trigger.player
					.chooseControl()
					.set("choiceList", ["令" + get.translation(player) + "将手牌摸至四张", "令自己本回合的手牌上限-2"])
					.set("ai", function () {
						var player = _status.event.player;
						var source = _status.event.getParent().player;
						if (get.attitude(player, source) > 0) {
							return 0;
						}
						if (player.hp - player.countCards("h") > 1) {
							return 1;
						}
						return [0, 1].randomGet();
					});
			}
			"step 1";
			if (result.index == 0) {
				player.drawTo(4);
			} else {
				trigger.player.addTempSkill("xinfu_qianxin2_dis");
			}
		},
	},
	xinfu_fuhai: {
		subSkill: {
			next: {},
			previous: {},
		},
		audio: 2,
		group: ["fuhai_clear"],
		intro: {
			content: "已指定过#个目标",
		},
		enable: "phaseUse",
		filter(event, player) {
			if (player.hasSkill("xinfu_fuhai_next") && player.hasSkill("xinfu_fuhai_previous")) {
				return false;
			}
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			if (![player.next, player.previous].includes(target) || target.countCards("h") == 0) {
				return false;
			}
			if (player.hasSkill("xinfu_fuhai_next")) {
				return target == player.previous;
			}
			if (player.hasSkill("xinfu_fuhai_previous")) {
				return target == player.next;
			}
			return true;
		},
		line: false,
		content() {
			"step 0";
			event.side = target == player.next ? "next" : "previous";
			event.current = target;
			if (!player.storage.xinfu_fuhai) {
				player.storage.xinfu_fuhai = 1;
			}
			player.addTempSkill("xinfu_fuhai_" + event.side, "phaseUseAfter");
			"step 1";
			if (player.countCards("h") == 0 || event.current.countCards("h") == 0 || event.current == player) {
				event.finish();
				return;
			}
			var next = event.current[event.side];
			if (get.attitude(event.current, player) > 0) {
				if (get.attitude(next, target) <= 0 || next.countCards("h") == 0 || player.countCards("h") == 1) {
					event.stopm = true;
					event.stopt = true;
				} else {
					event.stopm = false;
					event.stopt = false;
				}
			} else {
				if (get.attitude(next, target) >= 0) {
					event.stopt = true;
					event.stopm = false;
				} else {
					event.stopt = false;
					event.stopm = false;
				}
			}
			player.markSkill("xinfu_fuhai");
			player.line(event.current, "green");
			player
				.chooseCard("请选择要展示的牌", true)
				.set("ai", function (card) {
					if (_status.event.stop) {
						return 14 - get.number(card);
					}
					return get.number(card);
				})
				.set("stop", event.stopm);
			"step 2";
			event.mes = result.cards[0];
			player.showCards(event.mes);
			"step 3";
			event.current
				.chooseCard("请选择要展示的牌", true)
				.set("ai", function (card) {
					if (_status.event.stop) {
						return get.number(card);
					}
					return 14 - get.number(card);
				})
				.set("stop", event.stopt);
			"step 4";
			event.tes = result.cards[0];
			event.current.showCards(event.tes);
			"step 5";
			var num1 = get.number(event.mes);
			var num2 = get.number(event.tes);
			if (num1 < num2) {
				event.current.discard(event.tes);
				game.asyncDraw([player, event.current], player.storage.xinfu_fuhai);
				player.addTempSkill("xinfu_fuhai_next", "phaseUseAfter");
				player.addTempSkill("xinfu_fuhai_previous", "phaseUseAfter");
				player.unmarkSkill("xinfu_fuhai");
			} else {
				player.discard(event.mes);
				player.storage.xinfu_fuhai++;
				event.current = event.current[event.side];
				if (player.countCards("h") > 0 && event.current.countCards("h") > 0 && event.current != player) {
					event.goto(1);
				}
			}
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					var hs = player.countCards("h");
					var side = target == player.next ? "next" : "previous";
					var current = player;
					for (var i = 0; i < hs; i++) {
						current = current[side];
						if (current == player || !current.countCards("h")) {
							return 0;
						}
						if (get.attitude(current, player) > 0) {
							return 1;
						}
					}
					return 0;
				},
			},
		},
	},
	fuhai_clear: {
		trigger: {
			player: "phaseAfter",
		},
		forced: true,
		silent: true,
		popup: false,
		sourceSkill: "xinfu_fuhai",
		filter(event, player) {
			return player.storage.xinfu_fuhai != undefined;
		},
		content() {
			player.unmarkSkill("xinfu_fuhai");
			delete player.storage.xinfu_fuhai;
		},
	},
	xz_xunxun: {
		filter(event, player) {
			var num = game.countPlayer(function (current) {
				return current.isDamaged();
			});
			return num >= 1 && !player.hasSkill("xunxun");
		},
		audio: 2,
		trigger: {
			player: "phaseDrawBegin1",
		},
		//priority:10,
		content() {
			"step 0";
			var cards = get.cards(4);
			game.cardsGotoOrdering(cards);
			var next = player.chooseToMove("恂恂：将两张牌置于牌堆顶", true);
			next.set("list", [["牌堆顶", cards], ["牌堆底"]]);
			next.set("filterMove", function (from, to, moved) {
				if (to == 1 && moved[1].length >= 2) {
					return false;
				}
				return true;
			});
			next.set("filterOk", function (moved) {
				return moved[1].length == 2;
			});
			next.set("processAI", function (list) {
				var cards = list[0][1].slice(0).sort(function (a, b) {
					return get.value(b) - get.value(a);
				});
				return [cards, cards.splice(2)];
			});
			"step 1";
			var top = result.moved[0];
			var bottom = result.moved[1];
			top.reverse();
			for (var i = 0; i < top.length; i++) {
				ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
			}
			for (i = 0; i < bottom.length; i++) {
				ui.cardPile.appendChild(bottom[i]);
			}
			game.updateRoundNumber();
			game.delayx();
		},
	},
	xinfu_xingzhao: {
		audio: 2,
		group: ["xz_xunxun", "xinfu_xingzhao2", "xinfu_xingzhao3"],
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			if (
				game.countPlayer(function (current) {
					return current.isDamaged();
				}) < 2
			) {
				return false;
			}
			const evt = event.getl(player);
			if (event.name == "equip" && event.player == player) {
				return true;
			}
			return evt && evt.es.length;
		},
		getIndex(event, player) {
			const evt = event.getl(player);
			if (event.name == "equip" && event.player == player && evt && evt.es.length) {
				return 2;
			}
			return 1;
		},
		content() {
			player.draw();
		},
		derivation: "xz_xunxun",
		mark: true,
		intro: {
			content(storage, player) {
				var num = game.countPlayer(function (current) {
					return current.isDamaged();
				});
				var str = "<li>造成的伤害+1";
				if (num >= 1) {
					str = "<li>视为拥有技能“恂恂”";
				}
				if (num >= 2) {
					str += "<br><li>装备牌进入或离开你的装备区时摸一张牌";
				}
				if (num >= 3) {
					str += "<br><li>始终跳过弃牌阶段";
				}
				if (num >= 4) {
					str += "<br><li>造成的伤害+1";
				}
				return str;
			},
		},
	},
	xinfu_xingzhao2: {
		audio: "xinfu_xingzhao",
		sourceSkill: "xinfu_xingzhao",
		trigger: {
			player: ["phaseJudgeBefore", "phaseDiscardBefore"],
		},
		forced: true,
		filter(event, player) {
			var num = game.countPlayer(function (current) {
				return current.isDamaged();
			});
			return num >= 3;
		},
		content() {
			trigger.cancel();
			game.log(player, "跳过了" + (trigger.name == "phaseJudge" ? "判定" : "弃牌") + "阶段");
		},
	},
	xinfu_xingzhao3: {
		audio: "xinfu_xingzhao",
		sourceSkill: "xinfu_xingzhao",
		trigger: {
			source: "damageBegin1",
		},
		forced: true,
		filter(event, player) {
			var num = game.countPlayer(function (current) {
				return current.isDamaged();
			});
			return num == 0 || num >= 4;
		},
		content() {
			trigger.num++;
		},
	},
	xinfu_dianhu: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return game.hasPlayer(current => current != player) && (event.name != "phase" || game.phaseNumber == 0);
		},
		content() {
			"step 0";
			player
				.chooseTarget("选择【点虎】的目标", lib.translate.xinfu_dianhu_info, true, function (card, player, target) {
					return target != player && !target.hasSkill("xinfu_dianhu2");
				})
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					if (att < 0) {
						return -att + 3;
					}
					return Math.random();
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				game.log(target, "成为了", "【点虎】", "的目标");
				if (get.mode() != "identity" || player.identity != "nei") {
					player.addExpose(0.25);
				}
				target.storage.xinfu_dianhu2 = player;
				target.addTempSkill("xinfu_dianhu2", { player: "die" });
			}
		},
	},
	xinfu_dianhu2: {
		mark: "character",
		intro: {
			content: "当你受到来自$的伤害或回复体力后，$摸一张牌",
		},
		nopop: true,
		trigger: {
			player: ["damageEnd", "recoverEnd"],
		},
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "xinfu_dianhu",
		filter(event, player) {
			if (player.storage.xinfu_dianhu2 && player.storage.xinfu_dianhu2.isIn()) {
				if (event.name == "damage") {
					return event.source == player.storage.xinfu_dianhu2;
				}
				return true;
			}
		},
		content() {
			"step 0";
			var target = player.storage.xinfu_dianhu2;
			target.logSkill("xinfu_dianhu");
			target.draw();
		},
		onremove: true,
	},
	xinfu_jianji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player;
		},
		content() {
			"step 0";
			target.draw();
			"step 1";
			var card = result[0];
			if (
				card &&
				game.hasPlayer(function (current) {
					return target.canUse(card, current);
				}) &&
				get.owner(card) == target
			) {
				target.chooseToUse({
					prompt: "是否使用" + get.translation(card) + "？",
					filterCard(cardx, player, target) {
						return cardx == _status.event.cardx;
					},
					cardx: card,
				});
			}
		},
		ai: {
			order: 7.5,
			result: {
				target: 1,
			},
		},
	},
	xinfu_lianpian: {
		audio: 2,
		usable: 3,
		trigger: {
			player: "useCardToPlayered",
		},
		frequent: true,
		filter(event, player) {
			if (!event.targets || !event.targets.length || event.getParent().triggeredTargets3.length > 1 || !event.isPhaseUsing(player)) {
				return false;
			}
			var evt = player.getLastUsed(1);
			if (!evt || !evt.targets || !evt.targets.length || !evt.isPhaseUsing(player)) {
				return false;
			}
			for (var i = 0; i < event.targets.length; i++) {
				if (evt.targets.includes(event.targets[i])) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			player.draw();
			"step 1";
			event.card = result[0];
			var ablers = player.getLastUsed(1).targets.slice(0);
			for (var i = 0; i < ablers.length; i++) {
				if (ablers[i] == player || !trigger.targets.includes(ablers[i])) {
					ablers.splice(i--, 1);
				}
			}
			if (event.card && get.owner(event.card) == player && ablers.length) {
				player
					.chooseTarget("是否将" + get.translation(event.card) + "交给其他角色？", function (card, player, target) {
						return _status.event.ablers.includes(target) && target != player;
					})
					.set("ablers", ablers).ai = function () {
					return false;
				};
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.give(event.card, result.targets[0], true);
			}
		},
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (player.isPhaseUsing() && (!player.storage.counttrigger || !player.storage.counttrigger.xinfu_lianpian || !player.storage.counttrigger.xinfu_lianpian < 3)) {
					var evt = player.getLastUsed();
					if (
						evt &&
						evt.targets &&
						evt.targets.length &&
						evt.isPhaseUsing(player) &&
						game.hasPlayer(function (current) {
							return evt.targets.includes(current) && player.canUse(card, current) && get.effect(current, card, player, player) > 0;
						})
					) {
						return num + 10;
					}
				}
			},
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					var evt = player.getLastUsed();
					if (evt && evt.targets.includes(target) && (!player.storage.counttrigger || !player.storage.counttrigger.xinfu_lianpian || !player.storage.counttrigger.xinfu_lianpian < 3) && player.isPhaseUsing(player)) {
						return [1.5, 0];
					}
				},
			},
		},
	},
	//糜芳傅士仁
	fengshi: {
		audio: "mffengshi",
		audioname: ["sp_mifangfushiren"],
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget) {
				return false;
			}
			return event.targets.some(target => {
				return (
					player.countCards("h") > target.countCards("h") &&
					target.countCards("he") > 0 &&
					player.hasCard(card => {
						return lib.filter.cardDiscardable(card, player, "fengshi");
					}, "he")
				);
			});
		},
		direct: true,
		async content(event, trigger, player) {
			const {
				result: { bool, targets },
			} = await player
				.chooseTarget(get.prompt("fengshi"), "弃置你与一名目标角色的各一张牌，然后令" + get.translation(event.card) + "对其造成的伤害+1", (card, player, target) => {
					const targets = get.event().getTrigger().targets;
					if (!targets.includes(target)) {
						return false;
					}
					return (
						player.countCards("h") > target.countCards("h") &&
						target.countCards("he") > 0 &&
						player.hasCard(card => {
							return lib.filter.cardDiscardable(card, player, "fengshi");
						}, "he")
					);
				})
				.set("ai", target => {
					let trigger = get.event().getTrigger(),
						player = trigger.player;
					if (get.attitude(player, target) > 0) {
						return 0;
					}
					let eff = get.effect(player, { name: "guohe" }, player, get.event().player) + get.effect(target, { name: "guohe" }, player, get.event().player);
					if (get.tag(trigger.card, "damage")) {
						eff += get.effect(target, trigger.card, trigger.player, get.event().player);
					}
					return eff;
				});
			if (bool) {
				const target = targets[0];
				player.logSkill("fengshi", target);
				await player.chooseToDiscard("he", true);
				await player.discardPlayerCard(target, "he", true);
				if (get.tag(trigger.card, "damage")) {
					var id = target.playerid;
					var map = trigger.getParent().customArgs;
					if (!map[id]) {
						map[id] = {};
					}
					if (typeof map[id].extraDamage != "number") {
						map[id].extraDamage = 0;
					}
					map[id].extraDamage++;
				}
			}
		},
		group: "fengshi_target",
		subSkill: {
			target: {
				trigger: { target: "useCardToTargeted" },
				filter(event, player) {
					if (event.player == event.target) {
						return false;
					}
					return (
						event.player.countCards("h") > player.countCards("h") &&
						event.player.countCards("he") > 0 &&
						player.hasCard(card => {
							return lib.filter.cardDiscardable(card, player, "fengshi");
						}, "he")
					);
				},
				audio: "mffengshi",
				audioname: ["sp_mifangfushiren"],
				logTarget(event, player) {
					return player == event.player ? event.target : event.player;
				},
				prompt2(event, player) {
					var target = lib.skill.dcmffengshi.logTarget(event, player);
					return "弃置你与" + get.translation(target) + "的各一张牌，然后令" + get.translation(event.card) + "的伤害+1";
				},
				check(event, player) {
					let viewer = get.event().player,
						user = event.player,
						target = event.target;
					if (get.attitude(player, target) > 0) {
						return 0;
					}
					let eff = get.effect(user, { name: "guohe" }, user, viewer) + get.effect(target, { name: "guohe" }, user, viewer);
					if (get.tag(event.card, "damage")) {
						eff += get.effect(target, event.card, player, viewer);
					}
					return eff > 0;
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					await player.chooseToDiscard("he", true);
					await player.discardPlayerCard(target, "he", true);
					if (get.tag(trigger.card, "damage")) {
						var id = player.playerid;
						var map = trigger.getParent().customArgs;
						if (!map[id]) {
							map[id] = {};
						}
						if (typeof map[id].extraDamage != "number") {
							map[id].extraDamage = 0;
						}
						map[id].extraDamage++;
					}
				},
			},
		},
	},
	dcmffengshi: {
		audio: "mffengshi",
		audioname: ["sp_mifangfushiren"],
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player, name) {
			if (event.player == event.target || event.targets.length != 1) {
				return false;
			}
			return (
				event.player.countCards("h") > event.target.countCards("h") &&
				event.target.countCards("he") > 0 &&
				player.hasCard(function (card) {
					return lib.filter.cardDiscardable(card, player, "dcmffengshi");
				}, "he")
			);
		},
		logTarget(event, player) {
			return player == event.player ? event.target : event.player;
		},
		prompt2(event, player) {
			var target = lib.skill.dcmffengshi.logTarget(event, player);
			return "弃置你与" + get.translation(target) + "的各一张牌，然后令" + get.translation(event.card) + "的伤害+1";
		},
		check(event, player) {
			let viewer = get.event().player,
				user = event.player,
				target = event.target;
			if (get.attitude(player, target) > 0) {
				return 0;
			}
			let eff = get.effect(user, { name: "guohe" }, user, viewer) + get.effect(target, { name: "guohe" }, user, viewer);
			if (get.tag(event.card, "damage")) {
				eff += get.effect(target, event.card, player, viewer);
			}
			return eff > 0;
		},
		content() {
			if (get.tag(trigger.card, "damage")) {
				trigger.getParent().baseDamage++;
			}
			var target = lib.skill.dcmffengshi.logTarget(trigger, player);
			player.chooseToDiscard("he", true);
			player.discardPlayerCard(target, "he", true);
		},
	},
	mffengshi: {
		audio: 2,
		audioname: ["sp_mifangfushiren"],
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		direct: true,
		preHidden: true,
		filter(event, player) {
			if (event.player == event.target || event.targets.length != 1) {
				return false;
			}
			if (player != event.player && !player.hasSkill("mffengshi")) {
				return false;
			}
			return event.player.countCards("h") > event.target.countCards("h") && event.target.countCards("he") > 0;
		},
		content() {
			"step 0";
			event.source = trigger.player;
			event.target = player == trigger.target ? trigger.player : trigger.target;
			var str;
			if (player == trigger.player) {
				str = "弃置自己的和该角色";
			} else {
				str = "令其弃置其与你的";
			}
			var next = trigger.player
				.chooseBool("是否对" + get.translation(trigger.target) + "发动【锋势】？", str + "的各一张牌，然后令" + get.translation(trigger.card) + "的伤害+1")
				.set("ai", () => get.event().bool)
				.set(
					"bool",
					(function () {
						if (get.attitude(trigger.player, player) > 0) {
							return 0;
						}
						let eff = get.effect(trigger.player, { name: "guohe" }, player, trigger.player) + get.effect(trigger.target, { name: "guohe" }, player, trigger.player);
						if (get.tag(trigger.card, "damage")) {
							eff += get.effect(trigger.target, trigger.card, trigger.player, trigger.player);
						}
						return eff > 0;
					})()
				);
			if (player == next.player) {
				next.setHiddenSkill("mffengshi");
			}
			"step 1";
			if (result.bool) {
				if (player == source) {
					player.logSkill("mffengshi", target);
				} else {
					player.logSkill("mffengshi");
					source.line(player, "green");
				}
				if (get.tag(trigger.card, "damage")) {
					trigger.getParent().baseDamage++;
				}
				player.chooseToDiscard("he", true);
			} else {
				event.finish();
			}
			"step 2";
			if (target.countDiscardableCards(player, "he") > 0) {
				player.discardPlayerCard(target, "he", true);
			}
		},
	},
};

export default skills;
