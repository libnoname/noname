import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//君霸天下
	//君刘备
	jun_renwang: {
		audio: "rerende",
		enable: "phaseUse",
		filterCard: true,
		selectCard: [2, Infinity],
		position: "he",
		discard: false,
		lose: false,
		delay: 0,
		filterTarget(card, player, target) {
			return player != target;
		},
		check(card) {
			if (ui.selected.cards.length > 1) {
				return 0;
			}
			const bool = ui.selected.cards?.some(cardx => cardx.name == "du");
			if (bool && card.name == "du") {
				return 20;
			}
			return 10 - get.value(card);
		},
		allowChooseAll: true,
		async content(event, trigger, player) {
			await player.give(event.cards, event.target);
			await player.recover();
			player.addTempSkill("jun_renwang_effect");
			player.addMark("jun_renwang_effect", 1, false);
		},
		ai: {
			order(skill, player) {
				if (player.hp < player.maxHp && player.countCards("h") > 1) {
					return 10;
				}
				return 1;
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						return target.hasSkillTag("nodu") ? 0 : -10;
					}
					if (target.hasJudge("lebu")) {
						return 0;
					}
					const nh = target.countCards("h");
					const np = player.countCards("h");
					if (player.hp == player.maxHp || player.countCards("h") <= 1) {
						if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) {
							return 0;
						}
					}
					return Math.max(1, 5 - nh);
				},
			},
			effect: {
				target_use(card, player, target) {
					if (player == target && get.type(card) == "equip") {
						if (player.countCards("e", { subtype: get.subtype(card) })) {
							const players = game.filterPlayer();
							for (let i = 0; i < players.length; i++) {
								if (players[i] != player && get.attitude(player, players[i]) > 0) {
									return 0;
								}
							}
						}
					}
				},
			},
			threaten: 0.8,
		},
		subSkill: {
			effect: {
				onremove: true,
				charlotte: true,
				marktext: "武",
				intro: {
					content: "出杀次数+#",
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("jun_renwang_effect");
						}
					},
				},
			},
		},
	},
	//君曹操
	jun_xiongtu: {
		audio: "sbjianxiong",
		trigger: { player: "changeHpAfter" },
		filter(event, player) {
			return event.changedHp != 0;
		},
		frequent: true,
		async content(event, trigger, player) {
			const list = [];
			for (let position of ["c", "d", "ej"]) {
				const card = get.cardPile(
					card => {
						return get.is.damageCard(card) && position.includes(get.position(card, true));
					},
					"field",
					"random"
				);
				if (card) {
					if (position == "ej") {
						const owner = get.owner(card);
						if (owner) {
							player.line(owner, "green");
							owner.$give(card, player, false);
							await game.delayx();
						}
					}
					list.push(card);
				}
			}
			const cards = Array.from(ui.ordering.childNodes)
				.slice(0)
				.filter(card => {
					return card && get.tag(card, "damage") && get.position(card, true) == "o";
				});
			if (cards.length) {
				list.push(cards.randomGet());
			}
			if (list.length) {
				await player.gain(list, "gain2");
			}
		},
	},
	//君孙策
	jun_jiang: {
		audio: "sbjiang",
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			return get.color(event.card) == "red";
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
		},
	},
	jun_zhiyang: {
		audio: ["yingyang1.mp3", "yingyang2.mp3"],
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			return event.source?.canCompare(player);
		},
		logTarget: "source",
		async content(event, trigger, player) {
			await trigger.source.useSkill("zhiba_global", [player]);
			await trigger.source.useSkill("zhiba_global", [player]);
		},
		derivation: ["zhiba"],
		group: "jun_zhiyang_number",
		subSkill: {
			number: {
				audio: "jun_zhiyang",
				trigger: {
					player: "compare",
					target: "compare",
				},
				filter(event, player) {
					if (event.player == player) {
						return !event.iwhile && get.color(event.card1) == "red";
					} else {
						return get.color(event.card2) == "red";
					}
				},
				forced: true,
				locked: false,
				content() {
					game.log(player, "拼点牌点数视为", "#yK");
					if (player == trigger.player) {
						trigger.num1 = 13;
					} else {
						trigger.num2 = 13;
					}
				},
			},
		},
	},
	//君袁绍
	jun_hefa: {
		audio: "olsbhetao",
		enable: "phaseUse",
		usable: 1,
		viewAs: {
			name: "sha",
			storage: {
				hefa: true,
			},
		},
		viewAsFilter(player) {
			return player.countCards("hs") > 0;
		},
		selectCard() {
			return [1, Infinity];
		},
		selectTarget() {
			let card = get.card(),
				player = get.player();
			if (card == undefined) {
				return;
			}
			let range = [1, Math.max(1, ui.selected.cards.length)];
			game.checkMod(card, player, range, "selectTarget", player);
			return range;
		},
		complexCard: true,
		filterCard: true,
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
			let player = _status.event.player,
				cardx = get.autoViewAs({ name: "sha" }, ui.selected.cards.concat(card));
			if (
				game.countPlayer(function (current) {
					return (_status.event.filterTarget || lib.filter.filterTarget)(cardx, player, current) && get.effect_use(current, cardx, player, player) > 0;
				}) <= ui.selected.cards.length
			) {
				return 0;
			}
			return 7 - get.value(card);
		},
		position: "hs",
		onuse(links, player) {
			_status.event.addCount = false;
		},
		ai: {
			order: () => get.order({ name: "sha" }) - 0.1,
		},
		locked: false,
		group: "jun_hefa_draw",
		subSkill: {
			draw: {
				trigger: {
					source: "damageSource",
				},
				filter(event, player) {
					return event?.card?.storage?.hefa && player.countCards("h") < player.maxHp;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.drawTo(player.maxHp);
				},
			},
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.storage?.hefa) {
					return Infinity;
				}
			},
			targetInRange(card, player, num) {
				if (card.storage?.hefa) {
					return true;
				}
			},
		},
	},
	//君张角
	jun_huanlei: {
		audio: "xinleiji",
		trigger: {
			player: ["judgeEnd", "useCardAfter", "respondAfter"],
		},
		disableReason: ["暴虐", "助祭", "弘仪", "孤影", "唤雷"],
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			if (event.name == "judge") {
				return !lib.skill.xinleiji_misa.disableReason.includes(event.judgestr);
			}
			return ["shan", "shandian"].includes(event.card.name);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					if (target.hasSkill("hongyan")) {
						return 1;
					}
					return get.damageEffect(target, player, player, "thunder");
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			const next = target.judge(card => {
				if (get.suit(card) == "spade") {
					return -4;
				}
				return -1;
			});
			const result = await next.forResult();
			if (result?.suit == "spade") {
				await target.damage(2, "thunder");
			} else if (target.countCards("h")) {
				await player.gainPlayerCard(target, "h", true);
			}
		},
		ai: {
			mingzhi: false,
			useShan: true,
			effect: {
				target_use(card, player, target, current) {
					if (
						get.tag(card, "respondShan") &&
						!player.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: target,
								card: card,
							},
							true
						) &&
						game.hasPlayer(function (current) {
							return get.attitude(target, current) < 0 && get.damageEffect(current, target, target, "thunder") > 0;
						})
					) {
						if (card.name === "sha") {
							if (!target.mayHaveShan(player, "use")) {
								return;
							}
						} else if (!target.mayHaveShan(player)) {
							return 1 - 0.1 * Math.min(5, target.countCards("hs"));
						}
						if (!target.hasSkillTag("rejudge")) {
							return [1, 1];
						}
						let pos = player.hasSkillTag("viewHandcard", null, target, true) ? "hes" : "e";
						if (
							target.hasCard(function (cardx) {
								return get.suit(cardx) === "spade";
							}, pos)
						) {
							return [1, 4];
						}
						if (pos === "e") {
							return [1, Math.min(4, 1 + 0.75 * Math.max(1, target.countCards("hs")))];
						}
						return [1, 1];
					}
				},
			},
		},
	},
	jun_xiandao: {
		audio: "xinguidao",
		mod: {
			aiOrder(player, card, num) {
				if (num > 0 && get.itemtype(card) == "card" && get.color(card) == "black" && get.type(card) == "equip") {
					num * 1.35;
				}
			},
			aiValue(player, card, num) {
				if (num > 0 && get.itemtype(card) == "card" && get.color(card) == "black") {
					return num * 1.15;
				}
			},
			aiUseful(player, card, num) {
				if (num > 0 && get.itemtype(card) == "card" && get.color(card) == "black") {
					return num * 1.35;
				}
			},
		},
		locked: false,
		trigger: { global: "judge" },
		filter(event, player) {
			return player.countCards("hes", { color: "black" }) > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(`${get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，${get.prompt(event.skill)}`, "hes", card => {
					const player = get.player();
					if (get.color(card) !== "black") {
						return false;
					}
					const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") {
						return mod2;
					}
					const mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") {
						return mod;
					}
					return true;
				})
				.set("ai", card => {
					const trigger = get.event().getTrigger();
					const { player, judging } = get.event();
					const result = trigger.judge(card) - trigger.judge(judging);
					const attitude = get.attitude(player, trigger.player);
					if (attitude == 0 || result == 0) {
						if (trigger.player != player) {
							return 0;
						}
						if (
							game.hasPlayer(function (current) {
								return get.attitude(player, current) < 0;
							})
						) {
							var checkx = lib.skill.xinleiji.judgeCheck(card, true) - lib.skill.xinleiji.judgeCheck(judging);
							if (checkx > 0) {
								return checkx;
							}
						}
						return 0;
					}
					let val = get.value(card);
					if (get.subtype(card) == "equip2") {
						val /= 2;
					} else {
						val /= 7;
					}
					if (attitude == 0 || result == 0) {
						return 0;
					}
					if (attitude > 0) {
						return result - val;
					}
					return -result - val;
				})
				.set("judging", trigger.player.judging[0])
				.forResult();
		},
		popup: false,
		async content(event, trigger, player) {
			const next = player.respond(event.cards, event.name, "highlight", "noOrdering");
			await next;
			const { cards } = next;
			if (cards?.length) {
				player.$gain2(trigger.player.judging[0]);
				await player.gain(trigger.player.judging[0]);
				await player.draw("nodelay");
				trigger.player.judging[0] = cards[0];
				trigger.orderingCards.addArray(cards);
				game.log(trigger.player, "的判定牌改为", cards);
				await game.delay(2);
			}
		},
		ai: {
			rejudge: true,
			tag: { rejudge: 1 },
		},
	},
	//君曹丕
	jun_cuanzun: {
		audio: "sbxingshang",
		trigger: {
			global: "die",
		},
		frequent(event) {
			return !event.player.countCards("he", "du");
		},
		logTarget: "player",
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			return player.isDamaged() || event.player.countCards("he") > 0;
		},
		async content(event, trigger, player) {
			const cards = trigger.player.getCards("he");
			if (cards.length) {
				await player.gain(cards, trigger.player, "giveAuto", "bySelf");
			}
			if (player.isDamaged()) {
				await player.recover();
			}
		},
	},
	jun_liufang: {
		audio: "sbfangzhu",
		enable: "phaseUse",
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			return event.name == "damage" || !player.hasSkill("jun_liufang_used");
		},
		async cost(event, trigger, player) {
			const draw = player.getDamagedHp();
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "令一名其他角色翻面" + (draw > 0 ? "并摸" + get.cnNumber(draw) + "张牌" : ""), function (card, player, target) {
					return player != target;
				})
				.setHiddenSkill(event.skill)
				.set("ai", target => {
					if (target.hasSkillTag("noturn")) {
						return 0;
					}
					const player = _status.event.player;
					const current = _status.currentPhase;
					const dis = current ? get.distance(current, target, "absolute") : 1;
					const draw = player.getDamagedHp();
					const att = get.attitude(player, target);
					if (att == 0) {
						return target.hasJudge("lebu") ? Math.random() / 3 : Math.sqrt(get.threaten(target)) / 5 + Math.random() / 2;
					}
					if (att > 0) {
						if (target.isTurnedOver()) {
							return att + draw;
						}
						if (draw < 4) {
							return -1;
						}
						if (current && target.getSeatNum() > current.getSeatNum()) {
							return att + draw / 3;
						}
						return (10 * Math.sqrt(Math.max(0.01, get.threaten(target)))) / (3.5 - draw) + dis / (2 * game.countPlayer());
					} else {
						if (target.isTurnedOver()) {
							return att - draw;
						}
						if (draw >= 5) {
							return -1;
						}
						if (current && target.getSeatNum() <= current.getSeatNum()) {
							return -att + draw / 3;
						}
						return (4.25 - draw) * 10 * Math.sqrt(Math.max(0.01, get.threaten(target))) + (2 * game.countPlayer()) / dis;
					}
				})
				.forResult();
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			if (trigger?.name != "damage") {
				player.addTempSkill("jun_liufang_used", "phaseChange");
			}
			const target = event.targets[0],
				num = player.getDamagedHp();
			if (num > 0) {
				await target.draw(num);
			}
			await target.turnOver();
			if (num > 1) {
				await target.executeDelayCardEffect("shandian");
			}
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					if (target.isTurnedOver()) {
						return 5;
					}
					return -3;
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	//君刘禅
	jun_fuxiang: {
		audio: "refangquan",
		trigger: {
			player: "phaseUseBefore",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					if (target.hasJudge("lebu") || get.attitude(player, target) <= 4) {
						return 0;
					}
					return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1) > 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			trigger.cancel();
			player
				.when("phaseDiscardAfter")
				.filter(evt => evt.getParent() == trigger.getParent())
				.step(async (event, trigger, player) => {
					const cards = [];
					game.getGlobalHistory("cardMove", evt => {
						if (evt.getParent("phaseDiscard") != trigger) {
							return false;
						}
						if (evt.name == "lose" && (evt.type != "discard" || evt.position != ui.discardPile)) {
							return false;
						}
						cards.addArray(evt.cards.filterInD("d"));
					});
					if (cards.length) {
						player.logSkill("jun_fuxiang", [target]);
						await target.gain(cards, "gain2");
					}
				});
			target.insertPhase();
		},
	},
	jun_leling: {
		audio: "xiangle_re_liushan",
		trigger: {
			target: "useCardToTarget",
		},
		forced: true,
		preHidden: true,
		logTarget: "player",
		filter(event, player) {
			return event.card.name == "sha" || get.type(event.card) == "delay";
		},
		async content(event, trigger, player) {
			const eff = get.effect(player, trigger.card, trigger.player, trigger.player),
				type = get.type2(trigger.card);
			const result =
				trigger.player == player
					? {
							bool: false,
						}
					: await trigger.player
							.chooseToGive(player, `乐陵：交给${get.translation(player)}一张${get.translation(type)}手牌，否则此牌对其无效`, card => {
								return get.type2(card) == get.event().cardType;
							})
							.set("ai", card => {
								if (get.event().eff > 0) {
									return 10 - get.value(card);
								}
								return 0;
							})
							.set("cardType", type)
							.set("eff", eff)
							.forResult();
			if (!result?.bool) {
				trigger.getParent().excluded.add(player);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if ((card.name == "sha" || get.type(card) == "delay") && get.attitude(player, target) < 0) {
						if (_status.event.name == "jun_leling") {
							return;
						}
						if (get.attitude(player, target) > 0 && current < 0) {
							return "zerotarget";
						}
						const bs = player.getCards("h", { type: get.type2(card) });
						bs.remove(card);
						if (card.cards) {
							bs.removeArray(card.cards);
						} else {
							bs.removeArray(ui.selected.cards);
						}
						if (!bs.length) {
							return "zerotarget";
						}
						if (player.hasSkill("jiu") || player.hasSkill("tianxianjiu")) {
							return;
						}
						if (bs.length <= 2) {
							for (let i = 0; i < bs.length; i++) {
								if (get.value(bs[i]) < 7) {
									return [1, 0.5, 1, -0.5];
								}
							}
							return [1, 0, 0.3, 0];
						}
						return [1, 0.5, 1, -0.5];
					}
				},
			},
		},
	},
	//君孙权
	jun_henglv: {
		audio: "rezhiheng",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h");
		},
		filterCard: lib.filter.cardDiscardable,
		selectCard: [1, Infinity],
		lose: false,
		discard: false,
		check(card) {
			let player = _status.event.player;
			if (get.position(card) == "e") {
				let subs = get.subtypes(card);
				if (subs.includes("equip2") || subs.includes("equip3")) {
					return player.getHp() - get.value(card);
				}
			}
			return 6 - get.value(card);
		},
		allowChooseAll: true,
		async content(event, trigger, player) {
			const num = (player.getStat("skill")[event.name] || 1) - 1;
			if (num > 0) {
				await player.loseHp(num);
			}
			event.cards = event.cards.filterInD("h");
			await player.discard(event.cards);
			let cards = event.cards.filter(card => card.name == "tao");
			while (cards.length) {
				const result =
					cards.length > 1
						? await player
								.chooseButtonTarget({
									createDialog: [`衡虑：是否分配弃置的【桃】？`, cards],
									selectButton: [1, Infinity],
									cardsx: cards,
									filterTarget: true,
									ai1(button) {
										return get.value(button.link);
									},
									ai2(target) {
										const player = get.player();
										const card = ui.selected.buttons[0].link;
										if (card) {
											let eff = get.value(card, target) * get.attitude(player, target);
											if (player.hasSkill("jiuyuan") && target != player) {
												eff *= 2;
											}
											return eff;
										}
										return 1;
									},
								})
								.forResult()
						: await player
								.chooseTarget(`衡虑：是否令一名角色获得${get.translation(cards)}？`)
								.set("ai", target => {
									const { player, cardx: card } = get.event();
									let eff = get.value(card, target) * get.attitude(player, target);
									if (player.hasSkill("jiuyuan") && target != player) {
										eff *= 2;
									}
									return eff;
								})
								.set("cardx", cards[0])
								.forResult();
				if (result?.bool) {
					if (!result?.links?.length) {
						result.links = cards.slice(0);
					}
					cards.removeArray(result.links);
					player.line(result.targets, "green");
					const gainEvent = result.targets[0].gain(result.links, "gain2");
					gainEvent.giver = player;
					await gainEvent;
				} else {
					break;
				}
			}
			await player.draw(event.cards.length + num);
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					const num = player.getStat("skill").jun_henglv || 0;
					if (num > 1 || (player.hp < 2 && !player.countCards("hs", "tao"))) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	//君刘协
	jun_tianze: {
		audio: "tianming",
		trigger: {
			target: "useCardToTargeted",
		},
		check(event, player) {
			let cards = player.getCards("h");
			if (cards.length <= 2) {
				for (let i = 0; i < cards.length; i++) {
					if (cards[i].name == "shan" || cards[i].name == "tao") {
						return false;
					}
				}
			}
			return true;
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		async cost(event, trigger, player) {
			const num = Math.min(2, player.countCards("he"));
			let bool = true;
			if (num <= 2 && player.getCards("he").some(card => ["shan", "tao"].includes(card.name))) {
				bool = false;
			}
			event.result =
				num > 0
					? await player
							.chooseToDiscard(get.prompt2(event.skill), num, "he")
							.set("boolx", bool)
							.set("ai", card => {
								if (get.event().boolx) {
									return 11 - get.value(card);
								}
								return 0;
							})
							.set("chooseonly", true)
							.forResult()
					: await player.chooseBool(get.prompt2(event.skill)).forResult();
		},
		async content(event, trigger, player) {
			if (event?.cards?.length) {
				await player.discard(event.cards);
			}
			const cards = get.cards(4, true);
			const result = await player
				.chooseButton(["天择：获得其中两张", cards], 2, true)
				.set("ai", button => {
					return get.buttonValue(button);
				})
				.forResult();
			if (result.bool) {
				await player.gain(result.links, "draw");
			}
			const targets = game.filterPlayer(current => {
				if (current == player) {
					return false;
				}
				return current.isMaxHandcard() || current.isMaxHp();
			});
			if (!targets.length) {
				return;
			}
			const result2 =
				targets.length > 1
					? await player
							.chooseTarget("令一名手牌数或体力值最大的其他角色执行【天择】", true, (card, player, target) => {
								if (target == player) {
									return false;
								}
								return target.isMaxHandcard() || target.isMaxHp();
							})
							.set("ai", target => {
								const player = get.player();
								return get.attitude(player, target);
							})
							.forResult()
					: {
							bool: true,
							targets: targets,
						};
			if (result2.bool) {
				const target = result2.targets[0];
				player.line(target, "green");
				if (target.countCards("he")) {
					await target.chooseToDiscard(2, "he", true);
				}
				const cards2 = get.cards(4, true);
				const result3 = await target
					.chooseButton(["天择：获得其中两张", cards2], 2, true)
					.set("ai", button => {
						return get.buttonValue(button);
					})
					.forResult();
				if (result3.bool) {
					await target.gain(result3.links, "draw");
				}
			}
		},
		ai: {
			effect: {
				target_use(card, player, target, current) {
					if (card.name == "sha") {
						return [1, 0.5];
					}
				},
			},
		},
	},
	jun_zhaoshou: {
		audio: "mizhao",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		selectCard: -1,
		filterTarget(card, player, target) {
			return player != target;
		},
		discard: false,
		lose: false,
		delay: false,
		ai: {
			order: 1,
			result: {
				player: 0,
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					if (player.countCards("h") > 1) {
						return 1;
					}
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].countCards("h") && players[i] != target && players[i] != player && get.attitude(player, players[i]) < 0) {
							break;
						}
					}
					if (i == players.length) {
						return 1;
					}
					return -2 / (target.countCards("h") + 1);
				},
			},
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cards = event.cards;
			await player.give(cards, target, false);
			if (!target.countCards("h")) {
				return;
			}
			if (!game.hasPlayer(current => target.canCompare(current) && current != player)) {
				return;
			}
			const result = await player
				.chooseTarget(true, "选择拼点目标", (card, player, target) => {
					return get.event().targetx.canCompare(target) && target != player;
				})
				.set("ai", target => {
					const { player, targetx } = get.event();
					let eff = get.effect(target, { name: "sha" }, targetx, player),
						att = get.attitude(player, target);
					if (att > 0) {
						return eff - 10;
					}
					return eff;
				})
				.set("targetx", target)
				.set("forceDie", true)
				.forResult();
			if (!result.bool || !result?.targets?.length) {
				return;
			}
			const targetx = result.targets[0];
			target.line(targetx, "green");
			const result2 = await target.chooseToCompare(targetx).forResult();
			if (!result2.tie) {
				const user = result2.bool ? target : targetx;
				const card = new lib.element.VCard({ name: "sha", isCard: true });
				if (user.hasUseTarget(card, false)) {
					await user.chooseUseTarget(card, "nodistance", false, true);
				}
			}
		},
	},
	jun_gezhi: {
		audio: "twgezhi",
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			return (
				player
					.getCards("he")
					.map(card => get.type2(card))
					.toUniqued().length > 2
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), 3, "he")
				.set("filterCard", (card, player) => {
					if (!lib.filter.cardRecastable(card, player)) {
						return false;
					}
					return !ui.selected.cards?.some(cardx => get.type2(cardx) == get.type2(card));
				})
				.set("complexCard", true)
				.set("ai", card => {
					return 9 - get.value(card);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.recast(event.cards);
			const result = await player
				.chooseButtonTarget({
					createDialog: [
						"革制：请选择一项",
						[
							[
								["recover", "回复1点体力"],
								["limit", "使用下一张牌无次数限制"],
								["damage", "对一名其他角色造成1点伤害"],
							],
							"textbutton",
						],
					],
					filterButton(button) {
						const { player, targetx: targets } = get.event();
						if (button.link == "recover") {
							return player.isDamaged();
						}
						if (button.link == "damage") {
							return game.hasPlayer(current => player != current && !targets.includes(current));
						}
						return true;
					},
					filterTarget(card, player, target) {
						if (ui.selected.buttons[0]?.link != "damage") {
							return false;
						}
						const { targetx: targets } = get.event();
						return target != player && !targets.includes(target);
					},
					forced: true,
					complexSelect: true,
					complexTarget: true,
					selectTarget() {
						if (ui.selected.buttons[0]?.link != "damage") {
							return -1;
						}
						return 1;
					},
					ai1(button) {
						const { player, targetx: targets } = get.event();
						if (button.link == "recover") {
							return get.recoverEffect(player, player, player);
						}
						if (button.link == "damage") {
							const target = game
								.filterPlayer(current => {
									return player != current && !targets.includes(current);
								})
								.maxBy(current => get.damageEffect(current, player, player));
							return get.damageEffect(target, player, player);
						}
						return 1;
					},
					ai2(target) {
						const player = get.player();
						return get.damageEffect(target, player, player);
					},
				})
				.set("targetx", player.getStorage("jun_gezhi_used"))
				.forResult();
			if (result?.bool) {
				if (result.links[0] == "recover") {
					await player.recover();
				}
				if (result.links[0] == "limit") {
					player.addSkill("jun_gezhi_unlimit");
				}
				if (result.links[0] == "damage") {
					player.addSkill("jun_gezhi_used");
					player.markAuto("jun_gezhi_used", result.targets);
					player.line(result.targets, "green");
					await result.targets[0].damage();
				}
			}
		},
		onremove(player) {
			player.removeSkill("jun_gezhi_used");
		},
		subSkill: {
			unlimit: {
				charlotte: true,
				mod: {
					cardUsable: () => Infinity,
				},
				trigger: {
					player: "useCard1",
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						const stat = player.getStat().card,
							name = trigger.card.name;
						if (typeof stat[name] == "number") {
							stat[name]--;
						}
					}
				},
				mark: true,
				intro: {
					content: "使用的下一张牌无任何次数限制",
				},
			},
			used: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "已对$造成过伤害",
				},
			},
		},
	},
	jun_julian: {
		audio: "jsrgjulian",
		trigger: {
			player: "phaseJieshuBegin",
		},
		zhuSkill: true,
		filter(event, player, name, target) {
			return player.hasZhuSkill("jun_julian") && target.isIn();
		},
		getIndex(event, player) {
			return game.filterPlayer(current => current != player && current.group == "qun");
		},
		async cost(event, trigger, player) {
			const target = event.indexedData;
			event.result = await target.chooseBool(get.prompt2(event.skill, target, player)).forResult();
			event.result.targets = [target];
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw(2);
			if (target.countCards("he")) {
				await player.gainPlayerCard(target, "he", true);
			}
		},
	},
};

export default skills;
